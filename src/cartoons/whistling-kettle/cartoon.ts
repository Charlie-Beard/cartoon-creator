/**
 * The Whistling Kettle: the Saucepan Man's kettle has gone, and Dame Snap
 * has it.
 *
 *   1. Tea time. Moon-Face's round room, the cups out on the table and no
 *      kettle. Silky flutters down with pop biscuits; the Saucepan Man
 *      clanks up through the trapdoor without his whistling kettle. He
 *      mishears ("Up my SLEEVE?"), then remembers: he left it on the top
 *      branch to cool, and if you tap its lid it whistles. Far above, a
 *      thin whistle and a clack, clack: it's up in the cloud.
 *   2. Above the cloud. They pop up through the cloud at the top of the
 *      ladder, but a thick grey cloud hides the new land. His turn: he
 *      taps the cloud and it puffs away (or Silky's spell does it). It's
 *      Dame Snap's School. The kettle whistles from inside it ("I'd know
 *      that whistle anywhere!"), and a far-off CLACK.
 *   3. Dame Snap's School. They tiptoe in; the kettle is on her desk by a
 *      NO WHISTLING slate. The Saucepan Man shouts with joy. Her window
 *      goes dark, then clack… clack… CLACK: she looms in, smacks her ruler
 *      on the desk and shrieks NOBODY WHISTLES (he hears "no WHISKERS?").
 *      Moon-Face: she hates whistling, so let's give her a big one. His big turn: he
 *      taps the kettle's lid. It whistles a jolly tune, again and louder,
 *      and she stomps so hard her own ruler snaps. "Oh, BOTHER!" She stomps
 *      off and slams a door. The Saucepan Man hugs his kettle, and the land
 *      starts to move on: back to the ladder.
 *   4. Tea at last. Home in Moon-Face's room, the kettle steaming on the
 *      table. Pop biscuits, thank-yous, one more mishearing ("A cup of
 *      BEES?"), and the kettle whistles its tune.
 *
 * Scary, never cruel (docs/STYLE.md): she looms, shouts, smacks the desk
 * and stomps; nobody is touched. Her defeat is her own temper: she stomps
 * until her ruler snaps, and goes off in a huff. The kettle's tap-the-lid
 * whistle is set up in scene 1 so the big turn pays it off.
 *
 * The kettle, the cloud-top place and the land's far view are in the
 * world (src/worlds/faraway/cloudtop.ts); the grey cloud, her desk and the
 * tea table are drawn here.
 */
import { bell, C, cached, circle, defineCartoon, ellipse, ink, noiseBurst, NOTE, now, piece, raw, rect, rng, svg, tone, type Kit, type Node, type Pt } from '../../kit';
import meta from './meta';

// ------------------------------------------------------------------- art

/** The thick grey cloud hiding the new land (680 × 380), with lazy swirls in it. */
const greyCloud = cached(() => {
  const r = rng(41);
  const greys = ['#a9a6a6', '#bbb7b1', '#9c9a9e', '#b3afab'];
  const puffs: Node[] = [];
  for (let i = 0; i < 9; i++) {
    const x = 70 + i * 68;
    const lift = Math.sin((i / 8) * Math.PI) * 90;
    puffs.push(piece(circle(x, 190 - lift - r() * 24, 74 + r() * 26), greys[i % greys.length], { shadow: i % 3 === 0, rough: 1.2 }));
  }
  const swirl = (cx: number, cy: number, size: number): Node => {
    const pts: Pt[] = [];
    for (let a = 0; a < Math.PI * 3.2; a += 0.3) pts.push([cx + Math.cos(a) * (a / 10) * size, cy + Math.sin(a) * (a / 10) * size * 0.7]);
    return ink(pts, { width: 4, color: '#86838a', opacity: 0.8, wobble: 1 });
  };
  return svg({ w: 680, h: 380, name: 'whistling-kettle-cloud', label: 'a thick grey cloud' }, [
    piece(ellipse(340, 260, 330, 110), '#8f8d92', { rough: 1.3 }),
    ...puffs,
    piece(ellipse(340, 250, 310, 96), '#b7b3ae', { shadow: false, rough: 1.2 }),
    swirl(220, 200, 46),
    swirl(470, 170, 54),
    swirl(350, 280, 38),
  ]);
});

/** Andika lettering in chalk. */
const chalk = (x: number, y: number, s: string, size: number): Node =>
  raw(`<text x="${x}" y="${y}" font-family="Andika, sans-serif" font-weight="700" font-size="${size}" fill="${C.chalk}" text-anchor="middle">${s}</text>`);

