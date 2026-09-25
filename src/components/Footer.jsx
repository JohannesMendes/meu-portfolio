import MusicPlayer from "./MusicPlayer";

export default function Footer() {
  return (
    <footer className="relative border-t border-hair">
      {/* Gradiente de fade do topo — une visualmente com a seção de contato */}
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-signal/30 to-transparent" />

      <div className="flex flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-mist sm:flex-row sm:px-8 lg:px-16">
        <div className="flex items-center gap-2">
          <span className="font-display font-extrabold tracking-tight text-paper/60">
            JO<span className="text-signal/60">_ENG</span>
          </span>
          <span className="text-mist/40">·</span>
          <span>© 2026 Johannes Mendes. Todos os direitos reservados.</span>
        </div>

        <MusicPlayer />

        <a
          href="/admin.html"
          className="text-mist/40 transition-colors hover:text-mist"
          aria-label="Painel administrativo"
          title="Painel administrativo"
        >
          Admin
        </a>
      </div>
    </footer>
  );
}
