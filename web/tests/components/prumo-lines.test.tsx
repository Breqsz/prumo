import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PrumoLines } from "@/components/ui/prumo-lines";

describe("PrumoLines", () => {
  it("renders one line per position", () => {
    const { container } = render(<PrumoLines positions={[16, 50, 84]} />);
    const lines = container.querySelectorAll(".prumo-line");
    expect(lines).toHaveLength(3);
  });

  it("places each line at the given left percentage", () => {
    const { container } = render(<PrumoLines positions={[20, 80]} />);
    const lines = container.querySelectorAll<HTMLElement>(".prumo-line");
    expect(lines[0].style.left).toBe("20%");
    expect(lines[1].style.left).toBe("80%");
  });

  it("is decorative — has aria-hidden", () => {
    const { container } = render(<PrumoLines positions={[50]} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute("aria-hidden", "true");
  });
});
