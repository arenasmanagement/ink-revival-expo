"use client";

import { useState, FormEvent } from "react";

const VEHICLE_CLASSES = [
  "Custom Build",
  "Classic (Pre-1980)",
  "Muscle Car",
  "Truck / SUV",
  "Motorcycle",
  "Show Car",
  "Other",
];

type FormState = "idle" | "submitting" | "success" | "error";

export default function CarShowRegistrationForm() {
  const [state, setState] = useState<FormState>("idle");
  const [orderId, setOrderId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    year: "",
    make: "",
    model: "",
    vehicleClass: "",
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
        body: JSON.stringify({ type: "car-show", ...form }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error ?? "Something went wrong. Please try again or use our contact form at westtninkrevival.com/contact.");
        setState("error");
        return;
      }

      setOrderId(data.orderId);
      setState("success");
    } catch {
      setErrorMsg("Network error — please check your connection and try again.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="max-w-xl mx-auto border-2 border-gold/40 bg-cream/80 p-8 text-center card-vintage">
        <p className="text-3xl mb-4">🏆</p>
        <h3
          className="text-ink text-2xl mb-2"
          style={{ fontFamily: "var(--font-rye, serif)" }}
        >
          Registration Received!
        </h3>
        <p
          className="text-ink/60 text-base mb-5 leading-relaxed"
          style={{ fontFamily: "var(--font-garamond, serif)" }}
        >
          Your car show entry is in. You&rsquo;ll receive a confirmation email shortly.
          Your reference ID is below — keep it handy.
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
          Questions? Use our contact form at westtninkrevival.com/contact.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="border border-ink/12 bg-cream/70 p-6 sm:p-8 card-vintage">
        <p
          className="text-crimson text-[10px] tracking-[0.3em] uppercase mb-4"
          style={{ fontFamily: "var(--font-special-elite, monospace)" }}
        >
          ★ Car Show Entry — No Entry Fee Currently ★
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

          {/* Contact */}
          <div>
            <label className="block text-ink/60 text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
              Email Address *
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className="w-full border border-ink/20 bg-white/70 px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-gold/60 transition-colors"
              style={{ fontFamily: "var(--font-garamond, serif)" }}
            />
          </div>

          <div>
            <label className="block text-ink/60 text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className="w-full border border-ink/20 bg-white/70 px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-gold/60 transition-colors"
              style={{ fontFamily: "var(--font-garamond, serif)" }}
            />
          </div>

          {/* Vehicle info */}
          <div
            className="border-t border-ink/10 pt-5"
          >
            <p
              className="text-ink/50 text-[10px] tracking-[0.25em] uppercase mb-4"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              Vehicle Information
            </p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-ink/60 text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
                  Year *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1967"
                  value={form.year}
                  onChange={(e) => set("year", e.target.value)}
                  className="w-full border border-ink/20 bg-white/70 px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-gold/60"
                  style={{ fontFamily: "var(--font-garamond, serif)" }}
                />
              </div>
              <div>
                <label className="block text-ink/60 text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
                  Make *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chevrolet"
                  value={form.make}
                  onChange={(e) => set("make", e.target.value)}
                  className="w-full border border-ink/20 bg-white/70 px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-gold/60"
                  style={{ fontFamily: "var(--font-garamond, serif)" }}
                />
              </div>
              <div>
                <label className="block text-ink/60 text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
                  Model *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Camaro"
                  value={form.model}
                  onChange={(e) => set("model", e.target.value)}
                  className="w-full border border-ink/20 bg-white/70 px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-gold/60"
                  style={{ fontFamily: "var(--font-garamond, serif)" }}
                />
              </div>
            </div>

            <div>
              <label className="block text-ink/60 text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
                Vehicle Class
              </label>
              <select
                value={form.vehicleClass}
                onChange={(e) => set("vehicleClass", e.target.value)}
                className="w-full border border-ink/20 bg-white/70 px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-gold/60"
                style={{ fontFamily: "var(--font-garamond, serif)" }}
              >
                <option value="">Select a class (optional)</option>
                {VEHICLE_CLASSES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-ink/60 text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
              Additional Notes
            </label>
            <textarea
              rows={3}
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              placeholder="Any info about your vehicle, special accommodations, or questions..."
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
            className="w-full py-3.5 bg-gold text-ink uppercase tracking-widest text-sm hover:bg-gold-light transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            {state === "submitting" ? "Submitting…" : "Submit Car Show Entry"}
          </button>

          <p
            className="text-ink/40 text-xs text-center italic"
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          >
            Spaces are limited to {75} vehicles. Entry confirmation will be sent to your email.
          </p>
        </form>
      </div>
    </div>
  );
}
