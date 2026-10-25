import { ArrowUpRight } from "lucide-react";

export default function ProjectCard({ project, className = "", ...rest }) {
  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-hair bg-panel shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-2 hover:border-signal/30 hover:shadow-[0_16px_48px_rgba(255,59,48,0.14)] ${className}`}
      {...rest}
    >
      {/* Imagem com overlay de hover */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-panel-soft">
        <img
          src={project.image}
          alt={project.imageAlt || project.title}
          loading="lazy"
          draggable={false}
          className="h-full w-full select-none object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay escuro com CTA centralizado — aparece no hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-ink/70 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
          <span className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 font-mono text-sm font-semibold text-paper backdrop-blur-sm">
            {project.linkLabel || "Acessar Site"}
            <ArrowUpRight size={15} />
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        {/* Tags com cor signal */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-signal/20 bg-signal/8 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-signal/80 transition-colors duration-200 group-hover:border-signal/40 group-hover:text-signal"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="font-display text-lg font-bold text-paper">{project.title}</h3>
        <p className="text-sm leading-relaxed text-mist">{project.description}</p>

        {/* CTA texto no bottom */}
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-signal transition-all duration-200 group-hover:gap-2.5">
          {project.linkLabel || "Acessar Site"}
          <ArrowUpRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </a>
  );
}
