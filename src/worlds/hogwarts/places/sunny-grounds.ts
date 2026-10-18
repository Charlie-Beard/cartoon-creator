/**
 * The school grounds on a bright summer day (for Lupin's outdoor exam).
 *
 * What is drawn, back to front: a blue sky with fluffy white clouds and a
 * pale sun; far green hills; the castle small and far off on its hill at
 * the BACK RIGHT (x 720 to 1010, y 285 to 470); the lake glinting at the
 * BACK LEFT (x 0 to 470, y 440 to 515, with a far shore); rolling grass;
 * a round leafy tree at the left (x 235 to 345, behind the actors, rooted
 * at y 600) and two bigger trees at the right edge (x 1040 to 1180); and,
 * at the LEFT EDGE, a little wooden sign-post with three arrow boards (no
 * words) and a few bunting flags, to say "the course starts here"
 * (post x 40 to 130, y 470 to 668, boards point right).
 *
 * Layout: ground line y 660. Open grass for 3 or 4 actors across x 150 to
 * 1050 (keep heads between y 330 and 400, clear of the castle's roofs
 * which stop at y 285 to 470 only at the far right). The bottom band
 * y 690 to 820 is plain light grass. Daisies are small and sit at y 600 to
 * 685, above the band.
 */
import { C } from '../../../art/palette';
import { circle, curve, dot, ellipse, ink, piece, poly, rect, svg, type Node } from '../../../art/paper';

const SKY = '#9ccbe8';
const SKY_LOW = '#c4e1ef';
const GRASS_FAR = '#86b068';
const GRASS_MID = '#6fa157';
const GRASS = '#7fb25f';
const GRASS_FRONT = '#8fbf6c';

/** A fluffy cloud: a flat-bottomed heap of white puffs. */
function cloud(x: number, y: number, s: number): Node[] {
  return [
    piece(ellipse(x, y + 10 * s, 90 * s, 20 * s), '#e9f3f8', { rough: 1.2, shadow: false, opacity: 0.9 }),
    piece(circle(x - 40 * s, y, 26 * s), C.white, { rough: 1.1, shadow: false }),
    piece(circle(x + 4 * s, y - 14 * s, 34 * s), C.white, { rough: 1.1, shadow: false }),
    piece(circle(x + 48 * s, y - 2 * s, 26 * s), C.white, { rough: 1.1, shadow: false }),
    piece(rect(x - 74 * s, y + 4 * s, 150 * s, 18 * s, 8), C.white, { rough: 1.1, shadow: false }),
  ];
}

/** A round leafy tree: trunk, and a canopy of three overlapping puffs. */
function tree(x: number, base: number, h: number, w: number, dark: string, light: string): Node[] {
  return [
    piece(poly([[x - w * 0.07, base], [x - w * 0.05, base - h * 0.5], [x + w * 0.05, base - h * 0.5], [x + w * 0.08, base]]), C.bark, { rough: 0.8, shadow: false }),
    piece(ellipse(x, base - h * 0.62, w * 0.5, h * 0.34), dark, { rough: 1.2 }),
    piece(ellipse(x - w * 0.22, base - h * 0.52, w * 0.3, h * 0.24), light, { rough: 1.2, shadow: false }),
    piece(ellipse(x + w * 0.2, base - h * 0.74, w * 0.3, h * 0.22), light, { rough: 1.2, shadow: false }),
    piece(ellipse(x + w * 0.02, base - h * 0.86, w * 0.22, h * 0.14), '#a4cc82', { rough: 1.2, shadow: false, opacity: 0.85 }),
  ];
}

/** A little daisy: white petals around a yellow eye, on a short stem. */
function daisy(x: number, y: number, s = 1): Node[] {
  const petals: Node[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    petals.push(piece(ellipse(x + Math.cos(a) * 5 * s, y - 8 * s + Math.sin(a) * 5 * s, 3.6 * s, 2.2 * s, a), C.white, { edge: 'cut', fibre: false, shadow: false }));
  }
  return [ink([[x, y], [x + 1, y - 8 * s]], { width: 2, color: C.greenDark }), ...petals, dot(x, y - 8 * s, 2.8 * s, C.yellow)];
}

