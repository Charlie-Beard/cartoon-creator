# Worlds

A world is one cast, its places and its things: everything a cartoon set
there can use by id. Source: [`src/worlds/`](../src/worlds/).

| World | Id | From |
|---|---|---|
| Anywhere (skies, a meadow, night, parchment, a few props; no characters) | `common` | made here |
| The Faraway Tree | `faraway` | [Up the Faraway Tree](https://github.com/charlie-beard/maths-game) |
| Hogwarts | `hogwarts` | [Wizard Words](https://github.com/charlie-beard/spelling-game) |

See what's in each, drawn: `npm run dev`, then `/lab.html?world=faraway`
(add `&set=chars|poses|backdrops|props`, or `?backdrop=<id>` for one at
stage size). The written notes are in each world's `index.ts`: **read
them before writing a cartoon**.

## Shape

```
src/worlds/<id>/
  index.ts      defineWorld({ id, name, accent, about, characters, backdrops, props })
  *.ts          the drawing code (characters, places, props), split as suits
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

## Adding to a world

- A new character: the `new-character` skill.
- A new place or prop: the `new-backdrop` skill (props are the same
  steps, smaller).
- A new world: copy `src/worlds/common/index.ts` into
  `src/worlds/<id>/`, give it an accent colour and notes, append it to
  `src/worlds/index.ts`, and add a row to the table above. A world needs
  at least three characters and two backdrops before a cartoon is set
  there.
