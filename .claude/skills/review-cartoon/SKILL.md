---
name: review-cartoon
description: Review a cartoon episode against the house rules (safety, story, lines, his turns, pacing, art, code) using its script, the checker and its screenshots, then list or fix what's wrong. Use after writing a cartoon, before a PR, or when asked to review or check one.
---

# Review a cartoon

A second, careful look at one episode, `src/cartoons/<id>/`. Be
concrete: every finding names the scene, the line key or the frame, and
what to change. Fix what's clearly wrong; ask about matters of taste.

## 1. Gather

```bash
npm run check -- <id>
npm run shots -- <id> --strict # frames, contact sheet, layout flags, measured pacing (real time)
npm run shots -- <id> --fast --no-tap   # his turns done for him: the nudge and helped lines
```

Read the script top to bottom, then the contact sheet, each scene's
opening frame and every frame under "Frames to look at".

**Check the frames are current.** Compare the PNGs' times with the
script's last change (`ls -l --time-style=+%T screenshots/<id>/ src/cartoons/<id>/`).
Frames older than the script show a version that no longer exists: say
which findings come from them, or re-run `shots --fast` first. (Reviews
have flagged a mirrored jumper and a short scene that were already fixed.)
If you were told not to run shots because a run is in progress, say
which frames you could not check.

## 2. Go through the list

**Safety (docs/STYLE.md). Any failure here blocks the episode.**
- [ ] Nobody is hit, slapped, kicked or hurt; no blood, death or "kill".
- [ ] Nobody is lost for good; no parent in real danger.
- [ ] The scary beat is built, lands, and cuts back to the heroes within
      a couple of lines. The episode ends warm and safe.
- [ ] Nothing flashes: no rapid opacity changes, `k.glow` used gently.
- [ ] Nothing new starts moving during his turns.
- [ ] Original art: no logos, film fonts or likenesses.

**Story (docs/WRITING.md)**
- [ ] One clear problem, said out loud in scene 1, solved by the end.
- [ ] 3–5 scenes, each ending on a hook; a warm ending.
- [ ] Characters behave as their world notes say.
- [ ] He is the hero of the turning points; `{name}` 3–6 times.

**Lines**
- [ ] `npm run check` is clean (UK English, length, speakers, unused lines).
- [ ] Every line read aloud sounds natural for its character and is
      easy for a 6-year-old to follow. No line depends on reading the
      caption.
- [ ] `{name}` lines still make sense without a name (`generic`).
- [ ] Taken literally, every line says what it means. A back-to-front or
      ironic line ("I mean, hooray!") is followed by someone saying the
      plain meaning; the plot never rests on a joke he has to decode.
- [ ] No running joke repeats one from each of the world's last two
      episodes (`npm run check` warns) unless it is deliberate.

**His turns**
- [ ] 1–3, never back to back; each target is big, still, obvious and on
      stage, and the tap makes something happen at once.
- [ ] `ask`, `nudge` and `helped` all present and kind; the thank-you
      works either way, and after a `'helped'` turn it thanks the helper,
      not him.
- [ ] The target is the only thing of its kind on screen: nothing in the
      backdrop looks like it (two cakes, two doors), so he knows what to
      tap.

**Pacing**
- [ ] Measured: each scene 25–90 s, total 2–5 minutes (with taps); the
      `--no-tap` run not far over (a turn waited out adds about 25 s).
- [ ] No silent stretch over ~4 s; a quiet beat after big moments.

**Frames**
- [ ] Faces above y ≈ 660 (the caption band); nobody accidentally off
      stage or cut by the frame; speakers face listeners.
- [ ] One thing to look at at a time; at most four actors.
- [ ] Scale consistent between characters; portraits' bottom edges on or
      below the ground line (or behind furniture), never floating.
- [ ] Each scene's opening frame (`set`) reads as a picture on its own.
- [ ] Nothing painted into the backdrop contradicts the story (lit
      candles before they're lit, a character drawn into the scenery who
      also walks on as an actor). Look at the backdrop alone:
      `npm run lab -- <world> --backdrop <id>`.
- [ ] Nobody with lettering on their art (Ron's "R") is flipped.

**Code**
- [ ] The top comment tells the whole story; one-off art and sounds are
      named uniquely and commented; reusable art is in the world.
- [ ] `set` never awaits or animates; `play` awaits its beats; no
      `Math.random` decides anything that matters for the story.
- [ ] `meta.ts` is filled in and spread into the script; typecheck, `npm test` and e2e
      pass.

## 3. Report

A short list, most serious first: **must fix** (safety, broken frames,
failing checks), **should fix** (story, pacing, clarity), **could fix**
(polish). Then fix the must and should items (or hand them back to the
author), re-run `shots --fast` (`--scene n` for one scene), and look
again.
