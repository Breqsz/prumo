import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MonthlyGrid } from "@/components/planos/monthly-grid";

describe("MonthlyGrid", () => {
  it("renders three monthly plan headings", () => {
    render(<MonthlyGrid />);
    expect(screen.getByRole("heading", { level: 3, name: "Base" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Crescimento" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Parceria" })).toBeInTheDocument();
  });

  it("marks the Crescimento plan as featured", () => {
    render(<MonthlyGrid />);
    expect(screen.getByText(/mais escolhido/i)).toBeInTheDocument();
  });

  it("renders the section heading", () => {
    render(<MonthlyGrid />);
    expect(screen.getByRole("heading", { level: 2, name: /para manter/i })).toBeInTheDocument();
  });

  it("renders cadence with /mês indicator", () => {
    render(<MonthlyGrid />);
    expect(screen.getAllByText(/\/mês|por mês/i).length).toBeGreaterThanOrEqual(3);
  });
});
