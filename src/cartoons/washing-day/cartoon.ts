/**
 * Bubbles Up the Tree: Dame Washalot tries her new soap, and the bubbles
 * come pouring up the Tree.
 *
 *   1. Washing day. Moon-Face's room. Dame Washalot climbs up through the
 *      trapdoor: any washing? The Saucepan Man hands over his very smelly
 *      socks, and brings them over to her himself. Her new soap is the bubbliest in the
 *      wood. Off she goes, and a moment later: a gurgle, and one bubble, then
 *      two, float up through the trapdoor.
 *   2. Bubbles! Bubbles pour up through the hatch and fill the room, and the
 *      Saucepan Man's pots are full of them. Dame Washalot pops up in a hat of suds: too much soap!
 *      Nobody can climb down through all that, so it's down the slippery-slip,
 *      but they need cushions at the bottom. The Saucepan Man throws
 *      the cushions and they whizz down the slide.
 *      Moon-Face jumps in first.
 *   3. The slippery-slip. The foot of the Tree. Moon-Face whizzes round and
 *      round and lands in the cushions. The Saucepan Man comes next and gets
 *      STUCK on the last turn, his pots jammed. Dame Washalot sends a soapy
 *      splash down to slide him loose. Clatter-bang, flump: down he comes.
 *   4. Splash! Mr Watzisname has slept through the lot. Dame Washalot tips out
 *      the last of the water from her tub, SPLASH, all over him. He wakes: is it raining?
 *      Bath time, lovely… and he's asleep again. Clean socks float down for
 *      the Saucepan Man: she floats them down to him. They smell of roses, and one big bubble
 *      floats out to him.
 *
 * Nobody is in danger: bubbles are soft and silly. The one tense moment is the
 * Saucepan Man stuck on the slide, and he is cheerful about it. The stuck
 * slide is the world's slippery-slip piece (its `stuck` option).
 */
import { C, cached, circle, defineCartoon, ellipse, piece, rng, svg, type Kit } from '../../kit';
import { sounds as commonSounds } from '../../worlds/common/moves';
import { warmEnding } from '../../worlds/common/pieces';
import { moves as farawayMoves, sounds as farawaySounds } from '../../worlds/faraway/moves';
import { slipperySlip, trapdoorArrival } from '../../worlds/faraway/pieces';
import meta from './meta';

const { clank, flump, snore } = farawaySounds;
const { laugh, giggle, sniff } = commonSounds;
const { beam, rattle, wakeUp } = farawayMoves;

// ------------------------------------------------------------------- art

/** A soap bubble: a see-through ball of rainbow-tinged paper with a shine (100 × 100). */
const bubble = cached(() =>
  svg({ w: 100, h: 100, name: 'washing-day-bubble', label: 'a soap bubble' }, [
    piece(circle(50, 50, 44), '#e8f3f8', { opacity: 0.55, shadow: false }),
    piece(ellipse(62, 66, 22, 14, -30), '#f2d9ec', { opacity: 0.45, shadow: false, fibre: false }),
    piece(ellipse(34, 32, 11, 7, -35), C.white, { opacity: 0.9, shadow: false, fibre: false }),
  ]),
);

/** A splash of washing water falling (120 × 200): soapy blue paper, frothy at the top. */
const splash = cached(() =>
  svg({ w: 120, h: 200, name: 'washing-day-splash', label: 'a splash of water' }, [
    piece([[30, 20], [90, 20], [104, 196], [16, 196]], '#bfdcea', { opacity: 0.85, shadow: false }),
    ...[30, 60, 90].map((x) => piece(circle(x, 20, 18), C.white, { shadow: false })),
  ]),
);

// ------------------------------------------------------------------ cast

const cast = {} as Record<'mf' | 'pan' | 'wash' | 'watz' | 'socks', HTMLElement>;
let cushions: HTMLElement[] = [];

