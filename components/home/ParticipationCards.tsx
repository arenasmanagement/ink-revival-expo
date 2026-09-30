import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";

const CARDS = [
  {
    title: "Tattoo Artists",
    icon: "✒️",
    body: "Join artists from across the region and showcase your work at West Tennessee's newest tattoo convention. Eligible artists may receive booth space up to 10×20 with the required paid permit.",
    details: ["Up to 10×20 booth space", "No additional booth fee with paid permit", "Subject to approval"],
    cta: "Artist Information",
    href: "/artists",
    accent: "crimson" as const,
  },
  {
    title: "Vendors",
    icon: "🛒",
    body: "Showcase apparel, artwork, accessories, collectibles, handmade products, and other unique merchandise to a passionate audience of tattoo enthusiasts.",
    details: ["10×10 Vendor Booth — $250", "Double Vendor Booth — $400", "Limited spaces available"],
    cta: "Reserve a Vendor Booth",
    href: "/vendors",
    accent: "gold" as const,
  },
  {
    title: "Food Trucks",
    icon: "🚚",
    body: "Serve attendees throughout a three-day event and support West Tennessee's tattoo and creative community. Connect with visitors from across West Tennessee and the region.",
    details: ["Food Truck Space — $200", "3-day exposure", "High-traffic event location"],
    cta: "Apply as a Food Truck",
    href: "/vendors#food-trucks",
    accent: "rust" as const,
  },
  {
    title: "Sponsors",
    icon: "🌟",
    body: "Place your business in front of attendees, artists, vendors, creators, and online viewers before, during, and after the event. Two sponsorship levels available.",
    details: ["Basic Sponsorship — $500", "VIP Sponsorship — $1,000", "Custom packages available"],
    cta: "View Sponsorship Opportunities",
    href: "/sponsors",
    accent: "forest" as const,
  },
];

const ACCENT_STYLES = {
  crimson: {
    bar: "#7A1714",
    btn: "bg-crimson text-cream hover:bg-crimson-dark",
    badge: "bg-crimson/10 text-crimson border-crimson/20",
    star: "#7A1714",
  },
  gold: {
    bar: "#C4902A",
    btn: "bg-gold text-ink hover:bg-gold-light",
    badge: "bg-gold/10 text-gold-dark border-gold/20",
    star: "#C4902A",
  },
  rust: {
    bar: "#B8461A",
    btn: "bg-rust text-cream hover:bg-rust-light",
    badge: "bg-rust/10 text-rust border-rust/20",
    star: "#B8461A",
  },
  forest: {
    bar: "#2D4A1E",
    btn: "bg-forest text-cream hover:bg-forest-light",
    badge: "bg-forest/10 text-forest border-forest/20",
    star: "#2D4A1E",
  },
};

export default function ParticipationCards() {
  return (
    <section className="bg-ink-texture py-12 sm:py-16 px-4 relative">
      {/* Top gold rule */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
      {/* Bottom gold rule */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />

      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Join Us"
          title="Ways to Participate"
          subtitle="Whether you're an artist, vendor, food truck, or local business, there's a place for you at West TN Ink Revival Expo."
          light
          className="mb-14"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CARDS.map((card) => {
            const a = ACCENT_STYLES[card.accent];
            return (
              <div
                key={card.title}
                className="card-vintage bg-parchment-light flex flex-col relative overflow-hidden"
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
              >
                {/* Accent top bar */}
                <div className="h-[5px]" style={{ background: a.bar }} />

                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  {/* Title */}
                  <h3
                    className="text-ink text-xl mb-3"
                    style={{ fontFamily: "var(--font-rye, serif)" }}
                  >
                    {card.title}
                  </h3>
                  <div className="divider-ink mb-3" style={{ opacity: 0.3 }} />

                  <p
                    className="text-ink/70 text-sm leading-relaxed mb-4 flex-1"
                    style={{ fontFamily: "var(--font-garamond, serif)" }}
                  >
                    {card.body}
                  </p>

                  {/* Details */}
                  <ul className="space-y-1.5 mb-5">
                    {card.details.map((d) => (
                      <li key={d} className="flex items-start gap-2">
                        <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: a.star }}>★</span>
                        <span
                          className="text-xs text-ink/70"
                          style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                        >
                          {d}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={card.href}
                    className={`${a.btn} text-center text-xs uppercase tracking-wider py-3 px-4 transition-all duration-200 active:scale-95 mt-auto`}
                    style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                  >
                    {card.cta}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
