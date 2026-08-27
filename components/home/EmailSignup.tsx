"use client";

import Image from "next/image";

/*
 * ─── POND ENVIRONMENT — three-layer depth system ─────────────────────────
 *
 * Render order (back → front):
 *   1. BackgroundReeds  (z=1) — lighter reeds behind the frog
 *   2. FrogFigure       (z=2) — frog.png full-body transparent PNG
 *                               CSS mask fades his feet into the gold ground
 *                               Reeds cover his lower body; upper body visible
 *   3. ForegroundReeds  (z=3) — dark reeds covering boots/shins/lower pants
 *
 * Animation-ready class names:
 *   .frog-env__bg-reeds  → future sway
 *   .frog-env__frog      → breathe, sway, bob
 *   .frog-env__fg-reeds  → sway (offset phase)
 *   .frog-env__dragonfly → fly-across
 * ─────────────────────────────────────────────────────────────────────────
 */

function BackgroundReeds() {
  return (
    <svg
      viewBox="0 0 310 230"
      className="absolute pointer-events-none"
      style={{ bottom: 0, left: 0, width: "310px", height: "230px" }}
      aria-hidden="true"
    >
      {/* Right-cluster — lighter, further away */}
      <line x1="190" y1="230" x2="186" y2="68"  stroke="#B8902A" strokeWidth="2.2" opacity="0.40" />
      <ellipse cx="186" cy="60"  rx="5.5" ry="16" fill="#A07820" opacity="0.43" />
      <line x1="218" y1="230" x2="222" y2="96"  stroke="#B8902A" strokeWidth="2"   opacity="0.36" />
      <ellipse cx="222" cy="88"  rx="4.5" ry="13" fill="#A07820" opacity="0.38" />
      <line x1="242" y1="230" x2="238" y2="112" stroke="#B8902A" strokeWidth="1.8" opacity="0.32" />
      <ellipse cx="238" cy="104" rx="4"   ry="11" fill="#A07820" opacity="0.34" />

      {/* Left-cluster */}
      <line x1="22"  y1="230" x2="18"  y2="84"  stroke="#B8902A" strokeWidth="2.8" opacity="0.44" />
      <ellipse cx="18"  cy="74"  rx="7"  ry="19"  fill="#A07820" opacity="0.47" />
      <line x1="52"  y1="230" x2="56"  y2="100" stroke="#B8902A" strokeWidth="2.2" opacity="0.38" />
      <ellipse cx="56"  cy="92"  rx="5.5" ry="15" fill="#A07820" opacity="0.40" />

      {/* Grass blades */}
      <path d="M95, 230 Q103,188 93,146"  stroke="#9A7820" strokeWidth="1.3" fill="none" opacity="0.30" />
      <path d="M138,230 Q146,196 136,158" stroke="#9A7820" strokeWidth="1.1" fill="none" opacity="0.26" />
      <path d="M278,230 Q272,200 280,164" stroke="#9A7820" strokeWidth="1.1" fill="none" opacity="0.23" />

      {/* Water shimmer */}
      <path d="M0,221 Q78,214 155,221 Q232,228 310,221"
            stroke="#8B6A20" strokeWidth="1" fill="none" opacity="0.20" />
    </svg>
  );
}

