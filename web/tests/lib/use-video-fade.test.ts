import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useVideoFade } from "@/lib/hooks/use-video-fade";

type FakeVideo = HTMLVideoElement & { __fire(name: string): void };

function makeFakeVideo(): FakeVideo {
  const events: Record<string, EventListener[]> = {};
  const v = {
    style: { opacity: "0" } as CSSStyleDeclaration,
    currentTime: 0,
    duration: 10,
    play: vi.fn().mockResolvedValue(undefined),
    addEventListener: (name: string, handler: EventListener) => {
      (events[name] ||= []).push(handler);
    },
    removeEventListener: (name: string, handler: EventListener) => {
      if (events[name]) {
        events[name] = events[name].filter((h) => h !== handler);
      }
    },
    __fire: (name: string) =>
      (events[name] || []).forEach((h) => h(new Event(name))),
  };
  return v as unknown as FakeVideo;
}

describe("useVideoFade", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "requestAnimationFrame",
      (cb: FrameRequestCallback) =>
        setTimeout(
          () => cb(performance.now()),
          16,
        ) as unknown as number,
    );
    vi.stubGlobal("cancelAnimationFrame", (id: number) =>
      clearTimeout(id as unknown as ReturnType<typeof setTimeout>),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("returns a ref callback", () => {
    const { result } = renderHook(() => useVideoFade());
    expect(typeof result.current).toBe("function");
  });

  it("starts fade-in when the video fires loadeddata", async () => {
    const { result } = renderHook(() => useVideoFade({ durationMs: 500 }));
    const v = makeFakeVideo();
    act(() => {
      (result.current as (el: HTMLVideoElement | null) => void)(v);
    });
    act(() => {
      v.__fire("loadeddata");
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(600);
    });
    expect(parseFloat(v.style.opacity || "0")).toBeCloseTo(1, 1);
  });

  it("fades out when timeupdate fires within fadeOutLeadMs of duration", async () => {
    const { result } = renderHook(() =>
      useVideoFade({ durationMs: 500, fadeOutLeadMs: 550 }),
    );
    const v = makeFakeVideo();
    act(() => {
      (result.current as (el: HTMLVideoElement | null) => void)(v);
    });
    act(() => {
      v.__fire("loadeddata");
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(600);
    });
    (v as { currentTime: number }).currentTime = 9.5;
    act(() => {
      v.__fire("timeupdate");
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(600);
    });
    expect(parseFloat(v.style.opacity || "1")).toBeCloseTo(0, 1);
  });
});
