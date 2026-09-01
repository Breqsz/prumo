"use client";

import { useSyncExternalStore } from "react";

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function readPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof window.matchMedia !== "function") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function subscribe(onChange: () => void): () => void {
  if (typeof window.matchMedia !== "function") return () => {};
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Mesmo formato de [[use-is-wide-viewport]]: falso no servidor, real depois
 * da hidratação. O CSS já respeita `prefers-reduced-motion`, mas um shader
 * WebGL desenha fora do alcance do CSS — quem quiser movimento reduzido
 * precisa que o loop de animação pare, não que uma transição encurte.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    readPrefersReducedMotion,
    getServerSnapshot,
  );
}
