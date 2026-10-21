/**
 * The Mysterious Letter: Hedwig brings Harry a letter with no name and no
 * words, and it leads to a surprise.
 *
 *   1. The common room. Harry and Hermione by the fire at night. Tap, tap at
 *      the window: Hedwig swoops in and drops a letter. No name on it, and
 *      inside, nothing at all. Hermione: it's invisible ink! His first turn:
 *      he taps the letter and the words come back: "Come to the forest at
 *      moonrise. Bring Hedwig. It's a surprise!" Harry is a bit scared;
 *      Hermione says they'll be brave together, and Hedwig leads the way.
 *   2. Moonrise. They creep out across the grounds under the moon, guessing
 *      who sent it. Hedwig flies on into the Forbidden Forest. His turn: he
 *      taps the tip of Harry's wand and "Lumos!" lights it up. Hook: deep in the trees, something was
 *      waiting.
 *   3. The Forbidden Forest. Hedwig's urgent double hoot, the trees creak, a
 *      long soft hiss, and Voldemort looms out of the dark: what is in that
 *      letter? He wants ALL their secrets. Back to the heroes: Harry isn't
 *      scared of him. Voldemort lifts his wand to the sky; Hermione says
 *      Expelliarmus. His big turn: he taps Harry's wand, the spell flies, and
 *      Voldemort's wand spins away out of his hand. It's not a secret, it's a
 *      surprise, maybe a party. "A PARTY? Bah! I HATE parties!" He melts away
 *      in a huff. A warm light through the trees: Hagrid's hut.
 *   4. Hagrid's hut. "SURPRISE! Happy birthday, Hedwig!" Hagrid sent the
 *      letter: a year ago he gave Hedwig to Harry, so today she gets a cake,
 *      and she carried her own party invitation. A rock cake (crunch!);
 *      Hedwig has the very first slice of birthday cake, then a slice for
 *      him, and it's her best birthday ever. Two drags here: he drags
 *      Hagrid's rock cake across the table to Hermione, then the first slice
 *      of birthday cake to Hedwig.
 *
 * Scary, never cruel (docs/STYLE.md): Voldemort looms and hisses and wants
 * the letter; nobody is touched, and his wand is only ever lifted to the
 * sky. Expelliarmus is aimed at his wand, an object, and the wand simply
 * flies out of his hand. His defeat is his own grumpiness: a party is the
 * last thing he wants.
 *
 * The owl post, Voldemort's loom and retreat, the sneaking in and the warm
 * ending are the worlds' set pieces (src/worlds/hogwarts/pieces.ts,
 * common/pieces.ts); the round table is the Faraway tea table, borrowed.
 * The open letter with its hidden ink, the rock cake and the slice of cake
 * are drawn here.
 */
import { C, cached, defineCartoon, ellipse, group, noiseBurst, now, piece, poly, raw, rect, svg, type Kit, type Node } from '../../kit';
import { sounds as commonSounds } from '../../worlds/common/moves';
import { centreOf, sneakIn, warmEnding } from '../../worlds/common/pieces';
import { teaTable } from '../../worlds/faraway/pieces';
import { moves as hogMoves, sounds as hogSounds } from '../../worlds/hogwarts/moves';
import { owlPost, voldemortLoom } from '../../worlds/hogwarts/pieces';
import meta from './meta';

const { bellyLaugh, doubleHoot, fireCrackle } = hogSounds;
const { castSpell, flap, flyOff, hoot, swishCloak, swoopIn } = hogMoves;
const { laugh } = commonSounds;

// ------------------------------------------------------------------- art

/** A line of Andika in ink, for the letter. */
const write = (x: number, y: number, s: string, size: number): Node =>
  raw(`<text x="${x}" y="${y}" font-family="Andika, sans-serif" font-weight="700" font-size="${size}" fill="${C.ink}" text-anchor="middle">${s}</text>`);

/**
 * The open letter (360 × 260): a sheet of parchment with a muddy smudge in
 * the corner (a clue for grown-ups: Hagrid's thumb). The words are the part
 * `ink`, hidden until his tap brings them back.
 */
