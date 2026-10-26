/**
 * The Wishing-Chair: Enid Blyton's flying chair, in our own torn-paper
 * style. Mollie and Peter, the pixie Jigs, the chair itself, and the
 * places it flies them to.
 *
 * The pixie is called Jigs here, always (never the name in the old books).
 */
import { C } from '../../art/palette';
import { defineWorld } from '../types';
import { wishingChair, wishingChairFront } from './chair';
import { giantCastle } from './castle';
import { mollie, peter } from './children';
import { grumble, grumbleBeam, grumbleRoar, grumbleSleep } from './grumble';
import { jigs, umbrella, umbrellaBlown } from './jigs';
import { giantKitchen } from './kitchen';
import { playroom } from './playroom';
import { curiosityShop } from './shop';
import { wishingSky } from './sky';
import { grim, grimBack, grimDizzy, grimLaugh, grimShout } from './grim';
import { grimSchoolroom, schoolCupboard } from './schoolroom';
import { openSea } from './sea';
import { whale, whaleBack, whaleBackFront, whaleHappy, whaleSleep } from './whale';
import { muddle, muddleCosy, muddleCross, muddleSneeze } from './muddle';
import { enchanterTower } from './tower';
import { gardenNight, starCloud } from './nightplaces';
import { littleStar, starKeeper, starKeeperCross, starKeeperKind } from './starkeeper';
import { goblinMarket } from './market';
import { slyboots, slybootsFlop, slybootsGrab, slybootsShout } from './slyboots';
import { jackFrost, jackFrostHappy, jackFrostLaugh, jackFrostSulk } from './jackfrost';
import { snowLand } from './snowland';
import { dabble, dabbleHappy, dabblePaint, dabbleSad } from './dabble';
import { bluster, blusterBeam, blusterBlow, blusterSulk } from './bluster';
import { rainbowEnd } from './rainbowend';
import { dragonHill } from './dragonhill';
import { puff, puffGrin, puffRoar, puffSad } from './puff';
import { hazel, hazelFlying, hazelFlyingCat, hazelHappy, hazelWorried } from './hazel';
import { midnight, midnightPurr, midnightScared } from './midnight';
import { whisperingWood } from './whisperingwood';
import { jackInBox, jackInBoxBoing, jackInBoxGrin, jackInBoxSulk, jackBox } from './jackinbox';
import { brass, brassSalute, brassWorried } from './brass';
import { toylandStation, toyCupboard } from './toyland';
import { toyTrain, toyTruck, toyTruckFront } from './toytrain';

