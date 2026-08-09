import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProjectCard from "./ProjectCard";

/**
 * ProjectsCarousel
 * ---------------------------------------------------------------------
 * Horizontal, snap-scrolling, drag-to-scroll carousel of project cards.
 * - Touch: native horizontal swipe (scroll-snap), no JS needed.
 * - Mouse/trackpad: click-and-drag to scroll (pointer events) + wheel.
 * - Arrow buttons: only rendered when there's more than one project,
 *   so today (1 project) it just renders a single static card, and the
 *   moment a second project is added the whole carousel/drag/arrows
 *   behavior turns on automatically — no code changes needed later.
 */
export default function ProjectsCarousel({ projects }) {
  const trackRef = useRef(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const draggedRef = useRef(false);

  const multiple = projects.length > 1;

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollPrev(el.scrollLeft > 8);
    setCanScrollNext(el.scrollLeft < maxScroll - 8);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, projects.length]);

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-carousel-card]");
    const amount = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.85;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  const onPointerDown = (e) => {
    if (!multiple) return;
    const el = trackRef.current;
    if (!el) return;
    isDragging.current = true;
    draggedRef.current = false;
    dragStartX.current = e.clientX;
    dragStartScroll.current = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    const el = trackRef.current;
    if (!el) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 4) draggedRef.current = true;
    el.scrollLeft = dragStartScroll.current - delta;
  };

  const endDrag = () => {
    isDragging.current = false;
  };

  // Prevent the click-through on a card immediately after a drag gesture.
  const onClickCapture = (e) => {
    if (draggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      draggedRef.current = false;
    }
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        className={`flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          multiple ? "cursor-grab active:cursor-grabbing" : ""
        }`}
      >
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            data-carousel-card
            className="w-[85vw] flex-none snap-start sm:w-[420px]"
          />
        ))}
      </div>

      {multiple && (
        <>
          <button
            type="button"
            aria-label="Projeto anterior"
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollPrev}
            className="absolute left-0 top-1/2 hidden -translate-x-4 -translate-y-1/2 rounded-full border border-hair bg-ink/80 p-2.5 text-paper backdrop-blur-sm transition-opacity disabled:opacity-0 sm:flex"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="Próximo projeto"
            onClick={() => scrollByCard(1)}
            disabled={!canScrollNext}
            className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-4 rounded-full border border-hair bg-ink/80 p-2.5 text-paper backdrop-blur-sm transition-opacity disabled:opacity-0 sm:flex"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </div>
  );
}
