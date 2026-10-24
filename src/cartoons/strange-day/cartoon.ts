/**
 * Mr Dursley's Strange Day: the opening of the first Harry Potter book. Mr
 * Dursley likes everything normal, but all day long strange things happen,
 * and that night a very special baby is left on his doorstep.
 *
 *   1. Breakfast. The Dursleys of Number Four, Privet Drive, are perfectly
 *      normal, thank you very much: "Nothing strange EVER happens on Privet
 *      Drive!" Dudley is hungry: Mrs Dursley brings the porridge pot
 *      over to him. Baby Dudley shouts "More!" and flings his porridge (splat, on
 *      the wall); Mr Dursley laughs: that's my boy. An owl flies past the
 *      window behind him. Did you see it? He didn't. Off to work.
 *   2. The cat with the map. At his gate, a tabby cat sits very stiffly on the
 *      wall with a map. The cat opens the map and reads it. A cat reading a map? Cats can't read! Then, crack, a jolly
 *      wizard in a cloak pops up and hugs him: what a happy day, even a
 *      Muggle should be dancing! Crack, gone. A WHAT? He goes purple.
 *   3. Owls at Grunnings. At his desk, among his lovely normal drills, owls
 *      fly past the window behind him: one, two, three. He turns just in
 *      time to see the last one. Mr Dursley switches the radio on. The radio says owls are flying everywhere,
 *      and there will be shooting stars tonight. Nonsense! Home, and straight
 *      to bed. But the strangest bit was still to come.
 *   4. Night on Privet Drive. His bedroom light goes out; he snores. The cat
 *      is still on the wall. Crack: Dumbledore. Rather a lot of light here.
 *      Dumbledore uses the Put-Outer, and click, click, click, each
 *      street lamp's light flies into it. "Good evening, Professor
 *      McGonagall": a puff, and the cat is McGonagall. How did he know? He's
 *      never seen a cat sit so stiffly. Sherbet lemon? No, thank you. Then a
 *      deep rumble in the sky.
 *   5. A visitor from the sky. A big light comes down out of the dark… it's
 *      only Hagrid, on a flying motorbike. Here he is, fast asleep: baby
 *      Harry, whom Dumbledore lays down gently on the doorstep,
 *      with a letter for his aunt and uncle.
 *      One day every child in our world will know his name. Hagrid sniffs.
 *      "Good luck, Harry." Click: the lamps come back on. Upstairs, Mr
 *      Dursley snores on. He has no idea. Goodnight, Harry.
 *
 * The gentle scary beat is the rumble and the light coming out of the night
 * sky (sound first, a slow approach), and it turns out to be Hagrid. Nobody
 * says why Harry has come to Privet Drive: only that he will live with his
 * aunt and uncle, and that one day everyone will know his name.
 *
 * The jolly wizard who hugs Mr Dursley is Slughorn, borrowed: the book's
 * little old man in a violet cloak, made someone he knows. The Dursleys, the
 * tabby cat, the street lamps, the Put-Outer, the motorbike and baby Harry
 * are in the Hogwarts world; the map, the newspaper, the radio, the porridge
 * and the little flying owls are drawn here.
 */
import { C, cached, circle, defineCartoon, ellipse, group, ink, noiseBurst, now, piece, poly, rect, svg, tone, type Kit } from '../../kit';
import { sounds as commonSounds } from '../../worlds/common/moves';
import { sounds as farawaySounds } from '../../worlds/faraway/moves';
import { moves as hogMoves } from '../../worlds/hogwarts/moves';
import meta from './meta';

const { apparate } = hogMoves;
const { click, sniff } = commonSounds;
const { snore } = farawaySounds;

// ------------------------------------------------------------------- art

