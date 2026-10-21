/**
 * The Whistling Kettle: the Saucepan Man's kettle has gone, and Dame Snap
 * has it.
 *
 *   1. Tea time. Moon-Face's round room, the cups out on the table and no
 *      kettle. Silky flutters down with a tin of pop biscuits (his turn: he taps the
 *      tin and they pop out); the Saucepan Man
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
 *      off and slams a door. His turn: he drags the kettle home to the
 *      Saucepan Man, who hugs it, and the land starts to move on: back to
 *      the ladder.
 *   4. Tea at last. Home in Moon-Face's room, the kettle steaming on the
 *      table. Pop biscuits, thank-yous, one more mishearing ("A cup of
 *      BEES?"), and the kettle whistles its tune. His turn: he drags a pop
 *      biscuit across the table to Moon-Face.
 *
 * Scary, never cruel (docs/STYLE.md): she looms, shouts, smacks the desk
 * and stomps; nobody is touched. Her defeat is her own temper: she stomps
 * until her ruler snaps, and goes off in a huff. The kettle's tap-the-lid
 * whistle is set up in scene 1 so the big turn pays it off.
 *
 * The kettle, the cloud-top place and the land's far view are in the
 * world (src/worlds/faraway/cloudtop.ts), and the grey cloud and the tea
 * table are in its set pieces (src/worlds/faraway/pieces.ts); her desk and
 * her window going dark are drawn here.
 */
import { C, cached, defineCartoon, ink, piece, raw, rect, svg, type Node } from '../../kit';
import { moves as commonMoves, sounds as commonSounds } from '../../worlds/common/moves';
import { noiseOff, sneakIn, warmEnding } from '../../worlds/common/pieces';
import { moves as farawayMoves, sounds as farawaySounds } from '../../worlds/faraway/moves';
import { greyCloud, ladderArrival, landMovesOn, snapDefeat, snapLoom, teaTime, trapdoorArrival } from '../../worlds/faraway/pieces';
import meta from './meta';

// The sounds and moves are the worlds' own (src/worlds/faraway/moves.ts and
// common/moves.ts), and the recurring bits of staging are the worlds' set
// pieces (src/worlds/*/pieces.ts): the tea-time room, the climb up through
// the cloud, Dame Snap's looming and her defeat, "the land is moving on",
// the warm ending. What is left here is this episode's own: its lines, its
// jokes, the desk and the window, and his five turns.
const { clank, heels, popBiscuit, whirr, whistle } = farawaySounds;
const { buzz, laugh, pour, ting } = commonSounds;
const { beam, earCup, flutter, popOut, rattle, whistleKettle } = farawayMoves;
const { wave } = commonMoves;

// ------------------------------------------------------------------- art

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

/** Her window going dark once she has left it (covers the lit window in snap-school). */
const darkPane = cached(() => svg({ w: 40, h: 72, name: 'whistling-kettle-pane' }, [piece(rect(4, 4, 32, 64, 14), '#2c2a31', { edge: 'cut', fibre: false, shadow: false })]));

// ------------------------------------------------------------------ cast

