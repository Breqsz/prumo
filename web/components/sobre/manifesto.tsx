import { Reveal } from "@/components/ui/reveal";

export function Manifesto() {
  return (
    <section
      id="manifesto"
      className="relative px-6 py-24 md:py-32"
      aria-labelledby="manifesto-heading"
    >
      <Reveal className="mx-auto max-w-3xl">
        <h2
          id="manifesto-heading"
          className="text-[11px] font-normal tracking-[0.3em] text-white/55 uppercase"
        >
          Manifesto
        </h2>
        <div className="mt-8 space-y-8 text-xl leading-relaxed text-white/80 md:text-2xl md:leading-relaxed">
          <p>
            Prumo é a linha que marca onde a parede tem que ficar. O trabalho é esse: tirar o supérfluo até sobrar só o que sustenta o negócio.
          </p>
          <p>
            Quem atende é quem constrói. Sem gerente de conta, sem repasse, sem ruído entre o que você pede e o que entra no ar.
          </p>
          <p>
            Todo site aqui existe por um motivo:{" "}
            <strong className="font-semibold text-white">vender</strong>,{" "}
            <strong className="font-semibold text-white">profissionalizar</strong> ou{" "}
            <strong className="font-semibold text-white">lançar</strong>. O que não serve a isso não entra, nem no layout nem na conversa.
          </p>
          <p>
            Poucos projetos por ano, por escolha. É o que permite tratar o seu como se o nome da marca dependesse dele. Depende.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
