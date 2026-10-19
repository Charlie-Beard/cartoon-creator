# The house style

Every cartoon should feel like it came from the same little paper theatre
as his two games. This is what that means.

## Who is watching

**Jasper, 6.** Autistic, possibly ADHD. He watches on an iPad (11th gen)
held in landscape, usually on his own. He is only just reading, so the
captions are for a grown-up beside him or for later; **the voices carry
the story**.

He loves **the scary bits**: Dame Snap, Voldemort, being nearly caught.
Villains get real screen time and real menace, as cartoon paper
cut-outs. He also loves being the hero: characters talk to him by name
("{name}, can you help?") and his taps make things happen.

He likes knowing what's coming. Every episode has the same shape
(docs/WRITING.md), and the same friends behave the same way every time.

## Scary is fine, cruel isn't

| Fine | Never |
|---|---|
| Looming, shrieking, stomping, hissing, glaring | Anyone hit, slapped, kicked or hurt |
| Snapping rulers, slamming doors, locking cages | Blood, injury, death, "kill" |
| A chase, a near miss, hiding | Anyone lost for good |
| Someone captured and rescued later in the episode | A parent in real danger |
| A cliffhanger *inside* an episode | An episode that ends unresolved or frightening |
| A villain who is a bit ridiculous at the end | Mocking anyone for being small, slow or scared |
| Darkness, mist, thunder (as sound), shadows | Flashing lights, strobing, sudden full-screen white |

How to do a scary beat:

1. Build it with **sound first** (clack… clack… CLACK, `k.fx.stomp`,
   `k.silence()` then `k.music('spooky')`), then let the villain loom in
   slowly (`k.to(el, 1.2, { opacity: 1, y: 0 })`).
2. Push the camera in on them (`k.camera({ zoom: 1.3, x, y })`) for one
   or two lines at most.
3. **Cut back to the heroes**: wide shot, a brave line, a plan. The
   heroes are never helpless for long.
4. The villain's defeat is funny or fair (her ruler snaps, she stomps
   off in a huff, she's shut in her own cupboard), never violent.

The villains' rules, from the games:

- **Dame Snap** (Faraway): a towering headmistress with a ruler and a
  bun. She snaps rulers on desks, shouts, locks doors and stomps. She
  hates sums done well. She never touches a child.
- **Voldemort** (Hogwarts): pale, hissing, snake-like, in shadow. He
  threatens and looms; spells are beams of light that are blocked or
  bounce. Nobody is hurt.

## Look

- **Layered hand-torn paper** on parchment: flat muted colours, soft
  offset shadows, white fibres along torn edges. Everything is built from
  `piece()`, `ink()` and friends in `src/art/paper.ts`.
- Each paper piece is **drawn once and held still**. Life comes from
  smooth movement of whole pieces (hop, bob, sway) and named parts
  (blink, mouth, arms, wings), never from redrawing.
- **Palette** (`src/art/palette.ts`, the `C` object): muted construction
  paper. Each world has its own feel:
  - **Faraway:** forest greens, bark browns, dusk golds, cloud whites,
    with lurid accents in the lands (Topsy-Turvy green and pink; Dame
    Snap ink-black, chalk-white and ruler-red; Snow blue-white).
  - **Hogwarts:** night blues and candlelight, house colours as accents.
- **Andika** for all lettering (single-storey a and g).
- Faces are simple: dot eyes with a highlight, ink smiles, rosy cheeks.
  Characters are recognisable by silhouette, colour and one or two
  props (Moon-Face's round shining face; Hedwig's white feathers).
- **Original art only.** Fan versions in our own paper style: no film
  stills, logos, typefaces or actor likenesses.

## The bears

The `bears` world (Teddy Bear, Bear Cottage, the seaside) comes from a
1994 picture book the family loves, and the owner chose to match that
book's look rather than the paper theatre. It is the one world drawn this
way:

- **Watercolour and ink** on white paper (`src/art/watercolour.ts`): soft
  washes with a darker glaze pooled on the shadow side and a paler bloom
  where the light falls, a scratchy sepia pen line round everything,
  hatching for shade, fur drawn as little pen flicks.
