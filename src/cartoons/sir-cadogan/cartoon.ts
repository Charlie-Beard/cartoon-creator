/**
 * Sir Cadogan: a funny week from the third Harry Potter book that the film
 * leaves out. The Lady in Pink, who guards the door to Gryffindor Tower,
 * runs off to hide in another painting, and the only one brave enough to
 * guard the door instead is Sir Cadogan: a mad little knight on a fat grey
 * pony, who shouts silly passwords and challenges everyone to duels.
 *
 *   1. The empty painting. After supper the friends climb the moving stairs
 *      to Gryffindor Tower, and the Lady in Pink's painting is empty! Peeves
 *      was rude to her, and she ran off to hide. Without her, nobody can get
 *      in. Clip-clop: into the painting gallops a little knight on a fat
 *      pony. "Fear not! Sir Cadogan is here!" The pony stops dead, and over
 *      he goes: "I meant to do that."
 *   2. Silly passwords. He changes the password every day, sometimes twice.
 *      Harry tries yesterday's, "Scurvy cur!", which is wrong. Neville has
 *      written them all down on a very long list. Sir Cadogan challenges Ron
 *      to a duel (Ron has only a sandwich). Neville can't read his own
 *      writing, so his first turn: he taps the list and finds today's
 *      password. "Oddsbodikins!" The painting swings open.
 *   3. The runaway pony. Next morning a painted butterfly flutters by, the
 *      pony trots off after it, and the knight lands in a heap. His second
 *      turn: he taps the pony to call it back, and Sir Cadogan climbs on.
 *      "Onward, my noble steed!" The pony yawns. It would rather have a nap.
 *   4. Hide and seek. Where is the Lady in Pink? Sir Cadogan gallops from
 *      painting to painting to look: not in this one, not in that one. His
 *      third turn: he spots something pink in a little painting and taps
 *      it. It's her! Peeves was so rude, she didn't want to come back. Sir
 *      Cadogan bows: "Fair lady, your door misses you!" Very well, then.
 *   5. Home again. Sir Cadogan says farewell and rides off into his own
 *      painting. The Lady in Pink comes home, and the new password is
 *      "Brave knight!" She sings a happy song, very loudly.
 *
 * There's no villain this time: the trouble is a door nobody can open and a
 * knight who keeps falling off. In the book the Fat Lady's portrait is
 * slashed; here she simply runs off in a huff because Peeves was rude, and
 * she is never called fat. Sir Cadogan's sword is only ever waved in the
 * air; his duels never happen.
 */
import { NOTE, cached, defineCartoon, noiseBurst, now, piece, rect, svg, tone, type Kit } from '../../kit';
import { sounds as commonSounds } from '../../worlds/common/moves';
import { warmEnding } from '../../worlds/common/pieces';
import { sounds as hogSounds } from '../../worlds/hogwarts/moves';
import meta from './meta';

const { laugh, giggle } = commonSounds;
const { flutter } = hogSounds;

// ------------------------------------------------------------------- art

/** The dark round hole behind the painting (360 × 460): the way into the tower, shown when the painting swings open. */
const hole = cached(() =>
  svg({ w: 360, h: 460, name: 'cadogan-hole', label: 'The way in' }, [
    piece(rect(0, 0, 360, 460, 30), '#2a2030', { edge: 'cut' }),
    piece(rect(40, 60, 280, 400, 120), '#5a3a2a', { edge: 'cut', shadow: false, opacity: 0.7 }),
    piece(rect(70, 120, 220, 340, 100), '#e8a25a', { edge: 'clean', shadow: false, opacity: 0.35 }),
  ]),
);

/** A frill of pink silk (60 × 26): the hem of a dress, peeping in at the edge of a little painting. */
const pinkHem = cached(() =>
  svg({ w: 60, h: 26, name: 'cadogan-pink-hem', label: 'Something pink' }, [
    piece([[0, 4], [52, 0], [60, 22], [44, 18], [32, 26], [20, 18], [8, 24], [0, 16]], '#e9a3bf'),
    piece([[4, 6], [48, 3], [50, 9], [6, 12]], '#f5c9da', { edge: 'clean', shadow: false }),
  ]),
);

