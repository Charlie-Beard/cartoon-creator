/**
 * The Grey Rainbow: after the rain, the rainbow comes out all grey. The
 * Wishing-Chair flies the friends to the end of it, where Old Mother Dabble
 * paints the rainbow every day, but grumpy Bluster the storm cloud has blown
 * her three paint pots away. They catch the pots, mix the colours, and paint
 * the rainbow back, and Bluster finds out that without his rain there would
 * be no rainbow at all.
 *
 *   1. Grey (the playroom). The rain stops, and Peter says to look for a
 *      rainbow. Mollie spots one in the open doorway, but it is all grey.
 *      Jigs says that has never happened and somebody needs help. The chair
 *      wriggles and grows its wings, and they fly to the rainbow's end.
 *      DEED: Mollie spots the grey rainbow and points it out.
 *   2. The paint pots (the wishing sky). A cheery voice calls "Help! My paint
 *      pots!": Mother Dabble on a cloud, empty-handed. Bluster blew her pots
 *      away and the rainbow is fading. Three pots are tumbling down the sky.
 *      DEEDS: Peter leans out and catches the red one (a splash on his nose),
 *      Mollie catches the yellow, Jigs the blue. "Bring them to the
 *      rainbow's end, before it fades!"
 *   3. Bluster (the rainbow's end). There are seven colours and only three
 *      pots. DEEDS: Peter mixes red and yellow into orange, Mollie yellow and
 *      blue into green, Jigs red and blue into purple, on the palette. SCARY
 *      BEAT: a low rumble, the sky darkens, and Bluster rolls in and swells
 *      huge: "MY sky! Go AWAY, all of you!" He blows a sideways wind and
 *      rain (no lightning, just a slow dark); Mother Dabble ducks into her
 *      shed and the friends cling together. CUT BACK: Mollie, small and
 *      brave: "Why are you so cross?" He sags: nobody ever says hooray for
 *      the rain. "But there's no rainbow without rain!" "I... do?" BIG DEED:
 *      everyone paints the stripes back, one at a time from the top, a
 *      swish and a colour fading in along the arch. "Hooray for Bluster!"
 *      and he beams, a silver lining glowing along his edge.
 *   4. The slide home. "The quickest way home from the end of a rainbow is
 *      to slide down it!" The friends whoosh down the arch on the chair and
 *      tumble into the playroom, Peter with a red nose. Tip-tap on the
 *      window: a tiny Bluster sends a little shower, and a tiny rainbow
 *      shines in it. "No rain, no rainbow!" Warm ending.
 *
 * Scary, never cruel (docs/STYLE.md): Bluster is heard before he is seen, he
 * swells, rumbles and blows wind and rain, but touches nobody; the heroes'
 * answer is one brave question, and he ends beaming. The dark is a slow
 * veil, the thunder a rumble: no flash, ever.
 *
 * New in the wishing world: Old Mother Dabble (poses sad, paint, happy),
 * Bluster (poses blow, sulk, beam) and the rainbow-end backdrop, with
 * `rainbowStripe` and `rainbowFoot` to lay the colours over its grey arch.
 * Drawn here: the grey rainbow in the doorway, the pots, the dollops and
 * palette, the splash on Peter's nose, the cloud Dabble stands on, the
 * streaks of blown rain and the tiny rainbow in the window.
 */
import { defineCartoon, noiseBurst, NOTE, now, tone, type Kit } from '../../kit';
import { moves as commonMoves, sounds as common } from '../../worlds/common/moves';
import { warmEnding } from '../../worlds/common/pieces';
import { moves as wishing, sounds } from '../../worlds/wishing/moves';
import { chairRide, type Ride } from '../../worlds/wishing/pieces';
import { rainbowFoot, rainbowStripe } from '../../worlds/wishing/rainbowend';
import { BLUE, cloudBank, COLOURS, dollop, GREEN, greyBow, miniBow, ORANGE, palette, pot, PURPLE, RED, splash, streak, YELLOW } from './art';
import meta from './meta';

const { creak, hatBell, highWind, wingbeats } = sounds;
const { giggle, laugh } = common;
const { wave } = commonMoves;

