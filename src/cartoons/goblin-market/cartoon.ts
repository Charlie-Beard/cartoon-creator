/**
 * The Goblin Market: a sly pedlar whistles the Wishing-Chair away in the
 * night to sell it at the Goblin Market, and the friends float after it under
 * Jigs's umbrella. When Jigs whistles the chair's favourite tune, it wriggles
 * free of its rope and flies them home.
 *
 *   1. The empty corner (playroom). Morning: Mollie and Peter come in, and
 *      the chair's corner is empty. "The Wishing-Chair is gone!" Jigs wakes:
 *      he heard a long, sneaky whistle in the night. Deed: Mollie finds a red
 *      wing feather and big muddy footprints. Pointy boots: that's Old
 *      Slyboots the pedlar, who sells things at the Goblin Market. How to get
 *      there with no chair? Deed: Jigs opens his umbrella (pop) and it lifts
 *      the three of them up and out of the doors.
 *   2. Under the umbrella (wishing-sky). Floating, holding on, the wind. A big
 *      gust blows the umbrella inside out and they sink. Deed: Peter jumps up,
 *      grabs the rim and pulls it straight (boing). Lanterns in a wood, and
 *      music: the Goblin Market. Sssh: be sneaky too.
 *   3. The Goblin Market (uh-oh). Slyboots calls his wares by his stall; the
 *      chair is tied up with rope, wings drooping, a FOR SALE tag on its arm.
 *      The friends sneak in behind the stall. Peter steps out: "That's OUR
 *      chair!" Scary beat: silence, a deep note, a stomp. Slyboots looms:
 *      "Got any MONEY? No? Then SHOO!" and clutches the chair: "MINE!" Cut back
 *      to the friends behind the stall: Mollie asks what the chair loves most.
 *      Jigs's whistle. Deed: Jigs whistles its tune and the chair wriggles
 *      and wriggles; Slyboots shouts "Keep STILL!" Big deed: Peter creeps
 *      round and pulls the big knot; the rope falls, the wings spring out.
 *      Everyone jumps on; Slyboots grabs at air and flops into his own pile of
 *      cushions (poof): "Come BACK!" "It was never yours to sell!"
 *   4. A bell on the door (wishing-sky, then the playroom). Flying home with
 *      the umbrella hooked on the chair arm, laughing. The chair back in its
 *      corner, creaking. Deed: Mollie ties a little bell on the door, so
 *      anyone who sneaks in will ring it. Jigs will sleep on the chair's seat
 *      every night. Goodnight. The bell tinkles softly. Warm ending.
 *
 * Scary, never cruel (docs/STYLE.md): Slyboots looms, stomps and snaps "MINE!"
 * but he never touches anyone, and his defeat is a soft landing in his own
 * cushions. The friends are whispering a plan again within seconds. Old
 * Slyboots, the Goblin Market and its sounds are new to the world; the chair
 * and its riders are the world's chairRide set piece, and the rope, the tag,
 * the cushions, the feather, the footprints, the bell and the far-off wood
 * are drawn here.
 */
import { bell, C, cached, circle, curve, defineCartoon, ellipse, group, ink, noiseBurst, NOTE, now, piece, poly, rect, svg, tone, type Kit } from '../../kit';
import { moves as common, sounds as commonSounds } from '../../worlds/common/moves';
import { sneakIn, warmEnding } from '../../worlds/common/pieces';
import { sounds } from '../../worlds/wishing/moves';
import { chairRide, type Ride } from '../../worlds/wishing/pieces';
import meta from './meta';

const { creak, hatBell, highWind } = sounds;
const { giggle, ting } = commonSounds;

// ------------------------------------------------------------------- art

/** A red wing feather with a pale quill. 100 × 44. */
const feather = cached(() =>
  svg({ w: 100, h: 44, name: 'goblin-market-feather', label: 'A red feather' }, [
    piece(curve([[6, 26], [30, 8], [70, 6], [96, 18], [72, 32], [30, 38]], 2), C.coatRed),
    piece(curve([[40, 14], [64, 12], [84, 18], [64, 24]], 1), C.rose, { edge: 'cut', fibre: false, shadow: false, opacity: 0.6 }),
    ink([[2, 28], [50, 22], [94, 18]], { width: 3, color: C.cream, wobble: 0.3 }),
  ]),
);

/** A trail of four muddy pointy-toed boot prints coming across the floor, toes to the left. 420 × 70. */
const footprints = cached(() => {
  const print = (x: number, y: number): ReturnType<typeof piece>[] => [
    piece(poly([[x - 36, y], [x - 12, y - 12], [x + 14, y - 11], [x + 16, y + 11], [x - 12, y + 12]]), '#4a3626', { edge: 'torn', fibre: false, shadow: false, opacity: 0.85 }),
    piece(circle(x + 28, y, 9), '#4a3626', { edge: 'torn', fibre: false, shadow: false, opacity: 0.85 }),
  ];
  return svg({ w: 420, h: 70, name: 'goblin-market-footprints', label: 'Muddy footprints' }, [...print(380, 20), ...print(280, 48), ...print(170, 20), ...print(60, 48)]);
});

