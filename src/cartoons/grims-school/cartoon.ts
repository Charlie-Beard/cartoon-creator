/**
 * The School for Bad Brownies: the tired Wishing-Chair crash-lands in Mr
 * Grim's schoolroom, and he locks it in his cupboard.
 *
 *   1. The playroom. A wet, grey afternoon, and everyone is bored, even
 *      Jigs. Then the chair wriggles: it wants an adventure. Mollie
 *      pats the chair to wake its wings. "Take us somewhere exciting!"
 *   2. Up in the sky. Out of the rain into the sunshine. But the wings are
 *      tired: they droop, and the chair sinks. Jigs urges the wings
 *      on for one more flap. There's a grey house on a hill with its window
 *      open, and a sign: Mr Grim's School for Bad Brownies. Jigs knows him:
 *      the crossest teacher in all of Fairyland. Too late: in they go!
 *   3. The schoolroom. Mr Grim is at his blackboard: "No wriggling! No
 *      giggling!" The chair whizzes in at the window and bumps down in the
 *      middle of the lesson. Mr Grim looms: "LATE! New bad brownies!" No
 *      flying chairs in HIS school: he marches it into his cupboard, locks
 *      it and hangs the key on a hook. Back to the heroes: how will they get
 *      home? Mollie: let's be brave, we'll get it back.
 *   4. The lesson. "How to be GOOD." While Mr Grim writes on the board,
 *      Mollie tiptoes the key from the hook over to Jigs. Mr Grim spins round:
 *      "Who is WHISPERING?" "Nobody, Mr Grim!" Jigs can't get past him to
 *      the cupboard, but the board rubber is full of chalk dust. Jigs
 *      flicks it. ATISHOO! Mr Grim's hat falls over his eyes, Jigs scurries
 *      behind him and unlocks the cupboard, and out flies the chair.
 *   5. Loop-the-loop. Mr Grim jumps into the chair to stop it, and it flies
 *      him round and round the room. "Put me DOWN!" Then he laughs, for the
 *      first time in a hundred years. Jigs coaxes the chair to bring
 *      him down gently. Dizzy and happy, Mr Grim says no more lessons today:
 *      go and play! Gold stars for everyone, even the chair. Mr Grim
 *      sticks the gold star on the chair himself. Home to the playroom, where the
 *      rain has stopped, and the chair keeps its star.
 *
 * Scary, never cruel (docs/STYLE.md): Mr Grim looms, barks and smacks his
 * ruler down on nothing but the air, and he never touches anyone; the
 * chair goes into the cupboard because he orders it, tired and droopy. It
 * cuts back to the heroes with a brave line each time. His defeat is a
 * sneeze, then a ride he ends up loving: he's the one who says "go and
 * play".
 *
 * The chair and its riders are the world's chairRide set piece; Mr Grim,
 * the schoolroom and its cupboard are in the world. The school on its hill,
 * the brownies at their desks, the hook and key, the board rubber and the
 * chalk writing are drawn here.
 */
import { C, cached, circle, defineCartoon, ellipse, ink, noiseBurst, now, piece, poly, rect, svg, tone, type Kit } from '../../kit';
import { sounds as common } from '../../worlds/common/moves';
import { warmEnding } from '../../worlds/common/pieces';
import { sounds as faraway } from '../../worlds/faraway/moves';
import { moves as wishing, sounds } from '../../worlds/wishing/moves';
import { chairRide, type Ride } from '../../worlds/wishing/pieces';
import meta from './meta';

const { creak, hatBell, highWind } = sounds;
const { click, laugh, giggle } = common;
const { smack, chalk } = faraway;

// ------------------------------------------------------------------- art

