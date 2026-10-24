/**
 * Goodbye, Norbert: a scene from the first Harry Potter book that the film
 * only talks about. Hagrid's baby dragon is getting too big for a wooden
 * hut, so at midnight Harry and Hermione carry him up the tallest tower to
 * be flown away to Romania.
 *
 *   1. Too big for the hut. Hagrid's secret: a baby dragon called Norbert,
 *      by the fire in the hut. He hiccups smoke. "He's only little!" Not
 *      any more. Hagrid's pie sits on the floor and Norbert's
 *      tummy rumbles, so Hagrid carries the pie to Norbert. Gulp! Norbert grows
 *      with a pop and his tail knocks the pans flying.
 *      Hermione: the hut is wooden, and dragons breathe fire. Harry: dragons
 *      aren't allowed. But Ron's brother Charlie looks after dragons, and he
 *      wrote back: his friend will fetch Norbert at midnight on Saturday,
 *      from the top of the tallest tower. Honk! Hagrid's enormous hanky.
 *   2. Packing the crate. Saturday night. Norbert peeps out of his crate,
 *      but he's too wriggly to settle. He wants his teddy. Hagrid
 *      pops the teddy into the crate. A tiny snore. Hagrid:
 *      "Goodbye, Norbert. Mummy will never forget you." Then the
 *      Invisibility Cloak sweeps over Harry, Hermione and the crate, and
 *      they're gone (Hagrid: "Blimey! Where've you gone?").
 *   3. Under the cloak. Creeping up the dark stairs, faint and shimmering.
 *      Footsteps. A lantern. Professor Snape, slowly: "Who… is… there?" The
 *      crate is poking out of the cloak! Hermione tucks it
 *      back under. Norbert hiccups one little puff of smoke. "Smoke?
 *      Peeves, no doubt." Snape sweeps off. Phew!
 *   4. Midnight at the top. Off with the cloak at the top of the tower. It's
 *      too dark for anyone to see them. Hermione lights the
 *      lantern. A broomstick swoops down past the moon: Charlie's friend.
 *      Norbert peeps out and squeaks; she ties the crate under her broom and
 *      off they fly, past the moon. Goodbye, Norbert! Be a good dragon!
 *   5. A letter from Romania. A week later, Hagrid misses him. Hedwig brings
 *      a letter: Norbert is happy, with lots of dragon friends, and there's
 *      a wizard picture of him waving. Happy tears, and one last honk. Far
 *      away, a little dragon hiccups a puff of smoke. Hagrid's happy tears
 *      need his hanky, which he's dropped: Harry hands it up to
 *      him. Honk!
 *
 * The scary beat is Snape in the dark corridor: sound first (footsteps, a
 * lantern), one push-in, then back to the friends, who are clever and
 * still. In the book Ron is in the hospital wing with a bitten hand and
 * Harry and Hermione are caught afterwards; neither belongs in a cartoon,
 * so Ron is simply away and the episode ends at Hagrid's table. Norbert
 * never bites anyone: he hiccups smoke and sparks, and squeaks.
 */
import { C, NOTE, cached, circle, defineCartoon, ink, noiseBurst, now, piece, rect, svg, tone, type Kit } from '../../kit';
import { sounds as commonSounds } from '../../worlds/common/moves';
import { sneakIn, warmEnding } from '../../worlds/common/pieces';
import { moves as hogMoves, sounds as hogSounds } from '../../worlds/hogwarts/moves';
import { broomArrival, owlPost } from '../../worlds/hogwarts/pieces';
import meta from './meta';

const { bellyLaugh, fireCrackle } = hogSounds;
const { flap, swishCloak } = hogMoves;
const { sniff } = commonSounds;

// ------------------------------------------------------------------- art

/** A rope sling (200 × 170): two ropes from a broom down to the crate's corners. */
const sling = cached(() =>
  svg({ w: 200, h: 170, name: 'norbert-sling', label: 'Ropes' }, [
    ink([[100, 6], [16, 164]], { width: 5, color: '#b08a5a' }),
    ink([[100, 6], [184, 164]], { width: 5, color: '#b08a5a' }),
    piece(circle(100, 8, 8), '#8a6a3e', { edge: 'cut' }),
  ]),
);

