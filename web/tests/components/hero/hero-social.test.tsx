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
});
