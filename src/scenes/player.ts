/**
 * The player: one cartoon, start to finish.
 *
 * Paper curtains in the world's colour open on the title, then each scene
 * plays in turn with a paper wipe between them. A small "next" seal skips
 * to the next scene and a small "home" seal goes back to the shelf. At the
 * end the curtains close, the cartoon is ticked as watched, and one big
 * button goes back to the shelf.
 *
 * His turns (k.tapToHelp) wait for him; everything else just plays.
 */
import { gsap } from 'gsap';
import { sfx } from '../audio/sfx';
import { voice } from '../audio/voice';
import { C } from '../art/palette';
import { piece, rect, svg } from '../art/paper';
import { shelfEntry } from '../cartoons';
import { Kit, type Cartoon } from '../kit';
import { breathe, sm } from '../ui/anim';
import { banner, sealButton } from '../ui/components';
import { h, place } from '../ui/dom';
import { Scene, type App } from '../ui/scene';
import { WORLDS } from '../worlds';

/**
 * Longest one scene may run before the player moves on anyway, so a
 * script bug can never trap him. Scenes are 20–90 s; a tapToHelp can add
 * up to about 30 s more.
 */
const MAX_SCENE_SECONDS = 180;

/** One torn curtain, 640 × 840, with gathered folds. */
function curtain(color: string, side: 'l' | 'r'): string {
  const folds = [0, 1, 2, 3, 4].map((i) =>
    piece(rect(20 + i * 124, -20, 70, 880), 'rgba(0,0,0,0.12)', { edge: 'torn', fibre: false, shadow: false, rough: 2 }),
  );
  return svg({ w: 640, h: 840, name: 'curtain-' + side + color }, [
    piece(rect(-10, -20, 660, 880), color, { rough: 2.4 }),
    ...folds,
    piece(rect(-10, -20, 660, 70), C.gold, { edge: 'cut', fibre: false }),
  ]);
}

export class PlayerScene extends Scene {
  readonly hidesGear = true;
  private id: string;
  private from: number;
  private stage!: HTMLElement;
  private left!: HTMLElement;
  private right!: HTMLElement;
  private finished = false;
  private kit: Kit | null = null;
  /** Bumped to skip the scene playing now. */
  private sceneNo = 0;
  private skipScene: (() => void) | null = null;
  private cartoon: Promise<Cartoon | null>;

  constructor(app: App, id: string, from = 0) {
    super(app, 'story player');
    this.id = id;
    this.from = from;
    const entry = shelfEntry(id);
    this.cartoon = entry ? entry.load().then((m) => m.default, () => null) : Promise.resolve(null);
  }

  build(): void {
    const r = this.root;
    r.style.background = C.night;
    this.stage = h('div', { class: 'story-stage' });
    r.append(this.stage);
    const accent = WORLDS[shelfEntry(this.id)?.world ?? '']?.accent ?? C.red;
    this.left = place(h('div', { class: 'story-curtain', html: curtain(accent, 'l') }), -20, -10, 640, 840);
    this.right = place(h('div', { class: 'story-curtain', html: curtain(accent, 'r') }), 560, -10, 640, 840);
    this.right.style.transform = 'scaleX(-1)';
    r.append(this.left, this.right);

    const home = sealButton('home', { x: 14, y: 14, size: 72, color: C.slate, aria: 'Back to the shelf', name: 'player-home' });
    this.tap(home, () => {
      sfx.tap();
      this.done();
    });
    const skip = sealButton('next', { x: 1094, y: 14, size: 72, color: C.slate, aria: 'Skip this scene', name: 'player-skip' });
    skip.dataset.skip = '';
    this.tap(skip, () => {
      sfx.tap();
      this.skipScene?.();
    });
    r.append(home, skip);
  }

  async enter(): Promise<void> {
    const cartoon = await this.cartoon;
    if (!this.alive) return;
    if (!cartoon || !cartoon.scenes.length) return this.done();
    const world = WORLDS[cartoon.world] ?? WORLDS.common;

    const title = banner(cartoon.title, { x: 240, y: 330, w: 700, h: 130, size: 52 });
    title.classList.add('story-title');
    this.root.append(title);

    const kit = (this.kit = new Kit({
      root: this.stage,
      world,
      name: this.app.settings.name,
      lines: cartoon.lines,
      alive: () => this.alive && !this.finished,
    }));
    void voice.preload({ lines: Object.values(cartoon.lines).map((l) => ({ text: l.text, who: l.who })) });

    // Curtain up on the first scene's set.
    const first = Math.min(Math.max(0, this.from), cartoon.scenes.length - 1);
    sfx.fanfare();
    await sm(title, 0.4, { startAt: { scale: 0.4, rotation: -6, opacity: 0 }, scale: 1, rotation: 0, opacity: 1, ease: 'back.out(1.8)' });
    cartoon.scenes[first].set(kit);
    await this.sleep(1500);
    sfx.whoosh();
    void sm(title, 0.3, { opacity: 0, y: -40 }).then(() => title.remove());
    await Promise.all([sm(this.left, 0.9, { x: -640, ease: 'power2.inOut' }), sm(this.right, 0.9, { x: 640, ease: 'power2.inOut' })]);

    for (let i = first; i < cartoon.scenes.length; i++) {
      if (!this.alive || this.finished) return;
      const s = cartoon.scenes[i];
      const no = ++this.sceneNo;
      const view = kit.scoped(() => this.sceneNo === no);
      this.root.dataset.scene = String(i);
      if (i > first) await kit.scoped(() => this.sceneNo === no).cut(() => s.set(view));
      const skipped = new Promise<void>((resolve) => (this.skipScene = resolve));
      await Promise.race([s.play(view), skipped, this.sleep(MAX_SCENE_SECONDS * 1000)]);
      // From here the old scene's script is stopped: its waits never resolve.
      this.sceneNo++;
      this.skipScene = null;
      voice.stop();
      kit.caption('');
      if (i < cartoon.scenes.length - 1) await this.sleep(400);
    }
    if (!this.alive || this.finished) return;
    await this.sleep(600);
    kit.dispose();
    this.markWatched();

    // Curtain down, then one big button back to the shelf.
    sfx.whoosh();
    await Promise.all([sm(this.left, 0.8, { x: 0, ease: 'power2.inOut' }), sm(this.right, 0.8, { x: 0, ease: 'power2.inOut' })]);
    this.root.querySelectorAll<HTMLElement>(':scope > .seal-btn').forEach((b) => (b.style.display = 'none'));
    const end = banner('The End', { x: 340, y: 170, w: 500, h: 120, size: 56 });
    end.classList.add('story-title');
    const next = sealButton('home', { x: 515, y: 380, size: 150, color: C.red, aria: 'Back to the shelf', name: 'player-end' });
    next.dataset.end = '';
    this.tap(next, () => {
      sfx.tap();
      this.done();
    });
    this.root.append(end, next);
    void sm(next, 0.35, { startAt: { scale: 0 }, scale: 1, ease: 'back.out(2)' });
    this.onCleanup(breathe(next, 0.06, 1.6));
  }

  leave(): void {
    voice.stop();
  }

  destroy(): void {
    this.kit?.dispose();
    gsap.killTweensOf(this.stage.querySelectorAll('*'));
    super.destroy();
  }

  private markWatched(): void {
    const s = this.app.settings;
    if (!s.watched.includes(this.id)) {
      s.watched.push(this.id);
      this.app.save();
    }
  }

  private done(): void {
    if (this.finished) return;
    this.finished = true;
    voice.stop();
    this.kit?.dispose();
    this.app.nav.library();
  }
}
