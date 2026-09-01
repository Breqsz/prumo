import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AmbientFerrofluid } from "@/components/ambient/ambient-ferrofluid";

describe("AmbientFerrofluid", () => {
  it("renders its children even when the shader cannot start", () => {
    // Sem WebGL neste ambiente. O conteúdo da página não pode depender do fundo.
    render(
      <AmbientFerrofluid>
        <p>conteúdo da página</p>
      </AmbientFerrofluid>,
    );
    expect(screen.getByText("conteúdo da página")).toBeInTheDocument();
  });

  it("keeps the background out of the accessibility tree", () => {
    const { container } = render(
      <AmbientFerrofluid>
        <p>conteúdo</p>
      </AmbientFerrofluid>,
    );
    expect(container.querySelector("[aria-hidden]")).not.toBeNull();
  });

  it("mounts no video element — the whole point of the swap", () => {
    const { container } = render(
      <AmbientFerrofluid>
        <p>conteúdo</p>
      </AmbientFerrofluid>,
    );
    expect(container.querySelector("video")).toBeNull();
  });
});
