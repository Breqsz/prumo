"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

type ProjectGalleryProps = {
  title: string;
  images: string[];
};

/**
 * Per-project gallery: a grid of screenshots with a hover affordance that opens
 * a fullscreen lightbox (fade + scale) with keyboard / arrow navigation.
 * CSS-only animation to stay consistent with the rest of the site (no framer-motion).
 */
export function ProjectGallery({ title, images }: ProjectGalleryProps) {
  const [index, setIndex] = useState<number | null>(null);
  const isOpen = index !== null;
  const lastFocused = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const open = useCallback((i: number) => {
    lastFocused.current = document.activeElement as HTMLElement | null;
    setIndex(i);
  }, []);

  const close = useCallback(() => setIndex(null), []);

  const go = useCallback(
    (dir: number) =>
      setIndex((i) =>
        i === null ? i : (i + dir + images.length) % images.length,
      ),
    [images.length],
  );

  // Keyboard nav + body scroll lock while the lightbox is open. Restore focus
  // to the thumbnail that opened it on close.
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      lastFocused.current?.focus();
    };
  }, [isOpen, close, go]);

  return (
    <>
      <div
        className="grid gap-4 sm:grid-cols-2"
        aria-label={`Galeria de ${title}`}
      >
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => open(i)}
            aria-label={`Ampliar ${title} — captura ${i + 1}`}
            className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-plumb"
          >
            <Image
              src={src}
              alt={`${title} — captura ${i + 1}`}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-black/0 transition-colors duration-[400ms] group-hover:bg-black/30"
            />
            <span
              aria-hidden
              className="absolute top-3 right-3 grid h-9 w-9 translate-y-1 place-items-center rounded-lg border border-white/20 bg-black/50 text-white opacity-0 backdrop-blur-sm transition-all duration-[400ms] group-hover:translate-y-0 group-hover:opacity-100"
            >
              <Maximize2 className="h-4 w-4" />
            </span>
          </button>
        ))}
      </div>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Galeria de ${title} em tela cheia`}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          className="prumo-lightbox-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-black/[0.92] p-6 backdrop-blur-md"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Fechar galeria"
            className="absolute top-5 right-5 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white transition-colors hover:border-white/40 hover:bg-white/[0.14]"
          >
            <X className="h-5 w-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Imagem anterior"
                className="absolute top-1/2 left-4 grid h-13 w-13 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white transition-colors hover:border-white/40 hover:bg-white/[0.14] md:left-[4vw]"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Próxima imagem"
                className="absolute top-1/2 right-4 grid h-13 w-13 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white transition-colors hover:border-white/40 hover:bg-white/[0.14] md:right-[4vw]"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="prumo-lightbox-panel relative h-[78vh] w-full max-w-[1100px]">
            <Image
              src={images[index]}
              alt={`${title} — captura ${index + 1}`}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </div>

          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] tracking-[0.3em] text-white/60 uppercase">
            {index + 1} / {images.length}
          </span>
        </div>
      )}
    </>
  );
}
