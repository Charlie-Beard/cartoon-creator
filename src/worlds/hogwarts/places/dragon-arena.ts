/** From Wizard Words, b4c2 (arena). */
import { C } from '../../../art/palette';
import { curve, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../../art/paper';

const STANDS = ['#3e2f52', '#4a3560', '#5a3f6e', '#4f3a62'];

const ROCK = ['#5f5b58', '#6e6a66', '#7d7872'];

/** The dragon arena at night: stands full of fans, a rock wall, a sandy floor. */
export function arena(): string {
  const r = rng(4202);
  const nodes: Node[] = [piece(rect(-20, -20, 1220, 860), C.night, { edge: 'clean', shadow: false })];

  // Stars.
  for (let i = 0; i < 36; i++) nodes.push(dot(r() * 1180, r() * 150, 1.4 + r() * 2, r() > 0.8 ? C.goldLight : C.cream, 0.4 + r() * 0.4));

  // The stands: a back wall and four tiers of fans.
  nodes.push(piece(curve([[-20, 160], [300, 140], [590, 134], [880, 140], [1200, 160], [1200, 380], [-20, 380]], 2), '#2c2240', { rough: 1.2 }));
  const scarves = [C.red, C.gold, C.green, C.blue, C.red, C.cream];
  const skins = [C.skin, C.skinShade, '#c69470', '#8a5a3b', C.skinPale];
  for (let i = 0; i < 4; i++) {
    const y0 = 166 + i * 42;
    nodes.push(piece(curve([[-20, y0 + 4], [590, y0 - 6], [1200, y0 + 4], [1200, y0 + 46], [-20, y0 + 46]], 2), STANDS[i], { rough: 0.7, fibre: i === 0 ? undefined : false }));
    for (let x = 8 + (i % 2) * 13; x < 1180; x += 24 + r() * 6) {
      const y = y0 + 14 - Math.sin((x / 1180) * Math.PI) * 6;
      nodes.push(dot(x, y + 8, 7, scarves[Math.floor(r() * scarves.length)]));
      nodes.push(dot(x, y - 1, 5.5, skins[Math.floor(r() * skins.length)]));
    }
  }
  // Bunting along the top of the stands.
  const flags = [C.red, C.gold, C.green, C.blue];
  for (let x = -10, i = 0; x < 1200; x += 46, i++) {
    const y = 150 - Math.sin((x / 1180) * Math.PI) * 14;
    nodes.push(piece(poly([[x, y], [x + 40, y + 2], [x + 20, y + 28]]), flags[i % 4], { edge: 'cut', fibre: false }));
  }
  nodes.push(ink(Array.from({ length: 13 }, (_, i) => [i * 100 - 10, 150 - Math.sin(((i * 100 - 10) / 1180) * Math.PI) * 14] as Pt), { width: 2.5, color: C.cream, opacity: 0.7 }));

  // The rock wall round the arena.
  const top: Pt[] = [];
  for (let x = -20; x <= 1200; x += 40) top.push([x, 336 + r() * 26 - (x % 120 === 0 ? 14 : 0)]);
  nodes.push(piece(poly([...top, [1200, 470], [-20, 470]]), ROCK[0], { rough: 1.4 }));
  for (let i = 0; i < 16; i++) {
    const x = 30 + i * 76 + r() * 30;
    nodes.push(piece(ellipse(x, 400 + r() * 40, 34 + r() * 20, 22 + r() * 12, r() * 30 - 15), ROCK[1 + (i % 2)], { fibre: false }));
  }

  // The sandy floor, with paler patches.
  nodes.push(piece(curve([[-20, 446], [300, 428], [600, 438], [900, 424], [1200, 442], [1200, 860], [-20, 860]], 2), '#9c8868'));
  nodes.push(piece(ellipse(300, 560, 260, 50), '#ab9776', { edge: 'cut', fibre: false, shadow: false, opacity: 0.7 }));
  nodes.push(piece(ellipse(860, 700, 300, 46), '#ab9776', { edge: 'cut', fibre: false, shadow: false, opacity: 0.6 }));
  nodes.push(piece(ellipse(160, 740, 200, 30), '#93805f', { edge: 'cut', fibre: false, shadow: false, opacity: 0.6 }));
  // Scattered pebbles and two corner boulders.
  for (let i = 0; i < 14; i++) nodes.push(piece(ellipse(40 + r() * 1100, 480 + r() * 300, 6 + r() * 8, 4 + r() * 5), ROCK[2], { edge: 'cut', fibre: false }));
  nodes.push(piece(curve([[-20, 690], [-10, 600], [40, 570], [100, 600], [120, 700], [-20, 720]], 2), ROCK[1]));
  nodes.push(piece(ellipse(60, 640, 26, 14, -20), ROCK[2], { fibre: false, shadow: false }));
  nodes.push(piece(curve([[1200, 730], [1190, 640], [1140, 618], [1100, 650], [1092, 740]], 2), ROCK[1]));

  // The egg's nest: a ring of rocks with straw (front rocks are a separate actor).
  nodes.push(piece(ellipse(570, 598, 110, 30), '#7a6248', { fibre: false }));
  for (let i = 0; i < 9; i++) nodes.push(ink([[490 + i * 18, 590 + (i % 3) * 4], [510 + i * 18, 582 + (i % 2) * 8]], { width: 3, color: C.goldLight, opacity: 0.8 }));
  for (const [x, y, rx] of [[470, 588, 26], [528, 574, 22], [600, 572, 24], [664, 586, 26]] as Array<[number, number, number]>) nodes.push(piece(ellipse(x, y, rx, 16), ROCK[2], { fibre: false }));

  return svg({ w: 1180, h: 820, name: 'b4c2-arena', boil: false, className: 'backdrop' }, nodes);
}
