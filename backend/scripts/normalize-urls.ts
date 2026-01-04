import { PrismaClient } from '@prisma/client';
import { normalizeUrl } from '../src/utils/url';

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('Fetching products...');
    const products = await prisma.product.findMany();
    console.log(`Found ${products.length} products`);

    let updated = 0;
    let skipped = 0;

    for (const p of products) {
      const normalized = normalizeUrl(p.url);
      if (normalized === p.url) continue;

      // Check for existing product with normalized URL
      const existing = await prisma.product.findFirst({ where: { url: normalized } });
      if (existing) {
        console.warn(
          `Conflict: product ${p.id} -> normalized URL ${normalized} already exists on product ${existing.id}. Skipping to avoid merge.`,
        );
        skipped++;
        continue;
      }

      await prisma.product.update({ where: { id: p.id }, data: { url: normalized } });
      updated++;
      console.log(`Updated product ${p.id} -> ${normalized}`);
    }

    console.log(`Done. Updated: ${updated}, Skipped (conflicts): ${skipped}`);
  } catch (e) {
    console.error('Error normalizing URLs:', e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();