/** Mr Grim's school on its hill, seen from the sky: grey stone, a bell tower, a sign, one window open and glowing. 340 × 280. */
const school = cached(() =>
  svg({ w: 340, h: 280, name: 'grims-school-school', label: 'A school on a hill' }, [
    piece(ellipse(170, 280, 190, 70), C.leafDark, { shadow: false }),
    piece(rect(150, 30, 46, 80, 2), C.stone),
    piece(poly([[144, 34], [173, 0], [202, 34]]), C.slate),
    piece(circle(173, 62, 12), C.brass, { shadow: false }),
    piece(rect(60, 110, 230, 140, 3), C.stone),
    piece(poly([[46, 114], [175, 52], [304, 114]]), C.slate),
    piece(rect(90, 150, 40, 54, 2), C.charcoal, { edge: 'cut' }),
    piece(rect(220, 150, 40, 54, 2), C.goldLight, { edge: 'cut' }),
    piece(rect(158, 180, 36, 70, 2), C.brownDark, { edge: 'cut' }),
    // the sign on its post
    piece(rect(14, 196, 8, 64, 2), C.brownDark, { shadow: false }),
    piece(rect(0, 170, 70, 40, 3), C.cream),
    ink([[10, 184], [58, 182]], { width: 3, color: C.ink, wobble: 1.5 }),
    ink([[10, 196], [48, 195]], { width: 3, color: C.ink, wobble: 1.5 }),
  ]),
);

/**
 * Three little brownies at their desks, seen from behind: brown hoods, pointy
 * ears poking out. They sit in front of the backdrop's desks. 300 × 140.
 */
const brownies = cached(() =>
  svg({ w: 300, h: 140, name: 'grims-school-brownies', label: 'Three brownies at their desks' }, [
    ...[50, 150, 250].flatMap((cx, i) => [
      piece(ellipse(cx, 124, 44, 40), i === 1 ? C.greenDark : C.brown),
      piece(poly([[cx - 36, 40], [cx - 30, 26], [cx - 46, 16]]), C.skinShade, { shadow: false }),
      piece(poly([[cx + 36, 40], [cx + 30, 26], [cx + 46, 16]]), C.skinShade, { shadow: false }),
      piece(poly([[cx - 32, 88], [cx - 30, 40], [cx + 4, i === 1 ? 0 : 6], [cx + 30, 42], [cx + 32, 88]]), C.brownDark),
    ]),
  ]),
);

/** The brass hook on the wall, a little peg. 40 × 40. */
const hook = cached(() =>
  svg({ w: 40, h: 40, name: 'grims-school-hook', label: 'A hook' }, [
    piece(circle(20, 14, 10), C.brassDark, { edge: 'cut' }),
    ink([[20, 14], [20, 34], [30, 30]], { width: 5, color: C.brass }),
  ]),
);

/** The cupboard key: a big brass key with a round bow. 70 × 140. */
const key = cached(() =>
  svg({ w: 70, h: 140, name: 'grims-school-key', label: 'A big key' }, [
    piece(circle(35, 30, 26), C.brass, { edge: 'cut' }),
    piece(circle(35, 30, 11), C.stone, { shadow: false }),
    piece(rect(28, 50, 14, 76, 4), C.brass, { edge: 'cut' }),
    piece(rect(40, 100, 22, 10, 2), C.brass, { edge: 'cut' }),
    piece(rect(40, 116, 16, 10, 2), C.brass, { edge: 'cut' }),
  ]),
);

/** The board rubber: a wooden back with red felt, all chalky. Laid over (and bigger than) the one painted on the ledge, so there's only one to tap. 70 × 34. */
const rubber = cached(() =>
  svg({ w: 70, h: 34, name: 'grims-school-rubber', label: 'A board rubber' }, [
    piece(rect(4, 4, 62, 14, 4), C.wood, { edge: 'cut' }),
    piece(rect(2, 16, 66, 14, 3), C.rust, { edge: 'cut' }),
    piece(ellipse(24, 26, 12, 4), C.chalk, { shadow: false, fibre: false }),
    piece(ellipse(48, 24, 10, 4), C.chalk, { shadow: false, fibre: false }),
  ]),
);

// ---------------------------------------------------------------- sounds

