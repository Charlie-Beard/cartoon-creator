/**
 * The Dragon's Wobbly Tooth: Peter has a wobbly tooth and wishes he could see
 * a real dragon, so the Wishing-Chair flies the friends to Dragon Hill. A
 * young dragon called Puff has been roaring all night because his first tooth
 * is wobbly too. They tie a string from his tooth to the chair, the chair
 * flies off, and pop! Out it comes, without hurting a bit.
 *
 *   1. Wobble, wobble (the playroom). Peter wobbles a front tooth and wishes
 *      he could see a real dragon: they have the biggest teeth of all. The
 *      chair heard, and wriggles its wings out. Jigs says a dragon trip needs
 *      string, lots of it, and doesn't know why (the chair is clever).
 *      DEED: Mollie fetches the ball of string and carries it to the chair.
 *      All aboard, and off they go.
 *   2. Dragon Hill (the sky, then the hill). A far-off ROAR rolls across the
 *      sky. They land on Dragon Hill, and far below a cottage roof is black
 *      with scorch. SCARY BEAT: the cave is dark; two big yellow eyes open in
 *      it; ROAR, and smoke rolls out; the friends huddle by a boulder. CUT
 *      BACK: Mollie listens: "That isn't a cross roar. It's a sore roar."
 *      Peter says what's wrong (the whole village must be frightened). DEED:
 *      Jigs hums a lullaby, and a young dragon creeps out with his head low:
 *      "I'm Puff. My tooth is wobbly, and it hurts when I eat, so I roar."
 *   3. Pop! (Dragon Hill). Peter's wobbly tooth is tiny next to Puff's. Puff
 *      can't stop roaring until the tooth comes out. "That's what the string
 *      is for!" DEEDS: Peter ties the string round Puff's tooth; Jigs carries
 *      the ball to the chair and ties the other end to its leg. Mollie holds
 *      Puff's claw: "Not one bit." BIG DEED: "Ready, steady, fly, chair!" and
 *      the chair zooms off with Jigs steering, the string goes tight, POP!
 *      The tooth spins through the air and Peter catches it. Puff opens his
 *      eyes: it didn't hurt at all! A happy smoke ring, a gap-toothed grin,
 *      and now he can eat his supper and the village can sleep.
 *   4. Two teeth (the sky, then the playroom). Flying home, Puff waves from
 *      far below and a smoke ring rises after them. Back in the playroom,
 *      Peter bites his apple, crunch, and his own tooth comes out. DEED:
 *      Mollie tucks both teeth, one tiny and one enormous, under the pillow.
 *      A soft twinkle in the night, and in the morning two gold coins, one
 *      as big as a plate: the Tooth Fairy needed a wheelbarrow!
 *
 * Scary, never cruel (docs/STYLE.md): the cave is dark, the eyes open, the
 * roar is deep and the smoke rolls, but it cuts back to the heroes at once
 * and the roar turns out to be a sore one. Puff only ever breathes smoke
 * and smoke rings, never fire at anybody; the scorched thatch is far away
 * and nobody is hurt. Nothing about the tooth hurts, and everyone says so.
 *
 * New in the wishing world: Puff (poses roar, sad, grin; the tooth is its
 * own part) and the dragon-hill backdrop. Drawn here (art.ts): the apple,
 * the ball of string and the string line, the teeth, the smoke, the cave
 * eyes, the scorched thatch, the pillow and the coins.
 */
import { bell, defineCartoon, noiseBurst, NOTE, now, tone, type Kit } from '../../kit';
import { moves as commonMoves, sounds as common } from '../../worlds/common/moves';
import { warmEnding } from '../../worlds/common/pieces';
import { CAVE_DARK, VILLAGE_SCORCH } from '../../worlds/wishing/dragonhill';
import { moves as wishing, sounds } from '../../worlds/wishing/moves';
import { chairRide, type Ride } from '../../worlds/wishing/pieces';
import { apple, appleBitten, bigTooth, caveEyes, coin, pillow, scorch, smokeCloud, smokeRing, stringBall, stringLine, stringLoop, tinyTooth } from './art';
import meta from './meta';

const { creak, hatBell, highWind } = sounds;
const { giggle, hiss, sniff } = common;
const { wave } = commonMoves;

