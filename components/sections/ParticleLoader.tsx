"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const TEXT_POINTS = generateTextPoints();

export default function ParticleLoader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"intro" | "flash" | "particles" | "settle" | "done">("intro");
  const [showText, setShowText] = useState(false);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeline = gsap.timeline({
      onComplete: () => setPhase("done"),
    });

    // 1. Initial State: Small "REC" dot or Camera Icon
    timeline.fromTo(".loader-camera", 
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: "elastic.out(1, 0.5)" }
    );

    // Subtle breathing/pulsing
    timeline.to(".loader-camera", {
      scale: 1.1,
      duration: 0.8,
      repeat: 1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // 2. Camera Flash Burst (Quick Fade to White)
    timeline.add(() => setPhase("flash"), "+=0.2");
    timeline.to(".flash-overlay", {
      opacity: 1,
      duration: 0.1,
      ease: "none"
    });

    // 3. Particle Explosion (Star-like burst)
    timeline.add(() => {
      setPhase("flash"); // Ensure state is correct
      // Hide camera during flash
      gsap.set(".loader-camera", { display: "none" });
    });

    timeline.to(".flash-overlay", {
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });

    // Stars/Particles fly out from center
    timeline.fromTo(".particle", 
      { x: 0, y: 0, scale: 0, opacity: 0 },
      {
        x: () => (Math.random() - 0.5) * window.innerWidth * 1.5,
        y: () => (Math.random() - 0.5) * window.innerHeight * 1.5,
        scale: () => Math.random() * 2 + 0.5,
        opacity: 1,
        duration: 1.5,
        stagger: { amount: 0.5, from: "random" },
        ease: "expo.out"
      },
      "<"
    );

    // 4. Condense to Text
    timeline.to(".particle", {
      x: (i) => TEXT_POINTS[i % TEXT_POINTS.length].x,
      y: (i) => TEXT_POINTS[i % TEXT_POINTS.length].y,
      scale: 1,
      duration: 2,
      stagger: { amount: 1, from: "center" },
      ease: "power4.inOut"
    }, "+=0.5");

    // Fade out particles and show real text for crispness
    timeline.add(() => setShowText(true));
    timeline.to(".particle", { opacity: 0, duration: 0.5 });
    timeline.fromTo(".loader-text", 
      { opacity: 0, letterSpacing: "1em", filter: "blur(10px)" },
      { opacity: 1, letterSpacing: "normal", filter: "blur(0px)", duration: 1, ease: "expo.out" },
      "<"
    );

    // Final Hold
    timeline.to(".loader-text", { scale: 1.1, opacity: 0, filter: "blur(20px)", duration: 1, ease: "power2.in" }, "+=1");

    return () => {
      timeline.kill();
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9990] bg-[#080808] flex items-center justify-center overflow-hidden">
      {/* Flash Overlay */}
      <div className="flash-overlay absolute inset-0 bg-white z-[9999] opacity-0 pointer-events-none" />

      {/* Particles (Stars) */}
      <div ref={particlesRef} className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[...Array(200)].map((_, i) => (
          <div 
            key={i} 
            className="particle absolute w-1 h-1 bg-white rounded-full"
            style={{ boxShadow: i % 10 === 0 ? "0 0 10px 2px white" : "none" }}
          />
        ))}
      </div>

      {/* Camera Icon */}
      <div className="loader-camera absolute w-32 h-32 flex flex-col items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M19 9h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-white font-mono text-[10px] mt-4 tracking-[0.5em] animate-pulse">INITIATING...</span>
      </div>

      {/* Final Text */}
      {showText && (
        <div className="loader-text absolute text-center">
          <h1 className="font-display text-7xl md:text-9xl font-bold text-white tracking-tighter">
            VIRAL<span className="text-accent">DUO</span>
          </h1>
        </div>
      )}
    </div>
  );
}

function generateTextPoints() {
  const points: { x: number, y: number }[] = [];
  // Approximate VIRAL DUO layout
  const rows = 12;
  const cols = 40;
  const spacing = 20;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Logic to only add points where the letters would be
      // Here we just create a centered block for the particles to fly into
      points.push({
        x: (c - cols / 2) * spacing,
        y: (r - rows / 2) * spacing
      });
    }
  }
  return points;
}
