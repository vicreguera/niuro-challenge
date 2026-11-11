import { useCallback, useState } from 'react';
import { api } from '../lib/api';
import { useRequest } from '../lib/useRequest';
import { getQuote } from '../lib/pricing';
import { money } from '../lib/format';
import { COUNTRIES, stateName } from '../data/places';
import type { Income, Ownership } from '../lib/draft';
import { dobError, formatSsn, isEmail, phoneError, ssnError, zipError } from '../lib/validation';
import { ChipGroup } from '../components/ChipGroup';
import { DateField } from '../components/DateField';
import { PhoneField } from '../components/PhoneField';
import { Banner, Button, Field, Icon, ICONS, Progress, RequiredNote } from '../components/ui';
import { SaveFeedback, focusFirstInvalid } from './Start';
import type { ScreenProps } from './types';

/** Saves the draft to the server, then continues. Shared by steps 3–5. */
function useStepSave(props: ScreenProps, next: Parameters<ScreenProps['saveAndGo']>[0]) {
  const save = useCallback(() => api.saveDraft({ ...props.draft, ssn: undefined }), [props.draft]);
  return useRequest(save, () => props.saveAndGo(next));
}

/* ───────────── 3 · About you ───────────── */
export function AboutYou(props: ScreenProps) {
  const { draft, update, justSaved } = props;
  const [tried, setTried] = useState(false);
  const dial = COUNTRIES.find((c) => c[0] === draft.country)?.[2] ?? '+1';
  const errors = {
    firstName: draft.firstName.trim() ? null : 'Enter your first name.',
    lastName: draft.lastName.trim() ? null : 'Enter your last name.',
    dob: dobError(draft.dob),
    phone: phoneError(draft.phone, dial),
  };
  const req = useStepSave(props, 'business');
  const submit = () => {
    setTried(true);
    if (Object.values(errors).some(Boolean)) { focusFirstInvalid(); return; }
    req.run();
  };
  const e = (k: keyof typeof errors) => (tried ? errors[k] : null);
  const maxYear = new Date().getFullYear() - 18;

  return (
    <>
      <Progress index={3} name="About you" saved />
      {justSaved && draft.email && (
        <Banner tone="success" title="Quote saved.">We sent it to {draft.email}. If you stop now, the link in that email brings you back here.</Banner>
      )}
      <div className="stack-8">
        <h1 id="step-title" tabIndex={-1} className="h1">A bit <span className="accent">about you</span></h1>
        <p className="muted">Use your legal name, as it appears on your ID. It has to match your bank account.</p>
        <RequiredNote />
      </div>
      <div className="grid-2">
        <Field label="First name" error={e('firstName')}>
          {({ id, describedBy, invalid }) => <input id={id} className="input" autoComplete="given-name" aria-required="true" aria-describedby={describedBy} aria-invalid={invalid || undefined} value={draft.firstName} onChange={(ev) => update({ firstName: ev.target.value })} />}
        </Field>
        <Field label="Last name" error={e('lastName')}>
          {({ id, describedBy, invalid }) => <input id={id} className="input" autoComplete="family-name" aria-required="true" aria-describedby={describedBy} aria-invalid={invalid || undefined} value={draft.lastName} onChange={(ev) => update({ lastName: ev.target.value })} />}
        </Field>
      </div>
      <Field label="Date of birth" error={e('dob')} hint="You need to be 18 or older to apply.">
        {({ id, describedBy, invalid }) => <DateField id={id} value={draft.dob} onChange={(dob) => update({ dob })} describedBy={describedBy} invalid={invalid} maxYear={maxYear} />}
      </Field>
      <Field label="Mobile number" error={e('phone')}
        hint={<span className="note"><Icon d={ICONS.info} size={18} />We’ll text you a one-time code and updates about this application only. No sales calls.</span>}>
        {({ id, describedBy, invalid }) => (
          <PhoneField id={id} country={draft.country} phone={draft.phone} describedBy={describedBy} invalid={invalid}
            onCountry={(country) => update({ country })} onPhone={(phone) => update({ phone })} />
        )}
      </Field>
      <label className="check">
        <input type="checkbox" checked={draft.smsMarketing} onChange={(ev) => update({ smsMarketing: ev.target.checked })} />
        <span>Also text me offers from Fundo (optional). Msg &amp; data rates may apply. Reply STOP to opt out. <a href="https://fundo.com/messaging-terms/">Messaging terms</a></span>
      </label>
      <SaveFeedback slow={req.slow} failed={req.failed} />
      <div className="actions"><Button loading={req.pending} onClick={submit}>{req.failed ? 'Try again' : 'Continue'}</Button></div>
    </>
  );
}

