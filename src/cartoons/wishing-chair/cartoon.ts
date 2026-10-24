/**
 * The Wishing-Chair: Mollie and Peter buy a little red chair for Mum, and
 * it grows wings.
 *
 *   1. The odd little shop. Mollie and Peter have sixpence for Mum's
 *      birthday present. The shop is dim, full of odd things, and nobody
 *      is there. Peter rings the bell on the counter. Still nobody.
 *      But in the corner is a little red chair with a card: "Sixpence. Put
 *      your money in the dish." Peter puts the sixpence in the
 *      dish. As they go to carry it home, the chair wriggles its legs.
 *   2. The playroom. Mum loves her chair, and it lives in the playroom at
 *      the bottom of the garden. Mollie and Peter squeeze into it and wish
 *      for an adventure; Peter wishes it could fly, and it wriggles again.
 *      They make the wish together. It grows little red
 *      wings, and out through the doors they fly.
 *   3. Up in the sky. Wind, clouds, tiny fields far below. A small voice
 *      calls for help: a pixie is stuck on a cloud, and the cloud is
 *      breaking up, puff by puff. Jigs jumps onto the
 *      chair. He's Jigs! His umbrella floats up after him, blown inside out.
 *   4. Tired wings. Jigs shakes his umbrella and it pops the right
 *      way out. Jigs knows what the chair is: a Wishing-Chair, whose wings
 *      come and go. Uh-oh: the wings droop, and the chair sinks. "Home,
 *      chair!"
 *   5. Home. A bumpy landing in the playroom, just as the wings fold away.
 *      Jigs asks to stay and look after the chair; it will be their
 *      secret. Peter takes a cushion to the chair for Jigs's bed.
 *      Goodnight, chair. The very first adventure of the Wishing-Chair.
 *
 * The danger is gentle (a cloud breaking up, the wings drooping), so the
 * scary bit can be the giant next time. Nobody is in danger for long: Jigs
 * is on the chair before his cloud is gone, and they are home as the wings
 * fold. Mum is only spoken of: grown-ups never see the chair fly.
 *
 * The chair, the riders and their flying are the world's set piece
 * (chairRide, src/worlds/wishing/pieces.ts); the shop's bell, dish and
 * coin, the price card and Jigs's cloud are drawn here.
 */
import { bell as ring, C, cached, defineCartoon, circle, ellipse, group, ink, NOTE, now, piece, poly, raw, rect, svg } from '../../kit';
import { moves as commonMoves, sounds as common } from '../../worlds/common/moves';
import { warmEnding } from '../../worlds/common/pieces';
import { moves as wishing, sounds } from '../../worlds/wishing/moves';
import { chairRide, type Ride } from '../../worlds/wishing/pieces';
import meta from './meta';

const { ting, giggle } = common;
const { creak, hatBell, highWind, yawn } = sounds;

// ------------------------------------------------------------------- art

/** The shop bell: a brass dome on a little wooden stand. 120 × 110. */
const shopBell = cached(() =>
  svg({ w: 120, h: 110, name: 'wishing-chair-bell', label: 'A shop bell' }, [
    piece(rect(14, 86, 92, 18, 4), C.brownDark, { edge: 'cut' }),
    piece(poly([[24, 88], [32, 46], [60, 30], [88, 46], [96, 88]]), C.brass, { edge: 'cut' }),
    piece(ellipse(52, 54, 10, 18, -20), C.goldLight, { shadow: false, fibre: false }),
    piece(circle(60, 26, 9), C.brassDark, { edge: 'cut' }),
  ]),
);

/** A china dish for the money. 140 × 60. */
const dish = cached(() =>
  svg({ w: 140, h: 60, name: 'wishing-chair-dish', label: 'A dish' }, [
    piece(ellipse(70, 34, 64, 22), C.china, { edge: 'cut' }),
    piece(ellipse(70, 28, 50, 13), C.chinaBlue, { shadow: false }),
    piece(ellipse(70, 28, 40, 9), C.china, { shadow: false, fibre: false }),
  ]),
);

