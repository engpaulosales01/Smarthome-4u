import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { buildDesignSpec } from '@/lib/domain/parametric-engine';
import { quoteCost } from '@/lib/domain/pricing-engine';
import { quoteTimeline } from '@/lib/domain/timeline-engine';
import { runDesignConfigurator } from '@/lib/services/ai-configurator';
import { rateLimit } from '@/lib/rate-limit';

const schema = z.object({
  state: z.string(), county: z.string(), lotReady: z.boolean(), timelinePreference: z.enum(['Fast', 'Balanced', 'Value']),
  sku: z.enum(['DPBL-25-69', 'DPBL-25-72', 'DPBL-25-57', 'DPBL-26-04']), tier: z.enum(['Basic', 'Standard', 'Premium', 'Luxury']),
  interiorPackage: z.string(), exteriorPackage: z.string(), smartFeatures: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  const clientKey = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'local';
  if (!rateLimit(clientKey)) return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const input = parsed.data;
  const [designNarrative] = await Promise.all([runDesignConfigurator(JSON.stringify(input))]);
  return NextResponse.json({
    designSpec: buildDesignSpec(input),
    quote: quoteCost(input),
    timeline: quoteTimeline(input),
    aiNarrative: designNarrative,
  });
}
