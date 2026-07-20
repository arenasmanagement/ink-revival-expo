import SectionHeading from "@/components/ui/SectionHeading";
import { REGISTRATION_URLS } from "@/lib/eventData";

const { sponsorRegistrationUrl } = REGISTRATION_URLS;

// Placeholder slots — replace with real sponsor data when logos are collected.
// Keep hierarchy: VIP slots larger, Basic slots smaller.
const VIP_SLOTS = [{ id: 1 }, { id: 2 }];
const BASIC_SLOTS = [{ id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }];

export default function SponsorPreview() {
  return (
    <section className="bg-ink-texture py-12 sm:py-16 px-4 relative">
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />

      <div className="max-w-5xl mx-auto">
        <SectionHeading
          eyebrow="Our Sponsors"
          title="Sponsor Announcements Coming Soon"
          light
          className="mb-6"
        />

        {/* Coming-soon notice */}
        <p
          className="text-center text-cream/50 text-base max-w-xl mx-auto mb-12 leading-relaxed"
          style={{ fontFamily: "var(--font-garamond, serif)", fontStyle: "italic" }}
        >
          We are currently collecting official sponsor logos and will begin featuring
          our event partners soon. Thank you to those who have already joined us.
        </p>

        {/* VIP Sponsors */}
        <div className="mb-4 text-center">
          <p
            className="text-gold/50 text-[10px] tracking-[0.3em] uppercase mb-6"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            ✦ VIP Sponsors ✦
          </p>
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            {VIP_SLOTS.map((s) => (
              <SponsorSlot key={s.id} size="vip" />
            ))}
          </div>
        </div>

        {/* Gold divider */}
        <div className="divider-gold mb-10 max-w-xs mx-auto" />

        {/* Basic Sponsors */}
        <div className="mb-4 text-center">
          <p
            className="text-gold/50 text-[10px] tracking-[0.3em] uppercase mb-6"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            ✦ Sponsors ✦
          </p>
          <div className="flex flex-wrap justify-center gap-5 mb-10">
            {BASIC_SLOTS.map((s) => (
              <SponsorSlot key={s.id} size="basic" />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <p
            className="text-cream/50 text-sm italic mb-4"
            style={{ fontFamily: "var(--font-garamond, serif)" }}
          >
            Interested in becoming a sponsor? Two packages available — Basic ($500) and VIP ($1,000).
          </p>
          <a
            href={sponsorRegistrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 border-2 border-gold text-gold uppercase tracking-widest text-sm hover:bg-gold hover:text-ink transition-all duration-200 active:scale-95"
            style={{ fontFamily: "var(--font-special-elite, monospace)" }}
          >
            Register as a Sponsor
          </a>
        </div>
      </div>
    </section>
  );
}

function SponsorSlot({ size }: { size: "vip" | "basic" }) {
  const isVip = size === "vip";
  return (
    <div
      className={`
        border border-gold/20 bg-parchment-light/5 flex items-center justify-center
        ${isVip ? "w-48 h-28 sm:w-56 sm:h-32" : "w-32 h-20 sm:w-40 sm:h-24"}
        relative
      `}
      style={{ boxShadow: isVip ? "0 0 0 1px rgba(196,144,42,0.1)" : "none" }}
      aria-label={isVip ? "VIP sponsor logo placeholder" : "Sponsor logo placeholder"}
    >
      <div className="text-center p-3">
        {isVip && (
          <div className="mb-1">
            <span className="text-gold/30 text-xs">✦</span>
          </div>
        )}
        <p
          className="text-cream/15 uppercase tracking-widest"
          style={{
            fontFamily: "var(--font-special-elite, monospace)",
            fontSize: isVip ? "10px" : "9px",
          }}
        >
          {isVip ? "VIP Partner" : "Partner"}
        </p>
        <p
          className="text-cream/10 text-[8px] mt-1"
          style={{ fontFamily: "var(--font-garamond, serif)", fontStyle: "italic" }}
        >
          Logo Coming Soon
        </p>
      </div>
      {isVip && (
        <>
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-gold/25" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-gold/25" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-gold/25" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-gold/25" />
        </>
      )}
    </div>
  );
}
