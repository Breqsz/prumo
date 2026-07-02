import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Logo } from "@/components/ui/logo";

describe("Logo", () => {
  it("renders the official wordmark image", () => {
    const { container } = render(<Logo />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img?.getAttribute("src")).toContain("prumo-logo");
    expect(img?.getAttribute("class")).toContain("h-7");
  });

  it("keeps the wordmark image decorative and exposes an accessible name", () => {
    const { container } = render(<Logo />);
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("aria-hidden", "true");
    expect(img).toHaveAttribute("alt", "");
    expect(screen.getByText("Prumo")).toHaveClass("sr-only");
  });
});
