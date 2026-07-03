import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TermosPage from "@/app/termos/page";

describe("TermosPage", () => {
  it("renders the H1", () => {
    render(<TermosPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /termos de uso/i }),
    ).toBeInTheDocument();
  });

  it("sets the venue (foro) to São Paulo", () => {
    render(<TermosPage />);
    expect(screen.getByText(/São Paulo\/SP/)).toBeInTheDocument();
  });

  it("asserts intellectual property ownership", () => {
    render(<TermosPage />);
    expect(screen.getByText(/propriedade intelectual/i)).toBeInTheDocument();
  });

  it("clarifies that sending the form is not a contract", () => {
    render(<TermosPage />);
    expect(
      screen.getByText(/não constitui, por si só, contrato de prestação de serviços/i),
    ).toBeInTheDocument();
  });

  it("links to the privacy policy", () => {
    render(<TermosPage />);
    const link = screen.getByRole("link", { name: /política de privacidade/i });
    expect(link).toHaveAttribute("href", "/privacidade");
  });
});
