import { SERVICES } from "../data/content";

export default function Services() {
  return (
    <section id="servicos" className="px-5 py-24 sm:px-8 sm:py-32 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <h2
          data-reveal
          className="reveal font-display text-[clamp(2rem,5vw,3.25rem)] font-extrabold tracking-tight text-paper"
        >
          O que eu <span className="text-signal">faço</span>
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-hair bg-hair sm:grid-cols-3">
          {SERVICES.map((service, i) => (
            <div
              key={service.number}
              data-reveal
              style={{ transitionDelay: `${i * 90}ms` }}
              className="reveal group bg-ink p-8 transition-colors hover:bg-panel sm:p-10"
            >
              <span className="font-mono text-sm text-signal">{service.number}</span>
              <h3 className="mt-4 font-display text-xl font-bold text-paper sm:text-2xl">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-mist sm:text-base">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
