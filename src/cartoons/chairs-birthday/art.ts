/**
 * One-off art for The Wishing-Chair's Birthday: the little playroom table
 * the party cake stands on, and the blue tea towel Mollie throws over the
 * cake so the chair can't peek.
 */
import { C, cached, ellipse, ink, piece, poly, rect, svg } from '../../kit';

/** A little wooden playroom table with a white cloth and a red scalloped edge. 260 × 150. */
export const table = cached(() =>
  svg({ w: 260, h: 150, name: 'chairs-birthday-table', label: 'A table' }, [
    piece(rect(30, 40, 16, 108, 3), C.wood),
    piece(rect(214, 40, 16, 108, 3), C.wood),
    piece(rect(10, 22, 240, 22, 4), C.brown),
    piece(poly([[4, 16], [256, 16], [252, 62], [8, 62]]), C.white),
    ...[20, 52, 84, 116, 148, 180, 212, 240].map((x) => piece(ellipse(x, 62, 16, 8), C.rose, { edge: 'cut', fibre: false, shadow: false })),
  ]),
);

/** Mollie's tea towel: blue checks, a soft drape over something round. 200 × 130. */
export const teaTowel = cached(() =>
  svg({ w: 200, h: 130, name: 'chairs-birthday-tea-towel', label: 'A tea towel' }, [
    piece(poly([[14, 124], [24, 40], [60, 8], [140, 8], [176, 40], [186, 124], [140, 116], [100, 126], [60, 116]]), '#dbe6f0'),
    ...[50, 80, 110, 140].map((x) => ink([[x, 12], [x + (x - 100) * 0.25, 120]], { width: 5, color: C.blue, opacity: 0.6 })),
    ink([[22, 60], [178, 60]], { width: 5, color: C.blue, opacity: 0.6 }),
    ink([[16, 96], [184, 96]], { width: 5, color: C.blue, opacity: 0.6 }),
  ]),
);
