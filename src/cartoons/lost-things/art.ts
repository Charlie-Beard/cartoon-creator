/**
 * One-off touches for The Land of Lost Things.
 *
 * Mollie's missing ribbon: rather than redraw her, her left plait's bow is
 * hidden on the actor itself, and a little fair end of plait is tucked into
 * the gap so the plait hangs whole. Tying the ribbon back on fades the bow
 * in again. Her plaits are drawn in children.ts: the left plait (`hairL`)
 * ends in its bow pieces (two loops and a knot), then the tail.
 *
 * Mrs Muddlecup's spectacles: her art has them on her head (`specs`) and,
 * hidden, on her nose (`specsOn`); a pose change redraws both, so the swap
 * is made again after each one.
 */
import { gsap } from 'gsap';
import type { Kit } from '../../kit';

/** An actor's box as it looks now, with any scale (hopOff scales riders from their top-left). */
function seen(k: Kit, el: HTMLElement): { x: number; y: number; w: number; h: number; flip: boolean } {
  const b = k.box(el);
  const s = Number(gsap.getProperty(el, 'scale')) || 1;
  return { x: b.x, y: b.y, w: b.w * s, h: b.h * s, flip: el.dataset.flip === '1' };
}

/** Where the left plait's bow sits in Mollie's 300 × 340 portrait. */
const BOW: [number, number] = [68, 252];
/** The left plait's bow pieces: the last four pieces of `hairL` are loop, loop, knot, tail. */
const bowPieces = (el: HTMLElement): Element[] => {
  const plait = el.querySelector('[data-part="hairL"]');
  if (!plait) return [];
  const pcs = [...plait.children].filter((c) => !c.hasAttribute('data-loose'));
  return pcs.slice(-4, -1);
};

/** A plain end of fair plait, filling the gap the bow leaves (portrait units). */
const LOOSE =
  '<g data-loose="1"><path d="M57 226 Q54 246 59 266 L77 266 Q82 246 79 226 Z" fill="#d9b86c"/>' +
  '<path d="M61 238 L70 244 L63 252" fill="none" stroke="#a98440" stroke-width="2" stroke-linecap="round"/></g>';

/** Takes the bow off Mollie's left plait (her lost ribbon). Safe to call twice. */
export function ribbonOff(el: HTMLElement): void {
  const plait = el.querySelector('[data-part="hairL"]');
  if (!plait) return;
  for (const p of bowPieces(el)) (p as SVGElement).style.opacity = '0';
  if (!plait.querySelector('[data-loose]')) {
    // the loose end goes under the tail (the last piece), so it reads as one plait
    plait.lastElementChild?.insertAdjacentHTML('beforebegin', LOOSE);
  }
}

/** Ties the bow back on Mollie's left plait: the loose end goes and the bow fades in. */
export async function ribbonOn(k: Kit, el: HTMLElement): Promise<void> {
  const loose = el.querySelector('[data-loose]');
  const bow = bowPieces(el);
  await k.all(k.to(bow, 0.5, { opacity: 1 }), loose ? k.to(loose, 0.5, { opacity: 0 }) : k.wait(0));
}

/** The stage point of Mollie's left-plait bow now (for carrying the ribbon to it). */
export function bowAt(k: Kit, el: HTMLElement): [number, number] {
  const b = seen(k, el);
  const fx = BOW[0] / 300;
  return [b.x + (b.flip ? 1 - fx : fx) * b.w, b.y + (BOW[1] / 340) * b.h];
}

/** Mrs Muddlecup with her spectacles on her nose (after a pose change too). */
export function specsOnNose(k: Kit, el: HTMLElement): void {
  k.set(k.part(el, 'specs'), { opacity: 0 });
  k.set(k.part(el, 'specsOn'), { opacity: 1 });
}

/** Stage points of Mrs Muddlecup's spectacles on her head and on her nose. */
export function specsAt(k: Kit, el: HTMLElement): { head: [number, number]; nose: [number, number]; w: number } {
  const b = seen(k, el);
  const x = b.x + 0.5 * b.w;
  return { head: [x, b.y + (84 / 340) * b.h], nose: [x, b.y + (140 / 340) * b.h], w: (100 / 300) * b.w };
}
