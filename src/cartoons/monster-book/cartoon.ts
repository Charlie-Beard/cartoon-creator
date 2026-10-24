/**
 * The Book That Bites: a summer from the third Harry Potter book that the
 * film leaves out. Harry stays on his own in Diagon Alley, eats free ice
 * creams, and has to buy the one school book nobody can open: the Monster
 * Book of Monsters, which snaps, scuttles and fights.
 *
 *   1. Summer in Diagon Alley. No Dursleys for three whole weeks! Mr
 *      Fortescue builds Harry an enormous free ice cream and puts the cherry
 *      on top. In the sports shop window: a Firebolt, the
 *      fastest broom ever made. One more thing on Harry's school list: the
 *      Monster Book of Monsters. "Oh dear. Good luck, Harry!"
 *   2. The cage of books. In the bookshop, something is growling. In a big
 *      iron cage the Monster Books are snapping and fighting like grumpy
 *      puppies. The poor shop manager, in enormous gloves, reaches in for
 *      one. The manager fetches his thick spare glove
 *      from a pile of books. Then out jumps a book. It's loose!
 *   3. The book on the loose. It scuttles round the shop, snapping at
 *      Harry's shoelaces. Hedwig flies in with a note from Hagrid: "P.S.
 *      Stroke the spine." Harry strokes the book's back. It
 *      purrs and falls open like a sleepy cat. The manager strokes the books
 *      in the cage, and they all purr too.
 *   4. Old friends. On the last day of the summer, Ron and Hermione arrive.
 *      Hermione has a new cat, Crookshanks, who leaps straight onto Ron's
 *      head. Hermione calls Crookshanks, who jumps down.
 *   5. Ice creams for everyone. Three enormous ice creams in the sunshine.
 *      Mr Fortescue carries Ron's ice cream across
 *      to Ron. The Monster Book is purring on the table. You just have to know the
 *      trick.
 *
 * There's no villain: the trouble is a book with teeth. It snaps at air and
 * shoelaces and chews gloves, never a person. Crookshanks sits on Ron's
 * head because he likes him.
 */
import { curve, ellipse, ink, piece, poly, rect, type Node } from '../../art/paper';
import { NOTE, defineCartoon, noiseBurst, now, svg, tone, type Kit } from '../../kit';
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

// ------------------------------------------------------------------- art

/** The manager's thick spare glove: a big brown leather gauntlet, 110 × 130, standing up as if on a hand. */
function glove(): string {
  const leather = '#9a6234';
  const dark = '#7a4a26';
  const nodes: Node[] = [
    // the cuff, then the palm
    piece(rect(26, 82, 58, 42, 5), dark),
    piece(poly([[22, 86], [18, 50], [26, 24], [86, 24], [94, 50], [88, 86]]), leather),
    // four fat fingers and a thumb
    piece(ellipse(32, 22, 11, 20, -0.1), leather),
    piece(ellipse(51, 14, 11, 22), leather),
    piece(ellipse(70, 16, 11, 21), leather),
    piece(ellipse(87, 28, 10, 18, 0.2), leather),
    piece(curve([[20, 66], [6, 56], [4, 42], [14, 44], [24, 54]], 2), leather),
    // stitching and a patch
    ink([[28, 90], [82, 90]], { width: 2.5, color: '#e9d3a3' }),
    piece(rect(40, 52, 30, 22, 4), '#c9a24a', { edge: 'cut' }),
    ink([[46, 63], [64, 63]], { width: 2.5, color: dark }),
  ];
  return svg({ w: 110, h: 130, name: 'monster-book-glove' }, nodes);
}

// ------------------------------------------------------------------ cast

