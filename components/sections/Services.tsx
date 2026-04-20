"use client";

import { motion } from "framer-motion";

const services = [
  {
    title: "Short-Form Content",
    description:
      "Scroll-stopping reels, TikToks, and Shorts that capture attention in the first 0.5 seconds and never let go.",
    icon: "🎬",
  },
  {
    title: "Brand Strategy & Identity",
    description:
      "We craft cohesive brand narratives that resonate with your audience and set you apart from the noise.",
    icon: "🎨",
  },
  {
    title: "Growth & Account Management",
    description:
      "Data-driven growth strategies that turn followers into communities and impressions into impact.",
    icon: "📈",
  },
  {
    title: "Influencer Coordination",
    description:
      "We connect your brand with the right voices and orchestrate campaigns that drive real results.",
    icon: "🤝",
  },
  {
    title: "Paid Ads & Boosting",
    description:
      "Strategic paid amplification that multiplies your organic wins into scalable, measurable growth.",
    icon: "💰",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-16">What We Do</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-1000">
          {services.map((service, i) => (
            <ServiceCard key={i} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  return (
    <motion.div
      className="relative h-72 group cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      {/* Front */}
      <div className="absolute inset-0 rounded-xl border border-foreground/10 bg-background/50 backdrop-blur-sm p-6 flex flex-col items-center justify-center text-center backface-hidden group-hover:rotate-y-180">
        <span className="text-5xl mb-4">{service.icon}</span>
        <h3 className="font-display text-xl font-semibold">{service.title}</h3>
      </div>

      {/* Back */}
      <div className="absolute inset-0 rounded-xl border border-accent/50 bg-background/90 backdrop-blur-sm p-6 flex items-center justify-center text-center backface-hidden rotate-y-180 group-hover:rotate-y-0">
        <p className="font-body text-sm text-foreground/70 leading-relaxed">
          {service.description}
        </p>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .group:hover .group-hover\\:rotate-y-180 {
          transform: rotateY(0deg);
        }
      `}</style>
    </motion.div>
  );
}
