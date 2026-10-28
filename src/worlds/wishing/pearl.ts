/**
 * Pearl: a young mermaid of the sunny cove, about eight. Gentle and a bit
 * dreamy, never cross. Our own paper mermaid: long wavy dark-brown hair with
 * three tiny pale shells in it, warm light skin, rosy cheeks, a coral-pink
 * scalloped top, a single pearl on a string at her neck, and a turquoise tail
 * whose scales are little ink scallops. (No red hair, no purple top, no green
 * tail.) Drawn at Mollie's scale and line weight, with the shared `person()`.
 *
 * Her tail comes up from the bottom of the picture and CURLS UP beside her on
 * the right, ending in a fanned fin at about (250-290, 200-240). The cartoons
 * hide the bottom of her behind the cove rock, so the fin is the bit that
 * shows: flick it with the `tail` part (it pivots at the bend, (225, 330)).
 *
 * Poses (the portrait is her worried self, hair in a tangle):
 *   portrait  hair in a tangle (loops and wisps, a strand of green seaweed
 *             caught in it), worried brows, a small unhappy mouth, hands
 *             wringing low at (122, 300) and (178, 300).
 *   sad       the same tangle, with blue tears on her cheeks and a wobbly
 *             downturned mouth; hands clasped low at (140, 312).
 *   sing      hair combed SMOOTH and shining, eyes shut, mouth open in a round
 *             "oh", hands together at her chest (150, 282).
 *   happy     hair combed smooth and shining, a big smile, both arms up.
 *
 * Parts: figure, head, eyes, lids, brows, mouth, mouthOpen, armL, armR, hair
 * (the hair behind the head and the shells), tail. In `sing` and `happy` the
 * eyes are drawn shut, so `eyes` is a pair of curved lashes.
 */
import { C } from '../../art/palette';
import { band, cached, circle, curve, dot, ellipse, group, ink, piece, poly, type Node, type Pt } from '../../art/paper';
import { arm, CUT, cx, cy, FLAT, fluff, person, ring, type BrowStyle, type EyeStyle, type MouthStyle } from '../faraway/parts';

type Mood = 'plain' | 'sad' | 'sing' | 'happy';

const SKIN = '#f6d3b4';
const HAIR = '#4e2f1e';
const HAIR_LIGHT = '#7a4d33';
const HAIR_DARK = '#33200f';
const SHEEN = '#c99a76';
const TOP = '#f28a7a';
const TOP_LIGHT = '#f8b0a2';
const TAIL = '#2fb3b0';
const TAIL_DARK = '#1b8a90';
const TAIL_LIGHT = '#86dcd2';
const WEED = '#4f9a5a';
const SHELL = '#f3e6d6';
const TEAR = '#7ec0ea';

/** A tiny pale scallop shell: a half-fan with ribs. */
function shell(x: number, y: number, r: number, rot = 0): Node[] {
  const pts: Pt[] = [];
  for (let i = 0; i <= 6; i++) {
    const a = ((rot + 180 + i * 30) * Math.PI) / 180;
    pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]);
  }
  const ribs = [1, 3, 5].map((i): Node => ink([[x, y], pts[i]], { width: 1.2, color: '#c9a98c', opacity: 0.9 }));
  return [piece(poly([[x, y + 2], ...pts]), SHELL, CUT), ...ribs];
}

/** Rows of little ink scallops (scales) over an area, in the tail's dark teal. */
function scales(x0: number, y0: number, cols: number, rows: number, step = 14): Node[] {
  const out: Node[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = x0 + c * step + (r % 2 ? step / 2 : 0);
      const y = y0 + r * (step * 0.7);
      out.push(ink([[x - 5, y], [x, y + 5], [x + 5, y]], { width: 1.6, color: TAIL_DARK, opacity: 0.85 }));
    }
  }
  return out;
}

