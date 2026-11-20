# Design

## Context

The package is a set of plain CSS files that hosts import into their Tailwind
v4 entry stylesheet. See `proposal.md` for the motivation and `specs/` for the
required behavior. Tailwind v4 turns CSS variables in its theme namespaces
(`--color-*`, `--radius-*`, `--font-*`) into utilities such as `bg-background`
(Tailwind docs, `theme.mdx`). The reference site is a Framer site without
Tailwind and without a dark mode.

## Goals / Non-Goals

**Goals:**

- One contract, many looks, one import line to swap.
- No JavaScript and no mode selectors in the package.

**Non-Goals:**

- Component styles of the reference (window panels, gradient hero, motion).
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
The host imports `ts-css-theme/looks/typesafe.css`. Tokens common to all looks
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
be darker than the reference's `#858585`, which reaches only about 3.7:1 on
`#fefefe`. Both ratios are my calculation and are verified by the contrast
test.

## Risks / Trade-offs

- **`light-dark()` inside `@theme` is unverified.** The Tailwind docs show only
  a two-layer pattern for mode-dependent colors (raw variables plus
  `@theme inline`, `colors.mdx`). → The first task is a prototype. If it
  fails, switch the look files to the two-layer pattern; specs stay valid
  because they describe utilities, not variable names.
- **`@import` of a package file may resolve differently per host.** → A
  prototype per host before the first release.
- **Unused theme variables are not emitted by default** (`theme.mdx`, "Generating
  all CSS variables"). → Use `@theme static` if a host reads variables
  directly instead of through utilities.
- **Browser baseline is approximate.** Roughly Chrome 123, Firefox 120 and
  Safari 17.5 from memory. → Confirm against MDN and fix the numbers in the
  README.
- **Hosts that switch mode with a class** must keep `color-scheme` and their
  own `dark` variant in sync. → Document it in the README.

## Open Questions

- Does the look file set `:root { color-scheme: light dark }` as a default?
  The specs assume the host sets `color-scheme`, so either answer leaves them
  valid. The proposed default is that the host opts in, so importing a look
  never changes the mode on its own.
