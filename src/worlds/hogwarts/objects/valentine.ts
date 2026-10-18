/**
 * Valentine's Day props (The Singing Valentine): a cupid's golden harp, a
 * swag of paper hearts for decorating a hall, a pink lace-edged card and one
 * big glossy heart to float about or burst into confetti. All original paper
 * art, centred in their boxes with a clear silhouette at 100 px.
 */
import { C } from '../../../art/palette';
import { band, circle, curve, dot, ellipse, group, ink, piece, rect, svg, type Node, type Pt } from '../../../art/paper';

/** A smooth paper heart centred on (cx, cy), r is half its width, rot in degrees. */
export function heartPts(cx: number, cy: number, r: number, rot = 0): Pt[] {
  const unit: Pt[] = [[0, -0.5], [0.3, -0.85], [0.75, -0.9], [1, -0.5], [0.9, 0], [0, 0.95], [-0.9, 0], [-1, -0.5], [-0.75, -0.9], [-0.3, -0.85]];
  const c = Math.cos((rot * Math.PI) / 180);
  const s = Math.sin((rot * Math.PI) / 180);
  return curve(unit.map(([x, y]) => [cx + (x * c - y * s) * r, cy + (x * s + y * c) * r] as Pt), 3);
}

const PINK = C.raspberry;
const PINK_LIGHT = '#f2a6bf';
const RED = C.cherry;

/** A small golden lyre-harp, 140 × 170. Part `strings` can wobble or twang (origin at its middle). */
export function harp(): string {
  const gold = C.gold;
  const light = C.goldLight;
  const strings = [50, 60, 70, 80, 90].map((x) => ink([[x, 36], [x, 138]], { width: 2, color: C.cream, wobble: 0.3 }));
  return svg({ w: 140, h: 170, name: 'hogwarts-harp', label: 'a golden harp' }, [
    // the two curving arms of the lyre
    piece(band([[44, 146], [26, 104], [24, 62], [46, 28]], 13), gold, { edge: 'cut' }),
    piece(band([[96, 146], [114, 104], [116, 62], [94, 28]], 13), gold, { edge: 'cut' }),
    // curly scrolls at the tops
    piece(circle(44, 22, 12), light, { edge: 'cut' }),
    piece(circle(96, 22, 12), light, { edge: 'cut' }),
    piece(circle(44, 22, 5), gold, { edge: 'clean', shadow: false, fibre: false }),
    piece(circle(96, 22, 5), gold, { edge: 'clean', shadow: false, fibre: false }),
    // cross-bar and the sounding box at the bottom
    piece(band([[44, 32], [96, 32]], 11), gold, { edge: 'cut' }),
    piece(rect(32, 140, 76, 22, 9), light, { edge: 'cut' }),
    piece(rect(40, 146, 60, 6, 3), gold, { edge: 'clean', fibre: false, shadow: false }),
    group({ part: 'strings', origin: [70, 90] }, strings),
    // a little red heart on the cross-bar
    piece(heartPts(70, 44, 9), RED, { edge: 'cut', fibre: false }),
    dot(66, 41, 2, C.white, 0.8),
  ]);
}

/** A long swag of pink, red and white paper hearts on a string, 600 × 120. */
export function heartGarland(): string {
  const cols = [PINK, RED, C.white, PINK_LIGHT, RED];
  const swags = 3;
  const pins = [6, 200, 400, 594];
  const sag = 48;
  const yAt = (x0: number, x1: number, x: number) => {
    const t = ((x - x0) / (x1 - x0)) * 2 - 1;
    return 14 + sag * (1 - t * t);
  };
  const nodes: Node[] = [];
  const hearts: Node[] = [];
  let n = 0;
  for (let i = 0; i < swags; i++) {
    const x0 = pins[i];
    const x1 = pins[i + 1];
    const line: Pt[] = [];
    for (let j = 0; j <= 12; j++) {
      const x = x0 + ((x1 - x0) * j) / 12;
      line.push([x, yAt(x0, x1, x)]);
    }
    nodes.push(ink(line, { width: 2.5, color: C.brownDark, wobble: 0.3 }));
    for (const t of [-0.8, -0.4, 0, 0.4, 0.8]) {
      const x = x0 + ((t + 1) / 2) * (x1 - x0);
      const y = yAt(x0, x1, x);
      const r = n % 2 ? 14 : 18;
      const tilt = ((n * 37) % 21) - 10;
      hearts.push(ink([[x, y], [x, y + 8]], { width: 1.8, color: C.brownDark, wobble: 0.2 }));
      hearts.push(piece(heartPts(x, y + 8 + r * 0.9, r, tilt), cols[n % cols.length], { edge: 'cut', fibre: false }));
      n++;
    }
  }
  const knobs = pins.map((x) => piece(circle(x, 12, 6), C.gold, { edge: 'cut', fibre: false }));
  return svg({ w: 600, h: 120, name: 'hogwarts-heartGarland', label: 'a garland of paper hearts' }, [...nodes, ...hearts, ...knobs]);
}

/** A pink folded card with a big red heart and a lace edge, 140 × 110. */
export function valentineCard(): string {
  const lace: Node[] = [];
  for (let x = 12; x <= 128; x += 9) {
    lace.push(piece(circle(x, 8, 5), C.white, { edge: 'clean', shadow: false, fibre: false }));
    lace.push(piece(circle(x, 102, 5), C.white, { edge: 'clean', shadow: false, fibre: false }));
  }
  for (let y = 17; y <= 95; y += 9) {
    lace.push(piece(circle(8, y, 5), C.white, { edge: 'clean', shadow: false, fibre: false }));
    lace.push(piece(circle(132, y, 5), C.white, { edge: 'clean', shadow: false, fibre: false }));
  }
  return svg({ w: 140, h: 110, name: 'hogwarts-valentineCard', label: 'a valentine card' }, [
    piece(rect(6, 6, 128, 98, 5), C.white, { edge: 'cut' }),
    ...lace,
    piece(rect(14, 14, 112, 82, 4), PINK_LIGHT, { edge: 'cut', fibre: false, shadow: false }),
    // the fold down the left side
    piece(rect(14, 14, 10, 82, 2), PINK, { edge: 'clean', fibre: false, shadow: false, opacity: 0.55 }),
    ink([[24, 16], [24, 94]], { width: 1.5, color: C.rose, wobble: 0.2 }),
    // the big red heart
    piece(heartPts(76, 57, 29), RED, { edge: 'cut' }),
    piece(heartPts(70, 49, 14), '#d9505e', { edge: 'clean', fibre: false, shadow: false, opacity: 0.8 }),
    dot(62, 44, 3, C.white, 0.85),
  ]);
}

/** One big glossy pink paper heart, 160 × 150. */
export function bigHeart(): string {
  return svg({ w: 160, h: 150, name: 'hogwarts-bigHeart', label: 'a big pink heart' }, [
    piece(heartPts(82, 80, 72), C.raspberryDark, { edge: 'cut' }),
    piece(heartPts(79, 76, 70), PINK, { edge: 'cut', fibre: false, shadow: false }),
    // lighter belly, for a glossy puffed look
    piece(heartPts(75, 70, 52), '#ee7fa2', { edge: 'clean', fibre: false, shadow: false, opacity: 0.9 }),
    // the shine on the upper left lobe
    piece(ellipse(52, 44, 15, 8, -35), C.white, { edge: 'clean', fibre: false, shadow: false, opacity: 0.75 }),
    dot(34, 62, 3.5, C.white, 0.7),
  ]);
}
