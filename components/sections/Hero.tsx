"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const videoContainer = videoContainerRef.current;
    const heroContent = heroContentRef.current;
    const logo = logoRef.current;

    if (!container || !videoContainer || !heroContent || !logo) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=150%",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    // 1. Shrink Hero Video Container into a Logo Card
    tl.to(videoContainer, {
      scale: 0.15,
      width: "300px",
      height: "300px",
      borderRadius: "24px",
      duration: 1,
      ease: "power2.inOut",
    });

    // 2. Fade out Hero Text and fade in Logo inside the card
    tl.to(heroContent, {
      opacity: 0,
      y: -50,
      duration: 0.5,
    }, "<");

    tl.fromTo(logo, 
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
      ">"
    );

    // 3. Show "What We Do" text around the logo
    tl.fromTo(".about-reveal", 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.2, duration: 0.8 },
      ">"
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden bg-background">
      {/* Video / Visual Background that shrinks */}
      <div 
        ref={videoContainerRef} 
        className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden bg-foreground/5 border border-white/5"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm"
        >
          <source src="/hero-reel.mp4" type="video/mp4" />
        </video>
        
        {/* The Logo that appears after shrinking */}
        <div ref={logoRef} className="opacity-0 z-10 text-center">
           <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-[0_0_50px_rgba(230,57,70,0.5)]">
              <span className="text-white text-4xl font-bold">V</span>
           </div>
           <h3 className="font-display text-2xl font-bold tracking-widest text-white uppercase">Viral <span className="text-accent">Duo</span></h3>
        </div>
      </div>

      {/* Main Hero Content (Fades out) */}
      <div ref={heroContentRef} className="relative z-10 h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-display text-7xl md:text-[10rem] font-bold tracking-tighter leading-none mb-6">
          VIRAL<br />DUO
        </h1>
        <p className="font-body text-lg md:text-xl text-foreground/50 max-w-2xl mx-auto mb-12 uppercase tracking-[0.4em]">
          Engineering Virality Since 2024
        </p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <a
            href="#movie-reel"
            className="group relative px-10 py-4 bg-transparent border border-foreground/20 rounded-full overflow-hidden transition-colors hover:border-accent"
          >
            <span className="relative z-10 font-display font-bold text-xs uppercase tracking-widest group-hover:text-white">Explore Our World</span>
            <div className="absolute inset-0 bg-accent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </a>
        </motion.div>
      </div>

      {/* About content that reveals around the shrunk card */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
        <div className="grid grid-cols-2 gap-x-[400px] w-full max-w-6xl px-12">
           <div className="about-reveal opacity-0 text-left">
              <h2 className="font-display text-4xl font-bold mb-4">WE DON&apos;T POST.<br /><span className="text-accent">WE ENGINEER.</span></h2>
              <p className="font-body text-foreground/40 text-sm leading-relaxed">
                Most agencies post and pray. We build data-driven content architectures designed to dominate algorithms.
              </p>
           </div>
           <div className="about-reveal opacity-0 text-right">
              <h2 className="font-display text-4xl font-bold mb-4">WHAT WE<br /><span className="text-accent italic">ACTUALLY DO.</span></h2>
              <ul className="font-body text-foreground/40 text-sm space-y-2">
                <li>• Content Strategy</li>
                <li>• Viral Mechanics</li>
                <li>• Platform Domination</li>
                <li>• Growth Infrastructure</li>
              </ul>
           </div>
        </div>
      </div>

      {/* Scroll Hint */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 about-reveal opacity-0">
         <div className="flex flex-col items-center gap-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-foreground/40">Keep Scrolling to Enter the Nexus</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-accent to-transparent" />
         </div>
      </div>
    </section>
  );
}
