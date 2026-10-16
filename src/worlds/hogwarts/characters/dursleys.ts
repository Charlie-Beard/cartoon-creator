/**
 * The Dursleys, for "Mr Dursley's Strange Day": Vernon, Petunia and baby Dudley.
 * Built on person() from people.ts so they sit like everyone else, with their
 * own mouths (hidden under a moustache, or pursed, or in a high chair) added
 * by hand so k.talk() still has `mouth` / `mouthOpen` to flap.
 */
import { C } from '../../../art/palette';
import { band, circle, curve, dot, ellipse, group, ink, piece, poly, rect, type Node } from '../../../art/paper';
import { fluff } from './heroes';
import { HEAD, person } from './people';

const [cx, cy] = HEAD;

/** A shut mouth and its open twin in the same place, drawn over whatever is in front. */
function talkingMouth(shut: Node[], open: Node[]): Node[] {
  return [group({ part: 'mouth' }, shut), group({ part: 'mouthOpen', opacity: 0 }, open)];
}

// ---------------------------------------------------------------------------
// Mr Dursley: big, beefy, hardly any neck, a great bushy moustache
// ---------------------------------------------------------------------------

export function vernon(): string {
  const skin = '#ebae9e';
  const hair = '#6a4a30';
  const tache = '#7a5232';
  const tacheDark = '#5e3e26';
  const [rx, ry] = [78, 66];
  return person({
    name: 'vernon',
    label: 'Mr Dursley',
    skin,
    eyes: '#4a4036',
    eyeStyle: 'narrow',
    face: [rx, ry],
    blush: false,
    ears: true,
    back: [
      // thinning hair: a thin dark rim at the sides only
      piece(ellipse(cx, cy - 20, 70, 44), hair),
    ],
    body: [
      // wide grey suit, shoulders right up to the jaw
      piece(curve([[0, 345], [8, 250], [70, 212], [150, 206], [230, 212], [292, 250], [300, 345]], 2), '#8a8c92'),
      // white shirt front and a dull tie
      piece(poly([[112, 214], [150, 262], [188, 214], [176, 206], [150, 228], [124, 206]]), C.white, { fibre: false }),
      piece(poly([[142, 226], [158, 226], [164, 320], [150, 338], [136, 320]]), '#6a6a52', { edge: 'cut', fibre: false }),
      ...[262, 288, 314].map((y) => piece(poly([[138, y], [162, y - 8], [163, y - 2], [139, y + 6]]), '#55553f', { edge: 'clean', shadow: false })),
      // lapels
      piece(poly([[90, 236], [124, 214], [138, 290], [104, 330]]), '#7a7c82', { fibre: false }),
      piece(poly([[210, 236], [176, 214], [162, 290], [196, 330]]), '#7a7c82', { fibre: false }),
    ],
    brows: 'cross',
    browColor: hair,
    nose: 'big',
    mouth: 'none',
    front: [
      // combed-flat hair across a high forehead, a few lines for the comb
      piece(curve([[cx - 66, cy - 18], [cx - 54, cy - 52], [cx, cy - 62], [cx + 54, cy - 52], [cx + 66, cy - 18], [cx + 40, cy - 42], [cx, cy - 44], [cx - 40, cy - 42]], 2), hair),
      ink([[cx - 40, cy - 56], [cx + 10, cy - 64]], { width: 2, color: tacheDark, opacity: 0.6 }),
      ink([[cx - 24, cy - 50], [cx + 34, cy - 56]], { width: 2, color: tacheDark, opacity: 0.6 }),
      // jowls under the moustache
      piece(ellipse(cx - 34, cy + 56, 30, 14), skin, { edge: 'cut', fibre: false, shadow: false }),
      piece(ellipse(cx + 34, cy + 56, 30, 14), skin, { edge: 'cut', fibre: false, shadow: false }),
      // the mouth, tucked under the moustache (the open one drops below it)
      ...talkingMouth(
        [ink([[cx - 14, cy + 54], [cx, cy + 58], [cx + 14, cy + 54]], { width: 3.5, color: C.redDark })],
        [
          piece(ellipse(cx, cy + 60, 20, 12), C.redDark, { edge: 'cut', fibre: false, shadow: false }),
          piece(ellipse(cx, cy + 66, 11, 4), C.rose, { edge: 'clean', fibre: false, shadow: false }),
          piece(rect(cx - 14, cy + 50, 28, 5, 1), C.white, { edge: 'clean', shadow: false }),
        ],
      ),
      // the great bushy moustache, two thick wings with a bristly edge
      fluff([[cx - 2, cy + 30], [cx - 34, cy + 24], [cx - 74, cy + 34], [cx - 84, cy + 52], [cx - 56, cy + 54], [cx - 24, cy + 46], [cx - 2, cy + 46]], tache, 8),
      fluff([[cx + 2, cy + 30], [cx + 34, cy + 24], [cx + 74, cy + 34], [cx + 84, cy + 52], [cx + 56, cy + 54], [cx + 24, cy + 46], [cx + 2, cy + 46]], tache, 8),
      ink([[cx - 70, cy + 38], [cx - 36, cy + 34], [cx - 6, cy + 38]], { width: 2.5, color: tacheDark, opacity: 0.7 }),
      ink([[cx + 70, cy + 38], [cx + 36, cy + 34], [cx + 6, cy + 38]], { width: 2.5, color: tacheDark, opacity: 0.7 }),
      // "his face went purple": a flush that a script fades in
      group({ part: 'cross', opacity: 0 }, [
        piece(ellipse(cx, cy + 2, rx - 4, ry - 4), '#a0306a', { edge: 'cut', fibre: false, shadow: false, opacity: 0.5 }),
        piece(ellipse(cx - 44, cy + 24, 24, 16), '#7a1e5a', { edge: 'cut', fibre: false, shadow: false, opacity: 0.45 }),
        piece(ellipse(cx + 44, cy + 24, 24, 16), '#7a1e5a', { edge: 'cut', fibre: false, shadow: false, opacity: 0.45 }),
        piece(ellipse(cx, cy - 36, 40, 14), '#7a1e5a', { edge: 'cut', fibre: false, shadow: false, opacity: 0.35 }),
      ]),
    ],
    extra: [
      // shirt collar points over the hardly-there neck
      piece(poly([[112, 206], [150, 214], [140, 238], [106, 222]]), C.white, { edge: 'cut', fibre: false }),
      piece(poly([[188, 206], [150, 214], [160, 238], [194, 222]]), C.white, { edge: 'cut', fibre: false }),
      piece(poly([[142, 218], [158, 218], [156, 236], [144, 236]]), '#6a6a52', { edge: 'cut', fibre: false }),
    ],
  });
}

