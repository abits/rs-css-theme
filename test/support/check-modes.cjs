// Loads a built fixture page in Chromium and checks that the typesafe look
// resolves for forced light, forced dark and system (light dark) mode.
// Usage: node check-modes.cjs <file-or-http-url>
const { chromium } = require('playwright');
const path = require('path');

const target = process.argv[2];
const url = /^https?:/.test(target) ? target : 'file://' + path.resolve(target);

const light = { bg: 'rgb(254, 254, 254)', fg: 'rgb(30, 30, 30)', muted: 'rgb(107, 107, 107)', border: 'rgb(222, 222, 222)' };
const dark = { bg: 'rgb(30, 30, 30)', fg: 'rgb(254, 254, 254)', muted: 'rgb(163, 163, 163)', border: 'rgb(61, 61, 61)' };
const accent = { bg: 'rgb(243, 134, 161)', fg: 'rgb(30, 30, 30)' };

const scenarios = [
  { name: 'forced light', colorScheme: 'light', emulate: 'dark', expected: light },
  { name: 'forced dark', colorScheme: 'dark', emulate: 'light', expected: dark },
  { name: 'system light', colorScheme: 'light dark', emulate: 'light', expected: light },
  { name: 'system dark', colorScheme: 'light dark', emulate: 'dark', expected: dark },
];

function read(scheme) {
  document.documentElement.style.colorScheme = scheme;
  const style = (id) => getComputedStyle(document.getElementById(id));
  return {
    bg: style('probe').backgroundColor,
    fg: style('probe').color,
    sansFont: style('probe').fontFamily,
    muted: style('probe-muted').color,
    accentBg: style('probe-accent').backgroundColor,
    accentFg: style('probe-accent').color,
    accentRadius: style('probe-accent').borderTopLeftRadius,
    monoFont: style('probe-accent').fontFamily,
    smRadius: style('probe-sm').borderTopLeftRadius,
    border: style('probe-sm').borderTopColor,
  };
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'load' });
  let failed = false;

  for (const scenario of scenarios) {
    await page.emulateMedia({ colorScheme: scenario.emulate });
    const actual = await page.evaluate(read, scenario.colorScheme);
    const e = scenario.expected;
    const mismatches = [
      ['background', actual.bg, e.bg], ['foreground', actual.fg, e.fg], ['muted', actual.muted, e.muted],
      ['border', actual.border, e.border], ['accent', actual.accentBg, accent.bg],
      ['accent-foreground', actual.accentFg, accent.fg], ['radius-lg', actual.accentRadius, '4px'],
      ['radius-sm', actual.smRadius, '0px'],
    ].filter(([, got, want]) => got !== want);
    if (!actual.sansFont.startsWith('Inter')) mismatches.push(['font-sans', actual.sansFont, 'Inter...']);
    if (!actual.monoFont.startsWith('"JetBrains Mono"')) mismatches.push(['font-mono', actual.monoFont, 'JetBrains Mono...']);
    failed = failed || mismatches.length > 0;
    console.log(`${mismatches.length ? 'FAIL' : 'PASS'} ${scenario.name}` +
      mismatches.map(([n, got, want]) => `\n     ${n}: got ${got}, want ${want}`).join(''));
  }

  await browser.close();
  process.exit(failed ? 1 : 0);
})();
