import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';
import { EMPTY_DRAFT, RESUMABLE, STEP_META, type Draft, type StepId } from './lib/draft';
import { clearLocal, loadLocal, saveLocal, type SavedDraft } from './lib/storage';
import { Button, Header } from './components/ui';
import { Sheet } from './components/Sheet';
import { CanApply, Eligibility, NotAvailable, NotYet, Numbers } from './screens/Start';
import { AboutYou, Business, Done, Home, Identity } from './screens/Apply';
import type { ScreenProps } from './screens/types';

const SCREENS: Record<StepId, (p: ScreenProps) => ReactElement> = {
  numbers: Numbers, eligibility: Eligibility, notAvailable: NotAvailable, notYet: NotYet, canApply: CanApply,
  about: AboutYou, business: Business, home: Home, identity: Identity, done: Done,
};

const BACK: Partial<Record<StepId, StepId>> = {
  eligibility: 'numbers', notAvailable: 'eligibility', notYet: 'eligibility', canApply: 'eligibility',
  about: 'canApply', business: 'about', home: 'business', identity: 'home',
};

export default function App() {
  const [step, setStep] = useState<StepId>('numbers');
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [resume, setResume] = useState<SavedDraft | null>(() => loadLocal());
  const [justSaved, setJustSaved] = useState(false);
  const [later, setLater] = useState(false);
  const first = useRef(true);

  // Each step: page title, focus on the heading (screen readers hear where they are), back to top.
  useEffect(() => {
    const meta = STEP_META[step];
    document.title = `Step ${meta.index} of 7, ${meta.name} — Fundo`;
    if (first.current) { first.current = false; return; }
    window.scrollTo({ top: 0 });
    document.getElementById('step-title')?.focus();
  }, [step]);

  // Browser back button moves between steps instead of leaving the application.
  useEffect(() => {
    const onPop = (e: PopStateEvent) => { if (e.state?.step) setStep(e.state.step as StepId); };
    window.history.replaceState({ step: 'numbers' }, '');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const go = useCallback((next: StepId) => {
    setJustSaved(false);
    window.history.pushState({ step: next }, '');
    setStep(next);
  }, []);

  const update = useCallback((patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch })), []);

  const saveAndGo = useCallback((next: StepId) => {
    setDraft((d) => { saveLocal(next, d); return d; });
    go(next);
    if (next === 'about') setJustSaved(true);
  }, [go]);

  const onResume = () => {
    if (!resume) return;
    setDraft(resume.draft);
    setResume(null);
    go(resume.step);
  };
  const onStartOver = () => { clearLocal(); setResume(null); setDraft(EMPTY_DRAFT); };

  const Screen = SCREENS[step];
  const canLeave = RESUMABLE.includes(step) && step !== 'done';
  const back = BACK[step];

  return (
    <div className="app">
      <a className="skip" href="#main">Skip to content</a>
      <Header onBack={back ? () => go(back) : undefined} onFinishLater={canLeave ? () => setLater(true) : undefined} />
      <main id="main" className="screen" key={step}>
        <Screen draft={draft} update={update} go={go} saveAndGo={saveAndGo} resume={step === 'numbers' ? resume : null}
          onResume={onResume} onStartOver={onStartOver} justSaved={justSaved} />
      </main>
      {later && (
        <Sheet title="Your progress is saved" onClose={() => setLater(false)}>
          <p className="muted">We sent a link to <strong className="text-strong">{draft.email || 'your email'}</strong>. Open it any time in the next 30 days to continue from <strong className="text-strong">Step {STEP_META[step].index} of 7 · {STEP_META[step].name}</strong>. Your quote stays the same.</p>
          <p className="small muted">Can’t find it? Check your spam folder, or come back on this device — we’ll remember where you were.</p>
          <Button onClick={() => setLater(false)}>Keep going</Button>
          <Button variant="link" onClick={() => { saveLocal(step, draft); setLater(false); setResume(loadLocal()); setDraft(EMPTY_DRAFT); go('numbers'); }}>
            Close and finish later
          </Button>
        </Sheet>
      )}
    </div>
  );
}
