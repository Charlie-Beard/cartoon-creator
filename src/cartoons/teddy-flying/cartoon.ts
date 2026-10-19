/**
 * Teddy Goes Flying: Teddy longs to fly like the birds, jumps off Honeypot
 * Hill and lands SPLAT in the muddy stream, and Uncle Bill's helicopter
 * flies him home on a rope. From the book's "Teddy Goes Flying".
 *
 *   1. The window. Bear Cottage's kitchen. Teddy, up on his stool at the
 *      window, watches a blackbird fly off. "It must be lovely to fly!"
 *      Mummy: birds have feathery wings; bears can do lots of other things.
 *      But bears haven't got wings: it's not fair. A ladybird walks along
 *      the sill. "Ladybird, ladybird… let's blow, very gently." His turn:
 *      he taps the ladybird and she opens her wings and flies out of the
 *      window (or Teddy blows). Mummy never said beetles could fly! If a
 *      ladybird can fly, so can he. Off he goes outside.
 *   2. The garden. Butterflies flit past: more things that can fly. Barney's
 *      new kite won't go up; it needs a puff of wind. His turn: he taps the
 *      kite and it sails up into the sky (or Teddy's puff does it). Kites
 *      haven't got wings either! An aeroplane streaks over: its wings don't
 *      flap, so how does it fly? Teddy tries: jumping and flapping, hopping
 *      on one leg, then the other, until he's hot and out of breath (Barney
 *      giggles, kindly). Maybe if he was up a bit higher… Honeypot Hill!
 *   3. Honeypot Hill. Teddy climbs to the very top. It looks much higher from
 *      up here, but nothing's going to stop him now. He shuts his eyes, makes
 *      a little run, holds his breath (a drumroll) and jumps… and forgets to
 *      flap. SPLAT! Into the muddy stream: sticky, squelchy and gooey, but
 *      fine. A whirr in the sky: Uncle Bill in the navy helicopter. "What
 *      are you doing down there?" His turn: he taps the coil of rope and it
 *      unrolls down to Teddy (or Uncle Bill lets it down). Heave-ho, up he
 *      comes, higher and higher: "I'm flying!"
 *   4. Flying home. Up in the sky, swinging on the rope over the fields.
 *      "I only wanted to fly!" "Well, you got your wish!" Then down into
 *      Bear Cottage's garden: Mummy runs out. All muddy! A bath, then honey
 *      on hot toast. Flying home in a helicopter was exciting enough. Wave
 *      goodbye to Uncle Bill. That night a clean Teddy dreams of flying.
 *
 * The scary beat is gentle: the jump off the hilltop, built with a drumroll
 * and the music stopping, and the landing is funny, not hurt (mud, a SPLAT,
 * "I forgot to flap!"). Teddy jumps by himself; his turns only ever help.
 * The helicopter's arrival and rope are staged here rather than with the
 * world's helicopterVisit piece, because the coil, the long rope and Teddy
 * have to move with it exactly (the piece floats the helicopter alone);
 * its `leave` is used as it is.
 */
import { defineCartoon, NOTE, noiseBurst, now, tone, type Kit } from '../../kit';
import { sounds as common } from '../../worlds/common/moves';
import { warmEnding } from '../../worlds/common/pieces';
import { moves, sounds } from '../../worlds/bears/moves';
import { helicopterVisit } from '../../worlds/bears/pieces';
import { kiteString, longRope, mud, ropeCoil, stool } from './art';
import meta from './meta';

// ---------------------------------------------------------------- sounds

/** A bird taking off: a quick flutter of soft wingbeats. */
function flutter(): void {
  const t = now();
  for (let i = 0; i < 6; i++) noiseBurst(t + i * 0.06, { freq: 1800, q: 1.5, peak: 0.05, attack: 0.005, decay: 0.05 });
  tone(NOTE.G5, t + 0.05, { wave: 'sine', peak: 0.03, decay: 0.15, glideTo: NOTE.C6 });
}