/** A rope looped round the chair with a big knot at its left end; the `knot` part is the knot. 380 × 120. */
const rope = cached(() => {
  const strand = (c: string, dy: number): ReturnType<typeof piece> =>
    piece(curve([[8, 62 + dy], [90, 80 + dy], [220, 86 + dy], [340, 72 + dy], [374, 54 + dy], [340, 94 + dy], [220, 102 + dy], [90, 98 + dy]], 2), c, { edge: 'cut', shadow: dy === 0 });
  return svg({ w: 380, h: 120, name: 'goblin-market-rope', label: 'A rope with a big knot' }, [
    strand('#c9a96a', 0),
    ...[40, 90, 140, 190, 240, 290, 340].map((x) => ink([[x, 70 + Math.sin(x / 60) * 6], [x + 14, 98 + Math.sin(x / 60) * 6]], { width: 2.4, color: '#8d7040', wobble: 0.3 })),
    group({ part: 'knot', origin: [56, 84] }, [
      piece(ellipse(56, 84, 30, 24), '#b8964f', { edge: 'cut' }),
      piece(ellipse(52, 80, 14, 10), '#d3b574', { edge: 'cut', fibre: false, shadow: false }),
      piece(poly([[40, 100], [30, 118], [44, 116], [52, 102]]), '#c9a96a', { edge: 'cut', fibre: false }),
      piece(poly([[62, 102], [70, 120], [80, 112], [72, 98]]), '#c9a96a', { edge: 'cut', fibre: false }),
    ]),
  ]);
});

/** A paper price tag on a string, blank: the words are lettering laid over it. 150 × 90. */
const tag = cached(() =>
  svg({ w: 150, h: 90, name: 'goblin-market-tag', label: 'A price tag' }, [
    ink([[75, 0], [60, 22], [40, 26]], { width: 2.4, color: C.brownDark }),
    piece(poly([[6, 30], [140, 24], [144, 78], [10, 84]]), C.cream),
    piece(circle(20, 56, 5), C.brownDark, { edge: 'clean', shadow: false, fibre: false }),
  ]),
);

/** A little brass bell on a red ribbon. 56 × 78. */
const doorBell = cached(() =>
  svg({ w: 56, h: 78, name: 'goblin-market-bell', label: 'A little brass bell' }, [
    piece(poly([[28, 8], [14, 0], [8, 14], [28, 16], [48, 14], [42, 0]]), C.coatRed, { edge: 'cut', fibre: false }),
    piece(curve([[10, 58], [12, 34], [20, 20], [36, 20], [44, 34], [46, 58]], 2), C.brass, { edge: 'cut' }),
    piece(rect(6, 54, 44, 9, 4), C.brassDark, { edge: 'cut', fibre: false }),
    piece(circle(28, 68, 7), C.brassDark, { edge: 'cut', fibre: false }),
    piece(curve([[16, 52], [18, 36], [24, 28]], 1), C.goldLight, { edge: 'cut', fibre: false, shadow: false, opacity: 0.8 }),
  ]),
);

/** Slyboots's pile of cushions, a soft heap in three colours. 300 × 130. */
const cushions = cached(() =>
  svg({ w: 300, h: 130, name: 'goblin-market-cushions', label: 'A heap of cushions' }, [
    piece(curve([[4, 126], [0, 96], [26, 74], [150, 70], [274, 74], [300, 96], [296, 126], [150, 130]], 2), C.violet),
    piece(curve([[40, 80], [44, 52], [90, 40], [160, 42], [220, 56], [226, 80], [150, 88]], 2), C.teal),
    piece(curve([[100, 56], [108, 28], [150, 16], [194, 28], [200, 56], [150, 64]], 2), C.goldLight),
    ...[[40, 106], [96, 112], [210, 108], [262, 110]].map(([x, y]) => piece(circle(x, y, 7), C.raspberry, { edge: 'cut', fibre: false, shadow: false })),
    ink([[130, 36], [150, 30], [170, 36]], { width: 3, color: C.goldLight, wobble: 0.3 }),
    piece(poly([[0, 118], [-8, 130], [6, 130]]), C.gold, { edge: 'cut', fibre: false, shadow: false }),
    piece(poly([[300, 118], [308, 130], [294, 130]]), C.gold, { edge: 'cut', fibre: false, shadow: false }),
  ]),
);

