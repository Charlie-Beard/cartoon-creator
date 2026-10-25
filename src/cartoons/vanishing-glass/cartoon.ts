/**
 * The Vanishing Glass: before Hogwarts, on Dudley's birthday, Harry is taken
 * to the zoo, where a big snake has never been home to Brazil.
 *
 *   1. The birthday breakfast. Harry cooks the bacon (a deed: he counts
 *      "one, two, three… flip!" and the bacon flips up and lands back in
 *      the pan). Dudley stomps in: how many presents? Thirty-six! But last
 *      year he had thirty-seven! Aunt Petunia will buy two more at the zoo.
 *      Dudley counts on his fingers (thirty… thirty…) until Mum says
 *      thirty-eight. "All right then." Mrs Figg can't have Harry, so he has
 *      to come too, and Uncle Vernon leans over him, going purple: no funny
 *      business at the zoo. None! "I won't do anything. Honestly." But
 *      strange things had a way of happening around Harry.
 *   2. The reptile house. The biggest snake of all is fast asleep behind
 *      glass. Dudley wants it to move, Uncle Vernon bangs on the glass, and
 *      the snake does not stir. "This is BORING." Ice cream! They all go.
 *      Harry says sorry for them, and the snake opens one eye and WINKS. He
 *      can talk to her! She has never been to Brazil: she was born in this
 *      tank. "I wish you could go and see it," says Harry. Then Dudley comes
 *      bursting back: "Mum! Dad! Come and look what the snake's doing!"
 *   3. The glass vanishes. (The big deed.) Harry puts his hand on the glass:
 *      "I wish this glass would just… go." A soft shimmer, and it fades away.
 *      Dudley, leaning on nothing, topples forward, SPLASH, into the pool.
 *      The snake slithers out, says thanks, winks and slides away. Petunia
 *      screams, Vernon shouts "Everybody RUN!" (on the spot). Then, quietly,
 *      the glass is back, with Dudley inside the tank, banging to be let out.
 *      Harry tries not to laugh. The small scary beat: Uncle Vernon turns
 *      slowly, goes purple, and the camera comes in: "BOY! What… did… you…
 *      DO?" "Nothing! The glass just went!"
 *   4. The cupboard under the stairs. No more trips for Harry: cupboard,
 *      NOW. Poor wet Diddy-kins is dried and given cake, and the Dursleys
 *      go. Harry is alone in the cupboard, and smiling. He draws his new
 *      friend and pins the drawing to the wall (the warm deed). Far, far
 *      away, a big snake is on her way to Brazil, sunbathing, and she winks.
 *
 * One-off art here: the frying pan and bacon, Dudley's counting fingers, the
 * water he sits in, the snake drawing, the open cupboard (a patch laid over
 * the closed door of the hall), the towel, and the sun and sand strip.
 *
 * Safety: Uncle Vernon looms, purple, and shouts once; nobody is touched.
 * Dudley falls in a shallow pool and is only wet, then shut in a glass tank
 * for a moment, safe and cross, and he's out and dried by the end. The snake
 * is friendly, never frightening, and nobody is hurt by her; she is simply
 * going home. Harry's cupboard is cosy with his own torch-glow.
 */
import { C, cached, circle, defineCartoon, ellipse, group, ink, noiseBurst, now, piece, poly, rect, svg, tone, type Kit } from '../../kit';
import { moves as commonMoves, sounds as commonSounds } from '../../worlds/common/moves';
import { meanwhile } from '../../worlds/common/pieces';
import { sounds as hogSounds } from '../../worlds/hogwarts/moves';
import meta from './meta';

const { giggle, slam } = commonSounds;
const { slither, snakeHiss } = hogSounds;
const { wave } = commonMoves;

// ------------------------------------------------------------------- art

/** The frying pan with two rashers of bacon, 260 × 150: the handle on the left, the pan on the right. */
const fryingPan = cached(() =>
  svg({ w: 260, h: 150, name: 'vanishing-glass-pan', label: 'A frying pan with bacon' }, [
    ink([[8, 84], [90, 84]], { width: 12, color: C.brownDark }),
    piece(ellipse(170, 88, 84, 46), C.charcoal),
    piece(ellipse(170, 84, 70, 36), C.greyDark, { edge: 'cut', fibre: false, shadow: false }),
    group({ part: 'bacon', origin: [170, 84] }, [
      piece(poly([[118, 72], [146, 64], [176, 72], [208, 64], [214, 80], [182, 88], [150, 80], [120, 88]]), '#c4584a', { edge: 'cut', shadow: false }),
      ink([[124, 78], [150, 72], [178, 79], [208, 72]], { width: 3, color: C.cream }),
      piece(poly([[122, 92], [150, 84], [180, 92], [210, 84], [214, 98], [182, 106], [150, 98], [124, 106]]), '#b04a40', { edge: 'cut', shadow: false }),
      ink([[128, 98], [152, 92], [180, 99], [206, 92]], { width: 3, color: C.cream }),
    ]),
  ]),
);

