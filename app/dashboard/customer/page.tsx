export default function CustomerDashboard() {
  const milestones = ['Contract', 'Permit', 'Fabricate', 'Ship', 'Assemble', 'Commission', 'Handover'];
  return <div className="space-y-4"><h1 className="text-2xl font-semibold">Customer dashboard</h1><div className="card"><h2 className="mb-3 font-medium">Project timeline</h2>{milestones.map((m, i) => <div key={m} className="mb-2 flex justify-between border-b border-slate-800 pb-2 text-sm"><span>{m}</span><span>Week {i * 3 + 1}</span></div>)}</div><div className="card">Document center: permits, engineering stamps, inspection reports, manufacturing packets.</div></div>;
}
