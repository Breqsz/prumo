import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Pricing } from "@/components/pricing/pricing";

describe("Pricing", () => {
  it("renders the section heading", () => {
    render(<Pricing />);
    expect(
      screen.getByRole("heading", { level: 2, name: /três caminhos/i }),
    ).toBeInTheDocument();
  });

  it("renders all three plan names", () => {
    render(<Pricing />);
    expect(
      screen.getByRole("heading", { level: 3, name: "Landing" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Institucional" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Branded" }),
    ).toBeInTheDocument();
  });

  it("marks the Institucional plan as featured", () => {
    render(<Pricing />);
    expect(screen.getByText(/mais escolhido/i)).toBeInTheDocument();
  });

  it("renders one CTA per plan card", () => {
    render(<Pricing />);
    const ctas = screen.getAllByRole("link", { name: /agendar conversa/i });
    expect(ctas).toHaveLength(3);
  });

  it("renders an anchor id for in-page navigation", () => {
    const { container } = render(<Pricing />);
    expect(container.querySelector("#planos")).not.toBeNull();
  });
});
