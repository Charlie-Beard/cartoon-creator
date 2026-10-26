/**
 * The Island That Swam Away: on the hottest day of the summer the
 * Wishing-Chair flies the friends to a tiny island, but the island is a
 * grumpy whale with an old net tangled round his tail.
 *
 *   1. The hottest day (playroom). Everyone is flopped in the heat. Mollie
 *      wishes for the seaside, the chair wriggles and grows its wings, and
 *      Peter, by the doors, flings them wide open (deed). They hop on and
 *      fly out into the sunshine.
 *   2. A tiny island (sky, then sea). Peter spots the sea, Mollie a tiny island
 *      with one palm tree. The chair lands and folds its wings to rest.
 *      They build a sandcastle, and Mollie puts a pink shell on the top
 *      (deed). Then the ground wobbles: the island is swimming away, and
 *      the chair's wings have gone!
 *   3. Old Barnacle (sea). The scary beat: the island rumbles and tips, and
 *      a HUGE eye opens beside them. A whale rises and booms "WHO is
 *      tickling my BACK?" and blows a great spout. Cut back to Mollie, small
 *      and brave: "Let's be brave." She says sorry, and Old Barnacle
 *      says he is only grumpy because an old net on his tail itches.
 *      Jigs and Peter run down his back and pull the net off (big deed),
 *      and carry it overboard. He wiggles his tail, blows a happy spout and
 *      offers to take them home.
 *   4. Home on a whale (sea, then playroom). He swims them to the white
 *      cliffs, but the water is too shallow to go further and the
 *      chair's wings are still asleep. Jigs knows a trick: chairs are VERY
 *      ticklish. He tickles a leg with a seagull feather and the wings pop
 *      out (deed). Goodbye to Old Barnacle. Back in the playroom, damp and
 *      laughing, Mollie puts the shell on the windowsill, holds it to her
 *      ear and hears a deep, happy whale song.
 *
 * Scary, never cruel (docs/STYLE.md): sound first (a low rumble, then
 * silence), a slow push in on one huge eye, one booming line and a spout,
 * then straight back to the heroes. Old Barnacle touches nobody; he is cross
 * only because his tail itches.
 *
 * The chair and its riders are the world's chairRide set piece; Old Barnacle and
 * his back (the island) are the world's `whale` and `whale-back`. The shut
 * doors, the sandcastle, shell, feather, net, spout and puddles are drawn in
 * art.ts, and the whale's song and spouts in sounds.ts.
 */
import { defineCartoon, type Kit } from '../../kit';
import { moves as commonMoves } from '../../worlds/common/moves';
import { warmEnding } from '../../worlds/common/pieces';
import { moves as wishing, sounds } from '../../worlds/wishing/moves';
import { chairRide, type Ride } from '../../worlds/wishing/pieces';
import { doors, feather, net as netArt, puddle, sandcastle, shell, spout } from './art';
import meta from './meta';
import { chairGiggle, drip, happySpout, spoutBlast, tickle, whaleRumble, whaleSong } from './sounds';

const { creak, hatBell, highWind } = sounds;
const { together, wave } = commonMoves;

// ------------------------------------------------------------ the island
// Everything on Old Barnacle's back is placed from these, so the three sea
// scenes agree. The whale-back prop (960 × 300) is drawn at 1.2 times, with
// its sand top at y 463; the heroes stand with their feet at y 482, just behind the lip,
// so their chests and arms show above the sand; the chair's legs rest on the lip.

const GROUND = 482;
const BACK = { x: 10, y: 240, w: 1152 };
const CHAIR = { x: 255, y: 215, w: 300 };
const HEAD = { x: -90, y: 147, w: 400 };
/** Where someone w wide stands with their feet on the sand at x. */
const stand = (x: number, w: number): { x: number; y: number; w: number } => ({ x, y: GROUND - Math.round((w * 340) / 300), w });
const SPOT = { jigs: stand(455, 125), mollie: stand(575, 160), peter: stand(805, 160) };
const CASTLE = { x: 700, y: 470, w: 90 };
/** The middle of the top of the sandcastle wall: where the pink shell sits. */
const CASTLE_TOP: [number, number] = [745, 490];

