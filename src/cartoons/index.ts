/**
 * The shelf: every cartoon, in the order they appear in the library.
 * Append-only (one entry per cartoon) so parallel PRs stay mergeable.
 *
 * The title, world and summary are written here as well as in the
 * cartoon's own file, so the library can show the shelf without loading
 * every script; tests/unit/cartoons.test.ts checks they agree.
 */
import type { CartoonInfo } from '../core/cartoon';
import type { Cartoon } from '../kit';

export interface ShelfEntry extends CartoonInfo {
  load: () => Promise<{ default: Cartoon }>;
}

export const SHELF: ShelfEntry[] = [];

export const shelfEntry = (id: string): ShelfEntry | undefined => SHELF.find((c) => c.id === id);
