/**
 * /api/register — Unified registration endpoint
 *
 * TYPE 1 — authorize-only (capture_method: manual):
 *   artist, vendor, food-truck, sponsor
 *   Admin reviews → APPROVE (capture) or DENY (cancel + release hold)
 *
 * TYPE 2 — immediate charge:
 *   car-show, competition
 *
 * Flow:
 *   1. Validate required fields
 *   2. Reserve slot in Supabase (atomic RPC) if capacity-limited
 *   3. Insert pending registration into wtsf_registrations
 *   4. Create Stripe PaymentIntent → return { orderId, clientSecret, amountCents, paymentType }
 *   5. If PAYMENT_TEST_MODE=true: skip Stripe, send emails immediately
 *
 * Security:
 *   FROM_EMAIL = "West TN Ink Revival Expo <contact@westtninkrevival.com>" — NEVER CHANGE
 *   ADMIN_EMAIL = "studio45tattoo2025@gmail.com" — keep as-is
 *   No card data passes through this route.
 *   Never expose Stripe or Supabase keys in client responses.
 */

import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { generateOrderId, reserveSlot, createRegistration, updateRegistrationStatus } from "@/lib/registration";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

// ─── SECURITY CONSTANTS — DO NOT CHANGE ─────────────────────────────────────
const FROM_EMAIL  = "West TN Ink Revival Expo <contact@westtninkrevival.com>";
const ADMIN_EMAIL = "studio45tattoo2025@gmail.com";

// ─── Payment type classification ─────────────────────────────────────────────
// TYPE_1: authorize-only (hold funds, admin reviews, then capture or cancel)
const TYPE_1 = new Set(["artist", "vendor", "food-truck", "sponsor"]);
// TYPE_2: immediate charge
const TYPE_2 = new Set(["car-show", "competition"]);

// ─── Capacity-limited types ──────────────────────────────────────────────────
const CAPACITY_MAP: Record<string, string | null> = {
  artist:       null,
  "food-truck": "food_truck",
  vendor:       null,        // resolved below based on boothSize
  "car-show":   "car_show",
  sponsor:      null,        // VIP only
  competition:  null,
};

// ─── Pricing ─────────────────────────────────────────────────────────────────
const PRICING: Record<string, { name: string; dollars: number }> = {
  artist_single:        { name: "Artist Booth — 10×10",                dollars: 150  },
  artist_double:        { name: "Artist Booth — 10×20",                dollars: 300  },
  artist_single_extra:  { name: "Artist Booth — 10×10 + Extra 10×10",  dollars: 300  },
  artist_double_extra:  { name: "Artist Booth — 10×20 + Extra 10×10",  dollars: 450  },
  "food-truck":         { name: "Food Truck Space",                     dollars: 250  },
  vendor_10x10:         { name: "Vendor Booth — 10×10",                dollars: 150  },
  vendor_10x20:         { name: "Vendor Booth — 10×20",                dollars: 300  },
  "car-show":           { name: "Car Show Entry Fee",                   dollars: 25   },
  sponsor_booth:        { name: "Sponsor Package — Booth",              dollars: 50   },
  sponsor_basic:        { name: "Sponsor Package — Basic",              dollars: 500  },
  sponsor_vip:          { name: "Sponsor Package — VIP",                dollars: 1000 },
  competition_1cat:     { name: "Competition — 1 Category",            dollars: 25   },
  competition_2cat:     { name: "Competition — 2 Categories",          dollars: 50   },
  competition_3cat:     { name: "Competition — 3 Categories",          dollars: 75   },
};

