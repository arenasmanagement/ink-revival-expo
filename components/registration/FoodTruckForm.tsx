"use client";

import { useState } from "react";

const BODY: React.CSSProperties    = { fontFamily: "var(--font-body, system-ui, sans-serif)" };
const DISPLAY: React.CSSProperties = {
  fontFamily:  "var(--font-display, var(--font-bebas-neue), Impact, sans-serif)",
  letterSpacing: "0.04em",
};
const INPUT =
  "w-full px-4 py-3 bg-transparent border border-[rgba(245,237,216,0.2)] text-cream placeholder:text-[rgba(245,237,216,0.3)] focus:border-sunset focus:outline-none transition-colors";

export default function FoodTruckForm() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    truckName: "", cuisineType: "", menuDescription: "",
    city: "", state: "", licenseNumber: "",
    termsAgreed: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [orderId, setOrderId]       = useState("");
  const [error, setError]           = useState("");

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.truckName || !form.cuisineType) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!form.termsAgreed) {
      setError("Please agree to the participant terms.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "food-truck", ...form, estimatedTotal: 250 }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Submission failed");
      setOrderId(json.orderId ?? "");
      setSubmitted(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-16 px-4">
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚚</div>
        <h2 style={{ ...DISPLAY, fontSize: "3rem", color: "#E07830" }} className="mb-4">Application Received!</h2>
        <p style={{ ...BODY, color: "rgba(245,237,216,0.65)", maxWidth: "480px", margin: "0 auto 1rem" }}>
          Thanks, {form.firstName}! Your food truck application is under review.
          We&apos;ll reach out to <strong style={{ color: "#F5EDD8" }}>{form.email}</strong> within 5–7 days.
        </p>
        {orderId && <p style={{ ...BODY, fontSize: "0.85rem", color: "rgba(245,237,216,0.35)" }}>Reference: {orderId}</p>}
        <p style={{ ...BODY, fontSize: "0.85rem", color: "rgba(245,237,216,0.4)", marginTop: "1rem" }}>
          The $250 space fee is collected only after approval.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: "640px", margin: "0 auto", padding: "0 1rem" }} className="space-y-5">
      <h2 style={{ ...DISPLAY, fontSize: "2.5rem", color: "#F5EDD8" }}>Food Truck Application</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>First Name *</label>
          <input className={INPUT} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
        </div>
        <div>
          <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>Last Name *</label>
          <input className={INPUT} value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
        </div>
      </div>

      <div>
        <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>Truck / Business Name *</label>
        <input className={INPUT} value={form.truckName} onChange={(e) => set("truckName", e.target.value)} />
      </div>

      <div>
        <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>Email *</label>
        <input className={INPUT} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
      </div>

      <div>
        <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>Phone</label>
        <input className={INPUT} type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
      </div>

      <div>
        <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>Cuisine Type *</label>
        <input className={INPUT} value={form.cuisineType} onChange={(e) => set("cuisineType", e.target.value)} placeholder="BBQ, Mexican, Desserts, etc." />
      </div>

      <div>
        <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>Menu Description</label>
        <textarea className={INPUT} rows={3} value={form.menuDescription} onChange={(e) => set("menuDescription", e.target.value)} placeholder="Tell us about your menu items, specialties, price range..." style={{ resize: "vertical" }} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>City</label>
          <input className={INPUT} value={form.city} onChange={(e) => set("city", e.target.value)} />
        </div>
        <div>
          <label style={{ ...BODY, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,237,216,0.45)", display: "block", marginBottom: "6px" }}>State</label>
          <input className={INPUT} value={form.state} onChange={(e) => set("state", e.target.value)} maxLength={2} />
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(245,237,216,0.1)", paddingTop: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <span style={{ ...BODY, color: "rgba(245,237,216,0.5)" }}>Space fee (due after approval)</span>
          <span style={{ ...DISPLAY, fontSize: "2rem", color: "#E07830" }}>$250</span>
        </div>

        <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
          <input type="checkbox" checked={form.termsAgreed} onChange={(e) => set("termsAgreed", e.target.checked)} style={{ width: "18px", height: "18px", marginTop: "2px", accentColor: "#E07830", flexShrink: 0 }} />
          <span style={{ ...BODY, fontSize: "0.85rem", color: "rgba(245,237,216,0.6)" }}>
            I agree to the West TN Tattoo &amp; Art Festival food truck terms and policies. *
          </span>
        </label>
      </div>

      {error && <p style={{ ...BODY, color: "#E03A3A", fontSize: "0.85rem" }}>{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        style={{ width: "100%", backgroundColor: "#E07830", color: "#0E0804", fontFamily: "var(--font-display, Impact, sans-serif)", fontSize: "1.2rem", letterSpacing: "0.08em", padding: "0.9rem", border: "none", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}
      >
        {submitting ? "Submitting…" : "Submit Application"}
      </button>
    </form>
  );
}
