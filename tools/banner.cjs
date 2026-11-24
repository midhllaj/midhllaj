// Arcade banner: your portrait as glowing pixel dots that spread out from the face,
// pixel-font tagline, and a little pixel spider dropping in on its thread.
// usage: node tools/banner.cjs <portrait cut-out .png/.webp>   → banner.svg
// needs `sharp` (resolved from this folder or the portfolio next door).
const fs = require('fs');
const path = require('path');
const sharp = require(require.resolve('sharp', { paths: [__dirname, path.join(__dirname, '../..')] }));
const { pix, shadowText, textW, P } = require('./pixel.cjs');

const src = process.argv[2] || path.join(__dirname, '../../public/assets/portrait.webp');
const OUT = path.join(__dirname, '..', 'banner.svg');
const W = 1600, H = 533, BG = '#16112e';
const S = 4.6;                        // dot grid spacing
const PH = 600, PX = 540, PY = -8;    // portrait box (bottom gets cropped)

let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const f = (n) => +n.toFixed(1);

(async () => {
  const meta = await sharp(src).metadata();
  const PW = Math.round((PH * meta.width) / meta.height);
  const cols = Math.round(PW / S), rows = Math.round(PH / S);
  const g = await sharp(src).flatten({ background: '#808080' }).greyscale().resize(cols, rows, { fit: 'fill' })
    .clahe({ width: 10, height: 10, maxSlope: 4 }).sharpen({ sigma: 0.8 }).raw().toBuffer();
  const al = await sharp(src).ensureAlpha().extractChannel(3).resize(cols, rows, { fit: 'fill' }).raw().toBuffer();

  const lums = [];
  for (let p = 0; p < g.length; p++) if (al[p] > 200) lums.push(g[p] / 255);
  lums.sort((a, b) => a - b);
  const lo = lums[Math.floor(lums.length * 0.03)], hi = lums[Math.floor(lums.length * 0.99)];

  const CX = PX + PW * 0.58, CY = PY + PH * 0.36;
  const RINGS = 14, maxD = Math.hypot(PW, PH) * 0.75;
  const rings = Array.from({ length: RINGS }, () => []);
  const ring = (x, y) => Math.min(RINGS - 1, Math.floor((Math.hypot(x - CX, y - CY) / maxD) * RINGS));
  const FRAME = 10;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const p = y * cols + x, a = al[p] / 255;
      const l = Math.min(1, Math.max(0, (g[p] / 255 - lo) / (hi - lo)));
      // dark background → dot size follows BRIGHTNESS, so the face reads like a lit screen
      const d = Math.pow(l, 1.05) * a;
      const cx = PX + (x + 0.5) * S, cy = PY + (y + 0.5) * S;
      if (cy > H - FRAME - 2) continue;
      let s;
      if (d > 0.06) s = S * 0.92 * Math.sqrt(d);
      else if (a > 0.04 && a < 0.6 && rnd() < 0.25) s = 1.2 + rnd() * 1.2;
      else continue;
      if (s < 0.9) continue;
      rings[ring(cx, cy)].push(`<rect x="${f(cx - s / 2)}" y="${f(cy - s / 2)}" width="${f(s)}" height="${f(s)}"/>`);
    }
  }

  // twinkling pixel stars in the background
  const starCols = [P.pink, P.yellow, P.cyan, P.green, P.purple, '#ffffff'];
  let stars = '';
  for (let n = 0; n < 70; n++) {
    const x = 20 + rnd() * (W - 40), y = 20 + rnd() * (H - 40);
    if (x > PX - 20 && x < PX + PW + 10) continue;      // not over the face
    if (x > 960 && x < 1420 && y > 200 && y < 350) continue; // not over the text
    const sz = rnd() < 0.2 ? 4 : 2;
    stars += `<rect x="${f(x)}" y="${f(y)}" width="${sz}" height="${sz}" fill="${starCols[n % starCols.length]}" style="animation-delay:${f(rnd() * 3)}s;animation-duration:${f(1.6 + rnd() * 2)}s"/>`;
  }

  // particles drifting out from the face
  let drift = '';
  for (let n = 0; n < 60; n++) {
    const ang = rnd() * Math.PI * 2, start = 120 + rnd() * 90, len = 90 + rnd() * 150;
    const x = CX + Math.cos(ang) * start, y = CY + 30 + Math.sin(ang) * start;
    drift += `<rect x="${f(x)}" y="${f(y)}" width="3" height="3" fill="${starCols[n % 5]}" style="--dx:${f(Math.cos(ang) * len)}px;--dy:${f(Math.sin(ang) * len)}px;animation-duration:${f(5 + rnd() * 5)}s;animation-delay:${f(2.2 + rnd() * 6)}s"/>`;
  }

  // rainbow pixel frame (same as the player card)
  const fr = [P.pink, P.yellow, P.cyan, P.green];
  let frame = '';
  for (let i = 0; i < W; i += 16) frame += `<rect x="${i}" y="0" width="16" height="${FRAME}" fill="${fr[(i / 16) % 4]}"/><rect x="${i}" y="${H - FRAME}" width="16" height="${FRAME}" fill="${fr[(i / 16 + 2) % 4]}"/>`;
  for (let j = FRAME; j < H - FRAME; j += 16) frame += `<rect x="0" y="${j}" width="${FRAME}" height="16" fill="${fr[(j / 16) % 4]}"/><rect x="${W - FRAME}" y="${j}" width="${FRAME}" height="16" fill="${fr[(j / 16 + 1) % 4]}"/>`;

  // text
  const TX = 985;
  const t1 = 'GOOD IDEAS DESERVE', t2 = 'GREAT EXECUTION.';
  const text =
    `<g class="t t1">${pix(t1, TX, 214, 3, '#cfc8ff')}</g>` +
    `<g class="t t2">${shadowText(t2, TX, 246, 4, P.yellow, '#0b0b1a')}</g>` +
    `<rect class="cur" x="${TX + textW(t2, 4) + 10}" y="246" width="16" height="28" fill="${P.pink}"/>` +
    `<g class="t t3"><g class="blink">${pix('^ PRESS START', TX, 300, 2, P.cyan)}</g></g>` +
    pix('1UP', 34, 30, 2, P.pink) + pix('MIDHLAJ', 34 + textW('1UP ', 2), 30, 2, '#cfc8ff') +
    pix('MIDHLAJ.CO', W - 34 - textW('MIDHLAJ.CO', 2), H - 44, 2, P.yellow);

  // ── the spider: an original 13×9 pixel sprite, two leg frames ──
  const SPR = 5, AX = 1490, AY = FRAME;   // thread anchor (top frame)
  const spriteA = ['#...........#', '.#...###...#.', '..#.#####.#..', '...#######...', '####wb#wb####', '...#######...', '..#.#####.#..', '.#...###...#.', '#...........#'];
  const spriteB = ['.............', '##...###...##', '..#.#####.#..', '...#######...', '####wb#wb####', '...#######...', '..#.#####.#..', '##...###...##', '.............'];
  const drawSprite = (rowsArr, cls) => {
    const ox = AX - (13 * SPR) / 2, oy = AY + 4;
    let body = '', white = '', black = '';
    rowsArr.forEach((r, y) => [...r].forEach((c, x) => {
      const rect = `M${ox + x * SPR} ${oy + y * SPR}h${SPR}v${SPR}h-${SPR}z`;
      if (c === '#') body += rect; else if (c === 'w') white += rect; else if (c === 'b') black += rect;
    }));
    return `<g class="${cls}"><path d="${body}" fill="${P.pink}"/><path d="${white}" fill="#fff"/><path d="${black}" fill="#0b0b1a"/></g>`;
  };
  const spider =
    `<g clip-path="url(#inside)"><g class="swing"><g class="drop">` +
    `<rect x="${AX - 1}" y="${AY - 800}" width="2" height="804" fill="#cfc8ff" opacity=".8"/>` +
    drawSprite(spriteA, 'fa') + drawSprite(spriteB, 'fb') +
    `</g></g></g>`;

  const ringCss = rings.map((_, k) => `.r${k}{--d:${(k * 0.11).toFixed(2)}s}`).join('');
  const css = `
.dots rect{transform-box:fill-box;transform-origin:center;animation:pop .7s cubic-bezier(.2,.9,.3,1.4) var(--d) both,pulse 7s ease-in-out calc(var(--d) + 3s) infinite}
${ringCss}
@keyframes pop{0%{transform:scale(0);opacity:0}100%{transform:scale(1);opacity:1}}
@keyframes pulse{0%,30%,100%{transform:scale(1)}12%{transform:scale(1.4)}}
.stars rect{animation:tw 2s ease-in-out infinite}
@keyframes tw{0%,100%{opacity:.25}50%{opacity:1}}
.drift rect{opacity:0;animation-name:drift;animation-timing-function:ease-out;animation-iteration-count:infinite}
@keyframes drift{0%{transform:translate(0,0);opacity:0}15%{opacity:.9}100%{transform:translate(var(--dx),var(--dy));opacity:0}}
.t{opacity:0;animation:rise .8s ease-out both}.t1{animation-delay:1.2s}.t2{animation-delay:1.5s}.t3{animation-delay:1.9s}
@keyframes rise{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:none}}
.cur{opacity:0;animation:rise .1s 1.8s both,blink 1s steps(1) 1.9s infinite}
.blink{animation:blink 1s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
.swing{transform-box:view-box;transform-origin:${AX}px ${AY}px;animation:swing 12s ease-in-out 2s infinite}
.drop{transform:translateY(-60px);animation:drop 12s 2s infinite}
@keyframes drop{
 0%{transform:translateY(-60px);animation-timing-function:cubic-bezier(.5,0,.9,.6)}
 11%{transform:translateY(300px);animation-timing-function:ease-out}
 15%{transform:translateY(262px);animation-timing-function:ease-in}
 19%{transform:translateY(300px);animation-timing-function:ease-out}
 22%{transform:translateY(288px);animation-timing-function:ease-in}
 25%,68%{transform:translateY(300px);animation-timing-function:ease-in-out}
 84%,100%{transform:translateY(-60px)}}
@keyframes swing{0%,26%{transform:rotate(0)}34%{transform:rotate(9deg)}43%{transform:rotate(-9deg)}52%{transform:rotate(6deg)}60%{transform:rotate(-3deg)}66%,100%{transform:rotate(0)}}
.fb{animation:legs .36s steps(1) infinite}.fa{animation:legs .36s steps(1) -.18s infinite}
@keyframes legs{50%{opacity:0}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}.t,.cur{opacity:1}.fb,.drop{display:none}}`;

  const out = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges" role="img" aria-label="Midhlaj. Good ideas deserve great execution.">
<defs>
<linearGradient id="ink" gradientUnits="userSpaceOnUse" x1="${PX}" y1="0" x2="${PX + PW}" y2="${H}"><stop offset="0" stop-color="${P.pink}"/><stop offset=".45" stop-color="${P.purple}"/><stop offset="1" stop-color="${P.cyan}"/></linearGradient>
<clipPath id="inside"><rect x="${FRAME}" y="${FRAME}" width="${W - 2 * FRAME}" height="${H - 2 * FRAME}"/></clipPath>
</defs>
<style>${css}</style>
<rect width="${W}" height="${H}" fill="${BG}"/>
<g class="stars">${stars}</g>
<g class="dots" fill="url(#ink)">
${rings.map((r, k) => `<g class="r${k}">${r.join('')}</g>`).join('\n')}
</g>
<g class="drift">${drift}</g>
${text}
${spider}
${frame}
</svg>
`;
  fs.writeFileSync(OUT, out);
  console.log(`banner.svg: ${rings.reduce((s, r) => s + r.length, 0)} dots, ${(out.length / 1024).toFixed(0)} KB`);
})();
