/**
 * The library: a bookcase. It opens on one big torn-paper book per world
 * (Harry Potter, the Faraway Tree, the bears), standing cover out on a
 * wooden shelf, so he picks a world first and never faces thirty cards.
 *
 * Tapping a book opens it: the books slip away and that world's cartoons
 * settle in, one card each, in the world's colour, with a picture of one
 * of its places, the title on a paper label, and a tick seal once he has
 * watched it. A home seal at the top goes back to the books.
 *
 * Six cards fit on a page (three across, two rows). With more, two big
 * arrow seals turn the pages. Nothing moves while he chooses: the books
 * and cards settle in when they appear, and then they keep still. Back
 * from a cartoon, the library opens where he left it (the same book and
 * page), so he sees the tick on the one he just watched.
 */
import { sfx } from '../audio/sfx';
import { C } from '../art/palette';
import { hashString, piece, rect, svg, tornRectPath } from '../art/paper';
import { parchment, star, waxSeal } from '../art/ui';
import { SHELF, type ShelfEntry } from '../cartoons';
import { sm } from '../ui/anim';
import { banner, sealButton } from '../ui/components';
import { h, place } from '../ui/dom';
import { Scene, type App } from '../ui/scene';
import { findBackdrop, WORLDS } from '../worlds';

const COLS = 3;
const PER_PAGE = 6;
const CARD_W = 336;
const CARD_H = 252;
const GAP_X = 22;
const GAP_Y = 26;
/** Where the first row starts when there are two rows, or just one. */
const TOP_TWO_ROWS = 134;
const TOP_ONE_ROW = 236;
/** The picture window inside a card. */
const THUMB = { x: 14, y: 14, w: 308, h: 152 };

/** A book on the bookcase, its picture window, and where the row of books stands. */
const BOOK_W = 300;
const BOOK_H = 420;
const BOOK_GAP = 60;
const BOOK_TOP = 186;
const COVER = { x: 56, y: 42, w: 202, h: 166 };

/**
 * What each world's book is called on the bookcase, in the order they
 * stand: the names he knows the stories by, not the worlds' own names. A
 * world not listed here still gets a book, under its own name, at the end.
 */
const BOOKS: { world: string; title: string; cover: string }[] = [
  { world: 'hogwarts', title: 'Harry Potter', cover: 'sunny-grounds' },
  { world: 'faraway', title: 'The Faraway Tree', cover: 'tree' },
  { world: 'bears', title: 'The Teddy Bears', cover: 'bear-garden' },
];

/** The books to show: one per world with a cartoon in it. */
function bookcase(): { world: string; title: string; cover?: string }[] {
  const worlds = new Set(SHELF.map((c) => c.world));
  const known = BOOKS.filter((b) => worlds.has(b.world));
  const others = [...worlds].filter((w) => !BOOKS.some((b) => b.world === w)).map((w) => ({ world: w, title: WORLDS[w]?.name ?? w }));
  return [...known, ...others];
}

/** Where he was when he left the library (for a cartoon or the corner): the open book and its page. */
let lastBook: string | null = null;
let lastPage = 0;

/** `hex` blended towards black (t < 0) or white (t > 0). */
function shade(hex: string, t: number): string {
  const n = parseInt(hex.slice(1), 16);
  const to = t < 0 ? 0 : 255;
  const k = Math.abs(t);
  const ch = (v: number) => Math.round(v + (to - v) * k);
  const rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(ch);
  return '#' + rgb.map((v) => v.toString(16).padStart(2, '0')).join('');
}

/** A picture of a place: the chosen backdrop, else the world's first, else a plain placard. */
function thumbArt(world: string, thumb: string | undefined, name: string): { html: string; plain: boolean } {
  const w = WORLDS[world];
  const def = (thumb && findBackdrop(thumb, world)) || (w && Object.values(w.backdrops)[0]);
  if (def) return { html: def.art(), plain: false };
  return { html: star(true, 'thumb-' + name), plain: true };
}

export class LibraryScene extends Scene {
  /** The world whose book is open, or null on the bookcase. */
  private book: string | null = null;
  private page = 0;
  private busy = false;
  private title!: HTMLElement;
  private deck!: HTMLElement;
  private home!: HTMLButtonElement;
  private prev!: HTMLButtonElement;
  private next!: HTMLButtonElement;
  private dots!: HTMLElement;

