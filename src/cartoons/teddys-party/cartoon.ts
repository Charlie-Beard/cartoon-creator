/**
 * Teddy's Birthday Party: the first story in the Teddy Bear Treasury
 * (Brown Watson, 1994), told as a cartoon. It is Aunt Bertha Bear's
 * birthday, Grandpa's Mr Punch puppet gets squashed in his case, and Teddy
 * saves the show by being Marmaduke, Grandpa's talking dummy.
 *
 *   1. Getting ready. The party garden, bunting and balloons, a table of
 *      cakes and jellies, pies and banana boats. It's Aunt Bertha Bear's
 *      birthday. Jolly games first, then Grandpa's Punch and Judy show!
 *      Teddy can hardly wait. The games begin.
 *   2. Poor Mr Punch. Musical Chairs: the tune plays, Teddy and Barney
 *      hop round, the tune stops. Grandpa arrives, not in a party mood:
 *      Mr Punch's nose got squashed in the travelling case, and he can't
 *      mend him in time. Oh dear! Is Marmaduke still at Great Uncle
 *      Bertram's? "Who's Marmaduke?" asks Teddy. Nobody answers. He asks
 *      again, louder. Grandpa and Mummy look at each other, then at Teddy:
 *      everyone likes Marmaduke, and Teddy will like him too. Grandpa
 *      takes Teddy off to tell him a secret.
 *   3. Who's Marmaduke? Barney: where's Teddy? He's missing the games!
 *      Mummy claps: take your seats for the birthday show, by Grandpa Bear
 *      and Marmaduke! "Who's Marmaduke?" His first turn: he taps the
 *      starry curtains open, and there is Teddy, on Grandpa's knee,
 *      pretending to be Marmaduke the dummy. Marmaduke tells jokes in a
 *      squeaky voice (it's really Grandpa's), and the bears laugh and laugh.
 *   4. Happy birthday. Teddy was the best Marmaduke ever. Cake time: his
 *      second turn, he blows out Aunt Bertha's candles. Happy birthday,
 *      Aunt Bertha! Can Marmaduke come to the next party? Only if Teddy is
 *      him again. The End.
 *
 * Mr Punch never performs (he's broken), so there's no slapstick. In the
 * show, Grandpa's `marmaduke` pose has Teddy on his knee, and its talking
 * mouth is Teddy's: Marmaduke's lines (speaker `marmaduke`, Grandpa's
 * squeaky puppet voice) move Teddy's mouth, which is the whole joke. There is no
 * villain: the trouble is the broken puppet, put right with a good idea.
 */
import { defineCartoon, type Kit } from '../../kit';
import { sounds as bear } from '../../worlds/bears/moves';
import { candles, musicalChairs } from '../../worlds/bears/pieces';
import { moves, sounds } from '../../worlds/common/moves';
import meta from './meta';

const { laugh, giggle } = sounds;

// ------------------------------------------------------------------ cast

type Actor = 'teddy' | 'mummy' | 'bertha' | 'grandpa' | 'barney' | 'cake' | 'table' | 'case' | 'punch' | 'curtains' | 'balloons' | 'show';
const cast = {} as Record<Actor, HTMLElement>;

