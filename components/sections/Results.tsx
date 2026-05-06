"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDynamicData } from "@/lib/DynamicDataContext";

const STATS = [
  { value: 1, suffix: "M+", label: "Views Generated" },
  { value: 5, suffix: "X", label: "Average Growth" },
  { value: 15, suffix: "+", label: "Brands Scaled" },
];

export default function Results() {
  const { data } = useDynamicData();
  const resultsList = (data?.results && data.results.length > 0) ? data.results : STATS;
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
        if (!counter || !resultsList[i]) return;
        const targetValue = resultsList[i].value;

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
    <section ref={sectionRef} id="results" className="py-20 md:py-24 px-6 md:px-20 bg-brand-soft border-y border-brand-border z-10 relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-32">
        <div className="w-full lg:w-[420px] flex-shrink-0 results-heading text-center lg:text-left">
          <h2 className="font-serif font-black text-4xl md:text-5xl lg:text-7xl uppercase leading-[0.9] text-brand-deep">
            The <span className="text-gradient inline-block py-2">Proof</span> <br className="hidden md:block" /> Is In The <br /> 
            <span className="font-handwritten text-4xl md:text-5xl lg:text-7xl lowercase text-brand-sky inline-block mt-2 lg:mt-0 lg:ml-20">numbers</span>
          </h2>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 stats-container w-full">
          {resultsList.map((stat, i) => (
            <div key={stat.id || i} className="stat-card flex flex-col items-center justify-center p-6 md:p-8 card-brand rounded-3xl transform hover:-translate-y-2 transition-transform duration-300 min-h-[180px] md:min-h-[220px]">
              <div className="flex items-baseline font-serif font-black text-4xl md:text-5xl lg:text-7xl text-brand-deep">
                <span ref={(el) => { countersRef.current[i] = el; }}>0</span>
                <span className="text-gradient">{stat.suffix}</span>
              </div>
              <p className="mt-2 md:mt-4 font-mono uppercase tracking-widest text-[9px] md:text-[10px] font-bold text-black/70 text-center">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
