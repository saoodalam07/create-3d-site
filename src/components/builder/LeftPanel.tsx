import { useMemo, useState } from "react";
import { INDUSTRIES, TEMPLATES, type Industry, type Template } from "@/lib/templates";
import { MiniPreview } from "./MiniPreview";
import { apply } from "@/lib/templateEngine";
import { useEngineState } from "@/hooks/useTemplateEngine";
import { Search, Sparkles } from "lucide-react";

export function LeftPanel() {
  const [tab, setTab] = useState<Industry | "All">("All");
  const [q, setQ] = useState("");
  const { activeTemplate } = useEngineState();

  const filtered = useMemo(() => {
    let list: Template[] = TEMPLATES;
    if (tab !== "All") list = list.filter((t) => t.industry === tab);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((t) => t.name.toLowerCase().includes(s) || t.industry.toLowerCase().includes(s) || t.mood.toLowerCase().includes(s));
    }
    return list;
  }, [tab, q]);

  return (
    <aside className="w-[280px] shrink-0 bf-panel border-r border-[var(--panel-border)] flex flex-col h-screen">
      <div className="px-4 pt-4 pb-3 border-b border-[var(--panel-border)]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-[var(--panel-foreground)]">BuildForge</div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--panel-muted)]">Studio</div>
          </div>
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--panel-muted)]" />
          <input
            aria-label="Search templates"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search 100 templates…"
            className="w-full h-8 pl-8 pr-2 text-xs rounded-md bg-[var(--panel-elevated)] text-[var(--panel-foreground)] placeholder:text-[var(--panel-muted)] border border-[var(--panel-border)] focus:outline-none focus:border-[var(--primary)]"
          />
        </div>
      </div>

      <div className="px-2 py-2 border-b border-[var(--panel-border)] overflow-x-auto bf-scroll">
        <div className="flex gap-1">
          {(["All", ...INDUSTRIES] as const).map((tabName) => (
            <button
              key={tabName}
              onClick={() => setTab(tabName)}
              className={`px-2.5 py-1 text-[10px] rounded-md whitespace-nowrap transition-colors ${
                tab === tabName
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--panel-muted)] hover:text-[var(--panel-foreground)] hover:bg-[var(--panel-hover)]"
              }`}
            >
              {tabName}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bf-scroll p-3 space-y-3">
        <div className="text-[10px] uppercase tracking-wider text-[var(--panel-muted)] flex justify-between">
          <span>{filtered.length} templates</span>
          {tab !== "All" && <span className="text-[var(--panel-foreground)]">{tab}</span>}
        </div>
        {filtered.map((t) => {
          const active = t.templateId === activeTemplate;
          return (
            <button
              key={t.templateId}
              onClick={() => apply(t.templateId)}
              className={`bf-thumb-card relative w-full text-left rounded-lg p-2 border transition-all ${
                active
                  ? "border-[var(--primary)] bg-[var(--panel-hover)]"
                  : "border-[var(--panel-border)] hover:border-white/20"
              }`}
              aria-label={`Apply template ${t.name}`}
            >
              <div className="relative h-[100px] mb-2 rounded-md overflow-hidden bg-black/40">
                <div className="absolute inset-0 bf-thumb-3d">
                  <MiniPreview t={t} />
                </div>
                <div className="bf-thumb-apply absolute bottom-0 left-0 right-0 px-2 py-1 text-[10px] font-semibold text-white text-center" style={{ background: "var(--gradient-primary)" }}>
                  Apply Template
                </div>
                <div className="bf-thumb-preview absolute top-1 right-1 text-[9px] px-1.5 py-0.5 rounded bg-black/60 text-white">
                  Live Preview
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="text-xs font-semibold text-[var(--panel-foreground)] truncate">{t.name}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded shrink-0" style={{ background: t.accentColor + "33", color: t.accentColor }}>
                  {t.industry.slice(0,3).toUpperCase()}
                </span>
              </div>
              <div className="text-[10px] text-[var(--panel-muted)]">{t.mood}</div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}