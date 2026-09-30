import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";

const CARDS = [
  {
    icon: TattooMachineIcon,
    title: "World Class Artists",
    desc: "Tattoo artists from across the region competing, creating, and taking on walk-ups all weekend long.",
    cta: "Artist Info",
    href: "/artists",
    accent: "#7A1714",
  },
  {
    icon: HorseshoeIcon,
    title: "Vendors & Exhibitors",
    desc: "Top tattoo brands, merch, supplies, handmade goods, and local makers under one roof.",
    cta: "Vendor Booths",
    href: "/vendors",
    accent: "#C4902A",
  },
  {
    icon: StarBurstIcon,
    title: "Tattoo Contests",
    desc: "Watch the best compete in epic tattoo battles across categories. Bragging rights included.",
    cta: "Learn More",
    href: "/event-info",
    accent: "#7A1714",
  },
  {
    icon: LanternIcon,
    title: "Live Music & Entertainment",
    desc: "Great music, good vibes, and live entertainment that keeps the energy high all weekend.",
    cta: "Event Schedule",
    href: "/schedule",
    accent: "#C4902A",
  },
  {
    icon: FishIcon,
    title: "Food, Drinks & Good Times",
    desc: "Local food trucks serving up great eats, cold drinks, and good company for three full days.",
    cta: "Food Trucks",
    href: "/vendors#food-trucks",
    accent: "#7A1714",
  },
] as const;

export default function FlashCards() {
  return (
    <section className="bg-parchment-light-texture py-14 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="What to Expect"
          title="Three Days of Everything"
          subtitle="West TN Ink Revival Expo is built to deliver — art, community, food, music, and culture."
          className="mb-12"
        />

        {/* Cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="flash-card flex flex-col items-center p-5 sm:p-6 text-center group focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson"
              >
                {/* Accent top bar */}
                <div
                  className="w-full h-[4px] -mt-5 sm:-mt-6 -mx-5 sm:-mx-6 mb-5 sm:mb-6"
                  style={{ background: card.accent, width: "calc(100% + 2.5rem)" }}
                />

                {/* Icon */}
                <div className="mb-4 flex items-center justify-center w-16 h-16">
                  <Icon />
                </div>

                {/* Double rule */}
                <div className="w-full mb-4">
                  <div className="h-px bg-ink/20 mb-1" />
                  <div className="h-px bg-ink/10" />
                </div>

                {/* Title */}
                <h3
                  className="text-ink text-sm sm:text-base leading-tight mb-2"
                  style={{ fontFamily: "var(--font-rye, serif)" }}
                >
                  {card.title}
                </h3>

                {/* Description */}
                <p
                  className="text-ink/60 text-xs leading-relaxed mb-4 flex-1"
                  style={{ fontFamily: "var(--font-garamond, serif)" }}
                >
                  {card.desc}
                </p>

                {/* CTA */}
                <span
                  className="text-[10px] tracking-[0.2em] uppercase text-crimson group-hover:text-crimson-light transition-colors"
                  style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                >
                  {card.cta} →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── American Traditional SVG Icons ──────────────────── */

function TattooMachineIcon() {
  return (
    <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
      <rect x="20" y="8" width="24" height="12" rx="2" fill="#1A1008" />
      <rect x="22" y="20" width="20" height="24" rx="2" fill="#2E1E0E" />
      <rect x="26" y="10" width="4" height="7" fill="#C4902A" />
      <rect x="34" y="10" width="4" height="7" fill="#C4902A" />
      <rect x="18" y="26" width="28" height="5" rx="1" fill="#C4902A" />
      <path d="M30,44 L32,60 L34,44 Z" fill="#1A1008" />
      <circle cx="32" cy="61" r="2.5" fill="#7A1714" />
      <path d="M20,20 L15,25 L15,35 L20,35 Z" fill="#1A1008" />
      <path d="M44,20 L49,25 L49,35 L44,35 Z" fill="#1A1008" />
      <rect x="24" y="28" width="3" height="3" rx="0.5" fill="#C4902A" />
      <rect x="37" y="28" width="3" height="3" rx="0.5" fill="#C4902A" />
    </svg>
  );
}

function HorseshoeIcon() {
  return (
    <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
      <path
        d="M32,8 C18,8 10,18 10,30 C10,44 20,56 30,56 L34,56 C44,56 54,44 54,30 C54,18 46,8 32,8 Z"
        fill="none"
        stroke="#1A1008"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M32,10 C19,10 12,19 12,30 C12,43 21,54 30,54 L34,54 C43,54 52,43 52,30 C52,19 45,10 32,10 Z"
        fill="none"
        stroke="#C4902A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Lucky stars */}
      <text x="27" y="36" style={{ fill: "#7A1714", fontSize: "14px" }}>★</text>
      {/* Nail holes */}
      {[22, 28, 36, 42].map((x) => (
        <circle key={x} cx={x} cy={12} r={2} fill="#C4902A" />
      ))}
    </svg>
  );
}

function StarBurstIcon() {
  return (
    <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
      {/* Outer burst rays */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const x1 = 32 + Math.cos(angle) * 20;
        const y1 = 32 + Math.sin(angle) * 20;
        const x2 = 32 + Math.cos(angle) * 28;
        const y2 = 32 + Math.sin(angle) * 28;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C4902A" strokeWidth="2.5" />;
      })}
      {/* Star shape */}
      <polygon
        points="32,8 36,24 52,24 39,34 44,50 32,40 20,50 25,34 12,24 28,24"
        fill="#7A1714"
        stroke="#1A1008"
        strokeWidth="1.5"
      />
      <polygon
        points="32,14 35.2,24 45,24 37.4,29.8 40.1,40 32,34 23.9,40 26.6,29.8 19,24 28.8,24"
        fill="#9B2020"
      />
      <circle cx="32" cy="30" r="5" fill="#C4902A" />
    </svg>
  );
}