// ─── Registration type metadata ──────────────────────────────────────────────
const TYPE_META: Record<string, { label: string; confirmationNext: string }> = {
  artist: {
    label: "Tattoo Artist Application",
    confirmationNext: "Your application is now in review. You will hear from us within 3–5 business days. If approved, your booth fee will be captured and you will receive a confirmation.",
  },
  "food-truck": {
    label: "Food Truck Application",
    confirmationNext: "Your application is in review. If your space is confirmed, your fee will be charged and we will contact you with details.",
  },
  vendor: {
    label: "Vendor Booth Registration",
    confirmationNext: "Your registration is in review. If approved, your booth fee will be captured and you will receive a confirmation email.",
  },
  sponsor: {
    label: "Sponsorship Application",
    confirmationNext: "Thank you for your interest in sponsorship. Your payment is on hold pending our review. We will contact you within 3–5 business days.",
  },
  "car-show": {
    label: "Car Show Entry",
    confirmationNext: "Your car show entry has been received and payment processed. See you at the show!",
  },
  competition: {
    label: "Competition Entry",
    confirmationNext: "Your competition entry has been received and payment processed. Good luck!",
  },
};

// ─── Email templates ──────────────────────────────────────────────────────────

function buildAdminEmail(data: Record<string, unknown>, orderId: string, paymentStatus: string): string {
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
        <p style="margin:4px 0 0;font-size:13px;color:#fff;opacity:0.7">Order ID: ${orderId} | Payment: ${paymentStatus}</p>
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

function buildConfirmationEmail(
  data: Record<string, unknown>,
  orderId: string,
  amountDisplay: string,
  testMode = false
): string {
  const type = String(data.type ?? "");
  const firstName = String(data.firstName ?? "there");
  const meta = TYPE_META[type] ?? { label: "Registration", confirmationNext: "Our team will be in touch shortly." };

  const paymentNote = testMode
    ? "<p style='color:#888;font-size:12px;font-style:italic'>⚠ Test mode — no payment was collected.</p>"
    : "";

  return `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:20px;background:#faf7f2">
      <div style="text-align:center;padding:24px 20px;background:#1A1008;margin-bottom:24px">
        <h1 style="color:#C4902A;font-size:20px;margin:0 0 6px;letter-spacing:0.05em">West TN Tattoo and Art Festival</h1>
        <p style="color:#fff;opacity:0.6;margin:0;font-size:12px;letter-spacing:0.15em;text-transform:uppercase">
          March 12–14, 2027 · Huntingdon, Tennessee
        </p>
      </div>

      <h2 style="color:#1A1008;font-size:16px;margin-bottom:8px">${meta.label} Received</h2>
      <p style="color:#444;line-height:1.7;margin-bottom:16px">
        Hi ${firstName}, thank you for your interest in West TN Tattoo and Art Festival 2027.
      </p>

      <div style="background:#fff;border:2px solid #C4902A;padding:12px 20px;text-align:center;margin-bottom:20px">
        <p style="margin:0;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.1em">Reference ID</p>
        <p style="margin:4px 0 0;font-size:22px;font-weight:bold;color:#1A1008;letter-spacing:0.05em">${orderId}</p>
        ${amountDisplay ? `<p style="margin:4px 0 0;font-size:14px;color:#555">${amountDisplay}</p>` : ""}
      </div>

      <p style="color:#444;line-height:1.7;margin-bottom:20px">${meta.confirmationNext}</p>
      ${paymentNote}

      <div style="background:#fff;border:1px solid #ddd;padding:16px 20px;margin-bottom:20px">
        <p style="margin:0 0 8px;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.1em">Event Details</p>
        <p style="margin:0;color:#333;font-size:14px;line-height:1.8">
          <strong>Dates:</strong> March 12–14, 2027<br/>
          <strong>Venue:</strong> Carroll County TN Fairgrounds<br/>
          <strong>Address:</strong> 201 Fairgrounds Road, Huntingdon, TN 38344
        </p>
      </div>

      <p style="color:#444;line-height:1.7">
        Questions? Reply to this email or visit
        <a href="https://www.westtninkrevival.com/contact" style="color:#7A1714">westtninkrevival.com/contact</a>.
      </p>

      <div style="border-top:1px solid #ddd;margin-top:24px;padding-top:16px;text-align:center">
        <p style="color:#999;font-size:11px;margin:0">West TN Tattoo and Art Festival · westtninkrevival.com</p>
      </div>
    </div>
  `;
}

// ─── POST handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const type        = String(data.type ?? "").trim();
  const firstName   = String(data.firstName ?? "").trim();
  const lastName    = String(data.lastName  ?? "").trim();
  const email       = String(data.email     ?? "").trim();
  const phone       = String(data.phone     ?? "").trim();

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

  // ── Determine category ID and pricing key ──────────────────────────────────
  let categoryId: string | null = CAPACITY_MAP[type] ?? null;
  let pricingKey = type;

  if (type === "artist") {
    const boothSize = String(data.boothSize ?? "10x10");
    const extra     = Boolean(data.additionalBooth);
    const isDouble  = boothSize === "10x20";
    pricingKey = isDouble
      ? (extra ? "artist_double_extra" : "artist_double")
      : (extra ? "artist_single_extra" : "artist_single");
    // Slot reservation handled by ArtistApplicationForm internally
  }

  if (type === "vendor") {
    const boothSize = String(data.boothSize ?? "10x10");
    const isDouble  = boothSize === "double" || boothSize === "10x20";
    pricingKey  = isDouble ? "vendor_10x20" : "vendor_10x10";
    categoryId  = isDouble ? "vendor_10x20" : "vendor_10x10";
  }

  if (type === "sponsor") {
    const pkg  = String(data.package ?? data.sponsorPackage ?? "basic");
    pricingKey  = `sponsor_${pkg}`;
    categoryId  = pkg === "vip" ? "sponsor_vip" : null;
  }

  if (type === "competition") {
    // Categories count determines price
    const cats = Array.isArray(data.categories) ? data.categories.length : Number(data.categoryCount ?? 1);
    const capped = Math.max(1, Math.min(cats, 3));
    pricingKey = `competition_${capped}cat`;
  }

  const pricing = PRICING[pricingKey];
  if (!pricing && (TYPE_1.has(type) || TYPE_2.has(type))) {
    return NextResponse.json({ error: "Pricing not configured for this registration type." }, { status: 400 });
  }

  // ── Reserve slot (capacity check) ──────────────────────────────────────────
  if (categoryId && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const slot = await reserveSlot(categoryId);
      if (!slot.success) {
        return NextResponse.json(
          { error: `Sorry — this option is sold out (${categoryId.replace(/_/g, " ")}). Please contact us for waitlist options.` },
          { status: 409 }
        );
      }
    } catch (err) {
      console.error("[/api/register] reserveSlot error:", err);
      // Degrade gracefully — don't block registration
    }
  }

  // ── Generate order ID ───────────────────────────────────────────────────────
  const registrationType = type.replace("-", "_");
  const orderId = generateOrderId(registrationType);

  // ── Persist to Supabase ─────────────────────────────────────────────────────
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      await createRegistration({
        orderId,
        registrationType,
        firstName,
        lastName,
        email,
        phone,
        businessName: String(data.businessName ?? data.company ?? data.truckName ?? ""),
        city:         String(data.city  ?? ""),
        state:        String(data.state ?? ""),
        amountCents:  pricing ? pricing.dollars * 100 : undefined,
        termsAgreed:  Boolean(data.termsAgreed),
        metadata: {
          boothSize:        data.boothSize,
          vendorCategory:   data.vendorCategory,
          sponsorPackage:   data.sponsorPackage ?? data.package,
          tattoingYears:    data.yearsExp ?? data.tattoingYears,
          specialties:      data.specialties,
          portfolioUrl:     data.portfolio ?? data.portfolioUrl,
          instagramHandle:  data.instagram ?? data.instagramHandle,
          vehicleYear:      data.year,
          vehicleMake:      data.make,
          vehicleModel:     data.model,
          vehicleColor:     data.color,
          vehicleDesc:      data.description,
          website:          data.website ?? data.websiteOrInstagram,
          notes:            data.notes ?? data.message,
          additionalBooth:  data.additionalBooth,
          pricingKey,
          categoryId,
        },
        ipAddress: request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? undefined,
        userAgent: request.headers.get("user-agent") ?? undefined,
      });
    } catch (err) {
      console.error("[/api/register] createRegistration error:", err);
      // Log but don't block — email backup still runs
    }
  }

  // ── Payment test-mode bypass ─────────────────────────────────────────────────
  // ONLY active when server-side PAYMENT_TEST_MODE=true env var is set.
  // Cannot be triggered by clients. Never set in production.
  const paymentTestMode = process.env.PAYMENT_TEST_MODE === "true";

  if (paymentTestMode) {
    // Send emails immediately in test mode (no payment event to trigger them)
    const amountDisplay = pricing ? `Fee: $${pricing.dollars} (test mode — not charged)` : "";
    try {
      await resend.emails.send({
        from:    FROM_EMAIL,
        to:      ADMIN_EMAIL,
        subject: `[TEST][${type.toUpperCase()}] New Registration — ${firstName} ${lastName} — ${orderId}`,
        html:    buildAdminEmail({ ...data, pricingKey, orderId }, orderId, "TEST MODE — not charged"),
      });
    } catch (e) { console.error("[/api/register] admin email error:", e); }
    try {
      await resend.emails.send({
        from:    FROM_EMAIL,
        to:      email,
        subject: `${TYPE_META[type]?.label ?? "Registration"} Received — West TN Tattoo and Art Festival 2027 (${orderId})`,
        html:    buildConfirmationEmail(data, orderId, amountDisplay, true),
      });
    } catch (e) { console.error("[/api/register] confirmation email error:", e); }

    return NextResponse.json({ success: true, orderId, testMode: true });
  }

  // ── Create Stripe PaymentIntent ──────────────────────────────────────────────
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Payment system is not configured. Please contact us at westtninkrevival.com/contact." },
      { status: 503 }
    );
  }

  if (!pricing) {
    return NextResponse.json({ error: "Pricing not found for this registration type." }, { status: 400 });
  }

  const isType1 = TYPE_1.has(type);

  try {
    const pi = await stripe.paymentIntents.create({
      amount:               pricing.dollars * 100,
      currency:             "usd",
      capture_method:       isType1 ? "manual" : "automatic",
      payment_method_types: ["card"],
      receipt_email:        email,
      description:          pricing.name,
      metadata: {
        orderId,
        registrationType,
        firstName,
        lastName,
        pricingKey,
        paymentType: isType1 ? "auth" : "charge",
      },
    });

    // Store PI ID in Supabase now that we have it
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        await updateRegistrationStatus(orderId, "pending", {
          stripe_payment_intent_id: pi.id,
        });
      } catch (e) {
        console.error("[/api/register] PI ID update error:", e);
      }
    }

    // Admin notification (non-blocking)
    try {
      await resend.emails.send({
        from:    FROM_EMAIL,
        to:      ADMIN_EMAIL,
        subject: `[${type.toUpperCase()}] Payment Started — ${firstName} ${lastName} — ${orderId}`,
        html:    buildAdminEmail({ ...data, pricingKey, orderId }, orderId, isType1 ? "Auth pending" : "Charge pending"),
      });
    } catch (e) { console.error("[/api/register] admin email error:", e); }

    // Applicant confirmation (informs them a hold is placed or charge is pending)
    try {
      const amountDisplay = `$${pricing.dollars.toFixed(2)} ${isType1 ? "(hold — pending review)" : "(charged)"}`;
      await resend.emails.send({
        from:    FROM_EMAIL,
        to:      email,
        subject: `${TYPE_META[type].label} Received — West TN Tattoo and Art Festival 2027 (${orderId})`,
        html:    buildConfirmationEmail(data, orderId, amountDisplay),
      });
    } catch (e) { console.error("[/api/register] confirmation email error:", e); }

    return NextResponse.json({
      success:     true,
      orderId,
      clientSecret: pi.client_secret,
      amountCents: pricing.dollars * 100,
      paymentType: isType1 ? "auth" : "charge",
    });
  } catch (stripeErr) {
    console.error("[/api/register] Stripe error:", stripeErr);
    return NextResponse.json(
      { error: "Payment session could not be created. Please try again or contact us at westtninkrevival.com/contact." },
      { status: 500 }
    );
  }
}
