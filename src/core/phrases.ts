/**
 * Spoken-text helpers shared by the voice and the voice scripts:
 * the stable ids recordings are saved under.
 */

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
