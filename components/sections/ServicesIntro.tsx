"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ServicesIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Set Initial States
      gsap.set(taglineRef.current, { opacity: 0, y: 20 });
      gsap.set(charRefs.current, { 
        opacity: 0, 
        y: 60, 
        rotateX: 45, 
        filter: "blur(12px)" 
      });

      // 2. Entrance Animation (Triggers on mount/view)
      const entranceTl = gsap.timeline();
      entranceTl.to(charRefs.current, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        filter: "blur(0px)",
        duration: 0.9,
        stagger: 0.035,
        ease: "power3.out",
        delay: 0.2
      });

      // 3. Scroll-Based Resistance & Focus Shift
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=180%",
          pin: true,
          scrub: 1.8,
          anticipatePin: 1,
        },
      });

      // Heading recedes
      scrollTl.to(textRef.current, {
        y: -120,
        scale: 0.88,
        opacity: 0,
        filter: "blur(20px)",
        duration: 1.5,
        ease: "power2.inOut",
      }, 0);

      // Tagline reveals
      scrollTl.to(taglineRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
      }, 0.6);

      // Final fade out
      scrollTl.to(taglineRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
      }, 1.5);

      scrollTl.to(sectionRef.current, {
        backgroundColor: "#080808",
        duration: 0.5,
      }, 1);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const words = ["SERVICES", "WE", "PROVIDE"];

  return (
    <section 
      ref={sectionRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-transparent z-30"
    >
      {/* Background Cinematic Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-[radial-gradient(circle,rgba(230,57,70,0.12)_0%,transparent_70%)] opacity-80" />
      </div>

      <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col items-center">
        <p
          ref={taglineRef}
          className="font-body text-white/70 uppercase tracking-[0.5em] text-lg md:text-xl font-black mb-16 text-center"
        >
          If it&apos;s not viral then its not us
        </p>
        
        <div ref={textRef} className="relative flex flex-row items-center justify-center">
          {words.map((word, wordIdx) => (
            <div 
              key={wordIdx} 
              className={`inline-block whitespace-nowrap relative ${
                word === "SERVICES" ? "-translate-x-4 -translate-y-12 md:-translate-x-8 md:-translate-y-20 z-0" : 
                word === "PROVIDE" ? "translate-x-4 translate-y-12 md:translate-x-8 md:translate-y-20 z-0" : 
                "z-10 mx-[-0.05em]" 
              }`}
            >
              {word.split("").map((char, charIdx) => {
                const charIndex = words.slice(0, wordIdx).join("").length + charIdx;
                const isWe = word === "WE";
                return (
                  <span
                    key={charIdx}
                    ref={(el) => { charRefs.current[charIndex] = el; }}
                    className={`inline-block font-serif font-black italic leading-[0.7] tracking-[-0.05em] uppercase drop-shadow-[0_20px_70px_rgba(230,57,70,0.4)] ${
                      isWe 
                        ? "text-white text-[18vw] md:text-[14vw] lg:text-[13rem]" 
                        : "text-[#E63946] text-[8vw] md:text-[6vw] lg:text-[5rem] opacity-90"
                    }`}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Path Hints */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-30 animate-bounce">
        <span className="font-mono text-[8px] uppercase tracking-[0.4em] mb-4">Scroll to Discover</span>
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
}
