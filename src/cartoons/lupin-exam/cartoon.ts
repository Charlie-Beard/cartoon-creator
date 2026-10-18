/**
 * Lupin's Obstacle Course: an exam from the third Harry Potter book that
 * the film leaves out. Professor Lupin's end-of-year test is outside in the
 * summer sun: wade through a pool with a Grindylow in it, cross a field of
 * potholes full of Red Caps, and squelch through a marsh where a Hinkypunk
 * swings its lantern to lead you the wrong way. Neville is sure he'll fail.
 *
 *   1. The exam. A sunny day on the grounds. Professor Lupin explains the
 *      course, and there's chocolate at the end. Hermione has done it
 *      already (twice). Neville is worried: he's rubbish at exams. Harry and
 *      Ron will go round with him, and he has to do the tricky bits himself.
 *   2. The Grindylow pool. Wading through the green water, a little horned
 *      Grindylow pops up and grabs Neville's sleeve with its long knobbly
 *      fingers. Grindylows are very ticklish! His first turn: he tickles
 *      it. It giggles, lets go and sinks with a
 *      bubble.
 *   3. The Red Caps. Potholes in the grass, and out of them pop little Red
 *      Caps, blowing raspberries and tugging at shoelaces. Red Caps can't
 *      bear being laughed at. Ron laughs his biggest laugh and one ducks
 *      away; the last one won't go. His second turn: he taps it, everybody
 *      laughs, and down it goes. Neville is laughing too.
 *   4. The Hinkypunk's marsh. Misty reeds and bog. A wispy one-legged
 *      Hinkypunk swings its lantern: "This way, ooh!" Neville nearly
 *      follows it into the bog. Never follow the light: stay on the
 *      stones! His third turn: he taps the next stepping stone, and they
 *      hop safely across. The Hinkypunk sulks and fades away.
 *   5. Full marks. Back on the sunny grass, Professor Lupin is waiting with
 *      chocolate. Full marks, all of them, and Neville most of all.
 *
 * There's no villain: the creatures are cheeky, not nasty. Professor Lupin
 * is at the start and the finish; in the pool Harry remembers what he said. The Grindylow
 * grabs a sleeve and lets go laughing, the Red Caps only blow raspberries
 * and tug laces (the book's Red Caps "bludgeon"; these carry nothing), and
 * the Hinkypunk only beckons. The book's last obstacle, the Boggart in a
 * trunk, is left out. The pool is only for wading.
 */
import { C, NOTE, cached, defineCartoon, ellipse, noiseBurst, now, piece, rect, svg, tone, type Kit } from '../../kit';
import { sounds as commonSounds } from '../../worlds/common/moves';
import { warmEnding } from '../../worlds/common/pieces';
import meta from './meta';

const { giggle, laugh } = commonSounds;

// ------------------------------------------------------------------- art

/** A bar of chocolate in gold foil (90 × 50), half unwrapped: Professor Lupin's answer to everything. */
const chocolate = cached(() =>
  svg({ w: 90, h: 50, name: 'lupin-chocolate', label: 'Chocolate' }, [
    piece(rect(4, 8, 82, 36, 4), '#6b3f25', { edge: 'cut' }),
    ...[22, 44].map((x) => piece(rect(x, 10, 2, 32), '#4f2c19', { edge: 'clean', shadow: false })),
    piece(rect(44, 6, 44, 40, 3), C.gold, { edge: 'cut' }),
  ]),
);

/** One big flat stepping stone (130 × 56), paler than the rest with a soft gold edge: the next safe step. */
const bigStone = cached(() =>
  svg({ w: 130, h: 56, name: 'lupin-big-stone', label: 'A big flat stone' }, [
    piece(ellipse(65, 30, 62, 24), '#f3e2a0', { edge: 'clean', shadow: false, opacity: 0.6 }),
    piece(ellipse(65, 28, 54, 19), '#d9d6cc'),
    piece(ellipse(56, 24, 30, 8), '#efece4', { edge: 'clean', shadow: false }),
  ]),
);

