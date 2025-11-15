
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const sample = [
    { symbol: "TCS.NS", name: "TCS", exchange: "NSE", purchasePrice: 3300, quantity: 2, sector: "Technology" },
    { symbol: "HDFCBANK.NS", name: "HDFC Bank", exchange: "NSE", purchasePrice: 1550, quantity: 5, sector: "Financials" },
    { symbol: "RELIANCE.NS", name: "Reliance", exchange: "NSE", purchasePrice: 2300, quantity: 1, sector: "Energy" },
  ];
  for (const h of sample) {
    await prisma.holding.create({ data: h });
  }
  console.log("Seed complete");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
