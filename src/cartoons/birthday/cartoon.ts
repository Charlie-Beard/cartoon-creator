/**
 * A Party in the Clouds: the Land of Birthdays is at the top of the Tree,
 * and in the Land of Birthdays every visitor gets a party. Today, it's his.
 *
 *   1. A secret. In Moon-Face's room, Moon-Face and Silky whisper the news to
 *      him: the Land of Birthdays has come, and the party is for him. The
 *      Saucepan Man hears "a PARROT", then puts on his best hat (the same
 *      saucepan). Far above: oom, boom, BOOM. Mr Oom Boom Boom is up there
 *      already.
 *   2. The Land of Birthdays. Bunting, balloons, presents and the biggest cake
 *      in the world. Mr Oom Boom Boom: a party can't start without a BOOM. His
 *      turn: he taps the drum (or the Saucepan Man bangs it). BOOM, confetti,
 *      and the party starts. Silky brings his own cake, with his name on it,
 *      but the candles aren't lit.
 *   3. The candles. Silky's spell is blown away by the wind at the top of the
 *      world. The Saucepan Man stands by the cake as a clanky wall. His turn:
 *      he taps the candles and they light (Silky counts them: six). Hip, hip,
 *      hooray! He makes a secret wish, and his next turn blows them out (or
 *      the Saucepan Man helps him blow). The wish flies up to the stars. Then
 *      the ground rumbles: the land is moving on, and the ladder is far away.
 *      "Take a balloon each!"
 *   4. Home by balloon. Everyone floats down out of the sky to the foot of the
 *      Tree, holding a balloon, and lands safe. One last present: a balloon
 *      for him, floating out of the picture to him.
 *
 * The danger is only the wind and the land moving on; the balloons get them
 * home in time. The cake is the world's (`birthday-cake`, its flames a part);
 * his name is written on its plaque here, so it is drawn fresh each time.
 */
import { defineCartoon, type Kit } from '../../kit';
import { moves as commonMoves, sounds as commonSounds } from '../../worlds/common/moves';
import { noiseOff, warmEnding } from '../../worlds/common/pieces';
import { moves as farawayMoves, sounds as farawaySounds } from '../../worlds/faraway/moves';
import meta from './meta';

const { clank, whirr } = farawaySounds;
const { laugh, giggle } = commonSounds;
const { beam, earCup, flutter, rattle } = farawayMoves;
const { wave, together } = commonMoves;

// ------------------------------------------------------------------- art

