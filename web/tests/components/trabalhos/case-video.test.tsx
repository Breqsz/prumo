import { render } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { CaseVideo } from "@/components/trabalhos/case-video";

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

afterEach(() => {
  Object.defineProperty(window, "matchMedia", {
    value: original,
    configurable: true,
    writable: true,
  });
});

describe("CaseVideo", () => {
  it("does not mount a video element on a narrow viewport", () => {
    stubMatchMedia(false);
    const { container } = render(
      <CaseVideo src="/case.mp4" className="absolute inset-0" />,
    );
    expect(container.querySelector("video")).toBeNull();
  });

  it("mounts the video element on a wide viewport", () => {
    stubMatchMedia(true);
    const { container } = render(
      <CaseVideo src="/case.mp4" className="absolute inset-0" />,
    );
    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute("src", "/case.mp4");
    expect(video).toHaveAttribute("autoplay");
    expect(video).toHaveAttribute("loop");
    expect(video).toHaveClass("absolute", "inset-0");
  });
});
