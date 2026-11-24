// Web-swinging: the kid shoots a green web from his raised hand to a point on the ceiling,
// swings through on it like a pendulum, lets go, shoots the next one… across the heading and back.
// Each swing is a rotation about its anchor, so the web always runs exactly from hand to anchor.
const { kidDefs, kidBody, kidCss, GREEN } = require('./kid.cjs');

// raised hands in the hangR / hangL / hangBoth poses (local coords)
const HANDS = { R: [8, -99], L: [-8, -99] };
// which pose is showing when: each swing uses the other hand; near its end both hands are up
// (the free hand reaches for the next web) — then he lets go and swings on the new hand.
const COPIES = [['R', 'hangR', 'R'], ['L', 'hangL', 'L'], ['BR', 'hangBoth', 'R'], ['BL', 'hangBoth', 'L']];

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
  const events = []; // [time, copy]
  let seg = 0;
  const segPose = (t) => { const h = seg++ % 2 ? 'L' : 'R'; events.push([t, h], [t + dur * 0.8, 'B' + h]); return h; };
  const ease = 'animation-timing-function:cubic-bezier(.45,0,.55,1)';
  // rightwards: each anchor, from +θ (behind) to -θ (ahead)
  let lastHand = 'R';
  anchors.forEach((x, i) => {
    const t = i * dur;
    lastHand = segPose(t);
    swing += `${pc(t)}{${tf(x, theta)};${ease}}${pc(t + dur - 0.001)}{${tf(x, -theta)}}`;
    web += `${pc(t)}{transform:scaleY(0)}${pc(t + dur * 0.14)}{transform:scaleY(1)}${pc(t + dur - 0.002)}{transform:scaleY(1)}`;
  });
  // hang at the far end for a moment
  events.push([cross, lastHand]);
  const last = anchors[n - 1];
  swing += `${pc(cross)}{${tf(last, -theta)};animation-timing-function:ease-in-out}${pc(cross + hold * 0.5)}{${tf(last, -theta * 0.35)};animation-timing-function:ease-in-out}${pc(cross + hold - 0.001)}{${tf(last, -theta)}}`;
  web += `${pc(cross + hold - 0.002)}{transform:scaleY(1)}`;
  // leftwards: anchors in reverse, from -θ to +θ
  [...anchors].reverse().forEach((x, i) => {
    const t = cross + hold + i * dur;
    lastHand = segPose(t);
    swing += `${pc(t)}{${tf(x, -theta)};${ease}}${pc(t + dur - 0.001)}{${tf(x, theta)}}`;
    web += `${pc(t)}{transform:scaleY(0)}${pc(t + dur * 0.14)}{transform:scaleY(1)}${pc(t + dur - 0.002)}{transform:scaleY(1)}`;
  });
  swing += `${pc(2 * cross + hold)}{${tf(anchors[0], theta)};animation-timing-function:ease-in-out}${pc(2 * cross + hold + hold * 0.5)}{${tf(anchors[0], theta * 0.35)};animation-timing-function:ease-in-out}100%{${tf(anchors[0], theta)}}`;
  web += `100%{transform:scaleY(1)}`;
  events.push([2 * cross + hold, lastHand]);
  const vis = (name) => events.map(([t, c]) => `${pc(t)}{opacity:${c === name ? 1 : 0}}`).join('') + `100%{opacity:${events[0][1] === name ? 1 : 0}}`;
  const visCss = COPIES.map(([name]) => `.${id}-p${name}{animation:${id}-p${name} ${T.toFixed(2)}s steps(1,end) ${delay}s infinite both}@keyframes ${id}-p${name}{${vis(name)}}`).join(' ');

  const css = `
.${id}-webswing{transform-box:view-box;transform-origin:0 0;animation:${id}-webswing ${T.toFixed(2)}s linear ${delay}s infinite both}
@keyframes ${id}-webswing{${swing}}
.${id}-web{transform-box:view-box;transform-origin:0 ${L}px;animation:${id}-web ${T.toFixed(2)}s linear ${delay}s infinite both}
@keyframes ${id}-web{${web}}
.${id}-dot{transform-box:fill-box;transform-origin:center;animation:${id}-web ${T.toFixed(2)}s linear ${delay}s infinite both}
${visCss}
${kidCss(id)}`;

  // kid placed so his raised hand sits at (0, L) below the anchor
  const body = `<g class="${id}-webswing" shape-rendering="geometricPrecision" transform="translate(${anchors[0].toFixed(1)} ${AY}) rotate(${theta})">` +
    `<g class="${id}-web"><path d="M0 0 L0 ${L}" stroke="${GREEN}" stroke-width="2.2" stroke-linecap="round"/>` +
    `<path d="M-1.5 ${L * 0.3} l3 0 M-1.5 ${L * 0.6} l3 0" stroke="#C8FFE6" stroke-width="1" opacity=".7"/></g>` +
    `<g class="${id}-dot"><path d="M0 -4 L1.2 -1.2 4 0 1.2 1.2 0 4 -1.2 1.2 -4 0 -1.2 -1.2z" fill="${GREEN}"/></g>` +
    COPIES.map(([name, pose, hand]) => `<g class="${id}-p${name}" opacity="${name === 'R' ? 1 : 0}"><g transform="translate(0 ${L}) scale(${scale}) translate(${-HANDS[hand][0]} ${-HANDS[hand][1]})">${kidBody(id, pose)}</g></g>`).join('') + `</g>`;
  return { defs: kidDefs(id), body, css };
}

module.exports = { webSwinger };
