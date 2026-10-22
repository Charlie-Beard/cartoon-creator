/**
 * The Wishing-Chair's set pieces (docs/WORLDS.md, "pieces.ts"): riding the
 * chair. Riders are ordinary portraits sat between the chair (z below)
 * and its front, the seat and arms (`wishing-chair-front`, z above), so
 * they look as if they are sitting in it; the piece keeps all of them
 * moving together.
 *
 *   import { chairRide } from '../../worlds/wishing/pieces';
 *
 * Lines are keys, never text; his turn (k.tapToHelp) stays in the script,
 * between a piece's parts.
 */
import type { Kit } from '../../kit';
import { moves, sounds } from './moves';

/** Where a rider sits, in the chair's own 440 × 400 units: their middle, their bottom edge, their width. */
const SLOTS = {
  left: { cx: 154, bottom: 284, w: 180 },
  right: { cx: 286, bottom: 284, w: 180 },
  /** Perched on the right arm (a small rider: Jigs). */
  arm: { cx: 384, bottom: 180, w: 130 },
  /** Perched on the left arm. */
  armL: { cx: 56, bottom: 180, w: 130 },
  /** Peeping over the top of the chair back, behind it (a small rider: Jigs, standing on the back rail). */
  back: { cx: 280, bottom: 104, w: 130 },
} as const;
export type Slot = keyof typeof SLOTS;

export interface Ride {
  chair: HTMLElement;
  front: HTMLElement;
  riders: HTMLElement[];
  /** Where the chair was placed, and its width (riders are placed from these). */
  at: { x: number; y: number; w: number; z: number };
}

/** Every actor of the ride, chair first. */
const all = (a: Ride): HTMLElement[] => [a.chair, ...a.riders, a.front];

// --------------------------------------------------------------- chair ride

/**
 * The Wishing-Chair with riders in it, flying as one.
 *
 * Parts:
 *   set(k, { x, y, w?, z?, riders?, wings? })   the chair (prop
 *       `wishing-chair`, 440 × 400 at w 440) with its top-left at x, y, its
 *       front on top, and each rider `{ id, slot, flip? }` in a slot:
 *       'left' and 'right' on the seat, 'arm' (right) or 'armL' perched on
 *       an arm, 'back' peeping over the top of the chair back (behind it). `wings: true` starts with its wings out. Returns the Ride.
 *   seat(k, a, { id, slot, flip? })   puts one more rider in now (after a
 *       drag: remove the dragged actor, then seat them), popping in.
 *   seatAt(k, a, slot)   the stage point a slot's middle is at now (a drag's `to`).
 *   jump(k, a, { x?, y? })   moves the whole ride to an offset at once
 *       (in `set`: start it off stage, then fly it in).
 *   wings(k, a)       grows the wings (moves.growWings).
 *   fly(k, a, { x?, y?, s?, flaps?, tilt? })   flies everyone to an offset
 *       from where they were placed, flapping as it goes.
 *   flap(k, a, n)     the wings beat n times on the spot.
 *   land(k, a, { x?, y? })   a soft bumpy landing at an offset, wings folding.
 *   hopOff(k, a, rider, { x, y, w })   a rider hops out of the chair to
 *       stand with their portrait's top-left at x, y and width w (they stay
 *       the same actor, scaled, so keep using them).
 *
 * Nobody may speak while the ride moves in y (the kit bobs the speaker in y):
 * fly between lines, or say a line while flying with only `x` changing.
 *
 *   const ride = chairRide.set(k, { x: 360, y: 260, w: 480, riders: [{ id: 'mollie', slot: 'left' }, { id: 'peter', slot: 'right' }] });
 *   await chairRide.wings(k, ride);
 *   await chairRide.fly(k, ride, { x: 900, y: -500, s: 2.2 });
 */
