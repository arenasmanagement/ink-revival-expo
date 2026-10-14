"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface CapacityRow {
  id: string;
  category: string;
  total_slots: number;
  reserved_slots: number;
  available: number;
  confirmed_from_regs: number;
  reserved_from_regs: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  artist: "Tattoo Artists",
  vendor: "Vendors",
  food_truck: "Food Trucks",
  sponsor: "Sponsors",
  car_show: "Car Show Entries",
  competition: "Competition Entries",
};

function CapacityBar({ used, reserved, total }: { used: number; reserved: number; total: number }) {
  const usedPct = total > 0 ? Math.min(100, (used / total) * 100) : 0;
  const reservedPct = total > 0 ? Math.min(100 - usedPct, (reserved / total) * 100) : 0;
  const isNearFull = (used + reserved) / total >= 0.8;
  const isFull = used >= total;

  return (
    <div style={{ width: "100%", height: "10px", background: "#f0ebe0", borderRadius: "5px", overflow: "hidden", display: "flex" }}>
      <div style={{ width: `${usedPct}%`, background: isFull ? "#dc2626" : "#16a34a", transition: "width 0.4s" }} />
      <div style={{ width: `${reservedPct}%`, background: isNearFull ? "#f59e0b" : "#93c5fd", transition: "width 0.4s" }} />
    </div>
  );
}

export default function CapacityPage() {
  const [capacity, setCapacity] = useState<CapacityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/capacity");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed");
      setCapacity(json.capacity ?? []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div style={{ padding: "32px 32px 48px", maxWidth: "900px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#C4902A", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.25em", textTransform: "uppercase" }}>
            Admin Portal
          </p>
          <h1 style={{ margin: 0, fontSize: "24px", fontFamily: "var(--font-rye, serif)", color: "#1a120a" }}>
            Capacity Management
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#888", fontFamily: "var(--font-garamond, serif)" }}>
            Live slot counts from the database — confirmed, pending review, and approved pending payment.
          </p>
        </div>
        <button
          onClick={load}
          style={{ padding: "9px 16px", fontSize: "11px", fontFamily: "var(--font-special-elite, monospace)", background: "none", border: "1px solid #d1c9b8", color: "#888", cursor: "pointer", borderRadius: "3px" }}
        >
          ↺ Refresh
        </button>
      </div>

      {loading && <p style={{ color: "#888", fontFamily: "var(--font-garamond, serif)", fontSize: "14px" }}>Loading capacity data…</p>}
      {error && <p style={{ color: "#dc2626", fontFamily: "var(--font-garamond, serif)", fontSize: "14px" }}>Error: {error}</p>}

      {!loading && !error && (
        <>
          {/* Legend */}
          <div style={{ display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
            {[
              { color: "#16a34a", label: "Confirmed & Paid" },
              { color: "#93c5fd", label: "Reserved (Pending Review / Approved — Pay Due)" },
              { color: "#f0ebe0", label: "Available" },
            ].map((l) => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "2px", background: l.color, border: "1px solid #e5e0d5" }} />
                <span style={{ fontSize: "11px", color: "#888", fontFamily: "var(--font-garamond, serif)" }}>{l.label}</span>
              </div>
            ))}
          </div>

          {capacity.length === 0 ? (
            <div style={{ background: "#fff", border: "1px solid #e5e0d5", borderRadius: "6px", padding: "48px", textAlign: "center" }}>
              <p style={{ color: "#aaa", fontFamily: "var(--font-garamond, serif)", fontSize: "16px", margin: 0 }}>
                No capacity records found. Check that the <code>wtsf_capacity</code> table has rows.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {capacity.map((row) => {
                const label = CATEGORY_LABELS[row.category] ?? row.category;
                const available = row.total_slots - row.confirmed_from_regs;
                const pct = row.total_slots > 0 ? Math.round(((row.confirmed_from_regs + row.reserved_from_regs) / row.total_slots) * 100) : 0;
                const isFull = row.confirmed_from_regs >= row.total_slots;

                return (
                  <div key={row.id} style={{ background: "#fff", border: "1px solid #e5e0d5", borderRadius: "6px", padding: "20px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div>
                        <p style={{ margin: 0, fontSize: "15px", fontFamily: "var(--font-special-elite, monospace)", color: "#1a120a" }}>{label}</p>
                        <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#888", fontFamily: "var(--font-garamond, serif)" }}>
                          {row.confirmed_from_regs} confirmed · {row.reserved_from_regs} reserved · {Math.max(0, available - row.reserved_from_regs)} open
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: 0, fontSize: "22px", fontFamily: "var(--font-rye, serif)", color: isFull ? "#dc2626" : "#1a120a" }}>
                          {row.confirmed_from_regs} <span style={{ fontSize: "14px", color: "#aaa" }}>/ {row.total_slots}</span>
                        </p>
                        <span style={{
                          fontSize: "10px", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.1em",
                          padding: "2px 8px", borderRadius: "2px",
                          background: isFull ? "#fee2e2" : pct >= 80 ? "#fef9c3" : "#dcfce7",
                          color: isFull ? "#991b1b" : pct >= 80 ? "#854d0e" : "#166534",
                        }}>
                          {isFull ? "FULL" : pct >= 80 ? "NEAR FULL" : "OPEN"}
                        </span>
                      </div>
                    </div>
                    <CapacityBar used={row.confirmed_from_regs} reserved={row.reserved_from_regs} total={row.total_slots} />
                    <p style={{ margin: "8px 0 0", fontSize: "11px", color: "#aaa", fontFamily: "var(--font-garamond, serif)" }}>
                      {pct}% filled (confirmed + reserved)
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer note */}
          <div style={{ marginTop: "24px", background: "#fef9ee", border: "1px solid #f0e8c8", borderRadius: "6px", padding: "14px 18px" }}>
            <p style={{ margin: 0, fontSize: "12px", color: "#92400e", fontFamily: "var(--font-garamond, serif)" }}>
              <strong>Note:</strong> "Confirmed" counts registrations with status <em>captured</em> or <em>confirmed</em>. "Reserved" counts <em>pending_review</em> and <em>approved_pending_payment</em>. Pending payment and cancelled applications are not counted. Slot totals are managed in the <code>wtsf_capacity</code> table.
            </p>
          </div>

          {/* Quick link */}
          <div style={{ marginTop: "16px" }}>
            <Link href="/admin/applications?status=pending_review" style={{ fontSize: "12px", color: "#C4902A", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.1em", textDecoration: "none" }}>
              VIEW PENDING REVIEW APPLICATIONS →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
