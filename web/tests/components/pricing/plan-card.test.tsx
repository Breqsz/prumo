import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PlanCard } from "@/components/pricing/plan-card";

const baseProps = {
  name: "Landing",
  price: "R$ 3.500",
  cadence: "Pagamento único · 10 dias",
  description: "Página única de alta conversão.",
  features: ["Design sob medida", "1 idioma", "Performance e SEO"],
  glow: 0 as const,
};

describe("PlanCard", () => {
  it("renders name, price, cadence and description", () => {
    render(<PlanCard {...baseProps} />);
    expect(
      screen.getByRole("heading", { level: 3, name: "Landing" }),
    ).toBeInTheDocument();
    expect(screen.getByText("R$ 3.500")).toBeInTheDocument();
    expect(screen.getByText(baseProps.cadence)).toBeInTheDocument();
    expect(screen.getByText(baseProps.description)).toBeInTheDocument();
  });

  it("renders every feature in the list", () => {
    render(<PlanCard {...baseProps} />);
    for (const f of baseProps.features) {
      expect(screen.getByText(f)).toBeInTheDocument();
    }
  });

  it("renders a CTA link pointing to scheduling", () => {
    render(<PlanCard {...baseProps} />);
    const cta = screen.getByRole("link", { name: /agendar conversa/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", expect.stringContaining("cal.com"));
  });

  it('does not render the "Mais escolhido" badge by default', () => {
    render(<PlanCard {...baseProps} />);
    expect(screen.queryByText(/mais escolhido/i)).not.toBeInTheDocument();
  });

  it('renders the "Mais escolhido" badge when featured is true', () => {
    render(<PlanCard {...baseProps} featured />);
    expect(screen.getByText(/mais escolhido/i)).toBeInTheDocument();
  });
});