function ForegroundReeds() {
  return (
    <svg
      viewBox="0 0 310 210"
      className="absolute pointer-events-none"
      style={{ bottom: 0, left: 0, width: "310px", height: "210px" }}
      aria-hidden="true"
    >
      {/* Tallest stalks — define the peek line (frog's peace-sign arm + head show above) */}
      <line x1="68"  y1="210" x2="64"  y2="0"   stroke="#3A2408" strokeWidth="4.5" opacity="0.92" />
      <ellipse cx="64"  cy="-9"  rx="10" ry="27"  fill="#1E1208" opacity="0.96" />
      <line x1="100" y1="210" x2="104" y2="18"  stroke="#3A2408" strokeWidth="4"   opacity="0.88" />
      <ellipse cx="104" cy="8"   rx="9"  ry="23"  fill="#1E1208" opacity="0.92" />

      {/* Second-row — slightly shorter */}
      <line x1="28"  y1="210" x2="24"  y2="28"  stroke="#2A1808" strokeWidth="5.5" opacity="0.94" />
      <ellipse cx="24"  cy="16"  rx="11" ry="30"  fill="#160E06" opacity="0.97" />
      <line x1="50"  y1="210" x2="54"  y2="44"  stroke="#2A1808" strokeWidth="4.5" opacity="0.90" />
      <ellipse cx="54"  cy="34"  rx="10" ry="26"  fill="#1E1208" opacity="0.93" />

      {/* Right-side mid stalks */}
      <line x1="148" y1="210" x2="144" y2="50"  stroke="#3A2808" strokeWidth="3.5" opacity="0.82" />
      <ellipse cx="144" cy="42"  rx="8"  ry="21"  fill="#241808" opacity="0.86" />
      <line x1="178" y1="210" x2="182" y2="72"  stroke="#3A2808" strokeWidth="3"   opacity="0.78" />
      <ellipse cx="182" cy="63"  rx="7"  ry="18"  fill="#241808" opacity="0.80" />

      {/* Short foreground grass */}
      <path d="M6,   210 Q2,   184 10,  142" stroke="#1E1408" strokeWidth="1.8" fill="none" opacity="0.78" />
      <path d="M80,  210 Q88,  184 78,  144" stroke="#2A1808" strokeWidth="1.4" fill="none" opacity="0.70" />
      <path d="M122, 210 Q128, 187 120, 150" stroke="#2A1808" strokeWidth="1.2" fill="none" opacity="0.65" />
      <path d="M220, 210 Q214, 193 222, 162" stroke="#2A1808" strokeWidth="1.2" fill="none" opacity="0.58" />
      <path d="M265, 210 Q272, 196 264, 168" stroke="#2A1808" strokeWidth="1.1" fill="none" opacity="0.52" />

      {/* Ground/water edge */}
      <path d="M0,200 Q78,192 155,200 Q232,208 310,200 L310,210 L0,210 Z"
            fill="#160E06" opacity="0.75" />
      <path d="M0,196 Q78,188 155,196 Q232,204 310,196"
            stroke="#4A3010" strokeWidth="1.4" fill="none" opacity="0.45" />
    </svg>
  );
}

function DragonflySVG() {
  return (
    <svg viewBox="0 0 80 100" width="54" height="68" aria-hidden="true">
      <ellipse cx="40" cy="50" rx="5" ry="28" fill="#1A1008" />
      <ellipse cx="40" cy="28" rx="7" ry="10" fill="#1A1008" />
      <circle  cx="36" cy="24" r="4"          fill="#1A1008" />
      <circle  cx="44" cy="24" r="4"          fill="#1A1008" />
      <ellipse cx="20" cy="36" rx="18" ry="8" transform="rotate(-15 20 36)" fill="#1A1008" opacity="0.55" />
      <ellipse cx="60" cy="36" rx="18" ry="8" transform="rotate(15 60 36)"  fill="#1A1008" opacity="0.55" />
      <ellipse cx="18" cy="50" rx="14" ry="6" transform="rotate(-10 18 50)" fill="#1A1008" opacity="0.38" />
      <ellipse cx="62" cy="50" rx="14" ry="6" transform="rotate(10 62 50)"  fill="#1A1008" opacity="0.38" />
    </svg>
  );
}

