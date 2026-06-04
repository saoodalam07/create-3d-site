import { useEngineState } from "@/hooks/useTemplateEngine";
import { cancelPreview, confirmPreview, getMergedTemplate, previewHTML } from "@/lib/templateEngine";
import { TEMPLATES } from "@/lib/templates";
import { X, Check, ExternalLink, ArrowRight, HardHat } from "lucide-react";

export function TemplatePreviewModal() {
  const { pendingTemplate } = useEngineState();
  if (!pendingTemplate) return null;
  const current = getMergedTemplate();
  const incoming = TEMPLATES.find((t) => t.templateId === pendingTemplate);
  if (!incoming) return null;

  const previewIncoming = () => {
    // Open the incoming template's HTML in a new tab without applying.
    const saved = sessionStorage.getItem("bf-pending") ?? "";
    sessionStorage.setItem("bf-pending", saved);
    confirmPreview();
    setTimeout(() => previewHTML(), 50);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl" style={{ background: "linear-gradient(180deg,#1a1f2e,#0f1419)" }}>
        {/* Header */}
        <div className="relative h-44 overflow-hidden">
          <img src={incoming.photos[0]} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${incoming.primaryColor}cc, ${incoming.accentColor}99)` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <button onClick={cancelPreview} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-5 right-5 text-white flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] opacity-90">
                <HardHat className="w-3.5 h-3.5" /> Template Review
              </div>
              <h2 className="text-2xl font-bold leading-tight truncate" style={{ fontFamily: incoming.headlineFont }}>{incoming.name}</h2>
              <div className="text-xs opacity-80">{incoming.industry} · {incoming.mood}</div>
            </div>
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-white/20">{incoming.templateId}</span>
          </div>
        </div>

        {/* Diff */}
        <div className="p-5 grid grid-cols-2 gap-4 text-white">
          <DiffCard title="Before" t={current} />
          <DiffCard title="After" t={incoming} highlight />
        </div>

        {/* Change list */}
        <div className="px-5 pb-4 text-white/80 text-xs">
          <div className="text-[10px] uppercase tracking-wider mb-2 text-white/50">What will change</div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
            <ChangeRow label="Primary color" from={current.primaryColor} to={incoming.primaryColor} />
            <ChangeRow label="Accent color" from={current.accentColor} to={incoming.accentColor} />
            <ChangeRow label="Headline font" from={current.headlineFont} to={incoming.headlineFont} />
            <ChangeRow label="Body font" from={current.bodyFont} to={incoming.bodyFont} />
            <ChangeRow label="Background" from={current.backgroundType} to={incoming.backgroundType} />
            <ChangeRow label="Sections" from={`${current.sections.length}`} to={`${incoming.sections.length}`} />
          </ul>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 border-t border-white/10 flex items-center justify-between gap-2 bg-black/30">
          <button onClick={cancelPreview} className="px-4 py-2 text-xs text-white/70 hover:text-white">Cancel</button>
          <div className="flex gap-2">
            <button onClick={previewIncoming} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border border-white/15 text-white hover:bg-white/5">
              <ExternalLink className="w-3.5 h-3.5" /> Open Live Preview
            </button>
            <button onClick={confirmPreview} className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${incoming.primaryColor}, ${incoming.accentColor})` }}>
              <Check className="w-3.5 h-3.5" /> Apply Template <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiffCard({ title, t, highlight }: { title: string; t: { primaryColor: string; secondaryColor: string; accentColor: string; headlineFont: string; bodyFont: string; backgroundType: string; photos?: string[] }; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 ${highlight ? "border-white/30 bg-white/5" : "border-white/10 bg-black/20"}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] uppercase tracking-widest text-white/50">{title}</div>
        {highlight && <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300">Incoming</span>}
      </div>
      <div className="flex gap-1.5 mb-2">
        <Swatch c={t.primaryColor} /><Swatch c={t.secondaryColor} /><Swatch c={t.accentColor} />
      </div>
      <div className="text-xs font-semibold truncate" style={{ fontFamily: t.headlineFont }}>{t.headlineFont}</div>
      <div className="text-[10px] text-white/60" style={{ fontFamily: t.bodyFont }}>Body · {t.bodyFont}</div>
      <div className="text-[10px] mt-1 text-white/50">BG: {t.backgroundType}</div>
    </div>
  );
}
function Swatch({ c }: { c: string }) {
  return <div className="w-6 h-6 rounded border border-white/20" style={{ background: c }} title={c} />;
}
function ChangeRow({ label, from, to }: { label: string; from: string; to: string }) {
  const changed = from !== to;
  return (
    <li className="flex items-center justify-between gap-2 py-0.5">
      <span className="text-white/60">{label}</span>
      <span className={`flex items-center gap-1.5 ${changed ? "text-white" : "text-white/40"}`}>
        <span className="font-mono truncate max-w-[80px]">{from}</span>
        <ArrowRight className="w-3 h-3" />
        <span className={`font-mono truncate max-w-[80px] ${changed ? "text-emerald-300" : ""}`}>{to}</span>
      </span>
    </li>
  );
}