const cast = {} as Record<string, HTMLElement>;
let ride: Ride;

/** Everything that rides up and down with the whale's back. */
const onBack = (): HTMLElement[] =>
  ['back', 'front', 'chair', 'chairFront', 'jigs', 'mollie', 'peter', 'castle', 'shell', 'net'].map((id) => cast[id]).filter((el): el is HTMLElement => !!el && el.isConnected);

/** The sea, Old Barnacle's back with its net, and the sandcastle with its shell. */
function island(k: Kit, o: { net?: boolean; chair?: boolean } = {}): void {
  k.backdrop('open-sea');
  cast.back = k.prop('whale-back', { ...BACK, z: 8 });
  cast.front = k.prop('whale-back-front', { ...BACK, z: 15 });
  if (o.net !== false) cast.net = k.add(netArt(), { x: 965, y: 330, w: 200, z: 9 });
  cast.castle = k.add(sandcastle(), { ...CASTLE, z: 16 });
  cast.shell = k.add(shell(), { x: CASTLE_TOP[0] - 20, y: CASTLE_TOP[1] - 18, w: 40, z: 17 });
  if (o.chair !== false) {
    ride = chairRide.set(k, { ...CHAIR });
    cast.chair = ride.chair;
    cast.chairFront = ride.front;
  }
}

/** Old Barnacle's head, risen on the left. Eye shut (lids on) and hidden below the waves until he rises. */
function head(k: Kit, pose?: 'happy'): HTMLElement {
  const el = k.character('whale', { ...HEAD, z: 11, pose });
  return el;
}

