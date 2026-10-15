import '@fontsource/andika/latin-400.css';
import '@fontsource/andika/latin-700.css';
import './styles/base.css';
import './styles/paper.css';
import './styles/ui.css';
import './styles/parent.css';
import './styles/story.css';
import './styles/cartoons.css';
import { installGrain } from './art/grain';
import { parchmentDefs, uiDefs } from './art/ui';
import { setVolumes, unlock } from './audio/engine';
import { loadManifest, setPlayerName } from './audio/voice';
import { CornerScene } from './scenes/corner';
import { LibraryScene } from './scenes/library';
import { PlayerScene } from './scenes/player';
import { loadSettings, saveSettings } from './save/settings';
import { Stage } from './stage';
import { Director } from './ui/director';
import { h } from './ui/dom';
import { installGear } from './ui/gear';
import { installRotateScreen } from './ui/rotate';
import type { App } from './ui/scene';

const stage = new Stage(document.getElementById('stage')!);
installRotateScreen(stage, document.getElementById('rotate')!);

installGrain();
document.body.insertAdjacentHTML('beforeend', uiDefs() + parchmentDefs());
stage.el.append(h('div', { class: 'vignette' }), h('div', { class: 'grain' }));

const director = new Director(stage.el);
const settings = loadSettings();

const app: App = {
  stage,
  settings,
  nav: {
    library: () => void director.go(new LibraryScene(app)),
    watch: (id, from) => void director.go(new PlayerScene(app, id, from)),
    corner: () => void director.go(new CornerScene(app)),
  },
  save: () => {
    saveSettings(settings);
    applySettings();
  },
  go: (scene, t) => director.go(scene, t),
};
installGear(stage.el, () => app.nav.corner());

// Audio can only start inside a tap on iPad.
let audioOn = false;
window.addEventListener(
  'pointerdown',
  () => {
    void unlock().then(() => {
      audioOn = true;
      applySettings();
    });
  },
  { once: true },
);
void loadManifest();

function applySettings(): void {
  setPlayerName(settings.name);
  if (audioOn) setVolumes({ master: settings.volume });
}
applySettings();

// Dev shortcuts: ?cartoon=lost-kettle&scene=2   ?scene=corner
const q = new URLSearchParams(location.search);
const cartoon = q.get('cartoon');
if (cartoon) app.nav.watch(cartoon, Number(q.get('scene')) || 0);
else if (q.get('scene') === 'corner') app.nav.corner();
else app.nav.library();

// Offline support (production builds only): see vite.config.ts.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
    if (navigator.serviceWorker.controller) {
      let reloaded = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (reloaded) return;
        reloaded = true;
        location.reload();
      });
    }
    void navigator.serviceWorker.ready.then((r) => r.active?.postMessage('fill-audio'));
  });
}
