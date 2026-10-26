/**
 * The Star That Fell: a little star tumbles out of the night sky into the
 * garden pond, and the Wishing-Chair flies it home before morning.
 *
 *   1. Plop! (the garden at night). Mollie and Peter tiptoe down the garden
 *      with a torch: Mollie is sure she saw something fall into the pond.
 *      Plop! A glow in the water. Jigs, who was asleep in the chair, pops up
 *      yawning. Peter fetches his shrimping net and fishes out a dripping
 *      little star (deed). It fell off its hook and wants to go home, and a
 *      star must be home before morning or it fades. Mollie wakes the chair,
 *      and off they go.
 *   2. Up through the dark. High in the night sky it is very dark. Mollie
 *      holds the star up on her lap, and its glow lights everyone's faces
 *      (deed). The star points the way, to a gap in the sky. The chair's
 *      wings droop, and it sinks. Jigs pats the chair and coaxes it into
 *      one more flap (deed), and up they burst through a cloud.
 *   3. The Star-Keeper (on a cloud among the stars). Stars hang on silver
 *      strings, and one hook is empty. Then a lantern swings out of the dark:
 *      the cross old Star-Keeper looms, "STAR THIEVES!", and Jigs ducks
 *      behind the chair. Cut back: Mollie, bravely, explains; the star says
 *      "They saved me!"; he polishes his spectacles and says sorry. His knees
 *      are too creaky for the ladder, so Peter climbs it and hangs the star
 *      on its hook (big deed). The Star-Keeper, kind now, gives Mollie a
 *      twist of stardust. The sky is going pink: home, quickly!
 *   4. Home by morning. Dawn colours over the garden. The chair glides down
 *      with drooping wings and lands just as they fold. Mollie sprinkles the
 *      stardust in the pond, and it twinkles (deed). Back in the playroom,
 *      snug in blankets, Peter yawns that it was the best night ever. Out
 *      of the doors, one last star winks in the pink sky, and says thank
 *      you. The End.
 *
 * Scary, never cruel (docs/STYLE.md): the dark sky, the drooping wings and
 * the Star-Keeper booming out of the dark with his lantern. He is cross only
 * because he is worried about his star, nobody is touched, and the story
 * cuts straight back to the heroes, who are brave and kind. He is ashamed at
 * once, and kind.
 *
 * The chair and its riders are the world's chairRide set piece; the
 * Star-Keeper, the little star and the two new places (garden-night and
 * star-cloud) are in the wishing world. The torch, its beam, the net, the
 * drips, the stardust and the blankets are drawn here.
 */
import { C, cached, defineCartoon, ellipse, ink, noiseBurst, now, piece, poly, rect, svg, tone, type Kit } from '../../kit';
import { sounds as common } from '../../worlds/common/moves';
import { sneakIn, warmEnding } from '../../worlds/common/pieces';
import { moves as wishing, sounds } from '../../worlds/wishing/moves';
import { chairRide, type Ride } from '../../worlds/wishing/pieces';
import meta from './meta';

const { creak, hatBell, highWind } = sounds;
const { click, ting } = common;

// ------------------------------------------------------------------- art

/** A torch lying on its side, pointing left: a red barrel with a silver head. 130 × 50. */
const torch = cached(() =>
  svg({ w: 130, h: 50, name: 'fallen-star-torch', label: 'A torch' }, [
    piece(rect(34, 12, 92, 28, 8), C.red, { edge: 'cut' }),
    piece(poly([[0, 0], [38, 10], [38, 42], [0, 50]]), C.steelLight, { edge: 'cut' }),
    piece(ellipse(4, 25, 7, 22), C.candle, { edge: 'clean', shadow: false }),
    piece(rect(60, 10, 8, 32, 2), C.steel, { edge: 'cut', fibre: false, shadow: false }),
  ]),
);