/** Their sixpence: a small shiny silver coin. 80 × 80. */
const sixpence = cached(() =>
  svg({ w: 80, h: 80, name: 'wishing-chair-coin', label: 'A sixpence' }, [
    piece(circle(40, 40, 30), C.steelLight, { edge: 'cut' }),
    piece(circle(40, 40, 22), C.steel, { shadow: false, fibre: false }),
    raw(`<text x="40" y="49" font-family="Andika, sans-serif" font-weight="700" font-size="24" fill="${C.steelLight}" text-anchor="middle">6</text>`),
    piece(ellipse(30, 30, 6, 3, -40), C.white, { shadow: false, fibre: false }),
  ]),
);

/** The price card tied to the chair: "6d" in ink. 110 × 80. */
const priceCard = cached(() =>
  svg({ w: 110, h: 80, name: 'wishing-chair-card', label: 'A price card' }, [
    ink([[55, 4], [55, 20]], { width: 2, color: C.brownDark }),
    piece(rect(10, 18, 90, 56, 3), C.cream, { edge: 'cut' }),
    raw(`<text x="55" y="58" font-family="Andika, sans-serif" font-weight="700" font-size="30" fill="${C.ink}" text-anchor="middle">6d</text>`),
  ]),
);

/** Jigs's little cloud, in three puffs (parts puffL, puffM, puffR) that drift off one by one. 380 × 200. */
const jigsCloud = cached(() =>
  svg({ w: 380, h: 200, name: 'wishing-chair-cloud', label: 'A small cloud' }, [
    group({ part: 'puffL', origin: [90, 120] }, [piece(circle(90, 120, 62), C.cloud, { shadow: false }), piece(ellipse(80, 150, 70, 30), C.cloudShade, { shadow: false })]),
    group({ part: 'puffR', origin: [290, 120] }, [piece(circle(290, 120, 64), C.cloud, { shadow: false }), piece(ellipse(300, 152, 70, 30), C.cloudShade, { shadow: false })]),
    group({ part: 'puffM', origin: [190, 110] }, [piece(ellipse(190, 146, 130, 40), C.cloudShade, { shadow: false }), piece(circle(130, 116, 48), C.white, { shadow: false }), piece(circle(250, 112, 52), C.white, { shadow: false }), piece(circle(190, 96, 58), C.white, { shadow: false }), piece(ellipse(190, 132, 120, 34), C.white, { shadow: false })]),
  ]),
);

// ---------------------------------------------------------------- sounds

/** The shop bell: one bright ding, with a little ring after. */
function ding(): void {
  const t = now();
  ring(NOTE.A5, t, 0.12, 1.4);
  ring(NOTE.A5 * 2, t + 0.01, 0.03, 0.8);
}

/** A coin dropped in a china dish: clink, clink-ink. */
function clink(): void {
  const t = now();
  ring(NOTE.E6, t, 0.06, 0.3);
  ring(NOTE.G6, t + 0.12, 0.04, 0.25);
  ring(NOTE.E6, t + 0.2, 0.03, 0.2);
}

// ------------------------------------------------------------------ cast

const cast = {} as Record<'mollie' | 'peter' | 'jigs' | 'chair' | 'bell' | 'dish' | 'coin' | 'card' | 'cloud' | 'brolly' | 'cushion', HTMLElement>;
let ride: Ride;

/** Where the chair stands in the shop, and the coin's dish on the counter. */
const SHOP_CHAIR = { x: 470, y: 330, w: 340 };
const DISH = { x: 840, y: 444, w: 140 };

