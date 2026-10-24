/**
 * A cheat sheet of a world, for whoever is about to write a cartoon there.
 *
 *   npm run catalogue -- --list                  # the worlds
 *   npm run catalogue -- faraway                 # everything a writer needs, compact
 *   npm run catalogue -- faraway characters      # one section: about | characters | backdrops | props | moves | pieces | kit
 *   npm run catalogue -- faraway --id saucepan   # one entry in full (a character, backdrop, prop, sound, move or set piece)
 *   npm run catalogue -- faraway pieces --id snapLoom   # a set piece's whole doc comment, usage example included
 *   npm run catalogue -- faraway --no-common     # leave out the "common" world's items
 *   npm run catalogue -- faraway --brief         # first sentence of every note: the smallest sheet
 *   npm run catalogue -- faraway --full          # nothing trimmed
 *
 * Why it exists: src/worlds/<id>/index.ts and moves.ts run to 45 KB or more
 * (art imports, drawing glue and long notes), and reading them is what a
 * writer spent the most tokens on. This prints only what a script can use:
 * ids, poses, parts, sizes, the notes, and the sounds and moves with their
 * signatures and one-line docs. The set pieces (src/worlds/<id>/pieces.ts,
 * 10-30 KB each) are shown the same way: name, parts with their options, and
 * the opening of the doc comment; `--id <piece>` gives all of it.
 *
 * Ids, poses, parts, sizes and notes come from the loaded worlds
 * (src/worlds). Signatures and doc comments do not exist at run time, so
 * they are read from the source text with the TypeScript compiler (parsing
 * only, nothing is type-checked or run). `catalogueText` is pure apart from
 * reading those files, so tests/unit/catalogue.test.ts can call it.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';
import { WORLDS } from '../src/worlds';
import type { BackdropDef, CharacterDef, PropDef, World } from '../src/worlds';

// ------------------------------------------------------------------ options

export type Mode = 'brief' | 'normal' | 'full';
export const SECTIONS = ['about', 'characters', 'backdrops', 'props', 'moves', 'pieces', 'kit'] as const;
export type Section = (typeof SECTIONS)[number];

export interface CatalogueOptions {
  /** Only this section. Default: all of them. */
  section?: Section;
  /** One entry in full: a character, backdrop, prop, sound, move, set piece or kit sound. */
  id?: string;
  /** Include the common world's backdrops, props, moves and set pieces. Default true. */
  common?: boolean;
  /** How much of each note to keep. Default 'normal'. */
  mode?: Mode;
}

/** How many characters of each kind of note to keep (Infinity: all of it). */
interface Budget {
  world: number;
  about: number;
  voice: number;
  backdropLead: number;
  backdropTail: number;
  prop: number;
  doc: number;
  /** Does the kit's sound list keep its one-line descriptions? */
  kitDocs: boolean;
  /** How much of a set piece's doc comment to keep (0: names and parts only, an index). */
  piece: number;
  /** Do a piece's parts keep their one-line descriptions? */
  partDocs: boolean;
}

const BUDGETS: Record<Mode, Budget> = {
  // brief is an index: who and what exists, so a writer can ask for the few entries they will use (--id).
  brief: { world: 260, about: 130, voice: 0, backdropLead: 70, backdropTail: 60, prop: 0, doc: 100, kitDocs: false, piece: 0, partDocs: false },
  normal: { world: 400, about: 450, voice: 130, backdropLead: 150, backdropTail: 330, prop: 170, doc: 260, kitDocs: true, piece: 150, partDocs: false },
  full: { world: Infinity, about: Infinity, voice: Infinity, backdropLead: Infinity, backdropTail: Infinity, prop: Infinity, doc: Infinity, kitDocs: true, piece: Infinity, partDocs: true },
};

// -------------------------------------------------------------- text helpers

const squash = (s: string): string => s.replace(/\s+/g, ' ').trim();

/** Cuts at a word or clause boundary, with an ellipsis, to at most about `n` characters. */
function cut(s: string, n: number): string {
  s = squash(s);
  if (s.length <= n) return s;
  let head = s.slice(0, n);
  const at = Math.max(head.lastIndexOf(', '), head.lastIndexOf('; '), head.lastIndexOf(': '), head.lastIndexOf(' '));
  if (at > n * 0.6) head = head.slice(0, at);
  return `${head.replace(/[\s,;:(-]+$/, '')}…`;
}

/**
 * Splits at the end of a sentence, but never inside a spoken line: in
 * `"Did somebody say socks? Leave them to me!"` the question mark stays put.
 */
