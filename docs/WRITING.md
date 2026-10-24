# Writing a cartoon

How an episode is shaped, from the idea to the last line. The
`new-cartoon` skill walks through this step by step; this is the
reference it points to.

## The shape of an episode

**2–6 minutes, 3–5 scenes, no interaction.** The episode plays start to end like a TV episode. Lines are the budget
that sets the length: with the action between them, about **13 lines a
minute** (the first episode: 40 lines, 3 minutes).

| Length | Scenes | Lines |
|---|---|---|
| Short, about 2 minutes | 3 | 25–30 |
| About 3 minutes | 4 | 35–40 |
| Long, 4–6 minutes | 5 | 50–65 |

| Part | Scenes | What happens |
|---|---|---|
| **Hello** | 1 | Somewhere familiar. The friends, being themselves. Something small is wrong or about to happen (the kettle is gone; a letter arrives). |
| **Off we go** | 1–2 | The problem grows. They set out, meet someone, try something. The heroes' first deeds come here: they get themselves going. |
| **Uh-oh** | 1 | The scary or tricky bit: the villain looms, the way is blocked, someone is caught. Short, then cut back to the heroes. The heroes' big deed usually saves the day. |
| **Home** | 1 | Everything put right. A warm, funny ending, everyone together, a sparkle, the end. |

Rules of thumb:

