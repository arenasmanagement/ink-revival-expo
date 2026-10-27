"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Registration {
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
  amount_cents: number;
  stripe_payment_intent_id: string | null;
  created_at: string;
  metadata: Record<string, unknown> | null;
  paid_at?: string;
  denial_reason?: string;
}

const TYPE_LABELS: Record<string, string> = {
  artist: "Tattoo Artist",
  vendor: "Vendor",
  food_truck: "Food Truck",
  sponsor: "Sponsor",
  car_show: "Car Show",
  competition: "Competition",
};

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  pending:                    { bg: "#fef3c7", text: "#92400e", label: "Awaiting Payment" },
  pending_review:             { bg: "#dbeafe", text: "#1e40af", label: "Pending Review" },
  captured:                   { bg: "#dcfce7", text: "#166534", label: "Approved & Paid" },
  confirmed:                  { bg: "#dcfce7", text: "#166534", label: "Confirmed" },
  cancelled:                  { bg: "#fee2e2", text: "#991b1b", label: "Denied" },
  payment_failed:             { bg: "#fee2e2", text: "#991b1b", label: "Payment Failed" },
  approved_pending_payment:   { bg: "#ede9fe", text: "#5b21b6", label: "Approved — Pay Needed" },
  info_requested:             { bg: "#fef3c7", text: "#92400e", label: "Info Requested" },
};

const STATUSES = [
  { value: "all",                     label: "All Applications" },
  { value: "pending_review",          label: "Pending Review" },
  { value: "pending",                 label: "Awaiting Payment" },
  { value: "payment_failed",          label: "Payment Failed" },
  { value: "approved_pending_payment",label: "Approved — Pay Needed" },
  { value: "captured",                label: "Approved & Paid" },
  { value: "cancelled",               label: "Denied" },
  { value: "info_requested",          label: "Info Requested" },
];

const TYPES = [
  { value: "", label: "All Types" },
  { value: "artist", label: "Tattoo Artist" },
  { value: "vendor", label: "Vendor" },
  { value: "food_truck", label: "Food Truck" },
  { value: "sponsor", label: "Sponsor" },
  { value: "car_show", label: "Car Show" },
  { value: "competition", label: "Competition" },
];

function ApplicationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const status = searchParams.get("status") ?? "all";
  const type = searchParams.get("type") ?? "";
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status, page: String(page), limit: "50" });
      if (type) params.set("type", type);
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/registrations?${params}`);
      const json = await res.json();
      setRegistrations(json.registrations ?? []);
      setTotal(json.total ?? 0);
    } catch {
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  }, [status, type, search, page]);

  useEffect(() => { fetchRegistrations(); }, [fetchRegistrations]);

  function updateParam(key: string, value: string) {
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set(key, value); else p.delete(key);
    p.delete("page");
    router.push(`/admin/applications?${p.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    updateParam("search", searchInput);
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 pb-12" style={{ maxWidth: "1100px" }}>
      <div style={{ marginBottom: "24px" }}>
        <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#C4902A", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.25em", textTransform: "uppercase" }}>
          Admin Portal
        </p>
        <h1 style={{ margin: 0, fontSize: "24px", fontFamily: "var(--font-rye, serif)", color: "#1a120a" }}>
          Applications
        </h1>
        {total > 0 && <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#888", fontFamily: "var(--font-garamond, serif)" }}>{total} result{total !== 1 ? "s" : ""}</p>}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "20px", alignItems: "center" }}>
        {/* Status filter */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => updateParam("status", s.value)}
              style={{
                padding: "6px 12px",
                fontSize: "11px",
                fontFamily: "var(--font-special-elite, monospace)",
                letterSpacing: "0.05em",
                border: "1px solid",
                borderColor: status === s.value ? "#1a120a" : "#d1c9b8",
                background: status === s.value ? "#1a120a" : "#faf6ee",
                color: status === s.value ? "#F5EDD8" : "#555",
                cursor: "pointer",
                borderRadius: "3px",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Type filter */}
        <select
          value={type}
          onChange={(e) => updateParam("type", e.target.value)}
          style={{ padding: "7px 12px", fontSize: "12px", fontFamily: "var(--font-special-elite, monospace)", border: "1px solid #d1c9b8", background: "#fff", color: "#333", borderRadius: "3px", cursor: "pointer" }}
        >
          {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "6px" }}>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name, email, business…"
            style={{ padding: "7px 12px", fontSize: "12px", fontFamily: "var(--font-garamond, serif)", border: "1px solid #d1c9b8", background: "#fff", color: "#333", width: "220px", borderRadius: "3px" }}
          />
          <button type="submit" style={{ padding: "7px 14px", fontSize: "11px", fontFamily: "var(--font-special-elite, monospace)", background: "#C4902A", color: "#fff", border: "none", cursor: "pointer", borderRadius: "3px" }}>
            Search
          </button>
          {search && (
            <button type="button" onClick={() => { setSearchInput(""); setSearch(""); updateParam("search", ""); }} style={{ padding: "7px 12px", fontSize: "11px", fontFamily: "var(--font-special-elite, monospace)", background: "none", border: "1px solid #d1c9b8", color: "#888", cursor: "pointer", borderRadius: "3px" }}>
              Clear
            </button>
          )}
        </form>

        <button onClick={fetchRegistrations} style={{ marginLeft: "auto", padding: "7px 12px", fontSize: "11px", fontFamily: "var(--font-special-elite, monospace)", background: "none", border: "1px solid #d1c9b8", color: "#888", cursor: "pointer", borderRadius: "3px" }}>
          ↺ Refresh
        </button>
      </div>

      {/* Applications list */}
      {loading ? (
        <p style={{ color: "#888", fontFamily: "var(--font-garamond, serif)", fontSize: "14px", padding: "40px 0" }}>Loading applications…</p>
      ) : registrations.length === 0 ? (
        <div style={{ background: "#faf6ee", border: "1px solid #e0d8c8", borderRadius: "6px", padding: "48px", textAlign: "center" }}>
          <p style={{ color: "#aaa", fontFamily: "var(--font-garamond, serif)", fontSize: "16px", margin: 0 }}>No applications found with these filters.</p>
        </div>
      ) : (
        <>
          {/* Desktop table — hidden on small screens */}
          <div className="hidden md:block" style={{ display: "flex", flexDirection: "column", gap: "1px", background: "#e0d8c8", borderRadius: "6px", overflow: "hidden", border: "1px solid #e0d8c8" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 130px 140px 80px 100px 80px", gap: "16px", padding: "10px 20px", background: "#f5f0e8", fontSize: "10px", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8a7a68" }}>
              <span>Applicant</span>
              <span>Type</span>
              <span>Status</span>
              <span>Amount</span>
              <span>Date</span>
              <span>Action</span>
            </div>
            {registrations.map((reg) => {
              const statusStyle = STATUS_COLORS[reg.status] ?? { bg: "#f3f4f6", text: "#6b7280", label: reg.status };
              return (
                <div key={reg.order_id} style={{ display: "grid", gridTemplateColumns: "1fr 130px 140px 80px 100px 80px", gap: "16px", padding: "14px 20px", background: "#faf6ee", alignItems: "center" }}>
                  <div>
                    <p style={{ margin: "0 0 2px", fontSize: "14px", fontFamily: "var(--font-special-elite, monospace)", color: "#1a120a" }}>
                      {reg.first_name} {reg.last_name}
                    </p>
                    {reg.business_name && (
                      <p style={{ margin: "0 0 2px", fontSize: "12px", color: "#8a7a68", fontFamily: "var(--font-garamond, serif)" }}>{reg.business_name}</p>
                    )}
                    <p style={{ margin: 0, fontSize: "11px", color: "#aaa", fontFamily: "var(--font-garamond, serif)" }}>{reg.email}</p>
                  </div>
                  <span style={{ fontSize: "12px", color: "#555", fontFamily: "var(--font-special-elite, monospace)" }}>
                    {TYPE_LABELS[reg.registration_type] ?? reg.registration_type}
                  </span>
                  <span style={{ display: "inline-block", padding: "3px 8px", borderRadius: "3px", fontSize: "10px", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.05em", background: statusStyle.bg, color: statusStyle.text }}>
                    {statusStyle.label}
                  </span>
                  <span style={{ fontSize: "13px", fontFamily: "var(--font-garamond, serif)", color: "#333" }}>
                    {reg.amount_cents ? `$${(reg.amount_cents / 100).toFixed(0)}` : "—"}
                  </span>
                  <span style={{ fontSize: "11px", color: "#aaa", fontFamily: "var(--font-garamond, serif)" }}>
                    {new Date(reg.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                  </span>
                  <Link href={`/admin/applications/${reg.order_id}`} style={{ display: "inline-block", padding: "5px 12px", background: "#1a120a", color: "#F5EDD8", textDecoration: "none", fontSize: "10px", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.1em", borderRadius: "3px" }}>
                    View →
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Mobile cards — shown only on small screens */}
          <div className="flex flex-col gap-3 md:hidden">
            {registrations.map((reg) => {
              const statusStyle = STATUS_COLORS[reg.status] ?? { bg: "#f3f4f6", text: "#6b7280", label: reg.status };
              return (
                <Link key={reg.order_id} href={`/admin/applications/${reg.order_id}`} style={{ textDecoration: "none", display: "block", background: "#faf6ee", border: "1px solid #e0d8c8", borderRadius: "6px", padding: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <div>
                      <p style={{ margin: "0 0 2px", fontSize: "15px", fontFamily: "var(--font-special-elite, monospace)", color: "#1a120a" }}>
                        {reg.first_name} {reg.last_name}
                      </p>
                      {reg.business_name && (
                        <p style={{ margin: "0 0 2px", fontSize: "12px", color: "#8a7a68", fontFamily: "var(--font-garamond, serif)" }}>{reg.business_name}</p>
                      )}
                      <p style={{ margin: 0, fontSize: "11px", color: "#aaa", fontFamily: "var(--font-garamond, serif)" }}>{reg.email}</p>
                    </div>
                    <span style={{ display: "inline-block", padding: "3px 8px", borderRadius: "3px", fontSize: "10px", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.05em", background: statusStyle.bg, color: statusStyle.text, flexShrink: 0, marginLeft: "8px" }}>
                      {statusStyle.label}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <span style={{ fontSize: "11px", color: "#8a7a68", fontFamily: "var(--font-special-elite, monospace)" }}>
                        {TYPE_LABELS[reg.registration_type] ?? reg.registration_type}
                      </span>
                      {reg.amount_cents ? (
                        <span style={{ fontSize: "12px", color: "#1a120a", fontFamily: "var(--font-garamond, serif)", fontWeight: 600 }}>
                          ${(reg.amount_cents / 100).toFixed(0)}
                        </span>
                      ) : null}
                    </div>
                    <span style={{ fontSize: "11px", color: "#C4902A", fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.08em" }}>
                      View →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}

      {/* Pagination */}
      {total > 50 && (
        <div style={{ display: "flex", gap: "8px", marginTop: "16px", justifyContent: "center" }}>
          {page > 1 && (
            <button onClick={() => updateParam("page", String(page - 1))} style={{ padding: "8px 16px", fontSize: "12px", fontFamily: "var(--font-special-elite, monospace)", background: "#faf6ee", border: "1px solid #e0d8c8", cursor: "pointer", borderRadius: "3px" }}>
              ← Previous
            </button>
          )}
          <span style={{ padding: "8px 12px", fontSize: "12px", color: "#888", fontFamily: "var(--font-garamond, serif)" }}>
            Page {page} of {Math.ceil(total / 50)}
          </span>
          {page * 50 < total && (
            <button onClick={() => updateParam("page", String(page + 1))} style={{ padding: "8px 16px", fontSize: "12px", fontFamily: "var(--font-special-elite, monospace)", background: "#faf6ee", border: "1px solid #e0d8c8", cursor: "pointer", borderRadius: "3px" }}>
              Next →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <Suspense fallback={<div style={{ padding: "32px" }}><p style={{ color: "#888" }}>Loading…</p></div>}>
      <ApplicationsContent />
    </Suspense>
  );
}
