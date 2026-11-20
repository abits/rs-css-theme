import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { checkContract, parseTheme } from '../../src/look-checks.mjs';

const contract = JSON.parse(readFileSync(new URL('../../contract.json', import.meta.url), 'utf8'));
const typesafeLook = readFileSync(new URL('../../looks/typesafe.css', import.meta.url), 'utf8');

const completeLook = `@theme {
  --color-background: light-dark(#fff, #000);
  --color-foreground: light-dark(#000, #fff);
  --color-muted: light-dark(#555, #aaa);
  --color-border: light-dark(#ddd, #333);
  --color-accent: light-dark(#f00, #f00);
  --color-accent-foreground: light-dark(#000, #000);
  --radius-sm: 0; --radius-md: 2px; --radius-lg: 4px;
  --font-sans: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}`;

test('accepts a look that defines every contract token for both modes', () => {
  const css = completeLook;

  const problems = checkContract(css, contract);

  assert.deepEqual(problems, []);
});

test('rejects a look with one missing token and names it', () => {
  const css = completeLook.replace('--color-muted: light-dark(#555, #aaa);', '');

  const problems = checkContract(css, contract);

  assert.deepEqual(problems, ['missing --color-muted']);
});

test('rejects a color that has a single value instead of light-dark()', () => {
  const css = completeLook.replace('light-dark(#ddd, #333)', '#ddd');

  const problems = checkContract(css, contract);

  assert.deepEqual(problems, ['--color-border has no light-dark() value for both modes']);
});

test('ignores tokens that appear only inside comments', () => {
  const css = '/* @theme { --color-background: red; } */ @theme { --radius-sm: 0; }';

  const tokens = parseTheme(css);

  assert.deepEqual([...tokens.keys()], ['--radius-sm']);
});

test('accepts the typesafe look file', () => {
  const css = typesafeLook;

  const problems = checkContract(css, contract);

  assert.deepEqual(problems, []);
});
