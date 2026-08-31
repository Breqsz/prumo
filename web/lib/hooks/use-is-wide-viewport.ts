"use client";

import { useSyncExternalStore } from "react";

/** Tailwind `md`. Abaixo disso o fundo é estático e nenhum vídeo é baixado. */
export const WIDE_VIEWPORT_QUERY = "(min-width: 768px)";

export function readIsWideViewport(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof window.matchMedia !== "function") return false;
  return window.matchMedia(WIDE_VIEWPORT_QUERY).matches;
}

function subscribe(onChange: () => void): () => void {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => {};
  }
  const mql = window.matchMedia(WIDE_VIEWPORT_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Falso no servidor e no primeiro render (hidratação), para que o HTML
 * entregue ao celular nunca contenha um <video>. Vira verdadeiro logo após
 * a hidratação em tela larga, e acompanha o redimensionamento.
 *
 * Usa useSyncExternalStore em vez de useState+useEffect para se inscrever
 * na media query sem disparar setState dentro de um efeito.
 */
export function useIsWideViewport(): boolean {
  return useSyncExternalStore(subscribe, readIsWideViewport, getServerSnapshot);
}
