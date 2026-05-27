import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FinalCta } from "@/components/cta/final-cta";

describe("FinalCta", () => {
  it("renders the headline using the prumo metaphor", () => {
    render(<FinalCta />);
    const h = screen.getByRole("heading", { level: 2 });
    expect(h).toHaveTextContent(/no prumo/i);
  });

  it("renders the primary CTA pointing to the briefing form", () => {
    render(<FinalCta />);
    const cta = screen.getByRole("link", { name: /agendar conversa/i });
    expect(cta).toHaveAttribute("href", "/contato");
  });

  it("renders an anchor id for in-page navigation", () => {
    const { container } = render(<FinalCta />);
    expect(container.querySelector("#cta")).not.toBeNull();
  });
});
