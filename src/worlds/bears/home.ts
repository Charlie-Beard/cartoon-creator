/** SCAFFOLD: stand-ins until the art agent paints them. */
import { cached, svg } from '../../art/paper';
import { pageNodes } from '../../art/watercolour';
import { sky } from './scenery';

const stub = (name: string) => cached(() => svg({ w: 1180, h: 820, name }, pageNodes(1180, 820, name, [...sky(400)])));

export const home: Record<string, () => string> = {
  'bear-kitchen': stub('bears-kitchen'),
  'bear-wood': stub('bears-wood'),
  'bear-green': stub('bears-green'),
};
