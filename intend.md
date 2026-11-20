# Intend: ts-css-theme

## Problem

We want to style standard websites with the look of the retrosafe website
(a Framer site). The look should be reusable across our projects without
rebuilding it per framework.

The reference look, as read from its inline CSS (not yet confirmed visually):

- Near-black `#1e1e1e`, off-white `#fefefe`, greys `#dedede` and `#c4c4c4`.
- Sparse pink and magenta accents (`#f386a1`, `#d45bb6`).
- Grotesk headings (Die Grotesk C), with Inter, JetBrains Mono and Fragment
  Mono for body and labels.
- Mostly square corners (0px, occasionally 4px) and very subtle shadows.

## Goals

- A framework-neutral package that applies the retrosafe look to
  Tailwind v4 sites.
- Supported hosts: Vue, React, AlpineJS, Nuxt and Next.
- The look is swappable in code: changing one import line replaces it with
  another look. There is no user-facing look toggle.
- Every look supports a light and a dark mode. The package only defines the
  values for both; how the host selects the mode (system preference, class or
  attribute) stays the host's concern.
- A small, stable token contract (semantic names such as background,
  foreground, accent, radius, font families). A look is a file that
  implements the contract completely, for both modes.

## Constraints

- Tailwind v4 only (CSS-first `@theme`). Tailwind v3 is out of scope.
- The package is plain CSS, with no JavaScript and no framework dependency.
  Tailwind is the abstraction layer, because every supported host already
  integrates it in its own build.
- A look sets tokens only. Look-specific component CSS is deferred until a
  concrete look needs it.
- The fonts of the reference look may be commercially licensed. The default
  uses free fonts (Inter, JetBrains Mono); the original font is left to the
  host.

## Out of scope

- Switching the look at runtime by the end user (toggle, persistence). The
  light/dark mode switch belongs to the host, not to this package.
- Animations and layout of the reference site.
- Nuxt UI and other component libraries with their own variable systems.
- Tailwind Plus snippets (hardcoded palettes, separate license).

## Open questions

- Does the reference site have a real dark mode? If not, the dark values
  must be designed, not extracted. Confirm with rendered screenshots.
- How do the five hosts select the mode (media query, class or attribute)?
  The package must work with the Tailwind v4 `dark` variant in each setup.
- Who ships the font files: the package (`@font-face` for free fonts) or the
  host?
- Verify that `@import` of a package CSS file resolves in all five host
  build setups (Vite, Nuxt, Next with PostCSS, Alpine via Vite or CLI).
