/**
 * The Doll's House: from the Teddy Bear Treasury (Brown Watson, 1994). The
 * rain spoils the Toymaker's doll's house for the Children's Hospital, so
 * Teddy has an idea: make it a house for the birds, on the ugly old wall
 * the children look at from their balcony.
 *
 *   1. The workshop. Teddy calls in on his friend the Toymaker: a doll's
 *      house for the Children's Hospital, for their party tomorrow. One last
 *      bit of painting. His first turn: he taps the doll's house and the
 *      brush paints the door blue (or the Toymaker paints it). "I'll leave
 *      the window open, so the paint can dry." That night, it rains…
 *   2. The ugly wall. Next day, the hospital garden: Tom and Daisy wave from
 *      the balcony; a doll's house is coming! Matron sighs: if only the
 *      children had something nice to see, instead of this ugly old wall.
 *      Even the birds don't stay: there's nowhere for them to feed. Teddy
 *      wishes he could help. Never mind: wait till the doll's house comes!
 *   3. A dreadful thing. The Toymaker comes hurrying with the house: the
 *      rain came in, the wood swelled, the walls don't fit and the floors
 *      won't go in. Oh dear, and he worked so hard. A quiet beat. Then Teddy
 *      has an idea: hooks on the bottom, take out the back wall, a thicker
 *      roof. "Bring it to the hospital. I'll meet you there!" It's a secret.
 *   4. Nuts and berries. The wood with Daddy. His second turn: he taps the
 *      bush and the berries shake down into the basket (or Daddy shakes it).
 *      Nuts and pips too. Then the kitchen: Mummy gives them stale bread and
 *      an old saucer. "Now, to the hospital!"
 *   5. A home for the birds. The Toymaker is fixing the strange-looking house
 *      onto the wall. "It's not for dolls. It's for the birds!" Teddy puts out
 *      the food. His third turn: he taps the saucer and it fills with water
 *      (or the Toymaker pours it). In fly the birds, in and out of their new
 *      home. Daisy: what a sight from our balcony! Thank you, Toymaker. "And
 *      thank you, Teddy!"
 *
 * The tricky bit is sad, not scary: a spoilt present, and a kind man upset.
 * It turns on Teddy's idea, said plainly. The children are well and happy
 * (it's their party day). No more than four people on stage: Matron is in
 * scene 2 only, so the children say the thank-yous at the end.
 */
import { defineCartoon, noiseBurst, now, svg, tone, type Kit } from '../../kit';
import { ellipse } from '../../art/paper';
import { blot } from '../../art/watercolour';
import { moves as commonMoves, sounds as commonSounds } from '../../worlds/common/moves';
import { moves as bearMoves, sounds as bearSounds } from '../../worlds/bears/moves';
import meta from './meta';

const { giggle, pour, laugh } = commonSounds;
const { wave } = commonMoves;
const { droop, perkUp } = bearMoves;
const { sadSlide, sigh } = bearSounds;

// ------------------------------------------------------------------- art

/** One red berry, falling from the bush. 24 × 24. */
const berry = (n: number): string =>
  svg({ w: 24, h: 24, name: `dolls-house-berry-${n}` }, [blot(ellipse(12, 12, 9, 9), n % 3 === 0 ? '#4a2a4a' : '#c8433a', 0.95)]);

// ---------------------------------------------------------------- sounds

/** A brush going swish across wet paint. */
function swish(): void {
  noiseBurst(now(), { freq: 2500, q: 0.8, peak: 0.05, attack: 0.05, decay: 0.25, sweepTo: 1200 });
}

/** Rain at night against an open window: a soft hiss for `seconds`. */
function rain(seconds = 3): void {
  const t = now();
  noiseBurst(t, { freq: 3500, q: 0.5, peak: 0.03, attack: 0.8, decay: seconds, type: 'highpass' });
  for (let i = 0; i < seconds * 5; i++) noiseBurst(t + Math.random() * seconds, { freq: 5000, q: 3, peak: 0.012, attack: 0.002, decay: 0.03 });
}

/** A little bird: cheep-cheep, two quick high notes. */
function cheep(): void {
  const t = now();
  [0, 0.14].forEach((dt) => tone(2600 + Math.random() * 400, t + dt, { wave: 'sine', peak: 0.04, attack: 0.005, decay: 0.08, glideTo: 3400 }));
}

