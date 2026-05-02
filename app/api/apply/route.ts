import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SEVEN_DAYS = 60 * 60 * 24 * 7;

function normalizeDiscord(discord: string) {
  return discord.trim().toLowerCase().replace(/\s+/g, "");
}

function truncate(text: string, max = 950) {
  if (!text) return "N/A";
  return text.length > max ? text.slice(0, max - 3) + "..." : text;
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

async function sendDiscord(webhook: string | undefined, payload: unknown) {
  if (!webhook) return;

  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, discord, questions, answers } = body;

    if (!username || !discord || !questions || !answers) {
      return Response.json(
        { decision: "declined", reason: "Missing application data." },
        { status: 400 }
      );
    }

    const discordKey = normalizeDiscord(discord);
    const lockKey = `cloudberry:staffapp:declined:${discordKey}`;

    const existingLock = await redisCommand(["GET", lockKey]);

    if (existingLock?.result) {
      return Response.json({
        decision: "declined",
        reason: "Application declined... please try again in 7 days.",
        cooldown: true,
      });
    }

    const qaText = questions
      .map((q: string, i: number) => `Q${i + 1}: ${q}\nA: ${answers[i] || "No answer"}`)
      .join("\n\n");

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

    const fields = [
      { name: "Minecraft", value: truncate(username), inline: true },
      { name: "Discord", value: truncate(discord), inline: true },
      { name: "Decision", value: approved ? "Approved for Review" : "Declined", inline: true },
      { name: "Score", value: String(result.score ?? "N/A"), inline: true },
      { name: "Reason", value: truncate(result.reason) },
      { name: "Strengths", value: truncate((result.strengths || []).join("\n") || "N/A") },
      { name: "Concerns", value: truncate((result.concerns || []).join("\n") || "N/A") },
      { name: "Questions & Answers", value: truncate(qaText) },
    ];

    if (approved) {
      await sendDiscord(process.env.DISCORD_WEBHOOK_URL, {
        embeds: [
          {
            title: "✅ Potential Staff Candidate",
            color: 0x38bdf8,
            fields,
          },
        ],
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

    await sendDiscord(process.env.DISCORD_DECLINED_WEBHOOK_URL, {
      embeds: [
        {
          title: "❌ Declined Staff Application",
          color: 0xff5555,
          fields,
        },
      ],
    });

    return Response.json({
      decision: "declined",
      message: "Application declined... please try again in 7 days.",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        decision: "declined",
        message: "Application declined... please try again in 7 days.",
      },
      { status: 500 }
    );
  }
}