/** Dame Snap's tall desk (240 × 220), with a little slate on the front: NO WHISTLING. */
const snapDesk = cached(() =>
  svg({ w: 240, h: 220, name: 'whistling-kettle-desk', label: 'Dame Snap’s desk' }, [
    piece(rect(22, 180, 20, 40), C.barkDark, { edge: 'cut' }),
    piece(rect(198, 180, 20, 40), C.barkDark, { edge: 'cut' }),
    piece(rect(14, 40, 212, 150, 4), C.barkDark),
    piece(rect(26, 52, 188, 126, 3), C.bark, { edge: 'cut', fibre: false }),
    piece(rect(0, 18, 240, 26, 5), C.brownDark),
    // The slate.
    piece(rect(52, 72, 136, 86, 4), C.wood, { edge: 'cut' }),
    piece(rect(60, 80, 120, 70, 2), C.blackboard, { edge: 'cut', fibre: false }),
    chalk(120, 110, 'NO', 26),
    chalk(120, 138, 'WHISTLING', 18),
    ink([[70, 145], [170, 145]], { width: 3, color: C.ruler, wobble: 1 }),
  ]),
);

/** A low round tea table (300 × 130) for Moon-Face's room. */
const teaTable = cached(() =>
  svg({ w: 300, h: 130, name: 'whistling-kettle-table' }, [
    piece(rect(40, 40, 18, 86, 3), C.barkDark, { edge: 'cut' }),
    piece(rect(242, 40, 18, 86, 3), C.barkDark, { edge: 'cut' }),
    piece(rect(140, 50, 20, 76, 3), C.bark, { edge: 'cut' }),
    piece(ellipse(150, 44, 146, 18), C.brownDark, { shadow: false }),
    piece(ellipse(150, 34, 146, 24), C.wood),
    piece(ellipse(150, 32, 120, 16), C.cream, { edge: 'cut', fibre: false, opacity: 0.85 }),
  ]),
);

/** Her window going dark once she has left it (covers the lit window in snap-school). */
const darkPane = cached(() => svg({ w: 40, h: 72, name: 'whistling-kettle-pane' }, [piece(rect(4, 4, 32, 64, 14), '#2c2a31', { edge: 'cut', fibre: false, shadow: false })]));

// ---------------------------------------------------------------- sounds

/** The kettle's whistle: a breathy note sliding up. Quiet (`loud` < 1) when it is far away. */
function whistle(seconds = 1.2, loud = 1): void {
  const t = now();
  tone(NOTE.E5, t, { wave: 'sine', peak: 0.08 * loud, attack: 0.3, decay: seconds, glideTo: NOTE.B5, vibrato: [6, 10] });
  tone(NOTE.E6, t, { wave: 'sine', peak: 0.02 * loud, attack: 0.3, decay: seconds, glideTo: NOTE.B5 * 2, vibrato: [6, 18] });
  noiseBurst(t, { freq: 3400, q: 6, peak: 0.035 * loud, attack: 0.25, decay: seconds });
}

/** The kettle whistling its jolly tune (about 2.6 s): each note a breathy whistle that slides into place. */
function whistleTune(loud = 1): void {
  const t = now();
  const notes: [number, number, number][] = [
    [NOTE.G5, 0, 0.18], [NOTE.C6, 0.22, 0.18], [NOTE.E6, 0.44, 0.18], [NOTE.G6, 0.66, 0.4],
    [NOTE.E6, 1.12, 0.16], [NOTE.G6, 1.32, 0.16], [NOTE.E6, 1.52, 0.16], [NOTE.D6, 1.72, 0.16], [NOTE.C6, 1.94, 0.6],
  ];
  for (const [f, dt, d] of notes) {
    tone(f * 0.96, t + dt, { wave: 'sine', peak: 0.08 * loud, attack: 0.03, decay: d, glideTo: f, vibrato: [6, 9] });
    noiseBurst(t + dt, { freq: f * 2, q: 7, peak: 0.018 * loud, attack: 0.02, decay: d });
  }
}

/** Steam puffing out of the spout: a soft hiss. */
function hiss(seconds = 0.8): void {
  noiseBurst(now(), { freq: 5200, q: 0.8, peak: 0.035, attack: 0.08, decay: seconds, type: 'highpass' });
}

/** Pots and pans clanking, one clank per step. */
function clank(steps = 1, gap = 0.2): void {
  const t = now();
  const r = rng(steps * 31);
  for (let i = 0; i < steps; i++) {
    const at = t + i * gap;
    const f = 520 + r() * 400;
    tone(f, at, { wave: 'triangle', peak: 0.07, attack: 0.002, decay: 0.25 });
    tone(f * 2.76, at, { peak: 0.04, attack: 0.002, decay: 0.15 });
    noiseBurst(at, { freq: 4200, q: 3, peak: 0.05, decay: 0.05 });
  }
}

/** The kettle's lid tapped: one bright little ting. */
function ting(): void {
  bell(NOTE.E6, now(), 0.1, 0.8);
}

/** A pop biscuit going pop (`i` lifts the pitch). */
function popBiscuit(i = 0): void {
  const t = now();
  tone(620 + i * 90, t, { wave: 'triangle', peak: 0.09, attack: 0.004, decay: 0.12, glideTo: 1500 + i * 120 });
  noiseBurst(t, { freq: 3000, q: 2, peak: 0.04, decay: 0.04 });
}

/** Fairy wings: a soft, quick whirr. */
function whirr(times = 6): void {
  const t = now();
  for (let i = 0; i < times; i++) noiseBurst(t + i * 0.07, { freq: 1800, q: 1.5, peak: 0.025, attack: 0.01, decay: 0.05, sweepTo: 2600 });
}

