import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      type,
      minecraftIgn,
      discord,
      email,
      subject,
      message,
      company,
      name,
    } = body;

    const title =
      type === "professional"
        ? "Professional Inquiry"
        : "Regular Support Request";

    const fromEmail = "CloudBerry Contact <noreply@mc-cloudberry.com>";

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: ["support@mc-cloudberry.com"],
      replyTo: email || undefined,
      subject: `[CloudBerry] ${title}: ${subject}`,
      text: `
New CloudBerry Contact Request

Type: ${title}

Minecraft IGN: ${minecraftIgn || "N/A"}
Discord Username: ${discord || "N/A"}
Email: ${email || "N/A"}

Name: ${name || "N/A"}
Company: ${company || "N/A"}

Subject: ${subject}

Message:
${message}
      `,
    });

    if (error) {
      console.error("Email send error:", error);
      return Response.json({ success: false }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return Response.json({ success: false }, { status: 500 });
  }
}