/** Puts `n` bubbles about the place, hidden, for the room to fill with. */
function bubbles(k: Kit, n: number, area: [number, number, number, number], seed: number): HTMLElement[] {
  const r = rng(seed);
  const [x, y, w, h] = area;
  return Array.from({ length: n }, () => {
    const size = 60 + r() * 90;
    const b = k.add(bubble(), { x: x + r() * (w - size), y: y + r() * (h - size), w: size, z: 18 });
    k.set(b, { opacity: 0, scale: 0.2 });
    return b;
  });
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. Washing day
    hello: { who: 'moonface', text: 'Listen, Saucepan Man. Somebody’s singing on the ladder.' },
    everything: { who: 'moonface', text: 'It’s Dame Washalot. She lives just below, and she washes everything!' },
    washingDay: { who: 'washalot', text: 'Washing day, my dears! Any washing for me?' },
    socks: { who: 'saucepan', text: 'Yes, please! Wash my socks. They’re VERY smelly.' },
    handOver: { who: 'saucepan', text: 'Here you are, Dame Washalot. Pooh!' },
    bigWash: { who: 'washalot', text: 'Phew! These socks need a REALLY big wash.' },
    newSoap: { who: 'washalot', text: 'Pooh! I’ll use my new soap. It’s the bubbliest soap in the wood!' },
    tootle: { who: 'washalot', text: 'Back to my tub! Toodle-oo!' },
    gurgle: { who: 'saucepan', text: 'Eh? What’s that gurgling?' },
    // 2. Bubbles!
    everywhere: { who: 'moonface', text: 'Bubbles! Bubbles everywhere! They’re filling up my room!' },
    fullPots: { who: 'saucepan', text: 'My pots are full of bubbles! Pop, pop, pop!' },
    atishoo: { who: 'moonface', text: 'Ah… ah… ATISHOO! A bubble popped on my nose!' },
    tooMuch: { who: 'washalot', text: 'Oh my! Too much soap! The bubbles are coming up the Tree!' },
    nipBack: { who: 'washalot', text: 'I’ll nip back to my tub and turn the tap off!' },
    cantClimb: { who: 'moonface', text: 'We can’t climb down through all that. Down the slippery-slip!' },
    cushionsFirst: { who: 'moonface', text: 'But first, cushions for a soft landing at the bottom.' },
    heaveHo: { who: 'saucepan', text: 'I’ll throw them! Heave-ho!' },
    allDown: { who: 'moonface', text: 'All down! Flump, flump, flump!' },
    meFirst: { who: 'moonface', text: 'Me first! Hold on to your pots!' },
    // 3. The slippery-slip
    mindBubbles: { who: 'washalot', text: 'Mind the bubbles, dears! Slide carefully!' },
    whatARide: { who: 'moonface', text: 'Wheee! What a ride!' },
    hereIcome: { who: 'saucepan', text: 'Here I come! Clank, clank!' },
    stuck: { who: 'saucepan', text: 'Oh no! I’m STUCK! My pots are jammed!' },
    tooWide: { who: 'moonface', text: 'Oh dear. His pots are too wide for the bend!' },
    soapySplash: { who: 'washalot', text: 'I’ll send down a soapy splash! Whoosh!' },
    clatterBang: { who: 'saucepan', text: 'Clatter-bang! I’m down! What a ride!' },
    thanksWash: { who: 'moonface', text: 'Thank you, Dame Washalot! He’s free!' },
    // 4. Splash!
    sleptThrough: { who: 'moonface', text: 'Look! Mr Watzisname slept through the whole thing.' },
    askTub: { who: 'washalot', text: 'Shall we wake him? I’ll tip out my tub!' },
    lookOut: { who: 'washalot', text: 'Here comes the last of the water! Look out below!' },
    raining: { who: 'watzisname', text: 'Wha…? Is it raining?' },
    bathTime: { who: 'watzisname', text: 'Oh. Bath time. Lovely…' },
    thunderstorm: { who: 'washalot', text: 'Well! He’d sleep through a thunderstorm!' },
    cleanSocks: { who: 'washalot', text: 'And here are your socks, all clean!' },
    floatDown: { who: 'washalot', text: 'There, I’ll float them down to him.' },
    roses: { who: 'saucepan', text: 'My socks! They smell of roses now! Thank you!' },
    smell: { who: 'moonface', text: 'Mmm! Roses and soap. Much better!' },
    bubbleFor: { who: 'moonface', text: 'And one last bubble, for everybody!' },
    end: { who: 'narrator', text: 'And Mr Watzisname slept until the next washing day.' },
  },
  scenes: [
    // ==================================================== 1. Washing day
    {
      name: 'Washing day',
      set(k) {
        k.backdrop('moon-room');
        k.music('cosy');
        cast.mf = k.character('moonface', { x: 830, y: 380, w: 250 });
        cast.pan = k.character('saucepan', { x: 560, y: 400, w: 230, flip: true });
        cast.wash = k.character('washalot', { x: 130, y: 360, w: 240, z: 11 });
        trapdoorArrival.set(k, cast.wash);
        cast.socks = k.prop('peg', { x: 690, y: 520, w: 130, z: 13 });
        k.set(cast.socks, { opacity: 0 });
      },
      async play(k) {
        const { mf, pan, wash } = cast;
        await k.wait(300);
        void beam(k, mf, true);
        await k.say('hello', mf);
        void beam(k, mf, false);
        await k.say('everything', mf);
        // Up through the trapdoor, singing, with her basket.
        k.fx.jingle();
        await trapdoorArrival.play(k, wash);
        await k.all(k.say('washingDay', wash), k.wait(300).then(() => k.hop(wash, 16)));
        clank(3, 0.1);
        await k.hop(pan, 24);
        await k.all(k.say('socks', pan), rattle(k, pan));
        // The Saucepan Man brings the smelly socks over to her.
        await k.appear(cast.socks, 0.4);
        await k.all(k.say('handOver', pan), k.carry(cast.socks, wash));
        void k.vanish(cast.socks, 0.3);
        sniff();
        await k.all(k.shake(wash, 5, 2), k.shake(mf, 4, 2));
        await k.say('bigWash', wash);
        laugh();
        await k.say('newSoap', wash);
        await k.say('tootle', wash);
        k.fx.patter(4, 0.12);
        await k.to(wash, 1, { y: 330, opacity: 0, ease: 'power1.in' });

        // A gurgle, and the first bubbles float up through the trapdoor.
        await k.wait(600);
        k.fx.bubbles(5);
        const first = bubbles(k, 2, [160, 500, 200, 120], 3);
        for (const b of first) {
          void k.to(b, 0.5, { opacity: 1, scale: 1 });
          void k.to(b, 3, { y: -260, x: 60, ease: 'sine.out' });
          await k.wait(500);
        }
        await k.all(k.say('gurgle', pan), k.shake(pan, 4, 2));
      },
    },

    // ==================================================== 2. Bubbles!
    {
      name: 'Bubbles!',
      set(k) {
        k.backdrop('moon-room');
        k.music('adventure');
        cast.mf = k.character('moonface', { x: 350, y: 380, w: 240 });
        cast.pan = k.character('saucepan', { x: 600, y: 400, w: 230, flip: true });
        cast.wash = k.character('washalot', { x: 120, y: 420, w: 220, z: 11 });
        k.set(cast.wash, { y: 260, opacity: 0 });
        cushions = [
          k.prop('cushion', { x: 780, y: 590, w: 140, z: 14 }),
          k.prop('cushion', { x: 815, y: 550, w: 130, z: 15 }),
          k.prop('cushion', { x: 790, y: 510, w: 120, z: 16 }),
        ];
      },
      async play(k) {
        const { mf, pan, wash } = cast;
        // Bubbles pour up through the hatch and fill the room.
        k.fx.bubbles(10);
        const lots = bubbles(k, 14, [40, 60, 1100, 420], 7);
        for (const b of lots) {
          void k.to(b, 0.6, { opacity: 1, scale: 1, ease: 'back.out(1.6)' });
          await k.wait(140);
        }
        await k.all(k.say('everywhere', mf), k.shake(mf, 5, 2));
        k.fx.pop();
        await k.all(k.say('fullPots', pan), rattle(k, pan));
        // One lands on Moon-Face's nose.
        const nose = k.add(bubble(), { x: 430, y: 380, w: 70, z: 30 });
        k.set(nose, { opacity: 0, y: -200 });
        await k.to(nose, 1.2, { opacity: 1, y: 0, ease: 'sine.out' });
        k.fx.pop();
        void k.vanish(nose, 0.2);
        await k.all(k.say('atishoo', mf), k.shake(mf, 6, 2));
        giggle();

        // Dame Washalot pops up through the hatch in a hat of suds.
        k.fx.pop();
        await k.to(wash, 0.7, { y: 0, opacity: 1, ease: 'back.out(1.4)' });
        await k.all(k.say('tooMuch', wash), k.shake(wash, 4, 2));
        await k.say('nipBack', wash);
        k.fx.patter(3, 0.12);
        await k.to(wash, 0.7, { y: 260, opacity: 0, ease: 'power1.in' });
        k.fx.bubbles(6);
        await k.say('cantClimb', mf);
        await k.camera({ zoom: 1.25, x: 780, y: 560 }, 0.8);
        await k.say('cushionsFirst', mf);
        await k.camera({}, 0.7);

        // The Saucepan Man throws the cushions down the slide.
        await k.say('heaveHo', pan);
        k.flourish(cushions[2]);
        for (const c of [...cushions].reverse()) {
          k.fx.whizz();
          await k.to(c, 0.6, { x: '+=200', y: '+=130', scale: 0.3, rotation: 200, ease: 'power1.in' });
          k.set(c, { opacity: 0 });
        }
        // Far below, three soft landings.
        for (let i = 0; i < 3; i++) {
          await k.wait(250);
          flump();
        }
        await k.wait(400);
        await k.all(k.say('allDown', mf), k.hop(mf, 24));

        // Moon-Face jumps in first.
        await k.say('meFirst', mf);
        // Up and over the Saucepan Man's head, and down into the slide.
        clank(2, 0.1);
        void k.to(pan, 0.3, { y: 30 });
        k.fx.boing();
        k.set(mf, { zIndex: 30 });
        await k.to(mf, 0.6, { x: 330, y: -260, scale: 0.5, rotation: 20, ease: 'power2.out' });
        await k.to(mf, 0.5, { x: 600, y: 230, scale: 0.2, rotation: 40, opacity: 0, ease: 'power2.in' });
      },
    },

    // ==================================================== 3. The slippery-slip
    {
      name: 'The slippery-slip',
      set(k) {
        const a = slipperySlip.set(k, { riders: [{ id: 'moonface' }, { id: 'saucepan', flip: true }] });
        [cast.mf, cast.pan] = a.riders;
        // Dame Washalot up at her tub, ready to help.
        cast.wash = k.character('washalot', { x: 700, y: 380, w: 170, z: 12 });
        k.ambient('bubbles', { count: 8, area: [700, 300, 300, 300] });
      },
      async play(k) {
        const { mf, pan, wash } = cast;
        await k.all(k.say('mindBubbles', wash), k.wait(300).then(() => k.hop(wash, 14)));
        await slipperySlip.play(k, { riders: [mf, pan] }, {
          lines: [{ landed: 'whatARide' }, { start: 'hereIcome', landed: 'clatterBang' }],
          stuck: {
            rider: 1,
            async free(el) {
              // Stuck: he wobbles and clanks.
              clank(4, 0.08);
              await k.shake(el, 5, 2);
              await k.say('stuck', el);
              await k.say('tooWide', mf);
              // Dame Washalot sends a soapy splash to push him free.
              await k.say('soapySplash', wash);
              k.fx.splash();
              k.puff(620, 560, 120, '#bfdcea');
              await k.wait(300);
              clank(3, 0.06);
              await k.shake(el, 6, 1);
            },
          },
        });
        flump();
        await k.all(k.say('thanksWash', mf), k.hop(mf, 24, 2));
      },
    },

    // ==================================================== 4. Splash!
    {
      name: 'Splash!',
      set(k) {
        k.backdrop('tree');
        k.music('cosy');
        cast.mf = k.character('moonface', { x: 70, y: 474, w: 200 });
        cast.pan = k.character('saucepan', { x: 250, y: 484, w: 190 });
        cast.watz = k.character('watzisname', { x: 900, y: 490, w: 200, flip: true });
        cast.wash = k.character('washalot', { x: 700, y: 380, w: 170, z: 12 });
        cast.socks = k.prop('peg', { x: 640, y: 520, w: 130, z: 13 });
        k.set(cast.socks, { opacity: 0 });
      },
      async play(k) {
        const { mf, pan, watz, wash, socks } = cast;
        snore();
        await k.wait(1500);
        await k.say('sleptThrough', mf);
        snore();
        await k.wait(1000);

        // Dame Washalot tips out the last of the water.
        // The ring goes on the tub in her arms, not her face: an invisible spot over it.
        const tub = k.add('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"></svg>', { x: 722, y: 495, w: 140, h: 140, z: 1 });
        await k.say('askTub', wash);
        k.flourish(tub);
        k.remove(tub);
        // The last of the water: SPLASH.
        await k.all(k.say('lookOut', wash), k.wait(300).then(() => k.hop(wash, 16)));
        const s = k.add(splash(), { x: 930, y: 300, w: 140, z: 20 });
        k.set(s, { opacity: 0, y: -120 });
        k.fx.whizz();
        await k.to(s, 0.6, { opacity: 1, y: 140, ease: 'power2.in' });
        k.fx.splash();
        k.puff(1000, 560, 200, '#bfdcea');
        void k.fade(s, 0, 0.4);
        await k.shake(watz, 6, 2);
        await wakeUp(k, watz, true);
        await k.say('raining', watz);
        await k.wait(400);
        await k.say('bathTime', watz);
        await wakeUp(k, watz, false);
        snore();
        laugh();
        await k.all(k.shake(mf, 4, 3), k.shake(pan, 4, 3), k.wait(800));
        await k.say('thunderstorm', wash);

        // Clean socks float down for the Saucepan Man.
        await k.all(k.say('cleanSocks', wash), k.wait(400).then(() => k.hop(wash, 14)));
        await k.appear(socks, 0.4);
        await k.all(k.say('floatDown', wash), k.carry(socks, pan));
        await k.vanish(socks, 0.3);
        sniff();
        await k.wait(400);
        clank(3, 0.1);
        await k.say('roses', pan);
        giggle();
        await k.hop(pan, 30);
        sniff();
        await k.say('smell', mf);

        // One last bubble, for everybody.
        await k.say('bubbleFor', mf);
        const b = k.add(bubble(), { x: 540, y: 380, w: 120, z: 40 });
        k.set(b, { opacity: 0, scale: 0.3 });
        await k.to(b, 0.6, { opacity: 1, scale: 1 });
        await k.to(b, 2, { y: -40, scale: 2.6, ease: 'sine.inOut' });
        k.fx.pop();
        k.sparkle(600, 400, 16, 220);
        await k.vanish(b, 0.2);
        await warmEnding(k, { cast: [mf, pan, wash], end: 'end' });
      },
    },
  ],
});