  constructor(app: App) {
    super(app, 'library');
  }

  /** The cartoons in the open book. */
  private get entries(): ShelfEntry[] {
    return SHELF.filter((c) => c.world === this.book);
  }

  private get pages(): number {
    return Math.max(1, Math.ceil(this.entries.length / PER_PAGE));
  }

  build(): void {
    const r = this.root;
    r.style.background = `radial-gradient(ellipse 70% 60% at 50% 38%, ${shade(C.greenDeep, 0.14)}, ${C.greenDeep} 80%)`;
    this.title = h('div', { class: 'shelf-banner' });
    r.append(this.title);

    this.deck = h('div', { class: 'shelf-deck' });
    r.append(this.deck);
    this.setTitle();

    if (!SHELF.length) {
      r.append(place(h('div', { class: 'shelf-empty', html: parchment(620, 240, 'shelf-empty', C.cream, 1) }), 280, 300, 620, 240));
      r.append(place(h('div', { class: 'shelf-empty-text' }, 'No cartoons yet.'), 280, 300, 620, 240));
      return;
    }

    this.home = sealButton('home', { x: 1056, y: 22, size: 100, color: C.red, aria: 'All the books', name: 'shelf-home' });
    this.prev = sealButton('back', { x: 60, y: 708, size: 100, color: C.red, aria: 'Earlier cartoons', name: 'shelf-prev' });
    this.next = sealButton('next', { x: 1020, y: 708, size: 100, color: C.red, aria: 'More cartoons', name: 'shelf-next' });
    this.dots = place(h('div', { class: 'shelf-dots' }), 340, 730, 500, 56);
    this.tap(this.home, () => void this.open(null));
    this.tap(this.prev, () => void this.turn(-1));
    this.tap(this.next, () => void this.turn(1));
    r.append(this.home, this.prev, this.next, this.dots);

    // Back where he left off, if that book still has cartoons in it.
    if (lastBook && bookcase().some((b) => b.world === lastBook)) {
      this.book = lastBook;
      this.page = Math.min(lastPage, this.pages - 1);
    }
    this.fill();
  }

  enter(): void {
    this.settle();
  }

  leave(): void {
    lastBook = this.book;
    lastPage = this.page;
  }

  /** Opens a world's book, or (null) closes it back to the bookcase: what's showing slips away, the rest settles in. */
  private async open(world: string | null): Promise<void> {
    if (this.busy || world === this.book) return;
    this.busy = true;
    sfx.page();
    await sm(this.deck.querySelectorAll('.shelf-card, .shelf-book'), 0.2, { opacity: 0, y: 12, ease: 'power1.in' });
    if (!this.alive) return;
    this.book = world;
    this.page = 0;
    this.fill();
    this.settle();
    this.busy = false;
  }

  /** Turns to the page before (-1) or after (+1): the cards slip away, the next ones settle in. */
  private async turn(by: number): Promise<void> {
    const to = this.page + by;
    if (this.busy || to < 0 || to >= this.pages) return;
    this.busy = true;
    sfx.page();
    await sm(this.deck.querySelectorAll('.shelf-card'), 0.2, { opacity: 0, y: 12, ease: 'power1.in' });
    if (!this.alive) return;
    this.page = to;
    this.fill();
    this.settle();
    this.busy = false;
  }

  /** The cards (or books) drift gently into place, one after another, then stay still. */
  private settle(): void {
    const cards = Array.from(this.deck.querySelectorAll<HTMLElement>('.shelf-card, .shelf-book'));
    cards.forEach((card, i) => {
      const tilt = Number(card.dataset.tilt);
      void sm(card, 0.55, { startAt: { opacity: 0, y: 26, rotation: tilt - 2.5 }, opacity: 1, y: 0, rotation: tilt, delay: 0.08 * i, ease: 'power2.out' });
    });
  }

  /** The title at the top: "Cartoons" on the bookcase, the book's name inside it. */
  private setTitle(): void {
    const name = this.book ? (bookcase().find((b) => b.world === this.book)?.title ?? this.book) : 'Cartoons';
    const w = this.book ? 560 : 400;
    this.title.replaceChildren(banner(name, { x: (1180 - w) / 2, y: 24, w, h: 96, size: 52 }));
  }

