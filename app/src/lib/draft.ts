import type { TermWeeks } from './pricing';
import type { MonthlyDeposits, TimeInWork } from './eligibility';

export type StepId =
  | 'numbers'
  | 'eligibility'
  | 'notAvailable'
  | 'notYet'
  | 'canApply'
  | 'about'
  | 'business'
  | 'home'
  | 'identity'
  | 'done';

export type PayDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
export type Income = 'apps' | 'customers' | 'wages';
export type Ownership = 'majority' | 'minority';

export interface Draft {
  amount: number;
  weeks: TermWeeks;
  payDay: PayDay;
  stateCode: string;
  time: TimeInWork | '';
  deposits: MonthlyDeposits | '';
  email: string;
  emailMarketing: boolean;
  firstName: string;
  lastName: string;
  dob: string;
  country: string;
  phone: string;
  smsMarketing: boolean;
  income: Income | '';
  businessName: string;
  useOwnName: boolean;
  ownership: Ownership | '';
  ownerEmail: string;
  street: string;
  apt: string;
  city: string;
  zip: string;
  /** Never persisted — see storage.ts. */
  ssn: string;
}

export const EMPTY_DRAFT: Draft = {
  amount: 2000,
  weeks: 16,
  payDay: 'Tue',
  stateCode: '',
  time: '',
  deposits: '',
  email: '',
  emailMarketing: false,
  firstName: '',
  lastName: '',
  dob: '',
  country: 'US',
  phone: '',
  smsMarketing: false,
  income: '',
  businessName: '',
  useOwnName: false,
  ownership: '',
  ownerEmail: '',
  street: '',
  apt: '',
  city: '',
  zip: '',
  ssn: '',
};

/** Progress shown to the customer: 7 steps, bank connection and offer included. */
export const STEP_META: Record<StepId, { index: number; name: string }> = {
  numbers: { index: 1, name: 'Your numbers' },
  eligibility: { index: 2, name: 'Can you apply?' },
  notAvailable: { index: 2, name: 'Can you apply?' },
  notYet: { index: 2, name: 'Can you apply?' },
  canApply: { index: 2, name: 'Can you apply?' },
  about: { index: 3, name: 'About you' },
  business: { index: 4, name: 'Your business' },
  home: { index: 5, name: 'Identity check' },
  identity: { index: 5, name: 'Identity check' },
  done: { index: 6, name: 'Connect your bank' },
};
export const TOTAL_STEPS = 7;

/** Steps after the quote is saved by email: the customer can leave and resume. */
export const RESUMABLE: StepId[] = ['about', 'business', 'home', 'identity', 'done'];
