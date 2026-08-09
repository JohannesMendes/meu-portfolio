import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ScrollProgress from "../components/ScrollProgress";
import GlobalClickSpark from "../components/GlobalClickSpark";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import Services from "../components/Services";
import Projects from "../components/Projects";
import Milestones from "../components/Milestones";
import About from "../components/About";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { useReveal } from "../hooks/useReveal";

export default function Home() {
  useReveal();
  const location = useLocation();

  // Supports links like "/#projetos" coming from other pages (e.g. the
  // Projects page's nav) by scrolling to the section once we land here.
  useEffect(() => {
    if (!location.hash) return;
    const el = document.querySelector(location.hash);
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth" }));
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-ink">
      <ScrollProgress />
      <GlobalClickSpark />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Projects />
        <Milestones />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
