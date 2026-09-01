import { render } from "@testing-library/react";
import { describe, it, expect, beforeAll, afterEach } from "vitest";
import { AmbientVideo } from "@/components/ambient/ambient-video";

const original = window.matchMedia;

// happy-dom defaults window.innerWidth to 1024, which already matches the
// `md` breakpoint used by useIsWideViewport. Stub matchMedia so these tests
// actually exercise the narrow-viewport (phone) path instead of happy-dom's
// wide-by-default window. Pattern mirrors hero-video.test.tsx.
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

beforeAll(() => {
  // AmbientVideo's setRef (from useVideoFade) calls el.play() directly on
  // mount when the wide branch renders a <video>. Silence it the same way
  // project-reel.test.tsx does, so happy-dom's unimplemented play() doesn't
  // throw during render.
  Object.defineProperty(HTMLMediaElement.prototype, "play", {
    configurable: true,
    value: () => Promise.resolve(),
  });
  Object.defineProperty(HTMLMediaElement.prototype, "pause", {
    configurable: true,
    value: () => {},
  });
});

afterEach(() => {
  Object.defineProperty(window, "matchMedia", {
    value: original,
    configurable: true,
    writable: true,
  });
});

describe("AmbientVideo", () => {
  it("does not mount a video element on a narrow viewport", () => {
    stubMatchMedia(false);
    const { container } = render(
      <AmbientVideo srcs={["/ambient.mp4"]}>
        <div>conteúdo</div>
      </AmbientVideo>,
    );
    expect(container.querySelector("video")).toBeNull();
  });

  it("mounts a video element on a wide viewport", () => {
    stubMatchMedia(true);
    const { container } = render(
      <AmbientVideo srcs={["/ambient.mp4"]}>
        <div>conteúdo</div>
      </AmbientVideo>,
    );
    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute("src", "/ambient.mp4");
  });
});
