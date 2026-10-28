/**
 * The Land of Lost Things, and the things that belong in it.
 *
 * lostLand: a soft, warm, dreamy afternoon. A pale duck-egg sky going to
 * apricot at the horizon, a few soft clouds, and far rolling hills heaped
 * with lost things (odd socks, open umbrellas, keys, kites with tails,
 * marbles, single gloves, buttons, a teddy, hats, books, a scarf), each a
 * small paper piece, so the hills read as jumble. On the far left (x 20-230)
 * stands the Keeper's crooked little wooden hut with a lit window, a crooked
 * chimney and a leaning cabinet of pigeonholes stuffed with odds and ends.
 * The middle and right ground are open, calm, dusty sand from y 596; stray
 * socks and buttons only at the very edges. The bottom band (y 690+) is plain.
 *
 * Ground line y 640; the open ground is x 250-1000 (a tall heap prop stands
 * at about x 800-1100, actors at x 250-800). The hut and the hills are
 * painted in.
 *
 * Props: lostHeap (the great wobbly heap, with three ledges up its left
 * side and a flat top for a ribbon), lostRibbon (Mollie's blue hair-ribbon),
 * lostSock and lostSocks (Peter's odd green-and-white sock, and an armful of
 * odd socks), lostSpectacles, lostBell (the Keeper's brass hand-bell on its
 * post), lostKite and lostGlove (lost things flying home to the land).
 */
import { C } from '../../art/palette';
import { band, cached, circle, curve, dot, ellipse, group, ink, piece, poly, rect, svg, type Node, type Pt } from '../../art/paper';
import { CUT, FLAT } from '../faraway/parts';

const W = 1180;
const H = 820;
const PAPER = '#fbf6ea';

const JUNK = ['#c7706a', '#7fa6c4', '#e0b95a', '#8fb58a', '#b98bb8', '#d9925c', '#6f8fa8', '#e8dcc0', '#9fb86a'];

/** Moves, scales and turns a shape drawn around (0, 0). */
function T(pts: Pt[], x: number, y: number, s = 1, rot = 0): Pt[] {
  const a = (rot * Math.PI) / 180;
  const c = Math.cos(a);
  const sn = Math.sin(a);
  return pts.map(([px, py]) => [x + (px * c - py * sn) * s, y + (px * sn + py * c) * s] as Pt);
}

const TINY = { edge: 'cut' as const, fibre: false as const, shadow: false };

// ============================================================ lost things

/** One odd sock around (0, 0), about 30 tall: a cuff, a stripe or two, a heel, a toe. */
function sockBits(x: number, y: number, s: number, rot: number, body: string, stripe: string, o: typeof TINY | typeof CUT = TINY): Node[] {
  const t = (p: Pt[]) => T(p, x, y, s, rot);
  return [
    piece(t(curve([[-6, -14], [6, -14], [6, 2], [15, 6], [18, 14], [8, 19], [-5, 17], [-9, 8]], 1)), body, o),
    piece(t([[-5.5, -9], [5.5, -9], [5.5, -5], [-5.5, -5]]), stripe, TINY),
    piece(t([[-6, -1], [6, -1], [6, 3], [-6, 3]]), stripe, TINY),
    piece(t([[-6.5, -14], [6.5, -14], [6.5, -10.5], [-6.5, -10.5]]), PAPER, TINY),
  ];
}

type Kind = 'sock' | 'umbrella' | 'key' | 'kite' | 'marble' | 'glove' | 'button' | 'teddy' | 'hat' | 'book' | 'scarf' | 'boot';