/** Far away: a dark wood on a hill with lanterns glowing among the trees. 400 × 170. */
const farWood = cached(() =>
  svg({ w: 400, h: 170, name: 'goblin-market-far-wood', label: 'A far wood with lanterns' }, [
    piece(curve([[0, 170], [10, 130], [80, 104], [200, 96], [320, 108], [390, 134], [400, 170]], 2), C.greenDeep, { shadow: false }),
    ...[30, 90, 150, 210, 270, 330, 380].flatMap((x, i) => [
      piece(poly([[x - 26, 130], [x, 40 + (i % 3) * 14], [x + 26, 130]]), i % 2 ? C.woodShade : C.greenDark, { edge: 'cut', fibre: false, shadow: false }),
    ]),
    ...[[70, 116], [140, 100], [200, 112], [260, 98], [330, 114], [372, 124]].map(([x, y]) => piece(circle(x, y, 16), C.candle, { edge: 'clean', fibre: false, shadow: false, opacity: 0.35 })),
    ...[[70, 116], [140, 100], [200, 112], [260, 98], [330, 114], [372, 124]].map(([x, y]) => piece(circle(x, y, 6), C.goldLight, { edge: 'clean', fibre: false, shadow: false })),
  ]),
);

// ---------------------------------------------------------------- sounds

/** The chair's favourite tune: a soft, wobbly whistle, up and down and home again. About 3.5 s. */
function whistleTune(): void {
  const t = now();
  const song: Array<[number, number, number]> = [
    [NOTE.G5, 0, 0.5],
    [NOTE.E5, 0.55, 0.4],
    [NOTE.G5, 1.0, 0.4],
    [NOTE.A5, 1.45, 0.7],
    [NOTE.G5, 2.2, 0.4],
    [NOTE.E5, 2.65, 0.4],
    [NOTE.C5, 3.1, 0.9],
  ];
  for (const [f, dt, len] of song) {
    tone(f, t + dt, { wave: 'sine', peak: 0.07, attack: 0.05, decay: len, vibrato: [6, 7] });
    noiseBurst(t + dt, { freq: 3200, q: 5, peak: 0.012, attack: 0.05, decay: len });
  }
}

/** The market bustle: a murmur of voices and a jaunty little jingle on bells. */
function marketBustle(): void {
  const t = now();
  for (let i = 0; i < 6; i++) noiseBurst(t + i * 0.45, { freq: 500 + (i % 3) * 120, q: 1.4, peak: 0.02, attack: 0.15, decay: 0.4 });
  const jingle: Array<[number, number]> = [[NOTE.C6, 0], [NOTE.E6, 0.2], [NOTE.G5, 0.4], [NOTE.C6, 0.6], [NOTE.D6, 0.9], [NOTE.G5, 1.1], [NOTE.E6, 1.4], [NOTE.C6, 1.6]];
  for (const [f, dt] of jingle) bell(f, t + dt, 0.04, 0.35);
}

/** Slyboots stomping: two heavy thuds and a rumble. Never harsh. */
function bigStomp(): void {
  const t = now();
  for (let i = 0; i < 2; i++) {
    tone(90, t + i * 0.45, { wave: 'sine', peak: 0.12, attack: 0.01, decay: 0.35, glideTo: 50 });
    noiseBurst(t + i * 0.45, { freq: 220, type: 'lowpass', peak: 0.08, attack: 0.01, decay: 0.3 });
  }
}

/** The deep, slow note under a scary beat. */
function deepNote(): void {
  tone(55, now(), { wave: 'sawtooth', peak: 0.06, attack: 0.4, decay: 1.8, glideTo: 48, lowpass: 240 });
}

// ------------------------------------------------------------------ cast

const cast = {} as Record<
  'mollie' | 'peter' | 'jigs' | 'slyboots' | 'umbrella' | 'feather' | 'prints' | 'rope' | 'tag' | 'tagWords' | 'cushions' | 'bell' | 'wood',
  HTMLElement
>;
let ride: Ride;

/** Every piece of a ride (chair, riders, front) and anything hooked on it, to tween together. */
const ridePieces = (a: Ride, ...more: HTMLElement[]): HTMLElement[] => [a.chair, ...a.riders, a.front, ...more];

/** The chair (and all that is tied to it) wriggles its legs, wanting to be free. */
async function wriggleAll(k: Kit, els: HTMLElement[], times = 4): Promise<void> {
  creak();
  for (let i = 0; i < times; i++) {
    await k.all(...els.map((el) => k.to(el, 0.13, { rotation: 4, ease: 'sine.inOut' })));
    await k.all(...els.map((el) => k.to(el, 0.13, { rotation: -4, ease: 'sine.inOut' })));
    if (i === 1) creak();
  }
  await k.all(...els.map((el) => k.to(el, 0.13, { rotation: 0 })));
}

