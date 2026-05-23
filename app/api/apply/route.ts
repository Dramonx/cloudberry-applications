import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SEVEN_DAYS = 60 * 60 * 24 * 7;
const APPROVAL_SCORE = 70;
const MIN_AVERAGE_ANSWER_WORDS = 12;

function normalizeDiscord(discord: string) {
  return discord.trim().toLowerCase().replace(/\s+/g, "");
}

function truncate(text: string, max = 750) {
  if (!text) return "N/A";
  return text.length > max ? text.slice(0, max - 3) + "..." : text;
}

function chunkText(text: string, maxLength = 1700) {
  const safeText = text || "N/A";
  const chunks: string[] = [];
  let remaining = safeText;

  while (remaining.length > maxLength) {
    let splitAt = remaining.lastIndexOf("\n\n", maxLength);
    if (splitAt < maxLength * 0.5) splitAt = remaining.lastIndexOf("\n", maxLength);
    if (splitAt < maxLength * 0.5) splitAt = remaining.lastIndexOf(" ", maxLength);
    if (splitAt < maxLength * 0.5) splitAt = maxLength;

    chunks.push(remaining.slice(0, splitAt).trim());
    remaining = remaining.slice(splitAt).trim();
  }

  if (remaining) chunks.push(remaining);
  return chunks.length ? chunks : ["N/A"];
}

function listToText(value: unknown) {
  if (Array.isArray(value)) return value.map(String).join("\n") || "N/A";
  if (typeof value === "string") return value || "N/A";
  return "N/A";
}

function countWords(value: unknown) {
  return String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function inspectAnswerQuality(answers: unknown[]) {
  const wordCounts = answers.map(countWords);
  const totalWords = wordCounts.reduce((total, count) => total + count, 0);
  const averageWords = answers.length ? totalWords / answers.length : 0;
  const missingAnswers = wordCounts.filter((count) => count === 0).length;
  const punishmentOnlyAnswers = answers.filter((answer) => {
    const text = String(answer || "").toLowerCase();
    const mentionsPunishment = /\b(ban|banned|tempban|temp ban|mute|muted|kick|punish|punishment)\b/.test(text);
    const mentionsProcess =
      /\b(warn|warning|evidence|proof|screenshot|clip|record|document|log|report|higher|staff|owner|manager|admin|moderator|escalate|ask)\b/.test(
        text
      );

    return mentionsPunishment && !mentionsProcess;
  }).length;
  const concerns: string[] = [];

  if (missingAnswers > 0) {
    concerns.push("One or more questions were left unanswered.");
  }

  if (averageWords < MIN_AVERAGE_ANSWER_WORDS) {
    concerns.push("Answers are too brief for staff screening.");
  }

  if (punishmentOnlyAnswers >= 2) {
    concerns.push("Multiple answers jump to punishment without warnings, evidence, or escalation.");
  }

  return {
    shouldDecline: concerns.length > 0,
    concerns,
  };
}

function normalizeScore(value: unknown) {
  const rawScore = Number(value);
  if (!Number.isFinite(rawScore)) return 0;

  const percentageScore = rawScore > 0 && rawScore <= 10 ? rawScore * 10 : rawScore;
  return Math.max(0, Math.min(100, Math.round(percentageScore)));
}

function applyScreeningGuardrails(result: Record<string, unknown>, answerQuality: ReturnType<typeof inspectAnswerQuality>) {
  const score = normalizeScore(result.score);
  const concerns = Array.isArray(result.concerns) ? result.concerns.map(String) : [];
  let decision = result.decision === "approved" ? "approved" : "declined";

  if (score < APPROVAL_SCORE) {
    decision = "declined";
    concerns.push(`Score is below the ${APPROVAL_SCORE}% approval threshold.`);
  }

  if (answerQuality.shouldDecline) {
    decision = "declined";
    concerns.push(...answerQuality.concerns);
  }

  return {
    ...result,
    decision,
    score,
    concerns,
  };
}

function manualReviewResult(reason: string) {
  return {
    decision: "declined",
    score: 0,
    reason,
    concerns: ["Needs manual moderator review before this can be approved."],
    strengths: [],
  };
}

async function redisCommand(command: unknown[]) {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  try {
    const res = await fetch(process.env.UPSTASH_REDIS_REST_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
    });

    return res.json();
  } catch (error) {
    console.error("Redis command failed:", error);
    return null;
  }
}