- **One clear problem**, said out loud early ("Saucepan's kettle is
  gone!"), and solved by the end. No subplots.
- **The friends are the heroes.** They talk to each other, never to the
  viewer, and they do every turning point themselves, on screen, with a
  flourish (see "Deeds" below).
- **The friends act like themselves.** Read the world's `about` notes and
  the characters' notes before writing. Borrow their running jokes.
- **Something to look at changes every few seconds**: an entrance, a
  hop, a camera move, a prop appearing. But only one thing at a time.
- **Every scene ends on a hook** (a question, a noise off, a "look!"),
  so the paper wipe feels like turning a page.

## The beat sheet

Before any code, write the beat sheet (copy `templates/beat-sheet.md`):
title, world, cast, the problem, and each scene as 4–10 numbered beats
of one line each, marking the big deeds and the scary beat. Check it against
the table above and docs/STYLE.md. It goes, shortened, into the comment
at the top of the cartoon's `cartoon.ts`.

## The ledger

Before planning, run `npm run check -- --ledger` and read what the other
episodes were about: pick a different problem, a different main place
and, where you can, a different villain, and a new kind of deed rather than the
same one again.

Every `meta.ts` has a `ledger`: one short line each for `problem`,
`villain` (a character id, or a gentler danger in words, or left out),
`places` (backdrop ids, **main place first**), `cast`, `jokes` (running jokes,
always worded the same) and `ending`. `npm run check` fails without one,
and warns when a villain, main place, problem or running joke is
much like a recent episode's. A warning is fine if the repeat is
deliberate; a joke in each of a world's last two episodes is the one to
rest.

## Lines

- **One or two short sentences**, 140 characters at most, 16 words a
  sentence at most (`npm run check` enforces this). Most lines are 5–12
  words.
- **Said, not read:** contractions ("it's", "let's"), exclamations,
  sound words ("Clang!", "Twit-twoo!"). Read every line out loud.
- **UK English** words and spellings: Mum, biscuit, colour, torch,
  rubbish, holiday.
- Give each line a **key** that says what it is (`kettleGone`,
  `snapLooms`, `askTap`), listed in the order they're said.
- **Who says it:** `'narrator'` sparingly (scene setting, "Meanwhile…"),
  mostly the characters. Nobody ever speaks to the viewer: no
  "can you see it?", no "well done, you!". Characters speak to each other
  (or to themselves, or to a pet).
- **Never name the child, and no `{placeholders}`** in any line:
  `npm run check` fails on both.
- **Say the plot plainly.** He is six and takes words literally. A
  back-to-front joke ("Goodbye!" for hello, "Oh dear, I mean, hooray!")
  is fun, but never the only place a plot point is said: someone says the
  plain meaning straight after ("He means hello!").
- **Signature traits are not the joke every time.** The Saucepan Man
  mishears and Mr Watzisname sleeps, but if a trait was the running joke
  in each of the world's last two episodes (`npm run check` warns), give
  them a different gag this time and keep the trait to a touch.
- Every line in `lines` must be said in the script (`npm run check`
  fails on unused lines: they would be recorded for nothing).

## Deeds

Nothing in an episode is for the viewer to do. The heroes do every deed
themselves, so each one has to be **clear on screen** and feel finished.

- **Say it, show it, mark it.** Someone says what they're about to do
  ("I'll pull the handle!"), we watch them do it, a sound goes with it
  (a creak, a boing), and the moment it's done it gets a flourish.
- `k.flourish(el)` is a chime and a sparkle burst on an actor's middle.
  Use it for the moment a deed is done: the door opens, the star is
  hung, the lamp lights.
- `await k.carry(item, to)` glides an item to an actor or a point and
  flourishes on arrival: the key to the lock, the letter to the owl, the
  sock into the basket. Good when something has to get from here to
  there.
- **Something physical and obvious:** wake someone, open a door, pop a
  bubble, ring a bell, drop the net, catch the letter. The thing is big
  and still, and the result is immediate and satisfying.
- **It matters:** the deed makes the next thing happen. Don't spend a
  flourish on something that changes nothing.
- **Spread them through the scenes**, one or two a scene, with a beat of
  story between. Not in the scary beat's first seconds: let it land,
  then let a hero act. There is a happy one in the last scene too
  (lighting the candles, the hug, the final sparkle).
- **Mix them up:** wake someone, then carry something, then pop
  something. A deed that only repeats the last one is filler.
- **Never address the viewer.** No asking for help, no waiting for a
  reply, no "did you see that?". If a hero needs something, they ask
  another hero.
- Pacing is simple now: the lines and the action between them are all
  the time there is, with no waiting on anyone.

## Pacing

| | Target |
|---|---|
| Whole episode | 2–6 minutes (measured by `npm run shots`) |
| A scene | 25–90 s |
| Gap between lines | The kit's 250 ms, plus whatever action you put between |
| Action without speech | Up to ~4 s at a time, then someone speaks |
| After a big moment | A 0.5–1 s beat of quiet (`k.wait(700)`) |

The iPad's voice speaks at about 2.4 words a second; recordings are
similar. `npm run check -- <id>` prints the speech estimate and, from it,
the time on screen (about 1.15 × the speech, measured on
the episodes so far). Aim
the speech at about 105–130 s for a short episode, 155–200 s for 3–4
minutes and 210–290 s for a long one, before you stage anything: adding
lines after the shots is slower than writing them in. `npm run shots -- <id>` measures each scene for real and flags
scenes over 90 s and episodes outside 2–6 minutes.

## Scenes in code

Each scene is `{ name, set(k), play(k) }`:

- `set` builds the first picture: backdrop, actors in their places,
  props, lights, ambient, music. It is called behind the curtains (scene
  1) or the paper wipe (later scenes), so **it must not wait or animate**.
  Hide anyone who should enter later (`k.set(el, { opacity: 0 })`).
- `play` runs the scene, `await`ing each beat. When it returns, the
  player wipes to the next scene.
- Share actors between `set` and `play` through a module-level `cast`
  object (see `templates/cartoon/cartoon.ts`).
- The player's skip button stops a scene's script for good and moves on,
  so never leave something essential for the next scene to a scene's
  last line: each `set` must stand on its own.
- A quick change of place inside a scene: `await k.cut(() => { … })`.

## Checklist before you call it done

- [ ] Beat sheet in the file's top comment; title 2–5 words; summary 1–2
      sentences.
- [ ] 3–5 scenes, 2–6 minutes, no interaction, nobody names or speaks to the viewer, no `{placeholders}`.
- [ ] `npm run check -- <id>` passes (lines, ids, unused lines, length).
- [ ] Scary beat follows docs/STYLE.md, and the ending is warm.
- [ ] `npm run shots -- <id>`: every frame looked at, nothing off stage
      by mistake, nothing under the caption band, faces visible, no
      clutter.
- [ ] `meta.ts` filled in (title, summary, a `thumb` backdrop, `added` date).
- [ ] `ledger` in meta.ts filled in and true to the script; any "much like"
      warnings are deliberate.
- [ ] typecheck, `npm test`, `npm run test:e2e` pass.
- [ ] Voice: new speakers have a cast entry or are listed for a grown-up
      to choose (`voice-cartoon` skill).
