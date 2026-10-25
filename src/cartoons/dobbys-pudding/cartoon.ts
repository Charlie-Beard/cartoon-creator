/**
 * Dobby and the Pudding: the Dursleys' very important dinner party, from the
 * start of the second Harry Potter book. Dobby will do anything to stop Harry
 * going back to Hogwarts, even wreck Aunt Petunia's pudding, and Ron, Fred and
 * George come to the rescue in a flying car.
 *
 *   1. The rehearsal (the lounge). Uncle Vernon drills his family for the
 *      most important night of his life: Mr and Mrs Mason are coming to dinner.
 *      Petunia will wait in the lounge, Dudley (in a bow tie) will take the
 *      coats, and Harry? "I'll be in my bedroom. Making no noise. And
 *      pretending I'm not there." Petunia's pudding is a mountain of cream and
 *      sugar violets. Harry heads upstairs.
 *   2. Someone on the bed (Harry's bedroom). A house-elf is bouncing on
 *      Harry's bed! Dobby bows so low his nose touches the rug. The doorbell
 *      rings and Vernon laughs downstairs, so Harry shushes him. Dobby begs him
 *      not to go back to Hogwarts, and shows the letters he has been keeping
 *      from Harry's friends. Harry reaches for them, but Dobby hops away: he
 *      will give them back if Harry promises to stay home. Harry can't. Crack:
 *      Dobby is gone. The kitchen! The pudding!
 *   3. The pudding (the kitchen). The pudding floats and wobbles near the
 *      ceiling, with Dobby on the worktop. "Say it, sir." Harry can't. Dobby
 *      clicks his fingers and the pudding tips and falls: Harry dives and
 *      CATCHES it (deed). "Got it! Phew." Then Dobby says sorry, crack, and the
 *      pudding jumps out of Harry's hands, turns a somersault and lands, SPLAT,
 *      on the floor. In come Vernon and the Masons. Vernon, going purple, says
 *      Harry is just silly. An owl swoops in through the window with a letter.
 *      Mrs Mason can't abide birds: she shrieks and runs, and Mr Mason runs
 *      after her. Vernon, very purple: "No more magic school for you, boy.
 *      Not EVER!"
 *   4. The rescue (Privet Drive at night, then the stars). Uncle Vernon has
 *      put bars on the window. Harry tells Hedwig he'll never get back. A
 *      purr in the night, headlights, and a flying car floats up beside the
 *      window: Ron, Fred and George. Ron throws a rope and Harry ties it to
 *      the bars (deed). The car pulls, the bars come off and drop into the
 *      hedge. Vernon appears at the next window: "He's ESCAPING!" Harry passes
 *      Hedwig's cage into the car (deed) and climbs in after it. Off they zoom
 *      over the roofs. Then the car flies past the moon, with Hedwig beside it.
 *      "Happy birthday, Harry. Sorry we're late." "Late? You're just in time.
 *      Best present ever."
 *
 * Safety choices: Dobby never hurts himself (he never does anything of the
 * sort here: he just says sorry and goes). Nobody is hit or grabbed: Vernon
 * looms and goes purple, and the bars are already on when the last scene opens.
 * The pudding lands on the FLOOR, not on anyone. The bars come off the wall
 * and drop into the hedge with nobody near. Petunia and Dudley are in the
 * first scene only, so the kitchen stays at four on stage.
 *
 * One-off here: the bed, Dobby's bundle of letters, Dudley's bow tie, the
 * rope, the owl who delivers the letter, the doorbell and the car's engine.
 * Everyone else is in the Hogwarts world (and the Dursleys' rooms, the
 * pudding, the bars, the cage and the flying car are already there).
 */
import { C, cached, circle, defineCartoon, ellipse, group, ink, noiseBurst, now, piece, poly, rect, svg, tone, bell, NOTE, type Kit } from '../../kit';
import { sounds as commonSounds } from '../../worlds/common/moves';
import { noiseOff } from '../../worlds/common/pieces';
import { moves as hogMoves, sounds as hogSounds } from '../../worlds/hogwarts/moves';
import meta from './meta';

const { apparate, swoopIn, flyOff, flap } = hogMoves;
const { flutter } = hogSounds;
const { slam, ting } = commonSounds;

// ------------------------------------------------------------------- art

/** Harry's bed, back half (headboard, frame, legs and the mattress), 470 × 230. Dobby bounces on top of it. */
const bedBack = cached(() =>
  svg({ w: 470, h: 230, name: 'dobbys-pudding-bed-back', label: 'A bed' }, [
    piece(rect(10, 30, 26, 184, 6), C.brownDark),
    piece(rect(14, 170, 26, 44, 4), C.barkDark, { edge: 'cut', fibre: false }),
    piece(rect(430, 170, 26, 44, 4), C.barkDark, { edge: 'cut', fibre: false }),
    piece(rect(10, 150, 446, 36, 6), C.wood),
    piece(rect(30, 96, 410, 62, 16), C.cream),
    piece(ellipse(84, 90, 50, 24), C.white),
    ink([[44, 92], [124, 92]], { width: 2, color: C.sand }),
  ]),
);

