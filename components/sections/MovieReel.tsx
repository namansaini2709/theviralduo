"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Image from "next/image";
import CinematicReel from "../global/CinematicReel";
import { DEFAULT_PROJECTS } from "@/lib/constants";
import { useDynamicData } from "@/lib/DynamicDataContext";

export default function MovieReel() {
  const { data } = useDynamicData();
  const finalProjects = data?.work || [];
  const sectionRef = useRef<HTMLDivElement>(null);
  const horizontalReelRef = useRef<HTMLDivElement>(null);
  const spinningReelRef = useRef<HTMLDivElement>(null);
  const [activeFrame, setActiveFrame] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const horizontalReel = horizontalReelRef.current;
    const spinningReel = spinningReelRef.current;

    if (!section || !horizontalReel || !spinningReel) return;

    const ctx = gsap.context(() => {
      // 1. Initial State: Spinning Reel visible, horizontal reel hidden
      gsap.set(horizontalReel, { opacity: 0, x: "100%" });
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=3000",
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
            // Update active frame based on progress
            if (finalProjects.length > 0) {
              const frame = Math.floor(self.progress * (finalProjects.length - 1));
              setActiveFrame(frame);
            }
          }
        }
      });

      // 2. Entrance: Spin the reel and fade it out as horizontal items come in
      tl.to(spinningReel, {
        rotate: 360,
        scale: 0.5,
        opacity: 0,
        duration: 1,
        ease: "power2.inOut"
      });

      tl.to(horizontalReel, {
        opacity: 1,
        x: "0%",
        duration: 1,
        ease: "power2.out"
      }, "-=0.5");

      // 3. Horizontal Scroll
      tl.to(horizontalReel, {
        x: () => -(horizontalReel.scrollWidth - window.innerWidth) + "px",
        duration: 5,
        ease: "none"
      });
    });

    return () => ctx.revert();
  }, [finalProjects.length]);

  return (
    <section ref={sectionRef} id="movie-reel" className="relative h-screen overflow-hidden bg-black z-10">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 transition-colors duration-1000 opacity-20 blur-[100px]" 
          style={{ backgroundColor: finalProjects[activeFrame]?.color || "#E63946" }} 
        />
      </div>

      <div ref={spinningReelRef} className="absolute inset-0 flex items-center justify-center z-20">
        <CinematicReel thumbnails={finalProjects.map(p => p.thumbnail)} />
      </div>

      <div 
        ref={horizontalReelRef} 
        className="absolute inset-0 flex items-center gap-12 px-[10vw] z-10 whitespace-nowrap"
      >
        {finalProjects.map((project, idx) => (
          <motion.div 
            key={project.id || idx}
            className="relative shrink-0 w-[70vw] md:w-[400px] h-[50vh] md:h-[600px] rounded-[2rem] overflow-hidden group"
          >
            <Image 
              src={project.thumbnail} 
              alt={project.client} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 flex flex-col justify-end">
              <h3 className="text-3xl font-display font-black text-white">{project.client}</h3>
              <p className="text-white/60 uppercase tracking-widest text-xs mt-2">{project.platform}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
