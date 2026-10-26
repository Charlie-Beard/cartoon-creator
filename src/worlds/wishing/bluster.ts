/**
 * Bluster: a big grumpy grey storm cloud with a face.
 *
 * A heap of lumpy grey paper puffs with a dark underside, heavy frowning
 * eyebrows, puffed cheeks and a downturned mouth. He has no arms and no
 * legs: when he is cross the whole cloud swells (scale him in the script),
 * and a few cold raindrops hang under him. He is grumpy because nobody ever
 * says hooray for the rain, and he is really shy.
 *
 * Poses (the plain portrait is the grumpy cloud, frowning):
 *   blow   cheeks puffed right out, lips pursed in an "o", brows down:
 *          blowing his wind (streaks of wind flow away to the right).
 *   sulk   a small, droopy cloud, sagging low, worried brows, a small
 *          frown, a single tear-drop of rain.
 *   beam   a bright smile, raised brows, and a pale silver lining glowing
 *          along the top of every puff.
 *
 * Parts: figure, head, eyes, lids, brows, mouth, mouthOpen. The face sits
 * inside the chip box 78 62 144 144.
 */
import { C } from '../../art/palette';
import { cached, circle, dot, ellipse, group, ink, piece, poly, type Node, type Pt } from '../../art/paper';
import { brows, cheeks, CUT, cx, cy, eyes, FLAT, mouthShape, portrait, talkShape } from '../faraway/parts';

type Mood = 'grumpy' | 'blow' | 'sulk' | 'beam';

const GREY = '#7a8594';
const GREY_DARK = '#5c6776';
const GREY_LIGHT = '#9aa5b3';
const SILVER = '#eef3fa';
const RAIN = '#6fa3d2';

/** The puffs that make the cloud: [x, y, radius]. */
const PUFFS: [number, number, number][] = [
  [62, 190, 52], [96, 120, 62], [160, 92, 68], [226, 118, 62], [250, 190, 52],
  [88, 238, 56], [150, 252, 62], [212, 238, 56], [150, 170, 90],
];

/** Squash the puffs about the cloud's middle bottom (the sulking cloud is smaller and lower). */
function puffs(shrink: number, drop: number): [number, number, number][] {
  return PUFFS.map(([x, y, r]) => [150 + (x - 150) * shrink, 250 + drop + (y - 250) * shrink, r * shrink]);
}

