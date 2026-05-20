import { useCallback, useEffect, useRef } from "react";

type Options = {
  /**
   * Optional ordered playlist of video sources. When the current clip ends,
   * the hook advances to the next src (wrapping back to the first).
   * Read once at mount — changing the array later does not retrigger.
   *
   * When omitted (or single-element), the hook just resets currentTime to 0
   * on ended, so the same clip restarts.
   */
  srcs?: string[];
  /** Fade-in / fade-out duration in ms. Default 500. */
  durationMs?: number;
  /** Time before video.duration to trigger fade-out, in ms. Default 550. */
  fadeOutLeadMs?: number;
};

/**
 * Custom requestAnimationFrame-based fade for a looping/playlist <video>.
 *
 * Single-clip mode (no `srcs` or `srcs.length <= 1`):
 *   loadeddata → fade-in. timeupdate near end → fade-out. ended → reset
 *   currentTime, play, fade-in.
 *
 * Playlist mode (`srcs.length > 1`):
 *   Same fade timing, but `ended` advances to next src in `srcs` (wrapping).
 *   The new src's `loadeddata` triggers the next fade-in.
 *
 * Returns a ref callback to attach to the <video> element.
 */
export function useVideoFade({
  srcs,
  durationMs = 500,
  fadeOutLeadMs = 550,
}: Options = {}) {
  const srcsRef = useRef(srcs);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const indexRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const fadingOutRef = useRef(false);

  const cancelRaf = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const animateOpacity = useCallback(
    (from: number, to: number, onDone?: () => void) => {
      const el = videoRef.current;
      if (!el) return;
      cancelRaf();
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / durationMs);
        const value = from + (to - from) * progress;
        el.style.opacity = value.toString();
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          rafRef.current = null;
          onDone?.();
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [durationMs],
  );

  const fadeIn = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    fadingOutRef.current = false;
    const current = parseFloat(el.style.opacity || "0");
    animateOpacity(current, 1);
  }, [animateOpacity]);

  const fadeOut = useCallback(() => {
    const el = videoRef.current;
    if (!el || fadingOutRef.current) return;
    fadingOutRef.current = true;
    const current = parseFloat(el.style.opacity || "1");
    animateOpacity(current, 0);
  }, [animateOpacity]);

  const onLoaded = useCallback(() => {
    fadeIn();
  }, [fadeIn]);

  const onTimeUpdate = useCallback(() => {
    const el = videoRef.current;
    if (!el || !el.duration || isNaN(el.duration)) return;
    if (fadingOutRef.current) return;
    const remaining = (el.duration - el.currentTime) * 1000;
    if (remaining <= fadeOutLeadMs) {
      fadeOut();
    }
  }, [fadeOut, fadeOutLeadMs]);

  const onEnded = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.style.opacity = "0";
    setTimeout(() => {
      const list = srcsRef.current;
      if (list && list.length > 1) {
        indexRef.current = (indexRef.current + 1) % list.length;
        el.src = list[indexRef.current];
        el.load();
        fadingOutRef.current = false;
        el.play().catch(() => {});
        // fadeIn triggers on the new src's 'loadeddata' event
      } else {
        el.currentTime = 0;
        el.play().catch(() => {});
        fadingOutRef.current = false;
        fadeIn();
      }
    }, 100);
  }, [fadeIn]);

  const setRef = useCallback(
    (el: HTMLVideoElement | null) => {
      const prev = videoRef.current;
      if (prev) {
        prev.removeEventListener("loadeddata", onLoaded);
        prev.removeEventListener("timeupdate", onTimeUpdate);
        prev.removeEventListener("ended", onEnded);
      }
      videoRef.current = el;
      if (el) {
        el.style.opacity = "0";
        const list = srcsRef.current;
        if (list && list.length > 0 && !el.src) {
          indexRef.current = 0;
          el.src = list[0];
        }
        el.addEventListener("loadeddata", onLoaded);
        el.addEventListener("timeupdate", onTimeUpdate);
        el.addEventListener("ended", onEnded);
      }
    },
    [onLoaded, onTimeUpdate, onEnded],
  );

  useEffect(() => {
    srcsRef.current = srcs;
  }, [srcs]);

  useEffect(() => {
    return () => {
      cancelRaf();
    };
  }, []);

  return setRef;
}