export default function EmailSignup() {
  return (
    <>
      {/*
        ── Frog idle animation keyframes ────────────────────────────────────
        Three independent durations so loops drift out of phase organically.

        frog-sway   (7s)  : gentle pendulum rock, pivoting from feet
        frog-bob    (4.8s): slow vertical drift, offset from sway
        frog-breathe(3.8s): scaleY expansion on image = chest rise/fall
      */}
      <style>{`
        @keyframes frog-sway {
          0%   { transform: rotate(-1deg); }
          30%  { transform: rotate(0.6deg); }
          60%  { transform: rotate(-0.8deg); }
          85%  { transform: rotate(0.4deg); }
          100% { transform: rotate(-1deg); }
        }
        @keyframes frog-bob {
          0%   { transform: translateY(0px); }
          45%  { transform: translateY(-4px); }
          100% { transform: translateY(0px); }
        }
        @keyframes frog-breathe {
          0%   { transform: scaleY(1)     translateY(0px); }
          40%  { transform: scaleY(1.013) translateY(-1px); }
          55%  { transform: scaleY(1.013) translateY(-1px); }
          100% { transform: scaleY(1)     translateY(0px); }
        }
      `}</style>

      <section
        className="relative overflow-hidden py-16 sm:py-20 px-4"
        style={{
          background:
            "linear-gradient(180deg, #C8A660 0%, #D8BC7A 35%, #C8A660 70%, #B89050 100%)",
          minHeight: "300px",
        }}
        aria-labelledby="email-signup-heading"
      >
        {/* Top/bottom rules */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: "linear-gradient(90deg,#7A1714,#C4902A,#7A1714)" }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px]"
          style={{ background: "linear-gradient(90deg,#7A1714,#C4902A,#7A1714)" }}
          aria-hidden="true"
        />

        {/* ════════════════════════════════════════════════════════════════
            POND ENVIRONMENT — desktop only (lg+)
            Layer 1: background reeds (z=1) — behind the frog
            Layer 2: frog.png full-body (z=2) — transparent, CSS-masked feet
            Layer 3: foreground reeds (z=3) — covers boots/shins, peace sign
                     and hat/face visible above the tallest reed
        ════════════════════════════════════════════════════════════════ */}
        <div
          className="absolute bottom-0 left-0 pointer-events-none select-none hidden lg:block"
          style={{ width: "310px", zIndex: 2 }}
          aria-hidden="true"
        >
          {/* Layer 1: Background reeds */}
          <div className="frog-env__bg-reeds" style={{ position: "absolute", bottom: 0, left: 0 }}>
            <BackgroundReeds />
          </div>

          {/* Layer 2: Full-body frog
              • frog.png is 1366×1152 (landscape) — rendered at 300px wide ≈ 253px tall
              • Positioned bottom:-12px so feet are below section edge (grounded)
              • maskImage fades bottom 28% to transparent — boots dissolve into gold
              • transform-origin: center bottom so sway pivots from the feet
              • Upper body (panther tattoo, peace sign, hat) shows above reeds      */}
          <div
            className="frog-env__frog"
            style={{
              position: "absolute",
              bottom: "-12px",
              left: "-8px",
              zIndex: 2,
              transformOrigin: "center bottom",
              animation: "frog-sway 7s ease-in-out infinite, frog-bob 4.8s ease-in-out infinite",
              WebkitMaskImage:
                "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.5) 20%, black 36%, black 100%)",
              maskImage:
                "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.5) 20%, black 36%, black 100%)",
            }}
          >
            <Image
              src="/frog.png"
              alt=""
              width={1366}
              height={1152}
              style={{
                width: "300px",
                height: "auto",
                display: "block",
                filter: "drop-shadow(2px 4px 12px rgba(80,45,5,0.32))",
                animation: "frog-breathe 3.8s ease-in-out infinite",
                transformOrigin: "center bottom",
              }}
            />
          </div>

          {/* Layer 3: Foreground reeds — covers lower body/boots */}
          <div className="frog-env__fg-reeds" style={{ position: "absolute", bottom: 0, left: 0, zIndex: 3 }}>
            <ForegroundReeds />
          </div>
        </div>

        {/* Dragonfly — right side decoration */}
        <div
          className="frog-env__dragonfly absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 hidden md:block"
          aria-hidden="true"
        >
          <DragonflySVG />
        </div>

        {/* ── Content ──
            lg:pl-24 clears the 310px environment on desktop               */}
        <div className="relative z-10 max-w-xl mx-auto text-center lg:pl-24">
          <p
            className="text-crimson text-[10px] tracking-[0.35em] uppercase mb-3"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            ★ Stay in the Loop ★
          </p>

          <h2
            id="email-signup-heading"
            className="text-ink text-2xl sm:text-3xl mb-2"
            style={{ fontFamily: "var(--font-rye, serif)" }}
          >
            Stay in the Loop
          </h2>

          <div
            className="mx-auto mb-5"
            style={{
              height: "2px",
              width: "80px",
              background: "linear-gradient(90deg,transparent,#1A1008,transparent)",
            }}
            aria-hidden="true"
          />

          <p
            className="text-ink/60 text-base mb-7 leading-relaxed"
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          >
            Get updates on artists, tickets, contests, and more.
            <br />
            <em>We&rsquo;ll see you at the pond.</em>
          </p>

          <div
            className="border-2 border-ink/20 py-7 px-6"
            style={{ background: "rgba(245,230,200,0.55)" }}
          >
            <p className="text-2xl mb-3 text-ink/40" aria-hidden="true">✦</p>
            <p
              className="text-ink text-lg mb-2"
              style={{ fontFamily: "var(--font-rye, serif)" }}
            >
              Email List Coming Soon
            </p>
            <p
              className="text-ink/55 text-sm leading-relaxed"
              style={{ fontFamily: "var(--font-garamond, serif)" }}
            >
              Follow us on social or call{" "}
              <a
                href="tel:731-513-4271"
                className="text-crimson hover:text-crimson-light transition-colors font-medium"
              >
                731-513-4271
              </a>{" "}
              to stay connected until the list opens.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
