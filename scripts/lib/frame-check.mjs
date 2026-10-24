/**
 * Layout checks on the boxes of one frame (and of a scene's frames in turn),
 * for `npm run shots`: so whoever writes a cartoon reads the contact sheet,
 * each scene's opening frame and the FLAGGED frames, not every frame.
 *
 * Pure: no DOM, no Playwright. shots.mjs collects a `Frame` from the page
 * at each screenshot (see collectFrame there) and hands the frames of a
 * scene to `checkScene`. The unit test is tests/unit/frame-check.test.ts.
 *
 * A Frame, all in STAGE coordinates (1180 × 820, top-left origin, with the
 * camera's zoom included: it is what he sees):
 *
 *   {
 *     stage:   { w: 1180, h: 820 },
 *     zoom:    1,                           // the camera: 1 = the wide shot
 *     actors:  [{ key: 'moonface#1',        // stable for one element across frames
 *                 kind: 'character',        // 'character' (data-actor) | 'prop' (data-prop) | 'art' (k.add)
 *                 name: 'moonface',
 *                 box: { x, y, w, h },      // the element's bounding box
 *                 opacity: 1,               // its own times its parents'
 *                 shown: true,              // false for display:none
 *                 speaking: false }],       // k.say is bobbing this one right now
 *     caption: { on: true, box: { x, y, w, h } | null },   // the bubble
 *   }
 *
 * What is flagged, and why these numbers (tuned on whistling-kettle, which
 * is clean; see THRESHOLDS):
 *   offstage   a character or prop 25%+ off the stage and still so in the next
 *              frame (a deliberate entrance or exit has moved on by then). One
 *              that is wholly off stage is waiting to enter or has left: not flagged.
 *   caption    a character's face (the top 40% of the box) reaches into the
 *              caption band (y 690+) under the caption bubble while one is
 *              showing. (With `assumeCaption`: as if one were.) Not checked
 *              with the camera zoomed in, which puts people low on purpose.
 *   overlap    two characters share more than 35% of the smaller one's box (both
 *              at least half on stage: two leaving together bunch up off the edge).
 *   crowd      more than 4 characters on stage at once.
 *   speaker    the actor the kit is bobbing for the line (data-speaking) is off
 *              stage or invisible while the line is captioned.
 *
 * Something that stays wrong over several frames is reported once, at the
 * first of them, with how long it lasts.
 */

export const THRESHOLDS = {
  /** An actor with more than this fraction of its box off stage is flagged (if it stays so). */
  offstage: 0.25,
  /** ...unless this much of it is off: it is waiting in the wings, or has left. */
  gone: 0.98,
  /** The face region is the top fraction of a character's box. */
  face: 0.4,
  /** Captions take the bottom band of the stage from here down. */
  bandTop: 690,
  /** Two characters overlapping by more than this fraction of the smaller box are flagged. */
  overlap: 0.35,
  /** More than this many characters at once is flagged. */
  maxCharacters: 4,
  /** An actor at or under this opacity can't be seen. */
  invisible: 0.05,
  /** A speaker with less than this fraction of their box on stage counts as off stage. */
  speakerInView: 0.5,
  /** The camera is zoomed in past this: the edges of the stage cut actors off by design. */
  zoomed: 1.05,
};

const T = THRESHOLDS;
const area = (b) => Math.max(0, b.w) * Math.max(0, b.h);
const overlapArea = (a, b) => {
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return w > 0 && h > 0 ? w * h : 0;
};
const pct = (f) => `${Math.round(f * 100)}%`;
const px = (n) => String(Math.round(n));
const spot = (b) => `x ${px(b.x)}–${px(b.x + b.w)}, y ${px(b.y)}–${px(b.y + b.h)}`;

/** Is it there to be seen: not display:none, not faded out, not shrunk to nothing. */
export const isVisible = (a) => a.shown !== false && a.opacity > T.invisible && a.box.w >= 1 && a.box.h >= 1;

/** How much of an actor's box is on the stage, 0 to 1. */
export function onStage(a, stage) {
  const total = area(a.box);
  return total > 0 ? Math.min(1, overlapArea(a.box, { x: 0, y: 0, w: stage.w, h: stage.h }) / total) : 0;
}

/**
 * The problems in one frame: [{ kind, key, message }]. `key` says what the
 * problem is about, so the same one in the next frame can be told from a new one.
 * `offstage` problems come back with kind 'offstage?': they only count if the
 * next frame has them too (checkScene decides).
 */
