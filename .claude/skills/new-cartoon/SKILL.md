---
name: new-cartoon
description: Make a new cartoon episode from a one-line idea ("/new-cartoon Saucepan Man loses his kettle"). Asks 2–4 quick questions, writes the beat sheet, the script and any new art, checks and screenshots every scene, and opens a PR. Use whenever someone asks for a new cartoon, episode or story in this repo.
---

# New cartoon

From a one-line idea to a finished, checked episode on the shelf. Work
through the steps in order; don't skip the looking (step 7).

## 0. Read (every time; it's quick)

- `CLAUDE.md`, `docs/STYLE.md`, `docs/WRITING.md`. Skim `docs/KIT.md`.
- The world's notes: `src/worlds/<world>/index.ts` (world `about`, every
  character's `about`, the backdrops and props available).
- One or two finished cartoons in `src/cartoons/` for the standard
  expected (and, for more examples, the games' story scripts:
  `charlie-beard/maths-game` `src/stories/l7c8.ts`, `opening.ts`;
  `charlie-beard/spelling-game` `src/stories/`).

## 1. Ask (2–4 quick questions, then go)

Use AskUserQuestion once, with up to four questions. Put your
recommended option first, marked "(Recommended)", worked out from the
idea and the world notes. Pick from:

- **World and cast** (if the idea doesn't make it obvious): who's in it.
- **The scary bit:** which villain, or a gentler danger (lost, stuck,
  a storm), or none this time.
- **His turns:** two or three concrete ideas for what he taps.
- **Length:** short (about 2 min, 3 scenes) or longer (4–5 min, 5 scenes).
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

When there are two or more new reusable pieces, hand each to a subagent
(Sonnet is enough) with the matching skill, and write the script while
they draw. Give each agent its own files (its own file under
`src/worlds/<world>/`), and append the entries to the world's `index.ts`
yourself when they're done, so no two agents edit the same file.

## 4. Script

- Create `src/cartoons/<id>.ts` from `templates/cartoon.ts`.
- The top comment is the beat sheet, shortened: the whole story scene by
  scene. A reader should know the episode without running it.
- Lines in the order they're said, keys that say what each line is.
- Each scene: `set` builds the opening picture (no waiting, no motion;
  hide later entrances with `k.set(el, { opacity: 0 })`), `play` runs it.
- Put a sound on every action that matters; music per scene; one thing
  moving at a time; a quiet beat after big moments.
- His turns via `k.tapToHelp` with `ask`, `nudge` and `helped` lines,
  and a thank-you that works either way.
- Append the episode to `SHELF` in `src/cartoons/index.ts` (id, title,
  world, summary exactly as in the file, `load: () => import('./<id>')`).

## 5. Check

```bash
npm run check -- <id>     # lines, ids, unused lines, speakers, length estimate
npm run typecheck
npm test
```

Fix everything it reports. Don't silence a rule; rewrite the line.

## 6. Watch it

```bash
npm run shots -- <id>
```

It plays the episode in Chromium at 1180 × 820, taps his turns, saves
frames of every scene to `screenshots/<id>/`, a contact sheet, and a
measured pacing report.

## 7. Look (the step that matters most)

Read the contact sheet and every scene's opening frame. For each, ask:

- Is everyone where they should be: on stage, not under the caption
  band (y 690+), not overlapping by accident, facing whoever they talk to?
- Is it clear who is speaking and what to look at?
- Does the scary beat look scary but not cruel? Is the ending warm?
- Is anything blank, broken, cropped or cluttered?
- Pacing: every scene 25–90 s, the whole episode 2–5 minutes, no long
  silent stretches.

Fix, re-run `shots`, look again, until every frame is right.

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
- Commit (the cartoon, its art, the shelf entry) with a message that
  says what the episode is, push, and open a PR whose description has
  the summary, the scene list, his turns, the contact sheet's findings
  and the pacing numbers.
- Tell the person: the title, a two-line summary, how long it runs, how
  to watch it (`?cartoon=<id>`), and anything waiting on them (voices).
