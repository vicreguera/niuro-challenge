import { describe, expect, it } from 'vitest';
import { getQuote, normalizeAmount } from './pricing';
import { checkEligibility } from './eligibility';
import { ageOn, dobError, formatDobInput, formatSsn, formatUsPhone, isEmail, phoneError, ssnError, zipError } from './validation';

describe('pricing', () => {
  it('quotes $2,000 over 16 weeks at 1.30', () => {
    const q = getQuote(2000, 16);
    expect(q).toMatchObject({ payback: 2600, cost: 600, payment: 162.5, lastPayment: 162.5 });
  });
  it('makes the total exact when payments do not divide evenly', () => {
    const q = getQuote(2000, 12); // 2500 / 12
    expect(q.payment).toBe(208.33);
    expect(Math.round((q.payment * 11 + q.lastPayment) * 100) / 100).toBe(2500);
  });
  it('rounds to $100 and clamps to $500–$10,000', () => {
    expect(normalizeAmount(2049)).toBe(2000);
    expect(normalizeAmount(120)).toBe(500);
    expect(normalizeAmount(25000)).toBe(10000);
    expect(normalizeAmount(Number.NaN)).toBe(500);
  });
});

describe('eligibility', () => {
  it('routes unserved states first, before asking anything personal', () => {
    expect(checkEligibility('CA', '3plus', '6000plus')).toEqual({ kind: 'unserved', stateCode: 'CA' });
    expect(checkEligibility('NY', 'lt3', 'lt1500').kind).toBe('unserved');
  });
  it('declines below minimums with the reason', () => {
    expect(checkEligibility('FL', 'lt3', '6000plus').kind).toBe('tooNew');
    expect(checkEligibility('FL', '1to3', 'lt1500').kind).toBe('lowDeposits');
  });
  it('accepts customers who meet the minimums', () => {
    expect(checkEligibility('TX', '3to12', '1500to3000').kind).toBe('eligible');
  });
});

describe('validation', () => {
  const today = new Date(2026, 10, 11);
  it('emails', () => {
    expect(isEmail('name@example.com')).toBe(true);
    expect(isEmail('name@example')).toBe(false);
  });
  it('date of birth: format, real dates, 18+', () => {
    expect(formatDobInput('03271990')).toBe('03/27/1990');
    expect(dobError('', today)).toMatch(/Enter/);
    expect(dobError('02/30/1990', today)).toMatch(/real date/);
    expect(dobError('11/12/2008', today)).toMatch(/18 or older/);
    expect(dobError('11/11/2008', today)).toBeNull();
    expect(ageOn(new Date(1990, 2, 27), today)).toBe(36);
  });
  it('phones by country code', () => {
    expect(formatUsPhone('3055550123')).toBe('(305) 555-0123');
    expect(phoneError('(305) 555-0123', '+1')).toBeNull();
    expect(phoneError('555-0123', '+1')).toMatch(/10-digit/);
    expect(phoneError('55 1234 5678', '+52')).toBeNull();
  });
  it('SSN rules', () => {
    expect(formatSsn('123456789')).toBe('123-45-6789');
    expect(ssnError('123-45-6789')).toBeNull();
    expect(ssnError('666-12-3456')).toMatch(/valid/);
    expect(ssnError('123-00-6789')).toMatch(/valid/);
    expect(ssnError('12345')).toMatch(/9 digits/);
  });
  it('ZIP', () => {
    expect(zipError('33145')).toBeNull();
    expect(zipError('3314')).toMatch(/5-digit/);
  });
});
