"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { submitContactForm, type SubmitState } from "@/app/contato/actions";
import { buildWhatsappLink } from "@/lib/contact-config";
import { track } from "@/lib/analytics";

const PROJECT_TYPES = [
  "Landing page",
  "Site institucional",
  "Projeto Branded (completo)",
  "Manutenção mensal",
  "Redesign de site existente",
  "Algo fora do padrão / customizado",
];

const BUDGETS = [
  "Até R$ 5k",
  "R$ 5k – R$ 15k",
  "R$ 15k – R$ 25k",
  "Acima de R$ 25k",
  "Manutenção mensal (recorrente)",
  "Ainda definindo",
];

const DEADLINES = [
  "Tô com pressa (até 30 dias)",
  "Próximos 2-3 meses",
  "Sem pressa, planejando",
  "Não sei ainda",
];

const SOURCES = [
  "Indicação",
  "Instagram",
  "LinkedIn",
  "Google",
  "Já conhecia o trabalho",
  "Outro",
];

type Fields = {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budget: string;
  deadline: string;
  reference: string;
  source: string;
  message: string;
};

const INITIAL_FIELDS: Fields = {
  name: "",
  email: "",
  phone: "",
  company: "",
  projectType: "",
  budget: "",
  deadline: "",
  reference: "",
  source: "",
  message: "",
};

const initialState: SubmitState = { status: "idle" };

// Pragmatic email check: catches the 99% (missing @, missing TLD, missing
// dot, spaces). Stricter regexes start rejecting valid edge-case emails
// without measurable spam benefit — server validates again as backup.
const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Accepts http/https URLs, or bare domains (we'll let the user paste
// "site.com.br" without forcing the protocol).
const BARE_DOMAIN_RE = /^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i;
const URL_RE = /^https?:\/\/[^\s]+$/i;

export function validateFields(f: Fields): string | null {
  const name = f.name.trim();
  if (name.length < 2) return "Preencha seu nome (mínimo 2 caracteres).";
  if (name.length > 100) return "Nome muito longo (máximo 100 caracteres).";

  const email = f.email.trim();
  if (!email) return "Preencha seu email.";
  if (!EMAIL_RE.test(email))
    return "Email inválido. Confere se tem @ e domínio completo.";

  const phone = f.phone.trim();
  if (phone) {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15)
      return "Telefone inválido. Use (XX) XXXXX-XXXX ou inclua DDI.";
  }

  if (f.company.trim().length > 100)
    return "Nome de empresa/projeto muito longo (máximo 100 caracteres).";

  if (!f.projectType) return "Selecione o tipo de projeto.";
  if (!f.budget) return "Selecione a faixa de orçamento.";
  if (!f.deadline) return "Selecione o prazo desejado.";

  const ref = f.reference.trim();
  if (ref && !URL_RE.test(ref) && !BARE_DOMAIN_RE.test(ref))
    return "Referência precisa ser um link válido (ex: site.com.br).";

  const msg = f.message.trim();
  if (msg.length < 10)
    return "Mensagem muito curta — escreva pelo menos 10 caracteres.";
  if (msg.length > 2000)
    return "Mensagem muito longa (máximo 2000 caracteres).";

  return null;
}

