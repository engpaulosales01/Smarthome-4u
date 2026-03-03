export type Priority = 'low' | 'medium' | 'high';

export type HomeModel = {
  id: string;
  name: string;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  basePriceUSD: number;
  baseBuildMonths: number;
  baseSavingsPct: number;
  floorplanImage: string;
  tags: string[];
};

export type OptionValue = {
  label: string;
  priceDeltaUSD: number;
  timeDeltaWeeks: number;
  energySavingsPctDelta: number;
  notes: string;
};

export type OptionsCatalog = {
  interior: {
    flooringTier: Record<string, OptionValue>;
    kitchenTier: Record<string, OptionValue>;
    bathTier: Record<string, OptionValue>;
  };
  exterior: {
    facade: Record<string, OptionValue>;
    roof: Record<string, OptionValue>;
    solarReady: Record<string, OptionValue>;
  };
  smartPackages: Record<string, OptionValue>;
};

export type Market = {
  id: string;
  name: string;
  marketPriceMultiplier: number;
  permitWeeks: number;
  logisticsUSD: number;
};

export type IntentInput = {
  location: string;
  budgetMin: number;
  budgetMax: number;
  householdSize: number;
  sustainabilityPriority: Priority;
  smartPriority: Priority;
};

export type Selection = {
  flooringTier: string;
  kitchenTier: string;
  bathTier: string;
  facade: string;
  roof: string;
  solarReady: string;
  smartPackage: string;
};
