import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PlanosHero } from "@/components/planos/planos-hero";

describe("PlanosHero", () => {
  it("renders the page H1", () => {
    render(<PlanosHero />);
    expect(
      screen.getByRole("heading", { level: 1, name: /preço transparente/i }),
    ).toBeInTheDocument();
  });

  it("renders the eyebrow label", () => {
    render(<PlanosHero />);
    expect(screen.getByText(/^Planos$/)).toBeInTheDocument();
  });

  it("renders the subhead", () => {
    render(<PlanosHero />);
    expect(screen.getByText(/você sabe o número antes/i)).toBeInTheDocument();
  });
});
