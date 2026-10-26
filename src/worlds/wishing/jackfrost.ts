/**
 * Jack Frost: the cheeky, skinny sprite of ice who rules the Land of Winter.
 *
 * Spiky white-silver hair that sticks out like a crown of icicles, a pale
 * frost-blue face with bright blue cheeks, little pointed ears, and a narrow
 * silver-blue tunic with pointed ice shoulders and frost-fern patterns
 * stitched down it. His arms are thin and his fingers long. He is mischievous
 * and never cruel: the frost is a game, and he is only lonely.
 *
 * Poses (the portrait itself is the cheeky smirk):
 *   laugh  head thrown back, wide eyes, a big open "hee hee hee".
 *   sulk   arms folded across his chest, worried brows, a small frown.
 *   happy  a red woolly scarf wound round his neck (one end hangs down his
 *          front), and a delighted smile. For after Mollie's present.
 *
 * Parts: figure, head, eyes, lids, brows, mouth, mouthOpen, armL, armR.
 * Both arms swing from the shoulder; in `sulk` they are drawn crossed over
 * the chest, so raising one still looks like a flourish.
 */
import { C } from '../../art/palette';
import { cached, curve, dot, ellipse, ink, piece, poly, type Node, type Pt } from '../../art/paper';
import { arm, CUT, cx, cy, FLAT, person, type EyeStyle, type BrowStyle, type MouthStyle } from '../faraway/parts';

type Mood = 'cheeky' | 'laugh' | 'sulk' | 'happy';

const SKIN = '#dfeaf3';
const SKIN_SHADE = '#b7cde0';
const CHEEK = '#8fc2e8';
const HAIR = '#f2f6fb';
const HAIR_SHADE = '#a9bdd2';
const TUNIC = '#6f93b6';
const TUNIC_DARK = '#4c6f94';
const FERN = '#e4f0fa';
const SILVER = '#c9d6e3';
const SCARF = C.coatRed;
const SCARF_STRIPE = '#f1e4c4';
const FACE: [number, number] = [50, 62];

/** A spiky fan of icicle-hair spikes round the head, behind it. */
function hairBack(): Node[] {
  const spikes: [number, number, number][] = [
    // [base angle in degrees from straight up, length, half-width]
    [-84, 92, 15],
    [-62, 112, 16],
    [-40, 126, 16],
    [-18, 138, 17],
    [6, 144, 17],
    [28, 134, 17],
    [50, 120, 16],
    [72, 104, 16],
    [90, 80, 14],
  ];
  const out: Node[] = [piece(ellipse(cx, cy - 14, 58, 54), HAIR)];
  for (const [deg, len, hw] of spikes) {
    const a = ((deg - 90) * Math.PI) / 180;
    const bx = cx + Math.cos(a) * 46;
    const by = cy - 12 + Math.sin(a) * 50;
    const tip: Pt = [cx + Math.cos(a) * (46 + len * 0.62), cy - 12 + Math.sin(a) * (50 + len * 0.62)];
    const nx = -Math.sin(a);
    const ny = Math.cos(a);
    out.push(piece(poly([[bx + nx * hw, by + ny * hw], tip, [bx - nx * hw, by - ny * hw]]), HAIR, { edge: 'cut', rough: 0.8 }));
    out.push(ink([[bx, by], [tip[0] - Math.cos(a) * 6, tip[1] - Math.sin(a) * 6]], { width: 2, color: HAIR_SHADE, opacity: 0.8, wobble: 0.3 }));
  }
  return out;
}

/** A little frost fern: a stem with leaf-ticks either side. */
function fern(x: number, y: number, len: number, lean: number): Node[] {
  const out: Node[] = [ink([[x, y], [x + lean, y + len]], { width: 2.4, color: FERN, wobble: 0.2 })];
  for (let i = 1; i < 5; i++) {
    const t = i / 5;
    const px = x + lean * t;
    const py = y + len * t;
    const l = 15 * (1 - t * 0.5);
    out.push(ink([[px, py], [px - l, py - 9]], { width: 1.8, color: FERN, wobble: 0.1 }));
    out.push(ink([[px, py], [px + l, py - 9]], { width: 1.8, color: FERN, wobble: 0.1 }));
  }
  return out;
}

