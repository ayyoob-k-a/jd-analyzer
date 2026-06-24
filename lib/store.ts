import type { AnalysisResult, RankedRole } from './types';

// ── Session State (In-Memory) ─────────────────────────────────────────────────
// Next.js client-side router preserves this across page transitions.
export let currentFile: File | null = null;
export let currentJd: string | null = null;
export let hasShownSplash: boolean = false;

export function setSplashShown(): void {
  hasShownSplash = true;
}

export function setSessionData(file: File, jd: string): void {
  currentFile = file;
  currentJd = jd;
}

export function clearSessionData(): void {
  currentFile = null;
  currentJd = null;
}

// ── Single result ─────────────────────────────────────────────────────────────
export const RESULT_KEY = 'jda_result';

export function saveResult(result: AnalysisResult): void {
  localStorage.setItem(RESULT_KEY, JSON.stringify(result));
  // Clear any bulk results from a previous session
  localStorage.removeItem(BULK_RESULT_KEY);
}

export function loadResult(): AnalysisResult | null {
  const raw = localStorage.getItem(RESULT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearResult(): void {
  localStorage.removeItem(RESULT_KEY);
}

// ── Bulk results ──────────────────────────────────────────────────────────────
export const BULK_RESULT_KEY = 'jda_bulk_results';

export function saveBulkResults(roles: RankedRole[]): void {
  localStorage.setItem(BULK_RESULT_KEY, JSON.stringify(roles));
  // Clear any single result from a previous session
  localStorage.removeItem(RESULT_KEY);
}

export function loadBulkResults(): RankedRole[] | null {
  const raw = localStorage.getItem(BULK_RESULT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearBulkResults(): void {
  localStorage.removeItem(BULK_RESULT_KEY);
}

/** Clears everything — called from "Analyze Another" */
export function clearAll(): void {
  localStorage.removeItem(RESULT_KEY);
  localStorage.removeItem(BULK_RESULT_KEY);
  clearSessionData();
}
