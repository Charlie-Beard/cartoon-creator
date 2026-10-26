/**
 * Sergeant Brass: the toy-soldier engine driver of Toyland. A wooden soldier
 * with a tall black busby hat (a gold cord), round red paint
 * spots for cheeks, a red jacket with gold buttons and white cross-belts, and
 * a curly painted moustache. Stiff, fussy and very kind.
 *
 * Poses (the plain portrait is Brass standing to attention, a small smile):
 *   salute   his right hand flat against the brim of the busby, a proud grin.
 *   worried  brows up and together, a small round "oh dear" mouth, hands
 *            wringing in front of his jacket.
 *
 * Parts: figure, head, eyes, lids, brows, mouth, mouthOpen, armL, armR, hat.
 */
import { C } from '../../art/palette';
import { cached, circle, curve, ellipse, ink, piece, poly, rect, type Node } from '../../art/paper';
import { arm, CUT, cx, cy, FLAT, person, torso, type BrowStyle, type EyeStyle, type MouthStyle } from '../faraway/parts';

type Mood = 'stand' | 'salute' | 'worried';

const WOOD = '#ebc79b';
const WOOD_SHADE = '#cfa273';
const JACKET = '#c93a30';
const JACKET_DARK = '#9c2a24';
const GOLD = '#d8a736';
const GOLD_DARK = '#a77d1e';
const BELT = '#f4eedc';
const BUSBY = '#2b2830';
const BUSBY_LIGHT = '#454150';
const PAINT = '#d9453a';

/** The tall black busby with a gold cord on its left. */
function busby(): Node[] {
  const top = 6;
  const base = 84;
  return [
    // the tall fur hat, flaring a little at the top
    piece(poly([[cx - 50, base], [cx - 56, top + 20], [cx - 52, top], [cx + 52, top], [cx + 56, top + 20], [cx + 50, base]]), BUSBY, { edge: 'torn', rough: 0.7 }),
    ...[0, 1, 2, 3, 4, 5].map((i) => ink([[cx - 44 + i * 17, top + 10], [cx - 44 + i * 17 + 3, base - 8]], { width: 2, color: BUSBY_LIGHT, wobble: 0.5, opacity: 0.8 })),
    // gold cord looped across the front
    ink([[cx - 50, base - 12], [cx - 20, base - 26], [cx + 20, base - 26], [cx + 50, base - 12]], { width: 4, color: GOLD, wobble: 0.3 }),
    ink([[cx - 50, base - 12], [cx - 54, base + 14]], { width: 3.4, color: GOLD }),
    piece(circle(cx - 54, base + 17, 5), GOLD, CUT),
    // a gold badge
    piece(circle(cx, top + 42, 11), GOLD, CUT),
    piece(circle(cx, top + 42, 5), GOLD_DARK, FLAT),
    // the band, and the chin strap
    piece(rect(cx - 52, base - 6, 104, 12, 3), GOLD, { edge: 'cut', fibre: false }),
  ];
}

/** A curly painted moustache: two thick swoops from the middle, curled up at the ends. */
function moustache(y: number): Node[] {
  const side = (s: number): Node[] => [
    piece(curve([[cx, y - 3], [cx + s * 16, y - 8], [cx + s * 34, y - 2], [cx + s * 40, y + 10], [cx + s * 33, y + 14], [cx + s * 22, y + 4], [cx + s * 10, y + 4], [cx, y + 5]], 2), C.ink, { edge: 'cut', fibre: false }),
    ink([[cx + s * 38, y + 8], [cx + s * 44, y], [cx + s * 42, y - 8], [cx + s * 36, y - 8]], { width: 4, color: C.ink, wobble: 0.2 }),
  ];
  return [...side(-1), ...side(1)];
}

