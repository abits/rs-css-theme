# Proposal

## Why

We want to style websites with the retrosafe look without rebuilding it
per framework. Our sites use Vue, React, AlpineJS, Nuxt and Next, and all of
them can run Tailwind v4, so Tailwind's CSS-first theme variables are a
common ground. The earlier framing as a Nuxt Layer for Nuxt UI no longer
fits the goal.

## What Changes

- Add a framework-neutral, plain-CSS package that applies the retrosafe
  look to Tailwind v4 sites.
- Define a small token contract in Tailwind's theme namespaces. A look is a
  CSS file that implements the contract completely, and the host swaps looks
  by changing one import line.
- Ship the retrosafe look as the first look, with a light and a dark mode.
  The look has no native dark mode, so the dark values are designed.
- Select the mode through `color-scheme` and `light-dark()`, so the package
  ships no mode selectors and the host stays in control. Evergreen browsers
  only.
- **BREAKING** (to the repository's own framing): drop the Nuxt Layer and
  Nuxt UI scope described in `CLAUDE.md` and `README.md`.

## Capabilities

### New Capabilities

- `theme-contract`: The set of tokens every look must define, the rule that
  a look is swappable through one import, and the mode selection through
  `color-scheme`.
- `retrosafe-look`: The retrosafe look as a look file, with designed light
  and dark values, an accessible accent, and free default fonts.

### Modified Capabilities

None. The project has no existing specs.

## Impact

- New CSS files in the package; no JavaScript and no framework dependency.
- Hosts need Tailwind v4 and a browser with `light-dark()` support.
- `CLAUDE.md` and `README.md` must be rewritten from the Nuxt Layer framing.
- Open prototype questions (single-layer `light-dark()` in `@theme`, `@import`
  resolution in all five hosts) are scheduled as the first tasks.
