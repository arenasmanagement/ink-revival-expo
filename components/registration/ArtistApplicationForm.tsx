"use client";

import { useState, FormEvent } from "react";
import { TATTOO_SPECIALTIES } from "@/lib/eventData";

type FormState = "idle" | "submitting" | "success" | "error";

export default function ArtistApplicationForm() {
  const [state, setState] = useState<FormState>("idle");
  const [orderId, setOrderId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    websiteOrInstagram: "",
    tattoingYears: "",
    specialties: "",
    boothSize: "single" as "single" | "double",
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
        body: JSON.stringify({ type: "artist", ...form }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error ?? "Something went wrong. Please call 731-513-4271.");
        setState("error");
        return;
      }

      setOrderId(data.orderId);
      setState("success");
    } catch {
      setErrorMsg("Network error. Please call 731-513-4271.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="border-2 border-gold/40 bg-cream/80 p-8 text-center card-vintage">
        <p className="text-3xl mb-4">🎨</p>
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
          Your artist application is in. Our team will review it and contact you within
          3–5 business days. No payment is collected until your application is approved.
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
          Confirmation sent to your email. Questions? Call 731-513-4271.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-ink/12 bg-cream/70 p-6 sm:p-8 card-vintage" style={{ boxShadow: "0 4px 20px rgba(26,16,8,0.08)" }}>
      <p
        className="text-gold/70 text-xs tracking-[0.3em] uppercase mb-5"
        style={{ fontFamily: "var(--font-special-elite, monospace)" }}
      >
        ★ Artist Applications — 35 Booths Available ★
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-ink/60 text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
              First Name *
            </label>
            <input
              type="text"
              required
              value={form.firstName}
              onChange={(e) => set("firstName", e.target.value)}
              className="w-full border border-ink/20 bg-white/70 px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-gold/60 transition-colors"
              style={{ fontFamily: "var(--font-garamond, serif)" }}
            />
          </div>
          <div>
            <label className="block text-ink/60 text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
              Last Name *
            </label>
            <input
              type="text"
              required
              value={form.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              className="w-full border border-ink/20 bg-white/70 px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-gold/60 transition-colors"
              style={{ fontFamily: "var(--font-garamond, serif)" }}
            />
          </div>
        </div>

        {/* Studio / Business */}
        <div>
          <label className="block text-ink/60 text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
            Studio / Business Name
          </label>
          <input
            type="text"
            value={form.businessName}
            onChange={(e) => set("businessName", e.target.value)}
            placeholder="Studio name or your artist name"
            className="w-full border border-ink/20 bg-white/70 px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-gold/60"
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          />
        </div>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-ink/60 text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
              Email *
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className="w-full border border-ink/20 bg-white/70 px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-gold/60"
              style={{ fontFamily: "var(--font-garamond, serif)" }}
            />
          </div>
          <div>
            <label className="block text-ink/60 text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
              Phone *
            </label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className="w-full border border-ink/20 bg-white/70 px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-gold/60"
              style={{ fontFamily: "var(--font-garamond, serif)" }}
            />
          </div>
        </div>

        {/* Instagram/Portfolio */}
        <div>
          <label className="block text-ink/60 text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
            Portfolio / Instagram URL
          </label>
          <input
            type="text"
            value={form.websiteOrInstagram}
            onChange={(e) => set("websiteOrInstagram", e.target.value)}
            placeholder="instagram.com/yourhandle or your website"
            className="w-full border border-ink/20 bg-white/70 px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-gold/60"
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          />
        </div>

        {/* Style specialties */}
        <div>
          <label className="block text-ink/60 text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
            Tattoo Specialties
          </label>
          <select
            value={form.specialties}
            onChange={(e) => set("specialties", e.target.value)}
            className="w-full border border-ink/20 bg-white/70 px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-gold/60"
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          >
            <option value="">Select primary style</option>
            {TATTOO_SPECIALTIES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
            <option value="Multiple Styles">Multiple Styles</option>
          </select>
        </div>

        {/* Years tattooing */}
        <div>
          <label className="block text-ink/60 text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
            Years Tattooing
          </label>
          <select
            value={form.tattoingYears}
            onChange={(e) => set("tattoingYears", e.target.value)}
            className="w-full border border-ink/20 bg-white/70 px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-gold/60"
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          >
            <option value="">Select range</option>
            <option value="1-2 years">1–2 years</option>
            <option value="3-5 years">3–5 years</option>
            <option value="6-10 years">6–10 years</option>
            <option value="10+ years">10+ years</option>
          </select>
        </div>

        {/* Booth size */}
        <div>
          <label className="block text-ink/60 text-xs uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
            Preferred Booth Size
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "single", label: "10×10", sub: "Single space" },
              { value: "double", label: "10×20", sub: "Double space" },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`border-2 cursor-pointer p-3 text-center transition-colors ${
                  form.boothSize === opt.value
                    ? "border-gold bg-gold/10"
                    : "border-ink/15 bg-white/50 hover:border-gold/50"
                }`}
              >
                <input
                  type="radio"
                  name="boothSize"
                  value={opt.value}
                  checked={form.boothSize === opt.value}
                  onChange={(e) => set("boothSize", e.target.value)}
                  className="sr-only"
                />
                <p
                  className="text-ink text-base font-medium"
                  style={{ fontFamily: "var(--font-rye, serif)" }}
                >
                  {opt.label}
                </p>
                <p
                  className="text-ink/50 text-xs"
                  style={{ fontFamily: "var(--font-garamond, serif)" }}
                >
                  {opt.sub}
                </p>
              </label>
            ))}
          </div>
          <p
            className="text-ink/40 text-xs italic mt-2"
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          >
            Booth size is subject to availability and approval. No booth fee is collected upfront —
            permit fees apply per Tennessee health department requirements.
          </p>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-ink/60 text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
            Notes / Questions
          </label>
          <textarea
            rows={3}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="Tell us about your work, any special requirements, or questions..."
            className="w-full border border-ink/20 bg-white/70 px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-gold/60 resize-none"
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          />
        </div>

        {errorMsg && (
          <p className="text-crimson text-sm text-center" style={{ fontFamily: "var(--font-garamond, serif)" }}>
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={state === "submitting"}
          className="w-full py-4 bg-crimson text-cream uppercase tracking-widest text-sm hover:bg-crimson-dark transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ fontFamily: "var(--font-special-elite, monospace)" }}
        >
          {state === "submitting" ? "Submitting Application…" : "Submit Artist Application"}
        </button>

        <p
          className="text-ink/40 text-xs text-center italic"
          style={{ fontFamily: "var(--font-garamond, serif)" }}
        >
          Applications are reviewed by Studio 45 Tattoos. You will be contacted within 3–5 business
          days. No payment is collected until your application is approved.
        </p>
      </form>
    </div>
  );
}
