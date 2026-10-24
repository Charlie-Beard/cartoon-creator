/**
 * Hogwarts' set pieces: the whole recurring bits of staging that come back
 * episode after episode, so a scene can be twenty lines instead of a hundred.
 * The one-shot sounds and moves (Hedwig's wings, the crack of apparating,
 * a wand flick, a cloak's swish) are in ./moves.ts; these are the scenes
 * made from them.
 *
 *   import { apparateArrival, broomArrival, greatHall, owlPost, spellLesson, voldemortLoom } from '../../worlds/hogwarts/pieces';
 *
 *   owlPost            Hedwig swoops in with a letter; the letter is opened
 *   greatHall          the feast or gathering: long tables, floating candles, a welcome, the food appears
 *   spellLesson        a teacher, a pupil's first try fizzles, the second lifts a feather
 *   broomArrival       friends swoop in on brooms and land
 *   apparateArrival    friends pop in with a crack and a puff of smoke
 *   voldemortLoom      the hiss, the loom, the push-in, and the cut back to the heroes
 *
 * How a piece works (docs/WORLDS.md, "pieces.ts"):
 *
 *   - A piece is an object whose parts are async functions (or one async
 *     function). `set` builds the opening picture: no waiting, no motion, so
 *     it is legal inside a scene's `set`. It returns the actors it made.
 *     `play` (and any other part) takes them and animates.
 *   - Lines are never written here. The cartoon passes line keys
 *     (`welcome: 'welcome'`) that are in its own `lines`, so the voice export
 *     finds them, and `npm run check` counts a key handed to a piece as used.
 *   - Where a beat of your own belongs in the middle (catch the letter), the
 *     piece comes in two parts and you put it between.
 *   - Everything waits through the kit, so a skipped scene stops where it was.
 *   - A piece that is a whole place (the top of the ladder, Moon-Face's room, the
 *     Great Hall) puts up its backdrop unless the scene already has one. Call
 *     `k.backdrop('moon-room')` first if you like: `npm run check` reads those
 *     calls, but it can't see inside a piece, and a place a piece shows is
 *     "never shown" to it (a warning, not an error).
 *   - Spells are beams of light aimed at objects or the sky, never at a
 *     person's body. The villain's loom follows docs/STYLE.md: sound first, a
 *     slow loom, the camera in for a line or two, then back to the heroes.
 */
import { C } from '../../art/palette';
import { cached, ellipse, piece, rect, svg, type Node } from '../../art/paper';
import type { Kit, Mood, Side } from '../../kit';
import { centreOf, ensureBackdrop, placeAll, type Placed } from '../common/pieces';
import { sounds as commonSounds } from '../common/moves';
import { moves, sounds } from './moves';

// ------------------------------------------------------------------- art

/**
 * A long Great Hall table seen from the front (1100 × 110): a plain wooden
 * top laid with gold plates and goblets, and a darker front. Stand people
 * behind it so it hides their chests. Pass a `name` to seed the torn edges.
 */
export const longTable = cached((name: string = 'hogwarts-long-table') => {
  const laid: Node[] = [];
  for (let i = 0; i < 8; i++) {
    const x = 80 + i * 134;
    laid.push(
      piece(ellipse(x, 27, 40, 11), C.goldLight, { shadow: false }),
      piece(ellipse(x, 26, 27, 7), C.cream, { edge: 'cut', fibre: false, shadow: false }),
      piece(rect(x + 48, 6, 12, 22, 3), C.gold, { shadow: false }),
    );
  }
  return svg({ w: 1100, h: 110, name }, [
    piece(rect(0, 44, 1100, 62, 5), C.brownDark),
    piece(rect(0, 0, 1100, 54, 8), C.wood),
    piece(rect(10, 5, 1080, 38, 5), C.tan, { edge: 'cut', fibre: false, shadow: false, opacity: 0.5 }),
    ...laid,
  ]);
});

