/** SCAFFOLD: stand-ins until the art agent draws them. */
import { cached, circle, svg } from '../../art/paper';
import { wash } from '../../art/watercolour';

const stub = (name: string, w = 120, h = 120) => cached(() => svg({ w, h, name }, [wash(circle(w / 2, h / 2, Math.min(w, h) / 3), '#cccccc')]));

export const homeProps: Record<string, () => string> = {
  'porridge-bowl': stub('bears-porridge-bowl', 140, 90),
  saucepan: stub('bears-saucepan', 200, 120),
  'wooden-spoon': stub('bears-wooden-spoon', 40, 150),
  'honey-pot': stub('bears-honey-pot', 110, 120),
  ladybird: stub('bears-ladybird', 60, 50),
  kite: stub('bears-kite', 160, 260),
  butterfly: stub('bears-butterfly', 80, 70),
  blackbird: stub('bears-blackbird', 110, 80),
  aeroplane: stub('bears-aeroplane', 220, 90),
  helicopter: stub('bears-helicopter', 440, 320),
  splash: stub('bears-splash', 240, 140),
  'picnic-basket': stub('bears-picnic-basket', 160, 130),
  'cake-plate': stub('bears-cake-plate', 160, 90),
  duck: stub('bears-duck', 120, 100),
  'treasure-chest': stub('bears-treasure-chest', 160, 130),
  'thought-cloud': stub('bears-thought-cloud', 520, 360),
};