async function sendDiscord(
  webhook: string | undefined,
  payload: Record<string, unknown>,
  attempt = 0
) {
  if (!webhook) {
    console.log("No webhook provided");
    return;
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        allowed_mentions: { parse: [] },
        ...payload,
      }),
    });

    const text = await res.text();

    if (res.status === 429 && attempt < 3) {
      try {
        const data = JSON.parse(text);
        const retryAfter = Math.ceil((data.retry_after || 1) * 1000);
        await new Promise((resolve) => setTimeout(resolve, retryAfter));
        return sendDiscord(webhook, payload, attempt + 1);
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return sendDiscord(webhook, payload, attempt + 1);
      }
    }

    if (!res.ok) {
      console.error("Discord webhook failed:", res.status, text);
    }
  } catch (error) {
    console.error("Discord webhook error:", error);
  }
}

async function sendApplicationSummary({
  webhook,
  title,
  color,
  fields,
}: {
  webhook: string | undefined;
  title: string;
  color: number;
  fields: { name: string; value: string; inline?: boolean }[];
}) {
  await sendDiscord(webhook, {
    embeds: [{ title, color, fields }],
  });
}

async function sendApplicationQuestions({
  webhook,
  username,
  discord,
  decision,
  qaText,
}: {
  webhook: string | undefined;
  username: string;
  discord: string;
  decision: string;
  qaText: string;
}) {
  const qaChunks = chunkText(qaText, 3500);

  for (let i = 0; i < qaChunks.length; i++) {
    await sendDiscord(webhook, {
      embeds: [
        {
          title:
            qaChunks.length === 1
              ? "Full Staff Application Questions"
              : `Full Staff Application Questions ${i + 1}/${qaChunks.length}`,
          color: 0xfacc15,
          fields:
            i === 0
              ? [
                  { name: "Minecraft Username", value: truncate(username), inline: true },
                  { name: "Discord Username", value: truncate(discord), inline: true },
                  { name: "Decision", value: decision, inline: true },
                ]
              : undefined,
          description: qaChunks[i],
        },
      ],
    });
  }
}

