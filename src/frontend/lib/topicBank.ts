// src/lib/topicBank.ts
export type InterviewKind = 'behavioral' | 'technical' | 'leadership';

const COMMON_BEHAVIORAL = [
  'Intro',
  'Teamwork',
  'Conflict',
  'Ownership',
  'Communication',
  'Time Management',
  'Learning from Failure',
];

const COMMON_TECHNICAL = [
  'DSA',
  'Complexity Analysis',
  'System Design',
  'Concurrency',
  'APIs & Integration',
  'Testing & Debugging',
];

const COMMON_LEADERSHIP = [
  'Vision & Strategy',
  'Stakeholder Management',
  'Hiring & Mentorship',
  'Prioritization',
  'Ambiguity Handling',
  'Cross‑functional Collaboration',
];

// Company‑specific overlays
const AMAZON_LP = [
  'Customer Obsession',
  'Ownership',
  'Bias for Action',
  'Dive Deep',
  'Invent and Simplify',
  'Earn Trust',
  'Have Backbone; Disagree and Commit',
  'Deliver Results',
];

const GOOGLE_BEHAVIORAL = [
  'Googleyness',
  'Collaboration',
  'User Focus',
  'Learning Mindset',
];

const META_BEHAVIORAL = [
  'Move Fast',
  'Be Bold',
  'Focus on Impact',
  'Be Open',
];

// Maps
const companyBehavioral: Record<string, string[]> = {
  amazon: AMAZON_LP,
  google: GOOGLE_BEHAVIORAL,
  meta: META_BEHAVIORAL,
};

export function getTopics(opts: {
  company?: string | null;
  kind: InterviewKind;
}): string[] {
  const base =
    opts.kind === 'behavioral'
      ? COMMON_BEHAVIORAL
      : opts.kind === 'technical'
      ? COMMON_TECHNICAL
      : COMMON_LEADERSHIP;

  const key = (opts.company ?? '').toLowerCase();
  const overlay = opts.kind === 'behavioral' ? companyBehavioral[key] : undefined;

  // Merge base + overlay (if any), keeping order and de‑duping
  const seen = new Set<string>();
  const merged: string[] = [];
  for (const t of base) if (!seen.has(t) && merged.push(t)) seen.add(t);
  if (overlay) for (const t of overlay) if (!seen.has(t) && merged.push(t)) seen.add(t);

  return merged;
}
