/**
 * Nick's Ghost Party: a scene from the second Harry Potter book that the
 * film left out. On Hallowe'en, Nearly Headless Nick invites Harry, Ron and
 * Hermione to his five hundredth party for being a ghost, down in the
 * dungeons, and the Headless Hunt gallops in.
 *
 *   1. The invitation. Hallowe'en in the castle corridor: pumpkins, and the
 *      smell of the feast (Ron is starving). Nick floats in: tonight is his
 *      five hundredth Ghost Day, and ghosts are coming from all over. Will
 *      they come? Perhaps this year the Headless Hunt will let him join!
 *      Ron: but the feast! Hermione: a real ghost party! Harry:
 *      we'd love to. Nick: seven o'clock, the dungeons. Wrap up warm!
 *   2. The blue party. A cold dungeon, candles burning blue, a band of ghosts
 *      with musical saws waiting on their platform. His first turn: he bangs
 *      the gong. BWONG! The saws wail and wobble, two ghosts waltz past. Ron:
 *      it sounds like a hundred cats in the bath. Is there any food?
 *   3. The ghostly feast. A fish gone green, furry cheese, a grey cake. Nick:
 *      ghosts can't eat, so it's extra smelly; he floats right through the
 *      cake to almost taste it. Ron isn't hungry any more. Moaning Myrtle
 *      drifts in, sulking: nobody wants to talk to Myrtle. Hermione does, and
 *      Myrtle giggles. Then a hunting horn, far off. Nick: "Oh no. The
 *      Headless Hunt."
 *   4. The Headless Hunt. Silence; the horn; hooves. Through the wall gallops
 *      Sir Patrick on a ghost horse, holding his own head, which he tosses up
 *      and catches. Push in: "What ho, Nicholas! Still only nearly headless?
 *      You can't join the Hunt!" Back to the friends: Nick is sad. Harry:
 *      show them your trick! His big turn: he taps Nick's ruff, and Nick's
 *      head flops right over like a lid. Sir Patrick: "I say! Bravo! Come
 *      and ride with us!" Nick whoops round the dungeon with the Hunt.
 *   5. The Hallowe'en feast. Up in the Great Hall there's still pudding:
 *      pumpkin pie, real and hot and not furry. Nick floats in, beaming: the
 *      best Ghost Day in five hundred years. Thank you, {name}!
 *
 * In the book it is a "deathday party", the day Nick died. Here it is his
 * "Ghost Day", five hundred years of being a ghost: the house style never
 * says death to a six-year-old. The Hunt is played for laughs: Sir Patrick's
 * head is a cheerful thing he juggles, with a ruff and a puff of mist where
 * his neck would be, nothing gory, and he ends up cheering Nick on. Nobody
 * is cruel for long: the scary beat is the gallop and the loom, then straight
 * back to the friends. Harry sits out scene 3 and Hermione scenes 2 and 4,
 * to keep the stage to four.
 */
import { defineCartoon, NOTE, noiseBurst, now, tone, type Kit } from '../../kit';
import { sounds as commonSounds } from '../../worlds/common/moves';
import { warmEnding } from '../../worlds/common/pieces';
import { greatHall } from '../../worlds/hogwarts/pieces';
import meta from './meta';

const { giggle, sniff } = commonSounds;

// ---------------------------------------------------------------- sounds

/** The big gong: one deep, shimmering BWONG that hums away. */
function gong(): void {
  const t = now();
  tone(82, t, { wave: 'sine', peak: 0.2, attack: 0.01, decay: 3.2 });
  tone(164, t, { wave: 'triangle', peak: 0.06, attack: 0.02, decay: 2.4, vibrato: [4, 3] });
  tone(247, t, { wave: 'sine', peak: 0.05, attack: 0.05, decay: 2.8, vibrato: [5, 4] });
  noiseBurst(t, { freq: 1200, q: 1, peak: 0.04, attack: 0.01, decay: 0.8 });
}

/** The ghost band's musical saws: high wobbly notes sliding about, `seconds` long. */
function saws(seconds = 4): void {
  const t = now();
  const tune = [NOTE.E5, NOTE.G5, NOTE.E5, NOTE.C5, NOTE.D5, NOTE.B4, NOTE.C5, NOTE.A4];
  const step = seconds / tune.length;
  tune.forEach((n, i) => {
    tone(n, t + i * step, { wave: 'sine', peak: 0.05, attack: step * 0.4, decay: step * 1.1, glideTo: n * 1.03, vibrato: [6, 14] });
    tone(n / 2, t + i * step, { wave: 'sine', peak: 0.025, attack: step * 0.4, decay: step * 1.1, vibrato: [5, 10] });
  });
}