/** Hurrying footsteps: quick little taps. */
function hurry(steps = 8): void {
  const t = now();
  for (let i = 0; i < steps; i++) noiseBurst(t + i * 0.16, { freq: 700, q: 2, peak: 0.05, attack: 0.003, decay: 0.05 });
}

// ------------------------------------------------------------------ cast

type Who = 'teddy' | 'toymaker' | 'matron' | 'tom' | 'daisy' | 'daddy' | 'mummy' | 'house' | 'brush' | 'rail' | 'bush' | 'basket' | 'saucer' | 'food';
const cast = {} as Record<Who, HTMLElement>;
let birds: HTMLElement[] = [];

/** The balcony railing, and the two children behind it (scenes 2 and 5). */
const RAIL = { x: 640, y: 330, w: 560 };
function balcony(k: Kit): void {
  cast.tom = k.character('tom', { x: 700, y: 185, w: 210, z: 12 });
  cast.daisy = k.character('daisy', { x: 900, y: 185, w: 210, z: 12, flip: true });
  cast.rail = k.prop('hospital-balcony', { ...RAIL, z: 15 });
}

/** The bird house on the hospital wall, and its ledge (stage points). */
const BIRDHOUSE = { x: 220, y: 215, w: 280 };
const LEDGE_Y = BIRDHOUSE.y + 262;

