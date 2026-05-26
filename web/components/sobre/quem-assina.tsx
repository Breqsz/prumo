import { Reveal } from "@/components/ui/reveal";
import { LiquidGlass } from "@/components/ui/liquid-glass";

type Social = { label: string; href: string };

// TODO: substituir hrefs por URLs reais (Instagram, LinkedIn, WhatsApp do dono)
const SOCIAL: Social[] = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "WhatsApp", href: "#" },
];

export function QuemAssina() {
  return (
    <section
      id="quem-assina"
      className="relative px-6 py-24 md:py-32"
      aria-labelledby="quem-assina-heading"
    >
      <Reveal className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[2fr_3fr] md:gap-16">
        {/* TODO: substituir por <Image> real com a foto do dono */}
        <LiquidGlass className="flex aspect-[4/5] items-center justify-center rounded-2xl">
          <span className="text-[10px] tracking-[0.3em] text-white/30 uppercase">
            Foto · placeholder
          </span>
        </LiquidGlass>

        <div className="flex flex-col justify-center">
          <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
            Quem assina
          </span>
          {/* TODO: trocar [Seu nome aqui] pelo nome real */}
          <h2
            id="quem-assina-heading"
            className="font-display mt-3 text-3xl font-semibold leading-[1.05] tracking-tight md:text-5xl"
          >
            [Seu nome aqui]
          </h2>
          {/* TODO: trocar bio placeholder por bio real do dono */}
          <p className="mt-6 max-w-xl text-base text-white/70 md:text-lg">
            Designer e desenvolvedor por trás do Prumo. Trabalho com sites e presença digital há [X] anos, com foco em marcas que valorizam precisão. Atendimento direto, do briefing à entrega.
          </p>

          <ul className="mt-8 flex flex-wrap gap-6 text-sm text-white">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  className="group relative inline-block py-1 transition-transform duration-300 ease-out hover:-translate-y-0.5"
                >
                  {s.label}
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 left-0 right-0 h-px origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:scale-x-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
