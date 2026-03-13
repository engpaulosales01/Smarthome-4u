export type Role = 'HOME_BUYER' | 'REALTOR' | 'ARCH_ENGINEER' | 'PROJECT_MANAGER' | 'FACTORY_PARTNER' | 'INVESTOR' | 'ADMIN_FINANCE';

const permissions: Record<Role, string[]> = {
  HOME_BUYER: ['project.read.own', 'document.read.own', 'payment.read.own'],
  REALTOR: ['project.read.assigned', 'quote.create'],
  ARCH_ENGINEER: ['design.update', 'permit.update'],
  PROJECT_MANAGER: ['project.manage', 'task.manage', 'inspection.manage'],
  FACTORY_PARTNER: ['manufacturing.read.assigned', 'manufacturing.update'],
  INVESTOR: ['portfolio.read', 'audit.read', 'distribution.read'],
  ADMIN_FINANCE: ['*'],
};

export function can(role: Role, action: string) {
  return permissions[role].includes('*') || permissions[role].includes(action);
}

export function canAccessProject(scope: { entity: 'HOLDCO' | 'OPCO' | 'SPV'; projectIds: string[] }, projectId: string) {
  if (scope.entity === 'HOLDCO') return true;
  return scope.projectIds.includes(projectId);
}
