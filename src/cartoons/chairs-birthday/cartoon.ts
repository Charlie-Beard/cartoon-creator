/**
 * The Wishing-Chair's Birthday: the chair is in a sulk and won't fly,
 * because it's its birthday and nobody remembered. So Mollie, Peter and
 * Jigs plan a secret party, fetch a cake from the Land of Birthdays, and
 * give the chair the best surprise of its life.
 *
 *   1. A sulky chair. In the playroom the chair grows its wings, and Mollie
 *      and Peter are thrilled, but it creaks crossly, folds its wings away
 *      and shuffles round with its back to them. Jigs counts on his fingers:
 *      a year ago today the chair came home. It's its birthday, and nobody
 *      remembered! The chair stamps a leg in a great big huff.
 *   2. A secret plan. Whispering in a huddle, so the chair can't hear: a
 *      surprise party! Peter snips and makes a paper-chain on the spot.
 *      Mollie wants a cake, a really big one, and Jigs knows where: the Land
 *      of Birthdays, where it's somebody's birthday every day. Jigs asks the
 *      chair, very nicely, to fly them there "for someone very special". It
 *      grumbles, but it grows its wings, and off they go.
 *   3. The Land of Birthdays. Cake-shaped cottages, bunting and a candle
 *      tree. Mr Bunloaf the Birthday Baker bustles out in a fluster, wishing
 *      Peter a happy birthday ("It's not my birthday." "Happy birthday
 *      anyway!"). His very last cake is theirs, but he's run out of candles.
 *      They grow on the candle tree, the best ones at the top: Peter climbs
 *      up and drops five down, Mollie catches them, and Jigs puts them on the
 *      cake. Mr Bunloaf wishes Jigs a happy birthday too.
 *   4. Flying home. The cake rides on Peter's knees. The chair leans back to
 *      peek; Mollie throws her tea towel over the cake. No peeking!
 *   5. Happy birthday, Chair! Jigs sends the chair out into the garden for
 *      a minute. Peter hangs his paper-chain, Mollie whisks off the tea
 *      towel, Jigs lights the candles with pixie sparks. In comes the chair:
 *      "Surprise! Happy birthday, dear Wishing-Chair!" It creaks for joy,
 *      grows its wings and blows out the candles with one big flap. Cake for
 *      everyone, and "Happy birthday anyway!" from Jigs.
 *
 * No villain: the trouble is a sulky chair, and a cake with no candles. The
 * chair can't talk, so it sulks in sounds and moves: a cross creak (its happy
 * creak turned upside down, sounds.ts), a stamped leg, turning away. The
 * friends never scold it; they put it right.
 *
 * Mr Bunloaf, the birthday-land backdrop and the birthday-cake, candle and
 * paper-chain props are new in the wishing world. The playroom table and the
 * tea towel are drawn here (art.ts).
 */
import { defineCartoon, type Kit } from '../../kit';
import { sounds as anywhere } from '../../worlds/common/moves';
import { warmEnding } from '../../worlds/common/pieces';
import { moves as wishing, sounds } from '../../worlds/wishing/moves';
import { chairRide, type Ride } from '../../worlds/wishing/pieces';
import { table, teaTowel } from './art';
import meta from './meta';
import { blowOut, counting, huff, pick, snip, spark, stamp } from './sounds';

const { highWind, creak, hatBell } = sounds;
const { laugh } = anywhere;

// ------------------------------------------------------------------ cast

type Name = 'mollie' | 'peter' | 'jigs' | 'bunloaf' | 'cake' | 'chain' | 'table' | 'towel' | 'glow';
const cast = {} as Record<Name, HTMLElement>;
let ride: Ride;

/** The friends sat in the chair: Mollie and Peter on the seat, Jigs on the left arm. */
const RIDERS: { id: string; slot: 'left' | 'right' | 'armL' }[] = [
  { id: 'mollie', slot: 'left' },
  { id: 'peter', slot: 'right' },
  { id: 'jigs', slot: 'armL' },
];

