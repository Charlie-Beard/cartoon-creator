/**
 * The Faraway Tree's set pieces: the whole recurring bits of staging that
 * come back episode after episode, so a scene can be twenty lines instead of
 * a hundred. The one-shot sounds and moves are in ./moves.ts; these are the
 * scenes made from them.
 *
 *   import { ladderArrival, landMovesOn, slipperySlip, snapDefeat, snapLoom, teaTime, trapdoorArrival } from '../../worlds/faraway/pieces';
 *
 *   ladderArrival      climbing up through the cloud into a new land, the land revealed
 *   landMovesOn        the rumble, "the land is moving on!", the hurry back down the ladder
 *   slipperySlip       whizzing down the slippery-slip round the trunk to the cushions
 *   teaTime            tea and pop biscuits in Moon-Face's round room, everyone in their places
 *   trapdoorArrival    clambering up through the trapdoor into Moon-Face's room
 *   snapLoom           Dame Snap's clack, clack, CLACK, her looming, and the cut back to the heroes
 *   snapDefeat         her temper breaks her own ruler and she stomps off in a huff
 *
 * How a piece works (docs/WORLDS.md, "pieces.ts"):
 *
 *   - A piece is an async function `(k, options)`, or an object whose parts
 *     are such functions. `set` builds the opening picture: no waiting, no
 *     motion, so it is legal inside a scene's `set`. It returns the actors
 *     it made. `play` (and any other part) takes those actors and animates.
 *   - Lines are never written here. The cartoon passes line keys
 *     (`line: 'newLand'`) that are in its own `lines`, so the voice export
 *     finds them, and `npm run check` counts a key handed to a piece as used.
 *   - A piece never calls `k.tapToHelp` for you (the checker looks for one in
 *     the cartoon, and his turns are yours to write). Where a turn belongs in
 *     the middle, the piece comes in two parts and you put the turn between.
 *   - Everything waits through the kit, so a skipped scene stops where it was.
 *   - Scary pieces follow docs/STYLE.md: sound first, a slow loom, the camera
 *     in for a line or two, then back to the heroes. Nobody is touched.
 */
import { C } from '../../art/palette';
import { cached, circle, ellipse, ink, piece, rect, rng, svg, type Node, type Pt } from '../../art/paper';
import type { Kit, Mood, Side } from '../../kit';
import { centreOf, placeAll, type Placed } from '../common/pieces';
import { sounds as commonSounds } from '../common/moves';
import { moves, sounds } from './moves';

// ------------------------------------------------------------------- art

/**
 * A thick grey cloud (680 × 380, lazy swirls in it) that hides a new land
 * until he taps it away. Pass a `name` to seed the torn edges
 * ('<cartoon-id>-cloud'); the same name always draws the same paper.
 */
export const greyCloud = cached((name: string = 'faraway-grey-cloud') => {
  const r = rng(41);
  const greys = ['#a9a6a6', '#bbb7b1', '#9c9a9e', '#b3afab'];
  const puffs: Node[] = [];
  for (let i = 0; i < 9; i++) {
    const x = 70 + i * 68;
    const lift = Math.sin((i / 8) * Math.PI) * 90;
    puffs.push(piece(circle(x, 190 - lift - r() * 24, 74 + r() * 26), greys[i % greys.length], { shadow: i % 3 === 0, rough: 1.2 }));
  }
  const swirl = (cx: number, cy: number, size: number): Node => {
    const pts: Pt[] = [];
    for (let a = 0; a < Math.PI * 3.2; a += 0.3) pts.push([cx + Math.cos(a) * (a / 10) * size, cy + Math.sin(a) * (a / 10) * size * 0.7]);
    return ink(pts, { width: 4, color: '#86838a', opacity: 0.8, wobble: 1 });
  };
  return svg({ w: 680, h: 380, name, label: 'a thick grey cloud' }, [
    piece(ellipse(340, 260, 330, 110), '#8f8d92', { rough: 1.3 }),
    ...puffs,
    piece(ellipse(340, 250, 310, 96), '#b7b3ae', { shadow: false, rough: 1.2 }),
    swirl(220, 200, 46),
    swirl(470, 170, 54),
    swirl(350, 280, 38),
  ]);
});

