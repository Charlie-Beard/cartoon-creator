/**
 * Teddy and the Three Bears: Teddy wants honey, not porridge, until he hears
 * that someone might come along and eat his porridge for him.
 *
 * From "The Three Bears" in the family's 1994 Teddy Bear book.
 *
 *   1. Breakfast. Bear Cottage's kitchen on a cold morning. Teddy loves honey
 *      on hot toast, but Mummy is making porridge. "Can't I have honey?"
 *      Porridge is good for you on cold mornings: come and stir the oats.
 *      Teddy grumbles, and asks him to help. His turn: he taps the bowl and
 *      it goes round and round (or Teddy stirs it himself). Daddy lowers his
 *      newspaper: don't worry about eating it up, someone might come along
 *      and eat it for you. "Someone eating MY porridge?" That's what the
 *      other three bears thought. "What other bears? Tell me, Mummy!"
 *   2. Mummy's story. A dream cloud grows over Mummy's head, and inside it
 *      Teddy's own family play the three bears ("Just like us!"). Their
 *      porridge is too hot, so off they go for a walk. Along comes Goldilocks.
 *      Daddy Bear's porridge: too hot. Mummy Bear's: too cold. His turn: he
 *      taps the little bowl that was just right (or Teddy guesses it), and she
 *      gobbles it all up. The chairs: too hard, too soft, and Baby Bear's goes
 *      CRACK. Up she goes for a sleep. The cloud goes; their own porridge is
 *      poured, and it's too hot too. A walk to the edge of the wood. His turn:
 *      Mummy holds out Teddy's scarf and he drags it over to Teddy (or Mummy
 *      brings it herself), and on it goes.
 *   3. The edge of the wood. Mummy finishes the story: the bears came home,
 *      Goldilocks woke and ran away. Why did she go in? She smelt the
 *      porridge. "But it's only a story…" A rustle, sneaky music, something
 *      golden behind the big tree. His turn: he taps the tree (or Daddy calls
 *      "Who's there?"), and Goldilocks peeks out, giggles and skips off up the
 *      path towards the cottage. "My porridge!" Teddy runs home as fast as
 *      he can.
 *   4. Just right. Teddy bursts in, puffing. His porridge is still there, and
 *      now it's just right. He eats every bit. Mummy and Daddy arrive laughing:
 *      "Clever Teddy Bear!" His turn: he drags the honey pot from Mummy's
 *      paws to Teddy's bowl (or Mummy carries it), and a spoonful of honey
 *      goes on top. Goldilocks can
 *      have her own porridge. Golden curls at the window: she waves, Teddy
 *      waves back. From that day on, Teddy always ate up his porridge.
 *
 * The scary beat is gentle: curls bobbing behind a tree, sneaky music, and a
 * friendly face. The race home is funny, not frightening, and Goldilocks is
 * a cheeky little girl, never a villain. The cloud uses the world's
 * storyCloud piece; Goldilocks hides behind a copy of the wood's right-hand
 * trunk cut from the backdrop, so she can slide out from behind it.
 */
import { defineCartoon, noiseBurst, now, tone, type Kit } from '../../kit';
import { findBackdrop, findCharacter } from '../../worlds';
import { moves, sounds } from '../../worlds/bears/moves';
import { storyCloud } from '../../worlds/bears/pieces';
import { sounds as commonSounds } from '../../worlds/common/moves';
import { warmEnding } from '../../worlds/common/pieces';
import { bigChair, brokenChair, emptyBowl, honeyDollop, littleChair, newspaper, scarf, softChair, storyTable } from './art';
import meta from './meta';

const { scrape, yum } = sounds;
const { giggle, laugh, sniff, ting } = commonSounds;

// ---------------------------------------------------------------- sounds

/** Baby Bear's chair breaking: a sharp wooden crack and a clatter of bits (funny, not loud). */
function crack(): void {
  const t = now();
  noiseBurst(t, { freq: 2400, q: 1.2, peak: 0.14, attack: 0.002, decay: 0.1 });
  noiseBurst(t + 0.06, { freq: 1100, q: 1, peak: 0.09, attack: 0.002, decay: 0.16 });
  [0.22, 0.34, 0.43].forEach((dt, i) => tone(520 - i * 70, t + dt, { wave: 'triangle', peak: 0.05, decay: 0.08 }));
}

