/** From Wizard Words, b4c1 (stadium). */
import { C } from '../../../art/palette';
import { band, circle, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../../art/paper';

const STANDS = ['#3e2f52', '#5a3f6e', '#4a3560', '#6b4f86', '#553a62', '#6e5585'];

/** Point on the top arc of an ellipse at a given x. */
const arcY = (x: number, cx: number, cy: number, rx: number, ry: number): number => cy - ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2));

const PITCH = '#5c8550';

/** The World Cup stadium at night, like a pop-up book. */
export function stadium(): string {
  const r = rng(404);
  const nodes: Node[] = [piece(rect(-20, -20, 1220, 860), C.night, { edge: 'clean', shadow: false })];

  // Stars.
  for (let i = 0; i < 40; i++) {
    const x = r() * 1180;
    const y = r() * 220;
    nodes.push(dot(x, y, 1.4 + r() * 2, r() > 0.8 ? C.goldLight : C.cream, 0.4 + r() * 0.4));
  }

  // Floodlight towers at the edges, with soft halos (below the corner buttons).
  for (const x of [56, 1124]) {
    nodes.push(piece(ellipse(x, 140, 90, 56), C.candle, { edge: 'clean', shadow: false, opacity: 0.12 }));
    nodes.push(piece(band([[x, 150], [x, 420]], 12), C.charcoal, { edge: 'cut' }));
    nodes.push(piece(rect(x - 34, 118, 68, 34, 4), C.slate, { edge: 'cut' }));
    for (let k = 0; k < 3; k++) nodes.push(piece(circle(x - 20 + k * 20, 135, 8), C.cream, { edge: 'cut', fibre: false, shadow: false }));
  }

  // The stands: tiers of seats, outer wall first.
  const cx = 590;
  const cy = 660;
  nodes.push(piece(ellipse(cx, cy, 800, 440), '#2c2240', { rough: 1.2 }));
  const tiers = 6;
  for (let i = 0; i < tiers; i++) {
    const rx = 780 - i * 18;
    const ry = 418 - i * 34;
    nodes.push(piece(ellipse(cx, cy, rx, ry), STANDS[i], { rough: 0.8, fibre: i === 0 ? undefined : false }));
  }
  // The crowd: little heads and scarves along each tier.
  const scarves = [C.red, C.green, C.gold, C.red, C.green, C.cream];
  const skins = [C.skin, C.skinShade, '#c69470', '#8a5a3b', C.skinPale];
  for (let i = 0; i < tiers; i++) {
    const rx = 780 - i * 18;
    const ry = 418 - i * 34;
    const n = 70 - i * 4;
    for (let k = 0; k < n; k++) {
      const a = Math.PI * (0.02 + (0.96 * (k + r() * 0.4)) / n);
      const x = cx + Math.cos(a) * (rx - 8);
      const y = cy - Math.sin(a) * (ry - 8) + 16;
      if (x < -10 || x > 1190) continue;
      nodes.push(dot(x, y + 7, 7, scarves[(k + i) % scarves.length]));
      nodes.push(dot(x, y - 2, 5, skins[Math.floor(r() * skins.length)]));
    }
  }

  // Flags on the rim of the stands.
  const flagCols = [C.red, C.green, C.gold, C.blue, C.green, C.red, C.gold];
  [110, 270, 440, 600, 760, 920, 1075].forEach((x, i) => {
    const y = arcY(x, cx, cy, 800, 440) + 6;
    nodes.push(ink([[x, y], [x, y - 70]], { width: 4, color: C.brownDark }));
    const f = i % 2 ? 1 : -1;
    nodes.push(piece(poly([[x, y - 70], [x + 52 * f, y - 58], [x + 6 * f, y - 44]]), flagCols[i], { edge: 'cut' }));
  });

  // The pitch.
  nodes.push(piece(ellipse(cx, 712, 740, 222), '#4a6e42', { rough: 1.2 }));
  nodes.push(piece(ellipse(cx, 716, 716, 206), PITCH, { fibre: false }));
  nodes.push(piece(ellipse(cx, 736, 560, 150), '#668f58', { edge: 'cut', fibre: false, shadow: false, opacity: 0.6 }));
  nodes.push(ink(ellipse(cx, 610, 110, 30), { closed: true, width: 3, color: C.white, opacity: 0.45 }));

  // Goal hoops at each end.
  const hoop = (x: number, top: number): Node[] => [
    piece(band([[x, top + 26], [x, 600]], 9), C.goldLight, { edge: 'cut', fibre: false }),
    ink(ellipse(x, top, 22, 27), { closed: true, width: 8, color: C.gold }),
  ];
  for (const [x, top] of [[120, 380], [178, 330], [236, 380], [944, 380], [1002, 330], [1060, 380]] as Pt[]) nodes.push(...hoop(x, top));

  return svg({ w: 1180, h: 820, name: 'b4c1-stadium', boil: false, className: 'backdrop' }, nodes);
}
