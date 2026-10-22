/**
 * Teddy's Seaside Adventure: Bully Bear keeps spoiling everyone's
 * sand-castles, and Teddy beats him with an idea, not his muscles.
 *
 *   1. The competition (bear-beach). A gull, the waves. Captain Bear blows
 *      his whistle: the best sand-castle wins a prize, and he'll judge at
 *      teatime. His own castle, up on the dune, is "the finest castle on the
 *      beach!" Teddy and Barney are building theirs. His turn: he drags the
 *      red bucket onto the castle, it flips over and a new tower pops up (or
 *      Barney brings it and tips it). Thud, thud: Bully Bear swaggers in. "Sand-castles are for
 *      babies!" WHUMP goes his spade, and the castle is a heap. "Ha ha!"
 *      Off he runs. Barney: he's too big for any of us, what can we do?
 *      Teddy: "I've got an idea!"
 *   2. The pretend letter (bear-beach, by the rocks). Teddy whispers the
 *      plan: a pretend letter that says the prizes are buried under Captain
 *      Bear's castle. Said plainly: it's not true, but Bully will THINK it
 *      is. Scribble, scribble, a seal. Teeny trots in, and Teddy says it
 *      loudly, so the rocks can hear: take this secret letter to Teacher
 *      Bear! Bully's ears poke up behind the rock. His turn: he drags the
 *      letter over to Teeny, who holds it up; Bully leaps out and snatches
 *      it from the air above her (he never touches her). "That's what YOU
 *      think, Teddy Bear!" He reads it and runs off. "Good. I wanted him to!"
 *   3. Captain Bear's castle (bear-dunes). Bully digs into the grand castle,
 *      sand flying, the flag wobbling. Silence, three heavy steps, and
 *      Captain Bear comes. The scary beat: the camera pushes in and he ROARS:
 *      "You RUFFIAN!" Bully goes small: "I-I thought the prizes were here…"
 *      "Go away, and don't come back until you can play nicely." Bully slinks
 *      off, head down. Cut back wide: the friends come up, Teddy owns up to
 *      the note. His turn: Captain Bear's face is still stern, so he taps
 *      him for a tickle (or Teeny tickles him) and Captain Bear laughs:
 *      "Well, scupper me scallywags! Clever Teddy Bear!" But their castles are squashed, and it's nearly
 *      teatime. "Let's build the best castle ever!"
 *   4. Teatime (bear-beach). A brand new castle, a bit lumpy: his turn, he taps
 *      it and it's patted smooth (or Barney pats it). Bully comes back, slowly,
 *      head down: sorry, can I help? I'm good at digging. "Of course you
 *      can!" He digs the best moat ever and the sea fills it. His turn: he
 *      taps the flag and it flies up onto the top (or Teeny plants it).
 *      Teeny runs to fetch Captain Bear; the whistle, and the prize goes to
 *      the castle they all built together. Shell medals for every builder,
 *      Bully too, and Teddy takes Teeny hers. Teatime!
 *
 * Changed from the book (house rules, docs/STYLE.md "The bears"): Captain
 * Bear never threatens a spanking and never lifts or throws Bully. He roars
 * and points and sends him off; Bully comes back on his own, says sorry and
 * helps, and every builder gets a medal. Teeny leaves to fetch Captain Bear
 * in scene 4 so there are never more than four bears on stage.
 */
import { defineCartoon, noiseBurst, now, tone, type Kit } from '../../kit';
import { moves, sounds } from '../../worlds/bears/moves';
import { sounds as commonSounds } from '../../worlds/common/moves';
import { warmEnding } from '../../worlds/common/pieces';
import { boulder, heap, moat, turret } from './art';
import meta from './meta';

const { roar } = moves;
const { click, giggle, laugh } = commonSounds;

// ---------------------------------------------------------------- sounds

/** Bully's spade coming down on a castle: a soft, heavy WHUMP of sand. */
function whump(): void {
  const t = now();
  tone(90, t, { wave: 'sine', peak: 0.16, attack: 0.005, decay: 0.35, glideTo: 50 });
  noiseBurst(t, { freq: 500, q: 0.8, peak: 0.12, attack: 0.005, decay: 0.45, sweepTo: 200 });
}

