/**
 * The bears' seaside props, in the book's watercolour-and-ink look: sand
 * castles, a bucket and spade, a beach ball, shells and shore creatures,
 * and the little things the seaside stories hang on (a letter, a home-made
 * medal). Each one is drawn once and held still; the few that move have
 * parts (crab claws, gull wings, flag cloths) with origins at the joint.
 * Sand-coloured things sit on their bottom edge, so a writer can plant them
 * on the beach by their foot.
 */
import { cached, circle, curve, dot, ellipse, group, poly, rect, svg, type Node, type Pt } from '../../art/paper';
import { blot, clipped, deeper, INK, paler, pen, wash } from '../../art/watercolour';

// ---------------------------------------------------------------------------
// Colours
// ---------------------------------------------------------------------------
const SAND_C = '#e3c07e';
const SAND_PALE = '#ecd09a';
const SAND_SHADE = '#b88d52';
const WOOD = '#c99a62';
const RED = '#d9453a';
const YELLOW = '#f2c744';
const WEED = '#6f9a58';
const PEBBLE_C = '#a9b4c2';
const SEA_C = '#8fb1cc';

// ---------------------------------------------------------------------------
// Little shared pieces
// ---------------------------------------------------------------------------

/** A star outline (starfish, the bucket's yellow stars). */
function starPts(cx: number, cy: number, R: number, r: number, n = 5, rot = -90): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = ((rot + (i * 180) / n) * Math.PI) / 180;
    const k = i % 2 ? r : R;
    out.push([cx + Math.cos(a) * k, cy + Math.sin(a) * k]);
  }
  return out;
}

/** The fan of a scallop: hinge at (hx, hy), opening upward, with scalloped edge. */
function fan(hx: number, hy: number, R: number, ang = 72, lobes = 7): Pt[] {
  const pts: Pt[] = [[hx - R * 0.12, hy]];
  const steps = 56;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = ((-ang + 2 * ang * t) * Math.PI) / 180;
    const rr = R * (0.88 + 0.12 * Math.abs(Math.sin(t * lobes * Math.PI)));
    pts.push([hx + Math.sin(a) * rr, hy - Math.cos(a) * rr]);
  }
  pts.push([hx + R * 0.12, hy]);
  return pts;
}

/** A scallop shell: a fan in `base`, every other lobe in `alt`, ribs in pen, a little ear at the hinge. */
function scallop(hx: number, hy: number, R: number, base: string, alt: string, rot = 0, lobes = 7): Node[] {
  const ang = 72;
  const outline = fan(hx, hy, R, ang, lobes);
  const wedges: Node[] = [];
  const seam = (k: number): Pt => {
    const a = ((-ang + (2 * ang * k) / lobes) * Math.PI) / 180;
    return [hx + Math.sin(a) * R * 1.05, hy - Math.cos(a) * R * 1.05];
  };
  for (let k = 0; k < lobes; k += 2) wedges.push(wash(poly([[hx, hy], seam(k), seam(k + 1)]), alt, { line: false, shade: false, bloom: false, wobble: 0 }));
  const ribs: Node[] = [];
  for (let k = 0; k <= lobes; k++) {
    const e = seam(k);
    ribs.push(pen([[hx + (e[0] - hx) * 0.1, hy + (e[1] - hy) * 0.1], [hx + (e[0] - hx) * 0.55, hy + (e[1] - hy) * 0.55], [hx + (e[0] - hx) * 0.92, hy + (e[1] - hy) * 0.92]], { width: 1.4, opacity: 0.75, breaks: 0.1 }));
  }
  const nodes: Node[] = [
    wash(rect(hx - R * 0.2, hy - R * 0.1, R * 0.4, R * 0.18, 2), deeper(base, 0.15), { lineWidth: 1.6, depth: 0.4 }),
    wash(outline, base, { light: -110, depth: 0.3, lineWidth: 2 }),
    clipped(outline, wedges),
    ...ribs,
    pen([...outline.slice(1, -1)], { width: 2, breaks: 0.2 }),
  ];
  return rot ? [group({ transform: `rotate(${rot} ${hx} ${hy})` }, nodes)] : nodes;
}

