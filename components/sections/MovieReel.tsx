"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import CinematicReel from "../global/CinematicReel";

const projects = [
  {
    id: 1,
    client: "Anytime Fitness",
    platform: "Instagram Reels",
    views: "1.2M",
    color: "#8E24AA",
    gradient: "from-purple-900/50 to-black",
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    client: "Vdmc",
    platform: "Corporate Video",
    views: "850K",
    color: "#1E88E5",
    gradient: "from-blue-900/50 to-black",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    client: "Make your trip possible",
    platform: "Travel Film",
    views: "2.1M",
    color: "#F4511E",
    gradient: "from-orange-900/50 to-black",
    thumbnail: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    client: "Fof fitnesa",
    platform: "TikTok",
    views: "1.5M",
    color: "#43A047",
    gradient: "from-green-900/50 to-black",
    thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    client: "Sharma ke bhature",
    platform: "Food Vlog",
    views: "3.4M",
    color: "#FB8C00",
    gradient: "from-amber-900/50 to-black",
    thumbnail: "https://images.unsplash.com/photo-1589187151032-573a91317445?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 6,
    client: "Radhe krishna",
    platform: "Spiritual Reel",
    views: "4.2M",
    color: "#D81B60",
    gradient: "from-pink-900/50 to-black",
    thumbnail: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 7,
    client: "Global holidays",
    platform: "Adventure Film",
    views: "920K",
    color: "#00ACC1",
    gradient: "from-cyan-900/50 to-black",
    thumbnail: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 8,
    client: "City gym",
    platform: "Workout Reel",
    views: "1.1M",
    color: "#546E7A",
    gradient: "from-slate-900/50 to-black",
    thumbnail: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 9,
    client: "Saral",
    platform: "Instagram Reels",
    views: "2.3M",
    color: "#E63946",
    gradient: "from-red-900/50 to-black",
    thumbnail: "/assets/projects/saral-gym-thumb.jpg",
    video: "/assets/projects/saral-gym.mp4",
    logo: "/assets/projects/saral-gym-logo.jpg",
    link: "https://www.instagram.com/reel/DXUHP30k_Xl/",
    watchMoreLink: "https://www.instagram.com/_saralgym_/reels/",
    logoLink: "https://www.instagram.com/_saralgym_/",
  },
  {
    id: 10,
    client: "Career launcher",
    platform: "Education Promo",
    views: "1.8M",
    color: "#3949AB",
    gradient: "from-indigo-900/50 to-black",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
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
      // Scroll until the last element (CTA) is fully shown
      return -(horizontalWidth - window.innerWidth);
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${horizontalReel.scrollWidth}`, // Tighter end based on content width
        scrub: 1, // Snappier scroll response
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          // Sync active frame highlighting with the horizontal scroll phase
          // The horizontal scroll starts after the intro (approx 35% into the timeline)
          if (progress > 0.35) {
            const adjustedProgress = (progress - 0.35) / 0.65;
            const frameIndex = Math.floor(adjustedProgress * projects.length);
            setActiveFrame(Math.min(frameIndex, projects.length - 1));
          } else {
            setActiveFrame(-1);
          }
        },
      },
    });

    // 1. Initial Spin & Scale (The "Unspooling" Start)
    tl.fromTo(spinningReel, 
      { rotate: 0, scale: 1, opacity: 1, filter: "blur(0px)" },
      { 
        rotate: 360, 
        scale: 0.8, 
        duration: 0.8, 
        ease: "power2.inOut" 
      }
    );

    // Synchronize Text Character Coloring
    tl.to(".reel-char", {
      fill: "#E63946",
      opacity: 1,
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.inOut"
    }, 0);

    // Staggered Color Reveal for Thumbnails
    tl.to(".reel-thumb", {
      filter: "grayscale(0%)",
      opacity: 1,
      duration: 0.6,
      stagger: 0.08,
      ease: "power2.inOut"
    }, 0.05);

    // 2. The Reel fades out smoothly
    tl.to(spinningReel, {
      opacity: 0,
      scale: 0.6,
      duration: 0.6,
      ease: "power2.inOut"
    }, ">-0.1");

    // 3. Horizontal Scroller enters
    tl.fromTo(horizontalReel, 
      { opacity: 0, scale: 0.96, x: "100%", filter: "blur(8px)" },
      { 
        opacity: 1, 
        scale: 1, 
        x: "0%", 
        filter: "blur(0px)", 
        duration: 1, 
        ease: "expo.out" 
      },
      ">-0.3"
    );

    // 4. Horizontal Scroll through projects
    tl.to(horizontalReel, {
      x: getScrollAmount,
      ease: "none",
      duration: 4, // Give horizontal scroll more weight in the total timeline
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
      <div ref={spinningReelRef} className="absolute inset-0 flex items-center justify-center z-10 p-4">
        <div className="relative w-full h-full max-w-[600px] max-h-[600px] aspect-square">
          <CinematicReel thumbnails={projects.map(p => p.logo || p.thumbnail)} />
        </div>
      </div>

      {/* Horizontal Scroller */}
      <div ref={horizontalReelRef} className="absolute inset-0 flex items-center opacity-0 z-20">
        <div className="flex items-center gap-12 md:gap-24 pl-[7.5vw] md:pl-[40vw] pr-[50vw] md:pr-[60vw]">
          {projects.map((project, i) => (
            <FilmFrame key={project.id} project={project} index={i} isActive={activeFrame === i} />
          ))}

          {/* Final Call to Action */}
          <div className="flex-shrink-0 w-[85vw] md:w-[450px] h-[480px] md:h-[520px] rounded-2xl border-2 border-dashed border-foreground/20 flex flex-col items-center justify-center bg-foreground/5 hover:border-accent/50 transition-all duration-500 group">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-foreground/20 flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform">
              <span className="text-3xl md:text-4xl text-foreground/40 group-hover:text-accent">+</span>
            </div>
            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground/40 group-hover:text-foreground">YOUR STORY</h3>
            <p className="font-body text-foreground/20 mt-2 text-sm md:text-base">Next Frame: 2024</p>
            <button className="mt-8 md:mt-12 px-8 md:px-10 py-3 md:py-4 bg-accent text-background rounded-full font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] hover:bg-white transition-colors shadow-xl shadow-accent/20">
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
  video?: string;
  logo?: string;
  link?: string;
  watchMoreLink?: string;
  logoLink?: string;
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
      className={`flex-shrink-0 relative w-[85vw] md:w-[450px] h-[480px] md:h-[520px] ${showVideo && project.link ? "cursor-pointer" : ""}`}
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
          <span className="flex items-center gap-2">REC <span className="w-2 h-2 rounded-full bg-[#E63946] animate-pulse" /> 00:0{index + 1}:24</span>
        </div>

        {/* Visual Content */}
        <div 
          className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-110 group-hover:scale-100 ${isActive ? "grayscale-0" : "grayscale"}`}
          style={{ backgroundImage: `url(${project.thumbnail})` }}
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
            <span className="px-2 py-0.5 border border-accent text-accent font-mono text-[9px] uppercase font-bold tracking-tighter rounded">
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
                <button className="w-full py-4 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-accent hover:text-white transition-colors">
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
                    className="w-full h-full object-cover scale-125 mix-blend-screen opacity-60"
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
                    className="w-full h-full object-cover scale-125 mix-blend-screen opacity-60"
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
