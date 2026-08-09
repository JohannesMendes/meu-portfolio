import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PROJECTS } from "../data/content";
import ProjectsCarousel from "./ProjectsCarousel";

export default function Projects() {
  return (
    <section id="projetos" className="px-5 py-24 sm:px-8 sm:py-32 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2
            data-reveal
            className="reveal font-display text-[clamp(2rem,5vw,3.25rem)] font-extrabold tracking-tight text-paper"
          >
            Projetos
          </h2>
          <Link
            to="/projetos"
            className="inline-flex items-center gap-1.5 font-mono text-sm text-mist transition-colors hover:text-paper"
          >
            Ver todos os projetos
            <ArrowRight size={16} />
          </Link>
        </div>

        <div data-reveal className="reveal mt-12">
          <ProjectsCarousel projects={PROJECTS} />
        </div>
      </div>
    </section>
  );
}