/** A small lost thing, drawn about 30 px across at s = 1, centred on (x, y). */
function item(kind: Kind, x: number, y: number, s: number, rot: number, col: string): Node[] {
  const t = (p: Pt[]) => T(p, x, y, s, rot);
  switch (kind) {
    case 'sock':
      return sockBits(x, y, s, rot, col, PAPER);
    case 'umbrella': {
      const dome: Pt[] = [];
      for (let i = 0; i <= 10; i++) {
        const a = Math.PI + (i / 10) * Math.PI;
        dome.push([Math.cos(a) * 17, Math.sin(a) * 13]);
      }
      dome.push([12, 3], [6, 0], [0, 3], [-6, 0], [-12, 3]);
      return [
        ink(t([[0, 0], [0, 14], [4, 18], [7, 14]]), { width: Math.max(1.6, 2 * s), color: C.brownDark, wobble: 0.2 }),
        piece(t(dome), col, TINY),
        ink(t([[0, -13], [0, 0]]), { width: 1.2, color: C.brownDark, opacity: 0.5, wobble: 0.1 }),
      ];
    }
    case 'key':
      return [
        piece(t(circle(-8, 0, 5)), C.brass, TINY),
        dot(x + (-8 * Math.cos((rot * Math.PI) / 180)) * s, y + (-8 * Math.sin((rot * Math.PI) / 180)) * s, 1.7 * s, '#e8d3a8'),
        ink(t([[-3, 0], [12, 0]]), { width: Math.max(1.6, 2.2 * s), color: C.brass, wobble: 0.1 }),
        ink(t([[8, 0], [8, 5]]), { width: Math.max(1.4, 1.8 * s), color: C.brass, wobble: 0.1 }),
        ink(t([[12, 0], [12, 4]]), { width: Math.max(1.4, 1.8 * s), color: C.brass, wobble: 0.1 }),
      ];
    case 'kite':
      return [
        ink(t([[0, 16], [-6, 24], [4, 30], [-3, 38]]), { width: Math.max(1.2, 1.4 * s), color: C.brownDark, opacity: 0.7, wobble: 0.1 }),
        piece(t([[0, -16], [11, -2], [0, 18], [-11, -2]]), col, TINY),
        piece(t([[0, -16], [11, -2], [0, -2]]), PAPER, { ...TINY, opacity: 0.35 } as typeof TINY),
        ink(t([[0, -16], [0, 18]]), { width: 1, color: C.brownDark, opacity: 0.5, wobble: 0.1 }),
        ink(t([[-11, -2], [11, -2]]), { width: 1, color: C.brownDark, opacity: 0.5, wobble: 0.1 }),
      ];
    case 'marble':
      return [piece(t(circle(0, 0, 6)), col, TINY), dot(x - 2 * s, y - 2 * s, 1.8 * s, PAPER, 0.8)];
    case 'glove':
      return [
        piece(t(ellipse(0, 4, 9, 8)), col, TINY),
        ...[-6, -2, 2, 6].map((fx, i) => piece(t(ellipse(fx, -7 - (i === 1 || i === 2 ? 2 : 0), 2.8, 7)), col, TINY)),
        piece(t(ellipse(-10, 2, 3, 6, -40)), col, TINY),
        piece(t(rect(-9, 10, 18, 5, 1)), C.redDark, { ...TINY, opacity: 0.55 } as typeof TINY),
      ];
    case 'button':
      return [piece(t(circle(0, 0, 6.5)), col, TINY), dot(x - 2 * s, y, 1.1 * s, C.brownDark), dot(x + 2 * s, y, 1.1 * s, C.brownDark)];
    case 'teddy':
      return [
        piece(t(ellipse(0, 6, 9, 10)), '#b98a5a', TINY),
        piece(t(circle(-8, -10, 3.4)), '#b98a5a', TINY),
        piece(t(circle(8, -10, 3.4)), '#b98a5a', TINY),
        piece(t(circle(0, -6, 8)), '#b98a5a', TINY),
        piece(t(ellipse(0, -3, 4, 3)), '#e4c59a', TINY),
        dot(x + (-3 * Math.cos((rot * Math.PI) / 180)) * s, y + (-3 * Math.sin((rot * Math.PI) / 180)) * s - 5 * s, 1 * s, C.ink),
        dot(x + (3 * Math.cos((rot * Math.PI) / 180)) * s, y + (3 * Math.sin((rot * Math.PI) / 180)) * s - 5 * s, 1 * s, C.ink),
      ];
    case 'hat':
      return [
        piece(t(rect(-8, -10, 16, 15, 3)), col, TINY),
        piece(t(ellipse(0, 5, 16, 3.6)), col, TINY),
        piece(t(rect(-8, 0, 16, 3.5, 1)), C.brownDark, { ...TINY, opacity: 0.55 } as typeof TINY),
      ];
    case 'book':
      return [
        piece(t(rect(-11, -8, 22, 16, 1)), col, TINY),
        piece(t(rect(-11, -8, 4, 16, 1)), C.brownDark, { ...TINY, opacity: 0.4 } as typeof TINY),
        piece(t(rect(-4, 5, 14, 2.5, 0)), PAPER, TINY),
      ];
    case 'scarf':
      return [
        piece(t(band([[-16, 0], [-8, -5], [0, 1], [8, -4], [16, 2]], 7)), col, TINY),
        piece(t(band([[-14, -1], [-8, -4], [-2, 0]], 2.4)), PAPER, { ...TINY, opacity: 0.8 } as typeof TINY),
      ];
    case 'boot':
      return [piece(t([[-6, -14], [5, -14], [5, 4], [15, 8], [15, 15], [-6, 15]]), col, TINY), piece(t([[-6, 11], [15, 11], [15, 15], [-6, 15]]), C.brownDark, TINY)];
  }
}

