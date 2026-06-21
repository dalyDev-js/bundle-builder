import type { ActiveVariants, Lines } from "../lib/types";

const STORAGE_KEY = "bundle-builder:v1";

export interface SavedBundle {
  lines: Lines;
  activeVariant: ActiveVariants;
}

export function saveForLater(data: SavedBundle): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function loadSaved(): SavedBundle | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedBundle> | null;
    if (!parsed || typeof parsed !== "object" || !parsed.lines) return null;
    return { lines: parsed.lines, activeVariant: parsed.activeVariant ?? {} };
  } catch {
    return null;
  }
}

export function clearSaved(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