function sentences(text: string): string[] {
  const s = squash(text);
  const out: string[] = [];
  let quoted = false;
  let start = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i] ?? '';
    if (ch === '"') quoted = !quoted;
    if (!/[.!?]/.test(ch) || quoted) continue;
    let j = i + 1;
    while (j < s.length && /["')”]/.test(s[j] ?? '')) {
      if (s[j] === '"') quoted = !quoted;
      j++;
    }
    if (quoted || s[j] !== ' ') continue;
    if (!/^[A-Z`"'(“]/.test(s.slice(j + 1, j + 2))) continue;
    out.push(s.slice(start, j));
    start = j + 1;
    i = j;
  }
  out.push(s.slice(start));
  return out.filter(Boolean);
}

/**
 * Shortens a note to about `budget` characters by whole sentences: the first
 * one always, then any that name a `part` or say "never" (how to use someone,
 * and what they must not do), then the rest in order while they fit. What is
 * left out is marked with an ellipsis.
 */
function condense(text: string, budget: number): string {
  const t = squash(text);
  if (t.length <= budget) return t;
  const ss = sentences(t);
  const first = ss[0] ?? t;
  // A short budget is for an index: the opening sentence says who or what it is.
  if (first.length >= budget || budget < 200) return first.length >= budget ? cut(first, budget) : `${first} …`;
  const keep = new Set<number>([0]);
  let used = first.length;
  const fits = (i: number): boolean => used + 1 + (ss[i]?.length ?? 0) <= budget;
  const take = (i: number): void => {
    keep.add(i);
    used += 1 + (ss[i]?.length ?? 0);
  };
  for (let i = 1; i < ss.length; i++) if (/`|\bnever\b/i.test(ss[i] ?? '') && fits(i)) take(i);
  for (let i = 1; i < ss.length; i++) if (!keep.has(i) && fits(i)) take(i);
  const out = ss.filter((_, i) => keep.has(i)).join(' ');
  return keep.size < ss.length ? `${out} …` : out;
}

/** The world's first paragraph: what it is, in a line or two. The rest is `about`. */
function headline(text: string, budget: number): string {
  return condense(text.trim().split(/\n/)[0] ?? text, budget);
}

/** ElevenLabs settings ("(speed 0.9, stability 0.4)") are for the recording script, not a writer. */
const plainVoice = (v: string): string =>
  squash(v).replace(/\s*\((?:[^()]*?\b)?(?:speed|stability)\b[^()]*\)/gi, '').replace(/\s+([.;,])/g, '$1');

// ----------------------------------------------------- sounds and moves (source)

/** A sound or move found in a moves.ts (or the kit's fx/sfx): how to call it and what it is for. */
export interface Member {
  name: string;
  /** Parameters as written, without the kit and without `: HTMLElement` ("el, on: boolean"). */
  params: string;
  doc: string;
}

const root = (rel: string): string => fileURLToPath(new URL(`../${rel}`, import.meta.url));

function readSource(file: string): ts.SourceFile | undefined {
  try {
    return ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS);
  } catch {
    return undefined;
  }
}

/** The text of the last `/** … *\/` comment before a node, on one line. */
function docOf(sf: ts.SourceFile, node: ts.Node): string {
  const ranges = ts.getLeadingCommentRanges(sf.text, node.getFullStart()) ?? [];
  for (let i = ranges.length - 1; i >= 0; i--) {
    const r = ranges[i];
    if (!r) continue;
    const raw = sf.text.slice(r.pos, r.end);
    if (!raw.startsWith('/**')) continue;
    return squash(raw.replace(/^\/\*\*/, '').replace(/\*\/$/, '').replace(/^\s*\*\s?/gm, ' '));
  }
  return '';
}