export function checkFrame(frame, { assumeCaption = false } = {}) {
  const issues = [];
  const { stage } = frame;
  const zoomed = frame.zoom > T.zoomed;
  const seen = frame.actors.filter(isVisible);
  const characters = seen.filter((a) => a.kind === 'character');

  // Off stage. (Not when the camera is in close: the edges cut people off on purpose.)
  if (!zoomed) {
    for (const a of seen) {
      if (a.kind === 'art') continue;
      const off = 1 - onStage(a, stage);
      if (off > T.offstage && off < T.gone) {
        issues.push({ kind: 'offstage?', key: `offstage:${a.key}`, message: `${a.key} is ${pct(off)} off the stage (${spot(a.box)}).` });
      }
    }
  }

  // Faces under the caption. (Not when the camera is in close: a push-in puts people low on purpose,
  // and the boxes are scaled up with it.)
  const bubble = frame.caption?.box ?? { x: 150, y: T.bandTop, w: 880, h: 110 };
  if ((frame.caption?.on || assumeCaption) && !zoomed) {
    for (const a of characters) {
      const face = { x: a.box.x, y: a.box.y, w: a.box.w, h: a.box.h * T.face };
      const reaches = face.y + face.h > T.bandTop;
      const under = face.x < bubble.x + bubble.w && face.x + face.w > bubble.x;
      if (reaches && under) {
        issues.push({
          key: `caption:${a.key}`,
          kind: 'caption',
          message: `${a.key}'s face (y ${px(face.y)}–${px(face.y + face.h)}) reaches into the caption band, y ${T.bandTop}+${frame.caption?.on ? '' : ' (a caption will land there)'}.`,
        });
      }
    }
  }

  // Characters on top of each other, and too many on stage: those in the shot (half or more on
  // the stage), not ones leaving or waiting in the wings, which bunch up off the edge.
  const present = characters.filter((a) => onStage(a, stage) >= 0.5);
  for (let i = 0; i < present.length; i++) {
    for (let j = i + 1; j < present.length; j++) {
      const a = present[i];
      const b = present[j];
      const smaller = Math.min(area(a.box), area(b.box));
      const share = smaller > 0 ? overlapArea(a.box, b.box) / smaller : 0;
      if (share > T.overlap) {
        issues.push({ kind: 'overlap', key: `overlap:${[a.key, b.key].sort().join('|')}`, message: `${a.key} and ${b.key} overlap by ${pct(share)} of the smaller one.` });
      }
    }
  }
  if (present.length > T.maxCharacters) {
    issues.push({ kind: 'crowd', key: 'crowd', message: `${present.length} characters on stage at once (${present.map((a) => a.key).join(', ')}); more than ${T.maxCharacters}.` });
  }

  // The speaker, while their line is being said. The kit marks the actor it is bobbing for the line
  // (data-speaking); the caption alone can't say, as it stays up after the line ends (and while they
  // walk off). A line said with no actor given has no one to check.
  if (frame.caption?.on) {
    const talkers = frame.actors.filter((a) => a.speaking);
    if (talkers.length) {
      // Several at once (a line said by a pair): the best placed one is enough.
      const best = talkers.map((a) => ({ a, f: isVisible(a) ? onStage(a, stage) : 0 })).sort((p, q) => q.f - p.f)[0];
      if (best.f < T.speakerInView) {
        const why = !isVisible(best.a) ? 'invisible' : `${pct(1 - best.f)} off the stage${zoomed ? ' (out of the camera\'s shot)' : ''}`;
        issues.push({ kind: 'speaker', key: `speaker:${best.a.key}`, message: `${best.a.key} is speaking but is ${why}.` });
      }
    }
  }
  return issues;
}

/**
 * Checks a scene's frames in the order they were shot. Returns, for each
 * frame, the reasons it should be looked at: [{ kind, message }] ([] if it
 * is fine). A problem that carries on over several frames is reported at the
 * first of them, with "(and for N more frames)"; an off-stage problem only
 * counts at all if it lasts two frames in a row.
 */
export function checkScene(frames, opts = {}) {
  const per = frames.map((f) => checkFrame(f, opts));
  const out = frames.map(() => []);
  per.forEach((issues, i) => {
    for (const issue of issues) {
      const startsHere = !(i > 0 && per[i - 1].some((p) => p.key === issue.key));
      if (!startsHere) continue;
      let length = 1;
      while (i + length < per.length && per[i + length].some((p) => p.key === issue.key)) length++;
      if (issue.kind === 'offstage?' && length < 2) continue;
      const more = length > 1 ? ` (and for ${length - 1} more frame${length > 2 ? 's' : ''})` : '';
      out[i].push({ kind: issue.kind.replace('?', ''), message: issue.message + more });
    }
  });
  return out;
}
