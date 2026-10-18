/** SCAFFOLD: stand-ins until the art agent paints them. */
import { cached, svg } from '../../art/paper';
import { pageNodes } from '../../art/watercolour';
import { sky } from './scenery';

const stub = (name: string) => cached(() => svg({ w: 1180, h: 820, name }, pageNodes(1180, 820, name, [...sky(400)])));

export const outdoors: Record<string, () => string> = {
  'bear-beach': stub('bears-beach'),
  'bear-dunes': stub('bears-dunes'),
  'honeypot-hill': stub('bears-honeypot-hill'),
  'bear-sky': stub('bears-sky'),
};