/** A hunting horn, far off or near: "ta-ta-taaa". */
function horn(near = false): void {
  const t = now();
  const p = near ? 0.09 : 0.04;
  [[NOTE.C5, 0, 0.18], [NOTE.C5, 0.22, 0.18], [NOTE.G5, 0.44, 0.7]].forEach(([n, d, len]) =>
    tone(n, t + d, { wave: 'sawtooth', peak: p, attack: 0.04, decay: len, lowpass: near ? 1800 : 900 }),
  );
}

/** Ghost hooves on stone, galloping: `beats` soft triplets, getting louder. */
function hooves(beats = 6): void {
  const t = now();
  for (let i = 0; i < beats; i++) {
    const p = 0.03 + (i / beats) * 0.05;
    [0, 0.09, 0.18].forEach((d) => {
      noiseBurst(t + i * 0.42 + d, { freq: 500, q: 2, peak: p, attack: 0.005, decay: 0.07 });
      tone(120, t + i * 0.42 + d, { wave: 'sine', peak: p, decay: 0.08 });
    });
  }
}

/** Moaning Myrtle's wail: a long, wobbly "oooOOOooo", soft. */
function wail(): void {
  const t = now();
  tone(NOTE.A4, t, { wave: 'sine', peak: 0.06, attack: 0.3, decay: 1.6, glideTo: NOTE.E5, vibrato: [5, 18] });
  tone(NOTE.E5, t + 0.9, { wave: 'sine', peak: 0.05, attack: 0.2, decay: 1.2, glideTo: NOTE.A4, vibrato: [5, 18] });
}

/** A ghostly whoosh as someone floats through something: a soft, cold swirl. */
function ghostWhoosh(): void {
  const t = now();
  noiseBurst(t, { freq: 900, q: 1.5, peak: 0.05, attack: 0.25, decay: 0.8 });
  tone(NOTE.C6, t, { wave: 'sine', peak: 0.025, attack: 0.2, decay: 0.8, glideTo: NOTE.G5 });
}

/** A flop: a soft, silly "bloop" as Nick's head swings over. */
function flop(): void {
  const t = now();
  tone(NOTE.G4, t, { wave: 'triangle', peak: 0.09, attack: 0.01, decay: 0.35, glideTo: NOTE.C4 });
  tone(NOTE.C3, t + 0.25, { wave: 'sine', peak: 0.07, decay: 0.3 });
}

// ------------------------------------------------------------------ cast

type Actor =
  | 'harry' | 'ron' | 'hermione' | 'nick' | 'myrtle' | 'patrick' | 'horse'
  | 'gong' | 'band' | 'dancers' | 'feast';
const cast = {} as Record<Actor, HTMLElement>;
let hall: ReturnType<typeof greatHall.set>;
/** How his big turn went, for the thank-you at the feast. */
let flopped: 'tapped' | 'helped' = 'tapped';

/** The ghosts drift gently up and down wherever they are. */
function drift<K extends string>(k: Kit<K>, ...ghosts: HTMLElement[]): void {
  ghosts.forEach((g, i) => void k.float(g, 8, 2.4 + i * 0.3));
}

/** Cold blue candlelight over the party: a few soft pools by the walls. */
function blueLights<K extends string>(k: Kit<K>): void {
  for (const [x, y] of [[180, 260], [600, 220], [1000, 260]]) k.light(x, y, 150, { color: '#8fb8ff', strength: 0.35, flicker: true, z: 5 });
}

/** The ghost band plays: their bows wiggle while the saws wail. */
async function bandPlays<K extends string>(k: Kit<K>, band: HTMLElement, seconds = 4): Promise<void> {
  saws(seconds);
  const bows = k.pivot(k.part(band, 'bows'));
  const reps = Math.round(seconds / 0.5);
  if (bows.length) await k.to(bows, 0.25, { rotation: 8, x: 6, yoyo: true, repeat: reps * 2 - 1, ease: 'sine.inOut' });
  else await k.shake(band, 3, reps);
}

