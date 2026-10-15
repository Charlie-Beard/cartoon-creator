---
name: new-character
description: Draw a new torn-paper character (portrait, poses, talking mouth, blinking lids, swinging arms or wings) and add it to a world so any cartoon can use it by id. Use when a cartoon needs someone who isn't in src/worlds yet, or when asked to add or redraw a character.
---

# New character

A character is a 300 × 340 torn-paper portrait plus notes, in a world's
catalogue. Read `docs/WORLDS.md` and `docs/STYLE.md` (Look) first.

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
- Which world they belong to, and a unique id (check every world's
  `characters` for clashes).

## 2. Draw from what exists

Open the world's drawing files and find the closest existing character.
Reuse its building blocks (the world's `parts.ts` if it has one: heads,
eyes, mouths, hands, clothes), its proportions and its palette, so the
new one belongs. In `src/worlds/faraway/` and `src/worlds/hogwarts/` the
characters were ported from the games; the games' own
`src/art/characters/` folders have more examples.

The rules of the portrait:

- `svg({ w: 300, h: 340, name: '<world>-<id>' }, [...])`, built from
  `piece()` (torn paper), `ink()` (lines), `dot()` (eye highlights),
  `group()` (moving parts).
- The **face inside the box 78 62 144 144** (the caption chip crops to
  it). If it can't be (a tall bird, a wide creature), set `chip` to a
  viewBox that frames the face.
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
npm run dev
# /lab.html?world=<world>&set=chars&p=<id>&size=300
# /lab.html?world=<world>&set=poses
```

Screenshot with Playwright (Chromium at `/opt/pw-browsers/chromium`) and
read the PNG. Check it next to two or three of the world's other
characters: same scale, same style, same line weight. Check the caption
chip: render a scene with them speaking (`npm run shots` on a cartoon
that uses them), or crop the portrait to the chip box yourself. Check
`mouthOpen` and `lids` by setting their opacity to 1 in a test render.

## 5. Check

`npm run typecheck && npm test` (tests/unit/worlds.test.ts checks the
SVG, the parts listed, the notes and unique ids).
