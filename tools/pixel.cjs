// Draws the arcade-style pixel art for the profile README (no fonts needed: text is drawn as pixels).
// usage: node tools/pixel.cjs   → writes assets/*.svg
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '..', 'assets');
fs.mkdirSync(OUT, { recursive: true });

/* ── 5×7 bitmap font ── */
const G = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  C: ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
  D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  G: ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.####'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['.###.', '..#..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  J: ['..###', '...#.', '...#.', '...#.', '...#.', '#..#.', '.##..'],
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  M: ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
  N: ['#...#', '#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  Q: ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
  W: ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '#.#.#', '.#.#.'],
  X: ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
  Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  Z: ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
  0: ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
  1: ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  2: ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
  3: ['####.', '....#', '....#', '.###.', '....#', '....#', '####.'],
  4: ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
  5: ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
  6: ['.###.', '#....', '#....', '####.', '#...#', '#...#', '.###.'],
  7: ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
  8: ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  9: ['.###.', '#...#', '#...#', '.####', '....#', '....#', '.###.'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
  '.': ['.....', '.....', '.....', '.....', '.....', '.##..', '.##..'],
  ',': ['.....', '.....', '.....', '.....', '.##..', '..#..', '.#...'],
  '!': ['..#..', '..#..', '..#..', '..#..', '..#..', '.....', '..#..'],
  '?': ['.###.', '#...#', '....#', '...#.', '..#..', '.....', '..#..'],
  '>': ['.#...', '..#..', '...#.', '....#', '...#.', '..#..', '.#...'],
  '-': ['.....', '.....', '.....', '#####', '.....', '.....', '.....'],
  '&': ['.##..', '#..#.', '#.#..', '.#...', '#.#.#', '#..#.', '.##.#'],
  '/': ['....#', '....#', '...#.', '..#..', '.#...', '#....', '#....'],
  ':': ['.....', '.##..', '.##..', '.....', '.##..', '.##..', '.....'],
  "'": ['..#..', '..#..', '.#...', '.....', '.....', '.....', '.....'],
  '+': ['.....', '..#..', '..#..', '#####', '..#..', '..#..', '.....'],
  '*': ['.....', '#.#.#', '.###.', '#####', '.###.', '#.#.#', '.....'],
  '#': ['.#.#.', '.#.#.', '#####', '.#.#.', '#####', '.#.#.', '.#.#.'],
  '^': ['#....', '##...', '###..', '####.', '###..', '##...', '#....'], // ▶ play
  '@': ['.....', '.#.#.', '#####', '#####', '.###.', '..#..', '.....'], // ♥ heart
};

let seed = 11;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const ADV = 6; // 5 px glyph + 1 px gap
const textW = (s, sc) => (s.length * ADV - 1) * sc;

/** pixel text → one <path> (horizontal runs merged) */
function pix(str, x, y, sc, fill, extra = '') {
  let d = '';
  [...str.toUpperCase()].forEach((ch, i) => {
    const g = G[ch] || G['?'];
    for (let r = 0; r < 7; r++) {
      const row = g[r];
      for (let c = 0; c < 5; c++) {
        if (row[c] !== '#') continue;
        let e = c;
        while (e + 1 < 5 && row[e + 1] === '#') e++;
        d += `M${x + (i * ADV + c) * sc} ${y + r * sc}h${(e - c + 1) * sc}v${sc}h${-(e - c + 1) * sc}z`;
        c = e;
      }
    }
  });
  return `<path d="${d}" fill="${fill}"${extra}/>`;
}
/** arcade text with a hard drop shadow */
const shadowText = (s, x, y, sc, fill, shadow = '#0b0b1a') => pix(s, x + sc, y + sc, sc, shadow) + pix(s, x, y, sc, fill);

const wrap = (s, max) => {
  const out = [''];
  for (const w of s.split(' ')) {
    const cur = out[out.length - 1];
    if (!cur) out[out.length - 1] = w;
    else if ((cur + ' ' + w).length <= max) out[out.length - 1] = cur + ' ' + w;
    else out.push(w);
  }
  return out;
};