/** A sand tower: tapered body, a row of crenellations, shaded on its right-hand side. */
function tower(x0: number, x1: number, yTop: number, yBot: number, inset: number, merlons: number, color: string, hatchGap: number | false = 7): Node[] {
  const tw = x1 - x0 - inset * 2;
  const mw = tw / (merlons * 2 - 1);
  const mh = Math.max(9, Math.min(16, (yBot - yTop) * 0.2));
  const out: Node[] = [];
  for (let i = 0; i < merlons; i++) {
    out.push(wash(rect(x0 + inset + i * 2 * mw, yTop - mh, mw, mh + 3, 1.5), paler(color, 0.1), { lineWidth: 1.9, depth: 0.35, light: -120, wobble: 0.9 }));
  }
  out.push(wash(poly([[x0, yBot], [x1, yBot], [x1 - inset, yTop], [x0 + inset, yTop]]), color, { light: -150, depth: 0.32, hatch: hatchGap, shade: SAND_SHADE, lineWidth: 2.2 }));
  return out;
}

/** A few specks pressed into the sand: pebbles. */
function specks(spots: [number, number, number][]): Node[] {
  return spots.map(([x, y, s]) => wash(ellipse(x, y, s * 1.3, s * 0.9, 10), PEBBLE_C, { lineWidth: 1.4, depth: 0.4, wobble: 0.5 }));
}

/** Seaweed: a ribbon of green with a wobbly pen vein. */
function weed(x: number, y: number, len: number, lean: number, seed = 1): Node[] {
  const pts: Pt[] = [];
  const back: Pt[] = [];
  for (let i = 0; i <= 5; i++) {
    const t = i / 5;
    const wx = x + lean * t + Math.sin(t * 6 + seed) * 5;
    const wy = y - len * t;
    pts.push([wx - 3 * (1 - t * 0.6), wy]);
    back.push([wx + 3 * (1 - t * 0.6), wy]);
  }
  return [wash([...pts, ...back.reverse()], WEED, { lineWidth: 1.5, depth: 0.5, wobble: 0.5, bloom: false })];
}

const ground = (cx: number, y: number, rx: number): Node => blot(ellipse(cx, y, rx, 8), '#d6b270', 0.55);
const moat = (x0: number, x1: number, y: number): Node[] => [
  blot(ellipse((x0 + x1) / 2, y + 4, (x1 - x0) / 2, 4.5), SEA_C, 0.55),
  pen([[x0, y], [(x0 + x1) / 2, y + 4], [x1, y]], { width: 2, breaks: 0.3 }),
];

// ---------------------------------------------------------------------------
// The props
// ---------------------------------------------------------------------------

const sandcastle = cached(() =>
  svg({ w: 200, h: 160, name: 'bears-sandcastle' }, [
    ground(100, 150, 96),
    ...tower(14, 60, 82, 150, 6, 3, SAND_PALE),
    ...tower(142, 188, 92, 150, 6, 3, SAND_PALE),
    ...tower(44, 156, 62, 150, 12, 4, SAND_C, 6),
    // a doorway
    wash(curve([[84, 150], [84, 124], [92, 112], [108, 112], [116, 124], [116, 150]], 2), '#9c7449', { line: false, depth: 0.5, hatch: 5 }),
    pen([[84, 148], [84, 124], [92, 113], [108, 113], [116, 124], [116, 148]], { width: 2 }),
    ...scallop(66, 112, 16, '#e7b9bd', '#a9bccd', -12),
    ...scallop(138, 126, 11, '#a9bccd', '#e7b9bd', 14),
    ...specks([[30, 108, 3], [26, 124, 2.5], [172, 116, 3], [54, 84, 2.5], [150, 84, 2.5], [96, 84, 3], [124, 96, 2.5]]),
    ...moat(8, 192, 152),
  ]),
);

