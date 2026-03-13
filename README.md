# SmartHome-4U Platform MVP

We engineer certainty: AI-assisted configurable housing from design intent to fabrication packet, with transparent customer, investor, and operations dashboards.

## Stack
- Next.js 14 (App Router) + TypeScript + Tailwind
- Prisma + PostgreSQL
- NextAuth (credentials + magic link)
- Domain services for parametric design, pricing/timeline, RBAC, factory packets
- Vitest unit tests

## Local run
1. `cp .env.example .env`
2. `docker compose up -d`
3. `npm install`
4. `npx prisma generate && npx prisma migrate dev --name init && npm run prisma:seed`
5. `npm run dev`

## CI (simple)
- `npm ci`
- `npm run test`
- `npm run build`

## Lifecycle supported
Lead -> Configure -> Quote -> Contract -> Permit -> Fabricate -> Ship -> Assemble -> Commission -> Handover -> Warranty.

## Security
Input validation (zod), role checks (RBAC helpers), project/entity scoping, and basic in-memory rate limiting.
