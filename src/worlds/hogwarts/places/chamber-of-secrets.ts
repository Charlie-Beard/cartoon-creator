/** From Wizard Words, b2c5 (chamber). */
import { band, circle, curve, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../../art/paper';

const STONE_DARK = '#46534c';

const STONE = '#56645c';

/** The round, snake-carved door at the back of the Chamber. */
function door(cx: number, cy: number): Node[] {
  const snakes: Node[] = [];
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
    const pts: Pt[] = [];
    for (let s = 0; s <= 4; s++) {
      const r = 34 + s * 24;
      const wob = (s % 2 ? 1 : -1) * 0.14;
      pts.push([cx + Math.cos(a + wob) * r, cy + Math.sin(a + wob) * r]);
    }
    snakes.push(piece(band(pts, 13), '#4b7656', { edge: 'cut', fibre: false, shadow: false }));
    const [hx, hy] = pts[pts.length - 1];
    snakes.push(piece(circle(hx, hy, 10), '#4b7656', { edge: 'cut', fibre: false, shadow: false }));
  }
  return [
    piece(circle(cx, cy, 176), STONE_DARK, { rough: 1.2 }),
    piece(circle(cx, cy, 156), '#3b4842', { edge: 'cut', fibre: false }),
    ...snakes,
    piece(circle(cx, cy, 30), STONE, { edge: 'cut' }),
    piece(circle(cx, cy, 11), '#5f8f6a', { edge: 'cut', fibre: false }),
  ];
}

/** A carved stone pillar with a snake winding up it. */
function pillarNodes(x: number, top: number, bottom: number, w: number, color: string, carve: string): Node[] {
  const out: Node[] = [
    piece(rect(x, top + 30, w, bottom - top - 50), color, { rough: 0.8 }),
  ];
  // the carved snake, winding round
  for (let y = top + 60; y < bottom - 50; y += 74) {
    out.push(piece(band([[x + 2, y + 34], [x + w * 0.5, y + 14], [x + w - 2, y - 6]], w * 0.24), carve, { edge: 'cut', fibre: false, shadow: false }));
  }
  out.push(piece(ellipse(x + w * 0.62, top + 46, w * 0.2, w * 0.13), carve, { edge: 'cut', fibre: false, shadow: false }));
  out.push(dot(x + w * 0.66, top + 42, 2.5, '#c9d48f', 0.8));
  out.push(piece(rect(x - 10, top, w + 20, 34, 3), STONE_DARK, { rough: 0.8 }));
  out.push(piece(rect(x - 12, bottom - 26, w + 24, 30, 3), STONE_DARK, { rough: 0.8 }));
  return out;
}

const WATER = '#4a646b';

const WATER_LIGHT = '#7f9fa6';

/** A puddle with a ripple. */
const puddle = (x: number, y: number, rx: number): Node[] => [
  piece(ellipse(x, y, rx, rx * 0.24), WATER, { edge: 'cut', fibre: false }),
  piece(ellipse(x - rx * 0.25, y - rx * 0.05, rx * 0.45, rx * 0.07), WATER_LIGHT, { edge: 'cut', fibre: false, shadow: false, opacity: 0.6 }),
  ink(ellipse(x + rx * 0.2, y + 2, rx * 0.32, rx * 0.08), { width: 1.5, color: WATER_LIGHT, closed: true, opacity: 0.6 }),
];

/** The Chamber of Secrets, as a pop-up paper scene. */
export function chamber(): string {
  const r = rng(225);
  const blocks: Node[] = [];
  for (let y = 70; y < 520; y += 58) {
    blocks.push(ink([[-10, y], [1190, y + (r() - 0.5) * 6]], { width: 2, color: '#24302c', opacity: 0.6 }));
    for (let x = ((y / 58) % 2) * 60 + 20; x < 1180; x += 120) blocks.push(ink([[x, y], [x, y + 58]], { width: 2, color: '#24302c', opacity: 0.5 }));
  }
  const flags: Node[] = [];
  for (const [y, n] of [[580, 7], [650, 6]] as const) {
    for (let i = 0; i <= n; i++) flags.push(ink([[(i / n) * 1180 + (r() - 0.5) * 40, y - 30], [(i / n) * 1180 + (r() - 0.5) * 60, y + 40]], { width: 2, color: '#26302c', opacity: 0.45 }));
  }
  const stalactites: Node[] = [];
  for (let x = 10; x < 1180; x += 46 + r() * 40) {
    const hh = 20 + r() * 34;
    stalactites.push(piece(poly([[x - 16, 30], [x + 16, 30], [x + 2, 30 + hh]]), '#1a2320', { edge: 'cut', fibre: false, shadow: false }));
  }
  return svg({ w: 1180, h: 820, name: 'b2c5-chamber', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), '#1d2724', { edge: 'clean', shadow: false }),
    piece(rect(-20, 30, 1220, 520), '#2c3a35', { edge: 'clean', shadow: false }),
    ...blocks,
    // soft light falling from above
    piece(poly([[440, 30], [560, 30], [700, 560], [380, 560]]), '#b8d0b8', { edge: 'clean', shadow: false, opacity: 0.06 }),
    piece(poly([[900, 30], [960, 30], [1030, 560], [860, 560]]), '#b8d0b8', { edge: 'clean', shadow: false, opacity: 0.05 }),
    ...door(590, 250),
    // back row of snake pillars
    ...pillarNodes(90, 40, 540, 74, STONE, '#41594b'),
    ...pillarNodes(300, 60, 530, 64, '#4d5a53', '#3c5245'),
    ...pillarNodes(1030, 40, 540, 74, STONE, '#41594b'),
    // ceiling and drips
    piece(rect(-20, -20, 1220, 52), '#151c1a', { rough: 1.3 }),
    ...stalactites,
    // floor
    piece(curve([[-40, 860], [-40, 540], [300, 528], [700, 536], [1220, 526], [1220, 860]], 2), '#38453f', { rough: 1.2 }),
    ...flags,
    piece(curve([[-40, 860], [-40, 650], [400, 640], [800, 648], [1220, 638], [1220, 860]], 2), '#323e39', { rough: 1, shadow: false }),
    // the old stone step where the diary lies
    piece(rect(462, 486, 240, 44, 4), STONE_DARK, { rough: 0.9 }),
    piece(rect(470, 482, 224, 12, 3), STONE, { edge: 'cut', fibre: false }),
    // puddles
    ...puddle(345, 642, 70),
    ...puddle(150, 735, 90),
    ...puddle(760, 710, 110),
    ...puddle(1060, 660, 80),
    ...puddle(560, 600, 46),
  ]);
}
