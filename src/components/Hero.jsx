import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { WHATSAPP_LINK } from "../data/content";

// Smooth scroll for same-page anchor links, done per-click instead of via
// global CSS `scroll-behavior: smooth` (which was fighting the Hero's own
// scroll-linked animation and causing stutter on mobile).
function smoothScrollTo(e, hash) {
  const el = document.querySelector(hash);
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: "smooth" });
}

/**
 * Hero
 * ---------------------------------------------------------------------
 * Scroll-expansion hero: the video starts as a modest, well-proportioned
 * card (so it doesn't dominate the headline, especially on mobile) and
 * grows to fill the screen as the user scrolls, while the copy fades
 * and lifts out of the way.
 *
 * Progress is derived from this section's own scroll position via a
 * tall wrapper + `position: sticky` panel — no global wheel/touch
 * hijacking, no `preventDefault`. That keeps the browser's native
 * scroll (and its momentum/inertia on mobile) completely intact.
 *
 * Mobile-jank fix: the wrapper height and the sticky panel height must
 * both use the SAME viewport unit. Mixing `vh` (static) with `dvh`
 * (dynamic, accounts for the address bar hiding/showing) causes the
 * two measurements to drift apart mid-scroll on phones, which is what
 * produced the "stutter, have to scroll up then down again" symptom.
 * Both now use `dvh`. On top of that, mobile browsers fire a `resize`
 * event purely because the address bar collapsed (no width change) —
 * recomputing progress on every one of those was adding extra jitter,
 * so resize now only triggers a recompute when the width actually
 * changes (real orientation/layout change).
 *
 * Z-index map (all within this section's own stacking context):
 *   z-0  -> video card (grows from a small rounded box to full-bleed)
 *   z-10 -> gradient overlay + grid texture
 *   z-20 -> hero copy (badge, heading, paragraph, buttons, terminal card)
 */
export default function Hero() {
  const wrapperRef = useRef(null);
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Reliability fix: force-mute + explicitly play. Browsers only allow
  // autoplay when the element is truly muted at the DOM level; React's
  // `muted` attribute alone doesn't always stick.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        const retry = () => {
          video.play().catch(() => {});
          window.removeEventListener("pointerdown", retry);
        };
        window.addEventListener("pointerdown", retry, { once: true });
      });
    }
  }, []);

  useEffect(() => {
    let raf = 0;
    let lastWidth = window.innerWidth;

    const computeProgress = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const total = rect.height - viewportH;
      if (total <= 0) {
        setProgress(0);
        return;
      }
      const scrolled = -rect.top;
      const next = Math.min(Math.max(scrolled / total, 0), 1);
      setProgress(next);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(computeProgress);
    };

    // Ignore address-bar-driven resize events (height-only changes on
    // mobile while scrolling); only recompute on real width changes.
    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(computeProgress);
    };

    computeProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Video card: starts small and centered (so it reads as proportionate
  // next to the headline instead of overwhelming it), expands to a
  // full-bleed background as the user scrolls through the section.
  const startWidthVw = isMobile ? 84 : 58;
  const startHeightVh = isMobile ? 38 : 54;
  const videoWidth = startWidthVw + progress * (100 - startWidthVw);
  const videoHeight = startHeightVh + progress * (100 - startHeightVh);
  const videoRadius = 28 * (1 - progress);

  const contentOpacity = Math.max(0, 1 - progress * 1.6);
  const contentShift = progress * 40;

  return (
    <div
      ref={wrapperRef}
      id="top"
      className="relative w-full"
      style={{ height: isMobile ? "150dvh" : "160dvh" }}
    >
      <section className="sticky top-0 flex h-[100dvh] w-full flex-col justify-center overflow-hidden px-6 pt-28 pb-16 sm:px-8 sm:pt-32 lg:px-16 lg:pt-28">
        {/* z-0: video card, exclusive owner of the scroll-expansion animation */}
        <div
          className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-ink"
          style={{
            width: `${videoWidth}vw`,
            height: `${videoHeight}dvh`,
            maxWidth: "100vw",
            maxHeight: "100dvh",
            borderRadius: `${videoRadius}px`,
            boxShadow:
              progress < 0.96 ? "0px 30px 80px rgba(0, 0, 0, 0.45)" : "none",
            transition: "border-radius 0.05s linear",
          }}
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          >
            <source src="/video.mp4" type="video/mp4" />
          </video>
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(110deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.6) 45%, rgba(10,10,10,0.3) 100%)",
              opacity: Math.max(0.3, 1 - progress),
            }}
          />
        </div>

        {/* z-10: texture, purely decorative, pointer-events none */}
        <div
          className="pointer-events-none absolute inset-0 z-10 grid-texture"
          style={{ opacity: 0.4 * (1 - progress) }}
        />

        {/* z-20: hero copy */}
        <motion.div
          className="relative z-20 mx-auto flex w-full max-w-4xl flex-col"
          style={{ opacity: contentOpacity, y: -contentShift }}
        >
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-paper backdrop-blur-sm sm:text-xs">
            Engenharia de Software &amp; Design Inteligente
          </span>

          <h1 className="mt-6 font-display text-[clamp(2.1rem,6.2vw,4rem)] font-bold leading-[1.08] tracking-tight text-paper text-balance">
            Experiências digitais
            <br />
            em movimento fluido<span className="text-signal">.</span>
          </h1>

          <p className="mt-5 max-w-lg text-[clamp(0.95rem,1.6vw,1.125rem)] leading-relaxed text-white/80">
            Transformando espaços digitais com arquiteturas full-stack robustas e
            experiências visuais em tempo real que geram engajamento e performance
            estável.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9 sm:gap-4">
            <a
              href="#projetos"
              onClick={(e) => smoothScrollTo(e, "#projetos")}
              className="inline-flex items-center justify-center rounded-full bg-paper px-7 py-3.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5 sm:text-base"
            >
              Ver Portfólio
            </a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-7 py-3.5 text-sm font-medium text-paper backdrop-blur-sm transition-colors hover:border-white/60 hover:bg-white/15 sm:text-base"
            >
              Iniciar Parceria
            </a>
          </div>
        </motion.div>

        <motion.a
          href="#servicos"
          onClick={(e) => smoothScrollTo(e, "#servicos")}
          className="pointer-events-auto relative z-20 mx-auto mt-14 font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white/80 transition-colors sm:mt-16"
          style={{ opacity: contentOpacity }}
        >
          ↓ Rolar para explorar
        </motion.a>
      </section>
    </div>
  );
}
