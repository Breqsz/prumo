# public/

## Hero background video

The Hero accepts an optional `videoSrc` prop. When provided, it loads a looping
video with a custom requestAnimationFrame fade (see `lib/hooks/use-video-fade.ts`).

**Pending:** place a real architectural/geometric clip at `public/hero.mp4`
and pass `videoSrc="/hero.mp4"` from `app/page.tsx`. Suggested specs:

- 1920×1080 or larger
- 6–12 seconds, seamless loop, muted-by-design (no audio track needed)
- mp4 (H.264), `-movflags +faststart`
- Visual direction: vertical/architectural geometry, slow camera, neutral palette
  that does not clash with white text. Pulls the "prumo" metaphor (precision,
  verticality, alignment).

Until then, the Hero renders without a background video — just the black canvas
plus the vignette overlay, which is intentional and clean.
