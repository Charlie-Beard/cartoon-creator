/**
 * Letters from No One: the start of the first Harry Potter book. A letter
 * comes for Harry, and Uncle Vernon will not let him read it. More and more
 * letters come, until Uncle Vernon runs away to a hut on a rock in the sea,
 * and at midnight, on Harry's birthday, someone very big knocks on the door.
 *
 *   1. A letter for Harry (the hall). A letter shoots through the letterbox
 *      and lands on the mat. Harry picks it up himself (his deed), and it's
 *      for him! Uncle Vernon takes it, goes purple and tears it up: "Nobody
 *      is reading this letter!" The next morning three more come whizzing
 *      through; Vernon dives and stuffs them up his jumper, then hammers
 *      planks over the letterbox, humming. Hook: Aunt Petunia shrieks and
 *      runs in with an egg that has a letter poking out of it.
 *   2. No post on Sundays (the lounge). Vernon is very pleased with himself:
 *      no post on Sundays! Then one letter whizzes out of the fireplace past
 *      his nose, there is a rumble in the chimney, and a joyful whirl of
 *      letters swirls round the room. Harry jumps and catches one (his
 *      deed). Vernon lunges for it and a great wave of letters buries him in
 *      his chair: only his moustache and eyes show. He pops out, purple:
 *      "We're going away!" Hook: a car door slams off, an engine starts.
 *   3. The hut on the rock. A storm, a bare little hut, everyone dozing.
 *      Harry, awake, counts down to midnight and draws himself a birthday
 *      cake in the dust (his deed). "Happy birthday to me." Then the scary
 *      beat: silence, BOOM, BOOM on the door, the camera creeps in, the door
 *      crashes down and a giant shape fills the doorway in the dark.
 *   4. Happy birthday, Harry. It's only Hagrid, and he'd like a cup of tea.
 *      He has sat on the cake, but it tastes fine (Harry opens the box:
 *      deed). Hagrid lights the fire with his umbrella, pointed only at the
 *      fireplace, and the Dursleys duck behind the sofa.
 *   5. Harry reads his letter. Hagrid hands it over, and Harry reads it at
 *      last (the big deed): he is a wizard! Vernon pops up to say
 *      he is not going and Hagrid booms him back down. Sausages for all,
 *      the Dursleys peeping, and "the best birthday ever".
 *
 * Safety choices: nobody is hit, grabbed or thrown (Vernon's rifle and
 * Dudley's pig's tail are left out altogether); the letters bury Vernon
 * gently and he is cross, not hurt; Hagrid's umbrella is only ever aimed at
 * the fireplace; the scary beat is sound first, then a dark shape, then a
 * cut to Hagrid asking for tea. The storm never flashes: thunder is far off
 * and only heard.
 *
 * Borrowed from the world: the Dursleys, Harry (muggle pose), Hagrid, the
 * hall, lounge and hut backdrops, owlPostLetter, letterPile, planks,
 * hagridCake and flame. One-off in this folder (art.ts): the egg, the
 * newspaper, the door and its dark night, the sofa front, the cake box,
 * umbrella and sausages, the cake drawn in the dust, and a few sounds.
 */
import { defineCartoon, noiseBurst, now, tone, type Kit } from '../../kit';
import { sounds as commonSounds } from '../../worlds/common/moves';
import { sounds as farawaySounds } from '../../worlds/faraway/moves';
import { sounds as hogSounds } from '../../worlds/hogwarts/moves';
import { cakeBox, doorLeaf, dustCake, egg, newspaper, nightDoorway, openedLetter, sausages, scrap, sofaFront, umbrella } from './art';
import meta from './meta';

const { slam } = commonSounds;
const { snore } = farawaySounds;
const { bellyLaugh, fireCrackle } = hogSounds;

// ---------------------------------------------------------------- sounds

/** A letter landing on the mat: a soft pat. */
function pat(): void {
  noiseBurst(now(), { freq: 700, type: 'lowpass', peak: 0.1, decay: 0.09 });
}

/** A letter ripping in two. */
function rip(): void {
  const t = now();
  noiseBurst(t, { freq: 3200, q: 1.5, peak: 0.12, attack: 0.01, decay: 0.2, sweepTo: 1200 });
  noiseBurst(t + 0.12, { freq: 2600, q: 1.5, peak: 0.1, attack: 0.01, decay: 0.2, sweepTo: 900 });
}

/** Aunt Petunia's shriek, far off: a wobbly rise and fall. */
function shriek(): void {
  const t = now();
  tone(820, t, { wave: 'triangle', peak: 0.06, attack: 0.05, decay: 0.7, glideTo: 1500, vibrato: [9, 30], lowpass: 2500 });
}

/** A watch ticking: a few small clicks. */
function tick(times = 1): void {
  const t = now();
  for (let i = 0; i < times; i++) noiseBurst(t + i * 0.5, { freq: 2600, q: 4, peak: 0.07, decay: 0.03 });
}

/** Thunder far away over the sea: low, slow and soft, never sudden. */
function farThunder(): void {
  const t = now();
  noiseBurst(t, { freq: 120, type: 'lowpass', peak: 0.12, attack: 0.7, decay: 2.2 });
  tone(48, t, { peak: 0.07, attack: 0.7, decay: 2, glideTo: 38 });
}

