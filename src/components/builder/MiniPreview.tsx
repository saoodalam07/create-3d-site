import type { Template } from "@/lib/templates";

export function MiniPreview({ t }: { t: Template }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-md" style={{ background: `linear-gradient(135deg, ${t.primaryColor}, ${t.secondaryColor})` }}>
      <div className="absolute inset-0" style={{
        background: `radial-gradient(at 30% 20%, ${t.accentColor}55, transparent 50%), radial-gradient(at 80% 80%, ${t.primaryColor}88, transparent 60%)`,
      }} />
      <div className="absolute top-2 left-2 right-2 h-1.5 rounded-full bg-white/30" />
      <div className="absolute top-6 left-2 w-2/3 h-2 rounded bg-white/70" />
      <div className="absolute top-10 left-2 w-1/2 h-1.5 rounded bg-white/50" />
      <div className="absolute bottom-3 left-2 w-12 h-3 rounded-full" style={{ background: t.accentColor }} />
      <div className="absolute bottom-3 right-2 w-8 h-8 rounded-md bg-white/40 backdrop-blur-sm" />
    </div>
  );
}