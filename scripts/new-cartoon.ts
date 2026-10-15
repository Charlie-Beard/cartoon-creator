/**
 * Starts a new cartoon from the templates:
 *
 *   npm run new -- <id> <world>      e.g. npm run new -- lost-wand hogwarts
 *
 * Makes src/cartoons/<id>/ with meta.ts and cartoon.ts filled in with the
 * id, world and today's date. The folder is on the shelf at once (nothing
 * else lists cartoons); fill in the title, summary, thumb, the ledger (what
 * the episode is about, so the series doesn't repeat itself) and the script.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isKebab } from '../src/core/cartoon';
import { WORLDS } from '../src/worlds';
import { folderOf } from './lib/shelf';

const [id, world] = process.argv.slice(2);
if (!id || !world) {
  console.error('Usage: npm run new -- <id> <world>');
  process.exit(1);
}
if (!isKebab(id)) {
  console.error(`"${id}" is not kebab-case (lost-wand, whistling-kettle …)`);
  process.exit(1);
}
if (!(world in WORLDS)) {
  console.error(`No world "${world}". Worlds: ${Object.keys(WORLDS).join(', ')}`);
  process.exit(1);
}
const dir = folderOf(id);
if (existsSync(dir)) {
  console.error(`src/cartoons/${id}/ already exists`);
  process.exit(1);
}

const templates = fileURLToPath(new URL('../templates/cartoon/', import.meta.url));
const today = new Date().toISOString().slice(0, 10);
const fill = (s: string) => s.replaceAll('<id>', id).replaceAll('<world>', world).replaceAll('<YYYY-MM-DD>', today);
mkdirSync(dir, { recursive: true });
for (const f of ['meta.ts', 'cartoon.ts']) writeFileSync(join(dir, f), fill(readFileSync(join(templates, f), 'utf8')));
console.log(`Made src/cartoons/${id}/ (meta.ts, cartoon.ts). Fill in the title, summary, thumb, ledger and the script.`);
console.log('Before planning, read what the other episodes were about: npm run check -- --ledger');
console.log(`Backdrops in ${world}: ${Object.keys(WORLDS[world].backdrops).join(', ')}`);