/** Dudley's counting hand, 120 × 150: a palm and five fingers, which pop up one at a time (parts f1 to f5). */
const countingHand = cached(() =>
  svg({ w: 120, h: 150, name: 'vanishing-glass-hand', label: 'A counting hand' }, [
    group({ part: 'f1', opacity: 0 }, [piece(ellipse(20, 94, 9, 20, -0.9), '#f2b6ad', { edge: 'cut', shadow: false })]),
    group({ part: 'f2', opacity: 0 }, [piece(ellipse(38, 52, 9, 26), '#f2b6ad', { edge: 'cut', shadow: false })]),
    group({ part: 'f3', opacity: 0 }, [piece(ellipse(58, 40, 9, 30), '#f2b6ad', { edge: 'cut', shadow: false })]),
    group({ part: 'f4', opacity: 0 }, [piece(ellipse(78, 48, 9, 27), '#f2b6ad', { edge: 'cut', shadow: false })]),
    group({ part: 'f5', opacity: 0 }, [piece(ellipse(96, 64, 8, 22, 0.3), '#f2b6ad', { edge: 'cut', shadow: false })]),
    piece(circle(58, 102, 36), '#f2b6ad'),
    ink([[40, 118], [76, 118]], { width: 3, color: '#d98f86' }),
  ]),
);

/**
 * The pool Dudley sits in once he has fallen into the tank, 300 × 110: a
 * wavy-topped splash of see-through water round his middle, with ripple
 * rings and drops flying up, so it reads as water and not a dish.
 */
const sittingWater = cached(() =>
  svg({ w: 300, h: 110, name: 'vanishing-glass-water', label: 'Water' }, [
    piece(poly([[6, 60], [30, 46], [52, 58], [80, 42], [108, 56], [140, 40], [170, 56], [200, 42], [228, 56], [258, 44], [294, 60], [286, 96], [150, 106], [14, 96]]), '#4f8fb0', { opacity: 0.85 }),
    piece(poly([[30, 62], [60, 54], [96, 62], [140, 52], [190, 62], [236, 54], [270, 64], [240, 80], [150, 86], [56, 80]]), '#7ab4cf', { edge: 'cut', fibre: false, shadow: false, opacity: 0.7 }),
    ink([[40, 74], [84, 70]], { width: 3, color: C.white }),
    ink([[180, 82], [236, 76]], { width: 3, color: C.white }),
    ink([[110, 90], [150, 88]], { width: 2.5, color: C.white }),
    piece(ellipse(24, 30, 7, 10), '#7ab4cf', { edge: 'clean', shadow: false }),
    piece(ellipse(56, 14, 5, 8), '#7ab4cf', { edge: 'clean', shadow: false }),
    piece(ellipse(246, 20, 6, 9), '#7ab4cf', { edge: 'clean', shadow: false }),
    piece(ellipse(278, 34, 5, 7), '#7ab4cf', { edge: 'clean', shadow: false }),
  ]),
);

/** Harry's drawing of the snake, 150 × 110: a sheet of paper, a green wiggly snake and a sun (parts s1 to s4, drawn one by one). */
const snakeDrawing = cached(() =>
  svg({ w: 150, h: 110, name: 'vanishing-glass-drawing', label: 'A drawing of a snake' }, [
    piece(rect(6, 6, 138, 98, 2), C.white),
    group({ part: 's1', opacity: 0 }, [ink([[24, 80], [44, 56], [64, 78], [86, 54], [106, 74], [118, 48]], { width: 8, color: C.green })]),
    group({ part: 's2', opacity: 0 }, [piece(circle(122, 42, 14), C.green, { edge: 'cut', shadow: false })]),
    group({ part: 's3', opacity: 0 }, [
      piece(circle(118, 38, 3.4), C.ink, { edge: 'clean', shadow: false }),
      piece(circle(128, 38, 3.4), C.ink, { edge: 'clean', shadow: false }),
      ink([[116, 48], [122, 52], [130, 48]], { width: 2, color: C.ink }),
    ]),
    group({ part: 's4', opacity: 0 }, [piece(circle(30, 28, 12), C.yellow, { edge: 'cut', shadow: false })]),
  ]),
);

