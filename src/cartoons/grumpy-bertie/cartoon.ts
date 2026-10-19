/**
 * Grumpy Bertie Bear: the second story in the Teddy Bear Treasury (Brown
 * Watson, 1994), told as a cartoon. Teddy and Daddy find a soaked, grumpy
 * bear in the woods; his girl doesn't want him any more, but a kind old
 * lady does, and at last he says thank you.
 *
 *   1. Atishoo! The woods in the rain, Daddy and Teddy under the striped
 *      umbrella. Too wet to go far… "Listen! I heard a voice!" Atishoo! A
 *      sneeze from the bushes. His first turn: he taps the bush that
 *      sneezed, and up pops a soaked bear: "The name's Bertie." Daddy:
 *      you'd best come home with us.
 *   2. Daddy's chair. The cottage parlour: Bertie in Daddy's chair, in
 *      Teddy's dressing gown, with hot chocolate. He belongs to a girl
 *      called Lavinia, and her house is much bigger than this! (Mummy is
 *      polite.) She went picking flowers, got caught in the rain and ran
 *      home; she'd never leave him behind on purpose. Daddy: dry clothes,
 *      then back to the woods. Maybe Lavinia will be looking for him.
 *   3. Not my colour. Teddy brings trousers, a woolly jumper, even shoes
 *      and socks. His second turn: he taps the green jumper and it goes on
 *      Bertie. "Not really my colour." Lavinia threw out trousers much
 *      better than these! Still, better than nothing. Teddy, to him: what a
 *      grumpy old bear, he hasn't even said thank you! The sun's out: back
 *      to the woods.
 *   4. Back to the woods. Bertie sits by the path; Teddy and Daddy hide in
 *      the bushes to see if Lavinia comes. A little old lady walks by, but
 *      she doesn't see Bertie. His third turn: he taps Bertie, who sneezes,
 *      and she turns: bless you! She calls Lavinia: isn't this the bear you
 *      lost? Lavinia, with her new doll: "What, that old thing?" and off she
 *      skips. Bertie looks as if he might cry.
 *   5. Loved again. The old lady picks him up:
 *      he reminds her of the teddy she had as a girl. Would he like to come
 *      home with her, for her grandchildren to play with? Bertie's face
 *      lights up, and before she carries him off he whispers to Teddy:
 *      thank you! Teddy wonders if Bertie will call at their cottage again.
 *
 * In this world the bears are toys to the humans: they talk only among
 * themselves, so Bertie never answers the old lady out loud, and Teddy and
 * Daddy keep out of sight while she and Lavinia are there. His sneeze is
 * the one sound she hears (a toy can't help a sneeze): she only knows
 * something made a noise, and finds a teddy bear. Lavinia is
 * careless rather than cruel (the book's "somebody must have thrown him
 * away" is left out), and the sadness lasts two lines before the kindness.
 */
import { defineCartoon, type Kit } from '../../kit';
import { moves, sounds as bear } from '../../worlds/bears/moves';
import { sounds } from '../../worlds/common/moves';
import meta from './meta';

const { pour, giggle } = sounds;
const { sneeze, sigh, sip } = bear;

// ------------------------------------------------------------------ cast

type Actor = 'teddy' | 'daddy' | 'mummy' | 'bertie' | 'bush' | 'umbrella' | 'chair' | 'mug' | 'jumper' | 'aunt' | 'lavinia' | 'hide';
const cast = {} as Record<Actor, HTMLElement>;