/** The quilt and the footboard, 470 × 230: drawn in front of Dobby, so his bottom edge is tucked away. */
const bedFront = cached(() =>
  svg({ w: 470, h: 230, name: 'dobbys-pudding-bed-front', label: 'A quilt' }, [
    piece(rect(150, 100, 292, 64, 14), '#7a8f6a'),
    ...[190, 240, 290, 340, 390].map((x) => ink([[x, 112], [x, 156]], { width: 4, color: '#a3b58e' })),
    piece(rect(432, 118, 26, 96, 6), C.brownDark),
  ]),
);

/** The letters Dobby has been keeping: a fat bundle tied with string, 140 × 100. */
const letterBundle = cached(() =>
  svg({ w: 140, h: 100, name: 'dobbys-pudding-letters', label: 'A bundle of letters' }, [
    piece(poly([[12, 30], [118, 18], [126, 68], [18, 80]]), C.sand),
    piece(poly([[16, 22], [124, 30], [120, 76], [10, 66]]), C.cream),
    piece(poly([[20, 16], [120, 14], [122, 62], [22, 66]]), C.white),
    piece(circle(100, 36, 8), C.red, { edge: 'cut', fibre: false }),
    ink([[40, 30], [90, 30]], { width: 3, color: C.stone }),
    ink([[40, 44], [80, 44]], { width: 3, color: C.stone }),
    ink([[70, 12], [70, 70]], { width: 5, color: C.tan }),
    ink([[30, 40], [112, 40]], { width: 5, color: C.tan }),
    piece(circle(70, 40, 6), C.tan, { edge: 'cut', fibre: false }),
  ]),
);

/** Dudley's bow tie, 90 × 50. */
const bowTie = cached(() =>
  svg({ w: 90, h: 50, name: 'dobbys-pudding-bow', label: 'A bow tie' }, [
    piece(poly([[45, 25], [6, 4], [10, 46]]), C.red),
    piece(poly([[45, 25], [84, 4], [80, 46]]), C.red),
    piece(circle(45, 25, 10), C.redDark, { edge: 'cut', fibre: false }),
  ]),
);

/** The rope Ron throws, drawn from the bars (top left) to the car (bottom right), 190 × 60. */
const rope = cached(() =>
  svg({ w: 190, h: 60, name: 'dobbys-pudding-rope', label: 'A rope' }, [
    ink([[4, 6], [50, 22], [100, 36], [150, 46], [186, 54]], { width: 9, color: C.tan }),
    ...[24, 54, 84, 114, 144, 172].map((x, i) => ink([[x, 10 + i * 8], [x + 8, 22 + i * 8]], { width: 3, color: C.brown })),
  ]),
);

/** A little brown owl flying, wings out, facing right, 140 × 90 (the owl who brings the letter). */
const flyingOwl = cached(() =>
  svg({ w: 140, h: 90, name: 'dobbys-pudding-owl', label: 'An owl' }, [
    group({ part: 'wingL', origin: [60, 46] }, [piece(poly([[60, 46], [8, 18], [18, 50], [56, 58]]), C.brownDark)]),
    piece(ellipse(72, 54, 30, 24), C.brown),
    piece(circle(98, 40, 20), C.brown),
    piece(circle(98, 40, 14), C.tan, { edge: 'cut', fibre: false }),
    piece(circle(93, 37, 4), C.ink, { edge: 'clean', shadow: false }),
    piece(circle(104, 37, 4), C.ink, { edge: 'clean', shadow: false }),
    piece(poly([[97, 44], [101, 44], [99, 50]]), C.orange, { edge: 'cut', shadow: false }),
    group({ part: 'wingR', origin: [70, 44] }, [piece(poly([[70, 44], [112, 6], [104, 40], [80, 56]]), '#7a5534')]),
  ]),
);

// ---------------------------------------------------------------- sounds

/** The front doorbell: ding-dong. */
function doorbell(): void {
  const t = now();
  bell(NOTE.E5, t, 0.12, 0.9);
  bell(NOTE.C5, t + 0.55, 0.12, 1.3);
}

