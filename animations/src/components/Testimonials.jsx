import { useEffect, useState } from "react";
import { DEFAULT_TESTIMONIALS, TESTIMONIALS_STORAGE_KEY } from "../data/content";

export default function Testimonials() {
  // Starts with the static defaults so they render immediately for
  // every visitor, on every browser/device — no localStorage needed.
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(TESTIMONIALS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed) || parsed.length === 0) return;

      // Merge: keep defaults, add any locally-saved ones (from a visit
      // to /admin.html on this same browser) that aren't already
      // present by id, so nothing is duplicated or lost.
      const knownIds = new Set(DEFAULT_TESTIMONIALS.map((t) => t.id));
      const extra = parsed.filter((t) => t && t.id && !knownIds.has(t.id));
      if (extra.length > 0) {
        setTestimonials([...DEFAULT_TESTIMONIALS, ...extra]);
      }
    } catch {
      // Keep defaults on any parse error.
    }
  }, []);

  return (
    <section id="depoimentos" className="px-5 py-24 sm:px-8 sm:py-32 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <h2
          data-reveal
          className="reveal font-display text-[clamp(2rem,5vw,3.25rem)] font-extrabold tracking-tight text-paper"
        >
          Depoimentos
        </h2>

        {testimonials.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {testimonials.map((t) => (
              <blockquote
                key={t.id}
                data-reveal
                className="reveal rounded-2xl border border-hair bg-panel p-7"
              >
                <p className="text-base leading-relaxed text-white/85">"{t.quote}"</p>
                <footer className="mt-4 text-sm text-mist">
                  <span className="font-medium text-paper">{t.author}</span>
                  {t.role ? <span> — {t.role}</span> : null}
                </footer>
              </blockquote>
            ))}
          </div>
        ) : (
          <p data-reveal className="reveal mt-12 text-mist">
            Novos depoimentos em breve.
          </p>
        )}
      </div>
    </section>
  );
}
