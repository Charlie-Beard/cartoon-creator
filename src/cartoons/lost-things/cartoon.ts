/**
 * The Land of Lost Things: Mollie has lost one of her blue hair ribbons, so
 * the Wishing-Chair flies the friends to the land where every lost thing
 * goes.
 *
 *   1. The playroom. Mollie has hunted high and low: one of her plaits has
 *      its blue bow and the other hasn't. Peter looks under the chair's
 *      cushion (only biscuit crumbs). Jigs says everything that's lost goes
 *      to the Land of Lost Things. The chair wriggles: it knows the way.
 *      Mollie and Peter hop on, "To the Land of Lost Things, please, chair!",
 *      the wings grow and off they fly.
 *   2. The Land of Lost Things. A kite flies past all by itself, then a red
 *      glove: they're lost, and going the same way. "Follow that glove,
 *      chair!" Down they come among hills and hills of lost things: socks,
 *      umbrellas, keys, kites, gloves. Peter finds an odd sock: "That's MY
 *      sock!" There's a great wobbly heap taller than a house, and a bell
 *      on a post: Jigs rings it (deed). Out of the hut bustles Mrs
 *      Muddlecup, the fussy little Keeper: "Lost things, lost things,
 *      everything in its place!" She can't see a thing: she has lost her
 *      spectacles. Mollie asks for her ribbon. "Finders keepers! Lost things
 *      stay here." And anyway she couldn't find it: no spectacles!
 *   3. The spectacles. She has looked in the teapot, in the boots,
 *      everywhere. Peter giggles: they're on top of her head! Mollie lifts
 *      them down on to her nose (deed). She can see! "Finders keepers? Oh,
 *      fiddlesticks!" Mollie found her spectacles, so Mollie shall have her
 *      ribbon. But blue ribbons are filed at the very top of the great heap.
 *      "I'll climb up," says Peter.
 *   4. The wobbly heap. Peter climbs it like steps and finds another of his
 *      socks. The heap creaks and sways. At the top he takes the ribbon
 *      (deed), and the heap leans... further... things tumble off: "It's
 *      going to fall!" Jigs runs and props it up with his spotty umbrella
 *      (deed): it stops. Peter climbs down and gives Mollie her ribbon
 *      (deed). Mrs Muddlecup beams and gives Peter a whole armful of his own
 *      odd socks, and calls goodbye.
 *   5. Home. The chair lands in the playroom. Mollie ties the ribbon back on
 *      her plait (deed): two blue bows again. Peter will never, ever lose a
 *      sock again... and one slips out of his armful and vanishes with a
 *      fwip: off to Mrs Muddlecup! "She'll file it under S, for Silly
 *      Peter!" Everyone laughs.
 *
 * Scary, never cruel (docs/STYLE.md): there's no villain. Mrs Muddlecup is
 * only fussy, and kind once she can see. The danger is the great heap
 * creaking, swaying and leaning over with Peter at the top, things tumbling
 * off (soft things, landing on the ground, never on anyone); it cuts back at
 * once to Jigs propping it up, and nobody falls.
 *
 * New in the wishing world: Mrs Muddlecup (muddlecup.ts), the lost-land
 * backdrop and the lost-heap, lost-ribbon, lost-sock, lost-socks,
 * lost-spectacles, lost-bell, lost-kite and lost-glove props (lostland.ts).
 * Mollie's missing bow is hidden on her actor here (art.ts), not redrawn;
 * the bell, the heap's creak and the sock's fwip are in sounds.ts.
 */
import { defineCartoon, type Kit } from '../../kit';
import { sounds as common } from '../../worlds/common/moves';
import { warmEnding } from '../../worlds/common/pieces';
import { moves as wishing, sounds } from '../../worlds/wishing/moves';
import { chairRide, type Ride, type Slot } from '../../worlds/wishing/pieces';
import { bowAt, ribbonOff, ribbonOn, specsAt, specsOnNose } from './art';
import meta from './meta';
import { fwip, handbell, heapCreak, tumble } from './sounds';

const { creak, hatBell, highWind } = sounds;
const { giggle, laugh } = common;

// ------------------------------------------------------------------ cast

type Name =
  | 'mollie' | 'peter' | 'jigs' | 'mrs'
  | 'kite' | 'glove' | 'sock' | 'sock2' | 'bell' | 'heap'
  | 'ribbon' | 'specs' | 'umbrella' | 'socks';
