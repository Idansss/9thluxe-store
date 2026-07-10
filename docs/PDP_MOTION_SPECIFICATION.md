# PDP Motion Specification

Principle: motion clarifies, never entertains. CSS + `tw-animate-css` only — no new animation
library, no WebGL, no scroll hijack, no parallax, no autoplay. Everything degrades to instant under
`prefers-reduced-motion: reduce` (globally wired in `app/globals.css`, and re-checked per island).

| Element | Motion | Duration / easing | Reduced-motion |
| --- | --- | --- | --- |
| Bottle entrance | opacity + 8px rise, once | 400ms ease-out | no transform, instant |
| Gallery thumb → main | crossfade + 1.02 scale | 200ms ease | crossfade only |
| Full-screen viewer open | fade + scale 0.98→1 | 180ms ease-out | fade only |
| Pyramid reveal | staggered fade/rise top→base, in-view | 300ms, 60ms stagger | all visible instantly |
| Accord bars | width 0→value on in-view | 500ms ease-out | rendered at full width |
| Card elevation | shadow + 1px translate on hover/focus | 150ms | none |
| Accordion | Radix height transition (existing keyframes) | 200ms | height jump |
| Sticky purchase panel (desktop) | `position: sticky` (no JS) | — | unchanged |
| Sticky mobile bar | slide-up in on scroll past hero | 200ms ease-out | appears instantly |
| Cart confirmation | toast (existing sonner) + button check swap | 150ms | check swap only |
| Ingredient image hover | 1.03 scale | 200ms | none |

## Implementation notes

- In-view reveals use a tiny `useInView` hook (IntersectionObserver, `once: true`) that **starts in
  the final state** when `prefers-reduced-motion` is set, so there is never a hidden-content trap.
- No motion blocks navigation or the add-to-cart action. Purchase controls are interactive on first
  paint; reveals are decorative only.
- No animation drives layout: reserved aspect ratios on media, fixed bar height, width-only accord
  animation inside a fixed-height track (no CLS).
