/**
 * Uncle Sailor Bill's props (the Teddy Bear Treasury), in the book's
 * watercolour-and-ink look: a grey storm cloud with its rain, his little
 * varnished motor boat, his concertina, an old rag mat that rolls up, and
 * the boat-house "shipwreck" the bears climb round without touching the
 * floor (the sea).
 *
 * Parts that scripts can move (all drawn at rest):
 *   storm-cloud   'rain' (hidden): slanting streaks from the underside to the bottom edge
 *   motor-boat    'flag': the red-and-white flag and its stick, hinged at the stick's foot
 *   concertina    'endL', 'bellows', 'endR': squeeze by scaling 'bellows' in x about its middle
 *                 while the ends move in (the ends are drawn over the bellows' edges)
 *   rag-mat       'flat': the mat on the floor; 'rolled' (hidden): the same mat as a fat roll
 *                 at the left end, on the same floor line
 *   shipwreck     no parts: a barrel with a plank over it, a long plank on two upturned
 *                 chairs, old sacks, a rolled mat and a sea chest. Three flat standing spots.
 */
import { band, cached, circle, curve, dot, ellipse, group, rect, svg, type Node, type Pt } from '../../art/paper';
import { blot, clipped, deeper, pen, wash } from '../../art/watercolour';

/** Points from a flat list of numbers: P(x0, y0, x1, y1 …). */
const P = (...n: number[]): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i + 1 < n.length; i += 2) out.push([n[i], n[i + 1]]);
  return out;
};

const RED = '#d9503f';
const YELLOW = '#f2cd45';
const BLUE = '#6f9bc9';
const GREEN = '#6aa56a';
const CREAM = '#fbf8f0';
const SHADE = '#cfd9e6';
const WOOD = '#c99a5e';
const BROWN = '#8f5f35';
const BRASS = '#d6aa43';
const IRON = '#4a4f58';

/** A flat plank of old wood with grain and nails: x, y, w, h, and its own seed-free grain lines. */
function plank(x: number, y: number, w: number, h: number, col = WOOD): Node[] {
  const body = rect(x, y, w, h, 2);
  return [
    wash(body, col, { shade: deeper(col, 0.3), light: -100, depth: 0.3, hatch: 7, lineWidth: 2.4, wobble: 0.8 }),
    pen(P(x + 8, y + h * 0.35, x + w * 0.4, y + h * 0.3, x + w * 0.7, y + h * 0.4, x + w - 8, y + h * 0.33), { width: 1, color: deeper(col, 0.6), opacity: 0.5 }),
    pen(P(x + 14, y + h * 0.72, x + w * 0.5, y + h * 0.68, x + w - 20, y + h * 0.74), { width: 1, color: deeper(col, 0.6), opacity: 0.45 }),
    dot(x + 8, y + h / 2, 1.6, '#3d2a1c'),
    dot(x + w - 8, y + h / 2, 1.6, '#3d2a1c'),
  ];
}

// ---------------------------------------------------------------------------
// The storm cloud
// ---------------------------------------------------------------------------

