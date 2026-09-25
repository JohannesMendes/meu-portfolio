import { MILESTONES } from "../data/content";

export default function Milestones() {
  return (
    <section className="relative overflow-hidden border-y border-hair bg-panel px-5 py-16 sm:px-8 lg:px-16">
      {/* Gradiente radial de fundo */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/6 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-4">
        {MILESTONES.map((m, i) => (
          <div
            key={m.label}
            data-reveal
            style={{ transitionDelay: `${i * 80}ms` }}
            className="reveal group text-center sm:text-left"
          >
            {/* Borda lateral esquerda como âncora visual */}
            <div className="flex flex-col items-center sm:items-start sm:border-l-2 sm:border-signal/30 sm:pl-5 transition-all duration-300 sm:group-hover:border-signal/70">
              <div className="font-display text-[clamp(1.5rem,4vw,2.25rem)] font-extrabold text-paper transition-colors duration-300 group-hover:text-signal">
                {m.number}
              </div>
              <div className="mt-2 text-xs leading-snug text-mist sm:text-sm">{m.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
