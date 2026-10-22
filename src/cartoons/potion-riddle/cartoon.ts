/**
 * The Riddle of the Bottles: a scene from the first Harry Potter book that
 * the film leaves out. Deep under the trapdoor, past Fluffy and the Devil's
 * Snare, the last guard on the Stone isn't a monster but a puzzle, and
 * Hermione loves puzzles. (It follows on from "Harry's Flute".)
 *
 *   1. Fire in front, fire behind. Ron has stayed behind with the giant
 *      chess pieces, so Harry and Hermione go on alone into a little stone
 *      room with a table of bottles. Whoosh! Purple fire leaps up in the
 *      doorway behind them, and black fire in the doorway ahead. Trapped!
 *      But there's a rolled-up scroll on the table. His first turn: he taps
 *      it and it unrolls. A puzzle! Hermione is delighted: "It isn't magic.
 *      It's thinking."
 *   2. Seven bottles. Hermione reads the riddle: the fat round bottle takes
 *      you back through the purple fire, the smallest takes you on through
 *      the black fire, and the rest are only nettle juice. Yuck! Not the
 *      tall one, not the fat one… His second turn: he finds the smallest
 *      bottle of all. But there's only one sip in it: enough for one.
 *   3. Through the fire. Hermione will drink the round one, go back, and
 *      send an owl to Dumbledore. "You're a great wizard, Harry." "Not as
 *      great as you." His third turn: he drags the fat round bottle across
 *      to Hermione (a drag). She walks back through the purple fire, safe. Harry
 *      drinks the tiny one (brr, like ice down to his toes!) and walks into
 *      the black flames, cold as snow, and out the other side.
 *   4. The mirror. In the very last room stands the tall golden mirror Harry
 *      found at Christmas, which shows what you want most of all. His third
 *      turn: he taps the mirror. Harry's reflection holds up the red Stone,
 *      winks and pops it in its pocket, and the real Stone is in Harry's
 *      pocket! Footsteps… it's Dumbledore. "Only someone who wanted to find
 *      the Stone, but not use it, could get it from the mirror."
 *   5. Sherbet lemons. Dumbledore's office, all three friends together. The
 *      Stone will be kept safe. Hermione worked out the riddle, Ron won the
 *      chess, and the riddle was made by Professor Snape, to keep the Stone safe. "Snape was helping?
 *      Blimey!" A sherbet lemon, anyone? His fifth turn (a drag): he passes
 *      the jar of sherbet lemons across to the friends.
 *
 * The scary beat is the two fires leaping up and shutting them in: sound
 * first (a roar of flame), the camera on the black fire for one line, then
 * straight back to the friends and the scroll. The fire never touches
 * anyone; through it, it is only cold. The book's villain is left out: in
 * this episode the last room holds only the mirror, and the danger is a
 * puzzle, solved by thinking.
 */
import { NOTE, cached, circle, defineCartoon, ellipse, noiseBurst, now, piece, rect, svg, tone, type Kit } from '../../kit';
import { warmEnding } from '../../worlds/common/pieces';
import { sounds as hogSounds } from '../../worlds/hogwarts/moves';
import meta from './meta';

const { bellyLaugh } = hogSounds;

// ------------------------------------------------------------------- art

/** The fat round bottle, in a hand (60 × 80): pink, with a cork. Like the one on the table. */
const roundBottle = cached(() =>
  svg({ w: 60, h: 80, name: 'riddle-round-bottle', label: 'A round bottle' }, [
    piece(rect(22, 2, 16, 14, 3), '#b98a5a', { edge: 'cut' }),
    piece(rect(24, 12, 12, 16, 2), '#efe6f0', { edge: 'clean' }),
    piece(circle(30, 52, 27), '#efe6f0', { edge: 'clean' }),
    piece(ellipse(30, 58, 23, 19), '#e79aa6', { edge: 'clean', shadow: false }),
  ]),
);