/** Swaps Jigs's umbrella for its other drawing, in the same place (a prop has no poses). */
function swapUmbrella(k: Kit, to: 'jigs-umbrella' | 'jigs-umbrella-blown', at: { x: number; y: number; w: number; z: number }): void {
  const old = cast.umbrella;
  const lift = k.box(old);
  k.remove(old);
  cast.umbrella = k.prop(to, { ...at });
  k.set(cast.umbrella, { x: lift.x - at.x, y: lift.y - at.y });
}

// ---------------------------------------------------------------- places

/** Scene 2: where each of the three floats under the umbrella. */
const FLOAT = {
  mollie: { x: 330, y: 370, w: 190, z: 14 },
  jigs: { x: 490, y: 370, w: 170, z: 14 },
  peter: { x: 620, y: 370, w: 180, z: 14 },
};
/** Jigs's right arm, held straight up. */
const ARM_UP = -160;
/**
 * Where the umbrella goes so its handle sits in Jigs's raised hand, from
 * Jigs's own box (the hand is about 0.83 of his width across and 1.28 down;
 * the handle is the middle of the umbrella and its crook the bottom).
 */
const umbrellaFor = (j: { x: number; y: number; w: number }, z: number): { x: number; y: number; w: number; z: number } => ({
  x: j.x - 0.044 * j.w,
  y: j.y - 0.74 * j.w,
  w: 1.737 * j.w,
  z,
});
const UMB = umbrellaFor(FLOAT.jigs, 12);

/** Scene 3: the chair, its tie, the pedlar, and the friends behind the left-hand stall. */
const CHAIR = { x: 350, y: 320, w: 340, z: 12 };
const SLY = { x: 770, y: 318, w: 290, z: 10 };
const HIDE = {
  mollie: { x: 100, y: 448, w: 160, z: 24 },
  peter: { x: 250, y: 440, w: 165, z: 25 },
  jigs: { x: 0, y: 516, w: 105, z: 26 },
};

