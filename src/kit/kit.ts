/**
 * The kit: the stage and its tools, handed to every scene of a cartoon.
 *
 * Ported from the story kit both games use (Wizard Words and Up the
 * Faraway Tree), with the games taken out: characters, backdrops and
 * props come from the worlds (src/worlds) by id. Nothing on stage waits
 * for a tap: the cartoon just plays, start to end.
 *
 * Actors are absolutely placed <div>s on the 1180 × 820 stage. Animate the
 * actor itself freely (x, y, rotation, scale, opacity); mirroring is done
 * on an inner wrapper so it never fights a tween.
 *
 * Movement is smooth (see ui/anim.ts). Nothing flashes. See docs/KIT.md
 * for the whole API with examples.
 */
import { gsap } from 'gsap';
import { sfx } from '../audio/sfx';
import { fx, musicBed, type Mood, type MusicBed } from '../audio/synth';
import { voice } from '../audio/voice';
import { C } from '../art/palette';
import { circle, curve, piece, rng, svg, type Pt } from '../art/paper';
import { parchment, star } from '../art/ui';
import type { Line } from '../core/cartoon';
import { stepped } from '../ui/anim';
import { h, place, wait } from '../ui/dom';
import { findBackdrop, findCharacter, findProp, type World } from '../worlds';

export type Side = 'left' | 'right' | 'top' | 'bottom';

export interface PlaceOpts {
  /** Top-left corner on the 1180 × 820 stage. */
  x: number;
  y: number;
  /** Size on stage. Defaults to the art's natural size (portraits 300 × 340). */
  w?: number;
  h?: number;
  /** Stacking order: higher is in front. Default 10. */
  z?: number;
  /** Mirror left-to-right (to face the other way). */
  flip?: boolean;
  /** Shows only part of the art: an SVG viewBox "x y w h". */
  crop?: string;
  /** Kept for the art that set it in the games: art is always still now. */
  still?: boolean;
}

/** The state every scene's view of the kit shares (see `Kit.scoped`). */
interface Show {
  bed: MusicBed | null;
  captionEl: HTMLElement;
  captionLine: HTMLElement;
  tag: HTMLElement;
  /** Idle loops (ambient motes, floats) that hold still while he's tapping. */
  idle: gsap.core.Tween[];
}

export class Kit<K extends string = string> {
  /**
   * The cartoon's world: the 1180 × 820 layer the backdrop and actors live
   * in. The camera moves and zooms it; captions and the scene-cut sheet
   * sit above it, on the stage.
   */
  readonly root: HTMLElement;
  /** The outer stage (captions, overlays). */
  readonly stage: HTMLElement;
  /** The world the cartoon is set in. */
  readonly world: World;
  /** Ready-made sound effects (UI sounds and story sounds). */
  readonly sfx = sfx;
  readonly fx = fx;

  private lines: Record<string, Line>;
  private alive: () => boolean;
  private show: Show;

  constructor(o: { root: HTMLElement; world: World; lines: Record<string, Line>; alive: () => boolean }) {
    this.stage = o.root;
    this.root = h('div', { class: 'story-world' });
    this.stage.append(this.root);
    this.world = o.world;
    this.lines = o.lines;
    this.alive = o.alive;
    // No captions are shown: the voices carry the story. The caption box is
    // still kept up to date, hidden, because the screenshot and pacing
    // tools read it to know which line is being said and when.
    const captionEl = place(h('div', { class: 'story-caption', hidden: '' }), 150, 690, 880, 110);
    const box = h('div', { class: 'story-caption-text' });
    const tag = h('div', { class: 'story-tag', style: `background:${o.world.accent}` });
    const captionLine = h('span');
    box.append(tag, captionLine);
    captionEl.append(box);
    this.stage.append(captionEl);
    this.show = { bed: null, captionEl, captionLine, tag, idle: [] };
  }

  /**
   * A view of this kit for one scene. Its waits and tweens stop for good
   * (never resolve) once `alive` says no, so a skipped scene's script just
   * stops where it was while the next scene plays on the same stage.
   */
  scoped(alive: () => boolean): Kit<K> {
    const view = Object.create(this) as Kit<K>;
    const outer = this.alive;
    Object.defineProperty(view, 'alive', { value: () => outer() && alive() });
    return view;
  }

  /** Stops the music. Called by the player when the show ends. */
  dispose(): void {
    this.show.bed?.stop();
    this.show.bed = null;
  }

  // ---------------------------------------------------------------- building