const stormCloud = cached(() => {
  const GREY = '#9ba3ad';
  const LIGHT = '#b4bbc4';
  const DARK = '#68727e';
  const circles: number[][] = [[66, 112, 40], [132, 118, 46], [205, 120, 48], [278, 112, 42], [100, 70, 48], [180, 56, 54], [258, 76, 44], [40, 100, 26], [320, 96, 26]];
  // the outline of all the puffs together: points on each circle that no other circle covers
  const edge: { a: number; p: Pt }[] = [];
  circles.forEach(([cx, cy, r], i) => {
    for (let k = 0; k < 90; k++) {
      const t = (k / 90) * Math.PI * 2;
      const x = cx + Math.cos(t) * r;
      const y = cy + Math.sin(t) * r;
      if (circles.some(([ox, oy, or], j) => j !== i && Math.hypot(x - ox, y - oy) < or - 0.5)) continue;
      edge.push({ a: Math.atan2(y - 100, (x - 180) * 0.7), p: [x, y] });
    }
  });
  const outline = edge.sort((m, n) => m.a - n.a).map((e) => e.p);
  const puff = (cx: number, cy: number, rx: number, ry: number): Node =>
    pen(P(cx - rx * 0.8, cy + ry * 0.2, cx - rx * 0.6, cy - ry * 0.5, cx, cy - ry * 0.8, cx + rx * 0.6, cy - ry * 0.5), { width: 1.6, color: '#3d4650', opacity: 0.7, breaks: 0.2 });
  const lower: number[][] = [[66, 112, 52, 32], [132, 122, 56, 32], [205, 124, 60, 32], [278, 114, 54, 32]];
  const streaks: Node[] = [];
  const xs = [58, 92, 126, 160, 194, 228, 262, 296, 328];
  const ends = [200, 188, 198, 192, 200, 186, 196, 200, 190];
  xs.forEach((x, i) => {
    const y0 = 150 + (i % 3) * 2;
    streaks.push(pen(P(x, y0, x - 11, (y0 + ends[i]) / 2, x - 22, ends[i]), { width: 2.2, color: i % 2 ? '#7f93a8' : '#6f8299', breaks: 0, opacity: 0.85 }));
  });
  [75, 143, 211, 245, 311].forEach((x, i) => streaks.push(pen(P(x, 156, x - 8, 176, x - 16, 196 - (i % 2) * 6), { width: 1.6, color: '#9fb2c6', breaks: 0, opacity: 0.8 })));
  return svg({ w: 360, h: 200, name: 'bears-storm-cloud' }, [
    wash(outline, GREY, { shade: DARK, light: -100, depth: 0.22, lineWidth: 2.6, wobble: 1.2 }),
    clipped(outline, [blot(ellipse(180, 50, 60, 24), LIGHT, 0.7), blot(ellipse(100, 70, 44, 22), LIGHT, 0.5), blot(ellipse(262, 76, 34, 18), LIGHT, 0.5)]),
    // pen scallops inside, where one puff tucks behind another
    puff(66, 112, 40, 40), puff(132, 118, 46, 46), puff(205, 120, 48, 48), puff(278, 112, 42, 42),
    puff(100, 70, 48, 48), puff(180, 56, 54, 54), puff(258, 76, 44, 44),
    // the darker glaze under the cloud, and pen hatching under that
    ...lower.map(([cx, cy, rx]) => blot(ellipse(cx, cy + 20, rx * 0.8, 9), DARK, 0.5)),
    ...lower.flatMap(([cx, cy]) => [-18, -6, 6, 18].map((d) => pen(P(cx + d, cy + 14, cx + d - 5, cy + 26), { width: 1.2, color: '#3d4650', opacity: 0.6, breaks: 0 }))),
    // a few curls of pen inside the high puffs, as in the book
    pen(P(70, 56, 88, 44, 112, 46), { width: 1.4, opacity: 0.5 }),
    pen(P(160, 36, 182, 28, 204, 34), { width: 1.4, opacity: 0.5 }),
    pen(P(240, 66, 258, 58, 276, 64), { width: 1.4, opacity: 0.5 }),
    group({ part: 'rain', opacity: 0 }, streaks),
  ]);
});

// ---------------------------------------------------------------------------
// Uncle Bill's motor boat
// ---------------------------------------------------------------------------

