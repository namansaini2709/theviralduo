"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FRAME_COUNT = 80; // Total frames from Animation_000 to Animation_079

interface HeroAnimationLoaderProps {
  onComplete: () => void;
}

const HeroAnimationLoader: React.FC<HeroAnimationLoaderProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const animationRef = useRef<number>();
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    let errorCount = 0;
    const images: HTMLImageElement[] = [];

    const handleLoad = () => {
      loadedCount++;
      setProgress(Math.floor(((loadedCount + errorCount) / FRAME_COUNT) * 100));
      if (loadedCount + errorCount === FRAME_COUNT) {
        setIsLoaded(true);
      }
    };

    const handleError = () => {
      errorCount++;
      setHasError(true);
      setProgress(Math.floor(((loadedCount + errorCount) / FRAME_COUNT) * 100));
      if (loadedCount + errorCount === FRAME_COUNT) {
        setIsLoaded(true);
      }
    };

    // Load all 80 frames
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/assets/loading-animation/Animation_${i.toString().padStart(3, '0')}.jpg`;
      img.onload = handleLoad;
      img.onerror = handleError;
      images.push(img);
    }
    imagesRef.current = images;

    // Safety timeout: 6 seconds max loading time (increased for 80 high-res frames)
    const timeout = setTimeout(() => {
      if (!isLoaded) {
        setIsLoaded(true);
      }
    }, 6000);

    return () => {
      clearTimeout(timeout);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isLoaded]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const img = imagesRef.current[frameIndexRef.current];
    if (img && img.complete) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio); // Cover
      
      const w = img.width * ratio;
      const h = img.height * ratio;
      const x = (canvas.width - w) / 2;
      const y = (canvas.height - h) / 2;
      
      ctx.drawImage(img, 0, 0, img.width, img.height, x, y, w, h);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    let lastTime = 0;
    const fps = 24;
    const interval = 1000 / fps;

    const animate = (time: number) => {
      if (!lastTime) lastTime = time;
      const delta = time - lastTime;

      if (delta > interval) {
        render();
        frameIndexRef.current++;
        lastTime = time - (delta % interval);

        if (frameIndexRef.current >= FRAME_COUNT) {
          setTimeout(onComplete, 500);
          return;
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isLoaded, render, onComplete]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black">
      {!isLoaded && (
        <div className="flex flex-col items-center gap-4 z-20">
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40">
            Initializing Cinematic Flow {progress}%
          </span>
          {hasError && <span className="text-red-500/40 text-[8px] uppercase tracking-widest">Some assets missing - optimizing stream</span>}
        </div>
      )}
      <canvas ref={canvasRef} className="w-full h-full object-cover" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: isLoaded ? 0 : 1, y: 0 }}
           className="font-display font-black text-4xl md:text-6xl uppercase tracking-tighter"
        >
          <span className="text-[#FF8C42]">THE</span>
          <span className="text-white">VIRAL</span>
          <span className="text-[#00E5FF]">DUO</span>
        </motion.div>
      </div>

      {/* Manual Skip Button */}
      <button 
        onClick={onComplete}
        className="absolute bottom-10 right-10 z-30 font-mono text-[10px] text-white/20 hover:text-white uppercase tracking-[0.4em] transition-colors"
      >
        Skip Experience
      </button>
    </div>
  );
};

export default function Loader() {
  const [loading, setLoading] = useState(true);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.05,
            filter: "blur(40px)",
            transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
          }}
        >
          <HeroAnimationLoader onComplete={() => setLoading(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

