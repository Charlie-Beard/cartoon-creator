/**
 * The Faraway Tree (Up the Faraway Tree, charlie-beard/maths-game).
 *
 * The cast, places and things of the Magic Faraway Tree, all drawn in torn
 * paper. The drawing code was ported from the maths game and kept as it was:
 *
 *   parts.ts      shared faces, bodies and `person()` for every portrait
 *   folk.ts       the Folk of the tree
 *   family.ts     Beth, Joe, Fran, Mum and Dad
 *   snap.ts       Dame Snap and her poses
 *   visitors.ts   people from the lands (Topsy-Turvy Man, Giant, Captain Tin …)
 *   oldwoman.ts, whirligig.ts, goblin.ts   hosts of three later lands
 *   places.ts     the tree itself, and Moon-Face's round room
 *   lands/        one ground-level scene per land (l1 … l14)
 *   props.ts      the counting props (pop biscuits, acorns …)
 *   keepsakes.ts  bigger things to find (a lamp, a wand, a snapped ruler …)
 */
import { C } from '../../art/palette';
import { defineWorld, type BackdropDef, type CharacterDef, type PropDef } from '../types';
import { family } from './family';
import { folk } from './folk';
import { dameSnap, dameSnapPose } from './snap';
import { redGoblin } from './goblin';
import { keepsake } from './keepsakes';
import { LAND_ART } from './lands';
import { moonRoom, tree } from './places';
import { oldWoman } from './oldwoman';
import { prop } from './props';
import { giant, enchanter, jellyGoblin, snowman, toySoldier, topsy } from './visitors';
import { whirligig } from './whirligig';
import { cloudFront, cloudTop, kettle, LAND_FARS } from './cloudtop';

// ---------------------------------------------------------------------------
// Characters
// ---------------------------------------------------------------------------

