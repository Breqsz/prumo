import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Logo, PrumoMark } from "@/components/ui/logo";

describe("PrumoMark", () => {
  it("renders an aria-hidden img of the official mark", () => {
    const { container } = render(<PrumoMark className="h-7 w-auto" />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("aria-hidden", "true");
    expect(img?.getAttribute("src")).toContain("prumo-mark");
    expect(img?.getAttribute("class")).toContain("h-7");
  });

  it("is decorative (empty alt) so the wordmark carries the accessible name", () => {
    const { container } = render(<PrumoMark />);
    expect(container.querySelector("img")).toHaveAttribute("alt", "");
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
