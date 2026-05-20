import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HeroContent } from "@/components/hero/hero-content";

describe("HeroContent", () => {
  it("renders the heading text", () => {
    render(<HeroContent />);
    const h = screen.getByRole("heading", { level: 1 });
    expect(h).toHaveTextContent("Tudo começa por");
    expect(h).toHaveTextContent("uma linha reta.");
  });

  it("renders the tagline", () => {
    render(<HeroContent />);
    expect(
      screen.getByText(
        /Sites, estratégia e presença digital para marcas que valorizam precisão\./,
      ),
    ).toBeInTheDocument();
  });

  it("renders primary and secondary CTAs", () => {
    render(<HeroContent />);
    expect(
      screen.getByRole("link", { name: /agendar conversa/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /ver trabalhos/i }),
    ).toBeInTheDocument();
  });

  it("does NOT render any email input (we are not a newsletter)", () => {
    render(<HeroContent />);
    expect(screen.queryByPlaceholderText(/email/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});
