/**
 * The potion chamber (made for "The Riddle of the Bottles", book 1).
 *
 * A small, deep stone room far under the castle. Rough grey-brown stone walls
 * and a low vaulted ceiling, lit warm by two wall torches (left flame at about
 * x 400, y 262; right flame at about x 780, y 262), with warm pools of light on
 * the wall around them. Flagstone floor in rows; ground line at about y 660.
 *
 * Layout in the box (1180 x 820):
 *   left doorway  (the way back): x 20 to 220, y 230 to 660, round arch top;
 *                 open and dark inside, a stone frame around it (x 4 to 236)
 *   right doorway (the way on):   x 960 to 1160, y 230 to 660, the same
 *   torches: left flame centre (400, 262), right flame centre (780, 262)
 *   clear acting space: x 300 to 880, y 300 to 690 (2 or 3 actors and a table)
 *   bottom band y 690 to 820: plain flagstones, calm for captions
 * Put the fire props in the doorways: a prop 200 wide at x 20 / x 960 and
 * about 420 tall with its bottom at y 660 fills each one.
 */
import { curve, dot, ellipse, ink, piece, poly, rect, rng, svg, type Node, type Pt } from '../../../art/paper';

const WALL = '#5d5650';
const WALL_MID = '#6e665e';
const WALL_LIGHT = '#82796d';
const WALL_DARK = '#46403c';
const DARK = '#14110f';
const FLOOR = '#6a6258';
const FLOOR_LIGHT = '#7b7266';
const WARM = '#f2b665';

/** A stone doorway: frame blocks round a dark arch. x0 to x1 wide, floor at y 660. */
function doorway(x0: number, x1: number): Node[] {
  const w = x1 - x0;
  const cx = (x0 + x1) / 2;
  const top = 230;
  const spring = top + w / 2;
  const arch = (inset: number): Pt[] => {
    const pts: Pt[] = [[x0 + inset, 660], [x0 + inset, spring]];
    for (let i = 1; i < 12; i++) {
      const a = Math.PI - (i / 12) * Math.PI;
      pts.push([cx + Math.cos(a) * (w / 2 - inset), spring - Math.sin(a) * (w / 2 - inset)]);
    }
    pts.push([x1 - inset, spring], [x1 - inset, 660]);
    return pts;
  };
  const nodes: Node[] = [
    piece(arch(-16), WALL_LIGHT, { rough: 0.9 }),
    piece(arch(0), DARK, { edge: 'cut', fibre: false, shadow: false }),
    piece(arch(14), '#0b0908', { edge: 'clean', shadow: false }),
  ];
  // frame stones down the sides and round the arch
  for (let i = 0; i < 6; i++) {
    const y = 640 - i * 62;
    if (y > spring - 10) {
      nodes.push(piece(rect(x0 - 16, y - 54, 16, 56, 2), i % 2 ? WALL_MID : WALL_LIGHT, { edge: 'cut', fibre: false }));
      nodes.push(piece(rect(x1, y - 54, 16, 56, 2), i % 2 ? WALL_LIGHT : WALL_MID, { edge: 'cut', fibre: false }));
    }
  }
  for (let i = 0; i < 7; i++) {
    const a = Math.PI - ((i + 0.5) / 7) * Math.PI;
    const rr = w / 2 + 8;
    const px = cx + Math.cos(a) * rr;
    const py = spring - Math.sin(a) * rr;
    nodes.push(piece(poly([[px - 11, py - 11], [px + 11, py - 11], [px + 11, py + 11], [px - 11, py + 11]]), i % 2 ? WALL_MID : WALL_LIGHT, { edge: 'cut', fibre: false, shadow: false }));
  }
  nodes.push(piece(rect(cx - 16, top - 40, 32, 36, 3), '#8d8374', { edge: 'cut', fibre: false }));
  nodes.push(piece(rect(x0 - 18, 654, w + 36, 12, 2), WALL_MID, { edge: 'cut', fibre: false, shadow: false }));
  return nodes;
}