/**
 * The Land of Birthdays, in stage points. Peter stands at the foot of the
 * candle tree (his box's top-left, at w 175), then climbs 80 across and 350
 * up onto its long flat bough (CANDLE_TREE.bough: feet at y 290, x 860-1010),
 * among the best candles. The cake stands on a
 * table in the open ground, beside Mr Bunloaf's bakery.
 */
const LAND = {
  peterFoot: { x: 770, y: 442 },
  mollie: { x: 600, y: 436, w: 180 },
  /** Where Mollie holds the candles she catches, in a little row. */
  catchAt: { x: 650, y: 585 },
  cake: { x: 410, y: 409, w: 170 },
};
/** Where each of the cake's five candles stands (birthday-cake's own 300 × 260 units: base x, base y). */
const CAKE_CANDLES: [number, number][] = [[102, 92], [126, 84], [150, 94], [174, 84], [198, 92]];

// ------------------------------------------------------------- helpers

/** The `x` and `y` offsets that put an actor's middle on a stage point (from where it was placed). */
function at(el: HTMLElement, cx: number, cy: number): { x: number; y: number } {
  const l = parseFloat(el.style.left) || 0;
  const t = parseFloat(el.style.top) || 0;
  const w = parseFloat(el.style.width) || 0;
  const h = parseFloat(el.style.height) || 0;
  return { x: cx - (l + w / 2), y: cy - (t + h / 2) };
}

/** The empty chair (and its front) moving as one. */
function chairTo(k: Kit, r: Ride, s: number, vars: Parameters<Kit['to']>[2]): Promise<unknown> {
  return k.all(k.to(r.chair, s, vars), k.to(r.front, s, vars));
}

/** The empty chair in a huff: a cross creak and a stamped leg (a little hop and a thump). */
async function huffy(k: Kit, r: Ride, stamps = 1, big = false): Promise<void> {
  huff(big);
  for (let i = 0; i < stamps; i++) {
    await chairTo(k, r, 0.16, { y: '-=18', ease: 'power1.out' });
    await chairTo(k, r, 0.12, { y: '+=18', ease: 'power2.in' });
    stamp();
    if (big) void k.quake(3);
    await k.wait(160);
  }
}

/** Flies the whole ride, and anything riding along with it, by the same amount. */
async function flyWith(k: Kit, r: Ride, extras: HTMLElement[], o: { x?: number; y?: number; s?: number }): Promise<void> {
  const s = o.s ?? 1.6;
  const here = k.box(r.chair);
  const dx = o.x === undefined ? 0 : o.x - (here.x - r.at.x);
  const dy = o.y === undefined ? 0 : o.y - (here.y - r.at.y);
  await k.all(chairRide.fly(k, r, o), ...extras.map((el) => k.to(el, s, { x: `+=${dx}`, y: `+=${dy}`, ease: 'sine.inOut' })));
}

// ------------------------------------------------------------------ show

