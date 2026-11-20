# Tasks

## 1. Prototypes

- [ ] 1.1 Create a Vite plus Tailwind v4 fixture with `light-dark()` colors in `@theme`, list its build output folder in `.gitignore`, and verify in Chromium that `bg-background` resolves to the light value under `color-scheme: light` and to the dark value under `color-scheme: dark`
- [ ] 1.2 Record the result of 1.1 in `design.md`; if it fails, switch the decision to the two-layer pattern (raw variables plus `@theme inline`) and verify the same Chromium check passes with it
- [ ] 1.3 Verify `@import` of a package CSS file from `node_modules` builds and applies in a Vite fixture for Vue, React and AlpineJS, checked by computed colors in Chromium
- [ ] 1.4 Verify the same import in a Nuxt fixture and in a Next fixture with the PostCSS plugin, checked by computed colors in Chromium
- [ ] 1.5 Confirm the minimum browser versions for `light-dark()` against MDN and replace the approximate numbers in `proposal.md` and `design.md`

## 2. Package and look

- [ ] 2.1 Create `package.json` with `exports` for `looks/*.css`, no dependencies and no scripts that ship to hosts, and verify `npm pack --dry-run` lists only CSS files and documentation
- [ ] 2.2 Write the contract list (colors, radii, font families) and a contract check that fails on a missing token or mode value, and verify its tests cover a complete look and a look missing one token
- [ ] 2.3 Implement `looks/typesafe.css` with the palette, radii and font families from the `typesafe-look` spec, and verify the contract check accepts it
- [ ] 2.4 Add a contrast test that computes the WCAG ratio for each text pairing in both modes, and verify it passes for the look and fails for a fixture with a low-contrast muted color
- [ ] 2.5 Add a test for radius (none above 4px, `sm` is 0) and font families (Inter, JetBrains Mono, generic fallbacks), and verify it passes for the look

## 3. Host verification

- [ ] 3.1 Run the host fixtures from 1.3 and 1.4 against the real look and verify in Chromium that background, foreground, accent, radius and font utilities resolve to the look's values in light, dark and system mode

## 4. Documentation and repository

- [ ] 4.1 Rewrite the project description in `CLAUDE.md` from the Nuxt Layer framing to the framework-neutral Tailwind v4 package, and verify `make lint-md` passes
- [ ] 4.2 Rewrite `README.md` with installation, the one-line import, setting `color-scheme`, keeping `color-scheme` and the `dark` variant in sync for class-based hosts, loading the default fonts and the browser baseline, and verify `make lint-md` passes and the documented import works in a fixture
- [ ] 4.3 Update `intend.md` to move the answered open questions into decisions, and verify `make lint-md` passes

## Workflow follow-up

- Archive the change after review and after the host verification in group 3 passes.
- Announce the first release in `README.md` and `CHANGELOG.md` as required by the release rules.