const motorBoat = cached(() => {
  const VARNISH = '#b9783c';
  const hull = curve(P(70, 106, 300, 104, 520, 102, 566, 88, 550, 142, 506, 190, 440, 206, 130, 206, 86, 186, 76, 140), 1);
  const wave: Pt[] = [];
  for (let x = 0; x <= 600; x += 20) wave.push([x, 200 + Math.sin(x / 14) * 2.5]);
  const water = [...wave, [600, 240] as Pt, [0, 240] as Pt];
  return svg({ w: 600, h: 240, name: 'bears-motor-boat' }, [
    // the hull: varnished planks, a pale blue stripe, a brass cleat at the bow
    wash(hull, VARNISH, { shade: deeper(VARNISH, 0.3), light: -120, depth: 0.2, hatch: 8, lineWidth: 2.8, wobble: 1 }),
    clipped(hull, [
      wash(band(P(60, 150, 250, 152, 450, 148, 580, 122), 14), '#a9cbe6', { line: false, shade: false, bloom: false, wobble: 0.5 }),
      pen(P(76, 124, 300, 126, 480, 122, 556, 106), { width: 1.2, color: deeper(VARNISH, 0.6), opacity: 0.55 }),
      pen(P(80, 174, 300, 176, 460, 170, 540, 148), { width: 1.2, color: deeper(VARNISH, 0.6), opacity: 0.55 }),
      blot(ellipse(220, 124, 90, 6), '#f4d9a8', 0.5),
    ]),
    pen(P(70, 142, 300, 144, 456, 140, 560, 114), { width: 1.2, color: '#4f7ca8', opacity: 0.6 }),
    pen(P(70, 158, 300, 160, 452, 156, 548, 132), { width: 1.2, color: '#4f7ca8', opacity: 0.6 }),
    wash(rect(530, 112, 14, 8, 3), BRASS, { shade: deeper(BRASS, 0.3), lineWidth: 1.6, bloom: false, depth: 0.4 }),
    // the gunwale: a darker rail along the straight top edge
    wash(P(66, 95, 520, 93, 570, 81, 570, 91, 522, 108, 66, 112), BROWN, { shade: deeper(BROWN, 0.3), light: -100, depth: 0.4, lineWidth: 2.4, bloom: false, wobble: 0.8 }),
    blot(ellipse(260, 100, 150, 2.4), '#e6c08a', 0.5),
    // the little windscreen at the front
    wash(P(482, 98, 497, 58, 513, 56, 527, 96), '#cfe4f2', { shade: '#9dbfd8', light: -120, depth: 0.3, lineWidth: 2.2, bloom: false, wobble: 0.6, opacity: 0.85 }),
    blot(ellipse(500, 78, 2.6, 14, 14), '#ffffff', 0.7),
    pen(P(484, 94, 499, 58, 511, 56, 525, 94), { width: 2.6, color: '#8a6a2c', breaks: 0 }),
    wash(rect(478, 92, 52, 8, 2), BRASS, { shade: deeper(BRASS, 0.3), lineWidth: 1.6, bloom: false, depth: 0.4 }),
    // the outboard engine clamped to the transom, its shaft going down into the water
    group({ part: 'engine', origin: [72, 110] }, [
      wash(band(P(38, 124, 41, 170, 43, 216), 12), '#9aa4ae', { shade: '#6f7a86', light: -120, depth: 0.4, lineWidth: 2, bloom: false, wobble: 0.6 }),
      wash(P(38, 196, 18, 214, 42, 212), '#7f8a96', { shade: '#5a6572', lineWidth: 1.8, bloom: false, depth: 0.4, wobble: 0.5 }),
      wash(rect(62, 98, 16, 28, 3), IRON, { shade: '#2a2e36', lineWidth: 1.8, bloom: false, depth: 0.4 }),
      wash(rect(12, 100, 52, 26, 5), '#aab3bc', { shade: '#7b8793', light: -100, depth: 0.3, hatch: 6, lineWidth: 2.4, bloom: false }),
      wash(P(10, 98, 12, 80, 22, 70, 52, 70, 64, 80, 66, 98), RED, { shade: deeper(RED, 0.3), light: -120, depth: 0.28, hatch: 7, lineWidth: 2.6, wobble: 0.8 }),
      pen(P(18, 90, 38, 86, 58, 90), { width: 1.4, color: '#fbf8f0', opacity: 0.8, breaks: 0 }),
      blot(ellipse(22, 84, 3, 8, 20), '#ffffff', 0.5),
      pen(P(38, 70, 40, 62, 34, 58), { width: 2.2, color: '#3d2a1c', breaks: 0 }),
      wash(ellipse(32, 57, 9, 4.4, -8), YELLOW, { shade: deeper(YELLOW, 0.3), lineWidth: 1.8, bloom: false, depth: 0.4 }),
    ]),
    // the water, over the bottom of the hull, with a white wake behind the stern
    // (soft-edged, no outline: it blends into whatever river the boat sits on, rather than showing a box of water)
    blot(curve(water, 1), '#8fb6d8', 0.92),
    blot(ellipse(300, 210, 330, 30), '#8fb6d8', 0.6),
    pen(P(150, 216, 190, 213, 230, 217), { width: 1.6, color: '#d9ecf8', opacity: 0.9 }),
    pen(P(300, 224, 350, 221, 400, 225), { width: 1.6, color: '#d9ecf8', opacity: 0.9 }),
    pen(P(450, 218, 490, 215, 530, 219), { width: 1.6, color: '#d9ecf8', opacity: 0.9 }),
    pen(P(200, 232, 250, 229, 300, 233), { width: 1.4, color: '#5f8fb8', opacity: 0.6 }),
    blot(ellipse(52, 204, 46, 7), '#ffffff', 0.85),
    blot(ellipse(26, 216, 30, 5), '#ffffff', 0.75),
    blot(ellipse(78, 214, 22, 4), '#ffffff', 0.8),
    pen(P(8, 200, 34, 197, 62, 201, 92, 198), { width: 1.8, color: '#ffffff', opacity: 0.95 }),
    pen(P(4, 222, 30, 219, 58, 223, 84, 220), { width: 1.6, color: '#ffffff', opacity: 0.85 }),
    pen(P(30, 208, 52, 206, 72, 209), { width: 1.4, color: '#5f8fb8', opacity: 0.5 }),
    // a curl of foam at the bow
    blot(ellipse(552, 203, 24, 5), '#ffffff', 0.85),
    pen(P(528, 199, 546, 195, 566, 198, 584, 202), { width: 1.8, color: '#ffffff', opacity: 0.95 }),
    // the flag on its stick at the stern, hinged at the stick's foot
    group({ part: 'flag', origin: [92, 100] }, [
      wash(band(P(92, 102, 92, 62, 92, 30), 5), WOOD, { shade: deeper(WOOD, 0.3), lineWidth: 1.6, bloom: false, depth: 0.4 }),
      wash(P(90, 34, 70, 30, 48, 36, 50, 58, 70, 56, 90, 54), CREAM, { shade: SHADE, light: -90, depth: 0.3, lineWidth: 1.8, bloom: false, wobble: 0.5 }),
      clipped(P(90, 34, 70, 30, 48, 36, 50, 58, 70, 56, 90, 54), [
        wash(P(40, 32, 100, 28, 100, 40, 40, 44), RED, { line: false, shade: false, bloom: false, wobble: 0.4 }),
        wash(P(40, 48, 100, 44, 100, 56, 40, 60), RED, { line: false, shade: false, bloom: false, wobble: 0.4 }),
      ]),
      dot(92, 28, 3.4, BRASS),
    ]),
  ]);
});

