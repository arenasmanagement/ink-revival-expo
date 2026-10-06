"use client";

import { useState, useEffect, useCallback } from "react";
import { CAPACITY, ADMISSION, PRICING } from "@/lib/eventData";

const CAPACITY_ROWS = [
  { category: "Tattoo Artist Booths",  total: CAPACITY.tattooArtistBooths, price: `$${PRICING.tattooArtist.single.price} / $${PRICING.tattooArtist.double.price} (single/double) + permit`, type: "artist" },
  { category: "Vendor Booths",         total: CAPACITY.vendorBooths,        price: `$${PRICING.vendor.single.price} / $${PRICING.vendor.double.price} (single/double)`, type: "vendor" },
  { category: "Food Truck Spaces",     total: CAPACITY.foodTrucks,          price: `$${PRICING.foodTruck.space.price}`,                       type: "food-truck" },
  { category: "Sponsor Booths",        total: CAPACITY.sponsorBooths,       price: "Custom packages",                                         type: "sponsor" },
  { category: "Car Show Vehicles",     total: CAPACITY.carShowVehicles,     price: "See car-show page",                                       type: "car-show" },
  { category: "VIP Sponsors",          total: CAPACITY.vipSponsors,         price: "TBD — confirm before publishing",                         type: "sponsor" },
];

const ADMISSION_ROWS = [
  { label: "Friday, March 12",      price: `$${ADMISSION.friday.price}` },
  { label: "Saturday, March 13",    price: `$${ADMISSION.saturday.price}` },
  { label: "Sunday, March 14",      price: `$${ADMISSION.sunday.price}` },
  { label: "3-Day Weekend Pass",    price: `$${ADMISSION.weekend.price}` },
  { label: "Children (12 & under)", price: "FREE" },
];

interface Registration {
  order_id: string;
  registration_type: string;
  status: string;
  first_name: string;
  last_name: string;
  email: string;
  amount_cents: number;
  stripe_payment_intent_id: string | null;
  created_at: string;
  metadata: Record<string, unknown> | null;
}

