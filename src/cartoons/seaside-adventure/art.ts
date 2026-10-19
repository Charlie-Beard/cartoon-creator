/**
 * One-off art for Teddy's Seaside Adventure, in the bears world's
 * watercolour-and-ink look (src/art/watercolour.ts), matching the sand and
 * rock colours of the world's seaside props and the beach backdrop.
 *
 * - `turret`: the bucket-shaped tower that pops onto Teddy and Barney's
 *   castle on his first turn (the shape a bucket leaves when it's tipped up).
 * - `heap`: what's left of their castle after Bully's spade: a low lumpy
 *   mound with a shell and a broken lump of tower.
 * - `moat`: the sea water that fills Bully's moat.
 * - `boulder`: a big grey rock laid over the beach backdrop's painted one,
 *   so Bully Bear can crouch behind it and only his ears and eyes show.
 */
import { cached, curve, ellipse, poly, rect, rng, svg, type Node, type Pt } from '../../art/paper';
import { blot, paler, pen, wash } from '../../art/watercolour';

const SAND_C = '#e3c07e';
const SAND_PALE = '#ecd09a';
const SAND_SHADE = '#b88d52';
const SEA_C = '#8fb1cc';
const ROCK = '#9ea8b6';

/** A bucket-shaped sand tower with four crenellations and a shell (80 × 100; bottom edge on the sand). */
export const turret = cached(() => {
  const merlons: Node[] = [0, 1, 2, 3].map((i) => wash(rect(12 + i * 15, 18, 10, 14, 1.5), paler(SAND_PALE, 0.1), { lineWidth: 1.8, depth: 0.35, light: -120, wobble: 0.8 }));
  return svg({ w: 80, h: 100, name: 'seaside-adventure-turret', label: 'a sand tower' }, [
    blot(ellipse(40, 95, 36, 5), '#d6b270', 0.5),
    ...merlons,
    wash(poly([[6, 96], [74, 96], [66, 30], [14, 30]]), SAND_C, { light: -150, depth: 0.32, hatch: 6, shade: SAND_SHADE, lineWidth: 2.2 }),
    // bucket ridges pressed into the sand
    pen([[12, 50], [40, 52], [68, 50]], { width: 1.4, opacity: 0.6, breaks: 0.3 }),
    pen([[10, 74], [40, 76], [70, 74]], { width: 1.4, opacity: 0.6, breaks: 0.3 }),
    wash(curve([[34, 66], [30, 58], [40, 52], [50, 58], [46, 66]], 2), '#e7b9bd', { lineWidth: 1.4, depth: 0.4, bloom: false }),
  ]);
});

/** A spoiled castle: a low lumpy heap of sand with a broken tower and a shell (240 × 90; bottom on the sand). */
export const heap = cached(() =>
  svg({ w: 240, h: 90, name: 'seaside-adventure-heap', label: 'a flattened sand-castle' }, [
    blot(ellipse(120, 82, 116, 8), '#d6b270', 0.55),
    wash(curve([[8, 84], [30, 58], [62, 50], [90, 38], [126, 44], [160, 36], [196, 52], [222, 64], [234, 84]], 3), SAND_C, { light: -140, depth: 0.35, hatch: 7, shade: SAND_SHADE, lineWidth: 2.2 }),
    // a broken lump of tower, tipped over
    wash(poly([[138, 54], [176, 46], [182, 70], [146, 78]]), SAND_PALE, { light: -140, depth: 0.3, lineWidth: 1.8, wobble: 1.4 }),
    wash(curve([[66, 72], [62, 62], [72, 56], [82, 62], [78, 72]], 2), '#a9bccd', { lineWidth: 1.4, depth: 0.4, bloom: false }),
    pen([[40, 70], [70, 64]], { width: 1.2, opacity: 0.6 }),
    pen([[190, 66], [214, 74]], { width: 1.2, opacity: 0.6 }),
  ]),
);

/** Sea water in a freshly dug moat: a long blue band with ripples (300 × 40). */
export const moat = cached(() =>
  svg({ w: 300, h: 40, name: 'seaside-adventure-moat', label: 'a moat full of water' }, [
    blot(ellipse(150, 22, 148, 15), '#c79e5e', 0.5),
    wash(ellipse(150, 20, 140, 11), SEA_C, { light: -100, depth: 0.4, lineWidth: 1.8, wobble: 1 }),
    pen([[60, 18], [90, 16], [120, 19]], { width: 1.2, opacity: 0.55, color: '#ffffff' }),
    pen([[170, 21], [200, 18], [236, 21]], { width: 1.2, opacity: 0.55, color: '#ffffff' }),
  ]),
);

/** A big grey boulder, flat on the sand, a little bigger than the backdrop's (360 × 200). */
export const boulder = cached(() => {
  const r = rng(77);
  const pts: Pt[] = [];
  for (let i = 0; i < 11; i++) {
    const a = (i / 11) * Math.PI * 2;
    const k = 0.9 + r() * 0.14;
    const below = Math.sin(a) > 0;
    pts.push([180 + Math.cos(a) * 172 * k, 128 + Math.sin(a) * (below ? 52 : 118) * k]);
  }
  return svg({ w: 360, h: 200, name: 'seaside-adventure-boulder', label: 'a big grey rock' }, [
    blot(ellipse(180, 184, 176, 14), '#8b7f6e', 0.4),
    wash(curve(pts, 2), ROCK, { hatch: 6, light: -120, depth: 0.3, lineWidth: 2.4 }),
    pen([[90, 70], [140, 88], [190, 78]], { width: 1.4, opacity: 0.6 }),
    pen([[230, 110], [270, 120]], { width: 1.4, opacity: 0.5 }),
  ]);
});
