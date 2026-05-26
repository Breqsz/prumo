import { Reveal } from "@/components/ui/reveal";

export function Manifesto() {
  return (
    <section
      id="manifesto"
      className="relative px-6 py-24 md:py-32"
      aria-labelledby="manifesto-heading"
    >
      <Reveal className="mx-auto max-w-3xl">
        <span
          id="manifesto-heading"
          className="text-[11px] tracking-[0.3em] text-white/55 uppercase"
        >
          Manifesto
        </span>
        {/* TODO: copy final do manifesto (dono refina) */}
        <div className="mt-8 space-y-8 text-xl leading-relaxed text-white/80 md:text-2xl md:leading-relaxed">
          <p>
            O Prumo é um <em className="font-display italic">estúdio solo</em>. Uma pessoa do briefing à entrega. Sem time inflado, sem camadas, sem teatro de agência.
          </p>
          <p>
            A gente faz <em className="font-display italic">poucos projetos por ano</em> e trata cada um como se carregasse o nome inteiro da marca — porque carrega.
          </p>
          <p>
            Sites devem vender, profissionalizar ou lançar. Tudo que não serve a um desses três objetivos sai do escopo antes da primeira linha de código.
          </p>
          <p>
            Premium aqui não é luxo. É <em className="font-display italic">precisão</em>: a peça certa, no peso certo, no lugar certo. Nada a mais.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
