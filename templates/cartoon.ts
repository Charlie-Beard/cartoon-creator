/**
 * <Title>: <one-line summary>.
 *
 * <The whole story, scene by scene, from the beat sheet:>
 *
 *   1. <Scene name>. <What happens.>
 *   2. <Scene name>. <What happens, and his turn: he taps …>
 *   3. <Scene name>. <The scary beat, and how it's put right.>
 *   4. <Scene name>. <The warm ending.>
 *
 * <Anything a later reader needs: who borrows whom, why a choice was made.>
 */
import { defineCartoon, type Kit } from '../kit';

// ------------------------------------------------------------------- art
// One-off art for this cartoon only (see docs/KIT.md "Drawing one-off art").
// Anything a second cartoon could use belongs in the world instead.

// ---------------------------------------------------------------- sounds
// One-off sounds (see docs/KIT.md "Sounds").

// ------------------------------------------------------------------ cast
// Actors made in a scene's `set` and used in its `play`.
const cast = {} as Record<'mf' | 'silky' | 'door', HTMLElement>;

export default defineCartoon({
  id: '<id>',
  title: '<Title>',
  world: '<world>',
  summary: '<One or two sentences for grown-ups.>',
  lines: {
    // In the order they're said. Keys say what the line is.
    hello: { who: 'moonface', text: 'Hello, {name}! Something funny is going on.' },
    askDoor: { who: 'moonface', text: 'The door is stuck! Can you tap it, {name}?' },
    nudgeDoor: { who: 'moonface', text: 'Just tap the door!' },
    pushDoor: { who: 'moonface', text: 'Never mind. One big push!' },
    thanks: { who: 'moonface', text: 'You did it, {name}!' },
    phew: { who: 'moonface', text: 'Phew! It’s open.' },
  },
  scenes: [
    {
      name: '<Scene 1>',
      set(k) {
        k.backdrop('<backdrop-id>');
        k.music('cosy');
        cast.mf = k.character('moonface', { x: 640, y: 350, w: 260 });
        cast.door = k.prop('<prop-id>', { x: 300, y: 380, w: 200 });
      },
      async play(k) {
        await k.say('hello', cast.mf);
        const how = await k.tapToHelp(cast.door, { ask: 'askDoor', nudge: 'nudgeDoor', helped: 'pushDoor', by: cast.mf });
        k.fx.creak();
        await k.say(how === 'tapped' ? 'thanks' : 'phew', cast.mf);
        await cheer(k, cast.mf);
      },
    },
    // … 3–5 scenes in all
  ],
});

/** Helpers shared by several scenes take the kit as their first argument. */
async function cheer(k: Kit, ...who: HTMLElement[]): Promise<void> {
  k.sparkle(590, 300, 16, 180);
  k.fx.twinkle();
  await k.all(...who.map((el, i) => k.wait(i * 120).then(() => k.hop(el, 40, 2))));
}
