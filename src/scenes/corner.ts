/**
 * The grown-ups' corner (behind the gear and its sum): the child's name,
 * the volume, and clearing the watched ticks.
 *
 * SCAFFOLD: the screens workstream builds this out.
 */
import { C } from '../art/palette';
import { banner, sealButton } from '../ui/components';
import { Scene, type App } from '../ui/scene';

export class CornerScene extends Scene {
  readonly hidesGear = true;
  constructor(app: App) {
    super(app, 'corner');
  }

  build(): void {
    this.root.style.background = C.slate;
    this.root.append(banner("Grown-ups' corner", { x: 290, y: 40, w: 600, h: 100, size: 44 }));
    const back = sealButton('back', { x: 20, y: 20, size: 90, color: C.red, aria: 'Back' });
    this.tap(back, () => this.app.nav.library());
    this.root.append(back);
  }
}