const cast = {} as Record<Name, HTMLElement>;
let ride: Ride;

/** The top of a portrait of width w whose bottom edge stands on the line y `feet`. */
const topFor = (w: number, feet = 640): number => feet - (w * 340) / 300;
const rel = (n: number): string => (n >= 0 ? `+=${n}` : `-=${-n}`);

/** The chair in the playroom (as in the other episodes). */
const PLAY_CHAIR = { x: 520, y: 255, w: 440 };
/** The great heap of lost things, standing on the ground at the right (360 × 600). */
const HEAP = { x: 800, y: 40, w: 360, z: 6 };
/** The heap's three ledges on its left side, in stage points: [middle x, top y]. */
const LEDGE: [number, number][] = [
  [HEAP.x + 95, HEAP.y + 440],
  [HEAP.x + 120, HEAP.y + 300],
  [HEAP.x + 145, HEAP.y + 170],
];
/** The flat top of the heap, where the ribbon is filed: the middle of the ribbon. */
const TOP: [number, number] = [HEAP.x + 262, HEAP.y + 34];
/** Where the heap turns when it sways: the middle of its bottom. */
const PIVOT: [number, number] = [HEAP.x + 180, HEAP.y + 600];
/** Peter's width while climbing (a little smaller than on the ground, so he fits the ledges). */
const CLIMB_W = 140;

// ----------------------------------------------------------------- helpers

/** One hop (an arc `lift` high) of everyone in `els` by (dx, dy), landing with a thud. */
async function hopBy(k: Kit, els: HTMLElement[], dx: number, dy: number, lift = 70, s = 0.5): Promise<void> {
  const up = Math.min(dy, 0) - lift;
  await k.all(...els.map((el) => k.to(el, s / 2, { x: rel(dx / 2), y: rel(up), ease: 'power1.out' })));
  await k.all(...els.map((el) => k.to(el, s / 2, { x: rel(dx / 2), y: rel(dy - up), ease: 'power1.in' })));
  k.fx.thud();
}

/** Peter (and anything he holds) hops so his bottom edge lands at stage point (x middle, feet y). */
async function hopTo(k: Kit, els: HTMLElement[], x: number, feet: number): Promise<void> {
  const b = k.box(els[0]);
  await hopBy(k, els, x - (b.x + b.w / 2), feet - (b.y + b.h), 50, 0.55);
}

/** Mollie or Peter hops up on to the chair and takes their seat there (the standing one is swapped for a rider). */
async function board(k: Kit, el: HTMLElement, id: string, slot: Slot, flip = false): Promise<HTMLElement> {
  const [sx, sy] = chairRide.seatAt(k, ride, slot);
  const b = k.box(el);
  k.fx.boing();
  await k.to(el, 0.35, { x: rel(sx - (b.x + b.w / 2)), y: rel(sy - (b.y + b.h / 2) - 90), ease: 'power1.out' });
  k.remove(el);
  return chairRide.seat(k, ride, { id, slot, flip });
}

/** The heap's lean now, in degrees (clockwise is to the right). */
let lean = 0;
/**
 * The heap sways to `deg` over `s` seconds, about the middle of its bottom,
 * and everything on it (Peter, what he holds) slides along with it.
 */
async function sway(k: Kit, deg: number, s: number, riders: HTMLElement[], ease = 'sine.inOut'): Promise<void> {
  const rad = (d: number): number => (d * Math.PI) / 180;
  const shift = (el: HTMLElement): number => {
    const b = k.box(el);
    const up = PIVOT[1] - (b.y + b.h / 2);
    return up * (Math.sin(rad(deg)) - Math.sin(rad(lean)));
  };
  const moves = riders.map((el) => k.to(el, s, { x: rel(shift(el)), ease }));
  lean = deg;
  await k.all(k.to(cast.heap, s, { rotation: deg, ease }), ...moves);
}

/** Drops a little lost thing off the top of the heap: it tumbles down to the ground beside it, landing softly. */
async function dropOff(k: Kit, id: string, from: [number, number], to: [number, number], w: number): Promise<void> {
  const el = k.prop(id, { x: from[0] - w / 2, y: from[1] - w / 2, w, z: 9 });
  await k.all(
    k.to(el, 0.9, { x: to[0] - from[0], ease: 'sine.out' }),
    k.to(el, 0.9, { y: to[1] - from[1], rotation: 200, ease: 'power2.in' }),
  );
  tumble();
}

// ------------------------------------------------------------------- script

