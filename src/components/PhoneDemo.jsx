import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BatteryFull,
  CalendarDays,
  Camera,
  Coffee,
  CupSoda,
  Droplet,
  Mic,
  Plus,
  Settings,
  SignalHigh,
  Sparkles,
  User,
  Utensils,
  Wifi,
  X,
} from "lucide-react";
import { buildFoodSvg } from "./foodPhoto";
import "./PhoneDemo.css";

/* Cores do app (lib/theme/app_theme.dart) */
const GREEN = "#00BF63";
const GOLD = "#F2C078";
const RED = "#EF6F6C";
const BLUE = "#5DB8F0";
const GREY = "#9A9CA5";

const TYPED_TEXT = "3 ovos mexidos e 2 fatias de pão de forma";
const SCREENS = 4;

// Legendas que aparecem embaixo do celular, uma por momento do loop
const CAP = {
  home: "Tela inicial: o resumo do dia mostra quantas calorias você já consumiu e quantas ainda faltam.",
  water: "Registrar água é um toque: o copo entra na conta e a barra enche.",
  photo: "Scanner de prato: tire uma foto e a IA identifica o que está no prato.",
  analyzing: "A IA (Gemini) reconhece cada alimento e estima o peso e os macros.",
  review: "Você confere e corrige tudo antes de salvar, porque a IA pode errar.",
  save: "Tudo certo? Um toque e a refeição vai para o diário.",
  text: "Sem foto? Escreva (ou fale) o que comeu, do jeito que você falaria.",
  interpret: "A IA entende quantidades e medidas caseiras e monta a lista com calorias e macros.",
  textDone: "Pronto: o total da refeição já está calculado, é só confirmar e salvar.",
  goals: "Metas sob medida: calorias, proteína, carboidrato, gordura e água para o seu objetivo.",
};
// legenda de cada tela quando o loop pausa (tela "completa")
const SETTLED = [CAP.water, CAP.review, CAP.textDone, CAP.goals];
const START_CAP = [CAP.home, CAP.photo, CAP.text, CAP.goals];

// [nome, g, kcal, P, C, G] — valores de exemplo
const PLATE = [
  ["Arroz branco", "90", "117", "2.3", "25.4", "0.2"],
  ["Frango grelhado", "110", "182", "34.1", "0.0", "4.0"],
  ["Feijão", "80", "62", "3.8", "11.2", "0.3"],
];
const EGGS = [
  ["Ovo mexido (3 un)", "150", "213", "13.5", "1.8", "16.2"],
  ["Pão de forma (2 fatias)", "50", "132", "4.4", "25.0", "1.6"],
];

/* ---------- pedaços de tela ---------- */

