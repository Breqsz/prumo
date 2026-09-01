import { render } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { HeroVideo } from "@/components/hero/hero-video";

const original = window.matchMedia;

// happy-dom defaults window.innerWidth to 1024, which already matches the
// `md` breakpoint used by useIsWideViewport. Stub matchMedia so these tests
// actually exercise the narrow-viewport (phone) path instead of happy-dom's
// wide-by-default window.
function stubMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    value: (query: string) => ({
      matches,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
    configurable: true,
    writable: true,
  });
}

beforeEach(() => {
  stubMatchMedia(false);
});

afterEach(() => {
  Object.defineProperty(window, "matchMedia", {
    value: original,
    configurable: true,
    writable: true,
  });
});

describe("HeroVideo", () => {
  it("does not mount a video element on a narrow viewport", () => {
    const { container } = render(<HeroVideo srcs={["/hero.mp4"]} />);
    expect(container.querySelector("video")).toBeNull();
  });

  it("still renders the static background layer", () => {
    const { container } = render(<HeroVideo srcs={["/hero.mp4"]} />);
    expect(container.firstChild).not.toBeNull();
  });

  it("does not mount a video when there are no sources", () => {
    const { container } = render(<HeroVideo />);
    expect(container.querySelector("video")).toBeNull();
  });
});
