import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Hero } from "@/components/hero/hero";

describe("Hero", () => {
  it("renders heading and social row", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /instagram/i }),
    ).toBeInTheDocument();
  });

  it("does not render decorative prumo lines in the hero", () => {
    const { container } = render(<Hero />);
    expect(container.querySelectorAll(".prumo-line").length).toBe(0);
  });

  it("renders a <video> element when videoSrc is provided", () => {
    const { container } = render(<Hero videoSrc="/sample.mp4" />);
    expect(container.querySelector("video")).toBeTruthy();
  });

  it("renders without <video> when videoSrc is omitted", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector("video")).toBeNull();
  });
});