type Tab = "registrations" | "capacity" | "links";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed]     = useState<boolean | null>(null); // null = checking
  const [loginError, setLoginError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [tab, setTab] = useState<Tab>("registrations");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [statusFilter, setStatusFilter] = useState("pending_review");
  const [actionLoading, setActionLoading] = useState<string | null>(null); // orderId being acted on
  const [actionMsg, setActionMsg] = useState<{ orderId: string; msg: string } | null>(null);

  // Check session on mount
  useEffect(() => {
    fetch("/api/admin/auth")
      .then((r) => { setAuthed(r.ok); })
      .catch(() => setAuthed(false));
  }, []);

  const loadRegistrations = useCallback(async () => {
    setLoadingRegs(true);
    try {
      const param = statusFilter === "all" ? "?status=all" : `?status=${statusFilter}`;
      const res = await fetch(`/api/admin/registrations${param}`);
      if (!res.ok) throw new Error("Failed to load");
      const json = await res.json();
      setRegistrations(json.registrations ?? []);
    } catch {
      setRegistrations([]);
    } finally {
      setLoadingRegs(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    if (authed && tab === "registrations") {
      loadRegistrations();
    }
  }, [authed, tab, loadRegistrations]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setAuthed(true);
        setPassword("");
      } else {
        const json = await res.json().catch(() => ({}));
        setLoginError(json.error ?? "Incorrect password.");
      }
    } catch {
      setLoginError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthed(false);
    setRegistrations([]);
  }

  async function handleCapture(orderId: string) {
    setActionLoading(orderId);
    setActionMsg(null);
    try {
      const res = await fetch("/api/admin/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Capture failed");
      setActionMsg({ orderId, msg: json.alreadyCaptured ? "Already captured." : "✅ Captured — payment collected." });
      await loadRegistrations();
    } catch (err) {
      setActionMsg({ orderId, msg: `❌ ${(err as Error).message}` });
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCancel(orderId: string) {
    if (!confirm(`DENY and cancel payment for ${orderId}? This cannot be undone.`)) return;
    setActionLoading(orderId);
    setActionMsg(null);
    try {
      const res = await fetch("/api/admin/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Cancel failed");
      setActionMsg({ orderId, msg: json.alreadyCancelled ? "Already cancelled." : "🚫 Denied — hold released." });
      await loadRegistrations();
    } catch (err) {
      setActionMsg({ orderId, msg: `❌ ${(err as Error).message}` });
    } finally {
      setActionLoading(null);
    }
  }

  // Loading auth check
  if (authed === null) {
    return (
      <div className="min-h-screen bg-ink-texture flex items-center justify-center">
        <p style={{ color: "rgba(245,237,216,0.4)", fontFamily: "var(--font-special-elite, monospace)", fontSize: "0.85rem" }}>
          Checking session…
        </p>
      </div>
    );
  }

  // Login screen
  if (!authed) {
    return (
      <div className="min-h-screen bg-ink-texture flex items-center justify-center px-4">
        <div className="bg-cream/90 border-2 border-gold/40 p-8 w-full max-w-sm text-center card-vintage">
          <p
            className="text-crimson text-xs tracking-[0.3em] uppercase mb-4"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            ★ Admin Access ★
          </p>
          <h1
            className="text-ink text-2xl mb-6"
            style={{ fontFamily: "var(--font-rye, serif)" }}
          >
            West TN Tattoo and Art Festival<br />Admin Panel
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              className="w-full border border-ink/20 bg-white/80 px-4 py-3 text-ink text-sm text-center tracking-[0.3em] focus:outline-none focus:border-gold/60"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            />
            {loginError && (
              <p className="text-crimson text-xs" style={{ fontFamily: "var(--font-garamond, serif)" }}>
                {loginError}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting || !password}
              className="w-full py-3 bg-crimson text-cream uppercase tracking-widest text-sm hover:bg-crimson-dark transition-all disabled:opacity-50"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              {submitting ? "Checking…" : "Access Admin Panel"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated admin panel
  return (
    <div className="bg-parchment-light-texture min-h-screen">
      {/* Header */}
      <div className="bg-ink-texture py-8 px-4 relative">
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-gold/60 text-[10px] uppercase tracking-[0.3em] mb-1" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
              Admin Panel
            </p>
            <h1 className="text-cream text-2xl" style={{ fontFamily: "var(--font-rye, serif)" }}>
              West TN Tattoo and Art Festival 2027
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-cream/40 text-xs uppercase tracking-wider hover:text-cream/70 transition-colors"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto mt-6 flex gap-2">
          {(["registrations", "capacity", "links"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors ${
                tab === t
                  ? "bg-gold text-ink"
                  : "text-cream/50 hover:text-cream/80 border border-cream/20 hover:border-cream/40"
              }`}
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              {t === "registrations" ? "Registrations" : t === "capacity" ? "Capacity & Pricing" : "Quick Links"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ── REGISTRATIONS TAB ── */}
        {tab === "registrations" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex gap-2">
                {["pending_review", "captured", "cancelled", "all"].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s); setActionMsg(null); }}
                    className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-colors ${
                      statusFilter === s
                        ? "bg-ink text-cream"
                        : "border border-ink/20 text-ink/60 hover:border-ink/40"
                    }`}
                    style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                  >
                    {s === "pending_review" ? "Pending Review" :
                     s === "captured" ? "Approved" :
                     s === "cancelled" ? "Denied" : "All"}
                  </button>
                ))}
              </div>
              <button
                onClick={loadRegistrations}
                disabled={loadingRegs}
                className="text-xs text-ink/50 hover:text-ink/80 uppercase tracking-wider border border-ink/15 px-3 py-1.5 transition-colors disabled:opacity-40"
                style={{ fontFamily: "var(--font-special-elite, monospace)" }}
              >
                {loadingRegs ? "Loading…" : "↺ Refresh"}
              </button>
            </div>

            {loadingRegs ? (
              <p className="text-ink/40 text-sm text-center py-8" style={{ fontFamily: "var(--font-garamond, serif)" }}>
                Loading registrations…
              </p>
            ) : registrations.length === 0 ? (
              <div className="border border-ink/10 bg-cream/50 p-8 text-center">
                <p className="text-ink/50 text-sm" style={{ fontFamily: "var(--font-garamond, serif)" }}>
                  No registrations with status &quot;{statusFilter}&quot;.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {registrations.map((reg) => {
                  const dollars = reg.amount_cents ? `$${(reg.amount_cents / 100).toFixed(2)}` : "—";
                  const date = new Date(reg.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                  const isPending = reg.status === "pending_review";
                  const myActionMsg = actionMsg?.orderId === reg.order_id ? actionMsg.msg : null;

                  return (
                    <div key={reg.order_id} className={`border p-5 ${isPending ? "border-gold/50 bg-gold/5" : "border-ink/12 bg-cream/50"}`}>
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-ink font-medium" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
                              {reg.first_name} {reg.last_name}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 uppercase tracking-wider ${
                              reg.status === "pending_review" ? "bg-gold/20 text-amber-700" :
                              reg.status === "captured"       ? "bg-green-100 text-green-700" :
                              reg.status === "cancelled"      ? "bg-red-100 text-red-700" :
                              "bg-ink/10 text-ink/60"
                            }`} style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
                              {reg.status === "pending_review" ? "Pending" :
                               reg.status === "captured"       ? "Approved" :
                               reg.status === "cancelled"      ? "Denied" : reg.status}
                            </span>
                          </div>
                          <p className="text-ink/60 text-sm" style={{ fontFamily: "var(--font-garamond, serif)" }}>
                            {reg.email} · {reg.registration_type} · {dollars} · {date}
                          </p>
                          <p className="text-ink/35 text-xs mt-1" style={{ fontFamily: "var(--font-garamond, serif)" }}>
                            Ref: {reg.order_id}
                            {reg.stripe_payment_intent_id && ` · PI: ${reg.stripe_payment_intent_id}`}
                          </p>
                          {myActionMsg && (
                            <p className="text-sm mt-2" style={{ fontFamily: "var(--font-garamond, serif)", color: myActionMsg.startsWith("❌") ? "#dc2626" : "#16a34a" }}>
                              {myActionMsg}
                            </p>
                          )}
                        </div>

                        {isPending && (
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleCapture(reg.order_id)}
                              disabled={actionLoading === reg.order_id}
                              className="px-4 py-2 bg-green-600 text-white text-xs uppercase tracking-wider hover:bg-green-700 transition-colors disabled:opacity-50"
                              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                            >
                              {actionLoading === reg.order_id ? "…" : "✓ Approve"}
                            </button>
                            <button
                              onClick={() => handleCancel(reg.order_id)}
                              disabled={actionLoading === reg.order_id}
                              className="px-4 py-2 bg-crimson text-cream text-xs uppercase tracking-wider hover:bg-crimson-dark transition-colors disabled:opacity-50"
                              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                            >
                              {actionLoading === reg.order_id ? "…" : "✗ Deny"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="text-ink/35 text-xs italic" style={{ fontFamily: "var(--font-garamond, serif)" }}>
              Approving captures the authorized hold. Denying releases it. TYPE 2 entries (car show, competition) are charged immediately and will not appear here as pending.
            </p>
          </div>
        )}

        {/* ── CAPACITY TAB ── */}
        {tab === "capacity" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-ink text-xl mb-4" style={{ fontFamily: "var(--font-rye, serif)" }}>
                Capacity Reference
              </h2>
              <div className="border border-ink/15 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-ink/8">
                      <th className="text-left px-4 py-3 text-ink/60 text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>Category</th>
                      <th className="text-center px-4 py-3 text-ink/60 text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>Total Spaces</th>
                      <th className="text-right px-4 py-3 text-ink/60 text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CAPACITY_ROWS.map((row, i) => (
                      <tr key={row.category} className={`border-t border-ink/8 ${i % 2 === 0 ? "bg-cream/40" : "bg-cream/70"}`}>
                        <td className="px-4 py-3 text-ink/80" style={{ fontFamily: "var(--font-garamond, serif)" }}>{row.category}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-gold font-bold text-lg" style={{ fontFamily: "var(--font-rye, serif)" }}>
                            {row.total}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-ink/60 text-xs" style={{ fontFamily: "var(--font-garamond, serif)" }}>{row.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-ink text-xl mb-4" style={{ fontFamily: "var(--font-rye, serif)" }}>
                General Admission Pricing
              </h2>
              <div className="border border-ink/15 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-ink/8">
                      <th className="text-left px-4 py-3 text-ink/60 text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>Ticket</th>
                      <th className="text-right px-4 py-3 text-ink/60 text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ADMISSION_ROWS.map((row, i) => (
                      <tr key={row.label} className={`border-t border-ink/8 ${i % 2 === 0 ? "bg-cream/40" : "bg-cream/70"}`}>
                        <td className="px-4 py-3 text-ink/80" style={{ fontFamily: "var(--font-garamond, serif)" }}>{row.label}</td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-crimson font-bold" style={{ fontFamily: "var(--font-rye, serif)" }}>
                            {row.price}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── QUICK LINKS TAB ── */}
        {tab === "links" && (
          <div className="space-y-6">
            <h2 className="text-ink text-xl mb-4" style={{ fontFamily: "var(--font-rye, serif)" }}>
              Quick Links
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Artist Applications",  href: "/artists" },
                { label: "Vendor Applications",  href: "/vendors#apply-vendor" },
                { label: "Food Truck Apps",       href: "/vendors#apply-food-truck" },
                { label: "Car Show",              href: "/car-show#register" },
                { label: "Competitions",          href: "/competitions" },
                { label: "Sponsor Info",          href: "/sponsors" },
                { label: "Tickets Page",          href: "/tickets" },
                { label: "Event Info",            href: "/event-info" },
                { label: "Contact",               href: "/contact" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block border border-ink/15 bg-cream/60 px-4 py-3 text-ink/70 text-xs uppercase tracking-wider hover:bg-cream hover:text-ink hover:border-gold/40 transition-all text-center"
                  style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="border border-ink/12 bg-cream/50 p-6">
              <h2 className="text-ink text-xl mb-4" style={{ fontFamily: "var(--font-rye, serif)" }}>
                System Status
              </h2>
              <div className="space-y-3">
                {[
                  { name: "Registration Forms",        status: "live",    note: "Artists, Vendors, Food Trucks, Car Show — forms live" },
                  { name: "Email (Resend)",             status: "live",    note: "Notifications to studio45tattoo2025@gmail.com + applicant" },
                  { name: "Stripe (Test Mode)",         status: "live",    note: "Auth-holds (TYPE 1) + immediate charge (TYPE 2) wired" },
                  { name: "Admin Approve/Deny",         status: "live",    note: "This panel — capture or cancel holds from Registrations tab" },
                  { name: "Stripe Webhook",             status: "pending", note: "Register endpoint in Stripe dashboard + add STRIPE_WEBHOOK_SECRET" },
                  { name: "Live Stripe Credentials",    status: "pending", note: "Set STRIPE_SECRET_KEY + STRIPE_PUBLISHABLE_KEY to live keys after verification" },
                  { name: "VIP Weekend Ticket",         status: "hold",    note: "Pricing unconfirmed — do not publish until confirmed by organizers" },
                ].map((item) => (
                  <div key={item.name} className="flex items-start gap-3">
                    <span
                      className={`flex-shrink-0 w-2 h-2 rounded-full mt-1.5 ${
                        item.status === "live"    ? "bg-green-500" :
                        item.status === "pending" ? "bg-yellow-500" :
                        "bg-red-500"
                      }`}
                    />
                    <div>
                      <p className="text-ink/80 text-sm font-medium" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
                        {item.name}
                        <span className={`ml-2 text-[10px] px-1.5 py-0.5 uppercase tracking-wider ${
                          item.status === "live"    ? "bg-green-100 text-green-700" :
                          item.status === "pending" ? "bg-yellow-50 text-yellow-700" :
                          "bg-red-50 text-red-700"
                        }`}>
                          {item.status === "live" ? "Live" : item.status === "pending" ? "Pending Setup" : "On Hold"}
                        </span>
                      </p>
                      <p className="text-ink/45 text-xs mt-0.5" style={{ fontFamily: "var(--font-garamond, serif)" }}>
                        {item.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
