---
name: new-backdrop
description: Draw a new torn-paper place (a full-stage 1180 × 820 backdrop) or a reusable prop, and add it to a world so any cartoon can use it by id. Use when a cartoon needs a setting or object that isn't in src/worlds yet, or when asked to add or redraw one.
---

# New backdrop (or prop)

Read `docs/WORLDS.md` and `docs/STYLE.md` (Look, Composition) first.

## 1. Decide what it's for

- **Where is the floor?** Most scenes stand actors on a ground line near
  y 640. A room, a branch, a path: say where people stand.
- **How many actors** must fit, and where (left, middle, right)?
- **Where's the light**, and the mood (cosy, spooky, magic)?
- Is it truly reusable (another episode could go there)? If not, draw
  it in the cartoon file instead (docs/KIT.md, "Drawing one-off art").

## 2. Draw from what exists

Find the closest existing backdrop in the world (or `common`) and reuse
its approach: sky and far layers first, then the mid ground, then the
floor; each layer a few big torn `piece()`s, with detail (windows,
leaves, stones, books) as small pieces on top. The games' scenery
(`charlie-beard/maths-game` `src/art/scenery.ts`, `src/art/lands/`;
`charlie-beard/spelling-game` `src/art/scenery.ts`) has many more.

The rules:

- `svg({ w: 1180, h: 820, name: '<world>-<id>' }, [...])`: exactly that
  size (the unit test checks the viewBox).
- A full-bleed base layer (`rect(-20, -20, 1220, 860)`, `edge: 'clean'`)
  so no edge shows when the camera pushes in.
- **Keep the bottom band calm** (y 690–820): captions sit there. Plain
  floor or grass, no detail that matters.
- **Leave the acting space clear:** big shapes at the sides and back,
  open floor in the middle.
- Muted colours, soft shadows; atmosphere (dust, fireflies, lights) is
  added by scripts with `k.ambient` and `k.light`, not baked in.
- Wrap it in `cached(...)` so a scene can draw it again for free.

**Props** are the same, smaller: `svg({ w: 120, h: 120, … })` (or
whatever suits; set `size`), centred, a clear silhouette that reads at
100 px. Give anything that moves a `group({ part, origin })`.

## 3. Add it to the world

Drawing in the world's folder (e.g. `src/worlds/hogwarts/places.ts`),
then append to the world's `index.ts`:

```ts
backdrops: {
  'great-hall': { art: greatHall, about: 'Long tables, floating candles, starry ceiling. Floor y 650; room for 4 at the front.' },
},
props: {
  'kettle': { art: kettle, size: [140, 120], about: 'A round, dented tin kettle with a curly spout.' },
},
```

## 4. Look at it

```bash
npm run lab -- <world> --backdrop <id>     # at stage size, 1180 × 820
npm run lab -- <world> props --p <id>
```

Read the PNGs it prints (`screenshots/lab/`). Then place two or three
characters on it (a scratch cartoon, or the one that needs it, with
`npm run shots -- <id> --fast --scene <n>`) and check they stand on the floor, read clearly against
it, and that the caption band is calm.

## 5. Check

`npm run typecheck && npm test`.
