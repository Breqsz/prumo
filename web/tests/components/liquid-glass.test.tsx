import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LiquidGlass } from "@/components/ui/liquid-glass";

describe("LiquidGlass", () => {
  it("renders children inside a div with the liquid-glass class", () => {
    render(<LiquidGlass data-testid="lg">hello</LiquidGlass>);
    const el = screen.getByTestId("lg");
    expect(el).toHaveClass("liquid-glass");
    expect(el).toHaveTextContent("hello");
  });

  it("merges custom className without dropping liquid-glass", () => {
    render(
      <LiquidGlass className="rounded-full px-4" data-testid="lg">
        x
      </LiquidGlass>,
    );
    const el = screen.getByTestId("lg");
    expect(el).toHaveClass("liquid-glass");
    expect(el).toHaveClass("rounded-full");
    expect(el).toHaveClass("px-4");
  });

  it("renders as a different element when as prop is provided", () => {
    render(
      <LiquidGlass as="a" href="#" data-testid="lg">
        link
      </LiquidGlass>,
    );
    const el = screen.getByTestId("lg");
    expect(el.tagName).toBe("A");
    expect(el).toHaveAttribute("href", "#");
  });
});