const characters: Record<string, CharacterDef> = {
  moonface: {
    name: 'Moon-Face',
    art: folk.moonface,
    parts: ['figure', 'glow', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'armL', 'armR'],
    about:
      'Lives in the round room at the very top of the tree and owns the slippery-slip. A round, shining, beaming face in a blue coat dotted with gold stars. ' +
      'Warm, jolly and a little booming; he is the host, so he welcomes, counts, explains the lands and keeps everyone safe. ' +
      'Loves visitors, cushions and a good slide, and is never cross for long. It is his idea to leave a land before it moves on. ' +
      'The `glow` part is the shine round his face: make it brighter when he is delighted. Raising his right arm is his wave.',
    voice: 'Warm, booming and jolly: a big friendly uncle who beams as he talks. Mid-low pitch, unhurried, lots of expression (the maths game used speed 0.9, stability 0.4).',
  },
  silky: {
    name: 'Silky',
    art: folk.silky,
    parts: ['figure', 'wingL', 'wingR', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'armL', 'armR', 'wand'],
    about:
      'A kind fairy with long silvery-gold hair, dewdrop wings and a star wand. She lives behind the little yellow door and bakes pop biscuits. ' +
      'Gentle, bright and helpful: she is the one who explains things kindly, flies in to help and works a problem out aloud, counting and pointing. ' +
      'She is also the one who is captured in a Dame Snap story and rescued by the end (never lost for good). ' +
      'Flutter `wingL` / `wingR` when she flies; lift `armR` (the wand arm) for a spell or a twinkle.',
    voice: 'Soft, bright and kind: a gentle young British woman, light and musical, never shrill. Slightly slower than normal (speed 0.92, stability 0.6).',
  },
  saucepan: {
    name: 'The Saucepan Man',
    art: folk.saucepan,
    parts: ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'hat', 'armL', 'armR', 'pots'],
    about:
      'A cheerful old fellow with a saucepan for a hat and kettles, ladles and pans clanking all over him. He is a little deaf and MISHEARS EVERYTHING, which is the joke: ' +
      '"Toast? Lovely, I\'ll have mine with butter!" / "Eh? Socks? I don\'t want socks, I brought broth!". ' +
      'Someone says a thing, he hears a silly different thing, and then the penny drops with an "Oh!". He shouts when he is not sure. ' +
      'He always brings broth, tea or tinned something, and every move he makes goes clank. Never unkind. His right hand cupped to his ear is his "Eh?".',
    voice: 'Loud and a bit deaf: a hearty, bumbling old man who shouts his "EH?"s. Quick, cheerful and very expressive (speed 1.0, stability 0.3).',
  },
  washalot: {
    name: 'Dame Washalot',
    art: folk.washalot,
    parts: ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'hat', 'armL', 'armR', 'tub', 'suds'],
    about:
      'Always washing: a rosy, bustling woman in a spotted red headscarf with her sleeves rolled, up to her elbows in suds. Her tub is on a branch and the water pours down the trunk, ' +
      'so anyone climbing the tree gets splashed. Kindly and motherly, a bit chatty, a bit hurried: "Did somebody say muddy socks? Leave them to me!" ' +
      'She is always willing to wash anything and to lend a hand. Float the `suds` up when she laughs.',
    voice: 'Warm, motherly and bustling: a chatty older British woman, busy and cheerful (speed 0.95, stability 0.4).',
  },
  watzisname: {
    name: 'Mr Watzisname',
    art: folk.watzisname,
    parts: ['figure', 'head', 'eyes', 'brows', 'mouth', 'eyesOpen', 'hat', 'cap', 'armL', 'armR', 'zzz'],
    about:
      'Fast asleep in his nightcap and blue pyjamas, tilted on his branch, with the Zs floating over him. Nobody quite remembers his name (hence "What\'s-his-name"). ' +
      'He is always asleep, so the joke is that he sleeps through everything and then wakes up with a start at the wrong moment, mumbles something dozy ' +
      'and is asleep again. He is gentle, never grumpy. His mouth is a sleeping one and has no talking mouth, so he bobs when he speaks. ' +
      'To wake him: hide `eyes`, show `eyesOpen` (a wide-eyed start), then put them back.',
    voice: 'Slow, sleepy and mumbling: a dozy old man half-asleep, yawning between words. Low and gentle (speed 0.85, stability 0.5).',
  },
  angryPixie: {
    name: 'The Angry Pixie',
    art: folk.pixie,
    parts: ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'hat', 'armL', 'armR', 'puff'],
    about:
      'A small, cross pixie in a tall red cap and green tunic who lives behind the shuttered window and shouts at anyone who peeps in: "Stop PEEPING at me!" ' +
      'Crabby on the outside, soft on the inside: he grumbles and shakes his fist (his raised right arm), then helps anyway and is rather pleased when thanked. ' +
      'He is cross, never cruel, and never actually hits anyone. Use `puff` (the little cross lines by his head) when he is fuming.',
    voice: 'Crabby, squeaky and fast: a grumpy small man who shouts. Higher, sharp and quick (speed 1.05, stability 0.3).',
  },
  oomBoomBoom: {
    name: 'Mr Oom Boom Boom',
    art: folk.oomboom,
    parts: ['figure', 'drum', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'hat', 'armL', 'armR'],
    about:
      'A bandsman in an orange coat with gold frogging and a tall plumed hat, a curly black moustache, and a big blue drum on his front. ' +
      'He says "Oom boom boom!" a lot, speaks in rhythm and beats his drum to mark a big moment. Booming, proud and kind, with a great sense of occasion ' +
      'and lots of "Bravo!" and "Hip, hip, HOORAY!". His drum is precious to him: if it goes missing, he is sad (but it is always found).',
    voice: 'Deep, booming and theatrical: a proud, rich bandmaster with a big laugh (speed 0.9, stability 0.4).',
  },

  beth: {
    name: 'Beth',
    art: family.beth,
    parts: ['figure', 'head', 'hair', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'armL', 'armR', 'book'],
    about:
      'The eldest, about twelve: a high dark ponytail, a plum cardigan and a book under her arm. Sensible, clever and a little bossy in a caring way; she thinks things through, ' +
      'works out the plan and is the one who reads the sign. Brave when it counts. Swing `hair` when she turns. She and her brother and sister call their parents Mum and Dad.',
    voice: 'A clear, confident British girl of about twelve: bright, sensible, a touch bossy but kind (speed 1.0, stability 0.45).',
  },
  joe: {
    name: 'Joe',
    art: family.joe,
    parts: ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'armL', 'armR'],
    about:
      'About ten, with a spiky tuft of hair. Cheerful, curious and up for anything; the first to climb, the first to say "Let\'s go!" and the one who cracks jokes. ' +
      'Brave and a bit impatient. Looks after Fran.',
    voice: 'An energetic British boy of about ten: eager, bright and cheeky (speed 1.0, stability 0.45).',
  },
  fran: {
    name: 'Fran',
    art: family.fran,
    parts: ['figure', 'head', 'hair', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'armL', 'armR'],
    about:
      'The youngest, about seven, with two curly bunches. Sweet, chatty and full of wonder: she asks the questions and says the thing everyone was thinking. ' +
      'Small but brave. Swing `hair` (the bunches) when she hops.',
    voice: 'A bright, sweet British girl of about seven: quick, excited and chatty (speed 1.05, stability 0.4).',
  },
  polly: {
    name: 'Mum',
    art: family.mum,
    parts: ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'armL', 'armR'],
    about:
      'Polly, the children\'s Mum. Warm, calm and practical, with a wry smile. She worries a little, then trusts them, and says things like "Goodness me!" and "Well, I never!". ' +
      'She is never in real danger. Everyone in the cartoon calls her Mum.',
    voice: 'A warm, kind British mum: calm, gentle and a little amused (speed 0.95, stability 0.55).',
  },
  tim: {
    name: 'Dad',
    art: family.dad,
    parts: ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'armL', 'armR'],
    about:
      'Tim, the children\'s Dad. Good-humoured and a bit goofy, always game for an adventure: "A party? Up a tree? Well, I never! Come on, then!" ' +
      'He loves the slippery-slip most of all ("Wheeee! Again! Again!"). He is never in real danger. Everyone in the cartoon calls him Dad.',
    voice: 'A warm, jovial British dad: friendly, easy-going, delighted by everything (speed 0.95, stability 0.55).',
  },

  dameSnap: {
    name: 'Dame Snap',
    art: dameSnap,
    poses: {
      loom: () => dameSnapPose('loom'),
      point: () => dameSnapPose('point'),
      shriek: () => dameSnapPose('shriek'),
      stomp: () => dameSnapPose('stomp'),
      defeated: () => dameSnapPose('defeated'),
    },
    parts: ['figure', 'head', 'bun', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'armL', 'armR', 'ruler'],
    about:
      'The villain: a towering headmistress, all angles, in a black gown with a stiff white collar, a bun like a doorknob with a pencil through it, eyebrows like snapped twigs, ' +
      'pince-nez, a pinched mouth and a long red ruler. Her school is really a prison where children do sums until they get them right, and she HATES sums done well: ' +
      'every right answer cracks one of her rules. She talks in CAPITALS and icy hisses ("WHO is cracking my RULES?"), and she has a terrible clacking walk. ' +
      'She looms, points ("YOU!"), shrieks, stomps and SNAPS her ruler on desks, locks doors and cages. ' +
      'SHE NEVER HITS, SLAPS OR HURTS ANYONE, and she never touches a child. Nobody she catches is lost for good: they are freed by the end. Her defeat is funny or fair ' +
      '(her ruler snaps, her bun comes undone, she is shut in her own cupboard), never violent. Scary scenes are for stories only, then cut back to the heroes. ' +
      'Poses (k.pose): `loom` (bigger, leaning in with a shadow behind), `point` (pointing straight at you), `shriek` (head back, ruler high, lines round her head), ' +
      '`stomp` (rage, ruler in both fists, dust flying) and `defeated` (ruler in two halves, bun undone). The poses have no talking mouth, so use them for beats, then return to the default for lines. ' +
      'Parts in the default art: `bun` (wobble it), `ruler` (snap it down).',
    voice: 'Icy, sharp and commanding: a tall, stern headmistress who hisses and then shrieks. Crisp British diction, slow and menacing, with sudden loud bursts (speed 0.88, stability 0.35). Scary but never a real person\'s voice.',
  },

  topsyTurvyMan: {
    name: 'The Topsy-Turvy Man',
    art: topsy,
    parts: ['figure', 'legs', 'head', 'hair', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'armL', 'armR', 'hat'],
    about:
      'The host of the Land of Topsy-Turvy, who stands on his head: his hair on the ground, his grin the right way up. Everything he says is the wrong way round or back to front ' +
      '("Goodbye!" for hello, "Yes, no!"), delivered with cheerful, upside-down confidence. Friendly, silly and fast.',
    voice: 'Fast, giddy and silly: a jolly, excitable man who trips over his words (speed 1.1, stability 0.3).',
  },
  jellyGoblin: {
    name: 'The Jelly Goblin',
    art: jellyGoblin,
    parts: ['figure', 'jelly', 'eyes', 'lids', 'brows', 'mouth', 'tongue', 'mouthOpen', 'cherry', 'armL', 'armR', 'spoon'],
    about:
      'A big wobbly raspberry jelly of a goblin from the Land of Goodies, with a cherry on top and a giant spoon. Greedy and loud, and a little silly: ' +
      '"Come back! Those were MY toffee shocks! Oh, wibble-wobble… bother my jelly!" He chases the children (with lots of wobbling) but never catches or hurts anyone, ' +
      'and he is more comic than scary.',
    voice: 'Gloopy, greedy and wobbly: a big, comic, glugging voice, a bit nasal (speed 0.95, stability 0.35).',
  },
  rumbletum: {
    name: 'Giant Rumbletum',
    art: giant,
    parts: ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'bird', 'hand'],
    about:
      'The giant of the Land of Giants: so big that only his face and a hand fit in the picture, with a little bird on his head. Huge but friendly, slow and deep, ' +
      'his tummy rumbles when he is hungry. He might chase, trip and stomp about, but he is gentle: the children hide in his teacup and he never hurts anyone. ' +
      'He is a giant: only ever show him big, looking down.',
    voice: 'Very deep, slow and rumbling: a slow, gentle giant, with a booming echo (speed 0.82, stability 0.45).',
  },
  enchanter: {
    name: 'The Enchanter',
    art: enchanter,
    parts: ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'hat', 'armL', 'armR', 'orb'],
    about:
      'The master of the Land of Spells: a robed wizard in a starry pointed hat with a glowing orb. Grand, slow and mysterious, a little eerie; this is where Dame Snap makes a deal ' +
      'with him. He speaks in riddles and flourishes. His spells are sparkles and clouds, never hurting anyone.',
    voice: 'Deep, slow and mysterious: a grand old wizard who speaks carefully, with echoes (speed 0.88, stability 0.5).',
  },
  captainTin: {
    name: 'Captain Tin',
    art: toySoldier,
    parts: ['figure', 'key', 'head', 'eyes', 'lids', 'mouth', 'mouthOpen', 'hat', 'armL', 'armR'],
    about:
      'A toy soldier from the Land of Toys, tin-bright, with a wind-up key in his back and a tall busby. Crisp and proud: "Left, right, left, right!" "All aboard!" ' +
      'Loves marching in rows and counting in twos, fives and tens. Brave and polite.',
    voice: 'Crisp, bright and military: a proud little toy captain barking orders cheerfully (speed 1.05, stability 0.5).',
  },
  mrSnowman: {
    name: 'Mr Snowman',
    art: snowman,
    parts: ['figure', 'armL', 'armR', 'head', 'eyes', 'lids', 'mouth', 'mouthOpen', 'hat', 'scarf'],
    about:
      'The friendly host of the Land of Snow: a round snowman with a top hat, a scarf and stick arms. Says "Brr!" a lot, is delighted by snowballs and icicles, ' +
      'and is a bit slow and soft. He knows when Dame Snap\'s land comes back (the coldest hour).',
    voice: 'Soft, round and chilly: a gentle, slow, cheery voice that says "Brr!" (speed 0.88, stability 0.5).',
  },
  oldWoman: {
    name: 'The Old Woman in the Shoe',
    art: oldWoman,
    parts: ['figure', 'shawl', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'glasses', 'hat', 'cap', 'armL', 'armR', 'spoon'],
    about:
      'Hostess of the Old Woman\'s Shoe, a gigantic boot full of children: a round, kindly, bustling old woman in a frilly mob cap, little round spectacles, a patched shawl and a floury ' +
      'apron with a wooden spoon. She has so many children she hardly knows what to do. Warm and a bit harassed, never cross. She calls everyone "my dear".',
    voice: 'A warm, flustered old granny voice: kind, bustling and a bit wobbly (speed 0.9, stability 0.5).',
  },
  whirligig: {
    name: 'Mr Whirligig',
    art: whirligig,
    parts: ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'moustache', 'hat', 'pinwheel', 'armL', 'armR', 'bell'],
    about:
      'The cheery showman of the Land of Roundabouts: a striped waistcoat, a tall striped hat with a pinwheel on top, rosy cheeks and the biggest curly moustache at the fair. ' +
      'He rings a brass handbell and keeps a roll of tickets. Talks like a fairground barker: "Round and round we go!". Spin `pinwheel`, swing `bell`.',
    voice: 'A bouncy fairground barker: bright, quick and showy, with a big grin in the voice (speed 1.05, stability 0.4).',
  },
  redGoblin: {
    name: 'The Red Goblin',
    art: redGoblin,
    parts: ['figure', 'coin', 'head', 'ears', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'hat', 'cap', 'bell', 'armL', 'fingers', 'armR'],
    about:
      'Small, wiry and brick-red, with long pointed ears, a floppy bell cap, narrow yellow eyes and a sly toothy grin. The Red Goblins live in caves under the Land of the Red Goblins ' +
      'and sneak off with things (Mr Oom Boom Boom\'s big drum, say). Cartoon-menacing, never gory: they sneak, grab, giggle and shout "Hee hee!" and "MINE!", and they never hurt anyone. ' +
      'They always lose the loot at the end, or give it back.',
    voice: 'Sly, wheedling and gleeful: a croaky, sneaky little voice with a giggle (speed 0.92, stability 0.3).',
  },
};