/** The tiny bottle, in a hand (30 × 50): pale blue, with a silver glint. Like the one on the table. */
const tinyBottle = cached(() =>
  svg({ w: 30, h: 50, name: 'riddle-tiny-bottle', label: 'A tiny bottle' }, [
    piece(rect(10, 2, 10, 9, 2), '#b98a5a', { edge: 'cut' }),
    piece(rect(11, 9, 8, 10, 2), '#dfe9f4', { edge: 'clean' }),
    piece(ellipse(15, 34, 13, 15), '#dfe9f4', { edge: 'clean' }),
    piece(ellipse(15, 38, 10, 10), '#5a9be0', { edge: 'clean', shadow: false }),
    piece(circle(10, 30, 2.5), '#ffffff', { edge: 'clean', shadow: false }),
  ]),
);

// ---------------------------------------------------------------- sounds

/** Magic fire leaping up in a doorway: a rising roar of flame (never sudden). */
function flameUp(): void {
  const t = now();
  noiseBurst(t, { freq: 500, q: 0.8, peak: 0.08, attack: 0.25, decay: 1.2 });
  tone(90, t, { wave: 'sawtooth', peak: 0.04, attack: 0.3, decay: 1.1, glideTo: 140, lowpass: 400 });
}

/** The flames crackling softly, for `seconds`. */
function flicker(seconds = 2): void {
  const t = now();
  for (let i = 0; i < seconds * 4; i++) noiseBurst(t + i * 0.25 + Math.random() * 0.1, { freq: 1600, q: 3, peak: 0.02, decay: 0.08 });
}

/** A gulp from a little bottle. */
function gulp(): void {
  const t = now();
  tone(320, t, { wave: 'sine', peak: 0.07, attack: 0.02, decay: 0.15, glideTo: 180 });
}

/** Brr! Icy cold: a shiver of high, wobbling notes. */
function brr(): void {
  const t = now();
  [NOTE.E6, NOTE.C6, NOTE.G5].forEach((f, i) => tone(f, t + i * 0.12, { wave: 'sine', peak: 0.04, attack: 0.02, decay: 0.4, vibrato: [14, 20] }));
}

/** The scroll unrolling: a soft paper flap. */
function unroll(): void {
  const t = now();
  noiseBurst(t, { freq: 3000, q: 1.5, peak: 0.04, attack: 0.05, decay: 0.4 });
}

/** Slow footsteps on stone, coming closer. */
function footsteps(steps = 4): void {
  const t = now();
  for (let i = 0; i < steps; i++) {
    const p = 0.03 + (i / steps) * 0.05;
    noiseBurst(t + i * 0.6, { freq: 260, q: 2, peak: p, attack: 0.01, decay: 0.12 });
    tone(80, t + i * 0.6, { wave: 'sine', peak: p, decay: 0.15 });
  }
}

// ------------------------------------------------------------------ cast

type Actor = 'harry' | 'hermione' | 'ron' | 'dumbledore' | 'table' | 'scroll' | 'purple' | 'black' | 'mirror' | 'reflection' | 'stone' | 'jar';
const cast = {} as Record<Actor, HTMLElement>;

/** The table of bottles: 420 wide (scale 0.808 of its 520 × 260 box), legs on y 660. */
const TABLE = { x: 380, y: 450, w: 420, z: 6 };
const S = 420 / 520;
/** Where the tiny bottle and the fat round bottle stand on the table (their bases). */
const TINY: [number, number] = [TABLE.x + 352 * S, TABLE.y + 152 * S];
const ROUND: [number, number] = [TABLE.x + 142 * S, TABLE.y + 152 * S];

/** A fire wobbling gently in its doorway, for as long as the scene runs. */
function burn<K extends string>(k: Kit<K>, fire: HTMLElement): void {
  const flames = k.pivot(k.part(fire, 'flames'));
  void k.to(flames, 0.6, { scaleY: 1.05, scaleX: 0.97, yoyo: true, repeat: -1, ease: 'sine.inOut' });
}

/** A fire leaps up from the floor of its doorway. */
async function leapUp<K extends string>(k: Kit<K>, fire: HTMLElement): Promise<void> {
  flameUp();
  k.set(fire, { opacity: 1 });
  await k.to(k.pivot(k.part(fire, 'flames')), 0.9, { scaleY: 1, ease: 'back.out(1.4)' });
  burn(k, fire);
}

