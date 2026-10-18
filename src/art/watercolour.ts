/**
 * Watercolour-and-ink art engine, for the bears' world.
 *
 * The bear stories come from an old picture-book look: soft watercolour
 * washes on white paper, a scratchy sepia pen line round everything, fur
 * drawn as little flicks, shading as hatching, and pictures that fade out
 * into the white page at their edges. This is the one deliberate exception
 * to the torn-paper house style (docs/STYLE.md, "The bears").
 *
 * It sits on the paper engine: the same `Node`s, `svg()`, `group()` and
 * `cached()`, so a bear is a puppet with parts exactly like a paper person,
 * and the kit can't tell the difference. Only the look of each shape is new:
 *
 *   wash()    a shape of colour: a flat wash, a darker glaze pooled on its
 *             shadow side, a paler bloom where the light falls, a faint
 *             tide-line where pigment dried at the edge, and a pen outline
 *   pen()     a hand-drawn ink line, broken here and there and thick and thin
 *   fur()     short ink flicks along an outline (and a few inside it)
 *   hatch()   parallel pen strokes over part of a shape (shadow, texture)
 *   blot()    a soft round puddle of colour with no line (cheeks, a sky)
 *   page()    a whole backdrop: white paper, the picture, white fading in
 *             at the edges like a book's vignette
 *
 * Everything is drawn once and held still, like the paper (no boil). No SVG
 * filters: a blur on every shape would make moving characters slow on the
 * iPad, so the softness comes from stacked see-through shapes instead.
 */
import { curve, hashString, rng, tear, toPath, type Ctx, type Node, type Pt } from './paper';

/** The pen: a warm sepia-black, like the book's ink. */
export const INK = '#3a2a1f';
/** The white of the page. */
export const PAGE = '#fdfaf3';

// ---------------------------------------------------------------------------
// Colour
// ---------------------------------------------------------------------------

function hex(c: string): [number, number, number] {
  const m = c.replace('#', '');
  const v = m.length === 3 ? m.split('').map((x) => x + x).join('') : m;
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16)) as [number, number, number];
}

/** Mixes colour `a` toward `b` by t (0 = a, 1 = b). Hex colours only. */
export function mix(a: string, b: string, t: number): string {
  const x = hex(a);
  const y = hex(b);
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
}

/** A deeper glaze of the same colour (watercolour darkens toward a warm brown, not black). */
export const deeper = (c: string, t = 0.35): string => mix(c, '#4a2c1c', t);
/** A paler bloom of the same colour (thinned with water toward the page). */
export const paler = (c: string, t = 0.45): string => mix(c, PAGE, t);

// ---------------------------------------------------------------------------
// Pen
// ---------------------------------------------------------------------------

function resample(pts: Pt[], step: number, closed: boolean): Pt[] {
  const out: Pt[] = [];
  const n = pts.length;
  const segs = closed ? n : n - 1;
  let carry = 0;
  for (let i = 0; i < segs; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % n];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    let t = carry;
    while (t < len) {
      const k = t / len;
      out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]);
      t += step;
    }
    carry = t - len;
  }
  if (!closed && n) out.push(pts[n - 1]);
  return out.length >= 2 ? out : pts.slice();
}

/** A tapered stroke along `pts` as a filled outline: thin at the ends, `w` in the middle. */
function stroke(pts: Pt[], w: number, r: () => number, taper = true): string {
  const n = pts.length;
  if (n < 2) return '';
  const left: Pt[] = [];
  const right: Pt[] = [];
  // A slow swell in width along the stroke, so the line is thick and thin like a dip pen.
  const ph = r() * Math.PI * 2;
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0];
    let dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    const t = i / (n - 1);
    const ends = taper ? Math.min(1, Math.sin(t * Math.PI) * 1.6 + 0.15) : 1;
    const hw = (w / 2) * ends * (0.75 + 0.35 * Math.sin(t * 5 + ph));
    left.push([pts[i][0] - dy * hw, pts[i][1] + dx * hw]);
    right.push([pts[i][0] + dy * hw, pts[i][1] - dx * hw]);
  }
  return toPath([...left, ...right.reverse()]);
}

