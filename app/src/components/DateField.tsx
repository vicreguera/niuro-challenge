import { useEffect, useRef, useState } from 'react';
import { Icon, ICONS } from './ui';
import { formatDobInput, parseDob } from '../lib/validation';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Date of birth: typed (MM/DD/YYYY, slashes added as you type) or picked from a calendar.
 * For birth dates the year is typed, not scrolled — a list of 90 years is the slowest control there is.
 */
export function DateField({ id, value, onChange, describedBy, invalid, maxYear }: {
  id: string; value: string; onChange: (v: string) => void; describedBy?: string; invalid?: boolean; maxYear: number;
}) {
  const parsed = parseDob(value);
  const [open, setOpen] = useState(false);
  const [vm, setVm] = useState(parsed ? parsed.getMonth() : 0);
  const [vy, setVy] = useState(parsed ? parsed.getFullYear() : 1990);
  const [yearText, setYearText] = useState(String(vy));
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setYearText(String(vy)), [vy]);
  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"], .day')?.focus();
  }, [open]);

  const close = () => { setOpen(false); btnRef.current?.focus(); };
  const first = new Date(vy, vm, 1).getDay();
  const days = new Date(vy, vm + 1, 0).getDate();
  const move = (delta: number) => {
    const m = vm + delta;
    setVm((m + 12) % 12);
    setVy(vy + Math.floor(m / 12));
  };

  return (
    <div className="combo">
      <div className="input-with-btn">
        <input id={id} className="input tabular" inputMode="numeric" autoComplete="bday" placeholder="MM / DD / YYYY"
          aria-required="true" aria-describedby={describedBy} aria-invalid={invalid || undefined}
          value={value} onChange={(e) => onChange(formatDobInput(e.target.value))} />
        <button ref={btnRef} type="button" className="input-btn" aria-label="Choose date from calendar" aria-expanded={open}
          onClick={() => setOpen((o) => !o)}>
          <Icon d={ICONS.calendar} />
        </button>
      </div>
      {open && (
        <div ref={panelRef} className="popover calendar" role="dialog" aria-label="Choose your date of birth"
          onKeyDown={(e) => { if (e.key === 'Escape') close(); }}>
          <div className="cal-head">
            <button type="button" className="icon-btn" aria-label="Previous month" onClick={() => move(-1)}><Icon d={ICONS.back} /></button>
            <div className="cal-title">
              <span aria-live="polite">{MONTHS[vm]}</span>
              <label className="sr-only" htmlFor={`${id}-year`}>Year</label>
              <input id={`${id}-year`} className="input year-input tabular" inputMode="numeric" maxLength={4} value={yearText}
                onChange={(e) => {
                  const t = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setYearText(t);
                  const y = Number(t);
                  if (t.length === 4 && y >= 1900 && y <= maxYear) setVy(y);
                }} />
            </div>
            <button type="button" className="icon-btn" aria-label="Next month" onClick={() => move(1)}><Icon d={ICONS.next} /></button>
          </div>
          <div className="cal-week" aria-hidden="true">{['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => <span key={d}>{d}</span>)}</div>
          <div className="cal-grid">
            {Array.from({ length: first }, (_, i) => <span key={`b${i}`} />)}
            {Array.from({ length: days }, (_, i) => {
              const d = i + 1;
              const on = !!parsed && parsed.getFullYear() === vy && parsed.getMonth() === vm && parsed.getDate() === d;
              return (
                <button key={d} type="button" className={`day${on ? ' is-on' : ''}`} aria-pressed={on}
                  aria-label={`${MONTHS[vm]} ${d}, ${vy}`}
                  onClick={() => { onChange(`${pad(vm + 1)}/${pad(d)}/${vy}`); close(); }}>
                  {d}
                </button>
              );
            })}
          </div>
          <p className="hint center">Type the year to jump to it.</p>
        </div>
      )}
    </div>
  );
}
