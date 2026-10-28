/**
 * Prickles: the hedgehog postman.
 *
 * Small and round, with a fan of brown torn-paper spines (two tones, a
 * spiky outline) behind his head and body, a cream face with a pointed
 * snout ending in a shiny black button nose, small bright eyes, rosy
 * cheeks and little round ears. A red postman's cap with a plain gold badge
 * (no lettering), a navy jacket with gold buttons, brown paws, and a red
 * satchel strap across him with the satchel at his side, bulging with
 * white envelopes. Polite, a bit worried, always trying to do right.
 *
 * Poses (the portrait itself is Prickles standing, polite and worried):
 *   ball   curled in a tight, round, spiky ball, frightened: the red cap
 *          perched on top, eyes shut tight, only his snout and two paws
 *          peeping out low on the front. The ball is 240 wide, sitting on
 *          the bottom of the box.
 *   happy  a big smile, brows up, his right arm raised waving a white letter.
 *
 * Parts: figure, head, eyes, lids, brows, mouth, mouthOpen, armL, armR
 * (both pivot at the shoulder).
 */
import { C } from '../../art/palette';
import { cached, circle, curve, dot, ellipse, group, ink, piece, poly, type Node, type Pt } from '../../art/paper';
import { arm, CUT, FLAT, portrait } from '../faraway/parts';

type Mood = 'plain' | 'ball' | 'happy';

const SPINE = '#6a4328';
const SPINE_LIGHT = '#9a6b3e';
const SPINE_TIP = '#c4965a';
const FACE = '#f0dcb4';
const SNOUT = '#dcbf8c';
const SKIN = '#c79a64';
const CHEEK = '#e8907c';
const INK = '#2a1c14';
const NOSE = '#14100e';
const CAP = C.coatRed;
const CAP_DARK = '#8a2a24';
const GOLD = '#e0b43c';
const JACKET = '#27406e';
const JACKET_DARK = '#1c2f52';
const PAPER = '#fffaf0';
const PAPER_EDGE = '#d9d0bc';

/** A ring of spines round a centre: points alternate in (the roots) and out (the tips). */
function spiky(x: number, y: number, rx: number, ry: number, n: number, spike: number, rot = 0): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2 + rot;
    const k = i % 2 ? 1 : 1 + spike;
    out.push([x + Math.cos(a) * rx * k, y + Math.sin(a) * ry * k]);
  }
  return out;
}

/** The mass of spines: a dark ring, a lighter ring inside it, and pale tips scattered on top. */
function spines(x: number, y: number, rx: number, ry: number, n: number, spike: number): Node[] {
  const tips: Node[] = [];
  for (let i = 0; i < n; i++) {
    const a = ((i + 0.5) / n) * Math.PI * 2 - Math.PI / 2;
    // only the upper and side tips: the lower ones would sit on his body
    const px = x + Math.cos(a) * rx * (1 + spike * 0.55);
    const py = y + Math.sin(a) * ry * (1 + spike * 0.55);
    const qx = x + Math.cos(a) * rx * (1 + spike * 1.05);
    const qy = y + Math.sin(a) * ry * (1 + spike * 1.05);
    tips.push(ink([[px, py], [qx, qy]], { width: 2.4, color: SPINE_TIP, opacity: 0.85, wobble: 0.3 }));
  }
  return [
    piece(spiky(x, y, rx, ry, n, spike), SPINE, { edge: 'cut', fibre: false, rough: 0.8 }),
    piece(ellipse(x, y, rx * 0.95, ry * 0.95), SPINE, { rough: 1.1 }),
    piece(spiky(x, y + 2, rx * 0.8, ry * 0.8, n, spike * 1.1, Math.PI / n), SPINE_LIGHT, { edge: 'cut', fibre: false, rough: 0.8, opacity: 0.9 }),
    ...tips,
  ];
}

