import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";
import { PROJECTS, PROJECT_CATEGORIES } from "../data/content";

function ProjectsSection({ category }) {
  const projects = PROJECTS.filter((project) => project.category === category.id);

  return (
    <section className="mt-16 first:mt-14">
      <div className="flex items-baseline gap-3">
        <h2 className="font-display text-xl font-extrabold tracking-tight text-paper sm:text-2xl">
          {category.label}
        </h2>
        <span className="font-mono text-xs text-mist">
          {String(projects.length).padStart(2, "0")}
        </span>
      </div>

      {projects.length > 0 ? (
        <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="mt-7 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-14 text-center">
          <Sparkles className="text-mist" size={24} />
          <p className="font-mono text-sm text-mist">
            Novos projetos de {category.label.toLowerCase()} em breve.
          </p>
        </div>
      )}
    </section>
  );
}

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
            <ArrowLeft size={18} />
            Voltar para a home
          </Link>

          <h1 className="mt-6 font-display text-[clamp(2.2rem,6vw,4rem)] font-extrabold tracking-tight text-paper">
            Todos os <span className="text-signal">Projetos</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-mist sm:text-lg">
            Trabalhos completos, do frontend ao backend — cada um pensado sob medida
            para o problema que resolve.
          </p>

          {PROJECT_CATEGORIES.map((category) => (
            <ProjectsSection key={category.id} category={category} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
