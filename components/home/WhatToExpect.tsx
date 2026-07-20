import SectionHeading from "@/components/ui/SectionHeading";

const EXPERIENCES = [
  {
    icon: "✒️",
    title: "Tattoo Artists",
    desc: "Talented artists from across the region. Artist announcements, appointment availability, and booking details will be released as the lineup is confirmed.",
    confirmed: true,
  },
  {
    icon: "🎨",
    title: "Live Tattooing",
    desc: "Watch artists work their craft live on the convention floor over three full days.",
    confirmed: true,
  },
  {
    icon: "🛒",
    title: "Art & Vendor Booths",
    desc: "Unique apparel, artwork, accessories, collectibles, and handmade goods from local and regional vendors.",
    confirmed: true,
  },
  {
    icon: "🚚",
    title: "Food Trucks",
    desc: "Food and beverage vendors serving attendees throughout the entire event.",
    confirmed: true,
  },
  {
    icon: "🏆",
    title: "Tattoo Contests",
    desc: "Competition categories planned to showcase the best tattoo work at the convention. Details to be confirmed.",
    confirmed: false,
  },
  {
    icon: "🎵",
    title: "Live Entertainment",
    desc: "Entertainment programming is planned for the weekend. Announcements will be released as details are finalized.",
    confirmed: false,
  },
  {
    icon: "🤝",
    title: "Sponsor Exhibits",
    desc: "Local and regional businesses connecting with the tattoo and creative community.",
    confirmed: true,
  },
  {
    icon: "🌟",
    title: "Community Experience",
    desc: "A celebration of tattoo culture, art, and the West Tennessee community.",
    confirmed: true,
  },
];

export default function WhatToExpect() {
  return (
    <section className="bg-parchment-texture py-12 sm:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="The Experience"
          title="What to Expect"
          className="mb-14"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {EXPERIENCES.map((item) => (
            <div
              key={item.title}
              className="card-vintage bg-cream/60 border border-ink/12 p-4 sm:p-5 text-center relative flex flex-col"
            >
              {/* Coming-soon badge — absolute so it doesn't affect flow */}
              {!item.confirmed && (
                <div
                  className="absolute top-2 right-2 text-[9px] bg-gold/20 text-gold-dark border border-gold/30 px-1.5 py-0.5 uppercase tracking-wider leading-none"
                  style={{ fontFamily: "var(--font-special-elite, monospace)" }}
                >
                  Coming Soon
                </div>
              )}

              {/* 1 — Icon: fixed height so all icons start at same y */}
              <div className="h-10 flex items-center justify-center mb-3 mt-1">
                <span className="text-3xl leading-none">{item.icon}</span>
              </div>

              {/* 2 — Title: min-height so 2-line titles don't push content down */}
              <h3
                className="text-ink text-sm sm:text-base leading-tight mb-2 min-h-[2.5rem] flex items-center justify-center"
                style={{ fontFamily: "var(--font-rye, serif)" }}
              >
                {item.title}
              </h3>

              {/* 3 — Ornamental line */}
              <div className="w-10 mx-auto mb-3" style={{ height: "1px", background: "rgba(26,16,8,0.25)" }} />

              {/* 4 — Description: flex-1 so it fills available space */}
              <p
                className="text-ink/60 text-xs sm:text-sm leading-relaxed flex-1"
                style={{ fontFamily: "var(--font-garamond, serif)" }}
              >
                {item.desc}
              </p>

              {/* 5 — Bottom accent: same height for all cards */}
              <div className="mt-3 h-4 flex items-center justify-center">
                {item.confirmed && (
                  <span className="text-crimson text-xs">★</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <p
          className="text-center text-ink/40 text-sm mt-10 italic"
          style={{ fontFamily: "var(--font-garamond, serif)" }}
        >
          Programming details will be updated as the event approaches. Additional announcements will be released as details are finalized.
        </p>
      </div>
    </section>
  );
}
