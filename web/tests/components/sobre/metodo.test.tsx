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

  it("renders the 4 step numbers", () => {
    render(<Metodo />);
    expect(screen.getByText(/^01$/)).toBeInTheDocument();
    expect(screen.getByText(/^02$/)).toBeInTheDocument();
    expect(screen.getByText(/^03$/)).toBeInTheDocument();
    expect(screen.getByText(/^04$/)).toBeInTheDocument();
  });
});
