import { useEngineState } from "@/hooks/useTemplateEngine";
import { getMergedTemplate, setCustomization, resetCustomization, undo, downloadHTML, previewHTML, addPhoto, removePhoto } from "@/lib/templateEngine";
import type { BackgroundType } from "@/lib/templates";
import { Undo2, RotateCcw, Wand2, Download, ExternalLink, HardHat, Type, Image as ImageIcon, Plus, Trash2, PaintBucket, Layers, Settings2 } from "lucide-react";
import { useState } from "react";

const FONT_OPTIONS = ["Space Grotesk","Syne","Outfit","Sora","Urbanist","Instrument Serif","DM Serif Display","Cormorant","Bebas Neue","Archivo Black","Inter","DM Sans","Manrope","Work Sans","IBM Plex Sans","Karla","Nunito Sans","Hind","Cabin","Plus Jakarta Sans"];
const BG_OPTIONS: BackgroundType[] = ["particle-network","geometric-mesh","aurora","floating-shapes","video-loop","noise-grid","construction-3d","waterfall-3d","photo-parallax"];

export function RightPanel() {
  const { activeTemplate, templateHistory } = useEngineState();
  const t = getMergedTemplate();
  const [photoUrl, setPhotoUrl] = useState("");

  const update = (k: string, v: unknown) => setCustomization(activeTemplate, { [k]: v } as never);

  return (
    <aside className="w-[340px] shrink-0 bf-panel border-l border-[var(--panel-border)] flex flex-col h-screen relative">
      {/* Caution-stripe header accent */}
      <div className="bf-caution-stripe" />
      <div className="px-4 py-3 border-b border-[var(--panel-border)] flex items-center justify-between">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--panel-muted)] flex items-center gap-1.5">
            <HardHat className="w-3 h-3" /> Build Inspector
          </div>
          <div className="text-base font-extrabold text-[var(--panel-foreground)] truncate tracking-tight">{t.name}</div>
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
        <Section label="Color Palette" icon={<PaintBucket className="w-3 h-3" />}>
          <div className="grid grid-cols-3 gap-2">
            <ColorField label="Primary" value={t.primaryColor} onChange={(v) => update("primaryColor", v)} />
            <ColorField label="Secondary" value={t.secondaryColor} onChange={(v) => update("secondaryColor", v)} />
            <ColorField label="Accent" value={t.accentColor} onChange={(v) => update("accentColor", v)} />
          </div>
        </Section>

        <Section label="Typography" icon={<Type className="w-3 h-3" />}>
          <FontSelect label="Headline" value={t.headlineFont} onChange={(v) => update("headlineFont", v)} />
          <FontSelect label="Body" value={t.bodyFont} onChange={(v) => update("bodyFont", v)} />
        </Section>

        <Section label="Write Your Own Copy" icon={<Wand2 className="w-3 h-3" />}>
          <TextField label="Headline" value={t.headline} onChange={(v) => update("headline", v)} />
          <TextArea label="Subline" value={t.subline} onChange={(v) => update("subline", v)} />
          <TextField label="CTA Button" value={t.ctaLabel} onChange={(v) => update("ctaLabel", v)} />
        </Section>

        <Section label="Photo Gallery" icon={<ImageIcon className="w-3 h-3" />}>
          <div className="grid grid-cols-3 gap-1.5">
            {t.photos.map((url, i) => {
              const isExtra = (t.extraPhotos ?? []).includes(url);
              return (
                <div key={url + i} className="relative aspect-square rounded-md overflow-hidden border border-white/10 group">
                  <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  {isExtra && (
                    <button onClick={() => removePhoto(url)} className="absolute top-0.5 right-0.5 p-1 rounded bg-black/70 text-white opacity-0 group-hover:opacity-100" aria-label="Remove">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex gap-1.5">
            <input
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="Paste image URL…"
              className="flex-1 bg-[var(--panel-elevated)] border border-[var(--panel-border)] rounded px-2 py-1.5 text-xs text-[var(--panel-foreground)] placeholder:text-[var(--panel-muted)] focus:outline-none focus:border-[var(--primary)]"
            />
            <button onClick={() => { addPhoto(photoUrl); setPhotoUrl(""); }} className="bf-hex-btn px-3 text-xs font-bold text-white inline-flex items-center gap-1" style={{ background: "var(--gradient-primary)" }}>
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </Section>

        <Section label="3D & Motion" icon={<Settings2 className="w-3 h-3" />}>
          <SliderField label="Tilt Angle" value={t.tiltMax ?? 6} min={0} max={25} step={1} unit="°" onChange={(v) => update("tiltMax", v)} />
          <SliderField label="Parallax Intensity" value={t.parallax ?? 0.5} min={0} max={1} step={0.05} onChange={(v) => update("parallax", v)} />
          <SliderField label="Particle Density" value={t.particleDensity ?? 80} min={0} max={500} step={10} onChange={(v) => update("particleDensity", v)} />
        </Section>

        <Section label="Background" icon={<Layers className="w-3 h-3" />}>
          <div className="grid grid-cols-2 gap-1.5">
            {BG_OPTIONS.map((b) => {
              const active = t.backgroundType === b;
              return (
                <button key={b} onClick={() => update("backgroundType", b)} className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-2 rounded-md border transition-all ${active ? "border-[var(--primary)] bg-[var(--panel-hover)] text-[var(--panel-foreground)] shadow-[0_0_0_2px_var(--primary)_inset]" : "border-[var(--panel-border)] hover:bg-[var(--panel-hover)] text-[var(--panel-muted)]"}`}>
                  {b.replace(/-/g, " ")}
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

        <div className="pt-3 border-t border-[var(--panel-border)] space-y-2">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--panel-muted)] flex items-center gap-1.5">
            <HardHat className="w-3 h-3" /> Ship It
          </div>
          <button onClick={() => downloadHTML()} className="bf-hex-btn-lg w-full flex items-center justify-center gap-2 py-3 text-white text-sm font-extrabold uppercase tracking-wider transition-transform hover:scale-[1.02]" style={{ background: `linear-gradient(135deg, ${t.primaryColor}, ${t.accentColor})`, boxShadow: `0 12px 30px -10px ${t.primaryColor}99` }}>
            <Download className="w-4 h-4" />
            Download HTML
          </button>
          <button onClick={() => previewHTML()} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border-2 border-dashed border-[var(--panel-border)] text-[var(--panel-foreground)] hover:bg-[var(--panel-hover)]">
            <ExternalLink className="w-3.5 h-3.5" />
            Open Live Preview
          </button>
          <p className="text-[10px] text-[var(--panel-muted)] text-center">All your colors, fonts, copy &amp; photos baked in.</p>
        </div>
      </div>
      <div className="bf-caution-stripe" />
    </aside>
  );
}

function Section({ label, children, icon }: { label: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="bf-card">
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--panel-muted)] mb-3 flex items-center gap-2">
        <span className="w-5 h-5 rounded-md flex items-center justify-center text-white" style={{ background: "var(--gradient-primary)" }}>{icon}</span>
        {label}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-[10px] text-[var(--panel-muted)]">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="bg-[var(--panel-elevated)] border border-[var(--panel-border)] rounded px-2 py-1.5 text-xs text-[var(--panel-foreground)] focus:outline-none focus:border-[var(--primary)]" />
    </label>
  );
}
function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-[10px] text-[var(--panel-muted)]">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="bg-[var(--panel-elevated)] border border-[var(--panel-border)] rounded px-2 py-1.5 text-xs text-[var(--panel-foreground)] focus:outline-none focus:border-[var(--primary)] resize-none" />
    </label>
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