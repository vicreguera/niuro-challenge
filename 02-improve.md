# Part 2 — Improve

## The decision in one paragraph

Fundo's customers meet four different companies: the website, the Apply Now wizard, the client portal and social media each have their own colours, type, buttons and voice (audit #4). Improving one screen inside that mess would only add a fifth version. So the improvement has two layers:

1. **One design system for every Fundo channel and application** — website, Apply Now, portal, email, social and internal tools — built from the brand customers already recognise: the fundo.com logo and web palette (primary `#0E90E4`, Outfit for headings, Roboto for text), with light and dark modes. Defined in [Part 4](./04-design-system.md) and shipped as [`tokens/`](./tokens).
2. **Its first application: the first screen of Apply Now**, redesigned so customers see what it costs and whether they can apply **before** Fundo asks for anything personal.

---

## What I chose to redesign: "See your numbers → Can you apply?"

Today Apply Now opens by asking for an email. The customer hasn't been told what it costs, how they'd pay it back, or whether they can get it — and only learns on screen 10 whether their state is served.

The redesign replaces screen 01 with:

1. **A simulator** — choose an amount, a term and a payment day; see the total to pay back, each payment and the cost in dollars.
2. **A 3-question eligibility check** — state, time doing this work, monthly deposits. Customers who can't be funded find out in 30 seconds, not after SSN.
3. **"You can apply"** — the quote is saved by email, the next steps are mapped, and progress is saved from here on.

### Why this, and not my second or third choice

| | Choice | Fixes audit issues | Why it ranks here |
|---|---|---|---|
| **1st** | **First screen of Apply Now: simulator + eligibility, built on the unified system** | #1 cost, #2 eligibility, #5 predictability, part of #3 (one product name) and #4 (one visual language) | Answers *what does it cost* and *can I get it* — the two questions a customer has before deciding to trust a brand. Every applicant sees it, so it has the most leverage, and it *removes* unfundable applications instead of adding volume. It is also the most visible place to show the new system working. |
| 2nd | SSN screen (12): cost recap + credit clarity | #1, #4 | High impact on start-to-SSN, but the customer still arrives after 11 screens without knowing if they qualify. The chosen redesign carries the quote forward, so the SSN screen becomes a small follow-up (a recap card, listed below). |
| 3rd | Instagram post template | #4, #6 | The most visibly broken channel, but posts don't change the decision of someone who is already applying. With the system in place, the template becomes a quick follow-up (Part 4 shows how it reaches social). |

---

## Design language: what changed and why

The brief asks for the redesign "in the Apply Now design" and to say so if the design language changes. **It does change**, deliberately:

