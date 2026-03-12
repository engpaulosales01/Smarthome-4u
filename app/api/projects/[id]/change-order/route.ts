import { NextRequest, NextResponse } from 'next/server';
import { changeOrderImpact } from '@/lib/domain/timeline-engine';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const impact = changeOrderImpact(body.deltaCost ?? 0, body.complexity ?? 'medium');
  return NextResponse.json({ changeOrderId: 'CO-1', ...impact, status: 'PendingApproval' });
}
