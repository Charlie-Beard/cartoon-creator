/**
 * The grown-ups' corner (behind the gear and its sum): the child's name,
 * the volume, and clearing the watched ticks. Below those, every cartoon
 * on the shelf, with a way to play it from any scene (handy for checking
 * a scene without sitting through the ones before it).
 *
 * Everything applies at once and is saved at once: there is no Save button.
 * It is an ordinary scrollable page on parchment (like the maths game's
 * corner), but every control is still at least 72 px tall.
 */
import { sfx } from '../audio/sfx';
import { C } from '../art/palette';
import { parchment } from '../art/ui';
import { SHELF, type ShelfEntry } from '../cartoons';
import { h, place } from '../ui/dom';
import { Scene, type App } from '../ui/scene';
import { WORLDS } from '../worlds';

const VOLUME_STEPS = 10;

export class CornerScene extends Scene {
  readonly hidesGear = true;
  private body!: HTMLElement;
  private pips: HTMLElement[] = [];
  private level!: HTMLElement;
  private ticks!: HTMLElement;
  private clear!: HTMLButtonElement;
  /** Set once a cartoon has been started, so a second tap can't start it twice. */
  private going = false;

  constructor(app: App) {
    super(app, 'corner parent');
  }

  build(): void {
    const r = this.root;
    r.style.background = C.slate;
    r.append(place(h('div', { html: parchment(1160, 800, 'corner-sheet', C.cream, 1) }), 10, 10, 1160, 800));

    const head = place(h('div', { class: 'p-head' }), 50, 34, 1080, 72);
    head.append(h('h1', {}, 'Grown-ups’ corner'));
    const back = h('button', { class: 'p-btn primary', 'data-back': '' }, 'Back to the cartoons') as HTMLButtonElement;
    this.tap(back, () => {
      sfx.tap();
      this.app.nav.library();
    });
    head.append(back);
    r.append(head);

    this.body = place(h('div', { class: 'p-body' }), 50, 122, 1080, 650);
    r.append(this.body);

    this.body.append(h('h2', {}, 'Settings'));
    this.body.append(this.volumeRow(), this.tickRow());
    this.body.append(h('h2', {}, 'Cartoons'));
    if (!SHELF.length) this.body.append(h('p', { class: 'p-note' }, 'No cartoons yet.'));
    for (const entry of SHELF) this.body.append(this.cartoonRow(entry));
  }

  // -------------------------------------------------------------------------

  /** A labelled row: the words on the left, the controls on the right. */
  private row(title: string, note: string | HTMLElement, controls: HTMLElement[]): HTMLElement {
    const text = h('div', {}, [h('strong', {}, title), typeof note === 'string' ? h('small', {}, note) : note]);
    return h('div', { class: 'p-row' }, [text, h('div', { class: 'p-controls' }, controls)]);
  }

  private volumeRow(): HTMLElement {
    const down = h('button', { class: 'p-btn p-step', 'aria-label': 'Quieter' }, '−');
    const up = h('button', { class: 'p-btn p-step', 'aria-label': 'Louder' }, '+');
    const meter = h('div', { class: 'p-pips', role: 'img', 'aria-label': 'Volume' });
    this.pips = Array.from({ length: VOLUME_STEPS }, (_, i) => meter.appendChild(h('span', { style: `height:${14 + i * 3.4}px` })));
    this.level = h('span', { class: 'p-level-text', 'aria-live': 'polite' });
    const nudge = (by: number) => {
      const s = this.app.settings;
      s.volume = Math.min(1, Math.max(0, Math.round(s.volume * VOLUME_STEPS + by) / VOLUME_STEPS));
      this.app.save();
      this.showVolume();
      sfx.tap();
    };
    down.addEventListener('click', () => nudge(-1));
    up.addEventListener('click', () => nudge(1));
    this.showVolume();
    return this.row('Volume', 'Tap to hear how loud it is.', [down, meter, up, this.level]);
  }

  private showVolume(): void {
    const on = Math.round(this.app.settings.volume * VOLUME_STEPS);
    this.pips.forEach((p, i) => p.classList.toggle('on', i < on));
    this.level.textContent = `${on * 10}%`;
  }

  private tickRow(): HTMLElement {
    this.ticks = h('small', {});
    this.clear = h('button', { class: 'p-btn danger', 'data-clear-ticks': '' }, 'Clear the ticks') as HTMLButtonElement;
    let armed = false;
    // Takes two taps within four seconds, so it can't be done by accident.
    this.clear.addEventListener('click', () => {
      if (!this.app.settings.watched.length) return;
      if (!armed) {
        armed = true;
        this.clear.textContent = 'Tap again to clear';
        this.later(4000, () => {
          armed = false;
          this.showTicks();
        });
        return;
      }
      armed = false;
      this.app.settings.watched = [];
      this.app.save();
      sfx.tap();
      this.showTicks();
    });
    this.showTicks();
    return this.row('Watched ticks', this.ticks, [this.clear]);
  }

  private showTicks(): void {
    const n = this.app.settings.watched.filter((id) => SHELF.some((c) => c.id === id)).length;
    this.ticks.textContent = n ? `He has watched ${n} of ${SHELF.length} cartoon${SHELF.length === 1 ? '' : 's'}.` : 'No ticks on the shelf.';
    this.clear.textContent = 'Clear the ticks';
    this.clear.disabled = !this.app.settings.watched.length;
  }

  private cartoonRow(entry: ShelfEntry): HTMLElement {
    const world = WORLDS[entry.world]?.name ?? entry.world;
    const pick = h('select', { 'aria-label': `Play ${entry.title} from` }, [h('option', { value: '0' }, 'From the start')]) as HTMLSelectElement;
    // The scene names are in the script, so load it to list them.
    void entry
      .load()
      .then((m) => {
        if (!this.alive) return;
        pick.replaceChildren(...m.default.scenes.map((s, i) => h('option', { value: String(i) }, `${i + 1}. ${s.name}`)));
      })
      .catch(() => {});
    const play = h('button', { class: 'p-btn primary', 'data-play': entry.id }, 'Play') as HTMLButtonElement;
    play.addEventListener('click', () => {
      if (this.going) return;
      this.going = true;
      sfx.tap();
      this.app.nav.watch(entry.id, Number(pick.value) || 0);
    });
    const row = this.row(entry.title, `${world}. ${entry.summary}`, [pick, play]);
    row.classList.add('p-cartoon');
    row.dataset.corner = entry.id;
    return row;
  }
}