/** The car: a door slams, then an engine coughs and hums off. */
function carAway(): void {
  slam();
  const t = now() + 0.6;
  tone(60, t, { wave: 'sawtooth', peak: 0.08, attack: 0.3, decay: 1.6, glideTo: 90, vibrato: [20, 6], lowpass: 300 });
  noiseBurst(t, { freq: 200, type: 'lowpass', peak: 0.06, attack: 0.3, decay: 1.5 });
}

/** A BOOM on a door: deep and heavy, with the hut creaking after it. */
function doorBoom<K extends string>(k: Kit<K>, back: HTMLElement): void {
  k.sfx.boom();
  k.fx.stomp(1, 0.3);
  k.quake(5);
  void k.to(back, 0.06, { x: 5, yoyo: true, repeat: 5, ease: 'sine.inOut' });
}

// ------------------------------------------------------------------ cast

type Actor =
  | 'harry' | 'vernon' | 'petunia' | 'dudley' | 'hagrid'
  | 'letter' | 'egg' | 'paper' | 'back' | 'pile' | 'hero' | 'leaf' | 'sofa'
  | 'cake' | 'box' | 'brolly' | 'sheet' | 'sticks' | 'dust' | 'dim' | 'glow';
const cast = {} as Record<Actor, HTMLElement>;

/** Harry as he is before Hogwarts: the muggle pose, with no wand (he doesn't have one yet). */
function muggleHarry<K extends string>(k: Kit<K>, o: { x: number; y: number; w: number; z?: number; pose: 'muggle' }): HTMLElement {
  const h = k.character('harry', o);
  k.set(k.part(h, 'wand'), { opacity: 0 });
  return h;
}

// ------------------------------------------------------------ the hall

/** The letterbox's slot, and the doormat, in the hall. */
const SLOT: [number, number] = [145, 468];
const MAT: [number, number] = [160, 640];

/** Sends a letter whizzing out of the letterbox to land at `to`, spinning. Returns it. */
async function zip<K extends string>(k: Kit<K>, to: [number, number], rot: number, w = 110): Promise<HTMLElement> {
  const l = k.prop('owlPostLetter', { x: SLOT[0] - w / 2, y: SLOT[1] - w / 2, w, z: 14 });
  k.set(l, { scale: 0.5, rotation: -12 });
  k.sfx.whoosh();
  const dx = to[0] - SLOT[0];
  const dy = to[1] - SLOT[1];
  await k.to(l, 0.24, { x: dx * 0.7, y: -40, scale: 1, rotation: rot * 0.4, ease: 'power2.out' });
  await k.to(l, 0.3, { x: dx, y: dy, rotation: rot, ease: 'power2.in' });
  pat();
  return l;
}

/** Glides an actor so its middle is on `to` (no flourish). */
function glide<K extends string>(k: Kit<K>, el: HTMLElement, to: [number, number], seconds = 0.7, vars: Record<string, number | string> = {}): Promise<void> {
  const b = k.box(el);
  return k.to(el, seconds, { x: `+=${to[0] - (b.x + b.w / 2)}`, y: `+=${to[1] - (b.y + b.h / 2)}`, ...vars });
}

/** Mr Dursley goes purple (or back to pink). */
function purple<K extends string>(k: Kit<K>, vernon: HTMLElement, on = true): Promise<void> {
  return k.to(k.part(vernon, 'cross'), 0.6, { opacity: on ? 1 : 0 });
}

// ---------------------------------------------------------- the whirl

/** Where the letters burst out of the fireplace, in the lounge. */
const BURST: [number, number] = [590, 490];
const FLYERS = 34;
const LW = 100;

interface Flyer {
  el: HTMLElement;
  /** Seconds after the start that it leaves the fireplace. */
  s: number;
  th0: number;
  om: number;
  rx: number;
  ry: number;
  sc: number;
  /** Extra seconds before it dives onto Mr Dursley. */
  ds: number;
  jx: number;
  jy: number;
  free: boolean;
  gone: boolean;
}

const whirl = { T: 0, dive: Infinity, target: [950, 500] as [number, number], flyers: [] as Flyer[] };

