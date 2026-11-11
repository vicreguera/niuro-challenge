import type { Draft, StepId } from '../lib/draft';
import type { SavedDraft } from '../lib/storage';

export interface ScreenProps {
  draft: Draft;
  update: (patch: Partial<Draft>) => void;
  go: (step: StepId) => void;
  /** Persists the draft locally and moves on (server save happens in the screen). */
  saveAndGo: (step: StepId) => void;
  resume: SavedDraft | null;
  onResume: () => void;
  onStartOver: () => void;
  justSaved: boolean;
}