// ---------------------------------------------------------------- sounds

/** Wading: a few soft sloshes. */
function slosh(times = 3): void {
  const t = now();
  for (let i = 0; i < times; i++) noiseBurst(t + i * 0.35, { freq: 700, q: 1.2, peak: 0.04, attack: 0.04, decay: 0.25 });
}

/** Bubbles rising, and a little gurgle. */
function gurgle(): void {
  const t = now();
  [0, 0.12, 0.22, 0.36].forEach((d, i) => tone([300, 420, 360, 520][i], t + d, { wave: 'sine', peak: 0.05, attack: 0.01, decay: 0.1, glideTo: 700 }));
}

/** The Grindylow giggling: quick high bubbling notes. */
function grindyGiggle(): void {
  const t = now();
  for (let i = 0; i < 7; i++) tone(NOTE.E5 + (i % 2) * 140, t + i * 0.08, { wave: 'triangle', peak: 0.05, attack: 0.01, decay: 0.07, vibrato: [20, 30] });
}

/** A Red Cap's raspberry: a rude, buzzy "pthbbb". */
function raspberry(): void {
  const t = now();
  tone(140, t, { wave: 'sawtooth', peak: 0.06, attack: 0.02, decay: 0.6, lowpass: 900, vibrato: [40, 30] });
  noiseBurst(t, { freq: 500, q: 1, peak: 0.04, attack: 0.02, decay: 0.5 });
}

/** Something popping up out of a hole. */
function popUp(): void {
  const t = now();
  tone(NOTE.C5, t, { wave: 'sine', peak: 0.06, attack: 0.01, decay: 0.15, glideTo: NOTE.C6 });
}

/** A squelchy step in the marsh. */
function squelch(): void {
  const t = now();
  noiseBurst(t, { freq: 420, q: 2, peak: 0.05, attack: 0.02, decay: 0.2 });
  tone(180, t, { wave: 'sine', peak: 0.03, attack: 0.02, decay: 0.15, glideTo: 120 });
}

/** The Hinkypunk's whispery "oooh". */
function ooh(): void {
  const t = now();
  tone(NOTE.G4, t, { wave: 'sine', peak: 0.04, attack: 0.3, decay: 1.2, glideTo: NOTE.E4, vibrato: [5, 10] });
  noiseBurst(t, { freq: 2500, q: 2, peak: 0.012, attack: 0.3, decay: 1.2 });
}

// ------------------------------------------------------------------ cast

type Actor = 'harry' | 'ron' | 'neville' | 'lupin' | 'grindylow' | 'redCap' | 'hinkypunk' | 'poolBack' | 'poolFront';
const cast = {} as Record<Actor, HTMLElement>;

/** The pool, back and front halves (700 × 220) at x 240, y 470; the water line is at y 598. */
const POOL = { x: 240, y: 470, w: 700 };
/** Three potholes (220 × 110) on the grass; a Red Cap pops up between the back and the front of one. */
const HOLES = [250, 560, 870];
const HOLE_Y = 560;