/** A low round tea table (300 × 130) for Moon-Face's room. Pass a `name` to seed the torn edges. */
export const teaTable = cached((name: string = 'faraway-tea-table') =>
  svg({ w: 300, h: 130, name }, [
    piece(rect(40, 40, 18, 86, 3), C.barkDark, { edge: 'cut' }),
    piece(rect(242, 40, 18, 86, 3), C.barkDark, { edge: 'cut' }),
    piece(rect(140, 50, 20, 76, 3), C.bark, { edge: 'cut' }),
    piece(ellipse(150, 44, 146, 18), C.brownDark, { shadow: false }),
    piece(ellipse(150, 34, 146, 24), C.wood),
    piece(ellipse(150, 32, 120, 16), C.cream, { edge: 'cut', fibre: false, opacity: 0.85 }),
  ]),
);

// ----------------------------------------------------------- ladderArrival

/** The actors `ladderArrival.set` makes. */
export interface LadderActors {
  /** The land's far view in the sky (hidden until it is revealed). */
  far: HTMLElement;
  /** The strip of cloud in front of everyone: they stand in it. */
  front: HTMLElement;
  /** The thick cloud over the land, or null if you asked for none. */
  cover: HTMLElement | null;
  /** The friends, in the order you listed them, hidden down in the cloud. */
  friends: HTMLElement[];
}

/**
 * Climbing the ladder up through the cloud into a new land: the friends
 * pop up one by one at the top of the Tree, the land arrives in the sky
 * ahead of them, and (if it is hidden) he blows the cloud away to see it.
 *
 *   ladderArrival.set(k, { land, friends, cover?, music? })    the picture, in `set`
 *   ladderArrival.play(k, a, { line?, by? })                    the climb, and a line while the cloud churns
 *   ladderArrival.reveal(k, a, { how?, thanks?, by? })          the land appears
 *
 * `set` options: `land` is the far view's id without its `far-` ('snap-school',
 * 'topsy-turvy' …, the lands in ./index.ts); `friends` are `{ id, x, y?, w?, z?,
 * flip? }` (default y 400, w 240; listed in the order they climb up); `cover` is
 * true for the thick grey cloud, or a cloud's own art, or false/left out for a land
 * that is just there; `music` (default 'magic'). It returns `{ far, front, cover,
 * friends }`.
 *
 * `play` options: `line` is a key said by `by` while the cover churns slowly ("A new
 * land! But this cloud is too thick to see it."). The Saucepan Man clanks and
 * Silky whirrs and flutters as they climb; everyone else just scrambles.
 *
 * `reveal` options: `how` is what `k.tapToHelp` returned ('tapped' by default; 'helped' lets
 * Silky's spell blow the cloud away); `thanks` is said by `by` (who also hops) only when
 * he tapped it himself. With no cover the land just fades in with a twinkle. The camera and
 * the next beat are yours.
 *
 *   const a = ladderArrival.set(k, { land: 'snap-school', cover: true, friends: [{ id: 'moonface', x: 200 }, { id: 'silky', x: 480, y: 382, w: 210 }] });  // in set
 *   await ladderArrival.play(k, a, { line: 'newLand', by: a.friends[0] });
 *   const how = await k.tapToHelp(a.cover!, { ask: 'askCloud', nudge: 'nudgeCloud', helped: 'spellCloud', by: a.friends[0], helper: a.friends[1], size: 300 });
 *   await ladderArrival.reveal(k, a, { how, thanks: 'thanksCloud', by: a.friends[0] });
 */
