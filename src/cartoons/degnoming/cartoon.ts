/**
 * De-gnoming the Garden: a scene from the second Harry Potter book that the
 * film left out. On Harry's first morning at the Burrow, Mrs Weasley sends
 * the boys out to clear the garden of gnomes.
 *
 *   1. Gnomes again! Breakfast in the Burrow's kitchen. A little bald face
 *      giggles at the window: gnomes! The garden's full of them again. Mrs
 *      Weasley shoos the gnome at the window and it ducks away. Out
 *      you go, boys, and de-gnome it before lunch. "De-what?" Ron: it's
 *      brilliant, I'll show you.
 *   2. Round and round. Out in the wild garden,  a bush is giggling. Ron
 *      calls into the rustling bush and a gnome pops out: "Found
 *      me!" Ron shows how: swing him round and round till he's dizzy, and
 *      over the hedge he goes. "Wheee!" Doesn't it hurt him? No, gnomes love
 *      it: his head pops up over the hedge, "Again! Again!"
 *   3. Harry's go. A gnome comes out on his own: ready for a spin! Harry
 *      gives it a go, and round and round and over the hedge it
 *      goes. Brilliant! But here they come again, marching back, grumbling
 *      and giggling: gnomes always come back. Then STOMP… STOMP. The gnomes
 *      scurry off, and the hedge shakes.
 *   4. The Gnome Chief. Up over the hedge rises the biggest, grumpiest gnome
 *      of all, with a twig crown and a scowl: "WHO has been spinning MY
 *      gnomes?" Ron gulps; Harry owns up, politely. The Chief glares… and
 *      asks, "Can I have a go?" Mrs Weasley rolls up her sleeves: leave this
 *      one to me. Round and round and WHEEE, over the hedge. Then pie in the
 *      garden, well done everyone, they'll be back tomorrow… and over the
 *      hedge the Chief pops up: "Again!" Ron passes the pie
 *      over the hedge to the Chief, who says "Mmm. Pie." 
 *
 * Swinging gnomes is fine because the gnomes love it: they giggle, shout
 * "Wheee!" and come straight back for another go, and they land out of
 * sight with a soft, bouncy boing. Nobody is hurt (the gnome in the book
 * bites Harry; not here). The scary beat is the Gnome Chief looming over
 * the hedge, and he turns out to want a spin too. Fred, George and Ginny sit
 * this one out to keep the stage to four.
 */
import { defineCartoon, now, tone, noiseBurst, type Kit } from '../../kit';
import { sounds as commonSounds } from '../../worlds/common/moves';
import meta from './meta';

const { giggle, laugh } = commonSounds;

// ---------------------------------------------------------------- sounds

/** Round and round: a wobbly whirr that rises as the gnome speeds up. */
function whirr(seconds: number): void {
  const t = now();
  tone(220, t, { wave: 'triangle', peak: 0.05, attack: 0.2, decay: seconds, glideTo: 520, vibrato: [7, 25] });
  noiseBurst(t, { freq: 700, q: 1.5, peak: 0.03, attack: 0.3, decay: seconds, sweepTo: 1600 });
}

/** A gnome landing far away, over the hedge, in something soft: a small bouncy boing. */
function landFar(): void {
  const t = now() + 0.15;
  tone(180, t, { wave: 'sine', peak: 0.07, attack: 0.01, decay: 0.5, glideTo: 90, vibrato: [14, 20] });
}

/** A gnome grumbling: low, quick, mumbly notes. */
function grumble(): void {
  const t = now();
  [0, 0.12, 0.22, 0.37, 0.5, 0.62].forEach((d, i) =>
    tone([150, 130, 160, 120, 145, 125][i], t + d, { wave: 'sawtooth', peak: 0.035, attack: 0.02, decay: 0.12, lowpass: 600 }),
  );
}

// ---------------------------------------------------------------- moves

/**
 * Swing a gnome round and round: it goes to (ox, oy) (offsets from where it
 * was placed) and circles there, turning over and over, faster and faster.
 */
