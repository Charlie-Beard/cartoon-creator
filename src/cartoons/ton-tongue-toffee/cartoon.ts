/**
 * Ton-Tongue Toffee: the Weasleys come to fetch Harry for the Quidditch World
 * Cup, but the Dursleys have boarded up the fireplace, and the Weasleys'
 * only way is by fireplace. A scene from the book, with a twist: the toffee
 * Fred and George "drop" gives Dudley (who is on a diet) a very long tongue.
 *
 *   1. Grapefruit for breakfast. Dudley is on a diet, so everybody at Number
 *      Four is, and Dudley stares at his tiny quarter of grapefruit: "Is THAT
 *      it?" A letter covered all over in stamps arrives. It is from Mrs
 *      Weasley: they'll fetch Harry on Sunday at five o'clock. Mr Dursley:
 *      not in funny cloaks! Mrs Dursley: not a word to the neighbours!
 *      Hedwig swoops in, and Harry gives her his reply (a deed: he carries
 *      the letter to her) and she flies off with it. Dudley: "Mum, I'm STILL
 *      hungry."
 *   2. Five o'clock. On Sunday the Dursleys wait stiffly by the window, in
 *      their best clothes. The clock chimes five. They're late! How are they
 *      coming? Then, in the quiet: thump… thump… from inside the boarded-up
 *      fireplace, and muffled voices: "Ouch! Dad, it's blocked!" Harry steps
 *      the Dursleys back (a small deed) and BANG! the boards and the
 *      electric fire burst out in a puff of soot, and out tumble Mr Weasley,
 *      Ron, Fred and George, sooty and coughing. The Dursleys run off. The
 *      boys wander off to look at the Dursleys' sofa and telly. Mr Dursley
 *      creeps back; Mr Weasley beams: "You must be Harry's aunt and uncle!"
 *      He flicks his wand at the fireplace and the boards hop back
 *      ("Easily mended!"). "Is this a PLUG? I collect plugs!" Ron: where's
 *      your trunk? Harry fetches it from upstairs (a deed: he carries it).
 *      As Fred bends to help, toffees spill out of his pocket.
 *   3. The toffee. "Oops. Dropped our toffees." Dudley looks round, nobody's
 *      watching, and gobbles one. "Wait for it…" Bwoing! His tongue rolls out,
 *      long and purple. Mrs Dursley shrieks and rushes in; Mr Dursley goes
 *      purple too. Mr Weasley: "FRED! GEORGE!" The twins say it shrinks back
 *      when the toffee's gone. Harry gives Dudley a glass of water (the big
 *      deed): gulp, gulp, sproing! The tongue shrinks back. "Yuck. That
 *      wasn't even nice toffee." Mr Weasley lights a fire; Harry throws a pinch
 *      of Floo powder (a deed) and green flames whoosh up. "The Burrow!" and
 *      he is gone. Mr Weasley says a cheerful goodbye to Mr Dursley: silence.
 *      "I SAID goodbye!" And at last, very small: "…Goodbye." Whoosh.
 *   4. Supper at the Burrow. Harry whooshes out of the kitchen fire. Mrs
 *      Weasley: "What did you two do?" "Nothing, Mum!" Ron holds his arms
 *      wide: "Dudley's tongue went THIS long!" Everybody laughs. Supper: Mrs
 *      Weasley passes Harry a big slice of pie (a deed): "Pie! Real pie! Not
 *      grapefruit!" Tomorrow, the Quidditch World Cup: the best summer ever.
 *
 * One-off in this folder (art.ts, sounds.ts): the letter covered in stamps,
 * the breakfast table, the glass of water, the boards, hearth and electric fire
 * that burst out of the fireplace (they sit on top of the lounge backdrop's own
 * painted board and fire), the plug, the green Floo flames and a pinch of
 * powder, and the sounds (chimes, thumps, the toffee's bwoing, sproing, gulps).
 *
 * Safety choices: nobody is hurt. The scary beat is only thumps and muffled
 * voices in the chimney (sound first, music gone), and it is the Weasleys.
 * Mr Weasley flicks his wand at the fireplace and the boards only, never at a
 * person. Dudley's long tongue is silly, not frightening: he mumbles "Mmmph!"
 * and it shrinks back as soon as Harry gives him a drink. No pig's tail. The
 * soot is a grey wash that Mr Weasley and the boys dust off.
 *
 * Staging: the stage holds four people at most, so the Dursleys and the
 * Weasleys take turns (the Dursleys run off at the bang and creep back for
 * their lines). Mr Weasley's voice is cast as `mrWeasley`.
 */
