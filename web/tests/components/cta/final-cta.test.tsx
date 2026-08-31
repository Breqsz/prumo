import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FinalCta } from "@/components/cta/final-cta";

describe("FinalCta", () => {
  it("renders the headline using the prumo metaphor", () => {
    render(<FinalCta />);
    const h = screen.getByRole("heading", { level: 2 });
    expect(h).toHaveTextContent(/no prumo/i);
  });

  it("offers whatsapp as the primary path", () => {
    render(<FinalCta />);
    const wa = screen.getByRole("link", { name: /whatsapp/i });
    expect(wa.getAttribute("href")).toContain("wa.me");
    expect(decodeURIComponent(wa.getAttribute("href") ?? "")).toContain(
      "Prumo",
    );
  });

  it("keeps the form as a secondary path", () => {
    render(<FinalCta />);
    expect(
      screen.getByRole("link", { name: /prefiro escrever/i }),
    ).toHaveAttribute("href", "/contato");
  });

  it("tags the whatsapp click for analytics", () => {
    render(<FinalCta />);
    const wa = screen.getByRole("link", { name: /whatsapp/i });
    expect(wa).toHaveAttribute("data-umami-event", "cta_whatsapp");
  });

  it("renders an anchor id for in-page navigation", () => {
    const { container } = render(<FinalCta />);
    expect(container.querySelector("#cta")).not.toBeNull();
  });
});
