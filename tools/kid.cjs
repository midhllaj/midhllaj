// "Mini Midhlaj": an original chibi spider-kid. Bold black outlines, big round head,
// hood pulled back so his face shows (curly black hair, brown skin), navy suit with green trim,
// green goggles pushed up on the hood, green geometric spider emblem. Green web threads.
// Local origin = between the feet (0,0); ~92 px tall. pose: 'run' or 'hang' (right hand up at (16,-96)).

const INK = '#141018', NAVY = '#22305E', NAVY2 = '#16204a', GREEN = '#2EE59D', GREEN2 = '#13A86F';
const SKIN = '#9A6340', SKIN2 = '#7d4c2f', HAIR = '#1a1110';

const kidDefs = (id) => `
<radialGradient id="${id}-skin" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#B57B55"/><stop offset=".7" stop-color="${SKIN}"/><stop offset="1" stop-color="${SKIN2}"/></radialGradient>
<linearGradient id="${id}-suit" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6F8CFF"/><stop offset=".55" stop-color="#3F5BD6"/><stop offset="1" stop-color="#26389A"/></linearGradient>
<radialGradient id="${id}-lens" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#C8FFE6"/><stop offset=".45" stop-color="${GREEN}"/><stop offset="1" stop-color="${GREEN2}"/></radialGradient>`;

// a limb drawn as a thick outlined stroke
const limb = (d, w, fill) => `<path d="${d}" stroke="${INK}" stroke-width="${w + 5}" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="${d}" stroke="${fill}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
const ball = (cx, cy, r, fill) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${INK}" stroke-width="2.5"/>`;

