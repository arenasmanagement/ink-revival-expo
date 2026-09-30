/**
 * /api/register — Unified registration endpoint
 *
 * Handles all participant types:
 *   APPLICATION → email + Supabase only (no payment):  artist, food-truck
 *   DIRECT CHECKOUT → Stripe Checkout Session:          vendor, car-show, sponsor
 *
 * Flow:
 *   1. Validate required fields
 *   2. Reserve slot in Supabase (atomic RPC) — if capacity-limited
 *   3. Insert pending registration into wtsf_registrations
 *   4. For direct-checkout types: create Stripe Checkout Session → return checkoutUrl
 *   5. For application types: send admin + confirmation emails → return orderId
 *
 * Security:
 *   FROM_EMAIL = "West TN Ink Revival Expo <contact@westtninkrevival.com>" — NEVER CHANGE
 *   ADMIN_EMAIL = "studio45tattoo2025@gmail.com" — keep as-is
 *   No card data ever passes through this route.
 *   Never hardcode Stripe or Supabase keys — always use process.env.
 */

import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { generateOrderId, reserveSlot, createRegistration } from "@/lib/registration";
import { stripe, buildLineItems } from "@/lib/stripe";

export const dynamic = "force-dynamic";

// ─── SECURITY CONSTANTS — DO NOT CHANGE ─────────────────────────────────────
const FROM_EMAIL  = "West TN Ink Revival Expo <contact@westtninkrevival.com>";
const ADMIN_EMAIL = "studio45tattoo2025@gmail.com";

// ─── Capacity-limited types ──────────────────────────────────────────────────
// Types NOT listed here go straight to Stripe without a slot check.
const CAPACITY_MAP: Record<string, string | null> = {
  artist:       null,       // slotted after booth size is known (ArtistApplicationForm handles internally)
  "food-truck": "food_truck",
  vendor:       null,       // resolved below based on boothSize
  "car-show":   "car_show",
  sponsor:      null,       // VIP only
};

// ─── Pricing ─────────────────────────────────────────────────────────────────
const PRICING: Record<string, { name: string; dollars: number }> = {
  vendor_10x10:  { name: "Vendor Booth — 10×10",     dollars: 150 },
  vendor_10x20:  { name: "Vendor Booth — 10×20",     dollars: 300 },
  "car-show":    { name: "Car Show Entry Fee",        dollars: 25  },
  sponsor_booth: { name: "Sponsor Package — Booth",   dollars: 50  },
  sponsor_basic: { name: "Sponsor Package — Basic",   dollars: 500 },
  sponsor_vip:   { name: "Sponsor Package — VIP",     dollars: 1000 },
};

// ─── Registration type metadata ──────────────────────────────────────────────
const TYPE_META: Record<string, { label: string; next: string; isApplication: boolean }> = {
  artist: {
    label: "Tattoo Artist Application",
    next:  "Our team will review your application and contact you within 3–5 business days. Approval is required before any payment is collected.",
    isApplication: true,
  },
  "food-truck": {
    label: "Food Truck Application",
    next:  "Our team will review your application and contact you within 3–5 business days to confirm your space.",
    isApplication: true,
  },
  vendor: {
    label: "Vendor Booth Registration",
    next:  "You will be redirected to our secure payment page to complete your registration.",
    isApplication: false,
  },
  sponsor: {
    label: "Sponsorship",
    next:  "You will be redirected to our secure payment page to complete your sponsorship.",
    isApplication: false,
  },
  "car-show": {
    label: "Car Show Entry",
    next:  "You will be redirected to our secure payment page to complete your registration.",
    isApplication: false,
  },
};

// ─── Email templates ──────────────────────────────────────────────────────────

