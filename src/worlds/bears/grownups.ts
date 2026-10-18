/** SCAFFOLD: stand-ins until the art agent draws them. Keys are "id" and "id:pose". */
import { bear, FUR, top } from './parts';

const stub = (name: string) => () => bear({ name, label: name, fur: FUR.golden, sleeve: '#999999', clothes: top('#999999') });

export const grownups: Record<string, () => string> = {
  'captain-bear': stub('captain-bear'),
  'captain-bear:roar': stub('captain-bear-roar'),
  'captain-bear:point': stub('captain-bear-point'),
  'captain-bear:happy': stub('captain-bear-happy'),
  'uncle-bill': stub('uncle-bill'),
  'uncle-bill:wave': stub('uncle-bill-wave'),
  'uncle-bill:laugh': stub('uncle-bill-laugh'),
  'bully-bear': stub('bully-bear'),
  'bully-bear:grab': stub('bully-bear-grab'),
  'bully-bear:dig': stub('bully-bear-dig'),
  'bully-bear:sorry': stub('bully-bear-sorry'),
  goldilocks: stub('goldilocks'),
  'goldilocks:peek': stub('goldilocks-peek'),
  'goldilocks:wave': stub('goldilocks-wave'),
};
