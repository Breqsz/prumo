import type { Metadata } from "next";
import { HeroNav } from "@/components/hero/hero-nav";
import { ProjectReel } from "@/components/trabalhos/project-reel";
import { projects } from "@/lib/projects";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbNode } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Trabalhos",
  description:
    "Projetos selecionados do estúdio Prumo: sites institucionais, apps e produtos digitais.",
  alternates: { canonical: "/trabalhos" },
  openGraph: { url: "/trabalhos" },
};

export default function TrabalhosPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <JsonLd
        data={breadcrumbNode([
          { name: "Início", url: `${SITE_URL}/` },
          { name: "Trabalhos", url: `${SITE_URL}/trabalhos` },
        ])}
      />
      <HeroNav />
      <h1 className="sr-only">Trabalhos selecionados — Prumo</h1>
      <main className="flex-1 overflow-hidden">
        <ProjectReel projects={projects} />
      </main>
    </div>
  );
}