/** A spadeful of sand: a dry, gritty scrape. `times` digs in a row. */
function dig(times = 3, gap = 0.4): void {
  const t = now();
  for (let i = 0; i < times; i++) noiseBurst(t + i * gap, { freq: 2400, q: 1.2, peak: 0.05, attack: 0.02, decay: 0.18, sweepTo: 1200 });
}

/** A pen scribbling on paper: quick little scratches. */
function scribble(): void {
  const t = now();
  for (let i = 0; i < 8; i++) noiseBurst(t + i * 0.11, { freq: 4200 + (i % 3) * 500, q: 3, peak: 0.025, attack: 0.01, decay: 0.07 });
}

/** The sea running into the moat: a soft rush and a few drips. */
function fillMoat(): void {
  const t = now();
  noiseBurst(t, { freq: 900, q: 0.7, peak: 0.06, attack: 0.3, decay: 1.2, sweepTo: 500 });
  [0.9, 1.15, 1.4].forEach((dt, i) => tone(900 + i * 180, t + dt, { wave: 'sine', peak: 0.04, attack: 0.005, decay: 0.12, glideTo: 1400 }));
}

// ------------------------------------------------------------------ cast

type Who = 'teddy' | 'barney' | 'teeny' | 'bully' | 'captain' | 'peek' | 'castle' | 'tower' | 'heap' | 'bucket' | 'letter' | 'big' | 'flag' | 'moat' | 'gull';
const cast = {} as Record<Who, HTMLElement>;

// Where the bears stand. Bears are whole teddies: the bottom of the portrait
// box is their feet, on the sand at about y 636.
const CUB = 220; // h 249
const CUB_Y = 387;
const TEENY = 180; // h 204
const TEENY_Y = 432;
const BULLY = 250; // h 283
const BULLY_Y = 355;
const CAPTAIN = 290; // h 329
const CAPTAIN_Y = 309;

