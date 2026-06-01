import { createFileRoute } from "@tanstack/react-router";
import { LeftPanel } from "@/components/builder/LeftPanel";
import { CenterPanel } from "@/components/builder/CenterPanel";
import { RightPanel } from "@/components/builder/RightPanel";
import "@/lib/templateEngine";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BuildForge Studio — 3D Website Template Builder" },
      { name: "description", content: "Browse 100 industry templates and customize a live 3D website preview in real time." },
      { property: "og:title", content: "BuildForge Studio" },
      { property: "og:description", content: "3D website template builder with 100 industry-specific designs." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <LeftPanel />
      <CenterPanel />
      <RightPanel />
    </div>
  );
}
