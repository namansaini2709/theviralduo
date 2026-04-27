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

  React.useEffect(() => {
    setMounted(true);
    // Directly load the component script
    const script = document.createElement("script");
    script.src = "/components/media-collage.js?v=6";
    script.type = "module";
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }, []);

  if (!mounted) return <section id="testimonials" className="min-h-[60vh]" />;

  const mediaCollage = createElement(
    "media-collage",
    {
      "aria-label": "Viral Duo feedback collage",
      "activation-line": "0.5",
      "activation-mode": "center",
      "auto-scroll": "true",
      "scroll-speed": "1.0",
      style: collageStyle,
    },
    [...feedbackItems, ...feedbackItems].map((item, index) =>
      createElement("img", {
        key: `${item.title}-${index}`,
        src: item.image,
        alt: `${item.title} campaign`,
        "data-title": item.title,
        "data-subtitle": item.quote,
        "data-color": item.color,
        "data-feedback": item.feedback,
        "data-points": item.points,
      })
    )
  );

  return (
    <section id="testimonials" className="py-0 md:py-20 overflow-hidden relative isolate">
      <div className="mb-8 px-6 text-center md:mb-16">
        <h2 className="font-display text-5xl font-bold tracking-tighter md:text-8xl">
          THE <span className="italic text-accent">FEEDBACK</span>
        </h2>
        <div className="mx-auto mt-5 flex max-w-2xl items-center justify-center gap-4">
          <div className="h-px w-12 bg-foreground/20" />
          <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-foreground/40">
            Scroll to unlock the cylinder
          </p>
          <div className="h-px w-12 bg-foreground/20" />
        </div>
      </div>

      <div className="px-0 md:px-4">
        {mediaCollage}
      </div>
    </section>
  );
}
