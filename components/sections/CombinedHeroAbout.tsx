"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ArrowDown, Play } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const pillars = [
  {
    title: "Strategic",
    copy: "We find the cultural signals, creator angles, and scroll patterns your audience already wants.",
    image: "/assets/services/what-we-are.png",
    video: "/assets/videos/stratgic 2.mp4",
    accent: "from-cyan-500/22 via-cyan-300/10 to-cyan-100/[0.03]",
    tint: "bg-cyan-400/[0.18] group-hover:bg-cyan-300/[0.34]",
    border: "border-cyan-200/[0.22] group-hover:border-cyan-200/[0.48]",
    shadow: "shadow-cyan-500/10 group-hover:shadow-cyan-400/20",
  },
  {
    title: "Productive",
    copy: "We turn ideas into sharp hooks, repeatable formats, and fast-moving edits built for retention.",
    image: "/assets/services/clapboard.png",
    accent: "from-red-500/22 via-orange-300/10 to-red-100/[0.03]",
    tint: "bg-red-500/[0.18] group-hover:bg-red-400/[0.34]",
    video: "/assets/videos/Screen Recording 2026-05-01 at 12.57.42 PM.mov",
    border: "border-red-200/[0.22] group-hover:border-red-200/[0.48]",
    shadow: "shadow-red-500/10 group-hover:shadow-red-400/25",
  },
  {
    title: "Creative",
    copy: "We read the data, double down on winners, and keep the content machine compounding.",
    image: "/assets/services/charts.png",
    video: "/assets/videos/creative_reel_trimmed_2.mov",
    accent: "from-amber-400/22 via-lime-300/10 to-yellow-100/[0.03]",
    tint: "bg-amber-300/[0.18] group-hover:bg-amber-300/[0.34]",
    border: "border-amber-100/[0.22] group-hover:border-amber-100/[0.48]",
    shadow: "shadow-amber-400/10 group-hover:shadow-amber-300/20",
  },
];

