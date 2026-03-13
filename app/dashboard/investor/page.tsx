export default function InvestorDashboard() {
  return <div className="space-y-4"><h1 className="text-2xl font-semibold">Investor dashboard</h1><div className="grid gap-4 md:grid-cols-4">{['Cycle Time', 'Margin', 'DSCR Proxy', 'Risk Flags'].map((k)=> <div key={k} className="card"><p className="text-xs text-slate-400">{k}</p><p className="mt-1 text-xl">{k==='Risk Flags'?'2':'Healthy'}</p></div>)}</div><div className="card">Audit trail (read-only): Quote approved, permit submitted, BOM v2 issued, draw #1 released.</div></div>;
}