function getQuestionsWebhook(approved: boolean) {
  if (approved) {
    return process.env.DISCORD_QUESTIONS_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;
  }

  return (
    process.env.DISCORD_DECLINED_QUESTIONS_WEBHOOK_URL ||
    process.env.DISCORD_QUESTIONS_WEBHOOK_URL ||
    process.env.DISCORD_DECLINED_WEBHOOK_URL
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, discord, questions, answers } = body;

    if (
      !username ||
      !discord ||
      !questions ||
      !answers ||
      !Array.isArray(questions) ||
      !Array.isArray(answers)
    ) {
      return Response.json(
        { decision: "declined", message: "Application declined... please fill out the full form." },
        { status: 400 }
      );
    }

    const discordKey = normalizeDiscord(String(discord));
    const lockKey = `cloudberry:staffapp:declined:${discordKey}`;

    const existingLock = await redisCommand(["GET", lockKey]);

    if (existingLock?.result) {
      return Response.json({
        decision: "declined",
        message: "Application declined... please try again in 7 days.",
        cooldown: true,
      });
    }

    const qaText = questions
      .map((q: string, i: number) => {
        return `Q${i + 1}: ${q}\nA: ${answers[i] || "No answer"}`;
      })
      .join("\n\n");

    const answerQuality = inspectAnswerQuality(answers);
    let result;

    try {
      const response = await openai.responses.create({
        model: "gpt-4.1-mini",
        text: {
          format: {
            type: "json_schema",
            name: "staff_application_screening",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                decision: {
                  type: "string",
                  enum: ["approved", "declined"],
                },
                score: {
                  type: "number",
                },
                reason: {
                  type: "string",
                },
                concerns: {
                  type: "array",
                  items: { type: "string" },
                },
                strengths: {
                  type: "array",
                  items: { type: "string" },
                },
              },
              required: ["decision", "score", "reason", "concerns", "strengths"],
            },
          },
        },
        input: `
You are CloudBerry AI, a Minecraft server staff application screener.

Tone:
- Chill, friendly, professional.
- Be strict only when the applicant is trolling, toxic, power-hungry, unsafe, extremely lazy, or clearly immature.

Role:
The applicant is applying for Intern Helper, a 7-day trial staff role.

IMPORTANT:
Return score as a percentage from 0 to 100.
Do not use a 1-10 scale. If you think the applicant is 7/10, return 70.
Approve for review only when the applicant scores ${APPROVAL_SCORE} or higher.
If you are unsure, score below ${APPROVAL_SCORE} and decline.

Approve if:
- They show maturity, patience, and good judgment.
- They explain how they would warn, document, escalate, and enforce rules fairly.
- They understand staff should not punish out of emotion or guess without evidence.
- Their answers have enough detail for moderators to judge readiness.

Decline if:
- They troll.
- They give joke/empty answers.
- They give very short, vague, or low-effort answers.
- They want power, rank, control, or free perks.
- They would abuse, insult, threaten, punish too harshly, or lash out.
- They say they would ignore rules for friends.
- They show very poor judgment.
- They jump straight to bans/mutes without warnings, evidence, escalation, or context.

Scoring rubric:
- 90-100: Excellent, detailed, mature staff candidate.
- 80-89: Strong candidate with minor issues.
- 70-79: Acceptable for moderator review, but has concerns.
- 60-69: Not ready yet; decline and explain what to improve.
- 0-59: Clearly low-effort, unsafe, immature, or poor judgment.

Applicant:
Minecraft: ${username}
Discord: ${discord}

Application:
${qaText}
`,
      });

      result = JSON.parse(response.output_text);
    } catch (error) {
      console.error("AI processing failed:", error);
      result = manualReviewResult(
        "AI could not process the application reliably. Staff must review it manually."
      );
    }

    if (result.decision !== "approved" && result.decision !== "declined") {
      result = manualReviewResult("AI returned an unclear decision. Staff must review it manually.");
    }

    result = applyScreeningGuardrails(result, answerQuality);

    const approved = result.decision === "approved";
    const decisionText = approved ? "Approved for Review" : "Declined";

    const fields = [
      { name: "Minecraft Username", value: truncate(String(username)), inline: true },
      { name: "Discord Username", value: truncate(String(discord)), inline: true },
      { name: "Decision", value: decisionText, inline: true },
      { name: "Score", value: `${Math.max(0, Math.min(100, Number(result.score) || 0))}%`, inline: true },
      { name: "Reason", value: truncate(String(result.reason || "N/A")) },
      { name: "Strengths", value: truncate(listToText(result.strengths)) },
      { name: "Concerns", value: truncate(listToText(result.concerns)) },
    ];

    if (approved) {
      await sendApplicationSummary({
        webhook: process.env.DISCORD_WEBHOOK_URL,
        title: "Potential Staff Candidate",
        color: 0x38bdf8,
        fields,
      });

      await sendApplicationQuestions({
        webhook: getQuestionsWebhook(true),
        username: String(username),
        discord: String(discord),
        decision: decisionText,
        qaText,
      });

      return Response.json({
        decision: "approved",
        message:
          "Application Approved... Your application has been sent over to moderators for further review.",
      });
    }

    await redisCommand([
      "SET",
      lockKey,
      JSON.stringify({
        discord,
        username,
        declinedAt: new Date().toISOString(),
        reason: result.reason,
      }),
      "EX",
      SEVEN_DAYS,
    ]);

    await sendApplicationSummary({
      webhook: process.env.DISCORD_DECLINED_WEBHOOK_URL,
      title: "Declined Staff Application",
      color: 0xff5555,
      fields,
    });

    await sendApplicationQuestions({
      webhook: getQuestionsWebhook(false),
      username: String(username),
      discord: String(discord),
      decision: decisionText,
      qaText,
    });

    return Response.json({
      decision: "declined",
      message: "Application declined... please try again in 7 days.",
    });
  } catch (error) {
    console.error("APPLICATION API ERROR:", error);

    return Response.json(
      {
        decision: "declined",
        message: "Application system error. Please contact staff for manual review.",
      },
      { status: 500 }
    );
  }
}