export const ladderArrival = {
  /** The cloud at the top of the ladder, the land in the sky, the friends hidden in the cloud below. No motion: legal in `set`. */
  set<K extends string>(k: Kit<K>, o: { land: string; friends: Placed[]; cover?: boolean | string; music?: Mood }): LadderActors {
    k.backdrop('cloud-top');
    k.music(o.music ?? 'magic');
    const far = k.prop(`far-${o.land}`, { x: 290, y: 150, w: 600, z: 5 });
    const art = o.cover === true ? greyCloud() : o.cover || null;
    const cover = art ? k.add(art, { x: 240, y: 40, w: 700, z: 8 }) : null;
    const friends = placeAll(k, o.friends, { y: 400, w: 240 });
    const front = k.prop('cloud-front', { x: 0, y: 600, z: 22 });
    k.set(far, { opacity: 0 });
    // Everyone starts down in the cloud, out of sight, and pops up.
    k.set(friends, { y: 320 });
    return { far, front, cover, friends };
  },

  /** The wind, the patter of feet on rungs, each friend popping up out of the cloud in turn, and (with `line`) the cover churning slowly while it is said. */
  async play<K extends string>(k: Kit<K>, a: LadderActors, o: { line?: K; by?: HTMLElement } = {}): Promise<void> {
    k.fx.wind(2.5);
    await k.wait(300);
    k.fx.patter(4, 0.12);
    for (const el of a.friends) {
      const who = el.dataset.who;
      // Each regular makes their own noise on the way up; Silky comes up on her wings, a little slower.
      if (who === 'saucepan') sounds.clank(3, 0.12);
      if (who === 'silky') {
        sounds.whirr(8);
        void moves.flutter(k, el, 6);
      }
      await k.to(el, who === 'silky' ? 0.9 : 0.7, { y: 0, ease: who === 'silky' ? 'back.out(1.2)' : 'back.out(1.3)' });
    }
    if (!o.line) return;
    if (a.cover) {
      // The grey cloud churns slowly, then settles.
      void k.to(a.cover, 2.4, { scale: 1.03, rotation: 1, ease: 'sine.inOut' });
      await k.say(o.line, o.by);
      await k.to(a.cover, 0.6, { scale: 1, rotation: 0, ease: 'sine.inOut' });
    } else {
      await k.say(o.line, o.by);
    }
  },

  /** The cloud blows away in puffs (or, with no cover, the land just fades in) and a sparkle bursts where the land is. */
  async reveal<K extends string>(k: Kit<K>, a: LadderActors, o: { how?: 'tapped' | 'helped'; thanks?: K; by?: HTMLElement } = {}): Promise<void> {
    const how = o.how ?? 'tapped';
    if (a.cover) {
      if (how === 'helped') {
        // The story does it for him: a little spell from the middle of the cloud.
        k.fx.spell();
        await k.beam([590, 470], [590, 240], C.goldLight, 0.4);
      }
      sounds.blowAway();
      for (const [x, y] of [[380, 180], [590, 120], [800, 190], [470, 300], [710, 310]] as const) {
        k.puff(x, y, 200, '#c9c5bf');
        await k.wait(90);
      }
      await k.all(k.to(a.cover, 1.1, { opacity: 0, scale: 1.25, y: -60, ease: 'power2.out' }), k.fade(a.far, 1, 1.2));
    } else {
      k.fx.twinkle();
      await k.fade(a.far, 1, 1.2);
    }
    k.sparkle(590, 240, 14, 260);
    if (how === 'tapped' && o.thanks) await k.all(k.say(o.thanks, o.by), o.by ? k.hop(o.by, 30, 2) : k.wait(0));
  },
};

// -------------------------------------------------------------- landMovesOn

/**
 * "The land is moving on!": the ground rumbles, someone shouts the warning,
 * and everyone hurries off to the ladder (off to the left, where the ladder
 * is in `cloud-top`). The heroes always get out in time.
 *
 * Options:
 *   friends   everyone who runs, in the order they leave (each a little after the last)
 *   by        who gives the warning, and shakes while they say it
 *   line      the warning's line key ("The land is moving on! Back to the ladder!")
 *   carrying  props or things that go with them (the kettle)
 *   to        which side they leave by (default 'left')
 *   music     the music bed (default 'adventure'; `false` keeps what is playing)
 *   hum       true adds the land's winding hum under the rumble (default false)
 *
 * Returns nothing; everyone is off stage. Whatever comes next (a cut to the
 * ladder, the climb down) is yours.
 *
 *   await landMovesOn(k, { friends: [mf, silky, pan], by: mf, line: 'moving', carrying: [kettle] });
 */