// ---------------------------------------------------------------- sounds

/** A brush swish: a breathy sweep of sound for a stroke of paint. */
function swish(): void {
  const t = now();
  noiseBurst(t, { freq: 2200, q: 0.7, peak: 0.05, attack: 0.08, decay: 0.45, sweepTo: 600 });
  tone(NOTE.G5, t + 0.05, { wave: 'sine', peak: 0.015, attack: 0.1, decay: 0.4, glideTo: NOTE.C6 });
}

/** Far-off thunder: a low, slow rumble, never a crack. */
function lowRumble(seconds = 2.6): void {
  const t = now();
  tone(54, t, { wave: 'sawtooth', peak: 0.07, attack: seconds * 0.4, decay: seconds * 0.8, glideTo: 38, lowpass: 170, vibrato: [5, 4] });
  noiseBurst(t, { freq: 150, type: 'lowpass', peak: 0.07, attack: seconds * 0.4, decay: seconds * 0.9, sweepTo: 70 });
}

/** A soft squelch for paint being mixed. */
function squelch(): void {
  const t = now();
  [0, 0.12, 0.26].forEach((d, i) => tone(220 + i * 40, t + d, { wave: 'sine', peak: 0.05, attack: 0.02, decay: 0.12, glideTo: 330 + i * 30 }));
}

/** The long happy whoosh of sliding down a rainbow, with a rising chime under it. */
function slideWhoosh(): void {
  const t = now();
  noiseBurst(t, { freq: 500, q: 0.8, peak: 0.07, attack: 0.5, decay: 1.8, sweepTo: 2600 });
  [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6, NOTE.E6].forEach((f, i) => tone(f, t + 0.2 + i * 0.28, { wave: 'triangle', peak: 0.03, attack: 0.02, decay: 0.3 }));
}

// ------------------------------------------------------------------ cast

type Name =
  | 'mollie' | 'peter' | 'jigs' | 'dabble' | 'bluster' | 'chair' | 'bow' | 'veil' | 'cloud' | 'foot' | 'palette' | 'glow'
  | 'potRed' | 'potYellow' | 'potBlue' | 'orange' | 'green' | 'purple' | 'window' | 'tiny' | 'chair2';
const cast = {} as Record<Name, HTMLElement>;
let ride: Ride;
let stripes: HTMLElement[] = [];

/** Everything moving with the chair. */
const rideParts = (r: Ride): HTMLElement[] => [r.chair, r.front, ...r.riders];

/** A red splash on Peter's nose, stuck to him so it goes wherever he goes. */
function redNose(k: Kit, peter: HTMLElement): HTMLElement {
  const el = k.add(splash(RED), { x: 0, y: 0, w: 34, z: 1 });
  el.style.left = '44%';
  el.style.top = '41.5%';
  el.style.width = '11%';
  el.style.height = '9%';
  k.set(el, { x: 0, y: 0 });
  peter.append(el);
  return el;
}

/** The seven coloured stripes over the grey arch, hidden (or all shown), with the cloud's front laid over their feet. */
function laidStripes(k: Kit, shown: boolean): void {
  stripes = COLOURS.map((c, i) => k.add(rainbowStripe(i, c), { x: 0, y: 0, w: 1180, z: 3 }));
  if (!shown) k.set(stripes, { opacity: 0 });
  cast.foot = k.add(rainbowFoot(), { x: 0, y: 540, w: 640, z: 4 });
}

/** Where the mixing palette sits, and its middle. */
const PAL = { x: 440, y: 602, w: 120, mid: [500, 630] as [number, number] };

