/**
 * The library: a shelf of cartoons to pick from. One big paper card per
 * cartoon, in its world's colour, with a tick once he has watched it.
 *
 * SCAFFOLD: a plain grid of cards. The screens workstream gives it a
 * proper shelf (thumbnails of each cartoon's first scene, paging when
 * there are more than fit).
 */
import { sfx } from '../audio/sfx';
import { C } from '../art/palette';
import { SHELF } from '../cartoons';
import { banner } from '../ui/components';
import { h, place } from '../ui/dom';
import { Scene } from '../ui/scene';
import { WORLDS } from '../worlds';

export class LibraryScene extends Scene {
  constructor(app: ConstructorParameters<typeof Scene>[0]) {
    super(app, 'library');
  }

  build(): void {
    const r = this.root;
    r.style.background = C.greenDeep;
    r.append(banner('Cartoons', { x: 390, y: 30, w: 400, h: 100, size: 50 }));
    SHELF.forEach((c, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const card = place(h('button', { class: 'shelf-card', 'data-cartoon': c.id, 'aria-label': c.title }), 90 + col * 340, 170 + row * 300, 320, 270);
      card.style.background = WORLDS[c.world]?.accent ?? C.red;
      card.append(h('span', { class: 'shelf-title' }, c.title));
      if (this.app.settings.watched.includes(c.id)) card.append(h('span', { class: 'shelf-tick', 'aria-label': 'watched' }, '✓'));
      this.tap(card, () => {
        sfx.tap();
        this.app.nav.watch(c.id);
      });
      r.append(card);
    });
  }
}
