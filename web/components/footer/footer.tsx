import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { Logo } from "@/components/ui/logo";

const NAV = {
  Estúdio: [
    { href: "/sobre", label: "Sobre" },
    { href: "/trabalhos", label: "Trabalhos" },
    { href: "/planos", label: "Planos" },
  ],
  Conversar: [
    { href: "/contato", label: "Agendar conversa" },
    { href: "/contato", label: "Mandar mensagem" },
    { href: "https://wa.me/", label: "WhatsApp" },
  ],
  Geral: [
    { href: "/privacidade", label: "Privacidade" },
    { href: "/termos", label: "Termos" },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/8 px-6 pt-24 pb-10 md:pt-32">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[1.6fr_1fr_1fr_1fr] md:gap-12">
        <Reveal className="flex flex-col gap-5">
          <Link
            href="/"
            aria-label="Prumo, página inicial"
            className="text-white"
          >
            <Logo />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-white/55">
            Sites, estratégia e presença digital para marcas que valorizam
            precisão.
          </p>
        </Reveal>

        {Object.entries(NAV).map(([title, items], i) => (
          <Reveal
            key={title}
            delay={(i + 1) * 100}
            distance={16}
            className="flex flex-col gap-5"
          >
            <h4 className="text-[11px] tracking-[0.3em] text-white/45 uppercase">
              {title}
            </h4>
            <ul className="flex flex-col gap-3">
              {items.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/75 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <Reveal
        delay={400}
        distance={12}
        className="mx-auto mt-20 flex max-w-6xl flex-col items-start justify-between gap-4 border-t border-white/8 pt-8 text-xs text-white/45 md:flex-row md:items-center"
      >
        <span>© {year} Prumo. Todos os direitos reservados.</span>
        <span className="tracking-widest uppercase">
          Estúdio digital · Brasil
        </span>
      </Reveal>
    </footer>
  );
}
