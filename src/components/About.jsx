import { useState } from "react";
import { ABOUT_PARAGRAPHS, ABOUT_PHILOSOPHY, CORE_STACK } from "../data/content";

/**
 * About
 * ---------------------------------------------------------------------
 * The profile photo is intentionally STATIC here — no scroll-expansion
 * animation. That effect now lives exclusively on the Hero video (see
 * Hero.jsx). The photo is simply sized up ~18% versus the original
 * (208px -> 284px mobile baseline, 240px -> 333px sm+), giving it more
 * visual weight without any scroll-linked behavior.
 */
export default function About() {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="sobre" className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32 lg:px-16">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-signal/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <h2
          data-reveal
          className="reveal font-display text-[clamp(2rem,5vw,3.25rem)] font-extrabold tracking-tight text-paper"
        >
          Sobre <span className="text-signal">Mim</span>
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div data-reveal className="reveal space-y-6">
            <div className="h-[284px] w-[284px] overflow-hidden rounded-2xl border border-hair bg-panel sm:h-[333px] sm:w-[333px]">
              {!imgError ? (
                <img
                  src="/sua-foto.jpg"
                  alt="Foto de Johannes Mendes"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
                  <span className="font-display text-3xl font-extrabold text-signal">JM</span>
                  <small className="text-xs text-mist">
                    Adicione o arquivo "sua-foto.jpg" na pasta do site para exibir sua foto aqui
                  </small>
                </div>
              )}
            </div>

            {ABOUT_PARAGRAPHS.map((p) => (
              <p key={p} className="max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                {p}
              </p>
            ))}

            <p className="max-w-xl border-l-2 border-signal pl-4 font-display text-lg italic text-paper sm:text-xl">
              "{ABOUT_PHILOSOPHY}"
            </p>
          </div>

          <div data-reveal className="reveal rounded-2xl border border-hair bg-panel p-7 sm:p-8">
            <h3 className="font-display text-xl font-bold text-paper sm:text-2xl">Core Stack</h3>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
              {CORE_STACK.map((skill) => (
                <div
                  key={skill}
                  className="flex min-h-[76px] items-center justify-center rounded-2xl border border-hair bg-panel-soft px-4 py-4 text-center text-sm font-semibold leading-snug text-paper transition-colors hover:border-signal/50 sm:min-h-[92px] sm:px-5 sm:py-5 sm:text-base"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
