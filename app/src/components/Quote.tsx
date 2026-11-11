import { useEffect, useId, useState } from 'react';
import { RATE_CARD, normalizeAmount, type Quote } from '../lib/pricing';
import { money, moneySpoken } from '../lib/format';
import { Icon, ICONS } from './ui';

const DAY_NAMES: Record<string, string> = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday' };

/** Amount input with −/+ (step $100). Typing is allowed; the value is rounded and clamped on blur, with a note. */
export function AmountStepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const id = useId();
  const [text, setText] = useState(money(value));
  const [note, setNote] = useState<string | null>(null);
  useEffect(() => setText(money(value)), [value]);

  const commit = (raw: string) => {
    const n = Number(raw.replace(/[^\d.]/g, ''));
    if (!raw.replace(/[^\d]/g, '')) { setText(money(value)); return; }
    const fixed = normalizeAmount(n);
    if (n < RATE_CARD.minAmount) setNote('The smallest advance is $500.');
    else if (n > RATE_CARD.maxAmount) setNote('The largest advance is $10,000.');
    else if (fixed !== n) setNote('We round to the nearest $100.');
    else setNote(null);
    onChange(fixed);
    setText(money(fixed));
  };
  const step = (d: number) => { setNote(null); onChange(normalizeAmount(value + d)); };

  return (
    <div className="field">
      <label className="label" htmlFor={id}>How much do you need?</label>
      <div className="stepper">
        <button type="button" className="round-btn" aria-label="Decrease amount by $100" disabled={value <= RATE_CARD.minAmount}
          onClick={() => step(-RATE_CARD.step)}><Icon d={ICONS.minus} /></button>
        <input id={id} className="amount-input tabular" inputMode="numeric" value={text}
          aria-describedby={`${id}-h`}
          onChange={(e) => setText(e.target.value)} onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit((e.target as HTMLInputElement).value);
            if (e.key === 'ArrowUp') { e.preventDefault(); step(RATE_CARD.step); }
            if (e.key === 'ArrowDown') { e.preventDefault(); step(-RATE_CARD.step); }
          }} />
        <button type="button" className="round-btn" aria-label="Increase amount by $100" disabled={value >= RATE_CARD.maxAmount}
          onClick={() => step(RATE_CARD.step)}><Icon d={ICONS.plus} /></button>
      </div>
      <p id={`${id}-h`} className="hint center">{note ?? 'Between $500 and $10,000'}</p>
    </div>
  );
}

/** The quote card. A separate, debounced live region announces changes once they settle. */
export function QuoteCard({ quote, payDay }: { quote: Quote; payDay: string }) {
  const [spoken, setSpoken] = useState('');
  useEffect(() => {
    const t = window.setTimeout(() => setSpoken(
      `You pay back ${moneySpoken(quote.payback)}: ${quote.weeks} weekly payments of ${moneySpoken(quote.payment)}, every ${DAY_NAMES[payDay]}. Cost ${moneySpoken(quote.cost)}.`), 300);
    return () => window.clearTimeout(t);
  }, [quote, payDay]);
  const uneven = quote.lastPayment !== quote.payment;

  return (
    <section className="card quote-card" aria-label="Your example quote">
      <div className="quote-head">Your example quote</div>
      <div className="quote-body">
        <div className="quote-row big"><span>You get</span><span className="amount tabular">{money(quote.amount)}</span></div>
        <div className="quote-row big"><span>You pay back in total</span><span className="amount tabular">{money(quote.payback)}</span></div>
        <hr />
        <div className="quote-row"><span>{quote.weeks} weekly payments</span><strong className="tabular">{money(quote.payment, true)}</strong></div>
        {uneven && <p className="hint">Last payment {money(quote.lastPayment, true)} so the total is exact.</p>}
        <div className="quote-row"><span>Payment day</span><strong>Every {DAY_NAMES[payDay]}</strong></div>
        <div className="quote-row"><span>Cost of this advance</span><strong className="tabular">{money(quote.cost)}</strong></div>
        <p className="quote-good"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICONS.check} /></svg>No penalty for paying early.</p>
      </div>
      <p className="sr-only" aria-live="polite">{spoken}</p>
    </section>
  );
}

export const dayName = (d: string) => DAY_NAMES[d] ?? d;
