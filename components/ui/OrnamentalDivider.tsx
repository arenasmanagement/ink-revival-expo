interface OrnamentalDividerProps {
  light?: boolean;
  className?: string;
  symbol?: string;
}

export default function OrnamentalDivider({
  light = false,
  className = "",
  symbol = "✦",
}: OrnamentalDividerProps) {
  const lineColor = light ? "rgba(196,144,42,0.45)" : "rgba(26,16,8,0.25)";
  const textColor = light ? "#C4902A" : "#7A1714";

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Left flourish */}
      <div className="flex-1 flex items-center gap-1">
        <div className="flex-1" style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${lineColor})` }} />
        <span style={{ color: textColor, fontSize: "10px" }}>◆</span>
        <div style={{ width: "20px", height: "1px", background: lineColor }} />
      </div>

      {/* Center */}
      <span
        className="text-lg select-none"
        style={{ color: textColor, letterSpacing: "0.5em" }}
      >
        {symbol}
      </span>

      {/* Right flourish */}
      <div className="flex-1 flex items-center gap-1">
        <div style={{ width: "20px", height: "1px", background: lineColor }} />
        <span style={{ color: textColor, fontSize: "10px" }}>◆</span>
        <div className="flex-1" style={{ height: "1px", background: `linear-gradient(90deg, ${lineColor}, transparent)` }} />
      </div>
    </div>
  );
}

/* Simpler version for section breaks */
export function StarDivider({ light = false, className = "" }: { light?: boolean; className?: string }) {
  const color = light ? "#C4902A" : "#7A1714";
  return (
    <div className={`text-center ${className}`}>
      <span
        className="tracking-[0.8em] text-base"
        style={{ color, fontFamily: "serif" }}
      >
        ★ ★ ★
      </span>
    </div>
  );
}

/* Scrollwork SVG divider */
export function ScrollworkDivider({ light = false, className = "" }: { light?: boolean; className?: string }) {
  const stroke = light ? "#C4902A" : "#1A1008";
  return (
    <div className={`flex justify-center overflow-hidden ${className}`}>
      <svg viewBox="0 0 600 40" className="w-full max-w-lg h-10" preserveAspectRatio="xMidYMid meet">
        {/* Left side */}
        <path
          d="M10,20 Q40,5 70,20 Q100,35 130,20 Q160,5 190,20"
          fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.6"
        />
        {/* Left to center line */}
        <line x1="200" y1="20" x2="245" y2="20" stroke={stroke} strokeWidth="1" opacity="0.5" />
        {/* Center diamond */}
        <polygon points="300,10 310,20 300,30 290,20" fill={stroke} opacity="0.7" />
        {/* Right to center line */}
        <line x1="355" y1="20" x2="400" y2="20" stroke={stroke} strokeWidth="1" opacity="0.5" />
        {/* Right side */}
        <path
          d="M410,20 Q440,5 470,20 Q500,35 530,20 Q560,5 590,20"
          fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.6"
        />
        {/* Stars */}
        <text x="255" y="25" textAnchor="middle" fill={stroke} fontSize="12" opacity="0.7">✦</text>
        <text x="345" y="25" textAnchor="middle" fill={stroke} fontSize="12" opacity="0.7">✦</text>
      </svg>
    </div>
  );
}
