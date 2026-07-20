"use client";

import { useState } from "react";
import { ScrollworkDivider } from "@/components/ui/OrnamentalDivider";

export default function EmailSignup() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ firstName: "", email: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to email service
    setSubmitted(true);
  }

  return (
    <section className="bg-parchment-texture pt-6 sm:pt-8 pb-14 sm:pb-20 px-4 relative overflow-hidden">
      {/* Background stars decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
        {["15% 20%", "85% 15%", "10% 80%", "90% 75%", "50% 10%"].map((pos) => (
          <span
            key={pos}
            className="absolute text-5xl"
            style={{ top: pos.split(" ")[1], left: pos.split(" ")[0] }}
          >
            ★
          </span>
        ))}
      </div>

      <div className="max-w-xl mx-auto text-center relative z-10">
        <ScrollworkDivider className="mb-10 sm:mb-12" />
        {/* Eyebrow */}
        <p
          className="text-crimson text-xs tracking-[0.3em] uppercase mb-3"
          style={{ fontFamily: "var(--font-special-elite, monospace)" }}
        >
          ★ Don&rsquo;t Miss a Thing ★
        </p>

        <h2
          className="text-ink text-3xl sm:text-4xl mb-3"
          style={{ fontFamily: "var(--font-rye, serif)" }}
        >
          Stay Updated
        </h2>

        <div className="divider-ink mx-auto mb-5" style={{ width: "80px" }} />

        <p
          className="text-ink/70 text-lg mb-8 leading-relaxed"
          style={{ fontFamily: "var(--font-garamond, serif)" }}
        >
          Get artist announcements, ticket updates, schedules, contests, and convention news
          delivered to your inbox.
        </p>

        {submitted ? (
          <div
            className="border-2 border-gold/40 bg-cream/60 py-8 px-6"
          >
            <p className="text-3xl mb-3">★</p>
            <p
              className="text-ink text-xl mb-1"
              style={{ fontFamily: "var(--font-rye, serif)" }}
            >
              You&rsquo;re on the list!
            </p>
            <p
              className="text-ink/60 text-sm"
              style={{ fontFamily: "var(--font-garamond, serif)" }}
            >
              Welcome to the West TN Ink Revival family. We&rsquo;ll be in touch soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-ink/60 text-xs tracking-wider uppercase mb-1.5 text-left"
                  style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  placeholder="Your first name"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="input-vintage block w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-ink/60 text-xs tracking-wider uppercase mb-1.5 text-left"
                  style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-vintage block w-full"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-crimson text-cream uppercase tracking-widest text-sm hover:bg-crimson-dark transition-all duration-200 active:scale-95 mt-2"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              ★ Join the Revival ★
            </button>
            <p
              className="text-ink/35 text-xs"
              style={{ fontFamily: "var(--font-garamond, serif)", fontStyle: "italic" }}
            >
              No spam. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
