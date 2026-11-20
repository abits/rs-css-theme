# Changelog

All releases of rs-css-theme, newest first. Each entry links its GitHub release page.

## v0.3.0 — 2026-11-20

Release: <https://github.com/abits/rs-css-theme/releases/tag/v0.3.0>

- The package is renamed `rs-css-theme`: install it from `github:abits/rs-css-theme` and change imports from `ts-css-theme/looks/retrosafe.css` to `rs-css-theme/looks/retrosafe.css`.
- The repository moved to `abits/rs-css-theme`, and GitHub redirects the old address.

## v0.2.0 — 2026-11-20

Release: <https://github.com/abits/ts-css-theme/releases/tag/v0.2.0>

- A demo site in `demo/` shows the look in light and dark mode on a retro window layout, with Lorem ipsum text and self-hosted fonts.
- The README explains how to preview a look locally through the demo and how to install a release from its git tag with npm 12.
- The `vite-vanilla` host fixture now runs against the real look, and every fixture lockfile installs cleanly with `npm ci --install-links`.

## v0.1.0 — 2026-11-20

Release: <https://github.com/abits/ts-css-theme/releases/tag/v0.1.0>

- The `retrosafe` look has a light and a dark mode, with square corners and Inter and JetBrains Mono as the default fonts.
- Hosts swap looks with one CSS import, and the mode follows the host's `color-scheme` through `light-dark()`.
- Every look must define each token of `contract.json`, and `npm test` checks the contract, text contrast, radii and fonts.
- Vue, React, AlpineJS, Nuxt and Next are verified in Chromium; hosts must raise their CSS build target, as the README explains.
