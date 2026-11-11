import { useId, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { TOTAL_STEPS } from '../lib/draft';

export function Icon({ d, size = 20, className }: { d: string; size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export const ICONS = {
  back: 'M15 18l-6-6 6-6',
  next: 'M9 18l6-6-6-6',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  chevronDown: 'M6 9l6 6 6-6',
  minus: 'M5 12h14',
  plus: 'M12 5v14M5 12h14',
  check: 'M20 6 9 17l-5-5',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01',
  alert: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 8v5M12 16h.01',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 8v4l3 2',
  calendar: 'M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM8 3v4M16 3v4M4 10h16',
  lock: 'M7 11h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zM8 11V8a4 4 0 0 1 8 0v3',
  mail: 'M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM3 7l9 6 9-6',
  pin: 'M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
};

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'link';
  loading?: boolean;
  loadingText?: string;
};

export function Button({ variant = 'primary', loading, loadingText = 'Saving…', children, className = '', disabled, ...rest }: BtnProps) {
  return (
    <button type="button" className={`btn btn-${variant} ${className}`} disabled={disabled || loading}
      aria-busy={loading || undefined} {...rest}>
      {loading ? (<><span className="spinner" aria-hidden="true" />{loadingText}</>) : children}
    </button>
  );
}

export function Banner({ tone, title, children, live = 'polite' }: {
  tone: 'success' | 'warning' | 'error' | 'info'; title?: string; children: ReactNode; live?: 'polite' | 'assertive' | 'off';
}) {
  const icon = tone === 'success' ? ICONS.check : tone === 'warning' ? ICONS.clock : tone === 'error' ? ICONS.alert : ICONS.info;
  const role = live === 'assertive' ? 'alert' : live === 'polite' ? 'status' : undefined;
  return (
    <div className={`banner banner-${tone}`} role={role}>
      <Icon d={icon} size={18} className="banner-icon" />
      <div>
        {title && <strong className="banner-title">{title}</strong>}
        <div>{children}</div>
      </div>
    </div>
  );
}

/** Label + control + hint + error, wired with ids for screen readers. */
export function Field({ label, hint, error, optional, children }: {
  label: ReactNode; hint?: ReactNode; error?: string | null; optional?: boolean;
  children: (a: { id: string; describedBy: string | undefined; invalid: boolean }) => ReactNode;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;
  const describedBy = [errId, hintId].filter(Boolean).join(' ') || undefined;
  return (
    <div className="field">
      <label htmlFor={id} className="label">
        {label} {optional && <span className="optional">(optional)</span>}
      </label>
      {children({ id, describedBy, invalid: !!error })}
      {error && (
        <p id={errId} className="field-error">
          <Icon d={ICONS.alert} size={16} />
          {error}
        </p>
      )}
      {hint && <p id={hintId} className="hint">{hint}</p>}
    </div>
  );
}

export function RequiredNote() {
  return <p className="hint">All fields are required unless marked optional.</p>;
}

export function Progress({ index, name, saved }: { index: number; name: string; saved?: boolean }) {
  return (
    <div className="progress">
      <div className="progress-row">
        <p className="progress-label">Step {index} of {TOTAL_STEPS} · {name}</p>
        {saved && <p className="progress-saved">Progress saved</p>}
      </div>
      <div className="progress-bar" role="progressbar" aria-label="Application progress"
        aria-valuemin={1} aria-valuemax={TOTAL_STEPS} aria-valuenow={index}
        aria-valuetext={`Step ${index} of ${TOTAL_STEPS}, ${name}`}>
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <span key={i} className={i < index ? 'on' : ''} />
        ))}
      </div>
    </div>
  );
}

export function Header({ onBack, onFinishLater }: { onBack?: () => void; onFinishLater?: () => void }) {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        {onBack ? (
          <button type="button" className="icon-btn" aria-label="Back" onClick={onBack}>
            <Icon d={ICONS.back} size={22} />
          </button>
        ) : <span className="icon-btn-spacer" />}
        <span className="logo" role="img" aria-label="Fundo" />
        {onFinishLater ? (
          <button type="button" className="header-link" onClick={onFinishLater}>Finish later</button>
        ) : (
          <a className="header-link" href="tel:+18663938636">Help</a>
        )}
      </div>
    </header>
  );
}

export function QuoteSummary({ text, onChange }: { text: string; onChange?: () => void }) {
  return (
    <div className="quote-strip">
      <div className="quote-strip-text">
        <span className="caption">Your quote</span>
        <span className="tabular strong">{text}</span>
      </div>
      {onChange && <button type="button" className="link-btn" onClick={onChange}>Change</button>}
    </div>
  );
}
