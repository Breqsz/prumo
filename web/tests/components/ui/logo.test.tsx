import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Logo } from "@/components/ui/logo";

describe("Logo", () => {
  it("renders the wordmark as inline svg, not a raster image", () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector("svg");

    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("viewBox")).toBe("0 0 1268.58 458.34");
    expect(container.querySelector("img")).toBeNull();
  });

  it("inherits the surrounding text colour instead of baking one in", () => {
    const { container } = render(<Logo />);
    const paths = container.querySelectorAll("path");

    expect(paths).toHaveLength(5);
    paths.forEach((path) => {
      expect(path.getAttribute("fill")).toBe("currentColor");
    });
  });

  it("keeps the mark decorative and exposes an accessible name", () => {
    const { container } = render(<Logo />);

    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("Prumo")).toHaveClass("sr-only");
  });

  it("lets the caller override the wrapper class", () => {
    const { container } = render(<Logo className="opacity-60" />);

    expect(container.firstElementChild?.getAttribute("class")).toContain("opacity-60");
  });
});
