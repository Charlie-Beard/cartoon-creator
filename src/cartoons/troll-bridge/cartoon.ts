/**
 * The Troll's Bridge: the Wishing-Chair takes Mollie, Peter and Jigs to a
 * river where a grumbly troll called Grizzle won't let anyone cross his
 * rickety bridge. His bridge is falling to bits and his tummy is empty, so
 * the friends mend it, share their pie, and ask him to a picnic.
 *
 *   1. A picnic pie. In the playroom Peter hammers the last nail into his
 *      bird box (bang, bang, bang). Mum has made a blackberry pie, so it's a
 *      picnic, but where? Jigs, on the chair's arm, feels it wriggle: it
 *      knows somewhere. Mollie packs the pie in the basket, Peter pockets
 *      his hammer ("You never know!"), the wings grow and they fly out of the
 *      doors.
 *   2. Nobody crosses! A green river valley and a funny old wooden bridge.
 *      They land by a sad little hedgehog: Prickles the postman, with letters
 *      for the village over the river, who daren't cross because of the
 *      troll under the bridge. Peter isn't scared and walks onto it. Creak.
 *      THUMP, THUMP from underneath: Prickles curls into a ball and bounces
 *      away. Silence, then Grizzle rises up from under the bridge, arms up,
 *      roaring: "Nobody crosses my bridge!" Peter hops back. Cut back to the
 *      heroes: Mollie says sorry, Grizzle grumps "Go away!" and sinks down to
 *      sulk, and Mollie sees it: he isn't cross, he's sad.
 *   3. A hole in the bridge. Mollie asks what's the matter. His bridge is
 *      falling to bits: a great hole where two planks broke, and his fingers
 *      are too big for the little nails. Peter has little fingers, and his
 *      hammer. He knocks out the broken plank (splash); Jigs lifts a new one
 *      from Grizzle's pile and it's passed along, Jigs to Mollie to Peter,
 *      into the hole; Peter hammers it in (bang, bang, bang). He tests it with
 *      a big jump: it holds! Then a rumble like thunder: it's Grizzle's
 *      tummy. He hasn't eaten all day.
 *   4. Pie for a troll. Mollie gives him a slice of the pie (munch, munch):
 *      the best pie ever. She asks him to their picnic, on his bridge.
 *      Nobody ever asks him to anything! Well, they're asking now. He ducks
 *      under the bridge to fetch his picnic food, and Mollie calls Prickles:
 *      he bounces back as a ball, right over everyone, lands on the new
 *      plank (it holds), rolls across and uncurls on the far side, and trots
 *      off with his letters. Grizzle comes back with pondweed pudding with
 *      frogspawn on top... only joking: it's gooseberry jelly.
 *   5. A picnic on the bridge. Everyone round the cloth on the mended
 *      bridge, Grizzle laughing his first big laugh. The chair waddles up,
 *      its wings getting tired: time to go. Grizzle gives them a shiny stone
 *      from his river. A wave from the sky, then home to the playroom, where
 *      Mollie puts the stone on the windowsill, sparkling in the sun.
 *
 * Scary, never cruel (docs/STYLE.md): sound first (troll footsteps under the
 * bridge, the bridge shaking, silence), then Grizzle looms up roaring with
 * his arms raised, a short push-in, and straight back to the heroes. He
 * never touches anyone; he's cross because his bridge is broken and he's
 * hungry, and by the end he's laughing.
 *
 * Grizzle, Prickles, the troll-bridge backdrop and its plank props are new
 * in the wishing world. The bird box, hammer, pie, basket, cloth, jelly and
 * stone are drawn here (art.ts); the hammer, footsteps, tummy, munching and
 * boinks are in sounds.ts.
 */
import { defineCartoon, type Kit } from '../../kit';
import { sounds as anywhere } from '../../worlds/common/moves';
import { warmEnding } from '../../worlds/common/pieces';
import { moves as wishing, sounds } from '../../worlds/wishing/moves';
import { chairRide, type Ride } from '../../worlds/wishing/pieces';
import { BRIDGE_GAP } from '../../worlds/wishing/trollbridge';
import { basket, birdBox, cloth, hammer, jelly, pie, pieSlice, stone } from './art';
import meta from './meta';
import { bang, boink, munch, trollSteps, tummy, wobble } from './sounds';

const { highWind, roar } = sounds;
const { laugh } = anywhere;

