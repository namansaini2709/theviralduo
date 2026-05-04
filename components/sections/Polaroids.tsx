"use client";

import React, { createElement, type CSSProperties } from "react";
import { useDynamicData } from "@/lib/DynamicDataContext";

const collageStyle = {
  "--media-collage-bg": "transparent",
  "--media-collage-radius": "42px",
  "--media-collage-media-radius": "42px",
  "--media-collage-shadow": "0 40px 100px rgba(0, 0, 0, 0.6)",
} as CSSProperties;

const feedbackItems = [
  {
    title: "Anytime Fitness",
    quote: "Poore India mein aag laga di! 1.2M views.",
    image: "/brands/anytime-fitness.jpg",
    color: "#8E24AA",
    feedback: "The Viral Duo understands the Indian pulse perfectly. Our gym memberships skyrocketed across all branches. Unki cinematic editing ka koi muqabla nahi!",
    points: "India-wide, Memberships, Desi Hustle",
    stars: "5"
  },
  {
    title: "Vdmc",
    quote: "Malai Chaap ki virality, Viral Duo ke saath!",
    image: "/brands/vdmc.jpg",
    color: "#1E88E5",
    feedback: "They captured the 'asli swaad' of our brand. Content itna engaging tha ki log door-door se humari outlet par aa rahe hain. Sahi mein amazing kaam hai!",
    points: "Engagement, Foodies, Results",
    stars: "5"
  },
  {
    title: "Make Your Trip Possible",
    quote: "Desi travelers ke liye best content creator.",
    image: "/brands/make-your-trip.jpg",
    color: "#F4511E",
    feedback: "Indian scenery ko cinematic banana inki khoobi hai. Our travel packages sold out for the season thanks to their viral reels. Super proud of this partnership!",
    points: "Cinematic, Travel Goals, Premium",
    stars: "5"
  },
  {
    title: "FOF Fitness",
    quote: "Retention levels are off the charts, boss!",
    image: "/brands/fof-fitness.jpeg",
    color: "#43A047",
    feedback: "Data toh sab padhte hain, par audience ka dil kaise jeetna hai yeh Viral Duo jaante hain. Every reel felt like a Bollywood blockbuster in 60 seconds.",
    points: "Audience Love, Iteration, Scale",
    stars: "5"
  },
  {
    title: "Sharma Ji Ke Bhature",
    quote: "Dilli ki virality at its best! 3.4M views.",
    image: "/brands/sharma-ji.jpg",
    color: "#FB8C00",
    feedback: "Viral Duo ne toh Sharma ji ke bhature ko poore Internet par famous kar diya. Humare yahan ab bheed sambhalti nahi hai. Solid work team!",
    points: "Dilli Swag, Viral, Footfall",
    stars: "5"
  },
  {
    title: "Global Holidays",
    quote: "Indian families ka favorite vacation content.",
    image: "/brands/global-holidays.png",
    color: "#00ACC1",
    feedback: "Professionalism aur creativity ka perfect mix. They know how to target the Indian middle class and high-net-worth families perfectly. Paisa vasool results!",
    points: "Paisa Vasool, ROI, Vacation",
    stars: "4"
  },
  {
    title: "Career Launcher",
    quote: "Students are loving the new brand vibe.",
    image: "/brands/career-launcher.jpg",
    color: "#3949AB",
    feedback: "Educational content itna cool ho sakta hai, humne socha nahi tha. Students everywhere are recognizing us now. They made learning look cinematic and viral!",
    points: "Students, Impact, Branding",
    stars: "5"
  }
];

