"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Navbar from "@/app/components/shared/navbar";

// Icon Components
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

// Interactive Dots Component
const InteractiveDots = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const dotsRef = useRef<Array<{
    x: number;
    y: number;
    baseColor: string;
    targetOpacity: number;
    currentOpacity: number;
    opacitySpeed: number;
    baseRadius: number;
    currentRadius: number;
  }>>([]);
  const mousePositionRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const canvasSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  
  const DOT_SPACING = 40;
  const BASE_OPACITY_MIN = 0.15;
  const BASE_OPACITY_MAX = 0.30;
  const BASE_RADIUS = 1.5;
  const INTERACTION_RADIUS = 150;
  const INTERACTION_RADIUS_SQ = INTERACTION_RADIUS * INTERACTION_RADIUS;
  const OPACITY_BOOST = 0.6;
  const RADIUS_BOOST = 2;
  
  const createDots = useCallback(() => {
    const { width, height } = canvasSizeRef.current;
    if (width === 0 || height === 0) return;

    const newDots: typeof dotsRef.current = [];
    const cols = Math.ceil(width / DOT_SPACING);
    const rows = Math.ceil(height / DOT_SPACING);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * DOT_SPACING + DOT_SPACING / 2;
        const y = j * DOT_SPACING + DOT_SPACING / 2;
        const baseOpacity = Math.random() * (BASE_OPACITY_MAX - BASE_OPACITY_MIN) + BASE_OPACITY_MIN;
        
        newDots.push({
          x,
          y,
          baseColor: `rgba(96, 164, 250, ${BASE_OPACITY_MAX})`, // Nexus blue
          targetOpacity: baseOpacity,
          currentOpacity: baseOpacity,
          opacitySpeed: Math.random() * 0.005 + 0.002,
          baseRadius: BASE_RADIUS,
          currentRadius: BASE_RADIUS,
        });
      }
    }
    dotsRef.current = newDots;
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      mousePositionRef.current = { x: null, y: null };
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;
    mousePositionRef.current = { x: canvasX, y: canvasY };
  }, []);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = Math.max(document.body.scrollHeight, window.innerHeight);
    canvasSizeRef.current = { width: canvas.width, height: canvas.height };
    createDots();
  }, [createDots]);

  const animateDots = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const dots = dotsRef.current;
    const { width, height } = canvasSizeRef.current;
    const { x: mouseX, y: mouseY } = mousePositionRef.current;

    if (!ctx || !dots || width === 0 || height === 0) {
      animationFrameId.current = requestAnimationFrame(animateDots);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    dots.forEach(dot => {
      dot.currentOpacity += dot.opacitySpeed;
      if (dot.currentOpacity >= dot.targetOpacity || dot.currentOpacity <= BASE_OPACITY_MIN) {
        dot.opacitySpeed = -dot.opacitySpeed;
        dot.currentOpacity = Math.max(BASE_OPACITY_MIN, Math.min(dot.currentOpacity, BASE_OPACITY_MAX));
        dot.targetOpacity = Math.random() * (BASE_OPACITY_MAX - BASE_OPACITY_MIN) + BASE_OPACITY_MIN;
      }

      let interactionFactor = 0;
      dot.currentRadius = dot.baseRadius;

      if (mouseX !== null && mouseY !== null) {
        const dx = dot.x - mouseX;
        const dy = dot.y - mouseY;
        const distSq = dx * dx + dy * dy;

        if (distSq < INTERACTION_RADIUS_SQ) {
          const distance = Math.sqrt(distSq);
          interactionFactor = Math.max(0, 1 - distance / INTERACTION_RADIUS);
          interactionFactor = interactionFactor * interactionFactor;
        }
      }

      const finalOpacity = Math.min(1, dot.currentOpacity + interactionFactor * OPACITY_BOOST);
      dot.currentRadius = dot.baseRadius + interactionFactor * RADIUS_BOOST;

      const colorMatch = dot.baseColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      const r = colorMatch ? colorMatch[1] : "96";
      const g = colorMatch ? colorMatch[2] : "164";
      const b = colorMatch ? colorMatch[3] : "250";
      
      ctx.beginPath();
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalOpacity.toFixed(3)})`;
      ctx.arc(dot.x, dot.y, dot.currentRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    animationFrameId.current = requestAnimationFrame(animateDots);
  }, []);

  useEffect(() => {
    handleResize();
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);
    
    animationFrameId.current = requestAnimationFrame(animateDots);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [handleResize, handleMouseMove, animateDots]);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-80" />
  );
};

// Feature Section Component
const FeatureSection = ({ 
  id, 
  title, 
  description, 
  icon, 
  features, 
  imageUrl, 
  reversed = false 
}: { 
  id: string;
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  features: string[];
  imageUrl: string;
  reversed?: boolean;
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  return (
    <div id={id} className="py-20 border-b border-gray-800" ref={sectionRef}>
      <div className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-10 lg:gap-16 items-center`}>
        <motion.div 
          className="w-full lg:w-1/2"
          initial={{ opacity: 0, x: reversed ? 30 : -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: reversed ? 30 : -30 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="bg-gradient-to-br from-[#111111]/90 to-[#0d0d0d]/80 p-5 rounded-xl shadow-lg border border-gray-800/20 w-fit mb-5">
            <div className="scale-125">
              {icon}
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">{title}</h2>
          <p className="text-gray-400 text-lg mb-8">{description}</p>
          
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <motion.li 
                key={index} 
                className="flex items-start gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#60A4FA] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">{feature}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
        
        <motion.div 
          className="w-full lg:w-1/2"
          initial={{ opacity: 0, x: reversed ? -30 : 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: reversed ? -30 : 30 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="bg-[#151515] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
            <div className="relative aspect-[16/10] bg-[#111111]">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#60A4FA]/10 to-transparent"></div>
              <div className="p-8 flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  {/* Placeholder for image */}
                  <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                    {icon}
                  </div>
                  <p className="text-sm">Image visualization would appear here</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-medium text-white mb-2">How it works</h3>
              <p className="text-gray-400 text-sm">OmniCrawl uses advanced AI models to analyze and extract data from websites with unprecedented accuracy.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Main Product Page Component
export default function ProductPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });
  
  const features = [
    {
      id: "text-json",
      title: "Text or JSON",
      description: "Extract data in your preferred format with flexible output options that adapt to your specific needs.",
      icon: <TextJsonIcon />,
      features: [
        "Choose between JSON for structured data or clean Markdown text",
        "Customize output fields based on your application requirements",
        "Maintain proper hierarchical relationships between extracted elements",
        "Filter content by type, section, or data characteristics"
      ],
      imageUrl: "/text-json.png"
    },
    {
      id: "dynamic-content",
      title: "All Dynamic Content",
      description: "Capture JavaScript-rendered content that traditional scrapers miss, ensuring comprehensive data extraction.",
      icon: <DynamicContentIcon />,
      features: [
        "Extract content loaded via AJAX and other async methods",
        "Capture elements populated after user interactions",
        "Get data from single-page applications (SPAs) and complex frameworks",
        "Works with React, Vue, Angular and other modern JS frameworks"
      ],
      imageUrl: "/dynamic-content.png",
      reversed: true
    },
    {
      id: "hidden-navigation",
      title: "Content Behind UI Elements",
      description: "Discover hidden elements and interactive components without writing custom code for expanded coverage.",
      icon: <HiddenContentIcon />,
      features: [
        "Access content inside modals and popovers",
        "Extract data from tabbed interfaces and accordions",
        "Navigate dropdown menus to find hidden options",
        "Get content from expandable sections and collapsible panels"
      ],
      imageUrl: "/hidden-navigation.png"
    },
    {
      id: "structured-output",
      title: "Structured Outputs",
      description: "Get clean, organized data structures ready for immediate use in your application without post-processing.",
      icon: <StructuredOutputIcon />,
      features: [
        "Clean, normalized data with consistent formats",
        "Proper nested structures preserving original relationships",
        "Automatic type detection for dates, numbers, and URLs",
        "Optional schema validation against your data model"
      ],
      imageUrl: "/structured-output.png",
      reversed: true
    },
    {
      id: "all-hidden",
      title: "All Hidden Content",
      description: "Uncover content that's not immediately visible but crucial for comprehensive data extraction.",
      icon: <AllHiddenIcon />,
      features: [
        "Extract content that requires scrolling to load",
        "Navigate through pagination automatically",
        "Access content that appears on hover or focus",
        "Follow trails of data through multi-page processes"
      ],
      imageUrl: "/all-hidden.png"
    }
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="bg-[#111111] text-white min-h-screen">
      <Navbar />
      <InteractiveDots />
      
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111111] z-0"></div>
      
      {/* Hero Section */}
      <div className="pt-[100px] pb-16 px-4 relative z-10" ref={heroRef}>
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            animate={isHeroInView ? "visible" : "hidden"}
          >
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-6"
              variants={itemVariants}
            >
              The <span className="text-[#60A4FA]">OmniCrawl</span> Product
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-400 max-w-3xl mx-auto mb-10"
              variants={itemVariants}
            >
              Our Universal Scraper turns any website into structured data with AI precision.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap justify-center gap-3"
              variants={itemVariants}
            >
              {features.map((feature) => (
                <a 
                  key={feature.id} 
                  href={`#${feature.id}`}
                  className="px-4 py-2 bg-[#151515] hover:bg-[#1d1d1d] border border-gray-800 hover:border-[#60A4FA]/40 rounded-lg text-gray-300 hover:text-white transition-all duration-200"
                >
                  {feature.title}
                </a>
              ))}
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="relative bg-gradient-to-b from-[#151515] to-[#111111] border border-gray-800 rounded-xl p-8 sm:p-10 mb-20 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-60 h-60 bg-[#60A4FA]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-[#60A4FA]/5 rounded-full blur-3xl -mb-20 pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Universal Web Scraping Solution</h2>
              <p className="text-gray-400 mb-6">
                OmniCrawl is a powerful, AI-driven web scraping solution designed to extract structured data from any website without the need for custom code or maintenance. With our advanced technology, you can:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#1a1a1a]/50 p-5 rounded-lg border border-gray-800/40">
                  <h3 className="font-medium text-lg mb-2 text-[#60A4FA]">Get started in minutes</h3>
                  <p className="text-gray-400 text-sm">Make one simple API call to scrape any website, regardless of complexity. No need to build and maintain scrapers for different sites.</p>
                </div>
                
                <div className="bg-[#1a1a1a]/50 p-5 rounded-lg border border-gray-800/40">
                  <h3 className="font-medium text-lg mb-2 text-[#60A4FA]">Scale effortlessly</h3>
                  <p className="text-gray-400 text-sm">Our platform handles the complexities of web scraping, allowing you to focus on using the data rather than collecting it.</p>
                </div>
                
                <div className="bg-[#1a1a1a]/50 p-5 rounded-lg border border-gray-800/40">
                  <h3 className="font-medium text-lg mb-2 text-[#60A4FA]">Stay compliant</h3>
                  <p className="text-gray-400 text-sm">Our scrapers respect robots.txt rules and implement rate limiting to ensure responsible data collection practices.</p>
                </div>
                
                <div className="bg-[#1a1a1a]/50 p-5 rounded-lg border border-gray-800/40">
                  <h3 className="font-medium text-lg mb-2 text-[#60A4FA]">Future-proof solution</h3>
                  <p className="text-gray-400 text-sm">As websites evolve, our AI adapts automatically, eliminating the maintenance burden of traditional scrapers.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Feature Sections */}
      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        {features.map((feature, index) => (
          <FeatureSection
            key={feature.id}
            id={feature.id}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            features={feature.features}
            imageUrl={feature.imageUrl}
            reversed={feature.reversed}
          />
        ))}
      </div>
      
      {/* CTA Section */}
      <div className="py-20 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-[#1a1a1a] border border-gray-700/50 rounded-xl shadow-xl overflow-hidden">
            <div className="p-10 md:p-16 text-center relative">
              <div className="absolute top-0 right-0 w-60 h-60 bg-[#60A4FA]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              
              <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">
                Ready to transform your <span className="text-[#60A4FA]">data collection</span>?
              </h2>
              
              <p className="text-lg text-gray-300 mb-10 max-w-3xl mx-auto">
                Get started today with OmniCrawl and experience the future of web scraping.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="#" className="px-8 py-3 bg-[#60A4FA] text-[#111111] rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200 hover:shadow-[0_8px_20px_-6px_rgba(96,164,250,0.5)] hover:scale-[1.03]">
                  Request API Access
                </Link>
                
                <Link href="#" className="px-8 py-3 bg-transparent border border-[#60A4FA]/30 text-[#60A4FA] rounded-lg font-medium hover:border-[#60A4FA]/70 transition-all duration-200">
                  View Documentation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 