/** Teddy puffing after his run: three breathy puffs. */
function puffing(): void {
  const t = now();
  for (let i = 0; i < 3; i++) noiseBurst(t + i * 0.42, { freq: 900, type: 'lowpass', peak: 0.06, attack: 0.04, decay: 0.22 });
}

// ------------------------------------------------------------------ cast

type Who =
  | 'teddy' | 'mummy' | 'daddy' | 'goldi' | 'paper' | 'pan' | 'honey' | 'bowl'
  | 'cloud' | 'cDaddy' | 'cMummy' | 'cBaby' | 'table' | 'bowlD' | 'bowlM' | 'bowlB' | 'bowlBEmpty'
  | 'chairD' | 'chairM' | 'chairB' | 'chairBroken'
  | 'bowlD2' | 'bowlM2' | 'trunk' | 'tinyGoldi' | 'myBowl' | 'myBowlEmpty' | 'dollop';
const cast = {} as Record<Who, HTMLElement>;

/** Teddy's scarf, worn: drawn inside his actor, so it moves (and shrinks) with him and survives pose changes. */
function wearScarf(teddy: HTMLElement, show = true): HTMLElement {
  const d = document.createElement('div');
  d.innerHTML = scarf();
  Object.assign(d.style, { position: 'absolute', left: '23%', top: '47%', width: '54%', pointerEvents: 'none', opacity: show ? '1' : '0' });
  const s = d.querySelector('svg');
  if (s) Object.assign(s.style, { width: '100%', height: 'auto', display: 'block' });
  teddy.append(d);
  return d;
}

/** Where Teddy holds a bowl in front of his tummy, for a bowl of width w. */
function tummy(k: Kit, teddy: HTMLElement, w: number): { x: number; y: number } {
  const b = k.box(teddy);
  return { x: b.x + b.w / 2 - w / 2, y: b.y + b.h * 0.66 };
}

