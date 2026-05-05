"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import CinematicReel from "../global/CinematicReel";
import { useDynamicData } from "@/lib/DynamicDataContext";

const projects: any[] = [];

export default function MovieReel() {
  const { data } = useDynamicData();
  const finalProjects = [...projects, ...(data?.work || [])];
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
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${horizontalReel.scrollWidth + window.innerWidth}`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 7,

          onUpdate: (self) => {
            const progress = self.progress;
            // Split progress between intro (0-0.2) and horizontal scroll (0.2-1)
            if (progress < 0.2) {
              setActiveFrame(-1);
            } else {
              const scrollProgress = (progress - 0.2) / 0.8;
              const index = Math.floor(scrollProgress * finalProjects.length);
              setActiveFrame(Math.min(index, finalProjects.length - 1));
            }
          }
        }
      });

      // 1. SVG Reel Spin (Intro)
      tl.to(spinningReel, {
        rotation: 360,
        scale: 0.8,
        opacity: 0,
        duration: 2,
        ease: "power2.inOut"
      });

      // Staggered color reveal for logos
      tl.to(".reel-thumb", {
        filter: "grayscale(0%)",
        opacity: 1,
        duration: 0.4,
        stagger: 0.15,
        ease: "power2.out"
      }, 0);

      // 2. Horizontal Scroll (Main)
      tl.fromTo(horizontalReel, 
        { opacity: 0, x: "100%" },
        { 
          opacity: 1, 
          x: "0%", 
          duration: 1, 
          ease: "power2.out" 
        }, 
        "-=0.5"
      );

      tl.to(horizontalReel, {
        x: () => -(horizontalReel.scrollWidth - window.innerWidth * 0.9),
        ease: "none",
        duration: 8
      });

    }, sectionRef);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);

    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, [finalProjects.length, data]);


  return (
    <section ref={sectionRef} id="movie-reel" className="relative h-screen overflow-hidden perspective-2000 bg-transparent z-10">



      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 transition-colors duration-1000 opacity-20 blur-[100px]" 
          style={{ backgroundColor: activeFrame >= 0 && finalProjects[activeFrame] ? finalProjects[activeFrame].color : 'transparent' }} 
        />
        <div className="absolute inset-0 bg-white/45 mix-blend-overlay" />
      </div>

      {/* SVG Movie Reel Intro */}
      <div ref={spinningReelRef} className="absolute inset-0 flex items-center justify-center z-10 p-4">
        <div className="relative w-full h-full max-w-[600px] max-h-[600px] aspect-square">
          <CinematicReel thumbnails={finalProjects.map(p => p.logo || p.thumbnail)} />
        </div>
      </div>

      {/* Horizontal Scroller */}
      <div ref={horizontalReelRef} className="absolute inset-0 flex items-center opacity-0 z-20">
        <div className="flex items-center gap-12 md:gap-24 pl-[7.5vw] md:pl-[40vw] pr-[50vw] md:pr-[60vw]">
          {finalProjects.map((project, i) => (
            <FilmFrame key={project.id || i} project={project} index={i} isActive={activeFrame === i} />
          ))}

          {/* Final Call to Action */}
          <div className="flex-shrink-0 w-[85vw] md:w-[450px] h-[480px] md:h-[520px] rounded-2xl border-2 border-dashed border-brand-sky/20 flex flex-col items-center justify-center bg-brand-sky/5 hover:border-brand-pink/50 transition-all duration-500 group">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-brand-sky/20 flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform">
              <span className="text-3xl md:text-4xl text-brand-sky/40 group-hover:text-brand-pink">+</span>
            </div>
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-black/40 group-hover:text-black">YOUR STORY</h3>
            <p className="font-body text-black/40 mt-2 text-sm md:text-base">Next Frame: 2024</p>
            <button className="mt-8 md:mt-12 px-8 md:px-10 py-3 md:py-4 bg-gradient-brand text-white rounded-full font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-brand-pink/20">
              Start Project
            </button>
          </div>
        </div>
      </div>

      {/* UI Accents Removed */}

      
      <div className="absolute bottom-12 right-12 z-40">
        <div className="flex flex-col items-end gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-black/50">Scroll Down</span>
          <div className="w-32 h-[1px] bg-black/10 overflow-hidden">
            <motion.div 
              className="w-full h-full bg-brand-pink origin-left"
              style={{ scaleX: activeFrame >= 0 ? (activeFrame + 1) / finalProjects.length : 0 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface Project {
  id: number;
  client: string;
  platform: string;
  views: string;
  color: string;
  gradient: string;
  thumbnail: string;
  video?: string;
  logo?: string;
  link?: string;
  watchMoreLink?: string;
  logoLink?: string;
  thumbnailPosition?: string;
}

function FilmFrame({ project, index, isActive }: { project: Project, index: number, isActive: boolean }) {
  const [showVideo, setShowVideo] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleClick = () => {
    if (showVideo && project.link) {
      window.open(project.link, "_blank", "noopener,noreferrer");
    }
  };

  useEffect(() => {
    if (showVideo && videoRef.current) {
      videoRef.current.play().catch(err => console.warn("Video play failed:", err));
    } else if (!showVideo && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [showVideo]);

  const handleMouseEnter = () => {
    if (project.video && isActive) {
      timeoutRef.current = setTimeout(() => {
        setShowVideo(true);
      }, 1500);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setShowVideo(false);
  };

  return (
    <motion.div 
      className={`flex-shrink-0 relative w-[85vw] md:w-[450px] h-[65vh] md:h-[520px] min-h-[400px] ${showVideo && project.link ? "cursor-pointer" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      animate={{ 
        scale: isActive ? 1 : 0.85,
        opacity: isActive ? 1 : 0.3,
        y: isActive ? 0 : 40,
      }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Frame Metadata */}
      <div className="w-full h-full bg-[#121212] rounded-2xl overflow-hidden border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] group relative">
        {/* Frame Metadata */}
        <div className="absolute top-8 left-8 right-8 z-30 flex justify-between font-mono text-[10px] text-white/30 uppercase tracking-[0.2em] pointer-events-none transition-all duration-500 group-hover:opacity-0 group-hover:-translate-y-4">
          <span>Scene // 0{index + 1}</span>
          <span className="flex items-center gap-2">REC <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" /> 00:0{index + 1}:24</span>
        </div>

        {/* Visual Content */}
        <div 
          className={`absolute inset-0 bg-cover transition-all duration-1000 scale-110 group-hover:scale-100 ${isActive ? "grayscale-0" : "grayscale"}`}
          style={{ 
            backgroundImage: `url(${project.thumbnail})`,
            backgroundPosition: project.thumbnailPosition || "center"
          }}
        />

        {/* Hover Video Overlay */}
        {project.video && (
          <video
            ref={videoRef}
            src={`${project.video}#t=0,5`}
            poster={project.thumbnail}
            muted
            loop
            playsInline
            preload="metadata"
            controlsList="nodownload"
            disablePictureInPicture
            className={`absolute inset-0 w-full h-full object-cover z-20 transition-opacity duration-1000 pointer-events-none ${showVideo ? "opacity-100" : "opacity-0"}`}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        {/* Interface Overlay */}
        <div className="absolute inset-0 p-10 flex flex-col justify-end z-30">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2 py-0.5 border border-brand-sky text-brand-sky font-mono text-[9px] uppercase font-bold tracking-tighter rounded">
              {project.views} Views
            </span>
            <span className="text-white/40 font-mono text-[10px] uppercase tracking-widest">{project.platform}</span>
          </div>
          
          <h3 className="font-display text-3xl md:text-4xl font-bold text-white leading-[1.1] mb-6">{project.client}</h3>
          
          <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-100">
            {project.watchMoreLink || project.link ? (
              <a 
                href={project.watchMoreLink || project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="w-full py-4 bg-white text-brand-deep font-bold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-brand-pink hover:text-white transition-colors">
                  {showVideo ? "Click to watch more" : "Play the case study"}
                </button>
              </a>
            ) : (
              <button className="flex-1 py-4 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-accent hover:text-white transition-colors">
                {showVideo ? "Click to watch more" : "Play the case study"}
              </button>
            )}

            {project.logoLink || project.watchMoreLink || project.link ? (
              <a 
                href={project.logoLink || project.watchMoreLink || project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-14 h-14 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer overflow-hidden no-cursor"
                onClick={(e) => e.stopPropagation()}
              >
                {project.logo ? (
                  <img 
                    src={project.logo} 
                    alt={project.client} 
                    className="w-full h-full object-contain bg-white"
                  />
                ) : (
                  <span className="text-2xl text-white">→</span>
                )}
              </a>
            ) : (
              <div className="w-14 h-14 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer overflow-hidden">
                {project.logo ? (
                  <img 
                    src={project.logo} 
                    alt={project.client} 
                    className="w-full h-full object-contain bg-white"
                  />
                ) : (
                  <span className="text-2xl text-white">→</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Viewfinder Brackets */}
        <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-white/20 z-30" />
        <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-white/20 z-30" />
        <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-white/20 z-30" />
        <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-white/20 z-30" />
      </div>
    </motion.div>
  );
}
