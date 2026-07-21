import SectionHeading from "@/components/ui/SectionHeading";
import { REGISTRATION_URLS } from "@/lib/eventData";

const { sponsorRegistrationUrl } = REGISTRATION_URLS;

export default function SponsorPreview() {
  return (
    <section className="bg-ink-texture py-12 sm:py-16 px-4 relative">
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />

      <div className="max-w-5xl mx-auto">
        <SectionHeading
          eyebrow="Our Sponsors"
          title="Founding Sponsors"
          light
          className="mb-6"
        />

        {/* Intentional placeholder — logos added as sponsors are confirmed */}
        <div className="max-w-xl mx-auto text-center mb-12">
          <p
            className="text-cream/50 text-base leading-relaxed mb-3"
            style={{ fontFamily: "var(--font-garamond, serif)", fontStyle: "italic" }}
          >
            Sponsor logos will appear here as our founding partners join the West TN Ink Revival Expo.
          </p>
          <p
            className="text-cream/35 text-sm"
            style={{ fontFamily: "var(--font-garamond, serif)", fontStyle: "italic" }}
          >
            Thank you to those who have already committed to supporting the first year of this event.
          </p>
        </div>

        {/* Gold divider */}
        <div className="divider-gold mb-10 max-w-xs mx-auto" />

        {/* CTA */}
        <div className="text-center">
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
