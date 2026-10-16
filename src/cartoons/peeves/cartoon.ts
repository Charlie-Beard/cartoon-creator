/**
 * Peeves the Poltergeist: a scene from the first Harry Potter book that the
 * film left out. On the first night at Hogwarts, Peeves plays tricks on the
 * new first-years, and only the Baron can make him behave.
 *
 *   1. The floating sticks. Nearly Headless Nick leads Harry and Ron up to
 *      Gryffindor Tower after the feast. A bundle of walking sticks is
 *      hanging in the air, all on its own. It's Peeves, invisible. His first
 *      turn: he taps the sticks, and Peeves has to show himself: "Ooooh!
 *      Ickle firsties!" A raspberry, the sticks clatter down (on the floor,
 *      never on anyone), and Peeves zooms off: catch me if you can!
 *   2. Chalk and a toad. A short cut through a classroom, where Neville is
 *      telling Trevor not to hop off. Peekaboo: Peeves throws chalk (puffs on
 *      the floor round their feet), then floats Trevor up out of reach.
 *      Shan't give him back! Nick: only one ghost can make Peeves behave.
 *      The Baron. Neville gulps: he's ever so scary.
 *   3. The Baron. Down in the cold dungeon hangs the Baron's old bell. His
 *      big turn: he rings it. Bong. The torches dim, chains clink, and the
 *      Baron rises slowly through the floor, grey and staring: "Who… rang…
 *      my bell?" Harry is brave: please, sir, Peeves has taken Neville's
 *      toad. "Peeves. Again. Follow me." He sweeps away through the wall.
 *   4. Goodnight, Peeves. In the classroom Peeves is spinning Trevor round
 *      and round, singing, when the cold comes in behind him. "PEEVES." He
 *      shakes, gives Trevor back (sorry, Baron!) and whizzes off. The Baron
 *      gives the tiniest nod and fades away. Then, cosy by the common-room
 *      fire: even Peeves is scared of the Baron! Thank you for ringing the
 *      bell. Goodnight, Trevor. Nick says goodnight and floats off through
 *      the wall. And at the window, one last, very small raspberry.
 *
 * The scary beat is the Baron rising (sound first, slowly, one push-in),
 * and he turns out to be on the children's side. Peeves is naughty, never
 * cruel: nothing he throws or drops lands on anyone. In the book he is the
 * Bloody Baron, but he is only ever "the Baron" here: "bloody" is a swear
 * word to a six-year-old in the UK. Nick takes Percy's part from the book
 * (the prefect isn't drawn), and Hermione sits this one out to keep the
 * stage to four.
 */
import { C, cached, circle, defineCartoon, group, ink, noiseBurst, now, piece, poly, rect, svg, tone, type Kit } from '../../kit';
import { sounds as commonSounds } from '../../worlds/common/moves';
import { sounds as hogSounds, moves as hogMoves } from '../../worlds/hogwarts/moves';
import meta from './meta';

const { giggle } = commonSounds;
const { croak, fireCrackle } = hogSounds;
const { swishCloak } = hogMoves;

// ------------------------------------------------------------------- art

/** A bundle of three old walking sticks tied with string, standing up, 110 × 230. */
const sticks = cached(() =>
  svg({ w: 110, h: 230, name: 'peeves-sticks', label: 'Walking sticks' }, [
    ...[[22, '#7a5534'], [55, '#8b6a45'], [88, '#6a4a2c']].map(([x, colour], i) =>
      group({}, [
        piece(rect((x as number) - 7, 30 + i * 6, 14, 190 - i * 6, 6), colour as string, { edge: 'cut' }),
        // The crook at the top.
        ink([[(x as number), 36 + i * 6], [(x as number), 18 + i * 6], [(x as number) + 18, 8 + i * 6], [(x as number) + 26, 26 + i * 6]], { width: 10, color: colour as string }),
      ]),
    ),
    piece(rect(8, 120, 94, 12, 3), C.cream, { edge: 'cut' }),
  ]),
);

/** A stick of chalk, 60 × 20. */
const chalk = cached(() =>
  svg({ w: 60, h: 20, name: 'peeves-chalk', label: 'Chalk' }, [piece(rect(4, 4, 52, 12, 4), '#f4f1e6', { edge: 'cut' })]),
);

