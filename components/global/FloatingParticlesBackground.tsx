"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

// ====== Constants ======
const Z_NEAR = 0.12;
const Z_FAR = 0.98;
const OFFSCREEN_MARGIN = 50;

// ---------- Utils ----------
function saturate(t: number) {
  return t < 0 ? 0 : t > 1 ? 1 : t;
}
function smooth01(t: number) {
  return t * t * (3 - 2 * t);
}

function parseColor(input: string) {
  const c = (input || "#000000").trim().toLowerCase();
  if (c[0] === "#") {
    const h = c.slice(1);
    if (h.length === 3 || h.length === 4) {
      const r = parseInt(h[0] + h[0], 16);
      const g = parseInt(h[1] + h[1], 16);
      const b = parseInt(h[2] + h[2], 16);
      const a = h.length === 4 ? parseInt(h[3] + h[3], 16) / 255 : 1;
      return { r, g, b, a };
    }
    if (h.length === 6 || h.length === 8) {
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
      return { r, g, b, a };
    }
  }
  return { r: 0, g: 0, b: 0, a: 1 };
}

interface Star {
  x: number;
  y: number;
  z: number;
  px: number | null;
  py: number | null;
  phase: number;
  twinkle: number;
  size: number;
  cr: number;
  cg: number;
  cb: number;
}

export default function FloatingParticlesBackground() {
  // Settings based on the Framer Starsfield
  const starCount = 400;
  const speed = 0.08;
  const spread = 2.5;
  const focal = 0.7;
  const twinkle = 0.4;
  const trail = 0.15;
  const starSize = 0.8;
  const bgColor = "#080808";
  const starColor = "#FFFFFF"; // Changed to White
  const fadeInRange = 0.4;
  const followCursor = true;

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef(performance.now());
  const followTargetRef = useRef({ x: 0, y: 0 });
  const followRef = useRef({ x: 0, y: 0 });

  const colorCacheRef = useRef({
    bg: parseColor(bgColor),
    star: parseColor(starColor),
  });

  const respawnStar = (s: Star, w: number, h: number, f: number, spread: number, starSize: number, baseColor: any, zOverride?: number) => {
    const z = zOverride ?? Z_FAR;
    const halfW = w / 2;
    const halfH = h / 2;
    const sx = (Math.random() * 2 - 1) * (halfW * spread + OFFSCREEN_MARGIN);
    const sy = (Math.random() * 2 - 1) * (halfH * spread + OFFSCREEN_MARGIN);
    s.z = z;
    s.x = (sx * z) / f;
    s.y = (sy * z) / f;
    s.px = null;
    s.py = null;
    s.phase = Math.random() * Math.PI * 2;
    s.twinkle = 0.5 + Math.random() * 1.5;
    s.size = starSize * (0.6 + Math.random() * 0.8);
    s.cr = baseColor.r;
    s.cg = baseColor.g;
    s.cb = baseColor.b;
  };

  const initStars = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const f = Math.min(w, h) * focal;
    const baseStarColor = colorCacheRef.current.star;

    const arr: Star[] = new Array(starCount).fill(0).map(() => {
      const z = Z_NEAR + Math.random() * (Z_FAR - Z_NEAR);
      const worldW = (w * z) / f;
      const worldH = (h * z) / f;
      return {
        z,
        x: (Math.random() - 0.5) * worldW * spread,
        y: (Math.random() - 0.5) * worldH * spread,
        px: null,
        py: null,
        phase: Math.random() * Math.PI * 2,
        twinkle: 0.5 + Math.random() * 1.5,
        size: starSize * (0.6 + Math.random() * 0.8),
        cr: baseStarColor.r,
        cg: baseStarColor.g,
        cb: baseStarColor.b,
      };
    });
    starsRef.current = arr;
  }, [starCount, focal, spread, starSize]);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }, []);

  const drawFrame = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, now: number, dt: number) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const baseCx = w / 2;
    const baseCy = h / 2;
    const { bg, star } = colorCacheRef.current;

    ctx.globalCompositeOperation = "source-over";
    const clearA = (1 - Math.min(0.95, Math.max(0, trail))) * bg.a;
    ctx.fillStyle = `rgba(${bg.r},${bg.g},${bg.b},${clearA})`;
    ctx.fillRect(0, 0, w, h);

    let camX = baseCx;
    let camY = baseCy;

    if (followCursor) {
      const follow = followRef.current;
      const target = followTargetRef.current;
      const k = dt > 0 ? Math.min(1, dt * 6) : 0;
      follow.x += (target.x - follow.x) * k;
      follow.y += (target.y - follow.y) * k;
      const followAmount = 0.15;
      camX = baseCx - follow.x * w * followAmount;
      camY = baseCy - follow.y * h * followAmount;
    }

    const f = Math.min(w, h) * focal;
    const speedFactor = dt * speed * 0.7 * -1;
    const twinkleSpeed = now * 0.0015;
    const depthSpan = Z_FAR - Z_NEAR;
    const range = Math.max(0.05, Math.min(fadeInRange, depthSpan));
    const invRange = 1 / range;

    const stars = starsRef.current;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.z += speedFactor;

      if (s.z <= Z_NEAR) {
        respawnStar(s, w, h, f, spread, starSize, star);
        continue;
      }

      const invz = 1 / s.z;
      const x2d = s.x * f * invz + camX;
      const y2d = s.y * f * invz + camY;

      if (x2d < -OFFSCREEN_MARGIN || x2d > w + OFFSCREEN_MARGIN || y2d < -OFFSCREEN_MARGIN || y2d > h + OFFSCREEN_MARGIN) {
        respawnStar(s, w, h, f, spread, starSize, star);
        continue;
      }

      const twk = Math.max(0, Math.min(1, 0.65 + twinkle * 0.35 * Math.sin(s.phase + twinkleSpeed * s.twinkle)));
      const tFar = (Z_FAR - s.z) * invRange;
      const tNear = (s.z - Z_NEAR) * invRange;
      const appear = smooth01(saturate(tFar)) * smooth01(saturate(tNear));
      const perspectiveSize = s.size * invz;
      const size = perspectiveSize * appear;
      const baseAlpha = Math.min(1, (0.15 + twk * 0.9) * star.a);
      const alpha = baseAlpha * appear;

      if (size < 0.1 || alpha < 0.01) continue;

      ctx.fillStyle = `rgba(${s.cr},${s.cg},${s.cb},${alpha})`;
      if (size < 2) {
        ctx.fillRect(x2d, y2d, size, size);
      } else {
        ctx.beginPath();
        ctx.arc(x2d, y2d, size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [trail, speed, focal, twinkle, fadeInRange, followCursor, spread, starSize]);

  useEffect(() => {
    resize();
    initStars();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;
      drawFrame(ctx, canvas, now, dt);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    const onResize = () => {
      resize();
      initStars();
    };

    const onPointerMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth;
      const ny = e.clientY / window.innerHeight;
      followTargetRef.current.x = (nx - 0.5) * 2;
      followTargetRef.current.y = (ny - 0.5) * 2;
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [initStars, resize, drawFrame]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#080808]"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
