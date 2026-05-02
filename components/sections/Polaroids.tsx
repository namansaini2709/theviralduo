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
    title: "Mindful Coffee",
    quote: "Flawless execution, absolute growth.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    color: "#F5F0E8",
    feedback: "The Viral Duo didn't just post for us; they engineered a community. Our engagement rate tripled within the first month.",
    points: "Engagement, Community, Scaling",
    stars: "5"
  },
  {
    title: "Tech Guru",
    quote: "Viral Duo understands the algorithm.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
    color: "#FF6B6B",
    feedback: "Technical precision met creative genius. They navigated the complex B2B space with ease and delivered results.",
    points: "B2B, Lead Gen, Precision",
    stars: "5"
  },
  {
    title: "Rust Rooster",
    quote: "The cinematic quality is unmatched.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    color: "#F2DC78",
    feedback: "Every frame they produced felt like a high-budget movie. They truly elevated our brand's visual identity.",
    points: "Cinematic, Visuals, Luxury",
    stars: "4"
  },
  {
    title: "FitFlow",
    quote: "3.1M views in 48 hours. Unreal.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    color: "#A8F275",
    feedback: "Unprecedented reach. We went from a local gym to a global fitness brand almost overnight.",
    points: "Viral, Global, Fitness",
    stars: "5"
  },
  {
    title: "Bloom",
    quote: "Our sales doubled after the first reel.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80",
    color: "#8998F2",
    feedback: "Direct ROI. Every piece of content they created led to measurable sales growth and brand loyalty.",
    points: "Sales, ROI, Loyalty",
    stars: "5"
  }
];

export default function Polaroids() {
  const { data } = useDynamicData();
  const [mounted, setMounted] = React.useState(false);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
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

  if (!mounted) return <section id="testimonials" className="min-h-[60vh] bg-black" />;

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
      className="py-12 md:py-24 min-h-[80vh] overflow-hidden relative isolate bg-black z-10"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div 
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-500"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(230, 57, 70, 0.15), transparent 60%)`,
          mixBlendMode: "screen"
        }}
      />

      <div className="relative z-10 mb-2 px-6 text-center md:mb-2">
        <h2 className="font-display text-5xl font-bold tracking-tighter md:text-8xl text-white">
          THE <span className="italic text-accent">FEEDBACK</span>
        </h2>
        <div className="mx-auto mt-2 flex max-w-2xl items-center justify-center gap-4">
          <div className="h-px w-12 bg-white/20" />
          <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-white/40">
            Scroll to unlock the cylinder
          </p>
          <div className="h-px w-12 bg-white/20" />
        </div>
      </div>

      <div className="relative z-10 px-0 md:px-4">
        {mediaCollage}
      </div>
    </section>
  );
}