/**
 * The Baron's old iron bell on its wall bracket, 180 × 260. The `bell` part
 * swings from the bracket (origin 90, 70).
 */
const bell = cached(() =>
  svg({ w: 180, h: 260, name: 'peeves-bell', label: 'An old bell' }, [
    piece(rect(10, 20, 160, 22, 4), C.wood, { edge: 'cut' }),
    piece(rect(80, 38, 20, 34, 3), C.greyDark, { edge: 'cut' }),
    group({ part: 'bell', origin: [90, 70] }, [
      piece(poly([[60, 76], [120, 76], [134, 150], [160, 214], [20, 214], [46, 150]]), '#b08a3e', { edge: 'cut' }),
      piece(rect(16, 206, 148, 16, 6), '#8a6a2c', { edge: 'cut' }),
      ink([[56, 120], [124, 120]], { width: 3, color: '#e0c070' }),
      piece(circle(90, 232, 14), '#5a4420', { edge: 'cut' }),
    ]),
  ]),
);

/** A soft cloud of chalk dust where the chalk lands. */
const CHALK = '#ecebe2';

// ---------------------------------------------------------------- sounds

/** Peeves's raspberry: a wet, wobbly "pffffbbt", soft and silly. `small` for a tiny one. */
function raspberry(small = false): void {
  const t = now();
  const p = small ? 0.5 : 1;
  tone(110, t, { wave: 'sawtooth', peak: 0.09 * p, attack: 0.04, decay: small ? 0.4 : 0.8, vibrato: [32, 30], lowpass: 900, glideTo: 80 });
  noiseBurst(t, { freq: 500, q: 2, peak: 0.05 * p, attack: 0.03, decay: small ? 0.35 : 0.7 });
}

/** Walking sticks clattering on the stone floor: a few wooden knocks tumbling. */
function clatter(): void {
  const t = now();
  [0, 0.11, 0.19, 0.33, 0.42].forEach((d, i) => {
    tone(i % 2 ? 340 : 260, t + d, { wave: 'triangle', peak: 0.1, decay: 0.12 });
    noiseBurst(t + d, { freq: 900, q: 3, peak: 0.05, decay: 0.08 });
  });
}

/** The Baron's bell: one deep, slow bong that hums away. */
function bong(): void {
  const t = now();
  tone(98, t, { wave: 'sine', peak: 0.18, attack: 0.01, decay: 3.5 });
  tone(196, t, { wave: 'sine', peak: 0.07, attack: 0.01, decay: 2.5 });
  tone(293, t, { wave: 'triangle', peak: 0.04, attack: 0.01, decay: 1.6, lowpass: 1200 });
}

/** The Baron's chains: a few slow, cold, silvery clinks. */
function chains(): void {
  const t = now();
  [0, 0.35, 0.55, 1.0].forEach((d, i) => tone([1568, 1760, 1480, 1660][i], t + d, { wave: 'triangle', peak: 0.04, decay: 0.4 }));
}

// ------------------------------------------------------------------ cast

type Actor = 'nick' | 'harry' | 'ron' | 'neville' | 'peeves' | 'baron' | 'sticks' | 'toad' | 'bell' | 'cold';
const cast = {} as Record<Actor, HTMLElement>;

/** Peeves floats and bobs in the air wherever he is. */
function hover<K extends string>(k: Kit<K>, el: HTMLElement): void {
  void k.float(el, 10, 2.2);
}

/** Peeves blows a raspberry: tongue out, a wobble, tongue in. */
async function blowRaspberry<K extends string>(k: Kit<K>, peeves: HTMLElement, small = false): Promise<void> {
  const out = [...k.part(peeves, 'mouthOpen'), ...k.part(peeves, 'tongue')];
  raspberry(small);
  k.set(out, { opacity: 1 });
  await k.shake(peeves, small ? 3 : 6, 3);
  k.set(out, { opacity: 0 });
}

