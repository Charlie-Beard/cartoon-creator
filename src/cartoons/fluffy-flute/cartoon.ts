/**
 * Harry's Flute: a scene from the first Harry Potter book that the film
 * changes. In the film a harp is already playing when the friends reach
 * Fluffy; in the book it is Harry's own Christmas flute from Hagrid that
 * sends the three-headed dog to sleep.
 *
 *   1. Hagrid's present. Christmas morning in the dormitory. A parcel from
 *      Hagrid: a little wooden flute he carved himself. Harry blows it, and
 *      it sounds just like an owl, so Hedwig swoops to the window and hoots
 *      back. His first turn: he taps the parcel to open it. Hook: one day
 *      soon that flute will be very important.
 *   2. Hagrid lets it slip. Spring, in Hagrid's hut. The friends ask about
 *      the giant three-headed dog on the third floor. "That's Fluffy. He's
 *      mine." Ron: who calls a three-headed dog Fluffy? He guards something
 *      very special for Dumbledore, and someone wants to steal it. "Nobody
 *      gets past Fluffy. Unless you play him a bit of music…" Oops. The
 *      problem: if someone else knows that, they could sneak past tonight,
 *      so the friends must get there first. How? With Hagrid's flute, lying
 *      on the floor. His second turn: he drags it over to Harry.
 *   3. Three heads. Night, in the forbidden room. A low growl in the dark,
 *      and one, two, three heads lift and growl. His first turn: he taps the
 *      flute and Harry plays (his third turn). The left head yawns and droops, then the
 *      middle one. The right one is still wide awake, until Ron sings to it,
 *      so badly that it falls asleep. A triple snore blows Ron's hair about.
 *   4. The paw on the trapdoor. Fluffy's big paw is lying on the trapdoor,
 *      too heavy to move. His fourth turn: he tickles the paw, and Fluffy
 *      tucks it under him in his sleep, dreaming of bones. The trapdoor
 *      creaks open. Harry lowers the flute to look, the tune stops, and a
 *      head starts to wake! He plays again, and he drags Ron to the trapdoor
 *      (his fifth turn); one by one they jump: Ron, Hermione, Harry.
 *   5. Down in the dark. They land on something soft: lucky! Not lucky: it's
 *      Devil's Snare, curling round their legs. It loves the dark and hates
 *      bright light. His sixth turn: he taps Hermione's wand, "Lumos!", and
 *      the plant shrinks away. Safe together in the light, the friends set
 *      off side by side, ready for the next adventure.
 *
 * The scary beat is Fluffy waking: sound first (a growl in the dark), each
 * head lifting with its own growl, one push-in, then straight back to the
 * friends and the flute. Fluffy never bites or lunges; he is a big soppy
 * puppy who loves music. The Devil's Snare wraps their legs like a tickly
 * cuddle, nothing tighter, and lets go the moment the light comes. The
 * story goes on in "The Riddle of the Bottles".
 */
import { NOTE, cached, defineCartoon, dot, ellipse, ink, noiseBurst, now, piece, svg, tone, type Kit } from '../../kit';
import { sounds as commonSounds } from '../../worlds/common/moves';
import { warmEnding } from '../../worlds/common/pieces';
import { moves as hogMoves, sounds as hogSounds } from '../../worlds/hogwarts/moves';
import meta from './meta';

const { bellyLaugh, fireCrackle } = hogSounds;
const { swoopIn, hoot, castSpell } = hogMoves;
const { giggle } = commonSounds;

// ------------------------------------------------------------------- art

/**
 * Fluffy's front paw on its own (150 × 90), the same toffee paw as the one
 * drawn on him, so it can lie on top of the trapdoor (which sits in front of
 * him) and slide off it when he rolls over.
 */
const paw = cached(() =>
  svg({ w: 150, h: 90, name: 'fluffy-paw', label: 'A big furry paw' }, [
    piece(ellipse(75, 46, 70, 40), '#c99a63'),
    ...[52, 75, 98].map((x) => ink([[x, 50], [x, 74]], { width: 4, color: '#5a3a24' })),
    ...[44, 75, 106].map((x) => dot(x, 80, 8, '#efe0c4')),
  ]),
);

// ---------------------------------------------------------------- sounds

/** One soft, breathy flute note: a hooty sine with a little wobble. */
function note(freq: number, at: number, length = 0.4): void {
  tone(freq, at, { wave: 'sine', peak: 0.07, attack: 0.06, decay: length, vibrato: [5, 4] });
  noiseBurst(at, { freq: freq * 2, q: 6, peak: 0.008, attack: 0.05, decay: length * 0.8 });
}

