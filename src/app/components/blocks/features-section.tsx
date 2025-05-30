"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// SVG Icons for feature cards
const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#60A4FA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const ApiIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#60A4FA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#60A4FA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.2 });
  
  return (
    <motion.div
      ref={cardRef}
      className="bg-gradient-to-b from-[#1a1a1a] to-[#151515] border border-gray-700/30 rounded-xl p-8 md:p-12 flex flex-col items-start shadow-lg hover:shadow-xl transition-all min-h-[580px] overflow-hidden relative"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ 
        duration: 0.7, 
        delay: 0.1 * index,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ 
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
        borderColor: "rgba(96, 164, 250, 0.4)",
        transition: { duration: 0.2 }
      }}
    >
      {/* Subtle glow effect */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#60A4FA]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      
      {/* Icon container */}
      <div className="mt-8 mb-10 bg-gradient-to-br from-[#111111]/90 to-[#0d0d0d]/80 p-7 rounded-2xl shadow-lg border border-gray-800/20">
        <div className="scale-125">
          {icon}
        </div>
      </div>
      
      {/* Content */}
      <h3 className="text-white text-2xl font-semibold mb-6 leading-tight tracking-tight">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-base">{description}</p>
      
      {/* Bottom decorative element */}
      <div className="mt-auto pt-10 w-full">
        <div className="w-12 h-1 bg-[#60A4FA]/30 rounded-full"></div>
      </div>
    </motion.div>
  );
};

const FeaturesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  
  const features = [
    {
      title: "Never write custom scraper code again",
      description: "Our AI-powered scraper adapts to any website structure automatically, eliminating the need for custom code or maintenance.",
      icon: <CodeIcon />
    },
    {
      title: "One API call for any website",
      description: "Simple, consistent API that works across all websites. No need to build and maintain different scrapers for different sites.",
      icon: <ApiIcon />
    },
    {
      title: "Find content no other scraper can",
      description: "Advanced AI technology can extract data from complex layouts, dynamic content, and even JavaScript-rendered pages.",
      icon: <SearchIcon />
    }
  ];

  return (
    <section className="py-20 bg-[#111111] text-white relative z-10" ref={sectionRef}>
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-5">
            Scraping that <span className="text-[#60A4FA]">just works</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
            OmniCrawl provides a universal solution for all your web scraping needs, powered by advanced AI.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              index={index}
            />
          ))}
        </div>
      </div>
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111111] via-[#111111] to-[#0d0d0d] pointer-events-none -z-10"></div>
    </section>
  );
};

export default FeaturesSection;