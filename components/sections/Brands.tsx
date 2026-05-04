"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

const BRANDS = [
  { name: "FOF Fitness", logo: "/brands/FOF Fitnesa logo.jpeg" },
  { name: "Global Holidays", logo: "/brands/Global Holidays.PNG" },
  { name: "Make your trip possible", logo: "/brands/Make your trip possible.jpg" },
  { name: "Sharma ji ke bhature", logo: "/brands/Sharma ji ke bhature.JPG" },
  { name: "Shri radhey Krishna jewellers", logo: "/brands/Shri radhey Krishna  jewellers.JPG" },
  { name: "VDMC", logo: "/brands/Vdmc logo.JPG" },
  { name: "Anytime Fitness", logo: "/brands/anytime. fitness logos.JPG" },
  { name: "Career Launcher", logo: "/brands/carrer launcher.JPG" },
  { name: "MS Classes", logo: "/brands/ms classes.JPG" },
  { name: "Saral Gym", logo: "/brands/saral gym logo.jpg" },
];

export default function Brands() {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Heading Animation
      gsap.from(".brands-heading", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".brands-heading",
          start: "top 85%",
        }
      });

      gsap.from(".brands-subheading", {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".brands-subheading",
          start: "top 85%",
        }
      });

      // Animate the splash underline
      const path = document.querySelector(".brands-underline-path") as SVGPathElement;
      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.5,
          delay: 0.8,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ".brands-subheading",
            start: "top 85%",
          }
        });
      }

      // Continuous Marquee Animation
      const marquee = marqueeRef.current;
      if (marquee) {
        const width = marquee.scrollWidth / 2;
        gsap.to(marquee, {
          x: -width,
          duration: 30,
          repeat: -1,
          ease: "none",
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-20 bg-brand-soft overflow-hidden relative border-y border-brand-border/30">
      {/* Subtle background text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">
        <span className="text-[20vw] font-serif font-black text-black/[0.02] uppercase whitespace-nowrap">
          TRUSTED BY
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-16 text-center relative z-10">
        <h2 className="brands-heading font-serif font-black text-4xl md:text-6xl text-brand-deep uppercase tracking-tight">
          BRANDS <span className="text-orange-gradient italic px-4">TRUST</span> US
        </h2>
        <div className="relative inline-block mt-4 group">
          <p className="brands-subheading font-mono uppercase tracking-widest text-sm md:text-base font-bold text-black/60">
            Your brand can be next here.
          </p>
          <svg className="absolute -bottom-3 left-0 w-full h-3 text-brand-orange/60" viewBox="0 0 200 20" preserveAspectRatio="none">
            <path 
              d="M5 15 Q 100 5 195 15" 
              stroke="currentColor" 
              strokeWidth="4" 
              fill="none" 
              strokeLinecap="round"
              className="brands-underline-path"
            />
          </svg>
        </div>
      </div>

      <div className="relative w-full overflow-hidden py-10 bg-brand-soft/30 backdrop-blur-sm">
        <div 
          ref={marqueeRef}
          className="flex whitespace-nowrap gap-16 md:gap-32 items-center w-max"
        >
          {/* Double the brands for seamless infinite scroll */}
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <div 
              key={i} 
              className="flex items-center gap-4 group cursor-pointer"
            >
              <div className="relative w-24 h-24 md:w-32 md:h-32 transition-all duration-500">
                 <Image 
                   src={brand.logo}
                   alt={brand.name}
                   fill
                   className="object-contain"
                 />
              </div>
              <span className="font-serif font-black text-2xl md:text-4xl text-brand-deep uppercase italic drop-shadow-[0_0_15px_rgba(30,90,168,0.25)]">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