/** The road map, folded (closed) or opened out, 200 × 150: green fields, roads, a red pin. */
const roadMap = cached(() =>
  svg({ w: 200, h: 150, name: 'strange-day-map', label: 'A map' }, [
    group({ part: 'open', opacity: 0 }, [
      piece(rect(6, 6, 188, 138, 3), '#eef0d8'),
      piece(rect(10, 10, 86, 64, 2), '#bcd59a', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
      piece(rect(104, 80, 86, 60, 2), '#bcd59a', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
      piece(ellipse(140, 40, 34, 20), '#9cc3dc', { edge: 'cut', fibre: false, shadow: false }),
      ink([[10, 100], [70, 90], [110, 60], [190, 52]], { width: 5, color: C.orange }),
      ink([[60, 10], [70, 90], [80, 140]], { width: 4, color: C.yellow }),
      ink([[66, 6], [66, 144]], { width: 1.5, color: '#b9b79a' }),
      ink([[133, 6], [133, 144]], { width: 1.5, color: '#b9b79a' }),
      piece(circle(110, 62, 8), C.red, { edge: 'cut' }),
    ]),
    group({ part: 'shut' }, [
      piece(rect(64, 50, 72, 92, 3), '#e2e4c8'),
      piece(rect(70, 58, 60, 34, 2), '#bcd59a', { edge: 'cut', fibre: false, shadow: false }),
      ink([[70, 120], [130, 104]], { width: 4, color: C.orange }),
    ]),
  ]),
);

/** Mr Dursley's newspaper, held up in front of him, 220 × 150. */
const newspaper = cached(() =>
  svg({ w: 220, h: 150, name: 'strange-day-newspaper', label: 'A newspaper' }, [
    piece(rect(6, 8, 208, 136, 2), '#ecebe2'),
    piece(rect(18, 20, 184, 20, 1), '#5b5b5b', { edge: 'cut', fibre: false, shadow: false }),
    ...[56, 72, 88, 104, 120].map((y) => ink([[18, y], [100, y]], { width: 3, color: '#9a9a92' })),
    ...[56, 72, 88, 104, 120].map((y) => ink([[120, y], [202, y]], { width: 3, color: '#9a9a92' })),
  ]),
);

/** Baby Dudley's porridge, flying (a blob) and splatted on the wall, 90 × 70. */
const porridge = cached(() =>
  svg({ w: 90, h: 70, name: 'strange-day-porridge', label: 'Porridge' }, [
    piece(poly([[10, 36], [24, 14], [44, 20], [62, 8], [80, 30], [70, 52], [46, 62], [20, 56]]), '#e7d7a8'),
    piece(ellipse(40, 36, 10, 7), '#d4c08a', { edge: 'cut', fibre: false, shadow: false }),
  ]),
);

/** A little brown owl flying past, wings out, facing right, 140 × 90. */
const flyingOwl = cached(() =>
  svg({ w: 140, h: 90, name: 'strange-day-owl', label: 'An owl' }, [
    group({ part: 'wingL', origin: [60, 46] }, [piece(poly([[60, 46], [8, 18], [18, 50], [56, 58]]), C.brownDark)]),
    piece(ellipse(72, 54, 30, 24), C.brown),
    piece(circle(98, 40, 20), C.brown),
    piece(circle(98, 40, 14), C.tan, { edge: 'cut', fibre: false }),
    piece(circle(93, 37, 4), C.ink, { edge: 'clean', shadow: false }),
    piece(circle(104, 37, 4), C.ink, { edge: 'clean', shadow: false }),
    piece(poly([[97, 44], [101, 44], [99, 50]]), C.orange, { edge: 'cut', shadow: false }),
    group({ part: 'wingR', origin: [70, 44] }, [piece(poly([[70, 44], [112, 6], [104, 40], [80, 56]]), '#7a5534')]),
  ]),
);

/** The porridge pot, 140 × 110: a round grey pot with a lid, a handle and a wisp of steam. */
const porridgePot = cached(() =>
  svg({ w: 140, h: 110, name: 'strange-day-pot', label: 'A pot of porridge' }, [
    piece(ellipse(70, 62, 52, 40), C.greyDark),
    piece(rect(24, 30, 92, 14, 6), C.grey, { edge: 'cut' }),
    piece(circle(70, 24, 8), C.gold, { edge: 'cut' }),
    ink([[18, 56], [4, 56], [4, 72], [20, 72]], { width: 5, color: C.greyDark }),
    ink([[118, 56], [136, 56], [136, 72], [120, 72]], { width: 5, color: C.greyDark }),
    ink([[70, 12], [64, 4]], { width: 2, color: C.greyDark }),
  ]),
);

/** Mr Dursley's radio, 150 × 110: a brown box with a round speaker and a dial. */
const radio = cached(() =>
  svg({ w: 150, h: 110, name: 'strange-day-radio', label: 'A radio' }, [
    ink([[40, 20], [20, 2]], { width: 3, color: C.greyDark }),
    piece(rect(8, 20, 134, 84, 12), C.wood),
    piece(circle(52, 62, 28), C.brownDark, { edge: 'cut' }),
    ...[48, 58, 68, 76].map((y) => ink([[32, y], [72, y]], { width: 2, color: C.tan })),
    piece(rect(94, 38, 38, 18, 3), C.cream, { edge: 'cut' }),
    piece(circle(113, 80, 9), C.gold, { edge: 'cut' }),
  ]),
);

/** A light that carries a lamp's glow (or brings it back) between the Put-Outer and a lamp. */
const SPARK = '#ffe9a8';

// ---------------------------------------------------------------- sounds

/** Hagrid's motorbike: a deep, rumbling engine for `seconds`, swelling in (never sudden). */
function engine(seconds = 2.5): void {
  const t = now();
  tone(48, t, { wave: 'sawtooth', peak: 0.1, attack: seconds * 0.6, decay: seconds * 0.4, vibrato: [18, 6], lowpass: 260 });
  tone(72, t, { wave: 'triangle', peak: 0.06, attack: seconds * 0.6, decay: seconds * 0.4, vibrato: [24, 5] });
  noiseBurst(t, { freq: 180, type: 'lowpass', peak: 0.06, attack: seconds * 0.6, decay: seconds * 0.4 });
}

/** The radio: a little crackle and a two-note chime before the news. */
function newsChime(): void {
  const t = now();
  noiseBurst(t, { freq: 2400, q: 1, peak: 0.03, decay: 0.3 });
  tone(784, t + 0.35, { wave: 'triangle', peak: 0.07, decay: 0.4 });
  tone(523, t + 0.65, { wave: 'triangle', peak: 0.07, decay: 0.6 });
}

// ------------------------------------------------------------------ cast

type Actor =
  | 'vernon' | 'petunia' | 'dudley' | 'pot' | 'cat' | 'map' | 'paper' | 'jolly' | 'radio'
  | 'dumbledore' | 'mcgonagall' | 'hagrid' | 'bike' | 'baby' | 'putOuter' | 'window';
const cast = {} as Record<Actor, HTMLElement>;

/** The three street lamps on Privet Drive at night: the lamp, its pool of light, and its head (where its light is). */
interface Lamp { lamp: HTMLElement; pool: HTMLElement; head: [number, number] }
let lamps: Lamp[] = [];

/** Where the lamps stand (their centres) and how they're drawn (streetLamp is 120 × 400; head centre at 60, 84). */
const LAMP_X = [120, 470, 1050];
const LAMP_TOP = 240;
const LAMP_HEAD_Y = LAMP_TOP + 84;

/** The cat on the garden wall (wall top y 520; her paws are at y 330 of her 340 box), right of the street sign, and the map in her paws. */
const CAT = { x: 280, y: 337, w: 170 };
const MAP = { x: 375, y: 420, w: 200 };

/** On the doorstep of Number Four (x 615–765, top y 600), where baby Harry is set down (the bundle's bottom is y 150 of 160). */
const STEP = { x: 615, y: 500, w: 150 };

/** Where Hagrid holds baby Harry, over the motorbike. */
const BABY = { x: 860, y: 450 };

/** Number Four's upstairs window, Mr Dursley's bedroom. */
const BEDROOM: [number, number] = [610, 245];

/** Puts the lamps up, lit (in `set`). */
function streetLamps<K extends string>(k: Kit<K>): void {
  lamps = LAMP_X.map((x) => ({
    lamp: k.prop('streetLamp', { x: x - 60, y: LAMP_TOP, w: 120, z: 4 }),
    pool: k.light(x, LAMP_HEAD_Y + 40, 150, { color: SPARK, strength: 0.45, z: 5 }),
    head: [x, LAMP_HEAD_Y] as [number, number],
  }));
}

/**
 * The Put-Outer clicks the lamps out one by one: each light leaves its lamp
 * and flies into the Put-Outer at `to`. With `on`, the lights fly back out.
 */
async function putOut<K extends string>(k: Kit<K>, to: [number, number], on = false): Promise<void> {
  for (const l of lamps) {
    click();
    const [from, dest] = on ? [to, l.head] : [l.head, to];
    const spark = k.light(from[0], from[1], 34, { color: SPARK, strength: 0.9 });
    if (!on) void k.all(k.to(k.part(l.lamp, 'glow'), 0.35, { opacity: 0 }), k.to(l.pool, 0.35, { opacity: 0 }));
    await k.to(spark, 0.5, { x: dest[0] - from[0], y: dest[1] - from[1], ease: 'power1.inOut' });
    k.remove(spark);
    if (on) {
      k.fx.twinkle();
      void k.all(k.to(k.part(l.lamp, 'glow'), 0.4, { opacity: 1 }), k.to(l.pool, 0.4, { opacity: 0.45 }));
    }
    await k.wait(150);
  }
}

/** Mr Dursley goes purple (or back to pink). */
function purple<K extends string>(k: Kit<K>, vernon: HTMLElement, on = true): Promise<void> {
  return k.to(k.part(vernon, 'cross'), 0.6, { opacity: on ? 1 : 0 });
}

/** A little owl flies across the window from left to right, flapping, between x0 and x1 at height y. */
async function owlPast<K extends string>(k: Kit<K>, x0: number, x1: number, y: number, seconds = 1.6, w = 110): Promise<void> {
  const owl = k.add(flyingOwl(), { x: x0, y, w, z: 2 });
  const wings = k.pivot([...k.part(owl, 'wingL'), ...k.part(owl, 'wingR')]);
  void k.to(wings, 0.18, { rotation: 22, yoyo: true, repeat: Math.round(seconds / 0.18) });
  k.sfx.whoosh();
  await k.to(owl, seconds, { x: x1 - x0, y: -20, ease: 'none' });
  k.remove(owl);
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. Breakfast
    normal: { who: 'narrator', text: 'Mr and Mrs Dursley, of Number Four, Privet Drive, were perfectly normal. Thank you very much.' },
    nothingStrange: { who: 'vernon', text: 'And nothing strange EVER happens on Privet Drive. Not ever!' },
    helpedPot: { who: 'petunia', text: 'Dudley is hungry. Here is your porridge, Dudley.' },
    more: { who: 'dudley', text: 'More! MORE!' },
    myBoy: { who: 'vernon', text: 'Ha ha! That’s my boy!' },
    sawOwl: { who: 'narrator', text: 'Did you see that? An owl! In the morning!' },
    whatOwl: { who: 'vernon', text: 'Hmm? An owl? Don’t be silly. Owls only come out at night.' },
    offToWork: { who: 'vernon', text: 'Right! Off to work. Drills to sell!' },
    // 2. The cat with the map
    whatCat: { who: 'vernon', text: 'Hello. What’s that cat doing on my wall?' },
    helpedMap: { who: 'narrator', text: 'That cat has got a map! Look, the cat is opening it.' },
    readingMap: { who: 'vernon', text: 'A cat… reading a MAP? Cats can’t read!' },
    happyDay: { who: 'slughorn', text: 'Oh, what a happy day! Even a Muggle like you should be dancing!' },
    aWhat: { who: 'vernon', text: 'A what? A MUGGLE?' },
    // 3. Owls at Grunnings
    helpedRadio: { who: 'vernon', text: 'I’ll switch the radio on.' },
    drills: { who: 'vernon', text: 'Ah, my office. Lovely drills. Normal drills. No cats. No cloaks.' },
    behindHim: { who: 'narrator', text: 'But behind him, past the window, flew an owl. And another. And another!' },
    owls: { who: 'vernon', text: 'OWLS? In the daytime?' },
    news: { who: 'narrator', text: 'And now the news. Owls have been flying everywhere today. And tonight, look out for shooting stars!' },
    nonsense: { who: 'vernon', text: 'Owls! Shooting stars! NONSENSE! I’m going straight to bed!' },
    stillToCome: { who: 'narrator', text: 'But the strangest bit of the day was still to come.' },
    // 4. Night on Privet Drive
    snoring: { who: 'narrator', text: 'That night, Mr Dursley went to bed. Soon he was snoring.' },
    goodEvening: { who: 'dumbledore', text: 'Rather a lot of light here, don’t you think?' },
    helpedPutOuter: { who: 'dumbledore', text: 'Then I shall click my Put-Outer.' },
    nobodySees: { who: 'dumbledore', text: 'Much better. Now nobody will see us.' },
    professor: { who: 'dumbledore', text: 'Good evening, Professor McGonagall.' },
    howKnow: { who: 'mcgonagall', text: 'How did you know it was me?' },
    stiffly: { who: 'dumbledore', text: 'My dear Professor, I’ve never seen a cat sit so stiffly.' },
    helpedHarry: { who: 'dumbledore', text: 'Allow me. I shall lay him down gently.' },
    thanksHarry: { who: 'hagrid', text: 'Lovely and gentle. Thank you.' },
    sherbet: { who: 'dumbledore', text: 'Sherbet lemon?' },
    noThanks: { who: 'mcgonagall', text: 'No, thank you. Where is Hagrid, with the baby? He’s late.' },
    listen: { who: 'mcgonagall', text: 'Listen! What is that noise?' },
    // 5. A visitor from the sky
    rumble: { who: 'narrator', text: 'A deep, deep rumble. And a big light, coming down out of the sky…' },
    sorryLate: { who: 'hagrid', text: 'Evenin’, Professor! Sorry I’m late!' },
    fastAsleep: { who: 'hagrid', text: 'Here’s little Harry. Fast asleep, bless him.' },
    letter: { who: 'dumbledore', text: 'There. And a letter, to tell his aunt and uncle.' },
    knowName: { who: 'mcgonagall', text: 'One day, every child in our world will know his name.' },
    goodLuck: { who: 'dumbledore', text: 'Good luck, Harry.' },
    end: { who: 'narrator', text: 'Upstairs, Mr Dursley snored. He had no idea. Goodnight, Harry.' },
  },
  scenes: [
    // ==================================================== 1. Breakfast
    {
      name: 'Breakfast',
      set(k) {
        k.backdrop('dursley-kitchen');
        k.music('cosy');
        cast.vernon = k.character('vernon', { x: 70, y: 300, w: 290 });
        cast.dudley = k.character('dudley', { x: 470, y: 350, w: 240 });
        cast.petunia = k.character('petunia', { x: 840, y: 300, w: 270, flip: true });
        // Mr Dursley's newspaper, held up low in front of him (he reads it and sees nothing).
        cast.paper = k.add(newspaper(), { x: 110, y: 510, w: 220, z: 12 });
        k.set(cast.paper, { opacity: 0 });
      },
      async play(k) {
        const { vernon, petunia, dudley, paper } = cast;
        await k.wait(400);
        await k.say('normal');
        await k.all(k.say('nothingStrange', vernon), k.wait(300).then(() => k.blink(vernon)));

        // Dudley is hungry; Mrs Dursley brings the porridge pot over to him.
        const pot = k.add(porridgePot(), { x: 780, y: 540, w: 140, z: 12 });
        k.sfx.rustle();
        await k.appear(pot, 0.4);
        await k.say('helpedPot', petunia);
        await k.carry(pot, dudley);
        await k.vanish(pot, 0.3);

        // Dudley wants more: the spoon flings the porridge, splat, onto the wall.
        await k.all(k.say('more', dudley), k.shake(dudley, 6, 3));
        const [arm] = k.pivot(k.part(dudley, 'armR'));
        const blob = k.add(porridge(), { x: 640, y: 420, w: 60, z: 12 });
        k.set(blob, { opacity: 0 });
        await k.to(arm, 0.25, { rotation: -50 });
        k.set(blob, { opacity: 1 });
        k.fx.whizz();
        await k.all(k.to(arm, 0.3, { rotation: 0 }), k.to(blob, 0.6, { x: 140, y: -250, rotation: 200, scale: 1.4, ease: 'power1.out' }));
        k.fx.splash();
        await k.pop(blob, 1.25);
        await k.all(k.say('myBoy', vernon), k.shake(vernon, 4, 3));

        // He reads his paper; behind him, an owl flies past the window. He never looks.
        k.sfx.rustle();
        await k.appear(paper, 0.4);
        await k.wait(300);
        k.sfx.hoot();
        await owlPast(k, 360, 800, 160, 2);
        await k.say('sawOwl');
        await k.say('whatOwl', vernon);
        await k.wait(300);

        // Off to work.
        k.sfx.rustle();
        await k.vanish(paper, 0.3);
        await k.say('offToWork', vernon);
        k.fx.patter(6);
        await k.exit(vernon, 'left', 0.8);
      },
    },

    // ==================================================== 2. The cat with the map
    {
      name: 'The cat with the map',
      set(k) {
        k.backdrop('privet-drive');
        k.music('sneaky');
        cast.cat = k.character('tabbyCat', CAT);
        cast.map = k.add(roadMap(), { ...MAP, z: 12 });
        cast.vernon = k.character('vernon', { x: 600, y: 300, w: 280, flip: true });
        cast.jolly = k.character('slughorn', { x: 860, y: 310, w: 260, flip: true });
        k.set(cast.jolly, { opacity: 0 });
      },
      async play(k) {
        const { cat, map, vernon, jolly } = cast;
        k.fx.patter(4);
        await k.wait(500);
        await k.say('whatCat', vernon);
        await k.blink(cat);

        // The cat opens the map and reads it.
        await k.say('helpedMap');
        k.flourish(map);
        k.sfx.page();
        void k.to(k.part(map, 'shut'), 0.3, { opacity: 0 });
        await k.to(k.part(map, 'open'), 0.4, { opacity: 1 });
        // The cat leans in and reads, nodding.
        await k.to(cat, 0.4, { rotation: 6 });
        await k.to(cat, 0.3, { y: '+=8', yoyo: true, repeat: 3 });
        await k.to(cat, 0.3, { rotation: 0 });

        // His double take.
        await k.shake(vernon, 8, 2);
        await k.say('readingMap', vernon);
        // The cat folds her map away and stares back at him.
        k.sfx.page();
        void k.to(k.part(map, 'open'), 0.3, { opacity: 0 });
        await k.to(k.part(map, 'shut'), 0.3, { opacity: 1 });
        await k.blink(cat);

        // Crack! A jolly wizard in a cloak, who hugs him.
        await apparate(k, jolly);
        k.fx.boing();
        await k.to(jolly, 0.4, { x: -170, ease: 'power2.out' });
        await k.all(k.shake(jolly, 5, 3), k.shake(vernon, 5, 3));
        k.sparkle(760, 380, 10, 120);
        await k.to(jolly, 0.4, { x: 0 });
        await k.say('happyDay', jolly);
        await apparate(k, jolly, false);

        // A WHAT?
        await k.wait(300);
        await k.all(k.say('aWhat', vernon), purple(k, vernon));
        k.fx.stomp(3, 0.3);
        await k.exit(vernon, 'right', 0.8);
        await k.blink(cat);
      },
    },

    // ==================================================== 3. Owls at Grunnings
    {
      name: 'Owls at Grunnings',
      set(k) {
        k.backdrop('grunnings-office');
        k.music('cosy');
        // He stands behind his desk, the desk hiding the bottom of him.
        cast.vernon = k.character('vernon', { x: 180, y: 260, w: 290, z: 8 });
        cast.radio = k.add(radio(), { x: 470, y: 440, w: 140, z: 12 });
      },
      async play(k) {
        const { vernon, radio: set } = cast;
        await k.wait(400);
        await k.say('drills', vernon);

        // Behind him, past the window: an owl, and another, and another.
        k.sfx.hoot();
        await k.all(k.say('behindHim'), owlPast(k, 600, 1140, 160, 1.6), k.wait(1200).then(() => owlPast(k, 600, 1140, 230, 1.5, 90)));
        k.sfx.hoot();
        // He turns just in time to see the last one.
        const last = owlPast(k, 600, 1140, 190, 2.2, 120);
        await k.wait(500);
        k.face(vernon, true);
        await k.shake(vernon, 8, 2);
        await k.say('owls', vernon);
        await last;

        // Mr Dursley switches the radio on.
        k.face(vernon, false);
        await k.say('helpedRadio', vernon);
        k.flourish(set);
        k.fx.pop();
        newsChime();
        await k.wait(800);
        await k.say('news', set);
        await k.all(k.say('nonsense', vernon), purple(k, vernon));
        await purple(k, vernon, false);
        k.silence();
        k.sfx.ominous();
        await k.wait(500);
        await k.say('stillToCome');
      },
    },

    // ==================================================== 4. Night on Privet Drive
    {
      name: 'Night on Privet Drive',
      set(k) {
        k.backdrop('privet-drive-night');
        k.music('dreamy');
        streetLamps(k);
        cast.window = k.light(BEDROOM[0], BEDROOM[1], 70, { color: '#ffe0a0', strength: 0.55, z: 5 });
        cast.cat = k.character('tabbyCat', CAT);
        cast.dumbledore = k.character('dumbledore', { x: 640, y: 315, w: 260, flip: true });
        cast.putOuter = k.prop('putOuter', { x: 600, y: 430, w: 110, z: 14 });
        cast.mcgonagall = k.character('mcgonagall', { x: 230, y: 310, w: 250 });
        k.set([cast.dumbledore, cast.putOuter, cast.mcgonagall], { opacity: 0 });
      },
      async play(k) {
        const { cat, dumbledore, putOuter, mcgonagall, window: bedroomLight } = cast;
        await k.wait(500);
        // His light goes out; he snores.
        await k.all(k.say('snoring'), k.wait(1500).then(() => k.fade(bedroomLight, 0, 0.8)));
        snore();
        await k.wait(1800);
        await k.blink(cat);

        // Crack! Dumbledore.
        await apparate(k, dumbledore);
        await k.wait(300);
        await k.say('goodEvening', dumbledore);
        k.fx.twinkle();
        await k.appear(putOuter, 0.4);

        // Dumbledore clicks the Put-Outer, and the lamps go out.
        await k.say('helpedPutOuter', dumbledore);
        k.flourish(putOuter);
        await putOut(k, [655, 485]);
        await k.wait(400);
        await k.say('nobodySees', dumbledore);
        k.fx.twinkle();
        await k.vanish(putOuter, 0.3);

        // The cat is Professor McGonagall.
        await k.say('professor', dumbledore);
        k.fx.poof();
        k.puff(365, 440, 260, '#6a6a78');
        await k.wait(250);
        k.remove(cat);
        k.set(mcgonagall, { opacity: 1 });
        await k.pop(mcgonagall, 1.08);
        await k.say('howKnow', mcgonagall);
        await k.say('stiffly', dumbledore);
        await k.all(k.say('sherbet', dumbledore), k.hop(dumbledore, 16));
        await k.say('noThanks', mcgonagall);

        // A deep rumble in the sky.
        k.silence();
        engine(2.5);
        await k.wait(1200);
        await k.all(k.say('listen', mcgonagall), k.shake(mcgonagall, 3, 2));
      },
    },

    // ==================================================== 5. A visitor from the sky
    {
      name: 'A visitor from the sky',
      set(k) {
        k.backdrop('privet-drive-night');
        k.music('dreamy');
        // The lamps are out (Dumbledore put them out).
        streetLamps(k);
        for (const l of lamps) {
          k.set(k.part(l.lamp, 'glow'), { opacity: 0 });
          k.set(l.pool, { opacity: 0 });
        }
        cast.mcgonagall = k.character('mcgonagall', { x: 120, y: 310, w: 250 });
        cast.dumbledore = k.character('dumbledore', { x: 400, y: 315, w: 260 });
        // Hagrid sits behind his motorbike; both come down out of the sky together.
        cast.hagrid = k.character('hagrid', { x: 788, y: 240, w: 280, z: 11 });
        cast.bike = k.prop('flyingMotorbike', { x: 760, y: 410, w: 400, z: 12 });
        cast.baby = k.prop('babyHarry', { x: BABY.x, y: BABY.y, w: STEP.w, z: 13 });
        k.set([cast.hagrid, cast.bike, cast.baby], { y: -620 });
        k.set(cast.baby, { opacity: 0 });
        k.set(k.part(cast.baby, 'letter'), { opacity: 0 });
      },
      async play(k) {
        const { mcgonagall, dumbledore, hagrid, bike, baby } = cast;
        // The rumble swells, and a light comes down out of the dark.
        engine(4);
        await k.all(k.say('rumble'), k.to([hagrid, bike, baby], 3.2, { y: 0, ease: 'power2.out' }));
        k.fx.thud();
        k.quake(5);
        k.puff(940, 650, 240, '#5a5a66');
        await k.wait(500);

        // It's only Hagrid.
        k.music('cosy');
        await k.all(k.say('sorryLate', hagrid), k.hop(mcgonagall, 14));
        // He holds out the bundle.
        k.set(baby, { y: -60 });
        await k.appear(baby, 0.5);
        await k.say('fastAsleep', hagrid);

        // He lays little Harry on the doorstep, with a letter.
        k.fx.twinkle();
        // Dumbledore lays little Harry down on the step (the bundle's middle is 75 px in and 55 down).
        await k.say('helpedHarry', dumbledore);
        await k.carry(baby, [STEP.x + 75, STEP.y + 55]);
        await k.say('thanksHarry', hagrid);
        k.sfx.page();
        await k.to(k.part(baby, 'letter'), 0.5, { opacity: 1 });
        k.sparkle(STEP.x + 80, STEP.y + 50, 8, 90);
        await k.say('letter', dumbledore);
        await k.say('knowName', mcgonagall);
        sniff();
        await k.shake(hagrid, 3, 2);
        await k.say('goodLuck', dumbledore);

        // Click: the lamps come back on. Everyone slips away, and he sleeps on.
        click();
        await putOut(k, [520, 480], true);
        engine(2);
        await k.all(k.to([hagrid, bike], 2, { x: 600, y: -700, ease: 'power2.in' }), k.wait(600).then(() => apparate(k, mcgonagall, false)), k.wait(900).then(() => apparate(k, dumbledore, false)));
        snore();
        await k.wait(1200);
        k.music('dreamy');
        k.sparkle(STEP.x + 80, STEP.y + 40, 12, 140);
        k.fx.twinkle();
        await k.say('end');
        await k.wait(1500);
      },
    },
  ],
});