/** The flute's first toot, which sounds just like an owl: "hoo-hoo". */
function owlToot(): void {
  const t = now();
  tone(NOTE.G4, t, { wave: 'sine', peak: 0.08, attack: 0.05, decay: 0.35, glideTo: NOTE.E4 });
  tone(NOTE.G4, t + 0.45, { wave: 'sine', peak: 0.08, attack: 0.05, decay: 0.5, glideTo: NOTE.D4 });
}

/** Harry's lullaby on the flute: a slow, rocking little tune, about 4 s. */
function lullaby(): void {
  const t = now();
  const tunes: Array<[number, number, number?]> = [
    [NOTE.E5, 0], [NOTE.G5, 0.45], [NOTE.E5, 0.9], [NOTE.D5, 1.35, 0.7],
    [NOTE.C5, 2.1], [NOTE.D5, 2.55], [NOTE.E5, 3.0], [NOTE.C5, 3.45, 0.9],
  ];
  for (const [f, dt, len] of tunes) note(f, t + dt, len ?? 0.45);
}

/** A low, rumbling growl that swells in (never sudden). */
function growl(seconds = 1.4, pitch = 70): void {
  const t = now();
  tone(pitch, t, { wave: 'sawtooth', peak: 0.07, attack: 0.4, decay: seconds, lowpass: 300, vibrato: [18, 6] });
  noiseBurst(t, { freq: 180, q: 1.2, peak: 0.04, attack: 0.4, decay: seconds });
}

/** A big deep "woof" from all three heads at once. */
function woof(): void {
  const t = now();
  [0, 0.05, 0.1].forEach((d, i) => tone([110, 98, 123][i], t + d, { wave: 'sawtooth', peak: 0.06, attack: 0.02, decay: 0.3, glideTo: 70, lowpass: 600 }));
  noiseBurst(t, { freq: 300, q: 1, peak: 0.05, attack: 0.02, decay: 0.3 });
}

/** A big, wobbly yawn. */
function yawn(): void {
  const t = now();
  tone(260, t, { wave: 'triangle', peak: 0.05, attack: 0.2, decay: 0.9, glideTo: 140, lowpass: 900 });
}

/** A dog snore like distant thunder: a slow breath in and a rumble out. */
function snore(heads = 1): void {
  const t = now();
  noiseBurst(t, { freq: 350, q: 2, peak: 0.02 * heads, attack: 0.5, decay: 0.5 });
  tone(60, t + 0.6, { wave: 'sawtooth', peak: 0.025 * heads, attack: 0.1, decay: 0.8, lowpass: 200, vibrato: [22, 8] });
}

/** Ron's singing: a few loud, wobbly notes, not quite in tune. */
function ronSings(): void {
  const t = now();
  [[NOTE.C5, 0], [NOTE.E5 * 0.96, 0.35], [NOTE.G5 * 1.04, 0.7], [NOTE.E5 * 0.97, 1.1]].forEach(([f, d]) =>
    tone(f, t + d, { wave: 'triangle', peak: 0.08, attack: 0.03, decay: 0.38, vibrato: [7, 18] }),
  );
}

/** A trapdoor creaking open. */
function creakOpen(): void {
  const t = now();
  tone(180, t, { wave: 'sawtooth', peak: 0.04, attack: 0.1, decay: 0.9, glideTo: 260, lowpass: 900, vibrato: [30, 10] });
}

/** Something rustling and creeping: leaves and tendrils. */
function rustle(seconds = 1.5): void {
  const t = now();
  for (let i = 0; i < 6; i++) noiseBurst(t + (i * seconds) / 6, { freq: 1800 + i * 200, q: 2, peak: 0.025, attack: 0.05, decay: 0.2 });
}

// ------------------------------------------------------------------ cast

type Actor = 'dark' | 'harry' | 'ron' | 'hermione' | 'hagrid' | 'hedwig' | 'fluffy' | 'paw' | 'flute' | 'present' | 'trapdoor' | 'snare';
const cast = {} as Record<Actor, HTMLElement>;

type Head = 'L' | 'M' | 'R';
const HEADS: Head[] = ['L', 'M', 'R'];

/** Where Fluffy lies in scenes 3 and 4: x 560, 580 wide, feet on y 670; his left paw is at about (761, 620). */
const FLUFFY = { x: 560, y: 13, w: 580, z: 10 };

