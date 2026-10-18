/**
 * The Grindylow's pool, in two aligned halves so people can wade "in" it.
 *
 * Both props are 700 × 220 and are placed at the SAME x, y. Put the actors
 * (and the Grindylow) between them in z: `poolBack` behind, `poolFront`
 * in front. The water line (where the front water's wavy top edge sits) is
 * y 128 in the box; the front covers everything below it, so an actor whose
 * feet are at about y 160 to 190 in the box (box top + 160 to 190 on the
 * stage) is wading, with legs hidden to the knee.
 *
 * poolBack: the far stone rim (y 46 to 60, stones set round the oval), the green water surface seen
 * at a low angle (an oval x 28 to 672, y 56 to 166), lily pads, ripples,
 * and a clump of reeds and bulrushes at the right end (x 590 to 690, y 0
 * to 125). The open water for a head or a creature to rise: x 60 to 560,
 * y 60 to 150.
 * poolFront: the near water with a wavy top edge (y 123 to 133), then the
 * near stone rim from y 168 to 220 (flat bottom). Transparent above the
 * wave, so nothing above it is covered.
 */
import { C } from '../../../art/palette';
import { curve, ellipse, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../../art/paper';

const WATER = '#6f9f7d';
const WATER_DEEP = '#4f7f68';
const WATER_LIGHT = '#9ec7a0';
const STONE = '#a29e92';
const STONE_DARK = '#7c7a70';
const STONE_LIGHT = '#bfbaa9';
const PAD = '#4f8a46';
const PAD_LIGHT = '#6aa356';

const lilyPad = (x: number, y: number, w: number): Node[] => [
  piece(ellipse(x, y, w, w * 0.34), PAD, { edge: 'cut', fibre: false, shadow: false }),
  piece(poly([[x, y], [x + w * 0.95, y - w * 0.08], [x + w * 0.9, y + w * 0.06]]), WATER_DEEP, { edge: 'clean', shadow: false, opacity: 0.8 }),
  piece(ellipse(x - w * 0.2, y - w * 0.08, w * 0.4, w * 0.12), PAD_LIGHT, { edge: 'clean', shadow: false, opacity: 0.8 }),
];

/** A wavy run of points from x0 to x1 around y, amplitude a. */
function wave(x0: number, x1: number, y: number, a: number, step: number, seed: number): Pt[] {
  const r = rng(seed);
  const out: Pt[] = [];
  for (let x = x0; x <= x1; x += step) out.push([x, y + (r() - 0.5) * 2 * a]);
  return out;
}

/** The far half: the far rim, the water, lily pads and reeds. */
export function poolBack(): string {
  const reeds: Node[] = [];
  [[612, 3], [630, -4], [648, 6], [666, -2], [682, 4]].forEach(([x, lean], i) =>
    reeds.push(ink([[x, 120], [x + lean * 0.5, 62], [x + lean * 2, 14 + i * 4]], { width: 3.6, color: i % 2 ? '#5f7a3c' : '#4a5a30', wobble: 0.5 })),
  );
  const rush = (x: number, h: number): Node[] => [
    ink([[x, 124], [x + 2, 124 - h * 0.6], [x + 6, 124 - h]], { width: 3.4, color: '#5f7a3c', wobble: 0.4 }),
    piece(ellipse(x + 6, 124 - h - 14, 6, 16), C.brownDark, { rough: 0.5, shadow: false }),
  ];
  // stones set round the far half of the rim
  const rim: Node[] = [];
  for (let i = 0; i < 17; i++) {
    const a = Math.PI + 0.12 + (i / 16) * (Math.PI - 0.24);
    rim.push(piece(ellipse(350 + Math.cos(a) * 330, 112 + Math.sin(a) * 57, 22, 8), i % 2 ? STONE_LIGHT : STONE, { rough: 0.6, shadow: false }));
  }
  return svg({ w: 700, h: 220, name: 'hog-pool-back', label: 'a shallow pool' }, [
    // stone rim all round the far side, then the water inside it
    piece(ellipse(350, 112, 348, 66), STONE_DARK, { rough: 1 }),
    piece(ellipse(350, 112, 338, 60), STONE, { rough: 0.8, shadow: false }),
    ...rim,
    piece(ellipse(350, 112, 322, 54), WATER_DEEP, { rough: 0.8, shadow: false }),
    piece(ellipse(344, 110, 300, 44), WATER, { rough: 0.8, shadow: false }),
    piece(ellipse(300, 94, 190, 16), WATER_LIGHT, { rough: 1.2, shadow: false, opacity: 0.6 }),
    // ripples
    ink([[120, 120], [150, 114], [190, 120]], { width: 2.4, color: WATER_LIGHT }),
    ink([[330, 134], [370, 128], [420, 134]], { width: 2.4, color: WATER_LIGHT }),
    ink([[460, 100], [490, 95], [520, 100]], { width: 2.4, color: WATER_LIGHT }),
    ...lilyPad(110, 100, 26),
    ...lilyPad(220, 138, 22),
    ...lilyPad(520, 120, 24),
    ...lilyPad(430, 82, 18),
    // reeds and bulrushes at the right end
    ...reeds,
    ...rush(598, 96),
    ...rush(656, 112),
  ]);
}

/** The near half: wavy water over the actors' legs, and the near stone rim. */
export function poolFront(): string {
  const water: Pt[] = [[-10, 224], ...wave(-10, 710, 128, 5, 36, 77), [710, 224]];
  const blocks: Node[] = [];
  for (let i = 0; i < 9; i++) {
    const x = -4 + i * 80;
    blocks.push(piece(rect(x + 2, 176, 76, 38, 8), i % 2 ? STONE : STONE_LIGHT, { rough: 0.7, shadow: false }));
  }
  return svg({ w: 700, h: 220, name: 'hog-pool-front', label: 'the front of a shallow pool' }, [
    // the water the actors stand in: its top edge is the water line
    piece(curve(water, 1), WATER, { rough: 0.6, shadow: false, opacity: 0.96 }),
    piece(curve([[-10, 224], ...wave(-10, 710, 148, 4, 48, 79), [710, 224]], 1), WATER_DEEP, { rough: 0.6, shadow: false, opacity: 0.8 }),
    ink(wave(20, 120, 136, 2, 20, 5), { width: 2.6, color: WATER_LIGHT, opacity: 0.9 }),
    ink(wave(260, 380, 140, 2, 20, 6), { width: 2.6, color: WATER_LIGHT, opacity: 0.9 }),
    ink(wave(520, 640, 136, 2, 20, 8), { width: 2.6, color: WATER_LIGHT, opacity: 0.9 }),
    ...lilyPad(160, 156, 24),
    ...lilyPad(470, 160, 20),
    // the near stone rim, a low wall of stones with a flat bottom
    piece(rect(-6, 168, 712, 52, 6), STONE_DARK, { rough: 0.7, shadow: false }),
    ...blocks,
    piece(rect(-6, 168, 712, 8), STONE_LIGHT, { edge: 'cut', fibre: false, shadow: false, opacity: 0.7 }),
  ]);
}
