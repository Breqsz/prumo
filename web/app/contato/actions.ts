"use server";

import { Resend } from "resend";

export type SubmitState =
  | { status: "idle" }
  | { status: "ok" }
  | { status: "error"; message: string };

type FieldMap = {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budget: string;
  deadline: string;
  reference: string;
  message: string;
  source: string;
  // Honeypot — bots fill this; real users don't see it.
  website: string;
};

function readFields(formData: FormData): FieldMap {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  return {
    name: get("name"),
    email: get("email"),
    phone: get("phone"),
    company: get("company"),
    projectType: get("projectType"),
    budget: get("budget"),
    deadline: get("deadline"),
    reference: get("reference"),
    message: get("message"),
    source: get("source"),
    website: get("website"),
  };
}

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validate(f: FieldMap): string | null {
  if (f.name.length < 2) return "Preencha seu nome.";
  if (f.name.length > 100) return "Nome muito longo.";
  if (!f.email || !EMAIL_RE.test(f.email)) return "Email inválido.";
  if (f.phone) {
    const digits = f.phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15)
      return "Telefone inválido.";
  }
  if (!f.projectType) return "Selecione o tipo de projeto.";
  if (!f.budget) return "Selecione a faixa de orçamento.";
  if (!f.deadline) return "Selecione o prazo.";
  if (!f.message || f.message.length < 10)
    return "Escreva uma mensagem com pelo menos 10 caracteres.";
  if (f.message.length > 2000) return "Mensagem muito longa.";
  return null;
}

function buildEmailHtml(f: FieldMap): string {
  const rows: Array<[string, string]> = [
    ["Nome", f.name],
    ["Email", f.email],
    ["Telefone", f.phone || "—"],
    ["Empresa / projeto", f.company || "—"],
    ["Tipo de projeto", f.projectType],
    ["Faixa de orçamento", f.budget],
    ["Prazo", f.deadline],
    ["Referência", f.reference || "—"],
    ["Como encontrou", f.source || "—"],
  ];

  const tableRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#666;font-size:13px;">${k}</td><td style="padding:6px 0;font-size:14px;color:#111;">${escapeHtml(v)}</td></tr>`,
    )
    .join("");

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;">
      <h2 style="font-size:18px;margin:0 0 16px;color:#111;">Novo briefing — Prumo</h2>
      <table style="border-collapse:collapse;width:100%;">${tableRows}</table>
      <div style="margin-top:20px;padding-top:16px;border-top:1px solid #eee;">
        <div style="color:#666;font-size:13px;margin-bottom:8px;">Mensagem</div>
        <div style="white-space:pre-wrap;font-size:14px;color:#111;line-height:1.5;">${escapeHtml(f.message)}</div>
      </div>
    </div>
  `;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function submitContactForm(
  _prev: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  const fields = readFields(formData);

  // Honeypot: bots fill `website`. Silently succeed so they don't retry.
  if (fields.website) return { status: "ok" };

  const validationError = validate(fields);
  if (validationError) return { status: "error", message: validationError };

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "onboarding@resend.dev";
  const to = process.env.LEAD_TO;

  if (!apiKey || !to) {
    return {
      status: "error",
      message:
        "Configuração de envio ausente. Tente novamente em instantes ou use WhatsApp.",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to,
      replyTo: fields.email,
      subject: `Briefing — ${fields.name} (${fields.projectType})`,
      html: buildEmailHtml(fields),
    });

    if (result.error) {
      return {
        status: "error",
        message: "Não consegui enviar agora. Tenta de novo ou usa o WhatsApp.",
      };
    }

    return { status: "ok" };
  } catch {
    return {
      status: "error",
      message: "Erro inesperado. Use o WhatsApp como alternativa.",
    };
  }
}
