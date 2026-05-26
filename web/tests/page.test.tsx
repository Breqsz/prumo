import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HomePage from "@/app/page";

vi.mock("@/components/hero/hero-video", () => ({
  HeroVideo: () => <div data-testid="hero-video" />,
}));

describe("HomePage", () => {
  it("renders the hero h1", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders the planos teaser pointing to /planos", () => {
    render(<HomePage />);
    const link = screen.getByRole("link", { name: /ver todos os planos/i });
    expect(link).toHaveAttribute("href", "/planos");
  });

  it("renders the FAQ section", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", { level: 2, name: /perguntam antes/i }),
    ).toBeInTheDocument();
  });

  it("renders the final CTA section", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", { level: 2, name: /no prumo/i }),
    ).toBeInTheDocument();
  });

  it("renders the footer", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", { level: 4, name: /estúdio/i }),
    ).toBeInTheDocument();
  });
});
