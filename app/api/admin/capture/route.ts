/**
 * /api/admin/capture
 * POST { orderId }
 * Admin-only: captures an authorized (manual-capture) PaymentIntent.
 * Requires valid admin session cookie.
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getRegistrationByOrderId, markPaymentCaptured } from "@/lib/registration";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  let body: { orderId?: string };
  try { body = await req.json(); } catch { body = {}; }
  const { orderId } = body;

  if (!orderId) {
    return NextResponse.json({ error: "orderId is required." }, { status: 400 });
  }

  let registration;
  try {
    registration = await getRegistrationByOrderId(orderId);
  } catch {
    return NextResponse.json({ error: "Registration not found." }, { status: 404 });
  }

  const piId = registration?.stripe_payment_intent_id;
  if (!piId) {
    return NextResponse.json({ error: "No payment intent associated with this registration." }, { status: 400 });
  }

  // Idempotent: if already captured, treat as success
  if (registration.status === "captured") {
    return NextResponse.json({ ok: true, alreadyCaptured: true });
  }

  try {
    await stripe.paymentIntents.capture(piId);
    await markPaymentCaptured(orderId);
    return NextResponse.json({ ok: true, orderId });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Capture failed.";
    console.error("[admin/capture]", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