/** A painted butterfly (60 × 50): two pairs of lilac wings. */
const butterfly = cached(() =>
  svg({ w: 60, h: 50, name: 'cadogan-butterfly', label: 'A butterfly' }, [
    piece([[30, 25], [6, 4], [2, 22], [30, 28]], '#c9a3e6'),
    piece([[30, 25], [54, 4], [58, 22], [30, 28]], '#c9a3e6'),
    piece([[30, 27], [10, 44], [24, 46]], '#f2c94c'),
    piece([[30, 27], [50, 44], [36, 46]], '#f2c94c'),
    piece(rect(28, 14, 4, 24, 2), '#4a3a5a', { edge: 'clean', shadow: false }),
  ]),
);

// ---------------------------------------------------------------- sounds

/** Hooves on painted grass: a fat pony's clip-clop, `steps` of them. */
function clipClop(steps = 6, gap = 0.22): void {
  const t = now();
  for (let i = 0; i < steps; i++) {
    tone(i % 2 ? 620 : 520, t + i * gap, { wave: 'triangle', peak: 0.05, attack: 0.005, decay: 0.08 });
    noiseBurst(t + i * gap, { freq: 1200, q: 4, peak: 0.02, decay: 0.05 });
  }
}

/** Armour clattering: a knight landing in a heap. */
function clank(): void {
  const t = now();
  [0, 0.09, 0.2, 0.33].forEach((d, i) => {
    tone([1320, 990, 1180, 880][i], t + d, { wave: 'triangle', peak: 0.06, decay: 0.3 });
    noiseBurst(t + d, { freq: 3000, q: 3, peak: 0.03, decay: 0.12 });
  });
}

/** A sleepy pony snort or whinny. */
function neigh(): void {
  const t = now();
  tone(520, t, { wave: 'sawtooth', peak: 0.04, attack: 0.05, decay: 0.6, glideTo: 380, lowpass: 1400, vibrato: [18, 30] });
  noiseBurst(t + 0.5, { freq: 600, q: 1, peak: 0.03, attack: 0.02, decay: 0.3 });
}

/** A painting swinging open like a door. */
function creak(): void {
  const t = now();
  tone(160, t, { wave: 'sawtooth', peak: 0.04, attack: 0.08, decay: 0.8, glideTo: 240, lowpass: 900, vibrato: [26, 8] });
}

/** The Lady in Pink singing: a grand, wobbly "la-la-laaa!", up and up. */
function sing(): void {
  const t = now();
  [[NOTE.C5, 0, 0.3], [NOTE.E5, 0.32, 0.3], [NOTE.G5, 0.64, 0.3], [NOTE.C6, 0.96, 1.2]].forEach(([f, d, len]) =>
    tone(f, t + d, { wave: 'sine', peak: 0.06, attack: 0.05, decay: len, vibrato: [6, 22] }),
  );
}

// ------------------------------------------------------------------ cast

type Actor =
  | 'harry' | 'ron' | 'hermione' | 'neville' | 'knight' | 'pony' | 'lady'
  | 'frame' | 'canvas' | 'parlour' | 'hole' | 'list' | 'butterfly' | 'hem';
const cast = {} as Record<Actor, HTMLElement>;

/** The big painting by the door: its frame (440 × 540) at x 560, y 130; the opening inside is x 600 to 960, y 170 to 630. */
const FRAME = { x: 560, y: 130, w: 440 };
/** The pony stands in the painting with its hooves just under the frame's bottom edge; its saddle top is at (701, 448). */
const PONY = { x: 590, y: 300, w: 280 };
const SADDLE: [number, number] = [PONY.x + 108 * (280 / 300), PONY.y + 148 * (280 / 300)];
/** Sir Cadogan, 140 wide, sitting on the saddle (his belt sinks below the saddle line). */
const KNIGHT_W = 140;
const knightOnSaddle = () => ({ x: SADDLE[0] - KNIGHT_W / 2, y: SADDLE[1] + 34 - KNIGHT_W * (340 / 300), w: KNIGHT_W });

