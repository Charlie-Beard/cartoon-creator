/**
 * The Witch's Lost Cat: on Hallowe'en a young witch called Hazel taps at the
 * playroom window. Her black cat Midnight has run into the Whispering Wood,
 * and her broomstick won't fly without him. The friends find him by his
 * shining eyes, high in the tallest tree, and bring him down on the
 * Wishing-Chair.
 *
 *   1. Tap, tap, tap. Hallowe'en evening in the playroom. Peter lights the
 *      pumpkin lantern on the windowsill (a soft glow fades up inside).
 *      Tap, tap, tap: a little witch on a broom, going round and round in
 *      circles, is at the window. Hazel is in a flutter: Midnight chased a
 *      bat into the Whispering Wood, and her broom just goes round and
 *      round without him. Mollie says they will find him. Peter carries the
 *      pumpkin to the chair for a light, the chair grows its wings, and off
 *      they fly, Hazel wobbling behind.
 *   2. The Whispering Wood. Past a big round moon, then down onto a mossy
 *      path. The wind in the trees really does whisper. Mollie carries the
 *      pumpkin lantern ahead, and calls for Midnight. An owl hoots, and
 *      Jigs hoots back. Then the trees creak, a long spiky shadow stretches
 *      across the path and looms: everyone freezes. Cut back to Mollie, who
 *      lifts the lantern: it's only a holly bush. Be brave. And high above,
 *      two round green eyes open in the dark.
 *   3. Up the tallest tree. Jigs spots the eyes at the top of the tallest
 *      tree: Midnight, too scared to come down. Peter can't climb that high,
 *      but the Wishing-Chair can. Hazel has a saucer of his favourite milk,
 *      which Mollie takes. The chair rises, branch by branch. Mollie holds
 *      the saucer out, very still: Midnight sniffs, steps on, laps, and
 *      climbs into her lap, purring. The chair floats down.
 *   4. Pumpkins all glowing. Midnight goes back to Hazel, and her broom
 *      flies straight at last. Her thank-you spell makes the toadstools and
 *      a row of pumpkins glow, one by one. A race home through the sky, past
 *      the moon, and cat biscuits in the playroom. A tinkle of a bell:
 *      Hazel and Midnight zoom past the window for one last wave.
 *
 * Scary, never cruel (docs/STYLE.md): the wood is dark but blue-violet and
 * kind. Sound first (silence, an owl, creaks, a low drone), then a shadow
 * with wild spiky "hair" looms, and it is cut back to the heroes at once:
 * only a holly bush in the moonlight. Midnight is scared and stuck, never
 * hurt, and Hazel is a kind, scatterbrained witch, never a frightening one.
 *
 * The chair and its riders are the world's chairRide set piece. Witch Hazel,
 * Midnight and the Whispering Wood are new in the wishing world. The
 * pumpkin lantern, the owl, the bat, the eyes, the shadow, the saucer and
 * the cat biscuits are drawn here (art.ts); the miaows and the match are in
 * sounds.ts.
 */
import { defineCartoon, type Kit } from '../../kit';
import { moves as commonMoves } from '../../worlds/common/moves';
import { warmEnding } from '../../worlds/common/pieces';
import { moves as wishing, sounds } from '../../worlds/wishing/moves';
import { chairRide, type Ride } from '../../worlds/wishing/pieces';
import { bat, bigMoon, biscuitTin, catBiscuit, glowEyes, hollyBush, owl, pumpkin, saucer, spikyShadow } from './art';
import meta from './meta';
import { crunch, drone, flutter, glowChime, lightPumpkin, miaow, purr, whispers } from './sounds';

const { hatBell, highWind } = sounds;
const { wave } = commonMoves;

// ------------------------------------------------------------------ cast

type Name =
  | 'mollie' | 'peter' | 'jigs' | 'hazel' | 'midnight'
  | 'pumpkin' | 'lamp' | 'saucer' | 'eyes' | 'owl' | 'bat' | 'shadow' | 'holly' | 'moon'
  | 'tin' | 'biscuit1' | 'biscuit2' | 'biscuit3';
const cast = {} as Record<Name, HTMLElement>;
let ride: Ride;

/** The pumpkin's width everywhere. */
const PUMPKIN_W = 110;

/** Where the toadstools glow in the wood (their caps, as painted in the backdrop), with the colour of each. */
const TOADSTOOLS: [number, number, string][] = [
  [90, 600, '#ff9fd0'],
  [150, 664, '#9fffd8'],
  [214, 632, '#ffd88a'],
  [296, 620, '#ffd88a'],
  [826, 636, '#9fffd8'],
  [880, 612, '#ff9fd0'],
  [1010, 668, '#9fffd8'],
  [1090, 612, '#ffd88a'],
];

