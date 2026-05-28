import { afterEach, describe, expect, it, vi } from "vitest";
import { track } from "@/lib/analytics";

afterEach(() => {
  delete (window as unknown as { umami?: unknown }).umami;
  vi.restoreAllMocks();
});

describe("track", () => {
  it("is a no-op (no throw) when umami is not loaded", () => {
    expect(() => track("cta_contato", { source: "nav" })).not.toThrow();
  });

  it("forwards event name and data to umami.track when present", () => {
    const spy = vi.fn();
    (window as unknown as { umami: { track: typeof spy } }).umami = { track: spy };
    track("form_submit");
    expect(spy).toHaveBeenCalledWith("form_submit", undefined);
  });
});
