import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="card space-y-4 p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">SmartHome-4U Platform</p>
        <h1 className="text-4xl font-semibold">We engineer certainty.</h1>
        <p className="max-w-3xl text-slate-300">AI-driven design-to-fabrication platform for configurable homes with real-time cost, timeline clarity, and investor-grade transparency.</p>
        <div className="flex gap-3">
          <Link className="rounded-lg bg-cyan-500 px-4 py-2 font-medium text-slate-950" href="/configurator">Configure your home</Link>
          <Link className="rounded-lg border border-slate-700 px-4 py-2" href="/dashboard/investor">Investor dashboard</Link>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {['AI Design Configurator', 'Parametric BIM Engine', 'Factory Interface Layer'].map((item) => (
          <div key={item} className="card"><h3 className="font-semibold">{item}</h3><p className="mt-2 text-sm text-slate-400">Execution-focused workflows from intent to warranty.</p></div>
        ))}
      </section>
    </div>
  );
}
