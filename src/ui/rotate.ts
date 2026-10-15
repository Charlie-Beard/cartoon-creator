/**
 * Portrait is not supported: iPadOS ignores orientation locks for web
 * apps, so we show a calm paper-cut screen asking to turn the iPad, with
 * a friendly face (Moon-Face, once the Faraway world is in) beside a
 * little iPad that rotates. The game pauses (ui/pause.ts)
 * and carries on exactly where it was when turned back.
 */
import { star } from '../art/ui';
import { findCharacter } from '../worlds';
import type { Stage } from '../stage';
import { setPortrait } from './pause';

export function installRotateScreen(stage: Stage, el: HTMLElement): void {
  el.innerHTML = `
    <div class="rotate-inner">
      <div class="rotate-owl">${findCharacter('moonface')?.art() ?? star(true, 'rotate')}</div>
      <div class="rotate-ipad"><div class="screen"></div></div>
      <p>Turn the iPad sideways</p>
    </div>`;
  const update = (portrait: boolean) => {
    el.hidden = !portrait;
    document.body.classList.toggle('is-portrait', portrait);
    // Pause: freeze animation, sound and the scenes' timers until the iPad
    // is turned back. Nothing is spoken behind the "turn the iPad" screen.
    setPortrait(portrait);
  };
  stage.onOrientation(update);
  update(stage.isPortrait);
}