/** The grey cloud blown away: a big soft whoosh with a sprinkle of bells. */
function blowAway(): void {
  const t = now();
  noiseBurst(t, { freq: 400, q: 0.7, peak: 0.1, attack: 0.15, decay: 1.2, sweepTo: 2600 });
  noiseBurst(t + 0.2, { freq: 2400, q: 0.8, peak: 0.05, attack: 0.1, decay: 1, sweepTo: 600 });
  [NOTE.C6, NOTE.E6, NOTE.G6].forEach((f, i) => bell(f, t + 0.5 + i * 0.12, 0.05, 0.9));
}

/** Dame Snap's terrible clacking heels: sharp, hollow clicks, `steps` of them. */
function heels(steps = 4, gap = 0.34, loud = 1): void {
  const t = now();
  for (let i = 0; i < steps; i++) {
    const at = t + i * gap;
    noiseBurst(at, { freq: 3200 + (i % 2) * 400, q: 5, peak: 0.1 * loud, decay: 0.03 });
    tone(1500 + (i % 2) * 120, at, { wave: 'triangle', peak: 0.05 * loud, attack: 0.002, decay: 0.05, glideTo: 900 });
    tone(220, at, { peak: 0.06 * loud, attack: 0.002, decay: 0.06, glideTo: 140 });
  }
}

/** Her ruler smacked down on the desk: a crack and a wooden thwack. */
function smack(): void {
  const t = now();
  noiseBurst(t, { freq: 2600, q: 0.7, peak: 0.2, attack: 0.002, decay: 0.07, type: 'highpass' });
  tone(420, t, { wave: 'square', peak: 0.06, attack: 0.002, decay: 0.09, glideTo: 160, lowpass: 1600 });
  tone(140, t, { peak: 0.14, attack: 0.002, decay: 0.12, glideTo: 70 });
}

/** Her ruler snapping in two: a dry crackle, then the split, then a silly falling "boing". */
function snapRuler(): void {
  const t = now();
  const r = rng(17);
  for (let i = 0; i < 6; i++) noiseBurst(t + i * 0.03 + r() * 0.02, { freq: 2000 + r() * 2500, q: 3, peak: 0.07, decay: 0.025 });
  noiseBurst(t + 0.22, { freq: 1600, q: 0.8, peak: 0.15, decay: 0.12, sweepTo: 600 });
  tone(300, t + 0.22, { wave: 'triangle', peak: 0.06, decay: 0.15, glideTo: 120 });
  tone(NOTE.G4, t + 0.5, { wave: 'triangle', peak: 0.06, attack: 0.01, decay: 0.5, glideTo: NOTE.C3, vibrato: [12, 20] });
}

/** A door slammed somewhere inside the school (not on anyone). */
function slam(): void {
  const t = now();
  tone(90, t, { peak: 0.24, decay: 0.28, glideTo: 45 });
  noiseBurst(t, { freq: 500, type: 'lowpass', peak: 0.18, decay: 0.22 });
  noiseBurst(t + 0.02, { freq: 2200, q: 1, peak: 0.05, decay: 0.08 });
}

/** Tea pouring: a little rising trickle. */
function pour(): void {
  const t = now();
  for (let i = 0; i < 8; i++) noiseBurst(t + i * 0.09, { freq: 900 + i * 140, q: 3, peak: 0.035, attack: 0.02, decay: 0.1 });
}

/** Bees! A short, silly buzz (the Saucepan Man's mishearing). */
function buzz(): void {
  const t = now();
  tone(220, t, { wave: 'sawtooth', peak: 0.035, attack: 0.05, decay: 0.9, vibrato: [18, 30], lowpass: 900, glideTo: 260 });
  tone(330, t + 0.1, { wave: 'sawtooth', peak: 0.02, attack: 0.05, decay: 0.7, vibrato: [22, 30], lowpass: 900 });
}

/** Everyone laughing: a warm, bouncing "ho-ho-ho" under the giggles. */
function laugh(): void {
  const t = now();
  [196, 185, 175, 165].forEach((f, i) => tone(f, t + i * 0.2, { wave: 'triangle', peak: 0.09, attack: 0.02, decay: 0.14, glideTo: f * 0.85, lowpass: 900 }));
  [NOTE.E5, NOTE.G5, NOTE.E5, NOTE.A5].forEach((f, i) => tone(f, t + 0.1 + i * 0.17, { wave: 'sine', peak: 0.04, attack: 0.01, decay: 0.1, glideTo: f * 1.1 }));
}

// ------------------------------------------------------------------ cast

const cast = {} as Record<'mf' | 'silky' | 'pan' | 'snap' | 'kettle' | 'tin' | 'cloud' | 'far' | 'pane' | 'lamp' | 'front', HTMLElement>;

/** Where the kettle stands in each scene that has it (so steam and taps line up). */
const KETTLE_DESK = { x: 500, y: 340, w: 140 };
const KETTLE_TABLE = { x: 410, y: 446, w: 150 };

