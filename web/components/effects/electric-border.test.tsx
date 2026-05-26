import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ElectricBorder } from "./electric-border";

describe("ElectricBorder", () => {
  it("renders children", () => {
    render(
      <ElectricBorder>
        <span>conteudo eletrico</span>
      </ElectricBorder>,
    );
    expect(screen.getByText("conteudo eletrico")).toBeInTheDocument();
  });

  it("applies borderRadius to the root wrapper", () => {
    const { container } = render(
      <ElectricBorder borderRadius={28}>
        <span>x</span>
      </ElectricBorder>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.borderRadius).toBe("28px");
  });
});