const bigSandcastle = cached(() =>
  svg({ w: 360, h: 300, name: 'bears-big-sandcastle' }, [
    ground(180, 288, 176),
    // far-side towers first, then tiers, so the front ones overlap
    ...tower(70, 118, 96, 140, 5, 3, SAND_PALE, 6),
    ...tower(242, 290, 96, 140, 5, 3, SAND_PALE, 6),
    ...tower(22, 80, 150, 286, 7, 3, SAND_PALE),
    ...tower(280, 338, 150, 286, 7, 3, SAND_PALE),
    ...tower(30, 330, 206, 286, 14, 8, SAND_C, 7),
    ...tower(76, 284, 138, 208, 14, 6, SAND_C, 7),
    // the keep and its little top turret
    ...tower(124, 236, 86, 140, 10, 4, SAND_PALE, 6),
    ...tower(158, 202, 50, 90, 4, 3, SAND_C, 5),
    // door arch
    wash(curve([[154, 286], [154, 250], [162, 232], [180, 224], [198, 232], [206, 250], [206, 286]], 2), '#8d6a43', { line: false, depth: 0.5, hatch: 5 }),
    pen([[154, 284], [154, 250], [162, 233], [180, 225], [198, 233], [206, 250], [206, 284]], { width: 2.4 }),
    // keep windows
    wash(curve([[148, 126], [148, 112], [155, 106], [162, 112], [162, 126]], 2), '#8d6a43', { line: false, shade: false, bloom: false }),
    wash(curve([[198, 126], [198, 112], [205, 106], [212, 112], [212, 126]], 2), '#8d6a43', { line: false, shade: false, bloom: false }),
    wash(curve([[172, 80], [172, 68], [180, 62], [188, 68], [188, 80]], 2), '#8d6a43', { line: false, shade: false, bloom: false }),
    // pressed-in treasures
    ...scallop(66, 228, 20, '#e7b9bd', '#a9bccd', -10),
    ...scallop(300, 240, 18, '#a9bccd', '#e7b9bd', 12),
    ...scallop(112, 186, 13, '#a9bccd', '#e7b9bd', 0),
    ...scallop(262, 190, 13, '#e7b9bd', '#a9bccd', -8),
    wash(curve(starPts(240, 250, 18, 8), 2), '#e8924a', { lineWidth: 1.8, depth: 0.4 }),
    wash(curve(starPts(150, 172, 12, 5), 2), '#e8924a', { lineWidth: 1.6, depth: 0.4 }),
    ...specks([[48, 196, 4], [38, 262, 3.5], [320, 214, 4], [326, 270, 3.5], [100, 258, 3], [262, 226, 3], [180, 160, 3.5], [140, 150, 3], [220, 156, 3], [100, 112, 3], [264, 118, 3], [118, 220, 3]]),
    // seaweed draped round the base and over the wall
    ...weed(86, 286, 36, -6, 1),
    ...weed(96, 286, 26, 8, 2),
    ...weed(268, 286, 40, 8, 3),
    ...weed(114, 208, 22, -8, 4),
    ...weed(250, 208, 20, 8, 5),
    pen([[40, 286], [60, 280], [76, 270]], { width: 2, color: '#4d7a40' }),
    ...moat(10, 350, 290),
    // the flag on top: its cloth flutters about the pole
    pen([[180, 52], [180, 6]], { width: 3.2, color: '#7a5636', breaks: 0 }),
    group({ part: 'flag', origin: [180, 52] }, [
      wash(poly([[181, 8], [216, 17], [181, 28]]), RED, { depth: 0.4, lineWidth: 2, wobble: 0.6, hatch: 5 }),
    ]),
  ]),
);

