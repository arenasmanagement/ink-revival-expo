import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { ScrollworkDivider } from "@/components/ui/OrnamentalDivider";

type CardAccent = "crimson" | "gold" | "rust" | "forest" | "ink";

interface AudienceCard {
  svg: React.FC;
  title: string;
  desc: string;
  cta: string;
  href: string;
  accent: CardAccent;
}

const AUDIENCE: AudienceCard[] = [
  {
    svg: TattooMachineIcon,
    title: "Tattoo Artists",
    desc: "Showcase your craft, build clientele, and connect with collectors and enthusiasts from across the region.",
    cta: "Artist Information",
    href: "/artists",

    accent: "crimson",
  },
  {
    svg: HeartIcon,
    title: "Tattoo Enthusiasts",
    desc: "View live tattoo work, discover talented artists, explore vendors, and experience the culture you love.",
    cta: "Event Info",
    href: "/event-info",

    accent: "ink",
  },
  {
    svg: StarBadgeIcon,
    title: "Vendors & Makers",
    desc: "Reach thousands of passionate attendees with your apparel, art, accessories, and handmade goods.",
    cta: "View Vendor Options",
    href: "/vendors",

    accent: "gold",
  },
  {
    svg: FlameIcon,
    title: "Food Trucks",
    desc: "Serve hungry event-goers across three action-packed days in the heart of West Tennessee.",
    cta: "Food Truck Info",
    href: "/vendors#food-trucks",

    accent: "rust",
  },
  {
    svg: ShieldIcon,
    title: "Sponsors",
    desc: "Place your brand in front of a passionate, engaged regional audience before, during, and after the event.",
    cta: "View Packages",
    href: "/sponsors",

    accent: "forest",
  },
  {
    svg: EagleSmallIcon,
    title: "Families & Community",
    desc: "An open, welcoming event for the whole West Tennessee community to discover art, culture, and good food.",
    cta: "Learn More",
    href: "/faq",

    accent: "crimson",
  },
];

const ACCENT_STYLES: Record<CardAccent, { bar: string; cta: string; star: string }> = {
  crimson: {
    bar: "bg-crimson",
    cta: "border-crimson/50 text-crimson hover:bg-crimson hover:text-cream",
    star: "text-crimson",
  },
  gold: {
    bar: "bg-gold",
    cta: "border-gold/60 text-ink/70 hover:bg-gold hover:text-ink",
    star: "text-gold",
  },
  rust: {
    bar: "bg-rust",
    cta: "border-rust/50 text-rust hover:bg-rust hover:text-cream",
    star: "text-rust",
  },
  forest: {
    bar: "bg-forest",
    cta: "border-forest/50 text-forest hover:bg-forest hover:text-cream",
    star: "text-forest",
  },
  ink: {
    bar: "bg-ink",
    cta: "border-ink/40 text-ink/70 hover:bg-ink hover:text-cream",
    star: "text-ink",
  },
};

