import SectionHeading from "@/components/ui/SectionHeading";
import { EVENT } from "@/lib/eventData";

export default function LocationSection() {
  return (
    <section className="bg-parchment-light-texture py-12 sm:py-16 px-4 relative">
      {/* Soft gradient at top to ease dark-to-light transition */}
      <div className="absolute top-0 left-0 right-0 h-10 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(26,16,8,0.07), transparent)" }} />
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          eyebrow="Find Us"
          title="Event Location"
          className="mb-12"
        />

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Map placeholder */}
          <div className="relative">
            <div
              className="aspect-[4/3] bg-parchment-dark flex items-center justify-center border-2 border-ink/20 relative overflow-hidden"
              style={{ boxShadow: "inset 0 0 0 6px rgba(196,144,42,0.12)" }}
            >
              {/* Map grid lines */}
              <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 300">
                {/* Horizontal lines */}
                {[50, 100, 150, 200, 250].map((y) => (
                  <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#1A1008" strokeWidth="1" />
                ))}
                {/* Vertical lines */}
                {[80, 160, 240, 320].map((x) => (
                  <line key={x} x1={x} y1="0" x2={x} y2="300" stroke="#1A1008" strokeWidth="1" />
                ))}
                {/* Roads */}
                <line x1="0" y1="150" x2="400" y2="150" stroke="#1A1008" strokeWidth="3" />
                <line x1="200" y1="0" x2="200" y2="300" stroke="#1A1008" strokeWidth="3" />
                {/* Location pin */}
                <circle cx="200" cy="150" r="12" fill="#7A1714" />
                <circle cx="200" cy="150" r="6" fill="#F5E6C8" />
              </svg>

              <div className="text-center relative z-10 p-6">
                <div className="text-3xl mb-2">📍</div>
                <p
                  className="text-ink/60 text-sm font-semibold"
                  style={{ fontFamily: "var(--font-rye, serif)" }}
                >
                  {EVENT.venue.name}
                </p>
                <p
                  className="text-ink/45 text-xs mt-1"
                  style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                >
                  {EVENT.venue.address}
                </p>
                <p
                  className="text-ink/40 text-xs mt-0.5"
                  style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                >
                  {EVENT.venue.city}, {EVENT.venue.state} {EVENT.venue.zip}
                </p>
              </div>
            </div>
            {/* Shadow */}
            <div className="absolute -bottom-2 -right-2 w-full h-full -z-10 border-2 border-parchment-deep/30" />
          </div>

          {/* Info */}
          <div className="space-y-5">
            <InfoBlock
              title="Venue"
              icon="🏟️"
              items={[
                EVENT.venue.name,
                EVENT.venue.address,
                `${EVENT.venue.city}, ${EVENT.venue.state} ${EVENT.venue.zip}`,
              ]}
            />
            <InfoBlock
              title="Parking"
              icon="🚗"
              items={["On-site parking available"]}
              note="Parking details to be confirmed"
            />
            <InfoBlock
              title="Accessibility"
              icon="♿"
              items={["Accessible venue"]}
              note="Full accessibility information coming soon"
            />
            <InfoBlock
              title="Nearby Hotels"
              icon="🏨"
              items={["Hotel information coming soon"]}
              note="We'll be sharing recommended accommodations closer to the event"
            />

            {/* Directions button */}
            <a
              href={EVENT.venue.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-ink text-ink uppercase tracking-wider text-sm hover:bg-ink hover:text-cream transition-all duration-200 active:scale-95"
              style={{ fontFamily: "var(--font-special-elite, monospace)" }}
            >
              <span>Get Directions</span>
              <span className="text-base">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoBlock({ title, icon, items, note }: {
  title: string;
  icon: string;
  items: string[];
  note?: string;
}) {
  return (
    <div className="border-l-2 border-gold/50 pl-4">
      <div className="flex items-center gap-2 mb-1">
        <span>{icon}</span>
        <h3
          className="text-ink text-sm font-semibold uppercase tracking-wider"
          style={{ fontFamily: "var(--font-special-elite, monospace)" }}
        >
          {title}
        </h3>
      </div>
      {items.map((item) => (
        <p key={item} className="text-ink/70 text-sm" style={{ fontFamily: "var(--font-garamond, serif)" }}>
          {item}
        </p>
      ))}
      {note && (
        <p className="text-ink/40 text-xs italic mt-0.5" style={{ fontFamily: "var(--font-garamond, serif)" }}>
          {note}
        </p>
      )}
    </div>
  );
}
