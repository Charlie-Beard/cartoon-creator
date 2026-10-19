/**
 * SCAFFOLD: the Teddy Bear Treasury's bears (Grandpa Bear, Aunt Bertha,
 * Grumpy Bertie Bear) are being drawn; these stand-ins hold their ids.
 */
import { daddyBear, mummyBear, teddy } from './family';

export const treasury: Record<string, () => string> = {
  'grandpa-bear': daddyBear,
  'grandpa-bear:marmaduke': daddyBear,
  'aunt-bertha': mummyBear,
  bertie: teddy,
  'bertie:soaked': teddy,
  'bertie:gown': teddy,
  'bertie:jumper': teddy,
  'bertie:sad': teddy,
  'bertie:happy': teddy,
};
