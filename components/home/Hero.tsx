import Image from "next/image";
import Link from "next/link";
import { REGISTRATION_URLS } from "@/lib/eventData";

const { sponsorRegistrationUrl, vendorRegistrationUrl } = REGISTRATION_URLS;

export default function Hero() {
  return (
    <section
      className="relative min-h-[92vh] flex items-center overflow-hidden bg-parchment-light-texture"
      aria-label="Hero section"
    >
      {/* ── Corner ornaments ─────────────────────── */}
      <CornerOrnament position="top-left" />
      <CornerOrnament position="top-right" />
      <CornerOrnament position="bottom-left" />
      <CornerOrnament position="bottom-right" />

      {/* ── Double-rule border ───────────────────── */}
      <div className="absolute inset-3 sm:inset-5 border border-ink/20 pointer-events-none" />
      <div className="absolute inset-4 sm:inset-6 border border-ink/10 pointer-events-none" />

      {/* ── Content ──────────────────────────────── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-14 sm:py-18 text-center">

        {/* Screen-reader H1 — the visual title is embedded in the hero artwork */}
        <h1 className="sr-only">West TN Ink Revival Expo 2027</h1>

        {/* "You're Invited" eyebrow */}
        <div className="animate-fade-in mb-5">
          <span
            className="inline-block text-crimson text-xs sm:text-sm tracking-[0.4em] uppercase border border-crimson/40 px-4 py-1.5"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            ★ You&rsquo;re Invited ★
          </span>
        </div>

        {/* ── Three-column: date | ARTWORK | label ─ */}
        <div className="animate-fade-up delay-100 flex items-center justify-center gap-3 sm:gap-6 md:gap-10 mb-0">

          {/* Left — date panel */}
          <div className="hidden sm:flex flex-col items-center gap-1 shrink-0 w-[72px] md:w-[88px] self-center">
            <p
              className="text-ink/40 text-[9px] md:text-[10px] tracking-[0.28em] uppercase"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              March
            </p>
            <p
              className="text-ink text-[1.6rem] md:text-[2rem] leading-none"
              style={{ fontFamily: "var(--font-rye, serif)" }}
            >
              12–14
            </p>
            <p
              className="text-ink/40 text-[9px] md:text-[10px] tracking-[0.28em] uppercase"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              2027
            </p>
            <div className="mt-2 h-px w-10 bg-gold/35" />
          </div>

          {/* Center — hero artwork (transparent PNG) */}
          <div
            className="animate-eagle delay-200 relative flex-1"
            style={{ maxWidth: "min(100%, 560px)" }}
          >
            {/*
              True RGBA transparency — the parchment background shows through
              the artwork edges naturally. drop-shadow follows the artwork
              silhouette (not the bounding box) for an organic, grounded feel.
            */}
            <Image
              src="/hero-trans.png"
              alt="West TN Ink Revival Expo — Official emblem featuring a traditional American tattoo eagle, roses, gold scrollwork, and event banner"
              width={1536}
              height={1024}
              priority
              quality={90}
              sizes="(max-width: 640px) 88vw, (max-width: 768px) 62vw, 560px"
              className="w-full h-auto"
              style={{
                filter:
                  "drop-shadow(0 6px 18px rgba(26,16,8,0.22)) drop-shadow(0 2px 6px rgba(122,23,20,0.12))",
              }}
            />
          </div>

          {/* Right — label panel */}
          <div className="hidden sm:flex flex-col items-center gap-1 shrink-0 w-[72px] md:w-[88px] self-center">
            <div className="mb-2 h-px w-10 bg-gold/35" />
            <p
              className="text-ink/40 text-[9px] md:text-[10px] tracking-[0.28em] uppercase"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              West TN
            </p>
            <p
              className="text-ink text-[1.4rem] md:text-[1.75rem] leading-none"
              style={{ fontFamily: "var(--font-rye, serif)" }}
            >
              Ink
            </p>
            <p
              className="text-ink/40 text-[9px] md:text-[10px] tracking-[0.28em] uppercase"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              Revival
            </p>
          </div>
        </div>

        {/* ── Supporting line ───────────────────── */}
        <div className="animate-fade-up delay-300 flex items-center justify-center gap-3 sm:gap-5 mt-3 mb-5">
          <div className="h-px w-8 sm:w-14 bg-ink/20" />
          <p
            className="text-ink/50 text-[10px] sm:text-xs tracking-[0.28em] uppercase"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            The First Annual Tattoo Convention for West Tennessee
          </p>
          <div className="h-px w-8 sm:w-14 bg-ink/20" />
        </div>

        {/* ── Description ───────────────────────── */}
        <p
          className="animate-fade-up delay-400 text-ink/68 text-base sm:text-[1.15rem] max-w-[30rem] mx-auto mb-7 leading-relaxed"
          style={{ fontFamily: "var(--font-garamond, serif)", fontStyle: "italic" }}
        >
          Experience three unforgettable days of talented tattoo artists,
          custom artwork, vendors, food, and the growing
          tattoo community of West Tennessee.
        </p>

        {/* ── Event details placard ─────────────── */}
        <div className="animate-fade-up delay-500 mb-8 flex justify-center">
          <div className="relative border border-ink/18 bg-cream/45 px-6 sm:px-10 py-4">
            {/* Corner marks */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gold/40" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gold/40" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gold/40" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gold/40" />

            <div className="flex flex-col sm:flex-row items-center sm:divide-x divide-ink/12 gap-0">
              {/* Date */}
              <div className="px-4 py-1 text-center">
                <p className="text-gold/60 text-[9px] tracking-[0.32em] uppercase mb-0.5"
                   style={{ fontFamily: "var(--font-special-elite, monospace)" }}>When</p>
                <p className="text-ink text-sm sm:text-base"
                   style={{ fontFamily: "var(--font-rye, serif)" }}>March 12–14, 2027</p>
              </div>
              {/* Ornament */}
              <div className="hidden sm:flex items-center px-3 text-gold/30 text-xs select-none">✦</div>
              <div className="sm:hidden w-20 h-px bg-ink/10 my-1" />
              {/* Venue */}
              <div className="px-4 py-1 text-center">
                <p className="text-gold/60 text-[9px] tracking-[0.32em] uppercase mb-0.5"
                   style={{ fontFamily: "var(--font-special-elite, monospace)" }}>Where</p>
                <p className="text-ink text-sm sm:text-base"
                   style={{ fontFamily: "var(--font-rye, serif)" }}>Carroll County TN Fairgrounds</p>
                <p className="text-ink/45 text-[10px] tracking-[0.18em] uppercase mt-0.5"
                   style={{ fontFamily: "var(--font-special-elite, monospace)" }}>Huntingdon, Tennessee</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── CTAs ──────────────────────────────── */}
        <div className="animate-fade-up delay-600 flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          {/* Primary */}
          <a
            href={vendorRegistrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 bg-crimson text-cream uppercase tracking-widest text-sm hover:bg-crimson-dark transition-all duration-200 active:scale-[0.97]"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            Register as a Vendor
          </a>
          {/* Secondary */}
          <a
            href={sponsorRegistrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 border-2 border-gold/70 text-ink/80 uppercase tracking-widest text-sm hover:border-gold hover:bg-gold/10 transition-all duration-200 active:scale-[0.97]"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            Become a Sponsor
          </a>
          {/* Tertiary */}
          <Link
            href="/event-info"
            className="w-full sm:w-auto px-8 py-4 border border-ink/25 text-ink/55 uppercase tracking-widest text-sm hover:border-ink/50 hover:text-ink/80 transition-all duration-200 active:scale-[0.97]"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            Learn More
          </Link>
        </div>

        {/* ── Presented by ──────────────────────── */}
        <p
          className="animate-fade-in delay-700 text-ink/35 text-[10px] tracking-[0.28em] uppercase"
          style={{ fontFamily: "var(--font-special-elite, monospace)" }}
        >
          Presented by Studio 45 Tattoos
        </p>
      </div>

      {/* ── Decorative rose corner accents ───────── */}
      <div className="absolute bottom-6 left-6 opacity-[0.15] pointer-events-none hidden sm:block">
        <RoseSilhouette />
      </div>
      <div
        className="absolute bottom-6 right-6 opacity-[0.15] pointer-events-none hidden sm:block"
        style={{ transform: "scaleX(-1)" }}
      >
        <RoseSilhouette />
      </div>
    </section>
  );
}

/* ── Sub-components ─────────────────────────────────── */

function CornerOrnament({ position }: { position: string }) {
  const isTop  = position.includes("top");
  const isLeft = position.includes("left");
  return (
    <div
      className={`absolute pointer-events-none select-none
        ${isTop  ? "top-3 sm:top-5"   : "bottom-3 sm:bottom-5"}
        ${isLeft ? "left-3 sm:left-5" : "right-3 sm:right-5"}`}
      style={{
        transform: `rotate(${isTop ? (isLeft ? 0 : 90) : isLeft ? 270 : 180}deg)`,
        color: "rgba(26,16,8,0.18)",
        fontSize: "26px",
        lineHeight: 1,
      }}
      aria-hidden="true"
    >
      ❧
    </div>
  );
}

function RoseSilhouette() {
  return (
    <svg viewBox="0 0 80 110" width="68" height="92" fill="#1A1008" aria-hidden="true">
      <path
        d="M40,95 C38,82 36,70 38,58"
        stroke="#2D4A1E" strokeWidth="2.5" fill="none" strokeLinecap="round"
      />
      <path d="M38,75 C32,70 26,66 24,58 C30,60 36,65 38,72 Z" />
      <path d="M39,65 C45,60 51,56 53,48 C47,50 42,55 39,62 Z" />
      <path d="M40,50 C30,44 24,36 26,28 C30,21 37,22 40,28 C43,22 50,21 54,28 C56,36 50,44 40,50 Z" />
      <path d="M40,46 C34,40 30,32 32,25 C35,20 38,22 40,26 C42,22 45,20 48,25 C50,32 46,40 40,46 Z" opacity="0.65"/>
    </svg>
  );
}
