# Fundo Apply Now — redesign (React + TypeScript)

Working implementation of the redesigned first part of Apply Now: **simulator first, eligibility before any personal data, then the application with saved progress.** Built on the unified Fundo design system (`src/tokens.css`, generated from `../tokens/`).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests: pricing, eligibility, validation
npm run typecheck
npm run build
```

Demo switches (query string):

| Param | Effect |
|---|---|
| `?net=slow` | Saves take 7 s → "Saving…" then the slow-connection message after 5 s |
| `?net=fail` | Every save fails → error banner, "Try again", answers kept |
| `?net=flaky` | First save fails, retry works |
| `?theme=dark` / `?theme=light` | Force a theme (default follows the phone) |

## Flow

| Step | Screen | What it does |
|---|---|---|
| 1 | **Your numbers** | Amount (−/+ or typed, rounded to $100, $500–$10,000), term 12/16/20 weeks, payment day. Quote card: you get, total payback, weekly payment (last payment absorbs rounding), cost in dollars. "Not a loan" explained in a sheet. |
| 2 | **Can you apply?** | State (type-to-filter combobox), time doing this work, monthly deposits. Routes to: |
| 2 → | Not available in your state | CA / NY, before any personal data. Optional "email me if this changes". |
| 2 → | Not yet | Under 3 months or under $1,500/month: plain reason + reminder. |
| 2 → | **You can apply** | Step map of what's next; email saves the quote (marketing consent separate and unticked). |
| 3 | About you | Legal name, date of birth (typed with auto-slashes or calendar; 18+), mobile with country code search. |
| 4 | Your business | How you get paid (wages/benefits blocked with an explanation), business name or "use my own name", ownership. Half or less → share the quote with the majority owner. |
| 5 | Identity check | Home address (state locked from step 2), then SSN (masked, show/hide, SSA format rules), with credit-impact and data-use reassurance. |
| 6 | Connect your bank | Hand-off. Bank connection and offer are out of the prototype's scope. |

## Edge cases covered

- **Errors:** validation on submit, inline messages linked with `aria-describedby`, focus moves to the first invalid field.
- **Network error:** banner (`role="alert"`), button becomes "Try again", nothing typed is lost.
- **Slow connection:** "Saving…" spinner; after 5 s a reassurance line.
- **360 px and 320 px:** single fluid column, no horizontal scroll (checked by the E2E suite).
- **Screen readers:** page title per step, focus to the step heading, radio groups with arrow keys, combobox (ARIA 1.2), dialog focus trap and Escape, debounced live region for the quote, progressbar with text value, skip link.
- **Declined / unserved state:** dedicated screens with the reason, never a dead end.
- **Returning customer:** "Finish later" from steps 3–5 explains the email link; on the same device a "Welcome back" card resumes at the saved step. **The SSN is never stored in the browser.** Drafts expire after 30 days.
- **Browser back:** moves between steps instead of leaving the application.
- **Dark mode:** follows the phone; same components, dark token set.
- **No JavaScript:** a `noscript` message with the phone number.

## Structure

```
src/
  tokens.css            design tokens (generated; do not edit by hand)
  styles.css            components, using semantic tokens only
  lib/                  pricing, eligibility, validation, storage, mock api, useRequest
  components/           ui (Button, Field, Banner, Progress, Header), ChipGroup, Combobox,
                        DateField, PhoneField, Sheet, Quote (AmountStepper, QuoteCard)
  screens/              Start.tsx (steps 1–2 and branches), Apply.tsx (steps 3–6)
e2e/flows_test.py       Playwright: 49 checks across every flow and edge case
```

## What is mocked and must be replaced

- `lib/api.ts` — draft save + magic-link email, share-with-owner, notify-me.
- `lib/pricing.ts` — **illustrative rate card**; real factor rates come from finance and need compliance approval.
- `lib/eligibility.ts` — should read the same rules endpoint as the website.
- Address autocomplete provider (fields are plain inputs today).
- Copy pending compliance: "Checking it doesn't affect your credit score", failed-payment wording.

## How it was verified

Built in a sandbox without network access to npm, so verification used the locally available toolchain:
- `tsc --strict` on all logic modules (pricing, eligibility, validation, storage, api, data).
- Unit tests (`src/lib/logic.test.ts`) — 11 passing.
- Full bundle with esbuild + React 19, then `e2e/flows_test.py` in headless Chrome at 360 px — **49/49 passing** ([last run](./e2e/last-run.txt), [screens](./e2e/screens)).
- Not yet run: `tsc` over the React components (needs `@types/react` from `npm install`).

The E2E suite caught three real bugs during the build, all fixed: saves never advanced under React StrictMode; typing a full state name then Enter picked the wrong state; typing over a selected state cleared the field.
