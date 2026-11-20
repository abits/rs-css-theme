// Checks that a look file satisfies the contract and the retrosafe look spec.
// shortcut: a regex reads flat @theme blocks only, switch to postcss if looks gain nesting.
export function parseTheme(css) {
  const tokens = new Map();
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const block of withoutComments.matchAll(/@theme[^{]*\{([^}]*)\}/g)) {
    for (const [, name, value] of block[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      tokens.set(name, value.trim());
    }
  }
  return tokens;
}

export function parseLightDark(value) {
  const match = /^light-dark\(\s*([^,]+?)\s*,\s*([^)]+?)\s*\)$/.exec(value ?? '');
  return match ? [match[1], match[2]] : null;
}

export function checkContract(css, contract) {
  const tokens = parseTheme(css);
  const problems = [];
  const required = [
    ...contract.colors.map((name) => `--color-${name}`),
    ...contract.radii.map((name) => `--radius-${name}`),
    ...contract.fonts.map((name) => `--font-${name}`),
  ];
  for (const name of required) {
    if (!tokens.has(name)) problems.push(`missing ${name}`);
  }
  for (const name of contract.colors) {
    const token = `--color-${name}`;
    if (tokens.has(token) && !parseLightDark(tokens.get(token))) {
      problems.push(`${token} has no light-dark() value for both modes`);
    }
  }
  return problems;
}

function luminance(hex) {
  const digits = hex.replace('#', '');
  const full = digits.length === 3 ? [...digits].map((c) => c + c).join('') : digits;
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(full.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(hexA, hexB) {
  const [lighter, darker] = [luminance(hexA), luminance(hexB)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}

export function checkContrast(css, pairings, minimum = 4.5) {
  const tokens = parseTheme(css);
  const problems = [];
  for (const [foreground, background] of pairings) {
    const fg = parseLightDark(tokens.get(`--color-${foreground}`));
    const bg = parseLightDark(tokens.get(`--color-${background}`));
    if (!fg || !bg) {
      problems.push(`cannot read ${foreground} on ${background}`);
      continue;
    }
    ['light', 'dark'].forEach((mode, index) => {
      const ratio = contrastRatio(fg[index], bg[index]);
      if (ratio < minimum) {
        problems.push(`${foreground} on ${background} in ${mode} mode is ${ratio.toFixed(2)}:1`);
      }
    });
  }
  return problems;
}

function toPixels(value) {
  if (/^0(px|rem)?$/.test(value)) return 0;
  const match = /^([\d.]+)(px|rem)$/.exec(value);
  if (!match) return NaN;
  return Number(match[1]) * (match[2] === 'rem' ? 16 : 1);
}

export function checkRadius(css, maximumPixels = 4) {
  const tokens = parseTheme(css);
  const problems = [];
  for (const [name, value] of tokens) {
    if (!name.startsWith('--radius-')) continue;
    const pixels = toPixels(value);
    if (!(pixels <= maximumPixels)) problems.push(`${name} is ${value}, above ${maximumPixels}px`);
  }
  if (toPixels(tokens.get('--radius-sm')) !== 0) problems.push('--radius-sm is not 0');
  return problems;
}

export function checkFonts(css) {
  const tokens = parseTheme(css);
  const expected = [
    ['--font-sans', /^"Inter"/, /sans-serif\s*$/],
    ['--font-mono', /^"JetBrains Mono"/, /monospace\s*$/],
  ];
  const problems = [];
  for (const [name, family, fallback] of expected) {
    const value = tokens.get(name) ?? '';
    if (!family.test(value)) problems.push(`${name} does not start with the expected family`);
    if (!fallback.test(value)) problems.push(`${name} has no generic fallback family`);
  }
  return problems;
}
