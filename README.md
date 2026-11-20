# ts-css-theme

Swappable looks for Tailwind v4 sites. The first look reproduces typesafe.ai, with a light and a dark mode. The package is plain CSS: no JavaScript, no plugin and no framework dependency beyond Tailwind v4. It works with Vue, React, AlpineJS, Nuxt and Next.

## What's new — v0.1.0

- The `typesafe` look reproduces typesafe.ai in light and dark mode, with square corners and Inter and JetBrains Mono as the default fonts.
- Hosts swap looks with one CSS import, and the mode follows the host's `color-scheme` through `light-dark()`.
- Every look must define each token of `contract.json`, and `npm test` checks the contract, text contrast, radii and fonts.
- Vue, React, AlpineJS, Nuxt and Next are verified in Chromium; hosts must raise their CSS build target, as the README explains.

Earlier releases: see [CHANGELOG.md](CHANGELOG.md).

## Usage

### Install

The package is not published to npm. Install a release from its git tag, which needs read access to the GitHub repository:

    npm install --allow-git=root github:abits/ts-css-theme#v0.1.0

npm 12 and later block git dependencies unless you pass `--allow-git`. To work on the package itself, depend on a local checkout instead:

    npm install --install-links file:../ts-css-theme

### Import a look

Import the look in your Tailwind v4 entry stylesheet:

    @import "tailwindcss";
    @import "ts-css-theme/looks/typesafe.css";

Then use the contract utilities: `bg-background`, `text-foreground`, `text-muted`, `border-border`, `bg-accent`, `text-accent-foreground`, `rounded-sm`, `rounded-md`, `rounded-lg`, `font-sans` and `font-mono`. To switch to another look, replace the import line with the import of that look.

### Choose the mode

Colors are defined with `light-dark()`, so the mode follows the CSS `color-scheme` of your page. Importing a look does not set it, and without it the page stays light. To follow the system preference:

    :root { color-scheme: light dark; }

Use `color-scheme: light` or `color-scheme: dark` to force a mode. If you switch with a class, set `color-scheme` in the same rule and point Tailwind's `dark` variant at the same class, so theme colors and your own `dark:` utilities stay in sync:

    .dark { color-scheme: dark; }
    @custom-variant dark (&:where(.dark, .dark *));

### Raise the CSS target of your build

This setting is required. A build that targets browsers older than Chrome 123, Safari 17.5 or Firefox 120 rewrites `light-dark()` into a fallback that renders no colors. The page then shows transparent backgrounds and default text colors, without an error.

Vite (Vue, React, AlpineJS), in `vite.config.js`:

    build: { cssTarget: ['chrome123', 'safari17.5', 'firefox120'] }

Nuxt, in `nuxt.config.ts`:

    vite: { build: { cssTarget: ['chrome123', 'safari17.5', 'firefox120'] } }

Next, in `package.json`:

    "browserslist": ["chrome >= 123", "safari >= 17.5", "firefox >= 120"]

### Fonts

The typesafe look sets `Inter` for `font-sans` and `JetBrains Mono` for `font-mono`, each with a generic fallback. The package ships no font files. Load both families in the way your host prefers, for example with a `<link>` to a font provider or a self-hosted `@font-face`, and use these exact family names.

### Browser support

`light-dark()` needs Chrome 123, Edge 123, Firefox 120 or Safari 17.5 (MDN browser compatibility data). Older browsers are not supported and get no fallback.

## Prerequisites

- [Node.js](https://nodejs.org) 22 or newer (for `npm test`)
- [Claude Code](https://claude.com/claude-code)
- [OpenSpec](https://github.com/Fission-AI/OpenSpec) — `npm install -g @fission-ai/openspec`
- [GitHub CLI](https://cli.github.com) — `brew install gh` / `apt install gh`, then `gh auth login` (for `repo-init` and `sync-issues`)
- [jq](https://jqlang.github.io/jq/) — `brew install jq` / `apt install jq` (parses `gh` output for `sync-issues`)
- [markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli2) — `npm install -g markdownlint-cli2` (for `make lint-md`)

## Getting started

1. Fill in `intend.md` describing what you want to build.
2. Run `claude` in this directory.
3. Invoke `/opsx:explore` in Claude to draft requirements and tech decisions.
4. Hand off to the sub-agent team in `.claude/agents/` — see `AGENTS.md`.

## Git + GitHub

Once `intend.md` is ready and you've generated at least one openspec change:

    make repo-init      # git init (if needed), initial commit, gh repo create --private --push
    make sync-issues    # mirror openspec/changes/*/tasks.md into GitHub Issues

`repo-init` defaults to `--private`; pass `--public` to `bash scripts/repo-init.sh --public` to override. `sync-issues` supports `--dry-run` to preview and `--change <id>` to scope to a single change.

The scaffold also ships a Claude Code `PostToolUse` hook (`.claude/settings.json`) that runs `scripts/sync-issues.sh --auto` in the background whenever Claude writes to a `openspec/changes/*/tasks.md`, so issues stay in sync as `/opsx:apply` ticks boxes. The hook is silent on missing prereqs (no `gh` auth, no `origin`, etc.).

Each synced issue carries a `<!-- viber-task-id: … -->` fingerprint plus the labels `openspec` and `openspec/<change-id>`. Ticking `[x]` closes the issue; un-ticking reopens; deleting a task or editing its wording closes the orphan on the next sync with a note pointing at `openspec/`.

## Commands

    npm test            # unit checks for looks: contract, contrast, radius, fonts
    make lint-md        # markdown linting
    make repo-init      # first-time GitHub repo creation + push
    make sync-issues    # openspec/tasks.md → GitHub Issues

## Preview a look locally

`demo/` is a small Vite and Tailwind v4 page that imports the look and shows its colors, radii and a form. A toggle in the header switches between light, dark and system mode.

    cd demo
    npm install --no-package-lock
    npm run dev

Open the address Vite prints, usually `http://localhost:5173/`. A plain `npm install` links the package to your checkout, so saving a change to a file in `looks/` updates the open page without a reload. Do not add `--install-links` here, because that copies the package and the page then shows the old copy. `--no-package-lock` keeps the symlink out of `demo/package-lock.json`.

To preview another look, change the second `@import` in `demo/src/style.css` to that look's file. `npm run build` writes a static copy to `demo/dist`.

## Host fixtures

`test/fixtures/` holds one minimal project per host (`vite-vue`, `vite-react`, `vite-alpine`, `nuxt`, `next`). After `npm install --install-links` inside a fixture, check it in Chromium with `ONLY_RAISED=1 test/support/check-vite-fixture.sh test/fixtures/vite-vue`. Nuxt and Next use `test/support/check-fixture.sh`; its header comment lists the arguments. Without `ONLY_RAISED=1` the script also builds with the host's default target, which is expected to fail.