export const chairRide = {
  set<K extends string>(
    k: Kit<K>,
    o: { x: number; y: number; w?: number; z?: number; riders?: { id: string; slot: Slot; flip?: boolean }[]; wings?: boolean },
  ): Ride {
    const w = o.w ?? 440;
    const z = o.z ?? 12;
    const chair = k.prop('wishing-chair', { x: o.x, y: o.y, w, z });
    const front = k.prop('wishing-chair-front', { x: o.x, y: o.y, w, z: z + 3 });
    const a: Ride = { chair, front, riders: [], at: { x: o.x, y: o.y, w, z } };
    for (const r of o.riders ?? []) a.riders.push(place(k, a, r));
    if (o.wings) k.set([...k.part(chair, 'wingL'), ...k.part(chair, 'wingR')], { opacity: 1 });
    return a;
  },

  async seat<K extends string>(k: Kit<K>, a: Ride, r: { id: string; slot: Slot; flip?: boolean }): Promise<HTMLElement> {
    const el = place(k, a, r);
    a.riders.push(el);
    sounds.creak();
    await k.appear(el);
    return el;
  },

  seatAt<K extends string>(k: Kit<K>, a: Ride, slot: Slot): [number, number] {
    const s = a.at.w / 440;
    const { x, y } = offset(k, a);
    const t = SLOTS[slot];
    const h = (t.w * 340) / 300;
    return [a.at.x + x + t.cx * s, a.at.y + y + (t.bottom - h / 2) * s];
  },

  /** Moves the whole ride to an offset at once, without motion (legal in a scene's `set`: start it off stage). */
  jump<K extends string>(k: Kit<K>, a: Ride, o: { x?: number; y?: number }): void {
    for (const el of all(a)) k.set(el, { x: o.x ?? 0, y: o.y ?? 0 });
  },

  wings<K extends string>(k: Kit<K>, a: Ride): Promise<void> {
    return moves.growWings(k as unknown as Kit, a.chair);
  },

  async fly<K extends string>(k: Kit<K>, a: Ride, o: { x?: number; y?: number; s?: number; flaps?: number; tilt?: number }): Promise<void> {
    const s = o.s ?? 1.6;
    void moves.flap(k as unknown as Kit, a.chair, o.flaps ?? Math.max(2, Math.round(s * 2)));
    const vars: Record<string, number> = {};
    if (o.x !== undefined) vars.x = o.x;
    if (o.y !== undefined) vars.y = o.y;
    if (o.tilt) {
      await k.all(...all(a).map((el) => k.to(el, s / 2, { ...vars, rotation: o.tilt, ease: 'sine.in' })));
      await k.all(...all(a).map((el) => k.to(el, s / 2, { rotation: 0, ease: 'sine.out' })));
    } else {
      await k.all(...all(a).map((el) => k.to(el, s, { ...vars, ease: 'sine.inOut' })));
    }
  },

  flap<K extends string>(k: Kit<K>, a: Ride, n = 3): Promise<void> {
    return moves.flap(k as unknown as Kit, a.chair, n);
  },

  /** A rider hops out of the chair to stand at x, y with width w (scaled from their top-left, so k.box keeps their old size). */
  async hopOff<K extends string>(k: Kit<K>, a: Ride, rider: HTMLElement, to: { x: number; y: number; w: number }): Promise<void> {
    const b = k.box(rider);
    const left = parseFloat(rider.style.left) || 0;
    const top = parseFloat(rider.style.top) || 0;
    a.riders = a.riders.filter((r) => r !== rider);
    rider.style.zIndex = String(a.at.z + 4);
    k.set(rider, { transformOrigin: '0 0' });
    k.fx.boing();
    const s = to.w / b.w;
    await k.to(rider, 0.35, { x: (b.x + to.x) / 2 - left, y: Math.min(b.y, to.y) - 90 - top, scale: (1 + s) / 2, ease: 'power1.out' });
    await k.to(rider, 0.35, { x: to.x - left, y: to.y - top, scale: s, ease: 'power1.in' });
    k.fx.thud();
  },

  async land<K extends string>(k: Kit<K>, a: Ride, o: { x?: number; y?: number } = {}): Promise<void> {
    await chairRide.fly(k, a, { x: o.x ?? 0, y: (o.y ?? 0) - 20, s: 1.4 });
    k.fx.thud();
    await k.all(...all(a).map((el) => k.to(el, 0.18, { y: o.y ?? 0, ease: 'power2.in' })));
    k.fx.boing();
    await k.all(...all(a).map((el) => k.to(el, 0.12, { y: (o.y ?? 0) - 10, yoyo: true, repeat: 1 })));
    await moves.foldWings(k as unknown as Kit, a.chair);
  },
};

/** How far the ride has flown from where it was placed. */
function offset<K extends string>(k: Kit<K>, a: Ride): { x: number; y: number } {
  const b = k.box(a.chair);
  return { x: b.x - a.at.x, y: b.y - a.at.y };
}

/** Puts a rider in a slot of the chair, moved along with it so far. */
function place<K extends string>(k: Kit<K>, a: Ride, r: { id: string; slot: Slot; flip?: boolean }): HTMLElement {
  const s = a.at.w / 440;
  const t = SLOTS[r.slot];
  const w = t.w * s;
  const h = (w * 340) / 300;
  const el = k.character(r.id, { x: a.at.x + t.cx * s - w / 2, y: a.at.y + t.bottom * s - h, w, z: r.slot === 'back' ? a.at.z - 1 : a.at.z + 1 + (r.slot.startsWith('arm') ? 1 : 0), flip: r.flip });
  const { x, y } = offset(k, a);
  k.set(el, { x, y });
  return el;
}
