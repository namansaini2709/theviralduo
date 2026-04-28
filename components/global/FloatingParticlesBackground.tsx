"use client";

import { useEffect, useRef } from "react";

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  baseAngle: number;
  phase: number;
}

interface FloatingParticlesBackgroundProps {
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

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const toRgba = (hex: string, alpha: number) => {
  const value = hex.replace("#", "").trim();
  const full = value.length === 3
    ? value.split("").map((char) => char + char).join("")
    : value.slice(0, 6);
  const parsed = parseInt(full || "000000", 16);
  const red = (parsed >> 16) & 255;
  const green = (parsed >> 8) & 255;
  const blue = parsed & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

export default function FloatingParticlesBackground({
  particleCount = 92,
  particleSize = 1.8,
  particleOpacity = 0.82,
  glowIntensity = 12,
  movementSpeed = 0.72,
  mouseInfluence = 150,
  particleColor = "#ffffff",
  mouseGravity = "repel",
  gravityStrength = 17,
  glowAnimation = "ease",
}: FloatingParticlesBackgroundProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const pointerRef = useRef({
    targetX: 0,
    targetY: 0,
    x: 0,
    y: 0,
    inside: false,
    initialized: false,
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motionScale = prefersReducedMotion ? 0.45 : 1;
    const settings = {
      density: clamp(particleCount / 80, 0.35, 3),
      speed: movementSpeed,
      dotSize: particleSize,
      linkDistance: 132,
      dotColor: particleColor,
      lineColor: "#E63946",
      opacity: particleOpacity,
      alpha: clamp(1 + glowIntensity / 48, 0.2, 3),
      interactionRadius: mouseInfluence,
      interactionStrength: mouseGravity === "none" ? 0 : gravityStrength,
      cursorEase: glowAnimation === "instant" ? 0.3 : glowAnimation === "spring" ? 0.18 : 0.12,
    };

    let width = 1;
    let height = 1;
    let dots: Dot[] = [];
    let lastArea = 1;

    const rebuildDots = () => {
      const count = clamp(Math.floor((width * height) / 12000 * settings.density), 28, 340);
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const radiusMax = Math.min(width, height);

      dots = Array.from({ length: count }, () => {
        const baseRadius = radiusMax * (0.15 + Math.random() * 0.36);
        const baseAngle = Math.random() * Math.PI * 2;

        return {
          x: centerX + Math.cos(baseAngle) * baseRadius,
          y: centerY + Math.sin(baseAngle) * baseRadius,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          baseRadius,
          baseAngle,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(2, window.devicePixelRatio || 1);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const pointer = pointerRef.current;
      if (!pointer.initialized) {
        pointer.targetX = width * 0.5;
        pointer.targetY = height * 0.5;
        pointer.x = pointer.targetX;
        pointer.y = pointer.targetY;
        pointer.initialized = true;
      }

      rebuildDots();
      lastArea = width * height;
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const pointer = pointerRef.current;

      pointer.targetX = x;
      pointer.targetY = y;
      pointer.inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    resize();

    const draw = (timeMs: number) => {
      const time = (timeMs / 1000) * motionScale;
      const area = width * height;
      if (Math.abs(area - lastArea) / Math.max(1, lastArea) > 0.3) {
        rebuildDots();
        lastArea = area;
      }

      const pointer = pointerRef.current;
      pointer.x += (pointer.targetX - pointer.x) * settings.cursorEase;
      pointer.y += (pointer.targetY - pointer.y) * settings.cursorEase;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#080808";
      ctx.fillRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const interactionRadius = Math.max(10, settings.interactionRadius);
      const interactionRadiusSquared = interactionRadius * interactionRadius;

      for (const dot of dots) {
        const angle = dot.baseAngle + time * settings.speed * 0.7 + Math.sin(time * 0.6 + dot.phase) * 0.15;
        const radius = dot.baseRadius * (0.92 + 0.08 * Math.sin(time * 1.2 + dot.phase));
        dot.x = centerX + Math.cos(angle) * radius;
        dot.y = centerY + Math.sin(angle) * radius;

          if (pointer.inside && mouseGravity !== "none") {
          const dx = dot.x - pointer.x;
          const dy = dot.y - pointer.y;
          const distanceSquared = dx * dx + dy * dy;

          if (distanceSquared < interactionRadiusSquared) {
            const distance = Math.sqrt(distanceSquared) || 1;
            const falloff = 1 - distance / interactionRadius;
            const direction = mouseGravity === "attract" ? -1 : 1;
            const push = direction * falloff * falloff * settings.interactionStrength * motionScale;
            dot.x += (dx / distance) * push;
            dot.y += (dy / distance) * push;
          }
        }
      }

      const maxDistance = Math.max(20, settings.linkDistance);
      const maxDistanceSquared = maxDistance * maxDistance;
      ctx.lineWidth = 1;

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const first = dots[i];
          const second = dots[j];
          const dx = first.x - second.x;
          const dy = first.y - second.y;
          const distanceSquared = dx * dx + dy * dy;

          if (distanceSquared < maxDistanceSquared) {
            const distance = Math.sqrt(distanceSquared);
            const alpha = clamp((1 - distance / maxDistance) * 0.55 * settings.opacity * settings.alpha, 0, 1);

            ctx.strokeStyle = toRgba(settings.lineColor, alpha);
            ctx.beginPath();
            ctx.moveTo(first.x, first.y);
            ctx.lineTo(second.x, second.y);
            ctx.stroke();
          }
        }
      }

      for (const dot of dots) {
        const pulse = 0.8 + 0.2 * Math.sin(time * 2 + dot.phase);
        const radius = Math.max(0.6, settings.dotSize * pulse);
        const alpha = clamp(0.95 * settings.opacity * settings.alpha, 0, 1);

        ctx.fillStyle = toRgba(settings.dotColor, alpha);
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [
    glowAnimation,
    glowIntensity,
    gravityStrength,
    mouseGravity,
    mouseInfluence,
    movementSpeed,
    particleColor,
    particleCount,
    particleOpacity,
    particleSize,
  ]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 h-full w-full overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
