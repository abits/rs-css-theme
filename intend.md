# Intend: ts-css-theme

## Problem

We want to style standard websites with the look of the retrosafe website
(a Framer site). The look should be reusable across our projects without
rebuilding it per framework.

The reference look, as read from its inline CSS and confirmed by a render of
the first viewport (1440 x 900):

- Near-black `#1e1e1e`, off-white `#fefefe`, greys `#dedede` and `#c4c4c4`.
- Sparse pink and magenta accents (`#f386a1`, `#d45bb6`).
- Grotesk headings (Die Grotesk C), with Inter, JetBrains Mono and Fragment
  Mono for body and labels.
- Mostly square corners (0px, occasionally 4px) and very subtle shadows.
- Component styles that tokens alone do not express: retro window panels
  (grey body, black title bar, mono text), white square navigation chips and
  a pastel gradient hero.

The reference has a light appearance only. It ignores `prefers-color-scheme`
(rendered output is byte-identical in light and dark emulation) and has no
theme toggle. Its dark values therefore do not exist and must be designed.

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
  concrete look needs it. This leaves the window panels and the gradient hero
  of the reference out of the first version.
- The dark mode of the retrosafe look is designed, not extracted. Starting
  point: invert the neutrals (`#1e1e1e` as background, `#fefefe` as text) and
  keep the pink accent. The accent must reach a contrast ratio of at least
  4.5:1 for text on the dark background (WCAG 2.x AA), or a lighter variant
  is used for text.
- The mode is selected through CSS `color-scheme`. Looks define colors with
  `light-dark()`, so the package ships no mode selectors and the host
  decides by setting `color-scheme` (system preference, class or attribute).
  Only colors depend on the mode; radius, fonts and tracking are the same in
  both.
- Evergreen browsers only; legacy browsers are not supported. The baseline is
  the first versions with `light-dark()` support, roughly Chrome 123,
  Firefox 120 and Safari 17.5 (to be confirmed before it is fixed in a spec).
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

- Is the inverted-neutrals approach for the dark mode acceptable, or should
  it get its own palette (for example a slightly warm dark grey)?
- Do subpages of the reference (docs, console) differ from the first
  viewport? Only the landing page was rendered.
- Does `light-dark()` work directly inside `@theme` (for example
  `--color-background: light-dark(#fefefe, #1e1e1e)`) without the two-layer
  pattern of raw variables plus `@theme inline`? Verify in a prototype; the
  Tailwind docs only show the two-layer pattern.
- Does the look file set `:root { color-scheme: light dark }` as a default,
  or does the host always opt in? Without it, a site stays light until the
  host acts.
- Should the token contract live directly in Tailwind's namespaces
  (`--color-*`, `--radius-*`, `--font-*`), or in a separate `--ts-*`
  namespace mapped onto them? The direct form is preferred if the
  `light-dark()` check above holds.
- Who ships the font files: the package (`@font-face` for free fonts) or the
  host?
- Verify that `@import` of a package CSS file resolves in all five host
  build setups (Vite, Nuxt, Next with PostCSS, Alpine via Vite or CLI).
