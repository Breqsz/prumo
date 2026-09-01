import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Ferrofluid } from "@/components/ui/ferrofluid";

// O happy-dom não implementa WebGL, então este ambiente É o cenário de falha
// que interessa: GPU em lista de bloqueio, browser antigo, contexto perdido.
// Um fundo decorativo que derruba a página é pior que fundo nenhum.
describe("Ferrofluid without WebGL", () => {
  it("renders instead of throwing when no context can be created", () => {
    expect(() => render(<Ferrofluid />)).not.toThrow();
  });

  it("still mounts its container so the layout does not collapse", () => {
    const { container } = render(<Ferrofluid />);
    const root = container.firstElementChild;
    expect(root).not.toBeNull();
    expect(root?.tagName).toBe("DIV");
  });

  it("stays out of the accessibility tree", () => {
    const { container } = render(<Ferrofluid />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps any class the caller passes for positioning", () => {
    const { container } = render(<Ferrofluid className="absolute inset-0" />);
    expect(container.firstElementChild).toHaveClass("absolute", "inset-0");
  });
});
