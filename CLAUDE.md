# Cartoons: notes for agents

Torn-paper puppet cartoons for one 6-year-old (autistic, possibly ADHD) on
an iPad in landscape. Each cartoon is an episode of 2–6 minutes in a few
scenes, set in the Faraway Tree, at Hogwarts, at Bear Cottage (the teddy
bear stories) or with the Wishing-Chair, and the heroes do every deed
themselves. Claude writes every cartoon from the skills in
`.claude/skills/`. To make one, follow **`new-cartoon`**. The finished
episodes in `src/cartoons/` are the standard to meet. (The engine and the
first worlds came from two games for the same child,
[Up the Faraway Tree](https://github.com/charlie-beard/maths-game) and
[Wizard Words](https://github.com/charlie-beard/spelling-game); there is
no need to read them.)

## Read what the task needs

| Task | Read |
|---|---|
| A new episode | the `new-cartoon` skill: it says what to read, and when |
| A review | the `review-cartoon` skill and docs/STYLE.md |
| New art in a world | the `new-character` or `new-backdrop` skill: it says what to read |
| Voices | the `voice-cartoon` skill and scripts/voice/README.md |
| The engine, the tools, the tests | the code you touch, and the doc for it |

| Doc | What's in it |
|---|---|
| [docs/STYLE.md](docs/STYLE.md) | The house style: look, motion, sound, voice, what's scary and what's cruel |
| [docs/WRITING.md](docs/WRITING.md) | How an episode is shaped: beats, lines, deeds, pacing, the ledger |
| [docs/KIT.md](docs/KIT.md) | The kit's whole API, with examples (a reference: read the parts you need) |
| [docs/WORLDS.md](docs/WORLDS.md) | How a world is set out; its moves and set pieces |
| [docs/ROADMAP.md](docs/ROADMAP.md) | What's done, what's next, open questions |

Tokens are the budget, so spend them where they buy quality. Learn a
world from `npm run catalogue`, never from `src/worlds/*/index.ts`
(50–120 KB). Look at the sheets `shots` makes, not single frames. Check
with `npm run verify` (a short report), not the steps one by one. Run
anything long in the background and carry on: you're told when it ends.

## Commands

```bash
npm install
npm run dev            # http://localhost:5173   ?cartoon=<id>&scene=<n> (from 0)   ?scene=corner   /lab.html
npm run new -- <id> <world>   # start a cartoon: src/cartoons/<id>/ from the templates
npm run check -- <id>  # one cartoon against the house rules (lines, ids, set(), length, deeds, ledger)
npm run check -- --ledger <world>   # what the world's episodes were about: read before planning
npm run catalogue -- <world> --brief   # a world in text: who, where, props, sounds, moves, set pieces
npm run catalogue -- <world> --id <id> # one entry in full   (sections: about, pieces, moves, drawing …)
npm run shots -- <id> --fast [--scene n]   # frames + sheets on a fake clock, ~1 min: for iterating
npm run shots -- <id> --openings   # each scene's opening set, one sheet, ~10 s: after moving people
npm run shots -- <id> --strict   # real time, 3–6 min: the final pacing check
npm run lab -- <world> [chars|poses|backdrops|props] [--p id,id] [--talk]   # the art as PNGs, with ids
npm run lab -- <world> --backdrop <id> [--with a,b]   # one backdrop at stage size, the cast standing on it
npm run verify -- <id> # typecheck + unit tests + check + e2e for <id> and the screens, ~1 min
npm run verify         # the same for everything (after a change to the kit, the player or a world)
npm run build
```

`npm run verify -- <id>` must pass before a PR (or `npm run verify` after
a change to the kit, the player or a world). CI on a PR runs only the
quick steps; **the e2e tests are yours to run locally**, and a local pass
is enough. **Look at the screenshots** of every scene you make or change:
read `sheet.png` (the episode at a glance), `openings.png` (each scene's
opening set) and `flags.png` (what `shots` flagged, with the actors
boxed), and fix or justify every flag. Iterate with `--fast`; the last
run before a PR is in real time.

**When a piece of work is done, always open a PR and merge it** (once
the checks above pass and CI is green); don't stop at a pushed branch.

## Rules that never bend

- **One fixed stage, 1180 × 820, landscape only.** Place everything with
  stage coordinates (`k.character(id, { x, y, w })`, `{ cx, feet, w }`).
  No responsive layouts. **No captions or subtitles**: the voices carry
  the story. Keep the bottom band (y 690–800) calm all the same.
- **No interaction.** A cartoon plays start to end like a TV episode:
  nothing to tap or drag, no listeners (`npm run check` fails them). The
  heroes do every deed themselves, with `k.flourish` / `k.carry` marking
  it. No timers on screen, no buzzers, no "wrong".
- **Never refer to the child.** No name, no `{placeholder}` in a line, no
  lines spoken to the viewer. Describe the audience generically ("the
  child", "a 6-year-old"), here and in code comments.
- **No flashing.** Washes of light fade in and out (`k.glow`), never
  strobe. Keep the background calm while a deed is done (the kit holds
  idle loops still for you).
- **Scary is fine, cruel isn't.** Villains loom, shriek, stomp, hiss and
  snap rulers. Nobody is hit, slapped or hurt, nobody is lost for good,
  and no parent is in real danger. Every scary beat cuts back to the
  heroes before it's too much, and every episode ends safe and warm
  (docs/STYLE.md).
- **Original art only:** torn paper via `src/art/paper.ts`. No film
  stills, no logos, no actor likenesses, no film fonts. The one exception
  is the `bears` world, drawn in the watercolour-and-ink look of the book
  it comes from (`src/art/watercolour.ts`; docs/STYLE.md, "The bears"):
  still our own drawings, never traced or scanned.
- **UK English** in everything the child hears or reads ("Mum", "colour",
  "biscuit"). Short sentences: a 6-year-old is listening. `npm run check`
  catches the common slips.
- **Andika** for all text.

## Code conventions

- TypeScript, strict, no framework. GSAP for motion, through the kit
  (`k.to`, `k.enter` …), moving smoothly. No `steps()` eases and no boil
  frames: held frames read as flicker on the iPad.
- `src/core/` is **pure** (no DOM, no audio) and unit-tested.
- A cartoon is a folder, `src/cartoons/<id>/`: `meta.ts` (title, world,
  summary, thumb, the day it was added, and the `ledger` of what it's
  about) and `cartoon.ts` (`defineCartoon`, which spreads the meta), plus
  any files of its own art or sounds. Nothing else lists cartoons: a new
  folder is on the shelf (`SHOWING` in `src/cartoons/shelf.ts` picks what
  the child sees). Every line is listed up front in `lines`, so the voice
  export can find it.
- Characters, backdrops and props live in **worlds** (`src/worlds/<id>/`)
  and are used by id. Art for one cartoon only is drawn in its folder;
  anything a second cartoon could use goes into the world.
- The world catalogues (`src/worlds/*/index.ts`) get **append-only**
  edits, to keep parallel PRs mergeable. Generated files (the voice
  export, the audio manifest) are never committed.
- Comments explain *why* and describe the design in plain words, as the
  existing files do. Every cartoon's `cartoon.ts` opens with a comment
  telling the whole story, scene by scene.

## Map of the code

| Where | What |
|---|---|
| `src/cartoons/` | One folder per cartoon (`meta.ts`, `cartoon.ts`); `index.ts` finds them, `shelf.ts` says what's showing |
| `src/kit/` | `kit.ts` (the stage and its tools), `cartoon.ts` (`defineCartoon`, scenes) |
| `src/worlds/` | `types.ts`, `index.ts` (lookups), and one folder per world: `common`, `faraway`, `hogwarts`, `bears`, `wishing` |
| `src/core/` | Pure: lines and their checks (`cartoon.ts`) and voice ids (`phrases.ts`) |
| `src/scenes/` | The library (shelf), the player, the grown-ups' corner |
| `src/art/` | The paper engine, the watercolour engine (bears), palette, grain, UI pieces |
| `src/audio/` | Web Audio engine, UI sounds (`sfx`), story sounds and music beds (`synth`), voice |
| `src/ui/` | Stage helpers, scenes and the director, pause, rotate, the gear |
| `scripts/` | `shots` (frames, sheets, pacing), `check`, `catalogue`, `lab`, `verify`, the voice pipeline |
| `templates/` | A beat sheet and a cartoon skeleton to copy |
| `.claude/skills/` | new-cartoon, new-character, new-backdrop, review-cartoon, voice-cartoon |
