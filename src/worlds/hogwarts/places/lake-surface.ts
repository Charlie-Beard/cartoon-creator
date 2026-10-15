/** From Wizard Words, b4c3 (surface). */
import { C } from '../../../art/palette';
import { circle, curve, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../../art/paper';

/** A wavy-topped layer that runs off the bottom of the stage. */
function layer(y: number, amp: number, color: string, seed: number, step = 90): Node {
  const r = rng(seed);
  const pts: Pt[] = [[-40, 900]];
  for (let x = -40; x <= 1220; x += step) pts.push([x, y - r() * amp]);
  pts.push([1220, 900]);
  return piece(curve(pts, 2), color, { rough: 1.3 });
}

/** Above the lake at night: stars, the castle, a cheering stand and the moonlit water. */
export function surface(): string {
  const r = rng(91);
  const stars: Node[] = Array.from({ length: 40 }, () => {
    const x = r() * 1180;
    const y = r() * 360;
    const s = 2 + r() * 4;
    const pts: Pt[] = Array.from({ length: 8 }, (_, k) => {
      const a = (k * Math.PI) / 4;
      const rr = k % 2 ? s * 0.4 : s;
      return [x + Math.cos(a) * rr, y + Math.sin(a) * rr] as Pt;
    });
    return piece(poly(pts), r() > 0.8 ? C.goldLight : C.cream, { edge: 'cut', fibre: false, shadow: false, opacity: 0.5 + r() * 0.4 });
  });
  const tower = (x: number, top: number, w: number): Node[] => [
    piece(rect(x, top, w, 470 - top), C.nightLight, { rough: 0.8 }),
    piece(poly([[x - 8, top + 4], [x + w / 2, top - w * 1.2], [x + w + 8, top + 4]]), C.slate, { rough: 0.8 }),
  ];
  const win = (x: number, y: number) => piece(rect(x, y, 10, 16, 5), C.candle, { edge: 'cut', fibre: false, shadow: false });
  const heads: Node[] = [];
  const colors = [C.skin, C.skinShade, '#c8956a', C.skin, '#a8754e'];
  const scarves = [C.red, C.gold, C.green, C.blue, C.yellow];
  for (let row = 0; row < 3; row++) {
    for (let i = 0; i < 9; i++) {
      const x = 935 + i * 24 + (row % 2) * 12;
      const y = 392 + row * 26;
      heads.push(piece(rect(x - 9, y + 6, 18, 12, 4), scarves[(i + row) % 5], { edge: 'cut', fibre: false, shadow: false }));
      heads.push(piece(circle(x, y, 8), colors[(i * 3 + row) % 5], { edge: 'cut', fibre: false, shadow: false }));
    }
  }
  return svg({ w: 1180, h: 820, name: 'b4c3-surface', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), C.night, { edge: 'clean', shadow: false }),
    ...stars,
    layer(400, 50, '#2a3157', 21, 100),
    ...tower(560, 300, 50),
    ...tower(630, 240, 64),
    ...tower(720, 290, 52),
    piece(rect(540, 340, 250, 130), C.nightLight, { rough: 0.8 }),
    win(578, 360), win(655, 290), win(675, 330), win(738, 340), win(600, 400), win(700, 410), win(750, 390),
    // a wooden stand full of cheering people on the far shore
    piece(rect(910, 370, 250, 100, 4), C.brownDark),
    ...heads,
    piece(rect(906, 448, 258, 24, 3), C.wood),
    ...[[930, C.red], [990, C.gold], [1050, C.green], [1110, C.blue]].map(([x, c]) =>
      piece(poly([[+x, 330], [+x + 30, 342], [+x, 354]]), c as string, { edge: 'cut', fibre: false }),
    ),
    ...[930, 990, 1050, 1110].map((x) => ink([[x, 330], [x, 372]], { width: 3, color: C.brownDark })),
    layer(470, 26, '#2a3d5c', 23, 140),
    // the far lake
    piece(rect(-20, 466, 1220, 400), '#24405a', { edge: 'clean', shadow: false }),
    ...[[400, 500], [700, 520], [980, 495], [560, 560], [880, 580]].map(([x, y]) => ink([[x - 40, y], [x - 14, y - 5], [x + 14, y], [x + 40, y - 5]], { width: 3, color: '#3d6480' })),
  ]);
}