const bucket = cached(() => {
  const body = poly([[20, 36], [100, 36], [90, 108], [30, 108]]);
  const bandTop = 58;
  const bandBot = 86;
  const stars: Node[] = [38, 60, 82].map((x, i) => wash(starPts(x, 72 + (i === 1 ? 0 : 1), 9, 4), YELLOW, { lineWidth: 1.5, depth: 0.4, wobble: 0.4, bloom: false }));
  return svg({ w: 120, h: 120, name: 'bears-bucket' }, [
    // handle first, behind the rim
    pen([[22, 40], [20, 18], [40, 6], [60, 3], [80, 6], [100, 18], [98, 40]], { width: 4, color: '#6f6a68', breaks: 0 }),
    blot(ellipse(60, 112, 38, 5), '#d6b270', 0.5),
    wash(body, RED, { light: -150, depth: 0.3, lineWidth: 2.4, hatch: 6 }),
    clipped(body, [wash(poly([[0, bandTop], [120, bandTop], [120, bandBot], [0, bandBot]]), '#fffdf6', { line: false, shade: '#d9d4c4', light: -150, depth: 0.3, bloom: false, wobble: 0 })]),
    pen([[22, bandTop], [60, bandTop + 2], [98, bandTop]], { width: 1.8, breaks: 0.2 }),
    pen([[26, bandBot], [60, bandBot + 2], [94, bandBot]], { width: 1.8, breaks: 0.2 }),
    ...stars,
    // the rim, a darker ellipse inside
    wash(ellipse(60, 36, 41, 9), deeper(RED, 0.3), { light: -90, depth: 0.3, lineWidth: 2.2, bloom: false }),
    wash(ellipse(60, 38, 33, 5), '#8c6a47', { line: false, shade: false, bloom: false }),
    dot(24, 40, 2.4, '#6f6a68'),
    dot(96, 40, 2.4, '#6f6a68'),
  ]);
});

const spade = cached(() => {
  const blade = curve([[10, 96], [50, 96], [53, 128], [40, 152], [20, 152], [7, 128]], 2);
  return svg({ w: 60, h: 160, name: 'bears-spade' }, [
    blot(ellipse(30, 156, 18, 3), '#d6b270', 0.5),
    // the wooden grip and shaft
    wash(rect(24, 22, 12, 72), WOOD, { light: -180, depth: 0.45, lineWidth: 2, hatch: 5 }),
    wash(rect(11, 6, 38, 16, 7), paler(WOOD, 0.1), { light: -100, depth: 0.35, lineWidth: 2.2 }),
    pen([[29, 30], [29, 80]], { width: 1.3, opacity: 0.6, color: deeper(WOOD, 0.6) }),
    // the red metal blade and its socket
    wash(blade, RED, { light: -140, depth: 0.32, lineWidth: 2.3, hatch: 6 }),
    wash(rect(21, 84, 18, 18, 2), deeper(RED, 0.25), { lineWidth: 1.8, depth: 0.4 }),
    pen([[22, 108], [20, 124], [28, 142]], { width: 1.6, color: paler(RED, 0.7), opacity: 0.9, breaks: 0 }),
  ]);
});

const beachBall = cached(() => {
  const cx = 60;
  const cy = 60;
  const R = 50;
  const wedge = (p1: number, p2: number): Pt[] => {
    const pts: Pt[] = [];
    const n = 14;
    for (let i = 0; i <= n; i++) {
      const t = (i / n) * Math.PI;
      pts.push([cx + R * Math.sin(t) * Math.sin(p1), cy - R * Math.cos(t)]);
    }
    for (let i = n; i >= 0; i--) {
      const t = (i / n) * Math.PI;
      pts.push([cx + R * Math.sin(t) * Math.sin(p2), cy - R * Math.cos(t)]);
    }
    return pts;
  };
  const colours = ['#fffdf6', RED, YELLOW, '#fffdf6', RED];
  const edges = [-90, -48, -12, 22, 56, 90].map((d) => (d * Math.PI) / 180);
  const body = circle(cx, cy, R);
  const parts: Node[] = colours.map((c, i) => wash(wedge(edges[i], edges[i + 1]), c, { line: false, shade: false, bloom: false, wobble: 0 }));
  return svg({ w: 120, h: 120, name: 'bears-beach-ball' }, [
    blot(ellipse(62, 114, 36, 4.5), '#d6b270', 0.5),
    wash(body, '#fffdf6', { line: false, shade: false, bloom: false, wobble: 0.6 }),
    clipped(body, [
      ...parts,
      // shadow crescent and a pale shine
      blot(ellipse(78, 82, 36, 32), '#5a4630', 0.18),
      blot(ellipse(40, 36, 10, 6, -30), '#ffffff', 0.7),
    ]),
    // the seams, and the poles where they meet
    ...edges.slice(1, -1).map((p) => pen(Array.from({ length: 8 }, (_, i) => [cx + R * Math.sin((i / 7) * Math.PI) * Math.sin(p), cy - R * Math.cos((i / 7) * Math.PI)] as Pt), { width: 1.7, breaks: 0.2 })),
    wash(circle(cx, cy - R + 3, 4), YELLOW, { lineWidth: 1.4, shade: false, bloom: false, wobble: 0.3 }),
    wash(circle(cx, cy + R - 3, 4), YELLOW, { lineWidth: 1.4, shade: false, bloom: false, wobble: 0.3 }),
    pen(ellipse(cx, cy, R, R), { closed: true, width: 2.6, breaks: 0.4 }),
  ]);
});

