/**
 * Whole-body poses for the cartoon kit (k.pose(el, 'fly')). Each reuses the
 * look of the default portrait and changes only what the pose needs: wings
 * spread, a cloak flung wide.
 */
import { C } from '../../../art/palette';
import { band, circle, curve, dot, ellipse, group, ink, piece, poly, svg } from '../../../art/paper';
import { hedwigBody, hedwigFeet, hedwigHead, speck } from './hedwig';
import { HEAD, person } from './people';

const [cx, cy] = HEAD;
const portrait = (name: string, label: string, nodes: Parameters<typeof svg>[1]) => svg({ w: 300, h: 340, name, label, className: 'portrait' }, nodes);

/** Hedwig in flight: both wings flung up and out, feet tucked. Parts as the perched Hedwig. */
export function hedwigFly(): string {
  const feathers = (side: 1 | -1) => {
    const x = (v: number) => (side === 1 ? v : 300 - v);
    return [
      piece(curve([[x(190), 130], [x(246), 80], [x(298), 56], [x(298), 100], [x(284), 150], [x(250), 196], [x(196), 220]]), C.white),
      // the long feathers at the wing tip
      ...[[x(262), 70, 20], [x(278), 110, 12], [x(270), 152, 4], [x(246), 188, -6]].map(([fx, fy, rot]) =>
        piece(ellipse(fx, fy, 14, 38, side * rot), '#fffdf6', { edge: 'cut', fibre: false }),
      ),
      speck(x(236), 150), speck(x(256), 118), speck(x(222), 184), speck(x(272), 90),
    ];
  };
  return svg({ w: 300, h: 300, name: 'hedwig-fly', label: 'Hedwig the owl flying', className: 'hedwig' }, [
    group({ part: 'wingL', origin: [100, 140] }, feathers(-1)),
    group({ part: 'wingR', origin: [200, 140] }, feathers(1)),
    hedwigFeet(),
    hedwigBody(),
    hedwigHead(),
  ]);
}

/** Fawkes in flight: wings spread wide, tail streaming below. Parts: wingL, wingR, head. */
export function fawkesFly(): string {
  const wing = (side: 1 | -1) => {
    const x = (v: number) => (side === 1 ? v : 300 - v);
    return [
      piece(curve([[x(180), 150], [x(240), 60], [x(296), 30], [x(300), 100], [x(274), 170], [x(230), 214], [x(180), 220]], 2), C.redDark),
      piece(curve([[x(190), 160], [x(244), 96], [x(284), 80], [x(280), 130], [x(250), 182], [x(204), 200]], 2), C.orange, { fibre: false }),
      piece(curve([[x(200), 170], [x(240), 126], [x(268), 120], [x(258), 156], [x(224), 188]], 2), C.gold, { fibre: false, shadow: false }),
    ];
  };
  return portrait('fawkes-fly', 'Fawkes the phoenix flying', [
    ...[[-34, C.gold], [0, C.orange], [34, C.gold]].map(([dx, col]) =>
      piece(curve([[150, 220], [150 + (dx as number) * 0.6, 280], [150 + (dx as number), 336], [160 + (dx as number), 340], [160, 226]], 2), col as string),
    ),
    group({ part: 'wingL', origin: [120, 160] }, wing(-1)),
    group({ part: 'wingR', origin: [180, 160] }, wing(1)),
    piece(curve([[150, 110], [200, 140], [200, 220], [150, 250], [100, 220], [100, 140]]), C.red),
    piece(curve([[150, 160], [180, 180], [176, 230], [150, 240], [124, 230], [120, 180]]), C.orange, { fibre: false }),
    group({ part: 'head', origin: [150, 120] }, [
      ...[[-24, -70], [0, -84], [24, -70]].map(([dx, dy]) => piece(poly([[150 + dx * 0.4, 90], [150 + dx, 90 + dy * 0.6], [158 + dx * 0.4, 92]]), C.gold, { edge: 'cut' })),
      piece(circle(150, 104, 40), C.red),
      piece(circle(134, 98, 9), C.gold, { edge: 'cut', fibre: false }),
      piece(circle(166, 98, 9), C.gold, { edge: 'cut', fibre: false }),
      piece(circle(134, 99, 5), C.ink, { edge: 'clean', shadow: false }),
      piece(circle(166, 99, 5), C.ink, { edge: 'clean', shadow: false }),
      piece(curve([[140, 112], [160, 112], [150, 140]], 1), C.gold, { edge: 'cut' }),
    ]),
  ]);
}

