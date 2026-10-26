/**
 * The Toyland Express: the Wishing-Chair flies the friends to Toyland on the
 * morning of the Toy Fair, where the little train can't go because its
 * winding key is missing.
 *
 *   1. The playroom. Peter pushes his little tin train along the floor: toot
 *      toot! It rolls a little way and stops. He wishes he could ride on a
 *      real toy train. "A toy train's too small to ride on, silly," says
 *      Mollie. "Not in Toyland it isn't," says Jigs, with a wink. The chair
 *      wriggles: it knows the way. Mollie and Peter hop on, Mollie says
 *      "To Toyland, please, chair!", the wings grow and off they fly.
 *   2. The Toyland Express. Over a town built of building blocks, and down to
 *      Toyland's little station. Every toy is waiting on the platform with
 *      bunting out, but the engine stands still. Sergeant Brass, the toy
 *      soldier engine driver, marches up: "Oh dear, oh dear, oh dear! The
 *      Express can't go: somebody has taken its winding key, and the Toy Fair
 *      starts at twelve o'clock!" The clock says nearly twelve. Mollie crouches
 *      and spots a trail of little gold stars along the platform. She follows
 *      it (deed) to a door: the old toy cupboard, where nobody goes. "We do!"
 *      says Jigs.
 *   3. Jack-in-the-Box. Inside the dim, dusty cupboard, the friends tiptoe in.
 *      Something goes tick, tick, tick, and a toy box on the top shelf
 *      rattles, with the key on its lid. Peter climbs the shelves like steps
 *      and lifts the key down (deed). The box rattles harder: BOING! Jack
 *      springs up tall, bells jangling, his shadow stretching up the wall:
 *      "WHO is in MY cupboard? Give that BACK! Out! OUT!" The friends back
 *      away together (nobody is touched). Cut back: "Let's be brave," says
 *      Mollie. "Why did you take the key?" Jack droops into his box:
 *      everybody goes to the Fair but him, he can't walk, he's just a box.
 *      "Then you can ride on the train with us!" says Peter. "Me? On the
 *      train?" Mollie and Peter lift his box down and carry him out (the big
 *      deed) into the light.
 *   4. All aboard! On the platform they heave Jack's box up into the truck
 *      (deed). Jigs fits the key in the engine's side and winds it: click,
 *      click, click (deed). Steam, toot toot, and the toys cheer. Sergeant
 *      Brass salutes: "All aboard the Toyland Express!" The friends climb on
 *      the chair, and the train puffs off along the track with Jack in the
 *      truck, boinging with joy. Back home in the playroom, Peter's little tin
 *      train suddenly goes round the floor all by itself: toot toot!
 *
 * Scary, never cruel (docs/STYLE.md): in the dim cupboard Jack springs up and
 * looms, shrieks and jangles his bells, and his shadow stretches up the wall,
 * but he never touches anyone: the friends back away, then it cuts back to
 * Mollie being brave, and he is only lonely. Every ending is warm.
 *
 * New in the wishing world: Jack-in-the-Box and Sergeant Brass (characters),
 * the toy-train, toy-truck and toy-truck-front, the jack-box (props), and
 * the toyland-station and toy-cupboard backdrops. Peter's tin train, the key,
 * the waiting toys, the block town and Jack's looming shadow are drawn here
 * (art.ts), and the engine's toot and chuff, the tick, rattle and jangle in
 * sounds.ts.
 */
import { C, defineCartoon, type Kit } from '../../kit';
import { moves as anywhere, sounds as common } from '../../worlds/common/moves';
import { sneakIn, warmEnding } from '../../worlds/common/pieces';
import { jackInBoxBoing, jackInBoxGrin } from '../../worlds/wishing/jackinbox';
import { moves as wishing, sounds } from '../../worlds/wishing/moves';
import { chairRide, type Ride, type Slot } from '../../worlds/wishing/pieces';
import { blockTown, dollToy, duckToy, looming, skittleToy, teddyToy, tinTrain, windingKey } from './art';
import meta from './meta';
import { boingy, chuff, jangle, rattle, tick, tinToot, toot, windClick } from './sounds';