function Bar({ title, back, children }) {
  return (
    <div className={`ph-bar${back ? " back" : ""}`}>
      {back && (
        <span className="ph-ico">
          <ArrowLeft size={24} />
        </span>
      )}
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function Spinner({ text }) {
  return (
    <div className="ph-spin">
      <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="16" fill="none" stroke={GREEN} strokeWidth="4" strokeLinecap="round" strokeDasharray="70 40" />
      </svg>
      <div style={{ color: GREY, fontSize: 14, marginTop: 16 }}>{text}</div>
    </div>
  );
}

function Field({ label, value, flex = 1 }) {
  return (
    <div className="ph-fl" style={{ flex }}>
      <small>{label}</small>
      <span>{value}</span>
    </div>
  );
}

function Review({ items }) {
  const total = (i) => items.reduce((a, x) => a + parseFloat(x[i]), 0);
  const Cell = ({ v, l }) => (
    <div style={{ flex: 1, textAlign: "center" }}>
      <div style={{ fontSize: 16, fontWeight: 700 }}>{v}</div>
      <div style={{ fontSize: 11, color: GREY }}>{l}</div>
    </div>
  );
  return (
    <>
      <div style={{ color: GREY, fontWeight: 600, fontSize: 14 }}>Confira e corrija antes de salvar:</div>
      <div style={{ color: GREY, fontSize: 12, margin: "4px 0 12px" }}>
        A IA pode errar — ajuste nome, peso ou macros, remova o que estiver errado ou adicione o que ela esqueceu.
      </div>
      {items.map((x) => (
        <div key={x[0]} className="ph-cd" style={{ padding: 12, marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <Field label="Alimento" value={x[0]} flex={3} />
            <Field label="g" value={x[1]} flex={1.1} />
            <span style={{ width: 28, textAlign: "center", color: GREY }}>
              <X size={20} />
            </span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Field label="kcal" value={x[2]} />
            <Field label="P (g)" value={x[3]} />
            <Field label="C (g)" value={x[4]} />
            <Field label="G (g)" value={x[5]} />
          </div>
        </div>
      ))}
      <div className="ph-ol" style={{ margin: "6px 0 16px" }}>
        <Plus size={18} />
        Adicionar item que a IA esqueceu
      </div>
      <div className="ph-cd" style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Total da refeição ({items.length} itens)</div>
        <div style={{ display: "flex" }}>
          <Cell v={Math.round(total(2))} l="kcal" />
          <Cell v={`${total(3).toFixed(1)}g`} l="proteína" />
          <Cell v={`${total(4).toFixed(1)}g`} l="carbo" />
          <Cell v={`${total(5).toFixed(1)}g`} l="gordura" />
          <Cell v={`${Math.round(total(1))}g`} l="peso" />
        </div>
      </div>
      <div className="ph-el" data-tap="confirm">Confirmar e salvar no diário</div>
      <div style={{ height: 12 }} />
    </>
  );
}

function MacroRow({ label, value, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "4px 0", fontSize: 14 }}>
      <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, marginRight: 10 }} />
      <span style={{ color: GREY }}>{label}</span>
      <span style={{ marginLeft: "auto", fontWeight: 600 }}>{value}</span>
    </div>
  );
}

/* rolagem suave e lenta (para o "vídeo" mostrar a tela inteira) */
function glide(el, dur, rafRef) {
  if (!el) return;
  cancelAnimationFrame(rafRef.current);
  const start = el.scrollTop;
  const end = el.scrollHeight - el.clientHeight;
  const t0 = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    el.scrollTop = start + (end - start) * e;
    if (p < 1) rafRef.current = requestAnimationFrame(step);
  };
  rafRef.current = requestAnimationFrame(step);
}

/* ---------- componente principal ---------- */

