/**
 * The Land of Nod: glittery sleepy-sand drifts into the playroom, because the
 * Sandman's sack has burst. The friends fly to the Land of Nod, sweep the
 * sand up and mend the sack before they all fall asleep, wake Jigs and the
 * chair, and come home at bedtime with a pinch of sand for the best dreams.
 *
 *   1. Sparkly sand (the playroom, late afternoon). Glittery gold grains
 *      float in through the open doors and settle on the chair's cushion.
 *      Peter yawns; the chair creaks a sleepy yawn. Jigs knows it:
 *      sleepy-sand, from the Sandman in the Land of Nod, who never spills a
 *      grain. Something is wrong! Peter brushes the sand off the cushion
 *      with his hanky (deed), the chair wakes up and grows its wings, and off
 *      they fly.
 *   2. The Land of Nod. A soft violet land of pillowy hills, nightcap houses
 *      and a sleepy moon, with sleepy-sand drifting everywhere. They land,
 *      Jigs staying perched on the chair's arm. The Sandman, Old Dozy, is
 *      asleep by his burst sack: Peter claps and wakes him (deed). He
 *      tripped on a pillow and his sack went pop, and now everyone in Nod
 *      keeps nodding off. "And the most important thing is…" and he is
 *      asleep again. Woken, he says it: don't stay in the sand too long, or
 *      you'll sleep till next Tuesday. Then who would fly the chair home?
 *      "I'm wide awake!" says Jigs, and falls asleep. The chair's wings
 *      droop, and the chair begins to snore.
 *   3. Sweep it up. Quick, before Mollie and Peter fall asleep too. Old Dozy
 *      lends Mollie his broom and she sweeps the sand into a glittery heap
 *      (deed); Peter holds the sack open and in it goes (deed). Mollie yawns
 *      and nearly drops off, and Peter keeps her going. There is still a hole,
 *      and "the most important thing is…" zzz: to tie it up tight. Mollie
 *      pulls the blue ribbon from her plait and Peter ties the sack with a
 *      bow (deed). The drifting sand fades away. But how do they wake Jigs
 *      and the chair?
 *   4. Wake up, Jigs! Old Dozy has a feather from his pillow: Mollie tickles
 *      Jigs awake (deed), giggling. Jigs rings the bell on his hat by the
 *      chair, and the chair wakes, wings up (deed). Old Dozy, beaming, gives
 *      Peter a twist of his very best sand, for the happiest dreams. Goodbye,
 *      and "the most important thing is…" zzz. Home, before sunset!
 *   5. Bedtime (the playroom at sunset). They land as the real evening comes.
 *      Peter sprinkles the pinch of sand, and it falls in soft sparkles over
 *      them all (deed). A yawn is passed round: Peter, Mollie, Jigs, even the
 *      chair. Jigs starts "And the most important thing is…" and falls asleep
 *      on the chair's arm. Goodnight, Jigs; goodnight, chair. The End.
 *
 * Gentle danger, no villain (docs/STYLE.md): the sand makes people sleepy,
 * and if Mollie and Peter fall asleep too nobody can fly the chair home.
 * Nobody is hurt and it is never dark: the sleepers snore and the heroes put
 * it right. The sand's glitter drifts slowly and its sparkles fade, never
 * flash.
 *
 * The chair and its riders are the world's chairRide set piece. Old Dozy,
 * the Land of Nod and the Sandman's sack are new in the wishing world; the
 * grains, the hanky, the broom, the heap, the ribbon, the feather, the twist
 * and the sunset are drawn here (art.ts), and the snores, yawns, clap and
 * swish are in sounds.ts.
 */
import { defineCartoon, type Kit } from '../../kit';
import { moves as commonMoves, sounds as common } from '../../worlds/common/moves';
import { warmEnding } from '../../worlds/common/pieces';
import { moves as wishing, sounds } from '../../worlds/wishing/moves';
import { chairRide, type Ride } from '../../worlds/wishing/pieces';
import { broom, cushionSand, feather, grain, hanky, heap, ribbon, sunsetDoor, sunsetWindow, twist } from './art';
import meta from './meta';
import { chairSnore, clap, sandTinkle, snooze, swish, yawn } from './sounds';

const { creak, hatBell, highWind } = sounds;
const { giggle, pour } = common;
const { wave } = commonMoves;

// ------------------------------------------------------------------ cast

type Name =
  | 'mollie' | 'peter' | 'jigs' | 'dozy' | 'sack'
  | 'sand' | 'hanky' | 'broom' | 'heap' | 'ribbon' | 'feather' | 'twist'
  | 'spilt0' | 'spilt1' | 'spilt2';
const cast = {} as Record<Name, HTMLElement>;
let ride: Ride;