export default function Polaroids() {
  const { data } = useDynamicData();
  const [mounted, setMounted] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    
    // Prevent multiple script injections
    if (!document.getElementById("media-collage-script")) {
      const script = document.createElement("script");
      script.id = "media-collage-script";
      script.src = "/components/media-collage.js?v=6";
      script.type = "module";
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }
  }, []);

  const sectionRef = React.useRef<HTMLElement>(null);

  if (!mounted) return <section id="testimonials" className="min-h-[60vh] bg-transparent" />;

  const finalFeedback = [...feedbackItems, ...(data?.feedback || [])];

  const mediaCollage = createElement(
    "media-collage",
    {
      key: `collage-${finalFeedback.length}`, // Force re-mount when count changes
      "aria-label": "Viral Duo feedback collage",
      "activation-mode": "threshold",
      "activation-threshold": "0",
      "auto-scroll": "true",
      "scroll-speed": "1.0",
      style: collageStyle,
    },
    // Duplicate items to ensure enough total items for the cylinder loop
    // Aim for ~40 items total for a perfect 360 degree loop
    finalFeedback.length > 0 
      ? [...Array(Math.ceil(40 / finalFeedback.length))].flatMap(() => finalFeedback).map((item, index) =>
          createElement("media-collage-item", {
            key: `${item.title}-${index}-${item.stars}-${item.image?.length}`,
            "data-title": item.title,
            "data-subtitle": item.quote,
            "data-color": item.color,
            "data-feedback": item.feedback || item.quote,
            "data-points": item.points || item.role || "",
            "data-image": item.image || "",
            "data-stars": item.stars || "5",
          })
        )
      : []
  );

  if (finalFeedback.length === 0) return null;

  return (
    <section 
      id="testimonials" 
      ref={sectionRef}
      className="py-12 md:py-24 min-h-fit md:min-h-[80vh] overflow-hidden relative isolate bg-transparent z-10 flex flex-col items-center justify-center"
      onMouseMove={(e) => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        sectionRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        sectionRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div 
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-500"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(77, 184, 229, 0.15), transparent 60%)`,
        }}
      />

      <div className="relative z-10 mb-8 px-6 text-center">
        <h2 className="font-serif text-4xl md:text-8xl font-black tracking-tight text-brand-deep uppercase">
          THE <span className="font-serif italic text-gradient px-4">FEEDBACK</span>
        </h2>
        <div className="mx-auto mt-4 flex max-w-2xl items-center justify-center gap-4">
          <div className="h-px w-8 md:w-12 bg-black/20" />
          <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.5em] text-black/40">
            <span className="hidden md:inline">Scroll to unlock the cylinder</span>
            <span className="md:hidden">Swipe for growth stories</span>
          </p>
          <div className="h-px w-8 md:w-12 bg-black/20" />
        </div>
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block relative z-10 px-0 md:px-4 w-full">
        {mediaCollage}
      </div>

      {/* Mobile Version - Horizontal Scroll */}
      <div className="md:hidden w-full overflow-x-auto snap-x snap-mandatory flex gap-5 px-6 pb-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {finalFeedback.map((item, index) => (
          <div 
            key={index} 
            className="snap-center shrink-0 w-[88vw] bg-white rounded-[40px] p-8 flex flex-col gap-6 shadow-2xl border border-black/5 relative overflow-hidden group"
          >
            {/* Background Glow */}
            <div 
              className="absolute -top-20 -right-20 w-64 h-64 opacity-[0.07] blur-[80px] rounded-full transition-transform duration-1000 group-hover:scale-110"
              style={{ backgroundColor: item.color }}
            />
            
            {/* Header: Stars & Quote Icon */}
            <div className="flex justify-between items-start">
              <div className="flex gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className="w-4 h-4" 
                    viewBox="0 0 24 24" 
                    fill={i < parseInt(item.stars || "5") ? "#FFD43B" : "#E5E7EB"}
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                ))}
              </div>
              <span className="font-serif text-5xl text-black/[0.03] select-none italic absolute right-8 top-6">"</span>
            </div>

            {/* Quote */}
            <blockquote className="relative z-10">
              <p className="font-serif italic text-2xl leading-[1.2] text-brand-deep mb-4">
                {item.quote}
              </p>
              <p className="text-[13px] leading-relaxed text-black/60 font-body">
                {item.feedback || item.quote}
              </p>
            </blockquote>

            {/* Client Info */}
            <div className="mt-auto flex items-center gap-4">
              <div className="relative shrink-0">
                <div 
                  className="absolute inset-0 rounded-full blur-md opacity-20"
                  style={{ backgroundColor: item.color }}
                />
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm relative z-10 bg-white">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" 
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <h4 className="font-display font-black text-[11px] uppercase tracking-[0.15em] text-brand-deep leading-none">
                  {item.title}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                   {(item.points || "").split(',').map((p, i) => (
                     <span key={i} className="text-[8px] uppercase font-bold px-2.5 py-1 rounded-full bg-brand-soft text-brand-sky border border-brand-border/50">
                       {p.trim()}
                     </span>
                   ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* Invisible spacer to allow full centering of the last card */}
        <div className="shrink-0 w-6" />
      </div>
    </section>
  );
}
