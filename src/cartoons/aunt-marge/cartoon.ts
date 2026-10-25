/**
 * Aunt Marge Floats Away: Uncle Vernon's bossy sister comes to stay with her
 * bulldog, Harry has to be very good for a week, and the last night does not go
 * to plan. (Harry's dad's old friends would call it "an accident".)
 *
 *   1. Aunt Marge arrives (the hall). Uncle Vernon says his sister Marge is
 *      coming for a whole WEEK, and Harry must be on his best behaviour: if he
 *      is good, Vernon may sign his form to visit the wizard village. Ding-dong:
 *      Ripper the bulldog bursts in, barking, and chases Harry round the hall
 *      until Harry hops up onto the stairs. Then Aunt Marge sweeps in and gives
 *      Dudley a squashing hug ("Mmmf"). "YOU! Still here, are you?" Harry
 *      carries her enormous suitcase upstairs, with a groan, a stagger and a puff
 *      (deed: Harry, k.carry), muttering "Being good. Being VERY good."
 *   2. The balloon (the lounge). A week of being good later, it is the last
 *      night. Ripper slurps tea from a saucer at Aunt Marge's feet. She is rude
 *      about Harry's mum and dad ("a bad lot": never about Harry himself, and no
 *      one says anyone died). Harry counts to ten with his eyes shut; at
 *      "three" he can't stand it any more: "Don't you DARE talk about my mum and
 *      dad like that!" A rising whistle: Marge goes pink, buttons ping off, she
 *      swells into a great round balloon, and floats up out of her chair. Vernon
 *      grabs her ankle and holds on; Ripper spins in circles; Petunia calls
 *      "Come down this instant!"; and Vernon is much too heavy for the wrong
 *      reason: she is too FLOATY. He lets go onto the sofa with a soft thump, and
 *      she bobs out of the window and away, calling "Vernooooon!". Uh-oh. Harry
 *      did magic away from school.
 *   3. Out into the night (the hall, then Privet Drive). Vernon storms in,
 *      purple: "Put her right!" Harry has had enough. He takes his trunk and
 *      Hedwig's empty cage and walks out (deed: Harry, k.carry; the door
 *      slams). On the dark street he sits on his trunk with nowhere to go.
 *      Something rustles in the hedge: two pale eyes, a low growl (the scary
 *      beat, short). Harry stumbles back onto the trunk and his wand arm
 *      flies out... BANG! The Knight Bus screeches in and the eyes are gone.
 *      Stan Shunpike hops down: "Just stick out your wand hand!" (turning
 *      point: Harry's own hand brought the bus). "What's your name?" "Er...
 *      Neville Longbottom." Harry heaves his trunk onto the bus (deed:
 *      Harry, k.carry) and climbs aboard.
 *   4. The Knight Bus. The bus lurches (BANG, a sideways skid, everyone
 *      wobbles, nobody falls) and squeezes between two lamp posts ("Breathe
 *      in!"). Stan brings a hot chocolate; the bus lurches again and Harry
 *      holds the mug steady (deed: Harry, k.carry and flourish): "Not a drop
 *      spilt!" Stan's newspaper says a lady in Little Whinging blew up like a
 *      balloon: "Right as rain! The Ministry let her down. Psssst!" Harry giggles
 *      with relief. Next stop, London. Harry lies back on his bed and falls
 *      asleep as the night streams past, and the Knight Bus goes BANG all the
 *      way there.
 *
 * Safety: Aunt Marge is rude, never cruel. She never mocks Harry's looks, only
 * calls his mum and dad "a bad lot", and nobody says they died. Her swelling is
 * silly and she is cross and surprised, never hurt; Stan says she was let down
 * safely. Vernon hangs on and flops onto the sofa. Ripper growls and chases
 * but never bites. The dark dog in the hedge is only two pale eyes and a soft
 * growl, one short beat, and it is gone the instant the bus arrives.
 *
 * Staging: the four-on-stage limit counts Ripper. In scene 1 Petunia and the
 * sofa trio stay out (Petunia has no lines there) and Ripper trots off before
 * Marge sweeps in; in scene 2 Dudley stays out, Harry slips away at the
 * balloon so that Petunia can come in, and Harry comes back for "Uh-oh".
 *
 * One-off here (art.ts): the form, Marge's suitcase, her teacup, Ripper's
 * saucer, the buttons, the mug, Stan's newspaper and the brass bed. One-off
 * sounds (sounds.ts): the balloon whistle, button pings, barks and growls,
 * slurping, the doorbell, Harry's groan, the bus's brakes and lurches.
 * Borrowed from the Hogwarts world: the Dursleys, Aunt Marge (and her
 * `swollen` pose), Ripper, Stan, the Knight Bus, the trunk, the cage and the
 * street lamp. The dog in the hedge is only its two pale eyes (drawn here,
 * not the whole blackDog prop, which shows its whole shaggy shape).
 */