/** A little aeroplane far away: a soft drone that comes and goes. */
function drone(seconds = 3): void {
  const t = now();
  tone(180, t, { wave: 'sawtooth', peak: 0.025, attack: seconds * 0.4, decay: seconds * 0.6, lowpass: 600, glideTo: 150 });
  noiseBurst(t, { freq: 500, type: 'lowpass', peak: 0.03, attack: seconds * 0.4, decay: seconds * 0.6 });
}

// ------------------------------------------------------------------ cast

type Actor = 'teddy' | 'mummy' | 'barney' | 'heli' | 'bird' | 'lady' | 'kite' | 'string' | 'coil' | 'rope' | 'splash' | 'honey' | 'fly1' | 'fly2' | 'plane';
const cast = {} as Record<Actor, HTMLElement>;

/** Lays mud over a bear (it rides along with every move, bob and pose change). */
function muddy(el: HTMLElement): HTMLElement {
  const m = document.createElement('div');
  m.className = 'teddy-flying-mud';
  m.style.cssText = 'position:absolute;inset:0;pointer-events:none';
  m.innerHTML = mud();
  el.append(m);
  return m;
}

/** Spins the helicopter's rotor for about `seconds` (it ends, so nothing moves during his turn). */
function rotor(k: Kit, heli: HTMLElement, seconds: number): void {
  void k.to(k.part(heli, 'rotor'), 0.12, { scaleX: 0.2, yoyo: true, repeat: Math.round(seconds / 0.12), transformOrigin: '50% 50%' });
}

/** Flaps a butterfly's wings `times` times, quickly. */
function flapWings(k: Kit, fly: HTMLElement, times: number): Promise<void> {
  const wings = k.pivot([...k.part(fly, 'wingL'), ...k.part(fly, 'wingR')]);
  return k.to(wings, 0.1, { scaleX: 0.35, yoyo: true, repeat: times * 2 - 1 });
}

// Barney's kite: the string runs from his raised paw (P) up to the kite's corner in the sky (E).
const PAW: [number, number] = [452, 478];
const SKY: [number, number] = [566, 150];
const KITE_W = 120;
/** Where the kite's bottom corner (the string's knot) is in the prop's own picture, scaled to KITE_W. */
const KNOT: [number, number] = [80 * (KITE_W / 160), 170 * (KITE_W / 160)];