const { creak, hatBell, highWind } = sounds;
const { hiss, giggle, laugh } = common;

// ------------------------------------------------------------------ cast

type Name =
  | 'mollie' | 'peter' | 'jigs' | 'brass' | 'jack'
  | 'tin' | 'key' | 'box' | 'shadow' | 'town'
  | 'engine' | 'truck' | 'truckFront' | 'jackSeat' | 'jackBoing'
  | 'cupboard';
const cast = {} as Record<Name, HTMLElement>;
let ride: Ride;
/** The toys waiting on the platform (props: they cheer by hopping). */
let toys: HTMLElement[] = [];
/** Gold stars along the platform, leading to the old cupboard. */
let stars: HTMLElement[] = [];

/** The top of a portrait of width w whose bottom edge stands on the line y `feet`. */
const topFor = (w: number, feet = 640): number => feet - (w * 340) / 300;

/** Peter's little tin train, on the playroom floor. */
const TIN = { x: 300, y: 612, w: 130, z: 14 };
/** The chair in the playroom (as in the other episodes) and at the station. */
const PLAY_CHAIR = { x: 520, y: 255, w: 440 };
const STATION_CHAIR = { x: 10, y: 312, w: 380 };
/** Where it waits at the station while the friends wind the engine (small, behind them). */
const PARKED_CHAIR = { x: 0, y: 381, w: 300 };
/** The engine, with its wheels on the rail (y 573), and the truck behind it. */
const ENGINE = { x: 640, y: 346, w: 360, z: 8 };
const TRUCK = { x: 396, y: 416, w: 250, z: 8 };
/** The winding-key hole in the boiler, in stage points. */
const KEYHOLE: [number, number] = [ENGINE.x + 230, ENGINE.y + 126];

// ----------------------------------------------------------------- helpers

const rel = (n: number): string => (n >= 0 ? `+=${n}` : `-=${-n}`);

