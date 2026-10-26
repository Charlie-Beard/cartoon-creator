/**
 * Two night places for the Wishing-Chair.
 *
 * gardenNight: the garden at the bottom of the garden, in the night. The
 * playroom's wooden side stands at the left with its window glowing and its
 * door ajar; in the middle-left a round lily pond with star-reflections;
 * long grass in front, a fence and dark bushes behind, a deep blue sky with
 * a few stars and one small dark gap among them (where a star used to be).
 * Ground line y ≈ 640, the open ground x 300-950 (the pond lies across
 * x 330-640, y 625-710, so stand behind it, feet on y 640). The mood is
 * dark but kind: mid-blues, never black, so faces read.
 *
 * starCloud: high among the stars, on top of a silvery cloud. Deep blue sky,
 * many stars hanging on thin silver threads like a mobile (all above y 340
 * or out at the edges, so the middle is open), one empty silver hook at
 * x 905, y 215, and a tall thin silver ladder leaning on nothing from the
 * cloud (foot x 800, y 610) up to the hook (top x 880, y 250). Cloud top
 * y ≈ 600, stand on y ≈ 630.
 */
import { C } from '../../art/palette';
import { band, cached, circle, curve, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../art/paper';

const W = 1180;
const H = 820;
const flat = { edge: 'cut' as const, fibre: false as const, shadow: false };

/** A five-pointed star outline. */
function starPts(x: number, y: number, r: number, rot = 0, inner = 0.45): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < 10; i++) {
    const a = ((rot - 90 + i * 36) * Math.PI) / 180;
    const rr = i % 2 ? r * inner : r;
    pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
  }
  return pts;
}

/** A tuft of long grass: a fan of thin blades. */
function tuft(x: number, base: number, h: number, color: string, seed: number): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  for (let i = 0; i < 7; i++) {
    const lean = (i - 3) * 9 + (r() - 0.5) * 8;
    const bh = h * (0.6 + r() * 0.4);
    out.push(piece(poly([[x + (i - 3) * 5 - 4, base], [x + (i - 3) * 5 + 4, base], [x + (i - 3) * 5 + lean, base - bh]]), color, flat));
  }
  return out;
}

// -------------------------------------------------------------- garden-night

