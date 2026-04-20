import FilmGrain from "@/components/global/FilmGrain";
import CustomCursor from "@/components/global/CustomCursor";
import ScrollProgress from "@/components/global/ScrollProgress";
import Navigation from "@/components/global/Navigation";
import Loader from "@/components/sections/Loader";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Marquee from "@/components/sections/Marquee";
import MovieReel from "@/components/sections/MovieReel";
import Polaroids from "@/components/sections/Polaroids";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <FilmGrain />
      <CustomCursor />
      <ScrollProgress />
      <Navigation />
      <Loader />

      <main>
        <Hero />
        <About />
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
