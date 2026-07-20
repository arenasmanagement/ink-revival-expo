import SectionHeading from "@/components/ui/SectionHeading";
import VenueMap from "@/components/ui/VenueMap";
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
          className="mb-10"
        />

        {/* Map */}
        <VenueMap directionsUrl={EVENT.venue.directionsUrl} />

        <div className="mt-8 grid md:grid-cols-2 gap-6 items-start">
          {/* Info blocks */}
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
          </div>

          <div className="space-y-5">
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
