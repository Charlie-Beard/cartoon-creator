/**
 * The Secret Way to Honeydukes: a scene from the third Harry Potter book
 * that the film only glimpses. Harry can't go to Hogsmeade, so Fred and
 * George give him the Marauder's Map, and it shows him a secret tunnel to
 * the best sweet shop in the world.
 *
 *   1. Left behind. A Hogsmeade weekend, and Harry's form was never signed.
 *      Ron and Hermione promise him sweets from Honeydukes and go. Psst!
 *      Fred and George have an early Christmas present: an old, blank bit
 *      of parchment. "I solemnly swear that I am up to no good." His first
 *      turn: he taps the map, and ink spreads into the whole of Hogwarts,
 *      footprints and all. Seven secret ways out, and one goes from the
 *      one-eyed witch to Honeydukes!
 *   2. The one-eyed witch. A quiet corridor and a funny old statue. The map
 *      says: tap her hump and say "Dissendium". His second turn: he taps
 *      the hump, and it swings open. A slide! Wheeee!
 *   3. The secret tunnel. Bump. Dark. His third turn: he taps the tip of
 *      Harry's wand, and "Lumos!" lights the way. On and on under the
 *      ground. Drip. A squeak. A huge shadow with big ears creeps up the
 *      wall… and it's only a tiny mouse, close to the light. Then stairs,
 *      and a trapdoor, and a smell of chocolate.
 *   4. Honeydukes. Up through the trapdoor into the shop. "Harry?!" Ron
 *      wants to show off a Pepper Imp: his fourth turn, he drags it over
 *      to Ron, and smoke puffs out of Ron's mouth. Hermione does the Ice
 *      Mice (chattering teeth). His fifth turn: he drags a Fizzing Whizbee
 *      to Ron, and Ron floats up to the ceiling, till Hermione pulls him
 *      down by his scarf. Back, before anybody notices!
 *   5. Mischief managed. By the common-room fire, sweets for everyone.
 *      Harry's Pepper Imp makes him puff like a little dragon. Fred and
 *      George: did you like our present? His sixth turn: he taps the map,
 *      "Mischief managed", and it goes blank again. A Chocolate Frog for {name}… and it hops away.
 *
 * The scary beat is the tunnel: dark, drips, and a big shadow that turns
 * out to be a little mouse. In the book Harry also hides from the
 * shopkeepers and goes on to hear about Sirius Black; both are left out.
 * The twins' jumpers have letters on, so they are never flipped.
 */
import { cached, defineCartoon, ellipse, NOTE, noiseBurst, now, piece, poly, svg, tone, type Kit } from '../../kit';
import { sounds as commonSounds } from '../../worlds/common/moves';
import { warmEnding } from '../../worlds/common/pieces';
import { moves as hogMoves, sounds as hogSounds } from '../../worlds/hogwarts/moves';
import meta from './meta';

const { giggle, laugh, sniff } = commonSounds;
const { fireCrackle, squeak } = hogSounds;
const { castSpell } = hogMoves;

// ------------------------------------------------------------------- art

/** A big mouse-shaped shadow on the tunnel wall: huge round ears, a long nose, a tail. 420 × 300. */
const bigShadow = cached(() =>
  svg({ w: 420, h: 300, name: 'honeydukes-shadow', label: 'A big shadow' }, [
    piece(ellipse(200, 190, 150, 90), '#141018', { edge: 'clean', shadow: false }),
    piece(ellipse(130, 90, 60, 60), '#141018', { edge: 'clean', shadow: false }),
    piece(ellipse(250, 80, 60, 60), '#141018', { edge: 'clean', shadow: false }),
    piece(poly([[330, 160], [410, 200], [330, 230]]), '#141018', { edge: 'clean', shadow: false }),
    piece(poly([[60, 230], [10, 280], [20, 290], [70, 250]]), '#141018', { edge: 'clean', shadow: false }),
  ]),
);

// ---------------------------------------------------------------- sounds

/** The map waking up: ink spreading, a soft scratchy whisper and a twinkle. */
function inkSpreads(): void {
  const t = now();
  noiseBurst(t, { freq: 3000, q: 2, peak: 0.03, attack: 0.3, decay: 1.4 });
  [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6].forEach((n, i) => tone(n, t + 0.3 + i * 0.12, { wave: 'sine', peak: 0.04, decay: 0.5 }));
}