function paramText(sf: ts.SourceFile, p: ts.ParameterDeclaration): string {
  return squash(p.getText(sf)).replace(/:\s*HTMLElement\b(?!\[)/, '');
}

/** Finds `export const <name> = { … }` and lists its members with docs. */
function objectMembers(sf: ts.SourceFile, name: string): Member[] {
  const out: Member[] = [];
  for (const st of sf.statements) {
    if (!ts.isVariableStatement(st)) continue;
    for (const d of st.declarationList.declarations) {
      if (!ts.isIdentifier(d.name) || d.name.text !== name || !d.initializer) continue;
      let init: ts.Expression = d.initializer;
      while (ts.isAsExpression(init) || ts.isSatisfiesExpression(init) || ts.isParenthesizedExpression(init)) init = init.expression;
      if (!ts.isObjectLiteralExpression(init)) continue;
      for (const m of init.properties) {
        if (!m.name || !(ts.isIdentifier(m.name) || ts.isStringLiteral(m.name))) continue;
        let params: readonly ts.ParameterDeclaration[] = [];
        if (ts.isMethodDeclaration(m)) params = m.parameters;
        else if (ts.isPropertyAssignment(m) && (ts.isArrowFunction(m.initializer) || ts.isFunctionExpression(m.initializer))) params = m.initializer.parameters;
        // The kit comes first in every move: it is in the header, not in each line.
        const rest = params.filter((p, i) => !(i === 0 && ts.isIdentifier(p.name) && p.name.text === 'k' && /\bKit\b/.test(p.type?.getText(sf) ?? '')));
        out.push({ name: m.name.text, params: rest.map((p) => paramText(sf, p)).join(', '), doc: docOf(sf, m) });
      }
    }
  }
  return out;
}

interface Moves {
  file: string;
  sounds: Member[];
  moves: Member[];
}

function movesOf(worldId: string): Moves | undefined {
  const file = `src/worlds/${worldId}/moves.ts`;
  const sf = readSource(root(file));
  if (!sf) return undefined;
  return { file, sounds: objectMembers(sf, 'sounds'), moves: objectMembers(sf, 'moves') };
}

// ------------------------------------------------------- set pieces (source)

/** One callable part of a piece: `set`, `play`, `loom` …, or (for a piece that is itself a function) the whole call. */
export interface PiecePart {
  /** '' for a piece that is a function. */
  name: string;
  /** "k, { land, friends, cover?, music? }": the kit stays, options objects are shown by their keys. */
  params: string;
  /** "{ far, front, cover, friends }", or '' when there is nothing worth saying (void, a type parameter). */
  returns: string;
  doc: string;
}

/** A set piece: an exported async function, or an exported object whose members are functions. */
export interface Piece {
  name: string;
  /** The whole doc comment, line breaks kept (it ends with the usage example). */
  doc: string;
  parts: PiecePart[];
  object: boolean;
}

interface OtherExport {
  name: string;
  /** "Placed { id, x, y?, w?, z?, flip? }" or just the name. */
  text: string;
  doc: string;
}

interface Pieces {
  file: string;
  pieces: Piece[];
  /** Drawn paper (greyCloud, teaTable …), not staging. */
  art: OtherExport[];
  /** Exported but not a piece: placeAll, centreOf, Placed … */
  others: OtherExport[];
}

/** The `/** … *\/` comment before a node with its line breaks kept (` * ` margins removed). */
function rawDocOf(sf: ts.SourceFile, node: ts.Node): string {
  const ranges = ts.getLeadingCommentRanges(sf.text, node.getFullStart()) ?? [];
  for (let i = ranges.length - 1; i >= 0; i--) {
    const r = ranges[i];
    if (!r) continue;
    const raw = sf.text.slice(r.pos, r.end);
    if (!raw.startsWith('/**')) continue;
    return raw
      .replace(/^\/\*\*[ \t]*/, '')
      .replace(/[ \t]*\*\/$/, '')
      .split('\n')
      .map((l) => l.replace(/^\s*\* ?/, '').replace(/\s+$/, ''))
      .join('\n')
      .trim();
  }
  return '';
}

const hasModifier = (n: ts.Node, kind: ts.SyntaxKind): boolean => (ts.canHaveModifiers(n) ? ts.getModifiers(n) : undefined)?.some((m) => m.kind === kind) ?? false;

/** "{ land, friends, cover?, music? }": an options type by its keys. */
function keysText(sf: ts.SourceFile, members: readonly ts.TypeElement[]): string {
  const keys = members.map((m) => `${m.name ? m.name.getText(sf) : '…'}${m.questionToken ? '?' : ''}`);
  return keys.length ? `{ ${keys.join(', ')} }` : '{}';
}

/** Parameters for a call: the kit stays as `k`, an options object becomes its keys, anything else is its name. */
function pieceParams(sf: ts.SourceFile, params: readonly ts.ParameterDeclaration[]): string {
  return params
    .map((p) => {
      if (p.type && ts.isTypeLiteralNode(p.type)) return keysText(sf, p.type.members);
      return `${p.name.getText(sf)}${p.questionToken || p.initializer ? '?' : ''}`;
    })
    .join(', ');
}

/**
 * What a part gives back, when that is easy to read: an options-like literal,
 * or an interface written in the same file (the "…Actors" a `set` returns),
 * shown by its keys; a plain type name such as HTMLElement. Promise<…> is
 * looked through, and void or a type parameter says nothing.
 */
function returnText(sf: ts.SourceFile, t: ts.TypeNode | undefined, tparams: Set<string>, ifaces: Map<string, ts.InterfaceDeclaration>, used: Set<string>): string {
  if (!t || t.kind === ts.SyntaxKind.VoidKeyword) return '';
  if (ts.isTypeLiteralNode(t)) return keysText(sf, t.members);
  if (ts.isTypeReferenceNode(t)) {
    const name = t.typeName.getText(sf);
    if (name === 'Promise') return returnText(sf, t.typeArguments?.[0], tparams, ifaces, used);
    if (tparams.has(name)) return '';
    const local = ifaces.get(name);
    if (local) {
      used.add(name);
      return keysText(sf, local.members);
    }
  }
  const text = squash(t.getText(sf));
  return text.length <= 28 ? text : '';
}

function partOf(
  sf: ts.SourceFile,
  name: string,
  fn: { parameters: readonly ts.ParameterDeclaration[]; type?: ts.TypeNode; typeParameters?: ts.NodeArray<ts.TypeParameterDeclaration> },
  doc: string,
  ifaces: Map<string, ts.InterfaceDeclaration>,
  used: Set<string>,
): PiecePart {
  const tparams = new Set((fn.typeParameters ?? []).map((tp) => tp.name.text));
  return { name, params: pieceParams(sf, fn.parameters), returns: returnText(sf, fn.type, tparams, ifaces, used), doc: squash(doc) };
}

const unwrap = (e: ts.Expression): ts.Expression => {
  while (ts.isAsExpression(e) || ts.isSatisfiesExpression(e) || ts.isParenthesizedExpression(e)) e = e.expression;
  return e;
};

/**
 * Reads src/worlds/<id>/pieces.ts. A piece is an exported `async function`,
 * or an exported object literal with function members. An exported call such
 * as `cached(…)` is art; any other export (a plain function, an interface)
 * is a helper. Interfaces a piece returns are shown as that piece's keys, so
 * they are not helpers.
 */
function piecesOf(worldId: string): Pieces | undefined {
  const file = `src/worlds/${worldId}/pieces.ts`;
  const sf = readSource(root(file));
  if (!sf) return undefined;
  const ifaces = new Map<string, ts.InterfaceDeclaration>();
  for (const st of sf.statements) if (ts.isInterfaceDeclaration(st)) ifaces.set(st.name.text, st);
  const used = new Set<string>();
  const out: Pieces = { file, pieces: [], art: [], others: [] };
  const isExported = (n: ts.Node): boolean => hasModifier(n, ts.SyntaxKind.ExportKeyword);

  for (const st of sf.statements) {
    if (!isExported(st)) continue;
    if (ts.isFunctionDeclaration(st) && st.name) {
      const name = st.name.text;
      const doc = rawDocOf(sf, st);
      if (hasModifier(st, ts.SyntaxKind.AsyncKeyword)) out.pieces.push({ name, doc, object: false, parts: [partOf(sf, '', st, doc.split(/\n\s*\n/)[0] ?? '', ifaces, used)] });
      else out.others.push({ name, text: name, doc });
    } else if (ts.isVariableStatement(st)) {
      for (const d of st.declarationList.declarations) {
        if (!ts.isIdentifier(d.name)) continue;
        const name = d.name.text;
        const doc = rawDocOf(sf, st);
        const init = d.initializer ? unwrap(d.initializer) : undefined;
        const parts: PiecePart[] = [];
        if (init && ts.isObjectLiteralExpression(init)) {
          for (const m of init.properties) {
            if (!m.name || !(ts.isIdentifier(m.name) || ts.isStringLiteral(m.name))) continue;
            if (ts.isMethodDeclaration(m)) parts.push(partOf(sf, m.name.text, m, rawDocOf(sf, m), ifaces, used));
            else if (ts.isPropertyAssignment(m) && (ts.isArrowFunction(m.initializer) || ts.isFunctionExpression(m.initializer))) parts.push(partOf(sf, m.name.text, m.initializer, rawDocOf(sf, m), ifaces, used));
          }
        }
        if (parts.length) out.pieces.push({ name, doc, object: true, parts });
        else if (init && ts.isCallExpression(init)) out.art.push({ name, text: name, doc });
        else out.others.push({ name, text: name, doc });
      }
    } else if (ts.isInterfaceDeclaration(st)) {
      out.others.push({ name: st.name.text, text: `${st.name.text} ${keysText(sf, st.members)}`, doc: rawDocOf(sf, st) });
    } else if (ts.isTypeAliasDeclaration(st)) {
      out.others.push({ name: st.name.text, text: st.name.text, doc: rawDocOf(sf, st) });
    }
  }
  // The "…Actors" a piece hands back are already shown as its return; they are not a thing to import by hand.
  out.others = out.others.filter((o) => !used.has(o.name));
  return out;
}

/** Follows `readonly fx = fx` in the kit to wherever fx is really written, so the sheet cannot drift from the kit. */
function kitSounds(): { fx: Member[]; sfx: Member[] } {
  const none = { fx: [], sfx: [] };
  const kitFile = root('src/kit/kit.ts');
  const kit = readSource(kitFile);
  if (!kit) return none;
  const result: Record<'fx' | 'sfx', Member[]> = { fx: [], sfx: [] };
  for (const field of ['fx', 'sfx'] as const) {
    // readonly fx = fx;
    let local: string = field;
    ts.forEachChild(kit, function visit(n) {
      if (ts.isPropertyDeclaration(n) && ts.isIdentifier(n.name) && n.name.text === field && n.initializer && ts.isIdentifier(n.initializer)) local = n.initializer.text;
      ts.forEachChild(n, visit);
    });
    // import { fx, … } from '../audio/synth';
    let from: string | undefined;
    let exported = local;
    for (const st of kit.statements) {
      if (!ts.isImportDeclaration(st) || !ts.isStringLiteral(st.moduleSpecifier)) continue;
      const nb = st.importClause?.namedBindings;
      if (!nb || !ts.isNamedImports(nb)) continue;
      for (const el of nb.elements) {
        if (el.name.text === local) {
          from = st.moduleSpecifier.text;
          exported = el.propertyName?.text ?? el.name.text;
        }
      }
    }
    if (!from) continue;
    const base = fileURLToPath(new URL(from, pathToFileURL(kitFile)));
    for (const candidate of [`${base}.ts`, `${base}/index.ts`]) {
      const sf = readSource(candidate);
      if (sf) {
        result[field] = objectMembers(sf, exported);
        break;
      }
    }
  }
  return result;
}

// ------------------------------------------------------------------ rendering

const KIT_W = 260; // k.character's default width
const viewBoxOf = (svg: string): [number, number] | undefined => {
  const m = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg);
  return m ? [Number(m[1]), Number(m[2])] : undefined;
};
const fmt = (n: number): string => String(Math.round(n));

