import Stripe from "stripe";

// ── Lazy singleton — never throws at module load time ────────────────────────
// Stripe keys are only required at runtime (inside API route handlers),
// not during next build / static analysis.

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-08-26.dahlia" as const,
      typescript: true,
    });
  }
  return _stripe;
}

// Convenience export — same lazy init, used in API routes
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
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
  return getStripe().webhooks.constructEvent(payload, signature, secret);
}
