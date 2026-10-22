/**
 * The Singing Valentine: a scene from the second Harry Potter book that the
 * film left out. Professor Lockhart turns Hogwarts pink for Valentine's Day
 * and hires grumpy dwarfs dressed as cupids to deliver singing valentines.
 * One of them is for Harry.
 *
 *   1. Pink everywhere. Breakfast in the Great Hall: pink hearts on the
 *      walls, pink confetti in Ron's cornflakes. Lockhart, in pink: Happy
 *      Valentine's Day! He's had forty-six cards already, and he has a
 *      surprise: his card-carrying cupids. One stomps in, beard and wings.
 *      "Hmph." They'll deliver valentines all day! Harry hopes nobody has
 *      sent him one. Ron: imagine a singing one!
 *   2. Run, Harry! Hurrying to lessons. Stomp, stomp: "Oi! You! Harry
 *      Potter! I've got a musical message!" Not in front of everybody! His
 *      first turn: he taps the suit of armour, and Harry hides behind it.
 *      The cupid stomps past… stops… sniffs… "Aha! I can see your
 *      glasses!" Run, Harry!
 *   3. The singing valentine. In a classroom the cupid catches Harry's bag.
 *      Rrrip! Books everywhere. "Stand still!" But his harp's out of tune.
 *      His second turn: he twangs the harp, and the song begins: "His eyes
 *      are as green as a fresh pickled toad…" Everyone laughs, Harry goes
 *      red, then laughs too. Ginny goes very pink and hurries away. Who
 *      sent it?
 *   4. Lockhart's hearts. At teatime Lockhart's marvellous idea, a shower of
 *      hearts, makes one giant heart that grows and grows. His fourth turn:
 *      he pops it. Confetti everywhere, and Lockhart's hair goes fluffy:
 *      "My beautiful hair!" Hermione thinks she knows who sent Harry's
 *      valentine: someone kind, and very shy. "Never you mind, Ron."
 *      After the song (his third turn) one of Harry's books is still on the
 *      floor: he drags it back into the bag.
 *   5. A card for someone shy. By the common-room fire Harry makes a
 *      thank-you card. His fifth turn: he drags it to Hedwig, who flies off
 *      with it. Meanwhile: Ginny opens
 *      it, "From Harry!", and hugs it. Happy Valentine's Day.
 *
 * The chase is the "scary" bit, and it is played for laughs: the cupid is
 * gruff and determined, never rough. In the book he sits on Harry's ankles;
 * here he only catches the bag. The song is the book's poem, short and
 * silly. Nobody teases Ginny: Hermione keeps her secret.
 */
import { cached, circle, defineCartoon, NOTE, noiseBurst, now, piece, svg, tone, type Kit } from '../../kit';
import { sounds as commonSounds } from '../../worlds/common/moves';
import { meanwhile, warmEnding } from '../../worlds/common/pieces';
import { moves as hogMoves } from '../../worlds/hogwarts/moves';
import { greatHall } from '../../worlds/hogwarts/pieces';
import meta from './meta';

const { giggle, laugh, sniff } = commonSounds;
const { flap, flyOff, hoot, swoopIn } = hogMoves;

// ------------------------------------------------------------------- art

/** Lockhart's hair after the heart pops: a big fluffy cloud of pink confetti, 220 × 130. */
const pinkFluff = cached(() =>
  svg({ w: 220, h: 130, name: 'valentine-pink-fluff', label: 'Pink fluff' }, [
    ...[[40, 80, 38], [90, 56, 46], [150, 60, 44], [186, 88, 32], [110, 96, 40], [60, 104, 28], [160, 104, 30]].map(([x, y, r], i) =>
      piece(circle(x, y, r), i % 2 ? '#ff9ab8' : '#ffc0d4'),
    ),
  ]),
);

// ---------------------------------------------------------------- sounds

