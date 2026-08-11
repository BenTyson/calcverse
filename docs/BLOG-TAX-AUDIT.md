# Blog post tax-figure audit — flagged, NOT rewritten

Verified against TY2026 primary sources on 2026-08-09. 40 posts total; 13 carry
incorrect tax figures. Ranked by AdSense/YMYL risk.

Correct TY2026 reference values:
- SS wage base $184,500 (2025: $176,100 · 2024: $168,600)
- Mileage $0.725 Jan1–Jun30 2026, $0.76 Jul1–Dec31 2026 (2025: $0.70 · 2024: $0.67)
- Std deduction single $16,100 (2025: $15,750 · 2024: $14,600)
- QBI threshold $201,750 single / $403,500 MFJ (2024: $191,950 / $383,900)
- LTCG 0% cap single $49,450, 15% cap $545,500 (2025: $48,350 / $533,400)
- Solo 401(k) $24,500 employee / $72,000 combined; IRA $7,500 (+$1,100 catch-up)

## TIER 1 — post explicitly says "2026" next to a wrong number

### self-employment-tax-guide.md  (title: "Self-Employment Tax Guide 2026")
- L29  "In 2026, that wage base is $168,600"        → $184,500 (2024 figure)
- L52  "under the $168,600 cap"                      → $184,500
- L107 "standard mileage rate of $0.70/mile in 2026" → $0.725 / $0.76 (2025 figure)
- L118 QBI SSTB "$191,950 single / $383,900 MFJ in 2026" → $201,750 / $403,500
- L181 "$168,600 wage base"                          → $184,500
- L199 worked example built on $168,600 cap ($19,307 SS / $4,515 Medicare / $23,822 total) → rebuild at $184,500
- L207 "Solo 401(k) $23,500 employee ... combined maximum of $70,000 in 2026" → $24,500 / $72,000

### w2-vs-1099-tax-difference.md
- L17  "In 2026 ... 15.3% on earnings up to $168,600" → $184,500
- L39–56 ENTIRE worked example uses "standard deduction of $15,700" labelled 2026.
         $15,700 matches no year (2025 was $15,750; 2026 is $16,100). Every
         downstream figure — taxable income $84,300, federal tax $14,260,
         $77,235, $12,550, total burden $25,910, take-home $74,090 — is wrong.
- L91  QBI "above $191,950 for single filers in 2026" → $201,750
- L103 "$23,500 in 2026 ... combined limit of $70,000" → $24,500 / $72,000
- L105 "$23,500 ... saves roughly $5,170"              → recompute at $24,500

### capital-gains-tax-freelancers.md
- L27–30 "For single filers in 2026 ... 0% below $48,350 / 15% $48,350–$533,400 /
          20% above $533,400" → these are the 2025 figures.
          2026: $49,450 / $49,450–$545,500 / above $545,500

### uber-lyft-driver-earnings.md
- L91  "IRS standard mileage rate for 2026 is $0.67"  → 2024 rate; now $0.76
- L115 "The 2026 IRS standard mileage rate is $0.67 ... $335/week or $17,420/year"
       → at $0.76: $380/week, $19,760/year
- L119 "deduct $0.67 for every mile"                  → $0.76

### how-to-calculate-freelance-rate.md
- L23  "15.3% on the first $168,600 ... in 2026"      → $184,500
       (the $14,130 SE-tax example at $100k happens to still hold, since $100k
        is under both caps — but the quoted cap is wrong)

### doordash-driver-earnings.md  (title: "2026 Breakdown")
- L57  "IRS standard mileage rate for 2026 is $0.70"  → 2025 rate; now $0.76

### reselling-profit-guide.md
- L129 "mileage ... at $0.70 per mile in 2026"        → $0.76

### net-worth-freelancers.md
- L41  "up to $23,500 as an employee contribution ... in 2026" → $24,500

## TIER 2 — labelled an earlier year; stale, and several were wrong even then

### gig-delivery-apps-compared.md
- L68  "$0.67 per mile for 2025" → wrong twice: 2025 was $0.70, and 2026 is $0.76
- L112 "$0.67 per mile in 2025 ... 12,000 miles → $8,040 deduction"
       → at $0.76: $9,120

### side-hustle-taxes.md
- L42  "For 2025, the standard mileage rate is 70 cents ... 12,000 miles = $8,400"
       → correct for 2025, stale for 2026 ($0.76 → $9,120)
- L88  "combined earnings up to $168,600 (2025 threshold)" → 2025 was $176,100;
       2026 is $184,500. The "$48,600 of side hustle income" example is wrong.

### quarterly-tax-guide-freelancers.md
- L51  "The 2025 SE tax rate is 15.3 percent ... net earnings up to $168,600"
       → 2025 base was $176,100; 2026 is $184,500

### freelance-retirement-planning.md  — whole post on stale limits
- L10, 24, 30, 88  "$69,000 in 2025" → 2025 was $70,000, 2026 is $72,000
                    (already wrong for its own stated year)
- L20, 32, 82      "$23,500 ... in 2025"  → $24,500
- L38, 40, 44, 78, 90, 118  "$7,000 ($8,000 if 50+)" → $7,500 ($8,600 if 50+)
- L20              "$7,500 catch-up ... brings employee side to $31,000" → $8,000 / $32,500

## TIER 3 — year in title only, no tax-figure error (freshness claim, low risk)

best-platforms-selling-digital-products.md · consulting-rates-by-industry-2026.md ·
etsy-fees-explained.md · freelance-writing-rates-2026.md ·
podcaster-sponsorship-earnings.md · print-on-demand-2026.md · rent-vs-buy-2026.md ·
tiktok-creator-earnings.md · youtube-adsense-rates-by-niche.md

These carry market/platform-rate data, not IRS figures. Worth a freshness pass
but nothing here is factually wrong on tax law.
