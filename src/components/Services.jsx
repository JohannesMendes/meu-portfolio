import { SERVICES } from "../data/content";
import TextLoop from "./TextLoop";

export default function Services() {
  return (
    <section id="servicos" className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32 lg:px-16">
      {/* Decorative animated strokes — text flowing along a gently curved
          path (never straight), echoing the hand-drawn reference. Kept
          fully inside the section's own top padding so they never bleed
          into the tech marquee above. Hidden on mobile. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-8%] top-2 hidden h-[130px] w-[440px] -rotate-[28deg] opacity-90 sm:block"
      >
        <TextLoop
          text="Jo_Eng"
          shape="wave"
          curviness={40}
          separator="✦"
          speed={70}
          fontSize={24}
          fontWeight={800}
          letterSpacing={2}
          color="#ffffff"
          ribbon
          ribbonColor="var(--color-signal)"
          ribbonWidth={37}
          pauseOnHover={false}
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-8%] top-6 hidden h-[130px] w-[480px] rotate-[24deg] opacity-90 sm:block"
      >
        <TextLoop
          text="Jo_Eng"
          shape="wave"
          curviness={40}
          separator="✦"
          speed={70}
          direction="reverse"
          fontSize={24}
          fontWeight={800}
          letterSpacing={2}
          color="#ffffff"
          ribbon
          ribbonColor="var(--color-signal)"
          ribbonWidth={37}
          pauseOnHover={false}
        />
      </div>

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

        {/* Two short curved ticks sitting in the gap BELOW the grid (never
            over the card text), matching the small marks in the reference
            sketch, curved instead of straight. */}
        <div
          aria-hidden="true"
          className="pointer-events-none relative mt-3 hidden h-[64px] sm:block"
        >
          <div className="absolute left-[26%] h-[64px] w-[150px] rotate-[58deg] opacity-90">
            <TextLoop
              text="✦"
              shape="wave"
              curviness={22}
              separator=""
              speed={40}
              fontSize={16}
              color="#ffffff"
              ribbon
              ribbonColor="var(--color-signal)"
              ribbonWidth={22}
              pauseOnHover={false}
            />
          </div>
          <div className="absolute left-[58%] h-[64px] w-[150px] rotate-[58deg] opacity-90">
            <TextLoop
              text="✦"
              shape="wave"
              curviness={22}
              separator=""
              speed={40}
              fontSize={16}
              color="#ffffff"
              ribbon
              ribbonColor="var(--color-signal)"
              ribbonWidth={22}
              pauseOnHover={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
