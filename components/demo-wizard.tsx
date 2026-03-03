'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Tabs } from './ui/tabs';
import { calculateScenario, catalog, getRecommendations, investorAssumptions, markets } from '@/lib/engine';
import { currency, percent } from '@/lib/utils';
import { useDemoStore } from '@/hooks/useDemoStore';
import { useToast } from './ui/toast';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const steps = ['Customer Intent', 'AI Recommendations', 'Customization Studio', 'Pricing & Timeline', 'Permit-Ready Pack', 'Investor Dashboard'];

const intentSchema = z.object({
  location: z.string(),
  budgetMin: z.coerce.number().min(100000),
  budgetMax: z.coerce.number().min(150000),
  householdSize: z.coerce.number().min(1).max(6),
  sustainabilityPriority: z.enum(['low', 'medium', 'high']),
  smartPriority: z.enum(['low', 'medium', 'high'])
});

export function DemoWizard() {
  const { toast } = useToast();
  const store = useDemoStore();
  const selectedModel = catalog.find((model) => model.id === store.selectedModelId) ?? catalog[0];
  const scenario = calculateScenario(selectedModel, store.selection, store.intent.location);
  const investor = investorAssumptions(scenario.totalPriceUSD, scenario.marketComparablePriceUSD);
  const recommendations = useMemo(() => getRecommendations(store.intent), [store.intent]);

  const form = useForm<z.infer<typeof intentSchema>>({ resolver: zodResolver(intentSchema), values: store.intent });

  const exportJson = (type: 'permit' | 'investor') => {
    const payload = {
      type,
      intent: store.intent,
      model: selectedModel,
      selection: store.selection,
      scenario,
      investor
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = type === 'permit' ? 'permit-pack.json' : 'investor-summary.json';
    a.click();
    URL.revokeObjectURL(url);
    toast({ description: `${a.download} generated` });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
      <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">Demo Mode: Simulated AI and financial assumptions.</div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">{steps.map((step, idx) => <span key={step} className={idx <= store.step ? 'font-medium text-foreground' : ''}>{idx + 1}. {step}</span>)}</div>
        <div className="h-2 w-full rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${((store.step + 1) / steps.length) * 100}%` }} /></div>
      </div>

      {store.step === 0 && <Card className="space-y-4"><h2 className="text-2xl font-semibold">Customer Intent</h2>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={form.handleSubmit((values) => {store.setIntent(values);store.setStep(1);})}>
          <div><label>Location</label><Select {...form.register('location')}>{markets.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</Select></div>
          <div><label>Household Size</label><Input type="number" {...form.register('householdSize')} /></div>
          <div><label>Budget Min</label><Input type="number" {...form.register('budgetMin')} /></div>
          <div><label>Budget Max</label><Input type="number" {...form.register('budgetMax')} /></div>
          <div><label>Sustainability Priority</label><Select {...form.register('sustainabilityPriority')}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></Select></div>
          <div><label>Smart Priority</label><Select {...form.register('smartPriority')}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></Select></div>
          <Button type="submit" className="md:col-span-2">Generate Recommendations</Button>
        </form>
      </Card>}

      {store.step === 1 && <Card><h2 className="mb-4 text-2xl font-semibold">AI Recommendations</h2><div className="grid gap-4 md:grid-cols-3">{recommendations.map((rec) => <Card key={rec.model.id} className="p-4"><img src={rec.model.floorplanImage} alt={rec.model.name} className="mb-3 rounded" /><h3 className="font-semibold">{rec.model.name}</h3><p className="text-sm text-muted-foreground">{rec.rationale}</p><p className="mt-2 text-sm">Base: {currency.format(rec.model.basePriceUSD)}</p><Button className="mt-3 w-full" onClick={() => {store.setSelectedModelId(rec.model.id);store.setRecommendedSelection(rec.recommendationSelection);store.setStep(2);}}>Select Model</Button></Card>)}</div></Card>}

      {store.step === 2 && <div className="grid gap-4 lg:grid-cols-2"><Card className="space-y-3"><h2 className="text-2xl font-semibold">Customization Studio</h2>{[
        ['flooringTier','Flooring',['basic','standard','premium']],
        ['kitchenTier','Kitchen',['basic','standard','premium']],
        ['bathTier','Bath',['basic','standard','premium']],
        ['facade','Facade',['modern','transitional','classic']],
        ['roof','Roof',['architectural-shingle','standing-seam-metal']],
        ['solarReady','Solar Ready',['false','true']],
        ['smartPackage','Smart Package',['BASIC','PLUS','PRO']]
      ].map(([key,label,vals]) => <div key={String(key)}><label>{label}</label><Select value={store.selection[key as keyof typeof store.selection]} onChange={(e)=>store.setSelection({[key]:e.target.value})}>{(vals as string[]).map((v)=><option key={v} value={v}>{v}</option>)}</Select></div>)}
      <div className="flex gap-2"><Button variant="outline" onClick={store.resetToRecommended}>Reset to Recommended</Button><Button onClick={()=>{store.saveScenario({id:Date.now().toString(),label:selectedModel.name,totalPriceUSD:scenario.totalPriceUSD,buildTimeMonths:scenario.buildTimeMonths,energySavingsPct:scenario.energySavingsPct});toast({description:'Scenario saved'});}}>Save Scenario</Button><Button onClick={()=>store.setStep(3)}>Continue</Button></div>
      </Card><Card><h3 className="mb-3 text-xl font-semibold">Live Summary</h3><p>Total Price: <strong>{currency.format(scenario.totalPriceUSD)}</strong></p><p>Delivery: <strong>{scenario.buildTimeMonths.toFixed(1)} months</strong></p><p>Energy Savings: <strong>{percent(scenario.energySavingsPct)}</strong></p></Card></div>}

      {store.step === 3 && <Card className="space-y-4"><h2 className="text-2xl font-semibold">Pricing & Timeline</h2><div className="grid gap-4 md:grid-cols-4">{[
        ['Total Price',currency.format(scenario.totalPriceUSD)],
        ['Estimated Delivery',`${scenario.buildTimeMonths.toFixed(1)} months`],
        ['Energy Savings',percent(scenario.energySavingsPct)],
        ['Gross Margin %',percent(scenario.grossMarginPct)]
      ].map((item)=><Card key={item[0]} className="p-4"><p className="text-sm text-muted-foreground">{item[0]}</p><p className="text-xl font-semibold">{item[1]}</p></Card>)}</div><div className="flex gap-2"><Badge>ENERGY STAR-ready</Badge>{store.selection.solarReady==='true' && <Badge>Solar-ready</Badge>}<Badge>Permit Workflow Included</Badge></div><Button onClick={()=>store.setStep(4)}>Build Permit Pack</Button></Card>}

      {store.step === 4 && <Card className="space-y-4"><h2 className="text-2xl font-semibold">Permit-Ready Pack</h2><ul className="list-disc pl-5 text-sm"><li>{selectedModel.name} - {selectedModel.sqft} sqft, {selectedModel.bedrooms} bed / {selectedModel.bathrooms} bath</li><li>Market: {scenario.market.name}</li><li>Checklist: IRC 2021, IECC 2021, NEC 2023 placeholders</li><li>Energy summary: {percent(scenario.energySavingsPct)}, solar-ready: {store.selection.solarReady}</li></ul><div className="flex flex-wrap gap-2"><Button onClick={()=>exportJson('permit')}>Download permit-pack.json</Button><Button onClick={()=>exportJson('investor')}>Download investor-summary.json</Button><a className="rounded-md border px-4 py-2" href="/export/permit" target="_blank">Print Permit View</a><a className="rounded-md border px-4 py-2" href="/export/investor" target="_blank">Print Investor View</a><Button onClick={()=>store.setStep(5)}>Open Dashboard</Button></div></Card>}

      {store.step === 5 && <Card className="space-y-4"><div className="flex items-center justify-between"><h2 className="text-2xl font-semibold">Investor Dashboard</h2><Tabs value={store.view} onValueChange={(v)=>store.setView(v as 'customer'|'investor')} tabs={[{value:'customer',label:'Customer View'},{value:'investor',label:'Investor View'}]} /></div>
      {store.view === 'investor' ? <><div className="grid gap-4 md:grid-cols-5">{[
        ['Gross Margin $',currency.format(scenario.grossMarginUSD)],
        ['Gross Margin %',percent(scenario.grossMarginPct)],
        ['Build Cycle',`${scenario.buildTimeMonths.toFixed(1)} months`],
        ['Simple IRR',percent(investor.irr)],
        ['DSCR',investor.dscr.toFixed(2)]
      ].map((metric)=><Card key={metric[0]} className="p-4"><p className="text-xs text-muted-foreground">{metric[0]}</p><p className="text-lg font-semibold">{metric[1]}</p></Card>)}</div>
      <Card><p className="mb-2 font-semibold">12-Month Cash Flow</p><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={investor.cashFlowSeries}><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="cashFlow" fill="#2563eb" /></BarChart></ResponsiveContainer></div></Card>
      <Card><p className="font-semibold">Assumptions</p><p className="text-sm">Down payment {percent(investor.downPaymentPct*100)}, debt {percent(investor.debtPct*100)}, interest {percent(investor.interestRate*100)}.</p><ul className="list-disc pl-5 text-sm"><li>Permit risk mitigated via standardized checklist and pre-submittal QA.</li><li>Cost-overrun risk mitigated by option-tier controls and scenario compare.</li></ul></Card></> : <p className="text-sm">Customer view keeps focus on delivery certainty and configurable design choices.</p>}
      <Card><p className="mb-2 font-semibold">Saved Scenarios</p><table className="w-full text-sm"><thead><tr className="text-left"><th>Name</th><th>Price</th><th>Months</th><th>Energy</th></tr></thead><tbody>{store.scenarios.map((s)=><tr key={s.id}><td>{s.label}</td><td>{currency.format(s.totalPriceUSD)}</td><td>{s.buildTimeMonths.toFixed(1)}</td><td>{percent(s.energySavingsPct)}</td></tr>)}</tbody></table></Card>
      </Card>}

      <div className="flex gap-2">
        <Button variant="outline" disabled={store.step===0} onClick={()=>store.setStep(Math.max(0,store.step-1))}>Back</Button>
        <Button disabled={store.step===steps.length-1} onClick={()=>store.setStep(Math.min(steps.length-1,store.step+1))}>Next</Button>
      </div>
    </div>
  );
}