export default function WhoIsItFor() {
  return (
    <section className="bg-parchment-texture pt-6 sm:pt-8 pb-14 sm:pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <ScrollworkDivider className="mb-10 sm:mb-14 max-w-lg mx-auto" />
        <SectionHeading
          eyebrow="Who It's For"
          title="Something for Everyone"
          subtitle="West TN Ink Revival Expo is built for artists, enthusiasts, businesses, and the whole West Tennessee community."
          className="mb-14"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          {AUDIENCE.map((card) => {
            const Icon = card.svg;
            const a = ACCENT_STYLES[card.accent];

            const cardContent = (
              <>
                {/* Accent top bar */}
                <div className={`h-[4px] ${a.bar} -mx-5 sm:-mx-6 -mt-5 sm:-mt-6 mb-5 sm:mb-6`} />

                {/* Icon */}
                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                  <Icon />
                </div>

                <h3
                  className="text-ink text-base sm:text-lg mb-2 leading-tight"
                  style={{ fontFamily: "var(--font-rye, serif)" }}
                >
                  {card.title}
                </h3>
                <div className="divider-ink mx-auto mb-3" style={{ width: "40px", opacity: 0.25 }} />
                <p
                  className="text-ink/65 text-sm leading-relaxed mb-4 flex-1"
                  style={{ fontFamily: "var(--font-garamond, serif)" }}
                >
                  {card.desc}
                </p>

                {/* CTA label */}
                <span
                  className={`inline-block border text-xs uppercase tracking-wider px-3 py-1.5 transition-colors duration-200 ${a.cta}`}
                  style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                >
                  {card.cta} →
                </span>
              </>
            );

            return (
              <Link
                key={card.title}
                href={card.href}
                className="card-vintage bg-cream/60 border border-ink/15 p-5 sm:p-6 text-center flex flex-col items-center overflow-hidden relative group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson"
                style={{ boxShadow: "0 2px 12px rgba(26,16,8,0.08)" }}
              >
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Inline SVG icons ────────────────────────────────── */
function TattooMachineIcon() {
  return (
    <svg viewBox="0 0 60 60" className="w-12 h-12">
      <rect x="20" y="8" width="20" height="10" rx="2" fill="#1A1008" />
      <rect x="22" y="18" width="16" height="22" rx="2" fill="#2C1810" />
      <rect x="25" y="10" width="3" height="5" fill="#C4902A" />
      <rect x="32" y="10" width="3" height="5" fill="#C4902A" />
      <rect x="18" y="24" width="24" height="4" rx="1" fill="#C4902A" />
      <path d="M28,40 L30,56 L32,40 Z" fill="#1A1008" />
      <circle cx="30" cy="57" r="2" fill="#7A1714" />
      <path d="M20,18 L16,22 L16,30 L20,30 Z" fill="#1A1008" />
      <path d="M40,18 L44,22 L44,30 L40,30 Z" fill="#1A1008" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 60 60" className="w-12 h-12">
      <path d="M30,48 C30,48 10,35 10,22 C10,15 15,10 22,12 C25,13 28,16 30,19 C32,16 35,13 38,12 C45,10 50,15 50,22 C50,35 30,48 30,48 Z" fill="#7A1714" />
      <path d="M30,44 C30,44 14,33 14,22 C14,17 18,13 24,15 C27,16 29,19 30,22 C31,19 33,16 36,15 C42,13 46,17 46,22 C46,33 30,44 30,44 Z" fill="#9B2020" />
      <text x="30" y="32" textAnchor="middle" fill="#F5E6C8" fontSize="10" fontWeight="bold">INK</text>
    </svg>
  );
}

function StarBadgeIcon() {
  return (
    <svg viewBox="0 0 60 60" className="w-12 h-12">
      <polygon points="30,8 34,22 48,22 37,31 41,45 30,36 19,45 23,31 12,22 26,22" fill="#C4902A" stroke="#9E7218" strokeWidth="1" />
      <polygon points="30,14 33,23 42,23 35,28 38,38 30,32 22,38 25,28 18,23 27,23" fill="#D4A843" />
      <circle cx="30" cy="30" r="6" fill="#7A1714" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg viewBox="0 0 60 60" className="w-12 h-12">
      <path d="M30,55 C20,55 12,48 12,38 C12,28 18,22 22,16 C22,22 24,25 28,25 C26,20 28,12 30,8 C32,14 36,18 38,24 C40,20 40,15 40,12 C44,18 48,26 48,38 C48,48 40,55 30,55 Z" fill="#B8461A" />
      <path d="M30,52 C23,52 17,46 17,38 C17,30 21,25 24,20 C24,25 26,27 28,28 C27,24 28,18 30,14 C32,18 34,22 36,27 C38,23 38,18 38,16 C41,21 44,28 44,38 C44,46 38,52 30,52 Z" fill="#D45A25" />
      <path d="M30,48 C25,48 21,44 21,39 C21,34 24,30 27,27 C27,31 29,32 30,33 C31,30 31,27 32,25 C34,29 36,33 36,39 C36,44 33,48 30,48 Z" fill="#F5E6C8" opacity="0.7" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 60 60" className="w-12 h-12">
      <path d="M30,8 L50,16 L50,32 C50,42 40,52 30,55 C20,52 10,42 10,32 L10,16 Z" fill="#2D4A1E" stroke="#1A1008" strokeWidth="1.5" />
      <path d="M30,12 L46,19 L46,32 C46,40 38,49 30,52 C22,49 14,40 14,32 L14,19 Z" fill="#3D6228" />
      <polygon points="30,22 32,28 38,28 33,32 35,38 30,34 25,38 27,32 22,28 28,28" fill="#C4902A" />
    </svg>
  );
}

function EagleSmallIcon() {
  return (
    <svg viewBox="0 0 60 60" className="w-12 h-12">
      <path d="M30,32 C24,28 14,22 6,20 C12,25 20,29 27,33 C20,31 12,32 6,36 C14,35 22,33 29,36 C25,40 18,44 14,50 C20,45 26,40 30,36 C34,40 40,45 46,50 C42,44 35,40 31,36 C38,33 46,35 54,36 C48,32 40,31 33,33 C40,29 48,25 54,20 C46,22 36,28 30,32 Z" fill="#1A1008" />
      <circle cx="30" cy="25" r="5" fill="#F5E6C8" />
      <path d="M32,24 L37,23 L36,25 L32,25 Z" fill="#C4902A" />
    </svg>
  );
}
