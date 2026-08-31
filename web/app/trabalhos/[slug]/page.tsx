import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { HeroNav } from "@/components/hero/hero-nav";
import { Footer } from "@/components/footer/footer";
import { ProjectGallery } from "@/components/trabalhos/project-gallery";
import { CaseBlock } from "@/components/trabalhos/case-block";
import { CaseVideo } from "@/components/trabalhos/case-video";
import { Reveal } from "@/components/ui/reveal";
import { AuroraBlack } from "@/components/ambient/aurora-black";
import { getProject, getNextProject, projects } from "@/lib/projects";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/site";
import { breadcrumbNode, projectCreativeWorkNode } from "@/lib/schema";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Projeto não encontrado" };
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/trabalhos/${slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `/trabalhos/${slug}`,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const next = getNextProject(slug);

  const breadcrumb = breadcrumbNode([
    { name: "Trabalhos", url: `${SITE_URL}/trabalhos` },
    { name: project.title, url: `${SITE_URL}/trabalhos/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={projectCreativeWorkNode(project)} />
      <HeroNav />
      <main>
        <article className="relative">
          <header className="relative flex h-[80vh] min-h-[600px] w-full items-end overflow-hidden bg-black">
            <CaseVideo
              src={project.videoSrc}
              className="absolute inset-0 h-full w-full object-cover opacity-50"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10"
            />

            <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-20">
              <Reveal delay={0} duration={700} distance={12}>
                <Link
                  href="/trabalhos"
                  className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] text-white/55 uppercase transition-colors hover:text-white"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Trabalhos
                </Link>
              </Reveal>
              <Reveal delay={120} duration={800} distance={16}>
                <p className="mt-8 text-sm tracking-wide text-white/70">
                  {project.scope} · {project.year}
                </p>
              </Reveal>
              <Reveal delay={220} duration={900} distance={32}>
                <h1 className="font-display mt-4 text-6xl leading-[0.9] tracking-[-0.03em] text-white md:text-8xl lg:text-[10rem]">
                  {project.title}
                </h1>
              </Reveal>
              <Reveal delay={420} duration={900} distance={20}>
                <p className="mt-8 max-w-2xl text-base text-white/70 md:text-lg">
                  {project.summary}
                </p>
              </Reveal>
            </div>
          </header>

          <AuroraBlack>
            <section className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1fr_2fr] md:py-32">
              <aside className="space-y-6 text-sm text-white/70">
                <Meta label="Cliente" value={project.meta.cliente} />
                <Meta label="Setor" value={project.meta.setor} />
                <Meta label="Entrega" value={project.meta.entrega} />
                <Meta label="Ano" value={String(project.year)} />
              </aside>

              <div className="space-y-16">
                <CaseBlock title="Brief" body={project.brief} />
                <CaseBlock title="Processo" body={project.process} />
                <CaseBlock title="Resultado" body={project.outcome} />

                <ProjectGallery
                  title={project.title}
                  images={project.gallery}
                />
              </div>
            </section>
          </AuroraBlack>

          <div className="border-t border-white/10 px-6 py-16">
            <div className="mx-auto flex max-w-6xl justify-center">
              <Link
                href="/trabalhos"
                className="group inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-3.5 text-sm text-white transition-colors hover:border-white/60 hover:bg-white/[0.03]"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                Voltar para todos os trabalhos
              </Link>
            </div>
          </div>

          <section className="border-t border-white/10">
            <Link
              href={`/trabalhos/${next.slug}`}
              className="group relative block h-[60vh] min-h-[400px] w-full overflow-hidden bg-black"
            >
              <CaseVideo
                src={next.videoSrc}
                className="absolute inset-0 h-full w-full object-cover opacity-30 transition-opacity duration-700 group-hover:opacity-50"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20"
              />
              <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-6">
                <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
                  Próximo capítulo
                </span>
                <h2 className="font-display mt-4 text-5xl leading-[0.95] tracking-[-0.03em] text-white md:text-7xl lg:text-8xl">
                  {next.title}
                </h2>
                <span className="mt-6 inline-flex items-center gap-2 text-sm text-white/70 transition-colors group-hover:text-white">
                  Ler capítulo
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] tracking-[0.25em] text-white/40 uppercase">
        {label}
      </dt>
      <dd className="mt-2 text-white/80">{value}</dd>
    </div>
  );
}