// ------------------------------------------------------------------ cast

type Name =
  | 'mollie' | 'peter' | 'jigs' | 'grizzle' | 'prickles'
  | 'birdbox' | 'hammer' | 'pie' | 'slice' | 'basket' | 'pile' | 'plank' | 'broken' | 'jelly' | 'cloth' | 'stone';
const cast = {} as Record<Name, HTMLElement>;
let ride: Ride;

/** The middle of the hole in the bridge (stage point). */
const GAP_MID: [number, number] = [BRIDGE_GAP.x + BRIDGE_GAP.w / 2, BRIDGE_GAP.y + BRIDGE_GAP.h / 2];

// ------------------------------------------------------------- helpers

/** The `x` and `y` offsets that put an actor's middle on a stage point (from where it was placed). */
function at(el: HTMLElement, cx: number, cy: number): { x: number; y: number } {
  const l = parseFloat(el.style.left) || 0;
  const t = parseFloat(el.style.top) || 0;
  const w = parseFloat(el.style.width) || 0;
  const h = parseFloat(el.style.height) || 0;
  return { x: cx - (l + w / 2), y: cy - (t + h / 2) };
}

/** Flies the whole ride, and anything riding along with it, by the same amount. */
async function flyWith(k: Kit, r: Ride, extras: HTMLElement[], o: { x?: number; y?: number; s?: number; flaps?: number; tilt?: number }): Promise<void> {
  const s = o.s ?? 1.6;
  const here = k.box(r.chair);
  const dx = o.x === undefined ? 0 : o.x - (here.x - r.at.x);
  const dy = o.y === undefined ? 0 : o.y - (here.y - r.at.y);
  await k.all(chairRide.fly(k, r, o), ...extras.map((el) => k.to(el, s, { x: `+=${dx}`, y: `+=${dy}`, ease: 'sine.inOut' })));
}

/** Lands the ride, with anything riding along coming down with it. */
async function landWith(k: Kit, r: Ride, extras: HTMLElement[]): Promise<void> {
  await k.all(
    chairRide.land(k, r),
    ...extras.map((el) => k.to(el, 1.4, { y: -20, ease: 'sine.inOut' }).then(() => k.to(el, 0.18, { y: 0, ease: 'power2.in' }))),
  );
}

/** Peter's hammer, three blows on whatever is under its head, a bang on each. */
async function hammering(k: Kit, el: HTMLElement, blows = 3): Promise<void> {
  for (let i = 0; i < blows; i++) {
    await k.to(el, 0.24, { rotation: -32, ease: 'sine.out' });
    await k.to(el, 0.12, { rotation: 0, ease: 'power2.in' });
    bang();
    await k.wait(120);
  }
}

/** The friends sat in the chair: Mollie and Peter on the seat, Jigs on the left arm. */
const RIDERS: { id: string; slot: 'left' | 'right' | 'armL' }[] = [
  { id: 'mollie', slot: 'left' },
  { id: 'peter', slot: 'right' },
  { id: 'jigs', slot: 'armL' },
];

/** The new plank, laid in the hole in the bridge. */
function mendedPlank(k: Kit): HTMLElement {
  return k.prop('bridge-plank', { x: BRIDGE_GAP.x, y: BRIDGE_GAP.y, w: BRIDGE_GAP.w, z: 5 });
}

// ------------------------------------------------------------------ show