/** The parts most of a world's characters share, so each block need only say how it differs. */
function standardParts(w: World): string[] {
  const count = new Map<string, number>();
  const chars = Object.values(w.characters);
  for (const c of chars) for (const p of c.parts ?? []) count.set(p, (count.get(p) ?? 0) + 1);
  return [...count].filter(([, n]) => n >= chars.length * 0.6).map(([p]) => p);
}

/** "standard + glow", or "standard − lids + eyesOpen"; the full list when it is short or nothing is shared. */
function partsText(parts: string[], std: string[]): string {
  if (std.length < 4) return parts.join(', ');
  const extra = parts.filter((p) => !std.includes(p));
  const missing = std.filter((p) => !parts.includes(p));
  return ['standard', ...missing.map((p) => `− ${p}`), ...extra.map((p) => `+ ${p}`)].join(' ');
}

function characterBlock(id: string, c: CharacterDef, b: Budget, detail: boolean, std: string[] = []): string {
  const own = viewBoxOf(c.art());
  const lines: string[] = [];
  let head = `${id} · ${c.name}`;
  // The portrait is nearly always 300 × 340 (stated once in the section header); say so only when it isn't.
  if (own && (detail || own[0] !== 300 || own[1] !== 340)) head += ` · art ${fmt(own[0])}×${fmt(own[1])}: w ${KIT_W} gives h ${fmt((KIT_W * own[1]) / own[0])}`;
  lines.push(head);
  const poses = Object.entries(c.poses ?? {}).map(([name, draw]) => {
    const vb = viewBoxOf(draw());
    return vb && own && (vb[0] !== own[0] || vb[1] !== own[1]) ? `${name} (${fmt(vb[0])}×${fmt(vb[1])})` : name;
  });
  if (poses.length) lines.push(`  poses: ${poses.join(', ')}`);
  if (c.parts?.length) lines.push(`  parts: ${detail ? c.parts.join(', ') : partsText(c.parts, std)}`);
  lines.push(`  about: ${condense(c.about, b.about)}`);
  if (b.voice) lines.push(`  voice: ${condense(plainVoice(c.voice), b.voice)}`);
  return lines.join('\n');
}

