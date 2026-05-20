import { useCallback, useEffect, useRef } from "react";

type Options = {
  /** Fade-in / fade-out duration in ms. Default 500. */
  durationMs?: number;
  /** Time before video.duration to trigger fade-out, in ms. Default 550. */
  fadeOutLeadMs?: number;
};

/**
 * Custom requestAnimationFrame-based fade for a looping <video>.
 *
 * - Fades opacity 0 -> 1 over durationMs on 'loadeddata' (initial load and after loop reset).
 * - On 'timeupdate', when remaining < fadeOutLeadMs, fades opacity -> 0.
 * - On 'ended', resets currentTime, restarts playback, fades back in.
 *
 * Returns a ref callback to attach to the <video> element.
 */
export function useVideoFade({
  durationMs = 500,
  fadeOutLeadMs = 550,
}: Options = {}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
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
      el.currentTime = 0;
      el.play().catch(() => {});
      fadingOutRef.current = false;
      fadeIn();
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
        el.addEventListener("loadeddata", onLoaded);
        el.addEventListener("timeupdate", onTimeUpdate);
        el.addEventListener("ended", onEnded);
      }
    },
    [onLoaded, onTimeUpdate, onEnded],
  );

  useEffect(() => {
    return () => {
      cancelRaf();
    };
  }, []);

  return setRef;
}
