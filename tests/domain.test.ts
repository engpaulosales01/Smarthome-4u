import { describe, it, expect } from 'vitest';
import { quoteCost, tierMultipliers } from '@/lib/domain/pricing-engine';
import { quoteTimeline, changeOrderImpact } from '@/lib/domain/timeline-engine';
import { can, canAccessProject } from '@/lib/auth/rbac';
import { buildDesignSpec } from '@/lib/domain/parametric-engine';

const baseInput = {
  state: 'GA', county: 'Fulton', lotReady: true, timelinePreference: 'Balanced' as const,
  sku: 'DPBL-25-69' as const, tier: 'Basic' as const,
  interiorPackage: 'Contemporary', exteriorPackage: 'Classic', smartFeatures: ['security'],
};

describe('pricing engine', () => {
  it('applies standard multiplier', () => expect(tierMultipliers.Standard).toBe(1.08));
  it('luxury costs more than basic', () => {
    const basic = quoteCost({ ...baseInput, tier: 'Basic' }).total;
    const lux = quoteCost({ ...baseInput, tier: 'Luxury' }).total;
    expect(lux).toBeGreaterThan(basic);
  });
  it('adds smart feature cost', () => {
    const a = quoteCost({ ...baseInput, smartFeatures: [] }).total;
    const b = quoteCost({ ...baseInput, smartFeatures: ['security', 'ev-ready'] }).total;
    expect(b).toBeGreaterThan(a);
  });
  it('returns breakdown categories', () => {
    const quote = quoteCost(baseInput);
    expect(quote.breakdown).toHaveProperty('materials');
    expect(quote.breakdown).toHaveProperty('permitsInspections');
  });
});

describe('timeline and change orders', () => {
  it('fulton county permit weeks mocked', () => expect(quoteTimeline(baseInput).milestones[0].weeks).toBe(6));
  it('fast preference shortens fabrication', () => expect(quoteTimeline({ ...baseInput, timelinePreference: 'Fast' }).milestones[1].weeks).toBe(7));
  it('high complexity change order adds 4 weeks', () => expect(changeOrderImpact(1000, 'high').deltaWeeks).toBe(4));
});

describe('rbac and scoping', () => {
  it('admin can do everything', () => expect(can('ADMIN_FINANCE', 'anything')).toBe(true));
  it('investor has audit read', () => expect(can('INVESTOR', 'audit.read')).toBe(true));
  it('homebuyer cannot manage project', () => expect(can('HOME_BUYER', 'project.manage')).toBe(false));
  it('holdco can access any project', () => expect(canAccessProject({ entity: 'HOLDCO', projectIds: [] }, 'p1')).toBe(true));
  it('opco scoped access restricted', () => expect(canAccessProject({ entity: 'OPCO', projectIds: ['p2'] }, 'p1')).toBe(false));
});

describe('parametric output', () => {
  it('returns BIM-lite and quantities', () => {
    const spec = buildDesignSpec(baseInput);
    expect(spec.bimLite.windows).toBeGreaterThan(0);
    expect(spec.quantities.studs).toBeGreaterThan(0);
  });
});