| | Before | After | Why |
|---|---|---|---|
| **Source of the brand** | Apply Now navy `#1E3A8A`, which doesn't appear in the logo | fundo.com primary `#0E90E4` — it sits between the two stops of the logo gradient (`#48B8DC` → `#067EFC`) | The logo is the one asset every channel already shares. Building from it is how website, app, portal, email and social converge instead of four palettes competing. |
| **Colour roles** | One navy for everything; disabled = navy at 50 % | Primitive scales (primary, neutral, success, error, warning; lightness ±10 per step) mapped to **semantic tokens**: `brand.primary` for logo, accents, icons and focus; `action.primary` (`#0B72B4`) for buttons and links | `#0E90E4` has only 3.4:1 contrast on white, so it can't carry white button text. Splitting *brand* from *action* keeps the recognisable blue and passes WCAG AA (5.2:1). All 46 text/background pairs pass AA in both modes ([report](./tokens/contrast-report.md)). |
| **Type** | Geometric sans + Inter at ad-hoc sizes; no hierarchy on the website | Outfit (headings) + Roboto (text), one rem scale (1rem = 16px), mobile-first, plus an `amount` style with tabular numbers | One reading hierarchy across channels (audit #4) and money figures that line up. |
| **Buttons and chips** | Rounded rectangles in the wizard, all-caps pills on the website | Pills everywhere, sentence case | The website's shape, without the shouting. |
| **Modes** | Light only | Light and dark from the same tokens | Customers apply on phones at night; dark mode follows the phone setting. |
| **Headlines** | Black + cyan on 01, navy on 02–12 | `text.primary` with one accent phrase in `brand.primary` | One headline style everywhere (audit #16). |
| **Icons** | Emoji and pixelated rasters | One outline icon set, vector logo | Pixelated assets read as low-trust (audit #4). |
| **Help** | Floating chat bubble covering the CTA | "Help" link in the header | It covered the primary CTA (audit #5). |
| **New components** | — | Quote card, segmented chips, amount stepper, step map, resume card | Needed to show money clearly and make the flow predictable; they join the system's component library. |

**What stays from Apply Now:** the flow pattern (one question per screen), the progress bar, the light page with white cards, the input style and the friendly, direct tone. Customers who know the current app will still recognise it.

---

## Before → after

**Before** — screen 01 asks for email under a hero that promises "up to $10,000" and "No credit check"; the CTA is covered by the chat bubble; marketing consent is bundled. State appears on screen 10.
Evidence: [Apply 01 hero](./evidence/apply-01-email-hero.jpg), [Apply 01 form](./evidence/apply-01-email-form-chat-overlap.jpg), [Apply 10 address](./evidence/apply-10-address.png).

**After** — three screens replace screen 01, on the unified system, in light and dark mode. Screen 10 no longer asks for state (it is prefilled and locked from step 2).

```
[A] See your numbers  →  [B] Can you apply? (3 questions)  →  [C] You can apply — save your quote  →  existing flow (02 Mobile …)
                               ├─ not in a served state  →  [D1] Not available in your state
                               └─ below minimums         →  [D2] Not yet — here's when
```

---

## The words we'd ship

Pricing in the examples uses an **illustrative rate card** (12 weeks × 1.25, 16 weeks × 1.30, 20 weeks × 1.35). Real factor rates must come from Fundo's pricing and be approved by compliance before launch; the copy doesn't change, only the numbers.

### [A] See your numbers

- Progress: *Step 1 of 7 · Your numbers*
- **Headline:** See what you'd pay back — **before you apply**
- Sub: Pick an amount and a schedule. No personal details yet.
- Amount label: **How much do you need?** · Stepper: − **$2,000** + · Helper: *Between $500 and $10,000*
- Term label: **Pay it back over** · Chips: **12 weeks** · **16 weeks** (selected) · **20 weeks**
- Payment day label: **Payments come out on** · Chips: Mon · **Tue** · Wed · Thu · Fri
- **Quote card:**
  - You get **$2,000**
  - You pay back **$2,600** in total
  - **16 weekly payments of $162.50**, every Tuesday
  - Cost of this advance: **$600**
  - Pay it off early? *No penalty for paying early.*
- Small print: *Example based on typical pricing. Your real offer depends on your deposits and you'll see it in full before you sign anything. Fundo advances are not loans — [what that means](#)*. *Not available in CA or NY.*
- Primary CTA: **Check if I can apply**
- Secondary: *Already started? **Continue where you left off***

**"What that means" sheet:**
**Not a loan — what does that mean?**
A Fundo advance is a purchase of part of your future business income. You get money now and pay it back from your deposits, in fixed payments on the schedule you choose. There's no interest rate; the cost is the fixed amount shown on your quote. Because it's for business use, it's meant for money you earn from your work — not wages from an employer or benefits.
**If a payment can't go through,** we'll text you before we try again, and you can call us to move a payment. *(Policy to be confirmed with operations and legal — see edge cases.)*
Button: **Got it**

### [B] Can you apply?

- Progress: *Step 2 of 7 · Can you apply?*
- **Headline:** Three quick questions
- Sub: So you don't spend time on an application we can't fund.
- Q1 **Where do you live?** · Select: *Choose your state*
- Q2 **How long have you been doing this work?** · Chips: *Less than 3 months* · *3–12 months* · *1–3 years* · *3+ years*
- Q3 **About how much lands in your bank account each month from your work?** · Chips: *Under $1,500* · *$1,500–$3,000* · *$3,000–$6,000* · *Over $6,000*
- Helper under disabled button: *Answer all three to continue*
- Primary CTA: **Continue**

### [C] You can apply — save your quote

- Progress: *Step 2 of 7 · Can you apply?* (complete)
- **Headline:** Good news — **you can apply**
- Quote recap (compact card): $2,000 · 16 weekly payments of $162.50 · [Change](#)
- **What's next (about 4 minutes)**
  3. **About you** — name, phone, date of birth
  4. **Your business** — what you do and since when
  5. **Identity check** — your SSN. *Checking it doesn't affect your credit score.* *(to be confirmed with compliance)*
  6. **Connect your bank** — read-only, through Plaid. We never see your login.
  7. **See your offer** — nothing is final until you accept it.
- Email label: **Where should we send your quote?** · Placeholder: *you@example.com*
- Helper: *We'll save your progress. If you stop, the link in this email takes you back to where you were.*
- Checkbox (unticked): *Send me tips and offers from Fundo by email. You can unsubscribe anytime.*
- Legal line: *By continuing, you agree to our [Terms](#) and [Privacy Policy](#).*
- Primary CTA: **Save my quote and continue**

### [D1] Not available in your state

- **Headline:** Fundo isn't available in California
- Body: State rules decide where we can offer advances, and right now we can't offer one in California. We'd rather tell you now than ask for your details first.
- Primary: **Email me if this changes** (email field appears; marketing consent stays separate and unticked)
- Secondary: *I picked the wrong state*
- No personal data has been collected at this point.

### [D2] Not yet — here's when

Variant for **less than 3 months**:
- **Headline:** Not yet — come back in a few weeks
- Body: Fundo needs at least 3 months of deposits from your work to see a steady pattern. You told us you started less than 3 months ago.
- Primary: **Remind me when I hit 3 months**
- Secondary: *I picked the wrong answer*

Variant for **under $1,500/month**:
- **Headline:** Not yet — we need a bit more monthly income
- Body: Fundo's minimum is about $1,500 a month in deposits from your work. That keeps payments manageable for you.
- Primary: **Remind me in 30 days**
- Secondary: *I picked the wrong answer*

Both variants end with: *Looking for other options? [Free help for small businesses from the SBA](https://www.sba.gov/local-assistance)*

---

## Edge cases

### Designed

| Case | What the customer sees | Copy |
|---|---|---|
| **Error — field** | Inline message under the field in `error.text`, field border `error.solid`; focus moves to the first error | *Enter an amount between $500 and $10,000.* · *Choose the state where you live.* · *Enter a valid email, like name@example.com.* |
| **Error — network** (save fails) | `error.subtle` banner above the CTA; answers stay on the screen | *We couldn't reach Fundo. Your answers are still here — check your connection and try again.* Button: **Try again** |
| **Slow connection** | Quote card updates instantly (the rate card loads with the page, no network call per change). On submit: button shows a spinner and *Saving…*; after 5 s a `warning.subtle` line appears | *Still working — slow connection. Don't close this page; your answers are saved.* |
| **360 px screen** | Single column, 16 px gutters; amount stepper buttons 48 × 48 px; term chips in one row (3 × ~104 px), day chips in one row (5 × ~58 px, labels Mon–Fri); quote figures right-aligned in `amount` style; primary CTA sticky at the bottom above the safe area; no horizontal scroll | — |
| **Screen reader** | See below | — |
| **Customer in a state we don't serve** | [D1] right after step B; no personal data asked before it | see D1 |
| **Declined (below minimums)** | [D2] with the reason in plain words and a reminder, never a dead end | see D2 |
| **Returning customer** | Coming back from the email link or the same browser: a resume card on [A] | *Welcome back. Your quote is saved: $2,000 · 16 weekly payments of $162.50. You stopped at **Step 3 of 7 · About you**.* Buttons: **Continue** · *Start over* |
| **Dark mode** | Same screens from the dark token set; follows the phone setting | — |

**Screen reader behaviour**
- Each step changes the page title (*"Step 1 of 7, Your numbers — Fundo"*) and moves focus to the `h1`.
- The amount stepper is a spin button with `aria-valuetext="2,000 dollars"`; − and + are labelled *Decrease amount by $100* / *Increase amount by $100*.
- Term and payment-day chips are radio groups with visible labels as the group name.
- The quote card is a polite live region, announced once after changes settle (300 ms debounce): *"You pay back 2,600 dollars: 16 weekly payments of 162 dollars 50, every Tuesday. Cost 600 dollars."*
- The disabled button's helper text is linked with `aria-describedby`, so the reason is announced.
- Errors use `aria-invalid` and `aria-describedby`; the network banner is `role="alert"`.

### Listed (not designed in this round)

- Amount typed manually with decimals or letters → round to the nearest $100, show *We round to the nearest $100.*
- Customer changes state in step B after seeing D1 → re-evaluate without reload.
- Email already has an application → *You already have an application with this email. We sent you a link to continue.*
- Returning after the rate card changed → *Our pricing changed since your last visit. Here's your updated quote.*
- Returning after 30 days → quote expires, answers kept, new quote shown.
- Shared device → *Not you? Start over* on the resume card.
- Spanish-language version → same strings, translated and reviewed by a native speaker.
- JavaScript fails → static page with the rate table and the three questions as a plain form.
- Wrong answer in B → *I picked the wrong answer* returns to B with values kept.
- SSN screen (12) → compact quote recap card above the field, carried from [A].
- Failed-payment policy wording → needs operations and legal input before the "What that means" sheet ships.

---

## How it ships — week 1

**Day 1 — the system goes in first.** The token package (`fundo.tokens.json` → generated CSS variables, light and dark) is published once and consumed by every surface: the Next.js app imports the CSS; the WordPress theme enqueues the same file; email and social get generated variants (Part 4). Apply Now's current navy is remapped to the semantic tokens, so existing screens change colour without code rewrites.

**Days 1–3 — what I'd build myself with Claude Code:**
- `QuoteSimulator`, `EligibilityCheck`, `StepMap`, `ResumeCard`, `Chips`, `AmountStepper` in the Apply Now codebase, styled only with semantic tokens.
- Pricing as data: a versioned `pricing.json` rate card owned by finance, so compliance approves a file, not a deploy.
- All strings in one copy file (`en.json`), so legal reviews words in one place and Spanish is a translation, not a rebuild.
- Unit tests for the quote maths (rounding, last-payment adjustment) and eligibility rules; axe checks plus a manual VoiceOver/TalkBack pass at 360 px in light and dark mode.
- Amplitude events (Part 3) and a feature flag for a 50/50 test.

**Day 1 — what engineering receives:**
- A branch with the components and Storybook stories for every state above, in both modes.
- Acceptance criteria per edge case (tables above).
- Two backend asks: **save-and-resume** (application draft keyed to email + magic link) and an **eligibility rules endpoint** (states served, minimums), so the website, Apply Now and social links read the same source.

**Days 3–5 — sign-off before going live:**
- Compliance: rate card display, "not a loan" explanation, credit-check sentence, state commercial-financing disclosure rules (e.g. Florida, Georgia, Utah, Virginia).
- Operations: failed-payment wording.
- Then launch to 50 % of new traffic behind the flag (Part 3). The website hero and the Instagram template adopt the system next, in that order.
