import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { Reveal } from "@/components/ui/reveal";

type ObserverCallback = (entries: { isIntersecting: boolean }[]) => void;

class MockIntersectionObserver {
  static lastCallback: ObserverCallback | null = null;
  constructor(cb: ObserverCallback) {
    MockIntersectionObserver.lastCallback = cb;
  }
  observe() {}
  disconnect() {}
  unobserve() {}
}

beforeEach(() => {
  MockIntersectionObserver.lastCallback = null;
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

describe("Reveal", () => {
  it("renders children", () => {
    render(
      <Reveal>
        <p>visible content</p>
      </Reveal>,
    );
    expect(screen.getByText("visible content")).toBeInTheDocument();
  });

  it("starts hidden (opacity 0, translated down) before intersection", () => {
    render(
      <Reveal distance={20}>
        <p data-testid="child">x</p>
      </Reveal>,
    );
    const node = screen.getByTestId("child").parentElement!;
    expect(node.style.opacity).toBe("0");
    expect(node.style.transform).toBe("translateY(20px)");
  });

  it("becomes visible when intersected", async () => {
    render(
      <Reveal>
        <p data-testid="child">x</p>
      </Reveal>,
    );
    const node = screen.getByTestId("child").parentElement!;

    MockIntersectionObserver.lastCallback?.([{ isIntersecting: true }]);
    await Promise.resolve();

    expect(node.style.opacity).toBe("1");
    expect(node.style.transform).toBe("translateY(0)");
  });

  it("renders as the requested tag", () => {
    render(
      <Reveal as="section">
        <p data-testid="child">x</p>
      </Reveal>,
    );
    expect(screen.getByTestId("child").parentElement?.tagName).toBe("SECTION");
  });

  it("applies delay and duration to the inline transition", () => {
    render(
      <Reveal delay={150} duration={500}>
        <p data-testid="child">x</p>
      </Reveal>,
    );
    const node = screen.getByTestId("child").parentElement!;
    expect(node.style.transition).toContain("500ms");
    expect(node.style.transition).toContain("150ms");
  });
});
