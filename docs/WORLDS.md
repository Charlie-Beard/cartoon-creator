# Worlds

A world is one cast, its places and its things: everything a cartoon set
there can use by id. Source: [`src/worlds/`](../src/worlds/).

| World | Id | From |
|---|---|---|
| Anywhere (skies, a meadow, night, parchment, a few props; no characters) | `common` | made here |
| The Faraway Tree | `faraway` | [Up the Faraway Tree](https://github.com/charlie-beard/maths-game) |
| Hogwarts | `hogwarts` | [Wizard Words](https://github.com/charlie-beard/spelling-game) |

See what's in each, drawn: `npm run lab -- faraway` saves a sheet of
every character, pose, backdrop and prop, each with its id, to
`screenshots/lab/` (`npm run lab -- faraway props` for one set,
`--backdrop <id>` for one at stage size). The same pages are live at
`/lab.html?world=faraway` with `npm run dev`.

Read a world in text with `npm run catalogue -- faraway`: every character
(poses, parts, who they are, how they sound), backdrop (with its ground
line), prop (with its size), and the world's sounds and moves with their
signatures and docs, plus `common` and the kit's `k.fx`/`k.sfx`. It is
built from `index.ts` and `moves.ts`, at about half their size, so
**read it, not those files, before writing a cartoon**.

- `--brief`: an index (a sentence per note, ~13 KB for faraway). Start here, then
- `--id <id>`: one character, backdrop, prop, sound or move in full.
- `<world> about`: the world's setting, tone and rules. Read it before writing.
- `<world> characters|backdrops|props|moves|kit`: one section; `--no-common` drops common.
- `--list`: the worlds.

## Shape

```
src/worlds/<id>/
  index.ts      defineWorld({ id, name, accent, about, characters, backdrops, props })
  *.ts          the drawing code (characters, places, props), split as suits
  moves.ts      the cast's signature sounds and moves (see "moves.ts" below)
  palette.ts    the world's own colours, if any (never edit src/art/palette.ts for one world)
```

`index.ts` is the catalogue. Each entry has the art function and notes
for the next writer:

```ts
characters: {
  moonface: {
    name: 'Moon-Face',                 // the caption's name tag
    art: moonface,                     // 300 × 340 portrait, face in 78 62 144 144
    poses: { wave: moonfaceWave },     // optional: k.character(id, { pose }) / k.pose(el, 'wave')
    parts: ['mouth', 'mouthOpen', 'lids', 'armR'],   // data-parts a script can move
    about: 'Round, beaming, kind. Lives at the top of the tree …',
    voice: 'Warm, jolly, a little breathless; middle-aged man.',
  },
},
backdrops: {
  'moon-room': { art: moonRoom, about: 'Moon-Face’s round room … ground line y 640, room for 3.' },
},
props: {
  'pop-biscuit': { art: popBiscuit, size: [120, 120], about: 'Silky’s pop biscuit.' },
},
```

## Rules

- **Ids:** character ids are unique across *all* worlds (a cartoon can
  borrow anyone, and the voice cast is keyed by them); backdrop and prop
  ids are looked up in the cartoon's world first, then `common`, then
  the rest. kebab-case or camelCase, matching what's already there.
- **Portraits** are 300 × 340, head and shoulders (or a whole small
  creature), with the face inside the box `78 62 144 144`: the caption's
  name chip crops to it (`chip` overrides the crop).
- **Talking and blinking:** give a character `mouth` and `mouthOpen`
  parts (mouthOpen hidden with `opacity="0"`) and the kit animates them
  in `say`; `lids` (hidden) for `k.blink`. List every part in `parts`
  (the unit test checks they exist).
- **Joints:** a part that swings (an arm, a wing) is a `group({ part,
  origin: [x, y] })`, the origin at the joint. Scripts call `k.pivot`.
- **Backdrops** are exactly `viewBox="0 0 1180 820"`. Keep the bottom
  band (y 690–820) calm: captions sit there. Say in `about` where the
  ground line is and how many actors fit.
- **Notes are for writers:** `about` says who someone is, how they talk,
  their running jokes, and what they would never do. `voice` says how
  they sound, for picking an ElevenLabs voice. Short and true to the
  books and films.
- **Append-only:** add entries; don't rename or remove ids a cartoon
  uses (`npm test` loads every cartoon).
- Original art only (docs/STYLE.md).

## moves.ts

Each world has a `moves.ts` of its cast's signature sounds and moves, so
authors stop re-inventing them per episode: Dame Snap's heels and ruler,
the Saucepan Man's clank and "Eh?", Silky's wings, Hedwig's wingbeats, a
villain's cloak swish. `common/moves.ts` holds the world-neutral ones (a
door slam, tea pouring, a laugh, a wave). **Check them before writing your
own sound or move**, and **promote anything a second episode would want**
(move it out of the cartoon into the world's `moves.ts`, and import it).

```ts
import { sounds, moves } from '../../worlds/faraway/moves';
import { sounds as anywhere } from '../../worlds/common/moves';

sounds.heelsComing(5);                       // a plain function: makes a sound now
await moves.earCup(k, saucepan, true);       // async: (k, actor, …) animates a part
```

- **`sounds`** is an object of plain functions that make a synthesised
  sound with `tone`, `noiseBurst`, `bell`, `NOTE` and `now()` from
  `src/audio/synth`, as the stories do. They never use `this`, so
  `const { heels } = sounds` works. Soft and short; menace, never a
  fright that hurts the ears.
- **`moves`** is an object of async functions `(k: Kit, el, …)` that
  animate a character with `k.to`, `k.part` and `k.pivot` and return a
  promise (`await` it, or `void` it to run alongside). Use only parts the
  character really has (`parts` in `index.ts`), and do nothing, never
  throw or hang, when a part is missing. Move smoothly, never flash
  (docs/STYLE.md). A villain's moves are theatre: nobody is hit.
- Every function has a one-line doc comment saying what it is and when to
  use it. Import the kit type with `import type { Kit } from '../../kit'`.
- Keep each world's file self-contained; only `common` may be imported
  from another world's `moves.ts`.
- Already in the kit, so reach for these first: `k.fx` and `k.sfx`
  (docs/KIT.md, "Sounds").
- `tests/unit/moves.test.ts` checks that the files exist and export
  functions. Add to the object with append-only edits.

## Adding to a world

- A new character: the `new-character` skill.
- A new place or prop: the `new-backdrop` skill (props are the same
  steps, smaller).
- A new world: copy `src/worlds/common/index.ts` into
  `src/worlds/<id>/`, give it an accent colour and notes, append it to
  `src/worlds/index.ts`, and add a row to the table above. A world needs
  at least three characters and two backdrops before a cartoon is set
  there.
