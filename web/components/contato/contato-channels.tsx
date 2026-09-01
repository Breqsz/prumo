import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  CONTACT,
  buildMailtoLink,
  buildWhatsappLink,
  WHATSAPP_DEFAULT_MESSAGE,
} from "@/lib/contact-config";

type Channel = {
  label: string;
  value: string;
  href: string;
  external: boolean;
};

function getChannels(): Channel[] {
  const channels: Channel[] = [
    {
      label: "WhatsApp",
      value: "Resposta direta, sem espera",
      href: buildWhatsappLink(WHATSAPP_DEFAULT_MESSAGE),
      external: true,
    },
    {
      label: "Email",
      value: CONTACT.email,
      href: buildMailtoLink("Conversa — Prumo"),
      external: false,
    },
    {
      label: "LinkedIn",
      value: "Pra quem prefere algo mais formal",
      href: CONTACT.linkedin,
      external: true,
    },
  ];
  if (CONTACT.instagram) {
    channels.push({
      label: "Instagram",
      value: "Trabalhos no dia a dia",
      href: CONTACT.instagram,
      external: true,
    });
  }
  return channels;
}

export function ContatoChannels() {
  const channels = getChannels();
  return (
    <aside
      aria-labelledby="contato-channels-heading"
      className="flex flex-col gap-8"
    >
      <div>
        <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
          Atalhos
        </span>
        <h2
          id="contato-channels-heading"
          className="font-display mt-3 text-2xl leading-tight tracking-tight md:text-3xl"
        >
          Se já decidiu, pula o formulário.
        </h2>
      </div>

      <ul className="flex flex-col gap-1">
        {channels.map((c) => (
          <li key={c.label}>
            <Link
              href={c.href}
              {...(c.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group flex items-center justify-between gap-4 border-b border-white/10 py-5 transition-colors hover:border-white/30"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[11px] tracking-[0.25em] text-white/55 uppercase">
                  {c.label}
                </span>
                <span className="text-base text-white">{c.value}</span>
              </div>
              <ArrowUpRight
                className="h-5 w-5 text-white/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                strokeWidth={1.5}
              />
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-sm text-white/55">
        Sem chatbot, sem formulário-armadilha. Quem responde é a mesma pessoa
        que vai tocar o projeto.
      </p>
    </aside>
  );
}