export default defineCartoon({
  ...meta,
  lines: {
    // 1. The empty corner
    morning: { who: 'narrator', text: 'One sunny morning, Mollie and Peter ran down the garden to the playroom.' },
    hello: { who: 'mollie', text: 'Good morning, chair! Good morning, Jigs!' },
    gone: { who: 'peter', text: 'Oh no! The Wishing-Chair is gone! Someone has taken it!' },
    whistle: { who: 'jigs', text: 'Gone? Yaaawn… I heard a whistle in the night. A long, sneaky whistle.' },
    clue: { who: 'mollie', text: 'Look! A red feather from its wing, and big muddy footprints.' },
    pedlar: { who: 'jigs', text: 'Pointy boots! That’s Old Slyboots the pedlar. He sells things at the Goblin Market.' },
    how: { who: 'peter', text: 'Then we’ll get it back! But how, without the chair?' },
    umbrella: { who: 'jigs', text: 'With my umbrella! Hold on, everybody. Up we go!' },
    // 2. Under the umbrella
    holdOn: { who: 'mollie', text: 'Hold on tight, everybody!' },
    floating: { who: 'peter', text: 'We’re floating! The fields look as small as stamps.' },
    gust: { who: 'jigs', text: 'Oh no! A big gust of wind! My umbrella’s gone inside out!' },
    sinking: { who: 'mollie', text: 'We’re sinking!' },
    pull: { who: 'peter', text: 'I’ll pull it straight! Hold still, everybody.' },
    backAgain: { who: 'jigs', text: 'Boing! It’s the right way round again. Thank you, Peter!' },
    lanterns: { who: 'mollie', text: 'Look! Lanterns in the wood. And I can hear music!' },
    sneaky: { who: 'jigs', text: 'That’s the Goblin Market. Sssh now. We must be sneaky too.' },
    // 3. The Goblin Market
    call: { who: 'slyboots', text: 'Flying chair! Finest flying chair! Very cheap, very cheap!' },
    poor: { who: 'mollie', text: 'There it is! Poor chair. It looks so sad.' },
    ours: { who: 'peter', text: 'That’s OUR chair!' },
    money: { who: 'slyboots', text: 'Got any MONEY? No? Then SHOO!' },
    mine: { who: 'slyboots', text: 'MINE! I found it fair and square!' },
    brave: { who: 'mollie', text: 'Let’s be brave. Jigs, what does the chair love most?' },
    tune: { who: 'jigs', text: 'My whistle! Every night I whistle it a little tune.' },
    plan: { who: 'peter', text: 'Then whistle, and I’ll untie the rope while he’s not looking!' },
    hereGoes: { who: 'jigs', text: 'Here goes. Its very own tune.' },
    stop: { who: 'slyboots', text: 'Stop that! Keep STILL, you silly chair!' },
    untied: { who: 'peter', text: 'Got it! The knot’s undone!' },
    onBoard: { who: 'jigs', text: 'Look, its wings are springing out! Everybody on!' },
    comeBack: { who: 'slyboots', text: 'Come BACK! That’s MY chair!' },
    notYours: { who: 'mollie', text: 'It was never yours to sell!' },
    // 4. A bell on the door
    face: { who: 'peter', text: 'Did you see his face? He was so cross!' },
    plop: { who: 'jigs', text: 'Plop! Right into his own pile of cushions!' },
    homeWeGo: { who: 'mollie', text: 'Home we go, chair. Nice and gently.' },
    never: { who: 'mollie', text: 'Nobody is ever taking you again, chair.' },
    bell: { who: 'mollie', text: 'I’ll tie a little bell on the door. If anybody sneaks in, it will ring!' },
    tingALing: { who: 'jigs', text: 'Ting-a-ling! That’s a very good bell.' },
    sleep: { who: 'jigs', text: 'And I’ll sleep right here on your seat, every night.' },
    night: { who: 'peter', text: 'Goodnight, chair. Goodnight, Jigs.' },
    end: { who: 'narrator', text: 'And the little bell tinkled in the breeze, and the Wishing-Chair creaked happily all night long.' },
  },
  scenes: [
    // ================================================ 1. The empty corner
    {
      name: 'The empty corner',
      set(k) {
        k.backdrop('playroom');
        k.music('cosy');
        k.light(1010, 380, 240, { color: '#fff3c8', strength: 0.3, z: 5 });
        cast.feather = k.add(feather(), { x: 215, y: 650, w: 96, z: 6 });
        cast.prints = k.add(footprints(), { x: 250, y: 672, w: 380, z: 6 });
        k.set([cast.feather, cast.prints], { opacity: 0 });
        // Jigs is fast asleep on the rug where the chair should be.
        cast.jigs = k.character('jigs', { x: 330, y: 500, w: 170, z: 10 });
        k.set(k.part(cast.jigs, 'lids'), { opacity: 1 });
        cast.mollie = k.character('mollie', { x: 560, y: 405, w: 220, z: 10, flip: true });
        cast.peter = k.character('peter', { x: 790, y: 405, w: 220, z: 11, flip: true });
        k.set([cast.mollie, cast.peter], { opacity: 0 });
        // The umbrella opens over where Jigs will stand, handle in his hand.
        cast.umbrella = k.prop('jigs-umbrella', umbrellaFor({ x: 600, y: 500, w: 170 }, 9));
        k.set(cast.umbrella, { opacity: 0 });
      },
      async play(k) {
        const { mollie, peter, jigs, feather: quill, prints, umbrella } = cast;
        await k.say('morning');
        await k.all(k.enter(mollie, 'right', 0.9), k.wait(250).then(() => k.enter(peter, 'right', 0.9)));
        await k.say('hello', mollie);
        await k.wait(500);
        await k.all(k.say('gone', peter), k.shake(peter, 5, 2));

        // Jigs wakes up.
        k.set(k.part(jigs, 'lids'), { opacity: 0 });
        hatBell();
        await k.hop(jigs, 20, 1);
        await k.say('whistle', jigs);

        // Mollie spots the clues on the floor.
        k.fx.sneak();
        await k.to(mollie, 0.6, { x: '-=60' });
        k.fx.pop();
        await k.all(k.appear(quill, 0.5), k.fade(prints, 1, 0.8));
        k.flourish(quill);
        await k.say('clue', mollie);
        await k.say('pedlar', jigs);
        await k.say('how', peter);
        await k.walk(peter, -90, 0.8, 3);

        // The friends huddle close, and Jigs holds his hand up high.
        await k.all(k.walk(mollie, -60, 0.9, 3), k.walk(peter, 40, 0.9, 3), k.walk(jigs, 270, 0.9, 3));
        const armJ = k.pivot(k.part(jigs, 'armR'));
        await k.to(armJ, 0.35, { rotation: ARM_UP, ease: 'back.out(1.4)' });

        // Jigs opens his umbrella, and up they go.
        k.fx.pop();
        await k.appear(umbrella, 0.4);
        await k.all(k.say('umbrella', jigs), k.shake(mollie, 3, 2));
        k.fx.twinkle();
        k.flourish(umbrella);
        k.music('magic');
        highWind(2.5);
        await common.together(k, [mollie, peter, jigs, umbrella], 2.4, { x: '+=240', y: '-=900', ease: 'sine.in' });
      },
    },

    // ================================================ 2. Under the umbrella
    {
      name: 'Under the umbrella',
      set(k) {
        k.backdrop('wishing-sky');
        k.music('adventure');
        cast.umbrella = k.prop('jigs-umbrella', UMB);
        cast.jigs = k.character('jigs', FLOAT.jigs);
        cast.mollie = k.character('mollie', FLOAT.mollie);
        cast.peter = k.character('peter', { ...FLOAT.peter, flip: true });
        cast.wood = k.add(farWood(), { x: 1200, y: 470, w: 360, z: 5 });
        // They start a little lower and to the left, and drift into place.
        k.set(k.pivot(k.part(cast.jigs, 'armR')), { rotation: ARM_UP });
        k.set([cast.umbrella, cast.jigs, cast.mollie, cast.peter], { x: -120, y: 60 });
      },
      async play(k) {
        const { mollie, peter, jigs, wood } = cast;
        const group4 = () => [cast.umbrella, mollie, peter, jigs];
        highWind(3);
        await k.all(k.say('holdOn', mollie), common.together(k, group4(), 2, { x: 0, y: 0, ease: 'sine.out' }));
        await k.say('floating', peter);

        // The gust: the umbrella turns inside out and they sink.
        k.fx.wind(1.6);
        await k.wait(500);
        swapUmbrella(k, 'jigs-umbrella-blown', UMB);
        k.fx.thud();
        await common.together(k, group4(), 0.9, { y: '+=110', ease: 'sine.inOut' });
        await k.all(k.say('gust', jigs), k.shake(jigs, 4, 2));
        await k.say('sinking', mollie);

        // Peter jumps up, grabs the rim and pulls it straight.
        await k.say('pull', peter);
        const arm = k.pivot(k.part(peter, 'armR'));
        k.fx.boing();
        await k.all(k.to(arm, 0.3, { rotation: -170 }), k.to(peter, 0.45, { y: '-=210', x: '-=40', ease: 'power2.out' }));
        for (let i = 0; i < 3; i++) {
          k.fx.creak();
          await k.to(peter, 0.18, { y: '+=18', yoyo: true, repeat: 1, ease: 'sine.inOut' });
        }
        swapUmbrella(k, 'jigs-umbrella', { ...UMB, y: UMB.y + 110 });
        k.fx.boing();
        k.flourish(cast.umbrella);
        await k.all(k.to(peter, 0.5, { y: '+=210', x: '+=40', ease: 'power2.in' }), k.to(arm, 0.4, { rotation: 0 }));
        await k.say('backAgain', jigs);
        await common.together(k, group4(), 1.2, { y: 0, ease: 'sine.inOut' });

        // On they float: lanterns in a wood, and music.
        k.fx.whizz();
        void k.to(wood, 2.4, { x: -420, ease: 'sine.out' });
        await k.wait(1200);
        marketBustle();
        k.sparkle(900, 540, 8, 90);
        await k.say('lanterns', mollie);
        await k.say('sneaky', jigs);
        await common.together(k, group4(), 1.2, { y: '+=60', ease: 'sine.inOut' });
      },
    },

    // ================================================ 3. The Goblin Market
    {
      name: 'The Goblin Market',
      set(k) {
        k.backdrop('goblin-market');
        k.music('sneaky');
        k.light(150, 330, 240, { color: '#ffd88a', strength: 0.25, z: 5 });
        k.light(1040, 330, 240, { color: '#ffd88a', strength: 0.25, z: 5 });
        k.ambient('fireflies', { count: 8, z: 30, area: [300, 200, 600, 360] });
        cast.slyboots = k.character('slyboots', { ...SLY, flip: true, pose: 'shout' });
        cast.cushions = k.add(cushions(), { x: 700, y: 556, w: 270, z: 9 });
        // The chair, tied up and sad, wings drooping, with a price tag.
        ride = chairRide.set(k, { ...CHAIR, wings: true });
        k.set(k.pivot(k.part(ride.chair, 'wingL')), { rotation: -75 });
        k.set(k.pivot(k.part(ride.chair, 'wingR')), { rotation: 75 });
        cast.rope = k.add(rope(), { x: 362, y: 452, w: 300, z: 20 });
        cast.tag = k.add(tag(), { x: 345, y: 420, w: 110, z: 21 });
        cast.tagWords = k.lettering('FOR SALE', { x: 398, y: 455, size: 17, color: C.ink, w: 80, z: 22 });
        // The friends wait off stage to creep in.
        cast.mollie = k.character('mollie', HIDE.mollie);
        cast.peter = k.character('peter', HIDE.peter);
        cast.jigs = k.character('jigs', HIDE.jigs);
        sneakIn.set(k, [cast.mollie, cast.peter, cast.jigs], { from: 'left', distance: 620 });
      },
      async play(k) {
        const { mollie, peter, jigs, slyboots, rope: tie, tag: label, tagWords: words, cushions: heap } = cast;
        const tied = () => [...ridePieces(ride), tie, label, words];
        marketBustle();
        await k.wait(600);
        await k.say('call', slyboots);

        // The friends creep in.
        await sneakIn.play(k, { walkers: [mollie, peter, jigs], from: 'left', distance: 620, seconds: 2.2, hops: 7 });
        await k.say('poor', mollie);

        // Peter steps out.
        await k.walk(peter, 90, 0.8, 3);
        await k.all(k.say('ours', peter), k.shake(peter, 4, 2));

        // The scary beat: silence, a deep note, a stomp, and he looms.
        k.silence();
        deepNote();
        k.sfx.ominous();
        await k.wait(600);
        await k.camera({ zoom: 1.35, x: 880, y: 430 }, 1.2);
        bigStomp();
        void k.quake(6);
        await k.to(slyboots, 0.5, { scale: 1.15, ease: 'power2.out' });
        await k.say('money', slyboots);
        k.pose(slyboots, 'grab');
        bigStomp();
        void k.quake(5);
        await k.say('mine', slyboots);
        await k.wait(400);

        // Cut back to the friends, whispering behind the stall.
        await k.camera({}, 0.9);
        k.pose(slyboots, 'default');
        void k.to(slyboots, 0.6, { scale: 1 });
        k.music('sneaky');
        await k.walk(peter, -90, 0.8, 3);
        await k.say('brave', mollie);
        await k.say('tune', jigs);
        await k.say('plan', peter);

        // Jigs whistles the chair's tune: it wriggles and wriggles.
        await k.say('hereGoes', jigs);
        k.music('dreamy');
        whistleTune();
        k.sparkle(560, 440, 8, 100);
        await k.all(wriggleAll(k, tied(), 5), k.wait(900).then(() => k.say('stop', slyboots)));
        k.shake(slyboots, 5, 2);

        // Peter creeps round, and pulls the big knot.
        await k.wait(300);
        k.fx.sneak();
        await k.walk(peter, 60, 1.0, 3);
        const arm = k.pivot(k.part(peter, 'armR'));
        await k.to(arm, 0.4, { rotation: -140 });
        k.sfx.rustle();
        const [knot] = k.part(tie, 'knot');
        await k.to(knot, 0.4, { scale: 1.3, yoyo: true, repeat: 1 });
        k.fx.pop();
        k.flourish(tie);
        await k.all(k.to(tie, 0.8, { y: '+=90', rotation: 10, opacity: 0, ease: 'power1.in' }), k.to(arm, 0.4, { rotation: 0 }));
        k.remove(tie);
        k.music('triumph');
        const wl = k.pivot(k.part(ride.chair, 'wingL'));
        const wr = k.pivot(k.part(ride.chair, 'wingR'));
        k.fx.twinkle();
        await k.all(k.to(wl, 0.6, { rotation: 0, ease: 'back.out(2)' }), k.to(wr, 0.6, { rotation: 0, ease: 'back.out(2)' }));
        await k.say('untied', peter);
        await k.to(label, 0.6, { y: '+=40', rotation: 20, opacity: 0 });
        k.fade(words, 0, 0.2);

        // Everyone jumps on.
        await k.all(k.say('onBoard', jigs), k.walk(mollie, 70, 0.9, 3), k.walk(jigs, 50, 0.9, 3));
        await k.all(k.hop(mollie, 40, 1), k.hop(peter, 40, 1), k.hop(jigs, 40, 1));
        for (const el of [mollie, peter, jigs]) k.remove(el);
        await chairRide.seat(k, ride, { id: 'mollie', slot: 'left' });
        await chairRide.seat(k, ride, { id: 'peter', slot: 'right' });
        await chairRide.seat(k, ride, { id: 'jigs', slot: 'arm', flip: true });
        k.sparkle(600, 380, 10, 120);
        void chairRide.flap(k, ride, 3);

        // Slyboots grabs at the air, and flops into his own cushions.
        k.pose(slyboots, 'shout');
        await k.to(slyboots, 0.35, { x: -30, rotation: -4, ease: 'power2.in' });
        await chairRide.fly(k, ride, { y: -40, s: 0.6, flaps: 2 });
        k.pose(slyboots, 'flop');
        k.fx.poof();
        k.puff(920, 640, 200);
        await k.to(slyboots, 0.4, { x: -50, y: 70, rotation: 4, ease: 'power2.in' });
        k.fx.thud();
        void k.shake(heap, 4, 2);
        await k.all(k.say('comeBack', slyboots), k.hop(heap, 8, 1));
        await k.say('notYours', ride.riders[0]);

        // Up and away.
        k.music('adventure');
        highWind(2.5);
        await chairRide.fly(k, ride, { x: 380, y: -700, s: 2.2, tilt: -8 });
      },
    },

    // ================================================ 4. A bell on the door
    {
      name: 'A bell on the door',
      set(k) {
        k.backdrop('wishing-sky');
        k.music('adventure');
        ride = chairRide.set(k, {
          x: 340,
          y: 200,
          w: 440,
          wings: true,
          riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'arm', flip: true }],
        });
        [cast.mollie, cast.peter, cast.jigs] = ride.riders;
        // Jigs's umbrella hung by its crook on the chair's left arm, canopy down.
        // It rides as part of the ride, so it moves, lands and stays with the chair.
        cast.umbrella = k.prop('jigs-umbrella', { x: 345, y: 372, w: 110, z: 18 });
        k.set(cast.umbrella, { rotation: 172 });
        ride.riders.push(cast.umbrella);
        chairRide.jump(k, ride, { x: -700, y: 50 });
      },
      async play(k) {
        const { mollie, peter, jigs } = cast;
        highWind(3);
        await common.together(k, ridePieces(ride), 2, { x: 0, y: 0, ease: 'sine.out' });
        await chairRide.flap(k, ride, 2);
        await k.say('face', peter);
        await k.all(k.say('plop', jigs));
        giggle();
        await k.wait(500);

        // Home we go: say it while drifting on (only x changes).
        await k.all(k.say('homeWeGo', mollie), common.together(k, ridePieces(ride), 2.4, { x: '+=160', ease: 'sine.inOut' }));
        await common.together(k, ridePieces(ride), 1.4, { x: '+=800', ease: 'sine.in' });

        // The playroom, with the chair back in its corner.
        await k.cut(() => {
          k.backdrop('playroom');
          k.music('cosy');
          k.light(1010, 380, 240, { color: '#fff3c8', strength: 0.3, z: 5 });
          ride = chairRide.set(k, {
            x: 270,
            y: 214,
            w: 460,
            wings: true,
            riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'arm', flip: true }],
          });
          [cast.mollie, cast.peter, cast.jigs] = ride.riders;
          // Jigs's umbrella is still hooked on the arm of the chair.
          cast.umbrella = k.prop('jigs-umbrella', { x: 278, y: 392, w: 115, z: 18 });
          k.set(cast.umbrella, { rotation: 172 });
          ride.riders.push(cast.umbrella);
          cast.bell = k.add(doorBell(), { x: 780, y: 520, w: 50, z: 20 });
          k.set(cast.bell, { opacity: 0 });
          chairRide.jump(k, ride, { x: 760 });
        });
        highWind(2);
        await k.all(k.say('never', cast.mollie), common.together(k, ridePieces(ride), 3.2, { x: 0, ease: 'sine.out' }));
        await chairRide.land(k, ride);
        creak();
        await k.wait(400);

        // Mollie and Peter hop down.
        await chairRide.hopOff(k, ride, cast.mollie, { x: 640, y: 410, w: 220 });
        await chairRide.hopOff(k, ride, cast.peter, { x: 60, y: 410, w: 220 });
        await k.to(ride.chair, 0.3, { rotation: 2, yoyo: true, repeat: 1 });
        creak();

        // Mollie ties a little bell on the door.
        await k.say('bell', cast.mollie);
        k.fx.pop();
        await k.appear(cast.bell, 0.4);
        k.set(cast.bell, { transformOrigin: '50% 0%' });
        await k.carry(cast.bell, [900, 300], 1.1);
        commonSounds.ting();
        for (let i = 0; i < 3; i++) await k.to(cast.bell, 0.18, { rotation: i % 2 ? -14 : 14, ease: 'sine.inOut' });
        await k.to(cast.bell, 0.3, { rotation: 0 });
        hatBell();
        await k.say('tingALing', cast.jigs);

        // Jigs curls up on the seat.
        await k.say('sleep', cast.jigs);
        const slot = chairRide.seatAt(k, ride, 'left');
        const at = k.box(cast.jigs);
        await k.to(cast.jigs, 0.9, { x: `+=${slot[0] - (at.x + at.w / 2)}`, y: `+=${slot[1] - (at.y + at.h / 2) + 20}`, rotation: -14, ease: 'sine.inOut' });
        k.set(k.part(cast.jigs, 'lids'), { opacity: 1 });
        creak();
        await k.wait(600);
        await k.say('night', cast.peter);

        // The bell tinkles softly in the breeze, and the warm ending.
        k.music('dreamy');
        const sway = async (): Promise<void> => {
          for (let i = 0; i < 4; i++) {
            ting();
            await k.to(cast.bell, 0.5, { rotation: i % 2 ? -8 : 8, ease: 'sine.inOut' });
          }
          await k.to(cast.bell, 0.4, { rotation: 0 });
        };
        void sway();
        await warmEnding(k, { cast: [cast.mollie, cast.peter], end: 'end', music: 'cosy', sparkleAt: [520, 330] });
      },
    },
  ],
});
