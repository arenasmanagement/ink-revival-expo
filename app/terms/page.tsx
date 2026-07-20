import SectionHeading from "@/components/ui/SectionHeading";

export default function TermsPage() {
  return (
    <div className="bg-parchment-light-texture min-h-screen">
      <div className="bg-ink-texture py-16 px-4 relative">
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#C4902A,transparent)" }} />
        <SectionHeading eyebrow="Legal" title="Terms & Conditions" light className="max-w-4xl mx-auto" />
      </div>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-cream/60 border border-ink/12 p-8">
          <p className="text-ink/50 text-sm italic mb-6" style={{ fontFamily: "var(--font-garamond, serif)" }}>
            Terms and conditions will be published prior to the event.
          </p>
          <p className="text-ink/70 text-base leading-relaxed" style={{ fontFamily: "var(--font-garamond, serif)" }}>
            Full terms and conditions for attendance, vendor participation, artist applications, and
            sponsorships will be posted here closer to the event.
          </p>
          <p className="text-ink/60 text-base leading-relaxed mt-4" style={{ fontFamily: "var(--font-garamond, serif)" }}>
            For questions, contact us at <a href="tel:731-513-4271" className="text-crimson">731-513-4271</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
