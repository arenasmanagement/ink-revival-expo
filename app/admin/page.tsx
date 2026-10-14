"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Stats {
  total: number;
  pending: number;
  pending_review: number;
  captured: number;
  confirmed: number;
  cancelled: number;
  payment_failed: number;
  approved_pending_payment: number;
  info_requested: number;
  total_revenue_cents: number;
  pending_revenue_cents: number;
  by_type: Record<string, number>;
  recent: Array<{ status: string; registration_type: string; amount_cents: number; created_at: string }>;
}

const TYPE_LABELS: Record<string, string> = {
  artist: "Tattoo Artists",
  vendor: "Vendors",
  food_truck: "Food Trucks",
  sponsor: "Sponsors",
  car_show: "Car Show",
  competition: "Competitions",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#d97706",
  pending_review: "#2563eb",
  captured: "#16a34a",
  confirmed: "#16a34a",
  cancelled: "#dc2626",
  payment_failed: "#dc2626",
  approved_pending_payment: "#7c3aed",
  info_requested: "#d97706",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Awaiting Payment",
  pending_review: "Pending Review",
  captured: "Approved & Paid",
  confirmed: "Confirmed",
  cancelled: "Denied/Cancelled",
  payment_failed: "Payment Failed",
  approved_pending_payment: "Approved — Payment Needed",
  info_requested: "Info Requested",
};

