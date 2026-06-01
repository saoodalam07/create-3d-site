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

function emit() {
  for (const l of listeners) l({ ...state, templateHistory: [...state.templateHistory] });
}

export function subscribe(l: Listener): () => void {
  listeners.add(l);
  return () => { listeners.delete(l); };
}

export function getState(): EngineState {
  return { ...state, templateHistory: [...state.templateHistory] };
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
  return `<!doctype html><html><head><title>${t.name}</title></head><body><h1 style="font-family:${t.headlineFont}">${t.headline}</h1><p>${t.subline}</p></body></html>`;
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