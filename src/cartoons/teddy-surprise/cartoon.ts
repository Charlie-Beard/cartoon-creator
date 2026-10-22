/**
 * Teddy Bear's Surprise: a bored Teddy marches off cross, meets Uncle Sailor
 * Bill's treasure hunt in the wood, and the hunt ends on the green right
 * across the path from his own front garden.
 *
 * From the book's story of the same name.
 *
 *   1. Bored. Bear Cottage's garden. Teddy is so bored: he's done all his
 *      jigsaws and tidied the toy cupboard, and there's nothing to do. A
 *      butterfly flutters past and away. Mummy comes out: what about digging in
 *      the garden? His turn: Mummy has a spade, and he drags it across to
 *      Teddy (or she passes it herself). All right… he'll ask Barney to
 *      help. "Cheer up, Teddy! You
 *      might have a nice surprise before long!" He doesn't think so, and off
 *      he goes. Mummy, to him: shh, she knows a secret.
 *   2. Nobody home. Barney's green front door. His turn: he taps the brass
 *      knocker (or Teddy knocks himself). Knock, knock… nobody comes. "It's
 *      not fair!" Teddy should have gone straight home; instead he marches
 *      away, not looking where he's going. In the wood, where all the trees
 *      look the same, he sits on a stone, sad and lonely, nearly crying…
 *      except he hears somebody laughing.
 *   3. Ahoy, ship-mates! The wood. It's Uncle Sailor Bill: "Well, scupper me
 *      scallywags!" Posy and Bella are going on a treasure hunt, with a picnic
 *      first. His turn: he drags the picnic basket over to the big stone (or
 *      Bella carries it). Will Mummy mind? "I think she'll find out soon enough!" The first
 *      clue is in the hollow tree. His turn: he taps the hidey-hole (or Uncle
 *      Bill fishes it out), and out pops a map: the treasure is where the
 *      ducks swim. Where's that? "You'll find out soon enough, Teddy!" Bobby
 *      pops up from behind Teddy's stone: race you through the trees!
 *   4. The best surprise. Out they burst onto the green: a duck pond, a
 *      swing, a wishing well… and Teddy's own house across the path. Mummy
 *      comes with cherry buns: didn't she say he'd get a nice surprise? The
 *      treasure is by the duck pond. His turn: he taps the chest (or Uncle
 *      Bill heaves the lid up): golden honey sweets for every bear. "But
 *      coming home was the best surprise of all!"
 *
 * The tricky bit is gentle and short: Teddy alone in the wood is sad, not in
 * danger, and the laughing comes before he can cry. The lesson ("Teddy should
 * have gone straight back home") is the narrator's, said once and softly.
 * No more than four bears are on stage at once, so the treasure-hunt cubs
 * come and go: Posy and Bella skip ahead before Bobby pops up, and Bobby runs
 * off to fetch the others before Mummy comes out.
 */
import { defineCartoon, noiseBurst, now, tone, type Kit } from '../../kit';
import { sounds as commonSounds } from '../../worlds/common/moves';
import { noiseOff, warmEnding } from '../../worlds/common/pieces';
import { moves as bearMoves, sounds as bearSounds } from '../../worlds/bears/moves';
import { barneysDoor, knocker, mapRoll, stone, treasureMap } from './art';
import meta from './meta';

const { laugh, giggle } = commonSounds;
const { march } = bearMoves;
const { yum } = bearSounds;

// ---------------------------------------------------------------- sounds

/** A long bored sigh: one soft note sliding down. */
function sigh(): void {
  const t = now();
  tone(440, t, { wave: 'sine', peak: 0.045, attack: 0.15, decay: 0.7, glideTo: 260 });
  noiseBurst(t, { freq: 900, q: 0.8, peak: 0.025, attack: 0.15, decay: 0.6, sweepTo: 500 });
}