function LanternIcon() {
  return (
    <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
      {/* Hook */}
      <path d="M32,4 C32,4 32,8 28,8 L28,12" fill="none" stroke="#1A1008" strokeWidth="2.5" />
      {/* Top cap */}
      <rect x="22" y="12" width="20" height="5" rx="1" fill="#1A1008" />
      {/* Glass body */}
      <rect x="20" y="17" width="24" height="28" rx="3" fill="#D4841A" opacity="0.7" />
      <rect x="20" y="17" width="24" height="28" rx="3" fill="none" stroke="#1A1008" strokeWidth="2.5" />
      {/* Vertical bars */}
      <line x1="28" y1="17" x2="28" y2="45" stroke="#1A1008" strokeWidth="1.5" />
      <line x1="36" y1="17" x2="36" y2="45" stroke="#1A1008" strokeWidth="1.5" />
      {/* Flame */}
      <ellipse cx="32" cy="32" rx="4" ry="7" fill="#C4902A" opacity="0.9" />
      <ellipse cx="32" cy="30" rx="2.5" ry="4" fill="#F5E6C8" opacity="0.7" />
      {/* Bottom cap */}
      <rect x="20" y="45" width="24" height="5" rx="1" fill="#1A1008" />
      {/* Glow */}
      <ellipse cx="32" cy="31" rx="8" ry="8" fill="#D4841A" opacity="0.15" />
    </svg>
  );
}

function FishIcon() {
  return (
    <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
      {/* Fish body */}
      <ellipse cx="30" cy="32" rx="18" ry="10" fill="#2D4A1E" />
      {/* Tail fin */}
      <polygon points="12,32 4,22 4,42" fill="#1A3010" />
      {/* Belly highlight */}
      <ellipse cx="32" cy="34" rx="12" ry="5" fill="#3D6228" opacity="0.6" />
      {/* Scales */}
      {[20, 27, 34, 41].map((x) => (
        <path key={x} d={`M${x},30 Q${x + 4},26 ${x + 8},30`} fill="none" stroke="#C4902A" strokeWidth="1.2" />
      ))}
      {/* Eye */}
      <circle cx="44" cy="30" r="4" fill="#F5E6C8" />
      <circle cx="44" cy="30" r="2.5" fill="#1A1008" />
      <circle cx="43" cy="29" r="0.8" fill="#F5E6C8" />
      {/* Mouth */}
      <path d="M48,32 Q50,34 48,36" fill="none" stroke="#1A1008" strokeWidth="1.5" />
      {/* Dorsal fin */}
      <path d="M22,22 Q32,16 40,22" fill="#1A3010" stroke="#1A3010" strokeWidth="1" />
      {/* Hook & line above */}
      <line x1="38" y1="8" x2="38" y2="22" stroke="#8B7340" strokeWidth="1.5" />
      <path d="M38,22 Q42,26 40,30" fill="none" stroke="#8B7340" strokeWidth="1.5" />
    </svg>
  );
}