import { defineCartoon, type Kit } from '../../kit';
import { sounds as commonSounds } from '../../worlds/common/moves';
import { moves as hogMoves } from '../../worlds/hogwarts/moves';
import { breakfastTable, boardLeft, boardRight, electricFire, glass, greenFlames, hearth, pinch, plug, stampedLetter } from './art';
import { bwoing, chime, flooWhoosh, gulp, munch, sproing, thump, whumph } from './sounds';
import meta from './meta';

const { laugh } = commonSounds;
const { castSpell, swoopIn, flyOff, hoot } = hogMoves;

type Id =
  | 'vernon' | 'petunia' | 'dudley' | 'harry' | 'hedwig' | 'letter' | 'reply'
  | 'mrW' | 'ron' | 'fred' | 'george' | 'mrsW'
  | 'hole' | 'boardL' | 'boardR' | 'fire' | 'plug' | 'trunk' | 'pile' | 'glass' | 'flames' | 'pot' | 'pie';
const cast = {} as Record<Id, HTMLElement>;

/** The grey wash of soot on a Weasley (a filter on the portrait) and its absence. */
const SOOT = 'grayscale(0.65) brightness(0.58)';
const CLEAN = 'grayscale(0) brightness(1)';

/** The middle of the hearth opening in the lounge backdrop (x 460–720, y 380–602). */
const HEARTH: [number, number] = [590, 491];

/** Mr Weasley's wand stays at his side: only the fireplace is ever aimed at. */
const FIRE_AIM: [number, number] = [600, 470];

/** Puts the boarded-up fireplace on top of the lounge backdrop's own: hole, two boards, the electric fire and its plug. */
function boardedFireplace<K extends string>(k: Kit<K>, boarded = true): void {
  cast.hole = k.add(hearth(), { x: 460, y: 380, w: 260, z: 3 });
  cast.boardL = k.add(boardLeft(), { x: 460, y: 380, w: 130, z: 4 });
  cast.boardR = k.add(boardRight(), { x: 590, y: 380, w: 130, z: 5 });
  cast.fire = k.add(electricFire(), { x: 486, y: 496, w: 208, z: 6 });
  cast.plug = k.add(plug(), { x: 660, y: 575, w: 70, z: 7 });
  k.set(cast.plug, { opacity: 0 });
  if (!boarded) k.set([cast.boardL, cast.boardR, cast.fire], { opacity: 0 });
}

/** Someone tumbles out of the fireplace, sooty, into their place. */
async function tumble<K extends string>(k: Kit<K>, el: HTMLElement): Promise<void> {
  const b = k.box(el);
  k.set(el, { x: HEARTH[0] - (b.x + b.w / 2), y: 70, scale: 0.45, rotation: -20, opacity: 1, filter: SOOT });
  k.fx.thud();
  k.puff(HEARTH[0], HEARTH[1] + 40, 190, '#4a4a52');
  await k.to(el, 0.55, { x: 0, y: 0, scale: 1, rotation: 0, ease: 'back.out(1.3)' });
}

/** A little cough: three quick shakes. */
function cough<K extends string>(k: Kit<K>, el: HTMLElement): Promise<void> {
  k.fx.pop();
  return k.shake(el, 4, 4);
}

/** The boards and the fire hop back into the fireplace, as if nothing happened. */
async function mend<K extends string>(k: Kit<K>): Promise<void> {
  k.fx.spell();
  k.sparkle(HEARTH[0], HEARTH[1], 18, 170);
  k.set([cast.boardL, cast.boardR, cast.fire], { opacity: 1, rotation: 0, scale: 1 });
  k.set(cast.boardL, { x: -500, y: -200 });
  k.set(cast.boardR, { x: 540, y: -200 });
  k.set(cast.fire, { x: 330, y: 60 });
  await k.all(
    k.to(cast.boardL, 0.6, { x: 0, y: 0, ease: 'back.out(1.6)' }),
    k.to(cast.boardR, 0.6, { x: 0, y: 0, ease: 'back.out(1.6)' }),
    k.to(cast.fire, 0.7, { x: 0, y: 0, ease: 'back.out(1.4)' }),
  );
  k.fx.thud();
}

