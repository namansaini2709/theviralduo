"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useDynamicData } from "@/lib/DynamicDataContext";
import { useState, useEffect, useRef } from "react";

const BRANDS = [
  { name: "FOF Fitness", logo: "/brands/FOF Fitnesa logo.jpeg" },
  { name: "Global Holidays", logo: "/brands/Global Holidays.PNG" },
  { name: "Make your trip possible", logo: "/brands/Make your trip possible.jpg" },
  { name: "Sharma ji ke bhature", logo: "/brands/Sharma ji ke bhature.JPG" },
  { name: "Shri radhey Krishna jewellers", logo: "/brands/Shri radhey Krishna  jewellers.JPG" },
  { name: "VDMC", logo: "/brands/Vdmc logo.JPG" },
  { name: "Anytime Fitness", logo: "/brands/anytime. fitness logos.JPG" },
  { name: "Career Launcher", logo: "/brands/carrer launcher.JPG" },
  { name: "MS Classes", logo: "/brands/ms classes.JPG" },
  { name: "Saral Gym", logo: "/brands/saral gym logo.jpg" },
];

export default function Brands() {
  const { data } = useDynamicData();
  const brandsList = (data?.brands && data.brands.length > 0) ? data.brands : BRANDS;
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  
  // Chunk brands into pages of 10
  const pages = [];
  for (let i = 0; i < brandsList.length; i += itemsPerPage) {
    pages.push(brandsList.slice(i, i + itemsPerPage));
  }

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (pages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % pages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [pages.length]);

  // Manual navigation handler
  const paginate = (direction: number) => {
    setCurrentPage((prev) => (prev + direction + pages.length) % pages.length);
  };

  return (
    <section ref={containerRef} className="py-20 bg-brand-soft overflow-hidden relative border-y border-brand-border/30 min-h-[600px] flex flex-col justify-center">
      {/* Subtle background text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">
        <span className="text-[20vw] font-serif font-black text-black/[0.02] uppercase whitespace-nowrap">
          TRUSTED BY
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-12 text-center relative z-10">
        <h2 className="brands-heading font-serif font-black text-4xl md:text-6xl text-brand-deep uppercase tracking-tight">
          BRANDS <span className="text-orange-gradient italic px-4">TRUST</span> US
        </h2>
        <div className="relative inline-block mt-4 group">
          <p className="brands-subheading font-mono uppercase tracking-widest text-sm md:text-base font-bold text-black/60">
            Your brand can be next here.
          </p>
          <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-orange/40" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full overflow-hidden">
        <div className="relative min-h-[450px] md:min-h-[500px] cursor-grab active:cursor-grabbing">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentPage}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = offset.x;
                if (swipe < -100) {
                  paginate(1);
                } else if (swipe > 100) {
                  paginate(-1);
                }
              }}
              className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6"
            >
              {pages[currentPage]?.map((brand, i) => (
                <motion.div
                  key={brand.id || i}
                  whileHover={{ 
                    y: -10,
                    scale: 1.02,
                    backgroundColor: "rgba(255, 255, 255, 0.6)"
                  }}
                  className="group relative flex flex-col items-center justify-center p-6 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2.5rem] aspect-square transition-all duration-300 shadow-lg hover:shadow-2xl hover:border-brand-sky/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-sky/5 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative w-full h-full max-h-[80px] md:max-h-[100px] flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110">
                    <Image 
                      src={brand.logo}
                      alt={brand.name || "Brand"}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  
                  <div className="mt-4 w-full text-center h-6 flex items-center justify-center">
                    <p 
                      className="font-mono uppercase font-bold tracking-tighter text-brand-deep/80 transition-all duration-300 leading-none px-1"
                      style={{ 
                        fontSize: (brand.name?.length || 0) > 20 ? '8px' : 
                                  (brand.name?.length || 0) > 15 ? '10px' : 
                                  (brand.name?.length || 0) > 10 ? '11px' : '12px',
                        wordBreak: 'break-word',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {brand.name}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Only show CTA on the last page if there's room, or add it to the last page */}
              {currentPage === pages.length - 1 && pages[currentPage].length < 10 && (
                 <motion.div
                    className="group relative flex flex-col items-center justify-center p-6 bg-brand-deep text-white rounded-[2.5rem] aspect-square shadow-xl cursor-pointer overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-orange to-brand-pink opacity-0 group-hover:opacity-20 transition-opacity" />
                    <span className="text-4xl mb-2">✦</span>
                    <p className="font-mono text-[10px] uppercase font-black tracking-tighter text-center">
                      Your Brand <br /> Next
                    </p>
                    <div className="mt-4 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-brand-deep transition-all">
                      <span className="text-xs">→</span>
                    </div>
                  </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Indicators */}
        {pages.length > 1 && (
          <div className="flex justify-center gap-3 mt-12">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  currentPage === i ? "w-8 bg-brand-deep" : "w-2 bg-brand-deep/20"
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
