import Link from "next/link";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { Logo } from "@/components/ui/logo";

const NAV = [
  { href: "/trabalhos", label: "Trabalhos" },
  { href: "/planos", label: "Planos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function HeroNav() {
  return (
    <nav className="relative z-20 px-4 py-4 md:px-6 md:py-6">
      <LiquidGlass className="mx-auto flex max-w-5xl flex-col items-stretch gap-3 rounded-3xl px-4 py-3 md:grid md:grid-cols-3 md:items-center md:gap-0 md:rounded-full md:px-6">
        <div className="flex items-center justify-between md:contents">
          <Link href="/" aria-label="Prumo, página inicial" className="text-white">
            <Logo />
          </Link>
          <Link
            href="/contato"
            className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-white md:hidden"
          >
            Agendar
          </Link>
        </div>
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm font-bold text-white md:gap-6">
          {NAV.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="group relative inline-block py-1 transition-transform duration-300 ease-out hover:-translate-y-0.5"
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
        <div className="hidden justify-end md:flex">
          <LiquidGlass
            as="a"
            href="/contato"
            className="rounded-full px-5 py-2 text-sm font-medium text-white"
          >
            Agendar conversa
          </LiquidGlass>
        </div>
      </LiquidGlass>
    </nav>
  );
}