// ---------------------------------------------------------------------------
// Uncle Bill's concertina
// ---------------------------------------------------------------------------

const concertina = cached(() => {
  const VARNISH = '#a8693a';
  const N = 10;
  const x0 = 44;
  const x1 = 156;
  const step = (x1 - x0) / N;
  const zig = (y: number, amp: number): Pt[] => Array.from({ length: N + 1 }, (_, i) => [x0 + i * step, y + (i % 2 ? amp : 0)] as Pt);
  const bellowsShape = [...zig(24, 6), ...zig(124, 6).reverse().map(([x, y]) => [x, y + 0] as Pt)];
  const pleats: Node[] = [];
  for (let i = 0; i < N; i += 2) pleats.push(wash(P(x0 + i * step, 18, x0 + (i + 1) * step, 18, x0 + (i + 1) * step, 140, x0 + i * step, 140), RED, { line: false, shade: false, bloom: false, wobble: 0.3 }));
  const folds: Node[] = [];
  for (let i = 1; i < N; i++) folds.push(pen(P(x0 + i * step, 28, x0 + i * step + (i % 2 ? 2 : -2), 76, x0 + i * step, 124), { width: 1.4, color: '#5e3a2a', opacity: 0.65, breaks: 0 }));
  const end = (ox: number, side: number): Node[] => {
    const hex = P(ox + 23, 6, ox + 46, 26, ox + 46, 120, ox + 23, 142, ox, 120, ox, 26);
    const rows: Node[] = [];
    [[36, 0], [58, 1], [80, 0]].forEach(([y, odd]) => {
      [13, 33].forEach((dx, c) => {
        const px = ox + dx;
        const py = y + (c === 1 ? 10 : 0) + odd * 0;
        rows.push(wash(circle(px, py, 5.4), CREAM, { shade: SHADE, lineWidth: 1.6, bloom: false, depth: 0.4 }));
        rows.push(dot(px, py, 2.2, BRASS));
      });
    });
    return [
      wash(hex, VARNISH, { shade: deeper(VARNISH, 0.3), light: side < 0 ? -130 : -50, depth: 0.25, hatch: 7, lineWidth: 2.8, wobble: 0.8 }),
      pen(P(ox + 6, 32, ox + 6, 114), { width: 1.2, color: '#e6c08a', opacity: 0.6 }),
      ...rows,
      // the leather strap across the foot of the end, with a brass buckle
      wash(rect(ox - 1, 100, 48, 13, 2), '#5a3a22', { shade: '#3a2414', lineWidth: 1.8, bloom: false, depth: 0.4, wobble: 0.5 }),
      wash(rect(ox + 16, 98, 14, 17, 2), BRASS, { shade: deeper(BRASS, 0.3), lineWidth: 1.6, bloom: false, depth: 0.4 }),
      dot(ox + 23, 106.5, 2, '#3d2a1c'),
    ];
  };
  return svg({ w: 200, h: 150, name: 'bears-concertina' }, [
    group({ part: 'bellows', origin: [100, 75] }, [
      wash(bellowsShape, CREAM, { shade: '#d9c9a4', light: -90, depth: 0.2, lineWidth: 2.4, bloom: false, wobble: 0.6 }),
      clipped(bellowsShape, pleats),
      ...folds,
      pen(zig(24, 6), { width: 1.6, breaks: 0 }),
      pen(zig(124, 6), { width: 1.6, breaks: 0 }),
      blot(ellipse(100, 120, 50, 6), '#7a4a2c', 0.35),
    ]),
    group({ part: 'endL' }, end(6, -1)),
    group({ part: 'endR' }, end(148, 1)),
  ]);
});