function draw(mood: Mood, name: string, label: string): string {
  const salute = mood === 'salute';
  const worried = mood === 'worried';
  const eyes: EyeStyle = worried ? 'round' : 'dot';
  const brows: BrowStyle = worried ? 'worried' : salute ? 'raised' : 'kind';
  const mouth: MouthStyle = worried ? 'o' : salute ? 'grin' : 'smile';

  const body: Node[] = [
    torso(JACKET, 10, 232),
    // white cross-belts over the chest
    piece(poly([[92, 240], [112, 236], [212, 340], [190, 346]]), BELT, { edge: 'cut', fibre: false }),
    piece(poly([[208, 240], [188, 236], [88, 340], [110, 346]]), BELT, { edge: 'cut', fibre: false }),
    // the tall collar, gold-edged
    piece(poly([[cx - 40, 224], [cx + 40, 224], [cx + 34, 252], [cx - 34, 252]]), JACKET_DARK, CUT),
    ink([[cx - 36, 252], [cx, 258], [cx + 36, 252]], { width: 4, color: GOLD }),
    // gold buttons down the front
    ...[266, 290, 314].map((y) => piece(circle(cx, y, 6.5), GOLD, CUT)),
    // gold shoulder pads
    piece(ellipse(60, 262, 26, 12, -20), GOLD, CUT),
    piece(ellipse(240, 262, 26, 12, 20), GOLD, CUT),
  ];

  const handCol = BELT;
  const arms: Node[] = salute
    ? [
        arm('armL', { from: [66, 270], via: [48, 308], to: [58, 338], sleeve: JACKET, cuff: BELT, hand: handCol, width: 32 }),
        // the right hand flat to the busby's brim
        arm('armR', { from: [234, 270], via: [276, 224], to: [212, 98], sleeve: JACKET, cuff: BELT, hand: handCol, width: 32 }),
      ]
    : worried
      ? [
          arm('armL', { from: [66, 270], via: [74, 322], to: [132, 306], sleeve: JACKET, cuff: BELT, hand: handCol, width: 32 }),
          arm('armR', { from: [234, 270], via: [226, 322], to: [170, 306], sleeve: JACKET, cuff: BELT, hand: handCol, width: 32 }),
        ]
      : [
          arm('armL', { from: [66, 270], via: [48, 308], to: [58, 338], sleeve: JACKET, cuff: BELT, hand: handCol, width: 32 }),
          arm('armR', { from: [234, 270], via: [252, 308], to: [242, 338], sleeve: JACKET, cuff: BELT, hand: handCol, width: 32 }),
        ];

  return person({
    name,
    label,
    skin: WOOD,
    face: [56, 62],
    ears: false,
    eyes,
    eyeCol: C.ink,
    eyeDx: 24,
    eyeY: -4,
    brows,
    browCol: C.ink,
    browY: -20,
    nose: 'round',
    mouth,
    mouthY: 44,
    cheeks: false,
    neck: WOOD_SHADE,
    body,
    onHead: [
      // painted round red spots for cheeks, and a little wood-grain
      piece(circle(cx - 42, cy + 6, 10), PAINT, { ...FLAT, opacity: 0.95 }),
      piece(circle(cx + 42, cy + 6, 10), PAINT, { ...FLAT, opacity: 0.95 }),
      ink([[cx - 30, cy - 36], [cx - 10, cy - 30], [cx + 14, cy - 34]], { width: 1.6, color: WOOD_SHADE, opacity: 0.7, wobble: 0.5 }),
      ink([[cx + 22, cy + 46], [cx + 40, cy + 38]], { width: 1.6, color: WOOD_SHADE, opacity: 0.7, wobble: 0.5 }),
    ],
    front: moustache(cy + 30),
    hat: busby(),
    arms,
  });
}

/** Sergeant Brass at attention: a stiff little smile. */
export const brass = cached((): string => draw('stand', 'wishing-brass', 'Sergeant Brass'));

/** Saluting, a proud grin. */
export const brassSalute = cached((): string => draw('salute', 'wishing-brass-salute', 'Sergeant Brass saluting'));

/** Worried: brows together, a round "oh dear" mouth, hands wringing. */
export const brassWorried = cached((): string => draw('worried', 'wishing-brass-worried', 'Sergeant Brass, worried'));

