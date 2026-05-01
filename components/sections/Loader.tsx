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
  
  // Dynamic settings based on device capability
  const [settings, setSettings] = useState({
    frameCount: FRAME_COUNT,
    step: 1,
    resolutionScale: 1
  });

  // Determine device capability once on mount
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    // Check for low memory if browser supports it
    const isLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
    
    if (isMobile || isLowMemory) {
      setSettings({
        frameCount: 40, // Use half the frames
        step: 2,        // Skip every other frame
        resolutionScale: 0.7 // Lower canvas internal resolution
      });
    }
  }, []);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    let errorCount = 0;
    const images: HTMLImageElement[] = [];

    const handleLoad = () => {
      loadedCount++;
      setProgress(Math.floor(((loadedCount + errorCount) / settings.frameCount) * 100));
      if (loadedCount + errorCount === settings.frameCount) {
        setIsLoaded(true);
      }
    };

    const handleError = () => {
      errorCount++;
      setHasError(true);
      setProgress(Math.floor(((loadedCount + errorCount) / settings.frameCount) * 100));
      if (loadedCount + errorCount === settings.frameCount) {
        setIsLoaded(true);
      }
    };

    // Load optimized number of frames
    for (let i = 0; i < settings.frameCount; i++) {
      const frameNum = i * settings.step;
      const img = new Image();
      img.src = `/assets/loading-animation/Animation_${frameNum.toString().padStart(3, '0')}.jpg`;
      img.onload = handleLoad;
      img.onerror = handleError;
      images.push(img);
    }
    imagesRef.current = images;

    // Safety timeout: 5 seconds max loading time
    const timeout = setTimeout(() => {
      if (!isLoaded) {
        setIsLoaded(true);
      }
    }, 5000);

    return () => {
      clearTimeout(timeout);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [settings, isLoaded]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false }); // Optimization: no alpha channel
    if (!canvas || !ctx) return;

    const img = imagesRef.current[frameIndexRef.current];
    if (img && img.complete) {
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      
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
      // Use lower resolution on mobile to save GPU memory
      canvas.width = window.innerWidth * settings.resolutionScale;
      canvas.height = window.innerHeight * settings.resolutionScale;
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

        if (frameIndexRef.current >= settings.frameCount) {
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
  }, [isLoaded, render, onComplete, settings]);

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
            {settings.step > 1 ? "Optimizing Stream..." : "Initializing Cinematic Flow..."} {progress}%
          </span>
          {hasError && <span className="text-red-500/40 text-[8px] uppercase tracking-widest">Adjusting data flow</span>}
        </div>
      )}
      <canvas ref={canvasRef} className="w-full h-full object-cover" style={{ imageRendering: 'auto' }} />
      
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

