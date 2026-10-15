/** From Wizard Words, b3c1 (commonRoom). */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, ink, piece, rect, svg, type Node, type Pt } from '../../../art/paper';

const WALL = '#7a3a31';

function archOutline(x: number, y: number, w: number, h: number): Pt[] {
  const r = w / 2;
  const pts: Pt[] = [[x, y + h]];
  for (let i = 0; i <= 12; i++) {
    const a = Math.PI + (i / 12) * Math.PI;
    pts.push([x + r + Math.cos(a) * r, y + r + Math.sin(a) * r]);
  }
  pts.push([x + w, y + h]);
  return pts;
}

/** A tall arched window onto the starry night. */
function windowArt(x: number, y: number, w: number, h: number): Node[] {
  const gx = x + 14;
  const gw = w - 28;
  return [
    piece(archOutline(x - 12, y - 12, w + 24, h + 24), '#5e554c', { rough: 0.8 }),
    piece(archOutline(x, y, w, h), C.brownDark, { edge: 'cut' }),
    piece(archOutline(gx, y + 14, gw, h - 26), C.night, { edge: 'cut', fibre: false }),
    piece(circle(x + w * 0.66, y + h * 0.3, 22), C.cream, { edge: 'cut', fibre: false }),
    piece(circle(x + w * 0.6, y + h * 0.27, 20), C.night, { edge: 'clean', shadow: false }),
    dot(x + w * 0.3, y + h * 0.28, 3, C.goldLight),
    dot(x + w * 0.45, y + h * 0.5, 2.5, C.goldLight),
    dot(x + w * 0.24, y + h * 0.62, 2.5, C.goldLight),
    dot(x + w * 0.72, y + h * 0.66, 3, C.goldLight),
    // far-off hills and the lake
    piece(curve([[gx, y + h - 70], [x + w * 0.4, y + h - 96], [x + w * 0.8, y + h - 80], [gx + gw, y + h - 92], [gx + gw, y + h - 12], [gx, y + h - 12]], 2), C.greenDeep, { fibre: false, shadow: false }),
    ink([[x + w / 2, y + 16], [x + w / 2, y + h - 12]], { width: 6, color: C.brownDark, wobble: 0.3 }),
    ink([[gx, y + h * 0.56], [gx + gw, y + h * 0.56]], { width: 6, color: C.brownDark, wobble: 0.3 }),
    piece(rect(x - 20, y + h - 4, w + 40, 18, 3), C.stoneLight, { rough: 0.8 }),
  ];
}

/** A little painting in a gold frame (Hogwarts paintings!). */
function painting(x: number, y: number, w: number, h: number): Node[] {
  return [
    piece(rect(x, y, w, h, 4), C.gold),
    piece(rect(x + 14, y + 14, w - 28, h - 28, 2), C.sky, { edge: 'cut', fibre: false }),
    piece(curve([[x + 14, y + h - 60], [x + w * 0.35, y + h - 90], [x + w * 0.7, y + h - 70], [x + w - 14, y + h - 84], [x + w - 14, y + h - 14], [x + 14, y + h - 14]], 2), C.green, { fibre: false, shadow: false }),
    piece(ellipse(x + w * 0.62, y + h * 0.42, 34, 13), C.white, { fibre: false, shadow: false, opacity: 0.9 }),
    piece(circle(x + w * 0.28, y + h * 0.3, 16), C.goldLight, { edge: 'cut', fibre: false }),
  ];
}

const CHAIR = '#94382f';

const CHAIR_LIGHT = '#ad4a3b';