/** The three friends sat in the chair: Mollie and Peter on the seat, Jigs on the left arm. */
const THREE: { id: string; slot: 'left' | 'right' | 'armL' }[] = [
  { id: 'mollie', slot: 'left' },
  { id: 'peter', slot: 'right' },
  { id: 'jigs', slot: 'armL' },
];

/** The chair in the Land of Nod, and where Mollie, Peter, the sack and Old Dozy stand. */
const NOD_CHAIR = { x: 40, y: 290, w: 400 };
const MOLLIE_AT = { x: 430, y: 380, w: 210 };
const PETER_AT = { x: 640, y: 380, w: 210 };
const SACK_AT = { x: 800, y: 466, w: 170 };
const DOZY_AT = { x: 930, y: 360, w: 240 };
/** Patches of spilt sleepy-sand on the ground in scene 3 (top-left of each), swept into the heap one by one. */
const SPILT: [number, number][] = [[430, 612], [720, 640], [520, 650]];

// ------------------------------------------------------------- helpers

/** The `x` and `y` offsets that put an actor's middle on a stage point (from where it was placed). */
function at(el: HTMLElement, cx: number, cy: number): { x: number; y: number } {
  const l = parseFloat(el.style.left) || 0;
  const t = parseFloat(el.style.top) || 0;
  const w = parseFloat(el.style.width) || 0;
  const h = parseFloat(el.style.height) || 0;
  return { x: cx - (l + w / 2), y: cy - (t + h / 2) };
}

/** One little puff of "z z z" rising from a sleeper and fading away. */
async function puffZ(k: Kit, x: number, y: number): Promise<void> {
  const zs = [0, 1, 2].map((i) => {
    const z = k.lettering('z', { x: x + i * 18, y: y - i * 26, size: 24 + i * 8, color: '#f4ecff', z: 32 });
    k.set(z, { opacity: 0 });
    return z;
  });
  for (const z of zs) {
    void k.to(z, 2.4, { y: -36, ease: 'sine.out' });
    void k.to(z, 0.6, { opacity: 0.9, ease: 'sine.inOut' }).then(() => k.wait(900)).then(() => k.to(z, 0.9, { opacity: 0 }));
    await k.wait(320);
  }
  await k.wait(2000);
  for (const z of zs) k.remove(z);
}

/** Keeps the z's rising over a sleeper (at a stage point, or above an actor's head) until the returned stopper is called. */
function sleeping(k: Kit, where: HTMLElement | [number, number], sound?: () => void): () => void {
  let on = true;
  void (async () => {
    while (on) {
      let x: number;
      let y: number;
      if (Array.isArray(where)) [x, y] = where;
      else {
        // Above the head (and the nightcap), where the z's show against the sky.
        const b = k.box(where);
        x = b.face.x + b.face.w * 0.8;
        y = b.y + 6;
      }
      sound?.();
      await puffZ(k, x, y);
      await k.wait(600);
    }
  })();
  return () => {
    on = false;
  };
}

/** Jigs nods off: his eyes shut and his head tips over. Instant in `set`, gentle in `play`. */
function jigsAsleep(k: Kit, jigs: HTMLElement): void {
  k.set(k.part(jigs, 'lids'), { opacity: 1 });
  k.set(jigs, { rotation: -12, transformOrigin: '50% 100%' });
}

/** The chair's wings sag, tired and asleep. Instant (for `set`). */
function wingsDown(k: Kit, chair: HTMLElement): void {
  k.set(k.pivot(k.part(chair, 'wingL')), { rotation: DROOP });
  k.set(k.pivot(k.part(chair, 'wingR')), { rotation: -DROOP });
}

/**
 * A character yawns: mouth wide, a little stretch up, a yawning sound. (A lift
 * in y, not a stretch: riders who have hopped out of the chair are scaled from
 * their top-left, and a new scale or origin would shift them.)
 */
async function yawnBy(k: Kit, el: HTMLElement, high = false): Promise<void> {
  yawn(high);
  k.set(k.part(el, 'mouthOpen'), { opacity: 1 });
  await k.to(el, 0.5, { y: '-=10', ease: 'sine.out' });
  await k.wait(300);
  await k.to(el, 0.5, { y: '+=10', ease: 'sine.inOut' });
  k.set(k.part(el, 'mouthOpen'), { opacity: 0 });
}

/** How far the chair's wings sag when it falls asleep (degrees, about their roots). */
const DROOP = 62;

/** Old Dozy nods off: his sleep pose, a slow droop, a little snore. */
async function dozeOff(k: Kit, dozy: HTMLElement): Promise<void> {
  k.pose(dozy, 'sleep');
  k.set(dozy, { transformOrigin: '50% 100%' });
  snooze();
  await k.to(dozy, 0.8, { rotation: -5, ease: 'sine.inOut' });
}

