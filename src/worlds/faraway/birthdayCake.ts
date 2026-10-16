/**
 * A birthday cake with candles, for any party in the Faraway Tree (the Land
 * of Birthdays, a party in Moon-Face's room).
 *
 * Two round tiers in pink icing on a china plate, six candles on top. The
 * flames are their own part (`flames`), so a story can light them (hidden
 * at first, faded in) or blow them out (faded out, with a puff). The white
 * plaque on the front is left blank so a story can write a name on it: its
 * middle is at (140, 186) in the cake's own 280 × 240 box.
 */
import { C } from '../../art/palette';
import { cached, ellipse, group, ink, piece, rect, svg, type Node } from '../../art/paper';

const CANDLES = [72, 99, 126, 154, 181, 208];
const STRIPES = [C.giftBlue, C.cream, C.raspberry, C.cream, C.giftBlue, C.raspberry];

export const birthdayCake = cached(() => {
  const flames: Node[] = CANDLES.flatMap((x) => [
    piece(ellipse(x, 30, 8, 14), C.flame, { shadow: false }),
    piece(ellipse(x, 34, 4, 7), C.candle, { shadow: false, fibre: false }),
  ]);
  return svg({ w: 280, h: 240, name: 'faraway-birthday-cake', label: 'a birthday cake with candles' }, [
    // The plate.
    piece(ellipse(140, 222, 136, 16), C.china, { edge: 'cut' }),
    // The bottom tier, its icing and drips.
    piece(rect(22, 140, 236, 80, 12), C.brown),
    piece(rect(18, 128, 244, 28, 12), C.icing),
    ...[48, 92, 188, 232].map((x) => piece(ellipse(x, 158, 9, 13), C.icing, { shadow: false })),
    piece(rect(26, 196, 228, 8, 3), C.raspberry, { shadow: false, edge: 'cut' }),
    // The blank plaque on the front, for a name.
    piece(ellipse(140, 186, 64, 22), C.cream, { edge: 'cut' }),
    // The top tier.
    piece(rect(56, 74, 168, 64, 10), C.brown),
    piece(rect(52, 64, 176, 24, 10), C.icing),
    ...[80, 140, 200].map((x) => piece(ellipse(x, 90, 7, 10), C.icing, { shadow: false })),
    ...[96, 168].map((x) => piece(ellipse(x, 66, 7, 7), C.cherry, { shadow: false })),
    // The candles and their wicks.
    ...CANDLES.flatMap((x, i) => [piece(rect(x - 5, 40, 10, 30, 2), STRIPES[i], { edge: 'cut' }), ink([[x, 40], [x, 33]], { width: 2, color: C.charcoal })]),
    group({ part: 'flames' }, flames),
  ]);
});
