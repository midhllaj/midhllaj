// "Byte": an original chibi spider-hero (not any existing character).
// Purple suit, pink gloves/boots/scarf, cyan goggle visor, curly spider feelers on the hood,
// a small yellow geometric spider emblem. Local origin = between the feet (0,0), faces right, ~78 px tall.
// pose: 'run' (arms/legs swing) or 'hang' (front arm straight up holding a web line at (6,-92)).

const heroDefs = (id) => `
<linearGradient id="${id}-suit" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B48CFF"/><stop offset=".45" stop-color="#7B45E8"/><stop offset="1" stop-color="#3D1C8F"/></linearGradient>
<radialGradient id="${id}-head" cx=".38" cy=".3" r=".85"><stop offset="0" stop-color="#CDB3FF"/><stop offset=".4" stop-color="#8450F0"/><stop offset="1" stop-color="#341777"/></radialGradient>
<linearGradient id="${id}-pink" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF9CC2"/><stop offset=".5" stop-color="#FF4D8D"/><stop offset="1" stop-color="#B21D5C"/></linearGradient>
<linearGradient id="${id}-visor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9F6FF"/><stop offset=".5" stop-color="#00D1FF"/><stop offset="1" stop-color="#0A6FA8"/></linearGradient>`;

function heroBody(id, pose = 'run') {
  const limb = (d, w, stroke) => `<path d="${d}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  const hang = pose === 'hang';
  // back limbs (darker, behind the body)
  const backArm = hang
    ? `<g>${limb('M-7 -41 Q-6 -66 -1 -88', 6.5, '#5a2fc0')}<circle cx="-1" cy="-89" r="4.6" fill="url(#${id}-pink)"/></g>`
    : `<g class="${id}-armB">${limb('M-8 -40 Q-15 -32 -13 -24', 6.5, '#4a2499')}<circle cx="-13" cy="-23" r="4.2" fill="url(#${id}-pink)"/></g>`;
  const backLeg = `<g class="${id}-legB">${limb(hang ? 'M-4 -22 L-7 -6' : 'M-4 -22 L-6 -6', 7.5, '#4a2499')}<rect x="-12" y="-8" width="11" height="8" rx="3.5" fill="#B21D5C"/></g>`;
  const frontLeg = `<g class="${id}-legF">${limb(hang ? 'M4 -22 L6 -6' : 'M4 -22 L6 -6', 7.5, `url(#${id}-suit)`)}<rect x="1" y="-8" width="12" height="8" rx="3.5" fill="url(#${id}-pink)"/></g>`;
  const frontArm = hang
    ? `<g>${limb('M8 -40 Q15 -32 15 -24', 6.5, `url(#${id}-suit)`)}<circle cx="15" cy="-23" r="4.6" fill="url(#${id}-pink)"/></g>`
    : `<g class="${id}-armF">${limb('M8 -40 Q16 -33 16 -25', 6.5, `url(#${id}-suit)`)}<circle cx="16" cy="-24" r="4.6" fill="url(#${id}-pink)"/></g>`;
  return `
<g class="${id}-scarf"><path d="M-6 -44 Q-20 -46 -30 -38 Q-24 -42 -18 -40 Q-26 -36 -32 -30 Q-20 -38 -8 -39 Z" fill="url(#${id}-pink)"/></g>
${backArm}${backLeg}
<rect x="-11" y="-45" width="22" height="26" rx="9" fill="url(#${id}-suit)"/>
<rect x="-10" y="-24" width="20" height="3.5" rx="1.5" fill="#FFD23F"/>
<rect x="-1.5" y="-24.4" width="4" height="4.3" rx="1" fill="#FFF0A8"/>
<g fill="#FFD23F"><path d="M0 -39 l3 3 -3 3 -3 -3z"/><path d="M0 -36 h5 l2 -3 M0 -36 h-5 l-2 -3 M0 -35 h5 l2 3 M0 -35 h-5 l-2 3" stroke="#FFD23F" stroke-width="1.3" stroke-linecap="round" fill="none"/></g>
<ellipse cx="-4" cy="-41" rx="4" ry="2" fill="#fff" opacity=".35"/>
${frontLeg}
<rect x="-9" y="-47" width="20" height="6" rx="3" fill="url(#${id}-pink)"/>
<path d="M-4 -70 q-6 -14 -14 -12 q-6 1 -3 6" stroke="#A98BFF" stroke-width="2.4" stroke-linecap="round" fill="none"/><circle cx="-21" cy="-76" r="2.6" fill="#FF4D8D"/>
<path d="M5 -72 q2 -15 11 -16 q6 0 4 6" stroke="#A98BFF" stroke-width="2.4" stroke-linecap="round" fill="none"/><circle cx="20" cy="-82" r="2.6" fill="#FF4D8D"/>
<circle cx="2" cy="-58" r="17" fill="url(#${id}-head)"/>
<path d="M-6 -73 q-3 6 -1 12" stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".35"/>
<rect x="-7" y="-64" width="25" height="11" rx="5.5" fill="#1b0f3d"/>
<rect x="-6" y="-63" width="23" height="9" rx="4.5" fill="url(#${id}-visor)"/>
<rect class="${id}-glint" x="-3" y="-62" width="4" height="7" rx="2" fill="#fff" opacity=".85" transform="skewX(-15)"/>
<path d="M7 -49.5 q4 2.6 8 0" stroke="#2a1263" stroke-width="1.6" stroke-linecap="round" fill="none"/>
${frontArm}`;
}

const heroCss = (id) => `
.${id}-scarf{transform-box:fill-box;transform-origin:100% 20%;animation:${id}-scarf .5s ease-in-out infinite alternate}
@keyframes ${id}-scarf{from{transform:rotate(-6deg) scaleX(.92)}to{transform:rotate(8deg) scaleX(1.08)}}
.${id}-armF,.${id}-armB,.${id}-legF,.${id}-legB{transform-box:view-box}
.${id}-armF{transform-origin:8px -40px;animation:${id}-swing .375s ease-in-out infinite alternate}
.${id}-armB{transform-origin:-8px -40px;animation:${id}-swing .375s ease-in-out -.375s infinite alternate}
.${id}-legF{transform-origin:4px -22px;animation:${id}-swing .375s ease-in-out -.375s infinite alternate}
.${id}-legB{transform-origin:-4px -22px;animation:${id}-swing .375s ease-in-out infinite alternate}
@keyframes ${id}-swing{from{transform:rotate(-22deg)}to{transform:rotate(22deg)}}
.${id}-glint{animation:${id}-glint 3s ease-in-out infinite}
@keyframes ${id}-glint{0%,70%{transform:translateX(0) skewX(-15deg);opacity:0}80%{opacity:.9}100%{transform:translateX(18px) skewX(-15deg);opacity:0}}`;

module.exports = { heroDefs, heroBody, heroCss };