export interface PenOpts {
  width?: number;
  color?: string;
  /** Wobble of the hand, in px. */
  wobble?: number;
  closed?: boolean;
  /** 0–1: how often the line lifts off the page and leaves a little gap. */
  breaks?: number;
  opacity?: number;
  /** Taper the ends of each stroke (default true). */
  taper?: boolean;
}

/** Draws a pen line through `points` as tapered strokes (no Node wrapper: used inside others). */
function penMarkup(points: Pt[], seed: number, o: PenOpts): string {
  const r = rng(seed);
  const closed = !!o.closed;
  const width = o.width ?? 2.4;
  const wob = o.wobble ?? 0.8;
  const smooth = points.length > 2 && !closed ? openSmooth(points) : points;
  const pts = resample(smooth, 4, closed).map(([x, y]) => [x + (r() * 2 - 1) * wob * 0.4, y + (r() * 2 - 1) * wob * 0.4] as Pt);
  if (closed) pts.push(pts[0]);
  // Split into runs with small gaps where the pen lifted.
  const breaks = o.breaks ?? 0.35;
  const runs: Pt[][] = [];
  let cur: Pt[] = [];
  for (let i = 0; i < pts.length; i++) {
    cur.push(pts[i]);
    const runLen = cur.length * 4;
    if (runLen > 40 && r() < breaks * 0.06 && i < pts.length - 3) {
      runs.push(cur);
      cur = [];
      i += r() < 0.5 ? 1 : 0; // a gap of one sample, sometimes none (just a new stroke)
    }
  }
  if (cur.length > 1) runs.push(cur);
  const color = o.color ?? INK;
  return runs.map((run) => `<path d="${stroke(run, width, r, o.taper ?? true)}" fill="${color}"/>`).join('');
}

function openSmooth(pts: Pt[]): Pt[] {
  let out = pts.slice();
  for (let k = 0; k < 2; k++) {
    const next: Pt[] = [out[0]];
    for (let i = 0; i < out.length - 1; i++) {
      const a = out[i];
      const b = out[i + 1];
      next.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25]);
      next.push([a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    next.push(out[out.length - 1]);
    out = next;
  }
  return out;
}

/** A hand-drawn pen line (a smile, a crease, stitches, a whisker of grass). */
export function pen(points: Pt[], o: PenOpts = {}): Node {
  return (ctx) => {
    const op = o.opacity !== undefined ? ` opacity="${o.opacity}"` : '';
    return `<g class="pc"${op}>${penMarkup(points, ctx.next(), o)}</g>`;
  };
}

// ---------------------------------------------------------------------------
// Washes
// ---------------------------------------------------------------------------

export interface WashOpts {
  /** The pen outline's colour, or false for none (a shape inside a lined one). */
  line?: string | false;
  lineWidth?: number;
  /** The darker glaze on the shadow side: a colour, or false. Default: a deeper wash of `fill`. */
  shade?: string | false;
  /** Where the light comes from, in degrees (0 = from the right, 90 = from below). Default -130: top left. */
  light?: number;
  /** How far the shade reaches in, as a share of the shape's size (default 0.28). */
  depth?: number;
  /** A paler bloom where the light falls (default true). */
  bloom?: boolean;
  /** Hatching over the shadow side: true, or its spacing in px. */
  hatch?: boolean | number;
  /** Fur flicks round the edge: true, or how long they are in px. */
  fur?: boolean | number;
  /** How wobbly the edge is, in px (default 1.2). */
  wobble?: number;
  opacity?: number;
  /** Extra attributes for the wrapper group (data-part …). */
  attrs?: string;
}

function bounds(pts: Pt[]): { x: number; y: number; w: number; h: number; cx: number; cy: number } {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const [x, y] of pts) {
    if (x < x0) x0 = x;
    if (y < y0) y0 = y;
    if (x > x1) x1 = x;
    if (y > y1) y1 = y;
  }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
}