// ================================================================= sky + hills

function cloud(x: number, y: number, s: number): Node[] {
  const o = { edge: 'torn' as const, fibre: false as const, shadow: false, opacity: 0.85 };
  return [
    piece(ellipse(x, y, 80 * s, 20 * s), '#fff3e2', o),
    piece(ellipse(x - 38 * s, y - 12 * s, 38 * s, 18 * s), '#fff3e2', o),
    piece(ellipse(x + 28 * s, y - 18 * s, 44 * s, 22 * s), '#fff3e2', o),
  ];
}

/** A deterministic scatter so the jumble never changes between draws. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const farRidge = (x: number) => 400 + 24 * Math.sin(x / 130) + 12 * Math.sin(x / 47 + 1) - 110 * Math.exp(-(((x - 990) / 200) ** 2));
const midRidge = (x: number) => 510 + 20 * Math.sin(x / 105 + 1.4) + 8 * Math.sin(x / 38) - 30 * Math.exp(-(((x - 1040) / 150) ** 2));

function hillShape(f: (x: number) => number, bottom: number): Pt[] {
  const pts: Pt[] = [];
  for (let x = -40; x <= 1240; x += 20) pts.push([x, f(x)]);
  pts.push([1240, bottom], [-40, bottom]);
  return pts;
}

const KINDS: Kind[] = ['sock', 'umbrella', 'key', 'kite', 'marble', 'glove', 'button', 'teddy', 'hat', 'book', 'scarf', 'boot', 'sock', 'umbrella'];

/** Lost things strewn over a hill: small pieces on and just under the ridge. */
function jumble(f: (x: number) => number, seed: number, step: number, depth: number, size: number, skip: (x: number) => boolean = () => false): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  for (let x = -10; x < 1200; x += step) {
    const px = x + (r() - 0.5) * step;
    if (skip(px)) continue;
    const py = f(px) + 3 + r() * depth;
    const k = KINDS[Math.floor(r() * KINDS.length)];
    const col = k === 'glove' ? '#c9605a' : JUNK[Math.floor(r() * JUNK.length)];
    out.push(...item(k, px, py, size * (0.8 + r() * 0.5), (r() - 0.5) * 80, col));
  }
  return out;
}

// ============================================================== the keeper's hut