  /** The wooden shelf a row of books or cards stands on, its top at `y`. */
  private plank(y: number): void {
    const art = svg({ w: 1180, h: 820, name: 'plank-' + y }, [
      piece(rect(-40, y, 1260, 34), C.wood, { rough: 0.8 }),
      piece(rect(-40, y, 1260, 10), shade(C.wood, 0.22), { edge: 'cut', shadow: false, fibre: false }),
    ]);
    this.deck.append(h('div', { class: 'shelf-plank', html: art }));
  }

  /** Builds what's showing, the bookcase or the open book's page (invisible until `settle` brings it in). */
  private fill(): void {
    this.setTitle();
    this.deck.replaceChildren();
    this.deck.dataset.open = this.book ?? '';
    this.home.style.visibility = this.book ? 'visible' : 'hidden';
    if (!this.book) {
      this.prev.style.visibility = 'hidden';
      this.next.style.visibility = 'hidden';
      this.dots.replaceChildren();
      this.fillBookcase();
      return;
    }

    const all = this.entries;
    const entries = all.slice(this.page * PER_PAGE, (this.page + 1) * PER_PAGE);
    const rows = Math.ceil(entries.length / COLS);
    const top = all.length > COLS ? TOP_TWO_ROWS : TOP_ONE_ROW;

    for (let row = 0; row < rows; row++) this.plank(top + row * (CARD_H + GAP_Y) + CARD_H - 16);

    entries.forEach((entry, i) => {
      const row = Math.floor(i / COLS);
      const inRow = Math.min(COLS, entries.length - row * COLS);
      const rowW = inRow * CARD_W + (inRow - 1) * GAP_X;
      const x = (1180 - rowW) / 2 + (i % COLS) * (CARD_W + GAP_X);
      this.deck.append(this.card(entry, x, top + row * (CARD_H + GAP_Y)));
    });

    this.prev.style.visibility = this.page > 0 ? 'visible' : 'hidden';
    this.next.style.visibility = this.page < this.pages - 1 ? 'visible' : 'hidden';
    this.dots.replaceChildren();
    if (this.pages > 1) {
      for (let p = 0; p < this.pages; p++) {
        this.dots.append(h('span', { class: `shelf-dot${p === this.page ? ' on' : ''}`, html: star(p === this.page, 'dot' + p) }));
      }
    }
  }

  /** One row of books, cover out, centred on the shelf. */
  private fillBookcase(): void {
    const books = bookcase();
    this.plank(BOOK_TOP + BOOK_H - 18);
    const rowW = books.length * BOOK_W + (books.length - 1) * BOOK_GAP;
    books.forEach((b, i) => this.deck.append(this.bookCover(b, (1180 - rowW) / 2 + i * (BOOK_W + BOOK_GAP), BOOK_TOP)));
  }

