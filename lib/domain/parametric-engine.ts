import { ConfigInput, DesignSpec } from './types';

const skuMap = {
  'DPBL-25-69': { sqft: 1420, bedrooms: 3, bathrooms: 2, baseWalls: 34 },
  'DPBL-25-72': { sqft: 1810, bedrooms: 4, bathrooms: 2.5, baseWalls: 40 },
  'DPBL-25-57': { sqft: 2475, bedrooms: 4, bathrooms: 3.5, baseWalls: 52 },
  'DPBL-26-04': { sqft: 2140, bedrooms: 4, bathrooms: 3, baseWalls: 46 },
} as const;

export function buildDesignSpec(input: ConfigInput): DesignSpec {
  const sku = skuMap[input.sku];
  const windows = Math.round(sku.sqft / 95);
  const roofType = input.exteriorPackage.includes('Modern') ? 'Low-slope' : 'Gable';
  return {
    sku: input.sku,
    sqft: sku.sqft,
    rooms: [
      { name: `${sku.bedrooms} Bedrooms`, area: sku.bedrooms * 140 },
      { name: `${sku.bathrooms} Bathrooms`, area: Math.round(Number(sku.bathrooms) * 60) },
      { name: 'Great Room', area: 320 },
      { name: 'Kitchen', area: 180 },
    ],
    bimLite: { walls: sku.baseWalls, windows, roofType },
    quantities: {
      studs: sku.baseWalls * 18,
      drywallSheets: Math.round(sku.sqft * 0.85),
      conduitMeters: sku.baseWalls * 6,
      smartNodes: input.smartFeatures.length * 3 + 4,
    },
  };
}
