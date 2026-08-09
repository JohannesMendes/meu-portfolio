import { STACK } from "../data/content";

function Set({ hidden }) {
  return (
    <div className="flex items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
      {STACK.map((tech) => (
        <span key={tech} className="flex items-center gap-10 whitespace-nowrap">
          <span className="font-display text-base font-extrabold uppercase tracking-wide text-paper sm:text-lg">
            {tech}
          </span>
          <span className="text-signal">•</span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="w-full overflow-hidden border-y border-hair bg-panel py-4">
      <div className="marquee-track">
        <Set />
        <Set hidden />
      </div>
    </div>
  );
}
