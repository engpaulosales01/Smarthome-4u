# Changelog

## 2026-03-11 — Fixes

- Removed stray JSX element `<import-placeholder />` from app/layout.tsx which caused a TypeScript build error.
- Fixed `zustand` import in `lib/store.ts` to use the named `create` export.
- Added a typed `Options` shape and removed `any` usages in `lib/engine.ts`; removed unused parameters.
- Ran `eslint --fix` and resolved remaining lint issues.
- Verified `next build` completes and the dev server runs at http://localhost:3000.
- Fix: demo store default `location` set to `atlanta` to match `data/markets.json` ids (prevents "Market not found").
- Fix: `getRecommendations` now normalizes the UI intent shape (`sustainabilityPriority` / `smartPriority`) to the internal `CustomerIntent` shape.

If you'd like, I can open a PR with these changes or add a brief entry to README.