// ---------------------------------------------------------------------------
// Mrs Dursley: thin, a very long neck, a narrow face, neat blonde curls
// ---------------------------------------------------------------------------

export function petunia(): string {
  const skin = '#efd0b4';
  const hair = '#dcc27a';
  const hairDark = '#b89a52';
  const curl = (x: number, y: number, r = 15) => piece(circle(x, y, r), hair, { edge: 'cut' });
  return person({
    name: 'petunia',
    label: 'Mrs Dursley',
    skin,
    eyes: '#6f8fae',
    face: [48, 70],
    blush: false,
    ears: false,
    back: [
      piece(ellipse(cx, cy - 22, 62, 58), hair),
      // neat curls round the sides and top
      curl(cx - 62, cy - 30), curl(cx - 66, cy + 2, 14), curl(cx - 58, cy + 32, 12),
      curl(cx + 62, cy - 30), curl(cx + 66, cy + 2, 14), curl(cx + 58, cy + 32, 12),
      curl(cx - 34, cy - 74, 14), curl(cx, cy - 82, 15), curl(cx + 34, cy - 74, 14),
    ],
    body: [
      // pastel pink cardigan on narrow, low shoulders
      piece(curve([[56, 345], [66, 296], [108, 272], [150, 268], [192, 272], [234, 296], [244, 345]], 2), '#e8b4bc'),
      // the very long neck
      piece(rect(cx - 17, cy + 50, 34, 130, 10), skin, { fibre: false }),
      ink([[cx - 17, cy + 60], [cx - 17, cy + 170]], { width: 2, color: '#d2b090', opacity: 0.5 }),
      // blouse and cardigan edges
      piece(poly([[124, 282], [150, 300], [176, 282], [168, 270], [150, 284], [132, 270]]), C.white, { fibre: false }),
      piece(poly([[132, 272], [146, 290], [140, 345], [108, 345], [108, 290]]), '#d89ea8', { fibre: false }),
      piece(poly([[168, 272], [154, 290], [160, 345], [192, 345], [192, 290]]), '#d89ea8', { fibre: false }),
      ...[300, 322].map((y) => piece(circle(150, y, 4.5), C.white, { edge: 'cut', fibre: false })),
    ],
    front: [
      // neat fringe curls
      piece(curve([[cx - 46, cy - 8], [cx - 42, cy - 56], [cx, cy - 72], [cx + 42, cy - 56], [cx + 46, cy - 8], [cx + 24, cy - 40], [cx - 24, cy - 40]], 2), hair),
      ink([[cx - 20, cy - 62], [cx - 6, cy - 50]], { width: 2.5, color: hairDark }),
      ink([[cx + 14, cy - 62], [cx + 24, cy - 48]], { width: 2.5, color: hairDark }),
      // pursed lips (the shut ones are small and tight, the open ones an 'o')
      ...talkingMouth(
        [
          piece(ellipse(cx, cy + 50, 11, 5.5), C.rose, { edge: 'clean', fibre: false, shadow: false }),
          ink([[cx - 9, cy + 50], [cx + 9, cy + 50]], { width: 2, color: C.redDark }),
        ],
        [
          piece(ellipse(cx, cy + 52, 11, 9), C.redDark, { edge: 'cut', fibre: false, shadow: false }),
          piece(ellipse(cx, cy + 56, 6, 3), C.rose, { edge: 'clean', fibre: false, shadow: false }),
        ],
      ),
    ],
    brows: 'raised',
    browColor: hairDark,
    nose: 'long',
    mouth: 'none',
    extra: [
      // a little pearl necklace at the base of the neck
      ...Array.from({ length: 9 }, (_, i) => {
        const t = i / 8;
        const x = 128 + t * 44;
        const y = 266 + Math.sin(t * Math.PI) * 14;
        return dot(x, y, 4.2, C.white);
      }),
    ],
  });
}

