---
name: new-cartoon
description: Make a new cartoon episode from a one-line idea ("/new-cartoon Saucepan Man loses his kettle"). Asks 2–4 quick questions, writes the beat sheet, the script and any new art, checks and screenshots every scene, and opens a PR. Use whenever someone asks for a new cartoon, episode or story in this repo.
---

# New cartoon

From a one-line idea to a finished, checked episode on the shelf. Work
through the steps in order; don't skip the looking (step 6).

**Who does what.** The story is where quality comes from, so the main
session (the strongest model) keeps the parts that need taste and hands
the rest to Sonnet subagents (Agent tool, `model: "sonnet"`):

| Step | Who |
|---|---|
| 1 Ask, 2 beat sheet, 4 script, 6 the looking | You |
| 3 Each new reusable character, backdrop or prop | A subagent each, with the `new-character` / `new-backdrop` skill |
| 5–6 Mechanical fixes (a flagged frame plainly off stage, a line too long) | You; a subagent only if your context is already long |
| 7 Review | A fresh subagent with the `review-cartoon` skill: new eyes are the point |

A subagent starts cold, so brief it fully: the episode id, the skill to
follow, the files it may touch, the facts it needs (a backdrop's ground
line, a character's look) and what to report back. Tell it to read only
what its skill lists. Read what it changed before you carry on.

**Spend tokens where they buy quality.** Learn a world from
`npm run catalogue`, never from `src/worlds/*/index.ts`. Look at the
sheets `shots` makes, not single frames. Don't re-read a file you've just
written; to find a passage again, Grep for it. Run anything long (a
real-time `shots`, `verify`) in the background and carry on: you're told
when it ends, so never poll or sleep.

## 0. Read (every time)

- `docs/STYLE.md` and `docs/WRITING.md`, all of them. In `docs/KIT.md`:
  "Building a set", "Speech", "Deeds" and "Pitfalls" now; look up the rest
  as you need it.
- The world, in text: `npm run catalogue -- <world> --brief` (everyone and
  everything, with sounds, moves and set pieces), then
  `npm run catalogue -- <world> about` (setting, tone, rules, what's never
  shown), then `--id <id>` for each character and place you use.
- The world's newest episode, `src/cartoons/<id>/cartoon.ts` (the ledger
  below lists them newest first): the standard to meet, and the latest
  ways of doing things. One is enough.
- `npm run check -- --ledger <world>`: what the world's episodes were
  about. Steer the idea away from recent villains, main places, kinds of
  deed and jokes, and tell the person if their idea repeats one.

When you start a dev server yourself, give it its own port
(`npx vite --port 52xx`): other sessions may share the machine.

## 1. Ask (2–4 quick questions, then go)

Use AskUserQuestion once, with up to four questions. Put your
recommended option first, marked "(Recommended)", worked out from the
idea and the world notes. Pick from:

- **World and cast** (if the idea doesn't make it obvious): who's in it.
- **The scary bit:** which villain, or a gentler danger (lost, stuck,
  a storm), or none this time.
- **The deeds:** a few concrete ideas for what the heroes do on screen
  to move the story (open the door, carry the key, light the lamp).
- **Length:** short (about 2 min, 3 scenes, 25–30 lines), about 3 min
  (4 scenes, 35–40 lines) or long (4–6 min, 5 scenes, 50–65 lines).
- **Ending flavour:** funny, cosy, a party.

If the person said not to ask, or answered everything already, skip
this and use your recommendations.

## 2. Beat sheet

Copy `templates/beat-sheet.md` into your scratchpad and fill it in.
Check it against docs/WRITING.md (the shape, one problem, the heroes
doing every turning point) and docs/STYLE.md (scary, not cruel; a warm
ending). Fix it now: changing a beat sheet is cheap, changing a script is
not. Show the person the beat sheet in a few lines, and carry on unless
they stop you.

## 3. What's needed

List every character, backdrop and prop the beat sheet uses, and look
each up (`npm run catalogue -- <world> --id <id>`; drawn:
`npm run lab -- <world> chars --p <a>,<b>`).

**Look at every backdrop you use at stage size before staging it**, with
the scene's cast standing on it (`npm run lab -- <world> --backdrop <id>
--with <a>,<b>,<c>`: feet on its ground line, the line drawn in). Note
the ground line and the open ground, and list what is painted in: it
can't move or change. If the beat sheet changes something the backdrop shows
(its cake's candles are drawn lit; a character is drawn into the
scenery), change the beat, cover the spot with a one-off patch you can
fade, or put the thing in as a prop. Find this now, not in the review.

For each missing one decide:

- **Reusable** (a character, a place another episode could visit, a prop
  that will come back): it goes in the world. Hand each to its own
  subagent, and write the script while they draw. Give each its own file
  under `src/worlds/<world>/`, and append the entries to the world's
  `index.ts` yourself when they're done, so no two agents edit one file.
- **One-off** (this episode's special object): draw it in the cartoon's
  own folder (docs/KIT.md, "Drawing one-off art").

Sounds and moves: check `npm run catalogue -- <world> moves` (it covers
common and the kit's `k.fx`/`k.sfx` too) before writing your own.

## 4. Script

- `npm run new -- <id> <world>` makes `src/cartoons/<id>/` from the
  templates; it's on the shelf as soon as the folder exists. Fill in
  `meta.ts`: a title of 2–5 words, a summary of 1–2 sentences, `thumb` (a
  backdrop id), `added`, and the `ledger` (docs/WRITING.md, "The ledger"). One-off art and sounds can go in their
  own files in the folder (`art.ts`, `sounds.ts`).
- The top comment is the beat sheet, shortened: the whole story, scene by
  scene. A reader should know the episode without running it.
- Lines in the order they're said, with keys that say what each line is.
- **Length first.** `npm run check -- <id>` prints the speech estimate
  and the time on screen it gives. Hit the target from the lines
  (docs/WRITING.md, "Pacing") before staging: an episode measured short
  after the shots means writing and staging again.
- **Set pieces before staging** (`npm run catalogue -- <world> pieces`,
  `--id <piece>` for one in full): arrivals, a villain's loom and defeat,
  tea, the owl post, the chair ride, "meanwhile…", a noise off, the warm
  ending. Pass your line keys in; put your own deeds between a piece's
  parts; vary them so episodes don't feel the same.
- **Placing people:** stand them on the backdrop's ground line with
  `{ cx, feet, w }` (docs/KIT.md), and read "Pitfalls" before placing
  anyone. Things riding the Wishing-Chair go in its cargo
  (`chairRide.load`). Each scene's `set` builds the opening picture (no
  waiting, no motion: hide later entrances with `k.set(el, { opacity: 0 })`).
- The deeds, the sounds, one thing moving at a time, and nobody speaking
  to the viewer: docs/WRITING.md and docs/STYLE.md. If you write a sound
  or move a second episode would want, promote it to the world's
  `moves.ts` (docs/WORLDS.md).

## 5. Check

`npm run check -- <id>` (lines, ids, `set` rules, length, the deeds per
scene) while you write; `npm run verify -- <id> --no-e2e` adds the
typecheck and unit tests. Fix everything they report: don't silence a
rule, rewrite the line.

## 6. Watch it, and look (the step that matters most)

```bash
npm run shots -- <id> --openings          # each scene's opening set only, ~10 s: after placing anyone
npm run shots -- <id> --fast              # the whole episode on a fake clock, about a minute
npm run shots -- <id> --fast --scene 2    # one scene (from 1), while fixing it
npm run shots -- <id> --strict            # real time, 3–6 minutes: the final check (fails on any flag)
```

It plays the episode in Chromium at 1180 × 820 and writes, to
`screenshots/<id>/`:

- `sheet.png`: the episode at a glance (each scene's opening and 5 more frames);
- `openings.png`: every scene's opening set at half size;
- `flags.png`: every frame its layout checks flagged (an actor 25%+ off
  stage, a face in the caption band, characters overlapping 35%+, more
  than 4 characters, the speaker out of shot), at half size, with the
  actors boxed and the reasons;
- `sheet-scene<n>.png` (one scene, every frame) and the single frames, for
  a question the sheets can't answer: a single frame costs as much as a
  sheet of four.

The report gives each scene's time and any silent stretch over 4 s
(`--captions` adds every line's timing). `--fast` times are story-clock
times with the stand-in voice, close to the real thing.

Read `sheet.png`, `openings.png` and `flags.png`. Fix or justify every
flag. For each picture, ask:

- Is everyone where they should be: on stage, on the ground, clear of the
  caption band (y 690+), not overlapping by accident, facing whoever they
  talk to?
- Is it clear who is speaking and what to look at?
- Does the scary beat look scary but not cruel? Is the ending warm?
- Is anything blank, broken, cropped or cluttered?
- Pacing: every scene 25–90 s, the whole episode 2–6 minutes, no long
  silent stretches.

Fix, re-run (`--scene n` for the scene you changed, `--openings` after
moving people), and read just those sheets again, until every picture is
right. Then one real-time `--strict` run for the pacing numbers in the
PR: start it in the background and carry on with the review. It plays
the code as it was when it started, so editing meanwhile is safe, but an
edit isn't in its numbers.

## 7. Review

Hand the episode to a fresh subagent with the `review-cartoon` skill.
Brief it with the episode id, its files, and whether a real-time run is
going: if one is, it re-runs anything with `--out screenshots/<id>-review`
so the two runs don't delete each other's frames. Check a finding drawn
from a stale frame against a fresh one before acting on it. Fix what it
finds, re-run `shots --fast` on the scenes you touched, and the real-time
run if timings moved.

## 8. Voice

`npx tsx scripts/voice/cast-check.ts`. If a speaker has no voice in
`scripts/voice/cast.json`, list them for the person with their `voice`
notes; recording is a separate step (`voice-cartoon` skill) and needs
their ElevenLabs key. The episode plays with the iPad's voice until then.

## 9. Ship

- `npm run verify -- <id>` must pass (typecheck, unit tests, check, and
  the e2e tests for this episode and the screens, about a minute). If you
  changed a world's shared art, moves or pieces, `npm run verify`
  (everything).
- Commit (the cartoon's folder and any world art) with a message that
  says what the episode is, push, and open a PR whose description has
  the summary, the scene list, the deeds, what the sheets showed and the
  pacing numbers.
- **Merge it** as soon as its CI check is green (the owner's standing
  instruction: always merge; no need to ask). If CI fails, fix it and
  push until it's green, then merge.
- Tell the person: the title, a two-line summary, how long it runs, how
  to watch it (`?cartoon=<id>`), and anything waiting on them (voices).