const shift = (pts: Pt[], dx: number, dy: number, s = 1, about?: Pt): Pt[] => {
  const [ax, ay] = about ?? [0, 0];
  return pts.map(([x, y]) => [ax + (x - ax) * s + dx, ay + (y - ay) * s + dy] as Pt);
};

/**
 * A clip id unique to this piece of this drawing (seeded, so builds are
 * stable). The same drawing shown twice repeats its ids, harmlessly: the
 * clips are identical.
 */
function clipId(ctx: Ctx, seed: number): string {
  return `wc${(ctx.seed >>> 0).toString(36)}-${seed.toString(36)}`;
}

/** A shape of watercolour with a pen outline. */
export function wash(outline: Pt[], fill: string, o: WashOpts = {}): Node {
  return (ctx) => {
    const seed = ctx.next();
    const r = rng(seed);
    const wob = o.wobble ?? 1.2;
    const edge = wob > 0 ? tear(outline, seed, { wobble: wob, jag: 0, step: 6 }) : outline;
    const d = toPath(edge);
    const b = bounds(edge);
    const size = Math.max(8, Math.min(b.w, b.h));
    const a = ((o.light ?? -130) * Math.PI) / 180;
    const lx = Math.cos(a);
    const ly = Math.sin(a);
    const id = clipId(ctx, seed);
    let inner = '';

    // The darker glaze, pooled away from the light.
    if (o.shade !== false) {
      const depth = (o.depth ?? 0.28) * size;
      const sh = shift(edge, lx * depth, ly * depth, 1.02, [b.cx, b.cy]);
      const shadeD = toPath(tear(sh, seed + 3, { wobble: wob * 2.5, jag: 0, step: 8 }));
      // Two glazes: a wide soft one and a narrower deeper one, so the edge of the shadow is soft.
      inner += `<path d="${d}" fill="${o.shade ?? deeper(fill, 0.22)}" opacity="0.55"/>`;
      inner += `<path d="${shadeD}" fill="${fill}"/>`;
      const sh2 = shift(edge, lx * depth * 0.45, ly * depth * 0.45, 1.01, [b.cx, b.cy]);
      inner += `<path d="${toPath(tear(sh2, seed + 5, { wobble: wob * 2, jag: 0, step: 8 }))}" fill="${fill}" opacity="0.55"/>`;
    }
    // A paler bloom where the light falls.
    if (o.bloom ?? true) {
      const rx = b.w * (0.18 + r() * 0.08);
      const ry = b.h * (0.16 + r() * 0.08);
      const bx = b.cx + lx * b.w * 0.2;
      const by = b.cy + ly * b.h * 0.2;
      const blob: Pt[] = [];
      for (let i = 0; i < 14; i++) {
        const t = (i / 14) * Math.PI * 2;
        const k = 0.8 + r() * 0.4;
        blob.push([bx + Math.cos(t) * rx * k, by + Math.sin(t) * ry * k]);
      }
      inner += `<path d="${toPath(curve(blob, 2))}" fill="${paler(fill, 0.4)}" opacity="0.5"/>`;
    }
    // Hatching on the shadow side.
    if (o.hatch) {
      const gap = typeof o.hatch === 'number' ? o.hatch : 7;
      inner += hatchMarkup(edge, seed + 9, { gap, from: o.light ?? -130, color: deeper(fill, 0.55) });
    }

    let g = `<path d="${d}" fill="${fill}"/>`;
    if (inner) g += `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`;
    // A faint tide-line where the pigment dried at the edge.
    g += `<path d="${d}" fill="none" stroke="${deeper(fill, 0.3)}" stroke-width="2.2" opacity="0.35"/>`;
    if (o.fur) g += furMarkup(edge, seed + 11, { length: typeof o.fur === 'number' ? o.fur : 7, color: deeper(fill, 0.6) });
    if (o.line !== false) g += penMarkup(edge, seed + 13, { closed: true, width: o.lineWidth ?? 2.4, color: o.line ?? INK, breaks: 0.5 });
    const op = o.opacity !== undefined ? ` opacity="${o.opacity}"` : '';
    return `<g class="pc"${op}${o.attrs ? ' ' + o.attrs : ''}>${g}</g>`;
  };
}

