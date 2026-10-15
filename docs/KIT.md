# The kit

Everything a scene's `set` and `play` get as `k`. Source:
[`src/kit/kit.ts`](../src/kit/kit.ts). Import what a script needs from
`../kit`:

```ts
import { C, defineCartoon, piece, circle, svg, type Kit } from '../kit';
```

All coordinates are stage points on the **1180 × 820** stage, top-left
origin. Every `await` is safe to skip: if the player skips the scene, the
script simply stops where it was.

## Building a set

| Call | Does |
|---|---|
| `k.backdrop('meadow')` | Full-stage background by id (the cartoon's world first, then common, then any world) or any 1180 × 820 SVG string. Replaces the previous one. |
| `k.character('moonface', { x, y, w?, z?, flip?, pose? })` | A character from any world. Default w 260 (portraits are 300 × 340, so h ≈ w × 1.13). `pose` picks one of their poses. Returns the actor. |
| `k.pose(el, 'loom')` | Swaps a character's art for another pose in place (`'default'` for the portrait). |
| `k.prop('kettle', { x, y, w? })` | A prop by id. Default width from the prop's `size`. |
| `k.add(svgString, { x, y, w?, h?, z?, flip?, crop? })` | Any art as an actor (one-off art drawn in the cartoon file). `crop` is a viewBox to show part of it. |
| `k.face(el, flip)` | Turns an actor to face the other way. |
| `k.remove(el)` | Takes an actor off for good. |
| `k.set(el, vars)` | Sets GSAP properties at once: `{ opacity: 0 }` to hide someone who enters later, `{ rotation: -10 }`, `{ scale: 0.8 }`. |

**Stacking (`z`):** backdrop 0 · actors 10–29 (default 10; nearer is
higher) · ambient 30 · `dim` 33 · lights 35 · puffs 40 · beams 45 ·
sparkles 50 · confetti 55 · his-turn ring 60 · captions 70.

## Speech

| Call | Does |
|---|---|
| `await k.say('key', speaker?)` | Says the line (its own voice), shows the caption with the speaker's name tag, bobs `speaker` and moves their mouth. Resolves after the line and a 250 ms gap. |
| `k.caption(text, who?)` | A caption without speech; `''` hides it. |
| `k.talk(el)` | Bobs an actor as if talking; returns a stopper. (`say` does this for you.) |

Say lines while something happens:

```ts
await k.all(k.say('wheee', mf), k.to(mf, 1.5, { x: 400, y: 200 }));
```

## His turn

```ts
const how = await k.tapToHelp(target, { ask, nudge, helped, by, helper?, size? });
// how: 'tapped' | 'helped'
```

`by` says `ask`; a gold ring breathes round `target` (tap area at least
120 px, or `size`); all idle loops hold still. A tap: sparkle, and
`'tapped'`. No tap after ~9 s: `nudge` once. ~12 s more: `helped` (said by
`helper ?? by`), and `'helped'`. See docs/WRITING.md for good turns.

The target must be on stage and still. Don't start other movement until
it resolves. The ring is the target's size, capped at 260 px; pass
`size` to choose (a big cloud: `size: 300`). Either way it ends with a
sparkle on the target, tapped or helped.

## Movement

All return promises; `await` to wait, `void` to let it run alongside.

| Call | Does |
|---|---|
| `k.to(el, seconds, vars)` | Any smooth tween: `{ x, y, rotation, scale, opacity, ease }`. x/y are offsets from where the actor was placed (`'+=100'` for relative). Default ease `power2.inOut`. |
| `k.enter(el, 'left' \| 'right' \| 'top' \| 'bottom', s=0.7)` | Slides in from off stage to its place, with a little overshoot. |
| `k.exit(el, side, s=0.6)` | Slides off stage. |
| `k.walk(el, dx, s=1, hops=4)` | Moves by dx along a hopping path. |
| `k.hop(el, height=50, times=1)` | A happy jump. |
| `k.shake(el, amount=10, times=3)` | Surprise, fear, giggling. |
| `k.spin(el, turns=1, s=0.8)` | Whole turns. |
| `k.pop(el, amount=1.15)` | Squash-and-stretch (something lands). |
| `k.appear(el)` / `k.vanish(el)` | Grow in from nothing / shrink away and remove. |
| `k.fade(el, to, s=0.5)` | Opacity. |
| `k.float(el, amount=8, period=2)` | Idle bobbing until the scene ends (holds still during his turn). |
| `k.quake(amount=8)` | Gentle shake of the whole stage (a stomp, a crash). |
| `k.wait(ms)` | A pause. |
| `k.all(...promises)` | Waits for all of them. |

**Parts:** characters have named parts (`data-part`), listed in their
world: `mouth`, `mouthOpen`, `lids`, `armL`, `armR`, `wingL` …

```ts
const [arm] = k.pivot(k.part(mf, 'armR'));      // turn about the shoulder
await k.to(arm, 0.3, { rotation: -40, yoyo: true, repeat: 3 });
await k.blink(mf);
```

Rotate parts with `rotation` after `k.pivot`, never with an SVG
`rotate()` string. `k.pivot` sets each part's joint once; calling it
again on the same part is safe.

## Effects

| Call | Does |
|---|---|
| `k.sparkle(x, y, count=14, spread=160)` | A burst of paper stars. |
| `k.puff(x, y, size=160, colour?)` | A puff of paper smoke (appear, vanish, crash). |
| `k.confetti(count=30)` | Confetti from the top (the happy ending). |
| `await k.glow(colour?, strength=0.5, s=0.8)` | A soft wash of light in and out (capped at 0.6). Never a strobe. |
| `await k.beam([x, y], [x, y], colour?)` | A magic beam between two points, sparkling where it lands. |

## Atmosphere

| Call | Does |
|---|---|
| `k.music(mood)` | Starts a music bed: `'cosy' 'magic' 'spooky' 'adventure' 'sneaky' 'triumph' 'dreamy'`. Ducks under speech; carries on across scene cuts. |
| `k.silence()` | Fades the music out (before a scary entrance, for a quiet beat). |
| `k.ambient(kind, { count?, z?, area? })` | Slow looping `'dust' 'fireflies' 'snow' 'rain' 'bubbles' 'embers' 'stars'`. `area` is `[x, y, w, h]`. |
| `k.light(x, y, radius, { colour?, strength?, flicker?, z? })` | A soft pool of light (lamp, moon, window). `flicker` breathes, never flashes. |
| `k.dim(amount=0.35, colour?)` | A veil for night or gloom (under lights). Returns it: fade it to change the mood. |

## Camera

```ts
await k.camera({ zoom: 1.4, x: 700, y: 360 }, 1.4);  // push in on a point
await k.camera({});                                     // back to the wide shot
```

The edges never show. Use it for emphasis: a push-in on a villain, a
reveal. Keep captions in mind: zooming doesn't move them.

## Cuts

`await k.cut(() => { /* build the new set */ })`: a paper sheet sweeps
across, the world is cleared, the new set is built underneath, the sheet
sweeps away. The player does this between scenes; use it inside a scene
for a quick change of place. `k.clear()` empties the world without a wipe.

## Sounds

`k.sfx` (UI and magic): `tap`, `sparkle`, `success`, `fanfare`, `hoot`,
`whoosh`, `page`, `gem`, `reveal`, `ominous`, `shield`, `thunder`, `zap`,
`darkZap`, `block`, `boom`, `crackle(s)`, `triumph`, `rustle`, `wrong`
(never for him: a villain's spell fizzling at most).

`k.fx` (story sounds): `boing`, `thud`, `pop`, `whizz`, `splash`,
`bubbles(n)`, `creak`, `knock(n)`, `patter(steps)`, `stomp(steps)`,
`poof`, `wind(s)`, `twinkle`, `fizzle`, `jingle`, `uhoh`, `sneak`,
`drumroll(s)`, `crash`, `rumble(s)`, `spell`.

Your own, in the cartoon file:

```ts
import { NOTE, noiseBurst, now, tone } from '../kit';

/** The kettle whistling: a rising, breathy whistle. */
function whistle(): void {
  const t = now();
  tone(NOTE.C5, t, { wave: 'sine', peak: 0.08, attack: 0.3, decay: 1.2, glideTo: NOTE.G5, vibrato: [6, 8] });
  noiseBurst(t, { freq: 3000, q: 4, peak: 0.03, attack: 0.3, decay: 1 });
}
```

## Drawing one-off art

Art only this cartoon needs (a lost kettle, a special door) is drawn in
the cartoon file with the paper engine and added with `k.add`:

```ts
import { C, cached, circle, ellipse, group, ink, piece, rect, svg } from '../kit';

/** Saucepan's kettle: round, dented, with a curly spout. 160 × 140. */
const kettle = cached(() =>
  svg({ w: 160, h: 140, name: 'lost-kettle-kettle' }, [
    piece(ellipse(80, 86, 56, 44), C.stoneLight),
    piece(rect(64, 30, 32, 14, 4), C.stone),
    group({ part: 'lid', origin: [80, 40] }, [piece(ellipse(80, 40, 30, 10), C.stone)]),
    ink([[130, 70], [150, 50], [156, 30]], { width: 6, color: C.stone }),
  ]),
);
```

Name every `svg()` uniquely (`'<cartoon-id>-<thing>'`): the name seeds
the tearing, so the same name always draws the same paper. Anything a
second cartoon could use belongs in the world instead (new-character,
new-backdrop skills). Paper primitives: `piece(outline, fill, { edge,
rough, shadow, fibre })`, outlines `rect`, `circle`, `ellipse`, `poly`,
`curve`, `band`; `ink(points, { width, color })`; `dot`; `group({ part,
origin }, children)`; `raw(svgMarkup)`.

## Facts worth knowing

- **While someone speaks, move them only in x.** `say` bobs the speaker
  with `y` and `rotation`; a tween on those at the same time fights it.
  Hop or tilt them before or after the line, or move an actor that
  isn't speaking.
- **Lights sit above actors** (z 35), so a window's light glows over
  anyone standing in front of it. Pass a lower `z` (e.g. 5) for a light
  that belongs to the backdrop.
- **A `flicker` light can't be faded** (its breathing loop owns its
  opacity). Make lights you will fade without `flicker`, or `k.remove`
  the flickering one.
- **Poses mirror** with `flip` like portraits (Dame Snap's `loom` facing
  left: `{ pose: 'loom', flip: true }`).
- **Starting a scene zoomed in:** in `set`, `void k.camera({ zoom, x, y }, 0)`.
- `?cartoon=<id>&scene=<n>` counts scenes **from 0**.

- `set` must not await anything; it runs hidden behind the curtain or
  wipe.
- `k.world` is the cartoon's world; `k.name` is the child's name.
- Characters from another world can visit: `k.character('hedwig', …)` works
  in a Faraway cartoon.
- Tweens started with `void` keep going after the line; kill or finish
  them before the scene ends if they matter.
- Dev: `?cartoon=<id>&scene=<n>` starts at scene n.
