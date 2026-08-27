export interface FundingRound {
  id: string;
  company: string;
  stage: 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B' | 'Series C' | 'Growth';
  amountMillions: number; // in $M
  valuationMillions?: number; // in $M
  leadInvestors: string[];
  sector: 'Agentic Infra' | 'Foundation Models' | 'AI DevTools' | 'Bio-AI' | 'Robotics' | 'Enterprise Agents';
  date: string;
  description: string;
  sourceUrl: string;
  featured?: boolean;
}

export interface MonthlySectorVolume {
  month: string;
  totalMillions: number;
  agenticInfra: number;
  foundationModels: number;
  devTools: number;
  robotics: number;
}

export const MONTHLY_FUNDING_TRENDS: MonthlySectorVolume[] = [
  { month: 'Oct 2024', totalMillions: 1420, agenticInfra: 420, foundationModels: 650, devTools: 230, robotics: 120 },
  { month: 'Nov 2024', totalMillions: 1890, agenticInfra: 580, foundationModels: 820, devTools: 340, robotics: 150 },
  { month: 'Dec 2024', totalMillions: 1650, agenticInfra: 610, foundationModels: 590, devTools: 280, robotics: 170 },
  { month: 'Jan 2025', totalMillions: 2450, agenticInfra: 890, foundationModels: 950, devTools: 410, robotics: 200 },
  { month: 'Feb 2025', totalMillions: 2810, agenticInfra: 1120, foundationModels: 980, devTools: 490, robotics: 220 },
];

export const SECTOR_DISTRIBUTION = [
  { name: 'Agentic Infrastructure', percentage: 38, color: '#38bdf8' },
  { name: 'Foundation & Frontier Models', percentage: 34, color: '#a855f7' },
  { name: 'AI Developer Tooling', percentage: 18, color: '#34d399' },
  { name: 'Embodied Robotics & Bio', percentage: 10, color: '#fbbf24' },
];

export const FUNDING_ROUNDS_DATA: FundingRound[] = [
  {
    id: 'cognition-series-b',
    company: 'Cognition AI (Devin)',
    stage: 'Series B',
    amountMillions: 175,
    valuationMillions: 2000,
    leadInvestors: ['Founders Fund', 'Elad Gil', 'Peter Thiel'],
    sector: 'Enterprise Agents',
    date: 'Jan 2025',
    description: 'Autonomous AI software engineering platform scale-up and enterprise deployments.',
    sourceUrl: 'https://cognition.ai',
    featured: true,
  },
  {
    id: 'magic-series-c',
    company: 'Magic.dev',
    stage: 'Series C',
    amountMillions: 320,
    valuationMillions: 1500,
    leadInvestors: ['Eric Schmidt', 'Sequoia Capital', 'Atlassian'],
    sector: 'AI DevTools',
    date: 'Dec 2024',
    description: 'Ultra-long 100M context window frontier coding models and supercomputing infrastructure.',
    sourceUrl: 'https://magic.dev',
    featured: true,
  },
  {
    id: 'anysphere-cursor',
    company: 'Anysphere (Cursor)',
    stage: 'Series A',
    amountMillions: 60,
    valuationMillions: 400,
    leadInvestors: ['Andreessen Horowitz (a16z)', 'OpenAI Startup Fund', 'Nat Friedman'],
    sector: 'AI DevTools',
    date: 'Nov 2024',
    description: 'Rapid expansion of the Cursor AI IDE, Shadow Workspace compiler, and agent orchestration.',
    sourceUrl: 'https://cursor.com',
    featured: true,
  },
  {
    id: 'poolside-series-b',
    company: 'Poolside AI',
    stage: 'Series B',
    amountMillions: 500,
    valuationMillions: 3000,
    leadInvestors: ['Bain Capital Ventures', 'DST Global', 'StepStone'],
    sector: 'Foundation Models',
    date: 'Oct 2024',
    description: 'Software development foundation models with automated reinforcement learning feedback loops.',
    sourceUrl: 'https://poolside.ai',
    featured: false,
  },
  {
    id: 'physical-intelligence',
    company: 'Physical Intelligence (π)',
    stage: 'Series A',
    amountMillions: 400,
    valuationMillions: 2400,
    leadInvestors: ['Jeff Bezos', 'OpenAI', 'Thrive Capital', 'Lux Capital'],
    sector: 'Robotics',
    date: 'Nov 2024',
    description: 'General-purpose robot foundation model (π0) for dexterous real-world manipulation.',
    sourceUrl: 'https://physicalintelligence.company',
    featured: true,
  },
  {
    id: 'codeium-series-c',
    company: 'Codeium (Windsurf)',
    stage: 'Series C',
    amountMillions: 150,
    valuationMillions: 1250,
    leadInvestors: ['General Catalyst', 'Kleiner Perkins', 'Greenoaks'],
    sector: 'AI DevTools',
    date: 'Aug 2024',
    description: 'Enterprise AI code completion engine and Windsurf agentic IDE commercialization.',
    sourceUrl: 'https://codeium.com',
    featured: false,
  },
];