export async function landMovesOn<K extends string>(
  k: Kit<K>,
  o: { friends: HTMLElement[]; by?: HTMLElement; line?: K; carrying?: HTMLElement[]; to?: Side; music?: Mood | false; hum?: boolean },
): Promise<void> {
  if (o.music !== false) k.music(o.music ?? 'adventure');
  k.fx.rumble(2.5);
  if (o.hum) sounds.landTurning(2.5);
  void k.quake(6);
  await k.all(o.line ? k.say(o.line, o.by) : k.wait(1200), o.by ? k.shake(o.by, 5, 2) : k.wait(0));
  k.fx.whizz();
  const side = o.to ?? 'left';
  const last = 0.6 + 0.1 * Math.max(0, o.friends.length - 1);
  await k.all(
    ...o.friends.map((el, i) => k.exit(el, side, 0.6 + 0.1 * i)),
    ...(o.carrying ?? []).map((el) => k.exit(el, side, last)),
  );
}

// ------------------------------------------------------------- slipperySlip

/** The actors `slipperySlip.set` makes. */
export interface SlideActors {
  /** The riders, in the order you listed them: small, hidden, waiting at the top of the slide. */
  riders: HTMLElement[];
}

/** One point on the slippery-slip as it spirals round the trunk in the `tree` backdrop (the same curve places.ts draws). `front` is above 0 when the chute is on this side of the trunk. */
function slideAt(y: number): { x: number; y: number; front: number } {
  const t = Math.min(1, Math.max(0, (y - 180) / (760 - 180)));
  const cx = 596 + t * 4;
  const hw = 38 + t * t * 120 + t * 20;
  const th = (2 * Math.PI * (y - 300)) / 155;
  return { x: cx + (hw + 26) * Math.sin(th), y: y + 16 * Math.cos(th), front: Math.cos(th) };
}

/** Where the riders stand once they have tumbled off the cushions (bottom middle of each, feet on the grass). */
const SLIDE_STANDS: [number, number][] = [[250, 700], [130, 690], [370, 690]];

/**
 * Whizzing down the slippery-slip: a friend pops out at the top by Moon-Face's
 * door, spirals round and round the trunk (going out of sight behind it and
 * coming round again), shoots out along the roots and lands with a flump in the
 * cushions, then tumbles off and stands up on the grass. Each rider goes in turn.
 *
 *   slipperySlip.set(k, { riders, music? })    the `tree` backdrop and the riders, hidden, in `set`
 *   slipperySlip.play(k, a, { lines?, seconds? })     the ride, one rider after another
 *
 * `set` options: `riders` are `{ id, flip? }` (they are drawn small, about 110 wide, while
 * they slide, and grow to 165 when they stand up on the grass); `music` (default
 * 'adventure'). It returns `{ riders }`.
 *
 * `play` options: `lines` has one `{ start?, landed? }` per rider, in order: `start` is a
 * line key the rider says at the top ("Wheee! Here I go!"), `landed` one they say once they
 * are standing ("Again! Again!"). `seconds` is how long the spiral takes (default 3.2).
 * The riders can't talk while they slide (a talking actor bobs), which is why the lines
 * are before and after. The landing is on the grass, above the caption band.
 *
 *   const a = slipperySlip.set(k, { riders: [{ id: 'tim' }, { id: 'fran' }] });   // in set
 *   await slipperySlip.play(k, a, { lines: [{ start: 'wheee', landed: 'again' }, { landed: 'myGo' }] });
 */