export default defineCartoon({
  ...meta,
  lines: {
    // 1. A picnic pie
    oneMoreNail: { who: 'peter', text: 'Just one more nail, and my bird box is finished!' },
    lookPie: { who: 'mollie', text: 'Well done! And look, Mum made us a blackberry pie.' },
    wherePicnic: { who: 'jigs', text: 'A pie means a picnic! But where shall we go?' },
    chairKnows: { who: 'jigs', text: 'Ooh! The chair’s wriggling. It knows a good place!' },
    packPie: { who: 'mollie', text: 'Then I’ll pack the pie in the basket.' },
    bringHammer: { who: 'peter', text: 'And I’ll bring my hammer. You never know!' },
    everybodyIn: { who: 'jigs', text: 'Here come its wings! Everybody in!' },
    // 2. Nobody crosses!
    river: { who: 'peter', text: 'Look! A river, and a funny old bridge!' },
    sadHedgehog: { who: 'mollie', text: 'And there’s a little hedgehog. He looks ever so sad.' },
    pricklesHello: { who: 'prickles', text: 'Good morning. I’m Prickles, the postman.' },
    pricklesStuck: { who: 'prickles', text: 'I’ve got letters for the village. But I can’t get across!' },
    pricklesTroll: { who: 'prickles', text: 'Shh! A troll lives under it. And he won’t let anybody cross.' },
    notScared: { who: 'peter', text: 'A troll? Pooh! I’m not scared. Watch me.' },
    ohMyPrickles: { who: 'prickles', text: 'Oh my prickles! Here he comes!' },
    whoIsThat: { who: 'grizzle', text: 'Who’s that tramping on MY bridge?' },
    nobodyCrosses: { who: 'grizzle', text: 'Nobody crosses my bridge! NOBODY!' },
    sorry: { who: 'mollie', text: 'Sorry, Mr Troll! We didn’t mean to make you cross.' },
    goAway: { who: 'grizzle', text: 'Hmph! Go away. Leave me alone.' },
    notCross: { who: 'mollie', text: 'I don’t think he’s cross, you know. I think he’s sad.' },
    // 3. A hole in the bridge
    whatsTheMatter: { who: 'mollie', text: 'Please, Mr Troll. What’s the matter?' },
    grizzleName: { who: 'grizzle', text: 'I’m Grizzle. And my bridge is falling to bits, that’s what!' },
    lookHole: { who: 'grizzle', text: 'Look at that big hole! If people walk on it, my bridge will fall down.' },
    bigFingers: { who: 'grizzle', text: 'I’ve got planks. But my fingers are too big for the little nails.' },
    weCanMend: { who: 'peter', text: 'My fingers are little. And I brought my hammer!' },
    outWithOld: { who: 'peter', text: 'First, out with the old one!' },
    passPlank: { who: 'jigs', text: 'I’ll get a new plank. Pass it along!' },
    hammerTime: { who: 'peter', text: 'Hold still, little plank. Bang, bang, bang!' },
    testIt: { who: 'peter', text: 'Now let’s test it. One, two, three, jump!' },
    itHolds: { who: 'grizzle', text: 'It holds! It really holds!' },
    tummyLine: { who: 'grizzle', text: 'Ooh. That’s my tummy rumbling. I haven’t eaten all day.' },
    // 4. Pie for a troll
    haveSomePie: { who: 'mollie', text: 'Then you must have some of our pie!' },
    bestPie: { who: 'grizzle', text: 'Mmm! Blackberry! That’s the best pie I ever had.' },
    comePicnic: { who: 'mollie', text: 'Grizzle, will you come to our picnic? On your bridge?' },
    nobodyAsks: { who: 'grizzle', text: 'Me? But nobody ever asks me to anything.' },
    weAsk: { who: 'jigs', text: 'Well, we’re asking you now!' },
    fetchFood: { who: 'grizzle', text: 'Then I’ll fetch my picnic food. Don’t go away!' },
    comeOut: { who: 'mollie', text: 'Prickles! It’s all right now. You can cross!' },
    pricklesThanks: { who: 'prickles', text: 'It’s mended! Thank you! Now the post can go through.' },
    pondweed: { who: 'grizzle', text: 'I’m back! I made pondweed pudding, with frogspawn on top!' },
    erLovely: { who: 'peter', text: 'Er… lovely! Just a tiny bit, please.' },
    onlyJoking: { who: 'grizzle', text: 'Har, har! Only joking! It’s gooseberry jelly.' },
    // 5. A picnic on the bridge
    bestPicnic: { who: 'mollie', text: 'This is the best picnic ever!' },
    firstFriends: { who: 'grizzle', text: 'My first picnic. And my first friends! Har, har, har!' },
    chairBack: { who: 'jigs', text: 'Look, here comes the chair. Its wings are getting tired.' },
    shinyStone: { who: 'grizzle', text: 'Wait! Take this shiny stone from my river, to remember me.' },
    byeGrizzle: { who: 'peter', text: 'Goodbye, Grizzle! We’ll come back for another picnic!' },
    onTheSill: { who: 'mollie', text: 'Grizzle’s stone can go on the windowsill.' },
    sparkles: { who: 'jigs', text: 'Look how it sparkles! Just like his river.' },
    end: { who: 'narrator', text: 'And from that day on, everyone could cross Grizzle’s bridge. And he always had friends for picnics.' },
  },
  scenes: [
    // ==================================================== 1. A picnic pie
    {
      name: 'A picnic pie',
      set(k) {
        k.backdrop('playroom');
        k.music('cosy');
        cast.peter = k.character('peter', { x: 90, y: 380, w: 230 });
        cast.birdbox = k.add(birdBox(), { x: 330, y: 522, w: 100, z: 12 });
        cast.hammer = k.add(hammer(), { x: 304, y: 486, w: 90, z: 13, flip: true });
        k.set(cast.hammer, { transformOrigin: '8% 86%' });
        cast.mollie = k.character('mollie', { x: 450, y: 380, w: 230 });
        cast.pie = k.add(pie(), { x: 500, y: 540, w: 130, z: 14 });
        cast.basket = k.add(basket(), { x: 676, y: 540, w: 130, z: 11 });
        ride = chairRide.set(k, { x: 780, y: 280, w: 400, riders: [{ id: 'jigs', slot: 'armL' }] });
        [cast.jigs] = ride.riders;
      },
      async play(k) {
        const { peter, mollie, jigs, birdbox, hammer: hm, pie: p, basket: bk } = cast;
        await k.wait(600);

        // Peter hammers the last nail into his bird box.
        await k.say('oneMoreNail', peter);
        await hammering(k, hm, 3);
        k.flourish(birdbox);
        await k.wait(500);
        await k.say('lookPie', mollie);
        await k.all(k.say('wherePicnic', jigs), k.hop(jigs, 16, 1));

        // The chair wriggles: it knows somewhere.
        await k.all(wishing.wriggle(k, ride.chair, 3), k.shake(jigs, 4, 3));
        await k.say('chairKnows', jigs);

        // Mollie packs the pie; Peter pockets his hammer.
        await k.say('packPie', mollie);
        await k.carry(p, [k.box(bk).x + 65, k.box(bk).y + 40], 1.1);
        await k.vanish(p, 0.4);
        await k.say('bringHammer', peter);
        k.fx.pop();
        await k.vanish(hm, 0.4);
        await k.wait(300);

        // The wings grow, and Mollie and Peter climb in, the basket on their laps.
        k.music('adventure');
        await chairRide.wings(k, ride);
        await k.all(k.say('everybodyIn', jigs), chairRide.flap(k, ride, 2));
        await k.all(k.hop(mollie, 40, 1), k.hop(peter, 40, 1));
        k.remove(mollie);
        k.remove(peter);
        await k.all(chairRide.seat(k, ride, RIDERS[0]), chairRide.seat(k, ride, RIDERS[1]));
        k.set(bk, { zIndex: 20 });
        await k.to(bk, 0.6, { ...at(bk, 980, 540), ease: 'sine.inOut' });

        // Off they fly, out of the doors.
        highWind(3);
        await flyWith(k, ride, [bk], { x: 760, y: -220, s: 2.4 });
      },
    },

    // ==================================================== 2. Nobody crosses!
    {
      name: 'Nobody crosses!',
      set(k) {
        k.backdrop('troll-bridge');
        k.music('adventure');
        cast.broken = k.prop('bridge-plank-broken', { x: BRIDGE_GAP.x, y: BRIDGE_GAP.y, z: 5 });
        cast.prickles = k.character('prickles', { x: 300, y: 426, w: 140, z: 11 });
        cast.grizzle = k.character('grizzle', { x: 770, y: 250, w: 340, z: 8, pose: 'roar' });
        k.set(cast.grizzle, { y: 600, opacity: 0 });
        ride = chairRide.set(k, { x: 0, y: 345, w: 320, wings: true, riders: RIDERS });
        [cast.mollie, cast.peter, cast.jigs] = ride.riders;
        cast.basket = k.add(basket(), { x: 110, y: 478, w: 100, z: 20 });
        chairRide.jump(k, ride, { x: 700, y: -800 });
        k.set(cast.basket, { x: 700, y: -800 });
      },
      async play(k) {
        const { mollie, peter, jigs, prickles, grizzle, basket: bk } = cast;

        // The chair flies down into the valley.
        highWind(3);
        await flyWith(k, ride, [bk], { x: 240, y: -200, s: 2 });
        await k.all(k.say('river', peter), flyWith(k, ride, [bk], { x: 60, s: 1.6 }));
        await flyWith(k, ride, [bk], { x: 0, y: -20, s: 1 });
        await landWith(k, ride, [bk]);

        // Mollie and Peter hop out; Jigs stays perched on the chair's arm.
        await chairRide.hopOff(k, ride, peter, { x: 432, y: 352, w: 200 });
        await chairRide.hopOff(k, ride, mollie, { x: 96, y: 405, w: 200 });
        k.set(bk, { zIndex: 17 });
        await k.to(bk, 0.5, { ...at(bk, 230, 600), ease: 'sine.inOut' });
        k.fx.thud();
        await k.say('sadHedgehog', mollie);
        await k.say('pricklesHello', prickles);
        await k.say('pricklesStuck', prickles);
        await k.say('pricklesTroll', prickles);

        // Peter isn't scared: he walks out onto the bridge. Creak...
        await k.say('notScared', peter);
        k.fx.creak();
        await k.walk(peter, 120, 1.2, 3);
        k.fx.creak();
        await k.wait(400);

        // THUMP, THUMP from under the bridge.
        k.silence();
        trollSteps(3);
        await k.wait(300);
        await k.all(k.quake(5), k.shake(peter, 6, 3));
        await k.wait(300);

        // Prickles curls up into a ball and bounces away, over everyone's heads.
        k.pose(prickles, 'ball');
        await k.say('ohMyPrickles', prickles);
        boink();
        await k.to(prickles, 0.4, { y: -250, rotation: -180, ease: 'power2.out' });
        boink();
        await k.to(prickles, 0.7, { x: -700, y: -200, rotation: -540, ease: 'sine.in' });
        k.remove(prickles);
        await k.wait(400);

        // Grizzle looms up from under his bridge, roaring.
        k.music('spooky');
        trollSteps(2, 0.7);
        await k.wait(900);
        roar();
        k.set(grizzle, { opacity: 1 });
        await k.all(k.to(grizzle, 1.4, { y: 0, ease: 'power2.out' }), k.quake(6));
        await k.camera({ zoom: 1.3, x: 860, y: 420 }, 1);
        await k.say('whoIsThat', grizzle);
        await k.say('nobodyCrosses', grizzle);
        roar();
        await k.quake(8);
        await k.wait(400);

        // Back to the heroes: Peter hops back, and Mollie is brave.
        await k.camera({}, 0.8);
        k.fx.boing();
        await k.to(peter, 0.6, { x: '-=120', ease: 'power2.out' });
        await k.all(k.shake(mollie, 3, 2), k.shake(jigs, 3, 2));
        k.music('sneaky');
        await k.say('sorry', mollie);
        k.pose(grizzle, 'sulk');
        await k.say('goAway', grizzle);
        k.fx.splash();
        await k.to(grizzle, 1.4, { y: 195, ease: 'sine.inOut' });
        await k.wait(600);
        k.music('dreamy');
        await k.say('notCross', mollie);
        await k.wait(500);
      },
    },

    // ==================================================== 3. A hole in the bridge
    {
      name: 'A hole in the bridge',
      set(k) {
        k.backdrop('troll-bridge');
        k.music('dreamy');
        cast.broken = k.prop('bridge-plank-broken', { x: BRIDGE_GAP.x, y: BRIDGE_GAP.y, z: 5 });
        k.set(cast.broken, { transformOrigin: '8% 6%' });
        cast.pile = k.prop('bridge-planks', { x: 0, y: 550, w: 170, z: 13 });
        cast.plank = k.prop('bridge-plank', { x: 52, y: 530, w: BRIDGE_GAP.w, z: 14 });
        cast.jigs = k.character('jigs', { x: 14, y: 468, w: 140, z: 11 });
        cast.mollie = k.character('mollie', { x: 150, y: 405, w: 200, z: 11 });
        cast.peter = k.character('peter', { x: 352, y: 352, w: 200, z: 11 });
        cast.grizzle = k.character('grizzle', { x: 720, y: 445, w: 340, z: 8, pose: 'sulk' });
        cast.hammer = k.add(hammer(), { x: 538, y: 535, w: 80, z: 15, flip: true });
        k.set(cast.hammer, { transformOrigin: '8% 86%', opacity: 0 });
      },
      async play(k) {
        const { mollie, peter, jigs, grizzle, broken, plank, hammer: hm } = cast;
        await k.wait(500);
        await k.say('whatsTheMatter', mollie);
        k.pose(grizzle, 'default');
        await k.say('grizzleName', grizzle);

        // The hole: the broken plank swings and creaks.
        k.fx.creak();
        void k.to(broken, 0.5, { rotation: 12, yoyo: true, repeat: 3, ease: 'sine.inOut' });
        k.sparkle(GAP_MID[0], GAP_MID[1], 8, 70);
        await k.say('lookHole', grizzle);
        const [arm] = k.pivot(k.part(grizzle, 'armR'));
        void k.to(arm, 0.6, { rotation: -60, ease: 'sine.inOut' });
        await k.say('bigFingers', grizzle);
        await k.to(arm, 0.5, { rotation: 0, ease: 'sine.inOut' });
        await k.all(k.say('weCanMend', peter), k.wait(300).then(() => k.fade(hm, 1, 0.4)));
        await k.hop(peter, 24, 1);

        // Peter knocks out the broken plank: splash!
        await k.say('outWithOld', peter);
        await hammering(k, hm, 1);
        await k.to(broken, 0.6, { y: 150, rotation: 40, opacity: 0, ease: 'power2.in' });
        k.fx.splash();
        await k.wait(300);

        // A new plank, passed along: Jigs to Mollie to Peter, into the hole.
        await k.say('passPlank', jigs);
        anywhere.click();
        await k.all(k.to(plank, 0.4, { y: -40, ease: 'sine.out' }), k.hop(jigs, 20, 1));
        k.set(plank, { zIndex: 20 });
        await k.all(k.to(plank, 0.7, { ...at(plank, 250, 470), ease: 'sine.inOut' }), k.wait(450).then(() => k.hop(mollie, 16, 1)));
        await k.all(k.to(plank, 0.7, { ...at(plank, 470, 450), ease: 'sine.inOut' }), k.wait(450).then(() => k.hop(peter, 16, 1)));
        await k.carry(plank, GAP_MID, 0.9);
        k.set(plank, { zIndex: 5 });

        // Peter hammers it in.
        await k.all(k.say('hammerTime', peter), k.wait(1500).then(() => hammering(k, hm, 3)));
        k.flourish(plank);
        await k.vanish(hm, 0.4);

        // He tests it with a big jump: it holds!
        await k.say('testIt', peter);
        await k.to(peter, 0.4, { x: 140, y: -90, ease: 'power1.out' });
        await k.to(peter, 0.3, { y: 8, ease: 'power2.in' });
        k.fx.thud();
        await k.all(k.quake(4), k.to(peter, 0.15, { y: -12, yoyo: true, repeat: 1 }));
        k.sparkle(GAP_MID[0], GAP_MID[1], 10, 90);
        k.fx.twinkle();
        await k.wait(400);
        k.pose(grizzle, 'beam');
        await k.all(k.say('itHolds', grizzle), k.wait(200));
        await k.hop(grizzle, 24, 1);
        k.fx.boing();
        await k.to(peter, 0.6, { x: 0, y: 0, ease: 'power2.inOut' });

        // A rumble like thunder... it's Grizzle's tummy.
        tummy(1.6);
        await k.all(k.shake(jigs, 3, 2), k.wait(1100));
        k.pose(grizzle, 'sulk');
        await k.say('tummyLine', grizzle);
        await k.wait(400);
      },
    },

    // ==================================================== 4. Pie for a troll
    {
      name: 'Pie for a troll',
      set(k) {
        k.backdrop('troll-bridge');
        k.music('cosy');
        cast.plank = mendedPlank(k);
        cast.pile = k.prop('bridge-planks', { x: 0, y: 550, w: 170, z: 13 });
        cast.jigs = k.character('jigs', { x: 4, y: 470, w: 135, z: 11 });
        cast.mollie = k.character('mollie', { x: 122, y: 405, w: 200, z: 11 });
        cast.peter = k.character('peter', { x: 350, y: 352, w: 200, z: 11 });
        cast.basket = k.add(basket(), { x: 222, y: 560, w: 110, z: 14 });
        cast.pie = k.add(pie(), { x: 210, y: 520, w: 130, z: 15 });
        cast.slice = k.add(pieSlice(), { x: 278, y: 552, w: 54, z: 16 });
        k.set([cast.pie, cast.slice], { opacity: 0 });
        cast.grizzle = k.character('grizzle', { x: 690, y: 420, w: 340, z: 8, pose: 'sulk' });
        cast.jelly = k.add(jelly(), { x: 790, y: 566, w: 130, z: 9 });
        k.set(cast.jelly, { y: 520 });
        cast.prickles = k.character('prickles', { x: -260, y: 200, w: 130, z: 22, pose: 'ball' });
      },
      async play(k) {
        const { mollie, peter, jigs, grizzle, pie: p, slice, prickles, jelly: jl, plank } = cast;
        await k.wait(500);

        // Mollie gives Grizzle a slice of the pie.
        await k.say('haveSomePie', mollie);
        k.fx.pop();
        await k.appear(p, 0.5);
        k.set(slice, { opacity: 1 });
        k.set(k.part(p, 'slice'), { opacity: 0 });
        k.set(k.part(p, 'gap'), { opacity: 1 });
        await k.carry(slice, [860, 635], 1.3);
        k.pose(grizzle, 'default');
        munch(3);
        await k.to(slice, 0.9, { scale: 0.2, opacity: 0, ease: 'sine.in' });
        k.pose(grizzle, 'beam');
        await k.say('bestPie', grizzle);

        // An invitation.
        await k.say('comePicnic', mollie);
        k.pose(grizzle, 'sulk');
        await k.say('nobodyAsks', grizzle);
        await k.all(k.say('weAsk', jigs), k.hop(jigs, 20, 1));
        k.pose(grizzle, 'beam');
        await k.hop(grizzle, 30, 1);
        await k.say('fetchFood', grizzle);
        k.fx.splash();
        await k.all(k.exit(grizzle, 'bottom', 0.9), k.fade(grizzle, 0, 0.5));
        k.set(grizzle, { opacity: 0 });

        // Prickles comes bouncing back, right over everyone, and across the mended bridge.
        await k.say('comeOut', mollie);
        k.sfx.rustle();
        await k.wait(300);
        boink();
        await k.to(prickles, 0.8, { x: 470, y: -70, rotation: 360, ease: 'sine.out' });
        await k.to(prickles, 0.6, { x: 790, y: 212, rotation: 720, ease: 'power2.in' });
        k.fx.thud();
        k.sparkle(GAP_MID[0], GAP_MID[1], 10, 80);
        k.fx.twinkle();
        await k.pop(plank, 1.1);
        await k.to(prickles, 0.9, { x: 1050, y: 238, rotation: 1080, ease: 'sine.inOut' });
        boink();
        await k.to(prickles, 0.5, { x: 1210, y: 160, rotation: 1260, ease: 'sine.out' });
        await k.to(prickles, 0.4, { y: 290, rotation: 1440, ease: 'power2.in' });
        k.fx.thud();
        k.set(prickles, { rotation: 0 });
        k.pose(prickles, 'happy');
        await k.say('pricklesThanks', prickles);
        trollSteps(2, 0.5);
        await k.walk(prickles, 360, 1.2, 3);
        k.remove(prickles);

        // Grizzle comes back up, with his picnic food.
        k.pose(grizzle, 'beam');
        void k.wait(500).then(() => k.fade(grizzle, 1, 0.5));
        await k.all(k.to(grizzle, 1.1, { y: 0, ease: 'power2.out' }), k.to(jl, 1.1, { y: 0, ease: 'power2.out' }));
        wobble();
        await k.to(k.part(jl, 'wobble'), 0.18, { scaleX: 1.08, scaleY: 0.94, yoyo: true, repeat: 3, ease: 'sine.inOut' });
        await k.say('pondweed', grizzle);
        await k.all(k.say('erLovely', peter), k.shake(peter, 3, 2));
        laugh();
        await k.all(k.say('onlyJoking', grizzle), k.wait(200));
        await k.all(k.hop(mollie, 20, 1), k.hop(peter, 20, 1));
        await k.wait(500);
      },
    },

    // ==================================================== 5. A picnic on the bridge
    {
      name: 'A picnic on the bridge',
      set(k) {
        k.backdrop('troll-bridge');
        k.music('cosy');
        mendedPlank(k);
        cast.grizzle = k.character('grizzle', { x: 430, y: 292, w: 330, z: 8, pose: 'beam' });
        cast.cloth = k.add(cloth(), { x: 460, y: 548, w: 270, z: 9 });
        cast.pie = k.add(pie(), { x: 476, y: 500, w: 110, z: 10 });
        k.set(k.part(cast.pie, 'slice'), { opacity: 0 });
        k.set(k.part(cast.pie, 'gap'), { opacity: 1 });
        cast.jelly = k.add(jelly(), { x: 618, y: 470, w: 100, z: 10 });
        cast.mollie = k.character('mollie', { x: 238, y: 368, w: 190, z: 11 });
        cast.peter = k.character('peter', { x: 770, y: 375, w: 190, z: 11 });
        cast.jigs = k.character('jigs', { x: 40, y: 486, w: 130, z: 11 });
        cast.stone = k.add(stone(), { x: 560, y: 470, w: 60, z: 12 });
        k.set(cast.stone, { opacity: 0 });
        ride = chairRide.set(k, { x: -40, y: 385, w: 280, z: 9 });
        chairRide.jump(k, ride, { x: -400 });
        k.set([...k.part(ride.chair, 'wingL'), ...k.part(ride.chair, 'wingR')], { opacity: 1, rotation: 0 });
      },
      async play(k) {
        const { mollie, jigs, grizzle, stone: st, jelly: jl } = cast;
        await k.wait(500);
        await k.all(k.say('bestPicnic', mollie), k.hop(mollie, 16, 1));
        laugh();
        await k.all(k.say('firstFriends', grizzle), k.wait(100));
        await k.hop(grizzle, 30, 2);
        wobble();
        await k.to(k.part(jl, 'wobble'), 0.18, { scaleX: 1.08, scaleY: 0.94, yoyo: true, repeat: 3, ease: 'sine.inOut' });
        await k.wait(400);

        // The chair waddles up, its wings drooping.
        sounds.creak();
        await k.all(k.to(ride.chair, 1.6, { x: 0, ease: 'sine.out' }), k.to(ride.front, 1.6, { x: 0, ease: 'sine.out' }));
        await wishing.droop(k, ride.chair);
        await k.say('chairBack', jigs);

        // Grizzle's present: a shiny stone from his river.
        await k.say('shinyStone', grizzle);
        k.fx.twinkle();
        await k.appear(st, 0.4);
        await k.carry(st, mollie, 1.1);
        await k.all(k.hop(mollie, 16, 1), k.vanish(st, 0.3));

        // A wave from the sky as they fly away.
        await k.cut(() => {
          k.backdrop('wishing-sky');
          ride = chairRide.set(k, { x: 300, y: 250, w: 420, wings: true, riders: RIDERS });
          [cast.mollie, cast.peter, cast.jigs] = ride.riders;
          chairRide.jump(k, ride, { x: -900, y: 120 });
        });
        k.music('triumph');
        highWind(4);
        await chairRide.fly(k, ride, { x: 0, y: 0, s: 1.8 });
        await k.all(k.say('byeGrizzle', cast.peter), chairRide.fly(k, ride, { x: 260, s: 3 }));
        await chairRide.fly(k, ride, { x: 1000, y: -120, s: 1.4 });

        // Home: the stone goes on the windowsill, sparkling in the sun.
        await k.cut(() => {
          k.backdrop('playroom');
          ride = chairRide.set(k, { x: 780, y: 280, w: 400, wings: true, riders: RIDERS });
          [cast.mollie, cast.peter, cast.jigs] = ride.riders;
          chairRide.jump(k, ride, { x: 0, y: -800 });
          cast.birdbox = k.add(birdBox(), { x: 600, y: 522, w: 100, z: 12 });
          cast.stone = k.add(stone(), { x: 560, y: 470, w: 60, z: 20 });
          k.set(cast.stone, { opacity: 0 });
        });
        k.music('cosy');
        const home = cast;
        await chairRide.land(k, ride);
        await k.say('onTheSill', home.mollie);
        await chairRide.hopOff(k, ride, home.mollie, { x: 300, y: 380, w: 220 });
        k.set(home.stone, { opacity: 1 });
        await k.carry(home.stone, [196, 466], 1.2);
        k.light(196, 460, 120, { color: '#fff4c0', strength: 0.35, z: 36 });
        k.sparkle(196, 460, 10, 80);
        await k.all(k.say('sparkles', home.jigs), k.hop(home.jigs, 20, 1));
        await warmEnding(k, { cast: [home.mollie, home.peter, home.jigs], end: 'end', music: 'cosy', sparkleAt: [196, 440] });
      },
    },
  ],
});
