import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import { ABOUT_PARAGRAPHS, ABOUT_PHILOSOPHY, CORE_STACK } from "../data/content";
import TextLoop from "./TextLoop";
import Lanyard from "./Lanyard/Lanyard";
import { useBadgeFace } from "./Lanyard/useBadgeFace";

/**
 * About
 * ---------------------------------------------------------------------
 * The profile photo is a physics-based hanging badge (<Lanyard />) that
 * mounts once the section scrolls into view (useInView, once: true). It
 * lives in a taller, transparent, borderless box (pulled up with a
 * negative top margin) so the lanyard cord has room to fall from above
 * the card into view before settling — floating freely over the page
 * background instead of sitting inside a boxed card like the old static
 * photo did. The card itself sits near the bottom of that box, right
 * above the bio paragraphs, and camera position [0,0,16] (vs. the
 * original 13) scales it down slightly so it lines up with the bio text
 * without overlapping the "Sobre Mim" heading above or the paragraphs
 * below.
 */
export default function About() {
  const [imgError, setImgError] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const badgeFace = useBadgeFace("/sua-foto.jpg", "Software Engineer");

  return (
    <section id="sobre" ref={sectionRef} className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32 lg:px-16">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-signal/10 blur-3xl" />

      {/* Decorative animated strokes — mirrors the hand-drawn reference:
          one curling over the heading/photo, one running down the right
          side past the stack card. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 -top-9 hidden h-[168px] w-[670px] -rotate-[24deg] opacity-90 lg:block"
      >
        <TextLoop
          text="Sobre Mim"
          shape="wave"
          curviness={40}
          separator="✦"
          speed={65}
          fontSize={28}
          fontWeight={800}
          letterSpacing={2}
          color="#ffffff"
          ribbon
          ribbonColor="var(--color-signal)"
          ribbonWidth={44}
          pauseOnHover={false}
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-60 top-10 hidden h-[194px] w-[721px] rotate-[65deg] opacity-90 lg:block"
      >
        <TextLoop
          text="Core Stack"
          shape="wave"
          curviness={58}
          separator="✦"
          speed={60}
          direction="reverse"
          fontSize={26}
          fontWeight={800}
          letterSpacing={2}
          color="#ffffff"
          ribbon
          ribbonColor="var(--color-signal)"
          ribbonWidth={39}
          pauseOnHover={false}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <h2
          data-reveal
          className="reveal font-display text-[clamp(2rem,5vw,3.25rem)] font-extrabold tracking-tight text-paper"
        >
          Sobre <span className="text-signal">Mim</span>
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div data-reveal className="reveal space-y-6">
            {/* Layout spacer: reserves the original narrow footprint so the
                bio paragraphs below don't shift. The actual interactive
                canvas is wider (see below) and floats on top of/past this,
                since a WebGL <canvas> never draws outside its own pixel
                bounds — a narrow canvas was clipping the card mid-drag. */}
            <div className="relative -mt-10 h-[460px] w-[284px] sm:-mt-14 sm:h-[540px] sm:w-[333px]">
              <div className="absolute inset-y-0 left-0 w-[560px] sm:w-[660px]">
                {isInView && badgeFace ? (
                  <Lanyard
                    position={[3.4, 0, 16]}
                    gravity={[0, -40, 0]}
                    fov={20}
                    transparent
                    frontImage={badgeFace}
                    backImage={badgeFace}
                    imageFit="cover"
                    lanyardWidth={1}
                  />
                ) : !imgError ? (
                  <img
                    src="/sua-foto.jpg"
                    alt="Foto de Johannes Mendes"
                    onError={() => setImgError(true)}
                    className="absolute bottom-0 left-0 h-[284px] w-[284px] rounded-2xl object-cover sm:h-[333px] sm:w-[333px]"
                  />
                ) : (
                  <div className="absolute bottom-0 left-0 flex h-[284px] w-[284px] flex-col items-center justify-center gap-2 rounded-2xl border border-hair bg-panel p-4 text-center sm:h-[333px] sm:w-[333px]">
                    <span className="font-display text-3xl font-extrabold text-signal">JM</span>
                    <small className="text-xs text-mist">
                      Adicione o arquivo "sua-foto.jpg" na pasta do site para exibir sua foto aqui
                    </small>
                  </div>
                )}
              </div>
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
