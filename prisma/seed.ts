import { PrismaClient } from "@prisma/client";
import products from "./products.json";

const db = new PrismaClient();

async function main() {
  for (const product of products) {
    await db.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }
  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
