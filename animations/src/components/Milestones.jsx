import { MILESTONES } from "../data/content";

export default function Milestones() {
  return (
    <section className="border-y border-hair bg-panel px-5 py-16 sm:px-8 lg:px-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-4">
        {MILESTONES.map((m, i) => (
          <div
            key={m.label}
            data-reveal
            style={{ transitionDelay: `${i * 80}ms` }}
            className="reveal text-center sm:text-left"
          >
            <div className="font-display text-[clamp(1.5rem,4vw,2.25rem)] font-extrabold text-paper">
              {m.number}
            </div>
            <div className="mt-2 text-xs leading-snug text-mist sm:text-sm">{m.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
