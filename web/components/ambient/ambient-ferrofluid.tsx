"use client";

import { Ferrofluid } from "@/components/ui/ferrofluid";
import { Spotlight } from "@/components/ambient/spotlight";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

const GRAIN_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")";

type AmbientFerrofluidProps = {
  children: React.ReactNode;
  /** Spotlight cinematográfico por cima do fundo. */
  spotlight?: boolean;
  /** Presença do fluido. Sobe onde a seção é larga e vazia. */
  opacity?: number;
};

/**
 * Fundo ambient em shader, no lugar dos vídeos que ocupavam de 3 a 19 MB.
 * Mantém a pilha de camadas do antigo `AmbientVideo` — véu escuro, grão,
 * fades de topo e base — porque é ela que faz o fundo virar textura em vez
 * de assunto. O que mudou é a fonte da imagem.
 *
 * Diferente do vídeo, roda também no celular: o shader custa alguns KB, e
 * era o peso do arquivo — não o movimento — que obrigava a suprimir o vídeo
 * em tela pequena.
 */
export function AmbientFerrofluid({
  children,
  spotlight = false,
  opacity = 0.55,
}: AmbientFerrofluidProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="relative isolate">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-black"
      >
        <div className="sticky top-0 h-dvh w-full overflow-hidden">
          <Ferrofluid
            paused={reduced}
            opacity={opacity}
            speed={0.32}
            scale={1.9}
            glow={1.5}
            mouseInteraction={false}
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/62 to-black/70" />
          <div
            className="absolute inset-0 opacity-[0.05] mix-blend-screen"
            style={{ backgroundImage: GRAIN_SVG }}
          />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
          {spotlight && <Spotlight />}
        </div>
      </div>
      {children}
    </div>
  );
}