function hut(): Node[] {
  const out: Node[] = [
    piece(ellipse(130, 612, 118, 9), 'rgba(60,40,20,0.2)', FLAT),
    // the chimney, leaning a bit
    piece(poly([[146, 456], [152, 396], [172, 400], [170, 456]]), '#8e5e4a', { edge: 'cut', fibre: false }),
    piece(poly([[148, 398], [152, 392], [174, 396], [172, 402]]), '#6e463a', FLAT),
    // the walls: crooked planks
    piece(poly([[36, 480], [188, 470], [192, 612], [34, 612]]), '#a67b52', { edge: 'cut' }),
    ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ink([[36 + i * 16, 480 - i * 0.7], [35 + i * 16.5, 612]], { width: 1.8, color: C.brownDark, opacity: 0.35, wobble: 0.4 })),
    // the roof, a little crooked, with a patch
    piece(poly([[14, 490], [104, 416], [208, 468], [208, 484], [14, 500]]), '#7c5a44', { edge: 'cut' }),
    piece(poly([[60, 460], [96, 430], [124, 444], [92, 474]]), '#8fa27a', { edge: 'torn', fibre: false, shadow: false }),
    ink([[22, 498], [206, 482]], { width: 3, color: C.brownDark, opacity: 0.5 }),
    // the window, glowing, with a crooked curtain
    piece(rect(44, 506, 56, 50, 2), '#6e4a30', CUT),
    piece(rect(50, 512, 44, 38, 1), '#f6dfa0', FLAT),
    ink([[72, 512], [72, 550]], { width: 2.4, color: '#6e4a30' }),
    ink([[50, 531], [94, 531]], { width: 2.4, color: '#6e4a30' }),
    piece(poly([[50, 512], [66, 512], [58, 540]]), '#c7706a', { ...FLAT, opacity: 0.85 }),
    piece(rect(40, 554, 64, 7, 2), '#6e4a30', CUT),
    // the door
    piece(rect(112, 534, 44, 78, 3), '#6a4630', CUT),
    ...[0, 1, 2].map((i) => ink([[124 + i * 12, 538], [124 + i * 12, 612]], { width: 1.6, color: '#3e2818', opacity: 0.5 })),
    dot(148, 576, 3, C.brass),
  ];
  // the leaning cabinet of pigeonholes, stuffed with odds and ends
  const cx0 = 168;
  const cy0 = 476;
  out.push(piece(rect(cx0, cy0, 62, 136, 2), '#7d5a40', { edge: 'cut' }));
  const stuff: Kind[] = ['sock', 'key', 'glove', 'button', 'book', 'hat', 'marble', 'scarf', 'sock', 'teddy', 'key', 'umbrella'];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 3; c++) {
      const hx = cx0 + 5 + c * 18.5;
      const hy = cy0 + 6 + r * 32;
      out.push(piece(rect(hx, hy, 16, 28, 1), '#3e2a1c', FLAT));
      const i = r * 3 + c;
      out.push(...item(stuff[i], hx + 8, hy + 17, 0.5, (i % 3) * 14 - 14, i % 5 === 3 ? '#c9605a' : JUNK[(i * 2) % JUNK.length]));
    }
  }
  return out;
}

export const lostLand = cached(() =>
  svg({ w: W, h: H, name: 'wishing-lost-land', className: 'backdrop' }, [
    // sky: duck-egg blue, warming to apricot towards the horizon
    piece(rect(-20, -20, 1220, 860), '#bfe0dc', { edge: 'clean', shadow: false }),
    ...Array.from({ length: 9 }, (_, i) => piece(rect(-20, 60 + i * 52, 1220, 600), '#f6d9b4', { edge: 'clean', shadow: false, opacity: 0.17 })),
    piece(circle(790, 190, 120), '#fff1d0', { edge: 'torn', fibre: false, shadow: false, opacity: 0.4 }),
    piece(circle(790, 190, 64), '#fff6dc', { edge: 'torn', fibre: false, shadow: false, opacity: 0.6 }),
    ...cloud(330, 130, 1),
    ...cloud(640, 80, 0.8),
    ...cloud(1010, 160, 1.1),
    ...cloud(120, 250, 0.7),
    // far hills, heaped with lost things
    piece(curve(hillShape(farRidge, 620), 1), '#d9bba2', { edge: 'torn', shadow: false }),
    ...jumble(farRidge, 11, 16, 150, 1.0),
    // nearer hills
    piece(curve(hillShape(midRidge, 640), 1), '#b9bf98', { edge: 'torn', shadow: false }),
    ...jumble(midRidge, 29, 20, 80, 1.4, (x) => x > 230 && x < 790),
    // the Keeper's hut at the left
    ...hut(),
    // the dusty open ground
    piece(rect(-20, 596, 1220, 240), '#e2c698', { edge: 'torn', shadow: false }),
    piece(rect(-20, 692, 1220, 140), '#dcbf8e', { edge: 'clean', shadow: false }),
    piece(poly([[-20, 636], [1200, 626], [1200, 664], [-20, 674]]), '#ebd3a6', { edge: 'torn', fibre: false, shadow: false, opacity: 0.6 }),
    ...[0, 1, 2, 3, 4, 5].map((i) => ink([[260 + i * 130, 620 + (i % 2) * 22], [320 + i * 130, 624 + (i % 2) * 22]], { width: 2.4, color: '#b58f5a', opacity: 0.35 })),
    // a few strays at the very edges only
    ...item('sock', 252, 648, 1.1, 70, '#9fb86a'),
    ...item('button', 266, 668, 0.9, 0, '#7fa6c4'),
    ...item('sock', 1000, 654, 1.2, -50, '#7fa6c4'),
    ...item('button', 1022, 640, 0.9, 0, '#e0b95a'),
    ...item('marble', 984, 672, 1, 0, '#b98bb8'),
    ...item('sock', 60, 650, 1.4, 20, '#9fb86a'),
    ...item('button', 120, 664, 1.1, 0, '#c7706a'),
  ]),
);

