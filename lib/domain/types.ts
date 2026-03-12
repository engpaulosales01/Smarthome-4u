export type Tier = 'Basic' | 'Standard' | 'Premium' | 'Luxury';

export type ConfigInput = {
  state: string;
  county: string;
  lotReady: boolean;
  timelinePreference: 'Fast' | 'Balanced' | 'Value';
  sku: 'DPBL-25-69' | 'DPBL-25-72' | 'DPBL-25-57' | 'DPBL-26-04';
  tier: Tier;
  interiorPackage: string;
  exteriorPackage: string;
  smartFeatures: string[];
};

export type DesignSpec = {
  sku: string;
  sqft: number;
  rooms: { name: string; area: number }[];
  bimLite: { walls: number; windows: number; roofType: string };
  quantities: Record<string, number>;
};
