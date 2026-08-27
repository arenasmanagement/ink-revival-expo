"use client";

import { useEffect, useState } from "react";

const EVENT_DATE = new Date("2027-03-12T09:00:00");

function getTimeLeft() {
  const diff = EVENT_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown() {
  // Initialize as null to avoid server/client hydration mismatch with Date.now()
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    // Immediately set time on mount to avoid showing zeros for the first second.
    // Initializing in state directly would cause a server/client hydration mismatch
    // because Date.now() differs between SSR and hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const panels = [
    { label: "Days",    value: time?.days    ?? 0 },
    { label: "Hours",   value: time?.hours   ?? 0 },
    { label: "Minutes", value: time?.minutes ?? 0 },
    { label: "Seconds", value: time?.seconds ?? 0 },
  ];

  return (
    <section className="bg-ink-texture py-16 px-4 relative overflow-hidden">
      {/* Decorative lines */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />

      <div className="max-w-4xl mx-auto text-center">
        <p
          className="text-gold/70 text-xs tracking-[0.3em] uppercase mb-2"
          style={{ fontFamily: "var(--font-special-elite, monospace)" }}
        >
          ★ Counting Down To ★
        </p>
        <h2
          className="text-cream text-2xl sm:text-3xl mb-8"
          style={{ fontFamily: "var(--font-rye, 'Rye', serif)" }}
        >
          March 12, 2027
        </h2>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {panels.map(({ label, value }) => (
            <div key={label} className="countdown-panel flex flex-col items-center px-5 py-4 sm:px-8 sm:py-6 min-w-[80px] sm:min-w-[110px]">
              {/* Top rivet */}
              <div className="w-2 h-2 rounded-full bg-gold/40 mb-3" />

              <span
                className="text-gold leading-none block"
                style={{
                  fontFamily: "var(--font-rye, serif)",
                  fontSize: "clamp(2.2rem, 6vw, 3.5rem)",
                  textShadow: "0 2px 8px rgba(196,144,42,0.3)",
                }}
              >
                {String(value).padStart(2, "0")}
              </span>

              <div className="divider-gold w-full my-2" />

              <span
                className="text-cream/50 text-xs tracking-[0.2em] uppercase"
                style={{ fontFamily: "var(--font-special-elite, monospace)" }}
              >
                {label}
              </span>

              {/* Bottom rivet */}
              <div className="w-2 h-2 rounded-full bg-gold/40 mt-3" />
            </div>
          ))}
        </div>

        <p
          className="text-cream/40 text-sm mt-8 tracking-wider"
          style={{ fontFamily: "var(--font-garamond, serif)", fontStyle: "italic" }}
        >
          Carroll County TN Fairgrounds · Huntingdon, Tennessee
        </p>
      </div>
    </section>
  );
}
