/**
 * Uncle Sailor Bill: from the Teddy Bear Treasury (Brown Watson, 1994).
 * A thunderstorm nearly spoils the boat trip to Plumtree Island, until
 * Uncle Sailor Bill turns the boat-house into a shipwreck.
 *
 *   1. Storm clouds. The river bank by the boat-house, sunny. Teddy and
 *      Barney can't wait: Uncle Sailor Bill is taking them by boat to
 *      Plumtree Island, with a picnic and a sing-song. Mummy doesn't like
 *      the look of the clouds. Big grey clouds roll in, thunder rumbles,
 *      and down comes the rain. "Quick! Make for the boat-house!" Poor
 *      Teddy: it looks as if the treat is spoilt.
 *   2. Just the weather for a shipwreck. Inside, wet and glum, rain on the
 *      window. Teddy: Uncle Bill has sailed half-way round the world, a
 *      storm won't stop him. In he comes, shaking off the rain: "Ahoy there,
 *      me hearties! Just the weather for a shipwreck!" Collect up all the
 *      things to keep afloat! Teddy, roll up that mat. Barney
 *      rolls up the stripy mat. Bump,
 *      thump, puff: chairs upside-down, a plank, a barrel, sacks, a chest.
 *      Mummy: what a mess! Nobody knows what's happening, but it's fun.
 *   3. The pirate king. Get all round the wreck without falling in the sea
 *      (the floor). Teddy hops barrel, plank, chest; Barney climbs on the
 *      barrel. "Don't get caught by the pirate king!" "A pirate king? First
 *      time I've ever been called that!" Uncle Bill goes out of the door…
 *      quiet… and creeps in from the other side, growling "Arrr!" Barney's
 *      barrel wobbles. Teddy calls Barney across to the plank
 *      and he jumps to it. "Blow me down! Missed you!" Round
 *      the wreck twice, then: time for ship's rations!
 *   4. Ship's rations. The picnic hamper. Where's Uncle Bill's concertina?
 *      It pops up on the hamper, and Barney brings it
 *      across to Uncle Bill. Then the sing-song,
 *      everyone bobbing. The rain stops and the sun comes in at the
 *      window. A voyage to Plumtree Island after all! Get the boat-house
 *      shipshape. Mummy: thank goodness!
 *   5. Plumtree Island. The motor boat on the river; the engine goes phut
 *      and stops. Uncle Bill pulls the cord and it starts again.
 *      To the island: a duck and her ducklings (Barney quacks hello), but it's far too wet to land. Maybe next time. Barney:
 *      the shipwreck was the best bit! Can we have another one next time?
 *      A rainbow, and the end.
 *
 * The storm is the danger, kept to sound and a soft darkening: no
 * lightning on screen (nothing flashes). The pirate king is Uncle Bill
 * playing, and the cubs know it: a growl, a creep and a wobble, never a
 * grab. Mummy stays at the boat-house in the last scene; only three fit in
 * the boat.
 */
import { defineCartoon, NOTE, noiseBurst, now, tone, type Kit } from '../../kit';
import { moves as commonMoves, sounds as commonSounds } from '../../worlds/common/moves';
import { sounds as bearSounds } from '../../worlds/bears/moves';
import meta from './meta';

const { laugh, giggle } = commonSounds;
const { together } = commonMoves;
const { yum, sigh } = bearSounds;

// ------------------------------------------------------------------- art

