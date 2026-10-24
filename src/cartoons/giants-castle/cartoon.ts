/**
 * The Giant's Castle: Giant Grumble has taken Jigs to polish his boots, and
 * the Wishing-Chair flies Mollie and Peter to get him back.
 *
 *   1. The playroom. Mollie and Peter run down to the playroom, but Jigs
 *      isn't there: only his umbrella on the chair, and a footprint in the
 *      garden as big as a bath. A note flutters in at the door. Mollie
 *      catches it. It's from Jigs: a giant took him to polish
 *      his boots! The chair wriggles and grows its wings all by itself. It
 *      wants to help too.
 *   2. The castle door. The chair lands on the grass outside a giant's
 *      castle with a door as big as a house. STOMP, STOMP, and a voice from
 *      inside roars "SHINIER!" But down at the bottom of the big door is a
 *      tiny mouse door. Peter pushes it open, and they tiptoe in.
 *   3. The giant's kitchen. Jigs is up on an enormous boot, polishing. Then
 *      STOMP: Giant Grumble looms in, roaring for his boots to be SHINIER;
 *      the children hide behind the table leg. Back to the heroes: he's
 *      grumpy because he's tired, Jigs whispers. If he goes to sleep, they
 *      can escape. Jigs hops up and taps the big clock, and it bongs bedtime.
 *      The giant yawns and wants his nightcap. Jigs tosses it up onto the
 *      giant's head. Snore.
 *   4. The escape. Jigs never finished the boots, and the giant will be
 *      grumpy all over again. Jigs gives the boots one last rub and they shine
 *      like mirrors. They tiptoe out, and a squeak wakes the giant. One eye
 *      opens, and he sees his face in his boots. He beams: what a lovely
 *      surprise. Off they go, with a thank-you, and he snores again.
 *   5. Home. Cocoa in the playroom. Peter passes a biscuit to Jigs.
 *      Jigs will never polish another boot. "Not even mine?" asks Peter.
 *
 * Scary, never cruel (docs/STYLE.md): the giant is heard before he's seen,
 * looms, roars and stomps, then it cuts back to the heroes with a plan. He
 * touches nobody, and he is grumpy because he's tired; his defeat is a
 * nap, and he ends up pleased. Jigs is fine all along, just tired arms.
 *
 * The chair and its riders are the world's chairRide set piece; the
 * footprint, the note, the mouse door, the boots, the clock and the
 * biscuits are drawn here.
 */
import { bell, C, cached, circle, curve, defineCartoon, ellipse, group, ink, NOTE, now, piece, poly, rect, svg, type Kit, type Node } from '../../kit';
import { moves as commonMoves, sounds as common } from '../../worlds/common/moves';
import { sneakIn, warmEnding } from '../../worlds/common/pieces';
import { moves as wishing, sounds } from '../../worlds/wishing/moves';
import { chairRide, type Ride } from '../../worlds/wishing/pieces';
import meta from './meta';

const { creak, hatBell, highWind, roar, snore, yawn } = sounds;
const { laugh, pour } = common;
const { wave } = commonMoves;

// ------------------------------------------------------------------- art

/** A giant's footprint pressed in the grass: a huge boot-shaped dent. 220 × 150. */
const footprint = cached(() =>
  svg({ w: 220, h: 150, name: 'giants-castle-footprint', label: 'A giant footprint' }, [
    piece(ellipse(84, 80, 76, 50), '#6e5434', { shadow: false }),
    piece(ellipse(178, 82, 36, 34), '#6e5434', { shadow: false }),
    piece(ellipse(84, 84, 58, 34), '#86683f', { shadow: false, fibre: false }),
    ...[0, 1, 2, 3].map((i) => ink([[40 + i * 26, 64], [40 + i * 26, 104]], { width: 5, color: '#5a4329' })),
  ]),
);

/** Jigs's note: a scrap of paper with scribbled lines. 130 × 110. */
const note = cached(() =>
  svg({ w: 130, h: 110, name: 'giants-castle-note', label: 'A note' }, [
    piece(poly([[10, 18], [120, 6], [124, 96], [14, 104]]), C.cream),
    ink([[30, 34], [100, 28]], { width: 4, color: C.ink, wobble: 2 }),
    ink([[30, 54], [104, 50]], { width: 4, color: C.ink, wobble: 2 }),
    ink([[30, 74], [80, 72]], { width: 4, color: C.ink, wobble: 2 }),
  ]),
);