/** A duck: quack-quack, two short nasal calls. */
function quack(): void {
  const t = now();
  [0, 0.24].forEach((dt) => tone(560, t + dt, { wave: 'sawtooth', peak: 0.035, attack: 0.01, decay: 0.15, glideTo: 400, lowpass: 1500 }));
}

/** A sad little sniff. */
function sniffle(): void {
  const t = now();
  [0, 0.3].forEach((dt) => noiseBurst(t + dt, { freq: 2200, q: 1.5, peak: 0.04, attack: 0.04, decay: 0.12, sweepTo: 3000 }));
}

/** A hole in a tree to tap: nothing to see, just a place for the ring (the hole is painted in the backdrop). */
const holeArt = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"></svg>';

// ------------------------------------------------------------------ cast

type Who = 'teddy' | 'mummy' | 'bill' | 'posy' | 'bella' | 'bobby' | 'knocker' | 'stone' | 'hole' | 'basket' | 'chest' | 'plate' | 'duck' | 'butterfly' | 'spade';
const cast = {} as Record<Who, HTMLElement>;

/** Where Teddy sits on his stone in the wood (scenes 2 and 3): on its top, legs over the front. */
const SITTING = { x: 690, y: 400, w: 210 };

/** Flaps the butterfly's wings `times` times while it flies. */
async function flutter(k: Kit, el: HTMLElement, times: number): Promise<void> {
  const l = k.pivot(k.part(el, 'wingL'));
  const r = k.pivot(k.part(el, 'wingR'));
  for (let i = 0; i < times; i++) {
    await k.all(k.to(l, 0.14, { scaleX: 0.3 }), k.to(r, 0.14, { scaleX: 0.3 }));
    await k.all(k.to(l, 0.14, { scaleX: 1 }), k.to(r, 0.14, { scaleX: 1 }));
  }
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. Bored
    bored: { who: 'narrator', text: 'Teddy Bear was feeling so bored! Mummy was busy, and Daddy was at the market.' },
    jigsaws: { who: 'teddy', text: 'I’ve done all my jigsaws. And I’ve tidied the toy cupboard!' },
    nothingToDo: { who: 'teddy', text: 'There’s nothing to do, {name}. Nothing at all!' },
    digging: { who: 'mummy-bear', text: 'What about digging in the garden, Teddy?' },
    askSpade: { who: 'mummy-bear', text: 'Here’s a spade. Can you drag it over to Teddy, {name}?' },
    nudgeSpade: { who: 'mummy-bear', text: 'Drag the spade across to Teddy.' },
    passSpade: { who: 'mummy-bear', text: 'Never mind, I’ll pass it to him myself.' },
    thanksSpade: { who: 'teddy', text: 'Ooh, a spade! Thank you!' },
    thanksMummy: { who: 'teddy', text: 'Ooh, a spade! Thank you, Mummy!' },
    allRight: { who: 'teddy', text: 'All right… I’ll go and ask Barney to help.' },
    cheerUp: { who: 'mummy-bear', text: 'Cheer up, Teddy! You might have a nice surprise before long!' },
    dontThink: { who: 'teddy', text: 'A surprise? I don’t think so.' },
    secret: { who: 'mummy-bear', text: 'Shh, {name}! I know a secret!' },
    // 2. Nobody home
    bestFriend: { who: 'teddy', text: 'Here’s Barney’s house. He’s my best friend!' },
    askKnock: { who: 'teddy', text: 'Will you knock for me, {name}? Tap the shiny knocker!' },
    nudgeKnock: { who: 'teddy', text: 'Tap the knocker on the green door.' },
    knockMyself: { who: 'teddy', text: 'I’ll knock myself, then. Knock, knock!' },
    anyoneHome: { who: 'teddy', text: 'Barney? It’s me, Teddy! Are you there?' },
    notFair: { who: 'teddy', text: 'Barney’s not at home! It’s not fair! There’s nobody to play with!' },
    shouldHave: { who: 'narrator', text: 'Teddy should have gone straight back home.' },
    marchedAway: { who: 'narrator', text: 'Instead, he just marched away, and he didn’t look where he was going.' },
    sadLonely: { who: 'narrator', text: 'Teddy felt so sad and lonely, he might have begun to cry…' },
    laughing: { who: 'narrator', text: '…except, just then, he heard somebody laughing!' },
    // 3. Ahoy, ship-mates!
    shipmates: { who: 'uncle-bill', text: 'That’s right, ship-mates! Just enjoy yourselves!' },
    itsMe: { who: 'teddy', text: 'Uncle Sailor Bill! It’s me, Teddy!' },
    scupper: { who: 'uncle-bill', text: 'Well, scupper me scallywags! Come and meet my friends, Teddy!' },
    treasureHunt: { who: 'posy', text: 'I’m Posy! We’re going on a treasure hunt!' },
    picnicFirst: { who: 'bella', text: 'I’m Bella. And there’s a picnic first!' },
    mummyMind: { who: 'teddy', text: 'Can I come too? Do you think Mummy will mind?' },
    findOut: { who: 'uncle-bill', text: 'Ha! I think she’ll find out soon enough!' },
    askBasket: { who: 'bella', text: 'Can you drag the picnic basket to the big stone, {name}?' },
    nudgeBasket: { who: 'bella', text: 'Drag the basket over to the stone.' },
    carryBasket: { who: 'bella', text: 'I’ll carry it over myself. There!' },
    thanksBasket: { who: 'bella', text: 'Thank you, {name}! Lovely!' },
    askHole: { who: 'uncle-bill', text: 'The first clue is in the hollow tree. Tap the hidey-hole, {name}!' },
    nudgeHole: { who: 'uncle-bill', text: 'Tap the dark hole in the big tree.' },
    fishItOut: { who: 'uncle-bill', text: 'I’ll fish it out. Got it!' },
    readMap: { who: 'uncle-bill', text: 'It says the treasure is where the ducks swim!' },
    whereDucks: { who: 'teddy', text: 'Where do the ducks swim, Uncle Bill?' },
    soonEnough: { who: 'uncle-bill', text: 'You’ll find out soon enough, Teddy!' },
    boo: { who: 'bobby', text: 'Boo! I’m Bobby. I was hiding behind your stone!' },
    raceYou: { who: 'bobby', text: 'Race you through the trees, Teddy!' },
    // 4. The best surprise
    pondSwing: { who: 'teddy', text: 'A duck pond… a swing… a wishing well…' },
    myHouse: { who: 'teddy', text: 'That’s my house! It’s just across the path!' },
    funNow: { who: 'bobby', text: 'Now for some fun! I’ll fetch the others.' },
    newFriends: { who: 'mummy-bear', text: 'I see you’ve met your new friends, Teddy! Didn’t I say you’d get a nice surprise?' },
    youDid: { who: 'teddy', text: 'Yes, Mummy. You did!' },
    duckPond: { who: 'teddy', text: 'Where the ducks swim… the duck pond! There’s the treasure!' },
    askChest: { who: 'teddy', text: 'Open it, {name}! Tap the treasure chest!' },
    nudgeChest: { who: 'teddy', text: 'Tap the chest by the duck pond.' },
    heaveHo: { who: 'uncle-bill', text: 'Heave-ho! Up comes the lid!' },
    honeySweets: { who: 'uncle-bill', text: 'Golden honey sweets! Enough for every bear!' },
    thanksName: { who: 'teddy', text: 'Thank you, {name}! Mmm!' },
    thanksBill: { who: 'teddy', text: 'Thank you, Uncle Bill! Mmm!' },
    bestOfAll: { who: 'teddy', text: 'But coming home was the best surprise of all!' },
    end: { who: 'narrator', text: 'And they all had a picnic, right by Teddy’s home.' },
  },
  scenes: [
    // ==================================================== 1. Bored
    {
      name: 'Bored',
      set(k) {
        k.backdrop('bear-garden');
        k.music('cosy');
        cast.teddy = k.character('teddy', { x: 820, y: 412, w: 210, flip: true });
        cast.mummy = k.character('mummy-bear', { x: 340, y: 362, w: 250 });
        // Mummy starts small at the cottage door, to walk down the path.
        k.set(cast.mummy, { x: -150, y: -70, scale: 0.42, opacity: 0 });
        cast.butterfly = k.prop('butterfly', { x: 1180, y: 250, w: 80, z: 20 });
        // The spade Mummy brings, leaning by her; it fades in when she speaks.
        cast.spade = k.prop('spade', { x: 580, y: 430, w: 80, z: 13 });
        k.set(cast.spade, { opacity: 0 });
      },
      async play(k) {
        const { teddy, mummy, butterfly, spade } = cast;
        await k.wait(200);
        sigh();
        await k.say('bored');
        await k.all(k.say('jigsaws', teddy), k.wait(300).then(() => k.shake(teddy, 4, 2)));
        k.face(teddy, false);
        k.pose(teddy, 'cross');
        await k.say('nothingToDo', teddy);

        // A butterfly flutters across over his head, and away.
        k.fx.twinkle();
        await k.all(k.to(butterfly, 2.8, { x: -760, y: 60, ease: 'sine.inOut' }), flutter(k, butterfly, 10));
        sigh();
        await k.wait(400);
        k.set(butterfly, { opacity: 0 });

        // Mummy comes out of the door and down the path.
        k.fx.creak();
        await k.to(mummy, 0.4, { opacity: 1 });
        k.fx.patter(5, 0.18);
        await k.to(mummy, 1.4, { x: 0, y: 0, scale: 1, ease: 'sine.inOut' });
        k.pose(teddy, 'default');
        k.face(teddy, true);
        await k.say('digging', mummy);

        // His turn: drag the spade across to Teddy.
        await k.to(spade, 0.4, { opacity: 1 });
        const gift = await k.dragToHelp(spade, { to: teddy, ask: 'askSpade', nudge: 'nudgeSpade', helped: 'passSpade', by: mummy });
        await k.say(gift === 'dragged' ? 'thanksSpade' : 'thanksMummy', teddy);
        void k.vanish(spade, 0.4);
        sigh();
        await k.say('allRight', teddy);
        await k.say('cheerUp', mummy);
        void k.blink(mummy);
        k.pose(teddy, 'cross');
        await k.say('dontThink', teddy);

        // Off he trudges, out of the gate on the right.
        k.face(teddy, false);
        await k.all(k.walk(teddy, 460, 2, 5), k.wait(200).then(() => k.fx.patter(6, 0.2)));
        await k.wait(400);
        // Mummy, to him: she knows a secret.
        giggle();
        await k.say('secret', mummy);
        await k.blink(mummy);
      },
    },

    // ==================================================== 2. Nobody home
    {
      name: 'Nobody home',
      set(k) {
        k.backdrop(barneysDoor());
        k.music('cosy');
        cast.knocker = k.add(knocker(), { x: 295, y: 430, w: 70, z: 12 });
        cast.teddy = k.character('teddy', { x: 450, y: 412, w: 210, flip: true });
        k.set(cast.teddy, { x: 820 });
      },
      async play(k) {
        const { teddy, knocker: knock } = cast;
        k.fx.patter(6, 0.2);
        await k.walk(teddy, -820, 2.2, 6);
        await k.say('bestFriend', teddy);

        // His turn: knock on Barney's door.
        await k.tapToHelp(knock, { ask: 'askKnock', nudge: 'nudgeKnock', helped: 'knockMyself', by: teddy, size: 150 });
        for (let i = 0; i < 3; i++) {
          k.fx.knock(1);
          await k.to(knock, 0.12, { rotation: -14, transformOrigin: '50% 10%', yoyo: true, repeat: 1 });
          await k.wait(160);
        }
        await k.wait(900);
        await k.all(k.say('anyoneHome', teddy), k.to(teddy, 0.5, { x: '-=20' }));
        // Nothing. A long quiet.
        await k.wait(1200);
        k.pose(teddy, 'sad');
        await k.wait(500);
        k.pose(teddy, 'cross');
        k.face(teddy, false);
        k.fx.stomp(2, 0.3);
        await k.say('notFair', teddy);

        // He marches away crossly, not looking where he's going.
        k.fx.stomp(4, 0.3);
        await k.all(k.say('shouldHave'), march(k, teddy, 760, 8));

        // On and on, into the wood.
        await k.cut(() => {
          k.backdrop('bear-wood');
          k.music('dreamy');
          cast.stone = k.add(stone(), { x: 680, y: 554, w: 240, z: 12 });
          cast.teddy = k.character('teddy', { x: 380, y: 417, w: 210, pose: 'cross', z: 13 });
          k.set(cast.teddy, { x: -640 });
        });
        const t = cast.teddy;
        k.fx.stomp(6, 0.3);
        await k.all(march(k, t, 640 + SITTING.x - 380, 6), k.wait(200).then(() => k.say('marchedAway')));
        k.pose(t, 'sad');
        // Up he hops and sits on the stone, as the narrator says how he feels.
        const sitDown = async (): Promise<void> => {
          k.fx.boing();
          await k.to(t, 0.25, { y: SITTING.y - 417 - 30, ease: 'power2.out' });
          k.fx.thud();
          await k.to(t, 0.2, { y: SITTING.y - 417, ease: 'power2.in' });
        };
        await k.all(sitDown(), k.wait(300).then(() => k.say('sadLonely')));
        sniffle();
        await k.wait(1000);
        await k.say('laughing');
        // Somebody laughing, off in the trees.
        k.pose(t, 'default');
        await noiseOff(k, { listeners: [t], sound: laugh });
      },
    },

    // ==================================================== 3. Ahoy, ship-mates!
    {
      name: 'Ahoy, ship-mates!',
      set(k) {
        k.backdrop('bear-wood');
        k.music('adventure');
        cast.stone = k.add(stone(), { x: 680, y: 554, w: 240, z: 12 });
        cast.teddy = k.character('teddy', { ...SITTING, z: 13 });
        cast.bill = k.character('uncle-bill', { x: 370, y: 350, w: 270, z: 11 });
        cast.basket = k.prop('picnic-basket', { x: 330, y: 572, w: 120, z: 14 });
        cast.bella = k.character('bella', { x: 30, y: 440, w: 190, z: 11 });
        cast.posy = k.character('posy', { x: 200, y: 440, w: 190, z: 12 });
        cast.bobby = k.character('bobby', { x: 780, y: 432, w: 200, flip: true, z: 11 });
        cast.hole = k.add(holeArt, { x: 925, y: 410, w: 120, h: 120, z: 9 });
        // Everyone but Teddy comes in later.
        k.set([cast.bill, cast.basket, cast.bella, cast.posy], { x: -700 });
        k.set(cast.bobby, { y: 80, opacity: 0 });
      },
      async play(k) {
        const { teddy, bill, basket, bella, posy, bobby, hole } = cast;
        laugh();
        await k.wait(300);
        // A loud, jolly voice Teddy knows well, coming through the trees.
        k.fx.patter(5, 0.2);
        void k.to(basket, 1.3, { x: 0, ease: 'power2.out' });
        await k.all(k.to(bill, 1.3, { x: 0, ease: 'power2.out' }), k.wait(400).then(() => k.say('shipmates', bill)));

        // Teddy jumps up and runs to him.
        k.pose(teddy, 'happy');
        k.fx.boing();
        await k.to(teddy, 0.35, { y: -40, ease: 'power2.out' });
        k.fx.patter(4, 0.12);
        await k.to(teddy, 0.5, { x: -90, y: 417 - SITTING.y, ease: 'power2.in' });
        k.face(teddy, true);
        await k.say('itsMe', teddy);
        k.pose(teddy, 'default');
        k.pose(bill, 'laugh');
        laugh();
        await k.say('scupper', bill);
        k.pose(bill, 'wave');

        // His friends come running.
        giggle();
        k.fx.patter(6, 0.14);
        await k.all(k.enter(bella, 'left', 0.9), k.wait(150).then(() => k.enter(posy, 'left', 0.9)));
        k.pose(bill, 'default');
        k.pose(posy, 'happy');
        await k.say('treasureHunt', posy);
        k.pose(posy, 'default');
        k.pose(bella, 'happy');
        await k.say('picnicFirst', bella);
        k.pose(bella, 'default');

        // His turn: drag the picnic basket over to the stone.
        const set = await k.dragToHelp(basket, { to: [850, 590], ask: 'askBasket', nudge: 'nudgeBasket', helped: 'carryBasket', by: bella, dropSize: 170 });
        if (set === 'dragged') await k.say('thanksBasket', bella);
        await k.say('mummyMind', teddy);
        await k.blink(bill);
        await k.say('findOut', bill);

        // The first clue, in the hollow tree.
        k.face(teddy, false);
        await k.tapToHelp(hole, { ask: 'askHole', nudge: 'nudgeHole', helped: 'fishItOut', by: bill, size: 140 });
        // Out pops a rolled-up map, into Teddy's paws.
        const roll = k.add(mapRoll(), { x: 950, y: 445, w: 70, z: 20 });
        k.set(roll, { scale: 0.2, opacity: 0 });
        k.fx.pop();
        await k.to(roll, 0.3, { scale: 1, opacity: 1 });
        k.fx.whizz();
        await k.to(roll, 0.7, { x: -200, y: 100, rotation: -360, ease: 'power1.out' });
        // It opens out, big enough to read.
        k.sfx.page();
        void k.vanish(roll, 0.3);
        const map = k.add(treasureMap(), { x: 420, y: 70, w: 340, z: 30 });
        k.set(map, { opacity: 0, scale: 0.4 });
        await k.to(map, 0.6, { opacity: 1, scale: 1, ease: 'back.out(1.4)' });
        quack();
        await k.say('readMap', bill);
        await k.say('whereDucks', teddy);
        k.pose(bill, 'laugh');
        await k.say('soonEnough', bill);
        k.pose(bill, 'default');
        k.sfx.page();
        await k.vanish(map, 0.4);

        // Posy and Bella skip on ahead.
        k.face(posy, true);
        k.face(bella, true);
        giggle();
        k.fx.patter(6, 0.14);
        await k.all(k.exit(bella, 'left', 0.8), k.wait(150).then(() => k.exit(posy, 'left', 0.8)));

        // Boo! Bobby pops up from behind the stone.
        k.fx.boing();
        k.face(teddy, false);
        await k.to(bobby, 0.5, { y: 0, opacity: 1, ease: 'back.out(1.6)' });
        k.pose(bobby, 'happy');
        await k.all(k.shake(teddy, 6, 2), k.say('boo', bobby));
        giggle();
        k.pose(bobby, 'default');
        await k.say('raceYou', bobby);
        // Off he runs, and Teddy after him.
        k.face(bobby, false);
        k.fx.patter(6, 0.12);
        await k.exit(bobby, 'right', 0.7);
        giggle();
        k.fx.patter(6, 0.12);
        laugh();
        await k.all(k.exit(teddy, 'right', 0.8), k.wait(200).then(() => k.hop(bill, 20)));
      },
    },

    // ==================================================== 4. The best surprise
    {
      name: 'The best surprise',
      set(k) {
        k.backdrop('bear-green');
        k.music('adventure');
        cast.chest = k.prop('treasure-chest', { x: 600, y: 548, w: 160, z: 13 });
        cast.duck = k.prop('duck', { x: 1100, y: 500, w: 70, z: 8 });
        cast.bill = k.character('uncle-bill', { x: 440, y: 326, w: 260, z: 9 });
        cast.teddy = k.character('teddy', { x: 250, y: 412, w: 210, z: 11 });
        cast.bobby = k.character('bobby', { x: 30, y: 412, w: 210, z: 12 });
        cast.mummy = k.character('mummy-bear', { x: 10, y: 347, w: 270, pose: 'hold', z: 12 });
        cast.plate = k.prop('cake-plate', { x: 75, y: 545, w: 140, z: 14 });
        k.set([cast.bill, cast.teddy, cast.bobby], { x: -720 });
        k.set([cast.mummy, cast.plate], { x: -420 });
      },
      async play(k) {
        const { teddy, bill, bobby, mummy, plate, chest, duck } = cast;
        // Out of the trees and into the sunshine.
        k.fx.patter(8, 0.12);
        await k.all(
          k.to(teddy, 1.1, { x: 0, ease: 'power2.out' }),
          k.wait(250).then(() => k.to(bobby, 1.1, { x: 0, ease: 'power2.out' })),
          k.wait(400).then(() => k.to(bill, 1.1, { x: 0, ease: 'power2.out' })),
        );
        // Teddy looks all round: the pond, the swing, the well.
        quack();
        void k.to(duck, 3, { x: -80, ease: 'sine.inOut' });
        await k.all(k.say('pondSwing', teddy), k.camera({ zoom: 1.2, x: 740, y: 460 }, 1.3));
        await k.camera({}, 1.1);
        // …and turns round: his own cottage, across the path.
        k.face(teddy, true);
        k.fx.twinkle();
        await k.shake(teddy, 6, 2);
        k.pose(teddy, 'happy');
        await k.say('myHouse', teddy);
        k.pose(teddy, 'default');
        k.pose(bobby, 'happy');
        await k.say('funNow', bobby);
        k.pose(bobby, 'default');
        k.face(bobby, true);
        k.fx.patter(5, 0.12);
        await k.exit(bobby, 'left', 0.7);

        // Mummy comes over with a plate of cherry buns.
        k.fx.creak();
        k.fx.patter(5, 0.18);
        await k.all(k.to(mummy, 1.3, { x: 0, ease: 'sine.out' }), k.to(plate, 1.3, { x: 0, ease: 'sine.out' }));
        await k.say('newFriends', mummy);
        void k.blink(mummy);
        await k.all(k.say('youDid', teddy), k.wait(200));
        await k.hop(teddy, 30);
        k.face(teddy, false);
        quack();
        await k.say('duckPond', teddy);

        // His turn: open the treasure chest.
        const how = await k.tapToHelp(chest, { ask: 'askChest', nudge: 'nudgeChest', helped: 'heaveHo', by: teddy, helper: bill, size: 170 });
        const lid = k.pivot(k.part(chest, 'lid'));
        k.fx.creak();
        await k.to(lid, 0.6, { rotation: -70, ease: 'back.out(1.4)' });
        await k.fade(k.part(chest, 'gold'), 1, 0.4);
        k.sparkle(680, 560, 18, 200);
        k.sfx.success();
        await k.wait(300);
        await k.say('honeySweets', bill);
        yum();
        k.pose(teddy, 'happy');
        await k.say(how === 'tapped' ? 'thanksName' : 'thanksBill', teddy);
        k.pose(teddy, 'default');

        // All the places he loves.
        quack();
        k.face(teddy, true);
        await k.say('bestOfAll', teddy);
        k.pose(bill, 'laugh');
        laugh();
        await k.shake(bill, 4, 3);
        k.pose(teddy, 'happy');
        void k.wait(220).then(() => k.hop(plate, 30, 3));
        await warmEnding(k, { cast: [teddy, mummy, bill], end: 'end', sparkleAt: [400, 300], hold: 700 });
      },
    },
  ],
});
