"use client";

import Image from "next/image";
import { EVENT, REGISTRATION_URLS } from "@/lib/eventData";

const { vendorRegistrationUrl, sponsorRegistrationUrl } = REGISTRATION_URLS;

/* ─── Foreground vegetation — depth layer in front of the composition ────── */
function ForegroundLeft() {
  return (
    <svg
      viewBox="0 0 240 360"
      className="absolute pointer-events-none"
      style={{ bottom: 0, left: 0, width: "240px", height: "360px", zIndex: 15 }}
      aria-hidden="true"
    >
      <path d="M20,360 Q28,300 16,240" stroke="#080E03" strokeWidth="3" fill="none" opacity="0.85" />
      <path d="M38,360 Q50,315 40,255" stroke="#080E03" strokeWidth="2.5" fill="none" opacity="0.8" />
      <path d="M8,360 Q12,335 6,290" stroke="#080E03" strokeWidth="2" fill="none" opacity="0.75" />
      <path d="M55,360 Q65,330 58,285" stroke="#080E03" strokeWidth="2" fill="none" opacity="0.7" />
      <line x1="72" y1="360" x2="68" y2="185" stroke="#0C0B05" strokeWidth="3.5" opacity="0.88" />
      <ellipse cx="68" cy="178" rx="8" ry="24" fill="#18100A" opacity="0.9" />
      <line x1="96" y1="360" x2="99" y2="205" stroke="#0C0B05" strokeWidth="3" opacity="0.82" />
      <ellipse cx="99" cy="198" rx="7" ry="20" fill="#18100A" opacity="0.85" />
      <line x1="44" y1="360" x2="41" y2="215" stroke="#0C0B05" strokeWidth="2.5" opacity="0.78" />
      <ellipse cx="41" cy="209" rx="6" ry="18" fill="#18100A" opacity="0.8" />
      <path d="M0,352 Q80,340 180,348 L240,345 L240,360 L0,360 Z" fill="#050402" opacity="0.72" />
    </svg>
  );
}

