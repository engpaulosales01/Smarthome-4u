# SmartHome-4U Investor Demo

Next.js demo showing a deterministic homebuying flow from customer intent to investor reporting.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Data files

- Home model catalog: `data/catalog.json`
- Option tiers and smart packages: `data/options.json`
- Market multipliers and permitting inputs: `data/markets.json`

Update these JSON files to change recommendations, pricing, and timeline behavior.

## Pricing and recommendation assumptions

Core deterministic logic is implemented in `lib/engine.ts`:

- `getRecommendations(intent)` handles simulated AI recommendation ranking.
- `calculateScenario(model, selection, marketId)` computes total price, margin, delivery, and energy savings.
- `investorAssumptions(totalPriceUSD, salesPriceUSD)` computes dashboard metrics and 12-month cash flow.

All formulas are transparent and intended for demo use only.
