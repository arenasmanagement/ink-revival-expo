import SectionHeading from "@/components/ui/SectionHeading";
import { EVENT } from "@/lib/eventData";

export default function EventIntro() {
  return (
    <section className="bg-parchment-light-texture py-12 sm:py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          eyebrow="Welcome"
          title="The First Annual West TN Ink Revival Expo"
          className="mb-10"
        />

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <div>
            <p
              className="text-ink/80 text-lg leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-garamond, serif)" }}
            >
              West TN Ink Revival Expo brings tattoo artists, collectors, vendors,
              businesses, food trucks, and tattoo enthusiasts together for a three-day
              celebration of tattoo culture in West Tennessee.
            </p>
            <p
              className="text-ink/70 text-lg leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-garamond, serif)" }}
            >
              Meet talented artists, discover unique vendors and products, and be
              part of a new regional tradition right here in Huntingdon. Additional
              programming and entertainment announcements are coming soon.
            </p>
            {/* Key details */}
            <div className="space-y-2">
              {[
                "March 12–14, 2027",
                EVENT.venue.name,
                EVENT.venue.fullAddress,
                `Presented by ${EVENT.producer}`,
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="text-crimson text-base leading-none">★</span>
                  <span
                    className="text-ink/70 text-sm tracking-wider"
                    style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Media placeholder */}
          <div className="relative">
            <div
              className="aspect-video bg-parchment-dark flex flex-col items-center justify-center border-2 border-ink/20 relative overflow-hidden"
              style={{ boxShadow: "inset 0 0 0 6px rgba(196,144,42,0.15), 0 4px 20px rgba(26,16,8,0.12)" }}
            >
              {/* Corner dots */}
              {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map((pos) => (
                <div key={pos} className={`absolute ${pos} w-3 h-3 border-2 border-gold/40`} />
              ))}

              <div className="text-center p-6">
                <div className="text-4xl text-ink/20 mb-3">▶</div>
                <p
                  className="text-ink/40 text-xs tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                >
                  Event video / photo
                </p>
                <p
                  className="text-ink/30 text-xs mt-1"
                  style={{ fontFamily: "var(--font-garamond, serif)", fontStyle: "italic" }}
                >
                  Coming soon
                </p>
              </div>
            </div>
            {/* Shadow accent */}
            <div
              className="absolute -bottom-2 -right-2 w-full h-full -z-10 border-2 border-parchment-deep/40"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
