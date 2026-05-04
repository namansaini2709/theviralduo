"use client";

import React, { type CSSProperties } from "react";
import Image from "next/image";
import { useDynamicData } from "@/lib/DynamicDataContext";
import { DEFAULT_FEEDBACK } from "@/lib/constants";

const collageStyle = {
  "--media-collage-bg": "transparent",
  "--media-collage-radius": "42px",
  "--media-collage-media-radius": "42px",
  "--media-collage-shadow": "0 40px 100px rgba(0, 0, 0, 0.6)",
} as CSSProperties;

export default function Polaroids() {
  const { data } = useDynamicData();
  const finalFeedback = data?.feedback || DEFAULT_FEEDBACK;

  return (
    <section id="testimonials" className="relative py-24 bg-transparent z-10" style={collageStyle}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-display font-black uppercase text-brand-deep">
            Client <span className="text-orange-gradient">Love</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {finalFeedback.map((item, idx) => (
            <div key={item.id || idx} className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden group border border-white/10 shadow-2xl">
              <Image 
                src={item.image} 
                alt={item.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-8 flex flex-col justify-end">
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: Number(item.stars) }).map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-xl font-display italic text-white leading-relaxed">"{item.quote}"</p>
                  <div>
                    <h4 className="text-white font-bold text-lg">{item.title}</h4>
                    <p className="text-white/60 text-sm uppercase tracking-widest">{item.points}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