/** "Ah… ah… ah…" then the big ATISHOO: three rising breaths and a burst. */
function sneezeSound(): void {
  const t = now();
  for (let i = 0; i < 3; i++) tone(260 + i * 60, t + i * 0.45, { wave: 'triangle', peak: 0.04, attack: 0.1, decay: 0.3, glideTo: 320 + i * 70 });
  noiseBurst(t + 1.45, { freq: 1800, q: 0.8, peak: 0.16, attack: 0.01, decay: 0.35, sweepTo: 500 });
  tone(420, t + 1.45, { wave: 'triangle', peak: 0.06, decay: 0.3, glideTo: 180 });
}

// ------------------------------------------------------------------ cast

const cast = {} as Record<'mollie' | 'peter' | 'jigs' | 'grim' | 'cupboard' | 'brownies' | 'key' | 'rubber' | 'words' | 'school' | 'star', HTMLElement>;
let ride: Ride;

/** In the schoolroom: the cupboard on the right, the hook beside it, the brownies at their desks, the friends behind them. */
const CUPBOARD = { x: 870, y: 200, w: 280, z: 6 };
const HOOK = { x: 836, y: 150, w: 40, z: 7 };
const KEY = { x: 822, y: 170, w: 60, z: 8 };
const BROWNIES = { x: 50, y: 556, w: 270, z: 18 };
/** Mr Grim writing on the board (pose back), and where the friends stand while he does. */
const AT_BOARD = { x: 440, y: 350, w: 260, z: 9 };
/** Where he stands when the chair crashes in: right of the board, clear of where it lands. */
const BY_CUPBOARD = { x: 600, y: 350, w: 260, z: 9 };
const MOLLIE = { x: 0, y: 400, w: 200 };
const PETER = { x: 150, y: 405, w: 200 };
const JIGS = { x: 335, y: 470, w: 140 };

/** Every piece of a ride (chair, riders, front), to tween together where the set piece has no move for it. */
const ridePieces = (a: Ride): HTMLElement[] => [a.chair, ...a.riders, a.front];

/** The schoolroom as it always stands: backdrop, cupboard, hook, the brownies and the chalk words (hidden). */
function schoolroom<K extends string>(k: Kit<K>, o: { doorsOpen?: boolean; key?: boolean; words?: boolean } = {}): void {
  k.backdrop('grim-schoolroom');
  k.light(160, 240, 220, { color: '#fff3c8', strength: 0.25, z: 5 });
  cast.cupboard = k.prop('school-cupboard', CUPBOARD);
  if (o.doorsOpen) k.set(doors(k), { scaleX: 0.15 });
  k.add(hook(), HOOK);
  cast.key = k.add(key(), KEY);
  if (!o.key) k.set(cast.key, { opacity: 0 });
  cast.brownies = k.add(brownies(), BROWNIES);
  cast.words = k.lettering('BE GOOD!', { x: 600, y: 230, size: 64, color: C.chalk, z: 4 });
  if (!o.words) k.set(cast.words, { opacity: 0 });
}

/** The cupboard's two doors, ready to swing about their hinges. */
function doors<K extends string>(k: Kit<K>): SVGGElement[] {
  return [...k.pivot(k.part(cast.cupboard, 'doorL')), ...k.pivot(k.part(cast.cupboard, 'doorR'))];
}