export default function PhoneDemo({ onInfo }) {
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  const [screen, setScreen] = useState(0);
  const [phase, setPhase] = useState(0); // 0 parado · 1 carregando · 2 resultado
  const [typed, setTyped] = useState(0);
  const [water, setWater] = useState(1000);
  const [cap, setCap] = useState(CAP.home);
  const [cursor, setCursor] = useState({ x: 210, y: 470, show: false });
  const [tapKey, setTapKey] = useState(0);
  const [paused, setPaused] = useState(!!reduced);
  const [visible, setVisible] = useState(false);

  const wrapRef = useRef(null);
  const screenRef = useRef(null);
  const bodyRef = useRef(null);
  const rafRef = useRef(0);
  const timers = useRef([]);
  const resumeRef = useRef(0);
  const curRef = useRef(0);
  const foodSvg = useMemo(() => buildFoodSvg(), []);

  const running = visible && !paused;

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    cancelAnimationFrame(rafRef.current);
  }, []);

  // só anima quando o celular está na tela
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => () => clearTimeout(resumeRef.current), []);

  // volta ao topo ao trocar de tela
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [screen]);

  // posiciona o cursor em cima de um elemento da tela do app
  const moveTo = useCallback((name) => {
    const scr = screenRef.current;
    const el = scr?.querySelector(`[data-tap="${name}"]`);
    if (!scr || !el) return;
    const sr = scr.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    const k = sr.width / scr.offsetWidth || 1; // compensa o zoom da seção
    setCursor({ x: (er.left - sr.left + er.width * 0.55) / k, y: (er.top - sr.top + er.height * 0.55) / k, show: true });
  }, []);
  const hideCursor = useCallback(() => setCursor((c) => ({ ...c, show: false })), []);
  const tap = useCallback(() => setTapKey((k) => k + 1), []);

  // o "vídeo" em loop: uma linha do tempo por tela
  const play = useCallback(
    (i) => {
      clearTimers();
      curRef.current = i;
      setScreen(i);
      setPhase(0);
      setTyped(0);
      setCap(START_CAP[i]);
      hideCursor();
      const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));
      const next = (i + 1) % SCREENS;
      const glide3 = (ms) => glide(bodyRef.current, ms, rafRef);

      if (i === 0) {
        at(2200, () => {
          moveTo("water300");
          setCap(CAP.water);
        });
        at(3400, () => {
          tap();
          setPhase(1);
          setWater((w) => Math.min(2500, w + 300));
        });
        at(6800, hideCursor);
        at(7400, () => play(next));
      } else if (i === 1) {
        at(1800, () => moveTo("retake"));
        at(2900, () => {
          tap();
          setPhase(1);
          setCap(CAP.analyzing);
        });
        at(5700, () => {
          setPhase(2);
          setCap(CAP.review);
          hideCursor();
        });
        at(7400, () => glide3(3800));
        at(11600, () => {
          moveTo("confirm");
          setCap(CAP.save);
        });
        at(12800, tap);
        at(14200, () => play(next));
      } else if (i === 2) {
        at(1600, () => moveTo("field"));
        at(2600, tap);
        for (let k = 1; k <= TYPED_TEXT.length; k++) at(2900 + k * 75, () => setTyped(k));
        const end = 2900 + TYPED_TEXT.length * 75;
        at(end + 500, () => {
          moveTo("interpret");
          setCap(CAP.interpret);
        });
        at(end + 1700, () => {
          tap();
          setPhase(1);
        });
        at(end + 3700, () => {
          setPhase(2);
          setCap(CAP.textDone);
          hideCursor();
        });
        at(end + 5200, () => glide3(3000));
        at(end + 9800, () => play(next));
      } else {
        at(2600, () => moveTo("continue"));
        at(3700, tap);
        at(4700, hideCursor);
        at(5300, () => play(next));
      }
    },
    [clearTimers, hideCursor, moveTo, tap],
  );

  // liga/desliga o loop conforme a seção está visível e não pausada
  useEffect(() => {
    if (running) play(curRef.current);
    else clearTimers();
    return clearTimers;
  }, [running, play, clearTimers]);

  // deixa a tela "completa" (sem ficar presa no carregando)
  const settle = useCallback(
    (i) => {
      clearTimers();
      curRef.current = i;
      setScreen(i);
      setPhase(i === 1 || i === 2 ? 2 : 0);
      setTyped(i === 2 ? TYPED_TEXT.length : 0);
      setCap(SETTLED[i]);
      hideCursor();
    },
    [clearTimers, hideCursor],
  );

  const pause = useCallback(() => {
    clearTimeout(resumeRef.current);
    if (paused) return;
    setPaused(true);
    settle(curRef.current);
  }, [paused, settle]);

  const resumeIn = useCallback(
    (ms) => {
      if (reduced) return;
      clearTimeout(resumeRef.current);
      resumeRef.current = setTimeout(() => {
        curRef.current = (curRef.current + 1) % SCREENS;
        setPaused(false);
      }, ms);
    },
    [reduced],
  );

  const pickDot = (n) => {
    clearTimeout(resumeRef.current);
    setPaused(true);
    settle(n);
    resumeIn(10000);
  };

  const pickRef = useRef(pickDot);
  pickRef.current = pickDot;
  const pick = useCallback((n) => pickRef.current(n), []);

  // avisa a seção (para mostrar a legenda ao lado do celular)
  useEffect(() => {
    onInfo?.({ screen, cap, pick });
  }, [screen, cap, pick, onInfo]);

  const addWater = (ml) => setWater((w) => Math.min(2500, w + ml));
  const textDone = screen === 2 && phase === 2;

  return (
    <div ref={wrapRef}>
      <div
        className="ph-stage"
        role="group"
        aria-label="Demonstração do aplicativo NutriSnap em um celular"
        onPointerEnter={(e) => e.pointerType === "mouse" && pause()}
        onPointerLeave={(e) => e.pointerType === "mouse" && resumeIn(1500)}
        onTouchStart={pause}
        onTouchEnd={() => resumeIn(8000)}
      >
        <div className="ph-shadow" />
        <span className="ph-btn" style={{ top: 128, height: 64 }} />
        <span className="ph-btn" style={{ top: 214, height: 40 }} />
        <div className="ph-frame">
          <div className="ph-bezel">
            <div className="ph-screen" ref={screenRef}>
              <div className="ph-app">
                <div className="ph-status">
                  <span>9:41</span>
                  <span>
                    <Wifi size={16} />
                    <SignalHigh size={16} />
                    <BatteryFull size={18} />
                  </span>
                </div>

                {screen === 0 && (
                  <>
                    <Bar title="Hoje">
                      <span className="ph-ico"><User size={24} /></span>
                      <span className="ph-ico"><Settings size={24} /></span>
                    </Bar>
                    <div className="ph-bd" ref={bodyRef}>
                      <div className="ph-cd">
                        <div style={{ fontSize: 16, fontWeight: 500 }}>Resumo do dia</div>
                        <div className="ph-pb" style={{ marginTop: 16 }}>
                          <i style={{ width: "59%", background: GREEN }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 14, color: GREY }}>
                          <span>1240 kcal consumidas</span>
                          <span>860 kcal restantes</span>
                        </div>
                      </div>
                      <div className="ph-cd">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 16, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                            <Droplet size={17} color={BLUE} fill={BLUE} />
                            Água
                          </span>
                          <span style={{ fontSize: 14, color: GREY }}>{water} / 2500 ml</span>
                        </div>
                        <div className="ph-pb" style={{ marginTop: 12 }}>
                          <i style={{ width: `${Math.min(100, water / 25)}%`, background: BLUE }} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 14 }}>
                          <button type="button" className="ph-wb" onClick={() => addWater(200)}>
                            <Coffee size={20} color={BLUE} />
                            +200ml
                          </button>
                          <button
                            type="button"
                            data-tap="water300"
                            key={`w300-${phase === 1 ? water : "x"}`}
                            className={`ph-wb${phase === 1 ? " tap" : ""}`}
                            onClick={() => addWater(300)}
                          >
                            <CupSoda size={20} color={BLUE} />
                            +300ml
                          </button>
                          <button type="button" className="ph-wb" onClick={() => addWater(500)}>
                            <Droplet size={20} color={BLUE} />
                            +500ml
                          </button>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <div className="ph-el" style={{ flex: 1, flexDirection: "column", gap: 6, padding: "14px 8px", fontSize: 13, textAlign: "center" }}>
                          <Utensils size={22} />
                          Diário de refeições
                        </div>
                        <div className="ph-ol" style={{ flex: 1, flexDirection: "column", gap: 6, padding: "14px 8px", fontSize: 13, borderRadius: 36 }}>
                          <CalendarDays size={22} />
                          Calendário
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {screen === 1 && (
                  <>
                    <Bar title="Scanner de prato (IA)" back />
                    <div className="ph-bd" ref={bodyRef}>
                      <div className="ph-photo" dangerouslySetInnerHTML={{ __html: foodSvg }} />
                      <div className="ph-el" data-tap="retake" style={{ margin: "16px 0 4px" }}>
                        <Camera size={22} />
                        Tirar outra foto
                      </div>
                      {phase === 1 && <Spinner text="Analisando o prato..." />}
                      {phase === 2 && (
                        <>
                          <div style={{ height: 16 }} />
                          <Review items={PLATE} />
                        </>
                      )}
                    </div>
                  </>
                )}

                {screen === 2 && (
                  <>
                    <Bar title="Adicionar por texto (IA)" back />
                    <div className="ph-bd" ref={bodyRef}>
                      <div data-tap="field" style={{ background: "#24262E", borderRadius: 14, padding: 16, fontSize: 16, display: "flex", alignItems: "flex-start", gap: 8, minHeight: 24 }}>
                        <div style={{ flex: 1, lineHeight: 1.4, minHeight: 22 }}>
                          {typed === 0 && phase === 0 && <span style={{ color: "#6f717a" }}>Ex: "4 fatias de pão de forma"</span>}
                          {TYPED_TEXT.slice(0, typed)}
                          {!textDone && typed > 0 && <span className="ph-caret">|</span>}
                        </div>
                        <Mic size={24} color={GREEN} />
                      </div>
                      <div className="ph-el" data-tap="interpret" style={{ marginTop: 12 }}>
                        <Sparkles size={22} />
                        {textDone ? "Interpretar novamente" : "Interpretar com IA"}
                      </div>
                      <div style={{ marginTop: 8 }}>
                        {phase === 1 && <Spinner text="Interpretando o texto..." />}
                        {textDone && (
                          <>
                            <div style={{ height: 12 }} />
                            <Review items={EGGS} />
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {screen === 3 && (
                  <>
                    <Bar title="Suas metas diárias" back />
                    <div className="ph-bd" ref={bodyRef}>
                      <div className="ph-cd">
                        <div style={{ fontSize: 28, fontWeight: 700, color: GREEN, marginBottom: 12 }}>2100 kcal/dia</div>
                        <MacroRow label="Proteína" value="130 g" color={GOLD} />
                        <MacroRow label="Carboidratos" value="245 g" color={GREEN} />
                        <MacroRow label="Gorduras" value="67 g" color={RED} />
                        <MacroRow label="Água" value="2500 ml" color={BLUE} />
                      </div>
                      <div className="ph-el" data-tap="continue">Continuar</div>
                    </div>
                  </>
                )}

                <div className="ph-gesture"><i /></div>
              </div>

              {/* seta do mouse + marcador de toque */}
              {tapKey > 0 && (
                <span key={tapKey} className="ph-ripple" style={{ left: cursor.x - 22, top: cursor.y - 22 }} />
              )}
              <span
                className="ph-cursor"
                aria-hidden="true"
                style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)`, opacity: cursor.show ? 1 : 0 }}
              >
                <svg width="26" height="30" viewBox="0 0 26 30">
                  <path d="M3 2 L3 22 L8.2 17.4 L11.8 25.6 L15.2 24.1 L11.7 16.1 L18.6 15.6 Z" fill="#fff" stroke="#111" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
              </span>

              <span className="ph-cam" />
              <span className="ph-glass" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

/* Legenda do loop: fica ao lado do celular no computador e embaixo dele no celular */
export function PhoneCaption({ info, className = "" }) {
  const { screen = 0, cap = "", pick } = info || {};
  return (
    <div className={`ph-cap ${className}`}>
      <span className="ph-cap-step">
        PASSO {String(screen + 1).padStart(2, "0")} / {String(SCREENS).padStart(2, "0")}
      </span>
      <p key={cap} className="ph-cap-text">{cap}</p>
      <div className="ph-dots">
        {Array.from({ length: SCREENS }).map((_, n) => (
          <button
            key={n}
            type="button"
            aria-label={`Ver a tela ${n + 1} de ${SCREENS}`}
            className={`ph-dot${screen === n ? " on" : ""}`}
            onClick={() => pick?.(n)}
          />
        ))}
      </div>
      <p className="ph-hint">Passe o mouse ou toque no celular para pausar e testar. Valores de exemplo.</p>
    </div>
  );
}