const cast = {} as Record<'mf' | 'silky' | 'pan' | 'snap' | 'kettle' | 'tin' | 'pane' | 'lamp', HTMLElement>;
/** The top of the ladder in scene 2: the grey cloud, the land behind it and everyone climbing up. */
let climb: ReturnType<typeof ladderArrival.set>;

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
    askTin: { who: 'silky', text: 'Tap the tin, and watch them pop!' },
    nudgeTin: { who: 'silky', text: 'Just tap the tin.' },
    silkyTin: { who: 'silky', text: 'I’ll pop the lid off myself.' },
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
    askHome: { who: 'moonface', text: 'Can you drag the kettle home to the Saucepan Man, {name}?' },
    nudgeHome: { who: 'moonface', text: 'Drag the kettle over to him.' },
    panHome: { who: 'saucepan', text: 'I’ll fetch it myself. Come here, old friend!' },
    wellDone: { who: 'silky', text: 'You did it! What a whistle!' },
    whatAWhistle: { who: 'silky', text: 'What a whistle! She’s gone!' },
    oldFriend: { who: 'saucepan', text: 'My kettle! Hello, old friend!' },
    moving: { who: 'moonface', text: 'The land is moving on! Back to the ladder!' },
    // 4. Tea at last
    home: { who: 'moonface', text: 'Home safe, and just in time for tea!' },
    askBis: { who: 'saucepan', text: 'I saved this one for Moon-Face. Can you drag it to him, {name}?' },
    nudgeBis: { who: 'saucepan', text: 'Drag the biscuit over to Moon-Face.' },
    helpedBis: { who: 'saucepan', text: 'I’ll carry it over myself. Clank, clank!' },
    thanksBis: { who: 'moonface', text: 'Pop! Yum! Thank you, {name}!' },
    thanksPan: { who: 'moonface', text: 'Pop! Yum! Thank you, Saucepan Man!' },
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
        // Moon-Face's round room laid for tea, with the tin of pop biscuits still to arrive.
        k.backdrop('moon-room');
        const room = teaTime.set(k, {
          guests: [{ id: 'moonface', x: 620, y: 318, w: 260 }, { id: 'silky', x: 880, y: 220, w: 210, z: 11 }, { id: 'saucepan', x: 110, y: 330, w: 250, z: 11 }],
          tableName: 'whistling-kettle-table',
        });
        [cast.mf, cast.silky, cast.pan] = room.guests;
        cast.tin = room.centre;
        k.set(cast.silky, { opacity: 0 });
        trapdoorArrival.set(k, cast.pan);
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
        // His turn: tap the tin and the biscuits pop out.
        await k.tapToHelp(tin, { ask: 'askTin', nudge: 'nudgeTin', helped: 'silkyTin', by: silky, helper: silky, size: 170 });
        await popOut(k, 470, 470, 1);

        // Clank, clank, CLANK: up through the trapdoor comes the Saucepan Man.
        await trapdoorArrival.play(k, pan);

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
        await noiseOff(k, { listeners: [mf, silky, pan], sound: () => whistle(1.6, 0.35), then: () => heels(2, 0.5, 0.3), line: 'listen', by: silky, during: () => flutter(k, silky, 6) });
      },
    },

    // ==================================================== 2. Above the cloud
    {
      name: 'Above the cloud',
      set(k) {
        // The top of the ladder: the new land hidden in the sky behind a thick grey cloud, everyone still down in the cloud.
        k.backdrop('cloud-top');
        climb = ladderArrival.set(k, {
          land: 'snap-school',
          cover: greyCloud('whistling-kettle-cloud'),
          friends: [{ id: 'moonface', x: 200, y: 400, w: 240 }, { id: 'saucepan', x: 880, y: 404, w: 240, flip: true }, { id: 'silky', x: 480, y: 382, w: 210, z: 11 }],
        });
        [cast.mf, cast.pan, cast.silky] = climb.friends;
      },
      async play(k) {
        const { mf, silky, pan } = cast;
        // Up through the cloud they pop, and the grey cloud churns slowly while Moon-Face says what it hides.
        await ladderArrival.play(k, climb, { line: 'newLand', by: mf });

        // His turn: blow the cloud away.
        const how = await k.tapToHelp(climb.cover!, { ask: 'askCloud', nudge: 'nudgeCloud', helped: 'spellCloud', by: mf, helper: silky, size: 300 });
        await ladderArrival.reveal(k, climb, { how, thanks: 'thanksCloud', by: mf });

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
        sneakIn.set(k, [cast.mf, cast.pan, cast.silky]);
      },
      async play(k) {
        const { mf, pan, silky, kettle, snap, pane, lamp } = cast;
        void flutter(k, silky, 9);
        await sneakIn.play(k, { walkers: [mf, pan], gliders: [silky] });

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
        // Clack… clack… CLACK, then she looms in, smacks her ruler on the desk, and it cuts back to the heroes.
        await snapLoom.approach(k, { line: 'clack', trembling: [pan] });
        await snapLoom.loom(k, snap, {
          lines: ['who', 'whistled'],
          frighten: [mf, silky],
          onSmack: () => {
            void k.shake(kettle, 4, 1);
            void k.all(k.shake(mf, 5, 1), k.shake(pan, 5, 1));
          },
        });

        // Back to the heroes: he's got it wrong again.
        await snapLoom.cutBack(k, { line: 'whiskers', by: pan, before: () => earCup(k, pan, true) });
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
        // Again, louder: she stomps and stomps, and SNAP goes her own ruler. Off she stomps, in a huff.
        void whistleKettle(k, kettle, KETTLE_DESK, 1.2);
        await snapDefeat(k, snap, { line: 'ruler' });
        k.music('triumph');
        k.sparkle(590, 300, 16, 220);
        await k.all(k.say(how === 'tapped' ? 'wellDone' : 'whatAWhistle', silky), k.hop(mf, 30, 2), flutter(k, silky, 6));

        // His turn: drag the kettle home to the Saucepan Man (it settles at his middle, in his arms).
        await k.dragToHelp(kettle, { to: [370, 630], ask: 'askHome', nudge: 'nudgeHome', helped: 'panHome', by: mf, helper: pan });
        clank(3, 0.1);
        await k.all(k.say('oldFriend', pan), k.shake(pan, 4, 2), k.shake(kettle, 4, 2));

        // The ground rumbles: the land is moving on. Back to the ladder!
        await landMovesOn(k, { friends: [mf, silky, pan], by: mf, line: 'moving', carrying: [kettle] });
      },
    },

    // ==================================================== 4. Tea at last
    {
      name: 'Tea at last',
      set(k) {
        // The same round room, the kettle steaming on the table, and a candle burning low over it.
        k.backdrop('moon-room');
        const room = teaTime.set(k, {
          guests: [{ id: 'moonface', x: 640, y: 318, w: 260 }, { id: 'silky', x: 890, y: 230, w: 210, z: 11 }, { id: 'saucepan', x: 100, y: 334, w: 250, z: 11 }],
          centre: { id: 'kettle', ...KETTLE_TABLE },
          cups: [[342, 508], [560, 508]],
          candle: true,
          tableName: 'whistling-kettle-table',
        });
        [cast.mf, cast.silky, cast.pan] = room.guests;
        cast.kettle = room.centre;
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

        // His turn: drag a pop biscuit across the table to Moon-Face.
        const treat = k.prop('pop-biscuit', { x: 300, y: 400, w: 100, z: 14 });
        k.set(treat, { opacity: 0 });
        await k.appear(treat, 0.3);
        const gave = await k.dragToHelp(treat, { to: mf, ask: 'askBis', nudge: 'nudgeBis', helped: 'helpedBis', by: pan, helper: pan });
        popBiscuit(1);
        k.sparkle(770, 450, 10, 100);
        await k.vanish(treat, 0.2);
        await k.all(k.say(gave === 'dragged' ? 'thanksBis' : 'thanksPan', mf), k.hop(mf, 24, 1));

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
        void whistleKettle(k, kettle, KETTLE_TABLE, 1);
        void beam(k, mf, true);
        await warmEnding(k, { cast: [pan, mf, silky], end: 'end' });
      },
    },
  ],
});
