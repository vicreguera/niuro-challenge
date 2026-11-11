import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';

export interface ChipOption<T extends string> {
  value: T;
  label: ReactNode;
  /** Accessible name when the visible label is abbreviated (e.g. "Tue" → "Tuesday"). */
  ariaLabel?: string;
  description?: ReactNode;
}

/** Radio group drawn as chips or cards. Arrow keys move and select (WAI-ARIA radio pattern). */
export function ChipGroup<T extends string>({ label, hint, options, value, onChange, columns = 2, variant = 'chip', error }: {
  label: string; hint?: string; options: ChipOption<T>[]; value: T | ''; onChange: (v: T) => void;
  columns?: number; variant?: 'chip' | 'card'; error?: string | null;
}) {
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedIdx = options.findIndex((o) => o.value === value);
  const focusIdx = selectedIdx >= 0 ? selectedIdx : 0;

  const onKey = (e: KeyboardEvent, i: number) => {
    const forward = e.key === 'ArrowRight' || e.key === 'ArrowDown';
    const back = e.key === 'ArrowLeft' || e.key === 'ArrowUp';
    if (!forward && !back) return;
    e.preventDefault();
    const next = (i + (forward ? 1 : -1) + options.length) % options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div className="field">
      <span id={`${id}-l`} className="label">{label}</span>
      {hint && <span id={`${id}-h`} className="hint hint-tight">{hint}</span>}
      <div role="radiogroup" aria-labelledby={`${id}-l`} aria-describedby={[error ? `${id}-e` : '', hint ? `${id}-h` : ''].filter(Boolean).join(' ') || undefined}
        aria-invalid={!!error || undefined}
        className={variant === 'card' ? 'card-group' : 'chip-group'}
        style={variant === 'chip' ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } : undefined}>
        {options.map((o, i) => {
          const on = o.value === value;
          return (
            <button key={o.value} ref={(el) => { refs.current[i] = el; }} type="button" role="radio" aria-checked={on}
              aria-label={o.ariaLabel} tabIndex={i === focusIdx ? 0 : -1}
              className={`${variant === 'card' ? 'choice-card' : 'chip'}${on ? ' is-on' : ''}`}
              onClick={() => onChange(o.value)} onKeyDown={(e) => onKey(e, i)}>
              {variant === 'card' ? (
                <>
                  <span className="choice-text">
                    <span className="choice-title">{o.label}</span>
                    {o.description && <span className="choice-desc">{o.description}</span>}
                  </span>
                  <span className="radio-dot" aria-hidden="true" />
                </>
              ) : o.label}
            </button>
          );
        })}
      </div>
      {error && <p id={`${id}-e`} className="field-error">{error}</p>}
    </div>
  );
}