  /**
   * Sets the full-stage background: a backdrop id from the worlds
   * ('meadow', 'tree-trunk' …), or any SVG string 1180 × 820. Replaces any
   * previous one.
   */
  backdrop(idOrArt: string): HTMLElement {
    const art = idOrArt.trimStart().startsWith('<') ? idOrArt : findBackdrop(idOrArt, this.world.id)?.art();
    if (!art) throw new Error(`No backdrop "${idOrArt}"`);
    this.root.querySelector(':scope > .story-backdrop')?.remove();
    const el = h('div', { class: 'story-backdrop', html: art });
    this.root.prepend(el);
    return el;
  }

  /** Puts any art (an SVG or HTML string) on stage as an actor. */
  add(art: string, o: PlaceOpts): HTMLElement {
    const html = o.crop ? art.replace(/viewBox="[^"]*"/, `viewBox="${o.crop}"`) : art;
    const natural = /viewBox="[\d.-]+ [\d.-]+ ([\d.]+) ([\d.]+)"/.exec(html);
    const w = o.w ?? (natural ? +natural[1] : 300);
    const hh = o.h ?? (natural ? (+natural[2] / +natural[1]) * w : 300);
    const el = place(h('div', { class: 'story-actor still' }), o.x, o.y, w, hh);
    el.style.zIndex = String(o.z ?? 10);
    const inner = h('div', { class: 'story-flip', html });
    if (o.flip) inner.style.transform = 'scaleX(-1)';
    el.dataset.flip = o.flip ? '1' : '0'; // mirrored or not (which way the art faces unmirrored isn't recorded)
    el.append(inner);
    this.root.append(el);
    return el;
  }

  /**
   * A character by id, from any world (moonface, silky, hedwig …), in
   * their default portrait or a named pose. Default width 260.
   */
  character(id: string, o: PlaceOpts & { pose?: string }): HTMLElement {
    const c = findCharacter(id);
    if (!c) throw new Error(`No character "${id}"`);
    const draw = o.pose ? c.poses?.[o.pose] : c.art;
    if (!draw) throw new Error(`${c.name} has no pose "${o.pose}"`);
    const el = this.add(draw(), { w: 260, ...o });
    el.dataset.who = id;
    el.dataset.actor = id; // for scripts/shots.mjs (frame checks): which character this is
    if (o.pose) el.dataset.pose = o.pose;
    return el;
  }

  /** Changes a character's pose in place ('default' for their portrait). */
  pose(el: HTMLElement, pose: string): void {
    const c = findCharacter(el.dataset.who ?? '');
    const draw = pose === 'default' ? c?.art : c?.poses?.[pose];
    if (!draw) throw new Error(`${c?.name ?? 'That actor'} has no pose "${pose}"`);
    const inner = el.querySelector<HTMLElement>(':scope > .story-flip');
    if (inner) inner.innerHTML = draw();
    el.dataset.pose = pose;
  }

  /** A prop by id, from the cartoon's world first, then any other. */
  prop(id: string, o: PlaceOpts): HTMLElement {
    const p = findProp(id, this.world.id);
    if (!p) throw new Error(`No prop "${id}"`);
    const [w] = p.size ?? [120, 120];
    const el = this.add(p.art(), { w, ...o });
    el.dataset.prop = id;
    return el;
  }

  /**
   * Where an actor is now, in stage points: the box it was placed in, moved
   * by whatever `k.to` has done to its x and y (scale and rotation aside).
   * `face` is a portrait's face box (characters are drawn on a 300 × 340
   * grid with the face in 78 62 144 144; poses may differ), for putting a
   * hat on a head, a sparkle on a nose or the camera on a face; `top` is the
   * middle of the box's top edge and `feet` the middle of its bottom.
   *
   *   const { face } = k.box(harry);
   *   k.prop('admiral-hat', { x: face.cx - 75, y: face.y - 70, w: 150 });   // on his head
   */
  box(el: HTMLElement): { x: number; y: number; w: number; h: number; top: Pt; feet: Pt; face: { x: number; y: number; w: number; h: number; cx: number; cy: number } } {
    const x = (parseFloat(el.style.left) || 0) + (Number(gsap.getProperty(el, 'x')) || 0);
    const y = (parseFloat(el.style.top) || 0) + (Number(gsap.getProperty(el, 'y')) || 0);
    const w = parseFloat(el.style.width) || 0;
    const h = parseFloat(el.style.height) || 0;
    const face = { x: x + (w * 78) / 300, y: y + (h * 62) / 340, w: (w * 144) / 300, h: (h * 144) / 340, cx: 0, cy: 0 };
    face.cx = face.x + face.w / 2;
    face.cy = face.y + face.h / 2;
    return { x, y, w, h, top: [x + w / 2, y], feet: [x + w / 2, y + h], face };
  }

