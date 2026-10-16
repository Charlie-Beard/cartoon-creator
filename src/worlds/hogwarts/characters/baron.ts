/**
 * The Baron: Slytherin's house ghost. Tall, gaunt and cold, with a hollow
 * face, blank staring eyes, a pointed beard, an old-fashioned ruff and a
 * heavy cloak hung with silver chains. Drawn as a ghost the way Nearly
 * Headless Nick is (the same see-through `person()` treatment), but in
 * silvery grey and pale green-grey, so they read as the same kind of
 * thing. Spooky, never gory: no stains, nothing red anywhere.
 *
 * Parts: figure, head, lids, mouth, mouthOpen, chains (they sway and clink).
 * Pose `loom`: leaning in, cloak flung wide, long pale hands raised.
 */
import { band, circle, curve, ellipse, group, ink, piece, poly, type Node } from '../../../art/paper';
import { HEAD, person } from './people';

const [cx, cy] = HEAD;

const SKIN = '#cdd8d2';
const CLOAK = '#5f7a72';
const CLOAK_DARK = '#46605a';
const SILVER = '#d2dae0';
const SHADE = '#6f8680';

/** A swag of silver chain between two points, hanging in a loop of links. */
function swag(x1: number, y1: number, x2: number, y2: number, sag: number): Node[] {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 + sag;
  const n = 7;
  const links: Node[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    // quadratic curve through the three points
    const x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2;
    const y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2;
    links.push(piece(ellipse(x, y, 6, 4.2, i % 2 ? 70 : -10), SILVER, { edge: 'cut', fibre: false, shadow: false }));
    links.push(ink([[x - 4, y], [x + 4, y]], { width: 1.5, color: SHADE }));
  }
  return links;
}

const chains = (): Node =>
  group({ part: 'chains', origin: [150, 244] }, [
    ...swag(88, 262, 150, 262, 40),
    ...swag(150, 262, 212, 262, 40),
    // a long drop down the front, ending in a heavy ring
    ...[290, 306, 322].map((y, i) => piece(ellipse(150, y, i % 2 ? 4.2 : 6, i % 2 ? 6 : 4.2), SILVER, { edge: 'cut', fibre: false, shadow: false })),
    piece(circle(150, 336, 9), SILVER, { edge: 'cut', fibre: false }),
    piece(circle(150, 336, 4.5), CLOAK_DARK, { edge: 'clean', fibre: false, shadow: false, opacity: 0.8 }),
  ]);

/** Old-fashioned noble clothes: a heavy cloak, a dark doublet and a stiff ruff. */
const clothes = (wide = false): Node[] => {
  const k = wide ? 1 : 0;
  return [
    piece(curve([[24 - k * 34, 345], [42 - k * 32, 252], [96, 226], [150, 222], [204, 226], [258 + k * 32, 252], [276 + k * 34, 345]], 2), CLOAK),
    // inner fold of the cloak and the dark doublet between
    piece(curve([[104, 236], [150, 222], [196, 236], [186, 310], [150, 345], [114, 310]], 2), CLOAK_DARK, { fibre: false }),
    ink([[150, 240], [150, 338]], { width: 2, color: SHADE }),
    // ruff: a stiff pale collar made of overlapping points
    piece(poly([[94, 236], [108, 216], [120, 232], [134, 212], [150, 230], [166, 212], [180, 232], [192, 216], [206, 236], [190, 252], [150, 262], [110, 252]]), '#e6eee9', { edge: 'cut', fibre: false }),
    ink([[110, 246], [150, 256], [190, 246]], { width: 2, color: SHADE }),
  ];
};

/** Tall gaunt face: hollow shadowed sockets and cheeks, a thin beard to a point. */
const face = (): Node[] => [
  // hollow sockets round the staring eyes (see-through, so the eyes still show)
  ...[-1, 1].map((s) => piece(ellipse(cx + s * 26, cy + 2, 19, 17), '#3f5550', { edge: 'cut', fibre: false, shadow: false, opacity: 0.3 })),
  // hollow cheeks
  ...[-1, 1].map((s) => piece(ellipse(cx + s * 36, cy + 38, 10, 22, s * -16), '#5a726c', { edge: 'cut', fibre: false, shadow: false, opacity: 0.28 })),
  // heavy stern brows
  ink([[cx - 44, cy - 14], [cx - 14, cy - 6]], { width: 4.5, color: '#3f5550' }),
  ink([[cx + 44, cy - 14], [cx + 14, cy - 6]], { width: 4.5, color: '#3f5550' }),
  // thin moustache either side of the mouth, and the long pointed beard
  ink([[cx - 8, cy + 38], [cx - 30, cy + 42], [cx - 38, cy + 54]], { width: 3, color: '#a9b6b2' }),
  ink([[cx + 8, cy + 38], [cx + 30, cy + 42], [cx + 38, cy + 54]], { width: 3, color: '#a9b6b2' }),
  piece(poly([[cx - 28, cy + 62], [cx, cy + 60], [cx + 28, cy + 62], [cx + 12, cy + 100], [cx, cy + 132], [cx - 12, cy + 100]]), '#aab7b3', { edge: 'cut' }),
  ink([[cx, cy + 74], [cx, cy + 124]], { width: 2, color: '#7f8f8b' }),
  ink([[cx - 10, cy + 78], [cx - 4, cy + 112]], { width: 1.8, color: '#8a9a96' }),
  ink([[cx + 10, cy + 78], [cx + 4, cy + 112]], { width: 1.8, color: '#8a9a96' }),
];

const hair: Node[] = [
  // long thin hair falling behind the shoulders
  piece(curve([[cx - 62, cy - 20], [cx - 56, cy - 72], [cx, cy - 92], [cx + 56, cy - 72], [cx + 62, cy - 20], [cx + 70, cy + 70], [cx + 40, cy + 40], [cx - 40, cy + 40], [cx - 70, cy + 70]], 2), '#8e9d99'),
];

const baronBase = (name: string, label: string, extra: { loom?: boolean } = {}) => ({
  name,
  label,
  skin: SKIN,
  ghost: true,
  eyes: '#e3ede8',
  eyeStyle: 'wide' as const,
  face: [50, 76] as [number, number],
  ears: false,
  back: hair,
  nose: 'pointy' as const,
  mouth: 'flat' as const,
  brows: 'none' as const,
  browColor: '#3f5550',
  front: face(),
  ...(extra.loom ? { tilt: 6 } : {}),
});

export function baron(): string {
  return person({
    ...baronBase('baron', 'The Baron'),
    body: clothes(false),
    extra: [chains()],
  });
}

/** Looming: leaning in, cloak flung wide, both long pale hands raised. Same parts as the Baron, plus armL and armR. */
export function baronLoom(): string {
  const hand = (side: 1 | -1) => {
    const x = (v: number) => (side === 1 ? 150 + v : 150 - v);
    return group({ part: side === 1 ? 'armR' : 'armL', origin: [x(100), 270] }, [
      piece(band([[x(110), 330], [x(124), 270], [x(122), 214]], 36), CLOAK),
      piece(ellipse(x(122), 196, 18, 24), SKIN),
      ...[-14, -5, 5, 14].map((dx, i) => ink([[x(122 + dx * side), 184], [x(124 + dx * 1.5 * side), 160 - (i % 2) * 8], [x(116 + dx * 1.2 * side), 148 - (i % 2) * 8]], { width: 5, color: SKIN })),
    ]);
  };
  return person({
    ...baronBase('baron-loom', 'The Baron looming', { loom: true }),
    body: clothes(true),
    extra: [chains(), hand(-1), hand(1)],
  });
}