export default defineCartoon({
  ...meta,
  lines: {
    // 1. A sulky chair
    wingsGrow: { who: 'peter', text: 'Look! The chair’s growing its wings!' },
    whereToday: { who: 'mollie', text: 'Hooray! Where shall we fly today, Chair?' },
    comeBack: { who: 'peter', text: 'Hey! Don’t you want to fly, Chair?' },
    sulking: { who: 'jigs', text: 'Jumping jigs! It’s cross. It’s in a great big sulk.' },
    whyCross: { who: 'mollie', text: 'Oh dear. Why are you cross, Chair?' },
    letMeCount: { who: 'jigs', text: 'Hang on. Let me count on my fingers.' },
    itsBirthday: { who: 'jigs', text: 'Oh no! The chair came home a year ago today. It’s the chair’s birthday!' },
    weForgot: { who: 'peter', text: 'Its birthday? And we all forgot!' },
    // 2. A secret plan
    shh: { who: 'mollie', text: 'Shh! Come close. Let’s give the chair a surprise party!' },
    paperChain: { who: 'peter', text: 'Yes! I’ll make a paper-chain. Snip, snip, snip!' },
    needCake: { who: 'mollie', text: 'And a party needs a cake. A really big one!' },
    whereCake: { who: 'peter', text: 'But where can we get a really big cake?' },
    landOfBirthdays: { who: 'jigs', text: 'From the Land of Birthdays! It’s somebody’s birthday there every day.' },
    askNicely: { who: 'jigs', text: 'Leave it to me. I’ll ask very nicely.' },
    pleaseChair: { who: 'jigs', text: 'Dear Chair, please will you fly us somewhere? It’s for someone very special.' },
    itsGoing: { who: 'peter', text: 'It’s grumbling. But it’s growing its wings!' },
    // 3. The Land of Birthdays
    cakeHouses: { who: 'mollie', text: 'Look! The houses are shaped like cakes!' },
    buns: { who: 'bunloaf', text: 'Oh, my buns and biscuits! What a fluster I’m in!' },
    hbPeter: { who: 'bunloaf', text: 'Oh! Hello, hello! Happy birthday!' },
    notMine: { who: 'peter', text: 'But it’s not my birthday.' },
    anyway: { who: 'bunloaf', text: 'Happy birthday anyway! I’m Mr Bunloaf, the Birthday Baker.' },
    mayWeHave: { who: 'mollie', text: 'Please may we have a birthday cake? It’s for someone very special.' },
    lastCake: { who: 'bunloaf', text: 'You can have my very last one. But oh dear, I’ve run out of candles!' },
    candleTree: { who: 'bunloaf', text: 'Candles grow on the candle tree. The best ones are right at the top.' },
    illClimb: { who: 'peter', text: 'I’m a good climber. I’ll get them!' },
    illCatch: { who: 'mollie', text: 'Drop them down, Peter. I’ll catch them!' },
    fiveCandles: { who: 'peter', text: 'One, two, three, four, five! The best ones!' },
    onTheCake: { who: 'jigs', text: 'And I’ll put them on the cake. Very carefully.' },
    hbJigs: { who: 'bunloaf', text: 'Perfect! Happy birthday, little pixie!' },
    notMineEither: { who: 'jigs', text: 'It’s not my birthday either!' },
    anywayJigs: { who: 'bunloaf', text: 'Happy birthday anyway!' },
    // 4. Flying home
    gently: { who: 'peter', text: 'Fly gently, Chair! This cake is very wobbly.' },
    peeking: { who: 'jigs', text: 'Hee hee! The chair’s trying to peek!' },
    noPeeking: { who: 'mollie', text: 'No peeking, Chair! Not till we get home.' },
    nearlyHome: { who: 'peter', text: 'Nearly home! Hold on tight, little cake.' },
    // 5. Happy birthday, Chair!
    waitOutside: { who: 'jigs', text: 'Chair, would you wait in the garden? Just for a minute.' },
    upItGoes: { who: 'peter', text: 'Quick! Up goes my paper-chain!' },
    offTowel: { who: 'mollie', text: 'Off comes the tea towel. Ta-da!' },
    lightCandles: { who: 'jigs', text: 'Now the candles. One little pixie spark for each!' },
    comeIn: { who: 'mollie', text: 'Ready! You can come in now, Chair!' },
    surprise: { who: 'peter', text: 'Surprise! Happy birthday to you!' },
    dearChair: { who: 'mollie', text: 'Happy birthday, dear Wishing-Chair!' },
    blewThem: { who: 'jigs', text: 'Jumping jigs! It blew the candles out with its wings!' },
    neverForget: { who: 'mollie', text: 'We’ll never forget your birthday again, Chair. Promise!' },
    cakeEveryone: { who: 'peter', text: 'Cake for everyone! Happy birthday, everybody!' },
    notOurs: { who: 'mollie', text: 'Peter, it’s not our birthday!' },
    anywayEnd: { who: 'jigs', text: 'Happy birthday anyway!' },
    end: { who: 'narrator', text: 'And every year after that, the Wishing-Chair had a birthday party. Nobody ever forgot again.' },
  },
  scenes: [
    // ==================================================== 1. A sulky chair
    {
      name: 'A sulky chair',
      set(k) {
        k.backdrop('playroom');
        k.music('cosy');
        cast.mollie = k.character('mollie', { x: 40, y: 380, w: 230 });
        cast.peter = k.character('peter', { x: 250, y: 380, w: 230 });
        cast.jigs = k.character('jigs', { x: 470, y: 470, w: 150 });
        ride = chairRide.set(k, { x: 660, y: 280, w: 400 });
      },
      async play(k) {
        const { mollie, peter, jigs } = cast;
        await k.wait(600);

        // The wings grow, and everyone is thrilled.
        await chairRide.wings(k, ride);
        await k.say('wingsGrow', peter);
        await k.hop(mollie, 30, 1);
        await k.say('whereToday', mollie);

        // But the chair creaks crossly, folds its wings and turns its back.
        k.silence();
        huff();
        await wishing.foldWings(k, ride.chair);
        stamp();
        await chairTo(k, ride, 0.8, { x: 70, scaleX: -1, rotation: 5, ease: 'sine.inOut' });
        await k.wait(300);
        await k.say('comeBack', peter);
        await huffy(k, ride, 1);
        k.music('sneaky');
        await k.say('sulking', jigs);
        await k.say('whyCross', mollie);

        // Jigs counts on his fingers...
        const [arm] = k.pivot(k.part(jigs, 'armR'));
        await k.all(
          k.say('letMeCount', jigs),
          k.wait(600).then(() => {
            counting(5);
            return k.to(arm, 0.28, { rotation: -30, yoyo: true, repeat: 4, ease: 'sine.inOut' });
          }),
        );
        await k.to(arm, 0.2, { rotation: 0 });
        hatBell();
        await k.hop(jigs, 30, 1);
        await k.say('itsBirthday', jigs);
        await k.all(k.shake(mollie, 4, 2), k.shake(peter, 4, 2));
        await k.say('weForgot', peter);

        // ...and the chair gives its biggest huff of all.
        await huffy(k, ride, 3, true);
        await k.wait(600);
      },
    },

    // ==================================================== 2. A secret plan
    {
      name: 'A secret plan',
      set(k) {
        k.backdrop('playroom');
        k.music('sneaky');
        cast.mollie = k.character('mollie', { x: 30, y: 400, w: 210 });
        cast.peter = k.character('peter', { x: 220, y: 400, w: 210 });
        cast.jigs = k.character('jigs', { x: 420, y: 480, w: 140 });
        cast.chain = k.prop('paper-chain', { x: 250, y: 596, w: 280, z: 14 });
        k.set(cast.chain, { transformOrigin: '0% 50%', scaleX: 0, opacity: 0 });
        ride = chairRide.set(k, { x: 740, y: 300, w: 380 });
        k.set([ride.chair, ride.front], { scaleX: -1, rotation: 5 });
      },
      async play(k) {
        const { mollie, peter, jigs, chain } = cast;
        await k.wait(500);

        // A huddle, whispering, so the chair can't hear.
        await k.say('shh', mollie);
        await k.all(k.to(mollie, 0.5, { x: 30 }), k.to(jigs, 0.5, { x: -30 }));

        // Peter makes a paper-chain on the spot.
        await k.say('paperChain', peter);
        snip(5);
        k.set(chain, { opacity: 1 });
        await k.to(chain, 1.3, { scaleX: 1, ease: 'sine.out' });
        k.flourish(chain);
        await k.wait(500);

        await k.say('needCake', mollie);
        await k.say('whereCake', peter);
        hatBell();
        await k.hop(jigs, 26, 1);
        await k.say('landOfBirthdays', jigs);
        await k.say('askNicely', jigs);

        // Jigs tiptoes over and asks the chair, very politely.
        k.fx.patter(5);
        await k.walk(jigs, 200, 1.2, 3);
        await k.say('pleaseChair', jigs);
        await k.wait(400);
        huff();
        await k.wait(900);
        await wishing.wriggle(k, ride.chair, 2);
        await chairTo(k, ride, 0.6, { scaleX: 1, rotation: 0, ease: 'sine.inOut' });
        k.music('adventure');
        await chairRide.wings(k, ride);
        await k.say('itsGoing', peter);

        // Everybody in, and off they fly, out of the doors.
        await k.all(k.hop(mollie, 40, 1), k.hop(peter, 40, 1), k.hop(jigs, 40, 1));
        k.remove(mollie);
        k.remove(peter);
        k.remove(jigs);
        await k.all(...RIDERS.map((r) => chairRide.seat(k, ride, r)));
        await k.wait(300);
        highWind(3);
        await chairRide.fly(k, ride, { x: 500, y: -720, s: 2.2 });
      },
    },

    // ==================================================== 3. The Land of Birthdays
    {
      name: 'The Land of Birthdays',
      set(k) {
        k.backdrop('birthday-land');
        k.music('adventure');
        cast.table = k.add(table(), { x: 400, y: 537, w: 190, z: 9 });
        cast.cake = k.prop('birthday-cake', { x: LAND.cake.x, y: LAND.cake.y, w: LAND.cake.w, z: 10 });
        for (let i = 1; i <= 5; i++) k.set(k.part(cast.cake, `candle${i}`), { opacity: 0 });
        k.set([cast.table, cast.cake], { opacity: 0 });
        cast.bunloaf = k.character('bunloaf', { x: 70, y: 402, w: 210, pose: 'fluster' });
        k.set(cast.bunloaf, { x: 120, scale: 0.9, opacity: 0 });
        ride = chairRide.set(k, { x: 440, y: 368, w: 300, wings: true, riders: RIDERS });
        [cast.mollie, cast.peter, cast.jigs] = ride.riders;
        chairRide.jump(k, ride, { x: -1000, y: -600 });
      },
      async play(k) {
        const { mollie, peter, jigs, bunloaf, cake, table: tb } = cast;

        // The chair flies down and lands among the cake-shaped cottages.
        highWind(3);
        await chairRide.fly(k, ride, { x: 0, y: -30, s: 2.4 });
        await k.say('cakeHouses', mollie);
        await chairRide.land(k, ride);
        await chairRide.hopOff(k, ride, peter, { ...LAND.peterFoot, w: 175 });
        await chairRide.hopOff(k, ride, mollie, LAND.mollie);
        await chairRide.hopOff(k, ride, jigs, { x: 290, y: 504, w: 120 });
        // The chair flutters off to wait at the foot of the candle tree.
        creak();
        await chairTo(k, ride, 1, { x: 485, y: 53, scale: 0.65, ease: 'sine.inOut' });

        // Mr Bunloaf bustles out of his bakery, in a fluster.
        k.music('cosy');
        k.fx.creak();
        k.fx.patter(6);
        await k.to(bunloaf, 0.7, { x: 0, scale: 1, opacity: 1, ease: 'back.out(1.4)' });
        await k.say('buns', bunloaf);
        k.pose(bunloaf, 'beam');
        await k.say('hbPeter', bunloaf);
        await k.say('notMine', peter);
        await k.say('anyway', bunloaf);
        await k.say('mayWeHave', mollie);

        // His very last cake, but no candles.
        k.fx.pop();
        await k.all(k.appear(tb, 0.4), k.wait(200).then(() => k.appear(cake, 0.5)));
        k.pose(bunloaf, 'fluster');
        await k.say('lastCake', bunloaf);
        await k.say('candleTree', bunloaf);

        // Peter climbs the candle tree, up onto its long flat bough.
        await k.say('illClimb', peter);
        k.fx.patter(5);
        await k.to(peter, 0.9, { x: '+=50', y: '-=170', ease: 'sine.inOut' });
        k.fx.patter(5);
        await k.to(peter, 0.9, { x: '+=30', y: '-=180', ease: 'sine.inOut' });
        k.fx.thud();
        await k.say('illCatch', mollie);

        // He drops five candles down; Mollie catches every one.
        const caught: HTMLElement[] = [];
        const counted = k.say('fiveCandles', peter);
        for (let i = 0; i < 5; i++) {
          const c = k.prop('candle', { x: 990 - 14, y: 120, w: 28, z: 22 });
          pick();
          const to = at(c, LAND.catchAt.x + i * 18, LAND.catchAt.y);
          await k.to(c, 0.25, { y: -40, ease: 'sine.out' });
          await k.to(c, 0.55, { ...to, rotation: 360, ease: 'power1.in' });
          k.fx.pop();
          caught.push(c);
        }
        await counted;
        k.flourish(mollie);
        await k.wait(400);

        // Jigs puts them on the cake, one by one.
        await k.say('onTheCake', jigs);
        const s = LAND.cake.w / 300;
        for (const [i, c] of caught.entries()) {
          const [bx, by] = CAKE_CANDLES[i];
          pick();
          await k.to(c, 0.45, { ...at(c, LAND.cake.x + bx * s, LAND.cake.y + (by - 24) * s), scale: 0.68, ease: 'sine.inOut' });
          k.set(c, { opacity: 0 });
          k.set(k.part(cake, `candle${i + 1}`), { opacity: 1 });
          void k.hop(jigs, 14, 1);
        }
        k.flourish(cake);
        await k.wait(400);
        k.pose(bunloaf, 'beam');
        await k.say('hbJigs', bunloaf);
        await k.say('notMineEither', jigs);
        laugh();
        await k.say('anywayJigs', bunloaf);
        await k.hop(bunloaf, 30, 2);

        // Peter climbs down, and they're off home with the cake.
        k.fx.patter(8);
        await k.to(peter, 1.4, { x: '-=80', y: '+=350', ease: 'sine.inOut' });
        await k.wait(400);
      },
    },

    // ==================================================== 4. Flying home
    {
      name: 'Flying home',
      set(k) {
        k.backdrop('wishing-sky');
        k.music('adventure');
        ride = chairRide.set(k, { x: 360, y: 200, w: 440, wings: true, riders: RIDERS });
        [cast.mollie, cast.peter, cast.jigs] = ride.riders;
        cast.cake = k.prop('birthday-cake', { x: 576, y: 380, w: 140, z: 17 });
        k.set(cast.cake, at(cast.cake, 646, 450));
        cast.towel = k.add(teaTowel(), { x: 0, y: 0, w: 150, z: 18 });
        k.set(cast.towel, { ...at(cast.towel, 420, 330), opacity: 0 });
        chairRide.jump(k, ride, { x: -900 });
        k.set(cast.cake, { x: '-=900' });
      },
      async play(k) {
        const { mollie, peter, jigs, cake, towel } = cast;
        highWind(4);
        await flyWith(k, ride, [cake], { x: 0, s: 2.8 });
        await k.say('gently', peter);

        // The chair wriggles and bobs, trying to peek at the cake.
        const all = [ride.chair, ...ride.riders, ride.front, cake];
        await wishing.wriggle(k, ride.chair, 3);
        await k.all(...all.map((el) => k.to(el, 0.35, { y: '-=24', yoyo: true, repeat: 1, ease: 'sine.inOut' })));
        await k.say('peeking', jigs);

        // Mollie covers it with her tea towel.
        await k.say('noPeeking', mollie);
        k.sfx.rustle();
        k.set(towel, { opacity: 1 });
        const cb = k.box(cake);
        await k.carry(towel, [cb.x + cb.w / 2, cb.y + cb.h / 2 - 6], 0.8);
        await k.wait(500);
        huff();
        await k.wait(700);

        // Home over the fields.
        highWind(3);
        await k.all(k.say('nearlyHome', peter), flyWith(k, ride, [cake, towel], { x: 220, s: 2.6 }));
        await flyWith(k, ride, [cake, towel], { x: 1000, y: -100, s: 2.4 });
      },
    },

    // ==================================================== 5. Happy birthday, Chair!
    {
      name: 'Happy birthday, Chair!',
      set(k) {
        k.backdrop('playroom');
        k.music('sneaky');
        cast.table = k.add(table(), { x: 40, y: 490, w: 260, z: 9 });
        cast.cake = k.prop('birthday-cake', { x: 50, y: 360, w: 180, z: 10 });
        cast.towel = k.add(teaTowel(), { x: 0, y: 0, w: 180, z: 11 });
        k.set(cast.towel, at(cast.towel, 140, 458));
        cast.jigs = k.character('jigs', { x: 215, y: 381, w: 110, z: 12 });
        cast.mollie = k.character('mollie', { x: 330, y: 402, w: 210, z: 11 });
        cast.peter = k.character('peter', { x: 530, y: 402, w: 210, z: 11 });
        cast.chain = k.prop('paper-chain', { x: 330, y: 230, w: 540, z: 13 });
        k.set(cast.chain, { ...at(cast.chain, 635, 612), scale: 0.4 });
        ride = chairRide.set(k, { x: 770, y: 300, w: 370 });
      },
      async play(k) {
        const { mollie, peter, jigs, cake, towel, chain } = cast;
        await k.wait(500);

        // Jigs sends the chair out into the garden, just for a minute.
        await k.say('waitOutside', jigs);
        await huffy(k, ride, 1);
        k.fx.patter(5);
        await chairTo(k, ride, 1.4, { x: 520, ease: 'sine.in' });

        // Peter hangs his paper-chain.
        await k.say('upItGoes', peter);
        k.sfx.rustle();
        await k.to(chain, 1.1, { x: 0, y: 0, scale: 1, ease: 'sine.inOut' });
        k.set(chain, { zIndex: 8 });
        k.flourish(chain);
        await k.wait(300);

        // Mollie whisks off the tea towel.
        await k.say('offTowel', mollie);
        k.fx.whizz();
        await k.to(towel, 0.6, { y: '-=160', opacity: 0, rotation: -20, ease: 'power1.out' });
        k.flourish(cake);
        await k.wait(300);

        // Jigs lights the candles, one pixie spark for each.
        await k.say('lightCandles', jigs);
        for (let i = 0; i < 5; i++) {
          spark(i);
          await k.wait(260);
        }
        await k.fade(k.part(cake, 'flames'), 1, 0.5);
        const cb = k.box(cake);
        cast.glow = k.light(cb.x + cb.w / 2, cb.y + 30, 150, { strength: 0.35 });
        k.flourish(cake);
        await k.wait(500);

        // In comes the chair, still sulky... until it sees.
        k.silence();
        await k.say('comeIn', mollie);
        huff();
        await chairTo(k, ride, 1.6, { x: 0, ease: 'sine.out' });
        await k.wait(400);
        k.fx.twinkle();
        await chairTo(k, ride, 0.12, { rotation: 3, yoyo: true, repeat: 3 });
        k.music('triumph');
        await k.say('surprise', peter);
        await k.say('dearChair', mollie);

        // It creaks for joy, grows its wings and blows the candles out.
        creak();
        await chairTo(k, ride, 0.3, { y: -40, yoyo: true, repeat: 1, ease: 'sine.out' });
        creak();
        await chairRide.wings(k, ride);
        blowOut();
        await k.all(chairRide.flap(k, ride, 4), k.wait(500).then(() => k.all(k.fade(k.part(cake, 'flames'), 0, 0.8), k.fade(cast.glow, 0, 0.8))));
        k.puff(cb.x + cb.w / 2, cb.y + 10, 90, '#f4efe6');
        k.sparkle(cb.x + cb.w / 2, cb.y + 20, 12, 120);
        await k.wait(500);
        await k.say('blewThem', jigs);
        await k.say('neverForget', mollie);
        creak();
        await wishing.wriggle(k, ride.chair, 2);
        await k.say('cakeEveryone', peter);
        await k.say('notOurs', mollie);
        laugh();
        await k.say('anywayEnd', jigs);
        await warmEnding(k, { cast: [jigs, mollie, peter], end: 'end', music: 'cosy', sparkleAt: [600, 300], confetti: true });
      },
    },
  ],
});