/** The mouse door at the foot of the giant's door; its little door (part `flap`) swings open. 110 × 110. */
const mouseDoor = cached(() =>
  svg({ w: 110, h: 110, name: 'giants-castle-mouse-door', label: 'A tiny door' }, [
    piece(poly([[12, 110], [12, 40], [55, 6], [98, 40], [98, 110]]), C.charcoal, { edge: 'cut' }),
    group({ part: 'flap', origin: [14, 60] }, [
      piece(poly([[14, 110], [14, 42], [55, 10], [96, 42], [96, 110]]), C.red, { edge: 'cut' }),
      piece(circle(80, 72, 6), C.gold, { edge: 'cut' }),
    ]),
  ]),
);

/**
 * The giant's boots, a pair side by side, toes pointing out: tall laced
 * shafts, a turned-down cuff, mud on the toes. Their shine (part `shine`)
 * fades in when they're polished. 380 × 320.
 */
const boots = cached(() => {
  /** One boot, its shaft from x0 to x0 + 110, its toe pointing left (dir -1) or right (dir 1). */
  const boot = (x0: number, dir: 1 | -1): Node[] => {
    const toe = dir === 1 ? x0 + 180 : x0 - 70;
    const heel = dir === 1 ? x0 - 6 : x0 + 116;
    return [
      // the foot, with a round toe, and a dark sole
      piece(curve([[heel, 314], [heel, 250], [x0 + 55, 230], [(x0 + 55 + toe) / 2, 236], [toe, 268], [toe, 314]], 2), C.brownDark),
      piece(rect(Math.min(heel, toe) - 4, 300, Math.abs(toe - heel) + 8, 16, 6), C.charcoal, { edge: 'cut' }),
      // the shaft and its cuff
      piece(rect(x0, 40, 110, 230, 8), C.brownDark),
      piece(rect(x0 - 8, 30, 126, 40, 8), C.brown),
      // laces criss-crossing down the front
      ...[0, 1, 2, 3, 4].map((i) => ink([[x0 + 30, 88 + i * 34], [x0 + 80, 108 + i * 34]], { width: 4, color: C.cream })),
      ...[0, 1, 2, 3, 4].map((i) => ink([[x0 + 80, 88 + i * 34], [x0 + 30, 108 + i * 34]], { width: 4, color: C.cream })),
      // mud
      piece(ellipse((x0 + 55 + toe) / 2, 284, 34, 14), '#6b5232', { shadow: false }),
      piece(circle(x0 + 40, 288, 10), '#6b5232', { shadow: false }),
    ];
  };
  return svg({ w: 380, h: 320, name: 'giants-castle-boots', label: 'Two giant boots' }, [
    ...boot(80, -1),
    ...boot(196, 1),
    group({ part: 'shine', opacity: 0 }, [
      piece(rect(90, 60, 16, 180, 8), '#f3e3c3', { shadow: false, fibre: false }),
      piece(rect(206, 60, 16, 180, 8), '#f3e3c3', { shadow: false, fibre: false }),
      piece(ellipse(46, 252, 22, 8, -20), '#f3e3c3', { shadow: false, fibre: false }),
      piece(ellipse(334, 252, 22, 8, 20), '#f3e3c3', { shadow: false, fibre: false }),
    ]),
  ]);
});

/** The giant's wall clock: a big round face with two hands (part `hands`). 160 × 200. */
const clock = cached(() =>
  svg({ w: 160, h: 200, name: 'giants-castle-clock', label: 'A big clock' }, [
    piece(rect(64, 120, 32, 70, 6), C.woodShade, { edge: 'cut' }),
    piece(circle(80, 196, 14), C.brass, { edge: 'cut' }),
    piece(circle(80, 80, 74), C.wood, { edge: 'cut' }),
    piece(circle(80, 80, 60), C.cream, { edge: 'cut' }),
    ...[0, 1, 2, 3].map((i) => piece(circle(80 + Math.cos((i * Math.PI) / 2) * 48, 80 + Math.sin((i * Math.PI) / 2) * 48, 5), C.ink, { shadow: false })),
    group({ part: 'hands', origin: [80, 80] }, [ink([[80, 80], [80, 36]], { width: 6, color: C.ink }), ink([[80, 80], [108, 80]], { width: 7, color: C.ink })]),
    piece(circle(80, 80, 6), C.brass, { shadow: false }),
  ]),
);