/** Two dollops glide to the palette, swirl together, and become the mixed colour. */
async function mixDeed(
  k: Kit,
  a: { pot: HTMLElement; col: string; name: string },
  b: { pot: HTMLElement; col: string; name: string },
  result: { col: string; name: string; slot: number },
): Promise<HTMLElement> {
  const centre = (el: HTMLElement): [number, number] => {
    const bx = k.box(el);
    return [bx.x + bx.w / 2, bx.y + bx.h * 0.3];
  };
  const [ax, ay] = centre(a.pot);
  const [bx, by] = centre(b.pot);
  const da = k.add(dollop(a.col, a.name), { x: ax - 30, y: ay - 24, w: 60, z: 27 });
  const db = k.add(dollop(b.col, b.name), { x: bx - 30, y: by - 24, w: 60, z: 27 });
  k.fx.pop();
  const [mx, my] = PAL.mid;
  await k.all(k.to(da, 0.6, { x: mx - 36 - ax, y: my - ay, ease: 'sine.inOut' }), k.to(db, 0.6, { x: mx + 36 - bx, y: my - by, ease: 'sine.inOut' }));
  squelch();
  await k.all(k.to(da, 0.5, { x: mx - ax, y: my - ay, rotation: 40 }), k.to(db, 0.5, { x: mx - bx, y: my - by, rotation: -40 }));
  const mixed = k.add(dollop(result.col, result.name), { x: mx - 36, y: my - 29, w: 72, z: 28 });
  k.set(mixed, { opacity: 0 });
  await k.all(k.fade(mixed, 1, 0.4), k.fade(da, 0, 0.4), k.fade(db, 0, 0.4));
  k.remove(da);
  k.remove(db);
  k.fx.pop();
  await k.pop(mixed, 1.2);
  k.flourish(mixed);
  await k.wait(200);
  // It rests on the edge of the palette.
  await k.to(mixed, 0.6, { x: -40 + result.slot * 40, y: 40, scale: 0.6, ease: 'sine.inOut' });
  return mixed;
}

/** One hero lays one stripe: an arm sweeps, a swish, the colour fades in along the arch. */
async function paintStripe(k: Kit, i: number, who: HTMLElement): Promise<void> {
  const [arm] = k.pivot(k.part(who, 'armR'));
  swish();
  void k.to(arm, 0.45, { rotation: -80, yoyo: true, repeat: 1, ease: 'sine.inOut' });
  await k.fade(stripes[i], 1, 0.8);
}

/** A point low on someone's chest, to carry things to without covering their face. */
const chest = (k: Kit, el: HTMLElement): [number, number] => {
  const b = k.box(el);
  return [b.x + b.w / 2, b.y + b.h * 0.86];
};