export default defineCartoon({
  ...meta,
  lines: {
    // 1. The odd little shop
    hello: { who: 'mollie', text: 'Peter, it’s Mum’s birthday tomorrow.' },
    sixpence: { who: 'peter', text: 'And we’ve got a whole sixpence to spend!' },
    anybody: { who: 'mollie', text: 'What a funny little shop. Hello? Is anybody there?' },
    askBell: { who: 'peter', text: 'Nobody’s here! I’ll ring the bell on the counter. Ding!' },
    stillNobody: { who: 'mollie', text: 'Still nobody. Oh, Peter! Look at that little red chair!' },
    mumWouldLove: { who: 'peter', text: 'It’s got a cushion and everything. Mum would love it!' },
    card: { who: 'mollie', text: 'There’s a card on it. It says, sixpence. Put your money in the dish.' },
    askCoin: { who: 'mollie', text: 'Now let’s put our sixpence in the dish.' },
    peterCoin: { who: 'peter', text: 'I’ll pop it in. Clink!' },
    ours: { who: 'mollie', text: 'Clink! Now it’s ours. Let’s carry it home.' },
    wriggle: { who: 'peter', text: 'Mollie… did that chair just WRIGGLE?' },
    silly: { who: 'mollie', text: 'Chairs don’t wriggle, silly. Do they?' },
    // 2. The playroom
    playroom: { who: 'narrator', text: 'Mum loved her chair. It went in the playroom, at the bottom of the garden.' },
    comfy: { who: 'peter', text: 'It’s the comfiest chair in the whole world!' },
    adventure: { who: 'mollie', text: 'I wish we could have a real adventure.' },
    fly: { who: 'peter', text: 'Me too. I wish this chair could FLY!' },
    listening: { who: 'mollie', text: 'It wriggled again! I think it’s listening.' },
    askWish: { who: 'peter', text: 'Let’s wish really hard, Mollie!' },
    mollieWish: { who: 'mollie', text: 'Let’s all wish together. One, two, three!' },
    wings: { who: 'peter', text: 'WINGS! It’s got little red wings!' },
    holdOn: { who: 'mollie', text: 'Hold on tight!' },
    wheee: { who: 'peter', text: 'Wheee! We’re flying!' },
    // 3. Up in the sky
    fields: { who: 'mollie', text: 'Look how tiny the fields are down there!' },
    higher: { who: 'peter', text: 'Higher, chair! Up to the clouds!' },
    help: { who: 'jigs', text: 'Help! Help! Somebody help me!' },
    whoSaid: { who: 'mollie', text: 'Who said that? Listen!' },
    overHere: { who: 'jigs', text: 'Over here, on the cloud! The wind blew me up here!' },
    pixie: { who: 'peter', text: 'It’s a pixie! A real pixie!' },
    breaking: { who: 'jigs', text: 'My cloud is breaking up! Please, can I hop on?' },
    closer: { who: 'mollie', text: 'Quick, chair, fly closer!' },
    jigsJump: { who: 'jigs', text: 'I’ll jump! One, two… hup!' },
    savedMe: { who: 'jigs', text: 'Phew, thank you! You saved me. I’m Jigs!' },
    brolly: { who: 'jigs', text: 'Oh dear. My poor umbrella is blown inside out!' },
    // 4. Tired wings
    jigsBrolly: { who: 'jigs', text: 'I’ll give it a shake. Pop!' },
    goodAsNew: { who: 'jigs', text: 'Good as new! And do you know what this chair is?' },
    wishingChair: { who: 'jigs', text: 'It’s a Wishing-Chair! It grows wings when it likes.' },
    butFold: { who: 'jigs', text: 'But the wings get tired, and then they fold away.' },
    drooping: { who: 'peter', text: 'Uh-oh. The wings are drooping!' },
    wishHome: { who: 'jigs', text: 'Quick! Wish us home, before they go!' },
    homeChair: { who: 'mollie', text: 'Home, chair! Please take us home!' },
    // 5. Home
    bump: { who: 'peter', text: 'Bump! We’re home!' },
    justInTime: { who: 'mollie', text: 'Just in time. Look, the wings have gone.' },
    stay: { who: 'jigs', text: 'What a lovely playroom. Could I stay and look after the chair?' },
    secret: { who: 'peter', text: 'Yes, please! But it’s our secret. Nobody else must know.' },
    bed: { who: 'mollie', text: 'Jigs can sleep in the chair. Here’s a soft cushion.' },
    cosy: { who: 'jigs', text: 'Ooh, cosy! Thank you, Peter!' },
    peterCushion: { who: 'peter', text: 'I’ll fetch it. Here you are, Jigs!' },
    teaTime: { who: 'narrator', text: 'Then Mum called them in for tea, and soon it was bedtime.' },
    goodnight: { who: 'peter', text: 'Goodnight, Jigs! Goodnight, chair!' },
    nextTime: { who: 'jigs', text: 'Goodnight! See you for the next adventure!' },
    end: { who: 'narrator', text: 'And that was the very first adventure of the Wishing-Chair.' },
  },
  scenes: [
    // ==================================================== 1. The odd little shop
    {
      name: 'The odd little shop',
      set(k) {
        k.backdrop('curiosity-shop');
        k.music('cosy');
        k.ambient('dust', { count: 14, area: [60, 120, 760, 480] });
        k.light(190, 280, 220, { color: '#fff3c8', strength: 0.35, z: 5 });
        cast.chair = k.prop('wishing-chair', SHOP_CHAIR);
        cast.card = k.add(priceCard(), { x: SHOP_CHAIR.x + 236, y: SHOP_CHAIR.y + 128, w: 90, z: 11 });
        cast.bell = k.add(shopBell(), { x: 1050, y: 372, w: 110, z: 11 });
        cast.dish = k.add(dish(), { ...DISH, z: 11 });
        cast.mollie = k.character('mollie', { x: 30, y: 368, w: 240 });
        cast.peter = k.character('peter', { x: 240, y: 368, w: 240, z: 11 });
        cast.coin = k.add(sixpence(), { x: 500, y: 500, w: 90, z: 16 });
        for (const el of [cast.mollie, cast.peter, cast.coin]) k.set(el, { opacity: 0 });
      },
      async play(k) {
        const { mollie, peter, chair, bell, coin, dish: plate } = cast;
        // The shop door's bell jingles, and in they come.
        k.fx.jingle();
        await k.enter(mollie, 'left', 0.8);
        await k.enter(peter, 'left', 0.8);
        await k.all(k.say('hello', mollie), k.hop(mollie, 24, 1));
        await k.all(k.say('sixpence', peter), k.hop(peter, 30, 1));
        k.set(coin, { opacity: 1 });
        await k.appear(coin, 0.3);
        ting();
        await k.say('anybody', mollie);
        // Nobody answers: only the clocks ticking.
        k.fx.knock(4);
        await k.wait(700);

        // Peter rings the bell.
        await k.say('askBell', peter);
        k.flourish(bell);
        ding();
        await k.shake(bell, 4, 2);
        await k.wait(1100);

        // Still nobody. But look at that chair.
        await k.say('stillNobody', mollie);
        k.fx.twinkle();
        k.sparkle(SHOP_CHAIR.x + 170, SHOP_CHAIR.y + 120, 10, 140);
        await k.pop(chair, 1.05);
        await k.all(k.say('mumWouldLove', peter), k.to(peter, 0.6, { x: 30 }));
        await k.camera({ zoom: 1.35, x: 520, y: 450 }, 1);
        await k.say('card', mollie);
        await k.camera({}, 0.8);

        // Peter puts the sixpence in the dish.
        await k.say('askCoin', mollie);
        await k.all(k.say('peterCoin', peter), k.carry(coin, [DISH.x + 70, DISH.y + 26]));
        clink();
        await k.shake(plate, 3, 1);
        k.music('magic');
        await k.all(k.say('ours', mollie), k.hop(mollie, 30, 1));

        // The chair wriggles its legs.
        await wishing.wriggle(k, chair, 3);
        await k.wait(500);
        await k.all(k.say('wriggle', peter), k.shake(peter, 4, 2));
        await k.say('silly', mollie);
        await wishing.wriggle(k, chair, 2);
      },
    },

    // ==================================================== 2. The playroom
    {
      name: 'The playroom',
      set(k) {
        k.backdrop('playroom');
        k.music('cosy');
        k.light(1010, 380, 240, { color: '#fff3c8', strength: 0.3, z: 5 });
        ride = chairRide.set(k, { x: 330, y: 177, w: 520, riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }] });
        [cast.mollie, cast.peter] = ride.riders;
      },
      async play(k) {
        const { mollie, peter } = cast;
        await k.say('playroom');
        creak();
        await k.all(k.say('comfy', peter), k.hop(peter, 16, 1));
        await k.say('adventure', mollie);
        await k.say('fly', peter);
        await wishing.wriggle(k, ride.chair, 3);
        await k.say('listening', mollie);

        // They make the wish together.
        await k.say('askWish', peter);
        await k.say('mollieWish', mollie);
        k.flourish(ride.chair);
        k.music('magic');
        await chairRide.wings(k, ride);
        await chairRide.flap(k, ride, 3);
        await k.all(k.say('wings', peter), k.shake(peter, 4, 2));
        await k.say('holdOn', mollie);

        // Up, and out through the open doors.
        k.music('adventure');
        await chairRide.fly(k, ride, { y: -70, s: 1.2 });
        highWind(3);
        await k.all(k.say('wheee', peter), chairRide.fly(k, ride, { x: 280, s: 1.6 }));
        await chairRide.fly(k, ride, { x: 980, s: 1.4, tilt: 6 });
      },
    },

    // ==================================================== 3. Up in the sky
    {
      name: 'Up in the sky',
      set(k) {
        k.backdrop('wishing-sky');
        k.music('adventure');
        ride = chairRide.set(k, { x: 110, y: 170, w: 520, wings: true, riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }] });
        [cast.mollie, cast.peter] = ride.riders;
        chairRide.jump(k, ride, { x: -900, y: 80 });
        // Jigs, stuck on his cloud, waiting to drift in from the right.
        cast.jigs = k.character('jigs', { x: 860, y: 150, w: 220, z: 13 });
        cast.cloud = k.add(jigsCloud(), { x: 770, y: 330, w: 380, z: 14 });
        cast.brolly = k.prop('jigs-umbrella-blown', { x: 1040, y: 190, w: 110, z: 12 });
        for (const el of [cast.jigs, cast.cloud, cast.brolly]) k.set(el, { x: 600 });
      },
      async play(k) {
        const { mollie, peter, jigs, cloud, brolly } = cast;
        highWind(3);
        await chairRide.fly(k, ride, { x: 0, y: 0, s: 2.4 });
        await k.say('fields', mollie);
        await k.all(k.say('higher', peter), k.hop(peter, 14, 1));
        await chairRide.fly(k, ride, { y: -40, s: 1.2 });

        // A small voice on the wind.
        highWind(2);
        await k.wait(500);
        await k.say('help');
        await k.all(k.say('whoSaid', mollie), k.to(mollie, 0.5, { x: 10 }));

        // In drifts a little cloud, with a pixie on it.
        hatBell();
        await k.all(...[jigs, cloud, brolly].map((el) => k.to(el, 2.2, { x: 0, ease: 'sine.out' })));
        await k.all(k.say('overHere', jigs), k.shake(brolly, 5, 2));
        await k.all(k.say('pixie', peter), k.hop(peter, 20, 1));

        // The cloud starts to come apart.
        const [puffR, puffL] = [...k.part(cloud, 'puffR'), ...k.part(cloud, 'puffL')];
        k.fx.poof();
        await k.to(puffR, 1.2, { x: 80, y: -30, opacity: 0, ease: 'sine.in' });
        await k.all(k.say('breaking', jigs), k.shake(jigs, 5, 2));
        await k.say('closer', mollie);
        await chairRide.fly(k, ride, { x: 90, s: 1.4 });
        k.fx.poof();
        await k.to(puffL, 1, { x: -60, y: 30, opacity: 0, ease: 'sine.in' });

        // Jigs jumps onto the chair (he leaves his umbrella on the cloud for now).
        void k.fade(brolly, 0, 0.3);
        await k.all(k.say('jigsJump', jigs), k.carry(jigs, chairRide.seatAt(k, ride, 'back')));
        k.remove(jigs);
        const seated = await chairRide.seat(k, ride, { id: 'jigs', slot: 'back', flip: true });
        // The last of the cloud puffs away.
        k.fx.poof();
        k.puff(960, 450, 220, '#ffffff');
        k.remove(cloud);
        hatBell();
        await k.all(k.say('savedMe', seated), k.hop(seated, 20, 1));

        // His umbrella floats up after him, still inside out.
        k.remove(brolly);
        const blown = k.prop('jigs-umbrella-blown', { x: 760, y: 150, w: 130, z: 16 });
        k.set(blown, { opacity: 0 });
        await k.appear(blown, 0.4);
        await k.say('brolly', seated);
      },
    },

    // ==================================================== 4. Tired wings
    {
      name: 'Tired wings',
      set(k) {
        k.backdrop('wishing-sky');
        k.music('magic');
        ride = chairRide.set(k, {
          x: 200,
          y: 130,
          w: 520,
          wings: true,
          riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'back', flip: true }],
        });
        [cast.mollie, cast.peter, cast.jigs] = ride.riders;
        cast.brolly = k.prop('jigs-umbrella-blown', { x: 760, y: 150, w: 130, z: 16 });
      },
      async play(k) {
        const { mollie, peter, jigs } = cast;
        let { brolly } = cast;
        // Jigs shakes his umbrella the right way out.
        await k.say('jigsBrolly', jigs);
        k.flourish(brolly);
        k.fx.pop();
        k.remove(brolly);
        brolly = k.prop('jigs-umbrella', { x: 760, y: 150, w: 130, z: 16 });
        await k.pop(brolly, 1.2);
        await k.all(k.say('goodAsNew', jigs), k.to(brolly, 0.6, { rotation: -10, yoyo: true, repeat: 1 }));
        // He tucks it away.
        await k.to(brolly, 0.5, { scale: 0.2, opacity: 0, x: -60, y: 120 });

        k.fx.twinkle();
        await k.all(k.say('wishingChair', jigs), chairRide.flap(k, ride, 2));
        await k.say('butFold', jigs);

        // Uh-oh: the wings droop, and the chair sinks a little.
        k.silence();
        await wishing.droop(k, ride.chair);
        await chairRide.fly(k, ride, { y: 50, s: 1.2, flaps: 0 });
        await k.all(k.say('drooping', peter), k.shake(peter, 4, 2));
        await k.say('wishHome', jigs);
        k.music('adventure');
        await k.say('homeChair', mollie);
        highWind(2);
        await chairRide.fly(k, ride, { x: -900, y: 120, s: 2, flaps: 3 });
      },
    },

    // ==================================================== 5. Home
    {
      name: 'Home',
      set(k) {
        k.backdrop('playroom');
        k.music('cosy');
        k.light(1010, 380, 240, { color: '#fff3c8', strength: 0.3, z: 5 });
        ride = chairRide.set(k, {
          x: 330,
          y: 177,
          w: 520,
          wings: true,
          riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }, { id: 'jigs', slot: 'back', flip: true }],
        });
        [cast.mollie, cast.peter, cast.jigs] = ride.riders;
        chairRide.jump(k, ride, { x: 900, y: -160 });
        cast.cushion = k.prop('cushion', { x: 110, y: 560, w: 130, z: 13 });
        k.set(cast.cushion, { opacity: 0 });
      },
      async play(k) {
        const { mollie, peter, jigs, cushion } = cast;
        // In through the doors, the wings flagging, and a bumpy landing.
        await chairRide.fly(k, ride, { x: 280, y: -110, s: 1.2, flaps: 2 });
        void wishing.droop(k, ride.chair);
        await chairRide.land(k, ride);
        await k.say('bump', peter);
        await k.say('justInTime', mollie);

        // Mollie and Peter hop out.
        await chairRide.hopOff(k, ride, mollie, { x: 40, y: 360, w: 240 });
        await chairRide.hopOff(k, ride, peter, { x: 860, y: 360, w: 240 });
        k.face(peter, true);
        hatBell();
        await k.all(k.say('stay', jigs), k.hop(jigs, 16, 1));
        await k.all(k.say('secret', peter), k.hop(peter, 24, 1));
        await k.say('bed', mollie);

        // Peter takes the cushion to the chair.
        await k.appear(cushion, 0.4);
        await k.all(k.say('peterCushion', peter), k.carry(cushion, [590, 470]));
        k.fx.boing();
        // Jigs hops over the chair back onto his new bed.
        jigs.style.zIndex = String(ride.at.z + 1);
        await k.to(jigs, 0.3, { y: '-=60', ease: 'power1.out' });
        await k.to(jigs, 0.5, { x: '-=70', y: '+=250', ease: 'power1.in' });
        await k.all(k.say('cosy', jigs), k.blink(jigs));
        yawn();
        await k.wait(600);

        await k.say('teaTime');
        await k.all(k.say('goodnight', peter), commonMoves.wave(k, peter));
        creak();
        await k.all(k.say('nextTime', jigs), wishing.wriggle(k, ride.chair, 2));
        giggle();
        await warmEnding(k, { cast: [mollie, peter, jigs], end: 'end', music: 'cosy' });
      },
    },
  ],
});