export default function CombinedHeroAbout() {
  // HERO REFS
  const containerRef = useRef<HTMLDivElement>(null);
  const heroDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const bottomContentRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  
  // ABOUT REFS
  const aboutRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);


  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      // 1. MOUSE PARALLAX (Hero)
      const xOrb = gsap.quickTo(orbRef.current, "x", { duration: 0.6, ease: "power2.out" });
      const yOrb = gsap.quickTo(orbRef.current, "y", { duration: 0.6, ease: "power2.out" });
      const xScene = gsap.quickTo(sceneRef.current, "rotationY", { duration: 1, ease: "power2.out" });
      const yScene = gsap.quickTo(sceneRef.current, "rotationX", { duration: 1, ease: "power2.out" });

      const handleHeroMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5);
        const y = (e.clientY / window.innerHeight - 0.5);
        xOrb(x * 60);
        yOrb(y * 60);
        xScene(x * 6);
        yScene(-y * 6);
      };

      window.addEventListener("mousemove", handleHeroMouseMove);

      // 2. INITIAL STATES
      gsap.set([line1Ref.current, line2Ref.current, line3Ref.current], {
        z: -800, opacity: 1, y: 0, rotateX: 0, scale: 0.15,
      });
      gsap.set(aboutRef.current, { y: "100vh" }); // Start off-screen
      
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      gsap.set(cards, {
        transformPerspective: 1200,
        autoAlpha: 1,
        y: 0,
        scale: 1,
      });

      // 3. MASTER TIMELINE
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 5}`, // Extended for both sections
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          refreshPriority: 10,
          invalidateOnRefresh: true,
        }
      });

      // HERO ENTRANCE (Lines 1, 2, 3) - Emerging from behind the orb
      tl.to(line1Ref.current, {
        motionPath: { path: [{ x: 0, y: 0, z: -800 }, { x: -400, y: 50, z: -400 }, { x: -200, y: -20, z: -150 }, { x: 0, y: 0, z: 400 }], curviness: 1.5 },
        opacity: 1, scale: 1, duration: 1.5, ease: "power2.out"
      }, 0)
      .to(line2Ref.current, {
        motionPath: { path: [{ x: 0, y: 0, z: -800 }, { x: 400, y: -50, z: -400 }, { x: 200, y: 20, z: -150 }, { x: 0, y: 0, z: 400 }], curviness: 1.5 },
        opacity: 1, scale: 1, duration: 1.5, ease: "power2.out"
      }, 0.2)
      .to(line3Ref.current, {
        motionPath: { path: [{ x: 0, y: 0, z: -800 }, { x: 0, y: 200, z: -400 }, { x: 0, y: 100, z: -150 }, { x: 0, y: 0, z: 400 }], curviness: 1.2 },
        opacity: 1, scale: 1, duration: 1.5, ease: "power2.out"
      }, 0.4)
      .to(orbRef.current, {
        z: -200,
        duration: 1.5,
        ease: "power2.inOut"
      }, 0.8); // Start moving orb back as text is midway through its forward journey

      // TEXT BURST
      tl.to([line1Ref.current, line2Ref.current, line3Ref.current], {
        z: 600, scale: 1.1, duration: 0.8, ease: "power2.out"
      }, "+=1.0");

      // TRANSITION: HERO EXIT & ABOUT ENTRANCE
      tl.to(heroDivRef.current, {
        y: -window.innerHeight,
        scale: 0.1,
        duration: 2,
        ease: "power2.inOut"
      }, "+=0.5")
      .to(aboutRef.current, {
        y: 0,
        duration: 2,
        ease: "power2.inOut"
      }, "<");

      // Removed card entrance and drift animations as requested


      // 4. IDLE ORB ANIMATION
      gsap.to(orbRef.current, {
        y: "+=25", x: "+=15", scale: 1.05,
        duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut"
      });

      // UI Entrance
      gsap.fromTo([bottomContentRef.current, scrollIndicatorRef.current],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: "power3.out", delay: 0.5 }
      );

      return () => {
        window.removeEventListener("mousemove", handleHeroMouseMove);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden bg-transparent">
      {/* SECTION 1: HERO */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        <div ref={heroDivRef} className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
          <div ref={sceneRef} className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
            {/* 3D ORB */}
            <div ref={orbRef} className="absolute pointer-events-none [transform:translateZ(0px)]">
              <div className="relative w-[34vw] h-[34vw] min-w-[320px] min-h-[320px] rounded-full animate-bubble-wobble">
                <div className="absolute inset-0 rounded-full border-[0.5px] border-brand-sky/40 bg-brand-sky/[0.05] shadow-[0_20px_50px_rgba(30,90,168,0.15),inset_0_0_50px_rgba(77,184,229,0.3)]" />
                <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(77,184,229,0.2),rgba(0,180,216,0.1),rgba(173,232,244,0.2),transparent)] opacity-70 animate-spin-slow mix-blend-screen" />
                <div className="absolute top-[10%] left-[15%] w-[40%] h-[20%] bg-gradient-to-br from-white/70 to-transparent rounded-[100%] rotate-[-25deg] blur-[8px]" />
                <div className="absolute top-[15%] right-[25%] w-[10%] h-[10%] bg-white/50 rounded-full blur-[4px]" />
                <div className="absolute inset-0 rounded-full shadow-[inset_0_-10px_40px_rgba(30,90,168,0.3),inset_0_10px_40px_rgba(77,184,229,0.2)]" />
                <div className="absolute -inset-1 rounded-full border border-brand-sky/30 opacity-40 blur-[2.5px]" />
              </div>
              <div className="absolute inset-0 bg-brand-deep/15 rounded-full blur-[100px] -z-10 animate-pulse-subtle" />
            </div>

            {/* HEADLINE */}
            <div className="relative flex flex-col items-center text-center [transform-style:preserve-3d]">
              <h1 className="flex flex-col items-center leading-[0.85] tracking-[-0.04em] font-serif font-black uppercase px-4">
                <span ref={line1Ref} className="block text-brand-deep text-[clamp(40px,10vw,140px)]">WE CREATE</span>
                <span ref={line2Ref} className="block text-gradient text-[clamp(50px,14vw,180px)]">VIRAL</span>
                <span ref={line3Ref} className="block text-brand-deep text-[clamp(50px,12vw,160px)]">BRANDS</span>
              </h1>
            </div>
          </div>

          {/* OVERLAY UI */}
          <div className="absolute inset-0 z-50 pointer-events-none flex flex-col justify-end h-full">
            <div ref={bottomContentRef} className="w-full px-6 md:px-16 pb-8 flex flex-col md:flex-row items-center md:items-end justify-between gap-8 pointer-events-auto">
              <div className="max-w-[400px] text-center md:text-left flex flex-col items-center md:items-start">
                <div className="w-16 h-[2px] bg-brand-sky mb-4" />
                <p className="text-brand-subtext font-medium text-[10px] md:text-sm leading-relaxed uppercase tracking-[0.2em]">
                  A high-end cinematic marketing agency that builds brands that can&apos;t be ignored.
                </p>
              </div>
              <button className="group relative flex items-center gap-4 px-6 md:px-8 py-3 md:py-4 bg-white/90 border border-white/20 rounded-2xl shadow-2xl hover:shadow-[0_20px_50px_rgba(77,184,229,0.2)] hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-brand opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-brand rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Play fill="currentColor" size={16} className="ml-0.5" />
                </div>
                <div className="flex flex-col items-start pr-2">
                  <span className="text-[8px] md:text-[10px] font-bold text-brand-sky uppercase tracking-widest leading-none mb-1">CINEMATIC</span>
                  <span className="text-[13px] md:text-[15px] font-black text-brand-deep uppercase tracking-tight leading-none">WATCH SHOWREEL</span>
                </div>
              </button>
            </div>
            <div ref={scrollIndicatorRef} className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
              <div className="w-[1px] h-12 md:h-16 bg-gradient-to-b from-brand-sky via-brand-sky/50 to-transparent" />
              <ArrowDown size={14} className="text-brand-sky animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ABOUT (Positioned Absolutely for Transition) */}
      <div 
        ref={aboutRef}
        className="absolute inset-0 z-20 w-full h-full flex flex-col items-center justify-start pt-12 md:pt-20 px-5"
      >
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center">
          <div className="mb-6 text-center md:mb-10 flex flex-col items-center">
            <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-12 mb-2 md:mb-4">
              {"WHO WE ARE".split(" ").map((word, wordIdx) => (
                <span key={wordIdx} className="font-serif font-black text-brand-deep text-4xl md:text-[5vw] lg:text-[4rem] uppercase italic">
                  {word}
                </span>
              ))}
            </div>
            <p className="mx-auto mt-0 max-w-2xl font-body text-xs md:text-sm leading-relaxed text-black/60 font-bold text-center px-4">
              We don&apos;t post content. We engineer virality through strategy, production, and relentless creative iteration.
            </p>
          </div>
          <div 
            className="w-full max-w-6xl px-5 md:px-0 flex flex-col gap-4"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                ref={(el) => { cardsRef.current[index] = el; }}
                onMouseEnter={() => {
                  setHoveredIndex(index);
                  const video = videoRefs.current[index];
                  if (video) video.play().catch(() => {});
                }}
                animate={{
                  filter: hoveredIndex !== null && hoveredIndex !== index ? (window.innerWidth < 768 ? "blur(4px)" : "blur(8px)") : "blur(0px)",
                  opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.4 : 1,
                  scale: hoveredIndex === index ? 1.03 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
                className={`relative w-full overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-sm transition-shadow duration-500 ${hoveredIndex === index ? "shadow-2xl z-10" : "z-0"}`}
              >
                <div className="flex flex-col md:flex-row items-stretch min-h-[100px] md:h-[130px] transition-all duration-700">
                  
                  {/* Text Content */}
                  <div className="flex flex-1 items-center px-6 md:px-12 py-6 md:py-0">
                    <div className="flex flex-col w-full">
                      <h3 className="font-serif text-xl md:text-4xl font-black italic text-brand-orange uppercase tracking-tighter transition-all duration-500">
                        {pillar.title}
                      </h3>
                      
                      <motion.div
                        initial={false}
                        animate={{ 
                          height: hoveredIndex === index ? "auto" : 0,
                          opacity: hoveredIndex === index ? 1 : 0,
                          marginTop: hoveredIndex === index ? (window.innerWidth < 768 ? 12 : 24) : 0
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="font-body text-[11px] md:text-sm text-black/70 font-medium max-w-2xl leading-relaxed">
                          {pillar.copy}
                        </p>
                      </motion.div>
                    </div>
                  </div>

                  {/* Media Reveal */}
                  <motion.div 
                    initial={false}
                    animate={{ 
                      width: hoveredIndex === index ? "45%" : "0%" 
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className="relative hidden md:block overflow-hidden bg-black/5"
                  >
                    {pillar.video && (
                      <video
                        ref={(el) => { videoRefs.current[index] = el; }}
                        poster={pillar.image}
                        muted loop playsInline preload="auto"
                        className="absolute inset-0 h-full w-full object-cover"
                      >
                        <source src={pillar.video} type="video/mp4" />
                      </video>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
                  </motion.div>

                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