// ---------------------------------------------------------------------------
// The rag mat
// ---------------------------------------------------------------------------

const ragMat = cached(() => {
  const COLS = [RED, CREAM, BLUE, YELLOW, GREEN, CREAM];
  // flat: a long low shape in perspective, the far edge shorter than the near one
  const flatShape = P(36, 76, 226, 76, 254, 112, 6, 112);
  const topX = (f: number): number => 36 + 190 * f;
  const botX = (f: number): number => 6 + 248 * f;
  const nStripes = 12;
  const stripes: Node[] = [];
  for (let i = 0; i < nStripes; i++) {
    const f0 = i / nStripes;
    const f1 = (i + 1) / nStripes;
    stripes.push(wash(P(topX(f0), 74, topX(f1), 74, botX(f1), 114, botX(f0), 114), COLS[i % COLS.length], { line: false, shade: false, bloom: false, wobble: 0.4, opacity: 0.95 }));
  }
  const rags: Node[] = [];
  for (let i = 0; i < 18; i++) {
    const f = (i + 0.5) / 18;
    rags.push(pen(P(topX(f) - 1, 80 + (i % 3) * 3, botX(f) - 3, 100 + (i % 2) * 6), { width: 1, color: deeper('#8a6a4a', 0.2), opacity: 0.35, breaks: 0 }));
  }
  const fringe: Node[] = [];
  for (let k = 0; k < 6; k++) {
    const y = 80 + k * 6;
    const xl = 36 - ((y - 76) / 36) * 30;
    const xr = 226 + ((y - 76) / 36) * 28;
    fringe.push(pen(P(xl, y, xl - 9, y + 1), { width: 1.4, color: '#c9b89a', breaks: 0 }));
    fringe.push(pen(P(xr, y, xr + 9, y + 1), { width: 1.4, color: '#c9b89a', breaks: 0 }));
  }
  // rolled: a fat sausage on its side at the left, its base on the floor line (y 112)
  const body = rect(30, 44, 96, 68, 3);
  const rolledStripes: Node[] = [];
  for (let i = 0; i < 6; i++) rolledStripes.push(wash(rect(30 + i * 17, 40, 17, 76), COLS[i % COLS.length], { line: false, shade: false, bloom: false, wobble: 0.4 }));
  return svg({ w: 260, h: 120, name: 'bears-rag-mat' }, [
    blot(ellipse(130, 114, 124, 5), '#8f9b7a', 0.35),
    group({ part: 'flat', origin: [130, 112] }, [
      wash(flatShape, CREAM, { shade: '#cdbf9a', light: -90, depth: 0.12, lineWidth: 2.4, bloom: false, wobble: 1 }),
      clipped(flatShape, [...stripes, ...rags, blot(ellipse(70, 84, 40, 3), '#ffffff', 0.4)]),
      ...fringe,
      pen(P(36, 76, 130, 75, 226, 76), { width: 1.4, color: '#5e4a36', opacity: 0.6 }),
    ]),
    group({ part: 'rolled', opacity: 0 }, [
      wash(body, CREAM, { shade: '#cdbf9a', light: -100, depth: 0.25, lineWidth: 2.6, bloom: false, hatch: 8 }),
      clipped(body, rolledStripes),
      wash(ellipse(126, 78, 10, 34), COLS[1], { shade: '#cdbf9a', lineWidth: 2.2, bloom: false, depth: 0.3 }),
      blot(ellipse(70, 52, 40, 4), '#ffffff', 0.45),
      // the string round the middle
      pen(P(92, 44, 94, 78, 92, 112), { width: 2.2, color: '#5a3a22', breaks: 0 }),
      pen(P(97, 44, 99, 78, 97, 112), { width: 1.6, color: '#5a3a22', breaks: 0 }),
      // the spiral end facing us
      wash(ellipse(30, 78, 20, 34), '#e9dfc4', { shade: '#cdbf9a', light: -120, depth: 0.2, lineWidth: 2.6, bloom: false }),
      pen(P(30, 78, 34, 76, 33, 70, 24, 68, 20, 76, 24, 88, 38, 92, 46, 80, 42, 62, 28, 52), { width: 2, color: RED, breaks: 0 }),
      pen(P(30, 78, 24, 80, 26, 84), { width: 1.6, color: BLUE, breaks: 0 }),
    ]),
  ]);
});