/** The cupboard under the stairs with its door swung open, 150 × 215, laid over the closed door of the hall. */
const openCupboard = cached(() =>
  svg({ w: 150, h: 215, name: 'vanishing-glass-cupboard', label: 'The open cupboard' }, [
    piece(rect(10, 4, 132, 211, 3), '#e0b98a'),
    piece(rect(16, 10, 120, 205, 2), '#3a2a22', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(18, 12, 116, 100, 2), '#5b4331', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
    // his little bed, with a pillow
    piece(rect(18, 168, 116, 44, 4), '#6b8fb0', { edge: 'cut', shadow: false }),
    piece(ellipse(110, 164, 24, 11), C.cream, { edge: 'cut', fibre: false, shadow: false }),
    // the door, swung open: seen edge-on at the left
    piece(poly([[0, 8], [20, 16], [20, 208], [0, 215]]), C.tan),
  ]),
);

/** Aunt Petunia's towel, 130 × 80: white, with two blue stripes. */
const towel = cached(() =>
  svg({ w: 130, h: 80, name: 'vanishing-glass-towel', label: 'A towel' }, [
    piece(rect(6, 8, 118, 62, 4), C.white),
    ink([[10, 28], [120, 28]], { width: 8, color: C.sky }),
    ink([[10, 52], [120, 52]], { width: 8, color: C.sky }),
  ]),
);

/** The sun, 280 × 280: a warm gold disc with slowly turning rays (part `rays`). */
const sun = cached(() =>
  svg({ w: 280, h: 280, name: 'vanishing-glass-sun', label: 'The sun' }, [
    group({ part: 'rays', origin: [140, 140] }, [
      ...Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return ink([[140 + Math.cos(a) * 92, 140 + Math.sin(a) * 92], [140 + Math.cos(a) * 130, 140 + Math.sin(a) * 130]], { width: 10, color: C.goldLight });
      }),
    ]),
    piece(circle(140, 140, 72), C.gold),
    piece(circle(140, 140, 54), C.goldLight, { edge: 'cut', fibre: false, shadow: false }),
  ]),
);

