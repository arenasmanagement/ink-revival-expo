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

export default function HomePage() {
  return (
    <>
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
