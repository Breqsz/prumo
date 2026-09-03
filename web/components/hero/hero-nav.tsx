import Link from "next/link";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { Logo } from "@/components/ui/logo";

const NAV = [
  { href: "/servicos", label: "Serviços" },
  { href: "/trabalhos", label: "Trabalhos" },
  { href: "/planos", label: "Planos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function HeroNav() {
  return (
    <nav className="relative z-20 px-4 py-4 md:px-6 md:py-6">
      {/*
        Colunas `auto_1fr_auto` a partir de md: com `1fr_auto_1fr` as colunas das
        pontas ficavam com ~139px em telas de 768px e quebravam "Agendar conversa"
        em duas linhas. Agora logo e botão pedem só o que precisam e a lista fica
        com a sobra.
      */}
      <LiquidGlass className="mx-auto flex max-w-5xl flex-col items-stretch gap-3 rounded-3xl px-4 py-3 md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:gap-4 md:rounded-full md:px-6">
        <div className="flex items-center justify-between md:contents">
          <Link href="/" aria-label="Prumo, página inicial" className="text-white">
            <Logo />
          </Link>
          <Link
            href="/contato"
            className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-white md:hidden"
            data-umami-event="cta_contato"
            data-umami-event-source="nav"
          >
            Agendar
          </Link>
        </div>
        {/*
          `text-xs` e `gap-x-4` no mobile: em text-sm com gap-x-5 os cinco rótulos
          somavam ~346px contra ~311px de faixa útil em 375px, e "Contato" caía
          sozinho numa terceira linha. `py-2` leva o alvo de toque de 28px para
          ~32px sem engordar a barra.
        */}
        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-bold text-white md:flex-nowrap md:gap-6 md:text-sm">
          {NAV.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="group relative inline-block py-2 whitespace-nowrap transition-transform duration-300 ease-out hover:-translate-y-0.5 md:py-1"
              >
                {label}
                <span
                  aria-hidden
                  className="absolute -bottom-0.5 left-0 right-0 h-px origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
              </Link>
            </li>
          ))}
        </ul>
        <div className="hidden md:flex md:items-center md:justify-end">
          <LiquidGlass
            as="a"
            href="/contato"
            className="rounded-full px-5 py-2 text-sm font-medium whitespace-nowrap text-white"
            data-umami-event="cta_contato"
            data-umami-event-source="nav"
          >
            Agendar conversa
          </LiquidGlass>
        </div>
      </LiquidGlass>
    </nav>
  );
}