export const gardenNight = cached(() => {
  const r = rng(2024);
  const stars: Node[] = [];
  // a handful of stars, with a gap in the upper middle where one is missing
  for (let i = 0; i < 26; i++) {
    const x = 40 + r() * 1100;
    const y = 20 + r() * 300;
    if (Math.hypot(x - 700, y - 120) < 70) continue;
    stars.push(piece(starPts(x, y, 6 + r() * 6, r() * 70), i % 3 ? C.cream : C.goldLight, { ...flat, opacity: 0.9 }));
  }
  const pads: Node[] = [
    [400, 662, 20], [450, 686, 16], [520, 656, 18], [560, 690, 22], [600, 664, 14], [372, 690, 14],
  ].flatMap(([x, y, rr]) => [piece(ellipse(x, y, rr, rr * 0.4), '#3f7358', flat), piece(poly([[x, y], [x + rr, y - 2], [x + rr, y + 3]]), '#2f5a48', flat)]);
  const reeds: Node[] = [330, 346, 612, 628].flatMap((x, i) => [ink([[x, 676], [x + (i % 2 ? 6 : -6), 626], [x + (i % 2 ? 10 : -10), 600]], { width: 3, color: '#3d6a4e' }), piece(ellipse(x + (i % 2 ? 10 : -10), 598, 4, 11), C.brown, flat)]);

  return svg({ w: W, h: H, name: 'wishing-garden-night', boil: false, className: 'backdrop' }, [
    // The night sky, in soft torn bands, lighter at the horizon.
    piece(rect(-20, -20, W + 40, H + 40), '#1f2a56', { edge: 'clean', shadow: false, fibre: false }),
    piece(rect(-20, 150, W + 40, 300), '#27346a', { edge: 'torn', rough: 2, shadow: false, fibre: false }),
    piece(rect(-20, 300, W + 40, 300), '#31427c', { edge: 'torn', rough: 2, shadow: false, fibre: false }),
    piece(rect(-20, 410, W + 40, 300), '#3d5088', { edge: 'torn', rough: 2, shadow: false, fibre: false }),
    ...stars,
    // The little dark gap where one star is missing.
    piece(circle(700, 120, 16), '#1c2652', { ...flat, edge: 'torn', rough: 1.4 }),
    // Far dark hills.
    piece(curve([[-20, 520], [140, 470], [330, 500], [520, 450], [740, 490], [960, 450], [1200, 490], [1200, 640], [-20, 640]], 2), '#24325e', { edge: 'torn', rough: 1.4, shadow: false, fibre: false }),
    // A fence across the back, with a dark bush or two.
    piece(ellipse(1010, 520, 120, 90), '#1f4a48', { edge: 'torn', fibre: false, shadow: false }),
    piece(ellipse(930, 556, 90, 56), '#285a50', { edge: 'torn', fibre: false, shadow: false }),
    piece(rect(300, 548, 700, 8, 1), '#4a3a30', flat),
    piece(rect(300, 580, 700, 8, 1), '#4a3a30', flat),
    ...Array.from({ length: 24 }, (_, i) =>
      piece(poly([[310 + i * 29, 612], [310 + i * 29, 534], [318 + i * 29, 522], [326 + i * 29, 534], [326 + i * 29, 612]]), i % 2 ? '#5a4638' : '#66503f', { edge: 'cut', fibre: false, shadow: false }),
    ),

    // The ground: deep green-blue grass.
    piece(rect(-20, 606, W + 40, 240), '#2d5a4e', { edge: 'torn', rough: 1.4, shadow: false, fibre: false }),
    piece(rect(-20, 650, W + 40, 200), '#2a5148', { edge: 'torn', rough: 1.4, shadow: false, fibre: false }),
    // The pond: a round, flat pool with a stone rim, lily pads, reeds.
    piece(ellipse(486, 668, 176, 52), '#6f7c86', { edge: 'torn', rough: 1.2, shadow: false }),
    piece(ellipse(486, 668, 160, 44), '#1d3c64', { edge: 'clean', shadow: false }),
    piece(ellipse(486, 672, 140, 34), '#2a5282', { edge: 'torn', rough: 1.2, shadow: false, fibre: false }),
    ...[[420, 664], [520, 676], [570, 662], [458, 684]].map(([x, y]) => piece(starPts(x, y, 6, 10), C.cream, { ...flat, opacity: 0.55 })),
    ...pads,
    ...reeds,

    // The playroom's wooden side at the left: a wall, a roof edge, a window glowing, a door ajar.
    piece(rect(-30, 150, 300, 500, 3), '#6a4a34', { edge: 'cut', shadow: true }),
    ...[0, 1, 2, 3, 4, 5, 6].map((i) => piece(rect(-30 + i * 44, 150, 42, 500, 1), i % 2 ? '#7a5640' : '#6a4a34', { edge: 'cut', fibre: false, shadow: false, opacity: 0.7 })),
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => ink([[-30 + i * 44, 150], [-30 + i * 44, 645]], { width: 2.2, color: '#3a281c', opacity: 0.5 })),
    piece(poly([[-40, 156], [300, 156], [270, 100], [-40, 70]]), '#3d2d3a', { edge: 'cut', shadow: true }),
    piece(rect(-30, 640, 300, 14, 2), '#3a281c', { edge: 'cut', fibre: false }),
    // the window
    piece(rect(44, 250, 170, 170, 4), '#4a3322', { edge: 'cut' }),
    piece(rect(56, 262, 146, 146, 2), C.candle, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(62, 268, 134, 134, 2), '#fbe3a0', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    piece(band([[129, 262], [129, 408]], 8), '#4a3322', flat),
    piece(band([[56, 335], [202, 335]], 8), '#4a3322', flat),
    piece(rect(36, 420, 186, 14, 2), '#4a3322', { edge: 'cut', fibre: false }),
    piece(poly([[70, 400], [100, 330], [120, 400]]), '#c4706c', { ...flat, opacity: 0.35 }),
    // the door, ajar, with warm light spilling out on the step
    piece(rect(226, 360, 48, 290, 2), '#241a14', { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[226, 360], [262, 370], [262, 640], [226, 650]]), '#7a5238', { edge: 'cut' }),
    dot(254, 520, 4, C.brass),
    
    // Long grass in front of the corners; the bottom band stays plain.
    ...[40, 330, 700, 880, 1010, 1130].flatMap((x, i) => tuft(x, 650 + (i % 2) * 6, 56, i % 2 ? '#3a6a56' : '#437a5e', 70 + i)),
  ]);
});

// ---------------------------------------------------------------- star-cloud

