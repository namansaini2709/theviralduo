"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Service {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  color: string;
  yPos: number; // Percentage
  xPos: string;
}

const services: Service[] = [
  {
    id: "short-form",
    title: "Short-Form Content",
    shortDesc: "Client A: 50M views across 10 TikTok campaigns.",
    fullDesc: "Our cinematic approach to short-form content captures attention in the first 0.5 seconds. We craft scroll-stopping reels, TikToks, and Shorts designed for massive organic reach and engagement. By treating every vertical video as a professional production, we elevate your brand above the noise.",
    image: "/assets/services/clapboard.png",
    color: "#FF8C42",
    yPos: 15,
    xPos: "80%",
  },
  {
    id: "brand-strategy",
    title: "Brand Strategy",
    shortDesc: "Brand X saw a 300% lift in brand equity.",
    fullDesc: "Our methodical approach combines deep market analysis with creative storytelling. We build iconic identities designed for long-term recognition and trust. We don't just design logos; we craft the visual and narrative soul of your company, ensuring every touchpoint resonates with your core audience.",
    image: "/assets/services/palette.png",
    color: "#00E5FF",
    yPos: 35,
    xPos: "20%",
  },
  {
    id: "growth",
    title: "Growth & Account Management",
    shortDesc: "E-commerce store Z scaled to $1M ARR in 6 months.",
    fullDesc: "Data-driven growth strategies that turn followers into communities and impressions into impact. We provide dedicated strategists and real-time data visualizations to ensure your campaigns are scaling efficiently. Our management style is proactive, focused on the metrics that actually drive revenue.",
    image: "/assets/services/charts.png",
    color: "#FFD700",
    yPos: 55,
    xPos: "80%",
  },
  {
    id: "influencer",
    title: "Influencer Coordination",
    shortDesc: "Campaign A trended #1 on Twitter for 24 hours.",
    fullDesc: "We bridge the gap between brands and creators. By fostering authentic partnerships and managing complex multi-creator orchestrations, we ensure your message is amplified by the right voices. We handle the physical links and logistics so you can focus on the vision.",
    image: "/assets/services/links.png",
    color: "#ADFF2F",
    yPos: 75,
    xPos: "20%",
  },
  {
    id: "paid-ads",
    title: "Paid Ads & Boosting",
    shortDesc: "Brand B reduced CAC by 50% while doubling volume.",
    fullDesc: "Strategic paid amplification that multiplies your organic wins into scalable growth. We optimize every dollar for maximum ROI, using advanced targeting and high-converting creative. Our goal is to turn your marketing budget into a predictable engine for customer acquisition.",
    image: "/assets/services/money.png",
    color: "#FF1493",
    yPos: 95,
    xPos: "80%",
  },
];

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const pathLength = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });

  // Vertical sliding effect synchronized with scroll
  const bgLogoSlideY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          end: "bottom 20%",
        },
      });

      tl.fromTo(pathRef.current, 
        { strokeDashoffset: 6000, strokeDasharray: 6000 },
        { strokeDashoffset: 0, duration: 3, ease: "power2.inOut" }
      );

      itemsRef.current.forEach((item) => {
        if (!item) return;
        tl.from(item, {
          opacity: 0,
          scale: 0,
          y: 50,
          duration: 0.8,
          ease: "back.out(1.7)",
        }, "-=0.6");
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="services" 
      ref={containerRef} 
      className="relative min-h-[450vh] bg-black overflow-hidden select-none"
    >
      {/* 1. Sticky Reveal Background Logo */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <motion.div 
          style={{ y: bgLogoSlideY }}
          className="w-[55vw] max-w-[700px] opacity-35"
        >
          <Image 
            src="/assets/services/services-we-provide.png" 
            alt="Services We Provide" 
            width={700}
            height={400}
            className="w-full h-auto object-contain"
            quality={60}
            priority
          />
        </motion.div>
      </div>

      {/* 2. Scrolling Foreground Content */}
      <div className="absolute top-0 left-0 w-full h-full z-10 pt-32 pb-[20vh]">
        
        {/* Sticky Section Header (Subtle) */}
        <div className="sticky top-24 left-0 w-full flex justify-center z-20 opacity-10 pointer-events-none">
          <Image src="/assets/services/header.png" alt="" width={400} height={200} className="h-48 w-auto object-contain filter blur-md" />
        </div>

        {/* The Abstract Pathway & Service Objects Wrapper */}
        <div className="relative w-full h-full max-w-7xl mx-auto">
          
          {/* SVG Path */}
          <div className="absolute inset-0 z-0 opacity-40">
            <svg className="w-full h-full" viewBox="0 0 1000 4500" preserveAspectRatio="none">
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(0, 229, 255, 0.2)" />
                  <stop offset="25%" stopColor="rgba(255, 140, 66, 0.3)" />
                  <stop offset="50%" stopColor="rgba(255, 215, 0, 0.4)" />
                  <stop offset="75%" stopColor="rgba(173, 255, 47, 0.3)" />
                  <stop offset="100%" stopColor="rgba(255, 20, 147, 0.2)" />
                </linearGradient>
                <filter id="strong-glow">
                  <feGaussianBlur stdDeviation="25" result="blur" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="2" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              
              <path
                ref={pathRef}
                d="M 500 0 
                   C 500 200, 850 200, 850 450 
                   C 850 900, 150 900, 150 1350 
                   C 150 1800, 850 1800, 850 2250 
                   C 850 2700, 150 2700, 150 3150 
                   C 150 3600, 850 3600, 850 4050 
                   L 500 4500"
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="4"
              />

              <motion.path
                d="M 500 0 
                   C 500 200, 850 200, 850 450 
                   C 850 900, 150 900, 150 1350 
                   C 150 1800, 850 1800, 850 2250 
                   C 850 2700, 150 2700, 150 3150 
                   C 150 3600, 850 3600, 850 4050 
                   L 500 4500"
                fill="none"
                stroke="white"
                strokeWidth="5"
                filter="url(#strong-glow)"
                style={{ pathLength }}
                className="opacity-60"
              />
            </svg>
          </div>

          {/* Service Objects */}
          {services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => { itemsRef.current[index] = el; }}
              style={{ 
                top: `${service.yPos}%`, 
                left: service.xPos, 
                position: "absolute",
                transform: "translate(-50%, -50%)"
              }}
              className="w-[35vw] max-w-[450px] z-30"
            >
              <ServiceObject 
                service={service} 
                isHovered={hoveredId === service.id}
                isActive={activeId === service.id}
                onHover={() => setHoveredId(service.id)}
                onLeave={() => setHoveredId(null)}
                onClick={() => setActiveId(service.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Description Overlay Pane */}
      <AnimatePresence>
        {activeId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, scale: 1, backdropFilter: "blur(25px)" }}
            exit={{ opacity: 0, scale: 0.9, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-8 pointer-events-none"
          >
            <div className="max-w-2xl w-full glass-container p-12 rounded-[40px] border border-white/10 relative overflow-hidden pointer-events-auto shadow-[0_0_100px_rgba(0,0,0,0.8)]">
              <div 
                className="absolute -top-32 -right-32 w-80 h-80 blur-[120px] rounded-full opacity-50"
                style={{ backgroundColor: services.find(s => s.id === activeId)?.color }}
              />
              
              <h2 className="font-serif text-5xl text-white mb-8 tracking-tight italic leading-tight">
                {services.find(s => s.id === activeId)?.title}
              </h2>
              
              <div className="space-y-8">
                <p className="font-body text-white/30 uppercase tracking-[0.4em] text-[10px] font-black">
                  Service Strategy & impact
                </p>
                <p className="font-body text-xl text-white/90 leading-relaxed font-light">
                  {services.find(s => s.id === activeId)?.fullDesc}
                </p>
                
                <div className="pt-10 flex items-center gap-8 border-t border-white/5">
                  <div 
                    className="h-12 w-[3px] rounded-full shadow-[0_0_15px_currentColor]" 
                    style={{ backgroundColor: services.find(s => s.id === activeId)?.color, color: services.find(s => s.id === activeId)?.color }}
                  />
                  <div className="space-y-2">
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black">Success Metric</p>
                    <p className="text-white font-serif text-2xl italic tracking-tight">{services.find(s => s.id === activeId)?.shortDesc}</p>
                  </div>
                </div>
              </div>

              <div className="mt-16 flex justify-end">
                <button 
                  onClick={() => setActiveId(null)}
                  className="group relative px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white text-xs uppercase tracking-[0.3em] font-black transition-all overflow-hidden"
                >
                  <span className="relative z-10">Close Space</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ServiceObject({ service, isHovered, isActive, onHover, onLeave, onClick }: { 
  service: Service, 
  isHovered: boolean, 
  isActive: boolean, 
  onHover: () => void, 
  onLeave: () => void, 
  onClick: () => void 
}) {
  return (
    <div 
      className="relative group cursor-pointer"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <motion.div
        animate={{ 
          scale: (isHovered || isActive) ? 1.1 : 1,
          filter: (isHovered || isActive) ? "brightness(1.2) contrast(1.1) drop-shadow(0 0 30px currentColor)" : "brightness(1) contrast(1)"
        }}
        transition={{ 
          type: "spring", stiffness: 300, damping: 20
        }}
        style={{ color: service.color }}
        className="relative z-10"
      >
        <Image 
          src={service.image} 
          alt={service.title} 
          width={450}
          height={450}
          className="w-full h-auto object-contain drop-shadow-[0_0_50px_rgba(0,0,0,0.9)]"
          loading="lazy"
          quality={75}
        />

        <AnimatePresence>
          {(isHovered || isActive) && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 2.5, opacity: [0, 0.4, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 m-auto w-48 h-48 border-[2px] border-white/20 rounded-full"
              style={{ boxShadow: `0 0 60px ${service.color}66` }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      <div className="mt-8 text-center glass-container py-4 px-6 rounded-2xl backdrop-blur-md border border-white/5">
        <motion.h3 
          className="font-serif text-3xl md:text-5xl text-white/95 tracking-tighter drop-shadow-2xl italic leading-none"
          animate={{ 
            letterSpacing: (isHovered || isActive) ? "0.02em" : "-0.02em",
            y: (isHovered || isActive) ? -5 : 0
          }}
        >
          {service.title}
        </motion.h3>
        
        <AnimatePresence>
          {(isHovered || isActive) && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 text-white/50 text-[10px] uppercase tracking-[0.4em] font-black max-w-[250px] mx-auto leading-relaxed"
            >
              {service.shortDesc}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] blur-[120px] rounded-full -z-10 transition-opacity duration-1000 ${isHovered ? "opacity-40" : "opacity-0"}`}
        style={{ backgroundColor: service.color }}
      />
    </div>
  );
}
