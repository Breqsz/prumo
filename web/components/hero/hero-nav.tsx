import Link from "next/link";
import { LiquidGlass } from "@/components/ui/liquid-glass";

const NAV = [
  { href: "/trabalhos", label: "Trabalhos" },
  { href: "/planos", label: "Planos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function HeroNav() {
  return (
    <nav className="relative z-20 px-6 py-6">
      <LiquidGlass className="mx-auto flex max-w-5xl items-center justify-between rounded-full px-6 py-3">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-display flex items-center gap-2 text-xl text-white"
          >
            <span aria-hidden className="inline-block h-5 w-[2px] bg-white/80" />
            Prumo
          </Link>
          <ul className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            {NAV.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="transition-colors hover:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/"
            className="hidden text-sm text-white/70 transition-colors hover:text-white md:inline-block"
          >
            WhatsApp
          </a>
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
