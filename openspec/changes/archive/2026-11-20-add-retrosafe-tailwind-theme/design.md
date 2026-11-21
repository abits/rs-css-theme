# Design

## Context

The package is a set of plain CSS files that hosts import into their Tailwind
v4 entry stylesheet. See `proposal.md` for the motivation and `specs/` for the
required behavior. Tailwind v4 turns CSS variables in its theme namespaces
(`--color-*`, `--radius-*`, `--font-*`) into utilities such as `bg-background`
(Tailwind docs, `theme.mdx`).

## Goals / Non-Goals

**Goals:**

- One contract, many looks, one import line to swap.
- No JavaScript and no mode selectors in the package.

**Non-Goals:**

- Component styles of the look (window panels, gradient hero, motion).
- Support for Tailwind v3, legacy browsers, Nuxt UI or Tailwind Plus snippets.

## Decisions

**1. The contract lives directly in Tailwind's namespaces.**
A look sets `--color-background`, `--radius-md`, `--font-sans` and so on
inside `@theme`. Alternative: a separate `--ts-*` namespace mapped through
`@theme inline`. Rejected as the default because it adds a layer that
abstracts nothing, since Tailwind is already a fixed constraint. It remains
the fallback (see Risks).

**2. Mode-dependent colors use `light-dark()`.**
Example: `--color-background: light-dark(#fefefe, #1e1e1e)`. The host picks
the mode with `color-scheme`. Alternatives: selectors such as
`[data-theme="dark"]` (the package would choose the host's mechanism) or the
Tailwind `dark:` variant (it styles individual utilities, not a theme).
Only colors vary by mode; radius, fonts and tracking do not.

**3. One file per look under `looks/`.**
The host imports `rs-css-theme/looks/retrosafe.css`. Tokens common to all looks
are listed once in the contract list that the contract check reads.

**4. A contract check enforces completeness.**
A test reads the contract list and fails when a look file lacks a token or a
mode value. This turns the spec requirement "Complete token set" into
something the build can verify. The contrast requirement is tested the same
way, with a computed WCAG ratio per text pairing.

**5. The package ships no font files in the first version.**
The look sets the families `Inter` and `JetBrains Mono` with generic
fallbacks, and the README tells hosts how to load them. Shipping `@font-face`
would add `url()` resolution through five different build setups, which is
unverified. This can be added later without changing the contract.

**6. Dark values invert the neutrals and keep the accent.**
`#1e1e1e` becomes the background and `#fefefe` the text. The accent
`#f386a1` has about 6.9:1 contrast against `#1e1e1e` text, so
`accent-foreground` stays `#1e1e1e` in both modes. The muted text color must
be darker than the original `#858585`, which reaches only about 3.7:1 on
`#fefefe`. The computed ratios are 6.93:1 and 3.66:1, and the contrast test
guards the look's own pairings.

**7. The host raises its CSS build target to the `light-dark()` baseline.**
Prototypes in Vite 8.3.8 (Vue, React, AlpineJS), Nuxt and Next 16.4.6 showed
the same failure with default settings: the host's CSS minifier (Lightning
CSS) targets older browsers and rewrites `light-dark()` into a
`--lightningcss-light/-dark` fallback. That fallback renders nothing when the
value sits in a custom property, as it does in `@theme`. Tailwind itself is
not the cause, because its own Lightning CSS call excludes the `LightDark`
feature. Raising the target to Chrome 123, Safari 17.5 and Firefox 120 makes
all five fixtures pass in light and dark. The setting differs per host: Vite
and Nuxt use `build.cssTarget`, Next uses `browserslist`. Alternatives:
selectors for the mode (the package would own the mode mechanism) and the
two-layer variable pattern (the same rewrite applies, so it does not help).
The cost is that the one-import swap needs a one-time host setting.

## Risks / Trade-offs

- **`light-dark()` inside `@theme` works** when the CSS reaches the browser
  unchanged: a single layer is enough (prototype 1.1, all hosts). The Tailwind
  docs only show the two-layer pattern, and the two-layer fallback is not
  needed.
- **A host with older CSS targets silently renders no colors.** The page
  shows transparent backgrounds and default text colors. → Document the
  per-host setting in the README and keep the fixtures as regression checks.
  Newer host versions may raise their default target over time; that is
  unverified.
- **`@import` of a package file resolves in all five hosts** when the package
  is a real copy in `node_modules` with `exports` for `looks/*.css` (prototypes
  1.3 and 1.4). Next with Turbopack rejects a symlinked package outside the
  project root, which only affects linked development setups.
- **Unused theme variables are not emitted by default** (`theme.mdx`, "Generating
  all CSS variables"). → Use `@theme static` if a host reads variables
  directly instead of through utilities.
- **Browser baseline:** `light-dark()` is supported from Chrome 123 (Edge
  follows Chrome), Firefox 120 and Safari 17.5, according to the MDN browser
  compatibility data. Colors only; `light-dark()` with `<image>` values needs
  much newer browsers and is not used.
- **Hosts that switch mode with a class** must keep `color-scheme` and their
  own `dark` variant in sync. → Document it in the README.

## Open Questions

- Does the look file set `:root { color-scheme: light dark }` as a default?
  The specs assume the host sets `color-scheme`, so either answer leaves them
  valid. The proposed default is that the host opts in, so importing a look
  never changes the mode on its own.
