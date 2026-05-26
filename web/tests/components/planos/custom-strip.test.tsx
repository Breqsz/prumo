import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CustomStrip } from "@/components/planos/custom-strip";

describe("CustomStrip", () => {
  it("renders the custom headline", () => {
    render(<CustomStrip />);
    expect(screen.getByRole("heading", { level: 2, name: /sob medida/i })).toBeInTheDocument();
  });

  it("renders the briefing CTA pointing to Cal.com", () => {
    render(<CustomStrip />);
    const link = screen.getByRole("link", { name: /pedir brief/i });
    expect(link).toHaveAttribute("href", "https://cal.com/");
  });

  it("mentions the R$ 25.000 floor", () => {
    render(<CustomStrip />);
    expect(screen.getByText(/25\.000/)).toBeInTheDocument();
  });
});
