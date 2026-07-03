import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Footer } from "@/components/footer/footer";

describe("Footer", () => {
  it("renders the Prumo wordmark linking home", () => {
    render(<Footer />);
    const home = screen.getByRole("link", { name: /prumo/i });
    expect(home).toHaveAttribute("href", "/");
  });

  it("renders the tagline", () => {
    render(<Footer />);
    expect(
      screen.getByText(
        /Sites, estratégia e presença digital para marcas que valorizam precisão\./,
      ),
    ).toBeInTheDocument();
  });

  it("renders the three nav column headings", () => {
    render(<Footer />);
    expect(
      screen.getByRole("heading", { level: 4, name: /estúdio/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 4, name: /conversar/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 4, name: /geral/i }),
    ).toBeInTheDocument();
  });

  it("routes 'Agendar conversa' in the Conversar column to the briefing form", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: /agendar conversa/i });
    expect(link).toHaveAttribute("href", "/contato");
  });

  it("renders the current year in the copyright", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(
      screen.getByText(new RegExp(`©\\s*${year}\\s+Prumo`)),
    ).toBeInTheDocument();
  });

  it("renders the legal entity and CNPJ", () => {
    render(<Footer />);
    expect(
      screen.getByText(/CNPJ 67\.822\.658\/0001-50/),
    ).toBeInTheDocument();
  });
});
