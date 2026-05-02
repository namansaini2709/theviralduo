"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { Play } from "lucide-react";

const POSTERS = [
  {
    id: 1,
    text: "All Eyes\nOn You",
    pos: "top-[10%] left-[5%] md:left-[15%]",
    rotate: "-rotate-6",
    color: "bg-white",
    textColor: "text-black",
    delay: 0.2
  },
  {
    id: 2,
    text: "Get Ready To\nGet Viral",
    pos: "bottom-[20%] left-[2%] md:left-[10%]",
    rotate: "rotate-12",
    color: "bg-accent",
    textColor: "text-white",
    delay: 0.4
  },
  {
    id: 3,
    text: "If It's Not Viral,\nIt's Not Us",
    pos: "top-[20%] right-[5%] md:right-[15%]",
    rotate: "rotate-6",
    color: "bg-white",
    textColor: "text-black",
    delay: 0.6
  }
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reveal main frame
    gsap.fromTo(
      ".hero-main-frame",
      { opacity: 0, scale: 0.9, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power3.out" }
    );

    // Reveal posters
    gsap.fromTo(
      ".hero-poster",
      { opacity: 0, scale: 0.5, y: 100, rotation: -20 },
      { opacity: 1, scale: 1, y: 0, rotation: (i, el) => parseFloat(el.dataset.rotation || "0"), duration: 1, stagger: 0.2, ease: "back.out(1.5)", delay: 0.5 }
    );

    // Floating animation for posters
    gsap.to(".hero-poster", {
      y: "+=20",
      rotation: "+=5",
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: { amount: 2, from: "random" }
    });
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;

    gsap.to(".hero-main-frame", {
      rotationY: x,
      rotationX: -y,
      duration: 1,
      ease: "power2.out"
    });
  };

  return (
    <section 
      ref={containerRef} 
      id="top"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 perspective-[2000px] z-10 bg-transparent"
      onMouseMove={handleMouseMove}
    >
      {/* Floating Posters */}
      {POSTERS.map((poster) => (
        <div
          key={poster.id}
          className={`hero-poster absolute ${poster.pos} z-0 shadow-2xl p-6 border-4 border-black origin-center`}
          data-rotation={poster.rotate.includes('-') ? -12 : 12}
          style={{ transform: `rotate(${poster.rotate.includes('-') ? -12 : 12}deg)` }}
        >
          {/* Post-it Note background */}
          <div className={`absolute inset-0 ${poster.color} -z-10`} />
          <h3 className={`font-handwritten text-3xl md:text-5xl font-bold leading-tight ${poster.textColor}`}>
            {poster.text.split('\n').map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h3>
          {/* Tape */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-8 bg-white/50 backdrop-blur-sm border border-black/10 rotate-3" />
        </div>
      ))}

      {/* Characters */}
      {/* Character 1: Sitting on left poster */}
      <div className="hero-poster absolute bottom-[35%] left-[10%] md:left-[18%] z-10 w-24 h-32 origin-bottom">
        <div className="absolute bottom-0 w-full h-1/2 bg-blue-500 rounded-t-3xl border-2 border-black" />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#ffcdb3] rounded-full border-2 border-black">
           {/* Eyes */}
           <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-black rounded-full" />
           <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-black rounded-full" />
        </div>
      </div>

      {/* Character 2: Peeking from right */}
      <div className="hero-poster absolute top-[40%] right-[2%] md:right-[8%] z-10 w-24 h-32 origin-bottom">
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#c28257] rounded-full border-2 border-black z-10">
           {/* Eyes */}
           <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-black rounded-full" />
           <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-black rounded-full" />
        </div>
        <div className="absolute top-16 left-0 w-full h-full bg-yellow-400 rounded-t-3xl border-2 border-black transform rotate-12" />
      </div>

      {/* Central Frame */}
      <div className="hero-main-frame relative z-20 w-[90vw] md:w-[70vw] max-w-5xl bg-white border-8 border-black shadow-[30px_30px_0px_rgba(0,0,0,1)] rounded-3xl p-10 md:p-20 transform-gpu">
        
        {/* Decorative marker scribble */}
        <div className="absolute -top-8 -right-8 text-accent font-handwritten text-6xl rotate-12 opacity-80 select-none pointer-events-none">
          ★
        </div>

        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <div className="space-y-2">
            <h1 className="font-display font-black text-6xl md:text-8xl tracking-tight text-black leading-none uppercase relative inline-block">
              THE VIRAL <span className="text-accent relative marker-highlight">DUO</span>
            </h1>
            <p className="font-handwritten text-3xl md:text-4xl text-black/70 -rotate-2 mt-4">
              A Marketing Agency
            </p>
          </div>

          <button className="mt-8 group relative inline-flex items-center justify-center gap-3 px-8 py-4 font-bold text-black uppercase tracking-widest bg-transparent border-4 border-black rounded-full overflow-hidden hover:text-white transition-colors duration-300">
            <span className="absolute inset-0 w-full h-full bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center gap-3">
              <Play fill="currentColor" size={20} />
              Watch Showreel
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
