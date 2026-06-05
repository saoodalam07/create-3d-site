import { useEffect, useRef } from "react";
import type { BackgroundType } from "@/lib/templates";

interface Props {
  type: BackgroundType;
  primary: string;
  secondary: string;
  accent: string;
  density?: number;
  photos?: string[];
  customImage?: string;
}

export function AnimatedBackground({ type, primary, secondary, accent, density = 80, photos = [], customImage }: Props) {
  if (type === "custom-image" && customImage) return <CustomImageBg src={customImage} primary={primary} accent={accent} />;
  if (type === "isometric-city") return <IsometricCityBg primary={primary} secondary={secondary} accent={accent} />;
  if (type === "neon-grid") return <NeonGridBg primary={primary} accent={accent} />;
  if (type === "blueprint") return <BlueprintBg primary={primary} accent={accent} />;
  if (type === "skyline-night") return <SkylineNightBg primary={primary} secondary={secondary} accent={accent} />;
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

function CustomImageBg({ src, primary, accent }: { src: string; primary: string; accent: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <img src={src} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" style={{ animation: "bf-kenburns 22s ease-in-out infinite alternate" }} />
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${primary}77, transparent 55%, ${accent}88)`, mixBlendMode: "multiply" }} />
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 100%, ${accent}66, transparent 70%)` }} />
    </div>
  );
}

function IsometricCityBg({ primary, secondary, accent }: { primary: string; secondary: string; accent: string }) {
  const blocks = Array.from({ length: 18 }, (_, i) => i);
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: `linear-gradient(160deg, ${primary}22, ${secondary}33 50%, ${accent}22)` }}>
      <div className="absolute inset-0" style={{ perspective: "1400px" }}>
        <div className="absolute left-1/2 top-1/2" style={{ transform: "translate(-50%,-30%) rotateX(58deg) rotateZ(-30deg)", transformStyle: "preserve-3d" }}>
          {blocks.map((i) => {
            const x = ((i % 6) - 3) * 90;
            const y = (Math.floor(i / 6) - 1) * 90;
            const h = 60 + ((i * 37) % 140);
            const c = i % 3 === 0 ? primary : i % 3 === 1 ? secondary : accent;
            return (
              <div key={i} className="absolute" style={{
                left: x, top: y, width: 70, height: 70,
                background: c, opacity: 0.85,
                boxShadow: `0 ${h}px 0 -8px ${c}cc, 0 0 30px ${c}55`,
                transform: `translateZ(${h/2}px)`,
                animation: `bf-bld-rise ${4 + (i%5)}s ease-in-out infinite alternate`,
                animationDelay: `${(i%5)*0.3}s`,
              }} />
            );
          })}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: `linear-gradient(0deg, ${primary}99, transparent)` }} />
    </div>
  );
}

function NeonGridBg({ primary, accent }: { primary: string; accent: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: `radial-gradient(ellipse at 50% 30%, ${primary}55, #05060f 75%)` }}>
      <div className="absolute inset-x-0 bottom-0 h-2/3" style={{
        backgroundImage: `linear-gradient(${accent}88 1px, transparent 1px), linear-gradient(90deg, ${accent}88 1px, transparent 1px)`,
        backgroundSize: "50px 50px",
        transform: "perspective(600px) rotateX(60deg)",
        transformOrigin: "bottom",
        maskImage: "linear-gradient(0deg, #000 30%, transparent 100%)",
        animation: "bf-grid-scroll 8s linear infinite",
      }} />
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-48 h-48 rounded-full" style={{ background: `radial-gradient(circle, ${accent}, ${primary} 40%, transparent 70%)`, filter: "blur(8px)", animation: "bf-aurora-1 6s ease-in-out infinite" }} />
    </div>
  );
}

function BlueprintBg({ primary, accent }: { primary: string; accent: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: primary }}>
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(${accent}33 1px, transparent 1px), linear-gradient(90deg, ${accent}33 1px, transparent 1px), linear-gradient(${accent}22 1px, transparent 1px), linear-gradient(90deg, ${accent}22 1px, transparent 1px)`,
        backgroundSize: "100px 100px, 100px 100px, 20px 20px, 20px 20px",
      }} />
      <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 800 600">
        <g fill="none" stroke={accent} strokeWidth="1.5">
          <rect x="120" y="200" width="220" height="260" />
          <rect x="140" y="220" width="80" height="100" />
          <rect x="240" y="220" width="80" height="100" />
          <rect x="140" y="340" width="180" height="100" />
          <line x1="120" y1="200" x2="340" y2="120" /><line x1="340" y1="200" x2="340" y2="120" />
          <circle cx="500" cy="320" r="80" /><circle cx="500" cy="320" r="50" />
          <line x1="420" y1="320" x2="580" y2="320" /><line x1="500" y1="240" x2="500" y2="400" />
          <rect x="600" y="180" width="140" height="300" />
          <line x1="600" y1="240" x2="740" y2="240" /><line x1="600" y1="300" x2="740" y2="300" />
          <line x1="600" y1="360" x2="740" y2="360" /><line x1="600" y1="420" x2="740" y2="420" />
        </g>
      </svg>
    </div>
  );
}

function SkylineNightBg({ primary, secondary, accent }: { primary: string; secondary: string; accent: string }) {
  const bldgs = Array.from({ length: 22 }, (_, i) => i);
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: `linear-gradient(180deg, #0b1226 0%, ${primary}55 45%, ${secondary}77 100%)` }}>
      <div className="absolute" style={{ top: "15%", right: "20%", width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle, ${accent} 0%, transparent 65%)`, filter: "blur(6px)" }} />
      <div className="absolute inset-x-0 bottom-0 flex items-end" style={{ height: "65%" }}>
        {bldgs.map((i) => {
          const h = 25 + ((i * 53) % 70);
          const w = 28 + ((i * 7) % 22);
          const c = i % 2 ? secondary : primary;
          return (
            <div key={i} className="relative" style={{ width: `${w}px`, height: `${h}%`, background: `linear-gradient(180deg, ${c}, #050816)`, marginRight: 2, boxShadow: `0 -8px 30px ${accent}33` }}>
              {Array.from({ length: 6 }).map((_, j) => (
                <span key={j} className="absolute" style={{ left: `${20 + j*15}%`, top: `${15 + (j*13)%60}%`, width: 3, height: 3, background: accent, opacity: ((i+j)%3)/3 + 0.3, boxShadow: `0 0 4px ${accent}` }} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
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