import React from 'react';
import InteractiveHero from "@/app/components/blocks/hero-section-nexus";
import ScraperTestSection from "@/app/components/blocks/scraper-test-section";
import FeaturesSection from "@/app/components/blocks/features-section";
import ApiSampleSection from "@/app/components/blocks/api-sample-section";
import CapabilitiesSection from "@/app/components/blocks/capabilities-section";
import CtaSection from "@/app/components/blocks/cta-section";

export default function HomePage() {
  return (
    <div>
      <InteractiveHero />
      <ScraperTestSection />
      <FeaturesSection />
      <ApiSampleSection />
      <CapabilitiesSection />
      <CtaSection />
    </div>
  );
}
