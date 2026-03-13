import { ConfigInput } from './types';

const countyPermitWeeks: Record<string, number> = {
  'GA-Fulton': 6,
  'GA-Cobb': 5,
  'FL-Miami-Dade': 8,
  'FL-Orange': 6,
};

export function quoteTimeline(input: ConfigInput) {
  const permit = countyPermitWeeks[`${input.state}-${input.county}`] ?? 7;
  const fabrication = input.timelinePreference === 'Fast' ? 7 : input.timelinePreference === 'Balanced' ? 9 : 11;
  const assembly = input.lotReady ? 6 : 8;
  const smartLead = input.smartFeatures.includes('solar-ready') ? 2 : 1;
  const totalWeeks = permit + fabrication + assembly + smartLead;
  return {
    totalWeeks,
    milestones: [
      { phase: 'Permit', weeks: permit },
      { phase: 'Fabricate', weeks: fabrication },
      { phase: 'Ship', weeks: 2 },
      { phase: 'Assemble', weeks: assembly },
      { phase: 'Commission', weeks: smartLead },
    ],
  };
}

export function changeOrderImpact(deltaCost: number, complexity: 'low' | 'medium' | 'high') {
  const deltaWeeks = complexity === 'low' ? 1 : complexity === 'medium' ? 2 : 4;
  return { deltaCost, deltaWeeks };
}