/** A soft puddle of colour with no outline: rosy cheeks, a patch of shade, the sea's shine. */
export function blot(outline: Pt[], fill: string, opacity = 0.5): Node {
  return (ctx) => {
    const seed = ctx.next();
    const d1 = toPath(tear(outline, seed, { wobble: 2, jag: 0, step: 6 }));
    const d2 = toPath(tear(shift(outline, 0, 0, 0.8, [bounds(outline).cx, bounds(outline).cy]), seed + 1, { wobble: 2, jag: 0, step: 6 }));
    return `<g class="pc" opacity="${opacity}"><path d="${d1}" fill="${fill}" opacity="0.6"/><path d="${d2}" fill="${fill}" opacity="0.6"/></g>`;
  };
}

// ---------------------------------------------------------------------------
// Fur and hatching
// ---------------------------------------------------------------------------

interface FurOpts {
  length?: number;
  color?: string;
  /** Flicks per 100 px of edge (default 9). */
  density?: number;
}

function furMarkup(edge: Pt[], seed: number, o: FurOpts): string {
  const r = rng(seed);
  const pts = resample(edge, 100 / (o.density ?? 9), true);
  const n = pts.length;
  let area = 0;
  for (let i = 0; i < n; i++) area += pts[i][0] * pts[(i + 1) % n][1] - pts[(i + 1) % n][0] * pts[i][1];
  const out = area > 0 ? 1 : -1;
  const len = o.length ?? 7;
  let s = '';
  for (let i = 0; i < n; i++) {
    if (r() < 0.25) continue;
    const a = pts[(i - 1 + n) % n];
    const b = pts[(i + 1) % n];
    let nx = b[1] - a[1];
    let ny = -(b[0] - a[0]);
    const l = Math.hypot(nx, ny) || 1;
    nx = (nx / l) * out;
    ny = (ny / l) * out;
    // Flicks point mostly inward from just outside the edge, leaning along it, like brushed fur.
    const k = len * (0.6 + r() * 0.7);
    const lean = (r() - 0.3) * 0.8;
    const p0: Pt = [pts[i][0] + nx * k * 0.25, pts[i][1] + ny * k * 0.25];
    const p1: Pt = [pts[i][0] - nx * k + (b[0] - a[0]) * lean * 0.2, pts[i][1] - ny * k + (b[1] - a[1]) * lean * 0.2];
    s += `<path d="${stroke([p0, [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2], p1], 1.6, r)}" fill="${o.color ?? INK}" opacity="0.7"/>`;
  }
  return s;
}

/** Fur flicks along an outline (the edge of a bear's head, a woolly jumper). */
export function fur(outline: Pt[], o: FurOpts = {}): Node {
  return (ctx) => `<g class="pc">${furMarkup(outline, ctx.next(), o)}</g>`;
}

interface HatchOpts {
  /** Spacing in px (default 7). */
  gap?: number;
  /** Stroke angle in degrees (default 60). */
  angle?: number;
  color?: string;
  /** Hatch only the side away from this light direction (degrees); omit to fill the shape. */
  from?: number;
  width?: number;
}

