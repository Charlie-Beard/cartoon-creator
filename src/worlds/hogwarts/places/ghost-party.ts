/**
 * Nick's Ghost Party: a big stone dungeon hall for Nick's Ghost Day party.
 *
 * Cold, blue and a bit gloomy, but beautiful. Black velvet drapes hang in
 * swags along the top and down both sides; hundreds of tall thin black
 * candles (in wall brackets, on iron stands and along a ledge) all burn
 * with blue flames. A small wooden platform stands at the back left for
 * the band (left empty: the band is a prop). The floor is wide, plain stone;
 * the middle and right of it are kept clear for a table and a horse.
 * The wall meets the floor at y 540; actors stand on the line at y 650.
 */
import { curve, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../../art/paper';

const WALL = '#2c3857';
const WALL_LIGHT = '#3c4c6e';
const FLOOR = '#222a3f';
const VELVET = '#14131c';
const VELVET_LIGHT = '#272636';
const IRON = '#0f1118';
const CANDLE = '#1b1a24';
const FLAME = '#78c8ff';
const FLAME_CORE = '#e8f9ff';
const GLOW = '#6aa8ff';

/** A thin black candle with a blue flame and a soft cold glow. */
function candleNodes(x: number, base: number, h: number, w = 7, glow = true): Node[] {
  const top = base - h;
  const f = w / 7;
  return [
    ...(glow ? [piece(ellipse(x, top - 8 * f, 40 * f, 44 * f), GLOW, { edge: 'clean', shadow: false, opacity: 0.13 })] : []),
    piece(rect(x - w / 2, top, w, h, 1.5), CANDLE, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(x - w / 2, top, w * 0.3, h, 1), '#33324a', { edge: 'clean', fibre: false, shadow: false, opacity: 0.8 }),
    piece(curve([[x, top - 17 * f], [x + 5 * f, top - 7 * f], [x, top - 1 * f], [x - 5 * f, top - 7 * f]], 2), FLAME, { edge: 'clean', fibre: false, shadow: false }),
    piece(ellipse(x, top - 6 * f, 2 * f, 4 * f), FLAME_CORE, { edge: 'clean', shadow: false }),
  ];
}

/** An iron stand: a thin pole on three feet, with a dish holding candles of different heights. */
function stand(x: number, base: number, height: number, k = 1): Node[] {
  const top = base - height;
  const heights = [34, 52, 40, 60, 30];
  const out: Node[] = [
    ink([[x, base], [x, top + 6]], { width: 5 * k, color: IRON, wobble: 0.3 }),
    ink([[x - 18 * k, base], [x, base - 22 * k], [x + 18 * k, base]], { width: 3.5 * k, color: IRON, wobble: 0.3 }),
    piece(ellipse(x, base + 1, 22 * k, 4 * k), IRON, { edge: 'clean', shadow: false, opacity: 0.4 }),
    piece(ellipse(x, top + 4, 30 * k, 6 * k), IRON, { edge: 'cut', fibre: false, shadow: false }),
  ];
  for (let i = 0; i < 5; i++) {
    out.push(...candleNodes(x + (i - 2) * 11 * k, top + 4, heights[i] * k, 6.5 * k, i % 2 === 0));
  }
  return out;
}

/** A wall bracket: an iron curl holding a few candles. */
function bracket(x: number, y: number, n = 3, k = 1): Node[] {
  const out: Node[] = [
    ink([[x, y + 26 * k], [x - 4 * k, y + 56 * k]], { width: 4 * k, color: IRON, wobble: 0.3 }),
    ink([[x - 22 * k, y + 8 * k], [x - 14 * k, y + 24 * k], [x, y + 28 * k], [x + 14 * k, y + 24 * k], [x + 22 * k, y + 8 * k]], { width: 4 * k, color: IRON, wobble: 0.3 }),
    piece(rect(x - 24 * k, y + 5 * k, 48 * k, 5 * k, 2), IRON, { edge: 'cut', fibre: false, shadow: false }),
  ];
  const hs = [30, 44, 34];
  for (let i = 0; i < n; i++) {
    const dx = n === 1 ? 0 : (i - (n - 1) / 2) * 18 * k;
    out.push(...candleNodes(x + dx, y + 7 * k, hs[i % 3] * k, 6.5 * k));
  }
  return out;
}

/** A drape hanging from the top: a velvet curtain with folds, wider at the top. */
function drapeSide(x: number, w: number, len: number, sign: 1 | -1): Node[] {
  const out: Node[] = [];
  // the curtain edge swings in, loops up to a tie-back and falls again
  const x1 = x + sign * w;
  out.push(
    piece(poly([[x, -20], [x1, -20], [x1, len - 40], [x + sign * w * 0.55, len], [x + sign * w * 0.1, len - 50], [x, len - 90]]), VELVET, { rough: 0.7, fibre: false }),
  );
  const folds = 5;
  for (let i = 1; i <= folds; i++) {
    const fx = x + sign * (w * i) / (folds + 1);
    out.push(
      piece(rect(fx - 6, -20, 12, len - 50 - (i % 2) * 14), VELVET_LIGHT, { edge: 'clean', shadow: false, opacity: i % 2 ? 0.55 : 0.3 }),
    );
  }
  // tie-back cord
  const ty = len * 0.5;
  out.push(
    piece(poly([[x + sign * 4, ty - 8], [x1 - sign * 4, ty - 4], [x1 - sign * 4, ty + 10], [x + sign * 4, ty + 14]]), '#6d7aa0', { edge: 'cut', fibre: false, opacity: 0.7 }),
    piece(ellipse(x + sign * 14, ty + 3, 8, 8), '#8d9bc4', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
  );
  return out;
}

/** The swags along the top: a rail, a scalloped valance and hanging folds between. */
function swags(): Node[] {
  const out: Node[] = [piece(rect(-20, -20, 1220, 52), VELVET, { edge: 'cut', fibre: false })];
  const n = 6;
  const span = 1180 / n;
  for (let i = 0; i < n; i++) {
    const a = i * span;
    const b = a + span;
    const mid = (a + b) / 2;
    const dip = 74 + (i % 2) * 16;
    out.push(
      piece(curve([[a - 4, 20], [a + span * 0.2, 30 + dip * 0.7], [mid, 40 + dip], [b - span * 0.2, 30 + dip * 0.7], [b + 4, 20], [mid, 10]], 3), i % 2 ? '#1a1926' : VELVET, { rough: 0.8, fibre: false }),
      ink([[a + 20, 26], [mid - 10, 28 + dip * 0.8]], { width: 5, color: VELVET_LIGHT, wobble: 0.3, opacity: 0.7 }),
      ink([[b - 20, 26], [mid + 10, 28 + dip * 0.8]], { width: 5, color: VELVET_LIGHT, wobble: 0.3, opacity: 0.7 }),
    );
    // a silvery-blue rope along the edge of each swag
    out.push(ink([[a + 6, 30], [a + span * 0.25, 30 + dip * 0.72], [mid, 38 + dip], [b - span * 0.25, 30 + dip * 0.72], [b - 6, 30]], { width: 2.5, color: '#6d7fae', opacity: 0.6, wobble: 0.3 }));
    // a hook with a tassel where swags meet
    out.push(
      piece(ellipse(b, 36, 9, 9), '#8d9bc4', { edge: 'cut', fibre: false, shadow: false, opacity: 0.85 }),
      piece(poly([[b - 6, 44], [b + 6, 44], [b + 4, 78], [b - 4, 78]]), '#59668c', { edge: 'cut', fibre: false, shadow: false, opacity: 0.85 }),
    );
  }
  return out;
}

/** The dungeon hall for Nick's party. */
export function ghostParty(): string {
  const r = rng(500);
  const out: Node[] = [];

  // Base and the stone wall: big dark blocks, cold blue-grey.
  out.push(piece(rect(-20, -20, 1220, 860), '#171d30', { edge: 'clean', shadow: false }));
  out.push(piece(rect(-20, 20, 1220, 540), WALL, { edge: 'clean', shadow: false }));
  for (let row = 0; row < 9; row++) {
    let x = row % 2 ? -50 : 0;
    while (x < 1200) {
      const w = 120 + r() * 60;
      out.push(piece(rect(x + 3, row * 62 + 24, w - 6, 56, 3), r() > 0.5 ? WALL : WALL_LIGHT, { edge: 'cut', fibre: false, shadow: false, opacity: 0.45 + r() * 0.4, rough: 0.6 }));
      x += w;
    }
  }

  // Tall pointed stone niches in the back wall, with deep blue shadow.
  const niche = (cx: number): Node[] => {
    const pts: Pt[] = [[cx - 52, 540], [cx - 52, 250]];
    for (let i = 1; i <= 8; i++) {
      const t = i / 8;
      pts.push([cx - 52 + t * 52, 250 - Math.sin(t * Math.PI * 0.5) * 80]);
    }
    for (let i = 7; i >= 0; i--) {
      const t = i / 8;
      pts.push([cx + 52 - t * 52, 250 - Math.sin(t * Math.PI * 0.5) * 80]);
    }
    pts.push([cx + 52, 250], [cx + 52, 540]);
    return [piece(poly(pts), '#141a2c', { edge: 'cut', fibre: false, shadow: false, opacity: 0.7 })];
  };
  out.push(...niche(560), ...niche(780), ...niche(1000));

  // A ledge along the back wall crowded with tiny candles: the "hundreds".
  out.push(piece(rect(-20, 338, 1220, 12, 2), '#10131f', { edge: 'cut', fibre: false }));
  const lr = rng(77);
  for (let i = 0; i < 46; i++) {
    const x = 20 + i * 25 + lr() * 10;
    if (x > 60 && x < 440) continue; // the band's alcove has its own candles
    out.push(...candleNodes(x, 340, 20 + lr() * 24, 5, i % 3 === 0));
  }

  // Wall brackets, mostly high on the wall.
  for (const [bx, by, n] of [
    [150, 190, 3], [330, 175, 3], [500, 200, 2], [680, 180, 3], [860, 200, 2], [1030, 175, 3],
    [450, 275, 3], [790, 270, 3],
  ] as Array<[number, number, number]>) {
    out.push(...bracket(bx, by, n, 0.9));
  }

  // The band's alcove: a dark recess behind the platform, with a curtain top.
  out.push(
    piece(rect(70, 360, 360, 160, 6), '#10152a', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(70, 352, 360, 16, 4), VELVET, { edge: 'cut', fibre: false }),
  );
  for (let i = 0; i < 8; i++) {
    out.push(piece(rect(78 + i * 45, 368, 5, 70 + (i % 2) * 18, 2), VELVET_LIGHT, { edge: 'clean', shadow: false, opacity: 0.5 }));
  }
  // the little cold glow of the stage candles
  out.push(piece(ellipse(250, 440, 190, 90), GLOW, { edge: 'clean', shadow: false, opacity: 0.09 }));

  // Skirting where wall meets floor.
  out.push(piece(rect(-20, 534, 1220, 14, 2), '#10131f', { edge: 'cut', fibre: false }));

  // The floor: wide flagstones in rows, darker at the front.
  out.push(piece(rect(-20, 546, 1220, 300), FLOOR, { rough: 0.5 }));
  const seams: Array<[number, number]> = [[560, 600], [600, 660], [680, 730]];
  for (const [i, [yy]] of seams.entries()) {
    out.push(ink([[-20, yy], [1200, yy + 2]], { width: 2, color: '#171c2e', opacity: 0.55 - i * 0.1 }));
  }
  for (let i = 0; i < 14; i++) {
    const t = i / 13;
    out.push(ink([[40 + t * 1100, 548], [-200 + t * 1580, 640]], { width: 1.6, color: '#171c2e', opacity: 0.4 }));
  }
  // cold pools of light on the floor, behind the playing area
  out.push(
    piece(ellipse(740, 600, 330, 40), GLOW, { edge: 'clean', shadow: false, opacity: 0.1 }),
    piece(ellipse(250, 590, 220, 26), GLOW, { edge: 'clean', shadow: false, opacity: 0.09 }),
    piece(ellipse(590, 760, 500, 60), '#12172a', { edge: 'clean', shadow: false, opacity: 0.35 }),
  );

  // The platform: a deck, a front of planks and a step on the right.
  out.push(
    piece(ellipse(250, 566, 190, 12), '#0e1220', { edge: 'clean', shadow: false, opacity: 0.55 }),
    piece(rect(80, 514, 340, 48, 3), '#5a4538', { rough: 0.6 }),
    piece(rect(74, 502, 352, 18, 3), '#7c6250', { rough: 0.6 }),
    piece(rect(80, 502, 340, 4, 1), '#a08672', { edge: 'clean', shadow: false, opacity: 0.5 }),
    piece(rect(420, 536, 44, 26, 3), '#5a4538', { rough: 0.6 }),
    piece(rect(416, 530, 52, 10, 2), '#7c6250', { rough: 0.6 }),
  );
  for (let i = 1; i < 6; i++) out.push(ink([[80 + i * 56, 518], [80 + i * 56, 560]], { width: 2, color: '#3f2f27', opacity: 0.7 }));
  out.push(piece(rect(80, 514, 340, 5, 1), '#3f2f27', { edge: 'clean', shadow: false, opacity: 0.5 }));

  // Iron candle stands: big ones at the sides, small ones far back near the wall.
  out.push(...stand(1040, 640, 250, 1.1), ...stand(520, 566, 120, 0.7), ...stand(660, 566, 150, 0.8), ...stand(930, 566, 130, 0.7));

  // Black velvet drapes down the sides, and swags along the top.
  out.push(...drapeSide(-10, 92, 600, 1), ...drapeSide(1190, 92, 600, -1));
  out.push(...swags());

  // A few motes of cold light in the air.
  const mr = rng(12);
  for (let i = 0; i < 26; i++) out.push(dot(160 + mr() * 860, 160 + mr() * 380, 1 + mr() * 1.5, '#cfe9ff', 0.2 + mr() * 0.4));

  return svg({ w: 1180, h: 820, name: 'hogwarts-ghost-party', boil: false, className: 'backdrop' }, out);
}
