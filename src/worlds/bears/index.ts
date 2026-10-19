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
import { treasury } from './treasury';
import { treasuryPeople } from './treasuryPeople';
import { treasuryProps } from './treasuryProps';

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
    // From the Teddy Bear Treasury: "Teddy's Birthday Party" and "Grumpy Bertie Bear".
    'grandpa-bear': {
      name: 'Grandpa Bear',
      ...from(treasury, 'grandpa-bear'),
      parts: BEAR_PARTS,
      about:
        'Teddy’s Grandpa: greyer round the muzzle, round spectacles, a purple waistcoat and a blue bow tie. An old showman: he does the puppet shows at birthdays (Mr Punch, and Marmaduke, his talking dummy who sits on his knee). Sighs dramatically when things go wrong, then twinkles when he has an idea. Can do a squeaky voice without moving his lips. ' +
        'Pose marmaduke: sitting, with Teddy on his knee pretending to be Marmaduke. In it the talking mouth is Teddy’s, not Grandpa’s, so lines said by the `marmaduke` speaker with this pose as the actor move Teddy’s mouth.',
      voice: 'A twinkly, theatrical old English grandad, seventies, warm and a bit gravelly.',
    },
    'aunt-bertha': {
      name: 'Aunt Bertha',
      ...from(treasury, 'aunt-bertha'),
      parts: DRESS_PARTS,
      about: 'Aunt Bertha Bear: big and jolly in a white mob cap and a yellow check dress with a cameo brooch. Loves parties, especially her own birthday. Organises lots of jolly games. Laughs a big laugh.',
      voice: 'A big, jolly, plummy English aunt, sixties, a hearty laugh, sing-song.',
    },
    bertie: {
      name: 'Bertie Bear',
      ...from(treasury, 'bertie'),
      parts: BEAR_PARTS,
      about:
        'Grumpy Bertie Bear: an older, paler bear in a red, white and blue striped blazer, with cross little brows. Belongs to a girl called Lavinia, and is a bit grand about it ("The house where we live is much bigger than this!"). Grumbles, sighs, and forgets to say thank you; underneath he is lonely and wants to be loved. Softens by the end. ' +
        'Poses: soaked (dripping, mid-sneeze), gown (in Teddy’s red dressing gown, sitting), jumper (the green jumper, "not really my colour"), sad (about to cry), happy.',
      voice: 'A grumpy, slightly pompous old English bear, gruff and sniffly, harrumphing; secretly soft. Older than Teddy.',
    },
    marmaduke: {
      name: 'Marmaduke',
      art: teddy,
      parts: BEAR_PARTS,
      about:
        'Not a bear of his own: the speaker for Marmaduke, Grandpa Bear’s talking dummy, when Teddy pretends to be him. His lines are Grandpa doing a squeaky voice. Say them with the grandpa-bear marmaduke pose as the actor (its talking mouth is Teddy’s); never put this character on stage. Cheeky, tells silly jokes.',
      voice: 'Grandpa Bear doing a high, squeaky, cheeky puppet voice: an old man’s falsetto, a bit wobbly, very jolly.',
    },
    lavinia: {
      name: 'Lavinia',
      ...from(treasuryPeople, 'lavinia'),
      parts: GIRL_PARTS,
      about:
        'Lavinia, about seven: curly ginger-blonde ringlets, a big red-and-white spotted bow, a blue dress with a white frilled collar, and her new doll held in her arms. Slightly spoilt but not wicked. She owns Bertie Bear but has a new doll now, so she is careless rather than cruel ("What, that old thing?"). Humans are big here: the bears are toys to her, so stand her taller than the bears (w 280–320).',
      voice: 'A posh little English girl, about seven: careless and sing-song, bright and breezy, not nasty.',
    },
    'great-aunt': {
      name: 'Great Aunt Edie',
      ...from(treasuryPeople, 'great-aunt'),
      parts: GIRL_PARTS,
      about:
        'Lavinia’s great-aunt, a little old lady: grey curls, round glasses, a straw hat with a black ribbon, a lilac spotted dress with a lace collar and a black handbag. Kind, gentle and old-fashioned; calls people "dear". She had a bear just like Bertie when she was a girl, and takes him home for her grandchildren to play with. ' +
        'Pose cuddle: holding Bertie (small and happy, in his striped blazer) against her chest. Humans are big here: stand her taller than the bears (w 320–360).',
      voice: 'A gentle, kind, elderly English lady, seventies: soft and warm, a little quavery.',
    },
  },
  backdrops: {
    'bear-garden': {
      art: places.garden,
      about: 'Bear Cottage from its front garden on a sunny day: the thatched cottage back left (door at x ≈ 330, y ≈ 470), a path winding to it, a big tree on the right (x ≈ 960), a white picket fence front left. Ground line y ≈ 640; open ground x 380–880, room for 3 bears.',
    },
    'bear-kitchen': { art: home['bear-kitchen'], about: 'Bear Cottage’s kitchen: flowery cream wallpaper; left, a brick chimney breast with a green iron range (hob x 70–270, a pan’s base at y 478, centre x 170) and a mantelpiece of blue-and-white plates; middle, a window with blue curtains and a clear sill (top at y 372, x 350–690; glass above it x 380–660, y 180–372) for a ladybird or a blackbird; Daddy’s green check armchair (x 690–905, seat top y ≈ 540); right, a table with a green-check cloth (top at y 520, x 930–1160) for porridge bowls. Flagstone floor, a rag rug. Feet at y 625–650; open floor x 300–680 (bears can stand in front of the furniture too). Room for 3.' },
    'bear-wood': { art: home['bear-wood'], about: 'A sunny wood: big hatched trunks framing left (x 30–180) and right (x 905–1075, base y 660, a knot hole at 985, 470), a leafy canopy, a sandy path winding back to a little thatched cottage at the edge of the wood (centre x 620, base y 412). Goldilocks can peek from the right trunk’s left edge (her peek pose is cut away on its left: put its cut edge along the trunk, feet y ≈ 660). Open ground x 230–860, feet y 630–660; room for 3.' },
    'bear-green': { art: home['bear-green'], about: 'The village green across the path from Bear Cottage: the cottage’s thatch and a fence cut by the left edge, a big tree (x 470), a stone fountain (x 600, base y 560), a wishing well (x 840) and a swing (x 1030) on the far bank, a duck pond with reeds and two ducks (x 755–1180, y 520–660). Sunny: the coming-home picture. Open ground x 0–700, feet y 600–650; room for 3 (more only if some are small and at the back).' },
    'bear-beach': { art: outdoors['bear-beach'], about: 'A sunny beach: scalloped clouds, a sea to a horizon at y 320 with a little red steamer (890, 318), a foam line at y ≈ 480, sand from y 490, grey boulders left (x 0–300; a cub can hide behind them) and a small one right (1085, 545), pebbles, shells, marram tufts. No sand-castles painted in (use the props). Open sand x 300–1000, feet y 620–650; room for 3.' },
    'bear-dunes': { art: outdoors['bear-dunes'], about: 'The top of a sand dune above the sea: sky and gulls, a strip of sea far behind (horizon y 330), a sandy hump with marram grass rising on the left (crest ≈ 240, 440), a flat dune-top in front. Captain Bear’s big-sandcastle goes with its base middle at about (860, 645) (x 680–1040). Open sand on the left, x 60–560, feet y 625–650; room for 3.' },
    'honeypot-hill': { art: outdoors['honeypot-hill'], about: 'Honeypot Hill: a grassy hill rising from the left to a rounded top at about (800, 265), bushes, a sandy path up to the top from (560–900, 585), and a muddy stream with stones at the bottom left (centre ≈ 280, 600; x 60–450, y 555–647: Teddy lands in it, SPLAT). Summer sky. Open grass x ≈ 520–1100, feet y 620–650.' },
    'bear-sky': { art: outdoors['bear-sky'], about: 'Up in the sky: soft blue with scalloped clouds round the top and sides, a patchwork of tiny fields with hedges and a tiny thatched cottage far below (520, 668) fading into the page. The middle band (x 200–950, y 200–490) is open for the helicopter with Teddy on his rope.' },
  },
  props: {
    sandcastle: { art: seaProps.sandcastle, size: [200, 160], about: 'A bucket-shaped sand-castle with turrets, a little door, shells and a moat line; its bottom edge is the sand. Make several at different w; flatten one with k.to(scaleY) and a puff when Bully spoils it.' },
    'big-sandcastle': { art: seaProps['big-sandcastle'], size: [360, 300], about: 'Captain Bear’s grand three-tier castle with a keep, shells, starfish and seaweed. The red flag on top is part `flag` (origin at the pole base, 180 52): wobble it.' },
    bucket: { art: seaProps.bucket, about: 'A red bucket with a white band of yellow stars and a wire handle.' },
    spade: { art: seaProps.spade, size: [60, 160], about: 'A wooden spade with a red blade, standing upright (blade at the bottom).' },
    'beach-ball': { art: seaProps['beach-ball'], about: 'A white, red and yellow beach ball.' },
    envelope: { art: seaProps.envelope, size: [140, 100], about: 'A cream envelope with a red wax seal and ink scribbles: Teddy’s pretend letter.' },
    crab: { art: seaProps.crab, size: [110, 80], about: 'A small green-brown crab with eye stalks. Claws are parts `clawL` (origin 26 44) and `clawR` (84 44): snap them.' },
    starfish: { art: seaProps.starfish, size: [90, 90], about: 'An orange starfish.' },
    shell: { art: seaProps.shell, size: [80, 70], about: 'A blue-grey and pink scallop shell, standing on its hinge.' },
    'sandcastle-flag': { art: seaProps['sandcastle-flag'], size: [60, 100], about: 'A little red flag on a stick; the cloth is part `flag` (origin at the pole foot, 30 96). Stand it on a castle top.' },
    'shell-medal': { art: seaProps['shell-medal'], size: [90, 120], about: 'A prize: a big scallop shell on a red ribbon, with a little star. Hang one over a bear’s collar.' },
    seagull: { art: seaProps.seagull, size: [120, 60], about: 'A white gull facing right, wings spread: parts `wingL` (56 36) and `wingR` (64 36) to flap.' },
    'porridge-bowl': { art: homeProps['porridge-bowl'], size: [140, 90], about: 'A white bowl with blue bands, porridge and a wooden spoon in it. Part `steam` (hidden) is three curls: fade it in for “too hot”. Use w 100 / 130 / 170 for Baby, Mummy and Daddy Bear’s bowls.' },
    saucepan: { art: homeProps.saucepan, size: [200, 120], about: 'A dented silver saucepan of porridge, black handle to the right. Part `steam` (hidden). Stands on the kitchen hob (base y 478).' },
    'wooden-spoon': { art: homeProps['wooden-spoon'], size: [40, 150], about: 'A big wooden spoon, bowl at the top. Show it at w ≈ 24–30 (it is tall).' },
    'honey-pot': { art: homeProps['honey-pot'], size: [110, 120], about: 'A golden honey pot with a bee label, honey dripping, a dipper leaning out.' },
    ladybird: { art: homeProps.ladybird, size: [60, 50], about: 'A ladybird seen from above, head at the top. The shell halves are parts `wingL` and `wingR` (hinged at 30 12): rotate them out to fly.' },
    kite: { art: homeProps.kite, size: [160, 260], about: 'A red-and-yellow diamond kite with spots; the tail of bows is part `tail` (hinged at 80 170) to sway.' },
    butterfly: { art: homeProps.butterfly, size: [80, 70], about: 'A pale yellow butterfly; parts `wingL` and `wingR` (hinged at 40 38) to flap.' },
    blackbird: { art: homeProps.blackbird, size: [110, 80], about: 'A blackbird facing left on a twig (feet at y ≈ 68).' },
    aeroplane: { art: homeProps.aeroplane, size: [220, 90], about: 'A little white plane with a green stripe, facing right: streak it across the sky.' },
    helicopter: { art: homeProps.helicopter, size: [440, 320], about: 'Uncle Bill’s round yellow navy helicopter, facing left, Uncle Bill in the glass bubble. Part `rotor` (hub 220 48): spin it with scaleX yoyo. Part `rope` (hidden) hangs from the belly at x ≈ 215 down to y ≈ 318: fade it in; Teddy hangs at its end (215, 316 in the prop’s own units).' },
    splash: { art: homeProps.splash, size: [240, 140], about: 'A brown muddy splash with drops flying (base at y ≈ 126): SPLAT!' },
    'picnic-basket': { art: homeProps['picnic-basket'], size: [160, 130], about: 'A wicker hamper with a red check cloth peeking out.' },
    'cake-plate': { art: homeProps['cake-plate'], size: [160, 90], about: 'A plate of three pink-iced cherry buns.' },
    duck: { art: homeProps.duck, size: [120, 100], about: 'A white duck swimming, facing right (water line y ≈ 80).' },
    'treasure-chest': { art: homeProps['treasure-chest'], size: [160, 130], about: 'A wooden chest with brass bands. Part `lid` (hinged at the back, 80 60) opens; part `gold` (hidden) is coins and sweets inside: fade it in.' },
    'thought-cloud': { art: homeProps['thought-cloud'], size: [520, 360], about: 'A big scalloped dream cloud for a story-within-a-story; plain white inside (x 70–450, y 70–260 in its own units) for characters and props; two little puffs trail off bottom left towards the teller.' },
    // From the Teddy Bear Treasury: the party and Grumpy Bertie.
    'birthday-cake': { art: treasuryProps['birthday-cake'], size: [260, 220], about: 'A big round sponge cake on a stand: jam in the middle, pink icing, five striped candles. Parts: `flames` (the five candle flames: fade them out to blow them out) and `smoke` (curls of smoke, hidden: fade them in after). Stand it on the party table.' },
    'mr-punch': { art: treasuryProps['mr-punch'], size: [150, 230], about: 'Grandpa’s glove puppet, Mr Punch: a red jester hat with a bell, a red-and-yellow diamond costume, a white ruff, and a big nose squashed sideways with a sticking plaster on it (he was caught in the case). Sorry for himself, never frightening. No parts.' },
    'travelling-case': { art: treasuryProps['travelling-case'], size: [220, 150], about: 'An old brown leather travelling case with two straps, brass catches and a handle. Part `lid` (hinged at the top back) lifts to show a red lining.' },
    'show-curtains': { art: treasuryProps['show-curtains'], size: [560, 520], about: 'A little garden puppet stage: wooden posts, a top rail with bunting, a scalloped pelmet and two red curtains with yellow stars meeting in the middle, hanging right down to the ground (y 500), so whoever waits behind is hidden. Parts `curtainL` and `curtainR` (each hinged at its outer top corner: slide or squash it sideways to open). Put the performers behind (lower z).' },
    bush: { art: treasuryProps.bush, size: [380, 230], about: 'A big round clump of leafy bush with a few red berries, for hiding behind: the middle top is low (y ≈ 80) and the ends higher, so a small bear behind it (lower z) peeps over the middle. Part `leaves` (hinged at the bottom middle) shakes when someone is inside.' },
    mug: { art: treasuryProps.mug, size: [90, 90], about: 'A blue-and-white banded mug of hot chocolate with a pink marshmallow. Part `steam` (two curls above it).' },
    jumper: { art: treasuryProps.jumper, size: [200, 190], about: 'A green woolly jumper with cream stripes and red elbow patches, laid flat with its sleeves out. No parts.' },
    umbrella: { art: treasuryProps.umbrella, size: [300, 300], about: 'An open umbrella with red, white and blue striped panels and a wooden hooked handle (bottom middle). No parts: tilt or bob it.' },
    balloons: { art: treasuryProps.balloons, size: [200, 300], about: 'A bunch of four balloons (green, red, yellow, blue) tied at a knot, with a long string. Part `bunch` (hinged at the knot, y ≈ 214): sway it a few degrees.' },
    'party-table': { art: treasuryProps['party-table'], size: [620, 200], about: 'A long party table with a white blue-checked cloth: iced biscuits, a green jelly and a pie on the left; sandwiches, a red jelly and banana boats on the right; the middle (x 290–350) clear for the cake. The tabletop is at y ≈ 95 of 200. No parts.' },
    parcel: { art: treasuryProps.parcel, size: [140, 120], about: 'A pass-the-parcel present in blue paper with yellow spots and a red ribbon bow. No parts.' },
  },
});
