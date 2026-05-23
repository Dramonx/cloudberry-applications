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