/** Sir Patrick tosses his head up in the air and catches it again. */
async function tossHead<K extends string>(k: Kit<K>, patrick: HTMLElement): Promise<void> {
  const head = k.pivot(k.part(patrick, 'head'));
  k.fx.whizz();
  await k.to(head, 0.45, { y: -110, rotation: 360, ease: 'power2.out' });
  await k.to(head, 0.4, { y: 0, ease: 'power2.in' });
  k.set(head, { rotation: 0 });
  k.fx.pop();
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. The invitation
    hallowe: { who: 'narrator', text: 'It was Hallowe’en at Hogwarts. Giant pumpkins glowed, and the castle smelled of pumpkin pie.' },
    smell: { who: 'ron', text: 'Mmm! Smell that, {name}! The Hallowe’en feast is tonight!' },
    nickHello: { who: 'nick', text: 'Good evening, dear friends! I have some splendid news.' },
    ghostDay: { who: 'nick', text: 'Tonight is my five hundredth Ghost Day. I’m having a party!' },
    willYouCome: { who: 'nick', text: 'Ghosts are coming from all over the country. Will you come?' },
    wishHunt: { who: 'nick', text: 'And perhaps, this year, the Headless Hunt will let me join them!' },
    butFeast: { who: 'ron', text: 'But… the feast! There’s pumpkin pie!' },
    realGhost: { who: 'hermione', text: 'Ron! A real ghost party! Hardly anybody gets invited to one.' },
    weCome: { who: 'harry', text: 'We’d love to come, Nick.' },
    splendid: { who: 'nick', text: 'Splendid! Seven o’clock, down in the dungeons. Do wrap up warm!' },
    // 2. The blue party
    down: { who: 'narrator', text: 'Down in the dungeons it was very, very cold. And every candle burned blue.' },
    brr: { who: 'ron', text: 'Brrr! My breath has gone all smoky!' },
    welcome: { who: 'nick', text: 'Welcome, welcome! The band is ready. They just need the gong.' },
    askGong: { who: 'nick', text: '{name}, would you do the honours? Tap the big gong!' },
    nudgeGong: { who: 'nick', text: 'Just tap the gong!' },
    helpedGong: { who: 'ron', text: 'I’ll bang it. Here goes!' },
    cats: { who: 'ron', text: 'It sounds like a hundred cats singing in the bath!' },
    shh: { who: 'harry', text: 'Shh, Ron! It’s… lovely. Sort of.' },
    dancing: { who: 'nick', text: 'Ah, the ghostly waltz. My favourite!' },
    anyFood: { who: 'ron', text: 'Nick, is there any food? I’m starving.' },
    thisWay: { who: 'nick', text: 'Of course! Follow me to the feast!' },
    // 3. The ghostly feast
    yuck: { who: 'ron', text: 'Urgh! The fish is green! And the cheese is all furry!' },
    smelly: { who: 'nick', text: 'Ghosts can’t eat, you see. So we have it extra smelly.' },
    watch: { who: 'nick', text: 'If I float right through it, I can almost taste it. Watch!' },
    almost: { who: 'nick', text: 'Mmm. Almost!' },
    notHungry: { who: 'ron', text: 'Er… I’m not that hungry any more.' },
    nobody: { who: 'myrtle', text: 'Oh. A party. Nobody ever wants to talk to Moaning Myrtle.' },
    weDo: { who: 'hermione', text: 'We do, Myrtle! You look ever so nice tonight.' },
    doI: { who: 'myrtle', text: 'Do I? Oh! Hee hee hee!' },
    ohNo: { who: 'nick', text: 'Oh! That horn! It’s the Headless Hunt!' },
    // 4. The Headless Hunt
    gallop: { who: 'narrator', text: 'The horn blew again. Hooves thundered. And right through the wall galloped…' },
    tallyHo: { who: 'sirPatrick', text: 'Tally-ho! The Headless Hunt is here!' },
    inHands: { who: 'ron', text: 'Harry! He’s holding his head in his hands!' },
    whatHo: { who: 'sirPatrick', text: 'What ho, Nicholas! Still only nearly headless?' },
    cantJoin: { who: 'sirPatrick', text: 'Not quite off, is it? Sorry, old chap! No joining the Hunt!' },
    sad: { who: 'nick', text: 'They never let me join. Not in five hundred years.' },
    showThem: { who: 'harry', text: 'Then show them, Nick! Show them your trick!' },
    askRuff: { who: 'nick', text: 'Very well! {name}, tap my frilly ruff, and watch my head flop!' },
    nudgeRuff: { who: 'nick', text: 'Tap my frilly ruff!' },
    helpedRuff: { who: 'nick', text: 'Oh, I’ll do it myself. One, two, three!' },
    iSay: { who: 'sirPatrick', text: 'I say! Bravo, Nicholas! What a jolly good flop!' },
    rideWithUs: { who: 'sirPatrick', text: 'Come and ride with the Hunt tonight!' },
    me: { who: 'nick', text: 'Me? Ride with the Hunt? Oh, happy Ghost Day!' },
    // 5. The Hallowe'en feast
    upstairs: { who: 'narrator', text: 'Later, the friends raced up to the Great Hall. Was there any feast left?' },
    pie: { who: 'ron', text: 'Pumpkin pie! Real, hot, not-furry pumpkin pie!' },
    strangest: { who: 'hermione', text: 'That was the strangest party ever.' },
    andBest: { who: 'harry', text: 'And the best!' },
    bestGhostDay: { who: 'nick', text: 'Thank you, dear friends! The best Ghost Day in five hundred years!' },
    thanksName: { who: 'nick', text: 'And thank you, {name}. My head has never flopped so well!' },
    thanksAll: { who: 'nick', text: 'My head has never flopped so well. Happy Hallowe’en!' },
    end: { who: 'narrator', text: 'Happy Hallowe’en, everybody. And happy Ghost Day, Nick!' },
  },
  scenes: [
    // ==================================================== 1. The invitation
    {
      name: 'The invitation',
      set(k) {
        k.backdrop('castle-corridor');
        k.music('magic');
        k.light(140, 245, 110, { color: '#ffcf7a', strength: 0.4, flicker: true, z: 5 });
        k.light(1040, 245, 110, { color: '#ffcf7a', strength: 0.4, flicker: true, z: 5 });
        k.prop('pumpkin', { x: 20, y: 540, w: 130, z: 16 });
        k.prop('pumpkin', { x: 1030, y: 540, w: 130, z: 16 });
        for (const [x, y] of [[300, 90], [560, 60], [820, 100]]) k.prop('floatingCandle', { x, y, w: 50, z: 4 });
        cast.harry = k.character('harry', { x: 120, y: 380, w: 240 });
        cast.ron = k.character('ron', { x: 330, y: 380, w: 240 });
        cast.hermione = k.character('hermione', { x: 540, y: 386, w: 240 });
        cast.nick = k.character('nick', { x: 820, y: 280, w: 240, flip: true });
        k.set(cast.nick, { opacity: 0, x: 200 });
      },
      async play(k) {
        const { harry, ron, hermione, nick } = cast;
        await k.wait(400);
        await k.say('hallowe');
        sniff();
        await k.all(k.say('smell', ron), k.wait(400).then(() => k.hop(ron, 24)));

        // Nick floats in through the wall.
        ghostWhoosh();
        await k.to(nick, 1.4, { opacity: 0.9, x: 0, ease: 'power1.out' });
        drift(k, nick);
        await k.say('nickHello', nick);
        k.fx.twinkle();
        await k.say('ghostDay', nick);
        await k.say('willYouCome', nick);
        await k.say('wishHunt', nick);
        await k.all(k.say('butFeast', ron), k.shake(ron, 4, 2));
        await k.all(k.say('realGhost', hermione), k.hop(hermione, 20));
        await k.say('weCome', harry);
        await k.say('splendid', nick);
        k.fx.twinkle();
        await k.wait(500);
      },
    },

    // ==================================================== 2. The blue party
    {
      name: 'The blue party',
      set(k) {
        k.backdrop('ghost-party');
        k.music('spooky');
        blueLights(k);
        k.ambient('dust', { count: 10 });
        cast.band = k.prop('sawBand', { x: 80, y: 330, w: 330, z: 8 });
        cast.gong = k.prop('gong', { x: 420, y: 400, w: 180, z: 12 });
        cast.dancers = k.prop('ghostDancers', { x: 1200, y: 300, w: 220, z: 7 });
        k.set(cast.dancers, { opacity: 0 });
        cast.harry = k.character('harry', { x: 610, y: 390, w: 220 });
        cast.ron = k.character('ron', { x: 790, y: 390, w: 220 });
        cast.nick = k.character('nick', { x: 960, y: 250, w: 210, flip: true });
      },
      async play(k) {
        const { band, gong: theGong, dancers, harry, ron, nick } = cast;
        drift(k, nick);
        k.fx.wind(2);
        await k.say('down');
        await k.all(k.say('brr', ron), k.shake(ron, 3, 4));
        await k.say('welcome', nick);

        // His first turn: bang the gong.
        await k.tapToHelp(theGong, { ask: 'askGong', nudge: 'nudgeGong', helped: 'helpedGong', by: nick, helper: ron, size: 190 });
        gong();
        k.quake(3);
        const disc = k.pivot(k.part(theGong, 'disc'));
        if (disc.length) void k.to(disc, 0.4, { rotation: 6, yoyo: true, repeat: 3, ease: 'sine.inOut' });
        k.sparkle(510, 480, 10, 120);
        await k.wait(900);

        // The band plays, and two ghosts waltz past.
        k.silence();
        await bandPlays(k, band, 4);
        await k.all(k.say('cats', ron), k.shake(ron, 3, 2));
        await k.say('shh', harry);
        void bandPlays(k, band, 4);
        await k.all(
          k.to(dancers, 0.6, { opacity: 0.8 }),
          k.to(dancers, 4.5, { x: -620, ease: 'sine.inOut' }),
          k.wait(600).then(() => k.say('dancing', nick)),
        );
        await k.fade(dancers, 0, 0.6);
        k.music('spooky');
        await k.say('anyFood', ron);
        await k.say('thisWay', nick);
      },
    },

    // ==================================================== 3. The ghostly feast
    {
      name: 'The ghostly feast',
      set(k) {
        k.backdrop('ghost-party');
        k.music('spooky');
        blueLights(k);
        k.prop('sawBand', { x: 80, y: 330, w: 330, z: 8 });
        cast.ron = k.character('ron', { x: 250, y: 330, w: 230 });
        cast.hermione = k.character('hermione', { x: 460, y: 336, w: 230 });
        cast.nick = k.character('nick', { x: 860, y: 230, w: 230, flip: true });
        cast.feast = k.prop('ghostFeast', { x: 290, y: 522, w: 560, z: 14 });
        cast.myrtle = k.character('myrtle', { x: 10, y: 290, w: 220 });
        k.set(cast.myrtle, { opacity: 0, x: -300 });
      },
      async play(k) {
        const { ron, hermione, nick, myrtle } = cast;
        drift(k, nick);
        await k.wait(400);
        sniff();
        await k.all(k.say('yuck', ron), k.shake(ron, 5, 3));
        await k.say('smelly', nick);
        await k.say('watch', nick);

        // He floats right through the end of the table, and back.
        ghostWhoosh();
        await k.to(nick, 1.2, { x: -110, y: 170, ease: 'sine.inOut' });
        sniff();
        await k.say('almost', nick);
        ghostWhoosh();
        await k.to(nick, 1.0, { x: 0, y: 0, ease: 'sine.inOut' });
        drift(k, nick);
        await k.say('notHungry', ron);

        // Moaning Myrtle drifts in, sulking.
        wail();
        await k.to(myrtle, 1.6, { opacity: 0.85, x: 0, ease: 'power1.out' });
        drift(k, myrtle);
        await k.say('nobody', myrtle);
        k.face(hermione, true);
        k.music('magic');
        await k.say('weDo', hermione);
        giggle();
        await k.all(k.say('doI', myrtle), k.spin(myrtle, 1, 0.9));

        // A horn, far off.
        k.silence();
        await k.wait(400);
        horn(false);
        await k.wait(1100);
        await k.all(k.shake(ron, 3, 2), k.shake(hermione, 3, 2));
        await k.say('ohNo', nick);
      },
    },

    // ==================================================== 4. The Headless Hunt
    {
      name: 'The Headless Hunt',
      set(k) {
        k.backdrop('ghost-party');
        k.music('spooky');
        blueLights(k);
        cast.harry = k.character('harry', { x: 30, y: 386, w: 230 });
        cast.ron = k.character('ron', { x: 230, y: 386, w: 230 });
        cast.nick = k.character('nick', { x: 420, y: 250, w: 230 });
        // The horse gallops in from the right, so it faces left. Sir Patrick
        // rides in front of the saddle (z above the horse), so the head he
        // holds at his chest stays in sight.
        cast.horse = k.prop('ghostHorse', { x: 690, y: 330, w: 440, z: 11, flip: true });
        cast.patrick = k.character('sirPatrick', { x: 790, y: 250, w: 220, z: 12, flip: true });
        k.set([cast.patrick, cast.horse], { x: 700, opacity: 0 });
      },
      async play(k) {
        const { harry, ron, nick, patrick, horse } = cast;
        drift(k, nick);
        k.silence();
        horn(true);
        await k.wait(900);

        // Hooves, and through the wall they come.
        hooves(7);
        const legs = [...k.pivot(k.part(horse, 'legsFront')), ...k.pivot(k.part(horse, 'legsBack'))];
        const gallop = legs.length ? k.to(legs, 0.21, { rotation: 18, yoyo: true, repeat: 13, ease: 'sine.inOut' }) : Promise.resolve();
        await k.all(
          k.say('gallop'),
          k.wait(900).then(() => k.to([patrick, horse], 2.2, { x: 0, opacity: 0.9, ease: 'power2.out' })),
          k.wait(1800).then(() => k.all(k.shake(harry, 4, 3), k.shake(ron, 4, 3))),
        );
        await gallop;
        horn(true);
        await k.say('tallyHo', patrick);
        await k.all(k.say('inHands', ron), k.shake(ron, 4, 2));

        // He tosses his head and looms at Nick.
        await tossHead(k, patrick);
        await k.camera({ zoom: 1.3, x: 880, y: 380 }, 1.1);
        await k.say('whatHo', patrick);
        await k.say('cantJoin', patrick);
        await k.camera({}, 0.9);

        // Back to the friends.
        k.music('dreamy');
        await k.to(nick, 0.8, { y: '+=30', ease: 'sine.inOut' });
        await k.say('sad', nick);
        await k.all(k.say('showThem', harry), k.hop(harry, 24));
        k.music('magic');

        // His big turn: tap Nick's ruff, and his head flops right over.
        flopped = await k.tapToHelp(nick, { ask: 'askRuff', nudge: 'nudgeRuff', helped: 'helpedRuff', by: nick, size: 220 });
        const head = k.pivot(k.part(nick, 'head'));
        flop();
        await k.to(head, 0.6, { rotation: 80, ease: 'back.out(1.6)' });
        await k.wait(500);
        horn(true);
        await k.say('iSay', patrick);
        await tossHead(k, patrick);
        await k.to(head, 0.5, { rotation: 0, ease: 'power2.inOut' });
        await k.say('rideWithUs', patrick);
        k.music('triumph');
        await k.all(k.say('me', nick), k.spin(nick, 1, 1));

        // Off they go together, round and out through the wall.
        hooves(6);
        if (legs.length) void k.to(legs, 0.21, { rotation: 18, yoyo: true, repeat: 11, ease: 'sine.inOut' });
        k.face(nick, false);
        await k.all(
          k.to([patrick, horse], 2.2, { x: 800, opacity: 0, ease: 'power2.in' }),
          k.wait(300).then(() => k.to(nick, 2.2, { x: 900, y: -120, opacity: 0, ease: 'power2.in' })),
        );
        await k.wait(400);
      },
    },

    // ==================================================== 5. The Hallowe'en feast
    {
      name: 'The Hallowe’en feast',
      set(k) {
        k.backdrop('great-hall');
        hall = greatHall.set(k, {
          guests: [{ id: 'harry', x: 120 }, { id: 'ron', x: 380 }, { id: 'hermione', x: 640 }],
          music: 'cosy',
        });
        [cast.harry, cast.ron, cast.hermione] = hall.guests;
        k.prop('pumpkin', { x: 20, y: 300, w: 110, z: 4 });
        k.prop('pumpkin', { x: 1050, y: 300, w: 110, z: 4 });
        cast.nick = k.character('nick', { x: 880, y: 220, w: 230, flip: true });
        k.set(cast.nick, { opacity: 0, x: 200 });
      },
      async play(k) {
        const { harry, ron, hermione, nick } = cast;
        await k.say('upstairs');
        await greatHall.play(k, hall, { food: ['pie', 'pumpkin', 'pie'], cheer: 'pie', by: ron });
        await k.say('strangest', hermione);
        await k.all(k.say('andBest', harry), k.hop(harry, 20));

        // Nick floats in, beaming.
        ghostWhoosh();
        await k.to(nick, 1.3, { opacity: 0.9, x: 0, ease: 'power1.out' });
        drift(k, nick);
        await k.say('bestGhostDay', nick);
        const head = k.pivot(k.part(nick, 'head'));
        flop();
        await k.to(head, 0.4, { rotation: 40, yoyo: true, repeat: 1, ease: 'sine.inOut' });
        await k.say(flopped === 'tapped' ? 'thanksName' : 'thanksAll', nick);
        await warmEnding(k, { cast: [harry, ron, hermione], end: 'end' });
      },
    },
  ],
});
