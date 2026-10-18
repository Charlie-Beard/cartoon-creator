/**
 * The Grindylow (book 3; original art): a small, pale-green water demon,
 * cheeky rather than nasty. Round head with two little sharp bone horns, big
 * round yellow eyes, a very wide grin of tiny teeth, webbed frill-ears and
 * very long, spindly, knobbly fingers. It pops up out of the water, so it is
 * drawn from the chest up and the body fades away at the bottom edge (a
 * mask on the chest only; the arms and fingers stay solid).
 *
 * Parts: figure (everything), head (origin 150, 230), lids, mouth,
 * mouthOpen (the usual), and armR: the long reaching arm, origin at the
 * shoulder (204, 248), ending in `fingers` (a child group, origin at the
 * wrist: 250, 262 in the normal drawing, 252, 184 in the giggling pose) so
 * the fingers can curl and let go. The fingers hang down and out to the
 * right, a grab at an ankle: their hooked tips sit about x 262-292, y 320-336.
 *
 * Pose `giggling` (same box, same parts): ticklish! Eyes squeezed shut into
 * happy arches, mouth wide open in a giggle, a few joy tears, and the right
 * arm thrown up with the fingers spread wide open.
 *
 * Layout in the 300 × 340 box: face inside 78 62 144 144 (eyes at y 128,
 * grin at y 170-205), horn tips at y 52, shoulders at y 236-250, and the
 * chest fades out below y 270 to nothing at the bottom edge. Left arm hangs
 * loose at x 30-100.
 */
import { C } from '../../../art/palette';
import { band, circle, curve, dot, ellipse, group, ink, piece, poly, svg, type Node, type Pt } from '../../../art/paper';
import { H, W } from './people';

const SKIN = '#9cc59a';
const SKIN_DARK = '#7fab84';
const SKIN_LIGHT = '#c9e0b4';
const KNUCKLE = '#6f9e76';
const HORN = '#efe6c8';
const HORN_DARK = '#cdbf98';
const IRIS = '#e8d86a';
const BLUSH = '#e8a79a';
const TEAR = '#a9cfe6';

