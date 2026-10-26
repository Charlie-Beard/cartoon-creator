/**
 * Jack Frost's Snowy Land: Mollie wishes for snow, the Wishing-Chair flies
 * the friends to the Land of Winter, and cheeky Jack Frost freezes its wings
 * so nobody can leave. He only wants someone to play with.
 *
 *   1. A wish for snow. A grey, wet morning in the playroom. Mollie wishes
 *      it would snow, and the chair, which heard, wriggles and grows its
 *      wings. Jigs says to wrap up warm. DEED: Mollie fetches the basket of
 *      scarves and mittens and carries it to Peter and then to Jigs, and
 *      puts on her own red scarf. All aboard, and off they fly.
 *   2. The Land of Winter. Snowflakes start to fall up in the sky, and the
 *      chair lands in a snowy land of firs and an ice palace. DEEDS: Peter
 *      rolls the snowman's big body, Mollie lifts on his head, Jigs carries
 *      the carrot nose. Then an icy laugh from nowhere. Frost creeps over
 *      the chair: its wings are frozen solid and they can't fly home. The
 *      icy laugh again, and the wind rises.
 *   3. Jack Frost. SCARY BEAT: in a whirl of snow Jack Frost swoops down and
 *      looms: "Nobody leaves MY land!" He blows an icy wind and the friends
 *      huddle. CUT BACK: Mollie, brave: "Why did you freeze our chair?" He
 *      lands, folds his arms and sulks: everyone runs away because he is
 *      too cold to play with. Peter: then play with us, we made a snowman!
 *      BIG DEED: Mollie unwinds her red scarf and wraps it round his neck.
 *      "Nobody ever gave me a present before." He snaps his fingers, the
 *      frost fades, Jigs rubs the wings warm and they flap free. "Will you
 *      come back?" "Every winter!" All aboard, and the chair rises.
 *   4. Cocoa by the stove. Flying home, Jack Frost waves the red scarf far
 *      below. In the evening playroom, cocoa by the glowing stove ("My nose
 *      is still cold!"). The window has frosted over. DEED: Peter breathes
 *      on the glass and wipes a circle, and a frost picture of a snowman in
 *      a red scarf glows there: Jack Frost's thank-you.
 *
 * Scary, never cruel (docs/STYLE.md): Jack Frost is heard before he is seen,
 * whirls in, looms, blows a cold wind and freezes the chair, but touches
 * nobody; the heroes' answer is a brave question, and the scare ends in a
 * friend made. The frost on the chair is a fading veil, never a flash.
 *
 * New in the wishing world: Jack Frost (poses laugh, sulk, happy) and the
 * snow-land backdrop. Drawn here: the basket, the worn scarf, the snowman in
 * parts, the frost over the chair, the stove, the frosted window and the
 * picture in it, the cocoa and the far-off snowy hill.
 */
import { bell, C, defineCartoon, noiseBurst, NOTE, now, tone, type Kit } from '../../kit';
import { moves as commonMoves, sounds as common } from '../../worlds/common/moves';
import { warmEnding } from '../../worlds/common/pieces';
import { moves as wishing, sounds } from '../../worlds/wishing/moves';
import { chairRide, type Ride } from '../../worlds/wishing/pieces';
import { basket, breath, carrot, coalFace, cocoa, drift, farSnow, frostOverChair, frostPane, frostPicture, snowBody, snowDress, snowHead, stove, wornScarf } from './art';
import meta from './meta';

const { creak, hatBell, highWind, wingbeats } = sounds;
const { laugh, giggle, hiss, pour } = common;
const { wave } = commonMoves;

// ---------------------------------------------------------------- sounds

