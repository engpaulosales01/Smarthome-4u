export function CertaintyScore({ score }: { score: number }) {
  const tone = score > 80 ? 'bg-emerald-500' : score > 60 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div className="card">
      <div className="mb-2 text-sm text-slate-400">Certainty score</div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full ${tone}`} style={{ width: `${score}%` }} />
      </div>
      <p className="mt-2 text-sm">{score}% confidence from inputs, county permitting speed, and supply lead times.</p>
    </div>
  );
}