function draw(mood: Mood, name: string, label: string): string {
  const blow = mood === 'blow';
  const sulk = mood === 'sulk';
  const beam = mood === 'beam';
  const shrink = sulk ? 0.8 : 1;
  const ps = puffs(shrink, sulk ? 18 : 0);
  const fy = sulk ? cy + 26 : cy + 4;
  const at: Pt = [cx, fy];

  const underside: Node[] = ps.map(([x, y, r]) => piece(circle(x + 4, y + 10, r), GREY_DARK, { rough: 1.2, shadow: false }));
  const body: Node[] = ps.map(([x, y, r], i) => piece(circle(x, y, r), i % 2 ? GREY : GREY_LIGHT, { rough: 1.3, shadow: i < 5 }));
  // A paler belly patch round the face so the features read.
  const belly = piece(ellipse(cx, fy + 6, 78 * shrink, 70 * shrink), GREY_LIGHT, { ...FLAT, opacity: 0.55 });
  // Silver lining along the top of every upper puff (beam only).
  const lining: Node[] = beam
    ? ps.slice(0, 5).map(([x, y, r]) =>
        ink(Array.from({ length: 9 }, (_, i) => {
          const a = ((-165 + i * 16) * Math.PI) / 180;
          return [x + Math.cos(a) * (r - 2), y + Math.sin(a) * (r - 2)] as Pt;
        }), { width: 7, color: SILVER, wobble: 0.3 }),
      )
    : [];
  const glow: Node[] = beam ? [piece(circle(cx, 150, 150), SILVER, { ...FLAT, opacity: 0.18 })] : [];

  // Face
  const o = {
    skin: GREY_LIGHT,
    at,
    eyes: (beam ? 'happy' : 'round') as 'happy' | 'round',
    eyeCol: '#33404f',
    eyeDx: sulk ? 28 : 32,
    eyeY: -6,
    brows: (beam ? 'raised' : sulk ? 'worried' : 'cross') as 'raised' | 'worried' | 'cross',
    browCol: '#2a3340',
    browY: -22,
    cheeks: (beam ? C.pink : false) as string | false,
  };
  const mouthStyle = blow ? 'o' : sulk ? 'frown' : beam ? 'beam' : 'frown';
  const my = fy + 46;
  // Heavy brows: a second, thicker brow stroke over the standard pair (grumpy and blow).
  const heavy: Node[] = !beam && !sulk
    ? [
        ink([[cx - 54, fy - 36], [cx - 30, fy - 30], [cx - 10, fy - 24]], { width: 11, color: '#2a3340', wobble: 0.2 }),
        ink([[cx + 54, fy - 36], [cx + 30, fy - 30], [cx + 10, fy - 24]], { width: 11, color: '#2a3340', wobble: 0.2 }),
      ]
    : [];
  // Puffed cheeks (grumpy a little, blow a lot).
  const puffCheeks: Node[] = blow
    ? [
        piece(circle(cx - 48, fy + 30, 30), GREY_LIGHT, CUT),
        piece(circle(cx + 48, fy + 30, 30), GREY_LIGHT, CUT),
        piece(circle(cx - 50, fy + 34, 17), '#c9a6a8', { ...FLAT, opacity: 0.5 }),
        piece(circle(cx + 50, fy + 34, 17), '#c9a6a8', { ...FLAT, opacity: 0.5 }),
      ]
    : !beam && !sulk
      ? [piece(circle(cx - 44, fy + 28, 22), GREY_LIGHT, CUT), piece(circle(cx + 44, fy + 28, 22), GREY_LIGHT, CUT)]
      : [];

  // Rain hanging under him (grumpy, sulk) and wind streaks (blow).
  const drops: Node[] = [];
  if (!beam && !blow) {
    const baseY = sulk ? 296 : 306;
    const spots: [number, number][] = sulk ? [[-34, 0]] : [[-70, 0], [-20, 12], [40, 2], [86, 14]];
    for (const [dx, dy] of spots)
      drops.push(piece(poly([[cx + dx, baseY + dy], [cx + dx + 7, baseY + dy + 14], [cx + dx, baseY + dy + 20], [cx + dx - 7, baseY + dy + 14]]), RAIN, FLAT));
  }
  const wind: Node[] = blow
    ? [0, 1, 2].map((i) => ink([[246 + i * 6, 150 + i * 24], [266 + i * 8, 146 + i * 24], [296, 152 + i * 24]], { width: 4, color: SILVER, opacity: 0.85, wobble: 0.6 }))
    : [];

  return portrait(name, label, [
    group({ part: 'figure', origin: [150, 300] }, [
      ...glow,
      ...underside,
      ...body,
      ...lining,
      ...drops,
      group({ part: 'head', origin: [cx, fy + 40] }, [
        belly,
        ...puffCheeks,
        ...(beam ? cheeks(o) : []),
        ...eyes(o),
        ...brows(o),
        ...heavy,
        group({ part: 'mouth', origin: [cx, my] }, mouthShape(mouthStyle, cx, my, 1.1)),
        group({ part: 'mouthOpen', origin: [cx, my], opacity: 0 }, talkShape(cx, my, 1.15)),
        ...(sulk ? [ink([[cx + 52, fy - 2], [cx + 52, fy + 22]], { width: 4, color: RAIN, opacity: 0.8 }), dot(cx + 52, fy + 28, 5, RAIN, 0.9)] : []),
      ]),
      ...wind,
    ]),
  ]);
}

/** Bluster the storm cloud, grumpy: heavy brows, puffed cheeks, a downturned mouth. */
export const bluster = cached((): string => draw('grumpy', 'wishing-bluster', 'Bluster'));

/** Blowing his wind: cheeks puffed right out, lips pursed, wind streaks flowing away. */
export const blusterBlow = cached((): string => draw('blow', 'wishing-bluster-blow', 'Bluster blowing'));

/** Sulking: a small, droopy cloud, worried brows and one tear of rain. */
export const blusterSulk = cached((): string => draw('sulk', 'wishing-bluster-sulk', 'Bluster sulking'));

/** Beaming: a big smile and a silver lining glowing along his top. */
export const blusterBeam = cached((): string => draw('beam', 'wishing-bluster-beam', 'Bluster beaming'));
