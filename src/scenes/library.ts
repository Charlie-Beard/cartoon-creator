/**
 * The library: a shelf of cartoons to pick from. One big torn-paper card
 * per cartoon, standing on a wooden shelf. Each card is in its world's
 * colour, with a picture of one of the world's places and the title on a
 * paper label, and a tick seal once he has watched it.
 *
 * Six cards fit on a page (three across, two rows). With more, two big
 * arrow seals turn the pages. Nothing moves while he chooses: the cards
 * settle in when the page opens or turns, and then they keep still.
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

/** `hex` blended towards black (t < 0) or white (t > 0). */
function shade(hex: string, t: number): string {
  const n = parseInt(hex.slice(1), 16);
  const to = t < 0 ? 0 : 255;
  const k = Math.abs(t);
  const ch = (v: number) => Math.round(v + (to - v) * k);
  const rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(ch);
  return '#' + rgb.map((v) => v.toString(16).padStart(2, '0')).join('');
}

/** The art for a card's picture: the cartoon's chosen backdrop, else its world's first, else a plain placard. */
function thumbArt(entry: ShelfEntry): { html: string; plain: boolean } {
  const world = WORLDS[entry.world];
  const def = (entry.thumb && findBackdrop(entry.thumb, entry.world)) || (world && Object.values(world.backdrops)[0]);
  if (def) return { html: def.art(), plain: false };
  return { html: star(true, 'thumb-' + entry.id), plain: true };
}

export class LibraryScene extends Scene {
  private page = 0;
  private busy = false;
  private deck!: HTMLElement;
  private prev!: HTMLButtonElement;
  private next!: HTMLButtonElement;
  private dots!: HTMLElement;

  constructor(app: App) {
    super(app, 'library');
  }

  private get pages(): number {
    return Math.max(1, Math.ceil(SHELF.length / PER_PAGE));
  }

  build(): void {
    const r = this.root;
    r.style.background = `radial-gradient(ellipse 70% 60% at 50% 38%, ${shade(C.greenDeep, 0.14)}, ${C.greenDeep} 80%)`;
    r.append(banner('Cartoons', { x: 390, y: 24, w: 400, h: 96, size: 52 }));

    this.deck = h('div', { class: 'shelf-deck' });
    r.append(this.deck);

    if (!SHELF.length) {
      r.append(place(h('div', { class: 'shelf-empty', html: parchment(620, 240, 'shelf-empty', C.cream, 1) }), 280, 300, 620, 240));
      r.append(place(h('div', { class: 'shelf-empty-text' }, 'No cartoons yet.'), 280, 300, 620, 240));
      return;
    }

    this.prev = sealButton('back', { x: 60, y: 708, size: 100, color: C.red, aria: 'Earlier cartoons', name: 'shelf-prev' });
    this.next = sealButton('next', { x: 1020, y: 708, size: 100, color: C.red, aria: 'More cartoons', name: 'shelf-next' });
    this.dots = place(h('div', { class: 'shelf-dots' }), 340, 730, 500, 56);
    this.tap(this.prev, () => void this.turn(-1));
    this.tap(this.next, () => void this.turn(1));
    r.append(this.prev, this.next, this.dots);
    this.fill();
  }

  enter(): void {
    this.settle();
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

  /** The cards drift gently into place, one after another, then stay still. */
  private settle(): void {
    const cards = Array.from(this.deck.querySelectorAll<HTMLElement>('.shelf-card'));
    cards.forEach((card, i) => {
      const tilt = Number(card.dataset.tilt);
      void sm(card, 0.55, { startAt: { opacity: 0, y: 26, rotation: tilt - 2.5 }, opacity: 1, y: 0, rotation: tilt, delay: 0.08 * i, ease: 'power2.out' });
    });
  }

  /** Builds the current page's shelf and cards (invisible until `settle` brings them in). */
  private fill(): void {
    const entries = SHELF.slice(this.page * PER_PAGE, (this.page + 1) * PER_PAGE);
    const rows = Math.ceil(entries.length / COLS);
    const top = SHELF.length > COLS ? TOP_TWO_ROWS : TOP_ONE_ROW;
    this.deck.replaceChildren();

    // The wooden shelf each row of cards stands on.
    for (let row = 0; row < rows; row++) {
      const y = top + row * (CARD_H + GAP_Y) + CARD_H - 16;
      const plank = svg({ w: 1180, h: 820, name: 'plank' + row + '-' + y }, [
        piece(rect(-40, y, 1260, 34), C.wood, { rough: 0.8 }),
        piece(rect(-40, y, 1260, 10), shade(C.wood, 0.22), { edge: 'cut', shadow: false, fibre: false }),
      ]);
      this.deck.append(h('div', { class: 'shelf-plank', html: plank }));
    }

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

    const t = thumbArt(entry);
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
