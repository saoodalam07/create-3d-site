import { useEffect, useState, useRef } from "react";
import { useEngineState } from "@/hooks/useTemplateEngine";
import { getMergedTemplate } from "@/lib/templateEngine";
import { HeroEngine } from "./HeroEngine";
import { Monitor, Smartphone, Tablet } from "lucide-react";

export function CenterPanel() {
  const { activeTemplate } = useEngineState();
  const [morphKey, setMorphKey] = useState(0);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const t = getMergedTemplate();
  const prev = useRef<string>(activeTemplate);

  useEffect(() => {
    if (prev.current !== activeTemplate) {
      setMorphKey((k) => k + 1);
      prev.current = activeTemplate;
    }
  }, [activeTemplate]);

  const widthClass = device === "desktop" ? "max-w-none" : device === "tablet" ? "max-w-3xl" : "max-w-sm";

  return (
    <main className="flex-1 flex flex-col bg-[var(--background)] overflow-hidden">
      <div className="h-12 px-4 flex items-center justify-between border-b bg-white">
        <div className="flex items-center gap-3">
          <div className="text-xs text-muted-foreground">Live Preview</div>
          <span className="px-2 py-0.5 text-[10px] rounded-full" style={{ background: t.primaryColor + "22", color: t.primaryColor }}>
            {t.industry}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">{t.templateId}</span>
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-md p-0.5">
          <DeviceBtn icon={<Monitor className="w-3.5 h-3.5" />} active={device === "desktop"} onClick={() => setDevice("desktop")} label="Desktop" />
          <DeviceBtn icon={<Tablet className="w-3.5 h-3.5" />} active={device === "tablet"} onClick={() => setDevice("tablet")} label="Tablet" />
          <DeviceBtn icon={<Smartphone className="w-3.5 h-3.5" />} active={device === "mobile"} onClick={() => setDevice("mobile")} label="Mobile" />
        </div>
      </div>

      <div className="flex-1 overflow-auto bf-scroll p-8 flex items-start justify-center">
        <div className={`bf-browser w-full ${widthClass} transition-all duration-300`}>
          <div className="h-9 flex items-center gap-2 px-3 border-b bg-slate-50">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <div className="ml-3 flex-1 flex items-center">
              <div className="bg-white rounded-md px-3 py-1 text-[11px] text-slate-500 font-mono border w-full max-w-md">
                https://{t.name.toLowerCase().replace(/\s/g, "")}.com
              </div>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 ml-3">{t.mood}</span>
          </div>

          <div key={morphKey} className="bf-morph">
            <HeroEngine
              industry={t.industry}
              headline={t.headline}
              subline={t.subline}
              primary={t.primaryColor}
              secondary={t.secondaryColor}
              accent={t.accentColor}
              ctaLabel={t.ctaLabel}
              background={t.backgroundType}
              headlineFont={t.headlineFont}
              bodyFont={t.bodyFont}
              tiltMax={t.tiltMax ?? 6}
              parallax={t.parallax ?? 0.5}
              particleDensity={t.particleDensity ?? 80}
              stats={t.stats}
            />

            {t.sectionVisibility?.stats !== false && (
              <section className="px-10 py-12 bg-white border-t bf-section-rise" style={{ animationDelay: "60ms" }}>
                <div className="grid grid-cols-3 gap-6">
                  {t.stats.map((s, i) => (
                    <div key={i} className="text-center">
                      <div className="text-4xl font-bold mb-1" style={{ color: t.primaryColor, fontFamily: t.headlineFont }}>{s.number}</div>
                      <div className="text-xs uppercase tracking-wider text-slate-500" style={{ fontFamily: t.bodyFont }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {t.sectionVisibility?.services !== false && (
              <section className="px-10 py-16 bg-slate-50 border-t bf-section-rise" style={{ animationDelay: "120ms" }}>
                <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: t.headlineFont, color: "#0f172a" }}>What We Do</h2>
                <p className="text-sm text-slate-600 mb-8" style={{ fontFamily: t.bodyFont }}>Services built for the {t.mood.replace(/-/g," ")} segment.</p>
                <div className="grid grid-cols-3 gap-4">
                  {t.services.map((s, i) => (
                    <div key={i} className="p-5 rounded-xl bg-white border hover:-translate-y-1 transition-transform" style={{ borderColor: t.primaryColor + "22" }}>
                      <div className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center text-white font-bold" style={{ background: `linear-gradient(135deg, ${t.primaryColor}, ${t.accentColor})` }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="font-semibold mb-1" style={{ fontFamily: t.headlineFont }}>{s.name}</div>
                      <p className="text-xs text-slate-600 leading-relaxed" style={{ fontFamily: t.bodyFont }}>{s.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {t.sectionVisibility?.about !== false && (
              <section className="px-10 py-16 bg-white border-t bf-section-rise" style={{ animationDelay: "180ms" }}>
                <div className="grid grid-cols-5 gap-8">
                  <div className="col-span-2">
                    <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">About</div>
                    <h2 className="text-3xl font-bold" style={{ fontFamily: t.headlineFont }}>Built different.<br />By design.</h2>
                  </div>
                  <div className="col-span-3 text-slate-600 leading-relaxed text-sm" style={{ fontFamily: t.bodyFont }}>
                    <p>{t.subline} Our team has shipped across the {t.industry.toLowerCase()} sector for years, blending craft and engineering rigor. Every project is treated like our own — measured, documented, and delivered on time. We believe the work should speak first.</p>
                  </div>
                </div>
              </section>
            )}

            <footer className="px-10 py-10 text-white bf-section-rise" style={{ background: `linear-gradient(135deg, ${t.primaryColor}, ${t.secondaryColor})`, animationDelay: "240ms" }}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="text-xl font-bold mb-1" style={{ fontFamily: t.headlineFont }}>{t.name}</div>
                  <div className="text-xs opacity-80">© {new Date().getFullYear()} · {t.industry}</div>
                </div>
                <button className="px-5 py-2.5 rounded-full bg-white text-sm font-semibold" style={{ color: t.primaryColor }}>
                  {t.ctaLabel}
                </button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}

function DeviceBtn({ icon, active, onClick, label }: { icon: React.ReactNode; active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} aria-label={label} className={`p-1.5 rounded transition-colors ${active ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
      {icon}
    </button>
  );
}