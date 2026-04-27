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
          end: "+=300%", 
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

      // 2. THE MORPH: Transition Hero into Navbar Capsule
      tl.to(stickyDivRef.current, {
        width: isDesktop ? "900px" : "90vw",
        height: "64px",
        top: "20px",
        borderRadius: "100px",
        backgroundColor: "rgba(5, 5, 5, 0.8)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        duration: 1.2,
        ease: "power4.inOut"
      }, 2.5);

      tl.to(".black-hole", { opacity: 0, duration: 0.4 }, 2.5);
      tl.to(".subtext", { opacity: 0, y: -20, duration: 0.3 }, 2.5);
      tl.to(ctaRef.current, { opacity: 0, scale: 0.8, duration: 0.3 }, 2.5);

      tl.to(mergedTextRef.current, {
        scale: isDesktop ? 0.08 : 0.12, 
        x: isDesktop ? -360 : -100, 
        y: 0,
        duration: 1.2,
        ease: "power4.inOut"
      }, 2.5);

      tl.to(".nav-links-container", {
        display: isDesktop ? "flex" : "none", 
        opacity: isDesktop ? 1 : 0,
        x: 0,
        duration: 0.8,
        ease: "power2.out"
      }, 3.0);

      tl.to(stickyDivRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.in"
      }, 3.8);

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

    containerRef.current?.style.setProperty('--mouse-x', `${e.clientX}px`);
    containerRef.current?.style.setProperty('--mouse-y', `${e.clientY}px`);
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
      className="relative min-h-screen bg-[#020202] overflow-hidden"
      onMouseMove={handleParallax}
    >
      {/* Background Cosmic Star Field */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.7) 1px, transparent 1.5px),
            radial-gradient(circle at 70% 60%, rgba(255,255,255,0.5) 0.5px, transparent 1px),
            radial-gradient(circle at 40% 80%, rgba(255,255,255,0.4) 1px, transparent 2px),
            radial-gradient(circle at 10% 10%, rgba(255,255,255,0.3) 1.5px, transparent 3px),
            radial-gradient(circle at 90% 90%, rgba(255,255,255,0.5) 1px, transparent 1.5px),
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 0.5px, transparent 1px),
            radial-gradient(circle at 30% 70%, rgba(6,182,212,0.4) 1px, transparent 2px),
            radial-gradient(circle at 80% 20%, rgba(234,88,12,0.4) 1px, transparent 2px)
          `,
          backgroundSize: '250px 250px',
          filter: 'blur(3px)', 
          opacity: 0.6
        }}
      />

      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

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
        <div className="black-hole absolute inset-0 bg-black opacity-0 z-25 pointer-events-none" />

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

              <div className="subtext mt-8 flex items-center justify-center opacity-0">
                <div className="w-8 h-8 rounded-full border border-red-500/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)] animate-pulse" />
                </div>
              </div>
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

        <div className="nav-links-container absolute right-12 hidden items-center space-x-12 opacity-0 pointer-events-auto z-50">
          {[
            { label: "Work", href: "#movie-reel" },
            { label: "Process", href: "#services" },
            { label: "Nexus", href: "#about" },
            { label: "Studio", href: "#contact" }
          ].map((item, i) => (
            <a 
              key={i} 
              href={item.href} 
              className="font-display text-[11px] uppercase tracking-[0.4em] text-white/50 hover:text-white transition-all duration-300 hover:tracking-[0.5em]"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <div className="pointer-events-none fixed inset-0 z-40 mix-blend-color-dodge opacity-30" style={{ background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(6, 182, 212, 0.3), rgba(234, 88, 12, 0.15), transparent 80%)' }} />
    </section>
  );
}
