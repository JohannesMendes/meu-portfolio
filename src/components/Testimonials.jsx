import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db, firebaseReady } from "../lib/firebase";
import { DEFAULT_TESTIMONIALS, TESTIMONIALS_STORAGE_KEY } from "../data/content";

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function TestimonialCard({ testimonial }) {
  const rating = Number.isFinite(testimonial.rating)
    ? Math.min(5, Math.max(1, testimonial.rating))
    : 5;

  return (
    <blockquote className="mx-3 flex h-full w-[320px] shrink-0 flex-col rounded-2xl border border-hair bg-panel p-7 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-signal/30 hover:shadow-[0_8px_32px_rgba(255,59,48,0.1)] hover:-translate-y-1 sm:w-[360px]">
      <div className="mb-4 flex items-center gap-3">
        {testimonial.photo ? (
          <img
            src={testimonial.photo}
            alt={testimonial.author}
            className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-signal/30 ring-offset-1 ring-offset-panel"
          />
        ) : (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-signal/15 ring-2 ring-signal/30 ring-offset-1 ring-offset-panel font-display text-sm font-bold text-signal">
            {initials(testimonial.author)}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold text-paper">{testimonial.author}</p>
          {testimonial.role ? (
            <p className="truncate text-sm text-mist">{testimonial.role}</p>
          ) : null}
        </div>
      </div>

      {/* Stars */}
      <div className="mb-4 flex gap-1">
        {Array.from({ length: rating }).map((_, i) => (
          <Star
            key={i}
            size={14}
            style={{ fill: "var(--color-signal)", color: "var(--color-signal)" }}
          />
        ))}
      </div>

      <p className="flex-1 text-base leading-relaxed text-white/85">
        "{testimonial.quote}"
      </p>
    </blockquote>
  );
}

export default function Testimonials() {
  // Starts with the static defaults so they render immediately for
  // every visitor, on every browser/device — no network round trip
  // needed for these.
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);

  useEffect(() => {
    // Firebase configured: subscribe to the shared "testimonials"
    // collection in Firestore. Every visitor who submits one via
    // /enviar-depoimento shows up here live, for every other visitor —
    // no admin approval step, no per-browser storage.
    if (firebaseReady && db) {
      const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const live = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setTestimonials([...DEFAULT_TESTIMONIALS, ...live]);
        },
        () => {
          // On any read error, keep showing the static defaults.
          setTestimonials(DEFAULT_TESTIMONIALS);
        }
      );
      return unsubscribe;
    }

    // Firebase not configured yet: fall back to the old behavior, where
    // /admin.html writes to this browser's localStorage only.
    try {
      const raw = localStorage.getItem(TESTIMONIALS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed) || parsed.length === 0) return;

      const knownIds = new Set(DEFAULT_TESTIMONIALS.map((t) => t.id));
      const extra = parsed.filter((t) => t && t.id && !knownIds.has(t.id));
      if (extra.length > 0) {
        setTestimonials([...DEFAULT_TESTIMONIALS, ...extra]);
      }
    } catch {
      // Keep defaults on any parse error.
    }
  }, []);

  // The CSS marquee track expects exactly two back-to-back copies of the
  // content so it can loop seamlessly by translating -50%. With very few
  // testimonials, repeat the set a couple of extra times so the row still
  // feels full instead of looking sparse.
  const minCards = 6;
  const repeatCount = Math.max(1, Math.ceil(minCards / Math.max(testimonials.length, 1)));
  const loopSet = Array.from({ length: repeatCount }).flatMap(() => testimonials);

  return (
    <section id="depoimentos" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16">
        <h2
          data-reveal
          className="reveal font-display text-[clamp(2rem,5vw,3.25rem)] font-extrabold tracking-tight text-paper"
        >
          Depoimentos
        </h2>
        <p data-reveal className="reveal mt-3 text-sm text-mist">
          Já trabalhou comigo?{" "}
          <Link
            to="/enviar-depoimento"
            className="font-medium text-paper underline underline-offset-4 transition-colors hover:text-signal"
          >
            Deixe seu depoimento aqui
          </Link>
          .
        </p>
      </div>

      {testimonials.length > 0 ? (
        <div
          data-reveal
          className="reveal group mt-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
        >
          <div className="testimonials-marquee-track flex w-max py-2 group-hover:[animation-play-state:paused]">
            {loopSet.map((t, i) => (
              <TestimonialCard key={`${t.id}-${i}`} testimonial={t} />
            ))}
            {loopSet.map((t, i) => (
              <TestimonialCard key={`${t.id}-dup-${i}`} testimonial={t} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16">
          <p data-reveal className="reveal mt-12 text-mist">
            Novos depoimentos em breve.
          </p>
        </div>
      )}
    </section>
  );
}
