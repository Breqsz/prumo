import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HeroNav } from "@/components/hero/hero-nav";

describe("HeroNav", () => {
  it("renders the Prumo wordmark and the primary CTA", () => {
    render(<HeroNav />);
    expect(screen.getByText("Prumo")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /agendar conversa/i }),
    ).toBeInTheDocument();
  });

  it("renders the four nav links", () => {
    render(<HeroNav />);
    ["Trabalhos", "Planos", "Sobre", "Contato"].forEach((label) => {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    });
  });
});