/** The trapdoor sits in front of him, under his left paw. */
const TRAPDOOR = { x: 590, y: 600, w: 220, z: 11 };

/** A head nods off: a yawn, its eyes close and it droops on its neck. */
async function headSleeps<K extends string>(k: Kit<K>, fluffy: HTMLElement, h: Head): Promise<void> {
  const head = k.pivot(k.part(fluffy, `head${h}`));
  yawn();
  await k.to(head, 0.5, { rotation: h === 'R' ? -6 : 6, y: -6, ease: 'sine.out' });
  await k.fade(k.part(fluffy, `lids${h}`), 1, 0.6);
  await k.to(head, 0.9, { rotation: h === 'R' ? 14 : h === 'L' ? -14 : 0, y: 26, ease: 'sine.inOut' });
}

/** A head wakes: eyes open and it lifts (with a little growl if `cross`). */
async function headWakes<K extends string>(k: Kit<K>, fluffy: HTMLElement, h: Head, cross = true): Promise<void> {
  const head = k.pivot(k.part(fluffy, `head${h}`));
  k.set(k.part(fluffy, `lids${h}`), { opacity: 0 });
  if (cross) growl(1, h === 'M' ? 62 : 80);
  await k.to(head, 0.6, { rotation: 0, y: 0, ease: 'power2.out' });
  if (cross) {
    const open = k.part(fluffy, h === 'M' ? 'mouthOpen' : `mouthOpen${h}`);
    await k.fade(open, 1, 0.2);
    await k.shake(fluffy, 3, 2);
    await k.fade(open, 0, 0.3);
  }
}

/** All three heads fast asleep, at once (for the start of a scene). */
function allAsleep<K extends string>(k: Kit<K>, fluffy: HTMLElement): void {
  for (const h of HEADS) {
    k.set(k.part(fluffy, `lids${h}`), { opacity: 1 });
    k.set(k.pivot(k.part(fluffy, `head${h}`)), { rotation: h === 'R' ? 14 : h === 'L' ? -14 : 0, y: 26 });
  }
}

/** The flute, held up to Harry's mouth. */
function fluteAt<K extends string>(k: Kit<K>, harry: HTMLElement): HTMLElement {
  const { face } = k.box(harry);
  return k.prop('woodenFlute', { x: face.cx - 8, y: face.y + face.h * 0.78 - 18, w: 150, z: 20 });
}