const envelope = cached(() => {
  const paper = poly([[12, 16], [128, 16], [128, 86], [12, 86]]);
  return svg({ w: 140, h: 100, name: 'bears-envelope' }, [
    group({ transform: 'rotate(-5 70 52)' }, [
      blot(ellipse(72, 92, 56, 4), '#8a7a5a', 0.3),
      wash(paper, '#fffdf6', { light: -150, depth: 0.25, shade: '#d9d2bf', lineWidth: 2.3, wobble: 0.9 }),
      // the flap, a slightly tinted triangle with its fold lines
      wash(poly([[12, 16], [128, 16], [70, 62]]), '#f1ebd8', { light: -90, depth: 0.2, shade: '#d9d2bf', lineWidth: 2, wobble: 0.6, bloom: false }),
      pen([[12, 86], [50, 50]], { width: 1.5, opacity: 0.75, breaks: 0.1 }),
      pen([[128, 86], [90, 50]], { width: 1.5, opacity: 0.75, breaks: 0.1 }),
      // a few scribbled ink lines low down, as if a name were written
      pen([[24, 80], [40, 78], [54, 80]], { width: 1.3, opacity: 0.7 }),
      pen([[88, 80], [100, 78], [116, 80]], { width: 1.3, opacity: 0.7 }),
      // the red seal
      wash(ellipse(70, 58, 12, 11), RED, { light: -130, depth: 0.35, lineWidth: 2, wobble: 1.4 }),
      wash(circle(70, 58, 6.5), paler(RED, 0.15), { line: false, shade: deeper(RED, 0.3), bloom: false, wobble: 0.6 }),
      pen(circle(70, 58, 6.5), { closed: true, width: 1.2, color: deeper(RED, 0.6), opacity: 0.8, breaks: 0 }),
    ]),
  ]);
});

/** One of the crab's claws, drawn on the left and mirrored for the right. */
function claw(mirror: boolean): Node {
  const X = (x: number) => (mirror ? 110 - x : x);
  const P = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [X(x), y] as Pt);
  const ex = (cx: number, cy: number, rx: number, ry: number, rot: number) => ellipse(X(cx), cy, rx, ry, mirror ? -rot : rot);
  const col = '#8f7a47';
  return group({ part: mirror ? 'clawR' : 'clawL', origin: [X(26), 44] }, [
    pen(P([[28, 46], [20, 36], [17, 28]]), { width: 7.5, color: INK, breaks: 0 }),
    pen(P([[28, 46], [20, 36], [17, 28]]), { width: 4.6, color: col, breaks: 0, taper: false }),
    // the two jaws of the pincer
    wash(ex(10, 16, 8.5, 14, -14), col, { lineWidth: 2.2, depth: 0.4, wobble: 0.6 }),
    wash(ex(22, 14, 8.5, 14, 18), col, { lineWidth: 2, depth: 0.4, wobble: 0.6 }),
    pen(P([[16, 4], [17, 22]]), { width: 1.5, opacity: 0.8, breaks: 0 }),
  ]);
}

