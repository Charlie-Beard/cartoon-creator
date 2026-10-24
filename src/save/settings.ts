/**
 * What the iPad remembers: the volume, and which
 * cartoons he has watched (a tick on the shelf). Kept in localStorage on
 * this device only: there is nothing to lose, so no cloud save.
 */
export interface Settings {
  /** 0–1. */
  volume: number;
  /** Ids of cartoons watched to the end. */
  watched: string[];
}

const KEY = 'cartoon-creator:settings';
const DEFAULTS: Settings = { volume: 0.9, watched: [] };

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      // Older saves also held a name; it is no longer used, so drop it.
      const { volume, watched } = JSON.parse(raw) as Partial<Settings>;
      return { volume: typeof volume === 'number' ? volume : DEFAULTS.volume, watched: Array.isArray(watched) ? watched : [] };
    }
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
