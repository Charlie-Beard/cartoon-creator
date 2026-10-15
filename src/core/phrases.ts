/**
 * Spoken-text helpers shared by the kit, the voice and the voice scripts:
 * filling in the child's name, and the stable ids recordings are saved under.
 */

/** The player's name. Lines may contain {name}. */
export const DEFAULT_NAME = 'Jasper';

/** A line with the child's name in it. */
export function personalise(text: string, name: string): string {
  const n = name.trim();
  return n ? text.split('{name}').join(n) : generic(text);
}

/**
 * The same line without a name. A name that only calls him is left out
 * ("Well done, {name}!" → "Well done!"); one that's part of the sentence
 * becomes "you" ("{name} won the seal!" → "You won the seal!"). This is
 * also what's said, from the recording, when he has a name other than the
 * recorded DEFAULT_NAME.
 */
export function generic(text: string): string {
  const t = text
    .replace(/,\s*\{name\}(?=[!?.…,:]|$)/g, '')
    .replace(/(^|[.!?…]\s+)\{name\},\s*/g, '$1')
    .replace(/(^|[.!?…]\s+)\{name\}/g, '$1You')
    .replace(/\{name\}/g, 'you')
    .replace(/\s+([!?.…])/g, '$1');
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** Stable id for any spoken line, used as its audio file name. */
export function lineId(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

/**
 * Id of a line said in a speaker's voice. The same words can be said by
 * two characters ("Hooray!"), so a character's id includes who says it;
 * the narrator's is just the text's.
 */
export function voiceId(text: string, who = 'narrator'): string {
  return lineId(who === 'narrator' ? text : `${who}|${text}`);
}
