"use client";

import { useEffect, useState } from "react";

export default function Navigation() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after loader completes
    const timer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToReel = () => {
    document.getElementById("movie-reel")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[9990] px-6 py-6 flex justify-between items-center transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="font-display font-bold text-xl tracking-tight">
        VIRAL<span className="text-accent">DUO</span>
      </div>
      <button
        onClick={scrollToReel}
        className="px-4 py-2 border border-foreground/20 rounded-full text-sm font-body hover:border-accent hover:text-accent transition-colors duration-300"
      >
        See Our Work
      </button>
    </nav>
  );
}
