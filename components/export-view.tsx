'use client';

import { calculateScenario, catalog } from '@/lib/engine';
import { useDemoStore } from '@/hooks/useDemoStore';
import { currency, percent } from '@/lib/utils';

export function ExportView({ type }: { type: 'permit' | 'investor' }) {
  const store = useDemoStore();
  const model = catalog.find((m) => m.id === store.selectedModelId) ?? catalog[0];
  const scenario = calculateScenario(model, store.selection, store.intent.location);

  return (
    <main className="mx-auto max-w-4xl space-y-4 p-8 print:p-2">
      <h1 className="text-3xl font-semibold">{type === 'permit' ? 'Permit Pack Print View' : 'Investor Summary Print View'}</h1>
      <p>Model: {model.name}</p>
      <p>Location: {scenario.market.name}</p>
      <p>Total Price: {currency.format(scenario.totalPriceUSD)}</p>
      <p>Delivery: {scenario.buildTimeMonths.toFixed(1)} months</p>
      <p>Energy Savings: {percent(scenario.energySavingsPct)}</p>
      <p>Gross Margin: {percent(scenario.grossMarginPct)}</p>
    </main>
  );
}
