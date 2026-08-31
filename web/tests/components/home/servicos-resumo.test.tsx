import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ServicosResumo } from "@/components/home/servicos-resumo";

describe("ServicosResumo", () => {
  it("links to the services hub", () => {
    render(<ServicosResumo />);
    expect(screen.getByRole("link", { name: /serviços/i })).toHaveAttribute(
      "href",
      "/servicos",
    );
  });

  it("renders a heading", () => {
    render(<ServicosResumo />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });
});