/** The red postman's cap, front on: crown, band, peak and a plain gold badge. */
function cap(x: number, y: number): Node[] {
  return [
    piece(curve([[x - 46, y + 34], [x - 44, y + 4], [x - 22, y - 12], [x, y - 16], [x + 22, y - 12], [x + 44, y + 4], [x + 46, y + 34]], 2), CAP, { rough: 1.1 }),
    piece(poly([[x - 47, y + 26], [x + 47, y + 26], [x + 48, y + 38], [x - 48, y + 38]]), CAP_DARK, CUT),
    piece(ellipse(x, y + 40, 50, 8), CAP_DARK, { ...CUT, rough: 0.8 }),
    piece(circle(x, y + 8, 9), GOLD, CUT),
    piece(poly([[x, y + 1], [x + 3, y + 7], [x + 9, y + 8], [x + 4, y + 12], [x + 6, y + 18], [x, y + 14], [x - 6, y + 18], [x - 4, y + 12], [x - 9, y + 8], [x - 3, y + 7]]), '#f6dc78', { ...FLAT, opacity: 0.85 }),
  ];
}

/** A white envelope, `rot` degrees, with a little flap line and a stamp. */
function envelope(x: number, y: number, w: number, h: number, rot: number): Node {
  const hw = w / 2;
  const hh = h / 2;
  const p = (dx: number, dy: number): Pt => {
    const a = (rot * Math.PI) / 180;
    return [x + dx * Math.cos(a) - dy * Math.sin(a), y + dx * Math.sin(a) + dy * Math.cos(a)];
  };
  return group({}, [
    piece(poly([p(-hw, -hh), p(hw, -hh), p(hw, hh), p(-hw, hh)]), PAPER, CUT),
    ink([p(-hw, -hh), p(0, 0), p(hw, -hh)], { width: 1.6, color: PAPER_EDGE, wobble: 0.2 }),
    piece(poly([p(hw - 11, -hh + 3), p(hw - 3, -hh + 3), p(hw - 3, -hh + 13), p(hw - 11, -hh + 13)]), CAP, { ...FLAT, opacity: 0.85 }),
  ]);
}

