/**
 * /api/admin/stats
 * GET — dashboard statistics (counts by status, revenue totals)
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

    // Fetch all registrations for counting
    const { data: regs, error } = await supabase
      .from("wtsf_registrations")
      .select("status, registration_type, amount_cents, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const allRegs = regs ?? [];

    // Count by status
    const counts: Record<string, number> = {};
    let totalRevenue = 0;
    let pendingRevenue = 0;

    for (const reg of allRegs) {
      const s = reg.status ?? "unknown";
      counts[s] = (counts[s] ?? 0) + 1;

      if (reg.status === "captured" || reg.status === "confirmed") {
        totalRevenue += reg.amount_cents ?? 0;
      }
      if (reg.status === "pending_review") {
        pendingRevenue += reg.amount_cents ?? 0;
      }
    }

    // Count by type
    const byType: Record<string, number> = {};
    for (const reg of allRegs) {
      const t = reg.registration_type ?? "unknown";
      byType[t] = (byType[t] ?? 0) + 1;
    }

    // Recent 5 submissions
    const recent = allRegs.slice(0, 5).map((r) => ({
      status: r.status,
      registration_type: r.registration_type,
      amount_cents: r.amount_cents,
      created_at: r.created_at,
    }));

    return NextResponse.json({
      total: allRegs.length,
      pending: counts["pending"] ?? 0,
      pending_review: counts["pending_review"] ?? 0,
      captured: counts["captured"] ?? 0,
      confirmed: counts["confirmed"] ?? 0,
      cancelled: counts["cancelled"] ?? 0,
      payment_failed: counts["payment_failed"] ?? 0,
      approved_pending_payment: counts["approved_pending_payment"] ?? 0,
      info_requested: counts["info_requested"] ?? 0,
      total_revenue_cents: totalRevenue,
      pending_revenue_cents: pendingRevenue,
      by_type: byType,
      recent,
    });
  } catch (err) {
    console.error("[admin/stats]", err);
    return NextResponse.json({ error: "Failed to load stats." }, { status: 500 });
  }
}
