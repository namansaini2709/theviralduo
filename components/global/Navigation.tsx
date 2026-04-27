"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { UserRound } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "Work", href: "#movie-reel" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
];

const BEZIER = [0.22, 1, 0.36, 1];

function MagneticLink({ children, onClick, active }: { children: React.ReactNode; onClick: () => void; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.35);
    y.set((clientY - centerY) * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseX, y: mouseY }}
      className="relative px-4 py-2 cursor-pointer group"
      onClick={onClick}
    >
      <motion.span
        className={`relative z-10 text-sm font-medium transition-colors duration-300 ${
          active ? "text-white" : "text-white/70 group-hover:text-white"
        }`}
        animate={{ scale: active ? 1.05 : 1 }}
      >
        {children}
      </motion.span>
      
      {/* Active Indicator Removed */}

      {/* Hover Glow Pill */}
      <motion.div
        className="absolute inset-0 z-0 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
        whileHover={{ scale: 1.1 }}
      />
    </motion.div>
  );
}

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Stay full-width until we've scrolled past the initial hero phase
      // 600px is a good threshold for the pinned hero animation
      setIsScrolled(window.scrollY > 600);
      
      // Update active section based on scroll position
      const sections = NAV_LINKS.map(link => link.href.replace("#", ""));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= element.offsetTop - 200) {
          setActiveSection(NAV_LINKS.find(l => l.href === `#${section}`)?.label || "Home");
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: -20, x: "-50%" },
    visible: {
      opacity: 1,
      y: 0,
      x: "-50%",
      transition: {
        duration: 0.6,
        ease: BEZIER,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: BEZIER } },
  };

  const scrollTo = (href: string, label: string) => {
    setIsMobileMenuOpen(false);
    setActiveSection(label);
    if (href === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        window.dispatchEvent(new CustomEvent("page-transition", { detail: href }));
      }
    }
  };

  return (
    <>
      <motion.nav
        ref={navRef}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ 
          height: isScrolled ? 56 : 84,
          width: isScrolled ? "min(1100px, 95vw)" : "100%",
          backgroundColor: isScrolled ? "rgba(8, 8, 8, 0.65)" : "rgba(8, 8, 8, 0.15)",
          backdropFilter: "blur(20px)",
        }}
        className={`fixed top-0 left-1/2 z-[100] flex items-center justify-between px-6 md:px-10 transition-all duration-700 ease-[cubic-bezier(0.22, 1, 0.36, 1)] ${
          isScrolled ? "top-4 rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]" : "border-b border-white/10"
        }`}
      >
        {/* Premium Animated Gradient Line (only when not scrolled) */}
        {!isScrolled && (
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )}

        {/* Glow Follower Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
          <motion.div
            className="absolute w-40 h-40 bg-accent/15 blur-[80px] rounded-full"
            animate={{
              x: hoveredIndex !== null ? (hoveredIndex * 80) + 220 : -400,
              opacity: hoveredIndex !== null ? 1 : 0
            }}
            transition={{ type: "spring", stiffness: 120, damping: 25 }}
          />
        </div>

        {/* Logo Section */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center gap-2.5 cursor-pointer group z-10"
          onClick={() => scrollTo("#top", "Home")}
        >
          <div className="relative w-7 h-7 md:w-9 md:h-9 rounded-lg overflow-hidden border border-white/10 group-hover:border-accent/50 transition-colors duration-500 shadow-lg">
            <Image 
              src="/logo-v2.png" 
              alt="The Viral Duo" 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <span className="hidden md:block font-display font-bold text-base tracking-tight text-white group-hover:text-accent transition-colors duration-300">
            THE VIRAL <span className="text-accent">DUO</span>
          </span>
        </motion.div>

        {/* Desktop Links Container */}
        <div className="hidden md:flex items-center gap-0.5 bg-white/5 px-1.5 py-1 rounded-full border border-white/5 backdrop-blur-md z-10 shadow-inner">
          {NAV_LINKS.map((link, i) => (
            <motion.div
              key={link.label}
              variants={itemVariants}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <MagneticLink
                active={activeSection === link.label}
                onClick={() => scrollTo(link.href, link.label)}
              >
                {link.label}
              </MagneticLink>
            </motion.div>
          ))}
        </div>

        {/* Action Button */}
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(230,57,70,0.3)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => scrollTo("#contact", "Contact")}
          className="hidden md:flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full font-bold text-xs transition-all duration-300 z-10 border border-white/20"
        >
          <UserRound size={14} strokeWidth={2.5} />
          LET&apos;S TALK
        </motion.button>

        {/* Mobile Toggle */}
        <motion.button
          variants={itemVariants}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex md:hidden flex-col gap-1.5 p-2 z-50"
        >
          <motion.div 
            animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className="w-6 h-0.5 bg-white rounded-full shadow-glow"
          />
          <motion.div 
            animate={isMobileMenuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
            className="w-4 h-0.5 bg-white rounded-full self-end shadow-glow"
          />
          <motion.div 
            animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className="w-6 h-0.5 bg-white rounded-full shadow-glow"
          />
        </motion.button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4, ease: BEZIER }}
              className="absolute top-full left-0 right-0 mt-4 mx-4 bg-zinc-900/98 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col gap-6 md:hidden z-40 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  onClick={() => scrollTo(link.href, link.label)}
                  className={`text-3xl font-display font-bold text-left transition-all ${
                    activeSection === link.label ? "text-accent translate-x-2" : "text-white/40 hover:text-white"
                  }`}
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => scrollTo("#contact", "Contact")}
                className="mt-4 bg-accent text-white py-5 rounded-3xl font-bold text-xl shadow-[0_10px_30px_rgba(230,57,70,0.4)]"
              >
                GET IN TOUCH
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
