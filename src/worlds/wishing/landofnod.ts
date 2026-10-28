/**
 * The Land of Nod at twilight, and the Sandman's sack.
 *
 * The backdrop is soft and dreamy, never dark: a violet-to-dusky-rose sky with
 * a few small pale stars; a BIG sleepy crescent moon at the upper right (its
 * crescent spans x 903-1060, y 78-242, the thick part on the right, with one
 * closed curved eye and a little smile at about (1030, 140-190) and a tiny
 * nightcap on its upper tip); far lavender pillow-hills; and plump quilted
 * hills at the left (to about x 330) and right (from about x 850) carrying
 * little floppy NIGHTCAP HOUSES with bobbles, round glowing yellow windows
 * and round doors: two at the left, two at the right, two of them small
 * and far away (bases about (372, 566) and (838, 562)). Stitched seam lines
 * and button tufts mark the hills like a quilt.
 *
 * Ground line y 640 (a soft lavender pillow meadow). The open ground is
 * x 260-900: nothing tall there, only low far hills (top y 540) behind faces
 * (y 380-560), kept in mid-tones. The bottom band (y 690+) is plain soft
 * ground.
 *
 * The prop `sand-sack` (220 x 240) is the Sandman's sack of sleepy-sand,
 * slumped and burst; see the comments by it.
 */
