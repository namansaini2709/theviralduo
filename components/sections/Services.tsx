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
    color: "#FF8C42",
    gradient: "from-[#FF8C42]/40 to-transparent",
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "brand-strategy",
    title: "Brand Strategy",
    description: "Methodical analysis meets creative storytelling. We build iconic identities designed for recognition.",
    icon: <Target className="w-5 h-5" />,
    color: "#00E5FF",
    gradient: "from-[#00E5FF]/40 to-transparent",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "growth",
    title: "Growth & Management",
    description: "Data-driven strategies that turn followers into communities and impressions into impact.",
    icon: <BarChart3 className="w-5 h-5" />,
    color: "#FFD700",
    gradient: "from-[#FFD700]/40 to-transparent",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "influencer",
    title: "Influencer Coordination",
    description: "Bridging the gap between brands and creators. We manage complex multi-creator orchestrations.",
    icon: <Users className="w-5 h-5" />,
    color: "#ADFF2F",
    gradient: "from-[#ADFF2F]/40 to-transparent",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "paid-ads",
    title: "Paid Ads & Boosting",
    description: "Strategic amplification that multiplies organic wins. We optimize every dollar for maximum ROI.",
    icon: <Zap className="w-5 h-5" />,
    color: "#FF1493",
    gradient: "from-[#FF1493]/40 to-transparent",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
  },
];

export default function Services() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="services" className="relative min-h-screen bg-transparent flex flex-col items-center justify-center py-24 overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] bg-[radial-gradient(circle,rgba(230,57,70,0.03)_0%,transparent_70%)] opacity-50" />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] px-6 h-[500px]">
        <div className="flex w-full h-full gap-4 items-center justify-center">
          {services.map((service, index) => {
            const isHovered = hoveredIndex === index;
            const isAnyHovered = hoveredIndex !== null;
            
            // Width logic: 
            // - If hovered: 45%
            // - If another is hovered: 13.75%
            // - Default: 20%
            let width = "20%";
            if (isHovered) width = "45%";
            else if (isAnyHovered) width = "13.75%";

            return (
              <motion.div
                key={service.id}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                animate={{ width }}
                transition={{ type: "spring", stiffness: 300, damping: 30, mass: 1 }}
                className="relative h-full overflow-hidden rounded-[2rem] border border-black/10 cursor-pointer group"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                  <Image 
                    src={service.image} 
                    alt={service.title} 
                    fill
                    className={`object-cover transition-all duration-700 ${isHovered ? 'scale-105 opacity-10 blur-sm' : 'scale-110 opacity-5 grayscale'}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent opacity-80" />
                </div>

                {/* Content Container */}
                <div className="relative z-10 w-full h-full p-8 flex flex-col justify-between">
                  {/* Top Row: Icon & Title */}
                  <div className="flex flex-col gap-6">
                    <motion.div 
                      animate={{ 
                        scale: isHovered ? 1.2 : 1,
                        backgroundColor: isHovered ? service.color : "rgba(0,0,0,0.05)"
                      }}
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border border-black/10 transition-colors duration-500"
                    >
                      <div className={isHovered ? "text-white" : "text-black"}>
                        {service.icon}
                      </div>
                    </motion.div>

                    <div className="space-y-2">
                      <motion.h3 
                        animate={{ 
                          fontSize: isHovered ? "2rem" : "1.25rem",
                          color: isHovered ? "#000" : "rgba(0,0,0,0.7)"
                        }}
                        className="font-serif font-black italic leading-none tracking-tight"
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
                        <p className="text-black/70 font-medium text-sm md:text-base leading-relaxed max-w-[90%]">
                          {service.description}
                        </p>
                        
                        <button className="flex items-center gap-3 px-6 py-3 bg-black text-white rounded-full font-display font-bold text-xs uppercase tracking-widest hover:bg-accent transition-all transform hover:scale-105">
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
                      animate={{ opacity: isAnyHovered ? 0.1 : 0.3 }}
                      className="absolute bottom-8 right-8 font-mono text-4xl font-black text-black pointer-events-none"
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
