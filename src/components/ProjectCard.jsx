import { ArrowUpRight } from "lucide-react";

export default function ProjectCard({ project, className = "", ...rest }) {
  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex flex-col overflow-hidden rounded-2xl border border-hair bg-panel transition-transform hover:-translate-y-1 ${className}`}
      {...rest}
    >
      <div className="aspect-[16/10] w-full overflow-hidden bg-panel-soft">
        <img
          src={project.image}
          alt={project.imageAlt || project.title}
          loading="lazy"
          draggable={false}
          className="h-full w-full select-none object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-hair px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-mist"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="font-display text-lg font-bold text-paper">{project.title}</h3>
        <p className="text-sm leading-relaxed text-mist">{project.description}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-signal">
          Acessar Site
          <ArrowUpRight size={16} />
        </span>
      </div>
    </a>
  );
}
