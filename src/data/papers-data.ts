export interface ResearchPaper {
  id: string;
  title: string;
  authors: string;
  institution: string;
  topic: 'Reasoning & RL' | 'Agent Architectures' | 'Synthetic Data' | 'Inference Optimization' | 'Safety & Alignment';
  date: string;
  arxivId: string;
  arxivUrl: string;
  githubUrl?: string;
  summaryTakeaways: [string, string, string];
  featured?: boolean;
}

export const PAPERS_DATA: ResearchPaper[] = [
  {
    id: 'deepseek-r1-paper',
    title: 'DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning',
    authors: 'DeepSeek-AI Research Team',
    institution: 'DeepSeek AI',
    topic: 'Reasoning & RL',
    date: 'Jan 2025',
    arxivId: '2501.12948',
    arxivUrl: 'https://arxiv.org/abs/2501.12948',
    githubUrl: 'https://github.com/deepseek-ai/DeepSeek-R1',
    summaryTakeaways: [
      'Demonstrates that pure reinforcement learning (DeepSeek-R1-Zero) directly incentivizes self-verification and search behaviors without supervised fine-tuning.',
      'Introduces Group Relative Policy Optimization (GRPO) to bypass standard critic models, drastically lowering RL compute overhead.',
      'Open-sources distilled 1.5B to 70B reasoning models matching high-tier proprietary reasoning benchmarks.',
    ],
    featured: true,
  },
  {
    id: 'swe-bench-multimodal',
    title: 'SWE-bench Multimodal: Do AI Systems Have What It Takes to Solve Visual Software Bugs?',
    authors: 'John Yang, Carlos E. Jimenez, Alexander Wettig, et al.',
    institution: 'Princeton University & Stanford',
    topic: 'Agent Architectures',
    date: 'Dec 2024',
    arxivId: '2410.03859',
    arxivUrl: 'https://arxiv.org/abs/2410.03859',
    githubUrl: 'https://github.com/princeton-nlp/SWE-bench',
    summaryTakeaways: [
      'Extends the industry gold-standard SWE-bench benchmark to visual software engineering tasks across real-world web and desktop apps.',
      'Identifies key bottlenecks in UI layout understanding, visual regression debugging, and coordinate localization.',
      'Sets up standardized evaluation harness for autonomous coding agents with multimodal capabilities.',
    ],
    featured: true,
  },
  {
    id: 'flashmla-paper',
    title: 'FlashMLA: Efficient Multi-Head Latent Attention Decoding on Hopper Architecture',
    authors: 'DeepSeek Architecture Team',
    institution: 'DeepSeek AI',
    topic: 'Inference Optimization',
    date: 'Feb 2025',
    arxivId: '2502.07860',
    arxivUrl: 'https://github.com/deepseek-ai/FlashMLA',
    githubUrl: 'https://github.com/deepseek-ai/FlashMLA',
    summaryTakeaways: [
      'High-performance kernel library customized for Multi-Head Latent Attention (MLA) decoding on NVIDIA Hopper GPUs.',
      'Achieves up to 3000 GB/s memory bandwidth utilization in variable-length token decoding scenarios.',
      'Dramatically reduces KV-cache memory footprints for ultra-long context reasoning deployments.',
    ],
    featured: false,
  },
  {
    id: 'agent-s-paper',
    title: 'Agent S: An Open Agentic Framework for Computer Use via GUI Grounding',
    authors: 'Saaket Agashe, Jiuzhou Han, Shuyan Zhou, et al.',
    institution: 'Carnegie Mellon University (CMU)',
    topic: 'Agent Architectures',
    date: 'Jan 2025',
    arxivId: '2410.08164',
    arxivUrl: 'https://arxiv.org/abs/2410.08164',
    githubUrl: 'https://github.com/simular-ai/Agent-S',
    summaryTakeaways: [
      'Introduces a hierarchical agent structure for OS navigation and browser automation using multimodal LLMs.',
      'Implements Experience-Augmented Planning (EAP) to retrieve past successful trajectories for complex multi-step workflows.',
      'Achieves state-of-the-art success rates on OSWorld benchmark for autonomous desktop tasks.',
    ],
    featured: true,
  },
  {
    id: 'constitutional-ai-harmlessness',
    title: 'Self-Improving Alignment with Scalable Oversight and Constitutional Rule Trees',
    authors: 'Anthropic Alignment Science Team',
    institution: 'Anthropic',
    topic: 'Safety & Alignment',
    date: 'Nov 2024',
    arxivId: '2411.11200',
    arxivUrl: 'https://arxiv.org/abs/2411.11200',
    summaryTakeaways: [
      'Presents algorithmic upgrades to Constitutional AI allowing models to self-critique and revise reasoning traces against ethical tenets.',
      'Minimizes alignment tax without degrading math or code problem-solving latency.',
      'Provides empirical framework for verifying safe tool use in agentic execution environments.',
    ],
    featured: false,
  },
];