/** The Red Cap pops up out of hole `i` (and blows a raspberry), or ducks back down. */
async function capUp<K extends string>(k: Kit<K>, cap: HTMLElement, i: number): Promise<void> {
  k.set(cap, { x: HOLES[i] - HOLES[0], y: 0, opacity: 1 });
  popUp();
  await k.to(cap, 0.4, { y: -170, ease: 'back.out(1.6)' });
  raspberry();
  k.set([...k.part(cap, 'mouthOpen'), ...k.part(cap, 'tongue')], { opacity: 1 });
  await k.wait(700);
  k.set([...k.part(cap, 'mouthOpen'), ...k.part(cap, 'tongue')], { opacity: 0 });
}
async function capDown<K extends string>(k: Kit<K>, cap: HTMLElement): Promise<void> {
  k.fx.whizz();
  await k.to(cap, 0.3, { y: 0, ease: 'power2.in' });
  k.set(cap, { opacity: 0 });
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. The exam
    sunny: { who: 'narrator', text: 'It was the last week of term, and the sun was shining on Hogwarts.' },
    welcome: { who: 'lupin', text: 'Welcome to your exam! It’s an obstacle course, full of magical creatures.' },
    course: { who: 'lupin', text: 'A pool, some potholes, and a marsh. And chocolate at the end.' },
    tips: { who: 'lupin', text: 'Three tips. Grindylows are ticklish. Red Caps hate being laughed at.' },
    tip3: { who: 'lupin', text: 'And never, ever follow a Hinkypunk’s light.' },
    hermioneTwice: { who: 'ron', text: 'Hermione’s done it already. Twice!' },
    worried: { who: 'neville', text: 'I’ll never remember all that. I’m rubbish at exams.' },
    withYou: { who: 'harry', text: 'We’ll go round with you, Neville. And {name} can help too!' },
    yourself: { who: 'lupin', text: 'Good. But Neville must do the tricky bits himself. Off you go!' },
    // 2. The Grindylow pool
    wading: { who: 'narrator', text: 'First, they waded into a big green pool.' },
    cold: { who: 'ron', text: 'Ooh! It’s cold!' },
    grabbed: { who: 'neville', text: 'Help! Something’s got my sleeve!' },
    wontLetGo: { who: 'neville', text: 'It won’t let go!' },
    grindylow: { who: 'harry', text: 'A Grindylow! Professor Lupin said they’re very ticklish!' },
    askFingers: { who: 'neville', text: '{name}, will you tickle the Grindylow with me? Tap it!' },
    nudgeFingers: { who: 'neville', text: 'Tap the little green Grindylow.' },
    helpedFingers: { who: 'neville', text: 'Tickle, tickle!' },
    letGo: { who: 'harry', text: 'It’s giggling! It let go!' },
    byeBye: { who: 'ron', text: 'Bye bye, giggly Grindylow!' },
    didIt: { who: 'neville', text: 'And I did it! Well, we did it.' },
    // 3. The Red Caps
    potholes: { who: 'narrator', text: 'Next came a field full of potholes.' },
    watchOut: { who: 'harry', text: 'Watch where you step. There are holes everywhere!' },
    whatsThat: { who: 'ron', text: 'Did that hole just blow a raspberry at me?' },
    redCap: { who: 'harry', text: 'It’s a Red Cap! It’s trying to pull your shoelaces, Ron!' },
    laughedAt: { who: 'neville', text: 'I know this one! Red Caps can’t bear being laughed at.' },
    ronLaughs: { who: 'ron', text: 'Ha! Ha ha ha! What a silly hat!' },
    another: { who: 'neville', text: 'There’s another one! It won’t go away.' },
    askCap: { who: 'harry', text: '{name}, tap the Red Cap, and we’ll all laugh together!' },
    nudgeCap: { who: 'harry', text: 'Tap the little Red Cap.' },
    helpedCap: { who: 'harry', text: 'Everybody laugh. One, two, three!' },
    allLaugh: { who: 'narrator', text: 'Everybody laughed, and the Red Cap ducked back into its hole.' },
    nevilleLaughing: { who: 'neville', text: 'I can’t stop laughing!' },
    // 4. The Hinkypunk's marsh
    marsh: { who: 'narrator', text: 'Last of all, they came to a misty marsh.' },
    squelchy: { who: 'ron', text: 'Yuck. It’s all squelchy. And misty.' },
    thisWay: { who: 'narrator', text: 'A wispy creature hopped on one leg and swung its lantern. It waved them towards the bog.' },
    followIt: { who: 'neville', text: 'Ooh, a light. Shall we go that way?' },
    noFollow: { who: 'harry', text: 'No, Neville! That’s a Hinkypunk. It wants you to fall in the bog!' },
    stones: { who: 'harry', text: 'Never follow the light. Stay on the stepping stones.' },
    askStone: { who: 'harry', text: '{name}, which way is safe? Tap the big stepping stone!' },
    nudgeStone: { who: 'harry', text: 'Tap the big pale stone by Ron.' },
    helpedStone: { who: 'neville', text: 'The stones! I remember. This way.' },
    sulk: { who: 'ron', text: 'Ha! Look, the Hinkypunk is sulking.' },
    across: { who: 'neville', text: 'We’re across! And I didn’t fall in the bog!' },
    // 5. Full marks
    finish: { who: 'narrator', text: 'Professor Lupin was waiting at the finish.' },
    wellDone: { who: 'lupin', text: 'Well done, all of you! Have some chocolate.' },
    neville: { who: 'neville', text: 'Did I pass, Professor?' },
    fullMarks: { who: 'lupin', text: 'Full marks, Neville. You were very brave.' },
    remembered: { who: 'lupin', text: 'And you remembered all three tips.' },
    whoopee: { who: 'neville', text: 'Full marks! Me! Wait till I tell my gran!' },
    goodFriends: { who: 'lupin', text: 'And Harry, Ron, you were very good friends.' },
    more: { who: 'ron', text: 'Thanks, Professor. Er… is there any more chocolate?' },
    thanksName: { who: 'neville', text: 'Thank you, Harry and Ron. And thank you, {name}!' },
    end: { who: 'narrator', text: 'And they sat in the sunshine and ate chocolate, until it was all gone.' },
  },
  scenes: [
    // ==================================================== 1. The exam
    {
      name: 'The exam',
      set(k) {
        k.backdrop('sunny-grounds');
        k.music('cosy');
        cast.harry = k.character('harry', { x: 180, y: 430, w: 210 });
        cast.ron = k.character('ron', { x: 370, y: 430, w: 210 });
        cast.neville = k.character('neville', { x: 560, y: 430, w: 210 });
        cast.lupin = k.character('lupin', { x: 820, y: 380, w: 250, flip: true });
      },
      async play(k) {
        const { harry, ron, neville, lupin } = cast;
        await k.wait(300);
        await k.say('sunny');
        await k.say('welcome', lupin);
        await k.say('course', lupin);
        await k.say('tips', lupin);
        await k.say('tip3', lupin);
        await k.all(k.say('hermioneTwice', ron), k.shake(ron, 3, 2));
        k.music('dreamy');
        await k.all(k.say('worried', neville), k.to(neville, 0.5, { y: 12, ease: 'sine.out' }));
        await k.say('withYou', harry);
        await k.to(neville, 0.4, { y: 0 });
        k.music('adventure');
        await k.say('yourself', lupin);
        await k.all(...[harry, ron, neville].map((el, i) => k.wait(i * 150).then(() => k.hop(el, 24))));
        await k.wait(300);
      },
    },

    // ==================================================== 2. The Grindylow pool
    {
      name: 'The Grindylow pool',
      set(k) {
        k.backdrop('sunny-grounds');
        k.music('adventure');
        cast.poolBack = k.prop('poolBack', { ...POOL, z: 3 });
        cast.harry = k.character('harry', { x: 250, y: 413, w: 190, z: 8 });
        cast.neville = k.character('neville', { x: 420, y: 413, w: 190, z: 8 });
        cast.ron = k.character('ron', { x: 770, y: 413, w: 190, z: 8 });
        // The Grindylow pops up between Neville and Ron, reaching for Neville's sleeve.
        cast.grindylow = k.character('grindylow', { x: 585, y: 385, w: 170, flip: true, z: 10 });
        k.set(cast.grindylow, { y: 260, opacity: 0 });
        cast.poolFront = k.prop('poolFront', { ...POOL, z: 12 });
      },
      async play(k) {
        const { harry, neville, ron, grindylow } = cast;
        slosh(4);
        await k.say('wading');
        await k.all(k.say('cold', ron), k.shake(ron, 3, 2));

        // Bubbles… and up pops a Grindylow, holding Neville's sleeve.
        gurgle();
        k.sparkle(735, 590, 6, 60);
        await k.wait(700);
        k.fx.splash();
        await k.to(grindylow, 0.7, { y: 0, opacity: 1, ease: 'back.out(1.4)' });
        await k.all(k.say('grabbed', neville), k.shake(neville, 5, 3));
        await k.all(k.say('wontLetGo', neville), k.shake(neville, 4, 2));
        await k.say('grindylow', harry);

        // His first turn: tickle the Grindylow.
        await k.tapToHelp(grindylow, { ask: 'askFingers', nudge: 'nudgeFingers', helped: 'helpedFingers', by: neville, size: 170 });
        grindyGiggle();
        k.pose(grindylow, 'giggling');
        await k.shake(grindylow, 4, 3);
        await k.say('letGo', harry);
        gurgle();
        k.fx.splash();
        await k.to(grindylow, 0.7, { y: 260, opacity: 0, ease: 'power2.in' });
        await k.say('byeBye', ron);
        k.music('triumph');
        await k.all(k.say('didIt', neville), k.hop(neville, 24));
        await k.wait(300);
      },
    },

    // ==================================================== 3. The Red Caps
    {
      name: 'The Red Caps',
      set(k) {
        k.backdrop('sunny-grounds');
        k.music('sneaky');
        HOLES.forEach((x) => k.prop('potholeBack', { x, y: HOLE_Y, w: 220, z: 3 }));
        cast.redCap = k.character('redCap', { x: HOLES[0] + 35, y: HOLE_Y + 85, w: 150, z: 4 });
        k.set(cast.redCap, { opacity: 0 });
        HOLES.forEach((x) => k.prop('potholeFront', { x, y: HOLE_Y, w: 220, z: 5 }));
        cast.harry = k.character('harry', { x: 60, y: 330, w: 190, z: 8 });
        cast.ron = k.character('ron', { x: 420, y: 330, w: 190, z: 8 });
        cast.neville = k.character('neville', { x: 760, y: 330, w: 190, z: 8 });
      },
      async play(k) {
        const { harry, ron, neville, redCap } = cast;
        await k.say('potholes');
        await k.say('watchOut', harry);
        // Pthbbb! Out of the middle hole.
        await capUp(k, redCap, 1);
        await k.say('whatsThat', ron);
        await k.to(k.pivot(k.part(redCap, 'armR')), 0.2, { rotation: 20, yoyo: true, repeat: 3 });
        await k.say('redCap', harry);
        await k.say('laughedAt', neville);

        // Ron laughs his biggest laugh, and it ducks away.
        laugh();
        await k.all(k.say('ronLaughs', ron), k.hop(ron, 20, 2));
        await capDown(k, redCap);
        await k.wait(500);
        // But it pops up again, by Neville.
        await capUp(k, redCap, 2);
        await k.all(k.say('another', neville), k.shake(neville, 4, 2));

        // His second turn: tap the Red Cap, and everybody laughs.
        await k.tapToHelp(redCap, { ask: 'askCap', nudge: 'nudgeCap', helped: 'helpedCap', by: harry, size: 150 });
        laugh();
        await k.all(...[harry, ron, neville].map((el, i) => k.wait(i * 120).then(() => k.hop(el, 20, 2))));
        await capDown(k, redCap);
        await k.say('allLaugh');
        giggle();
        k.music('cosy');
        await k.all(k.say('nevilleLaughing', neville), k.shake(neville, 3, 3));
        await k.wait(300);
      },
    },

    // ==================================================== 4. The Hinkypunk's marsh
    {
      name: 'The Hinkypunk’s marsh',
      set(k) {
        k.backdrop('marsh');
        k.music('spooky');
        k.ambient('dust', { count: 10, area: [0, 380, 1180, 300] });
        // On the stepping-stone path, which runs from the front left up to the back right.
        cast.harry = k.character('harry', { x: 10, y: 476, w: 160, z: 8 });
        cast.neville = k.character('neville', { x: 190, y: 462, w: 160, z: 8 });
        cast.ron = k.character('ron', { x: 370, y: 446, w: 160, z: 7 });
        cast.hinkypunk = k.character('hinkypunk', { x: 860, y: 430, w: 190, z: 9 });
        k.set(cast.hinkypunk, { opacity: 0 });
      },
      async play(k) {
        const { harry, neville, ron, hinkypunk } = cast;
        squelch();
        await k.say('marsh');
        squelch();
        await k.say('squelchy', ron);

        // A wisp of smoke and a swinging lantern, out in the bog.
        ooh();
        await k.fade(hinkypunk, 0.85, 1.2);
        const lantern = k.pivot(k.part(hinkypunk, 'lantern'));
        void k.to(lantern, 0.8, { rotation: 10, yoyo: true, repeat: 5, ease: 'sine.inOut' });
        await k.say('thisWay');
        k.music('sneaky');
        await k.say('followIt', neville);
        await k.to(neville, 0.6, { x: 60, y: 20, ease: 'power1.inOut' });
        await k.all(k.say('noFollow', harry), k.shake(harry, 4, 2));
        await k.to(neville, 0.5, { x: 0, y: 0 });
        await k.say('stones', harry);

        // His third turn: tap the next stepping stone on the path (the big pale one, by Ron).
        k.fx.twinkle();
        const stone = k.add(bigStone(), { x: 555, y: 568, w: 130, z: 6 });
        k.set(stone, { opacity: 0 });
        await k.fade(stone, 1, 0.5);
        const how = await k.tapToHelp(stone, { ask: 'askStone', nudge: 'nudgeStone', helped: 'helpedStone', by: harry, helper: neville, size: 120 });
        k.fx.twinkle();
        k.sparkle(620, 596, 8, 80);
        // Hop, hop, hop, along the stones.
        for (const el of [ron, neville, harry]) {
          squelch();
          void k.to(el, 1.2, { x: '+=280', y: '-=70', scale: 0.88, ease: 'power1.inOut' });
          await k.hop(el, 18, 2);
        }
        if (how === 'tapped') k.sparkle(760, 572, 6, 60);
        // The Hinkypunk sulks, and fades into the mist.
        ooh();
        await k.to(k.part(hinkypunk, 'glow'), 0.8, { opacity: 0 });
        await k.say('sulk', ron);
        await k.fade(hinkypunk, 0, 1);
        k.music('triumph');
        await k.all(k.say('across', neville), k.hop(neville, 20));
        await k.wait(300);
      },
    },

    // ==================================================== 5. Full marks
    {
      name: 'Full marks',
      set(k) {
        k.backdrop('sunny-grounds');
        k.music('cosy');
        cast.harry = k.character('harry', { x: 160, y: 430, w: 210 });
        cast.ron = k.character('ron', { x: 350, y: 430, w: 210 });
        cast.neville = k.character('neville', { x: 540, y: 430, w: 210 });
        cast.lupin = k.character('lupin', { x: 820, y: 380, w: 250, flip: true });
      },
      async play(k) {
        const { harry, ron, neville, lupin } = cast;
        await k.say('finish');
        await k.say('wellDone', lupin);
        // A bar of chocolate for each of them.
        const bars = [harry, ron, neville].map((el) => {
          const b = k.box(el);
          const bar = k.add(chocolate(), { x: b.x + b.w / 2 - 45, y: b.y + b.h - 70, w: 90, z: 15 });
          k.set(bar, { opacity: 0, y: -40 });
          return bar;
        });
        for (const bar of bars) {
          k.fx.pop();
          await k.to(bar, 0.3, { opacity: 1, y: 0, ease: 'back.out(1.6)' });
        }
        await k.say('neville', neville);
        await k.say('fullMarks', lupin);
        await k.say('remembered', lupin);
        k.music('triumph');
        await k.all(k.say('whoopee', neville), k.hop(neville, 30, 2));
        await k.say('goodFriends', lupin);
        await k.say('more', ron);
        await k.say('thanksName', neville);
        await warmEnding(k, { cast: [harry, ron, neville], end: 'end' });
      },
    },
  ],
});
