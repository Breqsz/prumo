import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";

export function Prova({ cases }: { cases: Project[] }) {
  if (cases.length === 0) return null;
  return (
    <section
      id="prova"
      className="relative px-6 py-28 md:py-36"
      aria-labelledby="prova-heading"
    >
      <div className="mx-auto max-w-6xl">
        <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
          Trabalhos
        </span>
        <h2
          id="prova-heading"
          className="font-display mt-6 text-4xl tracking-tight text-white md:text-5xl"
        >
          O que já está no ar
        </h2>
        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {cases.map((p) => (
            <Link
              key={p.slug}
              href={`/trabalhos/${p.slug}`}
              className="group block"
              data-umami-event="prova_case"
              data-umami-event-case={p.slug}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-white/5">
                <Image
                  src={p.gallery[0]}
                  alt={p.title}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="mt-4 text-sm font-medium text-white">{p.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-white/50">
                {p.scope}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
