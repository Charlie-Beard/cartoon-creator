---
name: new-cartoon
description: Make a new cartoon episode from a one-line idea ("/new-cartoon Saucepan Man loses his kettle"). Asks 2–4 quick questions, writes the beat sheet, the script and any new art, checks and screenshots every scene, and opens a PR. Use whenever someone asks for a new cartoon, episode or story in this repo.
---

# New cartoon

From a one-line idea to a finished, checked episode on the shelf. Work
through the steps in order; don't skip the looking (step 7).

**Who does what.** The story is where quality comes from, so the main
session (the strongest model) keeps the parts that need taste, and
hands the rest to cheaper subagents with the matching skill:

| Step | Who |
|---|---|
| 1 Ask, 2 beat sheet, 4 script, 7 the final look | You (main session) |
| 3 New reusable characters, backdrops, props | Sonnet subagent each (`new-character`, `new-backdrop`) |
| 5 Check, 6 shots: running them and fixing what they report mechanically (ids, a line too long, a flagged frame that's plainly off stage) | Sonnet subagent, or you if it's one quick fix |
| 8 Review | A fresh Sonnet subagent (`review-cartoon`): new eyes are the point |
| Summarising long output (a pacing table, a test log) | Haiku, if you need it summarised at all |

Give every subagent the episode id, the files it may touch, and what to
report back; read what it changed before you carry on.

## 0. Read (every time; it's quick)

(Several sessions or agents may share one machine: when you start a dev
server yourself, give it its own port, `npx vite --port 52xx`.)


- `CLAUDE.md`, `docs/STYLE.md`, `docs/WRITING.md`. Skim `docs/KIT.md`.
- The world's notes: `src/worlds/<world>/index.ts` (world `about`, every
  character's `about`, the backdrops and props available).
- One or two finished cartoons in `src/cartoons/` for the standard
  expected (and, for more examples, the games' story scripts:
  `charlie-beard/maths-game` `src/stories/l7c8.ts`, `opening.ts`;
  `charlie-beard/spelling-game` `src/stories/`).

Then `npm run check -- --ledger`: what every episode so far was about.
Steer the idea away from recent villains, main places, turns and jokes,
and tell the person if their idea repeats one.

## 1. Ask (2–4 quick questions, then go)

Use AskUserQuestion once, with up to four questions. Put your
recommended option first, marked "(Recommended)", worked out from the
idea and the world notes. Pick from:

- **World and cast** (if the idea doesn't make it obvious): who's in it.
- **The scary bit:** which villain, or a gentler danger (lost, stuck,
  a storm), or none this time.
- **His turns:** two or three concrete ideas for what he taps.
- **Length:** short (about 2 min, 3 scenes, 25–30 lines), about 3 min
  (4 scenes, 35–40 lines) or long (4–5 min, 5 scenes, 50–60 lines).
- **Ending flavour:** funny, cosy, a party.

If the person said not to ask, or answered everything already, skip
this and use your recommendations.

## 2. Beat sheet

Copy `templates/beat-sheet.md` into your scratchpad and fill it in.
Check it against the table in docs/WRITING.md (shape, one problem, 1–3
turns, `{name}` 3–6 times) and docs/STYLE.md (scary, not cruel; warm
ending). Fix it now: changing a beat sheet is cheap, changing a script
is not. Show the person the beat sheet in a few lines, and carry on
unless they stop you.

## 3. What's needed

List every character, backdrop and prop the beat sheet uses, and look
each up (`src/worlds/*/index.ts`, or `/lab.html?world=<id>` with the dev
server). For each missing one decide:

- **Reusable** (a new character, a place another episode could visit, a
  prop that will come back): add it to the world, following the
  `new-character` or `new-backdrop` skill.
- **One-off** (this episode's special object): draw it in the cartoon's
  own file (docs/KIT.md, "Drawing one-off art").

Sounds and moves too: **check `src/worlds/<world>/moves.ts` first** (and
`src/worlds/common/moves.ts`) for the cast's signature sounds and moves
(Dame Snap's heels, the Saucepan Man's "Eh?", Hedwig's wings …) before
writing your own.

When there are two or more new reusable pieces, hand each to a subagent
(Sonnet is enough) with the matching skill, and write the script while
they draw. Give each agent its own files (its own file under
`src/worlds/<world>/`), and append the entries to the world's `index.ts`
yourself when they're done, so no two agents edit the same file.

## 4. Script

- `npm run new -- <id> <world>` makes `src/cartoons/<id>/` from the
  templates: fill in `meta.ts` (title, summary, `thumb`, and the `ledger`
  of what it's about: docs/WRITING.md, "The ledger") and write the
  script in `cartoon.ts`. It's on the shelf as soon as the folder exists.
  A long episode can keep its one-off art or sounds in their own files
  in the folder (`art.ts`, `sounds.ts`).
- The top comment is the beat sheet, shortened: the whole story scene by
  scene. A reader should know the episode without running it.
- Lines in the order they're said, keys that say what each line is.
- Each scene: `set` builds the opening picture (no waiting, no motion;
  hide later entrances with `k.set(el, { opacity: 0 })`), `play` runs it.
- Put a sound on every action that matters; music per scene; one thing
  moving at a time; a quiet beat after big moments. Use the world's
  `moves.ts` (`import { sounds, moves } from '../../worlds/<world>/moves'`)
  before writing your own; if you do write one a second episode would
  want, promote it there (docs/WORLDS.md, "moves.ts").
- His turns via `k.tapToHelp` with `ask`, `nudge` and `helped` lines,
  and a thank-you that works either way.

## 5. Check

```bash
npm run check -- <id>     # lines, ids, unused lines, speakers, length estimate
npm run typecheck
npm test
```

Fix everything it reports. Don't silence a rule; rewrite the line.

## 6. Watch it

```bash
npm run shots -- <id> --fast              # the whole episode on a fake clock, about a minute
npm run shots -- <id> --fast --scene 2    # one scene (from 1), while fixing it
npm run shots -- <id> --fast --no-tap     # lets every turn run out: see the nudge and helped lines
npm run shots -- <id>                     # real time, 3–5 minutes: the final pacing check
```

It plays the episode in Chromium at 1180 × 820, saves a frame of every
scene every few seconds to `screenshots/<id>/`, a contact sheet
(`sheet.png`), and a pacing report with every caption's timing and any
silent stretch over 4 s. Iterate with `--fast` after every round of
changes (its times are story-clock times with the stand-in voice, close
to the real thing); the last run before the PR is without it.

## 7. Look (the step that matters most)

Read the contact sheet and every scene's opening frame. For each, ask:

- Is everyone where they should be: on stage, not under the caption
  band (y 690+), not overlapping by accident, facing whoever they talk to?
- Is it clear who is speaking and what to look at?
- Does the scary beat look scary but not cruel? Is the ending warm?
- Is anything blank, broken, cropped or cluttered?
- Pacing: every scene 25–90 s, the whole episode 2–5 minutes, no long
  silent stretches.

Fix, re-run `shots --fast`, look again, until every frame is right. Run
it once with `--no-tap` too, and look at the turns done for him. Then
one real-time run for the pacing numbers in the PR.

## 8. Review

Follow the `review-cartoon` skill against your own episode (or hand it
to a fresh subagent for a second pair of eyes). Fix what it finds.

## 9. Voice

`npx tsx scripts/voice/cast-check.ts`. If a speaker has no voice in
`scripts/voice/cast.json`, list them for the person with their `voice`
notes; recording is a separate step (`voice-cartoon` skill) and needs
their ElevenLabs key. The episode plays with the iPad's voice until then.

## 10. Ship

- `npm run test:e2e` (with `PW_CHROMIUM=/opt/pw-browsers/chromium` in the
  cloud) must pass.
- Commit (the cartoon's folder and any world art) with a message that
  says what the episode is, push, and open a PR whose description has
  the summary, the scene list, his turns, the contact sheet's findings
  and the pacing numbers.
- Tell the person: the title, a two-line summary, how long it runs, how
  to watch it (`?cartoon=<id>`), and anything waiting on them (voices).
