# Part 1 — Audit

**Method.** Every surface was walked at phone size (360 px viewport for fundo.com and the portal; the Apply Now prototype in play mode, all 12 screens, business-owner path). Each surface was compared against Apply Now as the brand reference. No applications were submitted on fundo.com or app.fundo.com. Screenshots are in [`/evidence`](./evidence). Third-party facts (pricing, states) come from public reviews and are flagged where Fundo should confirm them.

**Severity scale.** **Critical** — a customer can make an unsafe decision, or Fundo carries legal/compliance risk. **High** — blocks or loses qualified customers, or erodes trust at a key moment. **Medium** — visible inconsistency or friction with a clear fix. **Low** — polish.

---

## Top 5 issues

Ordered the way a customer decides: *What does it cost? → Can I get it? → What exactly is it? → Is this a brand I trust? → Do I know what's coming?*

| # | Where | What is wrong | Why it matters | Severity | Evidence |
|---|---|---|---|---|---|
| **1** | Every surface: home, Apply Now 01–12, FAQ, blog | **The cost is never shown.** No factor rate, no total payback, no payment amount or frequency, no explanation of what happens if a weekly payment fails. The customer hands over SSN (and next, bank access) without knowing what the advance costs. Public reviews report factor rates up to 3.5 with weekly payments, and note Fundo does not publish them. The only place repayment terms appear at all is the Facebook bio ("weekly repayment options, early payoffs with no penalties, reduced costs"). Competitors like Ualett show the flat fee before acceptance. | It is the deciding fact for the customer. Without it they cannot make a safe decision; Fundo attracts applicants who drop off or default when they see the offer, and is exposed to UDAAP-style "unfair or deceptive" scrutiny. | **Critical** | [home](./evidence/home-360-hero-cookie.jpg), [SSN screen](./evidence/apply-12-ssn.png), [Facebook bio](./evidence/social-facebook-cover.png), [Finder: loans like Fundo](https://www.finder.com/business-loans/loans-like-fundo) |
| **2** | Apply 07, 10, flow order | **Eligibility is discovered too late.** State of residence is asked on screen 10 of 12, yet Fundo's own recent Instagram posts carry the line "Not available in CA or NY" — the company knows it, says it on social, but not on the home page or at the start of Apply Now. The published minimums (3 months in business, $1,500/month revenue) are never checked before SSN. Screen 07 pre-fills "January 2026" as the business start date. | "Do I even qualify?" comes before "do I trust this brand?" — if the answer is no, nothing else matters. A customer in CA or NY gives email, phone, name and business details (~3 min) before hitting a wall, or is declined after SSN. Fundo pays acquisition cost for applications it cannot fund. The default date silently produces under-3-month businesses (auto-declines) or wrong data. | **Critical** | [address](./evidence/apply-10-address.png), [start date](./evidence/apply-07-start-date.png), [Instagram footer "Not available in CA or NY"](./evidence/social-instagram-grid-mid.png), [Finder: MCAs for gig workers](https://www.finder.com/business-loans/best-merchant-cash-advances-for-gig-workers) |
| **3** | Apply 05 (income source), Apply 12 (SSN), blog title, Azure copy | **The product's legal identity contradicts itself.** Home says "Merchant Cash Advance"; the disclaimer says revenue-based financing "for business use"; the blog is titled "Small Business Loans" and blog copy says "apply for a loan today"; Instagram posts say "Not a loan" while Facebook shares articles like "Business Funding for Sole Proprietors With Bad Credit"; the SSN screen says "As a regulated financial service provider, we're required to collect your SSN". Screen 05 offers a path for people who earn from "W-2, Unemployment, Disability, Retirement" — consumer income, for a business-only product. | Customers don't know what they are signing. Calling an MCA a loan, or claiming to be "regulated" to justify SSN collection, need **legal/compliance review**. Inviting unemployment or disability income into a business product is a suitability risk. | **Critical** | [income source](./evidence/apply-05-income-source.png), [SSN](./evidence/apply-12-ssn.png), [Facebook posts](./evidence/social-facebook-posts.png), [fundo.com/blog](https://fundo.com/blog/), [Azure copy](https://applicationfrontendwp.azurewebsites.net/cash-advance-for-gig-workers) |
| **4** | All channels: fundo.com, blog, portal, Apply Now, Instagram, Facebook | **Fundo has no single way of presenting itself.** *Discourse:* every channel has a different tagline and self-description — "A Merchant Cash Advance Thats Perfect For Gig Workers" (home), "Get the support to move forward" / "Built for independent workers" (Apply Now), "Everyone Loves Us Except The Competition" (home), "Fundo provides funding to freelancers, gig workers…" (Instagram), "merchant cash advances to small business and self-employed individuals" (Facebook), "Get FUNDs Make DOugh" (LinkedIn) and promises contradict each other — speed ("approved in minutes, funded in hours" vs "same business day" vs "same-day until 3 PM ET"), effort ("Take two minutes" vs 12 screens before SSN), credit ("No credit check" next to an unexplained SSN request). *Visual system:* pixelated logo and icons on the web; Facebook cover is a pixelated logo over a banknote collage; LinkedIn cover crops the wordmark; buttons on the web (all-caps pill) differ from the wizard (rounded rectangle); type families and body sizes vary with no hierarchy or reading levels; the portal is a third visual language. *Social:* the newest Instagram template (light blue, headline + photo + disclaimer) is the closest to Apply Now and the first to carry disclaimers — the right base — but it is rigid and monotonous. Beyond the 4th post no brand is perceptible: AI-generated stock people fanning cash, piles of banknotes, and holiday posts (Mother's Day, Father's Day, Memorial Day, MLK Day) with money imagery; the communication objective, the sector and the audience are unreadable. Facebook repeats the pattern, and blog links are shared without thumbnails. | Brand presence is not brand trust — but incoherence actively destroys trust in a category where customers already fear scams. Fixing promises one by one treats a symptom: the root is that Fundo hasn't decided how it presents itself. A customer who clicks "Apply Now" from a post or the home lands somewhere that looks and sounds like a different company. | **High** | [home](./evidence/home-360-hero-cookie.jpg), [Apply 01](./evidence/apply-01-email-hero.jpg), [two-minutes claim](./evidence/apply-01-two-minutes-claim.jpg), [portal](./evidence/portal-login-360.jpg), [Instagram recent](./evidence/social-instagram-profile-recent.png), [Instagram older](./evidence/social-instagram-grid-older.png), [Instagram mid](./evidence/social-instagram-grid-mid.png), [Facebook cover](./evidence/social-facebook-cover.png), [Facebook posts](./evidence/social-facebook-posts.png), [LinkedIn](./evidence/social-linkedin.png) |
| **5** | Apply 01–12 | **The wizard gives no predictability, context or recovery — and its first screen asks before it explains.** No step count or sections ("Step 3 of 7 — About your business"), no hint of what comes next or that SSN and bank connection are coming, no reuse of what Fundo already knows, no saved progress if the connection drops or the customer leaves. Screen 01 is a long landing page that asks for email before saying what the customer will get; the floating chat button covers the primary CTA (01, 05), and marketing consent is bundled with the Privacy Policy. | Customers on a phone, in spare minutes, abandon what they can't predict. Without save-and-resume, a dropped connection means starting over. The first screen is where intent is decided: it should answer "how much, how much back, how long" before asking for anything. Bundled consent is a **compliance risk** (TCPA/CAN-SPAM). | **High** | [Apply 01 hero](./evidence/apply-01-email-hero.jpg), [chat overlap](./evidence/apply-01-email-form-chat-overlap.jpg), [income source](./evidence/apply-05-income-source.png) |

---

## Other issues (ranked)

| # | Where | What is wrong | Why it matters | Severity | Evidence |
|---|---|---|---|---|---|
| 6 | Instagram ads and reels | **AI-generated actors presented as customers.** The Instagram bio says "Please note: These Ads are AI actors", while posts show named personas with titles (e.g. "Sarah Frank, CEO Pet Watch LLC") speaking as business owners. | A bio note doesn't reach people who see the ad in their feed. Fabricated customer endorsements need **legal review** (FTC Endorsement Guides) and, once noticed, destroy trust in every real review. | High | [Instagram older grid](./evidence/social-instagram-grid-older.png), [Instagram profile bio](./evidence/social-instagram-profile-recent.png) |
| 7 | fundo.com vs Instagram/Facebook | **Two different business addresses.** fundo.com: 2028 Harrison St., Suite 202, Hollywood, FL 33020. Instagram and Facebook: 3323 NE 163rd Street, Suite 509, North Miami Beach, FL 33160. | Customers checking legitimacy (a common step before sharing SSN) find conflicting information — a scam signal. | Medium | [home](https://fundo.com), [Facebook details](./evidence/social-facebook-posts.png) |
| 8 | portal.fundo.com | The page `<title>` is the marketing SEO title, not "Sign in". No route for someone who arrives without an account ("New here? Apply"). "@ 2026" instead of ©. | Screen-reader users hear a marketing title; new customers dead-end. | Medium | [portal](./evidence/portal-login-360.jpg) |
| 9 | fundo.com cookie banner | Only "Accept All"; consent assumed by continued navigation. | Implied consent is a **compliance risk** under state privacy laws and reads as manipulative. | Medium | [cookie banner](./evidence/home-360-hero-cookie.jpg) |
| 10 | Apply 01–12 | **Disabled button gives no guidance and has low contrast.** The primary button stays disabled (pale lavender) until a value is entered, with no hint of what's missing; white text on the lavender is likely below 4.5:1 (to verify against production tokens). | Users who can't see why they're blocked think the form is broken; low-vision users can't read the label. | Medium | [first name](./evidence/apply-03-first-name.png), [ownership (enabled)](./evidence/apply-08-ownership.png) |
| 11 | Apply 08 | **Pre-selected answer** ("51% or more"). | Data quality and fairness: a minority owner may proceed without reading. | Medium | [ownership](./evidence/apply-08-ownership.png) |
| 12 | Apply 06 | Business name screen assumes an entity ("e.g. John's Plumbing LLC") and asks for "the name that appears on your bank account". | Sole proprietors and gig workers often don't have a business name; ambiguity causes hesitation and abandonment. | Medium | [business name](./evidence/apply-06-business-name.png) |
| 13 | Instagram @fundo_llc | Profile is age-restricted (21+) and invisible to logged-out visitors. | Links from ads, Google or the site footer show a wall instead of proof of legitimacy. | Medium | [age gate](./evidence/instagram-age-gate.jpg) |
| 14 | applicationfrontendwp.azurewebsites.net | **A public, indexed copy of the Fundo WordPress site** on an Azure domain, with Fundo copy and "Apply Now" CTAs, plus typos and stray image labels in body text. | Duplicate content hurts SEO; a lookalike domain asking people to apply is a phishing and trust risk. | Medium | [Azure copy](https://applicationfrontendwp.azurewebsites.net/cash-advance-for-gig-workers) |
| 15 | Apply 10 | At 360 px the state select truncates ("Select your stat…"); 4 fields on one screen. | Truncation looks broken; address is the longest screen of the flow. | Low | [address](./evidence/apply-10-address.png) |
| 16 | Apply 01 vs 02–12 | Headline colour changes (black + cyan on 01, navy on 02–12); emoji used as icons on 01. | Small but visible inconsistency on the first impression. | Low | [Apply 01](./evidence/apply-01-email-hero.jpg) |
| 17 | Home, blog | Copy errors: "A Merchant Cash Advance **Thats**…", "SPECIALITY", gig-economy share stated as 35% on home and 36% on the blog without a source. | Typos on a money product read as carelessness. | Low | [home](https://fundo.com) |
| 18 | Apply 09 | "Checking your information" illustration shows a man with crossed arms. | Defensive body language at a moment of anxiety. | Low | [checking](./evidence/apply-09-checking.png) |

### Financial clarity checklist

| What a customer needs to decide safely | Found on any surface? |
|---|---|
| Cost (factor rate or fee in dollars) | **No** |
| Total payback amount | **No** |
| Payment amount and frequency | **No** (third parties say weekly) |
| What happens if a payment fails (fees, UCC lien) | **No** — and public reporting describes heavy use of UCC liens against workers' accounts ([Protect Borrowers](https://protectborrowers.org/what-in-the-giggle-are-we-doing/)) |
| Eligibility minimums | Partly — home only ($1,500/month, 3 months, bank via Plaid or Decision Logic); not in Apply Now |
| States served | **No** |
| Real funding speed and conditions | Contradictory (see #4) |
| What "not a loan" means and why it matters | **No** — the distinction is only in a legal disclaimer |
| Credit impact of giving SSN | Unclear (see #4) |

**Claims for legal/compliance review:** "regulated financial service provider" (Apply 12); "loan" wording on blog and Azure copy; speed promises; "No credit check" alongside SSN; consumer-income options on Apply 05; bundled marketing consent (Apply 01); implied cookie consent (fundo.com); "Everyone loves us" testimonial framing; AI actors presented as named customers in ads; "bad credit" messaging for a product that says it doesn't check credit.

---

## Time per Apply Now screen

Estimates for a first-time customer on a phone, based on fields, reading and decisions (not measured — Part 3 shows how to measure them).

| Screen | Est. time | What slows them down | Drop-off risk |
|---|---|---|---|
| 01 Email | 30–45 s | Long landing page, hero claims, consent text, chat bubble over the CTA | **High** — intent check + covered CTA |
| 02 Mobile number | 25–40 s | Two consent checkboxes and SMS legal copy; fear of spam calls | Medium |
| 03 First name | 5–10 s | — | Low |
| 04 Last name | 5–10 s | A whole screen for one field | Low |
| 05 Income source | 20–40 s | Decision under uncertainty (I drive Uber *and* have a W-2 job — which one?) | Medium |
| 06 Business name | 15–30 s | Gig workers have no business name; "name on your bank account" makes them check | **High** for sole proprietors |
| 07 Business start date | 15–30 s | Recall; pre-filled default | Medium |
| 08 Ownership | 5–10 s | Pre-selected | Low |
| 09 Checking | 3–5 s | Waiting | Low |
| 10 Home address | 40–60 s | Four fields, autocomplete; CA/NY residents learn here they can't apply | **High** for unserved states |
| 11 Date of birth | 15–20 s | Three inputs | Low |
| 12 SSN | 30–90 s | Finding the card, hesitation, no cost seen yet, "regulated provider" doesn't answer "why" | **Highest** |
| *Any screen* | — | No step count, no "what's next", no saved progress: a dropped connection on a phone restarts the application | Medium, cumulative |
| **Total to SSN** | **≈ 4–6.5 min** | vs. "Take two minutes" on screen 01 | |

---

## Competitors

| | **Fundo** | **Giggle Finance** | **Ualett** | **Square Loans** |
|---|---|---|---|---|
| Amounts | $500–$10,000 | Up to $10k–15k (lower for new customers) | Up to $2,500 | Up to $350k (invitation only) |
| Cost shown before accepting | **No** (factor rate not published) | No (factor rate 1.15–1.7 per review) | **Yes** — flat fee shown upfront | **Yes** — single fixed fee, total shown before accepting |
| Repayment | Weekly — mentioned only in the Facebook bio | Automatic, tied to revenue | Weekly, 8 or 10 weeks, customer picks the weekday | % of daily Square sales; minimum 1/18 of the balance every 60 days |
| Speed promise | Minutes / hours / same day before 3 PM ET (contradictory) | Near-instant approval | 24 business hours new; minutes for returning | Next business day |
| Eligibility and states | $1,500/mo, 3 months; not CA/NY (stated only in Instagram post footers) | $3,000/mo, 3 months; not CA/NY/OR, stated | Bank via Plaid; 49 states, stated | Square sales history |
| Credit check | "No credit check", but asks SSN without explanation | No credit check, stated | Not a factor | No credit check |

**What competitors do better:** Ualett and Square show the cost in dollars before acceptance and say clearly where they operate — exactly what Fundo is missing. Giggle states excluded states upfront. **Where Fundo can win:** a shorter, mobile-first flow with a branded, consistent experience — if it adds the cost and eligibility clarity the others already have.

Sources: [Finder — loans like Fundo](https://www.finder.com/business-loans/loans-like-fundo), [Finder — MCAs for gig workers](https://www.finder.com/business-loans/best-merchant-cash-advances-for-gig-workers), [Nav — Giggle Finance review](https://www.nav.com/blog/giggle-finance-review/). Figures are from third-party reviews and should be confirmed with each provider.

---

## Conversion, screen by screen

| Screen | Why people leave (guess) | Idea | Metric that shows it worked | How to test |
|---|---|---|---|---|
| 01 Email | Doesn't know what they'd get, what it costs or if they qualify; asked for email before any of that; CTA covered by chat | Turn the first screen into a **simulator**: choose an amount, see the total to pay back, number and size of payments and the term, with the flexibility this audience needs (weekly or daily payments, choose the payment day). Add a 3-question eligibility check (state, time working, monthly deposits). Ask for email last, to "save your quote". Chat never covers the CTA; marketing consent becomes a separate, unticked checkbox | % of visitors who reach screen 02 **and** % of starters who pass underwriting minimums | A/B 50/50 on new traffic; chat and consent fixes ship as bug fixes, not tests |
| 02 Mobile number | Fear of spam calls | Say exactly why (one-time code + updates on this application) and how often; make promotional texts clearly optional | % reaching 03 | A/B 50/50 |
| 03 First name | Low | Merge 03 + 04 into one "Your legal name" screen | % reaching 05; time 03→05 | A/B 50/50 |
| 04 Last name | Feels repetitive | (merged with 03) | — | — |
| 05 Income source | Doesn't know which option fits | Rewrite options around how money arrives ("Payouts from apps like Uber or DoorDash", "Customer payments to my business"); remove or redirect consumer-income option to a clear "not a fit" page | % reaching 06; % of starters who later qualify | A/B 50/50 |
| 06 Business name | No business name (sole proprietors) | Allow "I don't have one — use my name" | % reaching 07 among gig/self-employed | A/B 50/50, segment by income type |
| 07 Start date | Recall + wrong default | No default; use "About how long have you been doing this work?" (less than 3 months / 3–12 months / 1–3 years / 3+ years) | % reaching 08; % of auto-declines for time in business | A/B 50/50 |
| 08 Ownership | Pre-selection | No default; one-line explanation of why ownership matters | Completion rate; data accuracy vs. later documents | A/B 50/50 |
| 09 Checking | Anxiety while waiting; no idea how much is left | Replace with progress that says what's next ("Next: your address and a quick identity check"); across the wizard, show sections and steps ("Step 3 of 7 — About your business") and save progress automatically so a dropped connection doesn't mean starting over | % reaching 10; resumed sessions that reach SSN | A/B 50/50 |
| 10 Home address | CA/NY learn here they can't apply; long form | Ask state at the start (screen 01 check); single address autocomplete field | % reaching 11; share of unserved-state applicants reaching 10 (should go to ~0) | A/B 50/50 |
| 11 Date of birth | Three fields | Single numeric field with mask (MM/DD/YYYY), numeric keypad | % reaching 12; error rate | A/B 50/50 |
| 12 SSN | No cost seen yet; unclear why SSN; fear of credit hit | Before the field: a plain cost example ("$2,000 today, $2,600 total, 20 weekly payments of $130" — real numbers from pricing), what happens if a payment fails, and "This does not affect your credit score — we use it to confirm your identity" (if true, per compliance) | Start-to-SSN completion; **guardrails:** offer acceptance rate, early-default rate, support contacts about cost | A/B 50/50, 2+ weeks, guardrails mandatory |

### Entry points before Apply Now

| Entry point | Idea | Metric | Test |
|---|---|---|---|
| fundo.com home | Replace the "Approved in minutes, funded in hours" hero with the same simulator as Apply Now 01 (amount → total payback → payments), plus the eligibility check; align visuals to Apply Now so the handoff doesn't look like a different site | Home → Apply start rate; % of starters who qualify | A/B 50/50 |
| Blog post (e.g. [fuel financing for gig workers](https://fundo.com/fuel-financing-gig-workers/)) | One consistent product name ("cash advance", never "loan"); a contextual CTA box ("See if you qualify in 30 seconds") with cost example, instead of generic "Apply now" | Blog → Apply start; qualification rate of blog traffic | A/B on the CTA block |
| Instagram post | Open the template system to more formats and intentions (education, real customer stories, how the cost works, Q&A) instead of one rigid AI-image template; every post states who it's for and links to the simulator. Remove the 21+ age gate if not legally required | Link clicks → qualified starts (UTM) | Compare 2 post variants with the same budget |

---

## What to test first

1. **Ship without testing (fixes, not experiments):** chat button covering the CTA, bundled marketing consent, pre-filled defaults on 07/08, typos. They are defects; testing them delays a fix that has no downside.
2. **Test 1 — Simulator + eligibility check as the first screen (01, and state moved up from 10).** Answers the two deciding questions — what does it cost, can I get it — before asking for anything. Removes unfundable applications before customers spend 3+ minutes. Expected effect: fewer starts, more qualified completions. Primary metric: qualified starts; guardrails: funded deals per visitor must not drop; offer acceptance must not drop. **This is the Part 2 redesign.**
3. **Test 2 — Predictability and recovery across the wizard** (steps and sections, "what's next", save-and-resume) plus credit clarity before SSN (screen 12). Primary: start-to-SSN; guardrails: offer acceptance, early default, cost-related complaints.
4. **Test 3 — Merge name screens + DOB single field.** Low risk, small lift; run after the first two to avoid overlapping tests on the same funnel.

**Not a win:** any variant that raises applications but lowers the share that qualifies, accepts the offer knowing the total payback, or repays on schedule.

---

## Assumptions and what I could not see

- **Instagram, Facebook and LinkedIn:** Instagram is age-gated for logged-out visitors; all three were reviewed by Victoria from her own account on desktop. Screenshots in `/evidence` have the reviewer's name, avatar and third-party accounts redacted.
- **Emails/SMS:** not observable without applying (not allowed); assumed to follow the portal's visual style.
- **After SSN** (bank connection, offer, contract): not in the prototype; cost may be disclosed there — the issue is that it comes **after** the customer has given SSN.
- **Pricing and states** come from third-party reviews (Finder, Nav), not from Fundo. Square's fixed-fee disclosure and next-business-day speed are from general knowledge of Square's public loan pages and should be re-checked before the debrief.
- **Contrast** of the lavender button is judged visually; to be confirmed against production tokens.
- **Time estimates** are heuristic, not measured.
