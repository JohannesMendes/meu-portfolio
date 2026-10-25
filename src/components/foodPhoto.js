// Foto ilustrativa do prato (arroz, feijão e frango grelhado) gerada em SVG.
// Troque por um print/foto real do app quando tiver — é só substituir o
// <div className="ph-photo"> em PhoneDemo.jsx por uma <img>.

function rng(seed) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function inEllipse(r, cx, cy, rx, ry) {
  const a = r() * 6.283;
  const d = Math.sqrt(r());
  return [cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d];
}

export function buildFoodSvg() {
  const r = rng(7);
  let s =
    '<svg viewBox="0 0 300 190" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Foto de um prato com arroz, feijão e frango grelhado">';
  s +=
    '<defs><linearGradient id="fp-wd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5a35"/><stop offset="1" stop-color="#5a3a22"/></linearGradient>' +
    '<filter id="fp-wf" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.006 0.28" numOctaves="3" seed="4"/><feColorMatrix values="0 0 0 0 0.16 0 0 0 0 0.08 0 0 0 0 0.03 1.3 0 0 0 -0.25"/></filter>' +
    '<filter id="fp-bl"><feGaussianBlur stdDeviation="5"/></filter><filter id="fp-bl2"><feGaussianBlur stdDeviation="1.6"/></filter>' +
    '<radialGradient id="fp-pl" cx="0.4" cy="0.35" r="0.8"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d3d3ce"/></radialGradient>' +
    '<radialGradient id="fp-pw" cx="0.45" cy="0.4" r="0.75"><stop offset="0" stop-color="#f7f7f4"/><stop offset="1" stop-color="#c4c4be"/></radialGradient>' +
    '<radialGradient id="fp-rc" cx="0.4" cy="0.35" r="0.8"><stop offset="0" stop-color="#fbf8ec"/><stop offset="1" stop-color="#cfc7ab"/></radialGradient>' +
    '<linearGradient id="fp-ck" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9a05d"/><stop offset="1" stop-color="#8d5527"/></linearGradient>' +
    '<radialGradient id="fp-vg" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/></radialGradient>' +
    '<radialGradient id="fp-lt" cx="0.2" cy="0.1" r="0.7"><stop offset="0" stop-color="#fff" stop-opacity="0.28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
    '<clipPath id="fp-cc"><ellipse cx="178" cy="68" rx="27" ry="15" transform="rotate(-18 178 68)"/><ellipse cx="207" cy="77" rx="23" ry="13" transform="rotate(14 207 77)"/></clipPath></defs>';

  // mesa de madeira
  s += '<rect width="300" height="190" fill="url(#fp-wd)"/><rect width="300" height="190" filter="url(#fp-wf)" opacity="0.7"/>';
  // prato
  s += '<ellipse cx="158" cy="116" rx="128" ry="80" fill="#000" opacity="0.55" filter="url(#fp-bl)"/>';
  s +=
    '<ellipse cx="150" cy="100" rx="128" ry="82" fill="url(#fp-pl)"/><ellipse cx="150" cy="99" rx="112" ry="70" fill="url(#fp-pw)"/><ellipse cx="150" cy="100" rx="128" ry="82" fill="none" stroke="#fff" stroke-opacity="0.6" stroke-width="1"/>';

  // arroz
  s += '<ellipse cx="114" cy="110" rx="42" ry="28" fill="#000" opacity="0.28" filter="url(#fp-bl2)"/><ellipse cx="108" cy="98" rx="41" ry="29" fill="url(#fp-rc)"/>';
  for (let i = 0; i < 120; i++) {
    const p = inEllipse(r, 108, 98, 38, 26);
    const a = (r() * 180) | 0;
    const x = p[0].toFixed(1);
    const y = p[1].toFixed(1);
    s += `<ellipse cx="${x}" cy="${y}" rx="3.3" ry="1.25" transform="rotate(${a} ${x} ${y})" fill="#fffdf6" stroke="#cfc6aa" stroke-width="0.3"/>`;
  }

  // feijão
  s += '<ellipse cx="200" cy="124" rx="38" ry="21" fill="#000" opacity="0.3" filter="url(#fp-bl2)"/><ellipse cx="198" cy="116" rx="38" ry="21" fill="#2a130a"/>';
  for (let i = 0; i < 30; i++) {
    const p = inEllipse(r, 198, 116, 33, 16);
    const b = (r() * 180) | 0;
    const x = p[0].toFixed(1);
    const y = p[1].toFixed(1);
    s += `<ellipse cx="${x}" cy="${y}" rx="4.8" ry="3.1" transform="rotate(${b} ${x} ${y})" fill="#5a3418"/><ellipse cx="${(p[0] - 1.2).toFixed(1)}" cy="${(p[1] - 1).toFixed(1)}" rx="1.7" ry="0.8" fill="#c39a72" opacity="0.55"/>`;
  }

  // frango grelhado
  s += '<ellipse cx="180" cy="80" rx="48" ry="22" fill="#000" opacity="0.3" filter="url(#fp-bl2)"/>';
  s +=
    '<ellipse cx="178" cy="68" rx="27" ry="15" transform="rotate(-18 178 68)" fill="url(#fp-ck)"/><ellipse cx="207" cy="77" rx="23" ry="13" transform="rotate(14 207 77)" fill="url(#fp-ck)"/>';
  s += '<g clip-path="url(#fp-cc)" stroke="#3d200f" stroke-width="2.3" stroke-linecap="round" opacity="0.7">';
  for (let i = 0; i < 7; i++) {
    s += `<line x1="${150 + i * 12}" y1="48" x2="${130 + i * 12}" y2="96"/>`;
  }
  s += '</g><ellipse cx="172" cy="62" rx="12" ry="3.5" fill="#fff" opacity="0.28"/><ellipse cx="204" cy="72" rx="10" ry="3" fill="#fff" opacity="0.25"/>';
  for (let i = 0; i < 16; i++) {
    const p = inEllipse(r, 190, 70, 38, 16);
    const x = p[0].toFixed(1);
    const y = p[1].toFixed(1);
    s += `<rect x="${x}" y="${y}" width="2.6" height="1.6" rx="0.6" fill="#3f8f3a" transform="rotate(${(r() * 180) | 0} ${x} ${y})"/>`;
  }

  // luz e vinheta
  s += '<rect width="300" height="190" fill="url(#fp-lt)"/><rect width="300" height="190" fill="url(#fp-vg)"/></svg>';
  return s;
}
