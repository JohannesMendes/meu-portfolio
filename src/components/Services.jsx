import { SERVICES } from "../data/content";

// Ícones SVG inline por serviço — sem dependência extra
const SERVICE_ICONS = {
  "01": (
    // Frontend — code brackets
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  "02": (
    // Backend — server stack
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  ),
  "03": (
    // UI/UX — figma-like layers
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  ),
};

export default function Services() {
  return (
    <section id="servicos" className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32 lg:px-16">
      <div className="relative mx-auto max-w-7xl">
        <h2
          data-reveal
          className="reveal font-display text-[clamp(2rem,5vw,3.25rem)] font-extrabold tracking-tight text-paper"
        >
          O que eu <span className="text-signal">faço</span>
        </h2>

        <div className="relative mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-hair bg-hair sm:grid-cols-3">
          {SERVICES.map((service, i) => (
            <div
              key={service.number}
              data-reveal
              style={{ transitionDelay: `${i * 90}ms` }}
              className="reveal group relative bg-ink p-8 transition-all duration-300 hover:bg-panel hover:shadow-[inset_0_0_0_1px_rgba(255,59,48,0.25)] sm:p-10"
            >
              {/* Glow sutil no hover */}
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "radial-gradient(ellipse at 20% 20%, rgba(255,59,48,0.07) 0%, transparent 70%)" }}
              />

              {/* Ícone + número como badge */}
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-signal/20 bg-signal/10 text-signal transition-all duration-300 group-hover:border-signal/40 group-hover:bg-signal/15 group-hover:shadow-[0_0_16px_rgba(255,59,48,0.2)]">
                  {SERVICE_ICONS[service.number]}
                </span>
                <span className="inline-flex items-center rounded-full border border-signal/20 bg-signal/8 px-2.5 py-0.5 font-mono text-xs font-semibold text-signal">
                  {service.number}
                </span>
              </div>

              <h3 className="mt-5 font-display text-xl font-bold text-paper sm:text-2xl">
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
