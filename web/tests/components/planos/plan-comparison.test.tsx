import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { PlanComparison } from "@/components/planos/plan-comparison";
import { CRIAR_PLANS } from "@/lib/plans";

describe("PlanComparison", () => {
  it("is collapsed by default and renders no plan headings", () => {
    render(<PlanComparison plans={CRIAR_PLANS} />);
    const toggle = screen.getByRole("button", { name: /ver comparação completa/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("heading", { level: 3, name: "Landing" })).not.toBeInTheDocument();
  });

  it("expands to show every plan when clicked", async () => {
    render(<PlanComparison plans={CRIAR_PLANS} />);
    const toggle = screen.getByRole("button", { name: /ver comparação completa/i });
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    CRIAR_PLANS.forEach((p) =>
      expect(screen.getByRole("heading", { level: 3, name: p.name })).toBeInTheDocument(),
    );
  });
});
