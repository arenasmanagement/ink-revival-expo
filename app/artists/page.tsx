import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import ArtistApplicationForm from "@/components/registration/ArtistApplicationForm";
import { TATTOO_SPECIALTIES, PRICING, CAPACITY } from "@/lib/eventData";

export const metadata: Metadata = {
  title: "Tattoo Artists — Apply for a Booth | West TN Ink Revival Expo 2027",
  description:
    "Apply as a tattoo artist at West TN Ink Revival Expo 2027 in Huntingdon, Tennessee. 35 artist booths available. 10×10 and 10×20 booth space for American Traditional, Black and Gray, Realism, Fine Line, Japanese, and more. March 12–14, 2027.",
  alternates: { canonical: "https://www.westtninkrevival.com/artists" },
  openGraph: {
    title: "Tattoo Artists — Apply for a Booth | West TN Ink Revival Expo 2027",
    description:
      "35 artist booths available at West Tennessee's first tattoo & art festival. 10×10 and 10×20 spaces. Application required — no upfront payment until approved. March 12–14, 2027.",
    url: "https://www.westtninkrevival.com/artists",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.westtninkrevival.com" },
    { "@type": "ListItem", position: 2, name: "Tattoo Artists", item: "https://www.westtninkrevival.com/artists" },
  ],
};

const PLACEHOLDER_ARTISTS = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  specialties: [
    TATTOO_SPECIALTIES[i % TATTOO_SPECIALTIES.length],
    TATTOO_SPECIALTIES[(i + 2) % TATTOO_SPECIALTIES.length],
  ],
}));

const HOW_IT_WORKS = [
  { step: "1", title: "Submit Application", desc: "Fill out the form below with your portfolio link and style information." },
  { step: "2", title: "Review & Approval", desc: "Studio 45 reviews all applications within 3–5 business days." },
  { step: "3", title: "Confirmation & Permit", desc: "Approved artists receive booth confirmation and Tennessee permit information." },
  { step: "4", title: "See You There", desc: "Set up your booth March 12–14, 2027 at Carroll County TN Fairgrounds." },
];

export default function ArtistsPage() {
  return (
    <div className="bg-parchment-light-texture min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ── Page header ── */}
      <div className="bg-ink-texture py-16 px-4 relative">
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            eyebrow="The Talent"
            title="Tattoo Artists"
            subtitle={`${CAPACITY.tattooArtistBooths} artist booths available. Apply now to secure your spot at West Tennessee's first tattoo & art festival.`}
            light
            as="h1"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">

        {/* ── Booth info callout ── */}
        <div className="border-2 border-gold/40 bg-cream/60 p-6 mb-10 sm:mb-12 max-w-2xl mx-auto text-center card-vintage">
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
            className="text-ink/70 text-base leading-relaxed mb-4"
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          >
            {PRICING.tattooArtist.note}
          </p>
          <div className="grid grid-cols-2 gap-4 text-center mt-4 pt-4 border-t border-ink/10">
            <div>
              <p className="text-gold text-2xl font-bold" style={{ fontFamily: "var(--font-rye, serif)" }}>
                {CAPACITY.tattooArtistBooths}
              </p>
              <p className="text-ink/50 text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
                Total Booths
              </p>
            </div>
            <div>
              <p className="text-crimson text-2xl font-bold" style={{ fontFamily: "var(--font-rye, serif)" }}>
                10×20
              </p>
              <p className="text-ink/50 text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
                Max Booth Size
              </p>
            </div>
          </div>
        </div>

        {/* ── How it works ── */}
        <section className="mb-12">
          <SectionHeading eyebrow="Process" title="How It Works" className="mb-8" />
          <div className="grid sm:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="text-center">
                <div
                  className="w-10 h-10 border-2 border-gold flex items-center justify-center mx-auto mb-3"
                  style={{ background: "rgba(196,144,42,0.1)" }}
                >
                  <span
                    className="text-gold text-sm font-bold"
                    style={{ fontFamily: "var(--font-rye, serif)" }}
                  >
                    {step.step}
                  </span>
                </div>
                <p
                  className="text-ink text-sm font-medium mb-1"
                  style={{ fontFamily: "var(--font-rye, serif)" }}
                >
                  {step.title}
                </p>
                <p
                  className="text-ink/55 text-xs leading-relaxed"
                  style={{ fontFamily: "var(--font-garamond, serif)" }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Featured artists grid — placeholders ── */}
        <section className="mb-12 sm:mb-14">
          <SectionHeading
            eyebrow="Lineup"
            title="Featured Artists"
            subtitle="Artist lineup will be announced as the event approaches. Apply today to secure your spot."
            className="mt-10 sm:mt-14 mb-10"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 max-w-3xl mx-auto">
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

          <p
            className="text-center text-ink/40 text-sm italic"
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          >
            Artist lineup announced as approvals are confirmed. Apply below to join the roster.
          </p>
        </section>

        {/* ── Artist Application ── */}
        <section id="apply" className="max-w-2xl mx-auto">
          <SectionHeading eyebrow="Join Us" title="Apply as a Tattoo Artist" className="mb-8" />
          <ArtistApplicationForm />
        </section>
      </div>
    </div>
  );
}
