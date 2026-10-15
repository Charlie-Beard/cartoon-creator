/**
 * A world: one cast, its places and its things, ready for any cartoon set
 * there. Each world lives in src/worlds/<id>/ with an index.ts that calls
 * `defineWorld`, and is listed in src/worlds/index.ts.
 *
 * The `about` notes are written for whoever writes the next cartoon (most
 * often Claude, via the new-cartoon skill): who someone is, how they talk,
 * what they would never do. Keep them short and true to the books and films.
 *
 * All art is a function returning an SVG string, drawn from torn paper
 * (src/art/paper.ts). Nothing is drawn until it is needed.
 */

export interface CharacterDef {
  /** Shown on the caption's name tag ("Moon-Face"). */
  name: string;
  /**
   * The default portrait: an SVG, 300 × 340 (head and shoulders, or a
   * whole small creature), with the face inside the box 78 62 144 144
   * (the caption chip crops to it; see `chip`).
   */
  art: () => string;
  /** Other whole-body poses, swapped in with k.pose(el, 'name'): 'loom', 'point', 'fly' … */
  poses?: Record<string, () => string>;
  /**
   * The `data-part` groups in the art a script can animate with k.part():
   * 'mouth', 'mouthOpen', 'lids', 'armL', 'armR', 'wingL' … The kit uses
   * mouth/mouthOpen to talk and lids to blink.
   */
  parts?: string[];
  /** The caption chip's crop, an SVG viewBox. Default '78 62 144 144'. */
  chip?: string;
  /** Who they are, how they speak, what they would and wouldn't do. For writers. */
  about: string;
  /** How they sound: for picking an ElevenLabs voice (scripts/voice/cast.json). */
  voice: string;
}

export interface BackdropDef {
  /** The whole 1180 × 820 stage, as an SVG. Leave the bottom 130 px calm: captions sit there. */
  art: () => string;
  /** What it is and where the open floor is ("ground line at y 640; space for 3 actors"). */
  about: string;
}

export interface PropDef {
  /** An SVG, square unless `size` says otherwise. */
  art: () => string;
  /** Natural size on stage [w, h]. Default [120, 120]. */
  size?: [number, number];
  about: string;
}

export interface World {
  /** kebab-case, also the folder name. */
  id: string;
  /** "The Faraway Tree" */
  name: string;
  /** The world's colour: curtains, name tags, the shelf. A palette colour (src/art/palette.ts). */
  accent: string;
  /** Tone, setting and canon notes for writers: what this world is like, and its rules. */
  about: string;
  characters: Record<string, CharacterDef>;
  backdrops: Record<string, BackdropDef>;
  props: Record<string, PropDef>;
}

export const defineWorld = (w: World): World => w;
