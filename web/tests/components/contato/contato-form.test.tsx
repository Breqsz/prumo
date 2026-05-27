import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SubmitState } from "@/app/contato/actions";

const { actionMock, formActionMock } = vi.hoisted(() => ({
  actionMock: vi.fn(async (_: SubmitState, __: FormData): Promise<SubmitState> => ({
    status: "idle",
  })),
  formActionMock: vi.fn(),
}));

vi.mock("@/app/contato/actions", () => ({
  submitContactForm: actionMock,
}));

const stateMock = vi.hoisted(() => ({
  current: { status: "idle" } as SubmitState,
  pending: false,
}));

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useActionState: (_action: unknown, _initial: SubmitState) => [
      stateMock.current,
      formActionMock,
      stateMock.pending,
    ],
  };
});

import { ContatoForm, validateFields } from "@/components/contato/contato-form";

describe("ContatoForm render", () => {
  beforeEach(() => {
    stateMock.current = { status: "idle" };
    stateMock.pending = false;
    formActionMock.mockReset();
  });

  it("renders all required fields", () => {
    render(<ContatoForm />);
    expect(screen.getByLabelText(/^nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo de projeto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/faixa de orçamento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/prazo desejado/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/conta um pouco/i)).toBeInTheDocument();
  });

  it("renders the optional phone field with tel inputMode", () => {
    render(<ContatoForm />);
    const phone = screen.getByLabelText(/telefone/i) as HTMLInputElement;
    expect(phone).toBeInTheDocument();
    expect(phone.required).toBe(false);
    expect(phone.type).toBe("tel");
  });

  it("renders all optional fields", () => {
    render(<ContatoForm />);
    expect(screen.getByLabelText(/empresa ou projeto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/site atual ou referência/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/como me encontrou/i)).toBeInTheDocument();
  });

  it("renders the honeypot field hidden from accessibility tree", () => {
    const { container } = render(<ContatoForm />);
    const honeypot = container.querySelector<HTMLInputElement>(
      'input[name="website"]',
    );
    expect(honeypot).not.toBeNull();
    expect(honeypot?.tabIndex).toBe(-1);
    expect(honeypot?.closest("[aria-hidden='true']")).not.toBeNull();
  });

  it("renders the submit button with idle copy", () => {
    render(<ContatoForm />);
    expect(
      screen.getByRole("button", { name: /enviar briefing/i }),
    ).toBeInTheDocument();
  });

  it("disables the submit button while pending", () => {
    stateMock.pending = true;
    render(<ContatoForm />);
    const btn = screen.getByRole("button", { name: /enviando/i });
    expect(btn).toBeDisabled();
  });

  it("shows the server error message when state is error", () => {
    stateMock.current = { status: "error", message: "Email inválido." };
    render(<ContatoForm />);
    expect(screen.getByRole("alert")).toHaveTextContent("Email inválido.");
  });

  it("replaces the form with a success panel when state is ok", () => {
    stateMock.current = { status: "ok" };
    render(<ContatoForm />);
    expect(screen.queryByRole("button", { name: /enviar briefing/i })).toBeNull();
    expect(screen.getByText(/respondo em até 24h/i)).toBeInTheDocument();
    const whats = screen.getByRole("link", { name: /whatsapp/i });
    expect(whats).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me/5534999194509"),
    );
  });

  it("includes a SLA hint near the submit button", () => {
    render(<ContatoForm />);
    expect(screen.getByText(/respondo em até 24h/i)).toBeInTheDocument();
  });
});

