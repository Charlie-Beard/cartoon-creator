/**
 * Christmas at Hogwarts: Harry's first proper Christmas, from the first
 * book, with the bits the film left out (the jumper, the wizard crackers,
 * the white mice and Dumbledore's flowery bonnet).
 *
 *   1. Snow! Christmas Eve, and the grounds are deep in snow. Harry tells
 *      Ron he's never had a proper Christmas: the Dursleys once gave him a
 *      coat hanger and a pair of Uncle Vernon's old socks. Ron: Christmas
 *      at Hogwarts is the best, you'll see. Then a tree comes stomping
 *      through the snow… it's only Hagrid, behind the biggest tree in the
 *      forest, for the Great Hall. Bit of a squeeze through the door, mind.
 *   2. Stuck! Up at the great front doors: one, two, three, HEAVE! The tree
 *      jams in the doorway. Hagrid pushes again, the tree springs back, and
 *      he sits down in the snow. There'll be no tree for Christmas now…
 *      Ron sees why: the branches are full of snow, that's what makes it so
 *      fat. His first turn: he drags Harry's snowball to the tree, the snow
 *      tumbles off, the branches spring in, and with one more heave the
 *      tree slides inside. Dumbledore: a splendid tree. Off to bed, and who
 *      knows what you'll find in the morning?
 *   3. Presents! Christmas morning in the dormitory, and there's a pile of
 *      presents at the end of Harry's bed. For me? His second turn: he taps
 *      the presents, and out comes a green jumper with an H on it, knitted
 *      by Ron's mum (Ron's is always maroon). Harry holds it up: his first
 *      real Christmas present.
 *   4. Crackers. Christmas dinner in the Great Hall, with Hagrid's tree all
 *      decorated but for its star. His third turn: he drags the star from
 *      Hagrid's paws up to the top of the tree. Wizard crackers go off like
 *      a cannon! His fourth turn: he taps the cracker, BANG, a puff of smoke, an admiral's hat for Harry
 *      and live white mice. Dumbledore's cracker gives him a flowery bonnet,
 *      just what he always wanted. Everyone laughs.
 *   5. The best Christmas. That night by the common room fire, one white
 *      mouse has followed them home, shivering. His fifth turn: he drags
 *      it onto Harry's warm lap. The best Christmas Harry has ever had.
 *      Happy Christmas, and the snow falls all night long.
 *
 * The trouble is gentle this time, as asked: no villain, just a tree too
 * fat with snow and a sad moment for Hagrid, put right by a snowball put
 * on the tree (never thrown at a person). Nobody is hurt: Hagrid sits down in soft
 * snow and laughs. Harry's worry (nobody ever gives him presents) is the
 * thread through the middle, and scene 3 answers it.
 */
import { defineCartoon, now, tone, noiseBurst, type Kit } from '../../kit';
import { sounds as commonSounds } from '../../worlds/common/moves';
import { sounds } from '../../worlds/hogwarts/moves';
import { greatHall } from '../../worlds/hogwarts/pieces';
import meta from './meta';

const { laugh, giggle } = commonSounds;

// ---------------------------------------------------------------- sounds

/** Snow tumbling off branches: a soft, low whumph with a hiss of powder after it. */
function whumph(): void {
  const t = now();
  noiseBurst(t, { freq: 300, q: 0.8, peak: 0.12, attack: 0.02, decay: 0.5, sweepTo: 120 });
  noiseBurst(t + 0.1, { freq: 2500, q: 0.7, peak: 0.03, attack: 0.1, decay: 0.9, sweepTo: 1200 });
}

/** Wrapping paper torn off: three quick, papery rips. */
function rip(): void {
  const t = now();
  [0, 0.18, 0.34].forEach((d) => noiseBurst(t + d, { freq: 3200, q: 1.2, peak: 0.06, attack: 0.01, decay: 0.16, sweepTo: 1800 }));
}