// ---------------------------------------------------------------- sounds

/** Puff's roar: deep, wobbling and a little breathy. `far` is the same roar heard from a long way off. */
function dragonRoar(far = false): void {
  const t = now();
  const p = far ? 0.03 : 0.07;
  tone(140, t, { wave: 'sawtooth', peak: p, attack: 0.12, decay: 1.3, glideTo: 90, lowpass: 600, vibrato: [6, 8] });
  tone(210, t + 0.1, { wave: 'triangle', peak: p * 0.6, attack: 0.1, decay: 1, glideTo: 120, lowpass: 700, vibrato: [9, 10] });
  noiseBurst(t, { freq: 260, type: 'lowpass', peak: p * 0.9, attack: 0.1, decay: 1.1, sweepTo: 140 });
}

/** A sore little roar: wobbly and cracking, ending in a hiccup. */
function soreRoar(): void {
  const t = now();
  tone(230, t, { wave: 'triangle', peak: 0.05, attack: 0.12, decay: 0.9, glideTo: 150, lowpass: 800, vibrato: [11, 18] });
  tone(330, t + 1.05, { wave: 'sine', peak: 0.04, attack: 0.02, decay: 0.12 });
  tone(300, t + 1.2, { wave: 'sine', peak: 0.03, attack: 0.02, decay: 0.12 });
}

/** Jigs's lullaby: seven slow, soft notes going up and gently down again. */
function lullaby(): void {
  const t = now();
  [NOTE.D4, NOTE.F4, NOTE.A4, NOTE.G4, NOTE.F4, NOTE.E4, NOTE.D4].forEach((f, i) => tone(f, t + i * 0.6, { wave: 'sine', peak: 0.05, attack: 0.15, decay: 0.8 }));
}

/** The string going tight: a thin, rising twang. */
function twang(): void {
  const t = now();
  tone(520, t, { wave: 'triangle', peak: 0.05, attack: 0.02, decay: 0.6, glideTo: 940, vibrato: [30, 30] });
}

/** The tooth coming out: a wet little "pop" and a high plink as it spins away. */
function toothPop(k: Kit): void {
  k.fx.pop();
  bell(NOTE.E6, now() + 0.08, 0.06, 0.5);
}

// ------------------------------------------------------------------ helpers