/** The Gryffindor common room at night, 1180 × 820. */
export function commonRoom(): string {
  const stripes: Node[] = [];
  for (let x = 10; x < 1180; x += 74) stripes.push(piece(rect(x, -10, 30, 490), '#6c3029', { edge: 'cut', fibre: false, shadow: false, opacity: 0.5 }));
  const panels: Node[] = [];
  for (let x = 10; x < 1180; x += 132) panels.push(piece(rect(x, 492, 112, 98, 4), '#6b4431', { edge: 'cut', fibre: false }));
  const stones: Node[] = [];
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      const sx = 472 + col * 74 + (row % 2) * 30;
      const sy = 272 + row * 56;
      if (sx > 530 && sx < 690 && sy > 340) continue;
      stones.push(piece(rect(sx, sy, 66, 48, 6), row % 2 ? '#978d81' : '#83796e', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }));
    }
  }
  const planks: Node[] = [];
  for (const [y, off] of [[650, 0], [705, 110], [770, 50]] as const) {
    planks.push(ink([[-10, y], [1190, y + 4]], { width: 2.5, color: C.brownDark, opacity: 0.4 }));
    for (let x = 140 + off; x < 1180; x += 280) planks.push(ink([[x, y - 46], [x, y]], { width: 2, color: C.brownDark, opacity: 0.3 }));
  }
  const buttons: Node[] = [];
  for (const [bx, by] of [[930, 360], [1000, 345], [1070, 360], [965, 420], [1035, 420]] as const) buttons.push(dot(bx, by, 5, '#6a2620'));
  const candle = (x: number): Node[] => [
    piece(rect(x - 14, 222, 28, 16, 3), C.gold, { edge: 'cut', fibre: false }),
    piece(rect(x - 8, 172, 16, 52, 3), C.cream, { edge: 'cut' }),
    piece(ellipse(x, 160, 7, 13), C.candle, { edge: 'cut', fibre: false }),
    piece(ellipse(x, 164, 3, 6), C.white, { edge: 'clean', shadow: false }),
  ];
  return svg({ w: 1180, h: 820, name: 'b3c1-common-room', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 660), WALL, { edge: 'clean', shadow: false }),
    ...stripes,
    // warm firelight on the wall
    piece(ellipse(620, 400, 470, 320), C.candle, { edge: 'cut', fibre: false, shadow: false, opacity: 0.13 }),
    piece(ellipse(620, 470, 260, 190), C.orange, { edge: 'cut', fibre: false, shadow: false, opacity: 0.1 }),
    ...windowArt(80, 90, 170, 290),
    ...painting(905, 70, 190, 150),
    // wooden panelling along the bottom of the wall
    piece(rect(-20, 474, 1220, 140), C.brownDark, { rough: 1 }),
    ...panels,
    piece(rect(-20, 466, 1220, 16, 3), C.wood),
    // the fireplace
    piece(rect(462, 250, 316, 360, 6), '#8f857a'),
    ...stones,
    piece(archOutline(532, 350, 176, 258), '#2a1812', { edge: 'cut' }),
    piece(ellipse(620, 560, 80, 46), C.orange, { edge: 'cut', fibre: false, shadow: false, opacity: 0.35 }),
    piece(rect(436, 234, 368, 26, 4), C.brownDark),
    piece(rect(450, 256, 340, 10, 2), '#4a2e20', { edge: 'cut', fibre: false }),
    ...candle(470),
    ...candle(770),
    // the floor
    piece(rect(-20, 612, 1220, 230), '#8d613f', { rough: 1.4 }),
    ...planks,
    piece(rect(-20, 606, 1220, 16, 3), C.brownDark, { rough: 1.2 }),
    piece(rect(448, 598, 344, 30, 4), C.stoneLight),
    // a big round rug
    piece(ellipse(520, 700, 420, 62), '#8a3a32', { rough: 1.3 }),
    piece(ellipse(520, 700, 372, 46), C.gold, { edge: 'cut', fibre: false, opacity: 0.55 }),
    piece(ellipse(520, 700, 356, 40), '#8a3a32', { edge: 'cut', fibre: false, shadow: false }),
    // the back of the big squashy armchair
    piece(curve([[846, 610], [842, 360], [880, 298], [1000, 280], [1120, 298], [1158, 360], [1154, 610]], 2), CHAIR, { rough: 1.1 }),
    piece(curve([[876, 600], [874, 380], [900, 322], [1000, 308], [1100, 322], [1126, 380], [1124, 600]], 2), CHAIR_LIGHT, { edge: 'cut', fibre: false }),
    ...buttons,
  ]);
}
