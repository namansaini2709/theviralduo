"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const ParticleLoader = dynamic(() => import("./ParticleLoader"), {
  ssr: false,
  loading: () => <TextLoader />,
});

function TextLoader() {
  return (
    <motion.div
      className="fixed inset-0 z-[9990] bg-background flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        className="font-display text-5xl md:text-7xl font-bold text-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        VIRAL<span className="text-accent">DUO</span>
      </motion.span>
    </motion.div>
  );
}

export default function Loader() {
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // For development: clear visited flag to see loader every time
    // sessionStorage.removeItem("viral-duo-visited"); 

    const hasVisited = sessionStorage.getItem("viral-duo-visited");
    // If you want to see it every time, comment the next line
    // if (hasVisited) { setLoading(false); return; }

    setIsMobile(window.matchMedia("(pointer: coarse)").matches);

    sessionStorage.setItem("viral-duo-visited", "true");

    // Increased duration for a more cinematic feel
    const duration = isMobile ? 2500 : 7000;
    const timer = setTimeout(() => setLoading(false), duration);
    return () => clearTimeout(timer);
  }, [isMobile]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[9990] bg-background"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.1,
            filter: "blur(20px)",
            transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
          }}
        >
          {isMobile ? <TextLoader /> : <ParticleLoader />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