/** The wizard picture from Romania (220 × 180): a gold frame round a sky-blue window. Norbert waves inside it. */
const frameBack = cached(() =>
  svg({ w: 220, h: 180, name: 'norbert-picture-back', label: 'A picture' }, [
    piece(rect(10, 10, 200, 160, 4), '#9cc4dc', { edge: 'cut' }),
    piece(rect(10, 120, 200, 50, 2), '#7a9a5a', { edge: 'cut', shadow: false }),
    piece(circle(170, 46, 16), '#f4e2a0', { edge: 'clean', shadow: false }),
  ]),
);
const frameFront = cached(() =>
  svg({ w: 220, h: 180, name: 'norbert-picture-frame', label: 'A gold frame' }, [
    piece(rect(0, 0, 220, 16, 3), C.gold, { edge: 'cut' }),
    piece(rect(0, 164, 220, 16, 3), C.gold, { edge: 'cut' }),
    piece(rect(0, 0, 16, 180, 3), C.gold, { edge: 'cut' }),
    piece(rect(204, 0, 16, 180, 3), C.gold, { edge: 'cut' }),
  ]),
);

// ---------------------------------------------------------------- sounds

/** Norbert's hiccup: a little "hic!" and a soft puff of smoke. */
function hic(): void {
  const t = now();
  tone(NOTE.E5, t, { wave: 'triangle', peak: 0.08, attack: 0.01, decay: 0.12, glideTo: NOTE.A5 });
  noiseBurst(t + 0.06, { freq: 700, q: 1.5, peak: 0.05, attack: 0.02, decay: 0.35 });
}

/** Norbert's squeak: a happy little chirrup, rising. */
function chirrup(): void {
  const t = now();
  tone(NOTE.C6, t, { wave: 'sine', peak: 0.07, attack: 0.02, decay: 0.14, glideTo: NOTE.G6 });
  tone(NOTE.E6, t + 0.16, { wave: 'sine', peak: 0.06, attack: 0.02, decay: 0.16, glideTo: NOTE.C7 });
}

/** A tiny dragon snore: two soft, slow breaths. */
function snore(): void {
  const t = now();
  [0, 1.1].forEach((d) => {
    noiseBurst(t + d, { freq: 400, q: 2, peak: 0.035, attack: 0.4, decay: 0.5 });
    tone(110, t + d + 0.1, { wave: 'sine', peak: 0.03, attack: 0.3, decay: 0.4 });
  });
}

/** Hagrid blowing his nose: one big, wobbly, comic honk. */
function honk(): void {
  const t = now();
  tone(110, t, { wave: 'sawtooth', peak: 0.09, attack: 0.03, decay: 0.7, glideTo: 87, lowpass: 700, vibrato: [12, 14] });
  noiseBurst(t, { freq: 300, q: 1.5, peak: 0.04, attack: 0.03, decay: 0.6 });
}

/** Pans clattering off a shelf (never onto anyone). */
function clatter(): void {
  const t = now();
  [0, 0.12, 0.22, 0.4].forEach((d, i) => {
    tone([880, 660, 990, 740][i], t + d, { wave: 'triangle', peak: 0.07, decay: 0.25 });
    noiseBurst(t + d, { freq: 2400, q: 3, peak: 0.04, decay: 0.15 });
  });
}

/** Slow footsteps on stone, coming closer: soft, then louder. */
function footsteps(steps = 4): void {
  const t = now();
  for (let i = 0; i < steps; i++) {
    const p = 0.04 + (i / steps) * 0.06;
    noiseBurst(t + i * 0.7, { freq: 260, q: 2, peak: p, attack: 0.01, decay: 0.12 });
    tone(80, t + i * 0.7, { wave: 'sine', peak: p, decay: 0.15 });
  }
}