/** An invisible tap spot (the ring goes round it) centred on (x, y). */
function spot<K extends string>(k: Kit<K>, x: number, y: number, size = 130): HTMLElement {
  return k.add('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"></svg>', { x: x - size / 2, y: y - size / 2, w: size, h: size, z: 25 });
}

/** Someone drinks from a bottle prop held at their face, then the bottle fades. */
async function drink<K extends string>(k: Kit<K>, who: HTMLElement, bottle: HTMLElement): Promise<void> {
  const { face } = k.box(who);
  const b = k.box(bottle);
  await k.to(bottle, 0.7, { x: `+=${face.cx - (b.x + b.w / 2)}`, y: `+=${face.y + face.h * 0.75 - (b.y + b.h)}`, ease: 'power1.inOut' });
  await k.to(bottle, 0.3, { rotation: -60 });
  gulp();
  await k.wait(400);
  await k.fade(bottle, 0, 0.3);
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. Fire in front, fire behind
    under: { who: 'narrator', text: 'Deep under the trapdoor, Ron stayed behind to finish a giant game of chess.' },
    alone: { who: 'narrator', text: 'Harry and Hermione went on, to keep the stone safe. They came to a little stone room.' },
    bottles: { who: 'harry', text: 'Look, {name}. A table full of bottles.' },
    behind: { who: 'hermione', text: 'Fire! In the doorway behind us!' },
    ahead: { who: 'harry', text: 'And black fire in front! We’re trapped!' },
    scroll: { who: 'hermione', text: 'Wait. There’s a rolled-up scroll on the table.' },
    askScroll: { who: 'hermione', text: '{name}, can you open the scroll? Tap it!' },
    nudgeScroll: { who: 'hermione', text: 'Tap the rolled-up scroll.' },
    helpedScroll: { who: 'harry', text: 'I’ll unroll it.' },
    puzzle: { who: 'hermione', text: 'It’s a puzzle! Brilliant. I love puzzles.' },
    thinking: { who: 'hermione', text: 'It isn’t magic. It’s thinking. And we’re good at thinking!' },
    // 2. Seven bottles
    riddle2: { who: 'hermione', text: 'The fat round bottle takes you back, through the purple fire.' },
    riddle3: { who: 'hermione', text: 'The smallest bottle takes you on, through the black fire.' },
    riddle4: { who: 'hermione', text: 'And all the others are only nettle juice.' },
    yuck: { who: 'harry', text: 'Nettle juice? Yuck!' },
    whichSmallest: { who: 'harry', text: 'So which one is the smallest?' },
    notTall: { who: 'hermione', text: 'Not the tall thin one. Not the fat round one…' },
    askTiny: { who: 'hermione', text: '{name}, can you find the smallest bottle of all? Tap it!' },
    nudgeTiny: { who: 'hermione', text: 'Look for the teeny tiny bottle.' },
    helpedTiny: { who: 'hermione', text: 'There! The tiny blue one.' },
    foundIt: { who: 'harry', text: 'You found it, {name}! Brilliant.' },
    spotted: { who: 'harry', text: 'Well spotted, Hermione!' },
    oneSip: { who: 'harry', text: 'But there’s only one sip in it. That’s enough for one.' },
    goOn: { who: 'hermione', text: 'Then you go on, Harry. I’ll go back for help.' },
    // 3. Through the fire
    owl: { who: 'hermione', text: 'I’ll drink the round one. Then I’ll send an owl to Dumbledore.' },
    careful: { who: 'harry', text: 'Be careful, Hermione.' },
    greatWizard: { who: 'hermione', text: 'You be careful too. You’re a great wizard, Harry.' },
    notAsGreat: { who: 'harry', text: 'Not as great as you.' },
    askRound: { who: 'harry', text: '{name}, can you pass Hermione the round bottle? Drag it to her!' },
    nudgeRound: { who: 'harry', text: 'Drag the fat round bottle across to Hermione.' },
    helpedRound: { who: 'harry', text: 'I’ll pass it to you, Hermione.' },
    thanksRound: { who: 'hermione', text: 'Thank you! Just what I needed.' },
    thanksHarry: { who: 'hermione', text: 'Thank you, Harry.' },
    notHot: { who: 'narrator', text: 'Hermione walked into the purple fire. It didn’t feel hot at all. And she was safely through.' },
    brr: { who: 'harry', text: 'Brr! It’s like ice, all the way down to my toes!' },
    hereIGo: { who: 'harry', text: 'Here I go.' },
    coldAsSnow: { who: 'narrator', text: 'The black flames flickered all around him, cold as snow. And then he was through.' },
    // 4. The mirror
    lastRoom: { who: 'narrator', text: 'In the very last room stood a tall golden mirror.' },
    theMirror: { who: 'harry', text: 'It’s the mirror from Christmas. It shows what you want most.' },
    wantMost: { who: 'harry', text: 'And what I want most is to find the stone, and keep it safe.' },
    askMirror: { who: 'harry', text: '{name}, will you look in the mirror with me? Tap it!' },
    nudgeMirror: { who: 'harry', text: 'Tap the big golden mirror.' },
    helpedMirror: { who: 'harry', text: 'I’ll look myself.' },
    reflection: { who: 'narrator', text: 'In the mirror, Harry’s reflection held up a red stone. Then it winked, and popped it in his pocket.' },
    inPocket: { who: 'harry', text: 'It’s in my pocket! The real stone!' },
    someone: { who: 'harry', text: 'Somebody’s coming!' },
    wellDone: { who: 'dumbledore', text: 'Well done, Harry. Well done indeed.' },
    findNotUse: { who: 'dumbledore', text: 'The mirror only gives the stone to someone who wants to keep it safe.' },
    // 5. Sherbet lemons
    office: { who: 'narrator', text: 'The next day, the three friends went to Dumbledore’s office.' },
    keptSafe: { who: 'dumbledore', text: 'The stone is safe now. Thank you, all three of you.' },
    team: { who: 'harry', text: 'Hermione worked out the riddle. And Ron won the giant chess game!' },
    nameFound: { who: 'hermione', text: 'And {name} helped us with the bottles!' },
    snape: { who: 'dumbledore', text: 'Did you know? Professor Snape, the Potions teacher, made that riddle. He wanted to keep the stone safe too.' },
    blimey: { who: 'ron', text: 'Snape was helping? Blimey!' },
    sherbet: { who: 'dumbledore', text: 'Now. Would anybody like a sherbet lemon?' },
    askJar: { who: 'dumbledore', text: 'Please pass the jar to my friends. Drag it over!' },
    nudgeJar: { who: 'dumbledore', text: 'Drag the jar of sherbet lemons across to the friends.' },
    helpedJar: { who: 'hermione', text: 'I’ll fetch the jar myself.' },
    thanksJar: { who: 'ron', text: 'Thanks! Yum.' },
    thanksHermione: { who: 'ron', text: 'Thanks, Hermione. Yum.' },
    end: { who: 'narrator', text: 'And the three friends ate sherbet lemons until their tongues fizzed.' },
  },
  scenes: [
    // ==================================================== 1. Fire in front, fire behind
    {
      name: 'Fire in front, fire behind',
      set(k) {
        k.backdrop('potion-chamber');
        k.music('sneaky');
        k.light(400, 262, 120, { color: '#ffcf7a', strength: 0.3, flicker: true, z: 3 });
        k.light(780, 262, 120, { color: '#ffcf7a', strength: 0.3, flicker: true, z: 3 });
        cast.purple = k.prop('purpleFire', { x: 20, y: 240, w: 200, z: 4 });
        cast.black = k.prop('blackFire', { x: 960, y: 240, w: 200, z: 4 });
        k.set([cast.purple, cast.black], { opacity: 0 });
        k.set(k.pivot(k.part(cast.purple, 'flames')), { scaleY: 0.05 });
        k.set(k.pivot(k.part(cast.black, 'flames')), { scaleY: 0.05 });
        cast.table = k.prop('potionTable', TABLE);
        k.set(k.pivot(k.part(cast.table, 'tiny')), { scale: 1.6 });
        cast.scroll = k.prop('riddleScroll', { x: TABLE.x - 30, y: TABLE.y + 10, w: 140, z: 8 });
        k.set(cast.scroll, { scaleY: 0.35, rotation: -80 });
        cast.hermione = k.character('hermione', { x: 160, y: 416, w: 220, z: 10 });
        cast.harry = k.character('harry', { x: 800, y: 412, w: 220, z: 10 });
        k.set([cast.hermione, cast.harry], { x: -1040 });
      },
      async play(k) {
        const { harry, hermione, purple, black, scroll } = cast;
        await k.say('under');
        k.fx.patter(6);
        await k.all(k.say('alone'), k.to([hermione, harry], 2.4, { x: 0, ease: 'power1.out' }));
        await k.say('bottles', harry);

        // Whoosh! Fire behind them, then fire in front.
        k.music('spooky');
        await leapUp(k, purple);
        await k.all(k.say('behind', hermione), k.shake(hermione, 4, 2));
        await leapUp(k, black);
        await k.camera({ zoom: 1.15, x: 760, y: 420 }, 1);
        await k.all(k.say('ahead', harry), k.shake(harry, 4, 2));
        flicker(2);
        await k.camera({}, 0.8);
        await k.wait(500);

        // Back to the friends: there's a scroll.
        k.music('sneaky');
        await k.say('scroll', hermione);
        await k.tapToHelp(scroll, { ask: 'askScroll', nudge: 'nudgeScroll', helped: 'helpedScroll', by: hermione, helper: harry, size: 130 });
        unroll();
        await k.to(scroll, 0.9, { x: 480 - (TABLE.x - 30), y: 120 - (TABLE.y + 10), scale: 200 / 140, scaleY: 200 / 140, rotation: 0, zIndex: 30, ease: 'back.out(1.3)' });
        k.sparkle(580, 260, 12, 220);
        k.music('magic');
        await k.all(k.say('puzzle', hermione), k.hop(hermione, 24));
        await k.say('thinking', hermione);
        await k.wait(400);
      },
    },

    // ==================================================== 2. Seven bottles
    {
      name: 'Seven bottles',
      set(k) {
        k.backdrop('potion-chamber');
        k.music('magic');
        k.light(400, 262, 120, { color: '#ffcf7a', strength: 0.3, flicker: true, z: 3 });
        k.light(780, 262, 120, { color: '#ffcf7a', strength: 0.3, flicker: true, z: 3 });
        cast.purple = k.prop('purpleFire', { x: 20, y: 240, w: 200, z: 4 });
        cast.black = k.prop('blackFire', { x: 960, y: 240, w: 200, z: 4 });
        cast.table = k.prop('potionTable', TABLE);
        k.set(k.pivot(k.part(cast.table, 'tiny')), { scale: 1.6 });
        cast.scroll = k.prop('riddleScroll', { x: 480, y: 120, w: 200, z: 30 });
        cast.hermione = k.character('hermione', { x: 160, y: 416, w: 220, z: 10 });
        cast.harry = k.character('harry', { x: 800, y: 412, w: 220, z: 10 });
      },
      async play(k) {
        const { harry, hermione, purple, black, scroll, table } = cast;
        burn(k, purple);
        burn(k, black);
        k.sfx.page();
        // Each clue: the bottle (or the fire) it's about twinkles.
        k.sparkle(ROUND[0], ROUND[1] - 50, 6, 70);
        await k.say('riddle2', hermione);
        k.sparkle(1060, 420, 6, 120);
        await k.say('riddle3', hermione);
        await k.say('riddle4', hermione);
        await k.all(k.say('yuck', harry), k.shake(harry, 3, 2));

        // Which is the smallest? The scroll rolls away so we can see.
        await k.to(scroll, 0.6, { opacity: 0, y: -60 });
        await k.say('whichSmallest', harry);
        await k.say('notTall', hermione);

        // His second turn: find the smallest bottle.
        const tiny = spot(k, TINY[0], TINY[1] - 30, 120);
        const how = await k.tapToHelp(tiny, { ask: 'askTiny', nudge: 'nudgeTiny', helped: 'helpedTiny', by: hermione, size: 120 });
        k.remove(tiny);
        k.fx.twinkle();
        await k.to(k.pivot(k.part(table, 'tiny')), 0.4, { y: -24, scale: 2, yoyo: true, repeat: 1, ease: 'power1.out' });
        await k.say(how === 'tapped' ? 'foundIt' : 'spotted', harry);
        await k.say('oneSip', harry);
        k.music('dreamy');
        await k.say('goOn', hermione);
        await k.wait(400);
      },
    },

    // ==================================================== 3. Through the fire
    {
      name: 'Through the fire',
      set(k) {
        k.backdrop('potion-chamber');
        k.music('dreamy');
        k.light(400, 262, 120, { color: '#ffcf7a', strength: 0.3, flicker: true, z: 3 });
        k.light(780, 262, 120, { color: '#ffcf7a', strength: 0.3, flicker: true, z: 3 });
        cast.purple = k.prop('purpleFire', { x: 20, y: 240, w: 200, z: 12 });
        cast.black = k.prop('blackFire', { x: 960, y: 240, w: 200, z: 12 });
        cast.table = k.prop('potionTable', TABLE);
        k.set(k.part(cast.table, 'tiny'), { opacity: 0 });
        k.set(k.part(cast.table, 'round'), { opacity: 0 });
        cast.hermione = k.character('hermione', { x: 160, y: 416, w: 220, z: 10 });
        cast.harry = k.character('harry', { x: 800, y: 412, w: 220, z: 10 });
      },
      async play(k) {
        const { harry, hermione, purple, black } = cast;
        burn(k, purple);
        burn(k, black);
        // The two bottles, off the table: one for each friend.
        const round = k.add(roundBottle(), { x: ROUND[0] - 45, y: ROUND[1] - 120, w: 90, z: 20 });
        const tiny = k.add(tinyBottle(), { x: TINY[0] - 22, y: TINY[1] - 75, w: 45, z: 20 });
        await k.say('owl', hermione);
        await k.say('careful', harry);
        await k.say('greatWizard', hermione);
        await k.say('notAsGreat', harry);

        // His turn: pass Hermione the round bottle.
        const gave = await k.dragToHelp(round, { to: hermione, ask: 'askRound', nudge: 'nudgeRound', helped: 'helpedRound', by: harry, dropSize: 200 });
        await k.say(gave === 'dragged' ? 'thanksRound' : 'thanksHarry', hermione);

        // Hermione drinks the round one and walks back through the purple fire.
        await drink(k, hermione, round);
        k.fx.patter(4);
        await k.to(hermione, 1.2, { x: -150, ease: 'power1.in' });
        k.sparkle(120, 450, 10, 160);
        await k.all(k.say('notHot'), k.fade(hermione, 0, 1));

        // Harry drinks the tiny one: brr!
        await drink(k, harry, tiny);
        brr();
        await k.all(k.say('brr', harry), k.shake(harry, 5, 4));
        await k.say('hereIGo', harry);
        flameUp();
        k.fx.patter(4);
        await k.to(harry, 1.2, { x: 150, ease: 'power1.in' });
        k.sparkle(1060, 450, 10, 160);
        await k.all(k.say('coldAsSnow'), k.fade(harry, 0, 1));
        await k.wait(500);
      },
    },

    // ==================================================== 4. The mirror
    {
      name: 'The mirror',
      set(k) {
        k.backdrop('potion-chamber');
        k.music('dreamy');
        k.dim(0.25, '#0c1226');
        // The black fire he came through burns quietly in the doorway behind him.
        cast.black = k.prop('blackFire', { x: 20, y: 240, w: 200, z: 4 });
        cast.mirror = k.prop('mirrorOfErised', { x: 640, y: 200, w: 280, z: 6 });
        cast.reflection = k.character('harry', { x: 712, y: 400, w: 136, z: 7 });
        k.set(cast.reflection, { opacity: 0 });
        cast.harry = k.character('harry', { x: 300, y: 412, w: 220, z: 10 });
        cast.stone = k.prop('redStone', { x: 795, y: 500, w: 50, z: 8 });
        k.set(cast.stone, { opacity: 0 });
        cast.dumbledore = k.character('dumbledore', { x: 880, y: 360, w: 280, z: 10 });
        k.set(cast.dumbledore, { x: 400, opacity: 0 });
      },
      async play(k) {
        const { harry, black, mirror, reflection, stone, dumbledore } = cast;
        burn(k, black);
        await k.say('lastRoom');
        await k.say('theMirror', harry);
        await k.say('wantMost', harry);

        // His fourth turn: look in the mirror.
        await k.tapToHelp(mirror, { ask: 'askMirror', nudge: 'nudgeMirror', helped: 'helpedMirror', by: harry, size: 240 });
        k.music('magic');
        k.fx.twinkle();
        await k.fade(reflection, 0.8, 1);
        await k.fade(stone, 1, 0.5);
        k.sparkle(820, 525, 8, 80);
        await k.all(k.say('reflection'), k.wait(2600).then(() => k.blink(reflection)));
        // The reflection's stone vanishes into its pocket, and pops up in Harry's hand.
        k.fx.pop();
        await k.to(stone, 0.4, { y: 60, opacity: 0 });
        const real = k.prop('redStone', { x: 470, y: 520, w: 90, z: 14 });
        k.set(real, { opacity: 0, y: 30 });
        await k.to(real, 0.6, { opacity: 1, y: 0, ease: 'back.out(1.6)' });
        k.sparkle(515, 560, 12, 120);
        await k.fade(reflection, 0, 0.6);
        await k.all(k.say('inPocket', harry), k.hop(harry, 26));

        // Footsteps… but it's only Dumbledore.
        footsteps(4);
        await k.wait(900);
        await k.say('someone', harry);
        k.music('cosy');
        await k.to(dumbledore, 1.6, { x: 0, opacity: 1, ease: 'power1.out' });
        await k.say('wellDone', dumbledore);
        await k.say('findNotUse', dumbledore);
        await k.wait(400);
      },
    },

    // ==================================================== 5. Sherbet lemons
    {
      name: 'Sherbet lemons',
      set(k) {
        k.backdrop('headmasters-office');
        k.music('cosy');
        cast.harry = k.character('harry', { x: 40, y: 430, w: 220 });
        cast.ron = k.character('ron', { x: 240, y: 430, w: 220 });
        cast.hermione = k.character('hermione', { x: 440, y: 434, w: 220 });
        cast.dumbledore = k.character('dumbledore', { x: 820, y: 350, w: 300, flip: true });
        cast.stone = k.prop('redStone', { x: 720, y: 470, w: 90, z: 14 });
        cast.jar = k.prop('sweetJar', { x: 740, y: 520, w: 110, z: 14 });
        k.set(cast.jar, { opacity: 0 });
      },
      async play(k) {
        const { harry, ron, hermione, dumbledore, stone, jar } = cast;
        await k.say('office');
        await k.say('keptSafe', dumbledore);
        k.fx.twinkle();
        await k.vanish(stone);
        await k.say('team', harry);
        await k.all(k.say('nameFound', hermione), k.hop(hermione, 20));
        await k.say('snape', dumbledore);
        await k.all(k.say('blimey', ron), k.shake(ron, 4, 2));
        bellyLaugh();
        await k.wait(300);
        await k.fade(jar, 1, 0.4);
        await k.say('sherbet', dumbledore);
        // His turn: pass the jar along to the friends.
        const passed = await k.dragToHelp(jar, { to: [570, 625], ask: 'askJar', nudge: 'nudgeJar', helped: 'helpedJar', by: dumbledore, helper: hermione, dropSize: 200 });
        await k.vanish(jar);
        await k.say(passed === 'dragged' ? 'thanksJar' : 'thanksHermione', ron);
        await warmEnding(k, { cast: [harry, ron, hermione], end: 'end' });
      },
    },
  ],
});