  private bookCover(b: { world: string; title: string; cover?: string }, x: number, y: number): HTMLElement {
    const accent = WORLDS[b.world]?.accent ?? C.red;
    const seed = hashString('book-' + b.world);
    const count = SHELF.filter((c) => c.world === b.world).length;
    const btn = place(h('button', { class: 'shelf-book', 'data-book': b.world, 'aria-label': `${b.title}, ${count} cartoon${count === 1 ? '' : 's'}` }), x, y, BOOK_W, BOOK_H);
    const tilt = ((seed % 7) - 3) * 0.3;
    btn.dataset.tilt = String(tilt);
    btn.style.transform = `rotate(${tilt}deg)`;
    btn.style.opacity = '0';

    // The paper: cream page edges peeping out behind, the cover in the
    // world's colour, a darker spine with two gold bands, and a cream
    // mount for the picture.
    const cw = BOOK_W - 16;
    const art = svg({ w: BOOK_W, h: BOOK_H, name: 'book-' + b.world }, [
      piece(rect(22, 12, BOOK_W - 24, BOOK_H - 16, 6), C.cream, { rough: 0.7 }),
      piece(rect(30, 18, BOOK_W - 34, 3), shade(C.cream, -0.12), { edge: 'cut', shadow: false, fibre: false }),
      piece(rect(4, 4, cw - 4, BOOK_H - 10, 8), accent, { rough: 1.1 }),
      piece(rect(4, 4, 34, BOOK_H - 10, 6), shade(accent, -0.28), { edge: 'cut', shadow: false, fibre: false }),
      piece(rect(4, 34, 34, 10), C.gold, { edge: 'cut', shadow: false, fibre: false }),
      piece(rect(4, BOOK_H - 50, 34, 10), C.gold, { edge: 'cut', shadow: false, fibre: false }),
      piece(rect(COVER.x - 6, COVER.y - 6, COVER.w + 12, COVER.h + 12, 4), C.cream, { rough: 0.9 }),
    ]);
    const face = h('div', { class: 'shelf-face' });
    face.append(h('div', { class: 'shelf-art', html: art }));

    const t = thumbArt(b.world, b.cover, 'book-' + b.world);
    const thumb = place(h('div', { class: `shelf-thumb book-thumb${t.plain ? ' plain' : ''}`, html: t.html }), COVER.x, COVER.y, COVER.w, COVER.h);
    thumb.style.clipPath = `path('${tornRectPath(COVER.w, COVER.h, seed, 0.5, 1)}')`;
    if (t.plain) thumb.style.background = shade(accent, 0.55);
    face.append(thumb);

    face.append(h('div', { class: 'book-label', html: parchment(232, 150, 'book-label-' + b.world, C.cream, 0.6) }));
    face.append(h('span', { class: 'book-title' }, [h('span', {}, b.title)]));
    btn.append(face);

    this.tap(btn, () => {
      sfx.tap();
      void this.open(b.world);
    });
    return btn;
  }

  private card(entry: ShelfEntry, x: number, y: number): HTMLElement {
    const accent = WORLDS[entry.world]?.accent ?? C.red;
    const seed = hashString(entry.id);
    const watched = this.app.settings.watched.includes(entry.id);

    const card = place(h('button', { class: 'shelf-card', 'data-cartoon': entry.id, 'aria-label': entry.title + (watched ? ', watched' : '') }), x, y, CARD_W, CARD_H);
    const tilt = ((seed % 9) - 4) * 0.25;
    card.dataset.tilt = String(tilt);
    card.style.transform = `rotate(${tilt}deg)`;
    card.style.opacity = '0';

    // The paper: the world's colour, a darker panel, a cream mount for the picture,
    // and a lighter ribbon across the bottom for the label to sit on.
    const art = svg({ w: CARD_W, h: CARD_H, name: 'card-' + entry.id }, [
      piece(rect(5, 5, CARD_W - 10, CARD_H - 10, 8), accent, { rough: 1.1 }),
      piece(rect(13, 13, CARD_W - 26, CARD_H - 26, 6), shade(accent, -0.22), { edge: 'cut', shadow: false, fibre: false }),
      piece(rect(THUMB.x - 5, THUMB.y - 5, THUMB.w + 10, THUMB.h + 10, 4), C.cream, { rough: 0.9 }),
      piece(rect(0, 158, CARD_W, 56), shade(accent, 0.32), { edge: 'cut', shadow: true, fibre: false }),
    ]);
    const face = h('div', { class: 'shelf-face' });
    face.append(h('div', { class: 'shelf-art', html: art }));

    const t = thumbArt(entry.world, entry.thumb, entry.id);
    const thumb = place(h('div', { class: `shelf-thumb${t.plain ? ' plain' : ''}`, html: t.html }), THUMB.x, THUMB.y, THUMB.w, THUMB.h);
    thumb.style.clipPath = `path('${tornRectPath(THUMB.w, THUMB.h, seed, 0.5, 1)}')`;
    if (t.plain) thumb.style.background = shade(accent, 0.55);
    face.append(thumb);

    face.append(h('div', { class: 'shelf-label', html: parchment(CARD_W - 40, 84, 'label-' + entry.id, C.cream, 0.45) }));
    face.append(h('span', { class: 'shelf-title' }, [h('span', {}, entry.title)]));

    if (watched) face.append(h('span', { class: 'shelf-tick', 'aria-hidden': 'true', html: waxSeal('tick', C.leaf, 84, 'tick-' + entry.id) }));
    card.append(face);

    this.tap(card, () => {
      sfx.tap();
      this.app.nav.watch(entry.id);
    });
    return card;
  }
}
