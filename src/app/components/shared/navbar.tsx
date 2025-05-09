"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Icon components
const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 ml-1 inline-block transition-transform duration-200 group-hover:rotate-180" {...props}>
     <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
   </svg>
);

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

const ExternalLinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 transition-opacity" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

interface NavLinkProps {
    href?: string;
    children: React.ReactNode;
    hasDropdown?: boolean;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href = "#", children, hasDropdown = false, className = "", onClick }) => (
   <motion.a
     href={href}
     onClick={onClick}
     className={`relative group text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 flex items-center py-1 ${className}`}
     whileHover="hover"
   >
     {children}
     {hasDropdown && <ChevronDownIcon />}
     {!hasDropdown && (
         <motion.div
           className="absolute bottom-[-2px] left-0 right-0 h-[1px] bg-[#60A4FA]"
           variants={{ initial: { scaleX: 0, originX: 0.5 }, hover: { scaleX: 1, originX: 0.5 } }}
           initial="initial"
           transition={{ duration: 0.3, ease: "easeOut" }}
         />
     )}
   </motion.a>
);

interface DropdownMenuProps {
    children: React.ReactNode;
    isOpen: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, isOpen }) => (
   <AnimatePresence>
     {isOpen && (
       <motion.div
         initial={{ opacity: 0, y: 10, scale: 0.95 }}
         animate={{ opacity: 1, y: 0, scale: 1 }}
         exit={{ opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15 } }}
         transition={{ duration: 0.2, ease: "easeOut" }}
         className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 origin-top z-40"
       >
           <div className="bg-[#111111] border border-gray-700/50 rounded-md shadow-xl p-2">
               {children}
           </div>
       </motion.div>
     )}
   </AnimatePresence>
);

interface DropdownItemProps {
    href?: string;
    children: React.ReactNode;
    icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ href = "#", children, icon }) => (
 <a
   href={href}
   className="group flex items-center justify-between w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/30 hover:text-white rounded-md transition-colors duration-150"
 >
   <span>{children}</span>
   {icon && React.cloneElement(icon, { className: "w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 transition-opacity" })}
 </a>
);

const Navbar: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial scroll position

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobileMenuOpen]);

    const headerVariants = {
        top: {
            backgroundColor: "rgba(17, 17, 17, 0.8)",
            borderBottomColor: "rgba(55, 65, 81, 0.5)",
            boxShadow: 'none',
        },
        scrolled: {
            backgroundColor: "rgba(17, 17, 17, 0.95)",
            borderBottomColor: "rgba(75, 85, 99, 0.7)",
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }
    };

    const mobileMenuVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.15, ease: "easeIn" } }
    };

    return (
        <motion.header
            variants={headerVariants}
            initial="top"
            animate={isScrolled ? "scrolled" : "top"}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="px-6 w-full md:px-10 lg:px-16 sticky top-0 z-30 backdrop-blur-md border-b"
        >
            <nav className="flex justify-between items-center max-w-screen-xl mx-auto h-[70px]">
                <div className="flex items-center flex-shrink-0">
                <Link href="/">
                    <img src="https://typhamswann.github.io/omnicrawler-site/omni_logo.png" alt="Omnicrawl logo" className="w-10 h-10" />
                </Link>
                    <Link href="/" className="text-xl font-bold text-white ml-2">OmniCrawl</Link>
                </div>

                <div className="hidden md:flex items-center justify-center flex-grow space-x-6 lg:space-x-8 px-4">
                    <NavLink href="/product">Product</NavLink>
                    <NavLink href="/docs">Docs</NavLink>
                    <NavLink href="#">Playground</NavLink>
                    <NavLink href="#">Pricing</NavLink>

                    <div
                        className="relative"
                        onMouseEnter={() => setOpenDropdown('resources')}
                        onMouseLeave={() => setOpenDropdown(null)}
                    >
                        <NavLink href="#" hasDropdown>Resources</NavLink>
                        <DropdownMenu isOpen={openDropdown === 'resources'}>
                            <DropdownItem href="#" icon={<ExternalLinkIcon/>}>Blog</DropdownItem>
                            <DropdownItem href="#">Guides</DropdownItem>
                            <DropdownItem href="#">Help Center</DropdownItem>
                            <DropdownItem href="#">API Reference</DropdownItem>
                        </DropdownMenu>
                    </div>
                    
                    <NavLink href="#">Contact</NavLink>
                </div>

                <div className="flex items-center flex-shrink-0 space-x-4 lg:space-x-6">
                    <NavLink href="#" className="hidden md:inline-block">Sign in</NavLink>

                    <motion.a
                        href="#"
                        className="bg-[#60A4FA] text-[#111111] px-4 py-[6px] rounded-md text-sm font-semibold hover:bg-opacity-90 transition-colors duration-200 whitespace-nowrap shadow-sm hover:shadow-md"
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                        Get API Key
                    </motion.a>

                    <motion.button
                        className="md:hidden text-gray-300 hover:text-white z-50"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    >
                        {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </motion.button>
                </div>
            </nav>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        key="mobile-menu"
                        variants={mobileMenuVariants} initial="hidden" animate="visible" exit="exit"
                        className="md:hidden absolute top-full left-0 right-0 bg-[#111111]/95 backdrop-blur-sm shadow-lg py-4 border-t border-gray-800/50"
                    >
                        <div className="flex flex-col items-center space-y-4 px-6">
                            <NavLink href="/product" onClick={() => setIsMobileMenuOpen(false)}>Product</NavLink>
                            <NavLink href="/docs" onClick={() => setIsMobileMenuOpen(false)}>Docs</NavLink>
                            <NavLink href="#" onClick={() => setIsMobileMenuOpen(false)}>Playground</NavLink>
                            <NavLink href="#" onClick={() => setIsMobileMenuOpen(false)}>Pricing</NavLink>
                            <NavLink href="#" onClick={() => setIsMobileMenuOpen(false)}>Resources</NavLink>
                            <NavLink href="#" onClick={() => setIsMobileMenuOpen(false)}>Contact</NavLink>
                            <hr className="w-full border-t border-gray-700/50 my-2"/>
                            <NavLink href="#" onClick={() => setIsMobileMenuOpen(false)}>Sign in</NavLink>
                            <motion.a
                                href="#"
                                className="bg-[#60A4FA] text-[#111111] px-4 py-[6px] rounded-md text-sm font-semibold hover:bg-opacity-90 transition-colors duration-200 whitespace-nowrap shadow-sm hover:shadow-md w-full text-center"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Get API Key
                            </motion.a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

export default Navbar; 