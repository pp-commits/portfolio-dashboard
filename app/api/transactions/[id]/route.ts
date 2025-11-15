import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const transaction = await prisma.transaction.findUnique({
    where: { id: Number(params.id) },
  });
  if (!transaction)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(transaction);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updated = await prisma.transaction.update({
    where: { id: Number(params.id) },
    data: body,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await prisma.transaction.delete({
    where: { id: Number(params.id) },
  });
  return NextResponse.json({ message: "Deleted successfully" });
}
