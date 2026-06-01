import { useEngineState } from "@/hooks/useTemplateEngine";
import { getMergedTemplate, setCustomization, resetCustomization, undo } from "@/lib/templateEngine";
import type { BackgroundType } from "@/lib/templates";
import { Undo2, RotateCcw, Wand2 } from "lucide-react";

const FONT_OPTIONS = ["Space Grotesk","Syne","Outfit","Sora","Urbanist","Instrument Serif","DM Serif Display","Cormorant","Bebas Neue","Archivo Black","Inter","DM Sans","Manrope","Work Sans","IBM Plex Sans","Karla","Nunito Sans","Hind","Cabin","Plus Jakarta Sans"];
const BG_OPTIONS: BackgroundType[] = ["particle-network","geometric-mesh","aurora","floating-shapes","video-loop","noise-grid"];

export function RightPanel() {
  const { activeTemplate, templateHistory } = useEngineState();
  const t = getMergedTemplate();

  const update = (k: string, v: unknown) => setCustomization(activeTemplate, { [k]: v } as never);

  return (
    <aside className="w-[320px] shrink-0 bf-panel border-l border-[var(--panel-border)] flex flex-col h-screen">
      <div className="px-4 py-3 border-b border-[var(--panel-border)] flex items-center justify-between">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-[var(--panel-muted)]">Inspector</div>
          <div className="text-sm font-bold text-[var(--panel-foreground)] truncate">{t.name}</div>
        </div>
        <div className="flex gap-1">
          <button onClick={undo} disabled={templateHistory.length <= 1} aria-label="Undo (Ctrl+Z)" title="Undo (Ctrl+Z)" className="p-1.5 rounded text-[var(--panel-muted)] hover:bg-[var(--panel-hover)] hover:text-[var(--panel-foreground)] disabled:opacity-30">
            <Undo2 className="w-4 h-4" />
          </button>
          <button onClick={() => resetCustomization(activeTemplate)} aria-label="Reset customizations" title="Reset" className="p-1.5 rounded text-[var(--panel-muted)] hover:bg-[var(--panel-hover)] hover:text-[var(--panel-foreground)]">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bf-scroll p-4 space-y-5 text-[var(--panel-foreground)]">
        <Section label="Color Palette">
          <div className="grid grid-cols-3 gap-2">
            <ColorField label="Primary" value={t.primaryColor} onChange={(v) => update("primaryColor", v)} />
            <ColorField label="Secondary" value={t.secondaryColor} onChange={(v) => update("secondaryColor", v)} />
            <ColorField label="Accent" value={t.accentColor} onChange={(v) => update("accentColor", v)} />
          </div>
        </Section>

        <Section label="Typography">
          <FontSelect label="Headline" value={t.headlineFont} onChange={(v) => update("headlineFont", v)} />
          <FontSelect label="Body" value={t.bodyFont} onChange={(v) => update("bodyFont", v)} />
        </Section>

        <Section label="3D & Motion">
          <SliderField label="Tilt Angle" value={t.tiltMax ?? 6} min={0} max={25} step={1} unit="°" onChange={(v) => update("tiltMax", v)} />
          <SliderField label="Parallax Intensity" value={t.parallax ?? 0.5} min={0} max={1} step={0.05} onChange={(v) => update("parallax", v)} />
          <SliderField label="Particle Density" value={t.particleDensity ?? 80} min={0} max={500} step={10} onChange={(v) => update("particleDensity", v)} />
        </Section>

        <Section label="Background">
          <div className="grid grid-cols-2 gap-1.5">
            {BG_OPTIONS.map((b) => {
              const active = t.backgroundType === b;
              return (
                <button key={b} onClick={() => update("backgroundType", b)} className={`text-[10px] px-2 py-1.5 rounded border transition-colors ${active ? "border-[var(--primary)] bg-[var(--panel-hover)] text-[var(--panel-foreground)]" : "border-[var(--panel-border)] hover:bg-[var(--panel-hover)] text-[var(--panel-muted)]"}`}>
                  {b}
                </button>
              );
            })}
          </div>
        </Section>

        <Section label="Sections">
          <div className="space-y-1.5">
            {t.sections.map((s) => {
              const visible = t.sectionVisibility?.[s] !== false;
              return (
                <div key={s} className="flex items-center justify-between text-xs">
                  <span className="capitalize text-[var(--panel-muted)]">{s}</span>
                  <button
                    onClick={() => update("sectionVisibility", { ...(t.sectionVisibility ?? {}), [s]: !visible })}
                    className={`w-9 h-5 rounded-full relative transition-colors ${visible ? "bg-[var(--primary)]" : "bg-[var(--panel-elevated)]"}`}
                    aria-label={`Toggle ${s}`}
                    type="button"
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${visible ? "left-[18px]" : "left-0.5"}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </Section>

        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-white text-sm font-semibold opacity-60 cursor-not-allowed" style={{ background: "var(--gradient-primary)" }} disabled aria-disabled>
          <Wand2 className="w-4 h-4" />
          Regenerate Content
        </button>
        <p className="text-[10px] text-[var(--panel-muted)] text-center -mt-3">AI generation arrives in the next iteration.</p>
      </div>
    </aside>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-[var(--panel-muted)] mb-2">{label}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1 text-[10px] text-[var(--panel-muted)]">
      <span>{label}</span>
      <div className="relative h-8 rounded border border-[var(--panel-border)] overflow-hidden">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 w-full h-full cursor-pointer opacity-0" aria-label={`${label} color`} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: value }} />
      </div>
      <span className="text-[9px] font-mono text-[var(--panel-foreground)]">{value}</span>
    </label>
  );
}

function FontSelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-[10px] text-[var(--panel-muted)]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[var(--panel-elevated)] border border-[var(--panel-border)] rounded px-2 py-1.5 text-xs text-[var(--panel-foreground)] focus:outline-none focus:border-[var(--primary)]"
      >
        {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
      </select>
    </label>
  );
}

function SliderField({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit?: string; onChange: (v: number) => void }) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <div className="flex justify-between">
        <span className="text-[10px] text-[var(--panel-muted)]">{label}</span>
        <span className="text-[10px] font-mono text-[var(--panel-foreground)]">{value}{unit ?? ""}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-[var(--primary)]"
        aria-label={label}
      />
    </label>
  );
}