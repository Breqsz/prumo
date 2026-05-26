import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PlanosTeaser } from "@/components/planos/planos-teaser";

describe("PlanosTeaser", () => {
  it("renders a link pointing to /planos", () => {
    render(<PlanosTeaser />);
    const link = screen.getByRole("link", { name: /ver todos os planos/i });
    expect(link).toHaveAttribute("href", "/planos");
  });

  it("renders the teaser headline", () => {
    render(<PlanosTeaser />);
    expect(
      screen.getByRole("heading", { level: 2, name: /preço transparente/i }),
    ).toBeInTheDocument();
  });
});
