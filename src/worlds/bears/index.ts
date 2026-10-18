/**
 * The bears: Teddy Bear, his Mummy and Daddy, and their friends, at Bear
 * Cottage, in the wood, up Honeypot Hill and at the seaside. The stories
 * come from a much-loved 1994 picture book of teddy bear stories; the
 * characters here are our own drawings in that book's look: watercolour
 * washes and a scratchy sepia pen on white paper, not torn paper
 * (docs/STYLE.md, "The bears"; src/art/watercolour.ts).
 *
 * Every bear is a whole small teddy built by `bear()` (parts.ts), so they
 * all share the same parts. Stand them with their bottom edge on the ground
 * line: a cub at w 200–240, a grown-up at w 270–320.
 */
import { defineWorld, type CharacterDef } from '../types';
import { daddyBear, mummyBear, mummyBearHold, mummyBearWave, teddy, teddyCross, teddyFly, teddyHappy, teddySad, teddySit, teddyWave } from './family';
import { friends } from './friends';
import { grownups } from './grownups';
import { home } from './home';
import { homeProps } from './homeProps';
import { outdoors } from './outdoors';
import { places } from './places';
import { seaProps } from './seaProps';

/** Parts every bear has (parts.ts). Bears in long dresses have no legs to move. */
const BEAR_PARTS = ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'armL', 'armR', 'legL', 'legR'];
const DRESS_PARTS = BEAR_PARTS.filter((p) => !p.startsWith('leg'));
const GIRL_PARTS = ['figure', 'head', 'eyes', 'lids', 'mouth', 'mouthOpen', 'armL', 'armR', 'hair'];

/** A character from one of the art files' records: its portrait under `id`, its poses under `id:pose`. */
function from(rec: Record<string, () => string>, id: string): Pick<CharacterDef, 'art' | 'poses'> {
  const poses: Record<string, () => string> = {};
  for (const [key, draw] of Object.entries(rec)) if (key.startsWith(id + ':')) poses[key.slice(id.length + 1)] = draw;
  return { art: rec[id], poses };
}

