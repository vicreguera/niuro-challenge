# Part 4 — Design system: one Fundo, owned with AI

**Decision.** Apply Now was the brief's reference, but the audit found four visual languages. The system is built from the asset every channel already shares — **the fundo.com brand and its logo** — so the website, Apply Now, portal, email, social and internal tools converge on one source. Working files: [`tokens/fundo.tokens.json`](./tokens/fundo.tokens.json) (W3C format), [`tokens/fundo.tokens.css`](./tokens/fundo.tokens.css), [specimen page](./tokens/specimen.html), [contrast report](./tokens/contrast-report.md), [review skill](./skills/fundo-brand-review/SKILL.md).

## Tokens

| Group | Tokens (excerpt) |
|---|---|
| **Colour — primitives** | `primary` 50→900 from `#0E90E4` (500), each step ±10 lightness; `neutral` from the primary hue at low saturation; `success`, `error`, `warning` on the same ladder |
| **Colour — semantic** (light / dark) | `brand.primary` #0E90E4 / #33A7F2 · `action.primary` #0B72B4 / #33A7F2 · `surface.page` #F0F3F4 / #101416 · `surface.default` #FFFFFF / #262E33 · `text.primary` #101416 / #F0F3F4 · `text.secondary` #3C4850 / #BDC7CE · `border.strong` #8396A2 · `error.text` #A41B1B / #E87070 |
| **Type** | Headings **Outfit**, text **Roboto**, rem scale (1rem = 16px), mobile-first: display 2.5→3rem, heading-1 2→2.25rem, heading-2 1.5→1.75rem, body 1rem/1.5, body-sm .875rem, caption .75rem; `amount` Outfit 600 with tabular numbers |
| **Spacing** | 4 px grid: `space-1` .25rem … `space-16` 4rem |
| **Radius** | `sm` .25rem, `md` .5rem (inputs), `lg` 1rem (cards), `xl` 1.5rem (sheets), `full` (buttons, chips) |

Key rule found while building it: `#0E90E4` has only **3.4:1** on white, so it is the **brand** colour (logo, large headings, icons, focus). Actions and links use `action.primary` (#0B72B4, 5.2:1). All 46 text/background pairs are checked against WCAG AA by the build script, in both modes.

## Beyond tokens

- **Components:** Button (primary, secondary, link; loading), Field (label, hint, error), ChipGroup and choice cards (radio groups), Combobox (type to filter), DateField with calendar, PhoneField with country code, AmountStepper, QuoteCard, StepMap, ProgressBar, Banner (success, warning, error, info), Sheet. Built once in React ([`app/src/components`](./app/src/components)).
- **Voice and tone:** plain, direct, warm; sentence case; second person; no ALL CAPS; say why we ask before we ask; errors say what to do ("Enter a 5-digit ZIP code"); one name per thing ("cash advance", never "loan").
- **Financial content patterns:**
  - Every offered amount travels with total payback, payment amount and frequency, and cost in dollars (the **quote card**).
  - "Not a loan" always links to its plain explanation.
  - Example prices are labelled as examples.
  - Excluded states appear wherever eligibility is promised.
  - Speed claims use one approved sentence.
  - No AI people presented as customers.
- **Accessibility:**
  - WCAG 2.2 AA contrast, checked in the build.
  - 44 px touch targets.
  - Visible labels on every input.
  - Errors in text, not colour alone.
  - Focus moves to the new step heading.
  - The calendar and comboboxes follow the WAI-ARIA patterns.
  - `prefers-reduced-motion` respected.

## How one system reaches every surface

| Surface | How |
|---|---|
| **Next.js app / admin tool** | `@fundo/tokens` (CSS variables) + `@fundo/ui` React components; admin adds a `density: compact` token set, same colours and type |
| **WordPress theme** | `fundo.tokens.css` enqueued by the theme; a generated `theme.json` exposes the palette, fonts and spacing to Gutenberg, so editors can only pick system values; block patterns for hero, quote example and FAQ |
| **HTML email (SendGrid)** | Email clients ignore CSS variables, so the build compiles tokens to inline hex in SendGrid Dynamic Templates; Roboto with Arial fallback; logo as PNG @2x from the vector; the quote block is a reusable module |
| **Social templates** | Claude Design canvas templates on the same tokens for several formats (education, how the cost works, customer story, Q&A), not one rigid layout; exported to the Canva brand kit for the marketing team |

## AI in the loop

- **Generate:** Claude Code builds components and pages only from semantic tokens (raw hex is rejected by a stylelint rule). Claude Design starts new screens and posts from the token file and components, as this redesign did.
- **Check:** the [`fundo-brand-review`](./skills/fundo-brand-review/SKILL.md) skill reviews any screen, page, email or post. It checks financial clarity, accessibility, tokens and voice, and returns "Ship / Ship after fixes / Do not ship" with ranked fixes. It runs on pull requests and before any campaign goes out.
- **Write:** the same rules power on-brand copy drafts. Claude flags claims for legal review instead of rewriting them.

## Keeping it alive

- **Owner:** the UX Lead owns the system. Engineering, marketing and compliance review changes; compliance signs off on financial patterns.
- **Changes:**
  - A pull request to the tokens repo, with a semantic version and a changelog.
  - The build regenerates CSS, `theme.json` and the email values, then reruns the contrast report.
  - Each surface upgrades by bumping one version.
- **Drift detection:**
  - Stylelint fails on raw colours in code.
  - Playwright screenshots of key screens run on every PR (the E2E suite in `app/e2e` is the start).
  - A weekly job crawls fundo.com, the portal and Apply Now, compares computed colours and fonts against the tokens, and posts the differences.
  - Social and email assets go through the review skill before publishing.
