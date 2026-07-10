# PDP Accessibility Report (WCAG 2.2 AA target)

Branch `upgrade/pdp-discovery-sol`. This records the a11y measures built in and manually verified.
Automated axe/Playwright runs are not yet wired (see Handoff) — findings below are from code review and
manual keyboard/screen-structure testing in the browser.

## Implemented

| Area | Measure |
| --- | --- |
| Headings | One `<h1>` (product name); every section uses `<h2>`/`<h3>` via `PdpSection`, in logical reading order matching the visual order. |
| Landmarks | Breadcrumb in `<nav aria-label="Breadcrumb">`; review search in `role="search"`; content in the app's `<main>`. |
| Keyboard | Gallery supports Arrow keys (prev/next) + Escape (close viewer); all controls are native `<button>`/`<a>`/form elements; quick-add, wishlist, compare, note/accord chips are all focusable and operable. Focus-visible rings via the design system (`focus-visible:ring-2`). |
| Full-screen viewer | `role="dialog"` + `aria-modal="true"` + labelled; focus moved to the dialog on open and returned to the trigger on close; body scroll locked while open. |
| Gallery controls | Every thumbnail/arrow has an `aria-label`; active thumbnail marked `aria-current`; the stage is a labelled `role="group"` carousel. |
| Alt text | Product images use descriptive alt (`"<name> — view N of M"` or media `alt`); decorative thumbnails use `alt=""`; all icons are `aria-hidden`. |
| Non-colour meaning | Accord bars show a rank number ("#1 strongest") in text; performance bars carry `role="img"` with a full text `aria-label` ("Longevity: 4.2 out of 5 from 37 verified reviews"); provenance is a text label, not just a colour; stock/availability always have text. |
| No hover-only content | Card actions are revealed on hover **and** focus-within, and remain reachable by keyboard/touch; nothing conveys meaning through hover alone. |
| Forms | Every input has a `<label>` (visible or `sr-only`); the waitlist email, review search/sort, and AI-fit fields are all labelled; selects use real `<select>`/`<option>`. |
| Touch targets | Primary controls are ≥ 40px (`h-10`/`h-11`/`h-12`); icon buttons are 32–44px. |
| Reduced motion | Global `prefers-reduced-motion` handling in `globals.css`; `useInView`/`Reveal` start content in its final visible state under reduced motion (no hidden-content trap); all transitions use `motion-reduce:transition-none`. |
| Zoom / reflow | Layout uses relative units, flex/grid and `max-width:100%`; wide content (compare table) scrolls inside its own `overflow-x-auto` container so the page body never scrolls horizontally. |
| Announcements | Cart/wishlist/compare actions use the app's `sonner` toasts; disabled/loading states are reflected on the actual controls. |

## Manually verified

- Tab order through the purchase panel and gallery is logical; focus ring visible throughout.
- Full-screen gallery viewer traps nothing improperly and restores focus.
- At 375px, the sticky purchase bar does not cover content (body has `pb-28` reserve + `env(safe-area-inset-bottom)`), and its button is removed from the tab order (`tabIndex=-1`) while hidden.
- Reduced-motion mode: pyramid/accord/timeline appear fully without animation.

## Gaps / to verify

- **Automated axe** across states (full data / no reviews / error / dialog open) is not yet wired — add
  `@axe-core/playwright` (Handoff).
- Colour-contrast tokens come from the existing design system; spot-checks pass, but run an automated
  contrast audit on the amber-on-parchment accents to certify AA across every state.
- Screen-reader pass (NVDA/VoiceOver) on the gallery carousel and compare table is recommended before
  launch.