/** A small wooden lesson desk (200 × 150) with a flat top to stand an object on. Pass a `name` to seed the torn edges. */
export const lessonDesk = cached((name: string = 'hogwarts-lesson-desk') =>
  svg({ w: 200, h: 150, name }, [
    piece(rect(22, 40, 18, 110, 3), C.barkDark, { edge: 'cut' }),
    piece(rect(160, 40, 18, 110, 3), C.barkDark, { edge: 'cut' }),
    piece(rect(0, 12, 200, 34, 6), C.brownDark),
    piece(rect(0, 4, 200, 30, 6), C.wood),
    piece(rect(10, 10, 180, 18, 4), C.tan, { edge: 'cut', fibre: false, shadow: false, opacity: 0.5 }),
  ]),
);

// ---------------------------------------------------------------- owlPost

/** The actors `owlPost.set` makes. */
export interface OwlPostActors {
  /** The owl, hidden, in her flying pose. */
  owl: HTMLElement;
  /** The letter (a cream envelope with a red seal), hidden until it drops. */
  letter: HTMLElement;
  /** Who it is for: the actor you passed in. */
  to: HTMLElement;
  /** The side the owl arrives from and leaves by. */
  from: Side;
}

/**
 * The owl post: Hedwig swoops in with a flutter of wings, hoots, and lets
 * a letter drop and sway down to land in front of the person it is for. They
 * can catch it (a deed in the script goes between the parts), then the seal pops, the
 * letter lifts, and the person reads it. Hedwig flies off.
 *
 *   owlPost.set(k, { to, owl?, from? })               in `set`: Hedwig and the letter, hidden
 *   owlPost.play(k, a, { stay? })                      she arrives, drops the letter, leaves
 *   owlPost.open(k, a, { line?, by? })                 the letter is opened
 *
 * `set` options: `to` is the person (already on stage) the letter is for; `owl` is who
 * flies (default 'hedwig'); `from` is the side she comes in by (default 'right'). It returns
 * `{ owl, letter, to, from }`. She hovers by the person's shoulder on that side, with about
 * 170 points of room above their head, and the letter lands at their shoulder, clear of their face.
 *
 * `play` options: `stay` true keeps her on stage, hovering, rather than flying off. The
 * letter ends lying in front of the person, small and still: the place for a hero to catch it.
 *
 * `open` options: `line` is a key `by` says (default the person) once the letter is open
 * ("It's from Hagrid! He's invited us to tea!").
 *
 *   const a = owlPost.set(k, { to: harry });                                          // in set
 *   await owlPost.play(k, a);
 *   await k.say('catchLetter', harry);
 *   k.flourish(a.letter);                                                             // the catch
 *   await owlPost.open(k, a, { line: 'readLetter' });
 */