/** A warm strip of sand for the snake to stretch out on, 1180 × 220. */
const sand = cached(() =>
  svg({ w: 1180, h: 220, name: 'vanishing-glass-sand', label: 'A sandy road' }, [
    piece(poly([[0, 30], [140, 14], [300, 26], [470, 10], [650, 24], [820, 8], [1000, 22], [1180, 12], [1180, 220], [0, 220]]), C.sand),
    piece(poly([[0, 120], [210, 106], [420, 124], [660, 108], [900, 126], [1180, 110], [1180, 220], [0, 220]]), '#cfae80', { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
  ]),
);

// ---------------------------------------------------------------- sounds

/** A small dry tick: one finger counted. */
function tick(): void {
  tone(1500, now(), { wave: 'square', peak: 0.035, attack: 0.002, decay: 0.05 });
}

/** Bacon sizzling: a soft crackle of hiss, for `seconds`. */
function sizzle(seconds = 1): void {
  const t = now();
  for (let i = 0; i < Math.round(seconds * 14); i++) noiseBurst(t + i * 0.07, { freq: 5000 + (i % 3) * 700, q: 1, peak: 0.02, attack: 0.005, decay: 0.05 });
}

/** A pencil scribbling: a few quick scratchy strokes. */
function scribble(): void {
  const t = now();
  for (let i = 0; i < 7; i++) noiseBurst(t + i * 0.07, { freq: 3000 + (i % 2) * 900, q: 2, peak: 0.03, attack: 0.005, decay: 0.05 });
}

/** A quiet shimmer for the glass fading: soft rising notes. */
function shimmer(): void {
  const t = now();
  [1046, 1318, 1568, 2093].forEach((f, i) => tone(f, t + i * 0.16, { wave: 'sine', peak: 0.04, attack: 0.05, decay: 0.7 }));
}

// ------------------------------------------------------------------ cast

type Actor =
  | 'harry' | 'petunia' | 'vernon' | 'dudley' | 'boa' | 'pan' | 'pile' | 'hand' | 'glass' | 'water'
  | 'cupboard' | 'drawing' | 'towel' | 'glow' | 'sun' | 'sand';
const cast = {} as Record<Actor, HTMLElement>;

/** The big tank's opening (x 390 to 890, y 170 to 590) and the little pool inside it. */
const TANK = { x: 390, y: 170, w: 500 };
const POOL: [number, number] = [560, 560];

/** Vernon goes purple (or back to pink). */
function purple<K extends string>(k: Kit<K>, who: HTMLElement, on = true, seconds = 0.6): Promise<void> {
  return k.to(k.part(who, 'cross'), seconds, { opacity: on ? 1 : 0 });
}

/** Raises the boa's head to look at someone, or lets it droop: degrees about the neck (0 is upright). */
function boaHead<K extends string>(k: Kit<K>, boa: HTMLElement, degrees: number, seconds = 0.6): Promise<void> {
  const [head] = k.pivot(k.part(boa, 'head'));
  return k.to(head, seconds, { rotation: degrees });
}

/** The boa winks: one eye shows for a moment, and there's a twinkle. */
async function wink<K extends string>(k: Kit<K>, boa: HTMLElement): Promise<void> {
  k.set(k.part(boa, 'wink'), { opacity: 1 });
  k.fx.twinkle();
  await k.wait(600);
  k.set(k.part(boa, 'wink'), { opacity: 0 });
}

/** Harry has no wand yet: hides the one his portrait carries. */
function noWand<K extends string>(k: Kit<K>, harry: HTMLElement): void {
  k.set(k.part(harry, 'wand'), { opacity: 0 });
}

/** Shuts or opens the boa's eyes (both lids at once). */
function lids<K extends string>(k: Kit<K>, boa: HTMLElement, shut: boolean): void {
  k.part(boa, 'lids').forEach((l) => (l.style.opacity = shut ? '1' : '0'));
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. The birthday breakfast
    birthday: { who: 'narrator', text: 'It was Dudley’s birthday. And Harry was cooking the breakfast.' },
    watchBacon: { who: 'petunia', text: 'Don’t burn that bacon, Harry. Everything must be perfect for Diddy’s birthday.' },
    flip: { who: 'harry', text: 'Yes, Aunt Petunia. One, two, three… flip!' },
    howMany: { who: 'dudleyBig', text: 'How many presents are there?' },
    thirtySix: { who: 'vernon', text: 'Thirty-six, Dudders. I counted them myself!' },
    lastYear: { who: 'dudleyBig', text: 'THIRTY-SIX? But last year I had thirty-seven!' },
    twoMore: { who: 'petunia', text: 'Don’t cry, sweetums. We’ll buy you two more at the zoo.' },
    thirtyErm: { who: 'dudleyBig', text: 'So I’ll have thirty… thirty…' },
    thirtyEight: { who: 'petunia', text: 'Thirty-eight, Diddy.' },
    allRight: { who: 'dudleyBig', text: 'All right then.' },
    myBoy: { who: 'vernon', text: 'Ha! He wants his money’s worth. Just like his dad!' },
    badNews: { who: 'petunia', text: 'Oh, Vernon. Mrs Figg can’t have Harry today. He’ll have to come with us.' },
    notHim: { who: 'dudleyBig', text: 'Mu-um! I don’t want HIM to come!' },
    warning: { who: 'vernon', text: 'I’m warning you, boy. No funny business at the zoo. None!' },
    honestly: { who: 'harry', text: 'I won’t do anything. Honestly.' },
    hook: { who: 'narrator', text: 'But strange things had a way of happening around Harry.' },
    // 2. The reptile house
    zoo: { who: 'narrator', text: 'At the zoo, they went to the reptile house. Inside was the biggest snake of all.' },
    makeItMove: { who: 'dudleyBig', text: 'Make it move!' },
    wakeUp: { who: 'vernon', text: 'Oi! Snake! Wake up!' },
    boring: { who: 'dudleyBig', text: 'This is BORING.' },
    iceCream: { who: 'petunia', text: 'Let’s go and get you an ice cream, Diddy.' },
    sorry: { who: 'harry', text: 'Sorry about him. You must get fed up with people banging on your glass.' },
    didYouWink: { who: 'harry', text: 'Did you just… wink at me?' },
    yesss: { who: 'boa', text: 'Yesss. Hello!' },
    canTalk: { who: 'harry', text: 'You can talk! And I can understand you!' },
    readSign: { who: 'harry', text: 'Boa constrictor. Brazil. Is it nice in Brazil?' },
    neverBeen: { who: 'boa', text: 'I don’t know. I’ve never been. I was born here, in thisss tank.' },
    meNeither: { who: 'harry', text: 'I’ve never been anywhere either. I live in a cupboard.' },
    dream: { who: 'boa', text: 'In Brazil there is sssunshine. And big green treesss. And no glasss.' },
    wish: { who: 'harry', text: 'I wish you could go and see it.' },
    lookSnake: { who: 'dudleyBig', text: 'Mum! Dad! Come and look what the snake’s doing!' },
    // 3. The glass vanishes
    wishGone: { who: 'harry', text: 'I wish this glass would just… go.' },
    wet: { who: 'dudleyBig', text: 'AAARGH! It’s WET!' },
    thanks: { who: 'boa', text: 'Brazil, here I come! Thanksss, amigo!' },
    snake: { who: 'petunia', text: 'A SNAKE! Vernon, it’s LOOSE!' },
    run: { who: 'vernon', text: 'Everybody RUN!' },
    letMeOut: { who: 'dudleyBig', text: 'Mu-um! Let me OUT!' },
    giggle: { who: 'harry', text: 'Oh dear.' },
    boy: { who: 'vernon', text: 'BOY! What… did… you… DO?' },
    wasntMe: { who: 'harry', text: 'Nothing! The glass just went!' },
    // 4. The cupboard under the stairs
    cupboard: { who: 'vernon', text: 'Cupboard. NOW. And no more trips for you, boy!' },
    stillWet: { who: 'dudleyBig', text: 'I’m still wet, Mum.' },
    poorDiddy: { who: 'petunia', text: 'Poor Diddy-kins. Come and have some cake.' },
    smiling: { who: 'narrator', text: 'Harry was in his cupboard again. But he was smiling.' },
    talked: { who: 'harry', text: 'I talked to a snake. A real snake! And he said thank you.' },
    draw: { who: 'harry', text: 'I’ll draw a picture of him, so I never forget.' },
    goodLuck: { who: 'harry', text: 'Good luck, my friend. I hope you get to Brazil.' },
    farAway: { who: 'narrator', text: 'And far, far away, a big snake was on his way to Brazil.' },
    sunshine: { who: 'boa', text: 'Ahhh. Sssunshine!' },
  },
  scenes: [
    // ==================================================== 1. The birthday breakfast
    {
      name: 'The birthday breakfast',
      set(k) {
        k.backdrop('dursley-kitchen');
        k.music('cosy');
        cast.harry = k.character('harry', { x: 10, y: 390, w: 230, pose: 'muggle' });
        noWand(k, cast.harry);
        cast.pan = k.add(fryingPan(), { x: 150, y: 530, w: 190, z: 12 });
        cast.petunia = k.character('petunia', { x: 930, y: 420, w: 220, flip: true });
        cast.pile = k.prop('presentPile', { x: 600, y: 568, w: 220, z: 12 });
        cast.dudley = k.character('dudleyBig', { x: 570, y: 395, w: 250, z: 10 });
        cast.vernon = k.character('vernon', { x: 330, y: 395, w: 230, z: 13, flip: true });
        cast.hand = k.add(countingHand(), { x: 800, y: 440, w: 92, z: 14 });
        k.set([cast.dudley, cast.vernon, cast.hand], { opacity: 0 });
      },
      async play(k) {
        const { harry, petunia, dudley, vernon, pan, hand } = cast;
        await k.wait(400);
        await k.say('birthday');
        sizzle(1.2);
        await k.say('watchBacon', petunia);

        // Deed: Harry flips the bacon, up and back into the pan.
        await k.say('flip', harry);
        const [bacon] = k.pivot(k.part(pan, 'bacon'));
        k.sfx.whoosh();
        await k.to(bacon, 0.45, { y: -130, rotation: 360, ease: 'power2.out' });
        await k.to(bacon, 0.4, { y: 0, ease: 'power2.in' });
        k.set(bacon, { rotation: 0 });
        k.fx.pop();
        sizzle(1.4);
        k.flourish(harry);
        await k.pop(pan, 1.08);
        await k.wait(500);
        k.sfx.rustle();
        await k.vanish(pan, 0.3);

        // Dudley stomps in and sees the pile.
        k.fx.stomp(4, 0.3);
        k.quake(4);
        await k.enter(dudley, 'right', 1);
        await k.say('howMany', dudley);
        k.fx.patter(4);
        await k.enter(vernon, 'right', 0.9);
        await k.say('thirtySix', vernon);

        // The tantrum: thirty-seven last year!
        const [arm] = k.pivot(k.part(dudley, 'armR'));
        void k.to(k.part(dudley, 'cross'), 0.4, { opacity: 1 });
        void k.to(arm, 0.14, { rotation: -55, yoyo: true, repeat: 7 });
        await k.all(k.say('lastYear', dudley), k.shake(dudley, 6, 3));
        await k.to(arm, 0.2, { rotation: 0 });
        await k.say('twoMore', petunia);
        void k.to(k.part(dudley, 'cross'), 0.6, { opacity: 0 });

        // He counts on his fingers: thirty… thirty…
        await k.say('thirtyErm', dudley);
        k.set(hand, { opacity: 1 });
        k.fx.pop();
        for (let i = 1; i <= 5; i++) {
          tick();
          k.set(k.part(hand, `f${i}`), { opacity: 1 });
          await k.wait(520);
        }
        await k.blink(dudley);
        await k.wait(700);
        await k.all(k.say('thirtyEight', petunia), k.to(hand, 0.3, { opacity: 0 }));
        await k.say('allRight', dudley);
        await k.all(k.say('myBoy', vernon), k.shake(vernon, 4, 3));
        await k.say('badNews', petunia);
        await k.shake(dudley, 6, 2);
        await k.say('notHim', dudley);

        // The warning: Uncle Vernon leans over Harry and goes purple (a small scary beat).
        await k.walk(vernon, -90, 0.8, 3);
        k.fx.stomp(2, 0.3);
        await k.all(k.camera({ zoom: 1.5, x: 230, y: 430 }, 1), k.to(vernon, 0.8, { scale: 1.15 }));
        await k.all(k.say('warning', vernon), purple(k, vernon));
        await k.say('honestly', harry);
        await k.all(k.camera({}, 0.8), purple(k, vernon, false, 0.8), k.to(vernon, 0.8, { scale: 1 }));
        await k.say('hook');
      },
    },

    // ==================================================== 2. The reptile house
    {
      name: 'The reptile house',
      set(k) {
        k.backdrop('reptile-house');
        k.music('sneaky');
        cast.boa = k.character('boa', { x: 500, y: 210, w: 380, z: 11 });
        lids(k, cast.boa, true);
        void boaHead(k, cast.boa, 16, 0);
        cast.glass = k.prop('snakeGlass', { x: TANK.x, y: TANK.y, w: TANK.w, z: 13 });
        cast.petunia = k.character('petunia', { x: 30, y: 450, w: 200, z: 15 });
        cast.dudley = k.character('dudleyBig', { x: 250, y: 395, w: 250, z: 16 });
        cast.vernon = k.character('vernon', { x: 950, y: 430, w: 220, z: 15, flip: true });
        cast.harry = k.character('harry', { x: 900, y: 410, w: 210, z: 15, flip: true, pose: 'muggle' });
        noWand(k, cast.harry);
        k.set(cast.harry, { opacity: 0 });
      },
      async play(k) {
        const { harry, petunia, dudley, vernon, boa } = cast;
        await k.wait(400);
        await k.say('zoo');
        await k.say('makeItMove', dudley);
        await k.to(dudley, 0.3, { x: '+=14' });

        // Uncle Vernon bangs on the glass: the snake doesn't stir.
        await k.hop(vernon, 16, 1);
        k.fx.knock(3);
        await k.all(k.say('wakeUp', vernon), k.wait(300).then(() => k.shake(vernon, 4, 2)));
        snakeHiss(0.6);
        await k.to(boa, 0.5, { y: '+=5', yoyo: true, repeat: 1 });
        await k.say('boring', dudley);
        await k.say('iceCream', petunia);

        // They all go off left, Dudley first; Harry wanders in from the right.
        k.fx.stomp(4, 0.3);
        await k.exit(dudley, 'left', 0.9);
        k.fx.patter(5);
        await k.exit(petunia, 'left', 0.8);
        await k.exit(vernon, 'left', 1.6);
        await k.wait(600);
        k.music('dreamy');
        await k.enter(harry, 'right', 0.9);
        await k.say('sorry', harry);

        // The snake opens one eye… and WINKS.
        await k.wait(400);
        void boaHead(k, boa, 0, 0.7);
        lids(k, boa, false);
        await k.wait(500);
        await wink(k, boa);
        await k.say('didYouWink', harry);
        const talk = boaHead(k, boa, -6, 0.3);
        await k.all(k.say('yesss', boa), talk);
        await boaHead(k, boa, 0, 0.3);
        await k.say('canTalk', harry);

        // Harry leans to read the sign by the tank.
        await k.to(harry, 0.4, { x: '+=14', y: '-=22' });
        k.sfx.page();
        await k.say('readSign', harry);
        await k.to(harry, 0.4, { x: 0, y: 0 });
        void boaHead(k, boa, 18, 1.2);
        await k.say('neverBeen', boa);
        await k.say('meNeither', harry);
        await boaHead(k, boa, -4, 0.6);
        await k.say('dream', boa);
        await k.say('wish', harry);
        k.silence();

        // Hook: Dudley bursts back in.
        k.fx.stomp(4, 0.3);
        k.quake(4);
        await k.enter(dudley, 'left', 0.8);
        await k.all(k.say('lookSnake', dudley), k.to(dudley, 0.3, { x: '+=20' }));
      },
    },

    // ==================================================== 3. The glass vanishes
    {
      name: 'The glass vanishes',
      set(k) {
        k.backdrop('reptile-house');
        k.music('adventure');
        cast.boa = k.character('boa', { x: 500, y: 210, w: 380, z: 11 });
        cast.glass = k.prop('snakeGlass', { x: TANK.x, y: TANK.y, w: TANK.w, z: 13 });
        cast.water = k.add(sittingWater(), { x: 400, y: 500, w: 320, z: 12 });
        k.set(cast.water, { opacity: 0 });
        cast.dudley = k.character('dudleyBig', { x: 270, y: 395, w: 250, z: 16 });
        cast.harry = k.character('harry', { x: 900, y: 410, w: 210, z: 18, flip: true, pose: 'muggle' });
        noWand(k, cast.harry);
        cast.petunia = k.character('petunia', { x: 40, y: 450, w: 200, z: 15 });
        cast.vernon = k.character('vernon', { x: 230, y: 430, w: 230, z: 15 });
        k.set([cast.petunia, cast.vernon], { opacity: 0 });
      },
      async play(k) {
        const { harry, petunia, dudley, vernon, boa, glass, water } = cast;
        await k.wait(500);

        // The big deed: Harry puts his hand on the glass and wishes it gone.
        await k.to(harry, 0.4, { x: '-=14', rotation: -6 });
        k.sfx.tap();
        await k.say('wishGone', harry);
        await k.wait(400);
        k.fx.twinkle();
        shimmer();
        void k.glow('#bfe8ff', 0.35, 1.4);
        k.sparkle(640, 380, 18, 260);
        await k.fade(glass, 0, 1.4);
        k.flourish(harry);
        await k.to(harry, 0.3, { x: 0, rotation: 0 });
        await k.wait(600);

        // Dudley, leaning on nothing, topples forward into the pool.
        await k.to(dudley, 0.4, { rotation: 10, x: '+=12' });
        k.fx.uhoh();
        await k.to(dudley, 0.5, { rotation: 40, x: '+=100', y: '-=30', ease: 'power1.in' });
        k.set(dudley, { zIndex: 11 });
        await k.to(dudley, 0.3, { rotation: 0, x: 150, y: -98, scale: 0.8, ease: 'power2.in' });
        k.fx.splash();
        k.quake(5);
        k.puff(POOL[0], POOL[1], 200, '#9fd0e8');
        k.set(water, { opacity: 1 });
        await k.pop(dudley, 0.9);
        await k.wait(400);
        await k.all(k.say('wet', dudley), k.shake(dudley, 6, 3));

        // The snake slithers out past them, stops by Harry and thanks him.
        await k.to(harry, 0.4, { x: '+=60' });
        k.set(boa, { zIndex: 17 });
        slither(1.6);
        await k.all(k.to(boa, 1.4, { x: '+=100', y: '+=70' }), k.to(boa, 0.35, { rotation: 3, yoyo: true, repeat: 3 }));
        void boaHead(k, boa, -6, 0.4);
        await k.say('thanks', boa);
        await wink(k, boa);
        slither(1.6);
        void k.to(boa, 0.35, { rotation: -3, yoyo: true, repeat: 5 });
        await k.to(boa, 1.9, { x: '+=800', ease: 'power1.in' });
        k.remove(boa);

        // Petunia screams, Vernon runs on the spot.
        k.fx.patter(4);
        await k.all(k.enter(petunia, 'left', 0.7), k.wait(200).then(() => k.enter(vernon, 'left', 0.8)));
        await k.all(k.say('snake', petunia), k.shake(petunia, 6, 3));
        k.fx.patter(10);
        await k.all(k.say('run', vernon), k.hop(petunia, 22, 4));
        await k.hop(vernon, 20, 4);
        await k.wait(700);

        // Then, quietly, the glass is back, with Dudley inside.
        k.fx.twinkle();
        shimmer();
        await k.fade(glass, 1, 1.4);
        await k.wait(800);
        await k.shake(vernon, 5, 2);
        k.fx.knock(4);
        await k.all(k.say('letMeOut', dudley), k.shake(dudley, 5, 4));
        giggle();
        await k.shake(harry, 3, 5);
        await k.say('giggle', harry);

        // The small scary beat: Uncle Vernon turns slowly, purple, and the camera comes in.
        k.silence();
        k.sfx.ominous();
        await k.wait(500);
        k.fx.stomp(5, 0.35);
        await k.walk(vernon, 470, 2.4, 6);
        await k.all(k.camera({ zoom: 1.5, x: 800, y: 470 }, 1.2), purple(k, vernon, true, 1.2), k.to(vernon, 1.2, { scale: 1.12 }));
        await k.say('boy', vernon);
        await k.wait(400);
        await k.all(k.camera({}, 0.8), purple(k, vernon, false, 1), k.to(vernon, 1, { scale: 1 }));
        k.music('cosy');
        await k.say('wasntMe', harry);
      },
    },

    // ==================================================== 4. The cupboard under the stairs
    {
      name: 'The cupboard under the stairs',
      set(k) {
        k.backdrop('dursley-hall');
        k.music('cosy');
        cast.cupboard = k.add(openCupboard(), { x: 772, y: 410, w: 150, z: 3 });
        cast.dudley = k.character('dudleyBig', { x: 70, y: 395, w: 230, z: 10 });
        cast.towel = k.add(towel(), { x: 150, y: 560, w: 110, z: 14 });
        k.set(cast.towel, { opacity: 0 });
        cast.petunia = k.character('petunia', { x: 270, y: 440, w: 190, z: 11 });
        cast.vernon = k.character('vernon', { x: 430, y: 385, w: 240, z: 12, flip: false });
        cast.harry = k.character('harry', { x: 660, y: 440, w: 190, z: 10, pose: 'muggle' });
        noWand(k, cast.harry);
        cast.glow = k.light(841, 545, 130, { color: '#ffd88a', strength: 0.5 });
        k.set(cast.glow, { opacity: 0 });
      },
      async play(k) {
        const { harry, petunia, dudley, vernon, towel: tw, glow } = cast;
        await k.wait(500);

        // Uncle Vernon sends him to the cupboard; Harry goes in.
        await k.all(k.say('cupboard', vernon), purple(k, vernon, true, 0.5));
        k.fx.creak();
        await k.walk(harry, 60, 0.7, 2);
        await k.to(harry, 0.7, { x: 86, y: 0, scale: 0.72 });
        await purple(k, vernon, false, 0.8);

        // Poor wet Diddy-kins is dried and offered cake.
        await k.say('stillWet', dudley);
        k.sfx.rustle();
        await k.appear(tw, 0.4);
        await k.all(k.say('poorDiddy', petunia), k.shake(tw, 6, 4));
        await k.vanish(tw, 0.3);

        // The Dursleys go, and the hall door shuts.
        k.fx.patter(5);
        await k.all(k.exit(dudley, 'left', 1), k.wait(250).then(() => k.exit(petunia, 'left', 0.9)));
        await k.exit(vernon, 'left', 1.1);
        slam();
        k.quake(3);
        k.silence();
        await k.wait(900);

        // Harry alone in the cupboard light.
        k.music('dreamy');
        await k.all(k.camera({ zoom: 1.9, x: 841, y: 520 }, 1.4), k.fade(glow, 0.5, 1.4));
        await k.say('smiling');
        await k.say('talked', harry);

        // The warm deed: he draws his friend and pins the picture to the wall.
        await k.say('draw', harry);
        const picture = k.add(snakeDrawing(), { x: 810, y: 566, w: 56, z: 14 });
        k.set(picture, { opacity: 0 });
        k.sfx.rustle();
        await k.appear(picture, 0.4);
        for (const part of ['s1', 's2', 's3', 's4']) {
          scribble();
          await k.to(k.part(picture, part), 0.5, { opacity: 1 });
          await k.wait(150);
        }
        await k.carry(picture, [826, 462], 1.1);
        k.sfx.tap();
        await k.pop(picture, 1.1);
        await k.wait(500);
        await wave(k, harry, 1);
        await k.say('goodLuck', harry);
        await k.wait(600);

        // Far, far away.
        await k.all(k.camera({}, 0.8), k.fade(glow, 0, 0.8));
        const far = await meanwhile(k, {
          build: () => {
            k.backdrop('paper');
            const sunEl = k.add(sun(), { x: 800, y: 40, w: 250, z: 2 });
            const road = k.add(sand(), { x: 0, y: 540, w: 1180, z: 3 });
            const boa = k.character('boa', { x: 400, y: 230, w: 400, z: 11 });
            lids(k, boa, true);
            void boaHead(k, boa, -10, 0);
            return { sunEl, road, boa };
          },
          line: 'farAway',
          music: 'dreamy',
        });
        const [rays] = k.pivot(k.part(far.sunEl, 'rays'));
        void k.to(rays, 8, { rotation: 40, ease: 'none' });
        await k.wait(500);
        await k.say('sunshine', far.boa);
        lids(k, far.boa, false);
        await k.wait(400);
        await wink(k, far.boa);
        k.sparkle(640, 400, 14, 200);
        await k.wait(1800);
      },
    },
  ],
});