export default defineCartoon({
  ...meta,
  lines: {
    // 1. The playroom
    morning: { who: 'narrator', text: 'One morning in the playroom, Mollie was hunting high and low.' },
    lostRibbon: { who: 'mollie', text: 'Oh, bother! I’ve lost one of my blue hair ribbons.' },
    onePlait: { who: 'peter', text: 'So you have! One plait has a bow, and the other hasn’t.' },
    crumbs: { who: 'peter', text: 'No ribbon. Only biscuit crumbs!' },
    lostThings: { who: 'jigs', text: 'Don’t worry. Everything that’s lost goes to the Land of Lost Things.' },
    whereLand: { who: 'mollie', text: 'The Land of Lost Things? Can we go?' },
    chairWriggles: { who: 'jigs', text: 'Ask the chair! Look, its legs are wriggling.' },
    toLand: { who: 'mollie', text: 'To the Land of Lost Things, please, chair!' },
    // 2. The Land of Lost Things
    kite: { who: 'peter', text: 'Look! A kite, flying all by itself!' },
    goingToo: { who: 'jigs', text: 'It’s lost. It’s going there too!' },
    glove: { who: 'mollie', text: 'And a glove! Follow that glove, chair!' },
    jumble: { who: 'mollie', text: 'Look at it all! Hills and hills of lost things!' },
    umbrellas: { who: 'jigs', text: 'Umbrellas, keys, kites, and ever so many socks!' },
    mySock: { who: 'peter', text: 'Hey! That’s MY sock! I lost it at Christmas!' },
    seeHeap: { who: 'mollie', text: 'Look at that great big heap. It’s taller than a house!' },
    bell: { who: 'jigs', text: 'A bell! I’ll ring it.' },
    lostLost: { who: 'muddlecup', text: 'Lost things, lost things, everything in its place!' },
    whoRang: { who: 'muddlecup', text: 'Who rang my bell? Oh dear, I can’t see a thing!' },
    please: { who: 'mollie', text: 'Please, I’ve lost my blue hair ribbon.' },
    finders: { who: 'muddlecup', text: 'Finders keepers! Lost things stay here. That’s the rule.' },
    cantFind: { who: 'muddlecup', text: 'And anyway, I can’t find a thing. I’ve lost my spectacles!' },
    // 3. The spectacles
    looked: { who: 'muddlecup', text: 'I’ve looked in the teapot. I’ve looked everywhere!' },
    giggle: { who: 'peter', text: 'Mollie! Look at the top of her head!' },
    onHead: { who: 'mollie', text: 'Mrs Muddlecup, your spectacles are on top of your head!' },
    onMyHead: { who: 'muddlecup', text: 'On my head? Don’t be silly, dear.' },
    letMe: { who: 'mollie', text: 'Let me get them for you. Bend down a little.' },
    canSee: { who: 'muddlecup', text: 'Oh! I can see! I can see everything!' },
    foundMine: { who: 'muddlecup', text: 'You found my spectacles, dear. So you shall have your ribbon!' },
    filed: { who: 'muddlecup', text: 'Blue ribbons are filed at the very top.' },
    wayUp: { who: 'mollie', text: 'Right at the top? But it’s so wobbly!' },
    illClimb: { who: 'peter', text: 'I’m a good climber. I’ll get it!' },
    // 4. The wobbly heap
    careful: { who: 'jigs', text: 'Careful, Peter! One step at a time.' },
    anotherSock: { who: 'peter', text: 'Look! Another one of my socks!' },
    wobbling: { who: 'muddlecup', text: 'Oh my, oh my! The heap is wobbling!' },
    holdOn: { who: 'mollie', text: 'Hold on tight, Peter!' },
    gotRibbon: { who: 'peter', text: 'Got it! Mollie’s blue ribbon!' },
    itsLeaning: { who: 'peter', text: 'Oh no! It’s leaning! It’s going to fall!' },
    umbrella: { who: 'jigs', text: 'Not if I can help it! My umbrella will prop it up!' },
    steady: { who: 'mollie', text: 'It’s stopped! Well done, Jigs!' },
    forYou: { who: 'peter', text: 'Here you are, Mollie. One blue ribbon!' },
    yourSocks: { who: 'muddlecup', text: 'And Peter, dear, I think all these socks are yours.' },
    allMySocks: { who: 'peter', text: 'All my odd socks! Thank you!' },
    goodbye: { who: 'muddlecup', text: 'Goodbye, dears! Everything in its place!' },
    // 5. Home
    homeAgain: { who: 'jigs', text: 'Home again!' },
    tieOn: { who: 'mollie', text: 'Now, ribbon, back on my plait, where you belong.' },
    twoBows: { who: 'jigs', text: 'Two blue bows again!' },
    neverLose: { who: 'peter', text: 'I’ve got all my socks back. I’ll never lose one again!' },
    vanished: { who: 'mollie', text: 'Peter! One of your socks just vanished!' },
    offAgain: { who: 'jigs', text: 'It’s gone to the Land of Lost Things!' },
    silly: { who: 'mollie', text: 'Under S, for Silly Peter!' },
    end: { who: 'narrator', text: 'And far away, Mrs Muddlecup filed one more odd sock.' },
  },
  scenes: [
    // ==================================================== 1. The playroom
    {
      name: 'The playroom',
      set(k) {
        k.backdrop('playroom');
        k.music('cosy');
        ride = chairRide.set(k, { ...PLAY_CHAIR, riders: [{ id: 'jigs', slot: 'arm', flip: true }] });
        [cast.jigs] = ride.riders;
        cast.mollie = k.character('mollie', { x: 40, y: topFor(190), w: 190 });
        cast.peter = k.character('peter', { x: 250, y: topFor(190), w: 190 });
        ribbonOff(cast.mollie);
      },
      async play(k) {
        const { mollie, peter, jigs } = cast;
        await k.say('morning');

        // Mollie's plaits: one bow, one none. A push-in while she says so.
        k.fx.sneak();
        await k.to(mollie, 0.5, { rotation: -6, yoyo: true, repeat: 1, ease: 'sine.inOut' });
        const f = k.box(mollie).face;
        await k.camera({ zoom: 1.5, x: f.cx, y: f.cy + 40 }, 1.2);
        await k.say('lostRibbon', mollie);
        await k.camera({}, 1);
        k.face(peter, true);
        await k.say('onePlait', peter);

        // Peter looks under the chair's cushion.
        k.face(peter, false);
        k.fx.patter(5, 0.14);
        await k.walk(peter, 200, 0.9, 3);
        k.sfx.rustle();
        await k.to(peter, 0.4, { rotation: 12, y: '+=30', ease: 'sine.inOut' });
        await k.wait(500);
        await k.to(peter, 0.4, { rotation: 0, y: '-=30', ease: 'sine.inOut' });
        k.face(peter, true);
        await k.say('crumbs', peter);

        // Jigs knows where lost things go.
        await k.blink(jigs);
        hatBell();
        await k.say('lostThings', jigs);
        await k.all(k.say('whereLand', mollie), k.to(mollie, 0.5, { x: '+=60' }));
        await k.all(k.say('chairWriggles', jigs), wishing.wriggle(k, ride.chair, 3));

        // All aboard: Mollie and Peter hop up on to the seat.
        const p = await board(k, peter, 'peter', 'right');
        const m = await board(k, mollie, 'mollie', 'left');
        ribbonOff(m);
        cast.mollie = m;
        cast.peter = p;
        await k.say('toLand', m);
        k.flourish(ride.chair);
        k.music('magic');
        await chairRide.wings(k, ride);
        await chairRide.flap(k, ride, 2);
        k.music('adventure');
        highWind(2);
        await chairRide.fly(k, ride, { x: 900, y: -140, s: 2, tilt: -8 });
      },
    },

    // ==================================================== 2. The Land of Lost Things
    {
      name: 'The Land of Lost Things',
      set(k) {
        k.backdrop('wishing-sky');
        k.music('adventure');
        ride = chairRide.set(k, {
          x: 300,
          y: 220,
          w: 420,
          wings: true,
          riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'arm', flip: true }],
        });
        [cast.mollie, cast.peter, cast.jigs] = ride.riders;
        ribbonOff(cast.mollie);
        chairRide.jump(k, ride, { x: -800, y: 40 });
        // Lost things flying by on their own, waiting off stage at the right.
        cast.kite = k.prop('lost-kite', { x: 1260, y: 40, w: 100, z: 9 });
        cast.glove = k.prop('lost-glove', { x: 1240, y: 230, w: 70, z: 18 });
      },
      async play(k) {
        // In over the clouds; a kite flies past by itself.
        highWind(3);
        await chairRide.fly(k, ride, { x: 0, y: 0, s: 2.2 });
        const { kite, glove } = cast;
        void k.to(kite, 6, { x: -1500, ease: 'none' });
        void k.to(kite, 1.5, { rotation: 12, yoyo: true, repeat: 3, ease: 'sine.inOut' });
        k.fx.wind(2);
        await k.wait(800);
        await k.say('kite', cast.peter);
        await k.say('goingToo', cast.jigs);

        // A glove drifts by, and the chair follows it.
        void k.to(glove, 3.2, { x: -260, ease: 'sine.out' });
        void k.to(glove, 0.8, { y: '+=24', rotation: -15, yoyo: true, repeat: 3, ease: 'sine.inOut' });
        await k.wait(1200);
        await k.say('glove', cast.mollie);
        highWind(2);
        await k.all(k.to(glove, 2, { x: 600, ease: 'sine.in' }), chairRide.fly(k, ride, { x: 1000, s: 2, flaps: 4 }));

        // Down among the hills of lost things.
        await k.cut(() => {
          k.backdrop('lost-land');
          k.music('cosy');
          cast.heap = k.prop('lost-heap', HEAP);
          cast.ribbon = k.prop('lost-ribbon', { x: TOP[0] - 35, y: TOP[1] - 23, w: 70, z: 7 });
          cast.bell = k.prop('lost-bell', { x: 236, y: 640 - 200, w: 100, z: 7 });
          cast.sock = k.prop('lost-sock', { x: 800, y: 590, w: 54, z: 9 });
          k.set(cast.sock, { rotation: -20 });
          // Mrs Muddlecup waits inside her hut, at its door.
          cast.mrs = k.character('muddlecup', { x: 340, y: topFor(180), w: 180, z: 11 });
          k.set(cast.mrs, { x: -230, opacity: 0 });
          ride = chairRide.set(k, {
            x: 330,
            y: 250,
            w: 400,
            wings: true,
            riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'arm', flip: true }],
          });
          [cast.mollie, cast.peter, cast.jigs] = ride.riders;
          ribbonOff(cast.mollie);
          chairRide.jump(k, ride, { x: 150, y: -760 });
        });
        highWind(1.5);
        await chairRide.land(k, ride);
        const { mollie, peter, jigs, sock, bell, heap, mrs } = cast;
        await k.say('jumble', mollie);
        hatBell();
        await k.say('umbrellas', jigs);

        // Everyone hops out; the chair flutters up out of the way.
        await chairRide.hopOff(k, ride, jigs, { x: 500, y: topFor(120), w: 120 });
        await chairRide.hopOff(k, ride, mollie, { x: 600, y: topFor(170), w: 170 });
        await chairRide.hopOff(k, ride, peter, { x: 770, y: topFor(170), w: 170 });
        highWind(1.5);
        await chairRide.fly(k, ride, { y: -900, s: 1.3, flaps: 3 });

        // Peter spots a sock by his feet.
        k.face(peter, true);
        k.fx.boing();
        await k.to(peter, 0.3, { y: '+=30', rotation: -8, ease: 'sine.out' });
        await k.to(sock, 0.5, { y: '-=100', x: '+=10', rotation: 0, ease: 'power2.out' });
        await k.to(peter, 0.3, { y: '-=30', rotation: 0, ease: 'sine.in' });
        await k.all(k.say('mySock', peter), k.shake(sock, 6, 3));
        await k.to(sock, 0.4, { x: '+=40', y: '+=50', scale: 0.8, ease: 'sine.inOut' });
        await k.vanish(sock);

        // The great heap.
        k.face(mollie, false);
        await k.all(k.say('seeHeap', mollie), k.camera({ zoom: 1.2, x: 860, y: 360 }, 1.6));
        await k.camera({}, 1);
        k.face(mollie, true);

        // Jigs rings the Keeper's bell.
        k.face(jigs, true);
        await k.say('bell', jigs);
        k.fx.patter(5, 0.12);
        await k.walk(jigs, -150, 0.9, 3);
        const [swing] = k.pivot(k.part(bell, 'bell'));
        handbell(3);
        await k.to(swing, 0.32, { rotation: 22, yoyo: true, repeat: 3, ease: 'sine.inOut' });
        k.flourish(bell);
        k.face(jigs, false);
        await k.walk(jigs, 150, 0.8, 3);
        k.face(jigs, true);
        await k.wait(400);

        // Out of her hut bustles the Keeper.
        k.fx.creak();
        k.fx.patter(6, 0.12);
        await k.to(mrs, 1, { x: 0, opacity: 1, ease: 'sine.out' });
        await k.say('lostLost', mrs);
        k.pose(mrs, 'fluster');
        await k.all(k.say('whoRang', mrs), k.shake(mrs, 4, 2));
        k.pose(mrs, 'default');
        await k.say('please', mollie);
        k.pose(mrs, 'cross');
        k.fx.stomp(1);
        await k.say('finders', mrs);
        k.pose(mrs, 'fluster');
        await k.all(k.say('cantFind', mrs), k.shake(mrs, 5, 3));
        void heap;
      },
    },

    // ==================================================== 3. The spectacles
    {
      name: 'The spectacles',
      set(k) {
        k.backdrop('lost-land');
        k.music('cosy');
        cast.heap = k.prop('lost-heap', HEAP);
        cast.ribbon = k.prop('lost-ribbon', { x: TOP[0] - 35, y: TOP[1] - 23, w: 70, z: 7 });
        cast.bell = k.prop('lost-bell', { x: 236, y: 640 - 200, w: 100, z: 7 });
        cast.mrs = k.character('muddlecup', { x: 340, y: topFor(180), w: 180, z: 11, pose: 'fluster' });
        cast.jigs = k.character('jigs', { x: 500, y: topFor(120), w: 120, z: 12, flip: true });
        cast.mollie = k.character('mollie', { x: 600, y: topFor(170), w: 170, z: 13, flip: true });
        cast.peter = k.character('peter', { x: 770, y: topFor(170), w: 170, z: 14, flip: true });
        ribbonOff(cast.mollie);
      },
      async play(k) {
        const { mrs, jigs, mollie, peter, ribbon } = cast;
        await k.all(k.say('looked', mrs), k.shake(mrs, 4, 2));

        // Peter spots them first.
        giggle();
        await k.all(k.say('giggle', peter), k.shake(peter, 4, 3));
        const at = specsAt(k, mrs);
        k.sparkle(at.head[0], at.head[1], 8, 70);
        k.fx.twinkle();
        await k.wait(600);
        k.pose(mrs, 'default');
        await k.say('onHead', mollie);
        k.pose(mrs, 'cross');
        await k.say('onMyHead', mrs);

        // Mollie lifts them down on to her nose.
        k.music('magic');
        await k.say('letMe', mollie);
        k.fx.patter(4, 0.12);
        await k.all(k.to(mollie, 0.8, { x: -110, ease: 'sine.inOut' }), k.to(jigs, 0.8, { x: 135, ease: 'sine.inOut' }));
        k.pose(mrs, 'default');
        k.set(mrs, { transformOrigin: '50% 100%' });
        await k.to(mrs, 0.5, { rotation: 6, y: '+=20', ease: 'sine.inOut' });
        const s = specsAt(k, mrs);
        const h = (s.w * 50) / 120;
        const specs = k.prop('lost-spectacles', { x: s.head[0] - s.w / 2, y: s.head[1] - h / 2, w: s.w, z: 20 });
        k.set(k.part(mrs, 'specs'), { opacity: 0 });
        await k.all(k.hop(mollie, 30, 1), k.to(specs, 0.4, { y: '-=40', ease: 'power1.out' }));
        await k.to(mrs, 0.5, { rotation: 0, y: '-=20', ease: 'sine.inOut' });
        await k.carry(specs, specsAt(k, mrs).nose, 0.8);
        k.remove(specs);
        k.pose(mrs, 'beam');
        specsOnNose(k, mrs);
        k.fx.boing();
        await k.hop(mrs, 30, 1);
        await k.say('canSee', mrs);
        await k.say('foundMine', mrs);

        // But blue ribbons are filed at the very top.
        k.music('cosy');
        k.pose(mrs, 'default');
        specsOnNose(k, mrs);
        await k.say('filed', mrs);
        await k.camera({ zoom: 1.6, x: 1000, y: 230 }, 1.6);
        k.fx.twinkle();
        k.sparkle(TOP[0], TOP[1], 10, 90);
        await k.shake(ribbon, 5, 3);
        await k.wait(500);
        await k.camera({}, 1.2);
        await k.say('wayUp', mollie);
        k.face(peter, false);
        await k.all(k.say('illClimb', peter), k.to(peter, 0.4, { x: '+=0' }));
        await k.hop(peter, 40, 1);
      },
    },

    // ==================================================== 4. The wobbly heap
    {
      name: 'The wobbly heap',
      set(k) {
        k.backdrop('lost-land');
        k.music('adventure');
        lean = 0;
        cast.heap = k.prop('lost-heap', HEAP);
        k.set(cast.heap, { transformOrigin: '50% 100%' });
        cast.ribbon = k.prop('lost-ribbon', { x: TOP[0] - 35, y: TOP[1] - 23, w: 70, z: 7 });
        cast.sock2 = k.prop('lost-sock', { x: LEDGE[0][0] + 20, y: LEDGE[0][1] - 54, w: 46, z: 8 });
        cast.bell = k.prop('lost-bell', { x: 236, y: 640 - 200, w: 100, z: 7 });
        cast.mrs = k.character('muddlecup', { x: 330, y: topFor(180), w: 180, z: 11 });
        specsOnNose(k, cast.mrs);
        cast.mollie = k.character('mollie', { x: 515, y: topFor(170), w: 170, z: 12 });
        ribbonOff(cast.mollie);
        cast.jigs = k.character('jigs', { x: 690, y: topFor(120), w: 120, z: 13 });
        cast.umbrella = k.prop('jigs-umbrella', { x: 630, y: 520, w: 100, z: 14 });
        k.set(cast.umbrella, { rotation: -20 });
        cast.peter = k.character('peter', { x: 830, y: topFor(CLIMB_W), w: CLIMB_W, z: 16 });
      },
      async play(k) {
        const { mrs, mollie, jigs, peter, heap, ribbon, sock2, umbrella } = cast;
        await k.say('careful', jigs);

        // Up to the first ledge, where there's a sock.
        await hopTo(k, [peter], LEDGE[0][0], LEDGE[0][1]);
        k.face(peter, true);
        await k.say('anotherSock', peter);
        await k.to(sock2, 0.4, { x: '-=40', y: '-=30', scale: 0.7, ease: 'sine.inOut' });
        await k.vanish(sock2);
        k.face(peter, false);

        // Up to the second: the heap creaks and sways.
        await hopTo(k, [peter], LEDGE[1][0], LEDGE[1][1]);
        heapCreak(1.4);
        await sway(k, -3, 0.7, [peter]);
        await sway(k, 2, 0.8, [peter]);
        k.pose(mrs, 'fluster');
        specsOnNose(k, mrs);
        await k.all(k.say('wobbling', mrs), sway(k, 0, 0.7, [peter]));
        await k.say('holdOn', mollie);

        // Up to the top ledge, and the ribbon.
        await hopTo(k, [peter], LEDGE[2][0], LEDGE[2][1]);
        await k.to(ribbon, 0.4, { y: '-=20', ease: 'sine.out' });
        await k.carry(ribbon, [LEDGE[2][0] + 40, LEDGE[2][1] - 60], 0.7);
        ribbon.style.zIndex = '20';
        await k.say('gotRibbon', peter);

        // Uh-oh: the heap leans over... further...
        k.silence();
        heapCreak(2);
        k.fx.rumble(2);
        await sway(k, -4, 1.2, [peter, ribbon]);
        k.music('spooky');
        void dropOff(k, 'lost-glove', [HEAP.x + 300, HEAP.y + 120], [HEAP.x + 330, 610], 50);
        await sway(k, -7, 1.2, [peter, ribbon]);
        await k.all(k.shake(peter, 5, 3), k.shake(mollie, 5, 2), k.shake(mrs, 5, 2));
        await k.camera({ zoom: 1.4, x: 900, y: 260 }, 0.9);
        heapCreak(1.2);
        await k.all(k.say('itsLeaning', peter), sway(k, -8, 1.4, [peter, ribbon]));
        void dropOff(k, 'lost-sock', [HEAP.x + 200, HEAP.y + 260], [HEAP.x - 40, 615], 46);
        await k.camera({}, 0.8);

        // Jigs props it up with his umbrella.
        k.music('adventure');
        hatBell();
        await k.say('umbrella', jigs);
        k.fx.patter(6, 0.1);
        await k.all(k.walk(jigs, 40, 0.6, 2), k.to(umbrella, 0.6, { x: 60, ease: 'sine.inOut' }));
        k.sfx.whoosh();
        umbrella.style.zIndex = '17';
        await k.to(umbrella, 0.3, { rotation: 50, ease: 'power2.out' });
        await k.carry(umbrella, [HEAP.x + 24, 560], 0.6);
        k.fx.thud();
        heapCreak(0.8);
        await sway(k, -2, 1, [peter, ribbon], 'power2.out');
        k.flourish(heap);
        await k.wait(500);
        await k.all(k.say('steady', mollie), k.hop(mollie, 30, 1));
        await k.walk(jigs, -60, 0.6, 2);

        // Peter climbs down, and gives Mollie her ribbon.
        k.music('cosy');
        k.face(peter, true);
        await hopTo(k, [peter, ribbon], LEDGE[1][0] - 10, LEDGE[1][1]);
        await hopTo(k, [peter, ribbon], LEDGE[0][0] - 20, LEDGE[0][1]);
        await hopTo(k, [peter, ribbon], 900, 640);
        await k.say('forYou', peter);
        await k.carry(ribbon, k.box(mollie).feet.map((v, i) => (i ? v - 40 : v)) as [number, number], 0.8);
        ribbon.style.zIndex = '20';
        await k.hop(mollie, 30, 1);

        // A whole armful of socks for Peter.
        k.pose(mrs, 'beam');
        specsOnNose(k, mrs);
        await k.say('yourSocks', mrs);
        const b = k.box(mrs);
        const socks = k.prop('lost-socks', { x: b.x + 120, y: b.y + 90, w: 110, z: 20 });
        k.set(socks, { opacity: 0 });
        await k.appear(socks);
        await k.carry(socks, [k.box(peter).feet[0], 605], 1.1);
        k.fx.thud();
        await k.all(k.say('allMySocks', peter), k.hop(peter, 0, 1));
        laugh();
        await k.all(k.say('goodbye', mrs), k.to(mrs, 0.4, { x: '+=0' }));

      },
    },

    // ==================================================== 5. Home
    {
      name: 'Home',
      set(k) {
        k.backdrop('playroom');
        k.music('cosy');
        ride = chairRide.set(k, {
          ...PLAY_CHAIR,
          wings: true,
          riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'arm', flip: true }],
        });
        [cast.mollie, cast.peter, cast.jigs] = ride.riders;
        ribbonOff(cast.mollie);
        chairRide.jump(k, ride, { x: 760 });
      },
      async play(k) {
        const { mollie, peter, jigs } = cast;
        highWind(2);
        await k.all(chairRide.fly(k, ride, { x: 0, s: 2.6, flaps: 4 }), k.wait(1000).then(() => k.say('homeAgain', jigs)));
        await chairRide.land(k, ride);
        creak();

        // Out they hop; Peter with his socks, Mollie with her ribbon.
        await chairRide.hopOff(k, ride, mollie, { x: 60, y: topFor(190), w: 190 });
        await chairRide.hopOff(k, ride, peter, { x: 270, y: topFor(190), w: 190 });
        const socks = k.prop('lost-socks', { x: 300, y: 562, w: 130, z: 22 });
        const ribbon = k.prop('lost-ribbon', { x: 190, y: 560, w: 70, z: 22 });
        k.set([socks, ribbon], { opacity: 0 });
        await k.all(k.appear(socks), k.appear(ribbon));
        await chairRide.hopOff(k, ride, jigs, { x: 490, y: topFor(130), w: 130 });
        k.face(jigs, true);

        // Mollie ties the ribbon back on her plait.
        await k.say('tieOn', mollie);
        await k.carry(ribbon, bowAt(k, mollie), 0.9);
        k.remove(ribbon);
        await ribbonOn(k, mollie);
        k.flourish(mollie);
        await k.wait(400);
        await k.say('twoBows', jigs);

        // Peter's socks... and one slips away to be lost again.
        k.face(peter, false);
        await k.say('neverLose', peter);
        const one = k.prop('lost-sock', { x: 330, y: 560, w: 50, z: 23 });
        k.set(one, { opacity: 0 });
        await k.fade(one, 1, 0.2);
        await k.to(one, 0.6, { x: '+=40', y: '+=60', rotation: 80, ease: 'power2.in' });
        k.fx.thud();
        await k.wait(400);
        fwip();
        const ob = k.box(one);
        k.sparkle(ob.x + ob.w / 2, ob.y + ob.h / 2, 10, 80);
        await k.vanish(one);
        k.face(mollie, false);
        await k.all(k.say('vanished', mollie), k.shake(peter, 4, 2));
        await k.say('offAgain', jigs);
        await k.say('silly', mollie);
        laugh();
        await warmEnding(k, { cast: [mollie, peter, jigs], end: 'end', music: 'cosy' });
        void socks;
      },
    },
  ],
});
