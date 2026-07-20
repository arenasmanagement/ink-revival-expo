"use client";

import { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { EVENT, REGISTRATION_URLS } from "@/lib/eventData";

const { sponsorRegistrationUrl, vendorRegistrationUrl } = REGISTRATION_URLS;

const REASONS = [
  "General Question",
  "Tattoo Artist Application",
  "Vendor Booth",
  "Food Truck",
  "Sponsorship",
  "Media",
  "Other",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="bg-parchment-light-texture min-h-screen">
      {/* Header */}
      <div className="bg-ink-texture py-16 px-4 relative">
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
        <SectionHeading eyebrow="Reach Out" title="Contact Us" subtitle="Get in touch with the West TN Ink Revival Expo team." light className="max-w-4xl mx-auto" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">

          {/* Contact info */}
          <div>
            <h2 className="text-ink text-2xl mb-6" style={{ fontFamily: "var(--font-rye, serif)" }}>
              Get in Touch
            </h2>
            <div className="divider-ink mb-6" style={{ width: "80px" }} />

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="text-crimson text-xl flex-shrink-0">★</span>
                <div>
                  <p className="text-ink font-semibold text-sm uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>Phone</p>
                  <a href={`tel:${EVENT.contact.phone}`} className="text-ink/70 text-lg hover:text-crimson transition-colors" style={{ fontFamily: "var(--font-garamond, serif)" }}>
                    {EVENT.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-crimson text-xl flex-shrink-0">★</span>
                <div>
                  <p className="text-ink font-semibold text-sm uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>Producer</p>
                  <p className="text-ink/70 text-lg" style={{ fontFamily: "var(--font-garamond, serif)" }}>{EVENT.producer}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-crimson text-xl flex-shrink-0">★</span>
                <div>
                  <p className="text-ink font-semibold text-sm uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>Event</p>
                  <p className="text-ink/70" style={{ fontFamily: "var(--font-garamond, serif)" }}>{EVENT.dates.display}</p>
                  <p className="text-ink/70" style={{ fontFamily: "var(--font-garamond, serif)" }}>{EVENT.venue.name}</p>
                  <p className="text-ink/70" style={{ fontFamily: "var(--font-garamond, serif)" }}>{EVENT.venue.city}, {EVENT.venue.state}</p>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="mt-8 border-t border-ink/10 pt-8">
              <p className="text-ink/50 text-xs tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>Quick Links</p>
              <div className="space-y-2">
                {[
                  { label: "Apply as a Tattoo Artist", href: "/artists#apply", external: false },
                  { label: "Reserve a Vendor Booth", href: vendorRegistrationUrl, external: true },
                  { label: "Food Truck Application", href: "/vendors#food-truck-form", external: false },
                  { label: "Register as a Sponsor", href: sponsorRegistrationUrl, external: true },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex items-center gap-2 text-ink/60 hover:text-crimson text-sm transition-colors"
                    style={{ fontFamily: "var(--font-garamond, serif)" }}
                  >
                    <span className="text-crimson text-xs">→</span> {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            {submitted ? (
              <div className="border-2 border-gold/40 bg-cream/60 p-8 text-center">
                <p className="text-4xl mb-4">★</p>
                <p className="text-ink text-2xl mb-2" style={{ fontFamily: "var(--font-rye, serif)" }}>Message Received!</p>
                <p className="text-ink/60" style={{ fontFamily: "var(--font-garamond, serif)" }}>
                  Thank you for reaching out. We&rsquo;ll be in touch soon.
                  <br /><br />
                  For urgent matters, call us at <a href="tel:731-513-4271" className="text-crimson">{EVENT.contact.phone}</a>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 bg-cream/60 border border-ink/12 p-6 sm:p-8">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-ink/60 text-xs tracking-wider uppercase mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
                      Name <span className="text-crimson">*</span>
                    </label>
                    <input id="name" name="name" type="text" required className="input-vintage" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-ink/60 text-xs tracking-wider uppercase mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
                      Email <span className="text-crimson">*</span>
                    </label>
                    <input id="email" name="email" type="email" required className="input-vintage" />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-ink/60 text-xs tracking-wider uppercase mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>Phone</label>
                  <input id="phone" name="phone" type="tel" className="input-vintage" />
                </div>
                <div>
                  <label htmlFor="reason" className="block text-ink/60 text-xs tracking-wider uppercase mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
                    Reason for Contact <span className="text-crimson">*</span>
                  </label>
                  <select id="reason" name="reason" required className="input-vintage w-full">
                    <option value="">Select a reason</option>
                    {REASONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-ink/60 text-xs tracking-wider uppercase mb-1.5" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
                    Message <span className="text-crimson">*</span>
                  </label>
                  <textarea id="message" name="message" rows={5} required className="input-vintage" placeholder="How can we help?" />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-crimson text-cream uppercase tracking-widest text-sm hover:bg-crimson-dark transition-all active:scale-95"
                  style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
