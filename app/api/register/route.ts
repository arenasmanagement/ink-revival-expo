/**
 * /api/register — Unified registration endpoint
 *
 * Handles all participant types: artist, vendor, food-truck, car-show, competition
 *
 * On submission:
 *   1. Validates required fields
 *   2. Checks remaining capacity (from CAPACITY constants — upgrade to DB when Supabase is live)
 *   3. Sends admin notification email to studio45tattoo2025@gmail.com via Resend
 *   4. Sends confirmation email to the registrant
 *   5. Returns { success, orderId } or { error }
 *
 * Security:
 *   - FROM_EMAIL: "West TN Ink Revival Expo <contact@westtninkrevival.com>" — never change
 *   - TO_EMAIL:   "studio45tattoo2025@gmail.com"
 *   - No card data ever passes through this route — payment handled via hosted processor
 */

import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

// Force this route to always be dynamic — never statically pre-rendered.
// This also prevents Next.js from instantiating Resend at build time.
export const dynamic = "force-dynamic";

const FROM_EMAIL = "West TN Ink Revival Expo <contact@westtninkrevival.com>";
const ADMIN_EMAIL = "studio45tattoo2025@gmail.com";

// ─── Capacity limits (mirrors lib/eventData.ts CAPACITY) ─────────────────
// TODO: Replace with live DB queries once Supabase is configured.
// Until then, capacity is informational — admin manages via email confirmations.
const CAPACITY_LIMITS: Record<string, number> = {
  artist: 35,
  vendor: 35,      // each 10×10 = 1 slot; double = 2 slots
  "food-truck": 10,
  sponsor: 10,
  "car-show": 75,
  competition: 999, // unlimited entries
};

// ─── Type definitions ─────────────────────────────────────────────────────
interface RegistrationData {
  type: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName?: string;
  websiteOrInstagram?: string;
  message?: string;
  // Vendor-specific
  boothSize?: "single" | "double";
  vendorCategory?: string;
  // Artist-specific
  tattoingYears?: string;
  specialties?: string;
  // Car show
  year?: string;
  make?: string;
  model?: string;
  vehicleClass?: string;
  // Competition
  competitionCategory?: string;
}

