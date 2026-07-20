import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ??
  "West TN Ink Revival Expo <contact@westtninkrevival.com>";
const TO_EMAIL = "studio45tattoo2025@gmail.com";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, reason, message, _gotcha } = body as {
      name: string;
      email: string;
      phone?: string;
      reason: string;
      message: string;
      _gotcha?: string;
    };

    // ── Honeypot check ────────────────────────────────────────────────────────
    // Bots fill the hidden _gotcha field; humans leave it blank.
    if (_gotcha) {
      // Silent accept to fool automated scrapers
      return NextResponse.json({ success: true });
    }

    // ── Server-side validation ────────────────────────────────────────────────
    if (!name?.trim() || !email?.trim() || !reason?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message is too short — please provide a bit more detail." },
        { status: 400 }
      );
    }

    // ── Send email via Resend ─────────────────────────────────────────────────
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `[West TN Ink Revival] ${reason} — message from ${name}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1A1008;">
          <div style="background:#1A1008;padding:28px 32px;">
            <h1 style="color:#C4902A;font-size:22px;margin:0;letter-spacing:1px;">
              WEST TN INK REVIVAL EXPO
            </h1>
            <p style="color:rgba(245,230,200,0.6);font-size:13px;margin:4px 0 0;">
              New contact form submission
            </p>
          </div>
          <div style="background:#F5E6C8;padding:28px 32px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid rgba(26,16,8,0.12);font-weight:bold;width:110px;vertical-align:top;">Reason</td>
                <td style="padding:8px 0;border-bottom:1px solid rgba(26,16,8,0.12);">${escapeHtml(reason)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid rgba(26,16,8,0.12);font-weight:bold;vertical-align:top;">Name</td>
                <td style="padding:8px 0;border-bottom:1px solid rgba(26,16,8,0.12);">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid rgba(26,16,8,0.12);font-weight:bold;vertical-align:top;">Email</td>
                <td style="padding:8px 0;border-bottom:1px solid rgba(26,16,8,0.12);">
                  <a href="mailto:${escapeHtml(email)}" style="color:#C4902A;">${escapeHtml(email)}</a>
                </td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid rgba(26,16,8,0.12);font-weight:bold;vertical-align:top;">Phone</td>
                <td style="padding:8px 0;border-bottom:1px solid rgba(26,16,8,0.12);">${escapeHtml(phone)}</td>
              </tr>` : ""}
              <tr>
                <td style="padding:8px 0;font-weight:bold;vertical-align:top;padding-top:16px;">Message</td>
                <td style="padding:8px 0;padding-top:16px;white-space:pre-wrap;">${escapeHtml(message)}</td>
              </tr>
            </table>
          </div>
          <div style="background:#1A1008;padding:16px 32px;text-align:center;">
            <p style="color:rgba(196,144,42,0.5);font-size:12px;margin:0;">
              West TN Ink Revival Expo · westtninkrevival.com
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again or call us directly." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or call us directly." },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
