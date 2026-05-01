"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Target, BarChart3, Users, Zap, ArrowUpRight } from "lucide-react";
import Image from "next/image";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  image: string;
}

const services: Service[] = [
  {
    id: "short-form",
    title: "Short-Form Content",
    description: "Our cinematic approach captures attention in 0.5 seconds. We craft scroll-stopping reels and TikToks.",
    icon: <Play className="w-6 h-6" />,
    color: "#FF8C42",
    gradient: "from-[#FF8C42]/40 to-transparent",
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "brand-strategy",
    title: "Brand Strategy",
    description: "Methodical analysis meets creative storytelling. We build iconic identities designed for recognition.",
    icon: <Target className="w-6 h-6" />,
    color: "#00E5FF",
    gradient: "from-[#00E5FF]/40 to-transparent",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "growth",
    title: "Growth & Management",
    description: "Data-driven strategies that turn followers into communities and impressions into impact.",
    icon: <BarChart3 className="w-6 h-6" />,
    color: "#FFD700",
    gradient: "from-[#FFD700]/40 to-transparent",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "influencer",
    title: "Influencer Coordination",
    description: "Bridging the gap between brands and creators. We manage complex multi-creator orchestrations.",
    icon: <Users className="w-6 h-6" />,
    color: "#ADFF2F",
    gradient: "from-[#ADFF2F]/40 to-transparent",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "paid-ads",
    title: "Paid Ads & Boosting",
    description: "Strategic amplification that multiplies organic wins. We optimize every dollar for maximum ROI.",
    icon: <Zap className="w-6 h-6" />,
    color: "#FF1493",
    gradient: "from-[#FF1493]/40 to-transparent",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
  },
];

const BEZIER = [0.22, 1, 0.36, 1];

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((prev) => (prev + 1) % services.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + services.length) % services.length);

  return (
    <section id="services" className="relative min-h-screen bg-transparent flex flex-col items-center justify-center py-24 overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] bg-accent/5 blur-[150px] rounded-full opacity-30" />
      </div>


      {/* Slider Container with Viewport Entrance Animation */}
      <motion.div 
        initial={{ opacity: 0, y: 100, scale: 0.95, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ 
          duration: 1.2, 
          ease: [0.22, 1, 0.36, 1],
          staggerChildren: 0.1
        }}
        className="relative w-full max-w-7xl h-[460px] flex items-center justify-center px-4"
      >
        
        {/* Navigation Arrows */}
        <button 
          onClick={prev}
          className="absolute left-4 md:left-12 z-50 p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white/50 hover:text-white"
        >
          <ChevronLeft size={24} />
        </button>

        <button 
          onClick={next}
          className="absolute right-4 md:right-12 z-50 p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white/50 hover:text-white"
        >
          <ChevronRight size={24} />
        </button>

        {/* Carousel Content */}
        <div className="relative w-full h-full flex items-center justify-center [perspective:1500px]">
          <AnimatePresence mode="popLayout">
            {services.map((service, index) => {
              const position = index - activeIndex;
              const isCenter = position === 0;
              const isLeft = position === -1 || (activeIndex === 0 && index === services.length - 1);
              const isRight = position === 1 || (activeIndex === services.length - 1 && index === 0);

              if (!isCenter && !isLeft && !isRight) return null;

              // Determine stagger delay: Center first, then side cards quickly after
              const staggerDelay = isCenter ? 0.05 : 0.15;

              return (
                <motion.div
                  key={service.id}
                  animate={{
                    x: isCenter ? 0 : isLeft ? "-80%" : "80%",
                    zIndex: isCenter ? 30 : 20,
                    rotateY: isCenter ? 0 : isLeft ? 35 : -35,
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="absolute w-[280px] md:w-[480px] h-[340px] md:h-[420px] cursor-pointer flex items-center justify-center"
                  onClick={() => setActiveIndex(index)}
                >
                  {/* Entrance Wrapper: Handles the 3D 'thrown wobble' reveal */}
                  <motion.div
                    initial={{ 
                      opacity: 0, 
                      z: -800, 
                      scale: 0.8, 
                      filter: "blur(20px)",
                      rotateZ: -5,
                      rotateX: 10
                    }}
                    whileInView={{ 
                      opacity: 1, 
                      z: 0, 
                      scale: 1, 
                      filter: "blur(0px)",
                      rotateZ: 0,
                      rotateX: 0
                    }}
                    viewport={{ once: false, amount: 0.05 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 180, // Snappy throw
                      damping: 12,    // Low damping for 'wobble' effect
                      mass: 0.8,      // Light card feel
                      delay: staggerDelay 
                    }}
                    className="w-full h-full flex items-center justify-center"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Outer Colored Transparent Box */}
                    <div 
                      className="w-full h-full p-4 md:p-6 rounded-[40px] border transition-colors duration-700"
                      style={{ 
                        backgroundColor: `${service.color}15`,
                        borderColor: `${service.color}30`,
                        opacity: isCenter ? 1 : 0.4, // Dim the side boxes
                        scale: isCenter ? 1 : 0.85,  // Scale down the side boxes
                        transition: "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)"
                      }}
                    >
                      {/* The Opaque Card */}
                      <div 
                        className="w-full h-full bg-[#0F0F0F] rounded-[32px] border border-white/10 overflow-hidden flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative group"
                      >
                        
                        {/* Top Content: Visual */}
                        <div className="relative flex-1 overflow-hidden">
                          <div className={`absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent z-10`} />
                          <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-40 mix-blend-overlay z-10`} />
                          <Image 
                            src={service.image} 
                            alt={service.title} 
                            fill
                            className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority={index < 3}
                          />
                          
                          {/* Icon Overlay */}
                          <div className="absolute top-6 left-6 z-20 w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-xl">
                            {service.icon}
                          </div>
                        </div>

                        {/* Bottom Content: Info */}
                        <div className="p-5 md:p-6 space-y-3 bg-black/40 backdrop-blur-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: service.color }} />
                            <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/30">Service Package</span>
                          </div>
                          
                          <h3 className="font-serif text-xl md:text-3xl font-black italic tracking-tighter text-white leading-none">
                            {service.title.split(" ").map((word, i) => (
                              <span key={i} className={i === service.title.split(" ").length - 1 ? "text-accent" : ""}>
                                {word}{" "}
                              </span>
                            ))}
                          </h3>
                          
                          <p className="font-body text-white/40 text-[13px] md:text-sm leading-relaxed line-clamp-2">
                            {service.description}
                          </p>

                          <div className="pt-4 flex items-center justify-between">
                             <button className="flex items-center gap-2 font-display font-bold text-[10px] uppercase tracking-widest text-accent group/btn transition-all">
                                View Case Study
                                <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                             </button>
                             <div className="text-[10px] font-mono text-white/10">0{index + 1} / 0{services.length}</div>
                          </div>
                        </div>

                        {/* Active Border Effect */}
                        {isCenter && (
                          <motion.div 
                            layoutId="active-border"
                            className="absolute inset-0 border-2 border-accent/30 rounded-[32px] pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Pagination Dots */}
      <div className="mt-12 flex gap-3 z-10">
        {services.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              activeIndex === i ? "bg-accent w-8" : "bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
