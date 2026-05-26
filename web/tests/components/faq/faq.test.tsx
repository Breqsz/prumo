import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Faq } from "@/components/faq/faq";

describe("Faq", () => {
  it("renders the section heading", () => {
    render(<Faq />);
    expect(
      screen.getByRole("heading", { level: 2, name: /perguntam antes/i }),
    ).toBeInTheDocument();
  });

  it("renders all six questions", () => {
    render(<Faq />);
    expect(screen.getAllByRole("button")).toHaveLength(6);
  });

  it("opens the first question by default", () => {
    render(<Faq />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveAttribute("aria-expanded", "true");
    expect(buttons[1]).toHaveAttribute("aria-expanded", "false");
  });

  it("opens a clicked question and closes the previously open one", async () => {
    render(<Faq />);
    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[2]);
    expect(buttons[0]).toHaveAttribute("aria-expanded", "false");
    expect(buttons[2]).toHaveAttribute("aria-expanded", "true");
  });

  it("collapses an open question when clicked again", async () => {
    render(<Faq />);
    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[0]);
    expect(buttons[0]).toHaveAttribute("aria-expanded", "false");
  });
});