/** The hair behind and beside the face, falling past her shoulders: neat, or in a tangle. */
function hairBack(smooth: boolean): Node[] {
  if (smooth) {
    return [
      group({ part: 'hair', origin: [cx, 90] }, [
        // long, neat waves, one curtain each side
        piece(curve([[104, 70], [66, 96], [46, 150], [50, 210], [38, 262], [48, 312], [84, 318], [90, 270], [86, 216], [100, 150]], 2), HAIR),
        piece(curve([[196, 70], [230, 96], [244, 150], [240, 210], [246, 262], [242, 312], [216, 318], [210, 270], [214, 216], [200, 150]], 2), HAIR),
        piece(ellipse(cx, cy - 22, 62, 54), HAIR),
        // wave lines and a soft sheen
        ink([[66, 120], [58, 170], [68, 214], [60, 262], [66, 300]], { width: 3, color: HAIR_LIGHT, opacity: 0.8 }),
        ink([[228, 120], [234, 170], [226, 214], [232, 262], [228, 300]], { width: 3, color: HAIR_LIGHT, opacity: 0.8 }),
        ink([[78, 150], [74, 190], [82, 232], [76, 270]], { width: 2.2, color: HAIR_DARK, opacity: 0.6 }),
        ink([[222, 150], [226, 190], [218, 232], [224, 270]], { width: 2.2, color: HAIR_DARK, opacity: 0.6 }),
        piece(ellipse(62, 196, 5, 36), SHEEN, { ...FLAT, opacity: 0.55 }),
        piece(ellipse(232, 196, 5, 36), SHEEN, { ...FLAT, opacity: 0.55 }),
        // tips curling neatly
        ink([[52, 306], [60, 322], [76, 316]], { width: 4, color: HAIR }),
        ink([[240, 306], [234, 322], [220, 316]], { width: 4, color: HAIR }),
        ...shell(70, 112, 8, -20),
        ...shell(228, 150, 7, 15),
        ...shell(56, 230, 7, -10),
      ]),
    ];
  }
  return [
    group({ part: 'hair', origin: [cx, 90] }, [
      // the same long hair, but bunched and wild: lumpy edges, tufts sticking out
      fluff([[104, 70], [60, 96], [34, 150], [40, 214], [28, 270], [50, 318], [86, 300], [92, 230], [96, 150]], HAIR, 11),
      fluff([[196, 70], [232, 96], [248, 150], [240, 214], [246, 270], [240, 318], [214, 300], [208, 230], [204, 150]], HAIR, 9),
      piece(ellipse(cx, cy - 22, 64, 56), HAIR),
      fluff([[36, 120], [14, 134], [22, 166], [46, 156]], HAIR, 7),
      fluff([[240, 100], [262, 100], [262, 130], [240, 134]], HAIR, 7),
      fluff([[36, 232], [14, 250], [28, 280], [52, 262]], HAIR, 7),
      // loops and snarls in the ink
      ink(ring(60, 192, 14, 16), { width: 2.6, color: HAIR_DARK, opacity: 0.8 }),
      ink(ring(230, 176, 12, 16), { width: 2.6, color: HAIR_DARK, opacity: 0.8 }),
      ink(ring(70, 262, 11, 14), { width: 2.4, color: HAIR_LIGHT, opacity: 0.9 }),
      ink([[48, 130], [38, 168], [62, 196], [42, 238]], { width: 2.6, color: HAIR_DARK, opacity: 0.7 }),
      ink([[240, 130], [246, 172], [226, 204], [238, 244]], { width: 2.6, color: HAIR_DARK, opacity: 0.7 }),
      // a strand of green seaweed caught in it, hanging down the left
      ink([[84, 96], [64, 150], [86, 196], [60, 244], [76, 286]], { width: 6, color: WEED, wobble: 0.6 }),
      ink([[80, 110], [70, 140]], { width: 2, color: '#7dc17f', opacity: 0.9 }),
      ...shell(76, 108, 8, -20),
      ...shell(228, 140, 7, 15),
      ...shell(46, 226, 7, -10),
    ]),
  ];
}

