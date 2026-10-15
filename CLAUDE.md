# Cartoons: notes for agents

Torn-paper puppet cartoons for one 6-year-old (autistic, possibly ADHD) on
an iPad in landscape. Each cartoon is an episode of 2–5 minutes in a few
scenes, set in the Faraway Tree or at Hogwarts, and now and then it's his
turn to tap and help. Claude writes every cartoon from the skills in
`.claude/skills/`. To make one, follow **`new-cartoon`**.

The engine is shared with his two games, which are the reference for
anything not written down here:
[Up the Faraway Tree](https://github.com/charlie-beard/maths-game) (maths)
and [Wizard Words](https://github.com/charlie-beard/spelling-game)
(spelling). Their story scripts (`src/stories/`) are the standard to meet.

Read before changing anything:

| Doc | For |
|---|---|
| [docs/STYLE.md](docs/STYLE.md) | The house style: look, motion, sound, voice, what's scary and what's cruel |
| [docs/WRITING.md](docs/WRITING.md) | How an episode is shaped: beats, scenes, lines, pacing, his turns |
| [docs/KIT.md](docs/KIT.md) | The kit's whole API, with examples |
| [docs/WORLDS.md](docs/WORLDS.md) | How a world is set out, and how to add characters, places and props |
| [scripts/voice/README.md](scripts/voice/README.md) | Recording the voices (ElevenLabs) |
| [docs/ROADMAP.md](docs/ROADMAP.md) | What's done, what's next, open questions |

## Commands

```bash
npm install
npm run dev            # http://localhost:5173   ?cartoon=<id>&scene=<n>   ?scene=corner
                       # /lab.html?world=faraway  every character, pose, backdrop and prop
npm run typecheck
npm test               # Vitest: src/core, worlds, every cartoon's lines and ids
npm run check -- <id>  # one cartoon against the house rules (lines, ids, length, his turns)
npm run shots -- <id>  # screenshots of every scene + a contact sheet + measured pacing
npm run test:e2e       # Playwright at 1180×820 and 1180×760 (in the cloud: PW_CHROMIUM=/opt/pw-browsers/chromium)
npm run build
```

All of typecheck, `npm test`, `npm run check` and `npm run test:e2e` must
pass before a PR. **Look at the screenshots** of every scene you make or
change (`npm run shots`), at 1180 × 820. Reading the PNGs is part of the
job, not optional.

## Rules that never bend

- **One fixed stage, 1180 × 820, landscape only.** Place everything with
  stage coordinates (`k.character(id, { x, y, w })`, `place(el, x, y, w, h)`).
  No responsive layouts. Captions take the bottom band (y 690–800).
- **Touch only:** tap targets of 72 px or more (his turns are 120 px or
  more), no hover.
- **No failing:** a turn he doesn't take is taken for him, kindly. No
  timers on screen, no buzzers, no "wrong".
- **No flashing.** Washes of light fade in and out (`k.glow`), never
  strobe. Nothing in the background moves while it's his turn (the kit
  holds idle loops still for you).
- **Scary is fine, cruel isn't.** Villains (Dame Snap, Voldemort) loom,
  shriek, stomp, hiss and snap rulers. Nobody is hit, slapped or hurt.
  Nobody is lost for good, and no parent is in real danger. Every scary
  beat cuts back to the heroes before it's too much, and every episode
  ends safe and warm. See docs/STYLE.md.
- **Original art only:** torn paper via `src/art/paper.ts`. No film
  stills, no logos, no actor likenesses, no film fonts.
- **UK English** in everything he hears or reads ("Mum", "colour",
  "biscuit"). Short sentences: a 6-year-old is listening. `npm run check`
  catches the common slips.
- **Andika** for all text.

## Code conventions

- TypeScript, strict, no framework. GSAP for motion, through the kit
  (`k.to`, `k.enter` …), moving smoothly. No `steps()` eases and no boil
  frames: held frames read as flicker on the iPad.
- `src/core/` is **pure** (no DOM, no audio) and unit-tested.
- A cartoon is one file, `src/cartoons/<id>.ts`, made with
  `defineCartoon` (see `templates/cartoon.ts`). Every line is listed up
  front in `lines`, so the voice export can find it. `{name}` is the
  child's name.
- Characters, backdrops and props live in **worlds** (`src/worlds/<id>/`)
  and are used by id. Art used by one cartoon only can be drawn in the
  cartoon's own file; anything a second cartoon could use goes into the
  world (see the new-character and new-backdrop skills).
- Registries (`src/cartoons/index.ts`, `src/worlds/index.ts`) get
  **append-only** edits, to keep parallel PRs mergeable.
- Comments explain *why* and describe the design in plain words, as the
  existing files do. Every cartoon file opens with a comment telling the
  whole story, scene by scene.
- Search for `SCAFFOLD` to find stand-ins waiting for a workstream.

## Map of the code

| Where | What |
|---|---|
| `src/cartoons/` | One file per cartoon, and `index.ts`, the shelf |
| `src/kit/` | `kit.ts` (the stage and its tools), `cartoon.ts` (`defineCartoon`, scenes) |
| `src/worlds/` | `types.ts`, `index.ts` (lookups), and one folder per world: `common`, `faraway`, `hogwarts` |
| `src/core/` | Pure: lines and their checks (`cartoon.ts`), `{name}` and voice ids (`phrases.ts`) |
| `src/scenes/` | The library (shelf), the player, the grown-ups' corner |
| `src/art/` | The paper engine, palette, grain, UI pieces (seals, parchment, stars) |
| `src/audio/` | Web Audio engine, UI sounds (`sfx`), story sounds and music beds (`synth`), voice |
| `src/ui/` | Stage helpers, scenes and the director, pause, rotate, the gear |
| `scripts/` | Screenshots and pacing, the cartoon checker, the voice pipeline |
| `templates/` | A beat sheet and a cartoon skeleton to copy |
| `.claude/skills/` | new-cartoon, new-character, new-backdrop, review-cartoon, voice-cartoon |
