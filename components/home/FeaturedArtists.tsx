import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";

// Four placeholder slots — replaced with real artist data once the lineup is announced.
// Do not add "Booked" or any booking-status labels to placeholder cards.
const PLACEHOLDER_COUNT = 4;

export default function FeaturedArtists() {
  return (
    <section className="bg-parchment-light-texture py-12 sm:py-16 px-4 relative">
      {/* Soft gradient at top to ease dark-to-light transition */}
      <div
        className="absolute top-0 left-0 right-0 h-10 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(26,16,8,0.07), transparent)" }}
      />
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="The Talent"
          title="Featured Artists"
          subtitle="Our artist lineup will be announced as applications are reviewed and confirmed. Check back for updates."
          className="mb-12"
        />

        {/* Coming-soon placeholder grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 max-w-2xl mx-auto">
          {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
            <PlaceholderCard key={i} />
          ))}
        </div>

        {/* Coming soon notice */}
        <div className="text-center border border-gold/30 bg-cream/50 py-5 px-6 mb-8 max-w-xl mx-auto">
          <p
            className="text-ink/60 text-sm"
            style={{ fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.05em" }}
          >
            ★ Artist lineup to be announced. Applications are now being accepted. ★
          </p>
        </div>

        <div className="text-center flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/artists"
            className="px-8 py-3 border-2 border-ink text-ink uppercase tracking-widest text-sm hover:bg-ink hover:text-cream transition-all duration-200 active:scale-95"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            Artist Information
          </Link>
          <Link
            href="/artists#apply"
            className="px-8 py-3 bg-crimson text-cream uppercase tracking-widest text-sm hover:bg-crimson-dark transition-all duration-200 active:scale-95"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            Apply as an Artist
          </Link>
        </div>
      </div>
    </section>
  );
}

function PlaceholderCard() {
  return (
    <div className="card-vintage border border-ink/12 bg-cream/70 flex flex-col">
      {/* Photo placeholder */}
      <div
        className="aspect-square flex items-center justify-center relative"
        style={{ background: "linear-gradient(135deg, #C2A06A 0%, #A8874A 100%)" }}
      >
        <svg viewBox="0 0 60 60" className="w-10 h-10 opacity-20" fill="#1A1008">
          <rect x="20" y="8" width="20" height="10" rx="2" />
          <rect x="22" y="18" width="16" height="22" rx="2" />
          <path d="M28,40 L30,56 L32,40 Z" />
        </svg>
        <div className="absolute bottom-0 inset-x-0 h-[3px] bg-crimson/60" />
      </div>

      {/* Info */}
      <div className="p-3">
        <p
          className="text-ink/30 text-xs uppercase tracking-wider text-center"
          style={{ fontFamily: "var(--font-special-elite, monospace)" }}
        >
          Coming Soon
        </p>
      </div>
    </div>
  );
}
