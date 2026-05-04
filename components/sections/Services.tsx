"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Target, BarChart3, Users, Zap, ArrowUpRight } from "lucide-react";
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
    icon: <Play className="w-5 h-5" />,
    color: "#FF4D6D",
    gradient: "from-[#FF4D6D]/40 to-transparent",
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "brand-strategy",
    title: "Brand Strategy",
    description: "Methodical analysis meets creative storytelling. We build iconic identities designed for recognition.",
    icon: <Target className="w-5 h-5" />,
    color: "#4DB8E5",
    gradient: "from-[#4DB8E5]/40 to-transparent",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "growth",
    title: "Growth & Management",
    description: "Data-driven strategies that turn followers into communities and impressions into impact.",
    icon: <BarChart3 className="w-5 h-5" />,
    color: "#FFD43B",
    gradient: "from-[#FFD43B]/40 to-transparent",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "influencer",
    title: "Influencer Coordination",
    description: "Bridging the gap between brands and creators. We manage complex multi-creator orchestrations.",
    icon: <Users className="w-5 h-5" />,
    color: "#FFA726",
    gradient: "from-[#FFA726]/40 to-transparent",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "paid-ads",
    title: "Paid Ads & Boosting",
    description: "Strategic amplification that multiplies organic wins. We optimize every dollar for maximum ROI.",
    icon: <Zap className="w-5 h-5" />,
    color: "#FF4D6D",
    gradient: "from-[#FF4D6D]/40 to-transparent",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
  },
];

export default function Services() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="services" className="relative min-h-fit bg-transparent flex flex-col items-center justify-center pt-0 pb-12 overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] bg-[radial-gradient(circle,rgba(230,57,70,0.03)_0%,transparent_70%)] opacity-50" />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] px-6">
        <div className="flex flex-col md:flex-row w-full gap-4 items-stretch justify-center min-h-[500px]">
          {services.map((service, index) => {
            const isHovered = hoveredIndex === index;
            const isAnyHovered = hoveredIndex !== null;
            
            // Width/Height logic for responsive behavior
            // On desktop: dynamic width
            // On mobile: full width, dynamic height
            return (
              <motion.div
                key={service.id}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                animate={{ 
                  width: typeof window !== 'undefined' && window.innerWidth < 768 ? "100%" : (isHovered ? "45%" : (isAnyHovered ? "13.75%" : "20%")),
                  height: typeof window !== 'undefined' && window.innerWidth < 768 ? (isHovered ? "400px" : "120px") : "500px",
                  backgroundColor: isHovered ? "#0a2a4d" : "#1E5AA8"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30, mass: 1 }}
                className="relative h-full overflow-hidden rounded-[2rem] border border-white/10 cursor-pointer group"
              >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                  <Image 
                    src={service.image} 
                    alt={service.title} 
                    fill
                    className={`object-cover transition-all duration-700 ${isHovered ? 'scale-105 opacity-30 blur-sm' : 'scale-110 opacity-10 grayscale'}`}
                  />
                  <motion.div 
                    animate={{
                      background: isHovered 
                        ? "linear-gradient(to top, #0a2a4d 0%, rgba(10,42,77,0.8) 50%, transparent 100%)"
                        : "linear-gradient(to top, #1E5AA8 0%, rgba(30,90,168,0.8) 50%, transparent 100%)"
                    }}
                    className="absolute inset-0 opacity-90" 
                  />
                </div>

                {/* Content Container */}
                <div className="relative z-10 w-full h-full p-8 flex flex-col justify-between">
                  {/* Top Row: Icon & Title */}
                  <div className="flex flex-col gap-6">
                    <motion.div 
                      animate={{ 
                        scale: isHovered ? 1.2 : 1,
                        backgroundColor: isHovered ? "#000" : "rgba(255,255,255,0.2)"
                      }}
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 transition-colors duration-500"
                    >
                      <div className="text-white">
                        {service.icon}
                      </div>
                    </motion.div>

                    <div className="space-y-2">
                      <motion.h3 
                        animate={{ 
                          fontSize: isHovered ? "2rem" : "1.25rem",
                          color: "#FFF"
                        }}
                        className="font-serif font-black italic leading-none tracking-tight text-white"
                      >
                        {service.title}
                      </motion.h3>
                    </div>
                  </div>

                  {/* Bottom Row: Description & Button (Visible on Hover) */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="space-y-6"
                      >
                        <p className="text-white font-medium text-sm md:text-base leading-relaxed max-w-[90%]">
                          {service.description}
                        </p>
                        
                        <button className="flex items-center gap-3 px-6 py-3 bg-white text-brand-deep rounded-full font-display font-bold text-xs uppercase tracking-widest hover:bg-brand-pink hover:text-white transition-all transform hover:scale-105">
                          Learn More
                          <ArrowUpRight size={16} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Index Number (Visible when not hovered) */}
                  {!isHovered && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isAnyHovered ? 0.2 : 0.4 }}
                      className="absolute bottom-8 right-8 font-mono text-4xl font-black text-white pointer-events-none"
                    >
                      0{index + 1}
                    </motion.div>
                  )}
                </div>

                {/* Hover Glow Effect */}
                <motion.div 
                  animate={{ opacity: isHovered ? 0.3 : 0 }}
                  className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,var(--glow-color)_0%,transparent_70%)]"
                  style={{ "--glow-color": service.color } as any}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
