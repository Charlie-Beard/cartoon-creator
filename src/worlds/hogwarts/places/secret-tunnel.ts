/** The secret tunnel under the castle (made for "The Secret Way to Honeydukes"). */
import { C } from '../../../art/palette';
import { curve, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../../art/paper';

const EARTH = '#4a3d36';
const EARTH_MID = '#5d4d42';
const DARK = '#1c1714';

/** A root dangling from the ceiling. */
function root(x: number, y: number, len: number, lean: number): Node[] {
  const pts: Pt[] = [[x, y], [x + lean * 0.4, y + len * 0.4], [x + lean, y + len * 0.75], [x + lean * 0.6, y + len]];
  return [
    ink(pts, { width: 5, color: '#6b4d33' }),
    ink([[x + lean * 0.4, y + len * 0.4], [x + lean * 0.4 + 14, y + len * 0.6]], { width: 2.5, color: '#6b4d33' }),
    ink([[x + lean * 0.7, y + len * 0.8], [x + lean * 0.7 - 12, y + len * 0.95]], { width: 2, color: '#6b4d33' }),
  ];
}

/** A puddle of dark water. */
const puddle = (x: number, y: number, rx: number): Node[] => [
  piece(ellipse(x, y, rx, rx * 0.2), '#3a4a52', { edge: 'cut', fibre: false }),
  piece(ellipse(x - rx * 0.2, y - 1, rx * 0.5, rx * 0.06), '#7f9aa4', { edge: 'cut', fibre: false, shadow: false, opacity: 0.5 }),
];

/** A low, twisting earth tunnel: roots, beams, puddles, a stair up to a trapdoor at the right. */
export function secretTunnel(): string {
  const r = rng(4417);
  const nodes: Node[] = [piece(rect(-20, -20, 1220, 860), EARTH, { edge: 'clean', shadow: false })];

  // earth texture on the walls and ceiling
  for (let i = 0; i < 60; i++) {
    const x = r() * 1180;
    const y = r() * 560;
    nodes.push(piece(ellipse(x, y, 16 + r() * 30, 8 + r() * 14, r() * 3), r() > 0.5 ? EARTH_MID : '#3f332d', { edge: 'cut', fibre: false, shadow: false, opacity: 0.55 }));
  }
  // the rounded low ceiling: a heavy arch of earth framing the tunnel
  nodes.push(piece(curve([[-40, -30], [1220, -30], [1220, 140], [1000, 120], [740, 150], [560, 190], [420, 150], [160, 130], [-40, 170]], 3), '#392e29', { rough: 1.4 }));
  nodes.push(piece(curve([[-40, 170], [160, 130], [420, 150], [560, 190], [740, 150], [1000, 120], [1220, 140], [1220, 100], [560, 130], [-40, 100]], 2), EARTH_MID, { rough: 1.5, shadow: false, opacity: 0.55 }));

  // the tunnel curving away into the dark in the middle distance
  nodes.push(piece(curve([[360, 560], [330, 400], [410, 290], [560, 250], [700, 290], [770, 400], [740, 560]], 3), EARTH_MID, { rough: 1.2 }));
  nodes.push(piece(curve([[410, 560], [400, 420], [460, 330], [560, 306], [660, 336], [712, 420], [700, 560]], 3), '#2f2622', { rough: 1.1 }));
  nodes.push(piece(curve([[470, 560], [466, 440], [506, 380], [580, 364], [640, 390], [660, 450], [650, 560]], 3), '#221b18', { rough: 1.0 }));
  nodes.push(piece(curve([[536, 560], [540, 470], [574, 430], [616, 440], [630, 500], [620, 560]], 3), DARK, { rough: 0.9 }));

  // old wooden beams holding the roof up
  const beam = (x: number, lean: number) => [
    piece(rect(x - 12, 100, 24, 460, 2), '#6a4a30', { rough: 0.8 }),
    ink([[x - 4 + lean, 120], [x - 3, 540]], { width: 2, color: '#42291a', opacity: 0.5 }),
  ];
  nodes.push(...beam(170, 0), ...beam(880, 0));
  nodes.push(piece(rect(130, 96, 110, 24, 3), '#7a5638', { rough: 0.8 }), piece(rect(300, 130, 70, 18, 3), '#6a4a30', { edge: 'cut' }));

  // roots poking through
  nodes.push(...root(260, 110, 110, 20), ...root(430, 150, 70, -14), ...root(690, 150, 90, 18), ...root(820, 120, 130, -26), ...root(980, 110, 80, 12));

  // the floor of the tunnel: packed earth, plain and calm at the bottom
  nodes.push(
    piece(curve([[-40, 860], [-40, 575], [200, 560], [400, 556], [700, 556], [1000, 568], [1220, 590], [1220, 860]], 2), '#6a5646', { rough: 1.2, shadow: false }),
    piece(curve([[-40, 860], [-40, 700], [400, 690], [800, 694], [1220, 700], [1220, 860]], 2), '#715d4b', { rough: 1.3, shadow: false, opacity: 0.7 }),
  );
  // stones and puddles
  [[240, 600, 14], [330, 636, 9], [470, 590, 10], [700, 604, 12], [790, 640, 8], [90, 626, 12]].forEach(([x, y, s]) =>
    nodes.push(piece(ellipse(x, y, s * 1.4, s, 0.2), r() > 0.5 ? C.stone : C.greyDark, { edge: 'cut', fibre: false, opacity: 0.85 })),
  );
  nodes.push(...puddle(560, 596, 70), ...puddle(380, 654, 56), ...puddle(760, 666, 48));

  // the stone stair at the far right, rising to a wooden trapdoor in the ceiling
  nodes.push(piece(poly([[930, 560], [930, 110], [1220, 80], [1220, 600]]), '#3b302a', { rough: 1.1 }));
  const steps = 6;
  for (let i = 0; i < steps; i++) {
    const x = 940 + i * 40;
    const top = 650 - (i + 1) * 66;
    nodes.push(piece(rect(x, top, 1220 - x, 700 - top, 2), i % 2 ? C.stone : '#9a9892', { edge: 'cut', fibre: false }));
    nodes.push(piece(rect(x, top, 1220 - x, 10, 2), C.stoneLight, { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }));
  }
  // the trapdoor in the ceiling, seen from below, with a crack of warm light
  nodes.push(
    piece(poly([[1030, 100], [1180, 86], [1180, 150], [1030, 168]]), '#8a5a3b', { rough: 0.8 }),
    piece(poly([[1040, 108], [1170, 95], [1170, 142], [1040, 158]]), '#a06d43', { edge: 'cut', fibre: false, shadow: false }),
    ink([[1105, 100], [1105, 152]], { width: 3, color: C.brownDark, opacity: 0.6 }),
    piece(rect(1090, 124, 30, 8, 3), C.stone, { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[1034, 168], [1176, 150], [1176, 158], [1034, 178]]), C.candle, { edge: 'clean', shadow: false, opacity: 0.35 }),
  );

  // dust motes, a few drips
  for (let i = 0; i < 10; i++) nodes.push(dot(220 + r() * 600, 200 + r() * 320, 1.4 + r() * 1.6, C.sand, 0.25));

  return svg({ w: 1180, h: 820, name: 'secret-tunnel', boil: false, className: 'backdrop' }, nodes);
}