// ---------------------------------------------------------------------------
// Baby Dudley: round and pink in a high chair, a spoon in his fist
// ---------------------------------------------------------------------------

export function dudley(): string {
  const skin = '#f2b8a6';
  const hair = '#e6cd78';
  const wood = '#b07a4a';
  const woodDark = '#8a5a34';
  const [shx, shy] = [208, 262];
  const porridge = (x: number, y: number, r: number) => piece(circle(x, y, r), '#efe2c0', { edge: 'cut', fibre: false, shadow: false });
  return person({
    name: 'dudley',
    label: 'Dudley',
    skin,
    eyes: C.blue,
    eyeStyle: 'big',
    face: [76, 68],
    ears: true,
    blush: true,
    back: [
      // the high chair's back posts
      piece(rect(36, 150, 20, 190, 4), woodDark, { edge: 'cut', fibre: false }),
      piece(rect(244, 150, 20, 190, 4), woodDark, { edge: 'cut', fibre: false }),
      piece(rect(36, 150, 228, 14, 4), wood, { edge: 'cut', fibre: false }),
    ],
    body: [
      // chubby little body in a yellow top
      piece(curve([[66, 345], [72, 270], [108, 226], [150, 220], [192, 226], [228, 270], [234, 345]], 2), '#f0d27a'),
      // a bib with a stain of porridge
      piece(curve([[112, 226], [150, 244], [188, 226], [194, 290], [150, 312], [106, 290]], 2), C.white, { fibre: false }),
      piece(ellipse(150, 276, 20, 14), '#7ab0d8', { edge: 'cut', fibre: false, shadow: false }),
      porridge(128, 262, 5), porridge(172, 296, 6), porridge(140, 300, 3.5),
    ],
    brows: 'raised',
    browColor: '#d2b658',
    nose: 'button',
    mouth: 'smile',
    front: [
      // one baby tuft
      piece(curve([[cx - 8, cy - 62], [cx - 16, cy - 92], [cx + 2, cy - 98], [cx + 20, cy - 90], [cx + 10, cy - 76], [cx + 10, cy - 62]], 2), hair),
      piece(curve([[cx - 30, cy - 62], [cx - 36, cy - 78], [cx - 22, cy - 82], [cx - 14, cy - 64]], 2), hair),
      // a spot of porridge on a cheek
      porridge(cx + 46, cy + 38, 5),
    ],
    extra: [
      // left hand resting on the tray
      piece(band([[84, 262], [74, 300]], 26), skin),
      piece(circle(72, 302, 17), skin),
      // the wooden tray across the bottom
      piece(rect(10, 300, 280, 40, 6), wood, { edge: 'cut', fibre: false }),
      piece(rect(10, 300, 280, 8, 4), '#c8935e', { edge: 'cut', fibre: false, shadow: false }),
      ink([[30, 322], [270, 322]], { width: 2, color: woodDark, opacity: 0.5 }),
      // a chubby arm holding a spoon, swung from the shoulder
      group({ part: 'armR', origin: [shx, shy] }, [
        piece(band([[shx, shy], [236, 292]], 30), skin),
        piece(circle(240, 296, 18), skin),
        ...[[-5, -4], [0, -6], [5, -4]].map(([dx, dy]) => ink([[240 + dx, 292 + dy], [240 + dx, 286 + dy]], { width: 1.6, color: '#d49a86' })),
        // the spoon, up in his fist, with a dollop of porridge
        piece(band([[242, 296], [258, 240]], 7), '#b8b4aa', { edge: 'cut' }),
        piece(ellipse(262, 230, 14, 10, -16), '#c8c4ba', { edge: 'cut' }),
        porridge(262, 226, 9),
      ]),
    ],
  });
}
