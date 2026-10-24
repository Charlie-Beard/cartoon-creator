/**
 * A Party in the Clouds: the Land of Birthdays is at the top of the Tree,
 * and in the Land of Birthdays every visitor gets a party. Today, it's the Saucepan Man's.
 *
 *   1. A secret. In Moon-Face's room, Moon-Face and Silky whisper the news:
 *      the Land of Birthdays has come, and today the party is for the Saucepan
 *      Man. He hears "a PARROT", then puts on his best hat (the same
 *      saucepan). Silky taps his hat to see if it clangs (it does). Far above:
 *      oom, boom, BOOM. Mr Oom Boom Boom is up there already.
 *   2. The Land of Birthdays. Bunting, balloons, presents and the biggest cake
 *      in the world. Mr Oom Boom Boom: a party can't start without a BOOM. The
 *      Saucepan Man brings the drumstick to the drum. BOOM, confetti, and the
 *      party starts. Silky brings the Saucepan Man's own cake, but the candles
 *      aren't lit.
 *   3. The candles. Every candle in the land is out, even the giant cake's.
 *      Silky's spell is blown away by the wind at the top of the world, so the
 *      Saucepan Man stands by the cake as a clanky wall. Silky tries again and
 *      the candles light, and so does every candle on the giant cake (Silky
 *      counts six). Hip, hip, hooray! The Saucepan Man makes a secret wish and
 *      blows the candles out. The wish flies up to the stars. Then the ground
 *      rumbles: the land is moving on, and the ladder is far away.
 *   4. Home by balloon. "Take a balloon each!" Silky flies a balloon over to the
 *      Saucepan Man. Up they go, and down they float out of the sky to the foot
 *      of the Tree and land safe.
 *
 * The danger is only the wind and the land moving on; the balloons get them
 * home in time. The cake is the world's (`birthday-cake`, its flames a part);
 * the party's cake is placed afresh in each scene.
 */
import { C, cached, defineCartoon, ellipse, ink, piece, rect, svg, type Kit } from '../../kit';
import { moves as commonMoves, sounds as commonSounds } from '../../worlds/common/moves';
import { noiseOff, warmEnding } from '../../worlds/common/pieces';
import { moves as farawayMoves, sounds as farawaySounds } from '../../worlds/faraway/moves';
import meta from './meta';

const { clank, whirr } = farawaySounds;
const { laugh, giggle } = commonSounds;
const { beam, earCup, flutter, rattle } = farawayMoves;
const { wave, together } = commonMoves;

// ------------------------------------------------------------------- art

/** Sky-coloured paper over the giant cake's ten flames, with a black wick on each candle (210 × 30). */
const unlitFlames = cached(() =>
  svg({ w: 210, h: 30, name: 'birthday-unlit' }, [
    piece(rect(0, 0, 210, 30), '#f3d79a', { edge: 'clean', shadow: false, fibre: false }),
    ...Array.from({ length: 10 }, (_, i) => ink([[14 + i * 20, 28], [14 + i * 20, 21]], { width: 2, color: C.charcoal })),
  ]),
);

/** Mr Oom Boom Boom's spare drumstick: a wooden stick with a red knob (180 × 44). */
const drumstick = cached(() =>
  svg({ w: 180, h: 44, name: 'birthday-drumstick', label: 'A drumstick' }, [
    piece(rect(4, 16, 140, 13, 6), '#6e4426'),
    piece(ellipse(152, 22, 22, 20), C.red),
  ]),
);

// ---------------------------------------------------------------- sounds

/** Mr Oom Boom Boom's big drum: oom, boom, BOOM. */
function drum(k: Kit, times = 3): void {
  for (let i = 0; i < times; i++) setTimeout(() => k.sfx.boom(), i * 320);
}

// ------------------------------------------------------------------ cast

const cast = {} as Record<'mf' | 'silky' | 'pan' | 'oom' | 'cake' | 'unlit', HTMLElement>;
let balloons: HTMLElement[] = [];

/** Where the cake stands in scenes 2 and 3. */
const CAKE = { x: 450, y: 432, w: 280 };

