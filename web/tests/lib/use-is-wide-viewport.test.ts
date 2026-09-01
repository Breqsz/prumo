import { describe, it, expect, afterEach } from "vitest";
import {
  WIDE_VIEWPORT_QUERY,
  readIsWideViewport,
} from "@/lib/hooks/use-is-wide-viewport";

const original = window.matchMedia;

afterEach(() => {
  Object.defineProperty(window, "matchMedia", {
    value: original,
    configurable: true,
    writable: true,
  });
});

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

describe("WIDE_VIEWPORT_QUERY", () => {
  it("matches the tailwind md breakpoint", () => {
    expect(WIDE_VIEWPORT_QUERY).toBe("(min-width: 768px)");
  });
});

describe("readIsWideViewport", () => {
  it("is true when the media query matches", () => {
    stubMatchMedia(true);
    expect(readIsWideViewport()).toBe(true);
  });

  it("is false when the media query does not match", () => {
    stubMatchMedia(false);
    expect(readIsWideViewport()).toBe(false);
  });

  it("is false when matchMedia is unavailable", () => {
    Object.defineProperty(window, "matchMedia", {
      value: undefined,
      configurable: true,
      writable: true,
    });
    expect(readIsWideViewport()).toBe(false);
  });
});
