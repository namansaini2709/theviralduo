"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Play, Target, BarChart3, Users, Zap, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const SERVICES_DATA = [
  {
    id: "short-form",
    title: "Short-Form Content",
    description: "Our cinematic approach captures attention in 0.5 seconds. We craft scroll-stopping reels and TikToks.",
    icon: <Play className="w-5 h-5" />,
    color: "#FF4D6D",
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "brand-strategy",
    title: "Brand Strategy",
    description: "Methodical analysis meets creative storytelling. We build iconic identities designed for recognition.",
    icon: <Target className="w-5 h-5" />,
    color: "#4DB8E5",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "growth",
    title: "Growth & Management",
    description: "Data-driven strategies that turn followers into communities and impressions into impact.",
    icon: <BarChart3 className="w-5 h-5" />,
    color: "#FFD43B",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "influencer",
    title: "Influencer Coordination",
    description: "Bridging the gap between brands and creators. We manage complex multi-creator orchestrations.",
    icon: <Users className="w-5 h-5" />,
    color: "#FFA726",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "paid-ads",
    title: "Paid Ads & Boosting",
    description: "Strategic amplification that multiplies organic wins. We optimize every dollar for maximum ROI.",
    icon: <Zap className="w-5 h-5" />,
    color: "#FF4D6D",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
  },
];

