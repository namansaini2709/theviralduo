"use client";

import FloatingParticlesBackground from "@/components/global/FloatingParticlesBackground";
import ScrollProgress from "@/components/global/ScrollProgress";
import Navigation from "@/components/global/Navigation";
import Loader from "@/components/sections/Loader";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import CinematicServices from "@/components/sections/CinematicServices";
import Marquee from "@/components/sections/Marquee";
import MovieReel from "@/components/sections/MovieReel";
import Polaroids from "@/components/sections/Polaroids";
import Results from "@/components/sections/Results";
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
        if (targetId === "#top") {
          window.scrollTo({ top: 0, behavior: 'auto' });
        } else {
          const element = document.querySelector(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'auto' }); // Jump while covered
          }
        }
      }, 500);
      setTimeout(() => setIsTransitioning(false), 1200);
    };

    window.addEventListener("page-transition", handleTransition);
    
    // Global Refresh for all ScrollTriggers to fix overlapping
    const refreshAll = () => {
      import("gsap").then((gsap) => {
        import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
          gsap.default.ticker.lagSmoothing(0);
          ScrollTrigger.refresh(true);
        });
      });
    };
    
    const timer = setTimeout(refreshAll, 1500);
    window.addEventListener("resize", refreshAll);

    return () => {
      window.removeEventListener("page-transition", handleTransition);
      window.removeEventListener("resize", refreshAll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <FloatingParticlesBackground />
      <TransitionOverlay isTransitioning={isTransitioning} />
      <ScrollProgress />
      <Navigation />
      <Loader />

      <main className="relative z-10 flex w-full flex-col overflow-x-hidden">
        {/* 1. Hero Section */}
        <Hero />
        
        {/* 2. Who We Are Section */}
        <About />
        
        {/* 3. Cinematic Services Section */}
        <div id="services-group">
          <CinematicServices />
          <Marquee />
        </div>
        
        {/* 4. Our Work Section */}
        <MovieReel />
        
        {/* 5. Feedback Section */}
        <Polaroids />
        
        {/* 5.5. Results Section */}
        <Results />
        
        {/* 6. Contact Section */}
        <Contact />
      </main>


      <Footer />
    </>
  );
}
