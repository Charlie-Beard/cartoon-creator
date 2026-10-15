/** From Wizard Words, b5c2 (meadow). */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, piece, poly, rect, rng, svg, type Node, type Pt } from '../../../art/paper';

function starPts(cx: number, cy: number, R: number, r: number, n = 5): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / n;
    const rr = i % 2 ? r : R;
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return pts;
}

function hills(y: number, amp: number, color: string, seed: number, step = 160): Node {
  const r = rng(seed);
  const pts: Pt[] = [[-40, 900]];
  for (let x = -40; x < 1220 + step; x += step) pts.push([x, y - r() * amp]);
  pts.push([1220 + step, 900]);
  return piece(curve(pts, 3), color, { rough: 1.3 });
}

/** The moonlit meadow, 1180 × 820. */
export function meadow(): string {
  const r = rng(5202);
  const stars: Node[] = [];
  for (let i = 0; i < 42; i++) {
    const x = r() * 1180;
    const y = r() * 430;
    if (Math.hypot(x - 700, y - 190) < 110) continue;
    stars.push(piece(poly(starPts(x, y, 3 + r() * 4, 1.4 + r(), 4)), r() > 0.75 ? C.goldLight : C.cream, { edge: 'cut', fibre: false, shadow: false, opacity: 0.45 + r() * 0.45 }));
  }
  const fireflies: Node[] = [];
  for (let i = 0; i < 16; i++) fireflies.push(dot(260 + r() * 880, 300 + r() * 300, 2.5 + r() * 2, C.goldLight, 0.5 + r() * 0.3));
  const flowers: Node[] = [];
  const petals = [C.cream, '#d9c3e8', C.pink, '#f3e3a8'];
  for (let i = 0; i < 26; i++) {
    const x = 20 + r() * 1140;
    const y = 632 + r() * 50;
    const s = 6 + r() * 4;
    flowers.push(piece(circle(x, y, s), petals[i % petals.length], { edge: 'cut', fibre: false }));
    flowers.push(dot(x, y, s * 0.38, C.gold));
  }
  const grass: Node[] = [];
  for (let x = -10; x < 1200; x += 34 + r() * 30) {
    const y = 640 + r() * 12;
    const hgt = 22 + r() * 22;
    grass.push(piece(poly([[x, y], [x + 5, y - hgt], [x + 10, y - 4], [x + 15, y - hgt * 0.8], [x + 22, y]]), r() > 0.5 ? '#3d6650' : C.greenDark, { edge: 'cut', fibre: false }));
  }
  const tree: Node[] = [
    piece(curve([[30, 830], [44, 600], [40, 380], [60, 220], [96, 100], [140, 96], [104, 230], [96, 420], [104, 620], [120, 830]], 2), '#3b2d2b', { rough: 1.2 }),
    piece(curve([[100, 150], [210, 112], [350, 104], [352, 120], [210, 132], [108, 176]], 2), '#3b2d2b'),
    piece(curve([[230, 120], [262, 84], [276, 88], [246, 128]], 1), '#3b2d2b'),
    piece(circle(20, 40, 100), '#22382f'),
    piece(circle(140, -10, 90), '#26402f'),
    piece(circle(-20, 170, 70), '#22382f'),
    piece(circle(250, -40, 70), '#22382f'),
    piece(circle(70, 70, 50), '#2d4a38', { fibre: false }),
  ];
  return svg({ w: 1180, h: 820, name: 'b5c2-meadow', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), '#232849', { edge: 'clean', shadow: false }),
    piece(ellipse(600, 520, 800, 300), '#33335f', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    ...stars,
    // the moon and its soft halo
    piece(circle(700, 190, 130), C.candle, { edge: 'cut', fibre: false, shadow: false, opacity: 0.08 }),
    piece(circle(700, 190, 96), C.candle, { edge: 'cut', fibre: false, shadow: false, opacity: 0.1 }),
    piece(circle(700, 190, 64), C.cream, { rough: 0.8 }),
    piece(circle(680, 172, 12), C.sand, { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 }),
    piece(circle(722, 204, 9), C.sand, { edge: 'cut', fibre: false, shadow: false, opacity: 0.5 }),
    piece(circle(694, 220, 6), C.sand, { edge: 'cut', fibre: false, shadow: false, opacity: 0.5 }),
    // wispy clouds
    piece(ellipse(470, 110, 120, 15), '#4a4678', { fibre: false, opacity: 0.75 }),
    piece(ellipse(960, 250, 140, 17), '#4a4678', { fibre: false, opacity: 0.75 }),
    piece(ellipse(1040, 90, 90, 12), '#4a4678', { fibre: false, opacity: 0.6 }),
    // hills: far, middle, and the meadow in front
    hills(495, 50, '#2f3a62', 11),
    hills(560, 34, '#30524a', 17, 220),
    ...fireflies,
    hills(650, 16, '#2a4638', 23, 260),
    ...grass,
    ...tree,
    ...flowers,
    // a few pale moonbeam paths on the ground
    piece(ellipse(620, 740, 420, 40), '#335244', { edge: 'cut', fibre: false, shadow: false, opacity: 0.7 }),
  ]);
}
