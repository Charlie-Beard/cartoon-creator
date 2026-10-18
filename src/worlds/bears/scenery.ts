/**
 * The bears' scenery kit: the pieces their backdrops are painted from, in
 * the book's watercolour-and-ink look (src/art/watercolour.ts).
 *
 *   sky       a wash of blue that thins to white paper near the horizon
 *   cloud     the book's cloud: white, a scalloped pen line, hatching under it
 *   ground    a band of land (grass, sand) with a wavy top edge
 *   tree      a big trunk with a scribbled leafy crown
 *   bush      a round leafy clump
 *   tufts     little pen tufts of grass along a line
 *   pebbles   a scatter of grey-blue pebbles, the book's favourite
 *   path      a winding sandy path, wide at the front
 *
 * Every backdrop ends with the page vignette (pageNodes), so its edges fade
 * into white like the book's pictures, and the caption band (y 690–820)
 * stays pale and calm.
 */
import { curve, ellipse, rng, type Node, type Pt } from '../../art/paper';
import { blot, deeper, hatch, INK, paler, pen, wash } from '../../art/watercolour';

export const SKY = '#a9c8e6';
export const GRASS = '#9cbd62';
export const GRASS_DARK = '#6f9846';
export const LEAF = '#7fa64e';
export const LEAF_DARK = '#557a36';
export const SAND = '#ecd396';
export const SEA = '#7fa9c9';
export const BARK = '#9a7650';
export const PEBBLE = '#a9b4c2';
export const PATH = '#e6cf9a';

const W = 1180;

/** Sky: a blue wash from the top that fades into the paper by `to` (y). */
export function sky(to = 420, color = SKY): Node[] {
  const out: Node[] = [];
  for (let i = 0; i < 6; i++) {
    const y = to * (1 - i / 7);
    const r = rng(40 + i);
    const pts: Pt[] = [[-40, -40], [W + 40, -40]];
    for (let x = W + 40; x >= -40; x -= 110) pts.push([x, y + (r() - 0.5) * 50]);
    out.push(blot(curve(pts, 2), color, 0.22));
  }
  return out;
}

/**
 * The book's cloud: a big white puff of round bumps, each bump outlined in
 * pen only where it shows (the inside lines are painted over), a blue-grey
 * glaze under it and a few hatched strokes along its flat bottom. About
 * 300 × 150 at s = 1, centred on its bottom middle (cx, cy).
 */
export function cloud(cx: number, cy: number, s = 1, seed = 1): Node[] {
  const r = rng(seed);
  const bumps: [number, number, number][] = [];
  const n = 6;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const x = cx + (t - 0.5) * 240 * s;
    const rad = (34 + Math.sin(t * Math.PI) * 34 + r() * 12) * s;
    bumps.push([x, cy - rad * 0.75 - Math.sin(t * Math.PI) * 26 * s, rad]);
  }
  bumps.push([cx - 30 * s, cy - 40 * s, 52 * s], [cx + 50 * s, cy - 36 * s, 48 * s]);
  const base = [[cx - 150 * s, cy], [cx + 150 * s, cy], [cx + 140 * s, cy - 40 * s], [cx - 140 * s, cy - 40 * s]] as Pt[];
  return [
    ...bumps.map(([x, y, rad]) => wash(ellipse(x, y, rad, rad * 0.92), '#ffffff', { shade: '#d3dfec', light: -100, depth: 0.3, lineWidth: 2.2, wobble: 0.8, bloom: false })),
    wash(base, '#ffffff', { shade: '#d3dfec', light: -90, depth: 0.5, line: false, wobble: 0.5, bloom: false }),
    // paint out the inner lines, leaving only the outer scallops inked
    ...bumps.map(([x, y, rad]) => blot(ellipse(x, y + rad * 0.12, rad * 0.86, rad * 0.78), '#ffffff', 1)),
    blot(ellipse(cx, cy - 16 * s, 130 * s, 18 * s), '#dbe5ef', 0.9),
    pen([[cx - 150 * s, cy], [cx + 150 * s, cy]], { width: 2, breaks: 0.9 }),
    hatch(curve([[cx - 120 * s, cy - 18 * s], [cx + 120 * s, cy - 18 * s], [cx + 130 * s, cy], [cx - 130 * s, cy]], 1), { gap: 6, angle: 0, color: '#7f95ad' }),
  ];
}

