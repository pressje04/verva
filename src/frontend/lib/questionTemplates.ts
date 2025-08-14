export type Topic = 'Ownership'|'Teamwork'|'DSA';

export const templates: Record<Topic, string[]> = {
  Ownership: [
    'Tell me about a time you took ownership to {verb} a {product} component; how did you measure success?',
    'Describe when you proactively unblocked a team by {verb} an issue in {product}; what trade-offs did you make?',
  ],
  Teamwork: [
    'Give an example of collaborating with a {rolePeer} to deliver {product}; how did you split responsibilities?',
  ],
  DSA: [
    'Walk me through how you would choose a data structure to {verb} a feature in {product}; complexity and edge cases?',
  ],
};