export default defineCartoon({
  ...meta,
  lines: {
    // 1. Tea time
    hello: { who: 'moonface', text: 'Hello, {name}! It’s tea time!' },
    biscuits: { who: 'silky', text: 'I’ve baked pop biscuits! They go pop in your mouth.' },
    gone: { who: 'saucepan', text: 'Oh dear, oh dear! My whistling kettle! It’s GONE!' },
    where: { who: 'silky', text: 'Gone? Where did you leave it?' },
    sleeve: { who: 'saucepan', text: 'Eh? Up my SLEEVE? No, I’ve looked up there!' },
    louder: { who: 'moonface', text: 'Not your sleeve! Where did you LEAVE it?' },
    branch: { who: 'saucepan', text: 'Oh! On the top branch. Tap its lid, and it whistles a tune!' },
    listen: { who: 'silky', text: 'Listen! That’s your kettle. It’s up in the cloud!' },
    // 2. Above the cloud
    newLand: { who: 'moonface', text: 'A new land! But this cloud is too thick to see it.' },
    askCloud: { who: 'moonface', text: 'Can you blow the cloud away, {name}? Tap it!' },
    nudgeCloud: { who: 'moonface', text: 'Just tap the cloud. Whoosh!' },
    spellCloud: { who: 'silky', text: 'I’ll puff it away with a little spell.' },
    thanksCloud: { who: 'moonface', text: 'Whoosh! It’s gone! Thank you, {name}!' },
    snapSchool: { who: 'silky', text: 'Oh no. It’s Dame Snap’s School!' },
    myKettle: { who: 'saucepan', text: 'That’s my kettle! I’d know that whistle anywhere!' },
    quiet: { who: 'moonface', text: 'In we go. Quiet as mice, everyone.' },
    // 3. Dame Snap's School
    there: { who: 'saucepan', text: 'THERE IT IS! MY KETTLE!' },
    shh: { who: 'silky', text: 'Shh! Not so loud!' },
    clack: { who: 'narrator', text: 'Then, from inside the school… clack. Clack. CLACK.' },
    who: { who: 'dameSnap', text: 'WHO is shouting in MY school?' },
    whistled: { who: 'dameSnap', text: 'That kettle WHISTLED! NOBODY whistles in my school!' },
    whiskers: { who: 'saucepan', text: 'Eh? No WHISKERS? But I’ve got lovely whiskers!' },
    noFun: { who: 'dameSnap', text: 'NO whistling! NO kettles! And NO FUN!' },
    plan: { who: 'moonface', text: 'She hates whistling. Let’s give her a big one!' },
    askKettle: { who: 'moonface', text: 'Can you tap the kettle’s lid, {name}? Make it whistle!' },
    nudgeKettle: { who: 'moonface', text: 'Tap the little lid on top.' },
    tingKettle: { who: 'saucepan', text: 'I’ll tap it myself. Ting!' },
    stopIt: { who: 'dameSnap', text: 'STOP that WHISTLING!' },
    ruler: { who: 'dameSnap', text: 'My RULER! Oh, BOTHER and BOTHER!' },
    wellDone: { who: 'silky', text: 'You did it! What a whistle!' },
    whatAWhistle: { who: 'silky', text: 'What a whistle! She’s gone!' },
    oldFriend: { who: 'saucepan', text: 'My kettle! Hello, old friend!' },
    moving: { who: 'moonface', text: 'The land is moving on! Back to the ladder!' },
    // 4. Tea at last
    home: { who: 'moonface', text: 'Home safe, and just in time for tea!' },
    oneFor: { who: 'silky', text: 'Pop biscuits for everyone. And one for {name}!' },
    thankYou: { who: 'saucepan', text: 'Thank you, {name}! You saved my kettle!' },
    cupOfTea: { who: 'moonface', text: 'Who would like a cup of tea?' },
    bees: { who: 'saucepan', text: 'A cup of BEES? No thank you! They buzz!' },
    tea: { who: 'saucepan', text: 'Oh! TEA! Yes please!' },
    end: { who: 'narrator', text: 'And the kettle whistled all through tea.' },
  },
  scenes: [
    // ==================================================== 1. Tea time
    {
      name: 'Tea time',
      set(k) {
        k.backdrop('moon-room');
        k.music('cosy');
        k.light(590, 236, 200, { color: '#c9d4ff', strength: 0.18 });
        k.ambient('dust', { count: 14, area: [200, 120, 800, 420] });
        k.add(teaTable(), { x: 330, y: 545, w: 300, z: 12 });
        k.prop('teacup', { x: 352, y: 508, w: 74, z: 13 });
        k.prop('teacup', { x: 540, y: 508, w: 74, z: 13 });
        cast.tin = k.prop('biscuit-tin', { x: 430, y: 466, w: 110, z: 13 });
        cast.mf = k.character('moonface', { x: 620, y: 318, w: 260 });
        cast.silky = k.character('silky', { x: 880, y: 220, w: 210, z: 11 });
        cast.pan = k.character('saucepan', { x: 110, y: 330, w: 250, z: 11 });
        k.set([cast.silky, cast.pan, cast.tin], { opacity: 0 });
      },
      async play(k) {
        const { mf, silky, pan, tin } = cast;
        // Moon-Face beams.
        await k.wait(200);
        void beam(k, mf, true);
        void k.blink(mf);
        await k.all(k.say('hello', mf), k.wait(300).then(() => wave(k, mf)));
        void beam(k, mf, false);

        // Silky flutters down with a tin of pop biscuits.
        k.fx.twinkle();
        whirr(10);
        void flutter(k, silky, 8);
        await k.enter(silky, 'top', 1.2);
        k.sparkle(985, 330, 10, 120);
        k.fx.pop();
        await k.appear(tin, 0.4);
        await k.say('biscuits', silky);
        await popOut(k, 470, 470, 1);

        // Clank, clank, CLANK: up through the trapdoor comes the Saucepan Man.
        k.set(pan, { y: 330, opacity: 1 });
        for (let i = 0; i < 3; i++) {
          clank(2, 0.12);
          await k.to(pan, 0.38, { y: 330 - ((i + 1) * 330) / 3, ease: 'power1.out' });
          void rattle(k, pan);
        }
        clank(3, 0.09);
        await k.pop(pan, 1.05);

        // No kettle!
        k.fx.uhoh();
        void rattle(k, pan);
        await k.all(k.say('gone', pan), k.shake(pan, 6, 2));
        await k.say('where', silky);
        // He cups his ear, and gets it wrong.
        await earCup(k, pan, true);
        await k.say('sleeve', pan);
        void earCup(k, pan, false);
        await k.all(k.say('louder', mf), k.to(mf, 0.4, { x: -40 }));
        void k.to(mf, 0.4, { x: 0 });
        clank(2, 0.1);
        await k.hop(pan, 24);
        await k.say('branch', pan);

        // Far above: a thin whistle, then clack, clack.
        await k.wait(300);
        whistle(1.6, 0.35);
        await k.all(...[mf, silky, pan].map((el, i) => k.wait(i * 120).then(() => k.to(el, 0.4, { y: '-=14', rotation: i === 1 ? 4 : -4 }))));
        await k.wait(500);
        heels(2, 0.5, 0.3);
        await k.wait(800);
        await k.all(k.say('listen', silky), flutter(k, silky, 6));
        await k.all(...[mf, silky, pan].map((el) => k.to(el, 0.4, { y: '+=14', rotation: 0 })));
        await k.wait(300);
      },
    },

    // ==================================================== 2. Above the cloud
    {
      name: 'Above the cloud',
      set(k) {
        k.backdrop('cloud-top');
        k.music('magic');
        cast.far = k.prop('far-snap-school', { x: 290, y: 150, w: 600, z: 5 });
        cast.cloud = k.add(greyCloud(), { x: 240, y: 40, w: 700, z: 8 });
        cast.mf = k.character('moonface', { x: 200, y: 400, w: 240 });
        cast.silky = k.character('silky', { x: 480, y: 382, w: 210, z: 11 });
        cast.pan = k.character('saucepan', { x: 880, y: 404, w: 240, flip: true });
        cast.front = k.prop('cloud-front', { x: 0, y: 600, z: 22 });
        k.set(cast.far, { opacity: 0 });
        // Everyone starts down in the cloud, out of sight, and pops up.
        k.set([cast.mf, cast.silky, cast.pan], { y: 320 });
      },
      async play(k) {
        const { mf, silky, pan, cloud, far } = cast;
        k.fx.wind(2.5);
        await k.wait(300);
        k.fx.patter(4, 0.12);
        await k.to(mf, 0.7, { y: 0, ease: 'back.out(1.3)' });
        clank(3, 0.12);
        await k.to(pan, 0.7, { y: 0, ease: 'back.out(1.3)' });
        whirr(8);
        void flutter(k, silky, 6);
        await k.to(silky, 0.9, { y: 0, ease: 'back.out(1.2)' });
        // The grey cloud churns slowly, then settles.
        void k.to(cloud, 2.4, { scale: 1.03, rotation: 1, ease: 'sine.inOut' });
        await k.say('newLand', mf);
        await k.to(cloud, 0.6, { scale: 1, rotation: 0, ease: 'sine.inOut' });

        // His turn: blow the cloud away.
        const how = await k.tapToHelp(cloud, { ask: 'askCloud', nudge: 'nudgeCloud', helped: 'spellCloud', by: mf, helper: silky, size: 300 });
        if (how === 'helped') {
          k.fx.spell();
          await k.beam([590, 470], [590, 240], C.goldLight, 0.4);
        }
        blowAway();
        for (const [x, y] of [[380, 180], [590, 120], [800, 190], [470, 300], [710, 310]] as const) {
          k.puff(x, y, 200, '#c9c5bf');
          await k.wait(90);
        }
        await k.all(k.to(cloud, 1.1, { opacity: 0, scale: 1.25, y: -60, ease: 'power2.out' }), k.fade(far, 1, 1.2));
        k.sparkle(590, 240, 14, 260);
        if (how === 'tapped') await k.all(k.say('thanksCloud', mf), k.hop(mf, 30, 2));

        // It's Dame Snap's School.
        k.music('sneaky');
        const gloom = k.dim(0, '#1a1236');
        void k.fade(gloom, 0.18, 1.5);
        await k.camera({ zoom: 1.9, x: 590, y: 235 }, 1.4);
        await k.say('snapSchool', silky);
        await k.all(k.camera({}, 1), k.shake(silky, 4, 2), k.shake(pan, 4, 2));

        // From inside, the kettle's whistle, and a far-off CLACK.
        whistle(1.2, 0.5);
        k.sparkle(600, 250, 6, 60);
        await k.wait(1100);
        await k.all(k.say('myKettle', pan), rattle(k, pan));
        heels(1, 0.3, 0.45);
        await k.all(k.shake(mf, 4, 1), k.shake(silky, 4, 1), k.wait(500));
        await k.say('quiet', mf);
      },
    },

    // ==================================================== 3. Dame Snap's School
    {
      name: 'Dame Snap’s School',
      set(k) {
        k.backdrop('snap-school');
        k.music('sneaky');
        k.dim(0.12, '#1a1236');
        // No flicker: a flickering light's idle loop would fight the fade when she leaves the window.
        cast.lamp = k.light(690, 375, 56, { strength: 0.5 });
        cast.pane = k.add(darkPane(), { x: 672, y: 340, w: 38, z: 2 });
        k.add(snapDesk(), { x: 460, y: 445, w: 220, z: 12 });
        cast.kettle = k.prop('kettle', { ...KETTLE_DESK, z: 15 });
        cast.snap = k.character('dameSnap', { x: 770, y: 225, w: 380, z: 9, flip: true, pose: 'loom' });
        cast.mf = k.character('moonface', { x: 30, y: 372, w: 240 });
        cast.pan = k.character('saucepan', { x: 250, y: 392, w: 230, z: 11 });
        cast.silky = k.character('silky', { x: 140, y: 140, w: 190, z: 13 });
        k.set(cast.snap, { opacity: 0, y: 70 });
        k.set(cast.pane, { opacity: 0 });
        // The friends tiptoe in from the left.
        k.set([cast.mf, cast.pan, cast.silky], { x: -520 });
      },
      async play(k) {
        const { mf, pan, silky, kettle, snap, pane, lamp } = cast;
        k.fx.sneak();
        void flutter(k, silky, 9);
        await k.all(k.walk(mf, 520, 1.6, 6), k.walk(pan, 520, 1.6, 6), k.to(silky, 1.6, { x: 0, ease: 'sine.inOut' }));

        // He sees it, and SHOUTS.
        void k.camera({ zoom: 1.3, x: 560, y: 420 }, 0.8);
        clank(4, 0.08);
        k.sparkle(KETTLE_DESK.x + 70, 400, 8, 90);
        await k.all(k.say('there', pan), k.hop(pan, 40, 2));
        void k.camera({}, 0.8);
        await k.all(k.say('shh', silky), k.to(silky, 0.3, { x: 30 }));

        // Her window goes dark. Then clack… clack… CLACK.
        k.silence();
        await k.wait(400);
        await k.all(k.fade(pane, 1, 0.8), k.fade(lamp, 0, 0.8));
        const clacks = k.say('clack');
        await k.wait(1100);
        for (const loud of [0.45, 0.75, 1]) {
          heels(1, 0.3, loud);
          void k.shake(pan, 3, 1);
          await k.wait(620);
        }
        await clacks;
        k.music('spooky');
        k.fx.rumble(1.2);
        await k.all(k.to(snap, 1.3, { opacity: 1, y: 0, ease: 'power2.out' }), k.shake(mf, 5, 2), k.shake(silky, 4, 2));
        void k.camera({ zoom: 1.3, x: 910, y: 400 }, 1);
        k.pose(snap, 'default');
        await k.say('who', snap);

        // The ruler comes down on the desk: SMACK.
        const ruler = k.pivot(k.part(snap, 'ruler'));
        await k.to(ruler, 0.18, { rotation: 50, ease: 'power3.in' });
        smack();
        void k.quake(5);
        void k.shake(kettle, 4, 1);
        void k.all(k.shake(mf, 5, 1), k.shake(pan, 5, 1));
        await k.to(ruler, 0.4, { rotation: 0, ease: 'power2.out' });
        await k.say('whistled', snap);

        // Back to the heroes: he's got it wrong again.
        await k.camera({}, 0.8);
        await earCup(k, pan, true);
        await k.say('whiskers', pan);
        void earCup(k, pan, false);

        // She shrieks and stomps.
        k.pose(snap, 'shriek');
        void k.shake(snap, 5, 2);
        await k.say('noFun', snap);
        k.pose(snap, 'stomp');
        k.fx.stomp(2, 0.4);
        void k.quake(6);
        await k.all(k.to(snap, 0.2, { y: -14, yoyo: true, repeat: 3, ease: 'power1.inOut' }), k.wait(900));
        k.pose(snap, 'default');

        // A plan.
        await k.camera({ zoom: 1.2, x: 300, y: 400 }, 0.9);
        void beam(k, mf, true);
        await k.all(k.say('plan', mf), k.hop(mf, 24, 1));
        void beam(k, mf, false);
        await k.camera({}, 0.8);

        // His big turn: tap the kettle's lid.
        const how = await k.tapToHelp(kettle, { ask: 'askKettle', nudge: 'nudgeKettle', helped: 'tingKettle', by: mf, helper: pan });
        ting();
        const first = whistleKettle(k, kettle, KETTLE_DESK, 1);
        await k.wait(900);
        k.pose(snap, 'stomp');
        await k.shake(snap, 6, 2);
        await first;
        k.pose(snap, 'default');
        await k.say('stopIt', snap);
        // Again, louder: she stomps and stomps, and SNAP goes her own ruler.
        void whistleKettle(k, kettle, KETTLE_DESK, 1.2);
        k.pose(snap, 'stomp');
        k.fx.stomp(3, 0.35);
        void k.quake(6);
        await k.to(snap, 0.18, { y: -16, yoyo: true, repeat: 5, ease: 'power1.inOut' });
        snapRuler();
        k.pose(snap, 'defeated');
        k.puff(930, 420, 160, C.stoneLight);
        await k.camera({ zoom: 1.25, x: 910, y: 420 }, 0.7);
        await k.say('ruler', snap);
        await k.camera({}, 0.7);
        // Off she stomps, in a huff. A door slams somewhere inside.
        heels(6, 0.26);
        await k.exit(snap, 'right', 1.6);
        await k.wait(200);
        slam();
        void k.quake(4);
        k.music('triumph');
        k.sparkle(590, 300, 16, 220);
        await k.all(k.say(how === 'tapped' ? 'wellDone' : 'whatAWhistle', silky), k.hop(mf, 30, 2), flutter(k, silky, 6));

        // The kettle hops home to the Saucepan Man.
        k.fx.whizz();
        await k.to(kettle, 0.8, { x: 300 - KETTLE_DESK.x, y: 556 - KETTLE_DESK.y, rotation: -360, ease: 'power1.inOut' });
        clank(3, 0.1);
        await k.all(k.say('oldFriend', pan), k.shake(pan, 4, 2), k.shake(kettle, 4, 2));

        // The ground rumbles: the land is moving on.
        k.music('adventure');
        k.fx.rumble(2.5);
        void k.quake(6);
        await k.all(k.say('moving', mf), k.shake(mf, 5, 2));
        k.fx.whizz();
        await k.all(k.exit(mf, 'left', 0.6), k.exit(silky, 'left', 0.7), k.exit(pan, 'left', 0.8), k.to(kettle, 0.8, { x: '-=820', ease: 'power2.in' }));
      },
    },

    // ==================================================== 4. Tea at last
    {
      name: 'Tea at last',
      set(k) {
        k.backdrop('moon-room');
        k.music('cosy');
        k.light(590, 236, 210, { color: '#c9d4ff', strength: 0.2 });
        k.light(470, 520, 170, { strength: 0.3, flicker: true });
        k.ambient('dust', { count: 14, area: [200, 120, 800, 420] });
        k.add(teaTable(), { x: 330, y: 545, w: 300, z: 12 });
        k.prop('teacup', { x: 342, y: 508, w: 74, z: 13 });
        k.prop('teacup', { x: 560, y: 508, w: 74, z: 13 });
        cast.kettle = k.prop('kettle', { ...KETTLE_TABLE, z: 13 });
        cast.mf = k.character('moonface', { x: 640, y: 318, w: 260 });
        cast.silky = k.character('silky', { x: 890, y: 230, w: 210, z: 11 });
        cast.pan = k.character('saucepan', { x: 100, y: 334, w: 250, z: 11 });
      },
      async play(k) {
        const { mf, silky, pan, kettle } = cast;
        await k.wait(500);
        await whistleKettle(k, kettle, KETTLE_TABLE, 0.5, false);
        void beam(k, mf, true);
        await k.all(k.say('home', mf), k.hop(mf, 20, 1));
        void beam(k, mf, false);
        pour();
        await k.wait(700);
        whirr(6);
        await k.all(k.say('oneFor', silky), flutter(k, silky, 6));

        // A pop biscuit for him: it flies out towards the screen and pops.
        // (down past the cushions first, then along the front, so it never crosses a face)
        const bis = k.prop('pop-biscuit', { x: 950, y: 400, w: 80, z: 40 });
        k.set(bis, { opacity: 0 });
        await k.appear(bis, 0.3);
        k.fx.whizz();
        await k.to(bis, 0.35, { y: 190, rotation: 120, ease: 'power1.in' });
        await k.to(bis, 0.6, { x: -280, y: 230, scale: 2.2, rotation: 360, ease: 'power1.out' });
        popBiscuit(2);
        k.sparkle(710, 670, 14, 160);
        await k.vanish(bis, 0.25);

        clank(3, 0.1);
        await k.all(k.say('thankYou', pan), k.hop(pan, 30, 2));
        await k.say('cupOfTea', mf);
        await earCup(k, pan, true);
        buzz();
        await k.all(k.say('bees', pan), k.shake(pan, 5, 2));
        void earCup(k, pan, false);
        // Everyone laughs, and the penny drops.
        laugh();
        await k.all(k.shake(mf, 4, 3), k.shake(silky, 3, 3));
        clank(2, 0.1);
        await k.all(k.say('tea', pan), k.hop(pan, 36, 1));

        // The kettle whistles its tune, and everyone bounces along.
        k.music('triumph');
        void whistleKettle(k, kettle, KETTLE_TABLE, 1);
        void beam(k, mf, true);
        await k.all(...[pan, mf, silky].map((el, i) => k.wait(i * 220).then(() => k.hop(el, 30, 3))));
        k.sparkle(590, 300, 18, 300);
        k.fx.twinkle();
        await k.wait(400);
        await k.say('end');
        await k.wait(1200);
      },
    },
  ],
});