/** The big painting by the door: canvas, (hole behind it), pony, knight, frame. */
function painting<K extends string>(k: Kit<K>, o: { canvas?: string; knight?: boolean } = {}): void {
  cast.hole = k.add(hole(), { x: 600, y: 170, w: 360, z: 2 });
  cast.canvas = k.prop(o.canvas ?? 'paintedField', { x: 600, y: 170, w: 360, z: 3 });
  cast.pony = k.prop('cadoganPony', { ...PONY, z: 4 });
  if (o.knight !== false) cast.knight = k.character('sirCadogan', { ...knightOnSaddle(), z: 5 });
  cast.frame = k.prop('portraitFrame', { ...FRAME, z: 6 });
}

/** Everything in the big painting (not the hole behind it). */
const paintingParts = () => [cast.canvas, cast.pony, cast.knight, cast.frame].filter(Boolean);

/** The pony trots on the spot: a little bob and a clip-clop. */
async function trot<K extends string>(k: Kit<K>, els: HTMLElement[], times = 3): Promise<void> {
  clipClop(times * 2);
  await k.to(els, 0.2, { y: '-=8', yoyo: true, repeat: times * 2 - 1, ease: 'sine.inOut' });
}

/** Sir Cadogan waves his sword in the air (never at anybody). */
async function brandish<K extends string>(k: Kit<K>, knight: HTMLElement): Promise<void> {
  await k.to(k.pivot(k.part(knight, 'armR')), 0.25, { rotation: -20, yoyo: true, repeat: 3, ease: 'sine.inOut' });
}

/** Sir Cadogan topples off his pony and lands in a heap at the bottom of the painting (cast.knight is the heap after). */
async function topple<K extends string>(k: Kit<K>): Promise<void> {
  await k.to(cast.knight, 0.5, { rotation: 30, x: '+=60', y: '+=40', ease: 'power2.in' });
  clank();
  k.remove(cast.knight);
  cast.knight = k.character('sirCadogan', { pose: 'fallen', x: PONY.x + 150, y: 640 - KNIGHT_W * (340 / 300), w: KNIGHT_W, z: 5 });
  k.puff(PONY.x + 235, 600, 100);
  await k.shake(cast.knight, 4, 2);
}