const openLetter = cached(() =>
  svg({ w: 360, h: 260, name: 'mysterious-letter-letter', label: 'The letter' }, [
    piece(rect(8, 8, 344, 244, 6), '#e6d3a4'),
    piece(rect(22, 22, 316, 216, 4), C.cream, { edge: 'cut', fibre: false, opacity: 0.6, shadow: false }),
    piece(ellipse(312, 214, 18, 14), '#7a5a3a', { edge: 'cut', fibre: false, opacity: 0.55, shadow: false }),
    group({ part: 'ink' }, [
      write(180, 74, 'Come to the forest', 30),
      write(180, 112, 'at moonrise.', 30),
      write(180, 160, 'Bring Hedwig!', 30),
      write(180, 204, 'It’s a surprise!', 26),
    ]),
  ]),
);

/** Hagrid's rock cake (80 × 64): a lumpy grey-brown bun, hard as a stone. */
const rockCake = cached(() =>
  svg({ w: 80, h: 64, name: 'mysterious-letter-rock-cake', label: 'A rock cake' }, [
    piece(poly([[8, 50], [14, 22], [32, 10], [52, 12], [70, 26], [74, 50], [56, 58], [24, 58]]), '#8a7a64'),
    piece(ellipse(30, 28, 6, 5), '#5a4a3a', { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(52, 36, 5, 4), '#5a4a3a', { edge: 'cut', fibre: false, shadow: false }),
    piece(ellipse(38, 46, 4, 3), '#5a4a3a', { edge: 'cut', fibre: false, shadow: false }),
  ]),
);

/** A slice of the birthday cake (100 × 80): pink icing on a yellow sponge. */
const cakeSlice = cached(() =>
  svg({ w: 100, h: 80, name: 'mysterious-letter-slice', label: 'A slice of cake' }, [
    piece(poly([[8, 66], [88, 66], [88, 30], [8, 46]]), C.goldLight),
    piece(poly([[6, 46], [90, 28], [92, 38], [8, 54]]), C.pink),
    piece(rect(40, 6, 8, 26, 2), C.cream, { edge: 'cut' }),
    piece(ellipse(44, 6, 5, 7), C.candle, { edge: 'cut', fibre: false }),
  ]),
);

/** Hagrid's window far off through the trees (60 × 54): a warm lit square with a cross of bars. */
const hutWindow = cached(() =>
  svg({ w: 60, h: 54, name: 'mysterious-letter-hut-window', label: 'A lit window' }, [
    piece(rect(2, 2, 56, 50, 4), '#3a2a20', { shadow: false }),
    piece(rect(8, 8, 44, 38, 2), C.candle, { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(28, 8, 4, 38), '#3a2a20', { edge: 'cut', fibre: false, shadow: false }),
    piece(rect(8, 25, 44, 4), '#3a2a20', { edge: 'cut', fibre: false, shadow: false }),
  ]),
);

/** An empty box over Harry's wand: something for the his-turn ring to sit on (nothing drawn). */
const wandSpot = cached(() => svg({ w: 110, h: 140, name: 'mysterious-letter-wand-spot' }, []));

// ---------------------------------------------------------------- sounds

/** A gasp: the mouth falls open and stays open (the next line they say shuts it again). */
function gasp<K extends string>(k: Kit<K>, el: HTMLElement): void {
  k.part(el, 'mouthOpen').forEach((m) => (m.style.opacity = '1'));
  k.part(el, 'mouth').forEach((m) => (m.style.opacity = '0'));
}

/** Biting a rock cake: three dry crunches. */
function crunch(): void {
  const t = now();
  for (let i = 0; i < 3; i++) noiseBurst(t + i * 0.14, { freq: 1100 - i * 150, q: 1.4, peak: 0.12, decay: 0.07 });
}

// ------------------------------------------------------------------ cast

const cast = {} as Record<'harry' | 'hermione' | 'hedwig' | 'voldemort' | 'hagrid' | 'letter' | 'envelope' | 'wandLight' | 'cake', HTMLElement>;
/** Scene 1's owl post: Hedwig and the envelope. */
let post: ReturnType<typeof owlPost.set>;

/** Harry's wand tip in the forest (his wand is part of his portrait: hand at 232,318 and tip at 248,198 in its 300 × 340 box). */
const HARRY_FOREST = { x: 330, y: 385, w: 240 };
const wandTip = (p: { x: number; y: number; w: number }): [number, number] => [p.x + 248 * (p.w / 300), p.y + 198 * (p.w / 300)];

/**
 * Voldemort in the forest, facing left (flipped). He looms in the tall `loom`
 * pose; his plain portrait (the one with the wand) is shorter, so it stands
 * DROP lower to keep its bottom edge on the forest floor, and he lifts it by
 * LIFT. V_WAND is the middle of his wand then.
 */
const VOLDEMORT = { x: 740, y: 250, w: 300 };
const DROP = 76;
const LIFT = 16;
const V_WAND: [number, number] = [VOLDEMORT.x + (300 - 242), VOLDEMORT.y + DROP - LIFT + 258];

/** Lumos: a small pale light on the tip of the wand, fading up gently. */
function lumos<K extends string>(k: Kit<K>, at: [number, number], instant = false): HTMLElement {
  const glow = k.light(at[0], at[1], 70, { color: '#fff4c8', strength: 0.7 });
  if (!instant) {
    k.set(glow, { opacity: 0 });
    void k.to(glow, 0.8, { opacity: 0.7 });
  }
  return glow;
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. The common room
    hello: { who: 'harry', text: 'Hello, {name}! It’s so cosy by the fire tonight.' },
    cosy: { who: 'hermione', text: 'Cosy and quiet. Perfect for reading my book!' },
    hedwigLetter: { who: 'harry', text: 'Look! It’s Hedwig! She’s brought me a letter!' },
    noName: { who: 'hermione', text: 'But who is it from? There’s no name on it.' },
    empty: { who: 'harry', text: 'That’s funny. There’s nothing written inside at all!' },
    invisible: { who: 'hermione', text: 'Actually, I read about this. It’s invisible ink!' },
    askInk: { who: 'hermione', text: 'Tap the letter, {name}, and the words will come back!' },
    nudgeInk: { who: 'hermione', text: 'Just tap the letter. Go on!' },
    helpedInk: { who: 'hermione', text: 'I’ll give it a tap with my wand.' },
    wordsBack: { who: 'hermione', text: 'There! The words are coming back!' },
    readLetter: { who: 'harry', text: '“Come to the forest at moonrise. Bring Hedwig. It’s a surprise!”' },
    scared: { who: 'harry', text: 'The forest? At night? What if it’s something scary?' },
    together: { who: 'hermione', text: 'Then we’ll be brave together. Look, Hedwig wants to show us the way!' },
    // 2. Moonrise
    crept: { who: 'narrator', text: 'So out they crept across the grounds, under the moon.' },
    whoSent: { who: 'harry', text: 'Who do you think sent it, Hermione?' },
    guess: { who: 'hermione', text: 'Someone who knows Hedwig very well. Look how she leads the way!' },
    edge: { who: 'harry', text: 'She’s flying into the Forbidden Forest. It’s so dark in there!' },
    needLight: { who: 'hermione', text: 'Then we need some light. Go on, Harry.' },
    askLumos: { who: 'hermione', text: 'Tap the tip of his wand, and he’ll make a light!' },
    nudgeLumos: { who: 'hermione', text: 'Just tap his wand. Go on!' },
    helpedLumos: { who: 'harry', text: 'Here I go, then.' },
    lumos: { who: 'harry', text: 'Lumos!' },
    thanksLumos: { who: 'hermione', text: 'Oh, that’s much better. Thank you!' },
    waiting: { who: 'narrator', text: 'And deep in the trees, something was waiting.' },
    // 3. The Forbidden Forest
    creak: { who: 'narrator', text: 'The trees creaked. The wind went cold. Then came a long, soft hiss.' },
    whatsInLetter: { who: 'voldemort', text: 'Haaarry Potter. What is in that letter?' },
    secrets: { who: 'voldemort', text: 'Give it to me. I want ALL your secrets!' },
    notScared: { who: 'harry', text: 'No! It’s not yours. And we’re not scared of you!' },
    idea: { who: 'hermione', text: 'Harry, Expelliarmus! Make his wand fly away!' },
    askWand: { who: 'harry', text: 'Help me, {name}! Tap my wand!' },
    nudgeWand: { who: 'harry', text: 'Tap my wand, and I’ll cast the spell!' },
    countThree: { who: 'hermione', text: 'Together, Harry! One, two, three!' },
    expelliarmus: { who: 'harry', text: 'Expelliarmus!' },
    myWand: { who: 'voldemort', text: 'My WAND! Where has it gone?' },
    surprise: { who: 'hermione', text: 'It’s not a secret. It’s a surprise! Maybe even a party!' },
    hateParties: { who: 'voldemort', text: 'A PARTY? Ugh! I HATE parties!' },
    youDidIt: { who: 'harry', text: 'You did it, {name}! He’s gone!' },
    weDidIt: { who: 'harry', text: 'We did it! He’s gone!' },
    hagridsLight: { who: 'hermione', text: 'Look, a light in the trees! It’s Hagrid’s hut!' },
    // 4. Hagrid's hut
    surpriseHagrid: { who: 'hagrid', text: 'SURPRISE! Happy birthday, Hedwig!' },
    yourLetter: { who: 'harry', text: 'It’s Hedwig’s birthday? Hagrid, did YOU send the letter?' },
    oneYear: { who: 'hagrid', text: 'I did! It’s her birthday today. A year ago I gave her to yeh!' },
    ownInvite: { who: 'hermione', text: 'So Hedwig carried her OWN party invitation?' },
    bestOwl: { who: 'hagrid', text: 'Who better? She’s the best owl in the world!' },
    rockCake: { who: 'hagrid', text: 'Rock cake, anyone? Made ’em meself!' },
    askRock: { who: 'hagrid', text: 'Drag the rock cake over to Hermione!' },
    nudgeRock: { who: 'hagrid', text: 'Just drag it across the table.' },
    helpedRock: { who: 'hagrid', text: 'Here, Hermione. Have one!' },
    thanksRock: { who: 'hagrid', text: 'Ha! Cheers! Go on, Hermione, try it.' },
    crunch: { who: 'hermione', text: 'Er… I think I’ll have birthday cake, please.' },
    askSlice: { who: 'harry', text: 'The first slice is for Hedwig. Can you drag it to her?' },
    nudgeSlice: { who: 'harry', text: 'Drag the cake over to Hedwig!' },
    helpedSlice: { who: 'harry', text: 'I’ll pass it along to her.' },
    thanksSlice: { who: 'hermione', text: 'Well done! Look how happy she is!' },
    slice: { who: 'harry', text: 'And a slice for {name}, for being so brave!' },
    end: { who: 'narrator', text: 'And that was Hedwig’s best birthday ever.' },
  },
  scenes: [
    // ==================================================== 1. The common room
    {
      name: 'The common room',
      set(k) {
        k.backdrop('common-room');
        k.music('cosy');
        // The fire in the hearth, and its glow on the room.
        k.prop('flame', { x: 560, y: 450, w: 120, z: 2 });
        k.light(620, 520, 150, { strength: 0.35, flicker: true, z: 5 });
        cast.harry = k.character('harry', { x: 190, y: 400, w: 250 });
        cast.hermione = k.character('hermione', { x: 830, y: 400, w: 250, flip: true });
        k.prop('spellbook', { x: 880, y: 560, w: 120, z: 12 });
        // Hedwig comes in by the window, on the left.
        post = owlPost.set(k, { to: cast.harry, from: 'left' });
        cast.hedwig = post.owl;
        // The open letter is a close-up over the room (above the veil that dims it), so it sits above the lights.
        cast.letter = k.add(openLetter(), { x: 410, y: 150, w: 360, z: 38 });
        k.set(cast.letter, { opacity: 0 });
        k.set(k.part(cast.letter, 'ink'), { opacity: 0 });
      },
      async play(k) {
        const { harry, hermione, hedwig, letter } = cast;
        fireCrackle(5);
        await k.wait(400);
        await k.all(k.say('hello', harry), k.wait(200).then(() => k.blink(harry)));
        await k.say('cosy', hermione);

        // Tap, tap at the window: Hedwig, with a letter.
        k.fx.knock(2);
        await k.wait(700);
        await owlPost.play(k, post, { stay: true });
        k.float(hedwig, 6, 2.2);
        // He picks it up and holds it out where everyone can see it.
        k.sfx.page();
        await k.to(post.letter, 0.6, { x: '+=190', y: '-=20', scale: 1.6, rotation: 0 });
        await k.all(k.say('hedwigLetter', harry), k.hop(hermione, 20));
        await k.say('noName', hermione);

        // He opens it: the seal pops, the room dims, and the letter is blank.
        const [ex, ey] = centreOf(post.letter);
        k.sfx.page();
        k.sparkle(ex, ey, 8, 80);
        await k.vanish(post.letter, 0.3);
        const veil = k.dim(0, '#1a1020');
        void k.fade(veil, 0.4, 0.5);
        await k.appear(letter, 0.5);
        await k.say('empty', harry);
        await k.all(k.say('invisible', hermione), k.hop(hermione, 24));

        // His first turn: tap the letter and the ink comes back.
        const how = await k.tapToHelp(letter, { ask: 'askInk', nudge: 'nudgeInk', helped: 'helpedInk', by: hermione });
        if (how === 'helped') await castSpell(k, hermione, [590, 280]);
        k.fx.twinkle();
        k.sparkle(590, 280, 16, 260);
        await k.to(k.part(letter, 'ink'), 1.4, { opacity: 1, ease: 'sine.inOut' });
        await k.say('wordsBack', hermione);
        await k.say('readLetter', harry);
        k.sfx.page();
        void k.fade(veil, 0, 0.5);
        await k.vanish(letter, 0.4);

        // A forest at night! But Hedwig knows the way.
        await k.all(k.say('scared', harry), k.shake(harry, 4, 2));
        doubleHoot();
        await flap(k, hedwig, 3);
        await k.say('together', hermione);
        await flyOff(k, hedwig, 'left', 1);
      },
    },

    // ==================================================== 2. Moonrise
    {
      name: 'Moonrise',
      set(k) {
        k.backdrop('castle-grounds');
        k.music('sneaky');
        k.dim(0.3);
        cast.hermione = k.character('hermione', { x: 600, y: 385, w: 230 });
        cast.harry = k.character('harry', { x: 840, y: 385, w: 230 });
        cast.hedwig = k.character('hedwig', { x: 880, y: 80, w: 180, z: 20, pose: 'fly' });
        k.set(cast.hedwig, { opacity: 0 });
        sneakIn.set(k, [cast.hermione, cast.harry], { distance: 1100 });
      },
      async play(k) {
        const { harry, hermione, hedwig } = cast;
        // Out they creep, under the moon, with Hedwig flying over the trees ahead of them.
        await k.all(k.say('crept'), k.wait(600).then(() => sneakIn.play(k, { walkers: [hermione, harry], distance: 1100, seconds: 2.4, hops: 8 })));
        k.set(hedwig, { opacity: 1 });
        await swoopIn(k, hedwig, 'right', 1.2);
        await hoot(k, hedwig, 1);
        k.face(harry, true);
        await k.say('whoSent', harry);
        await k.say('guess', hermione);

        // Off she flies, over their heads to the pines: the Forbidden Forest.
        await flyOff(k, hedwig, 'left', 1.4);
        await k.all(k.say('edge', harry), k.shake(harry, 3, 2));
        await k.say('needLight', hermione);
        // His turn: tap the tip of Harry's wand and it lights up (the wand faces left here).
        const lx = 840 + 52 * (230 / 300);
        const ly = 385 + 198 * (230 / 300);
        const lspot = k.add(wandSpot(), { x: lx - 55, y: ly - 40, w: 110, h: 140, z: 29 });
        const lhow = await k.tapToHelp(lspot, { ask: 'askLumos', nudge: 'nudgeLumos', helped: 'helpedLumos', by: hermione, helper: harry, size: 150 });
        k.remove(lspot);

        // Lumos: the tip of his wand lights up.
        await k.all(k.say('lumos', harry), k.wait(300).then(() => castSpell(k, harry)));
        k.fx.twinkle();
        // Facing left, his wand is on his left side: its tip at x + (300 − 248) of his 300-wide box.
        lumos(k, [lx, ly]);
        await k.wait(700);
        if (lhow === 'tapped') await k.say('thanksLumos', hermione);

        // Something in the trees.
        k.silence();
        k.sfx.ominous();
        await k.wait(500);
        await k.say('waiting');
      },
    },

    // ==================================================== 3. The Forbidden Forest
    {
      name: 'The Forbidden Forest',
      set(k) {
        k.backdrop('forbidden-forest');
        k.music('sneaky');
        k.dim(0.15);
        cast.hermione = k.character('hermione', { x: 110, y: 390, w: 240 });
        cast.harry = k.character('harry', { ...HARRY_FOREST, z: 11 });
        // Hedwig hovers over them, keeping watch.
        cast.hedwig = k.character('hedwig', { x: 40, y: 110, w: 170, z: 12, pose: 'fly' });
        k.float(cast.hedwig, 7, 2.2);
        cast.wandLight = lumos(k, wandTip(HARRY_FOREST), true);
        // The letter, in Harry's other hand: what Voldemort wants.
        cast.envelope = k.prop('owlPostLetter', { x: 330, y: 560, w: 100, z: 13 });
        cast.voldemort = voldemortLoom.set(k, { ...VOLDEMORT, flip: true });
      },
      async play(k) {
        const { harry, hermione, hedwig, voldemort, envelope } = cast;
        await k.wait(600);
        // Hedwig's urgent double hoot: look out!
        doubleHoot();
        await k.all(flap(k, hedwig, 2), k.shake(hedwig, 4, 2));

        // The creak, the cold, the hiss, and he looms out of the dark.
        await voldemortLoom.approach(k, { line: 'creak', trembling: [harry, hermione] });
        // They gasp and step back as he rises.
        gasp(k, harry);
        gasp(k, hermione);
        void k.to([harry, hermione, envelope], 0.5, { x: -18 });
        await voldemortLoom.loom(k, voldemort, { lines: ['whatsInLetter', 'secrets'], frighten: [harry, hermione] });
        // Back to the heroes: Harry steps up again and holds the letter tight.
        await voldemortLoom.cutBack(k, {
          line: 'notScared',
          by: harry,
          before: () => k.all(k.to([harry, hermione, envelope], 0.4, { x: 0 }), k.to(envelope, 0.4, { y: -30 })),
        });

        // A swirl of his cloak (and a puff of dark smoke), and he lifts his wand to the sky.
        k.puff(890, 570, 220, '#2a2633');
        await k.wait(150);
        k.pose(voldemort, 'default');
        k.set(voldemort, { y: DROP });
        k.sfx.ominous();
        await k.all(swishCloak(k, voldemort), k.to(voldemort, 0.6, { y: DROP - LIFT }));
        await k.say('idea', hermione);

        // His big turn: tap Harry's wand.
        const [tx, ty] = wandTip(HARRY_FOREST);
        const spot = k.add(wandSpot(), { x: tx - 55, y: ty - 30, w: 110, h: 140, z: 29 });
        const how = await k.tapToHelp(spot, { ask: 'askWand', nudge: 'nudgeWand', helped: 'countThree', by: harry, helper: hermione, size: 150 });
        k.remove(spot);

        // Expelliarmus: the spell flies to his wand, and the wand spins away out of his hand.
        await k.all(
          k.say('expelliarmus', harry),
          (async () => {
            await k.wait(250);
            void castSpell(k, harry);
            await k.beam([tx, ty], V_WAND, C.goldLight, 0.4);
          })(),
        );
        const wand = k.pivot(k.part(voldemort, 'wand'));
        k.fx.whizz();
        await k.all(k.to(wand, 1, { y: -1000, rotation: 540, opacity: 0, ease: 'power2.in' }), k.shake(voldemort, 6, 2));
        await k.say('myWand', voldemort);

        // It's not a secret: it's a surprise. He hates parties.
        await k.all(k.say('surprise', hermione), k.hop(hermione, 20));
        await voldemortLoom.retreat(k, voldemort, { line: 'hateParties' });

        // Hooray!
        k.music('triumph');
        k.sparkle(590, 300, 16, 220);
        await k.all(k.say(how === 'tapped' ? 'youDidIt' : 'weDidIt', harry), k.hop(hermione, 30, 2), hoot(k, hedwig, 2));

        // A warm lit window through the trees: Hagrid's hut.
        const win = k.add(hutWindow(), { x: 1040, y: 440, w: 60, z: 3 });
        const hut = k.light(1070, 467, 110, { strength: 0.6 });
        k.set([win, hut], { opacity: 0 });
        await k.all(k.to(hut, 1.2, { opacity: 0.6 }), k.to(win, 1.2, { opacity: 1 }));
        await k.say('hagridsLight', hermione);
        await flyOff(k, hedwig, 'right', 1.2);
      },
    },

    // ==================================================== 4. Hagrid's hut
    {
      name: 'Hagrid’s hut',
      set(k) {
        k.backdrop('hagrids-hut');
        k.music('cosy');
        // A fire in the hearth, the round table in front of it with the birthday cake, and Hedwig beside it.
        // (the fire to the right of the hearth, so the cake's candles stand clear of the flames)
        k.prop('flame', { x: 545, y: 420, w: 110, z: 2 });
        k.light(590, 480, 150, { strength: 0.4, flicker: true, z: 5 });
        k.add(teaTable('mysterious-letter-table'), { x: 380, y: 545, w: 320, z: 14 });
        cast.cake = k.prop('birthdayCake', { x: 395, y: 432, w: 150, z: 15 });
        cast.hagrid = k.character('hagrid', { x: 780, y: 232, w: 380, flip: true });
        cast.hedwig = k.character('hedwig', { x: 580, y: 462, w: 115, z: 16 });
        cast.harry = k.character('harry', { x: 40, y: 370, w: 250, z: 11 });
        cast.hermione = k.character('hermione', { x: 220, y: 378, w: 240 });
        k.set([cast.harry, cast.hermione], { opacity: 0 });
      },
      async play(k) {
        const { harry, hermione, hagrid, hedwig, cake } = cast;
        fireCrackle(4);
        // Knock, knock. In they come.
        k.fx.knock(3);
        await k.wait(800);
        k.fx.creak();
        k.set([harry, hermione], { opacity: 1 });
        await k.enter(hermione, 'left', 0.8);
        await k.enter(harry, 'left', 0.8);

        // SURPRISE!
        k.music('triumph');
        k.confetti(24);
        k.sparkle(540, 400, 14, 200);
        await k.say('surpriseHagrid', hagrid);
        await k.all(hoot(k, hedwig, 2), k.hop(hedwig, 24));
        await k.all(k.say('yourLetter', harry), k.hop(harry, 20));
        await k.say('oneYear', hagrid);
        bellyLaugh();
        await k.shake(hagrid, 4, 3);
        await k.say('ownInvite', hermione);
        await k.say('bestOwl', hagrid);
        await k.all(hoot(k, hedwig, 1), flap(k, hedwig, 3));

        // A rock cake, set down on the table in front of Hermione. She tries it: crunch.
        k.music('cosy');
        await k.say('rockCake', hagrid);
        const rock = k.add(rockCake(), { x: 705, y: 500, w: 110, z: 17 });
        k.set(rock, { opacity: 0 });
        k.fx.pop();
        await k.appear(rock, 0.3);
        // His turn: drag the rock cake across the table to Hermione.
        const rhow = await k.dragToHelp(rock, { to: hermione, ask: 'askRock', nudge: 'nudgeRock', helped: 'helpedRock', by: hagrid, dropSize: 200 });
        if (rhow === 'dragged') await k.say('thanksRock', hagrid);
        await k.wait(300);
        crunch();
        k.puff(340, 500, 60, '#8a7a64');
        await k.all(k.shake(hermione, 4, 2), k.vanish(rock, 0.3));
        await k.say('crunch', hermione);
        laugh();
        bellyLaugh();
        await k.all(k.shake(hagrid, 4, 3), k.shake(harry, 3, 3));

        // The very first slice for the birthday owl.
        const first = k.add(cakeSlice(), { x: 385, y: 560, w: 100, z: 17 });
        k.set(first, { opacity: 0 });
        await k.appear(first, 0.3);
        // His turn: drag the first slice to Hedwig.
        const show = await k.dragToHelp(first, { to: hedwig, ask: 'askSlice', nudge: 'nudgeSlice', helped: 'helpedSlice', by: harry, dropSize: 200 });
        k.sparkle(620, 540, 8, 80);
        await k.vanish(first, 0.3);
        await k.all(hoot(k, hedwig, 2), k.hop(hedwig, 20));
        if (show === 'dragged') await k.say('thanksSlice', hermione);

        // And a slice for him: it flies out of the cake towards the screen.
        await k.say('slice', harry);
        const bit = k.add(cakeSlice(), { x: 430, y: 470, w: 90, z: 40 });
        k.set(bit, { opacity: 0 });
        await k.appear(bit, 0.3);
        k.fx.whizz();
        await k.to(bit, 0.7, { y: 200, scale: 2.2, rotation: 20, ease: 'power1.out' });
        k.fx.pop();
        k.sparkle(560, 660, 14, 160);
        await k.vanish(bit, 0.25);

        // Everyone together.
        await k.pop(cake, 1.08);
        await warmEnding(k, { cast: [harry, hermione, hagrid, hedwig], end: 'end', confetti: true });
      },
    },
  ],
});
