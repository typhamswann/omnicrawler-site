"use client";

import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

const LoadingSpinner = () => (
  <div className="relative w-12 h-12">
    <div className="absolute inset-0 border-4 border-[#60A4FA]/20 rounded-full"></div>
    <div className="absolute inset-0 border-4 border-transparent border-t-[#60A4FA] rounded-full animate-spin"></div>
  </div>
);

const ScraperTestSection: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<'initial' | 'loading' | 'email' | 'result'>('initial');
  
  // Ref for the section container to detect when it's in view
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.15 });

  // Animation variants for the container - enhanced for more noticeable effect
  const containerVariants = {
    hidden: { 
      opacity: 0,
      y: 70,
      scale: 0.97,
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1], // Custom ease curve for smooth entrance
        opacity: { duration: 0.6 },
        y: { duration: 0.8, type: "spring", stiffness: 100 },
        scale: { duration: 0.8 }
      }
    }
  };

  // Listen for the custom event from the hero section
  useEffect(() => {
    const handleTriggerScraper = (event: CustomEvent<{ url: string }>) => {
      const urlFromHero = event.detail.url;
      setUrl(urlFromHero);
      handleScraperRequest(urlFromHero);
    };

    // Check for URL in sessionStorage (in case of page refresh)
    const savedUrl = sessionStorage.getItem('scraperUrl');
    if (savedUrl) {
      setUrl(savedUrl);
      sessionStorage.removeItem('scraperUrl'); // Clear after using
    }

    // Add event listener
    window.addEventListener('triggerScraper', handleTriggerScraper as EventListener);

    // Clean up
    return () => {
      window.removeEventListener('triggerScraper', handleTriggerScraper as EventListener);
    };
  }, []);

  const handleScraperRequest = (urlToScrape: string) => {
    if (!urlToScrape) return;
    
    // Reset states
    setIsLoading(true);
    setResult(null);
    setShowEmailForm(false);
    setProcessingStage('loading');
    
    // Step 1: Show loading spinner
    setTimeout(() => {
      // Step 2: Always show email form
      setShowEmailForm(true);
      setProcessingStage('email');
      
      // Step 3: After a delay (simulating email submission), show the result
      setTimeout(() => {
        const resultJson = JSON.stringify({
          title: "Example Scraped Page",
          description: "This is an example of scraped content from the provided URL.",
          url: urlToScrape,
          content: [
            { type: "heading", text: "Main Heading" },
            { type: "paragraph", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget ultricies aliquam, nunc nisl ultricies nunc, quis ultricies nisl nisl quis nisl." },
            { type: "list", items: ["Item 1", "Item 2", "Item 3"] }
          ]
        }, null, 2);
        
        // Auto-submit email if provided, otherwise wait for user input
        if (email) {
          handleEmailSubmissionComplete(resultJson);
        }
      }, 2000);
    }, 3000);
  };

  const handleEmailSubmissionComplete = (resultJson: string) => {
    setIsLoading(false);
    setShowEmailForm(false);
    setResult(resultJson);
    setProcessingStage('result');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleScraperRequest(url);
  };

  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate email submission and show results
    setTimeout(() => {
      const resultJson = JSON.stringify({
        title: "Example Scraped Page",
        description: "This is an example of scraped content from the provided URL.",
        url: url,
        content: [
          { type: "heading", text: "Main Heading" },
          { type: "paragraph", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget ultricies aliquam, nunc nisl ultricies nunc, quis ultricies nisl nisl quis nisl." },
          { type: "list", items: ["Item 1", "Item 2", "Item 3"] }
        ]
      }, null, 2);
      
      handleEmailSubmissionComplete(resultJson);
    }, 1000);
  };

  return (
    <section id="scraper-section" className="py-0 pt-2 bg-[#111111] text-white relative z-10" ref={sectionRef}>
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div 
          className="bg-[#1a1a1a] border border-gray-700/50 rounded-xl shadow-xl p-8 md:p-12 relative overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          whileInView="visible"
        >
          {/* Animated highlight glow */}
          <motion.div 
            className="absolute inset-0 bg-[#60A4FA]/5 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: [0, 0.8, 0] } : { opacity: 0 }}
            transition={{ duration: 1.5, delay: 0.3, times: [0, 0.5, 1] }}
          />
          
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#111111] opacity-80 pointer-events-none"></div>
          
          {/* Content */}
          <div className="relative z-10">
            <div className="flex flex-col items-center justify-center text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
                Try the <span className="text-[#60A4FA]">OmniCrawl Scraper</span> for yourself
              </h2>
              <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto">
                Enter any URL and we'll extract structured data from the page. 
                Our AI-powered scraper works on virtually any website.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              {processingStage === 'initial' && (
                <motion.form 
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <input
                    type="url"
                    placeholder="Enter a URL to scrape (e.g., https://example.com)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="flex-grow px-5 py-4 rounded-md bg-[#2a2a2a] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#60A4FA] focus:border-transparent transition-all"
                  />
                  <motion.button
                    type="submit"
                    className="bg-[#60A4FA] text-[#111111] px-7 py-4 rounded-md text-sm font-semibold hover:bg-opacity-90 transition-colors duration-200 whitespace-nowrap shadow-sm hover:shadow-md flex-shrink-0"
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    Scrape Now
                  </motion.button>
                </motion.form>
              )}
              
              {processingStage === 'loading' && (
                <motion.div 
                  className="flex flex-col items-center justify-center py-14"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <LoadingSpinner />
                  <p className="text-gray-300 mt-6 mb-2 font-medium text-lg">
                    This may take a bit. We slow down to make sure we get everything.
                  </p>
                </motion.div>
              )}
              
              {processingStage === 'email' && (
                <motion.div 
                  className="flex flex-col items-center justify-center py-14"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <LoadingSpinner />
                  <p className="text-gray-300 mt-6 mb-2 font-medium text-lg">
                    Almost there! We're processing {url}
                  </p>
                  
                  <motion.div 
                    className="mt-8 w-full max-w-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <p className="text-gray-400 mb-4 text-base">
                      Need to do something else? Enter your email and we'll send you the output when it's done.
                    </p>
                    <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-grow px-5 py-4 rounded-md bg-[#2a2a2a] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#60A4FA] focus:border-transparent transition-all"
                      />
                      <motion.button
                        type="submit"
                        className="bg-[#60A4FA] text-[#111111] px-6 py-4 rounded-md text-sm font-semibold hover:bg-opacity-90 transition-colors duration-200 whitespace-nowrap shadow-sm hover:shadow-md flex-shrink-0"
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        Notify Me
                      </motion.button>
                    </form>
                  </motion.div>
                </motion.div>
              )}
              
              {processingStage === 'result' && (
                <motion.div 
                  className="bg-[#0d0d0d] border border-gray-800 rounded-lg p-6 mt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[#60A4FA] font-medium text-lg">Scraping Results</h3>
                    <button 
                      onClick={() => {
                        setResult(null);
                        setIsLoading(false);
                        setShowEmailForm(false);
                        setUrl('');
                        setEmail('');
                        setProcessingStage('initial');
                      }}
                      className="text-gray-500 hover:text-white text-sm"
                    >
                      Try Another URL
                    </button>
                  </div>
                  <pre className="text-left overflow-auto text-sm text-gray-300 max-h-[500px] p-4">
                    {result}
                  </pre>
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Decorative dots */}
          <div className="absolute top-8 right-8 w-24 h-24 opacity-30">
            <div className="absolute top-0 left-0 w-2 h-2 rounded-full bg-[#60A4FA]"></div>
            <div className="absolute top-0 left-8 w-2 h-2 rounded-full bg-[#60A4FA]"></div>
            <div className="absolute top-0 left-16 w-2 h-2 rounded-full bg-[#60A4FA]"></div>
            <div className="absolute top-8 left-0 w-2 h-2 rounded-full bg-[#60A4FA]"></div>
            <div className="absolute top-8 left-8 w-2 h-2 rounded-full bg-[#60A4FA]"></div>
            <div className="absolute top-8 left-16 w-2 h-2 rounded-full bg-[#60A4FA]"></div>
            <div className="absolute top-16 left-0 w-2 h-2 rounded-full bg-[#60A4FA]"></div>
            <div className="absolute top-16 left-8 w-2 h-2 rounded-full bg-[#60A4FA]"></div>
            <div className="absolute top-16 left-16 w-2 h-2 rounded-full bg-[#60A4FA]"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ScraperTestSection; 