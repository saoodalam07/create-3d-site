import { useEffect, useRef } from "react";
import type { BackgroundType } from "@/lib/templates";

interface Props {
  type: BackgroundType;
  primary: string;
  secondary: string;
  accent: string;
  density?: number;
}

export function AnimatedBackground({ type, primary, secondary, accent, density = 80 }: Props) {
  if (type === "aurora") return <AuroraBg primary={primary} secondary={secondary} accent={accent} />;
  if (type === "particle-network") return <ParticleBg color={primary} density={density} />;
  if (type === "floating-shapes") return <FloatingShapesBg primary={primary} accent={accent} />;
  if (type === "geometric-mesh") return <GeometricMeshBg primary={primary} secondary={secondary} />;
  if (type === "noise-grid") return <NoiseGridBg primary={primary} accent={accent} />;
  if (type === "video-loop") return <AuroraBg primary={primary} secondary={secondary} accent={accent} />;
  return null;
}

function AuroraBg({ primary, secondary, accent }: { primary: string; secondary: string; accent: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -inset-[20%] opacity-80 mix-blend-screen" style={{
        background: `radial-gradient(circle at 20% 30%, ${primary} 0%, transparent 45%)`,
        animation: "bf-aurora-1 8s ease-in-out infinite",
      }} />
      <div className="absolute -inset-[20%] opacity-70 mix-blend-screen" style={{
        background: `radial-gradient(circle at 80% 20%, ${secondary} 0%, transparent 50%)`,
        animation: "bf-aurora-2 12s ease-in-out infinite",
      }} />
      <div className="absolute -inset-[20%] opacity-60 mix-blend-screen" style={{
        background: `radial-gradient(circle at 50% 80%, ${accent} 0%, transparent 55%)`,
        animation: "bf-aurora-3 15s ease-in-out infinite",
      }} />
    </div>
  );
}

function ParticleBg({ color, density }: { color: string; density: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let raf = 0; let running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    const count = Math.max(20, Math.min(density, 300));
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4 * dpr, vy: (Math.random() - 0.5) * 0.4 * dpr,
    }));
    const onVis = () => { running = !document.hidden; if (running) loop(); };
    document.addEventListener("visibilitychange", onVis);
    const loop = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.8 * dpr, 0, Math.PI * 2); ctx.fill();
      }
      ctx.strokeStyle = color + "33"; ctx.lineWidth = 1;
      const limit = 150 * dpr;
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y; const d2 = dx*dx + dy*dy;
        if (d2 < limit * limit) {
          ctx.globalAlpha = 1 - Math.sqrt(d2) / limit;
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, [color, density]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}

function FloatingShapesBg({ primary, accent }: { primary: string; accent: string }) {
  const shapes = Array.from({ length: 14 }, (_, i) => i);
  return (
    <div className="absolute inset-0 overflow-hidden">
      {shapes.map((i) => {
        const size = 30 + (i * 13) % 90;
        const left = (i * 73) % 100; const top = (i * 41) % 100;
        const dur = 6 + (i % 6); const color = i % 2 ? primary : accent;
        const shape = i % 3;
        const common: React.CSSProperties = { position: "absolute", left: `${left}%`, top: `${top}%`, width: size, height: size, animation: `bf-float ${dur}s ease-in-out infinite`, animationDelay: `${i * 0.3}s`, opacity: 0.35 };
        if (shape === 0) return <div key={i} style={{ ...common, background: color, borderRadius: "50%", filter: "blur(1px)" }} />;
        if (shape === 1) return <div key={i} style={{ ...common, background: color, clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />;
        return <div key={i} style={{ ...common, background: color, clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" }} />;
      })}
    </div>
  );
}

function GeometricMeshBg({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: `linear-gradient(135deg, ${primary}33, ${secondary}33)` }}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="bf-mesh" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke={primary} strokeOpacity="0.25" strokeWidth="0.2" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#bf-mesh)" />
        <g style={{ animation: "bf-spin-slow 80s linear infinite", transformOrigin: "50% 50%" }}>
          <polygon points="50,20 80,50 50,80 20,50" fill="none" stroke={secondary} strokeWidth="0.3" opacity="0.6" />
          <polygon points="50,30 70,50 50,70 30,50" fill="none" stroke={primary} strokeWidth="0.3" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}

function NoiseGridBg({ primary, accent }: { primary: string; accent: string }) {
  const cells = Array.from({ length: 200 }, (_, i) => i);
  return (
    <div className="absolute inset-0 grid" style={{ gridTemplateColumns: "repeat(20, 1fr)", background: `linear-gradient(135deg, ${primary}22, ${accent}22)` }}>
      {cells.map((i) => (
        <div key={i} style={{ background: i % 2 ? primary : accent, opacity: ((i * 13) % 30) / 100, animation: `bf-drift ${4 + (i%5)}s ease-in-out infinite`, animationDelay: `${(i % 20) * 0.1}s` }} />
      ))}
    </div>
  );
}