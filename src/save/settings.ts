/**
 * What the iPad remembers: the child's name, the volume, and which
 * cartoons he has watched (a tick on the shelf). Kept in localStorage on
 * this device only: there is nothing to lose, so no cloud save.
 */
import { DEFAULT_NAME } from '../core/phrases';

export interface Settings {
  /** Said in lines with {name}. '' means lines are said without one. */
  name: string;
  /** 0–1. */
  volume: number;
  /** Ids of cartoons watched to the end. */
  watched: string[];
}

const KEY = 'cartoon-creator:settings';
const DEFAULTS: Settings = { name: DEFAULT_NAME, volume: 0.9, watched: [] };

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    /* private mode or bad data: start afresh */
  }
  return { ...DEFAULTS, watched: [] };
}

export function saveSettings(s: Settings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* storage full or blocked: the next visit starts from the defaults */
  }
}
