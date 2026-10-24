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
  },
});
