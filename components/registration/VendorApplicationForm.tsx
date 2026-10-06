"use client";

import { useState, FormEvent } from "react";
import PaymentForm from "@/components/payment/PaymentForm";

type FormState = "idle" | "submitting" | "success" | "error";

const VENDOR_BOOTH_OPTIONS = [
  { value: "single", label: "10×10 Standard Booth — $150" },
  { value: "double", label: "Double Booth (10×20) — $300" },
];

const VENDOR_CATEGORIES = [
  "Apparel & Clothing",
  "Artwork & Prints",
  "Jewelry & Accessories",
  "Handmade & Crafts",
  "Collectibles",
  "Tattoo-Related Merchandise",
  "Lifestyle Brands",
  "Local Business",
  "Other",
];

export default function VendorApplicationForm() {
  const [state, setState] = useState<FormState>("idle");
  const [orderId, setOrderId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [amountCents, setAmountCents] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    email: "",
    phone: "",
    boothSize: "single",
    category: "",
    website: "",
    message: "",
  });

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "vendor", ...form }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error ?? "Something went wrong. Please try again or use our contact form at westtninkrevival.com/contact.");
        setState("error");
        return;
      }

      setOrderId(data.orderId);
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setAmountCents(data.amountCents ?? 0);
        return;
      }
      setState("success");
    } catch {
      setErrorMsg("Network error — please check your connection and try again.");
      setState("error");
    }
  }

  // Payment step
  if (clientSecret && state !== "success") {
    const BODY: React.CSSProperties = { fontFamily: "var(--font-garamond, serif)" };
    return (
      <div className="border border-ink/12 bg-cream/70 p-6 sm:p-8 card-vintage">
        <p
          className="text-crimson text-[10px] tracking-[0.3em] uppercase mb-4"
          style={{ fontFamily: "var(--font-special-elite, monospace)" }}
        >
          ★ Authorize Booth Fee ★
        </p>
        <p style={{ ...BODY, color: "rgba(14,8,4,0.55)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
          Reference: <strong>{orderId}</strong>
        </p>
        <p style={{ ...BODY, color: "rgba(14,8,4,0.45)", fontSize: "0.8rem", marginBottom: "1.5rem" }}>
          A hold will be placed on your card. No charge until your application is approved.
        </p>
        <PaymentForm
          clientSecret={clientSecret}
          orderId={orderId}
          amountCents={amountCents}
          paymentType="auth"
          onSuccess={() => setState("success")}
          onError={(msg) => setErrorMsg(msg)}
        />
        {errorMsg && (
          <p className="text-crimson text-sm text-center mt-3" style={{ fontFamily: "var(--font-garamond, serif)" }}>
            {errorMsg}
          </p>
        )}
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="border-2 border-gold/40 bg-cream/80 p-8 text-center card-vintage">
        <p className="text-3xl mb-4">🏪</p>
        <h3
          className="text-ink text-2xl mb-2"
          style={{ fontFamily: "var(--font-rye, serif)" }}
        >
          Application Received!
        </h3>
        <p
          className="text-ink/60 text-base mb-5 leading-relaxed"
          style={{ fontFamily: "var(--font-garamond, serif)" }}
        >
          Your vendor application is in. The festival team will review and contact you within
          3–5 business days. Only 35 vendor booths available.
        </p>
        <div className="bg-white border border-gold/40 py-3 px-6 inline-block mb-5">
          <p
            className="text-[10px] uppercase tracking-widest text-ink/40 mb-1"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            Reference ID
          </p>
          <p
            className="text-2xl text-ink font-bold tracking-wide"
            style={{ fontFamily: "var(--font-rye, serif)" }}
          >
            {orderId}
          </p>
        </div>
        <p
          className="text-ink/45 text-sm italic"
          style={{ fontFamily: "var(--font-garamond, serif)" }}
        >
          Confirmation sent to your email. Questions? Use our contact form at westtninkrevival.com/contact.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-ink/12 bg-cream/70 p-6 sm:p-8 card-vintage">
      <p
        className="text-crimson text-[10px] tracking-[0.3em] uppercase mb-5"
        style={{ fontFamily: "var(--font-special-elite, monospace)" }}
      >
        ★ Vendor Application — Only 35 Booths Available ★
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-ink/60 text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
              First Name *
            </label>
            <input type="text" required value={form.firstName} onChange={(e) => set("firstName", e.target.value)}
              className="w-full border border-ink/20 bg-white/70 px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-gold/60"
              style={{ fontFamily: "var(--font-garamond, serif)" }} />
          </div>
          <div>
            <label className="block text-ink/60 text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
              Last Name *
            </label>
            <input type="text" required value={form.lastName} onChange={(e) => set("lastName", e.target.value)}
              className="w-full border border-ink/20 bg-white/70 px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-gold/60"
              style={{ fontFamily: "var(--font-garamond, serif)" }} />
          </div>
        </div>

        <div>
          <label className="block text-ink/60 text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
            Business Name *
          </label>
          <input type="text" required value={form.businessName} onChange={(e) => set("businessName", e.target.value)}
            placeholder="Your business or vendor name"
            className="w-full border border-ink/20 bg-white/70 px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-gold/60"
            style={{ fontFamily: "var(--font-garamond, serif)" }} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-ink/60 text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
              Email *
            </label>
            <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)}
              className="w-full border border-ink/20 bg-white/70 px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-gold/60"
              style={{ fontFamily: "var(--font-garamond, serif)" }} />
          </div>
          <div>
            <label className="block text-ink/60 text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
              Phone *
            </label>
            <input type="tel" required value={form.phone} onChange={(e) => set("phone", e.target.value)}
              className="w-full border border-ink/20 bg-white/70 px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-gold/60"
              style={{ fontFamily: "var(--font-garamond, serif)" }} />
          </div>
        </div>

        {/* Booth Size */}
        <div>
          <p className="text-ink/60 text-xs uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
            Booth Size *
          </p>
          <div className="space-y-2">
            {VENDOR_BOOTH_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="boothSize"
                  value={opt.value}
                  checked={form.boothSize === opt.value}
                  onChange={() => set("boothSize", opt.value)}
                  className="accent-crimson"
                />
                <span
                  className="text-ink/75 text-sm group-hover:text-ink transition-colors"
                  style={{ fontFamily: "var(--font-garamond, serif)" }}
                >
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-ink/60 text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
            What Do You Sell?
          </label>
          <select value={form.category} onChange={(e) => set("category", e.target.value)}
            className="w-full border border-ink/20 bg-white/70 px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-gold/60"
            style={{ fontFamily: "var(--font-garamond, serif)" }}>
            <option value="">Select a category</option>
            {VENDOR_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-ink/60 text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
            Website or Social Media
          </label>
          <input type="text" value={form.website} onChange={(e) => set("website", e.target.value)}
            placeholder="https:// or @handle"
            className="w-full border border-ink/20 bg-white/70 px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-gold/60"
            style={{ fontFamily: "var(--font-garamond, serif)" }} />
        </div>

        <div>
          <label className="block text-ink/60 text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
            Notes / Questions
          </label>
          <textarea rows={3} value={form.message} onChange={(e) => set("message", e.target.value)}
            placeholder="Tell us about your products, any special requirements, or questions..."
            className="w-full border border-ink/20 bg-white/70 px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-gold/60 resize-none"
            style={{ fontFamily: "var(--font-garamond, serif)" }} />
        </div>

        {errorMsg && (
          <p className="text-crimson text-sm text-center" style={{ fontFamily: "var(--font-garamond, serif)" }}>
            {errorMsg}
          </p>
        )}

        <button type="submit" disabled={state === "submitting"}
          className="w-full py-3.5 bg-gold text-ink uppercase tracking-widest text-sm hover:bg-gold-light transition-all active:scale-95 disabled:opacity-60"
          style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
          {state === "submitting" ? "Submitting…" : "Submit Vendor Application"}
        </button>

        <p className="text-ink/40 text-xs text-center italic" style={{ fontFamily: "var(--font-garamond, serif)" }}>
          No payment collected until your application is approved. Only 35 vendor booths available.
        </p>
      </form>
    </div>
  );
}