export const owlPost = {
  /** Hedwig and the letter, hidden. No motion: legal in a scene's `set`. */
  set<K extends string>(k: Kit<K>, o: { to: HTMLElement; owl?: string; from?: Side }): OwlPostActors {
    const from = o.from ?? 'right';
    const side = from === 'left' ? -1 : 1;
    const [cx, cy] = centreOf(o.to);
    const w = parseFloat(o.to.style.width) || 240;
    const h = parseFloat(o.to.style.height) || w * 1.13;
    const top = cy - h / 2;
    // The letter lands at the person's shoulder, on the side the owl comes from, clear of their face.
    const tx = cx + side * (w / 2 + 20);
    const owl = k.character(o.owl ?? 'hedwig', { x: tx + side * 30 - 105, y: Math.max(20, top - 170), w: 210, z: 25, pose: 'fly' });
    const letter = k.prop('owlPostLetter', { x: tx - 55, y: top + 0.72 * h - 55, w: 110, z: 26 });
    k.set([owl, letter], { opacity: 0 });
    return { owl, letter, to: o.to, from };
  },

  /** She swoops in and hoots, the letter drops and sways down in front of the person, and she flies off (unless `stay`). */
  async play<K extends string>(k: Kit<K>, a: OwlPostActors, o: { stay?: boolean } = {}): Promise<void> {
    await moves.swoopIn(k, a.owl, a.from, 1.1);
    await moves.hoot(k, a.owl, 1);
    // The letter starts at her feet and drifts down, swaying, to land in front of the person.
    const [ox, oy] = centreOf(a.owl);
    const [lx, ly] = centreOf(a.letter);
    k.set(a.letter, { x: ox - lx, y: oy - ly + 70, opacity: 1, rotation: -10 });
    k.sfx.page();
    await k.all(k.to(a.letter, 1, { y: 0, ease: 'sine.in' }), k.to(a.letter, 1, { x: 0, rotation: 8, ease: 'sine.out' }));
    await k.to(a.letter, 0.2, { rotation: -3, ease: 'sine.out' });
    k.fx.pop();
    await k.pop(a.letter, 1.1);
    if (!o.stay) await moves.flyOff(k, a.owl, a.from, 0.9);
  },

  /** The seal pops with a sparkle, the letter lifts into view, the person reads it, and it fades away. */
  async open<K extends string>(k: Kit<K>, a: OwlPostActors, o: { line?: K; by?: HTMLElement } = {}): Promise<void> {
    const [x, y] = centreOf(a.letter);
    k.sfx.page();
    k.fx.twinkle();
    k.sparkle(x, y, 12, 110);
    void k.glow(C.candle, 0.25, 1.2);
    // It lifts up and out, away from the person's face.
    await k.to(a.letter, 0.6, { scale: 1.8, x: a.from === 'left' ? '-=40' : '+=40', y: '-=110', rotation: 0, ease: 'back.out(1.3)' });
    if (o.line) await k.say(o.line, o.by ?? a.to);
    await k.fade(a.letter, 0, 0.5);
    k.remove(a.letter);
  },
};

// -------------------------------------------------------------- greatHall

/** The actors `greatHall.set` makes. */
export interface HallActors {
  /** Whoever stands to welcome everyone (null if you gave none). */
  host: HTMLElement | null;
  guests: HTMLElement[];
  /** The long table in front of them. */
  table: HTMLElement;
  /** Candles floating in front of the wall, bobbing gently. */
  candles: HTMLElement[];
}

/** How big each feast prop is on the table, [w, h], so its bottom sits on a plate. */
const FEAST: Record<string, [number, number]> = { pie: [120, 72], pumpkin: [92, 92], birthdayCake: [100, 100] };

/**
 * The Great Hall feast or gathering: the starry ceiling, the banners, a long
 * table laid with gold plates in front, people sitting behind it with their
 * chests hidden by the table, candles floating and bobbing. A host welcomes
 * everyone, food pops on to the table one dish at a time, and everyone cheers.
 *
 *   greatHall.set(k, { guests, host?, music? })               the hall, in `set`
 *   greatHall.play(k, a, { welcome?, cheer?, by?, food? })     welcome, feast, cheer
 *
 * `set` options: `guests` are `{ id, x, y?, w?, z?, flip? }` (default y 385, w 200, so the
 * table hides their chests; four or five fit across the hall); `host` is one more of the same
 * who does the welcoming (default y 360, w 220; try x 480 for the middle); `music` (default
 * 'magic'). It returns `{ host, guests, table, candles }`.
 *
 * `play` options: `welcome` is a line key the host says; `food` is what appears on the table, in
 * order, from 'pie', 'pumpkin', 'birthdayCake' (default five dishes); `cheer` is a line key
 * `by` says (default the host) as everyone else hops with joy.
 *
 *   const a = greatHall.set(k, { host: { id: 'dumbledore', x: 480 }, guests: [{ id: 'harry', x: 150 }, { id: 'ron', x: 780 }] });   // in set
 *   await greatHall.play(k, a, { welcome: 'welcome', cheer: 'hooray' });
 */
