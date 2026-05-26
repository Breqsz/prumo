import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Spotlight } from "./spotlight";

describe("Spotlight", () => {
  it("renders an aria-hidden decorative layer", () => {
    const { container } = render(<Spotlight />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders two breathing spotlight layers", () => {
    const { container } = render(<Spotlight />);
    expect(container.querySelector(".prumo-spotlight")).toBeTruthy();
    expect(container.querySelector(".prumo-spotlight-soft")).toBeTruthy();
  });
});
