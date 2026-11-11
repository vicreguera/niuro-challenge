/** Eligibility rules. In production these come from one endpoint shared with the website and social links. */
export const UNSERVED_STATES = ['CA', 'NY'] as const;

export type TimeInWork = 'lt3' | '3to12' | '1to3' | '3plus';
export type MonthlyDeposits = 'lt1500' | '1500to3000' | '3000to6000' | '6000plus';

export type EligibilityResult =
  | { kind: 'eligible' }
  | { kind: 'unserved'; stateCode: string }
  | { kind: 'tooNew' }
  | { kind: 'lowDeposits' };

export function checkEligibility(stateCode: string, time: TimeInWork, deposits: MonthlyDeposits): EligibilityResult {
  if ((UNSERVED_STATES as readonly string[]).includes(stateCode)) return { kind: 'unserved', stateCode };
  if (time === 'lt3') return { kind: 'tooNew' };
  if (deposits === 'lt1500') return { kind: 'lowDeposits' };
  return { kind: 'eligible' };
}
