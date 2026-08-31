import { describe, it, expect, afterEach } from "vitest";
import {
  REDUCED_MOTION_QUERY,
  readPrefersReducedMotion,
} from "@/lib/hooks/use-prefers-reduced-motion";

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

describe("REDUCED_MOTION_QUERY", () => {
  it("is the standard reduced-motion media query", () => {
    expect(REDUCED_MOTION_QUERY).toBe("(prefers-reduced-motion: reduce)");
  });
});

describe("readPrefersReducedMotion", () => {
  it("is true when the visitor asked for reduced motion", () => {
    stubMatchMedia(true);
    expect(readPrefersReducedMotion()).toBe(true);
  });

  it("is false when they did not", () => {
    stubMatchMedia(false);
    expect(readPrefersReducedMotion()).toBe(false);
  });

  it("is false when matchMedia is unavailable", () => {
    Object.defineProperty(window, "matchMedia", {
      value: undefined,
      configurable: true,
      writable: true,
    });
    expect(readPrefersReducedMotion()).toBe(false);
  });
});