/** A band of land from `y` down past the bottom, with a wavy top. */
export function ground(y: number, color: string, o: { amp?: number; seed?: number; from?: number; to?: number; line?: boolean } = {}): Node {
  const r = rng(o.seed ?? 7);
  const amp = o.amp ?? 18;
  const x0 = o.from ?? -60;
  const x1 = o.to ?? W + 60;
  const pts: Pt[] = [[x0, 900]];
  for (let x = x0; x <= x1; x += 90) pts.push([x, y + (r() - 0.5) * amp * 2]);
  pts.push([x1, 900]);
  return wash(curve(pts, 2), color, { light: -90, depth: 0.12, line: o.line === false ? false : INK, lineWidth: 2 });
}

/** A scribbly leafy mass: overlapping washes of leaf green with pen scallops. */
export function leaves(cx: number, cy: number, rx: number, ry: number, seed = 3, color = LEAF): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  const n = Math.max(5, Math.round((rx + ry) / 18));
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + r();
    const x = cx + Math.cos(a) * rx * 0.55;
    const y = cy + Math.sin(a) * ry * 0.5;
    const s = 0.45 + r() * 0.25;
    out.push(wash(ellipse(x, y, rx * s, ry * s), i % 3 ? color : paler(color, 0.25), { line: false, hatch: i % 2 ? 6 : false, wobble: 4, depth: 0.35 }));
  }
  out.push(wash(ellipse(cx, cy, rx * 0.55, ry * 0.5), paler(color, 0.15), { line: false, wobble: 5, depth: 0.4 }));
  // Scalloped pen marks for leaves, along the edge.
  for (let i = 0; i < n * 6; i++) {
    const a = r() * Math.PI * 2;
    const x = cx + Math.cos(a) * rx * (0.6 + r() * 0.4);
    const y = cy + Math.sin(a) * ry * (0.6 + r() * 0.4);
    out.push(pen([[x - 8, y + 3], [x - 3, y - 4], [x + 3, y - 4], [x + 8, y + 3]], { width: 1.7, color: deeper(color, 0.7), opacity: 0.85 }));
  }
  return out;
}

/** A tree: a trunk from the ground at (x, base) up into a leafy crown. */
export function tree(x: number, base: number, height = 420, seed = 5): Node[] {
  const top = base - height;
  const trunk = curve([[x - 46, base + 10], [x - 26, base - height * 0.4], [x - 18, top + 60], [x + 18, top + 60], [x + 26, base - height * 0.4], [x + 50, base + 10]], 2);
  return [
    wash(trunk, BARK, { hatch: 5, light: 180, depth: 0.3 }),
    pen([[x - 6, base - 20], [x - 10, base - height * 0.35], [x - 4, top + 90]], { width: 1.6, opacity: 0.7 }),
    pen([[x + 14, base - 10], [x + 10, base - height * 0.3]], { width: 1.4, opacity: 0.6 }),
    ...leaves(x, top + 40, 170, 120, seed),
  ];
}

/** A round bush. */
export const bush = (x: number, y: number, s = 1, seed = 9): Node[] => leaves(x, y, 90 * s, 56 * s, seed, LEAF_DARK);

/** Little pen tufts of grass along the line from (x0, y) to (x1, y). */
export function tufts(x0: number, x1: number, y: number, n = 8, seed = 11, color = GRASS_DARK): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  for (let i = 0; i < n; i++) {
    const x = x0 + r() * (x1 - x0);
    const yy = y + (r() - 0.5) * 20;
    for (let b = -2; b <= 2; b++) out.push(pen([[x + b * 3, yy], [x + b * 7 + (r() - 0.5) * 4, yy - 14 - r() * 12]], { width: 1.6, color: deeper(color, 0.3) }));
  }
  return out;
}

/** A scatter of pebbles in a box. */
export function pebbles(x: number, y: number, w: number, h: number, n = 10, seed = 13): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  for (let i = 0; i < n; i++) {
    const px = x + r() * w;
    const py = y + r() * h;
    const s = 6 + r() * 12;
    out.push(wash(ellipse(px, py, s * 1.5, s * 0.8, (r() - 0.5) * 30), r() < 0.5 ? PEBBLE : paler(PEBBLE, 0.3), { lineWidth: 1.6, depth: 0.4 }));
  }
  return out;
}

/** A sandy path winding from the front (wide, at x front) to the back (narrow, at x back, y far). */
export function path(front: number, back: number, far: number, color = PATH): Node {
  return wash(
    curve(
      [
        [front - 220, 860],
        [front - 120, 720],
        [(front + back) / 2 - 60, (far + 720) / 2],
        [back - 26, far],
        [back + 26, far],
        [(front + back) / 2 + 60, (far + 720) / 2],
        [front + 140, 720],
        [front + 260, 860],
      ],
      2,
    ),
    color,
    { light: -90, depth: 0.15, lineWidth: 1.8 },
  );
}
