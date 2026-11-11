# Prompt — Claude Design, Part 2 (before/after)

Paste into Claude Design. Attach: the token file `tokens/fundo.tokens.css`, the logo `brand/logos/fundo-logo-gradient.svg` (and `fundo-logo-white.svg` for dark backgrounds), and these reference images from `/evidence`: apply-01-email-hero.jpg, apply-01-email-form-chat-overlap.jpg, apply-03-first-name.png, apply-05-income-source.png, apply-08-ownership.png, apply-12-ssn.png.

---

Design a mobile-first redesign (artboards at **360 × 800** and **390 × 844**) of the first step of Fundo's "Apply Now" flow. Fundo offers merchant cash advances ($500–$10,000) to gig workers and small businesses in the US. The attached screenshots are the current Apply Now flow and are the **brand reference**: the result must look like a better Fundo, not a different company.

**Design system — use the attached `fundo.tokens.css`; reference semantic tokens, never raw hex.** It is Fundo's unified system, built from the fundo.com brand. Key values (light mode):
- `--brand-primary` #0E90E4 — logo, large headings accent, icons, progress fill, focus ring. **Not** for button backgrounds or body text (only 3.4:1 on white).
- `--action-primary` #0B72B4 (hover #085384, pressed #053554) with `--on-action-primary` #FFFFFF — primary buttons and links (`--text-link` #0B72B4).
- `--action-disabled` #DBE0E3 with `--on-action-disabled` #8396A2 — disabled buttons, always paired with a helper line saying what's missing.
- `--surface-page` #F0F3F4, `--surface-default` #FFFFFF (cards), `--surface-sunken` #DBE0E3.
- `--text-primary` #101416, `--text-secondary` #3C4850, `--text-tertiary` #52626D (small print).
- `--border-default` #BDC7CE, `--border-strong` #8396A2 (inputs), `--border-focus` #0E90E4.
- `--primary-subtle` #E7F5FE with `--on-primary-subtle` #053554 — selected chips, quote card header, info notes.
- Feedback: success `--success-subtle` #E9FBF1 / `--on-success-subtle` #0E4B27; warning `--warning-subtle` #FEF5E6 / `--on-warning-subtle` #553704; error text `--error-text` #A41B1B on white, `--error-subtle` #FBE9E9.
- Type: **Outfit** for headings, **Roboto** for text, rem-based (1rem = 16px), mobile sizes: heading-1 2rem/1.15 700, heading-2 1.5rem/1.2 700, heading-3 1.25rem/1.3 600, body 1rem/1.5 400, body-sm 0.875rem, label 0.875rem 500, caption 0.75rem (legal small print). Money figures use `amount` (Outfit 1.75rem 600, tabular numbers).
- Radius: buttons and chips `--radius-full` (pill, as on fundo.com), cards `--radius-lg` (1rem), inputs `--radius-md` (0.5rem).
- Spacing on `--space-*` (4px grid); 16px side gutters.
- Headlines: `--text-primary` with one accent phrase in `--brand-primary` (heading sizes only).
- Also produce a **dark-mode** version of screen [A] and [C] using the dark values in the token file (`data-theme="dark"`).
- Header: Fundo wordmark centred, back arrow left, a text link **Help** on the right (replaces the floating chat bubble, which must not appear).
- Icons: one outline icon set, no emoji.

**Screens to design (use exactly this copy):**

1. **[Before]** Recreate current screen 01 (email capture) as-is for comparison.

2. **[A] See your numbers** — Progress "Step 1 of 7 · Your numbers". H1 "See what you'd pay back — **before you apply**" (accent on the bold part). Sub "Pick an amount and a schedule. No personal details yet." Amount stepper with − / + buttons (48 px) around "$2,000", label "How much do you need?", helper "Between $500 and $10,000". Chips "Pay it back over": 12 weeks · **16 weeks** (selected) · 20 weeks. Chips "Payments come out on": Mon · **Tue** · Wed · Thu · Fri. Quote card: "You get **$2,000**" / "You pay back **$2,600** in total" / "**16 weekly payments of $162.50**, every Tuesday" / "Cost of this advance: **$600**" / "No penalty for paying early." Small print: "Example based on typical pricing. Your real offer depends on your deposits and you'll see it in full before you sign anything. Fundo advances are not loans — what that means. Not available in CA or NY." Sticky primary button "Check if I can apply". Secondary link "Already started? Continue where you left off".

3. **[A-sheet] Not a loan — what does that mean?** Bottom sheet over A with the explanation text from `02-improve.md` and a "Got it" button.

4. **[B] Can you apply?** Progress "Step 2 of 7 · Can you apply?". H1 "Three quick questions". Sub "So you don't spend time on an application we can't fund." Select "Where do you live?" (placeholder "Choose your state"). Chips "How long have you been doing this work?": Less than 3 months · 3–12 months · 1–3 years · 3+ years. Chips "About how much lands in your bank account each month from your work?": Under $1,500 · $1,500–$3,000 · $3,000–$6,000 · Over $6,000. Disabled "Continue" with helper "Answer all three to continue".

5. **[C] You can apply** — H1 "Good news — **you can apply**". Compact quote recap "$2,000 · 16 weekly payments of $162.50 · Change". "What's next (about 4 minutes)" as a numbered step map: About you / Your business / Identity check ("Checking it doesn't affect your credit score.") / Connect your bank ("Read-only, through Plaid. We never see your login.") / See your offer ("Nothing is final until you accept it."). Email field "Where should we send your quote?", helper "We'll save your progress. If you stop, the link in this email takes you back to where you were." Unticked checkbox "Send me tips and offers from Fundo by email. You can unsubscribe anytime." Legal line "By continuing, you agree to our Terms and Privacy Policy." Primary "Save my quote and continue".

6. **[D1] Not available in your state** — H1 "Fundo isn't available in California". Body "State rules decide where we can offer advances, and right now we can't offer one in California. We'd rather tell you now than ask for your details first." Primary "Email me if this changes". Secondary "I picked the wrong state".

7. **[D2] Not yet** — H1 "Not yet — come back in a few weeks". Body "Fundo needs at least 3 months of deposits from your work to see a steady pattern. You told us you started less than 3 months ago." Primary "Remind me when I hit 3 months". Secondary "I picked the wrong answer". Footer link "Looking for other options? Free help for small businesses from the SBA".

8. **States on A/B/C:** field error ("Choose the state where you live."), network error banner ("We couldn't reach Fundo. Your answers are still here — check your connection and try again." + "Try again"), slow connection ("Saving…" spinner and line "Still working — slow connection. Don't close this page; your answers are saved."), and the returning-customer resume card on A ("Welcome back. Your quote is saved: $2,000 · 16 weekly payments of $162.50. You stopped at Step 3 of 7 · About you." Buttons "Continue" / "Start over").

Rules: no placeholder text, no lorem ipsum, no stock photos of cash or people holding money. All text must be real text (not images). Touch targets at least 44 px. Text contrast at least 4.5:1. Show everything working at 360 px without horizontal scroll. Use the gradient logo on light surfaces and the white logo on dark ones.