export default defineWorld({
  id: 'bears',
  name: 'Bear Cottage',
  accent: '#c8433a',
  about:
    'Teddy Bear lives at Bear Cottage with Mummy Bear and Daddy Bear. Thatched roof, a garden with a fence and a watering can, a wood at the edge of it, Honeypot Hill beyond, and the village green just across the path with its duck pond, swing and wishing well. ' +
    'Summer days out go to the seaside. It is a gentle, sunny, old-fashioned world: honey for breakfast, porridge when it is cold, scarves, kites, picnics and sand-castles. ' +
    'The stories are small and true to life: a bored morning, a sand-castle spoiled, wanting to fly. Nobody is ever in real danger. ' +
    'Bully Bear is the only one who is unkind, and he is a big cub who teases, not a monster: he spoils sand-castles and snatches things, and in the end he says sorry. ' +
    'Grown-ups are kind and a bit busy; Mummy always has a surprise up her sleeve. Teddy is clever, not strong: he wins with an idea. ' +
    'Never: anyone spanked, smacked or thrown (the book has a "good spanking" line: it is never used), a cub lost for long, a cross word between Mummy and Daddy.',
  characters: {
    teddy: {
      name: 'Teddy',
      art: teddy,
      poses: { wave: teddyWave, fly: teddyFly, sit: teddySit, sad: teddySad, cross: teddyCross, happy: teddyHappy },
      parts: BEAR_PARTS,
      about:
        'Teddy Bear, the hero: a small honey-coloured cub in his red jumper with yellow stripes and a white collar (always the same, so he is easy to find). Curious, eager, a dreamer; gets bored and grumpy sometimes and gets over it. Clever: he wins with an idea, not his muscles. Loves honey on hot toast, kites, sand-castles and stories. Says "Oh, Mummy!" and "It\'s not fair!" and "I\'ve got an idea!". Poses: wave, fly (arms out like wings), sit (bump! sitting with his feet up), sad, cross (paws on hips), happy (arms up).',
      voice: 'A bright, eager little boy of about six; a gentle English accent; quick to giggle and quick to sulk.',
    },
    'mummy-bear': {
      name: 'Mummy Bear',
      art: mummyBear,
      poses: { hold: mummyBearHold, wave: mummyBearWave },
      parts: DRESS_PARTS,
      about:
        'Mummy Bear: blue spotted dress, white apron, a dark bodice and striped sleeves. Warm, calm, always busy in the kitchen, and always knows more than she says: "You might have a nice surprise before long!" Tells stories while she stirs. Never cross for long; never frightened. Poses: hold (paws together in front, for a bowl or a plate; put the prop over her paws), wave.',
      voice: 'A warm, smiling English mum of about forty; soft and unhurried, with a twinkle.',
    },
    'daddy-bear': {
      name: 'Daddy Bear',
      art: daddyBear,
      parts: BEAR_PARTS,
      about:
        'Daddy Bear: a bigger, darker bear in a cream waistcoat over a pale shirt, with a red spotted bow tie. Reads the paper in his big green armchair; dry, gentle jokes ("Someone might come along and eat it for you"). Takes everyone for walks. Never shouts.',
      voice: 'A deep, kind, slightly sleepy English dad; dry humour, a chuckle in his voice.',
    },
    barney: {
      name: 'Barney',
      ...from(friends, 'barney'),
      parts: BEAR_PARTS,
      about:
        "Barney Bear, Teddy's best friend: a cub in a green jumper with white stripes. Loyal, cheerful, a bit of a worrier: \"What can we do, Teddy?\" Asks the question; Teddy has the idea. Good at digging. Poses: wave, happy.",
      voice: 'A friendly little boy of about six, a touch higher and more anxious than Teddy.',
    },
    'teeny-bear': {
      name: 'Teeny',
      ...from(friends, 'teeny-bear'),
      parts: DRESS_PARTS,
      about:
        'Teeny Bear: the smallest cub, a girl in a blue spotted dress. Shy, quick, helpful: runs errands ("Can you take this to Teacher Bear, Teeny?"). Speaks in short, breathless bursts. Stand her smaller than the others (w 170–190). Pose: happy.',
      voice: 'A tiny, shy little girl of about four; breathless and sweet.',
    },
    'captain-bear': {
      name: 'Captain Bear',
      ...from(grownups, 'captain-bear'),
      parts: BEAR_PARTS,
      about:
        'Captain Bear, the old sea captain who judges the sand-castle competition: a white captain\'s cap with a black peak, round spectacles, a thick white roll-neck jumper. Builds the very best sand-castles and is very proud of his. Gruff, booming, fair, and kind underneath. When cross he ROARS ("You ruffian!") and points, and sends you off: he never touches anyone. Says "Shiver my timbers!" Poses: roar (cross, arms up), point, happy.',
      voice: 'A big, booming old English sea captain; gravelly, theatrical, warm when he laughs.',
    },
    'uncle-bill': {
      name: 'Uncle Bill',
      ...from(grownups, 'uncle-bill'),
      parts: BEAR_PARTS,
      about:
        "Uncle Sailor Bill, Teddy's uncle in the navy: a white sailor's cap with an anchor badge, a navy-and-white striped jersey under a red waistcoat. Jolly, loud, full of sailor talk: \"Ahoy, ship-mates!\", \"Well, scupper me scallywags!\". Flies the navy helicopter, and leads treasure hunts for all the little bears. Keeps secrets well: \"You'll find out soon enough!\" Poses: wave, laugh.",
      voice: 'A hearty, jolly English sailor uncle; loud and laughing, a bit of a West Country roll.',
    },
    'bully-bear': {
      name: 'Bully Bear',
      ...from(grownups, 'bully-bear'),
      parts: BEAR_PARTS,
      about:
        'Bully Bear: a big cub, bigger than the others, in a blue-and-white striped jumper, with cross brows and a smirk. Teases, spoils sand-castles, snatches letters and sweets, laughs "Ha ha!" and runs off. Never hits anyone, and nobody hits him. When caught out he stammers ("B-but, I-I didn\'t…"), and in the end he says sorry and joins in. He is the villain of the seaside, not a monster. Poses: grab (holding something up out of reach), dig (with a spade), sorry (head down, sheepish).',
      voice: 'A big, gruff boy of about eight; a jeering laugh, but goes small and mumbly when he says sorry.',
    },
    goldilocks: {
      name: 'Goldilocks',
      ...from(grownups, 'goldilocks'),
      parts: GIRL_PARTS,
      about:
        'Goldilocks, from the story Mummy tells: a little girl with a great mop of golden curls, a blue spotted bow and a blue spotted dress. Not a villain: curious and greedy for porridge. In "The Three Bears" she is seen in the story, and then (maybe!) peeking from behind a tree. Poses: peek (half hidden, looking round), wave.',
      voice: 'A cheerful, cheeky little girl of about six.',
    },
    bobby: {
      name: 'Bobby',
      ...from(friends, 'bobby'),
      parts: BEAR_PARTS,
      about: 'Bobby Bear, one of the treasure-hunt bears: a lively cub in an orange-and-white striped jumper. Loves hide-and-seek, climbing trees and racing. "Race you through the trees!" Pose: happy.',
      voice: 'An excitable little boy of about seven; fast and bouncy.',
    },
    posy: {
      name: 'Posy',
      ...from(friends, 'posy'),
      parts: DRESS_PARTS,
      about: 'Posy, a treasure-hunt bear: a girl cub in a red spotted dress with a big red spotted bow on her head. Bossy in a nice way; tells everyone the plan. "We\'re going on a treasure hunt!" Pose: happy.',
      voice: 'A chatty, confident little girl of about seven.',
    },
    bella: {
      name: 'Bella',
      ...from(friends, 'bella'),
      parts: DRESS_PARTS,
      about: 'Bella, a treasure-hunt bear: a girl cub in a yellow-striped dress. Sporty and kind; can\'t wait for rounders. Pose: happy.',
      voice: 'A sunny, kind little girl of about six.',
    },
  },
  backdrops: {
    'bear-garden': {
      art: places.garden,
      about: 'Bear Cottage from its front garden on a sunny day: the thatched cottage back left (door at x ≈ 330, y ≈ 470), a path winding to it, a big tree on the right (x ≈ 960), a white picket fence front left. Ground line y ≈ 640; open ground x 380–880, room for 3 bears.',
    },
    'bear-kitchen': { art: home['bear-kitchen'], about: 'SCAFFOLD: Bear Cottage kitchen.' },
    'bear-wood': { art: home['bear-wood'], about: 'SCAFFOLD: the wood.' },
    'bear-green': { art: home['bear-green'], about: 'SCAFFOLD: the village green.' },
    'bear-beach': { art: outdoors['bear-beach'], about: 'SCAFFOLD: the beach.' },
    'bear-dunes': { art: outdoors['bear-dunes'], about: 'SCAFFOLD: the dunes.' },
    'honeypot-hill': { art: outdoors['honeypot-hill'], about: 'SCAFFOLD: Honeypot Hill.' },
    'bear-sky': { art: outdoors['bear-sky'], about: 'SCAFFOLD: the sky.' },
  },
  props: {
    sandcastle: { art: seaProps.sandcastle, size: [200, 160], about: 'SCAFFOLD' },
    'big-sandcastle': { art: seaProps['big-sandcastle'], size: [360, 300], about: 'SCAFFOLD' },
    bucket: { art: seaProps.bucket, about: 'SCAFFOLD' },
    spade: { art: seaProps.spade, size: [60, 160], about: 'SCAFFOLD' },
    'beach-ball': { art: seaProps['beach-ball'], about: 'SCAFFOLD' },
    envelope: { art: seaProps.envelope, size: [140, 100], about: 'SCAFFOLD' },
    crab: { art: seaProps.crab, size: [110, 80], about: 'SCAFFOLD' },
    starfish: { art: seaProps.starfish, size: [90, 90], about: 'SCAFFOLD' },
    shell: { art: seaProps.shell, size: [80, 70], about: 'SCAFFOLD' },
    'sandcastle-flag': { art: seaProps['sandcastle-flag'], size: [60, 100], about: 'SCAFFOLD' },
    'shell-medal': { art: seaProps['shell-medal'], size: [90, 120], about: 'SCAFFOLD' },
    seagull: { art: seaProps.seagull, size: [120, 60], about: 'SCAFFOLD' },
    'porridge-bowl': { art: homeProps['porridge-bowl'], size: [140, 90], about: 'SCAFFOLD' },
    saucepan: { art: homeProps.saucepan, size: [200, 120], about: 'SCAFFOLD' },
    'wooden-spoon': { art: homeProps['wooden-spoon'], size: [40, 150], about: 'SCAFFOLD' },
    'honey-pot': { art: homeProps['honey-pot'], size: [110, 120], about: 'SCAFFOLD' },
    ladybird: { art: homeProps.ladybird, size: [60, 50], about: 'SCAFFOLD' },
    kite: { art: homeProps.kite, size: [160, 260], about: 'SCAFFOLD' },
    butterfly: { art: homeProps.butterfly, size: [80, 70], about: 'SCAFFOLD' },
    blackbird: { art: homeProps.blackbird, size: [110, 80], about: 'SCAFFOLD' },
    aeroplane: { art: homeProps.aeroplane, size: [220, 90], about: 'SCAFFOLD' },
    helicopter: { art: homeProps.helicopter, size: [440, 320], about: 'SCAFFOLD' },
    splash: { art: homeProps.splash, size: [240, 140], about: 'SCAFFOLD' },
    'picnic-basket': { art: homeProps['picnic-basket'], size: [160, 130], about: 'SCAFFOLD' },
    'cake-plate': { art: homeProps['cake-plate'], size: [160, 90], about: 'SCAFFOLD' },
    duck: { art: homeProps.duck, size: [120, 100], about: 'SCAFFOLD' },
    'treasure-chest': { art: homeProps['treasure-chest'], size: [160, 130], about: 'SCAFFOLD' },
    'thought-cloud': { art: homeProps['thought-cloud'], size: [520, 360], about: 'SCAFFOLD' },
  },
});