/** A steady pseudo-random number from 0 to 1, so the whirl is the same every time. */
const rnd = (i: number, j: number): number => {
  const x = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Makes the letters (hidden), waiting at the fireplace. */
function buildWhirl<K extends string>(k: Kit<K>): void {
  whirl.T = 0;
  whirl.dive = Infinity;
  whirl.flyers = Array.from({ length: FLYERS }, (_, i) => {
    const el = k.prop('owlPostLetter', { x: BURST[0] - LW / 2, y: BURST[1] - LW / 2, w: LW, z: 26 });
    k.set(el, { opacity: 0 });
    return {
      el,
      s: i * 0.1,
      th0: rnd(i, 1) * Math.PI * 2,
      om: 1.0 + rnd(i, 2) * 0.9,
      rx: 190 + rnd(i, 3) * 340,
      ry: 90 + rnd(i, 4) * 170,
      sc: 0.8 + rnd(i, 5) * 0.5,
      ds: rnd(i, 6) * 0.7,
      jx: (rnd(i, 7) - 0.5) * 150,
      jy: (rnd(i, 8) - 0.5) * 70,
      free: false,
      gone: false,
    };
  });
}

/** Moves every letter to where it is at time T: out of the fireplace, round and round the room, then onto Mr Dursley. */
function stepWhirl<K extends string>(k: Kit<K>): void {
  const { T } = whirl;
  for (const f of whirl.flyers) {
    if (f.free || f.gone) continue;
    const a = T - f.s;
    if (a < 0) continue;
    const out = 1 - Math.pow(1 - Math.min(1, a / 1.1), 3);
    const th = f.th0 + f.om * a;
    const ox = 590 + f.rx * Math.cos(th);
    const oy = 360 + f.ry * Math.sin(th) + Math.sin(a * 2.3 + f.th0) * 14;
    let px = BURST[0] + (ox - BURST[0]) * out;
    let py = BURST[1] + (oy - BURST[1]) * out;
    let sc = f.sc * (0.4 + 0.6 * out) * (0.88 + 0.22 * Math.sin(th));
    const rot = (th * 180) / Math.PI * 0.35 + Math.sin(a * 3 + f.s) * 22;
    let opacity = 1;
    const c = Math.min(1, Math.max(0, (T - whirl.dive - f.ds) / 0.85));
    if (c > 0) {
      const e = c * c;
      px += (whirl.target[0] + f.jx - px) * e;
      py += (whirl.target[1] + f.jy - py) * e;
      sc *= 1 - 0.45 * e;
      if (c >= 1) {
        f.gone = true;
        opacity = 0;
      }
    }
    k.set(f.el, { x: px - BURST[0], y: py - BURST[1], rotation: rot, scale: sc, opacity });
  }
}

/** Starts the clock that drives the whirl (runs until the scene ends). */
function startWhirl<K extends string>(k: Kit<K>): void {
  void k.to(whirl, 90, { T: 90, ease: 'none', onUpdate: () => stepWhirl(k) });
}

// ----------------------------------------------------------- the hut

/** The hut's door, standing in front of the dark night (set), and what happens when it falls. */
function hutDoor<K extends string>(k: Kit<K>, fallen: boolean): void {
  k.add(nightDoorway(), { x: 50, y: 110, w: 200, z: 3 });
  cast.leaf = k.add(doorLeaf(), { x: 50, y: 110, w: 200, z: 9 });
  if (fallen) k.set(cast.leaf, { transformOrigin: '50% 100%', scaleY: 0.1, scaleX: 1.5, y: 70 });
  else k.set(cast.leaf, { transformOrigin: '50% 100%' });
}

/** Hagrid in the doorway, as big as he is. */
const HAGRID = { x: 10, y: 200, w: 420 };

/** The three Dursleys' places behind the sofa: heads up (y 0) or ducked down (y 150). */
const PEEK_Y = 262;

async function peek<K extends string>(k: Kit<K>, el: HTMLElement, seconds = 0.4): Promise<void> {
  k.set(el, { opacity: 1 });
  await k.to(el, seconds, { y: 0, ease: 'back.out(1.4)' });
}

async function duck<K extends string>(k: Kit<K>, el: HTMLElement, seconds = 0.3): Promise<void> {
  await k.to(el, seconds, { y: 150, ease: 'power2.in' });
  k.set(el, { opacity: 0 });
}

/** Where the cake sits on the floor, by Harry's feet. */
const CAKE_FLOOR: [number, number] = [470, 625];

/** Three flames for the hut's hearth (hidden by the caller until they are lit). */
function lightFlames<K extends string>(k: Kit<K>): HTMLElement[] {
  return [
    k.prop('flame', { x: 655, y: 470, w: 150, z: 6 }),
    k.prop('flame', { x: 705, y: 440, w: 190, z: 6 }),
    k.prop('flame', { x: 770, y: 490, w: 120, z: 6 }),
  ];
}

/** The hut after the door has fallen: Hagrid in the doorway, Harry, the Dursleys behind the sofa. `lit` for after the fire. */
function hutInside<K extends string>(k: Kit<K>, lit: boolean): void {
  cast.back = k.backdrop('hut-on-the-rock');
  k.music('cosy');
  k.ambient('rain', { count: 22, z: 6, area: [340, 130, 220, 200] });
  hutDoor(k, true);
  cast.hagrid = k.character('hagrid', { ...HAGRID, x: lit ? 50 : HAGRID.x, z: 8 });
  cast.harry = muggleHarry(k, { x: 490, y: 440, w: 215, z: 14, pose: 'muggle' });
  cast.dudley = k.character('dudleyBig', { x: 880, y: PEEK_Y, w: 190, flip: true });
  cast.vernon = k.character('vernon', { x: 880, y: PEEK_Y, w: 190, flip: true });
  cast.petunia = k.character('petunia', { x: 1025, y: PEEK_Y, w: 155, flip: true });
  k.set(cast.dudley, { y: 150, opacity: 0 });
  if (lit) {
    k.set([cast.vernon, cast.petunia], { y: 150, opacity: 0 });
    cast.cake = k.prop('hagridCake', { x: CAKE_FLOOR[0] - 70, y: CAKE_FLOOR[1] - 53, w: 140, z: 22 });
  }
  cast.sofa = k.add(sofaFront(), { x: 870, y: 440, w: 320, z: 20 });
  cast.dim = k.dim(lit ? 0.08 : 0.28, '#0b1030');
  cast.glow = k.light(730, 520, 380, { color: '#ff9a3c', strength: 0.5, z: 5 });
  if (lit) lightFlames(k);
  else k.set(cast.glow, { opacity: 0 });
}

// ------------------------------------------------------------------ show

export default defineCartoon({
  ...meta,
  lines: {
    // 1. A letter for Harry
    nobodyWrote: { who: 'narrator', text: 'Nobody ever wrote letters to Harry. Not ever. Until one morning…' },
    getPost: { who: 'vernon', text: 'Get the post, boy.' },
    forMe: { who: 'harry', text: 'It’s for me! Mr H. Potter. The Cupboard under the Stairs.' },
    harryLetter: { who: 'dudley', text: 'Dad! Dad! Harry’s got a letter!' },
    petunia: { who: 'vernon', text: 'P-P-PETUNIA!' },
    theyKnow: { who: 'petunia', text: 'Vernon! They know where he sleeps!' },
    mine: { who: 'harry', text: 'But it’s my letter! Nobody’s ever written to me before.' },
    nobody: { who: 'vernon', text: 'Nobody is reading this letter. NOBODY!' },
    nextDay: { who: 'narrator', text: 'The next morning, three more letters came.' },
    noPost: { who: 'vernon', text: 'Right! No post will come through this door. NONE!' },
    hammer: { who: 'vernon', text: 'A nail here… and a nail there… dum-de-dum!' },
    eggs: { who: 'petunia', text: 'Vernon! There are letters in the EGGS!' },
    // 2. No post on Sundays
    sunday: { who: 'vernon', text: 'Ahh. Sunday! Lovely, lovely Sunday. Do you know why I love Sundays, Dudley?' },
    dunno: { who: 'dudley', text: 'Dunno.' },
    noPostSunday: { who: 'vernon', text: 'No post on Sundays! Ha ha! No letters today!' },
    what: { who: 'vernon', text: 'What the…?' },
    aaah: { who: 'petunia', text: 'Aaah! Letters! Everywhere!' },
    catchOne: { who: 'harry', text: 'If I jump… I can catch one!' },
    giveIt: { who: 'vernon', text: 'Give that here, boy!' },
    dadsGone: { who: 'dudley', text: 'Mum! Dad’s gone!' },
    muffled: { who: 'vernon', text: 'THAT DOES IT! We’re going away. Far away. Where they CAN’T FIND US!' },
    programmes: { who: 'dudley', text: 'But what about my TV programmes?' },
    // 3. The hut on the rock
    drove: { who: 'narrator', text: 'Uncle Vernon drove and drove. All the way to a tiny hut on a rock in the sea.' },
    storm: { who: 'vernon', text: 'Ha! There’s a storm tonight. Nobody can bring post in a storm!' },
    beds: { who: 'petunia', text: 'Dudley gets the sofa. And you get the floor, Harry.' },
    nearlyMidnight: { who: 'harry', text: 'It’s nearly midnight. And at midnight it’s my birthday. I’ll be eleven!' },
    drawCake: { who: 'harry', text: 'Nobody’s going to give me a cake. So I’ll draw one.' },
    countdown: { who: 'harry', text: 'Three… two… one…' },
    happyBirthday: { who: 'harry', text: 'Happy birthday to me.' },
    whatsThat: { who: 'dudley', text: 'Wh-what was that?' },
    whosThere: { who: 'vernon', text: 'Who’s there? I warn you!' },
    // 4. Happy birthday, Harry
    cupOfTea: { who: 'hagrid', text: 'Couldn’t make us a cup o’ tea, could yeh? It’s not been an easy journey.' },
    heresHarry: { who: 'hagrid', text: 'An’ here’s Harry! Last time I saw you, you was only a baby.' },
    whoAreYou: { who: 'harry', text: 'Who are you?' },
    hagridName: { who: 'hagrid', text: 'Rubeus Hagrid. Keeper of Keys at Hogwarts. An’ I’ve got summat for yeh.' },
    satOnIt: { who: 'hagrid', text: 'I mighta sat on it at some point. But I ’spect it’ll taste fine.' },
    myCake: { who: 'harry', text: 'A birthday cake! Nobody’s ever given me a cake before!' },
    canIHave: { who: 'dudley', text: 'Can I have some?' },
    noDiddy: { who: 'petunia', text: 'Don’t you DARE, Dudley!' },
    cold: { who: 'hagrid', text: 'Brrr. It’s cold in here.' },
    yourLetter: { who: 'hagrid', text: 'An’ here’s yer letter. Go on, Harry. Read it.' },
    reads: { who: 'harry', text: 'Dear Mr Potter. You have a place at Hogwarts School of Witchcraft and Wizardry!' },
    whatsHogwarts: { who: 'harry', text: 'Hogwarts? What’s Hogwarts?' },
    yerAWizard: { who: 'hagrid', text: 'It’s a school. A school for magic. Harry… yer a wizard.' },
    aWhat: { who: 'harry', text: 'I’m a… what?' },
    thumpinGood: { who: 'hagrid', text: 'A wizard! An’ a thumpin’ good ’un, I’d say.' },
    notGoing: { who: 'vernon', text: 'He’s not going! I won’t have it!' },
    tryStoppin: { who: 'hagrid', text: 'I’d like ter see a great Muggle like you stop him!' },
    sausages: { who: 'hagrid', text: 'Now then. Who wants a sausage?' },
    meMe: { who: 'dudley', text: 'Ooh! Me!' },
    dudleyNo: { who: 'petunia', text: 'DUDLEY!' },
    bestBirthday: { who: 'harry', text: 'This is the best birthday ever.' },
  },
  scenes: [
    // ============================================ 1. A letter for Harry
    {
      name: 'A letter for Harry',
      set(k) {
        k.backdrop('dursley-hall');
        k.music('cosy');
        cast.harry = muggleHarry(k, { x: 270, y: 390, w: 230, pose: 'muggle' });
        cast.vernon = k.character('vernon', { x: 510, y: 355, w: 260, flip: true });
        cast.dudley = k.character('dudleyBig', { x: 780, y: 405, w: 215, flip: true });
        cast.petunia = k.character('petunia', { x: 970, y: 405, w: 215, flip: true });
        k.set(cast.petunia, { opacity: 0 });
      },
      async play(k) {
        const { harry, vernon, dudley } = cast;
        await k.wait(400);
        await k.say('nobodyWrote');

        // A letter shoots through the letterbox and lands on the mat.
        let letter = await zip(k, MAT, 20, 120);
        await k.wait(500);
        await k.say('getPost', vernon);

        // Harry's deed: he picks the letter up off the mat.
        const hb = k.box(harry);
        await k.carry(letter, [hb.x + hb.w * 0.5, hb.y + hb.h * 0.62]);
        await k.say('forMe', harry);
        await k.all(k.say('harryLetter', dudley), k.shake(dudley, 5, 3));

        // Vernon takes it (it floats over to him: nobody is grabbed), reads, and goes purple.
        const vb = k.box(vernon);
        await glide(k, letter, [vb.x + vb.w * 0.5, vb.y + vb.h * 0.85], 0.8, { rotation: -8 }); // low, so his mouth shows as he shouts
        await k.wait(400);
        await k.all(k.say('petunia', vernon), purple(k, vernon));

        // Petunia comes running and gasps.
        k.fx.patter(5);
        await k.enter(cast.petunia, 'right', 0.7);
        await k.all(k.say('theyKnow', cast.petunia), k.shake(cast.petunia, 5, 3));
        await k.say('mine', harry);

        // He tears it up. Nobody is reading it.
        await k.all(k.say('nobody', vernon), k.wait(500).then(async () => {
          rip();
          k.sfx.rustle();
          const lb = k.box(letter);
          const a = k.add(scrap(), { x: lb.x + 10, y: lb.y + 20, w: 70, z: 16 });
          const b = k.add(scrap(), { x: lb.x + 40, y: lb.y + 30, w: 60, z: 16, flip: true });
          k.remove(letter);
          await k.all(k.to(a, 0.9, { x: -70, y: 160, rotation: -140, opacity: 0, ease: 'power1.in' }), k.to(b, 0.9, { x: 60, y: 190, rotation: 160, opacity: 0, ease: 'power1.in' }));
          k.remove(a);
          k.remove(b);
        }));
        await purple(k, vernon, false);

        // The next morning: three more letters.
        await k.cut(() => {
          k.backdrop('dursley-hall');
          cast.vernon = k.character('vernon', { x: 560, y: 355, w: 260, flip: true });
          cast.petunia = k.character('petunia', { x: 800, y: 395, w: 230, flip: true });
          k.set(cast.petunia, { opacity: 0 });
        });
        const v = cast.vernon;
        let landed: HTMLElement[] = [];
        await k.all(
          k.say('nextDay'),
          k.wait(1300).then(async () => {
            landed.push(await zip(k, [290, 640], -25, 110));
            landed.push(await zip(k, [380, 646], 15, 110));
            landed.push(await zip(k, [460, 640], -10, 110));
          }),
        );

        // Vernon dives for them and stuffs them up his jumper.
        await k.to(v, 0.5, { x: -230, y: 20, ease: 'power2.in' });
        k.sfx.rustle();
        k.fx.thud();
        const bb = k.box(v);
        await k.all(...landed.map((l, i) => k.wait(i * 110).then(() => glide(k, l, [bb.x + bb.w * 0.5, bb.y + bb.h * 0.7], 0.5, { scale: 0.3, opacity: 0.3, ease: 'power2.in' }))));
        landed.forEach((l) => k.remove(l));
        landed = [];
        await k.pop(v, 1.1);
        await k.to(v, 0.4, { y: 0 });
        await k.say('noPost', v);

        // He nails planks over the letterbox, humming.
        await k.to(v, 0.5, { x: -330 });
        const planks = k.prop('planks', { x: 65, y: 432, w: 160, z: 14 });
        k.set(planks, { opacity: 0 });
        k.fx.knock(2);
        await k.appear(planks, 0.3);
        void (async () => {
          for (let i = 0; i < 4; i++) {
            k.fx.knock(2);
            await k.wait(750);
          }
        })();
        await k.say('hammer', v);
        k.flourish(planks);
        await k.wait(400);

        // A shriek off, and Petunia runs in holding an egg with a letter in it.
        shriek();
        await k.shake(v, 5, 2);
        const p = cast.petunia;
        k.set(p, { opacity: 1, x: 520 });
        cast.egg = k.add(egg(), { x: 800, y: 480, w: 105, z: 16 });
        k.set(cast.egg, { x: 520 });
        k.fx.patter(7);
        await k.all(k.say('eggs', p), k.to([p, cast.egg], 1.3, { x: 0, ease: 'power2.out' }));
        await k.shake(cast.egg, 5, 3);
        await k.wait(500);
      },
    },

    // ============================================ 2. No post on Sundays
    {
      name: 'No post on Sundays',
      set(k) {
        k.backdrop('dursley-lounge');
        k.music('cosy');
        cast.petunia = k.character('petunia', { x: 30, y: 350, w: 230 });
        cast.dudley = k.character('dudleyBig', { x: 300, y: 380, w: 215 });
        cast.harry = muggleHarry(k, { x: 570, y: 400, w: 220, pose: 'muggle' });
        cast.vernon = k.character('vernon', { x: 880, y: 340, w: 250, flip: true });
        cast.paper = k.add(newspaper(), { x: 905, y: 500, w: 200, z: 12 });
        buildWhirl(k);
      },
      async play(k) {
        const { petunia, dudley, harry, vernon } = cast;
        await k.wait(500);
        await k.say('sunday', vernon);
        await k.say('dunno', dudley);
        await k.all(k.say('noPostSunday', vernon), k.hop(vernon, 14));

        // One letter shoots out of the fireplace and whizzes past his nose. It hits nobody.
        const solo = k.prop('owlPostLetter', { x: BURST[0] - 55, y: BURST[1] - 55, w: 110, z: 26 });
        k.set(solo, { scale: 0.5 });
        k.sfx.whoosh();
        await k.to(solo, 0.5, { x: 300, y: -200, scale: 1, rotation: 200, ease: 'power1.out' });
        await k.to(solo, 0.35, { x: 420, y: -70, rotation: 330, ease: 'none' });
        await k.all(k.to(solo, 0.35, { x: 720, y: -150, rotation: 480, opacity: 0, ease: 'power1.in' }), k.to(vernon, 0.3, { rotation: 8, x: 12 }));
        k.remove(solo);
        await k.to(vernon, 0.3, { rotation: 0, x: 0 });
        await k.say('what', vernon);

        // A rumble in the chimney, and then the letters pour out and whirl round the room.
        k.fx.rumble(2.5);
        k.quake(3);
        await k.wait(1100);
        startWhirl(k);
        k.sfx.whoosh();
        void (async () => {
          for (let i = 0; i < 6; i++) {
            k.sfx.rustle();
            await k.wait(520);
          }
        })();
        await k.wait(1400);
        await k.to(petunia, 0.3, { y: '+=40', rotation: -8 });
        await k.say('aaah', petunia);
        await k.wait(600);

        // Harry's deed: he jumps and catches one.
        await k.say('catchOne', harry);
        const hero = whirl.flyers[8];
        hero.free = true;
        cast.hero = hero.el;
        void k.hop(harry, 70, 1);
        await k.wait(260);
        await k.carry(hero.el, harry, 0.5);
        k.set(hero.el, { scale: 0.9, rotation: 10 });
        await k.wait(600);

        // Vernon lunges for it, and a great wave of letters buries him in his chair.
        await k.all(k.say('giveIt', vernon), k.to(vernon, 0.5, { x: -55, rotation: -9 }));
        whirl.dive = whirl.T;
        whirl.target = [940, 500];
        await k.wait(600);
        cast.pile = k.prop('letterPile', { x: 775, y: 505, w: 330, z: 20 });
        k.set(cast.pile, { transformOrigin: '50% 100%' });
        k.fx.thud();
        k.sfx.rustle();
        k.quake(4);
        await k.appear(cast.pile, 0.5);
        // The letter Harry caught flutters out of his hands onto the pile.
        void k.to(harry, 0.2, { y: 0 });
        await k.to(hero.el, 0.9, { x: '+=230', y: '-=70', rotation: 40, scale: 0.8, ease: 'sine.inOut' });
        await k.wait(500);
        await k.say('dadsGone', dudley);

        // He pops out from under the pile, purple, and says they're going away.
        k.fx.pop();
        await k.to(vernon, 0.4, { y: -80, x: -45, rotation: 0, ease: 'back.out(1.6)' });
        await k.all(k.say('muffled', vernon), purple(k, vernon));
        await k.say('programmes', dudley);
        carAway();
        await k.wait(1800);
      },
    },

    // ============================================ 3. The hut on the rock
    {
      name: 'The hut on the rock',
      set(k) {
        cast.back = k.backdrop('hut-on-the-rock');
        k.music('spooky');
        k.ambient('rain', { count: 22, z: 6, area: [340, 130, 220, 200] });
        hutDoor(k, false);
        cast.petunia = k.character('petunia', { x: 270, y: 400, w: 210 });
        cast.vernon = k.character('vernon', { x: 640, y: 390, w: 230 });
        cast.dudley = k.character('dudleyBig', { x: 905, y: 340, w: 245, flip: true });
        cast.harry = muggleHarry(k, { x: 420, y: 450, w: 220, z: 14, pose: 'muggle' });
        cast.hagrid = k.character('hagrid', { ...HAGRID, z: 8 });
        k.set(cast.hagrid, { opacity: 0, filter: 'brightness(0.1)' });
        cast.sofa = k.add(sofaFront(), { x: 870, y: 440, w: 320, z: 20 });
        k.set(cast.sofa, { opacity: 0 });
        cast.dust = k.add(dustCake(), { x: 250, y: 640, w: 170, z: 16 });
      },
      async play(k) {
        const { petunia, vernon, dudley, harry, hagrid } = cast;
        const lids = (el: HTMLElement, closed: boolean) => k.part(el, 'lids').forEach((l) => (l.style.opacity = closed ? '1' : '0'));
        k.fx.wind(5);
        await k.wait(400);
        await k.say('drove');
        farThunder();
        await k.wait(700);
        await k.all(k.say('storm', vernon), k.shake(vernon, 4, 4));
        await k.say('beds', petunia);

        // Dudley snores at once, and the Dursleys doze off.
        lids(dudley, true);
        snore();
        await k.wait(900);
        lids(vernon, true);
        lids(petunia, true);
        await k.wait(1200);

        // Harry is awake, and it is nearly midnight.
        tick(3);
        await k.wait(600);
        await k.say('nearlyMidnight', harry);
        farThunder();
        await k.wait(500);

        // His deed: he draws himself a birthday cake in the dust, stroke by stroke.
        await k.say('drawCake', harry);
        const dust = cast.dust;
        for (const s of ['s1', 's2', 's3', 's4', 's5']) {
          k.fx.patter(2, 0.1);
          await k.fade(k.part(dust, s), 1, 0.28);
        }
        await k.wait(200);
        k.sfx.rustle();
        await k.fade(k.part(dust, 'candles'), 1, 0.5);
        await k.fade(k.part(dust, 'flames'), 1, 0.5);
        k.flourish(dust);
        await k.wait(700);

        // The countdown.
        void (async () => {
          for (let i = 0; i < 3; i++) {
            tick();
            await k.wait(900);
          }
        })();
        await k.say('countdown', harry);
        await k.wait(400);
        await k.say('happyBirthday', harry);
        await k.wait(500);

        // The scary beat: silence, and then BOOM.
        k.silence();
        await k.wait(1800);
        doorBoom(k, cast.back);
        lids(vernon, false);
        lids(petunia, false);
        lids(dudley, false);
        await k.wait(500);
        await k.all(k.say('whatsThat', dudley), k.shake(dudley, 6, 3));
        await k.wait(700);
        doorBoom(k, cast.back);
        await k.wait(1000);
        // Dudley slides down behind the sofa.
        void k.fade(cast.sofa, 1, 0.1);
        await k.wait(300);
        doorBoom(k, cast.back);
        await k.all(k.to(dudley, 0.5, { y: 190, ease: 'power2.in' }), k.shake(petunia, 4, 3));
        k.set(dudley, { opacity: 0 });
        await k.wait(300);
        await k.all(k.say('whosThere', vernon), k.to(vernon, 0.7, { x: -45, rotation: -5 }));
        await k.wait(1000);

        // The camera creeps in on the door.
        await k.camera({ zoom: 1.5, x: 200, y: 380 }, 1.6);
        await k.wait(900);
        doorBoom(k, cast.back);
        await k.wait(900);

        // CRASH: the door falls in, and a giant shape fills the doorway in the dark.
        k.fx.crash();
        k.quake(8);
        k.puff(150, 640, 300, '#3a3d48');
        k.set(hagrid, { opacity: 1 });
        await k.to(cast.leaf, 0.35, { scaleY: 0.1, scaleX: 1.5, y: 70, ease: 'power3.in' });
        k.puff(160, 660, 260, '#3a3d48');
        await k.wait(2200);
      },
    },

    // ============================================ 4. Happy birthday, Harry
    {
      name: 'Happy birthday, Harry',
      set(k) {
        hutInside(k, false);
      },
      async play(k) {
        const { hagrid, harry, dudley, vernon, petunia } = cast;
        await k.wait(500);

        // Hagrid squeezes in, ducking under the doorframe.
        k.fx.stomp(2, 0.45);
        k.quake(4);
        await k.to(hagrid, 0.5, { y: 50, rotation: -6, x: 30, ease: 'power2.out' });
        await k.to(hagrid, 0.6, { y: 0, rotation: 0, x: 50, ease: 'power2.inOut' });
        await k.say('cupOfTea', hagrid);
        await k.all(k.say('heresHarry', hagrid), k.hop(harry, 12));
        await k.say('whoAreYou', harry);
        await k.say('hagridName', hagrid);

        // He pulls out a box. He has sat on the cake.
        cast.box = k.add(cakeBox(), { x: 190, y: 540, w: 190, z: 18 });
        k.set(cast.box, { opacity: 0 });
        k.sfx.rustle();
        await k.appear(cast.box, 0.4);
        await k.say('satOnIt', hagrid);

        // Harry's deed: he opens the box and takes the cake.
        k.sfx.page();
        await k.to(k.part(cast.box, 'lid'), 0.4, { opacity: 0 });
        cast.cake = k.prop('hagridCake', { x: 205, y: 535, w: 150, z: 19 });
        await k.appear(cast.cake, 0.3);
        void k.fade(cast.box, 0, 0.3);
        const hb = k.box(harry);
        await k.carry(cast.cake, [hb.x + hb.w * 0.5, hb.y + hb.h * 0.8], 1);
        k.remove(cast.box);
        await k.say('myCake', harry);
        void glide(k, cast.cake, CAKE_FLOOR, 0.7);

        // Dudley creeps up for a bite; Mum says no.
        await k.all(duck(k, vernon, 0.3), peek(k, dudley, 0.9));
        await k.say('canIHave', dudley);
        await k.say('noDiddy', petunia);
        await duck(k, dudley);
        await k.wait(300);

        // Hagrid is cold: his pink umbrella is pointed at the empty fireplace, and whoosh: a fire.
        await k.say('cold', hagrid);
        cast.brolly = k.add(umbrella(), { x: 330, y: 400, w: 300, z: 16 });
        k.set(cast.brolly, { opacity: 0, rotation: -10 });
        await k.fade(cast.brolly, 1, 0.4);
        await k.wait(300);
        const flames = lightFlames(k);
        k.set(flames, { opacity: 0, scale: 0.4, transformOrigin: '50% 100%' });
        void duck(k, petunia);
        await k.beam([620, 365], [735, 540], '#ffd36b');
        k.sfx.whoosh();
        fireCrackle(10);
        k.flourish(flames[1]);
        void k.fade(cast.glow, 1, 0.8);
        void k.fade(cast.dim, 0.08, 1.4);
        await k.to(flames, 0.6, { opacity: 1, scale: 1, ease: 'back.out(1.6)' });
        k.music('dreamy');
        await k.wait(500);
        await k.fade(cast.brolly, 0, 0.5);
        await k.wait(600);
      },
    },

    // ============================================ 5. A letter for a wizard
    {
      name: 'Harry reads his letter',
      set(k) {
        hutInside(k, true);
      },
      async play(k) {
        const { hagrid, harry, dudley, vernon, petunia } = cast;
        await k.wait(400);

        // The letter at last.
        await k.say('yourLetter', hagrid);
        const env = k.prop('owlPostLetter', { x: 190, y: 430, w: 130, z: 18 });
        k.set(env, { opacity: 0 });
        await k.appear(env, 0.3);
        const hb = k.box(harry);
        await k.carry(env, [hb.x + hb.w * 0.5, hb.y + hb.h * 0.78], 1);
        await k.wait(300);

        // The big deed: Harry opens his letter and reads it.
        k.sfx.page();
        void k.vanish(env, 0.3);
        cast.sheet = k.add(openedLetter(), { x: 640, y: 490, w: 105, z: 22 });
        k.set(cast.sheet, { opacity: 0 });
        await k.appear(cast.sheet, 0.4);
        void k.glow('#ffd77a', 0.35, 1.4);
        k.music('magic');
        k.flourish(cast.sheet);
        await k.wait(400);
        await k.say('reads', harry);
        await k.say('whatsHogwarts', harry);
        await k.say('yerAWizard', hagrid);
        await k.say('aWhat', harry);
        await k.all(k.say('thumpinGood', hagrid), k.hop(hagrid, 12));
        k.music('cosy');

        // Uncle Vernon pops up to say no; Hagrid looms and booms him back down.
        await peek(k, vernon, 0.5);
        await k.all(k.say('notGoing', vernon), k.shake(vernon, 3, 4));
        await k.to(hagrid, 0.6, { y: -25, scale: 1.1, ease: 'power2.out' });
        k.fx.rumble(1.2);
        await k.camera({ zoom: 1.12, x: 400, y: 420 }, 0.8);
        await k.say('tryStoppin', hagrid);
        await duck(k, vernon, 0.35);
        await k.all(k.camera({}, 0.8), k.to(hagrid, 0.6, { y: 0, scale: 1 }));

        // Sausages for everyone who would like one.
        cast.sticks = k.add(sausages(), { x: 330, y: 470, w: 250, z: 18 });
        k.set(cast.sticks, { opacity: 0, rotation: -6 });
        void k.fade(cast.sticks, 1, 0.4);
        bellyLaugh();
        await k.say('sausages', hagrid);
        await peek(k, dudley, 0.4);
        await peek(k, petunia, 0.01);
        await k.all(k.say('meMe', dudley), k.shake(dudley, 4, 3));
        await k.all(k.say('dudleyNo', petunia), duck(k, dudley, 0.4));
        await k.wait(300);

        // Harry puts his letter away, takes a sausage and toasts it at the fire.
        void k.fade(cast.sheet, 0, 0.5);
        await k.carry(cast.sticks, [700, 585], 1);
        void k.to(cast.sticks, 0.3, { rotation: 4 });
        await k.wait(500);
        await peek(k, vernon, 0.5);
        await k.say('bestBirthday', harry);
        k.sparkle(740, 480, 14, 160);
        k.fx.jingle();
        k.confetti(24);
        await k.hop(harry, 24, 2);
        await k.wait(2000);
      },
    },
  ],
});