const svg = (w, h, body, css = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">` +
  `<style>.blink{animation:b 1s steps(1) infinite}@keyframes b{50%{opacity:0}}${css}@media (prefers-reduced-motion:reduce){*{animation:none!important}}</style>${body}</svg>\n`;
const save = (name, s) => { fs.writeFileSync(path.join(OUT, name), s); console.log('wrote', name, (s.length / 1024).toFixed(1) + 'KB'); };

const P = { pink: '#FF4D8D', yellow: '#FFD23F', blue: '#3A86FF', green: '#2EE59D', purple: '#9B5DE5', orange: '#FF7A1A', cyan: '#00D1FF', red: '#FF3B3B', lime: '#B8F84A' };

/* ── section headers ── */
function header(file, label, color, icon) {
  const sc = 4, W = 900, H = 44;
  const tx = 40, tw = textW(label, sc);
  let dots = '';
  for (let x = tx + tw + 34; x < W - 8; x += 12) dots += `<rect x="${x}" y="${H / 2 - 2}" width="4" height="4"/>`;
  save(file, svg(W, H,
    shadowText(icon, 0, 8, sc, color) +
    shadowText(label, tx, 8, sc, color) +
    `<rect class="blink" x="${tx + tw + 10}" y="8" width="${sc * 4}" height="${sc * 7}" fill="${color}"/>` +
    `<g fill="${color}" opacity=".35">${dots}</g>`));
}
header('h-about.svg', 'PLAYER 1', P.pink, '@');
header('h-toolbox.svg', 'INVENTORY', P.yellow, '*');
header('h-work.svg', 'LEVELS CLEARED', P.cyan, '^');
header('h-contrib.svg', 'HIGH SCORES', P.green, '#');

/* ── player card ── */
{
  const W = 900, H = 300, sc = 3;
  let b = `<rect width="${W}" height="${H}" rx="0" fill="#16112e"/>`;
  // chunky pixel frame in 4 colours
  const frame = [P.pink, P.yellow, P.cyan, P.green];
  for (let i = 0; i < W; i += 12) b += `<rect x="${i}" y="0" width="12" height="8" fill="${frame[(i / 12) % 4]}"/><rect x="${i}" y="${H - 8}" width="12" height="8" fill="${frame[(i / 12 + 2) % 4]}"/>`;
  for (let j = 8; j < H - 8; j += 12) b += `<rect x="0" y="${j}" width="8" height="12" fill="${frame[(j / 12) % 4]}"/><rect x="${W - 8}" y="${j}" width="8" height="12" fill="${frame[(j / 12 + 1) % 4]}"/>`;
  b += shadowText('MIDHLAJ', 40, 36, 5, P.yellow);
  b += pix('LV.99 DESIGNER + DEVELOPER', 40, 88, 2, P.pink);
  const rows = [['CLASS', 'WEB & APP MAKER', P.cyan], ['BASE', 'INDIA', P.cyan], ['QUESTS', '10+ PROJECTS LIVE', P.cyan], ['STATUS', 'OPEN FOR NEW QUESTS', P.green]];
  rows.forEach(([k, v, c], i) => {
    const y = 130 + i * 34;
    b += pix(k, 40, y, sc, '#8f86c9') + pix(v, 160, y, sc, c, k === 'STATUS' ? ' class="blink"' : '');
  });
  const stats = [['DESIGN', 9, P.pink], ['CODE', 9, P.yellow], ['MOTION', 8, P.cyan], ['3D WEBGL', 7, P.purple], ['IOS', 7, P.green]];
  stats.forEach(([k, n, c], i) => {
    const y = 44 + i * 46;
    b += pix(k, 560, y, 2, '#cfc8ff');
    for (let s = 0; s < 10; s++) b += `<rect x="${560 + s * 30}" y="${y + 20}" width="24" height="14" fill="${s < n ? c : '#2c2550'}"${s < n ? ` style="animation:fill .25s ${(i * 0.15 + s * 0.06).toFixed(2)}s both"` : ''}/>`;
  });
  save('player.svg', svg(W, H, b, '@keyframes fill{from{opacity:0}to{opacity:1}}'));
}

/* ── project cards ── */
const projects = [
  ['linaul', 'LINAUL', 'SAAS / LOGISTICS', '2026', P.blue],
  ['nudge', 'NUDGE', 'IOS FOCUS APP', '2026', P.pink],
  ['symbol-setup', 'SYMBOL BUSINESS SETUP', 'DUBAI / SERVICES', '2026', P.yellow],
  ['nexes', 'NEXES WEDDING CO.', 'PHOTOGRAPHY', '2026', P.purple],
  ['get', 'GREAT ESCAPES TOURISM', 'TRAVEL', '2025', P.green],
  ['afwajh', 'AFWAJH GROUP', 'CORPORATE', '2025', P.orange],
  ['dion', 'DION POWER', 'ENERGY / BATTERIES', '2025', P.cyan],
  ['symbol-adv', 'SYMBOL ADVERTISING', 'AD AGENCY', '2025', P.red],
  ['lovin', 'LOVIN FLOWERS', 'E-COMMERCE', '2025', P.lime],
];
projects.forEach(([slug, name, cat, year, color], idx) => {
  const W = 420, H = 240;
  let b = `<rect width="${W}" height="${H}" fill="${color}"/>`;
  // dither pattern in the corner, like an old cartridge label
  let dd = '';
  for (let y = 0; y < H; y += 8) for (let x = W - 150; x < W; x += 8) if (((x + y) / 8) % 2 === 0 && rnd() < (x - (W - 150)) / 150) dd += `M${x} ${y}h4v4h-4z`;
  b += `<path d="${dd}" fill="#000" opacity=".12"/>`;
  b += `<rect x="0" y="${H - 52}" width="${W}" height="52" fill="#0b0b1a" opacity=".88"/>`;
  b += pix(`#0${idx + 1}`, 24, 22, 2, '#0b0b1a') + pix(year, W - 24 - textW(year, 2), 22, 2, '#0b0b1a');
  const lines = wrap(name, 15);
  const sc = 4, lh = 38, top = 60 + (lines.length === 1 ? 22 : 0);
  lines.forEach((l, i) => (b += shadowText(l, 24, top + i * lh, sc, '#ffffff', '#0b0b1a')));
  b += pix(cat, 24, top + lines.length * lh + 6, 2, '#0b0b1a');
  b += pix('^ PRESS START', 24, H - 33, 2, color, ' class="blink"');
  save(`card-${slug}.svg`, svg(W, H, b));
});

/* ── footer ── */
{
  const W = 900, H = 90;
  const a = 'THANKS FOR PLAYING @', bb = 'INSERT COIN TO START A PROJECT';
  save('footer.svg', svg(W, H,
    shadowText(a, (W - textW(a, 4)) / 2, 12, 4, P.yellow) +
    pix(bb, (W - textW(bb, 2)) / 2, 62, 2, P.cyan, ' class="blink"')));
}
