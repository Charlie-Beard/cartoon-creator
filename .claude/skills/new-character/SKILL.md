---
name: new-character
description: Draw a new torn-paper character (portrait, poses, talking mouth, blinking lids, swinging arms or wings) and add it to a world so any cartoon can use it by id. Use when a cartoon needs someone who isn't in src/worlds yet, or when asked to add or redraw a character.
---

# New character

A character is a 300 × 340 torn-paper portrait plus notes, in a world's
catalogue. Read `docs/WORLDS.md` ("Shape" and "Rules") and `docs/STYLE.md`
("Look"; for the bears, "The bears" too) first. That's all the reading
this needs: not the other docs, not the world's `index.ts`.

If you were briefed by an episode's author, draw only your own file (they
append the `index.ts` entry), and report back the id, the parts, the
poses, the `about` and `voice` notes, and anything they should know when
placing them (a tall hat, a wide body, which way they face).

## 1. Know who they are

Write down, before drawing:

- Who they are in the books or films, and what they look like: the one
  or two things that make them recognisable at a glance (silhouette,
  colours, a hat, a prop). **Original art only**: our paper version,
  never a likeness of an actor.
- How they talk, their running jokes, what they would never do. This
  becomes `about`.
- How they sound (age, accent, energy), for the voice cast. This becomes
  `voice`.
- Which world they belong to, and an id unique across every world
  (`npm test` fails a clash).

## 2. Draw from what exists

`npm run catalogue -- <world> drawing` lists what the world's art is built
from (the paper engine, the world's builders such as `person()`, eyes,
mouths and arms, and the palette's colour names) with their signatures:
read that, not `paper.ts` and `parts.ts`. Then open ONE existing character
file, the closest to the new one (a recent file of 10–15 KB, not the
world's `index.ts`), and reuse its building blocks, proportions and
palette, so the new one belongs.

The rules of the portrait:

- `svg({ w: 300, h: 340, name: '<world>-<id>' }, [...])`, built from
  `piece()` (torn paper), `ink()` (lines), `dot()` (eye highlights),
  `group()` (moving parts).
- The **face inside the box 78 62 144 144**: `k.box(el).face` uses it to
  put hats on heads and the camera on faces. If it can't be (a tall bird,
  a wide creature), set `chip` to a viewBox that frames the face.
- **Talking:** a `group({ part: 'mouth' })` and a
  `group({ part: 'mouthOpen', opacity: 0 })` in the same place.
- **Blinking:** `group({ part: 'lids', opacity: 0 })` over the eyes.
- **Moving parts:** arms, wings, tails, ears as
  `group({ part: 'armR', origin: [x, y] })` with the origin at the joint.
- Flat muted colours from `C` (or the world's `palette.ts`), soft
  shadows (the default), torn edges for cloth and skin, `edge: 'cut'`
  for hard things (metal, wood), `edge: 'clean'` sparingly.

**Poses** (optional): whole alternative drawings, same 300 × 340 box and
same face box, for big changes of body (flying, looming, pointing,
sleeping, defeated). Small changes (a raised arm) are better done with
parts in the script.

## 3. Add it to the world

Put the drawing in the world's folder (its own file if it's big, e.g.
`src/worlds/faraway/<id>.ts`), then append an entry to the world's
`index.ts` `characters`:

```ts
saucepan: {
  name: 'The Saucepan Man',
  art: saucepan,
  poses: { clank: saucepanClank },
  parts: ['mouth', 'mouthOpen', 'lids', 'armL', 'armR'],
  about: 'Covered in pots and pans that clank as he walks. Very deaf: mishears everything, which is funny, never unkind.',
  voice: 'Cheerful, loud, slightly bewildered older man; West Country warmth.',
},
```

Ask the person to choose a voice later (`voice-cartoon` skill); don't
invent ElevenLabs ids.

## 4. Look at it

```bash
npm run lab -- <world> chars --p <id>,<two or three others> --size 300
npm run lab -- <world> poses --p <id>        # just their poses (without --p: every pose in the world)
```

Each prints the PNGs it saved (`screenshots/lab/`): read them. Check it
next to two or three of the world's other characters: same scale, same
style, same line weight. Add `--talk` to see each one again talking and
blinking (`mouthOpen` and `lids` shown, `mouth` hidden), so the mouth and
lids are checked without editing anything.

## 5. Check

`npm run typecheck && npm test` (tests/unit/worlds.test.ts checks the
SVG, the parts listed, the notes and unique ids).
