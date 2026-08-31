// Single source of truth for contact channels. Hardcoded on purpose:
// these are public surface (footer, /contato, /sobre) and never come
// from a CMS. Server-only secrets (Resend key, LEAD_TO) live in env.

export const CONTACT = {
  email: "guilherme@breq.com.br",
  whatsappE164: "+5534999194509",
  linkedin: "https://www.linkedin.com/company/prumo-digital/",
  instagram: "https://www.instagram.com/prumo_digital/" as string | null,
  // Entidade legal por trás da marca Prumo. Identificação do controlador
  // (LGPD) e prova de empresa registrada. Reusado no footer e nas páginas
  // legais (/privacidade, /termos).
  legalName: "Guilherme Rocha Bianchini Desenvolvimento de Software LTDA",
  cnpj: "67.822.658/0001-50",
} as const;

/**
 * Mensagem única de abertura no WhatsApp. Centralizada porque a home, o
 * footer, /sobre e /contato usavam textos diferentes (ou nenhum), e o
 * contexto da primeira linha é o que diz de onde a pessoa veio.
 */
export const WHATSAPP_DEFAULT_MESSAGE =
  "Oi, Guilherme! Vim pelo site da Prumo e queria falar sobre um projeto.";

export function buildWhatsappLink(prefilledMessage?: string): string {
  const digits = CONTACT.whatsappE164.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  if (!prefilledMessage) return base;
  const params = new URLSearchParams({ text: prefilledMessage });
  return `${base}?${params.toString()}`;
}

export function buildMailtoLink(subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const qs = params.toString();
  return qs ? `mailto:${CONTACT.email}?${qs}` : `mailto:${CONTACT.email}`;
}
