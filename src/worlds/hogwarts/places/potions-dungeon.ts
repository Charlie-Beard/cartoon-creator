/** From Wizard Words, b6c1 (dungeon). */
import { C } from '../../../art/palette';
import { curve, ellipse, ink, piece, rect, rng, svg, type Node } from '../../../art/paper';

const STONE = '#4f5560';

const STONE_DARK = '#3e434d';

/** The steamy dungeon, as a pop-up paper scene. */
export function dungeon(): string {
  const r = rng(601);
  const bricks: Node[] = [];
  for (let row = 0; row < 8; row++) {
    let x = row % 2 ? -40 : 0;
    while (x < 1200) {
      const w = 110 + r() * 50;
      bricks.push(piece(rect(x + 3, row * 62 + 8, w - 6, 52, 3), r() > 0.5 ? STONE : '#585e6a', { edge: 'cut', fibre: false, shadow: false, rough: 0.6 }));
      x += w;
    }
  }
  const jarCols = [C.green, C.purple, C.orange, C.teal, C.pink, C.yellow];
  const jars: Node[] = [];
  for (const [sx, sy] of [[60, 300], [830, 300]] as Array<[number, number]>) {
    jars.push(piece(rect(sx, sy, 270, 12, 3), C.wood, { edge: 'cut' }));
    for (let i = 0; i < 5; i++) {
      const jx = sx + 14 + i * 50;
      const jh = 44 + r() * 20;
      jars.push(piece(rect(jx, sy - jh, 34, jh, 8), jarCols[Math.floor(r() * jarCols.length)], { edge: 'cut', fibre: false, opacity: 0.9 }));
      jars.push(piece(rect(jx + 6, sy - jh - 8, 22, 10, 2), C.brownDark, { edge: 'cut', fibre: false, shadow: false }));
    }
  }
  // An arched window high on the wall, with a bit of day outside.
  const arch: Array<[number, number]> = [[450, 280]];
  for (let i = 0; i <= 14; i++) {
    const a = Math.PI + (i / 14) * Math.PI;
    arch.push([590 + Math.cos(a) * 130, 150 + Math.sin(a) * 130]);
  }
  arch.push([720, 280]);
  const inner: Array<[number, number]> = [[468, 280]];
  for (let i = 0; i <= 14; i++) {
    const a = Math.PI + (i / 14) * Math.PI;
    inner.push([590 + Math.cos(a) * 112, 150 + Math.sin(a) * 112]);
  }
  inner.push([702, 280]);
  return svg({ w: 1180, h: 820, name: 'b6c1-dungeon', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), STONE_DARK, { edge: 'clean', shadow: false }),
    ...bricks,
    piece(arch, C.brownDark, { rough: 0.8 }),
    piece(inner, C.sky, { edge: 'cut', fibre: false }),
    piece(ellipse(560, 190, 54, 16), C.white, { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    piece(rect(584, 40, 8, 240), C.brownDark, { edge: 'cut', fibre: false }),
    piece(rect(440, 276, 300, 14, 3), C.wood),
    ...jars,
    // floor
    piece(curve([[-40, 860], [-40, 650], [300, 640], [590, 636], [880, 640], [1220, 650], [1220, 860]], 2), '#2f333b', { rough: 1.2 }),
    piece(ellipse(590, 700, 380, 40), '#262a31', { edge: 'cut', fibre: false, shadow: false, opacity: 0.6 }),
    // hanging cobweb corner
    ink([[0, 0], [90, 90]], { width: 2, color: C.stone }),
    ink([[0, 0], [110, 40]], { width: 2, color: C.stone }),
    ink([[40, 20], [58, 62]], { width: 1.5, color: C.stone }),
  ]);
}
