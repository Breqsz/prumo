import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ServicePage } from "@/components/servicos/service-page";
import { getService } from "@/lib/services";

const svc = getService("criacao-de-sites")!;

describe("ServicePage", () => {
  it("renders the service h1", () => {
    render(<ServicePage service={svc} />);
    expect(
      screen.getByRole("heading", { level: 1, name: svc.h1 }),
    ).toBeInTheDocument();
  });

  it("renders every benefit title and every faq question", () => {
    render(<ServicePage service={svc} />);
    for (const b of svc.benefits) {
      expect(screen.getByText(b.title)).toBeInTheDocument();
    }
    for (const f of svc.faq) {
      expect(screen.getByText(f.q)).toBeInTheDocument();
    }
  });

  it("links related plans to /planos and cases to /trabalhos", () => {
    render(<ServicePage service={svc} />);
    const planLinks = screen
      .getAllByRole("link")
      .filter((a) => a.getAttribute("href") === "/planos");
    expect(planLinks.length).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: /hold corretora/i }),
    ).toHaveAttribute("href", "/trabalhos/hold-corretora");
  });

  it("has a primary CTA to /contato", () => {
    render(<ServicePage service={svc} />);
    const cta = screen
      .getAllByRole("link")
      .filter((a) => a.getAttribute("href") === "/contato");
    expect(cta.length).toBeGreaterThan(0);
  });
});