/** He climbs back on: sitting on the saddle again (cast.knight is the new one). */
function backOn<K extends string>(k: Kit<K>): void {
  k.remove(cast.knight);
  cast.knight = k.character('sirCadogan', { ...knightOnSaddle(), z: 5 });
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. The empty painting
    supper: { who: 'narrator', text: 'After supper, the friends climbed the moving stairs to Gryffindor Tower.' },
    guardsDoor: { who: 'harry', text: 'The Lady in Pink guards our door. You have to tell her the password.' },
    empty: { who: 'hermione', text: 'But look! Her painting is empty!' },
    peeves: { who: 'ron', text: 'Peeves was rude to her. So she ran off to hide in another painting!' },
    cantGetIn: { who: 'hermione', text: 'But without her, nobody can get into Gryffindor Tower!' },
    fearNot: { who: 'sirCadogan', text: 'Fear not! Sir Cadogan is here!' },
    illGuard: { who: 'sirCadogan', text: 'I shall guard your door! Have at you, scurvy knaves!' },
    knave: { who: 'ron', text: 'Who’s he calling a knave?' },
    meantIt: { who: 'sirCadogan', text: 'Ow! I mean… ha! I meant to do that.' },
    silly: { who: 'hermione', text: 'He’s very brave. And very, very silly.' },
    // 2. Silly passwords
    everyDay: { who: 'narrator', text: 'Sir Cadogan changed the password every day. Sometimes twice!' },
    halt: { who: 'sirCadogan', text: 'Halt! Who goes there? Password!' },
    scurvyCur: { who: 'harry', text: 'Er… Scurvy cur?' },
    yesterday: { who: 'sirCadogan', text: 'Ha! That was yesterday’s password. Today it’s a new one!' },
    wroteDown: { who: 'neville', text: 'I can never remember them. So I wrote them all down!' },
    longList: { who: 'ron', text: 'That’s a very long list, Neville.' },
    duel: { who: 'sirCadogan', text: 'You there, ginger knave! I challenge you to a duel!' },
    sandwich: { who: 'ron', text: 'I haven’t got a sword. I’ve only got a sandwich.' },
    cantRead: { who: 'neville', text: 'Oh no. I can’t read my own writing!' },
    askList: { who: 'neville', text: '{name}, can you help me? Tap my list, and find today’s password.' },
    nudgeList: { who: 'neville', text: 'Tap my long paper list.' },
    helpedList: { who: 'harry', text: 'Let me look. There, near the bottom!' },
    oddsbodikins: { who: 'neville', text: 'Oddsbodikins!' },
    enter: { who: 'sirCadogan', text: 'Correct! Enter, brave friends!' },
    thanksList: { who: 'neville', text: 'Thank you, {name}! I’d be lost without you.' },
    thanksHarry: { who: 'neville', text: 'Thanks, Harry! I’d be lost without you.' },
    // 3. The runaway pony
    morning: { who: 'narrator', text: 'Next morning, a painted butterfly fluttered past Sir Cadogan’s painting.' },
    comeBack: { who: 'sirCadogan', text: 'Come back, you lazy lump of a pony!' },
    allRight: { who: 'harry', text: 'Are you all right, Sir Cadogan?' },
    neverBetter: { who: 'sirCadogan', text: 'Never better! A knight never needs his pony. Well… hardly ever.' },
    munching: { who: 'hermione', text: 'Look, his pony is munching the painted grass.' },
    askPony: { who: 'hermione', text: '{name}, can you call the pony back? Tap it!' },
    nudgePony: { who: 'hermione', text: 'Tap the fat grey pony.' },
    helpedPony: { who: 'harry', text: 'Here, pony! Come on, back you come!' },
    onward: { who: 'sirCadogan', text: 'Ha ha! Onward, my noble steed!' },
    thanksPony: { who: 'sirCadogan', text: 'My thanks, brave {name}!' },
    thanksHarryPony: { who: 'sirCadogan', text: 'My thanks, young Harry!' },
    nap: { who: 'hermione', text: 'I don’t think it wants to go onward. I think it wants a nap.' },
    // 4. Hide and seek
    findHer: { who: 'harry', text: 'We have to find the Lady in Pink. Where could she be hiding?' },
    leaveIt: { who: 'sirCadogan', text: 'Leave it to me! I shall search every painting in the castle!' },
    notThisOne: { who: 'sirCadogan', text: 'Not in this one!' },
    notThatOne: { who: 'sirCadogan', text: 'Not in this one either!' },
    pink: { who: 'hermione', text: 'Look! In that little painting. Something pink!' },
    askPainting: { who: 'harry', text: '{name}, tap the little painting with something pink in it!' },
    nudgePainting: { who: 'harry', text: 'Tap the painting where you can see pink.' },
    helpedPainting: { who: 'hermione', text: 'I’ll knock on the frame. Hello?' },
    foundMe: { who: 'pinkLady', text: 'Oh! You found me.' },
    soRude: { who: 'pinkLady', text: 'Peeves was so rude to me. I didn’t want to come back.' },
    fairLady: { who: 'sirCadogan', text: 'Fair lady! Your door misses you. May I take you home?' },
    gallant: { who: 'pinkLady', text: 'What a brave little knight. Very well!' },
    // 5. Home again
    farewell: { who: 'sirCadogan', text: 'Farewell, friends! If you ever need a hero, just call!' },
    byeKnight: { who: 'hermione', text: 'Goodbye, Sir Cadogan! Thank you!' },
    homeSweet: { who: 'pinkLady', text: 'Ah, home sweet home! Now, my dears. Password?' },
    whatNow: { who: 'ron', text: 'Oh no. What is it now?' },
    braveKnight: { who: 'pinkLady', text: 'Today the password is: brave knight!' },
    together: { who: 'harry', text: 'Brave knight!' },
    thanksName: { who: 'pinkLady', text: 'And thank you, {name}, for finding me.' },
    end: { who: 'narrator', text: 'And the Lady in Pink sang a happy song, very loudly, all the way to bedtime.' },
  },
  scenes: [
    // ==================================================== 1. The empty painting
    {
      name: 'The empty painting',
      set(k) {
        k.backdrop('grand-staircase');
        k.music('cosy');
        painting(k);
        k.set([cast.pony, cast.knight], { x: 420, opacity: 0 });
        cast.harry = k.character('harry', { x: 40, y: 445, w: 200 });
        cast.ron = k.character('ron', { x: 190, y: 445, w: 200 });
        cast.hermione = k.character('hermione', { x: 340, y: 448, w: 200 });
        k.set([cast.harry, cast.ron, cast.hermione], { x: -620 });
      },
      async play(k) {
        const { harry, ron, hermione, pony, knight } = cast;
        k.fx.patter(8);
        await k.all(k.say('supper'), k.to([harry, ron, hermione], 2.2, { x: 0, ease: 'power1.out' }));
        await k.say('guardsDoor', harry);
        k.fx.uhoh();
        await k.all(k.say('empty', hermione), k.shake(hermione, 4, 2));
        await k.say('peeves', ron);
        k.music('sneaky');
        await k.say('cantGetIn', hermione);

        // Clip-clop: into the painting gallops a little knight on a fat pony.
        k.music('adventure');
        clipClop(10);
        await k.to([pony, knight], 1.6, { x: 0, opacity: 1, ease: 'power1.out' });
        await k.all(k.say('fearNot', knight), brandish(k, knight));
        await k.say('illGuard', knight);
        await k.say('knave', ron);

        // The pony stops dead, and over he goes.
        neigh();
        await k.to(k.pivot(k.part(pony, 'head')), 0.3, { rotation: 12, yoyo: true, repeat: 1 });
        await topple(k);
        await k.say('meantIt', cast.knight);
        laugh();
        await k.all(k.say('silly', hermione), k.hop(hermione, 18));
        await k.wait(400);
      },
    },

    // ==================================================== 2. Silly passwords
    {
      name: 'Silly passwords',
      set(k) {
        k.backdrop('grand-staircase');
        k.music('cosy');
        painting(k);
        cast.harry = k.character('harry', { x: 30, y: 445, w: 200 });
        cast.ron = k.character('ron', { x: 180, y: 445, w: 200 });
        cast.neville = k.character('neville', { x: 330, y: 445, w: 200 });
        cast.list = k.prop('passwordList', { x: 440, y: 520, w: 70, z: 12 });
        k.set(cast.list, { opacity: 0 });
      },
      async play(k) {
        const { harry, ron, neville, knight, list, pony } = cast;
        await k.say('everyDay');
        await k.all(k.say('halt', knight), brandish(k, knight));
        await k.say('scurvyCur', harry);
        await k.all(k.say('yesterday', knight), trot(k, [pony, knight], 2));

        // Neville's very long list unrolls… and unrolls.
        k.sfx.rustle();
        await k.fade(list, 1, 0.3);
        await k.say('wroteDown', neville);
        await k.to(list, 0.7, { y: -120, scale: 1.6, ease: 'back.out(1.4)' });
        await k.say('longList', ron);

        // A duel! With a sandwich.
        await k.all(k.say('duel', knight), brandish(k, knight));
        await k.all(k.say('sandwich', ron), k.shake(ron, 3, 2));
        giggle();
        await k.say('cantRead', neville);

        // His first turn: find today's password on the list.
        const how = await k.tapToHelp(list, { ask: 'askList', nudge: 'nudgeList', helped: 'helpedList', by: neville, helper: harry, size: 160 });
        const lb = k.box(list);
        k.sparkle(lb.x + lb.w / 2, lb.y + lb.h * 0.8, 10, 80);
        await k.all(k.say('oddsbodikins', neville), k.hop(neville, 20));
        await k.say('enter', knight);

        // The painting swings open like a door.
        creak();
        await k.all(...paintingParts().map((el) =>
          k.to(el, 1, { scaleX: 0.15, transformOrigin: `${FRAME.x - k.box(el).x}px 50%`, ease: 'power1.inOut' }),
        ));
        k.music('magic');
        await k.say(how === 'tapped' ? 'thanksList' : 'thanksHarry', neville);
        await k.wait(400);
      },
    },

    // ==================================================== 3. The runaway pony
    {
      name: 'The runaway pony',
      set(k) {
        k.backdrop('grand-staircase');
        k.music('cosy');
        painting(k);
        cast.butterfly = k.add(butterfly(), { x: 980, y: 260, w: 60, z: 7 });
        k.set(cast.butterfly, { opacity: 0 });
        cast.harry = k.character('harry', { x: 80, y: 445, w: 210 });
        cast.hermione = k.character('hermione', { x: 290, y: 448, w: 210 });
      },
      async play(k) {
        const { harry, hermione, pony, butterfly: fly } = cast;
        await k.say('morning');
        // A butterfly flutters through the painting; the pony trots after it, and off he falls.
        flutter(12);
        k.set(fly, { opacity: 1 });
        await k.to(fly, 1.6, { x: -300, y: 60, ease: 'sine.inOut' });
        neigh();
        await k.all(trot(k, [pony], 2), k.to(pony, 0.8, { x: 70, ease: 'power1.in' }), topple(k));
        await k.fade(fly, 0, 0.4);
        // Off the pony wanders, to the edge of the painting, and starts munching.
        await k.to(pony, 0.6, { x: 120 });
        await k.to(k.pivot(k.part(pony, 'head')), 0.6, { rotation: 18 });
        await k.say('comeBack', cast.knight);
        await k.say('allRight', harry);
        await k.say('neverBetter', cast.knight);
        await k.say('munching', hermione);

        // His second turn: call the pony back.
        const how = await k.tapToHelp(pony, { ask: 'askPony', nudge: 'nudgePony', helped: 'helpedPony', by: hermione, helper: harry, size: 200 });
        neigh();
        await k.to(k.pivot(k.part(pony, 'head')), 0.4, { rotation: 0 });
        await k.all(trot(k, [pony], 2), k.to(pony, 1, { x: 0, ease: 'power1.inOut' }));
        k.fx.boing();
        backOn(k);
        await k.hop(cast.knight, 20);
        await k.all(k.say('onward', cast.knight), brandish(k, cast.knight));
        await k.say(how === 'tapped' ? 'thanksPony' : 'thanksHarryPony', cast.knight);

        // The pony yawns. It would rather have a nap.
        k.set(k.part(pony, 'lids'), { opacity: 1 });
        neigh();
        giggle();
        await k.say('nap', hermione);
        await k.wait(400);
      },
    },

    // ==================================================== 4. Hide and seek
    {
      name: 'Hide and seek',
      set(k) {
        k.backdrop('grand-staircase');
        k.music('sneaky');
        cast.harry = k.character('harry', { x: 40, y: 445, w: 210 });
        cast.hermione = k.character('hermione', { x: 240, y: 448, w: 210 });
        // Three little paintings in a row on the wall. The Lady in Pink hides in the last one.
        const small = (x: number) => {
          k.prop('paintedField', { x: x + 16, y: 216, w: 147, z: 3 });
          k.prop('portraitFrame', { x, y: 200, w: 180, z: 6 });
        };
        [520, 730, 940].forEach(small);
        // She hides just out of sight: only the hem of her pink dress peeps in at the edge of the last painting.
        cast.lady = k.character('pinkLady', { x: 970, y: 268, w: 110, z: 4 });
        k.set(cast.lady, { opacity: 0 });
        cast.hem = k.add(pinkHem(), { x: 1040, y: 372, w: 60, z: 5 });
        cast.knight = k.character('sirCadogan', { x: 555, y: 260, w: 110, z: 5 });
        k.set(cast.knight, { opacity: 0 });
      },
      async play(k) {
        const { harry, hermione, knight, lady } = cast;
        await k.say('findHer', harry);
        k.fx.pop();
        await k.fade(knight, 1, 0.3);
        await k.all(k.say('leaveIt', knight), brandish(k, knight));
        // He pops from painting to painting.
        clipClop(4);
        await k.say('notThisOne', knight);
        k.fx.whizz();
        await k.to(knight, 0.5, { x: 210, ease: 'power1.inOut' });
        clipClop(4);
        await k.say('notThatOne', knight);
        k.music('magic');
        await k.say('pink', hermione);

        // His third turn: tap the painting with something pink in it.
        const spot = k.add('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"></svg>', { x: 960, y: 220, w: 140, h: 180, z: 20 });
        await k.tapToHelp(spot, { ask: 'askPainting', nudge: 'nudgePainting', helped: 'helpedPainting', by: harry, helper: hermione, size: 190 });
        k.remove(spot);
        k.fx.knock(2);
        k.fx.twinkle();
        await k.all(k.fade(cast.hem, 0, 0.4), k.to(lady, 0.8, { opacity: 1, ease: 'power1.out' }));
        await k.say('foundMe', lady);
        await k.say('soRude', lady);
        // Sir Cadogan hurries into the painting next door and bows.
        clipClop(4);
        await k.to(knight, 0.5, { x: 210 - 30, ease: 'power1.inOut' });
        await k.to(knight, 0.3, { rotation: -14, yoyo: true, repeat: 1 });
        await k.say('fairLady', knight);
        await k.say('gallant', lady);
        await k.wait(400);
      },
    },

    // ==================================================== 5. Home again
    {
      name: 'Home again',
      set(k) {
        k.backdrop('grand-staircase');
        k.music('cosy');
        painting(k);
        cast.parlour = k.prop('paintedParlour', { x: 600, y: 170, w: 360, z: 3 });
        k.set(cast.parlour, { opacity: 0 });
        cast.lady = k.character('pinkLady', { x: 650, y: 330, w: 260, z: 5 });
        k.set(cast.lady, { opacity: 0 });
        cast.harry = k.character('harry', { x: 40, y: 445, w: 200 });
        cast.ron = k.character('ron', { x: 190, y: 445, w: 200 });
        cast.hermione = k.character('hermione', { x: 340, y: 448, w: 200 });
      },
      async play(k) {
        const { harry, ron, hermione, knight, pony, parlour, lady } = cast;
        await k.all(k.say('farewell', knight), brandish(k, knight));
        await k.say('byeKnight', hermione);
        // Off he rides, out of the painting. The Lady in Pink's own painting comes back.
        clipClop(8);
        await k.to([pony, knight], 1.4, { x: 380, opacity: 0, ease: 'power1.in' });
        k.fx.twinkle();
        await k.fade(parlour, 1, 0.8);
        await k.fade(lady, 1, 0.6);
        k.music('magic');
        await k.say('homeSweet', lady);
        await k.say('whatNow', ron);
        await k.say('braveKnight', lady);
        await k.all(k.say('together', harry), k.hop(harry, 20));
        await k.say('thanksName', lady);
        sing();
        await k.to(k.pivot(k.part(lady, 'armR')), 0.4, { rotation: -16, yoyo: true, repeat: 3 });
        await warmEnding(k, { cast: [harry, ron, hermione], end: 'end' });
      },
    },
  ],
});
