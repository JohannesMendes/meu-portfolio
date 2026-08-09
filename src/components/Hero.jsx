import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { WHATSAPP_LINK } from "../data/content";

/**
 * Hero
 * ---------------------------------------------------------------------
 * Video-exclusive "scroll expansion" hero. The video is the primary
 * element (autoplay/loop/muted background), and scrolling drives a
 * subtle zoom on the video while the headline/CTA content fades and
 * lifts out of the way — the animation lives ONLY on the video, not on
 * the profile photo (that one is a static image in the About section).
 *
 * Two reliability fixes vs. the previous version:
 *
 * 1. The "black gap" people were seeing after the video was really the
 *    video failing to autoplay, not a layout hole. React's `muted`
 *    JSX attribute doesn't reliably set the underlying DOM property on
 *    every browser — and unmuted autoplay is blocked by browsers, so
 *    the video silently never started, leaving a black frame for the
 *    whole scroll-pinned duration. Fixed by setting `.muted = true`
 *    imperatively via a ref and explicitly calling `.play()`.
 * 2. The scroll-pinned "dead zone" (extra scroll distance while the
 *    video is pinned) was 70vh (170vh wrapper - 100vh viewport). Cut
 *    down to a shorter, less noticeable distance, especially on
 *    mobile, so the pin-and-zoom reads as a quick effect rather than a
 *    long empty scroll.
 *
 * Progress is derived from this section's own scroll position via a
 * tall wrapper + `position: sticky` panel (no global wheel/touch
 * hijacking, no `preventDefault` — safe on mobile, doesn't fight the
 * rest of the page's scroll).
 *
 * Z-index map (all within this section's own stacking context, so it
 * can never bleed into or get blocked by sibling sections):
 *   z-0  -> video
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
        // Autoplay blocked (rare with muted video) — retry once on first
        // user interaction, which browsers always allow.
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

    computeProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const videoScale = 1 + progress * 0.16;
  const contentOpacity = Math.max(0, 1 - progress * 1.6);
  const contentShift = progress * 40;

  return (
    <div
      ref={wrapperRef}
      id="top"
      className="relative w-full"
      style={{ height: isMobile ? "105vh" : "112vh" }}
    >
      <section className="sticky top-0 flex h-[100dvh] w-full flex-col justify-center overflow-hidden px-6 pt-28 pb-16 sm:px-8 sm:pt-32 lg:px-16 lg:pt-28">
        {/* z-0: video, exclusive owner of the scroll-expansion animation */}
        <motion.video
          ref={videoRef}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          style={{ scale: videoScale, transformOrigin: "center center" }}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/video.mp4" type="video/mp4" />
        </motion.video>

        {/* z-10: overlay + texture, purely decorative, pointer-events none */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(110deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.6) 45%, rgba(10,10,10,0.3) 100%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 z-10 grid-texture opacity-40" />

        {/* z-20: hero copy */}
        <motion.div
          className="relative z-20 mx-auto flex w-full max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10"
          style={{ opacity: contentOpacity, y: -contentShift }}
        >
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-paper backdrop-blur-sm sm:text-sm">
              Engenharia de Software &amp; Design Inteligente
            </span>

            <h1 className="mt-6 font-display text-[clamp(2.4rem,8vw,5.25rem)] font-bold leading-[1.05] tracking-tight text-paper text-balance">
              Experiências digitais
              <br />
              em movimento fluido<span className="text-signal">.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
              Transformando espaços digitais com arquiteturas full-stack robustas e
              experiências visuais em tempo real que geram engajamento e performance
              estável.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9 sm:gap-4">
              <a
                href="#projetos"
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
          </div>

          {/* Signature element: terminal card */}
          <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-ink/60 font-mono text-xs shadow-2xl backdrop-blur-md sm:text-sm">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-5 py-3 sm:px-4">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="ml-2 text-white/40">whoami.sh</span>
            </div>
            <div className="space-y-1.5 px-5 py-4 text-white/70 sm:px-4">
              <p className="break-words">
                <span className="text-signal">$</span> whoami
              </p>
              <p className="break-words text-white/90">Johannes Mendes — Software Engineer</p>
              <p className="mt-3 break-words">
                <span className="text-signal">$</span> stack --core
              </p>
              <p className="break-words text-white/90">React · Python · FastAPI · Flutter</p>
              <p className="mt-3 break-words">
                <span className="text-signal">$</span> status
                <span className="caret">&nbsp;</span>
              </p>
            </div>
          </div>
        </motion.div>

        <motion.a
          href="#servicos"
          className="pointer-events-auto relative z-20 mx-auto mt-14 font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white/80 transition-colors sm:mt-16"
          style={{ opacity: contentOpacity }}
        >
          ↓ Rolar para explorar
        </motion.a>
      </section>
    </div>
  );
}
