---
name: fundo-brand-review
description: Review any Fundo screen, web page, email or social post against the Fundo design system and financial-content rules before it ships. Use when someone shares a screenshot, URL, HTML, email template or post copy for Fundo and asks to check, review or approve it.
---

# Fundo brand and financial-clarity review

You review one piece of Fundo customer communication and return a short, ranked list of fixes. You do not redesign it.

## Inputs
- The asset: screenshot, HTML/CSS, email template, URL or post copy.
- The channel: app, website, portal, email, social, internal tool.
- The system: `tokens/fundo.tokens.json` (read it — do not rely on memory).

## Check, in this order (stop and flag Critical items first)

1. **Financial clarity (Critical if missing where money is mentioned).**
   - Any amount offered also shows: total payback, payment amount and frequency, cost in dollars, or links to where they are shown.
   - Product is named "cash advance" or "advance". Never "loan", "credit line" or "interest rate".
   - "Not a loan" is never alone — it links to the plain-language explanation.
   - Speed claims use the one sentence approved by compliance (proposed, pending approval: "Funding as soon as the same business day, after approval."). No "in minutes", "instant" or "guaranteed".
   - "No credit check" never appears next to an SSN request without the approved credit-impact sentence.
   - Example prices are labelled as examples. Excluded states (CA, NY) are stated wherever eligibility is promised.
   - Testimonials are real customers. AI actors or generated people are never presented as customers.
2. **Accessibility (High).** Text contrast ≥ 4.5:1 (3:1 for 24 px+ or 18.66 px bold). `#0E90E4` is never used for body text or as a background behind white text. Touch targets ≥ 44 px. Every input has a visible label. Errors are written in words, not only in colour. Images have alt text; text is not baked into images (except the social post itself, whose caption must repeat it).
3. **Tokens (Medium).** Colours, type, spacing and radius come from semantic tokens. Flag every raw hex, off-scale size or radius and name the token that should replace it. Headings use Outfit, text uses Roboto. Buttons and chips are pills. The logo is the vector file: gradient on light surfaces, white on dark. Never raster or stretched.
4. **Voice (Medium).** Plain, direct, warm; second person; sentence case; one idea per sentence; no ALL CAPS; no exclamation marks in errors; numbers as digits. Reading level about grade 6–7. The same thing is called by the same name everywhere.

## Output format

```
VERDICT: Ship | Ship after fixes | Do not ship
1. [Critical|High|Medium|Low] <where> — <what is wrong> → <exact fix, with token name or approved wording>
...
Checked against tokens <version> · rules fundo-brand-review v1
```

Keep it to the fixes that matter; at most 10 lines. When something needs legal or compliance review, say so instead of rewriting the claim.