/* ───────────── 4 · Your business ───────────── */
export function Business(props: ScreenProps) {
  const { draft, update } = props;
  const [tried, setTried] = useState(false);
  const minority = draft.ownership === 'minority';
  const errors = {
    income: !draft.income ? 'Choose where most of your work money comes from.'
      : draft.income === 'wages' ? 'Fundo is for money you earn from your own work. Choose app payouts or customer payments if they apply to you.' : null,
    businessName: draft.useOwnName || draft.businessName.trim() ? null : 'Enter your business name, or tick “use my own name”.',
    ownership: draft.ownership ? null : 'Tell us how much of the business you own.',
  };
  const req = useStepSave(props, 'home');
  const submit = () => {
    setTried(true);
    if (Object.values(errors).some(Boolean)) { focusFirstInvalid(); return; }
    req.run();
  };
  const e = (k: keyof typeof errors) => (tried ? errors[k] : null);

  return (
    <>
      <Progress index={4} name="Your business" saved />
      <div className="stack-8">
        <h1 id="step-title" tabIndex={-1} className="h1">How you <span className="accent">get paid</span></h1>
        <RequiredNote />
      </div>
      <ChipGroup<Income> variant="card" label="Where does most of your work money come from?" error={e('income')}
        options={[
          { value: 'apps', label: 'Payouts from apps', description: 'Uber, Lyft, DoorDash, Instacart, Upwork…' },
          { value: 'customers', label: 'Payments from my own customers', description: 'A shop, salon, food truck, trade or service' },
          { value: 'wages', label: 'Wages or benefits', description: 'A paycheck from an employer, unemployment, disability or retirement' },
        ]}
        value={draft.income} onChange={(income) => update({ income })} />
      {draft.income === 'wages' && !tried && (
        <Banner tone="warning">Fundo advances are for money you earn from your own work, not wages or benefits. If you also drive, freelance or sell, choose that option.</Banner>
      )}
      <Field label="Business name" error={e('businessName')}>
        {({ id, describedBy, invalid }) => (
          <input id={id} className="input" autoComplete="organization" placeholder="e.g. Rosa’s Cleaning" aria-required={!draft.useOwnName}
            disabled={draft.useOwnName} aria-describedby={describedBy} aria-invalid={invalid || undefined}
            value={draft.useOwnName ? `${draft.firstName} ${draft.lastName}`.trim() : draft.businessName}
            onChange={(ev) => update({ businessName: ev.target.value })} />
        )}
      </Field>
      <label className="check check-tight">
        <input type="checkbox" checked={draft.useOwnName} onChange={(ev) => update({ useOwnName: ev.target.checked })} />
        <span>I don’t have a business name — use my own name</span>
      </label>
      <ChipGroup<Ownership> label="How much of the business do you own?" hint="The person who owns most of it needs to apply."
        error={e('ownership')}
        options={[{ value: 'majority', label: 'More than half' }, { value: 'minority', label: 'Half or less' }]}
        value={draft.ownership} onChange={(ownership) => update({ ownership })} />
      {minority ? <ShareWithOwner {...props} /> : (
        <>
          <SaveFeedback slow={req.slow} failed={req.failed} />
          <div className="actions"><Button loading={req.pending} onClick={submit}>{req.failed ? 'Try again' : 'Continue'}</Button></div>
        </>
      )}
    </>
  );
}