export const slipperySlip = {
  /** The tree at dusk, with each rider tiny and hidden. No motion: legal in `set`. */
  set<K extends string>(k: Kit<K>, o: { riders: { id: string; flip?: boolean }[]; music?: Mood }): SlideActors {
    k.backdrop('tree');
    k.music(o.music ?? 'adventure');
    const riders = o.riders.map((r) => {
      const el = k.character(r.id, { x: 0, y: 0, w: 110, z: 20, ...(r.flip ? { flip: true } : {}) });
      // They grow and shrink about their feet.
      k.set(el, { opacity: 0, transformOrigin: '50% 100%' });
      return el;
    });
    return { riders };
  },

  /** Each rider in turn: a pop at the top, the spiral, the flump, and standing up. */
  async play<K extends string>(k: Kit<K>, a: SlideActors, o: { lines?: { start?: K; landed?: K }[]; seconds?: number } = {}): Promise<void> {
    const startY = 270;
    const endY = 690;
    const seconds = o.seconds ?? 3.2;
    for (let i = 0; i < a.riders.length; i++) {
      const el = a.riders[i];
      const lines = o.lines?.[i] ?? {};
      // The rider's feet sit on the chute, a little above its middle.
      const at = (p: { x: number; y: number }, w = 110): { x: number; y: number } => ({ x: p.x - w / 2, y: p.y - w * 1.13 + 18 });
      const first = slideAt(startY);
      k.set(el, { ...at(first), opacity: 1, rotation: 0, scale: 1 });
      k.fx.pop();
      await k.appear(el, 0.3);
      if (lines.start) await k.say(lines.start, el);
      await k.wait(250);

      // Round and round the trunk: out of sight on the far side, back into view on this one.
      const path = { y: startY };
      k.fx.whizz();
      await k.to(path, seconds, {
        y: endY,
        ease: 'sine.inOut',
        onUpdate: () => {
          const p = slideAt(path.y);
          const near = Math.min(1, Math.max(0, p.front * 5));
          k.set(el, { ...at(p), opacity: near, rotation: p.front > 0 ? 8 : 0 });
        },
      });

      // Out along the roots to the cushions at the bottom.
      k.set(el, { rotation: 0 });
      const run = { t: 0 };
      await k.to(run, 0.55, {
        t: 1,
        ease: 'power1.out',
        onUpdate: () => {
          const x = 526 + (362 - 526) * run.t;
          const y = 708 + (746 - 708) * run.t;
          k.set(el, { ...at({ x, y }), opacity: Math.min(1, run.t * 5) });
        },
      });
      sounds.flump();
      k.sparkle(362, 735, 10, 90);
      await k.pop(el, 1.15);

      // Off the cushions and up on to the grass, a bit bigger (nearer us).
      const [sx, sy] = SLIDE_STANDS[i % SLIDE_STANDS.length];
      k.fx.boing();
      await k.all(k.to(el, 0.6, { x: sx - 55, y: sy - 124, scale: 1.5, ease: 'back.out(1.4)' }));
      if (lines.landed) await k.say(lines.landed, el);
      await k.wait(200);
    }
  },
};

// ----------------------------------------------------------------- teaTime

/** The actors `teaTime.set` makes. */
export interface TeaActors {
  guests: HTMLElement[];
  table: HTMLElement;
  cups: HTMLElement[];
  /** What stands in the middle of the table: the tin of pop biscuits (hidden), or what you chose. */
  centre: HTMLElement;
}

/**
 * Tea and pop biscuits in Moon-Face's round room: the table laid with cups,
 * everyone in their places, the window glowing, dust in the air. It is the
 * cosy first and last scene of an episode.
 *
 *   teaTime.set(k, { guests, centre?, cups?, candle?, music? })     the room, in `set`
 *   teaTime.play(k, a, { host?, offer?, thanks?, by? })              pour, steam, and everyone's biscuit pops
 *
 * `set` options: `guests` are `{ id, x, y?, w?, z?, flip? }` (default y 330, w 240;
 * Moon-Face usually at x 620, y 318, w 260). The room has room for 3 or 4. `centre` is a
 * prop for the middle of the table, `{ id, x, y, w? }`: the default is the tin of pop biscuits,
 * hidden so that it can arrive with `k.appear(a.centre)`; one you choose (`{ id: 'kettle', x: 410,
 * y: 446, w: 150 }`) is on the table from the start. `cups` are the cups' top-left corners (default
 * two, at [352, 508] and [540, 508]). `candle` true adds a warm, breathing light over the table.
 * `music` (default 'cosy'). `tableName` seeds the table's torn edges ('<cartoon-id>-table'). It returns
 * `{ guests, table, cups, centre }`.
 *
 * `play` options: `host` says `offer` ("Who would like a cup of tea?"), tea pours and steam
 * curls from the cups, then every guest's pop biscuit pops in turn with a sparkle and a little
 * hop, each note higher than the last. `thanks` is a line key `by` says at the end.
 *
 *   const a = teaTime.set(k, { guests: [{ id: 'moonface', x: 620, y: 318, w: 260 }, { id: 'silky', x: 880, y: 220, w: 210, z: 11 }] });   // in set
 *   await teaTime.play(k, a, { host: a.guests[0], offer: 'cupOfTea' });
 */
