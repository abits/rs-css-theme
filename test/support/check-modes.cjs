// Loads a built fixture page in Chromium and checks that the #probe element
// resolves the look's colors for color-scheme light and dark.
// Usage: node check-modes.cjs <file-or-http-url> [expectedLightBg expectedLightFg expectedDarkBg expectedDarkFg]
const { chromium } = require('playwright');
const path = require('path');

const target = process.argv[2];
const [lightBg, lightFg, darkBg, darkFg] = process.argv.slice(3).length === 4
  ? process.argv.slice(3)
  : ['rgb(254, 254, 254)', 'rgb(30, 30, 30)', 'rgb(30, 30, 30)', 'rgb(254, 254, 254)'];

const url = /^https?:/.test(target) ? target : 'file://' + path.resolve(target);
const expected = { light: [lightBg, lightFg], dark: [darkBg, darkFg] };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'load' });
  let failed = false;

  for (const scheme of ['light', 'dark']) {
    const actual = await page.evaluate((mode) => {
      document.documentElement.style.colorScheme = mode;
      const style = getComputedStyle(document.getElementById('probe'));
      return [style.backgroundColor, style.color, style.borderRadius, style.fontFamily];
    }, scheme);
    const ok = actual[0] === expected[scheme][0] && actual[1] === expected[scheme][1];
    failed = failed || !ok;
    console.log(`${ok ? 'PASS' : 'FAIL'} ${scheme}: bg=${actual[0]} fg=${actual[1]} radius=${actual[2]} font=${actual[3]}`);
  }

  await browser.close();
  process.exit(failed ? 1 : 0);
})();
