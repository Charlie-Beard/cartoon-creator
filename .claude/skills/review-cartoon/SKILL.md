---
name: review-cartoon
description: Review a cartoon episode against the house rules (safety, story, lines, no interaction, pacing, art, code) using its script, the checker and its screenshots, then list or fix what's wrong. Use after writing a cartoon, before a PR, or when asked to review or check one.
---

# Review a cartoon

A second, careful look at one episode, `src/cartoons/<id>/`. Be
concrete: every finding names the scene, the line key or the frame, and
what to change. Fix what's clearly wrong; ask about matters of taste.

## 1. Gather

Read docs/STYLE.md (the house style and what's never shown), then:

```bash
npm run check -- <id>
```

It already fails what a machine can see: unknown ids, unused or missing
lines, long sentences, US spellings, `{placeholders}`, anything
interactive, a `set()` that waits or animates, a lettered character
flipped. It also prints the speech length, the deeds each scene marks and
any character's line said with no actor. Don't re-check those by hand;
spend the review on what needs judgement, below.

Read the script top to bottom (the top comment first), then
`screenshots/<id>/sheet.png` (the episode at a glance), `openings.png`
(each scene's opening set) and `flags.png` (the frames `shots` flagged,
actors boxed, with the reasons). Open `sheet-scene<n>.png` or a single
frame only for a question those can't answer. The author makes the
real-time run, so don't repeat it.

**Check the frames are current.** Compare the PNGs' times with the
script's last change (`ls -l --time-style=+%T screenshots/<id>/*.png src/cartoons/<id>/`).
Frames older than the script show a version that no longer exists
(reviews have flagged a mirrored jumper and a short scene that were
already fixed). Re-run `npm run shots -- <id> --fast` first, or say which
findings come from old frames. If a real-time run is going, re-run with
`--out screenshots/<id>-review`, so the two runs don't delete each
other's frames.

## 2. Go through the list

**Safety (docs/STYLE.md). Any failure here blocks the episode.**
- [ ] Nobody is hit, slapped, kicked or hurt; no blood, death or "kill".
- [ ] Nobody is lost for good; no parent in real danger.
- [ ] The scary beat is built, lands, and cuts back to the heroes within
      a couple of lines. The episode ends warm and safe.
- [ ] Nothing flashes: no rapid opacity changes, `k.glow` used gently.
- [ ] Nothing new starts moving while a deed is done.
- [ ] Original art: no logos, film fonts or likenesses.

**Story (docs/WRITING.md)**
- [ ] One clear problem, said out loud in scene 1, solved by the end.
- [ ] 3–5 scenes, each ending on a hook; a warm ending.
- [ ] Characters behave as their world notes say
      (`npm run catalogue -- <world> --id <id>`).
- [ ] The heroes do every turning point themselves, on screen.

**Lines**
- [ ] Every line read aloud sounds natural for its character and is
      easy for a 6-year-old to follow.
- [ ] Nobody speaks to the viewer or asks them anything.
- [ ] Taken literally, every line says what it means. A back-to-front or
      ironic line ("I mean, hooray!") is followed by someone saying the
      plain meaning; the plot never rests on a joke the child has to decode.
- [ ] Any "much like a recent episode" warning from `check` is deliberate.

**Deeds**
- [ ] Each deed is said first, shown on stage with a sound, and marked
      with `k.flourish` / `k.carry`; it makes something happen at once.
- [ ] Deeds are spread through the scenes and varied (the per-scene count
      from `check` helps), not five of the same kind; a carried item and
      its destination are both on stage, clear of the caption band,
      200–600 px apart.

**Pacing** (the author's real-time report, or the `--fast` one)
- [ ] Each scene 25–90 s, the whole episode 2–6 minutes.
- [ ] No silent stretch over ~4 s; a quiet beat after big moments.

**Frames**
- [ ] Every flag in `flags.png` is fixed, or plainly deliberate (an
      entrance from the wings, a push-in).
- [ ] Faces above y ≈ 660; nobody cut by the frame by accident; speakers
      face listeners.
- [ ] One thing to look at at a time; at most four actors.
- [ ] Scale consistent between characters; feet on the ground line (or
      behind furniture), never floating.
- [ ] Each scene's opening set reads as a picture on its own.
- [ ] Nothing painted into the backdrop contradicts the story (lit
      candles before they're lit, a character drawn into the scenery who
      also walks on). Look at it if unsure:
      `npm run lab -- <world> --backdrop <id>`.

**Code**
- [ ] The top comment tells the whole story; one-off art and sounds are
      named uniquely and commented; reusable art is in the world.
- [ ] `play` awaits its beats; `meta.ts` is filled in and its ledger is
      true to the script.

## 3. Report

A short list, most serious first: **must fix** (safety, broken frames,
failing checks), **should fix** (story, pacing, clarity), **could fix**
(polish). Then fix the must and should items (or hand them back to the
author), re-run `shots --fast` (`--scene n` for one scene), and read
those sheets again.