/** A soft watercolour rainbow, for the end. 900 × 420. */
const rainbow = (): string => {
  const bands = ['#e88a7f', '#f2b36b', '#f2dc7a', '#9fcb8a', '#8fb5dc', '#b49ad0'];
  const arcs = bands
    .map((c, i) => `<path d="M ${40 + i * 22} 420 A ${410 - i * 22} ${380 - i * 22} 0 0 1 ${860 - i * 22} 420" fill="none" stroke="${c}" stroke-width="24" stroke-linecap="round" opacity="0.55"/>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 420">${arcs}</svg>`;
};

/** Nothing to see: a place for his ring (the engine and the plank are parts of bigger props). */
const spot = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"></svg>';

// ---------------------------------------------------------------- sounds

/** Rain on a roof: a soft hiss for `seconds`, swelling and fading. */
function rain(seconds = 3): void {
  const t = now();
  noiseBurst(t, { freq: 3500, q: 0.5, peak: 0.035, attack: 0.6, decay: seconds, type: 'highpass' });
  for (let i = 0; i < seconds * 5; i++) noiseBurst(t + Math.random() * seconds, { freq: 5000, q: 3, peak: 0.012, attack: 0.002, decay: 0.03 });
}

/** The engine: putt-putt-putt for `seconds`. */
function putt(seconds = 2): void {
  const t = now();
  for (let i = 0; i < seconds * 6; i++) {
    tone(70, t + i / 6, { wave: 'square', peak: 0.03, attack: 0.005, decay: 0.08, lowpass: 400 });
    noiseBurst(t + i / 6, { freq: 300, q: 1, peak: 0.03, attack: 0.005, decay: 0.07 });
  }
}

/** The engine giving up: putt… putt… phut. */
function phut(): void {
  const t = now();
  [0, 0.45, 1.1].forEach((dt, i) => tone(70 - i * 10, t + dt, { wave: 'square', peak: 0.035, attack: 0.005, decay: 0.12, lowpass: 400 }));
  noiseBurst(t + 1.1, { freq: 500, q: 0.7, peak: 0.04, attack: 0.01, decay: 0.3, sweepTo: 150 });
}

/** Uncle Bill's concertina: a jolly reedy sea-shanty, two bars a time (2.4 s). */
function shanty(bars = 2): void {
  const t = now();
  const tune = [NOTE.G4, NOTE.C5, NOTE.C5, NOTE.E5, NOTE.D5, NOTE.C5, NOTE.A4, NOTE.G4, NOTE.C5, NOTE.E5, NOTE.G5, NOTE.E5];
  for (let b = 0; b < bars; b++) {
    tune.forEach((n, i) => {
      tone(n, t + b * 2.4 + i * 0.2, { wave: 'sawtooth', peak: 0.035, attack: 0.03, decay: 0.2, lowpass: 1800, vibrato: [6, 3] });
      tone(n * 1.005, t + b * 2.4 + i * 0.2, { wave: 'square', peak: 0.015, attack: 0.03, decay: 0.2, lowpass: 1400 });
    });
    [NOTE.C4, NOTE.G3, NOTE.C4, NOTE.G3].forEach((n, i) => tone(n, t + b * 2.4 + i * 0.6, { wave: 'sawtooth', peak: 0.025, attack: 0.04, decay: 0.45, lowpass: 900 }));
  }
}

/** A drip shaken off a hat: a few bright little drops. */
function drips(): void {
  const t = now();
  [0, 0.09, 0.2, 0.27].forEach((dt) => tone(1400 + Math.random() * 600, t + dt, { wave: 'sine', peak: 0.03, attack: 0.003, decay: 0.08, glideTo: 2400 }));
}

// ------------------------------------------------------------------ cast

type Who = 'teddy' | 'barney' | 'mummy' | 'bill' | 'mat' | 'wreck' | 'plank' | 'basket' | 'concertina' | 'boat' | 'engine' | 'dim';
const cast = {} as Record<Who, HTMLElement>;
let clouds: HTMLElement[] = [];

/** Where the shipwreck stands, and the spots on it a cub can stand on (stage points, feet). */
const WRECK = { x: 210, y: 330, w: 760 };
const ON = {
  barrel: [WRECK.x + 110, WRECK.y + 172] as const,
  plank: [WRECK.x + 345, WRECK.y + 132] as const,
  chest: [WRECK.x + 682, WRECK.y + 232] as const,
};
/** The cubs' size on the wreck and on the floor. */
const CUB = 200;
const FLOOR = 652;

/** The motor boat, and where its engine is (stage points). */
const BOAT = { x: 600, y: 410, w: 600 };
const ENGINE = { x: BOAT.x - 8, y: BOAT.y + 60, w: 100 };

/** Jumps a cub in an arc so its feet land on `spot`. */
async function jumpTo(k: Kit, el: HTMLElement, spot: readonly [number, number], s = 0.6): Promise<void> {
  const b = k.box(el);
  const dx = spot[0] - (b.x + b.w / 2);
  const dy = spot[1] - (b.y + b.h);
  const up = Math.min(dy, 0) - 70;
  k.fx.boing();
  await k.all(
    k.to(el, s, { x: `+=${dx}`, ease: 'none' }),
    k.to(el, s / 2, { y: `+=${up}`, ease: 'power2.out' }).then(() => k.to(el, s / 2, { y: `+=${dy - up}`, ease: 'power2.in' })),
  );
  k.fx.thud();
}

/** Uncle Bill's concertina squeezed in and out `times` times: the bellows narrow and the ends follow. */
async function squeeze(k: Kit, el: HTMLElement, times: number): Promise<void> {
  const [bellows] = k.pivot(k.part(el, 'bellows'));
  const endL = k.part(el, 'endL');
  const endR = k.part(el, 'endR');
  for (let i = 0; i < times; i++) {
    await k.all(k.to(bellows, 0.3, { scaleX: 0.6, ease: 'sine.inOut' }), k.to(endL, 0.3, { x: 22, ease: 'sine.inOut' }), k.to(endR, 0.3, { x: -22, ease: 'sine.inOut' }));
    await k.all(k.to(bellows, 0.3, { scaleX: 1, ease: 'sine.inOut' }), k.to(endL, 0.3, { x: 0, ease: 'sine.inOut' }), k.to(endR, 0.3, { x: 0, ease: 'sine.inOut' }));
  }
}

/** Fades out every drop of ambient rain on stage. */
function stopRain(k: Kit, s = 1.5): Promise<void> {
  const drops = [...k.root.querySelectorAll<HTMLElement>('.story-mote')];
  return k.all(...drops.map((d) => k.fade(d, 0, s)));
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. Storm clouds
    excited: { who: 'narrator', text: 'Teddy Bear was so excited today!' },
    plumtree: { who: 'teddy', text: 'Uncle Sailor Bill is taking us to Plumtree Island! In his boat!' },
    picnic: { who: 'barney', text: 'With a picnic! And a sing-song round a camp-fire!' },
    clouds: { who: 'mummy-bear', text: 'Hmm. I don’t like the look of those clouds.' },
    bigClouds: { who: 'barney', text: 'Big grey clouds, Teddy! Are they rain clouds?' },
    aDrop: { who: 'teddy', text: 'Oh no! I felt a drop!' },
    downCame: { who: 'narrator', text: 'Suddenly, down came the rain!' },
    quick: { who: 'teddy', text: 'Quick! Make for the boat-house!' },
    spoilt: { who: 'narrator', text: 'Poor Teddy! It looked as if their special treat was spoilt.' },
    // 2. Just the weather for a shipwreck
    allWet: { who: 'barney', text: 'We’re all wet. And our boat trip is spoilt.' },
    halfway: { who: 'teddy', text: 'My Uncle Sailor Bill has sailed half-way round the world!' },
    wontStop: { who: 'teddy', text: 'A thunderstorm won’t stop him getting here. You’ll see!' },
    ahoy: { who: 'uncle-bill', text: 'Ahoy there, me hearties! Just the weather for a shipwreck, eh?' },
    aShipwreck: { who: 'teddy', text: 'A shipwreck?' },
    keepAfloat: { who: 'uncle-bill', text: 'That’s right! Let’s find all the things that will keep us afloat!' },
    askMat: { who: 'uncle-bill', text: 'Teddy, see if you can roll up that mat, will you?' },
    rollIt: { who: 'barney', text: 'I’ll help, Teddy! Roll, roll, roll!' },
    thanksMatBarney: { who: 'teddy', text: 'All rolled up! Thanks, Barney!' },
    bestEver: { who: 'uncle-bill', text: 'This is going to be the best shipwreck ever!' },
    whatAMess: { who: 'mummy-bear', text: 'Oh, my goodness! Look at all this mess!' },
    nobodyKnew: { who: 'narrator', text: 'Nobody knew quite what was happening. But it was fun!' },
    // 3. The pirate king
    lookLively: { who: 'uncle-bill', text: 'Look lively, shipmates! Get round the wreck without falling in the sea!' },
    floorIsSea: { who: 'teddy', text: 'The floor is the sea, Barney! We mustn’t step on it!' },
    pirateKing: { who: 'teddy', text: 'And we mustn’t get caught by the pirate king!' },
    calledThat: { who: 'uncle-bill', text: 'A pirate king? First time I’ve ever been called that, Teddy!' },
    hereComes: { who: 'uncle-bill', text: 'Arrr! Then I’ll be the pirate king! Look out, shipmates!' },
    whereGone: { who: 'barney', text: 'Where’s he gone, Teddy?' },
    whoseShip: { who: 'uncle-bill', text: 'Arrr! Who’s that standing on my ship?' },
    wobbling: { who: 'barney', text: 'Teddy! My barrel’s wobbling!' },
    jumpNow: { who: 'teddy', text: 'Jump to the long plank, Barney! Now!' },
    madeItTeddy: { who: 'barney', text: 'I made it! Thanks, Teddy!' },
    missed: { who: 'uncle-bill', text: 'Blow me down! Missed you!' },
    rations: { who: 'uncle-bill', text: 'Time for ship’s rations!' },
    // 4. Ship's rations
    goodThings: { who: 'barney', text: 'Sandwiches! Buns! And lemonade!' },
    singSong: { who: 'uncle-bill', text: 'And now for a sing-song! Where’s my old concertina?' },
    fetchConcertina: { who: 'barney', text: 'I’ll bring it, Uncle Bill!' },
    thanksConcertinaBarney: { who: 'uncle-bill', text: 'Thank you, Barney! Now, a tune!' },
    joinedIn: { who: 'narrator', text: 'And everyone joined in with all the jolly songs they knew.' },
    stopped: { who: 'barney', text: 'Look, everyone! It’s stopped raining!' },
    afterAll: { who: 'uncle-bill', text: 'So it’s a voyage to Plumtree Island after all!' },
    shipshape: { who: 'uncle-bill', text: 'Get the boat-house shipshape. Then we set sail!' },
    thankGoodness: { who: 'mummy-bear', text: 'Shipshape? Thank goodness for that!' },
    waveYouOff: { who: 'mummy-bear', text: 'Off you go, sailors! I’ll wave from the bank.' },
    // 5. Plumtree Island
    offTheySailed: { who: 'narrator', text: 'Off they sailed, down the river to Plumtree Island.' },
    engineStopped: { who: 'teddy', text: 'Oh! The engine’s stopped!' },
    pullCord: { who: 'uncle-bill', text: 'She needs a helping paw. I’ll give the cord a pull. Heave!' },
    offWeGo: { who: 'uncle-bill', text: 'There she goes! Putt-putt-putt! Off we go again!' },
    ducklings: { who: 'teddy', text: 'Look! A mummy duck and her ducklings!' },
    quackHello: { who: 'barney', text: 'Hello, ducks! Quack, quack!' },
    duckBarney: { who: 'teddy', text: 'Quack! She says hello, Barney!' },
    tooWet: { who: 'uncle-bill', text: 'Sorry, shipmates. The island’s too wet to land on today.' },
    nextTime: { who: 'uncle-bill', text: 'Maybe next time, eh? When it’s fair weather for sailing.' },
    bestBit: { who: 'barney', text: 'The shipwreck was the best bit!' },
    another: { who: 'teddy', text: 'Can we have another shipwreck next time, please?' },
    rainOrShine: { who: 'uncle-bill', text: 'Ha-ha! Rain or shine, shipmates!' },
    end: { who: 'narrator', text: 'And every little bear hoped for another shipwreck next time!' },
  },
  scenes: [
    // ==================================================== 1. Storm clouds
    {
      name: 'Storm clouds',
      set(k) {
        k.backdrop('bear-river');
        k.music('adventure');
        cast.mummy = k.character('mummy-bear', { x: 250, y: 357, w: 260 });
        cast.teddy = k.character('teddy', { x: 480, y: 414, w: 210 });
        cast.barney = k.character('barney', { x: 660, y: 414, w: 210, flip: true });
        clouds = [
          k.prop('storm-cloud', { x: 60, y: 10, w: 380, z: 8 }),
          k.prop('storm-cloud', { x: 380, y: -20, w: 420, z: 8 }),
          k.prop('storm-cloud', { x: 740, y: 20, w: 380, z: 8 }),
        ];
        clouds.forEach((c, i) => k.set(c, { x: 1250 - i * 60, opacity: 0 }));
        cast.dim = k.dim(0.32, '#2c3442');
        k.set(cast.dim, { opacity: 0 });
      },
      async play(k) {
        const { teddy, barney, mummy, dim } = cast;
        await k.wait(300);
        k.pose(teddy, 'happy');
        await k.all(k.say('excited'), k.hop(teddy, 40, 2));
        await k.say('plumtree', teddy);
        k.pose(teddy, 'default');
        k.pose(barney, 'happy');
        await k.all(k.say('picnic', barney), k.wait(300).then(() => k.hop(barney, 30)));
        k.pose(barney, 'default');
        k.face(teddy, true);

        // Mummy looks up. The first cloud rolls in, and a rumble far away.
        k.fx.rumble(2);
        void k.to(dim, 3, { opacity: 0.15 });
        await k.to(clouds[0], 3, { x: 0, opacity: 1, ease: 'sine.inOut' });
        k.face(teddy, false);
        await k.say('clouds', mummy);
        k.fx.wind(2);
        void k.to(dim, 3, { opacity: 0.32 });
        await k.all(
          k.to(clouds[1], 2.6, { x: 0, opacity: 1, ease: 'sine.inOut' }),
          k.wait(500).then(() => k.to(clouds[2], 2.6, { x: 0, opacity: 1, ease: 'sine.inOut' })),
        );
        await k.all(k.say('bigClouds', barney), k.shake(barney, 5, 2));

        // One drop… then down it comes.
        k.fx.pop();
        await k.all(k.say('aDrop', teddy), k.shake(teddy, 6, 2));
        k.sfx.thunder();
        rain(5);
        clouds.forEach((c) => void k.fade(k.part(c, 'rain'), 1, 0.8));
        k.ambient('rain', { count: 70 });
        await k.say('downCame');
        k.pose(teddy, 'cross');
        await k.say('quick', teddy);
        k.pose(teddy, 'default');

        // Everyone runs for the boat-house door, and in.
        k.face(teddy, false);
        k.face(mummy, false);
        k.fx.patter(10, 0.12);
        const inside = (el: HTMLElement, s: number): Promise<void> => {
          const b = k.box(el);
          return k.to(el, s, { x: `+=${945 - (b.x + b.w / 2)}`, y: `+=${664 - (b.y + b.h) - 8}`, scale: 0.8, ease: 'power1.in' }).then(() => k.fade(el, 0, 0.3));
        };
        await k.all(inside(barney, 1.1), k.wait(250).then(() => inside(teddy, 1.4)), k.wait(500).then(() => inside(mummy, 1.9)));
        rain(4);
        k.fx.rumble(2.5);
        await k.wait(600);
        sigh();
        await k.say('spoilt');
      },
    },

    // ==================================================== 2. Just the weather for a shipwreck
    {
      name: 'Just the weather for a shipwreck',
      set(k) {
        k.backdrop('boat-house');
        k.music('cosy');
        k.ambient('rain', { count: 24, z: 2, area: [330, 120, 290, 220] });
        cast.dim = k.dim(0.12, '#2c3442');
        cast.wreck = k.prop('shipwreck', { ...WRECK, z: 6 });
        k.set(cast.wreck, { opacity: 0 });
        cast.mat = k.prop('rag-mat', { x: 560, y: 566, w: 260, z: 7 });
        cast.mummy = k.character('mummy-bear', { x: 10, y: 357, w: 260 });
        cast.barney = k.character('barney', { x: 220, y: 414, w: 210 });
        cast.teddy = k.character('teddy', { x: 400, y: 414, w: 210, pose: 'sad' });
        cast.bill = k.character('uncle-bill', { x: 830, y: 346, w: 270, flip: true });
        k.set(cast.bill, { x: 150, opacity: 0 });
      },
      async play(k) {
        const { teddy, barney, mummy, bill, mat, wreck } = cast;
        rain(4);
        await k.wait(400);
        sigh();
        await k.say('allWet', barney);
        k.pose(teddy, 'default');
        k.face(teddy, true);
        await k.say('halfway', teddy);
        k.face(teddy, false);
        await k.say('wontStop', teddy);

        // The door bangs open: in he comes, shaking off the rain.
        k.fx.creak();
        await k.wait(300);
        await k.to(bill, 0.4, { opacity: 1 });
        k.fx.patter(4, 0.2);
        await k.to(bill, 1, { x: 0, ease: 'power2.out' });
        drips();
        k.sparkle(900, 380, 10, 120);
        await k.shake(bill, 8, 3);
        k.pose(bill, 'laugh');
        laugh();
        await k.say('ahoy', bill);
        k.pose(bill, 'default');
        await k.all(k.say('aShipwreck', teddy), k.shake(teddy, 5, 2));
        k.pose(bill, 'wave');
        await k.say('keepAfloat', bill);
        k.pose(bill, 'default');
        await k.say('askMat', bill);

        // Barney rolls up the mat.
        await k.say('rollIt', barney);
        k.flourish(mat);
        k.sfx.rustle();
        await k.all(k.fade(k.part(mat, 'flat'), 0, 0.6), k.wait(250).then(() => k.fade(k.part(mat, 'rolled'), 1, 0.4)));
        k.fx.thud();
        await k.say('thanksMatBarney', teddy);

        // Bump, thump: Uncle Bill builds the wreck in a cloud of dust.
        const spots: [number, number][] = [[ON.barrel[0], 560], [ON.plank[0], 520], [ON.chest[0], 570]];
        for (const [x, y] of spots) {
          k.fx.thud();
          k.puff(x, y, 200, '#e8e0cf');
          await k.wait(380);
        }
        await k.all(k.fade(wreck, 1, 0.6), k.fade(mat, 0, 0.6));
        k.quake(4);
        k.pose(bill, 'laugh');
        await k.say('bestEver', bill);
        k.pose(bill, 'default');
        const arms = [k.pivot(k.part(mummy, 'armL'))[0], k.pivot(k.part(mummy, 'armR'))[0]];
        void k.to(arms[0], 0.4, { rotation: 40 });
        void k.to(arms[1], 0.4, { rotation: -40 });
        await k.say('whatAMess', mummy);
        await k.all(k.to(arms[0], 0.4, { rotation: 0 }), k.to(arms[1], 0.4, { rotation: 0 }));
        giggle();
        await k.all(k.say('nobodyKnew'), k.hop(teddy, 30), k.wait(300).then(() => k.hop(barney, 30)));
      },
    },

    // ==================================================== 3. The pirate king
    {
      name: 'The pirate king',
      set(k) {
        k.backdrop('boat-house');
        k.music('adventure');
        k.ambient('rain', { count: 24, z: 2, area: [330, 120, 290, 220] });
        k.dim(0.12, '#2c3442');
        cast.wreck = k.prop('shipwreck', { ...WRECK, z: 6 });
        cast.plank = k.add(spot, { x: ON.plank[0] - 70, y: ON.plank[1] - 70, w: 140, h: 140, z: 13 });
        cast.teddy = k.character('teddy', { x: 20, y: FLOOR - CUB * 1.133, w: CUB, z: 12 });
        // Barney waits off stage and comes in on his jump to the barrel.
        cast.barney = k.character('barney', { x: -150, y: FLOOR - CUB * 1.133, w: CUB, z: 11 });
        k.set(cast.barney, { opacity: 0 });
        cast.bill = k.character('uncle-bill', { x: 975, y: 362, w: 240, flip: true, z: 10 });
      },
      async play(k) {
        const { teddy, barney, bill, plank } = cast;
        k.pose(bill, 'wave');
        await k.say('lookLively', bill);
        k.pose(bill, 'default');
        k.face(teddy, true);
        await k.say('floorIsSea', teddy);
        k.face(teddy, false);

        // Round the wreck: Teddy hops barrel, plank, chest; Barney onto the barrel.
        await jumpTo(k, teddy, ON.barrel);
        await jumpTo(k, teddy, ON.plank);
        void jumpTo(k, teddy, ON.chest);
        await k.wait(150);
        k.set(barney, { opacity: 1 });
        await jumpTo(k, barney, ON.barrel, 0.8);
        k.face(teddy, true);
        await k.say('pirateKing', teddy);
        k.pose(bill, 'laugh');
        laugh();
        await k.say('calledThat', bill);
        k.pose(bill, 'default');
        await k.say('hereComes', bill);

        // Out of the door he goes… and it's very quiet.
        k.face(bill, false);
        k.fx.patter(3, 0.2);
        await k.to(bill, 0.8, { x: 120, opacity: 0 });
        k.fx.creak();
        k.silence();
        await k.wait(900);
        await k.say('whereGone', barney);
        k.music('sneaky');
        await k.wait(500);

        // Creak… from the OTHER side: the pirate king creeps in, hunched and growling.
        k.face(teddy, true);
        k.face(barney, true);
        // (He was placed at x 975: -1300 is off stage left, -1010 just in.)
        k.set(bill, { x: -1300, opacity: 1, rotation: -8 });
        k.face(bill, false);
        k.fx.stomp(4, 0.5);
        await k.to(bill, 2.2, { x: -1010, ease: 'sine.inOut' });
        await k.camera({ zoom: 1.3, x: 260, y: 400 }, 1);
        await k.say('whoseShip', bill);
        await k.camera({}, 0.8);

        // Barney's barrel rocks.
        void k.to(barney, 0.25, { rotation: 8, yoyo: true, repeat: 5 });
        await k.say('wobbling', barney);
        k.set(barney, { rotation: 0 });

        // Teddy calls out: the plank, so Barney can jump away.
        await k.say('jumpNow', teddy);
        k.flourish(plank);
        await jumpTo(k, barney, ON.plank, 0.7);
        k.pose(barney, 'happy');
        k.fx.twinkle();
        await k.say('madeItTeddy', barney);
        k.pose(barney, 'default');
        k.set(bill, { rotation: 0 });
        k.pose(bill, 'laugh');
        laugh();
        await k.say('missed', bill);
        k.pose(bill, 'default');
        k.music('adventure');
        giggle();
        await k.all(k.hop(teddy, 25, 2), k.wait(300).then(() => k.hop(barney, 25, 2)));
        k.face(bill, false);
        await k.all(k.say('rations', bill), k.hop(bill, 20));
      },
    },

    // ==================================================== 4. Ship's rations
    {
      name: 'Ship’s rations',
      set(k) {
        k.backdrop('boat-house');
        k.music('cosy');
        k.ambient('rain', { count: 24, z: 2, area: [330, 120, 290, 220] });
        cast.dim = k.dim(0.12, '#2c3442');
        cast.wreck = k.prop('shipwreck', { ...WRECK, z: 4 });
        cast.mummy = k.character('mummy-bear', { x: 0, y: 357, w: 250, z: 10 });
        cast.teddy = k.character('teddy', { x: 230, y: 414, w: 200, z: 11 });
        cast.barney = k.character('barney', { x: 410, y: 414, w: 200, z: 11 });
        cast.bill = k.character('uncle-bill', { x: 780, y: 346, w: 270, flip: true, z: 10 });
        cast.basket = k.prop('picnic-basket', { x: 590, y: 548, w: 150, z: 14 });
        cast.concertina = k.prop('concertina', { x: 612, y: 436, w: 150, z: 15 });
        k.set(cast.concertina, { opacity: 0, scale: 0.4 });
      },
      async play(k) {
        const { teddy, barney, mummy, bill, basket, concertina, dim, wreck } = cast;
        await k.wait(300);
        // Back goes the hamper's lid: good things to eat.
        k.fx.creak();
        await k.pop(basket, 1.2);
        k.sparkle(665, 560, 12, 120);
        yum();
        k.pose(barney, 'happy');
        await k.say('goodThings', barney);
        k.pose(barney, 'default');

        // Where's the concertina? Up it pops from the hamper.
        k.pose(bill, 'laugh');
        await k.say('singSong', bill);
        k.pose(bill, 'default');
        k.fx.pop();
        await k.to(concertina, 0.5, { opacity: 1, scale: 1, ease: 'back.out(1.6)' });

        // Barney brings it from the hamper to Uncle Bill.
        await k.say('fetchConcertina', barney);
        await k.carry(concertina, [905, 570]);
        await k.say('thanksConcertinaBarney', bill);
        shanty(3);
        await k.all(
          squeeze(k, concertina, 12),
          k.hop(teddy, 20, 6),
          k.wait(200).then(() => k.hop(barney, 20, 6)),
          k.wait(600).then(() => k.say('joinedIn')),
        );

        // The rain stops, and the sun comes in at the window.
        await stopRain(k);
        const sun = k.light(475, 230, 260, { color: '#fff1b8', strength: 0.5 });
        k.set(sun, { opacity: 0 });
        k.fx.twinkle();
        await k.all(k.fade(sun, 0.5, 1.2), k.fade(dim, 0, 1.2));
        k.face(barney, false);
        await k.all(k.say('stopped', barney), k.hop(barney, 30));
        k.face(barney, true);
        k.pose(bill, 'wave');
        await k.say('afterAll', bill);
        k.pose(bill, 'default');
        await k.say('shipshape', bill);
        laugh();
        await k.say('thankGoodness', mummy);
        // Everything put back, in a cloud of dust.
        k.fx.thud();
        k.puff(590, 520, 260, '#e8e0cf');
        await k.all(k.fade(wreck, 0, 0.6), k.fade(concertina, 0, 0.6));
        await k.wait(400);
        await k.all(k.say('waveYouOff', mummy), k.wait(300).then(() => commonMoves.wave(k, mummy, 2)));
      },
    },

    // ==================================================== 5. Plumtree Island
    {
      name: 'Plumtree Island',
      set(k) {
        k.backdrop('plumtree-island');
        k.music('adventure');
        cast.bill = k.character('uncle-bill', { x: BOAT.x + 50, y: BOAT.y - 60, w: 200, z: 9 });
        cast.teddy = k.character('teddy', { x: BOAT.x + 230, y: BOAT.y - 40, w: 160, z: 9, flip: true });
        cast.barney = k.character('barney', { x: BOAT.x + 370, y: BOAT.y - 40, w: 160, z: 9, flip: true });
        cast.boat = k.prop('motor-boat', { ...BOAT, z: 12 });
        cast.engine = k.add(spot, { ...ENGINE, h: ENGINE.w, z: 13 });
        // They chug in from the right.
        k.set([cast.bill, cast.teddy, cast.barney, cast.boat, cast.engine], { x: 700 });
      },
      async play(k) {
        const { teddy, barney, bill, boat, engine } = cast;
        const duck = k.prop('duck', { x: 80, y: 548, w: 150, z: 8 });
        const all = [bill, teddy, barney, boat, engine];
        putt(3);
        await k.all(together(k, all, 3, { x: 0, ease: 'power1.out' }), k.wait(400).then(() => k.say('offTheySailed')));
        phut();
        await k.wait(1300);
        await k.all(k.say('engineStopped', teddy), k.shake(teddy, 5, 2));

        // Uncle Bill starts the engine again.
        await k.say('pullCord', bill);
        k.flourish(engine);
        putt(4);
        void k.shake(boat, 3, 4);
        await k.say('offWeGo', bill);
        // Round to the island's side.
        putt(3);
        await together(k, all, 3, { x: -140, ease: 'sine.inOut' });
        k.fx.twinkle();
        k.pose(teddy, 'happy');
        await k.say('ducklings', teddy);
        k.pose(teddy, 'default');

        // Barney says hello to the mummy duck.
        await k.say('quackHello', barney);
        k.flourish(duck);
        k.fx.boing();
        await k.hop(duck, 30, 2);
        await k.say('duckBarney', teddy);
        k.face(teddy, false);
        await k.say('tooWet', bill);
        await k.say('nextTime', bill);
        k.pose(barney, 'happy');
        await k.say('bestBit', barney);
        k.pose(barney, 'default');
        await k.say('another', teddy);
        k.pose(bill, 'laugh');
        laugh();
        await k.say('rainOrShine', bill);

        // A rainbow over the island, and the end.
        const bow = k.add(rainbow(), { x: 400, y: 40, w: 760, h: 355, z: 3 });
        k.set(bow, { opacity: 0 });
        k.music('triumph');
        k.fx.twinkle();
        await k.fade(bow, 1, 2);
        k.sparkle(590, 180, 18, 300);
        await k.say('end');
        await k.wait(1200);
      },
    },
  ],
});
