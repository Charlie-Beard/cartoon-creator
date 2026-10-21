/**
 * Upside-Down Moon-Face: a Topsy-Turvy spell turns Moon-Face upside down,
 * just as the land is about to move on.
 *
 *   1. The foot of the Tree. Moon-Face tells him the Land of Topsy-Turvy
 *      is at the top, where everything is upside down. The Saucepan Man
 *      hears "a tipsy turkey", then "upside down" makes him think of his
 *      upside-down cake. Silky warns that Topsy-Turvy spells are catching;
 *      Moon-Face boasts that nothing could turn HIM upside down. His turn:
 *      the cake comes out of the Saucepan Man's pots and he drags it to
 *      Silky, who tucks it in her bag (or the Saucepan Man carries it over).
 *      Up they go.
 *   2. The Land of Topsy-Turvy. The Topsy-Turvy Man hops in on his head:
 *      "Goodbye! Don't come in!" (he means hello). Moon-Face laughs at him,
 *      so he says "Try it yourself!" and, with a spell, flips Moon-Face
 *      upside down. It's only a joke, but he can't undo it himself: turning
 *      upside-down things the right way up does. His turn: he taps the hat,
 *      and the hat, the toadstool and the teacup flip the right way up (or
 *      Silky's wand does it). Moon-Face turns… half way. Now he's SIDEWAYS.
 *      Then the ground rumbles: the land is moving on! Back to the ladder.
 *   3. The top of the ladder. Everyone must climb down before the land goes,
 *      but Moon-Face can't fit down the hole sideways (the Saucepan
 *      Man hears "roll"). His turn: Silky sends the Saucepan Man down first,
 *      and he drags him to the ladder (or the Saucepan Man goes himself).
 *      Silky: there's one more upside-down thing. It's
 *      Moon-Face! His big turn: he taps Moon-Face, who twirls the right way
 *      up. The Topsy-Turvy Man calls "Hello!" from the land (he means
 *      goodbye), and the land sails away. Home for tea.
 *   4. Upside-down cake. In Moon-Face's room the Saucepan Man brings out his
 *      upside-down cake. "Not more upside down!" It's the only upside down
 *      Moon-Face wants. His turn: he taps the cake to cut it. A slice for him, and Moon-Face, still a little
 *      topsy-turvy, says goodbye when he means hello.
 *
 * The danger is the land moving on, never the Topsy-Turvy Man: he plays a
 * joke and is sorry it went too far. Moon-Face is turned by rotating the
 * whole actor, so he still talks and blinks the other way up.
 */
import { C, cached, defineCartoon, ellipse, ink, piece, rect, svg, type Kit } from '../../kit';
import { moves as commonMoves, sounds as commonSounds } from '../../worlds/common/moves';
import { warmEnding } from '../../worlds/common/pieces';
import { moves as farawayMoves, sounds as farawaySounds } from '../../worlds/faraway/moves';
import { landMovesOn } from '../../worlds/faraway/pieces';
import meta from './meta';

const { clank, popBiscuit, whirr, landTurning } = farawaySounds;
const { laugh, giggle } = commonSounds;
const { beam, earCup, flutter, rattle } = farawayMoves;
const { wave } = commonMoves;

// ------------------------------------------------------------------- art

/** The Saucepan Man's pineapple upside-down cake on a plate (240 × 130). */
const cake = cached(() =>
  svg({ w: 240, h: 130, name: 'upside-down-cake', label: 'An upside-down cake' }, [
    piece(ellipse(120, 112, 116, 16), C.china, { edge: 'cut' }),
    piece(rect(30, 46, 180, 64, 10), C.cakeSponge),
    piece(rect(26, 34, 188, 26, 10), C.caramel),
    ...[62, 120, 178].flatMap((x) => [piece(ellipse(x, 47, 22, 11), C.lemon, { shadow: false }), piece(ellipse(x, 47, 9, 5), C.caramel, { shadow: false, fibre: false })]),
    ...[91, 149].map((x) => piece(ellipse(x, 44, 8, 8), C.cherry, { shadow: false })),
  ]),
);