/** The torch's beam: a soft pale cone, its point on the right. 380 × 170. */
const beam = cached(() =>
  svg({ w: 380, h: 170, name: 'fallen-star-beam' }, [
    piece(poly([[380, 85], [0, 0], [0, 170]]), '#fff4c8', { edge: 'clean', shadow: false, fibre: false, opacity: 0.2 }),
    piece(poly([[380, 85], [120, 34], [120, 136]]), '#fff4c8', { edge: 'clean', shadow: false, fibre: false, opacity: 0.18 }),
  ]),
);

/** Peter's shrimping net: a round hoop with a mesh bag on the left, a long cane handle to the right. 300 × 120. */
const net = cached(() =>
  svg({ w: 300, h: 120, name: 'fallen-star-net', label: 'A net' }, [
    ink([[100, 60], [296, 64]], { width: 7, color: C.wood, wobble: 0.8 }),
    piece(poly([[14, 60], [38, 112], [74, 112], [96, 62]]), '#cfd9c0', { edge: 'cut', fibre: false, opacity: 0.8 }),
    ...[30, 50, 70].map((x) => ink([[x - 6, 70], [x + 2, 110]], { width: 1.6, color: C.greyDark, opacity: 0.6 })),
    ink([[18, 76], [92, 78]], { width: 1.6, color: C.greyDark, opacity: 0.6 }),
    piece(ellipse(56, 58, 46, 14), '#a4916a', { edge: 'cut', fibre: false }),
  ]),
);

/** One water drip. 16 × 24. */
const drip = cached(() =>
  svg({ w: 16, h: 24, name: 'fallen-star-drip' }, [piece(poly([[8, 0], [15, 14], [12, 22], [4, 22], [1, 14]]), '#9fd0f0', { edge: 'clean', shadow: false, fibre: false })]),
);

/** A twist of stardust: a little blue paper twist with a sparkle on it. 80 × 100. */
const dust = cached(() =>
  svg({ w: 80, h: 100, name: 'fallen-star-dust', label: 'A twist of stardust' }, [
    piece(poly([[10, 40], [70, 40], [58, 98], [22, 98]]), C.blue, { edge: 'cut' }),
    piece(poly([[14, 30], [66, 30], [70, 42], [10, 42]]), C.blueDark, { edge: 'cut' }),
    piece(poly([[28, 8], [40, 0], [52, 8], [46, 30], [34, 30]]), C.blue, { edge: 'cut' }),
    piece(poly([[40, 52], [45, 64], [57, 66], [48, 74], [51, 86], [40, 79], [29, 86], [32, 74], [23, 66], [35, 64]]), C.starGold, { edge: 'cut', fibre: false, shadow: false }),
  ]),
);

/** A patchwork blanket over someone's knees, in one colour with paler squares. 300 × 150. */
const blanket = cached((colour: string, light: string, name: string) =>
  svg({ w: 300, h: 150, name: `fallen-star-blanket-${name}`, label: 'A blanket' }, [
    piece(poly([[0, 40], [40, 10], [150, 0], [260, 10], [300, 44], [300, 150], [0, 150]]), colour, { rough: 1.2 }),
    ...[0, 1, 2, 3, 4].flatMap((i) =>
      [0, 1].map((j) => piece(rect(18 + i * 56, 34 + j * 56, 44, 44, 2), (i + j) % 2 ? light : colour, { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 })),
    ),
    ink([[0, 46], [40, 16], [150, 6], [260, 16], [300, 50]], { width: 4, color: C.cream, wobble: 0.6, opacity: 0.7 }),
  ]),
);

// ---------------------------------------------------------------- sounds

/** Crickets: little bunches of high, quick chirps, `seconds` long. */
function crickets(seconds = 4): void {
  const t = now();
  for (let b = 0; b < seconds * 1.4; b++) {
    for (let i = 0; i < 3; i++) tone(4200 + (b % 3) * 120, t + b * 0.7 + i * 0.09, { wave: 'sine', peak: 0.012, attack: 0.005, decay: 0.05 });
  }
}

