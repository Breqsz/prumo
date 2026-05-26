import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SobreHero } from "@/components/sobre/sobre-hero";

describe("SobreHero", () => {
  it("renders the page H1", () => {
    render(<SobreHero />);
    expect(
      screen.getByRole("heading", { level: 1, name: /um estúdio\.\s*sem teatro/i }),
    ).toBeInTheDocument();
  });

  it("renders the eyebrow label", () => {
    render(<SobreHero />);
    expect(screen.getByText(/^Sobre$/)).toBeInTheDocument();
  });

  it("renders the subhead", () => {
    render(<SobreHero />);
    expect(screen.getByText(/solo, premium e sóbrio/i)).toBeInTheDocument();
  });
});
