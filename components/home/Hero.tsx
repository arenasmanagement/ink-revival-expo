"use client";

import Image from "next/image";
import Link from "next/link";
import { EVENT, REGISTRATION_URLS } from "@/lib/eventData";

const { vendorApplicationPath, artistApplicationPath } = REGISTRATION_URLS;

/* ══════════════════════════════════════════════════════════════════
   HERO — West TN Tattoo & Art Festival
   Design: festival poster energy, artwork-grounded color system
   The hero-expanded.png IS the source of truth for the palette.
   ══════════════════════════════════════════════════════════════════ */
export default function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: "clamp(600px, 95vh, 1000px)", backgroundColor: "#0E0804" }}
      aria-label="West TN Tattoo and Art Festival 2027 — Hero"
    >
      {/* Accessible heading hidden from visual display — artwork IS the identity */}
      <h1 className="sr-only">
        West TN Tattoo and Art Festival 2027 — West Tennessee&apos;s First Annual Tattoo &amp; Art
        Festival, March 12–14, Huntingdon TN
      </h1>

      {/* ── Background artwork ── */}
      <div className="absolute inset-0" style={{ zIndex: 1 }} aria-hidden="true">
        <Image
          src="/hero-expanded.png"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{
            objectFit:      "cover",
            objectPosition: "40% 52%",
            /* Amplify the existing colors rather than muting them */
            filter:         "saturate(1.15) contrast(1.05) brightness(0.88)",
          }}
        />
      </div>

      {/* ── Base vignette — darkens edges to create stage ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: `
            linear-gradient(0deg,   rgba(8,4,2,1) 0%, rgba(8,4,2,0.88) 9%, rgba(8,4,2,0.3) 22%, transparent 40%),
            linear-gradient(180deg, rgba(8,4,2,0.75) 0%, rgba(8,4,2,0.18) 8%, transparent 22%),
            linear-gradient(90deg,  rgba(8,4,2,0.72) 0%, rgba(8,4,2,0.3) 18%, rgba(8,4,2,0.08) 38%, transparent 55%),
            linear-gradient(270deg, rgba(8,4,2,0.55) 0%, rgba(8,4,2,0.1) 15%, transparent 32%)
          `,
        }}
        aria-hidden="true"
      />

      {/* ── Deeper shadow behind the text column ── */}
      <div
        className="absolute hidden sm:block pointer-events-none"
        style={{
          zIndex: 3,
          top:    0,
          left:   0,
          width:  "60%",
          height: "75%",
          background:
            "radial-gradient(ellipse 80% 85% at 22% 40%, rgba(4,2,1,0.5) 0%, rgba(4,2,1,0.22) 48%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════════════════════
          DESKTOP — (sm and up)
      ══════════════════════════════════════════════════════ */}

      {/* Desktop title block — sits in the sky */}
      <div
        className="absolute hidden sm:block"
        style={{
          zIndex:    10,
          top:       "clamp(32px, 8vh, 80px)",
          left:      "clamp(20px, 5vw, 80px)",
          maxWidth:  "clamp(340px, 52vw, 680px)",
        }}
        aria-hidden="true"
      >
        {/* Eyebrow */}
        <p
          className="animate-hero-in"
          style={{
            fontFamily:      "var(--font-special-elite, monospace)",
            fontSize:        "clamp(0.48rem, 0.78vw, 0.65rem)",
            letterSpacing:   "0.45em",
            textTransform:   "uppercase",
            color:           "rgba(224,168,64,0.78)",
            marginBottom:    "0.5em",
            animationDelay:  "0.1s",
            textShadow:      "0 1px 8px rgba(0,0,0,0.9)",
          }}
        >
          West Tennessee&rsquo;s First Annual
        </p>

        {/* Main festival title */}
        <p
          className="animate-hero-in"
          style={{
            fontFamily:     "var(--font-bebas-neue, Impact, sans-serif)",
            fontSize:       "clamp(3.5rem, 8.5vw, 7.8rem)",
            letterSpacing:  "0.04em",
            textTransform:  "uppercase",
            lineHeight:     0.88,
            color:          "#F5EDD8",
            marginBottom:   "0.18em",
            animationDelay: "0.18s",
            textShadow: `
              2px 3px 0 rgba(4,2,1,0.98),
              0 5px 18px rgba(0,0,0,0.92),
              0 12px 40px rgba(0,0,0,0.72),
              0 0 80px rgba(175,75,15,0.18)
            `,
          }}
        >
          Tattoo &amp;<br />Art Festival
        </p>

        {/* Accent line — sunset orange */}
        <div
          className="animate-hero-in"
          style={{
            height:         "2.5px",
            width:          "clamp(60px, 10vw, 140px)",
            background:     "#E07830",
            marginBottom:   "0.7em",
            animationDelay: "0.26s",
            boxShadow:      "0 0 12px rgba(224,120,48,0.4)",
          }}
          aria-hidden="true"
        />

        {/* Dates */}
        <p
          className="animate-hero-in"
          style={{
            fontFamily:     "var(--font-bebas-neue, Impact, sans-serif)",
            fontSize:       "clamp(1rem, 2.2vw, 1.8rem)",
            letterSpacing:  "0.1em",
            textTransform:  "uppercase",
            color:          "#E07830",
            marginBottom:   "0.2em",
            animationDelay: "0.3s",
            textShadow:     "0 2px 14px rgba(0,0,0,0.96), 0 6px 28px rgba(0,0,0,0.8)",
          }}
        >
          {EVENT.dates.display}
        </p>

        {/* Venue */}
        <p
          className="animate-hero-in"
          style={{
            fontFamily:     "var(--font-special-elite, monospace)",
            fontSize:       "clamp(0.44rem, 0.72vw, 0.6rem)",
            letterSpacing:  "0.3em",
            textTransform:  "uppercase",
            color:          "rgba(245,237,216,0.65)",
            animationDelay: "0.36s",
            textShadow:     "0 1px 10px rgba(0,0,0,0.98), 0 4px 20px rgba(0,0,0,0.85)",
          }}
        >
          {EVENT.venue.name}&nbsp;·&nbsp;{EVENT.venue.city}, {EVENT.venue.state}
        </p>
      </div>

      {/* Desktop CTAs — ground level */}
      <div
        className="absolute hidden sm:flex"
        style={{
          zIndex:        20,
          bottom:        "clamp(24px, 5vh, 56px)",
          left:          "clamp(20px, 5vw, 80px)",
          flexDirection: "row",
          flexWrap:      "wrap",
          gap:           "10px",
          alignItems:    "center",
        }}
      >
        {/* Primary — Tickets (disabled placeholder) */}
        <span
          className="animate-hero-in"
          style={{
            fontFamily:     "var(--font-bebas-neue, Impact, sans-serif)",
            fontSize:       "clamp(0.85rem, 1.15vw, 1rem)",
            letterSpacing:  "0.1em",
            textTransform:  "uppercase",
            color:          "rgba(245,237,216,0.35)",
            padding:        "0.55rem 1.4rem",
            border:         "1.5px solid rgba(245,237,216,0.12)",
            cursor:         "default",
            animationDelay: "0.44s",
            display:        "inline-flex",
            alignItems:     "center",
            gap:            "6px",
          }}
          aria-disabled="true"
        >
          <span style={{ fontSize: "0.55rem", color: "#E07830" }}>✦</span>
          Tickets Coming Soon
        </span>

        {/* Artist apply */}
        <Link
          href={artistApplicationPath}
          className="animate-hero-in transition-all duration-150 active:scale-95"
          style={{
            fontFamily:          "var(--font-bebas-neue, Impact, sans-serif)",
            fontSize:            "clamp(0.85rem, 1.15vw, 1rem)",
            letterSpacing:       "0.1em",
            textTransform:       "uppercase",
            backgroundColor:     "#E07830",
            color:               "#0E0804",
            padding:             "0.55rem 1.4rem",
            display:             "inline-flex",
            alignItems:          "center",
            animationDelay:      "0.5s",
          }}
        >
          Apply as Artist
        </Link>

        {/* Vendor apply */}
        <Link
          href={vendorApplicationPath}
          className="animate-hero-in transition-all duration-150 active:scale-95"
          style={{
            fontFamily:     "var(--font-bebas-neue, Impact, sans-serif)",
            fontSize:       "clamp(0.85rem, 1.15vw, 1rem)",
            letterSpacing:  "0.1em",
            textTransform:  "uppercase",
            backgroundColor: "transparent",
            color:           "rgba(245,237,216,0.8)",
            padding:         "0.55rem 1.4rem",
            border:          "1.5px solid rgba(61,136,120,0.6)",
            display:         "inline-flex",
            alignItems:      "center",
            animationDelay:  "0.54s",
          }}
        >
          Vendor Space
        </Link>
      </div>

      {/* ══════════════════════════════════════════════════════
          MOBILE — (below sm)
      ══════════════════════════════════════════════════════ */}

      {/* Mobile additional darkening */}
      <div
        className="sm:hidden absolute inset-0 pointer-events-none"
        style={{
          zIndex:     5,
          background: `
            linear-gradient(180deg,
              rgba(8,4,2,0.78) 0%,
              rgba(8,4,2,0.2) 30%,
              rgba(8,4,2,0.05) 55%,
              rgba(8,4,2,0.7) 78%,
              rgba(8,4,2,0.96) 100%
            )
          `,
        }}
        aria-hidden="true"
      />

      <div
        className="sm:hidden absolute inset-x-0 flex flex-col justify-between px-5"
        style={{ zIndex: 10, top: "5%", bottom: "5%" }}
        aria-hidden="true"
      >
        {/* Mobile title */}
        <div>
          <p
            style={{
              fontFamily:    "var(--font-special-elite, monospace)",
              fontSize:      "0.52rem",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color:         "rgba(224,168,64,0.75)",
              marginBottom:  "0.5em",
              textShadow:    "0 1px 8px rgba(0,0,0,0.9)",
            }}
          >
            West Tennessee&rsquo;s First Annual
          </p>
          <p
            style={{
              fontFamily:    "var(--font-bebas-neue, Impact, sans-serif)",
              fontSize:      "clamp(2.8rem, 14vw, 4.4rem)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              lineHeight:    0.88,
              color:         "#F5EDD8",
              marginBottom:  "0.25em",
              textShadow:    "2px 3px 0 rgba(4,2,1,0.98), 0 6px 20px rgba(0,0,0,0.9)",
            }}
          >
            Tattoo &amp;<br />Art Festival
          </p>
          <div
            style={{
              height:       "2.5px",
              width:        "60px",
              background:   "#E07830",
              marginBottom: "0.6em",
            }}
            aria-hidden="true"
          />
          <p
            style={{
              fontFamily:    "var(--font-bebas-neue, Impact, sans-serif)",
              fontSize:      "clamp(1rem, 5.5vw, 1.45rem)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color:         "#E07830",
              marginBottom:  "0.2em",
              textShadow:    "0 2px 12px rgba(0,0,0,0.96)",
            }}
          >
            {EVENT.dates.display}
          </p>
          <p
            style={{
              fontFamily:    "var(--font-special-elite, monospace)",
              fontSize:      "0.48rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color:         "rgba(245,237,216,0.45)",
            }}
          >
            {EVENT.venue.city}, {EVENT.venue.state}
          </p>
        </div>

        {/* Mobile CTAs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span
            style={{
              fontFamily:    "var(--font-bebas-neue, Impact, sans-serif)",
              fontSize:      "0.85rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color:         "rgba(245,237,216,0.28)",
              borderBottom:  "1px solid rgba(245,237,216,0.08)",
              paddingBottom: "6px",
              display:       "flex",
              alignItems:    "center",
              gap:           "6px",
            }}
          >
            <span style={{ fontSize: "0.45rem", color: "#E07830" }}>✦</span>
            Tickets Coming Soon
          </span>
          <Link
            href={artistApplicationPath}
            style={{
              fontFamily:      "var(--font-bebas-neue, Impact, sans-serif)",
              fontSize:        "1rem",
              letterSpacing:   "0.1em",
              textTransform:   "uppercase",
              backgroundColor: "#E07830",
              color:           "#0E0804",
              padding:         "0.8rem 1rem",
              textAlign:       "center",
              display:         "block",
            }}
          >
            Apply as Artist
          </Link>
          <Link
            href={vendorApplicationPath}
            style={{
              fontFamily:     "var(--font-bebas-neue, Impact, sans-serif)",
              fontSize:       "1rem",
              letterSpacing:  "0.1em",
              textTransform:  "uppercase",
              backgroundColor: "transparent",
              color:           "rgba(245,237,216,0.75)",
              padding:         "0.8rem 1rem",
              border:          "1.5px solid rgba(61,136,120,0.5)",
              textAlign:       "center",
              display:         "block",
            }}
          >
            Vendor Space
          </Link>
        </div>
      </div>
    </section>
  );
}
