import { ArrowUpRight, Camera, Droplets, Sparkles, Target } from "lucide-react";
import PhoneDemo from "./PhoneDemo";

const FEATURES = [
  {
    icon: Camera,
    title: "Scanner de prato",
    text: "Tire uma foto e a IA identifica os alimentos, estima o peso e calcula calorias e macros.",
  },
  {
    icon: Sparkles,
    title: "Por texto ou voz",
    text: "Escreva ou fale o que comeu, como “3 ovos mexidos e 2 fatias de pão”, e a IA interpreta.",
  },
  {
    icon: Target,
    title: "Metas sob medida",
    text: "Calorias, proteína, carboidrato, gordura e água calculados para o seu objetivo.",
  },
  {
    icon: Droplets,
    title: "Diário e água",
    text: "Registre as refeições do dia, acompanhe a água e veja quanto falta para a meta.",
  },
];

const TAGS = ["Flutter", "IA Gemini", "Firebase"];

export default function AppShowcase() {
  return (
    <section id="nutrisnap" className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32 lg:px-16">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 78% 50%, rgba(255,59,48,0.10) 0%, transparent 62%)" }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-x-20 gap-y-14 lg:grid-cols-2">
        <div className="order-1 lg:order-none lg:col-start-1 lg:row-start-1 lg:self-end">
          <span
            data-reveal
            className="reveal font-mono text-xs uppercase tracking-[0.2em] text-signal"
          >
            Aplicativo
          </span>
          <h2
            data-reveal
            className="reveal mt-4 font-display text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-[1.05] tracking-tight text-paper"
          >
            Veja o <span className="text-signal">NutriSnap</span> funcionando
          </h2>
          <p data-reveal className="reveal mt-6 max-w-xl text-base leading-relaxed text-mist">
            App de nutrição que transforma a foto do prato (ou uma frase) em calorias e macros. Feito em Flutter, com IA
            Gemini, e pensado para quem quer registrar a alimentação sem pesar tudo na balança.
          </p>
        </div>

        <div className="order-3 lg:order-none lg:col-start-1 lg:row-start-2 lg:-mt-6 lg:self-start">
          <div data-reveal className="reveal grid gap-px overflow-hidden rounded-2xl border border-hair bg-hair sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-ink p-6 transition-colors duration-300 hover:bg-panel">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-signal/20 bg-signal/10 text-signal">
                  <Icon size={18} />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-paper">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-mist">{text}</p>
              </div>
            ))}
          </div>

          <div data-reveal className="reveal mt-8 flex flex-wrap items-center gap-3">
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-signal/20 bg-signal/8 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-signal/80"
              >
                {tag}
              </span>
            ))}
            <a
              href="https://github.com/JohannesMendes/NutriSnap"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex sm:ml-auto items-center gap-2 rounded-full bg-signal px-6 py-3 font-mono text-sm font-semibold text-ink transition-opacity hover:opacity-90"
            >
              Ver no GitHub
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>

        <div data-reveal className="reveal order-2 flex justify-center lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:items-center lg:justify-end lg:pr-6">
          <div className="origin-top lg:scale-[1.08]">
            <PhoneDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