// ----------------------------------------------------------------- moves

/** Moon-Face's shine brightens (or settles back). */
async function beam(k: Kit, mf: HTMLElement, on: boolean): Promise<void> {
  const glow = k.pivot(k.part(mf, 'glow'));
  await k.to(glow, 0.5, { scale: on ? 1.15 : 1, opacity: on ? 1 : 0.85, ease: 'sine.inOut' });
}

/** Moon-Face's wave (his right arm). */
async function wave(k: Kit, el: HTMLElement): Promise<void> {
  const arm = k.pivot(k.part(el, 'armR'));
  for (let i = 0; i < 2; i++) {
    await k.to(arm, 0.2, { rotation: -16 });
    await k.to(arm, 0.2, { rotation: 6 });
  }
  await k.to(arm, 0.2, { rotation: 0 });
}

/** Silky's wings flutter, `times` beats. */
async function flutter(k: Kit, el: HTMLElement, times = 4): Promise<void> {
  const wings = k.pivot([...k.part(el, 'wingL'), ...k.part(el, 'wingR')]);
  if (!wings.length) return;
  for (let i = 0; i < times; i++) {
    await k.to(wings, 0.09, { scaleX: 0.72, ease: 'sine.inOut' });
    await k.to(wings, 0.09, { scaleX: 1, ease: 'sine.inOut' });
  }
}