export const greatHall = {
  /** The hall laid for a feast. Nothing waits: legal in `set` (the candles bob gently from the start, and hold still while a deed is done). */
  set<K extends string>(k: Kit<K>, o: { guests: Placed[]; host?: Placed; music?: Mood }): HallActors {
    ensureBackdrop(k, 'great-hall');
    k.music(o.music ?? 'magic');
    // Candles drift in front of the wall (the backdrop's own are painted on).
    const candles = [[110, 250], [300, 170], [470, 280], [690, 190], [860, 270], [1030, 180]].map(([x, y], i) => {
      const c = k.prop('floatingCandle', { x, y, w: 46, z: 8 });
      k.float(c, 6 + (i % 3) * 2, 2.4 + (i % 2) * 0.6);
      return c;
    });
    const people = placeAll(k, [...(o.host ? [{ y: 360, w: 220, ...o.host }] : []), ...o.guests], { y: 385, w: 200 });
    const host = o.host ? people[0] : null;
    const guests = o.host ? people.slice(1) : people;
    const table = k.add(longTable(), { x: 40, y: 575, w: 1100, z: 15 });
    return { host, guests, table, candles };
  },

  /** The welcome, the food appearing dish by dish, and everyone's cheer. */
  async play<K extends string>(k: Kit<K>, a: HallActors, o: { welcome?: K; cheer?: K; by?: HTMLElement; food?: string[] } = {}): Promise<void> {
    if (o.welcome) await k.say(o.welcome, a.host ?? undefined);
    const dishes = o.food ?? ['pie', 'pumpkin', 'birthdayCake', 'pumpkin', 'pie'];
    for (let i = 0; i < dishes.length; i++) {
      const [w, h] = FEAST[dishes[i]] ?? [100, 100];
      const x = 150 + (dishes.length > 1 ? (i * 780) / (dishes.length - 1) : 390) - w / 2;
      const dish = k.prop(dishes[i], { x, y: 626 - h, w, z: 16 });
      k.set(dish, { opacity: 0 });
      k.fx.pop();
      await k.appear(dish, 0.25);
      k.sparkle(x + w / 2, 626 - h / 2, 6, 50);
      await k.wait(150);
    }
    k.fx.twinkle();
    commonSounds.laugh();
    const speaker = o.by ?? a.host ?? undefined;
    const cheering = [...(a.host ? [a.host] : []), ...a.guests].filter((el) => el !== speaker);
    await k.all(...cheering.map((el, i) => k.wait(i * 200).then(() => k.hop(el, 24, 2))), o.cheer ? k.say(o.cheer, speaker) : k.wait(600));
    await k.wait(300);
  },
};

// ------------------------------------------------------------ spellLesson

/** The actors `spellLesson.set` makes. */
export interface LessonActors {
  teacher: HTMLElement;
  pupils: HTMLElement[];
  /** The thing the spell lifts, standing on the desk. */
  object: HTMLElement;
  desk: HTMLElement;
}

/**
 * A spell lesson: the teacher says the magic words, a pupil flicks their
 * wand at an object on the desk (never at a person), the first try fizzles
 * with a puff and a wobble and the teacher encourages, and the second works:
 * a beam of light, a twinkle, and the object floats up, hangs in the air,
 * and sinks gently back as everyone cheers.
 *
 *   spellLesson.set(k, { teacher, pupils, object?, desk?, backdrop?, music? })    in `set`
 *   spellLesson.play(k, a, { spell?, fizzle?, cheer?, caster? })
 *
 * `set` options: `teacher` and `pupils` are `{ id, x, y?, w?, z?, flip? }` (default y 360, w 230;
 * the classroom has room for four across; leave the right-hand side, x 760 to 980, for the desk);
 * `object` is a prop id (default 'quill'); `desk` is where the desk's top-left goes, [x, y]
 * (default [770, 500]); `backdrop` (default 'classroom'); `music` (default 'magic'). It
 * returns `{ teacher, pupils, object, desk }`.
 *
 * `play` options: `spell` is a line key the teacher says first (the magic words and what to do);
 * `fizzle` is a key the teacher says after the first try goes wrong (leave it out and the first
 * try works); `cheer` is a key the teacher says when it floats; `caster` is the pupil who casts
 * (default the one standing nearest the object, so the beam never crosses anyone else).
 *
 *   const a = spellLesson.set(k, { teacher: { id: 'mcgonagall', x: 60 }, pupils: [{ id: 'hermione', x: 340 }, { id: 'ron', x: 560 }] });   // in set
 *   await spellLesson.play(k, a, { spell: 'leviosa', fizzle: 'tryAgain', cheer: 'wellDone' });
 */
