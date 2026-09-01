import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/reveal";
import { ProfileCard } from "@/components/effects/profile-card";
import type { ProfileCardProps } from "@/components/effects/profile-card";
import {
  CONTACT,
  buildWhatsappLink,
  WHATSAPP_DEFAULT_MESSAGE,
} from "@/lib/contact-config";

type Social = { label: string; href: string; external: boolean };

const BIANCHINI_SOCIAL: Social[] = [
  { label: "LinkedIn", href: CONTACT.linkedin, external: true },
  {
    label: "WhatsApp",
    href: buildWhatsappLink(WHATSAPP_DEFAULT_MESSAGE),
    external: true,
  },
  ...(CONTACT.instagram
    ? [{ label: "Instagram", href: CONTACT.instagram, external: true }]
    : []),
];

const CARVALHO_SITE = "https://www.dsguilherme.com.br/";

const CARVALHO_SOCIAL: Social[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/guilherme-carvalho-13a194293/?locale=en",
    external: true,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/carvalhoguilherme_/",
    external: true,
  },
  {
    label: "Behance",
    href: "https://www.behance.net/guilherguimara18/projects",
    external: true,
  },
  { label: "Portfólio", href: CARVALHO_SITE, external: true },
];

type CardProps = ProfileCardProps;

type Member = {
  kicker: string;
  name: string;
  headingId?: string;
  card: CardProps;
  socials: Social[];
  body: ReactNode;
};

const SHARED_CARD: Partial<CardProps> = {
  status: "Disponível",
  contactText: "Falar comigo",
  showUserInfo: true,
  enableTilt: true,
  behindGlowEnabled: true,
  behindGlowColor: "rgba(255,255,255,0.18)",
  innerGradient: "linear-gradient(145deg,#1a1a1f 0%,#0a0a0a 100%)",
};

const MEMBERS: Member[] = [
  {
    kicker: "Quem assina",
    name: "Guilherme Rocha Bianchini",
    headingId: "quem-assina-heading",
    card: {
      ...SHARED_CARD,
      avatarUrl: "/profile.png",
      name: "Guilherme Bianchini",
      title: "Engenheiro de Software",
      handle: "prumo_digital",
    },
    socials: BIANCHINI_SOCIAL,
    body: (
      <p className="mt-6 max-w-xl text-base text-white/70 md:text-lg">
        Engenheiro de software com ênfase em desenvolvimento web. Venho
        construindo presenças digitais há alguns anos: sites, sistemas e
        produtos pensados com precisão técnica e cuidado de design. Atendimento
        direto, do briefing à entrega.
      </p>
    ),
  },
  {
    kicker: "Equipe",
    name: "Guilherme Carvalho Guimarães",
    card: {
      ...SHARED_CARD,
      avatarUrl: "/profile-carvalho.jpg",
      name: "Guilherme Carvalho",
      title: "Designer",
      handle: "dsguilherme",
      contactHref: CARVALHO_SITE,
    },
    socials: CARVALHO_SOCIAL,
    body: (
      <div className="mt-6 max-w-xl space-y-4 text-base text-white/70 md:text-lg">
        <p>
          Sou Guilherme Carvalho Guimarães, designer gráfico especializado em
          criar soluções visuais inovadoras e eficazes. Com 7 anos de
          experiência, meu trabalho abrange desde identidades visuais até
          interfaces digitais, sempre com foco em estética e funcionalidade.
          Estou sempre em busca de novos desafios que me permitam aplicar
          criatividade e habilidades técnicas para transformar ideias em
          realidade.
        </p>
        <p>
          Nascido e criado na cidade de Uberlândia-MG, aos 18 anos decidi
          começar a atuar com o design gráfico de fato, sendo aquilo que eu mais
          gostava, me mudando para São Paulo-SP, tendo a expectativa de me
          especializar no assunto.
        </p>
      </div>
    ),
  },
];

function MemberRow({ member }: { member: Member }) {
  return (
    <Reveal className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[2fr_3fr] md:gap-16">
      <div className="flex justify-center">
        <ProfileCard {...member.card} />
      </div>

      <div className="flex flex-col justify-center">
        <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
          {member.kicker}
        </span>
        <h2
          {...(member.headingId ? { id: member.headingId } : {})}
          className="font-display mt-3 text-3xl font-semibold leading-[1.05] tracking-tight md:text-5xl"
        >
          {member.name}
        </h2>
        {member.body}

        <ul className="mt-8 flex flex-wrap gap-6 text-sm text-white">
          {member.socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                {...(s.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
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
  );
}

export function QuemAssina() {
  return (
    <section
      id="quem-assina"
      className="relative flex flex-col gap-24 px-6 py-24 md:gap-32 md:py-32"
      aria-labelledby="quem-assina-heading"
    >
      {MEMBERS.map((member) => (
        <MemberRow key={member.name} member={member} />
      ))}
    </section>
  );
}
