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

      subject: `[CloudBerry Contact] ${title} - ${subject}`,

      html: `
        <div style="font-family: Arial, sans-serif; background:#f4f7fb; padding:32px;">
          <div style="max-width:700px; margin:auto; background:#ffffff; border-radius:18px; overflow:hidden; border:1px solid #dbe4ee; box-shadow:0 10px 30px rgba(0,0,0,0.12);">

            <div style="background:linear-gradient(135deg,#38bdf8,#fbbf24,#fb923c); padding:28px;">
              <h1 style="margin:0; color:#082f49; font-size:30px;">
                ☁️ CloudBerry Contact Request
              </h1>

              <p style="margin-top:10px; color:#082f49; font-size:16px; font-weight:bold;">
                ${title}
              </p>
            </div>

            <div style="padding:30px; color:#111827;">

              <h2 style="margin-top:0; font-size:24px;">
                Request Information
              </h2>

              <table style="width:100%; border-collapse:collapse; font-size:15px;">
                <tr>
                  <td style="padding:10px 0;"><b>Type</b></td>
                  <td>${title}</td>
                </tr>

                <tr>
                  <td style="padding:10px 0;"><b>Minecraft IGN</b></td>
                  <td>${minecraftIgn || "N/A"}</td>
                </tr>

                <tr>
                  <td style="padding:10px 0;"><b>Discord Username</b></td>
                  <td>${discord || "N/A"}</td>
                </tr>

                <tr>
                  <td style="padding:10px 0;"><b>Email</b></td>
                  <td>${email || "N/A"}</td>
                </tr>

                <tr>
                  <td style="padding:10px 0;"><b>Name</b></td>
                  <td>${name || "N/A"}</td>
                </tr>

                <tr>
                  <td style="padding:10px 0;"><b>Company</b></td>
                  <td>${company || "N/A"}</td>
                </tr>
              </table>

              <hr style="margin:28px 0; border:none; border-top:1px solid #e5e7eb;" />

              <h2 style="font-size:22px;">Subject</h2>

              <div style="
                background:#eff6ff;
                border:1px solid #bfdbfe;
                border-radius:12px;
                padding:14px;
                font-size:16px;
                margin-bottom:24px;
              ">
                ${subject}
              </div>

              <h2 style="font-size:22px;">Message</h2>

              <div style="
                background:#f8fafc;
                border:1px solid #e2e8f0;
                border-radius:14px;
                padding:20px;
                line-height:1.7;
                white-space:pre-wrap;
                font-size:15px;
              ">
                ${message}
              </div>

              <div style="
                margin-top:30px;
                padding-top:20px;
                border-top:1px solid #e5e7eb;
                color:#64748b;
                font-size:13px;
              ">
                Sent automatically from the CloudBerry website contact form.
              </div>

            </div>
          </div>
        </div>
      `,

      text: `
New CloudBerry Contact Request

Type: ${title}

Minecraft IGN: ${minecraftIgn || "N/A"}
Discord Username: ${discord || "N/A"}
Email: ${email || "N/A"}

Name: ${name || "N/A"}
Company: ${company || "N/A"}

Subject:
${subject}

Message:
${message}
      `,
    });

    if (error) {
      console.error("Email send error:", error);

      return Response.json(
        { success: false },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
    });

  } catch (error) {
    console.error("Contact API error:", error);

    return Response.json(
      { success: false },
      { status: 500 }
    );
  }
}