/** A wall torch: iron bracket, a soft paper flame and a glow. */
function torch(x: number, y: number): Node[] {
  return [
    piece(ellipse(x, y - 14, 120, 150), WARM, { edge: 'clean', shadow: false, opacity: 0.11 }),
    piece(ellipse(x, y - 14, 74, 92), WARM, { edge: 'clean', shadow: false, opacity: 0.15 }),
    piece(poly([[x - 7, y + 20], [x + 7, y + 20], [x + 5, y + 90], [x - 5, y + 90]]), '#3a3430', { edge: 'cut', fibre: false }),
    piece(poly([[x - 16, y + 6], [x + 16, y + 6], [x + 10, y + 26], [x - 10, y + 26]]), '#2e2926', { edge: 'cut', fibre: false }),
    piece(curve([[x - 12, y + 6], [x - 7, y - 22], [x, y - 52], [x + 7, y - 22], [x + 12, y + 6]], 2), '#d9823b'),
    piece(curve([[x - 7, y + 6], [x - 3, y - 16], [x + 1, y - 38], [x + 4, y - 14], [x + 7, y + 6]], 2), '#f7d283', { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(x, y - 2, 3.5, 6), '#fff2c8', { edge: 'clean', shadow: false }),
  ];
}

/** The potion chamber: two dark doorways, torchlit stone, a flagstone floor. */
export function potionChamber(): string {
  const r = rng(7731);
  const nodes: Node[] = [piece(rect(-20, -20, 1220, 860), WALL, { edge: 'clean', shadow: false })];

  // rough stone texture over the walls
  for (let i = 0; i < 90; i++) {
    const x = r() * 1180;
    const y = r() * 600;
    nodes.push(piece(ellipse(x, y, 22 + r() * 34, 14 + r() * 18, (r() - 0.5) * 0.5), r() > 0.5 ? WALL_MID : WALL_DARK, { edge: 'cut', fibre: false, shadow: false, opacity: 0.5 }));
  }
  // courses of big blocks
  for (let row = 0; row < 6; row++) {
    const y = 60 + row * 96;
    nodes.push(ink([[-10, y], [1190, y + (row % 2 ? 4 : -4)]], { width: 2.4, color: WALL_DARK, opacity: 0.55, wobble: 1.2 }));
    for (let c = 0; c < 8; c++) {
      const x = 40 + c * 150 + (row % 2) * 70 + r() * 30;
      nodes.push(ink([[x, y], [x + (r() - 0.5) * 6, y + 96]], { width: 2.2, color: WALL_DARK, opacity: 0.5, wobble: 1 }));
    }
  }
  // low vaulted ceiling, dark at the top
  nodes.push(piece(curve([[-40, -30], [1220, -30], [1220, 130], [1000, 160], [760, 120], [590, 100], [420, 120], [180, 160], [-40, 130]], 3), '#2c2724', { rough: 1.3 }));
  nodes.push(piece(curve([[-40, 130], [180, 160], [420, 120], [590, 100], [760, 120], [1000, 160], [1220, 130], [1220, 100], [590, 70], [-40, 100]], 2), WALL_DARK, { rough: 1.4, shadow: false, fibre: false, opacity: 0.6 }));

  // the two doorways
  nodes.push(...doorway(20, 220), ...doorway(960, 1160));

  // torches, with warm light spilling on the wall
  nodes.push(piece(ellipse(400, 300, 190, 230), WARM, { edge: 'clean', shadow: false, opacity: 0.07 }));
  nodes.push(piece(ellipse(780, 300, 190, 230), WARM, { edge: 'clean', shadow: false, opacity: 0.07 }));
  nodes.push(...torch(400, 270), ...torch(780, 270));

  // cracks and a little moss for mystery
  [[330, 420], [860, 440], [610, 200]].forEach(([x, y]) => {
    nodes.push(ink([[x, y], [x + 18, y + 26], [x + 10, y + 52], [x + 30, y + 80]], { width: 2, color: WALL_DARK, opacity: 0.6, wobble: 1 }));
  });
  [[280, 560], [905, 560], [560, 520]].forEach(([x, y]) =>
    nodes.push(piece(ellipse(x, y, 26, 9), '#5d6b4a', { edge: 'cut', fibre: false, shadow: false, opacity: 0.5 })),
  );

  // the floor: flagstones in rows, ground line y 660
  nodes.push(piece(curve([[-40, 860], [-40, 650], [300, 640], [600, 636], [900, 640], [1220, 650], [1220, 860]], 2), FLOOR, { rough: 1.1, shadow: false }));
  const rows = [660, 700, 750, 820];
  rows.forEach((y, i) => {
    nodes.push(ink([[-10, y], [1190, y]], { width: 2.2, color: WALL_DARK, opacity: 0.4, wobble: 1 }));
    const gap = 120 + i * 20;
    const nextY = rows[i + 1] ?? 860;
    for (let x = -20 + ((i * 53) % gap); x < 1200; x += gap) {
      nodes.push(ink([[x, y], [x + (i - 1) * 4, nextY]], { width: 2, color: WALL_DARK, opacity: 0.35, wobble: 1 }));
    }
  });
  for (let i = 0; i < 14; i++) {
    nodes.push(piece(ellipse(60 + r() * 1060, 665 + r() * 150, 30 + r() * 26, 7 + r() * 5), r() > 0.5 ? FLOOR_LIGHT : '#5b544b', { edge: 'cut', fibre: false, shadow: false, opacity: 0.35 }));
  }
  nodes.push(piece(ellipse(590, 700, 360, 40), WARM, { edge: 'clean', shadow: false, opacity: 0.08 }));

  // dust motes
  for (let i = 0; i < 12; i++) nodes.push(dot(300 + r() * 580, 200 + r() * 400, 1.2 + r() * 1.4, '#f7d283', 0.28));

  return svg({ w: 1180, h: 820, name: 'hogwarts-potion-chamber', boil: false, className: 'backdrop' }, nodes);
}
