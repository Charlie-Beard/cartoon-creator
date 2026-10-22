/**
 * Inside the giant's kitchen, from a mouse's eye view: everything ENORMOUS.
 *
 * Warm but shadowy. On the LEFT a table leg as thick as a tree trunk
 * (x 40-200) holds up the edge of the tabletop that runs across the
 * top-left, with its dark underside shadow. At the back (x 215-500) a huge
 * stone fireplace glows low and orange, with a giant black kettle hung
 * over the embers. Giant flagstones make the floor (ground line y 640).
 *
 * The RIGHT third (x 780-1180, y 0-640) is deliberately plain dim wall and
 * shadow: the giant's face looms in there. A plain wall spot at about
 * x 520-680, y 140-360 is left for a giant clock prop. Small actors stand
 * on the left and middle (x 200-760). The bottom band is quiet flagstone.
 * No muddy boots: those are a prop.
 */
import { C } from '../../art/palette';
import { cached, curve, ellipse, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../art/paper';

const W = 1180;
const H = 820;
const GROUND = 640;
const flat = { edge: 'cut' as const, fibre: false as const, shadow: false };

/** The flagstone floor: rows of big slabs getting taller toward the front. */
function floor(): Node[] {
  const r = rng(5150);
  const tones = ['#7a6858', '#6f5f51', '#84705e', '#76645a', '#6a5a4e'];
  const out: Node[] = [piece(rect(-20, GROUND, W + 40, H - GROUND + 40), '#74624f', { edge: 'clean', shadow: false, fibre: false })];
  const rows = [GROUND, 676, 722, 780, 860];
  for (let i = 0; i < rows.length - 1; i++) {
    let x = -30 - r() * 60;
    while (x < W + 30) {
      const w = 120 + i * 24 + r() * 90;
      out.push(piece(rect(x + 3, rows[i] + 3, w - 6, rows[i + 1] - rows[i] - 6, 6), tones[Math.floor(r() * tones.length)], { ...flat, edge: 'torn', rough: 0.6 }));
      x += w;
    }
  }
  return out;
}

/** A coursed stone block wall for the fireplace surround. */
function blocks(x0: number, y0: number, x1: number, y1: number, seed: number): Node[] {
  const r = rng(seed);
  const tones = ['#5f5754', '#6a625e', '#57504e', '#665e5a'];
  const out: Node[] = [piece(rect(x0, y0, x1 - x0, y1 - y0), '#5f5754', { edge: 'cut' })];
  let row = 0;
  for (let y = y0; y < y1; y += 44, row++) {
    let x = x0 - (row % 2 ? 40 : 0);
    while (x < x1) {
      const bw = 70 + r() * 40;
      const bx = Math.max(x, x0);
      const bx1 = Math.min(x + bw, x1);
      if (bx1 - bx > 8) out.push(piece(rect(bx + 2, y + 2, bx1 - bx - 4, Math.min(44, y1 - y) - 4, 4), tones[Math.floor(r() * tones.length)], flat));
      x += bw;
    }
  }
  return out;
}

function fireplace(): Node[] {
  const x0 = 215;
  const x1 = 500;
  const top = 270; // underside of the mantel
  const openX0 = 262;
  const openX1 = 453;
  const openTop = 330;
  return [
    // Chimney breast rising to the ceiling, then the surround.
    ...blocks(x0 + 20, 0, x1 - 20, top, 61),
    ...blocks(x0, top, x1, GROUND, 62),
    // The mantel shelf.
    piece(rect(x0 - 24, top - 26, x1 - x0 + 48, 30, 5), C.brownDark, { edge: 'cut' }),
    piece(rect(x0 - 24, top - 26, x1 - x0 + 48, 8, 4), C.brown, flat),
    // The dark opening and the low warm glow inside it.
    piece(poly([[openX0, GROUND], [openX0, openTop + 40], [openX0 + 28, openTop], [openX1 - 28, openTop], [openX1, openTop + 40], [openX1, GROUND]]), C.snapInk, { edge: 'cut', shadow: false }),
    piece(ellipse((openX0 + openX1) / 2, GROUND - 62, 92, 66), '#7a2f1c', { ...flat, opacity: 0.8 }),
    piece(ellipse((openX0 + openX1) / 2, GROUND - 48, 68, 46), C.ginger, { ...flat, opacity: 0.75 }),
    piece(ellipse((openX0 + openX1) / 2, GROUND - 38, 42, 26), C.gold, { ...flat, opacity: 0.8 }),
    // The kettle's iron crane and a giant black kettle hung over the embers.
    piece(rect(openX0 + 6, openTop + 28, 8, 190), C.charcoal, { edge: 'cut', shadow: false }),
    piece(rect(openX0 + 6, openTop + 28, 100, 8), C.charcoal, { edge: 'cut', shadow: false }),
    piece(rect(openX0 + 96, openTop + 34, 4, 50), C.charcoal, { edge: 'cut', shadow: false }),
    ink([[330, 424], [340, 396], [380, 396], [392, 424]], { width: 6, color: C.charcoal }),
    piece(ellipse(362, 470, 54, 46), C.charcoal, { edge: 'cut' }),
    piece(ellipse(346, 456, 18, 10, -25), C.greyDark, { ...flat, opacity: 0.8 }),
    piece(poly([[312, 484], [296, 458], [290, 450], [300, 450], [320, 474]]), C.charcoal, { edge: 'cut', shadow: false }),
    piece(ellipse(362, 428, 38, 9), C.snapInk, { edge: 'cut', shadow: false }),
    // Logs and embers on the hearth.
    piece(ellipse(330, GROUND - 14, 62, 13, -6), C.barkDark, { edge: 'cut' }),
    piece(ellipse(396, GROUND - 16, 56, 12, 8), C.bark, { edge: 'cut' }),
    piece(ellipse(362, GROUND - 24, 40, 12), C.dusk, { ...flat, opacity: 0.9 }),
    // The hearthstone's step.
    piece(rect(x0 - 20, GROUND - 6, x1 - x0 + 40, 20, 4), '#7b6e66', { edge: 'cut' }),
  ];
}

/** The table leg like a trunk, and the tabletop edge above it. */
function tableLeg(): Node[] {
  return [
    // The tabletop's underside shadow on the wall, then its thick front edge.
    piece(poly([[-20, 100], [560, 100], [520, 190], [-20, 230]]), C.snapInk, { ...flat, edge: 'torn', rough: 1.5, opacity: 0.4 }),
    piece(rect(-30, -20, 530, 142, 8), C.tan, { edge: 'cut' }),
    piece(rect(-30, 70, 530, 52, 4), C.wood, { edge: 'cut', shadow: true }),
    piece(rect(-30, 112, 530, 10, 3), C.brownDark, { ...flat, opacity: 0.6 }),
    ink([[-10, 54], [200, 50], [380, 56], [490, 52]], { width: 3, color: C.brown, opacity: 0.45, wobble: 1.5 }),
    ink([[-10, 94], [160, 90], [330, 97], [490, 92]], { width: 3, color: C.brownDark, opacity: 0.35, wobble: 1.5 }),
    // The trunk-thick leg, a little wider at the foot.
    piece(poly([[40, 118], [200, 118], [206, 400], [214, GROUND + 22], [26, GROUND + 22], [34, 400]]), C.wood, { edge: 'cut' }),
    piece(poly([[140, 118], [200, 118], [206, 400], [214, GROUND + 22], [160, GROUND + 22], [150, 400]]), C.brown, { ...flat, opacity: 0.6 }),
    // Grain running down it, and a knot.
    ...[[78, 300], [112, 260], [170, 340]].map(([x, h]) => ink([[x, 130], [x + 4, 130 + h * 0.5], [x - 3, 130 + h]], { width: 3, color: C.brownDark, opacity: 0.35, wobble: 1.8 })),
    ink(Array.from({ length: 17 }, (_, i) => [96 + Math.cos((i / 16) * Math.PI * 2) * 16, 420 + Math.sin((i / 16) * Math.PI * 2) * 30] as Pt), { width: 3, color: C.brownDark, opacity: 0.5, closed: true }),
    piece(ellipse(96, 420, 9, 18), C.brownDark, { ...flat, opacity: 0.6 }),
    // A band of shadow where the leg meets the floor.
    piece(ellipse(120, GROUND + 22, 130, 14), C.snapInk, { ...flat, opacity: 0.35 }),
  ];
}

export const giantKitchen = cached(() => {
  const r = rng(321);
  // Plaster patches and plank joins on the wall, quiet and low in contrast.
  const patches: Node[] = [];
  for (let i = 0; i < 9; i++) {
    const x = 520 + r() * 640;
    const y = 30 + r() * 560;
    patches.push(piece(ellipse(x, y, 60 + r() * 70, 36 + r() * 40), i % 2 ? '#7d5d49' : '#6a4c3c', { ...flat, edge: 'torn', rough: 1.5, opacity: 0.45 }));
  }
  return svg({ w: W, h: H, name: 'wishing-kitchen', boil: false, className: 'backdrop' }, [
    // The back wall: warm plaster, darker at the top and right.
    piece(rect(-20, -20, W + 40, H + 40), '#75553f', { edge: 'clean', shadow: false, fibre: false }),
    piece(rect(-20, -20, W + 40, 220), '#5e4333', { edge: 'torn', rough: 2, shadow: false, fibre: false, opacity: 0.8 }),
    ...patches,
    // A warm pool of light on the wall beside the fire, fading out well before the clock spot's edge.
    piece(ellipse(360, 420, 230, 260), C.dusk, { ...flat, opacity: 0.05 }),
    piece(ellipse(360, 480, 150, 190), C.dusk, { ...flat, opacity: 0.05 }),
    // The right third: shadow, calm and plain, for the giant's face.
    piece(rect(780, -20, 440, GROUND + 20), '#4b3629', { edge: 'torn', rough: 2, shadow: false, fibre: false, opacity: 0.3 }),
    ...floor(),
    ...fireplace(),
    // Firelight spilling onto the flagstones.
    piece(ellipse(362, GROUND + 50, 250, 44), C.dusk, { ...flat, opacity: 0.22 }),
    piece(ellipse(362, GROUND + 40, 140, 26), C.goldLight, { ...flat, opacity: 0.2 }),
    // The skirting where the wall meets the floor, on the right.
    piece(rect(500, GROUND - 22, 720, 26, 3), '#4a3426', { edge: 'cut', shadow: false }),
    ...tableLeg(),
    // A soft dark corner at the foot of the right wall.
    piece(curve([[1220, 560], [1100, 640], [900, 700], [1220, 760]], 2), C.snapInk, { ...flat, edge: 'torn', opacity: 0.12 }),
  ]);
});