/** Where the spell's pumpkins stand along the path in the wood (their middles). */
const SPELL_PUMPKINS: [number, number][] = [[250, 612], [330, 650], [440, 672], [620, 674], [740, 652], [830, 616]];

// ------------------------------------------------------------- helpers

/** The `x` and `y` offsets that put an actor's middle on a stage point (from where it was placed). */
function at(el: HTMLElement, cx: number, cy: number): { x: number; y: number } {
  const l = parseFloat(el.style.left) || 0;
  const t = parseFloat(el.style.top) || 0;
  const w = parseFloat(el.style.width) || 0;
  const h = parseFloat(el.style.height) || 0;
  return { x: cx - (l + w / 2), y: cy - (t + h / 2) };
}

/** Flies the whole ride, and anything riding along with it, by the same amount. */
async function flyWith(k: Kit, r: Ride, extras: HTMLElement[], o: { x?: number; y?: number; s?: number; flaps?: number; tilt?: number }): Promise<void> {
  const s = o.s ?? 1.6;
  const here = k.box(r.chair);
  const dx = o.x === undefined ? 0 : o.x - (here.x - r.at.x);
  const dy = o.y === undefined ? 0 : o.y - (here.y - r.at.y);
  await k.all(chairRide.fly(k, r, o), ...extras.map((el) => k.to(el, s, { x: `+=${dx}`, y: `+=${dy}`, ease: 'sine.inOut' })));
}

/** Puts anything at an offset at once (in `set`: off stage, ready to fly in). */
function jumpWith(k: Kit, extras: HTMLElement[], o: { x?: number; y?: number }): void {
  for (const el of extras) k.set(el, { x: o.x ?? 0, y: o.y ?? 0 });
}

/** Hazel's broom going round and round: a loop in the air that ends where it began. */
async function circles(k: Kit, el: HTMLElement, times = 2): Promise<void> {
  const half = 0.55;
  await k.all(
    k.to(el, half, { x: 60, yoyo: true, repeat: times * 2 - 1, ease: 'sine.inOut' }),
    k.wait(half * 500).then(() => k.to(el, half, { y: -50, yoyo: true, repeat: times * 2 - 1, ease: 'sine.inOut' })),
  );
}

/** Hazel's wobbly flying: a slow rock from side to side, alongside whatever else is moving. */
function wobble(k: Kit, el: HTMLElement, times = 3): Promise<void> {
  return k.to(el, 0.5, { rotation: 7, yoyo: true, repeat: times * 2 - 1, ease: 'sine.inOut' });
}

/** The night flight's opening picture: dim dusk sky, stars, the big moon. */
function nightSky(k: Kit): void {
  k.backdrop('wishing-sky');
  k.dim(0.62, '#141a5c');
  k.ambient('stars', { count: 22, area: [0, 0, 1180, 420], z: 32 });
  cast.moon = k.add(bigMoon(), { x: 780, y: 40, w: 340, z: 3 });
  k.light(950, 200, 280, { color: '#e8e8ff', strength: 0.16, z: 34 });
}

/** The playroom at dusk, with the pumpkin on the sill (lit, or not yet). */
function duskPlayroom(k: Kit, lit: boolean): void {
  k.backdrop('playroom');
  k.dim(0.3, '#1c2268');
  k.light(520, 470, 440, { color: '#ffe2a0', strength: 0.2 });
  cast.pumpkin = k.add(pumpkin(), { x: 70, y: 365, w: PUMPKIN_W, z: 14 });
  cast.lamp = k.light(125, 425, 190, { color: '#ffb347', strength: lit ? 0.5 : 0, z: 36 });
  if (lit) k.set(k.part(cast.pumpkin, 'glow'), { opacity: 1 });
}

/** The wood's opening picture: backdrop, a few fireflies, cool light on the faces. */
function woodBackdrop(k: Kit): void {
  k.backdrop('whispering-wood');
  k.ambient('fireflies', { count: 8, area: [180, 380, 800, 260] });
  k.light(560, 470, 560, { color: '#d8d0ff', strength: 0.13, z: 36 });
}

/** Two glowing eyes in the dark, where Midnight clings to the top branch of the tallest tree. */
function placeEyes(k: Kit, visible: boolean): void {
  cast.eyes = k.add(glowEyes(), { x: 806, y: 126, w: 68, z: 6 });
  k.set(cast.eyes, { opacity: visible ? 1 : 0 });
}

