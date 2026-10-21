/**
 * The Children's Hospital, for "The Doll's House" (Teddy Bear Treasury), in
 * the book's watercolour-and-ink look.
 *
 *   hospital-garden   1180 × 820, a sunny party day. On the left and back-left
 *                     the big plain old wall of sandy blocks (the one the
 *                     children have to look at), with weeds and dandelions at
 *                     its foot; on the right the friendly cream hospital with
 *                     bunting going up, a first-floor balcony and an open
 *                     French window behind it. Lawn and a path in front.
 *   hospital-balcony  560 × 200, the balcony's white iron railing with bunting
 *                     tied along its top rail and the stone slab at the bottom.
 *                     Transparent between the bars, so children stood behind
 *                     it (lower z) show through. Placed at x 640, y 330.
 *
 * The backdrop paints the balcony floor and the wall behind it but not the
 * railing; the prop's slab lines up with the backdrop's slab (y 420–458), so
 * the two read as one balcony.
 */
import { cached, curve, ellipse, rect, rng, svg, type Node, type Pt } from '../../art/paper';
import { blot, deeper, INK, pageNodes, paler, pen, wash } from '../../art/watercolour';
import { bush, cloud, GRASS, GRASS_DARK, LEAF_DARK, path, sky, tufts } from './scenery';

const W = 1180;
const H = 820;

const BRICK = '#e3c274';
const CREAM = '#f4e8c8';
const WHITE = '#fbf9f1';
const GLASS = '#a9c4d8';
const ROOF = '#c4694c';
const STONE = '#d9d3c4';
const FLAGS = ['#d6533f', '#f0c64a', '#5b8fc4', '#6fa45a', '#e8896c'];

/** A string of bunting hung along a gentle curve through `pts`, with `n` flags. */
function bunting(pts: Pt[], n: number, seed: number, size = 1): Node[] {
  const r = rng(seed);
  const line = curve(pts, 3);
  const out: Node[] = [pen(line, { width: 1.8, breaks: 0.1 })];
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const k = Math.min(line.length - 2, Math.floor(t * (line.length - 1)));
    const [x, y] = line[k];
    const [x2, y2] = line[k + 1];
    const len = Math.hypot(x2 - x, y2 - y) || 1;
    const ux = (x2 - x) / len;
    const uy = (y2 - y) / len;
    const hw = 11 * size;
    const flag: Pt[] = [[x - ux * hw, y - uy * hw], [x + ux * hw, y + uy * hw], [x + (r() - 0.5) * 3, y + 27 * size]];
    out.push(wash(flag, FLAGS[(i + Math.floor(seed)) % FLAGS.length], { lineWidth: 1.4, depth: 0.4, bloom: false, wobble: 0.5 }));
  }
  return out;
}

/** A window: white frame, glass with a glint, cross bars and a sill. Top left at (x, y). */
function window(x: number, y: number, w: number, h: number, seed: number): Node[] {
  return [
    wash(rect(x - 7, y - 7, w + 14, h + 14, 3), WHITE, { lineWidth: 2, depth: 0.2, bloom: false, wobble: 0.6 }),
    wash(rect(x, y, w, h, 2), GLASS, { hatch: 8, light: -140, depth: 0.35, lineWidth: 1.6, wobble: 0.5 }),
    blot([[x + 8, y + 8], [x + w * 0.45, y + 8], [x + 8, y + h * 0.5]], '#f1f7fb', 0.75),
    pen([[x + w / 2, y], [x + w / 2, y + h]], { width: 3.2, color: '#7d7566', breaks: 0 }),
    pen([[x, y + h * 0.45], [x + w, y + h * 0.45]], { width: 3.2, color: '#7d7566', breaks: 0 }),
    wash(rect(x - 12, y + h + 5, w + 24, 10, 3), STONE, { lineWidth: 1.6, bloom: false, wobble: 0.5 }),
    ...(seed % 2 ? [blot(ellipse(x + w * 0.5, y + h - 2, w * 0.3, 7), '#fff', 0.5)] : []),
  ];
}

