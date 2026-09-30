/**
 * Stripe Webhook Handler
 * POST /api/webhooks/stripe
 *
 * Handles: payment_intent.succeeded, payment_intent.payment_failed,
 *          checkout.session.completed
 *
 * IMPORTANT: raw body required for signature verification.
 * In next.config.ts add: api: { bodyParser: false } — or use the
 * edge runtime approach below (Next.js App Router reads raw body automatically).
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase";
import { markPaymentConfirmed, updateRegistrationStatus } from "@/lib/registration";

export const runtime = "nodejs"; // ensures Buffer is available

export async function POST(req: NextRequest) {
  const rawBody  = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event;
  try {
    event = verifyWebhookSignature(rawBody, signature);
  } catch (err) {
    console.error("[stripe-webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Idempotency — skip already-processed events
  const { data: existing } = await supabase
    .from("wtsf_stripe_events")
    .select("id")
    .eq("id", event.id)
    .single();

  if (existing) {
    return NextResponse.json({ received: true, skipped: true });
  }

  // Store the event
  await supabase.from("wtsf_stripe_events").insert({
    id:      event.id,
    type:    event.type,
    payload: event.data.object,
  });

  // ── Handle events ──────────────────────────────────────────────
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as { metadata?: Record<string, string>; payment_intent?: string; id: string };
        const orderId = session.metadata?.orderId;
        if (orderId && session.payment_intent) {
          await markPaymentConfirmed(orderId, session.payment_intent as string);
        }
        break;
      }

      case "payment_intent.succeeded": {
        const pi = event.data.object as { metadata?: Record<string, string>; id: string };
        const orderId = pi.metadata?.orderId;
        if (orderId) {
          await markPaymentConfirmed(orderId, pi.id);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as { metadata?: Record<string, string> };
        const orderId = pi.metadata?.orderId;
        if (orderId) {
          await updateRegistrationStatus(orderId, "payment_pending");
        }
        break;
      }

      default:
        // Unhandled event type — log and return 200 so Stripe stops retrying
        console.log(`[stripe-webhook] unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("[stripe-webhook] handler error:", err);
    // Return 200 anyway so Stripe doesn't retry — log the error for debugging
  }

  return NextResponse.json({ received: true });
}