export default function CinematicServices() {
  const containerRef = useRef<HTMLDivElement>(null);
  const openingTextRef = useRef<HTMLDivElement>(null);
  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const taglinePart1Ref = useRef<HTMLSpanElement>(null);
  const taglinePart2Ref = useRef<HTMLSpanElement>(null);
  const viralWordRef = useRef<HTMLSpanElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    
    const ctx = gsap.context(() => {
      const mobile = window.innerWidth < 768;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=3500", // Long scroll for full sequence
          scrub: 1.2,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 8,
        },
      });

      // 1. Opening Text: "The Services We Provide"
      gsap.set(openingTextRef.current, { opacity: 0, scale: 0.95 });
      
      tl.to(openingTextRef.current, {
        opacity: 1,
        scale: 1,
        duration: 2,
        ease: "power2.out",
      });
      
      tl.to({}, { duration: 1.5 }); // Hold 1.5s (scroll duration)
      
      tl.to(openingTextRef.current, {
        opacity: 0,
        y: -100,
        scale: 1.05,
        duration: 1.5,
        ease: "power2.inOut",
      });

      // 2. Tagline Entry Sequence
      gsap.set(viralWordRef.current, { opacity: 0, x: -150, filter: "blur(10px)" });
      gsap.set([taglinePart1Ref.current, taglinePart2Ref.current], { opacity: 0, x: 150, filter: "blur(10px)" });
      
      // Step 1: "Viral" comes from the left
      tl.to(viralWordRef.current, {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        duration: 1.5,
        ease: "power3.out",
      }, "-=0.5");

      // Step 2: The other parts come from the right
      tl.to([taglinePart1Ref.current, taglinePart2Ref.current], {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        duration: 1.5,
        stagger: 0.2,
        ease: "power3.out",
      });

      // Step 3: Trigger the continuous jumping once settled
      tl.add(() => {
        gsap.to(viralWordRef.current, {
          y: -20,
          duration: 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          id: "viralJump"
        });
      });

      tl.to({}, { duration: 1 }); // Short hold

      // 3. Tagline Transition (Move Up and Vanish)
      tl.to(taglineRef.current, {
        y: mobile ? "-41vh" : "-43vh",
        maxWidth: "100%",
        scale: mobile ? 0.35 : 0.32,
        opacity: 0, // Vanish as it moves up
        duration: 2.5,
        ease: "power2.inOut",
      });

      // 3b. Sticky Header Reappears in one line at the top
      gsap.set(stickyHeaderRef.current, { y: -50, opacity: 0 });
      tl.to(stickyHeaderRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out",
      }, "-=1.5");

      // 4. Card Entry Animation
      gsap.set(cardRefs.current, { 
        opacity: 0, 
        scale: 0.8, 
        y: 60,
        z: -100,
        rotateX: 15
      });

      tl.to(cardRefs.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        z: 0,
        rotateX: 0,
        stagger: 0.2,
        duration: 2,
        ease: "power3.out",
      }, "-=0.5");

      // 5. Final Hold to allow interaction
      tl.to({}, { duration: 2 });

      // 6. Sticky Header Fades Out after everything is settled
      tl.to(stickyHeaderRef.current, {
        opacity: 0,
        y: -20,
        duration: 1,
        ease: "power2.inOut"
      });

    }, containerRef);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      id="services"
      className="relative min-h-screen w-full bg-transparent overflow-hidden perspective-1000"
    >
      {/* Background Cinematic Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] bg-[radial-gradient(circle,rgba(77,184,229,0.08)_0%,transparent_70%)] opacity-60" />
      </div>

      {/* Sticky Header (Reappears at the top) */}
      <div 
        ref={stickyHeaderRef} 
        className="fixed top-[84px] left-0 right-0 z-[60] flex justify-center pointer-events-none px-6"
      >
        <h2 className="font-serif font-black text-2xl md:text-3xl text-brand-deep tracking-tight uppercase text-center bg-white/40 backdrop-blur-md px-8 py-3 rounded-full border border-black/5 shadow-sm">
          SERVICES <span className="text-orange-gradient">WE</span> PROVIDE
        </h2>
      </div>

      {/* Opening Text Container */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-6">
        <div ref={openingTextRef} className="text-center">
          <h2 className="font-serif font-black text-[8vw] md:text-[6vw] text-brand-deep tracking-tight leading-none uppercase flex flex-wrap justify-center items-center gap-x-8 md:gap-x-12">
            <span className="opacity-90 -translate-y-6 md:-translate-y-10">SERVICES</span>
            <span className="text-[1.8em] md:text-[2.2em] leading-none text-orange-gradient">WE</span>
            <span className="font-serif italic inline-block translate-y-6 md:translate-y-10 pr-10">PROVIDE</span>
          </h2>
        </div>
      </div>

      {/* Tagline Container */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-6">
        <div ref={taglineRef} className="flex flex-col items-center justify-center max-w-[400px] md:max-w-[800px] mx-auto overflow-visible">
          <p className="font-serif font-black text-[8vw] md:text-[6vw] lg:text-[7.5rem] text-brand-deep tracking-tight flex flex-row flex-wrap justify-center items-center gap-x-6 gap-y-0 text-center leading-[1.1] py-10">
            <span ref={taglinePart1Ref} className="whitespace-nowrap">IF IT&apos;s NOT</span>
            <span ref={viralWordRef} className="text-orange-gradient whitespace-nowrap">Viral</span>
            <span ref={taglinePart2Ref} className="whitespace-nowrap">THEN IT&apos;s NOT US</span>
          </p>
        </div>
      </div>

      {/* Cards Container */}
      <div 
        ref={cardsContainerRef}
        className="absolute inset-0 flex items-center justify-center z-10 px-6 pt-24"
      >
        <div className="relative w-full max-w-[1400px] h-[60vh] md:h-[500px] flex items-center justify-center gap-4">
          {SERVICES_DATA.map((service, index) => {
            const isHovered = hoveredIndex === index;
            const isAnyHovered = hoveredIndex !== null;
            
            return (
              <div
                key={service.id}
                ref={(el) => { cardRefs.current[index] = el; }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`relative h-full transition-all duration-700 ease-out-expo rounded-[2.5rem] overflow-hidden border border-white/10 group cursor-pointer
                  ${isMobile ? 'absolute inset-0' : 'flex-1'}
                `}
                style={{
                  zIndex: isHovered ? 50 : 10 + index,
                  transform: isMobile && !isHovered ? `translateY(${index * 15}px) scale(${1 - index * 0.05})` : 'none',
                  flex: isMobile ? 'none' : (isHovered ? "2.5" : (isAnyHovered ? "0.6" : "1")),
                  opacity: isMobile && isAnyHovered && !isHovered ? 0 : 1
                }}
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image 
                    src={service.image} 
                    alt={service.title} 
                    fill
                    className={`object-cover transition-all duration-1000 ${isHovered ? 'scale-105 opacity-40 blur-sm' : 'scale-110 opacity-10 grayscale'}`}
                  />
                  <div className={`absolute inset-0 opacity-90 transition-colors duration-500 ${isHovered ? 'bg-[#0a2a4d]' : 'bg-[#1E5AA8]'}`} />
                </div>

                {/* Content */}
                <div className="relative z-10 w-full h-full p-8 md:p-10 flex flex-col justify-between">
                  <div className="flex flex-col gap-6">
                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border border-white/10 transition-all duration-500 ${isHovered ? 'bg-black scale-110' : 'bg-white/10'}`}>
                      <div className="text-white scale-125">
                        {service.icon}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className={`font-serif font-black italic tracking-tight text-white transition-all duration-500 ${isHovered ? 'text-3xl md:text-5xl' : 'text-xl md:text-2xl'}`}>
                        {service.title}
                      </h3>
                      
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="space-y-6"
                          >
                            <p className="text-white/80 font-body text-base md:text-lg leading-relaxed max-w-[90%]">
                              {service.description}
                            </p>
                            
                            <button className="flex items-center gap-3 px-8 py-4 bg-white text-brand-deep rounded-full font-display font-black text-xs uppercase tracking-widest hover:bg-brand-pink hover:text-white transition-all shadow-xl">
                              Learn More
                              <ArrowUpRight size={18} />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {!isHovered && !isMobile && (
                    <div className="font-mono text-5xl font-black text-white/20">
                      0{index + 1}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