/** One slice of it, for him (110 × 90). */
const slice = cached(() =>
  svg({ w: 110, h: 90, name: 'upside-down-slice', label: 'A slice of upside-down cake' }, [
    piece([[8, 78], [102, 78], [96, 30], [14, 30]], C.cakeSponge),
    piece(rect(10, 18, 90, 18, 6), C.caramel),
    piece(ellipse(55, 26, 20, 9), C.lemon, { shadow: false }),
    piece(ellipse(55, 26, 8, 4), C.caramel, { shadow: false, fibre: false }),
    ink([[20, 60], [90, 60]], { width: 2, color: C.honeyDark, wobble: 1 }),
  ]),
);

// ------------------------------------------------------------------ cast

const cast = {} as Record<'mf' | 'silky' | 'pan' | 'tt' | 'hat' | 'stool' | 'cup' | 'far' | 'cake', HTMLElement>;

/** Turns an actor round by `rotation`, with a boing and a sparkle where it lands. */
async function flipOver(k: Kit, el: HTMLElement, rotation: number, at: [number, number], s = 0.7): Promise<void> {
  k.fx.boing();
  await k.to(el, s, { rotation, ease: 'back.out(1.6)' });
  k.sparkle(at[0], at[1], 8, 90);
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. The foot of the Tree
    hello: { who: 'moonface', text: 'Hello, {name}! Guess which land is at the top of the Tree today?' },
    topsy: { who: 'silky', text: 'The Land of Topsy-Turvy! Everything there is upside down.' },
    turkey: { who: 'saucepan', text: 'Eh? A TIPSY TURKEY? Where?' },
    notTurkey: { who: 'moonface', text: 'Not a turkey! Topsy-Turvy! Everything is UPSIDE DOWN!' },
    cakeIdea: { who: 'saucepan', text: 'Oh! Upside down! Like my upside-down cake! I’ll bring it.' },
    askCake: { who: 'silky', text: 'Can you drag the cake to me, {name}? I’ll tuck it in my bag.' },
    nudgeCake: { who: 'silky', text: 'Just drag the cake over to me.' },
    carryCake: { who: 'saucepan', text: 'I’ll carry it over myself. Clank, clank!' },
    thanksCake: { who: 'silky', text: 'Lovely! Into my bag it goes.' },
    thanksCakePan: { who: 'silky', text: 'Thank you, Saucepan Man! Into my bag it goes.' },
    careful: { who: 'silky', text: 'Be careful, Moon-Face. Topsy-Turvy spells can catch you!' },
    boast: { who: 'moonface', text: 'Pooh! Nothing could turn ME upside down. Up we go!' },
    // 2. The Land of Topsy-Turvy
    goodbye: { who: 'topsyTurvyMan', text: 'Goodbye! Goodbye! Don’t come in!' },
    meansHello: { who: 'moonface', text: 'He means hello! Everything is back to front here.' },
    fancy: { who: 'moonface', text: 'Ho ho! Fancy standing on your head all day!' },
    tryIt: { who: 'topsyTurvyMan', text: 'Try it yourself! Upsy-downsy, inside-outsy!' },
    whoa: { who: 'moonface', text: 'Whoa! I’m upside down! The sky is under my feet!' },
    topsyToo: { who: 'saucepan', text: 'Moon-Face! You’ve gone all topsy-turvy!' },
    undo: { who: 'silky', text: 'Please turn him back. The land won’t stay here for long!' },
    cant: { who: 'topsyTurvyMan', text: 'Oh dear! I mean, hooray! I can’t undo it myself.' },
    rightWay: { who: 'topsyTurvyMan', text: 'Turn upside-down things the right way up. That undoes it!' },
    look: { who: 'silky', text: 'Look! The hat, the toadstool and the teacup!' },
    askHat: { who: 'moonface', text: 'Tap the hat, {name}! Turn things the right way up!' },
    nudgeHat: { who: 'moonface', text: 'Just tap the upside-down hat.' },
    wandHat: { who: 'silky', text: 'I’ll turn them with my wand. One, two, three!' },
    turning: { who: 'moonface', text: 'Ooh! I’m turning! I’m turning!' },
    sideways: { who: 'moonface', text: 'Oh. Now I’m SIDEWAYS.' },
    nearly: { who: 'topsyTurvyMan', text: 'Nearly there! Nearly the right way up!' },
    moving: { who: 'silky', text: 'The land is moving on! Back to the ladder, quick!' },
    // 3. The top of the ladder
    downWeGo: { who: 'silky', text: 'Down the ladder, everyone, before the land goes!' },
    noFit: { who: 'moonface', text: 'I can’t! I won’t fit down the hole sideways!' },
    roll: { who: 'saucepan', text: 'Eh? You want a ROLL? With butter?' },
    askPan: { who: 'silky', text: 'Saucepan Man, down you go first. Drag him to the ladder!' },
    nudgePan: { who: 'silky', text: 'Drag the Saucepan Man to the ladder.' },
    downPan: { who: 'saucepan', text: 'Down I go, then! Mind my pots!' },
    oneMore: { who: 'silky', text: 'Wait! There’s one more thing to turn the right way up.' },
    itsYou: { who: 'silky', text: 'It’s you, Moon-Face!' },
    askMf: { who: 'silky', text: 'Tap Moon-Face, {name}! Turn him the right way up!' },
    nudgeMf: { who: 'silky', text: 'Tap Moon-Face. Quick as you can!' },
    twirl: { who: 'silky', text: 'I’ll twirl him round with my wand!' },
    thanksMf: { who: 'moonface', text: 'The right way up! Thank you, {name}!' },
    phewMf: { who: 'moonface', text: 'The right way up! Thank you, Silky!' },
    hello2: { who: 'topsyTurvyMan', text: 'Hello! Hello! Come again soon!' },
    meansBye: { who: 'silky', text: 'He means goodbye!' },
    byeTT: { who: 'moonface', text: 'Goodbye, Topsy-Turvy Man! Home for tea, everyone!' },
    // 4. Upside-down cake
    home: { who: 'moonface', text: 'Home again, and the right way up!' },
    myCake: { who: 'saucepan', text: 'And here’s my upside-down cake!' },
    notAgain: { who: 'moonface', text: 'Upside down? Oh no! Not again!' },
    onlyCake: { who: 'silky', text: 'It’s only a cake, Moon-Face. It’s meant to be upside down!' },
    onlyOne: { who: 'moonface', text: 'Then that’s the only upside down for me!' },
    askCut: { who: 'silky', text: 'Tap the cake, and we’ll cut a slice.' },
    nudgeCut: { who: 'silky', text: 'Just tap the cake.' },
    cutMe: { who: 'saucepan', text: 'I’ll cut it myself. Here goes!' },
    forYou: { who: 'silky', text: 'A slice for {name}!' },
    hello3: { who: 'moonface', text: 'Thank you, {name}. Goodbye! Oh, I mean hello!' },
    end: { who: 'narrator', text: 'And Moon-Face said things back to front all through tea.' },
  },
  scenes: [
    // ==================================================== 1. The foot of the Tree
    {
      name: 'The foot of the Tree',
      set(k) {
        k.backdrop('tree');
        k.music('cosy');
        cast.mf = k.character('moonface', { x: 70, y: 470, w: 200 });
        cast.silky = k.character('silky', { x: 290, y: 430, w: 180, z: 11 });
        cast.pan = k.character('saucepan', { x: 880, y: 474, w: 200, flip: true });
        k.set(cast.silky, { opacity: 0 });
      },
      async play(k) {
        const { mf, silky, pan } = cast;
        await k.wait(300);
        void beam(k, mf, true);
        await k.all(k.say('hello', mf), k.wait(300).then(() => wave(k, mf)));
        void beam(k, mf, false);

        // Silky flutters down with the news.
        whirr(8);
        void flutter(k, silky, 6);
        await k.enter(silky, 'top', 1.1);
        k.fx.twinkle();
        await k.say('topsy', silky);

        // He gets it wrong, and then gets an idea.
        await earCup(k, pan, true);
        await k.say('turkey', pan);
        void earCup(k, pan, false);
        await k.all(k.say('notTurkey', mf), k.to(mf, 0.4, { x: 30 }));
        void k.to(mf, 0.4, { x: 0 });
        clank(3, 0.1);
        await k.hop(pan, 30);
        await k.all(k.say('cakeIdea', pan), rattle(k, pan));

        // His turn: the cake comes out of his pots, and goes into Silky's bag.
        const treat = k.add(cake(), { x: 560, y: 520, w: 180, z: 20 });
        k.set(treat, { opacity: 0 });
        clank(4, 0.1);
        k.fx.pop();
        await k.appear(treat, 0.5);
        const cakeHow = await k.dragToHelp(treat, { to: silky, ask: 'askCake', nudge: 'nudgeCake', helped: 'carryCake', by: silky, helper: pan, dropSize: 200 });
        whirr(4);
        await k.vanish(treat, 0.4);
        await k.say(cakeHow === 'dragged' ? 'thanksCake' : 'thanksCakePan', silky);

        // A warning, and a boast.
        await k.say('careful', silky);
        await k.hop(mf, 24);
        await k.say('boast', mf);
        // Up the Tree they go.
        k.fx.patter(6, 0.12);
        clank(3, 0.12);
        whirr(6);
        await k.all(k.to(mf, 1.2, { x: 330, y: -420, ease: 'power1.in' }), k.wait(200).then(() => k.to(silky, 1.2, { x: 110, y: -420, ease: 'power1.in' })), k.wait(400).then(() => k.to(pan, 1.2, { x: -280, y: -420, ease: 'power1.in' })));
      },
    },

    // ==================================================== 2. The Land of Topsy-Turvy
    {
      name: 'The Land of Topsy-Turvy',
      set(k) {
        k.backdrop('topsy-turvy');
        k.music('magic');
        cast.mf = k.character('moonface', { x: 40, y: 360, w: 230 });
        cast.pan = k.character('saucepan', { x: 250, y: 380, w: 220, z: 11 });
        cast.silky = k.character('silky', { x: 440, y: 230, w: 180, z: 12 });
        cast.tt = k.character('topsyTurvyMan', { x: 780, y: 340, w: 250 });
        // Everything upside down: his hat, a toadstool and a teacup.
        cast.hat = k.prop('top-hat', { x: 560, y: 470, w: 150, z: 14 });
        cast.stool = k.prop('toadstool', { x: 1040, y: 470, w: 120, z: 14 });
        cast.cup = k.prop('teacup', { x: 1040, y: 330, w: 110, z: 14 });
        k.set([cast.hat, cast.stool, cast.cup], { rotation: 180 });
        k.set(cast.tt, { opacity: 0 });
      },
      async play(k) {
        const { mf, silky, pan, tt, hat, stool, cup } = cast;
        void flutter(k, silky, 6);
        await k.wait(600);

        // In he hops, on his head.
        k.fx.boing();
        await k.enter(tt, 'right', 0.9);
        k.fx.boing();
        await k.hop(tt, 30, 2);
        await k.all(k.say('goodbye', tt), wave(k, tt));
        await k.say('meansHello', mf);

        // Moon-Face laughs at him, and the joke turns round on him.
        laugh();
        await k.all(k.say('fancy', mf), k.shake(mf, 4, 2));
        await k.say('tryIt', tt);
        k.fx.spell();
        await k.beam([840, 420], [160, 470], C.topsyPink);
        await flipOver(k, mf, 180, [155, 500], 0.9);
        await k.wait(500);
        await k.say('whoa', mf);
        await k.all(k.shake(mf, 6, 2), k.wait(300));
        clank(2, 0.1);
        await k.say('topsyToo', pan);

        // Silky asks, kindly, and he explains.
        void flutter(k, silky, 4);
        await k.say('undo', silky);
        await k.all(k.say('cant', tt), k.shake(tt, 4, 2));
        await k.say('rightWay', tt);
        await k.camera({ zoom: 1.15, x: 760, y: 470 }, 0.8);
        await k.say('look', silky);
        await k.camera({}, 0.7);

        // His turn: turn things the right way up.
        const how = await k.tapToHelp(hat, { ask: 'askHat', nudge: 'nudgeHat', helped: 'wandHat', by: mf, helper: silky, size: 170 });
        if (how === 'helped') {
          k.fx.spell();
          await k.beam([560, 330], [635, 540], C.goldLight);
        }
        await flipOver(k, hat, 0, [635, 540]);
        await flipOver(k, stool, 0, [1100, 530], 0.6);
        await flipOver(k, cup, 0, [1095, 380], 0.6);
        k.fx.twinkle();

        // Moon-Face turns… half way.
        await k.say('turning', mf);
        await k.to(mf, 1, { rotation: 90, ease: 'back.out(1.4)' });
        await k.wait(500);
        await k.say('sideways', mf);
        laugh();
        await k.all(k.say('nearly', tt), k.hop(tt, 20, 1));

        // The ground rumbles.
        landTurning(2.5);
        await landMovesOn(k, { friends: [pan, silky, mf], by: silky, line: 'moving', hum: false });
      },
    },

    // ==================================================== 3. The top of the ladder
    {
      name: 'The top of the ladder',
      set(k) {
        k.backdrop('cloud-top');
        k.music('adventure');
        cast.far = k.prop('far-topsy-turvy', { x: 290, y: 150, w: 600, z: 5 });
        cast.tt = k.character('topsyTurvyMan', { x: 540, y: 120, w: 90, z: 6 });
        cast.pan = k.character('saucepan', { x: 340, y: 400, w: 220, flip: true });
        cast.mf = k.character('moonface', { x: 600, y: 380, w: 240, z: 11 });
        cast.silky = k.character('silky', { x: 890, y: 330, w: 200, z: 12, flip: true });
        k.prop('cloud-front', { x: 0, y: 600, z: 22 });
        k.set(cast.mf, { rotation: 90 });
      },
      async play(k) {
        const { mf, silky, pan, tt, far } = cast;
        // The land behind them rumbles.
        k.fx.rumble(2);
        void k.shake(far, 4, 2);
        void flutter(k, silky, 4);
        await k.say('downWeGo', silky);
        // Moon-Face hops to the hole, and bumps.
        k.fx.boing();
        await k.walk(mf, -50, 0.6, 1);
        k.fx.thud();
        await k.all(k.shake(mf, 6, 2), k.quake(4));
        await k.say('noFit', mf);
        await earCup(k, pan, true);
        await k.say('roll', pan);
        void earCup(k, pan, false);
        await k.to(mf, 0.6, { x: 0 });

        // His turn: the Saucepan Man goes down the ladder first.
        void flutter(k, silky, 4);
        await k.dragToHelp(pan, { to: [170, 500], ask: 'askPan', nudge: 'nudgePan', helped: 'downPan', by: silky, helper: pan });
        clank(4, 0.1);
        k.fx.patter(4, 0.12);
        await k.vanish(pan, 0.5);

        // The last upside-down thing.
        k.fx.twinkle();
        void flutter(k, silky, 4);
        await k.say('oneMore', silky);
        await k.camera({ zoom: 1.2, x: 720, y: 480 }, 0.7);
        await k.say('itsYou', silky);
        await k.camera({}, 0.6);

        // His big turn.
        const how = await k.tapToHelp(mf, { ask: 'askMf', nudge: 'nudgeMf', helped: 'twirl', by: silky, size: 240 });
        if (how === 'helped') {
          k.fx.spell();
          await k.beam([860, 400], [590, 520], C.goldLight);
        }
        whirr(4);
        k.fx.whizz();
        await k.to(mf, 1.1, { rotation: 360, ease: 'back.out(1.3)' });
        k.set(mf, { rotation: 0 });
        k.sparkle(590, 500, 16, 200);
        void beam(k, mf, true);
        await k.say(how === 'tapped' ? 'thanksMf' : 'phewMf', mf);
        await k.hop(mf, 36, 2);
        void beam(k, mf, false);

        // From the land, a cheery call, and away it goes.
        k.fx.boing();
        await k.hop(tt, 14, 2);
        await k.say('hello2', tt);
        await k.all(k.say('meansBye', silky), k.wait(200).then(() => wave(k, silky, 2, 'armR')));
        await k.all(k.say('byeTT', mf), wave(k, mf));
        landTurning(2.4, 120, 300);
        await k.all(k.to(far, 2.4, { y: -260, opacity: 0, ease: 'power1.in' }), k.to(tt, 2.4, { y: -260, opacity: 0, ease: 'power1.in' }));
        k.music('cosy');
        // Down the ladder they go.
        k.fx.patter(5, 0.12);
        clank(3, 0.12);
        await k.all(k.to(mf, 0.8, { x: -430, y: 300, ease: 'power1.in' }), k.wait(300).then(() => k.to(silky, 0.9, { x: -700, y: 300, ease: 'power1.in' })));
      },
    },

    // ==================================================== 4. Upside-down cake
    {
      name: 'Upside-down cake',
      set(k) {
        k.backdrop('moon-room');
        k.music('cosy');
        k.light(590, 180, 160, { strength: 0.3, z: 5 });
        cast.pan = k.character('saucepan', { x: 290, y: 390, w: 240 });
        cast.mf = k.character('moonface', { x: 540, y: 380, w: 250, z: 11 });
        cast.silky = k.character('silky', { x: 810, y: 300, w: 210, z: 12, flip: true });
        cast.cake = k.add(cake(), { x: 310, y: 520, w: 220, z: 20 });
        k.set(cast.cake, { opacity: 0 });
      },
      async play(k) {
        const { mf, silky, pan } = cast;
        await k.wait(400);
        void beam(k, mf, true);
        await k.all(k.say('home', mf), k.hop(mf, 24, 1));
        void beam(k, mf, false);

        // Out of his pots comes the cake.
        clank(4, 0.1);
        void rattle(k, pan);
        k.fx.pop();
        await k.appear(cast.cake, 0.5);
        await k.say('myCake', pan);
        await k.all(k.say('notAgain', mf), k.shake(mf, 6, 2));
        giggle();
        void flutter(k, silky, 4);
        await k.say('onlyCake', silky);
        await k.say('onlyOne', mf);
        laugh();
        await k.all(k.shake(pan, 3, 2), k.shake(silky, 3, 2), k.wait(600));

        // His turn: tap the cake to cut a slice.
        await k.tapToHelp(cast.cake, { ask: 'askCut', nudge: 'nudgeCut', helped: 'cutMe', by: silky, helper: pan, size: 240 });
        k.fx.pop();
        await k.pop(cast.cake, 1.12);

        // A slice for him: it flies out towards the screen.
        whirr(4);
        await k.say('forYou', silky);
        const s = k.add(slice(), { x: 390, y: 540, w: 100, z: 40 });
        k.set(s, { opacity: 0 });
        await k.appear(s, 0.3);
        k.fx.whizz();
        await k.to(s, 0.7, { x: 260, y: 40, scale: 2.4, rotation: 360, ease: 'power1.out' });
        popBiscuit(1);
        k.sparkle(640, 640, 14, 160);
        await k.vanish(s, 0.3);

        // Still a little topsy-turvy.
        await k.all(k.say('hello3', mf), wave(k, mf));
        laugh();
        await k.all(k.shake(mf, 4, 3), k.shake(pan, 3, 3), k.shake(silky, 3, 3));
        await warmEnding(k, { cast: [pan, mf, silky], end: 'end' });
      },
    },
  ],
});
