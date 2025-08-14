export type RoleBlueprint = {
    skills: string[]; // What skills should I ask questions abt?
    stack?: string[]; //For tech roles, what stack do I need to make sure candidates master?
    scenarioVerbs: string[]; //Things like design, debug, testing, scalability, etc.
}

export const roleBlueprints: Record<string, RoleBlueprint> = {
    'swe intern': {
        skills: ['DSA','Code quality','Ownership','Teamwork'],
        stack: ['JavaScript','TypeScript','React','Node','SQL'],
        scenarioVerbs: ['debug','implement','optimize','write tests for'],
      },
      'backend engineer': {
        skills: ['APIs','Databases','Performance','Reliability'],
        stack: ['Node','Go','Postgres','Redis','Kafka'],
        scenarioVerbs: ['design','profile','scale','migrate'],
      },
};

export function getRoleBlueprint(role?: string | null): RoleBlueprint {
    const key = (role ?? '').toLowerCase();
    if (key.includes('intern')) return roleBlueprints['swe intern'];
    if (key.includes('backend')) return roleBlueprints['backend engineer'];
    return roleBlueprints['swe intern'];
}
