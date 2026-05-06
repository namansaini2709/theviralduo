"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ArrowDown, Play } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const bottomContentRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      // 1. PERFORMANCE OPTIMIZED MOUSE FOLLOW (GSAP QUICKTO)
      const xOrb = gsap.quickTo(orbRef.current, "x", { duration: 0.6, ease: "power2.out" });
      const yOrb = gsap.quickTo(orbRef.current, "y", { duration: 0.6, ease: "power2.out" });
      const xScene = gsap.quickTo(sceneRef.current, "rotationY", { duration: 1, ease: "power2.out" });
      const yScene = gsap.quickTo(sceneRef.current, "rotationX", { duration: 1, ease: "power2.out" });

      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5);
        const y = (e.clientY / window.innerHeight - 0.5);
        
        xOrb(x * 60);
        yOrb(y * 60);
        xScene(x * 6);
        yScene(-y * 6);
      };

      window.addEventListener("mousemove", handleMouseMove);

      // 2. INITIAL STATE (Text visible behind orb)
      gsap.set([line1Ref.current, line2Ref.current, line3Ref.current], {
        z: -300,
        opacity: 0,
        y: 80,
        rotateX: 45,
        scale: 0.9,
      });

      // 3. ENTRANCE & SCROLL TIMELINE
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 2.5}`, 
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          refreshPriority: 10,
          invalidateOnRefresh: true,
        }
      });

      // Line 1: "WE CREATE" - Left Orbital Entry
      tl.to(line1Ref.current, {
        motionPath: {
          path: [
            { x: -400, y: 50, z: -300 },
            { x: -200, y: -20, z: -150 },
            { x: 0, y: 0, z: 400 }
          ],
          curviness: 1.5,
        },
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power2.out"
      }, 0);

      // Line 2: "VIRAL" - Right Orbital Entry
      tl.to(line2Ref.current, {
        motionPath: {
          path: [
            { x: 400, y: -50, z: -300 },
            { x: 200, y: 20, z: -150 },
            { x: 0, y: 0, z: 400 }
          ],
          curviness: 1.5,
        },
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power2.out"
      }, 0.2);

      // Line 3: "BRANDS" - Bottom Entry
      tl.to(line3Ref.current, {
        motionPath: {
          path: [
            { x: 0, y: 200, z: -300 },
            { x: 0, y: 100, z: -150 },
            { x: 0, y: 0, z: 400 }
          ],
          curviness: 1.2,
        },
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power2.out"
      }, 0.4);

      // 3.5 TEXT BURST FORWARD (Before exit)
      tl.to([line1Ref.current, line2Ref.current, line3Ref.current], {
        z: 600,
        scale: 1.1,
        duration: 0.8,
        ease: "power2.out"
      }, "+=1.0");

      // EXIT ANIMATION (at the very end of the 2000px scroll)
      tl.to(heroDivRef.current, {
        y: -500,
        scale: 0.1,
        duration: 1.8,
        ease: "power2.inOut"
      }, "+=0.5");

      // Pull About section up to overlap (The 'Slide Over' Effect)
      tl.to("#about", {
        y: -800, // Pulls the about section up over the hero
        duration: 1.5,
        ease: "power1.in"
      }, "<");

      // 4. IDLE ANIMATIONS
      // Floating & Breathing Orb
      gsap.to(orbRef.current, {
        y: "+=25",
        x: "+=15",
        scale: 1.05,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // UI Entrance
      gsap.fromTo([bottomContentRef.current, scrollIndicatorRef.current],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: "power3.out", delay: 0.5 }
      );

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-transparent selection:bg-brand-pink selection:text-white [perspective:1200px]"
    >
      <div id="herodiv" ref={heroDivRef} className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
        {/* 3D SCENE CONTAINER */}
        <div 
          ref={sceneRef}
          className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d] will-change-transform"
        >

          {/* MID LAYER: 3D CRYSTAL BUBBLE */}
          <div 
            ref={orbRef}
            className="absolute z-30 pointer-events-none [transform:translateZ(0px)] will-change-transform"
          >
            <div className="relative w-[34vw] h-[34vw] min-w-[320px] min-h-[320px] rounded-full animate-bubble-wobble">
              {/* 1. Main Glass Body with Refraction (More Bluish) */}
              <div className="absolute inset-0 rounded-full border-[0.5px] border-brand-sky/40 bg-brand-sky/[0.05] shadow-[0_20px_50px_rgba(30,90,168,0.15),inset_0_0_50px_rgba(77,184,229,0.3)] overflow-hidden" />
              
              {/* 2. Iridescent Sheen (Shifted to Blue-Cyan Tones) */}
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(77,184,229,0.2),rgba(0,180,216,0.1),rgba(173,232,244,0.2),transparent)] opacity-70 animate-spin-slow mix-blend-screen" />
              
              {/* 3. Primary Specular Highlight */}
              <div className="absolute top-[10%] left-[15%] w-[40%] h-[20%] bg-gradient-to-br from-white/70 to-transparent rounded-[100%] rotate-[-25deg] blur-[8px]" />
              
              {/* 4. Secondary Highlight */}
              <div className="absolute top-[15%] right-[25%] w-[10%] h-[10%] bg-white/50 rounded-full blur-[4px]" />
              
              {/* 5. Rim Lighting (Deep Blue/Cyan Glow) */}
              <div className="absolute inset-0 rounded-full shadow-[inset_0_-10px_40px_rgba(30,90,168,0.3),inset_0_10px_40px_rgba(77,184,229,0.2)]" />
              
              {/* 6. Fresnel Effect */}
              <div className="absolute -inset-1 rounded-full border border-brand-sky/30 opacity-40 blur-[2.5px]" />
            </div>
            
            {/* External Soft Environment Shadow/Glow (Enhanced Blue) */}
            <div className="absolute inset-0 bg-brand-deep/15 rounded-full blur-[100px] -z-10 animate-pulse-subtle" />
          </div>

          {/* FOREGROUND LAYER: HEADLINE */}
          <div 
            className="relative z-40 flex flex-col items-center text-center [transform-style:preserve-3d] will-change-transform"
          >
            <h1 className="flex flex-col items-center leading-[0.85] tracking-[-0.04em] font-serif font-black uppercase">
              <span 
                ref={line1Ref}
                className="block text-brand-deep text-[clamp(50px,10vw,140px)] will-change-transform"
              >
                WE CREATE
              </span>
              <span 
                ref={line2Ref}
                className="block text-gradient text-[clamp(60px,14vw,180px)] drop-shadow-[0_0_40px_rgba(255,77,109,0.3)] will-change-transform"
              >
                VIRAL
              </span>
              <span 
                ref={line3Ref}
                className="block text-brand-deep text-[clamp(60px,12vw,160px)] will-change-transform"
              >
                BRANDS
              </span>
            </h1>
          </div>
        </div>

        {/* OVERLAY UI (Fixed relative to section) */}
        <div className="absolute inset-0 z-50 pointer-events-none flex flex-col justify-end h-full">
          {/* BOTTOM UI */}
          <div 
            ref={bottomContentRef}
            className="w-full px-8 md:px-16 pb-0 flex flex-col md:flex-row items-end justify-between gap-8 pointer-events-auto"
          >
            <div className="max-w-[400px] text-left">
              <div className="w-16 h-[2px] bg-brand-sky mb-4" />
              <p className="text-brand-subtext font-medium text-xs md:text-sm leading-relaxed uppercase tracking-[0.2em]">
                A high-end cinematic marketing agency that builds brands that can't be ignored.
              </p>
            </div>

            <button className="group relative flex items-center gap-4 px-8 py-4 bg-white/90 border border-white/20 rounded-2xl shadow-2xl hover:shadow-[0_20px_50px_rgba(77,184,229,0.2)] hover:-translate-y-2 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-brand opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
              <div className="w-12 h-12 bg-gradient-brand rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500">
                <Play fill="currentColor" size={20} className="ml-0.5" />
              </div>
              <div className="flex flex-col items-start pr-2">
                <span className="text-[10px] font-bold text-brand-sky uppercase tracking-widest leading-none mb-1">
                  CINEMATIC
                </span>
                <span className="text-[15px] font-black text-brand-deep uppercase tracking-tight leading-none">
                  WATCH SHOWREEL
                </span>
              </div>
            </button>
          </div>

          {/* SCROLL INDICATOR */}
          <div 
            ref={scrollIndicatorRef}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          >
            <div className="w-[1px] h-16 bg-gradient-to-b from-brand-sky via-brand-sky/50 to-transparent" />
            <ArrowDown size={14} className="text-brand-sky animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}


