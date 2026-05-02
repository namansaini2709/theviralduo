"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, MessageCircle, Share2, TrendingUp } from "lucide-react";

const ICONS = [Heart, MessageCircle, Share2, TrendingUp];

export default function ServicesIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

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
      gsap.set(iconRefs.current, { scale: 0, opacity: 0, y: 50 });

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
          pinSpacing: true,
          scrub: 1.8,
          anticipatePin: 1,
          refreshPriority: 8,
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

      // Icons pop up
      scrollTl.to(iconRefs.current, {
        scale: (i) => 1 + (i % 3) * 0.5, // varying sizes
        opacity: 0.5,
        y: (i) => -50 - (i * 10), // float up slightly
        rotation: (i) => (i % 2 === 0 ? 15 : -15),
        duration: 1,
        stagger: 0.1,
        ease: "back.out(1.5)",
      }, 0.2);

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

      {/* Popping Icons Container */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {[...Array(12)].map((_, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <div
              key={`pop-icon-${i}`}
              ref={(el) => { iconRefs.current[i] = el; }}
              className="absolute text-accent"
              style={{
                top: `${20 + (i * 13) % 60}%`,
                left: `${10 + (i * 27) % 80}%`,
              }}
            >
              <Icon size={40} strokeWidth={2.5} />
            </div>
          );
        })}
      </div>

      <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col items-center">
        <p
          ref={taglineRef}
          className="font-body text-black/70 uppercase tracking-[0.5em] text-lg md:text-xl font-black mb-16 text-center"
        >
          If it&apos;s not viral then its not us
        </p>
        
        <div ref={textRef} className="relative flex flex-col md:flex-row items-center justify-center gap-0 md:gap-0">
          {words.map((word, wordIdx) => (
            <div 
              key={wordIdx} 
              className={`inline-block whitespace-nowrap relative ${
                word === "SERVICES" ? "-translate-y-4 md:-translate-x-8 md:-translate-y-20 z-0" : 
                word === "PROVIDE" ? "translate-y-4 md:translate-x-8 md:translate-y-20 z-0" : 
                "z-10" 
              } transition-transform duration-700`}
            >
              {word.split("").map((char, charIdx) => {
                const charIndex = words.slice(0, wordIdx).join("").length + charIdx;
                const isWe = word === "WE";
                return (
                  <span
                    key={charIdx}
                    ref={(el) => { charRefs.current[charIndex] = el; }}
                    className={`inline-block font-serif font-black italic leading-[0.85] md:leading-[0.7] tracking-[-0.05em] uppercase drop-shadow-[0_10px_30px_rgba(230,57,70,0.2)] ${
                      isWe 
                        ? "text-black text-[22vw] md:text-[14vw] lg:text-[13rem]" 
                        : "text-[#E63946] text-[10vw] md:text-[6vw] lg:text-[5rem] opacity-90"
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
        <span className="font-mono text-[8px] uppercase tracking-[0.4em] mb-4 text-black">Scroll to Discover</span>
        <div className="w-px h-12 bg-gradient-to-b from-black to-transparent" />
      </div>
    </section>
  );
}