/** Jack Frost's laugh: quick, thin, icy tinkles going up and down. */
function icyLaugh(): void {
  const t = now();
  [NOTE.E6, NOTE.G6, NOTE.E6, NOTE.C7, NOTE.G6, NOTE.E6].forEach((f, i) => bell(f, t + i * 0.11, 0.05, 0.4));
  tone(NOTE.C7, t + 0.2, { wave: 'triangle', peak: 0.025, attack: 0.05, decay: 0.6, glideTo: NOTE.G6, vibrato: [14, 40] });
}

/** Footsteps in deep snow: a crisp squeak and a soft crump for each step. */
function crunch(steps = 4, gap = 0.3): void {
  const t = now();
  for (let i = 0; i < steps; i++) {
    noiseBurst(t + i * gap, { freq: 2800, q: 0.8, peak: 0.06, attack: 0.004, decay: 0.09 });
    noiseBurst(t + i * gap + 0.04, { freq: 800, q: 0.8, peak: 0.05, attack: 0.01, decay: 0.1 });
  }
}

/** Frost creeping over wood: lots of tiny ice crackles and one thin chime. */
function frostCrackle(): void {
  const t = now();
  for (let i = 0; i < 16; i++) noiseBurst(t + i * 0.1 + Math.random() * 0.05, { freq: 5200 + Math.random() * 2400, type: 'highpass', peak: 0.03, attack: 0.002, decay: 0.05 });
  bell(NOTE.C7, t + 0.2, 0.03, 1.2);
  bell(NOTE.G6, t + 0.9, 0.025, 1.2);
}

/** A deep, slow creak of ice: Jack Frost looming. */
function iceCreak(): void {
  const t = now();
  tone(110, t, { wave: 'sawtooth', peak: 0.05, attack: 0.3, decay: 1.4, glideTo: 70, lowpass: 400, vibrato: [7, 6] });
  noiseBurst(t, { freq: 300, q: 2, peak: 0.04, attack: 0.4, decay: 1.2 });
}

/** A finger-snap of ice: a dry click and a ting. */
function snap(): void {
  const t = now();
  noiseBurst(t, { freq: 3500, q: 3, peak: 0.1, attack: 0.002, decay: 0.05 });
  bell(NOTE.C7, t + 0.03, 0.05, 0.6);
}

// ------------------------------------------------------------------ cast

type Name =
  | 'mollie' | 'peter' | 'jigs' | 'jack' | 'chair' | 'basket' | 'scarf' | 'frost' | 'body' | 'dress' | 'head' | 'face' | 'nose'
  | 'cup' | 'cupJigs' | 'pane' | 'fog' | 'picture' | 'far' | 'stove';
const cast = {} as Record<Name, HTMLElement>;
let ride: Ride;

const RED = C.coatRed;
const CREAM = '#f1e4c4';

/** Everything moving with the chair. */
const rideParts = (r: Ride): HTMLElement[] => [r.chair, r.front, ...r.riders];

/** A woolly scarf round the neck of the portrait whose top-left is x, y and width w. */
function scarfOn(k: Kit, x: number, y: number, w: number, z: number, color = RED, stripe = CREAM, name = 'red'): HTMLElement {
  const s = w / 300;
  return k.add(wornScarf(color, stripe, name), { x: x + 75 * s, y: y + 205 * s, w: 150 * s, z });
}

/** The snowman's pieces, where they end up. */
const BODY = { x: 75, y: 444, w: 230 };
const HEAD = { x: 115, y: 320, w: 150 };
const NOSE_AT: [number, number] = [175, 396];

/** The snowman's parts, hidden, for scenes 2 and 3 (`done`: all built already). */
function snowman(k: Kit, done: boolean): void {
  cast.body = k.add(snowBody(), { ...BODY, z: 8 });
  cast.dress = k.add(snowDress(), { x: 50, y: 450, w: 280, z: 9 });
  cast.head = k.add(snowHead(), { ...HEAD, z: 9 });
  cast.face = k.add(coalFace(), { x: 145, y: 352, w: 90, z: 10 });
  cast.nose = k.add(carrot(), { x: 145, y: 384, w: 60, z: 11 });
  if (!done) k.set([cast.body, cast.dress, cast.head, cast.face, cast.nose], { opacity: 0 });
  // A low drift across the front, over everyone's bottom edge: they stand in the snow.
  k.add(drift(), { x: 0, y: 612, w: 1180, z: 21 });
}

