/**
 * /api/admin/cancel
 * POST { orderId }
 * Admin-only: cancels (denies) an authorized PaymentIntent — releases the hold.
 * Requires valid admin session cookie.
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getRegistrationByOrderId, updateRegistrationStatus } from "@/lib/registration";
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

  if (registration.status === "cancelled") {
    return NextResponse.json({ ok: true, alreadyCancelled: true });
  }

  try {
    await stripe.paymentIntents.cancel(piId);
    await updateRegistrationStatus(orderId, "cancelled");
    return NextResponse.json({ ok: true, orderId });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Cancellation failed.";
    console.error("[admin/cancel]", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
