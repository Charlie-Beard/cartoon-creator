/**
 * The shelf's shared shape, used by the library (src/cartoons/index.ts,
 * through Vite) and by the scripts and tests (scripts/lib/shelf.ts, from
 * the files on disk). Pure: no DOM.
 *
 * Every cartoon is a folder, src/cartoons/<id>/, holding:
 *
 *   meta.ts     defineMeta({ id, title, world, summary, thumb?, added })
 *   cartoon.ts  defineCartoon({ ...meta, lines, scenes })
 *   *.ts        anything else it wants (its own art, its own sounds)
 *
 * Nothing else lists the cartoons: a new folder is on the shelf, so two
 * cartoons made at the same time never touch the same file.
 */
import type { CartoonInfo } from '../core/cartoon';
import type { Cartoon } from '../kit/cartoon';

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
}

export interface ShelfEntry extends CartoonMeta {
  load: () => Promise<{ default: Cartoon }>;
}

export const defineMeta = (m: CartoonMeta): CartoonMeta => m;

/** Newest first (so a new cartoon is on the first page), then by title. */
export function sortShelf<T extends CartoonMeta>(entries: T[]): T[] {
  return entries.sort((a, b) => b.added.localeCompare(a.added) || a.title.localeCompare(b.title));
}