/** The party table with the cake on it, at the right. */
function partyTable<K extends string>(k: Kit<K>): void {
  cast.table = k.prop('party-table', { x: 600, y: 500, w: 560, z: 14 });
  cast.cake = k.prop('birthday-cake', { x: 780, y: 360, w: 220, z: 15 });
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. Getting ready
    birthday: { who: 'narrator', text: 'It was Aunt Bertha Bear’s birthday, and everyone was busy getting ready for a party.' },
    hardlyWait: { who: 'teddy', text: 'Cakes and jellies, pies and banana boats! Hello, {name}! I can hardly wait!' },
    jollyGames: { who: 'aunt-bertha', text: 'We’ll play lots of jolly games. Then Grandpa Bear is bringing his puppet show!' },
    puppetShow: { who: 'teddy', text: 'A puppet show! That’s the best thing at a party!' },
    gamesBegin: { who: 'mummy-bear', text: 'Here come the guests. Let the games begin!' },
    // 2. Poor Mr Punch
    roundWeGo: { who: 'barney', text: 'Musical Chairs! Round and round we go!' },
    musicalChairs: { who: 'narrator', text: 'Halfway through Musical Chairs, Grandpa Bear arrived. He was not in a party mood at all.' },
    poorPunch: { who: 'grandpa-bear', text: 'Oh dear, oh dear. Just look what’s happened to my poor old puppet!' },
    squashed: { who: 'teddy', text: 'His nose is all squashed!' },
    cantMend: { who: 'grandpa-bear', text: 'I caught it in my travelling case. I can’t possibly mend him in time.' },
    stillAway: { who: 'mummy-bear', text: 'Oh dear! And I suppose Marmaduke is still with Great Uncle Bertram?' },
    ifOnly: { who: 'grandpa-bear', text: 'Yes, indeed. Ah, my good friend Marmaduke! If only he were here now…' },
    whosMarmaduke: { who: 'teddy', text: 'Marmaduke? Who’s Marmaduke?' },
    madeLaugh: { who: 'mummy-bear', text: 'Marmaduke… How he used to make everyone laugh.' },
    favourite: { who: 'grandpa-bear', text: 'Always a great favourite…' },
    whoIs: { who: 'teddy', text: 'But WHO… IS… MARMADUKE?' },
    looked: { who: 'narrator', text: 'Grandpa looked at Mummy. Mummy looked at Grandpa. Then they both looked at Teddy.' },
    everyoneLikes: { who: 'mummy-bear', text: 'Marmaduke! Everyone likes Marmaduke!' },
    youToo: { who: 'grandpa-bear', text: 'And I’m sure, Teddy Bear, that you will like him too. Come with me!' },
    puzzled: { who: 'teddy', text: 'But isn’t Marmaduke at Great Uncle Bertram’s? {name}, what’s going on?' },
    // 3. Who's Marmaduke?
    wheresTeddy: { who: 'barney', text: 'Where’s Teddy? He’s missing all the party games!' },
    takeSeats: { who: 'mummy-bear', text: 'Please take your seats for the birthday show, by Grandpa Bear… and Marmaduke!' },
    whisper: { who: 'barney', text: 'Marmaduke? Who’s Marmaduke?' },
    askCurtains: { who: 'aunt-bertha', text: 'Let’s find out! {name}, will you open the curtains? Tap them!' },
    nudgeCurtains: { who: 'aunt-bertha', text: 'Tap the starry curtains, {name}!' },
    helpedCurtains: { who: 'aunt-bertha', text: 'Never mind, dear. I’ll open them myself!' },
    whoWasIt: { who: 'narrator', text: 'And who do you think it was?' },
    itsTeddy: { who: 'barney', text: 'It’s Teddy! Sitting on Grandpa’s knee!' },
    helloAll: { who: 'marmaduke', text: 'Hello, everybody! I’m Marmaduke! Happy birthday, Aunt Bertha!' },
    jokePudding: { who: 'marmaduke', text: 'Why did the teddy bear say no to pudding?' },
    dontKnow: { who: 'barney', text: 'I don’t know! Why?' },
    stuffed: { who: 'marmaduke', text: 'Because he was already STUFFED!' },
    howLaughed: { who: 'narrator', text: 'How the bears laughed! And that squeaky voice was really Grandpa’s!' },
    // 4. Happy birthday
    bestShow: { who: 'aunt-bertha', text: 'What a wonderful show! Thank you, Grandpa. And thank you, Marmaduke!' },
    itWasMe: { who: 'teddy', text: 'It was me all along! Grandpa did the voice!' },
    bestMarmaduke: { who: 'grandpa-bear', text: 'Teddy is the best Marmaduke I ever had.' },
    cakeTime: { who: 'mummy-bear', text: 'And now, it’s time for the birthday cake!' },
    askCandles: { who: 'aunt-bertha', text: 'Will you help me blow out my candles, {name}? Tap my cake!' },
    nudgeCandles: { who: 'aunt-bertha', text: 'Just tap the cake, dear, and blow!' },
    helpedCandles: { who: 'teddy', text: 'I’ll help! One, two, three… whoosh!' },
    happyBirthday: { who: 'mummy-bear', text: 'Happy birthday, Aunt Bertha!' },
    thanksName: { who: 'aunt-bertha', text: 'Thank you, {name}! What a lovely birthday.' },
    thanksTeddy: { who: 'aunt-bertha', text: 'Thank you, Teddy! What a lovely birthday.' },
    nextParty: { who: 'teddy', text: 'Grandpa, can Marmaduke come to the next party too?' },
    onlyIf: { who: 'grandpa-bear', text: 'Only if you’ll be him again, Teddy Bear!' },
  },
  scenes: [
    // ===================================================== 1. Getting ready
    {
      name: 'Getting ready',
      set(k) {
        k.backdrop('bear-garden');
        k.music('cosy');
        partyTable(k);
        cast.balloons = k.prop('balloons', { x: 1000, y: 120, w: 170, z: 12 });
        cast.bertha = k.character('aunt-bertha', { x: 40, y: 380, w: 260 });
        cast.mummy = k.character('mummy-bear', { x: 270, y: 390, w: 250 });
        cast.teddy = k.character('teddy', { x: 470, y: 450, w: 200, z: 16 });
      },
      async play(k) {
        const { bertha, mummy, teddy, balloons } = cast;
        await k.wait(400);
        void k.float(balloons, 6, 3);
        await k.say('birthday');
        await k.all(k.say('hardlyWait', teddy), k.wait(300).then(() => k.hop(teddy, 34)));
        k.face(teddy, true);
        await k.say('jollyGames', bertha);
        k.fx.twinkle();
        await k.all(k.say('puppetShow', teddy), k.wait(200).then(() => k.hop(teddy, 40, 2)));
        await k.wait(300);
        await k.say('gamesBegin', mummy);
        await moves.wave(k, mummy, 2);
        await k.wait(500);
      },
    },

    // ===================================================== 2. Poor Mr Punch
    {
      name: 'Poor Mr Punch',
      set(k) {
        k.backdrop('bear-garden');
        k.music('adventure');
        cast.barney = k.character('barney', { x: 640, y: 450, w: 200 });
        cast.teddy = k.character('teddy', { x: 400, y: 450, w: 200 });
        cast.mummy = k.character('mummy-bear', { x: 860, y: 390, w: 250, flip: true });
        cast.grandpa = k.character('grandpa-bear', { x: 70, y: 380, w: 260 });
        cast.case = k.prop('travelling-case', { x: 60, y: 560, w: 200, z: 12 });
        cast.punch = k.prop('mr-punch', { x: 250, y: 380, w: 130, z: 13 });
        k.set(cast.grandpa, { x: -420 });
        k.set(cast.case, { x: -420 });
        k.set(cast.punch, { opacity: 0 });
      },
      async play(k) {
        const { barney, teddy, mummy, grandpa, punch } = cast;
        await k.wait(300);
        // Musical Chairs: round they go while the tune plays, and stop.
        await k.all(musicalChairs(k, { players: [teddy, barney] }), k.say('roundWeGo', barney));
        giggle();
        k.music('cosy');

        // In comes Grandpa with his case, not in a party mood.
        k.fx.patter(6);
        await k.all(k.say('musicalChairs'), k.to(grandpa, 1.4, { x: 0, ease: 'power2.out' }), k.to(cast.case, 1.4, { x: 0, ease: 'power2.out' }));
        k.face(teddy, true);
        k.face(barney, true);
        await k.say('poorPunch', grandpa);
        bear.sadSlide();
        await k.all(k.fade(punch, 1, 0.4), k.pop(punch));
        await k.say('squashed', teddy);
        await k.say('cantMend', grandpa);
        await k.all(k.say('stillAway', mummy), k.wait(200).then(() => k.exit(barney, 'right', 1.2)));
        await k.say('ifOnly', grandpa);
        await k.say('whosMarmaduke', teddy);
        await k.say('madeLaugh', mummy);
        await k.say('favourite', grandpa);
        // Nobody answers, so he asks again, louder.
        await k.hop(teddy, 50);
        await k.all(k.say('whoIs', teddy), k.camera({ zoom: 1.15, x: 520, y: 420 }, 0.6));
        await k.camera({}, 0.6);

        // Grandpa looks at Mummy, Mummy at Grandpa, both at Teddy.
        await k.say('looked');
        await k.to(grandpa, 0.4, { rotation: 4, yoyo: true, repeat: 1 });
        await k.to(mummy, 0.4, { rotation: -4, yoyo: true, repeat: 1 });
        await k.say('everyoneLikes', mummy);
        k.fx.twinkle();
        await k.say('youToo', grandpa);
        await k.say('puzzled', teddy);
        await k.all(k.exit(grandpa, 'left', 1.2), k.exit(punch, 'left', 1.2), k.exit(cast.case, 'left', 1.2), k.wait(400).then(() => k.walk(teddy, -560, 1.4, 5)));
        await k.wait(400);
      },
    },

    // ===================================================== 3. Who's Marmaduke?
    {
      name: 'Who’s Marmaduke?',
      set(k) {
        k.backdrop('bear-garden');
        k.music('magic');
        cast.show = k.character('grandpa-bear', { x: 460, y: 300, w: 270, pose: 'marmaduke', z: 8 });
        cast.curtains = k.prop('show-curtains', { x: 320, y: 140, w: 540, z: 9 });
        cast.barney = k.character('barney', { x: 30, y: 460, w: 200, z: 12 });
        cast.bertha = k.character('aunt-bertha', { x: 900, y: 390, w: 250, flip: true, z: 12 });
        cast.mummy = k.character('mummy-bear', { x: 290, y: 390, w: 250, z: 13 });
        k.set(cast.mummy, { x: -700 });
      },
      async play(k) {
        const { barney, bertha, mummy, curtains, show } = cast;
        await k.wait(400);
        await k.say('wheresTeddy', barney);
        // Mummy pops in and claps for the show.
        await k.enter(mummy, 'left', 0.9);
        k.sfx.page();
        await k.say('takeSeats', mummy);
        await k.exit(mummy, 'left', 0.8);
        await k.say('whisper', barney);
        k.fx.drumroll(1.5);
        await k.wait(800);

        const how = await k.tapToHelp(curtains, {
          ask: 'askCurtains',
          nudge: 'nudgeCurtains',
          helped: 'helpedCurtains',
          by: bertha,
          size: 300,
        });
        // The curtains swish open.
        k.sfx.whoosh();
        const [l] = k.pivot(k.part(curtains, 'curtainL'));
        const [r] = k.pivot(k.part(curtains, 'curtainR'));
        await k.all(k.to(l, 1, { x: -180, scaleX: 0.5, ease: 'power2.inOut' }), k.to(r, 1, { x: 180, scaleX: 0.5, ease: 'power2.inOut' }));
        k.fx.twinkle();
        k.sparkle(600, 380, 14, 200);
        if (how === 'tapped') await k.wait(200);
        await k.say('whoWasIt');
        await k.all(k.say('itsTeddy', barney), k.hop(barney, 30));
        await k.all(k.say('helloAll', show), k.camera({ zoom: 1.2, x: 600, y: 420 }, 0.8));
        await k.say('jokePudding', show);
        await k.say('dontKnow', barney);
        await k.say('stuffed', show);
        laugh();
        await k.all(k.camera({}, 0.6), k.shake(barney, 6, 3), k.shake(bertha, 6, 3));
        await k.say('howLaughed');
        await k.wait(500);
      },
    },

    // ===================================================== 4. Happy birthday
    {
      name: 'Happy birthday',
      set(k) {
        k.backdrop('bear-garden');
        k.music('cosy');
        partyTable(k);
        cast.bertha = k.character('aunt-bertha', { x: 40, y: 380, w: 260 });
        cast.grandpa = k.character('grandpa-bear', { x: 270, y: 380, w: 250 });
        cast.teddy = k.character('teddy', { x: 470, y: 450, w: 200, z: 16, flip: true });
        cast.mummy = k.character('mummy-bear', { x: 975, y: 365, w: 220, flip: true, z: 13 });
      },
      async play(k) {
        const { bertha, grandpa, teddy, mummy, cake } = cast;
        await k.wait(400);
        await k.say('bestShow', bertha);
        await k.all(k.say('itWasMe', teddy), k.hop(teddy, 40));
        await k.say('bestMarmaduke', grandpa);
        await k.say('cakeTime', mummy);
        k.face(teddy, false);
        await k.wait(300);

        const how = await k.tapToHelp(cake, {
          ask: 'askCandles',
          nudge: 'nudgeCandles',
          helped: 'helpedCandles',
          by: bertha,
          helper: teddy,
        });
        await candles(k, { cake, line: 'happyBirthday', by: mummy });
        await k.say(how === 'tapped' ? 'thanksName' : 'thanksTeddy', bertha);
        await k.say('nextParty', teddy);
        k.face(teddy, true);
        await k.say('onlyIf', grandpa);
        laugh();
        k.sparkle(400, 360, 18, 260);
        k.fx.twinkle();
        await k.all(k.hop(teddy, 40, 2), k.wait(150).then(() => k.hop(grandpa, 30)), k.wait(300).then(() => k.hop(bertha, 30)));
        await k.wait(1200);
      },
    },
  ],
});