/** The Floo fire in the lounge: the boards and the electric fire hop away, and a cosy orange fire shows. */
async function lightFire<K extends string>(k: Kit<K>): Promise<void> {
  await k.all(
    k.to(cast.boardL, 0.5, { x: -300, y: -120, rotation: -120, opacity: 0, ease: 'power2.in' }),
    k.to(cast.boardR, 0.5, { x: 300, y: -120, rotation: 120, opacity: 0, ease: 'power2.in' }),
    k.to(cast.fire, 0.5, { x: 0, y: 160, rotation: 10, opacity: 0, ease: 'power2.in' }),
  );
  k.sfx.crackle(1.2);
  await k.fade(k.part(cast.hole, 'flames'), 1, 0.6);
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. Grapefruit for breakfast
    diet: { who: 'narrator', text: 'Dudley was on a diet. So EVERYBODY at Number Four was on a diet.' },
    lovely: { who: 'petunia', text: 'Here you are, Diddy-kins. A lovely quarter of grapefruit!' },
    isThatIt: { who: 'dudley', text: 'Is… is THAT it?' },
    hmph: { who: 'vernon', text: 'Hmph.' },
    stamps: { who: 'vernon', text: 'Who on EARTH sends a letter covered in stamps?' },
    fromRon: { who: 'harry', text: 'It’s for me! It’s from Ron’s mum.' },
    reads: { who: 'harry', text: 'We’d love to take Harry to the Quidditch World Cup. We’ll fetch him on Sunday, at five o’clock.' },
    cloaks: { who: 'vernon', text: 'Hmph. Fine. But they are NOT to come here in funny cloaks.' },
    neighbours: { who: 'petunia', text: 'And not a word to the neighbours!' },
    reply: { who: 'harry', text: 'Hedwig! Will you take my answer to Ron? It says yes please!' },
    hungry: { who: 'dudley', text: 'Mum, I’m STILL hungry.' },
    // 2. Five o'clock
    sunday: { who: 'narrator', text: 'On Sunday, the Dursleys waited at the window. Five o’clock came.' },
    late: { who: 'vernon', text: 'Five past five. They’re late. Typical!' },
    noCar: { who: 'petunia', text: 'There’s no car. How ARE they coming?' },
    ouch: { who: 'fred', text: 'Ouch! Dad, it’s blocked!' },
    goBack: { who: 'mrWeasley', text: 'Oh dear. Back you go, George. No, Ron, that’s my foot!' },
    inFireplace: { who: 'petunia', text: 'They’re in the FIREPLACE!' },
    boardedUp: { who: 'vernon', text: 'But it’s boarded up! We’ve got an electric fire!' },
    eckeltricity: { who: 'mrWeasley', text: 'An eckeltric fire! How fascinating! Harry? Is that you? Stand back!' },
    standBack: { who: 'harry', text: 'Everybody stand back!' },
    hello: { who: 'mrWeasley', text: 'Ah! Hello! You must be Harry’s aunt and uncle!' },
    sorryFireplace: { who: 'mrWeasley', text: 'Sorry about your fireplace. Easily mended!' },
    plug: { who: 'mrWeasley', text: 'Is this a PLUG? I collect plugs, you know!' },
    trunk: { who: 'ron', text: 'Harry! Where’s your trunk?' },
    fetch: { who: 'harry', text: 'Upstairs. I’ll get it!' },
    // 3. The toffee
    oops: { who: 'fred', text: 'Oops. Dropped our toffees.' },
    toffees: { who: 'dudley', text: 'Toffees!' },
    waitForIt: { who: 'george', text: 'Ooh. He’s eaten one.' },
    waitWait: { who: 'fred', text: 'Wait for it…' },
    mmmph: { who: 'dudley', text: 'Mmmph! Mmmuuum!' },
    petuniaTongue: { who: 'petunia', text: 'DUDLEY! His TONGUE!' },
    whatHaveYouDone: { who: 'vernon', text: 'What have you DONE to my son?' },
    fredGeorge: { who: 'mrWeasley', text: 'FRED! GEORGE! What did I tell you?' },
    wearsOff: { who: 'fred', text: 'Don’t worry. It shrinks back when the toffee’s all gone.' },
    water: { who: 'harry', text: 'Here, Dudley. Drink some water. Then the toffee will go down.' },
    yuck: { who: 'dudley', text: 'Yuck. That wasn’t even nice toffee.' },
    offWeGo: { who: 'mrWeasley', text: 'Right! Off we go. Harry, the Floo powder.' },
    burrow: { who: 'harry', text: 'Here goes!' },
    theBurrow: { who: 'harry', text: 'The Burrow!' },
    goodbyeThen: { who: 'mrWeasley', text: 'Goodbye then! Lovely to meet you!' },
    iSaid: { who: 'mrWeasley', text: 'I said goodbye!' },
    goodbyeSmall: { who: 'vernon', text: '…Goodbye.' },
    // 4. Supper at the Burrow
    here: { who: 'harry', text: 'Whoa! I’m here!' },
    harryDear: { who: 'mrsWeasley', text: 'Harry, dear! Welcome! Now, Fred, George. What did you do?' },
    nothing: { who: 'fred', text: 'Nothing, Mum!' },
    nothingMum: { who: 'george', text: 'Nothing, Mum!' },
    ronTongue: { who: 'ron', text: 'Dudley’s tongue went THIS long!' },
    honestly: { who: 'mrsWeasley', text: 'Honestly, you two!' },
    pie: { who: 'mrsWeasley', text: 'Supper, everyone! And Harry, you need feeding up. Have some pie.' },
    notGrapefruit: { who: 'harry', text: 'Pie! Real pie! Not grapefruit!' },
    worldCup: { who: 'ron', text: 'And tomorrow, the Quidditch World Cup!' },
    bestSummer: { who: 'harry', text: 'This is going to be the best summer ever.' },
  },
  scenes: [
    // ==================================================== 1. Grapefruit for breakfast
    {
      name: 'Grapefruit for breakfast',
      set(k) {
        k.backdrop('dursley-kitchen');
        k.music('cosy');
        cast.vernon = k.character('vernon', { x: 30, y: 225, w: 270 });
        cast.harry = k.character('harry', { x: 320, y: 240, w: 240, pose: 'muggle' });
        cast.dudley = k.character('dudleyBig', { x: 590, y: 222, w: 280 });
        cast.petunia = k.character('petunia', { x: 890, y: 228, w: 250, flip: true });
        k.add(breakfastTable(), { x: 0, y: 505, w: 1180, z: 14 });
        // A tiny quarter of grapefruit each: Dudley's is the biggest, Harry's the smallest.
        k.prop('grapefruit', { x: 690, y: 470, w: 110, z: 16 });
        k.prop('grapefruit', { x: 130, y: 488, w: 66, z: 16 });
        k.prop('grapefruit', { x: 392, y: 494, w: 46, z: 16 });
        cast.hedwig = k.character('hedwig', { x: 40, y: 308, w: 200, z: 15 });
        cast.letter = k.add(stampedLetter(), { x: 70, y: 395, w: 210, z: 17 });
        cast.reply = k.prop('owlPostLetter', { x: 406, y: 452, w: 96, z: 17 });
        k.set([cast.hedwig, cast.letter, cast.reply], { opacity: 0 });
      },
      async play(k) {
        const { vernon, harry, dudley, petunia, hedwig, letter, reply } = cast;
        await k.wait(500);
        await k.say('diet');
        await k.say('lovely', petunia);
        // The close-up on Dudley and his tiny grapefruit.
        await k.all(k.say('isThatIt', dudley), k.camera({ zoom: 1.5, x: 740, y: 400 }, 1.2));
        await k.wait(600);
        await k.camera({}, 0.9);
        await k.say('hmph', vernon);

        // A thump on the doormat: the post. Mr Dursley fetches it.
        k.fx.thud();
        await k.wait(400);
        await k.exit(vernon, 'left', 0.5);
        await k.wait(500);
        k.set(letter, { opacity: 1, x: -420 });
        await k.all(k.enter(vernon, 'left', 0.8), k.to(letter, 0.8, { x: 0, ease: 'power2.out' }));
        await k.say('stamps', vernon);
        await k.all(k.say('fromRon', harry), k.to(letter, 0.8, { x: 280, y: 25, scale: 0.85 }));
        k.sfx.page();
        await k.say('reads', harry);
        await k.vanish(letter, 0.3);
        await k.all(k.say('cloaks', vernon), k.shake(vernon, 5, 3));
        await k.say('neighbours', petunia);
        k.fx.patter(5);
        await k.all(k.exit(vernon, 'left', 0.7), k.exit(petunia, 'right', 0.7));

        // Hedwig swoops in.
        await k.wait(300);
        k.sfx.hoot();
        await swoopIn(k, hedwig, 'left');
        await k.say('reply', harry);
        // The deed: Harry's answer goes to Hedwig.
        k.fx.pop();
        await k.appear(reply, 0.35);
        await k.carry(reply, hedwig);
        await hoot(k, hedwig);
        await k.all(flyOff(k, hedwig, 'left', 1), k.to(reply, 1, { x: '-=620', y: '-=170', ease: 'power1.in' }));
        k.remove(reply);
        await k.wait(500);

        // Hook: still hungry.
        await k.enter(petunia, 'right', 0.6);
        await k.say('hungry', dudley);
        k.fx.pop();
        await k.hop(petunia, 14, 2);
        await k.wait(600);
      },
    },

    // ==================================================== 2. Five o'clock
    {
      name: 'Five o’clock',
      set(k) {
        k.backdrop('dursley-lounge');
        k.music('cosy');
        boardedFireplace(k);
        cast.vernon = k.character('vernon', { x: 30, y: 300, w: 270 });
        cast.petunia = k.character('petunia', { x: 250, y: 310, w: 240 });
        cast.harry = k.character('harry', { x: 770, y: 320, w: 230, flip: true, pose: 'muggle' });
        // The Weasleys wait inside the chimney until they tumble out into these places.
        cast.mrW = k.character('mrWeasley', { x: 300, y: 295, w: 250 });
        cast.ron = k.character('ron', { x: 540, y: 320, w: 220 });
        cast.fred = k.character('fred', { x: 740, y: 312, w: 230 });
        cast.george = k.character('george', { x: 940, y: 312, w: 230 });
        k.set([cast.mrW, cast.ron, cast.fred, cast.george], { opacity: 0 });
        cast.trunk = k.prop('trunk', { x: 560, y: 520, w: 190, z: 16 });
        k.set(cast.trunk, { opacity: 0 });
        cast.pile = k.prop('toffeePile', { x: 600, y: 600, w: 190, z: 16 });
        k.set(cast.pile, { opacity: 0 });
      },
      async play(k) {
        const { vernon, petunia, harry, mrW, ron, fred, george, boardL, boardR, fire, plug: plugEl, trunk, pile } = cast;
        await k.wait(500);
        await k.say('sunday');
        await k.wait(300);
        await k.wait(chime(5) - 600);
        await k.say('late', vernon);
        await k.say('noCar', petunia);

        // The quiet, and the thumps in the chimney.
        k.silence();
        await k.wait(1000);
        thump();
        await k.shake(boardL, 2, 3);
        await k.wait(1100);
        thump();
        await k.all(k.shake(boardR, 2, 3), k.shake(fire, 2, 3));
        await k.wait(500);
        // Everyone freezes and turns to look.
        k.face(vernon, true);
        k.face(petunia, true);
        await k.all(k.shake(vernon, 3, 2), k.shake(petunia, 3, 2));
        await k.wait(700);
        await k.say('ouch');
        await k.say('goBack');
        await k.all(k.say('inFireplace', petunia), k.shake(petunia, 8, 4));
        await k.say('boardedUp', vernon);
        await k.say('eckeltricity');

        // Harry steps in front and moves the Dursleys back.
        const back = k.to(vernon, 0.9, { x: -20 });
        const back2 = k.to(petunia, 0.9, { x: -30 });
        await k.all(k.say('standBack', harry), k.to(harry, 0.9, { x: -320 }), back, back2);
        k.flourish(harry);
        await k.wait(300);

        // BANG!
        whumph();
        k.sfx.boom();
        k.quake(12);
        k.set(fire, { zIndex: 20 });
        k.set(plugEl, { opacity: 1 });
        k.puff(HEARTH[0], HEARTH[1], 360, '#44444c');
        k.puff(HEARTH[0] - 90, HEARTH[1] + 50, 260, '#55555d');
        k.puff(HEARTH[0] + 90, HEARTH[1] - 20, 260, '#55555d');
        void k.to(boardL, 0.8, { x: -560, y: -160, rotation: -200, scale: 1.2, ease: 'power2.out' }).then(() => k.set(boardL, { opacity: 0 }));
        void k.to(boardR, 0.8, { x: 760, y: -140, rotation: 220, scale: 1.2, ease: 'power2.out' }).then(() => k.set(boardR, { opacity: 0 }));
        void k.to(fire, 0.7, { x: 330, y: 60, rotation: 12, ease: 'power2.out' });
        void k.to(plugEl, 0.7, { x: 120, y: 65, rotation: 40, ease: 'power2.out' });
        await k.all(k.exit(vernon, 'left', 0.6), k.exit(petunia, 'left', 0.6), k.wait(150).then(() => k.exit(harry, 'left', 0.6)));
        k.fx.crash();
        await k.wait(300);

        // Out they tumble, sooty: Mr Weasley first, then Ron, Fred, George.
        k.music('adventure');
        await tumble(k, mrW);
        await tumble(k, ron);
        await tumble(k, fred);
        await tumble(k, george);
        await k.all(cough(k, mrW), cough(k, ron), cough(k, fred), cough(k, george));
        await k.wait(200);
        // They dust themselves off.
        for (const el of [mrW, ron, fred, george]) k.puff(k.box(el).x + k.box(el).w / 2, k.box(el).y + 150, 150, '#6a6a72');
        k.fx.poof();
        await k.all(...[mrW, ron, fred, george].map((el) => k.to(el, 1.3, { filter: CLEAN, ease: 'none' })));
        // The boys wander off to look at the telly and the sofa.
        await k.walk(george, 400, 1.0, 4);
        await k.walk(fred, 520, 1.1, 4);
        await k.walk(ron, 700, 1.3, 5);
        k.set([fred, george, ron], { opacity: 0 });
        await k.wait(300);

        // Mr Dursley creeps back, and Mr Weasley beams.
        await k.enter(vernon, 'left', 0.8);
        await k.all(k.say('hello', mrW), k.to(mrW, 1.4, { x: 40 }));
        await k.to(vernon, 0.5, { x: -30 });
        // He is shown the boards: a flick of his wand at the fireplace, not at anyone.
        await k.say('sorryFireplace', mrW);
        await castSpell(k, mrW, FIRE_AIM);
        await mend(k);
        // The plug.
        await k.wait(500);
        k.sfx.page();
        await k.all(k.say('plug', mrW), k.to(plugEl, 0.8, { x: 270, y: -170, rotation: 0, scale: 1.5 }));
        k.flourish(plugEl);
        await k.wait(500);
        await k.vanish(plugEl, 0.3);
        await k.exit(vernon, 'left', 0.6);

        // Ron comes back from the right; Harry from the left.
        await k.enter(ron, 'right', 0.8);
        k.set(harry, { x: -1000, opacity: 1 });
        await k.to(harry, 0.7, { x: -730, ease: 'power2.out' });
        await k.say('trunk', ron);
        await k.say('fetch', harry);
        // The deed: Harry fetches his trunk from upstairs and carries it in.
        await k.to(harry, 0.6, { x: -1000, ease: 'power2.in' });
        k.fx.patter(6);
        await k.wait(300);
        k.fx.thud();
        await k.wait(200);
        k.set(trunk, { opacity: 1, x: -400 });
        k.set(harry, { x: -1000, opacity: 1 });
        await k.all(k.to(harry, 0.8, { x: -730, ease: 'power2.out' }), k.to(trunk, 0.8, { x: 0, ease: 'power2.out' }));
        await k.carry(trunk, [560, 600], 0.9);
        await k.wait(300);

        // Hook: Ron goes off, Fred and George come to help, and the toffees spill.
        await k.exit(ron, 'right', 0.6);
        await k.all(k.enter(fred, 'right', 0.8), k.wait(200).then(() => k.enter(george, 'right', 0.8)));
        await k.hop(fred, 20, 1);
        await k.all(k.to(fred, 0.3, { y: '+=36', rotation: 8 }));
        k.fx.pop();
        k.set(pile, { opacity: 1, y: 480 });
        k.fx.patter(6);
        await k.to(pile, 0.45, { y: 600, ease: 'bounce.out' });
        await k.to(fred, 0.3, { y: 0, rotation: 0 });
        await k.wait(800);
      },
    },

    // ==================================================== 3. The toffee
    {
      name: 'The toffee',
      set(k) {
        k.backdrop('dursley-lounge');
        k.music('sneaky');
        boardedFireplace(k);
        cast.harry = k.character('harry', { x: 30, y: 320, w: 230, pose: 'muggle' });
        cast.dudley = k.character('dudleyBig', { x: 290, y: 280, w: 270 });
        cast.fred = k.character('fred', { x: 590, y: 312, w: 230 });
        cast.george = k.character('george', { x: 850, y: 312, w: 230 });
        cast.pile = k.prop('toffeePile', { x: 540, y: 598, w: 190, z: 16 });
        cast.petunia = k.character('petunia', { x: 900, y: 300, w: 240, flip: true });
        cast.vernon = k.character('vernon', { x: 880, y: 292, w: 270, flip: true });
        cast.mrW = k.character('mrWeasley', { x: 690, y: 295, w: 250 });
        k.set([cast.petunia, cast.vernon, cast.mrW], { opacity: 0 });
        // Let Dudley's tongue hang out past the edge of his picture.
        const art = cast.dudley.querySelector('svg');
        if (art) art.style.overflow = 'visible';
        cast.glass = k.add(glass(), { x: 60, y: 500, w: 54, z: 17 });
        k.set(cast.glass, { opacity: 0 });
        cast.pot = k.prop('flooPot', { x: 130, y: 540, w: 70, z: 17 });
        k.set(cast.pot, { opacity: 0 });
        cast.flames = k.add(greenFlames(), { x: 470, y: 372, w: 240, z: 8 });
        k.set(cast.flames, { opacity: 0 });
      },
      async play(k) {
        const { harry, dudley, fred, george, petunia, vernon, mrW, pile, glass: cup, pot, flames, hole } = cast;
        const tongue = k.pivot(k.part(dudley, 'tongue'));
        const open = k.part(dudley, 'mouthOpen');
        const shut = k.part(dudley, 'mouth');
        await k.wait(500);
        await k.say('oops', fred);
        await k.blink(fred);
        // Dudley looks round. Nobody's watching.
        await k.all(k.say('toffees', dudley), k.shake(dudley, 5, 2));
        await k.wait(300);
        const sweet = k.prop('toffee', { x: 640, y: 628, w: 60, z: 18 });
        await k.to(sweet, 0.9, { x: -330, y: -170, ease: 'power1.inOut' });
        munch();
        await k.vanish(sweet, 0.3);
        await k.wait(500);
        await k.say('waitForIt', george);
        await k.say('waitWait', fred);
        await k.wait(400);

        // Bwoing! The tongue rolls out.
        bwoing();
        k.set(open, { opacity: 1 });
        k.set(shut, { opacity: 0 });
        k.set(tongue, { opacity: 1, scaleY: 0.15, scaleX: 0.8 });
        const grow = k.to(tongue, 1.6, { scaleY: 2, scaleX: 1.15, ease: 'elastic.out(1, 0.5)' });
        await k.wait(500);
        await k.all(k.say('mmmph', dudley), grow);
        // The twins scarper.
        void k.walk(george, 400, 1, 4);
        await k.walk(fred, 500, 1.1, 4);
        k.set([fred, george], { opacity: 0 });

        // Mrs Dursley rushes in, shrieks, and rushes out for Mr Dursley.
        await k.enter(petunia, 'right', 0.5);
        await k.all(k.say('petuniaTongue', petunia), k.shake(petunia, 8, 4));
        await k.exit(petunia, 'right', 0.5);
        await k.enter(vernon, 'right', 0.5);
        await k.all(k.say('whatHaveYouDone', vernon), k.to(k.part(vernon, 'cross'), 0.6, { opacity: 1 }));
        k.fx.stomp(3, 0.3);
        await k.exit(vernon, 'right', 0.5);
        await k.to(k.part(vernon, 'cross'), 0.1, { opacity: 0 });

        // Mr Weasley comes in: Harry nips off to fetch water.
        k.sfx.whoosh();
        await k.all(k.exit(harry, 'left', 0.6), k.enter(mrW, 'right', 0.7));
        await k.say('fredGeorge', mrW);
        k.set(fred, { opacity: 1, x: 700 });
        await k.to(fred, 0.5, { x: 350, ease: 'power2.out' });
        await k.say('wearsOff', fred);
        await k.to(fred, 0.5, { x: 700, ease: 'power2.in' });

        // The big deed: Harry gives Dudley a glass of water.
        k.set(cup, { opacity: 1, x: -150 });
        await k.all(k.enter(harry, 'left', 0.8), k.to(cup, 0.8, { x: 0, ease: 'power2.out' }));
        await k.say('water', harry);
        await k.carry(cup, [k.box(dudley).x + 150, 470], 0.9);
        const water = k.part(cup, 'water');
        for (let i = 0; i < 3; i++) {
          gulp();
          await k.to(water, 0.35, { scaleY: 1 - (i + 1) * 0.3, ease: 'none' });
          await k.shake(dudley, 3, 1);
        }
        await k.vanish(cup, 0.3);
        // Sproing: the tongue shrinks back.
        sproing();
        await k.to(tongue, 0.7, { scaleY: 0.2, scaleX: 0.8, ease: 'back.in(1.8)' });
        await k.to(tongue, 0.2, { opacity: 0 });
        k.set(open, { opacity: 0 });
        k.set(shut, { opacity: 1 });
        k.flourish(harry);
        await k.wait(600);
        await k.say('yuck', dudley);
        await k.wait(500);

        // Off we go: a fire in the fireplace, then the Floo powder.
        k.music('magic');
        await k.say('offWeGo', mrW);
        await castSpell(k, mrW, FIRE_AIM);
        await lightFire(k);
        k.set(pot, { opacity: 1 });
        await k.appear(pot, 0.4);
        await k.say('burrow', harry);
        // The deed: a pinch of Floo powder into the fire.
        const grain = k.add(pinch(), { x: 140, y: 480, w: 40, z: 18 });
        await k.carry(grain, [HEARTH[0], HEARTH[1] + 20], 0.9);
        k.remove(grain);
        // Green flames whoosh up.
        flooWhoosh();
        k.sfx.whoosh();
        void k.fade(k.part(hole, 'flames'), 0, 0.5);
        const glowGreen = k.light(HEARTH[0], HEARTH[1], 330, { color: '#7be0a0', strength: 0.55, z: 35 });
        k.set(glowGreen, { opacity: 0 });
        void k.fade(glowGreen, 0.55, 0.6);
        k.set(flames, { opacity: 1, scaleY: 0.2, transformOrigin: '50% 100%' });
        await k.to(flames, 0.7, { scaleY: 1, ease: 'power2.out' });
        const lick = k.part(flames, 'flames');
        void k.to(lick, 0.7, { scaleY: 1.07, scaleX: 0.97, yoyo: true, repeat: 3, ease: 'sine.inOut' });
        k.sparkle(HEARTH[0], HEARTH[1], 16, 140);
        await k.wait(300);
        await k.say('theBurrow', harry);
        // He steps into the flames and is gone, in a swirl.
        k.sfx.whoosh();
        const pose = k.to(harry, 0.5, { y: -80, rotation: 16 });
        await pose;
        await k.to(harry, 0.8, { x: HEARTH[0] - (k.box(harry).x + k.box(harry).w / 2) + 20, y: 10, scale: 0.15, rotation: 540, opacity: 0, ease: 'power2.in' });
        k.fx.twinkle();
        k.remove(harry);
        await k.wait(500);

        // Goodbye, Mr Dursley.
        await k.enter(vernon, 'right', 0.6);
        await k.say('goodbyeThen', mrW);
        await k.wait(1400);
        await k.all(k.say('iSaid', mrW), k.hop(mrW, 14, 1));
        await k.wait(300);
        await k.say('goodbyeSmall', vernon);
        await k.wait(400);
        // Whoosh: Mr Weasley goes.
        k.sfx.whoosh();
        await k.to(mrW, 0.9, { x: `-=${k.box(mrW).x + k.box(mrW).w / 2 - HEARTH[0] - 40}`, ease: 'power1.in' });
        await k.to(mrW, 0.7, { y: -60, scale: 0.15, rotation: 300, opacity: 0, ease: 'power2.in' });
        k.fx.twinkle();
        await k.all(k.fade(glowGreen, 0, 1), k.fade(flames, 0, 1));
        await k.wait(800);
        void pile;
      },
    },

    // ==================================================== 4. Supper at the Burrow
    {
      name: 'Supper at the Burrow',
      set(k) {
        k.backdrop('kitchen');
        k.music('cosy');
        cast.fred = k.character('fred', { x: 40, y: 290, w: 230 });
        cast.george = k.character('george', { x: 270, y: 290, w: 230 });
        cast.mrsW = k.character('mrsWeasley', { x: 520, y: 280, w: 250 });
        cast.harry = k.character('harry', { x: 830, y: 295, w: 230, flip: true, pose: 'muggle' });
        cast.ron = k.character('ron', { x: 170, y: 300, w: 220 });
        k.set(cast.ron, { opacity: 0 });
        k.set(cast.harry, { opacity: 0 });
        cast.flames = k.add(greenFlames(), { x: 960, y: 250, w: 200, z: 9 });
        k.set(cast.flames, { opacity: 0 });
        cast.pie = k.prop('pie', { x: 560, y: 520, w: 210, z: 16 });
        k.set(cast.pie, { opacity: 0 });
      },
      async play(k) {
        const { fred, george, mrsW, harry, ron, flames, pie } = cast;
        await k.wait(500);
        // Harry whooshes out of the fire.
        const glowGreen = k.light(1060, 400, 240, { color: '#7be0a0', strength: 0.5, z: 35 });
        k.set(glowGreen, { opacity: 0 });
        flooWhoosh();
        void k.fade(glowGreen, 0.5, 0.5);
        k.set(flames, { opacity: 1, scaleY: 0.2, transformOrigin: '50% 100%' });
        await k.to(flames, 0.6, { scaleY: 1, ease: 'power2.out' });
        k.set(harry, { opacity: 1, x: 220, y: 20, scale: 0.2, rotation: -300 });
        k.sfx.whoosh();
        await k.to(harry, 0.9, { x: 0, y: 0, scale: 1, rotation: 0, ease: 'back.out(1.3)' });
        k.fx.thud();
        void k.fade(glowGreen, 0, 1.2);
        void k.fade(flames, 0, 1.2);
        await k.say('here', harry);
        await k.say('harryDear', mrsW);
        await k.all(k.say('nothing', fred), k.say('nothingMum', george));
        await k.blink(george);
        // The twins slip off, and Ron comes in laughing.
        await k.all(k.exit(fred, 'left', 0.6), k.exit(george, 'left', 0.6));
        await k.enter(ron, 'left', 0.7);
        await k.say('ronTongue', ron);
        // Arms wide: THIS long!
        laugh();
        await k.shake(ron, 6, 3);
        await k.all(k.shake(harry, 4, 3), k.shake(mrsW, 4, 3));
        await k.say('honestly', mrsW);
        await k.wait(300);

        // Supper: the pie is passed to Harry.
        k.sfx.rustle();
        k.set(pie, { opacity: 1 });
        await k.appear(pie, 0.4);
        await k.say('pie', mrsW);
        await k.carry(pie, harry, 0.9);
        await k.say('notGrapefruit', harry);
        laugh();
        await k.all(k.hop(harry, 24, 2), k.hop(ron, 24, 2));
        await k.say('worldCup', ron);
        k.music('triumph');
        await k.say('bestSummer', harry);
        k.sparkle(590, 330, 18, 280);
        k.fx.twinkle();
        k.confetti(24);
        await k.all(k.hop(mrsW, 26, 2), k.wait(150).then(() => k.hop(ron, 26, 2)), k.wait(300).then(() => k.hop(harry, 26, 2)));
        await k.wait(1500);
      },
    },
  ],
});