/** Long thin fingers, as ink lines fanning out from a wrist point. */
function fingers(x: number, y: number, dx: number, dy: number): Node {
  const [ux, uy] = [dx, dy];
  const lines: Node[] = [-0.5, -0.17, 0.17, 0.5].map((s) =>
    ink([[x, y], [x + ux * 24 - uy * s * 14, y + uy * 24 + ux * s * 14], [x + ux * 36 - uy * s * 26, y + uy * 36 + ux * s * 26]], { width: 4, color: SKIN_SHADE, wobble: 0.2 }),
  );
  return (ctx) => lines.map((l) => l(ctx)).join('');
}

function draw(mood: Mood, name: string, label: string): string {
  const laugh = mood === 'laugh';
  const sulk = mood === 'sulk';
  const happy = mood === 'happy';

  const eyes: EyeStyle = laugh ? 'round' : sulk ? 'round' : happy ? 'big' : 'narrow';
  const brows: BrowStyle = laugh ? 'raised' : sulk ? 'worried' : happy ? 'raised' : 'cross';
  const mouth: MouthStyle = laugh ? 'beam' : sulk ? 'frown' : happy ? 'smile' : 'grin';

  // --- a narrow tunic with pointed ice shoulders
  const shoulders: Node[] = [
    piece(poly([[62, 262], [30, 232], [58, 238], [98, 236]]), SILVER, { edge: 'cut', fibre: false }),
    piece(poly([[238, 262], [270, 232], [242, 238], [202, 236]]), SILVER, { edge: 'cut', fibre: false }),
  ];
  const tunic: Node[] = [
    // a thin neck, then the long narrow tunic
    piece(poly([[cx - 16, 190], [cx + 16, 190], [cx + 18, 250], [cx - 18, 250]]), SKIN, { fibre: false }),
    piece(curve([[70, 345], [72, 280], [100, 244], [150, 238], [200, 244], [228, 280], [230, 345]], 2), TUNIC),
    piece(poly([[108, 244], [150, 340], [192, 244], [150, 250]]), TUNIC_DARK, { edge: 'cut', fibre: false, shadow: false, opacity: 0.5 }),
    // a pale pointed collar
    piece(poly([[104, 240], [150, 286], [196, 240], [182, 232], [150, 256], [118, 232]]), SILVER, CUT),
    ...fern(104, 272, 62, -6),
    ...fern(196, 272, 62, 6),
    ...fern(150, 296, 44, 0),
    ...[[120, 318], [180, 318], [150, 330]].map(([x, y]) => dot(x, y, 3.2, FERN, 0.9)),
    ...shoulders,
  ];

  // --- the red scarf (happy): a thick band round the neck and one end hanging
  const scarf: Node[] = happy
    ? [
        piece(curve([[cx - 52, 206], [cx - 40, 232], [cx, 244], [cx + 40, 232], [cx + 52, 206], [cx + 40, 196], [cx, 206], [cx - 40, 196]], 2), SCARF),
        ...[-34, -14, 8, 28].map((x) => ink([[cx + x, 206 + Math.abs(x) * 0.2], [cx + x + 6, 238 - Math.abs(x) * 0.2]], { width: 4, color: SCARF_STRIPE, wobble: 0.2 })),
        // the hanging end, with fringe
        piece(poly([[cx + 12, 232], [cx + 46, 226], [cx + 56, 330], [cx + 20, 336]]), SCARF),
        ink([[cx + 22, 250], [cx + 52, 246]], { width: 4, color: SCARF_STRIPE }),
        ink([[cx + 24, 290], [cx + 54, 286]], { width: 4, color: SCARF_STRIPE }),
        ...[0, 1, 2, 3, 4].map((i) => ink([[cx + 22 + i * 7, 334], [cx + 22 + i * 7, 352]], { width: 3, color: SCARF, wobble: 0.2 })),
      ]
    : [];

  // --- arms: thin sleeves, long pale fingers
  const arms: Node[] = sulk
    ? [
        // folded across the chest: each arm reaches over to the other side
        arm('armR', { from: [232, 268], via: [262, 318], to: [128, 306], sleeve: TUNIC, cuff: SILVER, hand: false, width: 24 }),
        arm('armL', { from: [68, 268], via: [38, 322], to: [176, 322], sleeve: TUNIC, cuff: SILVER, hand: false, width: 24 }),
      ]
    : laugh
      ? [
          // one hand up by the head, one on his tummy, shaking with laughing
          arm('armL', { from: [68, 268], via: [30, 290], to: [58, 224], sleeve: TUNIC, cuff: SILVER, hand: SKIN, width: 24, holding: [fingers(58, 224, 0, -1)] }),
          arm('armR', { from: [232, 268], via: [262, 292], to: [206, 300], sleeve: TUNIC, cuff: SILVER, hand: SKIN, width: 24, holding: [fingers(206, 300, -1, 0.2)] }),
        ]
      : [
          arm('armL', { from: [68, 268], via: [46, 304], to: [54, 336], sleeve: TUNIC, cuff: SILVER, hand: SKIN, width: 24, holding: [fingers(54, 336, -0.1, 1)] }),
          arm('armR', { from: [232, 268], via: [254, 304], to: [246, 336], sleeve: TUNIC, cuff: SILVER, hand: SKIN, width: 24, holding: [fingers(246, 336, 0.1, 1)] }),
        ];

  // --- the spiky fringe over the forehead, and frost on the cheeks
  const fringe: Node[] = [
    piece(poly([[cx - 52, cy - 36], [cx - 40, cy - 78], [cx - 26, cy - 44], [cx - 14, cy - 88], [cx, cy - 46], [cx + 14, cy - 92], [cx + 26, cy - 44], [cx + 40, cy - 76], [cx + 52, cy - 36], [cx + 30, cy - 24], [cx, cy - 34], [cx - 30, cy - 24]]), HAIR, { edge: 'cut', rough: 0.8 }),
    ink([[cx - 40, cy - 70], [cx - 33, cy - 40]], { width: 1.8, color: HAIR_SHADE, opacity: 0.8, wobble: 0.2 }),
    ink([[cx + 14, cy - 82], [cx + 8, cy - 46]], { width: 1.8, color: HAIR_SHADE, opacity: 0.8, wobble: 0.2 }),
  ];
  const frostSpecks: Node[] = [
    ...[[-46, 14], [-54, 28], [-36, 38], [46, 14], [54, 28], [36, 38]].map(([dx, dy]) => dot(cx + dx, cy + dy, 2.4, '#ffffff', 0.8)),
  ];

  return person({
    name,
    label,
    skin: SKIN,
    face: FACE,
    ears: 'pointy',
    neck: false,
    eyes,
    eyeCol: '#4f9bd6',
    eyeDx: 24,
    eyeY: -2,
    brows,
    browCol: '#8ea8c4',
    browY: -20,
    nose: 'pointy',
    noseCol: 'rgba(80,120,160,0.45)',
    mouth,
    mouthY: 36,
    cheeks: CHEEK,
    behindHead: hairBack(),
    body: [...tunic, ...scarf],
    onHead: [piece(ellipse(cx, cy + 40, 36, 12), SKIN_SHADE, { ...FLAT, opacity: 0.35 })],
    front: [...frostSpecks, ...fringe],
    arms,
  });
}

/** Jack Frost, cheeky: a sly smirk, narrowed eyes, brows slanted down. */
export const jackFrost = cached((): string => draw('cheeky', 'wishing-jack-frost', 'Jack Frost'));

/** Laughing his icy laugh: wide eyes, brows up, a big open mouth, a hand to his head. */
export const jackFrostLaugh = cached((): string => draw('laugh', 'wishing-jack-frost-laugh', 'Jack Frost laughing'));

/** Sulking: arms folded across his chest, worried brows, a small frown. */
export const jackFrostSulk = cached((): string => draw('sulk', 'wishing-jack-frost-sulk', 'Jack Frost sulking'));

/** Happy, in Mollie's red woolly scarf, with a delighted smile. */
export const jackFrostHappy = cached((): string => draw('happy', 'wishing-jack-frost-happy', 'Jack Frost in a red scarf'));
