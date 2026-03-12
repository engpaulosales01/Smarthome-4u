# SmartHome-4U Platform — Product + Tech Spec

## Positioning
SmartHome-4U is an AI-driven housing platform that converts customer intent into fabrication-ready output while maintaining investor-grade execution transparency. **Brand promise:** We engineer certainty.

## Personas
- **Homebuyer:** Configures home, tracks milestones/payments/docs, approves change orders.
- **Realtor/Agent:** Captures qualified leads, guides SKU/tier selection, monitors quote conversion.
- **Architect/Engineer:** Validates design constraints, engineering marks, permit package quality.
- **Project Manager:** Owns permitting, task sequencing, inspection readiness, risk mitigation.
- **Factory Partner:** Pulls clean manufacturing packets/BOM versions and updates status.
- **Investor:** Views SPV-level capital deployment, draws, distributions, KPI/risk/audit trail.
- **Admin/Finance:** Manages entity permissions, pricing multipliers, reporting, and governance controls.

## Lifecycle Workflow
Lead -> Configure -> Quote -> Contract -> Permit -> Fabricate -> Ship -> Assemble -> Commission -> Handover -> Warranty.

## Core Modules
1. AI Design Configurator
2. Parametric BIM Engine (SKU-driven, configurable)
3. Real-Time Cost & Timeline Engine (Basic/Standard/Premium/Luxury)
4. Factory Interface Layer (versioned manufacturing packet)
5. Customization Studio (interior + exterior)
6. Smart Features selector (all homes smart-ready)
7. Role-based dashboards for customer/investor/operations

## Data Model (Prisma)
Implemented models:
Users, Roles, Projects, Lots, Designs, FloorplanSKU, ParametricOptions, BOM, Pricing, Schedule, ChangeOrders, Documents, Permits, Inspections, ManufacturingOrders, Shipments, SiteTasks, ProgressEvents, Payments, Draws, InvestorPositions, Distributions, AuditLog.

## Permission Model
- **Strict RBAC:** role-permission map with action checks.
- **Per-project access:** user-role assignment and project membership.
- **Entity scoping:** HoldCo can view all; OpCo/SPV limited to assigned projects.
- **Investor audit visibility:** read-only for key event logs and change history.

## Corporate Structure Support
- **Delaware C-Corp (HoldCo):** IP/governance and consolidated reporting.
- **Construction LLC (OpCo):** project execution and operating workflows.
- **Investor SPVs:** capital tracking per project/portfolio with draw/distribution visibility.

## Certainty Score
Computed from input completeness, county permitting baseline, and supply lead-time modifiers. Displayed as confidence indicator during configuration.

## Factory Interface
- Partner pull endpoint for manufacturing orders.
- Packet generation includes BOM CSV + JSON summary + text-based PDF summary placeholder + versioned changelog.

## Seed Data
- SKUs + base price anchors:
  - DPBL-25-69: ~$271k
  - DPBL-25-72: ~$344.5k
  - DPBL-25-57: ~$491.4k
  - DPBL-26-04: ~$402.6k
- Tier multipliers: Basic 1.00, Standard 1.08, Premium 1.18, Luxury 1.35.
- County permit mock references: GA (Fulton/Cobb), FL (Miami-Dade/Orange).

## Non-functional Controls
- Local-first run via docker-compose Postgres.
- Validation and rate limiting on API entry points.
- Audit log model present for immutable events.
- Unit tests cover pricing/timeline/RBAC.
- Clean architecture: domain services separated from API handlers.
