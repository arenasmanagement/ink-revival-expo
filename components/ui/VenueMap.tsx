"use client";

import { useState } from "react";

interface VenueMapProps {
  directionsUrl: string;
  /**
   * When provided, overrides the default aspect-ratio / min/max-height sizing.
   * Use Tailwind height classes (e.g. "h-[260px] md:h-[380px]") to control
   * the map container when embedding it in a constrained layout like a grid column.
   */
  containerClassName?: string;
}

export default function VenueMap({ directionsUrl, containerClassName }: VenueMapProps) {
  const [failed, setFailed] = useState(false);

  const mapEmbedUrl =
    "https://maps.google.com/maps?q=Carroll+County+TN+Fairgrounds,+201+Fairgrounds+Road,+Huntingdon,+TN+38344&hl=en&z=15&output=embed";

  // When containerClassName is supplied the caller controls sizing via Tailwind;
  // drop the built-in aspect-ratio/height constraints so they don't conflict.
  const sizeStyle: React.CSSProperties = containerClassName
    ? {}
    : { aspectRatio: "16/7", minHeight: "280px", maxHeight: "420px" };

  return (
    <div
      className={`overflow-hidden relative${containerClassName ? ` ${containerClassName}` : " w-full"}`}
      style={{
        borderRadius: "2px",
        border: "1px solid rgba(196,144,42,0.25)",
        boxShadow: "0 4px 20px rgba(26,16,8,0.15)",
        background: "#1A1008",
        ...sizeStyle,
      }}
    >
      {failed ? (
        /* Fallback card */
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center"
          style={{ background: "rgba(26,16,8,0.95)" }}
        >
          <div>
            <p
              className="text-gold text-sm tracking-wider uppercase mb-2"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              📍 Carroll County TN Fairgrounds
            </p>
            <p
              className="text-cream/60 text-sm"
              style={{ fontFamily: "var(--font-garamond, serif)" }}
            >
              201 Fairgrounds Road · Huntingdon, TN 38344
            </p>
            <p
              className="text-cream/35 text-xs italic mt-2"
              style={{ fontFamily: "var(--font-garamond, serif)" }}
            >
              Interactive map unavailable. Click below for directions.
            </p>
          </div>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-crimson text-cream uppercase tracking-widest text-xs hover:bg-crimson-dark transition-all duration-200 active:scale-95"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            Get Directions →
          </a>
        </div>
      ) : (
        <iframe
          src={mapEmbedUrl}
          title="Carroll County TN Fairgrounds — West TN Ink Revival Expo venue"
          width="100%"
          height="100%"
          style={{ border: 0, display: "block" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