/** A stick of chalk flies from `from` and lands at `to` in a little puff of dust. */
async function throwChalk<K extends string>(k: Kit<K>, from: [number, number], to: [number, number]): Promise<void> {
  const c = k.add(chalk(), { x: from[0], y: from[1], w: 50, z: 15 });
  k.fx.whizz();
  await k.to(c, 0.5, { x: to[0] - from[0], y: to[1] - from[1], rotation: 400, ease: 'power1.in' });
  k.remove(c);
  k.fx.poof();
  k.puff(to[0] + 25, to[1], 110, CHALK);
}

/** The cold that comes with the Baron: the torches dim and a grey-green veil comes over. Fade it out to warm up again. */
const COLD = 0.4;
function chill<K extends string>(k: Kit<K>): HTMLElement {
  const veil = k.dim(COLD, '#1e2a2c');
  k.set(veil, { opacity: 0 });
  return veil;
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. The floating sticks
    firstNight: { who: 'narrator', text: 'It was Harry’s very first night at Hogwarts. Nick, the Gryffindor ghost, was showing the way to bed.' },
    thisWay: { who: 'nick', text: 'This way, dear boys! Gryffindor Tower is up these stairs. Welcome to Hogwarts, {name}!' },
    whySticks: { who: 'ron', text: 'Er… Harry? Why are those sticks floating?' },
    poltergeist: { who: 'nick', text: 'Oh dear. That’s Peeves the poltergeist. He’s invisible, the little rascal.' },
    askSticks: { who: 'nick', text: 'Tap the floating sticks, {name}! Then he has to show himself.' },
    nudgeSticks: { who: 'nick', text: 'Just tap the wobbly sticks!' },
    helpedSticks: { who: 'nick', text: 'Peeves! Show yourself, at once!' },
    ickle: { who: 'peeves', text: 'Ooooh! Ickle firsties! What fun!' },
    raspberry: { who: 'harry', text: 'Did he just blow a raspberry at us?' },
    catchMe: { who: 'peeves', text: 'Catch me if you can! Wheee!' },
    // 2. Chalk and a toad
    noHopping: { who: 'neville', text: 'Now, Trevor. No hopping off tonight. Please.' },
    peekaboo: { who: 'peeves', text: 'Peekaboo! Chalk for the ickle firsties!' },
    stopIt: { who: 'harry', text: 'Hey! Stop it, Peeves!' },
    upHeGoes: { who: 'peeves', text: 'Ooh, a toady-woady! Up he goes!' },
    giveBack: { who: 'neville', text: 'Trevor! Please give him back!' },
    shant: { who: 'peeves', text: 'Shan’t! Finders keepers!' },
    howStop: { who: 'harry', text: 'Nick, how can we stop him?' },
    onlyBaron: { who: 'nick', text: 'Only one ghost can make Peeves behave. The Baron.' },
    scary: { who: 'neville', text: 'The Slytherin ghost? He’s ever so scary.' },
    // 3. The Baron
    downDown: { who: 'narrator', text: 'Down, down they went, to the cold, dark dungeon.' },
    hisBell: { who: 'nick', text: 'This is the Baron’s bell. Ring it, and he will come.' },
    askBell: { who: 'nick', text: 'Will you ring it, {name}? Tap the big old bell.' },
    nudgeBell: { who: 'nick', text: 'Just tap the bell.' },
    helpedBell: { who: 'harry', text: 'I’ll ring it. Here goes!' },
    soCold: { who: 'narrator', text: 'Bong! Then it went very cold, and very quiet. Something was coming up through the floor…' },
    whoRang: { who: 'baron', text: 'Who… rang… my bell?' },
    please: { who: 'harry', text: 'Please, sir. Peeves has taken Neville’s toad.' },
    onlyLittle: { who: 'neville', text: 'He’s called Trevor. He’s only little.' },
    followMe: { who: 'baron', text: 'Peeves. Again. Follow me.' },
    bigTrouble: { who: 'nick', text: 'Come on! Peeves is in big trouble now.' },
    // 4. Goodnight, Peeves
    roundAndRound: { who: 'peeves', text: 'Toady-woady, round and round! Wheee!' },
    peevesBaron: { who: 'baron', text: 'PEEVES.' },
    sorryBaron: { who: 'peeves', text: 'B-B-Baron! Sorry, Baron! Here’s the toad, Baron!' },
    offYouGo: { who: 'baron', text: 'Off you go.' },
    thankYouSir: { who: 'neville', text: 'Trevor! Oh, thank you, sir.' },
    nod: { who: 'narrator', text: 'And the Baron gave {name} the tiniest nod.' },
    evenPeeves: { who: 'ron', text: 'Blimey. Even Peeves is scared of the Baron!' },
    thanksBell: { who: 'harry', text: 'Thanks for ringing the bell, {name}.' },
    nightTrevor: { who: 'neville', text: 'Goodnight, Trevor.' },
    nightBoys: { who: 'nick', text: 'Goodnight, dear boys. Sleep tight!' },
    end: { who: 'narrator', text: 'One last, very small raspberry. And then, at last, Hogwarts went to sleep.' },
  },
  scenes: [
    // ==================================================== 1. The floating sticks
    {
      name: 'The floating sticks',
      set(k) {
        k.backdrop('castle-corridor');
        k.music('sneaky');
        k.light(140, 245, 110, { color: '#ffcf7a', strength: 0.4, flicker: true, z: 5 });
        k.light(1040, 245, 110, { color: '#ffcf7a', strength: 0.4, flicker: true, z: 5 });
        cast.nick = k.character('nick', { x: 40, y: 310, w: 240 });
        cast.harry = k.character('harry', { x: 300, y: 380, w: 240 });
        cast.ron = k.character('ron', { x: 520, y: 380, w: 240 });
        cast.peeves = k.character('peeves', { x: 700, y: 140, w: 230, flip: true });
        cast.sticks = k.add(sticks(), { x: 870, y: 290, w: 110, z: 12 });
        k.set(cast.peeves, { opacity: 0 });
        k.set(cast.sticks, { opacity: 0 });
      },
      async play(k) {
        const { nick, harry, ron, peeves, sticks: bundle } = cast;
        void k.float(nick, 8, 2.6);
        await k.wait(400);
        await k.say('firstNight');
        await k.say('thisWay', nick);

        // A bundle of walking sticks, hanging in the air on its own.
        k.fx.twinkle();
        await k.fade(bundle, 1, 0.8);
        void k.to(bundle, 1.1, { rotation: 6, yoyo: true, repeat: 1 });
        await k.all(k.say('whySticks', ron), k.shake(ron, 4, 2));
        await k.say('poltergeist', nick);

        // His first turn: tap the sticks, and Peeves has to show himself.
        await k.tapToHelp(bundle, { ask: 'askSticks', nudge: 'nudgeSticks', helped: 'helpedSticks', by: nick, size: 170 });
        k.fx.poof();
        k.puff(840, 300, 220, '#e0c070');
        await k.fade(peeves, 1, 0.3);
        await k.pop(peeves, 1.1);
        hover(k, peeves);
        await k.say('ickle', peeves);
        await blowRaspberry(k, peeves);
        await k.say('raspberry', harry);

        // He lets go of the sticks: down they clatter, onto the floor.
        k.fx.whizz();
        await k.to(bundle, 0.55, { x: 60, y: 250, rotation: 80, ease: 'power2.in' });
        clatter();
        k.quake(3);
        await k.all(k.shake(harry, 5, 2), k.shake(ron, 5, 2));
        giggle();
        await k.say('catchMe', peeves);
        k.sfx.whoosh();
        await k.exit(peeves, 'top', 0.6);
        await k.wait(400);
      },
    },

    // ==================================================== 2. Chalk and a toad
    {
      name: 'Chalk and a toad',
      set(k) {
        k.backdrop('classroom');
        k.music('sneaky');
        cast.nick = k.character('nick', { x: 20, y: 300, w: 220 });
        cast.neville = k.character('neville', { x: 230, y: 375, w: 240 });
        cast.toad = k.prop('toad', { x: 450, y: 560, w: 100, z: 14 });
        cast.harry = k.character('harry', { x: 560, y: 375, w: 240 });
        cast.peeves = k.character('peeves', { x: 850, y: 140, w: 230, flip: true });
        k.set(cast.peeves, { opacity: 0, x: 60 });
      },
      async play(k) {
        const { nick, neville, toad, harry, peeves } = cast;
        void k.float(nick, 8, 2.6);
        await k.wait(400);
        croak();
        await k.pop(toad, 1.1);
        await k.say('noHopping', neville);

        // Peekaboo! Chalk, landing round their feet.
        k.sfx.whoosh();
        await k.all(k.fade(peeves, 1, 0.4), k.to(peeves, 0.4, { x: 0 }));
        hover(k, peeves);
        await k.say('peekaboo', peeves);
        const [arm] = k.pivot(k.part(peeves, 'armR'));
        for (const to of [[515, 655], [150, 660], [900, 655]] as [number, number][]) {
          void k.to(arm, 0.2, { rotation: 40, yoyo: true, repeat: 1 });
          await throwChalk(k, [880, 330], to);
          await k.wait(150);
        }
        await k.all(k.shake(harry, 4, 2), k.shake(neville, 4, 2));
        await k.say('stopIt', harry);

        // He floats Trevor up, out of reach.
        await k.say('upHeGoes', peeves);
        k.fx.twinkle();
        await k.to(toad, 1.4, { x: 400, y: -200, rotation: 20, ease: 'power1.inOut' });
        croak();
        await k.all(k.say('giveBack', neville), k.shake(neville, 5, 2));
        await k.say('shant', peeves);
        await blowRaspberry(k, peeves);

        await k.say('howStop', harry);
        k.silence();
        await k.say('onlyBaron', nick);
        k.sfx.ominous();
        await k.all(k.say('scary', neville), k.shake(neville, 3, 3));
      },
    },

    // ==================================================== 3. The Baron
    {
      name: 'The Baron',
      set(k) {
        k.backdrop('potions-dungeon');
        k.music('spooky');
        cast.bell = k.add(bell(), { x: 40, y: 330, w: 180, z: 9 });
        cast.nick = k.character('nick', { x: 240, y: 280, w: 220 });
        cast.harry = k.character('harry', { x: 460, y: 400, w: 240 });
        cast.neville = k.character('neville', { x: 650, y: 400, w: 240 });
        cast.baron = k.character('baron', { x: 860, y: 280, w: 300, flip: true });
        cast.cold = chill(k);
        k.set(cast.baron, { opacity: 0, y: 260 });
        k.face(cast.harry, true);
        k.face(cast.neville, true);
      },
      async play(k) {
        const { bell: theBell, nick, harry, neville, baron, cold } = cast;
        void k.float(nick, 8, 2.6);
        k.fx.wind(2);
        await k.wait(500);
        await k.say('downDown');
        await k.say('hisBell', nick);

        // His big turn: ring the bell.
        await k.tapToHelp(theBell, { ask: 'askBell', nudge: 'nudgeBell', helped: 'helpedBell', by: nick, helper: harry, size: 180 });
        const swing = k.pivot(k.part(theBell, 'bell'));
        bong();
        await k.to(swing, 0.5, { rotation: 14, yoyo: true, repeat: 3, ease: 'sine.inOut' });
        k.set(swing, { rotation: 0 });

        // Silence. The cold comes in, chains clink, and the Baron rises through the floor.
        k.silence();
        await k.wait(600);
        k.fx.wind(3);
        await k.fade(cold, COLD, 1.2);
        chains();
        k.face(harry, false);
        k.face(neville, false);
        await k.all(
          k.say('soCold'),
          k.to(baron, 3, { opacity: 0.9, y: 0, ease: 'power1.out' }),
          k.wait(800).then(() => k.all(k.shake(harry, 3, 3), k.shake(neville, 3, 3))),
        );
        await k.camera({ zoom: 1.3, x: 1000, y: 380 }, 1.2);
        k.pose(baron, 'loom');
        await k.say('whoRang', baron);
        chains();
        k.pose(baron, 'default');
        await k.wait(400);

        // Back to the friends: Harry is brave.
        await k.camera({}, 0.9);
        k.music('magic');
        await k.say('please', harry);
        await k.say('onlyLittle', neville);
        await k.say('followMe', baron);
        k.face(baron, false);
        await swishCloak(k, baron);
        await k.all(k.to(baron, 1.2, { x: 260, opacity: 0, ease: 'power1.in' }), k.fade(cold, 0, 1.2));
        await k.say('bigTrouble', nick);
      },
    },

    // ==================================================== 4. Goodnight, Peeves
    {
      name: 'Goodnight, Peeves',
      set(k) {
        k.backdrop('classroom');
        k.music('sneaky');
        cast.harry = k.character('harry', { x: 40, y: 380, w: 240 });
        cast.neville = k.character('neville', { x: 260, y: 380, w: 240 });
        cast.peeves = k.character('peeves', { x: 520, y: 140, w: 230 });
        cast.toad = k.prop('toad', { x: 590, y: 400, w: 100, z: 14 });
        cast.baron = k.character('baron', { x: 860, y: 280, w: 300, flip: true });
        cast.cold = chill(k);
        k.set(cast.baron, { opacity: 0, y: 260 });
      },
      async play(k) {
        const { harry, neville, peeves, toad, baron, cold } = cast;
        hover(k, peeves);
        // Trevor goes round and round in front of him.
        const spin = k.to(toad, 1.8, { rotation: 360, ease: 'sine.inOut' });
        await k.say('roundAndRound', peeves);
        await spin;
        croak();

        // The cold comes in behind him.
        k.silence();
        k.fx.wind(2);
        await k.fade(cold, COLD, 1);
        chains();
        await k.all(k.to(baron, 2.2, { opacity: 0.9, y: 0, ease: 'power1.out' }), k.wait(900).then(() => k.all(k.shake(harry, 3, 2), k.shake(neville, 3, 2))));
        await k.say('peevesBaron', baron);

        // Peeves spins round, shakes, and gives Trevor back.
        k.face(peeves, true);
        await k.shake(peeves, 8, 4);
        await k.say('sorryBaron', peeves);
        k.fx.twinkle();
        await k.to(toad, 1.2, { x: -170, y: 180, ease: 'power1.inOut' });
        croak();
        await k.pop(toad, 1.15);
        await k.say('offYouGo', baron);
        k.sfx.whoosh();
        await k.exit(peeves, 'top', 0.5);

        // Everyone warms up again.
        await k.fade(cold, 0, 0.8);
        k.music('cosy');
        await k.all(k.say('thankYouSir', neville), k.hop(neville, 30));
        await k.all(k.say('nod'), k.wait(900).then(() => k.to(baron, 0.5, { y: '+=14', yoyo: true, repeat: 1, ease: 'sine.inOut' })));
        k.fx.twinkle();
        await k.fade(baron, 0, 1.2);

        // Cosy by the common-room fire.
        await k.cut(() => {
          k.backdrop('common-room');
          k.light(560, 470, 220, { color: '#ffb060', strength: 0.4, flicker: true, z: 5 });
          // Ron isn't flipped: his jumper's R would read backwards.
          k.prop('flame', { x: 545, y: 455, w: 110, z: 4 });
          cast.ron = k.character('ron', { x: 230, y: 400, w: 240 });
          cast.harry = k.character('harry', { x: 690, y: 400, w: 240, flip: true });
          cast.neville = k.character('neville', { x: 900, y: 390, w: 240, flip: true });
          cast.toad = k.prop('toad', { x: 900, y: 580, w: 90, z: 14 });
          cast.nick = k.character('nick', { x: 420, y: 130, w: 200 });
          cast.peeves = k.character('peeves', { x: 70, y: 120, w: 170 });
          k.set(cast.peeves, { opacity: 0 });
        });
        const room = cast;
        void k.float(room.nick, 8, 2.6);
        fireCrackle(4);
        await k.all(k.say('evenPeeves', room.ron), k.wait(300).then(() => k.hop(room.ron, 24)));
        await k.say('thanksBell', room.harry);
        croak();
        await k.say('nightTrevor', room.neville);
        await k.say('nightBoys', room.nick);
        k.fx.twinkle();
        await k.fade(room.nick, 0, 1);
        await k.wait(300);

        // At the window: one last, very small raspberry.
        k.silence();
        await k.fade(room.peeves, 1, 0.4);
        await blowRaspberry(k, room.peeves, true);
        giggle();
        await k.fade(room.peeves, 0, 0.4);
        k.music('dreamy');
        await k.say('end');
        k.sparkle(560, 360, 14, 200);
        await k.wait(1200);
      },
    },
  ],
});
