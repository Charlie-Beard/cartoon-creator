# Writing a cartoon

How an episode is shaped, from the idea to the last line. The
`new-cartoon` skill walks through this step by step; this is the
reference it points to.

## The shape of an episode

**2–5 minutes, 3–5 scenes, 1–3 of his turns.** Lines are the budget
that sets the length: with the action between them, about **13 lines a
minute** (the first episode: 40 lines, 3 minutes).

| Length | Scenes | Lines |
|---|---|---|
| Short, about 2 minutes | 3 | 25–30 |
| About 3 minutes | 4 | 35–40 |
| Long, 4–5 minutes | 5 | 50–60 |

| Part | Scenes | What happens |
|---|---|---|
| **Hello** | 1 | Somewhere familiar. The friends, being themselves. Something small is wrong or about to happen (the kettle is gone; a letter arrives). Someone says his name in the first minute. |
| **Off we go** | 1–2 | The problem grows. They set out, meet someone, try something. **His first turn** comes here: he helps them get going. |
| **Uh-oh** | 1 | The scary or tricky bit: the villain looms, the way is blocked, someone is caught. Short, then cut back to the heroes. **His big turn** usually saves the day. |
| **Home** | 1 | Everything put right. A warm, funny ending, everyone together, a sparkle, the end. |

Rules of thumb:

- **One clear problem**, said out loud early ("Saucepan's kettle is
  gone!"), and solved by the end. No subplots.
- **He is the hero** without being drawn: the friends talk to him
  ("{name}, can you see it?") and his taps make the turning points
  happen. Use `{name}` 3–6 times an episode, not in every line.
- **The friends act like themselves.** Read the world's `about` notes and
  the characters' notes before writing. Borrow their running jokes.
- **Something to look at changes every few seconds**: an entrance, a
  hop, a camera move, a prop appearing. But only one thing at a time.
- **Every scene ends on a hook** (a question, a noise off, a "look!"),
  so the paper wipe feels like turning a page.

## The beat sheet

Before any code, write the beat sheet (copy `templates/beat-sheet.md`):
title, world, cast, the problem, and each scene as 4–10 numbered beats
of one line each, marking his turns and the scary beat. Check it against
the table above and docs/STYLE.md. It goes, shortened, into the comment
at the top of the cartoon's file.

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
  mostly the characters. The narrator speaks about him in the third
  person rarely; characters speak to him directly.
- `{name}` is replaced with his name. Without a name it becomes "you" or
  is dropped (`generic` in `src/core/phrases.ts`), so write lines that
  work both ways: "Well done, {name}!" and "{name} found it!" both work.
- Every line in `lines` must be said in the script (`npm run check`
  fails on unused lines: they would be recorded for nothing).

## His turns

`k.tapToHelp(target, { ask, nudge, helped, by })` is the only
interaction. It works like this:

1. `by` says `ask` ("The door's stuck! Can you tap the handle, {name}?").
2. A gold ring breathes round `target`; everything else holds still.
3. If he taps: a sparkle, and the story goes on (it returns `'tapped'`).
4. If he hasn't after about 9 s, `by` says `nudge` once ("Just tap the
   handle!"). After about 12 s more, `helped` is said ("I'll give it a
   push!") and the story goes on anyway (`'helped'`).

Good turns:

- **Something physical and obvious:** wake someone (tap their nose),
  open a door, pop a bubble, ring a bell, drop the net, catch the
  letter. The target is big and still.
- **It matters:** his tap is what makes the next thing happen. Follow it
  with an immediate, satisfying result (door creaks open, sparkle,
  "You did it, {name}!").
- **1–3 per episode**, never back to back, never in the scary beat's
  first seconds (let it land, then ask for help).
- Write the thank-you so it works either way, or branch on the result:

```ts
const how = await k.tapToHelp(handle, { ask: 'askHandle', nudge: 'nudgeHandle', helped: 'pushDoor', by: mf });
await k.say(how === 'tapped' ? 'thanks' : 'phew', mf);
```

All four lines are said in some run, so all four count as used.

## Pacing

| | Target |
|---|---|
| Whole episode | 2–5 minutes (measured by `npm run shots`) |
| A scene | 25–90 s |
| Gap between lines | The kit's 250 ms, plus whatever action you put between |
| Action without speech | Up to ~4 s at a time, then someone speaks |
| After a big moment | A 0.5–1 s beat of quiet (`k.wait(700)`) |

The iPad's voice speaks at about 2.4 words a second; recordings are
similar. `npm run shots -- <id>` measures each scene for real and flags
scenes over 90 s and episodes outside 2–5 minutes.

## Scenes in code

Each scene is `{ name, set(k), play(k) }`:

- `set` builds the first picture: backdrop, actors in their places,
  props, lights, ambient, music. It is called behind the curtains (scene
  1) or the paper wipe (later scenes), so **it must not wait or animate**.
  Hide anyone who should enter later (`k.set(el, { opacity: 0 })`).
- `play` runs the scene, `await`ing each beat. When it returns, the
  player wipes to the next scene.
- Share actors between `set` and `play` through a module-level `cast`
  object (see `templates/cartoon.ts`).
- The player's skip button stops a scene's script for good and moves on,
  so never leave something essential for the next scene to a scene's
  last line: each `set` must stand on its own.
- A quick change of place inside a scene: `await k.cut(() => { … })`.

## Checklist before you call it done

- [ ] Beat sheet in the file's top comment; title 2–5 words; summary 1–2
      sentences.
- [ ] 3–5 scenes, 2–5 minutes, 1–3 turns, `{name}` used 3–6 times.
- [ ] `npm run check -- <id>` passes (lines, ids, unused lines, length).
- [ ] Scary beat follows docs/STYLE.md, and the ending is warm.
- [ ] `npm run shots -- <id>`: every frame looked at, nothing off stage
      by mistake, nothing under the caption band, faces visible, no
      clutter.
- [ ] Registered on the shelf (`src/cartoons/index.ts`, appended).
- [ ] typecheck, `npm test`, `npm run test:e2e` pass.
- [ ] Voice: new speakers have a cast entry or are listed for a grown-up
      to choose (`voice-cartoon` skill).