export default defineCartoon({
  ...meta,
  lines: {
    // 1. The competition
    seaside: { who: 'narrator', text: 'Teddy Bear was at the seaside, and there was a sand-castle competition!' },
    ahoy: { who: 'captain-bear', text: 'Ahoy, little bears! The best sand-castle wins a prize. I’ll judge them at teatime!' },
    myCastle: { who: 'captain-bear', text: 'Mine is up on the dune. The finest castle on the beach!' },
    hello: { who: 'teddy', text: 'Hello, {name}! Look at our castle. It needs one more tower.' },
    askBucket: { who: 'teddy', text: 'Can you help? Drag the bucket onto the castle to make a tower!' },
    nudgeBucket: { who: 'teddy', text: 'Drag the red bucket over!' },
    barneyTips: { who: 'barney', text: 'I’ll bring it over and tip it. One, two, three!' },
    thanksBucket: { who: 'teddy', text: 'A brand new tower! Thank you, {name}!' },
    thanksBarney: { who: 'teddy', text: 'A brand new tower! Well done, Barney!' },
    babies: { who: 'bully-bear', text: 'Sand-castles are for babies!' },
    haha: { who: 'bully-bear', text: 'Ha ha! Ha ha ha!' },
    tooBig: { who: 'barney', text: 'He spoils everything! He’s too big for any of us. What can we do, Teddy?' },
    idea: { who: 'teddy', text: 'Hmm… I’ve got an idea!' },
    // 2. The pretend letter
    whisper: { who: 'teddy', text: 'Listen. We’ll write a pretend letter. It says the prizes are buried under Captain Bear’s castle.' },
    notTrue: { who: 'teddy', text: 'It’s pretend, {name}. It’s not true! But Bully will THINK it is.' },
    scribble: { who: 'teddy', text: 'Scribble, scribble… There! And a red seal.' },
    teenyHello: { who: 'teeny-bear', text: 'Hello! Can I help?' },
    loud: { who: 'teddy', text: 'Teeny! Take this SECRET letter to Teacher Bear!' },
    ears: { who: 'barney', text: 'Psst! Look! Bully’s behind the rock. He heard!' },
    askLetter: { who: 'teddy', text: 'Send the letter to Teeny, {name}! Drag it over to her!' },
    nudgeLetter: { who: 'teddy', text: 'Drag the letter to Teeny!' },
    offItGoes: { who: 'teddy', text: 'I’ll run it over to her myself. Whoosh!' },
    thatsWhat: { who: 'bully-bear', text: 'That’s what YOU think, Teddy Bear!' },
    reads: { who: 'bully-bear', text: 'The prizes! Under Captain Bear’s castle! Ha ha!' },
    tookIt: { who: 'teeny-bear', text: 'Oh! He took it!' },
    wanted: { who: 'teddy', text: 'Good. I wanted him to! Let’s go and watch.' },
    // 3. Captain Bear's castle
    digDig: { who: 'bully-bear', text: 'Where are they? Dig, dig, dig!' },
    whatMean: { who: 'captain-bear', text: 'What do you mean by digging up MY sand-castle?' },
    ruffian: { who: 'captain-bear', text: 'You RUFFIAN!' },
    bBut: { who: 'bully-bear', text: 'B-but, I-I thought the prizes were here…' },
    forYourself: { who: 'captain-bear', text: 'Thought you’d keep them all for yourself, did you?' },
    goAway: { who: 'captain-bear', text: 'Go away! And don’t come back until you can play nicely.' },
    goodThing: { who: 'barney', text: 'See that, Teddy? Good thing Bully believed the note!' },
    explain: { who: 'teddy', text: 'I wrote it! I knew Bully would dig, and you would catch him!' },
    askCaptain: { who: 'barney', text: 'Captain Bear still has his stern face. Tap him for a tickle!' },
    nudgeCaptain: { who: 'barney', text: 'Tap Captain Bear!' },
    tickle: { who: 'teeny-bear', text: 'I’ll tickle him myself! Tickle, tickle!' },
    scupper: { who: 'captain-bear', text: 'Well, scupper me scallywags! Clever Teddy Bear!' },
    squashed: { who: 'teeny-bear', text: 'But our castles are squashed. And it’s nearly teatime!' },
    bestEver: { who: 'teddy', text: 'Then let’s build the best castle ever!' },
    // 4. Teatime
    patPat: { who: 'narrator', text: 'They built a brand new castle out of wet sand.' },
    askPat: { who: 'teddy', text: 'It’s a bit lumpy. Tap the castle to pat it smooth, {name}!' },
    nudgePat: { who: 'teddy', text: 'Tap the castle!' },
    barneyPats: { who: 'barney', text: 'I’ll pat it. Pat, pat, pat!' },
    sorry: { who: 'bully-bear', text: 'Sorry I spoiled your castles. Can I help? I’m good at digging.' },
    ofCourse: { who: 'teddy', text: 'Of course you can! Dig us a moat!' },
    bestMoat: { who: 'barney', text: 'Look! The best moat ever!' },
    askFlag: { who: 'teddy', text: 'Now the flag on top. Tap the flag, {name}!' },
    nudgeFlag: { who: 'teddy', text: 'Tap the little red flag!' },
    teenyFlag: { who: 'teeny-bear', text: 'I’ll put it up! There!' },
    finished: { who: 'teeny-bear', text: 'Hooray! It’s finished!' },
    thanksTeeny: { who: 'teddy', text: 'Thank you, Teeny! It’s finished!' },
    fetch: { who: 'teeny-bear', text: 'It’s teatime! I’ll fetch Captain Bear!' },
    judging: { who: 'captain-bear', text: 'Judging time! The prize goes to… this castle, built together! Medals for everyone!' },
    forMe: { who: 'bully-bear', text: 'For me too? Oh, thank you, Captain Bear!' },
    teaTime: { who: 'teddy', text: 'Come on, everyone. It’s teatime!' },
    end: { who: 'narrator', text: 'And Teddy took Teeny her medal, just in time for tea.' },
  },
  scenes: [
    // ==================================================== 1. The competition
    {
      name: 'The competition',
      set(k) {
        k.backdrop('bear-beach');
        k.music('cosy');
        // Teddy and Barney stand behind their castle, building it.
        cast.teddy = k.character('teddy', { x: 300, y: CUB_Y, w: CUB, z: 10 });
        cast.barney = k.character('barney', { x: 520, y: CUB_Y, w: CUB, z: 10 });
        cast.castle = k.prop('sandcastle', { x: 400, y: 474, w: 220, z: 14 });
        cast.tower = k.add(turret(), { x: 475, y: 452, w: 70, z: 15 });
        k.set(cast.tower, { opacity: 0, scale: 0.4, transformOrigin: '50% 100%' });
        cast.heap = k.add(heap(), { x: 395, y: 564, w: 230, z: 14 });
        k.set(cast.heap, { opacity: 0 });
        cast.bucket = k.prop('bucket', { x: 160, y: 530, w: 120, z: 16 });
        cast.captain = k.character('captain-bear', { x: 830, y: CAPTAIN_Y, w: CAPTAIN, z: 12 });
        k.set(cast.captain, { opacity: 0 });
        cast.bully = k.character('bully-bear', { x: 730, y: BULLY_Y, w: BULLY, z: 13 });
        k.set(cast.bully, { opacity: 0 });
        cast.gull = k.prop('seagull', { x: -160, y: 120, w: 120, z: 20 });
      },
      async play(k) {
        const { teddy, barney, castle, tower, heap: flat, bucket, captain, bully, gull } = cast;
        // A gull over the sea, little waves.
        sounds.waves(3);
        const wings = k.pivot([...k.part(gull, 'wingL'), ...k.part(gull, 'wingR')]);
        void k.to(wings, 0.3, { rotation: (i: number) => (i ? -18 : 18), yoyo: true, repeat: 11, ease: 'sine.inOut' });
        void k.to(gull, 4, { x: 1500, y: -40, ease: 'none' });
        await k.wait(600);
        sounds.seagull();
        await k.say('seaside');

        // Captain Bear and his whistle.
        sounds.whistle();
        await k.enter(captain, 'right', 0.9);
        await k.say('ahoy', captain);
        k.pose(captain, 'point');
        await k.say('myCastle', captain);
        k.pose(captain, 'default');
        k.fx.patter(4, 0.14);
        await k.exit(captain, 'right', 0.8);

        await k.say('hello', teddy);

        // His turn: the bucket flips onto the castle and leaves a tower.
        const how = await k.dragToHelp(bucket, { to: [510, 545], ask: 'askBucket', nudge: 'nudgeBucket', helped: 'barneyTips', by: teddy, helper: barney });
        k.fx.boing();
        k.set(bucket, { zIndex: 20 });
        await k.to(bucket, 0.7, { x: 290, y: -150, rotation: 180, ease: 'power1.inOut' });
        k.fx.thud();
        await k.to(bucket, 0.25, { y: -135 });
        await k.wait(200);
        k.fx.pop();
        void k.to(tower, 0.35, { opacity: 1, scale: 1, ease: 'back.out(2)' });
        await k.to(bucket, 0.5, { y: -260, opacity: 0, ease: 'power1.in' });
        await k.all(k.say(how === 'dragged' ? 'thanksBucket' : 'thanksBarney', teddy), k.hop(barney, 30));

        // Thud… thud… Bully Bear.
        k.music('sneaky');
        k.fx.stomp(3, 0.5);
        await k.all(k.shake(teddy, 4, 2), k.shake(barney, 4, 2));
        k.fx.stomp(2, 0.4);
        await k.enter(bully, 'right', 1);
        await k.say('babies', bully);
        // WHUMP: his spade comes down on the castle.
        k.pose(bully, 'dig');
        await k.to(bully, 0.4, { x: -40, rotation: -8, y: -20 });
        await k.to(bully, 0.15, { rotation: 6, y: 0, ease: 'power2.in' });
        whump();
        k.quake(6);
        k.puff(510, 590, 200, '#e3c07e');
        void k.fade(castle, 0, 0.2);
        void k.fade(tower, 0, 0.2);
        void k.fade(flat, 1, 0.3);
        await k.all(k.shake(teddy, 6, 2), k.shake(barney, 6, 2));
        k.pose(bully, 'default');
        k.pose(teddy, 'sad');
        await k.to(bully, 0.3, { rotation: 0, x: 0 });
        await k.say('haha', bully);
        k.fx.patter(5, 0.12);
        await k.exit(bully, 'right', 0.8);
        await k.wait(500);

        // Barney is sad; Teddy thinks.
        k.music('cosy');
        await k.say('tooBig', barney);
        await k.wait(500);
        k.fx.twinkle();
        k.pose(teddy, 'happy');
        await k.all(k.say('idea', teddy), k.wait(700).then(() => k.hop(teddy, 30)));
      },
    },

    // ==================================================== 2. The pretend letter
    {
      name: 'The pretend letter',
      set(k) {
        k.backdrop('bear-beach');
        k.music('sneaky');
        // The big rock on the left, and Bully crouched behind it (clipped to his
        // head, so his body never shows below the rock).
        cast.peek = k.character('bully-bear', { x: 95, y: 372, w: 170, z: 11 });
        cast.peek.style.clipPath = 'inset(0 0 45% 0)';
        k.set(cast.peek, { y: 110 });
        k.add(boulder(), { x: -40, y: 430, w: 360, z: 12 });
        cast.teddy = k.character('teddy', { x: 600, y: CUB_Y, w: CUB });
        cast.barney = k.character('barney', { x: 830, y: CUB_Y, w: CUB });
        cast.teeny = k.character('teeny-bear', { x: 350, y: TEENY_Y, w: TEENY, z: 11 });
        k.set(cast.teeny, { opacity: 0 });
        cast.letter = k.prop('envelope', { x: 650, y: 515, w: 130, z: 16 });
        k.set(cast.letter, { opacity: 0, scale: 0.4 });
        cast.bully = k.character('bully-bear', { x: 110, y: BULLY_Y, w: BULLY, z: 13, pose: 'grab' });
        k.set(cast.bully, { opacity: 0 });
      },
      async play(k) {
        const { peek, teddy, barney, teeny, letter, bully } = cast;
        await k.wait(400);
        // Heads together: the plan, whispered.
        await k.to(teddy, 0.4, { x: 30, rotation: 6 });
        await k.say('whisper', teddy);
        await k.to(teddy, 0.3, { x: 0, rotation: 0 });
        await k.say('notTrue', teddy);

        // Scribble, scribble: the letter.
        k.fx.pop();
        await k.appear(letter, 0.4);
        scribble();
        await k.to(letter, 0.15, { rotation: 4, yoyo: true, repeat: 5 });
        await k.say('scribble', teddy);
        click();

        // Teeny trots in.
        k.fx.patter(6, 0.1);
        await k.enter(teeny, 'left', 1);
        await k.all(k.say('teenyHello', teeny), k.hop(teeny, 20, 2));

        // Loudly, so the rocks can hear.
        await k.say('loud', teddy);
        await k.wait(300);
        k.fx.sneak();
        await k.to(peek, 1, { y: 0, ease: 'sine.out' });
        await k.wait(300);
        await k.say('ears', barney);

        // His turn: drag the letter over to Teeny.
        await k.dragToHelp(letter, { to: [440, 600], ask: 'askLetter', nudge: 'nudgeLetter', helped: 'offItGoes', by: teddy });
        // Teeny holds it up high, and that's when Bully pounces.
        k.sfx.whoosh();
        await k.to(letter, 0.7, { y: '-=200', rotation: -10, ease: 'sine.out' });

        // Bully leaps out from behind the rock and snatches it from the air.
        k.remove(peek);
        k.fx.boing();
        k.set(bully, { opacity: 1, y: 60 });
        k.fx.whizz();
        await k.to(bully, 0.35, { y: -40, ease: 'power2.out' });
        k.set(letter, { opacity: 0 });
        k.sfx.rustle();
        await k.to(bully, 0.3, { y: 0, ease: 'power2.in' });
        await k.all(k.shake(teeny, 5, 2), k.say('thatsWhat', bully));
        await k.say('reads', bully);
        k.fx.patter(6, 0.1);
        await k.exit(bully, 'left', 0.8);
        await k.wait(400);

        await k.say('tookIt', teeny);
        giggle();
        k.pose(teddy, 'happy');
        await k.all(k.say('wanted', teddy), k.wait(400).then(() => k.hop(teddy, 26)));
      },
    },

    // ==================================================== 3. Captain Bear's castle
    {
      name: 'Captain Bear’s castle',
      set(k) {
        k.backdrop('bear-dunes');
        k.music('sneaky');
        cast.big = k.prop('big-sandcastle', { x: 600, y: 345, w: 360, z: 10 });
        cast.bully = k.character('bully-bear', { x: 455, y: BULLY_Y, w: BULLY, z: 12, pose: 'dig' });
        cast.captain = k.character('captain-bear', { x: 880, y: CAPTAIN_Y, w: CAPTAIN, z: 13 });
        k.set(cast.captain, { opacity: 0 });
        cast.barney = k.character('barney', { x: 30, y: CUB_Y, w: 210 });
        cast.teeny = k.character('teeny-bear', { x: 245, y: TEENY_Y + 4, w: 170 });
        cast.teddy = k.character('teddy', { x: 420, y: CUB_Y, w: 210, z: 14 });
        for (const el of [cast.barney, cast.teeny, cast.teddy]) k.set(el, { opacity: 0 });
      },
      async play(k) {
        const { big, bully, captain, barney, teeny, teddy } = cast;
        const flag = k.pivot(k.part(big, 'flag'));
        // Dig, dig, dig: sand flies and the flag wobbles.
        for (let i = 0; i < 2; i++) {
          dig(2, 0.3);
          await k.to(bully, 0.25, { rotation: 8, x: 12 });
          k.puff(610, 590, 110, '#e3c07e');
          void k.to(flag, 0.2, { rotation: i ? -14 : 14, yoyo: true, repeat: 3 });
          await k.to(bully, 0.25, { rotation: 0, x: 0 });
        }
        await k.say('digDig', bully);
        dig(3, 0.3);
        await k.to(bully, 0.3, { rotation: 8, x: 12, yoyo: true, repeat: 1 });
        k.puff(620, 570, 120, '#e3c07e');

        // Silence… then three heavy steps. Captain Bear.
        k.silence();
        await k.wait(900);
        k.fx.stomp(3, 0.5);
        await k.wait(400);
        k.quake(4);
        await k.enter(captain, 'right', 1.1);
        k.music('spooky');
        await k.camera({ zoom: 1.3, x: 900, y: 420 }, 1);
        await k.say('whatMean', captain);
        k.pose(captain, 'roar');
        void roar(k, captain);
        k.quake(6);
        await k.say('ruffian', captain);
        await k.camera({}, 0.8);

        // Bully goes small.
        k.pose(bully, 'sorry');
        await k.shake(bully, 5, 2);
        await k.say('bBut', bully);
        k.pose(captain, 'default');
        await k.say('forYourself', captain);
        k.pose(captain, 'point');
        await k.say('goAway', captain);
        // Off he slinks, head down.
        k.fx.patter(5, 0.2);
        await k.to(bully, 2.2, { x: -680, ease: 'sine.in' });
        k.set(bully, { opacity: 0 });
        k.pose(captain, 'default');
        await k.wait(400);

        // Back to the heroes, wide.
        k.music('cosy');
        k.fx.patter(6, 0.1);
        await k.all(k.enter(barney, 'left', 0.8), k.wait(200).then(() => k.enter(teeny, 'left', 0.8)), k.wait(400).then(() => k.enter(teddy, 'left', 0.8)));
        await k.all(k.say('goodThing', barney), k.hop(barney, 20));
        await k.say('explain', teddy);
        // His turn: a tickle for Captain Bear's stern face.
        await k.tapToHelp(captain, { ask: 'askCaptain', nudge: 'nudgeCaptain', helped: 'tickle', by: barney, helper: teeny, size: 260 });
        laugh();
        k.pose(captain, 'happy');
        await k.all(k.say('scupper', captain), k.shake(captain, 4, 3));
        await k.wait(300);
        await k.say('squashed', teeny);
        k.pose(teddy, 'happy');
        await k.all(k.say('bestEver', teddy), k.wait(300).then(() => k.hop(teddy, 30)));
      },
    },

    // ==================================================== 4. Teatime
    {
      name: 'Teatime',
      set(k) {
        k.backdrop('bear-beach');
        k.music('cosy');
        cast.teeny = k.character('teeny-bear', { x: 20, y: TEENY_Y, w: TEENY });
        cast.barney = k.character('barney', { x: 185, y: CUB_Y, w: CUB });
        cast.teddy = k.character('teddy', { x: 395, y: CUB_Y, w: CUB, z: 12 });
        cast.castle = k.prop('sandcastle', { x: 625, y: 418, w: 290, z: 14 });
        cast.moat = k.add(moat(), { x: 605, y: 626, w: 330, z: 15 });
        k.set(cast.moat, { opacity: 0, scaleX: 0.2 });
        cast.flag = k.prop('sandcastle-flag', { x: 145, y: 522, w: 70, z: 16 });
        cast.bully = k.character('bully-bear', { x: 925, y: 368, w: 240, z: 13, pose: 'sorry' });
        k.set(cast.bully, { opacity: 0 });
        cast.captain = k.character('captain-bear', { x: -20, y: 330, w: 270, z: 11 });
        k.set(cast.captain, { opacity: 0 });
      },
      async play(k) {
        const { teeny, barney, teddy, castle, moat: water, flag, bully, captain } = cast;
        // Pat, pat, pat.
        sounds.waves(2);
        await k.say('patPat');

        // His turn: pat the lumpy castle smooth.
        await k.tapToHelp(castle, { ask: 'askPat', nudge: 'nudgePat', helped: 'barneyPats', by: teddy, helper: barney, size: 260 });
        for (let i = 0; i < 3; i++) {
          k.fx.thud();
          await k.pop(castle, 1.06);
        }

        // Slow footsteps: Bully comes back, head down.
        k.fx.patter(3, 0.4);
        await k.to(bully, 0, { x: 300 });
        await k.all(k.fade(bully, 1, 0.3), k.to(bully, 1.2, { x: 0, ease: 'sine.out' }));
        await k.all(k.shake(teeny, 4, 2), k.shake(teddy, 3, 2));
        await k.say('sorry', bully);
        await k.say('ofCourse', teddy);

        // The moat: dig, dig, and the sea runs in.
        k.pose(bully, 'dig');
        for (let i = 0; i < 2; i++) {
          dig(1);
          await k.to(bully, 0.22, { rotation: -8, x: -14 });
          k.puff(930, 610, 90, '#e3c07e');
          await k.to(bully, 0.22, { rotation: 0, x: 0 });
        }
        fillMoat();
        await k.to(water, 1.4, { opacity: 1, scaleX: 1, ease: 'sine.out' });
        k.pose(bully, 'default');
        k.pose(barney, 'happy');
        await k.all(k.say('bestMoat', barney), k.hop(barney, 24));
        k.pose(barney, 'default');

        // His turn: the flag on top.
        const how = await k.tapToHelp(flag, { ask: 'askFlag', nudge: 'nudgeFlag', helped: 'teenyFlag', by: teddy, helper: teeny, size: 130 });
        k.fx.whizz();
        k.set(flag, { zIndex: 25 });
        await k.to(flag, 1, { x: 575, y: -124, ease: 'power1.inOut' });
        k.fx.thud();
        const cloth = k.pivot(k.part(flag, 'flag'));
        void k.to(cloth, 0.25, { rotation: 10, yoyo: true, repeat: 3 });
        k.sfx.sparkle();
        k.sparkle(770, 430, 14, 160);
        k.pose(teeny, 'happy');
        await k.all(k.say(how === 'tapped' ? 'finished' : 'thanksTeeny', how === 'tapped' ? teeny : teddy), k.hop(teeny, 22, 2));

        // Teeny runs to fetch Captain Bear.
        await k.say('fetch', teeny);
        k.fx.patter(6, 0.1);
        await k.exit(teeny, 'left', 0.7);
        await k.wait(600);
        sounds.whistle();
        await k.enter(captain, 'left', 1);
        k.fx.drumroll(1);
        await k.wait(900);
        k.sfx.fanfare();
        k.pose(captain, 'point');
        await k.say('judging', captain);
        k.pose(captain, 'happy');
        // A shell medal on every builder.
        for (const el of [barney, teddy, bully]) {
          k.fx.jingle();
          hangMedal(k, el);
          await k.wait(450);
        }
        // Bully, glad at last: his cross brows smooth out.
        k.pose(bully, 'default');
        k.set(k.part(bully, 'brows'), { opacity: 0 });
        await k.all(k.say('forMe', bully), k.hop(bully, 24));
        k.pose(teddy, 'happy');
        await k.say('teaTime', teddy);
        sounds.seagull();
        await warmEnding(k, { cast: [teddy, barney, bully, captain], end: 'end', sparkleAt: [600, 280] });
      },
    },
  ],
});

/**
 * Hangs a shell medal over a bear's collar. It goes inside the bear's own
 * box, so it bobs and hops with them (a separate actor would stay behind).
 */
function hangMedal(k: Kit, el: HTMLElement): void {
  const b = k.box(el);
  const w = Math.round(b.w * 0.24);
  const m = k.prop('shell-medal', { x: 0, y: 0, w });
  m.style.left = `${b.face.cx - b.x - w / 2}px`;
  m.style.top = `${b.face.y + b.face.h - b.y - w * 0.15}px`;
  m.style.zIndex = '2';
  el.append(m);
  void k.appear(m, 0.35);
}
