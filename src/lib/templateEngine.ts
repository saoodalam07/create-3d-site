import { TEMPLATES, type Template } from "./templates";

export interface Customizations {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  headlineFont?: string;
  bodyFont?: string;
  tiltMax?: number; // 0–25
  parallax?: number; // 0–1
  particleDensity?: number; // 0–500
  backgroundType?: Template["backgroundType"];
  sectionVisibility?: Record<string, boolean>;
  headline?: string;
  subline?: string;
  ctaLabel?: string;
}

export interface EngineState {
  activeTemplate: string;
  templateHistory: string[];
  customizations: Record<string, Customizations>;
}

type Listener = (s: EngineState) => void;

const listeners = new Set<Listener>();

const state: EngineState = {
  activeTemplate: TEMPLATES[0].templateId,
  templateHistory: [TEMPLATES[0].templateId],
  customizations: {},
};

let snapshot: EngineState = { ...state, templateHistory: [...state.templateHistory] };

function emit() {
  snapshot = { ...state, templateHistory: [...state.templateHistory], customizations: { ...state.customizations } };
  for (const l of listeners) l(snapshot);
}

export function subscribe(l: Listener): () => void {
  listeners.add(l);
  return () => { listeners.delete(l); };
}

export function getState(): EngineState {
  return snapshot;
}

export function apply(templateId: string) {
  if (!TEMPLATES.find((t) => t.templateId === templateId)) return;
  if (state.activeTemplate === templateId) return;
  state.templateHistory = [...state.templateHistory, templateId].slice(-10);
  state.activeTemplate = templateId;
  emit();
}

export function undo() {
  if (state.templateHistory.length <= 1) return;
  state.templateHistory.pop();
  state.activeTemplate = state.templateHistory[state.templateHistory.length - 1];
  emit();
}

export function setCustomization(templateId: string, patch: Customizations) {
  state.customizations[templateId] = { ...state.customizations[templateId], ...patch };
  emit();
}

export function resetCustomization(templateId: string) {
  delete state.customizations[templateId];
  emit();
}

export function getMergedTemplate(templateId?: string): Template & Customizations {
  const id = templateId ?? state.activeTemplate;
  const base = TEMPLATES.find((t) => t.templateId === id) ?? TEMPLATES[0];
  return { ...base, ...(state.customizations[id] ?? {}) };
}

export function exportHTML(): string {
  const t = getMergedTemplate();
  const fontHref = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(t.headlineFont).replace(/%20/g,"+")}:wght@400;700&family=${encodeURIComponent(t.bodyFont).replace(/%20/g,"+")}:wght@400;600&display=swap`;
  const stats = t.stats.map((s) => `<div class="stat"><div class="num">${s.number}</div><div class="lbl">${s.label}</div></div>`).join("");
  const services = t.services.map((s, i) => `<div class="svc"><div class="svc-num">${String(i+1).padStart(2,"0")}</div><div class="svc-name">${s.name}</div><p>${s.description}</p></div>`).join("");
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${t.name} — ${t.industry}</title>
<meta name="description" content="${t.subline}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${fontHref}" rel="stylesheet">
<style>
:root{--p:${t.primaryColor};--s:${t.secondaryColor};--a:${t.accentColor};--hf:'${t.headlineFont}',sans-serif;--bf:'${t.bodyFont}',sans-serif}
*{box-sizing:border-box;margin:0;padding:0}body{font-family:var(--bf);color:#0f172a;background:#fff;line-height:1.6}
.hero{position:relative;min-height:600px;display:flex;align-items:center;justify-content:center;text-align:center;padding:80px 24px;background:linear-gradient(135deg,var(--p)22,var(--s)22,var(--a)22);overflow:hidden}
.hero::before,.hero::after{content:"";position:absolute;border-radius:50%;filter:blur(60px);opacity:.55}
.hero::before{width:420px;height:420px;background:var(--p);top:-100px;left:-80px;animation:f1 9s ease-in-out infinite}
.hero::after{width:380px;height:380px;background:var(--a);bottom:-120px;right:-60px;animation:f1 12s ease-in-out infinite reverse}
@keyframes f1{50%{transform:translate(40px,-30px) scale(1.15)}}
.hero h1{font-family:var(--hf);font-size:clamp(40px,7vw,72px);font-weight:700;letter-spacing:-.02em;margin-bottom:24px;position:relative;z-index:2}
.hero p{max-width:620px;margin:0 auto 32px;font-size:18px;color:#334155;position:relative;z-index:2}
.cta{display:inline-block;padding:16px 36px;border-radius:999px;color:#fff;font-weight:600;text-decoration:none;background:linear-gradient(135deg,var(--p),var(--a));box-shadow:0 16px 40px -12px var(--p);position:relative;z-index:2;transition:transform .2s}
.cta:hover{transform:translateY(-2px) scale(1.04)}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:24px;padding:64px 24px;max-width:1100px;margin:0 auto}
.stat{text-align:center}.num{font-family:var(--hf);font-size:48px;font-weight:700;color:var(--p)}.lbl{font-size:12px;text-transform:uppercase;letter-spacing:.15em;color:#64748b;margin-top:6px}
.services{background:#f8fafc;padding:80px 24px;border-top:1px solid #e2e8f0}.services-wrap{max-width:1100px;margin:0 auto}
.services h2{font-family:var(--hf);font-size:36px;margin-bottom:32px}
.svc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px}
.svc{background:#fff;padding:24px;border-radius:16px;border:1px solid #e2e8f0;transition:transform .2s,box-shadow .2s}
.svc:hover{transform:translateY(-4px);box-shadow:0 20px 40px -20px var(--p)55}
.svc-num{width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,var(--p),var(--a));color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;margin-bottom:14px}
.svc-name{font-family:var(--hf);font-weight:600;font-size:18px;margin-bottom:8px}.svc p{font-size:14px;color:#475569}
footer{padding:48px 24px;color:#fff;background:linear-gradient(135deg,var(--p),var(--s));display:flex;flex-wrap:wrap;gap:16px;justify-content:space-between;align-items:center}
footer .brand{font-family:var(--hf);font-size:22px;font-weight:700}footer small{opacity:.8}
footer .cta{background:#fff;color:var(--p);box-shadow:none}
</style></head><body>
<section class="hero"><div><h1>${t.headline}</h1><p>${t.subline}</p><a href="#" class="cta">${t.ctaLabel} →</a></div></section>
<section class="stats">${stats}</section>
<section class="services"><div class="services-wrap"><h2>What We Do</h2><div class="svc-grid">${services}</div></div></section>
<footer><div><div class="brand">${t.name}</div><small>© ${new Date().getFullYear()} · ${t.industry}</small></div><a class="cta" href="#">${t.ctaLabel}</a></footer>
</body></html>`;
}

export function downloadHTML() {
  if (typeof window === "undefined") return;
  const t = getMergedTemplate();
  const blob = new Blob([exportHTML()], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${t.name.toLowerCase().replace(/\s+/g, "-")}.html`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function previewHTML() {
  if (typeof window === "undefined") return;
  const blob = new Blob([exportHTML()], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener");
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

// Expose to window
if (typeof window !== "undefined") {
  (window as unknown as { TemplateEngine: unknown }).TemplateEngine = {
    apply,
    undo,
    exportHTML,
    getState,
    setCustomization,
    resetCustomization,
  };

  // Ctrl+Z
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      undo();
    }
  });
}