/** The hair over the forehead: a neat side sweep, or messy wisps. */
function fringe(smooth: boolean): Node[] {
  if (smooth) {
    return [
      piece(curve([[88, 112], [92, 80], [124, 62], [160, 62], [204, 80], [212, 112], [188, 88], [150, 84], [112, 98]], 2), HAIR),
      ink([[104, 82], [138, 72], [182, 80]], { width: 3, color: SHEEN, opacity: 0.8 }),
    ];
  }
  return [
    fluff([[92, 112], [96, 86], [122, 80], [128, 100], [110, 112]], HAIR, 6),
    fluff([[130, 92], [148, 72], [176, 82], [172, 102], [148, 106]], HAIR, 6),
    fluff([[178, 98], [196, 80], [214, 100], [206, 118], [186, 110]], HAIR, 6),
    ink([[112, 82], [100, 56], [118, 44]], { width: 3, color: HAIR }),
    ink([[160, 70], [168, 44], [188, 40], [190, 56]], { width: 3, color: HAIR }),
    ink([[198, 88], [220, 66], [236, 76]], { width: 3, color: HAIR }),
  ];
}

/** Her turquoise tail: curls up beside her on the right, fin fanned at the top (the `tail` part). */
function tail(): Node {
  return group({ part: 'tail', origin: [225, 330] }, [
    // the curl, up from the bend to the fin
    piece(band([[196, 336], [240, 328], [264, 296], [268, 256]], 36), TAIL),
    piece(band([[262, 296], [268, 252]], 24), TAIL, { edge: 'cut', fibre: false, shadow: false }),
    // the fin: a fan of three lobes
    piece(curve([[256, 256], [240, 220], [244, 186], [262, 204], [274, 174], [290, 204], [304, 186], [300, 230], [284, 258]], 2), TAIL_LIGHT),
    ink([[268, 252], [250, 202]], { width: 2, color: TAIL_DARK, opacity: 0.8 }),
    ink([[272, 252], [274, 192]], { width: 2, color: TAIL_DARK, opacity: 0.8 }),
    ink([[276, 252], [298, 206]], { width: 2, color: TAIL_DARK, opacity: 0.8 }),
    ...scales(214, 308, 3, 3, 14),
    ...scales(252, 270, 1, 3, 12),
  ]);
}