/** Old Dozy wakes with a start: back to his plain pose, a jolt and a wobble of his hat. */
async function wakeUp(k: Kit, dozy: HTMLElement): Promise<void> {
  k.pose(dozy, 'default');
  k.fx.boing();
  await k.to(dozy, 0.2, { rotation: 0, ease: 'power2.out' });
  await k.shake(dozy, 6, 2);
}

/** Sleepy-sand drifting: grains floating slowly from one point to another, wavering, then fading. */
async function drift(k: Kit, from: [number, number], to: [number, number], n: number, seconds = 3): Promise<void> {
  const grains = Array.from({ length: n }, (_, i) => {
    const g = k.add(grain(), { x: from[0] + ((i * 37) % 120) - 60, y: from[1] + ((i * 53) % 80) - 40, w: 22 + (i % 3) * 6, z: 31 });
    k.set(g, { opacity: 0 });
    return g;
  });
  await k.all(
    ...grains.map((g, i) =>
      k.wait(i * 160).then(async () => {
        void k.fade(g, 0.95, 0.5);
        const end = at(g, to[0] + ((i * 29) % 90) - 45, to[1] + ((i * 17) % 30) - 15);
        void k.to(g, seconds / 2, { x: end.x / 2 + (i % 2 ? 40 : -40), ease: 'sine.inOut' }).then(() => k.to(g, seconds / 2, { x: end.x, ease: 'sine.inOut' }));
        await k.to(g, seconds, { y: end.y, rotation: 90, ease: 'sine.inOut' });
        await k.fade(g, 0, 0.5);
        k.remove(g);
      }),
    ),
  );
}

/** The motes of drifting sleepy-sand (k.ambient 'dust') fade away, once the sack is mended. */
function settleSand(k: Kit): Promise<void> {
  const motes = Array.from(document.querySelectorAll<HTMLElement>('.story-mote'));
  return motes.length ? k.fade(motes, 0, 2) : Promise.resolve();
}

/** The Land of Nod's opening picture: the backdrop, a soft light on the faces, and (while the sack is burst) sleepy-sand drifting. */
function nod(k: Kit, sandy: boolean): void {
  k.backdrop('land-of-nod');
  if (sandy) k.ambient('dust', { count: 30, area: [0, 60, 1180, 600] });
  k.light(640, 460, 600, { color: '#fff0dc', strength: 0.12, z: 36 });
}

/** Mollie, Peter, the sack and Old Dozy in their places in the Land of Nod, and the chair with Jigs on its arm. */
function nodCast(k: Kit, o: { tied: boolean; dozyPose?: string }): void {
  ride = chairRide.set(k, { ...NOD_CHAIR, wings: true, riders: [THREE[2]] });
  [cast.jigs] = ride.riders;
  cast.mollie = k.character('mollie', { ...MOLLIE_AT, z: 16 });
  cast.peter = k.character('peter', { ...PETER_AT, z: 16 });
  cast.sack = k.prop('sand-sack', { ...SACK_AT, z: 18 });
  if (o.tied) {
    k.set(k.part(cast.sack, 'bow'), { opacity: 1 });
    k.set(k.part(cast.sack, 'spill'), { opacity: 0 });
  }
  cast.dozy = k.character('dozy', { ...DOZY_AT, z: 14, pose: o.dozyPose });
}

/** The playroom at sunset: the evening sky in the window and the doorway, and a warm glow. */
function sunsetPlayroom(k: Kit): void {
  k.backdrop('playroom');
  k.add(sunsetWindow(), { x: 84, y: 148, w: 218, h: 316, z: 1 });
  k.add(sunsetDoor(), { x: 893, y: 160, w: 248, z: 1 });
  k.dim(0.2, '#7a4a8a');
  k.light(560, 460, 480, { color: '#ffd8a0', strength: 0.22 });
}

// ------------------------------------------------------------------ show