/** The cupid's harp, out of tune: two sour little plinks. */
function plink(): void {
  const t = now();
  tone(NOTE.C5 * 1.06, t, { wave: 'triangle', peak: 0.08, decay: 0.5 });
  tone(NOTE.E5 * 0.94, t + 0.3, { wave: 'triangle', peak: 0.08, decay: 0.5 });
}

/** A big bright harp TWANG, a sweep of strings rising. */
function twang(): void {
  const t = now();
  [NOTE.C4, NOTE.E4, NOTE.G4, NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6].forEach((n, i) =>
    tone(n, t + i * 0.05, { wave: 'triangle', peak: 0.07, attack: 0.005, decay: 1.2 }),
  );
}

/** A strummed chord under each line of the song. */
function strum(root: number): void {
  const t = now();
  [1, 1.26, 1.5, 2].forEach((m, i) => tone(root * m, t + i * 0.04, { wave: 'triangle', peak: 0.05, attack: 0.005, decay: 1.4 }));
}

/** Something tearing: a quick ripping noise (Harry's bag). */
function rip(): void {
  const t = now();
  noiseBurst(t, { freq: 2600, q: 0.8, peak: 0.08, attack: 0.01, decay: 0.45 });
  noiseBurst(t + 0.08, { freq: 1800, q: 1.2, peak: 0.05, attack: 0.01, decay: 0.3 });
}

/** A balloon heart being blown up: a rising, squeaky stretch. */
function inflate(seconds = 2): void {
  const t = now();
  tone(NOTE.C4, t, { wave: 'sine', peak: 0.05, attack: 0.2, decay: seconds, glideTo: NOTE.C6, vibrato: [9, 6] });
  noiseBurst(t, { freq: 1200, q: 3, peak: 0.02, attack: 0.3, decay: seconds });
}

/** A sneeze: "ah… ah… CHOO!" */
function sneeze(): void {
  const t = now();
  tone(NOTE.E4, t, { wave: 'sine', peak: 0.04, attack: 0.2, decay: 0.3, glideTo: NOTE.G4 });
  tone(NOTE.F4, t + 0.45, { wave: 'sine', peak: 0.05, attack: 0.2, decay: 0.3, glideTo: NOTE.A4 });
  noiseBurst(t + 0.9, { freq: 2200, q: 0.8, peak: 0.08, attack: 0.01, decay: 0.3 });
}

// ------------------------------------------------------------------ cast

type Actor =
  | 'harry' | 'ron' | 'hermione' | 'ginny' | 'lockhart' | 'cupid' | 'hedwig'
  | 'knight' | 'harp' | 'bag' | 'heart' | 'card';
const cast = {} as Record<Actor, HTMLElement>;
let hall: ReturnType<typeof greatHall.set>;

/** Pink paper hearts strung across the top of a room. */
function garlands<K extends string>(k: Kit<K>, y = 30): void {
  k.prop('heartGarland', { x: -10, y, w: 600, z: 6 });
  k.prop('heartGarland', { x: 590, y: y + 10, w: 600, z: 6 });
}

/** The cupid stomps along by `dx`, his wings fluttering, with heavy little footsteps. */
async function stomp<K extends string>(k: Kit<K>, cupid: HTMLElement, dx: number, seconds = 1.4): Promise<void> {
  k.fx.stomp(Math.max(3, Math.round(seconds * 3)));
  void flap(k, cupid, Math.round(seconds * 3), 20);
  await k.walk(cupid, dx, seconds, Math.round(seconds * 3));
}

