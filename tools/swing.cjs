// Web-swinging: the kid shoots a green web from his raised hand to a point on the ceiling,
// swings through on it like a pendulum, lets go, shoots the next one… across the heading and back.
// Each swing is a rotation about its anchor, so the web always runs exactly from hand to anchor.
const { kidDefs, kidBody, kidCss, GREEN } = require('./kid.cjs');

const HAND = [17, -97];   // the raised hand in the kid's 'hang' pose (local coords)

function webSwinger(id, { x0, x1, AY = 6, L = 40, theta = 40, dur = 0.62, scale = 0.8, delay = 0, hold = 0.7 }) {
  const rad = (theta * Math.PI) / 180;
  const D = 2 * L * Math.sin(rad);                         // ground covered per swing
  const n = Math.max(2, Math.floor((x1 - x0) / D));
  const anchors = Array.from({ length: n }, (_, i) => x0 + L * Math.sin(rad) + i * D);
  const cross = n * dur;
  const T = 2 * cross + 2 * hold;
  const pc = (s) => ((s / T) * 100).toFixed(3) + '%';
  const tf = (x, a) => `transform:translate(${x.toFixed(1)}px,${AY}px) rotate(${a}deg)`;

  let swing = '', web = '';
  const ease = 'animation-timing-function:cubic-bezier(.45,0,.55,1)';
  // rightwards: each anchor, from +θ (behind) to -θ (ahead)
  anchors.forEach((x, i) => {
    const t = i * dur;
    swing += `${pc(t)}{${tf(x, theta)};${ease}}${pc(t + dur - 0.001)}{${tf(x, -theta)}}`;
    web += `${pc(t)}{transform:scaleY(0)}${pc(t + dur * 0.14)}{transform:scaleY(1)}${pc(t + dur - 0.002)}{transform:scaleY(1)}`;
  });
  // hang at the far end for a moment
  const last = anchors[n - 1];
  swing += `${pc(cross)}{${tf(last, -theta)};animation-timing-function:ease-in-out}${pc(cross + hold * 0.5)}{${tf(last, -theta * 0.35)};animation-timing-function:ease-in-out}${pc(cross + hold - 0.001)}{${tf(last, -theta)}}`;
  web += `${pc(cross + hold - 0.002)}{transform:scaleY(1)}`;
  // leftwards: anchors in reverse, from -θ to +θ
  [...anchors].reverse().forEach((x, i) => {
    const t = cross + hold + i * dur;
    swing += `${pc(t)}{${tf(x, -theta)};${ease}}${pc(t + dur - 0.001)}{${tf(x, theta)}}`;
    web += `${pc(t)}{transform:scaleY(0)}${pc(t + dur * 0.14)}{transform:scaleY(1)}${pc(t + dur - 0.002)}{transform:scaleY(1)}`;
  });
  swing += `${pc(2 * cross + hold)}{${tf(anchors[0], theta)};animation-timing-function:ease-in-out}${pc(2 * cross + hold + hold * 0.5)}{${tf(anchors[0], theta * 0.35)};animation-timing-function:ease-in-out}100%{${tf(anchors[0], theta)}}`;
  web += `100%{transform:scaleY(1)}`;

  const css = `
.${id}-webswing{transform-box:view-box;transform-origin:0 0;animation:${id}-webswing ${T.toFixed(2)}s linear ${delay}s infinite both}
@keyframes ${id}-webswing{${swing}}
.${id}-web{transform-box:view-box;transform-origin:0 ${L}px;animation:${id}-web ${T.toFixed(2)}s linear ${delay}s infinite both}
@keyframes ${id}-web{${web}}
.${id}-dot{transform-box:fill-box;transform-origin:center;animation:${id}-web ${T.toFixed(2)}s linear ${delay}s infinite both}
${kidCss(id)}`;

  // kid placed so his raised hand sits at (0, L) below the anchor
  const body = `<g class="${id}-webswing" shape-rendering="geometricPrecision" transform="translate(${anchors[0].toFixed(1)} ${AY}) rotate(${theta})">` +
    `<g class="${id}-web"><path d="M0 0 L0 ${L}" stroke="${GREEN}" stroke-width="2.2" stroke-linecap="round"/>` +
    `<path d="M-1.5 ${L * 0.3} l3 0 M-1.5 ${L * 0.6} l3 0" stroke="#C8FFE6" stroke-width="1" opacity=".7"/></g>` +
    `<g class="${id}-dot"><path d="M0 -4 L1.2 -1.2 4 0 1.2 1.2 0 4 -1.2 1.2 -4 0 -1.2 -1.2z" fill="${GREEN}"/></g>` +
    `<g transform="translate(0 ${L}) scale(${scale}) translate(${-HAND[0]} ${-HAND[1]})">${kidBody(id, 'hang')}</g></g>`;
  return { defs: kidDefs(id), body, css };
}

module.exports = { webSwinger };