/** The Invisibility Cloak: a soft, silvery shimmer of rising notes. */
function shimmer(): void {
  const t = now();
  [NOTE.E5, NOTE.G5, NOTE.B5, NOTE.E6].forEach((n, i) => tone(n, t + i * 0.09, { wave: 'sine', peak: 0.04, attack: 0.05, decay: 0.6 }));
  noiseBurst(t, { freq: 5000, q: 3, peak: 0.015, attack: 0.3, decay: 0.8 });
}

// ------------------------------------------------------------------ cast

type Actor =
  | 'hagrid' | 'harry' | 'hermione' | 'norbert' | 'snape' | 'keeper' | 'hedwig'
  | 'crate' | 'teddy' | 'cloak' | 'lantern' | 'glow' | 'broom' | 'hanky' | 'pie';
const cast = {} as Record<Actor, HTMLElement>;
let arrival: ReturnType<typeof broomArrival.set>;
let post: ReturnType<typeof owlPost.set>;

/** How faint Harry, Hermione and the crate are under the Invisibility Cloak. */
const CLOAKED = 0.28;

/** Norbert hiccups: a jump, a "hic!", and a little puff of smoke and sparks from his snout. */
async function hiccup<K extends string>(k: Kit<K>, norbert: HTMLElement, big = false): Promise<void> {
  const { face } = k.box(norbert);
  hic();
  k.puff(face.cx, face.y + face.h * 0.75, big ? 120 : 80, '#9a9a9a');
  if (big) k.sparkle(face.cx, face.y + face.h * 0.7, 6, 60);
  await k.pop(norbert, 1.08);
}

/** Hagrid's enormous hanky comes up to his nose: honk! */
async function blowNose<K extends string>(k: Kit<K>, hagrid: HTMLElement): Promise<void> {
  const { face } = k.box(hagrid);
  const hanky = k.prop('hanky', { x: face.cx - 70, y: face.y + face.h * 0.45, w: 140, z: 25 });
  k.set(hanky, { opacity: 0 });
  await k.fade(hanky, 1, 0.25);
  honk();
  await k.shake(hagrid, 5, 3);
  await k.fade(hanky, 0, 0.3);
  k.remove(hanky);
}