/** The old car's engine: a soft, putt-putting purr, swelling in (never sudden). */
function engine(seconds = 2.5): void {
  const t = now();
  tone(62, t, { wave: 'sawtooth', peak: 0.07, attack: seconds * 0.5, decay: seconds * 0.5, vibrato: [14, 6], lowpass: 240 });
  tone(93, t, { wave: 'triangle', peak: 0.04, attack: seconds * 0.5, decay: seconds * 0.5, vibrato: [20, 5] });
  noiseBurst(t, { freq: 200, type: 'lowpass', peak: 0.05, attack: seconds * 0.5, decay: seconds * 0.5 });
  for (let i = 0; i < Math.floor(seconds / 0.16); i++) tone(78, t + i * 0.16, { wave: 'sine', peak: 0.03, attack: 0.01, decay: 0.1 });
}

/** The car revving to pull: a rising growl. */
function rev(): void {
  const t = now();
  tone(60, t, { wave: 'sawtooth', peak: 0.1, attack: 0.5, decay: 0.5, glideTo: 170, lowpass: 400, vibrato: [20, 8] });
  noiseBurst(t, { freq: 300, type: 'lowpass', peak: 0.07, attack: 0.5, decay: 0.5, sweepTo: 900 });
}

/** A wet, creamy splat. */
function splat(): void {
  const t = now();
  noiseBurst(t, { freq: 700, q: 0.8, peak: 0.12, attack: 0.004, decay: 0.3, sweepTo: 200 });
  tone(130, t, { wave: 'sine', peak: 0.1, attack: 0.005, decay: 0.2, glideTo: 60 });
}

// ------------------------------------------------------------------ cast

type Actor =
  | 'vernon' | 'petunia' | 'dudley' | 'bow' | 'harry' | 'dobby' | 'bed' | 'bedFront' | 'bundle'
  | 'pudding' | 'splat' | 'mr' | 'mrs' | 'owl' | 'letter'
  | 'bars' | 'car' | 'rope' | 'cage' | 'hedwig' | 'windowLight' | 'vernonLight'
  | 'moon';
const cast = {} as Record<Actor, HTMLElement>;

/** Harry's window on Privet Drive at night (x 560–660, y 200–290), and the car hovering beside it. */
const WIN = { x: 560, y: 193 };
const CAR = { x: 780, y: 280, w: 380 };
/** Where the rope runs, from the bars to the front of the car. */
const ROPE = { x: 655, y: 247 };

/** A car part (Ron's or Fred's head in a window) as something that can be said through. */
function seat(k: Kit<string>, car: HTMLElement, name: 'ron' | 'fred'): HTMLElement {
  const [part] = k.part(car, name);
  return part as unknown as HTMLElement;
}

