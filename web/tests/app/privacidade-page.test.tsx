import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PrivacidadePage from "@/app/privacidade/page";

describe("PrivacidadePage", () => {
  it("renders the H1", () => {
    render(<PrivacidadePage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /política de privacidade/i }),
    ).toBeInTheDocument();
  });

  it("identifies the controller by CNPJ", () => {
    render(<PrivacidadePage />);
    expect(screen.getAllByText(/67\.822\.658\/0001-50/)[0]).toBeInTheDocument();
  });

  it("exposes the data-subject contact email", () => {
    render(<PrivacidadePage />);
    const links = screen.getAllByRole("link", { name: /prumonetwork@gmail\.com/i });
    expect(links[0]).toHaveAttribute("href", "mailto:prumonetwork@gmail.com");
  });

  it("states that no cookies are used", () => {
    render(<PrivacidadePage />);
    expect(screen.getByText(/não utilizamos cookies/i)).toBeInTheDocument();
  });

  it("names the third-party operators", () => {
    render(<PrivacidadePage />);
    expect(screen.getAllByText(/Resend/)).toHaveLength(1);
    expect(screen.getAllByText(/Vercel/)).toHaveLength(1);
    expect(screen.getAllByText(/Umami/)).toHaveLength(3);
  });
});
