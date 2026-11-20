# Changelog

All releases of ts-css-theme, newest first. Each entry links its GitHub release page.

## v0.1.0 — 2026-11-20

Release: <https://github.com/abits/ts-css-theme/releases/tag/v0.1.0>

- The `retrosafe` look has a light and a dark mode, with square corners and Inter and JetBrains Mono as the default fonts.
- Hosts swap looks with one CSS import, and the mode follows the host's `color-scheme` through `light-dark()`.
- Every look must define each token of `contract.json`, and `npm test` checks the contract, text contrast, radii and fonts.
- Vue, React, AlpineJS, Nuxt and Next are verified in Chromium; hosts must raise their CSS build target, as the README explains.
