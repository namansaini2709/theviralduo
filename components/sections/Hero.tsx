"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Play } from "lucide-react";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  { id: 1, content: "10M+ Views", color: "bg-accent", textColor: "text-white" },
  { id: 2, content: "Retention", color: "bg-accent", textColor: "text-white" },
  { id: 3, content: "Go Viral.", color: "bg-black", textColor: "text-white" },
  { id: 4, content: "50+ Brands", color: "bg-accent", textColor: "text-white" },
  { id: 5, content: "Production", color: "bg-white", textColor: "text-black" },
  { id: 6, content: "Hook. Line. Sinker.", color: "bg-accent", textColor: "text-white" },
  { id: 7, content: "Strategy", color: "bg-accent", textColor: "text-white" },
  { id: 8, content: "ROI Focused", color: "bg-black", textColor: "text-white" },
  { id: 9, content: "Retention Is King", color: "bg-white", textColor: "text-black" },
  { id: 10, content: "Growth", color: "bg-accent", textColor: "text-white" },
  { id: 11, content: "Viral Duo", color: "bg-accent", textColor: "text-white" },
  { id: 12, content: "Creative", color: "bg-black", textColor: "text-white" },
  { id: 13, content: "High Growth", color: "bg-white", textColor: "text-black" },
  { id: 14, content: "Scale", color: "bg-accent", textColor: "text-white" },
  { id: 15, content: "Mastering Reels", color: "bg-accent", textColor: "text-white" },
  { id: 16, content: "Data Driven", color: "bg-black", textColor: "text-white" },
  { id: 17, content: "Visuals", color: "bg-white", textColor: "text-black" },
  { id: 18, content: "Excellence", color: "bg-accent", textColor: "text-white" },
  { id: 19, content: "Content Machine", color: "bg-accent", textColor: "text-white" },
  { id: 20, content: "Viral Engineering", color: "bg-black", textColor: "text-white" },
  { id: 21, content: "Algorithm Hack", color: "bg-white", textColor: "text-black" },
  { id: 22, content: "Engagement", color: "bg-accent", textColor: "text-white" },
  { id: 23, content: "Cinematic.", color: "bg-black", textColor: "text-white" },
  { id: 24, content: "Trend Setter", color: "bg-accent", textColor: "text-white" },
  { id: 25, content: "Impact", color: "bg-accent", textColor: "text-white" },
  { id: 26, content: "Storytelling", color: "bg-black", textColor: "text-white" },
  { id: 27, content: "Direct Response", color: "bg-white", textColor: "text-black" },
  { id: 28, content: "High End", color: "bg-accent", textColor: "text-white" },
  { id: 29, content: "Results", color: "bg-black", textColor: "text-white" },
  { id: 30, content: "Peak Performance", color: "bg-accent", textColor: "text-white" },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const bgCardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: isMobile ? "+=150%" : "+=180%",
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          refreshPriority: 10,
          invalidateOnRefresh: true,
        }
      });

      // Initial state setup for cards behind
      gsap.set(bgCardsRef.current, {
        x: (i) => (i % 2 === 0 ? 10 + i : -10 - i),
        y: (i) => (i % 3 === 0 ? 10 + i : -10 - i),
        rotate: (i) => (i % 2 === 0 ? 3 : -3),
        scale: 0.85,
        opacity: 1,
        zIndex: 0,
      });

      // Phase 1: Hero Card Transform (0% - 20%)
      tl.to(heroCardRef.current, {
        scale: isMobile ? 0.6 : 0.7,
        y: isMobile ? -50 : -100,
        opacity: 0,
        duration: 0.2,
        ease: "power2.inOut",
      }, 0);

      // Phase 2: Card Reveal (20% - 70%)
      const columns = isMobile ? 2 : 5;
      const rows = isMobile ? 8 : 6;
      const visibleCards = bgCardsRef.current.slice(0, columns * rows);
      const totalCards = visibleCards.length;
      
      // Hide cards that don't fit the mobile grid
      bgCardsRef.current.forEach((card, i) => {
        if (i >= totalCards) {
          gsap.set(card, { display: "none" });
        }
      });

      visibleCards.forEach((card, i) => {
        const col = i % columns;
        const row = Math.floor(i / columns);
        
        const baseX = (col / (columns - 1)) * (isMobile ? 70 : 96) - (isMobile ? 35 : 48);
        const baseY = (row / (rows - 1)) * (isMobile ? 85 : 95) - (isMobile ? 42 : 45);
        
        const jitterX = (Math.random() - 0.5) * 1;
        const jitterY = (Math.random() - 0.5) * 1;
        const rotate = (Math.random() - 0.5) * 10;

        tl.to(card, {
          x: `${baseX + jitterX}vw`,
          y: `${baseY + jitterY}vh`,
          rotate: rotate,
          scale: isMobile ? 0.8 : 1,
          duration: 0.3,
          ease: "power2.out",
        }, 0.2 + (i / totalCards) * 0.2);
      });

      // Phase 3: Divergent Vanish (70% - 100%)
      tl.to(visibleCards, {
        x: (i) => {
          const col = i % columns;
          return col < columns / 2 ? "-160vw" : "160vw";
        },
        y: (i) => {
          const row = Math.floor(i / columns);
          return row < rows / 2 ? "-160vh" : "160vh";
        },
        opacity: 0,
        stagger: {
          amount: 0.15,
          from: "center",
        },
        duration: 0.3,
        ease: "power2.in",
      }, 0.7);

      tl.to(containerRef.current, {
        autoAlpha: 0,
        duration: 0.05,
      }, 0.95);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      id="top"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-transparent"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        
        {/* Background Cards Stack */}
        {CARDS.map((card, i) => (
          <div
            key={card.id}
            ref={(el) => { if (el) bgCardsRef.current[i] = el; }}
            className={`absolute w-fit h-fit min-w-[100px] md:min-w-[140px] px-4 md:px-8 py-3 md:py-6 ${card.color} border-2 md:border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_rgba(0,0,0,1)] rounded-xl md:rounded-2xl flex items-center justify-center select-none pointer-events-none group`}
          >
            <motion.div
              className="w-full h-full flex items-center justify-center pointer-events-auto"
              whileHover={{ 
                rotate: i % 2 === 0 ? 2 : -2,
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <span className={`font-display font-black text-center uppercase tracking-tight ${card.textColor} text-sm md:text-2xl whitespace-nowrap leading-none`}>
                {card.content}
              </span>
            </motion.div>
          </div>
        ))}

        {/* Hero Card */}
        <div 
          ref={heroCardRef}
          className="relative z-50 w-[90vw] md:w-[65vw] max-w-4xl bg-white border-8 border-black shadow-[30px_30px_0px_rgba(0,0,0,1)] rounded-3xl p-10 md:p-20 flex flex-col items-center justify-center text-center space-y-8"
        >
          {/* Logo */}
          <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-8 border-black shadow-[15px_15px_0px_rgba(0,0,0,1)]">
            <Image 
              src="/logo-v2.png" 
              alt="The Viral Duo" 
              fill 
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-4">
            <h1 className="font-display font-black text-4xl md:text-7xl tracking-tight text-black leading-none uppercase relative inline-block">
              THE VIRAL <span className="relative marker-highlight">DUO</span>
            </h1>
            <p className="font-handwritten text-2xl md:text-4xl text-black -rotate-1 mt-2">
              A Marketing Agency
            </p>
          </div>

          <button className="mt-4 group relative inline-flex items-center justify-center gap-3 px-8 py-4 font-bold text-black uppercase tracking-widest bg-transparent border-4 border-black rounded-full overflow-hidden hover:text-white transition-colors duration-300">
            <span className="absolute inset-0 w-full h-full bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center gap-3">
              <Play fill="currentColor" size={20} />
              Watch Showreel
            </span>
          </button>
        </div>

      </div>
    </section>
  );
}