/** One brick-wall block: a fat rounded stone with a darker underside and a few strokes. */
function block(x: number, y: number, w: number, h: number, i: number): Node[] {
  const tone = [BRICK, paler(BRICK, 0.18), deeper(BRICK, 0.1), '#e8cd8a'][i % 4];
  return [wash(rect(x, y, w, h, 9), tone, { lineWidth: 1.8, hatch: i % 3 === 0 ? 6 : false, light: -110, depth: 0.3, wobble: 1.4 })];
}

/** The big plain wall: ten rows of rough blocks, x −60 to `right`, y 200 to 600. */
function oldWall(right: number): Node[] {
  const r = rng(404);
  const out: Node[] = [
    // behind-the-wall mortar and a darker top
    wash(rect(-60, 200, right + 60, 400), deeper(BRICK, 0.25), { line: false, shade: false, bloom: false, wobble: 0 }),
  ];
  const rowH = 40;
  let n = 0;
  for (let row = 0; row < 10; row++) {
    const y = 214 + row * rowH - (row === 0 ? 0 : 0);
    let x = -60 - (row % 2 ? 40 : 0) - r() * 20;
    while (x < right) {
      const w = 84 + r() * 36;
      const x1 = Math.min(x + w, right);
      if (x1 - x > 20) out.push(...block(x + 3, y + 2, x1 - x - 5, rowH - 5, n++));
      x += w;
    }
  }
  // the coping along the top: a long darker band of flat capstones
  out.push(wash(rect(-60, 196, right + 70, 22, 6), deeper(BRICK, 0.2), { lineWidth: 2.2, hatch: 8, light: -90, depth: 0.4, wobble: 1.2 }));
  for (let x = -20; x < right; x += 92 + r() * 20) out.push(pen([[x, 198], [x + 2, 216]], { width: 1.6, breaks: 0 }));
  // the wall's foot in shadow
  out.push(blot(curve([[-60, 585], [right, 585], [right, 612], [-60, 612]], 1), '#8f7440', 0.35));
  return out;
}

/** A dandelion: a toothed leaf rosette, a stem and a yellow head (or a white clock). */
function dandelion(x: number, y: number, s = 1, clock = false): Node[] {
  return [
    pen([[x - 16 * s, y], [x - 8 * s, y - 9 * s], [x, y]], { width: 2, color: '#4f7a30', breaks: 0 }),
    pen([[x + 16 * s, y], [x + 8 * s, y - 8 * s], [x, y]], { width: 2, color: '#4f7a30', breaks: 0 }),
    pen([[x, y], [x + 3 * s, y - 24 * s], [x + 2 * s, y - 38 * s]], { width: 1.8, color: '#5d8a3a', breaks: 0 }),
    wash(ellipse(x + 2 * s, y - 42 * s, 8 * s, 7 * s), clock ? '#f4f1e6' : '#f2c733', { lineWidth: 1.4, depth: 0.4, bloom: false, wobble: 0.5 }),
  ];
}

/** A weedy tuft growing out of a crack at the wall's foot. */
function weeds(x: number, y: number, s = 1, seed = 5): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  for (let i = 0; i < 7; i++) {
    const lean = (i - 3) * 9 * s + (r() - 0.5) * 8;
    out.push(pen([[x + (i - 3) * 2, y], [x + lean * 0.5, y - 20 * s], [x + lean, y - (30 + r() * 20) * s]], { width: 2.2, color: i % 2 ? '#5f8a3a' : '#7a9a45', breaks: 0 }));
  }
  return out;
}

// ---------------------------------------------------------------------------

/**
 * The garden of the Children's Hospital.
 *
 *   old wall        x −60–640, coping y 196–218, foot y ~600; its PLAIN face is
 *                   x 200–520, y 260–480 (no weeds, nothing): a bird-house
 *                   (280 × 300) is fixed there, centre about (360, 370)
 *   hospital        x 640–1240, roof y ~70–125, ground y 600
 *   balcony         floor y 420, slab y 420–458, x 640–1180; the open French
 *                   window behind is x 840–965, y 215–420
 *   railing prop    place at x 640, y 330
 *   open ground     x 120–640, feet y 630–660 (lawn and a sandy path)
 */
