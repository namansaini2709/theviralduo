"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#0a2a4d] text-white overflow-hidden border-t border-white/5 pt-24 pb-12 z-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(77,184,229,0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-12">
          
          {/* Main CTA */}
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-4xl md:text-8xl font-black italic tracking-tighter leading-[0.95] md:leading-[0.9] mb-6"
            >
              READY TO GO <span className="text-gradient inline-block px-2 md:px-4">VIRAL?</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-body text-white/60 font-medium text-base md:text-xl max-w-md"
            >
              Stop posting content. Start engineering attention. Drop us a line and let&apos;s build something massive.
            </motion.p>
          </div>

          {/* Contact Button */}
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <a 
              href="mailto:hello@viralduo.com"
              className="group flex flex-col items-center gap-2 transition-transform duration-300 hover:scale-105"
            >
              <Image 
                src="https://cdn-icons-gif.flaticon.com/8717/8717939.gif" 
                alt="Email Icon" 
                width={112}
                height={112}
                className="w-20 h-20 md:w-28 md:h-28 transition-all duration-300"
                unoptimized
              />
              <span className="font-serif font-bold text-xs tracking-[0.4em] text-white/40 group-hover:text-white transition-colors duration-300">EMAIL US</span>
            </a>
          </motion.div>

        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 border-t border-white/10 pt-12">
          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Navigation</h4>
            <button onClick={scrollToTop} className="text-left text-white/70 hover:text-white font-body text-sm transition-colors font-medium">Home</button>
            <a href="#about" className="text-white/70 hover:text-white font-body text-sm transition-colors font-medium">About Us</a>
            <a href="#services" className="text-white/70 hover:text-white font-body text-sm transition-colors font-medium">Services</a>
            <a href="#movie-reel" className="text-white/70 hover:text-white font-body text-sm transition-colors font-medium">Work</a>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Socials</h4>
            <a 
              href="https://www.instagram.com/theviralduo" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white font-body text-sm transition-colors flex items-center gap-2 group font-medium"
            >
              Instagram <ArrowUpRight size={14} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
            </a>
            <a href="#" className="text-white/70 hover:text-white font-body text-sm transition-colors flex items-center gap-2 group font-medium">
              Twitter <ArrowUpRight size={14} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
            </a>
            <a href="#" className="text-white/70 hover:text-white font-body text-sm transition-colors flex items-center gap-2 group font-medium">
              LinkedIn <ArrowUpRight size={14} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Location</h4>
            <p className="text-white/70 font-body text-sm font-medium">
              New Delhi, India<br />
              Operating in Delhi
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Contact Us</h4>
            <div className="flex flex-col gap-2">
              <p className="text-white/70 font-body text-sm font-medium">
                <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold block mb-0.5">Shubham</span>
                +91 77019 18603
              </p>
              <p className="text-white/70 font-body text-sm font-medium">
                <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold block mb-0.5">Pushkar</span>
                +91 92051 97949
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5">
          <p className="font-serif font-black text-2xl tracking-tighter text-white">
            VIRAL<span className="text-gradient">DUO</span>
          </p>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-center font-bold">
              © {currentYear} All Rights Reserved
            </p>
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest hidden md:block">
              |
            </p>
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-center font-bold">
              Design by Viral Duo
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
