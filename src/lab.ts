/**
 * Development-only art lab (lab.html): every world's art, for checking a
 * new character, pose, backdrop or prop by eye (and by screenshot).
 *
 *   /lab.html                              every world, every piece, small
 *   ?world=faraway                         one world
 *   ?world=faraway&set=chars|poses|backdrops|props
 *   &p=moonface,silky                      only these ids (a character's id picks all their poses); &size=210 card width
 *   &talk=1                                each character and pose twice: as drawn, and talking
 *                                          and blinking (mouthOpen and lids shown, mouth hidden)
 *   ?backdrop=meadow                       one backdrop at stage size (1180 × 820)
 *   &with=mollie,peter&ground=640&w=230    ...with these characters standing on it, spread
 *                                          across, feet on the ground line (default: the one
 *                                          its `about` gives, else 640), the line drawn in
 *
 * Not part of the production build (vite.config.ts only builds index.html).
 */
import '@fontsource/andika/latin-400.css';
import '@fontsource/andika/latin-700.css';
import './styles/base.css';
import './styles/paper.css';
import './styles/lab.css';
import { installGrain } from './art/grain';
import { findBackdrop, findCharacter, WORLDS, type World } from './worlds';

installGrain();
const params = new URLSearchParams(location.search);
const worldId = params.get('world');
const set = params.get('set');
const only = params.get('p')?.split(',');
const size = Number(params.get('size') ?? 210);
/** Show each character and pose again with its mouth open and lids shut, to check those parts without editing them. */
const talk = params.get('talk') === '1';
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
  // A pose card is "<character>:<pose>": &p=<character> picks all of theirs.
  const names = Object.keys(all).filter((n) => !only || only.includes(n) || only.includes(n.split(':')[0]));
  if (!names.length) return '';
  const card = (n: string, art: string, label: string, cls = '') => `<figure class="lab-card${cls}" data-id="${n}" style="width:${width}px">${art}<figcaption>${label}</figcaption></figure>`;
  const isFigure = title.endsWith(': characters') || title.endsWith(': poses');
  return `<h2 class="lab-h">${title}</h2><div class="lab-grid">${names
    .map((n) => card(n, all[n](), n) + (talk && isFigure ? card(n, all[n](), `${n} talking, blinking`, ' lab-talk') : ''))
    .join('')}</div>`;
}

/** Props at their natural size (from `size`, default 120), so wide strips and big props read as they will on stage. */
function props(w: World): string {
  const ids = Object.keys(w.props).filter((n) => !only || only.includes(n));
  if (!ids.length) return '';
  return `<h2 class="lab-h">${w.name}: props</h2><div class="lab-grid">${ids
    .map((n) => {
      const p = w.props[n];
      const width = Math.min(p.size?.[0] ?? 120, 1180);
      return `<figure class="lab-card" data-id="${n}" style="width:${Math.max(width, 120)}px">${p.art()}<figcaption>${n}</figcaption></figure>`;
    })
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
    !set || set === 'props' ? props(w) : '',
  ];
  return parts.join('');
}

/**
 * Characters standing on a backdrop, spread evenly across it with their feet
 * on the ground line, the line drawn in: is there room, do they read against
 * it, where is the floor? (Without a scratch cartoon and a shots run.)
 */
function standing(about: string): string {
  const ids = params.get('with')?.split(',').filter(Boolean) ?? [];
  if (!ids.length) return '';
  const said = /ground(?: line)?[^\d]{0,24}(\d{3})/i.exec(about)?.[1];
  const ground = Number(params.get('ground') ?? said ?? 640);
  const w = Number(params.get('w') ?? 230);
  const people = ids.map((id, i) => {
    const art = findCharacter(id)?.art() ?? '';
    const vb = /viewBox="[\d.-]+ [\d.-]+ ([\d.]+) ([\d.]+)"/.exec(art);
    const h = vb ? (w * +vb[2]) / +vb[1] : (w * 340) / 300;
    const cx = (1180 * (i + 1)) / (ids.length + 1);
    return `<div class="lab-stand" style="left:${cx - w / 2}px;top:${ground - h}px;width:${w}px;height:${h}px">${art || `No character "${id}"`}</div>`;
  });
  return `<div class="lab-ground" style="top:${ground}px"><span>ground ${ground}</span></div>${people.join('')}`;
}

const backdrop = params.get('backdrop');
if (backdrop) {
  const b = findBackdrop(backdrop, worldId ?? undefined);
  root.innerHTML = `<div class="lab-full">${b?.art() ?? `No backdrop "${backdrop}"`}${b ? standing(b.about) : ''}</div>`;
} else {
  const ws = worldId ? [WORLDS[worldId]].filter(Boolean) : Object.values(WORLDS);
  root.innerHTML = nav() + ws.map(world).join('');
}
