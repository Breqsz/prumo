import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Metodo } from "@/components/sobre/metodo";

describe("Metodo", () => {
  it("renders the section heading", () => {
    render(<Metodo />);
    expect(screen.getByRole("heading", { level: 2, name: /como o prumo trabalha/i })).toBeInTheDocument();
  });

  it("renders the 4 method steps", () => {
    render(<Metodo />);
    expect(screen.getByRole("heading", { level: 3, name: /^alinhamento$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /^desenho$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /^construção$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /^lançamento$/i })).toBeInTheDocument();
  });

  it("renders 4 list items, one per step", () => {
    render(<Metodo />);
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
  });
});
