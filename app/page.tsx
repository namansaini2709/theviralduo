"use client";

import FloatingParticlesBackground from "@/components/global/FloatingParticlesBackground";
import CustomCursor from "@/components/global/CustomCursor";
import ScrollProgress from "@/components/global/ScrollProgress";
import Navigation from "@/components/global/Navigation";
import Loader from "@/components/sections/Loader";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import ServicesIntro from "@/components/sections/ServicesIntro";
import Services from "@/components/sections/Services";
import Marquee from "@/components/sections/Marquee";
import MovieReel from "@/components/sections/MovieReel";
import Polaroids from "@/components/sections/Polaroids";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

import TransitionOverlay from "@/components/global/TransitionOverlay";
import { useState, useEffect } from "react";

export default function Home() {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleTransition = (e: Event) => {
      setIsTransitioning(true);
      setTimeout(() => {
        const customEvent = e as CustomEvent;
        const targetId = customEvent.detail;
        const element = document.querySelector(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'auto' }); // Jump while covered
        }
      }, 500);
      setTimeout(() => setIsTransitioning(false), 1200);
    };

    window.addEventListener("page-transition", handleTransition);
    return () => window.removeEventListener("page-transition", handleTransition);
  }, []);

  return (
    <>
      <FloatingParticlesBackground />
      <TransitionOverlay isTransitioning={isTransitioning} />
      <CustomCursor />
      <ScrollProgress />
      <Navigation />
      <Loader />

      <main className="relative z-10">
        <Hero />
        <About />
        <ServicesIntro />
        <Services />
        <Marquee />
        <MovieReel />
        <Polaroids />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

