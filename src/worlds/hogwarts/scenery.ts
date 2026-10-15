/**
 * Two backdrops from Wizard Words (the night sky and the castle on its hill),
 * plus the Forbidden Forest, which is new. Static, so they never compete for attention.
 */
import { C } from '../../art/palette';
import { curve, ellipse, group, piece, poly, rect, rng, svg, type Node, type Pt } from '../../art/paper';

function stars(count: number, seed: number, w: number, maxY: number): Node[] {
  const r = rng(seed);
  const out: Node[] = [];
  for (let i = 0; i < count; i++) {
    const x = r() * w;
    const y = r() * maxY;
    const s = 2 + r() * 4;
    const pts: Pt[] = [];
    for (let k = 0; k < 8; k++) {
      const a = (k * Math.PI) / 4 + r() * 0.2;
      const rr = k % 2 ? s * 0.4 : s;
      pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
    }
    out.push(piece(poly(pts), r() > 0.8 ? C.goldLight : C.cream, { edge: 'cut', fibre: false, shadow: false, opacity: 0.5 + r() * 0.4 }));
  }
  return out;
}

/** Quiet night sky for the spelling desk. */
export function nightSky(name = 'sky'): string {
  return svg({ w: 1180, h: 820, name, boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), C.night, { edge: 'clean', shadow: false }),
    ...stars(46, 7, 1180, 820),
  ]);
}

/** Torn-paper hills layer. */
function hills(y: number, amp: number, color: string, seed: number, w = 1180): Node {
  const r = rng(seed);
  const pts: Pt[] = [[-40, 900]];
  for (let x = -40; x <= w + 40; x += 90) pts.push([x, y - r() * amp]);
  pts.push([w + 40, 900]);
  return piece(curve(pts, 2), color, { rough: 1.4 });
}

/** Hogwarts on its hill at night (title and map). */
export function castleNight(name = 'castle'): string {
  const tower = (x: number, top: number, w: number, roof: string): Node[] => [
    piece(rect(x, top, w, 640 - top), C.nightLight, { rough: 0.8 }),
    piece(poly([[x - 10, top + 4], [x + w / 2, top - w * 1.25], [x + w + 10, top + 4]]), roof, { rough: 0.8 }),
  ];
  const win = (x: number, y: number) =>
    piece(rect(x, y, 12, 20, 6), C.candle, { edge: 'cut', fibre: false, shadow: false });
  return svg({ w: 1180, h: 820, name, boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), C.night, { edge: 'clean', shadow: false }),
    ...stars(70, 3, 1180, 520),
    piece(ellipse(1040, 290, 50), C.cream, { rough: 0.8 }),
    piece(ellipse(1060, 278, 43), C.night, { edge: 'cut', fibre: false, shadow: false }),
    hills(560, 50, '#2a3157', 21),
    group({}, [
      ...tower(470, 330, 60, C.slate),
      ...tower(560, 250, 74, C.slate),
      ...tower(660, 300, 64, C.slate),
      ...tower(760, 380, 54, C.slate),
      piece(rect(430, 420, 420, 220), C.nightLight, { rough: 0.8 }),
      piece(rect(400, 470, 50, 170), C.nightLight, { rough: 0.8 }),
      piece(poly([[392, 474], [425, 420], [458, 474]]), C.slate, { rough: 0.8 }),
      win(487, 380), win(590, 300), win(612, 340), win(690, 350), win(775, 420),
      win(470, 470), win(520, 500), win(600, 470), win(660, 510), win(740, 470), win(800, 520),
    ]),
    hills(640, 40, '#232a4a', 33),
    hills(720, 34, '#1b2140', 45),
    piece(ellipse(590, 760, 700, 90), '#161b33', { rough: 1.2, shadow: false }),
  ]);
}

