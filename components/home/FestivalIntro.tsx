"use client";
/* ── Festival Introduction Section ──────────────────────────────────────────
   SECTION 2 — Cream / warm paper background.
   What this festival IS + live countdown to opening day.
   ─────────────────────────────────────────────────────────────────────────── */
import { useState, useEffect } from "react";

// ─── FESTIVAL COUNTDOWN CONFIGURATION ────────────────────────────────────────
//
// Target: Start of March 12, 2027 in America/Chicago timezone
//
// Timezone math:
//   DST in Chicago 2027 → springs forward Sunday March 8, 2027
//   Therefore March 12, 2027 is in CDT (Central Daylight Time = UTC−5)
//   Midnight CDT on March 12 = 2027-03-12T05:00:00Z
//
// TO UPDATE when organizers confirm an official opening time:
//   9:00 AM CDT  → "2027-03-12T14:00:00Z"
//   10:00 AM CDT → "2027-03-12T15:00:00Z"
//   Noon CDT     → "2027-03-12T17:00:00Z"
//
const FESTIVAL_TARGET_UTC = "2027-03-12T05:00:00Z";
//
// ─────────────────────────────────────────────────────────────────────────────

type TimeLeft = {
  days:    number;
  hours:   number;
  minutes: number;
  seconds: number;
};

function computeTimeLeft(): TimeLeft {
  // Always recalculate from Date.now() — recovers correctly after tab suspension
  const diff = Math.max(0, new Date(FESTIVAL_TARGET_UTC).getTime() - Date.now());
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff %  3_600_000) /    60_000),
    seconds: Math.floor((diff %     60_000) /     1_000),
  };
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

const CARDS = [
  { key: "days",    label: "Days",    color: "#E07830" },
  { key: "hours",   label: "Hours",   color: "#3D8878" },
  { key: "minutes", label: "Minutes", color: "#C89030" },
  { key: "seconds", label: "Seconds", color: "#CC3578" },
] as const;

export default function FestivalIntro() {
  // null = not yet mounted → prevents SSR/client hydration mismatch
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [arrived,  setArrived]  = useState(false);

  useEffect(() => {
    const tick = () => {
      const tl = computeTimeLeft();
      setTimeLeft(tl);
      setArrived(tl.days === 0 && tl.hours === 0 && tl.minutes === 0 && tl.seconds === 0);
    };
    tick(); // Immediate first calculation
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, []);

  // Values shown in cards. Pre-mount: placeholder dashes that match digit width.
  const display = timeLeft
    ? {
        days:    String(timeLeft.days),
        hours:   pad2(timeLeft.hours),
        minutes: pad2(timeLeft.minutes),
        seconds: pad2(timeLeft.seconds),
      }
    : { days: "—", hours: "——", minutes: "——", seconds: "——" };

  return (
    <section
      style={{ backgroundColor: "#F5EDD8", color: "#1A1008" }}
      aria-label="About the Festival"
    >
      {/*
        Screen-reader accessible description — static, never live-announced.
        The countdown grid is aria-hidden so seconds don't interrupt AT users.
      */}
      <p className="sr-only">
        West TN Tattoo and Art Festival opens March 12, 2027 in Huntingdon,
        Tennessee at the Carroll County TN Fairgrounds.
      </p>

      <div className="container-festival py-16 sm:py-20 lg:py-24">

        {/* Eyebrow */}
        <p className="eyebrow eyebrow-ink-dim text-center mb-2">
          About the Event
        </p>

        {/* Headline */}
        <h2
          className="text-center mb-8"
          style={{
            fontFamily:    "var(--font-bebas-neue, Impact, sans-serif)",
            fontSize:      "clamp(2.6rem, 6.5vw, 5.5rem)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            lineHeight:    0.88,
            color:         "#1A1008",
          }}
        >
          West Tennessee&apos;s<br />
          <span style={{ color: "#E07830" }}>First Annual</span><br />
          Tattoo &amp; Art Festival
        </h2>

        {/* Intro copy — confirmed programming only */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p
            style={{
              fontFamily:   "var(--font-garamond, serif)",
              fontSize:     "clamp(1.05rem, 1.5vw, 1.2rem)",
              lineHeight:   1.75,
              color:        "rgba(26,16,8,0.75)",
              marginBottom: "1em",
            }}
          >
            Three days of tattoo artistry, original art, tattoo competitions, a classic car show,
            craft vendors, and food trucks — at the Carroll County TN Fairgrounds in Huntingdon.
            March 12–14, 2027.
          </p>
          <p
            style={{
              fontFamily: "var(--font-garamond, serif)",
              fontSize:   "clamp(0.95rem, 1.3vw, 1.05rem)",
              lineHeight: 1.7,
              color:      "rgba(26,16,8,0.5)",
              fontStyle:  "italic",
            }}
          >
            Bringing ink culture, handmade art, and West Tennessee community together for the first time.
          </p>
        </div>

        {/* Divider */}
        <div className="divider-ink mx-auto max-w-xs mb-8" style={{ opacity: 0.2 }} />

        {/* Countdown label */}
        <p
          className="text-center mb-8"
          style={{
            fontFamily:    "var(--font-special-elite, monospace)",
            fontSize:      "0.58rem",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color:         "rgba(26,16,8,0.35)",
          }}
          aria-hidden="true"
        >
          ★&nbsp;&nbsp;Until the Festival Begins&nbsp;&nbsp;★
        </p>

        {/* ── Countdown or Arrived state ── */}
        {arrived ? (
          // Festival has started — event-state: HAPPENING NOW
          // Future: add daily-hours data to distinguish HAPPENING NOW vs ENDED
          <div
            className="text-center py-4"
            role="status"
            aria-label="The West TN Tattoo and Art Festival is happening now"
          >
            <div
              style={{
                fontFamily:    "var(--font-bebas-neue, Impact, sans-serif)",
                fontSize:      "clamp(2.2rem, 7vw, 4.5rem)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                lineHeight:    0.92,
                color:         "#E07830",
                marginBottom:  "0.6rem",
              }}
            >
              West TN Tattoo &amp;<br />Art Festival
            </div>
            <div
              style={{
                fontFamily:    "var(--font-special-elite, monospace)",
                fontSize:      "0.65rem",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color:         "#3D8878",
              }}
            >
              ★&nbsp;&nbsp;Is Happening Now&nbsp;&nbsp;★
            </div>
          </div>
        ) : (
          /*
           * Countdown grid
           * aria-hidden — screen readers rely on the sr-only text above.
           * Seconds update live without triggering AT announcements.
           * grid-cols-2 on mobile (2×2), lg:grid-cols-4 on desktop (1 row of 4).
           */
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto"
            aria-hidden="true"
          >
            {CARDS.map((card) => (
              <div
                key={card.key}
                className="text-center"
                style={{
                  padding:         "1.5rem 1rem",
                  borderTop:       `3px solid ${card.color}`,
                  backgroundColor: "rgba(26,16,8,0.04)",
                }}
              >
                {/* Large countdown number */}
                <div
                  className="stat-number"
                  style={{
                    color:              card.color,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {display[card.key]}
                </div>

                {/* Unit label */}
                <div
                  style={{
                    fontFamily:    "var(--font-special-elite, monospace)",
                    fontSize:      "0.55rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color:         "rgba(26,16,8,0.5)",
                    marginTop:     "0.4em",
                  }}
                >
                  {card.label}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
