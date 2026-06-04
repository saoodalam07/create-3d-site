import { useEffect, useRef } from "react";
import type { BackgroundType } from "@/lib/templates";

interface Props {
  type: BackgroundType;
  primary: string;
  secondary: string;
  accent: string;
  density?: number;
  photos?: string[];
}

export function AnimatedBackground({ type, primary, secondary, accent, density = 80, photos = [] }: Props) {
  if (type === "aurora") return <AuroraBg primary={primary} secondary={secondary} accent={accent} />;
  if (type === "particle-network") return <ParticleBg color={primary} density={density} />;
  if (type === "floating-shapes") return <FloatingShapesBg primary={primary} accent={accent} />;
  if (type === "geometric-mesh") return <GeometricMeshBg primary={primary} secondary={secondary} />;
  if (type === "noise-grid") return <NoiseGridBg primary={primary} accent={accent} />;
  if (type === "construction-3d") return <ConstructionBg primary={primary} secondary={secondary} accent={accent} photos={photos} />;
  if (type === "waterfall-3d") return <WaterfallBg primary={primary} secondary={secondary} accent={accent} density={density} />;
  if (type === "photo-parallax") return <PhotoParallaxBg primary={primary} accent={accent} photos={photos} />;
  if (type === "video-loop") return <AuroraBg primary={primary} secondary={secondary} accent={accent} />;
  return null;
}

function PhotoParallaxBg({ primary, accent, photos }: { primary: string; accent: string; photos: string[] }) {
  const pool = photos.length ? photos : ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80"];
  const layers = [pool[0], pool[1 % pool.length], pool[2 % pool.length]];
  return (
    <div className="absolute inset-0 overflow-hidden bf-parallax-scene">
      {layers.map((src, i) => (
        <div key={i} className="absolute inset-0 bf-parallax-layer" style={{
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.55 - i * 0.12,
          filter: `blur(${i * 1.5}px) saturate(1.1)`,
          transform: `translate3d(calc(var(--tilt-x, 0deg) * ${-2 - i * 2}), calc(var(--tilt-y, 0deg) * ${-2 - i * 2}), 0) scale(${1.08 + i * 0.04})`,
          transition: "transform 600ms cubic-bezier(.22,1,.36,1)",
          mixBlendMode: i === 0 ? "normal" : "screen",
        }} />
      ))}
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${primary}55, transparent 60%, ${accent}66)` }} />
    </div>
  );
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

function ConstructionBg({ primary, secondary, accent, photos }: { primary: string; secondary: string; accent: string; photos: string[] }) {
  // Animated SVG construction site — rising buildings, swinging crane, walking workers, sparks
  const sparks = Array.from({ length: 22 }, (_, i) => i);
  const hero = photos[0] ?? "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80";
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: `linear-gradient(180deg, ${primary}22 0%, ${secondary}33 60%, ${accent}22 100%)` }}>
      {/* Real construction site photo */}
      <img
        src={hero}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
        style={{ animation: "bf-kenburns 22s ease-in-out infinite alternate" }}
      />
      {/* Tonal color wash to blend with template palette */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${primary}66 0%, ${secondary}55 55%, ${accent}66 100%)`, mixBlendMode: "multiply" }} />
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 110%, ${accent}55, transparent 60%)` }} />

      {/* Sun / glow */}
      <div className="absolute" style={{ top: "12%", right: "14%", width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle, ${accent}99, transparent 70%)`, filter: "blur(6px)" }} />

      {/* Crane + workers overlay on top of the photo */}
      <svg className="absolute inset-x-0 bottom-0 w-full" viewBox="0 0 800 400" preserveAspectRatio="none" style={{ height: "75%" }}>
        <defs>
          <linearGradient id="bldg1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={primary} stopOpacity="0.95" />
            <stop offset="100%" stopColor={secondary} stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="bldg2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={secondary} stopOpacity="0.9" />
            <stop offset="100%" stopColor={primary} stopOpacity="0.85" />
          </linearGradient>
        </defs>
        {/* Crane */}
        <g style={{ transformOrigin: "560px 400px", animation: "bf-crane-sway 6s ease-in-out infinite" }}>
          <line x1="560" y1="400" x2="560" y2="60" stroke={accent} strokeWidth="5" />
          <line x1="560" y1="60" x2="760" y2="60" stroke={accent} strokeWidth="5" />
          <line x1="560" y1="60" x2="460" y2="60" stroke={accent} strokeWidth="3" />
          <line x1="560" y1="60" x2="560" y2="35" stroke={accent} strokeWidth="2" />
          {/* Hook line */}
          <line x1="700" y1="60" x2="700" y2="180" stroke={accent} strokeWidth="1.5" style={{ animation: "bf-crane-hook 4s ease-in-out infinite" }} />
          <rect x="690" y="180" width="20" height="14" fill={primary} stroke={accent} strokeWidth="1" style={{ animation: "bf-crane-hook 4s ease-in-out infinite" }} />
        </g>
        {/* Workers walking */}
        <g style={{ animation: "bf-worker-walk 9s linear infinite" }}>
          <Worker x={120} primary={accent} secondary={primary} />
          <Worker x={260} primary={accent} secondary={primary} />
          <Worker x={470} primary={accent} secondary={primary} />
        </g>
      </svg>

      {/* Welding sparks falling */}
      {sparks.map((i) => {
        const left = (i * 47) % 100;
        const delay = (i % 7) * 0.4;
        const dur = 2 + (i % 4) * 0.6;
        return (
          <span key={i} className="absolute pointer-events-none" style={{
            left: `${left}%`, top: "30%", width: 3, height: 3, borderRadius: "50%",
            background: accent, boxShadow: `0 0 6px ${accent}`,
            animation: `bf-spark-fall ${dur}s ease-in ${delay}s infinite`,
          }} />
        );
      })}

      {/* Dust haze */}
      <div className="absolute inset-x-0 bottom-0 h-24" style={{ background: `linear-gradient(0deg, ${secondary}66, transparent)`, animation: "bf-dust 6s ease-in-out infinite" }} />
    </div>
  );
}

