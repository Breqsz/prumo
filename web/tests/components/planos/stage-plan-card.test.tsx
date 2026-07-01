import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { StagePlanCard } from "@/components/planos/stage-plan-card";
import { CRIAR_PLANS } from "@/lib/plans";

const institucional = CRIAR_PLANS.find((p) => p.eventSlug === "institucional")!;
const landing = CRIAR_PLANS.find((p) => p.eventSlug === "landing")!;

describe("StagePlanCard", () => {
  it("active: renders name, description, every feature and a CTA to /contato", () => {
    render(<StagePlanCard plan={institucional} state="active" onFocus={() => {}} />);
    expect(screen.getByRole("heading", { level: 3, name: "Institucional" })).toBeInTheDocument();
    expect(screen.getByText(institucional.description)).toBeInTheDocument();
    institucional.features.forEach((f) => expect(screen.getByText(f)).toBeInTheDocument());
    const cta = screen.getByRole("link", { name: /agendar conversa/i });
    expect(cta).toHaveAttribute("href", "/contato");
    expect(cta).toHaveAttribute("data-umami-event", "plano_click");
    expect(cta).toHaveAttribute("data-umami-event-plano", "institucional");
  });

  it("side: renders a focus button, no CTA link, and calls onFocus on click", async () => {
    const onFocus = vi.fn();
    render(<StagePlanCard plan={landing} state="side" onFocus={onFocus} />);
    expect(screen.queryByRole("link", { name: /agendar conversa/i })).not.toBeInTheDocument();
    expect(screen.getByText(landing.name)).toBeInTheDocument();
    expect(screen.getByText(landing.price)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /focar plano landing/i }));
    expect(onFocus).toHaveBeenCalledOnce();
  });
});
