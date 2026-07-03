import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ServicosHub, { metadata } from "@/app/servicos/page";

describe("servicos hub", () => {
  it("has a /servicos canonical", () => {
    expect(metadata.alternates?.canonical).toBe("/servicos");
  });
  it("links to both service pages", () => {
    render(<ServicosHub />);
    expect(
      screen.getByRole("link", { name: /criação de sites/i }),
    ).toHaveAttribute("href", "/servicos/criacao-de-sites");
    expect(
      screen.getByRole("link", { name: /landing pages/i }),
    ).toHaveAttribute("href", "/servicos/landing-pages");
  });
});
