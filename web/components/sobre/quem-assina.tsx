import { Reveal } from "@/components/ui/reveal";
import { ProfileCard } from "@/components/effects/profile-card";
import { CONTACT, buildWhatsappLink } from "@/lib/contact-config";

type Social = { label: string; href: string; external: boolean };

const SOCIAL: Social[] = [
  { label: "LinkedIn", href: CONTACT.linkedin, external: true },
  {
    label: "WhatsApp",
    href: buildWhatsappLink("Oi! Vim do site da Prumo."),
    external: true,
  },
  ...(CONTACT.instagram
    ? [{ label: "Instagram", href: CONTACT.instagram, external: true }]
    : []),
];

const AVATAR_URL = "/profile.png";

export function QuemAssina() {
  return (
    <section
      id="quem-assina"
      className="relative px-6 py-24 md:py-32"
      aria-labelledby="quem-assina-heading"
    >
      <Reveal className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[2fr_3fr] md:gap-16">
        <div className="flex justify-center">
          <ProfileCard
            avatarUrl={AVATAR_URL}
            name="Guilherme Bianchini"
            title="Engenheiro de Software"
            handle="prumo"
            status="Disponível"
            contactText="Falar comigo"
            showUserInfo
            enableTilt
            behindGlowEnabled
            behindGlowColor="rgba(255,255,255,0.18)"
            innerGradient="linear-gradient(145deg,#1a1a1f 0%,#0a0a0a 100%)"
          />
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
            Quem assina
          </span>
          <h2
            id="quem-assina-heading"
            className="font-display mt-3 text-3xl font-semibold leading-[1.05] tracking-tight md:text-5xl"
          >
            Guilherme Rocha Bianchini
          </h2>
          <p className="mt-6 max-w-xl text-base text-white/70 md:text-lg">
            Engenheiro de software com ênfase em desenvolvimento web. Venho construindo presenças digitais há alguns anos — sites, sistemas e produtos pensados com precisão técnica e cuidado de design. Atendimento direto, do briefing à entrega.
          </p>

          <ul className="mt-8 flex flex-wrap gap-6 text-sm text-white">
            {SOCIAL.map((s) => (
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
    </section>
  );
}
