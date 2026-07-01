import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PlanosPage from "@/app/planos/page";

describe("PlanosPage", () => {
  it("renders the page H1", () => {
    render(<PlanosPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /preço transparente/i }),
    ).toBeInTheDocument();
  });

  it("renders the spotlight stage section", () => {
    render(<PlanosPage />);
    const section = document.querySelector("#planos-stage");
    expect(section).toBeInTheDocument();
  });

  it("renders the plan mode tablist", () => {
    render(<PlanosPage />);
    expect(screen.getByRole("tablist", { name: /tipo de plano/i })).toBeInTheDocument();
  });

  it("renders the custom strip heading", () => {
    render(<PlanosPage />);
    expect(screen.getByRole("heading", { level: 2, name: /sob medida/i })).toBeInTheDocument();
  });

  it("renders the planos FAQ", () => {
    render(<PlanosPage />);
    expect(screen.getByRole("heading", { level: 2, name: /escopo, pagamento/i })).toBeInTheDocument();
  });

  it("renders the final CTA", () => {
    render(<PlanosPage />);
    expect(screen.getByRole("heading", { level: 2, name: /no prumo/i })).toBeInTheDocument();
  });
});
