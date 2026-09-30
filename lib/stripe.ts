import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-08-26.dahlia" as const,
  typescript: true,
});

// ── Price helpers ─────────────────────────────────────────────────────────────

/** Convert dollars to Stripe cents */
export const toCents = (dollars: number): number => Math.round(dollars * 100);

/** Format cents as dollar string */
export const formatPrice = (cents: number): string =>
  `$${(cents / 100).toFixed(2)}`;

// ── Line item builder ─────────────────────────────────────────────────────────

export interface LineItem {
  name: string;
  amount: number; // in dollars
  quantity?: number;
}

export function buildLineItems(items: LineItem[]): Stripe.Checkout.SessionCreateParams.LineItem[] {
  return items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: { name: item.name },
      unit_amount: toCents(item.amount),
    },
    quantity: item.quantity ?? 1,
  }));
}

// ── Webhook signature verification ───────────────────────────────────────────

export function verifyWebhookSignature(
  payload: Buffer | string,
  signature: string
): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET is not set");
  return stripe.webhooks.constructEvent(payload, signature, secret);
}