function ShareWithOwner({ draft, update }: ScreenProps) {
  const [tried, setTried] = useState(false);
  const err = !draft.ownerEmail.trim() ? 'Enter the owner’s email.' : !isEmail(draft.ownerEmail) ? 'Enter a valid email, like name@example.com.'
    : draft.ownerEmail.trim().toLowerCase() === draft.email.trim().toLowerCase() ? 'Use the owner’s email, not yours.' : null;
  const share = useCallback(() => api.shareQuote(draft.ownerEmail), [draft.ownerEmail]);
  const req = useRequest(share);
  return (
    <section className="share" aria-labelledby="share-title">
      <h2 id="share-title" className="h3">The majority owner needs to apply</h2>
      <p className="small">Fundo needs the person who owns more than half of the business to apply. Send them your quote — they’ll get a link to pick up from here, with your answers so far.</p>
      {req.status === 'done' ? (
        <Banner tone="success" title="Quote sent.">We sent it to {draft.ownerEmail}. We’ll let you know when they continue.</Banner>
      ) : (
        <>
          <Field label="Their email" error={tried ? err : null} hint="We’ll only send this quote. We won’t add them to any marketing list.">
            {({ id, describedBy, invalid }) => (
              <input id={id} className="input" type="email" autoComplete="off" placeholder="owner@example.com" aria-required="true"
                aria-describedby={describedBy} aria-invalid={invalid || undefined} value={draft.ownerEmail}
                onChange={(ev) => update({ ownerEmail: ev.target.value })} />
            )}
          </Field>
          <SaveFeedback slow={req.slow} failed={req.failed} />
          <Button loading={req.pending} loadingText="Sending…" onClick={() => { setTried(true); if (err) { focusFirstInvalid(); return; } req.run(); }}>
            {req.failed ? 'Try again' : 'Send quote'}
          </Button>
        </>
      )}
    </section>
  );
}

/* ───────────── 5a · Home address ───────────── */
export function Home(props: ScreenProps) {
  const { draft, update, go } = props;
  const [tried, setTried] = useState(false);
  const errors = {
    street: draft.street.trim() ? null : 'Enter your street address.',
    city: draft.city.trim() ? null : 'Enter your city.',
    zip: zipError(draft.zip),
  };
  const req = useStepSave(props, 'identity');
  const submit = () => {
    setTried(true);
    if (Object.values(errors).some(Boolean)) { focusFirstInvalid(); return; }
    req.run();
  };
  const e = (k: keyof typeof errors) => (tried ? errors[k] : null);
  const input = (k: 'street' | 'apt' | 'city' | 'zip', auto: string, extra: Record<string, unknown> = {}) =>
    ({ id, describedBy, invalid }: { id: string; describedBy?: string; invalid: boolean }) => (
      <input id={id} className="input" autoComplete={auto} aria-required={k !== 'apt'} aria-describedby={describedBy}
        aria-invalid={invalid || undefined} value={draft[k]} onChange={(ev) => update({ [k]: ev.target.value })} {...extra} />
    );

  return (
    <>
      <Progress index={5} name="Identity check" saved />
      <div className="stack-8">
        <h1 id="step-title" tabIndex={-1} className="h1">Your <span className="accent">home address</span></h1>
        <p className="muted">Where you live now. We use it to confirm who you are.</p>
        <RequiredNote />
      </div>
      <Field label="Street address" error={e('street')}>{input('street', 'address-line1', { placeholder: 'e.g. 2150 Coral Way' })}</Field>
      <Field label="Apartment, suite" optional>{input('apt', 'address-line2')}</Field>
      <div className="grid-zip">
        <Field label="City" error={e('city')}>{input('city', 'address-level2')}</Field>
        <Field label="ZIP code" error={e('zip')}>{input('zip', 'postal-code', { inputMode: 'numeric', maxLength: 5 })}</Field>
      </div>
      <div className="locked">
        <div><span className="caption block">State (from your answers)</span><strong>{stateName(draft.stateCode)}</strong></div>
        <button type="button" className="link-btn" onClick={() => go('eligibility')}>Wrong state?</button>
      </div>
      <SaveFeedback slow={req.slow} failed={req.failed} />
      <div className="actions"><Button loading={req.pending} onClick={submit}>{req.failed ? 'Try again' : 'Continue'}</Button></div>
    </>
  );
}