// ======================================================================= props

// ----------------------------------------------------------------- the heap

const trunkBrown = '#8a5a3b';

/** A book seen from the end: cover, cream page edges at the left. */
function book(x: number, y: number, w: number, h: number, cover: string): Node[] {
  return [
    piece(rect(x, y, w, h, 2), cover, CUT),
    piece(rect(x, y + 2, 12, h - 4, 1), '#f1e4c4', FLAT),
    ink([[x + 3, y + 4], [x + 3, y + h - 4]], { width: 1.2, color: '#b8a888', opacity: 0.8, wobble: 0.1 }),
    ink([[x + 7, y + 4], [x + 7, y + h - 4]], { width: 1.2, color: '#b8a888', opacity: 0.8, wobble: 0.1 }),
    piece(rect(x + 14, y + h - 4, w - 16, 3, 1), PAPER, { ...FLAT, opacity: 0.5 }),
  ];
}

export const lostHeap = cached(() =>
  svg({ w: 360, h: 600, name: 'wishing-lost-heap', label: 'A great wobbly heap of lost things' }, [
    // ---- the base: cushion, trunk, suitcases, a stack of books, up to y 346
    piece(curve([[6, 566], [16, 530], [90, 520], [180, 528], [290, 520], [346, 530], [356, 568], [344, 600], [180, 600], [14, 600]], 2), '#cf8f8f', CUT),
    ink([[22, 540], [180, 534], [336, 542]], { width: 3, color: '#b87070', opacity: 0.8 }),
    ...[88, 180, 272].map((x) => dot(x, 566, 5, C.brownDark)),
    // the trunk, with a lid whose top is ledge A (y 440, x 20-170)
    piece(rect(22, 444, 240, 84, 3), trunkBrown, CUT),
    piece(rect(16, 440, 252, 24, 4), '#6e452e', CUT),
    ...[60, 206].map((x) => piece(rect(x, 440, 14, 88, 1), '#4a2f20', FLAT)),
    piece(rect(130, 454, 24, 22, 3), C.brass, FLAT),
    dot(142, 464, 3, C.brassDark),
    ...[28, 252].map((x) => dot(x, 450, 3, C.brass)),
    // the teal suitcase at the right, with its handle
    piece(rect(266, 456, 80, 72, 6), '#6a9a98', CUT),
    ink([[290, 456], [292, 446], [322, 446], [324, 456]], { width: 4, color: '#3f6663' }),
    piece(rect(300, 470, 12, 58, 1), '#3f6663', FLAT),
    // the olive suitcase lying on top of the trunk's right half
    piece(rect(172, 394, 162, 48, 5), '#7b8f5a', CUT),
    piece(rect(218, 394, 12, 48, 1), '#55663c', FLAT),
    piece(rect(282, 394, 12, 48, 1), '#55663c', FLAT),
    piece(rect(244, 408, 20, 14, 2), C.brass, FLAT),
    // two books, then a furled umbrella poking out of the right side
    ...book(178, 370, 148, 26, '#c9605a'),
    ...book(186, 346, 134, 26, '#e0b95a'),
    piece(band([[296, 436], [352, 388]], 9), '#3f5a7c', CUT),
    ink([[350, 390], [358, 380], [352, 372]], { width: 4, color: C.brownDark }),
    // a sock hangs off the right of the lid
    ...sockBits(342, 482, 1.3, 8, '#9fb86a', PAPER, CUT),

    // ---- the top: ledge B (y 300) and everything above; it sways more than the base
    group({ part: 'top', origin: [180, 300] }, [
      // ledge B: three big books sliding out to the left
      ...book(66, 332, 252, 18, '#6b4f86'),
      ...book(58, 316, 270, 18, '#d9823b'),
      ...book(50, 300, 282, 18, '#4f78a8'),
      // a birdcage
      ink([[226, 214], [226, 206]], { width: 3, color: C.brassDark }),
      piece(poly([[196, 240], [226, 214], [256, 240]]), C.brass, CUT),
      piece(rect(196, 290, 60, 10, 2), C.brassDark, CUT),
      ...[200, 212, 226, 240, 252].map((x) => ink([[x, 240], [x, 290]], { width: 2.4, color: C.brass, wobble: 0.2 })),
      piece(ellipse(226, 284, 8, 7), '#e8c45a', FLAT),
      // a rocking horse's head
      piece(poly([[260, 300], [264, 256], [278, 232], [298, 226], [304, 240], [294, 252], [290, 268], [296, 300]]), '#9c9aa2', CUT),
      piece(curve([[272, 238], [266, 262], [268, 288], [280, 264], [284, 240]], 1), '#f1e4c4', { edge: 'torn', shadow: false }),
      piece(poly([[290, 228], [298, 216], [300, 232]]), '#9c9aa2', FLAT),
      dot(294, 238, 3, C.ink),
      // a teapot, spout out to the right
      piece(poly([[346, 270], [356, 254], [360, 260], [350, 284]]), '#d99a95', FLAT),
      piece(ellipse(326, 278, 25, 22), '#d99a95', CUT),
      piece(ellipse(326, 258, 14, 5), '#b87070', FLAT),
      dot(326, 252, 4, '#b87070'),
      ink([[301, 268], [292, 274], [296, 288], [304, 290]], { width: 4, color: '#b87070' }),
      // ledge C: a big old case lying flat (top y 170, x 80-342)
      piece(rect(80, 170, 262, 44, 6), '#9a5a3a', CUT),
      piece(rect(126, 170, 12, 44, 1), '#5e351f', FLAT),
      piece(rect(290, 170, 12, 44, 1), '#5e351f', FLAT),
      piece(rect(200, 182, 22, 14, 2), C.brass, FLAT),
      ink([[84, 184], [340, 184]], { width: 2, color: '#6e3f26', opacity: 0.6 }),
      // an open umbrella behind the hatbox, and a sock dangling
      ink([[300, 104], [334, 84]], { width: 3, color: C.brownDark }),
      piece(poly([[300, 100], [316, 72], [350, 78], [358, 108], [344, 100], [336, 108], [322, 100], [312, 108]]), '#c7706a', CUT),
      // a hatbox under the top hat
      piece(rect(214, 104, 98, 66, 10), '#e8dcc0', CUT),
      piece(rect(214, 124, 98, 14, 2), '#d99a95', FLAT),
      piece(rect(208, 96, 110, 16, 6), '#d99a95', CUT),
      // the top hat: its flat top (y 52, x 238-286) is where a ribbon sits
      piece(ellipse(262, 96, 44, 7), '#3a3a4a', CUT),
      piece(rect(238, 52, 48, 44, 3), '#3a3a4a', CUT),
      piece(rect(238, 80, 48, 10, 1), '#a9413a', FLAT),
      ...sockBits(318, 148, 1.2, -6, '#9fb86a', PAPER, CUT),
    ]),
  ]),
);

