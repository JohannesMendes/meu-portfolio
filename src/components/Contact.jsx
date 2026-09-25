import { WHATSAPP_LINK, GITHUB_LINK, INSTAGRAM_LINK } from "../data/content";

// Ícone WhatsApp SVG
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// Ícone GitHub SVG
function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

// Ícone Instagram SVG
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function Contact() {
  return (
    <section
      id="contato"
      className="relative overflow-hidden border-t border-hair px-5 py-24 text-center sm:px-8 sm:py-32 lg:px-16"
    >
      {/* Glow radial mais intenso */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-signal/20 blur-[80px]" />
      {/* Segundo glow de profundidade */}
      <div className="pointer-events-none absolute left-1/2 top-10 h-48 w-[24rem] -translate-x-1/2 rounded-full bg-signal/12 blur-[40px]" />

      <div className="relative mx-auto max-w-3xl">
        {/* Badge disponível acima do título */}
        <div
          data-reveal
          className="reveal mb-6 inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-4 py-1.5 backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse flex-shrink-0" />
          <span className="font-mono text-[11px] uppercase tracking-widest text-signal">
            Disponível para novos projetos
          </span>
        </div>

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

        {/* Botão WhatsApp com ícone + shimmer */}
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          data-reveal
          className="reveal btn-shimmer mt-9 inline-flex items-center justify-center gap-2.5 rounded-full bg-signal px-8 py-4 text-base font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(255,59,48,0.5)]"
        >
          <WhatsAppIcon />
          Conectar no WhatsApp
        </a>

        {/* Social links com ícones */}
        <div className="mt-10 flex items-center justify-center gap-6">
          <a
            href={GITHUB_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 font-mono text-sm text-mist transition-all duration-200 hover:text-paper"
          >
            <GitHubIcon />
            <span className="relative">
              GitHub
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-paper transition-all duration-300 group-hover:w-full" />
            </span>
          </a>
          <a
            href={INSTAGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 font-mono text-sm text-mist transition-all duration-200 hover:text-paper"
          >
            <InstagramIcon />
            <span className="relative">
              Instagram
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-paper transition-all duration-300 group-hover:w-full" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
