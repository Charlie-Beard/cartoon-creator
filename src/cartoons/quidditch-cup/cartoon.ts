/**
 * Gryffindor Wins the Cup: the Quidditch final from the third Harry Potter
 * book, which the film never shows, with the book's other Malfoy trick (the
 * fake Dementors) folded in.
 *
 *   1. The final. On the pitch before the match, Oliver Wood: seven years
 *      he's waited for this Cup! Just catch the Snitch, Harry. Easy. Harry
 *      has his new Firebolt, the fastest broom in the world. His first turn,
 *      a drag: Wood holds out the golden Snitch and he drags it up to the
 *      hoops to let it go (it is what they chase). Malfoy sneers:
 *      "Nice broom, Potter. Pity you'll fall off it." Peep! Up they go.
 *   2. Malfoy cheats. High in the sky Harry spots the Snitch by the hoops,
 *      and Malfoy grabs the Firebolt's tail and holds on. Peep! A foul, and
 *      the crowd boos. In the Gryffindor stand: Ron, Hermione and Hagrid
 *      with their lion banner. His second turn: he waves the banner, the
 *      whole stand roars "Go, Gryffindor!", and Harry shoots off faster than
 *      ever.
 *   3. Dementors! It goes cold and quiet. Tall hooded shapes loom at
 *      the edge of the pitch. Dementors? Here? Harry remembers what
 *      Professor Lupin taught him. His big turn: he taps Harry's wand.
 *      "Expecto Patronum!" A silver stag gallops at the hoods, and they
 *      tumble into a heap of robes… out pops Malfoy, all tangled: "Ow!
 *      Crabbe, get off my foot!" Professor McGonagall: fifty points from
 *      Slytherin!
 *   4. The Snitch. There it is again, and Malfoy sees it too. A race across
 *      the sky. His fourth turn: he catches the Snitch. Gryffindor wins!
 *   5. The Cup. Everyone pours on to the pitch. Dumbledore gives the Cup to
 *      Gryffindor and Wood sobs for joy ("something in my eye… both eyes!").
 *      His fifth turn, a drag: he drags the Cup across to Harry, and Harry
 *      and Wood lift it together under the confetti.
 *
 * The scary beat is the hooded shapes: sound and cold first, a slow loom,
 * one push-in, then straight back to Harry, who is brave and knows what to
 * do. The Patronus is aimed at the costumes (empty cloth and hoods), never
 * at a person; the heap reveal is the joke. The real Dementors never appear.
 * Ron's jumper has an R, so he is never flipped.
 */
import { defineCartoon, NOTE, noiseBurst, now, tone, type Kit } from '../../kit';
import { sounds as commonSounds } from '../../worlds/common/moves';
import { warmEnding } from '../../worlds/common/pieces';
import { moves as hogMoves, sounds as hogSounds } from '../../worlds/hogwarts/moves';
import meta from './meta';

const { laugh } = commonSounds;
const { flutter, cloakSwish } = hogSounds;
const { castSpell } = hogMoves;

// ---------------------------------------------------------------- sounds

/** The referee's whistle: a bright, trilling peep. */
function whistle(long = false): void {
  const t = now();
  tone(1760, t, { wave: 'sine', peak: 0.07, attack: 0.01, decay: long ? 0.9 : 0.45, vibrato: [28, 40] });
}

/** The crowd roaring: a big swelling cheer. */
function roar(seconds = 2.4): void {
  const t = now();
  noiseBurst(t, { freq: 900, q: 0.6, peak: 0.09, attack: 0.5, decay: seconds });
  noiseBurst(t + 0.2, { freq: 1800, q: 0.8, peak: 0.05, attack: 0.4, decay: seconds - 0.2 });
  [NOTE.C5, NOTE.E5, NOTE.G5].forEach((n, i) => tone(n, t + 0.3 + i * 0.1, { wave: 'triangle', peak: 0.025, attack: 0.2, decay: 1.4 }));
}