/** A wizard cracker going off like a little cannon: a round bang, softened, and a fizz of smoke. */
function crackerBang(): void {
  const t = now();
  noiseBurst(t, { freq: 500, q: 0.6, peak: 0.16, attack: 0.005, decay: 0.45, sweepTo: 150 });
  tone(110, t, { wave: 'sine', peak: 0.12, attack: 0.005, decay: 0.4, glideTo: 50 });
  noiseBurst(t + 0.2, { freq: 4000, q: 1, peak: 0.025, attack: 0.1, decay: 1, sweepTo: 2000 });
}

// ---------------------------------------------------------------- moves

/** Hagrid's tree as it comes out of the forest: snowy, with no decorations or star yet. */
function bare<K extends string>(k: Kit<K>, tree: HTMLElement): void {
  k.set(k.part(tree, 'baubles'), { opacity: 0 });
  k.set(k.part(tree, 'star'), { opacity: 0 });
}

// ------------------------------------------------------------------ cast

type Actor = 'harry' | 'ron' | 'hagrid' | 'dumbledore' | 'tree' | 'ball' | 'star' | 'jumper' | 'pile' | 'gift2' | 'gift3' | 'cracker' | 'hat' | 'bonnet' | 'mouse' | 'mouse2' | 'mouse3';
const cast = {} as Record<Actor, HTMLElement>;
/** The Great Hall's actors from scene 4's `set`, for its `play`. */
let hall: ReturnType<typeof greatHall.set>;

