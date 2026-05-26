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
    <nav className="relative z-20 px-6 py-6">
      <LiquidGlass className="mx-auto grid max-w-5xl grid-cols-3 items-center rounded-full px-6 py-3">
        <Link href="/" aria-label="Prumo, página inicial" className="text-white">
          <Logo />
        </Link>
        <ul className="hidden items-center justify-center gap-6 text-sm font-bold text-white md:flex">
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
        <div className="flex justify-end">
          <LiquidGlass
            as="a"
            href="https://cal.com/"
            className="rounded-full px-5 py-2 text-sm font-medium text-white"
          >
            Agendar conversa
          </LiquidGlass>
        </div>
      </LiquidGlass>
    </nav>
  );
}