import { defineCartoon, type Kit } from '../../kit';
import { sounds as commonSounds } from '../../worlds/common/moves';
import { bed, button, eyes, form, mug, newspaper, saucer, suitcase, teacup } from './art';
import { bark, brakes, doorbell, groan, growl, inflate, lurch, ping, slosh, slurp, squeak } from './sounds';
import meta from './meta';

const { giggle, slam } = commonSounds;

type Actor =
  | 'vernon' | 'petunia' | 'dudley' | 'harry' | 'marge' | 'ripper' | 'stan'
  | 'form' | 'suitcase' | 'cup' | 'saucer' | 'trunk' | 'cage' | 'dog' | 'bus' | 'mug' | 'paper' | 'bed' | 'lamp' | 'pool';
const cast = {} as Record<Actor, HTMLElement>;

/** Vernon goes purple (or back to pink). */
function purple<K extends string>(k: Kit<K>, vernon: HTMLElement, on = true): Promise<void> {
  return k.to(k.part(vernon, 'cross'), 0.6, { opacity: on ? 1 : 0 });
}

/** The middle of an actor on the stage, from its box. */
function middle<K extends string>(k: Kit<K>, el: HTMLElement): [number, number] {
  const b = k.box(el);
  return [b.x + b.w / 2, b.y + b.h / 2];
}

