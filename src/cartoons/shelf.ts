/**
 * The shelf's shared shape, used by the library (src/cartoons/index.ts,
 * through Vite) and by the scripts and tests (scripts/lib/shelf.ts, from
 * the files on disk). Pure: no DOM.
 *
 * Every cartoon is a folder, src/cartoons/<id>/, holding:
 *
 *   meta.ts     defineMeta({ id, title, world, summary, thumb?, added, ledger })
 *   cartoon.ts  defineCartoon({ ...meta, lines, scenes })
 *   *.ts        anything else it wants (its own art, its own sounds)
 *
 * Nothing else lists the cartoons: a new folder is on the shelf, so two
 * cartoons made at the same time never touch the same file.
 */
import type { CartoonInfo } from '../core/cartoon';
import type { Cartoon } from '../kit/cartoon';

/**
 * The episode ledger: what an episode was about, one short line per field,
 * so the series doesn't repeat itself. A writer reads everyone's ledger
 * before planning (`npm run check -- --ledger`), and `npm run check -- <id>`
 * warns when a new episode is much like a recent one. It is metadata only:
 * nothing at runtime reads it.
 *
 * Word things the same way each time (the same joke in the same words), so
 * the comparison can see they are the same.
 */
export interface Ledger {
  /** One line: what goes wrong ("the Saucepan Man's kettle is gone, and Dame Snap has it"). */
  problem: string;
  /** A character id ('dameSnap'), or a gentler danger in words ('a storm'). Leave out if there is none. */
  villain?: string;
  /** Backdrop ids, the MAIN place first (where the problem is faced), then the others in the order we visit them. */
  places: string[];
  /** Character ids who appear (drawn or speaking). */
  cast: string[];
  /** One short phrase per tapToHelp, for what he does: 'blow the cloud away'. */
  turns: string[];
  /** Running jokes used, short and always worded the same: 'Saucepan Man mishears'. */
  jokes?: string[];
  /** How it ends, in a word or two: 'tea party', 'cosy', 'funny'. */
  ending: string;
}

export interface CartoonMeta extends CartoonInfo {
  /**
   * Which backdrop to show on the shelf card, by id (looked up in the
   * cartoon's world first, then the common world). Optional: the library
   * falls back to the world's first backdrop. Pick one that shows the
   * cartoon's best-known place.
   */
  thumb?: string;
  /** The day it was made, 'YYYY-MM-DD'. The newest cartoons come first on the shelf. */
  added: string;
  /**
   * What the episode was about (see Ledger). Optional in the type so older
   * metas still load, but `npm run check` reports a cartoon without one as an error.
   */
  ledger?: Ledger;
}

export interface ShelfEntry extends CartoonMeta {
  load: () => Promise<{ default: Cartoon }>;
}

export const defineMeta = (m: CartoonMeta): CartoonMeta => m;

/** Newest first (so a new cartoon is on the first page), then by title. */
export function sortShelf<T extends CartoonMeta>(entries: T[]): T[] {
  return entries.sort((a, b) => b.added.localeCompare(a.added) || a.title.localeCompare(b.title));
}
