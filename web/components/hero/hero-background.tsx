"use client";

import { Ferrofluid } from "@/components/ui/ferrofluid";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

/**
 * Fundo do hero. Era uma playlist de três clipes somando 16 MB, suprimida
 * no celular por peso — o que deixava a primeira tela do visitante indicado
 * com fundo chapado justamente onde a primeira impressão acontece.
 *
 * Agora é o mesmo ferrofluido do resto do site, com mais presença do que no
 * ambient: aqui ele é a imagem, não a textura por baixo do texto. A vinheta
 * e o gradiente de base seguem intactos — são eles que puxam o olho para o
 * centro e dão matéria ao preto.
 */
export function HeroBackground() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #000 0%, #0a0a0a 60%, #050505 100%)",
        }}
      />
      <Ferrofluid
        paused={reduced}
        opacity={0.8}
        speed={0.26}
        scale={1.5}
        glow={2.2}
        mouseInteraction
        mouseStrength={0.5}
        mouseRadius={0.3}
        className="absolute inset-0"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </div>
  );
}
