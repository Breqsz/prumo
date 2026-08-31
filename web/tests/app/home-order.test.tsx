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

  it("puts the services summary between proof and pricing", () => {
    const { container } = render(<HomePage />);
    const html = container.innerHTML;
    expect(html.indexOf('id="prova"')).toBeLessThan(
      html.indexOf('id="servicos-resumo"'),
    );
    expect(html.indexOf('id="servicos-resumo"')).toBeLessThan(
      html.indexOf('id="planos-teaser"'),
    );
  });
});
