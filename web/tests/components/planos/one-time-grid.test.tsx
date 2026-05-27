import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { OneTimeGrid } from "@/components/planos/one-time-grid";

describe("OneTimeGrid", () => {
  it("renders three one-time plan headings", () => {
    render(<OneTimeGrid />);
    expect(screen.getByRole("heading", { level: 3, name: "Landing" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Institucional" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Branded" })).toBeInTheDocument();
  });

  it("marks the Institucional plan as featured", () => {
    render(<OneTimeGrid />);
    expect(screen.getByText(/mais escolhido/i)).toBeInTheDocument();
  });

  it("renders an Agendar conversa CTA per card pointing to /contato", () => {
    render(<OneTimeGrid />);
    const ctas = screen.getAllByRole("link", { name: /agendar conversa/i });
    expect(ctas).toHaveLength(3);
    ctas.forEach((c) => expect(c).toHaveAttribute("href", "/contato"));
  });

  it("renders the section heading", () => {
    render(<OneTimeGrid />);
    expect(screen.getByRole("heading", { level: 2, name: /para criar/i })).toBeInTheDocument();
  });
});
