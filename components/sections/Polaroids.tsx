"use client";

import React, { createElement, type CSSProperties } from "react";

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
    points: "Engagement, Community, Scaling"
  },
  {
    title: "Tech Guru",
    quote: "Viral Duo understands the algorithm.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
    color: "#FF6B6B",
    feedback: "Technical precision met creative genius. They navigated the complex B2B space with ease and delivered results.",
    points: "B2B, Lead Gen, Precision"
  },
  {
    title: "Rust Rooster",
    quote: "The cinematic quality is unmatched.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    color: "#F2DC78",
    feedback: "Every frame they produced felt like a high-budget movie. They truly elevated our brand's visual identity.",
    points: "Cinematic, Visuals, Luxury"
  },
  {
    title: "FitFlow",
    quote: "3.1M views in 48 hours. Unreal.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    color: "#A8F275",
    feedback: "Unprecedented reach. We went from a local gym to a global fitness brand almost overnight.",
    points: "Viral, Global, Fitness"
  },
  {
    title: "Bloom",
    quote: "Our sales doubled after the first reel.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80",
    color: "#8998F2",
    feedback: "Direct ROI. Every piece of content they created led to measurable sales growth and brand loyalty.",
    points: "Sales, ROI, Loyalty"
  }
];

export default function Polaroids() {
  const [mounted, setMounted] = React.useState(false);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    // Directly load the component script
    const script = document.createElement("script");
    script.src = "/components/media-collage.js?v=6";
    script.type = "module";
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }, []);

  if (!mounted) return <section id="testimonials" className="min-h-[60vh] bg-black" />;

  const mediaCollage = createElement(
    "media-collage",
    {
      "aria-label": "Viral Duo feedback collage",
      "activation-mode": "threshold",
      "activation-threshold": "0",
      "auto-scroll": "true",
      "scroll-speed": "1.0",
      style: collageStyle,
    },
    // Duplicate items 8 times to reach 40 items total (since there are 5 unique items).
    // 20 items = 360 degrees, so 40 items allows a perfect 360 degree loop without hitting edges.
    [...Array(8)].flatMap(() => feedbackItems).map((item, index) =>
      createElement("media-collage-item", {
        key: `${item.title}-${index}`,
        "data-title": item.title,
        "data-subtitle": item.quote,
        "data-color": item.color,
        "data-feedback": item.feedback,
        "data-points": item.points,
      })
    )
  );

  return (
    <section 
      id="testimonials" 
      className="py-0 md:py-20 overflow-hidden relative isolate bg-black"
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
      {/* Red glow effect that follows the mouse */}
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
