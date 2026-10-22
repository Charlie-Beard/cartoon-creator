/**
 * The shelf: every cartoon in src/cartoons/<id>/, found by Vite, newest
 * first. Only the small meta.ts files are in the main bundle; each
 * cartoon's script loads when it is played. (The scripts and tests find
 * the same folders on disk: scripts/lib/shelf.ts.)
 */
import type { Cartoon } from '../kit/cartoon';
import { showing, sortShelf, type CartoonMeta, type ShelfEntry } from './shelf';

export { defineMeta, type CartoonMeta, type ShelfEntry } from './shelf';

const metas = import.meta.glob<CartoonMeta>('./*/meta.ts', { eager: true, import: 'default' });
const scripts = import.meta.glob<{ default: Cartoon }>('./*/cartoon.ts');

/** Every cartoon, shown or not: what the tests go through. */
export const ALL_CARTOONS: ShelfEntry[] = sortShelf(
  Object.entries(metas).map(([path, meta]) => ({ ...meta, load: scripts[path.replace(/meta\.ts$/, 'cartoon.ts')] })),
);

/** What he sees: only the cartoons a grown-up has picked, when they have (shelf.ts, SHOWING). */
export const SHELF: ShelfEntry[] = showing(ALL_CARTOONS);

export const shelfEntry = (id: string): ShelfEntry | undefined => SHELF.find((c) => c.id === id);
