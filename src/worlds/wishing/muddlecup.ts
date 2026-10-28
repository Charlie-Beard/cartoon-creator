/**
 * Mrs Muddlecup: keeper of the Land of Lost Things, where everything anyone
 * loses ends up, filed on a towering wobbly pile.
 *
 * A thin, bird-like little old lady (nothing like round Dabble): a long
 * pointy nose, rosy cheeks, a tall untidy silver cottage-loaf bun with two
 * pencils stuck through it and a brown luggage label tied on with string, a
 * plum-and-mustard checked shawl over a dark bottle-green dress, and a tape
 * measure round her neck. Her running joke: she has "lost" her half-moon
 * gold spectacles, and they are pushed up on top of her head all along.
 *
 * The spectacles are two parts. `specs` sits on her head, in front of the
 * bun. `specsOn` is the same pair sitting on her nose over her eyes, hidden
 * (opacity 0): fade `specs` out and `specsOn` in when they are put on her.
 *
 * Poses (the plain portrait is her fussy, busy self, a luggage label held up):
 *   fluster  both hands flapping by her cheeks, brows up, a round "oh!".
 *   cross    arms folded, brows down, a stern little frown, nose in the air.
 *   beam     arms flung wide, a huge smile, happy eyes.
 *
 * Parts: figure, head, eyes, lids, brows, mouth, mouthOpen, armL, armR,
 * specs, specsOn.
 */
import { C } from '../../art/palette';
import { band, cached, circle, curve, ellipse, group, ink, piece, poly, type Node, type Pt } from '../../art/paper';
import { arm, CUT, cx, cy, FLAT, person, torso, type BrowStyle, type EyeStyle, type MouthStyle } from '../faraway/parts';

type Mood = 'busy' | 'fluster' | 'cross' | 'beam';

const SKIN = '#f1c9ab';
const DRESS = '#2c4a3b';
const PLUM = '#7b3a63';
const MUSTARD = '#dfa930';
const HAIR = '#d6d7db';
const HAIR_SHADE = '#a9abb8';
const CREAM = '#efe3c8';
const GOLD = '#e2b13a';
const TAPE = '#ecc94b';
const LABEL = '#c99a5b';
const EYE_Y = 4;

