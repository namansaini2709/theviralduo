"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    brand: "",
    need: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (res.ok) {
        setStatus("success");
        setFormState({ name: "", brand: "", need: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const socials = [
    { name: "Instagram", icon: "📸", href: "#" },
    { name: "LinkedIn", icon: "💼", href: "#" },
    { name: "TikTok", icon: "🎵", href: "#" },
  ];

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-16">Let&apos;s Create</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {status === "success" ? (
              <div className="h-full flex items-center justify-center bg-accent/10 rounded-xl p-8">
                <div className="text-center">
                  <div className="text-5xl mb-4">🎬</div>
                  <h3 className="font-display text-2xl font-bold mb-2">That&apos;s a wrap!</h3>
                  <p className="font-body text-foreground/70">
                    We&apos;ll be in touch within 24 hours. Get ready to go viral.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-body text-sm text-foreground/60 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-3 font-body text-foreground focus:outline-none focus:border-accent transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block font-body text-sm text-foreground/60 mb-2">Brand / Company</label>
                  <input
                    type="text"
                    required
                    value={formState.brand}
                    onChange={(e) => setFormState({ ...formState, brand: e.target.value })}
                    className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-3 font-body text-foreground focus:outline-none focus:border-accent transition-colors"
                    placeholder="Your brand or company"
                  />
                </div>

                <div>
                  <label className="block font-body text-sm text-foreground/60 mb-2">What do you need?</label>
                  <select
                    required
                    value={formState.need}
                    onChange={(e) => setFormState({ ...formState, need: e.target.value })}
                    className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-3 font-body text-foreground focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="">Select a service</option>
                    <option value="content">Content Creation</option>
                    <option value="strategy">Brand Strategy</option>
                    <option value="growth">Growth Management</option>
                    <option value="ads">Paid Advertising</option>
                    <option value="other">Something else</option>
                  </select>
                </div>

                <div>
                  <label className="block font-body text-sm text-foreground/60 mb-2">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-3 font-body text-foreground focus:outline-none focus:border-accent transition-colors resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full py-4 bg-accent text-background font-display font-semibold rounded-full hover:bg-accent-warm transition-colors disabled:opacity-50"
                >
                  {status === "submitting" ? "Sending..." : "Let's Talk"}
                </button>

                {status === "error" && (
                  <p className="text-red-500 text-sm text-center">Something went wrong. Try again.</p>
                )}
              </form>
            )}
          </motion.div>

          {/* Cal.com embed placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-background/30 rounded-xl p-8 border border-foreground/10"
          >
            <h3 className="font-display text-xl font-semibold mb-4">Book a Discovery Call</h3>
            <p className="font-body text-foreground/60 mb-6">
              Prefer to chat live? Schedule a 30-minute call to discuss your project.
            </p>
            {/* Placeholder for Cal.com embed */}
            <div className="aspect-[4/3] bg-foreground/5 rounded-lg flex items-center justify-center border border-dashed border-foreground/20">
              <div className="text-center">
                <div className="text-4xl mb-2">📅</div>
                <p className="font-body text-sm text-foreground/40">Calendar coming soon</p>
                <p className="font-body text-xs text-foreground/30 mt-1">
                  In the meantime, use the form
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Social links */}
        <div className="flex justify-center gap-8 mt-16">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              className="flex items-center gap-2 text-foreground/60 hover:text-accent transition-colors group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{social.icon}</span>
              <span className="font-body text-sm">{social.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
