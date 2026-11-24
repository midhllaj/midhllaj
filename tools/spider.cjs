// "Jumpy": an original cartoon jumping spider, drawn with gradients so it reads as 3D.
// Local origin = between its feet (0,0); it faces right; about 74×52 px at scale 1.
// spiderDefs(id) → <defs> content, spiderBody(id) → the character, spiderCss → leg wiggle etc.

const spiderDefs = (id) => `
<radialGradient id="${id}-abd" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#FFB3D1"/><stop offset=".35" stop-color="#FF4D8D"/><stop offset="1" stop-color="#7a1456"/></radialGradient>
<radialGradient id="${id}-head" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#D9C2FF"/><stop offset=".4" stop-color="#9B5DE5"/><stop offset="1" stop-color="#3b1f73"/></radialGradient>
<radialGradient id="${id}-eye" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#4a3a8a"/><stop offset=".6" stop-color="#140c2e"/><stop offset="1" stop-color="#05030d"/></radialGradient>
<linearGradient id="${id}-leg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9A8FF"/><stop offset="1" stop-color="#7B52DB"/></linearGradient>`;

// legs: [hip x, hip y, knee x, knee y, foot x, foot y]
const legsNear = [[12, -17, 30, -34, 34, -1], [8, -15, 22, -30, 22, 0], [-6, -15, -20, -32, -24, 0], [-12, -17, -32, -33, -38, -1]];
const legsFar = legsNear.map(([a, b, c, d, e, g2]) => [a - 3, b - 2, c - 5, d - 2, e - 6, g2 - 2]);
const legPath = ([a, b, c, d, e, g2]) => `M${a} ${b}Q${c} ${d} ${e} ${g2}`;

const spiderBody = (id) => `
<g class="${id}-legs-far" stroke="#5a3fb0" stroke-width="3.6" stroke-linecap="round" fill="none" opacity=".85">${legsFar.map((l) => `<path d="${legPath(l)}"/>`).join('')}</g>
<ellipse cx="-11" cy="-24" rx="18" ry="15" fill="url(#${id}-abd)"/>
<path d="M-24 -26q6 -9 16 -9" stroke="#FFD23F" stroke-width="3" stroke-linecap="round" fill="none" opacity=".9"/>
<path d="M-26 -19q8 -6 20 -5" stroke="#FFD23F" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".7"/>
<ellipse cx="-16" cy="-32" rx="6" ry="3" fill="#fff" opacity=".55" transform="rotate(-20 -16 -32)"/>
<circle cx="10" cy="-22" r="14" fill="url(#${id}-head)"/>
<ellipse cx="5" cy="-31" rx="5" ry="2.4" fill="#fff" opacity=".5" transform="rotate(-15 5 -31)"/>
<g class="${id}-legs-near" stroke="url(#${id}-leg)" stroke-width="4" stroke-linecap="round" fill="none">${legsNear.map((l) => `<path d="${legPath(l)}"/>`).join('')}</g>
<circle cx="19" cy="-23" r="7.2" fill="url(#${id}-eye)"/><circle cx="8.5" cy="-24" r="6.4" fill="url(#${id}-eye)"/>
<circle cx="21" cy="-25.6" r="2.4" fill="#fff"/><circle cx="10.5" cy="-26.4" r="2.1" fill="#fff"/>
<circle cx="17.4" cy="-20.6" r="1" fill="#00D1FF"/><circle cx="7" cy="-21.6" r=".9" fill="#00D1FF"/>
<g class="${id}-blink" fill="#9B5DE5"><rect x="11.6" y="-31" width="15" height="0" rx="2"/><rect x="1.8" y="-31" width="13.4" height="0" rx="2"/></g>
<circle cx="22" cy="-15" r="2.2" fill="#FF8FB8" opacity=".75"/>
<path d="M14 -13q3 2.4 6 0" stroke="#2a1650" stroke-width="1.4" stroke-linecap="round" fill="none"/>`;

const spiderCss = (id) => `
.${id}-legs-near{animation:${id}-wig .4s ease-in-out infinite alternate}
.${id}-legs-far{animation:${id}-wig .4s ease-in-out -.2s infinite alternate}
@keyframes ${id}-wig{from{transform:translateY(0)}to{transform:translateY(-1.5px)}}
.${id}-blink rect{animation:${id}-blink 4.2s infinite}
@keyframes ${id}-blink{0%,92%,100%{height:0}95%{height:13px}}`;

/**
 * A spider hopping back and forth between x0 and x1 on the line y = ground.
 * Squash on landing, stretch on take-off, shadow shrinks while it's in the air,
 * turns around at each end. Returns { defs, body, css } to drop into an SVG.
 */
