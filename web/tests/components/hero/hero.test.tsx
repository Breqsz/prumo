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

  // O hero deixou de usar video: o fundo agora e o shader de ferrofluido,
  // que roda em qualquer viewport. O guarda do gate desktop mudou de lugar
  // e vive em tests/components/trabalhos/case-video.test.tsx, que e onde
  // ainda existe <video> condicionado a largura de tela.
  it("never mounts a video element, because the background is a shader now", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector("video")).toBeNull();
  });

  it("renders a background layer even without WebGL", () => {
    // Sem contexto WebGL neste ambiente, o shader nao desenha. O hero nao
    // pode ficar sem fundo por causa disso.
    const { container } = render(<Hero />);
    expect(container.firstElementChild?.firstElementChild).not.toBeNull();
  });

});
