/**
 * SCAFFOLD: the Treasury's two humans (Lavinia, and her Great Aunt Edie)
 * are being drawn; these stand-ins hold their ids.
 */
import { grownups } from './grownups';

export const treasuryPeople: Record<string, () => string> = {
  lavinia: grownups.goldilocks,
  'great-aunt': grownups.goldilocks,
  'great-aunt:cuddle': grownups.goldilocks,
};