/* ───────────── 5b · Identity check (SSN) ───────────── */
export function Identity(props: ScreenProps) {
  const { draft, update } = props;
  const [tried, setTried] = useState(false);
  const [show, setShow] = useState(false);
  const err = ssnError(draft.ssn);
  const req = useStepSave(props, 'done');
  const q = getQuote(draft.amount, draft.weeks);
  const submit = () => {
    setTried(true);
    if (err) { focusFirstInvalid(); return; }
    req.run();
  };
  return (
    <>
      <Progress index={5} name="Identity check" saved />
      <div className="quote-strip">
        <div className="quote-strip-text">
          <span className="caption">You’re applying for</span>
          <span className="tabular strong">{money(q.amount)} · {money(q.payback)} total · {q.weeks} × {money(q.payment, true)}</span>
        </div>
      </div>
      <div className="stack-8">
        <h1 id="step-title" tabIndex={-1} className="h1">Last check: <span className="accent">your SSN</span></h1>
        <p className="muted">We use it to confirm you are who you say you are and to protect you from someone applying in your name.</p>
      </div>
      <Field label="Social Security number" error={tried ? err : null} hint="9 digits. You’ll find it on your Social Security card or tax documents.">
        {({ id, describedBy, invalid }) => (
          <div className="input-with-btn">
            <input id={id} className="input tabular ssn" type={show ? 'text' : 'password'} inputMode="numeric" autoComplete="off"
              aria-required="true" placeholder="123-45-6789" aria-describedby={describedBy} aria-invalid={invalid || undefined}
              value={draft.ssn} onChange={(ev) => update({ ssn: formatSsn(ev.target.value) })} />
            <button type="button" className="input-btn text" aria-pressed={show} aria-label={show ? 'Hide SSN' : 'Show SSN'}
              onClick={() => setShow((s) => !s)}>{show ? 'Hide' : 'Show'}</button>
          </div>
        )}
      </Field>
      <ul className="card reassure">
        <li><Icon d={ICONS.check} className="ok" /><span><strong>Doesn’t affect your credit score.</strong> <span className="muted">This is an identity check, not a credit application.</span></span></li>
        <li><Icon d={ICONS.lock} className="ok" /><span><strong>Encrypted and never shared for marketing.</strong> <a href="https://fundo.com/privacy-policy/">How we protect your data</a></span></li>
        <li><Icon d={ICONS.clock} className="ok" /><span><strong>Next: connect your bank</strong> <span className="muted">(read-only, through Plaid), then see your offer. Nothing is final until you accept it.</span></span></li>
      </ul>
      <SaveFeedback slow={req.slow} failed={req.failed} />
      <div className="actions"><Button loading={req.pending} loadingText="Checking…" onClick={submit}>{req.failed ? 'Try again' : 'Continue to connect your bank'}</Button></div>
    </>
  );
}

/* ───────────── 6 · Hand-off (bank connection is out of scope) ───────────── */
export function Done({ draft }: ScreenProps) {
  return (
    <>
      <Progress index={6} name="Connect your bank" saved />
      <Banner tone="success" title="Identity check done.">Thanks, {draft.firstName || 'there'}. Your application is saved.</Banner>
      <h1 id="step-title" tabIndex={-1} className="h1">Next: <span className="accent">connect your bank</span></h1>
      <p className="muted">We look at your deposits — read-only, through Plaid — to make your real offer. We never see your bank login, and nothing is final until you accept the offer.</p>
      <div className="actions">
        <Button disabled aria-describedby="scope-note">Connect with Plaid</Button>
        <p id="scope-note" className="center small muted">Bank connection and the offer are not part of this prototype.</p>
      </div>
    </>
  );
}
