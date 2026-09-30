import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { EVENT } from "@/lib/eventData";

export const metadata: Metadata = {
  title: "Tattoo & Car Show Competitions | West TN Tattoo and Art Festival 2027",
  description:
    "Tattoo competitions and car show awards at West TN Tattoo and Art Festival 2027. Best of show, style categories, car awards. March 12–14, 2027 at Carroll County TN Fairgrounds, Huntingdon, Tennessee.",
  alternates: { canonical: "https://www.westtninkrevival.com/competitions" },
  openGraph: {
    title: "Competitions — West TN Tattoo and Art Festival 2027 | Huntingdon, Tennessee",
    description:
      "Tattoo contests and car show awards. Best tattoo by style, people's choice, best of show. March 12–14, 2027 at Carroll County TN Fairgrounds.",
    url: "https://www.westtninkrevival.com/competitions",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.westtninkrevival.com" },
    { "@type": "ListItem", position: 2, name: "Competitions", item: "https://www.westtninkrevival.com/competitions" },
  ],
};

const TATTOO_CATEGORIES = [
  { label: "Best American Traditional", icon: "🦅" },
  { label: "Best Black & Gray", icon: "◼" },
  { label: "Best Color", icon: "🎨" },
  { label: "Best Realism", icon: "👁️" },
  { label: "Best Neo-Traditional", icon: "🌹" },
  { label: "Best Japanese / Oriental", icon: "🐉" },
  { label: "Best Fine Line", icon: "✒️" },
  { label: "Best Small Tattoo", icon: "✨" },
  { label: "Best Large Tattoo", icon: "🏆" },
  { label: "Best of Show", icon: "⭐" },
  { label: "People's Choice", icon: "👥" },
  { label: "Best Back Piece", icon: "🎭" },
];

const CAR_CATEGORIES = [
  { label: "Best Custom Build", icon: "🔧" },
  { label: "Best Classic (Pre-1980)", icon: "🕰️" },
  { label: "Best Truck or SUV", icon: "🛻" },
  { label: "Best Motorcycle", icon: "🏍️" },
  { label: "Best Interior", icon: "💺" },
  { label: "Best Paint", icon: "🎨" },
  { label: "People's Choice — Car", icon: "👥" },
  { label: "Best of Show — Car", icon: "⭐" },
];

