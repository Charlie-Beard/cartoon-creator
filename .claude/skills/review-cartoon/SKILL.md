---
name: review-cartoon
description: Review a cartoon episode against the house rules (safety, story, lines, his turns, pacing, art, code) using its script, the checker and its screenshots, then list or fix what's wrong. Use after writing a cartoon, before a PR, or when asked to review or check one.
---

# Review a cartoon

A second, careful look at one episode, `src/cartoons/<id>.ts`. Be
concrete: every finding names the scene, the line key or the frame, and
what to change. Fix what's clearly wrong; ask about matters of taste.

## 1. Gather

```bash
npm run check -- <id>
npm run shots -- <id>          # frames, contact sheet, measured pacing
```

Read the script top to bottom, then read the contact sheet and the
frames of every scene.

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

**His turns**
- [ ] 1–3, never back to back; each target is big, still, obvious and on
      stage, and the tap makes something happen at once.
- [ ] `ask`, `nudge` and `helped` all present and kind; the thank-you
      works either way.

**Pacing**
- [ ] Measured: each scene 25–90 s, total 2–5 minutes.
- [ ] No silent stretch over ~4 s; a quiet beat after big moments.

**Frames**
- [ ] Faces above y ≈ 660 (the caption band); nobody accidentally off
      stage or cut by the frame; speakers face listeners.
- [ ] One thing to look at at a time; at most four actors.
- [ ] Scale consistent between characters; feet on the ground line.
- [ ] Each scene's opening frame (`set`) reads as a picture on its own.

**Code**
- [ ] The top comment tells the whole story; one-off art and sounds are
      named uniquely and commented; reusable art is in the world.
- [ ] `set` never awaits or animates; `play` awaits its beats; no
      `Math.random` decides anything that matters for the story.
- [ ] The shelf entry matches the file; typecheck, `npm test` and e2e
      pass.

## 3. Report

A short list, most serious first: **must fix** (safety, broken frames,
failing checks), **should fix** (story, pacing, clarity), **could fix**
(polish). Then fix the must and should items (or hand them back to the
author), re-run `shots`, and look again.