export default defineCartoon({
  ...meta,
  lines: {
    // 1. The window
    whatLooking: { who: 'mummy-bear', text: 'What are you looking at, Teddy?' },
    birds: { who: 'teddy', text: 'The birds, Mummy! It must be lovely to fly!' },
    wings: { who: 'mummy-bear', text: 'Birds have feathery wings. Bears can do other things!' },
    noWings: { who: 'teddy', text: 'But bears haven’t got wings. It’s not fair!' },
    ladybird: { who: 'teddy', text: 'Oh, look, {name}! A ladybird, on the window sill!' },
    rhyme: { who: 'teddy', text: 'Ladybird, ladybird… I know! Let’s blow, very gently.' },
    askBlow: { who: 'teddy', text: 'Can you help? Tap the ladybird, very gently!' },
    nudgeBlow: { who: 'teddy', text: 'Just tap the ladybird.' },
    iBlow: { who: 'teddy', text: 'I’ll blow, then. Whoo…' },
    thanksBlow: { who: 'teddy', text: 'She spread her wings! Thank you, {name}!' },
    offSheGoes: { who: 'teddy', text: 'She spread her wings and flew away!' },
    beetles: { who: 'teddy', text: 'Mummy! You never said beetles could fly!' },
    soCanI: { who: 'teddy', text: 'If a ladybird can fly, so can I! I’m going outside!' },
    // 2. The garden
    butterflies: { who: 'teddy', text: 'Butterflies! More things that can fly!' },
    newKite: { who: 'barney', text: 'Teddy! Come and see my new kite!' },
    wontGo: { who: 'barney', text: 'But it won’t go up!' },
    askKite: { who: 'barney', text: 'It needs a puff of wind! {name}, can you tap the kite?' },
    nudgeKite: { who: 'barney', text: 'Tap the kite, and up it goes!' },
    gust: { who: 'teddy', text: 'Here comes a puff of wind! Whoosh!' },
    kiteThanks: { who: 'barney', text: 'Up it goes! It’s flying! You did it!' },
    kiteUp: { who: 'barney', text: 'Look, up it goes! It’s flying!' },
    kitesToo: { who: 'teddy', text: 'Kites fly too! And they haven’t got wings either!' },
    howFly: { who: 'teddy', text: 'An aeroplane! Its wings don’t flap. So how does it fly? I’ll try!' },
    flapHarder: { who: 'barney', text: 'Flap harder, Teddy! Higher!' },
    outOfBreath: { who: 'teddy', text: 'Phew! I’m all hot and out of breath.' },
    higher: { who: 'teddy', text: 'Maybe if I was up higher… Honeypot Hill!' },
    // 3. Honeypot Hill
    offHeWent: { who: 'narrator', text: 'So off Teddy went, to the top of Honeypot Hill.' },
    soHigh: { who: 'teddy', text: 'Ooh! It looks much higher from up here.' },
    nothingStop: { who: 'teddy', text: 'But nothing’s going to stop me now!' },
    eyesTight: { who: 'narrator', text: 'He shut his eyes tight. He made a little run…' },
    jumped: { who: 'narrator', text: 'And he jumped!' },
    gooey: { who: 'teddy', text: 'Oops! I forgot to flap! I’m all sticky and squelchy and gooey!' },
    whatDoing: { who: 'uncle-bill', text: 'Teddy! What are you doing down there?' },
    scupper: { who: 'uncle-bill', text: 'Well, scupper me scallywags! Hold tight, ship-mate!' },
    askRope: { who: 'uncle-bill', text: '{name}, can you let the rope down for him? Tap the rope!' },
    nudgeRope: { who: 'uncle-bill', text: 'Tap the rope, and down it goes!' },
    downSheGoes: { who: 'uncle-bill', text: 'I’ll let it down myself. Down she goes!' },
    ropeThanks: { who: 'uncle-bill', text: 'Good work, ship-mate! Grab the rope, Teddy!' },
    grabRope: { who: 'uncle-bill', text: 'Grab the rope, Teddy! Hold on tight!' },
    imFlying: { who: 'teddy', text: 'Look, {name}! I’m flying!' },
    // 4. Flying home
    onlyWanted: { who: 'teddy', text: 'I only wanted to fly!' },
    gotWish: { who: 'uncle-bill', text: 'Ha-ha! Well, you got your wish!' },
    soEasy: { who: 'teddy', text: 'The birds and the ladybird and the kite made it look so easy!' },
    downWeGo: { who: 'uncle-bill', text: 'Hold tight, ship-mate! Down we go, to Bear Cottage!' },
    whatever: { who: 'mummy-bear', text: 'Teddy! Whatever happened? You’re all muddy!' },
    liftHome: { who: 'uncle-bill', text: 'He landed SPLAT, so I gave him a lift home!' },
    bath: { who: 'mummy-bear', text: 'Into the bath, Teddy! Then honey on hot toast.' },
    yum: { who: 'teddy', text: 'Mmm! My favourite!' },
    excitingEnough: { who: 'teddy', text: 'You know, {name}? Flying home in a helicopter was exciting enough!' },
    cheerio: { who: 'uncle-bill', text: 'Ahoy, ship-mates! Cheerio!' },
    byeBill: { who: 'teddy', text: 'Bye, Uncle Bill! Thank you!' },
    end: { who: 'narrator', text: 'That night, a clean Teddy dreamed of flying.' },
  },
  scenes: [
    // ==================================================== 1. The window
    {
      name: 'The window',
      set(k) {
        k.backdrop('bear-kitchen');
        k.music('cosy');
        k.add(stool(), { x: 355, y: 535, w: 160, z: 11 });
        cast.teddy = k.character('teddy', { x: 325, y: 300, w: 220, z: 12 });
        cast.mummy = k.character('mummy-bear', { x: 830, y: 330, w: 280, flip: true, z: 13 });
        cast.bird = k.prop('blackbird', { x: 588, y: 312, w: 100, z: 9 });
        // The ladybird comes along the sill from the right, walking head first (to the left).
        cast.lady = k.prop('ladybird', { x: 690, y: 326, w: 64, z: 14 });
        k.set(cast.lady, { opacity: 0, rotation: -90 });
      },
      async play(k) {
        const { teddy, mummy, bird, lady } = cast;
        await k.wait(400);
        await k.say('whatLooking', mummy);
        // The blackbird flies off, up and away past the window, as he answers.
        flutter();
        await k.all(k.say('birds', teddy), k.to(bird, 1.6, { x: 260, y: -260, scale: 0.4, opacity: 0, ease: 'power1.in' }));
        await k.say('wings', mummy);
        k.pose(teddy, 'sad');
        await k.say('noWings', teddy);
        await k.wait(200);

        // A ladybird walks along the sill.
        k.fx.patter(6, 0.14);
        void k.fade(lady, 1, 0.4);
        await k.to(lady, 2, { x: -128, ease: 'none' });
        await k.to(lady, 0.4, { rotation: 0 });
        k.pose(teddy, 'default');
        await k.hop(teddy, 14);
        await k.say('ladybird', teddy);
        // He holds out his paw to her, thinking.
        k.pose(teddy, 'wave');
        await k.wait(400);
        await k.say('rhyme', teddy);

        // His turn: the ladybird flies.
        const how = await k.tapToHelp(lady, { ask: 'askBlow', nudge: 'nudgeBlow', helped: 'iBlow', by: teddy, size: 150 });
        k.puff(594, 346, 50, '#ffffff');
        await k.wait(300);
        const wings = k.pivot([...k.part(lady, 'wingL'), ...k.part(lady, 'wingR')]);
        k.fx.twinkle();
        await k.to(wings, 0.3, { rotation: (i: number) => (i ? 50 : -50) });
        flutter();
        await k.to(lady, 2, { x: -230, y: -180, scale: 0.6, opacity: 0, ease: 'sine.in' });
        k.pose(teddy, 'default');
        await k.say(how === 'tapped' ? 'thanksBlow' : 'offSheGoes', teddy);
        await k.say('beetles', teddy);
        common.giggle();
        await k.shake(mummy, 3, 2);
        k.pose(teddy, 'happy');
        k.fx.boing();
        await k.hop(teddy, 30);
        await k.say('soCanI', teddy);
        // Down off the stool and away out of the door.
        k.fx.patter(6, 0.12);
        await k.to(teddy, 0.4, { y: 96, ease: 'power2.in' });
        k.fx.thud();
        await k.exit(teddy, 'left', 0.9);
      },
    },

    // ==================================================== 2. The garden
    {
      name: 'The garden',
      set(k) {
        k.backdrop('bear-garden');
        k.music('adventure');
        cast.barney = k.character('barney', { x: 260, y: 393, w: 220, pose: 'wave', z: 12 });
        cast.teddy = k.character('teddy', { x: 690, y: 393, w: 220, flip: true, z: 12 });
        // The kite lies flopped on the grass by Barney, its string not out yet.
        cast.kite = k.prop('kite', { x: PAW[0] - KNOT[0], y: PAW[1] - KNOT[1], w: KITE_W, z: 14 });
        k.set(cast.kite, { x: 50, y: 150, rotation: 75, transformOrigin: `${KNOT[0]}px ${KNOT[1]}px` });
        const [dw, dh] = [SKY[0] - PAW[0], PAW[1] - SKY[1]];
        cast.string = k.add(kiteString(dw, dh), { x: PAW[0], y: SKY[1], w: dw, h: dh, z: 13 });
        k.set(cast.string, { scale: 0, transformOrigin: '0% 100%' });
        cast.fly1 = k.prop('butterfly', { x: 560, y: 470, w: 60, z: 20 });
        cast.fly2 = k.prop('butterfly', { x: 620, y: 360, w: 50, z: 20 });
        cast.plane = k.prop('aeroplane', { x: 0, y: 250, w: 180, z: 5 });
        k.set(cast.plane, { x: -260 });
      },
      async play(k) {
        const { teddy, barney, kite, string, fly1, fly2, plane } = cast;
        // Butterflies flit past.
        void flapWings(k, fly1, 10);
        void flapWings(k, fly2, 10);
        void k.to(fly2, 1.6, { x: -120, y: -60, ease: 'sine.inOut' });
        await k.to(fly1, 1.6, { x: 90, y: -110, ease: 'sine.inOut' });
        k.fx.twinkle();
        await k.say('butterflies', teddy);
        void flapWings(k, fly1, 8);
        void flapWings(k, fly2, 8);
        void k.to(fly2, 1.6, { x: 200, y: -380, opacity: 0, ease: 'sine.in' });
        await k.to(fly1, 1.6, { x: 400, y: -420, opacity: 0, ease: 'sine.in' });

        await k.say('newKite', barney);
        // The kite won't go up: it lifts a little and flops back down.
        k.fx.whizz();
        await k.to(kite, 0.5, { y: 70, rotation: 30, ease: 'power2.out' });
        await k.to(kite, 0.5, { y: 150, rotation: 75, ease: 'power2.in' });
        k.fx.thud();
        await k.say('wontGo', barney);

        // His turn: up goes the kite.
        const how = await k.tapToHelp(kite, { ask: 'askKite', nudge: 'nudgeKite', helped: 'gust', by: barney, helper: teddy, size: 170 });
        sounds.swoosh();
        k.fx.wind(2);
        await k.to(kite, 0.4, { x: 0, y: 0, rotation: -10, ease: 'power2.out' });
        const tail = k.pivot(k.part(kite, 'tail'));
        void k.to(tail, 0.5, { rotation: 14, yoyo: true, repeat: 5, ease: 'sine.inOut' });
        sounds.swoosh();
        await k.all(
          k.to(kite, 1.8, { x: SKY[0] - PAW[0], y: SKY[1] - PAW[1], rotation: 8, ease: 'power1.out' }),
          k.to(string, 1.8, { scale: 1, ease: 'power1.out' }),
        );
        k.fx.twinkle();
        await k.say(how === 'tapped' ? 'kiteThanks' : 'kiteUp', barney);
        await k.hop(teddy, 24);
        await k.say('kitesToo', teddy);

        // An aeroplane streaks across the sky.
        drone(2.6);
        await k.to(plane, 2.6, { x: 1400, y: -170, ease: 'none' });
        await k.say('howFly', teddy);

        // Teddy tries: jumping and flapping…
        k.pose(teddy, 'fly');
        k.fx.boing();
        await moves.flap(k, teddy, 3);
        common.giggle();
        await k.say('flapHarder', barney);
        k.fx.boing();
        await moves.flap(k, teddy, 2);
        k.pose(teddy, 'default');
        // …hopping on one leg, then the other.
        for (const side of ['legL', 'legR'] as const) {
          const leg = k.pivot(k.part(teddy, side));
          await k.to(leg, 0.2, { rotation: side === 'legL' ? 30 : -30 });
          k.fx.patter(3, 0.3);
          await k.hop(teddy, 18, 2);
          await k.to(leg, 0.2, { rotation: 0 });
        }
        k.pose(teddy, 'sad');
        k.fx.wind(1);
        await k.say('outOfBreath', teddy);
        common.giggle();
        await k.shake(barney, 4, 2);
        k.pose(teddy, 'default');
        await k.say('higher', teddy);
        k.pose(teddy, 'happy');
        k.fx.boing();
        await k.hop(teddy, 30);
      },
    },

    // ==================================================== 3. Honeypot Hill
    {
      name: 'Honeypot Hill',
      set(k) {
        k.backdrop('honeypot-hill');
        k.music('adventure');
        // Small, far up the path: his feet are at (770, 590) to begin with.
        cast.teddy = k.character('teddy', { x: 705, y: 443, w: 130, z: 12 });
        k.set(cast.teddy, { transformOrigin: '50% 100%' });
        // The helicopter waits off stage right, with its coil of rope and the long rope (rolled up).
        cast.heli = k.prop('helicopter', { x: 65, y: 30, w: 440, z: 10 });
        cast.coil = k.add(ropeCoil(), { x: 235, y: 238, w: 90, z: 11 });
        cast.rope = k.add(longRope(), { x: 270, y: 260, w: 20, h: 200, z: 9 });
        k.set(cast.rope, { scaleY: 0, transformOrigin: '50% 0%' });
        for (const el of [cast.heli, cast.coil, cast.rope]) k.set(el, { x: 1200 });
        cast.splash = k.prop('splash', { x: 150, y: 506, w: 260, z: 15 });
        k.set(cast.splash, { opacity: 0, scale: 0.3, transformOrigin: '50% 100%' });
      },
      async play(k) {
        const { heli, coil, rope, splash } = cast;
        let teddy = cast.teddy;
        // Up the winding path to the top (feet at each point, from (770, 590)).
        void k.say('offHeWent');
        const path: [number, number, number][] = [[700, 485, 0.95], [762, 405, 0.9], [790, 335, 0.85], [800, 284, 0.8]];
        for (const [fx, fy, s] of path) {
          k.fx.patter(4, 0.14);
          await k.to(teddy, 0.9, { x: fx - 770, y: fy - 590, scale: s, ease: 'sine.inOut' });
        }
        await k.wait(300);
        await k.camera({ zoom: 1.6, x: 790, y: 250 }, 1.2);
        await k.say('soHigh', teddy);
        k.pose(teddy, 'cross');
        await k.say('nothingStop', teddy);

        // The jump: quiet, a drumroll, eyes shut, a little run… and off!
        k.silence();
        await k.camera({}, 1);
        k.pose(teddy, 'fly');
        k.fx.drumroll(3);
        await k.all(k.say('eyesTight'), k.wait(1600).then(() => k.to(teddy, 0.8, { x: '-=24', ease: 'power1.in' })));
        k.fx.whizz();
        void k.say('jumped');
        await k.to(teddy, 0.6, { x: 600 - 770, y: 190 - 590, scale: 1.1, rotation: -15, ease: 'power2.out' });
        await k.to(teddy, 0.9, { x: 280 - 770, y: 640 - 590, scale: 1.69, rotation: 10, ease: 'power2.in' });

        // SPLAT! He sits up in the mud, fine and very muddy.
        sounds.splat();
        k.remove(teddy);
        teddy = cast.teddy = k.character('teddy', { x: 170, y: 391, w: 220, pose: 'sit', z: 12 });
        muddy(teddy);
        k.quake(5);
        await k.to(splash, 0.25, { opacity: 1, scale: 1, ease: 'back.out(2)' });
        await k.wait(500);
        void k.to(splash, 1.2, { opacity: 0 });
        await k.wait(300);
        sounds.squelch(2);
        await k.shake(teddy, 4, 2);
        await k.say('gooey', teddy);

        // A whirr in the sky: Uncle Bill.
        k.music('adventure');
        rotor(k, heli, 3.5);
        sounds.whirr(3);
        await k.all(...[heli, coil, rope].map((el) => k.to(el, 2, { x: 0, ease: 'power2.out' })));
        await k.say('whatDoing', heli);
        await k.say('scupper', heli);

        // His big turn: let the rope down.
        const how = await k.tapToHelp(coil, { ask: 'askRope', nudge: 'nudgeRope', helped: 'downSheGoes', by: heli, size: 150 });
        k.fx.whizz();
        void k.fade(coil, 0, 0.3);
        await k.to(rope, 0.9, { scaleY: 0.9, ease: 'bounce.out' });
        await k.say(how === 'tapped' ? 'ropeThanks' : 'grabRope', heli);
        // He stands up and grabs on.
        sounds.squelch(2);
        k.pose(teddy, 'happy');
        await k.hop(teddy, 10);
        await k.wait(300);
        // Hauled up, higher and higher.
        sounds.windlass();
        await k.all(k.to(teddy, 1.6, { y: -96, ease: 'sine.inOut' }), k.to(rope, 1.6, { scaleY: 0.42, ease: 'sine.inOut' }));
        rotor(k, heli, 2);
        sounds.whirr(2);
        await k.all(...[heli, rope, teddy].map((el) => k.to(el, 1.6, { y: '-=40', ease: 'sine.inOut' })));
        k.sparkle(280, 260, 12, 160);
        k.fx.twinkle();
        await k.say('imFlying', teddy);
        await helicopterVisit.leave(k, { heli }, { side: 'left', with: [rope, teddy] });
      },
    },

    // ==================================================== 4. Flying home
    {
      name: 'Flying home',
      set(k) {
        k.backdrop('bear-sky');
        k.music('triumph');
        cast.heli = k.prop('helicopter', { x: 380, y: 110, w: 440, z: 10 });
        k.set(k.part(cast.heli, 'rope'), { opacity: 1 });
        cast.teddy = k.character('teddy', { x: 495, y: 372, w: 200, pose: 'happy', z: 12 });
        k.set(cast.teddy, { transformOrigin: '50% 0%' });
        muddy(cast.teddy);
      },
      async play(k) {
        let { heli, teddy } = cast;
        // Swinging gently on the rope over the fields.
        rotor(k, heli, 4);
        sounds.whirr(3);
        await k.to(teddy, 1.2, { rotation: 6, ease: 'sine.inOut' });
        await k.to(teddy, 1.2, { rotation: -4, ease: 'sine.inOut' });
        await k.to(teddy, 0.8, { rotation: 0, ease: 'sine.inOut' });
        await k.say('onlyWanted', teddy);
        common.laugh();
        await k.say('gotWish', heli);
        await k.say('soEasy', teddy);
        await k.say('downWeGo', heli);
        rotor(k, heli, 2.4);
        sounds.whirr(2);
        await k.all(k.to(heli, 1.1, { y: 140, ease: 'power1.in' }), k.to(teddy, 1.1, { y: 140, ease: 'power1.in' }));

        // Down into Bear Cottage's garden.
        await k.cut(() => {
          k.backdrop('bear-garden');
          cast.heli = k.prop('helicopter', { x: 440, y: 0, w: 440, z: 10 });
          cast.rope = k.add(longRope(), { x: 645, y: 230, w: 20, h: 200, z: 9 });
          k.set(cast.rope, { scaleY: 0.44, transformOrigin: '50% 0%' });
          cast.teddy = k.character('teddy', { x: 550, y: 300, w: 210, pose: 'happy', z: 12 });
          muddy(cast.teddy);
          cast.mummy = k.character('mummy-bear', { x: 170, y: 333, w: 280, z: 13 });
          k.set(cast.mummy, { x: -480 });
          // The honey pot rides in Mummy's paws (inside her actor, so it hops with her).
          cast.honey = k.prop('honey-pot', { x: 0, y: 0, w: 90, z: 14 });
          cast.mummy.append(cast.honey);
          Object.assign(cast.honey.style, { left: '98px', top: '193px' });
          k.set(cast.honey, { opacity: 0 });
        });
        ({ heli, teddy } = cast);
        const { rope, mummy, honey } = cast;
        rotor(k, heli, 3);
        sounds.whirr(2.5);
        // Teddy is let down softly onto the grass, and Mummy runs out of Bear Cottage.
        const landed = k.all(k.to(teddy, 2, { y: 112, ease: 'sine.inOut' }), k.to(rope, 2, { scaleY: 1, ease: 'sine.inOut' })).then(() => {
          k.fx.thud();
          k.pose(teddy, 'default');
        });
        await k.wait(300);
        k.fx.patter(6, 0.12);
        await k.to(mummy, 0.9, { x: 0, ease: 'power2.out' });
        await k.all(k.say('whatever', mummy), landed);
        k.pose(teddy, 'happy');
        common.laugh();
        await k.say('liftHome', heli);
        await k.say('bath', mummy);
        k.pose(mummy, 'hold');
        k.fx.twinkle();
        await k.appear(honey, 0.5);
        sounds.yum();
        await k.hop(teddy, 26);
        await k.say('yum', teddy);
        k.pose(teddy, 'default');
        await k.say('excitingEnough', teddy);

        // Wave goodbye to Uncle Bill.
        await k.say('cheerio', heli);
        k.pose(teddy, 'wave');
        await k.all(helicopterVisit.leave(k, { heli }, { side: 'right', with: [rope] }), k.wait(500).then(() => k.say('byeBill', teddy)));
        await warmEnding(k, { cast: [mummy, teddy], end: 'end', music: 'cosy', sparkleAt: [520, 360] });
      },
    },
  ],
});
