import { useEffect, useRef } from "react";
import { AnimatedBackground } from "./AnimatedBackground";
import type { BackgroundType } from "@/lib/templates";

interface HeroProps {
  industry: string;
  headline: string;
  subline: string;
  primary: string;
  secondary: string;
  accent: string;
  ctaLabel: string;
  background: BackgroundType;
  headlineFont: string;
  bodyFont: string;
  tiltMax: number;
  parallax: number;
  particleDensity: number;
  stats: { number: string; label: string }[];
}

export function HeroEngine(props: HeroProps) {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const targetTilt = useRef({ x: 0, y: 0 });
  const currentTilt = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const scene = sceneRef.current; const el = tiltRef.current;
    if (!scene || !el) return;
    let raf = 0; let running = true;
    const max = props.tiltMax;
    const onMove = (e: MouseEvent) => {
      const r = scene.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      targetTilt.current.x = cx * max;
      targetTilt.current.y = -cy * max;
    };
    const onLeave = () => { targetTilt.current.x = 0; targetTilt.current.y = 0; };
    const onVis = () => { running = !document.hidden; if (running) loop(); };
    scene.addEventListener("mousemove", onMove);
    scene.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    const loop = () => {
      if (!running) return;
      currentTilt.current.x += (targetTilt.current.x - currentTilt.current.x) * 0.08;
      currentTilt.current.y += (targetTilt.current.y - currentTilt.current.y) * 0.08;
      el.style.setProperty("--tilt-x", `${currentTilt.current.x}deg`);
      el.style.setProperty("--tilt-y", `${currentTilt.current.y}deg`);
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); scene.removeEventListener("mousemove", onMove); scene.removeEventListener("mouseleave", onLeave); document.removeEventListener("visibilitychange", onVis); };
  }, [props.tiltMax]);

  const chars = props.headline.split("");

  return (
    <div ref={sceneRef} className="relative bf-scene overflow-hidden" style={{ minHeight: 520, background: `linear-gradient(180deg, ${props.primary}11, ${props.secondary}11)` }}>
      <div className="absolute inset-0" style={{ transform: `translateZ(-200px) scale(${1 + props.parallax * 0.2})` }}>
        <AnimatedBackground type={props.background} primary={props.primary} secondary={props.secondary} accent={props.accent} density={props.particleDensity} />
      </div>

      <div ref={tiltRef} className="bf-tilt relative h-full flex flex-col items-center justify-center px-10 py-20 text-center" style={{ minHeight: 520 }}>
        <div className="relative z-10 mb-6" style={{ transform: "translateZ(80px)" }}>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight" style={{ fontFamily: props.headlineFont, color: "#0f172a" }}>
            {chars.map((c, i) => (
              <span key={i} className="bf-char" style={{ animationDelay: `${i * 60}ms` }}>{c === " " ? "\u00a0" : c}</span>
            ))}
          </h1>
        </div>

        <div className="relative z-10 bf-glass px-8 py-6 max-w-xl" style={{ transform: "translateZ(40px)", background: "rgba(255,255,255,0.55)" }}>
          <p className="text-base md:text-lg text-slate-700 mb-5" style={{ fontFamily: props.bodyFont }}>{props.subline}</p>
          <button
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold shadow-lg transition-transform hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${props.primary}, ${props.accent})`, boxShadow: `0 12px 32px -8px ${props.primary}88` }}
          >
            {props.ctaLabel}
            <span aria-hidden>→</span>
          </button>
        </div>

        <div className="absolute right-6 top-6 z-20 bf-glass px-4 py-3 hidden md:block" style={{ transform: "translateZ(120px)", background: "rgba(255,255,255,0.75)" }}>
          <div className="text-2xl font-bold" style={{ color: props.primary, fontFamily: props.headlineFont }}>{props.stats[0].number}</div>
          <div className="text-xs text-slate-600">{props.stats[0].label}</div>
        </div>
        <div className="absolute left-6 bottom-6 z-20 bf-glass px-4 py-3 hidden md:block" style={{ transform: "translateZ(100px)", background: "rgba(255,255,255,0.75)" }}>
          <div className="text-2xl font-bold" style={{ color: props.accent, fontFamily: props.headlineFont }}>{props.stats[2].number}</div>
          <div className="text-xs text-slate-600">{props.stats[2].label}</div>
        </div>
      </div>
    </div>
  );
}