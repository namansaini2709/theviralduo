"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STATS = [
  { value: 10, suffix: "M+", label: "Views Generated" },
  { value: 5, suffix: "X", label: "Average Growth" },
  { value: 50, suffix: "+", label: "Brands Scaled" },
];

export default function Results() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Heading slide in from left
      gsap.from(".results-heading", {
        x: -100,
        opacity: 0,
        duration: 1.2,
        delay: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".results-heading",
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "restart reset restart reset",
        }
      });

      // Stats cards slide in from left staggered
      gsap.from(".stat-card", {
        x: -100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        delay: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".stats-container",
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "restart reset restart reset",
        }
      });

      countersRef.current.forEach((counter, i) => {
        if (!counter) return;
        const targetValue = STATS[i].value;
        
        gsap.to(counter, {
          innerHTML: targetValue,
          duration: 2.5,
          delay: 1.2,
          ease: "power3.out",
          snap: { innerHTML: 1 },
          scrollTrigger: {
            trigger: counter,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "restart reset restart reset",
          },
          onUpdate: function () {
            counter.innerHTML = Math.round(Number(this.targets()[0].innerHTML)).toString();
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="results" className="py-24 px-6 md:px-20 bg-white border-y-8 border-black z-10 relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="md:w-1/3 results-heading">
          <h2 className="font-display font-black text-5xl md:text-7xl uppercase leading-tight text-black">
            The <span className="text-accent marker-highlight">Proof</span> Is In The <span className="font-handwritten text-4xl lowercase">numbers</span>
          </h2>
        </div>
        
        <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-8 w-full stats-container">
          {STATS.map((stat, i) => (
            <div key={i} className="stat-card flex flex-col items-center justify-center p-8 border-4 border-black shadow-[10px_10px_0px_rgba(230,57,70,1)] rounded-2xl transform hover:-translate-y-2 transition-transform duration-300 bg-background">
              <div className="flex items-baseline font-display font-black text-6xl md:text-8xl text-black">
                <span ref={(el) => { countersRef.current[i] = el; }}>0</span>
                <span className="text-accent">{stat.suffix}</span>
              </div>
              <p className="mt-4 font-mono uppercase tracking-widest text-sm font-bold text-black/70 text-center">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
