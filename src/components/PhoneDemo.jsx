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
const TABS = ["Hoje", "Foto (IA)", "Texto (IA)", "Metas"];

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
      <div className="ph-el">Confirmar e salvar no diário</div>
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

export default function PhoneDemo() {
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  const [screen, setScreen] = useState(0);
  const [phase, setPhase] = useState(0);
  const [typed, setTyped] = useState(0);
  const [water, setWater] = useState(1000);
  const [paused, setPaused] = useState(!!reduced);
  const [visible, setVisible] = useState(false);

  const wrapRef = useRef(null);
  const bodyRef = useRef(null);
  const rafRef = useRef(0);
  const resumeRef = useRef(0);
  const foodSvg = useMemo(() => buildFoodSvg(), []);

  const running = visible && !paused;

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

  useEffect(() => () => {
    cancelAnimationFrame(rafRef.current);
    clearTimeout(resumeRef.current);
  }, []);

  // volta ao topo ao trocar de tela
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [screen]);

  const go = useCallback((n, settle) => {
    setScreen(n);
    setPhase(settle ? (n === 1 ? 1 : n === 2 ? 2 : 0) : 0);
    setTyped(settle && n === 2 ? TYPED_TEXT.length : 0);
  }, []);

  // sequência automática (o "vídeo" em loop)
  useEffect(() => {
    if (!running) return undefined;
    const next = () => go((screen + 1) % TABS.length);
    let t;
    if (screen === 0) {
      if (phase === 0)
        t = setTimeout(() => {
          setWater((w) => Math.min(2500, w + 300));
          setPhase(1);
        }, 2800);
      else t = setTimeout(next, 3200);
    } else if (screen === 1) {
      if (phase === 0) t = setTimeout(() => setPhase(1), 2800);
      else if (phase === 1)
        t = setTimeout(() => {
          glide(bodyRef.current, 3600, rafRef);
          setPhase(2);
        }, 1200);
      else t = setTimeout(next, 5200);
    } else if (screen === 2) {
      if (phase === 0) {
        if (typed < TYPED_TEXT.length) t = setTimeout(() => setTyped((x) => x + 1), 75);
        else t = setTimeout(() => setPhase(1), 500);
      } else if (phase === 1) t = setTimeout(() => setPhase(2), 2000);
      else if (phase === 2)
        t = setTimeout(() => {
          glide(bodyRef.current, 3000, rafRef);
          setPhase(3);
        }, 1200);
      else t = setTimeout(next, 4600);
    } else {
      t = setTimeout(next, 5200);
    }
    return () => clearTimeout(t);
  }, [running, screen, phase, typed, go]);

  // pausa quando a pessoa mexe; retoma sozinho depois
  const pause = useCallback(() => {
    clearTimeout(resumeRef.current);
    cancelAnimationFrame(rafRef.current);
    setPaused(true);
    // deixa a tela "pronta" (sem ficar presa no carregando)
    setPhase((p) => (screen === 1 ? Math.max(p, 1) : screen === 2 ? Math.max(p, 2) : p));
    if (screen === 2) setTyped(TYPED_TEXT.length);
  }, [screen]);

  const resumeIn = useCallback(
    (ms) => {
      if (reduced) return;
      clearTimeout(resumeRef.current);
      resumeRef.current = setTimeout(() => {
        go((screen + 1) % TABS.length);
        setPaused(false);
      }, ms);
    },
    [go, reduced, screen],
  );

  const addWater = (ml) => setWater((w) => Math.min(2500, w + ml));

  const pickTab = (n) => {
    clearTimeout(resumeRef.current);
    cancelAnimationFrame(rafRef.current);
    setPaused(true);
    go(n, true);
    if (!reduced) {
      resumeRef.current = setTimeout(() => {
        go((n + 1) % TABS.length);
        setPaused(false);
      }, 10000);
    }
  };

  const showSpinner1 = screen === 1 && phase === 0;
  const textDone = screen === 2 && phase >= 2;

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
        onWheel={() => {
          clearTimeout(resumeRef.current);
        }}
      >
        <div className="ph-shadow" />
        <span className="ph-btn" style={{ top: 128, height: 64 }} />
        <span className="ph-btn" style={{ top: 214, height: 40 }} />
        <div className="ph-frame">
          <div className="ph-bezel">
            <div className="ph-screen">
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
                      <div className="ph-el" style={{ margin: "16px 0 4px" }}>
                        <Camera size={22} />
                        Tirar outra foto
                      </div>
                      {showSpinner1 ? (
                        <Spinner text="Analisando o prato..." />
                      ) : (
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
                      <div style={{ background: "#24262E", borderRadius: 14, padding: 16, fontSize: 16, display: "flex", alignItems: "flex-start", gap: 8, minHeight: 24 }}>
                        <div style={{ flex: 1, lineHeight: 1.4 }}>
                          {TYPED_TEXT.slice(0, typed)}
                          {!textDone && <span className="ph-caret">|</span>}
                        </div>
                        <Mic size={24} color={GREEN} />
                      </div>
                      <div className="ph-el" style={{ marginTop: 12 }}>
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
                      <div className="ph-el">Continuar</div>
                    </div>
                  </>
                )}

                <div className="ph-gesture"><i /></div>
              </div>
              <span className="ph-cam" />
              <span className="ph-glass" />
            </div>
          </div>
        </div>
      </div>

      <div className="ph-tabs" role="tablist" aria-label="Telas do aplicativo">
        {TABS.map((name, i) => (
          <button key={name} type="button" role="tab" aria-selected={screen === i} className={`ph-tab${screen === i ? " on" : ""}`} onClick={() => pickTab(i)}>
            <i />
            {name}
          </button>
        ))}
      </div>
      <p className="ph-hint">Passe o mouse ou toque no celular para pausar e testar. Valores de exemplo.</p>
    </div>
  );
}
