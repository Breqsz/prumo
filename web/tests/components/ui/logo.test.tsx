import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Logo, PrumoMark } from "@/components/ui/logo";

describe("PrumoMark", () => {
  it("renders an aria-hidden svg using currentColor", () => {
    const { container } = render(<PrumoMark className="h-7 w-auto" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 96");
    expect(svg?.getAttribute("class")).toContain("h-7");
  });

  it("renders the three plumb-line primitives (circle, string, weight)", () => {
    const { container } = render(<PrumoMark />);
    expect(container.querySelector("circle")).not.toBeNull();
    expect(container.querySelector("line")).not.toBeNull();
    expect(container.querySelector("path")).not.toBeNull();
  });
});

describe("Logo", () => {
  it("renders the wordmark by default", () => {
    render(<Logo />);
    const wordmarks = screen.getAllByText("Prumo");
    expect(wordmarks.length).toBeGreaterThanOrEqual(1);
  });

  it("hides the visual wordmark when showWordmark is false but keeps an accessible name", () => {
    render(<Logo showWordmark={false} />);
    expect(screen.getByText("Prumo")).toHaveClass("sr-only");
  });

  it("applies wordmarkClassName to the visible wordmark", () => {
    render(<Logo wordmarkClassName="text-xl" />);
    const visible = screen
      .getAllByText("Prumo")
      .find((el) => !el.classList.contains("sr-only"));
    expect(visible).toBeDefined();
    expect(visible).toHaveClass("text-xl");
    expect(visible).toHaveClass("font-display");
  });
});
