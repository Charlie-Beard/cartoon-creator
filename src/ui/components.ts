/** Reusable paper UI widgets built from the art kit. */
import { C } from '../art/palette';
import { parchment, waxSeal, type IconName } from '../art/ui';
import { h, place } from './dom';

export function sealButton(
  icon: IconName,
  o: { x: number; y: number; size?: number; color?: string; label?: string; aria: string; name?: string },
): HTMLButtonElement {
  const size = o.size ?? 120;
  const btn = h('button', {
    class: 'seal-btn',
    'aria-label': o.aria,
    html: waxSeal(icon, o.color ?? C.red, size, o.name ?? `${icon}-${o.x}-${o.y}`),
  }) as HTMLButtonElement;
  if (o.label) btn.append(h('span', { class: 'label' }, o.label));
  place(btn, o.x, o.y, size, size);
  return btn;
}

/** A torn parchment banner with a title. */
export function banner(text: string, o: { x: number; y: number; w: number; h?: number; size?: number; fill?: string }): HTMLElement {
  const hh = o.h ?? 92;
  const el = h('div', { class: 'banner', html: parchment(o.w, hh, 'banner-' + text, o.fill ?? C.cream, 0.8) });
  el.append(h('div', { class: 'banner-text', style: `font-size:${o.size ?? 40}px` }, text));
  place(el, o.x, o.y, o.w, hh);
  return el;
}
