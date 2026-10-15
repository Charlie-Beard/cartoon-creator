/**
 * Development-only art lab (lab.html): every world's art, for checking a
 * new character, pose, backdrop or prop by eye (and by screenshot).
 *
 *   /lab.html                              every world, every piece, small
 *   ?world=faraway                         one world
 *   ?world=faraway&set=chars|poses|backdrops|props
 *   &p=moonface,silky                      only these ids; &size=210 card width
 *   ?backdrop=meadow                       one backdrop at stage size (1180 × 820)
 *
 * Not part of the production build (vite.config.ts only builds index.html).
 */
import '@fontsource/andika/latin-400.css';
import '@fontsource/andika/latin-700.css';
import './styles/base.css';
import './styles/paper.css';
import './styles/lab.css';
import { installGrain } from './art/grain';
import { findBackdrop, WORLDS, type World } from './worlds';

installGrain();
const params = new URLSearchParams(location.search);
const worldId = params.get('world');
const set = params.get('set');
const only = params.get('p')?.split(',');
const size = Number(params.get('size') ?? 210);
const root = document.getElementById('lab')!;
document.body.classList.add('still');

const SETS = ['chars', 'poses', 'backdrops', 'props'] as const;

function nav(): string {
  const worlds = Object.keys(WORLDS)
    .map((w) => `<a href="?world=${w}" class="${w === worldId && !set ? 'on' : ''}">${w}</a>`)
    .join('');
  const sets = worldId ? SETS.map((s) => `<a href="?world=${worldId}&set=${s}" class="${s === set ? 'on' : ''}">${s}</a>`).join('') : '';
  return `<nav class="lab-nav"><a href="?" class="${!worldId ? 'on' : ''}">all</a>${worlds}${sets ? ' · ' + sets : ''}</nav>`;
}

/** A grid of cards, one per named picture. */
function grid(title: string, all: Record<string, () => string>, width = size): string {
  const names = Object.keys(all).filter((n) => !only || only.includes(n));
  if (!names.length) return '';
  return `<h2 class="lab-h">${title}</h2><div class="lab-grid">${names
    .map((n) => `<figure class="lab-card" data-id="${n}" style="width:${width}px">${all[n]()}<figcaption>${n}</figcaption></figure>`)
    .join('')}</div>`;
}

function world(w: World): string {
  const map = <T,>(o: Record<string, T>, f: (v: T) => () => string) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, f(v)]));
  const poses: Record<string, () => string> = {};
  for (const [id, c] of Object.entries(w.characters)) for (const [p, draw] of Object.entries(c.poses ?? {})) poses[`${id}:${p}`] = draw;
  const parts = [
    !set || set === 'chars' ? grid(`${w.name}: characters`, map(w.characters, (c) => c.art)) : '',
    !set || set === 'poses' ? grid(`${w.name}: poses`, poses) : '',
    !set || set === 'backdrops' ? grid(`${w.name}: backdrops`, map(w.backdrops, (b) => b.art), Math.max(size, 420)) : '',
    !set || set === 'props' ? grid(`${w.name}: props`, map(w.props, (p) => p.art), Math.min(size, 160)) : '',
  ];
  return parts.join('');
}

const backdrop = params.get('backdrop');
if (backdrop) {
  root.innerHTML = `<div class="lab-full">${findBackdrop(backdrop, worldId ?? undefined)?.art() ?? `No backdrop "${backdrop}"`}</div>`;
} else {
  const ws = worldId ? [WORLDS[worldId]].filter(Boolean) : Object.values(WORLDS);
  root.innerHTML = nav() + ws.map(world).join('');
}