import { cached, circle, curve, dot, ellipse, group, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../art/paper';

const flat = { edge: 'cut' as const, fibre: false as const, shadow: false };
const soft = { edge: 'torn' as const, rough: 1.4, fibre: false as const, shadow: false };

/** A button tuft: a little pale button with a dimple, and four pinched seam lines. */
function tuft(x: number, y: number, s: number, col: string): Node[] {
  return [
    ink([[x - 16 * s, y - 5 * s], [x, y]], { width: 2, color: col, wobble: 0.2, opacity: 0.6 }),
    ink([[x + 16 * s, y - 5 * s], [x, y]], { width: 2, color: col, wobble: 0.2, opacity: 0.6 }),
    ink([[x - 14 * s, y + 7 * s], [x, y]], { width: 2, color: col, wobble: 0.2, opacity: 0.6 }),
    ink([[x + 14 * s, y + 7 * s], [x, y]], { width: 2, color: col, wobble: 0.2, opacity: 0.6 }),
    piece(circle(x, y, 5 * s), '#f3e6f0', flat),
    dot(x, y, 1.4 * s, '#8a6fa8', 0.8),
  ];
}

/** Short ink stitches along a polyline (no dashes in ink, so each stitch is a tiny line). */
function stitches(pts: Pt[], col: string, width = 2.4, opacity = 0.55): Node {
  const segs: Node[] = [];
  for (let i = 0; i + 1 < pts.length; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[i + 1];
    const len = Math.hypot(bx - ax, by - ay);
    const n = Math.max(1, Math.floor(len / 13));
    for (let j = 0; j < n; j++) {
      const t0 = j / n;
      const t1 = t0 + 0.55 / n;
      segs.push(ink([[ax + (bx - ax) * t0, ay + (by - ay) * t0], [ax + (bx - ax) * t1, ay + (by - ay) * t1]], { width, color: col, wobble: 0.15, opacity }));
    }
  }
  return (ctx) => segs.map((n) => n(ctx)).join('');
}

const seam = (pts: Pt[], col: string): Node => stitches(pts, col);

/** A house shaped like a floppy nightcap, base-middle at (x, base). `flip` flops the tip to the left. */
function nightcap(x: number, base: number, s: number, body: string, stripe: string, flip = 1): Node[] {
  const p = (px: number, py: number): Pt => [x + px * s * flip, base + py * s];
  const winY = -52;
  return [
    // soft shadow on the hill
    piece(ellipse(x, base + 3 * s, 58 * s, 8 * s), '#7c6aa6', { ...flat, opacity: 0.35 }),
    // the tall soft cone, its top flopping over to one side
    piece(curve([p(-46, 0), p(-40, -50), p(-24, -104), p(0, -142), p(34, -152), p(58, -134), p(54, -116), p(34, -120), p(18, -112), p(28, -60), p(46, 0)], 2), body, { edge: 'torn', rough: 0.7, fibre: false }),
    // a stripe round the cone and a cuff at the bottom
    piece(curve([p(-36, -66), p(-24, -104), p(2, -128), p(20, -112), p(26, -80), p(0, -92)], 2), stripe, { ...flat, edge: 'torn', rough: 0.5, opacity: 0.55 }),
    piece(curve([p(-48, 4), p(-46, -14), p(0, -20), p(46, -14), p(48, 4), p(0, 8)], 2), '#f3e6ef', { edge: 'torn', rough: 0.5, fibre: false, shadow: false }),
    // bobble on the flopped tip
    piece(circle(x + 56 * s * flip, base - 118 * s, 12 * s), '#fbf0f4', { edge: 'torn', rough: 0.5, fibre: false, shadow: false }),
    // round warm window with a glow, and a round door
    piece(circle(x, base + winY * s, 24 * s), '#ffe9a0', { ...flat, opacity: 0.3 }),
    piece(circle(x, base + winY * s, 13 * s), '#ffd96a', { edge: 'cut', fibre: false, shadow: false }),
    ink([[x - 13 * s, base + winY * s], [x + 13 * s, base + winY * s]], { width: 1.6, color: '#b88a3a', wobble: 0.1, opacity: 0.7 }),
    ink([[x, base + (winY - 13) * s], [x, base + (winY + 13) * s]], { width: 1.6, color: '#b88a3a', wobble: 0.1, opacity: 0.7 }),
    piece(curve([[x - 9 * s, base - 4 * s], [x - 9 * s, base - 22 * s], [x, base - 30 * s], [x + 9 * s, base - 22 * s], [x + 9 * s, base - 4 * s]], 2), '#8a5f86', flat),
    dot(x + 4 * s, base - 14 * s, 1.6 * s, '#ffd96a'),
  ];
}

/** A plump crescent, tips at angles +-125 degrees on the outer circle, inner circle through the tips. */
function crescent(cx: number, cy: number, R: number): Pt[] {
  const d = (a: number) => (a * Math.PI) / 180;
  const pts: Pt[] = [];
  for (let a = -125; a <= 125; a += 5) pts.push([cx + R * Math.cos(d(a)), cy + R * Math.sin(d(a))]);
  const ic = cx - 0.18 * R;
  const ir = 0.84 * R;
  for (let a = 102; a >= -102; a -= 6) pts.push([ic + ir * Math.cos(d(a)), cy + ir * Math.sin(d(a))]);
  return pts;
}

export const landOfNod = cached((): string => {
  const r = rng(909);
  const stars: Node[] = [];
  for (let i = 0; i < 22; i++) {
    const x = 20 + r() * 1140;
    const y = 16 + r() * 250;
    if (x > 840 && x < 1080 && y < 280) continue; // keep the moon clear
    stars.push(dot(x, y, 1.3 + r() * 1.4, i % 3 ? '#fff6e4' : '#ffe7b0', 0.8));
  }

  return svg({ w: 1180, h: 820, name: 'wishing-land-of-nod', boil: false, className: 'backdrop' }, [
    // the twilight sky: violet at the top, dusky rose near the hills
    piece(rect(-20, -20, 1220, 860), '#7d68b8', { edge: 'clean', shadow: false }),
    piece(rect(-20, 110, 1220, 340), '#9478c4', { ...soft, rough: 2 }),
    piece(rect(-20, 250, 1220, 300), '#b48cc8', { ...soft, rough: 2 }),
    piece(rect(-20, 380, 1220, 260), '#d49cbc', { ...soft, rough: 2 }),
    piece(rect(-20, 470, 1220, 200), '#e4b0c0', { ...soft, rough: 2, opacity: 0.8 }),
    ...stars,
    // a few soft little clouds
    piece(ellipse(330, 150, 110, 17), '#e6c6e0', { edge: 'torn', rough: 0.8, shadow: false, fibre: false, opacity: 0.6 }),
    piece(ellipse(390, 134, 66, 13), '#f1dcec', { edge: 'torn', rough: 0.8, shadow: false, fibre: false, opacity: 0.6 }),
    piece(ellipse(640, 300, 120, 16), '#ecc8dc', { edge: 'torn', rough: 0.8, shadow: false, fibre: false, opacity: 0.55 }),

    // the big sleepy crescent moon, with a halo
    piece(circle(975, 160, 170), '#fff0cc', { ...flat, opacity: 0.1 }),
    piece(circle(975, 160, 132), '#fff0cc', { ...flat, opacity: 0.14 }),
    piece(crescent(960, 160, 100), '#f7e6a8', { edge: 'torn', rough: 0.6, fibre: false, shadow: false }),
    piece(crescent(960, 160, 92), '#fff4c8', { edge: 'clean', shadow: false }),
    // face: one closed curved eye, a rosy cheek, a little smile
    ink([[1010, 140], [1026, 150], [1044, 138]], { width: 4, color: '#8a6a7a', wobble: 0.2 }),
    piece(ellipse(1038, 168, 14, 8), '#f4a8b0', { ...flat, opacity: 0.6 }),
    ink([[1018, 184], [1030, 194], [1044, 184]], { width: 3.4, color: '#8a6a7a', wobble: 0.2 }),
    // a tiny nightcap on the upper tip
    piece(poly([[886, 94], [910, 58], [930, 92]]), '#9c7fd0', { edge: 'torn', rough: 0.5, fibre: false, shadow: false }),
    piece(curve([[900, 66], [884, 56], [872, 66], [884, 70]], 2), '#9c7fd0', { edge: 'torn', rough: 0.5, fibre: false, shadow: false }),
    piece(circle(870, 66, 7), '#fbf0f4', flat),

    // far pillow-hills, low and pale
    piece(curve([[-40, 600], [40, 520], [160, 500], [300, 540], [420, 560], [560, 536], [700, 556], [830, 520], [980, 490], [1120, 520], [1220, 560], [1220, 660], [-40, 660]], 3), '#c0a4dc', { ...soft, rough: 1.2 }),
    piece(curve([[-40, 640], [100, 566], [260, 560], [420, 600], [560, 590], [720, 604], [880, 570], [1040, 560], [1220, 600], [1220, 700], [-40, 700]], 3), '#b99cd8', { ...soft, rough: 1.2 }),
    // two small, far-away nightcap houses on them
    ...nightcap(372, 566, 0.3, '#c9a8e0', '#e8b8d0'),
    ...nightcap(838, 562, 0.28, '#d0a8d8', '#c8b8ec', -1),

    // the plump hills at the left and right, with houses
    piece(ellipse(100, 750, 290, 262), '#ab8fce', { edge: 'torn', rough: 1.1, fibre: false }),
    piece(ellipse(80, 730, 240, 226), '#b99dd8', { edge: 'torn', rough: 1.1, fibre: false }),
    piece(ellipse(1080, 744, 290, 264), '#ab8fce', { edge: 'torn', rough: 1.1, fibre: false }),
    piece(ellipse(1100, 726, 240, 230), '#c0a0d8', { edge: 'torn', rough: 1.1, fibre: false }),
    // lighter, rosier pillow tops
    piece(ellipse(90, 520, 150, 30), '#d8bce8', { ...flat, opacity: 0.55 }),
    piece(ellipse(1100, 516, 150, 30), '#e8c0dc', { ...flat, opacity: 0.55 }),

    // quilt seams and button tufts on the hills
    seam([[-10, 560], [90, 590], [200, 600], [330, 636]], '#6f58a0'),
    seam([[150, 500], [170, 560], [190, 620]], '#6f58a0'),
    seam([[1190, 560], [1100, 590], [990, 600], [860, 636]], '#6f58a0'),
    seam([[1030, 500], [1016, 560], [1000, 620]], '#6f58a0'),
    ...tuft(34, 600, 1, '#6f58a0'),
    ...tuft(260, 610, 0.9, '#6f58a0'),
    ...tuft(1150, 604, 1, '#6f58a0'),
    ...tuft(910, 614, 0.9, '#6f58a0'),

    // the near houses, floppy nightcaps with bobbles
    ...nightcap(70, 556, 1.35, '#e8a6c4', '#a98ae0'),
    ...nightcap(215, 570, 0.85, '#9ec4e8', '#f0c4dc'),
    ...nightcap(1110, 546, 1.5, '#f0b4cc', '#9c86dc', -1),
    ...nightcap(975, 548, 0.8, '#ffd0a8', '#b494dc', -1),

    // the soft lavender pillow meadow: the open ground
    piece(rect(-20, 636, 1220, 200), '#c8b2e4', { ...soft, rough: 1.6 }),
    piece(rect(-20, 700, 1220, 140), '#c2aae0', { ...soft, rough: 1.4 }),
    // a few quiet seams across the meadow, well away from the bottom band
    seam([[300, 660], [520, 672], [760, 660]], '#8e76be'),
    ...tuft(420, 668, 0.8, '#8e76be'),
    ...tuft(680, 664, 0.8, '#8e76be'),
  ]);
});

/**
 * The Sandman's sack, 220 x 240: a plump oatmeal sack slumped on the ground,
 * bottom at y 236, centred at x 110. Its neck is gathered but open at the top
 * (the knot sits at about (110, 66); the mouth is at y 40-56). The sack is
 * torn low on its right side around (172, 190); a stitched patch lies under
 * the tear so the sack looks whole without it. `part: 'spill'` is the dark
 * gap, the glittery gold sand pouring out and the heap on the ground (x 150-218,
 * y 170-236). `part: 'bow'` is Mollie's blue ribbon bow round the neck,
 * hidden (opacity 0), origin at the knot (110, 66).
 */
export const sandSack = cached((): string => {
  const r = rng(31);
  const glitter: Node[] = [];
  for (let i = 0; i < 16; i++) {
    const x = 156 + r() * 58;
    const y = 214 + r() * 20;
    glitter.push(dot(x, y, 1.2 + r() * 1.4, i % 2 ? '#fffbe0' : '#ffe27a', 0.95));
  }
  for (let i = 0; i < 6; i++) glitter.push(dot(172 + r() * 18, 188 + r() * 28, 1.2 + r(), '#fffbe0', 0.95));

  return svg({ w: 220, h: 240, name: 'wishing-sand-sack', className: 'prop' }, [
    // shadow on the ground
    piece(ellipse(104, 236, 84, 8), '#6a5a86', { ...flat, opacity: 0.3 }),
    // the plump slumped body
    piece(curve([[78, 50], [66, 92], [34, 132], [24, 186], [42, 228], [108, 238], [172, 228], [194, 186], [184, 132], [152, 92], [142, 50]], 3), '#d9c496', { edge: 'torn', rough: 0.8 }),
    // a lighter lit side and a shaded base
    piece(curve([[50, 150], [60, 112], [80, 92], [78, 140], [64, 190]], 2), '#ecdcb4', { ...flat, edge: 'torn', rough: 0.6, opacity: 0.7 }),
    piece(curve([[44, 214], [108, 224], [180, 212], [172, 230], [108, 238], [44, 230]], 2), '#b49e72', { ...flat, edge: 'torn', rough: 0.6, opacity: 0.6 }),
    // the gathered neck: a ruffled mouth, open, dark inside
    piece(curve([[70, 46], [76, 36], [94, 30], [126, 30], [144, 36], [150, 46], [142, 62], [78, 62]], 2), '#d0b888', { edge: 'torn', rough: 0.8, fibre: false }),
    piece(ellipse(110, 40, 32, 9), '#7a6444', flat),
    piece(ellipse(110, 42, 24, 5), '#f2d878', { ...flat, opacity: 0.9 }),
    ink([[86, 52], [84, 64]], { width: 2.4, color: '#8a7248', wobble: 0.3 }),
    ink([[100, 54], [99, 66]], { width: 2.4, color: '#8a7248', wobble: 0.3 }),
    ink([[116, 54], [117, 66]], { width: 2.4, color: '#8a7248', wobble: 0.3 }),
    ink([[132, 52], [135, 64]], { width: 2.4, color: '#8a7248', wobble: 0.3 }),
    // seams and a patch or two in ink
    ink([[40, 138], [64, 150], [80, 176]], { width: 2.4, color: '#8a7248', wobble: 0.4, opacity: 0.8 }),
    piece(rect(56, 172, 34, 28, 3), '#c4aa76', { edge: 'torn', rough: 0.5, fibre: false, shadow: false }),
    stitches([[56, 172], [90, 172], [90, 200], [56, 200], [56, 172]], '#6e5a38', 1.8, 0.8),
    // a neat stitched patch where the tear is, so the sack looks whole without the spill
    piece(rect(150, 164, 36, 40, 4), '#c4aa76', { edge: 'torn', rough: 0.5, fibre: false, shadow: false }),
    stitches([[150, 164], [186, 164], [186, 204], [150, 204], [150, 164]], '#6e5a38', 1.8, 0.8),

    // the spill: the dark tear, the glittering stream and the heap of sand
    group({ part: 'spill' }, [
      piece(curve([[162, 176], [176, 168], [186, 186], [180, 206], [168, 200]], 2), '#6a5232', flat),
      piece(curve([[164, 190], [176, 184], [182, 198], [176, 210], [168, 204]], 2), '#f2d060', flat),
      piece(curve([[168, 200], [180, 204], [190, 222], [172, 232], [160, 224]], 2), '#f2d060', { edge: 'torn', rough: 0.5, fibre: false, shadow: false }),
      piece(curve([[146, 236], [156, 218], [174, 208], [196, 214], [214, 230], [216, 238], [146, 238]], 2), '#f6dc78', { edge: 'torn', rough: 0.6, fibre: false, shadow: false }),
      piece(curve([[160, 232], [172, 220], [194, 222], [206, 234], [166, 238]], 2), '#ffeaa0', { ...flat, edge: 'torn', rough: 0.5, opacity: 0.85 }),
      ...glitter,
    ]),

    // Mollie's blue bow round the neck, hidden until a script fades it in
    group({ part: 'bow', opacity: 0, origin: [110, 66] }, [
      piece(curve([[76, 62], [110, 70], [144, 62], [144, 70], [110, 78], [76, 70]], 2), '#4a78c8', { edge: 'torn', rough: 0.4, fibre: false, shadow: false }),
      piece(curve([[110, 66], [82, 48], [70, 64], [84, 82]], 2), '#5a88d8', { edge: 'torn', rough: 0.5, fibre: false }),
      piece(curve([[110, 66], [138, 48], [150, 64], [136, 82]], 2), '#5a88d8', { edge: 'torn', rough: 0.5, fibre: false }),
      piece(curve([[110, 70], [96, 94], [90, 112], [102, 106], [110, 88]], 2), '#4a78c8', { edge: 'torn', rough: 0.5, fibre: false }),
      piece(curve([[110, 70], [124, 94], [130, 112], [118, 106], [110, 88]], 2), '#4a78c8', { edge: 'torn', rough: 0.5, fibre: false }),
      piece(ellipse(110, 67, 10, 9), '#3a64b0', { edge: 'torn', rough: 0.4, fibre: false }),
      ink([[104, 64], [112, 70]], { width: 1.6, color: '#8fb0ec', wobble: 0.2, opacity: 0.8 }),
    ]),
  ]);
});