const hospitalGarden = cached(() =>
  svg({ w: W, h: H, name: 'bears-hospital-garden' }, pageNodes(W, H, 'bears-hospital-garden', [
    ...sky(300),
    blot(ellipse(1085, 40, 150, 90), '#fff3c2', 0.55),
    blot(ellipse(1085, 40, 80, 50), '#fff9dc', 0.7),
    ...cloud(820, 70, 0.55, 31),
    ...cloud(330, 150, 0.6, 32),
    // trees and bushes peeping over the wall
    ...bush(80, 215, 1.2, 111),
    ...bush(560, 205, 1.0, 112),
    // lawn behind everything, then the wall
    ground0(),
    ...oldWall(646),
    // the hospital: a cream front, a plinth and a red-tiled roof
    wash(rect(640, 120, 640, 482), CREAM, { light: -110, depth: 0.08, lineWidth: 2.4, wobble: 1 }),
    wash(rect(636, 560, 650, 44), deeper(CREAM, 0.15), { hatch: 7, light: -90, depth: 0.3, lineWidth: 2, wobble: 1 }),
    // the wall's end meets the hospital in a shadowy corner
    blot(rect(626, 130, 34, 470), '#a58a52', 0.35),
    wash([[626, 124], [1260, 124], [1280, 72], [690, 66]], ROOF, { hatch: 7, light: -90, depth: 0.35, lineWidth: 2.4, wobble: 1 }),
    wash(rect(626, 116, 650, 14), deeper(ROOF, 0.15), { lineWidth: 2, bloom: false, wobble: 0.8 }),
    // upstairs windows either side, the red cross over the door
    ...window(690, 166, 70, 100, 1),
    ...window(1060, 166, 70, 100, 2),
    wash(rect(870, 142, 70, 48, 4), WHITE, { lineWidth: 2, depth: 0.2, bloom: false, wobble: 0.6 }),
    wash([[897, 148], [913, 148], [913, 158], [923, 158], [923, 174], [913, 174], [913, 184], [897, 184], [897, 174], [887, 174], [887, 158], [897, 158]], '#d6533f', { lineWidth: 1.4, depth: 0.3, bloom: false, wobble: 0.4 }),
    // the open French window: dark room, a pale curtain, a door leaf swung out
    wash(rect(836, 214, 134, 210, 3), WHITE, { lineWidth: 2.2, depth: 0.2, bloom: false, wobble: 0.6 }),
    wash(rect(846, 222, 114, 198, 2), '#9a8a74', { hatch: 7, light: -90, depth: 0.5, lineWidth: 1.8, wobble: 0.5 }),
    wash(curve([[850, 224], [884, 224], [880, 300], [888, 418], [850, 418]], 1), '#f3e1d4', { shade: '#d8c0b0', light: 180, depth: 0.3, lineWidth: 1.4, bloom: false, wobble: 0.8 }),
    wash([[960, 222], [1004, 236], [1004, 410], [960, 420]], WHITE, { lineWidth: 2, depth: 0.25, bloom: false, wobble: 0.6 }),
    wash([[966, 234], [996, 244], [996, 330], [966, 332]], GLASS, { hatch: 8, lineWidth: 1.4, bloom: false, wobble: 0.5 }),
    // downstairs windows
    ...window(690, 488, 80, 70, 1),
    ...window(1040, 488, 80, 70, 2),
    // the balcony: floor, a darker deck behind the rail, and the slab's front
    wash(rect(640, 410, 540, 14), '#cfc4a8', { lineWidth: 2, depth: 0.3, bloom: false, wobble: 0.8 }),
    wash(rect(632, 420, 556, 38, 4), STONE, { hatch: 7, light: -90, depth: 0.45, lineWidth: 2.2, wobble: 0.8 }),
    blot(curve([[640, 458], [1180, 458], [1180, 478], [640, 478]], 1), '#8f7f64', 0.35),
    // bunting being hung across the front, and a tail of it along the wall
    ...bunting([[646, 134], [780, 156], [900, 140]], 9, 3, 0.9),
    ...bunting([[900, 140], [1040, 162], [1180, 136]], 9, 8, 0.9),
    ...bunting([[646, 304], [760, 326], [872, 308]], 7, 6, 0.8),
    // the lawn in front of the hospital, shrubs and a flower bed
    ground(596, GRASS, { amp: 6, seed: 120 }),
    ...bush(720, 590, 0.55, 113),
    ...bush(1130, 590, 0.55, 114),
    ...[[790, 596], [850, 602], [910, 596], [970, 602]].map(([x, y], i) =>
      wash(ellipse(x, y, 14, 11), ['#e8896c', '#f0c64a', '#e9b6c9', '#fbf9f1'][i], { lineWidth: 1.4, depth: 0.4, bloom: false, wobble: 0.5 })),
    // the path across the front and the grass
    path(380, 720, 612),
    ...tufts(40, 280, 640, 5, 130),
    ...tufts(780, 1160, 650, 6, 131),
    // the wall's foot: weeds and dandelions at its ends, the middle kept plain
    ...weeds(60, 604, 1, 141),
    ...dandelion(110, 606, 1),
    ...dandelion(150, 610, 0.8, true),
    ...weeds(590, 604, 1, 142),
    ...dandelion(548, 606, 1),
    ...dandelion(626, 610, 0.9),
    ...tufts(0, 200, 612, 4, 132, LEAF_DARK),
    ...tufts(520, 640, 612, 3, 133, LEAF_DARK),
  ])),
);