type Actor = 'glove' | 'pile' | 'harry' | 'ron' | 'hermione' | 'fortescue' | 'manager' | 'book' | 'bookA' | 'bookB' | 'cat' | 'cage' | 'sundae' | 'broom' | 'list';
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
    noDursleys: { who: 'harry', text: 'No Dursleys for three whole weeks! Hooray!' },
    morning: { who: 'fortescue', text: 'Good morning, Harry! Your free ice cream, as always?' },
    yesPlease: { who: 'harry', text: 'Yes please, Mr Fortescue!' },
    scoops: { who: 'fortescue', text: 'Strawberry, chocolate, vanilla… and sprinkles!' },
    helpedCherry: { who: 'fortescue', text: 'And a cherry on top! Plop! There we go.' },
    biggest: { who: 'harry', text: 'It’s the biggest ice cream in the world!' },
    firebolt: { who: 'harry', text: 'And look! A Firebolt. The fastest broom ever made.' },
    list: { who: 'fortescue', text: 'What’s left on your school list, Harry?' },
    oneBook: { who: 'harry', text: 'Just one book. The Monster Book of Monsters.' },
    goodLuck: { who: 'fortescue', text: 'The Monster Book? Oh dear. Good luck, Harry!' },
    // 2. The cage of books
    bookshop: { who: 'narrator', text: 'So Harry went into the bookshop, Flourish and Blotts.' },
    noise: { who: 'harry', text: 'What’s that noise?' },
    notThose: { who: 'bookManager', text: 'A Monster Book? They’re very grumpy, Harry!' },
    puppies: { who: 'narrator', text: 'In a big iron cage, the books were snapping and fighting like grumpy puppies.' },
    nipped: { who: 'bookManager', text: 'They’ve chewed my gloves fourteen times this week.' },
    gloves: { who: 'harry', text: 'Is that why you’re wearing those enormous gloves?' },
    helpedGlove: { who: 'bookManager', text: 'Yes, that’s why! I’ll fetch my thickest glove.' },
    thanksGlove: { who: 'bookManager', text: 'Got it. Now stand back, Harry!' },
    loose: { who: 'bookManager', text: 'Oh no! It’s loose! Catch it!' },
    // 3. The book on the loose
    shoelaces: { who: 'harry', text: 'It’s chasing my shoelaces!' },
    counter: { who: 'bookManager', text: 'Help! I’m staying up here!' },
    hedwig: { who: 'harry', text: 'Hedwig! You’ve brought me a note from Hagrid.' },
    note: { who: 'harry', text: 'Happy summer, Harry. P.S. Stroke the spine.' },
    stroke: { who: 'harry', text: 'Stroke its spine? All right. Here goes.' },
    helpedSpine: { who: 'harry', text: 'Gently… gently…' },
    purring: { who: 'narrator', text: 'The book gave a big happy purr, and fell open like a sleepy cat.' },
    itPurrs: { who: 'harry', text: 'It’s purring!' },
    whyDidnt: { who: 'bookManager', text: 'Stroke the spine! Why didn’t I think of that?' },
    allPurring: { who: 'bookManager', text: 'Listen! They’re purring too!' },
    thanksHarry: { who: 'bookManager', text: 'Thank you, Harry! That book is free!' },
    // 4. Old friends
    lastDay: { who: 'narrator', text: 'On the last day of summer, Harry’s best friends came to Diagon Alley.' },
    weAreHere: { who: 'ron', text: 'Harry! We’re here!' },
    newCat: { who: 'hermione', text: 'And look! I’ve got a new cat. His name is Crookshanks.' },
    wall: { who: 'ron', text: 'His face is all squashed. Did he run into a wall?' },
    offMyHead: { who: 'ron', text: 'Argh! Get him off my head!' },
    likesYou: { who: 'hermione', text: 'Crookshanks, no! He just likes you, Ron.' },
    helpedCat: { who: 'hermione', text: 'Down you come, you silly cat.' },
    myHair: { who: 'ron', text: 'My hair! Is it all still there?' },
    allThere: { who: 'harry', text: 'All there, Ron. Come on. I know where to get ice cream.' },
    // 5. Ice creams for everyone
    three: { who: 'narrator', text: 'Mr Fortescue brought three enormous ice creams to the table.' },
    helpedIce: { who: 'fortescue', text: 'And this one is for Ron. Here you go.' },
    onTheHouse: { who: 'fortescue', text: 'For Harry and his friends. Enjoy!' },
    brilliant: { who: 'ron', text: 'Brilliant!' },
    isItPurring: { who: 'hermione', text: 'Harry, is your book purring?' },
    trick: { who: 'harry', text: 'That’s my Monster Book. You just have to know the trick.' },
    hagridTrick: { who: 'harry', text: 'Hagrid told me the trick. Stroke the spine!' },
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
        cast.fortescue = k.character('fortescue', { x: 60, y: 430, w: 240 });
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

        // Mr Fortescue puts the cherry on top. It waits, still, just above the ice cream.
        const cherry = k.part(sundae, 'cherry');
        k.set(cherry, { opacity: 1, y: -60 });
        const sb = k.box(sundae);
        await k.say('helpedCherry', fortescue);
        await k.to(cherry, 0.4, { y: 0, ease: 'bounce.out' });
        plop();
        k.sparkle(sb.x + sb.w / 2, sb.y + 20, 10, 80);
        await k.all(k.say('biggest', harry), k.hop(harry, 20));

        // In the window across the street: a Firebolt.
        k.sparkle(975, 485, 12, 160);
        await k.to(broom, 0.6, { y: -10, yoyo: true, repeat: 1, ease: 'sine.inOut' });
        await k.say('firebolt', harry);
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
        cast.manager = k.character('bookManager', { x: 520, y: 420, w: 240, z: 10 });
        // His spare glove waits on a pile of books between the two of them.
        cast.pile = k.prop('bookPile', { x: 290, y: 510, w: 200, z: 5 });
        cast.glove = k.add(glove(), { x: 335, y: 392, w: 110, h: 130, z: 7 });
        k.set(cast.harry, { x: -400 });
      },
      async play(k) {
        const { harry, manager, bookA, bookB, cage, glove: spare } = cast;
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

        // The manager fetches the thick spare glove from the pile of books.
        const gb = k.box(manager);
        await k.say('helpedGlove', manager);
        await k.carry(spare, [gb.x + gb.w / 2, gb.y + gb.h * 0.62]);
        await k.vanish(spare);
        await k.say('thanksGlove', manager);

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

        // Harry strokes the book's spine (its furry back, on the left).
        const bb = k.box(book);
        await k.say('helpedSpine', harry);
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
        await k.say('thanksHarry', manager);
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

        // Hermione calls Crookshanks, and down he jumps.
        await k.say('helpedCat', hermione);
        k.flourish(cat);
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
        // Ron sits next to Mr Fortescue, so his ice cream has a clear way to go.
        cast.ron = k.character('ron', { x: 500, y: 432, w: 210 });
        cast.harry = k.character('harry', { x: 745, y: 432, w: 210 });
        cast.hermione = k.character('hermione', { x: 950, y: 436, w: 210 });
        cast.fortescue = k.character('fortescue', { x: 60, y: 430, w: 240 });
        cast.book = k.character('monsterBook', { x: 330, y: 520, w: 120, pose: 'purring', z: 12 });
        k.set(cast.book, { opacity: 0 });
      },
      async play(k) {
        const { harry, ron, hermione, fortescue, book } = cast;
        await k.say('three');
        // Three ice creams, one for each. Harry's and Hermione's land by themselves.
        const ices = [harry, hermione].map((el) => {
          const b = k.box(el);
          const s = k.prop('sundae', { x: b.x + b.w * 0.68, y: 540, w: 100, z: 15 });
          k.set(s, { opacity: 0, y: 30 });
          return s;
        });
        for (const s of ices) {
          plop();
          await k.to(s, 0.35, { opacity: 1, y: 0, ease: 'back.out(1.6)' });
        }

        // Mr Fortescue carries the last ice cream across to Ron.
        const ronBox = k.box(ron);
        const last = k.prop('sundae', { x: 255, y: 540, w: 100, z: 15 });
        k.set(last, { opacity: 0 });
        plop();
        await k.fade(last, 1, 0.35);
        await k.say('helpedIce', fortescue);
        await k.carry(last, [ronBox.x + ronBox.w * 0.68 + 50, 540 + 70]);
        await k.say('onTheHouse', fortescue);
        await k.all(k.say('brilliant', ron), k.hop(ron, 24));

        // Mr Fortescue goes back to his shop. On the table, the Monster Book is purring.
        await k.to(fortescue, 0.8, { x: -360, opacity: 0, ease: 'power1.in' });
        purr();
        await k.fade(book, 1, 0.5);
        await k.say('isItPurring', hermione);
        giggle();
        await k.say('trick', harry);
        await k.say('hagridTrick', harry);
        purr();
        await warmEnding(k, { cast: [harry, ron, hermione], end: 'end' });
      },
    },
  ],
});
