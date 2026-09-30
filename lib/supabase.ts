import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Public client — use in Client Components for capacity reads */
export const supabase = createClient(supabaseUrl, supabaseAnon);

/** Server client with service_role key — use only in API routes (server-side) */
export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  return createClient(supabaseUrl, serviceKey, {
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