export const starCloud = cached(() => {
  const r = rng(909);
  const hung: Node[] = [];
  const hang = (x: number, top: number, y: number, size: number, color: string, rot: number): void => {
    hung.push(ink([[x, top], [x, y - size * 0.85]], { width: 1.6, color: '#c8d4e6', opacity: 0.85, wobble: 0.3 }));
    hung.push(piece(circle(x, y, size * 1.7), color, { ...flat, opacity: 0.08 }));
    hung.push(piece(starPts(x, y, size, rot), color, { edge: 'cut', fibre: false, shadow: true }));
  };
  const spots: [number, number, number, number][] = [
    // x, y, size, thread top
    [60, 160, 22, -10], [150, 70, 16, -10], [210, 250, 26, -10], [300, 120, 20, -10], [388, 210, 14, -10], [440, 60, 22, -10],
    [520, 140, 16, -10], [610, 90, 24, -10], [660, 230, 15, -10], [740, 60, 18, -10], [790, 150, 14, -10],
    [1020, 100, 26, -10], [1110, 220, 18, -10], [1090, 330, 20, -10], [980, 290, 15, -10], [40, 380, 18, -10], [110, 300, 14, -10],
    [1140, 80, 14, -10],
  ];
  spots.forEach(([x, y, s, top], i) => hang(x, top, y, s, i % 3 === 0 ? C.starGold : i % 3 === 1 ? '#f0e4a8' : '#cfe0f4', r() * 70));
  // faint far stars, too
  const far: Node[] = [];
  for (let i = 0; i < 40; i++) far.push(dot(r() * W, r() * 540, 1.5 + r() * 1.5, C.cream, 0.7));

  // the silvery cloud: a lumpy top at y ≈ 600
  const puffs: Node[] = [];
  for (let i = 0; i < 12; i++) {
    const x = -40 + i * 110 + (r() - 0.5) * 30;
    puffs.push(piece(circle(x, 640 + (r() - 0.5) * 12, 62 + r() * 24), i % 2 ? '#d8e0ee' : '#e6ecf6', { rough: 1.2, shadow: i % 3 === 0 }));
  }

  return svg({ w: W, h: H, name: 'wishing-star-cloud', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, W + 40, H + 40), '#1a2352', { edge: 'clean', shadow: false, fibre: false }),
    piece(rect(-20, 120, W + 40, 300), '#222e66', { edge: 'torn', rough: 2, shadow: false, fibre: false }),
    piece(rect(-20, 280, W + 40, 300), '#2c3a78', { edge: 'torn', rough: 2, shadow: false, fibre: false }),
    piece(rect(-20, 420, W + 40, 300), '#38488a', { edge: 'torn', rough: 2, shadow: false, fibre: false }),
    ...far,
    // the mobile of hanging stars
    ...hung,
    // the one empty hook: a thread down from the dark, and a silver hook at its end
    ink([[905, -10], [905, 196]], { width: 2, color: '#c8d4e6', wobble: 0.3 }),
    ink([[905, 196], [905, 214], [913, 226], [925, 222], [924, 210]], { width: 4, color: '#dbe4f2', wobble: 0.2 }),
    // the tall thin silver ladder, leaning on nothing
    piece(band([[790, 618], [866, 258]], 7), '#c9d4e4', { edge: 'cut', fibre: false }),
    piece(band([[828, 628], [904, 268]], 7), '#d8e1ee', { edge: 'cut', fibre: false }),
    ...Array.from({ length: 12 }, (_, i) => {
      const t = (i + 0.7) / 12.6;
      const ax = 790 + (866 - 790) * t;
      const ay = 618 + (258 - 618) * t;
      const bx = 828 + (904 - 828) * t;
      const by = 628 + (268 - 628) * t;
      return piece(band([[ax, ay], [bx, by]], 5), '#b4c2d8', { edge: 'cut', fibre: false, shadow: false });
    }),
    // the cloud
    piece(rect(-20, 640, W + 40, 200), '#cdd6e6', { edge: 'torn', rough: 1.4, shadow: false, fibre: false }),
    ...puffs,
    piece(rect(-20, 700, W + 40, 140), '#d6deec', { edge: 'torn', rough: 1.4, shadow: false, fibre: false }),
    piece(ellipse(260, 626, 140, 10), '#f5f8fd', { ...flat, opacity: 0.6 }),
    piece(ellipse(620, 622, 190, 9), '#f5f8fd', { ...flat, opacity: 0.6 }),
  ]);
});