/** Is (x, y) inside the outline? */
function inside(pts: Pt[], x: number, y: number): boolean {
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

/** The shawl: plum, checked with mustard, a pointed hem. The check lines are cut to its outline. */
function shawl(): Node[] {
  const out = curve([[38, 322], [46, 272], [84, 240], [128, 230], [150, 264], [172, 230], [216, 240], [254, 272], [262, 322], [232, 304], [198, 316], [172, 298], [150, 326], [128, 298], [102, 316], [68, 304]], 2);
  const nodes: Node[] = [piece(out, PLUM)];
  const lines: Node[] = [];
  const run = (horizontal: boolean, k: number): void => {
    let start: number | null = null;
    for (let t = 20; t <= 340; t += 3) {
      const ok = horizontal ? inside(out, t, k) : inside(out, k, t);
      if (ok && start === null) start = t;
      if ((!ok || t >= 339) && start !== null) {
        const end = t - 3;
        if (end - start > 6) lines.push(ink(horizontal ? [[start + 3, k], [end - 2, k]] : [[k, start + 3], [k, end - 2]], { width: 2.4, color: MUSTARD, opacity: 0.85, wobble: 0.15 }));
        start = null;
      }
    }
  };
  for (const y of [252, 272, 292, 312]) run(true, y);
  for (let x = 54; x < 260; x += 20) run(false, x);
  // a thin darker line halfway between, to make it a proper check
  for (const y of [262, 282, 302]) run(true, y);
  nodes.push(...lines.map((n) => n));
  return nodes;
}

/** A tape measure hung round the neck, both ends dangling, with tick marks. */
function tapeMeasure(): Node[] {
  const ticks: Node[] = [];
  for (let i = 0; i < 5; i++) ticks.push(ink([[cx - 28 + i * 3, 262 + i * 11], [cx - 21 + i * 3, 262 + i * 11]], { width: 1.6, color: C.ink, opacity: 0.7, wobble: 0.1 }));
  return [
    piece(band([[cx - 24, 218], [cx - 22, 244], [cx - 16, 262], [cx - 18, 318]], 9), TAPE, { edge: 'cut', fibre: false }),
    piece(band([[cx + 24, 218], [cx + 20, 240], [cx + 14, 256], [cx + 20, 300]], 9), TAPE, { edge: 'cut', fibre: false }),
    ...ticks,
    piece(poly([[cx - 22, 316], [cx - 12, 316], [cx - 12, 328], [cx - 22, 328]]), '#b9852e', FLAT),
  ];
}

/** A long, thin, pointy nose with a rosy tip, a shade darker than the face. */
function nose(): Node[] {
  return [
    piece(curve([[cx - 5, cy + 2], [cx + 4, cy + 6], [cx + 14, cy + 28], [cx + 22, cy + 38], [cx + 8, cy + 42], [cx - 6, cy + 38]], 1), '#eab796', CUT),
    ink([[cx + 5, cy + 8], [cx + 16, cy + 30], [cx + 21, cy + 38]], { width: 2, color: '#b97f5c', opacity: 0.7, wobble: 0.2 }),
    ink([[cx - 4, cy + 38], [cx + 8, cy + 41]], { width: 2.2, color: '#b97f5c', opacity: 0.7, wobble: 0.2 }),
    piece(circle(cx + 17, cy + 37, 5), '#ee8a84', { ...FLAT, opacity: 0.6 }),
  ];
}

/** A pencil laid from (x1, y1) (the rubber end) to (x2, y2) (the sharp end). */
function pencil(x1: number, y1: number, x2: number, y2: number): Node[] {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const at = (t: number): Pt => [x1 + ux * t, y1 + uy * t];
  return [
    piece(band([at(0), at(10)], 9), '#e58a8a', FLAT),
    piece(band([at(10), at(len - 12)], 8), '#e6b93a', FLAT),
    ink([at(12), at(len - 14)], { width: 1.4, color: '#b98a1f', wobble: 0.1 }),
    piece(poly([[at(len - 12)[0] - uy * 4, at(len - 12)[1] + ux * 4], [at(len - 12)[0] + uy * 4, at(len - 12)[1] - ux * 4], at(len)]), '#e8cfa6', FLAT),
    piece(poly([[at(len - 4)[0] - uy * 1.6, at(len - 4)[1] + ux * 1.6], [at(len - 4)[0] + uy * 1.6, at(len - 4)[1] - ux * 1.6], at(len)]), C.ink, FLAT),
  ];
}

/** A luggage label: a tag with a punched hole, a loop of string and a few scribbled lines. `top` is the hole. */
function label(x: number, y: number, deg: number, scale = 1): Node[] {
  const a = (deg * Math.PI) / 180;
  const rot = (px: number, py: number): Pt => [x + (px * Math.cos(a) - py * Math.sin(a)) * scale, y + (px * Math.sin(a) + py * Math.cos(a)) * scale];
  return [
    ink([rot(0, 6), rot(-9, -10), rot(2, -22), rot(10, -8), rot(0, 6)], { width: 1.8, color: '#8a6a3c', wobble: 0.2 }),
    piece(poly([rot(-13, 8), rot(13, 8), rot(15, 22), rot(15, 52), rot(-15, 52), rot(-15, 22)]), LABEL, CUT),
    piece(circle(...rot(0, 18), 3), '#6e4f2a', FLAT),
    ink([rot(-8, 30), rot(8, 30)], { width: 1.8, color: '#6e4f2a', opacity: 0.8, wobble: 0.2 }),
    ink([rot(-8, 37), rot(5, 37)], { width: 1.8, color: '#6e4f2a', opacity: 0.8, wobble: 0.2 }),
    ink([rot(-8, 44), rot(8, 44)], { width: 1.8, color: '#6e4f2a', opacity: 0.8, wobble: 0.2 }),
  ];
}

/** One half-moon lens: flat top at y, curved bottom `d` below it, `w` wide, centred on x. */
function halfMoon(x: number, y: number, w: number, d: number): Pt[] {
  const pts: Pt[] = [[x - w / 2, y], [x + w / 2, y]];
  for (let i = 1; i < 12; i++) {
    const t = (i / 12) * Math.PI;
    pts.push([x + Math.cos(t) * (w / 2), y + Math.sin(t) * d]);
  }
  return pts;
}

/** The spectacles: two gold half-moon rims (flat on top), a bridge, a glint. `ty` is the flat top. */
function spectacles(part: 'specs' | 'specsOn', ty: number, opacity?: number): Node {
  const w = 40;
  const d = 25;
  const lens = (x: number): Node[] => {
    const pts = halfMoon(x, ty, w, d);
    return [
      piece(pts, '#dff1ff', { ...FLAT, opacity: 0.34 }),
      ink(pts, { width: 4.4, color: '#b98717', wobble: 0.1, closed: true }),
      ink(pts, { width: 2.4, color: GOLD, wobble: 0.1, closed: true }),
      ink([[x - w / 2 + 6, ty + 9], [x - w / 2 + 11, ty + 15]], { width: 2.4, color: C.white, opacity: 0.9, wobble: 0 }),
    ];
  };
  const kids: Node[] = [
    ...lens(cx - 24),
    ...lens(cx + 24),
    ink([[cx - 5, ty + 1], [cx, ty - 3], [cx + 5, ty + 1]], { width: 3.4, color: '#b98717', wobble: 0.1 }),
    ink([[cx - 44, ty + 1], [cx - 52, ty + 8]], { width: 2.8, color: '#b98717', wobble: 0.1 }),
    ink([[cx + 44, ty + 1], [cx + 52, ty + 8]], { width: 2.8, color: '#b98717', wobble: 0.1 }),
    piece(ellipse(cx - 31, ty + 7, 5, 2, 30), C.white, { ...FLAT, opacity: 0.6 }),
    piece(ellipse(cx + 17, ty + 7, 5, 2, 30), C.white, { ...FLAT, opacity: 0.6 }),
  ];
  return group({ part, origin: [cx, ty + 10], opacity }, kids);
}

function draw(mood: Mood, name: string, labelText: string): string {
  const fluster = mood === 'fluster';
  const cross = mood === 'cross';
  const beam = mood === 'beam';

  const eyes: EyeStyle = beam ? 'happy' : 'round';
  const brows: BrowStyle = fluster ? 'raised' : cross ? 'cross' : beam ? 'raised' : 'worried';
  const mouth: MouthStyle = fluster ? 'o' : cross ? 'frown' : beam ? 'beam' : 'pinched';

  const body: Node[] = [
    torso(DRESS, -4, 236),
    // a cream collar and a little gold brooch at the neck
    piece(poly([[cx - 26, 222], [cx + 26, 222], [cx + 16, 250], [cx, 258], [cx - 16, 250]]), CREAM, CUT),
    ...shawl(),
    piece(circle(cx, 262, 6), GOLD, CUT),
    piece(circle(cx, 262, 2.6), '#b98717', FLAT),
  ];

  // --- hair: a silver cap over the head, a cottage-loaf bun, wisps, pencils and a label on a string
  const hair: Node[] = [
    // side wisps down by the ears
    piece(curve([[cx - 47, cy - 22], [cx - 56, cy - 4], [cx - 52, cy + 18], [cx - 44, cy + 2], [cx - 42, cy - 18]], 2), HAIR, CUT),
    piece(curve([[cx + 47, cy - 22], [cx + 56, cy - 4], [cx + 52, cy + 18], [cx + 44, cy + 2], [cx + 42, cy - 18]], 2), HAIR, CUT),
    // the loaf: a fat lower roll and a smaller one on top, leaning a little
    piece(ellipse(cx - 2, cy - 84, 48, 25, -4), HAIR, CUT),
    piece(ellipse(cx + 6, cy - 114, 31, 20, 8), HAIR, CUT),
    ink([[cx - 36, cy - 84], [cx - 8, cy - 94], [cx + 30, cy - 90]], { width: 2, color: HAIR_SHADE, wobble: 0.4, opacity: 0.8 }),
    ink([[cx - 14, cy - 112], [cx + 8, cy - 120], [cx + 28, cy - 112]], { width: 2, color: HAIR_SHADE, wobble: 0.4, opacity: 0.8 }),
    // the cap of hair on her head, a soft widow's-peak hairline
    piece(curve([[cx - 47, cy - 18], [cx - 46, cy - 52], [cx - 26, cy - 70], [cx, cy - 76], [cx + 26, cy - 70], [cx + 46, cy - 52], [cx + 47, cy - 18], [cx + 36, cy - 36], [cx + 14, cy - 44], [cx, cy - 36], [cx - 14, cy - 44], [cx - 36, cy - 36]], 2), HAIR, CUT),
    ink([[cx - 34, cy - 40], [cx - 30, cy - 58]], { width: 1.8, color: HAIR_SHADE, wobble: 0.3, opacity: 0.8 }),
    ink([[cx + 34, cy - 40], [cx + 30, cy - 58]], { width: 1.8, color: HAIR_SHADE, wobble: 0.3, opacity: 0.8 }),
    // a few stray wisps escaping the loaf
    ink([[cx + 30, cy - 98], [cx + 46, cy - 106], [cx + 44, cy - 94]], { width: 2, color: HAIR_SHADE, wobble: 0.3 }),
    ink([[cx - 36, cy - 100], [cx - 50, cy - 90], [cx - 44, cy - 78]], { width: 2, color: HAIR_SHADE, wobble: 0.3 }),
    // two pencils stuck through the bun, and a label tied on with string
    ...pencil(cx - 52, cy - 98, cx + 26, cy - 72),
    ...pencil(cx - 22, cy - 130, cx + 46, cy - 96),
    ink([[cx + 30, cy - 80], [cx + 52, cy - 62], [cx + 58, cy - 48]], { width: 2, color: '#8a6a3c', wobble: 0.3 }),
    ...label(cx + 58, cy - 50, -12, 0.75),
  ];

  // --- wrinkly little laughter lines at the eyes, and a bit of shadow under the nose
  const lines: Node[] = [
    ink([[cx - 52, cy + 2], [cx - 46, cy + 6]], { width: 1.5, color: '#b78a6c', opacity: 0.7, wobble: 0.2 }),
    ink([[cx + 52, cy + 2], [cx + 46, cy + 6]], { width: 1.5, color: '#b78a6c', opacity: 0.7, wobble: 0.2 }),
    ink([[cx - 22, cy + 52], [cx - 16, cy + 46]], { width: 1.5, color: '#b78a6c', opacity: 0.6, wobble: 0.2 }),
    ink([[cx + 22, cy + 52], [cx + 16, cy + 46]], { width: 1.5, color: '#b78a6c', opacity: 0.6, wobble: 0.2 }),
  ];

  const sleeve = DRESS;
  const cuff = CREAM;
  const arms: Node[] = [];
  if (fluster) {
    arms.push(
      arm('armL', { from: [66, 268], via: [28, 244], to: [88, 178], sleeve, cuff, hand: SKIN, width: 28, handR: 15 }),
      arm('armR', { from: [234, 268], via: [272, 244], to: [212, 178], sleeve, cuff, hand: SKIN, width: 28, handR: 15 }),
    );
  } else if (cross) {
    arms.push(
      arm('armL', { from: [66, 270], via: [70, 326], to: [180, 304], sleeve, cuff, hand: SKIN, width: 28 }),
      arm('armR', { from: [234, 270], via: [230, 334], to: [118, 318], sleeve, cuff, hand: SKIN, width: 28 }),
    );
  } else if (beam) {
    arms.push(
      arm('armL', { from: [66, 268], via: [24, 262], to: [8, 218], sleeve, cuff, hand: SKIN, width: 28 }),
      arm('armR', { from: [234, 268], via: [276, 262], to: [292, 218], sleeve, cuff, hand: SKIN, width: 28 }),
    );
  } else {
    arms.push(
      arm('armL', { from: [66, 268], via: [46, 306], to: [58, 336], sleeve, cuff, hand: SKIN, width: 28 }),
      arm('armR', { from: [234, 268], via: [268, 262], to: [258, 214], sleeve, cuff, hand: SKIN, width: 28, holding: label(258, 218, 6, 1) }),
    );
  }

  // a thin, bird-like face: narrow at the chin
  const head = curve([[cx - 46, cy - 18], [cx - 42, cy - 54], [cx, cy - 66], [cx + 42, cy - 54], [cx + 46, cy - 18], [cx + 38, cy + 30], [cx + 14, cy + 60], [cx, cy + 64], [cx - 14, cy + 60], [cx - 38, cy + 30]], 2);

  return person({
    name,
    label: labelText,
    skin: SKIN,
    face: [46, 62],
    headShape: head,
    ears: true,
    neck: SKIN,
    eyes,
    eyeCol: '#4a6a7c',
    eyeDx: 22,
    eyeY: EYE_Y,
    brows,
    browCol: HAIR_SHADE,
    browY: -22,
    nose: 'none',
    mouth,
    mouthY: 49,
    cheeks: '#ee8a84',
    body,
    onHead: [...hair, ...lines, ...nose()],
    front: [spectacles('specs', cy - 64), spectacles('specsOn', cy - 8, 0)],
    arms,
    extra: tapeMeasure(),
    tilt: cross ? -5 : undefined,
  });
}

/** Mrs Muddlecup, fussy and busy, holding up a luggage label. */
export const muddlecup = cached((): string => draw('busy', 'wishing-muddlecup', 'Mrs Muddlecup'));

/** In a flap: both hands by her cheeks, brows up, a round "oh!". */
export const muddlecupFluster = cached((): string => draw('fluster', 'wishing-muddlecup-fluster', 'Mrs Muddlecup in a flap'));

/** Cross: arms folded, brows down, nose in the air. */
export const muddlecupCross = cached((): string => draw('cross', 'wishing-muddlecup-cross', 'Mrs Muddlecup, cross'));

/** Beaming: arms flung wide, a huge smile. */
export const muddlecupBeam = cached((): string => draw('beam', 'wishing-muddlecup-beam', 'Mrs Muddlecup, beaming'));