/** A star dropping into water: a round, bubbly "plop" that rises. */
function plop(): void {
  const t = now();
  tone(260, t, { wave: 'sine', peak: 0.1, attack: 0.005, decay: 0.28, glideTo: 640 });
  noiseBurst(t, { freq: 1400, q: 1, peak: 0.05, attack: 0.005, decay: 0.2, sweepTo: 500 });
}

/** A soft, high, wondering "ting-a-ling" for a star winking. */
function wink(): void {
  const t = now();
  tone(1320, t, { wave: 'sine', peak: 0.04, attack: 0.1, decay: 0.9, glideTo: 1760 });
  tone(1760, t + 0.15, { wave: 'sine', peak: 0.025, attack: 0.1, decay: 0.9 });
}

// ------------------------------------------------------------------ cast

const cast = {} as Record<
  'mollie' | 'peter' | 'jigs' | 'star' | 'keeper' | 'chair' | 'net' | 'torch' | 'beam' | 'glow' | 'dust' | 'veil' | 'light' | 'lantern',
  HTMLElement
>;
let ride: Ride;

/** Every piece of a ride (chair, riders, star, front), to tween together where the set piece has no move for it. */
const ridePieces = (a: Ride): HTMLElement[] => [a.chair, ...a.riders, a.front];

/** The star's lap spot in a ride placed with `at`, where Mollie holds it. */
function lap(k: Kit, a: Ride): [number, number] {
  const [x, y] = chairRide.seatAt(k, a, 'left');
  return [x, y + a.at.w * 0.1];
}