// ─── Generate a simple order ID ───────────────────────────────────────────
function generateOrderId(type: string): string {
  const prefix = type.toUpperCase().slice(0, 3).replace("-", "");
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// ─── Admin notification template ─────────────────────────────────────────
function buildAdminEmail(data: RegistrationData, orderId: string): string {
  const rows = Object.entries(data)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `<tr><td style="padding:4px 8px;font-weight:600;color:#555;width:160px">${k}</td><td style="padding:4px 8px;color:#222">${v}</td></tr>`)
    .join("");

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
      <div style="background:#1A1008;color:#C4902A;padding:16px 20px;margin-bottom:20px">
        <h1 style="margin:0;font-size:18px">New Registration — ${data.type.toUpperCase()}</h1>
        <p style="margin:4px 0 0;font-size:13px;color:#fff;opacity:0.7">Order ID: ${orderId}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#f9f6f0;border:1px solid #ddd">
        <tbody>${rows}</tbody>
      </table>
      <p style="margin-top:16px;color:#555;font-size:12px">
        West TN Tattoo and Art Festival — ${new Date().toLocaleString()}
      </p>
    </div>
  `;
}

// ─── Registrant confirmation template ────────────────────────────────────
function buildConfirmationEmail(data: RegistrationData, orderId: string): string {
  const typeLabels: Record<string, { label: string; next: string }> = {
    artist: {
      label: "Tattoo Artist Application",
      next: "Our team will review your application and contact you within 3–5 business days. Approval is required before any payment is collected.",
    },
    vendor: {
      label: "Vendor Booth Registration",
      next: "Our team will review and confirm your booth assignment. Payment details will be sent upon approval.",
    },
    "food-truck": {
      label: "Food Truck Application",
      next: "Our team will review your application and contact you within 3–5 business days to confirm your space.",
    },
    sponsor: {
      label: "Sponsorship Inquiry",
      next: "A member of our team will reach out soon with your sponsorship agreement and payment details.",
    },
    "car-show": {
      label: "Car Show Registration",
      next: "Your vehicle entry has been received. Entry details and confirmation will be sent closer to the event. Space is first-come, first-served.",
    },
    competition: {
      label: "Competition Entry",
      next: "Your competition entry has been received. Categories and judging details will be confirmed closer to the event.",
    },
  };

  const info = typeLabels[data.type] ?? {
    label: "Registration",
    next: "Our team will be in touch shortly.",
  };

  return `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:20px;background:#faf7f2">
      <div style="text-align:center;padding:24px 20px;background:#1A1008;margin-bottom:24px">
        <h1 style="color:#C4902A;font-size:20px;margin:0 0 6px;letter-spacing:0.05em">
          West TN Tattoo and Art Festival
        </h1>
        <p style="color:#fff;opacity:0.6;margin:0;font-size:12px;letter-spacing:0.15em;text-transform:uppercase">
          March 12–14, 2027 · Huntingdon, Tennessee
        </p>
      </div>

      <h2 style="color:#1A1008;font-size:16px;margin-bottom:8px">${info.label} Received</h2>
      <p style="color:#444;line-height:1.7;margin-bottom:16px">
        Hi ${data.firstName}, thank you for your interest in West TN Tattoo and Art Festival 2027.
        We have received your ${info.label.toLowerCase()} and your reference ID is:
      </p>

      <div style="background:#fff;border:2px solid #C4902A;padding:12px 20px;text-align:center;margin-bottom:20px">
        <p style="margin:0;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.1em">Reference ID</p>
        <p style="margin:4px 0 0;font-size:22px;font-weight:bold;color:#1A1008;letter-spacing:0.05em">${orderId}</p>
      </div>

      <p style="color:#444;line-height:1.7;margin-bottom:20px">${info.next}</p>

      <div style="background:#fff;border:1px solid #ddd;padding:16px 20px;margin-bottom:20px">
        <p style="margin:0 0 8px;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.1em">Event Details</p>
        <p style="margin:0;color:#333;font-size:14px;line-height:1.8">
          <strong>Dates:</strong> March 12–14, 2027<br/>
          <strong>Venue:</strong> Carroll County TN Fairgrounds<br/>
          <strong>Address:</strong> 201 Fairgrounds Road, Huntingdon, TN 38344<br/>
          <strong>Produced by:</strong> Studio 45 Tattoos
        </p>
      </div>

      <p style="color:#444;line-height:1.7">
        Questions? Call us at <a href="tel:731-513-4271" style="color:#7A1714">731-513-4271</a>
        or reply to this email.
      </p>

      <div style="border-top:1px solid #ddd;margin-top:24px;padding-top:16px;text-align:center">
        <p style="color:#999;font-size:11px;margin:0">
          West TN Tattoo and Art Festival · westtninkrevival.com
        </p>
      </div>
    </div>
  `;
}

// ─── POST handler ─────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  // Instantiate inside handler — avoids build-time errors when env var is absent
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const data: RegistrationData = await request.json();

    // ── Validate required fields ──────────────────────────────────────────
    if (!data.type || !CAPACITY_LIMITS[data.type]) {
      return NextResponse.json({ error: "Invalid registration type." }, { status: 400 });
    }
    if (!data.firstName?.trim() || !data.lastName?.trim()) {
      return NextResponse.json({ error: "First and last name are required." }, { status: 400 });
    }
    if (!data.email?.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }
    if (!data.phone?.trim()) {
      return NextResponse.json({ error: "A phone number is required." }, { status: 400 });
    }

    // ── Car show: require vehicle info ─────────────────────────────────────
    if (data.type === "car-show") {
      if (!data.year || !data.make || !data.model) {
        return NextResponse.json(
          { error: "Vehicle year, make, and model are required for car show registration." },
          { status: 400 }
        );
      }
    }

    // ── Generate order ID ─────────────────────────────────────────────────
    const orderId = generateOrderId(data.type);

    // ── Send admin notification ───────────────────────────────────────────
    const adminSubject = `[${data.type.toUpperCase()}] New Registration — ${data.firstName} ${data.lastName} — ${orderId}`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: adminSubject,
      html: buildAdminEmail(data, orderId),
    });

    // ── Send confirmation to registrant ───────────────────────────────────
    const typeLabel = {
      artist: "Tattoo Artist Application",
      vendor: "Vendor Booth Registration",
      "food-truck": "Food Truck Application",
      sponsor: "Sponsorship Inquiry",
      "car-show": "Car Show Registration",
      competition: "Competition Entry",
    }[data.type] ?? "Registration";

    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `${typeLabel} Received — West TN Tattoo and Art Festival 2027 (${orderId})`,
      html: buildConfirmationEmail(data, orderId),
    });

    return NextResponse.json({ success: true, orderId }, { status: 200 });
  } catch (err) {
    console.error("[/api/register]", err);
    return NextResponse.json(
      { error: "An error occurred processing your registration. Please call 731-513-4271." },
      { status: 500 }
    );
  }
}
