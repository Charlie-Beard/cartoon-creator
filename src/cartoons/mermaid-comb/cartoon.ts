/**
 * The Mermaid's Golden Comb: the Wishing-Chair flies the friends to a sunny
 * cove, where a little mermaid is crying because a grumpy old crab has taken
 * her golden comb.
 *
 *   1. The birthday bell (playroom). Jigs is showing off his new birthday
 *      bell: he'll keep it for ever and ever. Gulls cry through the open
 *      doors, the chair wriggles and grows its wings: it wants to go to the
 *      seaside. Peter grabs his bucket (you ALWAYS need a bucket at the
 *      seaside), and off they fly.
 *   2. Pearl (sky, then the cove). Someone is crying in a little cove below.
 *      They land on the sand: a young mermaid, Pearl, sits on a rock far
 *      from the sea. Old Nipper the crab took her golden comb; her hair is in
 *      tangles, she can't sing with tangles, and her song brings the tide in
 *      so she can swim home. Her tail is drying in the sun, so Peter fills
 *      his bucket at the rock pool and flings a big splash over it (deed).
 *      Then: clack, clack, CLACK from the cave. Pearl ducks behind her rock.
 *   3. Old Nipper (cove). The scary beat: silence, clacks, and a big red crab
 *      scuttles out of the dark cave, claws snapping: "Shiny things are MINE!"
 *      Cut back to Peter, brave. Peter offers a swap: a pebble. "A PEBBLE?
 *      Pah!" (and he keeps it anyway). Jigs, very quiet, offers his birthday
 *      bell: Pearl needs her comb more than he needs a bell. He rings it and
 *      gives it to Nipper (deed). "It's a swap! The comb's on my ledge. Fetch
 *      it yourselves!" Mollie will climb.
 *   4. The slippery rocks (cove). Mollie climbs the rock steps, slips on the
 *      seaweed, holds on, and takes the comb from the top of Nipper's heap of
 *      shiny things (deed). Why so many shiny things? His cave is dark, and
 *      shiny things twinkle like little stars; nobody ever comes to see Old
 *      Nipper. He shuffles back into his cave. Pearl pops up, Mollie throws
 *      her the comb, she catches it and combs out every tangle (deed).
 *   5. The tide comes in (cove, then the playroom). Pearl sings, and the
 *      tide rolls in over the sand. The chair doesn't like
 *      wet feet and flies up out of it. Old Nipper creeps out to listen:
 *      nobody ever sang for him before. Pearl will sing for him every
 *      evening: they'll be friends. Nipper gives Jigs his bell back (deed),
 *      and drops a little seaweed parcel in Peter's bucket: no peeking till
 *      home. Back in the playroom, Peter unwraps it: his pebble, polished
 *      till it shines like silver.
 *
 * Scary, never cruel (docs/STYLE.md): sound first (silence, far clacks,
 * then loud ones), a slow scuttle out of the dark and one push-in on the
 * snapping claws for two lines, then straight back to the heroes. Nipper
 * snaps the air and never pinches anyone; he hoards shiny things because he
 * is lonely, and he ends with a friend.
 *
 * The chair and its riders are the world's chairRide set piece. Pearl,
 * Old Nipper, the cove, Pearl's rock, the tide, the hoard and the golden
 * comb are in the wishing world (pearl.ts, nipper.ts, cove.ts). The bell,
 * bucket, pebbles, splash and parcel are drawn in art.ts; the gulls, sobs,
 * clacks, song and splashes are in sounds.ts.
 */
import { defineCartoon, type Kit } from '../../kit';
import { warmEnding } from '../../worlds/common/pieces';
import { moves as wishing, sounds } from '../../worlds/wishing/moves';
import { chairRide, type Ride } from '../../worlds/wishing/pieces';
import { birthdayBell, bucket, parcel, pebble, shinyPebble, splash } from './art';
import meta from './meta';
import { clack, clink, gulls, gurgle, pearlSong, slip, slosh, sobs, swish, tideRush } from './sounds';

const { creak, hatBell, highWind } = sounds;

// ------------------------------------------------------------- the cove
// Everything at the cove is placed from these, so the four cove scenes
// agree. The backdrop's sand runs from y 470 (ground line y 640); the rock
// steps are at the right: step 1 top y 560 (x 800-900), step 2 top y 460
// (x 860-960), the ledge top y 350 (x 930-1140), the cave under it.