function backdropLine(id: string, d: BackdropDef, b: Budget): string {
  const ss = sentences(d.about);
  // Where the floor is, how many actors fit, and what to pair it with matter more than the scenery,
  // so the scenery is cut first.
  const isStaging = (s: string): boolean => /\bground\b|room for|pair with|only for|\bkeep |no standing|seabed|clear space/i.test(s);
  const scenery = ss.filter((s) => !isStaging(s)).join(' ');
  const staging = ss.filter(isStaging).join(' ').replace(/\bGround line at about y (\d+)/g, 'Ground y≈$1');
  return `  ${id} — ${[cut(scenery, b.backdropLead), staging ? condense(staging, b.backdropTail) : ''].filter(Boolean).join(' ')}`;
}

function sizeTag(p: PropDef): string {
  const [w, h] = p.size ?? [120, 120];
  if (w === 120 && h === 120) return '';
  return w === h ? ` [w${w}]` : ` [${w}×${h}]`;
}

/**
 * Props whose notes only differ in their first clause (the fourteen
 * "far-<land>" views, five hidden treasures) share one line.
 */
function propLines(props: Record<string, PropDef>, b: Budget): string[] {
  const entries = Object.entries(props);
  if (b.prop === 0) {
    // An index: ids by size. `--id` says what any of them looks like.
    const bySize = new Map<string, string[]>();
    for (const [id, p] of entries) bySize.set(sizeTag(p).trim() || '[w120]', [...(bySize.get(sizeTag(p).trim() || '[w120]') ?? []), id]);
    return [...bySize].map(([size, ids]) => `  ${size} ${ids.join(', ')}`);
  }
  const tailOf = (p: PropDef): string => squash(p.about).replace(/^[^,:]*[,:]\s*/, '');
  const groups = new Map<string, [string, PropDef][]>();
  for (const e of entries) {
    const key = `${(e[1].size ?? [120, 120]).join('x')}|${/[,:]/.test(e[1].about) ? tailOf(e[1]) : e[0]}`;
    groups.set(key, [...(groups.get(key) ?? []), e]);
  }
  const lines: string[] = [];
  const done = new Set<string>();
  for (const [id, p] of entries) {
    const key = `${(p.size ?? [120, 120]).join('x')}|${/[,:]/.test(p.about) ? tailOf(p) : id}`;
    if (done.has(key)) continue;
    done.add(key);
    const g = groups.get(key) ?? [];
    if (g.length >= 4) lines.push(`  ${g.map(([i]) => i).join(', ')}${sizeTag(p)} — ${condense(tailOf(p), b.prop)}`);
    else for (const [i, q] of g) lines.push(`  ${i}${sizeTag(q)} — ${condense(q.about, b.prop)}`);
  }
  return lines;
}

