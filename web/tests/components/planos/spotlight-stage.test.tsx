// web/tests/components/planos/spotlight-stage.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { SpotlightStage } from "@/components/planos/spotlight-stage";

describe("SpotlightStage", () => {
  it("shows the three criar plans with Institucional active by default", () => {
    render(<SpotlightStage />);
    // only the active plan is a document heading; the two side plans are focus buttons
    expect(screen.getByRole("heading", { level: 3, name: "Institucional" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /focar plano landing/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /focar plano branded/i })).toBeInTheDocument();
    // exactly one CTA link exists — it belongs to the active plan
    const cta = screen.getByRole("link", { name: /agendar conversa/i });
    expect(cta).toHaveAttribute("data-umami-event-plano", "institucional");
  });

  it("switches to manter plans and resets active to Crescimento", async () => {
    render(<SpotlightStage />);
    await userEvent.click(screen.getByRole("tab", { name: /manter site/i }));
    expect(screen.getByRole("heading", { level: 3, name: "Crescimento" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /agendar conversa/i })).toHaveAttribute(
      "data-umami-event-plano",
      "crescimento",
    );
    expect(screen.queryByRole("button", { name: /focar plano landing/i })).not.toBeInTheDocument();
  });

  it("focusing a side plan makes it the active one", async () => {
    render(<SpotlightStage />);
    await userEvent.click(screen.getByRole("button", { name: /focar plano landing/i }));
    expect(screen.getByRole("link", { name: /agendar conversa/i })).toHaveAttribute(
      "data-umami-event-plano",
      "landing",
    );
  });

  it("exposes an accessible toggle with two tabs, criar selected by default", () => {
    render(<SpotlightStage />);
    expect(screen.getAllByRole("tab")).toHaveLength(2);
    expect(screen.getByRole("tab", { name: /criar site/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("uses roving tabindex on the toggle tabs", () => {
    render(<SpotlightStage />);
    expect(screen.getByRole("tab", { name: /criar site/i })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: /manter site/i })).toHaveAttribute("tabindex", "-1");
  });

  it("switches mode with arrow keys", async () => {
    render(<SpotlightStage />);
    screen.getByRole("tab", { name: /criar site/i }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /manter site/i })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("heading", { level: 3, name: "Crescimento" })).toBeInTheDocument();
  });
});