// ----------------------------------------------------------------- the ribbon

export const lostRibbon = cached(() =>
  svg({ w: 120, h: 80, name: 'wishing-lost-ribbon', label: 'A blue hair-ribbon tied in a bow' }, [
    // two tails
    piece(poly([[56, 40], [40, 76], [52, 70], [58, 78], [62, 44]]), C.blue, CUT),
    piece(poly([[64, 40], [80, 76], [68, 70], [62, 78], [58, 44]]), C.blue, CUT),
    // the two loops of the bow, cut like Mollie's plait ribbons
    piece(poly([[60, 34], [12, 8], [8, 58]]), C.blue, CUT),
    piece(poly([[60, 34], [108, 8], [112, 58]]), C.blue, CUT),
    ink([[56, 33], [26, 22], [18, 40]], { width: 2, color: C.blueDark, opacity: 0.5 }),
    ink([[64, 33], [94, 22], [102, 40]], { width: 2, color: C.blueDark, opacity: 0.5 }),
    // the knot
    piece(circle(60, 36, 10), C.blueDark, FLAT),
  ]),
);

// ----------------------------------------------------------------- the socks

/** Peter's odd green-and-white striped sock, toe down-right, heel on the left. */
export const lostSock = cached(() =>
  svg({ w: 90, h: 120, name: 'wishing-lost-sock', label: 'An odd striped sock' }, [
    piece(curve([[22, 22], [58, 22], [60, 62], [78, 74], [86, 98], [74, 112], [50, 112], [30, 102], [16, 84], [22, 56]], 2), PAPER, CUT),
    // stripes down the leg
    ...[30, 44, 58].map((y) => piece(rect(23, y, 35, 7, 1), C.green, FLAT)),
    // stripes across the foot
    ...[44, 58, 72].map((x) => piece(poly([[x, 70], [x + 7, 70], [x + 7, 108], [x, 106]]), C.green, FLAT)),
    // the cuff, the heel and the toe
    piece(rect(20, 14, 42, 14, 2), C.green, CUT),
    piece(curve([[16, 70], [26, 68], [32, 82], [30, 98], [18, 92], [14, 82]], 1), C.greenDark, FLAT),
    piece(curve([[70, 88], [84, 92], [84, 104], [74, 110], [66, 104]], 1), C.greenDark, FLAT),
  ]),
);

