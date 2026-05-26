import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { QuemAssina } from "@/components/sobre/quem-assina";

describe("QuemAssina", () => {
  it("renders the section heading with the name placeholder", () => {
    render(<QuemAssina />);
    expect(
      screen.getByRole("heading", { level: 2, name: /seu nome aqui/i }),
    ).toBeInTheDocument();
  });

  it("renders the eyebrow label", () => {
    render(<QuemAssina />);
    expect(screen.getByText(/^Quem assina$/)).toBeInTheDocument();
  });

  it("renders the 3 social links as placeholders", () => {
    render(<QuemAssina />);
    const instagram = screen.getByRole("link", { name: /instagram/i });
    const linkedin = screen.getByRole("link", { name: /linkedin/i });
    const whatsapp = screen.getByRole("link", { name: /whatsapp/i });
    expect(instagram).toHaveAttribute("href", "#");
    expect(linkedin).toHaveAttribute("href", "#");
    expect(whatsapp).toHaveAttribute("href", "#");
  });

  it("renders the photo placeholder label", () => {
    render(<QuemAssina />);
    expect(screen.getByText(/foto · placeholder/i)).toBeInTheDocument();
  });
});