describe("ContatoForm client validation + state preservation", () => {
  beforeEach(() => {
    stateMock.current = { status: "idle" };
    stateMock.pending = false;
    formActionMock.mockReset();
  });

  it("blocks submit when required fields are empty and shows red alert", async () => {
    const user = userEvent.setup();
    render(<ContatoForm />);
    await user.click(screen.getByRole("button", { name: /enviar briefing/i }));

    expect(formActionMock).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(/nome/i);
  });

  it("preserves typed fields when validation fails", async () => {
    const user = userEvent.setup();
    render(<ContatoForm />);

    const name = screen.getByLabelText(/^nome/i) as HTMLInputElement;
    const email = screen.getByLabelText(/^email/i) as HTMLInputElement;
    await user.type(name, "Guilherme");
    await user.type(email, "g@example.com");

    // Skip required selects + message — validation will fail
    await user.click(screen.getByRole("button", { name: /enviar briefing/i }));

    expect(formActionMock).not.toHaveBeenCalled();
    // Values still present in the controlled inputs
    expect(name.value).toBe("Guilherme");
    expect(email.value).toBe("g@example.com");
  });

  it("clears the error message when the user starts editing again", async () => {
    const user = userEvent.setup();
    render(<ContatoForm />);
    await user.click(screen.getByRole("button", { name: /enviar briefing/i }));
    expect(screen.getByRole("alert")).toBeInTheDocument();

    await user.type(screen.getByLabelText(/^nome/i), "G");
    expect(screen.queryByRole("alert")).toBeNull();
  });
});

describe("validateFields", () => {
  const base = {
    name: "Guilherme",
    email: "g@example.com",
    phone: "",
    company: "",
    projectType: "Landing page",
    budget: "Até R$ 5k",
    deadline: "Próximos 2-3 meses",
    reference: "",
    source: "",
    message: "Uma mensagem com mais de dez caracteres.",
  };

  it("returns null for a fully valid payload", () => {
    expect(validateFields(base)).toBeNull();
  });

  it("rejects names shorter than 2 chars (after trim)", () => {
    expect(validateFields({ ...base, name: " " })).toMatch(/nome/i);
    expect(validateFields({ ...base, name: "A" })).toMatch(/nome/i);
  });

  it("rejects names over 100 chars", () => {
    expect(validateFields({ ...base, name: "a".repeat(101) })).toMatch(
      /longo/i,
    );
  });

  it("rejects malformed emails", () => {
    expect(validateFields({ ...base, email: "no-at-sign.com" })).toMatch(
      /email/i,
    );
    expect(validateFields({ ...base, email: "missing@tld" })).toMatch(/email/i);
    expect(validateFields({ ...base, email: "spaces @ok.com" })).toMatch(
      /email/i,
    );
  });

  it("accepts phone with valid digit count (10-15)", () => {
    expect(validateFields({ ...base, phone: "(34) 99919-4509" })).toBeNull();
    expect(validateFields({ ...base, phone: "+55 11 98765-4321" })).toBeNull();
    expect(validateFields({ ...base, phone: "1234567890" })).toBeNull();
  });

  it("rejects phone with too few or too many digits", () => {
    expect(validateFields({ ...base, phone: "123" })).toMatch(/telefone/i);
    expect(validateFields({ ...base, phone: "1".repeat(20) })).toMatch(
      /telefone/i,
    );
  });

  it("ignores empty optional phone", () => {
    expect(validateFields({ ...base, phone: "" })).toBeNull();
    expect(validateFields({ ...base, phone: "   " })).toBeNull();
  });

  it("requires the three mandatory selects", () => {
    expect(validateFields({ ...base, projectType: "" })).toMatch(/projeto/i);
    expect(validateFields({ ...base, budget: "" })).toMatch(/orçamento/i);
    expect(validateFields({ ...base, deadline: "" })).toMatch(/prazo/i);
  });

  it("accepts bare domain or full URL on reference, rejects gibberish", () => {
    expect(validateFields({ ...base, reference: "site.com.br" })).toBeNull();
    expect(
      validateFields({ ...base, reference: "https://site.com/abc" }),
    ).toBeNull();
    expect(validateFields({ ...base, reference: "not a url" })).toMatch(
      /link/i,
    );
  });

  it("rejects message shorter than 10 chars or longer than 2000", () => {
    expect(validateFields({ ...base, message: "curta" })).toMatch(
      /mensagem/i,
    );
    expect(validateFields({ ...base, message: "a".repeat(2001) })).toMatch(
      /longa/i,
    );
  });
});
