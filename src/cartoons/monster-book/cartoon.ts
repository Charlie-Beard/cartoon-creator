/**
 * The Book That Bites: a summer from the third Harry Potter book that the
 * film leaves out. Harry stays on his own in Diagon Alley, eats free ice
 * creams, and has to buy the one school book nobody can open: the Monster
 * Book of Monsters, which snaps, scuttles and fights.
 *
 *   1. Summer in Diagon Alley. No Dursleys for three whole weeks! Mr
 *      Fortescue builds Harry an enormous free ice cream. His first turn: he
 *      puts the cherry on top. In the sports shop window: a Firebolt, the
 *      fastest broom ever made. One more thing on Harry's school list: the
 *      Monster Book of Monsters. "Oh dear. Good luck, Harry!"
 *   2. The cage of books. In the bookshop, something is growling. In a big
 *      iron cage the Monster Books are snapping and fighting like grumpy
 *      puppies. The poor shop manager, in enormous gloves, reaches in for
 *      one, and out it jumps. It's loose!
 *   3. The book on the loose. It scuttles round the shop, snapping at
 *      Harry's shoelaces. Hedwig flies in with a note from Hagrid: "P.S.
 *      Stroke the spine." His second turn: he strokes the book's back. It
 *      purrs and falls open like a sleepy cat. The manager strokes the books
 *      in the cage, and they all purr too.
 *   4. Old friends. On the last day of the summer, Ron and Hermione arrive.
 *      Hermione has a new cat, Crookshanks, who leaps straight onto Ron's
 *      head. His third turn: he taps Crookshanks, who jumps down.
 *   5. Ice creams for everyone. Three enormous ice creams in the sunshine,
 *      and the Monster Book purring on the table. You just have to know the
 *      trick.
 *
 * There's no villain: the trouble is a book with teeth. It snaps at air and
 * shoelaces and nips a glove, never a person, and the manager's "nipped
 * fingers" are only ever told, with a plaster. Crookshanks sits on Ron's
 * head because he likes him.
 */
import { NOTE, defineCartoon, noiseBurst, now, tone, type Kit } from '../../kit';
import { sounds as commonSounds } from '../../worlds/common/moves';
import { warmEnding } from '../../worlds/common/pieces';
import { sounds as hogSounds } from '../../worlds/hogwarts/moves';
import { owlPost } from '../../worlds/hogwarts/pieces';
import meta from './meta';

const { giggle, laugh } = commonSounds;
const { purr } = hogSounds;

// ---------------------------------------------------------------- sounds

/** A book snapping shut: a quick papery clap with a little growl. */
function snap(): void {
  const t = now();
  noiseBurst(t, { freq: 1800, q: 1.2, peak: 0.07, attack: 0.003, decay: 0.08 });
  tone(140, t, { wave: 'sawtooth', peak: 0.03, attack: 0.01, decay: 0.2, lowpass: 500 });
}

/** A small grumpy growl. */
function grr(seconds = 0.7): void {
  const t = now();
  tone(110, t, { wave: 'sawtooth', peak: 0.04, attack: 0.1, decay: seconds, lowpass: 400, vibrato: [24, 6] });
}

/** Little scuttling feet on floorboards. */
function scuttle(steps = 10): void {
  const t = now();
  for (let i = 0; i < steps; i++) noiseBurst(t + i * 0.08, { freq: 2400, q: 3, peak: 0.025, decay: 0.04 });
}

/** A dollop of ice cream landing: a soft, squishy plop. */
function plop(): void {
  const t = now();
  tone(NOTE.C5, t, { wave: 'sine', peak: 0.06, attack: 0.01, decay: 0.15, glideTo: NOTE.G4 });
}

/** A cat's surprised "mrrow!" */
function mrrow(): void {
  const t = now();
  tone(700, t, { wave: 'triangle', peak: 0.05, attack: 0.04, decay: 0.45, glideTo: 520, vibrato: [8, 20] });
}

// ------------------------------------------------------------------ cast

type Actor = 'harry' | 'ron' | 'hermione' | 'fortescue' | 'manager' | 'book' | 'bookA' | 'bookB' | 'cat' | 'cage' | 'sundae' | 'broom' | 'list';
const cast = {} as Record<Actor, HTMLElement>;
let post: ReturnType<typeof owlPost.set>;

/** The big cage at the right of the shop (320 × 360) at x 840, y 310: inside x 880 to 1120, y 402 to 632. */
const CAGE = { x: 840, y: 310, w: 320 };

