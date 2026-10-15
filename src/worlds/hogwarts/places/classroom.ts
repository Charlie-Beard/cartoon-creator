/** From Wizard Words, b3c2 (classroom). */
import { C } from '../../../art/palette';
import { curve, ellipse, ink, piece, poly, rect, svg, type Node, type Pt } from '../../../art/paper';

const STONE = '#867b6d';

function archOutline(x: number, y: number, w: number, h: number): Pt[] {
  const r = w / 2;
  const pts: Pt[] = [[x, y + h]];
  for (let i = 0; i <= 12; i++) {
    const a = Math.PI + (i / 12) * Math.PI;
    pts.push([x + r + Math.cos(a) * r, y + r + Math.sin(a) * r]);
  }
  pts.push([x + w, y + h]);
  return pts;
}

function windowArt(x: number, y: number, w: number, h: number): Node[] {
  const glassX = x + 12;
  const glassW = w - 24;
  return [
    piece(archOutline(x - 10, y - 10, w + 20, h + 22), C.greyDark, { rough: 0.8 }),
    piece(archOutline(x, y, w, h), C.brownDark, { edge: 'cut' }),
    piece(archOutline(glassX, y + 12, glassW, h - 22), C.sky, { edge: 'cut', fibre: false }),
    piece(ellipse(x + w * 0.35, y + h * 0.45, 34, 14), C.white, { fibre: false, shadow: false, opacity: 0.85 }),
    piece(ellipse(x + w * 0.6, y + h * 0.42, 26, 12), C.white, { fibre: false, shadow: false, opacity: 0.85 }),
    piece(curve([[glassX, y + h - 40], [x + w * 0.4, y + h - 74], [x + w * 0.75, y + h - 60], [glassX + glassW, y + h - 80], [glassX + glassW, y + h - 10], [glassX, y + h - 10]], 2), C.green, { fibre: false, shadow: false }),
    ink([[x + w / 2, y + 14], [x + w / 2, y + h - 10]], { width: 6, color: C.brownDark, wobble: 0.3 }),
    ink([[glassX, y + h * 0.55], [glassX + glassW, y + h * 0.55]], { width: 6, color: C.brownDark, wobble: 0.3 }),
    piece(rect(x - 18, y + h - 4, w + 36, 18, 3), C.stoneLight, { rough: 0.8 }),
  ];
}

/** Lupin's Defence Against the Dark Arts classroom, 1180 × 820. */
export function classroom(): string {
  const blocks: Node[] = [];
  for (let row = 0; row < 10; row++) {
    const y = row * 62;
    for (let col = -1; col < 11; col++) {
      const x = col * 124 + (row % 2) * 62;
      const shade = (row * 7 + col * 3) % 3;
      blocks.push(piece(rect(x + 4, y + 4, 116, 54, 4), shade === 0 ? '#93887a' : shade === 1 ? '#7c7164' : '#8a7f71', { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 }));
    }
  }
  const book = (x: number, w: number, hgt: number, color: string): Node => piece(rect(x, 262 - hgt, w, hgt, 2), color, { edge: 'cut', fibre: false });
  const planks: Node[] = [];
  for (const [y, off] of [[650, 0], [700, 90], [760, 40]] as const) {
    planks.push(ink([[-10, y], [1190, y + 4]], { width: 2.5, color: C.brownDark, opacity: 0.45 }));
    for (let x = 120 + off; x < 1180; x += 260) planks.push(ink([[x, y - 46], [x, y]], { width: 2, color: C.brownDark, opacity: 0.35 }));
  }
  return svg({ w: 1180, h: 820, name: 'b3c2-classroom', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 660), STONE, { edge: 'clean', shadow: false }),
    ...blocks,
    // a soft warm light on the back wall
    piece(ellipse(615, 330, 520, 280), C.candle, { edge: 'cut', fibre: false, shadow: false, opacity: 0.12 }),
    ...windowArt(130, 70, 170, 260),
    ...windowArt(880, 70, 170, 230),
    // a shelf of books and a jar beside the wardrobe
    piece(rect(330, 262, 150, 14, 3), C.brownDark),
    book(342, 18, 56, C.red),
    book(362, 14, 48, C.blueDark),
    book(378, 20, 62, C.greenDark),
    piece(poly([[400, 262], [404, 206], [420, 208], [432, 262]]), C.purple, { edge: 'cut', fibre: false }),
    piece(rect(440, 222, 30, 40, 8), 'rgba(170,200,190,0.75)', { edge: 'cut' }),
    piece(rect(436, 214, 38, 10, 3), C.brown, { edge: 'cut', fibre: false }),
    // a hanging pennant
    ink([[808, 120], [808, 150]], { width: 3, color: C.brownDark }),
    piece(poly([[780, 150], [836, 150], [808, 230]]), C.redDark),
    piece(poly([[796, 160], [820, 160], [808, 196]]), C.gold, { edge: 'cut', fibre: false }),
    // floor
    piece(rect(-20, 600, 1220, 240), '#9a6c46', { rough: 1.4 }),
    ...planks,
    piece(rect(-20, 592, 1220, 18), C.brownDark, { rough: 1.2 }),
    // a round rug in the middle
    piece(ellipse(600, 668, 360, 52), '#8a4a42', { rough: 1.3 }),
    piece(ellipse(600, 668, 316, 38), C.gold, { edge: 'cut', fibre: false, opacity: 0.55 }),
    piece(ellipse(600, 668, 300, 32), '#8a4a42', { edge: 'cut', fibre: false, shadow: false }),
  ]);
}
