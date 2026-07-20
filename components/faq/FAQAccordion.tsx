"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "@/lib/eventData";

export default function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {FAQ_ITEMS.map((item, i) => (
        <div
          key={i}
          className="bg-cream/70 border border-ink/12 overflow-hidden"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
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
              aria-hidden="true"
            >
              +
            </span>
          </button>

          <div
            className="overflow-hidden transition-all duration-300"
            style={{ maxHeight: open === i ? "400px" : "0" }}
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
  );
}