/** Mr Grim raises his ruler and smacks it down through the air, with a crack and a little shake of the stage. */
async function rulerSmack(k: Kit, grim: HTMLElement): Promise<void> {
  const arm = k.pivot(k.part(grim, 'armR'));
  await k.to(arm, 0.3, { rotation: -25, ease: 'power2.out' });
  await k.to(arm, 0.14, { rotation: 20, ease: 'power3.in' });
  smack();
  void k.quake(4);
  await k.to(arm, 0.4, { rotation: 0, ease: 'power2.out' });
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. The playroom
    rainy: { who: 'narrator', text: 'It was a wet, grey afternoon. The rain went pitter-patter on the playroom roof.' },
    bored: { who: 'peter', text: 'Rain, rain, rain. There’s nothing to do!' },
    hello: { who: 'mollie', text: 'I know. We’re so bored, even Jigs is yawning.' },
    yawn: { who: 'jigs', text: 'Yaaawn. Hmm? Wait! Something’s wriggling!' },
    wriggles: { who: 'jigs', text: 'It’s the chair! It wants to go on an adventure!' },
    mollieWake: { who: 'mollie', text: 'Let’s wake up its wings. I’ll give it a pat. Wake up, chair!' },
    hooray: { who: 'peter', text: 'Its wings! Hooray!' },
    wish: { who: 'mollie', text: 'Take us somewhere exciting, chair. Off we go!' },
    // 2. Up in the sky
    wheee: { who: 'peter', text: 'Wheee! The fields look as small as stamps!' },
    droop: { who: 'jigs', text: 'Uh-oh. The wings are drooping. They’re tired!' },
    sinking: { who: 'mollie', text: 'We’re sinking! We need somewhere to land.' },
    jigsFlap: { who: 'jigs', text: 'Tap, tap! Come on, wings! One more flap!' },
    house: { who: 'peter', text: 'Look! A big grey house on a hill. And its window’s open!' },
    sign: { who: 'mollie', text: 'There’s a sign. Mr Grim’s School for Bad Brownies!' },
    crossest: { who: 'jigs', text: 'Mr Grim? Oh no. He’s the crossest teacher in all of Fairyland!' },
    tooLate: { who: 'peter', text: 'Too late! Hold on tight!' },
    // 3. The schoolroom
    lesson: { who: 'narrator', text: 'In the schoolroom, Mr Grim was teaching his bad brownies.' },
    noGiggling: { who: 'grim', text: 'Sit up straight, bad brownies! No wriggling! No giggling!' },
    whatIsThat: { who: 'grim', text: 'WHAT… is THAT?' },
    afternoon: { who: 'jigs', text: 'Er… good afternoon, Mr Grim.' },
    late: { who: 'grim', text: 'LATE! Three new bad brownies, and late for school!' },
    notBrownies: { who: 'mollie', text: 'But we’re not brownies. I’m Mollie, and this is Peter.' },
    silence: { who: 'grim', text: 'SILENCE! And NO flying chairs in MY school!' },
    march: { who: 'grim', text: 'Into my cupboard, chair. March!' },
    locked: { who: 'grim', text: 'There. Locked up tight. Now stand still, all of you!' },
    howHome: { who: 'peter', text: 'Our chair’s locked in! How will we ever get home?' },
    brave: { who: 'mollie', text: 'Don’t worry. Let’s be brave. We’ll get it back.' },
    // 4. The lesson
    beGood: { who: 'grim', text: 'Today’s lesson is how to be GOOD. Watch the board!' },
    psst: { who: 'jigs', text: 'Psst! Look, the cupboard key. It’s on that hook!' },
    mollieKey: { who: 'mollie', text: 'I’ll tiptoe over and get it for you. Shh!' },
    gotKeyMollie: { who: 'jigs', text: 'Got it! Thank you, Mollie!' },
    whispering: { who: 'grim', text: 'Hmm? Who is WHISPERING?' },
    nobody: { who: 'mollie', text: 'Nobody, Mr Grim!' },
    hmph: { who: 'grim', text: 'Hmph. Eyes on the board!' },
    dusty: { who: 'peter', text: 'That board rubber’s full of chalk dust. It might make him sneeze!' },
    jigsRubber: { who: 'jigs', text: 'Watch this. I’ll give it a flick. Puff!' },
    atishoo: { who: 'grim', text: 'Ah… ah… ah… ATISHOO!' },
    cantSee: { who: 'grim', text: 'My hat! I can’t SEE!' },
    free: { who: 'jigs', text: 'Click! You’re free, chair!' },
    comeBack: { who: 'grim', text: 'Hey! That CHAIR! Come back here!' },
    // 5. Loop-the-loop
    gotYou: { who: 'grim', text: 'Ha! Got you, chair! Now you’ll stay put!' },
    putMeDown: { who: 'grim', text: 'Whoa! Put me DOWN, you naughty chair!' },
    fun: { who: 'grim', text: 'Wheee! Oh! Oh, ha ha ha! This is FUN!' },
    hundred: { who: 'jigs', text: 'I don’t think he’s laughed for a hundred years!' },
    jigsDown: { who: 'jigs', text: 'Let’s bring him down. Down you come, chair. Gently now!' },
    spinny: { who: 'grim', text: 'Oh, my head’s all spinny!' },
    bestFun: { who: 'grim', text: 'That was the most fun I’ve had in a hundred years!' },
    play: { who: 'grim', text: 'No more lessons today! Off you go, brownies, and PLAY!' },
    stars: { who: 'grim', text: 'And gold stars for everyone. Even the chair!' },
    grimStar: { who: 'grim', text: 'I’ll stick it on myself. There!' },
    homeTime: { who: 'jigs', text: 'Now home, chair, before your wings get tired again!' },
    sunny: { who: 'peter', text: 'Home again! And look, the rain’s stopped.' },
    thanks: { who: 'mollie', text: 'Thank you, chair. What an adventure!' },
    end: { who: 'narrator', text: 'And the Wishing-Chair kept its gold star, and was very proud of it.' },
  },
  scenes: [
    // ==================================================== 1. The playroom
    {
      name: 'The playroom',
      set(k) {
        k.backdrop('playroom');
        k.music('dreamy');
        k.dim(0.45, '#3e4a5c');
        k.ambient('rain', { count: 18, z: 2, area: [70, 130, 260, 330] });
        k.ambient('rain', { count: 22, z: 2, area: [890, 150, 260, 480] });
        ride = chairRide.set(k, {
          x: 330,
          y: 177,
          w: 520,
          riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'arm', flip: true }],
        });
        [cast.mollie, cast.peter, cast.jigs] = ride.riders;
      },
      async play(k) {
        const { mollie, peter, jigs } = cast;
        await k.say('rainy');
        await k.say('bored', peter);
        await k.say('hello', mollie);
        await k.say('yawn', jigs);
        await wishing.wriggle(k, ride.chair, 3);
        hatBell();
        await k.all(k.say('wriggles', jigs), k.hop(jigs, 16, 1));

        // Mollie wakes the chair's wings.
        await k.say('mollieWake', mollie);
        k.flourish(ride.chair);
        k.music('magic');
        await chairRide.wings(k, ride);
        await chairRide.flap(k, ride, 2);
        await k.all(k.say('hooray', peter), k.shake(peter, 4, 2));
        k.music('adventure');
        await k.say('wish', mollie);
        highWind(2);
        await chairRide.fly(k, ride, { x: 900, y: -140, s: 2, tilt: -8 });
      },
    },

    // ==================================================== 2. Up in the sky
    {
      name: 'Up in the sky',
      set(k) {
        k.backdrop('wishing-sky');
        k.music('adventure');
        ride = chairRide.set(k, {
          x: 300,
          y: 170,
          w: 420,
          wings: true,
          riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'arm', flip: true }],
        });
        [cast.mollie, cast.peter, cast.jigs] = ride.riders;
        chairRide.jump(k, ride, { x: -800, y: 40 });
        cast.school = k.add(school(), { x: 1200, y: 330, w: 340, z: 4 });
      },
      async play(k) {
        const { mollie, peter, jigs, school: house } = cast;
        highWind(3);
        await chairRide.fly(k, ride, { x: 0, y: 0, s: 2.4 });
        await k.all(k.say('wheee', peter), chairRide.flap(k, ride, 2));

        // The wings droop, and down they sink.
        await wishing.droop(k, ride.chair);
        await k.say('droop', jigs);
        await k.all(...ridePieces(ride).map((el) => k.to(el, 1.4, { y: 110, ease: 'sine.inOut' })));
        await k.all(k.say('sinking', mollie), k.shake(mollie, 4, 2));

        // Jigs urges the wings on for one more flap.
        await k.say('jigsFlap', jigs);
        k.flourish(ride.chair);
        await chairRide.fly(k, ride, { y: 0, s: 1.4, flaps: 4 });

        // A grey school on a hill.
        await k.to(house, 2.2, { x: -380, ease: 'sine.out' });
        await k.say('house', peter);
        k.sparkle(840, 520, 8, 70);
        await k.say('sign', mollie);
        hatBell();
        await k.all(k.say('crossest', jigs), k.shake(jigs, 4, 2));
        await wishing.droop(k, ride.chair);
        await k.say('tooLate', peter);
        k.fx.whizz();
        await k.all(...ridePieces(ride).map((el) => k.to(el, 1.4, { x: 560, y: 200, scale: 0.4, opacity: 0, ease: 'power1.in' })));
      },
    },

    // ==================================================== 3. The schoolroom
    {
      name: 'The schoolroom',
      set(k) {
        schoolroom(k);
        k.music('sneaky');
        cast.grim = k.character('grim', { ...BY_CUPBOARD, pose: 'back' });
        ride = chairRide.set(k, {
          x: 180,
          y: 290,
          w: 380,
          wings: true,
          riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'armL' }],
        });
        [cast.mollie, cast.peter, cast.jigs] = ride.riders;
        chairRide.jump(k, ride, { x: -650, y: -260 });
      },
      async play(k) {
        const { mollie, peter, jigs, grim, brownies: row, key: hung } = cast;
        await k.say('lesson');
        chalk(0.8);
        await k.wait(900);
        k.pose(grim, 'default');
        k.fx.boing();
        await k.say('noGiggling', grim);
        await rulerSmack(k, grim);
        await k.shake(row, 3, 2);

        // WHOOSH: the chair zooms in at the window and bumps down.
        highWind(1.5);
        k.fx.whizz();
        await chairRide.fly(k, ride, { x: -150, y: -100, s: 0.9, flaps: 2 });
        await chairRide.land(k, ride);
        k.fx.crash();
        await k.shake(row, 5, 2);

        // Silence, then Mr Grim looms.
        k.silence();
        await k.wait(800);
        k.pose(grim, 'shout');
        k.sfx.ominous();
        await k.camera({ zoom: 1.3, x: 730, y: 420 }, 1.2);
        await k.say('whatIsThat', grim);
        await k.camera({}, 0.8);
        k.music('spooky');
        await k.say('afternoon', jigs);
        await k.say('late', grim);
        await rulerSmack(k, grim);

        // Out of the chair, and stand up straight.
        await chairRide.hopOff(k, ride, jigs, { x: 70, y: 420, w: 140 });
        await chairRide.hopOff(k, ride, mollie, { x: 200, y: 405, w: 200 });
        await chairRide.hopOff(k, ride, peter, { x: 350, y: 410, w: 200 });
        await k.say('notBrownies', mollie);
        k.pose(grim, 'shout');
        await k.all(k.say('silence', grim), k.shake(mollie, 4, 2), k.shake(peter, 4, 2));

        // Into the cupboard with it.
        await k.say('march', grim);
        k.fx.creak();
        await k.to(doors(k), 0.6, { scaleX: 0.15 });
        await wishing.droop(k, ride.chair);
        sounds.creak();
        await k.all(...[ride.chair, ride.front].map((el) => k.to(el, 1.8, { x: 650, y: -40, scale: 0.55, ease: 'sine.inOut' })));
        await k.all(...[ride.chair, ride.front].map((el) => k.fade(el, 0, 0.4)));
        k.fx.creak();
        await k.to(doors(k), 0.5, { scaleX: 1 });
        click();
        k.pose(grim, 'default');
        await k.appear(hung, 0.4);
        k.sfx.page();
        await k.say('locked', grim);

        // Back to the heroes.
        k.music('sneaky');
        await k.say('howHome', peter);
        await k.all(k.say('brave', mollie), k.to(mollie, 0.4, { x: '+=16' }));
      },
    },

    // ==================================================== 4. The lesson
    {
      name: 'The lesson',
      set(k) {
        schoolroom(k, { key: true });
        k.music('sneaky');
        cast.rubber = k.add(rubber(), { x: 660, y: 360, w: 110, z: 11 });
        cast.mollie = k.character('mollie', { ...MOLLIE, z: 12 });
        cast.peter = k.character('peter', { ...PETER, z: 13 });
        cast.jigs = k.character('jigs', { ...JIGS, z: 14 });
        cast.grim = k.character('grim', { ...AT_BOARD });
        // The chair, small and hidden inside the cupboard.
        ride = chairRide.set(k, { x: 400, y: 230, w: 380, z: 7, wings: true });
        k.set([ride.chair, ride.front], { x: 420, y: -10, scale: 0.55, opacity: 0 });
        k.set([...k.part(ride.chair, 'wingL'), ...k.part(ride.chair, 'wingR')], { opacity: 0 });
      },
      async play(k) {
        const { mollie, peter, jigs, grim, key: hung, rubber: duster, words } = cast;
        await k.say('beGood', grim);
        k.pose(grim, 'back');
        chalk(1.2);
        await k.fade(words, 1, 1.4);
        await k.all(k.say('psst', jigs), k.to(jigs, 0.4, { x: '-=10' }));

        // Mollie tiptoes the key off its hook to Jigs.
        await k.say('mollieKey', mollie);
        await k.carry(hung, jigs);
        click();
        await k.vanish(hung, 0.3);
        hatBell();
        await k.say('gotKeyMollie', jigs);

        // He spins round.
        k.pose(grim, 'shout');
        k.fx.boing();
        await k.all(k.shake(mollie, 3, 2), k.shake(peter, 3, 2), k.shake(jigs, 3, 2));
        await k.say('whispering', grim);
        await k.all(k.say('nobody', mollie), k.to(mollie, 0.3, { y: -6, yoyo: true, repeat: 1 }));
        k.pose(grim, 'default');
        await k.say('hmph', grim);
        k.pose(grim, 'back');
        // A quiet beat of chalk squeaking between the key and the sneeze.
        chalk(1.4);
        await k.wait(1800);
        k.sparkle(717, 392, 6, 60);
        await k.say('dusty', peter);

        // Jigs flicks the chalk dust.
        await k.say('jigsRubber', jigs);
        k.flourish(duster);
        k.fx.poof();
        k.puff(700, 380, 220, C.chalk);
        k.pose(grim, 'default');
        sneezeSound();
        await k.say('atishoo', grim);
        await k.all(k.shake(grim, 8, 2), k.to(k.part(grim, 'hat'), 0.4, { y: 50, ease: 'power2.in' }));
        giggle();
        k.music('adventure');
        await k.all(k.say('cantSee', grim), k.to(grim, 0.8, { x: -60, yoyo: true, repeat: 1, ease: 'sine.inOut' }));

        // Behind his back, Jigs scurries to the cupboard and unlocks it.
        jigs.style.zIndex = '8';
        k.fx.patter(8);
        await k.walk(jigs, 540, 1.6, 5);
        click();
        k.fx.creak();
        await k.to(doors(k), 0.6, { scaleX: 0.15 });
        sounds.creak();
        await k.all(...[ride.chair, ride.front].map((el) => k.to(el, 0.8, { opacity: 1, scale: 0.8, x: 420, y: -130, ease: 'back.out(1.4)' })));
        await chairRide.wings(k, ride);
        void chairRide.flap(k, ride, 3);
        hatBell();
        await k.say('free', jigs);
        k.pose(grim, 'shout');
        await k.say('comeBack', grim);
      },
    },

    // ==================================================== 5. Loop-the-loop
    {
      name: 'Loop-the-loop',
      set(k) {
        schoolroom(k, { doorsOpen: true, words: true });
        k.music('adventure');
        cast.mollie = k.character('mollie', { ...MOLLIE, z: 12 });
        cast.peter = k.character('peter', { ...PETER, z: 13 });
        cast.jigs = k.character('jigs', { x: 1010, y: 470, w: 140, z: 14, flip: true });
        ride = chairRide.set(k, { x: 370, y: 220, w: 440, wings: true, riders: [{ id: 'grim', slot: 'left' }] });
        [cast.grim] = ride.riders;
        cast.star = k.prop('star', { x: 230, y: 300, w: 100, z: 20 });
        k.set(cast.star, { opacity: 0 });
      },
      async play(k) {
        const { jigs, grim, brownies: row, star } = cast;
        await k.say('gotYou', grim);
        await wishing.wriggle(k, ride.chair, 2);

        // Round and round the room.
        highWind(4);
        await chairRide.fly(k, ride, { x: -180, y: -170, s: 1.2, tilt: -10 });
        k.pose(grim, 'shout');
        await k.say('putMeDown', grim);
        await chairRide.fly(k, ride, { x: 240, y: -200, s: 1.3, tilt: 10 });
        await chairRide.fly(k, ride, { x: 60, y: -40, s: 1.4 });
        await chairRide.fly(k, ride, { x: -160, y: -160, s: 1.2, tilt: -10 });
        k.pose(grim, 'laugh');
        laugh();
        await k.say('fun', grim);
        await chairRide.fly(k, ride, { x: 0, y: -120, s: 1.2, tilt: 8 });
        await k.say('hundred', jigs);

        // Jigs coaxes the chair down gently.
        await k.say('jigsDown', jigs);
        k.flourish(ride.chair);
        k.music('cosy');
        await chairRide.land(k, ride);
        await chairRide.hopOff(k, ride, grim, { x: 770, y: 350, w: 240 });
        k.pose(grim, 'dizzy');
        await k.all(k.say('spinny', grim), k.to(grim, 0.6, { x: '+=10', yoyo: true, repeat: 3, ease: 'sine.inOut' }));
        k.pose(grim, 'laugh');
        await k.say('bestFun', grim);
        await k.say('play', grim);
        laugh();
        await k.hop(row, 24, 2);

        // Gold stars.
        k.fx.twinkle();
        await k.appear(star, 0.5);
        await k.say('stars', grim);
        const back: [number, number] = [580, 300];
        await k.say('grimStar', grim);
        await k.carry(star, back);
        creak();
        k.sparkle(back[0], back[1], 12, 140);
        await k.all(k.say('homeTime', jigs), k.hop(jigs, 16, 1));

        // Home to the playroom, where the rain has stopped.
        await k.cut(() => {
          k.backdrop('playroom');
          k.light(1010, 380, 240, { color: '#fff3c8', strength: 0.3, z: 5 });
          ride = chairRide.set(k, {
            x: 330,
            y: 177,
            w: 520,
            wings: true,
            riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'back', flip: true }],
          });
          [cast.mollie, cast.peter, cast.jigs] = ride.riders;
          ride.riders.push(k.prop('star', { x: 420, y: 196, w: 80, z: 15 }));
          chairRide.jump(k, ride, { x: 760 });
        });
        // In at the garden doors, low over the floor (only x moves, so Peter can talk as it comes).
        highWind(2);
        await k.all(chairRide.fly(k, ride, { x: 0, s: 2, flaps: 3 }), k.wait(1300).then(() => k.say('sunny', cast.peter)));
        await chairRide.land(k, ride);
        creak();
        await k.say('thanks', cast.mollie);
        await warmEnding(k, { cast: [cast.mollie, cast.peter, cast.jigs], end: 'end', music: 'cosy' });
      },
    },
  ],
});