export default defineWorld({
  id: 'wishing',
  name: 'The Wishing-Chair',
  accent: C.coatRed,
  about: [
    'The Wishing-Chair (Enid Blyton’s, in our own torn-paper style). Tone: cosy and full of wonder, a little bit daring, with now and then a grumpy giant or a cross enchanter who is more silly than scary.',
    'SETTING. Mollie and Peter bought a little red chair from an odd little shop as a present for Mum. It is magic: now and then it grows small red wings on its legs and flies wherever they wish. It lives in their playroom at the bottom of the garden, a wooden room with a big window and double doors onto the garden. Jigs, a pixie they rescued from a cloud on their first flight, lives in the playroom too and looks after the chair.',
    'THE CHAIR. It flies only when its wings are out, and the wings come and go as they please: they tire, droop and fold away after a long flight, so the friends must always get home before they go. You ride it with Mollie and Peter side by side on the seat and Jigs perched on an arm (the chairRide set piece). It creaks happily when it is pleased and wriggles its legs when it wants to fly.',
    'RULES. Grown-ups never see the chair fly, and the friends keep it a secret (Mum is safe at home, never in danger). Giants loom, roar and stomp, enchanters are cross and muddled, but nobody is hit or hurt, and anyone taken is rescued by the end of the episode. Every adventure ends back in the playroom, safe and warm. The friends talk to each other, never to the child watching.',
  ].join('\n'),
  characters: {
    mollie: {
      name: 'Mollie',
      art: mollie,
      parts: ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'armL', 'armR', 'hair'],
      about: 'About eight: two long fair plaits with blue ribbons, a yellow cardigan over a blue dress. Sensible and kind; the one who thinks of a plan and says “Let’s be brave.” Loves the chair like a pet and pats it.',
      voice: 'A bright, warm English girl of about eight; clear and kind, a little bit bossy in a nice way.',
    },
    peter: {
      name: 'Peter',
      art: peter,
      parts: ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'armL', 'armR'],
      about: 'About nine: short dark-brown hair with a tuft at the front, a green jumper with a white collar. Daring and excited, first to say “Let’s go!”, a bit of a show-off, but he always looks after Mollie and Jigs.',
      voice: 'An eager English boy of about nine; quick and excited, a little breathless.',
    },
    jigs: {
      name: 'Jigs',
      art: jigs,
      parts: ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'armL', 'armR', 'hat', 'ears'],
      about: 'A merry little pixie with big pointed ears, a tall yellow pointed hat with a tiny bell, a brown jerkin with a leafy collar. No wings: he rides the chair. Quick, cheeky and loyal; knows all about magic and the chair’s moods. Carries a red spotty umbrella. Says “Jumping jigs!” when surprised.',
      voice: 'A quick, light, cheeky young-sounding pixie; a lilting English country voice, giggly.',
    },
    grumble: {
      name: 'Giant Grumble',
      art: grumble,
      poses: { roar: grumbleRoar, sleep: grumbleSleep, beam: grumbleBeam },
      parts: ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'hand'],
      about: 'A huge, grumpy giant with a bushy grey beard, wild eyebrows and a big red nose; so big that only his face and one hand fit in the picture. Roars “SHINIER!” and stomps (pose roar), sleeps (sleep) and beams when pleased (beam), but he is more silly than scary: he is grumpy because he is tired, and he never hurts anyone. Always show him big, looking down.',
      voice: 'Very deep, slow and booming, grumbly and huffy; a big old grump with a hidden soft side.',
    },
    grim: {
      name: 'Mr Grim',
      art: grim,
      poses: { shout: grimShout, dizzy: grimDizzy, laugh: grimLaugh, back: grimBack },
      parts: ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'armL', 'armR', 'hat'],
      about: 'Mr Grim, headmaster of Mr Grim’s School for Bad Brownies: a tall, thin, stern old brownie with a long pointed nose, bushy black brows, little round spectacles, a long pointed grey beard, pointy ears, a black gown with a plum lining and a black mortarboard (part hat: tip it, slide it, lift it). His long ruler is part of armR, so raising the arm raises it. Barks “SILENCE!” and smacks his ruler down, but never touches anyone: strict, pompous and more silly than scary. Poses: shout (brows down, mouth wide, ruler high), dizzy (swirly eyes, hat askew), laugh (crescent eyes, a big laugh), back (seen from behind, writing on the blackboard; no face, so he can’t speak in it).',
      voice: 'Dry, clipped, stern old schoolmaster; a thin sharp voice that barks when he shouts, a bit pompous and fussy, cracking into a wheezy, surprised giggle when he laughs.',
    },
    whale: {
      name: 'Old Barnacle',
      art: whale,
      poses: { sleep: whaleSleep, happy: whaleHappy },
      chip: '20 50 270 240',
      parts: ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen'],
      about: 'Old Barnacle, a huge, slow, booming whale, grey-blue and covered in barnacles. Asleep he looks like a little island (the whale-back prop: a sandy hump with one palm tree). The portrait is his head raised out of the sea, facing left, with one big sleepy eye glancing back over his shoulder (the lids part starts hidden: set it to opacity 1, then fade it out to open the eye) and a wide mouth that talks. Poses: sleep (eye shut, snoozing smile), happy (eye crescent, big grin). Grumpy only because something itches, and kind underneath: he booms and spouts but never hurts anyone. Always show him big.',
      voice: 'Very deep, slow and booming, a huffy old grump with a soft heart; long sleepy vowels, a rumbling chuckle when he is pleased.',
    },
    muddle: {
      name: 'Enchanter Muddle',
      art: muddle,
      poses: { sneeze: muddleSneeze, cross: muddleCross, cosy: muddleCosy },
      parts: ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'armL', 'armR', 'hat'],
      about: 'Enchanter Muddle: a plump, kind, very muddled old enchanter in a tall crooked purple hat with silver moons, a long white beard with a goose quill stuck in it, a starry purple robe and a big red runny nose. He means well and gets everything in a muddle; when he sneezes, his spells fly out. Poses: sneeze (head back, eyes shut, mouth wide), cross (brows down, fists up, hat askew: cross by accident, never really angry), cosy (wrapped in a stripy scarf, smiling). The hat is part hat (let it rise or wobble). Never cruel, always sorry afterwards.',
      voice: 'A warm, wobbly, fussy old man, a little nasal and sniffly from a cold; kind and flustered (“Oh dear, oh dear!”), booming when cross but never frightening.',
    },
    starKeeper: {
      name: 'The Star-Keeper',
      art: starKeeper,
      poses: { cross: starKeeperCross, kind: starKeeperKind },
      parts: ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'armL', 'armR', 'hat'],
      about: 'The Star-Keeper: a small, round old man of the sky with a pink face, round spectacles, a bushy white moustache, a long silver beard tucked into his belt, a midnight-blue coat and floppy nightcap sprinkled with tiny gold stars, and a brass lantern in his right hand (it goes with armR). Fussy and short-tempered at first, a bit pompous (the plain portrait, lantern held low), then twinkly and kind. Poses: cross (lantern raised high, brows down: booms out of the dark), kind (smiling, hands clasped). He gets cross only because he is worried about his stars, and is quick to say sorry. Never hurts anyone.',
      voice: 'A fussy, grandfatherly old man; gruff and booming when cross, then soft, warm and twinkly when kind; gentle, a little creaky.',
    },
    littleStar: {
      name: 'The little star',
      art: littleStar,
      parts: ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen'],
      about: 'A little soft-yellow star with a halo, big shy eyes and a small smile, no arms or legs. Speaks in a tiny, sweet voice, only a few short soft words at a time. Brave and grateful, never cross. Show it small (w 120 to 200).',
      voice: 'A tiny, sweet, silvery child-like voice, very soft and shy, a little sleepy.',
    },
    slyboots: {
      name: 'Old Slyboots',
      art: slyboots,
      poses: { shout: slybootsShout, grab: slybootsGrab, flop: slybootsFlop },
      parts: ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'armL', 'armR', 'hat'],
      about: 'Old Slyboots, the pedlar of the Goblin Market: a tall, thin hobgoblin with a green face, a long hooked nose, narrow sly eyes, a battered tall hat with a teal feather (part hat), a patched purple coat and a huge pack on his back hung with pots, ribbons and a lantern. Greedy and sneaky, with a loud market voice: calls his wares, snaps “Got any MONEY? Then shoo!” and “MINE!”, but he only looms and grabs at things, never at people: more silly than scary. Poses: shout (hand to his mouth, calling his wares), grab (hugging his money bag, greedy eyes), flop (sat in a heap, dizzy, hat over one ear).',
      voice: 'A loud, wheedling, gravelly market-trader; a fast sing-song patter when he sells, a sharp snarl when he snaps “MINE!”, a whining wail when he loses.',
    },
    jackFrost: {
      name: 'Jack Frost',
      art: jackFrost,
      poses: { laugh: jackFrostLaugh, sulk: jackFrostSulk, happy: jackFrostHappy },
      parts: ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'armL', 'armR'],
      about: 'Jack Frost, cheeky sprite of the Land of Winter: skinny, with spiky white-silver hair like icicles, a pale frost-blue face with bright blue cheeks, little pointed ears, long thin fingers and a narrow silver-blue tunic stitched with frost ferns. Freezes things for a game, never to hurt: he is really lonely, because everyone runs away from him for being too cold. Poses: the portrait (a sly smirk), laugh (wide eyes, big open icy “hee hee hee”), sulk (arms folded, worried brows, small frown), happy (wearing a red woolly scarf, delighted). Swap pose to happy once he is given a scarf. Looms by being big and high, never by hurting anyone.',
      voice: 'Crackly, quick and mischievous, a bit high and breathy like cold wind; giggly when he is pleased, small and quiet when he is sad. Never cruel.',
    },
    dabble: {
      name: 'Old Mother Dabble',
      art: dabble,
      poses: { sad: dabbleSad, paint: dabblePaint, happy: dabbleHappy },
      parts: ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'armL', 'armR', 'hat'],
      about: 'Old Mother Dabble, who paints the rainbow every day: a little round cheerful old woman with rosy cheeks, round glasses, grey curls under a floppy straw hat with a paintbrush tucked in its band (part hat), and a lilac smock spattered with every colour of paint. The plain portrait holds her big brush low. Poses: sad (empty-handed, worried), paint (the huge brush raised high, a grin), happy (arms flung wide, a beam). Chirpy and flustered, never cross.',
      voice: 'Warm, chirpy old country woman; quick and cheerful, a little flustered when things go wrong, with a bubbling laugh.',
    },
    bluster: {
      name: 'Bluster',
      art: bluster,
      poses: { blow: blusterBlow, sulk: blusterSulk, beam: blusterBeam },
      parts: ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen'],
      about: 'Bluster, a big grumpy grey storm cloud with a face: heavy frowning brows, puffed cheeks, a downturned mouth, no arms (swell him with scale to loom). Poses: blow (cheeks puffed, lips pursed, wind streaks), sulk (small, droopy, one tear of rain), beam (smiling, with a silver lining along his top). He rumbles and blows but never hurts anyone; he is cross only because nobody ever cheers for the rain. Show him big when cross, small when sulking.',
      voice: 'Deep, rumbly and grumbling, like far-off thunder; huffy and booming when cross, then small, shy and slow when sad, and a warm surprised chuckle at the end.',
    },
    puff: {
      name: 'Puff',
      art: puff,
      poses: { roar: puffRoar, sad: puffSad, grin: puffGrin },
      parts: ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'armL', 'armR', 'wingL', 'wingR', 'tooth'],
      chip: '52 36 196 204',
      about: 'Puff, a young dragon as big as a horse but a baby at heart: a round green body with a cream tummy, little orange spines and ear fins, small floppy orange wings, stubby arms, big worried eyes and ONE big white front tooth that hangs over his lip. The tooth is its own part (tooth, origin at the gum): rotate it to wobble it, fade it out when it is gone, and swap to the grin pose for the gap. He breathes grey smoke, never fire at anyone (smoke and smoke rings are the cartoon’s own one-offs). Poses: roar (head up, eyes screwed shut, mouth wide, a few tears: he is sore, not fierce), sad (head hung low, wet eyes, a wobbly frown, tooth tipped, wings drooping), grin (happy eyes, a big smile with a gap, arms and wings up). Gulpy, sniffly and shy, then giggly. Never cross, never hurts anyone. Show him big (w 300 to 380).',
      voice: 'A young, gulpy, slightly tearful boyish voice, shy and sniffly with a wobble; round and a little croaky, then bubbling into giggles when he is happy. Sweet, never growly.',
    },
    witchHazel: {
      name: 'Witch Hazel',
      art: hazel,
      poses: { worried: hazelWorried, flying: hazelFlying, flyingCat: hazelFlyingCat, happy: hazelHappy },
      parts: ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'armL', 'armR', 'hat'],
      about: 'Witch Hazel: a young, kind, scatterbrained witch in a tall floppy black hat (purple band, little gold moon), wild red curly hair, freckles, a green dress, a purple cloak with patches and stripy stockings. Never warty, never scary. Quick and flustered, she loses her words and says “Oh!” a lot, but she is brave and grateful. Her broomstick will not fly without her cat. The portrait holds her broom upright. Poses: worried (both hands to her cheeks, “oh!” mouth), flying (sat on her broom, star-tipped wand in armR: wave it for a spell), flyingCat (the same with Midnight purring on the broom in front of her: use it, not a separate Midnight, when they fly together), happy (hugging Midnight to her chest, eyes shut in a big smile; the cat is drawn in, so do not also show the Midnight actor).',
      voice: 'Young, quick and warm, a bit flustered; a bright English girl-witch of about sixteen, words tumbling over each other, giggly when she is relieved.',
    },
    midnight: {
      name: 'Midnight',
      art: midnight,
      poses: { scared: midnightScared, purr: midnightPurr },
      parts: ['figure', 'head', 'eyes', 'lids', 'mouth', 'mouthOpen', 'tail'],
      about: 'Midnight: Witch Hazel’s small fluffy black cat with big round green eyes, a pink nose, long whiskers and a silver bell on a red collar. He has NO lines: only miaows and purrs (sounds). The portrait is him sitting up, curious. Poses: scared (fur on end, eyes huge, clinging to a bit of branch), purr (curled in a contented ball, eyes shut). Part tail pivots at its root (swish it). Show him smallish (w 140 to 240). His bell tinkles when he moves.',
      voice: 'A cat: no speech. Soft miaows, a small scared mew, a rumbling purr.',
    },
    jackInBox: {
      name: 'Jack-in-the-Box',
      art: jackInBox,
      poses: { boing: jackInBoxBoing, sulk: jackInBoxSulk, grin: jackInBoxGrin },
      parts: ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'armL', 'armR', 'hat', 'spring'],
      about: 'Jack-in-the-Box, a clown-faced toy on a big curly steel spring, coming out of a red box with yellow stars: a pointed jester’s hat with three bells, a white face with a red nose and round rosy cheeks, a ruff collar. He cannot walk: he lives in his box and goes where he is carried, and the other toys always forget him. Snappy and cross when he is lonely (the portrait: a frown), then bouncy and delighted. Poses: boing (sprung up tall on a long spring, arms flung out, mouth wide: stretch the actor taller from its bottom edge for the BOING and rock the hat part to jangle the bells), sulk (squashed half into the box, arms folded, a small sad frown), grin (a big red smile, arms up). He looms by springing up, never by touching anyone.',
      voice: 'Squeaky-sharp and snappy when cross, a bit cracked and cartoonish; small and wobbly when sad; then bouncy and delighted. A boy-clown voice, never cruel.',
    },
    brass: {
      name: 'Sergeant Brass',
      art: brass,
      poses: { salute: brassSalute, worried: brassWorried },
      parts: ['figure', 'head', 'eyes', 'lids', 'brows', 'mouth', 'mouthOpen', 'armL', 'armR', 'hat'],
      about: 'Sergeant Brass, the toy-soldier engine driver of Toyland: a wooden soldier with a tall black busby hat (gold cord), round red cheek spots, a red jacket with gold buttons and white cross-belts, a curly painted moustache. Fussy, stiff and kind: marches, salutes, says “Oh dear, oh dear!” when something goes wrong. Poses: salute (hand to his busby, a proud grin), worried (brows up, round “oh” mouth, hands wringing).',
      voice: 'A fussy, plummy little man, brisk and clipped like a drill sergeant but gentle; flustered and fluttery when worried; proud and booming for “All aboard!”.',
    },
  },
  backdrops: {
    'curiosity-shop': {
      art: curiosityShop,
      about: 'The odd little shop where the Wishing-Chair was bought: dim and dusty, shelves of clocks, jars and strange old things, a counter on the right, a bright window on the left. Ground line y ≈ 640; the open floor is the middle and left (x 120–760), room for the chair and 2 actors.',
    },
    playroom: {
      art: playroom,
      about: 'Mollie and Peter’s playroom at the bottom of the garden: wooden walls, toy shelves, a rag rug, a big window on the left and double doors standing open on the right onto the garden and sky. Ground line y ≈ 640; room for the chair and 3 actors in the middle.',
    },
    'wishing-sky': {
      art: wishingSky,
      about: 'High in the sky: soft blue, big white clouds, a patchwork of tiny fields far below along the bottom. No ground: for flying. Keep the chair between y 150 and 560.',
    },
    'giant-castle': {
      art: giantCastle,
      about: 'Outside the giant’s castle on a hilltop above the clouds: grey stone walls, a vast wooden door (its bottom edge at y ≈ 640) and a huge keyhole. Ground line y ≈ 640; the open grass is left and middle, room for the chair and 3 actors.',
    },
    'giant-kitchen': {
      art: giantKitchen,
      about: 'Inside the giant’s kitchen, from a mouse’s eye: an enormous table leg on the left, a huge fireplace glowing low at the back, flagstones. The right third is clear for the giant’s face to loom in. Ground line y ≈ 640; room for 3 small actors on the left and middle.',
    },
    'grim-schoolroom': {
      art: grimSchoolroom,
      about: 'Mr Grim’s School for Bad Brownies, the schoolroom: grey stone walls, warm wood, a little gloomy but not dark. An open arched window on the left (x 50–270, y 70–420) with sky beyond: a way in for the chair. A blackboard on the back wall (x 380–800, y 120–380) with a chalk ledge and a duster, its middle (x 470–720, y 170–330) clear for chalk writing. A bare wall at x 820, y 300 for a key hook, and plain stone at x 860–1160 for the school-cupboard prop (x 870, y 200, w 280). Three low brownie desks at the front left (x 40–330, tops y 612). Ground line y ≈ 640; open floor x 300–860.',
    },
    'open-sea': {
      art: openSea,
      about: 'The open sea all round: blue-green waves, a wide summer sky, a pale sun top right, a far line of white cliffs with a red-and-white lighthouse on the left (x 0–330, at the horizon y ≈ 312) and nothing else. No ground: a whale’s back or a flying chair floats on it, waterline about y 520–580, so riders’ heads stay above y 330. Open water from x 330 to 1180.',
    },
    'enchanter-tower': {
      art: enchanterTower,
      about: 'The round room at the top of Enchanter Muddle’s tower: curved grey-violet stone walls, wooden beams, high shelves of coloured bottles, jars and old books across the back (x 330–780, shelves at y 200 and 320), a hanging lantern, a big arched window on the left (x 60–280, y 90–420) with sky beyond (a way in for the chair), a bubbling green cauldron on a low fire on the right (x 880–1110, rim y ≈ 400, painted in), and a round star rug on the floor. Ground line y ≈ 640; open floor x 300–900, room for the chair and 4 actors.',
    },
    'garden-night': {
      art: gardenNight,
      about: 'The garden at the bottom of the garden at night: the playroom’s wooden side at the left (x 0-270) with its window glowing (x 56-202, y 262-408) and a door ajar at x 226-274; a round lily pond across x 330-640, y 625-710 (stand behind it, feet on y 640); a fence and bushes behind; a deep blue sky with a few stars and one small dark gap at x 700, y 120. Ground line y ≈ 640; open ground x 300-950, room for the chair and 3 actors. Dark but readable: add k.light for faces. The pink dawn is a k.dim wash.',
    },
    'star-cloud': {
      art: starCloud,
      about: 'High among the stars on top of a silvery cloud: deep blue sky, many stars hanging on thin silver threads (all above y 340 or at the edges), one empty silver hook at x 905, y 215 and a tall thin silver ladder leaning on nothing (foot x 800, y 610 up to the hook, top x 880, y 250). Cloud top y ≈ 600; stand actors on y ≈ 630. Room for the chair and 3 actors in the middle (x 300-850).',
    },
    'goblin-market': {
      art: goblinMarket,
      about: 'The Goblin Market in a wood clearing at dusk: a purple-and-gold sky, dark trees, a striped stall at each side (left: pots, hats and jars; right: cakes, jars and bottles), lanterns and bunting strung across the top (above y 330), toadstools along the edges. Ground line y ≈ 640; the open ground is x 280-900, room for the chair and 3 actors in front of the right stall.',
    },
    'snow-land': {
      art: snowLand,
      about: 'The Land of Winter: a pale lemon winter sky, a little ice palace with icicles on a far blue ridge (x 700-920, y 250-470), rolling snowy hills, frosted firs painted in at the left (x < 230) and right (x > 960) edges. Open snow x 250-950; ground line y ≈ 640; room for the chair and 3 actors. Pair with k.ambient("snow").',
    },
    'rainbow-end': {
      art: rainbowEnd,
      about: 'On top of the clouds where the rainbow starts: pale blue sky, a soft cloud floor (top y ≈ 620, open x 300–950), a great arch of seven GREY stripes rising from the left (foot x 60–240) and sweeping up off the top of the stage (at y 300 it is x ≈ 300–460, at y 100 about x 520–700), and a little cloud paint shed at the right (x 960–1160, y 440–660) with an empty pot rack. Lay colour over the arch with rainbowStripe(i, colour) from src/worlds/wishing/rainbowend.ts (i 0 = top/outer).',
    },
    'dragon-hill': {
      art: dragonHill,
      about: 'Dragon Hill under a soft evening sky: a pale sun sinking behind lavender hills, a tiny village of round thatched cottages far below on the left (x 30-290, bases y 495-530; the fifth cottage’s roof is at about (262, 494), see VILLAGE_SCORCH in dragonhill.ts), and a rocky mound on the right with a big dark cave mouth under a stone arch (x 845-1075, y 380-640; its dark middle about (960, 520), see CAVE_DARK). A big boulder at x 600-790 (top y 520, base y 650) to hide behind: stand on its left (x 400-580) with it between you and the cave. Two small boulders at the edges. Ground line y ≈ 640; open ground x 250-900, room for the chair and 3 actors.',
    },
    'whispering-wood': {
      art: whisperingWood,
      about: 'The Whispering Wood at night under a big round moon (upper left, x 300, y 190): blue-violet, kind, faces readable. Twisty dark trees with finger-like branches at the left (x < 230) and dim far trees; ONE VERY TALL TREE at the right (trunk x 900-1010 running off the top) with a long bare branch reaching left at y 240-280 (tip x 716) for a stuck cat, and finger-branches at y 310, 330, 440 and 470 for a chair rising past. Glowing pink, mint and amber toadstools along the edges, a mossy path winding to the front, silvery mist low down. Ground line y ≈ 640; open ground x 250-850, room for the chair and 3 actors. Add k.light for faces.',
    },
    'toyland-station': {
      art: toylandStation,
      about: 'Toyland’s little station on the morning of the Toy Fair, in bright primary colours: a far town of building-block houses with painted windows, a red-and-white striped Fair tent on the right (x 750–950, y 270–495) with a yellow pennant, bunting across the sky, a tall blue clock on a pole at the left (x 76–184, y 114–600) showing five to twelve, a little track along the back of the platform (the rail is at y 573: stand a train’s wheels on it, so its bottom is y ≈ 574), and a warm wooden platform from y 590 with a calm band of coloured blocks at the front (y 706+). At the far right on the platform stands the dull, dusty old toy cupboard (x 1020–1170, y 330–620) with a dark gap between its doors. Ground line y ≈ 640; the open platform is x 250–950, room for 4 actors in front of the train.',
    },
    'toy-cupboard': {
      art: toyCupboard,
      about: 'Inside the big old toy cupboard: dim brown planks, a crack of golden light down the left edge (x 22–60) lighting the floor, cobwebs in the top corners, a dusty top shelf (y 252) over the left with a drum, three skittles and a sleepy doll, and a grey rocking horse on the floor at the left (x 40–290, painted in). On the right three wooden ledges rise like stairs, their tops at y 570 (x 740–1200), y 470 (x 820–1200) and y 360 (x 890–1200): stand people and a toy box on them. Ground line y ≈ 640; open floor x 300–760. Dim but readable: add k.light on the actors’ faces.',
    },
  },
  props: {
    'wishing-chair': {
      art: wishingChair,
      size: [440, 400],
      about: 'The Wishing-Chair: a little red wooden armchair with a carved back and a cushion. Its wings (parts wingL, wingR) are hidden at first: fade them in (k.fade(k.part(chair, "wingL"), 1)) when it grows them. Use the chairRide set piece to put riders in it.',
    },
    'wishing-chair-front': {
      art: wishingChairFront,
      size: [440, 400],
      about: 'Only the seat front, arms and legs of the Wishing-Chair, in the same box: laid over riders so they sit in it. The chairRide set piece places it for you.',
    },
    'jigs-umbrella': { art: umbrella, size: [160, 180], about: 'Jigs’s red spotty umbrella, open the right way up, with a curly handle.' },
    'jigs-umbrella-blown': { art: umbrellaBlown, size: [160, 180], about: 'Jigs’s red spotty umbrella blown inside out by the wind.' },
    'school-cupboard': {
      art: schoolCupboard,
      size: [280, 440],
      about: 'Mr Grim’s tall dark-wood cupboard, with a brass keyhole. Its doors (parts doorL, doorR, hinged at their outer edges) open with scaleX towards 0.2 to show a big dark inside, room for the Wishing-Chair. Stands on y 640 when placed at y 200 at w 280.',
    },
    'whale-back': {
      art: whaleBack,
      size: [960, 300],
      about: 'Old Barnacle’s back as a little island, 960 × 300: a sandy top (x 236–734, y 186–244 in the prop) with one palm tree (part palm, sways), grey-blue flanks with barnacles and foam, and his tail at the far right (part tail, origin at its base; wiggles). Stand riders with their bottoms at y ≈ 232 of the prop and lay whale-back-front over them.',
    },
    'whale-back-front': { art: whaleBackFront, size: [960, 300], about: 'The near lip of sand over the whale-back’s top, same box and position, laid over riders so their bottom edges are hidden.' },
    'toy-train': {
      art: toyTrain,
      size: [360, 230],
      about: 'The Toyland Express engine, facing right: a red cab with a yellow roof, a green boiler with brass bands, a tall black chimney (top at x 306, y 24), three red wheels (parts wheel1, wheel2, wheel3 spin about their middles) and a big round brass winding-key hole (part keyhole) in the side of the boiler at (230, 126) of the prop. Its wheels’ bottom is y 228. Place the truck 244 px to its left and 70 px lower (toy-truck, toy-truck-front).',
    },
    'toy-truck': {
      art: toyTruck,
      size: [250, 170],
      about: 'The open truck behind the Toyland engine: only its far wall and floor, what is seen inside. Put whoever rides in it on top, then toy-truck-front over them (same box).',
    },
    'toy-truck-front': {
      art: toyTruckFront,
      size: [250, 170],
      about: 'The truck’s blue near wall and its two wheels (parts wheelA, wheelB), same box as toy-truck, laid over the rider so they sit in it. The wall top is at y 70 of the prop.',
    },
    'jack-box': {
      art: jackBox,
      size: [250, 170],
      about: 'Jack-in-the-Box’s box with its lid shut: red with yellow stars, a crank on the right (the box itself is x 4–216 of the prop), a little dusty. Swap it for the jackInBox character (his pose boing) when he springs out.',
    },
  },
});
