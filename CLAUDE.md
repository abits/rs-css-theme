# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**rs-css-theme** — Framework-neutral, plain-CSS package of swappable looks for Tailwind v4 sites. The first look, `retrosafe`, has a light and a dark mode. Supported hosts: Vue, React, AlpineJS, Nuxt and Next.

Read `intend.md` for the current problem, goals, and constraints. Requirements and tech decisions are drafted via OpenSpec (`/opsx:explore` inside Claude Code); the outputs live under `openspec/`.

Looks live in `looks/` and must define every token of `contract.json`. The mode follows the host's CSS `color-scheme` through `light-dark()`, and hosts must raise their CSS build target (see `README.md`).

## Team

Nine role-specific sub-agents live in `.claude/agents/`. See `AGENTS.md` for the flow and hand-off patterns.

## Markdown

Lint prose with `make lint-md` (`markdownlint-cli2`).

## Tests

Run the unit checks for looks with `npm test`. Host fixtures live under `test/fixtures/` and are checked in Chromium with the scripts in `test/support/`.
