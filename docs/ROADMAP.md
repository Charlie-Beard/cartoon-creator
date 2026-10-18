# Roadmap

## Session 1: the scaffold (done)

- The engine, ported from Up the Faraway Tree: paper art, audio, voice
  (with the iPad's fallback), the fixed stage, pause, rotate, the gear.
- The kit, generalised: worlds by id, episodes of scenes, `tapToHelp`.
- Worlds: `common`, `faraway` (ported from maths-game), `hogwarts`, `bears` (Teddy Bear, in watercolour and ink)
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
