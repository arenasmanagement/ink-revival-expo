import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import FAQAccordion from "@/components/faq/FAQAccordion";

export const metadata: Metadata = {
  title: "FAQ | West TN Ink Revival Expo 2027",
  description:
    "Frequently asked questions about West TN Ink Revival Expo — dates, venue, artists, vendors, tickets, and how to participate.",
};

export default function FAQPage() {
  return (
    <div className="bg-parchment-light-texture min-h-screen">
      {/* Header */}
      <div className="bg-ink-texture py-16 px-4 relative">
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }}
        />
        <SectionHeading
          eyebrow="Answers"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about West TN Ink Revival Expo."
          light
          className="max-w-4xl mx-auto"
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
        <FAQAccordion />

        {/* Contact CTA */}
        <div className="mt-12 text-center border-2 border-gold/30 bg-cream/50 p-8">
          <p
            className="text-crimson text-xs tracking-[0.25em] uppercase mb-2"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            ★ Still Have Questions? ★
          </p>
          <p
            className="text-ink text-xl mb-2"
            style={{ fontFamily: "var(--font-rye, serif)" }}
          >
            We&rsquo;re Here to Help
          </p>
          <p
            className="text-ink/60 text-base mb-5"
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          >
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
