// Single source of truth for contact channels. Hardcoded on purpose:
// these are public surface (footer, /contato, /sobre) and never come
// from a CMS. Server-only secrets (Resend key, LEAD_TO) live in env.

export const CONTACT = {
  email: "guilherme@breq.com.br",
  whatsappE164: "+5534999194509",
  linkedin: "https://www.linkedin.com/in/guilhermebreq/",
  // Instagram coming soon — leaving null so callers can branch on it
  // instead of rendering a dead `#` link.
  instagram: null as string | null,
} as const;

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