function hatchMarkup(edge: Pt[], seed: number, o: HatchOpts): string {
  const r = rng(seed);
  const b = bounds(edge);
  const gap = o.gap ?? 7;
  const ang = ((o.angle ?? 60) * Math.PI) / 180;
  const dx = Math.cos(ang);
  const dy = Math.sin(ang);
  const reach = Math.hypot(b.w, b.h) / 2 + 4;
  // Light direction: keep only strokes on the far side of the centre.
  const la = o.from !== undefined ? (o.from * Math.PI) / 180 : null;
  let s = '';
  for (let t = -reach; t <= reach; t += gap) {
    const ox = b.cx - dy * t;
    const oy = b.cy + dx * t;
    if (la !== null) {
      const side = (ox - b.cx) * Math.cos(la) + (oy - b.cy) * Math.sin(la);
      if (side > -reach * 0.15) continue;
    }
    const jitter = (r() - 0.5) * gap * 0.4;
    const half = reach * (0.7 + r() * 0.3);
    const p0: Pt = [ox - dx * half + jitter, oy - dy * half];
    const p1: Pt = [ox + dx * half + jitter, oy + dy * half];
    s += `<path d="${stroke([p0, [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2], p1], o.width ?? 1.3, r)}" fill="${o.color ?? INK}" opacity="0.45"/>`;
  }
  return s;
}

/** Pen hatching inside a shape (clipped to it): shadow under a table, texture on bark. */
export function hatch(outline: Pt[], o: HatchOpts = {}): Node {
  return (ctx) => {
    const seed = ctx.next();
    const id = clipId(ctx, seed);
    return `<g class="pc"><clipPath id="${id}"><path d="${toPath(outline)}"/></clipPath><g clip-path="url(#${id})">${hatchMarkup(outline, seed, o)}</g></g>`;
  };
}

// ---------------------------------------------------------------------------
// The page
// ---------------------------------------------------------------------------

/**
 * A full backdrop: white paper, the picture, then the page's white seeping
 * back in at the edges in soft stacked layers, as the book's pictures fade
 * out into the page. `edge` is how far in the fade reaches (px), and `sides`
 * which edges fade (default all four; the bottom fades more, under the
 * captions).
 */
export function vignette(w: number, h: number, name: string, edge = 70, sides = { top: true, right: true, bottom: true, left: true }): Node {
  return () => {
    const r = rng(hashString(name + '-vignette'));
    const layers = 6;
    let s = '';
    for (let L = 0; L < layers; L++) {
      const k = (L + 1) / layers; // 1/6 … 1: outer layers reach least far in
      const reach = edge * (1.15 - k);
      const inset = (side: keyof typeof sides, extra = 1) => (sides[side] ? reach * extra : -40);
      const t = inset('top');
      const rt = inset('right');
      const bt = inset('bottom', 1.5);
      const lt = inset('left');
      // A wobbly inner edge: points round the inner rectangle pushed in and out.
      const inner: Pt[] = [];
      const step = 46;
      for (let x = lt; x <= w - rt; x += step) inner.push([x, t + (r() - 0.3) * reach * 0.9]);
      for (let y = t; y <= h - bt; y += step) inner.push([w - rt - (r() - 0.3) * reach * 0.9, y]);
      for (let x = w - rt; x >= lt; x -= step) inner.push([x, h - bt - (r() - 0.3) * reach * 0.9]);
      for (let y = h - bt; y >= t; y -= step) inner.push([lt + (r() - 0.3) * reach * 0.9, y]);
      const frame = `M-60 -60H${w + 60}V${h + 60}H-60Z` + toPath(curve(inner, 2));
      s += `<path d="${frame}" fill="${PAGE}" fill-rule="evenodd" opacity="${(0.22 + 0.1 * k).toFixed(2)}"/>`;
    }
    return `<g class="vignette">${s}</g>`;
  };
}

/** The whole page: paper white under everything, the picture, and the vignette on top. */
export function pageNodes(w: number, h: number, name: string, picture: Node[], edge?: number): Node[] {
  return [() => `<rect x="-40" y="-40" width="${w + 80}" height="${h + 80}" fill="${PAGE}"/>`, ...picture, vignette(w, h, name, edge)];
}

/** Clips nodes to an outline (stripes on a jumper, spots on a dress). */
export function clipped(outline: Pt[], children: Node[]): Node {
  return (ctx) => {
    const id = clipId(ctx, ctx.next());
    return `<clipPath id="${id}"><path d="${toPath(outline)}"/></clipPath><g clip-path="url(#${id})">${children.map((c) => c(ctx)).join('')}</g>`;
  };
}