async function whirl<K extends string>(k: Kit<K>, el: HTMLElement, ox: number, oy: number, turns = 3, r = 90): Promise<void> {
  await k.to(el, 0.35, { x: ox + r, y: oy, ease: 'power1.out' });
  const seconds = 0.55 * turns;
  whirr(seconds);
  // The gnomes love it: they giggle all the way round.
  giggle();
  void k.wait(seconds * 500).then(() => giggle());
  const spin = { a: 0 };
  await k.all(
    k.to(spin, seconds, {
      a: Math.PI * 2 * turns,
      ease: 'power1.in',
      onUpdate: () => k.set(el, { x: ox + r * Math.cos(spin.a), y: oy - r * 0.55 * Math.sin(spin.a) }),
    }),
    k.to(el, seconds, { rotation: `+=${360 * turns}`, ease: 'power1.in' }),
  );
}

/** Let go: up, up and away over the hedge to the right, and a soft boing far off. */
async function fling<K extends string>(k: Kit<K>, el: HTMLElement): Promise<void> {
  k.sfx.whoosh();
  await k.all(
    k.to(el, 1.2, { x: '+=900', ease: 'none' }),
    k.to(el, 1.2, { y: '-=420', ease: 'power2.out' }),
    k.to(el, 1.2, { rotation: '+=540', scale: 0.55, ease: 'none' }),
  );
  landFar();
}

// ------------------------------------------------------------------ cast

type Actor = 'mum' | 'harry' | 'ron' | 'gnome' | 'gnome2' | 'chief' | 'bush' | 'hedge' | 'pie';
const cast = {} as Record<Actor, HTMLElement>;

