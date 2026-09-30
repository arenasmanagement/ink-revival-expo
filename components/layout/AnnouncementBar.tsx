/* ── Announcement Bar ────────────────────────────────────────────────────────
   Scrolling ticker in sunset orange — site-wide, above the navbar.
   Matches the new design system: teal-ink bg, sunset orange text.
   ─────────────────────────────────────────────────────────────────────────── */

export default function AnnouncementBar() {
  const items = [
    "West TN Tattoo & Art Festival",
    "March 12–14, 2027",
    "Carroll County Fairgrounds · Huntingdon, TN",
    "35 Artist Booths",
    "35 Vendor Spaces",
    "75 Car Show Vehicles",
    "10 Food Truck Spots",
    "Tickets: Fri $15 · Sat $20 · Sun $15 · Weekend $40",
    "Kids 12 & Under FREE",
  ];

  const tickerText = items.join("  ✦  ") + "  ✦  ";

  return (
    <div
      className="overflow-hidden relative z-50"
      style={{
        backgroundColor: "#0E2820",
        borderBottom: "1px solid rgba(61,136,120,0.3)",
      }}
      aria-label="Festival announcement ticker"
    >
      <div
        className="ticker-animate py-1.5"
        aria-hidden="true"
      >
        {/* Two copies side-by-side so the scroll is seamless */}
        <span
          style={{
            fontFamily: "var(--font-special-elite, monospace)",
            fontSize: "0.6rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#E07830",
            paddingRight: "4rem",
            display: "inline-block",
            flexShrink: 0,
          }}
        >
          {tickerText}
        </span>
        <span
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-special-elite, monospace)",
            fontSize: "0.6rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#E07830",
            paddingRight: "4rem",
            display: "inline-block",
            flexShrink: 0,
          }}
        >
          {tickerText}
        </span>
      </div>

      {/* Screen reader text */}
      <p className="sr-only">
        West TN Tattoo and Art Festival — March 12–14, 2027 · Huntingdon, Tennessee — Tickets: Fri
        $15, Sat $20, Sun $15, Weekend Pass $40, Children 12 &amp; Under Free
      </p>
    </div>
  );
}