export function ContatoForm() {
  const [state, formAction, actionPending] = useActionState(
    submitContactForm,
    initialState,
  );
  const [fields, setFields] = useState<Fields>(INITIAL_FIELDS);
  const [clientError, setClientError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const pending = actionPending || isPending;

  useEffect(() => {
    if (state.status === "ok") track("form_submit");
  }, [state.status]);

  function update<K extends keyof Fields>(key: K, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
    if (clientError) setClientError(null);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const error = validateFields(fields);
    if (error) {
      setClientError(error);
      return;
    }
    setClientError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(() => formAction(fd));
  }

  if (state.status === "ok") {
    return <SuccessPanel />;
  }

  const errorMessage =
    clientError ?? (state.status === "error" ? state.message : null);

  return (
    <form onSubmit={onSubmit} className="grid gap-6" noValidate>
      {/* Honeypot: hidden from real users, bots fill it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
      >
        <label>
          Não preencha este campo
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field
          label="Nome"
          name="name"
          required
          autoComplete="name"
          value={fields.name}
          onChange={(v) => update("name", v)}
          maxLength={100}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={fields.email}
          onChange={(v) => update("email", v)}
          maxLength={150}
          inputMode="email"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field
          label="Telefone / WhatsApp (opcional)"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="(34) 99919-4509"
          inputMode="tel"
          value={fields.phone}
          onChange={(v) => update("phone", v)}
          maxLength={20}
        />
        <Field
          label="Empresa ou projeto (opcional)"
          name="company"
          value={fields.company}
          onChange={(v) => update("company", v)}
          maxLength={100}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SelectField
          label="Tipo de projeto"
          name="projectType"
          options={PROJECT_TYPES}
          required
          value={fields.projectType}
          onChange={(v) => update("projectType", v)}
        />
        <SelectField
          label="Faixa de orçamento"
          name="budget"
          options={BUDGETS}
          required
          value={fields.budget}
          onChange={(v) => update("budget", v)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SelectField
          label="Prazo desejado"
          name="deadline"
          options={DEADLINES}
          required
          value={fields.deadline}
          onChange={(v) => update("deadline", v)}
        />
        <SelectField
          label="Como me encontrou? (opcional)"
          name="source"
          options={SOURCES}
          value={fields.source}
          onChange={(v) => update("source", v)}
        />
      </div>

      <Field
        label="Site atual ou referência (opcional)"
        name="reference"
        type="url"
        placeholder="site.com.br ou https://..."
        inputMode="url"
        value={fields.reference}
        onChange={(v) => update("reference", v)}
        maxLength={300}
      />

      <TextareaField
        label="Conta um pouco sobre o projeto"
        name="message"
        required
        placeholder="Objetivo, contexto, o que tá travando hoje, o que seria sucesso pra você…"
        rows={6}
        value={fields.message}
        onChange={(v) => update("message", v)}
        maxLength={2000}
      />

      {errorMessage && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-white/55">
          Respondo em até 24h, sempre.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="group relative inline-flex items-center justify-center rounded-full border border-white/20 bg-white px-7 py-3 text-sm font-semibold text-black transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Enviando…" : "Enviar briefing"}
        </button>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  inputMode?: "text" | "email" | "tel" | "url" | "numeric";
  maxLength?: number;
  value: string;
  onChange: (value: string) => void;
};

function Field({
  label,
  name,
  type = "text",
  required,
  value,
  onChange,
  ...rest
}: FieldProps) {
  return (
    <label className="grid gap-2">
      <span className="text-[11px] tracking-[0.25em] text-white/60 uppercase">
        {label}
        {required && <span className="ml-1 text-white/40">*</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-b border-white/15 bg-transparent px-0 py-2.5 text-base text-white outline-none transition-colors focus:border-white/60"
        {...rest}
      />
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  name: string;
  options: readonly string[];
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
};

function SelectField({
  label,
  name,
  options,
  required,
  value,
  onChange,
}: SelectFieldProps) {
  return (
    <label className="grid gap-2">
      <span className="text-[11px] tracking-[0.25em] text-white/60 uppercase">
        {label}
        {required && <span className="ml-1 text-white/40">*</span>}
      </span>
      <select
        name={name}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none border-b border-white/15 bg-transparent px-0 py-2.5 text-base text-white outline-none transition-colors focus:border-white/60"
      >
        <option value="" disabled className="bg-black text-white/60">
          Selecione…
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-black text-white">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

type TextareaFieldProps = {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  value: string;
  onChange: (value: string) => void;
};

function TextareaField({
  label,
  name,
  required,
  placeholder,
  rows = 5,
  maxLength,
  value,
  onChange,
}: TextareaFieldProps) {
  return (
    <label className="grid gap-2">
      <span className="text-[11px] tracking-[0.25em] text-white/60 uppercase">
        {label}
        {required && <span className="ml-1 text-white/40">*</span>}
      </span>
      <textarea
        name={name}
        required={required}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="resize-y border-b border-white/15 bg-transparent px-0 py-2.5 text-base text-white outline-none transition-colors focus:border-white/60"
      />
    </label>
  );
}

function SuccessPanel() {
  const whatsappLink = buildWhatsappLink(
    "Oi! Acabei de enviar um briefing pelo site da Prumo.",
  );
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm md:p-12">
      <span className="text-[11px] tracking-[0.3em] text-white/55 uppercase">
        Recebido
      </span>
      <h3 className="font-display mt-4 text-3xl leading-tight tracking-tight md:text-4xl">
        Briefing chegou. Respondo em até 24h.
      </h3>
      <p className="mt-5 max-w-xl text-base text-white/70">
        Vou ler com calma e voltar com perguntas específicas, cronograma e
        próximos passos. Se for urgente ou quiser destravar agora, pode
        continuar pelo WhatsApp.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition-colors hover:bg-white/90"
        >
          Continuar no WhatsApp
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-white/15 px-7 py-3 text-sm font-medium text-white/80 transition-colors hover:border-white/40 hover:text-white"
        >
          Voltar pro início
        </Link>
      </div>
    </div>
  );
}
