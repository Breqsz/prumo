"use client";

import { useIsWideViewport } from "@/lib/hooks/use-is-wide-viewport";

type CaseVideoProps = {
  src: string;
  className: string;
};

/**
 * Autoplaying case-page video (header hero or "next chapter" teaser),
 * gated to wide viewports only — same pattern as HeroVideo/AmbientVideo.
 * `app/trabalhos/[slug]/page.tsx` is a server component, so this is the
 * smallest client boundary that can call `useIsWideViewport`; the page
 * itself renders every other element on the server as before.
 *
 * Gate the JSX only, never the hook: below 768px this returns null and no
 * <video> ever mounts, so the referred visitor coming from the home's Prova
 * section doesn't land on a page that autoplays two videos on 4G.
 */
export function CaseVideo({ src, className }: CaseVideoProps) {
  const isWide = useIsWideViewport();
  if (!isWide) return null;
  return (
    <video
      src={src}
      autoPlay
      muted
      playsInline
      loop
      preload="metadata"
      className={className}
      aria-hidden="true"
    />
  );
}