const crab = cached(() => {
  const col = '#8f7a47';
  const leg = (x0: number, side: number, i: number): Node => pen([[x0, 52 + i * 3], [x0 + side * 14, 58 + i * 5], [x0 + side * 20, 72]], { width: 3, breaks: 0 });
  return svg({ w: 110, h: 80, name: 'bears-crab' }, [
    blot(ellipse(55, 74, 38, 4), '#d6b270', 0.5),
    // three legs a side, then the body over their tops
    ...[0, 1, 2].map((i) => leg(36 - i * 4, -1, i)),
    ...[0, 1, 2].map((i) => leg(74 + i * 4, 1, i)),
    // eye stalks behind the shell
    pen([[48, 40], [47, 28]], { width: 2.4, breaks: 0 }),
    pen([[62, 40], [63, 28]], { width: 2.4, breaks: 0 }),
    wash(ellipse(55, 50, 29, 18), col, { light: -120, depth: 0.32, lineWidth: 2.4, hatch: 6, bloom: true }),
    wash(ellipse(55, 46, 16, 8), paler(col, 0.25), { line: false, shade: false, bloom: false, wobble: 1 }),
    wash(circle(46, 25, 5), '#fffdf6', { lineWidth: 1.6, shade: false, bloom: false, wobble: 0.3 }),
    wash(circle(64, 25, 5), '#fffdf6', { lineWidth: 1.6, shade: false, bloom: false, wobble: 0.3 }),
    dot(47, 25, 2.2, INK),
    dot(65, 25, 2.2, INK),
    pen([[48, 58], [55, 62], [62, 58]], { width: 1.7, breaks: 0 }),
    claw(false),
    claw(true),
  ]);
});

const starfish = cached(() => {
  const star = curve(starPts(45, 46, 42, 18), 2);
  const arms = Array.from({ length: 5 }, (_, i) => {
    const a = ((-90 + i * 72) * Math.PI) / 180;
    return [Math.cos(a), Math.sin(a)] as Pt;
  });
  return svg({ w: 90, h: 90, name: 'bears-starfish' }, [
    wash(star, '#ec9650', { light: -130, depth: 0.3, lineWidth: 2.4, hatch: 6 }),
    ...arms.map(([c, s]) => pen([[45 + c * 6, 46 + s * 6], [45 + c * 22, 46 + s * 22], [45 + c * 34, 46 + s * 34]], { width: 1.6, color: deeper('#ec9650', 0.6), opacity: 0.8, breaks: 0.1 })),
    ...arms.flatMap(([c, s]) => [14, 24, 33].map((d, k) => dot(45 + c * d + s * (k % 2 ? 4 : -4), 46 + s * d - c * (k % 2 ? 4 : -4), 1.8, '#fbe0a8', 0.9))),
    wash(circle(45, 46, 4), '#fbe0a8', { lineWidth: 1.2, shade: false, bloom: false, wobble: 0.3 }),
  ]);
});

const shell = cached(() =>
  svg({ w: 80, h: 70, name: 'bears-shell' }, [
    blot(ellipse(40, 64, 28, 3.5), '#d6b270', 0.45),
    ...scallop(40, 62, 52, '#a9bccd', '#e7b9bd', 0),
  ]),
);

const sandcastleFlag = cached(() =>
  svg({ w: 60, h: 100, name: 'bears-sandcastle-flag' }, [
    blot(ellipse(30, 96, 12, 3), '#d6b270', 0.5),
    // the pole, base at bottom centre
    wash(rect(27.5, 8, 5, 88), WOOD, { light: 180, depth: 0.5, lineWidth: 1.8, wobble: 0.5, bloom: false }),
    group({ part: 'flag', origin: [30, 96] }, [wash(poly([[33, 12], [56, 24], [33, 38]]), RED, { depth: 0.4, lineWidth: 2, wobble: 0.5, hatch: 5 })]),
    dot(30, 8, 3, YELLOW),
    pen(circle(30, 8, 3), { closed: true, width: 1.3, breaks: 0 }),
  ]),
);

