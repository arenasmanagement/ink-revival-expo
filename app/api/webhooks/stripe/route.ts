/**
 * Stripe Webhook Handler
 * POST /api/webhooks/stripe
 *
 * Handles:
 *   payment_intent.amount_capturable_updated — TYPE 1 authorized (hold placed)
 *   payment_intent.succeeded                 — TYPE 2 captured / any PI succeeded
 *   payment_intent.payment_failed            — payment failed
 *   payment_intent.canceled                  — PI canceled (deny flow)
 *   checkout.session.completed               — legacy Checkout Session flow
 *
 * Raw body required for signature verification.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase";
import {
  markPaymentConfirmed,
  markPaymentAuthorized,
  updateRegistrationStatus,
} from "@/lib/registration";

export const runtime = "nodejs"; // ensures Buffer is available

export async function POST(req: NextRequest) {
  const rawBody   = await req.text();
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

  // Store the event (best-effort)
  await supabase.from("wtsf_stripe_events").insert({
    id:      event.id,
    type:    event.type,
    payload: event.data.object,
  });

  // ── Handle events ──────────────────────────────────────────────────────────
  try {
    switch (event.type) {

      /**
       * TYPE 1: card authorized (hold placed), awaiting admin approval.
       * Sets status → "pending_review" so admin dashboard shows it.
       */
      case "payment_intent.amount_capturable_updated": {
        const pi = event.data.object as { metadata?: Record<string, string>; id: string; amount_capturable?: number };
        const orderId = pi.metadata?.orderId;
        if (orderId) {
          await markPaymentAuthorized(orderId, pi.id);
        }
        break;
      }

      /**
       * TYPE 2: payment fully succeeded (charge captured immediately).
       * Also fires when admin captures a TYPE 1 intent via stripe.paymentIntents.capture().
       */
      case "payment_intent.succeeded": {
        const pi = event.data.object as { metadata?: Record<string, string>; id: string };
        const orderId = pi.metadata?.orderId;
        if (orderId) {
          await markPaymentConfirmed(orderId, pi.id);
        }
        break;
      }

      /**
       * PI was canceled — either:
       *   - Admin denied a TYPE 1 authorization (via /api/admin/cancel)
       *   - Stripe auto-canceled an uncaptured auth after 7 days
       */
      case "payment_intent.canceled": {
        const pi = event.data.object as { metadata?: Record<string, string> };
        const orderId = pi.metadata?.orderId;
        if (orderId) {
          await updateRegistrationStatus(orderId, "cancelled");
        }
        break;
      }

      /**
       * Payment failed (declined card, etc.).
       */
      case "payment_intent.payment_failed": {
        const pi = event.data.object as { metadata?: Record<string, string> };
        const orderId = pi.metadata?.orderId;
        if (orderId) {
          await updateRegistrationStatus(orderId, "payment_failed");
        }
        break;
      }

      /**
       * Legacy: Checkout Session completed (from old direct-checkout flow).
       * Kept for backward-compatibility with any sessions created before the migration.
       */
      case "checkout.session.completed": {
        const session = event.data.object as {
          metadata?: Record<string, string>;
          payment_intent?: string;
          id: string;
        };
        const orderId = session.metadata?.orderId;
        if (orderId && session.payment_intent) {
          await markPaymentConfirmed(orderId, session.payment_intent as string);
        }
        break;
      }

      default:
        console.log(`[stripe-webhook] unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("[stripe-webhook] handler error:", err);
    // Return 200 so Stripe doesn't retry — error is logged for debugging
  }

  return NextResponse.json({ received: true });
}
