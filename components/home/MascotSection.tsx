import Image from "next/image";

/*
 * MascotSection — "Spirit of the Expo"
 *
 * portrait-ink.png is 1122×1402 RGBA — the complete official mascot portrait:
 * oval gold frame, orange/magenta sunset gradient, frog full scene, expo banner.
 * Transparent outside the oval shape.
 *
 * Design intent:
 *   • No redundant frame — the artwork already has a gold oval border
 *   • overflow: visible on the image container so hat/hand can break outside
 *   • Single warm amber aura behind the artwork — it glows into the dark section
 *   • Drop shadow matches the warm amber tones of the artwork
 *   • Feels like a collectible trading card or character reveal, not an image in a box
 */

function AnnualTracker() {
  const years = [
    { year: "2027", label: "Fishing", active: true },
    { year: "2028", label: "Tattooing", active: false },
    { year: "2029", label: "Riding", active: false },
  ];

  return (
    <div className="flex items-center justify-center gap-0 mt-10 lg:mt-0">
      {years.map((item, i) => (
        <div key={item.year} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5 px-4">
            <div
              style={{
                width: "36px",
                height: "36px",
                border: item.active
                  ? "1.5px solid #C4902A"
                  : "1.5px solid rgba(196,144,42,0.2)",
                background: item.active
                  ? "rgba(196,144,42,0.1)"
                  : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  color: item.active ? "#C4902A" : "rgba(196,144,42,0.2)",
                  fontSize: "14px",
                  lineHeight: 1,
                }}
              >
                {item.active ? "★" : "○"}
              </span>
            </div>
            <p
              className="text-[8px] tracking-[0.2em] uppercase"
              style={{
                fontFamily: "var(--font-special-elite, monospace)",
                color: item.active ? "#C4902A" : "rgba(196,144,42,0.25)",
              }}
            >
              {item.year}
            </p>
            <p
              className="text-[8px]"
              style={{
                fontFamily: "var(--font-garamond, serif)",
                fontStyle: "italic",
                color: item.active
                  ? "rgba(245,230,200,0.45)"
                  : "rgba(245,230,200,0.15)",
              }}
            >
              {item.label}
            </p>
          </div>
          {i < years.length - 1 && (
            <div
              style={{
                width: "24px",
                height: "1px",
                background:
                  "linear-gradient(90deg, rgba(196,144,42,0.3), rgba(196,144,42,0.1))",
                flexShrink: 0,
              }}
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function MascotSection() {
  return (
    <section
      className="relative overflow-hidden py-20 sm:py-28"
      style={{
        background:
          "linear-gradient(180deg, #0E0702 0%, #160C04 35%, #1A0E05 65%, #120802 100%)",
      }}
      aria-labelledby="mascot-heading"
    >
      {/* Gold accent lines top/bottom */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: "2px",
          background:
            "linear-gradient(90deg, transparent, #C4902A 25%, #C4902A 75%, transparent)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "2px",
          background:
            "linear-gradient(90deg, transparent, #C4902A 25%, #C4902A 75%, transparent)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center">

          {/* ── LEFT: Portrait showcase ── */}
          <div className="flex flex-col items-center">

            {/*
              Artwork container — overflow:visible so the frog's hat and raised
              hand can break slightly outside the bounds, giving depth and life
              instead of a clipped box presentation.

              The amber aura behind the oval:
                • Warm inner glow matching the artwork's orange tones
                • Wide outer bloom that bleeds into the dark section bg
                • No hard edges — the artwork appears to emit light
            */}
            <div
              className="relative w-full flex items-center justify-center"
              style={{
                maxWidth: "500px",
                margin: "0 auto",
                overflow: "visible",
              }}
            >
              {/* Primary warm aura — centered on the oval, amber/burnt-orange */}
              <div
                className="absolute pointer-events-none"
                style={{
                  inset: "-60px",
                  background:
                    "radial-gradient(ellipse 68% 72% at 50% 44%, rgba(210,100,12,0.28) 0%, rgba(175,70,8,0.14) 38%, rgba(120,45,5,0.06) 62%, transparent 80%)",
                  zIndex: 0,
                }}
                aria-hidden="true"
              />

              {/* Secondary wide bloom — cooler amber, very faint halo */}
              <div
                className="absolute pointer-events-none"
                style={{
                  inset: "-100px",
                  background:
                    "radial-gradient(ellipse 75% 65% at 50% 42%, rgba(140,60,8,0.10) 0%, rgba(90,35,5,0.04) 55%, transparent 75%)",
                  zIndex: 0,
                }}
                aria-hidden="true"
              />

              {/*
                Portrait image
                • drop-shadow: two layers — dark base + warm amber color glow
                  so the artwork feels lit from within rather than pasted on
                • animate-mascot-float: subtle float loop defined in globals.css
                • overflow:visible inherited — hat/hand can break the parent edge
              */}
              <div className="relative z-10 w-full animate-mascot-float" style={{ overflow: "visible" }}>
                <Image
                  src="/portrait-ink.png"
                  alt="West TN Ink Revival Expo official mascot portrait — 2027"
                  width={1122}
                  height={1402}
                  sizes="(max-width: 768px) 92vw, (max-width: 1024px) 48vw, 500px"
                  className="w-full h-auto"
                  style={{
                    filter:
                      "drop-shadow(0 20px 55px rgba(0,0,0,0.72)) drop-shadow(0 0 35px rgba(195,85,10,0.22))",
                    display: "block",
                  }}
                  priority
                />
              </div>
            </div>

            {/* Annual tracker */}
            <div className="mt-8 w-full flex justify-center">
              <div>
                <p
                  className="text-gold/35 text-[8px] tracking-[0.35em] uppercase text-center mb-4"
                  style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                >
                  Annual Mascot Collection
                </p>
                <AnnualTracker />
              </div>
            </div>
          </div>

          {/* ── RIGHT: Character introduction ── */}
          <div className="text-center lg:text-left">

            <p
              className="text-gold/55 text-[10px] tracking-[0.4em] uppercase mb-4"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              ★ Meet Our Mascot ★
            </p>

            <h2
              id="mascot-heading"
              className="text-cream leading-tight mb-2"
              style={{
                fontFamily: "var(--font-rye, 'Rye', serif)",
                fontSize: "clamp(1.8rem, 3.8vw, 2.8rem)",
              }}
            >
              The Spirit of the Expo
            </h2>

            <p
              className="text-gold/50 mb-6"
              style={{
                fontFamily: "var(--font-special-elite, monospace)",
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
              }}
            >
              Name Reveal Coming Soon
            </p>

            <div
              className="mb-8 mx-auto lg:mx-0"
              style={{
                height: "1px",
                width: "80px",
                background: "linear-gradient(90deg, #C4902A, transparent)",
              }}
              aria-hidden="true"
            />

            <div
              className="text-cream/60 leading-relaxed mb-8 space-y-4"
              style={{ fontFamily: "var(--font-garamond, serif)", fontSize: "1.05rem" }}
            >
              <p>
                Every great event has a soul. Ours has a fishing rod and a full sleeve.
              </p>
              <p>
                He showed up at the first expo and never left. Equal parts Tennessee
                swamp creature and tattoo devotee, he&rsquo;s been out here on the pond
                before the ink even dried — waiting for the revival to begin.
              </p>
              <p>
                Each year, a new scene. A new adventure. The same frog.
              </p>
            </div>

            <div
              className="border border-white/8 p-6 mb-8"
              style={{ background: "rgba(255,255,255,0.025)" }}
            >
              <p
                className="text-gold/40 text-[9px] tracking-[0.3em] uppercase mb-4"
                style={{ fontFamily: "var(--font-special-elite, monospace)" }}
              >
                Character File — 2027
              </p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                {[
                  { label: "Name", value: "TBA" },
                  { label: "Year One Scene", value: "Pond Side" },
                  { label: "Tattoo Count", value: "Countless" },
                  { label: "Catch of the Day", value: "A crowd" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p
                      className="text-gold/40 text-[9px] tracking-[0.2em] uppercase mb-0.5"
                      style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                    >
                      {label}
                    </p>
                    <p
                      className="text-cream/55"
                      style={{
                        fontFamily: "var(--font-garamond, serif)",
                        fontStyle: "italic",
                      }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p
              className="text-cream/22 text-xs leading-relaxed"
              style={{ fontFamily: "var(--font-garamond, serif)", fontStyle: "italic" }}
            >
              Collectible prints, pins, and merchandise coming in 2027. Stay tuned.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