const shellMedal = cached(() => {
  const strap = (mirror: boolean): Pt[] => ([[12, 0], [32, 0], [52, 56], [40, 62]] as Pt[]).map(([x, y]) => [mirror ? 90 - x : x, y] as Pt);
  return svg({ w: 90, h: 120, name: 'bears-shell-medal' }, [
    wash(poly(strap(false)), RED, { light: -150, depth: 0.3, lineWidth: 2, wobble: 0.6, hatch: 6 }),
    wash(poly(strap(true)), deeper(RED, 0.08), { light: -30, depth: 0.3, lineWidth: 2, wobble: 0.6, hatch: 6 }),
    wash(ellipse(45, 62, 7, 6), deeper(RED, 0.15), { lineWidth: 1.8, wobble: 0.5, bloom: false }),
    // a bit of string tying the shell on, then the shell
    pen([[45, 64], [45, 80]], { width: 2, color: '#7a5636', breaks: 0 }),
    ...scallop(45, 117, 42, '#e7b9bd', '#f4d9c7', 0),
    wash(starPts(45, 98, 7, 3) as Pt[], YELLOW, { lineWidth: 1.4, shade: false, bloom: false, wobble: 0.3 }),
  ]);
});

const seagull = cached(() => {
  const grey = '#aab2bb';
  const tip = '#4b4f57';
  const wing = (mirror: boolean): Node => {
    const X = (x: number) => (mirror ? 120 - x : x);
    const P = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [X(x), y] as Pt);
    const outline = P([[56, 34], [44, 22], [28, 14], [12, 9], [3, 8], [8, 15], [5, 19], [13, 23], [11, 28], [22, 30], [22, 34], [34, 34], [40, 39], [54, 39]]);
    return group({ part: mirror ? 'wingR' : 'wingL', origin: [X(56), 36] }, [
      wash(outline, grey, { light: -100, depth: 0.28, lineWidth: 2, wobble: 0.7, hatch: 6 }),
      wash(P([[12, 9], [3, 8], [8, 15], [5, 19], [14, 21]]), tip, { line: false, shade: false, bloom: false, wobble: 0.3 }),
      pen(P([[54, 36], [38, 28], [20, 20]]), { width: 1.3, opacity: 0.7, breaks: 0 }),
    ]);
  };
  return svg({ w: 120, h: 60, name: 'bears-seagull' }, [
    wing(false),
    wing(true),
    // tail, body, head, beak, eye
    wash(poly([[44, 38], [28, 44], [30, 36], [40, 34]]), '#fffdf6', { light: -90, depth: 0.3, shade: '#d5d9de', lineWidth: 1.8, wobble: 0.4, bloom: false }),
    wash(ellipse(58, 38, 21, 10), '#fffdf6', { light: -90, depth: 0.35, shade: '#d5d9de', lineWidth: 2.2, wobble: 0.6 }),
    wash(circle(72, 27, 8), '#fffdf6', { light: -90, depth: 0.3, shade: '#d5d9de', lineWidth: 2, wobble: 0.4 }),
    wash(poly([[78, 25], [92, 29], [78, 32]]), '#f0a340', { lineWidth: 1.7, shade: false, bloom: false, wobble: 0.3 }),
    dot(74, 25, 1.9, INK),
    pen([[56, 47], [54, 54]], { width: 1.8, color: '#e0883a', breaks: 0 }),
    pen([[62, 47], [62, 54]], { width: 1.8, color: '#e0883a', breaks: 0 }),
  ]);
});

export const seaProps: Record<string, () => string> = {
  sandcastle,
  'big-sandcastle': bigSandcastle,
  bucket,
  spade,
  'beach-ball': beachBall,
  envelope,
  crab,
  starfish,
  shell,
  'sandcastle-flag': sandcastleFlag,
  'shell-medal': shellMedal,
  seagull,
};