export const teaTime = {
  /** Moon-Face's round room laid for tea. No motion: legal in `set`. */
  set<K extends string>(
    k: Kit<K>,
    o: { guests: Placed[]; centre?: { id: string; x: number; y: number; w?: number }; cups?: [number, number][]; candle?: boolean; music?: Mood; tableName?: string },
  ): TeaActors {
    k.backdrop('moon-room');
    k.music(o.music ?? 'cosy');
    k.light(590, 236, 200, { color: '#c9d4ff', strength: 0.18 });
    if (o.candle) k.light(470, 520, 170, { strength: 0.3, flicker: true });
    k.ambient('dust', { count: 14, area: [200, 120, 800, 420] });
    const table = k.add(teaTable(o.tableName), { x: 330, y: 545, w: 300, z: 12 });
    const cups = (o.cups ?? [[352, 508], [540, 508]]).map(([x, y]) => k.prop('teacup', { x, y, w: 74, z: 13 }));
    const c = o.centre ?? { id: 'biscuit-tin', x: 430, y: 466, w: 110 };
    const centre = k.prop(c.id, { x: c.x, y: c.y, z: 13, ...(c.w ? { w: c.w } : {}) });
    const guests = placeAll(k, o.guests, { y: 330, w: 240 });
    // The tin is not there at first: it arrives (k.appear). Anything you choose is on the table from the start.
    if (!o.centre) k.set(centre, { opacity: 0 });
    return { guests, table, cups, centre };
  },

  /** The offer, the pour, the steam, and a pop biscuit for everyone. */
  async play<K extends string>(k: Kit<K>, a: TeaActors, o: { host?: HTMLElement; offer?: K; thanks?: K; by?: HTMLElement } = {}): Promise<void> {
    if (o.offer) await k.say(o.offer, o.host);
    commonSounds.pour();
    for (const cup of a.cups) {
      const [x, y] = centreOf(cup);
      k.puff(x, y - 40, 70, '#ffffff');
      await k.wait(250);
    }
    await k.wait(300);
    for (let i = 0; i < a.guests.length; i++) {
      const [x, y] = centreOf(a.guests[i]);
      sounds.popBiscuit(i);
      k.sparkle(x, y - 90, 8, 70);
      await k.hop(a.guests[i], 20, 1);
    }
    if (o.thanks) await k.say(o.thanks, o.by);
  },
};

// --------------------------------------------------------- trapdoorArrival

/**
 * Clambering up through the trapdoor into Moon-Face's round room (the dark
 * hatch at the left of the `moon-room` backdrop; everyone who climbs the
 * ladder comes in this way). Each step has its own sound: the Saucepan Man
 * clanks and rattles, everyone else scrambles up the rungs. The last step
 * ends in a little pop.
 *
 *   trapdoorArrival.set(k, actor)         hides them, in `set`
 *   trapdoorArrival.play(k, actor, { rise?, steps? })    up they come
 *
 * Place the actor where they should end up standing. `rise` is how far below that
 * they start, in stage points (default 330, so their head is just under the floor);
 * `steps` is how many rungs (default 3).
 *
 *   trapdoorArrival.set(k, pan);                     // in set
 *   await trapdoorArrival.play(k, pan);              // in play: clank, clank, CLANK
 */
export const trapdoorArrival = {
  /** Hides the actor until they climb in. */
  set<K extends string>(k: Kit<K>, el: HTMLElement): HTMLElement {
    k.set(el, { opacity: 0 });
    return el;
  },

  /** Up through the hatch in a few steps, with a sound on each. */
  async play<K extends string>(k: Kit<K>, el: HTMLElement, o: { rise?: number; steps?: number } = {}): Promise<void> {
    const rise = o.rise ?? 330;
    const steps = o.steps ?? 3;
    const pan = el.dataset.who === 'saucepan';
    k.set(el, { y: rise, opacity: 1 });
    for (let i = 0; i < steps; i++) {
      if (pan) sounds.clank(2, 0.12);
      else k.fx.patter(2, 0.12);
      await k.to(el, 0.38, { y: rise - ((i + 1) * rise) / steps, ease: 'power1.out' });
      if (pan) void moves.rattle(k, el);
    }
    if (pan) sounds.clank(3, 0.09);
    else k.fx.pop();
    await k.pop(el, 1.05);
  },
};