/** Redraws the string from `a` to `b`: a curve that sags while it is slack. */
function setString(line: HTMLElement, a: [number, number], b: [number, number], slack = 0): void {
  const d = `M${a[0].toFixed(1)} ${a[1].toFixed(1)}Q${((a[0] + b[0]) / 2).toFixed(1)} ${((a[1] + b[1]) / 2 + slack * 2).toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
  line.querySelectorAll('path[data-string]').forEach((p) => p.setAttribute('d', d));
}

/** Where Puff's tooth is at the gum (his portrait is 300 wide; the tooth hangs from (150, 196)), as a stage point. */
function toothAt(k: Kit, puff: HTMLElement): [number, number] {
  const b = k.box(puff);
  const s = b.w / 300;
  return [b.x + 150 * s, b.y + 222 * s];
}

/** Where the chair's right front leg is, as a stage point (the chair art is 440 wide, its leg at about (328, 340)). */
function legAt(k: Kit, chair: HTMLElement): [number, number] {
  const b = k.box(chair);
  return [b.x + b.w * 0.745, b.y + b.h * 0.83];
}

/** The middle of an actor's box, as a stage point. */
function middleOf(k: Kit, el: HTMLElement): [number, number] {
  const b = k.box(el);
  return [b.x + b.w / 2, b.y + b.h / 2];
}

// ------------------------------------------------------------------ cast

const cast = {} as Record<
  | 'mollie' | 'peter' | 'jigs' | 'puff' | 'chair'
  | 'apple' | 'ball' | 'eyes' | 'smoke' | 'string' | 'loop' | 'tooth' | 'tiny' | 'ring' | 'pillow' | 'coinBig' | 'coinSmall',
  HTMLElement
>;
let ride: Ride;

/** Puff on Dragon Hill, in front of the cave: a young dragon as big as a horse. */
const PUFF = { x: 830, y: 285, w: 320, z: 10 };
/** The chair on the hill, on the left. */
const CHAIR = { x: -30, y: 422, w: 240 };

export default defineCartoon({
  ...meta,
  lines: {
    // 1. Wobble, wobble
    afternoon: { who: 'narrator', text: 'One quiet afternoon, Peter sat in the playroom, wobbling his tooth.' },
    wobbly: { who: 'peter', text: 'Look! My tooth is wobbly. Wobble, wobble, wobble!' },
    eatApple: { who: 'mollie', text: 'Eat an apple. That’s how mine came out.' },
    wishDragon: { who: 'peter', text: 'I wish I could see a real dragon. Dragons have the biggest teeth of all!' },
    chairHeard: { who: 'jigs', text: 'Oh dear. The chair heard you wishing!' },
    needString: { who: 'jigs', text: 'A dragon trip needs string. Lots of string. Don’t ask me why!' },
    fetchString: { who: 'mollie', text: 'There’s a ball of string in the drawer. I’ll fetch it!' },
    toDragons: { who: 'peter', text: 'All aboard! To the dragons, chair!' },
    // 2. Dragon Hill
    farRoar: { who: 'mollie', text: 'What was THAT? It sounded like a roar!' },
    hillAhead: { who: 'jigs', text: 'That’s Dragon Hill. Hold on tight, we’re landing!' },
    onHill: { who: 'peter', text: 'We’re really here! Look, there’s a village far below.' },
    roof: { who: 'jigs', text: 'Look at that cottage roof. Someone has been puffing smoke on it.' },
    frightened: { who: 'peter', text: 'He’s roaring and roaring. The whole village must be frightened!' },
    soreRoar: { who: 'mollie', text: 'Wait. Listen. That isn’t a cross roar. It’s a sore roar.' },
    hum: { who: 'jigs', text: 'Dragons love a lullaby. I’ll hum him out.' },
    lullaby: { who: 'jigs', text: 'Hush now, dragon, don’t you cry. Come and hear my lullaby.' },
    friends: { who: 'mollie', text: 'Don’t be afraid. We’re friends.' },
    imPuff: { who: 'puff', text: 'I’m Puff. My tooth is wobbly, and it hurts when I eat, so I roar.' },
    // 3. Pop!
    peterWobble: { who: 'peter', text: 'My tooth is wobbly too! Look!' },
    tiny: { who: 'puff', text: 'Yours is very tiny.' },
    scaring: { who: 'puff', text: 'I’m frightening the whole village. I don’t mean to.' },
    untilOut: { who: 'mollie', text: 'Puff can’t stop roaring until that tooth comes out.' },
    stringIdea: { who: 'peter', text: 'I know! That’s what the string is for!' },
    tieTooth: { who: 'peter', text: 'I’ll tie it on very gently. Hold still, Puff.' },
    tieChair: { who: 'jigs', text: 'And I’ll tie the other end to the chair’s leg.' },
    willHurt: { who: 'puff', text: 'Will it hurt?' },
    notOneBit: { who: 'mollie', text: 'Not one bit. Hold my hand.' },
    flyChair: { who: 'jigs', text: 'Ready… steady… fly, chair!' },
    caught: { who: 'peter', text: 'I caught it! Shall we keep it safe for the Tooth Fairy?' },
    didntHurt: { who: 'puff', text: 'It didn’t hurt! It didn’t hurt at all!' },
    supper: { who: 'puff', text: 'Yes, please! And thank you! Now I can eat my supper.' },
    village: { who: 'jigs', text: 'And the whole village can go to sleep.' },
    // 4. Two teeth
    goodbye: { who: 'mollie', text: 'Look! Puff is saying goodbye.' },
    homeAgain: { who: 'peter', text: 'Home again! Now I’ll try that apple.' },
    crunch: { who: 'peter', text: 'Crunch! Oh! My tooth came out!' },
    twoTeeth: { who: 'mollie', text: 'Two teeth for the Tooth Fairy. One tiny, and one ENORMOUS!' },
    night: { who: 'narrator', text: 'That night, a soft twinkle crept into the playroom.' },
    morning: { who: 'narrator', text: 'In the morning, something was shining under the pillow.' },
    coins: { who: 'peter', text: 'Two gold coins! A tiny one, and one as big as a plate!' },
    wheelbarrow: { who: 'jigs', text: 'The Tooth Fairy needed a wheelbarrow!' },
    end: { who: 'narrator', text: 'And far away, Puff snored softly, with a big, happy gap.' },
  },
  scenes: [
    // ==================================================== 1. Wobble, wobble
    {
      name: 'Wobble, wobble',
      set(k) {
        k.backdrop('playroom');
        k.music('cosy');
        k.light(1010, 380, 240, { color: '#fff3c8', strength: 0.3, z: 5 });
        ride = chairRide.set(k, { x: 640, y: 295, w: 380, riders: [{ id: 'jigs', slot: 'arm', flip: true }] });
        cast.jigs = ride.riders[0];
        cast.chair = ride.chair;
        cast.mollie = k.character('mollie', { x: 90, y: 386, w: 230 });
        cast.peter = k.character('peter', { x: 370, y: 392, w: 230, flip: true });
        cast.apple = k.add(apple(), { x: 540, y: 560, w: 70, z: 16 });
        cast.ball = k.add(stringBall(), { x: 190, y: 540, w: 100, z: 16 });
        k.set(cast.ball, { opacity: 0 });
      },
      async play(k) {
        const { mollie, peter, jigs, chair, apple: fruit, ball } = cast;
        await k.say('afternoon');
        await k.all(k.say('wobbly', peter), k.shake(peter, 3, 3));
        await k.say('eatApple', mollie);
        k.sparkle(575, 590, 8, 60);
        await k.all(k.say('wishDragon', peter), k.hop(peter, 24, 1));
        await k.wait(400);

        // The chair heard: it wriggles and grows its wings all by itself.
        await wishing.wriggle(k, chair, 3);
        hatBell();
        await k.all(k.say('chairHeard', jigs), k.shake(jigs, 4, 2));
        k.music('magic');
        await chairRide.wings(k, ride);
        await chairRide.flap(k, ride, 2);
        await k.say('needString', jigs);

        // Mollie's deed: fetch the ball of string and carry it to the chair.
        await k.all(k.say('fetchString', mollie), k.to(mollie, 0.5, { x: '-=20' }));
        k.sfx.rustle();
        await k.appear(ball, 0.4);
        await k.carry(ball, chair, 1.2);
        k.fx.pop();
        await k.vanish(ball, 0.3);
        await k.wait(300);

        // All aboard.
        await k.all(k.say('toDragons', peter), k.hop(peter, 20, 1));
        k.fx.boing();
        await k.all(...[mollie, peter, fruit].map((el) => k.to(el, 0.7, { x: '+=420', y: '-=60', opacity: 0, ease: 'power1.inOut' })));
        for (const el of [mollie, peter, fruit]) k.remove(el);
        cast.mollie = await chairRide.seat(k, ride, { id: 'mollie', slot: 'left' });
        cast.peter = await chairRide.seat(k, ride, { id: 'peter', slot: 'right' });
        creak();
        k.music('adventure');
        highWind(2);
        await chairRide.fly(k, ride, { x: 900, y: -140, s: 2, tilt: -8 });
      },
    },

    // ==================================================== 2. Dragon Hill
    {
      name: 'Dragon Hill',
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
      },
      async play(k) {
        highWind(3);
        await chairRide.fly(k, ride, { x: 0, y: 0, s: 2.4 });
        // A far-off roar rolls across the sky.
        dragonRoar(true);
        await k.wait(1200);
        await k.all(k.say('farRoar', cast.mollie), chairRide.flap(k, ride, 2));
        hatBell();
        await k.say('hillAhead', cast.jigs);

        // Down onto Dragon Hill.
        await k.cut(() => {
          k.backdrop('dragon-hill');
          k.music('adventure');
          k.add(scorch(), { x: 240, y: 477, w: 54, z: 2 });
          cast.eyes = k.add(caveEyes(), { x: CAVE_DARK.x - 75, y: CAVE_DARK.y - 40, w: 150, z: 3 });
          k.set(cast.eyes, { opacity: 0, scaleY: 0.1 });
          cast.smoke = k.add(smokeCloud(), { x: 760, y: 420, w: 440, z: 26 });
          k.set(cast.smoke, { opacity: 0 });
          cast.puff = k.character('puff', { ...PUFF, pose: 'sad' });
          k.set(cast.puff, { opacity: 0 });
          ride = chairRide.set(k, {
            ...CHAIR,
            wings: true,
            riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'arm', flip: true }],
          });
          [cast.mollie, cast.peter, cast.jigs] = ride.riders;
          cast.chair = ride.chair;
          chairRide.jump(k, ride, { x: -1300, y: -420 });
        });
        const { mollie, peter, jigs, eyes, smoke, puff } = cast;
        highWind(2);
        await chairRide.land(k, ride);
        await k.all(k.say('onHill', peter), chairRide.hopOff(k, ride, mollie, { x: 300, y: 412, w: 200 }));
        await chairRide.hopOff(k, ride, peter, { x: 470, y: 412, w: 200 });
        await chairRide.hopOff(k, ride, jigs, { x: 640, y: 520, w: 130 });
        k.sparkle(VILLAGE_SCORCH.x, VILLAGE_SCORCH.y, 8, 40);
        await k.say('roof', jigs);

        // SCARY BEAT: the dark cave, two yellow eyes, and a ROAR.
        k.silence();
        await k.wait(700);
        k.fx.rumble(1.2);
        await k.camera({ zoom: 1.6, x: CAVE_DARK.x, y: CAVE_DARK.y }, 1.2);
        await k.to(eyes, 1, { opacity: 1, scaleY: 1, ease: 'sine.out' });
        await k.wait(900);
        k.music('spooky');
        dragonRoar();
        void k.quake(8);
        const huddle = [mollie, peter, jigs].map((el, i) => k.to(el, 0.5, { x: `+=${20 + i * 10}`, y: '+=22', scale: 0.92 }));
        k.set(smoke, { x: 0, opacity: 0 });
        await k.all(
          k.camera({}, 0.8),
          k.to(smoke, 2.6, { x: -330, opacity: 0.9, ease: 'power1.out' }),
          k.shake(mollie, 5, 3),
          k.shake(peter, 5, 3),
          ...huddle,
        );
        hiss(1.2);
        await k.all(k.to(smoke, 1.4, { opacity: 0, ease: 'sine.in' }), k.to(eyes, 1, { opacity: 0.5 }));
        await k.all(k.say('frightened', peter), k.shake(peter, 3, 2));

        // CUT BACK: Mollie listens. It is a sore roar, not a cross one.
        k.music('sneaky');
        await k.all(...[mollie, peter, jigs].map((el) => k.to(el, 0.5, { y: '-=22', scale: 1 })));
        soreRoar();
        await k.to(mollie, 0.5, { rotation: 5 });
        await k.say('soreRoar', mollie);
        await k.to(mollie, 0.4, { rotation: 0 });

        // Jigs hums a lullaby, and Puff creeps out with his head low.
        await k.all(k.say('hum', jigs), k.hop(jigs, 16, 1));
        await k.walk(jigs, 50, 0.8, 2);
        k.music('dreamy');
        lullaby();
        await k.all(k.say('lullaby', jigs), k.to(eyes, 1.6, { opacity: 0 }), k.to(puff, 3.2, { opacity: 1, x: -24, ease: 'sine.inOut' }).then(() => undefined));
        k.flourish(puff);
        await k.wait(400);
        await k.say('friends', mollie);
        sniff();
        await k.say('imPuff', puff);
      },
    },

    // ==================================================== 3. Pop!
    {
      name: 'Pop!',
      set(k) {
        k.backdrop('dragon-hill');
        k.music('cosy');
        cast.puff = k.character('puff', { ...PUFF });
        ride = chairRide.set(k, { ...CHAIR });
        cast.chair = ride.chair;
        cast.jigs = k.character('jigs', { x: 230, y: 520, w: 130, z: 16 });
        cast.mollie = k.character('mollie', { x: 370, y: 420, w: 190, z: 16 });
        cast.peter = k.character('peter', { x: 590, y: 420, w: 190, z: 17 });
        cast.ball = k.add(stringBall(), { x: 560, y: 570, w: 90, z: 18 });
        cast.string = k.add(stringLine(), { x: 0, y: 0, w: 1180, h: 820, z: 11 });
        cast.loop = k.add(stringLoop(), { x: 0, y: 0, w: 70, z: 12 });
        k.set(cast.ball, { opacity: 0 });
        k.set(cast.string, { opacity: 0 });
        k.set(cast.loop, { opacity: 0 });
      },
      async play(k) {
        const { mollie, peter, jigs, puff, chair, ball, string: line, loop } = cast;
        // Peter shows Puff his own wobbly tooth.
        await k.all(k.say('peterWobble', peter), k.to(peter, 0.6, { x: '+=60' }));
        await k.to(puff, 0.6, { x: -26, ease: 'sine.inOut' });
        await k.say('tiny', puff);
        await k.to(puff, 0.6, { x: 0 });
        k.pose(puff, 'sad');
        sniff();
        await k.say('scaring', puff);
        await k.say('untilOut', mollie);
        await k.all(k.say('stringIdea', peter), k.hop(peter, 28, 1));

        // Peter's deed: tie one end gently round Puff's tooth.
        k.set(ball, { opacity: 1 });
        k.fx.pop();
        await k.say('tieTooth', peter);
        k.pose(puff, 'default');
        await k.to(peter, 0.7, { x: '+=30' });
        const tooth = toothAt(k, puff);
        setString(line, tooth, middleOf(k, ball), 20);
        k.set(loop, { x: tooth[0] - 35, y: tooth[1] - 14 });
        k.sfx.rustle();
        await k.all(k.fade(line, 1, 0.4), k.appear(loop, 0.4));
        k.flourish(loop);
        await k.wait(500);
        await k.all(k.to(peter, 0.9, { x: '-=30' }));

        // Jigs's deed: carry the other end to the chair's leg and tie it.
        await k.say('tieChair', jigs);
        const leg = legAt(k, chair);
        const a = middleOf(k, ball);
        const follow = k.to(line, 1.4, {
          opacity: 1,
          onUpdate: () => {
            const b = middleOf(k, ball);
            setString(line, toothAt(k, puff), b, Math.max(0, 60 - Math.abs(b[0] - a[0]) * 0.05));
          },
        });
        await k.all(k.carry(ball, leg, 1.4), follow, k.walk(jigs, -90, 1.4, 3));
        setString(line, toothAt(k, puff), leg, 26);
        await k.vanish(ball, 0.3);

        // Jigs climbs aboard; the chair grows its wings.
        k.remove(jigs);
        cast.jigs = await chairRide.seat(k, ride, { id: 'jigs', slot: 'arm', flip: true });
        k.music('magic');
        await chairRide.wings(k, ride);
        await k.wait(300);

        // Puff shuts his eyes, and Mollie holds his claw.
        await k.say('willHurt', puff);
        await k.fade(k.part(puff, 'lids'), 1, 0.3);
        // Peter hops back over Mollie's head as she steps up to Puff.
        k.fx.boing();
        await k.all(
          k.to(mollie, 1.2, { x: '+=300' }),
          k.to(peter, 1.2, { x: '-=210' }),
          k.to(peter, 0.6, { y: '-=110', yoyo: true, repeat: 1, ease: 'sine.out' }),
        );
        await k.all(k.say('notOneBit', mollie), k.hop(mollie, 10, 1));
        k.flourish(mollie);
        await k.wait(500);

        // THE BIG DEED: fly, chair! The string goes tight, and POP.
        k.music('adventure');
        await k.all(k.say('flyChair', cast.jigs), k.to(cast.jigs, 0.4, { x: '+=0' }));
        const keep = { on: true };
        const stretch = (secs: number): Promise<void> =>
          k.to(line, secs, {
            opacity: 1,
            onUpdate: () => {
              if (!keep.on) return;
              const b = legAt(k, chair);
              const t = toothAt(k, puff);
              const dist = Math.hypot(b[0] - t[0], b[1] - t[1]);
              setString(line, t, b, Math.max(0, (760 - dist) * 0.3));
            },
          });
        // first a slow tug that makes the string tight, and Puff leans into it
        twang();
        await k.all(chairRide.fly(k, ride, { x: -110, y: -20, s: 1 }), stretch(1), k.to(puff, 1, { x: -22, rotation: -2, ease: 'sine.in' }));
        // then the zoom
        k.fx.whizz();
        const zoom = k.all(chairRide.fly(k, ride, { x: -900, y: -330, s: 0.9 }), stretch(0.6));
        await k.wait(450);
        keep.on = false;
        const from = toothAt(k, puff);
        toothPop(k);
        void k.to(puff, 0.3, { x: 10, rotation: 1 });
        k.set(k.part(puff, 'tooth'), { opacity: 0 });
        void k.fade(line, 0, 0.3);
        void k.fade(loop, 0, 0.3);
        cast.tooth = k.add(bigTooth(), { x: from[0] - 25, y: from[1] - 40, w: 50, z: 30 });
        await zoom;

        // The tooth spins through the air, and Peter catches it.
        const pb = k.box(peter);
        const catchAt: [number, number] = [pb.x + pb.w / 2, pb.y + pb.h * 0.82];
        void k.to(cast.tooth, 0.5, { x: '-=170', y: '-=190', rotation: 360, ease: 'power1.out' });
        await k.wait(500);
        await k.to(cast.tooth, 0.6, { x: catchAt[0] - from[0], y: catchAt[1] - from[1] + 6, rotation: 720, ease: 'power1.in' });
        k.flourish(cast.tooth);
        k.fx.boing();
        await k.all(k.say('caught', peter), k.hop(peter, 20, 1));

        // Puff opens his eyes: it didn't hurt, and there's a gap.
        k.pose(puff, 'grin');
        k.set(puff, { x: 0, rotation: 0 });
        k.music('triumph');
        void chairRide.fly(k, ride, { x: 0, y: -120, s: 1.8 });
        giggle();
        await k.all(k.say('didntHurt', puff), k.hop(puff, 16, 1));
        const mouth = k.box(puff);
        cast.ring = k.add(smokeRing(), { x: mouth.x + mouth.w * 0.2, y: mouth.y + mouth.h * 0.55, w: 110, z: 28 });
        k.set(cast.ring, { opacity: 0 });
        hiss(0.8);
        void k.to(cast.ring, 0.4, { opacity: 0.95 });
        void k.to(cast.ring, 3, { y: '-=260', x: '-=40', scale: 1.5, ease: 'sine.out' });
        void k.to(cast.ring, 1.2, { opacity: 0, delay: 1.8 });
        await k.wait(900);
        await chairRide.land(k, ride);
        await k.say('supper', puff);
        await k.all(k.say('village', cast.jigs), k.hop(cast.jigs, 16, 1));
        await k.wait(500);
      },
    },

    // ==================================================== 4. Two teeth
    {
      name: 'Two teeth',
      set(k) {
        k.backdrop('wishing-sky');
        k.music('dreamy');
        cast.puff = k.character('puff', { x: 40, y: 500, w: 130, z: 4, pose: 'grin' });
        cast.ring = k.add(smokeRing(), { x: 130, y: 440, w: 100, z: 4 });
        k.set(cast.ring, { opacity: 0 });
        ride = chairRide.set(k, {
          x: 400,
          y: 130,
          w: 380,
          wings: true,
          riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'arm', flip: true }],
        });
        [cast.mollie, cast.peter, cast.jigs] = ride.riders;
        chairRide.jump(k, ride, { x: -900, y: 20 });
      },
      async play(k) {
        // Far below, Puff waves, and a smoke ring floats up after the chair.
        highWind(3);
        void wave(k, cast.puff, 6);
        void k.to(cast.ring, 0.6, { opacity: 0.9, delay: 1 });
        void k.to(cast.ring, 4, { x: '+=420', y: '-=250', scale: 1.5, ease: 'sine.out', delay: 1 });
        void k.to(cast.ring, 1.4, { opacity: 0, delay: 3.2 });
        await k.all(chairRide.fly(k, ride, { x: 0, y: 0, s: 2.8 }), k.wait(1700).then(() => k.say('goodbye', cast.mollie)));
        await chairRide.flap(k, ride, 2);

        // Home, to the evening playroom.
        await k.cut(() => {
          k.backdrop('playroom');
          k.music('cosy');
          k.light(1010, 380, 240, { color: '#fff3c8', strength: 0.3, z: 5 });
          cast.chair = k.prop('wishing-chair', { x: 780, y: 295, w: 380, z: 12 });
          cast.mollie = k.character('mollie', { x: 60, y: 388, w: 230, z: 12 });
          cast.peter = k.character('peter', { x: 280, y: 392, w: 230, z: 13 });
          cast.jigs = k.character('jigs', { x: 700, y: 490, w: 140, z: 14 });
          cast.apple = k.add(apple(), { x: 450, y: 585, w: 64, z: 16 });
          cast.pillow = k.add(pillow(), { x: 520, y: 572, w: 180, z: 17 });
          cast.coinBig = k.add(coin(), { x: 538, y: 566, w: 112, z: 15 });
          cast.coinSmall = k.add(coin(), { x: 640, y: 612, w: 36, z: 15 });
          k.set([cast.pillow, cast.coinBig, cast.coinSmall], { opacity: 0 });
        });
        const { mollie, peter, jigs, chair, apple: fruit, pillow: bed } = cast;
        creak();
        await wishing.wriggle(k, chair, 2);
        await k.all(k.say('homeAgain', peter), k.hop(peter, 20, 1));

        // Peter bites the apple, and his own tooth comes out.
        await k.carry(fruit, peter, 0.9);
        const spot = k.box(fruit);
        k.remove(fruit);
        cast.apple = k.add(appleBitten(), { x: spot.x, y: spot.y, w: spot.w, z: 16 });
        k.fx.pop();
        k.sfx.rustle();
        await k.shake(peter, 4, 2);
        await k.say('crunch', peter);
        const face = k.box(peter).face;
        cast.tiny = k.add(tinyTooth(), { x: face.cx - 10, y: face.cy + 30, w: 24, z: 30 });
        k.fx.boing();
        await k.to(cast.tiny, 0.6, { x: '+=40', y: '+=90', rotation: 200, ease: 'power1.out' });
        k.flourish(cast.tiny);
        await k.vanish(cast.apple, 0.3);
        await k.all(k.shake(mollie, 4, 3), k.shake(jigs, 4, 3), k.wait(900));
        giggle();

        // Mollie's deed: both teeth, one tiny and one enormous, under the pillow.
        await k.all(k.say('twoTeeth', mollie), k.appear(bed, 0.5));
        cast.tooth = k.add(bigTooth(), { x: k.box(mollie).x + 150, y: k.box(mollie).y + 150, w: 70, z: 16 });
        await k.appear(cast.tooth, 0.4);
        await k.carry(cast.tooth, bed, 1);
        await k.carry(cast.tiny, bed, 0.9);
        k.fx.twinkle();
        await k.pop(bed, 1.05);
        await k.wait(600);

        // The night, a soft twinkle, and the morning.
        k.music('dreamy');
        const night = k.dim(0, '#1b2650');
        k.ambient('stars', { count: 18, z: 31 });
        await k.all(k.say('night'), k.to(night, 2.4, { opacity: 0.5 }));
        k.sparkle(595, 560, 14, 120);
        k.fx.twinkle();
        await k.glow('#fff3c8', 0.3, 1.6);
        await k.wait(800);
        k.music('cosy');
        await k.all(k.say('morning'), k.to(night, 2.4, { opacity: 0 }));

        // Mollie lifts the pillow: two gold coins.
        k.fx.creak();
        await k.to(bed, 0.8, { y: '-=70', x: '+=60', rotation: -10, ease: 'sine.inOut' });
        k.set(cast.tooth, { opacity: 0 });
        k.set(cast.tiny, { opacity: 0 });
        k.fx.jingle();
        await k.all(k.appear(cast.coinBig, 0.5), k.appear(cast.coinSmall, 0.5));
        k.flourish(cast.coinBig);
        await k.all(k.say('coins', peter), k.hop(peter, 22, 1));
        await k.all(k.say('wheelbarrow', jigs), k.hop(jigs, 22, 1));
        giggle();
        await warmEnding(k, { cast: [mollie, peter, jigs], end: 'end', music: 'cosy' });
      },
    },
  ],
});
