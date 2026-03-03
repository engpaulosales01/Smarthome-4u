import catalogData from '@/data/catalog.json';
import optionsData from '@/data/options.json';
import marketsData from '@/data/markets.json';
import { HomeModel, IntentInput, Market, OptionsCatalog, Selection } from './types';

export const catalog = catalogData as HomeModel[];
export const options = optionsData as OptionsCatalog;
export const markets = marketsData as Market[];

export const defaultSelection: Selection = {
  flooringTier: 'standard',
  kitchenTier: 'standard',
  bathTier: 'standard',
  facade: 'transitional',
  roof: 'architectural-shingle',
  solarReady: 'false',
  smartPackage: 'BASIC'
};

export function getMarket(id: string) {
  return markets.find((market) => market.id === id) ?? markets[0];
}

function scoreModel(model: HomeModel, intent: IntentInput) {
  let score = 0;
  if (intent.householdSize >= 4 && model.bedrooms >= 4) score += 30;
  if (intent.householdSize <= 2 && model.bedrooms <= 3) score += 20;
  if (intent.sustainabilityPriority === 'high' && model.tags.includes('energy-ready')) score += 25;
  if (intent.smartPriority === 'high' && model.tags.includes('energy-ready')) score += 10;
  if (model.basePriceUSD <= intent.budgetMax) score += 20;
  else score -= Math.min(20, Math.floor((model.basePriceUSD - intent.budgetMax) / 10000));
  score += Math.max(0, 10 - Math.abs(intent.householdSize * 650 - model.sqft) / 200);
  return score;
}

export function getRecommendations(intent: IntentInput) {
  return [...catalog]
    .sort((a, b) => scoreModel(b, intent) - scoreModel(a, intent))
    .slice(0, 3)
    .map((model) => {
      const withinBudget = model.basePriceUSD <= intent.budgetMax;
      const rationale = withinBudget
        ? `${model.bedrooms}BR layout aligns to household needs with a base cost at ${Math.round((model.basePriceUSD / intent.budgetMax) * 100)}% of max budget.`
        : `Closest match above budget ceiling. Tradeoff: reduce finish tiers or expand budget by ${model.basePriceUSD - intent.budgetMax}.`;
      const recommendationSelection = {
        ...defaultSelection,
        solarReady: intent.sustainabilityPriority === 'high' ? 'true' : defaultSelection.solarReady,
        smartPackage: intent.smartPriority === 'high' ? 'PRO' : intent.smartPriority === 'medium' ? 'PLUS' : 'BASIC'
      };
      return { model, rationale, recommendationSelection };
    });
}

function collectOptionValues(selection: Selection) {
  const picks = [
    options.interior.flooringTier[selection.flooringTier],
    options.interior.kitchenTier[selection.kitchenTier],
    options.interior.bathTier[selection.bathTier],
    options.exterior.facade[selection.facade],
    options.exterior.roof[selection.roof],
    options.exterior.solarReady[selection.solarReady],
    options.smartPackages[selection.smartPackage]
  ];

  return picks;
}

export function calculateScenario(model: HomeModel, selection: Selection, marketId: string) {
  const market = getMarket(marketId);
  const picks = collectOptionValues(selection);
  const optionPrice = picks.reduce((sum, pick) => sum + pick.priceDeltaUSD, 0);
  const optionWeeks = picks.reduce((sum, pick) => sum + pick.timeDeltaWeeks, 0);
  const optionEnergy = picks.reduce((sum, pick) => sum + pick.energySavingsPctDelta, 0);

  const permitFees = 4500;
  const totalPriceUSD = model.basePriceUSD + optionPrice + market.logisticsUSD + permitFees;
  const marketComparablePriceUSD = model.basePriceUSD * market.marketPriceMultiplier;
  const grossMarginPct = ((marketComparablePriceUSD - totalPriceUSD) / marketComparablePriceUSD) * 100;
  const grossMarginUSD = marketComparablePriceUSD - totalPriceUSD;
  const buildTimeMonths = model.baseBuildMonths + (market.permitWeeks + optionWeeks) / 4.3;
  const energySavingsPct = Math.min(70, model.baseSavingsPct + optionEnergy);

  return {
    market,
    totalPriceUSD,
    marketComparablePriceUSD,
    grossMarginPct,
    grossMarginUSD,
    buildTimeMonths,
    energySavingsPct,
    permitFees,
    optionPrice
  };
}

export function investorAssumptions(totalPriceUSD: number, salesPriceUSD: number) {
  const downPaymentPct = 0.25;
  const debtPct = 0.75;
  const interestRate = 0.08;
  const monthlyRate = interestRate / 12;
  const debtAmount = totalPriceUSD * debtPct;
  const equityAmount = totalPriceUSD * downPaymentPct;
  const annualDebtService = debtAmount * interestRate;
  const noi = salesPriceUSD - totalPriceUSD;
  const dscr = noi / annualDebtService;
  const irr = ((salesPriceUSD - totalPriceUSD) / equityAmount) * 100;

  const cashFlowSeries = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const draw = -(totalPriceUSD / 10) * (month <= 10 ? 1 : 0);
    const carry = month <= 10 ? -(debtAmount * monthlyRate) : 0;
    const exit = month === 12 ? salesPriceUSD : 0;
    return { month: `M${month}`, cashFlow: Math.round(draw + carry + exit) };
  });

  return { downPaymentPct, debtPct, interestRate, dscr, irr, cashFlowSeries };
}