/** Pearl's rock, and Pearl sitting behind it (the rock hides her from the waist down). */
const ROCK = { x: 10, y: 525, w: 330 };
const PEARL = { x: 40, y: 330, w: 240 };
/** Where the Wishing-Chair rests on the sand, behind the friends. */
const CHAIR = { x: 440, y: 330, w: 300 };
/** Where the friends stand in scenes 2 and 3 (bottom edges on the ground line). */
const SPOT = {
  mollie: { x: 255, y: 402, w: 210 },
  jigs: { x: 455, y: 470, w: 150 },
  peter: { x: 610, y: 392, w: 220 },
};
/** Old Nipper out in front of his cave (scene 3). */
const NIPPER = { x: 900, y: 350, w: 250 };
/** Nipper's heap of shiny things on the ledge, and the comb on top of it. */
const HOARD = { x: 1000, y: 290, w: 150 };
const COMB = { x: 1040, y: 284, w: 70 };
/** Peter's bucket, left on the sand by the rock pool. */
const BUCKET = { x: 790, y: 575, w: 70 };
/** Mollie climbing (scene 4): small, so she fits on the steps; her offsets for each step. */
const CLIMB = { x: 625, y: 447, w: 170 };
const STEPS: Record<'foot' | 'one' | 'two' | 'ledge', [number, number]> = {
  foot: [0, 0],
  one: [140, -80],
  two: [200, -180],
  ledge: [265, -290],
};
/** The tide prop: it starts below the stage and slides up by this much, its foam at y 595. */
const TIDE = { x: -60, y: 820, w: 1300 };
const TIDE_IN = -190;

const cast = {} as Record<string, HTMLElement>;
let ride: Ride;

/** The cove with Pearl's rock, the hoard (and the comb on it, unless taken) and the resting chair. */
function cove(k: Kit, o: { comb?: boolean; chair?: boolean; bucket?: boolean } = {}): void {
  k.backdrop('mermaid-cove');
  cast.rock = k.prop('cove-rock', { ...ROCK, z: 14 });
  cast.hoard = k.prop('cove-hoard', { ...HOARD, z: 6 });
  if (o.comb !== false) cast.comb = k.prop('comb-golden', { ...COMB, z: 7 });
  if (o.chair !== false) {
    ride = chairRide.set(k, { ...CHAIR });
    cast.chair = ride.chair;
  }
  if (o.bucket !== false) cast.bucket = k.add(bucket(), { ...BUCKET, z: 17 });
}

/** Old Nipper's claws open and shut, `times` times, with the clacks. */
async function claws(k: Kit, n: HTMLElement, times = 2, loud = false): Promise<void> {
  clack(times, 0.3, loud);
  const L = k.pivot(k.part(n, 'clawL'));
  const R = k.pivot(k.part(n, 'clawR'));
  await k.all(
    ...L.map((e) => k.to(e, 0.15, { rotation: -10, yoyo: true, repeat: times * 2 - 1, ease: 'sine.inOut' })),
    ...R.map((e) => k.to(e, 0.15, { rotation: 10, yoyo: true, repeat: times * 2 - 1, ease: 'sine.inOut' })),
  );
}

/** Pearl flicks her tail. */
async function flick(k: Kit, p: HTMLElement, times = 2): Promise<void> {
  const [tail] = k.pivot(k.part(p, 'tail'));
  if (tail) await k.to(tail, 0.2, { rotation: -12, yoyo: true, repeat: times * 2 - 1, ease: 'sine.inOut' });
}

/** A little hop in an arc from one offset to another (the climb up and down the rocks). */
async function hopTo(k: Kit, el: HTMLElement, from: [number, number], to: [number, number], s = 0.6): Promise<void> {
  k.fx.boing();
  await k.to(el, s / 2, { x: (from[0] + to[0]) / 2, y: Math.min(from[1], to[1]) - 50, ease: 'power1.out' });
  await k.to(el, s / 2, { x: to[0], y: to[1], ease: 'power1.in' });
  k.fx.thud();
}

/** The middle of a hand-held thing in front of someone: a point a little right of their middle, at chest height. */
function inHand(k: Kit, el: HTMLElement, side = 0.22): [number, number] {
  const b = k.box(el);
  return [b.x + b.w * (0.5 + side), b.y + b.h * 0.72];
}