- **Backdrops fade into the white page** at their edges, like the book's
  pictures (`pageNodes`). Skies are a blue wash thinning to white; clouds
  are the book's scalloped puffs with hatching under them.
- **Bears are whole small teddies** (a big round head, a stubby body),
  all built by one puppet (`bear()` in `src/worlds/bears/parts.ts`), told
  apart by their clothes: Teddy's red jumper with the yellow stripes is
  always the same.
- Our own drawings in that style: never a traced or scanned page.
- Everything else here still holds: drawn once and held still, smooth
  motion, no flashing, Andika, the same stage and caption band.
- The book's Bully Bear story has Captain Bear wanting to give Bully "a
  good spanking" and nearly throwing him: never. He roars and sends Bully
  off, and Bully comes back and says sorry.

## Composition

- The stage is **1180 × 820**. Captions sit in the band **y 690–800**:
  keep faces and anything important above y ≈ 660.
- The ground line in most backdrops is about **y 640** (each backdrop's
  `about` says). Portraits are **head and shoulders** (300 × 340 at
  natural size, no legs); most scenes use them at w 220–280. Stand them
  so their bottom edge sits on or a little below the ground line, or is
  hidden behind a table, desk or bush, with their top near y 330–380.
- Two to four actors on stage at once. More than four reads as clutter.
- The speaker faces the listener (`flip: true` to face left). Whoever
  talks should be easy to find: they bob while speaking.
- Use the camera for emphasis, not decoration: a push-in for a big
  moment, a pan to reveal, then back to wide.

## Motion

- Everything moves **smoothly**, eased gently in and out (GSAP through
  the kit). No `steps()` eases, no held frames, no boil.
- Entrances slide in with a little overshoot (`k.enter`), happy things
  hop, surprised things shake, magic things sparkle and puff.
- **Nothing flashes.** `k.glow` is a soft wash (capped at 60 %), lights
  breathe (`flicker`), they never blink.
- **During his turn** (`k.tapToHelp`), nothing in the background moves:
  the kit holds every idle loop still, and you must not start new
  motion until it resolves.
- Keep a calm beat between big moments: not everything bounces all the
  time.

## Sound

- **Music beds** set the mood for a scene: `k.music('cosy' | 'magic' |
  'spooky' | 'adventure' | 'sneaky' | 'triumph' | 'dreamy')`. They duck
  under speech and carry on across scene cuts. `k.silence()` before a
  scary entrance makes it land.
- **Story sounds** are synthesised (`k.fx.boing()`, `creak`, `knock`,
  `stomp`, `wind`, `twinkle`, `rumble`, `spell` …; see docs/KIT.md). A
  cartoon can make its own with `tone`, `noiseBurst` and `NOTE`, as the
  games' stories do. Soft and capped: no harsh buzzes.
- Every action that matters has a sound: a door creaks, a hop boings, a
  spell twinkles. It helps him follow without reading.

## Voice

- Every line has a speaker (`who`): `'narrator'` or a character id. Each
  character always has the same voice (`scripts/voice/cast.json`).
- Until a line is recorded with ElevenLabs, the iPad's own British voice
  reads it, so a new cartoon plays at once and is recorded later.
- **UK English**, short sentences, words a 6-year-old knows. Say it out
  loud: if it's hard to say, it's hard to hear.
- Characters stay in character: the Saucepan Man mishears, Moon-Face
  beams, Hagrid says "Blimey!", Hedwig hoots. Each world's notes (in
  `src/worlds/<id>/index.ts`) say how everyone talks.

## Designing for ADHD and autism

- **Predictable shape:** curtains, title, scenes, The End, back to the
  shelf. The same every time.
- **One thing at a time** on screen to look at. Actors who aren't in the
  beat stay still.
- **His turns are clear:** one glowing target, one spoken ask, big
  enough to hit (120 px or more). Never two targets at once.
- **No dead air and no rushing.** A beat of quiet after a big moment is
  good; ten seconds of nothing is not.
- Endings are warm and settled: everyone safe, a joke or a hug, a
  sparkle, The End.
