import type { Metadata } from "next";
import { HeroNav } from "@/components/hero/hero-nav";
import { ProjectReel } from "@/components/trabalhos/project-reel";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Trabalhos",
  description:
    "Projetos selecionados do estúdio Prumo — sites institucionais, apps e produtos digitais.",
  alternates: { canonical: "/trabalhos" },
  openGraph: { url: "/trabalhos" },
};

export default function TrabalhosPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <HeroNav />
      <main className="flex-1 overflow-hidden">
        <ProjectReel projects={projects} />
      </main>
    </div>
  );
}
