import { WHATSAPP_LINK, GITHUB_LINK, INSTAGRAM_LINK } from "../data/content";

export default function Contact() {
  return (
    <section
      id="contato"
      className="relative overflow-hidden border-t border-hair px-5 py-24 text-center sm:px-8 sm:py-32 lg:px-16"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-signal/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl">
        <h2
          data-reveal
          className="reveal font-display text-[clamp(2rem,6vw,3.5rem)] font-extrabold tracking-tight text-paper text-balance"
        >
          Vamos iniciar uma <span className="text-signal">parceria?</span>
        </h2>
        <p data-reveal className="reveal mt-5 text-base text-mist sm:text-lg">
          Seja para criar um sistema do zero ou otimizar uma plataforma existente, entre em
          contato.
        </p>

        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          data-reveal
          className="reveal mt-9 inline-flex items-center justify-center rounded-full bg-signal px-8 py-4 text-base font-semibold text-ink transition-transform hover:-translate-y-0.5"
        >
          Conectar no WhatsApp
        </a>

        <div className="mt-10 flex items-center justify-center gap-6 font-mono text-sm text-mist">
          <a href={GITHUB_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-paper transition-colors">
            GitHub
          </a>
          <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-paper transition-colors">
            Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
