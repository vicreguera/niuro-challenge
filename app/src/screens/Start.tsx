import { useCallback, useState } from 'react';
import { RATE_CARD, getQuote, type TermWeeks } from '../lib/pricing';
import { checkEligibility, type MonthlyDeposits, type TimeInWork } from '../lib/eligibility';
import { money } from '../lib/format';
import { isEmail } from '../lib/validation';
import { api } from '../lib/api';
import { useRequest } from '../lib/useRequest';
import type { PayDay } from '../lib/draft';
import { US_STATES, stateName } from '../data/places';
import { AmountStepper, QuoteCard } from '../components/Quote';
import { ChipGroup } from '../components/ChipGroup';
import { Combobox } from '../components/Combobox';
import { Sheet } from '../components/Sheet';
import { Banner, Button, Field, Icon, ICONS, Progress, QuoteSummary } from '../components/ui';
import type { ScreenProps } from './types';

export const quoteLine = (d: ScreenProps['draft']) => {
  const q = getQuote(d.amount, d.weeks);
  return `${money(q.amount)} · ${q.weeks} weekly payments of ${money(q.payment, true)}`;
};

/* ───────────── A · See your numbers ───────────── */
export function Numbers({ draft, update, go, resume, onResume, onStartOver }: ScreenProps) {
  const [sheet, setSheet] = useState(false);
  const [noDraftNote, setNoDraftNote] = useState(false);
  const quote = getQuote(draft.amount, draft.weeks);

  return (
    <>
      <Progress index={1} name="Your numbers" />
      {resume && (
        <section className="card resume" aria-labelledby="resume-title">
          <h2 id="resume-title" className="h3">Welcome back</h2>
          <p className="muted">Your quote is saved: <strong className="tabular text-strong">{quoteLine(resume.draft)}</strong>.</p>
          <Button onClick={onResume}>Continue where you left off</Button>
          <div className="row-between">
            <button type="button" className="link-btn" onClick={onStartOver}>Start over</button>
            <button type="button" className="link-btn muted" onClick={onStartOver}>Not you?</button>
          </div>
        </section>
      )}
      <div className="stack-8">
        <h1 id="step-title" tabIndex={-1} className="h1">See what you’d pay back — <span className="accent">before you apply</span></h1>
        <p className="muted">Pick an amount and a schedule. No personal details yet.</p>
      </div>
      <section className="card stack-20" aria-label="Choose your advance">
        <AmountStepper value={draft.amount} onChange={(amount) => update({ amount })} />
        <ChipGroup<`${TermWeeks}`> label="Pay it back over" columns={3}
          options={RATE_CARD.terms.map((t) => ({ value: `${t.weeks}` as `${TermWeeks}`, label: `${t.weeks} weeks` }))}
          value={`${draft.weeks}` as `${TermWeeks}`} onChange={(v) => update({ weeks: Number(v) as TermWeeks })} />
        <ChipGroup<PayDay> label="Payments come out on" columns={5}
          options={(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as PayDay[]).map((d) => ({
            value: d, label: d, ariaLabel: { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday' }[d] }))}
          value={draft.payDay} onChange={(payDay) => update({ payDay })} />
      </section>
      <QuoteCard quote={quote} payDay={draft.payDay} />
      <p className="fine">
        Example based on typical pricing. Your real offer depends on your deposits and you’ll see it in full before you sign
        anything. Fundo advances are not loans — <button type="button" className="inline-link" onClick={() => setSheet(true)}>what that means</button>.
        Not available in CA or NY.
      </p>
      <div className="actions">
        <Button onClick={() => go('eligibility')}>Check if I can apply <Icon d={ICONS.arrow} size={18} /></Button>
        {!resume && (
          <p className="center small muted">Already started?{' '}
            <button type="button" className="inline-link strong" onClick={() => setNoDraftNote(true)}>Continue where you left off</button>
          </p>
        )}
        {noDraftNote && (
          <Banner tone="info">We couldn’t find a saved application on this device. Open the link in the email we sent you — it takes you back to where you stopped.</Banner>
        )}
      </div>
      {sheet && (
        <Sheet title="Not a loan — what does that mean?" onClose={() => setSheet(false)}>
          <p className="muted">A Fundo advance is a purchase of part of your future business income. You get money now and pay it back from your deposits, in fixed payments on the schedule you choose.</p>
          <p className="muted">There’s no interest rate: the cost is the fixed amount shown on your quote. Because it’s for business use, it’s meant for money you earn from your work — not wages from an employer or benefits.</p>
          <p className="muted"><strong className="text-strong">If a payment can’t go through,</strong> we’ll text you before we try again, and you can call us to move a payment.</p>
          <Button onClick={() => setSheet(false)}>Got it</Button>
        </Sheet>
      )}
    </>
  );
}

/* ───────────── B · Can you apply? ───────────── */
export function Eligibility({ draft, update, go }: ScreenProps) {
  const complete = !!(draft.stateCode && draft.time && draft.deposits);
  const next = () => {
    if (!complete) return;
    const r = checkEligibility(draft.stateCode, draft.time as TimeInWork, draft.deposits as MonthlyDeposits);
    go(r.kind === 'eligible' ? 'canApply' : r.kind === 'unserved' ? 'notAvailable' : 'notYet');
  };
  return (
    <>
      <Progress index={2} name="Can you apply?" />
      <QuoteSummary text={quoteLine(draft)} onChange={() => go('numbers')} />
      <div className="stack-8">
        <h1 id="step-title" tabIndex={-1} className="h1">Three quick <span className="accent">questions</span></h1>
        <p className="muted">So you don’t spend time on an application we can’t fund. All three are required.</p>
      </div>
      <Field label="Where do you live?">
        {({ id, describedBy }) => (
          <Combobox id={id} label="States" placeholder="Start typing your state" describedBy={describedBy}
            options={US_STATES.map(([code, name]) => ({ value: code, label: name, keywords: [code], meta: code === 'CA' || code === 'NY' ? 'Not available' : undefined }))}
            value={draft.stateCode} onChange={(stateCode) => update({ stateCode })}
            emptyText={(q) => `No state matches “${q}”. Check the spelling.`} />
        )}
      </Field>
      <ChipGroup<TimeInWork> label="How long have you been doing this work?"
        options={[{ value: 'lt3', label: 'Less than 3 months' }, { value: '3to12', label: '3–12 months' }, { value: '1to3', label: '1–3 years' }, { value: '3plus', label: '3+ years' }]}
        value={draft.time} onChange={(time) => update({ time })} />
      <ChipGroup<MonthlyDeposits> label="About how much lands in your bank account each month from your work?"
        options={[{ value: 'lt1500', label: 'Under $1,500' }, { value: '1500to3000', label: '$1,500–$3,000' }, { value: '3000to6000', label: '$3,000–$6,000' }, { value: '6000plus', label: 'Over $6,000' }]}
        value={draft.deposits} onChange={(deposits) => update({ deposits })} />
      <div className="actions">
        <Button disabled={!complete} aria-describedby={complete ? undefined : 'elig-need'} onClick={next}>Continue</Button>
        {!complete && <p id="elig-need" className="center small muted">Answer all three to continue</p>}
      </div>
    </>
  );
}

/* ───────────── C · You can apply — save your quote ───────────── */
export function CanApply({ draft, update, go, saveAndGo }: ScreenProps) {
  const [tried, setTried] = useState(false);
  const emailErr = !draft.email.trim() ? 'Enter your email so we can save your quote.' : !isEmail(draft.email) ? 'Enter a valid email, like name@example.com.' : null;
  const save = useCallback(() => api.saveDraft({ ...draft, ssn: undefined }), [draft]);
  const req = useRequest(save, () => saveAndGo('about'));
  const submit = () => {
    setTried(true);
    if (emailErr) { focusFirstInvalid(); return; }
    req.run();
  };
  const steps = [
    ['About you', 'Name, phone and date of birth.'],
    ['Your business', 'What you do and how you get paid.'],
    ['Identity check', 'Your address and SSN. Checking it doesn’t affect your credit score.'],
    ['Connect your bank', 'Read-only, through Plaid. We never see your login.'],
    ['See your offer', 'Nothing is final until you accept it.'],
  ];
  return (
    <>
      <Progress index={2} name="Can you apply? · Done" />
      <Banner tone="success">You meet the minimums for Fundo.</Banner>
      <h1 id="step-title" tabIndex={-1} className="h1">Good news — <span className="accent">you can apply</span></h1>
      <QuoteSummary text={quoteLine(draft)} onChange={() => go('numbers')} />
      <section className="card stack-12" aria-labelledby="next-title">
        <h2 id="next-title" className="h3">What’s next <span className="small muted regular">· about 4 minutes</span></h2>
        <ol className="step-map">
          {steps.map(([t, b], i) => (
            <li key={t}><span className="step-num" aria-hidden="true">{i + 3}</span><span><strong>{t}</strong><span className="small muted block">{b}</span></span></li>
          ))}
        </ol>
      </section>
      <Field label={<>Where should we send your quote? <span className="optional">(required)</span></>} error={tried ? emailErr : null}
        hint="We’ll save your progress. If you stop, the link in this email takes you back to where you were.">
        {({ id, describedBy, invalid }) => (
          <input id={id} className="input" type="email" inputMode="email" autoComplete="email" aria-required="true"
            placeholder="you@example.com" aria-describedby={describedBy} aria-invalid={invalid || undefined}
            value={draft.email} onChange={(e) => update({ email: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && submit()} />
        )}
      </Field>
      <label className="check">
        <input type="checkbox" checked={draft.emailMarketing} onChange={(e) => update({ emailMarketing: e.target.checked })} />
        <span>Send me tips and offers from Fundo by email (optional). You can unsubscribe anytime.</span>
      </label>
      <SaveFeedback slow={req.slow} failed={req.failed} />
      <div className="actions">
        <Button loading={req.pending} onClick={submit}>{req.failed ? 'Try again' : 'Save my quote and continue'}</Button>
        <p className="center fine">By continuing, you agree to our <a href="https://fundo.com/terms-of-service/">Terms</a> and <a href="https://fundo.com/privacy-policy/">Privacy Policy</a>.</p>
      </div>
    </>
  );
}

/** After a failed submit, move focus to the first field the customer must fix. */
export function focusFirstInvalid() {
  window.setTimeout(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 0);
}

export function SaveFeedback({ slow, failed }: { slow: boolean; failed: boolean }) {
  if (failed) return <Banner tone="error" title="We couldn’t reach Fundo." live="assertive">Your answers are still here — check your connection and try again.</Banner>;
  if (slow) return <Banner tone="warning">Still working — slow connection. Don’t close this page; your answers are saved.</Banner>;
  return null;
}

/* ───────────── D1 · Not available in your state ───────────── */
export function NotAvailable({ draft, go }: ScreenProps) {
  const name = stateName(draft.stateCode);
  return (
    <>
      <span className="badge-icon" aria-hidden="true"><Icon d={ICONS.pin} size={28} /></span>
      <div className="stack-12">
        <h1 id="step-title" tabIndex={-1} className="h1">Fundo isn’t available in {name}</h1>
        <p className="muted">State rules decide where we can offer advances, and right now we can’t offer one in {name}.</p>
        <p className="muted">We’d rather tell you now than ask for your details first. We haven’t saved anything you entered.</p>
      </div>
      <NotifyCard label="Want us to email you if this changes?" cta="Email me if this changes"
        note="We’ll only email you about Fundo becoming available in your state." reason={`state:${draft.stateCode}`} />
      <button type="button" className="link-btn center-self" onClick={() => go('eligibility')}>I picked the wrong state</button>
    </>
  );
}

/* ───────────── D2 · Not yet ───────────── */
export function NotYet({ draft, go }: ScreenProps) {
  const tooNew = draft.time === 'lt3';
  return (
    <>
      <span className="badge-icon warn" aria-hidden="true"><Icon d={ICONS.calendar} size={28} /></span>
      <div className="stack-12">
        <h1 id="step-title" tabIndex={-1} className="h1">{tooNew ? 'Not yet — come back in a few weeks' : 'Not yet — we need a bit more monthly income'}</h1>
        <p className="muted">{tooNew
          ? 'Fundo needs at least 3 months of deposits from your work to see a steady pattern. You told us you started less than 3 months ago.'
          : 'Fundo’s minimum is about $1,500 a month in deposits from your work. That keeps payments manageable for you.'}</p>
      </div>
      <NotifyCard label={tooNew ? 'We can remind you when you hit 3 months — you won’t have to fill this in again.' : 'We can remind you in 30 days.'}
        cta={tooNew ? 'Remind me when I hit 3 months' : 'Remind me in 30 days'} note="We’ll only email you this reminder."
        reason={tooNew ? 'time' : 'deposits'} />
      <button type="button" className="link-btn center-self" onClick={() => go('eligibility')}>I picked the wrong answer</button>
      <p className="divider-top small muted">Looking for other options? <a href="https://www.sba.gov/local-assistance">Free help for small businesses from the SBA</a></p>
    </>
  );
}

function NotifyCard({ label, cta, note, reason }: { label: string; cta: string; note: string; reason: string }) {
  const [email, setEmail] = useState('');
  const [tried, setTried] = useState(false);
  const err = !isEmail(email) ? 'Enter a valid email, like name@example.com.' : null;
  const send = useCallback(() => api.notifyMe(email, reason), [email, reason]);
  const req = useRequest(send);
  if (req.status === 'done') return <Banner tone="success" title="You’re on the list.">We’ll email {email} — nothing else.</Banner>;
  return (
    <section className="card stack-12">
      <Field label={label} error={tried ? err : null} hint={note}>
        {({ id, describedBy, invalid }) => (
          <input id={id} className="input" type="email" autoComplete="email" placeholder="you@example.com" aria-required="true"
            aria-describedby={describedBy} aria-invalid={invalid || undefined} value={email} onChange={(e) => setEmail(e.target.value)} />
        )}
      </Field>
      <SaveFeedback slow={req.slow} failed={req.failed} />
      <Button loading={req.pending} loadingText="Sending…" onClick={() => { setTried(true); if (!err) req.run(); }}>{req.failed ? 'Try again' : cta}</Button>
    </section>
  );
}