export default defineCartoon({
  ...meta,
  lines: {
    // 1. Sparkly sand
    sparkles: { who: 'mollie', text: 'Peter, look! Sparkly sand, floating in through the doors.' },
    peterYawns: { who: 'peter', text: 'Ooh, it’s pretty. But it makes me feel all… sleepy.' },
    sleepySand: { who: 'jigs', text: 'That’s sleepy-sand, from the Land of Nod! But the Sandman never spills a grain.' },
    letsHelp: { who: 'mollie', text: 'Then something’s wrong. Let’s go and help him!' },
    brushOff: { who: 'peter', text: 'First, the chair. I’ll brush the sand off with my hanky.' },
    wideAwake: { who: 'mollie', text: 'It’s wide awake now! Look, its wings!' },
    toNod: { who: 'jigs', text: 'To the Land of Nod, please, chair!' },
    // 2. The Land of Nod
    soPurple: { who: 'mollie', text: 'Oh, it’s all soft and purple. And the houses are wearing nightcaps!' },
    thereHeIs: { who: 'peter', text: 'Look! That must be the Sandman, fast asleep. Wake up, please!' },
    dozyHello: { who: 'dozy', text: 'Eh? Oh! Visitors! I’m Old Dozy, the Sandman.' },
    dozyTrip: { who: 'dozy', text: 'I tripped over a pillow, and my sack went pop. Now the sleepy-sand is everywhere.' },
    dozyNodding: { who: 'dozy', text: 'Everyone in Nod keeps nodding off. And the most important thing is…' },
    asleepAgain: { who: 'peter', text: 'He’s asleep again!' },
    whatThing: { who: 'mollie', text: 'Mr Dozy! What’s the most important thing?' },
    tuesday: { who: 'dozy', text: 'Eh? Oh, yes! Don’t stay in the sand too long, or you’ll sleep till next Tuesday!' },
    whoFlies: { who: 'peter', text: 'Next Tuesday? Then who would fly the chair home?' },
    jigsAwake: { who: 'jigs', text: 'Don’t worry. I’m wide awake! I’m as awake as a…' },
    jigsAsleep: { who: 'mollie', text: 'Oh no! Jigs has fallen asleep!' },
    chairSnores: { who: 'peter', text: 'And listen. The chair is snoring!' },
    // 3. Sweep it up
    quick: { who: 'mollie', text: 'Quick, Peter. Let’s get the sand back in the sack, before we fall asleep too.' },
    hereBroom: { who: 'dozy', text: 'Here’s my broom. Sweep it all into a heap.' },
    bigHeap: { who: 'mollie', text: 'Swish, swish! What a big, sparkly heap.' },
    holdSack: { who: 'peter', text: 'I’ll hold the sack open. In it goes!' },
    mollieSleepy: { who: 'mollie', text: 'Peter, I feel so… sleepy.' },
    keepAwake: { who: 'peter', text: 'Keep your eyes open, Mollie! We’re nearly done.' },
    stillHole: { who: 'dozy', text: 'Oh dear, there’s still a hole. And the most important thing is…' },
    mrDozy: { who: 'peter', text: 'Mr Dozy!' },
    tieItUp: { who: 'dozy', text: 'Eh? Oh! Is to tie it up tight!' },
    myRibbon: { who: 'mollie', text: 'Take my ribbon, Peter. You tie it.' },
    bigBow: { who: 'peter', text: 'One big bow. There! It’s mended.' },
    cleverKind: { who: 'dozy', text: 'Look, the sand has stopped drifting. Oh, you clever, kind children!' },
    howWake: { who: 'peter', text: 'But how do we wake up Jigs, and the chair?' },
    // 4. Wake up, Jigs!
    tryTickle: { who: 'dozy', text: 'Try a tickle. Here’s a feather from my pillow.' },
    tickleTickle: { who: 'mollie', text: 'Tickle, tickle, Jigs!' },
    jigsGiggles: { who: 'jigs', text: 'Hee hee! Stop it! I’m awake! Did I miss anything?' },
    everything: { who: 'peter', text: 'Only everything!' },
    myBell: { who: 'jigs', text: 'Leave the chair to me. It always wakes up for my bell.' },
    chairAwake: { who: 'mollie', text: 'Hooray! Its wings are up again!' },
    dozyThanks: { who: 'dozy', text: 'Thank you, friends. Here’s a pinch of my best sand, for the happiest dreams.' },
    goodbye: { who: 'mollie', text: 'Thank you, Mr Dozy! Goodbye!' },
    dozyBye: { who: 'dozy', text: 'Goodbye! And the most important thing is…' },
    sleepWell: { who: 'peter', text: 'Sleep well, Mr Dozy. Home, please, chair!' },
    // 5. Bedtime
    homeSunset: { who: 'peter', text: 'Home again! And look, the sun is going down.' },
    sprinkle: { who: 'mollie', text: 'Bedtime! Sprinkle Mr Dozy’s sand, Peter. Just a tiny pinch.' },
    everybodyYawns: { who: 'mollie', text: 'Everybody’s yawning! Even the chair.' },
    jigsMost: { who: 'jigs', text: 'Yes. And the most important thing is…' },
    nightChair: { who: 'mollie', text: 'Goodnight, Jigs. Goodnight, chair. Sweet dreams.' },
    end: { who: 'narrator', text: 'And that night, everybody had the very best dreams.' },
  },
  scenes: [
    // ==================================================== 1. Sparkly sand
    {
      name: 'Sparkly sand',
      set(k) {
        k.backdrop('playroom');
        k.light(560, 460, 480, { color: '#ffe8b0', strength: 0.15 });
        k.music('cosy');
        cast.jigs = k.character('jigs', { x: 100, y: 425, w: 190 });
        cast.mollie = k.character('mollie', { x: 280, y: 372, w: 240 });
        cast.peter = k.character('peter', { x: 510, y: 372, w: 240 });
        ride = chairRide.set(k, { x: 780, y: 280, w: 400 });
        cast.sand = k.add(cushionSand(), { x: 890, y: 478, w: 180, z: 16 });
        k.set(cast.sand, { opacity: 0 });
        cast.hanky = k.add(hanky(), { x: 690, y: 520, w: 80, z: 20 });
        k.set(cast.hanky, { opacity: 0 });
      },
      async play(k) {
        const { mollie, peter, jigs, sand, hanky: cloth } = cast;
        await k.wait(600);

        // Glittery grains float in through the doors and settle on the chair's cushion.
        sandTinkle();
        const floating = drift(k, [1020, 220], [980, 500], 9, 2.8);
        await k.wait(700);
        await k.say('sparkles', mollie);
        await floating;
        void k.fade(sand, 1, 0.8);
        await k.wait(400);
        await yawnBy(k, peter);
        await k.say('peterYawns', peter);

        // The chair creaks a slow, sleepy yawn.
        k.set([ride.chair, ride.front], { transformOrigin: '50% 100%' });
        creak();
        await k.to([ride.chair, ride.front], 1, { scaleY: 0.96, rotation: -2, ease: 'sine.inOut' });
        await k.to([ride.chair, ride.front], 1, { scaleY: 1, rotation: 0, ease: 'sine.inOut' });
        await k.all(k.shake(mollie, 3, 2), k.wait(300));

        // Jigs knows it at once.
        hatBell();
        await k.hop(jigs, 24, 1);
        await k.say('sleepySand', jigs);
        await k.hop(mollie, 20, 1);
        await k.say('letsHelp', mollie);

        // Peter brushes the sand off the cushion with his hanky, and the chair wakes up.
        await k.say('brushOff', peter);
        await k.appear(cloth, 0.4);
        await k.carry(cloth, [960, 500], 1.1);
        for (let i = 0; i < 3; i++) {
          swish();
          await k.to(cloth, 0.22, { x: '+=50', ease: 'sine.inOut' });
          await k.to(cloth, 0.22, { x: '-=50', ease: 'sine.inOut' });
        }
        void k.fade(sand, 0, 0.6);
        k.sparkle(980, 500, 10, 120);
        await k.vanish(cloth, 0.3);
        await wishing.wriggle(k, ride.chair, 3);
        k.flourish(ride.chair);
        k.music('adventure');
        await chairRide.wings(k, ride);
        await k.all(k.say('wideAwake', mollie), chairRide.flap(k, ride, 2));

        // Everyone climbs aboard, and off they fly out through the doors.
        await k.all(k.hop(mollie, 40, 1), k.hop(peter, 40, 1), k.hop(jigs, 40, 1));
        k.remove(mollie);
        k.remove(peter);
        k.remove(jigs);
        await k.all(...THREE.map((r) => chairRide.seat(k, ride, r)));
        await k.say('toNod', ride.riders[2]);
        highWind(3);
        await chairRide.fly(k, ride, { x: 760, y: -160, s: 2.4 });
      },
    },

    // ==================================================== 2. The Land of Nod
    {
      name: 'The Land of Nod',
      set(k) {
        nod(k, true);
        k.music('dreamy');
        ride = chairRide.set(k, { ...NOD_CHAIR, wings: true, riders: THREE });
        [cast.mollie, cast.peter, cast.jigs] = ride.riders;
        chairRide.jump(k, ride, { x: -800, y: -320 });
        cast.sack = k.prop('sand-sack', { ...SACK_AT, z: 18 });
        cast.dozy = k.character('dozy', { ...DOZY_AT, z: 14, pose: 'sleep' });
        k.set(cast.dozy, { rotation: -5, transformOrigin: '50% 100%' });
      },
      async play(k) {
        const { mollie, peter, jigs, dozy } = cast;
        let dozing = sleeping(k, dozy, snooze);

        // The chair glides down over the pillowy hills and settles.
        highWind(3);
        await chairRide.fly(k, ride, { x: 0, y: -16, s: 3 });
        k.fx.thud();
        await k.all(...[ride.chair, ...ride.riders, ride.front].map((el) => k.to(el, 0.25, { y: 0, ease: 'power2.in' })));
        await k.say('soPurple', mollie);

        // Mollie and Peter hop down; Jigs stays perched on the chair's arm.
        await chairRide.hopOff(k, ride, peter, PETER_AT);
        await chairRide.hopOff(k, ride, mollie, MOLLIE_AT);
        k.music('magic');
        await k.say('thereHeIs', peter);

        // Peter claps, and Old Dozy wakes with a start.
        clap();
        await k.wait(400);
        dozing();
        await wakeUp(k, dozy);
        await k.say('dozyHello', dozy);
        await k.say('dozyTrip', dozy);
        await k.say('dozyNodding', dozy);

        // ... and he is asleep again. A push in on him snoring.
        await dozeOff(k, dozy);
        dozing = sleeping(k, dozy, snooze);
        await k.camera({ zoom: 1.3, x: 940, y: 460 }, 1.2);
        await k.say('asleepAgain', peter);
        await k.camera({}, 0.9);
        await k.say('whatThing', mollie);
        dozing();
        await wakeUp(k, dozy);
        await k.say('tuesday', dozy);
        await k.all(k.say('whoFlies', peter), k.to(peter, 0.5, { x: '-=10' }));

        // "I'm wide awake!" says Jigs, and nods off on the chair's arm.
        await k.say('jigsAwake', jigs);
        yawn(true);
        k.set(jigs, { transformOrigin: '50% 100%' });
        await k.all(k.to(jigs, 1, { rotation: -12, ease: 'sine.inOut' }), k.fade(k.part(jigs, 'lids'), 1, 0.8));
        snooze();
        const jigsZ = sleeping(k, jigs);
        k.silence();
        await k.wait(600);
        await k.all(k.say('jigsAsleep', mollie), k.shake(mollie, 4, 2));

        // The chair's wings droop, and the chair begins to snore.
        await wishing.droop(k, ride.chair);
        await k.all(k.to(k.pivot(k.part(ride.chair, 'wingL')), 0.8, { rotation: DROOP, ease: 'sine.inOut' }), k.to(k.pivot(k.part(ride.chair, 'wingR')), 0.8, { rotation: -DROOP, ease: 'sine.inOut' }));
        chairSnore(2);
        k.set([ride.chair, ride.front], { transformOrigin: '50% 100%' });
        void k.to([ride.chair, ride.front], 1, { scaleY: 0.97, yoyo: true, repeat: 1, ease: 'sine.inOut' });
        await k.wait(1500);
        await k.say('chairSnores', peter);
        await k.wait(700);
        jigsZ();
      },
    },

    // ==================================================== 3. Sweep it up
    {
      name: 'Sweep it up',
      set(k) {
        nod(k, true);
        k.music('sneaky');
        nodCast(k, { tied: false });
        jigsAsleep(k, cast.jigs);
        wingsDown(k, ride.chair);
        cast.broom = k.add(broom(), { x: 1080, y: 420, w: 80, z: 19 });
        k.set(cast.broom, { opacity: 0 });
        cast.heap = k.add(heap(), { x: 560, y: 570, w: 170, z: 19 });
        k.set(cast.heap, { opacity: 0, scale: 0.3, transformOrigin: '50% 100%' });
        // Sleepy-sand spilt on the ground, for Mollie to sweep up.
        SPILT.forEach(([x, y], i) => (cast[`spilt${i}` as Name] = k.add(cushionSand(), { x, y, w: 110, z: 17 })));
        cast.ribbon = k.add(ribbon(), { x: 440, y: 420, w: 100, z: 20 });
        k.set(cast.ribbon, { opacity: 0 });
      },
      async play(k) {
        const { mollie, peter, jigs, dozy, sack, broom: brush, heap: pile, ribbon: bow } = cast;
        let jigsZ = sleeping(k, jigs, () => chairSnore());
        await k.wait(500);
        await k.say('quick', mollie);

        // Old Dozy lends Mollie his broom, and she sweeps the sand into a heap.
        await k.all(k.say('hereBroom', dozy), k.appear(brush, 0.4));
        await k.carry(brush, [600, 560], 1);
        k.set(brush, { transformOrigin: '50% 10%' });
        for (const [i, s] of [0.55, 0.8, 1].entries()) {
          const spilt = cast[`spilt${i}` as Name];
          swish();
          await k.to(brush, 0.3, { rotation: 18, ease: 'sine.inOut' });
          swish();
          await k.to(brush, 0.3, { rotation: -14, ease: 'sine.inOut' });
          await k.all(k.to(spilt, 0.4, { ...at(spilt, 645, 620), opacity: 0, scale: 0.5, ease: 'sine.in' }), k.to(pile, 0.4, { opacity: 1, scale: s, ease: 'sine.out' }));
        }
        await k.to(brush, 0.3, { rotation: 0 });
        k.flourish(pile);
        await k.hop(mollie, 16, 1);
        await k.say('bigHeap', mollie);
        void k.fade(brush, 0, 0.5);

        // Peter holds the sack open, and the heap goes in.
        await k.say('holdSack', peter);
        k.fx.boing();
        await k.to(sack, 0.4, { x: -30, ease: 'sine.inOut' });
        await k.carry(pile, [855, 500], 1.2);
        pour();
        await k.vanish(pile, 0.4);
        await k.pop(sack, 1.08);
        k.flourish(sack);
        await k.wait(500);

        // Mollie yawns and nearly nods off; Peter keeps her going.
        await yawnBy(k, mollie);
        k.set(mollie, { transformOrigin: '50% 100%' });
        await k.all(k.say('mollieSleepy', mollie), k.to(mollie, 1.2, { x: '-=6' }));
        await k.to(mollie, 0.8, { rotation: -6, ease: 'sine.inOut' });
        await k.say('keepAwake', peter);
        await k.to(mollie, 0.3, { rotation: 0, ease: 'power2.out' });
        await k.shake(mollie, 6, 2);
        await k.wait(400);

        // There's still a hole, and the most important thing is... zzz.
        await k.say('stillHole', dozy);
        await dozeOff(k, dozy);
        const dozing = sleeping(k, dozy, snooze);
        await k.wait(1000);
        await k.say('mrDozy', peter);
        dozing();
        await wakeUp(k, dozy);
        await k.say('tieItUp', dozy);

        // Mollie pulls the ribbon from her plait, and Peter ties the sack with a bow.
        const f = k.box(mollie).face;
        k.set(bow, { ...at(bow, f.x + 10, f.y + f.h * 0.75) });
        await k.all(k.say('myRibbon', mollie), k.appear(bow, 0.4));
        await k.carry(bow, [855, 512], 1.3);
        await k.hop(peter, 20, 1);
        void k.vanish(bow, 0.3);
        k.fx.twinkle();
        await k.all(k.fade(k.part(sack, 'bow'), 1, 0.6), k.fade(k.part(sack, 'spill'), 0, 0.8));
        k.flourish(sack);
        await k.say('bigBow', peter);

        // The drifting sand settles and fades away.
        k.music('cosy');
        await settleSand(k);
        k.pose(dozy, 'beam');
        await k.hop(dozy, 16, 1);
        await k.say('cleverKind', dozy);
        k.pose(dozy, 'default');
        await k.wait(400);

        // But Jigs and the chair are still fast asleep.
        jigsZ();
        jigsZ = sleeping(k, jigs, () => chairSnore());
        await k.wait(900);
        await k.say('howWake', peter);
        await k.wait(600);
        jigsZ();
      },
    },

    // ==================================================== 4. Wake up, Jigs!
    {
      name: 'Wake up, Jigs!',
      set(k) {
        nod(k, false);
        k.music('cosy');
        nodCast(k, { tied: true });
        jigsAsleep(k, cast.jigs);
        wingsDown(k, ride.chair);
        cast.feather = k.add(feather(), { x: 930, y: 260, w: 60, z: 22 });
        k.set(cast.feather, { opacity: 0 });
        cast.twist = k.add(twist(), { x: 1000, y: 280, w: 70, z: 22 });
        k.set(cast.twist, { opacity: 0 });
      },
      async play(k) {
        const { mollie, peter, jigs, dozy, feather: quill, twist: gift } = cast;
        const jigsZ = sleeping(k, jigs, () => chairSnore());
        await k.wait(500);

        // Old Dozy has a feather from his pillow, and Mollie tickles Jigs awake.
        await k.all(k.say('tryTickle', dozy), k.appear(quill, 0.4));
        await k.carry(quill, [560, 420], 1.3);
        await k.say('tickleTickle', mollie);
        await k.to(quill, 1.1, { ...at(quill, 150, 380), ease: 'sine.inOut' });
        giggle();
        await k.to(quill, 0.16, { rotation: 25, yoyo: true, repeat: 5, ease: 'sine.inOut' });
        giggle();
        jigsZ();
        await k.all(k.fade(k.part(jigs, 'lids'), 0, 0.3), k.to(jigs, 0.3, { rotation: 0, ease: 'power2.out' }));
        k.flourish(jigs);
        await k.hop(jigs, 30, 2);
        void k.vanish(quill, 0.4);
        await k.say('jigsGiggles', jigs);
        await k.all(k.say('everything', peter), k.shake(peter, 3, 2));

        // Jigs rings the bell on his hat, and the chair wakes up.
        await k.say('myBell', jigs);
        const [hat] = k.pivot(k.part(jigs, 'hat'));
        for (let i = 0; i < 2; i++) {
          hatBell();
          await k.to(hat, 0.18, { rotation: 14, yoyo: true, repeat: 1, ease: 'sine.inOut' });
          await k.to(hat, 0.18, { rotation: -14, yoyo: true, repeat: 1, ease: 'sine.inOut' });
        }
        await k.wait(300);
        const wings = [...k.pivot(k.part(ride.chair, 'wingL')), ...k.pivot(k.part(ride.chair, 'wingR'))];
        creak();
        await k.to(wings, 0.7, { rotation: 0, ease: 'back.out(1.6)' });
        await chairRide.flap(k, ride, 2);
        k.flourish(ride.chair);
        k.music('triumph');
        await k.hop(mollie, 30, 1);
        await k.say('chairAwake', mollie);
        k.music('cosy');

        // Old Dozy's thank-you: a twist of his very best sand.
        k.pose(dozy, 'beam');
        await k.say('dozyThanks', dozy);
        await k.appear(gift, 0.4);
        await k.carry(gift, [700, 520], 1.2);
        await k.all(k.say('goodbye', mollie), wave(k, mollie, 2));
        k.pose(dozy, 'default');
        await k.all(k.say('dozyBye', dozy), wave(k, dozy, 2));
        await dozeOff(k, dozy);
        const dozing = sleeping(k, dozy, snooze);
        await k.wait(800);
        await k.all(k.say('sleepWell', peter), k.shake(peter, 3, 2));

        // Mollie and Peter climb back in (the twist goes in Peter's pocket), and away they fly.
        void k.vanish(gift, 0.3);
        k.music('adventure');
        await k.all(k.hop(mollie, 40, 1), k.hop(peter, 40, 1));
        k.remove(mollie);
        k.remove(peter);
        await k.all(chairRide.seat(k, ride, THREE[0]), chairRide.seat(k, ride, THREE[1]));
        highWind(3);
        await chairRide.fly(k, ride, { x: 900, y: -420, s: 2.6 });
        dozing();
      },
    },

    // ==================================================== 5. Bedtime
    {
      name: 'Bedtime',
      set(k) {
        sunsetPlayroom(k);
        k.music('cosy');
        ride = chairRide.set(k, { x: 780, y: 280, w: 400, wings: true, riders: THREE });
        [cast.mollie, cast.peter, cast.jigs] = ride.riders;
        chairRide.jump(k, ride, { x: 0, y: -800 });
        cast.twist = k.add(twist(), { x: 560, y: 470, w: 70, z: 22 });
        k.set(cast.twist, { opacity: 0 });
      },
      async play(k) {
        const { mollie, peter, jigs, twist: gift } = cast;
        highWind(2);
        await chairRide.land(k, ride);
        await chairRide.hopOff(k, ride, mollie, { x: 200, y: 372, w: 240 });
        await chairRide.hopOff(k, ride, peter, { x: 450, y: 372, w: 240 });
        await k.say('homeSunset', peter);

        // Peter sprinkles the pinch of best-dreams sand, and it falls softly over them all.
        await k.say('sprinkle', mollie);
        await k.appear(gift, 0.4);
        await k.carry(gift, [600, 250], 1.2);
        await k.to(gift, 0.4, { rotation: 40, ease: 'sine.inOut' });
        sandTinkle();
        await k.all(drift(k, [600, 240], [440, 520], 7, 2.6), drift(k, [620, 240], [880, 500], 5, 2.6));
        k.flourish(gift);
        await k.vanish(gift, 0.4);
        await k.wait(400);

        // A yawn passed round: Peter, Mollie, Jigs, and even the chair.
        await yawnBy(k, peter);
        await k.wait(200);
        await yawnBy(k, mollie, true);
        await k.wait(200);
        await yawnBy(k, jigs, true);
        k.set([ride.chair, ride.front], { transformOrigin: '50% 100%' });
        creak();
        await k.to([ride.chair, ride.front, jigs], 0.9, { scaleY: 0.96, yoyo: true, repeat: 1, ease: 'sine.inOut' });
        await k.hop(mollie, 14, 1);
        await k.say('everybodyYawns', mollie);

        // Jigs begins "And the most important thing is..." and falls asleep on the chair's arm.
        await k.say('jigsMost', jigs);
        k.set(jigs, { transformOrigin: '50% 100%' });
        await k.all(k.to(jigs, 1, { rotation: -12, ease: 'sine.inOut' }), k.fade(k.part(jigs, 'lids'), 1, 0.8));
        snooze();
        sleeping(k, jigs);
        await k.wait(900);
        await k.say('nightChair', mollie);
        await warmEnding(k, { cast: [mollie, peter], end: 'end', music: 'dreamy', hops: 1, sparkleAt: [880, 360] });
      },
    },
  ],
});