/** Flies a bird from where it is to (x, y), flapping, in `s` seconds. */
async function fly(k: Kit, bird: HTMLElement, x: number, y: number, s = 1.4): Promise<void> {
  const b = k.box(bird);
  const l = k.pivot(k.part(bird, 'wingL'))[0];
  const r = k.pivot(k.part(bird, 'wingR'))[0];
  const flaps = Math.round(s / 0.2);
  void k.to(l, 0.1, { scaleY: 0.3, yoyo: true, repeat: flaps * 2 - 1 });
  void k.to(r, 0.1, { scaleY: 0.3, yoyo: true, repeat: flaps * 2 - 1 });
  await k.to(bird, s, { x: `+=${x - (b.x + b.w / 2)}`, y: `+=${y - (b.y + b.h)}`, ease: 'sine.inOut' });
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. The workshop
    callsIn: { who: 'narrator', text: 'Teddy Bear liked calling in to see his friend, the Toymaker.' },
    niceToSee: { who: 'toymaker', text: 'Nice to see you, Teddy! Come and see what I’m making.' },
    forHospital: { who: 'toymaker', text: 'A doll’s house, for the Children’s Hospital!' },
    wow: { who: 'teddy', text: 'A doll’s house! It’s got windows, and a little front door!' },
    pleased: { who: 'teddy', text: 'The children will be so pleased. Isn’t it their party tomorrow?' },
    lastBit: { who: 'toymaker', text: 'Yes! And there’s just one last bit of painting to do.' },
    askPaint: { who: 'toymaker', text: 'Will you help me, {name}? Tap the doll’s house to paint the door!' },
    nudgePaint: { who: 'toymaker', text: 'Tap the doll’s house, and the brush will paint it blue.' },
    paintMyself: { who: 'toymaker', text: 'I’ll paint it myself, then. Swish, swish!' },
    thanksPaintName: { who: 'toymaker', text: 'Beautiful! Thank you, {name}!' },
    thanksPaint: { who: 'teddy', text: 'Beautiful! What a lovely blue door!' },
    windowOpen: { who: 'toymaker', text: 'I’ll leave the window open tonight, so the paint can dry.' },
    seeYou: { who: 'teddy', text: 'Goodbye, Toymaker! See you tomorrow!' },
    thatNight: { who: 'narrator', text: 'But that night, it began to rain…' },
    // 2. The ugly wall
    nextDay: { who: 'narrator', text: 'Next day, Teddy went past the Children’s Hospital.' },
    ourParty: { who: 'tom', text: 'Hello, Teddy! It’s our party today!' },
    comingToday: { who: 'daisy', text: 'And a doll’s house is coming!' },
    ifOnly: { who: 'matron', text: 'If only the children had something nice to see from their balcony.' },
    uglyWall: { who: 'matron', text: 'Instead of this ugly old wall!' },
    noBirds: { who: 'matron', text: 'Even the birds don’t stay. There’s nowhere for them to feed.' },
    wishHelp: { who: 'teddy', text: 'Oh, I wish I could help.' },
    waitTill: { who: 'teddy', text: 'Never mind! Just wait till the Toymaker brings the doll’s house!' },
    // 3. A dreadful thing
    dreadful: { who: 'toymaker', text: 'Teddy! Oh, Teddy! Such a dreadful thing has happened!' },
    rainCameIn: { who: 'toymaker', text: 'I left my window open, so the paint would dry. And the rain came in!' },
    swelled: { who: 'toymaker', text: 'The wood has swelled up. Now the walls don’t fit!' },
    noFloors: { who: 'toymaker', text: 'And I can’t put the floors in, either.' },
    ohDear: { who: 'teddy', text: 'Oh dear! And you worked so hard!' },
    anIdea: { who: 'narrator', text: 'Then Teddy had an idea!' },
    hooks: { who: 'teddy', text: 'Toymaker, can you fix some hooks to the bottom of the house?' },
    backWall: { who: 'teddy', text: 'And take out the back wall? And make the roof a bit thicker?' },
    yesBut: { who: 'toymaker', text: 'Yes, I can do that. But…' },
    meetThere: { who: 'teddy', text: 'Then bring it to the hospital wall. I’ll meet you there!' },
    secret: { who: 'teddy', text: 'Shh, {name}! It’s a surprise. Now I need some berries!' },
    // 4. Nuts and berries
    whatFor: { who: 'daddy-bear', text: 'Nuts and berries, Teddy? Whatever are they for?' },
    youllSee: { who: 'teddy', text: 'You’ll see, Daddy! Look, that bush is full of berries!' },
    askBush: { who: 'teddy', text: 'Tap the bush, {name}, and shake the berries down!' },
    nudgeBush: { who: 'teddy', text: 'Tap the big bush with the red berries.' },
    shakeIt: { who: 'daddy-bear', text: 'I’ll give it a shake. Here they come!' },
    whatALot: { who: 'daddy-bear', text: 'What a lot! And here are some nuts and pips, too.' },
    homeWeGo: { who: 'teddy', text: 'Now we need some bread, and something for water.' },
    staleBread: { who: 'mummy-bear', text: 'Here’s some stale bread. And you can have this old saucer.' },
    thanksMummy: { who: 'teddy', text: 'Thank you, Mummy! Now, to the hospital!' },
    goodIdea: { who: 'narrator', text: 'It really was a very good idea…' },
    // 5. A home for the birds
    fixing: { who: 'narrator', text: 'Soon, the Toymaker was fixing the strange-looking house onto the wall.' },
    funnyHouse: { who: 'tom', text: 'What a funny-looking house! It hasn’t got a back!' },
    forBirds: { who: 'teddy', text: 'It’s not for dolls. It’s for the birds!' },
    putOut: { who: 'teddy', text: 'Berries and nuts, and pips, and bread.' },
    askSaucer: { who: 'teddy', text: 'And water to drink. Tap the saucer, {name}, to fill it up!' },
    nudgeSaucer: { who: 'teddy', text: 'Tap the little saucer on the shelf.' },
    pourIt: { who: 'toymaker', text: 'I’ll pour the water in. There!' },
    thanksSaucerName: { who: 'teddy', text: 'Thank you, {name}! Look, here come the birds!' },
    thanksSaucer: { who: 'teddy', text: 'Thank you, Toymaker! Look, here come the birds!' },
    inAndOut: { who: 'daisy', text: 'Birds! Flying in and out of their new home!' },
    whatASight: { who: 'tom', text: 'What a sight to see from our balcony! Thank you, Toymaker!' },
    thankYouTeddy: { who: 'toymaker', text: 'And thank you, Teddy! It was all your idea.' },
    end: { who: 'narrator', text: 'And every day after that, the children watched the birds from their balcony.' },
  },
  scenes: [
    // ==================================================== 1. The workshop
    {
      name: 'The workshop',
      set(k) {
        k.backdrop('toy-workshop');
        k.music('cosy');
        cast.house = k.prop('dolls-house', { x: 330, y: 172, w: 260, z: 8 });
        cast.toymaker = k.character('toymaker', { x: 720, y: 297, w: 320, flip: true, z: 10 });
        cast.teddy = k.character('teddy', { x: 80, y: 414, w: 210, z: 12 });
        k.set(cast.teddy, { x: -400 });
        cast.brush = k.prop('paintbrush', { x: 640, y: 240, w: 50, z: 14 });
        k.set(cast.brush, { opacity: 0 });
      },
      async play(k) {
        const { teddy, toymaker, house, brush } = cast;
        k.fx.patter(5, 0.18);
        await k.all(k.to(teddy, 1.4, { x: 0, ease: 'power2.out' }), k.wait(200).then(() => k.say('callsIn')));
        await k.all(k.say('niceToSee', toymaker), k.wait(400).then(() => wave(k, toymaker, 2)));
        k.fx.twinkle();
        k.sparkle(460, 300, 10, 160);
        await k.say('forHospital', toymaker);
        k.pose(teddy, 'happy');
        await k.all(k.say('wow', teddy), k.hop(teddy, 30));
        k.pose(teddy, 'default');
        await k.say('pleased', teddy);
        k.pose(toymaker, 'paint');
        await k.say('lastBit', toymaker);

        // His turn: paint the door.
        const how = await k.tapToHelp(house, { ask: 'askPaint', nudge: 'nudgePaint', helped: 'paintMyself', by: toymaker, size: 240 });
        await k.fade(brush, 1, 0.3);
        await k.to(brush, 0.6, { x: -180, y: 130, ease: 'power2.inOut' });
        for (let i = 0; i < 3; i++) {
          swish();
          await k.to(brush, 0.22, { x: '-=30', rotation: -10 });
          await k.to(brush, 0.22, { x: '+=30', rotation: 0 });
        }
        await k.fade(k.part(house, 'fresh'), 1, 0.6);
        k.sparkle(460, 400, 10, 120);
        await k.all(k.to(brush, 0.5, { x: 0, y: 0 }), k.fade(brush, 0, 0.5));
        k.pose(toymaker, 'default');
        await k.say(how === 'tapped' ? 'thanksPaintName' : 'thanksPaint', how === 'tapped' ? toymaker : teddy);
        await k.say('windowOpen', toymaker);
        k.face(teddy, true);
        await k.all(k.say('seeYou', teddy), wave(k, teddy, 2));

        // Off he goes, and the Toymaker too. Night falls, and the rain comes.
        k.fx.patter(5, 0.18);
        await k.all(k.exit(teddy, 'left', 1), k.wait(300).then(() => k.exit(toymaker, 'right', 1.2)));
        const night = k.dim(0.5, '#101a3a');
        k.set(night, { opacity: 0 });
        k.music('dreamy');
        await k.fade(night, 0.5, 1.5);
        k.ambient('rain', { count: 30, z: 2, area: [760, 130, 280, 230] });
        rain(5);
        await k.say('thatNight');
        k.fx.rumble(2);
        await k.wait(1500);
      },
    },

    // ==================================================== 2. The ugly wall
    {
      name: 'The ugly wall',
      set(k) {
        k.backdrop('hospital-garden');
        k.music('cosy');
        balcony(k);
        cast.matron = k.character('matron', { x: 330, y: 300, w: 300, z: 11 });
        cast.teddy = k.character('teddy', { x: 60, y: 414, w: 210, z: 12 });
        k.set(cast.teddy, { x: -400 });
      },
      async play(k) {
        const { teddy, matron, tom, daisy } = cast;
        k.fx.patter(5, 0.18);
        await k.all(k.to(teddy, 1.4, { x: 0, ease: 'power2.out' }), k.wait(200).then(() => k.say('nextDay')));
        k.face(teddy, true);
        await k.all(k.say('ourParty', tom), k.wait(300).then(() => k.pose(tom, 'wave')));
        k.pose(tom, 'default');
        k.pose(daisy, 'wave');
        await k.say('comingToday', daisy);
        k.pose(daisy, 'default');
        k.face(teddy, false);
        sigh();
        await k.say('ifOnly', matron);
        k.pose(matron, 'point');
        await k.say('uglyWall', matron);
        k.pose(matron, 'default');
        await k.say('noBirds', matron);
        await k.all(k.say('wishHelp', teddy), droop(k, teddy));
        await k.wait(400);
        await perkUp(k, teddy);
        k.pose(teddy, 'happy');
        await k.say('waitTill', teddy);
        k.pose(teddy, 'default');
        // Hurrying footsteps, off to the left.
        hurry(8);
        k.face(teddy, true);
        await k.wait(1400);
      },
    },

    // ==================================================== 3. A dreadful thing
    {
      name: 'A dreadful thing',
      set(k) {
        k.backdrop('hospital-garden');
        k.music('dreamy');
        k.prop('hospital-balcony', { ...RAIL, z: 15 });
        cast.teddy = k.character('teddy', { x: 420, y: 414, w: 210, flip: true, z: 12 });
        cast.toymaker = k.character('toymaker', { x: 60, y: 297, w: 320, pose: 'upset', z: 10 });
        cast.house = k.prop('dolls-house-warped', { x: 120, y: 478, w: 170, z: 13 });
        k.set([cast.toymaker, cast.house], { x: -500 });
      },
      async play(k) {
        const { teddy, toymaker, house } = cast;
        hurry(10);
        await k.all(k.to(toymaker, 1.4, { x: 0, ease: 'power2.out' }), k.to(house, 1.4, { x: 0, ease: 'power2.out' }));
        await k.say('dreadful', toymaker);
        k.face(teddy, true);
        await k.say('rainCameIn', toymaker);
        // He puts the poor house down beside him: everything crooked.
        await k.to(house, 0.6, { x: 190, ease: 'power2.inOut' });
        k.fx.thud();
        sadSlide();
        await k.say('swelled', toymaker);
        await k.all(k.say('noFloors', toymaker), k.shake(house, 4, 2));
        k.pose(teddy, 'sad');
        await k.say('ohDear', teddy);
        await k.wait(1000);

        // A quiet beat… and then an idea.
        k.pose(teddy, 'default');
        k.fx.twinkle();
        k.sparkle(525, 380, 14, 140);
        await k.all(k.say('anIdea'), k.hop(teddy, 40));
        k.music('adventure');
        await k.say('hooks', teddy);
        await k.say('backWall', teddy);
        k.pose(toymaker, 'default');
        await k.say('yesBut', toymaker);
        k.pose(teddy, 'happy');
        await k.say('meetThere', teddy);
        k.pose(teddy, 'default');
        k.face(teddy, false);
        giggle();
        await k.say('secret', teddy);
        k.fx.patter(6, 0.14);
        await k.exit(teddy, 'right', 0.9);
      },
    },

    // ==================================================== 4. Nuts and berries
    {
      name: 'Nuts and berries',
      set(k) {
        k.backdrop('bear-wood');
        k.music('adventure');
        cast.bush = k.prop('bush', { x: 600, y: 430, w: 380, z: 9 });
        cast.daddy = k.character('daddy-bear', { x: 120, y: 330, w: 290, z: 11 });
        cast.teddy = k.character('teddy', { x: 400, y: 414, w: 210, flip: true, z: 12 });
        cast.basket = k.prop('berry-basket', { x: 410, y: 545, w: 150, z: 14 });
      },
      async play(k) {
        const { teddy, daddy, bush, basket } = cast;
        await k.wait(300);
        await k.say('whatFor', daddy);
        k.face(teddy, false);
        await k.say('youllSee', teddy);

        // His turn: shake the berries down.
        const how = await k.tapToHelp(bush, { ask: 'askBush', nudge: 'nudgeBush', helped: 'shakeIt', by: teddy, helper: daddy, size: 260 });
        const [leaves] = k.pivot(k.part(bush, 'leaves'));
        k.sfx.rustle();
        void k.to(leaves, 0.12, { rotation: 4, yoyo: true, repeat: 7 });
        const drops = [0, 1, 2, 3, 4, 5].map((n) => k.add(berry(n), { x: 680 + n * 40, y: 480 + (n % 2) * 30, w: 24, h: 24, z: 15 }));
        await k.all(
          ...drops.map((d, i) =>
            k.wait(i * 120).then(() => k.to(d, 0.7, { x: 485 - (680 + i * 40) + (i % 3) * 20, y: 575 - (480 + (i % 2) * 30), ease: 'power2.in' })),
          ),
        );
        k.fx.pop();
        drops.forEach((d) => k.remove(d));
        await k.fade(k.part(basket, 'berries'), 1, 0.4);
        k.sparkle(485, 560, 10, 100);
        void how;
        await k.say('whatALot', daddy);
        k.face(teddy, true);
        await k.say('homeWeGo', teddy);

        // Home to Mummy, for bread and a saucer.
        await k.cut(() => {
          k.backdrop('bear-kitchen');
          cast.mummy = k.character('mummy-bear', { x: 330, y: 357, w: 260, pose: 'hold', z: 11 });
          cast.saucer = k.prop('saucer', { x: 405, y: 520, w: 110, z: 14 });
          cast.teddy = k.character('teddy', { x: 650, y: 414, w: 210, flip: true, z: 12 });
          cast.basket = k.prop('berry-basket', { x: 790, y: 545, w: 150, z: 14 });
          k.set(k.part(cast.basket, 'berries'), { opacity: 1 });
        });
        const { mummy } = cast;
        await k.say('staleBread', mummy);
        k.pose(cast.teddy, 'happy');
        await k.all(k.say('thanksMummy', cast.teddy), k.hop(cast.teddy, 30));
        k.pose(cast.teddy, 'default');
        await k.say('goodIdea');
      },
    },

    // ==================================================== 5. A home for the birds
    {
      name: 'A home for the birds',
      set(k) {
        k.backdrop('hospital-garden');
        k.music('cosy');
        balcony(k);
        cast.house = k.prop('bird-house', { ...BIRDHOUSE, z: 6 });
        cast.food = k.prop('bird-food', { x: BIRDHOUSE.x + 40, y: LEDGE_Y - 48, w: 120, z: 7 });
        cast.saucer = k.prop('saucer', { x: BIRDHOUSE.x + 170, y: LEDGE_Y - 39, w: 90, z: 7 });
        k.set([cast.food, cast.saucer], { opacity: 0 });
        cast.toymaker = k.character('toymaker', { x: -60, y: 297, w: 300, z: 10 });
        cast.teddy = k.character('teddy', { x: 480, y: 414, w: 210, flip: true, z: 12 });
        birds = [0, 1, 2, 3].map((i) => k.prop('songbird', { x: 1180 + i * 90, y: 60 + i * 50, w: 60, z: 20 }));
        birds.forEach((b) => k.face(b, true));
      },
      async play(k) {
        const { teddy, toymaker, tom, daisy, house, food, saucer } = cast;
        // Tap, tap: the house goes up on the wall.
        for (let i = 0; i < 3; i++) {
          k.fx.knock(1);
          await k.wait(350);
        }
        await k.say('fixing');
        await k.say('funnyHouse', tom);
        laugh();
        k.pose(teddy, 'happy');
        await k.say('forBirds', teddy);
        k.pose(teddy, 'default');
        // Teddy puts out the food along the ledge.
        k.face(teddy, true);
        k.fx.pop();
        await k.all(k.fade(food, 1, 0.6), k.fade(saucer, 1, 0.6));
        await k.say('putOut', teddy);

        // His turn: fill the saucer.
        const how = await k.tapToHelp(saucer, { ask: 'askSaucer', nudge: 'nudgeSaucer', helped: 'pourIt', by: teddy, helper: toymaker, size: 130 });
        pour();
        await k.fade(k.part(saucer, 'water'), 1, 0.8);
        k.sparkle(BIRDHOUSE.x + 215, LEDGE_Y - 20, 8, 80);
        await k.say(how === 'tapped' ? 'thanksSaucerName' : 'thanksSaucer', teddy);

        // In fly the birds: to the ledge, in at the windows, out again.
        k.music('triumph');
        const perches: [number, number][] = [
          // feet on the ledge either side of the food, then on the twig perches under the middle holes
          [BIRDHOUSE.x + 55, LEDGE_Y],
          [BIRDHOUSE.x + 238, LEDGE_Y],
          [BIRDHOUSE.x + 90, BIRDHOUSE.y + 205],
          [BIRDHOUSE.x + 190, BIRDHOUSE.y + 205],
        ];
        for (let i = 0; i < birds.length; i++) {
          cheep();
          void fly(k, birds[i], perches[i][0], perches[i][1], 1.6);
          await k.wait(450);
        }
        await k.wait(1300);
        await k.say('inAndOut', daisy);
        cheep();
        // One flies over to say hello on the balcony rail.
        void fly(k, birds[3], 1080, 336, 1.6);
        k.pose(tom, 'wave');
        await k.say('whatASight', tom);
        k.pose(tom, 'default');
        cheep();
        void fly(k, birds[3], perches[3][0], perches[3][1], 1.6);
        await k.say('thankYouTeddy', toymaker);
        void house;
        k.sparkle(590, 300, 18, 320);
        k.fx.twinkle();
        await k.all(k.say('end'), k.wait(300).then(() => wave(k, daisy, 2)));
        await k.wait(1200);
      },
    },
  ],
});