/** Moves a small actor (its placed box w × h at x, y) so its middle is at a point, at once. */
function setMiddle(k: Kit, el: HTMLElement, placed: { x: number; y: number; w: number; h: number }, at: [number, number]): void {
  k.set(el, { x: at[0] - (placed.x + placed.w / 2), y: at[1] - (placed.y + placed.h / 2) });
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. The birthday bell
    jigsBell: { who: 'jigs', text: 'Ting-a-ling! Look at my birthday bell. Isn’t it shiny?' },
    forever: { who: 'jigs', text: 'I’m going to keep it for ever and ever.' },
    seagulls: { who: 'peter', text: 'Listen! Seagulls! I can smell the sea.' },
    seaside: { who: 'mollie', text: 'The chair’s wriggling. It wants to go to the seaside!' },
    bucket: { who: 'peter', text: 'Wait! I’m bringing my bucket. You ALWAYS need a bucket at the seaside!' },
    takeUs: { who: 'mollie', text: 'Take us to the seaside, please, chair!' },
    // 2. Pearl
    cove: { who: 'peter', text: 'There’s the sea! And a little sandy cove.' },
    crying: { who: 'mollie', text: 'Shh! Somebody down there is crying.' },
    mermaid: { who: 'mollie', text: 'Oh! A real mermaid! Hello. Why are you crying?' },
    tookComb: { who: 'pearl', text: 'I’m Pearl. Old Nipper the crab took my golden comb!' },
    tangles: { who: 'pearl', text: 'Now my hair’s all tangled. And I can’t sing with tangles.' },
    tide: { who: 'pearl', text: 'My song brings the tide in. Without the tide, I can’t swim home.' },
    dry: { who: 'pearl', text: 'And the sun is so hot. My tail is getting all dry.' },
    fillIt: { who: 'peter', text: 'My bucket! I’ll fill it at the rock pool.' },
    cool: { who: 'pearl', text: 'Ooh! Lovely and cool. Thank you, Peter!' },
    itsNipper: { who: 'pearl', text: 'Oh no. That clacking! It’s Old Nipper!' },
    // 3. Old Nipper
    whosThat: { who: 'nipper', text: 'Who’s that on MY beach? Clack, clack!' },
    mine: { who: 'nipper', text: 'Shiny things are MINE! All of them. MINE!' },
    please: { who: 'peter', text: 'Please, Mr Nipper. That golden comb is Pearl’s.' },
    finders: { who: 'nipper', text: 'Finders keepers! It’s the shiniest thing I’ve got.' },
    pebble: { who: 'peter', text: 'We could swap! Here’s a lovely pebble.' },
    pah: { who: 'nipper', text: 'A PEBBLE? Pah! That’s not shiny at all!' },
    keepIt: { who: 'nipper', text: 'I’ll keep it anyway. Mine!' },
    myBell: { who: 'jigs', text: 'You can have my birthday bell. It’s very shiny.' },
    loveBell: { who: 'mollie', text: 'Oh, Jigs! But you love your bell.' },
    needs: { who: 'jigs', text: 'Pearl needs her comb more than I need a bell.' },
    swap: { who: 'nipper', text: 'Ooh, ting-a-ling! It’s a swap. The comb’s on my ledge. Fetch it yourselves!' },
    climb: { who: 'mollie', text: 'I’ll climb up. I’m good at climbing!' },
    // 4. The slippery rocks
    slippery: { who: 'mollie', text: 'Whoa! The seaweed’s all slippery!' },
    holdOn: { who: 'peter', text: 'Hold on tight, Mollie!' },
    gotIt: { who: 'mollie', text: 'I’m up! And here’s Pearl’s golden comb.' },
    whyShiny: { who: 'peter', text: 'Why do you want so many shiny things, Nipper?' },
    dark: { who: 'nipper', text: 'My cave is so dark. Shiny things twinkle, like little stars.' },
    nobody: { who: 'nipper', text: 'Nobody ever comes to see Old Nipper.' },
    lonely: { who: 'jigs', text: 'Poor old Nipper. I think he’s lonely.' },
    catch: { who: 'mollie', text: 'Pearl! It’s safe now. Catch!' },
    combing: { who: 'pearl', text: 'My comb! Comb, comb, comb. Out come the tangles!' },
    canSing: { who: 'pearl', text: 'Now I can sing the tide in!' },
    // 5. The tide comes in
    seaComing: { who: 'peter', text: 'Look! The sea is coming in!' },
    wetFeet: { who: 'mollie', text: 'Ha! The chair doesn’t like wet feet!' },
    lovelySong: { who: 'nipper', text: 'What a lovely song. Nobody ever sang for me before.' },
    friends: { who: 'pearl', text: 'Then I’ll sing for you every evening, Nipper. Let’s be friends!' },
    yesPlease: { who: 'nipper', text: 'Friends? Oh, yes please! Clack, clack!' },
    yourBell: { who: 'nipper', text: 'Here, little pixie. Have your bell back. I’ve got a friend now.' },
    thanks: { who: 'jigs', text: 'My birthday bell! Thank you, Nipper!' },
    forPeter: { who: 'nipper', text: 'And this is for the boy with the bucket. No peeking till you’re home!' },
    goodbye: { who: 'pearl', text: 'Goodbye, friends! Come back and splash with me soon!' },
    peek: { who: 'peter', text: 'Now, what did Nipper put in my bucket?' },
    polished: { who: 'peter', text: 'It’s my pebble! He’s polished it till it shines!' },
    isShiny: { who: 'mollie', text: 'Now it IS shiny! Clever old Nipper.' },
    end: { who: 'narrator', text: 'And every evening, in the little cove, Pearl sings, and Old Nipper dances.' },
  },
  scenes: [
    // ==================================================== 1. The birthday bell
    {
      name: 'The birthday bell',
      set(k) {
        k.backdrop('playroom');
        k.music('cosy');
        k.light(1010, 380, 260, { color: '#fff3c8', strength: 0.25, z: 5 });
        ride = chairRide.set(k, { x: 380, y: 205, w: 480 });
        cast.chair = ride.chair;
        cast.mollie = k.character('mollie', { x: 30, y: 368, w: 240 });
        cast.jigs = k.character('jigs', { x: 290, y: 459, w: 160, z: 16 });
        cast.peter = k.character('peter', { x: 830, y: 372, w: 230, z: 11, flip: true });
        const [bx, by] = inHand(k, cast.jigs, 0.28);
        cast.bell = k.add(birthdayBell(), { x: bx - 20, y: by - 24, w: 40, z: 17 });
        cast.bucket = k.add(bucket(), { x: 745, y: 566, w: 80, z: 12 });
      },
      async play(k) {
        const { mollie, peter, jigs, chair, bell } = cast;
        await k.wait(400);
        // Jigs rings his birthday bell.
        hatBell();
        await k.to(bell, 0.12, { rotation: 18, yoyo: true, repeat: 5, ease: 'sine.inOut' });
        k.sparkle(k.box(bell).x + 20, k.box(bell).y + 24, 8, 70);
        await k.all(k.say('jigsBell', jigs), k.hop(jigs, 18, 1));
        await k.say('forever', jigs);
        await k.wait(300);

        // Gulls far off, and a sea breeze through the doors.
        gulls(3);
        highWind(2.2);
        await k.wait(900);
        await k.all(k.say('seagulls', peter), k.hop(peter, 16, 1));
        await wishing.wriggle(k, chair, 3);
        await k.say('seaside', mollie);
        k.music('magic');
        await chairRide.wings(k, ride);

        // Peter grabs his bucket.
        k.fx.pop();
        const [hx, hy] = inHand(k, peter, -0.25);
        await k.to(cast.bucket, 0.5, { x: hx - 785, y: hy - 606, ease: 'power2.out' });
        await k.say('bucket', peter);
        await k.wait(300);

        // Everybody hops on: the bell goes in Jigs's pocket, the bucket with Peter.
        k.music('adventure');
        await k.fade(bell, 0, 0.3);
        await k.hop(mollie, 40, 1);
        k.remove(mollie);
        cast.mollie = await chairRide.seat(k, ride, { id: 'mollie', slot: 'left' });
        await k.walk(peter, -170, 0.8, 3);
        await k.fade(cast.bucket, 0, 0.3);
        await k.hop(peter, 40, 1);
        k.remove(peter);
        cast.peter = await chairRide.seat(k, ride, { id: 'peter', slot: 'right' });
        await k.hop(jigs, 40, 1);
        k.remove(jigs);
        cast.jigs = await chairRide.seat(k, ride, { id: 'jigs', slot: 'arm', flip: true });
        await k.say('takeUs', cast.mollie);
        k.sfx.whoosh();
        highWind(3);
        await chairRide.fly(k, ride, { x: 900, y: -120, s: 2.2 });
      },
    },

    // ==================================================== 2. Pearl
    {
      name: 'Pearl',
      set(k) {
        k.backdrop('wishing-sky');
        k.music('adventure');
        ride = chairRide.set(k, {
          x: 340,
          y: 230,
          w: 440,
          wings: true,
          riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'arm', flip: true }],
        });
        [cast.mollie, cast.peter, cast.jigs] = ride.riders;
        chairRide.jump(k, ride, { x: -900, y: 0 });
      },
      async play(k) {
        highWind(3);
        await k.all(chairRide.fly(k, ride, { x: 0, s: 2.6 }), k.wait(1400).then(() => k.say('cove', cast.peter)));
        sobs(3);
        await k.wait(1200);
        await k.say('crying', cast.mollie);
        k.sfx.whoosh();
        await chairRide.fly(k, ride, { x: 300, y: 480, s: 1.6 });

        // A paper wipe to the cove; the chair comes down onto the sand.
        await k.cut(() => {
          cove(k, { chair: false, bucket: false });
          k.music('dreamy');
          cast.pearl = k.character('pearl', { ...PEARL, z: 12, pose: 'sad' });
          ride = chairRide.set(k, {
            ...CHAIR,
            wings: true,
            riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'arm', flip: true }],
          });
          cast.chair = ride.chair;
          [cast.mollie, cast.peter, cast.jigs] = ride.riders;
          chairRide.jump(k, ride, { x: -300, y: -420 });
          cast.bucket = k.add(bucket(), { ...BUCKET, z: 17 });
          k.set(cast.bucket, { opacity: 0 });
        });
        highWind(2);
        sobs(2);
        await chairRide.fly(k, ride, { x: 0, y: -40, s: 1.7 });
        await chairRide.land(k, ride);
        creak();

        // Out they hop onto the sand; Mollie first, straight to the mermaid.
        const { mollie, peter, jigs, pearl } = cast;
        await chairRide.hopOff(k, ride, mollie, SPOT.mollie);
        k.face(mollie, true);
        sobs(2);
        await k.all(k.say('mermaid', mollie), k.hop(mollie, 16, 1));
        await chairRide.hopOff(k, ride, jigs, SPOT.jigs);
        k.face(jigs, true);
        await chairRide.hopOff(k, ride, peter, SPOT.peter);
        k.face(peter, true);
        k.fx.pop();
        await k.appear(cast.bucket, 0.4);
        await k.say('tookComb', pearl);
        k.pose(pearl, 'default');
        await k.say('tangles', pearl);
        await k.say('tide', pearl);
        await k.all(k.say('dry', pearl), flick(k, pearl, 1));

        // Peter fills his bucket at the rock pool and flings a big splash over her tail.
        await k.all(k.say('fillIt', peter), k.hop(peter, 18, 1));
        k.face(peter, false);
        await k.all(k.walk(peter, 200, 1, 3), k.to(cast.bucket, 1, { x: 190, ease: 'power1.inOut' }));
        gurgle();
        await k.to(cast.bucket, 0.35, { x: 230, y: 50, ease: 'sine.inOut' });
        await k.wait(400);
        await k.to(cast.bucket, 0.35, { x: 150, y: -60, ease: 'sine.inOut' });
        k.face(peter, true);
        // The splash: up out of the bucket, over everyone's heads, down onto her tail.
        const wet = k.add(splash(), { x: 870, y: 470, w: 120, z: 30 });
        k.set(wet, { opacity: 0, scale: 0.4 });
        slosh();
        await k.to(cast.bucket, 0.2, { rotation: -50 });
        await k.to(wet, 0.25, { opacity: 1, scale: 1 });
        await k.to(wet, 0.5, { x: -320, y: -230, ease: 'power1.out' });
        await k.to(wet, 0.45, { x: -630, y: -10, ease: 'power1.in' });
        k.fx.splash();
        k.flourish(pearl);
        await k.all(k.fade(wet, 0, 0.4), k.to(cast.bucket, 0.3, { rotation: 0 }), flick(k, pearl, 3));
        k.remove(wet);
        await k.say('cool', pearl);
        await k.wait(400);

        // Clack, clack, CLACK, from the cave.
        k.silence();
        clack(2, 0.5);
        await k.wait(1200);
        clack(3, 0.3, true);
        await k.all(k.shake(jigs, 4, 3), k.shake(mollie, 3, 2), k.shake(peter, 3, 2));
        await k.say('itsNipper', pearl);
        await k.to(pearl, 0.6, { y: 150, opacity: 0, ease: 'power2.in' });
        await k.wait(600);
      },
    },

    // ==================================================== 3. Old Nipper
    {
      name: 'Old Nipper',
      set(k) {
        cove(k);
        cast.mollie = k.character('mollie', { ...SPOT.mollie, z: 16 });
        cast.jigs = k.character('jigs', { ...SPOT.jigs, z: 16 });
        cast.peter = k.character('peter', { ...SPOT.peter, z: 16 });
        cast.nipper = k.character('nipper', { ...NIPPER, z: 15 });
        k.set(cast.nipper, { opacity: 0, x: 60 });
        cast.pebble = k.add(pebble(), { x: 0, y: 0, w: 46, z: 20 });
        k.set(cast.pebble, { opacity: 0 });
        cast.bell = k.add(birthdayBell(), { x: 0, y: 0, w: 40, z: 20 });
        k.set(cast.bell, { opacity: 0 });
      },
      async play(k) {
        const { mollie, peter, jigs, nipper, pebble: peb, bell } = cast;
        // Sound first: a far clack, a nearer one, then the big ones.
        await k.wait(500);
        clack(1, 0.3);
        await k.wait(900);
        clack(2, 0.3);
        await k.shake(jigs, 4, 3);
        await k.wait(400);
        k.music('spooky');
        clack(3, 0.25, true);
        // He scuttles out of the dark, sideways, a little wobble at each step.
        void k.to(nipper, 0.18, { rotation: 4, yoyo: true, repeat: 7, ease: 'sine.inOut' });
        await k.to(nipper, 1.5, { opacity: 1, x: 0, ease: 'power1.out' });
        k.set(nipper, { rotation: 0 });
        k.pose(nipper, 'snap');
        k.fx.stomp(2, 0.3);
        await k.camera({ zoom: 1.35, x: 1000, y: 470 }, 1.2);
        await k.all(k.say('whosThat', nipper), claws(k, nipper, 2, true));
        await k.all(k.say('mine', nipper), k.quake(4));
        await claws(k, nipper, 3, true);

        // Cut back: wide, and Peter is brave.
        await k.camera({}, 0.9);
        k.music('sneaky');
        await k.wait(300);
        await k.to(peter, 0.4, { x: 30, ease: 'power2.out' });
        await k.say('please', peter);
        k.pose(nipper, 'default');
        await k.say('finders', nipper);

        // A pebble? Pah!
        const [px, py] = inHand(k, peter, 0.18);
        setMiddle(k, peb, { x: 0, y: 0, w: 46, h: 34 }, [px, py]);
        k.fx.pop();
        await k.fade(peb, 1, 0.3);
        await k.all(k.say('pebble', peter), k.to(peb, 0.3, { y: '-=20', yoyo: true, repeat: 1 }));
        k.pose(nipper, 'snap');
        await k.all(k.say('pah', nipper), claws(k, nipper, 1));
        // He snatches it anyway, and pops it behind his shell.
        clack(1, 0.2);
        const nb = k.box(nipper);
        await k.to(peb, 0.4, { x: `+=${nb.x + nb.w * 0.2 - px}`, y: `+=${nb.y + nb.h * 0.35 - py}`, ease: 'power2.out' });
        k.pose(nipper, 'default');
        await k.say('keepIt', nipper);
        await k.fade(peb, 0, 0.3);
        await k.wait(400);

        // Jigs, very quietly, offers his birthday bell.
        k.music('cosy');
        const [jx, jy] = inHand(k, jigs, 0.25);
        setMiddle(k, bell, { x: 0, y: 0, w: 40, h: 48 }, [jx, jy]);
        await k.fade(bell, 1, 0.4);
        await k.say('myBell', jigs);
        await k.say('loveBell', mollie);
        await k.say('needs', jigs);
        await k.wait(300);
        // He rings it, and gives it to Nipper.
        hatBell();
        await k.to(bell, 0.12, { rotation: 18, yoyo: true, repeat: 3, ease: 'sine.inOut' });
        await k.carry(bell, [nb.x + nb.w * 0.16, nb.y + nb.h * 0.32], 1.1);
        hatBell();
        k.pose(nipper, 'grin');
        await k.all(k.say('swap', nipper), k.to(bell, 0.12, { rotation: 18, yoyo: true, repeat: 5, ease: 'sine.inOut' }));
        k.music('adventure');
        await k.all(k.say('climb', mollie), k.hop(mollie, 22, 1));
        await k.wait(400);
      },
    },

    // ==================================================== 4. The slippery rocks
    {
      name: 'The slippery rocks',
      set(k) {
        cove(k);
        k.music('adventure');
        cast.pearl = k.character('pearl', { ...PEARL, z: 12 });
        k.set(cast.pearl, { y: 150, opacity: 0 });
        cast.jigs = k.character('jigs', { x: 280, y: 470, w: 150, z: 16 });
        cast.peter = k.character('peter', { x: 425, y: 392, w: 220, z: 16 });
        cast.nipper = k.character('nipper', { x: 960, y: 384, w: 215, z: 8, pose: 'grin' });
        const nb = k.box(cast.nipper);
        cast.bell = k.add(birthdayBell(), { x: nb.x + nb.w * 0.16 - 18, y: nb.y + nb.h * 0.32 - 22, w: 36, z: 9 });
        cast.mollie = k.character('mollie', { ...CLIMB, z: 18 });
      },
      async play(k) {
        const { mollie, peter, jigs, nipper, pearl, comb, bell } = cast;
        // Once picked up, the comb rides in front of everyone (it sat behind them on the ledge).
        comb.style.zIndex = '24';
        await k.wait(400);
        // Up the rocks: step one, then step two (slippery!), then the ledge.
        await k.camera({ zoom: 1.2, x: 800, y: 400 }, 1);
        await hopTo(k, mollie, STEPS.foot, STEPS.one);
        await k.wait(300);
        await hopTo(k, mollie, STEPS.one, STEPS.two);
        slip();
        await k.to(mollie, 0.14, { rotation: -8, x: '-=10', yoyo: true, repeat: 3, ease: 'sine.inOut' });
        await k.say('slippery', mollie);
        await k.all(k.say('holdOn', peter), k.shake(peter, 3, 2));
        await k.wait(200);
        await hopTo(k, mollie, STEPS.two, STEPS.ledge, 0.7);
        await k.wait(300);

        // She takes the comb from the top of the heap.
        const [cx, cy] = inHand(k, mollie, 0.3);
        await k.to(comb, 0.6, { x: cx - (COMB.x + 35), y: cy - (COMB.y + 18), ease: 'power2.inOut' });
        k.flourish(comb);
        await k.say('gotIt', mollie);
        await k.wait(300);

        // Why so many shiny things?
        k.music('cosy');
        await k.say('whyShiny', peter);
        k.pose(nipper, 'sulk');
        await k.say('dark', nipper);
        await k.say('nobody', nipper);
        // He shuffles back into his cave with the bell.
        await k.all(k.to(nipper, 1.2, { x: 50, opacity: 0, ease: 'power1.in' }), k.to(bell, 1.2, { x: 50, opacity: 0, ease: 'power1.in' }));
        await k.camera({}, 1);
        await k.say('lonely', jigs);
        await k.wait(300);

        // Down to step one, and Pearl pops up: catch!
        const before = k.box(comb);
        await k.all(hopTo(k, mollie, STEPS.ledge, STEPS.one, 0.7), k.to(comb, 0.7, { y: `+=${STEPS.one[1] - STEPS.ledge[1]}`, x: `+=${STEPS.one[0] - STEPS.ledge[0]}` }));
        void before;
        k.fx.boing();
        await k.to(pearl, 0.6, { y: 0, opacity: 1, ease: 'back.out(1.6)' });
        await k.say('catch', mollie);
        k.sfx.whoosh();
        const pb = k.box(pearl);
        await k.carry(comb, [pb.x + pb.w * 0.26, pb.y + pb.h * 0.36], 1.3);
        await flick(k, pearl, 2);

        // Comb, comb, comb: out come the tangles.
        const said = k.say('combing', pearl);
        for (let i = 0; i < 3; i++) {
          swish();
          await k.to(comb, 0.35, { y: '+=70', ease: 'sine.inOut' });
          await k.to(comb, 0.25, { y: '-=70', ease: 'sine.inOut' });
        }
        await said;
        k.pose(pearl, 'happy');
        k.fx.twinkle();
        k.flourish(pearl);
        await k.fade(comb, 0, 0.4);
        await k.all(k.say('canSing', pearl), flick(k, pearl, 2));
        await k.wait(400);
      },
    },

    // ==================================================== 5. The tide comes in
    {
      name: 'The tide comes in',
      set(k) {
        cove(k, { comb: false });
        k.music('dreamy');
        cast.pearl = k.character('pearl', { ...PEARL, z: 12, pose: 'happy' });
        cast.jigs = k.character('jigs', { x: 280, y: 470, w: 150, z: 16 });
        cast.peter = k.character('peter', { x: 425, y: 392, w: 220, z: 16 });
        cast.mollie = k.character('mollie', { x: 640, y: 402, w: 210, z: 16, flip: true });
        cast.tide = k.prop('cove-tide', { ...TIDE, z: 19 });
      },
      async play(k) {
        const { mollie, peter, jigs, pearl, tide, chair } = cast;
        await k.wait(300);
        // Pearl sings, and the tide rolls in over the sand.
        k.pose(pearl, 'sing');
        k.silence();
        pearlSong();
        k.sparkle(160, 360, 10, 120);
        await k.wait(1200);
        k.music('dreamy');
        tideRush(4);
        void k.to(tide, 4, { y: TIDE_IN, ease: 'sine.out' });
        await k.wait(1400);
        await k.all(k.say('seaComing', peter), k.shake(peter, 3, 2));
        k.fx.splash();
        await k.hop(jigs, 30, 2);
        void k.to(tide, 1.4, { y: TIDE_IN - 8, yoyo: true, repeat: -1, ease: 'sine.inOut' });

        // The chair doesn't like wet feet: it grows its wings and lifts out of the water.
        await wishing.wriggle(k, chair, 3);
        await chairRide.wings(k, ride);
        k.sfx.whoosh();
        await chairRide.fly(k, ride, { y: -150, s: 1.4 });
        await k.all(k.say('wetFeet', mollie), k.hop(mollie, 24, 1));
        pearlSong();
        k.sparkle(160, 360, 10, 120);
        await k.wait(900);

        // Closer: Old Nipper creeps out of his cave to listen.
        await k.cut(() => {
          void k.camera({}, 0);
          cove(k, { comb: false, chair: false, bucket: false });
          k.music('dreamy');
          cast.nipper = k.character('nipper', { x: 925, y: 365, w: 230, z: 15, pose: 'sulk' });
          const nb = k.box(cast.nipper);
          cast.bell = k.add(birthdayBell(), { x: nb.x + nb.w * 0.16 - 18, y: nb.y + nb.h * 0.32 - 22, w: 36, z: 16 });
          k.set([cast.nipper, cast.bell], { opacity: 0, x: 40 });
          cast.pearl = k.character('pearl', { x: 420, y: 400, w: 230, z: 12, pose: 'happy' });
          cast.jigs = k.character('jigs', { x: 670, y: 455, w: 150, z: 16 });
          cast.bucket = k.add(bucket(), { x: 820, y: 492, w: 70, z: 17 });
          cast.parcel = k.add(parcel(), { x: 0, y: 0, w: 44, z: 20 });
          k.set(cast.parcel, { opacity: 0 });
          cast.tide = k.prop('cove-tide', { ...TIDE, z: 19 });
          k.set(cast.tide, { y: TIDE_IN });
          void k.camera({ zoom: 1.3, x: 800, y: 470 }, 0);
        });
        const { nipper, bell, parcel: gift, bucket: pail } = cast;
        const p2 = cast.pearl;
        const j2 = cast.jigs;
        void k.to(cast.tide, 1.4, { y: TIDE_IN - 8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        clack(1, 0.3);
        await k.all(k.to(nipper, 1.4, { opacity: 1, x: 0, ease: 'power1.out' }), k.to(bell, 1.4, { opacity: 1, x: 0, ease: 'power1.out' }));
        await k.say('lovelySong', nipper);
        await k.all(k.say('friends', p2), flick(k, p2, 2));
        k.pose(nipper, 'grin');
        k.music('triumph');
        await k.all(k.say('yesPlease', nipper), claws(k, nipper, 2));
        await k.wait(200);

        // He gives Jigs his bell back.
        await k.say('yourBell', nipper);
        const jb = k.box(j2);
        await k.carry(bell, [jb.x + jb.w * 0.72, jb.y + jb.h * 0.6], 1);
        hatBell();
        await k.all(k.say('thanks', j2), k.hop(j2, 26, 1), k.hop(bell, 26, 1));

        // And a little seaweed parcel for Peter's bucket.
        const nb = k.box(nipper);
        setMiddle(k, gift, { x: 0, y: 0, w: 44, h: 36 }, [nb.x + nb.w * 0.16, nb.y + nb.h * 0.32]);
        await k.fade(gift, 1, 0.3);
        await k.say('forPeter', nipper);
        const bb = k.box(pail);
        await k.to(gift, 0.7, { x: `+=${bb.x + bb.w / 2 - (nb.x + nb.w * 0.16)}`, y: `+=${bb.y + 10 - (nb.y + nb.h * 0.32)}`, ease: 'power1.inOut' });
        clink();
        await k.fade(gift, 0, 0.2);
        await k.wait(300);

        // Goodbye: Pearl dives into the waves.
        await k.all(k.say('goodbye', p2), flick(k, p2, 2));
        k.fx.splash();
        k.puff(535, 600, 160, '#e9f6f8');
        await k.to(p2, 0.6, { y: 220, ease: 'power2.in' });
        await k.wait(500);

        // Home again.
        await k.cut(() => {
          void k.camera({}, 0);
          k.backdrop('playroom');
          k.music('cosy');
          k.light(1010, 380, 240, { color: '#fff3c8', strength: 0.3, z: 5 });
          ride = chairRide.set(k, { x: 380, y: 220, w: 440 });
          cast.chair = ride.chair;
          cast.mollie = k.character('mollie', { x: 110, y: 368, w: 240 });
          cast.jigs = k.character('jigs', { x: 400, y: 459, w: 160, z: 16 });
          cast.peter = k.character('peter', { x: 860, y: 372, w: 230, flip: true });
          cast.bucket = k.add(bucket(), { x: 780, y: 560, w: 90, z: 12 });
          const jb2 = k.box(cast.jigs);
          cast.bell = k.add(birthdayBell(), { x: jb2.x + jb2.w * 0.72 - 20, y: jb2.y + jb2.h * 0.6 - 24, w: 40, z: 17 });
          cast.parcel = k.add(parcel(), { x: 803, y: 552, w: 44, z: 11 });
          cast.shiny = k.add(shinyPebble(), { x: 0, y: 0, w: 72, z: 18 });
          k.set(cast.shiny, { opacity: 0 });
        });
        const { mollie: m, peter: p, jigs: j, parcel: wrap, shiny, bell: b } = cast;
        await k.wait(400);
        await k.say('peek', p);
        // Out of the bucket comes the seaweed parcel; Peter unwraps it.
        k.fx.pop();
        await k.to(wrap, 0.6, { y: -110, ease: 'power2.out' });
        const wb = k.box(wrap);
        setMiddle(k, shiny, { x: 0, y: 0, w: 72, h: 53 }, [wb.x + wb.w / 2, wb.y + wb.h / 2]);
        k.sfx.rustle();
        await k.all(k.fade(wrap, 0, 0.4), k.fade(shiny, 1, 0.4));
        k.fx.twinkle();
        k.sparkle(wb.x + wb.w / 2, wb.y + wb.h / 2, 10, 90);
        await k.all(k.say('polished', p), k.hop(p, 24, 1));
        await k.say('isShiny', m);
        hatBell();
        await k.to(b, 0.12, { rotation: 18, yoyo: true, repeat: 3, ease: 'sine.inOut' });
        await warmEnding(k, { cast: [m, j, p], end: 'end', music: 'cosy' });
      },
    },
  ],
});