/** Rattles the Saucepan Man's pots. */
async function rattle(k: Kit, el: HTMLElement): Promise<void> {
  const pots = k.part(el, 'pots');
  for (const dx of [5, -5, 3, 0]) await k.to(pots, 0.06, { x: dx, rotation: dx * 0.6, ease: 'none' });
}

/** The Saucepan Man cups his ear ("Eh?"), or lowers his hand again. */
async function earCup(k: Kit, el: HTMLElement, on: boolean): Promise<void> {
  const arm = k.pivot(k.part(el, 'armR'));
  await k.all(k.to(arm, 0.3, { rotation: on ? -10 : 0 }), k.to(el, 0.3, { rotation: on ? 4 : 0 }));
}

/** Pop biscuits hopping out of the tin and popping, `n` of them. */
async function popOut(k: Kit, x: number, y: number, n: number): Promise<void> {
  for (let i = 0; i < n; i++) {
    const b = k.prop('pop-biscuit', { x: x - 30, y: y - 30, w: 60, z: 30 });
    k.set(b, { opacity: 0 });
    await k.appear(b, 0.2);
    await k.to(b, 0.35, { y: -70 - i * 20, x: (i ? 30 : -30), rotation: 180, ease: 'power2.out' });
    popBiscuit(i);
    k.sparkle(x + (i ? 30 : -30), y - 70 - i * 20, 8, 70);
    await k.vanish(b, 0.15);
  }
}

