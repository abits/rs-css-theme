import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { checkContrast, contrastRatio, parseLightDark } from '../../src/look-checks.mjs';

const contract = JSON.parse(readFileSync(new URL('../../contract.json', import.meta.url), 'utf8'));
const retrosafeLook = readFileSync(new URL('../../looks/retrosafe.css', import.meta.url), 'utf8');

test('computes 21:1 for black on white', () => {
  const ratio = contrastRatio('#000000', '#ffffff');

  assert.equal(Math.round(ratio * 100) / 100, 21);
});

test('expands three digit hex colors', () => {
  const ratio = contrastRatio('#000', '#fff');

  assert.equal(Math.round(ratio), 21);
});

test('splits a light-dark value into its two colors', () => {
  const pair = parseLightDark('light-dark(#fefefe, #1e1e1e)');

  assert.deepEqual(pair, ['#fefefe', '#1e1e1e']);
});

test('passes every text pairing of the retrosafe look in both modes', () => {
  const css = retrosafeLook;

  const problems = checkContrast(css, contract.textPairings);

  assert.deepEqual(problems, []);
});

test('fails a look whose muted color is too light on the light background', () => {
  const css = retrosafeLook.replace('light-dark(#6b6b6b, #a3a3a3)', 'light-dark(#aaaaaa, #a3a3a3)');

  const problems = checkContrast(css, contract.textPairings);

  assert.equal(problems.length, 1);
  assert.match(problems[0], /^muted on background in light mode is 2\.\d\d:1$/);
});

test('reports a pairing it cannot read instead of passing silently', () => {
  const css = '@theme { --color-foreground: #000; }';

  const problems = checkContrast(css, [['foreground', 'background']]);

  assert.deepEqual(problems, ['cannot read foreground on background']);
});