function kidBody(id, pose = 'run') {
  const hang = pose === 'hang';
  const legs =
    `<g class="${id}-legB">${limb('M-6 -17 L-7 -6', 9, `url(#${id}-suit)`)}${`<path d="M-14 -7 h13 a4 4 0 0 1 4 4 v1 a2 2 0 0 1 -2 2 h-15 a3 3 0 0 1 -3 -3 v0 a4 4 0 0 1 4 -4z" fill="${GREEN}" stroke="${INK}" stroke-width="2.5"/>`}</g>` +
    `<g class="${id}-legF">${limb('M6 -17 L7 -6', 9, `url(#${id}-suit)`)}${`<path d="M1 -7 h13 a4 4 0 0 1 4 4 v0 a3 3 0 0 1 -3 3 h-15 a2 2 0 0 1 -2 -2 v-1 a4 4 0 0 1 4 -4z" fill="${GREEN}" stroke="${INK}" stroke-width="2.5"/>`}</g>`;
  // web-swing poses: a raised arm reaches over the side of the hood to a hand just above the head
  const up = { hangR: ['R'], hangL: ['L'], hangBoth: ['L', 'R'] }[pose] || [];
  const raise = (side) => side === 'R'
    ? limb('M11 -31 Q42 -62 8 -97', 7.5, `url(#${id}-suit)`) + ball(8, -99, 5.4, GREEN)
    : limb('M-11 -31 Q-42 -62 -8 -97', 7.5, `url(#${id}-suit)`) + ball(-8, -99, 5.4, GREEN);
  const down = (side) => side === 'R'
    ? `<g>${limb('M11 -31 Q19 -24 18 -16', 7.5, `url(#${id}-suit)`)}${ball(18, -15, 5, GREEN)}</g>`
    : `<g>${limb('M-11 -31 Q-19 -24 -18 -16', 7.5, `url(#${id}-suit)`)}${ball(-18, -15, 5, GREEN)}</g>`;
  const armsTop = up.map(raise).join('');
  const armL = up.length ? (up.includes('L') ? '' : down('L')) : `<g class="${id}-armB">${limb('M-11 -31 Q-19 -26 -20 -18', 7.5, `url(#${id}-suit)`)}${ball(-20, -17, 5, GREEN)}</g>`;
  const armR = up.length ? (up.includes('R') ? '' : down('R')) : hang
    ? `<g>${limb('M11 -31 Q26 -52 18 -92', 7.5, `url(#${id}-suit)`)}${ball(17, -95, 5.4, GREEN)}</g>`
    : `<g class="${id}-armF">${limb('M11 -31 Q19 -26 20 -18', 7.5, `url(#${id}-suit)`)}${ball(20, -17, 5, GREEN)}</g>`;
  // tiny geometric spider emblem
  const emblem = `<g fill="${GREEN}"><path d="M0 -30.5 l2.6 2.8 -2.6 3.4 -2.6 -3.4z"/></g>` +
    `<path d="M2 -28.5 l4 -2.2 1.6 -2.4 M2 -27 l4.6 1.2 1.8 2.6 M-2 -28.5 l-4 -2.2 -1.6 -2.4 M-2 -27 l-4.6 1.2 -1.8 2.6" stroke="${GREEN}" stroke-width="1.3" stroke-linecap="round" fill="none"/>`;
  return `
${legs}${armL}
<path d="M-12 -36 Q-14 -14 -10 -13 L10 -13 Q14 -14 12 -36 Q0 -40 -12 -36z" fill="url(#${id}-suit)" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>
<path d="M-11.5 -20 Q0 -18 11.5 -20" stroke="${GREEN}" stroke-width="3" fill="none"/>
${emblem}
<path d="M-8 -34 q-2 8 -1 16" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none" opacity=".18"/>
${armR}
<g class="${id}-head">
<circle cx="0" cy="-60" r="29.5" fill="none" stroke="#fff" stroke-width="2" opacity=".22"/>
<circle cx="0" cy="-60" r="27" fill="url(#${id}-suit)" stroke="${INK}" stroke-width="3"/>
<path d="M-24 -50 Q-27 -36 -12 -34 M24 -50 Q27 -36 12 -34" stroke="${GREEN}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
<ellipse cx="0" cy="-55" rx="20" ry="19" fill="url(#${id}-skin)" stroke="${INK}" stroke-width="2.6"/>
<g fill="${HAIR}" stroke="${INK}" stroke-width="1.2">
<circle cx="-14" cy="-67" r="5.2"/><circle cx="-7" cy="-71" r="5.6"/><circle cx="1" cy="-72" r="5.8"/><circle cx="9" cy="-70.5" r="5.4"/><circle cx="15" cy="-66" r="4.8"/>
<circle cx="-17" cy="-61" r="3.6"/><circle cx="17.5" cy="-60" r="3.4"/><circle cx="-3" cy="-66.5" r="4"/><circle cx="5" cy="-66" r="3.8"/>
</g>
<path d="M-6 -72 q2 -2 4 -1 M4 -73 q2 -2 4 0" stroke="#4a3a3a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
<g class="${id}-gog">
<rect x="-21" y="-86" width="42" height="5" rx="2.5" fill="${INK}"/>
<ellipse cx="-9" cy="-83" rx="8.5" ry="6.4" fill="url(#${id}-lens)" stroke="${INK}" stroke-width="2.6"/>
<ellipse cx="9" cy="-83" rx="8.5" ry="6.4" fill="url(#${id}-lens)" stroke="${INK}" stroke-width="2.6"/>
<ellipse cx="-11.5" cy="-85" rx="2.6" ry="1.6" fill="#fff" opacity=".85"/><ellipse cx="6.5" cy="-85" rx="2.6" ry="1.6" fill="#fff" opacity=".85"/>
</g>
<g class="${id}-eyes" fill="${INK}">
<ellipse cx="-7.5" cy="-53" rx="3.3" ry="4.4"/><ellipse cx="7.5" cy="-53" rx="3.3" ry="4.4"/>
</g>
<circle cx="-6.4" cy="-54.8" r="1.3" fill="#fff"/><circle cx="8.6" cy="-54.8" r="1.3" fill="#fff"/>
<path d="M-11 -60 q3.5 -2 7 -.6 M4 -60.6 q3.5 -1.4 7 .6" stroke="${HAIR}" stroke-width="1.8" stroke-linecap="round" fill="none"/>
<circle cx="-13" cy="-46.5" r="3" fill="#FF7FA8" opacity=".55"/><circle cx="13" cy="-46.5" r="3" fill="#FF7FA8" opacity=".55"/>
<path d="M-4.5 -45 q4.5 4.5 9 0" stroke="${INK}" stroke-width="1.9" stroke-linecap="round" fill="#5a1d1d"/>
</g>
${armsTop}`;
}

const kidCss = (id) => `
.${id}-armF,.${id}-armB,.${id}-legF,.${id}-legB{transform-box:view-box}
.${id}-armF{transform-origin:11px -31px;animation:${id}-sw .35s ease-in-out infinite alternate}
.${id}-armB{transform-origin:-11px -31px;animation:${id}-sw .35s ease-in-out -.35s infinite alternate}
.${id}-legF{transform-origin:6px -17px;animation:${id}-sw .35s ease-in-out -.35s infinite alternate}
.${id}-legB{transform-origin:-6px -17px;animation:${id}-sw .35s ease-in-out infinite alternate}
@keyframes ${id}-sw{from{transform:rotate(-20deg)}to{transform:rotate(20deg)}}
.${id}-eyes{transform-box:fill-box;transform-origin:center;animation:${id}-blink 3.8s infinite}
@keyframes ${id}-blink{0%,93%,100%{transform:scaleY(1)}96%{transform:scaleY(.12)}}
.${id}-head{transform-box:view-box;transform-origin:0 -36px;animation:${id}-bob .7s ease-in-out infinite alternate}
@keyframes ${id}-bob{from{transform:rotate(-3deg)}to{transform:rotate(3deg)}}`;

module.exports = { kidDefs, kidBody, kidCss, GREEN };
