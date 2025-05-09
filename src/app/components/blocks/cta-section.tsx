"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

interface Dot {
  x: number;
  y: number;
  baseColor: string;
  targetOpacity: number;
  currentOpacity: number;
  opacitySpeed: number;
  baseRadius: number;
  currentRadius: number;
}

const CtaSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  // Animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0,
      y: 40,
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Interactive dots logic
  const dotsRef = useRef<Dot[]>([]);
  const gridRef = useRef<Record<string, number[]>>({});
  const canvasSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const mousePositionRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const boxRef = useRef<HTMLDivElement | null>(null);

  const DOT_SPACING = 30; // Closer dots for better coverage
  const BASE_OPACITY_MIN = 0.25;
  const BASE_OPACITY_MAX = 0.40;
  const BASE_RADIUS = 1;
  const INTERACTION_RADIUS = 150;
  const INTERACTION_RADIUS_SQ = INTERACTION_RADIUS * INTERACTION_RADIUS;
  const OPACITY_BOOST = 0.6;
  const RADIUS_BOOST = 2.5;
  const GRID_CELL_SIZE = Math.max(50, Math.floor(INTERACTION_RADIUS / 1.5));

  const handleMouseMove = useCallback((event: globalThis.MouseEvent) => {
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

  const createDots = useCallback(() => {
    const { width, height } = canvasSizeRef.current;
    if (width === 0 || height === 0) return;

    const newDots: Dot[] = [];
    const newGrid: Record<string, number[]> = {};
    const cols = Math.ceil(width / DOT_SPACING) + 1; // Add extra column
    const rows = Math.ceil(height / DOT_SPACING) + 1; // Add extra row

    // Create a more even distribution
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        // Add slight randomness to positions for a more natural look
        const randomOffsetX = Math.random() * (DOT_SPACING * 0.3);
        const randomOffsetY = Math.random() * (DOT_SPACING * 0.3);
        
        const x = i * DOT_SPACING + randomOffsetX;
        const y = j * DOT_SPACING + randomOffsetY;
        
        // Skip if outside bounds
        if (x > width || y > height) continue;
        
        const cellX = Math.floor(x / GRID_CELL_SIZE);
        const cellY = Math.floor(y / GRID_CELL_SIZE);
        const cellKey = `${cellX}_${cellY}`;

        if (!newGrid[cellKey]) {
          newGrid[cellKey] = [];
        }

        const dotIndex = newDots.length;
        newGrid[cellKey].push(dotIndex);

        // Vary opacities more for visual interest
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
    gridRef.current = newGrid;
  }, [DOT_SPACING, GRID_CELL_SIZE, BASE_OPACITY_MIN, BASE_OPACITY_MAX, BASE_RADIUS]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const boxElement = boxRef.current;
    
    if (!canvas || !boxElement) return;
    
    // Use the box container's dimensions
    const width = boxElement.clientWidth;
    const height = boxElement.clientHeight;

    if (canvas.width !== width || canvas.height !== height ||
        canvasSizeRef.current.width !== width || canvasSizeRef.current.height !== height)
    {
        canvas.width = width;
        canvas.height = height;
        canvasSizeRef.current = { width, height };
        createDots();
    }
  }, [createDots]);

  const animateDots = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const dots = dotsRef.current;
    const grid = gridRef.current;
    const { width, height } = canvasSizeRef.current;
    const { x: mouseX, y: mouseY } = mousePositionRef.current;

    if (!ctx || !dots || !grid || width === 0 || height === 0) {
        animationFrameId.current = requestAnimationFrame(animateDots);
        return;
    }

    ctx.clearRect(0, 0, width, height);

    const activeDotIndices = new Set<number>();
    if (mouseX !== null && mouseY !== null) {
        const mouseCellX = Math.floor(mouseX / GRID_CELL_SIZE);
        const mouseCellY = Math.floor(mouseY / GRID_CELL_SIZE);
        const searchRadius = Math.ceil(INTERACTION_RADIUS / GRID_CELL_SIZE);
        for (let i = -searchRadius; i <= searchRadius; i++) {
            for (let j = -searchRadius; j <= searchRadius; j++) {
                const checkCellX = mouseCellX + i;
                const checkCellY = mouseCellY + j;
                const cellKey = `${checkCellX}_${checkCellY}`;
                if (grid[cellKey]) {
                    grid[cellKey].forEach(dotIndex => activeDotIndices.add(dotIndex));
                }
            }
        }
    }

    dots.forEach((dot, index) => {
        dot.currentOpacity += dot.opacitySpeed;
        if (dot.currentOpacity >= dot.targetOpacity || dot.currentOpacity <= BASE_OPACITY_MIN) {
            dot.opacitySpeed = -dot.opacitySpeed;
            dot.currentOpacity = Math.max(BASE_OPACITY_MIN, Math.min(dot.currentOpacity, BASE_OPACITY_MAX));
            dot.targetOpacity = Math.random() * (BASE_OPACITY_MAX - BASE_OPACITY_MIN) + BASE_OPACITY_MIN;
        }

        let interactionFactor = 0;
        dot.currentRadius = dot.baseRadius;

        if (mouseX !== null && mouseY !== null && activeDotIndices.has(index)) {
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

        const colorMatch = dot.baseColor.match(
            /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
        );
        const r = colorMatch ? colorMatch[1] : "96";
        const g = colorMatch ? colorMatch[2] : "164";
        const b = colorMatch ? colorMatch[3] : "250";
        
        ctx.beginPath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalOpacity.toFixed(3)})`;
        ctx.arc(dot.x, dot.y, dot.currentRadius, 0, Math.PI * 2);
        ctx.fill();
    });

    animationFrameId.current = requestAnimationFrame(animateDots);
  }, [GRID_CELL_SIZE, INTERACTION_RADIUS, INTERACTION_RADIUS_SQ, OPACITY_BOOST, RADIUS_BOOST, BASE_OPACITY_MIN, BASE_OPACITY_MAX, BASE_RADIUS]);

  useEffect(() => {
    // Initialize boxRef
    const boxContainer = document.querySelector('.cta-box-container');
    if (boxContainer instanceof HTMLDivElement) {
      boxRef.current = boxContainer;
    }
    
    const checkAndResize = () => {
      handleResize();
      // Schedule frequent resize checks to ensure canvas matches container size
      setTimeout(checkAndResize, 1000); // Check every second during initial load
    };
    checkAndResize();
    
    const canvasElement = canvasRef.current;
    const handleMouseLeave = () => {
        mousePositionRef.current = { x: null, y: null };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);
    canvasElement?.addEventListener('mouseleave', handleMouseLeave);

    animationFrameId.current = requestAnimationFrame(animateDots);

    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        canvasElement?.removeEventListener('mouseleave', handleMouseLeave);
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
    };
  }, [handleResize, handleMouseMove, animateDots]);

  return (
    <section className="py-24 bg-[#0d0d0d] text-white relative z-10 overflow-hidden" ref={sectionRef}>
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Box Container */}
          <div className="relative bg-[#1a1a1a] border border-gray-700/50 rounded-xl shadow-xl overflow-hidden min-h-[500px] cta-box-container"
               ref={boxRef}>
            {/* Canvas for dots - moved inside the box */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-80" />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 z-1 pointer-events-none" style={{
              background: 'radial-gradient(circle at center, transparent 40%, rgba(26,26,26,0.8) 90%)'
            }}></div>

            {/* Background elements */}
            <div className="absolute left-5 top-1/4 w-60 h-60 bg-[#60A4FA]/5 rounded-full blur-3xl"></div>
            <div className="absolute right-5 bottom-1/4 w-80 h-80 bg-[#60A4FA]/5 rounded-full blur-3xl"></div>
            
            {/* Content */}
            <div className="relative z-10 p-10 md:p-16 text-center">
              <motion.h2 
                className="text-3xl md:text-5xl font-semibold text-white mb-6" 
                variants={itemVariants}
              >
                Ready to extract data from <span className="text-[#60A4FA]">any website</span>?
              </motion.h2>
              
              <motion.p 
                className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto"
                variants={itemVariants}
              >
                Get started today with our universal scraper API and transform how you collect web data.
              </motion.p>
              
              <motion.div variants={itemVariants}>
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#60A4FA] text-[#111111] text-base font-semibold rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-200 hover:shadow-[0_8px_20px_-6px_rgba(96,164,250,0.5)] hover:scale-[1.03]"
                >
                  Request API Access
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 ml-2" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </motion.div>
              
              <motion.div 
                className="mt-8 text-sm text-gray-500"
                variants={itemVariants}
              >
                Start with 100 free API calls each month. No credit card required.
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection; 