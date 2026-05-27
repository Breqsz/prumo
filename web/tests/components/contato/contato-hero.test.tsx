import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ContatoHero } from "@/components/contato/contato-hero";

describe("ContatoHero", () => {
  it("renders the eyebrow, headline and lede", () => {
    render(<ContatoHero />);
    expect(screen.getByText("Contato")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: /briefing inicial/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/respondo em até 24h/i)).toBeInTheDocument();
  });

  it("uses an accessible label on the section", () => {
    const { container } = render(<ContatoHero />);
    const section = container.querySelector("section");
    expect(section).toHaveAttribute("aria-labelledby", "contato-hero-heading");
  });
});