/** The three friends sat in the chair: Mollie and Peter on the seat, Jigs on the left arm. */
const THREE = (a: 'mollie' | 'peter'): { id: string; slot: 'left' | 'right' | 'armL' }[] => [
  { id: 'mollie', slot: a === 'mollie' ? 'right' : 'left' },
  { id: 'peter', slot: a === 'mollie' ? 'left' : 'right' },
  { id: 'jigs', slot: 'armL' },
];

// ------------------------------------------------------------------ show

export default defineCartoon({
  ...meta,
  lines: {
    // 1. Tap, tap, tap
    hallowe: { who: 'peter', text: 'It’s Hallowe’en! Let’s light our pumpkin.' },
    happyPumpkin: { who: 'mollie', text: 'Ooh, he looks so happy! What a big, glowing smile.' },
    tapTap: { who: 'mollie', text: 'Listen! Tap, tap, tap at the window.' },
    itsAWitch: { who: 'jigs', text: 'It’s a witch! A little one!' },
    hazelHelp: { who: 'witchHazel', text: 'Oh, please help! I’m Hazel. My cat Midnight chased a bat into the Whispering Wood!' },
    hazelBroom: { who: 'witchHazel', text: 'And my broomstick won’t fly without him! It just goes round and round.' },
    findHim: { who: 'mollie', text: 'Don’t worry, Hazel. We’ll find him.' },
    bringPumpkin: { who: 'peter', text: 'Bring the pumpkin! We’ll need a light.' },
    holdTight: { who: 'jigs', text: 'Hold tight! The chair is growing its wings.' },
    // 2. The Whispering Wood
    bigMoon: { who: 'peter', text: 'What a big, bright moon! It’s as round as a plate.' },
    hazelThere: { who: 'witchHazel', text: 'There! That’s the Whispering Wood!' },
    itWhispers: { who: 'peter', text: 'It really does whisper. Listen to the trees.' },
    carryPumpkin: { who: 'mollie', text: 'I’ll carry the pumpkin, so we can see.' },
    callMidnight: { who: 'mollie', text: 'Midnight! Here, puss!' },
    owlJigs: { who: 'jigs', text: 'Too-whit too-woo yourself, Mister Owl!' },
    spikyShadow: { who: 'peter', text: 'Look at that shadow! It’s got spiky hair!' },
    hazelEek: { who: 'witchHazel', text: 'Eek! What is it?' },
    onlyBush: { who: 'mollie', text: 'It’s only a holly bush. Let’s be brave.' },
    peterLaughs: { who: 'peter', text: 'Ha ha! Only a bush. I wasn’t scared. Well, a tiny bit.' },
    watching: { who: 'witchHazel', text: 'Oh! Something is watching us!' },
    // 3. Up the tallest tree
    greenEyes: { who: 'jigs', text: 'Look! Two green eyes, right at the top of the tallest tree!' },
    hazelStuck: { who: 'witchHazel', text: 'Midnight! Oh, he’s stuck. He’s too scared to come down.' },
    tooHigh: { who: 'peter', text: 'It’s far too high to climb. Even for me, and I’m good at climbing.' },
    notChair: { who: 'jigs', text: 'But not too high for the Wishing-Chair!' },
    favourite: { who: 'mollie', text: 'Hazel, what does Midnight love best?' },
    hazelMilk: { who: 'witchHazel', text: 'Milk! I always bring a saucer, just in case.' },
    holdLantern: { who: 'mollie', text: 'Perfect! Peter, hold the lantern. I’ll hold the milk.' },
    upWeGo: { who: 'peter', text: 'All aboard! Up we go, chair!' },
    helloMidnight: { who: 'mollie', text: 'Hello, Midnight. Look what I’ve got.' },
    keepStill: { who: 'peter', text: 'Shh. Keep very still, Mollie.' },
    foundHim: { who: 'witchHazel', text: 'You found him! Oh, thank you, thank you!' },
    // 4. Pumpkins all glowing
    hazelHug: { who: 'witchHazel', text: 'Oh, Midnight! Don’t ever run off again!' },
    broomFlies: { who: 'witchHazel', text: 'It works! My broom flies straight!' },
    thankSpell: { who: 'witchHazel', text: 'And now, a thank-you spell!' },
    allGlowing: { who: 'mollie', text: 'Look! The toadstools and pumpkins are all glowing!' },
    race: { who: 'peter', text: 'A race home! Ready, steady, go!' },
    winning: { who: 'jigs', text: 'The chair’s winning! Go on, chair!' },
    homeAgain: { who: 'jigs', text: 'Home again, safe and sound!' },
    catBiscuits: { who: 'peter', text: 'Cat biscuits for everyone!' },
    catShaped: { who: 'mollie', text: 'Look, they’re shaped like little cats!' },
    happyHallowe: { who: 'mollie', text: 'Happy Hallowe’en, Midnight!' },
    end: { who: 'narrator', text: 'And the pumpkin glowed on the windowsill all night long, smiling.' },
  },
  scenes: [
    // ==================================================== 1. Tap, tap, tap
    {
      name: 'Tap, tap, tap',
      set(k) {
        duskPlayroom(k, false);
        k.music('cosy');
        cast.peter = k.character('peter', { x: 175, y: 372, w: 240 });
        cast.mollie = k.character('mollie', { x: 410, y: 372, w: 240 });
        cast.jigs = k.character('jigs', { x: 650, y: 425, w: 190 });
        ride = chairRide.set(k, { x: 780, y: 280, w: 400 });
        cast.hazel = k.character('witchHazel', { x: 140, y: 160, w: 190, z: 8, pose: 'flying' });
        k.set(cast.hazel, { opacity: 0 });
      },
      async play(k) {
        const { peter, mollie, jigs, hazel, pumpkin: lantern, lamp } = cast;
        await k.wait(600);
        await k.say('hallowe', peter);

        // Peter lights the pumpkin: a match, and a soft glow fading up inside.
        const [armL] = k.pivot(k.part(peter, 'armL'));
        await k.to(armL, 0.5, { rotation: 55, ease: 'sine.inOut' });
        lightPumpkin();
        await k.wait(450);
        await k.all(k.fade(k.part(lantern, 'glow'), 1, 1.6), k.fade(lamp, 0.5, 1.6));
        k.flourish(lantern);
        await k.to(armL, 0.5, { rotation: 0, ease: 'sine.inOut' });
        await k.all(k.say('happyPumpkin', mollie), k.hop(mollie, 20, 1));
        await k.wait(500);

        // Tap, tap, tap: a witch on a broom, going round and round.
        k.silence();
        k.fx.knock(3);
        await k.say('tapTap', mollie);
        k.music('magic');
        void k.fade(hazel, 1, 0.4);
        const spin = circles(k, hazel, 2);
        await k.say('itsAWitch', jigs);
        await spin;
        await k.say('hazelHelp', hazel);
        await k.say('hazelBroom', hazel);
        await circles(k, hazel, 1);
        await k.all(k.say('findHim', mollie), k.hop(mollie, 20, 1));

        // Peter carries the pumpkin to the chair, for a light.
        await k.say('bringPumpkin', peter);
        void k.fade(lamp, 0, 0.8);
        await k.carry(lantern, [ride.at.x + 60, ride.at.y + 140], 1.4);
        k.set(lantern, { zIndex: 20 });

        // The chair wriggles, grows its wings, and they all climb aboard.
        await wishing.wriggle(k, ride.chair, 3);
        k.music('adventure');
        await chairRide.wings(k, ride);
        await k.all(k.say('holdTight', jigs), chairRide.flap(k, ride, 2));
        await k.all(k.hop(mollie, 40, 1), k.hop(peter, 40, 1), k.hop(jigs, 40, 1));
        k.remove(mollie);
        k.remove(peter);
        k.remove(jigs);
        await k.all(...THREE('mollie').map((r) => chairRide.seat(k, ride, r)));

        // Off they fly, out through the doors, Hazel wobbling after them.
        highWind(3);
        void wobble(k, hazel, 4);
        const fly = flyWith(k, ride, [lantern], { x: 760, y: -160, s: 2.4 });
        await k.wait(500);
        await k.to(hazel, 1.8, { x: 700, y: -120, ease: 'sine.inOut' });
        await fly;
      },
    },

    // ==================================================== 2. The Whispering Wood
    {
      name: 'The Whispering Wood',
      set(k) {
        nightSky(k);
        k.music('dreamy');
        ride = chairRide.set(k, { x: 250, y: 250, w: 440, wings: true, riders: THREE('mollie') });
        [cast.mollie, cast.peter, cast.jigs] = ride.riders;
        cast.pumpkin = k.add(pumpkin(), { x: 262, y: 340, w: PUMPKIN_W, z: 20 });
        k.set(k.part(cast.pumpkin, 'glow'), { opacity: 1 });
        cast.hazel = k.character('witchHazel', { x: 60, y: 70, w: 190, z: 14, pose: 'flying' });
        chairRide.jump(k, ride, { x: -900, y: -40 });
        jumpWith(k, [cast.pumpkin], { x: -900, y: -40 });
        k.set(cast.hazel, { x: -700, y: 20 });
      },
      async play(k) {
        const { peter, hazel, pumpkin: lantern } = cast;
        highWind(3);
        void wobble(k, hazel, 3);
        void k.to(hazel, 3.4, { x: 0, y: 0, ease: 'sine.inOut' });
        await flyWith(k, ride, [lantern], { x: 0, y: 0, s: 3 });
        await k.say('bigMoon', peter);
        await k.say('hazelThere', hazel);
        k.music('adventure');
        void k.to(hazel, 2, { x: 650, y: 330, ease: 'sine.inOut' });
        await flyWith(k, ride, [lantern], { x: 650, y: 330, s: 2, tilt: 8 });

        // Down into the wood: a quick change of place.
        await k.cut(() => {
          woodBackdrop(k);
          ride = chairRide.set(k, { x: 40, y: 276, w: 400, wings: true, riders: THREE('mollie') });
          [cast.mollie, cast.peter, cast.jigs] = ride.riders;
          cast.pumpkin = k.add(pumpkin(), { x: 52, y: 380, w: PUMPKIN_W, z: 20 });
          k.set(k.part(cast.pumpkin, 'glow'), { opacity: 1 });
          cast.lamp = k.light(107, 431, 270, { color: '#ffcc66', strength: 0, z: 36 });
          cast.hazel = k.character('witchHazel', { x: 90, y: 372, w: 200, z: 16, pose: 'flying' });
          cast.owl = k.add(owl(), { x: 500, y: 238, w: 110, z: 8 });
          cast.shadow = k.add(spikyShadow(), { x: 430, y: 330, w: 620, z: 9 });
          cast.holly = k.add(hollyBush(), { x: 860, y: 470, w: 230, z: 9 });
          cast.bat = k.add(bat(), { x: -140, y: 150, w: 110, z: 15 });
          k.set([cast.owl, cast.shadow, cast.holly], { opacity: 0 });
          placeEyes(k, false);
          chairRide.jump(k, ride, { x: 0, y: -800 });
          jumpWith(k, [cast.pumpkin], { x: 0, y: -800 });
          k.set(cast.hazel, { x: -400, y: -700 });
        });
        k.music('dreamy');
        const { mollie, peter: pete, jigs, hazel: witch, pumpkin: lamp, lamp: glow, owl: bird, shadow, holly, eyes, bat: bt } = cast;

        // They land on the mossy path and hop off; Hazel drifts down after them.
        highWind(2);
        await k.all(
          chairRide.land(k, ride),
          k.to(lamp, 1.4, { y: -20, ease: 'sine.inOut' }).then(() => k.to(lamp, 0.18, { y: 0, ease: 'power2.in' })),
        );
        void wobble(k, witch, 2);
        void k.to(witch, 1.4, { x: 0, y: 0, ease: 'sine.inOut' });
        await k.all(
          chairRide.hopOff(k, ride, pete, { x: 330, y: 380, w: 220 }),
          chairRide.hopOff(k, ride, mollie, { x: 560, y: 372, w: 220 }),
          chairRide.hopOff(k, ride, jigs, { x: 850, y: 478, w: 140 }),
        );
        k.pose(witch, 'default');
        k.fx.thud();
        whispers(3);
        await k.say('itWhispers', pete);

        // Mollie carries the pumpkin lantern, and its warm glow lights the path.
        await k.say('carryPumpkin', mollie);
        await k.carry(lamp, [650, 548], 1.3);
        k.set(lamp, { zIndex: 20 });
        void k.to(glow, 1, { ...at(glow, 650, 548) });
        await k.fade(glow, 0.5, 1.2);
        await k.all(k.exit(ride.chair, 'left', 1), k.exit(ride.front, 'left', 1));
        k.remove(ride.chair);
        k.remove(ride.front);

        // "Midnight! Here, puss!" ... and no answer. A bat flits over, then an owl.
        await k.all(k.say('callMidnight', mollie), k.to(lamp, 0.5, { y: '-=14', yoyo: true, repeat: 1 }));
        k.silence();
        flutter();
        await k.to(bt, 2.4, { x: 1500, y: -60, ease: 'sine.inOut' });
        await k.wait(600);
        k.sfx.hoot();
        await k.fade(bird, 1, 0.8);
        await k.wait(500);
        await k.all(k.say('owlJigs', jigs), k.hop(jigs, 20, 1));
        await k.wait(500);

        // The trees creak, and a long spiky shadow stretches across the path.
        k.music('spooky');
        k.fx.creak();
        drone(4);
        k.set(shadow, { transformOrigin: '50% 100%', scale: 0.4 });
        void k.to(shadow, 3.2, { opacity: 1, scale: 1, ease: 'sine.inOut' });
        await k.wait(900);
        k.fx.creak();
        await k.all(k.shake(mollie, 3, 2), k.shake(pete, 3, 2), k.shake(witch, 3, 2));
        await k.wait(1000);
        await k.say('spikyShadow', pete);
        await k.say('hazelEek', witch);
        await k.wait(500);

        // Cut back to the heroes: Mollie lifts the lantern, and it's only a holly bush.
        k.music('adventure');
        void k.fade(glow, 0.65, 0.6);
        void k.to(lamp, 0.6, { y: '-=36', ease: 'sine.out' });
        await k.say('onlyBush', mollie);
        await k.all(k.to(shadow, 1.2, { scale: 0.2, opacity: 0, ease: 'sine.in' }), k.appear(holly, 0.8));
        k.fx.pop();
        await k.to(lamp, 0.5, { y: '+=36', ease: 'sine.inOut' });
        await k.all(k.say('peterLaughs', pete), k.shake(pete, 4, 3));
        void k.fade(bird, 0, 0.8);
        await k.wait(500);

        // High above, two round green eyes open in the dark.
        k.silence();
        await k.wait(700);
        miaow(true);
        await k.fade(eyes, 1, 1.6);
        await k.all(k.say('watching', witch), k.to(witch, 0.4, { x: '-=10' }));
        await k.wait(500);
      },
    },

    // ==================================================== 3. Up the tallest tree
    {
      name: 'Up the tallest tree',
      set(k) {
        woodBackdrop(k);
        k.music('dreamy');
        placeEyes(k, true);
        ride = chairRide.set(k, { x: 420, y: 276, w: 400 });
        cast.hazel = k.character('witchHazel', { x: 50, y: 372, w: 210, z: 16 });
        cast.peter = k.character('peter', { x: 250, y: 380, w: 210, z: 16 });
        cast.mollie = k.character('mollie', { x: 440, y: 380, w: 210, z: 16 });
        cast.jigs = k.character('jigs', { x: 660, y: 480, w: 140, z: 16 });
        cast.pumpkin = k.add(pumpkin(), { x: 490, y: 508, w: PUMPKIN_W, z: 20 });
        k.set(k.part(cast.pumpkin, 'glow'), { opacity: 1 });
        cast.lamp = k.light(545, 560, 270, { color: '#ffcc66', strength: 0.5, z: 36 });
        cast.midnight = k.character('midnight', { x: 760, y: 70, w: 160, z: 16, pose: 'scared' });
        k.set(cast.midnight, { opacity: 0 });
        cast.saucer = k.add(saucer(), { x: 190, y: 590, w: 110, z: 20 });
        k.set(cast.saucer, { opacity: 0 });
      },
      async play(k) {
        const { hazel, peter, mollie, jigs, pumpkin: lantern, lamp, midnight, saucer: milk, eyes } = cast;
        await k.wait(500);
        miaow(true);
        await k.wait(500);

        // Jigs spots them.
        const [jigsArm] = k.pivot(k.part(jigs, 'armR'));
        void k.to(jigsArm, 0.5, { rotation: -150, ease: 'sine.inOut' });
        await k.say('greenEyes', jigs);
        k.flourish(eyes);
        await k.to(jigsArm, 0.5, { rotation: 0, ease: 'sine.inOut' });
        k.pose(hazel, 'worried');
        await k.say('hazelStuck', hazel);
        k.pose(hazel, 'default');
        await k.say('tooHigh', peter);
        await k.all(k.say('notChair', jigs), k.hop(jigs, 24, 1));

        // Mollie asks what Midnight loves best: milk, and Hazel has a saucer.
        await k.say('favourite', mollie);
        k.set(milk, { opacity: 1 });
        await k.all(k.say('hazelMilk', hazel), k.appear(milk, 0.5));
        await k.carry(milk, [620, 590], 1.2);
        await k.say('holdLantern', mollie);

        // The chair wriggles, grows its wings, and they all climb aboard.
        await wishing.wriggle(k, ride.chair, 2);
        await chairRide.wings(k, ride);
        k.music('adventure');
        await k.say('upWeGo', peter);
        await k.all(k.hop(mollie, 40, 1), k.hop(peter, 40, 1), k.hop(jigs, 40, 1));
        k.remove(mollie);
        k.remove(peter);
        k.remove(jigs);
        await k.all(...THREE('mollie').map((r) => chairRide.seat(k, ride, r)));
        const mol = ride.riders[0];
        const pet = ride.riders[1];
        // Peter holds the lantern in his lap; Mollie holds the milk in hers.
        await k.all(
          k.to(lantern, 0.6, { ...at(lantern, 560, 478), ease: 'sine.inOut' }),
          k.to(lamp, 0.6, { ...at(lamp, 560, 478), ease: 'sine.inOut' }),
          k.to(milk, 0.6, { ...at(milk, 690, 504), ease: 'sine.inOut' }),
        );
        const along = [lantern, lamp, milk];

        // The chair rises, branch by branch, up beside the tallest tree.
        k.music('dreamy');
        highWind(8);
        for (const y of [-90, -180, -256]) {
          await flyWith(k, ride, along, { y, s: 1.6 });
          await k.wait(200);
        }

        // Midnight is there on the branch, fur on end: the lantern lights him up.
        await k.all(k.fade(eyes, 0, 0.7), k.fade(midnight, 1, 0.7));
        await k.wait(500);
        await k.say('helloMidnight', mol);
        await k.say('keepStill', pet);
        await k.wait(500);

        // The big deed: Mollie holds out the saucer, very still.
        await k.carry(milk, [738, 248], 1.4);
        await k.wait(900);
        await k.to(midnight, 0.5, { y: '+=8', ease: 'sine.inOut' });
        await k.to(midnight, 0.5, { y: '-=8', ease: 'sine.inOut' });
        await k.wait(500);
        k.fx.pop();
        await k.to(midnight, 0.9, { x: '-=46', y: '+=6', ease: 'sine.inOut' });
        hatBell();
        for (let i = 0; i < 3; i++) await k.to(midnight, 0.18, { y: '+=5', yoyo: true, repeat: 1, ease: 'sine.inOut' });
        await k.wait(400);

        // He climbs into her lap, and purrs.
        void k.to(midnight, 1.3, { ...at(midnight, 680, 215), scale: 0.7, ease: 'sine.inOut' });
        await k.wait(700);
        void k.vanish(milk, 0.4);
        await k.wait(600);
        k.pose(midnight, 'purr');
        purr(3);
        k.flourish(midnight);
        k.music('cosy');
        await k.wait(1200);
        await k.say('foundHim', hazel);

        // The chair floats gently down.
        await flyWith(k, ride, [lantern, lamp, midnight], { y: 0, s: 3, flaps: 4 });
      },
    },

    // ==================================================== 4. Pumpkins all glowing
    {
      name: 'Pumpkins all glowing',
      set(k) {
        woodBackdrop(k);
        k.music('cosy');
        ride = chairRide.set(k, { x: 420, y: 276, w: 400, wings: true, riders: THREE('mollie') });
        [cast.mollie, cast.peter, cast.jigs] = ride.riders;
        cast.pumpkin = k.add(pumpkin(), { x: 505, y: 438, w: PUMPKIN_W, z: 20 });
        k.set(k.part(cast.pumpkin, 'glow'), { opacity: 1 });
        cast.lamp = k.light(560, 490, 260, { color: '#ffcc66', strength: 0.4, z: 36 });
        cast.midnight = k.character('midnight', { x: 625, y: 428, w: 110, z: 21, pose: 'purr' });
        cast.hazel = k.character('witchHazel', { x: 50, y: 372, w: 210, z: 16 });
      },
      async play(k) {
        const { hazel, midnight, mollie } = cast;
        await k.wait(500);
        await wishing.foldWings(k, ride.chair);

        // Mollie hands Midnight back to Hazel.
        await k.carry(midnight, hazel, 1.3);
        k.pose(hazel, 'happy');
        void k.fade(midnight, 0, 0.2);
        await k.all(k.say('hazelHug', hazel), k.hop(hazel, 16, 1));
        k.remove(midnight);
        await k.wait(400);

        // Her broom flies straight at last, and she sets off a thank-you spell.
        k.pose(hazel, 'flyingCat');
        k.sfx.whoosh();
        await k.to(hazel, 1.2, { y: -90, ease: 'sine.inOut' });
        await k.say('broomFlies', hazel);
        await k.say('thankSpell', hazel);
        const [wand] = k.pivot(k.part(hazel, 'armR'));
        k.fx.spell();
        await k.to(wand, 0.28, { rotation: -35, yoyo: true, repeat: 3, ease: 'sine.inOut' });
        await glowAll(k);
        k.flourish(hazel);
        await k.say('allGlowing', mollie);
        await k.wait(500);

        // The race home, past the moon.
        await k.cut(() => {
          nightSky(k);
          ride = chairRide.set(k, { x: 160, y: 290, w: 440, wings: true, riders: THREE('mollie') });
          [cast.mollie, cast.peter, cast.jigs] = ride.riders;
          cast.hazel = k.character('witchHazel', { x: 690, y: 90, w: 200, z: 14, pose: 'flyingCat' });
          chairRide.jump(k, ride, { x: -900, y: 0 });
          k.set(cast.hazel, { x: -1300, y: 0 });
        });
        k.music('adventure');
        const { hazel: racer, peter: pe, jigs: ji } = cast;
        highWind(4);
        void wobble(k, racer, 2);
        void k.to(racer, 2.2, { x: 0, ease: 'sine.inOut' });
        await chairRide.fly(k, ride, { x: 0, s: 2.6 });
        await k.say('race', pe);
        void k.to(racer, 2.6, { x: 120, y: -30, ease: 'sine.inOut' });
        void chairRide.fly(k, ride, { x: 420, y: -30, s: 2.6 });
        await k.wait(900);
        await k.say('winning', ji);
        k.fx.whizz();
        void k.to(racer, 1.4, { x: 500, y: -90, ease: 'sine.in' });
        await k.wait(900);

        // Home to the playroom: cat biscuits, and one last wave at the window.
        await k.cut(() => {
          duskPlayroom(k, true);
          ride = chairRide.set(k, { x: 780, y: 280, w: 400, wings: true, riders: THREE('mollie') });
          [cast.mollie, cast.peter, cast.jigs] = ride.riders;
          chairRide.jump(k, ride, { x: 0, y: -800 });
          cast.hazel = k.character('witchHazel', { x: 140, y: 160, w: 190, z: 8, pose: 'flyingCat' });
          k.set(cast.hazel, { opacity: 0 });
          cast.tin = k.add(biscuitTin(), { x: 500, y: 520, w: 150, z: 18 });
          k.set(cast.tin, { opacity: 0 });
          for (const name of ['biscuit1', 'biscuit2', 'biscuit3'] as const) {
            cast[name] = k.add(catBiscuit(), { x: 540, y: 500, w: 70, z: 19 });
            k.set(cast[name], { opacity: 0 });
          }
        });
        k.music('cosy');
        const home = cast;
        await chairRide.land(k, ride);
        await k.all(
          chairRide.hopOff(k, ride, home.jigs, { x: 610, y: 425, w: 190 }),
          chairRide.hopOff(k, ride, home.peter, { x: 400, y: 372, w: 240 }),
          chairRide.hopOff(k, ride, home.mollie, { x: 190, y: 372, w: 240 }),
        );
        await k.all(k.say('homeAgain', home.jigs), k.hop(home.jigs, 20, 1));

        // Peter hands round the cat biscuits.
        await k.all(k.say('catBiscuits', home.peter), k.appear(home.tin, 0.5));
        const [lid] = k.pivot(k.part(home.tin, 'lid'));
        await k.to(lid, 0.4, { rotation: -35, ease: 'sine.out' });
        for (const b of [home.biscuit1, home.biscuit2, home.biscuit3]) k.set(b, { opacity: 1 });
        await k.carry(home.biscuit1, [330, 560], 1.1);
        await k.all(k.say('catShaped', home.mollie), k.hop(home.mollie, 14, 1));
        crunch();
        await k.vanish(home.biscuit1, 0.3);
        await k.carry(home.biscuit2, [700, 570], 1.1);
        crunch();
        await k.all(k.vanish(home.biscuit2, 0.3), k.hop(home.jigs, 20, 1));
        await k.to(home.biscuit3, 0.4, { x: '-=40', y: '-=20' });
        crunch();
        await k.vanish(home.biscuit3, 0.3);
        await k.wait(500);

        // A tinkle of a little bell outside: Hazel and Midnight zoom past the window for one last wave.
        k.silence();
        hatBell();
        await k.wait(500);
        k.set(home.hazel, { x: -600, y: -200, opacity: 1 });
        await k.to(home.hazel, 1.1, { x: 0, y: 0, ease: 'power2.out' });
        await k.all(k.say('happyHallowe', home.mollie), wave(k, home.hazel, 3, 'armR'));
        miaow();
        await k.wait(500);
        k.music('cosy');
        void k.to(home.hazel, 1.6, { x: 500, y: -420, ease: 'power2.in' });
        await warmEnding(k, { cast: [home.mollie, home.peter, home.jigs], end: 'end', music: 'cosy' });
      },
    },
  ],
});

/** The thank-you spell: the toadstools light up one by one, then pumpkins appear and glow along the path. */
async function glowAll(k: Kit): Promise<void> {
  let step = 0;
  for (const [x, y, color] of TOADSTOOLS) {
    const light = k.light(x, y, 110, { color, strength: 0, z: 34 });
    glowChime(step++);
    void k.fade(light, 0.6, 0.6);
    await k.wait(260);
  }
  await k.wait(300);
  for (const [x, y] of SPELL_PUMPKINS) {
    const p = k.add(pumpkin(), { x: x - 40, y: y - 38, w: 80, z: 14 });
    k.set(p, { opacity: 0 });
    glowChime(step++);
    k.set(p, { opacity: 1 });
    await k.appear(p, 0.4);
    void k.fade(k.part(p, 'glow'), 1, 0.7);
    await k.wait(300);
  }
  await k.wait(600);
}
