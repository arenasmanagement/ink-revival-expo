interface VintageBannerProps {
  children: React.ReactNode;
  variant?: "crimson" | "gold" | "ink";
  className?: string;
  size?: "sm" | "md" | "lg";
}

const COLORS = {
  crimson: {
    bg: "banner-crimson",
    text: "text-cream",
    edge: "#5C100F",
    ribbon: "#7A1714",
  },
  gold: {
    bg: "banner-gold",
    text: "text-ink",
    edge: "#9E7218",
    ribbon: "#C4902A",
  },
  ink: {
    bg: "bg-ink",
    text: "text-cream",
    edge: "#000000",
    ribbon: "#1A1008",
  },
};

const SIZE_TEXT = {
  sm: "text-sm tracking-[0.2em]",
  md: "text-base sm:text-lg tracking-[0.15em]",
  lg: "text-xl sm:text-2xl tracking-[0.12em]",
};

export default function VintageBanner({
  children,
  variant = "crimson",
  className = "",
  size = "md",
}: VintageBannerProps) {
  const c = COLORS[variant];

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* Left ribbon tail */}
      <div
        className="w-6 h-full absolute left-0 top-0 pointer-events-none"
        style={{
          background: c.ribbon,
          clipPath: "polygon(100% 0%, 100% 100%, 0% 80%, 15% 50%, 0% 20%)",
        }}
      />
      {/* Right ribbon tail */}
      <div
        className="w-6 h-full absolute right-0 top-0 pointer-events-none"
        style={{
          background: c.ribbon,
          clipPath: "polygon(0% 0%, 0% 100%, 100% 80%, 85% 50%, 100% 20%)",
        }}
      />

      {/* Main banner */}
      <div
        className={`${c.bg} ${c.text} ${SIZE_TEXT[size]} px-10 py-3 font-bold uppercase text-center w-full`}
        style={{
          fontFamily: "var(--font-special-elite, monospace)",
          letterSpacing: "0.15em",
          textShadow: "0 1px 2px rgba(0,0,0,0.4)",
        }}
      >
        <span className="relative z-10">{children}</span>
      </div>
    </div>
  );
}

/* Scroll/ribbon shape banner (curved top and bottom) */
export function ScrollBanner({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 800 120"
        className="w-full"
        preserveAspectRatio="none"
        style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}
      >
        {/* Main scroll body */}
        <path
          d="M 60,15 Q 400,0 740,15 L 760,60 Q 400,80 40,60 Z"
          fill="#7A1714"
          stroke="#5C100F"
          strokeWidth="2"
        />
        {/* Lighter top highlight */}
        <path
          d="M 60,15 Q 400,0 740,15 Q 400,25 60,20 Z"
          fill="rgba(255,200,160,0.12)"
        />
        {/* Left curl */}
        <path d="M 40,60 Q 20,58 10,45 Q 5,35 25,30 Q 40,28 60,15" fill="#5C100F" />
        {/* Right curl */}
        <path d="M 760,60 Q 780,58 790,45 Q 795,35 775,30 Q 760,28 740,15" fill="#5C100F" />
        {/* Stars */}
        <text x="80" y="50" fill="rgba(245,230,200,0.8)" fontSize="18" textAnchor="middle">★</text>
        <text x="720" y="50" fill="rgba(245,230,200,0.8)" fontSize="18" textAnchor="middle">★</text>
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ paddingBottom: "4px" }}
      >
        <span
          className="text-cream text-lg sm:text-2xl font-bold uppercase tracking-widest text-center"
          style={{
            fontFamily: "var(--font-special-elite, monospace)",
            textShadow: "0 1px 3px rgba(0,0,0,0.5)",
          }}
        >
          {children}
        </span>
      </div>
    </div>
  );
}
