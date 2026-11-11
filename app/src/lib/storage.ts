import { EMPTY_DRAFT, RESUMABLE, type Draft, type StepId } from './draft';

const KEY = 'fundo.apply.draft.v1';
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export interface SavedDraft {
  step: StepId;
  draft: Draft;
  savedAt: number;
}

/**
 * Local copy for the "same browser" resume. The real resume path is the emailed magic link
 * (server-side draft). The SSN is never written to the browser.
 */
export function saveLocal(step: StepId, draft: Draft): void {
  try {
    const { ssn: _omit, ...safe } = draft;
    void _omit;
    localStorage.setItem(KEY, JSON.stringify({ step, draft: safe, savedAt: Date.now() }));
  } catch {
    /* private mode or storage blocked: the email link still works */
  }
}

export function loadLocal(now = Date.now()): SavedDraft | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedDraft;
    if (!parsed || now - parsed.savedAt > MAX_AGE_MS || !RESUMABLE.includes(parsed.step)) return null;
    return { ...parsed, draft: { ...EMPTY_DRAFT, ...parsed.draft, ssn: '' } };
  } catch {
    return null;
  }
}

export function clearLocal(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
