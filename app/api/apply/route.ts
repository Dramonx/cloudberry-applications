import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { messages, username, discord } = body;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: `
You are CloudBerry AI, a Minecraft server staff interviewer.

Personality:
- Chill, friendly, professional
- BUT become strict if user is trolling, toxic, immature, or low-effort

Your job:
- Ask follow-up questions
- Evaluate character, patience, maturity, honesty
- Detect trolls, power-hungry people, or rule-breakers

At the end, return JSON ONLY like this:

{
  "decision": "accept" | "reject",
  "reason": "short explanation",
  "score": number (0-100)
}

Do NOT include anything outside JSON.
`,
        },
        ...messages,
      ],
    });

    const text = response.output_text;

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = {
        decision: "reject",
        reason: "Invalid response format",
        score: 0,
      };
    }

    // Send to Discord
    await fetch(process.env.DISCORD_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: "📋 New Staff Application",
            color: result.decision === "accept" ? 0x00ff99 : 0xff0000,
            fields: [
              { name: "Minecraft", value: username || "N/A", inline: true },
              { name: "Discord", value: discord || "N/A", inline: true },
              { name: "Decision", value: result.decision, inline: true },
              { name: "Score", value: String(result.score), inline: true },
              { name: "Reason", value: result.reason },
            ],
          },
        ],
      }),
    });

    return Response.json({ result });

  } catch (err) {
    return Response.json({ error: "Something broke" }, { status: 500 });
  }
}
