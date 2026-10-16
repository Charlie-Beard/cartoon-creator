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
- The world, in text: `npm run catalogue -- <world> --brief` (an index of
  everyone and everything, with sounds and moves), then
  `npm run catalogue -- <world> about` (setting, tone, rules, what's never
  shown), then `--id <id>` for each character and place you use. Don't
  read `src/worlds/<world>/index.ts` or `moves.ts` to learn a world: the
  catalogue is the same notes at a fraction of the size.
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
each up (`npm run catalogue -- <world> --id <id>`; to see them drawn,
`npm run lab -- <world> chars --p <a>,<b>`).

**Look at every backdrop you use at stage size before staging it**
(`npm run lab -- <world> --backdrop <id>`, then read the PNG). Note where
the open ground is, and list what is painted in: it can't move or change.
If the beat sheet changes something the backdrop already shows (its cake's
candles are drawn lit; a fir wood fills one side; a character is drawn into
the scenery), change the beat, cover the spot with a one-off patch you can
fade, or put the thing in as a prop. Find this now, not in the review.

For each missing one decide:

- **Reusable** (a new character, a place another episode could visit, a
  prop that will come back): add it to the world, following the
  `new-character` or `new-backdrop` skill.
- **One-off** (this episode's special object): draw it in the cartoon's
  own file (docs/KIT.md, "Drawing one-off art").

Sounds and moves too: **check `npm run catalogue -- <world> moves`
first** (it covers common and the kit's `k.fx`/`k.sfx` too) for the cast's signature sounds and moves
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
- **Length first.** `npm run check -- <id>` prints the speech estimate
  and the time on screen it gives. Hit the target from the lines
  (docs/WRITING.md, "Pacing") before staging: an episode measured short
  after the shots means writing and staging again.
- **Before staging a scene, check the set pieces**
  (`npm run catalogue -- <world> pieces`; docs/WORLDS.md, "pieces.ts"):
  the ladder arrival, "the land is moving on", the Slippery-Slip, tea in
  Moon-Face's room, Dame Snap's loom and defeat, the owl post, the Great
  Hall, a spell lesson, brooms and apparating, Voldemort's loom, a
  "meanwhile…" cut, a noise off, the warm ending. Pass your line keys in;
  keep his `k.tapToHelp` in your script, between a piece's parts. Vary
  them (a different line, a different place, a twist) so episodes don't
  feel the same.
- Put a sound on every action that matters; music per scene; one thing
  moving at a time; a quiet beat after big moments. Use the world's
  `moves.ts` (`import { sounds, moves } from '../../worlds/<world>/moves'`)
  before writing your own; if you do write one a second episode would
  want, promote it there (docs/WORLDS.md, "moves.ts").
- His turns via `k.tapToHelp` with `ask`, `nudge` and `helped` lines,
  and a thank-you that works either way (after `'helped'`, thank the
  helper, not him).
- Read docs/KIT.md "Pitfalls" before placing anyone: `flip` mirrors
  lettering, hats go on `k.box(el).face`, entrances start fully off stage,
  the speaker stays in the camera's shot, paths cross nobody.

## 5. Check

```bash
npm run check -- <id>     # lines, ids, unused lines, speakers, length estimate
npm run typecheck
npm test
```

Fix everything it reports. Don't silence a rule; rewrite the line.

## 6. Watch it

```bash
npm run shots -- <id> --openings          # each scene's opening picture only, ~5 s: after placing anyone
npm run shots -- <id> --fast              # the whole episode on a fake clock, about a minute
npm run shots -- <id> --fast --scene 2    # one scene (from 1), while fixing it
npm run shots -- <id> --fast --no-tap     # lets every turn run out: see the nudge and helped lines
npm run shots -- <id> --strict            # real time, 3–5 minutes: the final check (fails on any flag)
```

It plays the episode in Chromium at 1180 × 820, saves a frame of every
scene every few seconds to `screenshots/<id>/`, a contact sheet
(`sheet.png`), and a pacing report with every caption's timing and any
silent stretch over 4 s. Iterate with `--fast` after every round of
changes (its times are story-clock times with the stand-in voice, close
to the real thing); the last run before the PR is without it.

It also checks the layout of every frame itself (an actor 25%+ off
stage, a face in the caption band, characters overlapping 35%+, more
than 4 characters, a tap target under 120 px or off stage, the speaker
out of shot) and lists **Frames to look at** (also `flags.json`, and a
red outline on the contact sheet).

## 7. Look (the step that matters most)

Read the contact sheet, every scene's opening frame (`scene<n>-0.png`)
and every flagged frame; you don't need the rest one by one. Fix or
justify every flag. For each frame, ask:

- Is everyone where they should be: on stage, not under the caption
  band (y 690+), not overlapping by accident, facing whoever they talk to?
- Is it clear who is speaking and what to look at?
- Does the scary beat look scary but not cruel? Is the ending warm?
- Is anything blank, broken, cropped or cluttered?
- Pacing: every scene 25–90 s, the whole episode 2–5 minutes, no long
  silent stretches.

Fix, re-run `shots --fast`, look again, until every frame is right. Run
it once with `--no-tap` too, and look at the turns done for him. Then
one real-time run for the pacing numbers in the PR. The real-time run
takes 3–5 minutes: start it in the background and don't edit any file
until it finishes (the dev server reloads the page and spoils it); a
review can read the frames meanwhile.

## 8. Review

Follow the `review-cartoon` skill against your own episode (or hand it
to a fresh subagent for a second pair of eyes). Fix what it finds. Give a
subagent the episode id, the files, and whether a shots run is going (so
it knows the PNGs may be older than the script); a finding drawn from a
stale frame is checked against a fresh one before you act on it. After
fixing, re-run `shots --fast` on the scenes you touched, and the real-time
run if timings moved.

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
- **Merge it** as soon as its CI check is green (the owner's standing
  instruction: always merge; no need to ask). If CI fails, fix it and
  push until it's green, then merge.
- Tell the person: the title, a two-line summary, how long it runs, how
  to watch it (`?cartoon=<id>`), and anything waiting on them (voices).