/** A book snaps: its open mouth flashes for a moment, with a snap. */
async function chomp<K extends string>(k: Kit<K>, book: HTMLElement, times = 1): Promise<void> {
  for (let i = 0; i < times; i++) {
    snap();
    k.set(k.part(book, 'mouthOpen'), { opacity: 1 });
    await k.to(book, 0.12, { y: '-=10', yoyo: true, repeat: 1 });
    k.set(k.part(book, 'mouthOpen'), { opacity: 0 });
    await k.wait(140);
  }
}

/** The books in the cage fight: they jostle and snap, and the cage rattles. */
async function fight<K extends string>(k: Kit<K>, books: HTMLElement[], cage: HTMLElement): Promise<void> {
  grr(1);
  await k.all(chomp(k, books[0], 2), k.wait(150).then(() => chomp(k, books[1], 2)), k.shake(cage, 3, 3));
}

export default defineCartoon({
  ...meta,
  lines: {
    // 1. Summer in Diagon Alley
    summer: { who: 'narrator', text: 'One summer, Harry stayed all by himself in Diagon Alley, the wizard shopping street.' },
    noDursleys: { who: 'harry', text: 'No Dursleys for three whole weeks! Hello, {name}!' },
    morning: { who: 'fortescue', text: 'Good morning, Harry! Your free ice cream, as always?' },
    yesPlease: { who: 'harry', text: 'Yes please, Mr Fortescue!' },
    scoops: { who: 'fortescue', text: 'Strawberry, chocolate, vanilla, cream, nuts and sprinkles…' },
    askCherry: { who: 'fortescue', text: 'And a cherry on top. Will you put it on, {name}? Tap it!' },
    nudgeCherry: { who: 'fortescue', text: 'Tap the little red cherry.' },
    helpedCherry: { who: 'fortescue', text: 'Plop! There we go.' },
    biggest: { who: 'harry', text: 'It’s the biggest ice cream in the world!' },
    firebolt: { who: 'harry', text: 'And look! A Firebolt. The fastest broom ever made.' },
    list: { who: 'fortescue', text: 'What’s left on your school list, Harry?' },
    oneBook: { who: 'harry', text: 'Just one book. The Monster Book of Monsters.' },
    goodLuck: { who: 'fortescue', text: 'The Monster Book? Oh dear. Good luck, Harry!' },
    // 2. The cage of books
    bookshop: { who: 'narrator', text: 'So Harry went into the bookshop, Flourish and Blotts.' },
    noise: { who: 'harry', text: 'What’s that noise?' },
    notThose: { who: 'bookManager', text: 'Oh no. You want a Monster Book? Not the Monster Books!' },
    puppies: { who: 'narrator', text: 'In a big iron cage, the books were snapping and fighting like grumpy puppies.' },
    nipped: { who: 'bookManager', text: 'They’ve nipped my fingers fourteen times this week.' },
    gloves: { who: 'harry', text: 'Is that why you’re wearing those enormous gloves?' },
    standBack: { who: 'bookManager', text: 'Exactly. Right. Stand back, Harry!' },
    loose: { who: 'bookManager', text: 'Oh no! It’s loose! Catch it!' },
    // 3. The book on the loose
    shoelaces: { who: 'harry', text: 'It’s chasing my shoelaces!' },
    counter: { who: 'bookManager', text: 'Help! I’m staying up here!' },
    hedwig: { who: 'harry', text: 'Hedwig! You’ve brought me a note from Hagrid.' },
    note: { who: 'harry', text: 'Happy summer, Harry. P.S. Stroke the spine.' },
    stroke: { who: 'harry', text: 'Stroke its spine? All right. Here goes.' },
    askSpine: { who: 'harry', text: '{name}, help me stroke its back. Tap the book’s spine!' },
    nudgeSpine: { who: 'harry', text: 'Tap the furry back of the book.' },
    helpedSpine: { who: 'harry', text: 'Gently… gently…' },
    purring: { who: 'narrator', text: 'The book gave a big happy purr, and fell open like a sleepy cat.' },
    itPurrs: { who: 'harry', text: 'It’s purring!' },
    whyDidnt: { who: 'bookManager', text: 'Stroke the spine! Why didn’t I think of that?' },
    allPurring: { who: 'bookManager', text: 'Listen! They’re all purring now!' },
    thanksBoth: { who: 'bookManager', text: 'Thank you, Harry. And thank your friend too. That book is free!' },
    thanksHarry: { who: 'bookManager', text: 'Thank you, Harry! That book is free!' },
    // 4. Old friends
    lastDay: { who: 'narrator', text: 'On the last day of summer, Harry’s best friends came to Diagon Alley.' },
    weAreHere: { who: 'ron', text: 'Harry! We’re here!' },
    newCat: { who: 'hermione', text: 'And look! I’ve got a new cat. His name is Crookshanks.' },
    wall: { who: 'ron', text: 'His face is all squashed. Did he run into a wall?' },
    offMyHead: { who: 'ron', text: 'Argh! Get him off my head!' },
    likesYou: { who: 'hermione', text: 'Crookshanks, no! He just likes you, Ron.' },
    askCat: { who: 'hermione', text: '{name}, can you tap Crookshanks? Then he’ll jump down.' },
    nudgeCat: { who: 'hermione', text: 'Tap the big ginger cat.' },
    helpedCat: { who: 'hermione', text: 'Down you come, you silly cat.' },
    myHair: { who: 'ron', text: 'My hair! Is it all still there?' },
    allThere: { who: 'harry', text: 'All there, Ron. Come on. I know where to get ice cream.' },
    // 5. Ice creams for everyone
    three: { who: 'narrator', text: 'Mr Fortescue brought three enormous ice creams to the table.' },
    onTheHouse: { who: 'fortescue', text: 'For Harry and his friends. Enjoy!' },
    brilliant: { who: 'ron', text: 'Brilliant!' },
    isItPurring: { who: 'hermione', text: 'Harry, is your book purring?' },
    trick: { who: 'harry', text: 'That’s my Monster Book. You just have to know the trick.' },
    stroked: { who: 'harry', text: '{name} and I found it out. Stroke the spine!' },
    end: { who: 'narrator', text: 'And they ate their ice creams in the sunshine, while the Monster Book purred.' },
  },
  scenes: [
    // ==================================================== 1. Summer in Diagon Alley
    {
      name: 'Summer in Diagon Alley',
      set(k) {
        k.backdrop('diagon-alley');
        k.music('cosy');
        cast.broom = k.prop('firebolt', { x: 880, y: 440, w: 190, z: 3 });
        cast.fortescue = k.character('fortescue', { x: 120, y: 410, w: 240 });
        cast.sundae = k.prop('sundae', { x: 390, y: 420, w: 150, z: 14 });
        k.set(k.part(cast.sundae, 'cherry'), { opacity: 0 });
        k.set(cast.sundae, { opacity: 0 });
        cast.harry = k.character('harry', { x: 560, y: 432, w: 220 });
      },
      async play(k) {
        const { harry, fortescue, sundae, broom } = cast;
        await k.wait(300);
        await k.say('summer');
        await k.all(k.say('noDursleys', harry), k.hop(harry, 24));
        await k.say('morning', fortescue);
        await k.say('yesPlease', harry);

        // Scoop by scoop, an enormous ice cream.
        await k.fade(sundae, 1, 0.4);
        plop();
        await k.pop(sundae, 1.1);
        await k.say('scoops', fortescue);
        plop();
        await k.pop(sundae, 1.08);

        // His first turn: the cherry on top.
        const sb = k.box(sundae);
        const spot = k.add('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"></svg>', { x: sb.x + sb.w / 2 - 60, y: sb.y - 40, w: 120, h: 120, z: 20 });
        await k.tapToHelp(spot, { ask: 'askCherry', nudge: 'nudgeCherry', helped: 'helpedCherry', by: fortescue, size: 120 });
        k.remove(spot);
        const cherry = k.part(sundae, 'cherry');
        k.set(cherry, { opacity: 1, y: -60 });
        await k.to(cherry, 0.4, { y: 0, ease: 'bounce.out' });
        plop();
        k.sparkle(sb.x + sb.w / 2, sb.y + 20, 10, 80);
        await k.all(k.say('biggest', harry), k.hop(harry, 20));

        // In the window across the street: a Firebolt.
        k.music('magic');
        k.sparkle(975, 485, 12, 160);
        await k.to(broom, 0.6, { y: -10, yoyo: true, repeat: 1, ease: 'sine.inOut' });
        await k.say('firebolt', harry);
        k.music('cosy');
        await k.say('list', fortescue);
        k.sfx.page();
        await k.say('oneBook', harry);
        k.fx.uhoh();
        await k.all(k.say('goodLuck', fortescue), k.shake(fortescue, 3, 2));
        await k.wait(400);
      },
    },

    // ==================================================== 2. The cage of books
    {
      name: 'The cage of books',
      set(k) {
        k.backdrop('flourish-and-blotts');
        k.music('sneaky');
        cast.bookA = k.character('monsterBook', { x: 880, y: 474, w: 130, z: 4 });
        cast.bookB = k.character('monsterBook', { x: 990, y: 474, w: 130, z: 4 });
        cast.cage = k.prop('bookCage', { ...CAGE, z: 6 });
        cast.harry = k.character('harry', { x: 30, y: 432, w: 220, z: 10 });
        cast.manager = k.character('bookManager', { x: 470, y: 420, w: 240, z: 10 });
        k.set(cast.harry, { x: -400 });
      },
      async play(k) {
        const { harry, manager, bookA, bookB, cage } = cast;
        k.fx.patter(6);
        await k.all(k.say('bookshop'), k.to(harry, 1.6, { x: 0, ease: 'power1.out' }));
        grr(1.2);
        await k.wait(900);
        await k.say('noise', harry);
        await k.all(k.say('notThose', manager), k.shake(manager, 4, 3));
        await fight(k, [bookA, bookB], cage);
        await k.say('puppies');
        await fight(k, [bookB, bookA], cage);
        await k.say('nipped', manager);
        await k.say('gloves', harry);
        await k.say('standBack', manager);

        // He opens the cage and reaches in… and out jumps a book!
        commonSounds.click();
        await k.to(k.pivot(k.part(cage, 'door')), 0.5, { scaleX: 0.15 });
        await k.to(manager, 0.6, { x: 220, ease: 'power1.inOut' });
        await chomp(k, bookA, 2);
        k.fx.boing();
        await k.to(manager, 0.4, { x: 120, ease: 'power2.out' });
        scuttle(12);
        await k.to(bookA, 0.9, { x: -380, y: 40, zIndex: 12, ease: 'power1.inOut' });
        await k.all(k.say('loose', manager), chomp(k, bookA, 2));
        await k.wait(300);
      },
    },

    // ==================================================== 3. The book on the loose
    {
      name: 'The book on the loose',
      set(k) {
        k.backdrop('flourish-and-blotts');
        k.music('adventure');
        cast.bookB = k.character('monsterBook', { x: 990, y: 474, w: 130, z: 4 });
        cast.cage = k.prop('bookCage', { ...CAGE, z: 6 });
        k.set(k.pivot(k.part(cast.cage, 'door')), { scaleX: 0.15 });
        cast.manager = k.character('bookManager', { x: 70, y: 280, w: 230, z: 3 });
        cast.harry = k.character('harry', { x: 330, y: 432, w: 220, z: 10 });
        cast.book = k.character('monsterBook', { x: 640, y: 520, w: 130, z: 12 });
        post = owlPost.set(k, { to: cast.harry, from: 'right' });
        // The other book is round the back of the cage until Hedwig has been and gone (five on stage is a crowd).
        k.set(cast.bookB, { opacity: 0 });
      },
      async play(k) {
        const { harry, manager, book, bookB, cage } = cast;
        // It scuttles round the shop, snapping at Harry's shoelaces.
        scuttle(10);
        await k.to(book, 0.7, { x: -150, ease: 'power1.inOut' });
        await k.all(chomp(k, book, 2), k.hop(harry, 30));
        await k.say('shoelaces', harry);
        scuttle(10);
        await k.to(book, 0.7, { x: 60, ease: 'power1.inOut' });
        await k.all(k.say('counter', manager), k.shake(manager, 4, 3));

        // Hedwig brings a note from Hagrid.
        await owlPost.play(k, post);
        await k.say('hedwig', harry);
        await owlPost.open(k, post, { line: 'note', by: harry });
        grr(0.6);
        void k.fade(bookB, 1, 0.5);
        await k.say('stroke', harry);

        // His second turn: stroke the book's spine (its furry back, on the left).
        const bb = k.box(book);
        const spine = k.add('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"></svg>', { x: bb.x + bb.w * 0.2 - 60, y: bb.y + bb.h * 0.5 - 60, w: 120, h: 120, z: 20 });
        const how = await k.tapToHelp(spine, { ask: 'askSpine', nudge: 'nudgeSpine', helped: 'helpedSpine', by: harry, size: 140 });
        k.remove(spine);
        purr();
        k.pose(book, 'purring');
        k.sparkle(bb.x + bb.w / 2, bb.y + bb.h / 2, 10, 120);
        await k.say('purring');
        k.music('cosy');
        await k.all(k.say('itPurrs', harry), k.hop(harry, 20));
        await k.say('whyDidnt', manager);

        // The manager strokes the books in the cage, and they purr too.
        await k.to(manager, 0.9, { x: 640, ease: 'power1.inOut' });
        purr();
        k.pose(bookB, 'purring');
        k.sparkle(1055, 540, 10, 120);
        await k.shake(cage, 1, 1);
        await k.say('allPurring', manager);
        await k.say(how === 'tapped' ? 'thanksBoth' : 'thanksHarry', manager);
        await k.wait(400);
      },
    },

    // ==================================================== 4. Old friends
    {
      name: 'Old friends',
      set(k) {
        k.backdrop('diagon-alley');
        k.music('cosy');
        cast.harry = k.character('harry', { x: 330, y: 432, w: 220 });
        cast.ron = k.character('ron', { x: 540, y: 432, w: 220 });
        cast.hermione = k.character('hermione', { x: 750, y: 436, w: 220 });
        cast.cat = k.character('crookshanks', { x: 1035, y: 545, w: 140, z: 12 });
        k.set([cast.ron, cast.hermione, cast.cat], { x: 700 });
      },
      async play(k) {
        const { harry, ron, hermione, cat } = cast;
        await k.say('lastDay');
        k.fx.patter(8);
        await k.to([ron, hermione, cat], 1.8, { x: 0, ease: 'power1.out' });
        await k.all(k.say('weAreHere', ron), k.hop(ron, 26));
        purr();
        await k.say('newCat', hermione);
        await k.say('wall', ron);

        // Crookshanks leaps straight onto Ron's head.
        // He sits on top of Ron's hair, small, so Ron's face still shows underneath him.
        const { face } = k.box(ron);
        const cb = k.box(cat);
        const sit = 0.7;
        mrrow();
        await k.to(cat, 0.7, {
          x: `+=${face.cx - (cb.x + cb.w / 2)}`,
          y: `+=${face.y + face.h * 0.15 - cb.h * (0.5 + sit / 2) - cb.y}`,
          scale: sit, zIndex: 14, ease: 'power1.out',
        });
        await k.all(k.say('offMyHead', ron), k.shake(ron, 6, 4));
        await k.say('likesYou', hermione);

        // His third turn: tap Crookshanks, and down he jumps.
        await k.tapToHelp(cat, { ask: 'askCat', nudge: 'nudgeCat', helped: 'helpedCat', by: hermione, size: 160 });
        mrrow();
        await k.to(cat, 0.7, { x: 0, y: 0, scale: 1, ease: 'power1.inOut' });
        purr();
        laugh();
        await k.say('myHair', ron);
        await k.say('allThere', harry);
        await k.wait(300);
      },
    },

    // ==================================================== 5. Ice creams for everyone
    {
      name: 'Ice creams for everyone',
      set(k) {
        k.backdrop('diagon-alley');
        k.music('cosy');
        cast.harry = k.character('harry', { x: 380, y: 432, w: 210 });
        cast.ron = k.character('ron', { x: 580, y: 432, w: 210 });
        cast.hermione = k.character('hermione', { x: 780, y: 436, w: 210 });
        cast.fortescue = k.character('fortescue', { x: 120, y: 410, w: 240 });
        cast.book = k.character('monsterBook', { x: 230, y: 470, w: 120, pose: 'purring', z: 12 });
        k.set(cast.book, { opacity: 0 });
      },
      async play(k) {
        const { harry, ron, hermione, fortescue, book } = cast;
        await k.say('three');
        // Three ice creams, one for each.
        const ices = [harry, ron, hermione].map((el) => {
          const b = k.box(el);
          const s = k.prop('sundae', { x: b.x + b.w / 2 - 50, y: 600, w: 100, z: 15 });
          k.set(s, { opacity: 0, y: 30 });
          return s;
        });
        for (const s of ices) {
          plop();
          await k.to(s, 0.35, { opacity: 1, y: 0, ease: 'back.out(1.6)' });
        }
        await k.say('onTheHouse', fortescue);
        await k.all(k.say('brilliant', ron), k.hop(ron, 24));

        // Mr Fortescue goes back to his shop. Beside Harry, the Monster Book is purring.
        await k.to(fortescue, 0.8, { x: -360, opacity: 0, ease: 'power1.in' });
        purr();
        await k.fade(book, 1, 0.5);
        await k.say('isItPurring', hermione);
        giggle();
        await k.say('trick', harry);
        await k.say('stroked', harry);
        purr();
        await warmEnding(k, { cast: [harry, ron, hermione], end: 'end' });
      },
    },
  ],
});
