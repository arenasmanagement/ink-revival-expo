import Image from "next/image";
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
              West TN Ink Revival Expo is West Tennessee&rsquo;s first tattoo convention
              — a three-day celebration bringing tattoo artists, collectors, vendors,
              businesses, food trucks, and enthusiasts together in the heart of West Tennessee.
            </p>
            <p
              className="text-ink/70 text-lg leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-garamond, serif)" }}
            >
              Meet talented artists, get tattooed, discover unique vendors and products, and be
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

          {/* Event image */}
          <div
            className="relative"
            style={{ boxShadow: "0 8px 36px rgba(26,16,8,0.28), 0 2px 8px rgba(26,16,8,0.15)" }}
          >
            <Image
              src="/ink-image.png"
              alt="Tattoo artist tattooing an arm at the West TN Ink Revival Expo 2027 in Huntingdon, Tennessee"
              width={1402}
              height={1122}
              className="w-full h-auto block"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={false}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
