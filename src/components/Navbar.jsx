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
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
          scrolled ? "bg-ink/85 backdrop-blur-md border-b border-hair" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto max-w-7xl flex items-center justify-between px-5 sm:px-8 h-16 sm:h-20">
          <Link to="/" className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-paper">
            JO<span className="text-signal">_ENG</span>
          </Link>

          <ul className="hidden md:flex items-center gap-8 font-mono text-sm text-mist">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink link={link} className="hover:text-paper transition-colors" />
              </li>
            ))}
          </ul>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center rounded-full border border-hair px-5 py-2 text-sm font-medium text-paper hover:border-signal hover:text-signal transition-colors"
          >
            Contato
          </a>

          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-hair text-paper"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-40 md:hidden bg-ink/98 backdrop-blur-lg transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              link={link}
              onClick={() => setOpen(false)}
              className="font-display text-3xl font-bold text-paper"
            />
          ))}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex items-center rounded-full bg-signal px-8 py-3 text-base font-semibold text-ink"
          >
            Contato
          </a>
        </div>
      </div>
    </>
  );
}
