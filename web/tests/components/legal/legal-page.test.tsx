import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";

describe("LegalPage", () => {
  it("renders eyebrow, title as h1, the last-updated date and section headings", () => {
    render(
      <LegalPage
        eyebrow="Privacidade"
        title="Política de Privacidade"
        updatedAt="3 de julho de 2026"
      >
        <LegalSection heading="1. Seção teste">
          <p>Conteúdo de teste.</p>
        </LegalSection>
      </LegalPage>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: /política de privacidade/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/última atualização: 3 de julho de 2026/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /seção teste/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/conteúdo de teste/i)).toBeInTheDocument();
  });
});