function draw(mood: Mood, name: string, label: string): string {
  const smooth = mood === 'sing' || mood === 'happy';
  const eyes: EyeStyle = mood === 'sing' ? 'shut' : mood === 'happy' ? 'happy' : 'big';
  const brows: BrowStyle = mood === 'plain' || mood === 'sad' ? 'worried' : mood === 'happy' ? 'raised' : 'kind';
  const mouth: MouthStyle = mood === 'plain' ? 'frown' : mood === 'sad' ? 'frown' : mood === 'sing' ? 'o' : 'beam';

  const body: Node[] = [
    // bare shoulders, then the coral top with a scalloped edge, then the tail's body below it
    piece(curve([[56, 345], [62, 270], [100, 234], [150, 228], [200, 234], [238, 270], [244, 345]], 2), SKIN),
    piece(curve([[62, 345], [66, 306], [88, 284], [150, 284], [212, 284], [234, 306], [238, 345]], 2), TAIL),
    ...scales(86, 312, 9, 3, 16),
    piece(curve([[66, 314], [70, 270], [108, 252], [150, 262], [192, 252], [230, 270], [234, 314], [150, 324]], 2), TOP),
    ...[96, 124, 150, 176, 204].map((x, i) => piece(circle(x, 262 + (i % 2 ? 2 : -2) + (i === 2 ? 4 : 0), 14), TOP_LIGHT, { ...FLAT, opacity: 0.9 })),
    ...[96, 124, 150, 176, 204].map((x, i) => ink([[x - 9, 268 + (i === 2 ? 4 : 0)], [x, 256 + (i === 2 ? 4 : 0)], [x + 9, 268 + (i === 2 ? 4 : 0)]], { width: 1.8, color: TOP, opacity: 0.9 })),
    tail(),
  ];

  // --- the arms: bare, narrow, skin-coloured
  const A = { sleeve: SKIN, hand: SKIN, width: 22 } as const;
  let arms: Node[];
  if (mood === 'sing') {
    arms = [
      arm('armL', { from: [70, 262], via: [74, 302], to: [146, 284], ...A }),
      arm('armR', { from: [230, 262], via: [226, 302], to: [154, 284], ...A }),
    ];
  } else if (mood === 'happy') {
    arms = [
      arm('armL', { from: [70, 262], via: [34, 222], to: [38, 150], ...A }),
      arm('armR', { from: [230, 262], via: [240, 214], to: [244, 146], ...A }),
    ];
  } else if (mood === 'sad') {
    arms = [
      arm('armL', { from: [70, 262], via: [70, 306], to: [132, 314], ...A }),
      arm('armR', { from: [230, 262], via: [230, 306], to: [148, 314], ...A }),
    ];
  } else {
    arms = [
      arm('armL', { from: [70, 262], via: [62, 304], to: [122, 300], ...A }),
      arm('armR', { from: [230, 262], via: [236, 304], to: [178, 300], ...A }),
    ];
  }

  // --- the pearl on its string, and (when sad) the tears
  const extra: Node[] = [
    ink([[124, 218], [136, 238], [150, 244], [164, 238], [176, 218]], { width: 1.8, color: '#a8845c' }),
    piece(circle(150, 249, 6.5), '#fbf5ea', CUT),
    dot(148, 246.5, 2, C.white, 0.9),
  ];
  const front: Node[] = [...fringe(smooth)];
  if (mood === 'sad') {
    for (const [x, y] of [[cx - 36, cy + 28], [cx + 38, cy + 30]] as const) {
      front.push(piece(poly([[x, y - 10], [x + 6, y + 2], [x, y + 8], [x - 6, y + 2]]), TEAR, { ...FLAT, opacity: 0.95 }));
      front.push(dot(x - 1.5, y + 1, 1.6, C.white, 0.8));
    }
    front.push(piece(poly([[cx - 34, cy + 44], [cx - 29, cy + 53], [cx - 34, cy + 58], [cx - 39, cy + 53]]), TEAR, { ...FLAT, opacity: 0.95 }));
    front.push(piece(poly([[cx + 36, cy + 46], [cx + 41, cy + 55], [cx + 36, cy + 60], [cx + 31, cy + 55]]), TEAR, { ...FLAT, opacity: 0.95 }));
  }
  // blink lids (hidden): a closed lash line over each eye
  const eyeY = cy + 2;
  front.push(
    group({ part: 'lids', opacity: 0 }, [-26, 26].flatMap((dx): Node[] => [
      piece(ellipse(cx + dx, eyeY, 15, 14), SKIN, FLAT),
      ink([[cx + dx - 12, eyeY + 1], [cx + dx, eyeY + 6], [cx + dx + 12, eyeY + 1]], { width: 2.8, color: C.ink }),
    ])),
  );

  return person({
    name,
    label,
    skin: SKIN,
    face: [56, 62],
    ears: false,
    eyes,
    eyeCol: '#2f8fa6',
    eyeDx: 26,
    eyeY: 2,
    noBlink: true,
    brows,
    browCol: HAIR_DARK,
    browY: -22,
    nose: 'button',
    mouth,
    mouthY: 40,
    cheeks: C.rose,
    behindHead: hairBack(smooth),
    body,
    front,
    arms,
    extra,
  });
}

/** Pearl in her usual worried state: hair in a tangle, a small unhappy mouth. */
export const pearl = cached((): string => draw('plain', 'wishing-pearl', 'Pearl'));

/** Sad: tangled hair, blue tears on her cheeks, a wobbly downturned mouth. */
export const pearlSad = cached((): string => draw('sad', 'wishing-pearl-sad', 'Pearl, sad'));

/** Singing: hair combed smooth and shining, eyes shut, a round "oh", hands at her chest. */
export const pearlSing = cached((): string => draw('sing', 'wishing-pearl-sing', 'Pearl singing'));

/** Happy: hair combed smooth, a big smile, both arms up. */
export const pearlHappy = cached((): string => draw('happy', 'wishing-pearl-happy', 'Pearl, happy'));

