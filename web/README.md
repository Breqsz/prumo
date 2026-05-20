# Prumo — web

Next.js 16 + Tailwind 4 + TypeScript app for the Prumo studio site.
Project source of truth lives at the repo root: `../CONTEXT.md`.

## Develop

```bash
cd web
npm run dev
# http://localhost:3000
```

## Test

```bash
npm test          # one-off
npm run test:watch
npm run test:ui
```

## Build

```bash
npm run build     # Turbopack (default in Next 16)
npm run start     # production server
```

## Stack

- Next.js 16.2 + React 19.2 (App Router, Turbopack)
- TypeScript 5, strict
- Tailwind CSS 4 (CSS-first `@theme` config in `app/globals.css`)
- Vitest 4 + Testing Library + happy-dom
- `lucide-react` for utility icons; brand icons inlined in `components/hero/hero-social.tsx`

## Project layout (web/)

```
app/
  layout.tsx     ← html shell, fonts, base metadata
  page.tsx       ← home (renders <Hero />)
  globals.css    ← Tailwind + design tokens + liquid-glass + prumo-line
  fonts.ts       ← Instrument Serif + Inter via next/font/google

components/
  ui/
    liquid-glass.tsx   ← polymorphic glass wrapper
    prumo-lines.tsx    ← decorative vertical lines (brand element)
  hero/
    hero.tsx           ← composes the hero
    hero-video.tsx     ← optional bg video + custom rAF fade
    hero-nav.tsx       ← glass-capsule navbar
    hero-content.tsx   ← heading + tagline + CTAs + stack chips
    hero-social.tsx    ← inline-SVG brand icons in glass circles

lib/hooks/
  use-video-fade.ts    ← rAF-based fade-in/out for looping <video>

public/
  README.md            ← drop hero video here (see file)

tests/
  setup.ts
  components/{ui,hero}/...
  lib/use-video-fade.test.ts
```

## Deploy to Vercel

Project root in the Vercel dashboard must be set to `web` (since the git repo root is one level up).

```bash
# From E:\Projetos\Prumo\
cd web
npx vercel link        # link to your Vercel account, name the project "prumo"
npx vercel             # preview deploy
npx vercel --prod      # production deploy
```

Set environment variables (when added) under Project → Settings → Environment Variables.

## Pending

- Drop the real background video at `public/hero.mp4` and pass `videoSrc="/hero.mp4"` in `app/page.tsx`.
- Wire real Calendly URL on the "Agendar conversa" CTA (currently `https://cal.com/`).
- Replace placeholder WhatsApp / Instagram / LinkedIn href stubs with real profile URLs.
- Mobile breakpoint visual review at 375 / 414 / 768px in real browser DevTools.
