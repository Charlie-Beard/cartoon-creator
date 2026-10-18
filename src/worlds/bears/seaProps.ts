/** SCAFFOLD: stand-ins until the art agent draws them. */
import { cached, circle, svg } from '../../art/paper';
import { wash } from '../../art/watercolour';

const stub = (name: string, w = 120, h = 120) => cached(() => svg({ w, h, name }, [wash(circle(w / 2, h / 2, Math.min(w, h) / 3), '#cccccc')]));

export const seaProps: Record<string, () => string> = {
  sandcastle: stub('bears-sandcastle', 200, 160),
  'big-sandcastle': stub('bears-big-sandcastle', 360, 300),
  bucket: stub('bears-bucket'),
  spade: stub('bears-spade', 60, 160),
  'beach-ball': stub('bears-beach-ball'),
  envelope: stub('bears-envelope', 140, 100),
  crab: stub('bears-crab', 110, 80),
  starfish: stub('bears-starfish', 90, 90),
  shell: stub('bears-shell', 80, 70),
  'sandcastle-flag': stub('bears-sandcastle-flag', 60, 100),
  'shell-medal': stub('bears-shell-medal', 90, 120),
  seagull: stub('bears-seagull', 120, 60),
};
