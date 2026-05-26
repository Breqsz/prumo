import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AuroraBlack } from "@/components/ambient/aurora-black";

describe("AuroraBlack", () => {
  it("renders children", () => {
    render(
      <AuroraBlack>
        <p data-testid="child">hello body</p>
      </AuroraBlack>,
    );
    expect(screen.getByTestId("child")).toHaveTextContent("hello body");
  });

  it("renders the background layer marked aria-hidden", () => {
    render(
      <AuroraBlack>
        <div />
      </AuroraBlack>,
    );
    const bg = screen.getByTestId("aurora-bg");
    expect(bg).toHaveAttribute("aria-hidden", "true");
  });

  it("renders three aurora layers, grain, and vignette", () => {
    render(
      <AuroraBlack>
        <div />
      </AuroraBlack>,
    );
    expect(screen.getByTestId("aurora-1")).toBeInTheDocument();
    expect(screen.getByTestId("aurora-2")).toBeInTheDocument();
    expect(screen.getByTestId("aurora-3")).toBeInTheDocument();
    expect(screen.getByTestId("aurora-grain")).toBeInTheDocument();
    expect(screen.getByTestId("aurora-vignette")).toBeInTheDocument();
  });

  it("wraps content in a relative isolate container", () => {
    const { container } = render(
      <AuroraBlack>
        <div />
      </AuroraBlack>,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toMatch(/relative/);
    expect(wrapper.className).toMatch(/isolate/);
  });

  it("each aurora layer carries the corresponding animation class", () => {
    render(
      <AuroraBlack>
        <div />
      </AuroraBlack>,
    );
    expect(screen.getByTestId("aurora-1").className).toMatch(/aurora-1/);
    expect(screen.getByTestId("aurora-2").className).toMatch(/aurora-2/);
    expect(screen.getByTestId("aurora-3").className).toMatch(/aurora-3/);
  });
});