  /**
   * Lettering as an actor, in Andika: a name on a cake, a sign, a word on a
   * letter. `x`, `y` is the middle of the text; it is drawn fresh each time,
   * so it can carry any words.
   * Long text shrinks to fit `w` if you give one.
   *
   *   k.lettering('Hooray!', { x: 590, y: 618, size: 24, color: '#b5476b', z: 15 });
   */
  lettering(text: string, o: { x: number; y: number; size?: number; color?: string; w?: number; z?: number; weight?: number }): HTMLElement {
    const size = o.size ?? 28;
    const safe = text.replace(/[<>&"]/g, '');
    const natural = Math.max(size, safe.length * size * 0.56);
    const w = o.w ?? natural;
    const fit = o.w && natural > o.w ? ` textLength="${o.w}" lengthAdjust="spacingAndGlyphs"` : '';
    const hgt = size * 1.4;
    const art = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${hgt}"><text x="${w / 2}" y="${size * 1.02}" font-family="Andika, sans-serif" font-weight="${o.weight ?? 700}" font-size="${size}" fill="${o.color ?? C.ink}" text-anchor="middle"${fit}>${safe}</text></svg>`;
    return this.add(art, { x: o.x - w / 2, y: o.y - hgt / 2, w, h: hgt, z: o.z ?? 15 });
  }

  /** Changes an actor's mirroring. */
  face(el: HTMLElement, flip: boolean): void {
    const inner = el.querySelector<HTMLElement>(':scope > .story-flip');
    if (inner) inner.style.transform = flip ? 'scaleX(-1)' : '';
    el.dataset.flip = flip ? '1' : '0';
  }

  /** Removes an actor. */
  remove(el: HTMLElement): void {
    gsap.killTweensOf(el);
    el.remove();
  }

  // ------------------------------------------------------------------- time

  /** Waits. If the scene is skipped, never resolves (the script just stops). */
  wait(ms: number): Promise<void> {
    if (!this.alive()) return never();
    return wait(ms).then(() => (this.alive() ? undefined : never()));
  }

  /** Runs things at the same time and waits for all of them. */
  all(...steps: Promise<unknown>[]): Promise<void> {
    return Promise.all(steps).then(() => (this.alive() ? undefined : never()));
  }

  // ----------------------------------------------------------------- speech

  /**
   * Says a line (by key), and makes the speaker bob (and
   * their mouth move) while talking. Resolves when it has been said.
   */
  async say(key: K, speaker?: HTMLElement): Promise<void> {
    if (!this.alive()) return never();
    const line = this.lines[key];
    if (!line) throw new Error(`No line "${key}"`);
    const text = line.text;
    this.caption(text, line.who);
    const stopBob = speaker ? this.talk(speaker) : () => {};
    this.show.bed?.duck(true);
    // A stuck clip must never stall the show.
    await Promise.race([voice.say(line.text, line.who), wait(1500 + text.length * 110)]);
    this.show.bed?.duck(false);
    stopBob();
    await this.wait(250);
  }

  /**
   * Sets the (hidden) caption without speech ('' clears it). With `who` (a
   * character id), a name tag with their little face sits on it. Nothing
   * shows on screen: captions are hidden for good (see the constructor).
   */
  caption(text: string, who?: string): void {
    const { captionEl, captionLine, tag } = this.show;
    if (!text) {
      captionEl.classList.remove('on');
      return;
    }
    captionLine.textContent = text;
    const c = who && who !== 'narrator' ? findCharacter(who) : undefined;
    tag.hidden = !c;
    if (c && tag.dataset.who !== who) {
      tag.dataset.who = who;
      // Just the face, in a little round frame.
      const face = c.art().replace(/viewBox="[^"]*"/, `viewBox="${c.chip ?? '78 62 144 144'}"`);
      tag.innerHTML = `<span class="story-chip">${face}</span><span>${c.name}</span>`;
    }
    captionEl.classList.toggle('narrator', !c);
    captionEl.classList.add('on');
  }

  /** Makes an actor bob gently as if talking, until the returned stopper is called. */
  talk(el: HTMLElement): () => void {
    // The mouth opens and shuts (art with a `mouthOpen` part).
    const shut = this.part(el, 'mouth');
    const open = this.part(el, 'mouthOpen');
    let flap: ReturnType<typeof setInterval> | null = null;
    if (open.length) {
      let isOpen = false;
      flap = setInterval(() => {
        isOpen = !isOpen;
        open.forEach((m) => (m.style.opacity = isOpen ? '1' : '0'));
        shut.forEach((m) => (m.style.opacity = isOpen ? '0' : '1'));
      }, 170);
    }
    const tw = gsap.to(el, { y: '-=6', rotation: '+=2', duration: 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    el.dataset.speaking = ''; // for scripts/shots.mjs: who is talking in this frame
    let stopped = false;
    return () => {
      if (stopped) return;
      stopped = true;
      delete el.dataset.speaking;
      if (flap) clearInterval(flap);
      open.forEach((m) => (m.style.opacity = '0'));
      shut.forEach((m) => (m.style.opacity = '1'));
      tw?.progress(0).kill();
    };
  }

  /**
   * An actor's named parts (`data-part` groups in its art: eyes, mouth,
   * armL, armR, lids, wingL …; each character lists its own `parts`).
   * Animate them with k.to(); rotate with `rotation`, never "rotate(n x y)".
   */
  part(el: HTMLElement, name: string): SVGGElement[] {
    return [...el.querySelectorAll<SVGGElement>(`[data-part="${name}"]`)];
  }

  /**
   * Makes parts turn about their own joints (a leg at the hip, an arm at
   * the shoulder). The art gives each part its pivot as a transform-origin;
   * GSAP needs it as an svgOrigin to rotate about it. Returns the parts.
   */
  pivot(gs: SVGGElement[]): SVGGElement[] {
    for (const g of gs) {
      // Only once: setting the origin again on a part already turned makes it jump.
      if (g.dataset.pivoted) continue;
      const [x, y] = g.style.transformOrigin.split(' ').map(parseFloat);
      if (Number.isNaN(x)) continue;
      this.set(g, { svgOrigin: `${x} ${y}` });
      g.dataset.pivoted = '1';
    }
    return gs;
  }

  /** A quick blink (art with `lids`). */
  async blink(el: HTMLElement): Promise<void> {
    const lids = this.part(el, 'lids');
    if (!lids.length) return;
    lids.forEach((l) => (l.style.opacity = '1'));
    await this.wait(140);
    lids.forEach((l) => (l.style.opacity = '0'));
  }

  // ---------------------------------------------------------- done deeds

  /**
   * The moment something is done (the cloud blows away, the door opens, the
   * candles go out): a chime and a burst of paper stars on `el`'s middle.
   */
  flourish(el: Element): void {
    if (!this.alive()) return;
    const [x, y] = this.middle(el);
    sfx.sparkle();
    this.sparkle(x, y, 12, 120);
  }

  /**
   * Somebody carries `item` to `to` (the key to the lock, the letter to the
   * owl): it glides until its middle is on `to` (an actor's middle, or a
   * point in world coordinates, the ones `place` and `k.box` use), then a
   * flourish.
   */
  async carry(item: HTMLElement, to: HTMLElement | Pt, seconds = 0.9): Promise<void> {
    if (!this.alive()) return never();
    const [sx, sy] = this.middle(item);
    const [dx, dy] = to instanceof HTMLElement ? this.middle(to) : to;
    const x = Number(gsap.getProperty(item, 'x')) || 0;
    const y = Number(gsap.getProperty(item, 'y')) || 0;
    await this.to(item, seconds, { x: x + dx - sx, y: y + dy - sy, ease: 'power2.inOut' });
    this.flourish(item);
  }

  /** An actor's middle in world coordinates (the camera taken out). */
  private middle(el: Element): Pt {
    const s = this.stage.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const k = s.width / 1180 || 1;
    const z = Number(gsap.getProperty(this.root, 'scale')) || 1;
    const cx = Number(gsap.getProperty(this.root, 'x')) || 0;
    const cy = Number(gsap.getProperty(this.root, 'y')) || 0;
    return [((r.left + r.width / 2 - s.left) / k - cx) / z, ((r.top + r.height / 2 - s.top) / k - cy) / z];
  }

  // ----------------------------------------------------------------- motion

  /** A smooth eased tween. Resolves when it ends. */
  to(el: gsap.TweenTarget, seconds: number, vars: gsap.TweenVars & { ease?: string }): Promise<void> {
    if (!this.alive()) return never();
    return new Promise((resolve) => {
      // Also carry on if the tween is killed early (its actor removed, or overwritten).
      const done = () => this.alive() && resolve();
      gsap.to(el, { ...vars, duration: seconds, ease: stepped(seconds, vars.ease ?? 'power2.inOut'), onComplete: done, onInterrupt: done });
    });
  }

  /** Sets properties instantly. */
  set(el: gsap.TweenTarget, vars: gsap.TweenVars): void {
    gsap.set(el, vars);
  }

  /** Slides an actor in from off stage to where it was placed. */
  enter(el: HTMLElement, from: Side, seconds = 0.7): Promise<void> {
    this.set(el, { ...offstage(el, from), opacity: 1 });
    return this.to(el, seconds, { x: 0, y: 0, ease: 'back.out(1.2)' });
  }

  /** Slides an actor off stage. */
  exit(el: HTMLElement, to: Side, seconds = 0.6): Promise<void> {
    return this.to(el, seconds, { ...offstage(el, to), ease: 'power2.in' });
  }

  /** Moves an actor (relative to where it was placed) along a little hopping path. */
  async walk(el: HTMLElement, dx: number, seconds = 1, hops = 4): Promise<void> {
    const each = seconds / hops;
    for (let i = 0; i < hops; i++) {
      await this.all(
        this.to(el, each, { x: `+=${dx / hops}`, ease: 'none' }),
        this.to(el, each / 2, { y: '-=14', ease: 'power1.out' }).then(() => this.to(el, each / 2, { y: '+=14', ease: 'power1.in' })),
      );
    }
  }

  /** A happy jump (or several). */
  async hop(el: HTMLElement, height = 50, times = 1): Promise<void> {
    for (let i = 0; i < times; i++) {
      await this.to(el, 0.22, { y: `-=${height}`, ease: 'power2.out' });
      await this.to(el, 0.22, { y: `+=${height}`, ease: 'power2.in' });
    }
  }

  /** A quick wobble from side to side (surprise, fear, laughing). */
  async shake(el: HTMLElement, amount = 10, times = 3): Promise<void> {
    for (let i = 0; i < times; i++) {
      await this.to(el, 0.1, { x: `+=${amount}`, rotation: '+=3', ease: 'sine.out' });
      await this.to(el, 0.16, { x: `-=${amount * 2}`, rotation: '-=6', ease: 'sine.inOut' });
      await this.to(el, 0.1, { x: `+=${amount}`, rotation: '+=3', ease: 'sine.in' });
    }
  }

  /** Spins an actor a number of whole turns. */
  spin(el: HTMLElement, turns = 1, seconds = 0.8): Promise<void> {
    return this.to(el, seconds, { rotation: `+=${360 * turns}`, ease: 'power1.inOut' });
  }

  /** A squash-and-stretch pop (something lands or appears). */
  async pop(el: HTMLElement, amount = 1.15): Promise<void> {
    await this.to(el, 0.1, { scale: amount, ease: 'power1.out' });
    await this.to(el, 0.25, { scale: 1, ease: 'back.out(3)' });
  }

  /** Grows an actor in from nothing. */
  appear(el: HTMLElement, seconds = 0.4): Promise<void> {
    this.set(el, { scale: 0, opacity: 1 });
    return this.to(el, seconds, { scale: 1, ease: 'back.out(1.8)' });
  }

  /** Shrinks an actor to nothing and removes it. */
  async vanish(el: HTMLElement, seconds = 0.35): Promise<void> {
    await this.to(el, seconds, { scale: 0, opacity: 0, ease: 'back.in(1.6)' });
    el.remove();
  }

  /** Fades an actor in or out (or anything GSAP can tween: a list of parts, `k.part(cake, 'flames')`). */
  fade(el: gsap.TweenTarget, to: number, seconds = 0.5): Promise<void> {
    return this.to(el, seconds, { opacity: to, ease: 'none' });
  }

  /** Floats an actor gently up and down until the scene ends (idle life). Holds still while he's tapping. */
  float(el: HTMLElement, amount = 8, period = 2): void {
    this.show.idle.push(gsap.to(el, { y: `-=${amount}`, duration: period / 2, yoyo: true, repeat: -1, ease: stepped(period / 2, 'sine.inOut') }));
  }

  /** Shakes the whole stage (a big stomp or crash). Gentle and short. */
  async quake(amount = 8): Promise<void> {
    for (const dx of [amount, -amount, amount * 0.6, -amount * 0.6]) await this.to(this.root, 0.08, { x: `+=${dx}`, ease: 'sine.inOut' });
  }

  // -------------------------------------------------------------- particles

  /** A burst of paper stars at a point. */
  sparkle(x: number, y: number, count = 14, spread = 160): void {
    if (!this.alive()) return;
    for (let i = 0; i < count; i++) {
      const p = place(h('div', { class: 'particle', html: star(true, `story${i % 3}`) }), x, y);
      p.style.zIndex = '50';
      this.root.append(p);
      const a = Math.random() * Math.PI * 2;
      const r = spread * (0.4 + Math.random() * 0.6);
      gsap.to(p, {
        x: Math.cos(a) * r,
        y: Math.sin(a) * r + 40,
        rotation: Math.random() * 360,
        scale: 0.4,
        opacity: 0,
        duration: 0.9 + Math.random() * 0.5,
        ease: stepped(1.2, 'power2.out'),
        onComplete: () => p.remove(),
      });
    }
  }

  /** A puff of paper smoke at a point (appearing, disappearing, crashes). */
  puff(x: number, y: number, size = 160, color: string = C.stoneLight): void {
    if (!this.alive()) return;
    const el = this.add(cloud(color), { x: x - size / 2, y: y - size / 2, w: size, h: size, z: 40 });
    gsap.set(el, { scale: 0.3, opacity: 0.95 });
    const d = 0.9;
    gsap.to(el, { scale: 1.3, opacity: 0, rotation: 20, duration: d, ease: stepped(d, 'power2.out'), onComplete: () => el.remove() });
  }

  /** Confetti falling from the top (the big happy ending). */
  confetti(count = 30): void {
    if (!this.alive()) return;
    const colors = [C.gold, C.red, C.blue, C.green, C.goldLight, C.pink];
    for (let i = 0; i < count; i++) {
      const c = colors[i % colors.length];
      const p = place(h('div', { class: 'story-confetti', style: `background:${c}` }), 100 + Math.random() * 980, -30);
      p.style.zIndex = '55';
      this.root.append(p);
      const d = 2.2 + Math.random() * 1.2;
      gsap.to(p, {
        y: 900,
        x: (Math.random() - 0.5) * 260,
        rotation: Math.random() * 720,
        duration: d,
        delay: Math.random() * 0.8,
        ease: stepped(d, 'power1.in'),
        onComplete: () => p.remove(),
      });
    }
  }

  /**
   * A soft wash of colour over the whole stage that fades in and out (a
   * spell's light, a door opening). Never a strobe.
   */
  async glow(color: string = C.candle, strength = 0.5, seconds = 0.8): Promise<void> {
    const el = place(h('div', { class: 'story-wash', style: `background:${color}` }), 0, 0, 1180, 820);
    this.stage.insertBefore(el, this.show.captionEl);
    gsap.set(el, { opacity: 0 });
    await this.to(el, seconds / 2, { opacity: Math.min(strength, 0.6), ease: 'sine.out' });
    await this.to(el, seconds / 2, { opacity: 0, ease: 'sine.in' });
    el.remove();
  }

  /** A magic beam from one point to another (a spell being cast). */
  async beam(from: Pt, to: Pt, color: string = C.goldLight, seconds = 0.35): Promise<void> {
    const len = Math.hypot(to[0] - from[0], to[1] - from[1]);
    const ang = (Math.atan2(to[1] - from[1], to[0] - from[0]) * 180) / Math.PI;
    const el = place(h('div', { class: 'story-beam', style: `background:${color};box-shadow:0 0 18px ${color}` }), from[0], from[1] - 7, len, 14);
    el.style.zIndex = '45';
    this.root.append(el);
    gsap.set(el, { rotation: ang, transformOrigin: '0% 50%', scaleX: 0 });
    await this.to(el, seconds, { scaleX: 1, ease: 'power2.out' });
    this.sparkle(to[0], to[1], 10, 90);
    await this.to(el, 0.25, { opacity: 0, ease: 'none' });
    el.remove();
  }

  // ------------------------------------------------------------- atmosphere

  /**
   * Starts quiet background music in a mood (replacing any already
   * playing). It dips under every spoken line, carries on across scene
   * cuts, and fades out at the end.
   */
  music(mood: Mood): void {
    if (!this.alive()) return;
    this.show.bed?.stop();
    this.show.bed = musicBed(mood);
  }

  /** Stops the background music (it fades). */
  silence(): void {
    this.show.bed?.stop();
    this.show.bed = null;
  }

  /**
   * Fills the scene with slow, looping atmosphere: floating dust motes,
   * fireflies, snow, rain, bubbles, rising embers or twinkling stars.
   * In front of the actors unless `z` says otherwise.
   */
  ambient(kind: 'dust' | 'fireflies' | 'snow' | 'rain' | 'bubbles' | 'embers' | 'stars', o: { count?: number; z?: number; area?: [number, number, number, number] } = {}): void {
    if (!this.alive()) return;
    const idle = (t: gsap.core.Tween) => this.show.idle.push(t);
    const [ax, ay, aw, ah] = o.area ?? [0, 0, 1180, 690];
    const look = {
      dust: { size: [3, 6], color: C.goldLight, glow: 6, opacity: 0.55 },
      fireflies: { size: [5, 8], color: '#e9f59a', glow: 14, opacity: 0.9 },
      snow: { size: [4, 9], color: C.white, glow: 0, opacity: 0.85 },
      rain: { size: [2, 2], color: '#b9cde6', glow: 0, opacity: 0.4 },
      bubbles: { size: [7, 16], color: 'transparent', glow: 0, opacity: 0.7 },
      embers: { size: [3, 6], color: C.orange, glow: 10, opacity: 0.85 },
      stars: { size: [3, 6], color: C.cream, glow: 8, opacity: 0.8 },
    }[kind];
    const n = o.count ?? { dust: 26, fireflies: 14, snow: 40, rain: 60, bubbles: 18, embers: 22, stars: 30 }[kind];
    const d = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
    for (let i = 0; i < n; i++) {
      const sz = d(look.size[0], look.size[1]);
      const x = ax + Math.random() * aw;
      const y = ay + Math.random() * ah;
      const style =
        kind === 'rain'
          ? `width:2px;height:24px;background:${look.color};transform:rotate(12deg)`
          : kind === 'bubbles'
            ? `width:${sz}px;height:${sz}px;border:2px solid rgba(255,255,255,0.75);border-radius:50%`
            : `width:${sz}px;height:${sz}px;border-radius:50%;background:${look.color};box-shadow:0 0 ${look.glow}px ${look.color}`;
      const p = place(h('div', { class: 'story-mote', style }), x, y);
      p.style.zIndex = String(o.z ?? 30);
      p.style.opacity = String(look.opacity * d(0.5, 1));
      this.root.append(p);
      if (kind === 'dust') {
        idle(gsap.to(p, { x: d(-60, 60), y: d(-120, -40), duration: d(6, 11), yoyo: true, repeat: -1, ease: stepped(8, 'sine.inOut'), delay: -d(0, 8) }));
      } else if (kind === 'fireflies') {
        idle(gsap.to(p, { x: d(-90, 90), y: d(-70, 70), duration: d(4, 7), yoyo: true, repeat: -1, ease: stepped(6, 'sine.inOut') }));
        idle(gsap.to(p, { opacity: 0.15, duration: d(1.2, 2.2), yoyo: true, repeat: -1, ease: 'sine.inOut', delay: d(0, 2) }));
      } else if (kind === 'stars') {
        idle(gsap.to(p, { opacity: 0.15, scale: 0.6, duration: d(1.5, 3), yoyo: true, repeat: -1, ease: 'sine.inOut', delay: d(0, 3) }));
      } else {
        // Falling or rising things wrap round from one edge of the area to the other.
        const up = kind === 'bubbles' || kind === 'embers';
        const dur = kind === 'rain' ? d(0.6, 0.9) : kind === 'snow' ? d(7, 12) : d(5, 9);
        const startY = up ? ay + ah - y + 20 : ay - y - 30;
        const endY = up ? ay - y - 30 : ay + ah - y + 20;
        idle(
          gsap.fromTo(
            p,
            { y: startY, x: 0 },
            { y: endY, x: kind === 'rain' ? -40 : d(-50, 50), duration: dur, repeat: -1, ease: stepped(dur, 'none'), delay: -d(0, dur) },
          ),
        );
        if (kind === 'embers') idle(gsap.to(p, { opacity: 0, duration: dur, repeat: -1, ease: 'none', delay: -d(0, dur) }));
      }
    }
  }

  /**
   * A soft pool of light (a candle, a lamp, the moon, a lit window).
   * `flicker` makes it breathe gently, never flash. Returns the light.
   */
  light(x: number, y: number, radius: number, o: { color?: string; strength?: number; flicker?: boolean; z?: number } = {}): HTMLElement {
    const color = o.color ?? C.candle;
    const strength = o.strength ?? 0.45;
    const el = place(
      h('div', { class: 'story-light', style: `background:radial-gradient(circle, ${color} 0%, transparent 70%)` }),
      x - radius,
      y - radius,
      radius * 2,
      radius * 2,
    );
    el.style.zIndex = String(o.z ?? 35);
    el.style.opacity = String(strength);
    this.root.append(el);
    if (o.flicker) {
      this.show.idle.push(
        gsap.to(el, { opacity: strength * 0.7, scale: 0.96, duration: 0.9 + Math.random() * 0.6, yoyo: true, repeat: -1, ease: stepped(1, 'sine.inOut') }),
      );
    }
    return el;
  }

  /**
   * Darkens the scene for night or a gloomy place: a tinted veil over the
   * backdrop and actors, under any lights. Returns it (fade it to change the mood).
   */
  dim(amount = 0.35, color = '#0b1030'): HTMLElement {
    const el = place(h('div', { class: 'story-dim', style: `background:${color}` }), 0, 0, 1180, 820);
    el.style.zIndex = '33';
    el.style.opacity = String(amount);
    this.root.append(el);
    return el;
  }

  // ----------------------------------------------------------------- camera

  /**
   * Moves the camera: zooms in on a point of the world (zoom 1 = the whole
   * stage, 1.4 = a close-up), as a slow, smooth push-in or pan. Edges
   * never show. `camera({})` goes back to the wide shot.
   */
  camera(o: { zoom?: number; x?: number; y?: number }, seconds = 1.4): Promise<void> {
    const z = Math.max(1, o.zoom ?? 1);
    const tx = Math.min(0, Math.max(1180 - 1180 * z, 590 - (o.x ?? 590) * z));
    const ty = Math.min(0, Math.max(820 - 820 * z, 410 - (o.y ?? 410) * z));
    const to = { x: tx, y: ty, scale: z, transformOrigin: '0 0' };
    // Hint the browser to keep the world as one GPU layer while it moves, so a
    // push-in slides a picture instead of redrawing every piece each frame.
    // Dropped afterwards so the still shot is redrawn sharp at its new size.
    this.root.style.willChange = 'transform';
    return this.to(this.root, seconds, { ...to, ease: 'sine.inOut' }).then(() => {
      this.root.style.willChange = '';
    });
  }

  // ------------------------------------------------------------------- cuts

  /** Removes every actor, light and particle and the backdrop, and resets the camera. */
  clear(): void {
    gsap.killTweensOf(this.root.querySelectorAll('*'));
    this.show.idle = [];
    this.root.replaceChildren();
    this.set(this.root, { x: 0, y: 0, scale: 1 });
  }

  /**
   * Cuts to a new set: a torn paper sheet sweeps across, the world is
   * cleared, `build` sets up the new set underneath, and the sheet sweeps
   * away. The player does this between scenes; use it inside a scene for
   * a quick change of place.
   */
  async cut(build: () => void | Promise<void>): Promise<void> {
    if (!this.alive()) return never();
    this.caption('');
    const sheet = h('div', { class: 'story-wipe', html: parchment(1500, 1000, 'story-wipe', C.sand, 3) });
    this.stage.insertBefore(sheet, this.show.captionEl);
    sfx.page();
    sheet.style.willChange = 'transform';
    this.set(sheet, { x: 1240, rotation: 3 });
    await this.to(sheet, 0.42, { x: -160, rotation: -1, ease: 'power2.in' });
    this.clear();
    await build();
    await this.to(sheet, 0.42, { x: -1700, rotation: -4, ease: 'power2.out' });
    sheet.remove();
  }
}

/** A promise that never settles: a skipped scene's script stops here. */
const never = (): Promise<never> => new Promise(() => {});

/** Where an actor goes to be just off one side of the stage, as x/y offsets. */
function offstage(el: HTMLElement, side: Side): { x?: number; y?: number } {
  const left = parseFloat(el.style.left) || 0;
  const top = parseFloat(el.style.top) || 0;
  const w = el.offsetWidth || parseFloat(el.style.width) || 300;
  const hh = el.offsetHeight || parseFloat(el.style.height) || 300;
  if (side === 'left') return { x: -(left + w + 40), y: 0 };
  if (side === 'right') return { x: 1180 - left + 40, y: 0 };
  if (side === 'top') return { y: -(top + hh + 40), x: 0 };
  return { y: 820 - top + 40, x: 0 };
}

/** A lumpy paper cloud (smoke puffs). */
export function cloud(color: string, seed = 'puff'): string {
  const r = rng(seed.length * 977);
  const pts: Pt[] = [];
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    const rr = 34 + r() * 14;
    pts.push([100 + Math.cos(a) * rr, 100 + Math.sin(a) * rr]);
  }
  return svg({ w: 200, h: 200, name: 'cloud-' + seed + color }, [
    piece(curve(pts, 2), color, { rough: 1.5 }),
    piece(circle(78, 88, 30), color, { shadow: false }),
    piece(circle(124, 84, 34), color, { shadow: false }),
    piece(circle(100, 118, 32), color, { shadow: false }),
  ]);
}
