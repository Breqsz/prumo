import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HeroSocial } from "@/components/hero/hero-social";

describe("HeroSocial", () => {
  it("renders three social icon links with aria-labels", () => {
    render(<HeroSocial />);
    expect(
      screen.getByRole("link", { name: /instagram/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /linkedin/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /whatsapp/i })).toBeInTheDocument();
  });

  it("carries the default prefilled message on the whatsapp link", () => {
    render(<HeroSocial />);
    const whats = screen.getByRole("link", { name: /whatsapp/i });
    const href = whats.getAttribute("href") ?? "";
    expect(href).toContain("wa.me/5534999194509");
    expect(href).toContain("text=");
    expect(decodeURIComponent(href)).toContain("Prumo");
  });
});
