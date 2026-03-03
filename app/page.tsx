import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6">
      <h1 className="text-5xl font-semibold">SmartHome-4U</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">From customer intent to fabrication-ready plan.</p>
      <ul className="mt-6 list-disc space-y-2 pl-5 text-muted-foreground">
        <li>Real-time price and delivery certainty.</li>
        <li>AI-guided model recommendations and customization.</li>
        <li>Investor-grade reporting and transparency.</li>
      </ul>
      <div className="mt-8"><Link href="/demo"><Button>Start Demo</Button></Link></div>
    </main>
  );
}