function draw(mood: Mood, name: string, label: string): string {
  const ball = mood === 'ball';
  const happy = mood === 'happy';

  // face centre: the standing poses have the face high; the ball has it tucked low on the front
  const fx = 150;
  const fy = ball ? 192 : 150;

  // --- eyes, lids, brows
  const ex = 22;
  const ey = fy - 4;
  const eyeAt = (x: number): Node[] => [
    piece(circle(x, ey, 8.5), NOSE, { edge: 'clean', shadow: false }),
    dot(x - 2.6, ey - 3, 3, '#ffffff'),
    dot(x + 2.6, ey + 3, 1.4, '#ffffff', 0.8),
  ];
  const eyes: Node[] = ball
    ? [
        ink([[fx - ex - 9, ey - 2], [fx - ex, ey + 5], [fx - ex + 9, ey - 2]], { width: 3.4, color: INK }),
        ink([[fx + ex - 9, ey - 2], [fx + ex, ey + 5], [fx + ex + 9, ey - 2]], { width: 3.4, color: INK }),
      ]
    : [...eyeAt(fx - ex), ...eyeAt(fx + ex)];
  const lids: Node[] = ball
    ? []
    : [
        piece(ellipse(fx - ex, ey, 11, 11), FACE, { edge: 'cut', fibre: false, shadow: false }),
        piece(ellipse(fx + ex, ey, 11, 11), FACE, { edge: 'cut', fibre: false, shadow: false }),
        ink([[fx - ex - 8, ey + 1], [fx - ex, ey + 5], [fx - ex + 8, ey + 1]], { width: 2.6, color: INK }),
        ink([[fx + ex - 8, ey + 1], [fx + ex, ey + 5], [fx + ex + 8, ey + 1]], { width: 2.6, color: INK }),
      ];
  const by = ey - 17;
  const brows: Node[] = happy
    ? [
        ink([[fx - ex - 10, by + 2], [fx - ex, by - 4], [fx - ex + 10, by + 1]], { width: 3.2, color: SPINE }),
        ink([[fx + ex - 10, by + 1], [fx + ex, by - 4], [fx + ex + 10, by + 2]], { width: 3.2, color: SPINE }),
      ]
    : [
        // worried: the inner ends tilt up
        ink([[fx - ex - 10, by + 6], [fx - ex + 11, by - 4]], { width: 3.4, color: SPINE }),
        ink([[fx + ex + 10, by + 6], [fx + ex - 11, by - 4]], { width: 3.4, color: SPINE }),
      ];

  // --- snout, nose, cheeks
  const snoutY = fy + 14;
  const snout: Node[] = [
    piece(poly([[fx - 22, snoutY - 8], [fx + 22, snoutY - 8], [fx + 8, snoutY + 14], [fx, snoutY + 17], [fx - 8, snoutY + 14]]), SNOUT, { edge: 'torn', rough: 0.7 }),
    piece(ellipse(fx, snoutY + 14, 9, 7), NOSE, { edge: 'clean', shadow: false }),
    dot(fx - 3, snoutY + 11.5, 2.6, '#ffffff', 0.9),
  ];
  const cheeks: Node[] = [
    piece(ellipse(fx - 38, snoutY + 2, 10, 7), CHEEK, { ...FLAT, opacity: 0.6 }),
    piece(ellipse(fx + 38, snoutY + 2, 10, 7), CHEEK, { ...FLAT, opacity: 0.6 }),
  ];

  // --- mouth, closed and open in the same place, under the snout
  const my = snoutY + 28;
  const mouth: Node[] = [
    group({ part: 'mouth', origin: [fx, my] }, [
      happy
        ? ink([[fx - 17, my - 6], [fx - 8, my + 4], [fx, my + 6], [fx + 8, my + 4], [fx + 17, my - 6]], { width: 2.8, color: INK })
        : ink([[fx - 9, my], [fx - 4, my + 2], [fx, my], [fx + 4, my + 2], [fx + 9, my]], { width: 2.6, color: INK }),
      ...(happy ? [piece(poly([[fx - 14, my - 3], [fx + 14, my - 3], [fx + 8, my + 4], [fx, my + 6], [fx - 8, my + 4]]), '#7a2a30', { edge: 'clean', shadow: false })] : []),
    ]),
    group({ part: 'mouthOpen', origin: [fx, my], opacity: 0 }, [
      piece(ellipse(fx, my + 2, happy ? 15 : 10, happy ? 11 : 8), '#5a1a24', { edge: 'clean', shadow: false }),
      piece(ellipse(fx, my + 7, happy ? 8 : 5, 4), '#e07a84', { edge: 'clean', shadow: false }),
    ]),
  ];

  // --- the head: ears, tan head, cream face
  const head: Node[] = [];
  if (!ball) {
    head.push(...spines(fx, fy - 10, 62, 52, 12, 0.22));
    for (const s of [-1, 1]) {
      head.push(piece(circle(fx + s * 54, fy - 24, 16), SKIN, { rough: 0.8 }));
      head.push(piece(circle(fx + s * 54, fy - 24, 9), CHEEK, { ...FLAT, opacity: 0.65 }));
    }
    head.push(piece(ellipse(fx, fy + 2, 54, 50), SKIN, { rough: 0.9 }));
    head.push(piece(ellipse(fx, fy + 10, 42, 38), FACE, { rough: 0.7 }));
  } else {
    // only a small face peeps out of the spines
    head.push(piece(ellipse(fx, fy + 6, 46, 40), SKIN, { rough: 0.8 }));
    head.push(piece(ellipse(fx, fy + 12, 36, 30), FACE, { rough: 0.7 }));
  }
  head.push(...cheeks, ...snout);

  // --- the body
  const body: Node[] = [];
  const arms: Node[] = [];
  if (ball) {
    // a tight round ball of spines, 240 wide, sitting on the bottom of the box
    body.push(...spines(150, 220, 100, 100, 17, 0.2));
    // little rolled-up feet and paws peep out beside the face
    body.push(piece(ellipse(104, 232, 13, 10), SKIN, CUT), piece(ellipse(196, 232, 13, 10), SKIN, CUT));
    arms.push(group({ part: 'armL', origin: [112, 222] }, [piece(ellipse(110, 226, 11, 9), SKIN, CUT)]));
    arms.push(group({ part: 'armR', origin: [188, 222] }, [piece(ellipse(190, 226, 11, 9), SKIN, CUT)]));
  } else {
    // spines fan out behind his back
    body.push(...spines(150, 256, 112, 86, 16, 0.24));
    // jacket, a darker panel down the front, gold buttons
    body.push(piece(curve([[84, 342], [80, 268], [100, 214], [150, 198], [200, 214], [220, 268], [216, 342]], 2), JACKET, { rough: 1.1 }));
    body.push(piece(poly([[144, 206], [156, 206], [158, 342], [142, 342]]), JACKET_DARK, { ...FLAT, opacity: 0.55 }));
    body.push(piece(poly([[120, 204], [150, 232], [180, 204], [168, 200], [150, 214], [132, 200]]), '#f4efe4', CUT));
    for (const y of [248, 276, 304]) {
      body.push(piece(circle(150, y, 6), GOLD, CUT), dot(148, y - 2, 1.8, '#fff2b0', 0.9));
    }
    // satchel at his left hip (viewer's left), bulging with envelopes
    const sx = 74;
    const sy = 296;
    body.push(
      piece(curve([[sx - 34, sy + 38], [sx - 38, sy - 8], [sx - 18, sy - 22], [sx + 20, sy - 22], [sx + 40, sy - 8], [sx + 36, sy + 38]], 2), CAP, { rough: 1.0 }),
      envelope(sx - 4, sy - 22, 34, 22, -10),
      envelope(sx + 12, sy - 20, 32, 22, 12),
      piece(curve([[sx - 36, sy - 6], [sx, sy + 12], [sx + 38, sy - 6], [sx + 38, sy + 6], [sx, sy + 24], [sx - 36, sy + 6]], 2), CAP_DARK, { ...CUT, rough: 0.8 }),
      piece(circle(sx, sy + 14, 5), GOLD, CUT),
    );
    // strap across his chest, from right shoulder down to the satchel
    body.push(piece(poly([[192, 206], [206, 216], [92, 290], [82, 276]]), CAP, { edge: 'cut', fibre: false }));
    // little feet
    body.push(piece(ellipse(124, 336, 22, 9), SKIN, CUT), piece(ellipse(176, 336, 22, 9), SKIN, CUT));

    // --- arms: navy sleeves, brown paws, pivoting at the shoulder
    arms.push(
      arm('armL', { from: [96, 220], to: [84, 300], sleeve: JACKET, width: 24, hand: SKIN, handR: 11, cuff: JACKET_DARK }),
    );
    if (happy) {
      arms.push(
        arm('armR', {
          from: [204, 220],
          via: [236, 196],
          to: [244, 150],
          sleeve: JACKET,
          width: 24,
          hand: SKIN,
          handR: 11,
          cuff: JACKET_DARK,
          holding: [envelope(246, 128, 38, 26, 14)],
        }),
      );
    } else {
      arms.push(arm('armR', { from: [204, 220], to: [216, 300], sleeve: JACKET, width: 24, hand: SKIN, handR: 11, cuff: JACKET_DARK }));
    }
  }

  const capNode: Node[] = ball ? cap(150, 96) : cap(150, fy - 72);

  return portrait(name, label, [
    group({ part: 'figure', origin: [150, 340] }, [
      ...body,
      group({ part: 'head', origin: [150, ball ? 240 : 206] }, [
        ...head,
        group({ part: 'eyes', origin: [fx, ey] }, eyes),
        group({ part: 'lids', origin: [fx, ey], opacity: 0 }, lids),
        group({ part: 'brows', origin: [fx, by] }, brows),
        ...mouth,
        ...capNode,
      ]),
      ...arms,
    ]),
  ]);
}

/** Prickles standing up straight, polite and a little worried, paws at his sides. */
export const prickles = cached((): string => draw('plain', 'wishing-prickles', 'Prickles the hedgehog postman'));

/** Curled up in a frightened, spiky ball with his cap on top. */
export const pricklesBall = cached((): string => draw('ball', 'wishing-prickles-ball', 'Prickles curled up in a ball'));

/** Happy: a big smile, waving a white letter. */
export const pricklesHappy = cached((): string => draw('happy', 'wishing-prickles-happy', 'Prickles happy, waving a letter'));