/** Harry plays the lullaby: the flute bobs gently, and notes sparkle off it. */
async function playFlute<K extends string>(k: Kit<K>, flute: HTMLElement): Promise<void> {
  const b = k.box(flute);
  lullaby();
  void k.to(flute, 0.45, { rotation: -4, yoyo: true, repeat: 7, ease: 'sine.inOut' });
  for (let i = 0; i < 4; i++) {
    k.sparkle(b.x + b.w + 30 + i * 40, b.y - 20 - i * 18, 3, 40);
    await k.wait(1000);
  }
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. Hagrid's present
    morning: { who: 'narrator', text: 'It was Christmas morning, and there were presents at the end of Harry’s bed.' },
    fromHagrid: { who: 'harry', text: 'Look! A present from Hagrid!' },
    askPresent: { who: 'harry', text: '{name}, will you open it? Tap the parcel!' },
    nudgePresent: { who: 'harry', text: 'Tap the parcel to open it!' },
    helpedPresent: { who: 'harry', text: 'I can’t wait. I’ll open it myself!' },
    flute: { who: 'narrator', text: 'Inside was a little wooden flute. Hagrid had carved it all by himself.' },
    blowIt: { who: 'ron', text: 'Go on, Harry. Give it a blow!' },
    likeOwl: { who: 'ron', text: 'Ha! It sounds just like an owl!' },
    hedwigToo: { who: 'harry', text: 'Hedwig thinks so too! She’s hooting back.' },
    important: { who: 'narrator', text: 'Harry didn’t know it yet, but one day soon, that little flute would be very important.' },
    // 2. Hagrid lets it slip
    spring: { who: 'narrator', text: 'One sunny afternoon in spring, the three friends went to see Hagrid.' },
    giantDog: { who: 'hermione', text: 'Hagrid, we saw a giant dog on the third floor. It had three heads!' },
    thatsFluffy: { who: 'hagrid', text: 'Oh, that’s Fluffy. He’s mine. Lovely, isn’t he?' },
    calledFluffy: { who: 'ron', text: 'Fluffy? It’s got three heads, and it’s called Fluffy?' },
    guarding: { who: 'hagrid', text: 'He’s guarding something very special, for Dumbledore. Under a trapdoor.' },
    steal: { who: 'harry', text: 'But Hagrid, somebody wants to steal it!' },
    nobody: { who: 'hagrid', text: 'Nobody gets past Fluffy. Unless you play him some music. Then he goes straight to sleep.' },
    oops: { who: 'hagrid', text: 'Oh no. I shouldn’t have told you that!' },
    firstProblem: { who: 'harry', text: 'If somebody else knows that, they could sneak past him tonight. We must get there first!' },
    how: { who: 'ron', text: 'But how do we get past a giant dog with three heads?' },
    askBring: { who: 'harry', text: 'Hagrid’s flute is on the floor! {name}, can you drag it over to me?' },
    nudgeBring: { who: 'harry', text: 'Drag the little flute across to me.' },
    helpedBring: { who: 'ron', text: 'Oh, I’ll pass it over.' },
    thanksBring: { who: 'harry', text: 'Thank you, {name}!' },
    thanksRonBring: { who: 'harry', text: 'Thanks, Ron!' },
    withThis: { who: 'harry', text: 'With this. Hagrid’s flute!' },
    // 3. Three heads
    night: { who: 'narrator', text: 'That night, the three friends crept into the forbidden room.' },
    hear: { who: 'hermione', text: 'Shh! Can you hear that?' },
    teeth: { who: 'ron', text: 'Three heads. Six eyes. And lots and lots of teeth!' },
    askFlute: { who: 'harry', text: '{name}, help me play it. Tap the flute!' },
    nudgeFlute: { who: 'harry', text: 'Tap the little wooden flute!' },
    helpedFlute: { who: 'harry', text: 'I’ll just play it. Here goes!' },
    oneAsleep: { who: 'hermione', text: 'It’s working! That head is falling asleep!' },
    twoAsleep: { who: 'ron', text: 'Two heads! Keep playing, Harry!' },
    stillAwake: { who: 'hermione', text: 'But that one is still wide awake.' },
    sing: { who: 'ron', text: 'Maybe it wants a song. Leave it to me.' },
    singing: { who: 'narrator', text: 'Ron sang. It was not very good singing.' },
    ronDidIt: { who: 'hermione', text: 'Ron! Your singing sent it to sleep!' },
    worked: { who: 'ron', text: 'Oi! Well, it worked, didn’t it?' },
    thanksFlute: { who: 'harry', text: 'And you helped me play, {name}. Thank you!' },
    thanksSelf: { who: 'hermione', text: 'Well played, Harry. He loves your flute!' },
    // 4. The paw on the trapdoor
    trapdoor: { who: 'narrator', text: 'There was the trapdoor. But Fluffy’s big paw was lying right on top of it.' },
    heavy: { who: 'ron', text: 'Ugh! It’s too heavy. I can’t move it!' },
    ticklish: { who: 'hermione', text: 'Maybe he’s ticklish. Lots of dogs have ticklish paws.' },
    askPaw: { who: 'hermione', text: 'Can you tickle his paw? Tap it, very gently.' },
    nudgePaw: { who: 'hermione', text: 'Tap the big furry paw.' },
    helpedPaw: { who: 'ron', text: 'I’ll tickle it. Tickle, tickle, tickle!' },
    rolledOver: { who: 'hermione', text: 'He moved it! He’s dreaming about bones.' },
    thanksPaw: { who: 'harry', text: 'You did it! Thank you!' },
    thanksRon: { who: 'harry', text: 'Thanks, Ron!' },
    waking: { who: 'hermione', text: 'Oh no, Harry, you stopped playing! He’s waking up!' },
    askRon: { who: 'harry', text: 'We have to jump! {name}, can you drag Ron to the trapdoor?' },
    nudgeRon: { who: 'harry', text: 'Drag Ron over to the trapdoor.' },
    helpedRon: { who: 'ron', text: 'All right, all right. I’ll go first.' },
    hereGoes: { who: 'ron', text: 'Here goes. Whoaaa!' },
    // 5. Down in the dark
    soft: { who: 'ron', text: 'Oof! We landed on something soft. Lucky!' },
    notLucky: { who: 'harry', text: 'Lucky? It’s curling round my legs!' },
    snare: { who: 'hermione', text: 'It’s Devil’s Snare! It loves the dark, but it hates bright light.' },
    tickly: { who: 'ron', text: 'Then make a light, quick! It’s tickling my nose!' },
    askLight: { who: 'hermione', text: '{name}, help me make a bright light. Tap my wand!' },
    nudgeLight: { who: 'hermione', text: 'Tap my wand. Quick!' },
    helpedLight: { who: 'hermione', text: 'I remember the spell!' },
    lumos: { who: 'hermione', text: 'Lumos!' },
    lettingGo: { who: 'harry', text: 'It’s letting go!' },
    thanksLight: { who: 'harry', text: 'Brilliant! You and Hermione did it!' },
    thanksHermione: { who: 'harry', text: 'Brilliant, Hermione! You did it!' },
    herbology: { who: 'ron', text: 'Good thing somebody listens in Herbology!' },
    together: { who: 'harry', text: 'We did it! Now let’s find out what’s down here. Together!' },
    end: { who: 'narrator', text: 'So the three friends held up the light, and went on together. But that is another story.' },
  },
  scenes: [
    // ==================================================== 1. Hagrid's present
    {
      name: 'Hagrid’s present',
      set(k) {
        k.backdrop('dormitory');
        k.music('cosy');
        k.ambient('snow', { count: 12, area: [504, 60, 172, 300] });
        cast.harry = k.character('harry', { x: 380, y: 392, w: 230 });
        cast.ron = k.character('ron', { x: 600, y: 392, w: 230 });
        cast.present = k.prop('present', { x: 520, y: 535, w: 110, z: 14 });
        cast.flute = k.prop('woodenFlute', { x: 490, y: 570, w: 170, z: 16 });
        k.set(cast.flute, { opacity: 0 });
        cast.hedwig = k.character('hedwig', { x: 520, y: 150, w: 140, z: 8 });
        k.set(cast.hedwig, { opacity: 0 });
      },
      async play(k) {
        const { harry, ron, present, flute, hedwig } = cast;
        await k.wait(400);
        await k.say('morning');
        await k.all(k.say('fromHagrid', harry), k.hop(harry, 20));

        // His turn: tap the parcel to open it.
        await k.tapToHelp(present, { ask: 'askPresent', nudge: 'nudgePresent', helped: 'helpedPresent', by: harry, size: 150 });

        // Paper off: out comes a little wooden flute.
        k.sfx.rustle();
        await k.shake(present, 4, 2);
        k.fx.pop();
        k.sparkle(575, 600, 10, 140);
        await k.all(k.vanish(present), k.fade(flute, 1, 0.4));
        await k.say('flute');
        await k.say('blowIt', ron);

        // Up it goes to Harry's mouth: hoo-hoo! It sounds like an owl.
        const { face } = k.box(harry);
        await k.to(flute, 0.7, { x: face.cx - 8 - 490, y: face.y + face.h * 0.78 - 18 - 570, scale: 150 / 170, ease: 'power1.inOut' });
        owlToot();
        await k.wait(1100);
        k.music('magic');
        await k.all(k.say('likeOwl', ron), k.hop(ron, 24));

        // Hedwig swoops to the window and hoots back.
        k.set(hedwig, { opacity: 1 });
        await swoopIn(k, hedwig, 'right');
        await hoot(k, hedwig, 2);
        await k.say('hedwigToo', harry);
        owlToot();
        await k.wait(900);
        await hoot(k, hedwig, 1);
        k.music('dreamy');
        await k.wait(400);
        await k.say('important');
        await k.wait(500);
      },
    },

    // ==================================================== 2. Hagrid lets it slip
    {
      name: 'Hagrid lets it slip',
      set(k) {
        k.backdrop('hagrids-hut');
        k.music('cosy');
        k.prop('flame', { x: 545, y: 420, w: 110, z: 2 });
        k.light(590, 480, 170, { strength: 0.35, flicker: true, z: 5 });
        cast.ron = k.character('ron', { x: 0, y: 392, w: 220 });
        cast.hermione = k.character('hermione', { x: 150, y: 396, w: 220 });
        cast.harry = k.character('harry', { x: 300, y: 392, w: 220 });
        cast.hagrid = k.character('hagrid', { x: 790, y: 232, w: 380, flip: true });
        // Hagrid's flute lies on the floor, across the hearth from Harry, where he can drag it over.
        cast.flute = k.prop('woodenFlute', { x: 610, y: 565, w: 190, z: 20 });
        k.set(cast.flute, { opacity: 0 });
      },
      async play(k) {
        const { harry, ron, hermione, hagrid, flute } = cast;
        fireCrackle(4);
        await k.say('spring');
        await k.say('giantDog', hermione);
        bellyLaugh();
        await k.say('thatsFluffy', hagrid);
        await k.all(k.say('calledFluffy', ron), k.shake(ron, 4, 2));
        await k.say('guarding', hagrid);
        k.music('sneaky');
        await k.say('steal', harry);

        // Hagrid lets it slip, and then claps his hand to his mouth.
        await k.say('nobody', hagrid);
        k.fx.uhoh();
        await k.all(k.say('oops', hagrid), k.shake(hagrid, 4, 3));
        await k.wait(400);
        await k.say('firstProblem', harry);
        await k.say('how', ron);

        // His turn: the flute lies on the floor; he drags it over to Harry.
        await k.fade(flute, 1, 0.3);
        const bring = await k.dragToHelp(flute, { to: [460, 595], ask: 'askBring', nudge: 'nudgeBring', helped: 'helpedBring', by: harry, helper: ron });
        await k.say(bring === 'dragged' ? 'thanksBring' : 'thanksRonBring', harry);

        // Harry holds it up.
        k.music('magic');
        k.fx.twinkle();
        await k.to(flute, 0.6, { y: '-=25', rotation: -10, ease: 'back.out(1.6)' });
        k.sparkle(460, 520, 10, 120);
        await k.all(k.say('withThis', harry), k.hop(harry, 20));
        await k.wait(500);
      },
    },

    // ==================================================== 3. Three heads
    {
      name: 'Three heads',
      set(k) {
        k.backdrop('third-floor-room');
        k.music('sneaky');
        k.dim(0.25, '#0c1226');
        k.light(290, 320, 110, { color: '#ffcf7a', strength: 0.35, flicker: true, z: 5 });
        cast.fluffy = k.character('fluffy', FLUFFY);
        cast.trapdoor = k.prop('trapdoor', TRAPDOOR);
        cast.paw = k.add(paw(), { x: 686, y: 575, w: 150, z: 12 });
        allAsleep(k, cast.fluffy);
        cast.harry = k.character('harry', { x: 20, y: 412, w: 210 });
        cast.hermione = k.character('hermione', { x: 200, y: 416, w: 210 });
        cast.ron = k.character('ron', { x: 380, y: 412, w: 210 });
        k.set([cast.harry, cast.hermione, cast.ron], { x: -640 });
      },
      async play(k) {
        const { harry, hermione, ron, fluffy } = cast;
        k.fx.creak();
        await k.all(k.say('night'), k.wait(400).then(() => k.to([harry, hermione, ron], 2.4, { x: 0, ease: 'power1.out' })));

        // A growl in the dark. One, two, three heads lift.
        k.silence();
        growl(1.6, 60);
        await k.wait(1400);
        await k.say('hear', hermione);
        k.music('spooky');
        await headWakes(k, fluffy, 'L');
        await headWakes(k, fluffy, 'R');
        await k.camera({ zoom: 1.25, x: 880, y: 300 }, 1.1);
        await headWakes(k, fluffy, 'M');
        woof();
        k.quake(4);
        await k.wait(500);
        await k.camera({}, 0.8);

        // Back to the friends.
        await k.all(k.say('teeth', ron), k.shake(ron, 4, 2));
        const flute = fluteAt(k, harry);
        k.set(flute, { opacity: 0 });
        await k.fade(flute, 1, 0.3);

        // His third turn: play the flute.
        const how = await k.tapToHelp(flute, { ask: 'askFlute', nudge: 'nudgeFlute', helped: 'helpedFlute', by: harry, size: 150 });
        k.music('dreamy');
        await k.all(playFlute(k, flute), k.wait(1600).then(() => headSleeps(k, fluffy, 'L')));
        await k.say('oneAsleep', hermione);
        await k.all(playFlute(k, flute), k.wait(1400).then(() => headSleeps(k, fluffy, 'M')));
        await k.all(k.say('twoAsleep', ron), k.hop(ron, 18));

        // The right head won't settle, until Ron sings to it.
        growl(0.8, 82);
        await k.to(k.pivot(k.part(fluffy, 'headR')), 0.12, { rotation: 4, yoyo: true, repeat: 5, ease: 'sine.inOut' });
        await k.say('stillAwake', hermione);
        await k.say('sing', ron);
        ronSings();
        await k.all(k.say('singing'), k.hop(ron, 14, 2));
        await headSleeps(k, fluffy, 'R');
        snore(3);
        await k.wait(500);
        // The triple snore blows Ron's hair about.
        await k.all(k.shake(ron, 6, 3), k.wait(300));
        giggle();
        await k.say('ronDidIt', hermione);
        await k.say('worked', ron);
        await k.say(how === 'tapped' ? 'thanksFlute' : 'thanksSelf', how === 'tapped' ? harry : hermione);
        snore(3);
        await k.wait(800);
      },
    },

    // ==================================================== 4. The paw on the trapdoor
    {
      name: 'The paw on the trapdoor',
      set(k) {
        k.backdrop('third-floor-room');
        k.music('dreamy');
        k.dim(0.25, '#0c1226');
        k.light(290, 320, 110, { color: '#ffcf7a', strength: 0.35, flicker: true, z: 5 });
        cast.fluffy = k.character('fluffy', FLUFFY);
        cast.trapdoor = k.prop('trapdoor', TRAPDOOR);
        cast.paw = k.add(paw(), { x: 686, y: 575, w: 150, z: 12 });
        allAsleep(k, cast.fluffy);
        cast.harry = k.character('harry', { x: 20, y: 412, w: 210 });
        cast.hermione = k.character('hermione', { x: 200, y: 416, w: 210 });
        cast.ron = k.character('ron', { x: 380, y: 412, w: 210 });
        cast.flute = fluteAt(k, cast.harry);
      },
      async play(k) {
        const { harry, hermione, ron, fluffy, paw: fluffyPaw, trapdoor, flute } = cast;
        // Harry keeps playing (the tune only, so nothing moves while it's his turn) until the trapdoor opens.
        const tune = { on: true };
        void (async () => {
          while (tune.on) {
            lullaby();
            await k.wait(4300);
          }
        })();
        snore(3);
        await k.say('trapdoor');

        // Ron pushes the paw. It won't budge.
        await k.to(ron, 0.6, { x: 100, ease: 'power1.inOut' });
        await k.to(ron, 0.3, { rotation: 8 });
        await k.shake(fluffyPaw, 3, 3);
        await k.to(ron, 0.3, { rotation: 0 });
        await k.say('heavy', ron);
        await k.to(ron, 0.6, { x: 0, ease: 'power1.inOut' });
        snore(3);
        await k.say('ticklish', hermione);

        // His fourth turn: tickle the paw. The ring goes round the paw (an invisible spot over it).
        const how = await k.tapToHelp(fluffyPaw, { ask: 'askPaw', nudge: 'nudgePaw', helped: 'helpedPaw', by: hermione, helper: ron, size: 150 });
        giggle();
        await k.all(k.shake(fluffy, 3, 3), k.shake(fluffyPaw, 4, 3));
        // He shuffles over in his sleep and tucks his paw under him, off the trapdoor. His tail wags.
        snore(3);
        await k.all(
          k.to(fluffy, 1.2, { x: 40, ease: 'sine.inOut' }),
          k.to(fluffyPaw, 1.2, { x: 160, y: -20, opacity: 0, ease: 'sine.inOut' }),
        );
        const tail = k.pivot(k.part(fluffy, 'tail'));
        void k.to(tail, 0.3, { rotation: 16, yoyo: true, repeat: 5, ease: 'sine.inOut' });
        await k.say('rolledOver', hermione);
        await k.say(how === 'tapped' ? 'thanksPaw' : 'thanksRon', harry);

        // The trapdoor creaks open: a dark hole.
        creakOpen();
        await k.to(k.pivot(k.part(trapdoor, 'door')), 0.9, { scaleY: -1, ease: 'power1.inOut' });

        // Harry lowers the flute to look down the hole, the tune stops, and a head starts to wake!
        tune.on = false;
        await k.to(flute, 0.5, { y: 40, rotation: 25 });
        await k.wait(900);
        k.music('spooky');
        await headWakes(k, fluffy, 'M', false);
        growl(1, 66);
        await k.all(k.say('waking', hermione), k.shake(hermione, 4, 2));
        k.music('dreamy');
        await k.to(flute, 0.4, { y: 0, rotation: 0 });
        await k.all(playFlute(k, flute), k.wait(1500).then(() => headSleeps(k, fluffy, 'M')));
        snore(3);

        // His turn: drag Ron to the trapdoor, then one by one they jump: Ron, Hermione, Harry.
        const tb = k.box(trapdoor);
        const drop = async (el: HTMLElement) => {
          const b = k.box(el);
          k.fx.patter(4);
          k.set(el, { zIndex: 13 });
          await k.to(el, 0.6, { x: `+=${tb.x + tb.w / 2 - (b.x + b.w / 2)}`, ease: 'power1.inOut' });
          k.sfx.whoosh();
          await k.to(el, 0.5, { y: '+=260', scale: 0.6, opacity: 0, ease: 'power2.in' });
        };
        await k.dragToHelp(ron, { to: [tb.x + tb.w / 2, 610], ask: 'askRon', nudge: 'nudgeRon', helped: 'helpedRon', by: harry, helper: ron, dropSize: 170 });
        await k.all(k.say('hereGoes', ron), k.wait(300).then(() => drop(ron)));
        await drop(hermione);
        k.set(flute, { opacity: 0 });
        await drop(harry);
        snore(3);
        await k.wait(700);
      },
    },

    // ==================================================== 5. Down in the dark
    {
      name: 'Down in the dark',
      set(k) {
        k.backdrop('secret-tunnel');
        k.music('spooky');
        cast.dark = k.dim(0.45, '#060a14');
        cast.harry = k.character('harry', { x: 300, y: 372, w: 210, z: 8 });
        cast.hermione = k.character('hermione', { x: 480, y: 376, w: 210, z: 8 });
        cast.ron = k.character('ron', { x: 660, y: 372, w: 210, z: 8 });
        cast.snare = k.prop('devilsSnare', { x: 290, y: 505, w: 600, z: 12 });
        k.set(k.pivot(k.part(cast.snare, 'tendrils')), { scaleY: 0.75 });
        k.set([cast.harry, cast.hermione, cast.ron], { y: -820 });
      },
      async play(k) {
        const { harry, hermione, ron, snare } = cast;
        // Down they tumble, one, two, three, onto something soft.
        for (const el of [ron, hermione, harry]) {
          k.sfx.whoosh();
          await k.to(el, 0.6, { y: 0, ease: 'power2.in' });
          k.fx.boing();
          await k.hop(el, 16);
        }
        await k.say('soft', ron);

        // It creeps up round their legs.
        const tendrils = k.pivot(k.part(snare, 'tendrils'));
        rustle(1.6);
        await k.to(tendrils, 1.4, { scaleY: 1, ease: 'sine.inOut' });
        void k.to(tendrils, 0.8, { rotation: 3, yoyo: true, repeat: 3, ease: 'sine.inOut' });
        await k.all(k.say('notLucky', harry), k.shake(harry, 4, 2));
        await k.say('snare', hermione);
        await k.all(k.say('tickly', ron), k.shake(ron, 5, 3));

        // His sixth turn: tap Hermione's wand, for a bright light.
        // The ring goes round her wand, in her hand at the right of her portrait (an invisible spot over it).
        const hb = k.box(hermione);
        const wandSpot = k.add('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"></svg>', {
          x: hb.x + hb.w * 0.8 - 65, y: hb.y + hb.h * 0.72 - 65, w: 130, h: 130, z: 20,
        });
        const how = await k.tapToHelp(wandSpot, { ask: 'askLight', nudge: 'nudgeLight', helped: 'helpedLight', by: hermione, size: 130 });
        k.remove(wandSpot);
        k.music('magic');
        await k.say('lumos', hermione);
        await castSpell(k, hermione, [590, 250]);
        k.fx.twinkle();
        // The light lifts the dark: a soft glow from her wand, and the gloom fades back.
        const glow = k.light(hb.x + hb.w * 0.8, hb.y + hb.h * 0.6, 300, { color: '#fff4c8', strength: 0.15 });
        k.set(glow, { opacity: 0 });
        await k.all(k.fade(glow, 1, 0.9), k.fade(cast.dark, 0.35, 0.9));
        k.sparkle(590, 300, 14, 300);

        // The plant shrinks away from the light, and lets go.
        rustle(1.2);
        await k.to(tendrils, 1, { scaleY: 0.4, ease: 'power1.in' });
        await k.to(snare, 0.8, { y: 60, opacity: 0.5, ease: 'power1.inOut' });
        await k.all(k.say('lettingGo', harry), k.hop(harry, 20));
        await k.say(how === 'tapped' ? 'thanksLight' : 'thanksHermione', harry);
        await k.all(k.say('herbology', ron), k.hop(ron, 16));

        // Far above, Fluffy snores on.
        k.music('dreamy');
        snore(2);
        await k.wait(600);
        await k.say('together', harry);
        await warmEnding(k, { cast: [harry, hermione, ron], end: 'end' });
      },
    },
  ],
});
