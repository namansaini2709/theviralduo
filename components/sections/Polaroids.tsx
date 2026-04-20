"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

const categories = [
  {
    title: "Brands",
    testimonials: [
      { id: 101, brand: "Luxe Cosmetics", quote: "From 2K to 150K followers in 6 months.", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400" },
      { id: 102, brand: "Urban Threads", quote: "Our launch video hit 4.2M views organically.", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400" },
      { id: 103, brand: "Mindful Coffee", quote: "Flawless execution, absolute growth.", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=400" },
    ]
  },
  {
    title: "Creators",
    testimonials: [
      { id: 201, brand: "Alex Rivera", quote: "The script mechanics are literally cheating.", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400" },
      { id: 202, brand: "Samantha J.", quote: "My retention went from 20% to 65%.", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400" },
      { id: 203, brand: "Tech Guru", quote: "Viral Duo understands the algorithm.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400" },
    ]
  },
  {
    title: "Results",
    testimonials: [
      { id: 301, brand: "FitFlow", quote: "3.1M views in 48 hours. Unreal.", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400" },
      { id: 302, brand: "Bloom", quote: "Our sales doubled after the first reel.", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400" },
      { id: 303, brand: "Rust Rooster", quote: "The cinematic quality is unmatched.", image: "https://images.unsplash.com/photo-1514525253361-bee8718a300a?q=80&w=400" },
    ]
  }
];

export default function Polaroids() {
  return (
    <section id="testimonials" className="py-32 px-6 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="font-display text-5xl md:text-8xl font-bold tracking-tighter mb-4">
            THE <span className="text-accent italic">FEEDBACK</span>
          </h2>
          <div className="flex items-center justify-center gap-4">
             <div className="w-12 h-[1px] bg-foreground/20" />
             <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-foreground/40 text-center">Drag cards to explore proof of work</p>
             <div className="w-12 h-[1px] bg-foreground/20" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-20 md:gap-12 lg:gap-24">
          {categories.map((cat, i) => (
            <div key={i} className="flex flex-col items-center">
               <h3 className="font-display text-xs font-bold uppercase tracking-[0.4em] text-foreground/20 mb-12 border-b border-foreground/5 pb-2 w-full text-center">
                 {cat.title}
               </h3>
               <div className="relative w-full max-w-[320px] h-[450px]">
                 <CardStack items={cat.testimonials} />
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CardStack({ items }: { items: any[] }) {
  const [cards, setCards] = useState(items);

  const removeCard = (id: number) => {
    setCards((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (filtered.length === 0) return items; // Reset for loop
      return filtered;
    });
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AnimatePresence>
        {cards.map((t, index) => (
          <Card 
            key={t.id} 
            testimonial={t} 
            index={index} 
            total={cards.length}
            onRemove={() => removeCard(t.id)} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Card({ testimonial, index, total, onRemove }: { 
  testimonial: any, 
  index: number, 
  total: number,
  onRemove: () => void 
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  
  const isFront = index === total - 1;
  const depth = total - 1 - index;
  
  const scale = isFront ? 1 : 1 - depth * 0.05;
  const yOffset = isFront ? 0 : depth * -12;
  const blur = isFront ? 0 : depth * 1.5;

  return (
    <motion.div
      style={{
        x,
        rotate,
        opacity: isFront ? opacity : 1,
        scale,
        y: yOffset,
        filter: `blur(${blur}px)`,
        zIndex: index,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => Math.abs(info.offset.x) > 100 && onRemove()}
      className="absolute w-full h-full cursor-grab active:cursor-grabbing"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale, opacity: 1, y: yOffset }}
      exit={{ x: x.get() > 0 ? 400 : -400, opacity: 0, rotate: x.get() > 0 ? 30 : -30, transition: { duration: 0.4 } }}
    >
      <div className="w-full h-full bg-white p-3 pb-12 shadow-xl rounded-sm border border-black/5 flex flex-col">
        <div className="flex-1 bg-[#eee] overflow-hidden rounded-sm relative">
           <img src={testimonial.image} alt={testimonial.brand} className="w-full h-full object-cover grayscale" />
           <div className="absolute inset-0 bg-black/5" />
        </div>
        <div className="mt-4 text-center">
           <h4 className="font-handwritten text-xl text-black/80">{testimonial.brand}</h4>
           {isFront && (
             <motion.p 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               className="font-body text-[10px] text-black/40 italic mt-1 line-clamp-2 px-2"
             >
               "{testimonial.quote}"
             </motion.p>
           )}
        </div>
      </div>
    </motion.div>
  );
}
