"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";

type ProjectReelProps = {
  projects: Project[];
};

export function ProjectReel({ projects }: ProjectReelProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (!container) return;
      const clamped = Math.max(0, Math.min(projects.length - 1, index));
      container.scrollTo({
        top: clamped * container.clientHeight,
        behavior: "smooth",
      });
    },
    [projects.length],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const slides = container.querySelectorAll<HTMLElement>("[data-slide-index]");

    const observer = new IntersectionObserver(
      (entries) => {
        let best: { index: number; ratio: number } | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const raw = entry.target.getAttribute("data-slide-index");
          if (raw == null) continue;
          const index = Number(raw);
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { index, ratio: entry.intersectionRatio };
          }
        }
        if (best && best.ratio > 0.6) setCurrentIndex(best.index);
      },
      { root: container, threshold: [0.25, 0.5, 0.75, 1] },
    );

    slides.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === projects.length - 1;

  return (
    <div className="relative h-full">
      <div
        ref={containerRef}
        className="h-full snap-y snap-proximity scroll-smooth overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        data-reel
      >
        {projects.map((project, index) => (
          <ReelSlide
            key={project.slug}
            project={project}
            index={index}
            total={projects.length}
            isCurrent={index === currentIndex}
          />
        ))}
      </div>

      <ReelControls
        currentIndex={currentIndex}
        total={projects.length}
        isFirst={isFirst}
        isLast={isLast}
        onPrev={() => goTo(currentIndex - 1)}
        onNext={() => goTo(currentIndex + 1)}
      />
    </div>
  );
}

type ReelControlsProps = {
  currentIndex: number;
  total: number;
  isFirst: boolean;
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
};

function ReelControls({
  currentIndex,
  total,
  isFirst,
  isLast,
  onPrev,
  onNext,
}: ReelControlsProps) {
  return (
    <div className="pointer-events-none absolute top-1/2 right-4 z-20 -translate-y-1/2 md:right-8">
      <div className="pointer-events-auto flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          aria-label="Projeto anterior"
          className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-black/50 disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-white/15 disabled:hover:bg-black/30"
        >
          <ArrowUp className="h-4 w-4 transition-transform duration-300 group-enabled:group-hover:-translate-y-0.5" />
        </button>

        <div
          aria-hidden="true"
          className="font-mono text-[10px] tracking-widest text-white/40"
        >
          {String(currentIndex + 1).padStart(2, "0")}
          <span className="mx-1 opacity-50">/</span>
          {String(total).padStart(2, "0")}
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={isLast}
          aria-label="Próximo projeto"
          className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-black/50 disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-white/15 disabled:hover:bg-black/30"
        >
          <ArrowDown className="h-4 w-4 transition-transform duration-300 group-enabled:group-hover:translate-y-0.5" />
        </button>
      </div>
    </div>
  );
}

type ReelSlideProps = {
  project: Project;
  index: number;
  total: number;
  isCurrent: boolean;
};

function ReelSlide({ project, index, total, isCurrent }: ReelSlideProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [active, setActive] = useState(index === 0);
  const isFirst = index === 0;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting && entry.intersectionRatio > 0.4;
        setActive(isVisible);
      },
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (isCurrent) {
      if (reduceMotion) return;
      video.load();
      video.play().catch(() => {});
    } else {
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        // ignore: stream may not be seekable yet
      }
    }
  }, [isCurrent]);

  return (
    <section
      ref={sectionRef}
      data-slide-index={index}
      className="relative flex h-full w-full snap-start items-end overflow-hidden bg-black"
      aria-label={`${project.title} · ${project.scope}`}
    >
      <video
        ref={videoRef}
        src={project.videoSrc}
        muted
        playsInline
        loop
        preload="none"
        className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1400ms] ease-out ${
          isCurrent ? "scale-100 opacity-60" : "scale-[1.04] opacity-0"
        }`}
        aria-hidden="true"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10"
      />

      <div
        className={`relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-20 transition-all duration-[1100ms] ease-out md:pb-28 ${
          active ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <div className="flex items-baseline justify-between gap-6 text-[11px] tracking-[0.3em] text-white/55 uppercase">
          <span>
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span>{project.year}</span>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-sm tracking-wide text-white/70">{project.scope}</p>
          <h2 className="font-display text-6xl leading-[0.9] tracking-[-0.03em] text-white md:text-8xl lg:text-[10rem]">
            {project.title}
          </h2>
          <p className="max-w-xl text-base text-white/70 md:text-lg">
            {project.summary}
          </p>
        </div>

        <div className="flex items-center gap-6 pt-4">
          <Link
            href={`/trabalhos/${project.slug}`}
            className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm text-white transition-colors hover:border-white/60"
          >
            Ler capítulo
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {isFirst && (
        <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce text-white/40">
          <ArrowDown className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Role para ver os próximos projetos</span>
        </div>
      )}
    </section>
  );
}