/** A bright summer afternoon on the school grounds. */
export function sunnyGrounds(): string {
  const tuft = (x: number, y: number, col = '#4f8a46') => ink([[x - 8, y], [x - 4, y - 13], [x, y], [x + 4, y - 15], [x + 8, y]], { width: 3, color: col });
  const tower = (x: number, top: number, w: number): Node[] => [
    piece(rect(x, top, w, 470 - top), '#b8b3b8', { rough: 0.5, shadow: false }),
    piece(poly([[x - 5, top + 3], [x + w / 2, top - w * 1.25], [x + w + 5, top + 3]]), '#6d7ba3', { rough: 0.5, shadow: false }),
  ];
  const win = (x: number, y: number) => piece(rect(x, y, 6, 10, 3), '#6f86a8', { edge: 'cut', fibre: false, shadow: false });
  const glint = (x: number, y: number, w: number) => ink([[x, y], [x + w, y]], { width: 3, color: '#e8f6fb', opacity: 0.85 });
  const bunting = (x0: number, y0: number, x1: number, y1: number, n: number): Node[] => {
    const cols = [C.red, C.yellow, C.blue, C.green, C.pink];
    const out: Node[] = [];
    const sag = (t: number) => Math.sin(t * Math.PI) * 14;
    out.push(ink([[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2 + 14], [x1, y1]], { width: 2, color: C.brownDark }));
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n;
      const px = x0 + (x1 - x0) * t;
      const py = y0 + (y1 - y0) * t + sag(t);
      out.push(piece(poly([[px - 9, py], [px + 9, py], [px, py + 19]]), cols[i % cols.length], { edge: 'cut', fibre: false, shadow: false }));
    }
    return out;
  };
  const arrow = (x: number, y: number, w: number, col: string): Node => piece(poly([[x, y], [x + w, y], [x + w + 22, y + 13], [x + w, y + 26], [x, y + 26]]), col, { edge: 'cut', fibre: false });
  const arrowFlip = (x: number, y: number, w: number, col: string): Node => piece(poly([[x + 22, y], [x + 22 + w, y], [x + 22 + w, y + 26], [x + 22, y + 26], [x, y + 13]]), col, { edge: 'cut', fibre: false });

  const daisies: Node[] = [];
  [[330, 640], [470, 668], [560, 622], [640, 676], [760, 636], [880, 664], [980, 628], [1060, 672], [200, 668], [410, 612]].forEach(([x, y], i) => {
    daisies.push(...daisy(x, y, 0.9 + (i % 3) * 0.12));
  });

  return svg({ w: 1180, h: 820, name: 'hogwarts-sunny-grounds', boil: false, className: 'backdrop' }, [
    piece(rect(-20, -20, 1220, 860), SKY, { edge: 'clean', shadow: false }),
    piece(rect(-20, 250, 1220, 300), SKY_LOW, { edge: 'clean', shadow: false, opacity: 0.5 }),
    piece(rect(-20, 380, 1220, 200), '#d7ecf0', { edge: 'clean', shadow: false, opacity: 0.45 }),
    // the sun: a pale disc with a soft halo, high at the top left
    piece(circle(140, 110, 70), '#fff1b8', { edge: 'clean', shadow: false, opacity: 0.35 }),
    piece(circle(140, 110, 44), '#fde58b', { rough: 0.6, shadow: false }),
    ...cloud(420, 120, 1.2),
    ...cloud(820, 80, 0.9),
    ...cloud(1010, 200, 0.7),
    ...cloud(250, 270, 0.6),
    // far hills
    piece(curve([[-40, 560], [-40, 440], [250, 410], [560, 440], [820, 400], [1220, 430], [1220, 560]], 2), '#9bc08a', { rough: 1.4, shadow: false }),
    // the lake, back left: blue water with a darker far shore and glints
    piece(curve([[-40, 500], [-40, 420], [160, 408], [360, 416], [490, 440], [480, 500]], 2), '#a7c487', { rough: 1.2, shadow: false }),
    piece(curve([[-40, 506], [-40, 432], [150, 422], [340, 430], [480, 456], [450, 506]], 2), '#5f98c4', { rough: 1.1, shadow: false }),
    piece(curve([[-40, 506], [-40, 462], [200, 456], [420, 470], [440, 506]], 2), '#7fb2d6', { rough: 1.1, shadow: false, opacity: 0.8 }),
    glint(40, 444, 50), glint(150, 454, 36), glint(250, 442, 56), glint(330, 466, 40), glint(90, 478, 44), glint(200, 486, 30),
    // the castle on its hill, small and far, back right
    piece(curve([[640, 480], [760, 440], [860, 428], [960, 436], [1100, 480]], 2), '#8fb87a', { rough: 1.2, shadow: false }),
    ...tower(740, 350, 28),
    ...tower(786, 300, 38),
    ...tower(842, 285, 30),
    ...tower(890, 330, 34),
    ...tower(936, 370, 26),
    piece(rect(730, 400, 240, 70), '#b0abb2', { rough: 0.5, shadow: false }),
    piece(poly([[726, 402], [850, 384], [974, 402], [970, 408], [850, 392], [730, 410]]), '#8e8a96', { rough: 0.5, shadow: false }),
    win(752, 366), win(798, 324), win(852, 308), win(902, 350), win(944, 388),
    win(750, 424), win(790, 436), win(836, 420), win(884, 436), win(930, 422),
    // rolling grass: far, mid, near
    piece(curve([[-40, 640], [-40, 526], [240, 500], [520, 522], [820, 498], [1220, 520], [1220, 640]], 2), GRASS_FAR, { rough: 1.4, shadow: false }),
    piece(curve([[-40, 700], [-40, 584], [300, 560], [640, 586], [940, 556], [1220, 574], [1220, 700]], 2), GRASS_MID, { rough: 1.5, shadow: false }),
    // trees: a small round one left of centre, tall ones at the right edge
    ...tree(290, 604, 220, 180, '#4f8a46', '#6aa356'),
    ...tree(1110, 640, 400, 300, '#44793f', '#5f9a50'),
    ...tree(1010, 590, 220, 170, '#4f8a46', '#6aa356'),
    // the near lawn, running off the bottom
    piece(curve([[-40, 860], [-40, 640], [260, 622], [600, 646], [900, 626], [1220, 640], [1220, 860]], 2), GRASS, { rough: 1.5, shadow: false }),
    piece(curve([[-40, 860], [-40, 706], [400, 694], [820, 710], [1220, 694], [1220, 860]], 2), GRASS_FRONT, { rough: 1.6, shadow: false }),
    // the worn path of the course start: a pale earthy patch under the sign
    piece(ellipse(110, 674, 130, 16), '#cdb98a', { rough: 1.2, shadow: false, opacity: 0.8 }),
    ...[[240, 650], [520, 640], [700, 658], [850, 640], [1000, 656], [60, 680], [610, 612], [420, 628]].map(([x, y]) => tuft(x, y)),
    ...daisies,
    // the sign-post at the left edge: a post, three arrow boards pointing right, bunting
    piece(rect(78, 470, 14, 200, 2), C.brown, { rough: 0.7 }),
    piece(poly([[74, 470], [96, 470], [90, 458], [80, 458]]), C.brownDark, { edge: 'cut', fibre: false, shadow: false }),
    arrow(46, 484, 66, C.wood),
    arrow(64, 520, 54, '#c9a35c'),
    arrowFlip(40, 556, 52, C.wood),
    ...bunting(28, 458, 150, 470, 6),
    piece(rect(66, 662, 38, 10, 4), '#6a8f4f', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
  ]);
}
