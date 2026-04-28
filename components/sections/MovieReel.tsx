"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

const projects = [
  {
    id: 1,
    client: "Luxe Cosmetics",
    platform: "Instagram Reels",
    views: "2.3M",
    color: "#1a1a2e",
    gradient: "from-purple-900/50 to-black",
    thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    client: "Urban Threads",
    platform: "TikTok",
    views: "1.8M",
    color: "#16213e",
    gradient: "from-blue-900/50 to-black",
    thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    client: "Mindful Coffee",
    platform: "Instagram Reels",
    views: "890K",
    color: "#0f3460",
    gradient: "from-amber-900/50 to-black",
    thumbnail: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    client: "FitFlow Studios",
    platform: "YouTube Shorts",
    views: "3.1M",
    color: "#1a1a2e",
    gradient: "from-emerald-900/50 to-black",
    thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    client: "Bloom Skincare",
    platform: "TikTok",
    views: "2.7M",
    color: "#16213e",
    gradient: "from-rose-900/50 to-black",
    thumbnail: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 6,
    client: "Rust Rooster Records",
    platform: "Instagram Reels",
    views: "1.2M",
    color: "#0f3460",
    gradient: "from-orange-900/50 to-black",
    thumbnail: "https://images.unsplash.com/photo-1514525253361-bee8718a300a?q=80&w=800&auto=format&fit=crop",
  },
];

