import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy singleton — defers createClient() until first use so Next.js can
// import this module at build time without env vars present.
let _publicClient: SupabaseClient | undefined;

function getPublicClient(): SupabaseClient {
  if (!_publicClient) {
    _publicClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return _publicClient;
}

/** Public client — use in Client Components for capacity reads */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getPublicClient()[prop as keyof SupabaseClient];
  },
});

/** Server client with service_role key — use only in API routes (server-side) */
export function createServiceClient() {
  const url        = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url)        throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

// ── Types ────────────────────────────────────────────────────────────────────

export type CapacityStatus = "open" | "limited" | "sold_out" | "closed";

export interface CapacityRow {
  id: string;
  category: string;
  label: string;
  total_slots: number;
  reserved_slots: number;
  status: CapacityStatus;
  updated_at: string;
}

export interface RegistrationRow {
  id: string;
  created_at: string;
  order_id: string;
  registration_type: string;
  status: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  business_name?: string;
  city?: string;
  state?: string;
  stripe_payment_intent_id?: string;
  stripe_checkout_session_id?: string;
  amount_cents?: number;
  paid_at?: string;
  metadata: Record<string, unknown>;
  terms_agreed: boolean;
  confirmation_email_sent: boolean;
}
