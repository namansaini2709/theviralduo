"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Heart, MessageCircle, Share2, TrendingUp } from "lucide-react";

const ICONS = [Heart, MessageCircle, Share2, TrendingUp];

const GRID_ITEMS = [
  { type: "text", row: 0, col: 0 },
  { type: "icon", row: 0, col: 1 },
  { type: "icon", row: 1, col: 0 },
  { type: "text", row: 1, col: 1 },
  { type: "text", row: 2, col: 0 },
  { type: "icon", row: 2, col: 1 },
  { type: "icon", row: 3, col: 0 },
  { type: "text", row: 3, col: 1 },
];

export default function FloatingParticlesBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const elements = containerRef.current.children;
    
    // Parallax on mouse move
    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      
      gsap.to(elements, {
        x: (index) => x * ((index % 3) + 1) * -1,
        y: (index) => y * ((index % 3) + 1) * -1,
        duration: 1,
        ease: "power2.out"
      });
    };

    window.addEventListener("mousemove", onMouseMove);

    // Continuous floating animation
    Array.from(elements).forEach((el) => {
      gsap.to(el, {
        y: `+=${Math.random() * 100 + 50}`,
        rotation: Math.random() * 20 - 10,
        duration: Math.random() * 10 + 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * -20,
      });
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // Generate deterministic elements to avoid hydration mismatch
  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#F0F9FF] bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE]"
    >
      {/* Layer 2: Watermarks and Large Icons Grid */}
      {GRID_ITEMS.map((item, i) => {
        const topPos = item.row * 25 + 10;
        const leftPos = item.col * 60 + (item.row % 2 === 1 ? 30 : 0) - 10;
        
        if (item.type === "text") {
          return (
            <div
              key={`grid-${i}`}
              className="absolute font-display font-black text-brand-deep uppercase opacity-[0.04] whitespace-nowrap"
              style={{
                top: `${topPos}%`,
                left: `${leftPos}%`,
                fontSize: `min(7vw, 100px)`,
                transform: `rotate(5deg)`,
                letterSpacing: '0.05em'
              }}
            >
              THE VIRAL DUO
            </div>
          );
        } else {
          const Icon = ICONS[i % ICONS.length];
          return (
            <div
              key={`grid-${i}`}
              className="absolute text-brand-sky opacity-[0.2] drop-shadow-sm"
              style={{
                top: `${topPos + 5}%`,
                left: `${leftPos + 20}%`,
                transform: `rotate(${i % 2 === 0 ? 15 : -15}deg)`,
              }}
            >
              <Icon size={100} strokeWidth={2} />
            </div>
          );
        }
      })}

      {/* Layer 3 & 4: Social Icons with slight depth */}
      {[...Array(15)].map((_, i) => {
        const Icon = ICONS[i % ICONS.length];
        const isBlurry = i % 3 === 0;
        const sizeMultiplier = (i % 3) + 1; // 1, 2, or 3
        
        return (
          <div
            key={`icon-${i}`}
            className="absolute text-brand-sky opacity-[0.25] drop-shadow-sm"
            style={{
              top: `${(i * 17) % 90 + 5}%`,
              left: `${(i * 23) % 90 + 5}%`,
              transform: `scale(${sizeMultiplier * 1.5}) rotate(${(i % 4) * 15 - 20}deg)`,
              filter: isBlurry ? 'blur(2px)' : 'blur(0px)',
            }}
          >
            <Icon size={24} strokeWidth={2.5} />
          </div>
        );
      })}

      {/* Subtle Noise Texture Overlay */}
      <div className="film-grain absolute inset-0 mix-blend-multiply opacity-[0.15] pointer-events-none" />
    </div>
  );
}
