"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const pillars = [
  {
    title: "Strategic",
    copy: "We find the cultural signals, creator angles, and scroll patterns your audience already wants.",
    image: "/assets/services/what-we-are.png",
    video: "/assets/videos/stratgic 2.mp4",
    accent: "from-cyan-500/22 via-cyan-300/10 to-cyan-100/[0.03]",
    tint: "bg-cyan-400/[0.18] group-hover:bg-cyan-300/[0.34]",
    border: "border-cyan-200/[0.22] group-hover:border-cyan-200/[0.48]",
    shadow: "shadow-cyan-500/10 group-hover:shadow-cyan-400/20",
  },
  {
    title: "Productive",
    copy: "We turn ideas into sharp hooks, repeatable formats, and fast-moving edits built for retention.",
    image: "/assets/services/clapboard.png",
    accent: "from-red-500/22 via-orange-300/10 to-red-100/[0.03]",
    tint: "bg-red-500/[0.18] group-hover:bg-red-400/[0.34]",
    video: "/assets/videos/productive_poster.png",
    border: "border-red-200/[0.22] group-hover:border-red-200/[0.48]",
    shadow: "shadow-red-500/10 group-hover:shadow-red-400/25",
  },
  {
    title: "Creative",
    copy: "We read the data, double down on winners, and keep the content machine compounding.",
    image: "/assets/services/charts.png",
    video: "/assets/videos/creative.mp4",
    accent: "from-amber-400/22 via-lime-300/10 to-yellow-100/[0.03]",
    tint: "bg-amber-300/[0.18] group-hover:bg-amber-300/[0.34]",
    border: "border-amber-100/[0.22] group-hover:border-amber-100/[0.48]",
    shadow: "shadow-amber-400/10 group-hover:shadow-amber-300/20",
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Tilt from opposite direction logic (Tilting AWAY from mouse)
    const rX = (centerY - y) / 12;
    const rY = (x - centerX) / 12;

    gsap.to(card, {
      rotateX: rX,
      rotateY: rY,
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto",
    });

    const glare = card.querySelector(".card-glare") as HTMLDivElement;
    if (glare) {
      gsap.to(glare, {
        opacity: 0.5,
        x: x - rect.width / 2,
        y: y - rect.height / 2,
        duration: 0.4,
      });
    }
  };

  const handleMouseLeave = (index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 1,
      ease: "power4.out",
      overwrite: "auto",
    });
    
    const glare = card.querySelector(".card-glare") as HTMLDivElement;
    if (glare) {
      gsap.to(glare, {
        opacity: 0,
        duration: 0.4,
      });
    }
  };

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.play().catch((err) => {
          console.warn("Autoplay prevented:", err);
        });
      }
    });
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 768px)",
          mobile: "(max-width: 767px)",
        },
        ({ conditions }) => {
          const isDesktop = Boolean(conditions?.desktop);
          const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
          const desktopRotations = [-3.5, 2.5, 3.5];
          const mobileRotations = [-2, 1.5, 2];

          gsap.set(cards, {
            transformPerspective: 1200,
            transformOrigin: "50% 80%",
            willChange: "transform, opacity",
          });

          const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=240%",
              scrub: 1.15,
              pin: true,
              anticipatePin: 1,
            },
          });

          tl.fromTo(
            cards,
              {
                autoAlpha: 0,
                y: isDesktop ? 260 : 180,
                scale: 0.82,
                rotateX: 22,
                rotateZ: (index) => (isDesktop ? desktopRotations[index] * 1.8 : mobileRotations[index]),
              },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                rotateZ: (index) => (isDesktop ? desktopRotations[index] : mobileRotations[index]),
                duration: 1,
                stagger: 0.12,
              },
              0.42
            )
            .to(
              cards,
              {
                y: (index) => (isDesktop ? [18, -34, 18][index] : [0, -14, 0][index]),
                rotateY: (index) => (isDesktop ? [-8, 0, 8][index] : 0),
                rotateZ: (index) => (isDesktop ? [-1.25, 1.5, 1.25][index] : mobileRotations[index]),
                scale: (index) => (index === 1 ? 1.035 : 0.96),
                duration: 1.25,
                ease: "none",
              },
              1.25
            )
            .to(
              cards,
              {
                y: isDesktop ? -150 : -90,
                autoAlpha: 0,
                scale: 0.92,
                duration: 0.7,
                stagger: 0.06,
                ease: "power2.in",
              },
              2.72
            );
        }
      );

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen overflow-hidden px-5 py-16 text-white"
    >
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#080808] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#080808] to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-6xl flex-col items-center justify-center">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="mb-10 text-center md:mb-14 flex flex-col items-center"
        >
          <div className="flex flex-wrap justify-center gap-x-[0.3em] mb-4">
            {"WHO WE ARE".split(" ").map((word, wordIdx) => (
              <span key={wordIdx} className="inline-block whitespace-nowrap">
                {word.split("").map((char, charIdx) => (
                  <motion.span
                    key={charIdx}
                    variants={{
                      hidden: { opacity: 0, y: 40, rotateX: 45, filter: "blur(10px)" },
                      visible: { 
                        opacity: 1, 
                        y: 0, 
                        rotateX: 0, 
                        filter: "blur(0px)",
                        transition: {
                          duration: 0.8,
                          ease: [0.22, 1, 0.36, 1],
                          delay: wordIdx * 0.2 + charIdx * 0.03
                        }
                      }
                    }}
                    className="inline-block font-serif text-[12vw] font-black italic leading-[0.74] tracking-normal text-[#E63946] drop-shadow-[0_0_32px_rgba(230,57,70,0.28)] md:text-[7vw] lg:text-[5.5rem] uppercase"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.62, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mx-auto mt-4 max-w-2xl font-body text-sm leading-7 text-white md:text-base"
          >
            We don&apos;t post content. We engineer virality through strategy,
            production, and relentless creative iteration.
          </motion.p>
        </motion.div>

        <div className="grid w-full max-w-6xl grid-cols-1 gap-5 [perspective:1200px] md:grid-cols-3 md:gap-8">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.title}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => handleMouseLeave(index)}
              className={`group relative min-h-[340px] overflow-hidden rounded-2xl border bg-gradient-to-br ${pillar.accent} ${pillar.border} shadow-[0_30px_90px_rgba(0,0,0,0.38)] ${pillar.shadow} backdrop-blur-[7px] transition-[border-color,box-shadow,background-color] duration-500 md:min-h-[440px] [transform-style:preserve-3d]`}
            >
              <div className="card-glare pointer-events-none absolute inset-0 z-50 opacity-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0%,transparent_80%)] blur-2xl" />
              <div className={`absolute inset-0 ${pillar.tint} opacity-80 mix-blend-screen transition-colors duration-500`} />
              <div className="absolute inset-0 bg-black/8" />
              <div className="absolute inset-0 opacity-35 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.22),transparent_52%)]" />

              <div className="relative z-10 flex h-full flex-col">
                <div className="relative flex aspect-[1.6] items-center justify-center overflow-hidden bg-black/8 transition-colors duration-500 group-hover:bg-white/[0.035]">
                  {pillar.video ? (
                    pillar.video.match(/\.(mp4|webm|ogg)$/) ? (
                      <video
                        ref={(el) => {
                          videoRefs.current[index] = el;
                        }}
                        poster={pillar.image}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="absolute inset-0 h-full w-full object-cover transition-all duration-700"
                        style={{ objectFit: 'cover' }}
                      >
                        <source src={pillar.video} type="video/mp4" />
                      </video>
                    ) : (
                      <motion.div
                        className="absolute inset-0 h-full w-full overflow-hidden"
                        initial={{ scale: 1 }}
                      >
                        <Image
                          src={pillar.video}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    )
                  ) : pillar.image ? (
                    <Image
                      src={pillar.image}
                      alt=""
                      width={420}
                      height={260}
                      className="h-full w-full object-contain p-6 transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : null}
                </div>

                <div className="mt-auto p-6 md:p-8">
                  <h3 className="font-serif text-4xl font-black italic leading-none text-white md:text-5xl">
                    {pillar.title}
                  </h3>
                  <p className="mt-5 font-body text-sm leading-6 text-white/64">
                    {pillar.copy}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
