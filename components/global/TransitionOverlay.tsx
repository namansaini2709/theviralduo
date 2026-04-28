"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface TransitionOverlayProps {
  isTransitioning: boolean;
}

export default function TransitionOverlay({ isTransitioning }: TransitionOverlayProps) {

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.8,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
          }}
          className="fixed inset-0 z-[999] flex items-center justify-center pointer-events-none"
        >
          {/* Main Transition Card */}
          <motion.div 
            className="w-[90vw] h-[90vh] rounded-[3.5rem] bg-[#050505] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden"
            initial={{ borderRadius: "100px" }}
            animate={{ borderRadius: "56px" }}
            exit={{ borderRadius: "100px" }}
          >
            {/* Inner Glow/Aura */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
            
            {/* Logo in transition */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="relative w-40 h-40 md:w-64 md:h-64 rounded-full overflow-hidden border border-white/20"
            >
              <Image 
                src="/logo-v2.png" 
                alt="The Viral Duo" 
                fill 
                className="object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Background Blur Overlay */}
          <motion.div 
            className="absolute inset-0 -z-10 bg-black/60 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
