# Roadmap

## Session 1: the scaffold (done)

- The engine, ported from Up the Faraway Tree: paper art, audio, voice
  (with the iPad's fallback), the fixed stage, pause, rotate, the gear.
- The kit, generalised: worlds by id, episodes of scenes, `tapToHelp`.
- Worlds: `common`, `faraway` (ported from maths-game), `hogwarts`, `bears` (Teddy Bear, in watercolour and ink), `wishing` (the Wishing-Chair)
  (ported from spelling-game).
- Screens: the library (shelf), the player, the grown-ups' corner.
- Tooling: `check`, `shots` (frames, contact sheet, pacing), the voice
  pipeline with a cast file, unit and e2e tests, CI and Pages deploy.
- Docs and skills: CLAUDE.md, STYLE, WRITING, KIT, WORLDS; new-cartoon,
  new-character, new-backdrop, review-cartoon, voice-cartoon.
- A demo episode made with the new-cartoon skill, to prove the whole
  path end to end.

## Making cartoons (from now on)

One Claude Code session per episode: `/new-cartoon <idea>`. Several can
run at once, each on its own branch: cartoons are separate files, and
the shelf and world catalogues are append-only, so PRs merge cleanly.
New reusable art lands in the world as part of the episode that first
needs it.

## The Teddy Bear Treasury

Every `bears` episode comes from one book, the *Teddy Bear Treasury*
(Brown Watson, 1994). Its contents page, in book order, with what's been
made of each. The eight stories run 6–8 pages each; the seven one-page
pieces between them are probably rhymes or short verses, and haven't been
looked at yet. Tick one off here in the PR that makes it.

| Page | In the book | Cartoon |
|---|---|---|
| 3 | Teddy's Birthday Party | ✅ `teddys-party` |
| 10 | All Year Round (one page) | not yet |
| 11 | Grumpy Bertie Bear | ✅ `grumpy-bertie` |
| 18 | Teddy Bear's Storytime (one page) | not yet |
| 19 | Teddy's Seaside Adventure | ✅ `seaside-adventure` |
| 25 | The Three Bears | ✅ `three-bears` |
| 32 | Teddy's Favourites (one page) | not yet |
| 33 | Teddy Goes Flying | ✅ `teddy-flying` |
| 40 | Mummy Bear (a poem) | not yet |
| 41 | Uncle Sailor Bill | ✅ `uncle-sailor-bill` |
| 49 | Teddy Bear's Partytime (a matching puzzle) | not yet |
| 50 | Round and Round the Garden (one page) | not yet |
| 51 | Teddy Bear's Surprise | ✅ `teddy-surprise` |
| 58 | My Teddy Bear (a poem) | not yet |
| 59 | The Doll's House | ✅ `dolls-house` |

## More turns for him ✅

Every episode now has at least 5 of his turns, taps and drags
(`k.dragToHelp`), and runs 2–6 minutes. The episodes made before the
rule were all brought up to it, one PR each; `npm run check` (and
`npm test`) now fail any episode with fewer than 5. The new lines are
unrecorded until a grown-up runs `voice-cartoon`.

## Later, when wanted

- **Voices:** record the cartoons with ElevenLabs (`voice-cartoon`),
  once the cast is chosen.
- **More worlds:** each new world needs three characters and two
  backdrops before its first episode (docs/WORLDS.md).
- **Series:** recurring arcs across episodes (a "Previously…" card, an
  order on the shelf). The shelf order is already the list order.
- **Other paper styles** (felt, crayon): art is reached only through
  `src/art/paper.ts` primitives and the worlds, so a second style is a
  second set of primitives plus world art that uses it.
- **In-app requests:** a grown-up types an idea and the Claude API
  writes a cartoon from the existing worlds. This would need a data
  (JSON) form of a script, not TypeScript, and a key behind a Worker.
  Not planned: Claude Code writing real scripts gives far better
  episodes.

## Open questions for the parent

1. **Voices:** which ElevenLabs voices for characters new to the
   cartoons (the cast check lists them), and when to start recording.
2. **Name and icon:** "Cartoons" is a working title.
3. **Pages:** turn on GitHub Pages for this repo (Settings → Pages →
   GitHub Actions) so the iPad can open it.
