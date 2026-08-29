import { useEffect, useState } from "react";

/**
 * useBadgeFace
 * ---------------------------------------------------------------------
 * Bakes a photo + a name label into a single canvas image and returns it
 * as a data URL, so it can be passed straight into <Lanyard frontImage=.
 * The Lanyard card model doesn't render text on its own — this is what
 * puts "JOHANNES" under the photo, like a real printed badge.
 *
 * The photo is drawn "contain" (never cropped/cover-filled) inside a
 * graphite frame with generous padding, so any white/light background in
 * the source photo itself never touches the card edges — the whole face
 * reads as dark/graphite even before the 3D scene's lighting hits it.
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

      // Card background — graphite, not pure black, to read as a deliberate
      // material rather than "no background", and to match the site's panel tone.
      ctx.fillStyle = "#161616";
      ctx.fillRect(0, 0, W, H);

      // Photo area: contain-fit inside a padded, rounded graphite frame so a
      // light/white source photo background never washes out the card.
      const padding = 36;
      const photoH = H * 0.74;
      const frameX = padding;
      const frameY = padding;
      const frameW = W - padding * 2;
      const frameH = photoH - padding;

      const frameRadius = 20;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(frameX + frameRadius, frameY);
      ctx.arcTo(frameX + frameW, frameY, frameX + frameW, frameY + frameH, frameRadius);
      ctx.arcTo(frameX + frameW, frameY + frameH, frameX, frameY + frameH, frameRadius);
      ctx.arcTo(frameX, frameY + frameH, frameX, frameY, frameRadius);
      ctx.arcTo(frameX, frameY, frameX + frameW, frameY, frameRadius);
      ctx.closePath();
      ctx.fillStyle = "#0d0d0d";
      ctx.fill();
      ctx.clip();

      const scale = Math.min(frameW / img.width, frameH / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = frameX + (frameW - dw) / 2;
      const dy = frameY + (frameH - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();

      // Thin red accent line separating photo from name plate
      ctx.fillStyle = "#ff3b30";
      ctx.fillRect(0, photoH, W, 6);

      // Name plate — first name only, uppercase, bold
      ctx.fillStyle = "#111111";
      ctx.fillRect(0, photoH + 6, W, H - photoH - 6);
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "800 64px Arial, sans-serif";
      ctx.fillText(name.toUpperCase(), W / 2, photoH + (H - photoH) / 2);

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