function jumper(id, { x0, x1, ground, scale = 1, hop = 0.75, height = 34, delay = 0, char = null, flip = false, shadowRx = 34, flipOrigin = '0px -30px' }) {
  const dist = Math.abs(x1 - x0);
  const hops = Math.max(2, Math.round(dist / (46 * scale)));  // ~46px per hop
  const leg = hops * hop;                                      // seconds for one crossing
  const T = leg * 2 + 1.6;                                     // there, rest, back, rest
  const p = (s) => ((s / T) * 100).toFixed(2) + '%';
  const css = `
.${id}-walk{transform-box:view-box;transform-origin:0 0;animation:${id}-walk ${T.toFixed(2)}s linear ${delay}s infinite both}
@keyframes ${id}-walk{
 0%{transform:translate(${x0}px,${ground}px) scale(${scale},${scale})}
 ${p(leg)}{transform:translate(${x1}px,${ground}px) scale(${scale},${scale})}
 ${p(leg + 0.8)}{transform:translate(${x1}px,${ground}px) scale(${scale},${scale})}
 ${p(leg + 0.81)}{transform:translate(${x1}px,${ground}px) scale(${-scale},${scale})}
 ${p(leg * 2 + 0.81)}{transform:translate(${x0}px,${ground}px) scale(${-scale},${scale})}
 ${p(leg * 2 + 1.59)}{transform:translate(${x0}px,${ground}px) scale(${-scale},${scale})}
 100%{transform:translate(${x0}px,${ground}px) scale(${scale},${scale})}}
.${id}-hop{animation:${id}-hop ${T.toFixed(2)}s linear ${delay}s infinite both}
.${id}-sq{transform-box:view-box;transform-origin:0 0;animation:${id}-sq ${T.toFixed(2)}s linear ${delay}s infinite both}
.${id}-sh{transform-box:view-box;transform-origin:0 0;animation:${id}-sh ${T.toFixed(2)}s linear ${delay}s infinite both}
@keyframes ${id}-hop{${hopFrames(T, leg, hops, hop, height, 'hop')}}
@keyframes ${id}-sq{${hopFrames(T, leg, hops, hop, height, 'sq')}}
@keyframes ${id}-sh{${hopFrames(T, leg, hops, hop, height, 'sh')}}
${flip ? `.${id}-flip{transform-box:view-box;transform-origin:${flipOrigin};animation:${id}-flip ${T.toFixed(2)}s linear ${delay}s infinite both}
@keyframes ${id}-flip{${hopFrames(T, leg, hops, hop, height, 'flip')}}` : ''}
${char ? char.css : spiderCss(id)}`;
  const body = `<g class="${id}-walk" shape-rendering="geometricPrecision" transform="translate(${x0} ${ground}) scale(${scale})"><ellipse class="${id}-sh" cx="-2" cy="1" rx="${shadowRx}" ry="5" fill="#000" opacity=".35"/>` +
    `<g class="${id}-hop"><g class="${id}-sq"><g class="${id}-flip">${char ? char.body : spiderBody(id)}</g></g></g></g>`;
  return { defs: char ? char.defs : spiderDefs(id), body, css };
}

// keyframes for every hop in both crossings (rests are flat)
function hopFrames(T, leg, hops, hop, height, kind) {
  const pc = (s) => ((s / T) * 100).toFixed(3) + '%';
  const rest = { hop: 'transform:translateY(0)', sq: 'transform:scale(1,1)', sh: 'transform:scale(1,1);opacity:.35', flip: 'transform:rotate(0)' };
  let out = `0%{${rest[kind]}}`;
  for (const start of [0, leg + 0.8]) {
    for (let h = 0; h < hops; h++) {
      const t = start + h * hop;
      if (kind === 'hop') {
        out += `${pc(t)}{transform:translateY(0);animation-timing-function:cubic-bezier(.2,.7,.4,1)}`;
        out += `${pc(t + hop * 0.5)}{transform:translateY(${-height}px);animation-timing-function:cubic-bezier(.6,0,.8,.3)}`;
        out += `${pc(t + hop)}{transform:translateY(0)}`;
      } else if (kind === 'sq') {
        out += `${pc(t)}{transform:scale(1.18,.8)}${pc(t + hop * 0.12)}{transform:scale(.9,1.12)}${pc(t + hop * 0.5)}{transform:scale(1,1)}${pc(t + hop * 0.92)}{transform:scale(.95,1.06)}${pc(t + hop)}{transform:scale(1.18,.8)}`;
      } else if (kind === 'flip') {
        if (h === hops - 1) out += `${pc(t + hop * 0.08)}{transform:rotate(0);animation-timing-function:ease-in-out}${pc(t + hop * 0.9)}{transform:rotate(360deg)}${pc(t + hop * 0.901)}{transform:rotate(0)}`;
      } else {
        out += `${pc(t)}{transform:scale(1,1);opacity:.35}${pc(t + hop * 0.5)}{transform:scale(.55,.55);opacity:.15}${pc(t + hop)}{transform:scale(1,1);opacity:.35}`;
      }
    }
    out += `${pc(start + hops * hop + 0.12)}{${rest[kind]}}`;
  }
  out += `100%{${rest[kind]}}`;
  return out;
}

module.exports = { spiderDefs, spiderBody, spiderCss, jumper };