/** The lawn behind the wall's foot, so the wall stands on grass. */
function ground0(): Node {
  return wash(rect(-60, 560, 1300, 340), paler(GRASS, 0.1), { light: -90, depth: 0.08, line: false, wobble: 0 });
}

// ---------------------------------------------------------------------------

/**
 * The balcony railing, 560 × 200, transparent between the bars. Top rail at
 * y 4–18, bars to y 90, the stone slab y 90–128 (so, placed at (640, 330),
 * the rail top is y 334 and the slab's top is the balcony floor line, y 420).
 */
const hospitalBalcony = cached(() => {
  const bars: Node[] = [];
  for (let x = 20; x <= 530; x += 26) {
    bars.push(wash(rect(x - 3.5, 14, 7, 80, 3), WHITE, { lineWidth: 1.5, depth: 0.5, light: -170, bloom: false, wobble: 0.4, hatch: false }));
  }
  const posts: Node[] = [];
  for (const x of [6, 273, 540]) {
    posts.push(wash(rect(x - 8, 10, 16, 84, 4), WHITE, { lineWidth: 2, depth: 0.45, light: -170, bloom: false, wobble: 0.5 }));
    posts.push(wash(ellipse(x, 6, 11, 11), WHITE, { lineWidth: 2, depth: 0.4, bloom: false, wobble: 0.5 }));
  }
  return svg({ w: 560, h: 200, name: 'bears-hospital-balcony' }, [
    ...bars,
    wash(rect(0, 70, 546, 9, 3), WHITE, { lineWidth: 1.8, depth: 0.5, light: -90, bloom: false, wobble: 0.5 }),
    wash(rect(-4, 4, 556, 15, 7), WHITE, { lineWidth: 2.2, depth: 0.5, light: -90, bloom: false, wobble: 0.6 }),
    ...posts,
    // bunting tied along the top rail, sagging between the posts
    ...bunting([[6, 16], [140, 38], [273, 18]], 9, 3, 1),
    ...bunting([[273, 18], [406, 38], [540, 16]], 9, 8, 1),
    // the stone slab, its shadow, and a bracket under each post
    wash(rect(-14, 90, 574, 38, 4), STONE, { hatch: 7, light: -90, depth: 0.45, lineWidth: 2.2, wobble: 0.8 }),
    wash([[-4, 128], [60, 128], [20, 168], [-4, 168]], STONE, { lineWidth: 1.8, depth: 0.4, bloom: false, wobble: 0.6 }),
    wash([[250, 128], [296, 128], [273, 160]], STONE, { lineWidth: 1.8, depth: 0.4, bloom: false, wobble: 0.6 }),
    wash([[500, 128], [554, 128], [554, 168], [530, 168]], STONE, { lineWidth: 1.8, depth: 0.4, bloom: false, wobble: 0.6 }),
    () => `<g class="pc" opacity="0.2"><path d="M-10 128H554V140H-10Z" fill="${INK}"/></g>`,
  ]);
});

export const hospital: Record<string, () => string> = {
  'hospital-garden': hospitalGarden,
  'hospital-balcony': hospitalBalcony,
};