/**
 * The kettle whistles: its lid bobs, steam puffs from the spout, and it
 * jiggles. `loud` 1 plays the whole jolly tune; `tune` false is one short
 * whistle (just boiled).
 */
async function whistleKettle(k: Kit, kettle: HTMLElement, at: { x: number; y: number; w: number }, loud: number, tune = true): Promise<void> {
  // The spout's tip (the art is 180 wide, the whistle at 18, 46).
  const s = at.w / 180;
  const [x, y] = [at.x + 18 * s, at.y + 46 * s];
  const lid = k.pivot(k.part(kettle, 'lid'));
  if (tune) whistleTune(loud);
  else whistle(1, loud);
  hiss(tune ? 2.2 : 0.9);
  const puffs = tune ? 5 : 2;
  const lidBobs = k.to(lid, 0.12, { y: -8, rotation: -6, yoyo: true, repeat: tune ? 17 : 5, ease: 'sine.inOut' });
  const jiggle = k.to(kettle, 0.1, { rotation: '+=3', yoyo: true, repeat: tune ? 21 : 7, ease: 'sine.inOut' });
  for (let i = 0; i < puffs; i++) {
    k.puff(x - 20 - i * 6, y - 30 - i * 10, 110 + i * 16, C.white);
    await k.wait(420);
  }
  await k.all(lidBobs, jiggle);
  k.set(lid, { y: 0, rotation: 0 });
}
