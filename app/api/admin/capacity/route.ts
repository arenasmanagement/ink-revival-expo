/**
 * /api/admin/capacity
 * GET — real-time capacity from wtsf_capacity + confirmed registration counts
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const supabase = createServiceClient();

    const [capResult, regResult] = await Promise.all([
      supabase.from("wtsf_capacity").select("*").order("category"),
      supabase
        .from("wtsf_registrations")
        .select("registration_type, status")
        .in("status", ["pending_review", "captured", "confirmed", "approved_pending_payment"]),
    ]);

    if (capResult.error) throw capResult.error;

    const regs = regResult.data ?? [];

    // Count confirmed and pending by type
    const confirmed: Record<string, number> = {};
    const reserved: Record<string, number> = {};

    for (const reg of regs) {
      const t = reg.registration_type ?? "";
      if (reg.status === "captured" || reg.status === "confirmed") {
        confirmed[t] = (confirmed[t] ?? 0) + 1;
      } else if (reg.status === "pending_review" || reg.status === "approved_pending_payment") {
        reserved[t] = (reserved[t] ?? 0) + 1;
      }
    }

    const capacity = (capResult.data ?? []).map((row) => ({
      ...row,
      confirmed_from_regs: confirmed[row.category] ?? 0,
      reserved_from_regs: reserved[row.category] ?? 0,
      available: Math.max(0, row.total_slots - (row.reserved_slots ?? 0)),
    }));

    return NextResponse.json({ capacity });
  } catch (err) {
    console.error("[admin/capacity]", err);
    return NextResponse.json({ error: "Failed to load capacity." }, { status: 500 });
  }
}
