import { useEffect, useState } from "react";

/**
 * useBadgeFace
 * ---------------------------------------------------------------------
 * Bakes a photo + a name label into a single canvas image and returns it
 * as a data URL, so it can be passed straight into <Lanyard frontImage=.
 * The Lanyard card model doesn't render text on its own — this is what
 * puts "Johannes Mendes" under the photo, like a real printed badge.
 */
export function useBadgeFace(photoSrc, name) {
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;

      const W = 768;
      const H = 960;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");

      // Card background (dark, matches the site so any edge bleed blends in)
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, W, H);

      // Photo fills the top ~78% of the badge, cover-fit
      const photoH = H * 0.78;
      const scale = Math.max(W / img.width, photoH / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = (W - dw) / 2;
      const dy = (photoH - dh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, W, photoH);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();

      // Thin red accent line separating photo from name plate
      ctx.fillStyle = "#ff3b30";
      ctx.fillRect(0, photoH, W, 6);

      // Name plate
      ctx.fillStyle = "#111111";
      ctx.fillRect(0, photoH + 6, W, H - photoH - 6);
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "700 52px Arial, sans-serif";
      ctx.fillText(name, W / 2, photoH + (H - photoH) / 2);

      setDataUrl(canvas.toDataURL("image/png"));
    };
    img.onerror = () => setDataUrl(null);
    img.src = photoSrc;

    return () => {
      cancelled = true;
    };
  }, [photoSrc, name]);

  return dataUrl;
}
