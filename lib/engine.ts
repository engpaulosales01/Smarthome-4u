// Pure functions for recommendation, pricing, and timeline
import catalog from '../data/catalog.json';
import options from '../data/options.json';
import markets from '../data/markets.json';
import type { Selection } from './types';

// type definitions
export type Market = typeof markets[number];
export type Model = typeof catalog[number];
export type InteriorOption = { name: string; priceDeltaUSD: number; timeDeltaWeeks: number; energySavingsPctDelta: number; notes: string };
export type SmartPackage = { name: string; label: string; priceDeltaUSD: number; timeDeltaWeeks: number; energySavingsPctDelta: number; notes: string };

// structured options shape matching data/options.json
type Options = {
  interior: {
    flooringTier: InteriorOption[];
    kitchenTier: InteriorOption[];
    bathTier: InteriorOption[];
  };
  exterior: {
    facade: InteriorOption[];
    roof: InteriorOption[];
    solarReady: InteriorOption;
  };
  smartPackages: SmartPackage[];
};

export interface CustomerIntent {
  location: string; // market id
  budgetMin: number;
  budgetMax: number;
  householdSize: number;
  sustainability: 'low' | 'medium' | 'high';
  smart: 'low' | 'medium' | 'high';
}

export interface Recommendation {
  model: Model;
  rationale: string;
}

// helpers
function findMarket(id: string): Market | undefined {
  return markets.find(m => m.id === id);
}

export function recommendModels(intent: CustomerIntent): Recommendation[] {
  // simple deterministic rules
  const results: Recommendation[] = [];

  // base filter by budget
  catalog.forEach(model => {
    const minPrice = model.basePriceUSD;
    if (intent.budgetMax < minPrice) return; // skip if even base price above max
    results.push({ model, rationale: '' });
  });

  // sort by household size suitability
  results.sort((a, b) => {
    const score = (m: Model) => {
      let s = 0;
      if (intent.householdSize >= 4 && m.bedrooms >= 3) s += 10;
      if (intent.householdSize <= 2 && m.bedrooms <= 2) s += 5;
      // sustainability
      if (intent.sustainability === 'high' && m.tags.includes('energy-ready')) s += 5;
      // smart priority
      if (intent.smart === 'high' && intent.sustainability === 'high') s += 2;
      return s;
    };
    return score(b.model) - score(a.model);
  });

  const top = results.slice(0, 3).map((r) => {
    let rationale = '';
    if (intent.householdSize >= 4 && r.model.bedrooms < 3) {
      rationale = 'Closest match; family size demands more bedrooms';
    } else {
      rationale = 'Fits household and budget';
    }
    if (intent.sustainability === 'high' && !r.model.tags.includes('energy-ready')) {
      rationale += ' (not energy-ready)';
    }
    return { model: r.model, rationale };
  });
  return top;
}

export interface BuildScenario {
  model: Model;
  interior: {
    flooringTier: string;
    kitchenTier: string;
    bathTier: string;
  };
  exterior: {
    facade: string;
    roof: string;
    solarReady: boolean;
  };
  smartPackage: string;
  marketId: string;
}

export interface PricingResult {
  totalPriceUSD: number;
  marketComparablePriceUSD: number;
  grossMarginPct: number;
  buildTimeMonths: number;
  energySavingsPct: number;
  badges: string[];
}

