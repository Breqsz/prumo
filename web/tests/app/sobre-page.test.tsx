import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SobrePage from "@/app/sobre/page";

describe("SobrePage", () => {
  it("renders the page H1", () => {
    render(<SobrePage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /um estúdio\.\s*sem teatro/i }),
    ).toBeInTheDocument();
  });

  it("renders the manifesto eyebrow", () => {
    render(<SobrePage />);
    expect(screen.getByText(/^Manifesto$/)).toBeInTheDocument();
  });

  it("renders the método heading", () => {
    render(<SobrePage />);
    expect(screen.getByRole("heading", { level: 2, name: /como o prumo trabalha/i })).toBeInTheDocument();
  });

  it("renders the quem assina heading", () => {
    render(<SobrePage />);
    expect(screen.getByRole("heading", { level: 2, name: /seu nome aqui/i })).toBeInTheDocument();
  });

  it("renders the final CTA", () => {
    render(<SobrePage />);
    expect(screen.getByRole("heading", { level: 2, name: /no prumo/i })).toBeInTheDocument();
  });
});