/** An armful of odd socks, mostly Peter's green and white. */
export const lostSocks = cached(() =>
  svg({ w: 180, h: 130, name: 'wishing-lost-socks', label: 'An armful of odd socks' }, [
    piece(ellipse(90, 116, 78, 10), 'rgba(40,25,10,0.16)', FLAT),
    // a squashy bundle under everything
    piece(curve([[14, 84], [26, 50], [70, 34], [120, 36], [160, 56], [168, 92], [140, 114], [60, 116]], 2), '#b9a57e', CUT),
    ...[
      [38, 66, 1.6, -24, '#e0b95a', PAPER],
      [140, 70, 1.6, 22, '#c7706a', PAPER],
      [88, 54, 1.8, 6, '#6f8fa8', PAPER],
      [58, 88, 1.8, 28, C.green, PAPER],
      [118, 92, 1.8, -20, C.green, PAPER],
      [30, 44, 1.5, -40, C.green, PAPER],
      [150, 46, 1.5, 38, C.green, PAPER],
      [76, 34, 1.7, -12, PAPER, C.green],
      [108, 30, 1.7, 18, PAPER, C.green],
      [92, 84, 1.9, 4, C.green, PAPER],
    ].flatMap(([x, y, s, r, body, stripe]) => {
      const b = body as string;
      const st = stripe as string;
      return sockBits(x as number, y as number, s as number, r as number, b, st, CUT);
    }),
    // a couple of toes and cuffs flopping out at the front
    ...sockBits(24, 100, 1.4, 70, C.green, PAPER, CUT),
    ...sockBits(158, 98, 1.4, -70, C.green, PAPER, CUT),
  ]),
);

// ------------------------------------------------------------- spectacles

/** A half-moon lens (flat top) centred on cx. */
function halfMoon(cx: number, top: number, rx: number, ry: number): Pt[] {
  const pts: Pt[] = [[cx - rx, top], [cx + rx, top]];
  for (let i = 1; i < 10; i++) {
    const a = (i / 10) * Math.PI;
    pts.push([cx + Math.cos(a) * rx, top + Math.sin(a) * ry]);
  }
  return pts;
}

export const lostSpectacles = cached(() =>
  svg({ w: 120, h: 50, name: 'wishing-lost-spectacles', label: 'Half-moon spectacles' }, [
    ink([[10, 13], [2, 20], [3, 26]], { width: 3, color: C.brass, wobble: 0.1 }),
    ink([[110, 13], [118, 20], [117, 26]], { width: 3, color: C.brass, wobble: 0.1 }),
    ink([[54, 20], [60, 14], [66, 20]], { width: 3, color: C.brass, wobble: 0.1 }),
    ...[32, 88].flatMap((cx) => [
      piece(halfMoon(cx, 10, 26, 32), C.brass, FLAT),
      piece(halfMoon(cx, 15, 20, 24), '#dcecf0', { ...FLAT, opacity: 0.8 }),
    ]),
    piece(poly([[20, 20], [26, 17], [30, 21], [24, 25]]), PAPER, { ...FLAT, opacity: 0.9 }),
    piece(poly([[78, 20], [84, 17], [88, 21], [82, 25]]), PAPER, { ...FLAT, opacity: 0.9 }),
  ]),
);

// -------------------------------------------------------------------- the bell