/** Norbert waves his wings (and tail, if he has one) happily. */
async function flutterWings<K extends string>(k: Kit<K>, norbert: HTMLElement, beats = 3): Promise<void> {
  const tail = k.pivot(k.part(norbert, 'tail'));
  if (tail.length) void k.to(tail, 0.3, { rotation: 18, yoyo: true, repeat: beats * 2 - 1, ease: 'sine.inOut' });
  await flap(k, norbert, beats, 26);
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. Too big for the hut
    secret: { who: 'narrator', text: 'Hagrid had a secret. A baby dragon called Norbert lived in his hut.' },
    comeIn: { who: 'hagrid', text: 'Come in, come in! Say hello to Norbert. Isn’t he lovely?' },
    hiccupSmoke: { who: 'harry', text: 'He just hiccupped smoke!' },
    onlyLittle: { who: 'hagrid', text: 'Bless him. He’s only little.' },
    helpedPie: { who: 'hagrid', text: 'His tummy is rumbling. Here’s his pie, Norbert.' },
    gobbled: { who: 'harry', text: 'Wow, he gobbled it all up! Oh… he’s getting bigger!' },
    notLittle: { who: 'hermione', text: 'Little? Hagrid, he’s twice as big as last week!' },
    woodenHut: { who: 'hermione', text: 'And your hut is made of wood. Dragons breathe fire!' },
    notAllowed: { who: 'harry', text: 'And dragons aren’t allowed at Hogwarts!' },
    myBaby: { who: 'hagrid', text: 'But he’s my baby. Where else can he go?' },
    charlie: { who: 'harry', text: 'Ron’s big brother Charlie looks after dragons. In Romania!' },
    wroteBack: { who: 'hermione', text: 'And Charlie wrote back! His friend will come at midnight on Saturday, to the tallest tower.' },
    otherDragons: { who: 'hagrid', text: 'Hear that, Norbert? You’re off to live with other dragons.' },
    honk: { who: 'narrator', text: 'Honk! Hagrid blew his nose on his enormous spotty hanky.' },
    // 2. Packing the crate
    saturday: { who: 'narrator', text: 'On Saturday night, Norbert’s crate was ready by the fire.' },
    wriggly: { who: 'hermione', text: 'He’s so wriggly! He won’t settle down.' },
    wantsTeddy: { who: 'hagrid', text: 'He wants his teddy. He never goes to sleep without it.' },
    helpedTeddy: { who: 'hagrid', text: 'Here we go, teddy. In you pop.' },
    cuddling: { who: 'hermione', text: 'Aww. He’s cuddling it!' },
    thanksHagrid: { who: 'harry', text: 'Thanks, Hagrid. He’s all snuggly now.' },
    mummy: { who: 'hagrid', text: 'Goodbye, Norbert. Mummy will never forget you.' },
    lookAfter: { who: 'harry', text: 'Don’t worry, Hagrid. We’ll look after him.' },
    cloak: { who: 'hermione', text: 'Now, under the Invisibility Cloak. Then nobody can see us.' },
    whereGone: { who: 'hagrid', text: 'Blimey! Where’ve you gone?' },
    stillHere: { who: 'harry', text: 'We’re still here, Hagrid! To the tower. Not a sound.' },
    // 3. Under the cloak
    crept: { who: 'narrator', text: 'Up the dark stairs they crept. The crate was very, very heavy.' },
    shh: { who: 'harry', text: 'Shh! Somebody’s coming.' },
    whoThere: { who: 'snape', text: 'Who… is… there?' },
    breathing: { who: 'snape', text: 'I can hear breathing.' },
    keepStill: { who: 'hermione', text: 'Keep very still. He can’t see us.' },
    pokingOut: { who: 'harry', text: 'Oh no! The crate is poking out of the cloak!' },
    helpedTuck: { who: 'hermione', text: 'Quick, but quiet! Tuck it back under.' },
    smoke: { who: 'snape', text: 'Smoke? Hmm.' },
    peeves: { who: 'snape', text: 'Peeves, no doubt. Playing with candles again.' },
    close: { who: 'harry', text: 'Phew. That was close! Come on, up to the top!' },
    // 4. Midnight at the top
    top: { who: 'narrator', text: 'At last they came out at the very top of the tower. It was midnight.' },
    madeIt: { who: 'harry', text: 'We made it! Off with the cloak.' },
    whereFriend: { who: 'hermione', text: 'But where is Charlie’s friend?' },
    dark: { who: 'harry', text: 'It’s so dark up here. She’ll never see us.' },
    helpedLantern: { who: 'hermione', text: 'We need a light. I’ll light the lantern. There!' },
    look: { who: 'harry', text: 'Look! Up by the moon!' },
    hello: { who: 'dragonKeeper', text: 'Hello! You must be Harry and Hermione. Charlie sends his love!' },
    likesTeddy: { who: 'hermione', text: 'This is Norbert. He loves his teddy.' },
    playWith: { who: 'dragonKeeper', text: 'He’ll love Romania. There are lots of other dragons to play with.' },
    upWeGo: { who: 'dragonKeeper', text: 'Hold on tight, Norbert. Up we go!' },
    goodbye: { who: 'harry', text: 'Goodbye, Norbert!' },
    beGood: { who: 'hermione', text: 'Be a good dragon!' },
    // 5. A letter from Romania
    nextWeek: { who: 'narrator', text: 'A week later, Hagrid’s hut was very quiet.' },
    missHim: { who: 'hagrid', text: 'I do miss him. I hope he’s not lonely.' },
    letter: { who: 'harry', text: 'Look, Hagrid! Hedwig has brought you a letter.' },
    fromCharlie: { who: 'hagrid', text: 'It’s from Charlie, in Romania!' },
    happy: { who: 'hagrid', text: 'Norbert is very happy. He’s got lots of dragon friends.' },
    picture: { who: 'hermione', text: 'And there’s a wizard picture! Look, he’s waving!' },
    happyTears: { who: 'hagrid', text: 'Don’t mind me. Happy tears! Only happy ones.' },
    helpedHanky: { who: 'harry', text: 'Oh, Hagrid’s dropped his hanky! Here, Hagrid.' },
    thanksHarry: { who: 'hagrid', text: 'Thanks, Harry. Just what I needed!' },
    thanksName: { who: 'hagrid', text: 'Thank you both. You helped my Norbert get a proper home.' },
    end: { who: 'narrator', text: 'And far away in Romania, a little dragon hiccupped a puff of smoke, and smiled.' },
  },
  scenes: [
    // ==================================================== 1. Too big for the hut
    {
      name: 'Too big for the hut',
      set(k) {
        k.backdrop('hagrids-hut');
        k.music('cosy');
        k.prop('flame', { x: 440, y: 430, w: 100, z: 2 });
        k.light(500, 480, 170, { strength: 0.4, flicker: true, z: 5 });
        cast.harry = k.character('harry', { x: 30, y: 370, w: 250 });
        cast.hermione = k.character('hermione', { x: 230, y: 378, w: 240 });
        cast.norbert = k.character('norbert', { x: 500, y: 420, w: 190, z: 12 });
        cast.hagrid = k.character('hagrid', { x: 780, y: 232, w: 380, flip: true });
        // Hagrid's pie for Norbert, on the floor in front of him.
        cast.pie = k.prop('pie', { x: 780, y: 545, w: 170, z: 16 });
      },
      async play(k) {
        const { harry, hermione, norbert, hagrid, pie } = cast;
        fireCrackle(4);
        await k.wait(400);
        await k.say('secret');
        await k.all(k.say('comeIn', hagrid), k.wait(900).then(() => flutterWings(k, norbert, 2)));
        chirrup();
        await k.wait(300);
        await hiccup(k, norbert, true);
        await k.all(k.say('hiccupSmoke', harry), k.shake(harry, 3, 2));
        await k.say('onlyLittle', hagrid);

        // Hagrid carries the pie to Norbert. He gobbles it, and grows.
        await k.say('helpedPie', hagrid);
        await k.carry(pie, norbert);
        await k.all(k.vanish(pie), k.pop(norbert, 1.1));
        chirrup();

        // Not little any more: he grows with a pop, and his tail knocks the pans flying.
        k.fx.boing();
        await k.to(norbert, 0.6, { scale: 1.22, ease: 'back.out(2)' });
        clatter();
        k.quake(3);
        await k.all(k.say('gobbled', harry), k.shake(hermione, 4, 2), k.shake(hagrid, 3, 2));
        await k.say('notLittle', hermione);
        await k.say('woodenHut', hermione);
        await k.say('notAllowed', harry);
        k.music('dreamy');
        await k.say('myBaby', hagrid);

        // Charlie, in Romania.
        k.music('magic');
        await k.all(k.say('charlie', harry), k.hop(harry, 26));
        k.sfx.page();
        await k.say('wroteBack', hermione);
        await k.say('otherDragons', hagrid);
        chirrup();
        await flutterWings(k, norbert, 2);
        await blowNose(k, hagrid);
        await k.say('honk');
        await k.wait(300);
      },
    },

    // ==================================================== 2. Packing the crate
    {
      name: 'Packing the crate',
      set(k) {
        k.backdrop('hagrids-hut');
        k.music('cosy');
        k.prop('flame', { x: 545, y: 420, w: 110, z: 2 });
        k.light(590, 480, 170, { strength: 0.35, flicker: true, z: 5 });
        k.dim(0.2, '#101830');
        cast.harry = k.character('harry', { x: 20, y: 380, w: 230 });
        cast.hermione = k.character('hermione', { x: 210, y: 384, w: 230 });
        // Norbert sits in the crate, peeping over the side (he's behind it).
        cast.norbert = k.character('norbert', { x: 482, y: 362, w: 170, z: 12 });
        cast.crate = k.prop('crate', { x: 455, y: 470, w: 220, z: 14 });
        cast.teddy = k.prop('teddy', { x: 680, y: 560, w: 96, z: 16 });
        cast.hagrid = k.character('hagrid', { x: 790, y: 232, w: 380, flip: true });
        cast.cloak = k.prop('invisibilityCloak', { x: 160, y: 420, w: 260, z: 20 });
        k.set(cast.cloak, { opacity: 0 });
      },
      async play(k) {
        const { harry, hermione, norbert, crate, teddy, hagrid, cloak } = cast;
        fireCrackle(3);
        await k.say('saturday');

        // Too wriggly to settle: the crate rocks.
        chirrup();
        await k.all(k.shake(norbert, 6, 3), k.shake(crate, 4, 3));
        await k.say('wriggly', hermione);
        await k.all(k.shake(norbert, 6, 2), k.shake(crate, 4, 2));
        await k.say('wantsTeddy', hagrid);

        // Hagrid pops the teddy in the crate.
        await k.say('helpedTeddy', hagrid);
        k.flourish(teddy);
        k.fx.boing();
        await k.to(teddy, 0.45, { x: -130, y: -150, rotation: -20, ease: 'power1.out' });
        await k.to(teddy, 0.3, { y: -60, ease: 'power1.in' });
        k.set(teddy, { opacity: 0 });
        k.fx.pop();
        await k.pop(norbert, 1.06);
        // He snuggles down into the crate, and snores.
        await k.to(norbert, 0.9, { y: 30, ease: 'sine.inOut' });
        snore();
        k.set(k.part(norbert, 'lids'), { opacity: 1 });
        await k.say('cuddling', hermione);
        await k.say('thanksHagrid', harry);

        k.music('dreamy');
        await k.say('mummy', hagrid);
        await k.shake(hagrid, 3, 2);
        await k.say('lookAfter', harry);

        // Under the cloak: Harry, Hermione and the crate fade to a shimmer.
        k.music('sneaky');
        await k.say('cloak', hermione);
        shimmer();
        await k.fade(cloak, 0.9, 0.4);
        await k.to(cloak, 0.7, { x: 240, scale: 2.2, opacity: 0, ease: 'power1.inOut' });
        k.sparkle(330, 470, 10, 300);
        await k.all(...[harry, hermione, crate, norbert].map((el) => k.fade(el, CLOAKED, 0.7)));
        await k.all(k.say('whereGone', hagrid), k.shake(hagrid, 4, 2));
        bellyLaugh();
        await k.say('stillHere', harry);
      },
    },

    // ==================================================== 3. Under the cloak
    {
      name: 'Under the cloak',
      set(k) {
        k.backdrop('castle-corridor');
        k.music('sneaky');
        k.dim(0.35, '#0c1226');
        k.light(140, 245, 110, { color: '#ffcf7a', strength: 0.35, flicker: true, z: 5 });
        k.light(1040, 245, 110, { color: '#ffcf7a', strength: 0.35, flicker: true, z: 5 });
        cast.harry = k.character('harry', { x: 80, y: 390, w: 230 });
        cast.crate = k.prop('crate', { x: 250, y: 500, w: 190, z: 14 });
        cast.hermione = k.character('hermione', { x: 380, y: 396, w: 230 });
        k.set([cast.harry, cast.crate, cast.hermione], { opacity: CLOAKED });
        sneakIn.set(k, [cast.harry, cast.crate, cast.hermione], { distance: 700 });
        cast.snape = k.character('snape', { x: 820, y: 370, w: 260, flip: true });
        cast.lantern = k.prop('lantern', { x: 770, y: 480, w: 130, z: 15 });
        cast.glow = k.light(820, 520, 150, { color: '#ffcf7a', strength: 0.4 });
        k.set([cast.snape, cast.lantern, cast.glow], { x: 600 });
      },
      async play(k) {
        const { harry, crate, hermione, snape, lantern, glow } = cast;
        await k.all(k.say('crept'), k.wait(500).then(() => sneakIn.play(k, { walkers: [harry, crate, hermione], distance: 700, seconds: 2.6, hops: 8 })));

        // Footsteps. A lantern. Someone is coming.
        k.silence();
        footsteps(4);
        await k.wait(1200);
        await k.say('shh', harry);
        footsteps(3);
        k.music('spooky');
        await k.to([snape, lantern, glow], 2.4, { x: 0, ease: 'power1.out' });
        await k.wait(500);
        await k.camera({ zoom: 1.3, x: 900, y: 420 }, 1.2);
        await k.say('whoThere', snape);
        sniff();
        await k.say('breathing', snape);
        await k.camera({}, 0.9);

        // Back to the friends: keep very still.
        await k.say('keepStill', hermione);
        k.fx.uhoh();
        await k.to(crate, 0.6, { opacity: 1, y: 30, ease: 'power1.out' });
        await k.shake(crate, 5, 2);
        await k.say('pokingOut', harry);

        // Hermione tucks the crate back under the cloak.
        await k.say('helpedTuck', hermione);
        k.flourish(crate);
        shimmer();
        await k.to(crate, 0.5, { opacity: CLOAKED, y: 0, ease: 'power1.inOut' });
        await k.wait(500);

        // A hiccup from inside the crate: one little puff of smoke.
        hic();
        k.puff(345, 480, 80, '#9a9a9a');
        await k.wait(600);
        sniff();
        await k.say('smoke', snape);
        await k.wait(400);
        await k.say('peeves', snape);
        k.face(snape, false);
        await swishCloak(k, snape);
        footsteps(3);
        await k.to([snape, lantern, glow], 1.6, { x: 600, opacity: 0, ease: 'power1.in' });

        k.music('sneaky');
        await k.say('close', harry);
      },
    },

    // ==================================================== 4. Midnight at the top
    {
      name: 'Midnight at the top',
      set(k) {
        k.backdrop('astronomy-tower');
        k.music('dreamy');
        k.ambient('stars', { count: 16, area: [0, 0, 1180, 360] });
        cast.harry = k.character('harry', { x: 130, y: 390, w: 230 });
        cast.hermione = k.character('hermione', { x: 330, y: 396, w: 230 });
        cast.lantern = k.prop('lantern', { x: 550, y: 540, w: 100, z: 15 });
        cast.glow = k.light(600, 560, 170, { color: '#ffcf7a', strength: 0.55 });
        k.set(cast.glow, { opacity: 0 });
        cast.norbert = k.character('norbert', { x: 700, y: 370, w: 150, z: 12 });
        k.set(cast.norbert, { opacity: 0, y: 110 });
        cast.crate = k.prop('crate', { x: 680, y: 480, w: 200, z: 14 });
        k.set([cast.harry, cast.hermione, cast.crate], { opacity: CLOAKED });
        arrival = broomArrival.set(k, { riders: [{ id: 'dragonKeeper', x: 900, y: 386, w: 230, flip: true }], from: 'right' });
        cast.keeper = arrival.riders[0];
        cast.broom = arrival.brooms[0];
      },
      async play(k) {
        const { harry, hermione, lantern, glow, norbert, crate, keeper, broom } = cast;
        k.fx.wind(2);
        await k.say('top');

        // Off with the cloak.
        shimmer();
        k.sparkle(400, 480, 10, 320);
        await k.all(...[harry, hermione, crate].map((el) => k.fade(el, 1, 0.7)));
        await k.all(k.say('madeIt', harry), k.hop(harry, 24));
        k.fx.wind(2);
        await k.say('whereFriend', hermione);
        await k.say('dark', harry);

        // Hermione lights the lantern.
        await k.say('helpedLantern', hermione);
        k.flourish(lantern);
        k.fx.twinkle();
        await k.to(glow, 0.9, { opacity: 1 });
        k.sparkle(600, 560, 8, 90);
        await k.wait(700);

        // Down past the moon comes a broomstick.
        k.music('magic');
        await k.say('look', harry);
        await broomArrival.play(k, arrival, { seconds: 2 });
        // She stands her broom up against the wall behind her, out of the way.
        k.set(broom, { zIndex: 9 });
        await k.to(broom, 0.5, { x: '+=60', y: '-=175', rotation: 60, ease: 'power1.inOut' });
        await k.say('hello', keeper);

        // Norbert peeps out of his crate and squeaks.
        k.fx.creak();
        await k.to(norbert, 0.7, { opacity: 1, y: 0, ease: 'back.out(1.6)' });
        chirrup();
        await flutterWings(k, norbert, 2);
        await k.say('likesTeddy', hermione);
        await k.say('playWith', keeper);

        // Off they go, the crate on ropes under the broom, away past the moon.
        await k.say('upWeGo', keeper);
        await k.to(norbert, 0.4, { y: 50 });
        // Back on the broom, she rises up over the crate.
        k.set(broom, { zIndex: 12 });
        await k.to(broom, 0.4, { x: 0, y: 0, rotation: -30 });
        const lift = { x: `+=${k.box(crate).x + 100 - (k.box(keeper).x + 115)}`, y: '-=270', ease: 'power1.inOut' };
        k.sfx.whoosh();
        await k.to([keeper, broom], 1.2, lift);
        const kb = k.box(keeper);
        const cb = k.box(crate);
        const rope = k.add(sling(), { x: cb.x, y: kb.y + kb.h - 40, w: cb.w, h: cb.y + 50 - (kb.y + kb.h - 40), z: 13 });
        k.set(rope, { opacity: 0 });
        await k.fade(rope, 1, 0.3);
        k.sfx.whoosh();
        k.fx.wind(3);
        const away = { x: '+=900', y: '-=760', ease: 'power1.in' };
        void k.all(
          k.to([keeper, broom], 3.2, away),
          k.wait(400).then(() => k.to([rope, crate, norbert], 3.2, away)),
        );
        await k.wait(900);
        await k.say('goodbye', harry);
        await k.all(k.say('beGood', hermione), k.hop(hermione, 24));
        await k.wait(800);
      },
    },

    // ==================================================== 5. A letter from Romania
    {
      name: 'A letter from Romania',
      set(k) {
        k.backdrop('hagrids-hut');
        k.music('cosy');
        k.prop('flame', { x: 545, y: 420, w: 110, z: 2 });
        k.light(590, 480, 170, { strength: 0.4, flicker: true, z: 5 });
        cast.harry = k.character('harry', { x: 30, y: 370, w: 250 });
        cast.hermione = k.character('hermione', { x: 230, y: 378, w: 240 });
        cast.hagrid = k.character('hagrid', { x: 780, y: 232, w: 380, flip: true });
        post = owlPost.set(k, { to: cast.hagrid, from: 'left' });
      },
      async play(k) {
        const { harry, hermione, hagrid } = cast;
        fireCrackle(3);
        await k.say('nextWeek');
        await k.say('missHim', hagrid);

        // Hedwig brings a letter from Romania.
        await owlPost.play(k, post);
        await k.all(k.say('letter', harry), k.hop(harry, 20));
        await owlPost.open(k, post, { line: 'fromCharlie', by: hagrid });
        k.music('magic');
        await k.say('happy', hagrid);

        // A wizard picture: Norbert, waving.
        const back = k.add(frameBack(), { x: 470, y: 230, w: 220, z: 20 });
        const pic = k.character('norbert', { x: 520, y: 250, w: 120, z: 21 });
        const front = k.add(frameFront(), { x: 470, y: 230, w: 220, z: 22 });
        const picture = [back, pic, front];
        k.set(picture, { opacity: 0 });
        k.fx.twinkle();
        await k.all(...picture.map((el) => k.fade(el, 1, 0.5)));
        k.sparkle(580, 320, 10, 160);
        void flutterWings(k, pic, 3);
        await k.all(k.say('picture', hermione), k.hop(hermione, 20));

        await k.say('happyTears', hagrid);

        // Hagrid has dropped his hanky; Harry hands it up to him.
        const hanky = k.prop('hanky', { x: 520, y: 540, w: 150, z: 25 });
        await k.appear(hanky);
        await k.say('helpedHanky', harry);
        await k.carry(hanky, hagrid);
        honk();
        await k.shake(hagrid, 5, 3);
        await k.vanish(hanky);
        await k.say('thanksHarry', hagrid);
        bellyLaugh();
        await k.say('thanksName', hagrid);
        await k.all(...picture.map((el) => k.fade(el, 0, 0.5)));
        await warmEnding(k, { cast: [harry, hermione, hagrid], end: 'end' });
      },
    },
  ],
});
