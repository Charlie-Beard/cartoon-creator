/** SCAFFOLD: stand-ins until the art agent draws them. Keys are "id" and "id:pose". */
import { bear, FUR, top } from './parts';

const stub = (name: string) => () => bear({ name, label: name, fur: FUR.golden, sleeve: '#999999', clothes: top('#999999') });

export const friends: Record<string, () => string> = {
  barney: stub('barney'),
  'barney:wave': stub('barney-wave'),
  'barney:happy': stub('barney-happy'),
  'teeny-bear': stub('teeny-bear'),
  'teeny-bear:happy': stub('teeny-bear-happy'),
  bobby: stub('bobby'),
  'bobby:happy': stub('bobby-happy'),
  posy: stub('posy'),
  'posy:happy': stub('posy-happy'),
  bella: stub('bella'),
  'bella:happy': stub('bella-happy'),
};