// ---------------------------------------------------------------------------
// The shipwreck
// ---------------------------------------------------------------------------

const shipwreck = cached(() => {
  const HESSIAN = '#cdb37a';
  const sack = (cx: number, cy: number, rx: number, ry: number, neck: number): Node[] => {
    const body = curve(P(cx - rx * 0.5, cy - ry + 6, cx - rx, cy - ry * 0.3, cx - rx * 1.02, cy + ry * 0.5, cx - rx * 0.6, cy + ry, cx, cy + ry + 2, cx + rx * 0.6, cy + ry, cx + rx * 1.02, cy + ry * 0.5, cx + rx, cy - ry * 0.3, cx + rx * 0.5, cy - ry + 6, cx + 6, cy - ry - 2, cx - 6, cy - ry - 2), 2);
    return [
      wash(body, HESSIAN, { shade: deeper(HESSIAN, 0.35), light: -120, depth: 0.28, hatch: 6, lineWidth: 2.4, wobble: 1.6 }),
      wash(P(cx - 7, cy - ry, cx - 10, cy - ry - neck, cx + 10, cy - ry - neck - 4, cx + 7, cy - ry), HESSIAN, { shade: deeper(HESSIAN, 0.35), depth: 0.3, lineWidth: 2, bloom: false, wobble: 0.8 }),
      pen(P(cx - 9, cy - ry - 2, cx, cy - ry + 2, cx + 9, cy - ry - 2), { width: 2.2, color: '#5a3a22', breaks: 0 }),
      pen(P(cx - rx * 0.5, cy - ry * 0.2, cx - rx * 0.2, cy + ry * 0.3), { width: 1.2, color: deeper(HESSIAN, 0.6), opacity: 0.5 }),
      pen(P(cx + rx * 0.2, cy - ry * 0.4, cx + rx * 0.5, cy + ry * 0.1), { width: 1.2, color: deeper(HESSIAN, 0.6), opacity: 0.5 }),
      blot(ellipse(cx - rx * 0.45, cy - ry * 0.3, 4, ry * 0.4, 14), '#fff5d6', 0.4),
    ];
  };
  const barrelShape = curve(P(36, 208, 70, 192, 108, 187, 146, 192, 182, 208, 186, 262, 182, 310, 146, 314, 108, 316, 70, 314, 36, 310, 32, 262), 1);
  const hoop = (x: number): Node =>
    wash(P(x - 5, 196, x + 5, 196, x + 5, 308, x - 5, 308), IRON, { shade: '#2a2e36', lineWidth: 1.6, bloom: false, depth: 0.4, wobble: 0.5 });
  const chair = (x0: number): Node[] => [
    // an upturned chair: the seat flat on the floor, legs in the air, a rung between them
    wash(rect(x0, 296, 72, 18, 3), WOOD, { shade: deeper(WOOD, 0.3), light: -100, depth: 0.3, lineWidth: 2.2, bloom: false }),
    wash(rect(x0 + 10, 154, 8, 144, 2), deeper(WOOD, 0.1), { shade: deeper(WOOD, 0.4), lineWidth: 1.8, bloom: false, depth: 0.4, wobble: 0.6 }),
    wash(rect(x0 + 54, 154, 8, 144, 2), deeper(WOOD, 0.1), { shade: deeper(WOOD, 0.4), lineWidth: 1.8, bloom: false, depth: 0.4, wobble: 0.6 }),
    wash(rect(x0 + 16, 226, 40, 6, 2), WOOD, { shade: deeper(WOOD, 0.3), lineWidth: 1.4, bloom: false, depth: 0.4 }),
    // the back of the chair lying along the floor beside the seat
    wash(P(x0 - 30, 300, x0 + 2, 298, x0 + 2, 312, x0 - 30, 314), deeper(WOOD, 0.15), { shade: deeper(WOOD, 0.4), lineWidth: 1.8, bloom: false, depth: 0.4 }),
    pen(P(x0 - 22, 300, x0 - 22, 313), { width: 1.2, opacity: 0.6 }),
    pen(P(x0 - 12, 300, x0 - 12, 313), { width: 1.2, opacity: 0.6 }),
  ];
  const lidShape = rect(612, 232, 140, 32, 6);
  const chestBody = rect(620, 262, 124, 54, 3);
  const strap = (x: number): Node => wash(rect(x, 232, 12, 84), IRON, { shade: '#2a2e36', lineWidth: 1.4, bloom: false, depth: 0.4, wobble: 0.4 });
  const COLS = [RED, CREAM, BLUE, YELLOW, GREEN];
  const matStripes: Node[] = [];
  for (let i = 0; i < 4; i++) matStripes.push(wash(rect(566 + i * 10, 260, 10, 58), COLS[i], { line: false, shade: false, bloom: false, wobble: 0.4 }));
  const matBody = rect(566, 264, 38, 52, 2);
  return svg({ w: 760, h: 320, name: 'bears-shipwreck' }, [
    blot(ellipse(382, 316, 372, 7), '#8f9b7a', 0.4),
    // a barrel on its side, chocked, with a short plank laid over it
    wash(P(48, 316, 70, 316, 62, 300), '#6f4526', { shade: '#4a2c1c', lineWidth: 1.8, bloom: false, depth: 0.4 }),
    wash(P(146, 316, 168, 316, 156, 300), '#6f4526', { shade: '#4a2c1c', lineWidth: 1.8, bloom: false, depth: 0.4 }),
    wash(barrelShape, WOOD, { shade: deeper(WOOD, 0.35), light: -120, depth: 0.25, lineWidth: 2.8, wobble: 1 }),
    clipped(barrelShape, [
      ...[212, 226, 240, 254, 268, 282, 296].map((y) => pen(P(34, y, 108, y - 3 + (y % 2), 184, y), { width: 1.1, color: deeper(WOOD, 0.6), opacity: 0.5, breaks: 0 })),
      blot(ellipse(80, 230, 6, 30), '#fff0cc', 0.45),
      hoop(62),
      hoop(154),
    ]),
    ...plank(14, 172, 190, 15, '#d4a666'),
    // a long plank across two upturned chairs: the highest spot
    ...chair(222),
    ...chair(396),
    ...plank(205, 132, 280, 16),
    // a pile of old sacks
    ...sack(494, 284, 34, 32, 14),
    ...sack(536, 292, 26, 24, 12),
    ...sack(512, 242, 28, 26, 14),
    // a rolled-up mat, with its string
    wash(matBody, CREAM, { shade: '#cdbf9a', light: -100, depth: 0.25, lineWidth: 2.2, bloom: false }),
    clipped(matBody, matStripes),
    wash(ellipse(566, 290, 14, 26), '#e9dfc4', { shade: '#cdbf9a', lineWidth: 2.2, bloom: false, depth: 0.3 }),
    pen(P(566, 290, 570, 288, 568, 282, 560, 282, 558, 290, 564, 298, 574, 296), { width: 1.6, color: RED, breaks: 0 }),
    pen(P(584, 264, 585, 290, 584, 316), { width: 1.8, color: '#5a3a22', breaks: 0 }),
    // the sea chest: iron-bound, flat lid, brass lock
    wash(chestBody, BROWN, { shade: deeper(BROWN, 0.3), light: -120, depth: 0.28, hatch: 7, lineWidth: 2.8 }),
    pen(P(624, 282, 684, 285, 740, 282), { width: 1.1, color: deeper(BROWN, 0.6), opacity: 0.5 }),
    wash(lidShape, '#a06c3c', { shade: deeper(BROWN, 0.35), light: -110, depth: 0.25, hatch: 7, lineWidth: 2.8 }),
    pen(P(620, 240, 680, 238, 744, 240), { width: 1.1, color: '#e6c08a', opacity: 0.6 }),
    clipped(lidShape, [strap(634), strap(708)]),
    strap(634),
    strap(708),
    wash(rect(674, 252, 20, 22, 3), BRASS, { shade: deeper(BRASS, 0.3), lineWidth: 1.8, bloom: false, depth: 0.4 }),
    dot(684, 260, 2.6, '#3d2a1c'),
    ...[[622, 238], [742, 238], [624, 308], [740, 308]].map(([x, y]) => dot(x, y, 2.4, BRASS)),
  ]);
});

export const sailorProps: Record<string, () => string> = {
  'storm-cloud': stormCloud,
  'motor-boat': motorBoat,
  'concertina': concertina,
  'rag-mat': ragMat,
  'shipwreck': shipwreck,
};