/** His name in icing, laid exactly over the cake's blank plaque (the cake's own 280 × 240 box). */
function nameOnCake(name: string): string {
  const safe = (name || 'You!').replace(/[<>&"]/g, '');
  const size = safe.length > 8 ? 18 : 24;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 240"><text x="140" y="${186 + size * 0.35}" font-family="Andika, sans-serif" font-weight="700" font-size="${size}" fill="#b5476b" text-anchor="middle">${safe}</text></svg>`;
}

// ---------------------------------------------------------------- sounds

/** Mr Oom Boom Boom's big drum: oom, boom, BOOM. */
function drum(k: Kit, times = 3): void {
  for (let i = 0; i < times; i++) setTimeout(() => k.sfx.boom(), i * 320);
}

// ------------------------------------------------------------------ cast

const cast = {} as Record<'mf' | 'silky' | 'pan' | 'oom' | 'cake' | 'name', HTMLElement>;
let balloons: HTMLElement[] = [];

/** Where the cake stands in scenes 2 and 3. */
const CAKE = { x: 450, y: 432, w: 280 };

/** The cake on the table, candles unlit, with his name on it. */
function placeCake(k: Kit): void {
  cast.cake = k.prop('birthday-cake', { ...CAKE, z: 14 });
  cast.name = k.add(nameOnCake(k.name), { ...CAKE, h: 240, z: 15 });
  k.set(k.part(cast.cake, 'flames'), { opacity: 0 });
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. A secret
    hello: { who: 'moonface', text: 'Hello, {name}! Shh! Come closer. We’ve got a secret.' },
    secret: { who: 'silky', text: 'The Land of Birthdays is at the top of the Tree today!' },
    everyVisitor: { who: 'moonface', text: 'And in the Land of Birthdays, every visitor gets a party.' },
    forYou: { who: 'silky', text: 'So today, the party is for YOU!' },
    parrot: { who: 'saucepan', text: 'Eh? A PARROT? Where’s the parrot?' },
    notParrot: { who: 'moonface', text: 'Not a parrot! A PARTY! A birthday party!' },
    bestHat: { who: 'saucepan', text: 'Oh! A party! Then I’ll wear my best hat!' },
    sameHat: { who: 'silky', text: 'But that’s the same hat. It’s a saucepan!' },
    upWeGo: { who: 'moonface', text: 'Listen! That’s Mr Oom Boom Boom’s drum. Up we go!' },
    // 2. The Land of Birthdays
    welcome: { who: 'oomBoomBoom', text: 'Oom boom boom! Welcome to the Land of Birthdays!' },
    wow: { who: 'moonface', text: 'Look! Balloons, presents, and the biggest cake in the world!' },
    noBoom: { who: 'oomBoomBoom', text: 'But a party can’t start without a BOOM!' },
    askDrum: { who: 'oomBoomBoom', text: 'Tap my drum, {name}! One big BOOM!' },
    nudgeDrum: { who: 'oomBoomBoom', text: 'Just tap the big blue drum.' },
    panDrum: { who: 'saucepan', text: 'I’ll do it! Clang! I mean, BOOM!' },
    bravo: { who: 'oomBoomBoom', text: 'Bravo! The party has started! Hip, hip, HOORAY!' },
    myCake: { who: 'silky', text: 'And here’s your very own cake. I baked it!' },
    yourName: { who: 'moonface', text: 'Look, it’s got your name on it!' },
    notLit: { who: 'saucepan', text: 'But the candles aren’t lit! Who’s got a match?' },
    // 3. The candles
    wand: { who: 'silky', text: 'I’ll light them with my wand. Here goes!' },
    blownAway: { who: 'silky', text: 'Oh! The wind blew my spell away!' },
    windy: { who: 'moonface', text: 'It’s very windy at the top of the world.' },
    wall: { who: 'saucepan', text: 'Then I’ll be a wall! A big clanky wall!' },
    askLight: { who: 'silky', text: 'Now, {name}, tap the candles to light them!' },
    nudgeLight: { who: 'silky', text: 'Tap the candles on top of the cake.' },
    tryAgain: { who: 'silky', text: 'One more try with my wand. There!' },
    count: { who: 'silky', text: 'They’re lit! One, two, three, four, five, six!' },
    hooray: { who: 'oomBoomBoom', text: 'Hip, hip, HOORAY! Hip, hip, HOORAY!' },
    wish: { who: 'moonface', text: 'Now close your eyes and make a wish. Shh! Don’t tell!' },
    askBlow: { who: 'moonface', text: 'Then tap the candles to blow them out!' },
    nudgeBlow: { who: 'moonface', text: 'Tap the candles. Whoosh!' },
    panBlow: { who: 'saucepan', text: 'I’ll help you blow! One, two, three… PHOO!' },
    stars: { who: 'silky', text: 'Your wish is flying up to the stars!' },
    rumble: { who: 'moonface', text: 'Uh-oh! The land is moving on, and the ladder’s far away!' },
    balloons: { who: 'oomBoomBoom', text: 'Never mind! Take a balloon each! Oom boom boom!' },
    // 4. Home by balloon
    holdOn: { who: 'oomBoomBoom', text: 'Hold on tight, everybody!' },
    wheee: { who: 'saucepan', text: 'Wheee! I’m flying! My pots are flying too!' },
    home: { who: 'moonface', text: 'Home, safe and sound. What a party!' },
    lastPresent: { who: 'silky', text: 'And one last present. A balloon for {name}!' },
    thankYou: { who: 'moonface', text: 'Thank you for coming to your party!' },
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
        k.set([cast.cake, cast.name], { opacity: 0 });
        k.set(cast.silky, { opacity: 0 });
      },
      async play(k) {
        const { mf, pan, silky, oom, cake, name } = cast;
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

        // His turn: start the party.
        const how = await k.tapToHelp(oom, { ask: 'askDrum', nudge: 'nudgeDrum', helped: 'panDrum', by: oom, helper: pan, size: 200 });
        if (how === 'helped') {
          clank(2, 0.08);
          await k.to(pan, 0.4, { x: 380, yoyo: true, repeat: 1, ease: 'power1.inOut' });
        }
        k.sfx.boom();
        void k.quake(5);
        await k.shake(oom, 6, 2);
        k.music('triumph');
        k.confetti(40);
        await k.all(k.say('bravo', oom), k.hop(mf, 30, 2), k.hop(pan, 30, 2));

        // Silky flutters in with his own cake.
        whirr(8);
        void flutter(k, silky, 8);
        await k.all(k.enter(silky, 'top', 1.1), k.fade(silky, 1, 0.3));
        k.fx.pop();
        k.sparkle(CAKE.x + 140, CAKE.y + 110, 14, 200);
        await k.all(k.appear(cake, 0.5), k.fade(name, 1, 0.5));
        await k.say('myCake', silky);
        k.sparkle(CAKE.x + 140, CAKE.y + 186, 10, 120);
        await k.pop(cast.name, 1.1);
        await k.say('yourName', mf);
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

        // His turn: light the candles.
        const how = await k.tapToHelp(cake, { ask: 'askLight', nudge: 'nudgeLight', helped: 'tryAgain', by: silky, size: 240 });
        if (how === 'helped') {
          k.fx.spell();
          await k.beam([760, 300], top);
        }
        k.fx.twinkle();
        await k.to(flames, 0.8, { opacity: 1 });
        k.sparkle(top[0], top[1], 10, 120);
        const glow = k.light(top[0], top[1] + 10, 120, { strength: 0.35 });
        void k.fade(glow, 1, 0.8);
        await k.all(k.say('count', silky), flutter(k, silky, 6));
        drum(k, 2);
        await k.all(k.say('hooray', oom), k.hop(oom, 24, 2), k.hop(mf, 24, 2));

        // A wish, and a quiet beat to make it.
        k.music('dreamy');
        await k.say('wish', mf);
        await k.wait(1500);

        // His big turn: blow them out.
        const blow = await k.tapToHelp(cake, { ask: 'askBlow', nudge: 'nudgeBlow', helped: 'panBlow', by: mf, helper: pan, size: 240 });
        k.fx.wind(1);
        await k.all(k.to(flames, 0.5, { opacity: 0 }), k.fade(glow, 0, 0.5));
        for (const dx of [-60, 0, 60]) k.puff(top[0] + dx, top[1] - 20, 70, '#eeeae4');
        await k.wait(400);
        // The wish flies up.
        k.fx.whizz();
        k.sparkle(top[0], top[1] - 120, 18, 200);
        await k.wait(500);
        k.sparkle(top[0], 60, 14, 260);
        k.music('triumph');
        await k.all(k.say('stars', silky), flutter(k, silky, 6));
        if (blow === 'helped') await k.hop(pan, 24);

        // The ground rumbles.
        k.fx.rumble(2.5);
        void k.quake(6);
        await k.all(k.say('rumble', mf), k.shake(mf, 5, 2));
        // A balloon each.
        drum(k, 3);
        balloons = [0, 1, 2].map((i) => k.prop('balloon', { x: [190, 440, 1050][i], y: [420, 350, 300][i], w: 110, z: 16 }));
        k.set(balloons, { opacity: 0, y: 60 });
        await k.all(k.say('balloons', oom), ...balloons.map((b, i) => k.wait(i * 250).then(() => k.to(b, 0.6, { opacity: 1, y: 0, ease: 'back.out(1.5)' }))));
        k.fx.whizz();
        await k.all(...[mf, pan, oom, ...balloons].map((el) => k.to(el, 1.4, { y: -820, ease: 'power1.in' })), k.to(silky, 1.4, { y: -700, ease: 'power1.in' }));
      },
    },

    // ==================================================== 4. Home by balloon
    {
      name: 'Home by balloon',
      set(k) {
        k.backdrop('tree');
        k.music('dreamy');
        // Everyone floats down to the grass either side of the trunk, a balloon each.
        cast.mf = k.character('moonface', { x: 60, y: 480, w: 190 });
        cast.silky = k.character('silky', { x: 250, y: 440, w: 170, z: 11 });
        cast.pan = k.character('saucepan', { x: 790, y: 484, w: 190, flip: true });
        cast.oom = k.character('oomBoomBoom', { x: 950, y: 474, w: 200, flip: true });
        balloons = [
          k.prop('balloon', { x: 170, y: 470, w: 100, z: 12 }),
          k.prop('balloon', { x: 800, y: 380, w: 100, z: 12 }),
          k.prop('balloon', { x: 1060, y: 380, w: 100, z: 12 }),
        ];
        k.set([cast.mf, cast.pan, cast.oom, ...balloons], { y: -820 });
        k.set(cast.silky, { y: -800 });
      },
      async play(k) {
        const { mf, silky, pan, oom } = cast;
        const [bMf, bPan, bOom] = balloons;
        // Down they float, swaying, the Saucepan Man and Mr Oom Boom Boom first.
        whirr(6);
        void flutter(k, silky, 10);
        const sway = (els: HTMLElement[], s: number) => Promise.all(els.map((el) => k.to(el, s, { y: 0, ease: 'sine.out' })));
        void sway([pan, bPan, oom, bOom], 4);
        await k.wait(800);
        await k.say('holdOn', oom);
        await k.say('wheee', pan);
        clank(3, 0.15);
        await k.wait(600);
        await k.all(sway([mf, bMf], 2.4), k.wait(300).then(() => k.to(silky, 2.6, { y: 0, ease: 'sine.out' })));
        farawaySounds.flump();
        await k.all(k.pop(mf, 1.08), k.pop(pan, 1.08));

        void beam(k, mf, true);
        await k.say('home', mf);
        void beam(k, mf, false);

        // One last present: a balloon for him.
        whirr(4);
        void flutter(k, silky, 6);
        await k.say('lastPresent', silky);
        const his = k.prop('balloon', { x: 560, y: 720, w: 110, z: 40 });
        k.set(his, { opacity: 0 });
        await k.appear(his, 0.4);
        k.fx.whizz();
        await k.to(his, 2.2, { y: -560, x: 40, scale: 2.2, ease: 'sine.inOut' });
        k.sparkle(640, 200, 14, 220);
        await k.vanish(his, 0.4);

        await k.all(k.say('thankYou', mf), wave(k, mf));
        await warmEnding(k, { cast: [mf, silky, pan, oom], end: 'end', confetti: true });
      },
    },
  ],
});