/** The kitchen, with Daddy in his armchair and his newspaper up (or down on his lap). */
function kitchen(k: Kit, paperUp: boolean): void {
  k.backdrop('bear-kitchen');
  cast.daddy = k.character('daddy-bear', { x: 677, y: 338, w: 240 });
  cast.paper = k.add(newspaper(), { x: 702, y: paperUp ? 452 : 505, w: 190, z: 12 });
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. Breakfast
    lovesHoney: { who: 'narrator', text: 'Teddy Bear loves honey on hot toast. But this morning, Mummy is making porridge.' },
    canIHave: { who: 'teddy', text: 'Oh, Mummy! Can’t I have honey?' },
    goodForYou: { who: 'mummy-bear', text: 'Porridge is good for you on cold mornings like this.' },
    stirOats: { who: 'mummy-bear', text: 'Come and stir the oats, Teddy. Round and round.' },
    notFair: { who: 'teddy', text: 'It’s not fair. I don’t even like porridge.' },
    askStir: { who: 'teddy', text: 'Will you help me stir, {name}? Tap the bowl!' },
    nudgeStir: { who: 'teddy', text: 'Tap my bowl, and round it goes!' },
    stirMyself: { who: 'teddy', text: 'Oh, all right. I’ll stir it myself.' },
    stirThanks: { who: 'mummy-bear', text: 'Lovely stirring! Thank you, {name}.' },
    stirTeddy: { who: 'mummy-bear', text: 'Lovely stirring, Teddy!' },
    eatItForYou: { who: 'daddy-bear', text: 'Don’t worry, Teddy. Someone might come along and eat it for you.' },
    dontBelieve: { who: 'teddy', text: 'Someone eating MY porridge? I don’t believe it!' },
    otherBears: { who: 'mummy-bear', text: 'That’s just what the other three bears thought.' },
    whatBears: { who: 'teddy', text: 'What other bears? Tell me, Mummy!' },
    // 2. Mummy's story
    onceUpon: { who: 'mummy-bear', text: 'Well. There was a Daddy Bear, a Mummy Bear and a Baby Bear.' },
    justLikeUs: { who: 'teddy', text: 'Just like us!' },
    tooHotWalk: { who: 'mummy-bear', text: 'Their porridge was too hot. So off they went for a walk.' },
    alongCame: { who: 'mummy-bear', text: 'Along came a little girl with golden curls. Goldilocks!' },
    daddysBowl: { who: 'mummy-bear', text: 'She tried Daddy Bear’s porridge. Too hot!' },
    mummysBowl: { who: 'mummy-bear', text: 'She tried Mummy Bear’s porridge. Too cold!' },
    babysBowl: { who: 'teddy', text: 'And Baby Bear’s?' },
    askBowl: { who: 'mummy-bear', text: '{name}, which one was just right? Tap the little bowl!' },
    nudgeBowl: { who: 'mummy-bear', text: 'The little bowl. Tap it!' },
    littleOne: { who: 'teddy', text: 'I know! The little one!' },
    justRight: { who: 'mummy-bear', text: 'Just right! And she ate it all up.' },
    chairs: { who: 'mummy-bear', text: 'Then she tried the chairs. Too hard! Too soft!' },
    crackChair: { who: 'mummy-bear', text: 'And Baby Bear’s chair went… CRACK!' },
    tooMuchPorridge: { who: 'daddy-bear', text: 'Too much porridge, I expect.' },
    upstairs: { who: 'mummy-bear', text: 'Then up she went for a sleep.' },
    walk: { who: 'daddy-bear', text: 'Ours is too hot as well! Let’s walk to the edge of the wood.' },
    scarfOn: { who: 'mummy-bear', text: 'Put your scarf on, Teddy. It’s chilly.' },
    askScarf: { who: 'mummy-bear', text: 'Can you drag the scarf to Teddy, {name}?' },
    nudgeScarf: { who: 'mummy-bear', text: 'Drag the scarf over to Teddy.' },
    scarfMyself: { who: 'mummy-bear', text: 'Never mind. I’ll bring it to you myself.' },
    scarfThanks: { who: 'teddy', text: 'Thank you, {name}! Now I’m snug as a bug.' },
    scarfThanksMummy: { who: 'teddy', text: 'Thank you, Mummy! Now I’m snug as a bug.' },
    // 3. The edge of the wood
    cameHome: { who: 'mummy-bear', text: 'The three bears came home and found her asleep. She woke up and ran away!' },
    whyGoIn: { who: 'teddy', text: 'But why did she go in?' },
    smelt: { who: 'mummy-bear', text: 'I think she smelt the porridge.' },
    onlyStory: { who: 'teddy', text: 'But it’s only a story…' },
    whatWasThat: { who: 'teddy', text: 'What was that? Something golden, behind the big tree!' },
    askTree: { who: 'teddy', text: '{name}, who’s behind that tree? Tap it!' },
    nudgeTree: { who: 'teddy', text: 'Tap the big tree!' },
    whosThere: { who: 'daddy-bear', text: 'Hello? Who’s there?' },
    goldenCurls: { who: 'teddy', text: 'Golden curls! It’s Goldilocks!' },
    ourHouse: { who: 'teddy', text: 'She’s going to our house! My porridge!' },
    myPorridge: { who: 'teddy', text: 'Come on! Let’s go home!' },
    // 4. Just right
    stillThere: { who: 'teddy', text: 'Puff, puff… It’s still there! My porridge is safe!' },
    nowJustRight: { who: 'teddy', text: 'And it’s not too hot now. It’s just right!' },
    everyBit: { who: 'daddy-bear', text: 'Well, I never! Every last bit!' },
    clever: { who: 'mummy-bear', text: 'Clever Teddy Bear! That deserves a spoonful of honey, on top.' },
    askHoney: { who: 'mummy-bear', text: 'Can you drag the honey to Teddy’s bowl, {name}?' },
    nudgeHoney: { who: 'mummy-bear', text: 'Drag the honey pot to the bowl.' },
    honeyMyself: { who: 'mummy-bear', text: 'Here we are. I’ll carry it over myself.' },
    afterAll: { who: 'teddy', text: 'Mmm! I got my honey after all!' },
    ownPorridge: { who: 'teddy', text: 'Goldilocks can have her own porridge. This one’s mine!' },
    window: { who: 'mummy-bear', text: 'Look, Teddy. Who’s that at the window?' },
    byeGoldi: { who: 'teddy', text: 'Hello, Goldilocks! Bye-bye, {name}!' },
    end: { who: 'narrator', text: 'And from that day on, Teddy always ate up his porridge. Just in case!' },
  },
  scenes: [
    // ==================================================== 1. Breakfast
    {
      name: 'Breakfast',
      set(k) {
        kitchen(k, true);
        k.music('cosy');
        cast.pan = k.prop('saucepan', { x: 85, y: 376, w: 170 });
        cast.honey = k.prop('honey-pot', { x: 990, y: 412, w: 100 });
        cast.mummy = k.character('mummy-bear', { x: 215, y: 312, w: 290 });
        cast.teddy = k.character('teddy', { x: 495, y: 402, w: 210 });
        const at = tummy(k, cast.teddy, 140);
        cast.bowl = k.prop('porridge-bowl', { x: at.x, y: at.y, w: 140, z: 12 });
      },
      async play(k) {
        const { teddy, mummy, daddy, paper, pan, bowl } = cast;
        await k.wait(400);
        k.sparkle(1040, 450, 10, 90);
        k.fx.twinkle();
        await k.all(k.say('lovesHoney'), k.wait(2600).then(() => { scrape(2); return k.fade(k.part(pan, 'steam'), 1, 1); }));

        k.pose(teddy, 'sad');
        await k.say('canIHave', teddy);
        await k.say('goodForYou', mummy);
        await k.say('stirOats', mummy);
        sniff();
        await k.shake(teddy, 4, 2);
        await k.say('notFair', teddy);
        k.pose(teddy, 'default');
        await k.wait(300);

        // His turn: round and round goes the porridge.
        const how = await k.tapToHelp(bowl, { ask: 'askStir', nudge: 'nudgeStir', helped: 'stirMyself', by: teddy, size: 160 });
        scrape(4);
        await k.all(
          moves.stir(k, teddy, 4, 'armR'),
          k.to(bowl, 0.22, { rotation: 4, yoyo: true, repeat: 7, ease: 'sine.inOut' }),
        );
        k.set(bowl, { rotation: 0 });
        await k.fade(k.part(bowl, 'steam'), 1, 0.8);
        await k.say(how === 'tapped' ? 'stirThanks' : 'stirTeddy', mummy);

        k.pose(teddy, 'sad');
        // Daddy lowers his newspaper.
        k.sfx.rustle();
        await k.to(paper, 0.7, { y: 53 });
        await k.say('eatItForYou', daddy);
        await k.wait(500);
        k.pose(teddy, 'default');
        k.fx.boing();
        await k.shake(teddy, 7, 2);
        await k.say('dontBelieve', teddy);
        await k.say('otherBears', mummy);
        k.pose(teddy, 'happy');
        await k.all(k.say('whatBears', teddy), k.wait(200));
        await k.hop(teddy, 30);
      },
    },

    // ==================================================== 2. Mummy's story
    {
      name: 'Mummy’s story',
      set(k) {
        kitchen(k, false);
        k.music('dreamy');
        cast.mummy = k.character('mummy-bear', { x: 100, y: 323, w: 280 });
        cast.teddy = k.character('teddy', { x: 480, y: 414, w: 200, pose: 'sit' });
        cast.cloud = storyCloud.set(k, { x: 370, y: 0 }).cloud;
        cast.cloud.style.zIndex = '20';
        // Inside the cloud (its white middle is x 440–820, y 70–260 on stage).
        // The three bears in the story are pictures in Mummy's head, not actors
        // on the stage, so they are drawn from the portraits with k.add.
        const picture = (id: string): string => findCharacter(id)?.art() ?? '';
        cast.cDaddy = k.add(picture('daddy-bear'), { x: 470, y: 140, w: 100, z: 21 });
        cast.cMummy = k.add(picture('mummy-bear'), { x: 585, y: 140, w: 100, z: 21 });
        cast.cBaby = k.add(picture('teddy'), { x: 705, y: 162, w: 80, z: 21 });
        cast.goldi = k.character('goldilocks', { x: 585, y: 100, w: 110, z: 21 });
        cast.table = k.add(storyTable(), { x: 450, y: 236, w: 360, z: 22 });
        cast.bowlD = k.prop('porridge-bowl', { x: 470, y: 192, w: 100, z: 23 });
        cast.bowlM = k.prop('porridge-bowl', { x: 600, y: 200, w: 85, z: 23 });
        cast.bowlB = k.prop('porridge-bowl', { x: 718, y: 208, w: 70, z: 23 });
        cast.bowlBEmpty = k.add(emptyBowl(), { x: 718, y: 208, w: 70, z: 23 });
        cast.chairD = k.add(bigChair(), { x: 480, y: 128, w: 80, z: 22 });
        cast.chairM = k.add(softChair(), { x: 592, y: 158, w: 100, z: 22 });
        cast.chairB = k.add(littleChair(), { x: 718, y: 172, w: 60, z: 22 });
        cast.chairBroken = k.add(brokenChair(), { x: 700, y: 196, w: 100, z: 22 });
        for (const el of [cast.cDaddy, cast.cMummy, cast.cBaby, cast.goldi, cast.table, cast.bowlD, cast.bowlM, cast.bowlB, cast.bowlBEmpty, cast.chairD, cast.chairM, cast.chairB, cast.chairBroken]) {
          k.set(el, { opacity: 0 });
        }
        // Our own porridge, poured at the end, on the kitchen table.
        cast.bowlD2 = k.prop('porridge-bowl', { x: 938, y: 452, w: 110 });
        cast.bowlM2 = k.prop('porridge-bowl', { x: 1052, y: 460, w: 95 });
        cast.myBowl = k.prop('porridge-bowl', { x: 990, y: 478, w: 85, z: 12 });
        for (const el of [cast.bowlD2, cast.bowlM2, cast.myBowl]) k.set(el, { opacity: 0 });
      },
      async play(k) {
        const { teddy, mummy, daddy, cloud, cDaddy, cMummy, cBaby, goldi, table, bowlD, bowlM, bowlB, bowlBEmpty, chairD, chairM, chairB, chairBroken } = cast;
        await k.wait(300);
        await storyCloud.open(k, { cloud });
        // Teddy's own family play the three bears.
        const bears = [cDaddy, cMummy, cBaby];
        await k.all(
          k.say('onceUpon', mummy),
          (async () => {
            for (const b of bears) {
              await k.wait(700);
              k.fx.pop();
              await k.appear(b, 0.4);
            }
          })(),
        );
        giggle();
        await k.all(k.say('justLikeUs', teddy), k.wait(100));

        // Too hot: off they go for a walk.
        k.fx.twinkle();
        await k.all(k.appear(table, 0.4), k.appear(bowlD, 0.4), k.appear(bowlM, 0.4), k.appear(bowlB, 0.4));
        for (const b of [bowlD, bowlM, bowlB]) void k.fade(k.part(b, 'steam'), 1, 0.6);
        await k.all(
          k.say('tooHotWalk', mummy),
          (async () => {
            await k.wait(1400);
            k.fx.patter(5, 0.14);
            await k.all(...bears.map((b) => k.to(b, 1.2, { x: '+=70', opacity: 0, ease: 'power1.in' })));
          })(),
        );

        // Along comes Goldilocks.
        k.fx.twinkle();
        await k.appear(goldi, 0.5);
        await k.say('alongCame', mummy);
        // Daddy Bear's: too hot.
        await k.to(goldi, 0.7, { x: -95, ease: 'sine.inOut' });
        sniff();
        await k.all(k.say('daddysBowl', mummy), k.wait(1600).then(() => k.shake(goldi, 6, 2)));
        // Mummy Bear's: too cold.
        k.fx.patter(2, 0.14);
        await k.to(goldi, 0.6, { x: 0, ease: 'sine.inOut' });
        void k.fade(k.part(bowlM, 'steam'), 0, 0.4);
        await k.all(k.say('mummysBowl', mummy), k.wait(1600).then(() => k.shake(goldi, 3, 4)));
        await k.say('babysBowl', teddy);

        // His turn: the little bowl was just right.
        await k.tapToHelp(bowlB, { ask: 'askBowl', nudge: 'nudgeBowl', helped: 'littleOne', by: mummy, helper: teddy, size: 130 });
        k.fx.patter(2, 0.14);
        await k.to(goldi, 0.6, { x: 108, ease: 'sine.inOut' });
        scrape(3);
        await k.all(k.shake(goldi, 3, 3), k.wait(900));
        yum();
        k.set(bowlBEmpty, { opacity: 1 });
        await k.fade(bowlB, 0, 0.4);
        await k.say('justRight', mummy);

        // The chairs: too hard, too soft, and CRACK.
        k.fx.poof();
        await k.all(...[table, bowlD, bowlM, bowlBEmpty].map((el) => k.fade(el, 0, 0.4)), k.fade(goldi, 0, 0.4));
        k.fx.twinkle();
        await k.all(k.appear(chairD, 0.4), k.appear(chairM, 0.4), k.appear(chairB, 0.4));
        k.set(goldi, { x: -105, y: -24, zIndex: 24 });
        await k.fade(goldi, 1, 0.3);
        await k.all(
          k.say('chairs', mummy),
          (async () => {
            await k.wait(1500);
            k.fx.thud();
            await k.pop(goldi, 1.06);
            await k.wait(400);
            k.fx.boing();
            await k.to(goldi, 0.5, { x: 0, y: -4 });
            await k.to(goldi, 0.4, { y: 12, ease: 'sine.out' });
          })(),
        );
        k.fx.boing();
        await k.to(goldi, 0.6, { x: 112, y: -12 });
        await k.say('crackChair', mummy);
        crack();
        k.puff(748, 240, 80, '#e9dcc4');
        k.set(chairBroken, { opacity: 1 });
        k.set(chairB, { opacity: 0 });
        await k.to(goldi, 0.25, { y: 30, ease: 'power2.in' });
        await k.shake(goldi, 4, 2);
        laugh();
        await k.say('tooMuchPorridge', daddy);
        await k.say('upstairs', mummy);
        await k.to(goldi, 1.2, { y: -60, opacity: 0, ease: 'sine.in' });
        await storyCloud.close(k, { cloud }, { inside: [chairD, chairM, chairBroken] });

        // Our own porridge: too hot as well.
        k.fx.pop();
        await k.all(k.appear(cast.bowlD2, 0.3), k.wait(150).then(() => k.appear(cast.bowlM2, 0.3)), k.wait(300).then(() => k.appear(cast.myBowl, 0.3)));
        for (const b of [cast.bowlD2, cast.bowlM2, cast.myBowl]) void k.fade(k.part(b, 'steam'), 1, 0.6);
        await k.say('walk', daddy);
        k.pose(teddy, 'default');
        k.fx.boing();
        await k.hop(teddy, 20);
        await k.say('scarfOn', mummy);
        // His turn: Mummy holds the scarf out, and he drags it to Teddy.
        const loose = k.add(scarf(), { x: 165, y: 540, w: 150, z: 15 });
        k.fx.twinkle();
        await k.appear(loose, 0.4);
        const got = await k.dragToHelp(loose, { to: teddy, ask: 'askScarf', nudge: 'nudgeScarf', helped: 'scarfMyself', by: mummy, dropSize: 200 });
        // On goes the scarf.
        const s = wearScarf(teddy, false);
        k.fx.whizz();
        await k.all(k.to(s, 0.5, { opacity: 1 }), k.fade(loose, 0, 0.4));
        k.remove(loose);
        await k.say(got === 'dragged' ? 'scarfThanks' : 'scarfThanksMummy', teddy);
        k.pose(teddy, 'happy');
        await k.hop(teddy, 26);
      },
    },

    // ==================================================== 3. The edge of the wood
    {
      name: 'The edge of the wood',
      set(k) {
        k.backdrop('bear-wood');
        k.music('adventure');
        cast.daddy = k.character('daddy-bear', { x: 110, y: 355, w: 260 });
        cast.mummy = k.character('mummy-bear', { x: 335, y: 355, w: 260 });
        cast.teddy = k.character('teddy', { x: 640, y: 435, w: 190 });
        wearScarf(cast.teddy);
        for (const el of [cast.daddy, cast.mummy, cast.teddy]) k.set(el, { x: -900 });
        // Goldilocks peeks round the right-hand trunk: she stands behind a copy
        // of the trunk cut from the backdrop, so she can slide out from it.
        cast.goldi = k.character('goldilocks', { x: 783, y: 433, w: 200, pose: 'peek', flip: true, z: 12 });
        k.set(cast.goldi, { x: 150 });
        const wood = findBackdrop('bear-wood', 'bears')?.art() ?? '';
        cast.trunk = k.add(wood, { x: 900, y: 160, w: 190, h: 540, crop: '900 160 190 540', z: 15 });
        // Actors' SVGs draw outside their box (overflow: visible); this copy must stop at the crop.
        const trunkSvg = cast.trunk.querySelector('svg');
        if (trunkSvg) trunkSvg.style.overflow = 'hidden';
        cast.tinyGoldi = k.character('goldilocks', { x: 700, y: 386, w: 44, z: 9 });
        k.set(cast.tinyGoldi, { opacity: 0 });
      },
      async play(k) {
        const { teddy, mummy, daddy, goldi, trunk, tinyGoldi } = cast;
        // In they walk, along the path.
        k.fx.wind(2);
        k.fx.patter(8, 0.18);
        await k.all(k.walk(teddy, 900, 2.4, 6), k.wait(250).then(() => k.walk(mummy, 900, 2.4, 6)), k.wait(500).then(() => k.walk(daddy, 900, 2.4, 6)));
        await k.say('cameHome', mummy);
        await k.say('whyGoIn', teddy);
        sniff();
        await k.say('smelt', mummy);
        await k.say('onlyStory', teddy);

        // A rustle, and something golden bobs behind the tree.
        k.silence();
        await k.wait(500);
        k.sfx.rustle();
        await k.to(goldi, 0.6, { x: 60, ease: 'sine.inOut' });
        await k.to(goldi, 0.6, { x: 150, ease: 'sine.inOut' });
        k.music('sneaky');
        await k.shake(teddy, 5, 2);
        await k.say('whatWasThat', teddy);
        k.sfx.rustle();
        await k.to(goldi, 0.6, { x: 60, ease: 'sine.inOut' });
        await k.to(goldi, 0.6, { x: 85, ease: 'sine.inOut' });
        await k.wait(400);

        // His turn: who's behind the tree?
        await k.tapToHelp(trunk, { ask: 'askTree', nudge: 'nudgeTree', helped: 'whosThere', by: teddy, helper: daddy, size: 220 });
        k.fx.pop();
        await k.to(goldi, 0.7, { x: 0, ease: 'back.out(1.4)' });
        giggle();
        await k.all(k.shake(goldi, 3, 3), k.wait(300).then(() => k.say('goldenCurls', teddy)));
        // Off she skips, up the path towards the cottage.
        k.fx.patter(3, 0.12);
        await k.to(goldi, 0.6, { x: 170, ease: 'power1.in' });
        k.set(goldi, { opacity: 0 });
        k.fx.patter(6, 0.16);
        await k.fade(tinyGoldi, 1, 0.3);
        await k.to(tinyGoldi, 1.6, { x: -40, y: -14, ease: 'sine.inOut' });
        await k.fade(tinyGoldi, 0, 0.4);

        k.music('adventure');
        k.pose(teddy, 'cross');
        await k.say('ourHouse', teddy);
        await k.say('myPorridge', teddy);
        // Off runs Teddy, up the path, as fast as he can.
        k.pose(teddy, 'default');
        k.fx.patter(10, 0.1);
        k.set(teddy, { transformOrigin: '50% 100%', zIndex: 8 });
        await k.to(teddy, 1.6, { x: -105, y: -225, scale: 0.18, ease: 'power1.in' });
        await k.fade(teddy, 0, 0.3);
        laugh();
        await k.all(k.hop(mummy, 16), k.wait(150).then(() => k.hop(daddy, 16)));
      },
    },

    // ==================================================== 4. Just right
    {
      name: 'Just right',
      set(k) {
        kitchen(k, false);
        k.music('cosy');
        // Nobody in the armchair yet: Daddy is still walking home.
        k.remove(cast.daddy);
        k.remove(cast.paper);
        cast.bowlD = k.prop('porridge-bowl', { x: 938, y: 452, w: 110 });
        cast.bowlM = k.prop('porridge-bowl', { x: 1052, y: 460, w: 95 });
        cast.myBowl = k.prop('porridge-bowl', { x: 990, y: 478, w: 85, z: 12 });
        cast.teddy = k.character('teddy', { x: 700, y: 402, w: 210, z: 11 });
        wearScarf(cast.teddy);
        const at = tummy(k, cast.teddy, 85);
        k.set(cast.teddy, { x: -1000 });
        cast.myBowlEmpty = k.add(emptyBowl(), { x: at.x, y: at.y, w: 85, z: 12 });
        k.set(cast.myBowlEmpty, { opacity: 0 });
        cast.dollop = k.add(honeyDollop(), { x: at.x + 20, y: at.y + 8, w: 45, z: 13 });
        k.set(cast.dollop, { opacity: 0 });
        // Mummy and Daddy come home after him (Daddy's armchair stays empty).
        cast.daddy = k.character('daddy-bear', { x: 40, y: 345, w: 260 });
        cast.mummy = k.character('mummy-bear', { x: 255, y: 355, w: 250, pose: 'hold' });
        cast.honey = k.prop('honey-pot', { x: 330, y: 525, w: 100, z: 12 });
        for (const el of [cast.daddy, cast.mummy, cast.honey]) k.set(el, { x: -700 });
        // Golden curls at the window, cut off at the sill.
        cast.goldi = k.character('goldilocks', { x: 470, y: 250, w: 140, z: 5 });
        cast.goldi.style.clipPath = 'inset(0 0 23% 0)';
        k.set(cast.goldi, { opacity: 0 });
      },
      async play(k) {
        const { teddy, mummy, daddy, honey, goldi, myBowl, myBowlEmpty, dollop } = cast;
        // Teddy bursts in, puffing.
        k.fx.creak();
        k.fx.patter(8, 0.1);
        await k.to(teddy, 1.1, { x: 0, ease: 'power2.out' });
        puffing();
        await k.shake(teddy, 3, 3);
        await k.say('stillThere', teddy);
        // He picks up his bowl: just right now.
        const at = tummy(k, teddy, 85);
        await k.to(myBowl, 0.7, { x: at.x - 990, y: at.y - 478, ease: 'sine.inOut' });
        await k.say('nowJustRight', teddy);
        scrape(4);
        await k.all(k.to(myBowl, 0.2, { rotation: 5, yoyo: true, repeat: 5 }), k.wait(1300));
        k.set(myBowl, { rotation: 0 });
        yum();
        k.set(myBowlEmpty, { opacity: 1 });
        await k.fade(myBowl, 0, 0.4);
        k.pose(teddy, 'happy');
        await k.hop(teddy, 20);
        k.pose(teddy, 'default');

        // Mummy and Daddy arrive, laughing.
        laugh();
        k.fx.patter(6, 0.16);
        await k.to(daddy, 1.2, { x: 0, ease: 'power2.out' });
        k.fx.patter(5, 0.16);
        await k.all(k.to(mummy, 1.2, { x: 0, ease: 'power2.out' }), k.to(honey, 1.2, { x: 0, ease: 'power2.out' }));
        await k.say('everyBit', daddy);
        await k.say('clever', mummy);
        // His turn: a spoonful of honey, on top. He drags the pot from Mummy's paws to the bowl.
        const target = k.box(myBowlEmpty);
        k.set(honey, { zIndex: 14 });
        await k.dragToHelp(honey, { to: myBowlEmpty, ask: 'askHoney', nudge: 'nudgeHoney', helped: 'honeyMyself', by: mummy, dropSize: 200 });
        // Lift the pot up beside Teddy's face and tip.
        await k.to(honey, 0.5, { y: '-=70', ease: 'sine.inOut' });
        await k.to(honey, 0.4, { rotation: -40 });
        ting();
        await k.fade(dollop, 1, 0.5);
        await k.to(honey, 0.4, { rotation: 0 });
        await k.to(honey, 1, { x: 0, y: 0, ease: 'sine.inOut' });
        yum();
        k.pose(teddy, 'happy');
        await k.all(k.say('afterAll', teddy), k.wait(100));
        k.pose(teddy, 'default');
        await k.say('ownPorridge', teddy);
        // Teddy puts his bowl down on the table.
        await k.all(k.to(myBowlEmpty, 0.6, { x: 990 - target.x, y: 478 - target.y }), k.to(dollop, 0.6, { x: 990 - target.x, y: 478 - target.y }));

        // Golden curls at the window.
        k.fx.knock(2);
        await k.fade(goldi, 1, 0.8);
        await k.say('window', mummy);
        giggle();
        k.pose(goldi, 'wave');
        await k.shake(goldi, 3, 2);
        k.pose(teddy, 'wave');
        await k.say('byeGoldi', teddy);
        await k.wait(400);
        await k.fade(goldi, 0, 0.8);
        k.pose(teddy, 'default');
        await warmEnding(k, { cast: [teddy, mummy, daddy], end: 'end' });
      },
    },
  ],
});