/** A button pings off Aunt Marge, spins through the air and fades. */
async function popButton<K extends string>(k: Kit<K>, from: HTMLElement, dx: number, dy: number, high = false): Promise<void> {
  const [cx, cy] = middle(k, from);
  const b = k.add(button(), { x: cx - 20, y: cy - 20, w: 40, z: 22 });
  ping(high);
  k.fx.pop();
  void k.to(b, 0.9, { x: dx, y: dy, rotation: 540, ease: 'power1.out' });
  await k.wait(300);
  void k.fade(b, 0, 0.5).then(() => k.remove(b));
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. Aunt Marge arrives
    margeComing: { who: 'vernon', text: 'My sister Marge is coming to stay. For a whole WEEK.' },
    bestBehaviour: { who: 'vernon', text: 'And you, boy, will be on your very best behaviour.' },
    form: { who: 'harry', text: 'If I’m good all week, will you sign my form? So I can visit the wizard village with my friends?' },
    maybe: { who: 'vernon', text: 'Maybe. IF you’re good. And Marge mustn’t know about your… you know. Magic.' },
    dudders: { who: 'auntMarge', text: 'Where’s my Dudders? Where’s my neffy-poo?' },
    squashed: { who: 'dudleyBig', text: 'Hello, Aunt Marge. Mmmf.' },
    stillHere: { who: 'auntMarge', text: 'YOU! Still here, are you?' },
    yes: { who: 'harry', text: 'Yes, Aunt Marge.' },
    suitcase: { who: 'auntMarge', text: 'Well, don’t just stand there. Take my suitcase upstairs!' },
    beingGood: { who: 'harry', text: 'Being good. Being good. Being VERY good.' },
    // 2. The balloon
    week: { who: 'narrator', text: 'For a whole week, Harry was good. Very, very good. Until the last night.' },
    rippy: { who: 'auntMarge', text: 'Who’s a good boy? Mummy’s little Rippy-pippy!' },
    sendAway: { who: 'auntMarge', text: 'That boy should have been sent away years ago, Vernon.' },
    badLot: { who: 'auntMarge', text: 'His mum and dad were a bad lot, you know. A bad, BAD lot!' },
    notTrue: { who: 'harry', text: 'That’s not true.' },
    quiet: { who: 'vernon', text: 'Quiet, boy! Remember your form!' },
    count: { who: 'harry', text: 'Being good. Count to ten. One… two… three…' },
    goodForNothing: { who: 'auntMarge', text: 'Good-for-nothings, the pair of them!' },
    dontYouDare: { who: 'harry', text: 'Don’t you DARE talk about my mum and dad like that!' },
    whatsHappening: { who: 'auntMarge', text: 'Vernon! What’s HAPPENING to me?' },
    floating: { who: 'auntMarge', text: 'I’m… I’m FLOATING!' },
    holdOn: { who: 'vernon', text: 'Hold on, Marge! I’ve got you!' },
    comeDown: { who: 'petunia', text: 'Marge! Come down this instant!' },
    slipping: { who: 'vernon', text: 'She’s… too… FLOATY!' },
    byeee: { who: 'auntMarge', text: 'Vernooooon!' },
    uhOh: { who: 'harry', text: 'Uh-oh. I did magic. I’m not allowed to do magic away from school!' },
    // 3. Out into the night
    putHerRight: { who: 'vernon', text: 'YOU! Bring her back! Put her right this minute!' },
    going: { who: 'harry', text: 'No. I’ve had enough. Nobody talks about my mum and dad like that.' },
    alone: { who: 'narrator', text: 'Harry sat on his trunk in the dark. Where could he go now?' },
    nowhere: { who: 'harry', text: 'I can’t go back. I can’t go to Hogwarts yet. What do I do?' },
    whosThere: { who: 'harry', text: 'Who’s… who’s there?' },
    welcome: { who: 'stan', text: 'Welcome to the Knight Bus! Help for any witch or wizard who’s stuck.' },
    stanWandHand: { who: 'stan', text: 'Just stick out your wand hand, and we’ll take you anywhere! I’m Stan.' },
    harryWandHand: { who: 'harry', text: 'My wand hand… I did, didn’t I!' },
    name: { who: 'stan', text: 'And what’s your name, then?' },
    neville: { who: 'harry', text: 'Better not say my real name. Er… Neville. Neville Longbottom.' },
    rightYou: { who: 'stan', text: 'Right you are, Neville! In you get!' },
    // 4. The Knight Bus
    stanHoldOn: { who: 'stan', text: 'Hold on to your bed, Neville! Ernie drives a bit fast!' },
    whoa: { who: 'harry', text: 'Whoa!' },
    squeeze: { who: 'stan', text: 'Squeezing between two lamp posts! Breathe in!' },
    cocoa: { who: 'stan', text: 'Fancy a hot chocolate?' },
    notSpilt: { who: 'harry', text: 'Ha! Not a drop spilt!' },
    news: { who: 'stan', text: 'Here, Neville. You hear about the lady in Little Whinging? Blew up like a balloon!' },
    isSheOk: { who: 'harry', text: 'Is she all right?' },
    rightAsRain: { who: 'stan', text: 'Right as rain! The Ministry caught her and let her down. Psssst! Like a balloon!' },
    phew: { who: 'harry', text: 'Phew. Oops.' },
    nextStop: { who: 'stan', text: 'Next stop, London! The Leaky Cauldron!' },
    sleepy: { who: 'harry', text: 'London. And then, Hogwarts.' },
    end: { who: 'narrator', text: 'And the Knight Bus went BANG, all the way to London.' },
  },
  scenes: [
    // ============================================ 1. Aunt Marge arrives
    {
      name: 'Aunt Marge arrives',
      set(k) {
        k.backdrop('dursley-hall');
        k.music('cosy');
        cast.dudley = k.character('dudleyBig', { x: 300, y: 372, w: 250, z: 14 });
        cast.vernon = k.character('vernon', { x: 500, y: 372, w: 250 });
        cast.harry = k.character('harry', { x: 690, y: 428, w: 200, pose: 'muggle' });
        cast.form = k.add(form(), { x: 740, y: 540, w: 100, z: 16 });
        k.set(cast.form, { opacity: 0 });
        // Ripper and Aunt Marge come in from the front door, on the left.
        cast.ripper = k.character('ripper', { x: 80, y: 462, w: 170, z: 14, flip: true });
        cast.marge = k.character('auntMarge', { x: 70, y: 349, w: 270, z: 13 });
        cast.suitcase = k.add(suitcase(), { x: 830, y: 450, w: 300, z: 15 });
        k.set([cast.ripper, cast.marge, cast.suitcase], { opacity: 0 });
      },
      async play(k) {
        const { vernon, harry, dudley, ripper, marge, suitcase: case_, form: paper } = cast;
        await k.wait(400);
        await k.say('margeComing', vernon);
        await k.say('bestBehaviour', vernon);

        // Harry holds up his form.
        k.sfx.page();
        await k.appear(paper, 0.4);
        await k.say('form', harry);
        await k.say('maybe', vernon);
        await k.vanish(paper, 0.3);

        // Ding-dong. The door opens, and Ripper bursts in, barking.
        doorbell();
        await k.wait(1300);
        k.fx.creak();
        await k.wait(500);
        k.music('sneaky');
        bark(2);
        await k.enter(ripper, 'left', 0.5);
        k.fx.patter(6);
        // He chases Harry round the hall: Harry runs ahead, then hops up onto the stairs.
        const [hx, hy] = [110, -410];
        void k.to(harry, 0.7, { x: 70, ease: 'power1.in' });
        await k.to(ripper, 0.9, { x: 400, ease: 'power1.in' });
        bark(3);
        k.fx.boing();
        await k.all(k.to(harry, 0.6, { x: hx, y: hy, scale: 0.9, ease: 'power2.out' }), k.to(ripper, 0.6, { x: 560 }));
        // Ripper barks round the bottom of the stairs, twice.
        for (let i = 0; i < 2; i++) {
          k.face(ripper, false);
          bark(1);
          await k.to(ripper, 0.45, { x: 380 });
          k.face(ripper, true);
          bark(1);
          await k.to(ripper, 0.45, { x: 560 });
        }
        growl(0.9);
        await k.shake(harry, 4, 3);
        // Ripper trots off to sniff the kitchen.
        k.face(ripper, true);
        k.fx.patter(4);
        await k.exit(ripper, 'right', 0.8);
        k.remove(ripper);
        await k.wait(400);

        // Aunt Marge sweeps in and squashes Dudley in a hug.
        k.fx.creak();
        k.set(marge, { x: -520 });
        await k.wait(300);
        k.fx.stomp(3, 0.3);
        k.set(marge, { opacity: 1 });
        await k.all(k.wait(500).then(() => k.say('dudders', marge)), k.to(marge, 1.3, { x: 0, ease: 'power2.out' }));
        k.fx.thud();
        // The hug: Dudley is squashed flat.
        await k.to(marge, 0.35, { x: 70 });
        squeak();
        await k.all(k.to(dudley, 0.3, { scaleX: 0.7, scaleY: 1.06, ease: 'power2.out' }), k.pop(marge, 1.1));
        await k.say('squashed', dudley);
        await k.to(dudley, 0.4, { scaleX: 1, scaleY: 1, ease: 'back.out(2)' });
        await k.to(marge, 0.4, { x: 30 });

        // "YOU! Still here, are you?" Harry comes down from the stairs.
        k.music('cosy');
        await k.to(harry, 0.4, { x: 0, y: 0, scale: 1, ease: 'power2.in' });
        k.fx.thud();
        await k.say('stillHere', marge);
        await k.say('yes', harry);
        await k.say('suitcase', marge);
        k.fx.thud();
        await k.appear(case_, 0.4);

        // The deed: Harry heaves the enormous suitcase up the stairs.
        await k.carry(case_, harry, 0.8);
        groan();
        const steps: [number, number, number][] = [[35, -110, -6], [70, -230, 6], [110, -330, -5]];
        for (const [x, y, r] of steps) {
          await k.all(k.to(harry, 0.7, { x, y, rotation: r, ease: 'power1.inOut' }), k.to(case_, 0.7, { x, y, rotation: r * 2, ease: 'power1.inOut' }));
          k.fx.thud();
          await k.shake(harry, 3, 2);
          groan();
        }
        await k.all(k.to(harry, 0.5, { x: hx, y: hy, rotation: 0, scale: 0.9 }), k.to(case_, 0.5, { x: hx, y: hy, rotation: 0, scale: 0.8 }));
        k.puff(middle(k, harry)[0], middle(k, harry)[1] + 80, 150, '#d8c9b8');
        k.fx.poof();
        await k.say('beingGood', harry);
        await k.wait(600);
      },
    },

    // ================================================= 2. The balloon
    {
      name: 'The balloon',
      set(k) {
        k.backdrop('dursley-lounge');
        k.music('cosy');
        cast.vernon = k.character('vernon', { x: 435, y: 372, w: 250, z: 13 });
        cast.marge = k.character('auntMarge', { x: 805, y: 330, w: 250, z: 12 });
        cast.ripper = k.character('ripper', { x: 670, y: 467, w: 170, z: 14, flip: true });
        cast.saucer = k.add(saucer(), { x: 800, y: 628, w: 110, z: 15 });
        cast.cup = k.add(teacup(), { x: 905, y: 505, w: 90, z: 16 });
        cast.harry = k.character('harry', { x: 990, y: 440, w: 190, pose: 'muggle', z: 10 });
        cast.petunia = k.character('petunia', { x: 940, y: 383, w: 240, flip: true, z: 9 });
        k.set(cast.petunia, { opacity: 0 });
      },
      async play(k) {
        const { vernon, marge, ripper, cup, harry, petunia } = cast;
        await k.wait(400);
        await k.say('week');
        await k.wait(300);

        // Ripper slurps tea from his saucer, with a drooly lick.
        slurp();
        void k.to(ripper, 0.22, { y: '+=10', yoyo: true, repeat: 5 });
        void k.to(k.part(ripper, 'mouthOpen'), 0.2, { opacity: 1, yoyo: true, repeat: 5 });
        await k.wait(1400);
        await k.say('rippy', marge);
        growl(1.1);
        await k.all(k.shake(ripper, 4, 4), k.shake(harry, 3, 3));
        await k.wait(300);
        await k.say('sendAway', marge);
        await k.say('badLot', marge);
        await k.all(k.say('notTrue', harry), k.shake(harry, 3, 3));
        await k.all(k.say('quiet', vernon), purple(k, vernon));
        await purple(k, vernon, false);

        // Harry shuts his eyes and counts.
        const lids = k.part(harry, 'lids');
        await k.to(lids, 0.2, { opacity: 1 });
        await k.say('count', harry);
        await k.say('goodForNothing', marge);
        await k.to(lids, 0.2, { opacity: 0 });
        await k.all(k.say('dontYouDare', harry), k.shake(harry, 6, 3));
        k.music('sneaky');
        await k.wait(500);

        // The balloon: a rising whistle, buttons ping off, and Aunt Marge swells.
        inflate(3.4);
        await k.to(marge, 0.8, { scale: 1.12, ease: 'power1.in' });
        k.sparkle(k.box(marge).x + 125, k.box(marge).y + 80, 6, 60);
        void k.vanish(cup, 0.3);
        void popButton(k, marge, -260, -160);
        await k.to(marge, 0.7, { scale: 1.28, ease: 'power1.in' });
        k.pose(marge, 'swollen');
        await k.pop(marge, 1.1);
        void popButton(k, marge, 120, -260, true);
        await k.to(marge, 0.7, { scale: 1.42, ease: 'power1.in' });
        void popButton(k, marge, 330, -120);
        await k.to(marge, 0.7, { scale: 1.6, ease: 'power1.in' });
        k.fx.boing();
        await k.wait(400);
        await k.say('whatsHappening', marge);

        // She rises out of her chair, bobbing, and drifts towards the window.
        k.fx.whizz();
        await k.to(marge, 1.6, { y: -190, ease: 'sine.inOut' });
        await k.all(k.say('floating', marge), k.to(marge, 2.6, { x: -330, ease: 'sine.inOut' }));
        // Vernon jumps up and catches her ankle; Harry slips away and Petunia comes in.
        const [mx] = middle(k, marge);
        await k.to(vernon, 0.4, { x: mx - 130 - 560, ease: 'power1.inOut' });
        k.fx.boing();
        await k.to(vernon, 0.3, { y: -70, ease: 'power2.out' });
        gsapStretch(k, vernon);
        void k.exit(harry, 'right', 0.6);
        await k.say('holdOn', vernon);
        // Ripper barks and spins on the spot.
        bark(3);
        void k.spin(ripper, 2, 1.1);
        k.set(petunia, { opacity: 1 });
        await k.all(k.say('comeDown', petunia), k.appear(petunia, 0.4));
        await k.wait(200);

        // Aunt Marge floats to the window; Vernon is dragged along.
        void k.to(marge, 1.8, { x: -690, y: -230, ease: 'sine.inOut' });
        await k.to(vernon, 1.8, { x: -330, ease: 'sine.inOut' });
        await k.say('slipping', vernon);
        // He lets go: a soft landing on the sofa.
        await k.to(vernon, 0.35, { y: 25, scaleY: 1, ease: 'power2.in' });
        k.fx.thud();
        await k.pop(vernon, 1.06);
        // She bobs away out of the window, getting smaller.
        k.sfx.whoosh();
        await k.all(k.say('byeee', marge), k.to(marge, 2.8, { scale: 0.08, ease: 'power2.in' }));
        await k.to(marge, 0.4, { opacity: 0 });
        k.remove(marge);

        // A quiet beat. Harry comes back.
        await k.wait(1000);
        await k.enter(harry, 'right', 0.6);
        await k.to(harry, 1, { x: '-=500', ease: 'power1.inOut' });
        await k.say('uhOh', harry);
        await k.wait(700);
      },
    },

    // ================================================= 3. Out into the night
    {
      name: 'Out into the night',
      set(k) {
        k.backdrop('dursley-hall');
        k.music('sneaky');
        cast.harry = k.character('harry', { x: 220, y: 406, w: 220, pose: 'muggle' });
        cast.trunk = k.prop('trunk', { x: 460, y: 520, w: 200, z: 12 });
        cast.cage = k.prop('owlCage', { x: 660, y: 505, w: 100, z: 12 });
        cast.vernon = k.character('vernon', { x: 690, y: 360, w: 260, flip: true });
        k.set(cast.vernon, { opacity: 0 });
      },
      async play(k) {
        const { harry, vernon, trunk, cage } = cast;
        await k.wait(500);
        // Vernon storms in, purple.
        k.fx.stomp(4, 0.28);
        await k.all(k.enter(vernon, 'right', 0.7), purple(k, vernon));
        await k.all(k.say('putHerRight', vernon), k.shake(vernon, 6, 3));
        await k.say('going', harry);

        // The deed: Harry takes his cage and his trunk, and walks out of the front door.
        await k.carry(cage, [270, 560], 0.7);
        await k.carry(trunk, [390, 560], 0.7);
        await k.wait(400);
        k.fx.creak();
        k.fx.patter(5);
        await k.all(k.to([harry, trunk, cage], 1.5, { x: '-=700', ease: 'power1.in' }));
        slam();
        await k.quake(6);
        await k.wait(500);

        // The empty street at night: Harry on his trunk.
        await k.cut(() => {
          k.backdrop('privet-drive-night');
          k.music('dreamy');
          cast.lamp = k.prop('streetLamp', { x: 60, y: 240, w: 120, z: 4 });
          cast.pool = k.light(120, 364, 150, { color: '#ffe9a8', strength: 0.45, z: 5 });
          cast.dog = k.add(eyes(), { x: 960, y: 555, w: 130, z: 9 });
          k.set(cast.dog, { opacity: 0 });
          cast.trunk = k.prop('trunk', { x: 230, y: 520, w: 200, z: 10 });
          cast.cage = k.prop('owlCage', { x: 440, y: 520, w: 100, z: 10 });
          cast.harry = k.character('harry', { x: 230, y: 360, w: 200, pose: 'muggle', z: 12 });
          cast.bus = k.prop('knightBus', { x: 1300, y: 145, w: 460, z: 11 });
          cast.stan = k.character('stan', { x: 540, y: 400, w: 230, z: 14 });
          k.set(cast.stan, { opacity: 0 });
        });
        const { harry: h2, trunk: t2, cage: c2, dog, bus, stan, lamp } = cast;
        void lamp;
        await k.wait(700);
        await k.say('alone');
        await k.say('nowhere', h2);

        // The scary beat, short: a rustle in the hedge, two pale eyes, a soft growl.
        k.silence();
        await k.wait(400);
        k.sfx.rustle();
        await k.wait(700);
        k.sfx.rustle();
        await k.all(k.fade(dog, 1, 1.2), k.camera({ zoom: 1.35, x: 640, y: 480 }, 1.4));
        growl(1.3);
        await k.wait(400);
        await k.say('whosThere', h2);
        // Harry steps back, trips over his trunk and sits down hard on it, his wand hand flying out.
        await k.to(h2, 0.3, { x: '-=40', y: '-=70', rotation: -14, ease: 'power2.out' });
        await k.to(h2, 0.2, { x: 0, y: 0, rotation: 0, ease: 'power2.in' });
        k.fx.thud();
        const [wand] = k.pivot(k.part(h2, 'wand'));
        void k.to(wand, 0.25, { rotation: -70, ease: 'back.out(2)' });
        await k.wait(500);

        // BANG! The Knight Bus screeches in from the right, and the eyes are gone.
        k.sfx.boom();
        k.fx.whizz();
        brakes();
        void k.camera({}, 0.4);
        void k.fade(dog, 0, 0.3).then(() => k.remove(dog));
        const wheels = k.pivot(k.part(bus, 'wheels'));
        void k.to(wheels, 1.4, { rotation: -900, ease: 'power3.out' });
        void k.fade(k.part(bus, 'lamps'), 1, 0.5);
        await k.to(bus, 1.4, { x: -580, ease: 'power3.out' });
        k.quake(6);
        k.puff(1050, 690, 200, '#8a8aa0');
        // The bus is here: Harry's wand hand comes down, so it never points at Stan.
        void k.to(wand, 0.4, { rotation: 0, ease: 'power1.out' });
        await k.wait(500);

        // Stan hops down from the door.
        k.music('adventure');
        k.set(stan, { opacity: 1, x: 300, y: -20 });
        k.fx.boing();
        await k.to(stan, 0.5, { x: 0, y: 0, ease: 'bounce.out' });
        await k.say('welcome', stan);
        await k.say('stanWandHand', stan);
        await k.all(k.say('harryWandHand', h2), k.to(h2, 0.01, { x: 0 }));
        k.flourish(h2);
        await k.wait(300);
        await k.say('name', stan);
        await k.say('neville', h2);
        await k.say('rightYou', stan);

        // The deed: Harry heaves his trunk (and Hedwig's cage) up onto the bus, and climbs aboard.
        await k.carry(t2, [960, 600], 1);
        k.fx.thud();
        await k.carry(c2, [900, 560], 0.7);
        await k.all(k.vanish(t2, 0.3), k.vanish(c2, 0.3));
        await k.to(stan, 0.6, { x: 330, ease: 'power1.inOut' });
        await k.vanish(stan, 0.3);
        k.fx.patter(5);
        await k.to(h2, 1, { x: 680, ease: 'power1.inOut' });
        await k.vanish(h2, 0.3);
        await k.wait(300);
      },
    },

    // ================================================= 4. The Knight Bus
    {
      name: 'The Knight Bus',
      set(k) {
        k.backdrop('knight-bus');
        k.music('adventure');
        cast.harry = k.character('harry', { x: 405, y: 335, w: 230, pose: 'muggle', z: 10 });
        cast.bed = k.add(bed(), { x: 310, y: 490, w: 430, z: 12 });
        cast.stan = k.character('stan', { x: 685, y: 400, w: 230, z: 11 });
        cast.mug = k.add(mug(), { x: 700, y: 520, w: 90, z: 16 });
        k.set(cast.mug, { opacity: 0 });
      },
      async play(k) {
        const { harry, stan, bed: cot, mug: cocoa } = cast;
        const everyone = [harry, stan, cot];
        await k.wait(500);
        await k.say('stanHoldOn', stan);
        // BANG: the bus lurches sideways; the beds skid; nobody falls.
        lurch();
        k.quake(7);
        await k.to(everyone, 0.25, { x: '+=110', rotation: 3, ease: 'power2.out' });
        await k.to(everyone, 0.7, { x: '-=110', rotation: 0, ease: 'elastic.out(1, 0.5)' });
        await k.all(k.say('whoa', harry), k.shake(stan, 4, 3));

        // Squeezing between two lamp posts: everything goes thin.
        await k.say('squeeze', stan);
        const lampA = k.prop('streetLamp', { x: 560, y: 232, w: 52, z: 3 });
        const lampB = k.prop('streetLamp', { x: 560, y: 232, w: 52, z: 3 });
        k.set([lampA, lampB], { x: 150 });
        k.fx.whizz();
        squeak();
        void k.to(lampA, 0.5, { x: -170, ease: 'none' });
        void k.wait(250).then(() => k.to(lampB, 0.5, { x: -170, ease: 'none' }));
        await k.to(everyone, 0.4, { scaleX: 0.84, ease: 'power2.out' });
        await k.wait(350);
        await k.to(everyone, 0.4, { scaleX: 1, ease: 'back.out(2)' });
        k.remove(lampA);
        k.remove(lampB);
        await k.wait(300);

        // Hot chocolate: Harry takes the mug and holds it steady through another BANG.
        await k.all(k.say('cocoa', stan), k.appear(cocoa, 0.4));
        await k.carry(cocoa, [525, 520], 0.9);
        lurch();
        k.quake(6);
        slosh();
        await k.to([harry, stan, cot], 0.2, { x: '+=70', ease: 'power2.out' });
        await k.all(k.to([harry, stan, cot], 0.5, { x: '-=70', ease: 'back.out(2)' }), k.shake(cocoa, 5, 4));
        k.flourish(cocoa);
        await k.say('notSpilt', harry);
        await k.wait(300);

        // Stan's newspaper: the lady in Little Whinging.
        const paper = k.add(newspaper(), { x: 718, y: 575, w: 165, z: 16 });
        k.sfx.page();
        await k.appear(paper, 0.4);
        await k.say('news', stan);
        await k.say('isSheOk', harry);
        await k.say('rightAsRain', stan);
        k.fx.poof();
        await k.vanish(paper, 0.3);
        giggle();
        await k.say('phew', harry);
        await k.say('nextStop', stan);

        // Harry lies back and falls asleep as the bus rocks and the night streams past.
        k.music('dreamy');
        await k.say('sleepy', harry);
        await k.to(harry, 1.2, { y: '+=50', rotation: -8, ease: 'sine.inOut' });
        await k.to(k.part(harry, 'lids'), 0.5, { opacity: 1 });
        void k.to([cot, harry, stan], 1.6, { x: '+=8', yoyo: true, repeat: 5, ease: 'sine.inOut' });
        const veil = k.dim(0.3);
        k.set(veil, { opacity: 0 });
        void k.fade(veil, 1, 3);
        await k.say('end');
        k.fx.twinkle();
        await k.wait(1800);
      },
    },
  ],
});

/** Vernon stretches, hanging on to a very floaty aunt: taller, from his feet. */
function gsapStretch<K extends string>(k: Kit<K>, vernon: HTMLElement): void {
  k.set(vernon, { transformOrigin: '50% 100%' });
  void k.to(vernon, 0.6, { scaleY: 1.2, ease: 'sine.out' });
}
