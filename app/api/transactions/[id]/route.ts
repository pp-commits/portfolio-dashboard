import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";
// GET /api/transactions/[id]
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const transaction = await prisma.transaction.findUnique({
    where: { id: Number(id) },
  });

  if (!transaction) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(transaction);
}

// PUT /api/transactions/[id]
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  const updated = await prisma.transaction.update({
    where: { id: Number(id) },
    data: body,
  });

  return NextResponse.json(updated);
}

// DELETE /api/transactions/[id]
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await prisma.transaction.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ message: "Deleted successfully" });
}