/** The crowd booing: a low "booo" sliding down. */
function boo(): void {
  const t = now();
  tone(NOTE.C4, t, { wave: 'sawtooth', peak: 0.05, attack: 0.2, decay: 1.4, glideTo: NOTE.G3, lowpass: 600 });
  noiseBurst(t, { freq: 400, q: 0.8, peak: 0.05, attack: 0.3, decay: 1.3 });
}

/** A heap of people and cloaks collapsing: a soft flumph and a clatter. */
function flumph(): void {
  const t = now();
  noiseBurst(t, { freq: 250, q: 1, peak: 0.1, attack: 0.01, decay: 0.5 });
  tone(90, t, { wave: 'sine', peak: 0.1, decay: 0.4 });
  [0.15, 0.27].forEach((d) => tone(330, t + d, { wave: 'triangle', peak: 0.05, decay: 0.12 }));
}

// ------------------------------------------------------------------ cast

type Actor =
  | 'harry' | 'wood' | 'malfoy' | 'ron' | 'hermione' | 'hagrid' | 'mcgonagall' | 'dumbledore'
  | 'broom' | 'malfoyBroom' | 'snitch' | 'banner' | 'hoodA' | 'hoodB' | 'heap' | 'stag' | 'cup' | 'cold';
const cast = {} as Record<Actor, HTMLElement>;

/** Sits a rider on a broom: the Firebolt (or Malfoy's broomstick) across the bottom of the bust. Returns the broom. */
function mount<K extends string>(k: Kit<K>, rider: HTMLElement, o: { firebolt?: boolean; facingLeft?: boolean } = {}): HTMLElement {
  const b = k.box(rider);
  const z = Number(rider.style.zIndex) || 10;
  if (o.firebolt ?? true) {
    const bw = b.w * 1.35;
    return k.prop('firebolt', { x: b.x + b.w / 2 - bw / 2, y: b.y + b.h - bw * 0.3 * 0.75, w: bw, z: z + 1, flip: o.facingLeft });
  }
  const br = k.prop('broomstick', { x: b.x + b.w / 2 - 140, y: b.y + b.h - 135, w: 280, z: z + 1, flip: !o.facingLeft });
  k.set(br, { rotation: o.facingLeft ? -30 : 30 });
  return br;
}

/** A rider and their broom move together. */
function fly<K extends string>(k: Kit<K>, pair: HTMLElement[], seconds: number, vars: Parameters<Kit<K>['to']>[2]): Promise<void> {
  return k.to(pair, seconds, vars);
}

