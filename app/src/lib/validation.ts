export const digitsOnly = (s: string) => s.replace(/\D/g, '');

export function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());
}

/** Parses "MM/DD/YYYY" (spaces allowed). Returns null for impossible dates. */
export function parseDob(s: string): Date | null {
  const m = s.replace(/\s/g, '').match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const [mm, dd, yyyy] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const d = new Date(yyyy, mm - 1, dd);
  if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd) return null;
  return d;
}

export function ageOn(dob: Date, today: Date): number {
  let age = today.getFullYear() - dob.getFullYear();
  const beforeBirthday =
    today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

export function dobError(s: string, today = new Date()): string | null {
  if (!s.trim()) return 'Enter your date of birth.';
  const d = parseDob(s);
  if (!d) return 'Enter a real date, like 03/27/1990.';
  if (d > today) return 'Your date of birth can’t be in the future.';
  const age = ageOn(d, today);
  if (age < 18) return 'You need to be 18 or older to apply.';
  if (age > 110) return 'Check the year — it looks too far back.';
  return null;
}

/** US-style phone for +1 countries, 7–15 digits elsewhere (E.164 limit). */
export function phoneError(s: string, dial: string): string | null {
  const n = digitsOnly(s);
  if (!n) return 'Enter your mobile number.';
  if (dial === '+1') return n.length === 10 ? null : 'Enter a 10-digit number, like (305) 555-0123.';
  return n.length >= 7 && n.length <= 15 ? null : 'Enter a valid mobile number.';
}

export function formatUsPhone(s: string): string {
  const n = digitsOnly(s).slice(0, 10);
  if (n.length <= 3) return n;
  if (n.length <= 6) return `(${n.slice(0, 3)}) ${n.slice(3)}`;
  return `(${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6)}`;
}

/** SSA rules: no 000/666/9xx area, no 00 group, no 0000 serial. */
export function ssnError(s: string): string | null {
  const n = digitsOnly(s);
  if (!n) return 'Enter your Social Security number.';
  if (n.length !== 9) return 'Your SSN has 9 digits.';
  const area = n.slice(0, 3);
  if (area === '000' || area === '666' || area.startsWith('9') || n.slice(3, 5) === '00' || n.slice(5) === '0000') {
    return 'Check the number — this isn’t a valid SSN.';
  }
  return null;
}

export function formatSsn(s: string): string {
  const n = digitsOnly(s).slice(0, 9);
  if (n.length <= 3) return n;
  if (n.length <= 5) return `${n.slice(0, 3)}-${n.slice(3)}`;
  return `${n.slice(0, 3)}-${n.slice(3, 5)}-${n.slice(5)}`;
}

export function formatDobInput(s: string): string {
  const n = digitsOnly(s).slice(0, 8);
  if (n.length <= 2) return n;
  if (n.length <= 4) return `${n.slice(0, 2)}/${n.slice(2)}`;
  return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`;
}

export const zipError = (s: string) => (/^\d{5}$/.test(s.trim()) ? null : 'Enter a 5-digit ZIP code.');