/** Ice over the chair: a veil laid exactly on it, hidden until the frost creeps. */
function frostChair(k: Kit, r: Ride, shown: boolean): void {
  cast.frost = k.add(frostOverChair(), { x: r.at.x, y: r.at.y, w: r.at.w, z: r.at.z + 6 });
  if (!shown) k.set(cast.frost, { opacity: 0 });
}

/** The chair settles after its landing: a bump, a boing, but its wings stay out. */
async function touchDown(k: Kit, r: Ride): Promise<void> {
  await chairRide.fly(k, r, { x: 0, y: -26, s: 1.8 });
  k.fx.thud();
  await k.all(...rideParts(r).map((el) => k.to(el, 0.18, { y: 0, ease: 'power2.in' })));
  k.fx.boing();
  await k.all(...rideParts(r).map((el) => k.to(el, 0.12, { y: -10, yoyo: true, repeat: 1 })));
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. A wish for snow
    rainy: { who: 'narrator', text: 'It was a grey, wet morning, and the rain tapped on the playroom window.' },
    wishSnow: { who: 'mollie', text: 'Rain, rain, rain! I wish it would snow instead.' },
    realSnow: { who: 'peter', text: 'Real snow! Deep enough for a snowman!' },
    chairHeard: { who: 'jigs', text: 'Uh-oh. The chair heard that wish!' },
    wrapUp: { who: 'jigs', text: 'If we’re going to the snow, we must wrap up warm.' },
    fetch: { who: 'mollie', text: 'I’ll fetch the scarves and mittens!' },
    scarves: { who: 'mollie', text: 'A green scarf for Peter. Mittens for Jigs. And my red scarf for me!' },
    snug: { who: 'jigs', text: 'Snug as a bug in a rug!' },
    toSnow: { who: 'peter', text: 'All aboard! To the snow, chair!' },
    // 2. The Land of Winter
    sky: { who: 'mollie', text: 'Brrr! It’s snowing up here already!' },
    winterLand: { who: 'jigs', text: 'That means we’re near the Land of Winter!' },
    crunch: { who: 'mollie', text: 'Crunch, crunch! The snow is so deep.' },
    perfect: { who: 'peter', text: 'It’s perfect! Let’s build a snowman!' },
    rolls: { who: 'peter', text: 'I’ll roll the big round body. Push, push, push!' },
    headLine: { who: 'mollie', text: 'And I’ll lift on his head. Heave-ho!' },
    noseLine: { who: 'jigs', text: 'He needs a nose! I’ll bring the carrot.' },
    done: { who: 'mollie', text: 'There! Now he’s a proper snowman.' },
    laugh1: { who: 'jackFrost', text: 'Hee hee hee!' },
    whoWas: { who: 'peter', text: 'Who was that?' },
    frozen: { who: 'jigs', text: 'Oh no! The chair’s wings are frozen solid!' },
    cantFly: { who: 'mollie', text: 'We can’t fly home!' },
    laugh2: { who: 'jackFrost', text: 'Hee hee hee hee!' },
    // 3. Jack Frost
    nobody: { who: 'jackFrost', text: 'Nobody leaves MY land! Hee hee hee!' },
    brave: { who: 'mollie', text: 'Why did you freeze our chair?' },
    runAway: { who: 'jackFrost', text: 'Everyone runs away from me. They say I’m too cold to play with.' },
    stayPlay: { who: 'jackFrost', text: 'I just want someone to stay and play.' },
    playWithUs: { who: 'peter', text: 'Then play with us! We made a snowman. Look!' },
    snowmanFor: { who: 'jackFrost', text: 'A snowman? For me?' },
    cosy: { who: 'mollie', text: 'And here’s something to keep you cosy.' },
    present: { who: 'jackFrost', text: 'Nobody ever gave me a present before.' },
    wakeUp: { who: 'jigs', text: 'Come on, wings. Wake up! I’ll rub you warm.' },
    comeBack: { who: 'jackFrost', text: 'Will you come back and play again?' },
    promise: { who: 'peter', text: 'Every winter! We promise!' },
    // 4. Cocoa by the stove
    waving: { who: 'mollie', text: 'Jack Frost is waving my red scarf. He looks so happy!' },
    cocoa: { who: 'mollie', text: 'Cocoa for everyone, to warm us up.' },
    coldNose: { who: 'peter', text: 'My nose is still cold!' },
    giggle: { who: 'jigs', text: 'Ha ha! It’s as pink as a cherry!' },
    window: { who: 'mollie', text: 'Look at the window! It’s all frosty.' },
    breathe: { who: 'peter', text: 'I’ll breathe on it and wipe a circle. Hhhh!' },
    picture: { who: 'mollie', text: 'Oh! A snowman in a little red scarf!' },
    thanks: { who: 'jigs', text: 'It’s a thank-you from Jack Frost!' },
    end: { who: 'narrator', text: 'Far away in the Land of Winter, Jack Frost kept his red scarf on all night.' },
  },
  scenes: [
    // ==================================================== 1. A wish for snow
    {
      name: 'A wish for snow',
      set(k) {
        k.backdrop('playroom');
        k.music('dreamy');
        k.dim(0.4, '#3e4a5c');
        k.ambient('rain', { count: 18, z: 2, area: [70, 130, 260, 330] });
        ride = chairRide.set(k, { x: 640, y: 295, w: 380, riders: [{ id: 'jigs', slot: 'arm', flip: true }] });
        cast.jigs = ride.riders[0];
        cast.chair = ride.chair;
        cast.mollie = k.character('mollie', { x: 120, y: 386, w: 230 });
        cast.peter = k.character('peter', { x: 400, y: 390, w: 230 });
        cast.basket = k.add(basket(), { x: 190, y: 540, w: 130, z: 16 });
        k.set(cast.basket, { opacity: 0 });
      },
      async play(k) {
        const { mollie, peter, jigs, chair } = cast;
        await k.say('rainy');
        await k.say('wishSnow', mollie);
        await k.all(k.say('realSnow', peter), k.hop(peter, 24, 1));

        // The chair heard, and grows its wings.
        await wishing.wriggle(k, chair, 3);
        hatBell();
        await k.all(k.say('chairHeard', jigs), k.shake(jigs, 4, 2));
        k.music('magic');
        await chairRide.wings(k, ride);
        await chairRide.flap(k, ride, 2);
        await k.say('wrapUp', jigs);

        // Mollie fetches the basket of woolly things and takes it round.
        await k.all(k.say('fetch', mollie), k.to(mollie, 0.4, { x: '+=10' }));
        k.sfx.rustle();
        await k.appear(cast.basket, 0.5);
        await k.say('scarves', mollie);
        await k.carry(cast.basket, peter);
        k.sfx.rustle();
        await k.wait(500);
        await k.carry(cast.basket, jigs);
        hatBell();
        await k.all(k.say('snug', jigs), k.hop(jigs, 16, 1));
        await k.vanish(cast.basket, 0.3);
        // Her own red scarf goes on.
        cast.scarf = scarfOn(k, 120, 386, 230, 17);
        k.sfx.rustle();
        await k.appear(cast.scarf, 0.4);
        await k.wait(500);

        // All aboard.
        await k.say('toSnow', peter);
        k.fx.boing();
        await k.all(
          ...[mollie, cast.scarf, peter].map((el) => k.to(el, 0.7, { x: '+=420', y: '-=60', opacity: 0, ease: 'power1.inOut' })),
        );
        for (const el of [mollie, cast.scarf, peter]) k.remove(el);
        cast.mollie = await chairRide.seat(k, ride, { id: 'mollie', slot: 'left' });
        cast.peter = await chairRide.seat(k, ride, { id: 'peter', slot: 'right' });
        const b = k.box(cast.mollie);
        ride.riders.push(scarfOn(k, b.x, b.y, b.w, ride.at.z + 4));
        creak();
        k.music('adventure');
        highWind(2);
        await chairRide.fly(k, ride, { x: 900, y: -140, s: 2, tilt: -8 });
      },
    },

    // ==================================================== 2. The Land of Winter
    {
      name: 'The Land of Winter',
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
        const b = k.box(cast.mollie);
        ride.riders.push(scarfOn(k, b.x, b.y, b.w, ride.at.z + 4));
        chairRide.jump(k, ride, { x: -800, y: 40 });
      },
      async play(k) {
        highWind(3);
        await chairRide.fly(k, ride, { x: 0, y: 0, s: 2.4 });
        // Colder up here: the first slow flakes.
        k.ambient('snow', { count: 24, z: 31 });
        await k.all(k.say('sky', cast.mollie), chairRide.flap(k, ride, 2));
        hatBell();
        await k.say('winterLand', cast.jigs);

        // Down to the snow.
        await k.cut(() => {
          k.backdrop('snow-land');
          k.music('adventure');
          k.ambient('snow', { count: 30, z: 31 });
          ride = chairRide.set(k, {
            x: 900,
            y: 367,
            w: 300,
            wings: true,
            riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'arm', flip: true }],
          });
          [cast.mollie, cast.peter, cast.jigs] = ride.riders;
          cast.chair = ride.chair;
          const b = k.box(cast.mollie);
          cast.scarf = scarfOn(k, b.x, b.y, b.w, ride.at.z + 4);
          ride.riders.push(cast.scarf);
          chairRide.jump(k, ride, { x: -1300, y: -420 });
          snowman(k, false);
          frostChair(k, ride, false);
        });
        const { mollie, peter, jigs } = cast;
        highWind(2);
        await touchDown(k, ride);

        // Out of the chair, and into the snow.
        await k.all(k.say('perfect', peter), k.shake(peter, 3, 1));
        await chairRide.hopOff(k, ride, peter, { x: 500, y: 420, w: 200 });
        await chairRide.hopOff(k, ride, mollie, { x: 640, y: 420, w: 200 });
        await chairRide.hopOff(k, ride, jigs, { x: 840, y: 492, w: 140 });
        await k.all(k.fade(cast.scarf, 0, 0.2));
        k.remove(cast.scarf);
        cast.scarf = scarfOn(k, 640, 420, 200, 17);
        k.set(cast.scarf, { opacity: 0 });
        await k.fade(cast.scarf, 1, 0.3);
        jigs.style.zIndex = '19';
        crunch(5, 0.28);
        await k.all(k.say('crunch', mollie), k.shake(mollie, 3, 1));

        // Peter rolls the snowman's big body across the snow, and it grows.
        await k.say('rolls', peter);
        k.face(peter, true);
        k.set(cast.body, { opacity: 1, x: 330, y: 62, scale: 0.35, rotation: 0 });
        crunch(8, 0.3);
        await k.all(k.to(cast.body, 2.6, { x: 0, y: 0, scale: 1, rotation: -720, ease: 'sine.inOut' }), k.walk(peter, -170, 2.6, 6));
        k.fx.thud();
        await k.pop(cast.body, 1.05);
        await k.wait(400);

        // Mollie lifts on the head.
        await k.say('headLine', mollie);
        k.set(cast.head, { opacity: 1, x: 520, y: 150 });
        await k.carry(cast.head, [HEAD.x + HEAD.w / 2, HEAD.y + 70]);
        k.fx.thud();
        await k.pop(cast.head, 1.08);
        k.set(cast.dress, { opacity: 1 });
        await k.appear(cast.dress, 0.4);
        k.fx.pop();
        await k.appear(cast.face, 0.4);
        await k.wait(500);

        // Jigs tosses the carrot over, and it glides on to the face.
        await k.all(k.say('noseLine', jigs), k.hop(jigs, 16, 1));
        hatBell();
        k.set(cast.nose, { opacity: 1, x: 695, y: 164 });
        k.sfx.rustle();
        await k.to(cast.nose, 0.7, { x: 345, y: 24, rotation: -200, ease: 'power2.out' });
        k.set(cast.nose, { rotation: 0 });
        await k.carry(cast.nose, NOSE_AT);
        k.fx.pop();
        await k.pop(cast.nose, 1.15);
        await k.wait(500);
        await k.all(k.say('done', mollie), k.hop(mollie, 22, 1));
        laugh();
        await k.all(k.hop(peter, 22, 1), k.hop(jigs, 22, 1));
        await k.wait(500);

        // A thin icy laugh from nowhere.
        k.silence();
        await k.wait(500);
        icyLaugh();
        await k.all(k.say('laugh1'), k.shake(mollie, 3, 1), k.shake(peter, 3, 1), k.shake(jigs, 3, 1));
        await k.say('whoWas', peter);

        // The frost creeps over the chair.
        k.music('spooky');
        frostCrackle();
        await k.fade(cast.frost, 1, 2);
        await k.all(k.say('frozen', jigs), k.shake(jigs, 4, 2));
        await k.say('cantFly', mollie);
        k.fx.wind(2);
        icyLaugh();
        await k.say('laugh2');
      },
    },

    // ==================================================== 3. Jack Frost
    {
      name: 'Jack Frost',
      set(k) {
        k.backdrop('snow-land');
        k.music('spooky');
        k.ambient('snow', { count: 30, z: 31 });
        snowman(k, true);
        ride = chairRide.set(k, { x: 900, y: 367, w: 300, wings: true });
        cast.chair = ride.chair;
        frostChair(k, ride, true);
        cast.peter = k.character('peter', { x: 540, y: 424, w: 190, z: 10 });
        cast.mollie = k.character('mollie', { x: 740, y: 420, w: 200, z: 11 });
        cast.scarf = scarfOn(k, 740, 420, 200, 17);
        cast.jigs = k.character('jigs', { x: 940, y: 492, w: 140, z: 19 });
        cast.jack = k.character('jackFrost', { x: 400, y: -90, w: 420, z: 18, pose: 'laugh' });
        k.set(cast.jack, { opacity: 0, y: -700 });
        k.face(cast.peter, true);
      },
      async play(k) {
        const { mollie, peter, jigs, jack, scarf } = cast;
        // A whirl of snow, a deep creak, and he swoops down.
        k.fx.wind(3);
        await k.wait(200);
        for (const [x, y] of [[480, 120], [700, 90], [600, 200]]) k.puff(x, y, 240, '#ffffff');
        iceCreak();
        k.sfx.ominous();
        await k.all(k.shake(mollie, 3, 2), k.shake(peter, 3, 2), k.shake(jigs, 3, 2));
        k.set(jack, { opacity: 1, rotation: -18 });
        await k.to(jack, 1.4, { y: 0, rotation: 0, ease: 'power2.out' });
        await k.camera({ zoom: 1.25, x: 610, y: 280 }, 1);
        await k.all(k.say('nobody', jack), k.quake(5));
        await k.camera({}, 0.8);

        // He blows an icy wind, and the friends huddle together.
        k.fx.wind(2.5);
        await k.all(
          k.to(jack, 0.5, { scale: 1.06, yoyo: true, repeat: 1 }),
          k.to(mollie, 0.7, { x: '-=30' }),
          k.to(peter, 0.7, { x: '-=10' }),
          k.to(scarf, 0.7, { x: '-=30' }),
          k.shake(jigs, 4, 3),
        );
        await k.wait(400);

        // Cut back to the heroes: Mollie is brave.
        k.music('sneaky');
        await k.all(k.say('brave', mollie), k.to(mollie, 0.5, { x: '-=20' }), k.to(scarf, 0.5, { x: '-=20' }));
        await k.wait(500);

        // He lands, folds his arms, and sulks.
        k.pose(jack, 'sulk');
        k.music('dreamy');
        k.fx.whizz();
        await k.to(jack, 1.2, { x: -180, y: 372, scale: 0.58, ease: 'power2.inOut' });
        k.fx.thud();
        await k.say('runAway', jack);
        await k.say('stayPlay', jack);

        // Peter shows him the snowman.
        k.music('cosy');
        await k.all(k.say('playWithUs', peter), k.hop(peter, 22, 1));
        k.pose(jack, 'laugh');
        await k.all(k.say('snowmanFor', jack), k.hop(jack, 24, 1));

        // Mollie's big deed: her red scarf for Jack Frost.
        await k.all(k.say('cosy', mollie), k.to(mollie, 0.9, { x: '-=30' }), k.to(scarf, 0.9, { x: '-=30' }));
        k.sfx.rustle();
        await k.carry(scarf, [430, 566], 1.1);
        k.remove(scarf);
        k.pose(jack, 'happy');
        k.fx.twinkle();
        await k.wait(900);
        k.music('dreamy');
        await k.say('present', jack);
        await k.wait(1000);

        // He snaps his fingers, and the frost fades from the chair.
        const [snapper] = k.pivot(k.part(jack, 'armR'));
        snap();
        await k.to(snapper, 0.2, { rotation: -25, yoyo: true, repeat: 1 });
        k.sparkle(1030, 460, 12, 160);
        await k.fade(cast.frost, 0, 1.6);
        k.music('magic');

        // Jigs rubs the wings warm, and they flap free.
        await k.all(k.say('wakeUp', jigs), k.to(jigs, 0.6, { x: '-=30' }));
        const [rub] = k.pivot(k.part(jigs, 'armR'));
        k.sfx.rustle();
        await k.to(rub, 0.22, { rotation: -40, yoyo: true, repeat: 5, ease: 'sine.inOut' });
        k.flourish(cast.chair);
        wingbeats(3);
        await wishing.flap(k, cast.chair, 3);
        await k.wait(400);

        // A promise, and all aboard.
        await k.all(k.say('comeBack', jack), wave(k, jack, 1));
        await k.all(k.say('promise', peter), k.hop(peter, 22, 1));
        for (const el of [mollie, peter, jigs]) void k.vanish(el, 0.5);
        await k.wait(600);
        await chairRide.seat(k, ride, { id: 'mollie', slot: 'left' });
        await chairRide.seat(k, ride, { id: 'peter', slot: 'right' });
        await chairRide.seat(k, ride, { id: 'jigs', slot: 'arm', flip: true });
        creak();
        k.music('adventure');
        highWind(2);
        await chairRide.fly(k, ride, { y: -700, s: 2.2 });
      },
    },

    // ==================================================== 4. Cocoa by the stove
    {
      name: 'Cocoa by the stove',
      set(k) {
        k.backdrop('wishing-sky');
        k.music('dreamy');
        cast.far = k.add(farSnow(), { x: -20, y: 640, w: 380, z: 3 });
        cast.jack = k.character('jackFrost', { x: 90, y: 530, w: 100, z: 4, pose: 'happy' });
        ride = chairRide.set(k, {
          x: 420,
          y: 130,
          w: 360,
          wings: true,
          riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'back', flip: true }],
        });
        [cast.mollie, cast.peter, cast.jigs] = ride.riders;
        chairRide.jump(k, ride, { x: -900, y: 20 });
      },
      async play(k) {
        // Far below, Jack Frost waves the red scarf.
        highWind(3);
        void wave(k, cast.jack, 6);
        await k.all(chairRide.fly(k, ride, { x: 0, y: 0, s: 2.6 }), k.wait(1500).then(() => k.say('waving', cast.mollie)));
        await chairRide.flap(k, ride, 2);

        // Home, to the evening playroom.
        await k.cut(() => {
          k.backdrop('playroom');
          k.music('cosy');
          k.dim(0.3, '#241c3a');
          k.light(645, 540, 230, { color: '#ffb35c', strength: 0.4, flicker: true, z: 5 });
          cast.stove = k.add(stove(), { x: 570, y: 405, w: 150, z: 6 });
          cast.chair = k.prop('wishing-chair', { x: 830, y: 331, w: 340, z: 12 });
          cast.pane = k.add(frostPane(), { x: 90, y: 180, w: 200, z: 7 });
          k.set(cast.pane, { opacity: 0 });
          cast.peter = k.character('peter', { x: 70, y: 350, w: 250, z: 11 });
          cast.mollie = k.character('mollie', { x: 320, y: 388, w: 230, z: 12 });
          cast.jigs = k.character('jigs', { x: 700, y: 480, w: 160, z: 13 });
        });
        const { mollie, peter, jigs } = cast;
        creak();
        await k.wait(600);

        // Cocoa, poured and passed round.
        pour();
        cast.cup = k.add(cocoa(), { x: 340, y: 520, w: 90, z: 16 });
        cast.cupJigs = k.add(cocoa(), { x: 340, y: 520, w: 90, z: 16 });
        k.set([cast.cup, cast.cupJigs], { opacity: 0 });
        await k.all(k.say('cocoa', mollie), k.appear(cast.cup, 0.5));
        await k.carry(cast.cup, peter, 0.8);
        await k.appear(cast.cupJigs, 0.3);
        await k.to(cast.cupJigs, 0.9, { x: 360, y: -20, ease: 'sine.inOut' });
        await k.wait(500);
        await k.all(k.say('coldNose', peter), k.shake(peter, 3, 2));
        giggle();
        await k.all(k.say('giggle', jigs), k.hop(jigs, 20, 1));

        // The window has frosted over.
        await k.all(k.vanish(cast.cup, 0.3), k.vanish(cast.cupJigs, 0.3));
        frostCrackle();
        await k.all(k.say('window', mollie), k.fade(cast.pane, 1, 2));
        await k.wait(400);

        // Peter's deed: breathe on the glass and wipe a circle.
        await k.say('breathe', peter);
        hiss(1);
        cast.fog = k.add(breath(), { x: 130, y: 240, w: 120, z: 8 });
        k.set(cast.fog, { opacity: 0 });
        await k.fade(cast.fog, 1, 0.9);
        const [wipe] = k.pivot(k.part(peter, 'armR'));
        k.sfx.rustle();
        await k.to(wipe, 0.3, { rotation: -150, ease: 'power1.out' });
        await k.to(wipe, 0.25, { rotation: -120, yoyo: true, repeat: 3, ease: 'sine.inOut' });
        cast.picture = k.add(frostPicture(), { x: 90, y: 190, w: 200, z: 9 });
        await k.all(k.fade(cast.fog, 0, 0.4), k.appear(cast.picture, 0.7), k.to(wipe, 0.4, { rotation: 0 }));
        k.flourish(cast.picture);
        k.fx.twinkle();
        void k.glow('#ffe9a8', 0.25, 1.4);
        await k.wait(600);
        await k.all(k.say('picture', mollie), k.hop(mollie, 22, 1));
        await k.all(k.say('thanks', jigs), k.hop(jigs, 22, 1));
        creak();
        await wishing.wriggle(k, cast.chair, 2);
        await warmEnding(k, { cast: [peter, mollie, jigs], end: 'end', music: 'cosy', sparkleAt: [190, 300] });
      },
    },
  ],
});