export const lostBell = cached(() =>
  svg({ w: 120, h: 240, name: 'wishing-lost-bell', label: 'A brass hand-bell on a post' }, [
    // the post, flat at the bottom (y 240)
    piece(rect(8, 226, 60, 14, 2), '#6e4a30', CUT),
    piece(rect(26, 20, 24, 210, 2), '#8a5a3b', CUT),
    ink([[34, 26], [33, 226]], { width: 1.6, color: C.brownDark, opacity: 0.35 }),
    ink([[43, 26], [44, 226]], { width: 1.6, color: C.brownDark, opacity: 0.35 }),
    // the curly iron bracket
    piece(band([[38, 30], [60, 22], [86, 24], [90, 34]], 5), '#3a3a40', CUT),
    ink([[60, 22], [64, 40], [52, 46], [46, 38]], { width: 3, color: '#3a3a40', wobble: 0.2 }),
    ink([[38, 62], [52, 44]], { width: 4, color: '#3a3a40' }),
    // the bell, hanging from the hook, with its pull-cord
    group({ part: 'bell', origin: [90, 38] }, [
      ink([[90, 36], [90, 54]], { width: 3, color: '#3a3a40' }),
      piece(curve([[76, 112], [78, 84], [84, 62], [96, 62], [102, 84], [104, 112], [112, 122], [68, 122]], 2), C.brass, CUT),
      piece(curve([[84, 70], [90, 66], [86, 96], [80, 112]], 1), '#e8d3a8', { ...FLAT, opacity: 0.6 }),
      piece(rect(68, 117, 44, 6, 2), C.brassDark, FLAT),
      dot(90, 128, 6, C.brassDark),
      ink([[90, 130], [92, 160], [88, 184]], { width: 3, color: '#c7a86a', wobble: 0.2 }),
      piece(ellipse(88, 190, 6, 9), '#c9605a', FLAT),
    ]),
  ]),
);

// ----------------------------------------------------------------- kite, glove

export const lostKite = cached(() =>
  svg({ w: 120, h: 160, name: 'wishing-lost-kite', label: 'A kite with a bow-tied tail' }, [
    ink([[60, 112], [50, 124], [66, 134], [48, 146], [58, 156]], { width: 2.4, color: C.brownDark, opacity: 0.8, wobble: 0.2 }),
    ...[[52, 124], [62, 134], [50, 146]].map(([x, y], i) =>
      [piece(poly([[x, y], [x - 9, y - 6], [x - 9, y + 6]]), i % 2 ? C.blue : C.yellow, FLAT), piece(poly([[x, y], [x + 9, y - 6], [x + 9, y + 6]]), i % 2 ? C.blue : C.yellow, FLAT)],
    ).flat(),
    piece(poly([[60, 6], [104, 52], [60, 112], [16, 52]]), C.red, CUT),
    piece(poly([[60, 6], [104, 52], [60, 52]]), C.yellow, FLAT),
    piece(poly([[60, 52], [16, 52], [60, 112]]), C.yellow, FLAT),
    ink([[60, 6], [60, 112]], { width: 2.4, color: C.brownDark, opacity: 0.7 }),
    ink([[16, 52], [104, 52]], { width: 2.4, color: C.brownDark, opacity: 0.7 }),
  ]),
);

export const lostGlove = cached(() =>
  svg({ w: 90, h: 100, name: 'wishing-lost-glove', label: 'A red woolly glove' }, [
    piece(curve([[24, 60], [8, 50], [8, 40], [14, 36], [30, 50]], 1), C.red, CUT),
    ...[[24, 18], [37, 12], [50, 14], [63, 24]].map(([x, y]) => piece(rect(x, y, 13, 44, 6), C.red, CUT)),
    piece(rect(22, 40, 54, 46, 8), C.red, CUT),
    piece(rect(20, 80, 58, 18, 3), C.redDark, CUT),
    ...[28, 38, 48, 58, 68].map((x) => ink([[x, 82], [x, 96]], { width: 2, color: C.red, opacity: 0.8, wobble: 0.1 })),
    ...[[30, 24], [43, 18], [56, 20], [69, 30]].map(([x, y]) => ink([[x, y + 6], [x, y + 26]], { width: 1.6, color: C.redDark, opacity: 0.4, wobble: 0.3 })),
  ]),
);
