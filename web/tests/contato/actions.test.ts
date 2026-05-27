import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

import { submitContactForm } from "@/app/contato/actions";

function makeFormData(overrides: Record<string, string> = {}): FormData {
  const fd = new FormData();
  const base: Record<string, string> = {
    name: "Guilherme",
    email: "g@example.com",
    company: "Acme",
    projectType: "Landing page",
    budget: "Até R$ 5k",
    deadline: "Próximos 2-3 meses",
    reference: "https://example.com",
    message: "Mensagem suficientemente longa para passar.",
    source: "Instagram",
    website: "", // honeypot empty
    ...overrides,
  };
  for (const [k, v] of Object.entries(base)) fd.set(k, v);
  return fd;
}

const idleState = { status: "idle" as const };

describe("submitContactForm", () => {
  beforeEach(() => {
    sendMock.mockReset();
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("RESEND_FROM", "onboarding@resend.dev");
    vi.stubEnv("LEAD_TO", "guilherme@breq.com.br");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns ok and skips sending when honeypot is filled", async () => {
    const result = await submitContactForm(
      idleState,
      makeFormData({ website: "https://spam.example" }),
    );
    expect(result).toEqual({ status: "ok" });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns error when name is missing", async () => {
    const result = await submitContactForm(
      idleState,
      makeFormData({ name: "" }),
    );
    expect(result.status).toBe("error");
    if (result.status === "error") expect(result.message).toMatch(/nome/i);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns error when email is malformed", async () => {
    const result = await submitContactForm(
      idleState,
      makeFormData({ email: "not-an-email" }),
    );
    expect(result.status).toBe("error");
    if (result.status === "error") expect(result.message).toMatch(/email/i);
  });

  it("returns error when projectType is missing", async () => {
    const result = await submitContactForm(
      idleState,
      makeFormData({ projectType: "" }),
    );
    expect(result.status).toBe("error");
    if (result.status === "error")
      expect(result.message).toMatch(/tipo de projeto/i);
  });

  it("returns error when budget is missing", async () => {
    const result = await submitContactForm(
      idleState,
      makeFormData({ budget: "" }),
    );
    expect(result.status).toBe("error");
    if (result.status === "error")
      expect(result.message).toMatch(/orçamento/i);
  });

  it("returns error when deadline is missing", async () => {
    const result = await submitContactForm(
      idleState,
      makeFormData({ deadline: "" }),
    );
    expect(result.status).toBe("error");
    if (result.status === "error") expect(result.message).toMatch(/prazo/i);
  });

  it("returns error when message is too short", async () => {
    const result = await submitContactForm(
      idleState,
      makeFormData({ message: "curta" }),
    );
    expect(result.status).toBe("error");
    if (result.status === "error")
      expect(result.message).toMatch(/mensagem/i);
  });

  it("returns error when env is missing", async () => {
    vi.unstubAllEnvs();
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("LEAD_TO", "");
    const result = await submitContactForm(idleState, makeFormData());
    expect(result.status).toBe("error");
    if (result.status === "error")
      expect(result.message).toMatch(/configuração/i);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("sends via Resend with the expected payload and returns ok", async () => {
    sendMock.mockResolvedValue({ data: { id: "abc123" }, error: null });

    const result = await submitContactForm(idleState, makeFormData());

    expect(result).toEqual({ status: "ok" });
    expect(sendMock).toHaveBeenCalledTimes(1);
    const payload = sendMock.mock.calls[0][0];
    expect(payload.to).toBe("guilherme@breq.com.br");
    expect(payload.from).toBe("onboarding@resend.dev");
    expect(payload.replyTo).toBe("g@example.com");
    expect(payload.subject).toContain("Guilherme");
    expect(payload.subject).toContain("Landing page");
    expect(payload.html).toContain("Mensagem suficientemente longa");
  });

  it("escapes HTML in user-supplied fields to prevent injection", async () => {
    sendMock.mockResolvedValue({ data: { id: "abc" }, error: null });

    await submitContactForm(
      idleState,
      makeFormData({
        name: "<script>alert(1)</script>",
        message: "ok message length here for sure",
      }),
    );

    const payload = sendMock.mock.calls[0][0];
    expect(payload.html).not.toContain("<script>alert(1)</script>");
    expect(payload.html).toContain("&lt;script&gt;");
  });

  it("returns error when Resend response has error field", async () => {
    sendMock.mockResolvedValue({
      data: null,
      error: { name: "validation_error", message: "from not verified" },
    });

    const result = await submitContactForm(idleState, makeFormData());

    expect(result.status).toBe("error");
    if (result.status === "error")
      expect(result.message).toMatch(/whatsapp/i);
  });

  it("returns error when Resend throws", async () => {
    sendMock.mockRejectedValue(new Error("network down"));

    const result = await submitContactForm(idleState, makeFormData());

    expect(result.status).toBe("error");
    if (result.status === "error")
      expect(result.message).toMatch(/whatsapp/i);
  });
});
