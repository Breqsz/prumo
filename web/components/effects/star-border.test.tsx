import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StarBorder } from "./star-border";

describe("StarBorder", () => {
  it("renders children", () => {
    render(
      <StarBorder>
        <span>conteudo estrela</span>
      </StarBorder>,
    );
    expect(screen.getByText("conteudo estrela")).toBeInTheDocument();
  });

  it("applies borderRadius and thickness padding to the root wrapper", () => {
    const { container } = render(
      <StarBorder borderRadius={28} thickness={3}>
        <span>x</span>
      </StarBorder>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.borderRadius).toBe("28px");
    expect(root.style.padding).toBe("3px 0px");
  });
});
