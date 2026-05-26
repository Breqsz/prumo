import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PlanosFaq } from "@/components/planos/planos-faq";

describe("PlanosFaq", () => {
  it("renders all five scope-specific questions", () => {
    render(<PlanosFaq />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(5);
  });

  it("opens the first question by default", () => {
    render(<PlanosFaq />);
    const first = screen.getAllByRole("button")[0];
    expect(first).toHaveAttribute("aria-expanded", "true");
  });

  it("opens a clicked question and closes the previously open one", () => {
    render(<PlanosFaq />);
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[2]);
    expect(buttons[0]).toHaveAttribute("aria-expanded", "false");
    expect(buttons[2]).toHaveAttribute("aria-expanded", "true");
  });
});
