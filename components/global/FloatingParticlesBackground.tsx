"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  baseOpacity: number;
  glowMultiplier: number;
  glowVelocity: number;
}

interface FloatingParticlesProps {
  particleCount?: number;
  particleSize?: number;
  particleOpacity?: number;
  glowIntensity?: number;
  movementSpeed?: number;
  mouseInfluence?: number;
  particleColor?: string;
  mouseGravity?: "none" | "attract" | "repel";
  gravityStrength?: number;
  glowAnimation?: "instant" | "ease" | "spring";
}

export default function FloatingParticlesBackground({
  particleCount = 60,
  particleSize = 1.5,
  particleOpacity = 0.4,
  glowIntensity = 8,
  movementSpeed = 0.3,
  mouseInfluence = 120,
  particleColor = "#FFFFFF",
  mouseGravity = "repel",
  gravityStrength = 40,
  glowAnimation = "ease",
}: FloatingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const initializeParticles = useCallback(
    (width: number, height: number) => {
      const count = isMobile ? Math.floor(particleCount / 2) : particleCount;
      return Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * movementSpeed,
        vy: (Math.random() - 0.5) * movementSpeed,
        size: Math.random() * particleSize + 0.5,
        opacity: particleOpacity,
        baseOpacity: particleOpacity,
        glowMultiplier: 1,
        glowVelocity: 0,
      }));
    },
    [particleCount, particleSize, particleOpacity, movementSpeed, isMobile]
  );

  const updateParticles = useCallback(
    (width: number, height: number) => {
      const mouse = mouseRef.current;
      particlesRef.current.forEach((particle) => {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseInfluence && distance > 0) {
          const force = (mouseInfluence - distance) / mouseInfluence;
          const normalizedDx = dx / distance;
          const normalizedDy = dy / distance;
          const gravityForce = force * (gravityStrength * 0.001);

          if (mouseGravity === "attract") {
            particle.vx += normalizedDx * gravityForce;
            particle.vy += normalizedDy * gravityForce;
          } else if (mouseGravity === "repel") {
            particle.vx -= normalizedDx * gravityForce;
            particle.vy -= normalizedDy * gravityForce;
          }

          particle.opacity = Math.min(0.8, particle.baseOpacity + force * 0.4);
          
          const targetGlow = 1 + force * 2;
          const currentGlow = particle.glowMultiplier;
          
          if (glowAnimation === "instant") {
            particle.glowMultiplier = targetGlow;
          } else if (glowAnimation === "ease") {
            particle.glowMultiplier = currentGlow + (targetGlow - currentGlow) * 0.15;
          } else if (glowAnimation === "spring") {
            const springForce = (targetGlow - currentGlow) * 0.2;
            const damping = 0.85;
            particle.glowVelocity = particle.glowVelocity * damping + springForce;
            particle.glowMultiplier = currentGlow + particle.glowVelocity;
          }
        } else {
          particle.opacity = Math.max(particle.baseOpacity * 0.5, particle.opacity - 0.01);
          const targetGlow = 1;
          const currentGlow = particle.glowMultiplier;
          
          if (glowAnimation === "instant") {
            particle.glowMultiplier = targetGlow;
          } else if (glowAnimation === "ease") {
            particle.glowMultiplier = Math.max(1, currentGlow + (targetGlow - currentGlow) * 0.08);
          } else if (glowAnimation === "spring") {
            const springForce = (targetGlow - currentGlow) * 0.15;
            const damping = 0.9;
            particle.glowVelocity = particle.glowVelocity * damping + springForce;
            particle.glowMultiplier = Math.max(1, currentGlow + particle.glowVelocity);
          }
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        // Subtle random drift
        particle.vx += (Math.random() - 0.5) * 0.001;
        particle.vy += (Math.random() - 0.5) * 0.001;

        // Damping
        particle.vx *= 0.995;
        particle.vy *= 0.995;

        // Wrap around edges
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;
      });
    },
    [mouseInfluence, mouseGravity, gravityStrength, glowAnimation]
  );

  const drawParticles = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.clearRect(0, 0, width, height);
      particlesRef.current.forEach((particle) => {
        ctx.save();
        const currentGlowMultiplier = particle.glowMultiplier;
        ctx.shadowColor = particleColor;
        ctx.shadowBlur = glowIntensity * currentGlowMultiplier;
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    },
    [particleColor, glowIntensity]
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      particlesRef.current = initializeParticles(canvas.width, canvas.height);
    };

    resize();
    
    const animate = () => {
      updateParticles(canvas.width, canvas.height);
      drawParticles(ctx, canvas.width, canvas.height);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [initializeParticles, updateParticles, drawParticles]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 w-full h-full -z-40 pointer-events-none overflow-hidden"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
