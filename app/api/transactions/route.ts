import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";
export async function GET() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { id: "desc" },
  });
  return NextResponse.json(transactions);
}

export async function POST(req: Request) {
  try {
    const { amount, type, category, description } = await req.json();
    if (!amount || !type || !category || !description)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const transaction = await prisma.transaction.create({
      data: { amount: parseFloat(amount), type, category, description },
    });
    return NextResponse.json(transaction);
  } catch (err) {
    return NextResponse.json({ error: "Invalid input" }, { status: 500 });
  }
}
