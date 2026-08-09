import { useEffect, useRef } from "react";

/**
 * GlobalClickSpark
 * ---------------------------------------------------------------------
 * Ported from the original vanilla `animations/click-spark.js` used on
 * the previous version of the site. Same visual behavior: a full-page,
 * click-through canvas draws small spark lines radiating from every
 * click anywhere on the page. Restored 1:1 as a React effect so it
 * mounts once (in App.jsx) instead of via a <script> tag.
 */
const DEFAULT_OPTIONS = {
  sparkColor: "#ff3b30", // brand red, was #fff in the original
  sparkSize: 10,
  sparkRadius: 15,
  sparkCount: 8,
  duration: 400,
  easing: "ease-out",
  extraScale: 1.0,
};

function ease(t, easing) {
  switch (easing) {
    case "linear":
      return t;
    case "ease-in":
      return t * t;
    case "ease-in-out":
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    default:
      return t * (2 - t);
  }
}

export default function GlobalClickSpark(options = {}) {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const rafRef = useRef(0);
  const opts = { ...DEFAULT_OPTIONS, ...options };

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.userSelect = "none";
    canvas.style.zIndex = "9999";
    document.body.appendChild(canvas);
    canvasRef.current = canvas;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    let resizeTimeout;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 100);
    };

    const onClick = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      const now = performance.now();
      const newSparks = Array.from({ length: opts.sparkCount }, (_, i) => ({
        x,
        y,
        angle: (2 * Math.PI * i) / opts.sparkCount,
        startTime: now,
      }));
      sparksRef.current.push(...newSparks);
    };

    const draw = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= opts.duration) return false;

        const progress = elapsed / opts.duration;
        const eased = ease(progress, opts.easing);
        const distance = eased * opts.sparkRadius * opts.extraScale;
        const lineLength = opts.sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = opts.sparkColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        return true;
      });
      rafRef.current = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("click", onClick);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("click", onClick);
      canvas.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