const memberLine = (prefix: string, m: Member, b: Budget): string => `  ${prefix}${m.name}(${m.params})${m.doc ? ` — ${condense(m.doc, b.doc)}` : ''}`;

function movesLines(m: Moves | undefined, b: Budget): string[] {
  if (!m) return ['  (no moves.ts)'];
  const spec = m.file.replace(/^src\//, '../../').replace(/\.ts$/, '');
  const out: string[] = [];
  if (m.sounds.length) {
    out.push(` sounds: plain functions that play now.  import { sounds } from '${spec}';  sounds.name(args)`);
    for (const s of m.sounds) out.push(memberLine('', s, b));
  }
  if (m.moves.length) {
    out.push(` moves: async, animate an actor.  import { moves } from '${spec}';  await moves.name(k, args)  or  void it to run alongside`);
    for (const s of m.moves) out.push(memberLine('', s, b));
  }
  return out;
}

/** The first sentence of a piece's doc comment, and the second if it still fits: what it is, in a line or two. */
function lead(doc: string, budget: number): string {
  const para = squash((doc.split(/\n\s*\n/)[0] ?? doc));
  if (para.length <= budget) return para;
  const ss = sentences(para);
  const first = ss[0] ?? para;
  if (first.length >= budget) return cut(first, budget);
  const second = ss[1];
  return second && first.length + 1 + second.length <= budget ? `${first} ${second}` : first;
}

const importLine = (names: string[], worldId: string): string => `  import { ${names.join(', ')} } from '../../worlds/${worldId}/pieces';`;

const partCall = (piece: Piece, part: PiecePart): string => `${part.name || piece.name}(${part.params})${part.returns ? ` → ${part.returns}` : ''}`;

function pieceLines(piece: Piece, b: Budget): string[] {
  const doc = b.piece ? lead(piece.doc, b.piece) : '';
  if (!piece.object) {
    const part = piece.parts[0];
    return [`  ${part ? partCall(piece, part) : piece.name}${doc ? ` — ${doc}` : ''}`];
  }
  return [`  ${piece.name}${doc ? ` — ${doc}` : ''}`, ...piece.parts.map((part) => `    ${partCall({ ...piece, name: '' }, part)}${b.partDocs && part.doc ? ` — ${part.doc}` : ''}`)];
}

/** The pieces of one world, each with the import line first. `intro` adds the three rules of how a piece works (once per sheet). */
function piecesLines(worldId: string, b: Budget, intro: boolean): string[] {
  const ps = piecesOf(worldId);
  if (!ps) return ['  (no pieces.ts)'];
  if (!ps.pieces.length) return ['  (no set pieces)'];
  const out = [importLine(ps.pieces.map((p) => p.name), worldId)];
  if (intro && b.piece) {
    out.push(
      '  An object piece: `set(k, …)` builds the picture (no waiting, no motion: legal in a scene’s `set`) and returns the actors; `play` and the other parts take them and animate: `await p.play(k, a, …)`.',
      '  A function piece is just awaited. Options take line KEYS from your `lines`. Whole doc and example: --id <piece>.',
    );
  }
  if (!b.piece) {
    // An index: who, and what parts they have.
    for (const p of ps.pieces) out.push(p.object ? `  ${p.name}: ${p.parts.map((x) => x.name).join(', ')}` : `  ${p.name}`);
  } else for (const p of ps.pieces) out.push(...pieceLines(p, b));
  if (ps.art.length) out.push(`  art (call it for paper, then k.add): ${ps.art.map((a) => a.name).join(', ')}`);
  if (ps.others.length) out.push(`  also exported, not pieces: ${ps.others.map((o) => o.text).join(', ')}`);
  return out;
}

/** A piece, or the art and helpers beside it, in full: the whole doc comment, then its parts. */
function pieceEntry(worldId: string, id: string, tag: string): string | undefined {
  const ps = piecesOf(worldId);
  if (!ps) return undefined;
  const spec = `../../worlds/${worldId}/pieces`;
  const piece = ps.pieces.find((p) => p.name === id);
  if (piece) {
    const parts = piece.parts.map((part) => `  ${partCall(piece.object ? { ...piece, name: '' } : piece, part)}${piece.object && part.doc ? `\n      ${part.doc}` : ''}`);
    return [`piece ${id} — ${ps.file}${tag}\n  import { ${id} } from '${spec}';`, piece.doc ? piece.doc.replace(/^/gm, '  ').replace(/^ +$/gm, '') : '  (no doc comment)', '', 'Parts:', ...parts].join('\n');
  }
  const other = [...ps.art.map((a) => ['art', a] as const), ...ps.others.map((o) => ['helper', o] as const)].find(([, o]) => o.name === id);
  if (other) return `${other[0]} ${id} — ${ps.file}${tag}\n  import { ${id} } from '${spec}';\n${other[1].doc ? other[1].doc.replace(/^/gm, '  ').replace(/^ +$/gm, '') : '  (no doc comment)'}`;
  return undefined;
}

function kitLines(b: Budget): string[] {
  const { fx, sfx } = kitSounds();
  const out: string[] = [];
  for (const [head, list] of [[' k.fx.name(args): sound effects', fx], [' k.sfx.name(args): from Wizard Words, so skip the letter, tile and gem ones', sfx]] as const) {
    if (!list.length) continue;
    out.push(head);
    if (b.kitDocs) for (const m of list) out.push(memberLine('', m, b));
    else out.push(`  ${list.map((m) => `${m.name}(${m.params})`).join(', ')}`);
  }
  return out.length ? out : ['  (kit not found)'];
}

// ------------------------------------------------------------------ the sheet

function world(id: string): World {
  const w = WORLDS[id];
  if (!w) throw new Error(`No world "${id}". Worlds: ${Object.keys(WORLDS).join(', ')}.`);
  return w;
}

/** The worlds, one line each. */
export function worldList(): string {
  return Object.values(WORLDS)
    .map((w) => `${w.id.padEnd(9)} ${w.name} — ${Object.keys(w.characters).length} characters, ${Object.keys(w.backdrops).length} backdrops, ${Object.keys(w.props).length} props`)
    .join('\n');
}

function section(title: string, lines: string[]): string {
  return [title, ...lines].join('\n');
}

/** One entry, in full, wherever it is: characters, backdrops and props of the world, then common, then (a crossover) the rest. */
function entryText(worldId: string, id: string, common: boolean): string {
  const order = [worldId, ...(common && worldId !== 'common' ? ['common'] : []), ...Object.keys(WORLDS).filter((w) => w !== worldId && w !== 'common')];
  const full = BUDGETS.full;
  const found: string[] = [];
  for (const wid of order) {
    const w = world(wid);
    const tag = wid === worldId ? '' : `  [from ${wid}]`;
    const c = w.characters[id];
    if (c) found.push(`character ${characterBlock(id, c, full, true)}${tag}`);
    const bd = w.backdrops[id];
    if (bd) found.push(`backdrop ${id}${tag}\n  ${squash(bd.about)}\n  stage 1180×820; k.backdrop('${id}')`);
    const p = w.props[id];
    if (p) found.push(`prop ${id}${sizeTag(p) || ' [w120]'}${tag}\n  ${squash(p.about)}\n  k.prop('${id}', { x, y, w: ${(p.size ?? [120, 120])[0]} })`);
    const m = movesOf(wid);
    for (const [kind, list] of [['sounds', m?.sounds], ['moves', m?.moves]] as const) {
      for (const member of list ?? []) if (member.name === id) found.push(`${kind}.${member.name}(${member.params})${tag}  — ${wid}/moves.ts${kind === 'moves' ? ' (async, first argument k)' : ''}\n  ${member.doc || '(no doc comment)'}`);
    }
    const pe = pieceEntry(wid, id, tag);
    if (pe) found.push(pe);
    // A name found in the world itself (or common) beats the same name in a world the cartoon is only visiting.
    if (found.length && (wid === worldId || wid === 'common')) break;
  }
  const kit = kitSounds();
  for (const [kind, list] of [['k.fx', kit.fx], ['k.sfx', kit.sfx]] as const) {
    for (const member of list) if (member.name === id) found.push(`${kind}.${member.name}(${member.params})  — the kit\n  ${member.doc || '(no doc comment)'}`);
  }
  if (!found.length) {
    const near = new Set<string>();
    for (const wid of order) {
      const w = world(wid);
      const ps = piecesOf(wid);
      for (const n of [...Object.keys(w.characters), ...Object.keys(w.backdrops), ...Object.keys(w.props), ...(ps?.pieces ?? []).map((p) => p.name)]) if (n.toLowerCase().includes(id.toLowerCase())) near.add(n);
    }
    throw new Error(`No entry "${id}" in ${worldId}.${near.size ? ` Did you mean: ${[...near].slice(0, 8).join(', ')}?` : ''}`);
  }
  return found.join('\n\n');
}

/**
 * The cheat sheet for one world, as plain text. Throws (with a message
 * fit to print) for an unknown world, section or id.
 */
export function catalogueText(worldId: string, opts: CatalogueOptions = {}): string {
  const w = world(worldId);
  const common = opts.common !== false;
  if (opts.id) return `${entryText(worldId, opts.id, common)}\n`;
  const b = BUDGETS[opts.mode ?? 'normal'];
  const want = (s: Section): boolean => !opts.section || opts.section === s;
  const parts: string[] = [];

  if (opts.section === 'about') return `# ${w.name} (${w.id}) · accent ${w.accent}\n${w.about.trim()}\n`;
  if (want('about')) {
    parts.push(
      `# ${w.name} (${w.id}) · accent ${w.accent}\n${headline(w.about, b.world)}\n` +
        `(setting, tone, rules and what is never shown: npm run catalogue -- ${w.id} about  ·  one entry in full: npm run catalogue -- ${w.id} --id <id>)`,
    );
  }
  if (want('characters')) {
    const chars = Object.entries(w.characters);
    const std = standardParts(w);
    if (chars.length) {
      parts.push(
        `## Characters (${chars.length})\n` +
          `k.character(id, { x, y, w, pose }). Portraits are 300×340 (w ${KIT_W} gives h 295); face is in the box 78 62 144 144. ` +
          `${std.length >= 4 ? `standard parts = ${std.join(', ')}. ` : ''}mouth + mouthOpen make them talk, lids blink, armL/armR/wingL/wingR swing (k.pivot(k.part(el, 'armR'))).\n\n` +
          chars.map(([id, c]) => characterBlock(id, c, b, false, std)).join('\n\n'),
      );
    } else if (opts.section === 'characters') parts.push(`## Characters\n(none: ${w.name} has no characters of its own)`);
  }
  if (want('backdrops') && Object.keys(w.backdrops).length) {
    parts.push(
      section(`## Backdrops (${Object.keys(w.backdrops).length}) — k.backdrop(id). Captions take y 690–800: feet and faces go above. "ground" is where feet stand.`, Object.entries(w.backdrops).map(([id, d]) => backdropLine(id, d, b))),
    );
  }
  if (want('props') && Object.keys(w.props).length) {
    parts.push(section(`## Props (${Object.keys(w.props).length}) — k.prop(id, { x, y, w }). [w…] is the natural width (default w120; [W×H] if not square)`, propLines(w.props, b)));
  }
  if (want('moves')) {
    const m = movesOf(w.id);
    parts.push(section(`## Sounds and moves — ${m?.file ?? `src/worlds/${w.id}/moves.ts`}`, movesLines(m, b)));
  }
  if (want('pieces')) {
    parts.push(section(`## Set pieces — whole recurring bits of staging, src/worlds/${w.id}/pieces.ts`, piecesLines(w.id, b, true)));
  }

  if (common && w.id !== 'common') {
    const c = world('common');
    const cp: string[] = [];
    if (want('backdrops')) cp.push(section(`### Backdrops`, Object.entries(c.backdrops).map(([id, d]) => backdropLine(id, d, b))));
    if (want('props')) cp.push(section(`### Props`, propLines(c.props, b)));
    if (want('moves')) cp.push(section(`### Sounds and moves — src/worlds/common/moves.ts`, movesLines(movesOf('common'), b)));
    if (want('pieces')) cp.push(section(`### Set pieces — src/worlds/common/pieces.ts`, piecesLines('common', b, false)));
    if (cp.length) parts.push(`## common (available everywhere)\n${cp.join('\n\n')}`);
  }
  if (want('kit')) {
    parts.push(section('## The kit’s own sounds — always available (src/kit/kit.ts)', kitLines(b)));
  }
  return `${parts.join('\n\n')}\n`;
}

// ------------------------------------------------------------------------ CLI

const USAGE = `Usage: npm run catalogue -- <world> [${SECTIONS.join('|')}] [--id <id>] [--no-common] [--brief|--full]
       npm run catalogue -- --list`;

function main(argv: string[]): number {
  const positional: string[] = [];
  const flags = new Set<string>();
  let id: string | undefined;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i] ?? '';
    if (a === '--id') id = argv[++i];
    else if (a.startsWith('--id=')) id = a.slice(5);
    else if (a.startsWith('--')) flags.add(a);
    else positional.push(a);
  }
  try {
    if (flags.has('--list')) {
      process.stdout.write(`${worldList()}\n`);
      return 0;
    }
    if (flags.has('--help') || !positional.length) {
      process.stdout.write(`${USAGE}\n\nWorlds:\n${worldList()}\n`);
      return flags.has('--help') ? 0 : 1;
    }
    const [worldId = '', sec] = positional;
    if (sec && !(SECTIONS as readonly string[]).includes(sec)) throw new Error(`No section "${sec}". Sections: ${SECTIONS.join(', ')}.`);
    if (id === '' || (flags.has('--id') && !id)) throw new Error('--id needs an id.');
    const mode: Mode = flags.has('--full') ? 'full' : flags.has('--brief') ? 'brief' : 'normal';
    process.stdout.write(catalogueText(worldId, { section: sec as Section | undefined, id, common: !flags.has('--no-common'), mode }));
    return 0;
  } catch (e) {
    process.stderr.write(`${e instanceof Error ? e.message : String(e)}\n`);
    return 1;
  }
}

// Run only as a script, not when a test imports catalogueText.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main(process.argv.slice(2));
