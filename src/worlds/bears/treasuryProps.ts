/**
 * SCAFFOLD: the Treasury's props (the party things, Grandpa's puppet show,
 * a hiding bush, the hot chocolate and the jumper) are being drawn; these
 * stand-ins hold their ids.
 */
import { homeProps } from './homeProps';

const stand = homeProps['picnic-basket'];
export const treasuryProps: Record<string, () => string> = {
  'birthday-cake': stand,
  'mr-punch': stand,
  'travelling-case': stand,
  'show-curtains': stand,
  bush: stand,
  mug: stand,
  jumper: stand,
  umbrella: stand,
  balloons: stand,
  'party-table': stand,
  parcel: stand,
};