/** One hop (an arc `lift` high) of everyone in `els` by (dx, dy), landing with a thud. */
async function hopBy(k: Kit, els: HTMLElement[], dx: number, dy: number, lift = 70, s = 0.5): Promise<void> {
  const up = Math.min(dy, 0) - lift;
  await k.all(...els.map((el) => k.to(el, s / 2, { x: rel(dx / 2), y: rel(up), ease: 'power1.out' })));
  await k.all(...els.map((el) => k.to(el, s / 2, { x: rel(dx / 2), y: rel(dy - up), ease: 'power1.in' })));
  k.fx.thud();
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

/**
 * The toys waiting on the platform: small, along its back edge in front of
 * the track, in a little crowd whose left edge is x0 (art, width, natural
 * width and height).
 */
function platformToys<K extends string>(k: Kit<K>, x0: number): void {
  const list: [() => string, number, number, number][] = [
    [skittleToy, 40, 60, 130],
    [teddyToy, 76, 110, 130],
    [dollToy, 56, 80, 130],
    [duckToy, 84, 130, 110],
  ];
  let x = x0;
  toys = list.map(([art, w, nw, nh], i) => {
    const el = k.add(art(), { x, y: 614 - (w * nh) / nw, w, z: 7 + (i % 2) });
    x += w + 6;
    return el;
  });
}

/** Everyone in `els` gives a quick little cheer: a hop each, one after another. */
async function cheer(k: Kit, els: HTMLElement[], lift = 22): Promise<void> {
  await k.all(...els.map((el, i) => k.wait(i * 110).then(() => k.hop(el, lift, 2))));
}

/** The engine, truck and everything riding on them, as one train. */
const trainParts = (): HTMLElement[] => [cast.engine, cast.truck, cast.truckFront, cast.jackSeat, cast.jackBoing, cast.key].filter(Boolean);

/** Builds the station's train: engine, truck behind it, and the truck's near wall. */
function trainSet<K extends string>(k: Kit<K>, frontZ = 18): void {
  cast.engine = k.prop('toy-train', ENGINE);
  cast.truck = k.prop('toy-truck', TRUCK);
  cast.truckFront = k.prop('toy-truck-front', { ...TRUCK, z: frontZ });
}

// ------------------------------------------------------------------- script

export default defineCartoon({
  ...meta,
  lines: {
    // 1. The playroom
    morning: { who: 'narrator', text: 'It was a sunny morning in the playroom at the bottom of the garden.' },
    toot: { who: 'peter', text: 'Toot toot! Off you go, little tin train!' },
    wish: { who: 'peter', text: 'I wish I could ride on a real toy train.' },
    tooSmall: { who: 'mollie', text: 'A toy train’s much too small to ride on, silly.' },
    notToyland: { who: 'jigs', text: 'Not in Toyland it isn’t!' },
    whereToyland: { who: 'peter', text: 'Where’s Toyland?' },
    chairKnows: { who: 'jigs', text: 'The chair knows! Look, it’s wriggling!' },
    toToyland: { who: 'mollie', text: 'To Toyland, please, chair!' },
    // 2. The Toyland Express
    everything: { who: 'peter', text: 'Look at that! A whole town made of toys!' },
    welcome: { who: 'jigs', text: 'Here we are in Toyland! Everybody off!' },
    waiting: { who: 'mollie', text: 'The train isn’t puffing, and all the toys are waiting.' },
    ohDear: { who: 'brass', text: 'Oh dear, oh dear, oh dear!' },
    noKey: { who: 'brass', text: 'The Toyland Express can’t go! Somebody has taken its winding key.' },
    twelve: { who: 'brass', text: 'And the Toy Fair starts at twelve o’clock!' },
    clock: { who: 'peter', text: 'Look at the clock. It’s nearly twelve!' },
    stars: { who: 'mollie', text: 'Look! A trail of little gold stars, all along the platform.' },
    door: { who: 'mollie', text: 'They stop at this big old door.' },
    cupboard: { who: 'brass', text: 'That’s the old toy cupboard. Nobody ever goes in there.' },
    weDo: { who: 'jigs', text: 'We do!' },
    // 3. Jack-in-the-Box
    tickTick: { who: 'jigs', text: 'Shh! Listen. Something is going tick, tick, tick.' },
    keyThere: { who: 'peter', text: 'There’s the key! It’s on top of that box.' },
    climb: { who: 'peter', text: 'I’ll climb up the shelves, like steps.' },
    gotKey: { who: 'peter', text: 'Got it! It’s big and heavy.' },
    rattle: { who: 'mollie', text: 'Peter, the box is rattling!' },
    who: { who: 'jackInBox', text: 'WHO is in MY cupboard? Give that BACK!' },
    out: { who: 'jackInBox', text: 'Out! OUT! Get out of my cupboard!' },
    brave: { who: 'mollie', text: 'Let’s be brave.' },
    whyKey: { who: 'mollie', text: 'Why did you take the key?' },
    everybody: { who: 'jackInBox', text: 'Everybody goes to the Fair but me. I can’t walk. I’m just a box.' },
    rideTrain: { who: 'peter', text: 'Then you can ride on the train with us!' },
    me: { who: 'jackInBox', text: 'Me? On the train?' },
    lift: { who: 'mollie', text: 'Yes! We’ll carry you. One, two, three, lift!' },
    // 4. All aboard!
    heave: { who: 'peter', text: 'Heave! Up into the truck!' },
    nowKey: { who: 'jigs', text: 'Now for the key! Stand back, everyone.' },
    wind: { who: 'jigs', text: 'Wind, wind, wind! Come on, little engine!' },
    allAboard: { who: 'brass', text: 'All aboard the Toyland Express!' },
    boing: { who: 'jackInBox', text: 'BOING! I’m going to the Fair!' },
    jackFace: { who: 'mollie', text: 'Look at Jack’s face. He’s never been so happy.' },
    tinTrain: { who: 'peter', text: 'Look! My little tin train is going all by itself!' },
    bit: { who: 'jigs', text: 'A little bit of Toyland came home with us.' },
    end: { who: 'narrator', text: 'And Jack-in-the-Box never missed the Toy Fair again.' },
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
        cast.tin = k.add(tinTrain(), TIN);
      },
      async play(k) {
        const { mollie, peter, jigs, tin } = cast;
        await k.say('morning');

        // Peter pushes his little tin train: it rolls a little way, and stops.
        tinToot();
        await k.all(k.say('toot', peter), k.to(tin, 1.6, { x: '+=90', ease: 'power2.out' }));
        await k.say('wish', peter);
        await k.say('tooSmall', mollie);
        await k.blink(jigs);
        hatBell();
        await k.say('notToyland', jigs);
        await k.say('whereToyland', peter);

        // The chair knows the way.
        await k.all(k.say('chairKnows', jigs), wishing.wriggle(k, ride.chair, 3));

        // All aboard: Mollie and Peter hop up on to the seat.
        const p = await board(k, peter, 'peter', 'right');
        const m = await board(k, mollie, 'mollie', 'left');
        cast.mollie = m;
        cast.peter = p;
        await k.say('toToyland', m);
        k.flourish(ride.chair);
        k.music('magic');
        await chairRide.wings(k, ride);
        await chairRide.flap(k, ride, 2);
        k.music('adventure');
        highWind(2);
        await chairRide.fly(k, ride, { x: 900, y: -140, s: 2, tilt: -8 });
      },
    },

    // ==================================================== 2. The Toyland Express
    {
      name: 'The Toyland Express',
      set(k) {
        k.backdrop('wishing-sky');
        k.music('adventure');
        ride = chairRide.set(k, {
          x: 300,
          y: 170,
          w: 420,
          wings: true,
          riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'arm', flip: true }],
        });
        [cast.mollie, cast.peter, cast.jigs] = ride.riders;
        chairRide.jump(k, ride, { x: -800, y: 40 });
        cast.town = k.add(blockTown(), { x: 1240, y: 470, w: 460, z: 4 });
      },
      async play(k) {
        // Flying in over a town made of building blocks.
        highWind(3);
        await chairRide.fly(k, ride, { x: 0, y: 0, s: 2.2 });
        await k.all(k.say('everything', cast.peter), k.to(cast.town, 3.2, { x: -840, ease: 'sine.inOut' }), chairRide.flap(k, ride, 3));
        hatBell();

        // Down to the little station.
        await k.cut(() => {
          k.backdrop('toyland-station');
          k.music('cosy');
          trainSet(k, 6);
          platformToys(k, 868);
          // Sergeant Brass waits off stage at the left.
          cast.brass = k.character('brass', { x: 90, y: topFor(200), w: 200, z: 13, pose: 'worried' });
          k.set(cast.brass, { x: -420 });
          ride = chairRide.set(k, {
            ...STATION_CHAIR,
            wings: true,
            riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'arm', flip: true }],
          });
          [cast.mollie, cast.peter, cast.jigs] = ride.riders;
          chairRide.jump(k, ride, { x: 150, y: -760 });
        });
        highWind(1.5);
        await chairRide.land(k, ride);
        const { mollie, peter, jigs, brass } = cast;
        hatBell();
        await k.say('welcome', jigs);
        await chairRide.hopOff(k, ride, jigs, { x: 360, y: topFor(130), w: 130 });
        await chairRide.hopOff(k, ride, peter, { x: 490, y: topFor(190), w: 190 });
        await chairRide.hopOff(k, ride, mollie, { x: 680, y: topFor(190), w: 190 });
        for (const el of [jigs, peter, mollie]) k.face(el, true);
        // The chair flutters up out of the way, so the platform is left to the friends and Sergeant Brass.
        highWind(1.5);
        await chairRide.fly(k, ride, { y: -900, s: 1.3, flaps: 3 });
        await k.say('waiting', mollie);

        // Sergeant Brass marches up, in a flap.
        k.fx.patter(7, 0.2);
        await k.walk(brass, 420, 1.5, 6);
        await k.all(k.say('ohDear', brass), k.shake(brass, 5, 3));
        await k.say('noKey', brass);
        await k.say('twelve', brass);
        await k.all(k.say('clock', peter), k.to(peter, 0.5, { x: '+=0', rotation: 0 }));

        // Mollie crouches: a trail of little gold stars.
        k.face(mollie, false);
        await k.to(mollie, 0.4, { y: '+=36', rotation: 4, ease: 'sine.inOut' });
        const trail = [[880, 664], [930, 668], [980, 664], [1020, 670]];
        stars = trail.map(([x, y]) => {
          const s = k.prop('star', { x: x - 18, y: y - 18, w: 36, z: 9 });
          k.set(s, { opacity: 0 });
          return s;
        });
        await k.all(
          k.say('stars', mollie),
          (async () => {
            for (const s of stars) {
              await k.wait(420);
              k.fx.twinkle();
              await k.appear(s, 0.3);
            }
          })(),
        );
        await k.to(mollie, 0.4, { y: '-=36', rotation: 0, ease: 'sine.inOut' });
        k.music('sneaky');

        // She follows the trail to the door.
        await k.walk(mollie, 190, 1.4, 5);
        k.flourish(stars[stars.length - 1]);
        await k.say('door', mollie);
        k.face(brass, false);
        await k.say('cupboard', brass);
        await k.all(k.say('weDo', jigs), k.hop(jigs, 0, 1));
      },
    },

    // ==================================================== 3. Jack-in-the-Box
    {
      name: 'Jack-in-the-Box',
      set(k) {
        k.backdrop('toy-cupboard');
        k.music('sneaky');
        k.light(500, 400, 460, { color: '#ffe7b0', strength: 0.3, z: 5 });
        k.ambient('dust', { count: 14, area: [60, 60, 700, 560] });
        cast.box = k.prop('jack-box', { x: 975, y: 224, w: 212, z: 8 });
        cast.key = k.add(windingKey(), { x: 1010, y: 150, w: 110, z: 9 });
        cast.mollie = k.character('mollie', { x: 380, y: topFor(190), w: 190, z: 12 });
        cast.peter = k.character('peter', { x: 560, y: topFor(180), w: 180, z: 13 });
        cast.jigs = k.character('jigs', { x: 250, y: topFor(130), w: 130, z: 14 });
        sneakIn.set(k, [cast.mollie, cast.peter, cast.jigs], { distance: 760 });
        // His shadow, ready to stretch up the wall (hidden).
        cast.shadow = k.add(looming(), { x: 760, y: -20, w: 360, z: 7 });
        k.set(cast.shadow, { opacity: 0 });
      },
      async play(k) {
        const { mollie, peter, jigs, box, key, shadow } = cast;
        k.fx.creak();
        await sneakIn.play(k, { walkers: [mollie, peter, jigs], distance: 760, seconds: 2 });
        for (const el of [mollie, peter, jigs]) k.face(el, false);

        // A slow tick, and the box on the top shelf rattles.
        tick(3, 0.9);
        await k.wait(700);
        await k.all(k.say('tickTick', jigs), k.shake(box, 3, 2));
        rattle(4);
        await k.say('keyThere', peter);

        // Peter climbs the shelves like steps.
        await k.say('climb', peter);
        k.fx.sneak();
        await k.walk(peter, 170, 0.9, 3);
        await hopBy(k, [peter], 70, -70);
        await hopBy(k, [peter], 60, -100);
        await hopBy(k, [peter], 40, -110);

        // He lifts the big key off the lid.
        await k.to(key, 0.5, { y: '-=30', ease: 'sine.out' });
        await k.carry(key, peter, 0.8);
        // The key rests against his chest, in front of him, not behind his head.
        key.style.zIndex = '20';
        await k.to(key, 0.3, { y: '+=80', ease: 'sine.inOut' });
        await k.say('gotKey', peter);

        // The box rattles harder... and Peter hops down.
        rattle(8);
        await k.all(k.say('rattle', mollie), k.shake(box, 6, 5));
        await hopBy(k, [peter, key], -40, 110, 40, 0.3);
        await hopBy(k, [peter, key], -60, 100, 40, 0.3);
        await hopBy(k, [peter, key], -70, 70, 40, 0.3);
        k.silence();
        await k.wait(700);

        // BOING!
        k.remove(box);
        const jack = k.character('jackInBox', { x: 940, y: 360 - (237 * 340) / 300, w: 237, z: 9, pose: 'boing' });
        cast.jack = jack;
        k.set(jack, { transformOrigin: '50% 100%', scale: 0.5 });
        k.fx.boing();
        boingy();
        jangle();
        void k.quake(6);
        await k.to(jack, 0.3, { scale: 1.22, ease: 'back.out(2.2)' });
        k.music('spooky');
        const [hat] = k.pivot(k.part(jack, 'hat'));
        void k.to(hat, 0.1, { rotation: 7, yoyo: true, repeat: 7, ease: 'sine.inOut' });
        void k.fade(shadow, 1, 0.5);
        await k.all(...[mollie, peter, jigs].map((el) => k.shake(el, 6, 3)));
        await k.say('who', jack);

        // He boings up and down; the friends back away together.
        jangle();
        await k.all(
          k.say('out', jack),
          k.to(jack, 0.3, { scale: 1.12, yoyo: true, repeat: 3, ease: 'sine.inOut' }),
          anywhere.together(k, [mollie, peter, jigs, key], 1.2, { x: '-=70', ease: 'sine.inOut' }),
        );

        // Cut back to the heroes: Mollie is brave.
        k.pose(jack, 'default');
        await k.to(jack, 0.4, { scale: 1, ease: 'power2.inOut' });
        void k.fade(shadow, 0, 0.6);
        k.music('sneaky');
        await k.all(k.say('brave', mollie), k.to(mollie, 0.4, { x: '+=40' }));
        await k.say('whyKey', mollie);

        // He droops into his box.
        k.music('dreamy');
        k.pose(jack, 'sulk');
        await k.wait(500);
        await k.say('everybody', jack);
        await k.say('rideTrain', peter);
        k.pose(jack, 'grin');
        hatBell();
        await k.say('me', jack);

        // The big deed: Mollie and Peter lift his box down and carry it out.
        k.music('cosy');
        await k.say('lift', mollie);
        await k.all(k.to(mollie, 0.5, { x: '+=130' }), k.to(peter, 0.5, { x: '+=420' }), k.to(key, 0.5, { x: '+=420' }));
        await k.all(k.hop(mollie, 22, 1), k.hop(peter, 22, 1), k.carry(jack, [858, 506], 1));
        await k.wait(400);
        await anywhere.together(k, [mollie, peter, jack, key, jigs], 1.6, { x: '-=520', ease: 'sine.inOut' });
        await k.glow('#fff3c8', 0.4, 1);
      },
    },

    // ==================================================== 4. All aboard!
    {
      name: 'All aboard',
      set(k) {
        k.backdrop('toyland-station');
        k.music('cosy');
        trainSet(k);
        platformToys(k, 604);
        ride = chairRide.set(k, { ...PARKED_CHAIR, z: 6 });
        cast.peter = k.character('peter', { x: 230, y: topFor(170), w: 170, z: 21 });
        cast.mollie = k.character('mollie', { x: 80, y: topFor(170), w: 170, z: 22 });
        cast.jack = k.character('jackInBox', { x: 430, y: topFor(170), w: 170, z: 20, pose: 'grin' });
        cast.jigs = k.character('jigs', { x: 800, y: topFor(130), w: 130, z: 23, flip: true });
        cast.brass = k.character('brass', { x: 960, y: topFor(190), w: 190, flip: true, pose: 'salute', z: 24 });
        k.set(cast.brass, { x: 500 });
        cast.key = k.add(windingKey(), { x: 280, y: 548, w: 70, z: 20 });
        k.set(cast.key, { rotation: 0 });
      },
      async play(k) {
        const { mollie, peter, jigs, key } = cast;
        let { jack } = cast;
        // Heave Jack's box up into the truck.
        await k.say('heave', peter);
        k.fx.boing();
        const lift = [mollie, peter];
        await k.all(k.to(jack, 0.5, { y: '-=150', x: '+=6', ease: 'power2.out' }), ...lift.map((el) => k.to(el, 0.5, { y: '-=24', ease: 'power2.out' })));
        jack.style.zIndex = '15';
        await k.all(k.to(jack, 0.3, { y: '+=54', ease: 'power2.in' }), ...lift.map((el) => k.to(el, 0.3, { y: '+=24', ease: 'power2.in' })));
        k.fx.thud();
        // Jack stays sitting in the truck, as a picture of him (so the platform has room for everyone).
        const jb = k.box(jack);
        k.remove(jack);
        cast.jackSeat = k.add(jackInBoxGrin(), { x: jb.x, y: jb.y, w: jb.w, z: 15 });
        cast.jackBoing = k.add(jackInBoxBoing(), { x: jb.x, y: jb.y, w: jb.w, z: 15 });
        k.set(cast.jackBoing, { opacity: 0, transformOrigin: '50% 100%' });
        k.set(cast.jackSeat, { transformOrigin: '50% 100%' });
        k.flourish(cast.jackSeat);
        await k.wait(500);

        // Jigs: now for the key.
        hatBell();
        await k.all(k.say('nowKey', jigs), k.to(key, 0.9, { x: 790 - 280, y: 560 - 548, ease: 'sine.inOut' }));
        k.sfx.whoosh();
        await k.carry(key, KEYHOLE, 0.8);
        // Click, click, click.
        const turns = k.say('wind', jigs);
        for (let i = 1; i <= 3; i++) {
          await k.wait(380);
          windClick();
          await k.to(key, 0.34, { rotation: i * 90, ease: 'power2.inOut' });
        }
        await turns;
        k.flourish(key);
        await k.wait(300);

        // Steam, toot toot, and the toys cheer.
        const wheels = [...k.part(cast.engine, 'wheel1'), ...k.part(cast.engine, 'wheel2'), ...k.part(cast.engine, 'wheel3')];
        k.pivot(wheels);
        hiss(0.8);
        k.puff(ENGINE.x + 306, ENGINE.y + 14, 120, C.white);
        await k.wait(300);
        toot();
        k.puff(ENGINE.x + 306, ENGINE.y + 6, 150, C.white);
        void k.to(wheels, 0.8, { rotation: 140, ease: 'sine.inOut' });
        await k.wait(900);
        laugh();
        await cheer(k, toys);

        // Sergeant Brass marches in and salutes.
        k.fx.patter(7, 0.2);
        await k.to(cast.brass, 1.4, { x: 0, ease: 'sine.out' });
        await k.say('allAboard', cast.brass);

        // Mollie and Peter hop up on to the chair, and Jigs hops up after them.
        const p = await board(k, peter, 'peter', 'right');
        const m = await board(k, mollie, 'mollie', 'left');
        cast.mollie = m;
        cast.peter = p;
        k.music('adventure');
        const bj = k.box(jigs);
        const [ax, ay] = chairRide.seatAt(k, ride, 'arm');
        k.fx.patter(5, 0.15);
        await k.to(jigs, 1, { x: rel(ax - (bj.x + bj.w / 2)), y: rel(ay - (bj.y + bj.h / 2) - 40), ease: 'sine.inOut' });
        k.remove(jigs);
        cast.jigs = await chairRide.seat(k, ride, { id: 'jigs', slot: 'arm', flip: true });
        await chairRide.wings(k, ride);
        await chairRide.flap(k, ride, 2);
        await chairRide.fly(k, ride, { y: -150, s: 1.1, flaps: 3 });

        // Off they puff, with the chair flying beside.
        toot();
        k.sfx.fanfare();
        chuff(8, 0.55);
        const train = trainParts().filter((el) => el !== cast.jackBoing);
        const all = [...train, cast.jackBoing];
        const go = anywhere.together(k, all, 7.2, { x: '+=840', ease: 'sine.in' });
        const spin = k.to(wheels, 7.2, { rotation: '+=1700', ease: 'sine.in' });
        const pace = (async () => {
          for (let i = 0; i < 6; i++) {
            await k.wait(1000);
            const e = k.box(cast.engine);
            k.puff(e.x + 306, e.y + 8, 110, C.white);
          }
        })();
        const fly = chairRide.fly(k, ride, { x: 760, s: 7.2, flaps: 8 });
        await k.wait(600);
        // Jack boings with joy: swap to the sprung-up picture.
        k.set(cast.jackSeat, { opacity: 0 });
        k.set(cast.jackBoing, { opacity: 1 });
        boingy();
        jangle();
        void k.to(cast.jackBoing, 0.3, { scale: 1.12, yoyo: true, repeat: 5, ease: 'sine.inOut' });
        await k.say('boing', cast.jackBoing);
        await k.say('jackFace', cast.mollie);
        await k.all(go, spin, pace, fly);
        cast.jackSeat.remove();
        jack = cast.jackBoing;
        void jack;

        // Home in the playroom, where the little tin train has something to say.
        await k.cut(() => {
          k.backdrop('playroom');
          k.music('cosy');
          ride = chairRide.set(k, {
            ...PLAY_CHAIR,
            wings: true,
            riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'back', flip: true }],
          });
          [cast.mollie, cast.peter, cast.jigs] = ride.riders;
          chairRide.jump(k, ride, { x: 760 });
          cast.tin = k.add(tinTrain(), { ...TIN, x: 240 });
        });
        highWind(2);
        // All by itself: toot toot! (Peter sees it as they fly in: only x moves, so he can talk.)
        const { tin } = cast;
        tinToot();
        void (async () => {
          await k.to(tin, 1.8, { x: '+=420', ease: 'sine.inOut' });
          k.face(tin, true);
          tinToot();
          await k.to(tin, 1.8, { x: '-=420', ease: 'sine.inOut' });
        })();
        await k.all(chairRide.fly(k, ride, { x: 0, s: 2.6, flaps: 3 }), k.wait(1200).then(() => k.say('tinTrain', cast.peter)));
        await chairRide.land(k, ride);
        creak();
        // Wings folded, and out they hop one at a time, near the little tin train.
        await chairRide.hopOff(k, ride, cast.peter, { x: 270, y: topFor(190), w: 190 });
        await chairRide.hopOff(k, ride, cast.mollie, { x: 70, y: topFor(190), w: 190 });
        await chairRide.hopOff(k, ride, cast.jigs, { x: 480, y: topFor(130), w: 130 });
        await k.say('bit', cast.jigs);
        giggle();
        await warmEnding(k, { cast: [cast.mollie, cast.peter, cast.jigs], end: 'end', music: 'cosy' });
      },
    },
  ],
});
