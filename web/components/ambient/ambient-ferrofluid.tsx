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
  opacity = 0.95,
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
            speed={0.3}
            scale={1.7}
            glow={2.4}
            mouseInteraction={false}
            className="absolute inset-0"
          />
          {/* Véu leve. O anterior somava 55–70% de preto sobre um shader já
              a 55% de opacidade, e o fluido sumia. Aqui ele ainda recua para
              trás do texto, mas continua visível. */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/30 to-black/40" />
          <div
            className="absolute inset-0 opacity-[0.05] mix-blend-screen"
            style={{ backgroundImage: GRAIN_SVG }}
          />
          {/* Fades mais longos que os 160px do vídeo antigo: a entrada vem
              do hero e a saída vai pro FAQ, e a transição precisa acontecer
              devagar o bastante pra não virar uma borda. */}
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-black via-black/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/60 to-transparent" />
          {spotlight && <Spotlight />}
        </div>
      </div>
      {children}
    </div>
  );
}