/** Buckbeak in flight: wings up and out. Parts: wingL, wingR, head. */
export function buckbeakFly(): string {
  const feather = '#c9c4b8';
  return portrait('buckbeak-fly', 'Buckbeak the hippogriff flying', [
    group({ part: 'wingL', origin: [100, 220] }, [
      piece(curve([[110, 220], [50, 120], [0, 80], [4, 160], [24, 240], [70, 290], [110, 280]], 2), '#a9a296'),
      piece(curve([[104, 230], [56, 160], [22, 130], [30, 190], [60, 250]], 2), '#bdb7aa', { fibre: false, shadow: false }),
    ]),
    group({ part: 'wingR', origin: [200, 220] }, [
      piece(curve([[190, 220], [250, 120], [300, 80], [296, 160], [276, 240], [230, 290], [190, 280]], 2), '#a9a296'),
      piece(curve([[196, 230], [244, 160], [278, 130], [270, 190], [240, 250]], 2), '#bdb7aa', { fibre: false, shadow: false }),
    ]),
    piece(curve([[70, 345], [80, 250], [150, 210], [220, 250], [230, 345]], 2), '#8a7a6a'),
    group({ part: 'head', origin: [150, 210] }, [
      ...[-1, 1].map((s) => piece(poly([[150 + s * 40, 90], [150 + s * 76, 40], [150 + s * 60, 100]]), feather)),
      piece(curve([[90, 130], [110, 70], [150, 56], [190, 70], [210, 130], [190, 210], [110, 210]]), feather),
      piece(curve([[120, 150], [180, 150], [176, 200], [150, 250], [140, 200]], 2), C.goldLight, { edge: 'cut' }),
      ink([[124, 176], [176, 176]], { width: 3, color: '#b8862f' }),
      piece(circle(118, 124, 14), C.orange, { edge: 'cut' }),
      piece(circle(182, 124, 14), C.orange, { edge: 'cut' }),
      piece(circle(118, 125, 7), C.ink, { edge: 'clean', shadow: false }),
      piece(circle(182, 125, 7), C.ink, { edge: 'clean', shadow: false }),
      dot(114, 120, 3, C.white),
      dot(178, 120, 3, C.white),
      ink([[96, 104], [134, 112]], { width: 5, color: '#8a8478' }),
      ink([[204, 104], [166, 112]], { width: 5, color: '#8a8478' }),
    ]),
  ]);
}

/**
 * Voldemort looming: leaning in, the black cloak flung wide, both long
 * pale hands raised with the fingers curled. He is only looming (no wand
 * is pointed at anyone). Parts: armL, armR, head, lids, mouth, mouthOpen.
 */
export function voldemortLoom(): string {
  const hand = (side: 1 | -1) => {
    const x = (v: number) => (side === 1 ? 150 + v : 150 - v);
    return group({ part: side === 1 ? 'armR' : 'armL', origin: [x(100), 270] }, [
      piece(band([[x(110), 330], [x(124), 270], [x(122), 214]], 40), C.ink),
      piece(ellipse(x(122), 196, 20, 24), '#e6e4dc'),
      // long curled fingers
      ...[-14, -5, 5, 14].map((dx, i) => ink([[x(122 + dx * side), 184], [x(124 + dx * 1.5 * side), 160 - (i % 2) * 8], [x(116 + dx * 1.2 * side), 148 - (i % 2) * 8]], { width: 5, color: '#e6e4dc' })),
    ]);
  };
  return person({
    name: 'voldemort-loom',
    label: 'Lord Voldemort looming',
    skin: '#e6e4dc',
    eyes: C.red,
    eyeStyle: 'narrow',
    face: [56, 74],
    ears: false,
    tilt: 6,
    body: [
      piece(curve([[-10, 345], [10, 240], [90, 208], [150, 204], [210, 208], [290, 240], [310, 345]], 2), C.ink),
      piece(curve([[90, 230], [150, 204], [210, 230], [196, 300], [150, 345], [104, 300]], 2), '#1a1a20', { fibre: false }),
    ],
    nose: 'slits',
    mouth: 'open',
    brows: 'none',
    blush: false,
    front: [ink([[cx - 40, cy - 14], [cx - 14, cy - 6]], { width: 3.5, color: '#b9b6ac' }), ink([[cx + 40, cy - 14], [cx + 14, cy - 6]], { width: 3.5, color: '#b9b6ac' })],
    extra: [hand(-1), hand(1)],
  });
}