/** The garden: the Burrow, a scruffy hedge on the right and a bush in the middle. */
function garden<K extends string>(k: Kit<K>): void {
  k.backdrop('the-burrow');
  cast.hedge = k.prop('hedge', { x: 820, y: 440, w: 460, z: 11 });
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. Gnomes again!
    morning: { who: 'narrator', text: 'It was Harry’s first morning at the Burrow, Ron’s crooked, happy home.' },
    morningDears: { who: 'mrsWeasley', text: 'Good morning, dears! Breakfast is nearly ready.' },
    window: { who: 'harry', text: 'Er, Mrs Weasley? Something’s looking in at the window.' },
    gnomesAgain: { who: 'mrsWeasley', text: 'Gnomes! The garden’s full of gnomes again!' },
    heeHee: { who: 'gnome', text: 'Hee hee hee!' },
    shooed: { who: 'mrsWeasley', text: 'Shoo, little gnome. Shoo!' },
    outYouGo: { who: 'mrsWeasley', text: 'Out you go, boys. De-gnome my garden before lunch, please.' },
    deWhat: { who: 'harry', text: 'De-gnome? What does that mean?' },
    showYou: { who: 'ron', text: 'It’s brilliant, Harry. Come on, I’ll show you!' },
    // 2. Round and round
    howTo: { who: 'ron', text: 'First, find a gnome. They hide in the bushes.' },
    giggling: { who: 'harry', text: 'Listen! That bush is giggling.' },
    helpedBush: { who: 'ron', text: 'Come out, you! We know you’re in there!' },
    foundMe: { who: 'gnome', text: 'Hee hee! Found me!' },
    roundAndRound: { who: 'ron', text: 'Then you swing him round and round, till he’s dizzy…' },
    wheee: { who: 'gnome', text: 'Wheeeee!' },
    overHedge: { who: 'ron', text: '…and over the hedge he goes!' },
    hurt: { who: 'harry', text: 'Ron! Doesn’t that hurt him?' },
    loveIt: { who: 'ron', text: 'No! Gnomes love it. Look!' },
    again: { who: 'gnome', text: 'Again! Again!' },
    yourGo: { who: 'ron', text: 'See? Your go now, Harry.' },
    // 3. Harry's go
    ready: { who: 'harry', text: 'Hello, little gnome. Ready for a spin?' },
    spinMe: { who: 'gnome', text: 'Ready! Spin me high!' },
    helpedSpin: { who: 'ron', text: 'Go on, Harry! Round and round!' },
    miles: { who: 'ron', text: 'Brilliant! That one went miles!' },
    comingBack: { who: 'harry', text: 'Look! Here they come again!' },
    dizzy: { who: 'gnome', text: 'Dizzy, dizzy! Again, again!' },
    alwaysBack: { who: 'ron', text: 'That’s the trouble with gnomes. They always come back.' },
    uhOh: { who: 'ron', text: 'Uh-oh. What was that?' },
    // 4. The Gnome Chief
    somethingBig: { who: 'narrator', text: 'Stomp. Stomp. Something big was coming up behind the hedge…' },
    whoSpun: { who: 'gnomeChief', text: 'WHO… has been spinning… MY gnomes?' },
    theChief: { who: 'ron', text: 'It’s the Gnome Chief! The grumpiest gnome of all!' },
    itWasUs: { who: 'harry', text: 'It was us, sir. Sorry. But it’s Mrs Weasley’s garden.' },
    hmph: { who: 'gnomeChief', text: 'Hmph. Spinning. Round and round. Over the hedge.' },
    haveAGo: { who: 'gnomeChief', text: '…Can I have a go?' },
    heWantsAGo: { who: 'ron', text: 'He wants a go!' },
    leaveToMe: { who: 'mrsWeasley', text: 'Leave this one to me, dears.' },
    roundYouGo: { who: 'mrsWeasley', text: 'Round you go!' },
    chiefWheee: { who: 'gnomeChief', text: 'Wheeeeeee!' },
    pie: { who: 'mrsWeasley', text: 'Well done, boys. Pie for everyone.' },
    tomorrow: { who: 'ron', text: 'They’ll all be back tomorrow, you know.' },
    chiefAgain: { who: 'gnomeChief', text: 'Again! Again!' },
    helpedPie: { who: 'ron', text: 'Here you are, Chief. I’ll pass it over!' },
    chiefPie: { who: 'gnomeChief', text: 'Mmm. Pie. Best garden ever.' },
    end: { who: 'narrator', text: 'And the gnomes came back the next day, and the next, and the next…' },
  },
  scenes: [
    // ==================================================== 1. Gnomes again!
    {
      name: 'Gnomes again!',
      set(k) {
        k.backdrop('kitchen');
        k.music('cosy');
        cast.mum = k.character('mrsWeasley', { x: 60, y: 370, w: 260 });
        cast.ron = k.character('ron', { x: 340, y: 390, w: 240 });
        cast.harry = k.character('harry', { x: 560, y: 390, w: 240 });
        cast.gnome = k.character('gnome', { x: 510, y: 82, w: 110, z: 3 });
        k.set(cast.gnome, { opacity: 0, y: 50 });
      },
      async play(k) {
        const { mum, ron, harry, gnome } = cast;
        await k.wait(400);
        await k.say('morning');
        await k.all(k.say('morningDears', mum), k.wait(500).then(() => k.hop(mum, 20)));

        // A little bald face at the window.
        giggle();
        await k.all(k.fade(gnome, 1, 0.3), k.to(gnome, 0.5, { y: 0, ease: 'back.out(1.6)' }));
        k.face(harry, true);
        await k.say('window', harry);
        await k.all(k.say('gnomesAgain', mum), k.shake(mum, 6, 2));
        await k.say('heeHee', gnome);

        // Mrs Weasley shoos the gnome at the window.
        await k.say('shooed', mum);
        k.flourish(gnome);
        giggle();
        k.sfx.whoosh();
        await k.to(gnome, 0.3, { y: 60, opacity: 0, ease: 'power2.in' });
        await k.wait(300);

        k.face(harry, false);
        await k.say('outYouGo', mum);
        await k.say('deWhat', harry);
        await k.all(k.say('showYou', ron), k.wait(400).then(() => k.hop(ron, 26)));
        giggle();
        await k.wait(700);
      },
    },

    // ==================================================== 2. Round and round
    {
      name: 'Round and round',
      set(k) {
        garden(k);
        k.music('adventure');
        cast.harry = k.character('harry', { x: 30, y: 390, w: 240 });
        cast.ron = k.character('ron', { x: 250, y: 390, w: 240 });
        cast.gnome = k.character('gnome', { x: 555, y: 470, w: 150, z: 10 });
        cast.bush = k.prop('bush', { x: 520, y: 480, w: 220, z: 12 });
        cast.gnome2 = k.character('gnome', { x: 960, y: 300, w: 140, z: 10 });
        k.set(cast.gnome2, { opacity: 0, y: 120 });
      },
      async play(k) {
        const { harry, ron, gnome, bush, gnome2 } = cast;
        await k.wait(400);
        await k.say('howTo', ron);
        k.sfx.rustle();
        giggle();
        void k.shake(bush, 5, 2);
        await k.say('giggling', harry);

        // Ron calls into the rustling bush.
        await k.say('helpedBush', ron);
        k.flourish(bush);
        k.sfx.rustle();
        await k.to(gnome, 0.45, { y: -130, ease: 'back.out(1.8)' });
        await k.say('foundMe', gnome);

        // Ron shows how: round and round…
        await k.say('roundAndRound', ron);
        await whirl(k, gnome, -110, -150);
        await k.all(k.say('wheee', gnome), fling(k, gnome));
        await k.all(k.say('overHedge', ron), k.wait(300).then(() => k.hop(ron, 24)));
        await k.all(k.say('hurt', harry), k.shake(harry, 4, 2));
        await k.say('loveIt', ron);

        // …and up pops his head over the hedge.
        giggle();
        await k.all(k.fade(gnome2, 1, 0.3), k.to(gnome2, 0.5, { y: 0, ease: 'back.out(1.6)' }));
        await k.all(k.say('again', gnome2), k.hop(gnome2, 20, 2));
        await k.to(gnome2, 0.3, { y: 120, ease: 'power2.in' });
        await k.say('yourGo', ron);
      },
    },

    // ==================================================== 3. Harry's go
    {
      name: 'Harry’s go',
      set(k) {
        garden(k);
        k.music('adventure');
        cast.ron = k.character('ron', { x: 30, y: 390, w: 240 });
        cast.harry = k.character('harry', { x: 250, y: 390, w: 240 });
        cast.gnome = k.character('gnome', { x: 555, y: 470, w: 150, z: 10 });
        cast.bush = k.prop('bush', { x: 520, y: 480, w: 220, z: 12 });
        cast.gnome2 = k.character('gnome', { x: 820, y: 480, w: 150, z: 13, flip: true });
        k.set(cast.gnome2, { opacity: 0 });
      },
      async play(k) {
        const { ron, harry, gnome, bush, gnome2 } = cast;
        await k.wait(400);
        // A gnome comes out on his own, and hops out in front of the bush.
        k.sfx.rustle();
        void k.shake(bush, 4, 1);
        await k.to(gnome, 0.45, { y: -130, ease: 'back.out(1.8)' });
        k.set(gnome, { zIndex: 13 });
        await k.walk(gnome, -100, 0.8, 2);
        await k.to(gnome, 0.3, { y: -20 });
        await k.say('ready', harry);
        await k.all(k.say('spinMe', gnome), k.hop(gnome, 24));

        // Ron cheers Harry on, and round and round the gnome goes.
        await k.say('helpedSpin', ron);
        k.flourish(gnome);
        await whirl(k, gnome, -150, -170, 4);
        await k.all(k.say('wheee', gnome), fling(k, gnome));
        await k.all(k.say('miles', ron), k.wait(300).then(() => k.hop(ron, 26)));
        await k.wait(500);

        // Here they come again, grumbling and giggling.
        grumble();
        k.set(gnome2, { opacity: 1, x: 420 });
        await k.walk(gnome2, -420, 1.6, 5);
        await k.say('comingBack', harry);
        grumble();
        await k.all(k.say('dizzy', gnome2), k.shake(gnome2, 4, 2));
        await k.say('alwaysBack', ron);

        // STOMP… STOMP. The gnome scurries off, and the hedge shakes.
        k.silence();
        await k.wait(500);
        k.fx.stomp(2, 0.7);
        void k.quake(4);
        await k.all(k.shake(gnome2, 6, 2), k.shake(cast.hedge, 4, 2));
        k.face(gnome2, false);
        k.fx.patter(6, 0.08);
        await k.exit(gnome2, 'right', 0.6);
        k.fx.stomp(1);
        void k.quake(4);
        await k.all(k.say('uhOh', ron), k.shake(ron, 4, 2), k.shake(harry, 4, 2));
      },
    },

    // ==================================================== 4. The Gnome Chief
    {
      name: 'The Gnome Chief',
      set(k) {
        garden(k);
        cast.harry = k.character('harry', { x: 30, y: 390, w: 240 });
        cast.ron = k.character('ron', { x: 250, y: 390, w: 240 });
        cast.mum = k.character('mrsWeasley', { x: 590, y: 370, w: 260, z: 12 });
        cast.chief = k.character('gnomeChief', { x: 860, y: 230, w: 290, z: 10 });
        k.set(cast.chief, { opacity: 0, y: 260 });
        k.set(cast.mum, { opacity: 0 });
      },
      async play(k) {
        const { mum, harry, ron, chief, hedge } = cast;
        // Sound first: stomp, stomp, and the hedge shakes.
        await k.wait(400);
        k.fx.stomp(3, 0.6);
        void k.quake(5);
        await k.shake(hedge, 5, 2);
        k.music('spooky');
        k.fx.rumble(2);
        await k.all(k.say('somethingBig'), k.fade(chief, 1, 0.6), k.to(chief, 3, { y: 0, ease: 'power1.out' }));
        await k.camera({ zoom: 1.3, x: 960, y: 380 }, 1.1);
        await k.say('whoSpun', chief);
        k.fx.stomp(1);
        await k.wait(300);

        // Back to the friends: Ron gulps, Harry owns up.
        await k.camera({}, 0.9);
        await k.all(k.say('theChief', ron), k.shake(ron, 5, 3));
        await k.say('itWasUs', harry);
        await k.say('hmph', chief);
        k.silence();
        await k.wait(800);
        k.music('cosy');
        await k.all(k.say('haveAGo', chief), k.wait(400).then(() => k.hop(chief, 16)));
        laugh();
        await k.all(k.say('heWantsAGo', ron), k.hop(ron, 26));

        // Mrs Weasley bustles over, rolls up her sleeves, and round he goes.
        k.set(mum, { x: -120 });
        k.fx.patter(5, 0.12);
        await k.all(k.fade(mum, 1, 0.4), k.walk(mum, 120, 0.8, 3));
        await k.say('leaveToMe', mum);

        // She takes hold of the Chief and starts the spin.
        k.flourish(chief);
        await k.say('roundYouGo', mum);
        k.music('adventure');
        await whirl(k, chief, -40, -250, 3, 80);
        await k.all(k.say('chiefWheee', chief), fling(k, chief));
        await k.wait(500);

        // Pie in the garden.
        await k.cut(() => {
          garden(k);
          k.music('cosy');
          cast.mum = k.character('mrsWeasley', { x: 10, y: 370, w: 260 });
          cast.harry = k.character('harry', { x: 230, y: 390, w: 240 });
          cast.ron = k.character('ron', { x: 440, y: 390, w: 240 });
          cast.pie = k.prop('pie', { x: 690, y: 540, w: 160, z: 14 });
          cast.chief = k.character('gnomeChief', { x: 900, y: 250, w: 240, z: 10 });
          k.set(cast.chief, { y: 200 });
        });
        const lunch = cast;
        k.sfx.sparkle();
        await k.all(k.say('pie', lunch.mum), k.wait(400).then(() => k.hop(lunch.mum, 20)));
        await k.say('tomorrow', lunch.ron);
        await k.wait(300);
        giggle();
        await k.to(lunch.chief, 0.5, { y: 0, ease: 'back.out(1.6)' });
        await k.all(k.say('chiefAgain', lunch.chief), k.hop(lunch.chief, 18, 2));

        // Ron passes the pie over to the Chief, who has been watching it.
        await k.say('helpedPie', lunch.ron);
        await k.carry(lunch.pie, [1000, 520]);
        await k.vanish(lunch.pie);
        await k.say('chiefPie', lunch.chief);
        laugh();
        await k.all(k.hop(lunch.harry, 26), k.wait(150).then(() => k.hop(lunch.ron, 26)), k.wait(300).then(() => k.hop(lunch.mum, 20)));
        k.music('dreamy');
        await k.say('end');
        k.sparkle(560, 360, 14, 200);
        await k.wait(1200);
      },
    },
  ],
});
