import type { CategoryKey } from '@lib/utils/category-styles';

export interface CalculatorEntry {
  name: string;
  description: string;
  href: string;
  category: string;
  categoryKey: CategoryKey;
  featured?: boolean;
}

export interface CategoryEntry {
  key: CategoryKey;
  name: string;
  description: string;
  href: string;
}

export const CATEGORIES: CategoryEntry[] = [
  { key: 'freelance', name: 'Freelance', description: 'Calculate rates, taxes, and compare employment options', href: '/freelance' },
  { key: 'creator', name: 'Creator', description: 'Estimate revenue from YouTube, Twitch, and more', href: '/creator' },
  { key: 'gig', name: 'Gig Economy', description: 'Track earnings for rideshare, delivery, and rentals', href: '/gig-economy' },
  { key: 'sidehustle', name: 'Side Hustle', description: 'Plan your path to financial goals', href: '/side-hustle' },
  { key: 'finance', name: 'Personal Finance', description: 'FIRE planning, emergency funds, and budgeting', href: '/personal-finance' },
];

export const CALCULATORS: CalculatorEntry[] = [
  // Freelance (9)
  { name: 'Freelancer Hourly Rate Calculator', description: 'Calculate your ideal hourly rate based on income goals, taxes, and expenses', href: '/freelance/hourly-rate-calculator', category: 'Freelance', categoryKey: 'freelance', featured: true },
  { name: 'Quarterly Tax Estimator', description: 'Estimate your quarterly estimated tax payments including self-employment tax', href: '/freelance/quarterly-tax-calculator', category: 'Freelance', categoryKey: 'freelance' },
  { name: 'W2 vs 1099 Comparison', description: 'Compare take-home pay between W2 employment and 1099 contractor work', href: '/freelance/w2-vs-1099-calculator', category: 'Freelance', categoryKey: 'freelance' },
  { name: 'Project Rate Calculator', description: 'Convert your hourly rate to project-based pricing with buffers and tiers', href: '/freelance/project-rate-calculator', category: 'Freelance', categoryKey: 'freelance' },
  { name: 'Freelance Retirement Calculator', description: 'Compare Solo 401(k), SEP-IRA, Traditional and Roth IRA options for the self-employed', href: '/freelance/freelance-retirement-calculator', category: 'Freelance', categoryKey: 'freelance' },
  { name: 'Meeting Cost Calculator', description: 'Calculate the true cost of meetings including prep, follow-up, and context switching', href: '/freelance/meeting-cost-calculator', category: 'Freelance', categoryKey: 'freelance' },
  { name: 'Freelance Vacation Fund Calculator', description: 'How much to save for unpaid time off including lost income and catch-up time', href: '/freelance/freelance-vacation-calculator', category: 'Freelance', categoryKey: 'freelance' },
  { name: 'Value-Based Pricing Calculator', description: 'Price projects by client ROI rather than hours worked', href: '/freelance/value-based-pricing-calculator', category: 'Freelance', categoryKey: 'freelance' },
  { name: 'Self-Employment Tax Calculator', description: 'Calculate Social Security, Medicare, and Additional Medicare taxes on self-employment income', href: '/freelance/self-employment-tax-calculator', category: 'Freelance', categoryKey: 'freelance' },

  // Creator (13)
  { name: 'YouTube AdSense Revenue Calculator', description: 'Estimate your YouTube earnings based on views, niche, and audience location', href: '/creator/youtube-adsense-calculator', category: 'Creator', categoryKey: 'creator', featured: true },
  { name: 'Twitch Revenue Calculator', description: 'Calculate Twitch earnings from subs, bits, ads, and sponsorships', href: '/creator/twitch-calculator', category: 'Creator', categoryKey: 'creator' },
  { name: 'Podcast Sponsorship Calculator', description: 'Estimate podcast ad revenue based on downloads, CPM, and ad inventory', href: '/creator/podcast-calculator', category: 'Creator', categoryKey: 'creator' },
  { name: 'Patreon Earnings Calculator', description: 'Calculate your Patreon take-home after fees based on patron count and plan tier', href: '/creator/patreon-calculator', category: 'Creator', categoryKey: 'creator' },
  { name: 'Ko-fi Earnings Calculator', description: 'Calculate Ko-fi income from donations, memberships, and shop sales', href: '/creator/kofi-calculator', category: 'Creator', categoryKey: 'creator' },
  { name: 'Etsy Fee Calculator', description: 'Calculate your true profit per item after all Etsy fees and costs', href: '/creator/etsy-fee-calculator', category: 'Creator', categoryKey: 'creator' },
  { name: 'Substack Revenue Calculator', description: 'Calculate newsletter subscription revenue after fees with growth projections', href: '/creator/substack-calculator', category: 'Creator', categoryKey: 'creator' },
  { name: 'TikTok Earnings Calculator', description: 'Estimate TikTok income from Creator Fund, brand deals, and LIVE gifts', href: '/creator/tiktok-calculator', category: 'Creator', categoryKey: 'creator', featured: true },
  { name: 'Gumroad Revenue Calculator', description: 'Calculate Gumroad digital product revenue after fees, affiliates, and refunds', href: '/creator/gumroad-calculator', category: 'Creator', categoryKey: 'creator' },
  { name: 'Sponsorship Rate Calculator', description: 'Calculate what to charge for brand deals based on audience, engagement, and niche', href: '/creator/sponsorship-rate-calculator', category: 'Creator', categoryKey: 'creator' },
  { name: 'Print-on-Demand Profit Calculator', description: 'Calculate POD profit per unit and monthly revenue across Printful, Printify, and Merch by Amazon', href: '/creator/print-on-demand-profit-calculator', category: 'Creator', categoryKey: 'creator' },
  { name: 'Online Course Revenue Calculator', description: 'Estimate course revenue after platform fees on Teachable, Udemy, Skillshare, or self-hosted', href: '/creator/online-course-revenue-calculator', category: 'Creator', categoryKey: 'creator' },
  { name: 'Newsletter Revenue Calculator', description: 'Calculate newsletter income from subscriptions and sponsorships across Substack, Beehiiv, and ConvertKit', href: '/creator/newsletter-revenue-calculator', category: 'Creator', categoryKey: 'creator' },

  // Gig Economy (7)
  { name: 'Uber/Lyft Driver Earnings Calculator', description: 'Calculate your true rideshare earnings after gas, maintenance, and depreciation', href: '/gig-economy/uber-lyft-calculator', category: 'Gig Economy', categoryKey: 'gig' },
  { name: 'DoorDash/Delivery Earnings Calculator', description: 'Track your delivery earnings and calculate your effective hourly rate', href: '/gig-economy/doordash-calculator', category: 'Gig Economy', categoryKey: 'gig', featured: true },
  { name: 'Instacart Shopper Calculator', description: 'Estimate your Instacart shopping earnings after gas and expenses', href: '/gig-economy/instacart-calculator', category: 'Gig Economy', categoryKey: 'gig' },
  { name: 'Airbnb Profit Calculator', description: 'Estimate your short-term rental profit after all fees and expenses', href: '/gig-economy/airbnb-calculator', category: 'Gig Economy', categoryKey: 'gig' },
  { name: 'Amazon Flex Earnings Calculator', description: 'Calculate your true Amazon Flex earnings after gas and vehicle expenses', href: '/gig-economy/amazon-flex-calculator', category: 'Gig Economy', categoryKey: 'gig' },
  { name: 'TaskRabbit Earnings Calculator', description: 'Calculate your real TaskRabbit earnings after service fees and expenses', href: '/gig-economy/taskrabbit-calculator', category: 'Gig Economy', categoryKey: 'gig' },
  { name: 'Turo Profit Calculator', description: 'Calculate your Turo car rental profit after host fees and expenses', href: '/gig-economy/turo-calculator', category: 'Gig Economy', categoryKey: 'gig' },

  // Side Hustle (6)
  { name: 'Side Hustle Time to Goal Calculator', description: 'Calculate how long your side hustle will take to reach your financial goal', href: '/side-hustle/time-to-goal-calculator', category: 'Side Hustle', categoryKey: 'sidehustle' },
  { name: 'Reselling Profit Calculator', description: 'Calculate your reselling profit after platform fees, shipping, and costs on eBay, Poshmark, Mercari, and more', href: '/side-hustle/reselling-profit-calculator', category: 'Side Hustle', categoryKey: 'sidehustle' },
  { name: 'Freelance Writing Rate Calculator', description: 'Calculate your per-word and per-article rate based on time, experience, and desired income', href: '/side-hustle/freelance-writing-rate-calculator', category: 'Side Hustle', categoryKey: 'sidehustle' },
  { name: 'Tutoring Income Calculator', description: 'Calculate your tutoring earnings after platform fees, prep time, and expenses', href: '/side-hustle/tutoring-income-calculator', category: 'Side Hustle', categoryKey: 'sidehustle' },
  { name: 'Dropshipping Margin Calculator', description: 'Analyze your true dropshipping profit after supplier costs, ads, fees, returns, and refunds', href: '/side-hustle/dropshipping-margin-calculator', category: 'Side Hustle', categoryKey: 'sidehustle' },
  { name: 'Profit Margin Calculator', description: 'Calculate gross, operating, and net profit margins with cost breakdown analysis', href: '/side-hustle/profit-margin-calculator', category: 'Side Hustle', categoryKey: 'sidehustle' },

  // Personal Finance (4)
  { name: 'FIRE Calculator', description: 'Calculate your Financial Independence number and how long until you can retire early', href: '/personal-finance/fire-calculator', category: 'Personal Finance', categoryKey: 'finance', featured: true },
  { name: 'Emergency Fund Calculator', description: 'Find out how much you need saved for emergencies based on your expenses and risk factors', href: '/personal-finance/emergency-fund-calculator', category: 'Personal Finance', categoryKey: 'finance' },
  { name: 'Rent vs Buy Calculator', description: 'Compare the true cost of renting vs buying a home over time, including equity and investments', href: '/personal-finance/rent-vs-buy-calculator', category: 'Personal Finance', categoryKey: 'finance' },
  { name: 'Subscription Audit Calculator', description: 'Track all your subscriptions, categorize spending, and find savings opportunities', href: '/personal-finance/subscription-audit-calculator', category: 'Personal Finance', categoryKey: 'finance', featured: true },
];
