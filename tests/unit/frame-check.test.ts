import { describe, expect, it } from 'vitest';
// The checks are plain JS (scripts/lib/frame-check.mjs, used by scripts/shots.mjs); the shape is in its header.
// @ts-ignore: no type declarations for a .mjs file
import { THRESHOLDS, checkFrame, checkScene, isVisible, onStage } from '../../scripts/lib/frame-check.mjs';

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}
interface Actor {
  key: string;
  kind: 'character' | 'prop';
  name: string;
  box: Box;
  opacity: number;
  shown: boolean;
  speaking: boolean;
}
interface Frame {
  stage: { w: number; h: number };
  zoom: number;
  actors: Actor[];
  caption: { on: boolean; box: Box | null } | null;
}

const char = (name: string, x: number, y: number, w = 240, extra: Partial<Actor> = {}): Actor => ({
  key: `${name}#1`,
  kind: 'character',
  name,
  box: { x, y, w, h: w * 1.13 },
  opacity: 1,
  shown: true,
  speaking: false,
  ...extra,
});
const prop = (name: string, x: number, y: number, w = 140): Actor => ({ ...char(name, x, y, w), key: `${name}#1`, kind: 'prop', name, box: { x, y, w, h: w } });
const frame = (actors: Actor[], extra: Partial<Frame> = {}): Frame => ({
  stage: { w: 1180, h: 820 },
  zoom: 1,
  actors,
  caption: { on: false, box: null },
  ...extra,
});
const caption = (box: Box = { x: 240, y: 712, w: 700, h: 68 }) => ({ on: true, box });
const kinds = (f: Frame) => checkFrame(f).map((i: { kind: string }) => i.kind);

describe('a tidy frame', () => {
  it('has nothing to flag: three characters standing apart, a caption below them', () => {
    const f = frame([char('moonface', 100, 380), char('silky', 460, 360, 210), char('saucepan', 800, 380)], { caption: caption() });
    expect(checkFrame(f)).toEqual([]);
  });

  it('has nothing to flag with no actors at all', () => {
    expect(checkFrame(frame([]))).toEqual([]);
  });
});

describe('seeing an actor', () => {
  it('counts only those that are shown, shrunk to something and above 5% opacity', () => {
    expect(isVisible(char('a', 0, 0))).toBe(true);
    expect(isVisible(char('a', 0, 0, 240, { opacity: 0.05 }))).toBe(false);
    expect(isVisible(char('a', 0, 0, 240, { opacity: 0.06 }))).toBe(true);
    expect(isVisible(char('a', 0, 0, 240, { shown: false }))).toBe(false);
    expect(isVisible({ ...char('a', 0, 0), box: { x: 0, y: 0, w: 0, h: 0 } })).toBe(false);
  });

  it('measures how much of the box is on the stage', () => {
    const stage = { w: 1180, h: 820 };
    expect(onStage(char('a', 100, 100, 200), stage)).toBe(1);
    expect(onStage({ ...char('a', 0, 0), box: { x: -100, y: 0, w: 200, h: 100 } }, stage)).toBeCloseTo(0.5);
    expect(onStage({ ...char('a', 0, 0), box: { x: 2000, y: 0, w: 200, h: 100 } }, stage)).toBe(0);
  });
});

