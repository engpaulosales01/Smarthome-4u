'use client';

import { useMemo, useState } from 'react';
import { CertaintyScore } from '@/components/certainty-score';

const skus = ['DPBL-25-69', 'DPBL-25-72', 'DPBL-25-57', 'DPBL-26-04'];
const tiers = ['Basic', 'Standard', 'Premium', 'Luxury'];

export default function ConfiguratorPage() {
  const [form, setForm] = useState({
    state: 'GA', county: 'Fulton', lotReady: true, timelinePreference: 'Balanced', sku: 'DPBL-25-69', tier: 'Standard',
    interiorPackage: 'Contemporary', exteriorPackage: 'Modern cladding',
    smartFeatures: ['security'],
  });
  const score = useMemo(() => {
    let s = 55;
    if (form.lotReady) s += 15;
    if (form.smartFeatures.length > 1) s += 5;
    if (form.county) s += 10;
    if (form.interiorPackage && form.exteriorPackage) s += 15;
    return Math.min(s, 98);
  }, [form]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Configurator wizard</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card space-y-3">
          <p className="text-sm text-slate-400">Step 1-6 selections</p>
          <select className="w-full rounded bg-slate-800 p-2" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}>{skus.map((s) => <option key={s}>{s}</option>)}</select>
          <select className="w-full rounded bg-slate-800 p-2" value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })}>{tiers.map((s) => <option key={s}>{s}</option>)}</select>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.lotReady} onChange={(e) => setForm({ ...form, lotReady: e.target.checked })} /> Lot ready</label>
          <button className="rounded bg-cyan-500 px-3 py-2 text-slate-950">Step 7: Generate instant quote</button>
        </div>
        <CertaintyScore score={score} />
      </div>
    </div>
  );
}
