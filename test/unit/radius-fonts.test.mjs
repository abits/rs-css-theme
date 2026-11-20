import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { checkFonts, checkRadius } from '../../src/look-checks.mjs';

const typesafeLook = readFileSync(new URL('../../looks/typesafe.css', import.meta.url), 'utf8');

test('accepts the radii of the typesafe look', () => {
  const css = typesafeLook;

  const problems = checkRadius(css);

  assert.deepEqual(problems, []);
});

test('rejects a radius above 4px', () => {
  const css = typesafeLook.replace('--radius-lg: 4px;', '--radius-lg: 0.5rem;');

  const problems = checkRadius(css);

  assert.deepEqual(problems, ['--radius-lg is 0.5rem, above 4px']);
});

test('rejects a small radius that is not 0', () => {
  const css = typesafeLook.replace('--radius-sm: 0;', '--radius-sm: 1px;');

  const problems = checkRadius(css);

  assert.deepEqual(problems, ['--radius-sm is not 0']);
});

test('accepts Inter and JetBrains Mono with generic fallbacks', () => {
  const css = typesafeLook;

  const problems = checkFonts(css);

  assert.deepEqual(problems, []);
});

test('rejects a sans family that lacks a generic fallback', () => {
  const css = typesafeLook.replace('system-ui, sans-serif;', 'system-ui;');

  const problems = checkFonts(css);

  assert.deepEqual(problems, ['--font-sans has no generic fallback family']);
});

test('rejects a mono family that is not JetBrains Mono', () => {
  const css = typesafeLook.replace('"JetBrains Mono"', '"Fira Code"');

  const problems = checkFonts(css);

  assert.deepEqual(problems, ['--font-mono does not start with the expected family']);
});