/** A great spout from his blowhole (top left of his head). */
async function blow(k: Kit, kind: 'big' | 'happy'): Promise<void> {
  const s = cast.spout;
  k.set(s, { opacity: 1, scaleY: 0.05, transformOrigin: '50% 100%' });
  if (kind === 'big') spoutBlast();
  else happySpout();
  await k.to(s, 0.7, { scaleY: 1, ease: 'power2.out' });
  await k.to(s, 0.9, { opacity: 0, y: '+=10', ease: 'sine.in' });
  k.fx.splash();
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. The hottest day
    phew: { who: 'peter', text: 'Phew! It’s the hottest day of the whole summer.' },
    wish: { who: 'mollie', text: 'I wish we were at the seaside. With cool, splashy waves.' },
    creak: { who: 'jigs', text: 'Did you hear that? The chair wants to go too!' },
    wings: { who: 'jigs', text: 'Its wings are out! Quick, everybody on!' },
    doors: { who: 'peter', text: 'Wait! I’ll fling the doors open wide!' },
    breeze: { who: 'mollie', text: 'Ooh, what a lovely cool breeze!' },
    takeUs: { who: 'mollie', text: 'Take us to the sea, please, chair!' },
    // 2. A tiny island
    seaLook: { who: 'peter', text: 'Look! The sea! It goes on for ever and ever!' },
    island: { who: 'mollie', text: 'And there’s a tiny island, with one little palm tree.' },
    cool: { who: 'mollie', text: 'Ooh, the sea looks so cool and splashy. And look, a little beach!' },
    rest: { who: 'jigs', text: 'The chair’s tired. Its wings need a good long rest.' },
    build: { who: 'peter', text: 'Let’s build a sandcastle!' },
    shell: { who: 'mollie', text: 'I’ll put this pink shell on top!' },
    lovely: { who: 'jigs', text: 'It’s the best sandcastle in the whole world. Even the shell is pink!' },
    wobble: { who: 'peter', text: 'Did the island just… wobble?' },
    swimming: { who: 'mollie', text: 'It’s moving! The island is swimming away!' },
    wingsGone: { who: 'jigs', text: 'And the chair’s wings have gone!' },
    // 3. Old Barnacle
    growl: { who: 'jigs', text: 'Shh! Was that the sea growling?' },
    whoTickle: { who: 'whale', text: 'WHO is tickling my BACK?' },
    barnacle: { who: 'whale', text: 'I am Old Barnacle, and I am trying to SLEEP!' },
    brave: { who: 'mollie', text: 'Let’s be brave.' },
    sorry: { who: 'mollie', text: 'Sorry! We thought you were an island.' },
    hrmph: { who: 'whale', text: 'Hrmph! An island, indeed! Do I look like an island?' },
    everybody: { who: 'whale', text: 'Everybody thinks that. Nobody ever asks why I’m so grumpy.' },
    why: { who: 'peter', text: 'Why ARE you grumpy?' },
    net: { who: 'whale', text: 'An old net is stuck on my tail. It itches and itches!' },
    getOff: { who: 'jigs', text: 'Then we’ll get it off! Come on, Peter!' },
    tug: { who: 'peter', text: 'Heave! Tug, tug, tug!' },
    itsOff: { who: 'jigs', text: 'It’s off! The net is off. Hooray!' },
    better: { who: 'whale', text: 'Ohhh, that’s much better!' },
    takeYou: { who: 'whale', text: 'Thank you, little friends. Where shall I take you?' },
    home: { who: 'mollie', text: 'Home, please!' },
    // 4. Home on a whale
    faster: { who: 'peter', text: 'Wheee! This is faster than a boat!' },
    shallow: { who: 'whale', text: 'This is as far as I go. The water is too shallow.' },
    stillAsleep: { who: 'mollie', text: 'Oh no! But the chair’s wings are still fast asleep!' },
    trick: { who: 'jigs', text: 'I know a trick. Chairs are VERY ticklish.' },
    poppedOut: { who: 'mollie', text: 'It worked! The wings are out!' },
    bye: { who: 'mollie', text: 'Goodbye, Old Barnacle! Thank you!' },
    byeWhale: { who: 'whale', text: 'Goodbye! Come and play again!' },
    soaking: { who: 'peter', text: 'We’re soaking! Even my socks are full of sea.' },
    listen: { who: 'mollie', text: 'Listen. He’s singing. It’s such a happy song.' },
    end: { who: 'narrator', text: 'And far away, Old Barnacle swam home, humming a happy song.' },
  },
  scenes: [
    // ==================================================== 1. The hottest day
    {
      name: 'The hottest day',
      set(k) {
        k.backdrop('playroom');
        k.music('cosy');
        k.light(590, 300, 520, { color: '#ffd98a', strength: 0.16, z: 5 });
        cast.doors = k.add(doors(), { x: 892, y: 150, w: 248, z: 3 });
        ride = chairRide.set(k, { x: 380, y: 205, w: 480 });
        cast.chair = ride.chair;
        cast.mollie = k.character('mollie', { x: 30, y: 368, w: 240 });
        cast.jigs = k.character('jigs', { x: 290, y: 459, w: 160 });
        cast.peter = k.character('peter', { x: 830, y: 372, w: 230, z: 11, flip: true });
        // flopped in the heat
        k.set(cast.mollie, { rotation: -4 });
        k.set(cast.jigs, { rotation: 5 });
        k.set(cast.peter, { rotation: 4 });
      },
      async play(k) {
        const { mollie, peter, jigs, chair, doors: shut } = cast;
        await k.wait(500);
        await k.all(k.say('phew', peter), k.shake(peter, 3, 2));
        // Mollie fans herself while she wishes.
        const [arm] = k.pivot(k.part(mollie, 'armR'));
        void k.to(arm, 0.22, { rotation: -26, yoyo: true, repeat: 9, ease: 'sine.inOut' });
        await k.say('wish', mollie);
        await k.wait(400);

        // The chair wriggles: it wants to go too.
        await wishing.wriggle(k, chair, 3);
        hatBell();
        await k.all(k.say('creak', jigs), k.hop(jigs, 24, 1));
        k.music('magic');
        await k.all(k.to(mollie, 0.5, { rotation: 0 }), k.to(jigs, 0.5, { rotation: 0 }), k.to(peter, 0.5, { rotation: 0 }));
        await chairRide.wings(k, ride);
        await k.all(k.say('wings', jigs), k.hop(jigs, 24, 1));

        // Peter flings the doors open.
        await k.say('doors', peter);
        k.fx.creak();
        const [leafL] = k.pivot(k.part(shut, 'leafL'));
        const [leafR] = k.pivot(k.part(shut, 'leafR'));
        highWind(2.4);
        await k.all(k.to(leafL, 1, { scaleX: 0.1, ease: 'power2.in' }), k.to(leafR, 1, { scaleX: 0.1, ease: 'power2.in' }));
        k.fx.thud();
        k.flourish(shut);
        await k.glow('#fff3c8', 0.35, 1.2);
        await k.all(k.say('breeze', mollie), k.hop(mollie, 20, 1));

        // Everybody hops on.
        k.music('adventure');
        await k.walk(peter, -230, 0.9, 3);
        await k.hop(mollie, 40, 1);
        k.remove(mollie);
        cast.mollie = await chairRide.seat(k, ride, { id: 'mollie', slot: 'left' });
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

    // ==================================================== 2. A tiny island
    {
      name: 'A tiny island',
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
        await k.all(chairRide.fly(k, ride, { x: 0, s: 2.8 }), k.wait(1500).then(() => k.say('seaLook', cast.peter)));
        await k.say('island', cast.mollie);

        // A paper wipe to the sea; the chair comes in over the little island.
        await k.cut(() => {
          island(k, { chair: false });
          k.music('dreamy');
          ride = chairRide.set(k, {
            ...CHAIR,
            wings: true,
            riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'arm', flip: true }],
          });
          cast.chair = ride.chair;
          cast.chairFront = ride.front;
          [cast.mollie, cast.peter, cast.jigs] = ride.riders;
          chairRide.jump(k, ride, { x: -900, y: -70 });
          k.set([cast.castle, cast.shell], { opacity: 0 });
        });
        highWind(2);
        await k.all(chairRide.fly(k, ride, { x: 0, s: 3 }), k.wait(900).then(() => k.say('cool', cast.mollie)));
        await chairRide.land(k, ride);
        creak();

        // Out they hop, onto the sand; the chair rests, its wings folded.
        const { mollie, peter, jigs } = cast;
        await chairRide.hopOff(k, ride, mollie, SPOT.mollie);
        mollie.style.zIndex = '12';
        await chairRide.hopOff(k, ride, peter, SPOT.peter);
        peter.style.zIndex = '12';
        k.face(peter, true);
        await chairRide.hopOff(k, ride, jigs, SPOT.jigs);
        jigs.style.zIndex = '12';
        k.face(jigs, false);
        await k.all(k.say('rest', jigs), k.hop(jigs, 16, 1));

        // The sandcastle: dig, dig, dig, and up it comes.
        await k.say('build', peter);
        k.fx.patter(10, 0.1);
        await k.all(k.to(mollie, 0.14, { rotation: 5, yoyo: true, repeat: 7 }), k.to(peter, 0.14, { rotation: -5, yoyo: true, repeat: 7 }));
        k.fx.pop();
        await k.appear(cast.castle, 0.6);
        await k.wait(500);

        // Mollie puts a pink shell on top.
        const hand: [number, number] = [680, 440];
        k.set(cast.shell, { x: hand[0] - CASTLE_TOP[0], y: hand[1] - CASTLE_TOP[1] });
        await k.say('shell', mollie);
        await k.appear(cast.shell, 0.4);
        await k.carry(cast.shell, CASTLE_TOP, 1);
        k.fx.pop();
        await k.wait(500);
        await k.all(k.say('lovely', jigs), k.hop(jigs, 20, 1));

        // The ground wobbles.
        k.silence();
        await k.wait(500);
        whaleRumble(2.2);
        const [palm] = k.pivot(k.part(cast.back, 'palm'));
        void k.to(palm, 0.25, { rotation: 5, yoyo: true, repeat: 5, ease: 'sine.inOut' });
        await k.all(k.quake(5), together(k, onBack(), 0.5, { y: '-=14', ease: 'sine.inOut', yoyo: true, repeat: 3 }));
        await k.all(k.say('wobble', peter), k.shake(peter, 3, 2));
        k.fx.rumble(1.6);
        await k.all(k.quake(8), k.shake(mollie, 4, 3), k.shake(jigs, 4, 3));
        await k.say('swimming', mollie);
        // The wings have gone: the chair sits, empty and still.
        await k.all(k.say('wingsGone', jigs), k.shake(jigs, 4, 2));
        k.fx.uhoh();
        await k.all(k.quake(10), together(k, onBack(), 0.7, { y: '-=26', ease: 'sine.inOut' }));
        k.fx.rumble(2);
        await k.wait(600);
      },
    },

    // ==================================================== 3. Old Barnacle
    {
      name: 'Old Barnacle',
      set(k) {
        island(k);
        k.music('dreamy');
        cast.jigs = k.character('jigs', { ...SPOT.jigs, z: 12 });
        cast.mollie = k.character('mollie', { ...SPOT.mollie, z: 12 });
        cast.peter = k.character('peter', { ...SPOT.peter, z: 12, flip: true });
        cast.spout = k.add(spout(), { x: 0, y: 34, w: 90, z: 20 });
        cast.whale = head(k);
        k.set(cast.spout, { opacity: 0 });
        k.set(cast.whale, { opacity: 0, y: 150 });
        k.set(k.part(cast.whale, 'lids'), { opacity: 1 });
        k.set(onBack(), { y: '-=26' });
      },
      async play(k) {
        const { mollie, peter, jigs, whale, back, net } = cast;
        // Sound first: the rumble, then silence.
        k.fx.rumble(1.6);
        await k.all(k.quake(8), k.shake(mollie, 4, 3), k.shake(peter, 4, 3), k.shake(jigs, 4, 3));
        await k.say('growl', jigs);
        k.silence();
        await k.wait(700);
        // The whale rises out of the sea beside the island, eye still shut.
        whaleRumble(2.6);
        k.music('spooky');
        k.puff(130, 590, 200, '#f1f7f5');
        await k.all(k.to(whale, 2, { opacity: 1, y: 0, ease: 'power2.out' }), together(k, onBack(), 1.4, { y: '+=26', ease: 'sine.inOut' }));
        k.fx.splash();
        await k.wait(500);

        // A HUGE eye opens right beside them.
        await k.camera({ zoom: 1.6, x: 230, y: 340 }, 1.4);
        k.sfx.ominous();
        await k.fade(k.part(whale, 'lids'), 0, 1.6);
        await k.wait(500);
        void blow(k, 'big');
        await k.all(k.say('whoTickle', whale), k.quake(5));
        await k.say('barnacle', whale);
        await k.wait(300);

        // Cut back: wide shot, and Mollie is brave.
        await k.camera({}, 1);
        k.music('sneaky');
        await k.say('brave', mollie);
        await k.all(k.say('sorry', mollie), k.hop(mollie, 14, 1));
        await k.say('hrmph', whale);
        k.music('cosy');
        await k.say('everybody', whale);
        await k.all(k.say('why', peter), k.hop(peter, 20, 1));

        // His tail itches.
        const [tail] = k.pivot(k.part(back, 'tail'));
        void k.to(net, 0.16, { rotation: 5, x: 6, yoyo: true, repeat: 5, ease: 'sine.inOut' });
        void k.to(tail, 0.16, { rotation: 5, yoyo: true, repeat: 5, ease: 'sine.inOut' });
        await k.say('net', whale);
        k.fx.uhoh();
        await k.all(k.say('getOff', jigs), k.hop(jigs, 24, 1));

        // Peter and Jigs run down his back to the tail.
        hatBell();
        void k.walk(peter, 180, 1.1, 4);
        await k.wait(350);
        await k.to(jigs, 0.45, { x: '+=170', y: '-=120', ease: 'power1.out' });
        await k.to(jigs, 0.35, { x: '+=120', y: '+=120', ease: 'power1.in' });
        k.fx.thud();
        await k.to(jigs, 0.45, { x: '+=130', y: '+=14', ease: 'power1.inOut' });

        // The big deed: tug, tug, tug, and the net comes off with a pop.
        await k.all(k.say('tug', peter), pull(k, [peter, jigs], net));
        k.fx.pop();
        await k.to(net, 0.4, { x: '-=70', y: '-=30', rotation: -14, ease: 'power2.out' });
        k.flourish(net);
        await k.all(k.say('itsOff', jigs), k.hop(jigs, 20, 1));
        await k.carry(net, [900, 640], 1.1);
        k.fx.splash();
        k.puff(900, 640, 150, '#f1f7f5');
        await k.vanish(net, 0.3);
        await k.wait(400);

        // Relief: a wiggle, a happy spout and a sigh.
        k.pose(whale, 'happy');
        k.music('triumph');
        void k.to(tail, 0.2, { rotation: 10, yoyo: true, repeat: 5, ease: 'sine.inOut' });
        await k.all(k.say('better', whale), blow(k, 'happy'));
        await k.say('takeYou', whale);
        await k.all(k.say('home', mollie), k.hop(mollie, 20, 1));
        // Off they go: the waves rush.
        k.fx.wind(2.4);
        k.sfx.whoosh();
        await k.all(k.quake(5), together(k, onBack(), 0.6, { y: '-=10', yoyo: true, repeat: 3, ease: 'sine.inOut' }));
        await k.wait(400);
      },
    },

    // ==================================================== 4. Home on a whale
    {
      name: 'Home on a whale',
      set(k) {
        island(k, { net: false });
        k.music('adventure');
        cast.jigs = k.character('jigs', { ...SPOT.jigs, z: 12 });
        cast.mollie = k.character('mollie', { ...SPOT.mollie, z: 12 });
        cast.peter = k.character('peter', { ...SPOT.peter, z: 12, flip: true });
        cast.whale = head(k, 'happy');
        cast.feather = k.add(feather(), { x: SPOT.jigs.x + 80, y: SPOT.jigs.y + 32, w: 34, z: 18 });
        k.set(cast.feather, { opacity: 0, rotation: 30 });
        cast.spout = k.add(spout(), { x: 0, y: 34, w: 90, z: 20 });
        k.set(cast.spout, { opacity: 0 });
      },
      async play(k) {
        const { mollie, peter, jigs, whale } = cast;
        // Swimming for the white cliffs: the island bobs along.
        k.fx.wind(3);
        void together(k, onBack(), 0.9, { y: '-=8', yoyo: true, repeat: 5, ease: 'sine.inOut' });
        k.puff(60, 590, 160, '#f1f7f5');
        await k.wait(900);
        await k.all(k.say('faster', peter), k.hop(peter, 22, 1));
        k.puff(120, 596, 160, '#f1f7f5');
        await k.wait(1200);

        // He stops: too shallow.
        k.fx.thud();
        await k.say('shallow', whale);
        await k.all(k.say('stillAsleep', mollie), k.shake(mollie, 3, 2));
        await k.wait(300);

        // Jigs's trick: a seagull feather, and a very ticklish chair.
        await k.all(k.say('trick', jigs), k.hop(jigs, 22, 1));
        hatBell();
        await k.appear(cast.feather, 0.4);
        const tickleAt: [number, number] = [CHAIR.x + 232, CHAIR.y + 221];
        await k.to(cast.feather, 0.8, { x: tickleAt[0] - (SPOT.jigs.x + 97), y: tickleAt[1] - (SPOT.jigs.y + 49), rotation: 10 });
        tickle();
        const stir = k.to(cast.feather, 0.09, { rotation: 36, yoyo: true, repeat: 9, ease: 'sine.inOut' });
        chairGiggle();
        await k.all(stir, wishing.wriggle(k, cast.chair, 5));
        k.music('magic');
        await chairRide.wings(k, ride);
        k.flourish(cast.chair);
        await k.all(k.say('poppedOut', mollie), k.hop(mollie, 24, 1));
        await k.vanish(cast.feather, 0.3);

        // Everyone climbs aboard.
        k.music('adventure');
        await k.hop(mollie, 36, 1);
        k.remove(mollie);
        cast.mollie = await chairRide.seat(k, ride, { id: 'mollie', slot: 'left' });
        await k.hop(peter, 36, 1);
        k.remove(peter);
        cast.peter = await chairRide.seat(k, ride, { id: 'peter', slot: 'right' });
        await k.hop(jigs, 36, 1);
        k.remove(jigs);
        cast.jigs = await chairRide.seat(k, ride, { id: 'jigs', slot: 'arm', flip: true });

        // Goodbye.
        await k.all(k.say('bye', cast.mollie), wave(k, cast.mollie));
        await k.all(k.say('byeWhale', whale), blow(k, 'happy'));
        k.sfx.whoosh();
        highWind(3);
        await chairRide.fly(k, ride, { x: -150, y: -460, s: 2.2, tilt: -8 });

        // Back in the playroom, damp and laughing.
        await k.cut(() => {
          k.backdrop('playroom');
          k.music('cosy');
          k.light(1010, 380, 240, { color: '#fff3c8', strength: 0.3, z: 5 });
          ride = chairRide.set(k, { x: 460, y: 240, w: 440 });
          cast.chair = ride.chair;
          cast.mollie = k.character('mollie', { x: 150, y: 368, w: 240 });
          cast.jigs = k.character('jigs', { x: 400, y: 459, w: 160 });
          cast.peter = k.character('peter', { x: 880, y: 372, w: 230, flip: true });
          for (const [x, w] of [[170, 200], [400, 150], [900, 200]]) k.add(puddle(), { x, y: 628, w, z: 4 });
          cast.shell = k.add(shell(), { x: 270, y: 560, w: 50, z: 20 });
          k.set(cast.shell, { opacity: 0 });
        });
        const { mollie: m, peter: p, jigs: j } = cast;
        await k.all(k.say('soaking', p), k.shake(p, 4, 3));
        // Jigs wrings out his hat.
        const [hat] = k.pivot(k.part(j, 'hat'));
        drip(4);
        await k.to(hat, 0.22, { rotation: 22, yoyo: true, repeat: 5, ease: 'sine.inOut' });
        sounds.hatBell();
        await k.wait(500);

        // The pink shell goes on the windowsill. Mollie holds it to her ear.
        await k.appear(cast.shell, 0.4);
        await k.carry(cast.shell, [92, 456], 1);
        await k.wait(600);
        const ear = k.box(m).face;
        // the shell's own place is x 270, y 560, w 50 (its middle at 295, 582): move its middle to Mollie's ear
        await k.to(cast.shell, 1.1, { x: ear.x - 4 - 295, y: ear.cy + 6 - 582, rotation: -20, ease: 'sine.inOut' });
        await k.say('listen', m);
        whaleSong();
        k.music('dreamy');
        await k.wait(6200);
        await warmEnding(k, { cast: [m, p, j], end: 'end', music: 'cosy' });
      },
    },
  ],
});

/** Peter and Jigs lean back and pull, three times, and the net creeps along with each pull. */
async function pull(k: Kit, pullers: HTMLElement[], net: HTMLElement): Promise<void> {
  for (let i = 0; i < 3; i++) {
    k.fx.creak();
    await k.all(...pullers.map((el) => k.to(el, 0.3, { x: '-=14', ease: 'power1.out' })), k.to(net, 0.3, { x: '+=0', rotation: -3 - i * 2 }));
    k.fx.thud();
    await k.all(...pullers.map((el) => k.to(el, 0.2, { x: '+=14', ease: 'power1.in' })), k.to(net, 0.2, { rotation: 0 }));
  }
}