/** Stone grinding: the witch's hump swinging open. */
function grind(): void {
  const t = now();
  noiseBurst(t, { freq: 300, q: 1, peak: 0.07, attack: 0.05, decay: 0.9 });
  tone(70, t, { wave: 'sawtooth', peak: 0.04, attack: 0.05, decay: 0.9, lowpass: 400 });
}

/** A long slide down a stone chute: a falling whistle. */
function slide(): void {
  const t = now();
  tone(NOTE.C6, t, { wave: 'sine', peak: 0.06, attack: 0.02, decay: 1.4, glideTo: NOTE.C4 });
  noiseBurst(t, { freq: 1500, q: 1, peak: 0.03, attack: 0.1, decay: 1.3 });
}

/** A drip of water in the tunnel. */
function drip(): void {
  const t = now();
  tone(NOTE.A5, t, { wave: 'sine', peak: 0.06, attack: 0.005, decay: 0.18, glideTo: NOTE.E6 });
}

/** Ice Mice: teeth chattering and a squeaky little squeak. */
function chatter(): void {
  const t = now();
  for (let i = 0; i < 8; i++) noiseBurst(t + i * 0.06, { freq: 4000, q: 4, peak: 0.04, attack: 0.002, decay: 0.03 });
  tone(NOTE.E6, t + 0.55, { wave: 'sine', peak: 0.05, decay: 0.15, glideTo: 1760 });
}

/** A Fizzing Whizbee: fizz, and a rising, floaty whistle. */
function fizz(): void {
  const t = now();
  noiseBurst(t, { freq: 5000, q: 1.5, peak: 0.05, attack: 0.05, decay: 1.2 });
  tone(NOTE.C5, t + 0.2, { wave: 'sine', peak: 0.05, attack: 0.3, decay: 1.6, glideTo: NOTE.C6, vibrato: [5, 10] });
}

// ------------------------------------------------------------------ cast

type Actor =
  | 'harry' | 'ron' | 'hermione' | 'fred' | 'george'
  | 'map' | 'witch' | 'shadow' | 'mouse' | 'glow' | 'trapdoor'
  | 'whizbee' | 'imp' | 'iceMouse' | 'frog';
const cast = {} as Record<Actor, HTMLElement>;

/** A Pepper Imp: whoever eats it puffs a little cloud of smoke out of their mouth. */
async function pepperPuff<K extends string>(k: Kit<K>, who: HTMLElement): Promise<void> {
  const { face } = k.box(who);
  hogSounds.fireCrackle(0.6);
  k.puff(face.cx, face.y + face.h * 0.85, 110, '#b0a8a8');
  await k.shake(who, 4, 2);
}

