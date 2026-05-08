import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SEVEN_DAYS = 60 * 60 * 24 * 7;

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

    if (splitAt < maxLength * 0.5) {
      splitAt = remaining.lastIndexOf("\n", maxLength);
    }

    if (splitAt < maxLength * 0.5) {
      splitAt = remaining.lastIndexOf(" ", maxLength);
    }

    if (splitAt < maxLength * 0.5) {
      splitAt = maxLength;
    }

    chunks.push(remaining.slice(0, splitAt).trim());
    remaining = remaining.slice(splitAt).trim();
  }

  if (remaining) chunks.push(remaining);

  return chunks.length ? chunks : ["N/A"];
}

function looksEnglishOnly(text: string) {
  const letters = text.match(/[A-Za-z]/g)?.length || 0;
  const nonEnglishLetters = text.match(/[^\x00-\x7F]/g)?.length || 0;
  return letters >= 20 && nonEnglishLetters === 0;
}

function listToText(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(String).join("\n") || "N/A";
  }

  if (typeof value === "string") {
    return value || "N/A";
  }

  return "N/A";
}

async function redisCommand(command: unknown[]) {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  const res = await fetch(process.env.UPSTASH_REDIS_REST_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });

  return res.json();
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
  } else {
    console.log("Discord webhook sent");
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
    embeds: [
      {
        title,
        color,
        fields,
      },
    ],
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
        { decision: "declined", message: "Application declined... please try again in 7 days." },
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

    if (!looksEnglishOnly(qaText)) {
      await redisCommand([
        "SET",
        lockKey,
        JSON.stringify({
          discord,
          username,
          declinedAt: new Date().toISOString(),
          reason: "Application must be written in English.",
        }),
        "EX",
        SEVEN_DAYS,
      ]);

      const fields = [
        { name: "Minecraft Username", value: truncate(String(username)), inline: true },
        { name: "Discord Username", value: truncate(String(discord)), inline: true },
        { name: "Decision", value: "Declined", inline: true },
        { name: "Score", value: "0%", inline: true },
        { name: "Reason", value: "Application must be written in English." },
      ];

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
        decision: "Declined",
        qaText,
      });

      return Response.json({
        decision: "declined",
        message: "Application declined... please try again in 7 days.",
      });
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `
You are CloudBerry AI, a Minecraft server staff application screener.

Tone:
- Chill, friendly, professional.
- Be strict only when the applicant is trolling, toxic, power-hungry, unsafe, extremely lazy, or clearly immature.

Role:
The applicant is applying for Intern Helper, a 7-day trial staff role.

IMPORTANT:
Do not be overly harsh.
A normal, decent, mature applicant should be approved for moderator review.
Only decline if there are clear red flags.

Approve if:
- They show basic maturity.
- They want to help the community.
- They mention staying calm or asking higher staff.
- They understand fairness.
- They seem trainable even if answers are not perfect.

Decline only if:
- They troll.
- They give joke/empty answers.
- They want power, rank, control, or free perks.
- They would abuse, insult, threaten, or lash out.
- They say they would ignore rules for friends.
- They show very poor judgment.

Return JSON only:
{
  "decision": "approved" or "declined",
  "score": 0-100,
  "reason": "short reason",
  "concerns": ["concern 1", "concern 2"],
  "strengths": ["strength 1", "strength 2"]
}

Applicant:
Minecraft: ${username}
Discord: ${discord}

Application:
${qaText}
`,
    });

    let result;

    try {
      result = JSON.parse(response.output_text);
    } catch {
      result = {
        decision: "declined",
        score: 0,
        reason: "AI could not process the application safely.",
        concerns: ["Invalid AI response"],
        strengths: [],
      };
    }

    const approved = result.decision === "approved";
    const decisionText = approved ? "Approved for Review" : "Declined";

    const fields = [
      { name: "Minecraft Username", value: truncate(String(username)), inline: true },
      { name: "Discord Username", value: truncate(String(discord)), inline: true },
      { name: "Decision", value: decisionText, inline: true },
      { name: "Score", value: `${result.score ?? 0}%`, inline: true },
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
        message: "Application Approved... Your application has been sent over to moderators for further review.",
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
        message: "Application system error. Please try again later.",
      },
      { status: 500 }
    );
  }
}
