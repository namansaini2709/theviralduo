"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    brand: "",
    need: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [notifyMe, setNotifyMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      // Mocking submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus("success");
      setFormState({ name: "", brand: "", need: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 relative">
          <span className="text-black/40 text-sm font-body tracking-[0.2em] uppercase mb-2 block">
            Let&apos;s Create
          </span>
          <h2 className="font-serif text-5xl md:text-6xl font-medium text-black mb-6 leading-tight">
            Let&apos;s Create <br />
            <span className="text-[#E63946]">Something Viral.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block font-body text-sm text-black/60">Name</label>
                <div className="relative group">
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3.5 font-body text-black focus:outline-none focus:border-red-500/50 transition-all duration-300 placeholder:text-black/30 focus:shadow-[0_0_15px_rgba(230,57,70,0.2)]"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-body text-sm text-black/60">Brand / Company</label>
                <input
                  type="text"
                  required
                  value={formState.brand}
                  onChange={(e) => setFormState({ ...formState, brand: e.target.value })}
                  className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3.5 font-body text-black focus:outline-none focus:border-red-500/50 transition-all duration-300 placeholder:text-black/30 focus:shadow-[0_0_15px_rgba(230,57,70,0.2)]"
                  placeholder="Your brand or company"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-body text-sm text-black/60">What do you need?</label>
                <div className="relative">
                  <select
                    required
                    value={formState.need}
                    onChange={(e) => setFormState({ ...formState, need: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3.5 font-body text-black focus:outline-none focus:border-red-500/50 transition-all duration-300 appearance-none cursor-pointer focus:shadow-[0_0_15px_rgba(230,57,70,0.2)]"
                  >
                    <option value="" className="bg-white">Select a service</option>
                    <option value="content" className="bg-white">Content Creation</option>
                    <option value="strategy" className="bg-white">Brand Strategy</option>
                    <option value="growth" className="bg-white">Growth Management</option>
                    <option value="ads" className="bg-white">Paid Advertising</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path d="M1 1L6 6L11 1" stroke="black" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-body text-sm text-black/60">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3.5 font-body text-black focus:outline-none focus:border-red-500/50 transition-all duration-300 resize-none placeholder:text-black/30 focus:shadow-[0_0_15px_rgba(230,57,70,0.2)]"
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full py-4 bg-gradient-to-r from-[#E63946] to-[#D62828] text-white font-display font-semibold rounded-full hover:shadow-[0_0_30px_rgba(230,57,70,0.4)] transition-all duration-500 disabled:opacity-50 relative overflow-hidden group"
              >
                <span className="relative z-10 text-lg">
                  {status === "submitting" ? "Sending..." : "Let's Talk"}
                </span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </form>
          </motion.div>

          {/* Booking Card Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-container rounded-3xl p-6 md:p-8 border border-black/10 flex flex-col h-full bg-white"
          >
            <h3 className="font-serif text-3xl font-medium text-black mb-3">Book a Discovery Call</h3>
            <p className="font-body text-black/60 text-lg max-w-md leading-relaxed">
              Got a vision? We&apos;ve got the tools to make it a reality.
            </p>
            
            <div className="flex-grow flex flex-col items-center justify-center space-y-6 bg-black/[0.02] rounded-2xl p-6 border border-dashed border-black/10 relative overflow-hidden">
              {/* Soft Glow behind icon */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-500/10 blur-3xl rounded-full" />
              
              <div className="relative w-32 h-32 drop-shadow-[0_0_20px_rgba(230,57,70,0.2)]">
                <Image 
                  src="/calendar-final.png" 
                  alt="Calendar" 
                  width={128}
                  height={128}
                  className="w-full h-full object-contain mix-blend-multiply invert"
                />
              </div>
              
              <div className="text-center relative z-10">
                <p className="font-serif text-black/80 text-lg mb-0.5">Calendar coming soon</p>
                <p className="font-body text-black/40 text-xs">In the meantime, use the form</p>
              </div>

              <button className="w-full max-w-[220px] py-4 bg-gradient-to-b from-black/5 to-black/10 hover:from-black/10 hover:to-black/5 border border-black/10 rounded-full text-black font-body text-base font-medium transition-all duration-300 backdrop-blur-md shadow-sm relative z-10">
                Join Waitlist
              </button>

              <div className="flex items-center gap-3 pt-1 relative z-10">
                <span className="text-black/40 text-xs font-body">Notify Me</span>
                <button 
                  onClick={() => setNotifyMe(!notifyMe)}
                  className={`w-10 h-5 rounded-full transition-colors duration-300 relative ${notifyMe ? 'bg-accent' : 'bg-black/10'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${notifyMe ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
