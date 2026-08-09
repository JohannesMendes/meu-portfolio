import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";
import { PROJECTS } from "../data/content";

export default function ProjectsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-ink">
      <Navbar />
      <main className="px-5 pb-24 pt-28 sm:px-8 sm:pt-32 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-mono text-sm text-mist transition-colors hover:text-paper"
          >
            <ArrowLeft size={16} />
            Voltar para a home
          </Link>

          <h1 className="mt-6 font-display text-[clamp(2.2rem,6vw,4rem)] font-extrabold tracking-tight text-paper">
            Todos os <span className="text-signal">Projetos</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-mist sm:text-lg">
            Trabalhos completos, do frontend ao backend — cada um pensado sob medida
            para o problema que resolve.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
