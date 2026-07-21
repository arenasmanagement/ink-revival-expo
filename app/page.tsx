import type { Metadata } from "next";
import Hero from "@/components/home/Hero";

export const metadata: Metadata = {
  title: "West TN Ink Revival Expo 2027 | West Tennessee Tattoo Convention",
  description:
    "West TN Ink Revival Expo — March 12–14, 2027 at the Carroll County TN Fairgrounds, Huntingdon, Tennessee. The first annual tattoo convention in West Tennessee featuring artists, vendors, food trucks, and three days of tattoo culture.",
  alternates: { canonical: "https://www.westtninkrevival.com" },
  openGraph: {
    title: "West TN Ink Revival Expo 2027 — West Tennessee Tattoo Convention",
    description:
      "March 12–14, 2027 · Carroll County TN Fairgrounds · Huntingdon, Tennessee. The first annual West Tennessee tattoo convention featuring artists, vendors, food trucks, and community.",
    url: "https://www.westtninkrevival.com",
    images: [
      {
        url: "/og-card.png",
        width: 1200,
        height: 630,
        alt: "West TN Ink Revival Expo 2027 — West Tennessee Tattoo Convention",
      },
    ],
  },
};

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

// ── Structured data (schema.org) ──────────────────────────────────────────
// Only confirmed facts included. No ticket prices, hours, performers, or
// attendance figures until those details are officially announced.
const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "West TN Ink Revival Expo 2027",
  description:
    "The first annual West TN Ink Revival Expo — three days of tattoo artistry, vendors, food trucks, sponsors, and tattoo culture in West Tennessee. Held at the Carroll County TN Fairgrounds in Huntingdon, Tennessee.",
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
    geo: {
      "@type": "GeoCoordinates",
      latitude: 36.0009,
      longitude: -88.4264,
    },
  },
  organizer: {
    "@type": "Organization",
    name: "Studio 45 Tattoos",
    telephone: "+17315134271",
    url: "https://www.westtninkrevival.com",
  },
  url: "https://www.westtninkrevival.com",
  image: [
    "https://www.westtninkrevival.com/og-card.png",
    "https://www.westtninkrevival.com/hero-trans.png",
  ],
  keywords: "tattoo convention Tennessee, West Tennessee tattoo expo, tattoo festival Tennessee, tattoo show Huntingdon TN",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "West TN Ink Revival Expo",
  url: "https://www.westtninkrevival.com",
  logo: "https://www.westtninkrevival.com/og-card.png",
  image: "https://www.westtninkrevival.com/og-card.png",
  description: "The first annual West Tennessee tattoo convention, produced by Studio 45 Tattoos. March 12–14, 2027 at the Carroll County TN Fairgrounds in Huntingdon, Tennessee.",
  telephone: "+17315134271",
  address: {
    "@type": "PostalAddress",
    streetAddress: "201 Fairgrounds Road",
    addressLocality: "Huntingdon",
    addressRegion: "TN",
    postalCode: "38344",
    addressCountry: "US",
  },
  sameAs: [
    "https://www.westtninkrevival.com",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "West TN Ink Revival Expo",
  url: "https://www.westtninkrevival.com",
  description: "Official website for West TN Ink Revival Expo — West Tennessee's first annual tattoo convention, March 12–14, 2027.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.westtninkrevival.com/faq",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function HomePage() {
  return (
    <>
      {/* Inject structured data for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
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