/**
 * The edge of the Forbidden Forest at night (new for the cartoon world):
 * a dark sky and a pale moon in a gap between the trees, three layers of
 * blue-black trunks fading into mist, a mossy floor with a few toadstools.
 * Spooky but soft: nothing here is looking at anyone. Ground line at about
 * y 650, with the middle (x 300 to 900) left open for actors.
 */
export function forbiddenForest(name = 'forbidden-forest'): string {
  const trunk = (x: number, w: number, color: string, lean = 0): Node =>
    piece(poly([[x - w / 2, 740], [x - w / 2 + lean, -20], [x + w / 2 + lean, -20], [x + w / 2, 740]]), color, { edge: 'cut', fibre: false, shadow: false });
  /** A torn band of leaves across the top, from x0 to x1, hanging down to about `drop`. */
  const leaves = (x0: number, x1: number, drop: number, seed: number, color: string): Node => {
    const r = rng(seed);
    const pts: Pt[] = [[x0, -30]];
    for (let x = x1; x >= x0; x -= 70) pts.push([x, drop * (0.5 + r() * 0.7)]);
    pts.push([x0, drop * 0.8]);
    return piece(curve(pts, 2), color, { edge: 'cut', fibre: false, shadow: false });
  };
  const r = rng(91);
  const gap = (x: number) => x > 700 && x < 940; // keep the moon clear
  const far: Node[] = [];
  for (let i = 0; i < 12; i++) {
    const x = 30 + i * 100 + r() * 40;
    if (!gap(x)) far.push(trunk(x, 28 + r() * 20, '#2a3850', r() * 10 - 5));
  }
  const mid: Node[] = [];
  for (let i = 0; i < 7; i++) {
    const x = 60 + i * 190 + r() * 50;
    if (!gap(x)) mid.push(trunk(x, 56 + r() * 30, '#1b2638', r() * 14 - 7));
  }
  const toadstool = (x: number, y: number, s: number): Node[] => [
    piece(rect(x - 4 * s, y - 14 * s, 8 * s, 18 * s, 2), C.cream, { edge: 'cut', fibre: false, shadow: false }),
    piece(curve([[x - 18 * s, y - 12 * s], [x, y - 32 * s], [x + 18 * s, y - 12 * s]], 2), C.redDark, { edge: 'cut', fibre: false, shadow: false }),
  ];
  return svg({ w: 1180, h: 820, name, boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), C.night, { edge: 'clean', shadow: false }),
    ...stars(34, 12, 1180, 260),
    // the moon, with a soft halo
    piece(ellipse(820, 200, 120), C.cream, { edge: 'clean', shadow: false, fibre: false, opacity: 0.08 }),
    piece(ellipse(820, 200, 58), C.cream, { edge: 'cut', fibre: false, shadow: false }),
    ...far,
    leaves(-40, 700, 150, 3, '#1f2c42'),
    leaves(940, 1220, 150, 4, '#1f2c42'),
    // mist between the layers
    piece(ellipse(590, 520, 800, 90), C.slate, { edge: 'clean', shadow: false, fibre: false, opacity: 0.1 }),
    piece(ellipse(590, 570, 760, 70), C.slate, { edge: 'clean', shadow: false, fibre: false, opacity: 0.12 }),
    piece(ellipse(590, 620, 800, 50), C.slate, { edge: 'clean', shadow: false, fibre: false, opacity: 0.14 }),
    ...mid,
    leaves(-40, 600, 110, 5, '#141d2c'),
    leaves(1000, 1220, 120, 6, '#141d2c'),
    // the two near trunks frame the scene
    trunk(60, 130, '#0f1620', 10),
    trunk(1120, 150, '#0f1620', -12),
    // the mossy floor
    hills(650, 22, '#26402f', 51),
    hills(710, 16, '#1d3426', 52),
    ...toadstool(330, 705, 1), ...toadstool(362, 716, 0.7), ...toadstool(900, 710, 1.1),
    piece(ellipse(590, 800, 700, 70), '#0f1a14', { rough: 1.2, shadow: false }),
  ]);
}