function StatCard({ label, value, href, color, sub }: { label: string; value: number | string; href?: string; color?: string; sub?: string }) {
  const content = (
    <div style={{
      background: "#fff",
      border: "1px solid #e5e0d5",
      borderRadius: "6px",
      padding: "20px",
      transition: "box-shadow 0.15s",
      cursor: href ? "pointer" : "default",
    }}>
      <p style={{ margin: "0 0 8px", fontSize: "11px", color: "#888", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</p>
      <p style={{ margin: "0", fontSize: "36px", fontFamily: "var(--font-rye, serif)", color: color ?? "#1a120a", lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#888", fontFamily: "var(--font-garamond, serif)" }}>{sub}</p>}
    </div>
  );

  if (href) {
    return <Link href={href} style={{ textDecoration: "none", display: "block" }}>{content}</Link>;
  }
  return content;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setStats(d);
      })
      .catch((e) => setError(e.message ?? "Failed to load stats."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "32px 32px 48px", maxWidth: "1100px" }}>
      {/* Page header */}
      <div style={{ marginBottom: "32px" }}>
        <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#C4902A", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.25em", textTransform: "uppercase" }}>
          Admin Dashboard
        </p>
        <h1 style={{ margin: "0", fontSize: "28px", fontFamily: "var(--font-rye, serif)", color: "#1a120a" }}>
          West TN Tattoo and Art Festival 2027
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#888", fontFamily: "var(--font-garamond, serif)" }}>
          March 12–14, 2027 · Carroll County Fairgrounds, Huntingdon, TN
        </p>
      </div>

      {loading && (
        <p style={{ color: "#888", fontFamily: "var(--font-garamond, serif)", fontSize: "14px" }}>Loading dashboard…</p>
      )}
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", padding: "16px", color: "#dc2626", fontSize: "14px" }}>
          Error: {error}
        </div>
      )}

      {stats && (
        <>
          {/* Main stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
            <StatCard label="Total Applications" value={stats.total} href="/admin/applications?status=all" />
            <StatCard label="Pending Review" value={stats.pending_review} href="/admin/applications?status=pending_review" color="#2563eb" />
            <StatCard label="Awaiting Payment" value={stats.pending + (stats.approved_pending_payment ?? 0)} href="/admin/applications?status=pending" color="#d97706" />
            <StatCard label="Approved & Paid" value={(stats.captured ?? 0) + (stats.confirmed ?? 0)} href="/admin/applications?status=captured" color="#16a34a" />
            <StatCard label="Denied" value={stats.cancelled} href="/admin/applications?status=cancelled" color="#dc2626" />
            <StatCard
              label="Revenue Collected"
              value={`$${(stats.total_revenue_cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })}`}
              color="#C4902A"
              sub={stats.pending_revenue_cents > 0 ? `+$${(stats.pending_revenue_cents / 100).toLocaleString()} pending` : undefined}
            />
          </div>

          {/* Two column section */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Applications by type */}
            <div style={{ background: "#fff", border: "1px solid #e5e0d5", borderRadius: "6px", padding: "24px" }}>
              <h2 style={{ margin: "0 0 16px", fontSize: "15px", fontFamily: "var(--font-special-elite, monospace)", color: "#1a120a", letterSpacing: "0.05em" }}>
                Applications by Type
              </h2>
              {Object.entries(stats.by_type).length === 0 ? (
                <p style={{ color: "#aaa", fontSize: "13px" }}>No applications yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {Object.entries(stats.by_type).map(([type, count]) => (
                    <Link key={type} href={`/admin/applications?type=${type}&status=all`} style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0ebe0" }}>
                      <span style={{ fontSize: "13px", color: "#555", fontFamily: "var(--font-garamond, serif)" }}>
                        {TYPE_LABELS[type] ?? type}
                      </span>
                      <span style={{ fontSize: "18px", fontFamily: "var(--font-rye, serif)", color: "#1a120a" }}>{count}</span>
                    </Link>
                  ))}
                </div>
              )}
              <Link href="/admin/applications?status=all" style={{ display: "inline-block", marginTop: "16px", fontSize: "12px", color: "#C4902A", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.1em", textDecoration: "none" }}>
                VIEW ALL APPLICATIONS →
              </Link>
            </div>

            {/* Recent activity */}
            <div style={{ background: "#fff", border: "1px solid #e5e0d5", borderRadius: "6px", padding: "24px" }}>
              <h2 style={{ margin: "0 0 16px", fontSize: "15px", fontFamily: "var(--font-special-elite, monospace)", color: "#1a120a", letterSpacing: "0.05em" }}>
                Recent Submissions
              </h2>
              {stats.recent.length === 0 ? (
                <p style={{ color: "#aaa", fontSize: "13px" }}>No submissions yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {stats.recent.map((r, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0ebe0" }}>
                      <div>
                        <p style={{ margin: 0, fontSize: "13px", fontFamily: "var(--font-special-elite, monospace)", color: "#333" }}>
                          {TYPE_LABELS[r.registration_type] ?? r.registration_type}
                        </p>
                        <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#aaa", fontFamily: "var(--font-garamond, serif)" }}>
                          {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: "3px",
                          fontSize: "10px",
                          fontFamily: "var(--font-special-elite, monospace)",
                          letterSpacing: "0.05em",
                          background: `${STATUS_COLORS[r.status] ?? "#888"}20`,
                          color: STATUS_COLORS[r.status] ?? "#888",
                        }}>
                          {STATUS_LABELS[r.status] ?? r.status}
                        </span>
                        {r.amount_cents > 0 && (
                          <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#555", fontFamily: "var(--font-garamond, serif)" }}>
                            ${(r.amount_cents / 100).toFixed(0)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* System status */}
          <div style={{ background: "#fff", border: "1px solid #e5e0d5", borderRadius: "6px", padding: "24px" }}>
            <h2 style={{ margin: "0 0 16px", fontSize: "15px", fontFamily: "var(--font-special-elite, monospace)", color: "#1a120a", letterSpacing: "0.05em" }}>
              System Status
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
              {[
                { name: "Registration Forms", status: "live", note: "Artists, Vendors, Food Trucks, Sponsors, Car Show, Competitions" },
                { name: "Admin Review Portal", status: "live", note: "This panel — approve, deny, request info, add notes" },
                { name: "Applicant Emails (Resend)", status: "live", note: "Approval, denial, and info-request emails working" },
                { name: "Stripe Payments", status: "test", note: "Running in TEST MODE — no real money collected" },
                { name: "Stripe Webhook", status: "pending", note: "Register endpoint in Stripe dashboard once live keys are ready" },
                { name: "Live Stripe Credentials", status: "pending", note: "Complete Stripe verification, then update Vercel env vars" },
              ].map((item) => (
                <div key={item.name} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div style={{
                    width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0, marginTop: "5px",
                    background: item.status === "live" ? "#16a34a" : item.status === "test" ? "#d97706" : "#dc2626",
                  }} />
                  <div>
                    <p style={{ margin: "0 0 2px", fontSize: "13px", fontFamily: "var(--font-special-elite, monospace)", color: "#333" }}>
                      {item.name}
                      <span style={{
                        marginLeft: "8px", fontSize: "9px", padding: "1px 6px", borderRadius: "2px", fontFamily: "var(--font-special-elite, monospace)",
                        background: item.status === "live" ? "#dcfce7" : item.status === "test" ? "#fef9c3" : "#fee2e2",
                        color: item.status === "live" ? "#166534" : item.status === "test" ? "#854d0e" : "#991b1b",
                      }}>
                        {item.status === "live" ? "LIVE" : item.status === "test" ? "TEST MODE" : "PENDING"}
                      </span>
                    </p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#aaa", fontFamily: "var(--font-garamond, serif)" }}>{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/admin/applications?status=pending_review" style={{
              padding: "10px 20px",
              background: "#2563eb",
              color: "#fff",
              textDecoration: "none",
              fontSize: "12px",
              fontFamily: "var(--font-special-elite, monospace)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderRadius: "4px",
            }}>
              Review Pending ({stats.pending_review})
            </Link>
            <Link href="/admin/capacity" style={{
              padding: "10px 20px",
              background: "#fff",
              color: "#1a120a",
              border: "1px solid #e5e0d5",
              textDecoration: "none",
              fontSize: "12px",
              fontFamily: "var(--font-special-elite, monospace)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderRadius: "4px",
            }}>
              View Capacity
            </Link>
            <Link href="/admin/activity" style={{
              padding: "10px 20px",
              background: "#fff",
              color: "#1a120a",
              border: "1px solid #e5e0d5",
              textDecoration: "none",
              fontSize: "12px",
              fontFamily: "var(--font-special-elite, monospace)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderRadius: "4px",
            }}>
              Activity Log
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
