import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Icon, ICONS } from './ui';

export interface ComboOption {
  value: string;
  label: string;
  meta?: string;
  /** Extra words that should also match (e.g. the state code). */
  keywords?: string[];
}

/**
 * Type-to-filter combobox (WAI-ARIA 1.2 pattern) for long lists: states, countries.
 * Typing filters; arrows move; Enter picks; Escape closes; the chevron opens the full list.
 */
export function Combobox({ id, label, placeholder, options, value, onChange, describedBy, invalid, emptyText, autoFocus }: {
  id: string; label: string; placeholder?: string; options: ComboOption[]; value: string;
  onChange: (value: string) => void; describedBy?: string; invalid?: boolean; emptyText?: (q: string) => string; autoFocus?: boolean;
}) {
  const listId = useId();
  const selected = options.find((o) => o.value === value);
  const [query, setQuery] = useState(selected?.label ?? '');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  /** True while the customer is typing; false right after a pick, so the full list shows again on reopen. */
  const [typed, setTyped] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Follow outside changes to the selection, but never wipe what the customer is typing.
  useEffect(() => { if (selected) setQuery(selected.label); }, [selected?.label]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (!wrapRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !typed) return options;
    return options.filter((o) =>
      o.label.toLowerCase().startsWith(q) ||
      o.label.toLowerCase().includes(` ${q}`) ||
      (o.keywords ?? []).some((k) => k.toLowerCase() === q || k.toLowerCase().startsWith(q)));
  }, [options, query, typed]);

  const pick = (o: ComboOption) => {
    onChange(o.value);
    setQuery(o.label);
    setTyped(false);
    setOpen(false);
    inputRef.current?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, matches.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter' && open && matches[active]) { e.preventDefault(); pick(matches[active]); }
    else if (e.key === 'Escape') { setOpen(false); }
  };

  const optId = (i: number) => `${listId}-o${i}`;
  const showEmpty = open && query.trim().length > 0 && matches.length === 0;

  return (
    <div className="combo" ref={wrapRef}>
      <div className="input-with-btn">
        <input ref={inputRef} id={id} className="input" role="combobox" aria-autocomplete="list" aria-expanded={open}
          aria-controls={listId} aria-activedescendant={open && matches[active] ? optId(active) : undefined}
          aria-describedby={describedBy} aria-invalid={invalid || undefined} aria-required="true" autoComplete="off"
          placeholder={placeholder} value={query} autoFocus={autoFocus}
          onChange={(e) => {
            const v = e.target.value;
            setQuery(v); setTyped(true); setOpen(true); setActive(0);
            const exact = options.find((o) => o.label.toLowerCase() === v.trim().toLowerCase() ||
              (o.keywords ?? []).some((k) => k.toLowerCase() === v.trim().toLowerCase() && k.length > 2));
            onChange(exact ? exact.value : '');
          }}
          onFocus={() => { setOpen(true); setActive(Math.max(0, matches.findIndex((o) => o.value === value))); }} onKeyDown={onKey} />
        <button type="button" className="input-btn" tabIndex={-1} aria-label={`Show all ${label.toLowerCase()}`}
          onClick={() => { setTyped(false); setOpen((o) => !o); inputRef.current?.focus(); }}>
          <Icon d={ICONS.chevronDown} />
        </button>
      </div>
      {open && matches.length > 0 && (
        <ul id={listId} role="listbox" aria-label={label} className="listbox">
          {matches.map((o, i) => (
            <li key={o.value} id={optId(i)} role="option" aria-selected={o.value === value}
              className={`option${i === active ? ' is-active' : ''}`}
              onMouseDown={(e) => e.preventDefault()} onClick={() => pick(o)} onMouseEnter={() => setActive(i)}>
              <span>{o.label}</span>
              {o.meta && <span className="option-meta">{o.meta}</span>}
            </li>
          ))}
        </ul>
      )}
      {showEmpty && <p className="hint" role="status">{emptyText ? emptyText(query) : `Nothing matches “${query}”.`}</p>}
    </div>
  );
}
