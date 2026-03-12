import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    gantt: [
      { phase: 'Permit', startWeek: 1, endWeek: 6 },
      { phase: 'Fabricate', startWeek: 7, endWeek: 15 },
      { phase: 'Ship', startWeek: 16, endWeek: 17 },
      { phase: 'Assemble', startWeek: 18, endWeek: 23 },
      { phase: 'Commission', startWeek: 24, endWeek: 25 },
    ],
  });
}