export default function MovieReel() {
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

    // Use a function to get the latest width during scroll calculations
    const getScrollAmount = () => {
      const horizontalWidth = horizontalReel.scrollWidth;
      return -(horizontalWidth - window.innerWidth + 400);
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${horizontalReel.scrollWidth + 1500}`,
        scrub: 1.5,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true, // Crucial for dynamic width updates
        onUpdate: (self) => {
          const progress = self.progress;
          if (progress > 0.3) {
            const adjustedProgress = (progress - 0.3) / 0.7;
            const frameIndex = Math.floor(adjustedProgress * projects.length);
            setActiveFrame(Math.min(frameIndex, projects.length - 1));
          } else {
            setActiveFrame(-1);
          }
        },
      },
    });

    // 1. Initial Spin & Scale
    tl.fromTo(spinningReel, 
      { rotate: 0, scale: 1, opacity: 1 },
      { rotate: 720, scale: 0.6, duration: 0.4, ease: "power2.inOut" }
    );

    // 2. Explode/Unwind Transition
    tl.to(spinningReel, {
      opacity: 0,
      scale: 3,
      filter: "blur(30px)",
      duration: 0.2,
      ease: "power3.in"
    }, ">-0.1");

    tl.fromTo(horizontalReel, 
      { opacity: 0, scale: 0.8, x: "100%", filter: "blur(10px)" },
      { opacity: 1, scale: 1, x: "0%", filter: "blur(0px)", duration: 0.4, ease: "expo.out" },
      "<"
    );

    // 3. Horizontal Scroll through projects
    tl.to(horizontalReel, {
      x: getScrollAmount,
      ease: "none",
      duration: 1.5,
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section) t.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} id="movie-reel" className="relative h-screen overflow-hidden perspective-2000">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 transition-colors duration-1000 opacity-20 blur-[100px]" 
          style={{ backgroundColor: activeFrame >= 0 ? projects[activeFrame].color : 'transparent' }} 
        />
        <div className="absolute inset-0 bg-[#080808]/45" />
      </div>

      {/* SVG Movie Reel Intro */}
      <div ref={spinningReelRef} className="absolute inset-0 flex items-center justify-center z-10">
        <div className="relative w-[500px] h-[500px]">
          <svg viewBox="0 0 200 200" className="w-full h-full text-foreground/10 fill-current">
            <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="1" fill="none" />
            {[0, 60, 120, 180, 240, 300].map(angle => (
              <circle 
                key={angle}
                cx={100 + 60 * Math.cos(angle * Math.PI / 180)} 
                cy={100 + 60 * Math.sin(angle * Math.PI / 180)} 
                r="15" 
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <h2 className="font-display text-6xl font-bold uppercase tracking-[0.3em] text-foreground">
              OUR<br /><span className="text-accent">REEL</span>
            </h2>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/60">Ready to play</span>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Scroller */}
      <div ref={horizontalReelRef} className="absolute inset-0 flex items-center opacity-0 z-20">
        <div className="flex items-center gap-24 pl-[40vw] pr-[60vw]">
          {projects.map((project, i) => (
            <FilmFrame key={project.id} project={project} index={i} isActive={activeFrame === i} />
          ))}

          {/* Final Call to Action */}
          <div className="flex-shrink-0 w-[450px] h-[600px] rounded-2xl border-2 border-dashed border-foreground/20 flex flex-col items-center justify-center bg-foreground/5 hover:border-accent/50 transition-all duration-500 group">
            <div className="w-20 h-20 rounded-full border border-foreground/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <span className="text-4xl text-foreground/40 group-hover:text-accent">+</span>
            </div>
            <h3 className="font-display text-4xl font-bold text-foreground/40 group-hover:text-foreground">YOUR STORY</h3>
            <p className="font-body text-foreground/20 mt-2">Next Frame: 2024</p>
            <button className="mt-12 px-10 py-4 bg-accent text-background rounded-full font-bold uppercase text-xs tracking-[0.2em] hover:bg-white transition-colors shadow-xl shadow-accent/20">
              Start Project
            </button>
          </div>
        </div>
      </div>

      {/* UI Accents */}
      <div className="absolute top-12 left-12 z-40 hidden md:block">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-foreground/40">Cinematic Portfolio // Vol 1.0</span>
        </div>
      </div>
      
      <div className="absolute bottom-12 right-12 z-40">
        <div className="flex flex-col items-end gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/30">Scroll Down</span>
          <div className="w-32 h-[1px] bg-foreground/10 overflow-hidden">
            <motion.div 
              className="w-full h-full bg-accent origin-left"
              style={{ scaleX: activeFrame >= 0 ? (activeFrame + 1) / projects.length : 0 }}
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
}

function FilmFrame({ project, index, isActive }: { project: Project, index: number, isActive: boolean }) {
  return (
    <motion.div 
      className="flex-shrink-0 relative w-[450px] h-[600px]"
      animate={{ 
        scale: isActive ? 1 : 0.85,
        opacity: isActive ? 1 : 0.3,
        y: isActive ? 0 : 40,
        filter: isActive ? "blur(0px)" : "blur(4px)"
      }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Frame Metadata */}
      <div className="absolute -top-16 left-0 w-full flex justify-between font-mono text-[10px] text-foreground/20 uppercase tracking-[0.2em]">
        <span>Scene // 0{index + 1}</span>
        <span>REC 🔴 00:0{index + 1}:24</span>
      </div>

      <div className="w-full h-full bg-[#121212] rounded-2xl overflow-hidden border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
        {/* Visual Content */}
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
          style={{ backgroundImage: `url(${project.thumbnail})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        
        {/* Interface Overlay */}
        <div className="absolute inset-0 p-10 flex flex-col justify-end">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2 py-0.5 border border-accent text-accent font-mono text-[9px] uppercase font-bold tracking-tighter rounded">
              {project.views} Views
            </span>
            <span className="text-white/40 font-mono text-[10px] uppercase tracking-widest">{project.platform}</span>
          </div>
          
          <h3 className="font-display text-5xl font-bold text-white leading-[1.1] mb-8">{project.client}</h3>
          
          <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-100">
            <button className="flex-1 py-4 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-accent hover:text-white transition-colors">
              Play Case Study
            </button>
            <div className="w-14 h-14 border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
              <span className="text-2xl text-white">→</span>
            </div>
          </div>
        </div>

        {/* Viewfinder Brackets */}
        <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-white/20" />
        <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-white/20" />
        <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-white/20" />
        <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-white/20" />
      </div>
    </motion.div>
  );
}