describe('off the stage', () => {
  const half = frame([char('moonface', -130, 300, 240)]); // about 54% off the left edge

  it('is not flagged for one frame (an entrance or an exit passes through)', () => {
    expect(checkScene([frame([char('moonface', 100, 300)]), half, frame([char('moonface', 100, 300)])])).toEqual([[], [], []]);
  });

  it('is flagged, once, at the first of two frames in a row', () => {
    const out = checkScene([frame([char('moonface', 100, 300)]), half, half, half]);
    expect(out[0]).toEqual([]);
    expect(out[1]).toHaveLength(1);
    expect(out[1][0].kind).toBe('offstage');
    expect(out[1][0].message).toMatch(/moonface#1 is 5\d% off the stage/);
    expect(out[1][0].message).toMatch(/and for 2 more frames/);
    expect(out[2]).toEqual([]);
    expect(out[3]).toEqual([]);
  });

  it('allows a quarter off, and an actor waiting wholly off stage to enter', () => {
    expect(kinds(frame([char('moonface', -50, 300, 240)]))).toEqual([]); // about 21% off
    const waiting = frame([char('moonface', -400, 300, 240)]);
    expect(checkScene([waiting, waiting, waiting])).toEqual([[], [], []]);
  });

  it('applies to props, and not to the art of someone hidden (opacity 0)', () => {
    const p = frame([prop('kettle', 1100, 300, 200)]);
    expect(checkScene([p, p])[0][0].kind).toBe('offstage');
    const hidden = frame([char('moonface', -130, 300, 240, { opacity: 0 })]);
    expect(checkScene([hidden, hidden])).toEqual([[], []]);
  });

  it('is left alone when the camera is zoomed in (the edges cut people off on purpose)', () => {
    const f = { ...half, zoom: 1.9 };
    expect(checkScene([f, f])).toEqual([[], []]);
  });
});

describe('faces in the caption band', () => {
  it("flags a face reaching y 690 while a caption is showing, under the caption's width", () => {
    const f = frame([char('silky', 480, 560, 210)], { caption: caption() }); // face region is 560 to 655... box is 237 tall: 560 + 95 = 655
    expect(kinds(f)).toEqual([]);
    const low = frame([char('silky', 480, 620, 210)], { caption: caption() }); // 620 + 95 = 715
    const out = checkFrame(low);
    expect(out.map((i: { kind: string }) => i.kind)).toEqual(['caption']);
    expect(out[0].message).toMatch(/silky#1's face .* caption band, y 690\+/);
  });

  it('does not flag it with no caption showing, or when the face is beside the bubble', () => {
    expect(kinds(frame([char('silky', 480, 620, 210)]))).toEqual([]);
    expect(kinds(frame([char('silky', 10, 620, 150)], { caption: caption() }))).toEqual([]);
  });

  it('can be asked to assume a caption, and is not checked when zoomed in', () => {
    const low = frame([char('silky', 480, 620, 210)]);
    expect(checkFrame(low, { assumeCaption: true }).map((i: { kind: string }) => i.kind)).toEqual(['caption']);
    expect(checkFrame({ ...low, zoom: 1.5, caption: caption() })).toEqual([]);
  });

  it('is about characters: a prop in the band is fine', () => {
    expect(kinds(frame([prop('table', 400, 500, 300)], { caption: caption() }))).toEqual([]);
  });
});

describe('characters on top of each other', () => {
  it('flags more than 35% of the smaller one', () => {
    const f = frame([char('moonface', 300, 300, 240), char('silky', 380, 320, 200)]);
    const out = checkFrame(f);
    expect(out.map((i: { kind: string }) => i.kind)).toEqual(['overlap']);
    expect(out[0].message).toMatch(/moonface#1 and silky#1 overlap by \d+%/);
  });

  it('lets two stand close, and counts the smaller one: a small friend fully in front is flagged', () => {
    expect(kinds(frame([char('moonface', 300, 300, 240), char('silky', 500, 300, 200)]))).toEqual([]); // 40 px of 200 wide
    expect(kinds(frame([char('moonface', 300, 300, 300), char('silky', 380, 340, 100)]))).toEqual(['overlap']);
  });

  it('ignores two that are leaving together, bunched up mostly off the stage', () => {
    expect(kinds(frame([char('moonface', -200, 300, 240), char('saucepan', -190, 310, 230)]))).not.toContain('overlap');
  });

  it('ignores props and hidden characters', () => {
    expect(kinds(frame([char('moonface', 300, 300, 240), prop('kettle', 320, 340, 140)]))).toEqual([]);
    expect(kinds(frame([char('moonface', 300, 300, 240), char('silky', 300, 300, 240, { opacity: 0 })]))).toEqual([]);
  });
});

describe('a crowd', () => {
  const row = (n: number) => frame(Array.from({ length: n }, (_, i) => char(`c${i}`, 20 + i * 220, 300, 200)));

  it('is more than four characters on stage', () => {
    expect(kinds(row(4))).toEqual([]);
    expect(kinds(row(5))).toEqual(['crowd']);
  });

  it("doesn't count those waiting off stage or hidden", () => {
    const f = frame([...row(4).actors, char('late', -500, 300, 200), char('unseen', 500, 300, 200, { opacity: 0 })]);
    expect(kinds(f)).toEqual([]);
  });
});

describe('the speaker', () => {
  it('is fine on stage, and flagged off stage or invisible while the line is captioned', () => {
    const on = frame([char('silky', 480, 300, 210, { speaking: true })], { caption: caption() });
    expect(checkFrame(on)).toEqual([]);
    const gone = frame([char('silky', 1300, 300, 210, { speaking: true })], { caption: caption() });
    expect(checkFrame(gone).map((i: { kind: string }) => i.kind)).toEqual(['speaker']);
    const faded = frame([char('silky', 480, 300, 210, { speaking: true, opacity: 0 })], { caption: caption() });
    expect(checkFrame(faded)[0].message).toMatch(/silky#1 is speaking but is invisible/);
  });

  it('is only checked while the caption is on, and only for the actor being bobbed', () => {
    expect(checkFrame(frame([char('silky', 1300, 300, 210, { speaking: true })]))).toEqual([]);
    // A caption that lingers after its speaker has walked off is not a problem.
    expect(checkFrame(frame([char('silky', 1300, 300, 210)], { caption: caption() }))).toEqual([]);
  });
});

describe('a problem that lasts', () => {
  it('is reported once, at the first frame, with how long it lasts', () => {
    const crowd = frame(Array.from({ length: 5 }, (_, i) => char(`c${i}`, 20 + i * 220, 300, 200)));
    const calm = frame([char('moonface', 100, 300)]);
    const out = checkScene([calm, crowd, crowd, crowd, calm, crowd]);
    expect(out.map((r: unknown[]) => r.length)).toEqual([0, 1, 0, 0, 0, 1]);
    expect(out[1][0].message).toMatch(/and for 2 more frames/);
    expect(out[5][0].message).not.toMatch(/more frame/);
  });
});

describe('thresholds', () => {
  it('are the ones in the brief', () => {
    expect(THRESHOLDS).toMatchObject({ offstage: 0.25, face: 0.4, bandTop: 690, overlap: 0.35, maxCharacters: 4, invisible: 0.05 });
  });
});
