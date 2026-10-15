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
  /**
   * Which backdrop to show on the shelf card, by id (looked up in the
   * cartoon's world first, then the common world). Optional: the library
   * falls back to the world's first backdrop. Pick one that shows the
   * cartoon's best-known place.
   */
  thumb?: string;
  load: () => Promise<{ default: Cartoon }>;
}

export const SHELF: ShelfEntry[] = [
  {
    id: 'whistling-kettle',
    title: 'The Whistling Kettle',
    world: 'faraway',
    summary: 'The Saucepan Man’s whistling kettle has gone, and Dame Snap has it. Jasper blows away a cloud, then taps the kettle until it whistles so loudly that her ruler snaps.',
    thumb: 'moon-room',
    load: () => import('./whistling-kettle'),
  },
];

export const shelfEntry = (id: string): ShelfEntry | undefined => SHELF.find((c) => c.id === id);
