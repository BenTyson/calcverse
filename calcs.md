# New Calculator Roadmap (Phases 7-12)

~25 new calculators across 6 phases, bringing CalcFalcon from 25 to ~50 calculators.

**Build process:** Each calculator uses the `/add-calculator` skill, which handles the full 3-layer pattern (logic, UI, page), shared components, embeds, and all conventions.

**Current state:** 25 calculators — Freelance (4), Creator (9), Gig (7), Side Hustle (1), Personal Finance (4)

---

## Phase 7: Side Hustle Buildout

**Why:** Side Hustle has 1 calculator (Side Hustle Goal) — the weakest category by far. Four new calcs fill the gap, balance the nav, and target high-intent "how much can I make" keywords.

| Calculator | Slug | Description | Target Keyword | Vol (Est.) |
|-----------|------|-------------|---------------|------------|
| Reselling Profit | `side-hustle/reselling-profit-calculator` | Profit margins for flipping items (eBay, Poshmark, FB Marketplace). Accounts for platform fees, shipping, COGS, and time spent sourcing. | "reselling profit calculator" | 1,800 |
| Freelance Writing Rate | `side-hustle/freelance-writing-rate-calculator` | Per-word vs per-article vs retainer pricing for side-hustle writers. Factors in research time, revisions, and experience level. | "freelance writing rate calculator" | 2,200 |
| Tutoring Income | `side-hustle/tutoring-income-calculator` | Earnings from private tutoring or platforms (Wyzant, Varsity Tutors). Accounts for platform cuts, prep time, and travel. | "tutoring income calculator" | 1,400 |
| Dropshipping Margin | `side-hustle/dropshipping-margin-calculator` | True margins after ad spend, supplier cost, platform fees, returns, and refunds. Reality-check tool for dropshipping beginners. | "dropshipping profit calculator" | 3,100 |

**Affiliate opportunities:** Poshmark/eBay seller tools, writing course platforms, tutoring platform referrals

---

## Phase 8: Freelance Business Essentials

**Why:** Current freelance calcs cover rates and taxes. These four target the business operations side — pricing projects, planning retirement, quantifying meeting overhead, and budgeting time off. All high-intent keywords with finance-adjacent CPMs.

| Calculator | Slug | Description | Target Keyword | Vol (Est.) |
|-----------|------|-------------|---------------|------------|
| Freelance Retirement | `freelance/freelance-retirement-calculator` | Solo 401(k) vs SEP-IRA vs Traditional IRA comparison for self-employed. Contribution limits, tax savings, projected growth. | "freelance retirement calculator" | 1,600 |
| Meeting Cost | `freelance/meeting-cost-calculator` | True cost of meetings based on attendee rates and duration. Shows annual meeting spend and opportunity cost. | "meeting cost calculator" | 2,900 |
| Freelance Vacation Fund | `freelance/freelance-vacation-calculator` | How much to set aside for unpaid time off. Factors in lost income, travel costs, and catch-up time buffer. | "freelance vacation calculator" | 800 |
| Value-Based Pricing | `freelance/value-based-pricing-calculator` | Price projects by client ROI rather than hours. Inputs: estimated client value, your share %, project scope. Compares to hourly equivalent. | "value based pricing calculator" | 1,200 |

**Affiliate opportunities:** Solo 401(k) providers (Fidelity, Schwab), time-tracking tools (Toggl, Harvest)

---

## Phase 9: Creator Economy Deepening

**Why:** Creator is the largest category (9) but misses several high-growth platforms and monetization models. These four target course creators, newsletter operators, brand deal negotiators, and print-on-demand sellers — all growing segments with strong affiliate potential.

| Calculator | Slug | Description | Target Keyword | Vol (Est.) |
|-----------|------|-------------|---------------|------------|
| Online Course Revenue | `creator/online-course-revenue-calculator` | Revenue projections for Teachable, Udemy, Skillshare, or self-hosted courses. Models launch vs evergreen pricing, completion rates, and refunds. | "online course revenue calculator" | 1,800 |
| Newsletter Revenue | `creator/newsletter-revenue-calculator` | Monetization model for paid newsletters (Substack, Beehiiv, ConvertKit). Subscriber growth, paid conversion rate, sponsorship revenue, churn. | "newsletter revenue calculator" | 1,400 |
| Sponsorship Rate | `creator/sponsorship-rate-calculator` | What to charge for brand deals based on audience size, engagement rate, platform, and deliverable type (post, video, story, integration). | "sponsorship rate calculator" | 2,400 |
| Print-on-Demand Profit | `creator/print-on-demand-profit-calculator` | Margins for POD products (Printful, Printify, Merch by Amazon). Per-product profit after base cost, shipping, and platform fees. | "print on demand profit calculator" | 2,200 |

**Affiliate opportunities:** Teachable/Thinkific (course platforms), Beehiiv/ConvertKit (newsletter tools), Printful/Printify referrals

---

## Phase 10: Personal Finance Expansion

**Why:** Personal finance has the highest CPMs and strongest affiliate revenue. These four target evergreen financial planning keywords with significant search volume and clear monetization paths.

