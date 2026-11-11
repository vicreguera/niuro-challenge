# Part 3 — Prove it

## Before building: talk to customers

**Who and how many.**
- **Sessions:** 10 remote, moderated 30-minute sessions on the participant's own phone.
- **Participants:**
  - 5 gig workers (rideshare, delivery) and 5 small-business owners (salon, food truck, trades).
  - At least 3 who started a Fundo application and stopped.
  - 2 in Spanish.
- **Recruiting:** Fundo's abandoned-application list (with consent) plus a screener on User Interviews; $60 incentive.
- **Comprehension test:** an unmoderated test of the simulator (Maze, n ≈ 30).

**What they use.**
- **The working React app**, deployed to a test link (Vercel or Netlify preview from the repo), with fake data and nothing sent anywhere. It beats a static prototype:
  - People type for real and see the real keyboard, validation, errors, the state search and the calendar.
  - `?net=slow` and `?net=fail` let us watch how they react to waiting and failure.
  - "Finish later" tests whether the email-link promise is understood.
  - Its Amplitude events (on a test project) give time per screen for each session, to compare with what people say.
- **The Claude Design canvas** is used only to try concept variants quickly before coding them — e.g. one example price vs a price range on the quote card.

**Five questions**
1. Tell me about the last time you needed money fast for your work. What did you do, and what did you check first?
2. *(Simulator)* In your own words: how much do you get, how much do you pay back in total, and how often?
3. If one weekly payment didn't go through, what do you think would happen?
4. Where in this application would you stop, and what would you need to see to keep going?
5. Fundo says this is "not a loan". What does that mean to you — does it change anything?

**What would change my mind**
- More than 1 in 5 people can't restate the total payback after the simulator → the quote card is wrong; redesign it before testing.
- People treat the example price as a promise and feel misled by the real offer → show a range instead of one number.
- Most people say they'd stop at **bank connection**, not SSN → the next fix goes there.

## The experiment

- **Hypothesis:** Showing the cost and checking eligibility *before* asking for personal data raises the share of visitors who reach SSN **and** qualify, because people who can't be funded leave early and people who can are no longer asked to trust Fundo blind.
- **Primary metric:** *qualified start-to-SSN* — visitors to Apply Now who submit SSN and meet the minimums, per visitor (resumes within 30 days included).
- **Guardrails (must not get worse):**
  - Offer acceptance rate.
  - First-30-day payment failure rate (lagging).
  - Funded advances per visitor (non-inferiority, −5% limit).
  - Support contacts about cost or "hidden fees".
  - Save error rate.
- **Expected and fine:** fewer raw starts and fewer completed applications from CA/NY or below minimums. A "win" that only adds volume is not a win.
- **Traffic assumption** (Fundo's real numbers would replace these): about 6,000 Apply Now visitors a week; baseline start-to-SSN of 30%.
- **Sample size:** detecting a 10% relative lift (30% → 33%) at α 0.05 with 80% power needs about 3,800 visitors per arm, so 7,600 in total — **about 1.3 weeks**.
- **Duration:** run **2 full weeks** so both arms see the weekly payday cycles. Read the lagging guardrails 30 days after the last enrolment.
- **Set-up:** 50/50 split, randomized per user in Amplitude Experiment, new visitors only, with the duration fixed before launch (no peeking).

## Instrumentation (Amplitude)

One event schema, `object_action`, on every screen. **No personal data in events**: no names, emails, phone, address or SSN, only codes and counts.

| Event | Properties | Answers |
|---|---|---|
| `apply_screen_viewed` / `apply_screen_completed` | `step_id`, `step_index`, `variant`, `duration_ms` (visible time only), `error_count` | Time per screen, where people leave |
| `quote_changed` | `amount`, `weeks`, `pay_day` | Which amounts and terms people explore |
| `not_a_loan_opened` | — | How many need the explanation |
| `eligibility_result` | `result` (eligible / unserved / too_new / low_deposits), `state_code` | Mix of who can't be funded |
| `field_error_shown` | `step_id`, `field`, `error_code` | Which fields cause friction |
| `save_failed` / `save_slow` | `step_id` | Reliability |
| `finish_later_clicked` / `application_resumed` | `via` (email / device), `days_since` | Whether saved progress works |
| `quote_shared_with_owner` | — | Minority-owner path |
| `ssn_submitted`, `bank_connect_started`, `offer_viewed`, `offer_accepted` | — | Funnel end; funding and repayment are imported from the backend |

**Added tools, and why they're worth it**
- **Session Replay** (Amplitude's own add-on) on the three screens with the biggest drop-off. Inputs are masked and the SSN field is excluded. It shows *why* people leave, not just *where*.
- **A one-question intercept survey** (Amplitude Guides & Surveys) on "Not yet", "Not available" and "Finish later": *"What stopped you today?"*
- **User Interviews** for recruiting.
- **No heatmaps:** a one-column form doesn't need them.

## Conversion tracking

- **Funnel:** Apply viewed → numbers → eligibility → eligible → quote saved → about you → business → address → **SSN** → bank → offer viewed → accepted → funded. Shown step by step and as **start-to-SSN**, which is the brief's number.
- **Segments:**
  - Device (iOS / Android / desktop).
  - Traffic source (home, blog, Instagram, paid, direct; UTMs on every link).
  - Income type (apps / own customers).
  - New vs returning (resumed).
  - Language.
- **Weekly dashboard:**
  - Visitors and the eligibility mix.
  - Conversion at each step.
  - Start-to-SSN and qualified start-to-SSN.
  - Median time per screen.
  - Save error rate and resume rate.
  - Offer acceptance.
  - 30-day payment failure (lagging).
  - Cost-related support contacts.
- **Real lift vs noise:**
  - Measure against **eligible visitors**, so a burst of CA/NY traffic doesn't read as a drop.
  - Watch the source mix every week, and compare inside segments when it shifts.
  - Check sample-ratio mismatch on day 1.
  - Run an A/A week first to see normal week-to-week movement.
  - Keep a 5% holdout on the old flow for a month after launch.

## The result that makes me undo it

Roll back if, at the end of the test, **qualified start-to-SSN is not better** *and* any guardrail is worse beyond its limit:
- offer acceptance down more than 3 points;
- first-30-day payment failure up more than 1 point;
- funded advances per visitor down more than 5%.

Roll back immediately if the save error rate passes 2%, or if any personal data shows up in analytics.
