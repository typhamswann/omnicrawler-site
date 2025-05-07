import React from 'react';
import InteractiveHero from "@/app/components/blocks/hero-section-nexus";
import ScraperTestSection from "@/app/components/blocks/scraper-test-section";
import FeaturesSection from "@/app/components/blocks/features-section";

export default function HomePage() {
  return (
    <div>
      <InteractiveHero />
      <ScraperTestSection />
      <FeaturesSection />
    </div>
  );
}