/** A cup of cocoa. 110 × 100. */
const cocoa = cached(() =>
  svg({ w: 110, h: 100, name: 'giants-castle-cocoa', label: 'A cup of cocoa' }, [
    piece(ellipse(55, 90, 48, 9), C.china, { edge: 'cut' }),
    piece(poly([[18, 30], [92, 30], [84, 86], [26, 86]]), C.chinaBlue, { edge: 'cut' }),
    piece(ellipse(55, 32, 37, 9), C.brownDark, { shadow: false }),
    ink([[92, 44], [106, 52], [90, 70]], { width: 6, color: C.chinaBlue }),
  ]),
);

/** A round biscuit with sugar on top. 90 × 90. */
const biscuit = cached(() =>
  svg({ w: 90, h: 90, name: 'giants-castle-biscuit', label: 'A biscuit' }, [
    piece(circle(45, 45, 36), C.caramel),
    ...[[32, 34], [54, 30], [44, 52], [60, 56], [28, 58]].map(([x, y]) => piece(circle(x, y, 3), C.cream, { shadow: false, fibre: false })),
  ]),
);

// ---------------------------------------------------------------- sounds

/** The giant's clock striking: deep slow bongs. */
function bong(times = 3): void {
  const t = now();
  for (let i = 0; i < times; i++) bell(NOTE.C3, t + i * 0.8, 0.14, 1.6);
}

/** A tiny squeak of a shoe on the flagstones. */
function squeak(): void {
  const t = now();
  bell(NOTE.E6, t, 0.04, 0.15);
  bell(NOTE.G5 * 2, t + 0.08, 0.03, 0.12);
}

// ------------------------------------------------------------------ cast

const cast = {} as Record<'mollie' | 'peter' | 'jigs' | 'grumble' | 'chair' | 'brolly' | 'note' | 'door' | 'boots' | 'clock' | 'cap' | 'cocoa' | 'biscuit', HTMLElement>;
let ride: Ride;

/** In the kitchen: the boots, and the giant leaning in from the right. */
const BOOTS = { x: 330, y: 330, w: 380 };
const BOOTS_Z = 12;
const GIANT = { x: 620, y: -10, w: 700 };

