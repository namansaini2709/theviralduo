"use client";

import React, { createElement, type CSSProperties } from "react";
import { useDynamicData } from "@/lib/DynamicDataContext";

const collageStyle = {
  "--media-collage-bg": "transparent",
  "--media-collage-radius": "42px",
  "--media-collage-media-radius": "42px",
  "--media-collage-shadow": "0 40px 100px rgba(0, 0, 0, 0.6)",
} as CSSProperties;

const feedbackItems: any[] = [];

export default function Polaroids() {
  const { data } = useDynamicData();
  const [mounted, setMounted] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    // Prevent multiple script injections
    if (!document.getElementById("media-collage-script")) {
      const script = document.createElement("script");
      script.id = "media-collage-script";
      script.src = "/components/media-collage.js?v=6";
      script.type = "module";
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const sectionRef = React.useRef<HTMLElement>(null);

  const finalFeedback = [...feedbackItems, ...(data?.feedback || [])];

  const mediaCollageItems = React.useMemo(() => {
    if (finalFeedback.length === 0) return [];
    // If mobile, don't duplicate items as we are using a simple horizontal slider
    if (isMobile) return finalFeedback;
    
    // Duplicate items to ensure enough total items for the cylinder loop
    // Aim for ~40 items total for a perfect 360 degree loop
    return [...Array(Math.ceil(40 / finalFeedback.length))].flatMap(() => finalFeedback);
  }, [finalFeedback, isMobile]);

  const mediaCollage = createElement(
    "media-collage",
    {
      key: `collage-${JSON.stringify(finalFeedback)}-${isMobile}`, // Force re-mount when content or mode changes
      "aria-label": "Viral Duo feedback collage",
      "activation-mode": "threshold",
      "activation-threshold": "0",
      "auto-scroll": isMobile ? "false" : "true", // Disable auto-scroll on mobile for better touch UX
      "scroll-speed": "1.0",
      style: collageStyle,
    },
    mediaCollageItems.map((item, index) =>
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
  );

  if (!mounted) return <section id="testimonials" className="min-h-[60vh] bg-transparent" />;
  if (finalFeedback.length === 0) return null;

  return (
    <section 
      id="testimonials" 
      ref={sectionRef}
      className="py-12 md:py-24 min-h-fit md:min-h-[80vh] overflow-hidden relative isolate bg-brand-soft/30 z-10 flex flex-col items-center justify-center"
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
            <span className="md:hidden">Swipe to explore success stories</span>
          </p>
          <div className="h-px w-8 md:w-12 bg-black/20" />
        </div>
      </div>

      <div className="relative z-10 px-0 md:px-4 w-full">
        {mediaCollage}
      </div>
    </section>
  );
}