export const spellLesson = {
  /** The classroom, the teacher, the pupils, and the object on its desk. No motion: legal in `set`. */
  set<K extends string>(
    k: Kit<K>,
    o: { teacher: Placed; pupils: Placed[]; object?: string; desk?: [number, number]; backdrop?: string; music?: Mood },
  ): LessonActors {
    ensureBackdrop(k, o.backdrop ?? 'classroom');
    k.music(o.music ?? 'magic');
    const [dx, dy] = o.desk ?? [770, 500];
    const desk = k.add(lessonDesk(), { x: dx, y: dy, w: 200, z: 12 });
    const object = k.prop(o.object ?? 'quill', { x: dx + 45, y: dy - 92, w: 110, z: 13 });
    const [teacher, ...pupils] = placeAll(k, [o.teacher, ...o.pupils], { y: 360, w: 230 });
    return { teacher, pupils, object, desk };
  },

  /** The words, an optional fizzle, the spell that works, and the cheer. */
  async play<K extends string>(k: Kit<K>, a: LessonActors, o: { spell?: K; fizzle?: K; cheer?: K; caster?: HTMLElement } = {}): Promise<void> {
    // The pupil standing nearest the object casts, so the beam never crosses anyone else.
    const nearest = [...a.pupils].sort((p, q) => Math.abs(centreOf(p)[0] - centreOf(a.object)[0]) - Math.abs(centreOf(q)[0] - centreOf(a.object)[0]))[0];
    const caster = o.caster ?? nearest;
    const flick = async (): Promise<void> => {
      // The wand's tip is at the caster's right hand (the left, if they are turned the other way).
      const w = parseFloat(caster.style.width) || 230;
      const h = parseFloat(caster.style.height) || w * 1.13;
      const flipped = caster.querySelector<HTMLElement>(':scope > .story-flip')?.style.transform.includes('-1');
      const [cx, cy] = centreOf(caster);
      const tip: [number, number] = [cx + w * (flipped ? -0.33 : 0.33), cy + h * 0.09];
      const [ox, oy] = centreOf(a.object);
      await k.all(moves.castSpell(k, caster), k.wait(260).then(() => k.beam(tip, [ox, oy], C.goldLight, 0.35)));
    };
    if (o.spell) await k.say(o.spell, a.teacher);
    if (o.fizzle) {
      // The first try goes wrong, in a silly way: a puff, a wobble.
      await flick();
      const [ox, oy] = centreOf(a.object);
      k.fx.fizzle();
      k.puff(ox, oy - 30, 100, C.stoneLight);
      await k.shake(a.object, 5, 2);
      await k.say(o.fizzle, a.teacher);
    }
    await flick();
    const [ox, oy] = centreOf(a.object);
    k.fx.twinkle();
    k.sparkle(ox, oy, 12, 110);
    void k.glow(C.goldLight, 0.25, 1.2);
    await k.to(a.object, 1.4, { y: -230, rotation: 10, ease: 'sine.out' });
    await k.wait(400);
    const speaker = a.teacher;
    await k.all(
      o.cheer ? k.say(o.cheer, speaker) : k.wait(600),
      ...a.pupils.map((el, i) => k.wait(i * 200).then(() => k.hop(el, 24, 2))),
    );
    // It sinks gently back to the desk.
    await k.to(a.object, 1, { y: 0, rotation: 0, ease: 'sine.inOut' });
    await k.pop(a.object, 1.1);
  },
};