/** Puts the little star in Mollie's lap on top of the chair's front, flying with the ride. */
function seatStar(k: Kit, a: Ride, w: number): HTMLElement {
  const [x, y] = lap(k, a);
  const star = k.character('littleStar', { x: x - w / 2, y: y - (w * 340) / 600, w, z: a.at.z + 6 });
  a.riders.push(star);
  return star;
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. Plop!
    night: { who: 'narrator', text: 'It was the middle of the night. Mollie and Peter tiptoed down the garden with a torch.' },
    sawFall: { who: 'mollie', text: 'I’m sure I saw something fall into the pond.' },
    plopped: { who: 'narrator', text: 'Plop! Something glowed in the water.' },
    yawn: { who: 'jigs', text: 'Yaaawn. What’s all the noise? I was fast asleep!' },
    shining: { who: 'peter', text: 'Look! Something’s shining in the water!' },
    net: { who: 'peter', text: 'I’ll get it with my net!' },
    fell: { who: 'littleStar', text: 'I fell off my hook. Please, I want to go home.' },
    fade: { who: 'jigs', text: 'A star has to be home before morning. Or it starts to fade away.' },
    takeHome: { who: 'mollie', text: 'Then we’ll take you home. Wake up, chair!' },
    // 2. Up through the dark
    dark: { who: 'peter', text: 'It’s so dark up here. I can’t see a thing.' },
    shine: { who: 'mollie', text: 'Shine, little star, so we can see the way.' },
    lit: { who: 'peter', text: 'That’s better! Your light is lovely.' },
    gap: { who: 'littleStar', text: 'Up there! Where the sky has a gap.' },
    tired: { who: 'jigs', text: 'Oh no. The wings are tired! It’s very high.' },
    sinking: { who: 'mollie', text: 'We’re sinking! Come on, chair, please don’t stop.' },
    coax: { who: 'jigs', text: 'Just one more flap, chair. You can do it!' },
    rising: { who: 'peter', text: 'It’s working! We’re going up again!' },
    burst: { who: 'mollie', text: 'Look at all the stars! They’re everywhere!' },
    // 3. The Star-Keeper
    strings: { who: 'peter', text: 'Look! All the stars hang on silver strings!' },
    emptyHook: { who: 'mollie', text: 'And there’s an empty hook. That must be yours!' },
    thieves: { who: 'starKeeper', text: 'STAR THIEVES! Give it back at ONCE!' },
    picked: { who: 'starKeeper', text: 'Stars don’t just fall! Somebody PICKED it!' },
    brave: { who: 'mollie', text: 'Let’s be brave, Peter. We’ll tell him.' },
    explain: { who: 'mollie', text: 'We didn’t take it. It fell into our pond, so we brought it home.' },
    saved: { who: 'littleStar', text: 'It’s true. They saved me!' },
    oh: { who: 'starKeeper', text: 'Oh. Oh dear. I’m a silly old Star-Keeper.' },
    knees: { who: 'starKeeper', text: 'But my knees are too creaky for the ladder, and morning is nearly here!' },
    climb: { who: 'peter', text: 'I’ll climb it! I’m a very good climber.' },
    blaze: { who: 'starKeeper', text: 'There! Back on its hook, and shining brighter than ever.' },
    stardust: { who: 'starKeeper', text: 'Thank you, children. Here, a pinch of stardust.' },
    pink: { who: 'jigs', text: 'Look! The sky’s going pink. Home, chair, quickly!' },
    // 4. Home by morning
    dawn: { who: 'narrator', text: 'Far below, the garden was growing pale and pink. Morning was coming.' },
    justInTime: { who: 'peter', text: 'Just in time!' },
    sprinkle: { who: 'mollie', text: 'I’ll sprinkle the stardust in the pond.' },
    raining: { who: 'jigs', text: 'Now every time it rains, the pond will twinkle.' },
    best: { who: 'peter', text: 'That was the best night ever.' },
    lastStar: { who: 'mollie', text: 'Look. One last star, still shining.' },
    thanks: { who: 'littleStar', text: 'Thank you!' },
    end: { who: 'narrator', text: 'And the three friends fell fast asleep, warm and safe, while the last star winked out.' },
  },
  scenes: [
    // ==================================================== 1. Plop!
    {
      name: 'Plop!',
      set(k) {
        k.backdrop('garden-night');
        k.music('dreamy');
        k.light(160, 340, 300, { color: '#ffe3a0', strength: 0.22, z: 5 });
        k.ambient('fireflies', { count: 8, z: 3, area: [320, 300, 700, 300] });
        // The chair stands by the playroom door with Jigs asleep behind it.
        ride = chairRide.set(k, { x: 10, y: 300, w: 340, riders: [{ id: 'jigs', slot: 'back' }] });
        cast.jigs = ride.riders[0];
        k.set(cast.jigs, { opacity: 0, y: 70 });
        // The friends and their torch, parked off to the right, ready to creep in.
        cast.peter = k.character('peter', { x: 600, y: 385, w: 220, z: 12, flip: true });
        cast.mollie = k.character('mollie', { x: 830, y: 380, w: 220, z: 12, flip: true });
        cast.beam = k.add(beam(), { x: 392, y: 490, w: 380, z: 9 });
        cast.torch = k.add(torch(), { x: 770, y: 575, w: 120, z: 14 });
        sneakIn.set(k, [cast.peter, cast.mollie, cast.beam, cast.torch], { from: 'right', distance: 620 });
        // The star, still under the water, and the glow round it.
        cast.star = k.character('littleStar', { x: 421, y: 560, w: 130, z: 11 });
        k.set(cast.star, { opacity: 0, scale: 0.3 });
        cast.glow = k.light(486, 655, 180, { color: '#fff1a8', strength: 0.5, z: 6 });
        k.set(cast.glow, { opacity: 0 });
        cast.net = k.add(net(), { x: 330, y: 560, w: 260, z: 14 });
        k.set(cast.net, { opacity: 0, transformOrigin: '100% 50%', rotation: 40 });
      },
      async play(k) {
        const { mollie, peter, jigs, star, net: fishNet, glow } = cast;
        crickets(4);
        await k.say('night');
        await sneakIn.play(k, { walkers: [peter, mollie, cast.torch], gliders: [cast.beam], from: 'right', distance: 620, seconds: 2.4, hops: 8 });
        await k.say('sawFall', mollie);

        // Plop! A glow in the pond.
        await k.wait(500);
        k.fx.splash();
        plop();
        k.sparkle(486, 650, 8, 70);
        await k.all(k.fade(glow, 1, 0.6), k.fade(star, 1, 0.6), k.to(star, 0.6, { scale: 1 }));
        await k.say('plopped');

        // Jigs wakes up behind the chair.
        hatBell();
        await k.all(k.to(jigs, 0.4, { y: 0, opacity: 1 }), k.hop(jigs, 10, 1));
        await k.say('yawn', jigs);
        await k.say('shining', peter);

        // Peter fishes the star out with his net.
        k.music('magic');
        await k.say('net', peter);
        k.set(fishNet, { opacity: 1 });
        await k.to(fishNet, 0.3, { rotation: 52, ease: 'power2.out' });
        await k.to(fishNet, 0.35, { rotation: -6, ease: 'power2.in' });
        k.fx.splash();
        k.sparkle(486, 650, 10, 80);
        await k.to(fishNet, 0.5, { rotation: 36, ease: 'power2.out' });
        await k.carry(star, [836, 380], 1.1);
        creak();
        // The wet star drips.
        for (const x of [800, 840, 872]) {
          const d = k.add(drip(), { x, y: 440, w: 14, z: 30 });
          void k.to(d, 0.7, { y: '+=90', opacity: 0, ease: 'power1.in' }).then(() => k.remove(d));
        }
        void k.fade(glow, 0, 0.8);
        await k.fade(fishNet, 0, 0.6);
        await k.say('fell', star);
        await k.say('fade', jigs);

        // Mollie wakes the chair.
        await k.say('takeHome', mollie);
        await wishing.wriggle(k, ride.chair, 3);
        k.flourish(ride.chair);
        k.music('adventure');
        await chairRide.wings(k, ride);
        await chairRide.flap(k, ride, 2);

        // Everyone hops in, the star on Mollie's lap.
        k.fx.boing();
        await k.all(
          k.to(mollie, 0.5, { x: '-=450', y: '-=40', ease: 'power1.inOut' }),
          k.to(peter, 0.5, { x: '-=300', y: '-=40', ease: 'power1.inOut' }),
          k.to(star, 0.5, { x: '-=420', y: '-=40', ease: 'power1.inOut' }),
          k.fade(cast.torch, 0, 0.5),
          k.fade(cast.beam, 0, 0.5),
        );
        await k.all(k.vanish(mollie, 0.3), k.vanish(peter, 0.3), k.vanish(star, 0.3));
        await chairRide.seat(k, ride, { id: 'mollie', slot: 'left' });
        await chairRide.seat(k, ride, { id: 'peter', slot: 'right' });
        seatStar(k, ride, 100);
        await k.wait(400);
        highWind(3);
        await chairRide.fly(k, ride, { x: 140, y: -900, s: 2.4, tilt: -6 });
      },
    },

    // ==================================================== 2. Up through the dark
    {
      name: 'Up through the dark',
      set(k) {
        k.backdrop('night');
        k.music('dreamy');
        cast.veil = k.dim(0.3, '#0a1030');
        ride = chairRide.set(k, {
          x: 330,
          y: 150,
          w: 440,
          wings: true,
          riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'arm', flip: true }],
        });
        [cast.mollie, cast.peter, cast.jigs] = ride.riders;
        cast.star = seatStar(k, ride, 100);
        // The star's light, which comes on when Mollie holds it up.
        const [lx, ly] = lap(k, ride);
        cast.light = k.light(lx - 40, ly - 160, 260, { color: '#ffeaa0', strength: 0.2, z: 17 });
        k.set(cast.light, { opacity: 0 });
        chairRide.jump(k, ride, { x: -140, y: 0 });
      },
      async play(k) {
        const { mollie, peter, jigs, star, light, veil } = cast;
        highWind(4);
        await k.all(k.say('dark', peter), chairRide.fly(k, ride, { x: 0, s: 2.2, flaps: 3 }));

        // Mollie holds the star up, and it lights everyone's faces.
        await k.say('shine', mollie);
        k.fx.twinkle();
        await k.to(star, 0.7, { x: '-=60', y: '-=190', ease: 'sine.out' });
        k.flourish(star);
        k.music('magic');
        void k.glow('#ffe7a0', 0.2, 1.6);
        await k.all(k.fade(light, 1, 1), k.fade(veil, 0.1, 1.2));
        await k.say('lit', peter);
        await k.say('gap', star);

        // The wings tire, and down they sink.
        await wishing.droop(k, ride.chair);
        await k.say('tired', jigs);
        await k.all(...ridePieces(ride).map((el) => k.to(el, 1.5, { y: '+=110', ease: 'sine.inOut' })));
        await k.all(k.say('sinking', mollie), k.shake(mollie, 4, 2));

        // Jigs pats the chair and coaxes it on.
        const [arm] = k.pivot(k.part(jigs, 'armL'));
        void k.to(arm, 0.3, { rotation: 30, yoyo: true, repeat: 3, ease: 'sine.inOut' });
        creak();
        await k.say('coax', jigs);
        k.flourish(ride.chair);
        void chairRide.flap(k, ride, 4);
        await k.all(...ridePieces(ride).map((el) => k.to(el, 1.2, { y: '-=200', ease: 'sine.out' })));
        await k.say('rising', peter);

        // Up through a cloud and out among the stars.
        highWind(3);
        k.puff(640, 600, 340, C.cloud);
        k.puff(520, 640, 260, C.cloudShade);
        k.puff(780, 620, 280, C.cloud);
        await k.all(...ridePieces(ride).map((el) => k.to(el, 1.2, { y: '-=170', ease: 'sine.in' })));
        await k.all(k.say('burst', mollie), ...ridePieces(ride).map((el) => k.to(el, 2.6, { x: '+=40', ease: 'sine.inOut' })));
        k.fx.whizz();
        await k.all(...ridePieces(ride).map((el) => k.to(el, 1.1, { y: '-=520', ease: 'power1.in' })));
      },
    },

    // ==================================================== 3. The Star-Keeper
    {
      name: 'The Star-Keeper',
      set(k) {
        k.backdrop('star-cloud');
        k.music('magic');
        ride = chairRide.set(k, {
          x: 130,
          y: 270,
          w: 340,
          wings: true,
          riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'back' }],
        });
        [cast.mollie, cast.peter, cast.jigs] = ride.riders;
        cast.star = seatStar(k, ride, 90);
        chairRide.jump(k, ride, { x: 0, y: 620 });
        cast.keeper = k.character('starKeeper', { x: -40, y: 262, w: 340, z: 16, pose: 'cross' });
        k.set(cast.keeper, { x: -520 });
        cast.dust = k.add(dust(), { x: 150, y: 330, w: 56, z: 20 });
        k.set(cast.dust, { opacity: 0 });
      },
      async play(k) {
        const { mollie, peter, jigs, star, keeper } = cast;
        // Up out of the clouds and down onto the silvery one.
        highWind(2);
        await chairRide.land(k, ride);
        await k.say('strings', peter);
        await chairRide.hopOff(k, ride, mollie, { x: 520, y: 410, w: 190 });
        await chairRide.hopOff(k, ride, peter, { x: 700, y: 412, w: 190 });
        ride.riders = ride.riders.filter((r) => r !== star);
        const sb = k.box(star);
        await k.to(star, 0.7, { x: `+=${440 - sb.x}`, y: `+=${470 - sb.y}`, ease: 'sine.inOut' });
        k.sparkle(560, 160, 8, 100);
        await k.say('emptyHook', mollie);

        // Uh-oh: a lantern swings out of the dark.
        k.silence();
        await k.wait(700);
        k.fx.uhoh();
        await k.wait(500);
        k.music('spooky');
        k.sfx.ominous();
        void k.to(cast.jigs, 0.5, { y: '+=110', ease: 'sine.in' }).then(() => k.fade(cast.jigs, 0, 0.2));
        await k.to(keeper, 1.3, { x: 0, ease: 'sine.out' });
        k.fx.stomp(2, 0.4);
        void k.quake(5);
        cast.lantern = k.light(257, 453, 230, { color: '#ffd98a', strength: 0.3, z: 36 });
        await k.camera({ zoom: 1.3, x: 330, y: 470 }, 1.1);
        await k.say('thieves', keeper);
        await k.shake(keeper, 4, 2);
        k.fx.stomp(2, 0.35);
        void k.quake(5);
        await k.say('picked', keeper);
        await k.camera({}, 0.9);

        // Back to the heroes: brave and honest.
        k.music('cosy');
        await k.all(k.say('brave', mollie), k.to(mollie, 0.4, { x: '+=16' }));
        await k.say('explain', mollie);
        await k.say('saved', star);

        // He peers, polishes his spectacles and is sorry.
        k.pose(keeper, 'default');
        const [hand] = k.pivot(k.part(keeper, 'armL'));
        void k.to(hand, 0.5, { rotation: -26, yoyo: true, repeat: 1, ease: 'sine.inOut' });
        await k.say('oh', keeper);
        await k.say('knees', keeper);

        // Peter climbs the ladder with the star and hangs it on its hook.
        await k.say('climb', peter);
        const tip: [number, number] = [920, 262];
        k.set(peter, { transformOrigin: '0 0' });
        const home = k.box(peter);
        let at = { x: home.x, y: home.y };
        const step = (to: { x: number; y: number; s: number }, seconds: number): Promise<void> => {
          const dx = to.x - at.x;
          const dy = to.y - at.y;
          at = { x: to.x, y: to.y };
          return k.all(k.to(peter, seconds, { x: `+=${dx}`, y: `+=${dy}`, scale: to.s, ease: 'sine.out' }), k.to(star, seconds, { x: `+=${dx}`, y: `+=${dy}`, ease: 'sine.out' }));
        };
        await k.carry(star, [home.x - 40, home.y + 90], 0.8);
        for (const c of [{ x: 716, y: 372, s: 0.9 }, { x: 740, y: 322, s: 0.8 }, { x: 760, y: 270, s: 0.72 }, { x: 776, y: 224, s: 0.68 }]) {
          ting();
          await step(c, 0.45);
        }
        await k.carry(star, tip, 0.8);
        click();
        void k.glow('#fff4b8', 0.5, 1.8);
        k.sparkle(tip[0], tip[1], 20, 160);
        k.fx.twinkle();
        await k.wait(900);

        // Down again, and the Star-Keeper is kind.
        k.fx.boing();
        await k.to(peter, 0.9, { x: `+=${home.x - at.x}`, y: `+=${home.y - at.y}`, scale: 1, ease: 'sine.inOut' });
        k.pose(keeper, 'kind');
        await k.say('blaze', keeper);
        k.music('magic');
        cast.dust = k.add(dust(), { x: 340, y: 430, w: 56, z: 20 });
        k.fx.pop();
        await k.say('stardust', keeper);
        await k.carry(cast.dust, mollie, 1);
        k.fx.twinkle();
        await k.exit(keeper, 'left', 1);

        // The sky is going pink: home!
        k.set(jigs, { y: 0 });
        await k.fade(jigs, 1, 0.4);
        hatBell();
        await k.say('pink', jigs);
        k.fx.boing();
        await k.all(k.to(mollie, 0.5, { x: '-=330', y: '-=70' }), k.to(peter, 0.5, { x: '-=330', y: '-=70' }), k.fade(cast.dust, 0, 0.4));
        await k.all(k.vanish(mollie, 0.3), k.vanish(peter, 0.3));
        await chairRide.seat(k, ride, { id: 'mollie', slot: 'left' });
        await chairRide.seat(k, ride, { id: 'peter', slot: 'right' });
        await chairRide.wings(k, ride);
        highWind(3);
        await chairRide.fly(k, ride, { x: 200, y: -80, s: 1.2, flaps: 3 });
      },
    },

    // ==================================================== 4. Home by morning
    {
      name: 'Home by morning',
      set(k) {
        k.backdrop('garden-night');
        k.music('dreamy');
        k.dim(0.28, '#f29bb0');
        k.light(640, 520, 520, { color: '#ffd0a0', strength: 0.28, z: 5 });
        ride = chairRide.set(k, {
          x: 660,
          y: 290,
          w: 380,
          wings: true,
          riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'arm', flip: true }],
        });
        [cast.mollie, cast.peter, cast.jigs] = ride.riders;
        k.set([...k.part(ride.chair, 'wingL')], { rotation: 35 });
        k.set([...k.part(ride.chair, 'wingR')], { rotation: -35 });
        chairRide.jump(k, ride, { x: 0, y: -820 });
      },
      async play(k) {
        const { mollie, peter, jigs } = cast;
        await k.say('dawn');
        // Down they come, wings drooping, and land just as the wings fold.
        highWind(3);
        await k.all(...ridePieces(ride).map((el) => k.to(el, 2.6, { y: -40, ease: 'sine.out' })));
        await wishing.droop(k, ride.chair);
        await chairRide.land(k, ride, { y: 0 });
        await k.say('justInTime', peter);

        // Mollie sprinkles the stardust in the pond.
        await chairRide.hopOff(k, ride, mollie, { x: 470, y: 420, w: 190 });
        const mb = k.box(mollie);
        cast.dust = k.add(dust(), { x: mb.x + 150, y: mb.y + 70, w: 56, z: 30 });
        k.fx.pop();
        await k.say('sprinkle', mollie);
        await k.carry(cast.dust, [486, 650], 1);
        k.sfx.sparkle();
        k.sparkle(486, 650, 24, 160);
        void k.vanish(cast.dust, 0.5);
        k.ambient('fireflies', { count: 12, z: 6, area: [340, 620, 300, 90] });
        k.light(486, 660, 190, { color: '#bfe4ff', strength: 0.35, z: 6 });
        await k.wait(900);
        await k.say('raining', jigs);

        // Home to the playroom, snug in blankets.
        await k.cut(() => {
          k.backdrop('playroom');
          k.music('dreamy');
          k.light(1010, 300, 260, { color: '#ffb4c0', strength: 0.28, z: 5 });
          cast.mollie = k.character('mollie', { x: 290, y: 395, w: 230, z: 12 });
          cast.peter = k.character('peter', { x: 540, y: 395, w: 230, z: 12 });
          cast.jigs = k.character('jigs', { x: 800, y: 470, w: 150, z: 12, flip: true });
          k.add(blanket('#c4706c', '#d99a95', 'rose'), { x: 270, y: 560, w: 270, z: 16 });
          k.add(blanket('#4f78a8', '#7e9fc4', 'blue'), { x: 520, y: 560, w: 270, z: 16 });
          k.add(blanket('#6f9a5a', '#9cbf7a', 'green'), { x: 780, y: 580, w: 190, z: 16 });
          cast.star = k.prop('star', { x: 1000, y: 200, w: 56, z: 8 });
          k.set(cast.star, { opacity: 0 });
          cast.light = k.light(1028, 228, 120, { color: '#fff1b8', strength: 0.4, z: 9 });
          k.set(cast.light, { opacity: 0 });
        });
        await k.wait(600);
        await k.say('best', cast.peter);
        await k.say('lastStar', cast.mollie);

        // The last star winks: a soft glow, never a flash.
        await k.fade(cast.star, 1, 1);
        wink();
        await k.fade(cast.light, 1, 0.9);
        await k.fade(cast.light, 0.3, 0.9);
        await k.fade(cast.light, 0.9, 0.9);
        await k.say('thanks');
        void k.fade(cast.star, 0, 2.5);
        void k.fade(cast.light, 0, 2.5);
        await warmEnding(k, { cast: [cast.mollie, cast.peter, cast.jigs], end: 'end', music: 'dreamy', hops: 1, stagger: 400, sparkleAt: [1028, 250], hold: 1800 });
      },
    },
  ],
});