/** Fades its children out towards the bottom edge, like a body sinking into the water. */
const fadeBottom =
  (id: string, children: Node[]): Node =>
  (ctx) =>
    `<defs><linearGradient id="${id}-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0.74" stop-color="#fff"/><stop offset="0.99" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
    `<mask id="${id}-m" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="url(#${id}-g)"/></mask></defs>` +
    `<g mask="url(#${id}-m)">${children.map((c) => c(ctx)).join('')}</g>`;

/**
 * A hand of five long, knobbly fingers fanning out from the wrist `w`.
 * `base` is the middle finger's direction in radians (svg: 0 = right, π/2 = down),
 * `spread` the angle between fingers, `curl` how much each joint bends (hooked
 * when more than 0), `scale` the finger length.
 */
function hand(w: Pt, base: number, spread: number, curl: number, scale = 1): Node[] {
  const lens = [46, 68, 78, 70, 52];
  const out: Node[] = [];
  lens.forEach((len, i) => {
    let a = base + (i - 2) * spread;
    let [x, y] = w;
    const pts: Pt[] = [[x, y]];
    const seg = (len * scale) / 3;
    const joints: Pt[] = [];
    for (let s = 0; s < 3; s++) {
      a += curl;
      x += Math.cos(a) * seg;
      y += Math.sin(a) * seg;
      pts.push([x, y]);
      if (s < 2) joints.push([x, y]);
    }
    out.push(piece(band(pts, 8), SKIN, { edge: 'cut', fibre: false }));
    joints.forEach(([jx, jy]) => out.push(piece(circle(jx, jy, 5.6), KNUCKLE, { edge: 'cut', fibre: false, shadow: false })));
    const [tx, ty] = pts[3];
    out.push(piece(circle(tx, ty, 4.2), SKIN_LIGHT, { edge: 'cut', fibre: false, shadow: false }));
  });
  // the palm, over the finger roots
  out.push(piece(circle(w[0], w[1], 12), SKIN, { edge: 'cut', fibre: false }));
  return out;
}

/** Points along a grin: corners at (cx ± half, y0), dipping by `dip` in the middle. */
function grin(cx: number, y0: number, half: number, dip: number, n = 13): Pt[] {
  return Array.from({ length: n }, (_, i) => {
    const u = (i / (n - 1)) * 2 - 1;
    return [cx + u * half, y0 + dip * (1 - u * u)] as Pt;
  });
}

function mouthShape(gap: number, tongue: boolean): Node[] {
  const top = grin(150, 168, 54, 24);
  const bottom = grin(150, 168, 54, 24 + gap).reverse();
  const nodes: Node[] = [piece(poly([...top, ...bottom]), C.redDark, { edge: 'cut', fibre: false, shadow: false })];
  if (tongue) nodes.push(piece(ellipse(150, 168 + 24 + gap * 0.72, 22, gap * 0.26), C.rose, { edge: 'clean', fibre: false, shadow: false }));
  // tiny sharp teeth hanging from the top lip
  for (let i = 0; i < 7; i++) {
    const u = -0.78 + i * 0.26;
    const x = 150 + u * 54;
    const y = 168 + 24 * (1 - u * u);
    nodes.push(piece(poly([[x - 4.5, y - 1], [x + 4.5, y - 1], [x, y + 8.5]]), C.white, { edge: 'clean', fibre: false, shadow: false }));
  }
  // a couple on the bottom lip when it is open wide
  if (gap > 20) {
    for (const u of [-0.5, 0.5]) {
      const x = 150 + u * 54;
      const y = 168 + 24 * (1 - u * u) + gap * (1 - u * u);
      nodes.push(piece(poly([[x - 4, y + 1], [x + 4, y + 1], [x, y - 7]]), C.white, { edge: 'clean', fibre: false, shadow: false }));
    }
  }
  return nodes;
}

function draw(giggle: boolean): string {
  const eye = (x: number): Node[] => [
    piece(circle(x, 128, 21), C.white, { edge: 'cut', fibre: false }),
    piece(circle(x + 3, 131, 13), IRIS, { edge: 'clean', fibre: false, shadow: false }),
    piece(circle(x + 4, 132, 7), C.ink, { edge: 'clean', fibre: false, shadow: false }),
    dot(x + 1, 127, 3.4, C.white),
  ];
  // a happy squeezed-shut arch (the giggle) and its mirror use the same lines
  const arch = (x: number): Node => ink([[x - 18, 134], [x - 8, 118], [x + 8, 118], [x + 18, 134]], { width: 5, color: C.ink });

  const lids: Node[] = [118, 182].flatMap((x) => [
    piece(circle(x, 128, 22.5), SKIN, { edge: 'cut', fibre: false, shadow: false }),
    ink([[x - 16, 130], [x, 138], [x + 16, 130]], { width: 3, color: SKIN_DARK }),
  ]);

  // ---- the long reaching arm ----
  const armR = giggle
    ? group({ part: 'armR', origin: [204, 248] }, [
        piece(band([[204, 250], [244, 228], [254, 196]], 15), SKIN),
        piece(circle(244, 228, 7), KNUCKLE, { edge: 'cut', fibre: false, shadow: false }),
        group({ part: 'fingers', origin: [252, 184] }, hand([252, 184], -1.38, 0.4, -0.02, 0.82)),
      ])
    : group({ part: 'armR', origin: [204, 248] }, [
        piece(band([[204, 250], [236, 244], [250, 262]], 15), SKIN),
        piece(circle(238, 245, 7), KNUCKLE, { edge: 'cut', fibre: false, shadow: false }),
        group({ part: 'fingers', origin: [250, 262] }, hand([250, 262], 1.2, 0.2, 0.26)),
      ]);

  // ---- the left arm: loose, one spindly hand dangling by its side ----
  const armL = [
    piece(band([[98, 250], [64, 262], [52, 290]], 15), SKIN),
    piece(circle(66, 262, 7), KNUCKLE, { edge: 'cut', fibre: false, shadow: false }),
    ...hand([52, 290], giggle ? 2.2 : 1.9, giggle ? 0.34 : 0.22, giggle ? 0 : 0.2, 0.52),
  ];

  const body = fadeBottom(`grindylow${giggle ? 'g' : ''}`, [
    piece(curve([[56, 346], [66, 262], [100, 238], [150, 228], [200, 238], [236, 262], [248, 346]], 2), SKIN),
    piece(curve([[96, 346], [104, 282], [150, 262], [196, 282], [204, 346]], 2), SKIN_LIGHT, { fibre: false }),
    // little frill ridges across the shoulders and a few spots
    piece(poly([[84, 252], [96, 232], [106, 250]]), SKIN_DARK, { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[194, 250], [204, 232], [216, 252]]), SKIN_DARK, { edge: 'cut', fibre: false, shadow: false }),
    ...[[82, 296], [220, 292], [128, 300], [174, 306], [100, 322], [204, 326]].map(([x, y]) =>
      piece(circle(x, y, 5), SKIN_DARK, { edge: 'cut', fibre: false, shadow: false }),
    ),
  ]);

  const nodes: Node[] = [
    group({ part: 'figure' }, [
      body,
      ...armL,
      armR,
      group({ part: 'head', origin: [150, 230] }, [
        // little sharp horns, behind the head
        piece(poly([[100, 100], [92, 52], [134, 82]]), HORN, { edge: 'cut' }),
        piece(poly([[200, 100], [208, 52], [166, 82]]), HORN, { edge: 'cut' }),
        piece(poly([[100, 98], [95, 62], [118, 88]]), HORN_DARK, { edge: 'cut', fibre: false, shadow: false }),
        piece(poly([[200, 98], [205, 62], [182, 88]]), HORN_DARK, { edge: 'cut', fibre: false, shadow: false }),
        // webbed frill-ears
        piece(poly([[80, 132], [38, 104], [46, 134], [34, 160], [82, 168]]), SKIN_DARK),
        piece(poly([[220, 132], [262, 104], [254, 134], [266, 160], [218, 168]]), SKIN_DARK),
        piece(poly([[78, 136], [52, 120], [58, 138], [50, 152], [80, 160]]), SKIN_LIGHT, { fibre: false, shadow: false }),
        piece(poly([[222, 136], [248, 120], [242, 138], [250, 152], [220, 160]]), SKIN_LIGHT, { fibre: false, shadow: false }),
        // the head: wide and round
        piece(curve([[76, 140], [84, 88], [150, 66], [216, 88], [224, 140], [206, 198], [150, 214], [94, 198]], 2), SKIN),
        piece(circle(150, 88, 7), SKIN_DARK, { edge: 'cut', fibre: false, shadow: false }),
        piece(circle(126, 94, 4.5), SKIN_DARK, { edge: 'cut', fibre: false, shadow: false }),
        piece(circle(176, 96, 5), SKIN_DARK, { edge: 'cut', fibre: false, shadow: false }),
        // rosy cheeks
        piece(ellipse(92, 168, 14, 9), BLUSH, { edge: 'cut', fibre: false, shadow: false, opacity: 0.6 }),
        piece(ellipse(208, 168, 14, 9), BLUSH, { edge: 'cut', fibre: false, shadow: false, opacity: 0.6 }),

        // eyes
        ...(giggle ? [arch(118), arch(182)] : [...eye(118), ...eye(182)]),
        group({ part: 'lids', opacity: 0 }, giggle ? [arch(118), arch(182)] : lids),
        // cheeky brows: one cocked
        ...(giggle
          ? [ink([[98, 104], [118, 96], [136, 102]], { width: 4, color: SKIN_DARK }), ink([[164, 102], [182, 96], [202, 104]], { width: 4, color: SKIN_DARK })]
          : [ink([[96, 100], [116, 88], [138, 98]], { width: 4.5, color: SKIN_DARK }), ink([[164, 104], [184, 100], [204, 108]], { width: 4.5, color: SKIN_DARK })]),
        // two little nostrils
        piece(ellipse(144, 154, 3, 4), SKIN_DARK, { edge: 'clean', fibre: false, shadow: false }),
        piece(ellipse(156, 154, 3, 4), SKIN_DARK, { edge: 'clean', fibre: false, shadow: false }),

        // the wide grin: closed-ish ... and open
        group({ part: 'mouth', ...(giggle ? {} : {}) }, mouthShape(giggle ? 34 : 9, giggle)),
        group({ part: 'mouthOpen', opacity: 0 }, mouthShape(giggle ? 46 : 32, true)),
        // dimples at the corners of the grin
        ink([[92, 164], [96, 174]], { width: 3, color: SKIN_DARK }),
        ink([[208, 164], [204, 174]], { width: 3, color: SKIN_DARK }),
        ...(giggle
          ? [
              // tears of laughter
              piece(poly([[92, 142], [98, 142], [95, 154]]), TEAR, { edge: 'clean', fibre: false, shadow: false }),
              piece(poly([[202, 142], [208, 142], [205, 154]]), TEAR, { edge: 'clean', fibre: false, shadow: false }),
            ]
          : []),
      ]),
    ]),
  ];
  return svg(
    { w: W, h: H, name: giggle ? 'hogwarts-grindylow-giggling' : 'hogwarts-grindylow', label: 'the Grindylow', className: 'portrait' },
    nodes,
  );
}

export const grindylow = (): string => draw(false);
export const grindylowGiggling = (): string => draw(true);
