import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";

// Placeholder artists — replace with real data
const PLACEHOLDER_ARTISTS = [
  { id: 1, name: "Artist Name", studio: "Studio Name", location: "City, TN", specialties: ["American Traditional", "Color"], booked: false },
  { id: 2, name: "Artist Name", studio: "Studio Name", location: "City, TN", specialties: ["Black and Gray", "Realism"], booked: true },
  { id: 3, name: "Artist Name", studio: "Studio Name", location: "City, TN", specialties: ["Neo-Traditional", "Fine Line"], booked: false },
  { id: 4, name: "Artist Name", studio: "Studio Name", location: "City, TN", specialties: ["Japanese", "Illustrative"], booked: false },
  { id: 5, name: "Artist Name", studio: "Studio Name", location: "City, TN", specialties: ["Blackwork", "Lettering"], booked: true },
  { id: 6, name: "Artist Name", studio: "Studio Name", location: "City, TN", specialties: ["American Traditional"], booked: false },
];

export default function FeaturedArtists() {
  return (
    <section className="bg-parchment-light-texture py-12 sm:py-16 px-4 relative">
      {/* Soft gradient at top to ease dark-to-light transition */}
      <div className="absolute top-0 left-0 right-0 h-10 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(26,16,8,0.07), transparent)" }} />
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="The Talent"
          title="Featured Artists"
          subtitle="Our artist lineup will be announced soon. Check back for updates as confirmed artists are added."
          className="mb-12"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {PLACEHOLDER_ARTISTS.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>

        {/* Coming soon notice */}
        <div
          className="text-center border border-gold/30 bg-cream/50 py-5 px-6 mb-8 max-w-xl mx-auto"
        >
          <p
            className="text-ink/60 text-sm"
            style={{ fontFamily: "var(--font-special-elite, monospace)", letterSpacing: "0.05em" }}
          >
            ★ Artist applications are open. Full lineup will be announced closer to the event. ★
          </p>
        </div>

        <div className="text-center flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/artists"
            className="px-8 py-3 border-2 border-ink text-ink uppercase tracking-widest text-sm hover:bg-ink hover:text-cream transition-all duration-200 active:scale-95"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            View All Artists
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

function ArtistCard({ artist }: { artist: typeof PLACEHOLDER_ARTISTS[0] }) {
  return (
    <div className="card-vintage border border-ink/15 bg-cream/70 flex flex-col">
      {/* Photo placeholder */}
      <div
        className="aspect-square bg-parchment-dark flex items-center justify-center relative"
        style={{ background: "linear-gradient(135deg, #C2A06A 0%, #A8874A 100%)" }}
      >
        {/* Tattoo machine placeholder icon */}
        <svg viewBox="0 0 60 60" className="w-10 h-10 opacity-25" fill="#1A1008">
          <rect x="20" y="8" width="20" height="10" rx="2" />
          <rect x="22" y="18" width="16" height="22" rx="2" />
          <path d="M28,40 L30,56 L32,40 Z" />
        </svg>
        {/* Booking status */}
        {artist.booked && (
          <div className="absolute top-1.5 right-1.5 bg-crimson text-cream text-[9px] px-1.5 py-0.5 uppercase tracking-wider"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}>
            Booked
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 h-[3px] bg-crimson" />
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p
          className="text-ink text-sm font-semibold leading-tight mb-0.5"
          style={{ fontFamily: "var(--font-playfair, serif)" }}
        >
          {artist.name}
        </p>
        <p
          className="text-ink/50 text-xs mb-1"
          style={{ fontFamily: "var(--font-garamond, serif)" }}
        >
          {artist.studio}
        </p>
        <p
          className="text-ink/40 text-[10px] mb-2"
          style={{ fontFamily: "var(--font-special-elite, monospace)" }}
        >
          {artist.location}
        </p>
        <div className="flex flex-wrap gap-1 mt-auto">
          {artist.specialties.map((s) => (
            <span
              key={s}
              className="text-[9px] bg-crimson/10 text-crimson/80 px-1.5 py-0.5 border border-crimson/15"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