function buildAdminEmail(data: Record<string, unknown>, orderId: string): string {
  const rows = Object.entries(data)
    .filter(([k, v]) => k !== "termsAgreed" && v !== undefined && v !== "" && v !== null)
    .map(([k, v]) =>
      `<tr><td style="padding:4px 8px;font-weight:600;color:#555;width:160px">${k}</td><td style="padding:4px 8px;color:#222">${String(v)}</td></tr>`
    )
    .join("");

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
      <div style="background:#1A1008;color:#C4902A;padding:16px 20px;margin-bottom:20px">
        <h1 style="margin:0;font-size:18px">New Registration — ${String(data.type ?? "").toUpperCase()}</h1>
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

function buildConfirmationEmail(data: Record<string, unknown>, orderId: string): string {
  const type = String(data.type ?? "");
  const firstName = String(data.firstName ?? "there");
  const meta = TYPE_META[type] ?? { label: "Registration", next: "Our team will be in touch shortly.", isApplication: true };

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

      <h2 style="color:#1A1008;font-size:16px;margin-bottom:8px">${meta.label} Received</h2>
      <p style="color:#444;line-height:1.7;margin-bottom:16px">
        Hi ${firstName}, thank you for your interest in West TN Tattoo and Art Festival 2027.
        We have received your ${meta.label.toLowerCase()} and your reference ID is:
      </p>

      <div style="background:#fff;border:2px solid #C4902A;padding:12px 20px;text-align:center;margin-bottom:20px">
        <p style="margin:0;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.1em">Reference ID</p>
        <p style="margin:4px 0 0;font-size:22px;font-weight:bold;color:#1A1008;letter-spacing:0.05em">${orderId}</p>
      </div>

      <p style="color:#444;line-height:1.7;margin-bottom:20px">${meta.next}</p>

      <div style="background:#fff;border:1px solid #ddd;padding:16px 20px;margin-bottom:20px">
        <p style="margin:0 0 8px;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.1em">Event Details</p>
        <p style="margin:0;color:#333;font-size:14px;line-height:1.8">
          <strong>Dates:</strong> March 12–14, 2027<br/>
          <strong>Venue:</strong> Carroll County TN Fairgrounds<br/>
          <strong>Address:</strong> 201 Fairgrounds Road, Huntingdon, TN 38344
        </p>
      </div>

      <p style="color:#444;line-height:1.7">
        Questions? Call us at <a href="tel:+17314416044" style="color:#7A1714">731-441-6044</a>
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

// ─── POST handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.westtninkrevival.com";

  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const type = String(data.type ?? "").trim();
  const firstName = String(data.firstName ?? "").trim();
  const lastName  = String(data.lastName  ?? "").trim();
  const email     = String(data.email     ?? "").trim();
  const phone     = String(data.phone     ?? "").trim();

  // ── Basic validation ────────────────────────────────────────────────────────
  if (!TYPE_META[type]) {
    return NextResponse.json({ error: "Invalid registration type." }, { status: 400 });
  }
  if (!firstName || !lastName) {
    return NextResponse.json({ error: "First and last name are required." }, { status: 400 });
  }
  if (!email.includes("@")) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }
  if (type === "car-show" && (!data.year || !data.make || !data.model)) {
    return NextResponse.json(
      { error: "Vehicle year, make, and model are required for car show registration." },
      { status: 400 }
    );
  }

  // ── Determine category ID and pricing ──────────────────────────────────────
  let categoryId: string | null = CAPACITY_MAP[type] ?? null;
  let pricingKey: string = type;

  if (type === "vendor") {
    const boothSize = String(data.boothSize ?? "single");
    pricingKey  = boothSize === "double" ? "vendor_10x20" : "vendor_10x10";
    categoryId  = boothSize === "double" ? "vendor_10x20" : "vendor_10x10";
  }
  if (type === "sponsor") {
    const pkg = String(data.sponsorPackage ?? "basic");
    pricingKey = `sponsor_${pkg}`;
    categoryId = pkg === "vip" ? "sponsor_vip" : null;
  }

  // ── Reserve slot (capacity check) ──────────────────────────────────────────
  if (categoryId && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const slot = await reserveSlot(categoryId);
      if (!slot.success) {
        return NextResponse.json(
          { error: `Sorry — this option is now sold out (${categoryId.replace(/_/g, " ")}). Please contact us for waitlist options.` },
          { status: 409 }
        );
      }
    } catch (err) {
      // Supabase unavailable — log but don't block registration (degrade gracefully)
      console.error("[/api/register] reserveSlot error:", err);
    }
  }

  // ── Generate order ID ───────────────────────────────────────────────────────
  const registrationType = type.replace("-", "_");
  const orderId = generateOrderId(registrationType);

  // ── Persist to Supabase ─────────────────────────────────────────────────────
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const pricing = PRICING[pricingKey];
      await createRegistration({
        orderId,
        registrationType,
        firstName,
        lastName,
        email,
        phone,
        businessName: String(data.businessName ?? data.company ?? ""),
        city:         String(data.city  ?? ""),
        state:        String(data.state ?? ""),
        amountCents:  pricing ? pricing.dollars * 100 : (data.totalCents as number | undefined),
        termsAgreed:  Boolean(data.termsAgreed),
        metadata:     {
          boothSize:        data.boothSize,
          vendorCategory:   data.vendorCategory,
          sponsorPackage:   data.sponsorPackage,
          tattoingYears:    data.tattoingYears,
          specialties:      data.specialties,
          portfolioUrl:     data.portfolioUrl,
          instagramHandle:  data.instagramHandle,
          vehicleYear:      data.year,
          vehicleMake:      data.make,
          vehicleModel:     data.model,
          vehicleColor:     data.color,
          vehicleDesc:      data.description,
          website:          data.website ?? data.websiteOrInstagram,
          notes:            data.notes ?? data.message,
          pricingKey,
          categoryId,
        },
        ipAddress: request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? undefined,
        userAgent: request.headers.get("user-agent") ?? undefined,
      });
    } catch (err) {
      // Log but don't block — email backup still runs
      console.error("[/api/register] createRegistration error:", err);
    }
  }

  const meta = TYPE_META[type];

  // ── Direct checkout: create Stripe Checkout Session ────────────────────────
  if (!meta.isApplication && process.env.STRIPE_SECRET_KEY) {
    const pricing = PRICING[pricingKey];
    if (!pricing) {
      return NextResponse.json({ error: "Pricing not found for this registration type." }, { status: 400 });
    }

    try {
      const session = await stripe.checkout.sessions.create({
        mode:                 "payment",
        payment_method_types: ["card"],
        line_items:           buildLineItems([{ name: pricing.name, amount: pricing.dollars }]),
        customer_email:       email,
        metadata: {
          orderId,
          registrationType,
          firstName,
          lastName,
          pricingKey,
        },
        success_url: `${siteUrl}/register/success?orderId=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:  `${siteUrl}/participate`,
      });

      // Send admin notification (don't block checkout on email failure)
      try {
        await resend.emails.send({
          from:    FROM_EMAIL,
          to:      ADMIN_EMAIL,
          subject: `[${type.toUpperCase()}] Pending Checkout — ${firstName} ${lastName} — ${orderId}`,
          html:    buildAdminEmail({ ...data, pricingKey, orderId }, orderId),
        });
      } catch (emailErr) {
        console.error("[/api/register] admin email error:", emailErr);
      }

      return NextResponse.json({ success: true, orderId, checkoutUrl: session.url }, { status: 200 });
    } catch (stripeErr) {
      console.error("[/api/register] Stripe error:", stripeErr);
      return NextResponse.json(
        { error: "Payment session could not be created. Please call 731-441-6044." },
        { status: 500 }
      );
    }
  }

  // ── Application flow: send emails ──────────────────────────────────────────
  try {
    await resend.emails.send({
      from:    FROM_EMAIL,
      to:      ADMIN_EMAIL,
      subject: `[${type.toUpperCase()}] New Application — ${firstName} ${lastName} — ${orderId}`,
      html:    buildAdminEmail(data, orderId),
    });
  } catch (emailErr) {
    console.error("[/api/register] admin email error:", emailErr);
  }

  try {
    await resend.emails.send({
      from:    FROM_EMAIL,
      to:      email,
      subject: `${meta.label} Received — West TN Tattoo and Art Festival 2027 (${orderId})`,
      html:    buildConfirmationEmail(data, orderId),
    });
  } catch (emailErr) {
    console.error("[/api/register] confirmation email error:", emailErr);
  }

  return NextResponse.json({ success: true, orderId }, { status: 200 });
}
