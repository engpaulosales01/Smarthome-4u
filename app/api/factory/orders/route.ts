import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    orders: [{ id: 'MO-1001', projectId: 'PRJ-1', bomVersion: 2, status: 'ReadyForProduction' }],
    endpoint: 'Factory partners pull clean manufacturing orders here.',
  });
}
