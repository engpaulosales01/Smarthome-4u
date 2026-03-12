import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const skus = [
    { code: 'DPBL-25-69', basePrice: 271000 },
    { code: 'DPBL-25-72', basePrice: 344500 },
    { code: 'DPBL-25-57', basePrice: 491400 },
    { code: 'DPBL-26-04', basePrice: 402600 },
  ];
  for (const sku of skus) {
    await prisma.floorplanSKU.upsert({ where: { code: sku.code }, update: sku, create: sku });
  }
  console.log('Seeded SKUs and baseline pricing/tier references (Basic 1.00, Standard 1.08, Premium 1.18, Luxury 1.35).');
}
main().finally(() => prisma.$disconnect());
