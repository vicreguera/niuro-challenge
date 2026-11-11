import { useEffect, useRef, useState } from 'react';
import { COUNTRIES } from '../data/places';
import { formatUsPhone } from '../lib/validation';
import { Combobox } from './Combobox';
import { Icon, ICONS } from './ui';

/** Country code picker + number. Searchable list, so a customer with a +52 number doesn't type it into a +1 field. */
export function PhoneField({ id, country, phone, onCountry, onPhone, describedBy, invalid }: {
  id: string; country: string; phone: string; onCountry: (c: string) => void; onPhone: (p: string) => void;
  describedBy?: string; invalid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const cur = COUNTRIES.find((c) => c[0] === country) ?? COUNTRIES[0];
  const isNanp = cur[2] === '+1';

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (!wrapRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div className="combo" ref={wrapRef}>
      <div className="phone-row">
        <button type="button" className="country-btn" aria-expanded={open}
          aria-label={`Country code: ${cur[1]} ${cur[2]}. Change`} onClick={() => setOpen((o) => !o)}>
          <span>{cur[0]}</span><span className="muted">{cur[2]}</span><Icon d={ICONS.chevronDown} size={18} />
        </button>
        <input id={id} className="input grow" type="tel" inputMode="tel" autoComplete="tel-national" aria-required="true"
          placeholder={isNanp ? '(305) 555-0123' : 'Mobile number'} aria-describedby={describedBy} aria-invalid={invalid || undefined}
          value={phone} onChange={(e) => onPhone(isNanp ? formatUsPhone(e.target.value) : e.target.value.replace(/[^\d\s-]/g, ''))} />
      </div>
      {open && (
        <div className="popover">
          <label className="sr-only" htmlFor={`${id}-cc`}>Search country or code</label>
          <Combobox id={`${id}-cc`} label="Countries" placeholder="Search country or code" autoFocus
            options={COUNTRIES.map(([code, name, dial]) => ({ value: code, label: name, meta: dial, keywords: [dial, dial.slice(1), code] }))}
            value="" onChange={(v) => { if (v) { onCountry(v); onPhone(''); setOpen(false); } }} />
        </div>
      )}
    </div>
  );
}
