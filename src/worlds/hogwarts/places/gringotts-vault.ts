/** From Wizard Words, b7c2 (vault). */
import { C } from '../../../art/palette';
import { circle, curve, ellipse, ink, piece, poly, rect, rng, svg, type Node } from '../../../art/paper';

/** A silver helmet on a shelf. */
function helmetShape(cx: number, cy: number, s: number): Node[] {
  return [
    piece(curve([[cx - 24 * s, cy], [cx - 22 * s, cy - 20 * s], [cx, cy - 32 * s], [cx + 22 * s, cy - 20 * s], [cx + 24 * s, cy]], 2), '#b9bec8'),
    piece(rect(cx - 27 * s, cy - 2 * s, 54 * s, 8 * s, 2), '#8d93a0', { edge: 'cut', fibre: false }),
    piece(poly([[cx - 2 * s, cy - 32 * s], [cx + 2 * s, cy - 32 * s], [cx, cy - 44 * s]]), C.red, { edge: 'cut', fibre: false }),
  ];
}

const STONE_DARK = '#4b4756';

const STONE = '#6a6574';

const GOLD_DK = '#c79a26';

/** A heap of gold coins, with a few bright ones on top. */
function goldPile(cx: number, cy: number, w: number, h: number, seed: number): Node[] {
  const r = rng(seed);
  const coinsOn: Node[] = [];
  for (let i = 0; i < 9; i++) {
    const px = cx + (r() - 0.5) * w * 0.7;
    const py = cy - r() * h * 0.7 + h * 0.1;
    coinsOn.push(piece(ellipse(px, py, 10, 5), r() > 0.5 ? C.goldLight : C.yellow, { edge: 'cut', fibre: false, shadow: false }));
  }
  return [
    piece(curve([[cx - w / 2, cy + h / 2], [cx - w * 0.3, cy - h * 0.1], [cx, cy - h / 2], [cx + w * 0.3, cy - h * 0.1], [cx + w / 2, cy + h / 2]], 2), GOLD_DK),
    piece(curve([[cx - w * 0.38, cy + h * 0.4], [cx - w * 0.15, cy - h * 0.1], [cx + w * 0.1, cy - h * 0.3], [cx + w * 0.35, cy + h * 0.4]], 2), C.gold, { fibre: false }),
    ...coinsOn,
  ];
}

/** The vault: a round steel door ajar, shelves of helmets, heaps of gold. Roof is an actor. */
export function vault(): string {
  const shelves: Node[] = [];
  for (const [y, xs] of [[300, [60, 150, 240, 330]], [440, [90, 190, 290]]] as Array<[number, number[]]>) {
    shelves.push(piece(rect(30, y, 340, 12, 3), C.brownDark, { edge: 'cut' }));
    xs.forEach((x, i) => shelves.push(...helmetShape(x, y - 2, 1.05 + (i % 2) * 0.1)));
  }
  return svg({ w: 1180, h: 820, name: 'b7c2-vault', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), STONE_DARK, { edge: 'clean', shadow: false }),
    piece(rect(-20, 120, 1220, 540), STONE, { edge: 'clean', shadow: false }),
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => ink([[i * 170 - 20, 120], [i * 170 - 20, 660]], { width: 3, color: STONE_DARK })),
    ...[220, 340, 460, 580].map((y) => ink([[-20, y], [1220, y]], { width: 3, color: STONE_DARK })),
    // the round door, swung open at the far left
    piece(circle(120, 520, 0.1), STONE_DARK, { shadow: false, opacity: 0 }),
    ...shelves,
    ...goldPile(880, 600, 340, 150, 11),
    ...goldPile(1060, 620, 260, 130, 12),
    ...goldPile(700, 640, 220, 100, 13),
    piece(rect(400, 560, 150, 90, 6), C.brownDark),
    piece(rect(400, 560, 150, 24, 6), C.wood, { edge: 'cut' }),
    ...goldPile(475, 566, 120, 40, 14),
    piece(rect(-40, 650, 1260, 220), '#5a5566', { edge: 'clean', shadow: false }),
    ...[0, 1, 2, 3, 4, 5].map((i) => ink([[i * 240, 650], [i * 240 - 80, 820]], { width: 3, color: STONE_DARK })),
  ]);
}
