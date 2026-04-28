"use client";

import { motion } from "framer-motion";

export default function ServicesIntro() {
  const words = ["SERVICES", "WE", "PROVIDE"];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.6, // Delay between words
        delayChildren: 0.2,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04, // Stagger characters within the word
      }
    }
  };

  const getCharVariants = (word: string) => {
    let initialX = 0;
    let initialY = 0;

    if (word === "SERVICES") initialX = -60;
    if (word === "WE") initialY = -60;
    if (word === "PROVIDE") initialX = 60;

    return {
      hidden: { 
        opacity: 0, 
        x: initialX, 
        y: initialY,
        rotateY: word === "WE" ? 0 : initialX > 0 ? 45 : -45,
        rotateX: word === "WE" ? -45 : 10,
        filter: "blur(10px)"
      },
      visible: { 
        opacity: 1, 
        x: 0, 
        y: 0,
        rotateY: word === "WE" ? 0 : -10,
        rotateX: word === "WE" ? 5 : 5,
        filter: "blur(0px)",
        transition: {
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        },
      },
    };
  };

  const taglineVariants = {
    hidden: { 
      opacity: 0, 
      y: 10,
      color: "#ffffff",
      textShadow: "0 0 0px rgba(230, 57, 70, 0)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      color: ["#ffffff", "#E63946", "#ffffff"],
      textShadow: [
        "0 0 0px rgba(230, 57, 70, 0)",
        "0 0 20px rgba(230, 57, 70, 0.8), 0 0 40px rgba(230, 57, 70, 0.4)",
        "0 0 0px rgba(230, 57, 70, 0)"
      ],
      transition: { 
        duration: 2.5,
        times: [0, 0.3, 1],
        delay: 1.2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-transparent py-40 [perspective:1000px] z-20">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0 }}
        className="px-6 relative z-10 flex flex-col items-center w-full"
      >
        <motion.p
          variants={taglineVariants}
          className="font-body text-white/80 uppercase tracking-[0.4em] text-[10px] md:text-xs font-black mb-12 text-center"
        >
          If it&apos;s not viral then its not us
        </motion.p>
        
        <div className="flex flex-wrap justify-center gap-x-[1.5em] gap-y-12">
          {words.map((word, wordIdx) => (
            <motion.span 
              key={wordIdx} 
              variants={wordVariants}
              className={`inline-block whitespace-nowrap ${
                word === "SERVICES" ? "-translate-y-4 md:-translate-y-6" : 
                word === "PROVIDE" ? "translate-y-4 md:translate-y-6" : ""
              }`}
            >
              {word.split("").map((char, charIdx) => (
                <motion.span
                  key={charIdx}
                  variants={getCharVariants(word)}
                  className={`inline-block font-serif text-[9vw] md:text-[6.5vw] lg:text-[5.5rem] font-black italic leading-[0.8] tracking-tighter uppercase drop-shadow-[0_20px_50px_rgba(230,57,70,0.35)] ${
                    word === "WE" ? "text-white" : "text-[#E63946]"
                  }`}
                >
                  {char}
                </motion.span>
              ))}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] bg-[radial-gradient(circle,rgba(230,57,70,0.05)_0%,transparent_70%)]" />
      </div>
    </section>
  );
}