// ---------------------------------------------------------------------------
// Backdrops
// ---------------------------------------------------------------------------

/** A land's ground-level scene as a backdrop. */
const land = (n: number, name: string, about: string): BackdropDef => ({ art: () => LAND_ART[n].scene(name), about });

const backdrops: Record<string, BackdropDef> = {
  tree: {
    art: () => tree('faraway-tree'),
    about:
      'The Magic Faraway Tree at dusk from the foot of the tree: a fat trunk with a door in the roots, Dame Washalot\'s tub with water pouring down (right), the Angry Pixie\'s window, ' +
      'Mr Watzisname\'s hammock (left), Silky\'s little yellow door, Mr Oom Boom Boom\'s ledge, the ladder up into the cloud and Moon-Face\'s round room at the top, with the slippery-slip spiralling down ' +
      'to a heap of cushions (bottom left). A bare cloud at the top is where a land arrives. Busy and detailed, so best for establishing shots and arrivals. ' +
      'Ground line: the green hills either side of the roots, feet at about y 700. Open space left of the trunk (x 60 to 440) and right of it (x 780 to 1120): room for 2 smallish actors (w 160 to 200) on each side. ' +
      'Keep faces above y 660 (captions) and keep actors off the trunk so the places stay readable.',
  },
  'moon-room': {
    art: () => moonRoom('faraway-moon-room'),
    about:
      'Inside Moon-Face\'s round room at the top of the tree: curved plank walls, a big round window onto the night clouds, a round rug, cushions heaped on both sides, ' +
      'the trapdoor where the ladder comes up (left) and the mouth of the slippery-slip (right). Ground line: the floor starts at about y 560 and the rug sits at y 600 to 740; feet at about y 650 to 700, room for 3 to 4 actors across x 250 to 950 (leave the trapdoor at left and the slide mouth at right clear). ' +
      'Cosy, a good place to start or end an adventure.',
  },
  'enchanted-wood': land(
    1,
    'faraway-enchanted-wood',
    'The Enchanted Wood: deep green, gold light falling in shafts through the leaves, toadstools and old trees that whisper "wisha-wisha" (two have sleepy knot-faces). A calm glade in the middle. Ground line at about y 640; room for 4 actors.',
  ),
  'topsy-turvy': land(
    2,
    'faraway-topsy-turvy',
    'The Land of Topsy-Turvy: lurid green and pink and everything upside down (houses on their roofs, trees with roots in the air, a green spiral sun). Ground line at about y 640; room for 3 to 4 actors.',
  ),
  goodies: land(
    3,
    'faraway-goodies',
    'The Land of Goodies: pink and mint sweets, toffee-shock trees, a lemonade fountain, a wobbly jelly hill, lollipop flowers and a candy-striped path. Ground line at about y 640; room for 4 actors on the path.',
  ),
  'snap-school': land(
    4,
    'faraway-snap-school',
    'Dame Snap\'s School: a tall grey building under a bruised sky, narrow windows (one lit with her shape in it), a stopped clock, spiked gates, little desks in the yard facing a blackboard of sums, crows on the railings. Ominous but not too dark to see. Ground line at about y 640 (the yard); room for 3 actors.',
  ),
  birthdays: land(
    5,
    'faraway-birthdays',
    'The Land of Birthdays: warm gold light, bunting between poles, balloons, a heap of presents, a long party table and a giant three-tier cake with candles. Ground line at about y 640; room for 4 actors.',
  ),
  giants: land(
    6,
    'faraway-giants',
    'The Land of Giants: everything is enormous. We stand at the foot of a giant\'s table (its leg like a trunk), a giant teacup on the grass big enough to hide in, giant buttons and, far off, a pair of giant boots. Ground line at about y 640; room for 3 tiny actors.',
  ),
  spells: land(
    7,
    'faraway-spells',
    'The Land of Spells: a deep violet starry sky, the Enchanter\'s crooked tower with glowing windows, a crescent moon, glowing toadstools and bubbling potion bottles. A little eerie but beautiful. Ground line at about y 640; room for 3 actors.',
  ),
  toys: land(
    8,
    'faraway-toys',
    'The Land of Toys: a toy town on a nursery floor with wooden-block houses, a toy fort, a wind-up train on its track, stacks of blocks, a spinning top and a jack-in-the-box. Bright primaries. Ground line at about y 640; room for 4 actors.',
  ),
  snow: land(
    9,
    'faraway-snow',
    'The Land of Snow: blue-white and hushed, with soft drifts, snowy firs, a frozen pond, still snowflakes and a frozen clock tower with icicles (stopped at a quarter past eleven). Ground line at about y 640; room for 4 actors. Pair with k.ambient("snow").',
  ),
  'snap-prison': land(
    10,
    'faraway-snap-prison',
    'Dame Snap\'s Prison: the scariest place (scary, never gory). A stone hall under a huge pale moon through a barred window, a corridor into the dark with her rules nailed along the walls, chains, keys, cold lanterns and iron bars across the front. Only for Dame Snap stories. Ground line at about y 640; room for 3 actors.',
  ),
  shoe: land(
    11,
    'faraway-shoe',
    'The Old Woman\'s Shoe: a buttercup meadow under a soft blue sky with a gigantic old lace-up boot as a house (windows cut in the leather, a chimney, a washing line of tiny socks), a veg patch and small children. The boot is back and to the right; the middle of the lower stage is open grass. Ground line at about y 640; room for 4 actors.',
  ),
  music: land(
    12,
    'faraway-music',
    'The Land of Music, Mr Oom Boom Boom\'s own: teal, brass gold and cream, a striped bandstand, a tuba house, a drum-shaped hut, trumpet flowers, still music notes on strings, rows of band chairs and an empty stand where the big drum belongs. The middle of the lower half is a calm cream path. Ground line at about y 640; room for 4 actors.',
  ),
  roundabouts: land(
    13,
    'faraway-roundabouts',
    'The Land of Roundabouts: an old-fashioned fairground in orange, cream, red and teal stripes with a carousel, a helter-skelter, a big wheel, teacups, bunting and signposts. The middle of the ground is bare. Held still. Ground line at about y 640; room for 4 actors.',
  ),
  'goblin-caves': land(
    14,
    'faraway-goblin-caves',
    'The Red Goblins\' caves: dark reds and earthy browns lit by warm lanterns and glowing mushrooms, heaps of goblin gold, big scales, jugs and a cauldron, tunnels leading off and a rope ladder up to a patch of daylight. Gloomy but never too dark for the puppets; the centre-lower stage is open and warm. Ground line at about y 640; room for 3 actors.',
  ),
  'cloud-top': {
    art: cloudTop,
    about:
      'Above the cloud at dusk, from the top of the ladder: where every land arrives. A sea of cloud, the low sun, the ladder poking up on the left (x 100 to 190) and the top of the tree\'s leaves on the right. ' +
      'The middle of the sky (x 260 to 920, y 80 to 440) is open for a land\'s far view (a `far-<land>` prop, about x 290, y 160, w 600). Actors stand in the cloud along the bottom: put their busts\' bottoms below y 650 and lay the `cloud-front` prop (x 0, y 600, z above them) in front. Room for 3 actors.',
  },
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

const small = (id: string, about: string, size: [number, number] = [120, 120]): PropDef => ({ art: () => prop(id), size, about });
const ks = (id: string, label: string, about: string): PropDef => ({ art: () => keepsake(id, label), size: [150, 150], about });

const props: Record<string, PropDef> = {
  'pop-biscuit': small('popBiscuit', 'Silky\'s pop biscuit: a crimped honey biscuit with a pink iced middle.'),
  'toffee-shock': small('toffee', 'A toffee shock: a toffee in a gold wrapper twisted at both ends.'),
  acorn: small('acorn', 'An acorn in a dark brown cup.'),
  saucepan: small('saucepan', 'A steel saucepan with a long black handle (the Saucepan Man\'s).'),
  toadstool: small('toadstool', 'A red toadstool with white spots.'),
  apple: small('apple', 'A green apple with a leaf.'),
  cushion: small('cushion', 'A puffy purple cushion with gold tassels (for the slippery-slip).'),
  teacup: small('teacup', 'A china teacup on a blue saucer.'),
  'top-hat': small('hat', 'A tall black top hat with a red band.'),
  'google-bun': small('googleBun', 'A Google Bun: a round golden bun with white icing and a cherry.'),
  jelly: small('jelly', 'A raspberry jelly from a tiered mould, on a plate.'),
  candle: small('candle', 'A birthday candle with a yellow flame.'),
  balloon: small('balloon', 'A red party balloon on a string.'),
  stick: small('stick', 'A twig with a leaf.'),
  button: small('button', 'A big teal button with four holes.'),
  potion: small('potion', 'A round bottle of magenta potion with a cork.'),
  'toy-soldier': small('soldier', 'A toy soldier: black busby, red coat, white belts.'),
  teddy: small('teddy', 'A sitting teddy bear.'),
  snowball: small('snowball', 'A snowball.'),
  sledge: small('sledge', 'A green sledge on gold runners.'),
  icicle: small('icicle', 'An icicle hanging from a lip of snow.'),
  'brass-key': small('key', 'An old brass key.'),

  'moon-lamp': ks('moonLamp', 'Moon-Face\'s lamp', 'Moon-Face\'s little lamp: a glowing round face on a wooden stand.'),
  nightcap: ks('nightcap', 'Mr Watzisname\'s nightcap', 'Mr Watzisname\'s pale blue nightcap with white stripes and little Zs.'),
  'pixie-cap': ks('pixieCap', 'The Angry Pixie\'s cap', 'The Angry Pixie\'s green pointed cap with a red band and a gold bobble.'),
  peg: ks('peg', 'Dame Washalot\'s peg', 'A peg on a washing line, holding a sock.'),
  lemonade: ks('lemonade', 'A jug of lemonade', 'A jug of lemonade with a lemon slice and a straw.'),
  'biscuit-tin': ks('biscuitTin', 'A biscuit tin', 'Silky\'s teal biscuit tin, lid off, pop biscuits inside.'),
  blackboard: ks('blackboard', 'A blackboard', 'A green blackboard on legs with "1 + 1 = 2" in chalk (Dame Snap\'s school).'),
  bell: ks('bell', 'A school bell', 'A brass school bell.'),
  'snapped-ruler': ks('snappedRuler', 'Dame Snap\'s snapped ruler', 'A red ruler snapped in two: the sign that Dame Snap has been beaten.'),
  wand: ks('wand', 'A wand', 'A black wand with a gold star on the tip and a red grip.'),
  spellbook: ks('spellbook', 'A spellbook', 'An open spellbook with a lilac wisp curling out.'),
  cauldron: ks('cauldron', 'A cauldron', 'A black cauldron on a fire, bubbling green.'),
  'magic-hat': ks('magicHat', 'A magic hat', 'A deep blue wizard\'s hat with a gold star and a moon.'),
  'snow-globe': ks('snowGlobe', 'A snow globe', 'A snow globe with a fir tree in it.'),
  lantern: ks('lantern', 'A lantern', 'An iron lantern with a lit candle (the prison).'),
  padlock: ks('padlock', 'A padlock', 'A big steel padlock with a brass keyhole.'),
  crown: ks('crown', 'A crown', 'A gold crown with three jewels.'),
  'silky-ribbon': ks('silkyRibbon', 'Silky\'s ribbon', 'A gold bow of ribbon from Silky\'s hair.'),
  drum: ks('drum', 'A toy drum', 'A red toy drum with two drumsticks.'),
  rulebook: ks('rulebook', 'Dame Snap\'s rulebook', 'Dame Snap\'s black book of rules, with a red "!".'),
  'cloud-front': { art: cloudFront, size: [1180, 220], about: 'A strip of cloud (1180 × 220) to lay in front of actors up in the sky, so they stand in the cloud: x 0, y 600, z above them (goes with `cloud-top`).' },
  kettle: { art: kettle, size: [180, 160], about: 'The Saucepan Man\'s whistling kettle: round, copper, a curly spout. Part `lid` bobs when it whistles (pivot it).' },
  ...LAND_FARS,
};

export default defineWorld({
  id: 'faraway',
  name: 'The Faraway Tree',
  accent: C.greenDark,
  about:
    'The Magic Faraway Tree (Enid Blyton\'s, in our own torn-paper style), the world of the maths game. Tone: cosy, funny and warm, with a good scary villain.\n' +
    'SETTING. A huge enchanted tree in the Enchanted Wood. Beth, Joe and Fran (and Mum and Dad, Polly and Tim) have moved to the countryside nearby and climb it. ' +
    'Up the trunk, bottom to top: the door in the roots, Dame Washalot\'s tub, the Angry Pixie\'s window, Mr Watzisname\'s branch, Silky\'s door, Mr Oom Boom Boom\'s ledge, ' +
    'the ladder through the cloud, and Moon-Face\'s round room at the very top. The slippery-slip spirals all the way down round the trunk to a heap of cushions.\n' +
    'THE LANDS. Every so often a different LAND arrives in the cloud at the top of the ladder (the Enchanted Wood, Topsy-Turvy, Goodies, Birthdays, Giants, Spells, Toys, Snow, ' +
    'the Old Woman\'s Shoe, Music, Roundabouts, the Red Goblins\' caves, and Dame Snap\'s School and Prison). Lands are exciting and dangerous to stay in: they stay a while and then MOVE ON, ' +
    'taking anyone still inside with them, so the heroes must be back on the ladder before it goes. The heroes always get out in time: the clouds swirl closer for drama but never catch them.\n' +
    'THE FOLK. Moon-Face (host), Silky (kind fairy and helper), the Saucepan Man (mishears everything), Dame Washalot (always washing), Mr Watzisname (always asleep), ' +
    'the Angry Pixie (shouts, but kind) and Mr Oom Boom Boom (drummer). Visitors from the lands appear when their land is at the top.\n' +
    'RULES. Dame Snap is the villain and returns again and again; she hates sums done well. She looms, shrieks, stomps and snaps rulers, locks doors and cages, but NEVER hits, slaps or hurts anyone. ' +
    'Nobody is lost for good: anyone she takes is rescued by the end of the episode, and no parent is in real danger. Her defeat is funny or fair (her ruler snaps, she is stuck in her own cupboard). ' +
    'Scary scenes belong in stories, then cut back to the heroes. The Red Goblins and the Jelly Goblin are comic menaces who sneak and grab but hurt nobody. ' +
    'Maths shows up in the story (counting pop biscuits, measuring giant footsteps), and the child watching is the hero, so characters talk to {name}.',
  characters,
  backdrops,
  props,
});
