/**
 * Magic fire curtains (made for "The Riddle of the Bottles", book 1; original
 * paper art). Each is 200 × 420 and fills a doorway: tall, soft, leaping
 * torn-paper flames rising from the floor (the flames' feet are at y 410).
 *
 * purpleFire: violet and lilac flames, pink-white at the tips and heart.
 * blackFire: inky navy-black flames with glowing deep-blue and violet rims, so
 * they still read against a dark doorway.
 *
 * Both have the same two parts:
 *   `glow`   a soft outer wash of coloured light behind the flames (fade it,
 *            or leave it still)
 *   `flames` all the tongues of fire, origin at the bottom centre (100, 410):
 *            wobble scaleY / scaleX or skewX from there, or shrink to 0 to put
 *            the fire out. Flames span x 14 to 186 and y 20 to 412.
 */
import { curve, ellipse, group, ink, piece, svg, type Node, type Pt } from '../../../art/paper';

interface Tongue {
  x: number;
  h: number;
  w: number;
  lean: number;
}

/** The tongues of one curtain: tall ones in the middle, short at the edges. */
const TONGUES: Tongue[] = [
  { x: 36, h: 250, w: 50, lean: -10 },
  { x: 164, h: 270, w: 50, lean: 12 },
  { x: 66, h: 330, w: 58, lean: 8 },
  { x: 136, h: 350, w: 58, lean: -8 },
  { x: 100, h: 392, w: 70, lean: 6 },
  { x: 18, h: 150, w: 36, lean: 6 },
  { x: 182, h: 160, w: 36, lean: -6 },
];

const FLOOR = 410;

/** One soft flame: wide at the foot, curling to a gentle tip. */
function tongue(t: Tongue, scale: number, lift = 0): Pt[] {
  const w = t.w * scale;
  const h = t.h * scale;
  const base = FLOOR - lift;
  const { x, lean } = t;
  return curve(
    [
      [x - w / 2, base],
      [x - w * 0.55, base - h * 0.3],
      [x - w * 0.25 + lean * 0.4, base - h * 0.65],
      [x + lean, base - h],
      [x + w * 0.2 + lean * 0.5, base - h * 0.62],
      [x + w * 0.55, base - h * 0.3],
      [x + w / 2, base],
    ],
    3,
  );
}

interface Layer {
  scale: number;
  fill: string;
  opacity?: number;
  lift?: number;
}

function fire(name: string, glow: Array<[number, string, number]>, layers: Layer[], rim?: string): string {
  const flames: Node[] = [];
  layers.forEach((l, li) => {
    TONGUES.forEach((t, ti) => {
      // alternate the order a little so neighbours overlap
      flames.push(piece(tongue(t, l.scale, l.lift ?? 0), l.fill, { edge: 'cut', rough: 1.1, fibre: false, shadow: false, opacity: l.opacity }));
      void li;
      void ti;
    });
  });
  if (rim) {
    // thin glowing edges along the tallest tongues
    TONGUES.slice(2, 5).forEach((t) => {
      const pts = tongue(t, 1.0);
      flames.push(ink(pts.slice(0, Math.ceil(pts.length * 0.5)), { width: 3, color: rim, opacity: 0.7, wobble: 0.6 }));
    });
  }
  return svg({ w: 200, h: 420, name, boil: false }, [
    group({ part: 'glow' }, glow.map(([ry, fill, op]) => piece(ellipse(100, FLOOR - ry * 0.55, 98, ry), fill, { edge: 'clean', shadow: false, opacity: op }))),
    group({ part: 'flames', origin: [100, FLOOR] }, flames),
  ]);
}

/** Violet and lilac flames with pink-white tips. */
export function purpleFireArt(): string {
  return fire(
    'hogwarts-purple-fire',
    [[200, '#a678e0', 0.14], [140, '#c79af0', 0.16], [80, '#e9c7fb', 0.18]],
    [
      { scale: 1.06, fill: '#5e3a9c' },
      { scale: 0.96, fill: '#7d52bf' },
      { scale: 0.8, fill: '#a87ed8' },
      { scale: 0.62, fill: '#cfaaf0' },
      { scale: 0.42, fill: '#f0d2f6' },
      { scale: 0.24, fill: '#fff0fa' },
    ],
  );
}

/** Inky navy-black flames with glowing deep-blue and violet rims. */
export function blackFireArt(): string {
  return fire(
    'hogwarts-black-fire',
    [[210, '#4a42d8', 0.2], [150, '#6a54f0', 0.2], [90, '#8a74ff', 0.16]],
    [
      { scale: 1.1, fill: '#5b4ee8' },
      { scale: 1.04, fill: '#3a3aa8' },
      { scale: 0.97, fill: '#15152f' },
      { scale: 0.76, fill: '#1f1d46' },
      { scale: 0.56, fill: '#0c0c1e' },
      { scale: 0.34, fill: '#2a2a6a' },
    ],
    '#9a88ff',
  );
}
