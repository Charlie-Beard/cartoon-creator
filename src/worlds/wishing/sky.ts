/**
 * High in the sky, for flying: the Wishing-Chair's travelling backdrop.
 *
 * A soft blue sky that grows paler toward the bottom, a few big white
 * paper clouds heaped round the edges (never in the middle, so x 300-880,
 * y 150-560 stays open sky for the chair to fly across), and far below,
 * along the bottom, a patchwork of tiny fields with hedges and a winding
 * river. The fields are small, pale and hazy so they read as a long way
 * down and stay calm under the caption band. There is no ground to stand
 * on: this is only for flying.
 */
import { C } from '../../art/palette';
import { cached, circle, curve, ellipse, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../art/paper';

const W = 1180;
const H = 820;
const flat = { edge: 'cut' as const, fibre: false as const, shadow: false };

/** A big lumpy paper cloud: a flat shaded underside, then puffs on top. */
function bigCloud(cx: number, cy: number, w: number, seed: number): Node[] {
  const r = rng(seed);
  const n = Math.max(4, Math.round(w / 90));
  const out: Node[] = [piece(ellipse(cx, cy + w * 0.08, w / 2 + 8, w * 0.1), C.cloudShade, { shadow: false, fibre: false })];
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const x = cx - w / 2 + t * w;
    const lift = Math.sin(t * Math.PI) * w * 0.14;
    out.push(piece(circle(x, cy - lift - r() * 14, w / n / 1.15 + r() * 14), C.cloud, { shadow: i === 0 || i === n - 1, rough: 1 }));
  }
  out.push(piece(ellipse(cx, cy + w * 0.04, w / 2, w * 0.1), C.cloud, { shadow: false }));
  return out;
}

/** A hazy far field: a four-sided patch with a faint darker edge line. */
function field(pts: Pt[], color: string): Node[] {
  return [piece(poly(pts), color, { ...flat, edge: 'torn', rough: 0.8 })];
}

/** The patchwork far below, from y 590 down; drawn as rows of slanted patches. */
function patchwork(): Node[] {
  const r = rng(404);
  const colors = ['#9cbf7a', '#b9c885', '#7fa86a', '#d6cf94', '#a7c58a', '#c8bf7a', '#8db478', '#e0d6a0'];
  const out: Node[] = [piece(rect(-20, 600, W + 40, H - 580), '#a7c58a', { edge: 'clean', shadow: false, fibre: false })];
  const rows = [600, 626, 658, 696, 740, 790, 840];
  let k = 0;
  for (let row = 0; row < rows.length - 1; row++) {
    const y0 = rows[row];
    const y1 = rows[row + 1];
    let x = -40 - r() * 60;
    while (x < W + 40) {
      const w = 56 + (row + 1) * 8 + r() * 60;
      const sk = (r() - 0.5) * 30;
      out.push(...field([[x, y0 + (r() - 0.5) * 6], [x + w, y0 + sk * 0.3], [x + w + sk, y1], [x + sk * 0.5, y1 + 4]], colors[k++ % colors.length]));
      x += w;
    }
  }
  // Hedges: thin dark-green lines along some field edges.
  for (let i = 0; i < 22; i++) {
    const x = r() * W;
    const y = 610 + r() * 190;
    const len = 50 + r() * 90;
    out.push(ink([[x, y], [x + len * 0.5, y + (r() - 0.5) * 8], [x + len, y + (r() - 0.5) * 10]], { width: 3, color: '#5f8a54', opacity: 0.8, wobble: 1.2 }));
  }
  // Tiny round trees and a couple of little farm roofs.
  for (let i = 0; i < 14; i++) out.push(piece(circle(r() * W, 620 + r() * 180, 5 + r() * 4), '#4f7d4a', { ...flat, opacity: 0.85 }));
  [[170, 668], [905, 724], [560, 762]].forEach(([x, y]) => {
    out.push(piece(rect(x - 9, y - 4, 18, 10), C.cream, flat), piece(poly([[x - 11, y - 3], [x, y - 12], [x + 11, y - 3]]), C.rust, flat));
  });
  return out;
}

/** A winding river across the patchwork, wider at the bottom. */
function river(): Node[] {
  const spine: Pt[] = [[1240, 612], [1040, 640], [880, 676], [720, 668], [580, 700], [470, 748], [330, 770], [180, 800], [60, 850]];
  const left: Pt[] = [];
  const right: Pt[] = [];
  spine.forEach(([x, y], i) => {
    const hw = 7 + i * 1.6;
    left.push([x, y - hw]);
    right.push([x, y + hw]);
  });
  const bank = curve([...left.map(([x, y]) => [x, y - 3] as Pt), ...right.reverse().map(([x, y]) => [x, y + 3] as Pt)], 2);
  return [piece(bank, '#c9d6a0', { ...flat, edge: 'torn', rough: 0.7 }), piece(curve([...spine.map(([x, y], i) => [x, y - 6 - i * 1.4] as Pt), ...spine.slice().reverse().map(([x, y], i) => [x, y + 6 + (spine.length - 1 - i) * 1.4] as Pt)], 2), '#8fb9d4', { ...flat, edge: 'torn', rough: 0.6 })];
}

export const wishingSky = cached(() =>
  svg({ w: W, h: H, name: 'wishing-sky', boil: false, className: 'backdrop' }, [
    // Sky in soft torn bands: deeper blue overhead, paler and warmer low down.
    piece(rect(-20, -20, W + 40, H + 40), '#8fb8dc', { edge: 'clean', shadow: false, fibre: false }),
    piece(rect(-20, 210, W + 40, 300), '#a3c5e2', { edge: 'torn', rough: 2, shadow: false, fibre: false }),
    piece(rect(-20, 400, W + 40, 300), '#bcd6e8', { edge: 'torn', rough: 2, shadow: false, fibre: false }),
    piece(rect(-20, 520, W + 40, 300), '#d3e3ea', { edge: 'torn', rough: 2, shadow: false, fibre: false }),
    // A few thin far clouds, out of the middle.
    piece(ellipse(210, 380, 120, 12), C.white, { ...flat, opacity: 0.6 }),
    piece(ellipse(1010, 400, 100, 11), C.white, { ...flat, opacity: 0.6 }),
    // The far land, then the river on it.
    ...patchwork(),
    ...river(),
    // Haze where the land meets the sky.
    piece(rect(-20, 586, W + 40, 34), '#d3e3ea', { edge: 'torn', rough: 2, shadow: false, fibre: false, opacity: 0.7 }),
    // Big soft clouds round the edges only.
    ...bigCloud(90, 130, 300, 11),
    ...bigCloud(1080, 250, 320, 12),
    ...bigCloud(70, 470, 240, 13),
    ...bigCloud(1110, 540, 260, 14),
    ...bigCloud(560, 60, 250, 15),
  ]),
);
