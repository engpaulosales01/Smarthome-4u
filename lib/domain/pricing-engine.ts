import { ConfigInput, Tier } from './types';

export const basePricing = {
  'DPBL-25-69': 271000,
  'DPBL-25-72': 344500,
  'DPBL-25-57': 491400,
  'DPBL-26-04': 402600,
};

export const tierMultipliers: Record<Tier, number> = {
  Basic: 1,
  Standard: 1.08,
  Premium: 1.18,
  Luxury: 1.35,
};

export function quoteCost(input: ConfigInput) {
  const base = basePricing[input.sku] * tierMultipliers[input.tier];
  const smart = input.smartFeatures.length * 4200;
  const interior = input.interiorPackage.includes('Signature') ? 12000 : 5000;
  const exterior = input.exteriorPackage.includes('Modern') ? 8500 : 4500;
  const permits = input.lotReady ? 9000 : 13000;
  const contingency = (base + smart + interior + exterior) * 0.07;
  const total = base + smart + interior + exterior + permits + contingency;
  return {
    total: Math.round(total),
    breakdown: {
      materials: Math.round(total * 0.34),
      freightLogistics: Math.round(total * 0.08),
      siteWorks: Math.round(total * 0.12),
      permitsInspections: permits,
      assemblyLabor: Math.round(total * 0.13),
      mep: Math.round(total * 0.1),
      hvac: Math.round(total * 0.07),
      smartFeatures: smart,
      contingency: Math.round(contingency),
    },
  };
}