/** A gust of blown rain: streaks flying across the stage from the right. */
function blownRain(k: Kit, seconds: number): Promise<void> {
  const rows = [150, 230, 310, 390, 470, 540, 190, 350, 500, 270];
  const runs = rows.map((y, i) => {
    const s = k.add(streak(), { x: 1200, y, w: 150 + (i % 3) * 30, z: 31 });
    return k.wait(i * 160).then(() => k.to(s, seconds * 0.45, { x: -1500, y: '+=60', ease: 'none' })).then(() => k.remove(s));
  });
  return k.all(...runs) as Promise<void>;
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. Grey
    rainStops: { who: 'peter', text: 'The rain’s stopped! Let’s look for a rainbow.' },
    spotBow: { who: 'mollie', text: 'There’s one! But… it’s all grey!' },
    neverGrey: { who: 'jigs', text: 'A grey rainbow? That’s never happened before.' },
    needsHelp: { who: 'jigs', text: 'Somebody must need help.' },
    chairWants: { who: 'peter', text: 'The chair’s wriggling! It wants to fly and see what’s wrong!' },
    toEnd: { who: 'mollie', text: 'To the end of the rainbow, please, chair!' },
    // 2. The paint pots
    helpPots: { who: 'dabble', text: 'Help! Oh, help! Somebody help me with my paint pots!' },
    someone: { who: 'mollie', text: 'Look! Someone’s waving to us from that cloud.' },
    imDabble: { who: 'dabble', text: 'I’m Mother Dabble. I paint the rainbow every day.' },
    blusterBlew: { who: 'dabble', text: 'But grumpy old Bluster blew my paint pots away!' },
    fading: { who: 'dabble', text: 'And now the rainbow is fading to grey!' },
    threePots: { who: 'peter', text: 'Look! Three paint pots, tumbling in the sky!' },
    catchRed: { who: 'peter', text: 'I’ll catch the red one!' },
    gotRed: { who: 'peter', text: 'Got it! Oh! It splashed my nose!' },
    gotYellow: { who: 'mollie', text: 'I’ve got the yellow!' },
    catchBlue: { who: 'jigs', text: 'And the blue one is mine!' },
    clever: { who: 'dabble', text: 'Clever children! Quick, to the rainbow’s end, before it fades away!' },
    // 3. Bluster
    sevenColours: { who: 'dabble', text: 'But a rainbow needs seven colours, and we’ve only got three pots!' },
    mixOrange: { who: 'peter', text: 'We can mix them! Red and yellow make… orange!' },
    mixGreen: { who: 'mollie', text: 'Yellow and blue make green!' },
    mixPurple: { who: 'jigs', text: 'And red and blue make purple!' },
    rumbling: { who: 'jigs', text: 'Uh-oh. What’s that big, deep rumbling?' },
    mySky: { who: 'bluster', text: 'MY sky! Go AWAY, all of you!' },
    holdOn: { who: 'peter', text: 'Hold on tight!' },
    whyCross: { who: 'mollie', text: 'Why are you so cross?' },
    nobodyHooray: { who: 'bluster', text: 'Everybody shouts hooray for the rainbow. Nobody ever says hooray for ME.' },
    noRain: { who: 'mollie', text: 'But Bluster, there’s no rainbow without rain! You help to make it!' },
    idoQ: { who: 'bluster', text: 'I… do?' },
    brushes: { who: 'dabble', text: 'Brushes ready, everyone! We’ll paint one stripe at a time. Red goes at the very top.' },
    beautiful: { who: 'dabble', text: 'Orange, yellow, green, blue, purple. Oh, beautiful!' },
    hipHip: { who: 'peter', text: 'Hip, hip…' },
    hooray: { who: 'mollie', text: 'Hooray for Bluster!' },
    blusterBeams: { who: 'bluster', text: 'Hooray for… me? Nobody has ever said that before!' },
    // 4. The slide home
    quickest: { who: 'dabble', text: 'Now, the quickest way home from the end of a rainbow…' },
    slideIt: { who: 'jigs', text: 'Is to slide down it!' },
    wheee: { who: 'mollie', text: 'Wheeeee!' },
    redNoseLine: { who: 'jigs', text: 'You’ve got a red nose, Peter!' },
    stillWet: { who: 'peter', text: 'So I have! It’s still wet!' },
    tipTap: { who: 'mollie', text: 'Listen! Something’s tapping on the window. Tip, tap, tip, tap.' },
    ownRainbow: { who: 'mollie', text: 'Look! No rain, no rainbow. Bluster made us our very own.' },
    hoorayEnd: { who: 'peter', text: 'Hooray for Bluster!' },
    end: { who: 'narrator', text: 'And the tiny rainbow shone in the window until bedtime.' },
  },
  scenes: [
    // ==================================================== 1. Grey
    {
      name: 'Grey',
      set(k) {
        k.backdrop('playroom');
        k.music('dreamy');
        cast.veil = k.dim(0.3, '#3e4a5c');
        cast.bow = k.add(greyBow(), { x: 892, y: 160, w: 248, z: 4 });
        k.set(cast.bow, { opacity: 0 });
        ride = chairRide.set(k, { x: 360, y: 300, w: 360, riders: [{ id: 'jigs', slot: 'arm', flip: true }] });
        cast.jigs = ride.riders[0];
        cast.chair = ride.chair;
        cast.peter = k.character('peter', { x: 70, y: 388, w: 230 });
        cast.mollie = k.character('mollie', { x: 740, y: 400, w: 200, flip: true });
      },
      async play(k) {
        const { mollie, peter, jigs, chair } = cast;
        // The last drips of the rain.
        k.fx.patter(5);
        await k.wait(1400);
        await k.say('rainStops', peter);
        void k.fade(cast.veil, 0, 2);
        k.music('magic');
        await k.wait(500);

        // Mollie spots the rainbow in the doorway: it is grey.
        await k.fade(cast.bow, 1, 1.2);
        const [point] = k.pivot(k.part(mollie, 'armL'));
        await k.to(point, 0.5, { rotation: 150, ease: 'sine.out' });
        k.flourish(cast.bow);
        await k.say('spotBow', mollie);
        await k.to(point, 0.5, { rotation: 0 });
        k.fx.uhoh();
        await k.wait(400);
        hatBell();
        await k.all(k.say('neverGrey', jigs), k.shake(jigs, 4, 2));
        await k.say('needsHelp', jigs);

        // The chair wants to go, and grows its wings.
        await wishing.wriggle(k, chair, 3);
        await k.say('chairWants', peter);
        await chairRide.wings(k, ride);
        await chairRide.flap(k, ride, 2);

        // All aboard.
        await k.say('toEnd', mollie);
        k.fx.boing();
        await k.all(
          k.to(peter, 0.7, { x: '+=300', y: '-=40', opacity: 0, ease: 'power1.inOut' }),
          k.to(mollie, 0.7, { x: '-=330', y: '-=40', opacity: 0, ease: 'power1.inOut' }),
        );
        k.remove(peter);
        k.remove(mollie);
        await chairRide.seat(k, ride, { id: 'mollie', slot: 'left' });
        await chairRide.seat(k, ride, { id: 'peter', slot: 'right' });
        creak();
        k.music('adventure');
        highWind(2);
        await chairRide.fly(k, ride, { x: 900, y: -160, s: 2, tilt: -8 });
      },
    },

    // ==================================================== 2. The paint pots
    {
      name: 'The paint pots',
      set(k) {
        k.backdrop('wishing-sky');
        k.music('adventure');
        ride = chairRide.set(k, {
          x: 140,
          y: 280,
          w: 380,
          wings: true,
          riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'arm', flip: true }],
        });
        [cast.mollie, cast.peter, cast.jigs] = ride.riders;
        redNose(k, cast.peter);
        k.set(cast.peter.lastElementChild as HTMLElement, { opacity: 0 });
        chairRide.jump(k, ride, { x: -900, y: 0 });
        cast.dabble = k.character('dabble', { x: 840, y: 110, w: 250, z: 10, pose: 'sad', flip: true });
        cast.cloud = k.add(cloudBank(), { x: 760, y: 330, w: 420, z: 12 });
        // Three pots, tumbling in from the top of the sky.
        cast.potRed = k.add(pot(RED, 'red'), { x: 610, y: 190, w: 90, z: 20 });
        cast.potYellow = k.add(pot(YELLOW, 'yellow'), { x: 230, y: 110, w: 90, z: 20 });
        cast.potBlue = k.add(pot(BLUE, 'blue'), { x: 500, y: 90, w: 90, z: 20 });
        k.set([cast.potRed, cast.potYellow, cast.potBlue], { y: -600, opacity: 0 });
      },
      async play(k) {
        const { mollie, peter, jigs, dabble } = cast;
        // A cheery voice far off, then Mother Dabble on her cloud.
        highWind(3);
        void wave(k, dabble, 6);
        await k.all(chairRide.fly(k, ride, { x: 0, y: 0, s: 2.4 }), k.wait(1000).then(() => k.say('helpPots', dabble)));
        await chairRide.flap(k, ride, 2);
        await k.say('someone', mollie);
        await k.say('imDabble', dabble);
        await k.all(k.say('blusterBlew', dabble), k.shake(dabble, 4, 3));
        await k.say('fading', dabble);

        // Three paint pots tumble down the sky.
        k.music('magic');
        const drop = [cast.potRed, cast.potYellow, cast.potBlue].map((p, i) => {
          k.set(p, { opacity: 1 });
          void k.to(p, 0.7, { rotation: 15, yoyo: true, repeat: 5, ease: 'sine.inOut', delay: 1.6 });
          return k.to(p, 1.8 + i * 0.25, { y: 0, rotation: 360, ease: 'sine.out' });
        });
        k.fx.whizz();
        await k.all(k.say('threePots', peter), ...drop);
        await k.wait(300);

        // Peter leans out and catches the red one.
        await k.say('catchRed', peter);
        await k.to(peter, 0.4, { rotation: 16, x: '+=14' });
        k.fx.whizz();
        await k.carry(cast.potRed, chest(k, peter), 0.9);
        k.fx.splash();
        const nose = peter.lastElementChild as HTMLElement;
        k.set(nose, { opacity: 1 });
        await k.to(peter, 0.3, { rotation: 0, x: '-=14' });
        await k.say('gotRed', peter);
        laugh();
        await k.wait(400);

        // Mollie catches the yellow.
        k.fx.whizz();
        await k.carry(cast.potYellow, chest(k, mollie), 0.9);
        await k.all(k.say('gotYellow', mollie), k.hop(cast.potYellow, 14, 1));
        await k.wait(300);

        // Jigs catches the blue.
        await k.all(k.say('catchBlue', jigs), k.shake(jigs, 3, 2));
        hatBell();
        k.fx.whizz();
        await k.carry(cast.potBlue, chest(k, jigs), 0.9);
        await k.wait(500);

        // Off to the rainbow's end, the pots riding along.
        void k.pose(dabble, 'paint');
        await k.say('clever', dabble);
        highWind(2);
        await k.all(
          chairRide.fly(k, ride, { x: -300, y: -750, s: 2.2, tilt: 8 }),
          ...[cast.potRed, cast.potYellow, cast.potBlue].map((p) => k.to(p, 2.2, { x: '-=300', y: '-=750', ease: 'sine.inOut' })),
        );
      },
    },

    // ==================================================== 3. Bluster
    {
      name: 'Bluster',
      set(k) {
        k.backdrop('rainbow-end');
        k.music('adventure');
        laidStripes(k, false);
        cast.veil = k.dim(0, '#1b2233');
        cast.peter = k.character('peter', { x: 150, y: 405, w: 225, z: 11 });
        redNose(k, cast.peter);
        cast.jigs = k.character('jigs', { x: 385, y: 420, w: 150, z: 12 });
        cast.mollie = k.character('mollie', { x: 520, y: 405, w: 225, z: 11 });
        cast.dabble = k.character('dabble', { x: 735, y: 385, w: 225, z: 11, flip: true });
        cast.potRed = k.add(pot(RED, 'red'), { x: 120, y: 585, w: 76, z: 22 });
        cast.potBlue = k.add(pot(BLUE, 'blue'), { x: 330, y: 590, w: 72, z: 22 });
        cast.potYellow = k.add(pot(YELLOW, 'yellow'), { x: 700, y: 590, w: 76, z: 22 });
        cast.palette = k.add(palette(), { x: PAL.x, y: PAL.y, w: PAL.w, z: 24 });
        // Bluster waits off stage, small, to roll in.
        cast.bluster = k.character('bluster', { x: 620, y: -120, w: 440, z: 20 });
        k.set(cast.bluster, { x: 900, scale: 0.4, opacity: 0 });
      },
      async play(k) {
        const { mollie, peter, jigs, dabble, bluster } = cast;
        k.face(peter, false);
        // Seven colours, three pots.
        await k.say('sevenColours', dabble);
        k.pose(dabble, 'sad');
        await k.wait(300);

        // Peter, Mollie and Jigs each mix a colour.
        await k.say('mixOrange', peter);
        cast.orange = await mixDeed(k, { pot: cast.potRed, col: RED, name: 'red' }, { pot: cast.potYellow, col: YELLOW, name: 'yellow' }, { col: ORANGE, name: 'orange', slot: 0 });
        await k.say('mixGreen', mollie);
        cast.green = await mixDeed(k, { pot: cast.potYellow, col: YELLOW, name: 'yellow' }, { pot: cast.potBlue, col: BLUE, name: 'blue' }, { col: GREEN, name: 'green', slot: 1 });
        await k.say('mixPurple', jigs);
        cast.purple = await mixDeed(k, { pot: cast.potRed, col: RED, name: 'red' }, { pot: cast.potBlue, col: BLUE, name: 'blue' }, { col: PURPLE, name: 'purple', slot: 2 });
        k.pose(dabble, 'paint');
        await k.wait(300);

        // A deep rumble, and the sky darkens.
        k.silence();
        lowRumble(3);
        void k.fade(cast.veil, 0, 0).then(() => k.to(cast.veil, 3, { opacity: 0.4 }));
        await k.wait(600);
        await k.all(k.say('rumbling', jigs), k.shake(jigs, 4, 2));
        k.music('spooky');
        // Mother Dabble ducks into her shed.
        await k.all(k.shake(dabble, 5, 2), k.to(dabble, 0.9, { x: '+=330', opacity: 0, ease: 'power1.in' }));
        k.remove(dabble);

        // Bluster rolls in and swells huge.
        k.set(bluster, { opacity: 1 });
        k.sfx.ominous();
        await k.to(bluster, 2, { x: 0, scale: 1, ease: 'power2.out' });
        await k.camera({ zoom: 1.2, x: 600, y: 200 }, 0.6);
        await k.all(k.say('mySky', bluster), k.quake(6), k.to(bluster, 0.6, { scale: 1.08, yoyo: true, repeat: 1 }));
        await k.camera({}, 0.8);

        // He blows: sideways wind and rain, no lightning. The friends cling together.
        k.pose(bluster, 'blow');
        k.fx.wind(3);
        lowRumble(2.2);
        k.sfx.boom();
        const gust = blownRain(k, 3);
        await k.all(
          k.to(peter, 0.7, { x: '+=40' }),
          k.to(mollie, 0.7, { x: '-=10' }),
          k.to(jigs, 0.7, { x: '-=5' }),
          k.shake(cast.potRed, 6, 3),
          k.shake(cast.potBlue, 6, 3),
          k.shake(cast.potYellow, 6, 3),
        );
        await k.all(k.say('holdOn', peter), k.shake(mollie, 3, 2));
        await gust;
        await k.wait(300);

        // Cut back: Mollie, small and brave.
        k.music('sneaky');
        void k.to(cast.veil, 1.5, { opacity: 0.22 });
        await k.all(k.say('whyCross', mollie), k.to(mollie, 0.6, { x: '+=20' }));
        await k.wait(200);

        // He sags: nobody ever says hooray for the rain.
        k.pose(bluster, 'sulk');
        k.music('dreamy');
        await k.to(bluster, 1, { scale: 0.62, y: 70, x: -60, ease: 'sine.inOut' });
        await k.say('nobodyHooray', bluster);
        await k.wait(400);
        await k.say('noRain', mollie);
        await k.all(k.say('idoQ', bluster), k.to(cast.veil, 1.5, { opacity: 0 }));
        await k.wait(200);

        // Mother Dabble comes back, and everyone paints the rainbow.
        k.music('triumph');
        const dab = k.character('dabble', { x: 960, y: 390, w: 210, z: 11, pose: 'paint', flip: true });
        cast.dabble = dab;
        await k.to(dab, 0.8, { x: '-=260', ease: 'power2.out' });
        await k.say('brushes', dab);
        await paintStripe(k, 0, dab);
        await paintStripe(k, 1, peter);
        await paintStripe(k, 2, mollie);
        await paintStripe(k, 3, jigs);
        await paintStripe(k, 4, peter);
        await paintStripe(k, 5, mollie);
        await paintStripe(k, 6, dab);
        // The big flourish, all along the arch.
        for (const [x, y] of [[250, 400], [380, 260], [560, 130]]) k.sparkle(x, y, 14, 140);
        k.flourish(stripes[3]);
        k.fx.twinkle();
        void k.glow('#fff4c8', 0.35, 1.6);
        k.pose(dab, 'happy');
        await k.say('beautiful', dab);

        // Hooray for Bluster!
        await k.all(k.say('hipHip', peter), k.hop(peter, 22, 1));
        k.fx.jingle();
        await k.all(k.say('hooray', mollie), k.hop(mollie, 24, 1), k.hop(jigs, 24, 1), k.hop(dab, 24, 1), k.hop(peter, 24, 1));
        k.pose(bluster, 'beam');
        cast.glow = k.light(bluster.offsetLeft + 250, 160, 260, { color: '#eef3ff', strength: 0, z: 34 });
        void k.to(cast.glow, 1.6, { opacity: 0.4 });
        await k.to(bluster, 1, { scale: 0.8, y: 40, x: -20, ease: 'sine.inOut' });
        k.fx.twinkle();
        await k.say('blusterBeams', bluster);
      },
    },

    // ==================================================== 4. The slide home
    {
      name: 'The slide home',
      set(k) {
        k.backdrop('rainbow-end');
        k.music('triumph');
        laidStripes(k, true);
        cast.dabble = k.character('dabble', { x: 760, y: 392, w: 220, z: 11, pose: 'happy', flip: true });
        ride = chairRide.set(k, {
          x: 330,
          y: 400,
          w: 300,
          wings: true,
          riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'arm', flip: true }],
        });
        [cast.mollie, cast.peter, cast.jigs] = ride.riders;
        redNose(k, cast.peter);
      },
      async play(k) {
        const { dabble, jigs } = cast;
        await k.say('quickest', dabble);
        await k.all(k.say('slideIt', jigs), k.shake(jigs, 3, 2));
        hatBell();

        // Up to the top of the rainbow.
        creak();
        wingbeats(3);
        await chairRide.fly(k, ride, { x: 170, y: -390, s: 1.8 });
        await wishing.foldWings(k, ride.chair);
        await k.wait(300);

        // Down the rainbow: a long curving slide, wheee!
        slideWhoosh();
        highWind(3);
        const parts = rideParts(ride);
        const slide = async (x: number, y: number, s: number, rotation: number, ease = 'none', opacity?: number): Promise<void> => {
          await k.all(...parts.map((el) => k.to(el, s, { x: `+=${x}`, y: `+=${y}`, rotation, ease, opacity })));
        };
        const wheee = k.say('wheee');
        await slide(-90, 80, 0.5, -8, 'power1.in');
        await slide(-110, 150, 0.45, -12);
        await slide(-80, 160, 0.4, -8);
        await slide(-50, 180, 0.4, -4);
        await slide(-30, 160, 0.4, 0, 'power1.out', 0);
        await wheee;

        // Home: everyone lands in a heap in the playroom.
        await k.cut(() => {
          k.backdrop('playroom');
          k.music('cosy');
          cast.chair2 = k.prop('wishing-chair', { x: 770, y: 360, w: 320, z: 12 });
          cast.peter = k.character('peter', { x: 90, y: 388, w: 230, z: 11 });
          cast.mollie = k.character('mollie', { x: 330, y: 395, w: 230, z: 12 });
          cast.jigs = k.character('jigs', { x: 580, y: 500, w: 150, z: 13 });
          redNose(k, cast.peter);
          k.set([cast.peter, cast.mollie, cast.jigs], { y: -900 });
        });
        const { peter: p, mollie: m, jigs: j } = cast;
        k.fx.whizz();
        await k.all(...[p, m, j].map((el, i) => k.wait(i * 220).then(async () => {
          await k.to(el, 0.4, { y: 0, ease: 'power2.in' });
          k.fx.thud();
          await k.pop(el, 1.06);
        })));
        giggle();
        await k.all(k.hop(p, 16, 1), k.hop(m, 16, 1), k.hop(j, 16, 1));
        await k.all(k.say('redNoseLine', j), k.shake(j, 3, 2));
        await k.say('stillWet', p);

        // Tip-tap on the window: Bluster, with a tiny rainbow of his own.
        await k.wait(500);
        k.fx.knock(3);
        await k.say('tipTap', m);
        cast.tiny = k.character('bluster', { x: 130, y: 80, w: 150, z: 20, pose: 'beam' });
        k.set(cast.tiny, { opacity: 0 });
        await k.fade(cast.tiny, 1, 0.8);
        k.ambient('rain', { count: 8, z: 21, area: [120, 230, 180, 200] });
        k.fx.patter(8);
        await k.wait(800);
        cast.window = k.add(miniBow(), { x: 90, y: 250, w: 220, z: 19 });
        k.set(cast.window, { opacity: 0 });
        await k.fade(cast.window, 1, 1.4);
        k.flourish(cast.window);
        await k.say('ownRainbow', m);
        void wave(k, p, 3);
        await k.say('hoorayEnd', p);
        await warmEnding(k, { cast: [p, m, j], end: 'end', music: 'cosy', sparkleAt: [200, 300] });
      },
    },
  ],
});