export default defineCartoon({
  ...meta,
  lines: {
    // 1. The playroom
    morning: { who: 'narrator', text: 'One sunny morning, Mollie and Peter ran down to the playroom.' },
    hello: { who: 'mollie', text: 'Jigs! Jigs! We’re here!' },
    whereJigs: { who: 'peter', text: 'Jigs? Where are you? His umbrella’s here, but he isn’t.' },
    footprint: { who: 'mollie', text: 'Peter, look in the garden! A footprint as big as a bath!' },
    noteFlies: { who: 'peter', text: 'And there’s a note, blowing about in the wind!' },
    mollieNote: { who: 'mollie', text: 'I’ll catch it. Got it!' },
    readNote: { who: 'mollie', text: 'It’s from Jigs! Help! A giant took me to polish his boots!' },
    rescue: { who: 'peter', text: 'A giant! Poor Jigs. We have to rescue him!' },
    wantsToHelp: { who: 'mollie', text: 'Look! The chair’s growing its wings. It wants to help too!' },
    toCastle: { who: 'peter', text: 'Come on, chair! To the giant’s castle!' },
    // 2. The castle door
    thereItIs: { who: 'mollie', text: 'There it is! The giant’s castle!' },
    hugeDoor: { who: 'peter', text: 'What a HUGE door! It’s as big as a house!' },
    shinier: { who: 'grumble', text: 'SHINIER! Polish them SHINIER!' },
    thatsHim: { who: 'mollie', text: 'That’s the giant. Jigs must be in there.' },
    howIn: { who: 'peter', text: 'But how do we get in? We can’t open that.' },
    mouseDoor: { who: 'mollie', text: 'Look, at the bottom! A teeny tiny red mouse door!' },
    peterDoor: { who: 'peter', text: 'Let’s open it up. I’ll give it a push. Creak!' },
    quietMice: { who: 'peter', text: 'In we go. Quiet as mice!' },
    // 3. The giant's kitchen
    polish: { who: 'jigs', text: 'Polish, polish, polish. Oh, my poor tired arms!' },
    psst: { who: 'mollie', text: 'Psst! Jigs! It’s us!' },
    youCame: { who: 'jigs', text: 'Mollie! Peter! Jumping jigs, you came!' },
    whoTalking: { who: 'grumble', text: 'WHO is talking in MY kitchen?' },
    seeMyFace: { who: 'grumble', text: 'SHINIER! I want to see my FACE in them!' },
    soTired: { who: 'grumble', text: 'Oh, I’m so TIRED. Grumble, grumble, grumble.' },
    whisper: { who: 'jigs', text: 'He’s grumpy because he’s tired. If he goes to sleep, we can escape!' },
    clockPlan: { who: 'mollie', text: 'There’s a clock. If it says bedtime, he’ll go to bed!' },
    jigsClock: { who: 'jigs', text: 'Make it ring for bedtime! I’ll hop up and tap it. Ting!' },
    bedtime: { who: 'grumble', text: 'BONG? Bedtime already? Where’s my nightcap?' },
    jigsCap: { who: 'jigs', text: 'Quick! I’ll toss his nightcap up. Wheee!' },
    nightNight: { who: 'grumble', text: 'Ahh, lovely. Night night…' },
    asleep: { who: 'peter', text: 'He’s fast asleep!' },
    // 4. The escape
    notFinished: { who: 'jigs', text: 'Oh dear. I never finished his boots. He’ll be grumpy all over again.' },
    surprise: { who: 'mollie', text: 'Then let’s make them shine, as a surprise!' },
    jigsShine: { who: 'jigs', text: 'Let’s make them sparkle. One last rub. Swish, swish, swish!' },
    mirrors: { who: 'peter', text: 'They’re as shiny as mirrors!' },
    tiptoe: { who: 'jigs', text: 'Now tiptoe out. Don’t wake him!' },
    uhOh: { who: 'peter', text: 'Uh-oh. My shoe squeaked!' },
    whatsThat: { who: 'grumble', text: 'Hmm? What’s that? Oh! My BOOTS!' },
    myFace: { who: 'grumble', text: 'I can see my face in them! What a lovely surprise!' },
    thankYouPixie: { who: 'grumble', text: 'Thank you, little pixie. Off you go home. Night night…' },
    phew: { who: 'jigs', text: 'Phew! He’s not grumpy any more. Let’s go home!' },
    // 5. Home
    homeAgain: { who: 'peter', text: 'Home again! Well done, chair.' },
    brave: { who: 'jigs', text: 'Thank you for rescuing me. You were all so brave!' },
    cocoa: { who: 'mollie', text: 'Cocoa for everyone. And a biscuit for Jigs.' },
    peterBiscuit: { who: 'peter', text: 'I’ll pass it. Here you are, Jigs!' },
    yumPeter: { who: 'jigs', text: 'Yum! Thank you, Peter!' },
    neverAgain: { who: 'jigs', text: 'I’m never polishing another boot again!' },
    notMine: { who: 'peter', text: 'Not even mine?' },
    end: { who: 'narrator', text: 'And far away, Giant Grumble slept with a smile on his face.' },
  },
  scenes: [
    // ==================================================== 1. The playroom
    {
      name: 'The playroom',
      set(k) {
        k.backdrop('playroom');
        k.music('cosy');
        k.light(1010, 380, 240, { color: '#fff3c8', strength: 0.3, z: 5 });
        k.add(footprint(), { x: 930, y: 540, w: 180, z: 2 });
        ride = chairRide.set(k, { x: 360, y: 177, w: 520 });
        cast.chair = ride.chair;
        cast.brolly = k.prop('jigs-umbrella', { x: 560, y: 300, w: 130, z: 14 });
        k.set(cast.brolly, { rotation: -20 });
        cast.mollie = k.character('mollie', { x: 40, y: 360, w: 240 });
        cast.peter = k.character('peter', { x: 210, y: 368, w: 240, z: 11 });
        cast.note = k.add(note(), { x: 1000, y: 260, w: 110, z: 20 });
        for (const el of [cast.mollie, cast.peter, cast.note]) k.set(el, { opacity: 0 });
      },
      async play(k) {
        const { mollie, peter, chair, brolly, note: paper } = cast;
        await k.say('morning');
        k.fx.patter(8);
        await k.all(k.enter(mollie, 'left', 0.9), k.enter(peter, 'left', 0.9));
        await k.all(k.say('hello', mollie), wave(k, mollie));
        await k.wait(700);
        await k.all(k.say('whereJigs', peter), k.shake(brolly, 3, 1));
        k.fx.uhoh();
        k.sparkle(1020, 610, 10, 110);
        await k.all(k.say('footprint', mollie), k.to(mollie, 0.5, { x: -10 }));

        // A note blows in at the door, and flutters about.
        highWind(2);
        k.set(paper, { x: 200, opacity: 1 });
        await k.to(paper, 1.4, { x: -360, y: 40, rotation: -25, ease: 'sine.inOut' });
        await k.say('noteFlies', peter);
        await k.say('mollieNote', mollie);
        k.flourish(paper);
        k.sfx.page();
        await k.to(paper, 0.6, { x: -720, y: 160, rotation: 0, scale: 0.6 });
        await k.vanish(paper, 0.3);
        await k.say('readNote', mollie);
        await k.all(k.say('rescue', peter), k.hop(peter, 30, 1));

        // The chair wants to help: it wriggles and grows its wings all by itself.
        await wishing.wriggle(k, chair, 3);
        k.music('magic');
        await chairRide.wings(k, ride);
        await chairRide.flap(k, ride, 2);
        await k.say('wantsToHelp', mollie);
        k.music('adventure');
        await k.all(k.say('toCastle', peter), k.hop(peter, 30, 1));
      },
    },

    // ==================================================== 2. The castle door
    {
      name: 'The castle door',
      set(k) {
        k.backdrop('giant-castle');
        k.music('adventure');
        ride = chairRide.set(k, {
          x: 90,
          y: 248,
          w: 440,
          wings: true,
          riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }],
        });
        [cast.mollie, cast.peter] = ride.riders;
        chairRide.jump(k, ride, { x: -800, y: -40 });
        cast.door = k.add(mouseDoor(), { x: 664, y: 532, w: 100, z: 8 });
      },
      async play(k) {
        const { mollie, peter, door } = cast;
        highWind(2);
        await k.all(chairRide.fly(k, ride, { x: 0, s: 2.6 }), k.wait(1300).then(() => k.say('thereItIs', cast.mollie)));
        await chairRide.land(k, ride);
        await k.all(k.say('hugeDoor', peter), k.hop(peter, 16, 1));

        // STOMP, STOMP, and a roar from inside.
        k.silence();
        await k.wait(300);
        k.fx.stomp(3, 0.5);
        void k.quake(6);
        await k.wait(1400);
        void roar();
        await k.all(k.say('shinier'), k.shake(mollie, 5, 2), k.shake(peter, 5, 2));
        k.music('sneaky');
        await k.say('thatsHim', mollie);
        await k.say('howIn', peter);
        k.sparkle(714, 580, 10, 80);
        await k.say('mouseDoor', mollie);

        // Peter opens the mouse door.
        await k.say('peterDoor', peter);
        k.flourish(door);
        k.fx.creak();
        const flap = k.pivot(k.part(door, 'flap'));
        await k.to(flap, 0.8, { scaleX: 0.15, ease: 'power1.out' });
        await k.say('quietMice', peter);

        // Out of the chair, and on tiptoe to the little door.
        await chairRide.hopOff(k, ride, mollie, { x: 300, y: 400, w: 210 });
        await chairRide.hopOff(k, ride, peter, { x: 430, y: 404, w: 210 });
        k.fx.sneak();
        await k.all(k.to(peter, 1.6, { x: '+=180', opacity: 0, ease: 'sine.in' }), k.wait(500).then(() => k.to(mollie, 1.8, { x: '+=320', opacity: 0, ease: 'sine.in' })));
      },
    },

    // ==================================================== 3. The giant's kitchen
    {
      name: 'The giant’s kitchen',
      set(k) {
        k.backdrop('giant-kitchen');
        k.music('sneaky');
        k.light(360, 560, 200, { color: '#ffb35c', strength: 0.3, flicker: true, z: 5 });
        cast.clock = k.add(clock(), { x: 500, y: 34, w: 130, z: 6 });
        cast.jigs = k.character('jigs', { x: 380, y: 196, w: 180, z: 11 });
        cast.boots = k.add(boots(), { ...BOOTS, z: BOOTS_Z });
        cast.grumble = k.character('grumble', { ...GIANT, z: 9 });
        cast.cap = k.prop('nightcap', { x: 610, y: 300, w: 120, z: 16 });
        cast.mollie = k.character('mollie', { x: 30, y: 380, w: 220, z: 14 });
        cast.peter = k.character('peter', { x: 196, y: 388, w: 220, z: 15 });
        k.set(cast.grumble, { opacity: 0, y: 80 });
        k.set(cast.cap, { opacity: 0 });
        sneakIn.set(k, [cast.mollie, cast.peter]);
      },
      async play(k) {
        const { mollie, peter, jigs, grumble, clock: tick, cap } = cast;
        await sneakIn.play(k, { walkers: [mollie, peter] });
        // Jigs, up on a giant boot, rubbing away.
        void polishing(k, jigs);
        await k.say('polish', jigs);
        await k.all(k.say('psst', mollie), k.to(mollie, 0.4, { x: '+=20' }));
        hatBell();
        await k.all(k.say('youCame', jigs), k.hop(jigs, 20, 1));

        // STOMP… STOMP. The giant looms in.
        k.silence();
        await k.wait(400);
        k.fx.stomp(2, 0.6);
        void k.quake(8);
        await k.all(k.shake(jigs, 4, 2), k.wait(1200));
        k.pose(grumble, 'roar');
        void roar();
        k.music('spooky');
        await k.to(grumble, 1.4, { opacity: 1, y: 0, ease: 'power2.out' });
        await k.camera({ zoom: 1.25, x: 860, y: 300 }, 1);
        await k.all(k.say('whoTalking', grumble), k.quake(5));
        await k.camera({}, 0.8);

        // The children hide behind the table leg.
        await k.all(k.to(mollie, 0.6, { x: -30, opacity: 0.85 }), k.to(peter, 0.6, { x: -30, opacity: 0.85 }), k.shake(mollie, 4, 2));
        k.fx.stomp(2, 0.4);
        await k.all(k.say('seeMyFace', grumble), k.quake(6));

        // Back to the heroes: he's only tired.
        k.pose(grumble, 'default');
        yawn();
        k.music('sneaky');
        await k.say('soTired', grumble);
        await k.all(k.to(mollie, 0.5, { x: 0, opacity: 1 }), k.to(peter, 0.5, { x: 0, opacity: 1 }));
        await k.say('whisper', jigs);
        k.sparkle(600, 200, 8, 80);
        await k.say('clockPlan', mollie);

        // Jigs taps the clock to strike bedtime.
        await k.say('jigsClock', jigs);
        k.flourish(tick);
        const hands = k.pivot(k.part(tick, 'hands'));
        void k.to(hands, 1.2, { rotation: 360, ease: 'power1.inOut' });
        bong(3);
        await k.all(k.shake(tick, 3, 3), k.wait(2400));
        await k.say('bedtime', grumble);

        // Jigs tosses the nightcap up onto the giant's head.
        await k.appear(cap, 0.4);
        const head: [number, number] = [970, 70];
        await k.say('jigsCap', jigs);
        await k.carry(cap, head);
        k.fx.boing();
        await k.to(cap, 0.3, { rotation: -12 });
        k.pose(grumble, 'sleep');
        await k.say('nightNight', grumble);
        snore(1);
        k.music('dreamy');
        await k.wait(1600);
        await k.all(k.say('asleep', peter), k.hop(peter, 20, 1));
      },
    },

    // ==================================================== 4. The escape
    {
      name: 'The escape',
      set(k) {
        k.backdrop('giant-kitchen');
        k.music('dreamy');
        k.light(360, 560, 200, { color: '#ffb35c', strength: 0.3, flicker: true, z: 5 });
        k.dim(0.15, '#1d1830');
        cast.clock = k.add(clock(), { x: 500, y: 34, w: 130, z: 6 });
        cast.jigs = k.character('jigs', { x: 380, y: 196, w: 180, z: 11 });
        cast.boots = k.add(boots(), { ...BOOTS, z: BOOTS_Z });
        cast.grumble = k.character('grumble', { ...GIANT, z: 9, pose: 'sleep' });
        cast.cap = k.prop('nightcap', { x: 910, y: 10, w: 120, z: 16 });
        k.set(cast.cap, { rotation: -12 });
        cast.mollie = k.character('mollie', { x: 30, y: 380, w: 220, z: 14 });
        cast.peter = k.character('peter', { x: 196, y: 388, w: 220, z: 15 });
      },
      async play(k) {
        const { mollie, peter, jigs, grumble, boots: pair } = cast;
        snore(2);
        await k.wait(1500);
        await k.say('notFinished', jigs);
        await k.all(k.say('surprise', mollie), k.hop(mollie, 20, 1));

        // Jigs gives the boots a last rub, and they shine.
        await k.say('jigsShine', jigs);
        k.flourish(pair);
        k.fx.twinkle();
        k.sparkle(BOOTS.x + 190, BOOTS.y + 140, 18, 220);
        await k.all(k.fade(k.part(pair, 'shine'), 1, 0.8), k.glow('#fff3c8', 0.3, 1));
        await k.all(k.say('mirrors', peter), k.hop(peter, 24, 1));

        // Jigs climbs down, and everyone tiptoes off.
        jigs.style.zIndex = String(BOOTS_Z + 4);
        k.fx.boing();
        await k.to(jigs, 0.7, { x: 60, y: 190, ease: 'power1.inOut' });
        await k.say('tiptoe', jigs);
        k.fx.sneak();
        await k.all(k.to(mollie, 1.4, { x: -40 }), k.to(peter, 1.4, { x: -40 }), k.to(jigs, 1.4, { x: 20 }));
        squeak();
        await k.all(k.say('uhOh', peter), k.shake(peter, 4, 2));

        // One eye opens…
        k.silence();
        snore(1);
        await k.wait(1200);
        k.pose(grumble, 'default');
        await k.all(k.shake(mollie, 4, 2), k.shake(peter, 4, 2), k.shake(jigs, 4, 2));
        await k.say('whatsThat', grumble);
        k.fx.twinkle();
        k.sparkle(BOOTS.x + 190, BOOTS.y + 120, 10, 140);
        k.music('cosy');
        k.pose(grumble, 'beam');
        await k.all(k.say('myFace', grumble), k.to(grumble, 0.8, { rotation: -3, yoyo: true, repeat: 1 }));
        await k.say('thankYouPixie', grumble);
        k.pose(grumble, 'sleep');
        snore(1);
        await k.wait(800);
        hatBell();
        await k.all(k.say('phew', jigs), k.hop(jigs, 24, 1));
        await k.all(...[mollie, peter, jigs].map((el) => k.to(el, 1.6, { x: '-=760', ease: 'power1.in' })));
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
        cast.cocoa = k.add(cocoa(), { x: 120, y: 560, w: 100, z: 16 });
        cast.biscuit = k.add(biscuit(), { x: 230, y: 580, w: 80, z: 16 });
        k.set([cast.cocoa, cast.biscuit], { opacity: 0 });
      },
      async play(k) {
        const { mollie, peter, jigs, cocoa: cup, biscuit: treat } = cast;
        highWind(2);
        await chairRide.fly(k, ride, { x: 280, y: -110, s: 1.4, flaps: 2 });
        await chairRide.land(k, ride);
        creak();
        await k.say('homeAgain', peter);
        await chairRide.hopOff(k, ride, mollie, { x: 40, y: 360, w: 240 });
        await chairRide.hopOff(k, ride, peter, { x: 860, y: 360, w: 240 });
        k.face(peter, true);
        hatBell();
        await k.all(k.say('brave', jigs), k.hop(jigs, 16, 1));

        // Cocoa and biscuits.
        pour();
        await k.appear(cup, 0.4);
        await k.appear(treat, 0.4);
        await k.say('cocoa', mollie);
        await k.say('peterBiscuit', peter);
        await k.carry(treat, jigs);
        k.fx.pop();
        await k.vanish(treat, 0.3);
        await k.all(k.say('yumPeter', jigs), k.hop(jigs, 20, 1));
        await k.say('neverAgain', jigs);
        await k.all(k.say('notMine', peter), k.hop(peter, 20, 1));
        laugh();
        await k.all(k.shake(mollie, 4, 3), k.shake(jigs, 4, 3));
        await warmEnding(k, { cast: [mollie, peter, jigs], end: 'end', music: 'cosy' });
      },
    },
  ],
});

/** Jigs polishing the boot: his arm rubbing back and forth, with a swish. Runs alongside a line. */
async function polishing(k: Kit, jigs: HTMLElement): Promise<void> {
  const arm = k.pivot(k.part(jigs, 'armR'));
  k.sfx.rustle();
  await k.to(arm, 0.25, { rotation: -30, yoyo: true, repeat: 5, ease: 'sine.inOut' });
}
