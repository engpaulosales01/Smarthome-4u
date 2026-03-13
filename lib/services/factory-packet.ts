import { DesignSpec } from '@/lib/domain/types';

export function makeBomCsv(spec: DesignSpec) {
  const rows = Object.entries(spec.quantities).map(([k, v]) => `${k},${v}`);
  return ['item,qty', ...rows].join('\n');
}

export function makePacketSummary(spec: DesignSpec, projectId: string) {
  return {
    projectId,
    version: 1,
    bom: spec.quantities,
    roomSchedule: spec.rooms,
    changeLog: ['v1 initial manufacturing packet'],
    pdfSummaryText: `Manufacturing Summary for ${projectId} (${spec.sku})`,
  };
}