/** The map's ink fades in (or out), with its footprints walking along the path. */
async function mapInk<K extends string>(k: Kit<K>, map: HTMLElement, on: boolean): Promise<void> {
  const ink = k.part(map, 'ink');
  const feet = k.part(map, 'feet');
  if (on) {
    inkSpreads();
    await k.to([...ink, ...feet], 1.4, { opacity: 1 });
    if (feet.length) void k.to(feet, 1.6, { x: 60, y: -20, yoyo: true, repeat: 3, ease: 'sine.inOut' });
  } else {
    await k.to([...ink, ...feet], 1.2, { opacity: 0 });
  }
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. Left behind
    weekend: { who: 'narrator', text: 'Early one frosty morning, everybody was off to Hogsmeade village. Everybody except Harry.' },
    noForm: { who: 'harry', text: 'Uncle Vernon wouldn’t sign my form. So I can’t go.' },
    bringSweets: { who: 'ron', text: 'We’ll bring you loads of sweets, Harry. Promise!' },
    bestShop: { who: 'hermione', text: 'From Honeydukes! The best sweet shop in the world.' },
    psst: { who: 'fred', text: 'Psst! Harry!' },
    present: { who: 'george', text: 'We’ve got an early Christmas present for you.' },
    blank: { who: 'harry', text: 'It’s just an old bit of paper.' },
    magicMap: { who: 'fred', text: 'Ah, but it’s a magic map! Tap it, and say the secret words.' },
    words: { who: 'george', text: 'I solemnly swear that I am up to no good.' },
    askMap: { who: 'fred', text: 'Go on, {name}! Tap the map!' },
    nudgeMap: { who: 'george', text: 'Tap the old map!' },
    helpedMap: { who: 'harry', text: 'I’ll tap it myself.' },
    sayWords: { who: 'harry', text: 'I solemnly swear that I am up to no good!' },
    wholeSchool: { who: 'harry', text: 'Wow! It’s the whole of Hogwarts! And footprints, moving about!' },
    sevenWays: { who: 'george', text: 'There are seven secret ways out of the castle.' },
    witchWay: { who: 'fred', text: 'This one starts at the one-eyed witch. And it ends in Honeydukes!' },
    imGoing: { who: 'harry', text: 'Honeydukes? Then I’m going!' },
    // 2. The one-eyed witch
    statue: { who: 'narrator', text: 'Harry crept along a quiet corridor to the statue of the one-eyed witch.' },
    helloWitch: { who: 'harry', text: 'Hello, Mrs Witch. Please let me in.' },
    mapSays: { who: 'harry', text: 'The map says: tap her hump, and say “Dissendium”.' },
    askHump: { who: 'harry', text: '{name}, will you tap her big hump?' },
    nudgeHump: { who: 'harry', text: 'Tap the witch’s hump!' },
    helpedHump: { who: 'harry', text: 'I’ll tap it myself.' },
    dissendium: { who: 'harry', text: 'Dissendium!' },
    slideInside: { who: 'harry', text: 'It opened! There’s a slide inside!' },
    wheee: { who: 'harry', text: 'Here goes… Wheeeee!' },
    // 3. The secret tunnel
    bump: { who: 'harry', text: 'Oof! I’m at the bottom. It’s ever so dark.' },
    askLumos: { who: 'harry', text: 'Can you tap the end of my wand to light it?' },
    nudgeLumos: { who: 'harry', text: 'Tap my wand!' },
    helpedLumos: { who: 'harry', text: 'I’ll light it myself.' },
    lumos: { who: 'harry', text: 'Lumos!' },
    onAndOn: { who: 'narrator', text: 'The tunnel went on and on, twisting and turning, under the ground.' },
    whatNoise: { who: 'harry', text: 'What was that noise?' },
    whosThere: { who: 'harry', text: 'Wh… who’s there?' },
    onlyMouse: { who: 'harry', text: 'It’s only a little mouse! Its shadow was huge.' },
    chocolate: { who: 'harry', text: 'Stairs! And a trapdoor! Mmm. Something up there smells of chocolate.' },
    // 4. Honeydukes
    shop: { who: 'narrator', text: 'Harry pushed up the trapdoor, and climbed out into Honeydukes!' },
    howGetHere: { who: 'ron', text: 'Harry?! How did you get here?' },
    tunnel: { who: 'harry', text: 'A secret tunnel! Fred and George’s map showed me.' },
    notSupposed: { who: 'hermione', text: 'Harry! You’re not supposed to be here! Well… just this once. Look at all these sweets!' },
    pepperImps: { who: 'ron', text: 'Pepper Imps! They make smoke come out of your mouth!' },
    askImp: { who: 'ron', text: 'Can you drag one over to me?' },
    nudgeImp: { who: 'ron', text: 'Drag the little Imp to me!' },
    helpedImp: { who: 'ron', text: 'Never mind, I’ll grab one myself.' },
    iceMice: { who: 'hermione', text: 'And Ice Mice! They make your teeth chatter and squeak.' },
    pinkOnes: { who: 'harry', text: 'What are these big pink ones?' },
    whizbees: { who: 'hermione', text: 'Fizzing Whizbees. They make you float off the ground!' },
    askWhizbee: { who: 'ron', text: '{name}, can you drag the pink Whizbee to me?' },
    nudgeWhizbee: { who: 'ron', text: 'Drag the pink fizzy sweet to me!' },
    helpedWhizbee: { who: 'harry', text: 'Here you are, Ron!' },
    floating: { who: 'ron', text: 'Whoaaa! I’m floating! Look at me!' },
    comeDown: { who: 'hermione', text: 'Ron! Come down this minute!' },
    getBack: { who: 'harry', text: 'I’d better get back to the castle. Before anybody notices!' },
    // 5. Mischief managed
    thatNight: { who: 'narrator', text: 'That night, by the common-room fire, they shared out the sweets.' },
    myTurn: { who: 'harry', text: 'My turn for a Pepper Imp!' },
    dragon: { who: 'ron', text: 'You look like a little dragon!' },
    likePresent: { who: 'fred', text: 'So, Harry. Did you like our present?' },
    bestPresent: { who: 'harry', text: 'It was the best present ever. Thank you!' },
    askMischief: { who: 'george', text: 'Now tap the map, and say “Mischief managed”. Then nobody else can read it.' },
    nudgeMischief: { who: 'fred', text: 'Tap the map!' },
    helpedMischief: { who: 'harry', text: 'I’ll tap it myself.' },
    managed: { who: 'harry', text: 'Mischief managed!' },
    frogForYou: { who: 'harry', text: 'What a day! Would you like a Chocolate Frog, {name}?' },
    end: { who: 'narrator', text: 'But the Chocolate Frog hopped away! Goodnight, {name}. Mischief managed.' },
  },
  scenes: [
    // ==================================================== 1. Left behind
    {
      name: 'Left behind',
      set(k) {
        k.backdrop('common-room');
        k.music('cosy');
        k.prop('flame', { x: 545, y: 455, w: 110, z: 4 });
        k.light(560, 470, 220, { color: '#ffb060', strength: 0.4, flicker: true, z: 5 });
        cast.ron = k.character('ron', { x: 60, y: 400, w: 230 });
        cast.hermione = k.character('hermione', { x: 260, y: 404, w: 230 });
        cast.harry = k.character('harry', { x: 790, y: 400, w: 240, flip: true });
        // The twins come in from the right later; their jumpers' letters mean no flipping.
        cast.fred = k.character('fred', { x: 290, y: 396, w: 240 });
        cast.george = k.character('george', { x: 50, y: 396, w: 240 });
        cast.map = k.prop('maraudersMap', { x: 530, y: 470, w: 240, z: 20 });
        k.set([cast.fred, cast.george, cast.map], { opacity: 0 });
        k.set(k.part(cast.map, 'ink'), { opacity: 0 });
        k.set(k.part(cast.map, 'feet'), { opacity: 0 });
      },
      async play(k) {
        const { ron, hermione, harry, fred, george, map } = cast;
        fireCrackle(3);
        await k.say('weekend');
        await k.say('noForm', harry);
        await k.say('bringSweets', ron);
        await k.all(k.say('bestShop', hermione), k.hop(hermione, 20));
        // Off they go, and Harry is on his own.
        k.fx.patter(8);
        await k.all(k.exit(ron, 'left', 0.9), k.wait(250).then(() => k.exit(hermione, 'left', 0.9)));
        k.music('dreamy');
        await k.to(harry, 0.8, { y: '+=20', ease: 'sine.inOut' });
        await k.wait(500);

        // Psst! The twins.
        k.music('sneaky');
        k.set([fred, george], { opacity: 1 });
        k.fx.whizz();
        await k.enter(george, 'left', 0.6);
        await k.say('psst', fred);
        await k.enter(fred, 'left', 0.6);
        await k.say('present', george);
        k.sfx.page();
        await k.all(k.fade(map, 1, 0.5), k.pop(map, 1.06));
        await k.say('blank', harry);
        await k.say('magicMap', fred);
        await k.say('words', george);

        // His first turn: wake the map.
        await k.tapToHelp(map, { ask: 'askMap', nudge: 'nudgeMap', helped: 'helpedMap', by: fred, helper: harry, size: 260 });
        await k.say('sayWords', harry);
        await mapInk(k, map, true);
        k.music('magic');
        await k.all(k.say('wholeSchool', harry), k.hop(harry, 24));
        await k.say('sevenWays', george);
        await k.say('witchWay', fred);
        await k.all(k.say('imGoing', harry), k.hop(harry, 30));
      },
    },

    // ==================================================== 2. The one-eyed witch
    {
      name: 'The one-eyed witch',
      set(k) {
        k.backdrop('castle-corridor');
        k.music('sneaky');
        k.light(140, 245, 110, { color: '#ffcf7a', strength: 0.4, flicker: true, z: 5 });
        k.light(1040, 245, 110, { color: '#ffcf7a', strength: 0.4, flicker: true, z: 5 });
        cast.witch = k.prop('oneEyedWitch', { x: 620, y: 190, w: 310, z: 12 });
        cast.harry = k.character('harry', { x: 280, y: 390, w: 240 });
        k.set(cast.harry, { x: -500 });
      },
      async play(k) {
        const { witch, harry } = cast;
        k.fx.sneak();
        await k.all(k.say('statue'), k.to(harry, 2.4, { x: 0, ease: 'power1.out' }));
        await k.say('helloWitch', harry);
        k.sfx.page();
        await k.say('mapSays', harry);

        // His second turn: tap the hump.
        // The ring goes round her hump (an invisible spot over it), not the whole statue.
        const wb0 = k.box(witch);
        const humpSpot = k.add('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"></svg>', {
          x: wb0.x + (156 / 220) * wb0.w - 70, y: wb0.y + (138 / 340) * wb0.h - 70, w: 140, h: 140, z: 20,
        });
        await k.tapToHelp(humpSpot, { ask: 'askHump', nudge: 'nudgeHump', helped: 'helpedHump', by: harry, size: 150 });
        k.remove(humpSpot);
        await castSpell(k, harry);
        await k.say('dissendium', harry);
        grind();
        k.quake(3);
        const hump = k.pivot(k.part(witch, 'hump'));
        await k.to(hump, 1.0, { rotation: -70, ease: 'power2.out' });
        k.sparkle(760, 380, 10, 120);
        await k.all(k.say('slideInside', harry), k.hop(harry, 24));
        await k.say('wheee', harry);

        // In he goes, and down.
        const wb = k.box(witch);
        const hb = k.box(harry);
        k.set(harry, { zIndex: 13 });
        await k.to(harry, 0.6, { x: wb.x + wb.w / 2 - (hb.x + hb.w / 2), y: -150, scale: 0.5, ease: 'power2.out' });
        slide();
        await k.to(harry, 0.6, { y: 200, scale: 0.2, opacity: 0, ease: 'power2.in' });
        void k.to(hump, 0.8, { rotation: 0, ease: 'power2.inOut' });
        grind();
        await k.wait(800);
      },
    },

    // ==================================================== 3. The secret tunnel
    {
      name: 'The secret tunnel',
      set(k) {
        k.backdrop('secret-tunnel');
        k.music('spooky');
        k.dim(0.45, '#05040a');
        cast.harry = k.character('harry', { x: 160, y: 390, w: 240 });
        cast.glow = k.light(330, 430, 260, { color: '#fff1c0', strength: 0.5 });
        cast.shadow = k.add(bigShadow(), { x: 520, y: 160, w: 420, z: 8 });
        cast.mouse = k.prop('whiteMouse', { x: 520, y: 580, w: 80, z: 14 });
        k.set(cast.glow, { opacity: 0 });
        k.set(cast.shadow, { opacity: 0, scale: 0.6 });
        k.set(cast.mouse, { opacity: 0 });
        k.set(cast.harry, { y: -500, opacity: 0 });
      },
      async play(k) {
        const { harry, glow, shadow, mouse } = cast;
        slide();
        k.set(harry, { opacity: 1 });
        await k.to(harry, 0.6, { y: 0, ease: 'bounce.out' });
        k.fx.thud();
        await k.say('bump', harry);

        // His turn: tap the end of Harry's wand to light it. The ring goes on the wand tip
        // (an invisible spot over it), just right of his hand.
        const hb = k.box(harry);
        const wandSpot = k.add('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"></svg>', {
          x: hb.x + hb.w * 0.83 - 70, y: hb.y + hb.h * 0.74 - 70, w: 140, h: 140, z: 20,
        });
        await k.tapToHelp(wandSpot, { ask: 'askLumos', nudge: 'nudgeLumos', helped: 'helpedLumos', by: harry, size: 130 });
        k.remove(wandSpot);
        await castSpell(k, harry);
        await k.say('lumos', harry);
        k.fx.twinkle();
        await k.to(glow, 0.8, { opacity: 1 });

        // On and on, under the ground.
        await k.all(k.say('onAndOn'), k.wait(800).then(() => k.all(k.walk(harry, 120, 2, 6), k.to(glow, 2, { x: 120 }))));
        drip();
        await k.wait(700);
        drip();
        squeak(2);
        await k.wait(500);
        await k.all(k.say('whatNoise', harry), k.shake(harry, 3, 2));

        // A huge shadow with big ears creeps up the wall.
        k.silence();
        k.music('spooky');
        k.fx.rumble(1.5);
        await k.to(shadow, 2.2, { opacity: 0.85, scale: 1, ease: 'power1.out' });
        await k.camera({ zoom: 1.25, x: 720, y: 340 }, 1.1);
        await k.camera({}, 0.9);
        await k.all(k.say('whosThere', harry), k.shake(harry, 4, 3));

        // It's only a little mouse, close to the light.
        squeak(2);
        await k.fade(mouse, 1, 0.4);
        await k.to(shadow, 0.6, { opacity: 0.4, scale: 0.6, ease: 'power1.inOut' });
        k.music('magic');
        giggle();
        await k.say('onlyMouse', harry);
        squeak(1);
        k.fx.patter(5);
        await k.all(k.to(mouse, 1.2, { x: 500, ease: 'power1.in' }), k.to(shadow, 1.2, { x: 500, opacity: 0 }));
        await k.all(k.walk(harry, 220, 1.8, 6), k.to(glow, 1.8, { x: 340 }));
        sniff();
        await k.say('chocolate', harry);
      },
    },

    // ==================================================== 4. Honeydukes
    {
      name: 'Honeydukes',
      set(k) {
        k.backdrop('honeydukes');
        k.music('magic');
        // Ron's jumper has an R, so he faces right, towards Harry coming up on the right.
        cast.hermione = k.character('hermione', { x: 90, y: 396, w: 230 });
        cast.ron = k.character('ron', { x: 340, y: 396, w: 230 });
        cast.imp = k.prop('pepperImp', { x: 720, y: 350, w: 110, z: 16 });
        cast.iceMouse = k.prop('iceMouse', { x: 600, y: 590, w: 100, z: 16 });
        cast.whizbee = k.prop('fizzingWhizbee', { x: 640, y: 350, w: 130, z: 16 });
        cast.trapdoor = k.prop('trapdoor', { x: 860, y: 600, w: 220, z: 15 });
        cast.harry = k.character('harry', { x: 860, y: 380, w: 230, z: 14, flip: true });
        k.set(cast.harry, { opacity: 0, y: 160 });
        k.set([cast.imp, cast.iceMouse, cast.whizbee], { opacity: 0 });
      },
      async play(k) {
        const { trapdoor, harry, ron, hermione, imp, iceMouse, whizbee } = cast;
        // Up through the trapdoor.
        k.fx.creak();
        const door = k.pivot(k.part(trapdoor, 'door'));
        // The lid flips up over its back hinge.
        await k.to(door, 0.8, { scaleY: -1, ease: 'power2.out' });
        await k.all(k.say('shop'), k.to(harry, 1.2, { opacity: 1, y: 0, ease: 'back.out(1.2)' }));
        k.set(harry, { zIndex: 16 });
        await k.all(k.say('howGetHere', ron), k.shake(ron, 5, 2));
        await k.say('tunnel', harry);
        await k.say('notSupposed', hermione);

        // A Pepper Imp: smoke!
        await k.fade(imp, 1, 0.3);
        await k.say('pepperImps', ron);
        // His turn: drag the Imp to Ron.
        await k.dragToHelp(imp, { to: ron, ask: 'askImp', nudge: 'nudgeImp', helped: 'helpedImp', by: ron, dropSize: 200 });
        await k.vanish(imp, 0.3);
        await pepperPuff(k, ron);
        laugh();
        // Ice Mice: chattering teeth.
        await k.fade(iceMouse, 1, 0.3);
        await k.say('iceMice', hermione);
        await k.vanish(iceMouse, 0.3);
        chatter();
        await k.shake(hermione, 3, 4);

        // His fifth turn: drag a Fizzing Whizbee to Ron.
        await k.fade(whizbee, 1, 0.3);
        await k.say('pinkOnes', harry);
        await k.say('whizbees', hermione);
        await k.dragToHelp(whizbee, { to: ron, ask: 'askWhizbee', nudge: 'nudgeWhizbee', helped: 'helpedWhizbee', by: ron, helper: harry, dropSize: 200 });
        k.fx.whizz();
        await k.vanish(whizbee, 0.3);
        fizz();
        k.sparkle(455, 520, 10, 120);
        await k.to(ron, 1.6, { y: -250, ease: 'sine.inOut' });
        await k.say('floating', ron);
        await k.to(ron, 0.7, { y: -270, yoyo: true, repeat: 1, ease: 'sine.inOut' });
        laugh();
        await k.say('comeDown', hermione);
        // She tugs him by the scarf, and down he drifts as the fizz wears off.
        await k.to(hermione, 0.3, { x: 20, yoyo: true, repeat: 1 });
        await k.to(ron, 1.4, { y: 0, ease: 'power2.inOut' });
        k.fx.thud();
        await k.pop(ron, 1.06);
        await k.say('getBack', harry);
      },
    },

    // ==================================================== 5. Mischief managed
    {
      name: 'Mischief managed',
      set(k) {
        k.backdrop('common-room');
        k.music('cosy');
        k.prop('flame', { x: 545, y: 455, w: 110, z: 4 });
        k.light(560, 470, 220, { color: '#ffb060', strength: 0.4, flicker: true, z: 5 });
        // Ron and the twins have letters on their jumpers, so they stay unflipped on the left, facing Harry.
        cast.george = k.character('george', { x: 10, y: 396, w: 220 });
        cast.fred = k.character('fred', { x: 210, y: 396, w: 220 });
        cast.ron = k.character('ron', { x: 420, y: 400, w: 220 });
        cast.map = k.prop('maraudersMap', { x: 650, y: 520, w: 220, z: 18 });
        cast.harry = k.character('harry', { x: 880, y: 400, w: 230, flip: true });
        cast.frog = k.prop('frog', { x: 700, y: 570, w: 100, z: 19 });
        k.set([cast.fred, cast.george, cast.frog], { opacity: 0 });
      },
      async play(k) {
        const { ron, harry, fred, george, map, frog } = cast;
        fireCrackle(3);
        await k.say('thatNight');
        await k.say('myTurn', harry);
        await pepperPuff(k, harry);
        await k.wait(200);
        await pepperPuff(k, harry);
        laugh();
        await k.all(k.say('dragon', ron), k.hop(ron, 20));

        // The twins drop by.
        k.set([fred, george], { opacity: 1 });
        await k.all(k.enter(george, 'left', 0.7), k.wait(200).then(() => k.enter(fred, 'left', 0.7)));
        await k.say('likePresent', fred);
        await k.all(k.say('bestPresent', harry), k.hop(harry, 24));
        // His last turn: tap the map to hide it again.
        await k.tapToHelp(map, { ask: 'askMischief', nudge: 'nudgeMischief', helped: 'helpedMischief', by: george, helper: harry, size: 240 });
        await castSpell(k, harry);
        await k.say('managed', harry);
        await mapInk(k, map, false);
        k.fx.twinkle();

        // A Chocolate Frog for him… and it hops away.
        await k.fade(frog, 1, 0.3);
        await k.say('frogForYou', harry);
        k.fx.boing();
        await k.to(frog, 0.5, { x: -120, y: -160, ease: 'power1.out' });
        k.fx.boing();
        await k.to(frog, 0.5, { x: -260, y: 0, ease: 'power1.in' });
        k.fx.boing();
        await k.to(frog, 0.6, { x: -500, y: -380, opacity: 0, ease: 'power1.out' });
        giggle();
        await warmEnding(k, { cast: [ron, harry, fred, george], end: 'end' });
      },
    },
  ],
});
