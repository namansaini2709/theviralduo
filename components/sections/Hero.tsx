"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Play } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=800", // Increased scroll distance for a smoother, longer sequence
          scrub: 1.2,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          refreshPriority: 10,
          invalidateOnRefresh: true,
        }
      });

      // Phase 1: Hero Card Transform and Fade Out
      tl.to(heroCardRef.current, {
        scale: isMobile ? 0.8 : 0.85,
        y: isMobile ? -60 : -120,
        opacity: 0,
        filter: "blur(30px)",
        duration: 1.5,
        ease: "power2.inOut",
      });

      // Phase 2: "THE VIRAL DUO" appears one by one
      tl.fromTo(wordRefs.current, 
        { opacity: 0, y: 100, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.5,
          duration: 1.2,
          ease: "power3.out",
        },
        "-=0.8" // Starts while card is still fading
      );

      // Phase 3: Hold the text (The "1.5 sec" equivalent)
      tl.to({}, { duration: 1.5 });

      // Phase 4: Words vanish one by one
      tl.to(wordRefs.current, {
        opacity: 0,
        y: -100,
        filter: "blur(15px)",
        stagger: 0.3,
        duration: 1,
        ease: "power2.in",
      });

      // Phase 5: Hero Card comes back
      tl.to(heroCardRef.current, {
        scale: 1,
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.5,
        ease: "power3.out",
      }, "-=1"); // Overlap with words vanishing

      // Phase 6: Inner stage moves up significantly and gets smaller
      tl.to(stageRef.current, {
        y: isMobile ? "-65vh" : "-75vh",
        scale: 0.5,
        duration: 2,
        ease: "power2.inOut",
      }, "+=0.5"); // Brief pause after card settles

      // Phase 7: Fade out only when it's mostly out of view (70% out)
      tl.to(stageRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: "none"
      }, "-=0.6"); // Starts fading in the final 30% of the movement duration

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      id="top"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-transparent"
    >
      {/* Inner stage - smaller than the section from all directions */}
      <div 
        ref={stageRef}
        className="relative w-[92vw] h-[85vh] md:w-[88vw] md:h-[88vh] bg-white/40 border-2 border-brand-sky/20 rounded-[2rem] md:rounded-[3rem] shadow-[0_20px_60px_rgba(77,184,229,0.15)] backdrop-blur-sm overflow-hidden flex items-center justify-center"
      >
        
        {/* Cinematic Words (appears after card vanishes) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-40 px-4">
          <div 
            ref={el => { wordRefs.current[0] = el; }} 
            className="font-serif font-black text-[6vw] md:text-[2vw] text-brand-deep uppercase tracking-[0.3em] md:tracking-[0.5em] mb-[-4vw] md:mb-[-2vw]"
            style={{ opacity: 0 }}
          >
            THE
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8">
            {["VIRAL", "DUO"].map((word, i) => (
              <span 
                key={i} 
                ref={el => { wordRefs.current[i+1] = el; }}
                className="viral-text-style text-[20vw] md:text-[10vw] px-4 py-2 md:py-6"
                style={{ opacity: 0 }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Hero Card */}
        <div 
          ref={heroCardRef}
          className="relative z-50 w-full h-full bg-white flex flex-col items-center justify-center text-center space-y-6 md:space-y-8 p-6 md:p-20"
        >
          {/* Logo */}
          <div className="relative w-28 h-28 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-brand-sky shadow-xl">
            <Image 
              src="/logo-v2.png" 
              alt="The Viral Duo" 
              fill 
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-0 flex flex-col items-center">
            <span className="font-serif font-black text-lg md:text-2xl text-brand-deep tracking-[0.3em] md:tracking-[0.4em] mb-1 opacity-80 uppercase">THE</span>
            <h1 className="viral-text-style text-5xl md:text-8xl px-4 py-2 md:px-6 md:py-4">
              VIRAL DUO
            </h1>
          </div>

          <button className="mt-4 group relative inline-flex items-center justify-center gap-3 px-8 py-4 md:px-10 md:py-5 font-bold text-white uppercase tracking-widest bg-gradient-brand rounded-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
            <span className="relative z-10 flex items-center gap-2 md:gap-3 text-xs md:text-sm">
              <Play fill="currentColor" size={18} />
              Watch Showreel
            </span>
          </button>
        </div>

      </div>
    </section>
  );
}