/** The parlour with Daddy's chair, Bertie in it in Teddy's dressing gown. */
function parlour<K extends string>(k: Kit<K>): void {
  k.backdrop('bear-parlour');
  cast.chair = k.prop('armchair', { x: 420, y: 370, w: 320, z: 10 });
  cast.bertie = k.character('bertie', { x: 480, y: 400, w: 200, z: 11, pose: 'gown' });
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. Atishoo!
    woods: { who: 'narrator', text: 'Near Teddy Bear’s cottage there are some lovely woods.' },
    tooWet: { who: 'daddyBear', text: 'We’ve had a lot of rain lately, Teddy. It’s too wet to go far, so I think…' },
    listen: { who: 'teddy', text: 'Listen, Daddy! I’m sure I heard a voice!' },
    atishoo: { who: 'bertie', text: 'ATISHOO! Oh dear, oh dear! I feel so dreadful!' },
    askBush: { who: 'teddy', text: 'It came from the bushes. {name}, can you find him? Tap the bush that sneezed!' },
    nudgeBush: { who: 'teddy', text: 'Tap the big bush, {name}!' },
    helpedBush: { who: 'daddyBear', text: 'Let’s look just under this clump of bushes.' },
    foundHim: { who: 'teddy', text: 'You found him, {name}!' },
    whoAreYou: { who: 'teddy', text: 'Hello! Who are you?' },
    bertie: { who: 'bertie', text: 'The name’s Bertie. Atishoo! Ooh, I’m soaked to the skin!' },
    comeHome: { who: 'daddyBear', text: 'You’d best come home with us, Bertie. Take his arm, Teddy.' },
    // 2. Daddy's chair
    beforeLong: { who: 'narrator', text: 'Soon Bertie was in Daddy’s chair, in Teddy’s dressing gown, with a hot chocolate.' },
    lavinia: { who: 'bertie', text: 'I belong to a girl called Lavinia. Our house is much bigger than this!' },
    lovely: { who: 'mummyBear', text: 'Well! We think our little cottage is lovely, dear.' },
    howLeft: { who: 'teddy', text: 'How did you come to be left in the woods, Bertie?' },
    pickingFlowers: { who: 'bertie', text: 'Lavinia went off picking flowers. She got caught in the rain and ran straight home.' },
    onPurpose: { who: 'bertie', text: 'She would never have left me behind on purpose.' },
    ofCourseNot: { who: 'daddyBear', text: 'Of course not. Dry clothes first, then back to the woods. Maybe Lavinia will be looking for you.' },
    // 3. Not my colour
    foundClothes: { who: 'teddy', text: 'I found you a woolly jumper and some trousers, Bertie!' },
    askJumper: { who: 'teddy', text: 'Help Bertie put the jumper on, {name}! Tap the jumper!' },
    nudgeJumper: { who: 'teddy', text: 'Just tap the green jumper!' },
    helpedJumper: { who: 'mummyBear', text: 'Here, Bertie. Arms up, dear!' },
    notMyColour: { who: 'bertie', text: 'Hmm. Not really my colour.' },
    betterTrousers: { who: 'bertie', text: 'And Lavinia threw out a pair of trousers much better than these!' },
    betterThanNothing: { who: 'bertie', text: 'Still, they’re better than nothing. I’ll get new clothes when I’m home.' },
    noThankYou: { who: 'teddy', text: 'Psst, {name}! What a grumpy old bear. He hasn’t even said thank you!' },
    sunOut: { who: 'mummyBear', text: 'Look, the sun’s out! Back to the woods, everyone.' },
    // 4. Back to the woods
    waited: { who: 'narrator', text: 'Bertie’s own jacket was dry now. He sat by the path, and Teddy and Daddy hid to watch.' },
    someone: { who: 'teddy', text: 'Someone’s coming! But she hasn’t seen Bertie!' },
    askBertie: { who: 'teddy', text: '{name}, tap Bertie, quick! Then she’ll look!' },
    nudgeBertie: { who: 'teddy', text: 'Tap Bertie, {name}!' },
    helpedBertie: { who: 'bertie', text: 'Ah… ah… ATISHOO!' },
    atishooAgain: { who: 'bertie', text: 'Ah… ah… ATISHOO!' },
    heardHim: { who: 'teddy', text: 'She heard him, {name}! She’s looking!' },
    blessYou: { who: 'greatAunt', text: 'Oh! What was that? Why, it’s a teddy bear! Lavinia, dear, come here a minute!' },
    lostBear: { who: 'greatAunt', text: 'Isn’t this the bear you lost the other day?' },
    thatOldThing: { who: 'lavinia', text: 'What, that old thing, Auntie? I’ve got my new doll now!' },
    nearlyCry: { who: 'narrator', text: 'Bertie looked as if he were about to cry.' },
    remindMe: { who: 'greatAunt', text: 'Do you know, you remind me of the teddy I had when I was a girl.' },
    comeHomeWithMe: { who: 'greatAunt', text: 'Will you come home with me? My grandchildren would love to play with you.' },
    shining: { who: 'narrator', text: 'Bertie’s black eyes shone like new. He was loved again.' },
    thankYouTeddy: { who: 'bertie', text: 'Psst! Thank you, Teddy. Thank you for everything!' },
    welcome: { who: 'teddy', text: 'Psst! You’re welcome, Bertie! Goodbye!' },
    thinking: { who: 'daddyBear', text: 'What are you thinking about, Teddy?' },
    callAgain: { who: 'teddy', text: 'I was just wondering if Bertie will call at our cottage again.' },
  },
  scenes: [
    // ===================================================== 1. Atishoo!
    {
      name: 'Atishoo!',
      set(k) {
        k.backdrop('bear-woods');
        k.music('cosy');
        k.dim(0.18, '#5d6b78');
        k.ambient('rain', { count: 60 });
        cast.daddy = k.character('daddyBear', { x: 60, y: 390, w: 260 });
        cast.teddy = k.character('teddy', { x: 290, y: 460, w: 200 });
        cast.umbrella = k.prop('umbrella', { x: 90, y: 150, w: 330, z: 12 });
        cast.bertie = k.character('bertie', { x: 760, y: 470, w: 190, pose: 'soaked', z: 9 });
        cast.bush = k.prop('bush', { x: 640, y: 450, w: 380, z: 10 });
        k.set(cast.bertie, { y: 60 });
      },
      async play(k) {
        const { daddy, teddy, bertie, bush } = cast;
        await k.wait(500);
        await k.say('woods');
        await k.say('tooWet', daddy);
        k.face(teddy, true);
        await k.all(k.say('listen', teddy), k.wait(300).then(() => k.shake(teddy, 5, 2)));
        k.face(teddy, false);
        sneeze();
        await k.wait(700);
        await k.all(k.shake(bush, 8, 3), k.say('atishoo', bertie));
        await k.wait(300);

        const how = await k.tapToHelp(bush, { ask: 'askBush', nudge: 'nudgeBush', helped: 'helpedBush', by: teddy, helper: daddy, size: 280 });
        k.sfx.rustle();
        await k.shake(bush, 8, 2);
        // Out he crawls, in front of the bush.
        k.set(bertie, { zIndex: 12 });
        await k.all(k.to(bertie, 0.9, { x: -230, ease: 'power2.out' }), k.to(bertie, 0.9, { y: 0, ease: 'back.out(1.4)' }));
        if (how === 'tapped') await k.all(k.say('foundHim', teddy), k.hop(teddy, 30));
        await k.say('whoAreYou', teddy);
        sneeze();
        await k.wait(800);
        await k.all(k.say('bertie', bertie), k.shake(bertie, 4, 2));
        await k.say('comeHome', daddy);
        await k.wait(500);
      },
    },

    // ===================================================== 2. Daddy's chair
    {
      name: 'Daddy’s chair',
      set(k) {
        parlour(k);
        k.music('cosy');
        cast.mug = k.prop('mug', { x: 700, y: 480, w: 80, z: 12 });
        cast.daddy = k.character('daddyBear', { x: 40, y: 390, w: 250 });
        cast.teddy = k.character('teddy', { x: 250, y: 460, w: 190 });
        cast.mummy = k.character('mummyBear', { x: 860, y: 390, w: 250, flip: true });
      },
      async play(k) {
        const { bertie, daddy, teddy, mummy } = cast;
        await k.wait(400);
        await k.say('beforeLong');
        pour();
        sip();
        await k.wait(600);
        await k.say('lavinia', bertie);
        await k.to(mummy, 0.3, { rotation: -5, yoyo: true, repeat: 1 });
        await k.say('lovely', mummy);
        await k.say('howLeft', teddy);
        await k.say('pickingFlowers', bertie);
        await k.say('onPurpose', bertie);
        await k.say('ofCourseNot', daddy);
        await k.wait(500);
      },
    },

    // ===================================================== 3. Not my colour
    {
      name: 'Not my colour',
      set(k) {
        parlour(k);
        k.music('cosy');
        cast.teddy = k.character('teddy', { x: 220, y: 460, w: 190 });
        cast.mummy = k.character('mummyBear', { x: 860, y: 390, w: 250, flip: true });
        cast.jumper = k.prop('jumper', { x: 260, y: 300, w: 170, z: 14 });
        k.set(cast.teddy, { x: -500 });
        k.set(cast.jumper, { x: -500 });
      },
      async play(k) {
        const { teddy, mummy, bertie, jumper } = cast;
        await k.wait(300);
        k.fx.patter(5);
        await k.all(k.to(teddy, 1, { x: 0, ease: 'power2.out' }), k.to(jumper, 1, { x: 0, ease: 'power2.out' }));
        await k.say('foundClothes', teddy);
        await k.wait(200);

        await k.tapToHelp(jumper, { ask: 'askJumper', nudge: 'nudgeJumper', helped: 'helpedJumper', by: teddy, helper: mummy });
        // The jumper flies over and on it goes.
        k.sfx.whoosh();
        await k.to(jumper, 0.7, { x: 320, y: 140, scale: 0.6, ease: 'power2.inOut' });
        k.puff(580, 520, 140);
        k.pose(bertie, 'jumper');
        k.set(jumper, { opacity: 0 });
        k.fx.boing();
        await k.wait(500);
        await k.say('notMyColour', bertie);
        await k.say('betterTrousers', bertie);
        sigh();
        await k.wait(900);
        await k.say('betterThanNothing', bertie);
        // Teddy turns away from Bertie to whisper it to him.
        k.face(teddy, true);
        await k.camera({ zoom: 1.2, x: 320, y: 450 }, 0.6);
        await k.say('noThankYou', teddy);
        await k.camera({}, 0.6);
        await k.say('sunOut', mummy);
        await k.wait(400);
      },
    },

    // ===================================================== 4. Back to the woods
    {
      name: 'Back to the woods',
      set(k) {
        k.backdrop('bear-woods');
        k.music('sneaky');
        cast.daddy = k.character('daddyBear', { x: 60, y: 360, w: 230, z: 8 });
        cast.teddy = k.character('teddy', { x: 230, y: 420, w: 180, z: 8 });
        cast.hide = k.prop('bush', { x: 20, y: 470, w: 400, z: 9 });
        cast.bertie = k.character('bertie', { x: 470, y: 470, w: 180 });
        cast.aunt = k.character('greatAunt', { x: 740, y: 290, w: 340, flip: true });
        cast.lavinia = k.character('lavinia', { x: 880, y: 360, w: 280, flip: true });
        k.set(cast.aunt, { x: 600 });
        k.set(cast.lavinia, { x: 500 });
      },
      async play(k) {
        const { daddy, teddy, bertie, aunt, lavinia, hide } = cast;
        await k.wait(400);
        await k.say('waited');
        k.fx.patter(6);
        await k.all(k.say('someone', teddy), k.to(aunt, 2, { x: 0, ease: 'power1.out' }));
        await k.wait(200);

        const how = await k.tapToHelp(bertie, { ask: 'askBertie', nudge: 'nudgeBertie', helped: 'helpedBertie', by: teddy, helper: bertie });
        if (how === 'tapped') {
          sneeze();
          await k.wait(700);
          await k.say('atishooAgain', bertie);
        }
        await k.shake(bertie, 5, 2);
        k.face(aunt, true);
        if (how === 'tapped') await k.say('heardHim', teddy);
        // Teddy and Daddy duck down out of sight.
        await k.all(moves.duck(k, [daddy, teddy]), k.shake(hide, 4, 2));
        await k.say('blessYou', aunt);
        await k.all(k.to(aunt, 1, { x: -100, ease: 'power2.inOut' }), k.to(lavinia, 1.2, { x: 40, ease: 'power2.out' }));
        await k.say('lostBear', aunt);
        await k.say('thatOldThing', lavinia);
        giggle();
        await k.exit(lavinia, 'right', 1.2);

        k.music('dreamy');
        k.pose(bertie, 'sad');
        await moves.droop(k, bertie);
        await k.say('nearlyCry');
        await k.wait(600);
      },
    },

    // ===================================================== 5. Loved again
    {
      name: 'Loved again',
      set(k) {
        k.backdrop('bear-woods');
        k.music('dreamy');
        cast.daddy = k.character('daddyBear', { x: 60, y: 360, w: 230, z: 8 });
        cast.teddy = k.character('teddy', { x: 230, y: 420, w: 180, z: 8 });
        cast.hide = k.prop('bush', { x: 20, y: 470, w: 400, z: 9 });
        cast.bertie = k.character('bertie', { x: 470, y: 470, w: 180, pose: 'sad' });
        cast.aunt = k.character('greatAunt', { x: 640, y: 290, w: 340, flip: true });
        k.set(cast.daddy, { y: 120, opacity: 0 });
        k.set(cast.teddy, { y: 120, opacity: 0 });
        k.set(cast.bertie, { y: 10, rotation: -4 });
      },
      async play(k) {
        const { daddy, teddy, bertie, aunt } = cast;
        await k.wait(500);
        await k.say('remindMe', aunt);
        await k.say('comeHomeWithMe', aunt);
        k.pose(bertie, 'happy');
        await moves.perkUp(k, bertie);
        k.fx.twinkle();
        k.sparkle(560, 560, 12, 140);
        await k.say('shining');

        // A whisper to the bushes before she picks him up.
        await moves.peep(k, [daddy, teddy]);
        await k.say('thankYouTeddy', bertie);
        await k.say('welcome', teddy);
        await moves.duck(k, [daddy, teddy]);
        await k.all(k.fade(bertie, 0, 0.5), k.wait(150).then(() => k.pose(aunt, 'cuddle')));
        k.fx.twinkle();
        await k.wait(600);
        await k.exit(aunt, 'right', 2);

        k.music('cosy');
        await moves.peep(k, [daddy, teddy], 0.6);
        await k.say('thinking', daddy);
        k.face(teddy, true);
        await k.say('callAgain', teddy);
        k.sparkle(300, 450, 14, 200);
        k.fx.twinkle();
        await k.wait(1500);
      },
    },
  ],
});
