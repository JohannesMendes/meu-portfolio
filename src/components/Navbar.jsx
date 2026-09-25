import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, WHATSAPP_LINK } from "../data/content";

function NavLink({ link, className, onClick }) {
  if (link.isRoute) {
    return (
      <Link to={link.href} className={className} onClick={onClick}>
        {link.label}
      </Link>
    );
  }
  return (
    <a href={link.href} className={className} onClick={onClick}>
      {link.label}
    </a>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-ink/90 backdrop-blur-xl border-b border-hair shadow-[0_1px_0_rgba(255,255,255,0.04)]"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto max-w-7xl flex items-center justify-between px-5 sm:px-8 h-16 sm:h-20">
          {/* Logo + available badge */}
          <Link
            to="/"
            className="group flex items-center gap-3 font-display font-extrabold text-lg sm:text-xl tracking-tight text-paper"
          >
            <span className="transition-colors group-hover:text-signal duration-200">
              JO<span className="text-signal">_ENG</span>
            </span>

          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-8 font-mono text-sm text-mist">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="relative group/nav">
                <NavLink
                  link={link}
                  className="relative py-1 transition-colors duration-200 hover:text-paper"
                />
                {/* Underline deslizante */}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-signal transition-all duration-300 group-hover/nav:w-full" />
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 rounded-full border border-signal/50 bg-signal/10 px-5 py-2 text-sm font-semibold text-signal transition-all duration-200 hover:bg-signal hover:text-ink hover:border-signal hover:shadow-[0_0_20px_rgba(255,59,48,0.3)]"
          >
            Contato
          </a>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-hair text-paper transition-colors hover:border-signal/50 hover:text-signal"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </header>

      {/* Mobile fullscreen menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden bg-ink/98 backdrop-blur-xl transition-all duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
          {/* Badge disponível no mobile menu */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-widest text-emerald-400">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
            Disponível para projetos
          </span>

          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              link={link}
              onClick={() => setOpen(false)}
              className="font-display text-3xl font-bold text-paper transition-colors hover:text-signal"
            />
          ))}

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-signal px-8 py-3.5 text-base font-semibold text-ink transition-all hover:shadow-[0_0_24px_rgba(255,59,48,0.4)] btn-shimmer"
          >
            Contato
          </a>
        </div>
      </div>
    </>
  );
}
