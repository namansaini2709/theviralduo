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
    accent: "from-brand-sky/20 via-brand-sky/10 to-transparent",
    tint: "bg-brand-sky/10 group-hover:bg-brand-sky/20",
    border: "border-brand-sky/30 group-hover:border-brand-sky/60",
    shadow: "shadow-brand-sky/10 group-hover:shadow-brand-sky/20",
  },
  {
    title: "Productive",
    copy: "We turn ideas into sharp hooks, repeatable formats, and fast-moving edits built for retention.",
    image: "/assets/services/clapboard.png",
    accent: "from-brand-pink/20 via-brand-pink/10 to-transparent",
    tint: "bg-brand-pink/10 group-hover:bg-brand-pink/20",
    video: "/assets/videos/Screen Recording 2026-05-01 at 12.57.42 PM.mov",
    border: "border-brand-pink/30 group-hover:border-brand-pink/60",
    shadow: "shadow-brand-pink/10 group-hover:shadow-brand-pink/25",
  },
  {
    title: "Creative",
    copy: "We read the data, double down on winners, and keep the content machine compounding.",
    image: "/assets/services/charts.png",
    video: "/assets/videos/creative_reel_trimmed_2.mov",
    accent: "from-brand-yellow/20 via-brand-yellow/10 to-transparent",
    tint: "bg-brand-yellow/10 group-hover:bg-brand-yellow/20",
    border: "border-brand-yellow/30 group-hover:border-brand-yellow/60",
    shadow: "shadow-brand-yellow/10 group-hover:shadow-brand-yellow/20",
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
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
          const headerChars = headerRef.current?.querySelectorAll(".char") || [];
          const headerPara = headerRef.current?.querySelector("p");

          const desktopRotations = [-3.5, 2.5, 3.5];
          const mobileRotations = [-2, 1.5, 2];

          gsap.set(cards, {
            transformPerspective: 1200,
            transformOrigin: "50% 80%",
            willChange: "transform, opacity",
          });

          if (headerChars.length) {
            gsap.set(headerChars, { willChange: "transform, opacity" });
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: isDesktop ? "+=200%" : "+=140%",
              scrub: true, // 1:1 manual control
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              refreshPriority: 9,
              invalidateOnRefresh: true,
            },
          });

          // 1. Header Animation (Chars enter) - Ease: None for manual feel
          tl.fromTo(headerChars,
            { opacity: 0, y: 30, rotateX: 30, filter: "blur(8px)" },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              filter: "blur(0px)",
              stagger: 0.02,
              duration: 1,
              ease: "none" // Manual speed mapping
            },
            0.05
          );

          if (headerPara) {
            tl.fromTo(headerPara,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.8, ease: "none" },
              0.2
            );
          }

          // 2. Cards Animation (Enter) - Direct and scroll-linked
          tl.fromTo(
            cards,
            {
              autoAlpha: 0,
              y: isDesktop ? 300 : 150,
              scale: 0.9,
              rotateX: 15,
              rotateZ: (index) => (isDesktop ? desktopRotations[index] * 1.5 : mobileRotations[index]),
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              rotateZ: (index) => (isDesktop ? desktopRotations[index] : mobileRotations[index]),
              duration: 1.5,
              stagger: 0.04,
              ease: "none",
            },
            0.1
          );

          // 3. Static Hold / Minimal Movement (Replaces Wobble)
          tl.to(
            cards,
            {
              y: -20,
              duration: 1,
              ease: "none",
            },
            "+=0.2"
          );

          // 4. Combined Exit
          tl.to([headerChars, headerPara], {
            opacity: 0,
            y: -60,
            stagger: 0.01,
            duration: 0.8,
            ease: "none"
          }, "+=0.3");

          tl.to(
            cards,
            {
              y: isDesktop ? -200 : -100,
              autoAlpha: 0,
              scale: 0.9,
              duration: 1,
              stagger: 0.04,
              ease: "none",
            },
            "<"
          );

          // Subtle section fade
          tl.to(sectionRef.current, { opacity: 0, duration: 0.5, ease: "none" }, "+=0.1");
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
      className="relative min-h-screen w-full overflow-hidden px-5 py-16 text-black bg-transparent"
    >
      <div className="relative z-10 mx-auto flex min-h-fit md:min-h-[calc(100vh-8rem)] w-full max-w-6xl flex-col items-center justify-center py-10 md:py-0">
        <div ref={headerRef} className="mb-10 text-center md:mb-14 flex flex-col items-center">
          <div className="flex flex-wrap justify-center gap-x-[0.3em] mb-4">
            <h2 className="flex flex-wrap justify-center gap-x-[0.4em] font-display font-black text-[10vw] md:text-[7vw] lg:text-[5.5rem] leading-[1.1] py-4 tracking-tight uppercase text-brand-deep items-center">
              <span className="flex">
                {"WHO".split("").map((char, i) => (
                  <span key={i} className="char inline-block px-1">
                    {char}
                  </span>
                ))}
              </span>
              <span className="flex">
                {"WE".split("").map((char, i) => (
                  <span key={i} className="char inline-block px-1 text-orange-gradient">
                    {char}
                  </span>
                ))}
              </span>
              <span className="flex font-serif italic ml-4">
                {"ARE".split("").map((char, i) => (
                  <span key={i} className="char inline-block px-1">
                    {char}
                  </span>
                ))}
              </span>
            </h2>
          </div>
          <p className="mx-auto mt-4 max-w-2xl font-body text-sm leading-7 text-brand-text md:text-base font-bold opacity-0">
            We don&apos;t post content. We engineer virality through strategy,
            production, and relentless creative iteration.
          </p>
        </div>

        <div className="grid w-full max-w-5xl grid-cols-1 gap-10 px-5 [perspective:1200px] md:grid-cols-3 md:gap-10 md:px-0">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.title}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => handleMouseLeave(index)}
              className={`group relative min-h-[300px] overflow-hidden rounded-[2.5rem] border bg-white/60 ${pillar.accent} ${pillar.border} shadow-[0_15px_45px_rgba(77,184,229,0.1)] md:shadow-[0_30px_90px_rgba(77,184,229,0.2)] ${pillar.shadow} backdrop-blur-[10px] md:min-h-[340px] [transform-style:preserve-3d] transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500`}
            >
              <div className="card-glare pointer-events-none absolute inset-0 z-50 opacity-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05)_0%,transparent_80%)] blur-2xl" />
              <div className={`absolute inset-0 ${pillar.tint} opacity-40 mix-blend-multiply transition-colors duration-500`} />
              <div className="absolute inset-0 bg-white/40" />
              <div className="absolute inset-0 opacity-35 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.05),transparent_52%)]" />

              <div className="relative z-10 flex h-full flex-col">
                <div className="relative flex aspect-video md:aspect-[1.6] items-center justify-center overflow-hidden bg-white/50 transition-colors duration-500 group-hover:bg-white/80 border-b border-black/5">
                  {pillar.video ? (
                    pillar.video.match(/\.(mp4|webm|ogg|mov)$/) ? (
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

                <div className="mt-auto p-4 md:p-5">
                  <h3 className="font-serif text-xl font-black italic leading-none text-black md:text-3xl">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 md:mt-4 font-body text-[12px] md:text-[13px] leading-relaxed text-black/80 font-medium">
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