/** A line of the song, with a strum, the cupid bobbing his head. */
async function sing<K extends string>(k: Kit<K>, key: K, cupid: HTMLElement, root: number): Promise<void> {
  strum(root);
  await k.say(key, cupid);
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. Pink everywhere
    pink: { who: 'narrator', text: 'On Valentine’s Day, the Great Hall had gone pink. Pink hearts! Pink confetti!' },
    cornflakes: { who: 'ron', text: 'Urgh! There’s confetti in my cornflakes!' },
    whoDid: { who: 'harry', text: 'Who did all this?' },
    lockhartHello: { who: 'lockhart', text: 'Happy Valentine’s Day! Gilderoy Lockhart here, Order of Merlin, Third Class!' },
    fortySix: { who: 'lockhart', text: 'I’ve had forty-six valentines already! And I have a marvellous surprise.' },
    cupids: { who: 'lockhart', text: 'My friendly card-carrying cupids! Come in, come in!' },
    hmph: { who: 'dwarfCupid', text: 'Hmph.' },
    allDay: { who: 'lockhart', text: 'They’ll deliver valentines all day long! Isn’t that lovely, {name}?' },
    hopeNot: { who: 'harry', text: 'I hope nobody’s sent me one.' },
    singing: { who: 'ron', text: 'Imagine it, Harry. A singing one!' },
    // 2. Run, Harry!
    later: { who: 'narrator', text: 'Later, Harry and Ron were hurrying to lessons. Then they heard it.' },
    oi: { who: 'dwarfCupid', text: 'Oi! You! Harry Potter!' },
    itsHim: { who: 'harry', text: 'Oh no. It’s the cupid!' },
    message: { who: 'dwarfCupid', text: 'I’ve got a musical message for Harry Potter. In person!' },
    notHere: { who: 'harry', text: 'Not here! Not in front of everybody!' },
    askHide: { who: 'ron', text: 'Quick, hide! {name}, tap the suit of armour!' },
    nudgeHide: { who: 'ron', text: 'Tap the suit of armour!' },
    helpedHide: { who: 'harry', text: 'Behind the armour. Shh!' },
    whereGone: { who: 'dwarfCupid', text: 'Where’s he gone? Hmph.' },
    glasses: { who: 'dwarfCupid', text: 'Aha! I can see your glasses!' },
    run: { who: 'ron', text: 'Run, Harry!' },
    // 3. The singing valentine
    caught: { who: 'narrator', text: 'The cupid caught Harry’s bag. Rrrip! Books and quills went everywhere.' },
    standStill: { who: 'dwarfCupid', text: 'Stand still! Here is your singing valentine!' },
    outOfTune: { who: 'dwarfCupid', text: 'Hmph. My harp’s gone out of tune.' },
    askHarp: { who: 'ron', text: '{name}, give his harp a twang! Then it’s over quicker!' },
    nudgeHarp: { who: 'ron', text: 'Twang the harp!' },
    helpedHarp: { who: 'dwarfCupid', text: 'Never mind. I’ll twang it myself!' },
    song1: { who: 'dwarfCupid', text: 'His eyes are as green as a fresh pickled toad!' },
    song2: { who: 'dwarfCupid', text: 'His hair is as dark as a blackboard!' },
    song3: { who: 'dwarfCupid', text: 'I wish he was mine, he’s really divine, the hero who conquered the Dark Lord!' },
    pickled: { who: 'ron', text: 'A fresh pickled toad! Ha ha ha!' },
    tomato: { who: 'harry', text: 'My face is as red as a tomato! But… that was quite funny.' },
    mustGo: { who: 'ginny', text: 'Oh! Er… I have to go!' },
    askBook: { who: 'ron', text: 'Harry’s book is on the floor. {name}, can you drag it back into his bag?' },
    nudgeBook: { who: 'ron', text: 'Drag the book into the bag!' },
    helpedBook: { who: 'harry', text: 'Never mind. I’ll pop it in myself.' },
    thanksBook: { who: 'harry', text: 'Thank you! Safe and sound.' },
    whoSent: { who: 'harry', text: 'Who sent it, I wonder?' },
    // 4. Lockhart's hearts
    teatime: { who: 'narrator', text: 'At teatime, Professor Lockhart had one more marvellous idea.' },
    shower: { who: 'lockhart', text: 'Watch this! A shower of hearts, for everybody!' },
    tooBig: { who: 'hermione', text: 'Um, Professor? It’s getting rather big.' },
    nonsense: { who: 'lockhart', text: 'Nonsense! It’s perfectly marvellous!' },
    askPop: { who: 'hermione', text: '{name}, pop the heart, before it gets any bigger!' },
    nudgePop: { who: 'hermione', text: 'Tap the big heart!' },
    helpedPop: { who: 'ron', text: 'I’ll pop it! Here goes!' },
    myHair: { who: 'lockhart', text: 'My hair! My beautiful hair!' },
    sheep: { who: 'ron', text: 'He looks like a pink sheep!' },
    iKnow: { who: 'hermione', text: 'Harry, I think I know who sent your valentine. Someone kind, and very shy.' },
    who: { who: 'ron', text: 'Who? Tell us!' },
    never: { who: 'hermione', text: 'Never you mind, Ron Weasley.' },
    // 5. A card for someone shy
    evening: { who: 'narrator', text: 'That evening, by the fire, Harry made a card of his own.' },
    thankYou: { who: 'harry', text: 'Whoever sent my song was being kind. So I’ll say thank you.' },
    hedwigTake: { who: 'harry', text: 'Hedwig, take this to Ginny, please. Shh! Don’t tell Ron.' },
    askCard: { who: 'harry', text: 'Can you drag my card to Hedwig, {name}?' },
    nudgeCard: { who: 'harry', text: 'Drag the card to Hedwig!' },
    helpedCard: { who: 'harry', text: 'Never mind. I’ll give it to her myself.' },
    thanksCard: { who: 'harry', text: 'Perfect! Off you go, Hedwig.' },
    ronCard: { who: 'ron', text: 'Does anybody want to send me a valentine?' },
    notSinging: { who: 'hermione', text: 'Only if it’s not a singing one!' },
    meanwhileGinny: { who: 'narrator', text: 'And in a quiet corner of the common room…' },
    fromHarry: { who: 'ginny', text: 'For me? “Thank you for my song. From Harry.” Oh!' },
    end: { who: 'narrator', text: 'Happy Valentine’s Day, {name}. With love from everyone at Hogwarts.' },
  },
  scenes: [
    // ==================================================== 1. Pink everywhere
    {
      name: 'Pink everywhere',
      set(k) {
        k.backdrop('great-hall');
        hall = greatHall.set(k, {
          host: { id: 'lockhart', x: 480 },
          guests: [{ id: 'harry', x: 60 }, { id: 'ron', x: 260 }],
          music: 'magic',
        });
        cast.lockhart = hall.host!;
        [cast.harry, cast.ron] = hall.guests;
        garlands(k);
        k.set(cast.lockhart, { opacity: 0 });
        cast.cupid = k.character('dwarfCupid', { x: 820, y: 400, w: 220, flip: true });
        k.set(cast.cupid, { opacity: 0, x: 500 });
      },
      async play(k) {
        const { harry, ron, lockhart, cupid } = cast;
        k.confetti(24);
        await k.say('pink');
        await k.all(k.say('cornflakes', ron), k.shake(ron, 4, 2));
        await k.say('whoDid', harry);

        // Lockhart sweeps in, all in pink.
        k.sfx.fanfare();
        await k.all(k.fade(lockhart, 1, 0.5), k.pop(lockhart, 1.08));
        k.sparkle(590, 380, 12, 180);
        await k.say('lockhartHello', lockhart);
        await k.say('fortySix', lockhart);
        await k.say('cupids', lockhart);

        // A grumpy cupid stomps in.
        k.set(cupid, { opacity: 1 });
        await stomp(k, cupid, -500, 1.6);
        await k.say('hmph', cupid);
        await k.say('allDay', lockhart);
        await k.all(k.say('hopeNot', harry), k.shake(harry, 3, 2));
        giggle();
        await k.say('singing', ron);
      },
    },

    // ==================================================== 2. Run, Harry!
    {
      name: 'Run, Harry!',
      set(k) {
        k.backdrop('castle-corridor');
        k.music('sneaky');
        k.light(140, 245, 110, { color: '#ffcf7a', strength: 0.4, flicker: true, z: 5 });
        k.light(1040, 245, 110, { color: '#ffcf7a', strength: 0.4, flicker: true, z: 5 });
        garlands(k, 20);
        // The suit of armour is at the left: Harry hides behind it, away from the cupid.
        cast.knight = k.prop('knight', { x: 60, y: 250, w: 220, z: 14 });
        cast.harry = k.character('harry', { x: 330, y: 390, w: 230 });
        cast.ron = k.character('ron', { x: 540, y: 390, w: 230 });
        cast.cupid = k.character('dwarfCupid', { x: 880, y: 410, w: 210, flip: true });
        k.set(cast.cupid, { opacity: 0, x: 400 });
      },
      async play(k) {
        const { harry, ron, knight, cupid } = cast;
        await k.say('later');
        k.fx.stomp(4);
        await k.wait(1300);
        k.set(cupid, { opacity: 1 });
        await stomp(k, cupid, -400, 1.4);
        await k.say('oi', cupid);
        k.face(harry, true);
        await k.all(k.say('itsHim', harry), k.shake(harry, 4, 2));
        await k.say('message', cupid);
        await k.say('notHere', harry);

        // His first turn: hide Harry behind the suit of armour.
        await k.tapToHelp(knight, { ask: 'askHide', nudge: 'nudgeHide', helped: 'helpedHide', by: ron, helper: harry, size: 170 });
        k.fx.whizz();
        k.set(harry, { zIndex: 12 });
        await k.to(harry, 0.7, { x: -240, y: -20, scale: 0.85, ease: 'power2.inOut' });
        k.face(harry, false);

        // The cupid stomps closer… and stops.
        k.music('sneaky');
        await stomp(k, cupid, -120, 1.0);
        await k.say('whereGone', cupid);
        sniff();
        await k.wait(500);
        k.fx.uhoh();
        await k.say('glasses', cupid);
        await k.all(k.say('run', ron), k.hop(ron, 24));
        // Harry and Ron run off to the left, and the cupid stomps after them.
        k.fx.whizz();
        k.fx.patter(8);
        k.set(harry, { zIndex: 16 });
        k.face(ron, true);
        await k.all(
          k.to(harry, 0.9, { x: -700, ease: 'power2.in' }),
          k.wait(200).then(() => k.to(ron, 1.1, { x: -900, ease: 'power2.in' })),
        );
        await stomp(k, cupid, -1100, 2.2);
      },
    },

    // ==================================================== 3. The singing valentine
    {
      name: 'The singing valentine',
      set(k) {
        k.backdrop('classroom');
        k.music('sneaky');
        cast.ginny = k.character('ginny', { x: 30, y: 384, w: 220 });
        cast.harry = k.character('harry', { x: 260, y: 384, w: 230 });
        cast.bag = k.prop('schoolBag', { x: 440, y: 520, w: 130, z: 15 });
        cast.cupid = k.character('dwarfCupid', { x: 560, y: 410, w: 210, flip: true });
        cast.harp = k.prop('harp', { x: 740, y: 430, w: 160, z: 15 });
        cast.ron = k.character('ron', { x: 900, y: 384, w: 230, flip: false });
      },
      async play(k) {
        const { ginny, harry, bag, cupid, harp, ron } = cast;
        await k.wait(300);
        const spill: HTMLElement[] = [
          k.prop('spellbook', { x: 430, y: 560, w: 110, z: 16 }),
          k.prop('quill', { x: 470, y: 570, w: 80, z: 16 }),
          k.prop('spellbook', { x: 500, y: 570, w: 80, z: 16 }),
        ];
        k.set(spill, { opacity: 0 });
        // Rrrip! comes on the word, with the books flying out.
        await k.all(
          k.say('caught'),
          k.wait(1600).then(() => {
            rip();
            k.quake(3);
            k.set(spill, { opacity: 1 });
          }),
        );
        await k.all(
          k.to(spill[0], 0.5, { x: -230, y: 0, rotation: -40, ease: 'power2.out' }),
          k.to(spill[1], 0.5, { x: 120, y: 70, rotation: 70, ease: 'power2.out' }),
          k.to(spill[2], 0.5, { x: 40, y: 80, rotation: 20, ease: 'power2.out' }),
          k.shake(bag, 6, 2),
          k.shake(harry, 4, 2),
        );
        await k.say('standStill', cupid);
        plink();
        await k.shake(harp, 3, 2);
        await k.say('outOfTune', cupid);

        // His second turn: twang the harp.
        await k.tapToHelp(harp, { ask: 'askHarp', nudge: 'nudgeHarp', helped: 'helpedHarp', by: ron, helper: cupid, size: 150 });
        twang();
        const strings = k.part(harp, 'strings');
        if (strings.length) void k.to(strings, 0.08, { x: 2, yoyo: true, repeat: 9 });
        k.sparkle(820, 540, 10, 100);
        k.music('magic');
        await k.wait(600);

        // The song.
        await sing(k, 'song1', cupid, NOTE.C4);
        await sing(k, 'song2', cupid, NOTE.F3);
        await sing(k, 'song3', cupid, NOTE.G3);
        twang();
        laugh();
        await k.all(k.shake(ron, 5, 4), k.shake(ginny, 3, 2));
        await k.say('pickled', ron);
        await k.glow('#ff9aa8', 0.3, 0.8);
        await k.say('tomato', harry);
        laugh();
        await k.shake(harry, 4, 3);

        // Ginny goes very pink and hurries away.
        await k.say('mustGo', ginny);
        k.fx.patter(6);
        await k.exit(ginny, 'left', 0.7);

        // His third turn: drag the fallen book back into Harry's bag.
        const bookHow = await k.dragToHelp(spill[0], { to: bag, ask: 'askBook', nudge: 'nudgeBook', helped: 'helpedBook', by: ron, helper: harry, dropSize: 170 });
        await k.all(k.vanish(spill[0]), k.shake(bag, 5, 2));
        if (bookHow === 'dragged') await k.say('thanksBook', harry);
        await k.say('whoSent', harry);
      },
    },

    // ==================================================== 4. Lockhart's hearts
    {
      name: 'Lockhart’s hearts',
      set(k) {
        k.backdrop('great-hall');
        hall = greatHall.set(k, {
          host: { id: 'lockhart', x: 480 },
          guests: [{ id: 'hermione', x: 60 }, { id: 'ron', x: 260 }, { id: 'harry', x: 850, flip: true }],
          music: 'magic',
        });
        cast.lockhart = hall.host!;
        [cast.hermione, cast.ron, cast.harry] = hall.guests;
        garlands(k);
        cast.heart = k.prop('bigHeart', { x: 520, y: 120, w: 140, z: 25 });
        k.set(cast.heart, { opacity: 0, scale: 0.3 });
      },
      async play(k) {
        const { hermione, ron, harry, lockhart, heart } = cast;
        await k.say('teatime');
        await k.say('shower', lockhart);

        // A flick of his wand, and a heart grows… and grows.
        k.fx.spell();
        k.sparkle(600, 240, 10, 120);
        await k.to(heart, 0.6, { opacity: 1, scale: 1, ease: 'back.out(1.6)' });
        inflate(2.2);
        await k.to(heart, 2.2, { scale: 1.8, y: -20, ease: 'sine.inOut' });
        await k.say('tooBig', hermione);
        inflate(1.6);
        await k.to(heart, 1.4, { scale: 2.2, ease: 'sine.inOut' });
        await k.say('nonsense', lockhart);

        // His fourth turn: pop it.
        await k.tapToHelp(heart, { ask: 'askPop', nudge: 'nudgePop', helped: 'helpedPop', by: hermione, helper: ron, size: 240 });
        const hb = k.box(heart);
        const [hx, hy] = [hb.x + hb.w / 2, hb.y + hb.h / 2];
        k.fx.pop();
        k.sfx.boom();
        k.puff(hx, hy, 300, '#ff9ab8');
        k.remove(heart);
        k.confetti(40);
        // It all lands on Lockhart's head: a big pink fluffy hairdo.
        const { face } = k.box(lockhart);
        const fluff = k.add(pinkFluff(), { x: face.cx - 115, y: face.y - 108, w: 230, z: 22 });
        k.set(fluff, { opacity: 0, y: -200 });
        await k.to(fluff, 0.6, { opacity: 1, y: 0, ease: 'bounce.out' });
        sneeze();
        await k.wait(900);
        await k.all(k.shake(lockhart, 6, 3), k.say('myHair', lockhart));
        laugh();
        await k.all(k.say('sheep', ron), k.hop(ron, 24));
        k.music('cosy');
        k.face(hermione, false);
        await k.say('iKnow', hermione);
        await k.say('who', ron);
        await k.say('never', hermione);
        giggle();
        await k.hop(harry, 20);
      },
    },

    // ==================================================== 5. A card for someone shy
    {
      name: 'A card for someone shy',
      set(k) {
        k.backdrop('common-room');
        k.music('cosy');
        k.prop('flame', { x: 545, y: 455, w: 110, z: 4 });
        k.light(560, 470, 220, { color: '#ffb060', strength: 0.4, flicker: true, z: 5 });
        cast.ron = k.character('ron', { x: 60, y: 400, w: 230 });
        cast.hermione = k.character('hermione', { x: 260, y: 404, w: 230 });
        cast.harry = k.character('harry', { x: 760, y: 400, w: 240, flip: true });
        cast.card = k.prop('valentineCard', { x: 700, y: 540, w: 120, z: 16 });
        cast.hedwig = k.character('hedwig', { x: 980, y: 250, w: 150, pose: 'fly', flip: true });
        k.set(cast.hedwig, { opacity: 0 });
      },
      async play(k) {
        const { ron, hermione, harry, card, hedwig } = cast;
        await k.say('evening');
        await k.pop(card, 1.1);
        await k.say('thankYou', harry);
        await k.say('hedwigTake', harry);
        await swoopIn(k, hedwig, 'right', 1.1);
        await hoot(k, hedwig, 1);

        // His fifth turn: drag the card to Hedwig, who flies off with it.
        const cardHow = await k.dragToHelp(card, { to: hedwig, ask: 'askCard', nudge: 'nudgeCard', helped: 'helpedCard', by: harry, dropSize: 200 });
        if (cardHow === 'dragged') await k.say('thanksCard', harry);
        await k.all(flyOff(k, hedwig, 'right', 1.2), k.to(card, 1.2, { x: '+=420', y: '-=420', opacity: 0, ease: 'power1.in' }));
        await k.say('ronCard', ron);
        await k.say('notSinging', hermione);
        giggle();

        // Meanwhile, in a quiet corner: Ginny.
        const g = await meanwhile(k, {
          line: 'meanwhileGinny',
          build: () => {
            k.backdrop('common-room');
            k.prop('flame', { x: 545, y: 455, w: 110, z: 4 });
            k.light(560, 470, 220, { color: '#ffb060', strength: 0.4, flicker: true, z: 5 });
            return {
              ginny: k.character('ginny', { x: 470, y: 400, w: 240 }),
              card: k.prop('valentineCard', { x: 520, y: 560, w: 130, z: 16 }),
            };
          },
        });
        await k.pop(g.card, 1.1);
        await k.say('fromHarry', g.ginny);
        k.sparkle(590, 450, 16, 220);
        k.fx.twinkle();
        await k.hop(g.ginny, 30, 2);
        await warmEnding(k, { cast: [g.ginny], end: 'end' });
      },
    },
  ],
});
