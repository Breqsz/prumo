import { render } from "@testing-library/react";
import { describe, it, expect, beforeAll } from "vitest";
import HomePage from "@/app/page";

beforeAll(() => {
  if (!("IntersectionObserver" in window)) {
    class StubObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    }
    Object.defineProperty(window, "IntersectionObserver", {
      value: StubObserver,
      configurable: true,
      writable: true,
    });
  }
});

describe("home section order", () => {
  it("puts the proof before the pricing teaser", () => {
    const { container } = render(<HomePage />);
    const html = container.innerHTML;
    const prova = html.indexOf('id="prova"');
    const planos = html.indexOf('id="planos-teaser"');
    expect(prova).toBeGreaterThan(-1);
    expect(planos).toBeGreaterThan(-1);
    expect(prova).toBeLessThan(planos);
  });

  it("keeps the services index inside the proof section, not as its own", () => {
    // A seção "O que eu faço" existia solta entre a prova e os planos, e não
    // se sustentava: três frases de mesmo peso num container largo. Virou o
    // índice ao lado do título dos trabalhos. Se alguém recriar a seção solta,
    // este teste avisa.
    const { container } = render(<HomePage />);
    const html = container.innerHTML;
    expect(html).not.toContain('id="servicos-resumo"');

    const prova = container.querySelector("#prova");
    expect(prova).not.toBeNull();
    expect(prova?.textContent).toContain("Sites institucionais");
    expect(prova?.querySelector('a[href="/servicos"]')).not.toBeNull();
  });

  it("closes the page with the contact call to action", () => {
    const { container } = render(<HomePage />);
    const html = container.innerHTML;
    const planos = html.indexOf('id="planos-teaser"');
    const cta = html.indexOf('id="cta"');
    expect(planos).toBeGreaterThan(-1);
    expect(cta).toBeGreaterThan(-1);
    expect(planos).toBeLessThan(cta);
  });
});