// ---------------------------------------------------------------- snapLoom

/** Where Dame Snap's face is on the stage (for the camera to push in on), from the box she stands in. */
function faceOf(snap: HTMLElement): [number, number] {
  const left = parseFloat(snap.style.left) || 0;
  const top = parseFloat(snap.style.top) || 0;
  const w = parseFloat(snap.style.width) || 380;
  const h = parseFloat(snap.style.height) || w * 1.13;
  return [left + 0.37 * w, top + 0.4 * h];
}

/**
 * Dame Snap looms in: the scary beat, done the safe way (docs/STYLE.md).
 * Sound first (clack… clack… CLACK, the heels getting louder), then silence
 * and her, slowly, in the loom pose; the camera pushes in for a line or two
 * and her ruler SMACKS the desk; then it cuts back to the heroes, wide, with
 * a brave line. She never touches anyone.
 *
 *   snapLoom.set(k, { x, y, w?, flip? })           her, hidden, in the loom pose, in `set`
 *   snapLoom.approach(k, { line?, trembling? })      the clacks, getting louder
 *   snapLoom.loom(k, snap, { lines, frighten?, focus?, smack? })    she appears and speaks
 *   snapLoom.cutBack(k, { line?, by?, before? })     wide shot, and a hero speaks
 *
 * `set` options: where she stands as `{ x, y, w?, flip? }` (default w 380, flipped to face left, z 9;
 * x 770, y 225 suits the `snap-school` yard). She is returned hidden and a little low.
 *
 * `approach` options: `line` is a narrator line key said while the heels clack ("Then,
 * from inside the school… clack. Clack. CLACK."); `trembling` are the heroes who shiver at
 * each clack. Do your own `k.silence()` first, and anything else that belongs to the place
 * (a lit window going dark) before this.
 *
 * `loom` options: `lines` is one or two line keys she says (more would hold the camera in
 * too long); `frighten` are the heroes who jump as she appears; `focus` is where the camera
 * pushes in, [x, y] (default her face); `smack` (default true) brings her ruler down on the
 * desk after her first line, and `onSmack` runs the moment it lands (make a kettle jump
 * there). It starts the 'spooky' music and rumbles.
 *
 * `cutBack` options: after the camera has come back to the wide shot, `before` runs first (a
 * hero cups their ear), then `line` is said by `by`. Heroes are never helpless for long.
 *
 *   const snap = snapLoom.set(k, { x: 770, y: 225 });                                   // in set
 *   k.silence();                                                                         // in play
 *   await snapLoom.approach(k, { line: 'clack', trembling: [pan] });
 *   await snapLoom.loom(k, snap, { lines: ['who', 'whistled'], frighten: [mf, silky] });
 *   await snapLoom.cutBack(k, { line: 'whiskers', by: pan });
 */
