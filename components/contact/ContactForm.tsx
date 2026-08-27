"use client";

import { useState, useRef } from "react";

const REASONS = [
  "General Inquiry",
  "Artist Application",
  "Vendor Information",
  "Sponsorship Information",
  "Food Truck Inquiry",
  "Press / Media",
  "Other",
];

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = (await res.json()) as { success?: boolean; error?: string };

      if (res.ok && json.success) {
        setStatus("success");
        formRef.current?.reset();
      } else {
        setStatus("error");
        setErrorMsg(json.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error — please check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-cream/60 border border-ink/12 p-6 sm:p-8 text-center">
        <p className="text-3xl mb-3">★</p>
        <p
          className="text-ink text-xl mb-3"
          style={{ fontFamily: "var(--font-rye, serif)" }}
        >
          Message Sent
        </p>
        <div className="divider-ink mx-auto mb-4" style={{ width: "60px" }} />
        <p
          className="text-ink/65 text-base leading-relaxed mb-6"
          style={{ fontFamily: "var(--font-garamond, serif)" }}
        >
          Thank you for reaching out. We&rsquo;ll be in touch soon. If you need
          a quick answer, give us a call at{" "}
          <a
            href="tel:731-513-4271"
            className="text-crimson hover:underline"
          >
            731-513-4271
          </a>
          .
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-ink/50 text-sm underline hover:text-ink transition-colors"
          style={{ fontFamily: "var(--font-garamond, serif)" }}
        >
          Send another message
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full bg-cream border border-ink/20 px-4 py-3 text-ink text-base focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition-colors placeholder:text-ink/35";
  const labelClass =
    "block text-ink/70 text-xs tracking-[0.18em] uppercase mb-1.5";

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      {/* ── Honeypot — hidden from humans, bots fill it ── */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
      />

      <div className="space-y-5">
        {/* Reason */}
        <div>
          <label
            htmlFor="contact-reason"
            className={labelClass}
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            Reason for Contact <span className="text-crimson">*</span>
          </label>
          <select
            id="contact-reason"
            name="reason"
            required
            className={inputClass}
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          >
            <option value="">Select a reason…</option>
            {REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div>
          <label
            htmlFor="contact-name"
            className={labelClass}
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            Full Name <span className="text-crimson">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
            className={inputClass}
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="contact-email"
            className={labelClass}
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            Email Address <span className="text-crimson">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="your@email.com"
            className={inputClass}
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          />
        </div>

        {/* Phone (optional) */}
        <div>
          <label
            htmlFor="contact-phone"
            className={labelClass}
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            Phone Number{" "}
            <span className="text-ink/40 normal-case tracking-normal text-[11px]">
              (optional)
            </span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="(555) 555-5555"
            className={inputClass}
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          />
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="contact-message"
            className={labelClass}
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            Message <span className="text-crimson">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            placeholder="Tell us how we can help…"
            className={`${inputClass} resize-y min-h-[120px]`}
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          />
        </div>

        {/* Error message */}
        {status === "error" && (
          <p
            role="alert"
            className="text-crimson text-sm leading-relaxed border border-crimson/30 bg-crimson/5 px-4 py-3"
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          >
            {errorMsg}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full py-4 bg-crimson text-cream uppercase tracking-widest text-sm hover:bg-crimson-dark transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
          style={{ fontFamily: "var(--font-special-elite, monospace)" }}
        >
          {status === "sending" ? "Sending…" : "Send Message"}
        </button>

        <p
          className="text-ink/35 text-xs italic text-center"
          style={{ fontFamily: "var(--font-garamond, serif)" }}
        >
          We typically respond within 1–2 business days.
        </p>
      </div>
    </form>
  );
}
