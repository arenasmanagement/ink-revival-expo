/**
 * Registration helpers — order ID generation, capacity labels, etc.
 * Used by API routes (server-side only).
 */

import { createServiceClient } from "./supabase";

// ── Order ID ──────────────────────────────────────────────────────────────────

const PREFIX: Record<string, string> = {
  artist:     "ART",
  vendor:     "VND",
  food_truck: "FTK",
  sponsor:    "SPR",
  car_show:   "CAR",
  competition:"CMP",
  ticket:     "TKT",
  contact:    "CON",
  email_list: "EML",
};

export function generateOrderId(type: string): string {
  const prefix = PREFIX[type] ?? "REG";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// ── Capacity ──────────────────────────────────────────────────────────────────

export async function getCapacity() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("wtsf_capacity")
    .select("*")
    .order("category");
  if (error) throw error;
  return data;
}

/**
 * Atomically reserve a slot. Returns false if sold out.
 * Must be called server-side (uses service role key).
 */
export async function reserveSlot(categoryId: string): Promise<{
  success: boolean;
  status: string;
  remaining: number;
}> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.rpc("reserve_slot", {
    category_id: categoryId,
  });
  if (error) throw error;
  const result = data?.[0];
  return {
    success:   result?.success   ?? false,
    status:    result?.slot_status ?? "error",
    remaining: result?.remaining ?? 0,
  };
}

// ── Registration insert ───────────────────────────────────────────────────────

export interface CreateRegistrationInput {
  orderId: string;
  registrationType: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  businessName?: string;
  city?: string;
  state?: string;
  amountCents?: number;
  metadata?: Record<string, unknown>;
  termsAgreed?: boolean;
  ipAddress?: string;
  userAgent?: string;
}

export async function createRegistration(input: CreateRegistrationInput) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("wtsf_registrations")
    .insert({
      order_id:          input.orderId,
      registration_type: input.registrationType,
      status:            "pending",
      first_name:        input.firstName,
      last_name:         input.lastName,
      email:             input.email,
      phone:             input.phone,
      business_name:     input.businessName,
      city:              input.city,
      state:             input.state,
      amount_cents:      input.amountCents,
      metadata:          input.metadata ?? {},
      terms_agreed:      input.termsAgreed ?? false,
      terms_agreed_at:   input.termsAgreed ? new Date().toISOString() : null,
      ip_address:        input.ipAddress,
      user_agent:        input.userAgent,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateRegistrationStatus(
  orderId: string,
  status: string,
  extra?: Record<string, unknown>
) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("wtsf_registrations")
    .update({ status, updated_at: new Date().toISOString(), ...extra })
    .eq("order_id", orderId);
  if (error) throw error;
}

export async function markPaymentConfirmed(
  orderId: string,
  paymentIntentId: string
) {
  return updateRegistrationStatus(orderId, "confirmed", {
    stripe_payment_intent_id: paymentIntentId,
    paid_at: new Date().toISOString(),
  });
}
