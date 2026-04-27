"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Navigation() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const threshold = window.innerHeight * 1.5;
      setIsVisible(scrollPosition > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Work", href: "#movie-reel" },
    { label: "Process", href: "#services" },
    { label: "Nexus", href: "#about" },
    { label: "Studio", href: "#contact" }
  ];

  const menuVariants = {
    closed: { opacity: 0, height: 0, marginTop: 0 },
    open: { opacity: 1, height: "auto", marginTop: 24 }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ opacity: 0, y: -20, x: "-50%" }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            x: "-50%",
            width: isMobileMenuOpen ? "90vw" : "min(900px, 90vw)", // Responsive width
            scale: isHovered ? 1.01 : 1, 
          }}
          exit={{ opacity: 0, y: -20, x: "-50%" }}
          onMouseEnter={() => !isMobileMenuOpen && setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 30,
            duration: 0.5 
          }}
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex flex-col bg-[#050505]/80 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto transition-colors duration-500 ${
            isMobileMenuOpen ? "rounded-[2rem] p-8" : "rounded-full h-[64px] px-8 py-0 items-center justify-between"
          }`}
        >
          <div className={`flex items-center justify-between w-full ${isMobileMenuOpen ? "h-auto" : "h-full"}`}>
            {/* Logo */}
            <motion.button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              animate={{ 
                scale: isHovered ? 1.1 : 1,
              }}
              className="flex items-center space-x-2 cursor-pointer h-10 w-10 relative overflow-hidden rounded-full border border-white/10"
            >
              <Image 
                src="/logo-v2.png" 
                alt="The Viral Duo" 
                fill 
                className="object-cover"
              />
            </motion.button>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-10">
              {navLinks.map((link, i) => (
                <motion.button
                  key={i}
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("page-transition", { detail: link.href }));
                  }}
                  animate={{ 
                    opacity: isHovered ? 1 : 0.5,
                    scale: isHovered ? 1.1 : 1,
                    x: isHovered ? 0 : 10
                  }}
                  transition={{ delay: i * 0.05 }}
                  className="font-display text-[10px] uppercase tracking-[0.4em] text-white hover:text-white transition-all duration-300"
                >
                  {link.label}
                </motion.button>
              ))}
            </div>

            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex flex-col space-y-1.5 md:hidden p-2"
            >
              <motion.span 
                animate={isMobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-white/70 block"
              />
              <motion.span 
                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-4 h-0.5 bg-white/70 block ml-auto"
              />
              <motion.span 
                animate={isMobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-white/70 block"
              />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={menuVariants}
                className="flex flex-col space-y-6 md:hidden overflow-hidden"
              >
                {navLinks.map((link, i) => (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      window.dispatchEvent(new CustomEvent("page-transition", { detail: link.href }));
                    }}
                    className="font-display text-sm uppercase tracking-[0.3em] text-white/60 hover:text-white py-2 border-b border-white/5 text-left"
                  >
                    {link.label}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
