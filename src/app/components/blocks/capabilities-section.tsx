"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

// Custom SVG icons for capabilities
const TextJsonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#60A4FA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9h6M9 13h3" />
  </svg>
);

const DynamicContentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#60A4FA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 13a1 1 0 011-1h14a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17h.01M12 17h.01M16 17h.01" />
  </svg>
);

const HiddenContentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#60A4FA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7l3-3 5 5 3-3m0 6l-3 3m-3-3l-3 3-3-3" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 17v.01M12 17v.01M18 17v.01" />
  </svg>
);

const StructuredOutputIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#60A4FA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 16l2 2 4-4" />
  </svg>
);

const AllHiddenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#60A4FA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

// Helper function for class names
function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Define the capabilities that will be shown in the bento grid
const capabilities = [
  {
    icon: <TextJsonIcon />,
    name: "Text or JSON",
    description: "Extract data in your preferred format with flexible output options.",
    gradient: "from-[#60A4FA]/20 to-[#3577d4]/10",
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-2",
    link: "/product#text-json"
  },
  {
    icon: <DynamicContentIcon />,
    name: "All Dynamic Content on a page",
    description: "Capture JavaScript-rendered content that traditional scrapers miss.",
    gradient: "from-[#60A4FA]/20 to-[#3577d4]/10",
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-3",
    link: "/product#dynamic-content"
  },
  {
    icon: <HiddenContentIcon />,
    name: "Finds all content behind dropdowns, modals, and navigations",
    description: "Discover hidden elements and interactive components without writing custom code.",
    gradient: "from-[#60A4FA]/20 to-[#3577d4]/10", 
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-3",
    link: "/product#hidden-navigation"
  },
  {
    icon: <StructuredOutputIcon />,
    name: "Structured outputs",
    description: "Get clean, organized data structures ready for immediate use in your application.",
    gradient: "from-[#60A4FA]/20 to-[#3577d4]/10",
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
    link: "/product#structured-output"
  },
  {
    icon: <AllHiddenIcon />,
    name: "All hidden content",
    description: "Uncover content that's not immediately visible but crucial for comprehensive data extraction.",
    gradient: "from-[#60A4FA]/20 to-[#3577d4]/10",
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-3",
    link: "/product#all-hidden"
  },
];

// Component for each capability card
const CapabilityCard = ({
  name,
  description,
  icon,
  gradient,
  className,
  index = 0,
  link = "#",
}: {
  name: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  className?: string;
  index?: number;
  link?: string;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });
  
  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-gray-800/40",
        "bg-gradient-to-br bg-[#151515] shadow-xl h-full",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
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
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`}></div>
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-[#60A4FA] blur-xl"></div>
      
      <div className="z-10 flex flex-col gap-3 p-5 h-full">
        {/* Icon container */}
        <div className="bg-gradient-to-br from-[#111111]/90 to-[#0d0d0d]/80 p-4 rounded-xl shadow-lg border border-gray-800/20 w-fit mb-3">
          <div className="scale-110">
            {icon}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">{name}</h3>
        <p className="text-gray-400 text-sm flex-grow">{description}</p>
        
        {/* Learn More Button - Hidden initially, visible on hover */}
        <div className="mt-4 transform-gpu translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <a 
            href={link} 
            className="inline-flex items-center text-[#60A4FA] hover:text-[#80b4fa] text-sm font-medium"
          >
            Learn more
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 ml-2 transform transition-transform group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#60A4FA]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
    </motion.div>
  );
};

// Bento grid layout
const BentoGrid = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 md:grid-cols-3 auto-rows-[14rem] gap-4",
        className
      )}
    >
      {children}
    </div>
  );
};

// Main component
const CapabilitiesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  
  return (
    <section className="py-20 bg-[#111111] text-white relative z-10" ref={sectionRef}>
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-5">
            Powerful <span className="text-[#60A4FA]">capabilities</span> that outperform
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
            OmniCrawl extracts data others can't reach with advanced scraping technology.
          </p>
        </motion.div>
        
        <BentoGrid className="lg:grid-rows-2">
          {capabilities.map((capability, index) => (
            <CapabilityCard
              key={capability.name}
              name={capability.name}
              description={capability.description}
              icon={capability.icon}
              gradient={capability.gradient}
              className={capability.className}
              index={index}
              link={capability.link}
            />
          ))}
        </BentoGrid>
      </div>
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111111] to-[#0d0d0d] pointer-events-none -z-10"></div>
    </section>
  );
};

export default CapabilitiesSection; 