| Calculator | Slug | Description | Target Keyword | Vol (Est.) |
|-----------|------|-------------|---------------|------------|
| Debt Payoff | `personal-finance/debt-payoff-calculator` | Snowball vs avalanche debt payoff strategies. Multiple debts, minimum payments, extra payment allocation. Shows payoff timeline and total interest saved. | "debt payoff calculator" | 12,100 |
| Stock Options (ISO/RSU) | `personal-finance/stock-options-calculator` | Estimate value of ISOs, NSOs, and RSUs. Factors in strike price, vesting schedule, current/projected FMV, AMT implications, and exercise strategies. | "stock option calculator" | 6,600 |
| Crypto Tax Estimator | `personal-finance/crypto-tax-calculator` | Estimate capital gains tax on crypto transactions. Short-term vs long-term holds, cost basis methods (FIFO, LIFO, specific ID), and tax bracket impact. | "crypto tax calculator" | 4,400 |
| Net Worth Tracker | `personal-finance/net-worth-calculator` | Assets minus liabilities snapshot. Categorized inputs (cash, investments, property, debts). Shows net worth breakdown and suggests benchmarks by age. | "net worth calculator" | 8,100 |

**Affiliate opportunities:** Debt consolidation (SoFi, LendingClub), tax software (TurboTax, CoinTracker), investment platforms (Wealthfront, Betterment)

---

## Phase 11: Gig & Niche Expansion

**Why:** Five calculators that fill specific platform gaps (Rover, Shipt) and capture niche-but-valuable keywords (photography ROI, commute cost, solar ROI) with high CPMs and low competition.

| Calculator | Slug | Description | Target Keyword | Vol (Est.) |
|-----------|------|-------------|---------------|------------|
| Rover Pet Sitting | `gig-economy/rover-profit-calculator` | Earnings from dog walking, boarding, and drop-in visits on Rover. Accounts for Rover's 20% fee, supplies, travel, and seasonal demand. | "rover earnings calculator" | 1,200 |
| Shipt Shopper | `gig-economy/shipt-earnings-calculator` | Per-order and hourly earnings for Shipt shoppers. Factors in order pay, tips, mileage, and time per shop. | "shipt pay calculator" | 1,600 |
| Photography Gear ROI | `gig-economy/photography-gear-roi-calculator` | When camera/lens purchases pay for themselves. Inputs: gear cost, bookings per month, rate per shoot, gear lifespan. Break-even timeline. | "photography gear roi calculator" | 700 |
| Commute Cost | `personal-finance/commute-cost-calculator` | True annual cost of commuting — gas, maintenance, insurance portion, parking, tolls, public transit, and time opportunity cost. Compare commute options. | "commute cost calculator" | 3,600 |
| Solar Panel ROI | `personal-finance/solar-panel-roi-calculator` | Payback period for solar installation. System cost, tax credits (ITC), monthly energy savings, net metering, panel degradation over time. | "solar panel roi calculator" | 4,400 |

**Affiliate opportunities:** Rover referral program, solar quote services (EnergySage), camera gear (B&H, Amazon)

---

## Phase 12: Comparison & Decision Tools

**Why:** "X vs Y" queries signal high purchase intent and convert well. These four comparison calculators target decision-making moments where users are actively choosing between options — perfect for affiliate placements on both sides.

| Calculator | Slug | Description | Target Keyword | Vol (Est.) |
|-----------|------|-------------|---------------|------------|
| LLC vs S-Corp | `freelance/llc-vs-s-corp-calculator` | Tax comparison: LLC (Schedule C) vs S-Corp (reasonable salary + distributions). Shows self-employment tax savings, payroll costs, and net difference at various income levels. | "llc vs s corp calculator" | 5,400 |
| Full-Time vs Freelance | `freelance/full-time-vs-freelance-calculator` | Total comp comparison. Salary + benefits (health, 401k match, PTO value) vs freelance gross minus self-employment tax, insurance, retirement, and unpaid time off. | "freelance vs full time calculator" | 2,400 |
| Buy vs Lease (Car) | `personal-finance/buy-vs-lease-calculator` | True cost comparison of buying vs leasing a vehicle over 3-7 years. Factors in depreciation, interest, residual value, maintenance, and opportunity cost of down payment. | "buy vs lease calculator" | 6,600 |
| Sell vs Rent (Home) | `personal-finance/sell-vs-rent-out-calculator` | Should you sell your home or rent it out? Models rental income, vacancy, management fees, capital gains tax, opportunity cost of equity, and appreciation. | "sell or rent out house calculator" | 2,900 |

**Affiliate opportunities:** LLC formation services (LegalZoom, Incfile), health insurance marketplaces, car buying/leasing services, property management tools

---

## Phase Priority & Dependencies

```
Phase 7 (Side Hustle Buildout)     ← highest priority, fixes category imbalance
Phase 8 (Freelance Business)       ← strong SEO + affiliate value
Phase 10 (Personal Finance)        ← highest CPM potential
Phase 9 (Creator Deepening)        ← builds on largest category
Phase 12 (Comparison Tools)        ← high-intent "vs" queries
Phase 11 (Gig & Niche)            ← fills gaps, niche wins
```

## Totals by Category (After All Phases)

| Category | Current | Added | Total |
|----------|---------|-------|-------|
| Freelance | 4 | +6 | 10 |
| Creator | 9 | +4 | 13 |
| Gig Economy | 7 | +2 | 9 |
| Side Hustle | 1 | +4 | 5 |
| Personal Finance | 4 | +9 | 13 |
| **Total** | **25** | **+25** | **50** |
