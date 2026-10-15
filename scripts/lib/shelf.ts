/**
 * The shelf for scripts and Playwright (no Vite here, so no
 * import.meta.glob): every src/cartoons/<id>/ folder with a meta.ts, read
 * from disk, in the library's order. See src/cartoons/shelf.ts.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { sortShelf, type CartoonMeta, type ShelfEntry } from '../../src/cartoons/shelf';

export const CARTOONS_DIR = fileURLToPath(new URL('../../src/cartoons/', import.meta.url));

const folders = readdirSync(CARTOONS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(CARTOONS_DIR, d.name, 'meta.ts')))
  .map((d) => d.name);

export const SHELF: ShelfEntry[] = sortShelf(
  await Promise.all(
    folders.map(async (dir) => {
      const meta = (await import(pathToFileURL(join(CARTOONS_DIR, dir, 'meta.ts')).href)).default as CartoonMeta;
      return { ...meta, load: () => import(pathToFileURL(join(CARTOONS_DIR, dir, 'cartoon.ts')).href) };
    }),
  ),
);

/** The folder a cartoon lives in (named after its id). */
export const folderOf = (id: string): string => join(CARTOONS_DIR, id);

/** Every .ts file in a cartoon's folder, joined: what the checks read for line keys and ids. */
export function sourceOf(id: string): string {
  const dir = folderOf(id);
  return readdirSync(dir)
    .filter((f) => f.endsWith('.ts'))
    .sort()
    .map((f) => readFileSync(join(dir, f), 'utf8'))
    .join('\n');
}