// ---------------------------------------------------------- broomArrival

/** The actors `broomArrival.set` makes. */
export interface BroomActors {
  riders: HTMLElement[];
  /** One broom under each rider, in the same order. */
  brooms: HTMLElement[];
  /** The side they arrive from. */
  from: 'left' | 'right';
}

/**
 * Arriving by broom: the riders sweep in across the sky one after another,
 * each sitting on a broom, ease down, land with a thump and a puff, and
 * hop off as the broom drops to the ground beside them. For the Quidditch
 * pitch, the grounds, the courtyard: anywhere with sky.
 *
 *   broomArrival.set(k, { riders, from? })                       in `set`: riders and brooms, off stage
 *   broomArrival.play(k, a, { seconds?, stagger?, line?, by? })   they swoop in and land
 *
 * `set` options: `riders` are `{ id, x, y?, w?, z?, flip? }` (the place each ends up standing,
 * default y 380, w 200, which sits the bust on the grass in `castle-grounds`); `from` is the side they come in from (default 'left'). It returns
 * `{ riders, brooms, from }`, with everyone parked off stage and every broom level.
 *
 * `play` options: `seconds` is each one's swoop (default 1.4), `stagger` the gap between
 * riders in ms (default 300), `line` a key `by` (default the first rider) says once they
 * have all landed.
 *
 *   const a = broomArrival.set(k, { riders: [{ id: 'harry', x: 300 }, { id: 'ginny', x: 640 }] });   // in set
 *   await broomArrival.play(k, a, { line: 'madeIt' });
 */
export const broomArrival = {
  /** The riders and their brooms, parked off stage. No motion: legal in `set`. */
  set<K extends string>(k: Kit<K>, o: { riders: Placed[]; from?: 'left' | 'right' }): BroomActors {
    const from = o.from ?? 'left';
    const riders = placeAll(k, o.riders, { y: 380, w: 200 });
    const brooms = riders.map((r) => {
      const w = parseFloat(r.style.width) || 200;
      const left = parseFloat(r.style.left) || 0;
      const top = parseFloat(r.style.top) || 0;
      const z = Number(r.style.zIndex) || 10;
      // A level broom across the bottom of the bust, bristles trailing behind (flying to the right means bristles on the left).
      const b = k.prop('broomstick', { x: left + w / 2 - 140, y: top + w * 1.13 - 135, w: 280, z: z + 1, ...(from === 'left' ? { flip: true } : {}) });
      k.set(b, { rotation: from === 'left' ? 30 : -30 });
      return b;
    });
    // Parked off stage, high up, on the side they come from.
    const dx = from === 'left' ? -1500 : 1500;
    k.set([...riders, ...brooms], { x: dx, y: -260 });
    return { riders, brooms, from };
  },

  /** Each rider in turn: a long swoop down across the sky, a landing thump with a puff, and the broom dropping beside them. */
  async play<K extends string>(k: Kit<K>, a: BroomActors, o: { seconds?: number; stagger?: number; line?: K; by?: HTMLElement } = {}): Promise<void> {
    const seconds = o.seconds ?? 1.4;
    const tilt = a.from === 'left' ? 30 : -30;
    const land = async (i: number): Promise<void> => {
      const pair = [a.riders[i], a.brooms[i]];
      k.fx.wind(seconds);
      await k.all(k.to(pair, seconds, { x: 0, ease: 'power2.out' }), k.to(pair, seconds, { y: 0, ease: 'sine.out' }));
      k.fx.thud();
      const [cx, cy] = centreOf(a.brooms[i]);
      k.puff(cx, cy + 70, 110, C.stoneLight);
      await k.pop(a.riders[i], 1.06);
      // Off the broom: it drops and leans, bristles down, beside them.
      await k.to(a.brooms[i], 0.5, { y: '+=45', rotation: tilt * 0.45, ease: 'back.out(1.4)' });
    };
    k.sfx.whoosh();
    const flights: Promise<void>[] = [];
    for (let i = 0; i < a.riders.length; i++) {
      flights.push(land(i));
      if (i < a.riders.length - 1) await k.wait(o.stagger ?? 300);
    }
    await k.all(...flights);
    if (o.line) await k.say(o.line, o.by ?? a.riders[0]);
  },
};