function Worker({ x, primary, secondary }: { x: number; primary: string; secondary: string }) {
  return (
    <g transform={`translate(${x}, 360)`}>
      {/* helmet */}
      <circle cx="0" cy="-2" r="5" fill={primary} />
      <rect x="-5" y="2" width="10" height="2" fill={primary} />
      {/* body */}
      <rect x="-4" y="4" width="8" height="10" fill={secondary} />
      {/* legs */}
      <g style={{ transformOrigin: "0 14px", animation: "bf-leg-1 0.7s ease-in-out infinite" }}>
        <rect x="-4" y="14" width="3" height="8" fill={primary} />
      </g>
      <g style={{ transformOrigin: "0 14px", animation: "bf-leg-2 0.7s ease-in-out infinite" }}>
        <rect x="1" y="14" width="3" height="8" fill={primary} />
      </g>
      {/* arm with tool */}
      <rect x="3" y="6" width="2" height="8" fill={primary} style={{ transformOrigin: "4px 6px", animation: "bf-arm 0.5s ease-in-out infinite" }} />
    </g>
  );
}

function WaterfallBg({ primary, secondary, accent, density }: { primary: string; secondary: string; accent: string; density: number }) {
  const drops = Array.from({ length: Math.max(40, Math.min(density, 200)) }, (_, i) => i);
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: `linear-gradient(180deg, ${primary}33 0%, ${secondary}44 50%, ${accent}55 100%)` }}>
      {/* Real waterfall photo */}
      <img
        src="https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1600&q=80"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
        style={{ animation: "bf-kenburns 24s ease-in-out infinite alternate" }}
      />
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${primary}55 0%, ${secondary}44 45%, ${accent}66 100%)`, mixBlendMode: "screen" }} />
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 60%, ${primary}99 100%)` }} />
      {/* Falling water streaks */}
      {drops.map((i) => {
        const left = 32 + ((i * 7) % 38);
        const delay = (i % 12) * 0.15;
        const dur = 1.2 + (i % 5) * 0.25;
        const w = 2 + (i % 3);
        return (
          <span key={i} className="absolute" style={{
            left: `${left}%`, top: "-10%", width: w, height: 80,
            background: `linear-gradient(180deg, transparent, ${accent}, transparent)`,
            opacity: 0.7, borderRadius: 2,
            animation: `bf-water-fall ${dur}s linear ${delay}s infinite`,
            filter: "blur(0.5px)",
          }} />
        );
      })}
      {/* Mist at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-32" style={{ background: `radial-gradient(ellipse at center bottom, ${accent}aa, transparent 70%)`, animation: "bf-mist 4s ease-in-out infinite" }} />
      {/* Ripples */}
      {[0,1,2].map((i) => (
        <span key={i} className="absolute rounded-full border" style={{
          left: "50%", bottom: "8%", width: 80, height: 16, borderColor: accent, opacity: 0.5,
          transform: "translateX(-50%)",
          animation: `bf-ripple 3s ease-out ${i*1}s infinite`,
        }} />
      ))}
    </div>
  );
}