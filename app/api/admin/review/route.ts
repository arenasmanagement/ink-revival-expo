/**
 * /api/admin/review
 * POST { orderId, action: "approve" | "deny" | "request_info", reason?, message? }
 *
 * approve:
 *   - If pending_review: capture Stripe hold → status "captured" → send approval email
 *   - If pending: mark "approved_pending_payment" → email applicant (no payment link yet)
 *
 * deny:
 *   - Cancel PI if one exists → mark "cancelled" → send denial email
 *
 * request_info:
 *   - Send info request email → mark "info_requested" → log activity
 *
 * IMPORTANT: No payment confirmation email for "approved_pending_payment".
 * Stripe live payments are not yet active.
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

// SECURITY CONSTANT — DO NOT CHANGE
const FROM_EMAIL = "West TN Ink Revival Expo <contact@westtninkrevival.com>";

const resend = new Resend(process.env.RESEND_API_KEY);

function typeLabel(type: string): string {
  const labels: Record<string, string> = {
    artist: "Tattoo Artist",
    vendor: "Vendor",
    food_truck: "Food Truck",
    sponsor: "Sponsor",
    car_show: "Car Show",
    competition: "Competition",
  };
  return labels[type] ?? type;
}

function approvalEmailHtml(name: string, type: string, orderId: string, paymentPending: boolean): string {
  const typeStr = typeLabel(type);
  if (paymentPending) {
    return `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#222">
  <div style="background:#1A1008;padding:20px 24px;margin-bottom:24px">
    <h1 style="color:#C4902A;font-size:20px;margin:0 0 6px">West TN Tattoo and Art Festival 2027</h1>
    <p style="color:rgba(245,237,216,0.7);font-size:13px;margin:0">March 12–14, 2027 · Huntingdon, TN</p>
  </div>
  <div style="padding:0 8px">
    <h2 style="font-size:22px;margin:0 0 16px">Your Application Has Been Approved</h2>
    <p>Dear ${name},</p>
    <p>We're pleased to let you know that your <strong>${typeStr} application</strong> for the West TN Tattoo and Art Festival 2027 has been reviewed and <strong>approved</strong>.</p>
    <div style="background:#fef9ee;border:2px solid #C4902A;padding:16px 20px;margin:20px 0">
      <p style="margin:0 0 8px;font-weight:bold;color:#8a6200">⏳ Payment Required to Confirm Your Spot</p>
      <p style="margin:0;font-size:14px;color:#555">Your spot is not yet confirmed. Payment is required to secure your registration. We will contact you shortly with secure payment instructions once our payment system is activated.</p>
    </div>
    <p>Please do not make payment through any other channel. We will reach out directly.</p>
    <p style="color:#888;font-size:13px">Application Reference: ${orderId}</p>
    <p>If you have questions, reply to this email or contact us at <a href="mailto:contact@westtninkrevival.com">contact@westtninkrevival.com</a>.</p>
    <p>We look forward to having you with us!</p>
    <p>— The West TN Tattoo and Art Festival Team</p>
  </div>
</div>`;
  }

  return `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#222">
  <div style="background:#1A1008;padding:20px 24px;margin-bottom:24px">
    <h1 style="color:#C4902A;font-size:20px;margin:0 0 6px">West TN Tattoo and Art Festival 2027</h1>
    <p style="color:rgba(245,237,216,0.7);font-size:13px;margin:0">March 12–14, 2027 · Huntingdon, TN</p>
  </div>
  <div style="padding:0 8px">
    <h2 style="font-size:22px;margin:0 0 16px">🎉 You're Confirmed!</h2>
    <p>Dear ${name},</p>
    <p>Great news! Your <strong>${typeStr} registration</strong> for the West TN Tattoo and Art Festival 2027 has been <strong>approved and your payment has been processed</strong>.</p>
    <div style="background:#f0fdf4;border:2px solid #16a34a;padding:16px 20px;margin:20px 0">
      <p style="margin:0;font-weight:bold;color:#15803d">✅ Registration Confirmed</p>
    </div>
    <p>Your spot is now secured. We'll be in touch with additional details as the event approaches.</p>
    <p style="color:#888;font-size:13px">Registration Reference: ${orderId}</p>
    <p>Questions? Contact us at <a href="mailto:contact@westtninkrevival.com">contact@westtninkrevival.com</a></p>
    <p>— The West TN Tattoo and Art Festival Team</p>
  </div>
</div>`;
}

function denialEmailHtml(name: string, type: string, orderId: string, reason?: string): string {
  const typeStr = typeLabel(type);
  return `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#222">
  <div style="background:#1A1008;padding:20px 24px;margin-bottom:24px">
    <h1 style="color:#C4902A;font-size:20px;margin:0 0 6px">West TN Tattoo and Art Festival 2027</h1>
    <p style="color:rgba(245,237,216,0.7);font-size:13px;margin:0">March 12–14, 2027 · Huntingdon, TN</p>
  </div>
  <div style="padding:0 8px">
    <h2 style="font-size:22px;margin:0 0 16px">Update on Your Application</h2>
    <p>Dear ${name},</p>
    <p>Thank you for your interest in participating in the West TN Tattoo and Art Festival 2027 as a <strong>${typeStr}</strong>.</p>
    <p>After careful review, we are unable to approve your application at this time. ${reason ? `<br><br><em>Note from organizers: ${reason}</em>` : "We have limited space and received many applications."}</p>
    ${reason?.includes("full") ? "" : "<p>We encourage you to check back in case spaces open up, or consider other participation options for future events.</p>"}
    <p>If you have questions, please contact us at <a href="mailto:contact@westtninkrevival.com">contact@westtninkrevival.com</a>.</p>
    <p style="color:#888;font-size:13px">Application Reference: ${orderId}</p>
    <p>Thank you for your interest, and we hope to see you at the festival!</p>
    <p>— The West TN Tattoo and Art Festival Team</p>
  </div>
</div>`;
}

function infoRequestEmailHtml(name: string, type: string, orderId: string, message: string): string {
  const typeStr = typeLabel(type);
  return `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#222">
  <div style="background:#1A1008;padding:20px 24px;margin-bottom:24px">
    <h1 style="color:#C4902A;font-size:20px;margin:0 0 6px">West TN Tattoo and Art Festival 2027</h1>
    <p style="color:rgba(245,237,216,0.7);font-size:13px;margin:0">March 12–14, 2027 · Huntingdon, TN</p>
  </div>
  <div style="padding:0 8px">
    <h2 style="font-size:22px;margin:0 0 16px">Information Needed — Your ${typeStr} Application</h2>
    <p>Dear ${name},</p>
    <p>We are reviewing your <strong>${typeStr} application</strong> and need a bit more information before we can make a decision.</p>
    <div style="background:#f8f4eb;border-left:4px solid #C4902A;padding:16px 20px;margin:20px 0">
      <p style="margin:0;color:#333">${message}</p>
    </div>
    <p>Please reply to this email with the requested information at your earliest convenience.</p>
    <p style="color:#888;font-size:13px">Application Reference: ${orderId}</p>
    <p>— The West TN Tattoo and Art Festival Team</p>
  </div>
</div>`;
}

export async function POST(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  let body: { orderId?: string; action?: string; reason?: string; message?: string };
  try { body = await req.json(); } catch { body = {}; }

  const { orderId, action, reason, message } = body;

  if (!orderId || !action) {
    return NextResponse.json({ error: "orderId and action are required." }, { status: 400 });
  }
  if (!["approve", "deny", "request_info"].includes(action)) {
    return NextResponse.json({ error: "action must be approve, deny, or request_info." }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Fetch registration
  const { data: reg, error: regErr } = await supabase
    .from("wtsf_registrations")
    .select("*")
    .eq("order_id", orderId)
    .single();

  if (regErr || !reg) {
    return NextResponse.json({ error: "Registration not found." }, { status: 404 });
  }

  const applicantName = `${reg.first_name} ${reg.last_name}`.trim();
  const applicantEmail = reg.email;
  const registrationType = reg.registration_type ?? "";
  const piId = reg.stripe_payment_intent_id;

  // ── APPROVE ──────────────────────────────────────────────────────────────────
  if (action === "approve") {
    if (reg.status === "captured" || reg.status === "confirmed") {
      return NextResponse.json({ ok: true, message: "Already approved and paid." });
    }
    if (reg.status === "approved_pending_payment") {
      return NextResponse.json({ ok: true, message: "Already approved (payment still pending)." });
    }

    if (reg.status === "pending_review" && piId) {
      // Capture the Stripe hold
      try {
        await stripe.paymentIntents.capture(piId);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Stripe capture failed.";
        // If already captured, that's fine
        if (!msg.includes("already been captured") && !msg.includes("already succeeded")) {
          return NextResponse.json({ error: `Payment capture failed: ${msg}` }, { status: 500 });
        }
      }

      await supabase.from("wtsf_registrations").update({
        status: "captured",
        reviewed_by: "owner",
        reviewed_at: new Date().toISOString(),
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).eq("order_id", orderId);

      // Send approval email (payment confirmed)
      await resend.emails.send({
        from: FROM_EMAIL,
        to: applicantEmail,
        subject: `✅ You're Confirmed — ${typeLabel(registrationType)} | West TN Tattoo & Art Festival`,
        html: approvalEmailHtml(applicantName, registrationType, orderId, false),
      }).catch((e) => console.error("[review/approve email]", e));

      // Log activity
      await supabase.from("wtsf_admin_activity").insert({
        order_id: orderId,
        action: "approved_captured",
        performed_by: "owner",
        prev_status: "pending_review",
        new_status: "captured",
        detail: "Stripe hold captured. Confirmation email sent.",
      });

      return NextResponse.json({ ok: true, newStatus: "captured", emailSent: true });
    }

    // No payment on file — approve but mark payment as required
    await supabase.from("wtsf_registrations").update({
      status: "approved_pending_payment",
      reviewed_by: "owner",
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq("order_id", orderId);

    // Send approval email (payment still needed)
    await resend.emails.send({
      from: FROM_EMAIL,
      to: applicantEmail,
      subject: `Your Application Has Been Approved — West TN Tattoo & Art Festival`,
      html: approvalEmailHtml(applicantName, registrationType, orderId, true),
    }).catch((e) => console.error("[review/approve pending email]", e));

    await supabase.from("wtsf_admin_activity").insert({
      order_id: orderId,
      action: "approved_pending_payment",
      performed_by: "owner",
      prev_status: reg.status,
      new_status: "approved_pending_payment",
      detail: "Approved — payment required. Email sent to applicant.",
    });

    return NextResponse.json({ ok: true, newStatus: "approved_pending_payment", emailSent: true });
  }

  // ── DENY ─────────────────────────────────────────────────────────────────────
  if (action === "deny") {
    if (reg.status === "cancelled") {
      return NextResponse.json({ ok: true, message: "Already cancelled." });
    }

    // Cancel Stripe PI if one exists and not already cancelled/captured
    if (piId && reg.status === "pending_review") {
      try {
        await stripe.paymentIntents.cancel(piId);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "";
        // Ignore if already cancelled
        if (!msg.includes("already been canceled") && !msg.includes("You cannot cancel")) {
          console.error("[review/deny cancel PI]", err);
        }
      }
    }

    await supabase.from("wtsf_registrations").update({
      status: "cancelled",
      denial_reason: reason ?? null,
      reviewed_by: "owner",
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq("order_id", orderId);

    // Send denial email
    await resend.emails.send({
      from: FROM_EMAIL,
      to: applicantEmail,
      subject: `Update on Your Application — West TN Tattoo & Art Festival`,
      html: denialEmailHtml(applicantName, registrationType, orderId, reason),
    }).catch((e) => console.error("[review/deny email]", e));

    await supabase.from("wtsf_admin_activity").insert({
      order_id: orderId,
      action: "denied",
      performed_by: "owner",
      prev_status: reg.status,
      new_status: "cancelled",
      detail: reason ? `Denial reason: ${reason}` : "Denied — no reason specified.",
    });

    return NextResponse.json({ ok: true, newStatus: "cancelled", emailSent: true });
  }

  // ── REQUEST INFO ──────────────────────────────────────────────────────────────
  if (action === "request_info") {
    if (!message?.trim()) {
      return NextResponse.json({ error: "A message is required for information requests." }, { status: 400 });
    }

    await supabase.from("wtsf_registrations").update({
      status: "info_requested",
      info_request_message: message,
      info_requested_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq("order_id", orderId);

    // Send info request email
    await resend.emails.send({
      from: FROM_EMAIL,
      to: applicantEmail,
      subject: `Information Needed — Your Application | West TN Tattoo & Art Festival`,
      html: infoRequestEmailHtml(applicantName, registrationType, orderId, message),
    }).catch((e) => console.error("[review/info email]", e));

    await supabase.from("wtsf_admin_activity").insert({
      order_id: orderId,
      action: "info_requested",
      performed_by: "owner",
      prev_status: reg.status,
      new_status: "info_requested",
      detail: `Info requested: ${message.substring(0, 200)}`,
    });

    return NextResponse.json({ ok: true, newStatus: "info_requested", emailSent: true });
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}