// -------------------------------------------------------- apparateArrival

/**
 * Arriving by apparating: one after another, each person pops in with a
 * crack and a puff of smoke, wherever you placed them. A house-elf's way
 * of arriving; wizards do it too.
 *
 *   apparateArrival.set(k, actors)                       in `set`: hides them
 *   apparateArrival.play(k, actors, { gap?, line?, by? })    crack! crack! crack!
 *
 * `play` options: `gap` is the pause between one and the next in ms (default 450); `line` is
 * a key `by` (default the last to arrive) says once everyone is there ("Dobby is here!").
 *
 *   apparateArrival.set(k, [dobby, kreacher]);                     // in set
 *   await apparateArrival.play(k, [dobby, kreacher], { line: 'hello' });
 */
export const apparateArrival = {
  /** Hides the actors until they pop in. No motion: legal in `set`. */
  set<K extends string>(k: Kit<K>, actors: HTMLElement[]): HTMLElement[] {
    k.set(actors, { opacity: 0 });
    return actors;
  },

  /** Crack and a puff for each, with a gap between. */
  async play<K extends string>(k: Kit<K>, actors: HTMLElement[], o: { gap?: number; line?: K; by?: HTMLElement } = {}): Promise<void> {
    for (const el of actors) {
      await moves.apparate(k, el, true);
      await k.wait(o.gap ?? 450);
    }
    if (o.line) await k.say(o.line, o.by ?? actors[actors.length - 1]);
  },
};

// ---------------------------------------------------------- voldemortLoom

/**
 * Voldemort looms in: the scary beat, done the safe way (docs/STYLE.md).
 * Sound first (a hush, an ominous low note, a long hiss), then he rises into
 * view in the loom pose, slowly, in shadow; the camera pushes in for a line
 * or two (his cloak swishes between them); then it cuts back to the heroes,
 * wide, with a brave line. He never aims a wand at anyone and nobody is hurt.
 *
 *   voldemortLoom.set(k, { x, y, w?, flip? })                  him, hidden, in the loom pose, in `set`
 *   voldemortLoom.approach(k, { line?, trembling? })            the hush, the note, the hiss
 *   voldemortLoom.loom(k, v, { lines, frighten?, focus? })      he rises and speaks
 *   voldemortLoom.cutBack(k, { line?, by?, before? })           wide shot, and a hero speaks
 *   voldemortLoom.retreat(k, v, { line? })                      he's outwitted and melts away in a huff
 *
 * `set` options: where he stands, `{ x, y, w?, flip? }` (default w 300, z 9; x 740, y 250 suits the
 * Forbidden Forest or the courtyard). He is returned hidden and a little low.
 *
 * `approach` options: `line` is a narrator key said while the sounds build ("The candles
 * flickered. Something cold slid across the floor."); `trembling` are the heroes who shiver.
 * It starts with `k.silence()` itself. Anything that belongs to the place (the lights dimming) goes before.
 *
 * `loom` options: `lines` is one or two keys he says (more would hold the camera in too long);
 * `frighten` are the heroes who jump as he appears; `focus` is where the camera pushes in,
 * [x, y] (default his face). It starts the 'spooky' music and a low rumble.
 *
 * `cutBack` options: once the camera is back at the wide shot, `before` runs (a hero lifts their
 * wand towards the sky), then `line` is said by `by`.
 *
 * `retreat` options: `line` is a key he says as he gives up; then his cloak swishes and he melts
 * away in a puff of dark smoke. The heroes cheer afterwards, in your script.
 *
 *   const v = voldemortLoom.set(k, { x: 740, y: 250 });                                    // in set
 *   await voldemortLoom.approach(k, { line: 'cold', trembling: [ron] });                   // in play
 *   await voldemortLoom.loom(k, v, { lines: ['hiss1', 'hiss2'], frighten: [harry, hermione] });
 *   await voldemortLoom.cutBack(k, { line: 'together', by: harry });
 */
