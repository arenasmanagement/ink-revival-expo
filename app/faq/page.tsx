"use client";

import { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { FAQ_ITEMS } from "@/lib/eventData";

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="bg-parchment-light-texture min-h-screen">
      {/* Header */}
      <div className="bg-ink-texture py-16 px-4 relative">
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
        <SectionHeading eyebrow="Answers" title="Frequently Asked Questions" subtitle="Everything you need to know about West TN Ink Revival Expo." light className="max-w-4xl mx-auto" />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
        <div className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="bg-cream/70 border border-ink/12 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left hover:bg-cream/90 transition-colors"
              >
                <span
                  className="text-ink text-base leading-snug flex-1"
                  style={{ fontFamily: "var(--font-playfair, serif)", fontWeight: 600 }}
                >
                  {item.q}
                </span>
                <span
                  className="flex-shrink-0 text-crimson text-lg leading-none mt-0.5 transition-transform duration-200"
                  style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  +
                </span>
              </button>

              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: open === i ? "300px" : "0" }}
              >
                <div className="px-6 pb-5 border-t border-ink/8 pt-4">
                  <p
                    className="text-ink/70 text-base leading-relaxed"
                    style={{ fontFamily: "var(--font-garamond, serif)" }}
                  >
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center border-2 border-gold/30 bg-cream/50 p-8">
          <p className="text-crimson text-xs tracking-[0.25em] uppercase mb-2" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>★ Still Have Questions? ★</p>
          <p className="text-ink text-xl mb-2" style={{ fontFamily: "var(--font-rye, serif)" }}>We&rsquo;re Here to Help</p>
          <p className="text-ink/60 text-base mb-5" style={{ fontFamily: "var(--font-garamond, serif)" }}>
            Reach out to Studio 45 Tattoos with any questions not answered above.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:731-513-4271"
              className="px-6 py-3 bg-crimson text-cream uppercase tracking-wider text-sm hover:bg-crimson-dark transition-all active:scale-95"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              Call 731-513-4271
            </a>
            <a
              href="/contact"
              className="px-6 py-3 border-2 border-ink text-ink uppercase tracking-wider text-sm hover:bg-ink hover:text-cream transition-all active:scale-95"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              Contact Form
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
