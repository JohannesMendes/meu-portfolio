import { SERVICES } from "../data/content";
import TextLoop from "./TextLoop";

export default function Services() {
  return (
    <section id="servicos" className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32 lg:px-16">
      {/* Decorative animated strokes — text flowing along diagonal paths,
          echoing the hand-drawn reference. Hidden below sm to keep mobile
          layout clean; purely decorative (pointer-events-none). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-10 hidden h-[110px] w-[420px] -rotate-[32deg] opacity-90 sm:block"
      >
        <TextLoop
          text="Jo_Eng"
          shape="line"
          separator="✦"
          speed={70}
          fontSize={22}
          fontWeight={800}
          letterSpacing={2}
          color="#ffffff"
          ribbon
          ribbonColor="var(--color-signal)"
          ribbonWidth={34}
          pauseOnHover={false}
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-4 hidden h-[110px] w-[460px] rotate-[28deg] opacity-90 sm:block"
      >
        <TextLoop
          text="Jo_Eng"
          shape="line"
          separator="✦"
          speed={70}
          direction="reverse"
          fontSize={22}
          fontWeight={800}
          letterSpacing={2}
          color="#ffffff"
          ribbon
          ribbonColor="var(--color-signal)"
          ribbonWidth={34}
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

        {/* Two short diagonal ticks under the grid, matching the small
            marks in the reference sketch. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-8 left-[28%] hidden h-[70px] w-[140px] rotate-[62deg] opacity-90 sm:block"
        >
          <TextLoop
            text="✦"
            shape="line"
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
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-8 left-[62%] hidden h-[70px] w-[140px] rotate-[62deg] opacity-90 sm:block"
        >
          <TextLoop
            text="✦"
            shape="line"
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
    </section>
  );
}
