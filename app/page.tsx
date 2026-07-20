import Hero from "@/components/home/Hero";
import Countdown from "@/components/home/Countdown";
import EventIntro from "@/components/home/EventIntro";
import WhoIsItFor from "@/components/home/WhoIsItFor";
import ParticipationCards from "@/components/home/ParticipationCards";
import FeaturedArtists from "@/components/home/FeaturedArtists";
import WhatToExpect from "@/components/home/WhatToExpect";
import SponsorPreview from "@/components/home/SponsorPreview";
import LocationSection from "@/components/home/LocationSection";
import EmailSignup from "@/components/home/EmailSignup";
import FinalCTA from "@/components/home/FinalCTA";

// ── Event structured data (schema.org) ────────────────────────────────────
// Only confirmed facts included. No ticket prices, hours, performers, or
// attendance figures until those details are officially announced.
const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "West TN Ink Revival Expo 2027",
  description:
    "The first annual West TN Ink Revival Expo — three days of tattoo artistry, vendors, food trucks, sponsors, and tattoo culture in West Tennessee.",
  startDate: "2027-03-12",
  endDate: "2027-03-14",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "Carroll County TN Fairgrounds",
    address: {
      "@type": "PostalAddress",
      streetAddress: "201 Fairgrounds Road",
      addressLocality: "Huntingdon",
      addressRegion: "TN",
      postalCode: "38344",
      addressCountry: "US",
    },
  },
  organizer: {
    "@type": "Organization",
    name: "Studio 45 Tattoos",
    telephone: "+17315134271",
  },
  url: "https://www.westtninkrevival.com",
  image: "https://www.westtninkrevival.com/og-card.png",
};

export default function HomePage() {
  return (
    <>
      {/* Inject Event JSON-LD for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <Hero />
      <Countdown />
      <EventIntro />
      <WhoIsItFor />
      <ParticipationCards />
      <FeaturedArtists />
      <WhatToExpect />
      <SponsorPreview />
      <LocationSection />
      <EmailSignup />
      <FinalCTA />
    </>
  );
}
