import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { TATTOO_SPECIALTIES, PRICING } from "@/lib/eventData";

export const metadata: Metadata = {
  title: "Tattoo Artists | West TN Ink Revival Expo 2027",
  description: "Discover tattoo artists at West TN Ink Revival Expo 2027. Apply as a tattoo artist or browse our featured artists.",
};

// Placeholder slots until real artist data is available.
// No booking status on placeholder cards — status belongs only on confirmed artists.
const PLACEHOLDER_ARTISTS = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  specialties: [
    TATTOO_SPECIALTIES[i % TATTOO_SPECIALTIES.length],
    TATTOO_SPECIALTIES[(i + 2) % TATTOO_SPECIALTIES.length],
  ],
}));

export default function ArtistsPage() {
  return (
    <div className="bg-parchment-light-texture min-h-screen">

      {/* ── Page header ── */}
      <div className="bg-ink-texture py-16 px-4 relative">
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            eyebrow="The Talent"
            title="Tattoo Artists"
            subtitle="Showcasing the best tattoo artists from across the region."
            light
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">

        {/* ── Booth info callout ── */}
        <div className="border-2 border-gold/40 bg-cream/60 p-6 mb-10 sm:mb-14 max-w-2xl mx-auto text-center">
          <p
            className="text-crimson text-xs tracking-[0.25em] uppercase mb-2"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            ★ Artist Booths ★
          </p>
          <p
            className="text-ink text-xl mb-2"
            style={{ fontFamily: "var(--font-rye, serif)" }}
          >
            Tattoo Artist Space
          </p>
          <p
            className="text-ink/70 text-base leading-relaxed"
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          >
            {PRICING.tattooArtist.note}
          </p>
        </div>

        {/* ── Featured artists grid ── */}
        <SectionHeading
          eyebrow="Lineup"
          title="Featured Artists"
          subtitle="Artist lineup will be announced closer to the event. Apply today to secure your spot."
          className="mt-10 sm:mt-14 mb-10"
        />

        {/* Specialty filter (visual — interactivity added later) */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            className="text-xs px-3 py-1.5 bg-crimson text-cream uppercase tracking-wider"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            All
          </button>
          {TATTOO_SPECIALTIES.map((s) => (
            <button
              key={s}
              className="text-xs px-3 py-1.5 border border-ink/20 text-ink/60 uppercase tracking-wider hover:border-crimson hover:text-crimson transition-colors"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Artist placeholder cards — replaced with real data once lineup is confirmed */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 sm:mb-14 max-w-3xl mx-auto">
          {PLACEHOLDER_ARTISTS.map((a) => (
            <div key={a.id} className="card-vintage border border-ink/12 bg-cream/70 flex flex-col">
              <div
                className="aspect-square relative flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#C2A06A,#A8874A)" }}
              >
                <svg viewBox="0 0 60 60" className="w-10 h-10 opacity-20" fill="#1A1008">
                  <rect x="20" y="8" width="20" height="10" rx="2" />
                  <rect x="22" y="18" width="16" height="22" rx="2" />
                  <path d="M28,40 L30,56 L32,40 Z" />
                </svg>
                <div className="absolute bottom-0 inset-x-0 h-[3px] bg-crimson/60" />
              </div>
              <div className="p-3 text-center">
                <p
                  className="text-ink/30 text-[10px] uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                >
                  Coming Soon
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Artist Application ── */}
        <div id="apply" className="max-w-2xl mx-auto">
          <SectionHeading eyebrow="Join Us" title="Apply as a Tattoo Artist" className="mb-8" />

          <div
            className="bg-cream/60 border border-ink/12 p-8 sm:p-10 text-center card-vintage"
            style={{ boxShadow: "0 4px 20px rgba(26,16,8,0.08)" }}
          >
            <p
              className="text-gold/70 text-xs tracking-[0.3em] uppercase mb-4"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              ★ Artist Applications ★
            </p>
            <p
              className="text-ink/70 text-base leading-relaxed mb-6 max-w-lg mx-auto"
              style={{ fontFamily: "var(--font-garamond, serif)" }}
            >
              The official tattoo artist application is coming soon. To express interest
              or ask about artist opportunities before the form goes live, contact the
              West TN Ink Revival team directly.
            </p>

            <Link
              href="/contact"
              className="inline-block px-10 py-4 bg-crimson text-cream uppercase tracking-widest text-sm hover:bg-crimson-dark transition-all duration-200 active:scale-[0.97] mb-4"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              Contact the Expo
            </Link>

            <p
              className="text-ink/40 text-xs italic"
              style={{ fontFamily: "var(--font-garamond, serif)" }}
            >
              Official artist application details will be announced as the event approaches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
