/**
 * Two big vehicles, both side-on and facing LEFT (they arrive from the right).
 *
 * The Knight Bus, 460 × 560: a violently purple triple-decker, tall and
 * narrow, three rows of lit yellow windows, big round headlamps at the
 * front (left), black wheels. Wheel bottoms are at y 556 (the road).
 *
 * Mr Weasley's flying car, 440 × 220: an old rounded turquoise family
 * saloon (no brand, no logo) with pale glass, headlamps on at the front
 * (left). Wheel bottoms at y 214. Ron peeps out of the back window and
 * Fred out of the front one when those parts are faded in.
 */
import { circle, curve, dot, ellipse, group, ink, piece, poly, rect, svg } from '../../../art/paper';

const BLACK = '#25252c';
const BLACK_LIGHT = '#3a3a45';
const HUB = '#cfd4de';
const HUB_DARK = '#8d94a4';
const GOLD = '#e8b73a';
const GLOW = '#fff3b0';

function wheel(cx: number, cy: number, r: number, part: string) {
  return group({ part, origin: [cx, cy] }, [
    piece(circle(cx, cy, r), BLACK, { edge: 'cut' }),
    piece(circle(cx, cy, r * 0.72), BLACK_LIGHT, { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(cx, cy, r * 0.52), HUB_DARK, { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(cx, cy, r * 0.38), HUB, { edge: 'cut', fibre: false, shadow: false }),
    ...[0, 60, 120].map((a) => {
      const t = (a * Math.PI) / 180;
      const k = r * 0.5;
      return ink([[cx - Math.cos(t) * k, cy - Math.sin(t) * k], [cx + Math.cos(t) * k, cy + Math.sin(t) * k]], { width: 3, color: HUB_DARK });
    }),
    piece(circle(cx, cy, r * 0.12), BLACK, { edge: 'cut', fibre: false, shadow: false }),
  ]);
}

export function knightBusArt(): string {
  const PURPLE = '#7a2bb8';
  const PURPLE_DARK = '#5a1d8c';
  const PURPLE_LIGHT = '#9a49d6';
  const win = (x: number, y: number) => [
    piece(rect(x, y, 56, 62, 8), '#5a1d8c', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(x + 5, y + 5, 46, 52, 6), '#ffd95a', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(x + 9, y + 9, 16, 20, 4), '#fff1a8', { edge: 'clean', fibre: false, shadow: false, opacity: 0.8 }),
  ];
  const rows = [70, 178, 286];
  const xs = [78, 148, 218, 288, 358];
  return svg({ w: 460, h: 560, name: 'hogwarts-knightBus', label: 'The Knight Bus' }, [
    // body, a little narrower at the top deck
    piece(rect(40, 40, 400, 480, 22), PURPLE, { edge: 'cut' }),
    piece(rect(56, 22, 368, 60, 24), PURPLE_LIGHT, { edge: 'cut' }),
    piece(rect(40, 380, 400, 140, 18), PURPLE_DARK, { edge: 'cut', fibre: false }),
    // gold trim between decks
    ...[158, 266, 374].map((y) => piece(rect(40, y, 400, 9, 3), GOLD, { edge: 'cut', fibre: false, shadow: false })),
    piece(rect(56, 28, 368, 8, 4), GOLD, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(40, 500, 400, 12, 4), GOLD, { edge: 'cut', fibre: false, shadow: false }),
    // windows, three decks
    ...rows.flatMap((y) => xs.flatMap((x) => win(x, y))),
    // front windscreen and door on the bottom deck
    piece(rect(54, 402, 78, 62, 8), '#5a1d8c', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(59, 407, 68, 52, 6), '#ffd95a', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(190, 396, 80, 104, 8), PURPLE, { edge: 'cut', fibre: false }),
    piece(rect(198, 404, 64, 50, 6), '#ffd95a', { edge: 'cut', fibre: false, shadow: false }),
    ink([[230, 404], [230, 498]], { width: 3, color: PURPLE_DARK }),
    // gold curls on the back
    ink([[390, 410], [410, 430], [390, 450], [410, 470]], { width: 5, color: GOLD }),
    // bumpers
    piece(rect(22, 480, 36, 22, 8), HUB, { edge: 'cut', fibre: false }),
    piece(rect(424, 480, 30, 22, 8), HUB, { edge: 'cut', fibre: false }),
    // headlamps (the lit lens), then the fading glow
    piece(circle(46, 436, 30), HUB, { edge: 'cut' }),
    piece(circle(46, 436, 22), GLOW, { edge: 'cut', fibre: false, shadow: false }),
    dot(40, 430, 6, '#ffffff', 0.9),
    group({ part: 'lamps', origin: [30, 436], opacity: 0 }, [
      piece(ellipse(8, 436, 8, 70, 0), 'rgba(255,240,170,0.22)', { edge: 'clean', fibre: false, shadow: false }),
      piece(circle(30, 436, 48), 'rgba(255,240,170,0.28)', { edge: 'clean', fibre: false, shadow: false }),
      piece(circle(34, 436, 28), 'rgba(255,248,200,0.55)', { edge: 'clean', fibre: false, shadow: false }),
    ]),
    // wheels
    wheel(120, 512, 44, 'wheels'),
    wheel(370, 512, 44, 'wheels'),
  ]);
}

export function flyingCarArt(): string {
  const TURQ = '#2fb3b8';
  const TURQ_DARK = '#1e8a92';
  const TURQ_LIGHT = '#5fd0d2';
  const GLASS = '#c8e8f7';
  const head = (cx: number, cy: number, name: string, hair: string) =>
    group({ part: name, origin: [cx, cy + 20], opacity: 0 }, [
      piece(circle(cx, cy, 20), '#f3c9a0', { edge: 'cut', fibre: false, shadow: false }),
      piece(poly([[cx - 21, cy - 4], [cx - 14, cy - 22], [cx + 4, cy - 26], [cx + 21, cy - 10], [cx + 12, cy - 12], [cx - 6, cy - 14]]), hair, { edge: 'cut', fibre: false, shadow: false }),
      dot(cx - 8, cy + 1, 3, '#2b2b33'), dot(cx + 6, cy + 1, 3, '#2b2b33'),
      ink([[cx - 8, cy + 11], [cx - 1, cy + 14], [cx + 7, cy + 11]], { width: 2.5, color: '#9a4a3a' }),
    ]);
  return svg({ w: 440, h: 220, name: 'hogwarts-flyingCar', label: "Mr Weasley's flying car" }, [
    // body: long lower box and a rounded cabin, nose at the left
    piece(curve([[24, 168], [14, 130], [40, 112], [120, 104], [330, 104], [410, 116], [426, 146], [418, 170]], 2), TURQ, { edge: 'cut' }),
    piece(curve([[110, 108], [140, 52], [200, 38], [290, 40], [336, 62], [366, 108]], 2), TURQ, { edge: 'cut' }),
    piece(rect(22, 150, 400, 22, 8), TURQ_DARK, { edge: 'cut', fibre: false }),
    piece(curve([[150, 116], [250, 112], [350, 118]], 2), TURQ_LIGHT, { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    // glass: front (left) window and back (right) window, door between
    piece(curve([[130, 104], [154, 62], [196, 52], [204, 104]], 2), GLASS, { edge: 'cut', fibre: false, shadow: false }),
    piece(curve([[216, 104], [214, 52], [276, 52], [320, 104]], 2), GLASS, { edge: 'cut', fibre: false, shadow: false }),
    head(172, 84, 'fred', '#d8601e'),
    head(284, 84, 'ron', '#d8601e'),
    ink([[210, 52], [210, 150]], { width: 3, color: TURQ_DARK }),
    piece(rect(196, 120, 14, 5, 2), HUB, { edge: 'cut', fibre: false, shadow: false }),
    // bumpers, headlamp, tail lamp
    piece(rect(8, 160, 22, 12, 5), HUB, { edge: 'cut', fibre: false }),
    piece(rect(412, 160, 22, 12, 5), HUB, { edge: 'cut', fibre: false }),
    piece(circle(36, 128, 17), HUB, { edge: 'cut' }),
    piece(circle(36, 128, 12), GLOW, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(414, 124, 10, 16, 4), '#d6403a', { edge: 'cut', fibre: false, shadow: false }),
    group({ part: 'lamps', origin: [30, 128], opacity: 0 }, [
      piece(poly([[30, 118], [0, 96], [0, 160], [30, 138]]), 'rgba(255,240,170,0.28)', { edge: 'clean', fibre: false, shadow: false }),
      piece(circle(34, 128, 30), 'rgba(255,248,200,0.45)', { edge: 'clean', fibre: false, shadow: false }),
    ]),
    // wheels with turquoise arches
    piece(circle(100, 172, 42), TURQ_DARK, { edge: 'cut', fibre: false, shadow: false }),
    piece(circle(344, 172, 42), TURQ_DARK, { edge: 'cut', fibre: false, shadow: false }),
    wheel(100, 178, 34, 'wheels'),
    wheel(344, 178, 34, 'wheels'),
  ]);
}