/** Harry as a Muggle boy: his wand stays out of sight all summer (it is locked away under the stairs). */
function muggle<K extends string>(k: Kit<K>, opts: Parameters<Kit<K>['character']>[1]): HTMLElement {
  const harry = k.character('harry', { ...opts, pose: 'muggle' });
  k.set(k.part(harry, 'wand'), { opacity: 0 });
  return harry;
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. The rehearsal
    bigNight: { who: 'vernon', text: 'Tonight is the most important night of my life. Mr and Mrs Mason are coming to dinner!' },
    onceMore: { who: 'vernon', text: 'Let’s practise once more. Petunia! When they arrive, you will be…?' },
    inLounge: { who: 'petunia', text: 'In the lounge, waiting to welcome them, Vernon.' },
    dudley: { who: 'vernon', text: 'Good. And Dudley?' },
    coats: { who: 'dudleyBig', text: 'I’ll open the door. May I take your coats, Mr and Mrs Mason?' },
    lovehim: { who: 'vernon', text: 'They’ll LOVE him! And you, boy?' },
    notThere: { who: 'harry', text: 'I’ll be in my bedroom. Making no noise. And pretending I’m not there.' },
    tooRight: { who: 'vernon', text: 'Too right you will. One squeak and you’re in BIG trouble.' },
    mountain: { who: 'petunia', text: 'And after dinner, my pudding! A mountain of cream and sugar violets!' },
    upstairs: { who: 'harry', text: 'No noise. Not there. That’s easy.' },
    // 2. Someone on the bed
    erHello: { who: 'harry', text: 'Er… hello?' },
    honour: { who: 'dobby', text: 'Harry Potter! Such an honour it is!' },
    shh: { who: 'harry', text: 'Shh! Not so loud! Who are you?' },
    justDobby: { who: 'dobby', text: 'Dobby, sir. Just Dobby. Dobby the house-elf.' },
    golf: { who: 'vernon', text: 'Ha ha ha! Do come in, Mr Mason!' },
    pleaseQuiet: { who: 'harry', text: 'My uncle’s got guests. I’m supposed to be pretending I’m not here!' },
    danger: { who: 'dobby', text: 'Harry Potter must not go back to Hogwarts this year. There is danger, sir!' },
    mustGoBack: { who: 'harry', text: 'But I have to go back. All my friends are there.' },
    friendsWrite: { who: 'dobby', text: 'Friends who don’t even write to Harry Potter?' },
    noLetters: { who: 'harry', text: 'Well… no. They haven’t written all summer.' },
    theseLetters: { who: 'dobby', text: 'Perhaps because Dobby has been keeping them, sir.' },
    myLetters: { who: 'harry', text: 'My letters! From Ron and Hermione! Give them here!' },
    promise: { who: 'dobby', text: 'Dobby will, sir, if Harry Potter promises not to go back to school!' },
    cantPromise: { who: 'harry', text: 'I can’t promise that. Hogwarts is the best place in the world.' },
    noChoice: { who: 'dobby', text: 'Then Dobby has no choice. Dobby must stop the dinner, sir!' },
    kitchenPudding: { who: 'harry', text: 'Oh no. Where’s he gone? The kitchen! The PUDDING!' },
    // 3. The pudding
    putItDown: { who: 'harry', text: 'Dobby! Put the pudding down. Please!' },
    sayIt: { who: 'dobby', text: 'Say it, sir. Say Harry Potter won’t go back to school.' },
    cant: { who: 'harry', text: 'I can’t, Dobby!' },
    catchIt: { who: 'harry', text: 'I’ll catch it!' },
    gotIt: { who: 'harry', text: 'Got it! Phew.' },
    sorry: { who: 'dobby', text: 'Dobby is very sorry, sir.' },
    ohNo: { who: 'harry', text: 'Oh no.' },
    explain: { who: 'vernon', text: 'Ha ha! Just our nephew. He’s… very silly. Ha ha!' },
    bird: { who: 'mrsMason', text: 'A BIRD! I can’t abide birds! AAAAAH!' },
    comeDear: { who: 'mrMason', text: 'Come along, dear. Goodnight, Dursley!' },
    gone: { who: 'vernon', text: 'The Masons… GONE! Because of YOU!' },
    elf: { who: 'harry', text: 'It wasn’t me! It was a house-elf!' },
    noSchool: { who: 'vernon', text: 'No more magic school for you, boy. Not EVER!' },
    // 4. The rescue
    bars: { who: 'narrator', text: 'Uncle Vernon put bars on Harry’s window. Harry was stuck.' },
    stuck: { who: 'harry', text: 'Oh, Hedwig. I don’t think we’ll ever get back to Hogwarts.' },
    itsUs: { who: 'ron', text: 'Harry! It’s us!' },
    flying: { who: 'harry', text: 'Ron! Fred! George! Is that car FLYING?' },
    dadsCar: { who: 'fred', text: 'It’s Dad’s. Don’t tell Mum!' },
    rope: { who: 'ron', text: 'Here! Tie this rope to the bars. Quick!' },
    tied: { who: 'harry', text: 'Done!' },
    holdTight: { who: 'george', text: 'Hold on to your hats! Off we go!' },
    escaping: { who: 'vernon', text: 'PETUNIA! He’s ESCAPING!' },
    floorIt: { who: 'ron', text: 'Go, Fred, go!' },
    lateBirthday: { who: 'ron', text: 'Happy birthday, Harry. Sorry we’re late.' },
    bestPresent: { who: 'harry', text: 'Late? You’re just in time. Best present ever.' },
  },
  scenes: [
    // ==================================================== 1. The rehearsal
    {
      name: 'The rehearsal',
      set(k) {
        k.backdrop('dursley-lounge');
        k.music('cosy');
        // Vernon, big and pompous on the left; the family lined up in front of him, Harry at the end.
        cast.vernon = k.character('vernon', { x: 100, y: 317, w: 330, z: 12 });
        cast.petunia = k.character('petunia', { x: 450, y: 405, w: 250, flip: true });
        cast.dudley = k.character('dudleyBig', { x: 680, y: 405, w: 250, flip: true });
        cast.harry = muggle(k, { x: 930, y: 440, w: 220, flip: true });
        const d = k.box(cast.dudley);
        cast.bow = k.add(bowTie(), { x: d.x + d.w / 2 - 30, y: d.y + d.h * 0.7, w: 60, z: 13 });
      },
      async play(k) {
        const { vernon, petunia, dudley, bow, harry } = cast;
        await k.wait(500);
        await k.say('bigNight', vernon);
        await k.wait(200);
        await k.say('onceMore', vernon);
        await k.to(petunia, 0.3, { rotation: 3 });
        await k.say('inLounge', petunia);
        await k.to(petunia, 0.3, { rotation: 0 });
        await k.say('dudley', vernon);
        // Dudley's sickly little bow.
        await k.all(k.to(dudley, 0.3, { y: '+=16' }), k.to(bow, 0.3, { y: '+=16' }));
        await k.say('coats', dudley);
        await k.all(k.to(dudley, 0.3, { y: '-=16' }), k.to(bow, 0.3, { y: '-=16' }));
        await k.all(k.say('lovehim', vernon), k.to(vernon, 1.2, { x: '+=30' }));
        await k.say('notThere', harry);
        k.fx.stomp(2, 0.3);
        await k.all(k.say('tooRight', vernon), k.to(vernon, 1.8, { x: '+=60', ease: 'sine.inOut' }));
        await k.to(petunia, 0.25, { y: '-=18', yoyo: true, repeat: 1 });
        await k.say('mountain', petunia);
        await k.wait(300);
        // Harry slopes off upstairs, talking to himself.
        k.fx.patter(8, 0.2);
        await k.all(k.say('upstairs', harry), k.to(harry, 3, { x: '+=90', ease: 'none' }));
        await k.exit(harry, 'right', 0.8);
      },
    },

    // ==================================================== 2. Someone on the bed
    {
      name: 'Someone on the bed',
      set(k) {
        k.backdrop('bedroom');
        k.music('magic');
        cast.bed = k.add(bedBack(), { x: 30, y: 420, w: 470, z: 8 });
        cast.dobby = k.character('dobby', { x: 130, y: 300, w: 220, z: 10 });
        cast.bedFront = k.add(bedFront(), { x: 30, y: 420, w: 470, z: 12 });
        cast.harry = muggle(k, { x: 860, y: 400, w: 235, flip: true });
        k.set(cast.harry, { opacity: 0 });
      },
      async play(k) {
        const { dobby, harry } = cast;
        // Dobby bounces on the bed. A creak and a boing at every bounce.
        const bounce = (async () => {
          for (let i = 0; i < 4; i++) {
            k.fx.boing();
            await k.hop(dobby, 90, 1);
          }
        })();
        await k.wait(700);
        k.fx.patter(4, 0.15);
        await k.enter(harry, 'right', 0.8);
        await k.say('erHello', harry);
        await bounce;

        // Down he hops, ears flapping, and bows very low.
        k.fx.pop();
        await k.all(k.to(dobby, 0.5, { x: 330, y: 20, ease: 'power1.inOut' }), k.wait(150).then(() => k.fx.thud()));
        await k.to(dobby, 0.5, { rotation: 22, y: 50 });
        await k.say('honour', dobby);
        await k.to(dobby, 0.4, { rotation: 0, y: 20 });
        await k.say('shh', harry);
        await k.say('justDobby', dobby);

        // Downstairs: the doorbell and Vernon's big laugh.
        await noiseOff(k, { listeners: [harry, dobby], sound: doorbell, line: 'golf', beat: 400 });
        await k.say('pleaseQuiet', harry);

        // Dobby leans in and whispers, eyes wide.
        await k.to(dobby, 0.4, { x: '+=70' });
        await k.say('danger', dobby);
        await k.say('mustGoBack', harry);
        await k.say('friendsWrite', dobby);
        await k.say('noLetters', harry);

        // The letters come out of the pillowcase.
        const d = k.box(dobby);
        const bundle = k.add(letterBundle(), { x: d.x + 50, y: d.y + 140, w: 130, z: 13 });
        k.fx.pop();
        await k.appear(bundle, 0.4);
        await k.say('theseLetters', dobby);
        // Harry reaches; Dobby hops nimbly away.
        await k.say('myLetters', harry);
        await k.to(harry, 0.3, { x: '-=60' });
        k.fx.whizz();
        await k.all(k.to(dobby, 0.5, { x: '-=170', y: '-=60', ease: 'power2.out' }), k.to(bundle, 0.5, { x: '-=170', y: '-=60', ease: 'power2.out' }));
        await k.all(k.to(dobby, 0.25, { y: '+=60', ease: 'power2.in' }), k.to(bundle, 0.25, { y: '+=60', ease: 'power2.in' }));
        await k.to(harry, 0.3, { x: 0 });
        await k.say('promise', dobby);
        await k.say('cantPromise', harry);
        await k.say('noChoice', dobby);

        // Crack! Gone, and the letters with him.
        await k.vanish(bundle, 0.2);
        await apparate(k, dobby, false);
        await k.wait(500);
        k.fx.uhoh();
        await k.say('kitchenPudding', harry);
        k.fx.patter(6, 0.1);
        await k.exit(harry, 'left', 0.7);
      },
    },

    // ==================================================== 3. The pudding
    {
      name: 'The pudding',
      set(k) {
        k.backdrop('dursley-kitchen');
        k.music('adventure');
        cast.pudding = k.prop('pudding', { x: 430, y: 60, w: 200, z: 12 });
        cast.dobby = k.character('dobby', { x: 880, y: 305, w: 175, z: 9 });
        cast.harry = muggle(k, { x: 160, y: 430, w: 230 });
        k.set(cast.harry, { opacity: 0 });
        // Vernon and the Masons are waiting at the door (right), out of sight.
        cast.mrs = k.character('mrsMason', { x: 610, y: 490, w: 175, flip: true, z: 10 });
        cast.mr = k.character('mrMason', { x: 735, y: 475, w: 190, flip: true, z: 11 });
        cast.vernon = k.character('vernon', { x: 940, y: 419, w: 240, flip: true, z: 12 });
        k.set([cast.mrs, cast.mr, cast.vernon], { opacity: 0 });
        cast.owl = k.add(flyingOwl(), { x: 500, y: 230, w: 140, z: 14 });
        k.set(cast.owl, { opacity: 0 });
      },
      async play(k) {
        const { pudding, dobby, harry, mrs, mr, vernon, owl } = cast;
        // The pudding floats near the ceiling and wobbles.
        void k.to(pudding, 1.6, { y: '-=24', yoyo: true, repeat: 40, ease: 'sine.inOut' });
        void k.to(pudding, 1.1, { rotation: 7, yoyo: true, repeat: 60, ease: 'sine.inOut' });
        k.fx.twinkle();
        await k.wait(900);
        k.fx.patter(6, 0.12);
        await k.enter(harry, 'left', 0.8);
        await k.say('putItDown', harry);
        await k.say('sayIt', dobby);
        await k.say('cant', harry);

        // Dobby clicks his fingers: ting. The pudding drifts, wobbles, tips and falls.
        await k.to(dobby, 0.2, { rotation: 6 });
        ting();
        await k.to(dobby, 0.2, { rotation: 0 });
        await k.to(pudding, 0.9, { x: -40, y: 20, rotation: -22, ease: 'sine.inOut', overwrite: 'auto' });
        k.fx.uhoh();
        await k.all(k.say('catchIt', harry), k.to(pudding, 0.6, { x: -50, y: 60, rotation: -48, ease: 'sine.in', overwrite: 'auto' }));

        // The big save: Harry dives and catches it.
        k.fx.whizz();
        await k.all(
          k.to(harry, 0.35, { x: 150, y: -60, ease: 'power1.out' }).then(() => k.to(harry, 0.3, { x: 260, y: 0, ease: 'power1.in' })),
          k.to(pudding, 0.65, { x: 0, y: 200, rotation: 0, ease: 'power2.in', overwrite: 'auto' }),
        );
        k.fx.boing();
        k.flourish(pudding);
        await k.pop(pudding, 1.08);
        await k.to(pudding, 0.4, { y: 150, ease: 'back.out(2)' });
        await k.wait(300);
        await k.say('gotIt', harry);

        // Dobby says sorry: crack, he is gone, and the pudding jumps clean out of Harry's hands.
        await k.say('sorry', dobby);
        const jump = (async () => {
          k.fx.whizz();
          await k.to(pudding, 0.45, { x: -150, y: -10, rotation: -180, ease: 'power1.out' });
          await k.to(pudding, 0.45, { x: -300, y: 382, rotation: -360, ease: 'power1.in' });
        })();
        await k.all(apparate(k, dobby, false), jump);

        // SPLAT, on the floor. Cream everywhere, but nobody is hit.
        k.remove(pudding);
        const mess = k.prop('puddingSplat', { x: 80, y: 560, w: 300, z: 9 });
        splat();
        k.fx.splash();
        k.puff(230, 590, 200, '#fbf3e0');
        await k.pop(mess, 1.12);
        await k.wait(700);
        await k.say('ohNo', harry);

        // In they all come: Vernon and the Masons crowd in at the door.
        k.fx.patter(6, 0.12);
        await k.all(k.enter(vernon, 'right', 0.7), k.wait(120).then(() => k.enter(mr, 'right', 0.7)), k.wait(240).then(() => k.enter(mrs, 'right', 0.7)));
        await k.to(k.part(vernon, 'cross'), 0.4, { opacity: 0.6 });
        await k.say('explain', vernon);

        // An owl swoops in at the window and drops a letter.
        k.sfx.hoot();
        await swoopIn(k, owl, 'left', 1.2);
        flutter(6);
        const letter = k.prop('owlPostLetter', { x: 520, y: 280, w: 110, z: 15 });
        await k.appear(letter, 0.3);
        await k.to(letter, 0.7, { y: '+=330', x: '+=20', rotation: 40, ease: 'power2.in' });
        k.fx.thud();
        await k.wait(400);

        // Mrs Mason can't abide birds.
        k.fx.uhoh();
        const wobble = k.to(mrs, 0.08, { x: '+=12', yoyo: true, repeat: 7 });
        await k.all(k.say('bird', mrs), wobble);
        k.fx.patter(8, 0.08);
        await k.exit(mrs, 'right', 0.7);
        await k.all(k.say('comeDear', mr), k.to(mr, 1.2, { x: '+=40' }));
        k.fx.patter(6, 0.08);
        await k.exit(mr, 'right', 0.6);
        slam();
        await k.quake(6);
        void flyOff(k, owl, 'left', 0.9);
        await k.wait(500);

        // The scary beat: Vernon, purple, looms. Camera in on him, short.
        k.silence();
        k.sfx.ominous();
        await k.to(harry, 0.4, { x: '+=-90' });
        void k.camera({ zoom: 1.45, x: 640, y: 400 }, 1.4);
        await k.all(k.say('gone', vernon), k.to(k.part(vernon, 'cross'), 1.2, { opacity: 1 }), k.to(vernon, 2.6, { x: '-=240', ease: 'sine.inOut' }));
        await k.say('elf', harry);
        k.fx.stomp(2, 0.35);
        await k.all(k.say('noSchool', vernon), k.to(vernon, 2.2, { x: '-=20', ease: 'sine.inOut' }));
        await k.wait(500);
        await k.camera({}, 0.8);
      },
    },

    // ==================================================== 4. The rescue
    {
      name: 'The rescue',
      set(k) {
        k.backdrop('privet-drive-night');
        k.music('dreamy');
        // Harry's lit window with the bars over it; Hedwig and her cage, and a very small Harry.
        cast.windowLight = k.light(610, 245, 80, { color: '#ffe0a0', strength: 0.55, z: 5 });
        cast.harry = muggle(k, { x: 554, y: 206, w: 68, z: 6 });
        cast.cage = k.prop('owlCage', { x: 612, y: 232, w: 50, z: 7 });
        cast.hedwig = k.character('hedwig', { x: 618, y: 240, w: 42, z: 8 });
        cast.bars = k.prop('windowBars', { x: WIN.x, y: WIN.y, w: 100, z: 12 });
        // Vernon's window, next door: dark until he looks out.
        cast.vernonLight = k.light(790, 245, 80, { color: '#ffd890', strength: 0.55, z: 5 });
        cast.vernon = k.character('vernon', { x: 740, y: 190, w: 100, z: 6 });
        k.set([cast.vernonLight, cast.vernon], { opacity: 0 });
        // The car waits off stage right, with its lamps and heads unlit.
        cast.car = k.prop('flyingCar', { x: CAR.x, y: CAR.y, w: CAR.w, z: 11 });
        k.set(cast.car, { x: 700, opacity: 0 });
        cast.rope = k.add(rope(), { x: ROPE.x, y: ROPE.y, w: 190, z: 13 });
        k.set(cast.rope, { opacity: 0, scaleX: 0.02, transformOrigin: '100% 100%' });
        void k.camera({ zoom: 2.4, x: 610, y: 250 }, 0);
      },
      async play(k) {
        const { harry, cage, hedwig, bars, car, rope: line, windowLight, vernon, vernonLight } = cast;
        await k.wait(900);
        await k.say('bars');
        await k.say('stuck', harry);
        await k.wait(500);

        // A soft engine purr, headlights, and a flying car floats up beside the window.
        engine(3);
        await k.wait(800);
        await k.all(
          k.camera({ zoom: 1.45, x: 770, y: 330 }, 1.8),
          k.to(car, 1.8, { x: 0, opacity: 1, ease: 'power2.out' }),
          k.wait(900).then(() => k.fade(k.part(car, 'lamps'), 1, 0.8)),
        );
        k.float(car, 6, 2.4);
        await k.wait(300);
        await k.fade(k.part(car, 'ron'), 1, 0.4);
        const ronSeat = seat(k, car, 'ron');
        const fredSeat = seat(k, car, 'fred');
        await k.say('itsUs', ronSeat);
        k.fx.boing();
        await k.hop(harry, 14, 1);
        await k.say('flying', harry);
        await k.fade(k.part(car, 'fred'), 1, 0.4);
        await k.say('dadsCar', fredSeat);

        // Ron throws a rope across; Harry ties it to the bars.
        await k.say('rope', ronSeat);
        k.set(line, { opacity: 1 });
        k.sfx.whoosh();
        await k.to(line, 0.6, { scaleX: 1, ease: 'power2.out' });
        k.set(line, { transformOrigin: '0% 0%' });
        k.sfx.tap();
        await k.wait(250);
        k.sfx.tap();
        k.flourish(bars);
        await k.say('tied', harry);

        // George: hold on tight! The car revs, the rope goes taut, and the bars come off.
        await k.all(k.say('holdTight', car), k.wait(500).then(() => rev()));
        await k.to(car, 0.35, { x: '+=-14', ease: 'sine.in' });
        await k.all(k.to(car, 0.35, { x: '+=150', ease: 'power2.in' }), k.to(line, 0.35, { scaleX: 1.8, ease: 'power2.in' }));
        k.fx.crash();
        void k.quake(8);
        k.puff(WIN.x + 50, WIN.y + 50, 160, '#7a7f96');
        await k.all(
          k.to(bars, 0.9, { x: '-=10', y: '+=360', rotation: -40, ease: 'power2.in' }),
          k.to(line, 0.9, { x: '+=10', y: '+=330', rotation: 30, opacity: 0.0, ease: 'power2.in' }),
        );
        k.fx.thud();
        k.puff(WIN.x + 40, WIN.y + 380, 140, '#2f4f4a');
        // Only once the bars are down does the car come back to the window, so they never fall across it.
        await k.to(car, 0.6, { x: '-=150', ease: 'power2.out' });
        await k.wait(500);

        // The lights come on next door: Vernon, purple, at the window.
        k.sfx.ominous();
        await k.all(k.fade(vernonLight, 1, 0.5), k.fade(vernon, 1, 0.5));
        await k.to(k.part(vernon, 'cross'), 0.5, { opacity: 1 });
        await k.all(k.say('escaping', vernon), k.shake(vernon, 5, 3));

        // Harry passes Hedwig's cage into the car, then climbs in himself.
        const c = k.box(cage);
        const t = k.box(car);
        const dx = t.x + t.w * 0.62 - (c.x + c.w / 2);
        const dy = t.y + t.h * 0.45 - (c.y + c.h / 2);
        k.sfx.hoot();
        await k.all(k.carry(cage, [c.x + c.w / 2 + dx, c.y + c.h / 2 + dy], 1.0), k.to(hedwig, 1.0, { x: dx, y: dy }));
        await k.all(k.vanish(cage, 0.3), k.vanish(hedwig, 0.3));
        k.fx.pop();
        const h = k.box(harry);
        await k.all(
          k.to(harry, 0.9, { x: t.x + t.w * 0.55 - (h.x + h.w / 2), ease: 'power1.inOut' }),
          k.to(harry, 0.45, { y: '-=50', ease: 'power1.out' }).then(() => k.to(harry, 0.45, { y: `+=${t.y + t.h * 0.3 - h.y}`, ease: 'power1.in' })),
        );
        await k.vanish(harry, 0.25);
        k.fx.thud();
        await k.say('floorIt', ronSeat);

        // Up and away over the roofs.
        void k.fade(windowLight, 0.2, 1);
        k.sfx.whoosh();
        void k.camera({ zoom: 1.1, x: 640, y: 330 }, 1.4);
        await k.to(car, 1.5, { x: '+=800', y: '-=420', rotation: -12, ease: 'power2.in', overwrite: 'auto' });
        await k.wait(400);
        await k.camera({}, 0.3);

        // Cut to the stars: the car flies past the moon.
        await k.cut(() => {
          k.backdrop('starry-sky');
          k.music('triumph');
          k.ambient('stars', { count: 18 });
          cast.moon = k.prop('crescentMoon', { x: 100, y: 110, w: 340, z: 3 });
          cast.car = k.prop('flyingCar', { x: 400, y: 330, w: 440, z: 12, flip: true });
          k.set(cast.car, { x: -1000 });
          cast.harry = muggle(k, { x: 504, y: 285, w: 140, z: 10 }); // behind the car: only his head pops up above the roof
          cast.hedwig = k.character('hedwig', { x: 760, y: 170, w: 170, z: 14, pose: 'fly' });
          k.set([cast.harry, cast.hedwig], { opacity: 0 });
        });
        const sky = cast; // the actors made by the cut (the cast now holds the sky's car, Harry and Hedwig)
        engine(3);
        await k.to(sky.car, 1.9, { x: 0, ease: 'power1.out' });
        const skyRon = seat(k, sky.car, 'ron');
        await k.all(k.fade(k.part(sky.car, 'ron'), 1, 0.4), k.fade(k.part(sky.car, 'fred'), 1, 0.4), k.fade(k.part(sky.car, 'lamps'), 1, 0.4));
        k.set(sky.hedwig, { opacity: 1 });
        void flap(k, sky.hedwig, 30, 24);
        flutter(14);
        k.sfx.hoot();
        await k.wait(300);
        await k.say('lateBirthday', skyRon);
        k.set(sky.harry, { opacity: 1 });
        await k.hop(sky.harry, 20, 1);
        await k.say('bestPresent', sky.harry);
        k.fx.twinkle();
        k.sparkle(560, 300, 14, 220);
        await k.wait(500);
        await k.all(k.to([sky.car, sky.harry], 3, { x: '+=900', y: '-=120', ease: 'power2.in' }), k.to(sky.hedwig, 3, { x: '+=800', y: '-=60', ease: 'power2.in' }));
      },
    },
  ],
});