export const voldemortLoom = {
  /** Voldemort, hidden and looming, standing where you say. No motion: legal in `set`. */
  set<K extends string>(k: Kit<K>, o: { x: number; y: number; w?: number; flip?: boolean }): HTMLElement {
    const v = k.character('voldemort', { x: o.x, y: o.y, w: o.w ?? 300, z: 9, pose: 'loom', ...(o.flip ? { flip: true } : {}) });
    k.set(v, { opacity: 0, y: 60 });
    return v;
  },

  /** A hush, one ominous low note, a long soft hiss, the narrator's line over it, the heroes shivering. */
  async approach<K extends string>(k: Kit<K>, o: { line?: K; trembling?: HTMLElement[] } = {}): Promise<void> {
    k.silence();
    await k.wait(400);
    const said = o.line ? k.say(o.line) : Promise.resolve();
    k.sfx.ominous();
    await k.wait(1200);
    sounds.snakeHiss(1.4);
    for (const el of o.trembling ?? []) void k.shake(el, 3, 2);
    await k.wait(1500);
    await said;
  },

  /** He rises slowly into view with a rumble, the camera pushes in, he speaks (his cloak swishing between two lines). */
  async loom<K extends string>(k: Kit<K>, v: HTMLElement, o: { lines: [K] | [K, K]; frighten?: HTMLElement[]; focus?: [number, number] }): Promise<void> {
    k.music('spooky');
    k.fx.rumble(1.2);
    await k.all(k.to(v, 1.6, { opacity: 1, y: 0, ease: 'power2.out' }), ...(o.frighten ?? []).map((el) => k.shake(el, 5, 2)));
    const left = parseFloat(v.style.left) || 0;
    const top = parseFloat(v.style.top) || 0;
    const w = parseFloat(v.style.width) || 300;
    const [fx, fy] = o.focus ?? [left + w / 2, top + w * 0.3];
    void k.camera({ zoom: 1.3, x: fx, y: fy }, 1);
    // The loom pose has no talking mouth: he speaks in his ordinary one.
    k.pose(v, 'default');
    await k.say(o.lines[0], v);
    if (o.lines[1]) {
      await moves.swishCloak(k, v);
      await k.say(o.lines[1], v);
    }
  },

  /** Back to the heroes: the camera comes back to the wide shot and one of them speaks. */
  async cutBack<K extends string>(k: Kit<K>, o: { line?: K; by?: HTMLElement; before?: () => Promise<unknown> } = {}): Promise<void> {
    await k.camera({}, 0.8);
    if (o.before) await o.before();
    if (o.line) await k.say(o.line, o.by);
  },

  /** Outwitted: his last cross line, a swish of cloak, and he melts away in a puff of dark smoke. */
  async retreat<K extends string>(k: Kit<K>, v: HTMLElement, o: { line?: K } = {}): Promise<void> {
    if (o.line) await k.say(o.line, v);
    sounds.cloakSwish();
    await k.to(v, 0.3, { x: '+=24', ease: 'power2.out' });
    const [cx, cy] = centreOf(v);
    k.fx.poof();
    k.puff(cx, cy, 260, C.charcoal);
    await k.fade(v, 0, 0.7);
    await k.wait(300);
  },
};