export const snapLoom = {
  /** Dame Snap, hidden and looming, standing where you say. No motion: legal in `set`. */
  set<K extends string>(k: Kit<K>, o: { x: number; y: number; w?: number; flip?: boolean }): HTMLElement {
    const snap = k.character('dameSnap', { x: o.x, y: o.y, w: o.w ?? 380, z: 9, flip: o.flip ?? true, pose: 'loom' });
    k.set(snap, { opacity: 0, y: 70 });
    return snap;
  },

  /** The heels, clacking nearer and louder, the narrator's line over them, the heroes shivering at each one. */
  async approach<K extends string>(k: Kit<K>, o: { line?: K; trembling?: HTMLElement[]; loudness?: number[] } = {}): Promise<void> {
    const said = o.line ? k.say(o.line) : Promise.resolve();
    await k.wait(1100);
    for (const loud of o.loudness ?? [0.45, 0.75, 1]) {
      sounds.heels(1, 0.3, loud);
      for (const el of o.trembling ?? []) void k.shake(el, 3, 1);
      await k.wait(620);
    }
    await said;
  },

  /** She rises into view with a rumble, the camera pushes in, she speaks (and smacks her ruler on the desk). */
  async loom<K extends string>(
    k: Kit<K>,
    snap: HTMLElement,
    o: { lines: [K] | [K, K]; frighten?: HTMLElement[]; focus?: [number, number]; smack?: boolean; onSmack?: () => void },
  ): Promise<void> {
    k.music('spooky');
    k.fx.rumble(1.2);
    await k.all(k.to(snap, 1.3, { opacity: 1, y: 0, ease: 'power2.out' }), ...(o.frighten ?? []).map((el) => k.shake(el, 5, 2)));
    const [fx, fy] = o.focus ?? faceOf(snap);
    void k.camera({ zoom: 1.3, x: fx, y: fy }, 1);
    // The loom pose has no talking mouth: she speaks in her ordinary one.
    k.pose(snap, 'default');
    await k.say(o.lines[0], snap);
    if (o.smack !== false) {
      // The ruler comes down on the desk: SMACK. (On the desk, never on a person.)
      await moves.smackRuler(k, snap, o.onSmack);
    }
    if (o.lines[1]) await k.say(o.lines[1], snap);
  },

  /** Back to the heroes: the camera comes back to the wide shot and one of them speaks. */
  async cutBack<K extends string>(k: Kit<K>, o: { line?: K; by?: HTMLElement; before?: () => Promise<unknown> } = {}): Promise<void> {
    await k.camera({}, 0.8);
    if (o.before) await o.before();
    if (o.line) await k.say(o.line, o.by);
  },
};

// -------------------------------------------------------------- snapDefeat

/**
 * Dame Snap's funny defeat: she stomps and stomps in a rage until her own
 * ruler snaps in her fists, she shouts one last cross line, and stomps off
 * in a huff, slamming a door somewhere out of sight. It is her temper that
 * beats her; nobody is hurt, and nobody is near her ruler but her.
 *
 * Options:
 *   line     a line key she says holding the two halves ("My RULER! Oh, BOTHER and BOTHER!")
 *   focus    where the camera pushes in for it, [x, y] (default near her middle)
 *   puffAt   where the puff of dust bursts when the ruler goes, [x, y] (default by her hands)
 *   leave    the side she stomps off by (default 'right')
 *
 * Returns after the slam. The cheer and the rest (music 'triumph', a sparkle,
 * someone saying "She's gone!") are yours. Start anything that should happen
 * during the stomping (a kettle whistling) with `void` before this.
 *
 *   await snapDefeat(k, snap, { line: 'ruler' });
 *   k.music('triumph');
 */
export async function snapDefeat<K extends string>(
  k: Kit<K>,
  snap: HTMLElement,
  o: { line?: K; focus?: [number, number]; puffAt?: [number, number]; leave?: Side } = {},
): Promise<void> {
  const left = parseFloat(snap.style.left) || 0;
  const top = parseFloat(snap.style.top) || 0;
  const w = parseFloat(snap.style.width) || 380;
  const h = parseFloat(snap.style.height) || w * 1.13;
  const [fx, fy] = o.focus ?? [left + 0.37 * w, top + 0.45 * h];
  const [px, py] = o.puffAt ?? [left + 0.42 * w, top + 0.45 * h];
  // Stomp, stomp, stomp: she gets crosser and crosser.
  k.pose(snap, 'stomp');
  k.fx.stomp(3, 0.35);
  void k.quake(6);
  await k.to(snap, 0.18, { y: -16, yoyo: true, repeat: 5, ease: 'power1.inOut' });
  // SNAP: her own ruler goes in her own two fists.
  sounds.snapRuler();
  k.pose(snap, 'defeated');
  k.puff(px, py, 160, C.stoneLight);
  await k.camera({ zoom: 1.25, x: fx, y: fy }, 0.7);
  if (o.line) await k.say(o.line, snap);
  await k.camera({}, 0.7);
  // Off she stomps, in a huff. A door slams somewhere inside.
  sounds.heels(6, 0.26);
  await k.exit(snap, o.leave ?? 'right', 1.6);
  await k.wait(200);
  commonSounds.slam();
  void k.quake(4);
}