/**
 * The cake on the table, candles unlit. The giant cake
 * in the backdrop has its candles drawn lit; a strip of the sky's own paper
 * over its flames (`unlit`) puts them out until the candles light them all.
 */
function placeCake(k: Kit): void {
  cast.unlit = k.add(unlitFlames(), { x: 486, y: 194, w: 210, z: 1 });
  cast.cake = k.prop('birthday-cake', { ...CAKE, z: 14 });
  k.set(k.part(cast.cake, 'flames'), { opacity: 0 });
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. A secret
    hello: { who: 'moonface', text: 'Shh! Come closer, Silky. We’ve got a secret.' },
    secret: { who: 'silky', text: 'The Land of Birthdays is at the top of the Tree today!' },
    everyVisitor: { who: 'moonface', text: 'And in the Land of Birthdays, every visitor gets a party.' },
    forYou: { who: 'silky', text: 'So today, the party is for the Saucepan Man!' },
    parrot: { who: 'saucepan', text: 'Eh? A PARROT? Where’s the parrot?' },
    notParrot: { who: 'moonface', text: 'Not a parrot! A PARTY! A birthday party!' },
    bestHat: { who: 'saucepan', text: 'Oh! A party! Then I’ll wear my best hat!' },
    sameHat: { who: 'silky', text: 'But that’s the same hat. It’s a saucepan!' },
    silkyHat: { who: 'silky', text: 'Let me tap it and see. Ting!' },
    clangHat: { who: 'saucepan', text: 'Clang! See? It IS a saucepan!' },
    upWeGo: { who: 'moonface', text: 'Listen! That’s Mr Oom Boom Boom’s drum. Up we go!' },
    // 2. The Land of Birthdays
    welcome: { who: 'oomBoomBoom', text: 'Oom boom boom! Welcome to the Land of Birthdays!' },
    wow: { who: 'moonface', text: 'Look! Balloons, presents, and the biggest cake in the world!' },
    noBoom: { who: 'oomBoomBoom', text: 'But a party can’t start without a BOOM!' },
    panDrum: { who: 'saucepan', text: 'I’ll bring it over! Clang! I mean, BOOM!' },
    bravo: { who: 'oomBoomBoom', text: 'Bravo! The party has started! Hip, hip, HOORAY!' },
    myCake: { who: 'silky', text: 'And here’s the Saucepan Man’s very own cake. I baked it!' },
    notLit: { who: 'saucepan', text: 'But the candles aren’t lit! Who’s got a match?' },
    // 3. The candles
    wand: { who: 'silky', text: 'I’ll light them with my wand. Here goes!' },
    blownAway: { who: 'silky', text: 'Oh! The wind blew my spell away!' },
    windy: { who: 'moonface', text: 'It’s very windy at the top of the world.' },
    wall: { who: 'saucepan', text: 'Then I’ll be a wall! A big clanky wall!' },
    tryAgain: { who: 'silky', text: 'One more try with my wand. There!' },
    count: { who: 'silky', text: 'They’re lit! One, two, three, four, five, six!' },
    hooray: { who: 'oomBoomBoom', text: 'Hip, hip, HOORAY! Hip, hip, HOORAY!' },
    wish: { who: 'moonface', text: 'Now close your eyes and make a wish. Shh! Don’t tell!' },
    panBlow: { who: 'saucepan', text: 'Here goes! One, two, three… PHOO!' },
    stars: { who: 'silky', text: 'Your wish is flying up to the stars!' },
    rumble: { who: 'moonface', text: 'Uh-oh! The land is moving on, and the ladder’s far away!' },
    // 4. Home by balloon
    balloons: { who: 'oomBoomBoom', text: 'Never mind! Take a balloon each! Oom boom boom!' },
    silkyBalloon: { who: 'silky', text: 'I’ll fly it over to him. Whirr!' },
    thanksSilky: { who: 'saucepan', text: 'Thank you, Silky! Now I can float!' },
    holdOn: { who: 'oomBoomBoom', text: 'Hold on tight, everybody!' },
    wheee: { who: 'saucepan', text: 'Wheee! What a ride! My pots flew too!' },
    home: { who: 'moonface', text: 'Home, safe and sound. What a party!' },
    thankYou: { who: 'moonface', text: 'Thank you for a lovely party, Mr Oom Boom Boom!' },
    end: { who: 'narrator', text: 'And the birthday balloon floated all the way home.' },
  },
  scenes: [
    // ==================================================== 1. A secret
    {
      name: 'A secret',
      set(k) {
        k.backdrop('moon-room');
        k.music('cosy');
        cast.mf = k.character('moonface', { x: 330, y: 380, w: 250 });
        cast.silky = k.character('silky', { x: 580, y: 290, w: 210, z: 11, flip: true });
        cast.pan = k.character('saucepan', { x: 790, y: 400, w: 240, flip: true });
        k.set(cast.pan, { opacity: 0 });
      },
      async play(k) {
        const { mf, silky, pan } = cast;
        await k.wait(300);
        // They lean in close to whisper.
        await together(k, [mf, silky], 0.6, { scale: 1.06 });
        await k.say('hello', mf);
        void flutter(k, silky, 4);
        await k.say('secret', silky);
        await k.say('everyVisitor', mf);
        await together(k, [mf, silky], 0.5, { scale: 1 });
        k.fx.twinkle();
        k.sparkle(560, 300, 14, 220);
        await k.all(k.say('forYou', silky), flutter(k, silky, 6), k.hop(mf, 30, 2));

        // Clank, clank: the Saucepan Man, who only heard half of it.
        clank(4, 0.14);
        await k.all(k.enter(pan, 'right', 0.8), k.fade(pan, 1, 0.3));
        await earCup(k, pan, true);
        await k.say('parrot', pan);
        void earCup(k, pan, false);
        await k.all(k.say('notParrot', mf), k.to(mf, 0.4, { x: 40 }));
        void k.to(mf, 0.4, { x: 0 });
        clank(3, 0.1);
        await k.hop(pan, 30);
        await k.all(k.say('bestHat', pan), rattle(k, pan));
        giggle();
        await k.say('sameHat', silky);

        // Silky taps the hat. A spot over it, since the hat is part of his art.
        const spot = k.add('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"></svg>', { x: 840, y: 380, w: 140, h: 140, z: 1 });
        await k.say('silkyHat', silky);
        k.flourish(spot);
        k.remove(spot);
        k.fx.pop();
        await k.all(k.say('clangHat', pan), rattle(k, pan), k.pop(pan, 1.06));
        laugh();
        await k.all(k.shake(mf, 4, 2), k.wait(500));

        // Far above: oom, boom, BOOM.
        await noiseOff(k, { listeners: [mf, silky, pan], sound: () => drum(k, 3), line: 'upWeGo', by: mf });
      },
    },

    // ==================================================== 2. The Land of Birthdays
    {
      name: 'The Land of Birthdays',
      set(k) {
        k.backdrop('birthdays');
        k.music('magic');
        cast.mf = k.character('moonface', { x: 30, y: 400, w: 230 });
        cast.pan = k.character('saucepan', { x: 220, y: 412, w: 220, z: 11 });
        cast.silky = k.character('silky', { x: 700, y: 190, w: 180, z: 12, flip: true });
        cast.oom = k.character('oomBoomBoom', { x: 880, y: 380, w: 250, flip: true });
        placeCake(k);
        k.set(cast.cake, { opacity: 0 });
        k.set(cast.silky, { opacity: 0 });
      },
      async play(k) {
        const { mf, pan, silky, oom, cake } = cast;
        await k.wait(400);
        drum(k, 2);
        await k.hop(oom, 26, 2);
        await k.all(k.say('welcome', oom), wave(k, oom, 2, 'armL'));
        void beam(k, mf, true);
        await k.camera({ zoom: 1.25, x: 590, y: 330 }, 1.2);
        await k.say('wow', mf);
        await k.camera({}, 0.9);
        void beam(k, mf, false);
        await k.say('noBoom', oom);

        // The Saucepan Man brings the drumstick to start the party.
        const stick = k.add(drumstick(), { x: 620, y: 600, w: 180, z: 16 });
        await k.all(k.say('panDrum', pan), rattle(k, pan));
        await k.carry(stick, oom);
        void k.vanish(stick, 0.2);
        k.sfx.boom();
        void k.quake(5);
        await k.shake(oom, 6, 2);
        k.music('triumph');
        k.confetti(40);
        await k.all(k.say('bravo', oom), k.hop(mf, 30, 2), k.hop(pan, 30, 2));

        // Silky flutters in with the Saucepan Man's own cake.
        whirr(8);
        void flutter(k, silky, 8);
        await k.all(k.enter(silky, 'top', 1.1), k.fade(silky, 1, 0.3));
        k.fx.pop();
        k.sparkle(CAKE.x + 140, CAKE.y + 110, 14, 200);
        await k.appear(cake, 0.5);
        await k.say('myCake', silky);
        await k.all(k.say('notLit', pan), rattle(k, pan));
      },
    },

    // ==================================================== 3. The candles
    {
      name: 'The candles',
      set(k) {
        k.backdrop('birthdays');
        k.music('magic');
        cast.mf = k.character('moonface', { x: 30, y: 400, w: 230 });
        cast.pan = k.character('saucepan', { x: 220, y: 412, w: 220, z: 11 });
        cast.silky = k.character('silky', { x: 700, y: 190, w: 180, z: 12, flip: true });
        cast.oom = k.character('oomBoomBoom', { x: 880, y: 380, w: 250, flip: true });
        placeCake(k);
      },
      async play(k) {
        const { mf, pan, silky, oom, cake } = cast;
        const flames = k.part(cake, 'flames');
        const top: [number, number] = [CAKE.x + 140, CAKE.y + 40];
        void flutter(k, silky, 4);
        await k.say('wand', silky);

        // The spell flies… and the wind blows it away.
        k.fx.spell();
        await k.beam([760, 300], top);
        k.fx.wind(1.6);
        k.sfx.whoosh();
        k.sparkle(top[0] + 260, top[1] - 60, 12, 140);
        await k.all(together(k, [mf, pan, oom], 0.4, { rotation: -6, x: '-=14' }), k.to(silky, 0.4, { x: '-=40', rotation: -10 }));
        await together(k, [mf, pan, oom, silky], 0.5, { rotation: 0, x: '+=14' });
        await k.all(k.say('blownAway', silky), k.shake(silky, 4, 2));
        await k.say('windy', mf);

        // The Saucepan Man makes himself a wall.
        clank(5, 0.12);
        await k.walk(pan, 120, 0.8, 3);
        await k.all(k.say('wall', pan), rattle(k, pan));

        // Silky tries again, and the candles light.
        await k.say('tryAgain', silky);
        k.fx.spell();
        await k.beam([760, 300], top);
        k.flourish(cake);
        // The candles light, and every candle on the giant cake behind lights with them.
        k.fx.twinkle();
        await k.to(flames, 0.8, { opacity: 1 });
        k.sparkle(top[0], top[1], 10, 120);
        k.fx.twinkle();
        void k.fade(cast.unlit, 0, 0.8);
        k.sparkle(590, 210, 12, 200);
        const glow = k.light(top[0], top[1] + 10, 120, { strength: 0.35 });
        void k.fade(glow, 1, 0.8);
        await k.all(k.say('count', silky), flutter(k, silky, 6));
        drum(k, 2);
        await k.all(k.say('hooray', oom), k.hop(oom, 24, 2), k.hop(mf, 24, 2));

        // A wish, and a quiet beat to make it.
        k.music('dreamy');
        await k.say('wish', mf);
        await k.wait(1500);

        // The Saucepan Man blows them out.
        await k.all(k.say('panBlow', pan), rattle(k, pan));
        k.flourish(cake);
        k.fx.wind(1);
        await k.all(k.to(flames, 0.5, { opacity: 0 }), k.fade(glow, 0, 0.5), k.fade(cast.unlit, 1, 0.5));
        k.puff(590, 205, 120, '#eeeae4');
        for (const dx of [-60, 0, 60]) k.puff(top[0] + dx, top[1] - 20, 70, '#eeeae4');
        await k.wait(400);
        // The wish flies up.
        k.fx.whizz();
        k.sparkle(top[0], top[1] - 120, 18, 200);
        await k.wait(500);
        k.sparkle(top[0], 60, 14, 260);
        k.music('triumph');
        await k.all(k.say('stars', silky), flutter(k, silky, 6));
        await k.hop(pan, 24);

        // The ground rumbles: the hook into the last scene.
        await k.wait(500);
        k.fx.rumble(2.5);
        void k.quake(6);
        await k.all(k.say('rumble', mf), k.shake(mf, 5, 2), k.shake(pan, 4, 2));
      },
    },

    // ==================================================== 4. Home by balloon
    {
      name: 'Home by balloon',
      set(k) {
        // Still at the party, the ground rumbling: a balloon each, and up they go.
        k.backdrop('birthdays');
        k.music('adventure');
        cast.mf = k.character('moonface', { x: 30, y: 400, w: 230 });
        cast.pan = k.character('saucepan', { x: 340, y: 412, w: 220, z: 11 });
        cast.silky = k.character('silky', { x: 700, y: 190, w: 180, z: 12, flip: true });
        cast.oom = k.character('oomBoomBoom', { x: 880, y: 380, w: 250, flip: true });
        placeCake(k);
        balloons = [0, 1, 2].map((i) => k.prop('balloon', { x: [190, 560, 1050][i], y: [420, 330, 300][i], w: 110, z: 16 }));
        k.set(balloons, { opacity: 0, y: 60 });
      },
      async play(k) {
        let { mf, silky, pan, oom } = cast;
        k.fx.rumble(2);
        void k.quake(4);
        drum(k, 3);
        await k.all(k.say('balloons', oom), ...balloons.map((b, i) => k.wait(i * 250).then(() => k.to(b, 0.6, { opacity: 1, y: 0, ease: 'back.out(1.5)' }))));

        // Silky flies a balloon over to the Saucepan Man, who is holding nothing yet.
        void flutter(k, silky, 4);
        await k.say('silkyBalloon', silky);
        await k.carry(balloons[1], pan);
        await k.say('thanksSilky', pan);
        await k.say('holdOn', oom);
        k.fx.whizz();
        await k.all(...[mf, pan, oom, ...balloons].map((el) => k.to(el, 1.4, { y: -820, ease: 'power1.in' })), k.to(silky, 1.4, { y: -700, ease: 'power1.in' }));

        // Down they float to the foot of the Tree, either side of the trunk.
        await k.cut(() => {
          k.backdrop('tree');
          k.music('dreamy');
          mf = k.character('moonface', { x: 60, y: 480, w: 190 });
          silky = k.character('silky', { x: 250, y: 440, w: 170, z: 11 });
          pan = k.character('saucepan', { x: 790, y: 484, w: 190, flip: true });
          oom = k.character('oomBoomBoom', { x: 950, y: 474, w: 200, flip: true });
          balloons = [
            k.prop('balloon', { x: 170, y: 470, w: 100, z: 12 }),
            k.prop('balloon', { x: 800, y: 380, w: 100, z: 12 }),
            k.prop('balloon', { x: 1060, y: 380, w: 100, z: 12 }),
          ];
          k.set([mf, pan, oom, ...balloons], { y: -820 });
          k.set(silky, { y: -800 });
        });
        const [bMf, bPan, bOom] = balloons;
        whirr(6);
        void flutter(k, silky, 10);
        const sway = (els: HTMLElement[], s: number) => Promise.all(els.map((el) => k.to(el, s, { y: 0, ease: 'sine.out' })));
        await k.all(sway([pan, bPan, oom, bOom], 3), k.wait(500).then(() => sway([mf, bMf], 2.6)), k.wait(700).then(() => k.to(silky, 2.6, { y: 0, ease: 'sine.out' })));
        farawaySounds.flump();
        await k.all(k.pop(mf, 1.08), k.pop(pan, 1.08));
        clank(3, 0.15);
        await k.say('wheee', pan);

        void beam(k, mf, true);
        await k.say('home', mf);
        void beam(k, mf, false);

        await k.all(k.say('thankYou', mf), wave(k, mf));
        await warmEnding(k, { cast: [mf, silky, pan, oom], end: 'end', confetti: true });
      },
    },
  ],
});