export default defineCartoon({
  ...meta,
  lines: {
    // 1. Snow!
    christmasEve: { who: 'narrator', text: 'It was Christmas Eve at Hogwarts. Snow lay thick and white all over the grounds.' },
    happyEve: { who: 'ron', text: 'Happy Christmas Eve, Harry! And happy Christmas Eve, {name}!' },
    neverHad: { who: 'harry', text: 'I’ve never had a proper Christmas, Ron.' },
    socks: { who: 'harry', text: 'The Dursleys gave me a coat hanger once. And a pair of Uncle Vernon’s old socks.' },
    yuck: { who: 'ron', text: 'Yuck! Well, Christmas at Hogwarts is the best. You’ll see.' },
    walking: { who: 'harry', text: 'Ron… that tree’s walking!' },
    onlyMe: { who: 'hagrid', text: 'Ha! It’s only me!' },
    biggest: { who: 'hagrid', text: 'Biggest tree in the whole forest! It’s for the Great Hall.' },
    enormous: { who: 'ron', text: 'Wow! It’s enormous!' },
    squeeze: { who: 'hagrid', text: 'Bit of a squeeze through the door, mind. Give us a hand, lads?' },
    letsHelp: { who: 'harry', text: 'Come on! Let’s help Hagrid!' },
    // 2. Stuck!
    frontDoors: { who: 'narrator', text: 'They pulled the tree all the way up to the great front doors.' },
    heave: { who: 'hagrid', text: 'One, two, three… HEAVE!' },
    stuck: { who: 'ron', text: 'Oh no. It’s stuck!' },
    cantBeStuck: { who: 'hagrid', text: 'Stuck? It can’t be! Christmas is tomorrow!' },
    whoops: { who: 'hagrid', text: 'Whoops! Sat right down in the snow!' },
    allRight: { who: 'harry', text: 'Are you all right, Hagrid?' },
    noTree: { who: 'hagrid', text: 'I’m fine. But there won’t be a tree for Christmas now.' },
    fullOfSnow: { who: 'ron', text: 'Look at the branches! They’re all full of snow.' },
    knockOff: { who: 'harry', text: 'That’s why it’s too fat! Let’s knock the snow off.' },
    askSnowball: { who: 'harry', text: 'Put a snowball on the tree, {name}! Drag it over!' },
    nudgeSnowball: { who: 'harry', text: 'Drag the snowball to the big snowy tree!' },
    helpedSnowball: { who: 'ron', text: 'Never mind, I’ll pop it on myself!' },
    blimey: { who: 'hagrid', text: 'Blimey! Look at that!' },
    itsIn: { who: 'ron', text: 'It’s in! It’s in!' },
    bestSnowball: { who: 'hagrid', text: 'Well done, {name}! Best snowball I ever saw!' },
    ronsSnowball: { who: 'hagrid', text: 'Well done, Ron! Best snowball I ever saw!' },
    splendid: { who: 'dumbledore', text: 'What a splendid tree, Hagrid. Thank you, all of you.' },
    bedtime: { who: 'dumbledore', text: 'Now, off to bed. Who knows what you’ll find in the morning?' },
    // 3. Presents!
    morning: { who: 'narrator', text: 'On Christmas morning, Harry woke up early.' },
    happyChristmas: { who: 'ron', text: 'Happy Christmas, Harry!' },
    sleepy: { who: 'harry', text: 'Mmm… Happy Christmas, Ron.' },
    lookPresents: { who: 'ron', text: 'Look! You’ve got presents!' },
    forMe: { who: 'harry', text: 'Presents? For me?' },
    askPresents: { who: 'harry', text: 'Will you help me open them, {name}? Tap the presents!' },
    nudgePresents: { who: 'harry', text: 'Tap the pile of presents!' },
    helpedPresents: { who: 'ron', text: 'Go on, Harry! Rip the paper off!' },
    aJumper: { who: 'harry', text: 'A jumper! A green one, with an H on it!' },
    mumKnits: { who: 'ron', text: 'Mum knits us one every Christmas. Mine’s always maroon.' },
    knittedForMe: { who: 'harry', text: 'Your mum knitted one for me?' },
    itFits: { who: 'ron', text: 'Course she did! Hold it up!' },
    firstPresent: { who: 'harry', text: 'My first real Christmas present.' },
    dinner: { who: 'ron', text: 'Told you! Come on. It’s Christmas dinner!' },
    // 4. Crackers
    feast: { who: 'narrator', text: 'Christmas dinner was the biggest feast Harry had ever seen.' },
    tuckIn: { who: 'dumbledore', text: 'Happy Christmas, everyone! Tuck in!' },
    myTree: { who: 'hagrid', text: 'An’ look at my tree now! It just needs its star.' },
    askStar: { who: 'hagrid', text: 'Can you drag the star to the top of the tree, {name}?' },
    nudgeStar: { who: 'hagrid', text: 'Drag the star up to the tree!' },
    helpedStar: { who: 'hagrid', text: 'I’ll pop it up meself, then.' },
    starOn: { who: 'dumbledore', text: 'Beautiful. Now the tree is finished.' },
    crackers: { who: 'ron', text: 'Crackers! Wizard crackers go off like a cannon.' },
    askCracker: { who: 'ron', text: 'Pull it with us, {name}! Tap the cracker!' },
    nudgeCracker: { who: 'ron', text: 'Tap the cracker. Ready?' },
    helpedCracker: { who: 'harry', text: 'One, two, three… pull!' },
    aHat: { who: 'harry', text: 'A hat! And… mice?' },
    mice: { who: 'ron', text: 'Real white mice!' },
    bonnet: { who: 'dumbledore', text: 'Ah! A flowery bonnet. Just what I always wanted.' },
    suitsYou: { who: 'hagrid', text: 'Suits you, Professor!' },
    // 5. The best Christmas
    night: { who: 'narrator', text: 'That night, the friends sat by the fire, warm and full and happy.' },
    bestEver: { who: 'harry', text: 'That was the best Christmas I’ve ever had.' },
    toldYou: { who: 'ron', text: 'Told you. Christmas at Hogwarts is the best!' },
    followedUs: { who: 'ron', text: 'Look! One of the mice came home with us!' },
    askMouse: { who: 'ron', text: 'He’s shivering. Drag him onto Harry’s lap!' },
    nudgeMouse: { who: 'ron', text: 'Drag the mouse to Harry’s lap!' },
    helpedMouse: { who: 'harry', text: 'Come here, little mouse. In you pop.' },
    mouseCosy: { who: 'harry', text: 'Aww. He likes it.' },
    thankYou: { who: 'harry', text: 'Thank you for helping, {name}. Happy Christmas!' },
    end: { who: 'narrator', text: 'And outside, the snow fell softly on Hogwarts, all night long.' },
  },
  scenes: [
    // ==================================================== 1. Snow!
    {
      name: 'Snow!',
      set(k) {
        k.backdrop('snowy-grounds');
        k.music('cosy');
        k.ambient('snow');
        cast.harry = k.character('harry', { x: 290, y: 390, w: 230 });
        cast.ron = k.character('ron', { x: 500, y: 390, w: 230 });
        cast.hagrid = k.character('hagrid', { x: 750, y: 370, w: 260, flip: true, z: 9 });
        cast.tree = k.prop('christmasTree', { x: 740, y: 250, w: 280, z: 11 });
        bare(k, cast.tree);
        k.set(cast.tree, { x: 620 });
        k.set(cast.hagrid, { x: 620 });
      },
      async play(k) {
        const { harry, ron, hagrid, tree } = cast;
        await k.wait(500);
        await k.say('christmasEve');
        await k.all(k.say('happyEve', ron), k.wait(500).then(() => k.hop(ron, 24)));
        k.face(harry, true);
        await k.say('neverHad', harry);
        await k.say('socks', harry);
        giggle();
        await k.all(k.say('yuck', ron), k.shake(ron, 5, 2));
        await k.wait(300);

        // Stomp, stomp: a tree comes through the snow on its own…
        k.face(harry, false);
        k.fx.stomp(4, 0.5);
        k.sfx.rustle();
        await k.all(
          k.to(tree, 2.2, { x: 0, ease: 'power1.out' }),
          k.to(hagrid, 2.2, { x: 0, ease: 'power1.out' }),
          k.shake(tree, 3, 4),
        );
        await k.all(k.say('walking', harry), k.shake(harry, 5, 2));

        // …and out from behind it steps Hagrid.
        k.set(hagrid, { zIndex: 12 });
        k.fx.patter(4, 0.15);
        await k.walk(hagrid, 170, 0.9, 3);
        sounds.bellyLaugh();
        await k.all(k.say('onlyMe', hagrid), k.wait(300).then(() => k.hop(hagrid, 16)));
        await k.say('biggest', hagrid);
        await k.all(k.say('enormous', ron), k.hop(ron, 26));
        await k.say('squeeze', hagrid);
        await k.all(k.say('letsHelp', harry), k.wait(400).then(() => k.hop(harry, 26)));
        await k.wait(600);
      },
    },

    // ==================================================== 2. Stuck!
    {
      name: 'Stuck!',
      set(k) {
        k.backdrop('castle-doors');
        k.music('adventure');
        k.ambient('snow', { count: 24 });
        cast.harry = k.character('harry', { x: 20, y: 390, w: 230 });
        cast.ron = k.character('ron', { x: 210, y: 390, w: 230 });
        cast.tree = k.prop('christmasTree', { x: 360, y: 50, w: 460, z: 11 });
        bare(k, cast.tree);
        cast.hagrid = k.character('hagrid', { x: 880, y: 360, w: 280, flip: true, z: 12 });
        cast.dumbledore = k.character('dumbledore', { x: 470, y: 380, w: 240, z: 8 });
        k.set(cast.dumbledore, { opacity: 0 });
        cast.ball = k.prop('snowball', { x: 150, y: 520, w: 110, z: 20 });
        k.set(cast.ball, { opacity: 0 });
      },
      async play(k) {
        const { harry, ron, tree, hagrid, dumbledore, ball } = cast;
        const snow = k.part(tree, 'snow');
        const branches = k.pivot(k.part(tree, 'branches'));
        await k.wait(400);
        await k.say('frontDoors');

        // One, two, three… HEAVE! In it goes, and jams.
        await k.say('heave', hagrid);
        k.fx.stomp(2, 0.3);
        await k.all(k.walk(hagrid, -50, 0.6, 2), k.to(tree, 0.6, { scale: 0.93, y: -20, ease: 'power2.out' }));
        k.fx.creak();
        await k.shake(tree, 4, 3);
        await k.all(k.say('stuck', ron), k.shake(ron, 4, 2));
        await k.all(k.say('cantBeStuck', hagrid), k.shake(hagrid, 5, 2));

        // He pushes again… boing! The tree springs back and Hagrid sits down in the snow.
        k.fx.stomp(2, 0.3);
        await k.shake(tree, 6, 2);
        k.fx.boing();
        await k.all(k.to(tree, 0.4, { scale: 1, y: 0, ease: 'back.out(2)' }), k.walk(hagrid, 70, 0.4, 1));
        k.fx.thud();
        void k.quake(4);
        k.puff(1020, 640, 200, '#ffffff');
        await k.to(hagrid, 0.3, { y: 50, rotation: -6, ease: 'power2.in' });
        sounds.bellyLaugh();
        await k.say('whoops', hagrid);
        await k.say('allRight', harry);
        await k.to(hagrid, 0.5, { y: 0, rotation: 0 });
        k.silence();
        await k.say('noTree', hagrid);
        await k.wait(700);

        // Ron sees why: the snow makes it too fat.
        k.music('cosy');
        await k.say('fullOfSnow', ron);
        await k.say('knockOff', harry);

        // His first turn: drag Harry's snowball to the tree.
        await k.fade(ball, 1, 0.3);
        const how = await k.dragToHelp(ball, { to: tree, ask: 'askSnowball', nudge: 'nudgeSnowball', helped: 'helpedSnowball', by: harry, helper: ron, dropSize: 220 });
        await k.vanish(ball);
        k.puff(590, 400, 150, '#ffffff');
        whumph();
        await k.all(
          k.to(snow, 0.9, { y: 160, opacity: 0, ease: 'power2.in' }),
          k.wait(250).then(() => k.to(branches, 0.4, { scaleX: 0.7, ease: 'back.out(2)' })),
        );
        k.puff(590, 640, 260, '#ffffff');
        await k.wait(300);
        await k.all(k.say('blimey', hagrid), k.wait(300).then(() => k.hop(hagrid, 20)));

        // One more heave, and in it slides.
        k.music('adventure');
        await k.say('heave', hagrid);
        k.fx.stomp(2, 0.3);
        k.sfx.whoosh();
        await k.all(k.walk(hagrid, -60, 0.6, 2), k.to(tree, 1.1, { scale: 0.6, y: -60, opacity: 0, ease: 'power2.in' }));
        k.fx.pop();
        k.sparkle(590, 400, 14, 200);
        laugh();
        await k.all(k.say('itsIn', ron), k.hop(ron, 28, 2), k.wait(200).then(() => k.hop(harry, 28, 2)));
        await k.say(how === 'dragged' ? 'bestSnowball' : 'ronsSnowball', hagrid);

        // Dumbledore in the doorway.
        k.fx.twinkle();
        await k.fade(dumbledore, 1, 0.8);
        await k.say('splendid', dumbledore);
        k.music('dreamy');
        await k.say('bedtime', dumbledore);
        await k.wait(800);
      },
    },

    // ==================================================== 3. Presents!
    {
      name: 'Presents!',
      set(k) {
        k.backdrop('dormitory');
        k.music('dreamy');
        cast.harry = k.character('harry', { x: 300, y: 390, w: 240 });
        cast.ron = k.character('ron', { x: 790, y: 390, w: 240 });
        cast.pile = k.prop('present', { x: 560, y: 520, w: 150, z: 14 });
        cast.gift2 = k.prop('present', { x: 520, y: 590, w: 110, z: 15 });
        cast.gift3 = k.prop('present', { x: 650, y: 580, w: 120, z: 15 });
        cast.jumper = k.prop('jumper', { x: 520, y: 400, w: 200, z: 16 });
        k.set(cast.jumper, { opacity: 0 });
      },
      async play(k) {
        const { harry, ron, pile, gift2, gift3, jumper } = cast;
        await k.wait(500);
        await k.say('morning');
        k.music('magic');
        await k.all(k.say('happyChristmas', ron), k.wait(300).then(() => k.hop(ron, 30, 2)));
        await k.say('sleepy', harry);
        await k.all(k.say('lookPresents', ron), k.wait(300).then(() => k.hop(ron, 24)));
        k.fx.twinkle();
        await k.all(k.say('forMe', harry), k.shake(harry, 4, 2));

        // His second turn: open the presents.
        await k.tapToHelp(pile, { ask: 'askPresents', nudge: 'nudgePresents', helped: 'helpedPresents', by: harry, helper: ron, size: 240 });
        rip();
        k.confetti(24);
        await k.all(k.vanish(pile), k.vanish(gift2), k.vanish(gift3));
        k.sfx.reveal();
        await k.all(k.fade(jumper, 1, 0.4), k.to(jumper, 0.6, { y: -40, ease: 'back.out(1.6)' }));
        k.sparkle(620, 440, 12, 160);
        await k.all(k.say('aJumper', harry), k.wait(300).then(() => k.hop(harry, 26)));
        await k.say('mumKnits', ron);
        await k.say('knittedForMe', harry);

        // Harry holds it up.
        k.sfx.whoosh();
        await k.to(jumper, 0.7, { x: -190, y: 120, ease: 'power2.inOut' });
        k.fx.pop();
        await k.all(k.say('itFits', ron), k.hop(ron, 24));
        k.music('dreamy');
        await k.wait(500);
        await k.say('firstPresent', harry);
        await k.wait(900);
        await k.all(k.say('dinner', ron), k.wait(300).then(() => k.hop(ron, 26)));
        await k.wait(500);
      },
    },

    // ==================================================== 4. Crackers
    {
      name: 'Crackers',
      set(k) {
        k.backdrop('great-hall');
        cast.tree = k.prop('christmasTree', { x: 900, y: 150, w: 290, z: 9 });
        const a = greatHall.set(k, {
          host: { id: 'dumbledore', x: 470 },
          guests: [{ id: 'harry', x: 40 }, { id: 'ron', x: 250 }, { id: 'hagrid', x: 690, w: 220, y: 370, flip: true }],
          music: 'magic',
        });
        cast.dumbledore = a.host!;
        [cast.harry, cast.ron, cast.hagrid] = a.guests;
        hall = a;
        cast.star = k.prop('star', { x: 745, y: 525, w: 110, z: 19 });
        k.set(k.part(cast.tree, 'star'), { opacity: 0 });
        cast.cracker = k.prop('cracker', { x: 180, y: 520, w: 240, z: 17 });
        cast.hat = k.prop('admiralHat', { x: 65, y: 372, w: 150, z: 18 });
        cast.bonnet = k.prop('flowerBonnet', { x: 495, y: 335, w: 170, z: 18 });
        cast.mouse = k.prop('whiteMouse', { x: 220, y: 540, w: 80, z: 17 });
        cast.mouse2 = k.prop('whiteMouse', { x: 260, y: 545, w: 70, z: 17 });
        cast.mouse3 = k.prop('whiteMouse', { x: 190, y: 548, w: 66, z: 17, flip: true });
        for (const el of [cast.hat, cast.bonnet, cast.mouse, cast.mouse2, cast.mouse3]) k.set(el, { opacity: 0 });
      },
      async play(k) {
        const { harry, ron, hagrid, dumbledore, tree, star, cracker, hat, bonnet, mouse, mouse2, mouse3 } = cast;
        await k.wait(500);
        await k.say('feast');
        await greatHall.play(k, hall, { welcome: 'tuckIn', food: ['pie', 'birthdayCake', 'pumpkin', 'pie'] });
        await k.all(k.say('myTree', hagrid), k.shake(tree, 3, 2));

        // His third turn: drag the star up to the top of the tree.
        await k.dragToHelp(star, { to: [1045, 215], ask: 'askStar', nudge: 'nudgeStar', helped: 'helpedStar', by: hagrid, dropSize: 200 });
        k.remove(star);
        k.set(k.part(tree, 'star'), { opacity: 1 });
        k.sfx.sparkle();
        k.sparkle(1045, 215, 16, 220);
        await k.say('starOn', dumbledore);
        await k.wait(300);

        // His fourth turn: the wizard cracker.
        await k.say('crackers', ron);
        await k.tapToHelp(cracker, { ask: 'askCracker', nudge: 'nudgeCracker', helped: 'helpedCracker', by: ron, helper: harry, size: 220 });
        const left = k.part(cracker, 'left');
        const right = k.part(cracker, 'right');
        k.fx.drumroll(0.6);
        await k.all(k.to(left, 0.6, { x: -30, ease: 'power1.in' }), k.to(right, 0.6, { x: 30, ease: 'power1.in' }));
        crackerBang();
        void k.quake(3);
        k.puff(300, 520, 220, '#8fb3e8');
        await k.all(k.to(left, 0.3, { x: -120, opacity: 0 }), k.to(right, 0.3, { x: 120, opacity: 0 }));
        await k.wait(300);

        // An admiral's hat lands on Harry, and out scamper the mice.
        k.set(hat, { y: -260 });
        k.fade(hat, 1, 0.2);
        await k.to(hat, 0.6, { y: 0, ease: 'bounce.out' });
        k.fx.pop();
        await k.all(k.say('aHat', harry), k.shake(harry, 4, 2));
        sounds.squeak(3, 0.14);
        await k.all(k.fade(mouse, 1, 0.2), k.fade(mouse2, 1, 0.2), k.fade(mouse3, 1, 0.2));
        await k.all(k.walk(mouse, 140, 0.8, 4), k.walk(mouse2, 220, 1, 5), k.walk(mouse3, -120, 0.8, 4));
        giggle();
        await k.all(k.say('mice', ron), k.hop(ron, 26));

        // Dumbledore's cracker: a flowery bonnet.
        crackerBang();
        k.puff(590, 540, 180, '#e8b3c8');
        await k.wait(400);
        k.set(bonnet, { y: -200 });
        k.fade(bonnet, 1, 0.2);
        await k.to(bonnet, 0.6, { y: 0, ease: 'bounce.out' });
        k.fx.twinkle();
        await k.say('bonnet', dumbledore);
        sounds.bellyLaugh();
        laugh();
        await k.all(k.say('suitsYou', hagrid), k.hop(hagrid, 20, 2), k.wait(200).then(() => k.hop(harry, 24)), k.wait(400).then(() => k.hop(ron, 24)));
        await k.wait(700);
      },
    },

    // ==================================================== 5. The best Christmas
    {
      name: 'The best Christmas',
      set(k) {
        k.backdrop('common-room');
        k.music('cosy');
        k.light(560, 480, 300, { color: '#ffb347', strength: 0.35, flicker: true, z: 5 });
        cast.harry = k.character('harry', { x: 170, y: 400, w: 240 });
        cast.jumper = k.prop('jumper', { x: 205, y: 545, w: 170, z: 12 });
        cast.ron = k.character('ron', { x: 700, y: 400, w: 240 });
        cast.mouse = k.prop('whiteMouse', { x: 600, y: 560, w: 110, z: 14 });
        k.set(cast.mouse, { opacity: 0, y: 40 });
      },
      async play(k) {
        const { harry, ron, mouse } = cast;
        sounds.fireCrackle(6);
        await k.wait(800);
        await k.say('night');
        await k.say('bestEver', harry);
        await k.all(k.say('toldYou', ron), k.wait(300).then(() => k.hop(ron, 22)));
        await k.wait(400);

        // Squeak! A white mouse shivers on the rug.
        sounds.squeak(2);
        await k.all(k.fade(mouse, 1, 0.3), k.to(mouse, 0.4, { y: 0, ease: 'back.out(2)' }));
        await k.all(k.say('followedUs', ron), k.shake(ron, 4, 2));

        // His fifth turn: drag the mouse onto Harry's warm lap.
        await k.dragToHelp(mouse, { to: [290, 630], ask: 'askMouse', nudge: 'nudgeMouse', helped: 'helpedMouse', by: ron, helper: harry, dropSize: 200 });
        sounds.squeak(1);
        await k.all(k.say('mouseCosy', harry), k.hop(mouse, 12));
        giggle();
        laugh();
        await k.all(k.hop(harry, 22), k.wait(200).then(() => k.hop(ron, 22)));
        sounds.fireCrackle(5);
        await k.say('thankYou', harry);
        k.music('dreamy');
        k.ambient('snow', { count: 14, area: [40, 120, 220, 260] });
        await k.say('end');
        k.sparkle(560, 380, 14, 220);
        await k.wait(1500);
      },
    },
  ],
});