/** The Snitch: a golden flutter, darting about where it is. */
function snitchFlutters<K extends string>(k: Kit<K>, snitch: HTMLElement): void {
  flutter(10);
  void k.float(snitch, 14, 0.9);
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. The final
    final: { who: 'narrator', text: 'It was the Quidditch final. Gryffindor against Slytherin, for the Quidditch Cup!' },
    sevenYears: { who: 'wood', text: 'This is it, Harry. Seven years I’ve waited for this Cup. Seven years!' },
    justSnitch: { who: 'wood', text: 'Just catch the golden Snitch, and we win. Easy!' },
    askSnitchGo: { who: 'wood', text: 'Here’s the Snitch! Drag it up to the hoops, {name}, and let it go!' },
    nudgeSnitchGo: { who: 'wood', text: 'Drag the golden Snitch up to the hoops!' },
    helpedSnitchGo: { who: 'wood', text: 'Never mind, I’ll let it go myself. Off you fly!' },
    thanksSnitchGo: { who: 'wood', text: 'Off it flies! Now the match can start.' },
    flyHigh: { who: 'wood', text: 'Remember, Slytherin play rough. Fly high, fly fast, and watch out for Malfoy!' },
    easy: { who: 'harry', text: 'Easy. Right. Gulp.' },
    fastest: { who: 'harry', text: 'At least I’ve got my new Firebolt. The fastest broom in the world!' },
    bannerSeen: { who: 'wood', text: 'Listen! The whole school is cheering for us!' },
    niceBroom: { who: 'malfoy', text: 'Nice broom, Potter. Pity you’ll fall off it.' },
    ignore: { who: 'wood', text: 'Ignore him, Harry. Ready? Here we go!' },
    whistleGo: { who: 'narrator', text: 'Peep! The whistle blew, and up into the sky they flew.' },
    // 2. Malfoy cheats
    spotIt: { who: 'harry', text: 'There! The Snitch! Something gold, by the hoops!' },
    grab: { who: 'narrator', text: 'But Malfoy grabbed the tail of Harry’s Firebolt, and held on tight!' },
    letGo: { who: 'harry', text: 'Hey! Let go, Malfoy!' },
    foul: { who: 'narrator', text: 'Peep! A foul! The whole crowd booed.' },
    cheat: { who: 'ron', text: 'Cheat! Malfoy’s a cheat!' },
    comeOn: { who: 'hagrid', text: 'Come on, Harry! Don’t let him get to yeh!' },
    beauty: { who: 'hagrid', text: 'That Firebolt’s a beauty. Nothing can catch it!' },
    askBanner: { who: 'hermione', text: 'Harry needs our cheers! {name}, wave our banner!' },
    nudgeBanner: { who: 'hermione', text: 'Tap the big lion banner!' },
    helpedBanner: { who: 'ron', text: 'I’ll wave it! Go on, Harry!' },
    goGryffindor: { who: 'hagrid', text: 'GO, GRYFFINDOR!' },
    lookAtHim: { who: 'ron', text: 'Look at him go! He’s faster than ever!' },
    strange: { who: 'narrator', text: 'But down at the end of the pitch, something strange was waiting…' },
    // 3. Dementors!
    cold: { who: 'narrator', text: 'Suddenly, it went very cold. And very quiet.' },
    shapes: { who: 'harry', text: 'Who’s that? Tall dark shapes, in hoods…' },
    dementors: { who: 'harry', text: 'Dementors? Here?' },
    lupin: { who: 'harry', text: 'Professor Lupin taught me what to do. Think of something happy…' },
    askWand: { who: 'harry', text: 'Help me! Tap me for luck, and I’ll cast it!' },
    nudgeWand: { who: 'harry', text: 'Tap me, quick!' },
    helpedWand: { who: 'harry', text: 'I can do this. I can!' },
    patronus: { who: 'harry', text: 'Expecto Patronum!' },
    ow: { who: 'malfoy', text: 'Ow! Get off my foot, Crabbe!' },
    onlyMalfoy: { who: 'harry', text: 'Malfoy?! They’re not Dementors at all. It’s Malfoy, dressed up!' },
    points: { who: 'mcgonagall', text: 'Mr Malfoy! What a mean trick. Fifty points from Slytherin!' },
    hmph: { who: 'malfoy', text: 'But… but… Hmph.' },
    stillOut: { who: 'harry', text: 'Come on, Firebolt. The Snitch is still out there!' },
    // 4. The Snitch
    again: { who: 'narrator', text: 'Then Harry saw it again. The Snitch! And Malfoy saw it too.' },
    faster: { who: 'harry', text: 'Come on, Firebolt. Faster!' },
    neckAndNeck: { who: 'narrator', text: 'Faster and faster they flew, neck and neck, across the sky!' },
    mine: { who: 'malfoy', text: 'It’s mine, Potter!' },
    askSnitch: { who: 'harry', text: '{name}, there it is! Tap the Snitch and catch it!' },
    nudgeSnitch: { who: 'harry', text: 'Catch the golden Snitch!' },
    helpedSnitch: { who: 'harry', text: 'Stretch… stretch… got it!' },
    gotIt: { who: 'harry', text: 'We caught it, {name}! We caught the Snitch!' },
    wins: { who: 'narrator', text: 'Gryffindor wins the Quidditch Cup!' },
    notFair: { who: 'malfoy', text: 'Not fair!' },
    // 5. The Cup
    pitchInvasion: { who: 'narrator', text: 'The whole Gryffindor stand cheered and sang, and the team climbed up to join them.' },
    cupGoes: { who: 'dumbledore', text: 'Well flown, everybody. And the Quidditch Cup goes to… Gryffindor!' },
    woodCries: { who: 'wood', text: 'We won! Seven years! Oh, Harry, I’m so happy!' },
    isCrying: { who: 'ron', text: 'He’s crying!' },
    inMyEye: { who: 'wood', text: 'I’ve just got something in my eye. Both eyes!' },
    pillow: { who: 'wood', text: 'I’m going to sleep with this Cup under my pillow!' },
    askCup: { who: 'dumbledore', text: 'Now, {name}, drag the Cup over to Harry!' },
    nudgeCup: { who: 'dumbledore', text: 'Drag the big silver Cup to Harry!' },
    helpedCup: { who: 'dumbledore', text: 'Never mind, I’ll carry it over to him myself.' },
    thanksCup: { who: 'harry', text: 'Got it! Thank you!' },
    thanksDumbledore: { who: 'harry', text: 'Thank you, Professor!' },
    together: { who: 'harry', text: 'Let’s lift it together! One, two, three!' },
    brilliant: { who: 'ron', text: 'Harry, you were brilliant!' },
    thanksName: { who: 'harry', text: 'Thank you, {name}. The best Quidditch match ever!' },
    end: { who: 'narrator', text: 'And the Quidditch Cup went home with Gryffindor. Hooray!' },
  },
  scenes: [
    // ==================================================== 1. The final
    {
      name: 'The final',
      set(k) {
        k.backdrop('quidditch-pitch');
        k.music('adventure');
        cast.harry = k.character('harry', { x: 120, y: 370, w: 240 });
        cast.broom = mount(k, cast.harry);
        cast.wood = k.character('wood', { x: 420, y: 370, w: 260 });
        cast.malfoy = k.character('malfoy', { x: 820, y: 396, w: 240, flip: true });
        k.set(cast.malfoy, { opacity: 0, x: 400 });
        // The Snitch in Wood's fist, waiting to be let go.
        cast.snitch = k.prop('snitch', { x: 610, y: 560, w: 120, z: 15 });
        k.set(cast.snitch, { opacity: 0 });
      },
      async play(k) {
        const { harry, broom, wood, malfoy, snitch } = cast;
        roar(2);
        await k.say('final');
        k.face(wood, true);
        await k.say('sevenYears', wood);
        await k.say('justSnitch', wood);

        // His first turn: let the Snitch go, up to the hoops.
        await k.fade(snitch, 1, 0.4);
        const go = await k.dragToHelp(snitch, { to: [730, 260], ask: 'askSnitchGo', nudge: 'nudgeSnitchGo', helped: 'helpedSnitchGo', by: wood, dropSize: 200 });
        snitchFlutters(k, snitch);
        await k.to(snitch, 0.9, { x: '+=130', y: '-=130', ease: 'power1.out' });
        await k.vanish(snitch, 0.3);
        if (go === 'dragged') await k.say('thanksSnitchGo', wood);
        await k.say('flyHigh', wood);
        await k.all(k.say('easy', harry), k.shake(harry, 3, 2));
        k.sfx.sparkle();
        k.sparkle(260, 640, 8, 120);
        await k.say('fastest', harry);
        roar(2);
        await k.say('bannerSeen', wood);

        // Malfoy swaggers up.
        k.music('sneaky');
        k.set(malfoy, { opacity: 1 });
        await k.walk(malfoy, -400, 1.4, 4);
        await k.say('niceBroom', malfoy);
        k.face(wood, false);
        await k.say('ignore', wood);

        // Peep! Up they go.
        whistle(true);
        k.music('adventure');
        k.sfx.whoosh();
        await k.all(
          k.say('whistleGo'),
          k.wait(500).then(() => fly(k, [harry, broom], 1.4, { y: -900, x: 300, ease: 'power2.in' })),
          k.wait(900).then(() => k.to(malfoy, 1.2, { y: -900, ease: 'power2.in' })),
        );
      },
    },

    // ==================================================== 2. Malfoy cheats
    {
      name: 'Malfoy cheats',
      set(k) {
        k.backdrop('quidditch-pitch');
        k.music('adventure');
        cast.snitch = k.prop('snitch', { x: 900, y: 300, w: 90, z: 15 });
        cast.harry = k.character('harry', { x: 330, y: 160, w: 210 });
        cast.broom = mount(k, cast.harry);
        cast.malfoy = k.character('malfoy', { x: 40, y: 190, w: 200 });
        cast.malfoyBroom = mount(k, cast.malfoy, { firebolt: false });
        k.set([cast.harry, cast.broom], { x: -700 });
        k.set([cast.malfoy, cast.malfoyBroom], { x: -700 });
      },
      async play(k) {
        const { snitch, harry, broom, malfoy, malfoyBroom } = cast;
        k.fx.wind(2);
        await fly(k, [harry, broom], 1.6, { x: 0, ease: 'power2.out' });
        snitchFlutters(k, snitch);
        k.sparkle(945, 330, 8, 70);
        await k.say('spotIt', harry);

        // Off towards it… and Malfoy grabs the tail.
        k.sfx.whoosh();
        await k.all(
          fly(k, [harry, broom], 1.1, { x: 200, ease: 'power1.in' }),
          fly(k, [malfoy, malfoyBroom], 1.1, { x: 260, ease: 'power2.out' }),
        );
        // He's caught by the tail: jerked back, and shaking.
        k.fx.thud();
        await fly(k, [harry, broom], 0.3, { x: 140, ease: 'power2.out' });
        await k.all(k.shake(harry, 6, 3), k.shake(broom, 6, 3));
        await k.say('grab');
        await k.all(k.say('letGo', harry), k.shake(harry, 4, 2));
        whistle();
        boo();
        await k.say('foul');

        // In the Gryffindor stand.
        await k.cut(() => {
          k.backdrop('quidditch-stands');
          cast.ron = k.character('ron', { x: 120, y: 380, w: 240 });
          cast.hermione = k.character('hermione', { x: 360, y: 386, w: 240 });
          cast.hagrid = k.character('hagrid', { x: 800, y: 250, w: 340, flip: true });
          cast.banner = k.prop('gryffindorBanner', { x: 380, y: 140, w: 420, z: 8 });
        });
        const { ron, hermione, hagrid, banner } = cast;
        await k.all(k.say('cheat', ron), k.shake(ron, 5, 2));
        await k.say('comeOn', hagrid);
        await k.say('beauty', hagrid);

        // His second turn: wave the banner.
        await k.tapToHelp(banner, { ask: 'askBanner', nudge: 'nudgeBanner', helped: 'helpedBanner', by: hermione, helper: ron, size: 260 });
        const cloth = k.pivot(k.part(banner, 'cloth'));
        void k.to(cloth.length ? cloth : banner, 0.3, { rotation: 6, yoyo: true, repeat: 5, ease: 'sine.inOut' });
        roar(3);
        k.confetti(20);
        await k.all(k.say('goGryffindor', hagrid), k.hop(ron, 30), k.hop(hermione, 30));
        k.sfx.whoosh();
        await k.all(k.say('lookAtHim', ron), k.wait(300).then(() => k.hop(hermione, 20)));
        k.music('sneaky');
        await k.say('strange');
      },
    },

    // ==================================================== 3. Dementors!
    {
      name: 'Dementors!',
      set(k) {
        k.backdrop('quidditch-pitch');
        k.music('adventure');
        cast.harry = k.character('harry', { x: 120, y: 300, w: 220 });
        cast.broom = mount(k, cast.harry);
        cast.cold = k.dim(0.4, '#1a2234');
        k.set(cast.cold, { opacity: 0 });
        cast.hoodA = k.prop('fakeDementor', { x: 700, y: 250, w: 200, z: 12 });
        cast.hoodB = k.prop('fakeDementor', { x: 900, y: 230, w: 210, z: 12 });
        k.set([cast.hoodA, cast.hoodB], { opacity: 0, y: 60 });
        cast.heap = k.prop('robeHeap', { x: 700, y: 500, w: 380, z: 14 });
        cast.malfoy = k.character('malfoy', { x: 770, y: 290, w: 220, z: 13, pose: 'tangled' });
        cast.stag = k.prop('patronusStag', { x: 300, y: 330, w: 240, z: 20 });
        cast.mcgonagall = k.character('mcgonagall', { x: 990, y: 360, w: 200, flip: true });
        k.set([cast.heap, cast.malfoy, cast.stag, cast.mcgonagall], { opacity: 0 });
      },
      async play(k) {
        const { harry, broom, cold, hoodA, hoodB, heap, malfoy, stag, mcgonagall } = cast;
        void k.to([harry, broom], 1.6, { y: -10, yoyo: true, repeat: 1, ease: 'sine.inOut' });
        await k.wait(600);

        // Cold and quiet first, then the hoods loom in, slowly.
        k.silence();
        k.fx.wind(3);
        await k.all(k.say('cold'), k.fade(cold, 0.4, 1.6));
        cloakSwish();
        await k.all(k.to(hoodA, 2.2, { opacity: 1, y: 0, ease: 'power1.out' }), k.wait(500).then(() => k.to(hoodB, 2.2, { opacity: 1, y: 0, ease: 'power1.out' })));
        k.music('spooky');
        await k.camera({ zoom: 1.25, x: 860, y: 400 }, 1.2);
        await k.wait(300);
        await k.camera({}, 0.9);
        await k.all(k.say('shapes', harry), k.shake(harry, 3, 2));
        await k.say('dementors', harry);

        // Back to Harry: he knows what to do.
        k.music('magic');
        await k.say('lupin', harry);
        await k.tapToHelp(harry, { ask: 'askWand', nudge: 'nudgeWand', helped: 'helpedWand', by: harry, size: 200 });
        await k.say('patronus', harry);
        await castSpell(k, harry, [650, 320]);
        k.sfx.shield();
        await k.fade(stag, 0.95, 0.4);
        // The stag gallops at the empty hoods (never at a person), and they topple.
        await k.to(stag, 0.9, { x: 380, ease: 'power2.in' });

        // The hoods topple into a heap of robes… and out pops Malfoy.
        flumph();
        k.puff(840, 470, 260, '#2a2a33');
        k.set([hoodA, hoodB], { opacity: 0 });
        k.set(heap, { opacity: 1 });
        await k.all(k.fade(stag, 0, 0.6), k.fade(cold, 0, 0.8));
        await k.all(k.fade(malfoy, 1, 0.3), k.pop(malfoy, 1.08));
        laugh();
        await k.all(k.say('ow', malfoy), k.shake(malfoy, 5, 3));
        await k.all(k.say('onlyMalfoy', harry), k.hop(harry, 20));

        // Professor McGonagall marches up.
        k.music('sneaky');
        await k.all(k.fade(mcgonagall, 1, 0.3), k.enter(mcgonagall, 'right', 0.7));
        await k.say('points', mcgonagall);
        await k.say('hmph', malfoy);
        laugh();
        k.music('adventure');
        await k.all(k.say('stillOut', harry), k.to([harry, broom], 0.8, { y: -40, ease: 'power1.out' }));
      },
    },

    // ==================================================== 4. The Snitch
    {
      name: 'The Snitch',
      set(k) {
        k.backdrop('quidditch-pitch');
        k.music('adventure');
        cast.snitch = k.prop('snitch', { x: 880, y: 380, w: 110, z: 15 });
        cast.harry = k.character('harry', { x: 150, y: 120, w: 210 });
        cast.broom = mount(k, cast.harry);
        cast.malfoy = k.character('malfoy', { x: 120, y: 330, w: 200 });
        cast.malfoyBroom = mount(k, cast.malfoy, { firebolt: false });
        k.set([cast.harry, cast.broom, cast.malfoy, cast.malfoyBroom], { x: -600 });
      },
      async play(k) {
        const { snitch, harry, broom, malfoy, malfoyBroom } = cast;
        snitchFlutters(k, snitch);
        await k.say('again');

        // A race across the sky.
        k.fx.wind(3);
        k.sfx.whoosh();
        await k.all(
          fly(k, [harry, broom], 1.4, { x: 0, ease: 'power2.out' }),
          k.wait(200).then(() => fly(k, [malfoy, malfoyBroom], 1.4, { x: 0, ease: 'power2.out' })),
        );
        await k.say('faster', harry);
        await k.say('neckAndNeck');
        await k.say('mine', malfoy);
        k.sfx.whoosh();
        await k.all(
          fly(k, [harry, broom], 1.4, { x: 430, y: 120, ease: 'power2.inOut' }),
          fly(k, [malfoy, malfoyBroom], 1.4, { x: 300, ease: 'power2.inOut' }),
        );

        // His fourth turn: catch the Snitch.
        const how = await k.tapToHelp(snitch, { ask: 'askSnitch', nudge: 'nudgeSnitch', helped: 'helpedSnitch', by: harry, size: 160 });
        k.sfx.success();
        const sb = k.box(snitch);
        const hb = k.box(harry);
        await fly(k, [harry, broom], 0.6, { x: `+=${sb.x - (hb.x + hb.w * 0.6)}`, y: `+=${sb.y - (hb.y + hb.h * 0.55)}`, ease: 'power2.out' });
        k.sparkle(sb.x + sb.w / 2, sb.y + sb.h / 2, 16, 160);
        // Into Harry's fist it goes.
        await k.vanish(snitch, 0.3);
        whistle(true);
        roar(3);
        k.music('triumph');
        if (how === 'tapped') await k.say('gotIt', harry);
        await k.say('wins');
        k.confetti(30);
        await k.say('notFair', malfoy);
        await k.wait(500);
      },
    },

    // ==================================================== 5. The Cup
    {
      name: 'The Cup',
      set(k) {
        k.backdrop('quidditch-stands');
        k.music('triumph');
        cast.ron = k.character('ron', { x: 30, y: 390, w: 230 });
        cast.wood = k.character('wood', { x: 250, y: 370, w: 250 });
        cast.harry = k.character('harry', { x: 490, y: 390, w: 230 });
        cast.dumbledore = k.character('dumbledore', { x: 860, y: 360, w: 250, flip: true });
        cast.cup = k.prop('quidditchCup', { x: 770, y: 440, w: 150, z: 16 });
        k.set(cast.cup, { opacity: 0 });
      },
      async play(k) {
        const { ron, harry, wood, dumbledore, cup } = cast;
        roar(3);
        k.confetti(30);
        await k.say('pitchInvasion');
        k.sfx.fanfare();
        await k.all(k.fade(cup, 1, 0.5), k.pop(cup, 1.1));
        k.sparkle(845, 520, 14, 160);
        await k.say('cupGoes', dumbledore);
        await k.all(k.say('woodCries', wood), k.hop(wood, 30));
        await k.shake(wood, 4, 4);
        await k.say('isCrying', ron);
        laugh();
        await k.say('inMyEye', wood);
        await k.say('pillow', wood);
        laugh();

        // Harry and Wood lift the Cup together.
        // His fifth turn: drag the Cup over to Harry.
        const passed = await k.dragToHelp(cup, { to: [610, 620], ask: 'askCup', nudge: 'nudgeCup', helped: 'helpedCup', by: dumbledore, dropSize: 200 });
        await k.say(passed === 'dragged' ? 'thanksCup' : 'thanksDumbledore', harry);
        await k.say('together', harry);
        await k.to(cup, 0.6, { y: '-=300', ease: 'back.out(1.6)' });
        roar(3);
        k.confetti(40);
        k.sparkle(610, 300, 16, 220);
        await k.all(k.hop(harry, 40), k.hop(wood, 40), k.hop(ron, 30));
        await k.say('brilliant', ron);
        await k.say('thanksName', harry);
        await warmEnding(k, { cast: [ron, harry, wood, dumbledore], end: 'end' });
      },
    },
  ],
});