export function calculatePricing(scenario: BuildScenario): PricingResult {
  const mkt = findMarket(scenario.marketId);
  if (!mkt) throw new Error('Market not found');
  const model = scenario.model;

  let total = model.basePriceUSD;
  let timeWeeks = 0;
  let energyPct = model.baseSavingsPct || 0;
  const badges: string[] = [];
  if (model.tags.includes('energy-ready')) badges.push('Energy-ready');

  // interior deltas
  const opts = options as unknown as Options;
  const floor = opts.interior.flooringTier.find((o) => o.name === scenario.interior.flooringTier);
  const kitchen = opts.interior.kitchenTier.find((o) => o.name === scenario.interior.kitchenTier);
  const bath = opts.interior.bathTier.find((o) => o.name === scenario.interior.bathTier);
  [floor, kitchen, bath].forEach((opt) => {
    if (opt) {
      total += opt.priceDeltaUSD;
      timeWeeks += opt.timeDeltaWeeks;
      energyPct += opt.energySavingsPctDelta;
    }
  });

  // exterior
  const ext = opts.exterior;
  const facade = ext.facade.find((o) => o.name === scenario.exterior.facade);
  const roof = ext.roof.find((o) => o.name === scenario.exterior.roof);
  const solar = scenario.exterior.solarReady ? ext.solarReady : null;
  [facade, roof, solar].forEach((opt) => {
    if (opt) {
      total += opt.priceDeltaUSD;
      timeWeeks += opt.timeDeltaWeeks;
      energyPct += opt.energySavingsPctDelta;
    }
  });
  if (scenario.exterior.solarReady) badges.push('Solar-ready');

  // smart package
  const pkg = opts.smartPackages.find((p) => p.name === scenario.smartPackage);
  if (pkg) {
    total += pkg.priceDeltaUSD;
    timeWeeks += pkg.timeDeltaWeeks;
    energyPct += pkg.energySavingsPctDelta;
    badges.push(pkg.label);
  }

  // market logistics & permit
  total += mkt.logisticsUSD;
  timeWeeks += mkt.permitWeeks;

  const marketComparable = model.basePriceUSD * mkt.marketPriceMultiplier;
  const grossMargin = (marketComparable - total) / marketComparable;
  const buildMonths = model.baseBuildMonths + timeWeeks / 4.3;
  if (energyPct > 70) energyPct = 70;

  return {
    totalPriceUSD: total,
    marketComparablePriceUSD: marketComparable,
    grossMarginPct: parseFloat(grossMargin.toFixed(3)),
    buildTimeMonths: parseFloat(buildMonths.toFixed(1)),
    energySavingsPct: parseFloat(energyPct.toFixed(1)),
    badges,
  };
}

// export data for use
export const allModels = catalog as Model[];
export const allMarkets = markets as Market[];
export const allOptions = options;

// Backwards-compatible exports and helpers used by the demo UI
export { catalog, markets };

export const defaultSelection: Selection = {
  flooringTier: 'basic',
  kitchenTier: 'basic',
  bathTier: 'basic',
  facade: (options as any).exterior.facade[0]?.name ?? 'siding',
  roof: (options as any).exterior.roof[0]?.name ?? 'standard',
  solarReady: 'false',
  smartPackage: 'BASIC'
};

export function getRecommendations(intent: any) {
  // Accept either `CustomerIntent` or the app's `IntentInput` shape and normalize
  const normalized: CustomerIntent = {
    location: intent.location,
    budgetMin: intent.budgetMin ?? intent.budgetMin,
    budgetMax: intent.budgetMax ?? intent.budgetMax,
    householdSize: intent.householdSize ?? intent.householdSize,
    sustainability: (intent.sustainability ?? intent.sustainabilityPriority) || 'medium',
    smart: (intent.smart ?? intent.smartPriority) || 'medium'
  } as CustomerIntent;
  return recommendModels(normalized);
}

export function calculateScenario(model: Model, selection: any, marketId: string) {
  // tolerate undefined or partial selection by falling back to defaults
  const sel = selection ?? defaultSelection;

  // build a BuildScenario compatible object from provided selection
  const scenario: BuildScenario = {
    model,
    interior: {
      flooringTier: sel.flooringTier ?? defaultSelection.flooringTier,
      kitchenTier: sel.kitchenTier ?? defaultSelection.kitchenTier,
      bathTier: sel.bathTier ?? defaultSelection.bathTier
    },
    exterior: {
      facade: sel.facade ?? defaultSelection.facade ?? (options as any).exterior.facade[0].name,
      roof: sel.roof ?? defaultSelection.roof ?? (options as any).exterior.roof[0].name,
      solarReady: (typeof sel.solarReady === 'string' ? sel.solarReady === 'true' : !!sel.solarReady) ?? (defaultSelection.solarReady === 'true')
    },
    smartPackage: sel.smartPackage ?? defaultSelection.smartPackage ?? 'BASIC',
    marketId
  };

  const pricing = calculatePricing(scenario);
  const mkt = findMarket(marketId) || (markets[0] as Market);

  return {
    ...pricing,
    market: mkt,
    grossMarginUSD: pricing.marketComparablePriceUSD - pricing.totalPriceUSD
  };
}

export function investorAssumptions(totalPriceUSD: number, marketComparablePriceUSD: number) {
  const gross = marketComparablePriceUSD - totalPriceUSD;
  const downPaymentPct = 0.2;
  const debtPct = 0.8;
  const interestRate = 0.06;
  const irr = 0.12;
  const dscr = 1.25;

  const monthly = gross / 12;
  const cashFlowSeries = Array.from({ length: 12 }).map((_, i) => ({ month: `M${i + 1}`, cashFlow: monthly }));

  return {
    irr,
    dscr,
    cashFlowSeries,
    downPaymentPct,
    debtPct,
    interestRate
  };
}