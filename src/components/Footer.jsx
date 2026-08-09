export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-3 border-t border-hair px-5 py-8 text-sm text-mist sm:flex-row sm:px-8 lg:px-16">
      <div>© 2026 Johannes Mendes. Todos os direitos reservados.</div>
      <a
        href="/admin.html"
        className="text-mist/50 hover:text-mist"
        aria-label="Painel administrativo"
        title="Painel administrativo"
      >
        Admin
      </a>
    </footer>
  );
}
