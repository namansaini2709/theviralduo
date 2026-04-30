"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mergedTextRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const shockwaveRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaTextRef = useRef<HTMLSpanElement>(null);
  const stickyDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      const { isDesktop } = context.conditions as { isDesktop: boolean };
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=150%", 
          scrub: 1.5,
          pin: true,
        }
      });

      // 1. Cinematic Reveal (Start earlier since no frame animation)
      tl.fromTo(".black-hole",
        { opacity: 0 },
        { opacity: 0.9, duration: 1.2 },
        0.5
      );

      tl.fromTo(".logo-char",
        { opacity: 0, scale: 1.5, y: 50, filter: "blur(20px)", rotationX: 90 },
        { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", rotationX: 0, ease: "back.out(1.5)", duration: 1.0, stagger: 0.08 },
        0.5
      );

      tl.fromTo(".subtext",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2 },
        0.8
      );

      tl.fromTo(ctaRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.0 },
        1.0
      );

      // 2. Reference-style exit: the hero panel recedes upward while the real navbar stays pinned.
      tl.to(".black-hole", { opacity: 0, duration: 0.45 }, 2.25);
      tl.to(".subtext", { opacity: 0, y: -24, duration: 0.45 }, 2.25);
      tl.to(ctaRef.current, { opacity: 0, scale: 0.86, y: -20, duration: 0.45 }, 2.25);

      tl.to(mergedTextRef.current, {
        y: isDesktop ? -150 : -90,
        scale: isDesktop ? 0.86 : 0.9,
        opacity: 0.18,
        filter: "blur(4px)",
        duration: 1.25,
        ease: "power3.inOut"
      }, 2.35);

      tl.to(stickyDivRef.current, {
        y: isDesktop ? "-72vh" : "-66vh",
        scale: isDesktop ? 0.78 : 0.86,
        opacity: 0.42,
        borderRadius: isDesktop ? "2.5rem" : "2rem",
        duration: 1.35,
        ease: "power3.inOut"
      }, 2.35);

      tl.to(stickyDivRef.current, {
        opacity: 0,
        y: isDesktop ? "-92vh" : "-86vh",
        duration: 0.55,
        ease: "power2.in"
      }, 3.5);

      return () => {
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  const handleParallax = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!bgRef.current) return;
    
    // Mouse percentage across screen
    const mouseXRatio = e.clientX / window.innerWidth;
    const xPos = (mouseXRatio - 0.5) * 30; 
    const yPos = (e.clientY / window.innerHeight - 0.5) * 30;

    gsap.to(bgRef.current, {
      x: -xPos * 1.5, y: -yPos * 1.5,
      ease: "power2.out", duration: 1.5
    });
  };

  const handleCTAMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ctaRef.current || !ctaTextRef.current) return;
    const { left, top, width, height } = ctaRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) * 0.4;
    const y = (e.clientY - top - height / 2) * 0.4;
    gsap.to(ctaRef.current, { x, y, duration: 0.4, ease: "power2.out" });
    gsap.to(ctaTextRef.current, { x: x * 0.5, y: y * 0.5, duration: 0.4, ease: "power2.out" });
  };

  const handleCTAMouseLeave = () => {
    if (!ctaRef.current || !ctaTextRef.current) return;
    gsap.to(ctaRef.current, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
    gsap.to(ctaTextRef.current, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
  };

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen overflow-hidden"
      onMouseMove={handleParallax}
    >
      <div className="pointer-events-none absolute inset-0 z-50 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      <div 
        ref={stickyDivRef}
        className="sticky top-[6.5vh] h-[87vh] w-[90vw] mx-auto flex items-center justify-center overflow-hidden touch-none pointer-events-none perspective-[1000px] rounded-[3.5rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] z-50 transition-colors duration-500"
      >
        <div 
          ref={bgRef} 
          className="absolute inset-[-10%] opacity-40 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_60%)] mix-blend-screen transition-opacity duration-1000" 
        />

        <div ref={shockwaveRef} className="absolute left-1/2 top-1/2 w-48 h-48 -ml-24 -mt-24 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,1)_0%,rgba(6,182,212,0.9)_30%,rgba(234,88,12,0.7)_60%,transparent_100%)] opacity-0 mix-blend-screen blur-[15px] z-20 pointer-events-none" />

        {/* Cinematic Deep Black Reveal Atmosphere */}
        <div className="black-hole absolute inset-0 bg-[#080808] opacity-0 z-25 pointer-events-none" />

        <div className="absolute inset-0 flex items-center justify-center z-30 flex-col perspective-[1000px]">
            <div ref={mergedTextRef} className="flex flex-col items-center justify-center will-change-transform">
              <div className="flex flex-col md:flex-row items-center md:items-baseline space-y-4 md:space-y-0 md:space-x-6 font-display font-black text-6xl md:text-[11vw] uppercase tracking-[-0.05em] leading-[0.8] filter drop-shadow-[0_0_80px_rgba(255,255,255,0.1)]">
                <div className="flex overflow-hidden pb-2 md:pb-4">
                  {"THE".split("").map((char, cIdx) => (
                    <span 
                      key={cIdx} 
                      className="logo-char opacity-0 inline-block text-transparent bg-clip-text bg-gradient-to-b from-[#FF8C42] via-[#FF8C42] to-[#FFB38A] drop-shadow-[0_0_30px_rgba(255,140,66,0.3)]"
                    >
                      {char}
                    </span>
                  ))}
                </div>

                <div className="flex overflow-hidden pb-2 md:pb-4">
                  {"VIRAL".split("").map((char, cIdx) => (
                    <span 
                      key={cIdx} 
                      className="logo-char opacity-0 inline-block text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#FFFFFF] to-[#FFE5D4] drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    >
                      {char}
                    </span>
                  ))}
                </div>

                <div className="flex overflow-hidden pb-2 md:pb-4">
                  {"DUO".split("").map((char, cIdx) => (
                    <span 
                      key={cIdx} 
                      className="logo-char opacity-0 inline-block text-transparent bg-clip-text bg-gradient-to-b from-[#B2F5FF] via-[#00E5FF] to-[#00B4D8] drop-shadow-[0_0_40px_rgba(0,229,255,0.7)]"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>

              <p className="subtext font-body text-[10px] md:text-sm text-white/40 uppercase font-medium text-center w-full mt-6 md:mt-4 tracking-[0.8em] opacity-0">
                 We Engineer Virality
              </p>


            </div>

          <div ref={ctaRef} onMouseMove={handleCTAMouseMove} onMouseLeave={handleCTAMouseLeave} className="absolute bottom-16 md:bottom-24 pointer-events-auto opacity-0">
            <button className="relative group overflow-hidden rounded-[2rem] px-12 py-5 bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <span ref={ctaTextRef} className="relative z-10 font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/70 group-hover:text-white transition-colors duration-300">
                Enter The Nexus
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>
        </div>

      </div>

    </section>
  );
}