function ForegroundRight() {
  return (
    <svg
      viewBox="0 0 160 300"
      className="absolute pointer-events-none"
      style={{ bottom: 0, right: 0, width: "160px", height: "300px", zIndex: 15 }}
      aria-hidden="true"
    >
      <path d="M142,300 Q138,258 146,215" stroke="#080E03" strokeWidth="2.5" fill="none" opacity="0.8" />
      <path d="M122,300 Q118,268 126,232" stroke="#080E03" strokeWidth="2" fill="none" opacity="0.72" />
      <line x1="152" y1="300" x2="150" y2="155" stroke="#0C0B05" strokeWidth="3" opacity="0.85" />
      <ellipse cx="150" cy="148" rx="7" ry="21" fill="#18100A" opacity="0.88" />
      <line x1="136" y1="300" x2="139" y2="175" stroke="#0C0B05" strokeWidth="2.5" opacity="0.78" />
      <ellipse cx="139" cy="169" rx="6" ry="18" fill="#18100A" opacity="0.82" />
      <path d="M0,295 Q60,284 120,290 L160,288 L160,300 L0,300 Z" fill="#050402" opacity="0.68" />
    </svg>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function Hero() {
  const monoFont: React.CSSProperties = { fontFamily: "var(--font-special-elite, monospace)" };
  const ryeFont: React.CSSProperties = { fontFamily: "var(--font-rye, 'Rye', serif)" };

  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: "clamp(580px, 94vh, 980px)", background: "#080301" }}
      aria-label="Hero — West TN Ink Revival Expo 2027"
    >
      <h1 className="sr-only">
        West TN Ink Revival Expo 2027 — West Tennessee Tattoo Convention, March 12–14, Huntingdon TN
      </h1>

      {/* ── Scene artwork ── */}
      <div className="absolute inset-0" style={{ zIndex: 1 }} aria-hidden="true">
        <Image
          src="/hero-expanded.png"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "38% 55%",
            filter: "saturate(0.72) contrast(0.94)",
          }}
        />
      </div>

      {/* ── Edge blending overlays ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, background: "linear-gradient(0deg, #080301 0%, rgba(8,3,1,0.85) 8%, rgba(8,3,1,0.3) 20%, transparent 36%)" }} aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, background: "linear-gradient(180deg, rgba(8,3,1,0.7) 0%, rgba(8,3,1,0.2) 6%, transparent 16%)" }} aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, background: "linear-gradient(90deg, rgba(8,3,1,0.62) 0%, rgba(8,3,1,0.38) 14%, rgba(8,3,1,0.18) 32%, rgba(8,3,1,0.06) 46%, transparent 58%)" }} aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, background: "linear-gradient(270deg, rgba(8,3,1,0.58) 0%, rgba(8,3,1,0.14) 12%, transparent 30%)" }} aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, background: "radial-gradient(ellipse 85% 78% at 44% 50%, transparent 22%, rgba(8,3,1,0.15) 52%, rgba(8,3,1,0.5) 78%, rgba(8,3,1,0.82) 100%)" }} aria-hidden="true" />

      {/* ── Atmospheric haze behind the title ── */}
      {/*
        Two-layer approach:
        Layer 1 (z=4): Wide warm glow — the sunset sky naturally darkening
          behind the lettering zone. Barely perceptible as a shape.
        Layer 2 (z=5): Tighter localized shadow directly behind the text column.
          Mimics a cloud shadow or a slightly deeper patch of evening sky —
          invisible as a UI element, but lifts text contrast meaningfully.
      */}
      <div
        className="absolute pointer-events-none"
        style={{
          zIndex: 4,
          top: 0,
          left: 0,
          right: 0,
          height: "55%",
          background: "radial-gradient(ellipse 65% 82% at 30% 42%, rgba(8,3,1,0.58) 0%, rgba(8,3,1,0.22) 42%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      {/* Localized text-column shadow — sky behind letters is slightly deeper */}
      <div
        className="absolute hidden sm:block pointer-events-none"
        style={{
          zIndex: 5,
          top: 0,
          left: 0,
          width: "58%",
          height: "72%",
          background: "radial-gradient(ellipse 72% 80% at 26% 44%, rgba(4,2,1,0.42) 0%, rgba(4,2,1,0.22) 46%, rgba(4,2,1,0.08) 68%, transparent 82%)",
        }}
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════════════════════
          DESKTOP — title in the sky, CTAs near the ground
          Both hidden on mobile to avoid overlap.
      ══════════════════════════════════════════════════════ */}

      {/* Desktop: title zone */}
      <div
        className="absolute hidden sm:block pointer-events-none"
        style={{ zIndex: 6, top: "7%", left: "5%", maxWidth: "620px" }}
      >
        <p
          className="animate-hero-in"
          style={{ ...monoFont, fontSize: "clamp(0.5rem, 0.85vw, 0.68rem)", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(245,222,162,0.82)", marginBottom: "0.55em", animationDelay: "0.1s", textShadow: "0 1px 0 rgba(0,0,0,0.95), 0 2px 10px rgba(0,0,0,0.7), 0 -1px 10px rgba(210,130,20,0.18)" }}
        >
          West Tennessee&rsquo;s First Annual
        </p>

        {/* Main title — floats in the actual sky of the illustration */}
        <p
          className="animate-hero-in"
          style={{
            ...ryeFont,
            fontSize: "clamp(3rem, 7.2vw, 6.2rem)",
            lineHeight: 0.88,
            color: "#F5E6C8",
            marginBottom: "0.2em",
            animationDelay: "0.2s",
            textShadow: `
              0 0 50px rgba(195,95,8,0.28),
              0 0 100px rgba(175,75,6,0.15),
              1px 2px 0 rgba(4,2,1,0.98),
              0 4px 16px rgba(0,0,0,0.95),
              0 8px 32px rgba(0,0,0,0.75),
              0 18px 60px rgba(0,0,0,0.4)
            `,
          }}
        >
          Ink&nbsp;Revival<br />Expo
        </p>

        {/* Gold horizon rule */}
        <div
          className="animate-hero-in"
          style={{ height: "1.5px", width: "clamp(70px, 13vw, 165px)", background: "linear-gradient(90deg, rgba(196,144,42,0.78) 0%, rgba(196,144,42,0.36) 60%, transparent 100%)", marginBottom: "0.85em", boxShadow: "0 0 7px rgba(196,144,42,0.28)", animationDelay: "0.28s" }}
          aria-hidden="true"
        />

        <p
          className="animate-hero-in"
          style={{ ...ryeFont, fontSize: "clamp(0.88rem, 1.75vw, 1.42rem)", color: "rgba(218,165,58,0.98)", marginBottom: "0.28em", animationDelay: "0.32s", textShadow: "0 0 18px rgba(0,0,0,0.98), 0 2px 14px rgba(0,0,0,0.98), 0 4px 28px rgba(0,0,0,0.88), 0 8px 40px rgba(0,0,0,0.65)" }}
        >
          {EVENT.dates.display}
        </p>

        <p
          className="animate-hero-in"
          style={{ ...monoFont, fontSize: "clamp(0.48rem, 0.8vw, 0.64rem)", letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(248,236,210,0.88)", animationDelay: "0.38s", textShadow: "0 0 12px rgba(0,0,0,0.98), 0 1px 0 rgba(0,0,0,0.98), 0 2px 10px rgba(0,0,0,0.95), 0 4px 20px rgba(0,0,0,0.85), 0 8px 32px rgba(0,0,0,0.6)" }}
        >
          {EVENT.venue.name}&nbsp;·&nbsp;{EVENT.venue.city},&nbsp;{EVENT.venue.state}
        </p>
      </div>

      {/* Desktop: CTA zone — bottom of scene, ground level */}
      <div
        className="absolute hidden sm:flex"
        style={{ zIndex: 20, bottom: "clamp(28px, 5.5vh, 56px)", left: "5%", flexDirection: "row", flexWrap: "wrap", gap: "12px", alignItems: "center" }}
      >
        <span
          className="animate-hero-in"
          style={{ ...monoFont, fontSize: "clamp(0.56rem, 0.86vw, 0.68rem)", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(245,230,200,0.38)", paddingBottom: "4px", borderBottom: "1px solid rgba(245,230,200,0.14)", cursor: "default", display: "inline-flex", animationDelay: "0.48s", textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}
          aria-disabled="true"
          aria-label="Ticket sales not yet open"
        >
          ✦ Tickets Coming Soon
        </span>

        <a
          href={vendorRegistrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="animate-hero-in transition-all duration-200 active:scale-95"
          style={{ ...monoFont, fontSize: "clamp(0.56rem, 0.86vw, 0.68rem)", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(245,230,200,0.9)", padding: "7px 18px", border: "1px solid rgba(122,23,20,0.72)", background: "rgba(122,23,20,0.52)", backdropFilter: "blur(3px)", boxShadow: "0 2px 16px rgba(0,0,0,0.52)", display: "inline-flex", animationDelay: "0.52s" }}
        >
          Become a Vendor
        </a>

        <a
          href={sponsorRegistrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="animate-hero-in transition-all duration-200 active:scale-95"
          style={{ ...monoFont, fontSize: "clamp(0.56rem, 0.86vw, 0.68rem)", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(212,160,55,0.88)", padding: "7px 18px", border: "1px solid rgba(196,144,42,0.35)", backdropFilter: "blur(3px)", display: "inline-flex", animationDelay: "0.56s", textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}
        >
          Become a Sponsor
        </a>
      </div>

      {/* Desktop: foreground vegetation — depth layer in front of scene */}
      <div className="hidden sm:block">
        <ForegroundLeft />
        <ForegroundRight />
      </div>

      {/* ══════════════════════════════════════════════════════
          MOBILE — stacked natural layout
      ══════════════════════════════════════════════════════ */}

      {/* Mobile vignette */}
      <div
        className="sm:hidden absolute inset-0 pointer-events-none"
        style={{ zIndex: 5, background: "linear-gradient(180deg, rgba(8,3,1,0.72) 0%, rgba(8,3,1,0.22) 28%, rgba(8,3,1,0.08) 55%, rgba(8,3,1,0.72) 80%, rgba(8,3,1,0.94) 100%)" }}
        aria-hidden="true"
      />

      <div
        className="sm:hidden absolute inset-x-0 flex flex-col justify-between px-5"
        style={{ zIndex: 10, top: "7%", bottom: "6%" }}
      >
        {/* Title */}
        <div>
          <p style={{ ...monoFont, fontSize: "0.55rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(245,222,162,0.82)", marginBottom: "0.5em", textShadow: "0 1px 0 rgba(0,0,0,0.95), 0 2px 10px rgba(0,0,0,0.75)" }}>
            West Tennessee&rsquo;s First Annual
          </p>
          <p style={{ ...ryeFont, fontSize: "clamp(2.4rem, 12.5vw, 3.6rem)", lineHeight: 0.9, color: "#F5E6C8", textShadow: "0 0 40px rgba(195,95,8,0.28), 2px 3px 0 rgba(0,0,0,0.96), 0 6px 20px rgba(0,0,0,0.82)", marginBottom: "0.35em" }}>
            Ink Revival<br />Expo
          </p>
          <div style={{ height: "1.5px", width: "65px", background: "linear-gradient(90deg, rgba(196,144,42,0.75), transparent)", marginBottom: "0.65em" }} aria-hidden="true" />
          <p style={{ ...ryeFont, fontSize: "clamp(0.82rem, 4.2vw, 1.08rem)", color: "rgba(196,144,42,0.85)", textShadow: "0 2px 10px rgba(0,0,0,0.96)", marginBottom: "0.22em" }}>
            {EVENT.dates.display}
          </p>
          <p style={{ ...monoFont, fontSize: "0.5rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(245,232,205,0.56)", textShadow: "0 1px 0 rgba(0,0,0,0.95), 0 2px 10px rgba(0,0,0,0.85)" }}>
            {EVENT.venue.city}, {EVENT.venue.state}
          </p>
        </div>

        {/* Mobile CTAs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ ...monoFont, fontSize: "0.56rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(245,230,200,0.26)", paddingBottom: "3px", borderBottom: "1px solid rgba(245,230,200,0.1)", display: "inline-block" }}>
            ✦ Tickets Coming Soon
          </span>
          <a
            href={vendorRegistrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...monoFont, fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(245,230,200,0.9)", padding: "9px 16px", border: "1px solid rgba(122,23,20,0.72)", background: "rgba(122,23,20,0.52)", textAlign: "center", display: "block" }}
          >
            Become a Vendor
          </a>
          <a
            href={sponsorRegistrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...monoFont, fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(212,160,55,0.88)", padding: "9px 16px", border: "1px solid rgba(196,144,42,0.35)", textAlign: "center", display: "block" }}
          >
            Become a Sponsor
          </a>
        </div>
      </div>
    </section>
  );
}
