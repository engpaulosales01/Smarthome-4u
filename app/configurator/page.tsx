'use client';

import { useMemo, useState } from 'react';
import { CertaintyScore } from '@/components/certainty-score';

type ConfigureResponse = {
  designSpec: {
    sku: string;
    sqft: number;
    rooms: { name: string; area: number }[];
    quantities: Record<string, number>;
  };
  quote: { total: number; breakdown: Record<string, number> };
  timeline: { totalWeeks: number; milestones: { phase: string; weeks: number }[] };
  aiNarrative: string;
};

const skus = ['DPBL-25-69', 'DPBL-25-72', 'DPBL-25-57', 'DPBL-26-04'] as const;
const tiers = ['Basic', 'Standard', 'Premium', 'Luxury'] as const;
const countiesByState: Record<string, string[]> = {
  GA: ['Fulton', 'Cobb'],
  FL: ['Miami-Dade', 'Orange'],
};

export default function ConfiguratorPage() {
  const [form, setForm] = useState({
    state: 'GA',
    county: 'Fulton',
    lotReady: true,
    timelinePreference: 'Balanced',
    sku: 'DPBL-25-69',
    tier: 'Standard',
    interiorPackage: 'Contemporary',
    exteriorPackage: 'Modern cladding',
    smartFeatures: ['security'],
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConfigureResponse | null>(null);

  const certaintyScore = useMemo(() => {
    let score = 45;
    if (form.state && form.county) score += 15;
    if (form.lotReady) score += 15;
    if (form.smartFeatures.length >= 2) score += 8;
    if (form.interiorPackage && form.exteriorPackage) score += 10;
    if (['Fulton', 'Cobb', 'Orange'].includes(form.county)) score += 7;
    return Math.min(98, score);
  }, [form]);

  async function generateQuote() {
    setLoading(true);
    try {
      const response = await fetch('/api/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error('Failed to generate quote');
      const data = (await response.json()) as ConfigureResponse;
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  function toggleSmartFeature(feature: string) {
    setForm((current) => ({
      ...current,
      smartFeatures: current.smartFeatures.includes(feature)
        ? current.smartFeatures.filter((f) => f !== feature)
        : [...current.smartFeatures, feature],
    }));
  }

  function downloadSummary() {
    if (!result) return;
    const blob = new Blob([JSON.stringify({ input: form, output: result }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SmartHome4U-${form.sku}-summary.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Configurator wizard</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card space-y-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-300">Step 1</p>
            <p className="mb-2 text-sm text-slate-400">Location, lot status, timeline preference</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <select className="rounded bg-slate-800 p-2" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value, county: countiesByState[e.target.value][0] })}>{Object.keys(countiesByState).map((state) => <option key={state}>{state}</option>)}</select>
              <select className="rounded bg-slate-800 p-2" value={form.county} onChange={(e) => setForm({ ...form, county: e.target.value })}>{countiesByState[form.state].map((county) => <option key={county}>{county}</option>)}</select>
              <select className="rounded bg-slate-800 p-2" value={form.timelinePreference} onChange={(e) => setForm({ ...form, timelinePreference: e.target.value })}>
                <option>Fast</option><option>Balanced</option><option>Value</option>
              </select>
              <label className="flex items-center gap-2 rounded bg-slate-800 p-2"><input type="checkbox" checked={form.lotReady} onChange={(e) => setForm({ ...form, lotReady: e.target.checked })} /> Lot ready</label>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-300">Step 2-3</p>
            <p className="mb-2 text-sm text-slate-400">Choose floorplan SKU and finishing tier</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <select className="rounded bg-slate-800 p-2" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}>{skus.map((sku) => <option key={sku}>{sku}</option>)}</select>
              <select className="rounded bg-slate-800 p-2" value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })}>{tiers.map((tier) => <option key={tier}>{tier}</option>)}</select>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-300">Step 4-5</p>
            <p className="mb-2 text-sm text-slate-400">Interior + Exterior studio</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <input className="rounded bg-slate-800 p-2" value={form.interiorPackage} onChange={(e) => setForm({ ...form, interiorPackage: e.target.value })} placeholder="Interior package" />
              <input className="rounded bg-slate-800 p-2" value={form.exteriorPackage} onChange={(e) => setForm({ ...form, exteriorPackage: e.target.value })} placeholder="Exterior package" />
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-300">Step 6</p>
            <p className="mb-2 text-sm text-slate-400">Smart features</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {['security', 'hvac-controls', 'ev-ready', 'solar-ready'].map((feature) => (
                <label key={feature} className="flex items-center gap-2 rounded bg-slate-800 p-2">
                  <input type="checkbox" checked={form.smartFeatures.includes(feature)} onChange={() => toggleSmartFeature(feature)} /> {feature}
                </label>
              ))}
            </div>
          </div>

          <button onClick={generateQuote} disabled={loading} className="rounded bg-cyan-500 px-4 py-2 font-medium text-slate-950 disabled:opacity-50">
            {loading ? 'Calculating…' : 'Step 7: Instant quote + schedule'}
          </button>
        </div>

        <div className="space-y-4">
          <CertaintyScore score={certaintyScore} />
          <div className="card text-sm text-slate-300">
            <p className="mb-2 font-medium">Execution principle</p>
            <p>Every output is generated for traceability: design spec, price breakdown, timeline milestones, and versioned manufacturing data. We engineer certainty.</p>
          </div>
          {result && (
            <div className="card space-y-3">
              <h2 className="text-lg font-semibold">Quote Summary</h2>
              <p>Total estimated price: <span className="font-semibold">${result.quote.total.toLocaleString()}</span></p>
              <p>Estimated delivery: <span className="font-semibold">{result.timeline.totalWeeks} weeks</span></p>
              <p className="text-slate-400">{result.aiNarrative}</p>
              <button className="rounded border border-slate-600 px-3 py-2" onClick={downloadSummary}>Download summary</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