export default function CompetitionsPage() {
  return (
    <div className="bg-parchment-light-texture min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Page header */}
      <div className="bg-ink-texture py-16 px-4 relative">
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }}
        />
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            eyebrow="Win Recognition"
            title="Competitions"
            subtitle="Tattoo contests and car show awards across all three days of the expo. Categories, entry details, and judging criteria to be announced."
            light
            as="h1"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">

        {/* Intro callout */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <div className="border-2 border-gold/40 bg-cream/60 p-6 sm:p-8 card-vintage">
            <p
              className="text-crimson text-[10px] tracking-[0.35em] uppercase mb-3"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              ★ March 12–14, 2027 ★
            </p>
            <p
              className="text-ink text-xl mb-3"
              style={{ fontFamily: "var(--font-rye, serif)" }}
            >
              Show your best work. Take home a trophy.
            </p>
            <p
              className="text-ink/65 text-base leading-relaxed"
              style={{ fontFamily: "var(--font-garamond, serif)" }}
            >
              West TN Tattoo and Art Festival features competitions for both tattoo artists and car show entrants.
              Competition entry details, judging criteria, and registration will be announced as the event approaches.
            </p>
          </div>
        </div>

        {/* ── Tattoo Competitions ── */}
        <section className="mb-14">
          <SectionHeading eyebrow="Ink" title="Tattoo Competitions" className="mb-8" />

          <div className="grid sm:grid-cols-2 gap-8 mb-8 items-start">
            <div>
              <p
                className="text-ink/70 text-base leading-relaxed mb-4"
                style={{ fontFamily: "var(--font-garamond, serif)" }}
              >
                Artists and collectors compete across multiple style categories. Tattoos are judged on
                technical execution, artistic quality, composition, and style-adherence.
              </p>
              <p
                className="text-ink/55 text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-garamond, serif)" }}
              >
                Competition is open to any tattoo received at the expo during the event weekend.
                Entry forms and judging criteria will be posted closer to the event.
              </p>
            </div>

            <div className="border border-ink/15 bg-cream/60">
              <div className="bg-ink text-cream px-4 py-3 text-center">
                <p
                  className="text-xs tracking-[0.3em] uppercase"
                  style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                >
                  Tattoo Contest Categories
                </p>
              </div>
              <div className="divide-y divide-ink/8">
                {TATTOO_CATEGORIES.map((cat) => (
                  <div
                    key={cat.label}
                    className="flex items-center gap-3 px-4 py-2.5"
                  >
                    <span className="text-base flex-shrink-0">{cat.icon}</span>
                    <span
                      className="text-ink/70 text-sm"
                      style={{ fontFamily: "var(--font-garamond, serif)" }}
                    >
                      {cat.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-ink/15">
                <p
                  className="text-ink/40 text-xs italic"
                  style={{ fontFamily: "var(--font-garamond, serif)" }}
                >
                  Final categories subject to change. Additional categories may be added.
                </p>
              </div>
            </div>
          </div>

          {/* Entry status */}
          <div className="border border-crimson/25 bg-crimson/5 p-5 text-center max-w-xl mx-auto">
            <p
              className="text-crimson/80 text-xs tracking-wider uppercase mb-1"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              ★ Registration Opening Soon ★
            </p>
            <p
              className="text-ink/50 text-sm"
              style={{ fontFamily: "var(--font-garamond, serif)" }}
            >
              Tattoo competition entry will be open at the event. Details and categories will be confirmed
              prior to the expo.
            </p>
          </div>
        </section>

        {/* Divider */}
        <div
          className="h-[1px] max-w-md mx-auto mb-14"
          style={{ background: "linear-gradient(90deg,transparent,#C4902A44,transparent)" }}
        />

        {/* ── Car Show Awards ── */}
        <section className="mb-14">
          <SectionHeading eyebrow="Car Culture" title="Car Show Awards" className="mb-8" />

          <div className="grid sm:grid-cols-2 gap-8 mb-8 items-start">
            <div>
              <p
                className="text-ink/70 text-base leading-relaxed mb-4"
                style={{ fontFamily: "var(--font-garamond, serif)" }}
              >
                Car show entrants compete for trophies across vehicle classes and specialty awards.
                Awards are presented on the final day of the event.
              </p>
              <p
                className="text-ink/55 text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-garamond, serif)" }}
              >
                Register your vehicle on the Car Show page. Up to {75} vehicles accepted.
                Spaces are first-come, first-served.
              </p>
              <div className="mt-5">
                <Link
                  href="/car-show#register"
                  className="inline-block px-7 py-3 bg-gold text-ink uppercase tracking-wider text-sm hover:bg-gold-light transition-all active:scale-95"
                  style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                >
                  Register Your Vehicle →
                </Link>
              </div>
            </div>

            <div className="border border-ink/15 bg-cream/60">
              <div className="bg-ink text-cream px-4 py-3 text-center">
                <p
                  className="text-xs tracking-[0.3em] uppercase"
                  style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                >
                  Car Show Award Categories
                </p>
              </div>
              <div className="divide-y divide-ink/8">
                {CAR_CATEGORIES.map((cat) => (
                  <div
                    key={cat.label}
                    className="flex items-center gap-3 px-4 py-2.5"
                  >
                    <span className="text-base flex-shrink-0">{cat.icon}</span>
                    <span
                      className="text-ink/70 text-sm"
                      style={{ fontFamily: "var(--font-garamond, serif)" }}
                    >
                      {cat.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-ink/15">
                <p
                  className="text-ink/40 text-xs italic"
                  style={{ fontFamily: "var(--font-garamond, serif)" }}
                >
                  Final award categories to be confirmed. Trophies presented Sunday, March 14.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Questions & Contact ── */}
        <section>
          <div
            className="bg-ink-texture relative overflow-hidden p-8 sm:p-12 text-center"
          >
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px]"
              style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }}
            />
            <p
              className="text-gold/70 text-xs tracking-[0.3em] uppercase mb-3"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              ★ Questions ★
            </p>
            <h2
              className="text-cream text-2xl sm:text-3xl mb-3"
              style={{ fontFamily: "var(--font-rye, serif)" }}
            >
              Want to Compete?
            </h2>
            <p
              className="text-cream/60 text-base mb-6 max-w-lg mx-auto"
              style={{ fontFamily: "var(--font-garamond, serif)" }}
            >
              Competition entry details will be announced as the event approaches.
              Contact us with any questions about the contests or awards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-3 bg-crimson text-cream uppercase tracking-widest text-sm hover:bg-crimson-dark transition-all active:scale-95"
                style={{ fontFamily: "var(--font-special-elite, monospace)" }}
              >
                Contact the Expo
              </Link>
              <a
                href={`tel:${EVENT.contact.phone}`}
                className="px-8 py-3 border-2 border-gold text-gold uppercase tracking-widest text-sm hover:bg-gold hover:text-ink transition-all active:scale-95"
                style={{ fontFamily: "var(--font-special-elite, monospace)" }}
              >
                Call {EVENT.contact.phone}
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
